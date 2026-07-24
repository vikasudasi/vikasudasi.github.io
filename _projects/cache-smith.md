---
layout: page
title: cache-smith
description: "LLM caching optimizer — analyze KV prompt caching potential and simulate semantic caching savings before committing to a full gateway."
importance: 1
category: work
github: vikasudasi/cache-smith
img: /assets/img/projects/cache-smith.png
---

{% include figure.liquid path="/assets/img/projects/cache-smith.png" class="img-fluid rounded z-depth-1" %}

A CLI tool that helps developers optimize LLM API costs through caching.

**Three modes:**

1. **`cache-smith analyze`** — analyzes prompt templates for provider-side KV prompt caching potential. Measures prefix overlap, scores cacheability, and estimates cost savings across OpenAI, Anthropic, and Google.

2. **`cache-smith simulate`** — simulates client-side semantic caching using local embeddings (sentence-transformers). Runs similarity sweeps, finds optimal thresholds, and reports hit rates and savings.

3. **`cache-smith proxy`** — lightweight HTTP proxy that intercepts OpenAI-compatible API calls and serves cached responses via semantic matching. Works as a drop-in replacement for your existing base URL.

**Key features:**
- Local embeddings (no API calls needed) with deterministic hash fallback
- Provider-aware cost modeling (OpenAI, Anthropic, Google)
- Optimal threshold suggestion via sweep (0.70-0.98)
- Rich terminal tables + JSON output
- Thread-safe in-memory proxy cache with `X-Cache` headers

**Install:** `pip install -e .` from source

**GitHub:** [github.com/vikasudasi/cache-smith](https://github.com/vikasudasi/cache-smith)
