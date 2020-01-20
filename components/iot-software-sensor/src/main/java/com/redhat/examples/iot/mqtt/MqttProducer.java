package com.redhat.examples.iot.mqtt;

import javax.annotation.PreDestroy;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MqttProducer {

	private MqttClient client;
	private MqttConnectOptions options;
	
	private final String brokerURL;
	private final String user;
	private final String password;
	private final String clientId;

	private static final int QOS = 1;
	
    private static final Logger log = LoggerFactory.getLogger(MqttProducer.class);

	public MqttProducer(String brokerURL, String user, String password, String clientId) {
	
		this.brokerURL = brokerURL;
		this.user = user;
		this.password = password;
		this.clientId = clientId;
		
	}
	
	public synchronized void connect() {
		
		if(client != null && client.isConnected()) {
			return;
		}
		
		try {
			client = new MqttClient(brokerURL, clientId);
			options = new MqttConnectOptions ();
			options.setUserName(user);
			options.setPassword(password.toCharArray());
			options.setAutomaticReconnect(true);
			options.setConnectionTimeout(0);
			log.info("MQTT Connect options");
			log.info(options.toString());
			client.connect(options);
		}catch(MqttException e) {
			log.error(e.getMessage(), e);
		}
		
	}
	
	public void run(String topic, String data) throws MqttPersistenceException, MqttException {
		System.out.println("sending data: "+data);
		MqttMessage message = new MqttMessage();
		message.setQos(QOS);
		
		message.setPayload(data.getBytes());
		System.out.println("Publish to topic: " + topic);
		client.publish(topic, message);
				
	}
	
	@PreDestroy
	public void close() throws MqttException{
		try { client.disconnect(); } catch(Exception e) {}
		try { client.close(); } catch(Exception e) {}
		
	}
}