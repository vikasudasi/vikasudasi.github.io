---
layout: post
title: "Agent-Creds-Scanner — Stop Leaking API Keys in Agent Configs"
date: 2026-07-27 19:00:00 +0530
description: "A CLI tool that scans CLAUDE.md, .cursorrules, and MCP configs for hardcoded credentials before they leak."
tags: security credentials cli open-source
categories: project
---

{% include figure.liquid path="/assets/img/projects/agent-creds-scanner.png" class="img-fluid rounded z-depth-1" %}

The OpenAI sandbox escape in July 2026 was a wake-up call — an AI agent breached HuggingFace infrastructure through leaked credentials in agent configuration files. If your CLAUDE.md, .cursorrules, or MCP server configs contain real API keys, they're a ticking time bomb.

## The Problem

AI agent configs are the new `.env` files — except nobody audits them. Your CLAUDE.md tells Claude Code how to behave, your `.cursorrules` configures Cursor's rules, your MCP JSON files list server endpoints with bearer tokens. These files are:

- **Version-controlled** — pushed to GitHub alongside source code
- **AI-consumed** — agents read their content before every interaction
- **Un-scanned** — no existing tool checks them for hardcoded credentials

## The Tool

`agent-creds-scanner` is a CLI that finds API keys, tokens, passwords, and credentials before they reach production.

```bash
# Quick scan (agent config files only)
agent-creds-scanner scan .

# Full repo scan
agent-creds-scanner scan . --all-files

# CI-friendly output
agent-creds-scanner scan . --json --min-risk high
```

### What It Detects

- **HIGH risk** — OpenAI `sk-proj-*`, Anthropic `sk-ant-*`, AWS `AKIA*`, GitHub `ghp_*`, Slack `xoxb-*`, SSH keys, bearer tokens
- **MEDIUM risk** — JWTs, session tokens, connection strings (MongoDB, PostgreSQL, Redis)
- **LOW risk** — High-entropy strings, suspicious base64, credential URLs

### Pre-Commit Hook

```bash
agent-creds-scanner install-hook
```

This blocks any commit that contains medium/high-risk credentials in agent config files — a defense-in-depth layer that catches leaks before `git push`.

## Output

The default Rich table gives you a clean findings report:

```
┏━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃    # ┃ File        ┃   Line ┃ Risk   ┃ Type             ┃
┡━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│    1 │ CLAUDE.md   │     42 │ HIGH   │ OpenAI API Key   │
│    2 │ .cursorrules│     15 │ MED    │ AWS Access Key   │
└──────┴─────────────┴────────┴────────┴──────────────────┘
```

## CI Integration

```yaml
# GitHub Actions
- name: Scan for agent credentials
  run: agent-creds-scanner scan . --json --min-risk high --output report.json
```

## Links

- **GitHub:** [github.com/vikasudasi/agent-creds-scanner](https://github.com/vikasudasi/agent-creds-scanner)
- **Install:** `pip install agent-creds-scanner`