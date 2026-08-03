---
layout: page
title: mcp-apps-render
description: "CLI that renders MCP Apps interactive UI payloads (dashboards, forms, visualizations) directly in the terminal — no browser, no iframe, no HTML"
importance: 1
category: work
github: vikasudasi/mcp-apps-render
img: /assets/img/projects/mcp-apps-render.png
---

Render MCP Apps interactive UI payloads — dashboards, forms, visualizations —
directly in your terminal. No browser, no iframe, no HTML.

As MCP Apps goes production-ready across Claude, ChatGPT, VS Code Copilot,
Goose, Postman, and MCPJam, more tools return rich UI payloads. But those
payloads are designed to be rendered inside an AI client's embedded iframe. On
a **headless server**, in **CI**, over **SSH**, or just preferring the
terminal, there was no way to see what those payloads contain. `mcp-apps-render`
fills that gap — it inspects a payload's schema, renders it locally, or
connects to a running MCP server and renders the result of a tool call.

## Commands

| Command | Purpose |
|---------|---------|
| `mcp-apps-render inspect` | Parse + summarize a payload's schema (component tree, counts, depth) |
| `mcp-apps-render render` | Render a payload as terminal-safe Rich/ASCII output |
| `mcp-apps-render serve` | Connect to a live MCP server, invoke a tool, render the result |

## Quick Start

```bash
pipx install mcp-apps-render        # or mcp-apps-render[client] for `serve`

mcp-apps-render inspect payload.json
mcp-apps-render render payload.json
mcp-apps-render serve http://localhost:8003/mcp --tool get_app
```

## Supported Component Types

The renderer classifies every component into one of four kinds — layout
(panels), form (input fields), data (tables, charts, stats), and unknown
(preserved, degrades to a placeholder) — so it stays forward-compatible with
new MCP Apps components.

## Architecture

```
payload (file | JSON string | MCP tool result)
      │
      ▼
parser.parse() ──► ComponentTree ──► renderer / dump ──► terminal output
```

Built with Python 3.11+, Typer + Rich + pydantic, ruff + mypy strict, CI on
3.11/3.12. **53 tests, 85% coverage.**

## Links

- **GitHub:** [github.com/vikasudasi/mcp-apps-render](https://github.com/vikasudasi/mcp-apps-render)
- **Companion:** [mcp-app-suite](https://github.com/vikasudasi/mcp-app-suite) — the browser-side toolchain for the same payload format
