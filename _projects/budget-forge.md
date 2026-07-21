---
layout: page
title: budget-forge
description: "CLI tool that finds the optimal thinking budget for reasoning LLMs — test prompts at multiple budget levels and generate cost-vs-quality tradeoff curves"
importance: 1
category: work
github: vikasudasi/budget-forge
img: /assets/img/projects/budget-forge.png
---

# Budget Forge

**Find the optimal thinking budget for reasoning LLMs — maximize quality per dollar spent.**

Budget Forge is a CLI benchmarking tool that sweeps across thinking budgets for reasoning models (DeepSeek R1, Qwen3, Claude Sonnet, o3-mini), measures quality and cost at each level, and identifies the **sweet spot** where you get the most quality per penny.

## Why?

Reasoning models can **think** before they answer — allocating internal "thinking tokens" to reason through a problem. This improves quality, but also costs more. The relationship between thinking budget and response quality is **not linear**:

- **Too few thinking tokens** → the model rushes, quality suffers
- **Too many thinking tokens** → you burn money on overthinking
- **Somewhere in between** lies the *sweet spot* — the budget that gives you the best quality-to-cost ratio

Budget Forge makes finding that sweet spot systematic, reproducible, and automated.

## Installation

```bash
pip install budget-forge
```

Or from source:

```bash
git clone https://github.com/vikasudasi/budget-forge.git
cd budget-forge
pip install -e .
```

## Usage

### Basic benchmark

```bash
budget-forge test \
  --prompt "Explain memoization with an example." \
  --model deepseek-r1
```

### Custom budgets

```bash
budget-forge test \
  --prompt "Write a Python function for merge sort." \
  --model qwen3 \
  --budgets 0,512,1024,2048,4096,8192
```

### CSV export

```bash
budget-forge test \
  --prompt "Explain the HTTP protocol." \
  --model deepseek-r1 \
  --csv results.csv
```

### Prompt file & reference answer

```bash
budget-forge test --prompt-file prompt.txt --model claude-sonnet
budget-forge test --prompt "What is 2+2?" --reference "4" --model o3-mini
```

## Supported Models

| Model | CLI flag | API base | Env var |
|-------|----------|----------|---------|
| DeepSeek R1 | `deepseek-r1` | `api.deepseek.com` | `DEEPSEEK_API_KEY` |
| Qwen3 | `qwen3` | `api.openrouter.ai` | `OPENROUTER_API_KEY` |
| Claude Sonnet | `claude-sonnet` | `api.anthropic.com` | `ANTHROPIC_API_KEY` |
| o3-mini | `o3-mini` | `api.openai.com` | `OPENAI_API_KEY` |

## How It Works

For each budget level, budget-forge sends your prompt with the thinking budget parameter specific to each model's API. It records thinking tokens, total tokens, cost, and latency. Quality is scored by self-evaluation (1-10) or exact match against a reference answer. The sweet spot is the budget where quality per dollar peaks.

## License

MIT