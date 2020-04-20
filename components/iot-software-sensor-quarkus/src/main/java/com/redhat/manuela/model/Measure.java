package com.redhat.manuela.model;

import java.io.Serializable;

public class Measure implements Serializable {

	private static final long serialVersionUID = -6134767246202226552L;
	
	private final String  deviceId;
	private final String  machineId;
	private final String timestamp;
	private	String	payload;
	
	public Measure(String machineId, String deviceId, String timestamp) {
		this.deviceId = deviceId;
		this.machineId = machineId;
		this.timestamp = timestamp;
	}
	
	public String getTimestamp() {
		return timestamp;
	}

	public String getDeviceId() {
		return deviceId;
	}

	public String getPayload() {
		return payload;
	}
	public void setPayload(String payload) {
		this.payload = payload;
	}
	
	public String getCSVData() {
		StringBuilder sb = new StringBuilder();
		sb.append(machineId);
		sb.append(",");
		sb.append(deviceId);
		sb.append(",");
		sb.append(payload);
		sb.append(",");
		sb.append(timestamp);
		return sb.toString();
	}

}
