---
layout: post
title:  "Kaggle - Carvana Image Masking Challenge 0"
date:   2017-08-11 00:04:11 +0900
categories: jekyll update
---

![Carvana Screenshot]({{ site.url }}/assets/carvana_screeshot.png)

Kaggle에서 Image Sementation 관련 Competition이 열렸다. 재밌을 것 같다. 

데이터를 살펴보자. 
![car origin]({{ site.url }}/assets/train_data_origin.jpg)
그림 1. 원본 이미지
![car masked]({{ site.url }}/assets/train_data_mask.gif)
그림 2. 마스크 이미지

<style>
table {
    border-collapse: collapse;
}

table, th, td {
    border: 1px solid black;
}
</style>
<table style="border : 1px solid black;">
    <thead>
        <tr>
            <th>img</th>
            <th>rle_mask</th>
        </tr>
    </thead>
    <tbody>
    {% for data in site.data.train_data_mask %}
        <tr>
            <td>{{ data.img }}</td>
            <td>{{ data.rle_mask }}</td>
        </tr>
    {% endfor %}
    </tbody>
</table>
표 1. 마스크 csv

데이터는 그림1, 그림2, 표1과 같이 원본 이미지와 마스크 이미지, 마스크 csv로 구성되어 있다. 마스크 csv는 원본 이미지 파일 이름과 (position, num of pixel) (position, num of pixel) (position, num of pixel) ... 형식으로 되어있다. position은 이미지를 흑백으로 변환하고 1D로 변환한뒤의 position이다. 이런 표현방식은 당연히 submission을 위한 압축을 위해 사용하는 것이다.

- - - 

# Kaggle - Carvana Image Masking Challenge 0 

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
![png]({{ site.url }}/assets/output_8_1.png)


맥북에서 테스트하고 있는데 학습데이터 이미지만 5022개다. 맥북에 한번에 메모리에 올리기에는 너무 양이 많다. generater을 사용하여 memory-friendly한 이미지 리더를 만들었다. 한번 iteration 할때마다 batch_size만큼의 이미지를 읽어온다. 
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
