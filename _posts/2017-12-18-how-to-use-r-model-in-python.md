---
layout: post
title:  "How to use R model in python"
date:   2017-12-18 00:03:55 +0900
categories: [R, Machine Learning]
---

# Introduction 
There is someone wants to use R model in python. Fortunately, there is library named 'rpy2' which enables python to use R. Let's have a try. 

# R Model Example

```R
# example/example_R_model.R

library(e1071)
attach(iris)

MODEL_SAVE_PATH = "path/to/model"
DEP_LIBS = c("e1071")

x <- subset(iris, select=-Species)
y <- Species

# save model
model <- svm(x,y)

# save
model_rds_path = paste(MODEL_SAVE_PATH, ".rds",sep='')
model_dep_path = paste(MODEL_SAVE_PATH, ".dep",sep='')

# save model
dir.create(dirname(model_path), showWarnings=FALSE, recursive=TRUE)
saveRDS(model, model_rds_path)

# save dependency list
file_conn <- file(model_dep_path)
writeLines(DEP_LIBS, file_conn)
close(file_conn)
```


# Make Python Class which Loads R Model

```python
# rpy2_wrapper/model.py 

import numpy as np

import rpy2.robjects as robjects
from rpy2.robjects import numpy2ri
from rpy2.robjects.packages import importr

r = robjects.r
numpy2ri.activate()

class Model(object):
    """
    R Model Loader

    Attributes
    ----------
    model : R object
    """


    def __init__(self):
        self.model = None

    def load(self, path):
        model_rds_path = "{}.rds".format(path)
        model_dep_path = "{}.dep".format(path)

        print("="*30)
        print("load model from: {}".format(model_rds_path))
        self.model = r.readRDS(model_rds_path)
        
        print("load model dep from: {}".format(model_dep_path))
        with open(model_dep_path, "rt") as f:
            model_dep_list = [ importr(dep.strip()) for dep in f.readlines( ) if dep.strip() != '' ]

        print("="*30)
        return self

    def predict(self, X):
        """
        Perform classification on samples in X.
        
        Parameters
        ----------
        X : array, shape (n_samples, n_features)
        Returns
        -------
        pred_probs : array, shape (n_samples, probs)
        """

        if self.model is None:
            raise Exception("There is no Model")
        
        if type(X) is not np.ndarray:
            X = np.array(X)

        pred = r.predict(self.model, X, probability=True)
        probs = r.attr(pred, "probabilities")
        return np.array(probs)

```

# Load R Model Using rpy2 Wrapper Class and Run Example

```python
# load_and_predict_example.py

import numpy as np
from rpy2_wrapper.model import Model

# Constants
MODEL_PATH = "../svm/result/model"

# Example Input
X = np.array([[5.1, 3.5,  1.4, 0.2], # setosa
              [6.1, 2.6,  5.6, 1.4]]  # virginica

# Example Run
model = Model().load(MODEL_PATH)
pred = model.predict(X)

# Example output
print("="*30)
print(pred)
```
