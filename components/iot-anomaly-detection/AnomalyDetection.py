from joblib import dump, load
import numpy as np

import os, sys
import time


class AnomalyDetection(object):
    def __init__(self):
        print("Initializing...")

        # Variables needed for metric collection
        self.V0=0
        self.V1=0
        self.V2=0
        self.V3=0
        self.V4=0
        self.Prediction=0

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

    def predict(self, X, feature_names):
        print(" Predict features: ", X)
        # print(" Features types: ", type(X),  type(X[0,0]))  
    
        self.V0=X[0,0]
        self.V1=X[0,1]
        self.V2=X[0,2]
        self.V3=X[0,3]
        self.V4=X[0,4]

        prediction = self.clf.predict(X)
        self.Prediction=prediction
        print("Prediction: " , prediction)
        
        return prediction

    def metrics(self):
        return [
            {"type":"GAUGE","key":"V0","value":self.V0},
            {"type":"GAUGE","key":"V1","value":self.V1},
            {"type":"GAUGE","key":"V2","value":self.V2},
            {"type":"GAUGE","key":"V3","value":self.V3},
            {"type":"GAUGE","key":"V4","value":self.V4},
            {"type":"GAUGE","key":"Prediction","value":self.Prediction}
            ]



if __name__ == "__main__":
    p = AnomalyDetection()
    
    X = np.asarray([[16.1,  15.40,  15.32,  13.47,  17.70]], dtype=np.float32)
    print(" Features types: ", type(X),  type(X[0][0])) 

    ## prediction = p.clf.predict(X)

    prediction = p.predict(X,"")
    print(prediction)
    print(p.metrics())


