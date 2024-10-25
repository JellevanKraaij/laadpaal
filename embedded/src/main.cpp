
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
#include <secrets.hpp>

#define WIFI_SSID "FreshR"
#define WIFI_PASS "Freshr4now"
#define SERVER_URL "https://laadpaal.jellevankraaij.nl/api"

#ifndef TOKEN
#define SERVER_TOKEN "test"
#else
#define SERVER_TOKEN TOKEN
#endif

static const char *root_ca = \
"-----BEGIN CERTIFICATE-----\n" \
"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\n" \
"-----END CERTIFICATE-----\n";

#define PULSE_POWER_PIN 17
#define CHARGING_STATUS_PIN 27
#define RELAY_PIN 16
#define CARD_READER_SS_PIN 22

WiFiConnection wifiConnection(WIFI_SSID, WIFI_PASS);
Backend backend(SERVER_URL, SERVER_TOKEN, root_ca);
Preferences preferences;
ChargerControl chargerControl(CHARGING_STATUS_PIN, RELAY_PIN);
CardReader cardReader(CARD_READER_SS_PIN);

static charge_state_t state = CHARGE_STATE_WAITING_FOR_CARD;
static uint32_t waitingForChargeStartTime = 0;
static String chargeSessionId = "";
static uint32_t chargeStartWh = 0;
static uint32_t chargeEndWh = 0;
static uint32_t lastLogTime = 0;
static uint32_t loggingInterval = 300000;  // 5 minutes

void setup() {
    power_meter_init(PULSE_POWER_PIN);
    Serial.begin(115200);
    Serial.println("PCNT initialized");

    cardReader.begin();
    chargerControl.begin();
    pinMode(PULSE_POWER_PIN, OUTPUT);  // TODO: This should be INPUT_PULLUP but for testing purposes it is OUTPUT
    preferences.begin("charge", false);

    Serial.println("WiFi connecting");
    wifiConnection.connect();
    while (!wifiConnection.isConnected()) {
        Serial.print(".");
        delay(1000);
    }
    Serial.println(" WiFi connected!");

    backend.begin();

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