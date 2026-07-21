---
layout: page
title: prompt-riser
description: "CLI that runs prompts through multiple reasoning strategies and visualizes the reasoning paths as a tree"
img: /assets/img/projects/prompt-riser.png
importance: 1
category: work
github: vikasudasi/prompt-riser
---

`prompt-riser` is a reasoning debugger CLI. It runs one prompt through multiple reasoning strategies, parses each reasoning trace, and renders the results as a terminal tree, JSON, or Mermaid flowchart.

## Install

```bash
pip install -e .
```

## Usage

```bash
prompt-riser run "What's the best way to deploy on a budget?"
prompt-riser run "Explain quantum computing" --strategies cot,self-correct
prompt-riser run "Design a REST API" --model anthropic/claude-sonnet-4 --base-url https://api.openrouter.ai/v1
prompt-riser run "Solve this equation" --output json
prompt-riser run "Debug this code" --verbose
```

## Commands

- `prompt-riser run <prompt>`: execute strategies and render results
- `prompt-riser list-strategies`: list available strategy names and descriptions
- `prompt-riser config`: print effective configuration
- `prompt-riser config init`: create default config at `~/.config/prompt-riser/config.yaml`

## Strategies

| Strategy | Description |
|----------|-------------|
| **cot** | Chain-of-Thought: numbered, step-by-step reasoning |
| **self-correct** | Self-correction loop: generate, critique, improve |
| **step-back** | Step-back: derive broader principle, then answer specifics |
| **constraint** | Constraint-based reasoning with explicit constraints |
| **tree-of-thoughts** | Explore branches, evaluate, select best |

## Output Formats

- `tree` (default): Rich terminal tree with colored nodes
- `json`: Structured data for programmatic use
- `mermaid`: Mermaid.js flowchart syntax

## Configuration

Config at `~/.config/prompt-riser/config.yaml`:

```yaml
api_key: ""
base_url: "https://api.openai.com/v1"
model: "gpt-4o"
default_strategies: ["cot", "self-correct", "step-back"]
default_passes: 3
default_branches: 3
```

`OPENAI_API_KEY` is used when `api_key` is missing.