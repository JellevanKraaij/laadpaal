#include "charger-control.hpp"

#include <Arduino.h>

ChargerControl::ChargerControl(uint32_t chargeStatePin, uint32_t relayPin) : _chargeStatePin(chargeStatePin), _relayPin(relayPin) {}

void ChargerControl::begin() {
	pinMode(_chargeStatePin, INPUT_PULLUP);
	pinMode(_relayPin, OUTPUT);
	disableCharging();
}

bool ChargerControl::isCharging() {
	return digitalRead(_chargeStatePin) == LOW; //TODO: should be LOW, but for testing purposes it is HIGH
}

void ChargerControl::enableCharging() {
	digitalWrite(_relayPin, HIGH);
}

void ChargerControl::disableCharging() {
	digitalWrite(_relayPin, LOW);
}
