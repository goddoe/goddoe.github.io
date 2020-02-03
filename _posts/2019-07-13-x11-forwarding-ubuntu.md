---
layout: post
title:  "Forwarding X11 window over SSH Ubuntu"
date:   2019-07-13 06:24:09 +0900
categories: [Dev Environment]
---



## Pareparing your remote server

Login to your remote server.

```bash
ssh username@remotehost 

```


Install that we need

```bash
$ sudo apt install xorg xauth openssh
```

Change parameters of '/etc/ssh/sshd_config' like below 


```bash
...
X11Forwarding yes
X11DisplayOffset 10
X11UseLocalhost no
...
```

Restart remote ssh server

```bash
$ service ssh restart

```


## Preparing your mac


Make sure you have installed X11 on your local  machine

```bash
$ brew cask install xquartz
$ ssh -CY username@remotehost
$ echo $DISPLAY # veryfy that your `DISPLAY` is not empty
$ xeyes # verify you have X11

```

## Plot with matplotlib

```
import matplotlib
# matplotlib.use('TkAgg') # if you can't see any window, then set TkAgg as backend
import matplotlib.pyplot as plt
plt.plot([1,2,3])
plt.show()
``` 
