---
layout: page
title: slop-detect
description: "Privacy-preserving CLI tool that detects AI-written text using 5 local heuristics — fully offline, no API calls"
importance: 1
category: work
github: vikasudasi/slop-detect
img: /assets/img/projects/slop-detect.png
---

`slop-detect` is a privacy-preserving CLI that estimates whether text is AI-written
using local heuristics only. No API calls are made and no text leaves your machine.

## Install

```bash
pip install -e .
```

## Usage

```bash
slop-detect sample.txt
slop-detect --text "Some text to analyze"
echo "input text" | slop-detect --stdin
slop-detect --json sample.txt
```