package com.redhat.manuela.sensor;

import com.redhat.manuela.model.Measure;

public interface Sensor {
	
	public void initAndReset();
	public int getFrequency();
	public boolean isEnabled();
	public Measure calculateCurrentMeasure(Measure measure);

}
