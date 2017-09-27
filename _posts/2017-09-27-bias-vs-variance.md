---
layout: post
title:  "Machine Learning - Evaluating A Learning Algorithm"
date:   2017-09-27 00:10:11 +0900
categories: [Machine Learning]
---

# Introduction
Thesedays, I have been watching Andrew NG's machine learning videos from coursera. It was awsome, so I try to write a lecture note of it on my blog.   

- - -
## Evaluating A Learning Algorithm
# 1. Deciding what to try next

Typical actions, when it has large error.   
1. Get more training examples.
    - There are one thing you should know. Sometimes, getting more data doesn't acctually help.  
2. Try smaller sets of features. 
3. Try getting additional features.
4. Try adding polynomial features. ($$x_1^2, x_2^2, x_1 x_2, etc$$)
5. Try decreasing or decreasing regularization parameter lambda

There are many people that choose one of actions randomly above to increase performance.
Dignotics of a algorithm gives you a insight of choosing which action you should do next.   


# 2. Evaluating a hypothesis

1. Split dataset to training set, cross validation set,  and test set.
2. Compute training error.
3. Compute test error.
4. Computer misclassification error.

# 3. Model selection and Train/Valid/Test sets

1. Typical split of dataset ratio : 0.6(train set), 0.2(cross validation set), 0.2(test set)

2. How to select model? 
    1. train several model with train set.
    2. choose best model based on cross validation error.

A model is fitted to train and cross validation set only, therefore calculation of test error of the model represents generalization error.


<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>

