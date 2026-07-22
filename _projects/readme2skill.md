---
layout: page
title: readme2skill
description: "CLI that reads your README and docs to auto-generate agent skill definitions (SKILL.md) — compatible with Claude Code, Codex, Cursor, and Gemini CLI"
importance: 1
category: work
github: vikasudasi/readme2skill
img: /assets/img/projects/readme2skill.png
---


Turn any repository into a reusable AI agent skill definition by scanning project docs and structure.

## Why readme2skill

Most repositories already contain guidance spread across `README.md`, config files, and project layout.
`readme2skill` converts that context into a structured skill artifact you can feed to agents and automation.

Use it when you want to:

- Bootstrap agent context quickly from an existing codebase
- Standardize repository conventions into one output file
- Export skill data in markdown or machine-friendly YAML
- Keep generated output up-to-date in watch mode as files change

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [CLI Options Reference](#cli-options-reference)
- [Output Formats](#output-formats)
- [Output Structure Details](#output-structure-details)
- [Architecture Overview](#architecture-overview)
- [Environment Variables](#environment-variables)
- [Error Handling and Exit Codes](#error-handling-and-exit-codes)
- [Development and Testing](#development-and-testing)
- [License](#license)

## Features

- Scans project files recursively and ignores common build/cache directories
- Extracts high-value signals: README sections, key config files, docs, scripts, and workflows
- Detects primary languages using file extensions and key files
- Discovers common commands from `pyproject.toml`, `package.json`, and `Makefile`
- Renders three output formats: `agent-skills`, `yaml`, and `pocock`
- Supports `--watch` mode to regenerate output after relevant file changes

## Requirements

- Python `>=3.9`
- Dependencies:
  - `PyYAML`
  - `watchdog` (required for `--watch` mode)

## Installation

### Install from Local Source (Editable)

```bash
git clone <your-fork-or-repo-url>
cd readme2skill
pip install -e .
```

### Install Dependencies for Development

```bash
pip install -e ".[dev]"
```

## Quick Start

Generate a default `SKILL.md` for the current repository:

```bash
readme2skill .
```

Generate a skill for another project and write to a custom path:

```bash
readme2skill /path/to/project -o /path/to/output/SKILL.md
```

Generate YAML output for programmatic processing:

```bash
readme2skill /path/to/project -f yaml -o skill.yaml
```

## Usage

### Basic Syntax

```bash
readme2skill [project_dir] [options]
```

### Common Workflows

Generate default markdown skill format:

```bash
readme2skill /repo -f agent-skills -o SKILL.md
```

Generate Matt Pocock style markdown format:

```bash
readme2skill /repo -f pocock -o POCOCK_SKILL.md
```

Override generated name and description:

```bash
readme2skill /repo \
  --name "acme-platform-skill" \
  --description "Agent skill for the Acme platform monorepo."
```

Continuously regenerate output while editing project docs and config:

```bash
readme2skill /repo -o SKILL.md --watch
```

Run via module entrypoint:

```bash
python -m readme2skill /repo -o SKILL.md
```

## CLI Options Reference

| Option | Alias | Type | Default | Description |
|---|---|---|---|---|
| `project_dir` | - | positional | `.` | Project directory to scan |
| `--output` | `-o` | string | `SKILL.md` | Output file path |
| `--format` | `-f` | string | `agent-skills` | Output format (`agent-skills`, `pocock`, `yaml`) |
| `--watch` | `-w` | flag | `false` | Regenerate output when files change |
| `--name` | `-n` | string | inferred | Override generated skill name |
| `--description` | `-d` | string | inferred | Override generated skill description |
| `--version` | `-V` | flag | - | Print CLI version and exit |

## Output Formats

`readme2skill` supports three output formats with different consumption goals.

### 1) `agent-skills` (default)

Best for direct use as `SKILL.md` in agent workflows.

```markdown
---
name: my-repo
description: "Agent skill for my repo"
version: 1.0.0
---

## Overview
Minimal skill generated from file structure.

## Commands
- `python:readme2skill`: `python -m readme2skill`

## File Patterns
- `*.py`
- `pyproject.toml`
- `README.md`
```

### 2) `yaml`

Best for automation, APIs, and downstream transformation pipelines.

```yaml
name: my-repo
description: Agent skill for my repo
version: 1.0.0
overview: Minimal skill generated from file structure.
usage: Use this repository conventions when making changes.
commands:
  python:readme2skill: python -m readme2skill
file_patterns:
  - "*.py"
  - pyproject.toml
detected_languages:
  - python
warnings: []
```

### 3) `pocock`

Best when you want prompt-centric markdown with tags and concise file targeting.

```markdown
---
title: my-repo
description: "Agent skill for my repo"
author: readme2skill
tags:
  - python
  - skill
---

## Prompt
You are working on `my-repo`. Respect project conventions.

## Files
- `*.py`
- `pyproject.toml`
```

## Output Structure Details

Generation pipeline fills each output from a canonical project model:

- **Name**: repo directory name by default, or README title when available
- **Description**: first non-heading prose block from README, unless overridden
- **Overview**: prefers README sections like `## Overview` or `## About`
- **Usage**: prefers README `## Usage`, then installation/examples fallback
- **Commands**: inferred from `project.scripts`, npm scripts, make targets, and tool defaults
- **File patterns**: language patterns + key files + docs/workflows/scripts hints
- **Warnings**: includes cases like empty directories or missing README

## Architecture Overview

The codebase is intentionally small and modular:

- `readme2skill/cli.py`: argument parsing, format selection, and file output
- `readme2skill/scanner.py`: recursive scan + normalized `ProjectStructure`
- `readme2skill/analyzer.py`: README parsing, metadata extraction, command/language inference
- `readme2skill/formats/`: renderer implementations for each output format
- `readme2skill/watcher.py`: file change monitoring with debounced regeneration

### High-Level Data Flow

1. CLI validates args and calls scanner
2. Scanner builds `ProjectStructure` (files, docs, key files, extensions)
3. Analyzer transforms structure into `ProjectData`
4. Selected formatter renders text
5. CLI writes output file and prints `Generated <path>`

## Environment Variables

`readme2skill` does not require custom environment variables to run.

Optional variables that may be useful in some environments:

| Variable | Required | Purpose |
|---|---|---|
| `PYTHONPATH` | No | Ensure local package resolution in custom runtimes |
| `PYTHONUNBUFFERED` | No | Force unbuffered logs in CI or containerized execution |

## Error Handling and Exit Codes

- **Exit code `0`**: successful generation
- **Exit code `1`**: validation/runtime usage errors (unsupported format, bad path, watch dependency missing)
- **Exit code `2`**: I/O errors while creating directories or writing output

Typical error examples:

- Invalid project directory: `Project directory does not exist: <path>`
- Invalid format: `Unsupported format: <format>`
- Missing watch dependency: `watchdog is required for --watch mode. Install dependencies first.`

## Development and Testing

Run test suite:

```bash
pytest
```

Run quick format smoke tests manually:

```bash
readme2skill tests/fixtures/basic-project -f agent-skills -o /tmp/basic-skill.md
readme2skill tests/fixtures/basic-project -f yaml -o /tmp/basic-skill.yaml
readme2skill tests/fixtures/js-project -f pocock -o /tmp/js-pocock.md
```

## License

No license file is currently present in this repository.
Add a `LICENSE` file (for example, MIT, Apache-2.0, or BSD-3-Clause) to define usage terms clearly.
