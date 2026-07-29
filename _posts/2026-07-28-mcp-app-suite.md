---
layout: post
title: "mcp-app-suite — The MCP Apps Toolchain That Ships With Today's Spec"
date: 2026-07-28 22:00:00 +0530
description: "Three tools for the MCP Apps ecosystem — a playground to preview interactive HTML UIs, a scaffolder to generate new projects, and a demo server — all shipping on the day of the 2026-07-28 spec."
tags: mcp ai-tools cli open-source infrastructure
categories: project
---

{% include figure.liquid path="/assets/img/projects/mcp-app-suite.png" class="img-fluid rounded z-depth-1" %}

Today, July 28, 2026, the MCP specification released its biggest update yet — introducing **MCP Apps**, which lets MCP servers render interactive HTML UIs inside sandboxed iframes within AI conversations. No more bland text blobs. Your AI can now show you a chart, a dashboard, a form you can fill out.

I built a full toolchain for it, shipping the same day.

## What Changed in the Protocol

Before today, every MCP tool could only return **text**. Now they can return interactive HTML:

- **Stateless transport** — the core protocol dropped handshake/session overhead. Plain round-robin load balancing works.
- **MCP Apps extension** — servers register tools with `_meta.ui.resourceUri`, serve HTML/CSS/JS via `resources/read` at `ui://` URIs, and render in sandboxed iframes.
- **Two-way bridge** — the embedded UI can call back via `callServerTool()` (invoke server functions), `sendMessage()` (act like user input), and `updateModelContext()` (silent state sync).

The SDK is mature (`@modelcontextprotocol/ext-apps`), but the ecosystem tooling for developers — preview, scaffolding, sample apps — was missing. That's what `mcp-app-suite` fills.

## The Suite

### mcp-app-playground

A CLI that acts as an MCP Host. Point it at any MCP server and it:

```bash
# Connect to a Streamable HTTP server
mcp-app-playground --server http://localhost:8002/mcp

# Or spawn a stdio server
mcp-app-playground --stdio --command "python -m my_app"

# Dev mode with hot-reload
mcp-app-playground --server http://localhost:8002/mcp --watch --debug
```

It discovers all tools with HTML UIs, serves a live listing at `http://localhost:3691/`, and renders each app in a sandboxed iframe with the full postMessage bridge. The `--debug` sidebar shows every JSON-RPC message flowing through.

### mcp-app-scaffolder

A `create-mcp-app` style generator:

```bash
# Python project with Vite + demo counter tool
mcp-app-scaffolder my-app --template python --demo

cd my-app && pip install -e .
mcp-app-playground --stdio --command "python -m my_app"
```

It supports `--template python|node`, `--simple` (single-file, no build), and `--demo` (working counter with increment/decrement). Everything embedded in the package — no network calls during scaffolding.

### Examples Demo Server

Run `python -m examples serve` on port 8002 to get a server with three real MCP Apps:

1. **Mermaid Diagram Viewer** — editable textarea + live diagram render, Send to Chat
2. **System Monitor** — dark dashboard with CPU gauge, memory bars, disk chart, polling via `callServerTool`
3. **Interactive Data Table** — sortable/filterable SQLite dataset with Export CSV and Analyze

## Architecture

```
Browser (:3691) ←→ mcp-app-playground ←→ MCP Server (stdio/HTTP)
                       ↑ postMessage bridge
                   Sandboxed iframe
                   HTML/CSS/JS UI
```

The playground is the **Host** — it handles discovery (tools/list, filter by `_meta.ui.resourceUri`), resource fetch (resources/read), initialization (ui/initialize handshake), the entire interactive postMessage bridge, and teardown (ui/resource-teardown). The `--debug` panel streams everything transparently so developers can see exactly what their server is sending.

## What's Next

The MCP Apps spec just landed. The ecosystem of tools with interactive UIs is going to explode. This suite gives builders the tools to develop, test, and ship MCP Apps from day one — no waiting for Claude Desktop or other hosts to add dev tooling.

## Links

- **GitHub:** [github.com/vikasudasi/mcp-app-suite](https://github.com/vikasudasi/mcp-app-suite)
- **Install:** `pip install mcp-app-suite[all]`
- **MCP Spec:** [blog.modelcontextprotocol.io](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate)
