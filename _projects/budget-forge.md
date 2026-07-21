---
layout: page
title: budget-forge
description: "CLI tool that finds the optimal thinking budget for reasoning LLMs — test prompts at multiple budget levels and generate cost-vs-quality tradeoff curves"
importance: 1
category: work
github: vikasudasi/budget-forge
img: /assets/img/projects/budget-forge.png
---

# budget-forge

`budget-forge` is a CLI utility for benchmarking reasoning-model thinking budgets and finding the best quality/cost tradeoff.

## Install

```bash
pip install budget-forge
```

Or clone and install from source:

```bash
git clone https://github.com/vikasudasi/budget-forge.git
cd budget-forge
pip install -e .
```

## Usage

```bash
budget-forge test \
  --prompt "Write a clean Python function to merge N sorted lists" \
  --budgets 0,512,1024,2048,4096,8192 \
  --model deepseek-r1
```

### Options

| Flag | Description |
|------|-------------|
| `--prompt` | The prompt to evaluate |
| `--prompt-file` | Read prompt from a file |
| `--budgets` | Comma-separated thinking token budget levels (default: `0,512,1024,2048,4096,8192`) |
| `--model` | Model to use (`deepseek-r1`, `qwen3`, `claude-sonnet`, `o3-mini`) |
| `--csv` | Export results to a CSV file |
| `--reference` | Optional reference answer for exact-match quality scoring |

### Supported Models

| Model | API Base | Env Var |
|-------|----------|---------|
| DeepSeek R1 | `api.deepseek.com` | `DEEPSEEK_API_KEY` |
| Qwen3 (via OpenRouter) | `api.openrouter.ai` | `OPENROUTER_API_KEY` |
| Claude Sonnet 4 | `api.anthropic.com` | `ANTHROPIC_API_KEY` |
| o3-mini | `api.openai.com` | `OPENAI_API_KEY` |

### Output

The tool outputs a rich table with columns: Budget, Thinking Tokens, Total Tokens, Cost, Latency, Quality, Quality/Cost. The budget with the highest quality/cost ratio is highlighted as the "sweet spot".

## How It Works

For each budget level, budget-forge sends your prompt with the thinking budget parameter specific to each model's API. It records the actual thinking tokens used, total tokens, cost, and latency. Quality is scored by asking the model to self-evaluate its answer on a 1-10 scale, or by exact match against a reference answer if provided.

The sweet spot is the budget where quality per dollar is highest — giving you the best answer for the least cost.

## License

MIT