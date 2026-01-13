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

Let me show this with a concrete example. Imagine we need a `fix_bug` function that takes a bug description and returns working code.

**Approach 1: Single LLM Call**

```python
def fix_bug(issue: str) -> str:
    return llm.complete(f"Fix this bug: {issue}")
```

Simple, but unreliable. The LLM might hallucinate, generate syntax errors, or produce code that doesn't actually fix the bug. There's no verification.

**Approach 2: LLM Workflow**

```python
def fix_bug(issue: str) -> str:
    # Step 1: Analyze
    analysis = llm.complete(f"Analyze this bug: {issue}")

    # Step 2: Search for similar issues
    references = web_search(f"how to fix {analysis}")

    # Step 3: Generate fix
    fix = llm.complete(f"Based on {references}, generate fix for {issue}")

    # Step 4: Format
    return llm.complete(f"Format this code properly: {fix}")
```

Better structure, but still a fixed pipeline. If step 3 fails, we can't go back to step 2. No iteration, no self-correction.

**Approach 3: Agent as a Function**

```python
system_prompt = """You are a bug fixing agent.
Your goal is to fix the given bug and ensure tests pass.

## Validation Rules
- All existing tests must pass
- New regression test must be added
- Code must follow project style guide
"""

# BASE_TOOLS: capabilities to do the work
BASE_TOOLS = [
    read_file,        # read source code
    write_file,       # write fix
    web_search,       # search for solutions
    run_terminal,     # execute commands
]

# VALIDATION_TOOLS: verify the fix works
VALIDATION_TOOLS = [
    run_tests,        # run test suite
    run_linter,       # check style
]

fix_bug = create_agent_function(
    name="fix_bug",
    system_prompt=system_prompt,
    tools=BASE_TOOLS + VALIDATION_TOOLS,
    max_iterations=10
)

# Call it like any other function
result = fix_bug(issue="Login fails when password contains special characters")
```

The agent reads the codebase, searches for solutions, writes a fix, runs tests, and if tests fail, it analyzes why and tries again. It loops until validation passes or max iterations reached.

Here's how this fits into a larger system.

```python
def handle_bug_report(report: BugReport) -> Resolution:
    # Autonomous function fixes the bug
    fix_result = fix_bug(issue=report.description)

    # Another autonomous function reviews the fix
    review = review_code_change(
        diff=fix_result.diff,
        guidelines=team_guidelines
    )

    # Create PR if review passes
    if review.approved:
        pr = create_pull_request(
            title=f"Fix: {report.title}",
            branch=fix_result.branch
        )
        return Resolution(status="fixed", pr=pr)

    return Resolution(status="needs_review", details=review.comments)
```

Each autonomous function guarantees its output contract. The caller doesn't need to know an LLM is involved internally.

Why does this matter? When agents self-validate, you can trust their outputs in production. Instead of humans reviewing every LLM output, agents handle quality assurance internally. And because each agent guarantees its contract, you can build complex systems from these reliable building blocks.

Some practical tips for designing autonomous functions. Be specific about what "done" looks like because vague goals lead to vague outputs. Provide the right validation tools because an agent can only validate what it can measure. Set reasonable boundaries like max iterations, timeouts, and fallback behaviors.

This shift from "LLM as a Function" to "Agent as a Function" is a fundamental change in how we build AI-powered systems. By combining goal-driven prompts, self-validation, and validation tools, we create autonomous units that can be trusted as reliable components in larger systems.

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

구체적인 예시로 설명하겠습니다. Bug Description을 받아서 동작하는 코드를 반환하는 `fix_bug` 함수가 필요하다고 가정해봅시다.

**Approach 1: Single LLM Call**

```python
def fix_bug(issue: str) -> str:
    return llm.complete(f"Fix this bug: {issue}")
```

간단하지만 신뢰할 수 없습니다. LLM이 Hallucination을 하거나, Syntax Error를 생성하거나, 실제로 Bug를 고치지 못하는 코드를 만들 수 있습니다. Verification이 없습니다.

**Approach 2: LLM Workflow**

```python
def fix_bug(issue: str) -> str:
    # Step 1: Analyze
    analysis = llm.complete(f"Analyze this bug: {issue}")

    # Step 2: Search for similar issues
    references = web_search(f"how to fix {analysis}")

    # Step 3: Generate fix
    fix = llm.complete(f"Based on {references}, generate fix for {issue}")

    # Step 4: Format
    return llm.complete(f"Format this code properly: {fix}")
```

구조는 더 좋지만, 여전히 고정된 Pipeline입니다. Step 3이 실패해도 Step 2로 돌아갈 수 없습니다. Iteration도, Self-Correction도 없습니다.

**Approach 3: Agent as a Function**

```python
system_prompt = """You are a bug fixing agent.
Your goal is to fix the given bug and ensure tests pass.

## Validation Rules
- All existing tests must pass
- New regression test must be added
- Code must follow project style guide
"""

# BASE_TOOLS: 작업 수행을 위한 기본 기능
BASE_TOOLS = [
    read_file,        # Source Code 읽기
    write_file,       # Fix 작성
    web_search,       # Solution 검색
    run_terminal,     # Command 실행
]

# VALIDATION_TOOLS: Fix가 동작하는지 검증
VALIDATION_TOOLS = [
    run_tests,        # Test Suite 실행
    run_linter,       # Style 확인
]

fix_bug = create_agent_function(
    name="fix_bug",
    system_prompt=system_prompt,
    tools=BASE_TOOLS + VALIDATION_TOOLS,
    max_iterations=10
)

# 다른 함수처럼 호출
result = fix_bug(issue="Login fails when password contains special characters")
```

Agent는 Codebase를 읽고, Solution을 검색하고, Fix를 작성하고, Test를 실행합니다. Test가 실패하면 원인을 분석해서 다시 시도합니다. Validation이 통과하거나 Max Iteration에 도달할 때까지 Loop를 돕니다.

이 함수가 더 큰 시스템에서 어떻게 사용되는지 보겠습니다.

```python
def handle_bug_report(report: BugReport) -> Resolution:
    # Autonomous Function으로 Bug Fix
    fix_result = fix_bug(issue=report.description)

    # 다른 Autonomous Function으로 Code Review
    review = review_code_change(
        diff=fix_result.diff,
        guidelines=team_guidelines
    )

    # Review 통과 시 PR 생성
    if review.approved:
        pr = create_pull_request(
            title=f"Fix: {report.title}",
            branch=fix_result.branch
        )
        return Resolution(status="fixed", pr=pr)

    return Resolution(status="needs_review", details=review.comments)
```

각 Autonomous Function이 Output Contract를 보장합니다. 호출하는 쪽에서는 내부에 LLM이 관여하는지 알 필요가 없습니다.

왜 이것이 중요할까요? Agent가 스스로 Validation하면 Production System에서 Output을 신뢰할 수 있습니다. 사람이 모든 LLM Output을 검토하는 대신 Agent가 내부적으로 Quality Assurance를 처리합니다. 그리고 각 Agent가 Contract를 보장하므로 이 신뢰할 수 있는 Building Block으로 복잡한 시스템을 구축할 수 있습니다.

Autonomous Function 설계를 위한 실용적인 팁입니다. "완료"가 어떤 모습인지 구체적으로 정의해야 합니다. 모호한 목표는 모호한 Output으로 이어지기 때문입니다. 적절한 Validation Tool을 제공해야 합니다. Agent는 측정할 수 있는 것만 Validation할 수 있기 때문입니다. Max Iteration, Timeout, Fallback 같은 합리적인 경계를 설정하세요.

"LLM as a Function"에서 "Agent as a Function"으로의 전환은 AI 기반 시스템 구축 방식의 근본적인 변화입니다. Goal-Driven Prompt, Self-Validation, Validation Tool을 결합함으로써 더 큰 시스템의 신뢰할 수 있는 컴포넌트로 사용할 수 있는 Autonomous Unit을 만들 수 있습니다.

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
