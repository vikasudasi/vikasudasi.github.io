---
layout: post
title:  "budget-forge — Find the Optimal Thinking Budget for Reasoning LLMs"
date:   2026-07-21 08:00:00 +0530
categories: work
---

![budget-forge](/assets/img/projects/budget-forge.png)

When reasoning models like DeepSeek R1, Qwen3, and Claude Sonnet let you control how much they "think" before answering, the question becomes: **how much thinking is enough?**

Spend too few thinking tokens and you get rushed, shallow answers. Spend too many and you're burning money on overthinking. The sweet spot depends on your prompt, your model, and your tolerance for latency.

Today I'm releasing **`budget-forge`** — a CLI tool that benchmarks your prompt at multiple thinking budget levels and finds the cost-vs-quality sweet spot.

## What it does

Run any prompt against a reasoning model at different thinking token budgets:

```bash
budget-forge test \
  --prompt "Write a production-grade Python function to merge N sorted lists" \
  --budgets 0,512,1024,2048,4096,8192 \
  --model deepseek-r1
```

## Features

- **Multi-model support** — DeepSeek R1, Qwen3, Claude Sonnet, OpenAI o3-mini
- **Configurable budgets** — comma-separated thinking token limits
- **Quality scoring** — self-evaluated quality on a 1-10 scale per budget level
- **Sweet spot detection** — highlights the budget where quality/cost ratio peaks
- **CSV export** — `--csv` flag for spreadsheet analysis
- **Rich terminal output** — color-coded tables with the winner highlighted

## Why this matters

The "thinking budget" knob is a brand new capability in 2026 reasoning models. Most developers are either leaving it at default (wasting money) or disabling it entirely (leaving quality on the table). Budget-forge gives you a systematic way to calibrate it for your specific use case.

## Try it

```bash
pip install budget-forge
# or clone from GitHub
git clone https://github.com/vikasudasi/budget-forge
cd budget-forge && pip install -e .
```

[GitHub →](https://github.com/vikasudasi/budget-forge)