---
layout: post
title:  "Scaling"
date:   2024-06-01 23:44:00 +0900
categories: [Research, Engineering]
---


As an AI Research Engineer, I have conducted and designed various ML/DL, LLM experiments and have learned a lot from them.

I want to share my experiences and insights to help others who are solving similar AI-related problems. Rather than writing all my experiences and know-how at once, I plan to share them piece by piece.

The first topic I want to share is Scaling.

TLDR;

1.	Find a methodology that shows monotonically increasing performance when scaled.
2.	Create a model “f(model size or dataset size or …) = score” through scaling experiments that can predict performance as scaling increases.
3.	Use the model “f(model size or dataset size or …) = score” to decide whether to push this methodology further or move on to another one.

As an engineer, to solve a problem, you need to find a technology that can solve it well and push it to the extreme to improve performance. Ideally, we find a technique where the performance increases monotonically as we scale it up.

In many cases, performance increases linearly or like a log function. We push performance enhancement methodologies to their limits through scaling until we encounter a plateau and solve the problem by improving performance.

This scaling to solve problems can also be observed in other domains outside of AI/ML. In semiconductors, circuits are scaled by making the circuit linewidth thinner through nanoprocessing every year to increase circuit density. GPUs are scaled by increasing the number of CUDA cores.

In LLMs, the scaling law, where performance continues to improve as the model size is scaled up, is very well-known.

In AI/ML problems, aside from model size, another aspect that can be scaled is the dataset. In AI/ML problems, rather than changing the model architecture or training techniques, scaling the amount of data and improving its quality is more cost-effective for enhancing model performance.

And in many cases, by conducting scaling experiments on the dataset and measuring performance based on the number of data samples, we can create a model that predicts performance based on the number of data samples.

Generally, performance increases on a log scale as the number of data samples increases, so if you plot log(dataset size) vs score, you will see a linear relationship and can find a function “f(dataset size) = score” through linear fitting that predicts performance based on the number of data samples.

By using this function, we can predict how much performance gain we can expect when scaling this methodology and decide whether to continue scaling the current data collection methodology, switch to collecting different data, or move on to another aspect besides data.

And this is actually the most basic concept taught in ML 101. This is fundamental in LLM experiments as well, and not only I, but OpenAI researchers also emphasize and invest in scaling research with many experiments.

Currently, many new AI, LLM technologies are emerging, and it seems like these basic aspects are often overlooked in recent research and experiments. However, LLMs are still ML, so I believe it is important to always remember and experiment with the fundamentals of ML. I believe that keeping the basics first is the faster way to solve problems.
