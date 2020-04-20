package com.redhat.manuela;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import com.redhat.manuela.model.Measure;
import com.redhat.manuela.sensor.GpsSensor;
import com.redhat.manuela.sensor.LightSensor;
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

    @ConfigProperty(name = "mqtt.protocol")
    String mqtt_protocol;

    @ConfigProperty(name = "mqtt.temperature.topic")
    String mqtt_temperature_topic;

    @ConfigProperty(name = "mqtt.vibration.topic")
    String mqtt_vibration_topic;

    @ConfigProperty(name = "mqtt.gps.topic")
    String mqtt_gps_topic;

    @ConfigProperty(name = "mqtt.light.topic")
    String mqtt_light_topic;

    @Inject
    TemperatureSensor temperatureSensor;

    @Inject
    VibrationSensor vibrationSensor;

    @Inject
    GpsSensor gpsSensor;

    @Inject
    LightSensor lightSensor;

    @Override
    public void configure() throws Exception { 
        
        if(temperatureSensor.isEnabled()) {
            fromF("timer:temperatureSensorHeartbeat?period=%s", temperatureSensor.getFrequency())
                .process(createTemperaturePayload)
                .toF("paho:%s?brokerUrl=%s://%s:%s",mqtt_temperature_topic,mqtt_protocol,mqtt_host,mqtt_port);
        }

        if(vibrationSensor.isEnabled()) {
            fromF("timer:vibrationSensorHeartbeat?period=%s", vibrationSensor.getFrequency())
                .process(createVibrationPayload)
                .toF("paho:%s?brokerUrl=%s://%s:%s",mqtt_vibration_topic,mqtt_protocol,mqtt_host,mqtt_port);
        }

        if(gpsSensor.isEnabled()) {
            fromF("timer:gpsSensorHeartbeat?period=%s", gpsSensor.getFrequency())
                .process(createGpsPayload)
                .toF("paho:%s?brokerUrl=%s://%s:%s",mqtt_gps_topic,mqtt_protocol,mqtt_host,mqtt_port);
        }

        if(lightSensor.isEnabled()) {
            fromF("timer:lightSensorHeartbeat?period=%s", lightSensor.getFrequency())
                .process(createLightPayload)
                .toF("paho:%s?brokerUrl=%s://%s:%s",mqtt_light_topic,mqtt_protocol,mqtt_host,mqtt_port);
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

    private final Processor createGpsPayload = new Processor() {
        @Override
        public void process(final Exchange exchange) throws Exception {
            final Message msg = exchange.getIn();
            ZonedDateTime utc = ZonedDateTime.now(ZoneOffset.UTC);
		    Measure measure = new Measure(machineId, deviceId, String.valueOf(utc.toInstant().toEpochMilli()));
		    gpsSensor.calculateCurrentMeasure(measure);
		    log.info("Current GPS Measure " + measure.getPayload());
            msg.setBody(measure.getCSVData(), String.class);
            exchange.setMessage(msg);
        }
    };

    private final Processor createLightPayload = new Processor() {
        @Override
        public void process(final Exchange exchange) throws Exception {
            final Message msg = exchange.getIn();
            ZonedDateTime utc = ZonedDateTime.now(ZoneOffset.UTC);
		    Measure measure = new Measure(machineId, deviceId, String.valueOf(utc.toInstant().toEpochMilli()));
		    lightSensor.calculateCurrentMeasure(measure);
		    log.info("Current Light Measure " + measure.getPayload());
            msg.setBody(measure.getCSVData(), String.class);
            exchange.setMessage(msg);
        }
    };

}