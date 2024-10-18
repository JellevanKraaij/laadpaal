
#include <Arduino.h>
#include <Preferences.h>
#include <WiFi.h>
#include <HTTPClient.h>

#include <power-meter.hpp>

#define WIFI_SSID "FreshR"
#define WIFI_PASS "Freshr4now"

#define PULSE_POWER_PIN 17
#define RELAY_PIN 16

String allowed_cards = "";

uint32_t send_millis_prev = 0;
uint32_t connection_millis_prev = 0;

void wifi_reconnect(WiFiEvent_t event) {
    Serial.println("WiFi lost connection, reconnecting...");
    WiFi.begin(WIFI_SSID, WIFI_PASS);
}

String uid_to_string(byte *uid, byte uidLength) {
    String uid_string = "";
    for (byte i = 0; i < uidLength; i++) {
        uid_string += String(uid[i], HEX);
    }
    return uid_string;
}

void setup() {
    power_meter_init(PULSE_POWER_PIN);
    // pinMode(PULSE_POWER_PIN, INPUT_PULLUP);
    pinMode(PULSE_POWER_PIN, OUTPUT);
    pinMode(GPIO_NUM_0, INPUT);

    pinMode(RELAY_PIN, OUTPUT);

    Serial.begin(115200);
    Serial.println("PCNT initialized");

    WiFi.onEvent(wifi_reconnect, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
    WiFi.begin(WIFI_SSID, WIFI_PASS);

    Serial.println("WiFi connecting...");
}


void send_wh() {
    Serial.println("Sending request");

    HTTPClient http;
    http.begin("http://laadpaal.jellevankraaij.nl:6790/api");
    http.addHeader("Content-Type", "application/json");
    int response = http.POST("{\"wh\": " + String(power_meter_get_wh()) + "}");
    if (response == 200) {
        Serial.println("Success");
        String payload = http.getString();
        Serial.println(payload);
        connection_millis_prev = millis();
        allowed_cards = payload;
    } else {
        Serial.println("Failed");
    }
    http.end();
}

bool send_start_charge(const String &card) {
    bool success = false;
    Serial.println("Sending start charge request");

    HTTPClient http;
    http.begin("http://laadpaal.jellevankraaij.nl:6790/api");
    http.addHeader("Content-Type", "application/json");
    String payload = "{\"state\": \"start\", \"wh\": " + String(power_meter_get_wh()) + ", \"card\": \"" + card + "\"}";
    Serial.println(payload);
    int response = http.POST(payload);
    if (response == 200) {
        Serial.println("Success");
        String payload = http.getString();
        Serial.println(payload);
        connection_millis_prev = millis();
        success = true;
    } else {
        Serial.println("Failed");
    }
    http.end();
    return success;
}

void loop() {
    uint32_t millis_now;
    digitalWrite(PULSE_POWER_PIN, !digitalRead(PULSE_POWER_PIN));
    delay(1);

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi not connected");
        delay(1000);
        return;
    }

    if (digitalRead(GPIO_NUM_0) == LOW) {
        millis_now = millis();
        if (millis_now - connection_millis_prev <= 60000) {
            connection_millis_prev = millis_now;
            if (allowed_cards.indexOf("12-34-56-78") != -1) {
                Serial.println("Card allowed");
                if (send_start_charge("12-34-56-78"))
                    digitalWrite(RELAY_PIN, HIGH);
            }
            else
                Serial.println("Card not allowed");
        }

    }

    millis_now = millis();
    if (millis_now - send_millis_prev >= 10000) {
        send_millis_prev = millis_now;
        uint32_t wh = power_meter_get_wh();
        Serial.printf("Wh: %u\n", wh);
        Serial.println("Sending request");
        send_wh();
    }
}