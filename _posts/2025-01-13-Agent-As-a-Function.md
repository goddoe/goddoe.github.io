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

The second topic I want to share is Agent as a Function.

**TL;DR**

1. In the past, a single LLM call or LLM Workflow replaced a function. Now, an LLM Agent can replace a function within a larger system.
2. Define the agent's goal via system prompt, and provide validation rules and validation tools so the agent can self-assess.
3. The agent autonomously iterates until the task is validated, creating what I call an "autonomous function."

In the early days of LLM adoption, a single LLM API call or LLM Workflow served as a function replacement. You would send a prompt, receive a response, and use that output in your application. This was already powerful because natural language became an interface for computation.

But now, LLM Agents are no longer just chatbots. They are becoming components within larger systems, autonomous units that can accomplish complex tasks independently.

I think of this as "Agent as a Function." Instead of a simple input-output transformation, an agent takes a goal, uses tools to validate its own work, and iterates until the task is complete.

Let me show this with a concrete example. Imagine we need a function that downloads a dataset from HuggingFace and normalizes it to OpenAI message format. This is a real task I've built and use at my company.

**Approach 1: Single LLM Call**

```python
def normalize_dataset(dataset_name: str) -> list:
    return llm.complete(f"Convert {dataset_name} to OpenAI format")
```

This doesn't even make sense. The LLM can't actually download data or write files. It can only generate text based on what it knows.

**Approach 2: LLM Workflow**

```python
def normalize_dataset(dataset_name: str) -> list:
    # Step 1: Search for dataset structure
    schema = web_search(f"{dataset_name} huggingface schema")

    # Step 2: Generate conversion code
    code = llm.complete(f"Write code to convert {schema} to OpenAI format")

    # Step 3: Execute
    exec(code)
    return load_result()
```

Fixed pipeline. If the generated code fails, we can't retry with different approach. No validation that the output actually matches OpenAI format.

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

Each autonomous function guarantees its output contract and explicitly signals success, failure, or impossibility. The caller handles each case appropriately.

I'm building and using these patterns at my company. When agents self-validate, you can trust their outputs in production. Instead of humans reviewing every LLM output, agents handle quality assurance internally. And because each agent guarantees its contract, you can build complex systems from these reliable building blocks.

Some practical tips for designing autonomous functions. Be specific about what "done" looks like because vague goals lead to vague outputs. Provide terminal tools so agents can explicitly signal completion status. Set reasonable boundaries like max iterations, timeouts, and fallback behaviors.

This shift from "LLM as a Function" to "Agent as a Function" is a fundamental change in how we build AI-powered systems. By combining goal-driven prompts, self-validation, and explicit termination, we create autonomous units that can be trusted as reliable components in larger systems.

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

구체적인 예시로 설명하겠습니다. HuggingFace에서 Dataset을 다운로드해서 OpenAI Message Format으로 정규화하는 함수가 필요하다고 가정해봅시다. 실제로 제가 회사에서 만들어서 사용하고 있는 Task입니다.

**Approach 1: Single LLM Call**

```python
def normalize_dataset(dataset_name: str) -> list:
    return llm.complete(f"Convert {dataset_name} to OpenAI format")
```

이건 말이 안 됩니다. LLM은 실제로 데이터를 다운로드하거나 파일을 쓸 수 없습니다. 자기가 아는 것을 기반으로 텍스트만 생성할 수 있을 뿐입니다.

**Approach 2: LLM Workflow**

```python
def normalize_dataset(dataset_name: str) -> list:
    # Step 1: Search for dataset structure
    schema = web_search(f"{dataset_name} huggingface schema")

    # Step 2: Generate conversion code
    code = llm.complete(f"Write code to convert {schema} to OpenAI format")

    # Step 3: Execute
    exec(code)
    return load_result()
```

고정된 Pipeline입니다. 생성된 코드가 실패해도 다른 Approach로 재시도할 수 없습니다. Output이 실제로 OpenAI Format과 일치하는지 Validation도 없습니다.

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

# BASE_TOOLS: 작업 수행을 위한 기본 기능
BASE_TOOLS = [
    web_search,       # Dataset Documentation 검색
    read_file,        # 다운로드한 데이터 읽기
    write_file,       # Conversion Code와 Output 작성
    run_python,       # Conversion Code 실행
]

# VALIDATION_TOOLS: Output 검증
VALIDATION_TOOLS = [
    validate_json_schema,  # OpenAI Message Format 확인
    run_tests,             # Format Validation Test 실행
]

# TERMINAL_TOOLS: 명시적 Task 종료
TERMINAL_TOOLS = [
    task_complete,    # 성공과 함께 결과 반환
    task_give_up,     # 시도했지만 실패
    task_impossible,  # 근본적으로 불가능한 Task
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

Agent는 Dataset Schema를 검색하고, Conversion Code를 작성하고, 실행하고, Output Format을 Validation합니다. Validation이 실패하면 Debug하고 재시도합니다. Terminal Tool을 통해 명시적으로 완료 상태를 Signal합니다.

이 함수가 더 큰 Data Pipeline에서 어떻게 사용되는지 보겠습니다.

```python
def build_training_dataset(sources: list[str]) -> Dataset:
    normalized = []

    for source in sources:
        # 각 호출이 Autonomous Function
        result = normalize_hf_to_openai(dataset=source)

        if result.status == "complete":
            normalized.extend(result.data)
        elif result.status == "impossible":
            log.warning(f"Skipping {source}: {result.reason}")

    # 다른 Autonomous Function으로 Deduplication
    deduped = deduplicate_conversations(normalized)

    # 다른 Autonomous Function으로 Quality Filtering
    filtered = filter_low_quality(deduped, threshold=0.8)

    return Dataset(filtered)
```

각 Autonomous Function이 Output Contract를 보장하고 Success, Failure, Impossibility를 명시적으로 Signal합니다. 호출하는 쪽에서는 각 Case를 적절히 처리합니다.

저는 이런 Pattern을 회사에서 직접 만들어서 사용하고 있습니다. Agent가 스스로 Validation하면 Production System에서 Output을 신뢰할 수 있습니다. 사람이 모든 LLM Output을 검토하는 대신 Agent가 내부적으로 Quality Assurance를 처리합니다. 그리고 각 Agent가 Contract를 보장하므로 이 신뢰할 수 있는 Building Block으로 복잡한 시스템을 구축할 수 있습니다.

Autonomous Function 설계를 위한 실용적인 팁입니다. "완료"가 어떤 모습인지 구체적으로 정의해야 합니다. 모호한 목표는 모호한 Output으로 이어지기 때문입니다. Terminal Tool을 제공해서 Agent가 명시적으로 완료 상태를 Signal할 수 있게 하세요. Max Iteration, Timeout, Fallback 같은 합리적인 경계를 설정하세요.

"LLM as a Function"에서 "Agent as a Function"으로의 전환은 AI 기반 시스템 구축 방식의 근본적인 변화입니다. Goal-Driven Prompt, Self-Validation, Explicit Termination을 결합함으로써 더 큰 시스템의 신뢰할 수 있는 컴포넌트로 사용할 수 있는 Autonomous Unit을 만들 수 있습니다.

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
