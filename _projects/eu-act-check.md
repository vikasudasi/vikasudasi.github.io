---
layout: page
title: eu-act-check
description: "CLI compliance scanner for EU AI Act Article 50 — scans files for C2PA manifests, EXIF metadata, and AI disclosure text patterns."
importance: 1
category: work
github: vikasudasi/eu-act-check
img: /assets/img/projects/eu-act-check.png
---

# eu-act-check 🔍

**EU AI Act Article 50 compliance scanner** — Scan files for C2PA provenance manifests, EXIF/XMP AI generation metadata, and synthetic text markers. Identify compliance gaps *before* regulators do.

## The Problem

**August 2, 2026** — the EU AI Act's transparency requirements under **Article 50** take full effect. Any AI-generated or deepfake content distributed in the EU must carry:

- **C2PA provenance manifests** (Content Credentials) embedded in the file
- **Metadata declarations** identifying the AI tool used to create it
- **Disclosure statements** for AI-generated text

Failure is not optional — penalties can reach **3% of global annual turnover** or **€15 million**.

`eu-act-check` scans your file tree *now* and tells you exactly what's missing and how to fix it, so August 2 doesn't catch you off guard.

## Quickstart

```bash
pip install eu-act-check

# Scan a directory (recursive)
eu-act-check scan ./content/ --recursive

# Quick CI check — exit 0 (pass) or 1 (warn/fail)
eu-act-check check ./blog-post.md

# Deep dive into one file
eu-act-check inspect ./hero-image.jpg
```

## CLI Reference

### `scan` — Scan files or directories

```
eu-act-check scan <target> [--recursive] [--format table|json] [--remediate]
```

| Argument | Description |
|---|---|
| `target` | File or directory to scan **(required)** |
| `--recursive`, `-r` | Scan directories recursively |
| `--format`, `-f` | Output format: `table` (default) or `json` |
| `--remediate` | Show remediation instructions for failing files |

### `inspect` — Deep dive on one file

```
eu-act-check inspect <file>
```

Shows every detector's findings for a single file with full detail and remediation.

### `check` — CI mode

```
eu-act-check check <file>
```

Returns exit code `0` (pass) or `1` (warn/fail). Designed for CI pipeline gates.

## Detection Layers

| Layer | What It Checks | File Types | Standard |
|---|---|---|---|
| **C2PA** | Embedded provenance manifests | JPEG, PNG, WebP, MP4, audio, PDF | C2PA ISO / Content Credentials |
| **EXIF/XMP/IPTC** | AI generation tool signatures | JPEG, PNG, WebP | `XMP.xmp.GenerateTool`, `IPTC.DigitalSourceType` |
| **Text patterns** | AI disclosure markers, watermark comments | .md, .txt, .html, .json, .yaml, .xml, .csv | 18 regex patterns |

## Architecture

```
╭──────────────╮     ╭──────────────╮     ╭────────────────╮
│              │     │              │     │                │
│  cli.py      │────>│  scanner.py  │────>│  compliance.py │
│  (Typer)     │     │  (pathspec)  │     │  (aggregator)  │
│              │     │              │     │                │
╰──────────────╯     ╰──────────────╯     ╰───────┬────────╯
                                                   │
            ┌──────────────────────────────────────┼──────────────────────┐
            │              ╭──────────╮           │          ╭──────────╮│
            │              │ c2pa.py  │           │          │ table.py ││
            │              ├──────────┤           │          ├──────────┤│
            │              │ exif.py  │           │          │ json_rep ││
            │              ├──────────┤           │          ╰──────────╯│
            │              │text_patt │           │                     │
            │              ╰──────────╯           │                     │
            │           detectors/                │       reporters/    │
            └─────────────────────────────────────┴─────────────────────┘
```

## Use Cases

### 📋 Pre-deployment audit

```bash
eu-act-check scan ./assets/ --recursive --remediate > compliance-report.txt
```

### 🔄 CI/CD gate

```yaml
# .github/workflows/eu-compliance.yml
steps:
  - uses: actions/checkout@v4
  - run: pip install eu-act-check
  - run: eu-act-check check ./dist/ --recursive
```

## Development

```bash
git clone https://github.com/vikasudasi/eu-act-check.git
cd eu-act-check
pip install -e ".[dev]"

make lint       # Ruff linting
make typecheck  # mypy type checking
make test       # 87 tests, 85% coverage
```

## Resources

- [EU AI Act — Article 50](https://artificialintelligenceact.eu/article/50/)
- [C2PA Specification](https://c2pa.org/specifications/)
- [IPTC Photo Metadata Standard](https://iptc.org/standards/photo-metadata/)