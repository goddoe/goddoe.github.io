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

It's time to use Agents as functions.

**TL;DR**

1. In the past, a single LLM call or LLM Workflow replaced a function. Now, an LLM Agent can replace a function within a larger system.
2. Define the agent's goal via system prompt, and provide validation rules and validation tools so the agent can self-assess.
3. The agent autonomously iterates until the task is validated, creating what I call an "autonomous function."

In the early days of LLM adoption, a single LLM API call or LLM Workflow served as a function replacement. You would send a prompt, receive a response, and use that output in your application. This was already powerful because natural language became an interface for computation.

But now, LLM Agents are no longer just chatbots. They are becoming components within larger systems, autonomous units that can accomplish complex tasks independently.

I call this intelligent computation capability "Agent as a Function" or "Autonomous Function." Instead of a simple input-output transformation, an agent takes a goal, uses tools to validate its own work, and iterates until the task is complete.

Let me show this with a concrete example. Imagine we need a function that downloads a dataset from HuggingFace and normalizes it to OpenAI message format.

**Approach 1: Single LLM Call**

```python
def normalize_dataset(dataset_name: str) -> list:
    return llm.complete(f"Convert {dataset_name} to OpenAI format")
```

This doesn't even make sense. The LLM can't actually download data or write files. It can only generate text based on what it knows.

**Approach 2: LLM Workflow**

```python
def normalize_dataset(dataset_name: str) -> list:
    schema = web_search(f"{dataset_name} huggingface schema")

    for attempt in range(3):
        code = llm.complete(f"Write code to convert {schema} to OpenAI format")
        try:
            exec(code)
            result = load_result()
            if validate_openai_format(result):
                return result
        except Exception as e:
            continue

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

Here's how this fits into a larger data pipeline.

```python
def build_training_dataset(sources: list[str]) -> Dataset:
    normalized = []

    for source in sources:
        # Each call is an autonomous function
        result = normalize_hf_to_openai(dataset=source)

        if result.status == "complete":
            normalized.extend(result.data)
        elif result.status == "impossible":
            log.warning(f"Skipping {source}: {result.reason}")

    # Another autonomous function for deduplication
    deduped = deduplicate_conversations(normalized)

    # Another for quality filtering
    filtered = filter_low_quality(deduped, threshold=0.8)

    return Dataset(filtered)
```

Each autonomous function explicitly signals success, failure, or impossibility. The caller handles each case appropriately.

The key when designing these is to define what "done" means clearly. Vague goals lead to vague outputs. You need terminal tools so the agent can signal completion. And you need boundaries like max iterations and timeouts.

This shift from "LLM as a Function" to "Agent as a Function" is a fundamental change in how we build AI-powered systems. Combining goal-driven prompts, self-validation, and explicit termination creates autonomous units that work as reliable components in larger systems.

</div>

<div class="lang-ko" markdown="1">

이제는 Agent를 함수처럼 써야 합니다.

**TL;DR**

1. 예전에는 LLM 한 번 호출하거나 여러 단계 엮은 워크플로우가 함수를 대신했습니다. 이제는 Agent가 그 자리를 대신할 수 있습니다.
2. 시스템 프롬프트로 목표를 정의하고, 검증 규칙과 검증 도구를 줘서 Agent가 스스로 결과를 평가하게 합니다.
3. Agent는 검증 통과할 때까지 알아서 반복합니다. 이게 "자율 함수"입니다.

초기에는 LLM API 한 번 호출하거나, 여러 호출을 엮은 워크플로우가 함수를 대신했습니다. 프롬프트 보내고 응답 받아서 쓰는 방식이죠. 자연어가 연산 인터페이스가 됐다는 것만으로도 충분히 강력했습니다.

근데 이제 Agent는 챗봇 수준을 넘어섰습니다. 큰 시스템 안에서 하나의 컴포넌트로 동작하고, 복잡한 작업을 혼자서 끝낼 수 있는 단위가 됐습니다.

저는 이 지적 연산 기능을 "Agent as a Function" 또는 "Autonomous Function"이라고 부릅니다. 단순히 입력 받고 출력 뱉는 게 아니라, 목표를 받아서 도구로 자기 작업을 검증하고, 될 때까지 반복합니다.

예시로 보겠습니다. HuggingFace에서 데이터셋 받아서 OpenAI 메시지 포맷으로 변환하는 함수가 필요하다고 해봅시다.

**Approach 1: Single LLM Call**

```python
def normalize_dataset(dataset_name: str) -> list:
    return llm.complete(f"Convert {dataset_name} to OpenAI format")
```

이건 말이 안 됩니다. LLM은 데이터를 다운로드하거나 파일을 쓸 수 없습니다. 아는 거 기반으로 텍스트만 생성할 뿐이죠.

**Approach 2: LLM Workflow**

```python
def normalize_dataset(dataset_name: str) -> list:
    schema = web_search(f"{dataset_name} huggingface schema")

    for attempt in range(3):
        code = llm.complete(f"Write code to convert {schema} to OpenAI format")
        try:
            exec(code)
            result = load_result()
            if validate_openai_format(result):
                return result
        except Exception as e:
            continue

    raise RuntimeError("Failed after 3 attempts")
```

재시도를 넣을 수 있지만, 다 하드코딩입니다. 몇 번 시도할지, 실패하면 뭘 할지, 언제 포기할지. LLM한테 결정권이 없습니다. 시키면 코드 생성할 뿐이죠. 결정은 전부 개발자가 코드 짤 때 내립니다. 런타임에 모델이 판단하는 게 아닙니다.

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
    task_give_up,     # 실패
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

이게 더 큰 파이프라인에서 어떻게 쓰이는지 보겠습니다.

```python
def build_training_dataset(sources: list[str]) -> Dataset:
    normalized = []

    for source in sources:
        result = normalize_hf_to_openai(dataset=source)

        if result.status == "complete":
            normalized.extend(result.data)
        elif result.status == "impossible":
            log.warning(f"Skipping {source}: {result.reason}")

    # 중복 제거
    deduped = deduplicate_conversations(normalized)

    # 품질 필터링
    filtered = filter_low_quality(deduped, threshold=0.8)

    return Dataset(filtered)
```

각 자율 함수가 성공, 실패, 불가능을 명시적으로 알려주니까, 호출하는 쪽에서 각 경우를 적절히 처리할 수 있습니다.

설계할 때 중요한 건, "완료"가 뭔지 명확히 정의하는 겁니다. 목표가 모호하면 결과도 모호해집니다. 그리고 종료 도구를 꼭 줘야 Agent가 끝났다는 걸 알릴 수 있습니다. 최대 반복 횟수나 타임아웃 같은 경계도 필요합니다.

"LLM을 함수처럼"에서 "Agent를 함수처럼"으로 바뀌는 건, AI 시스템 만드는 방식의 근본적인 변화입니다. 목표 중심 프롬프트, 자체 검증, 명시적 종료를 결합하면, 더 큰 시스템에서 신뢰할 수 있는 컴포넌트로 쓸 수 있는 자율 단위를 만들 수 있습니다.

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
