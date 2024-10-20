#pragma once

#include <Arduino.h>


class WiFiConnection
{
	public:
	WiFiConnection(const char* ssid, const char* password);
	void connect();
	void disconnect();
	void reconnect();
	bool isConnected();


	private:
	const char* _ssid;
	const char* _password;
	uint32_t _previousWifiReconnect;
	static constexpr uint32_t _wifiReconnectTimeout = 30000U;
};

