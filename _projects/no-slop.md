---
layout: page
title: no-slop
description: "CLI that scans your codebase for AI slop patterns and generates constraint files (SKILL.md, .cursorrules, CLAUDE.md, .clinerules) that make agents write clean, project-specific code"
importance: 1
category: work
github: vikasudasi/no-slop
img: /assets/img/projects/no-slop.png
---

A CLI tool that generates and enforces anti-slop constraints for AI coding agents. Scans your codebase for common "slop" patterns — boilerplate comments, generic variable names, over-engineering, utility-class CSS spam — and generates constraint files tailored to your project's actual issues.

## The Problem

AI agents generate generic code because their instructions don't know your project. no-slop solves this by scanning what's actually in your codebase and generating constraints that prevent those patterns from recurring.

## Features

### Pattern Detection (`no-slop scan`)

| Detector | What It Finds |
|----------|---------------|
| **Comments** | Boilerplate placeholders ("TODO: implement", "Your code here"), excessive comment-to-code ratio |
| **Variables** | Generic names (`temp`, `result`, `data`, `item`), type-encoded prefixes |
| **Abstraction** | Unnecessary base classes, deep inheritance chains, factory-for-one, interface-only abstractions |
| **CSS** | `!important` abuse, utility-only class designs, repeated inline styles |

### Constraint Generation (`no-slop generate`)

| Framework | Output | Format |
|-----------|--------|--------|
| Claude Code | `SKILL.md` | YAML frontmatter + design rules |
| Cursor | `.cursorrules` | YAML-style glob-patterned rules |
| Codex CLI | `CLAUDE.md` | Structured markdown conventions |
| Gemini CLI | `.clinerules` | Key:value constraints |

### CLI Commands

| Command | Description |
|---------|-------------|
| `no-slop init` | Create default `.no-slop.yml` config |
| `no-slop scan` | Analyze codebase for slop patterns |
| `no-slop generate` | Generate constraint files from scan results |
| `no-slop apply` | Install generated constraint files |
| `no-slop check` | Validate existing constraint files |

## Links

- **GitHub:** [github.com/vikasudasi/no-slop](https://github.com/vikasudasi/no-slop)
- **Install:** `pip install no-slop`
