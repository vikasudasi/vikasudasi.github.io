---
tags: mcp ai-agents skills semantic-search
layout: post
title: "skill-vault: One MCP Endpoint for Every Skill Your Agent Will Ever Need"
date: 2026-08-05 20:00:00 +0530
description: Every skill in an agent's context costs ~50 tokens of pure metadata. At 10,000 skills that blows past most context windows. I built a self-hostable semantic skill registry over a single MCP endpoint — search, retrieve, and verify on demand.
image:
  path: /assets/img/projects/skill-vault.png
  alt: "An open vault releasing a stream of skill cards to an agent — skill-vault thumbnail"
categories: project
---

{% include figure.liquid path="/assets/img/projects/skill-vault.png" class="img-fluid rounded z-depth-1" %}

Here's the number that nags me: **every skill you ship into an agent's context costs ~50 tokens of pure metadata** — just to keep the *description* resident so the agent knows it exists. That's tolerable at 100 skills (~5k tokens). It's annoying at 1,000 (~50k). At 10,000 it's **500k+ tokens — which blows past most context windows entirely.**

We've been shipping skills as files. Local files don't sync across machines, teams, or agents. They go stale, they get duplicated, they're unversioned, and — most worrying — **you have no idea who wrote them or whether they're safe to follow.**

So I built [skill-vault](https://github.com/vikasudasi/skill-vault): a self-hostable, semantic skill registry that an agent talks to over **one MCP endpoint**.

## The Idea: Registry + Retrieval, Not Another File Format

The mistake most skill systems make is treating skills as *files to inline*. Skill Vault treats them as *records to query*:

- Skills live in a centralized, versioned, content-addressed store.
- The agent wires in **exactly one MCP endpoint**.
- `search_skills("postgres schema migration")` returns light **cards** — name + one-liner + trust tier + cosine score. Cheap.
- `get_skill(id)` returns the **full SKILL.md body** only for the skill the agent actually wants.
- A **personal vault** lets each agent push its own hard-won capabilities and pull them back anywhere, alongside a curated global library.

The payoff in numbers: an agent with access to **10,000 skills** carries only **~50 tokens** of registry description in context, and retrieves the one it needs *at the moment it needs it*.

## Semantic Search That Doesn't Bloat the Index

Under the hood it embeds skill **metadata**, not full bodies — name, description, tags, and triggers — with local `all-MiniLM-L6-v2` embeddings (384-dimensional), ranked by cosine similarity.

```
search_skills("postgres schema migration")
  → [card] sql-migrations   (score 0.87, tier public)
  → [card] db-schema-sync   (score 0.81, tier user)
  → [card] postgres-optimize (score 0.74, tier verified)
```

Embedding the *metadata* instead of the whole instructions keeps the index small while the retrieval stays sharp — the ranked cards are enough to decide, and the full body only loads when the agent commits.

## Trust: The Part I Refused to Skip

A skill registry that pulls arbitrary instructions from anywhere is a **prompt-injection vector waiting to happen**. So the supply chain is first-class:

- **sha256 content hashing** — every skill is content-addressed and integrity-pinned; clients can verify bytes haven't drifted.
- **Optional ed25519 signatures** — a skill can be signed, proving *who* vouched for it.
- **Three trust tiers** — `verified` (curator-signed), `user` (owner's own), `public` (community).

The point isn't to lock everything down — it's that `verified` means a curator vouched for the content, **not just that someone uploaded it**. That distinction makes the difference between a registry and a liability.

## Per-Agent Identity and Private Vaults

Every agent gets its own API key (stored as sha256 at rest, shown once at onboarding) with `global` / `personal` / owner-only scope enforcement **at the tool layer**. So the same deployment serves different agents and teams, and cross-agent private access is always denied — your agent's hard-won skills are yours.

## Self-Hosted, Transport-Flexible

No managed service, no third party sees your skills, no per-query cost. SQLite + sqlite-vec for local deployments, pgvector as a drop-in for scale-out. stdio for local agents, streamable-HTTP/SSE for remote ones. Docker images for both the MCP server (`:8000`) and web dashboard (`:8080`).

The web dashboard covers agent management, onboarding, per-agent skill browser, key rotation/revocation, and a ready-to-copy `/configure` guide for pointing your agent at the endpoint.

## Shipped, Tested, Verified

- **17 curated seed skills** (including one `verified` sample) so the registry is useful out of the box.
- **111 tests at 88% coverage**, green GitHub Actions CI on the released commit.
- Apache-2.0, fully self-hostable.

Point your agent at one endpoint, let it pull skills when it needs them, and know what you're pulling is intact and credited.

```
pip install skill-vault
skill-vault serve
```

[GitHub → github.com/vikasudasi/skill-vault](https://github.com/vikasudasi/skill-vault) · [Release v0.1.0](https://github.com/vikasudasi/skill-vault/releases/tag/v0.1.0)
