package com.redhat.manuela.sensor;

import java.util.concurrent.ThreadLocalRandom;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;

import com.redhat.manuela.model.Measure;

import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class VibrationSensor implements Sensor {

    @ConfigProperty(name = "sensor.vibration.enabled")
	boolean enabled;
	
	@ConfigProperty(name = "sensor.vibration.frequency")
	int frequency;
		
	@ConfigProperty(name = "sensor.vibration.start") 
	int start;
	
	@ConfigProperty(name = "sensor.vibration.maxIteration") 
	int maxIteration;
	
	@ConfigProperty(name = "sensor.vibration.minIteration") 
	int minIteration;
	
	@ConfigProperty(name = "sensor.vibration.minRange") 
	int minRange;

	@ConfigProperty(name = "sensor.vibration.maxRange") 
	int maxRange;

	@ConfigProperty(name = "sensor.vibration.peakInterval") 
	int peakInterval;
	
	private double currentValue;
	private double sumitValue;
	
	private int count = 1;
	private int direction = 1;
	
	@PostConstruct
	@Override
	public void initAndReset() {
		currentValue = start;
	}
	
	@Override
	public int getFrequency() {
		return frequency;
	}

	@Override
	public boolean isEnabled() {
		return enabled;
	}

	@Override
	public Measure calculateCurrentMeasure(Measure measure) {
	
	/*
		if(count > 0) {
			// Calculate random value from range
			double randValue = ThreadLocalRandom.current().nextDouble(minIteration, (maxIteration+1));
			currentValue = currentValue + randValue;
			
			if(currentValue < minRange || currentValue > maxRange) {
				initAndReset();
			}
		}
	*/
	
		double randValue = ThreadLocalRandom.current().nextDouble(minIteration, (maxIteration+1));

		if(currentValue > maxRange) {
			direction = -1;
        }
        
		if(currentValue < minRange) {
			direction = 1;
		}

		currentValue = currentValue + randValue * direction;

		if( (count % peakInterval) == 0) {
			sumitValue = currentValue * 2.5;
		} else {
			sumitValue = currentValue;
		}

		measure.setPayload(String.valueOf(sumitValue));
		
		++count;
		return measure;
	}
}