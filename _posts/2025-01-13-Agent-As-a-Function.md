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

1. Traditional functions follow a fixed trajectory, executing mechanically along predetermined paths.
2. An Autonomous Function performs intelligent computation within the function, following a non-fixed trajectory until the goal is achieved.
3. Define the goal via system prompt, provide validation rules and tools, and let the agent iterate until completion.

Traditional functions execute along fixed trajectories. Given the same input, they follow predetermined paths mechanically and produce the same output. This is deterministic and predictable.

But what if a function could think? What if it could adapt its approach based on intermediate results, try different strategies when one fails, and decide for itself when the task is truly complete?

I call this "Agent as a Function" or "Autonomous Function." Unlike traditional functions that follow fixed trajectories, an Autonomous Function performs intelligent computation within itself. It takes a goal, reasons about how to achieve it, validates its own work, and iterates along non-fixed trajectories until the goal is reached.

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

The key insight here is that we're moving from deterministic functions to goal-oriented functions. Traditional functions ask "what steps should I execute?" while Autonomous Functions ask "what goal should I achieve?"

When designing these, clarity of the goal definition matters most. Vague goals lead to vague outputs. Terminal tools let the agent signal completion explicitly. And boundaries like max iterations and timeouts provide safety rails.

This is a fundamental shift in how we think about computation. Instead of writing code that specifies every step, we define goals and let intelligent agents figure out the trajectory. The function becomes a container for intelligent problem-solving rather than a fixed sequence of operations.

</div>

<div class="lang-ko" markdown="1">

Agent도 하나의 함수처럼 동작할 수 있습니다.

**TL;DR**

1. 기존 함수는 고정된 trajectory를 따라 기계적으로 실행됩니다.
2. Autonomous Function은 함수 내에서 지적 연산을 수행하여 고정되지 않은 trajectory를 따라 목적을 달성할 때까지 실행합니다.
3. 시스템 프롬프트로 목표를 정의하고, 검증 규칙과 도구를 줘서 Agent가 스스로 완료할 때까지 반복하게 합니다.

기존 함수는 고정된 trajectory를 따라 실행됩니다. 같은 입력이 들어오면 정해진 경로를 기계적으로 따라가고, 같은 출력을 냅니다. 결정적이고 예측 가능합니다.

그런데 함수가 생각할 수 있다면 어떨까요? 중간 결과를 보고 접근 방식을 바꾸고, 하나가 실패하면 다른 전략을 시도하고, 작업이 정말 끝났는지 스스로 판단할 수 있다면?

저는 이걸 "Agent as a Function" 또는 "Autonomous Function"이라고 부릅니다. 고정된 trajectory를 따르는 기존 함수와 달리, Autonomous Function은 함수 내에서 지적 연산을 수행합니다. 목표를 받아서 어떻게 달성할지 추론하고, 자기 작업을 검증하고, 목표에 도달할 때까지 고정되지 않은 trajectory를 따라 반복합니다.

예시로 보겠습니다. HuggingFace에서 데이터셋 받아서 OpenAI 메시지 포맷으로 변환하는 함수가 필요하다고 해봅시다.

**Approach 1: Single LLM Call**

```python
def normalize_dataset(dataset_name: str) -> list:
    return llm.complete(f"Convert {dataset_name} to OpenAI format")
```

한번의 LLM 호출로는 이 문제를 해결할 수 없습니다.

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

재시도를 넣을 수 있지만, 다 하드코딩입니다. 몇 번 시도할지, 실패하면 뭘 할지, 언제 포기할지. LLM한테 결정권이 없습니다. 시키면 코드 생성할 뿐입니다. 결정은 전부 개발자가 코드 짤 때 내립니다. 런타임에 모델이 판단하는 게 아닙니다.

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

Agent가 스키마 찾고, 변환 코드 짜고, 실행하고, 결과 포맷 검증합니다. 검증 실패하면 디버깅하고 다시 시도합니다. 끝나면 종료 도구로 상태를 알립니다.

제작된 Autonomous Function은 시스템 내에 하나의 함수처럼 동작합니다.

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

    # 참고: 위 세 개의 Autonomous Function은 하나로 합칠 수도 있습니다
    return Dataset(filtered)
```

각 Autonomous Component가 성공, 실패, 불가능을 명시적으로 알려주니까, 호출하는 쪽에서 각 경우를 적절히 처리할 수 있습니다.

핵심은 결정적 함수에서 목표 지향 함수로 이동하는 것입니다. 기존 함수는 "어떤 단계를 실행할까?"를 묻지만, Autonomous Function은 "어떤 목표를 달성할까?"를 묻습니다.

설계할 때는 목표 정의의 명확성이 가장 중요합니다. 모호한 목표는 모호한 결과로 이어집니다. 종료 도구는 Agent가 완료를 명시적으로 알릴 수 있게 합니다. 최대 반복 횟수나 타임아웃 같은 경계는 안전장치 역할을 합니다.

이건 연산에 대한 사고방식의 근본적인 변화입니다. 모든 단계를 명시하는 코드를 작성하는 대신, 목표를 정의하고 지적 Agent가 trajectory를 알아내게 합니다. 함수가 고정된 연산 순서가 아니라 지적 문제 해결을 담는 컨테이너가 됩니다.

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
