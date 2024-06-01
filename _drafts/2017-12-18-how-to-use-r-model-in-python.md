---
layout: post
title:  "How to use R model in Python"
date:   2017-12-18 00:03:55 +0900
categories: [R, Machine Learning]
---

# Introduction 
R and python are most popular languages for data scientists and researchers. Researchers are often use both languages and sometime needs features of each language at the same time. Fortunately, there is a library named 'rpy2' which enables python to use R. let's suppose we need to load R model from python. How can we? Let's have a try.

# Requirements
+ rpy2 library for python
    + rpy2 requires r-base 3.3+
    + can install with "pip3 install rpy2"

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

        self.model = r.readRDS(model_rds_path)

        with open(model_dep_path, "rt") as f:
            model_dep_list = [importr(dep.strip())
                              for dep in f.readlines()
                              if dep.strip()!='']

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
print(pred)
```

# Conclusion
With rpy2, we can use R features in python. Have fun and enjoy research. Thanks.

