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

CLI reference tool for open-weight AI models. It fetches model card data from the Hugging Face API and presents search, details, and side-by-side comparisons in the terminal.

## Install

```bash
pip install model-cards
```

Or clone and install from source:

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

### View Details

```bash
model-cards show deepseek-v4
```

### Compare

```bash
model-cards compare qwen3-coder kimi-k2.6 deepseek-v4
```

### List Trending

```bash
model-cards list
```

### JSON Output

All commands support `--json` for pipeline-friendly consumption:

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
| License | Model license (MIT, Apache 2.0, etc.) |
| Architecture | Model architecture type |
| Hardware | Estimated RAM requirements (Easy/Moderate/Heavy/Very Heavy) |
| Downloads | Total download count |
| Likes | HF likes count |

## Environment

- `HF_TOKEN` — optional Hugging Face token for higher API rate limits

## License

MIT