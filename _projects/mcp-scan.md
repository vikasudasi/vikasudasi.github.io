---
layout: page
title: mcp-scan
description: "CLI security scanner for MCP (Model Context Protocol) servers — detects ANSI escape injection, over-permissive tools, prompt injection vectors, and insecure transport"
importance: 1
category: work
github: vikasudasi/mcp-scan
img: /assets/img/projects/mcp-scan.png
---

CLI security scanner for MCP (Model Context Protocol) servers.

## Why

The MCP ecosystem is exploding — hundreds of servers launching weekly — with zero dedicated security tooling. The first major vulnerability (ANSI escape injection) was disclosed recently, and there's no standalone audit tool for MCP implementations. `mcp-scan` fills that gap.

## Installation

### Requirements

- Python `3.10+`

### From PyPI

```bash
pip install mcp-scan
```

### From source

```bash
git clone https://github.com/vikasudasi/mcp-scan
cd mcp-scan
pip install -e .
```

## Usage

### Scan a config file

```bash
mcp-scan -c my_mcp_config.json
```

### Scan a remote endpoint

```bash
mcp-scan --url https://my-mcp-server.com/sse
```

### Generate JSON report

```bash
mcp-scan -c config.json -o json --output-file report.json
```

### Filter by severity

```bash
mcp-scan -c config.json --severity high
```

## Check Reference

| Check ID | Severity | Description |
|----------|----------|-------------|
| `ANSI-001` | high | ANSI escape injection in tool descriptions/responses |
| `PERM-001` | high | Unrestricted filesystem access |
| `PERM-002` | critical | Unrestricted shell execution |
| `PERM-003` | high | Unrestricted network access |
| `VAL-001` | medium | Parameter missing type constraint |
| `VAL-002` | medium | String parameter without pattern/enum/length validation |
| `INJ-001` | high | Tool metadata dynamically templated |
| `INJ-002` | high/medium | User content flows into system prompts/resources |
| `TLS-001` | high | HTTP instead of HTTPS |
| `TLS-002` | high | WebSocket without TLS |

## Output Formats

**Terminal:** Color-coded Rich table with check ID, severity, title, location, and evidence.

**JSON:** Structured report with scan ID, timestamp, summary counts, findings array with remediation, and server info.

## Architecture

Modular check system — each vulnerability class is an independent module. Adding new checks requires a single function that returns `Finding[]`.

## License

MIT
