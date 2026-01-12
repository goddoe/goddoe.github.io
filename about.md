---
layout: about_layout
title: about
permalink: /about/
---
<style>
.about-header {
  text-align: center;
  padding: 40px 0 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
}
.about-header h1 {
  margin: 0 0 15px;
  font-size: 2.2em;
  font-weight: 600;
}
.about-links {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 15px;
}
.about-links a {
  display: inline-block;
  padding: 8px 20px;
  border: 1px solid #333;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  font-size: 0.9em;
  transition: all 0.2s;
}
.about-links a:hover {
  background: #333;
  color: #fff;
}
.lang-switch {
  font-size: 0.8em;
  color: #999;
}
.lang-switch a {
  color: #999;
  text-decoration: none;
  cursor: pointer;
}
.lang-switch a:hover {
  color: #666;
}
.lang-switch a.active {
  color: #333;
}
.lang-en, .lang-ko { display: none; }
.lang-en.active, .lang-ko.active { display: block; }
</style>

<div class="about-header">
  <h1>Sungju Kim</h1>
  <div class="about-links">
    <a href="https://www.linkedin.com/in/sungju-kim-3b0406b0/">LinkedIn</a>
    <a href="https://github.com/goddoe">GitHub</a>
  </div>
  <div class="lang-switch">
    <a id="btn-en" onclick="setLang('en')">EN</a> | <a id="btn-ko" onclick="setLang('ko')">KO</a>
  </div>
</div>

<div class="lang-en" markdown="1">

## Experience

**NAVER Cloud**, Tech Lead (2023.01 - Present)<br/>
Hyperscale AI, Seongnam, South Korea

- Contributed to [HyperCLOVA X 32B Think](https://arxiv.org/abs/2601.03286) through model development and research for SWE Agents, including creating SFT and RL datasets, developing training environments for SWE Agent RL, and babysitting model training during the General and SWE Agent RL phases. 2025
- Contributed as one of the core contributors to the [HyperCLOVA X THINK Project](https://arxiv.org/abs/2506.22403). 2025
- Led a team that developed a product and model similar to GitHub Copilot, which is used by internal developers at NAVER. 2023-2024
- Contributed as one of the technical leads to the [HyperCLOVA X project](https://arxiv.org/abs/2404.01954). 2024
- Contributed to the enhancement of the coding capabilities for HyperCLOVA X, an LLM developed by NAVER Cloud. 2023-2024

**NAVER**, Tech Lead (2022.08 - 2022.12)<br/>
**NAVER**, AI Research Engineer, NLP (2018.07 - 2022.07)<br/>
Clova AI assistant team, Seongnam, South Korea

- Developed a state-of-the-art Neural Information Retrieval model using NAVER's extensive internal text data resources, achieving unprecedented performance in zero-shot information retrieval. 2022.
- Contributed to develop a large-scale autoregressive language model, HyperCLOVA. My contributions included data collection, purification, and conducting experimental work on zero-shot, few-shot, and p-tuning. 2020-2021.
- Developed Pretrained Language Models for Korean and Japanese. 2020-2021.
- Developed Out of Domain Detection model for dialogue system using sentence-embedding model. 2020-2021
- Developed Natural Language Understanding model. 2020.
- Developed and implemented a suggestion model for ambiguous user queries, significantly enhancing the system's capacity to interpret and respond to a broad spectrum of unclear queries. 2018-2019.
- Improved dialogue manager of dialogue system. 2018-2019.

**Nomad Connection**, AI Researcher (2016.02 - 2018.07)<br/>
AI lab team, Seoul, South Korea

- Modeling intent classifier and sentence encoder for AI chatbot. 2017-2018.
- Developed Keyword extractor and Sentiment classifier. 2016-2017.
- Developed ID card OCR model development for non-face-to-face authentication. 2017.
- Developed Sentiment classifier. 2016

## Education

**Kyungpook National University**, Computer Science, M.S. (2014.03 - 2016.02)<br/>
Computer & Robot Vision Lab, Daegu, South Korea

**Kyungpook National University**, Biotechnology, B.S. (2009.03 - 2014.02)<br/>
Daegu, South Korea

## Award

**Ecothon, Grand Prize (1st place), Awarded by the Minister of Environment**<br/>
Team Qualc, 2016

- IOT smart oil filter for life management of vehicle's oil filter.
- News: [Ingenious 'Environment + ICT' Startup Idea Competition Ecothon… Qualc Team Grand Prize (title translated)](http://news.naver.com/main/read.nhn?mode=LSD&mid=sec&oid=030&aid=0002533677&sid1=001&lfrom=kakao)

## Selected Publications

- HyperCLOVA X Team, ..., <u>SJ Kim</u> et al, **HyperCLOVA X THINK 32B**, arXiv preprint [arXiv:2601.03286](https://arxiv.org/abs/2601.03286), 2025.
- HyperCLOVA X Team, ..., <u>SJ Kim</u> et al, **HyperCLOVA X THINK Technical Report**, arXiv preprint [arXiv:2506.22403](https://arxiv.org/abs/2506.22403), 2025.
- KM Yoo, ..., <u>SJ Kim</u> et al, **HyperCLOVA X Technical Report**, arXiv preprint [arXiv:2404.01954](https://arxiv.org/abs/2404.01954), 2024.
- <u>SJ Kim</u>, SH Kim, J Park, KM Yoo, IH Kang, **The Bi-Cross Pretraining Method to Enhance Language Representation**, Proceedings of the 33th Annual Conference on Human and Cognitive Language Technology, 2021.
- BS Kim, ..., <u>SJ Kim</u> et al, **What Changes Can Large-scale Language Models Bring? Intensive Study on HyperCLOVA: Billions-scale Korean Generative Pretrained Transformers**, Proceedings of the 2021 Conference on Empirical Methods in Natural Language Processing, 2021
- <u>SJ Kim</u>, SB Suh, JS Park, SH Park, DH Jeon, SH Kim, KD Kim, IH Kang, **Self-supervised Learning Method using Heterogeneous Mass Corpus for Sentence Embedding Model**, Proceedings of the 32th Annual Conference on Human and Cognitive Language Technology, 2020.
- <u>SJ Kim</u>, WW Kim, YS Seol, IH Kang, **Cross Gated Mechanism to Improve Natural Language Understanding**, Proceedings of the 31th Annual Conference on Human and Cognitive Language Technology., 2019.
- <u>SJ Kim</u> and SY Park, **Lane-Level Positioning based on 3D Tracking Path of Traffic Signs**, in Proceedings of the 11th Joint Conference on Computer Vision, Imaging and Computer Graphics Theory and Applications - Volume 3: VISAPP, (VISIGRAPP 2016), 2016.

## Patents

- **Method, Apparatus and Computer Program for Providing Coding Environment Optimized for Each User**
  *KR Patent Application No. 1020230177976*, Published as KR1020250088172A in 2025
  [DOI Link](https://doi.org/10.8080/1020230177976)

- **Method and System for Processing Unclear Intent Query in Conversation System**
  *US Patent No. US11403345B2*, Granted in 2022
  [Google Patents Link](https://patents.google.com/patent/US11403345B2)

</div>

<div class="lang-ko" markdown="1">

## 경력

**네이버 클라우드**, 테크 리드 (2023.01 - 현재)<br/>
Hyperscale AI, 성남, 대한민국

- [HyperCLOVA X 32B Think](https://arxiv.org/abs/2601.03286) 모델 개발 및 SWE Agent 연구에 기여. SFT/RL 데이터셋 생성, SWE Agent RL 학습 환경 개발, General 및 SWE Agent RL 단계 모델 학습 담당. 2025
- [HyperCLOVA X THINK 프로젝트](https://arxiv.org/abs/2506.22403) 핵심 기여자. 2025
- 네이버 내부 개발자용 GitHub Copilot 유사 제품 및 모델 개발 팀 리드. 2023-2024
- [HyperCLOVA X 프로젝트](https://arxiv.org/abs/2404.01954) 기술 리드. 2024
- 네이버 클라우드 LLM인 HyperCLOVA X의 코딩 능력 향상에 기여. 2023-2024

**네이버**, 테크 리드 (2022.08 - 2022.12)<br/>
**네이버**, AI 리서치 엔지니어, NLP (2018.07 - 2022.07)<br/>
Clova AI 어시스턴트 팀, 성남, 대한민국

- 네이버의 대규모 내부 텍스트 데이터를 활용한 최신 신경망 정보 검색 모델 개발, zero-shot 정보 검색에서 뛰어난 성능 달성. 2022.
- 대규모 자기회귀 언어 모델 HyperCLOVA 개발 기여. 데이터 수집, 정제, zero-shot, few-shot, p-tuning 실험 수행. 2020-2021.
- 한국어 및 일본어 사전학습 언어 모델 개발. 2020-2021.
- 문장 임베딩 모델을 활용한 대화 시스템의 도메인 외 탐지 모델 개발. 2020-2021
- 자연어 이해 모델 개발. 2020.
- 모호한 사용자 쿼리에 대한 제안 모델 개발 및 구현, 불명확한 쿼리 해석 및 응답 능력 향상. 2018-2019.
- 대화 시스템의 대화 관리자 개선. 2018-2019.

**노마드커넥션**, AI 연구원 (2016.02 - 2018.07)<br/>
AI 연구팀, 서울, 대한민국

- AI 챗봇용 의도 분류기 및 문장 인코더 모델링. 2017-2018.
- 키워드 추출기 및 감성 분류기 개발. 2016-2017.
- 비대면 인증용 신분증 OCR 모델 개발. 2017.
- 감성 분류기 개발. 2016

## 학력

**경북대학교**, 컴퓨터공학, 석사 (2014.03 - 2016.02)<br/>
컴퓨터 및 로봇 비전 연구실, 대구, 대한민국

**경북대학교**, 생명공학, 학사 (2009.03 - 2014.02)<br/>
대구, 대한민국

## 수상

**에코톤, 대상 (1위), 환경부 장관상**<br/>
팀 Qualc, 2016

- 차량 오일 필터 수명 관리를 위한 IoT 스마트 오일 필터.
- 뉴스: [기발한 '환경+ICT' 창업 아이디어 경연 에코톤… 퀄크팀 대상](http://news.naver.com/main/read.nhn?mode=LSD&mid=sec&oid=030&aid=0002533677&sid1=001&lfrom=kakao)

## 주요 논문

- HyperCLOVA X Team, ..., <u>SJ Kim</u> et al, **HyperCLOVA X THINK 32B**, arXiv preprint [arXiv:2601.03286](https://arxiv.org/abs/2601.03286), 2025.
- HyperCLOVA X Team, ..., <u>SJ Kim</u> et al, **HyperCLOVA X THINK Technical Report**, arXiv preprint [arXiv:2506.22403](https://arxiv.org/abs/2506.22403), 2025.
- KM Yoo, ..., <u>SJ Kim</u> et al, **HyperCLOVA X Technical Report**, arXiv preprint [arXiv:2404.01954](https://arxiv.org/abs/2404.01954), 2024.
- <u>SJ Kim</u>, SH Kim, J Park, KM Yoo, IH Kang, **The Bi-Cross Pretraining Method to Enhance Language Representation**, Proceedings of the 33th Annual Conference on Human and Cognitive Language Technology, 2021.
- BS Kim, ..., <u>SJ Kim</u> et al, **What Changes Can Large-scale Language Models Bring? Intensive Study on HyperCLOVA: Billions-scale Korean Generative Pretrained Transformers**, Proceedings of the 2021 Conference on Empirical Methods in Natural Language Processing, 2021
- <u>SJ Kim</u>, SB Suh, JS Park, SH Park, DH Jeon, SH Kim, KD Kim, IH Kang, **Self-supervised Learning Method using Heterogeneous Mass Corpus for Sentence Embedding Model**, Proceedings of the 32th Annual Conference on Human and Cognitive Language Technology, 2020.
- <u>SJ Kim</u>, WW Kim, YS Seol, IH Kang, **Cross Gated Mechanism to Improve Natural Language Understanding**, Proceedings of the 31th Annual Conference on Human and Cognitive Language Technology., 2019.
- <u>SJ Kim</u> and SY Park, **Lane-Level Positioning based on 3D Tracking Path of Traffic Signs**, in Proceedings of the 11th Joint Conference on Computer Vision, Imaging and Computer Graphics Theory and Applications - Volume 3: VISAPP, (VISIGRAPP 2016), 2016.

## 특허

- **사용자별 최적화된 코딩 환경 제공 방법, 장치 및 컴퓨터 프로그램**
  *KR 특허출원 No. 1020230177976*, 2025년 KR1020250088172A로 공개
  [DOI 링크](https://doi.org/10.8080/1020230177976)

- **대화 시스템에서 불명확한 의도 쿼리 처리 방법 및 시스템**
  *US 특허 No. US11403345B2*, 2022년 등록
  [Google Patents 링크](https://patents.google.com/patent/US11403345B2)

</div>

<div style="text-align: center; margin-top: 50px;">
  <img src="{{site.url}}/assets/imgs/SAJA.png" width="60%" />
</div>

<script>
function setLang(lang) {
  document.querySelector('.lang-en').classList.remove('active');
  document.querySelector('.lang-ko').classList.remove('active');
  document.getElementById('btn-en').classList.remove('active');
  document.getElementById('btn-ko').classList.remove('active');

  document.querySelector('.lang-' + lang).classList.add('active');
  document.getElementById('btn-' + lang).classList.add('active');
  localStorage.setItem('lang', lang);
}

(function() {
  var saved = localStorage.getItem('lang');
  if (saved) {
    setLang(saved);
  } else {
    var browserLang = navigator.language || navigator.userLanguage;
    setLang(browserLang.startsWith('ko') ? 'ko' : 'en');
  }
})();
</script>
