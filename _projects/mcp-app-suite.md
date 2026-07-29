---
layout: page
title: mcp-app-suite
description: "MCP Apps development suite: playground to preview interactive HTML UIs, scaffolder to scaffold new projects, and demo server with three sample apps"
importance: 1
category: work
github: vikasudasi/mcp-app-suite
img: /assets/img/projects/mcp-app-suite.png
---

MCP Apps development suite — three tools that together form a complete ecosystem for building MCP Apps (interactive HTML UIs embedded in AI conversations).

## The Tools

### mcp-app-playground

A CLI that acts as an MCP Host. Connect to any MCP server, discover apps, and preview them in your browser.

| Feature | Description |
|---------|-------------|
| `--server` | Connect via Streamable HTTP |
| `--stdio --command` | Spawn a stdio server |
| `--watch` | Hot-reload HTML resources on change |
| `--debug` | Sidebar with live JSON-RPC message log |
| `--open` | Auto-open browser |
| `--port` | Custom port (default 3691) |

### mcp-app-scaffolder

A `create-mcp-app` style project generator with template variants.

```bash
mcp-app-scaffolder my-app --template python --demo
mcp-app-scaffolder my-app --template node --simple
```

| Flag | Effect |
|------|--------|
| `--template python\|node` | Language (Python default) |
| `--simple` | Single-file server + inline HTML, no Vite |
| `--demo` | Add working counter tool with increment/decrement |

### Examples Demo Server

```bash
python -m examples serve
```

Starts a Streamable HTTP MCP server on port 8002 with three interactive apps:

1. **Mermaid Diagram Viewer** — editable split-view with live diagram rendering
2. **System Monitor** — real-time CPU/memory/disk dashboard with polling
3. **Interactive Data Table** — sortable/filterable SQLite data with Export CSV

## Architecture

```
Browser (:3691) ←→ mcp-app-playground ←→ MCP Server (stdio/HTTP)
                       ↑ postMessage bridge
                   Sandboxed iframe
                   HTML/CSS/JS UI
```

The playground implements the full MCP Apps Host protocol: tool discovery via `_meta.ui.resourceUri`, resource fetch via `resources/read`, sandboxed iframe rendering, and a postMessage bridge supporting `callServerTool`, `sendMessage`, and `updateModelContext`.

## Links

- **GitHub:** [github.com/vikasudasi/mcp-app-suite](https://github.com/vikasudasi/mcp-app-suite)
- **Install:** `pip install mcp-app-suite[all]`
