#include "backend.hpp"

#include <ArduinoJson.h>

Backend::Backend(const String &url, const String &token) : _url(url), _token(token) {
    _rateLimitLastRequestTime = millis() - _rateLimitInterval;
}

bool Backend::sendLog(uint32_t wh, const String &sessionId) {
    if (millis() - _rateLimitLastRequestTime < _rateLimitInterval) {
        return false;
    }

    Serial.printf("Sending log: %u %s\n", wh, sessionId.c_str());

    _http.begin(_url + "/log");
    _http.addHeader("authentication", _token);
    _http.addHeader("Content-Type", "application/json");

    JsonDocument doc;
    doc["wh"] = wh;
    if (!sessionId.isEmpty())
        doc["chargeSessionId"] = sessionId;

    String json;
    serializeJson(doc, json);

    int httpCode = _http.POST(json);
    _rateLimitLastRequestTime = millis();

    if (httpCode != 201) {
        Serial.println("Failed to send log: reponse code " + String(httpCode) + " " + _http.getString());
        _http.end();
        return false;
    }
    _http.end();

    return true;
}

String Backend::requestChargeSession(const String &cardSerial) {
    if (millis() - _rateLimitLastRequestTime < _rateLimitInterval) {
        return "";
    }

    Serial.printf("Requesting charge session: %s\n", cardSerial.c_str());

    _http.begin(_url + "/charge-sessions/create");
    _http.addHeader("authentication", _token);
    _http.addHeader("Content-Type", "application/json");

    JsonDocument doc;
    doc["cardSerial"] = cardSerial;

    String json;
    serializeJson(doc, json);

    int httpCode = _http.POST(json);
    _rateLimitLastRequestTime = millis();
    if (httpCode != 201) {
        Serial.println("Failed to request charge session: reponse code " + String(httpCode) + " " + _http.getString());
        _http.end();
        return "";
    }

    String response = _http.getString();
    _http.end();
    return response;
}

bool Backend::beginChargeSession(const String &sessionId, uint32_t wh) {
    if (millis() - _rateLimitLastRequestTime < _rateLimitInterval) {
        return false;
    }

    Serial.printf("Begin charge session: %s %u\n", sessionId.c_str(), wh);

    _http.begin(_url + String("/charge-sessions/begin/") + sessionId);
    _http.addHeader("authentication", _token);
    _http.addHeader("Content-Type", "application/json");

    JsonDocument doc;
    doc["wh"] = wh;

    String json;
    serializeJson(doc, json);

    int httpCode = _http.POST(json);
    _rateLimitLastRequestTime = millis();

    if (httpCode != 201) {
        Serial.println("Failed to begin charge session: reponse code " + String(httpCode) + " " + _http.getString());
        _http.end();
        return false;
    }
    _http.end();
    return true;
}

bool Backend::endChargeSession(const String &sessionId, uint32_t wh) {
    if (millis() - _rateLimitLastRequestTime < _rateLimitInterval) {
        return false;
    }

    Serial.printf("Ending charge session: %s %u\n", sessionId.c_str(), wh);

    _http.begin(_url + String("/charge-sessions/end/") + sessionId);
    _http.addHeader("authentication", _token);
    _http.addHeader("Content-Type", "application/json");

    JsonDocument doc;
    doc["wh"] = wh;

    String json;
    serializeJson(doc, json);

    int httpCode = _http.POST(json);
    _rateLimitLastRequestTime = millis();

    if (httpCode != 201) {
        Serial.println("Failed to end charge session: reponse code " + String(httpCode) + " " + _http.getString());
        _http.end();
        return false;
    }
    _http.end();
    return true;
}
