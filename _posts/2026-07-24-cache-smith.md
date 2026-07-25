---
layout: post
title: "cache-smith — Benchmark LLM Caching Before You Buy the Gateway"
date: 2026-07-24 08:30:00 +0530
description: "Open-source CLI that analyzes your prompts for KV cache potential and simulates semantic caching with local embeddings — so you know exactly how much you'll save before committing to a full gateway."
tags: [open-source, LLM, caching, cost-optimization, CLI]
categories: [tools]
---

{% include figure.liquid path="/assets/img/projects/cache-smith.png" class="img-fluid rounded z-depth-1" %}

LLM API costs compound fast. Every team running production AI workloads has felt it — the monthly bill that keeps creeping up even when you're not adding new features. The fix everyone recommends is caching, but the gap between "you should cache" and "how much will it actually save me" is where most teams get stuck.

**`cache-smith`** is a CLI that closes that gap. It does two things, plus a proxy:

## 1. Analyze — KV Prompt Caching Potential

Provider-side prompt caching (KV cache) is the single highest-leverage cost optimization in LLM engineering right now. OpenAI gives 50% off cached tokens. Anthropic gives 90%. But you only get those discounts if your prompts share stable prefixes.

### What's KV prompt caching?

Every LLM processes your prompt token-by-token and computes a **KV cache** (Key-Value pairs for each attention layer). If you send a second prompt that starts with the same tokens as the first, the provider can **reuse the KV cache** from the first prompt's prefix instead of recomputing it — and passes that saving on to you as a discount.

The catch: consecutive prompts must share a **long enough common prefix**. If your prompts jump between unrelated topics, each transition loses the cache discount.

### What `analyze` does

It takes your prompt templates, measures how much prefix they share, and **reorders them** to maximize adjacent overlap. Here's the included example — 7 prompts from two different families interleaved:

| Prompt | Family |
|--------|:------:|
| *You are an expert software engineer...review a Python async service...* | Code Review (A) |
| *You are a senior data scientist...analyze credit card transactions...* | Data Science (B) |
| *You are an expert software engineer...review a Go API gateway...* | Code Review (A) |
| *You are a senior data scientist...analyze stock market volatility...* | Data Science (B) |
| *You are an expert software engineer...review a Rust migration tool...* | Code Review (A) |
| *You are a senior data scientist...analyze customer churn data...* | Data Science (B) |
| *You are a senior data scientist...analyze IoT device metrics...* | Data Science (B) |

In the original order, consecutive prompts switch between families (A→B→A→B→A→B→B). Each transition shares only ~10 generic prefix tokens ("You are a..."). The KV cache barely gets any reuse.

Running `analyze`:

```bash
$ cache-smith analyze examples/prompts.txt

   KV Prompt Cacheability Analysis
┏━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┓
┃ Metric                   ┃  Value ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━┩
│ Prompts                  │      7 │
│ Before Cacheable %       │  7.63% │
│ After Cacheable %        │ 34.43% │  ← 4.5× improvement
│ Before Avg Prefix Tokens │  10.00 │  ← A→B transitions: ~10 tokens shared
│ After Avg Prefix Tokens  │  43.67 │  ← A→A/B→B transitions: ~44 tokens shared
│ Cacheability Score       │ 29/100 │
└──────────────────────────┴────────┘
```

The tool **greedily reorders** the prompts into grouped families: **A→A→A→B→B→B→B**. Now each transition within a family shares ~44 prefix tokens — those 44 tokens get the provider's cache discount instead of being recomputed.

**Cacheability Score (0-100)** combines three factors:
- **Cacheable %** (weight: 70%) — how much of each prompt can reuse the previous prompt's KV cache
- **Total volume** (weight: 20%) — bigger prompts = bigger savings; maxes out at 8K+ tokens
- **Prompt count** (weight: 10%) — more prompts = more opportunities for reuse

The score is 29/100 here because the prompts are short (~69 tokens each). With real-world prompts that have large system instructions (2K+ tokens), the same overlap pattern would score much higher — and the dollar savings would be significant.

## 2. Simulate — Semantic Cache Hit Rates

Client-side semantic caching matches prompts by **meaning**, not exact string. A cache hit serves a previous response for a semantically similar question — zero latency, zero cost.

The included example has 9 questions from 3 topics, each asked 3 slightly different ways:

- *"How do I implement retry logic with exponential backoff in Python?"*
- *"What's the best way to add exponential backoff retry to a Python microservice?"*
- *"Looking for a Python implementation of retry with exponential backoff for microservices."*
- *(Plus 6 more questions about Kubernetes HPA and database migrations)*

Running `simulate` generates embeddings locally (sentence-transformers), measures semantic similarity, and tells you how many calls a cache would serve:

```bash
$ cache-smith simulate examples/prompts_semantic.txt

   Semantic Cache Simulation
┏━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┓
┃ Total Prompts       │      9 │
┃ Unique Prompts      │      6 │  ← 3 are near-duplicates
┃ Hit Rate            │ 33.33% │  ← 1 in 3 requests served from cache
┃ Tokens Deduplicated │     41 │
┃ False Match Rate    │  0.00% │
┃ Suggested Threshold │   0.70 │
└─────────────────────┴────────┘
```

The tool sweeps thresholds from **0.70 to 0.98** and finds the optimal one — maximizing savings while keeping false matches under 5%. At 0.92, it catches exact paraphrases. At 0.70, it catches looser variations too, but risks serving wrong answers to different questions.

## 3. Proxy — Try It for Real

Once you know your threshold, `cache-smith proxy` runs a lightweight HTTP server that intercepts OpenAI-compatible API calls:

```bash
cache-smith proxy --upstream-url https://api.openai.com --port 8080 --threshold 0.85
```

Point your app at `http://localhost:8080`. Cache hits return instantly with `X-Cache: HIT`. Misses forward upstream and cache the response for next time.

## Provider Pricing

The tool knows the caching economics of each major provider:

| Provider | Input $/M | Output $/M | Cache Discount |
|----------|----------:|-----------:|---------------:|
| OpenAI GPT-4o | $2.50 | $10.00 | 50% |
| Anthropic Claude 3.5 Sonnet | $3.00 | $15.00 | 90% |
| Google Gemini 2.0 Pro | $1.50 | $7.50 | 75% |

Pass `--provider-config` with custom JSON to match your actual contract rates.

## How it's built

- **Local embeddings** — uses `all-MiniLM-L6-v2` via sentence-transformers, no API calls needed
- **Hash fallback** — if sentence-transformers isn't installed, falls back to a deterministic hash-based embedding
- **No dependencies on gateways** — this is a standalone CLI, not another gateway to manage
- **Rich output** — terminal tables with `rich`, JSON for pipelines

## Try it

```bash
git clone https://github.com/vikasudasi/cache-smith.git
cd cache-smith
pip install -e .
cache-smith analyze examples/prompts.txt
cache-smith simulate examples/prompts_semantic.txt
```

Bring your own prompts — pass any text file with one prompt per line, or pipe them via stdin. No API keys, no setup, no gateways.

[GitHub →](https://github.com/vikasudasi/cache-smith)
