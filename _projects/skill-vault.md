---
layout: page
title: skill-vault
description: Self-hostable, semantic skill registry for AI agents over a single MCP endpoint. Search skills by task, retrieve what you need on demand, and verify what you trust via sha256 + ed25519 signing.
img: /assets/img/projects/skill-vault.png
importance: 4
category: work
related_publications: false
---

## skill-vault

**A self-hostable, semantic skill registry for AI agents — over a single MCP endpoint. Query the skills you need when you need them. Keep context small. Trust what you pull.**

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Python](https://img.shields.io/badge/python-3.11+-3776AB.svg)](https://www.python.org/)
[![MCP](https://img.shields.io/badge/MCP-FastMCP-8A2BE2.svg)](https://modelcontextprotocol.io)
[![Tests](https://img.shields.io/badge/tests-111%20passing-brightgreen.svg)](https://pytest.org/)
[![Coverage](https://img.shields.io/badge/coverage-88%25-brightgreen.svg)](https://pytest.org/)
[![CI](https://img.shields.io/github/actions/workflow/status/vikasudasi/skill-vault/ci.yml?branch=main)](https://github.com/vikasudasi/skill-vault/actions)

Every skill costs context. A progressive-disclosure skill system pays ~50 tokens per skill just to keep the description in context — 10,000 skills blows past most context windows. Skill Vault stops shipping a thousand skill files into the agent: point the agent at **one** MCP endpoint and it pulls exactly the skills it needs, on demand, and can verify they haven't been tampered with.

### Quick Start

```bash
pip install skill-vault
skill-vault serve            # stdio MCP endpoint
skill-vault web              # dashboard + homepage on :8080
skill-vault seed             # load 17 curated seed skills
```

### Features

- 🧭 **Semantic search** — local `all-MiniLM-L6-v2` embeddings (384-d), ranked by cosine similarity. Embed metadata, not whole bodies, to keep the index small.
- 🔑 **Per-agent identity** — API keys (sha256-at-rest) with `global` / `personal` / owner-only scope enforcement at the tool layer.
- 📦 **Private skill vaults** — every agent publishes and retrieves its own skills; cross-agent private access always denied.
- 🔏 **Trust & supply chain** — sha256 content hashing + optional ed25519 signatures. Trust tiers: `verified` · `user` · `public`.
- 🧬 **Versioned & immutable** — content-addressed, forward-only; previous versions stay addressable and hash-pinned.
- 🖥️ **Web dashboard + homepage** — agent management, onboarding, per-agent skill browser, key rotation, ready-to-copy `/configure` guide.
- 🚀 **Self-hosted & transport-flexible** — stdio for local agents, streamable-HTTP/SSE for remote; SQLite + sqlite-vec by default, pgvector drop-in.

### MCP Tools

| Tool | Purpose |
|------|---------|
| `search_skills` | Semantic search → lightweight skill cards (name + one-liner + trust tier + score) |
| `get_skill` | Fetch the full SKILL.md body for one skill |
| `publish_skill` / `update_skill` / `delete_skill` | Manage your personal vault |
| `list_my_skills` | List your own skills |
| `list_global_skills` | List the curated global registry |

### Links

- [GitHub Repository](https://github.com/vikasudasi/skill-vault)
- [Release v0.1.0](https://github.com/vikasudasi/skill-vault/releases/tag/v0.1.0)
- [Blog Post](/blog/2026/skill-vault/)
