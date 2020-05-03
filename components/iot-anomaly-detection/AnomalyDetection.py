from joblib import dump, load
import numpy as np

import os, sys
import time


class AnomalyDetection(object):
    def __init__(self):
        print("Initializing...")
        self.model_file = os.environ.get('MODEL_FILE', 'model.joblib')
       
        print("Load modelfile: %s" % (self.model_file))

        try:
            self.clf = load(open(self.model_file, 'rb'))
            print("Model file loaded: %s"% (self.model_file))
        except FileNotFoundError:
            print("File does not exist in:", os. getcwd())
            sys.exit() 
        except:
            print("Coul dnot load model file! ", self.model_file, os. getcwd() )
            sys.exit() 

    def predict(self, X, feature_names):
        print(" Predict features: ", X)
        # print(" Features types: ", type(X),  type(X[0][0]))  

        prediction = self.clf.predict(X)
        print("Prediction: " , prediction)
        
        return prediction

if __name__ == "__main__":
    p = AnomalyDetection()
    
    X = np.asarray([[16.1,  15.40,  15.32,  13.47,  17.70]], dtype=np.float32)
    print(" Features types: ", type(X),  type(X[0][0])) 

    prediction = p.clf.predict(X)
    print(prediction)


