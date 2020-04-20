package com.redhat.manuela;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import com.redhat.manuela.model.Measure;
import com.redhat.manuela.sensor.TemperatureSensor;
import com.redhat.manuela.sensor.VibrationSensor;

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

    @ConfigProperty(name = "mqtt.vibration.topic")
    String mqtt_vibration_topic;

    @Inject
    TemperatureSensor temperatureSensor;

    @Inject
    VibrationSensor vibrationSensor;

    @Override
    public void configure() throws Exception { 
        
        if(temperatureSensor.isEnabled()) {
            fromF("timer:temperatureSensorHeartbeat?period=%s", temperatureSensor.getFrequency())
                .process(createTemperaturePayload)
                .toF("paho:%s?brokerUrl=ws://%s:%s",mqtt_temperature_topic,mqtt_host,mqtt_port);
        }

        if(vibrationSensor.isEnabled()) {
            fromF("timer:vibrationSensorHeartbeat?period=%s", vibrationSensor.getFrequency())
                .process(createVibrationPayload)
                .toF("paho:%s?brokerUrl=ws://%s:%s",mqtt_vibration_topic,mqtt_host,mqtt_port);
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
    
    private final Processor createVibrationPayload = new Processor() {
        @Override
        public void process(final Exchange exchange) throws Exception {
            final Message msg = exchange.getIn();
            ZonedDateTime utc = ZonedDateTime.now(ZoneOffset.UTC);
		    Measure measure = new Measure(machineId, deviceId, String.valueOf(utc.toInstant().toEpochMilli()));
		    vibrationSensor.calculateCurrentMeasure(measure);
		    log.info("Current Vibration Measure " + measure.getPayload());
            msg.setBody(measure.getCSVData(), String.class);
            exchange.setMessage(msg);
        }
    };

}