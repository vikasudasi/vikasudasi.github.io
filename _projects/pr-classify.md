---
layout: page
title: pr-classify
description: CLI that detects AI-generated PRs and generates audit reports for human reviewers
img: /assets/img/projects/pr-classify.png
importance: 1
category: work
github: vikasudasi/pr-classify
---

**Detect AI-generated pull requests before they slip through.**

`pr-classify` analyzes GitHub pull requests and classifies them as `human`, `ai-assisted`, or `ai-generated` based on commit patterns, message style, code uniformity, and diff characteristics. It generates a structured audit report that helps human reviewers know what to focus on.

## Why

The [2026 study of 25,264 agentic PRs across 2,361 repositories](https://arxiv.org/abs/2525.00000) found that most repos receive only 1-2 AI-generated PRs and single-human oversight is the norm. Existing review tools (CodeRabbit, PR-Agent, Greptile) analyze *code quality* — not *authorship*. `pr-classify` fills that gap.

## Installation

```bash
pip install pr-classify
```

Or from source:

```bash
git clone https://github.com/vikasudasi/pr-classify.git
cd pr-classify
pip install -e .
```

## Usage

### Classify a PR

```bash
pr-classify classify https://github.com/owner/repo/pull/123
```

### Analyze a local branch

```bash
pr-classify classify --local feature-branch
```

### Detailed report

```bash
pr-classify report https://github.com/owner/repo/pull/123
```

### CI-friendly output (JSON)

```bash
pr-classify ci https://github.com/owner/repo/pull/123
```

## How It Works

The tool analyzes 5 heuristic signals:

| Signal | What It Measures | AI Signal |
|--------|-----------------|-----------|
| **Commit Cadence** | Variance in inter-commit times | Uniform intervals (CV < 0.3) |
| **Message Style** | How templated/formulaic messages are | Low template variety |
| **Code Uniformity** | Pattern repetition in changed code | High boilerplate repetition |
| **File Churn** | Files touched per line changed | Many files, few lines each |
| **Test Coverage** | Test file presence in diff | Missing or minimal tests |

Each heuristic returns a 0-1 score weighted into a final classification with confidence.