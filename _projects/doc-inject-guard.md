---
layout: page
title: doc-inject-guard
description: CLI tool that scans documents (DOCX, PDF, Markdown, HTML) for embedded prompt injection payloads targeting AI agents. Features five detection modules, risk scoring, multi-format reporting, and watch mode.
img: /assets/img/projects/doc-inject-guard.png
importance: 4
category: security
related_publications: false
---

## doc-inject-guard

**Scan documents for hidden prompt injection before they reach your AI agent pipeline.**

[![PyPI](https://img.shields.io/pypi/v/doc-inject-guard)](https://pypi.org/project/doc-inject-guard/)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![CI](https://github.com/vikasudasi/doc-inject-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/vikasudasi/doc-inject-guard/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Context Collapse AI worm (2026) proved malicious instructions hidden in Word documents can alter financial data via Microsoft Copilot, exfiltrate sensitive information, and self-propagate. `doc-inject-guard` acts as a document-level security gate.

### Quick Start

```bash
pip install doc-inject-guard
doc-inject-guard scan ./incoming-docs/
doc-inject-guard scan ./incoming/ --recursive --format json --ci
doc-inject-guard analyze suspicious.docx --llm
doc-inject-guard watch ./hotfolder/
```

### Features

- **4 parsers** — DOCX, PDF, Markdown, HTML
- **5 detection modules** — Hidden text, encoded payloads, suspicious URLs, metadata injection, behavioral instructions
- **Risk scoring** — 0-100 weighted score with severity categorization
- **3 output formats** — Rich terminal, JSON (CI), SARIF (GitHub Security)
- **Watch mode** — Real-time directory monitoring
- **LLM analyzer** — Optional deep analysis for subtle injection patterns
- **112 tests, 85% coverage**

### Links

- [GitHub Repository](https://github.com/vikasudasi/doc-inject-guard)
- [PyPI Package](https://pypi.org/project/doc-inject-guard/)
- [Blog Post](/blog/2026/doc-inject-guard/)