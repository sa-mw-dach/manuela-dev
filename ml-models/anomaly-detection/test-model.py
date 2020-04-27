from joblib import dump, load
import numpy as np

features = np.asarray([[1.0,2.0,3.0,3.0,5.0]], dtype=np.float32)

filename = 'model.joblib'
loaded_model = load(open(filename, 'rb'))

result = loaded_model.predict(features)
print(result)