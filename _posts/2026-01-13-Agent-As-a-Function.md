---
layout: post
title:  "Agent As a Function"
date:   2026-01-13 19:00:00 +0900
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

The second topic I want to share is Agent as a Function.

**TL;DR**

1. In the past, a single LLM call or LLM Workflow replaced a function. Now, an LLM Agent can replace a function within a larger system.
2. Define the agent's goal via system prompt, and provide validation rules and validation tools so the agent can self-assess.
3. The agent autonomously iterates until the task is validated, creating what I call an "autonomous function."

In the early days of LLM adoption, a single LLM API call or LLM Workflow served as a function replacement. You would send a prompt, receive a response, and use that output in your application. This was already powerful because natural language became an interface for computation.

But now, LLM Agents are no longer just chatbots. They are becoming components within larger systems, autonomous units that can accomplish complex tasks independently.

I think of this as "Agent as a Function." Instead of a simple input-output transformation, an agent takes a goal, uses tools to validate its own work, and iterates until the task is complete.

There are three key components. First is goal definition via system prompt. The system prompt specifies what the agent needs to accomplish. It's not just instructions but a specification of the desired outcome, including validation rules so the agent knows when it has succeeded. Second is validation tools in the harness. The agent's execution environment provides tools for validation like syntax checkers, test runners, and schema validators. The agent uses these tools to self-assess its output before returning.

Here's what an agent function looks like in practice.

```python
# System prompt defines the goal and validation rules
system_prompt = """You are a code review agent.
Your goal is to analyze the given code and provide actionable feedback.

## Validation Rules
- All identified issues must include line numbers
- Each suggestion must include a code example
- Output must be valid JSON format

Review the code thoroughly and validate your output
against these rules before returning.
"""

# Harness provides validation tools
def run_json_validator(output):
    # Validates output is proper JSON
    ...

def run_schema_checker(output, schema):
    # Checks output matches expected schema
    ...

# Create the agent function
agent = create_agent(
    system_prompt=system_prompt,
    tools=[run_json_validator, run_schema_checker],
    max_iterations=5
)

# Call the agent like a function
result = agent(code_to_review)
```

The agent autonomously loops until validation passes. It attempts the task, uses the validation tools to check its output, and if validation fails, it identifies issues and retries. The agent takes responsibility for the quality of its output. It doesn't just generate but verifies, iterates, and ensures correctness.

Why does this matter? When agents self-validate, you can trust their outputs in production systems. Instead of humans reviewing every LLM output, agents handle quality assurance internally. And because each agent guarantees its output contract, they can be composed into larger pipelines predictably.

Some practical tips for designing agent functions. Be specific about what "done" looks like because vague goals lead to vague outputs. Provide the right validation tools because an agent can only validate what it can measure. Set reasonable boundaries like max iterations, timeouts, and fallback behaviors. And log the agent's reasoning and validation attempts for debugging.

This shift from "LLM as a Function" to "Agent as a Function" is a fundamental change in how we build AI-powered systems. By combining goal-driven prompts, self-validation rules, and validation tools, we create autonomous units that can be trusted to complete tasks correctly.

</div>

<div class="lang-ko" markdown="1">

두 번째로 공유하고 싶은 주제는 함수로서의 에이전트(Agent as a Function)입니다.

**TL;DR**

1. 과거에는 단일 LLM 호출 또는 LLM Workflow가 함수를 대체했다. 이제는 LLM 에이전트가 더 큰 시스템 내에서 함수를 대체할 수 있다.
2. 시스템 프롬프트로 에이전트의 목표를 정의하고, 에이전트가 스스로 평가할 수 있도록 검증 규칙과 검증 도구를 제공한다.
3. 에이전트는 작업이 검증될 때까지 자율적으로 반복하며, 이것을 "자율 함수"라고 부른다.

LLM 도입 초기에는 단일 LLM API 호출 또는 LLM Workflow가 함수를 대체하는 역할을 했습니다. 프롬프트를 보내고 응답을 받아 애플리케이션에서 사용하는 방식이었죠. 자연어가 연산의 인터페이스가 되었기 때문에 이것만으로도 강력했습니다.

하지만 이제 LLM 에이전트는 더 이상 챗봇에 그치지 않습니다. 더 큰 시스템 내의 컴포넌트가 되어가고 있고, 복잡한 작업을 독립적으로 수행할 수 있는 자율적인 단위가 되고 있습니다.

저는 이것을 "함수로서의 에이전트"라고 생각합니다. 단순한 입력-출력 변환이 아니라 에이전트가 목표를 받아 도구를 사용해 자신의 작업을 검증하고, 작업이 완료될 때까지 반복합니다.

세 가지 핵심 구성 요소가 있습니다. 첫째는 시스템 프롬프트를 통한 목표 정의입니다. 시스템 프롬프트는 에이전트가 무엇을 달성해야 하는지 명시하며, 단순한 지시사항이 아니라 원하는 결과의 명세입니다. 여기에 검증 규칙도 포함되어 에이전트가 언제 성공했는지 알 수 있습니다. 둘째는 하네스의 검증 도구입니다. 에이전트의 실행 환경은 구문 검사기, 테스트 실행기, 스키마 검증기 같은 검증 도구를 제공합니다. 에이전트는 이 도구들을 사용해 결과를 반환하기 전에 스스로 평가합니다.

실제로 에이전트 함수는 다음과 같은 모습입니다.

```python
# 시스템 프롬프트로 목표와 검증 규칙을 정의
system_prompt = """You are a code review agent.
Your goal is to analyze the given code and provide actionable feedback.

## Validation Rules
- All identified issues must include line numbers
- Each suggestion must include a code example
- Output must be valid JSON format

Review the code thoroughly and validate your output
against these rules before returning.
"""

# 하네스가 검증 도구를 제공
def run_json_validator(output):
    # 출력이 올바른 JSON인지 검증
    ...

def run_schema_checker(output, schema):
    # 출력이 예상 스키마와 일치하는지 확인
    ...

# 에이전트 함수 생성
agent = create_agent(
    system_prompt=system_prompt,
    tools=[run_json_validator, run_schema_checker],
    max_iterations=5
)

# 함수처럼 에이전트 호출
result = agent(code_to_review)
```

에이전트는 검증이 통과할 때까지 자율적으로 루프를 돕니다. 작업을 시도하고, 검증 도구로 출력을 확인하고, 검증이 실패하면 문제를 식별하고 재시도합니다. 에이전트는 출력의 품질에 책임을 집니다. 단순히 생성하는 것이 아니라 검증하고, 반복하고, 정확성을 보장합니다.

왜 이것이 중요할까요? 에이전트가 스스로 검증하면 프로덕션 시스템에서 출력을 신뢰할 수 있습니다. 인간이 모든 LLM 출력을 검토하는 대신 에이전트가 내부적으로 품질 보증을 처리합니다. 그리고 각 에이전트가 출력 계약을 보장하므로 예측 가능하게 더 큰 파이프라인으로 조합할 수 있습니다.

에이전트 함수 설계를 위한 실용적인 팁입니다. "완료"가 어떤 모습인지 구체적으로 정의해야 합니다. 모호한 목표는 모호한 출력으로 이어지기 때문입니다. 적절한 검증 도구를 제공해야 합니다. 에이전트는 측정할 수 있는 것만 검증할 수 있기 때문입니다. 최대 반복 횟수, 타임아웃, 폴백 동작 같은 합리적인 경계를 설정하세요. 그리고 디버깅을 위해 에이전트의 추론과 검증 시도를 로깅하세요.

"함수로서의 LLM"에서 "함수로서의 에이전트"로의 전환은 AI 기반 시스템 구축 방식의 근본적인 변화입니다. 목표 지향적 프롬프트, 자체 검증 규칙, 검증 도구를 결합함으로써 작업을 올바르게 완료할 것으로 신뢰할 수 있는 자율 단위를 만들 수 있습니다.

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
