# MANUela Anomaly ML Model
- Perpare sensor data for model training
- Train and validate model(s) - TBD

## Prepare data

### Capturing of raw data

```
oc logs messaging-795df576fc-klxj9 --timestamps=true --follow | tee messaging.log
grep -v "Last ID:\|handleTemperature" messaging.log | grep "handleVibration\|alert" | sort -u > raw-data.log
```

### Create time series data

```
python3 log-to-timeseries.py
```

### Convert data to eposodes 
See first part of Data-Analyses.ipynb