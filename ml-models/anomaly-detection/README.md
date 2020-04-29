# MANUela Anomaly ML Model
- Perpare sensor data for model training
- Train and validate model(s) 

## Prepare data

### How to capture logs for the of raw data

```
oc logs messaging-795df576fc-klxj9 --timestamps=true --follow | tee messaging.log
grep -v "Last ID:\|handleTemperature" messaging.log | grep "handleVibration\|alert" | sort -u > raw-data.log
```

### Create time series data from the raw data

```
python3 log-to-timeseries.py
```
- input: raw-data.log
- otput: raw-data.csv


## MANUela Anomaly ML Model

Goal: Build an machine lerning model that detect anomalies in sensor vibration

- Wrangling sensor data 
- Save the training data
- Prepare the data for modeling, training and testing
- Train and validate models
- Select and save the best model


Files:
- Data-Analyses.ipynb - Jupyter notebook
- model.joblib - Trained ML model
- raw-data.csv - Wrangled training data




