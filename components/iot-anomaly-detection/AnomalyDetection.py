from joblib import dump, load
import numpy as np

import os, sys
import time


class AnomalyDetection(object):
    def __init__(self):
        print("Initializing...")

        # Variables needed for metric collection
        self.actual=0
        self.prediction=0
        self.device_metric="na"


        self.model_file = os.environ.get('MODEL_FILE', 'model.joblib')
       
        print("Load modelfile: %s" % (self.model_file))

        try:
            self.clf = load(open(self.model_file, 'rb'))
            print("Model file loaded: %s"% (self.model_file))
        except FileNotFoundError:
            print("File does not exist in:", os.getcwd())
            sys.exit() 
        except Exception as e:
            print("Could not load model file! ", self.model_file, os.getcwd() )
            print(e)
            sys.exit() 


  
        
    def predict(self, X, feature_names=None, meta=None):
        print(" Predict features: ", X)
        # print(" Features types: ", type(X),  type(X[0,0]))  


        if meta:
            # print(" device_metric: ", meta.get('device_metric'))
            self.device_metric = meta.get('device_metric')
    
        self.actual=float(X[0,0])

        prediction = self.clf.predict(X)
        self.prediction=float(prediction)
        print("Prediction: " , prediction)
        
        return prediction

    def metrics(self):
        return [
            {"type":"GAUGE","key":"iot_anomaly_actual","value":self.actual, "tags": {"device_metric":self.device_metric}},
            {"type":"GAUGE","key":"iot_anomaly_prediction","value":self.prediction, "tags": {"device_metric":self.device_metric}}
            ]



if __name__ == "__main__":
    p = AnomalyDetection()
    
    X = np.asarray([[16.1,  15.40,  15.32,  13.47,  17.70]], dtype=np.float32)
    print(" Features types: ", type(X),  type(X[0][0])) 

    ## prediction = p.clf.predict(X)
    
    meta_dict = {'device_metric': 'test1'}

    prediction = p.predict(X,feature_names=None,meta=meta_dict)
    print(prediction)
    print(p.metrics())


