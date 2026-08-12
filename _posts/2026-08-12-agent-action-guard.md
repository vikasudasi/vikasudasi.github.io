---
tags: ai-safety agent-actions mcp cli security
layout: post
title: "agent-action-guard: Let Your Agent Act Fast — But Not Without a Guard"
date: 2026-08-12 20:00:00 +0530
description: Coding agents increasingly auto-execute shell commands, file writes, and network calls with no human in the loop. I built a local, auditable guard that screens every proposed action and returns allow/block/warn verdicts before it runs — the trust layer behind Claude Code-style auto mode, shipped as a CLI.
image:
  path: /assets/img/projects/agent-action-guard.png
  alt: "A shield guarding an agent's hand with a green check and red stop — agent-action-guard thumbnail"
categories: project
---

{% include figure.liquid path="/assets/img/projects/agent-action-guard.png" class="img-fluid rounded z-depth-1" %}

Here's the trade-off nobody gets to freeze in amber: the moment you let an AI coding agent **act** — not just suggest — you hand it the keys. Shell commands, file writes, network calls, git operations, MCP tools. One bad prompt, one adversarial file, one over-eager `rm -rf`, and the damage is done in seconds, before any human even sees it.

The industry's answer is turning toward **auto mode**: agents that execute on their own, with a safety layer deciding what's safe. Anthropic's Claude Code classifier, for example, blocks a large share of dangerous queries versus letting a human review every step — and that "auto mode on by default" story just broke. So I built the same trust layer for my own agents, as a local, auditable CLI.

## A Guard Between "Decided" and "Executed"

[agent-action-guard](https://github.com/vikasudasi/agent-action-guard) sits in the path between "agent decided to act" and "action executes." It takes a proposed action — described as a typed JSON object — inspects it, and returns a structured verdict: **`allow`**, **`block`**, or **`warn`**, with a reason and a confidence score.

```bash
agent-action-guard check --action '{"type":"shell","command":"echo hi"}'
# verdict: allow · reason: no rules matched · confidence: 0.95

agent-action-guard check --action '{"type":"shell","command":"rm -rf /tmp/build"}'
# verdict: block · rule: shell-rm-rf · confidence: 0.95
```

Two layers do the deciding, and they're both fully local and offline:

- **19 deterministic rules** across shell, file, network, git, database, and MCP categories — the non-negotiables. `rm -rf /`, credential exfiltration, force-pushing git history, writing into a config you shouldn't touch. Each fires with a specific remediation string. And the rules are **path-aware**, so a benign `rm -rf /tmp/build` in a build dir passes while `rm -rf /` doesn't.
- **An offline heuristic classifier** that scores dangerousness 0.0–1.0 and merges with the rule engine into a final confidence. Turn it off with `--no-classifier` when you want rules-only determinism.

**Auditability is the point.** Every decision is appended to a JSONL audit log — timestamp, action hash, verdict, reason, confidence, rule ID, the full action snapshot. You can replay exactly what your agent wanted to do and why the guard said yes or no. No black box.

## It Ships Like a Real Service, Not Just a Function

I didn't stop at the CLI. `agent-action-guard` runs as a live service too:

- **`serve`** — a FastAPI endpoint (with server-sent events) that your agent can call over HTTP, plus a `/check` route for interactive use.
- **`audit`** — render the JSONL log as a readable markdown report.
- **`bench`** — a full evaluation harness with a labeled dataset, reporting precision, recall, and block-rate across all 19 rule categories.

That last one matters because it answers the honest question: *does this actually catch things?* On an 87-sample labeled dataset, the guard hit **100% dangerous-action block rate and 0% benign false positives** — every truly dangerous action was caught, and no safe action was wrongly stopped.

## What It Took

The full build runs 71 tests, is CI-backed (ruff, mypy, pytest), and ships as a clean, documentable tool — README, CHANGELOG, GitHub Actions. All local, no API calls, no telemetry.

Your agent gets to move fast. But it never runs without a guard on the door.

Check it out on [GitHub](https://github.com/vikasudasi/agent-action-guard).
