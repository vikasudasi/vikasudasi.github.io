---
layout: page
title: model-cards
description: "CLI reference tool for the open-weight AI model explosion — search, view, and compare model cards from Hugging Face in your terminal"
importance: 1
category: work
github: vikasudasi/model-cards
img: /assets/img/projects/model-cards.png
---

# model-cards

**CLI reference tool for open-weight AI models.** Search, inspect, and compare Hugging Face model cards — all from your terminal.

## Why?

The open-weight AI model landscape is exploding. Every week brings a new release — Qwen, DeepSeek, Llama, Mistral, Phi, Gemma, and more. Keeping track of their specs (parameters, context window, license, architecture, hardware requirements) across scattered Hugging Face pages is tedious.

`model-cards` brings the Hugging Face model registry to your terminal. One command to search, one to inspect details, one to compare models side-by-side.

## Installation

```bash
pip install model-cards
```

Or from source:

```bash
git clone https://github.com/vikasudasi/model-cards.git
cd model-cards
pip install -e .
```

## Usage

### Search

```bash
model-cards search qwen
model-cards search llama --limit 20
```

Outputs a rich table with: Model ID, Task, Downloads, Likes, License, Last Updated.

### View details

```bash
model-cards show Qwen/Qwen2.5-7B-Instruct
```

Renders a detailed panel with Overview, Hardware, Specs, Benchmarks, Card Metadata, and Stats sections.

### Compare (up to 4 models)

```bash
model-cards compare qwen3-coder kimi-k2.6 deepseek-v4
```

Side-by-side table with the best value in each row highlighted.

### List trending

```bash
model-cards list
```

### JSON output

```bash
model-cards search qwen --json | jq '.[].model_id'
```

## Displayed Fields

| Field | Description |
|-------|-------------|
| Model ID | Hugging Face model identifier |
| Task | Pipeline type (text-generation, etc.) |
| Parameters | Model size (e.g., 7.8B, 235B) |
| Context Window | Max sequence length (e.g., 128K) |
| License | MIT, Apache 2.0, etc. |
| Architecture | Model architecture type |
| Hardware | VRAM estimate + rating (Easy/Moderate/Heavy/Very Heavy) |
| Downloads | Total download count |
| Likes | HF likes count |

## Environment

- `HF_TOKEN` — optional Hugging Face token for higher API rate limits

## Tech Stack

- **httpx** — async HTTP client with rate limiting and in-memory caching
- **rich** — terminal tables, panels, and colored output
- **argparse** — CLI entry point

## License

MIT