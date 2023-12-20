package com.redhat.manuela.routes;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.kafka.KafkaConstants;
import org.apache.camel.model.OnCompletionDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class MQTT2KafkaRoute extends RouteBuilder {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(MQTT2KafkaRoute.class);
	
	@Override
	public void configure() throws Exception {
		storeTemperatureInKafka();
		storeVibrationInKafka();
		// readTemperatureFromKafka();
		// readVibrationFromKafka();
	}

	private void storeTemperatureInKafka() {
		from("paho:{{mqtt.broker.topic.temperature}}?brokerUrl={{mqtt.broker.uri}}&clientId={{mqtt.broker.clientId}}-temp")
			.log("Reading message form MQTT: ${body}")
			// .setHeader(KafkaConstants.KEY, constant("sensor-temp"))
			.to("kafka:{{kafka.broker.topic.temperature}}?brokers={{kafka.broker.uri}}")
			.log("sent message: ${headers[org.apache.kafka.clients.producer.RecordMetadata]}");
	}

	private void storeVibrationInKafka() {
		from("paho:{{mqtt.broker.topic.vibration}}?brokerUrl={{mqtt.broker.uri}}&clientId={{mqtt.broker.clientId}}-vibr")
			.log("Reading message form MQTT: ${body}")
			// .setHeader(KafkaConstants.KEY, constant("sensor-temp"))
			.to("kafka:{{kafka.broker.topic.vibration}}?brokers={{kafka.broker.uri}}")
			.log("sent message: ${headers[org.apache.kafka.clients.producer.RecordMetadata]}");
	}

	private void readTemperatureFromKafka() {
		from("kafka:{{kafka.broker.topic.temperature}}?brokers={{kafka.broker.uri}}")
			.log("Reading message from Kafka: ${body}")
			.log("    on the topic ${headers[kafka.TOPIC]}")
    		.log("    on the partition ${headers[kafka.PARTITION]}")
    		.log("    with the offset ${headers[kafka.OFFSET]}")
		    .log("    with the key ${headers[kafka.KEY]}");
	}

	private void readVibrationFromKafka() {
		from("kafka:{{kafka.broker.topic.vibration}}?brokers={{kafka.broker.uri}}")
			.log("Reading message from Kafka: ${body}")
			.log("    on the topic ${headers[kafka.TOPIC]}")
    		.log("    on the partition ${headers[kafka.PARTITION]}")
    		.log("    with the offset ${headers[kafka.OFFSET]}")
		    .log("    with the key ${headers[kafka.KEY]}");
	}

	@Override
	public OnCompletionDefinition onCompletion() {
		return super.onCompletion();
	}
}
