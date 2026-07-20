---
layout: post
title: "skill-audit: The First Tool to Manage Your Agent Skills Ecosystem"
description: A CLI tool that audits, validates, and inventories SKILL.md files across any agent ecosystem — because with 80K+ stars of agent skills, zero management tooling is a gap worth filling.
date: 2026-07-20 08:00:00 +0530
categories: ai open-source tools
tags: [ai-agents, open-source, cli, developer-tools, python, skills, agent-ecosystem]
related_posts: false
---

The agent skills ecosystem is exploding. **77K stars on `agent-skills` alone** (and gaining 1,000+ *a day*). Claude Code, Codex CLI, Cursor, Gemini CLI — every major agent platform now uses SKILL.md files to define reusable capabilities.

But there's a problem: **zero tooling to manage them.**

You can't audit them. You can't validate them. You can't see what's installed, check for conflicts, or diff two sets of skills. When you have 50+ skills from different sources, it's a mess waiting to happen.

## Enter skill-audit

**skill-audit** is a Python CLI that does exactly what the name says — it audits your skills directory, tells you what's valid, what's broken, what conflicts, and what changed.

It's not a platform. It's not a framework. It's a **dead-simple CLI** you run against any directory of SKILL.md files.

## Three commands

### `skill-audit audit ./skills`

Scans every SKILL.md file in a directory and validates:

- **YAML frontmatter** — does it have the `---` delimiters?
- **Required fields** — `name` and `description` must be present
- **Semver versions** — `version` should be valid semver if present
- **Broken references** — `related_skills` and `linked_files` paths that don't exist
- **Duplicate names** — same skill name in two different files
- **Similar descriptions** — two skills describing the same thing (edit distance ≤ 10)

```bash
$ skill-audit audit ~/.hermes/skills
Audit result for /root/.hermes/skills: PASS
Skills parsed: 82
Errors: 0
Warnings: 2
```

### `skill-audit inventory ./skills`

Lists everything installed in a human-readable tree or machine-readable JSON:

```bash
$ skill-audit inventory ~/.hermes/skills
Skills
├── airtable | Airtable REST API via curl. Records CRUD, filters, upserts.
├── arxiv | Search arXiv papers by keyword, author, category, or ID.
├── ascii-art | ASCII art: pyfiglet, cowsay, boxes, image-to-ascii.
├── blogwatcher | Monitor blogs and RSS/Atom feeds via blogwatcher-cli tool.
├── chrome-cdp | Control Chrome via CDP — zero X server load.
...
```

### `skill-audit diff ./old-skills ./new-skills`

Shows what changed between two skill directories — added, removed, or modified skills with version bumps.

## Why I built this

I have **82 skills** installed in my Hermes Agent setup. Eighty-two. And I'm not a power user — that's just the default set plus what I've built for my daily workflow.

When I looked for a tool to tell me what was actually installed, whether they were valid, and whether anything conflicted — there was nothing. Not one tool. The entire ecosystem has 80K+ GitHub stars worth of skills content and zero management tooling.

That's the gap.

## The tech

Pure Python, zero heavy dependencies:

- **CLI** — `argparse` (stdlib)
- **Frontmatter parsing** — `PyYAML`
- **Output** — ANSI-colored terminal or `--json` for piped workflows

The validator checks semantic versioning, detects broken cross-references, and even catches description similarity using edit distance. It's designed to work with *any* agent ecosystem — Claude Code, Codex CLI, Cursor, Gemini CLI, Hermes Agent, or custom SKILL.md directories.

## Try it

```bash
pip install skill-audit

# Validate your skills
skill-audit audit ./my-skills

# See what's installed
skill-audit inventory ./my-skills --json

# See what changed after an update
skill-audit diff ./old-skills ./new-skills
```

The repo is on GitHub: [github.com/vikasudasi/skill-audit](https://github.com/vikasudasi/skill-audit)

## What's next

- **Remote inventory** — audit skills from a GitHub repo URL, not just local paths
- **Skill linting** — custom rules beyond the built-in checks (e.g. "no description longer than 200 chars")
- **Format migration** — convert between agent-specific skill formats
- **GitHub Action** — auto-validate skills on every PR to a skills repo

---

*This is the latest in my daily workflow: research a trend → identify a gap → build something → share it. Follow along on [GitHub](https://github.com/vikasudasi) or [LinkedIn](https://linkedin.com/in/vikasudasi).*