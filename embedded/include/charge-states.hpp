#pragma once

typedef enum {
	CHARGE_STATE_WAITING_FOR_CARD,
	CHARGE_STATE_GOT_CARD,
	CHARGE_STATE_WAITING_FOR_CHARGE,
	CHARGE_STATE_STARTING_CHARGE,
	CHARGE_STATE_CHARGING,
	CHARGE_STATE_ENDING_CHARGE,
} charge_state_t;
