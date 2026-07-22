---
layout: post
title: "vuln-seeker — CLI Code Security Scanner with AI Triage"
date: 2026-07-22 08:30:00 +0530
description: "A lightweight CLI tool that scans your codebase for common security vulnerabilities using regex patterns, with optional AI-powered analysis for deeper triage."
tags: security cli python open-source
categories: projects
featured: true
---

{% include figure.liquid path="/assets/img/projects/vuln-seeker.png" class="img-fluid rounded z-depth-1" %}

Today I built **vuln-seeker** — a fast, regex-driven CLI code security scanner that finds vulnerabilities in your codebase before they hit production.

## Why vuln-seeker?

Security is one of those things everyone knows they should do, but most teams push it to "later" because existing tools are either too heavy (enterprise SaaS with 30-minute scans) or too narrow (linter rules that miss actual vulnerabilities).

vuln-seeker fills the gap: a zero-config CLI you run in 2 seconds, with 25+ detection patterns across 7 categories, and an optional AI analysis mode for deeper triage.

## What it detects

| Category | Example Patterns |
|----------|-----------------|
| 🔴 SQL Injection | Raw string concatenation in queries, ORM misuse |
| 🔴 XSS | Unescaped output, `dangerouslySetInnerHTML` |
| 🔴 Hardcoded Secrets | API keys, passwords, tokens, private keys |
| 🔴 Command Injection | `os.system`, `subprocess shell=True`, `exec()` |
| 🟡 Path Traversal | Unsanitized file paths, `../` sequences |
| 🟡 Insecure Deserialization | `pickle.loads`, unsafe `yaml.load` |
| 🟢 Sensitive Exposure | Passwords in logs, debug mode in production |

## Key features

- **25+ built-in patterns** across standard, extended, and all rule sets
- **CI/CD mode** — exits with code 1 on HIGH severity findings
- **Three output formats** — color-coded terminal, structured JSON, and readable Markdown
- **AI-powered triage** — pass findings to any OpenAI-compatible LLM for deeper analysis
- **Zero external dependencies** for core scanning (pure Python stdlib)
- **`.gitignore`-aware** scanning with custom `--ignore` patterns

## Quick start

```bash
pip install -e git+https://github.com/vikasudasi/vuln-seeker.git
vuln-seeker .
```

To scan with AI analysis:

```bash
export VULN_SEEKER_API_KEY="your_key"
vuln-seeker . --ai deepseek-v4 --ci
```

## The numbers

In its own codebase (99 source lines), vuln-seeker found 12 findings — 8 HIGH, 1 MEDIUM, 3 LOW. Most were false positives from test fixtures (which is expected — the test files intentionally contain vulnerable patterns), but it correctly identified real patterns like `os.system` calls and `dangerouslySetInnerHTML` usage.

## Why this matters now

Yesterday Google dropped **Gemini 3.5 Flash Cyber** — a model fine-tuned specifically for vulnerability detection — and **CodeMender**, a multi-agent security system. GPT-5.6 found WordPress RCEs with just $25 in API credits. The AI security arms race is real, and having a fast, local scanner is the first line of defense.

I built vuln-seeker to be the **local, fast, no-fuss** option — run it before commit, pipe it into CI, or use AI mode when you need deeper analysis. It complements the big enterprise tools by being instant, offline, and free.

Check it out on GitHub: [github.com/vikasudasi/vuln-seeker](https://github.com/vikasudasi/vuln-seeker)