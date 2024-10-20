#include "card-reader.hpp"

CardReader::CardReader() {}

void CardReader::begin() {
	// Initialize card reader
	pinMode(25, INPUT_PULLUP);
}

bool CardReader::isCardPresent() {
	// Check if card is present
	return digitalRead(25) == LOW;
}

String CardReader::getCardSerial() {
	// Get card serial
	if (!isCardPresent()) {
		return "";
	}
	return "test-card";
}
