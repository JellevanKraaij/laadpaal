#include "wifi_connection.hpp"

#include <WiFi.h>

#include <functional>

static void wifi_reconnect(WiFiEvent_t event, WiFiEventInfo_t info) {
    Serial.println("WiFi disconnected");
    WiFi.reconnect();
}

WiFiConnection::WiFiConnection(const char* ssid, const char* password)
    : _ssid(ssid), _password(password), _previousWifiReconnect(0) {
        WiFi.onEvent(wifi_reconnect, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
    }

void WiFiConnection::connect() {
    Serial.println("Connecting to WiFi");
    WiFi.begin(_ssid, _password);
}

void WiFiConnection::disconnect() {
    Serial.println("Disconnecting from WiFi");
    WiFi.disconnect();
}

void WiFiConnection::reconnect() {
    if (millis() - _previousWifiReconnect < _wifiReconnectTimeout)
        return;

    Serial.println("Reconnecting to WiFi");
    _previousWifiReconnect = millis();
    disconnect();
    connect();
}

bool WiFiConnection::isConnected() {
    if (WiFi.isConnected()) {
        return true;
    }
    return false;
}
