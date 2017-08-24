---
layout: post
title:  "Algorithm Practice - Endian Problem"
date:   2017-08-11 00:10:11 +0900
categories: jekyll update
---


# Endian Problem

Solution by Sung-ju Kim
<hr/>

<p>Description from Algospot (https://algospot.com/judge/problem/read/ENDIANS).<br/>
Problem from ICPC Seoul Regional Warmup 2008
</p>
<hr/>
<p>The two island nations Lilliput and Blefuscu are severe rivals. They dislike each other a lot, and the most important reason was that they break open boiled eggs in different ways.
People from Lilliput are called little-endians, since they open eggs at the small end. People from Blefuscu are called big-endians, since they open eggs at the big end.

This argument was not only about their breakfasts but about their computers, too. Lilliput and Blefuscu's computers differed in the way they store integers; they stored the bytes in different orders. Computers from Lilliput(*little-endians*) ordered it from the LSB(least significant byte) to the MSB(most significant byte), and computers from Blefuscu was exactly the opposite.

For example, a 32-bit unsigned integer 305,419,896 (0x12345678) would be saved in two different ways:

00010010 00110100 01010110 01111000 (in an Blefuscu computer)
01111000 01010110 00110100 00010010 (in an Lilliput computer)
Therefore, if there was any need to exchange information between Blefuscu and Lilliput computers, some kind of conversion process was inevitable. Since nobody liked converting the data by himself before sending, recipients always had to do the conversion process.

Given some 32-bit unsigned integers retrieved in a wrong endian, write a program to do a conversion to find the correct value.

</p>
<hr/>
   
입력
```
The first line of the input file will contain the number of test cases, C (1 ≤ C ≤ 10, 000). Each test case contains a single 32-bit unsigned integer, which is the data without endian conversion.
```

출력
```
For each test case, print out the converted number.
```
<hr/>
예제 입력
```
4
2018915346
1
100000
4294967295
```

예제 출력
```
305419896
16777216
2693136640
4294967295
```


```python
import sys
```


```python
def convert_endian(number):
    binary = "{:32b}".format(number).replace(' ','0')
    reordered_byte_list = [None]*4
    for i in range(4):
        reordered_byte_list[3-i]= binary[i*8:(i*8)+8]
    reordered_byte = ''.join(reordered_byte_list)

    result = int(reordered_byte, 2)
    return result
```


```python
def run():
    # use 'lambda: sys.stdin.readline()' to submit algospot
    # use 'input' to use in jupyter notebook
    #rl = lambda: sys.stdin.readline()
    rl = input
    C = int(rl())
    
    result_list = []
    for i in range(C):
        query = int(rl())
        result = convert_endian(query)
        result_list.append(result)

    for result in result_list:
        print(result)
```


```python
run()
```

    305419896
    16777216
    2693136640
    4294967295


<hr/>
done.

