#pragma once

#include <Arduino.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

class Backend {
   public:
    Backend(const String &url, const String &token, const char *root_ca = nullptr);


    void begin();
    bool sendLog(uint32_t wh, const String &sessionId = "");
    String requestChargeSession(const String &cardSerial);
    bool beginChargeSession(const String &sessionId, uint32_t wh);
    bool endChargeSession(const String &sessionId, uint32_t wh);

   private:
    WiFiClientSecure _client;
    HTTPClient _http;
    const String _url;
    const String _token;
    const char *_root_ca;
    uint32_t _rateLimitLastRequestTime = 0;
    static const uint32_t _rateLimitInterval = 1000;
};
