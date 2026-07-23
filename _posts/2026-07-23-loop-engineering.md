---
layout: post
title: "Loop Engineering — The Shift from Prompting to Designing Autonomous Agent Systems"
date: 2026-07-23 16:00:00 +0530
description: "The engineering community is moving beyond turn-by-turn prompting. Loop engineering is the practice of designing self-sustaining systems that discover, delegate, verify, and iterate — without you in the driver's seat."
tags: [AI-agents, loop-engineering, agentic-ai, software-engineering]
categories: [AI, engineering]
---

{% include figure.liquid path="/assets/img/projects/loop-engineering.png" class="img-fluid rounded z-depth-1" %}

A shift is quietly sweeping through the AI engineering community, and it's not about a bigger model or a smarter prompt. It's about who — or what — is doing the prompting in the first place.

**Peter Steinberger**, creator of OpenClaw, put it bluntly: *"You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."*

**Boris Cherny**, head of Claude Code at Anthropic, says the same from the inside: *"I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops."*

This is **loop engineering** — the practice of replacing yourself as the human who guides an agent turn-by-turn, with a system that discovers work, delegates tasks to sub-agents, verifies results, persists state, and decides the next action on a schedule or until a goal is met.

## The Evolution of Engineering

Loop engineering didn't appear in a vacuum. It's the fourth stage in a rapid evolution:

| Era | Focus | What You Do |
|-----|-------|-------------|
| **Prompt Engineering** (2023) | Single-shot instruction | Craft the perfect prompt |
| **Context Engineering** (2024) | Information architecture | Feed the right project context |
| **Harness Engineering** (2025) | Execution environment | Build the environment the agent runs in |
| **Loop Engineering** (2026) | Autonomous orchestration | Design the system that runs the agents |

Each stage abstracts away a layer of manual involvement. Prompt engineering required you at every turn. Context engineering reduced repetition. Harness engineering automated the environment. Loop engineering removes you from the loop entirely — you design it once, and the system runs itself.

## What a Loop Looks Like

A loop is a recursive system built from five core primitives, plus a durable spine that holds state across runs.

### 1. Automations — The Heartbeat

Without a schedule, you have a one-off session. With automations, you have discovery and triage on a cadence. An automation runs every morning, reads CI failures, checks open issues, scans recent commits, and writes findings to a shared state file. It's the piece that turns "I should check that" into something that happens whether you open a terminal or not.

Both major coding agent platforms now ship this: scheduled tasks, `/loop` for recurring runs, `/goal` for run-until-done with a separate model checking the stopping condition so the worker doesn't grade its own homework.

### 2. Worktrees — Safe Parallelism

The moment you run more than one agent, files collide. Two agents writing the same file is the same headache as two engineers committing to the same lines without talking first. Git worktrees solve this — isolated working directories sharing the same repo history, so one agent's edits literally cannot touch the other's checkout.

Modern agents support worktree isolation natively, and sub-agents can be launched into fresh checkouts that clean up after themselves.

### 3. Skills — Project Memory That Persists

Every agent session starts cold. Conventions, build commands, review standards, architectural decisions — all of it has to be re-derived unless you externalise it. Skills are how you codify that knowledge once, in a `SKILL.md` file, so every run reads it instead of guessing.

Without skills, every loop run is day one. With them, project knowledge compounds — the agent gets smarter about your conventions with every cycle.

### 4. Plugins & Connectors — Reaching Real Tools

A loop that can only read the filesystem can only suggest. MCP-based connectors let it act: open PRs, update Linear tickets, post to Slack, query a database, trigger a runbook. The loop stops being a commentator and becomes an operator.

MCP has become the common substrate — connectors written for one tool usually port to another. This is the difference between an agent that says "here's the fix" and a loop that opens the PR, links the ticket, and pings the channel once CI is green.

### 5. Sub-Agents — The Maker/Checker Split

The single most impactful structural pattern in loop engineering is separating the writer from the verifier. The model that wrote the code is systematically bad at grading its own work — not a model limitation, a structural one.

A second agent (sometimes a stronger model, always with different instructions) catches what the first talked itself into. In unattended loops, the verifier is what lets you walk away with confidence.

### 6. State — The Durable Spine

None of the above survives a session boundary on its own. The loop must read from and write to something external: a markdown file, a Linear board, a GitHub Project view. Good state answers three questions:

- What are we working on right now?
- What did we try last time, and what happened?
- What is waiting for a human?

This is the same trick every long-running agent system depends on: the model forgets between runs, so memory lives on disk, not in context.

## The Cycle

A loop follows a simple iterative pattern:

```
Goal → Action → Observation → Adjustment → (repeat until done)
```

The recursive goal is re-evaluated every iteration — it includes explicit, verifiable stopping criteria. "Make the tests pass" is vague. "Stop when lint is clean and all tests in `test/auth` pass" is a termination condition a verifier can check.

## What a Production Loop Looks Like

Stitch the pieces together and a single thread becomes a small control system:

1. An **automation** runs daily, calling a triage **skill** that reads CI failures, open issues, and recent commits
2. Findings are written to a **state file** (Linear board or markdown)
3. For each actionable item, a **sub-agent** is spawned in an isolated **worktree** to draft an implementation
4. A second **sub-agent** reviews that draft against project skills and existing tests
5. **Connectors** open the PR and update the ticket
6. Anything the loop can't handle lands in a triage inbox for human review
7. The state file is updated so tomorrow's run picks up where today stopped

You designed that once. You did not prompt any of those steps.

## The Realities Nobody Should Skip

Loop engineering is still early, and three problems get sharper as loops get better:

**Token economics.** A 5-minute loop that spawns an implementer plus verifier on every run burns through tokens fast. Triage should be cheap; sub-agents should spawn only when the state says the work is actionable.

**Verification is still on you.** A loop running unattended is also a loop making mistakes unattended. The verifier sub-agent helps, but "done" is a claim, not a proof. The human is ultimately responsible for what ships.

**Comprehension debt accelerates.** The faster the loop ships code you didn't write, the bigger the gap between what exists and what you understand. Speed can mask ignorance — reading what the loop produced is non-negotiable.

**Cognitive surrender is the comfortable trap.** Two people can build the exact same loop and get opposite results. One uses it to move faster on work they understand deeply. The other uses it to stop thinking. The loop doesn't know the difference. You do.

## The Leverage Has Moved

Good prompt engineering is still valuable. Direct interaction with an agent is still the right tool for many tasks.

But the leverage point has shifted. The engineers getting the most out of AI coding tools aren't writing better prompts — they're designing systems that prompt the agents for them. The work isn't *what do I tell the agent?* but *how do I design the system that tells the agent what to do?*

As Cherny put it: his job isn't easier. The leverage point just moved. Build the loop. But build it like someone who intends to stay the engineer — not just the person who presses go.

---

*Further reading: [Addy Osmani on Loop Engineering](https://addyosmani.com/blog/loop-engineering/) · [IBM on Loop Engineering](https://www.ibm.com/think/topics/loop-engineering) · [CodeRabbit Guide](https://www.coderabbit.ai/blog/loop-engineering) · [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)*
