---
layout: page
title: console-web-search
description: Web search from your terminal — no browser needed
img: assets/img/projects/console-web-search.jpg
importance: 8
category: work
github: vikasudasi/console_web_search
---

console-web-search is a lightweight terminal tool that brings web search directly into command-line workflows, minimizing context switching during debugging and research.

**Tech Stack:**
- **Python CLI:** Script-driven workflow with command-line flags and stdin support for pipeline-friendly usage
- **ReAct Reasoning Layer:** DSPy ReAct agent loop for iterative search-and-synthesize behavior
- **Search Backend:** Google Custom Search API for web retrieval
- **LLM Options:** LangChain-based model routing with local Ollama (default) or OpenAI

**Key Features:**
- **Flexible Config:** Supports config file, environment variables, and CLI overrides with clear precedence
- **Practical Output:** Returns synthesized answers grounded in fetched results for quick terminal consumption