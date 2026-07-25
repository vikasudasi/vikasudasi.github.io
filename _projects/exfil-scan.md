---
layout: page
title: exfil-scan
description: "CLI that scans LLM outputs for data exfiltration signals — hidden text, encoded data, suspicious URLs, metadata leaks"
importance: 1
category: work
github: vikasudasi/exfil-scan
---

# exfil-scan

Scans LLM outputs and AI-generated content for signs of data exfiltration.

## Why

The [EchoLeak vulnerability (CVE-2025-32711, CVSS 9.3)](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2025-32711) showed that zero-click prompt injection in Microsoft 365 Copilot could exfiltrate data via hidden text in documents. As LLMs handle increasingly sensitive information, the outputs themselves become a new attack vector — attackers can embed stolen data in seemingly innocent responses using hidden characters, encoded blocks, or suspicious URLs.

Traditional security tools don't monitor what AI systems *output*. `exfil-scan` fills that gap — it's a "virus scanner" for LLM responses.

## What It Detects

Six categories of exfiltration signals, each independently configurable:

- **Hidden Text (HIGH)** — Zero-width characters (U+200B, U+200C, U+200D, U+FEFF, etc.) and consecutive invisible sequences used to encode data invisibly — the same technique used in EchoLeak.
- **Encoded Data (HIGH)** — Base64 blocks, hex strings, octal escape sequences, and unicode escape sequences embedded in responses that may contain exfiltrated data.
- **Data-in-URL (MEDIUM)** — URLs with suspiciously long query parameters, base64/hex in query strings, or URL-encoded data payloads indicating callback-based exfiltration.
- **Metadata Leaks (HIGH)** — JSON/XML keys matching credential patterns (`api_key`, `secret_key`, `password`, `token`, etc.), values matching known token formats (OpenAI, Stripe, GitHub personal access tokens, Slack tokens).
- **Unicode Steganography (MEDIUM)** — Bidirectional text controls (RTL/LTR overrides), mixed Unicode scripts (Cyrillic + Latin homoglyphs) used for hidden messaging.
- **Structural Anomalies (LOW)** — Excessive consecutive newlines, unusual tab runs, or replacement characters indicating binary data incorrectly decoded as text.

## Installation

### From pip (recommended)

```bash
pip install exfil-scan
```

### From source

```bash
git clone https://github.com/vikasudasi/exfil-scan.git
cd exfil-scan
pip install -e .
```

### Developer install

```bash
pip install -e ".[dev]"
```

## Usage

### Scan from stdin

```bash
echo "LLM response here" | exfil-scan
```

### Scan a file

```bash
exfil-scan response.json
```

### Scan a directory

```bash
exfil-scan /path/to/responses/
```

### Output formats

```bash
# Plain text (default, human-readable)
exfil-scan --format text responses.json

# JSON (machine-readable, CI integration)
exfil-scan --format json responses.json -o report.json

# HTML (browser-friendly report)
exfil-scan --format html responses.json -o report.html

# Markdown (documentation friendly)
exfil-scan --format markdown responses.json
```

### Example output

Scanning a file containing an embedded API key:

```
exfil-scan report.json
exfil-scan report
=================
Scanned targets: 1
Total findings: 3

[!!!] KNOWN_TOKEN_FORMAT
     Severity: high
     Location: report.json:1:14
     Description: Matched known credential/token format (openai_key).
     Snippet: {"api_key": "sk-1234567890abcdefghijklmnopqrstuvwxyz"...
```

### Configuration

Create a YAML config file to customize detection:

```bash
exfil-scan --dump-config > config.yaml
```

```yaml
sensitivity: medium  # low, medium, high
rules:
  hidden_text:
    enabled: true
    severity: high
  encoded_data:
    enabled: true
    severity: high
  # ... more rules
custom_patterns:
  - name: my_secret_pattern
    pattern: "MY_SECRET[=_]\\s*[A-Za-z0-9]{20,}"
    severity: high
```

## CLI Options Reference

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `INPUT` | argument | stdin | Path to an input file to scan. Omitted to read from stdin. |
| `-d DIRECTORY` | argument | none | Path to a directory of files to scan. |
| `-r` | flag | false | Recursively scan nested files when --directory is used. |
| `-c CONFIG` | path | default | YAML configuration file path. |
| `-s LEVEL` | enum | medium | Sensitivity profile: low, medium, or high. |
| `-f FORMAT` | enum | text | Output format: text, json, html, or markdown. |
| `-o OUTPUT` | path | stdout | Write report to this file instead of stdout. |
| `--dump-config` | flag | false | Print default configuration to stdout and exit. |
| `--help` | flag | n/a | Shows help message and exits. |
| `--version` | flag | n/a | Shows version and exits. |

## Configuration

### Sensitivity Levels

| Level | Effect | Best For |
| --- | --- | --- |
| `low` | Higher thresholds, fewer false positives | Production CI pipelines |
| `medium` | Balanced detection | General use, development |
| `high` | Lower thresholds, catches more | Security auditing, red teaming |

### Custom Patterns

Add custom regex patterns to the YAML config under `custom_patterns`. Each pattern needs a `name`, `pattern` (regex), and `severity`. Invalid regex patterns are reported as findings rather than crashing.

## Architecture

```
cli.py          argparse CLI: input selection, output formatting, config loading
config.py       Default config, sensitivity adjustments, pattern definitions
scanner.py      Core detection engine: 6 rule categories, severity classification
```

**Execution flow:**
1. CLI parses arguments and loads YAML config
2. Reads input text from file, directory, or stdin
3. Scanner runs all enabled rule categories against the text
4. Findings are classified by severity and sorted (HIGH → LOW)
5. Formatter renders results in requested output format

## Exit Codes

| Code | Meaning |
| --- | --- |
| `0` | No exfiltration signals detected (clean) |
| `1` | Exfiltration signals detected (findings found) |
| `2` | Error: invalid arguments, file not found, config error |

## Testing

Run tests with:

```bash
pytest
```

Tests cover all six detection categories and all output formats.

## License

MIT License. See [LICENSE](https://github.com/vikasudasi/exfil-scan/blob/main/LICENSE) for details.
