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

Here's what an autonomous function looks like in practice. Imagine we need a function that generates an API client from a specification. It needs to search for documentation, generate code, and validate that the code actually works.

```python
system_prompt = """You are an API client generator.
Your goal is to generate a working API client from the given spec.

## Validation Rules
- Generated code must pass syntax check
- All endpoints in the spec must have corresponding methods
- Unit tests must pass
- Code must follow project style guide

Use web search to find official API documentation.
Generate code, then validate before returning.
"""

# BASE_TOOLS: fundamental capabilities for the task
BASE_TOOLS = [
    web_search,       # search for API docs and examples
    read_file,        # read existing code for context
    write_file,       # write generated code
]

# VALIDATION_TOOLS: for self-assessment
VALIDATION_TOOLS = [
    run_syntax_check,  # verify code syntax
    run_tests,         # execute unit tests
    run_linter,        # check style compliance
]

# Create the autonomous function with a descriptive name
generate_api_client = create_agent_function(
    name="generate_api_client",
    system_prompt=system_prompt,
    tools=BASE_TOOLS + VALIDATION_TOOLS,
    max_iterations=10
)

# Call it like any other function
client_code = generate_api_client(spec="stripe_payments_v3")
```

The function autonomously loops until validation passes. It searches for docs, generates code, runs tests, and if something fails, it identifies the issue and retries. The function takes responsibility for its output quality.

Here's how this function fits into a larger system.

```python
def setup_payment_integration(config: IntegrationConfig) -> IntegrationBundle:
    # Generate API client using our autonomous function
    client_code = generate_api_client(spec=config.api_spec)

    # Generate tests using another autonomous function
    test_suite = generate_test_suite(
        code=client_code,
        coverage_target=0.8
    )

    # Generate documentation
    docs = generate_api_docs(
        code=client_code,
        format="markdown"
    )

    return IntegrationBundle(
        client=client_code,
        tests=test_suite,
        docs=docs
    )

# The caller doesn't need to know these are agent-powered
bundle = setup_payment_integration(payment_config)
```

Each autonomous function guarantees its output contract, so they compose predictably into larger pipelines. The caller doesn't need to know an LLM is involved internally.

Why does this matter? When agents self-validate, you can trust their outputs in production. Instead of humans reviewing every LLM output, agents handle quality assurance internally. And because each agent guarantees its contract, you can build complex systems from these reliable building blocks.

Some practical tips for designing autonomous functions. Be specific about what "done" looks like because vague goals lead to vague outputs. Provide the right validation tools because an agent can only validate what it can measure. Set reasonable boundaries like max iterations, timeouts, and fallback behaviors. And log the reasoning and validation attempts for debugging.

This shift from "LLM as a Function" to "Agent as a Function" is a fundamental change in how we build AI-powered systems. By combining goal-driven prompts, self-validation rules, and validation tools, we create autonomous units that can be trusted as reliable components in larger systems.

</div>

<div class="lang-ko" markdown="1">

두 번째로 공유하고 싶은 주제는 Agent as a Function입니다.

**TL;DR**

1. 과거에는 단일 LLM 호출 또는 LLM Workflow가 함수를 대체했다. 이제는 LLM Agent가 더 큰 시스템 내에서 함수를 대체할 수 있다.
2. System Prompt로 Agent의 목표를 정의하고, Agent가 스스로 평가할 수 있도록 Validation Rule과 Validation Tool을 제공한다.
3. Agent는 작업이 Validation될 때까지 자율적으로 반복하며, 이것을 "Autonomous Function"이라고 부른다.

LLM 도입 초기에는 단일 LLM API 호출 또는 LLM Workflow가 함수를 대체하는 역할을 했습니다. Prompt를 보내고 Response를 받아 애플리케이션에서 사용하는 방식이었죠. 자연어가 연산의 인터페이스가 되었기 때문에 이것만으로도 강력했습니다.

하지만 이제 LLM Agent는 더 이상 Chatbot에 그치지 않습니다. 더 큰 시스템 내의 컴포넌트가 되어가고 있고, 복잡한 작업을 독립적으로 수행할 수 있는 자율적인 단위가 되고 있습니다.

저는 이것을 "Agent as a Function"이라고 생각합니다. 단순한 Input-Output 변환이 아니라 Agent가 목표를 받아 Tool을 사용해 자신의 작업을 Validation하고, 작업이 완료될 때까지 반복합니다.

세 가지 핵심 구성 요소가 있습니다. 첫째는 System Prompt를 통한 목표 정의입니다. System Prompt는 Agent가 무엇을 달성해야 하는지 명시하며, 단순한 지시사항이 아니라 원하는 결과의 명세입니다. 여기에 Validation Rule도 포함되어 Agent가 언제 성공했는지 알 수 있습니다. 둘째는 Harness의 Validation Tool입니다. Agent의 실행 환경은 Syntax Checker, Test Runner, Schema Validator 같은 Validation Tool을 제공합니다. Agent는 이 Tool들을 사용해 결과를 반환하기 전에 스스로 평가합니다.

실제로 Autonomous Function은 다음과 같은 모습입니다. API Spec으로부터 API Client를 생성하는 함수가 필요하다고 가정해봅시다. 문서를 검색하고, 코드를 생성하고, 코드가 실제로 동작하는지 Validation해야 합니다.

```python
system_prompt = """You are an API client generator.
Your goal is to generate a working API client from the given spec.

## Validation Rules
- Generated code must pass syntax check
- All endpoints in the spec must have corresponding methods
- Unit tests must pass
- Code must follow project style guide

Use web search to find official API documentation.
Generate code, then validate before returning.
"""

# BASE_TOOLS: Task 수행을 위한 기본 기능
BASE_TOOLS = [
    web_search,       # API 문서와 예제 검색
    read_file,        # 기존 코드를 읽어 Context 파악
    write_file,       # 생성된 코드 작성
]

# VALIDATION_TOOLS: Self-Assessment를 위한 도구
VALIDATION_TOOLS = [
    run_syntax_check,  # 코드 Syntax 검증
    run_tests,         # Unit Test 실행
    run_linter,        # Style 준수 확인
]

# 명확한 이름으로 Autonomous Function 생성
generate_api_client = create_agent_function(
    name="generate_api_client",
    system_prompt=system_prompt,
    tools=BASE_TOOLS + VALIDATION_TOOLS,
    max_iterations=10
)

# 다른 함수처럼 호출
client_code = generate_api_client(spec="stripe_payments_v3")
```

함수는 Validation이 통과할 때까지 자율적으로 Loop를 돕니다. 문서를 검색하고, 코드를 생성하고, Test를 실행하고, 실패하면 문제를 식별해서 재시도합니다. 함수가 Output 품질에 책임을 집니다.

이 함수가 더 큰 시스템에서 어떻게 사용되는지 보겠습니다.

```python
def setup_payment_integration(config: IntegrationConfig) -> IntegrationBundle:
    # Autonomous Function으로 API Client 생성
    client_code = generate_api_client(spec=config.api_spec)

    # 다른 Autonomous Function으로 Test 생성
    test_suite = generate_test_suite(
        code=client_code,
        coverage_target=0.8
    )

    # Documentation 생성
    docs = generate_api_docs(
        code=client_code,
        format="markdown"
    )

    return IntegrationBundle(
        client=client_code,
        tests=test_suite,
        docs=docs
    )

# 호출하는 쪽에서는 Agent가 관여하는지 알 필요가 없다
bundle = setup_payment_integration(payment_config)
```

각 Autonomous Function이 Output Contract를 보장하므로, 예측 가능하게 더 큰 Pipeline으로 조합할 수 있습니다. 호출하는 쪽에서는 내부에 LLM이 관여하는지 알 필요가 없습니다.

왜 이것이 중요할까요? Agent가 스스로 Validation하면 Production System에서 Output을 신뢰할 수 있습니다. 사람이 모든 LLM Output을 검토하는 대신 Agent가 내부적으로 Quality Assurance를 처리합니다. 그리고 각 Agent가 Contract를 보장하므로 이 신뢰할 수 있는 Building Block으로 복잡한 시스템을 구축할 수 있습니다.

Autonomous Function 설계를 위한 실용적인 팁입니다. "완료"가 어떤 모습인지 구체적으로 정의해야 합니다. 모호한 목표는 모호한 Output으로 이어지기 때문입니다. 적절한 Validation Tool을 제공해야 합니다. Agent는 측정할 수 있는 것만 Validation할 수 있기 때문입니다. Max Iteration, Timeout, Fallback 같은 합리적인 경계를 설정하세요. 그리고 Debugging을 위해 Reasoning과 Validation 시도를 Logging하세요.

"LLM as a Function"에서 "Agent as a Function"으로의 전환은 AI 기반 시스템 구축 방식의 근본적인 변화입니다. Goal-Driven Prompt, Self-Validation Rule, Validation Tool을 결합함으로써 더 큰 시스템의 신뢰할 수 있는 컴포넌트로 사용할 수 있는 Autonomous Unit을 만들 수 있습니다.

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
