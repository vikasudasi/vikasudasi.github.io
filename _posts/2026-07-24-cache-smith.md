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

`cache-smith analyze` reads your prompt templates, measures prefix overlap, scores cacheability (0-100), and suggests reordering to maximize shared prefixes:

```bash
$ cache-smith analyze examples/prompts.txt

┌──────────────────────────┬──────────┐
│ Metric                   │    Value │
├──────────────────────────┼──────────┤
│ Prompts                  │       10 │
│ Total Input Tokens       │      389 │
│ Before Cacheable %       │   41.65% │
│ After Cacheable %        │   41.65% │
│ Cacheability Score       │   35/100 │
└──────────────────────────┴──────────┘
```

## 2. Simulate — Semantic Cache Hit Rates

Client-side semantic caching matches prompts by meaning, not exact string. A cache hit serves a previous response for a semantically similar question — zero latency, zero cost.

`cache-smith simulate` generates embeddings locally (sentence-transformers), runs a similarity sweep across all prompt pairs, and tells you the optimal threshold:

```bash
$ cache-smith simulate examples/prompts_semantic.txt --threshold 0.80

┌─────────────────────┬────────┐
│ Metric              │  Value │
├─────────────────────┼────────┤
│ Total Prompts       │     20 │
│ Unique Prompts      │     16 │
│ Hit Rate            │ 20.00% │
│ Tokens Deduplicated │     36 │
│ False Match Rate    │  0.00% │
│ Suggested Threshold │   0.80 │
└─────────────────────┴────────┘
```

The tool sweeps thresholds from 0.70 to 0.98 and finds the one that maximizes savings while keeping false matches under 5%.

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
pip install -e .
cache-smith analyze examples/prompts.txt
cache-smith simulate examples/prompts_semantic.txt
```

[GitHub →](https://github.com/vikasudasi/cache-smith)
