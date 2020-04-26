from joblib import dump, load
import numpy as np

import logging
import os, sys
import time

_LOGGER = logging.getLogger()
_LOGGER.setLevel(logging.INFO)

class AnomalyDetection(object):
    def __init__(self):
        _LOGGER.info("Initializing...")
        self.model_file = os.environ.get('MODEL_FILE', 'model.joblib')

        _LOGGER.info("Load modelfile: %s\n" % (self.model_file))
        self.clf = load(open(self.model_file, 'rb'))

    def predict(self, X, feature_names):
        _LOGGER.info("Predict features: " , X)

        prediction = self.clf.predict(X)
        _LOGGER.info("Prediction: " , prediction)
        
        return prediction

if __name__ == "__main__":
    p = AnomalyDetection()
    
    X = np.asarray([[16.1,  15.40,  15.32,  13.47,  17.70]], dtype=np.float32)

    prediction = p.clf.predict(X)
    print(prediction)





