#pragma once

#include <Arduino.h>
#include <Adafruit_PN532.h>

class CardReader {
   public:
    CardReader(uint32_t ss);
    void begin();
    bool isCardPresent();
    String getCardSerial();

   private:
      Adafruit_PN532 nfc;
};