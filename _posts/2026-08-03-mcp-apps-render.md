---
layout: post
title: "mcp-apps-render — Your MCP Apps UI, Right in the Terminal"
date: 2026-08-03 22:00:00 +0530
description: "A CLI that renders MCP Apps interactive UI payloads (dashboards, forms, visualizations) as terminal-safe ASCII — proving you don't need an iframe, a browser, or a GUI to actually see what your MCP tools return."
tags: mcp ai-tools cli open-source infrastructure terminal
categories: project
---

{% include figure.liquid path="/assets/img/projects/mcp-apps-render.png" class="img-fluid rounded z-depth-1" %}

A week ago I shipped `mcp-app-suite`, the browser-side toolchain for **MCP Apps** — the spec that finally lets MCP servers return interactive UI (charts, dashboards, forms) instead of plain text. The whole ecosystem assumes you'll render those payloads inside an AI client's embedded iframe.

But here's the thing I kept running into: **what do you do on a headless server, in CI, or over SSH?** Every payload was pure JSON sitting in a text blob nobody could see. So I built the other half of the story — `mcp-apps-render`, which renders that same payload format straight into your terminal.

## Why This Matters

MCP Apps dropped my return-to-text floor. A tool call can now hand back a chart, a status dashboard, a deploy summary. The catch: that UI is a JSON tree of components, and without a client that renders it, it's just bytes.

`mcp-apps-render` treats the **terminal as a first-class render target**. Not a fallback — a real one.

```bash
# Inspect a payload's schema
mcp-apps-render inspect payload.json

# Render it locally
mcp-apps-render render payload.json

# Connect to a live MCP server and render a real tool result
mcp-apps-render serve http://localhost:8003/mcp --tool get_app
```

Here's a real render from the sample payload's system monitor — nested panels, stats, an ASCII progress bar, and a bar chart, all from a JSON tree:

```
╭────────────────────────────── system-monitor (v1.0) ───────────────────────────╮
│ ╭─────────────────────────────── CPU ────────────────────────────────╮          │
│ │ 42                                                                 │          │
│ ╰────────────────────────────────────────────────────────────────────╯          │
│ ╭────────────────────────────── Load ────────────────────────────────╮          │
│ │ [==============------] 72%                                         │          │
│ ╰────────────────────────────────────────────────────────────────────╯          │
│ r1[========------------] 120   r2[====================] 300                    │
```
*(abridged — the real output renders the full nested tree)*

## What Makes It Terminal-Safe

The tricky part isn't drawing boxes — it's doing so without corrupting your session. Three things hold up in practice:

- **Every component maps to one of four render kinds** — layout (panels), form (fields), data (tables/charts/stats), or unknown. Unknown types aren't rejected; they degrade to a silent placeholder.
- **Terminal-safe escaping** — no stray control bytes, no broken wrapping, degrades cleanly when not a TTY.
- **The schema parser is tolerant** — unknown component types and extra fields are preserved (`extra="allow"`), so the tool won't break the day the MCP Apps spec adds a new component.

A system monitor, a `serve` against a live server, a config dashboard — it handles the whole family.

## The Numbers

| Metric | Value |
|--------|-------|
| Render kinds | 4 (layout / form / data / unknown) |
| Unit tests | 53 |
| Test coverage | 85% |
| Python | 3.11+ |
| CI | ruff + mypy (strict) + pytest on 3.11/3.12 |
| Payload sources | File, inline JSON, or live MCP tool result |

## Playing Nicely With the Suite

`mcp-app-suite` is the **authoring** end — playground, scaffolder, demo server. `mcp-apps-render` is the **consumption** end — same payload format, opposite pipeline. Together they cover the cycle: build an app, preview it in a browser, then consume its payloads headlessly. It's the same MCP Apps story, told from the terminal side.

## Links

- **GitHub:** [github.com/vikasudasi/mcp-apps-render](https://github.com/vikasudasi/mcp-apps-render)
- **Install:** `pip install mcp-apps-render[client]`
- **Companion:** [mcp-app-suite](https://github.com/vikasudasi/mcp-app-suite)
