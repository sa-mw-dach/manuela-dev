package com.redhat.manuela;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class SensorRoute extends RouteBuilder{

    @ConfigProperty(name = "machine.id")
    String machineId;

    @ConfigProperty(name = "device.id")
    String deviceId;

    @ConfigProperty(name = "mqtt.host")
    String mqtt_host;

    @ConfigProperty(name = "mqtt.port")
    String mqtt_port;

    @ConfigProperty(name = "mqtt.temperature.topic")
    String mqtt_temperature_topic;

    @Inject
    TemperatureSensor temperatureSensor;

    @Override
    public void configure() throws Exception { 
        
        if(temperatureSensor.isEnabled()) {
            fromF("timer:temperatureSensorHeartbeat?period=%s", temperatureSensor.getFrequency())
                .process(createTemperaturePayload)
                .toF("paho:%s?brokerUrl=ws://%s:%s",mqtt_temperature_topic,mqtt_host,mqtt_port);
        }
        
    }

    
    private final Processor createTemperaturePayload = new Processor() {
        @Override
        public void process(final Exchange exchange) throws Exception {
            final Message msg = exchange.getIn();
            ZonedDateTime utc = ZonedDateTime.now(ZoneOffset.UTC);
		    Measure measure = new Measure(machineId, deviceId, String.valueOf(utc.toInstant().toEpochMilli()));
		    temperatureSensor.calculateCurrentMeasure(measure);
		    log.info("Current Temperature Measure " + measure.getPayload());
            msg.setBody(measure.getCSVData(), String.class);
            exchange.setMessage(msg);
        }
    };  

}