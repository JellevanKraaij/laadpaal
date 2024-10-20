#pragma once

#include <Arduino.h>

class CardReader {
   public:
    CardReader();
    void begin();
    bool isCardPresent();
    String getCardSerial();

   private:
};