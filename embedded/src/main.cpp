
#include <Arduino.h>
#include <HTTPClient.h>
#include <Preferences.h>
#include <WiFi.h>

#include <backend.hpp>
#include <card-reader.hpp>
#include <charge-states.hpp>
#include <charger-control.hpp>
#include <power-meter.hpp>
#include <wifi_connection.hpp>

#define WIFI_SSID "FreshR"
#define WIFI_PASS "Freshr4now"
#define SERVER_URL "http://192.168.21.103:3000"
#define SERVER_TOKEN "test"

#define PULSE_POWER_PIN 17
#define CHARGING_STATUS_PIN 27
#define RELAY_PIN 16

WiFiConnection wifiConnection(WIFI_SSID, WIFI_PASS);
Backend backend(SERVER_URL, SERVER_TOKEN);
Preferences preferences;
ChargerControl chargerControl(CHARGING_STATUS_PIN, RELAY_PIN);
CardReader cardReader;

static charge_state_t state = CHARGE_STATE_WAITING_FOR_CARD;
static uint32_t waitingForChargeStartTime = 0;
static String chargeSessionId = "";
static uint32_t chargeStartWh = 0;
static uint32_t chargeEndWh = 0;
static uint32_t lastLogTime = 0;
static uint32_t loggingInterval = 300000;  // 5 minutes

void setup() {
    power_meter_init(PULSE_POWER_PIN);
    chargerControl.begin();
    cardReader.begin();
    pinMode(PULSE_POWER_PIN, OUTPUT);  // TODO: This should be INPUT_PULLUP but for testing purposes it is OUTPUT

    preferences.begin("charge", false);

    Serial.begin(115200);
    Serial.println("PCNT initialized");

    Serial.println("WiFi connecting");
    wifiConnection.connect();
    while (!wifiConnection.isConnected()) {
        Serial.print(".");
        delay(1000);
    }
    Serial.println(" WiFi connected!");

    // Restore charge session
    chargeSessionId = preferences.getString("chargeSessionId", "");
    chargeStartWh = preferences.getUInt("chargeStartWh", 0);
    chargeEndWh = preferences.getUInt("chargeEndWh", 0);

    if (!chargeSessionId.isEmpty()) {
        if (chargeStartWh != 0) {
            state = CHARGE_STATE_STARTING_CHARGE;
        } else {
            if (chargeEndWh == 0)
                chargeEndWh = power_meter_get_wh();
            state = CHARGE_STATE_ENDING_CHARGE;
            loggingInterval = 300000;  // 5 minutes
        }
        Serial.printf("Restoring charge session: %s %u %u\n", chargeSessionId.c_str(), chargeStartWh, chargeEndWh);
    }

    Serial.println("Setup done");
    backend.sendLog(power_meter_get_wh(), chargeSessionId);
}

void loop() {
    switch (state) {
        case CHARGE_STATE_WAITING_FOR_CARD: {
            if (cardReader.isCardPresent()) {
                Serial.println("Card is detected");
                state = CHARGE_STATE_GOT_CARD;
                break;
            }
        } break;
        case CHARGE_STATE_GOT_CARD: {
            String cardSerial = cardReader.getCardSerial();
            if (cardSerial.isEmpty()) {
                state = CHARGE_STATE_WAITING_FOR_CARD;
                Serial.println("Unable to read card serial");
                break;
            }
            chargeSessionId = backend.requestChargeSession(cardSerial);
            if (!chargeSessionId.isEmpty()) {
                waitingForChargeStartTime = millis();
                state = CHARGE_STATE_WAITING_FOR_CHARGE;
                chargerControl.enableCharging();
                Serial.println("Enabled charging, waiting for car to start charging");
            }
        } break;
        case CHARGE_STATE_WAITING_FOR_CHARGE: {
            if (millis() - waitingForChargeStartTime > 30000) {
                Serial.println("Timeout waiting for charge");
                state = CHARGE_STATE_WAITING_FOR_CARD;
                chargerControl.disableCharging();
                break;
            }
            if (chargerControl.isCharging()) {
                chargeStartWh = power_meter_get_wh();
                preferences.putString("chargeSessionId", chargeSessionId);
                preferences.putUInt("chargeStartWh", chargeStartWh);
                loggingInterval = 30000;  // 30 seconds
                state = CHARGE_STATE_STARTING_CHARGE;
                Serial.println("Car started charging");
                break;
            }
        } break;
        case CHARGE_STATE_STARTING_CHARGE:
            if (backend.beginChargeSession(chargeSessionId, chargeStartWh)) {
                preferences.remove("chargeStartWh");
                chargeStartWh = 0;
                state = CHARGE_STATE_CHARGING;
                Serial.println("Charge session started");
                break;
            }
            break;
        case CHARGE_STATE_CHARGING: {
            if (!chargerControl.isCharging()) {
                state = CHARGE_STATE_ENDING_CHARGE;
                loggingInterval = 300000;  // 5 minutes
                chargeEndWh = power_meter_get_wh();
                preferences.putUInt("chargeEndWh", chargeEndWh);
                chargerControl.disableCharging();
                Serial.println("Car stopped charging");
                break;
            }
        } break;
        case CHARGE_STATE_ENDING_CHARGE: {
            if (backend.endChargeSession(chargeSessionId, chargeEndWh)) {
                preferences.remove("chargeSessionId");
                preferences.remove("chargeEndWh");
                chargeEndWh = 0;
                chargeSessionId = "";
                Serial.println("Charge session ended");
                state = CHARGE_STATE_WAITING_FOR_CARD;
                break;
            }
        } break;
    }
    if (millis() - lastLogTime > loggingInterval) {
        backend.sendLog(power_meter_get_wh(), chargeSessionId);
        lastLogTime = millis();
    }
    delay(20);
    digitalWrite(PULSE_POWER_PIN, !digitalRead(PULSE_POWER_PIN));  // TODO: Remove this line, it is for testing purposes
}