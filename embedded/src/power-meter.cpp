#include "power-meter.hpp"
#include "driver/pcnt.h"
#include <freertos/queue.h>
#include <freertos/task.h>

#include <Preferences.h>
#include <Arduino.h>

static QueueHandle_t pcnt_queue = NULL;
static SemaphoreHandle_t power_meter_mutex = NULL;
static TaskHandle_t power_meter_task_handle;

static uint32_t kwh = 0;
static Preferences preferences;

static void pcnt_interrupt(void *arg) {
    uint32_t status;
    pcnt_get_event_status(PCNT_UNIT_0, &status);

    if (status & PCNT_EVT_H_LIM)
	{
		pcnt_evt_type_t evt = PCNT_EVT_H_LIM;
		xQueueSendFromISR(pcnt_queue, &evt, NULL);
	}
}

static void power_meter_task(void *arg) {
	pcnt_evt_type_t evt;
	while (1) {
		if (xQueueReceive(pcnt_queue, &evt, portMAX_DELAY)) {
			if (evt == PCNT_EVT_H_LIM) {
				xSemaphoreTake(power_meter_mutex, portMAX_DELAY);
				kwh++;
				preferences.putUInt("kwh", kwh);
				xSemaphoreGive(power_meter_mutex);
				Serial.printf("kWh counter increased to %u\n", kwh);
			}
		}
	}
}



void power_meter_init(int pin) {
	  pcnt_config_t pcnt_config = {
        // Set PCNT input signal and control GPIOs
        .pulse_gpio_num = pin,
        .ctrl_gpio_num = -1,
        .lctrl_mode = PCNT_MODE_KEEP,
        .hctrl_mode = PCNT_MODE_KEEP,
        .pos_mode = PCNT_COUNT_INC,
        .neg_mode = PCNT_COUNT_DIS,
        .counter_h_lim = 999,
        .counter_l_lim = 0,
        .unit = PCNT_UNIT_0,
        .channel = PCNT_CHANNEL_0,
    };

    ESP_ERROR_CHECK(pcnt_unit_config(&pcnt_config));
    
	//TODO: Add PCNT filter

    ESP_ERROR_CHECK(pcnt_event_enable(PCNT_UNIT_0, PCNT_EVT_H_LIM));

    ESP_ERROR_CHECK(pcnt_counter_pause(PCNT_UNIT_0));
    ESP_ERROR_CHECK(pcnt_counter_clear(PCNT_UNIT_0));

    ESP_ERROR_CHECK(pcnt_isr_service_install(0));
    ESP_ERROR_CHECK(pcnt_isr_handler_add(PCNT_UNIT_0, pcnt_interrupt, NULL));

	if (!preferences.begin("power_meter")) {
		preferences.clear();
		preferences.begin("power_meter");
	}
	kwh = preferences.getUInt("kwh", 0);
	pcnt_queue = xQueueCreate(10, sizeof(pcnt_evt_type_t));
	power_meter_mutex = xSemaphoreCreateMutex();
	xTaskCreatePinnedToCore(power_meter_task, "power_meter_task", 4096, NULL, 5, &power_meter_task_handle, 1);

    ESP_ERROR_CHECK(pcnt_intr_enable(PCNT_UNIT_0));
    ESP_ERROR_CHECK(pcnt_counter_resume(PCNT_UNIT_0));
}

uint32_t power_meter_get_kwh() {
	uint32_t ret;

	xSemaphoreTake(power_meter_mutex, portMAX_DELAY);
	ret = kwh;
	xSemaphoreGive(power_meter_mutex);
	return ret;
}

uint32_t power_meter_get_wh() {
	int16_t counter;

	xSemaphoreTake(power_meter_mutex, portMAX_DELAY);
	pcnt_get_counter_value(PCNT_UNIT_0, &counter);
	xSemaphoreGive(power_meter_mutex);
	return kwh * 1000 + counter;
}

void power_meter_reset_kwh() {
	xSemaphoreTake(power_meter_mutex, portMAX_DELAY);
	kwh = 0;
	preferences.putUInt("kwh", kwh);
	xSemaphoreGive(power_meter_mutex);
}
