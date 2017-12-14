---
layout: post
title:  "X11 forwarding working over ssh"
date:   2017-08-11 00:03:55 +0900
categories: jekyll update
---
To get X11 forwarding working over ssh, you'll need 3 things in place.

Your client must be set up to forward X11.
Your server must be set up to allow X11 forwarding.
Your server must be able to set up X11 authentication.
If you have both #1 and #2 in place but are missing #3, then you'll end up with an empty DISPLAY environment variable.

Soup-to-nuts, here's how to get X11 forwarding working.

On your server, make sure /etc/ssh/sshd_config contains:

X11Forwarding yes
X11DisplayOffset 10
You may need to SIGHUP sshd so it picks up these changes.
cat /var/run/sshd.pid | xargs kill -1
On your server, make sure you have xauth installed.

belden@skretting:~$ which xauth
/usr/bin/xauth
If you don't have xauth installed, you'll run into the "empty DISPLAY environment variable" problem.
On your client, connect to your server. Be certain to tell ssh to allow X11 forwarding. I prefer
belden@skretting:~$ ssh -X blyman@the-server
but you may like

    belden@skretting:~$ ssh -o ForwardX11=yes blyman@the-server
or you can set this up in your ~/.ssh/config.



A quick note from signal processing point of view. Strides correspond to downsampling. Max pooling looks like envelope extraction. Avg pool acts like low pass filtering and then downsampling, also called decimation. Pure down-sampling can introduce the so called aliasing (overlaping of the signal in the frequency domain) if the signal can change too fast (e.g. noise). In this case low pass filtering is needed. Envelope extraction is usefull when the signal has some high frequency oscillation (modulation) that we do not need and want to discard.

How all this plays with the deep learning I don't know yet :slight_smile:
ref :http://forums.fast.ai/t/convolutional-subsampling-vs-pooling-layers/2434/5
