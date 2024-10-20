#pragma once

#include <Arduino.h>
#include <HTTPClient.h>

class Backend {
   public:
    Backend(const String &url, const String &token);

    bool sendLog(uint32_t wh, const String &sessionId = "");
    String requestChargeSession(const String &cardSerial);
    bool beginChargeSession(const String &sessionId, uint32_t wh);
    bool endChargeSession(const String &sessionId, uint32_t wh);

   private:
    HTTPClient _http;
    const String _url;
    const String _token;
    uint32_t _rateLimitLastRequestTime = 0;
    static const uint32_t _rateLimitInterval = 1000;
};
