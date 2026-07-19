---
layout: post
title: "prompt-snapshot: A CLI Tool That Feeds Your Project Context to AI Agents"
description: How a simple CLI tool can save you time by automatically packaging your project structure and file contents for AI agent prompts.
date: 2026-07-19 14:00:00 +0530
categories: ai open-source tools
tags: [ai-agents, open-source, cli, developer-tools, python, prompt-engineering]
related_posts: false
---

If you use AI coding agents — Claude Code, Cursor, Codex CLI, or any of the terminal-based agents — you've probably done this dance:

> Copy your project tree, then open a few key files, copy their contents, paste everything into a prompt, and hope the agent has enough context.

It works, but it's tedious, error-prone, and you repeat it every time. I got tired of it and built **prompt-snapshot**.

## What is prompt-snapshot?

**prompt-snapshot** is a zero-dependency Python CLI that scans your project directory and generates a single markdown document containing:

- A **file tree** (with sizes and last-modified dates)
- The **contents** of every relevant text file
- All properly formatted, ready to paste into any AI agent prompt

## How it works

```bash
# Basic usage — snapshot the current directory
python prompt-snapshot.py

# Snapshot a specific project
python prompt-snapshot.py ~/projects/my-app -o snapshot.md

# Customize which files to include
python prompt-snapshot.py . -e .py,.js,.ts,.md -x build

# Skip the tree or file contents
python prompt-snapshot.py . --no-tree
```

The output looks like this:

```
# Project: my-app

## File Tree
```
my-app/
├── src/main.py (12.3 KB, 2026-07-19)
├── src/utils.py (4.1 KB, 2026-07-18)
├── tests/test_main.py (2.7 KB, 2026-07-19)
└── README.md (1.5 KB, 2026-07-15)
```

## File Contents

### src/main.py
```python
def main():
    print("Hello, world!")
```

### README.md
```markdown
# My App
...
```
```

## Why I built it

I use **my-agent** daily for coding, and I kept running into the same problem: even with persistent memory, fresh context matters. When I start a new task or switch projects, I need the agent to understand the full picture — not just what it remembers from last session.

prompt-snapshot fills that gap. It's the quickest way to get your project's full context into any AI agent's prompt in a single paste.

## Key features

- **Zero external dependencies** — pure Python stdlib. Works everywhere Python 3.8+ runs
- **`.gitignore`-aware** — respects your existing ignore rules automatically
- **Smart defaults** — skips binaries, `.git/`, `node_modules/`, `__pycache__/`, and other noise
- **Customizable** — filter by extension, exclude directories, cap file sizes
- **Human-readable output** — markdown that's easy to read, paste, and share

## Get it

The repo is on GitHub: [github.com/vikasudasi/prompt-snapshot](https://github.com/vikasudasi/prompt-snapshot)

```bash
git clone https://github.com/vikasudasi/prompt-snapshot.git
cd prompt-snapshot
python prompt-snapshot.py .
```

No install needed — just clone and run. Python 3.8+ required.

## What's next

- **`pip install` support** — once it's on PyPI
- **Glob-based file selection** — for more granular control
- **Output formats** — JSON, YAML, and plain text options
- **Integration with my-agent** — auto-snapshot before each task

---

*This is part of my daily workflow: research a trend → identify a gap → build something → share it. If you have ideas for what to build next, [let me know](https://linkedin.com/in/vikasudasi).*