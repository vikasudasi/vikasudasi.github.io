---
layout: page
title: skill-audit
description: CLI that audits, validates, and inventories agent skills (SKILL.md files) across any ecosystem
img: /assets/img/projects/skill-audit.png
importance: 2
category: work
github: vikasudasi/skill-audit
---

**Audit, validate, and inventory agent skills (SKILL.md files) across any agent ecosystem.**

The agent skills ecosystem is exploding — Claude Code, Codex CLI, Cursor, Gemini CLI, and the 80K+ star `agent-skills` repo all use SKILL.md files. But there's **zero tooling to manage them**. `skill-audit` fills that gap.

## Features

- **`audit`** — Scan a directory of SKILL.md files and validate format compliance. Detects missing required fields, broken references, duplicate skill names, and overlapping descriptions.
- **`inventory`** — List all installed skills in a tree or JSON output with descriptions, versions, and tags.
- **`diff`** — Compare two skill directories to see what was added, removed, or changed.
- **`--json`** — All commands support machine-readable JSON output for piping into other tools.

## Install

```bash
pip install skill-audit
```

Or from source:

```bash
git clone https://github.com/vikasudasi/skill-audit.git
cd skill-audit
pip install -e .
```

## Usage

```bash
# Validate a directory of skills
skill-audit audit ./skills

# Pretty-printed inventory tree
skill-audit inventory ./skills

# JSON output for scripting
skill-audit inventory ./skills --json

# See what changed between skill sets
skill-audit diff ./old-skills ./new-skills

# Quick help
skill-audit --help
```

## Example

```bash
$ skill-audit audit ~/.hermes/skills
Audit result for /root/.hermes/skills: PASS
Skills parsed: 82
Errors: 0
Warnings: 2

Warnings:
- claude-code/SKILL.md:3 [similar_description] Description is very similar to codex
- codex/SKILL.md:3 [similar_description] Description is very similar to claude-code
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All good |
| 1 | Validation errors found |
| 2 | File/IO error |

## Validation Rules

- YAML frontmatter must be between `---` delimiters
- Required fields: `name`, `description`
- `version` should be semantic versioning if present
- `related_skills` and `linked_files` paths must be valid
- Duplicate skill names across the directory are flagged
- Descriptions that are too similar (edit distance ≤ 10) trigger warnings