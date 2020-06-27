# iot-anomaly-detection

## Local build and test 

### Create your namespace / project 
```oc new-project test-anomaly-detection```

### Install the Seldon operator
```make install-seldon-operator```

### Build anomaly-detection container
```make build-container```

Wait until build is finished:

```oc get builds -w```


## Create SeldonDeployment and Route
```make create-deployment```


## Test Prediction
```make test-prediction```

Expected result:
```{"data":{"names":[],"ndarray":[1]},"meta":{}}```


## Cleanup  

## Delete SeldonDeployment and Route
```make delete-deployment```

### Delete anomaly-detection container
```make delete-container```

### Delete the Seldon operator
```make delete-seldon-operator```

### Delete your namespace / project 
```oc delete project test-anomaly-detection```


# Manuela docs
See 
- https://github.com/sa-mw-dach/manuela/blob/master/docs/BOOTSTRAP.md#machine-learning-based-anomaly-detection-and-alerting-optional
- https://github.com/sa-mw-dach/manuela/blob/master/docs/module-machine-learning.md#Demo-preparation
- https://github.com/sa-mw-dach/manuela/blob/master/docs/module-infrastructure-operator-development.md#Demo-execution
- https://github.com/sa-mw-dach/manuela-dev/tree/master/ml-models/anomaly-detection


