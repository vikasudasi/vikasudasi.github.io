---
layout: page
title: agent-creds-scanner
description: "Scan AI agent config files for hardcoded credentials before they leak."
importance: 1
category: work
github: vikasudasi/agent-creds-scanner
img: /assets/img/projects/agent-creds-scanner.png
---


Scan AI agent configuration files for hardcoded credentials before they leak.

---

## Why This Exists

AI agent repos increasingly include config files that were never treated like production secrets vaults:

- `CLAUDE.md` and `AGENTS.md` instruction files
- `.cursorrules` and `.cursor/rules/*`
- MCP server config JSON/YAML
- Plugin manifests and editor integration files

During 2026's agent credential incidents, teams discovered exposed keys in prompt/config files that bypassed
traditional secret scanners because those scanners focused on application code and env files, not agent metadata.

`agent-creds-scanner` closes that gap by defaulting to **agent-specific files**, assigning **risk levels**, and
returning **CI-friendly exit codes**.

---

## Installation

### Install from PyPI

```bash
pip install agent-creds-scanner
```

### Install from source

```bash
git clone https://github.com/your-org/agent-creds-scanner.git
cd agent-creds-scanner
pip install -e .
```

### Verify installation

```bash
agent-creds-scanner --help
```

---

## Quick Start

```bash
# Scan current directory (agent config files only)
agent-creds-scanner

# Scan a specific repository
agent-creds-scanner /path/to/repo

# Scan every file in the repo
agent-creds-scanner /path/to/repo --all-files
```

---

## CLI Usage

### Main command

```bash
agent-creds-scanner [PATH] [OPTIONS]
```

`PATH` defaults to `.`.

### Options reference

| Option | Default | Description |
|---|---|---|
| `PATH` | `.` | Directory to scan |
| `--all-files` | `False` | Scan all files, not only agent config files |
| `--json` | `False` | Emit JSON output |
| `--csv` | `False` | Emit CSV output |
| `--quiet` | `False` | Hide report banner, show findings only |
| `--min-risk {low,medium,high}` | `low` | Minimum risk level to include |
| `--no-gitignore` | `False` | Ignore `.gitignore` rules |
| `--no-follow` | `False` | Do not follow symlinks |
| `--output PATH` | stdout | Write output to a file |
| `--help` | n/a | Show help |

### Hook commands

```bash
agent-creds-scanner install-hook [--target PATH]
agent-creds-scanner remove-hook [--target PATH]
```

---

## Agent File Targets (default scope)

By default, the scanner only processes files matching these patterns:

- `**/CLAUDE.md`
- `**/.cursorrules`
- `**/.cursor/rules/**`
- `**/mcp*.json`
- `**/mcp*.yaml`
- `**/mcp*.yml`
- `**/plugin/**/*.json`
- `**/AGENTS.md`
- `**/.hermes/**/*.json`
- `**/.hermes/**/*.yaml`
- `**/.vscode/**/*.json`
- `**/.github/copilot-instructions.md`

Use `--all-files` to scan the complete repository tree.

---

## Risk Levels

### High

Known key/token formats or explicit credential fields:

- OpenAI key patterns (`sk-...`, `sk-proj-...`, etc.)
- Anthropic key patterns (`sk-ant-...`)
- AWS Access Key IDs and AWS secret key fields
- Google API keys (`AIza...`)
- GitHub/GitLab/Slack/Discord/Telegram/Stripe token formats
- SSH private key headers
- Bearer tokens in config fields
- `api_key` / `apikey` fields with long values
- Password fields with inline literals

### Medium

Likely credentials but less deterministic:

- JWT-like values
- Generic session tokens
- Generic `token=` values
- Credentialed connection strings (Mongo, Postgres, MySQL, Redis)

### Low

Suspicious values that merit review:

- Base64-like high-entropy values
- Long high-entropy strings
- Embedded URL credentials

---

## Output Formats

### Default terminal report (Rich table)

```text
╭──────────────────────────────────────────────────────╮
│ agent-creds-scanner — Credential Scan Report        │
├──────────────────────────────────────────────────────┤
│ Files scanned: 47                                   │
│ Files with hits: 3                                  │
│ Total findings: 5                                   │
│ Duration: 0.28s                                     │
╰──────────────────────────────────────────────────────╯
┏━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┓
┃  # ┃ File                 ┃ Line ┃ Risk   ┃ Type              ┃ Match        ┃
┡━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━┩
│ 1  │ CLAUDE.md            │ 42   │ HIGH   │ OpenAI API Key    │ sk-proj-...  │
│ 2  │ .cursorrules         │ 15   │ MED    │ Session Token     │ ABCDEF...    │
└────┴──────────────────────┴──────┴────────┴───────────────────┴──────────────┘
```

### JSON output

```bash
agent-creds-scanner --json --output findings.json
```

```json
{
  "scanned_files": 47,
  "files_with_hits": 3,
  "duration_seconds": 0.2841,
  "findings": [
    {
      "file": "CLAUDE.md",
      "line": 42,
      "risk": "high",
      "type": "OpenAI API Key",
      "match": "sk-proj-AB...",
      "snippet": "OPENAI_API_KEY=sk-proj-AB..."
    }
  ],
  "warnings": []
}
```

### CSV output

```bash
agent-creds-scanner --csv > findings.csv
```

```csv
file,line,risk,type,match
CLAUDE.md,42,high,OpenAI API Key,sk-proj-AB...
.cursorrules,15,medium,Session Token,ABCDEF0123...
```

---

## Pre-commit Hook

Install a managed Git pre-commit hook:

```bash
agent-creds-scanner install-hook
```

The hook runs:

```bash
agent-creds-scanner --quiet --min-risk medium
```

Behavior:

- Exit `0`: commit continues.
- Exit `1`: findings detected, commit is blocked.
- Exit `2`: scanner error, commit is blocked for safety.

Remove it later with:

```bash
agent-creds-scanner remove-hook
```

---

## CI Integration (GitHub Actions)

```yaml
name: Secret Scan

on:
  pull_request:
  push:
    branches: [main]

jobs:
  agent-creds-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install agent-creds-scanner
      - run: agent-creds-scanner --json --min-risk medium
```

---

## Exit Codes

| Code | Meaning |
|---|---|
| `0` | Scan completed, no findings at/above selected risk threshold |
| `1` | Scan completed, findings detected |
| `2` | Scan failed due to usage/runtime error |

---

## Notes and Edge Cases

- Empty directory scans are valid and return exit `0`.
- No matching agent config files also returns exit `0`.
- Binary files are skipped automatically.
- Files larger than 1 MB are skipped with a warning.
- Permission errors are warned and scanning continues.
- `.git` directory content is ignored.

---

## Development

```bash
pip install -e .[dev]
pytest
```

---

## License

MIT