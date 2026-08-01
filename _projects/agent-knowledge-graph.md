---
layout: page
title: agent-knowledge-graph
description: "CLI + Python library for persistent graph-based memory for AI agents. Ingests sessions into Neo4j, extracts entities via LLM, embeds locally with sentence-transformers, and supports semantic/traversal/NL→Cypher queries via 4 agent adapters."
img: /assets/img/projects/agent-knowledge-graph.png
redirect: https://github.com/vikasudasi/agent-knowledge-graph
importance: 4
category: work
related_publications: false
---

## agent-knowledge-graph

**Local-first, graph-native memory for AI agents — running entirely on your machine.**

[![CI](https://img.shields.io/github/actions/workflow/status/vikasudasi/agent-knowledge-graph/test.yml?branch=main&label=CI)](https://github.com/vikasudasi/agent-knowledge-graph/actions)
[![Coverage](https://img.shields.io/badge/coverage-86%25-brightgreen)](https://github.com/vikasudasi/agent-knowledge-graph/actions)
[![Python](https://img.shields.io/badge/python-3.11%2B-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Your AI agent's sessions — the conversations, tool calls, decisions, and outcomes — are trapped in flat transcript logs. You can scroll back manually, but you can't ask "What did we decide about Redis deployment?" and get a structured answer.

`agent-knowledge-graph` solves this by ingesting sessions into a Neo4j property graph, extracting structured knowledge (entities, relations, decisions, tools) via LLM, augmenting nodes with local vector embeddings, and exposing natural-language query flows.

### Quick Start

```bash
git clone https://github.com/vikasudasi/agent-knowledge-graph.git
cd agent-knowledge-graph
uv sync
docker compose up -d
uv run kg init
uv run kg build run all
uv run kg query ask "What do I know?"
```

### Architecture

The four-phase pipeline framework makes it easy to add new data sources:

1. **Extract** — Read raw records from a source (Hermes session DB, files, APIs)
2. **Resolve** — Enrich records via LLM into typed `Resource` nodes
3. **Embed** — Generate 384-dimension vectors locally using `all-MiniLM-L6-v2`
4. **Write** — Upsert nodes + relationships to Neo4j with checkpoint tracking

### Features

- **Typed graph storage** — 8 node types (session, person, project, tool, concept, file, task, artifact) with 8 relationship types
- **Local embeddings** — `sentence-transformers` on-device, zero API costs, LRU-cached
- **4 query modes** — Semantic, traversal, hybrid, and NL→Cypher (LLM-generated Cypher)
- **Modern Neo4j SEARCH clause** — Native in-index vector filtering (Neo4j 2026.x)
- **4 agent adapters** — Hermes plugin (4 MCP tools), MCP server, LangChain tools, CLI
- **Incremental pipelines** — Checkpoint-based idempotent runs
- **147 tests, 86% coverage**

### Links

- [GitHub Repository](https://github.com/vikasudasi/agent-knowledge-graph)
- [Blog Post](/blog/2026/agent-knowledge-graph/)