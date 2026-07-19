---
layout: post
title: "pr-classify: Detect AI-Generated Pull Requests Before They Slip Through"
description: A CLI tool that analyzes GitHub PRs and tells you whether they were written by a human, an AI assistant, or an autonomous agent — with a structured audit report for reviewers.
date: 2026-07-20 00:00:00 +0530
categories: ai open-source tools
tags: [ai-agents, open-source, cli, developer-tools, python, code-review, github]
related_posts: false
---

A paper dropped on ArXiv today: **25,264 agentic PRs across 2,361 repositories**. The finding? Most repos receive only 1-2 AI-generated PRs, single-human oversight is the norm, and *no existing review tool distinguishes AI from human contributions*.

That's the gap I set out to fill.

## What is pr-classify?

**pr-classify** is a Python CLI that analyzes a GitHub pull request and classifies it as `human`, `ai-assisted`, or `ai-generated` — then generates a structured audit report that tells the reviewer exactly what to focus on.

It's not another code quality checker. It's a **meta-review tool** — one that answers the question: "Who (or what) actually wrote this code?"

## How it works

The tool analyzes **5 heuristic signals** from the PR:

| Signal | What It Measures | AI Pattern |
|--------|-----------------|------------|
| **Commit Cadence** | Variance in time between commits | Near-uniform intervals (CV < 0.3) |
| **Message Style** | How templated/formulaic messages are | Low template variety — same patterns repeated |
| **Code Uniformity** | Structural pattern repetition in diffs | High boilerplate repetition |
| **File Churn** | Files touched per line changed | Many files, very few lines each |
| **Test Coverage** | Test presence and quality in the diff | Missing or minimal tests |

Each heuristic scores 0-1, weighted by reliability, and combined into a final classification with a confidence score.

## Usage

```bash
# Classify a PR
pr-classify classify https://github.com/owner/repo/pull/123

# Analyze a local branch (no GitHub API needed)
pr-classify classify --local feature-branch

# Detailed markdown report
pr-classify report https://github.com/owner/repo/pull/123

# CI-friendly JSON output
pr-classify ci https://github.com/owner/repo/pull/123
```

The CI command outputs structured JSON perfect for GitHub Actions — you can use it to automatically flag AI-generated PRs for deeper review.

## Why this matters

We're entering an era where the majority of code changes hitting repositories will be AI-generated. That's not inherently bad — AI generates great code. But reviewing AI code requires *different* scrutiny:

- **Pattern uniformity** — AI writes consistently, but consistent doesn't mean correct
- **Missing edge cases** — AI models are optimised for the happy path
- **Hallucinated APIs** — models sometimes invent libraries or functions that don't exist
- **Test coverage blind spots** — AI tests often verify the implementation, not the requirements

Existing code review tools (CodeRabbit, Qodo, Greptile) treat every PR the same. `pr-classify` adds a crucial layer: *awareness of the author*.

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

## Built for extensibility

The heuristic system is modular — you can add your own signals via a simple Python API. The config file at `~/.config/pr-classify/config.yaml` lets you tune the sensitivity threshold, swap output modes, and inject custom rules.

Currently supports:
- **Online mode** — analyzes real PRs via GitHub API
- **Offline mode** — analyze any local git branch without external calls
- **CI mode** — structured JSON for GitHub Actions pipelines
- **Report mode** — human-readable markdown for team discussions

## Get it

The repo is on GitHub: [github.com/vikasudasi/pr-classify](https://github.com/vikasudasi/pr-classify)

```bash
pip install pr-classify
pr-classify classify https://github.com/vikasudasi/pr-classify/pull/1
```

## What's next

- **GitHub Actions integration** — auto-comment on PRs with classification
- **More heuristics** — diff entropy, file-type distribution, dependency changes
- **Training data** — build a labelled dataset from the ArXiv study's findings
- **Plugin system** — allow anyone to write their own heuristic modules

---

*This is part of my daily workflow: research a trend → identify a gap → build something → share it. If you have ideas for what to build next, [let me know](https://linkedin.com/in/vikasudasi).*