---
layout: post
title: prompt-riser — a reasoning debugger that shows you how AI models think
date: 2026-07-20 14:00:00 +0530
description: A CLI tool that runs your prompt through multiple reasoning strategies and visualizes the thinking paths as a tree
tags: [ai, reasoning, cli, open-source, python]
categories: [projects]
---

## The Problem

I've been working with reasoning models a lot recently — GPT-5.6 Sol, Claude Fable, DeepSeek R1, Kimi K3. They're incredible at complex tasks, but there's a fundamental problem: **you only see the final answer, not the thinking**.

MIT/Stanford published a paper this month showing that self-correction during reasoning matters more than chain length. Models that catch and fix their own errors outperform longer-but-uncorrected chains by a wide margin. But how do you know if your model is self-correcting or just powering through confidently wrong?

There was no tool to answer that question. So I built one.

## Enter `prompt-riser`

`prompt-riser` is a CLI reasoning debugger. You give it a prompt, and it runs that prompt through **5 different reasoning strategies** against any LLM, then shows you the thinking paths side-by-side.

### The strategies

| Strategy | What it does |
|----------|-------------|
| **Chain-of-Thought** | Numbered step-by-step reasoning |
| **Self-Correcting** | Generate → Critique → Improve, multiple passes |
| **Step-Back** | Derive broader principle, then drill into specifics |
| **Constraint-Based** | Identify constraints, reason within them |
| **Tree-of-Thoughts** | Explore multiple branches, evaluate, pick best |

### How it works

```
prompt-riser run "What's the best way to deploy on a budget?"
```

The tool dispatches the prompt through each strategy as a separate LLM call (or sequence of calls for self-correcting), captures the full reasoning trace from each, and renders them as a visual tree:

```
┌─ Self-Correcting ────────────────────────┐
│  Pass 1: Use ECS Fargate...             │
│  Critique: Too expensive for budget      │
│  Pass 2: Lambda + EFS...                │
│  Critique: Cold starts might be issue   │
│  Pass 3: Lambda + provisioned concurrency│
│  ✅ Final answer                         │
└──────────────────────────────────────────┘
```

You can output as a terminal tree (Rich), JSON, or Mermaid flowchart.

### The MIT/Stanford connection

The self-correcting strategy directly implements the paper's finding — it does multiple generate→critique→improve passes. The tool doesn't just show you the final answer; it shows you **where the model corrected itself**, which is the signal that matters most.

## Tech stack

- **Python** (click, rich, httpx, pyyaml)
- OpenAI-compatible API (works with any provider)
- AST-based strategy definitions — easy to add new strategies
- 14 tests, all passing

## Try it

```bash
pip install -e .
prompt-riser run "Your prompt here" --output tree
```

[GitHub →](https://github.com/vikasudasi/prompt-riser)