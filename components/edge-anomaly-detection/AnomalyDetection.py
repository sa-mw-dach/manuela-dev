import logging
import os, sys
import statistics
import time

_LOGGER = logging.getLogger()
_LOGGER.setLevel(logging.INFO)

class AnomalyDetection(object):
    def __init__(self):
        self.multiplier = int(os.environ.get('MODEL_STDDEV_MULTIPLIER', 3))
        self.window_size = int(os.environ.get('MODEL_WINDOW_SIZE', 5))
        self.window = []
        self.n = []

    def predict(self, X, feature_names):
        x = X[0]

        if len(self.window) > 1:
            summ = sum(self.window)
            n = len(self.window)
            stddev = statistics.stdev(self.window[:(self.window_size if len(self.window) >= self.window_size else len(self.window)):])
            mean = summ / n
            abs_val = abs(x)
            result = mean + (stddev * self.multiplier) < abs_val
            _LOGGER.info("\nx: %d\nsum: %d\nn: %d\nstd dev: %d\nmean: %d\nresult: %s\n" % (x, summ, n, stddev, mean, result))
        else:
            result = False

        if  not result:
            self.window.append(x)
            self.window = self.window[-self.window_size:len(self.window)]

        return [1] if result else [0]
