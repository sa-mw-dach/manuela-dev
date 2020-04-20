package com.redhat.manuela.sensor;

import java.util.concurrent.ThreadLocalRandom;
import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import com.redhat.manuela.model.Measure;

@ApplicationScoped
public class LightSensor implements Sensor {
	
	@ConfigProperty(name = "sensor.light.enabled") 
	boolean enabled;
	
	@ConfigProperty(name = "sensor.light.frequency")
	int frequency;
		
	@ConfigProperty(name = "sensor.light.start") 
	int start;
	
	@ConfigProperty(name = "sensor.light.maxIteration") 
	int maxIteration;
	
	@ConfigProperty(name = "sensor.light.minIteration") 
	int minIteration;
	
	@ConfigProperty(name = "sensor.light.minRange") 
	int minRange;

	@ConfigProperty(name = "sensor.light.maxRange") 
	int maxRange;
	
	private double currentValue;
	private int count = 0;
	
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
		
		if(count > 0) {
			
			// Calculate random value from range
			double randValue = ThreadLocalRandom.current().nextDouble(minIteration, (maxIteration+1));
			currentValue = currentValue + randValue;
			
			if(currentValue < minRange || currentValue > maxRange) {
				initAndReset();
			}
			
		}

		measure.setPayload(String.valueOf(currentValue));

		++count;
		return measure;
	}

	

}
