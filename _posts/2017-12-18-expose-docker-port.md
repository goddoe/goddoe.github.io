---
layout: post
title:  "How to Expose Docker Ports"
date:   2017-12-18 00:03:55 +0900
categories: Docker
---

+ Method 1: Using Docker file
    + EXPOSE 5000-9999
+ Method 2: Using Run commands 
    + docker run --expose=5000-9999
    + or 
    + docker run -p 5000-9999:5000-9999
