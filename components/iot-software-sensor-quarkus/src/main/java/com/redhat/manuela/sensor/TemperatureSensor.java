package com.redhat.manuela.sensor;

import java.util.concurrent.ThreadLocalRandom;
import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import com.redhat.manuela.model.Measure;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class TemperatureSensor implements Sensor {
	
	@ConfigProperty(name = "sensor.temperature.enabled") 
	boolean enabled;
	
	@ConfigProperty(name = "sensor.temperature.frequency")
	int frequency;
		
	@ConfigProperty(name = "sensor.temperature.startMin") 
	int startMin;
	
	@ConfigProperty(name = "sensor.temperature.startMax") 
	int startMax;
	
	@ConfigProperty(name = "sensor.temperature.minIteration") 
	int minIteration;
	
	@ConfigProperty(name = "sensor.temperature.maxIteration") 
	int maxIteration;
		
	@ConfigProperty(name = "sensor.temperature.minRange") 
	int minRange;

	@ConfigProperty(name = "sensor.temperature.maxRange") 
	int maxRange;
	
	private double currentValue;
	// private int count = 0;
	private int direction = 1;
	
	@PostConstruct
	@Override
	public void initAndReset() {
		currentValue = ThreadLocalRandom.current().nextInt(startMin, (startMax+1));
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
			if(this.count > 0) {
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
		measure.setPayload(String.valueOf(currentValue));

		// ++this.count;
		return measure;
	}


}
