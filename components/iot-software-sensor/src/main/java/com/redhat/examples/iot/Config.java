package com.redhat.examples.iot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.redhat.examples.iot.mqtt.MqttProducer;

@Configuration
public class Config {
	
	@Value("${mqtt.username}")
	private String mqttUsername;
	
	@Value("${mqtt.password}")
	private String mqttPassword;
		
	@Value("${mqtt.port}")
	private String mqttServicePort;
	
	@Value("${mqtt.service}")
	private String mqttServiceName;
	
	@Value("${mqtt.tls}")
	private boolean mqttTLS;

	@Value("${device.id}")
	private String deviceId;

	@Value("${machine.id}")
	private String machineId;
	
	@Value("${app.name}")
	private String appName;
		
	@Bean
	public MqttProducer mqttProducer() {
		String scheme = mqttTLS ? "wss" : "ws";
		String brokerURL = String.format("%s://%s:%s", scheme, mqttServiceName, mqttServicePort);

		return new MqttProducer(brokerURL, mqttUsername, mqttPassword, machineId+'-'+deviceId);
	}
	
	public String getDeviceId() {
		return deviceId;
	}

	public String getMachineId() {
		return machineId;
	}
	
	public String getAppName() {
		return appName;
	}

}
