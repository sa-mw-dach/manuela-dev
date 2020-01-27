package com.redhat.examples.iot.mqtt;

import javax.annotation.PreDestroy;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MqttProducer implements MqttCallback {

	private MqttClient client;
	private MqttConnectOptions options;

	private final String brokerURL;
	private final String user;
	private final String password;
	private final String clientId;

	private static final int QOS = 1;

	private static final Logger log = LoggerFactory.getLogger(MqttProducer.class);

	public MqttProducer(final String brokerURL, final String user, final String password, final String clientId) {

		this.brokerURL = brokerURL;
		this.user = user;
		this.password = password;
		this.clientId = clientId;

	}

	public synchronized void connect() {

		if (client != null && client.isConnected()) {
			return;
		}

		try {
			client = new MqttClient(brokerURL, clientId);
			options = new MqttConnectOptions();
			options.setUserName(user);
			options.setPassword(password.toCharArray());
			options.setAutomaticReconnect(true);
			options.setConnectionTimeout(30);
			options.setKeepAliveInterval(60);
			options.setCleanSession(true);
			log.info("MQTT Connect options");
			log.info(options.toString());
			client.setCallback(this);
			client.connect(options);
		} catch (final MqttException e) {
			log.error(e.getMessage(), e);
			try {
				Thread.sleep(3000);
			} catch (final InterruptedException e1) {
				e1.printStackTrace();
			}
			this.connect();
		}

	}

	@Override
	public void connectionLost(final Throwable t) {
		System.out.println("Connection lost!");
	}

	@Override
	public void deliveryComplete(final IMqttDeliveryToken token) {
		try {
			System.out.println("Pub complete" + new String(token.getMessage().getPayload()));
		} catch (final Exception e) {
			// TODO: handle exception
		}
	}

	@Override
	public void messageArrived(final String topic, final MqttMessage message) throws Exception {

		System.out.println("-------------------------------------------------");
		System.out.println("| Topic:" + topic);
		System.out.println("| Message: " + new String(message.getPayload()));
		System.out.println("-------------------------------------------------");
	}

	public boolean isConnected() {
		return (client != null && client.isConnected());
	}

	public void run(final String topic, final String data) throws MqttPersistenceException, MqttException {
		System.out.println("sending data: " + data);
		final MqttMessage message = new MqttMessage();
		message.setQos(QOS);

		message.setPayload(data.getBytes());
		System.out.println("Publish to topic: " + topic);
		client.publish(topic, message);

	}

	@PreDestroy
	public void close() throws MqttException {
		try {
			client.disconnect();
		} catch (final Exception e) {
		}
		try {
			client.close();
		} catch (final Exception e) {
		}
		
	}
}