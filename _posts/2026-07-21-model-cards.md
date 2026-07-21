---
layout: post
title:  "model-cards — Browse and Compare Open-Weight AI Models from Your Terminal"
date:   2026-07-21 08:30:00 +0530
categories: work
---

{% include figure.liquid path="/assets/img/projects/model-cards.png" class="img-fluid rounded z-depth-1" %}

There are now **20+ viable open-weight models** competing for your attention — Qwen 3.8, DeepSeek V4, Kimi K2.6, GLM-5.2, MiniMax M3, and more releasing every week. Keeping track of who has what context window, which license each uses, and how much hardware you need to run them is a full-time research job.

Today I'm releasing **`model-cards`** — a CLI reference tool that queries Hugging Face's model card API and displays specs in your terminal. Search, browse, and compare models without leaving the command line.

## What it does

```bash
# Search for a model family
model-cards search qwen

# View full details
model-cards show deepseek-v4

# Compare side-by-side
model-cards compare qwen3-coder kimi-k2.6 deepseek-v4
```

## Features

- **Search** — find models by name, description, or task type (sorted by downloads)
- **View details** — full model card: benchmarks, hardware requirements, license, context window, architecture, release date
- **Compare** — side-by-side comparison of up to 4 models. Highlights the best value in each spec category
- **Live data** — always fresh from Hugging Face API, no bundled JSON to go stale
- **Rich terminal output** — color-coded tables, panels, and formatted numbers
- **JSON output** — `--json` flag for pipeline-friendly consumption

## Why this matters

With the open-weight model explosion, the bottleneck isn't model quality anymore — it's discovery. Which model has 128K context? Which one is MIT-licensed? Which one runs on a 24GB GPU? Model-cards answers these questions in seconds.

## Try it

```bash
pip install model-cards
# or clone from GitHub
git clone https://github.com/vikasudasi/model-cards
cd model-cards && pip install -e .
```

[GitHub →](https://github.com/vikasudasi/model-cards)