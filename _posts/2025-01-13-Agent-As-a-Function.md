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

Agents can work like functions too.

**TL;DR**

1. Traditional functions are procedure-driven: they execute a predefined algorithm. The path is fixed when we write the code.
2. Autonomous Functions are goal-driven: they use reasoning, tools, and validation loops to discover a path toward the goal during execution.
3. In this sense, an agent can be viewed as a function whose internal computation is adaptive rather than fixed. You define the goal via system prompt, provide validation rules and tools, and let it iterate until the goal is reached.

A traditional function is defined by its procedure. `sort(arr)` specifies *how* to do the work: the algorithm is written out step by step, and the function executes it the same way every time. We decide the path when we write the code; at runtime it just runs.

But some problems are easier to state as a goal than as a procedure. `book_cheapest_flight()` says *what* to achieve, not how. Which sites to check, how to compare them, when to stop. These steps can't all be known when we write the code. They have to be worked out while the function runs.

What if a function could do that working-out itself? Take a goal, reason about how to achieve it, try a strategy, check the result, try something else when it fails, and decide for itself when the task is truly complete?

This is what I call "Agent as a Function" or "Autonomous Function." A traditional function executes a predefined algorithm; an Autonomous Function discovers the algorithm during execution. Where a traditional function follows a fixed trajectory, an Autonomous Function searches for one. It reasons, calls tools, validates its own work, and iterates until the goal is reached.

Let me show this with a concrete example. Imagine we need a function that downloads a dataset from HuggingFace and normalizes it to OpenAI message format.

**Approach 1: Single LLM Call**

```python
def normalize_dataset(dataset_name: str) -> list:
    return llm.complete(f"Convert {dataset_name} to OpenAI format")
```

A single LLM call cannot solve this problem.

**Approach 2: LLM Workflow**

```python
def normalize_dataset(dataset_name: str) -> list:
    dataset_url = web_search(f"{dataset_name} huggingface download url")
    raw_data = download(dataset_url)

    for attempt in range(3):
        code = llm.complete(f"Write code to convert to OpenAI format: {raw_data[:1000]}...")
        # ... validation and execution logic ...

    raise RuntimeError("Failed after 3 attempts")
```

You can add retries, but everything is hardcoded. The number of attempts, what to do on failure, when to give up. The LLM has no say in this. It just generates code when asked. All decisions are made by the developer at write time, not by the model at runtime.

**Approach 3: Agent as a Function**

```python
system_prompt = """You are a data normalization agent.
Your goal is to download a HuggingFace dataset and convert it to OpenAI message format.

## Validation Rules
- Output must be valid JSON
- Each message must have 'role' and 'content' fields
- 'role' must be one of: 'system', 'user', 'assistant'
- All conversations must be properly structured

## Termination
- Call task_complete(result) when validation passes
- Call task_give_up(reason) if you've tried multiple approaches and none work
- Call task_impossible(reason) if the task is fundamentally impossible
"""

# BASE_TOOLS: capabilities to do the work
BASE_TOOLS = [
    web_search,       # search for dataset documentation
    read_file,        # read downloaded data
    write_file,       # write conversion code and output
    run_python,       # execute conversion code
]

# VALIDATION_TOOLS: verify the output
VALIDATION_TOOLS = [
    validate_json_schema,  # check OpenAI message format
    run_tests,             # run format validation tests
]

# TERMINAL_TOOLS: explicit task completion
TERMINAL_TOOLS = [
    task_complete,    # success with result
    task_give_up,     # tried but failed
    task_impossible,  # fundamentally can't be done
]

normalize_hf_to_openai = create_agent_function(
    name="normalize_hf_to_openai",
    system_prompt=system_prompt,
    tools=BASE_TOOLS + VALIDATION_TOOLS + TERMINAL_TOOLS,
    max_iterations=15
)

# Call it like any other function
result = normalize_hf_to_openai(dataset="squad_v2")
```

The agent searches for the dataset schema, writes conversion code, executes it, validates the output format, and if validation fails, it debugs and retries. It explicitly signals completion status via terminal tools.

The created Autonomous Function works like any other function within a system.

```python
def build_training_dataset(sources: list[str]) -> Dataset:
    normalized = []

    for source in sources:
        # Autonomous Function: data normalization
        result = normalize_hf_to_openai(dataset=source)

        if result.status == "complete":
            normalized.extend(result.data)
        elif result.status == "impossible":
            log.warning(f"Skipping {source}: {result.reason}")

    # Autonomous Function: deduplication
    deduped = deduplicate_conversations(normalized)

    # Autonomous Function: quality filtering
    filtered = filter_low_quality(deduped, threshold=0.8)

    # Note: All three Autonomous Functions above can be combined into one
    return Dataset(filtered)
```

Each Autonomous Component explicitly signals success, failure, or impossibility. The caller handles each case appropriately.

The key shift is from procedure-driven to goal-driven functions. A traditional function answers "what steps should I execute?" That answer is fixed in its code. An Autonomous Function answers "what goal should I achieve?" It works out the steps at runtime.

When designing these, clarity of the goal definition matters most. Vague goals lead to vague outputs. Terminal tools let the agent signal completion explicitly. And boundaries like max iterations and timeouts provide safety rails.

This is a fundamental shift in how we think about computation. Instead of writing code that specifies every step, we define goals and let intelligent agents figure out the trajectory. The function becomes a container for intelligent problem-solving rather than a fixed sequence of operations.

---

*A note on terminology: strictly speaking, every input-output mapping is a function. The "function" I mean here is the everyday one we write in code: a procedure whose steps are fixed when we write it.*

</div>

<div class="lang-ko" markdown="1">

Agent도 하나의 함수처럼 동작할 수 있다.

**TL;DR**

1. 기존 함수는 procedure-driven이다. 미리 정의된 알고리즘을 실행하며, 경로는 코드를 작성하는 시점에 고정된다.
2. Autonomous Function은 goal-driven이다. 추론, 도구, 검증 루프를 통해 실행 중에 목표로 가는 경로를 찾아낸다.
3. 이런 의미에서 Agent는 내부 연산이 고정된 게 아니라 적응적인 함수로 볼 수 있다. 시스템 프롬프트로 목표를 정의하고, 검증 규칙과 도구를 주면, 목표에 도달할 때까지 스스로 반복한다.

기존 함수는 절차(procedure)로 정의된다. `sort(arr)`는 *어떻게* 할지를 명시한다. 알고리즘이 한 단계씩 적혀 있고, 함수는 매번 같은 방식으로 그걸 실행한다. 경로는 코드를 작성할 때 정해지고, 런타임에는 그저 실행될 뿐이다.

그런데 어떤 문제는 절차보다 목표로 기술하는 게 더 자연스럽다. `book_cheapest_flight()`는 *무엇을* 달성할지를 말하지, 어떻게 할지는 말하지 않는다. 어떤 사이트를 확인할지, 어떻게 비교할지, 언제 멈출지. 이런 단계들은 코드를 작성하는 시점에 다 알 수 없다. 함수가 실행되면서 알아내야 한다.

함수가 그 "알아내는 일"을 스스로 한다면 어떨까? 목표를 받아서 어떻게 달성할지 추론하고, 한 전략을 시도하고, 결과를 확인하고, 실패하면 다른 걸 시도하고, 작업이 정말 끝났는지 스스로 판단한다면?

이걸 나는 "Agent as a Function" 또는 "Autonomous Function"이라고 부른다. 기존 함수가 미리 정의된 알고리즘을 실행한다면, Autonomous Function은 실행 중에 알고리즘을 발견한다. 기존 함수가 고정된 trajectory를 따른다면, Autonomous Function은 trajectory를 탐색한다. 추론하고, 도구를 호출하고, 자기 작업을 검증하면서, 목표에 도달할 때까지 반복한다.

예시로 보자. HuggingFace에서 데이터셋 받아서 OpenAI 메시지 포맷으로 변환하는 함수가 필요하다고 해보자.

**Approach 1: Single LLM Call**

```python
def normalize_dataset(dataset_name: str) -> list:
    return llm.complete(f"Convert {dataset_name} to OpenAI format")
```

한번의 LLM 호출로는 이 문제를 해결할 수 없다.

**Approach 2: LLM Workflow**

```python
def normalize_dataset(dataset_name: str) -> list:
    dataset_url = web_search(f"{dataset_name} huggingface download url")
    raw_data = download(dataset_url)

    for attempt in range(3):
        code = llm.complete(f"Write code to convert to OpenAI format: {raw_data[:1000]}...")
        # ... validation and execution logic ...

    raise RuntimeError("Failed after 3 attempts")
```

재시도를 넣을 수 있지만, 다 하드코딩이다. 몇 번 시도할지, 실패하면 뭘 할지, 언제 포기할지. LLM한테 결정권이 없다. 시키면 코드 생성할 뿐이다. 결정은 전부 개발자가 코드 짤 때 내린다. 런타임에 모델이 판단하는 게 아니다.

**Approach 3: Agent as a Function**

```python
system_prompt = """You are a data normalization agent.
Your goal is to download a HuggingFace dataset and convert it to OpenAI message format.

## Validation Rules
- Output must be valid JSON
- Each message must have 'role' and 'content' fields
- 'role' must be one of: 'system', 'user', 'assistant'
- All conversations must be properly structured

## Termination
- Call task_complete(result) when validation passes
- Call task_give_up(reason) if you've tried multiple approaches and none work
- Call task_impossible(reason) if the task is fundamentally impossible
"""

# BASE_TOOLS: 작업용 도구
BASE_TOOLS = [
    web_search,       # 문서 검색
    read_file,        # 데이터 읽기
    write_file,       # 코드/결과 쓰기
    run_python,       # 코드 실행
]

# VALIDATION_TOOLS: 검증용 도구
VALIDATION_TOOLS = [
    validate_json_schema,  # 포맷 검증
    run_tests,             # 테스트 실행
]

# TERMINAL_TOOLS: 종료 신호
TERMINAL_TOOLS = [
    task_complete,    # 성공
    task_give_up,     # 포기
    task_impossible,  # 불가능
]

normalize_hf_to_openai = create_agent_function(
    name="normalize_hf_to_openai",
    system_prompt=system_prompt,
    tools=BASE_TOOLS + VALIDATION_TOOLS + TERMINAL_TOOLS,
    max_iterations=15
)

# 다른 함수처럼 호출
result = normalize_hf_to_openai(dataset="squad_v2")
```

Agent가 스키마 찾고, 변환 코드 짜고, 실행하고, 결과 포맷 검증한다. 검증 실패하면 디버깅하고 다시 시도한다. 끝나면 종료 도구로 상태를 알린다.

제작된 Autonomous Function은 시스템 내에 하나의 함수처럼 동작한다.

```python
def build_training_dataset(sources: list[str]) -> Dataset:
    normalized = []

    for source in sources:
        # Autonomous Function: 데이터 정규화
        result = normalize_hf_to_openai(dataset=source)

        if result.status == "complete":
            normalized.extend(result.data)
        elif result.status == "impossible":
            log.warning(f"Skipping {source}: {result.reason}")

    # Autonomous Function: 중복 제거
    deduped = deduplicate_conversations(normalized)

    # Autonomous Function: 품질 필터링
    filtered = filter_low_quality(deduped, threshold=0.8)

    # 참고: 위 세 개의 Autonomous Function은 하나로 합칠 수도 있다
    return Dataset(filtered)
```

각 Autonomous Component가 성공, 실패, 불가능을 명시적으로 알려주니까, 호출하는 쪽에서 각 경우를 적절히 처리할 수 있다.

핵심은 procedure-driven 함수에서 goal-driven 함수로의 이동이다. 기존 함수는 "어떤 단계를 실행할까?"에 답하고, 그 답은 코드에 고정되어 있다. Autonomous Function은 "어떤 목표를 달성할까?"에 답하고, 단계는 런타임에 알아낸다.

설계할 때는 목표 정의의 명확성이 가장 중요하다. 모호한 목표는 모호한 결과로 이어진다. 종료 도구는 Agent가 완료를 명시적으로 알릴 수 있게 한다. 최대 반복 횟수나 타임아웃 같은 경계는 안전장치 역할을 한다.

이건 연산에 대한 사고방식의 근본적인 변화다. 모든 단계를 명시하는 코드를 작성하는 대신, 목표를 정의하고 지적 Agent가 trajectory를 알아내게 한다. 함수가 고정된 연산 순서가 아니라 지적 문제 해결을 담는 컨테이너가 된다.

---

*용어에 대한 노트: 엄밀히 말하면 모든 입출력 매핑은 함수다. 여기서 말하는 "함수"는 우리가 일상적으로 코드에 작성하는 함수, 즉 단계가 작성 시점에 고정되는 절차를 뜻한다.*

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
