package com.redhat.manuela.sensor;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import com.redhat.manuela.model.Measure;
import org.eclipse.microprofile.config.inject.ConfigProperty;


@ApplicationScoped
public class GpsSensor implements Sensor {

	@ConfigProperty(name = "sensor.gps.enabled")
	boolean enabled;
	
	@ConfigProperty(name = "sensor.gps.frequency")
	int frequency;
	
	@ConfigProperty(name = "sensor.gps.initialLatitude")
	double initialLatitude;

	@ConfigProperty(name = "sensor.gps.initialLongitude")
	double initialLongitude;
	
	@ConfigProperty(name = "sensor.gps.iterationLongitude")
	double iterationLatitude;
	
	@ConfigProperty(name = "sensor.gps.iterationLongitude")
	double iterationLongitude;
	
	@ConfigProperty(name = "sensor.gps.finalLatitude")
	double finalLatitude;
	
	@ConfigProperty(name = "sensor.gps.finalLongitude")
	double finalLongitude;
	
	private double currentLongitude;
	private double currentLatitude;
	
	private int count = 0;
	
	@PostConstruct
	@Override
	public void initAndReset() {
		currentLongitude = initialLongitude;
		currentLatitude = initialLatitude;
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
						
			currentLatitude = currentLatitude + iterationLatitude;
			currentLongitude = currentLongitude + iterationLongitude;
			
			if(currentLatitude <= finalLatitude && currentLongitude <= finalLongitude) {
				initAndReset();
			}
			
		}
		
		String payload = formatPayload(currentLatitude, currentLongitude);

		measure.setPayload(String.valueOf(payload));
		++count;
		
		return measure;
	}
	
	private String formatPayload(double latitude, double longitude) {
		
		StringBuilder sb = new StringBuilder();
		sb.append(latitude);
		sb.append("|");
		sb.append(longitude);
		
		return sb.toString();
	}
	

}
