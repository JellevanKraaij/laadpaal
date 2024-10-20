#pragma once

#include <stdint.h>



class ChargerControl {
public:
	ChargerControl(uint32_t chargeStatePin, uint32_t relayPin);
	void begin();
	bool isCharging();
	void enableCharging();
	void disableCharging();
private:
	const uint32_t _chargeStatePin;
	const uint32_t _relayPin;
};
