---
layout: post
title: "readme2skill — Auto-Generate AI Agent Skills from Any Project README"
date: 2026-07-22 16:15:00 +0530
description: "CLI that reads your README, docs, and config to instantly produce SKILL.md — making any project usable by Claude Code, Codex, Cursor, and Gemini CLI without manual skill authoring."
tags: [open-source, AI-agents, CLI-tools, skills-ecosystem]
categories: [tools]
---

{% include figure.liquid path="/assets/img/projects/readme2skill.png" class="img-fluid rounded z-depth-1" %}

The agent skills ecosystem is exploding — Addy Osmani's agent-skills repo hit 77K stars, Matt Pocock's skills at 165K, and every major AI coding tool (Claude Code, Codex, Cursor, Gemini CLI) now supports SKILL.md files. These files tell the agent how to interact with a project, what commands to use, and what conventions to follow.

But there's a problem: **nobody wants to write a SKILL.md by hand.** If you have 20 repos, that's a lot of tedious YAML.

## Enter readme2skill

`readme2skill` is a CLI tool that scans your project directory — README, docs, config files, scripts, workflows — and auto-generates a complete SKILL.md. Point it at any repo and it figures out:

- **Project identity** — name, description, language detection
- **Key commands** — extracted from `package.json` scripts, `pyproject.toml` entry points, `Makefile` targets
- **File patterns** — relevant globs based on detected languages and project structure
- **Usage instructions** — from README sections and config file analysis

## Three output formats

| Format | Flag | When to use |
|--------|------|-------------|
| agent-skills | `-f agent-skills` (default) | Direct SKILL.md for agent workflows |
| pocock | `-f pocock` | Matt Pocock-style prompt-centric format |
| yaml | `-f yaml` | Machine-readable for pipelines |

## Quick start

```bash
# Install
pip install readme2skill

# Generate a skill for any project
readme2skill /path/to/project -o SKILL.md

# Watch mode — auto-regenerate when docs change
readme2skill /path/to/project -o SKILL.md --watch

# Different formats
readme2skill /path/to/project -f yaml
```

## The dogfooding moment

The fun part: I used readme2skill to generate skills for **all 9 of my own open-source repos** in under 10 seconds. It then saved them directly into my agent's skill system — now my own coding agent has full context on every tool I've built.

## Try it

```bash
pip install readme2skill
# or
npx readme2skill

readme2skill . -o SKILL.md
```

[GitHub →](https://github.com/vikasudasi/readme2skill)