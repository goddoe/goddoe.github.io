---
layout: post
title:  "ChatGPT가 나온 역사에 대해 궁금하지 않으신가요?"
date:   2023-02-15 06:24:09 +0900
categories: [article]
---


ChatGPT를 만들어 내기 위해, 비전을 가지고 하나의 방향으로 얼마나 꾸준히 연구를 했는지 아시게 된다면, 당신은 OpenAI의 팬이 될 수 밖에 없을 것입니다.

ChatGPT의 제작에 기여한 기반 연구들은 많이 있습니다. 하지만, 그 중 핵심 연구 줄기만 대표적으로 2 갈래로만 나눈다면, 아래 두가지로 나눌 수 있습니다.

- Language Model
- Alignment

##LanguageModel
Language Model은 모델이 자연어를 이해하고 말을 할 수 있도록 만드는 기반 기술입니다.

OpenAI는 자연어를 이해하고 말하는 모델을 만들기 위해 2018년부터 꾸준히 Language Model을 연구해왔습니다.

- GPT-1 (2018)
- GPT-2 (2019)
- GPT-3 (2020)

그 결과 OpenAI는 GPT-3를 만들어 냈고 많은 사람들은 사람처럼 자연어를 이해하고 응답하는 AI의 등장에 충격을 받았습니다.

하지만 GPT-3는 그저 많은 자연어만을 학습했기 때문에, 모델은 OpenAI가 의도하지 않은 응답을 만들어내곤 했습니다.

예를 들면, 거짓이거나, 정치적이거나, 민감한 응답을 생성하곤 해서, 실서비스에 바로 적용하기 어려웠습니다.

##Alignment
그래서 OpenAI는 2020년부터 지금까지 사람의 의도와 모델을 alignment 시키기 위한 비전으로 alignment팀을 만들고 꾸준히 연구했습니다.

- Fine-Tuning Language Models from Human Preferences(2020.01)
- Recursively Summarizing Books with Human Feedback(2021.09)
- Learning to summarize from human feedback(2022.02)
- InstructGPT - Training language models to follow instructions with human feedback(2022.03)
- ChatGPT (2022.10)

사람의 의도대로 모델이 자연어를 생성하게 하기위해, 사람의 지시를 잘 따르도록 디자인된 데이터를 추가하고, RL알고리즘 중 하나인 PPO를 사용하여 사람의 의도에 맞는 응답을 생성하도록 학습 시켰습니다. (참고로, 이 PPO 또한 RL의 최강자 존 슐만이 OpenAI에서 개발한 RL 학습 기법입니다.)

그리고 결국! 모두가 놀라는 ChatGPT가 나왔습니다.

이렇게 비전을 가지고, 그것이 달성 될 것이라고 믿고, 긴 기간 동안 꾸준히 그 방향으로 연구를 하고, 결국 결과를 낸 OpenAI는 정말 멋진 것 같습니다.

