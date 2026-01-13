---
layout: post
title:  "Agent As a Function"
date:   2025-01-13 19:00:00 +0900
categories: [Research, Engineering, LLM, Agent]
---

<style>
.lang-switch {
  font-size: 0.85em;
  color: #999;
  margin-bottom: 20px;
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
  font-weight: 600;
}
.lang-en, .lang-ko { display: none; }
.lang-en.active, .lang-ko.active { display: block; }
</style>

<div class="lang-switch">
  <a id="btn-en" onclick="setLang('en')">EN</a> | <a id="btn-ko" onclick="setLang('ko')">KO</a>
</div>

<div class="lang-en" markdown="1">

## From LLM Calls to Autonomous Agents

In the early days of LLM adoption, a single LLM API call served as a function replacement. You would send a prompt, receive a response, and use that output in your application. This was revolutionary—natural language became the new interface for computation.

But we've entered a new era. LLM Agents are no longer just chatbots responding to user queries. They are becoming **autonomous functions** within larger systems—components that can be called upon to accomplish complex tasks independently.

## The Evolution: LLM Call → Agent as a Function

**Before (LLM as a Function):**
```
input → LLM Call → output
```
A simple, stateless transformation. One prompt in, one response out.

**Now (Agent as a Function):**
```
input → Agent (goal + tools + validation) → verified output
```
A goal-driven, self-validating, autonomous execution unit.

## What Makes an Agent a Function?

An Agent as a Function consists of three key components:

### 1. Goal Definition via System Prompt

The system prompt defines **what** the agent needs to accomplish. It's not just instructions—it's a specification of the desired outcome.

```
You are a code review agent. Your goal is to:
1. Analyze the given code for bugs and security issues
2. Suggest improvements with concrete examples
3. Ensure all suggestions are actionable and specific
```

### 2. Validation Rules for Self-Assessment

The agent needs to know when it has succeeded. Validation rules allow the agent to **self-assess** its output before returning.

```
Validation Rules:
- All identified issues must include line numbers
- Each suggestion must include a code example
- Security issues must reference relevant CWE/CVE if applicable
- Output must be valid JSON format
```

### 3. Validation Tools in the Agent Harness

The agent's harness (execution environment) provides **tools for validation**:

- **Syntax checkers**: Verify code compiles/parses correctly
- **Test runners**: Execute tests to verify functionality
- **Schema validators**: Ensure output matches expected format
- **External APIs**: Cross-reference with external sources

## The Autonomous Loop

When you call an Agent as a Function, it enters an autonomous loop:

```
while not validated:
    1. Attempt to complete the task
    2. Use validation tools to check output
    3. If validation fails, identify issues and retry
    4. If validation passes, return result
```

This is fundamentally different from a simple LLM call. The agent **takes responsibility** for the quality of its output. It doesn't just generate—it verifies, iterates, and ensures correctness.

## Why This Matters

### Reliability at Scale
When agents self-validate, you can trust their outputs in production systems. No more hoping the LLM got it right—the agent confirms it.

### Composability
Agents as Functions can be composed into larger pipelines. Each agent guarantees its output contract, making system design predictable.

### Reduced Human Oversight
Instead of humans reviewing every LLM output, agents handle quality assurance internally. Humans only need to intervene on genuine edge cases.

## Designing Effective Agent Functions

1. **Be Specific About Success**: Vague goals lead to vague outputs. Define exactly what "done" looks like.

2. **Provide the Right Tools**: An agent can only validate what it can measure. Give it the tools it needs.

3. **Set Reasonable Boundaries**: Define max iterations, timeouts, and fallback behaviors for when validation repeatedly fails.

4. **Design for Observability**: Log the agent's reasoning and validation attempts. You'll need this for debugging and improvement.

## Conclusion

The shift from "LLM as a Function" to "Agent as a Function" represents a fundamental change in how we build AI-powered systems. By combining goal-driven prompts, self-validation rules, and validation tools, we create autonomous units that can be trusted to complete tasks correctly.

This is not just an incremental improvement—it's a new paradigm. Welcome to the age of autonomous functions.

</div>

<div class="lang-ko" markdown="1">

## LLM 호출에서 자율 에이전트로

LLM 도입 초기에는 단일 LLM API 호출이 함수를 대체하는 역할을 했습니다. 프롬프트를 보내고 응답을 받아 애플리케이션에서 사용하는 방식이었죠. 이것은 혁명적이었습니다—자연어가 새로운 연산 인터페이스가 되었으니까요.

하지만 우리는 새로운 시대에 진입했습니다. LLM 에이전트는 더 이상 사용자 쿼리에 응답하는 챗봇에 그치지 않습니다. 이제 에이전트는 더 큰 시스템 내에서 **자율적인 함수**가 되어가고 있습니다—복잡한 작업을 독립적으로 수행할 수 있는 컴포넌트 말입니다.

## 진화: LLM 호출 → 함수로서의 에이전트

**이전 (함수로서의 LLM):**
```
입력 → LLM 호출 → 출력
```
단순하고 상태가 없는 변환. 하나의 프롬프트가 들어가고, 하나의 응답이 나옴.

**현재 (함수로서의 에이전트):**
```
입력 → 에이전트 (목표 + 도구 + 검증) → 검증된 출력
```
목표 지향적이고, 자체 검증하는, 자율적인 실행 단위.

## 에이전트를 함수로 만드는 것은 무엇인가?

함수로서의 에이전트는 세 가지 핵심 구성 요소로 이루어집니다:

### 1. 시스템 프롬프트를 통한 목표 정의

시스템 프롬프트는 에이전트가 **무엇을** 달성해야 하는지를 정의합니다. 단순한 지시사항이 아니라 원하는 결과의 명세입니다.

```
당신은 코드 리뷰 에이전트입니다. 목표는 다음과 같습니다:
1. 주어진 코드의 버그와 보안 이슈 분석
2. 구체적인 예시와 함께 개선 사항 제안
3. 모든 제안은 실행 가능하고 구체적이어야 함
```

### 2. 자체 평가를 위한 검증 규칙

에이전트는 언제 성공했는지 알아야 합니다. 검증 규칙은 에이전트가 결과를 반환하기 전에 **스스로 평가**할 수 있게 합니다.

```
검증 규칙:
- 식별된 모든 이슈는 줄 번호를 포함해야 함
- 각 제안에는 코드 예시가 포함되어야 함
- 보안 이슈는 해당되는 경우 관련 CWE/CVE를 참조해야 함
- 출력은 유효한 JSON 형식이어야 함
```

### 3. 에이전트 하네스의 검증 도구

에이전트의 하네스(실행 환경)는 **검증을 위한 도구**를 제공합니다:

- **구문 검사기**: 코드가 올바르게 컴파일/파싱되는지 확인
- **테스트 실행기**: 기능을 검증하기 위한 테스트 실행
- **스키마 검증기**: 출력이 예상 형식과 일치하는지 확인
- **외부 API**: 외부 소스와 교차 검증

## 자율 루프

함수로서의 에이전트를 호출하면 자율 루프에 진입합니다:

```
while not validated:
    1. 작업 완료 시도
    2. 검증 도구를 사용하여 출력 확인
    3. 검증 실패 시, 문제 식별 후 재시도
    4. 검증 통과 시, 결과 반환
```

이것은 단순한 LLM 호출과 근본적으로 다릅니다. 에이전트는 출력의 품질에 **책임**을 집니다. 단순히 생성하는 것이 아니라 검증하고, 반복하고, 정확성을 보장합니다.

## 왜 이것이 중요한가

### 대규모 신뢰성
에이전트가 스스로 검증하면 프로덕션 시스템에서 출력을 신뢰할 수 있습니다. LLM이 제대로 했기를 바라는 것이 아니라—에이전트가 확인합니다.

### 조합 가능성
함수로서의 에이전트는 더 큰 파이프라인으로 조합될 수 있습니다. 각 에이전트가 출력 계약을 보장하므로 시스템 설계가 예측 가능해집니다.

### 인간 감독 감소
인간이 모든 LLM 출력을 검토하는 대신 에이전트가 내부적으로 품질 보증을 처리합니다. 인간은 진정한 엣지 케이스에만 개입하면 됩니다.

## 효과적인 에이전트 함수 설계

1. **성공을 구체적으로 정의하라**: 모호한 목표는 모호한 출력으로 이어집니다. "완료"가 어떤 모습인지 정확히 정의하세요.

2. **적절한 도구를 제공하라**: 에이전트는 측정할 수 있는 것만 검증할 수 있습니다. 필요한 도구를 제공하세요.

3. **합리적인 경계를 설정하라**: 검증이 반복적으로 실패할 때를 위해 최대 반복 횟수, 타임아웃, 폴백 동작을 정의하세요.

4. **관찰 가능성을 위해 설계하라**: 에이전트의 추론과 검증 시도를 로깅하세요. 디버깅과 개선에 필요합니다.

## 결론

"함수로서의 LLM"에서 "함수로서의 에이전트"로의 전환은 AI 기반 시스템 구축 방식의 근본적인 변화를 나타냅니다. 목표 지향적 프롬프트, 자체 검증 규칙, 검증 도구를 결합함으로써 작업을 올바르게 완료할 것으로 신뢰할 수 있는 자율 단위를 만들 수 있습니다.

이것은 단순한 점진적 개선이 아닙니다—새로운 패러다임입니다. 자율 함수의 시대에 오신 것을 환영합니다.

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
