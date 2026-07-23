---
layout: post
title: llm-context-fmt — Your Prompt's Format Choice Changes the Answer
date: 2026-07-23 08:00:00 +0530
description: "New CLI tool reveals how format constraints (JSON, XML, Markdown, plain text) systematically bias LLM outputs — based on real July 2026 ArXiv research."
tags: [AI, LLM, prompt-engineering, CLI, open-source]
categories: [AI, open-source, CLI]
---

{% include figure.liquid path="/assets/img/projects/llm-context-fmt.png" class="img-fluid rounded z-depth-1" %}

A paper dropped this week on ArXiv. The finding: simply telling an LLM to "reply with JSON only" changes *which answer* the model chooses — across all 44 models tested. The convergence rate of answers jumped from 41% to 64% purely based on a format clause.

Most prompt engineers treat output format as a cosmetic concern. "Just slap JSON on it and parse the result." Turns out, that decision is shaping the content itself.

## What llm-context-fmt Does

`llm-context-fmt` is a CLI tool that runs your prompt through multiple format constraints side-by-side and quantifies exactly how much the output shifts:

```bash
llm-context-fmt --demo
```

The built-in demo uses the paper's "Pick a word" prompt — a question so simple the answer shouldn't change. Here's what happens:

| Format | Output | Word Count | Lexical Diversity |
|--------|--------|-----------|-------------------|
| plain | "Serendipity." | 1 | 1.0 |
| json | `{"word":"serendipity"}` | 2 | 1.0 |
| xml | `<word>serendipity</word>` | 3 | 0.67 |

The content is the same, but the format constraint changes token count, structural features, and even the word choice itself.

## Key Features

- **7 built-in formats**: plain, JSON, XML, Markdown, CSV, list, and JSON Schema
- **Custom format templates**: define your own constraints
- **Format Sensitivity Score**: a single number (0-1) showing how much your prompt's output depends on format
- **Multiple providers**: OpenRouter, OpenAI, Anthropic — or any OpenAI-compatible endpoint
- **Multiple runs**: average metrics across N trials for statistical significance
- **Dual output**: rich terminal tables + machine-readable JSON

## Why This Matters

Every prompt engineer and AI application developer should know their format sensitivity score. If switching from JSON to XML changes your answer by 40%, you need to know that before you ship.

The tool is minimal, zero-dependency in the analysis (stdlib only), and designed to be piped into your testing pipeline.

## Links

- **GitHub**: [github.com/vikasudasi/llm-context-fmt](https://github.com/vikasudasi/llm-context-fmt)
- **Install**: `pip install -e .` from source
- **Demo**: `llm-context-fmt --demo`

---

*Built on the July 2026 ArXiv finding that format constraints are not cosmetic — they're causal.*