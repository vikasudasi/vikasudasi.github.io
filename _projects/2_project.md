---
layout: page
title: AI Task Management System
description: Multi-agent coordination framework for deep agents
img: assets/img/projects/my-agent-project.jpg
importance: 2
category: work
github: vikasudasi/my-agent-project
---

An open-source framework designed for deep agent coordination that bridges the gap between chaotic autonomous exploration and reliable, deterministic output. Instead of overwhelming an agent with an entire project scope, this system forces agents to explicitly define, constrain, and document their own tasks within a shared, rigid state.

**Architecture:**
- **Three Access Modes, One Source of Truth:** Zero-dependency CLI, Web Dashboard for human oversight, and MCP Server for IDE agents (Cursor/Claude) — all synced to a central SQLite database
- **Multi-Agent Collaboration:** Multiple users and agents can work asynchronously on the same project without stepping on each other's toes
- **Granular Tracking:** Fractional positional ordering for subtasks, 6 explicit task statuses, and dedicated Markdown docs for specs and progress
- **Full Auditability:** Scoped API keys for onboarding agents, append-only timestamped comments, and audit log tracking agent identity and every field diff