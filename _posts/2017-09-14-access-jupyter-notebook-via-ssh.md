---
layout: post
title:  "Access Jupyter Notebook via SSH"
date:   2017-09-14 00:10:11 +0900
categories: [develop]
---

# Introduction
I'm doing a machine learning project for the bank recently. As traditional bank project, it has extremely isolated develop environment. The develop environment consists of client PC and develop server with local network but machine's cannot be connected to internet. Also, There is no exposed port except ssh port(22) for devleopment. Port opening is possible but it takes serveral days for bank's security issue. Like my situation, there are many projects which have retricted network environment but you need to use jupyter notebook. Then, check this out. 

# How to 

There is technique called ssh-tunnneling. It allows us to use any remote server's program using only ssh port(default port 22).
1. Fisrt run jupyter notebook  
```
user@server$ jupyter notebook
```

2. Make ssh tunnnel between client and server
```
user@client$ ssh -N -f -L localhost:8888:localhost:8888 user@server
```

3. Open browser. Enjoy!
```
https://localhost:8888
```


## reference  
+ https://coderwall.com/p/ohk6cg/remote-access-to-ipython-notebooks-via-ssh
+ https://hacktilldawn.com/2016/12/06/using-your-remote-jupyter-notebook-through-ssh/
