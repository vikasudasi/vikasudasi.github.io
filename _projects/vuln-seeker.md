---
layout: page
title: vuln-seeker
description: "CLI code security scanner — detects vulnerabilities with 25+ regex patterns and optional AI-powered triage, with JSON/Markdown reports and CI mode"
importance: 1
category: work
github: vikasudasi/vuln-seeker
img: /assets/img/projects/vuln-seeker.png
---

Fast, regex-driven code security scanning with JSON/Markdown reports and optional AI-assisted triage.

## Why

Security reviews are often delayed because lightweight checks are missing from day-to-day development. `vuln-seeker` is designed to fill that gap:

- **Quick local feedback** before code reaches CI.
- **Broad language coverage** via text pattern matching (not parser-dependent).
- **Actionable output** with severity, location, rule, and remediation advice.
- **CI-friendly behavior** with non-zero exits for policy enforcement.
- **Optional AI analysis** to prioritize likely true positives and remediation order.

## Installation

### Requirements

- Python `3.10+`

### Install from source

```bash
git clone https://github.com/vikasudasi/vuln-seeker
cd vuln-seeker
pip install -e .
```

### Verify installation

```bash
vuln-seeker --version
vuln-seeker --help
```

## Usage

### Basic scan

```bash
vuln-seeker .
```

### Scan a specific path with all patterns

```bash
vuln-seeker ./src --pattern-set all
```

### CI mode (fail on high severity findings)

```bash
vuln-seeker . --ci
```

### AI-assisted analysis

```bash
export VULN_SEEKER_API_KEY="your_api_key"
vuln-seeker . --ai gpt-4.1
```

## CLI Reference

| Option | Type / Values | Default | Description |
| --- | --- | --- | --- |
| `path` | positional path | `.` | Directory to scan recursively. |
| `--ai MODEL` | string | none | Enables AI analysis and sets model name. |
| `--ci` | flag | off | Exit with code `1` if HIGH findings are present. |
| `--ignore PATTERN` | repeatable glob | `[]` | Ignore file/dir patterns. |
| `--output` | `json`, `markdown`, `both` | `both` | Report format(s). |
| `--pattern-set` | `standard`, `extended`, `all` | `standard` | Vulnerability rule coverage. |

## Detection Categories

- SQL injection
- XSS
- Hardcoded secrets
- Command injection
- Path traversal
- Insecure deserialization
- Sensitive data exposure

## Output Formats

**Terminal:** Color-coded findings with severity labels, file paths, descriptions, and fix suggestions.

**JSON:** Machine-readable report with `tool`, `version`, `scanned_files`, `total_findings`, `severity_counts`, and `findings` array.

**Markdown:** Human-readable report with scan metadata, severity summary, and detailed finding entries.

## License

MIT