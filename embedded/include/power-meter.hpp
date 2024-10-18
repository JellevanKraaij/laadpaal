#pragma once

#include "stdint.h"

void power_meter_init(int pin);
uint32_t power_meter_get_kwh();
uint32_t power_meter_get_wh();
void power_meter_reset_kwh();
