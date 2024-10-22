#include "card-reader.hpp"

#include <Arduino.h>
#include <Adafruit_PN532.h>

CardReader::CardReader(uint32_t ss) : nfc(18, 19, &Wire) {

}

void CardReader::begin() {
	nfc.begin();
	uint32_t versiondata = nfc.getFirmwareVersion();
	if (!versiondata) {
		Serial.println("Didn't find PN53x board");
		return;
	}
	Serial.println("Found chip PN5");
}

bool CardReader::isCardPresent() {
	uint8_t uid[] = {0, 0, 0, 0, 0, 0, 0};
	uint8_t uidLength = 0;
	
	bool ret = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 100);
	return ret && uidLength > 0;
}

String CardReader::getCardSerial() {
	uint8_t uid[] = {0, 0, 0, 0, 0, 0, 0};
	uint8_t uidLength = 0;
	if (!nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 100)) {
		return "";
	}
	String cardSerial = "";
	for (uint8_t i = 0; i < uidLength; i++) {
		cardSerial += String(uid[i], HEX);
	}
	return cardSerial;
}
