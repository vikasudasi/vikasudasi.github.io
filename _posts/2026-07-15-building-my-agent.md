---
layout: post
title: "Building my-agent: A Personal macOS Deep Agent That Lives in Your Terminal"
description: How I built a deep AI agent for macOS that automates coding, research, and system tasks — all from the terminal.
date: 2026-07-15 10:00:00 +0530
categories: ai agents open-source
tags: [my-agent, ai-agents, open-source, terminal, macos]
related_posts: false
---

For the past few months, I've been building something I've wanted for myself for a long time: a truly useful AI agent that runs locally on macOS, lives in the terminal, and can do real work — not just answer questions.

## What is my-agent?

**my-agent** is a personal deep agent designed for macOS. It's not a chatbot or a wrapper around an API — it's a tool-using agent that can:

- Read and edit files across your system
- Execute shell commands and scripts
- Browse the web for research
- Clone repos, run builds, and deploy
- Manage your calendar, email, and tasks
- Remember context across sessions

All from your terminal, with full system access, running against any LLM provider you choose.

## Why I built it

Existing AI coding assistants (Copilot, Cursor, Claude Code) are powerful but limited. They work inside specific editors, have narrow scopes, and can't manage the full lifecycle of a project — let alone coordinate across multiple repos, services, and tools.

I wanted something that could:

1. Work **anywhere** — terminal, IDE, messaging platforms
2. Maintain **persistent context** — not just within a session, but across weeks
3. **Self-improve** — learn from past work and save reusable patterns
4. Run **locally first** — no cloud dependency for core operations

## Key design decisions

### Provider-agnostic from day one

my-agent doesn't lock you into one LLM. It works with OpenAI, Anthropic, Google, DeepSeek, xAI, OpenRouter, and local models via llama.cpp or Ollama. You can swap providers mid-conversation.

### Skills — the agent that learns

Every time my-agent solves a complex problem or discovers a workflow, it can save that as a **skill** — a reusable markdown document with instructions, pitfalls, and verification steps. Over time, it accumulates domain knowledge specific to your work.

### Persistent memory

Unlike most agents that reset every session, my-agent has cross-session memory. It remembers your preferences, project conventions, and past decisions. This means it gets better the more you use it.

### Multi-platform gateway

The same agent runs on Telegram, Discord, Slack, WhatsApp, and a dozen other platforms. You can start a task on your terminal, check progress from your phone, and review results on any device.

## What's next

- **Voice integration** — speak to your agent, get voice responses
- **Multi-agent orchestration** — spawn worker agents for parallel tasks
- **Deeper IDE integration** — ACP server for VS Code, Zed, JetBrains
- **Mobile companion** — native iOS/Android app

The repo is open source at [github.com/vikasudasi/my-agent](https://github.com/vikasudasi/my-agent). If you're building in the AI agent space, I'd love to collaborate — reach out on [X](https://x.com/vikasudasi) or [LinkedIn](https://linkedin.com/in/vikasudasi).

---

*This is part of a broader effort to make AI agents genuinely useful, not just impressive demos. More to come.*
