---
layout: post
title: slop-detect — Privacy-Preserving AI Text Detection
date: 2026-07-21 08:00:00 +0530
description: "A CLI tool that detects AI-written text using multiple local heuristics — no API calls, no data leaves your machine. Built in response to the arXiv slop crisis."
tags: [ai, cli, open-source, python, privacy]
categories: [projects]
---

{% include figure.liquid path="/assets/img/projects/slop-detect.png" class="img-fluid rounded z-depth-1" %}

The **arXiv slop crisis** is real. A 2026 study estimates that 65% of CS papers on arXiv are now AI-written. And it's not just academia — AI-generated content is flooding blogs, marketing copy, product reviews, and social media.

But here's the thing: most AI text detectors today are **cloud-based**. You paste text into a web form, it gets sent to a server, analyzed, and returned. That's a privacy nightmare if you're analyzing sensitive documents, internal communications, or unpublished research.

So I built **slop-detect** — a CLI tool that runs entirely on your machine. No API calls. No data leaves your computer. Just five local heuristics that together give a surprisingly accurate picture.

## How it works

Five detectors, each scoring text from 0 (human) to 1 (AI-generated):

1. **Burstiness** — Human writing has variable sentence lengths. AI text is more uniform. The coefficient of variation tells the story.
2. **Perplexity Estimate** — A character-level 4-gram model built from the text itself. Surprising sequences = more human-like.
3. **Repetition** — AI text repeats n-grams more frequently. Checks 3-gram, 5-gram, and 8-gram repetition ratios.
4. **Hedging Phrases** — Counts frequency of AI-typical phrases like "delve," "foster," "landscape," "it's worth noting," "in conclusion." There are 34 phrases in the lookup.
5. **Readability Consistency** — Uses the GINI coefficient of sentence lengths. Human text naturally mixes short and long sentences; AI text is more uniform.

## Usage

```bash
# Analyze a file
slop-detect paper.txt

# Pipe text
cat paper.txt | slop-detect --stdin

# JSON output (great for CI pipelines)
slop-detect --json article.md

# Run only specific detectors
slop-detect --detectors burstiness,hedging sample.txt

# Adjust sensitivity
slop-detect --sensitivity high draft.txt
```

## Example output

Running it on a known AI-generated article about "AI transforming industries" — the kind of slop that fills half the internet:

```
┏━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━┳━━━━━━━━┓
┃ Detector             ┃ Score ┃ Weight ┃
┡━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━╇━━━━━━━━┩
│ Burstiness           │  0.66 │   0.25 │
│ Perplexity Estimate  │  0.52 │   0.20 │
│ Repetition           │  0.51 │   0.20 │
│ Hedging Phrases      │  1.00 │   0.20 │
│ Readability Variance │  0.62 │   0.15 │
├──────────────────────┼───────┼────────┤
│ OVERALL CONFIDENCE   │  0.66 │        │
│ VERDICT              │ AI-GENERATED │
└──────────────────────┴───────┴────────┘
```

The hedging detector nailed it — 35 hits per 1000 words, including "delve," "foster," "in conclusion," "landscape," "tapestry," and "transformative."

## Why fully local matters

Most AI detectors are SaaS products. You upload text, they analyze it, and somewhere a server stores your data. If you're a journalist verifying sources, a researcher reviewing peer papers, or a lawyer checking client documents — sending that text to a cloud service is a non-starter.

**slop-detect** is `pip install` away. Runs on any machine with Python 3.10+. No internet required after install.

## Check it out

- **GitHub:** [github.com/vikasudasi/slop-detect](https://github.com/vikasudasi/slop-detect)
- **Install:** `pip install slop-detect` (coming soon to PyPI)
- **License:** MIT

The best way to fight AI slop is with tools that are transparent, local, and verifiable. slop-detect is my contribution to that effort.