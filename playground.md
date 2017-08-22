
# Playground


```python
import os
import pickle
from scipy.misc import imread
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from libs.dataset_utils import create_input_pipeline
%matplotlib inline
```

- - -

# Data Reader 


```python
ls data
```

    metadata.csv           [1m[36mtest[m[m/                  [1m[36mtrain_masks[m[m/
    sample_submission.csv  [1m[36mtrain[m[m/                 train_masks.csv



```python
class MultiImageReader(object):
    def __init__(self, base_path, batch_size=50):
        self.base_path = base_path
        self.batch_size = batch_size 
        
    def __iter__(self):
        train_img_path_list = [ os.path.join(train_img_path, img_name)
                for img_name in os.listdir(train_img_path)
                if img_name.endswith('.jpg')
            ]
        buff = []
        for i, file_path in enumerate(train_img_path_list):
            buff.append(imread(file_path))
            if (i+1) % self.batch_size == 0:
                yield buff
                buff = []
```


```python
train_img_path = "./data/train"
image_list = MultiImageReader(train_img_path,)
```


```python
img = image_list.__iter__().__next__()
```


```python
plt.imshow(img[0])
```




    <matplotlib.image.AxesImage at 0x113cad9e8>




![png](output_8_1.png)



```python
del image_list
del img
```

- - -

# Research Data

## Calculate Mean Image


```python
sum_i = 0
img_mean = 0
image_list = MultiImageReader(train_img_path,)
for i, img_batch in enumerate(image_list):
    sum_i += 1
    img_batch_mean = np.mean(img_batch, axis=0)
    img_mean = img_mean*((sum_i-1)/sum_i) + img_batch_mean *(1/sum_i)
```


```python
plt.imshow(img_mean.astype(np.int16))
```


```python
np.save("data/img_mean.npy", img_mean)
```


```python
del image_list
```

## Calculate Std Image


```python
sum_i = 0
img_var = 0
image_list = MultiImageReader(train_img_path,)
for i, img_batch in enumerate(image_list):
    sum_i += 1
    img_batch_np = np.array(image_batch, dtype=np.float64)
    
    img_batch_square_sum = np.mean((img_batch_np - img_mean)*(img_batch_np - img_mean), axis=0)
    
    img_var = img_var *((sum_i-1)/sum_i) + img_batch_square_sum * (1/sum_i)
    
img_std = np.sqrt(img_var)
```


```python
plt.imshow(img_std.astype(np.int16))
```


```python
del image_list
```
