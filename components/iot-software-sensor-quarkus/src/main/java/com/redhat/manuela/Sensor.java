package com.redhat.manuela;

public interface Sensor {
	
	public void initAndReset();
	public int getFrequency();
	public boolean isEnabled();
	public Measure calculateCurrentMeasure(Measure measure);

}
