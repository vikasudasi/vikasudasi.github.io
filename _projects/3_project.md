---
layout: page
title: Context-Aware RAG
description: 100% local, privacy-preserving RAG that maps territory before searching
img: assets/img/projects/context-aware-rag.jpg
importance: 3
category: work
github: vikasudasi/context-aware-rag
---

Standard RAG systems have a massive blind spot: they search for terms the LLM doesn't actually understand yet. Context-Aware RAG fixes this by mapping the territory before searching the database — all running 100% locally with zero API keys and zero data leaks.

**Key Features:**
- **Local Tech Stack:** Powered by Ollama (llama3.2) and ChromaDB — perfect for enterprise or highly sensitive personal documents
- **Scanned PDF Mastery:** Integrated pymupdf4llm with Tesseract OCR for image-only or scanned PDFs
- **Smart Knowledge Compaction:** Auto-deduplicates and compresses the knowledge.md index once it hits ~256K characters
- **Domain Rules (Expert Mode):** Extracts "rules of the game" from your docs — how you phrase queries, how you reason, how you want answers structured
- **Sibling Context:** Cross-Encoder reranker finds top 5 chunks, then grabs adjacent chunks for continuous context flow instead of scattered data
- **Citations That Actually Work:** Structured JSON answers with exact filename and quote — no hallucinations
- **Bilingual OCR:** Optimized for English + Hindi, especially useful for Indian regulatory documents
- **Streamlit UI:** Clean built-in frontend for document upload, vector chunk inspection, and chat