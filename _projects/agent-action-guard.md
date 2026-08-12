---
layout: page
title: agent-action-guard
description: Local, auditable action-safety guard that screens AI agent tool calls and returns structured allow/block/warn verdicts with a reason and confidence score before auto-execution.
img: /assets/img/projects/agent-action-guard.png
importance: 4
category: work
related_publications: false
---

## agent-action-guard

**Local, auditable action-safety guard that screens AI agent tool calls and returns structured `allow` / `block` / `warn` verdicts with a reason and confidence score before auto-execution.**

[![CI](https://github.com/vikasudasi/agent-action-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/vikasudasi/agent-action-guard/actions/workflows/ci.yml)
![Python](https://img.shields.io/badge/python-3.11%2B-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## The Problem

AI coding agents increasingly run with auto-execution enabled: shell commands, file writes, network calls, git operations, and MCP tools can fire without a human in the loop. A mistaken or adversarial prompt can trigger credential exfiltration, destructive filesystem operations, or force-pushed git history in seconds.

`agent-action-guard` sits in the path between "agent decided to act" and "action executes." It inspects a proposed action, applies **19 deterministic rules** plus an **offline heuristic classifier**, and returns a verdict with a reason and confidence score. The design mirrors the trust layer behind Anthropic's Claude Code auto-mode classifier.

## Quickstart

```bash
pip install -e ".[dev]"
agent-action-guard version
# 0.1.0
```

```bash
agent-action-guard check --action '{"type":"shell","command":"echo hi"}'
# verdict: allow · reason: no rules matched · confidence: 0.95

agent-action-guard check --action '{"type":"shell","command":"rm -rf /tmp/build"}'
# verdict: block · rule: shell-rm-rf · confidence: 0.95
```
