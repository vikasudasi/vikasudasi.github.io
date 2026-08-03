---
tags: knowledge-graph neo4j llm ai-agents memory vector-search
layout: post
title: "agent-knowledge-graph: Persistent Graph Memory for AI Agents"
date: 2026-08-01 22:00:00 +0530
description: I built a local-first memory system that stores agent sessions in Neo4j, extracts structured knowledge via LLM, and enables semantic recall — all running on your own machine with zero API costs for embeddings.
image:
  path: /assets/img/projects/agent-knowledge-graph.png
  alt: "A conceptual knowledge graph of interconnected nodes — agent-knowledge-graph thumbnail"
categories: project
---

{% include figure.liquid path="/assets/img/projects/agent-knowledge-graph.png" class="img-fluid rounded z-depth-1" %}

Your AI agent has no memory between sessions. Not really.

Transcript logs help with auditing — you can scroll back through "what was said" — but they're flat text. There's no entity-level recall, no relationship-aware retrieval, no way to ask "what decisions did we make about Redis last week?" and get a structured answer.

Most agent memory systems solve this by shipping your data to a cloud vector database. That works, but it means your conversations, tool outputs, and internal decisions live on someone else's infrastructure.

I wanted something different: **local-first, graph-native, queryable by natural language — and running entirely on my own machine.**

Here's what I built.

## What It Is

[agent-knowledge-graph](https://github.com/vikasudasi/agent-knowledge-graph) is a CLI + Python library that ingests AI agent sessions into a Neo4j-backed property graph, augments nodes with local embeddings for semantic recall, and exposes natural-language query flows.

```
Session → LLM extraction → typed nodes + relationships + vector embeddings → Neo4j
```

It's designed as a four-phase pipeline: extract raw data from a source, resolve it into typed entities via LLM, embed each entity as a vector locally, then write everything to Neo4j. The same architecture supports any data source — not just chat sessions.

### What Goes Into the Graph

Every session is parsed by an LLM that extracts structured knowledge following a strict schema:

| Node Type | What It Stores |
|-----------|---------------|
| **session** | Title, summary, topics, decisions made, tools used, outcome |
| **person** | People discussed or mentioned |
| **project** | Projects, repos, initiatives |
| **tool** | CLI commands, libraries, services |
| **concept** | Ideas, architectures, terms |
| **file** | Specific files referenced |
| **task** | Action items or tickets |
| **artifact** | Outputs, builds, documents |

Relationships connect sessions to entities via typed edges: `mentions`, `produces`, `uses`, `decides`, `references`, `blocks`, `resolves`, `assigns`.

## The Architecture

The core has four layers:

**Pipeline Framework** (`pipelines/`) — Each data source is a `KnowledgePipeline` subclass with three phases: `extract()` yields raw records, `resolve()` converts them into `Resource` nodes with LLM enrichment, and `get_relationships()` generates typed edges. The base class handles checkpointing, embedding, and writing automatically.

**Query Engine** (`core/query.py`) — Four query modes: semantic (embed + vector search), traversal (hop-based neighborhood exploration), hybrid (vector + Cypher filter), and NL→Cypher (LLM translates a question to Cypher and executes it).

**Graph Client** (`core/graph.py`) — Wraps Neo4j connection pooling, manages schema constraints and the vector index, and exposes upsert operations for batch writes.

**Agent Adapters** (`adapters/`) — The graph is accessible through a Hermes plugin (4 MCP tools: `kg_query`, `kg_semantic_search`, `kg_traverse`, `kg_stats`), an MCP server for generic MCP clients, or LangChain tools. The system is agent-agnostic — the core doesn't know what agent system is talking to it.

## Why Local Embeddings

The default embedding provider uses `sentence-transformers/all-MiniLM-L6-v2` — a 384-dimension model that runs entirely on your machine. No API calls, no vector database credits, no data leaving your network. On my workstation with a modest setup, it takes about 8 seconds for the first query (model loading) and sub-second after that (LRU-cached).

This is important because embeddings are the most frequently called operation in a memory system — every ingested node gets one, and every query needs one. Paying per-embedding for a system that runs daily adds up fast.

## What You Can Ask

The NL→Cypher query engine lets you ask natural questions:

```
kg query ask "What decisions mention Neo4j?"
kg query semantic "retry policy and reliability"
kg query traverse entity:redis --hops 2
```

The LLM generates Cypher from your question, executes it against Neo4j, and returns structured results. The schema is injected into the prompt so the LLM knows what labels and properties are available.

## Vector Search with Neo4j 2026 SEARCH Clause

Running on Neo4j 2026.06, the vector search uses the new native `SEARCH` Cypher clause — replacing the deprecated `db.index.vector.queryNodes` procedure:

```cypher
MATCH (n:Resource)
SEARCH n IN ( VECTOR INDEX resource_embedding FOR $query_embedding LIMIT 10 )
SCORE AS score
WHERE n.type = $type_filter
RETURN n, score ORDER BY score DESC
```

This is faster (native in-index filtering instead of post-filter) and doesn't trigger deprecation warnings.

## What's Next

The system is up and running — a daily cron ingests new sessions, and I query it via Hermes MCP tools. Things I'm planning next:

- **File/repo ingestion pipeline** — Index codebases as nodes linked to the sessions that touched them
- **Cross-session entity resolution** — Merge entities extracted in different sessions into canonical nodes
- **GitHub issue/PR pipeline** — Sync open issues as `:task` nodes with status tracking
- **Graph visualization** — Web UI to explore the Neo4j graph interactively

## Try It

```bash
git clone https://github.com/vikasudasi/agent-knowledge-graph.git
cd agent-knowledge-graph
uv sync
docker compose up -d      # starts Neo4j
uv run kg init            # creates schema + vector index
uv run kg build run all   # run all pipelines
uv run kg query ask "What do I know?"
```

The only hard dependency is Neo4j (Docker compose provided). Everything else — embeddings, LLM integration, CLI — runs locally. The codebase has 147 tests at 86% coverage.

[github.com/vikasudasi/agent-knowledge-graph](https://github.com/vikasudasi/agent-knowledge-graph)