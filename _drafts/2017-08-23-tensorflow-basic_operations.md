---
layout: post
title:  "Tensorflow Basic Operations"
date:   2017-08-23 00:10:11 +0900
categories: [Tensorflow, Machine Learning]
---

# Tensorflow Basic Operations 
Sung-ju Kim
+ <a href="https://github.com/goddoe/ml_lecture/blob/master/notebook/1_tensorflow_basic_operations.ipynb">https://github.com/goddoe/ml_lecture/blob/master/notebook/1_tensorflow_basic_operations.ipynb</a>


## Contents
1. Constant variable declaration and basic calculation
2. Advanced variable declaration
3. Using placeholder

## 1. Constant variable declaration and basic calculation

```python
import tensorflow as tf
```

```python
a = tf.constant([2], dtype=tf.float32, shape=None, name='a')
b = tf.constant([3], dtype=tf.float32, shape=None, name='b')
y_add = a + b
y_mul = a * b

init = tf.global_variables_initializer()
```


```python
with tf.Session() as sess:
    init = tf.global_variables_initializer()
    sess.run(init)
    
    print(sess.run(y_add))
    print(sess.run(y_mul))
```

    [ 5.]
    [ 6.]


## 2. Advanced variable declaration


```python
with tf.device('/cpu:0'):
    with tf.variable_scope('basic_operations'):
        a = tf.get_variable(
                        name='a',
                        shape=[1],
                        dtype=tf.float32,
                        initializer=tf.constant_initializer(value=[2]))
        b = tf.get_variable(
                        name='b',
                        shape=[1],
                        dtype=tf.float32,
                        initializer=tf.constant_initializer(value=[3]))
        y_add = tf.add(a,b)
        y_mul = tf.multiply(a,b)
        
        init = tf.global_variables_initializer()
```


```python
with tf.Session() as sess:
    sess.run(init)
                
    print(y_add.eval(session=sess))
    print(y_mul.eval(session=sess))
    print('-'*30)
    print(sess.run(y_add))
    print(sess.run(y_mul))
```

    [ 5.]
    [ 6.]
    ------------------------------
    [ 5.]
    [ 6.]


## 3. Using Placeholder


```python
with tf.device('/cpu:0'):
    with tf.variable_scope('basic_operations_with_placeholder'):
        a = tf.placeholder(dtype=tf.float32, shape=None, name='a')
        b = tf.placeholder(dtype=tf.float32, shape=None, name='b')
        
        add_a_b = tf.add(a,b)
        mul_a_b = tf.multiply(a,b)
        y_add = tf.add(a,b)
        y_mul = tf.multiply(a,b)
        
        init = tf.global_variables_initializer()
```


```python
with tf.Session() as sess:
    print(sess.run(y_add, feed_dict={a:[2], b:[3]}))
    print(sess.run(y_mul, feed_dict={a:[2], b:[3]}))
```

    [ 5.]
    [ 6.]

