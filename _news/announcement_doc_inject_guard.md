---
layout: post
date: 2026-08-01 10:00:00 +0530
title: "doc-inject-guard: Scan documents for hidden prompt injection"
inline: true
related_posts: false
---

Just shipped [doc-inject-guard](https://github.com/vikasudasi/doc-inject-guard) — a CLI that scans Word docs, PDFs, markdown, and HTML for embedded prompt injection payloads targeting AI agents. The Context Collapse AI worm proved malicious instructions in DOCX files can alter Copilot's financial data and self-propagate. This tool acts as a document-level security gate with five detection modules, risk scoring, and CI integration. [Read more](/blog/2026/doc-inject-guard/).