---
layout: page
title: AI Coding Boilerplate
description: Agent-friendly project structure for humans and AI coding agents
img: /assets/img/projects/ai_coding.png
importance: 4
category: work
github: vikasudasi/ai_coding
---

An open-source, AI-agent-friendly project boilerplate that bakes in deterministic practices so both humans and autonomous agents can work in a sane, repeatable way. The goal isn't to lock agents down — it's to give them clear rules, precise context, and hard physical gates.

**Structure:**
- **`.ai/` (The Context Hub):** RULES.md (no secrets, no force push), ARCHITECTURE.md (system map), and MEMORY.md (decision logs). Agents are prompted to read these before touching code
- **`STATE.md` (The Dispatch Board):** Current focus, active blockers, and strict Definition of Done checklist — agents and humans always know what "done" means
- **Ironclad Hooks:** Pre-commit and commit-msg hooks enforce secrets scanning, debug-artifact checks, test runs, Docker build validation, and Conventional Commits
- **Language-Agnostic:** Works identically for Python, Node, Go, etc. Includes Docker sandboxing and a generator script to instantly spin up new agent-ready projects