---
layout: post
title: "eu-act-check — EU AI Act Compliance Scanner, With 3 Days Until Article 50 Takes Effect"
date: 2026-07-30 22:00:00 +0530
description: "A CLI that scans files for C2PA provenance manifests, EXIF AI-generation metadata, and synthetic text markers — and tells you exactly what's missing before the August 2 deadline."
tags: eu-ai-act compliance c2pa cli open-source
categories: project
---

{% include figure.liquid path="/assets/img/projects/eu-act-check.png" class="img-fluid rounded z-depth-1" %}

On **August 2, 2026** — three days from today — the EU AI Act's Article 50 transparency requirements take full effect. Any AI-generated or deepfake content distributed in the EU must carry C2PA provenance manifests, metadata declarations, and disclosure statements. Non-compliance can cost up to **3% of global annual turnover** or €15 million.

Most teams I've talked to have no tooling for this. They know *about* the requirements but can't actually *check* their content. So I built one.

## Why This Act Exists

The EU AI Act was first proposed in April 2021, but its transparency provisions were **dramatically expanded after ChatGPT launched in late 2022**. The sudden ability for anyone to generate text, images, audio, and video — indistinguishable from human-created content — at near-zero cost changed the risk landscape overnight.

Article 50 sits at the heart of the Act's response. Its stated objectives:

- **Reduce risks of impersonation, deception, and manipulation** at scale
- **Safeguard democratic processes and public trust** by making synthetic content detectable
- **Give individuals the ability to distinguish** AI-generated content from human-created content

The official guidelines describe this as protecting the "integrity of the information ecosystem" — a direct response to deepfake election interference campaigns, AI-generated misinformation, and the collapse of trust in online content.

## Who It Applies To

Article 50 is the **broadest provision in the entire AI Act**. It does not require "high-risk" classification — it applies automatically to four situations:

| # | Situation | Who Must Act |
|---|---|---|
| 1 | **AI interacting with people** (chatbots, voice assistants, AI agents, social-media bots) | Providers must design systems to disclose AI nature |
| 2 | **AI generating synthetic content** (text, images, audio, video — tools like ChatGPT, Midjourney, ElevenLabs) | Providers must mark outputs in machine-readable format |
| 3 | **Emotion recognition / biometric categorisation** | Deployers must inform exposed individuals |
| 4 | **Deepfakes + AI-generated text on public-interest matters** (news articles, government communications, reports) | Deployers must label content as AI-generated |

**Two groups are caught:**

1. **Providers** — companies that *build* AI systems (OpenAI, Google, Adobe, Meta)
2. **Deployers** — any person, company, organisation, or public authority that *uses* AI systems to generate content and makes it available

The guidelines explicitly state this covers **existing AI systems already on the market** — no grandfather clause. Even open-source AI systems are not exempt.

## Why This Matters for Large Organisations

A company can have **zero** high-risk AI and still be fully on the hook:

- Marketing team uses ChatGPT for ad copy → Article 50(2) applies
- Customer service runs a chatbot → Article 50(1) applies
- Editorial team publishes AI-assisted reports → Article 50(4) applies
- Media team modifies product images with AI → Article 50(4) applies
- Engineering uses AI coding assistants → Article 50(1) applies to the provider, but deployer obligations may also be triggered depending on use

According to the EU AI Act Compliance Checker data, transparency obligations under Article 50 are the **second most common compliance trigger** across all responding organisations — affecting ~33% of them.

### Penalties

Article 50 carries fines up to **€7.5 million or 1.5% of global annual turnover**, whichever is higher. (Separate from the Act's broader prohibited-practices penalties of up to €35M or 7%.)

The August 2 deadline gives no grace period for content already generated. If your org has been producing AI-generated content for months without C2PA manifests or disclosure statements — every piece of that content is out of compliance from day one.

## What It Does

`eu-act-check` scans a directory tree and reports per-file compliance status. Three detection layers:

**C2PA Manifests** — Embedded Content Credentials in JPEGs, PNGs, WebP, audio, and PDFs. Binary-level scanning: JPEG APP1 markers for C2PA UUID bytes, PNG iTXt chunks, WebP RIFF containers.

**EXIF/XMP/IPTC Metadata** — AI tool generation signatures. Pillow-based scanning for Adobe Firefly, Midjourney, DALL-E 3, Stable Diffusion, and other tool-specific metadata markers.

**Text Pattern Detection** — 18 regex patterns across 4 categories: direct disclosure statements, AI-tool declarations, comment watermarks, and standard disclosure formats. Covers .md, .txt, .html, .json, .yaml, .xml, and .csv files.

## The CLI

```bash
# Install (PyPI)
pip install eu-act-check

# Scan a directory — see pass/warn/fail per file
eu-act-check scan ./content/ --recursive

# CI mode — exit 0 (pass) or 1 (warn/fail)
eu-act-check check ./blog-post.md

# Deep dive into one file
eu-act-check inspect ./hero-image.jpg

# Machine-readable output
eu-act-check scan ./assets/ --recursive --format json
```

The table output groups failures first, then warnings, then passes — so you see what needs fixing immediately:

```
                     EU AI Act Compliance Scan Results
┏━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ FILE         ┃ STATUS ┃ DETECTORS  ┃ REMEDIATION                 ┃
┡━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ hero.jpg     │ ❌ fail│ 0✅ 1⚠️ 1❌│ Add a C2PA manifest using   │
│              │        │            │ the C2PA signing tool or... │
│              │        │            │ Add EXIF/IPTC metadata...  │
├──────────────┼────────┼────────────┼─────────────────────────────┤
│ blog.md      │ ⚠️ warn│ 0✅ 1⚠️ 0❌│ Add an AI disclosure        │
│              │        │            │ statement per Article 50(2) │
├──────────────┼────────┼────────────┼─────────────────────────────┤
│ narration.mp3│ ✅ pass│ 2✅ 0⚠️ 0❌│ —                           │
└──────────────┴────────┴────────────┴─────────────────────────────┘
3 files scanned: 1 ✅ pass | 1 ⚠️ warn | 1 ❌ fail
```

The `--remediate` flag appends fix instructions per file. The `--format json` option gives structured output for CI pipelines and monitoring dashboards.

## Where It Fits

This is a **compliance screening** tool — it detects *presence* of provenance data, not cryptographic chain verification. Think of it as `lint` for EU AI Act compliance, not a certification audit. It answers "is this file compliant or not?" in seconds.

## Architecture

```
cli.py → scanner.py → detectors/{c2pa, exif, text_patterns}
                     → compliance.py → reporters/{table, json}
```

The scanner respects `.gitignore` via `pathspec` so you can scan whole repos without noise. Each detector returns a structured `DetectorResult` (pass/warn/fail with details and remediation). The compliance engine aggregates per-file, determining the overall status: if any detector fails, the file fails.

## What's Next

The August 2 deadline is just three days away. I'd rather have a tool I can run today than rely on checking files manually. Every team shipping content to EU users should run a scan before the deadline hits.

## Links

- **GitHub:** [github.com/vikasudasi/eu-act-check](https://github.com/vikasudasi/eu-act-check)
- **Install:** `pip install eu-act-check`
- **EU AI Act Article 50:** [artificialintelligenceact.eu/article/50](https://artificialintelligenceact.eu/article/50/)
- **C2PA Specification:** [c2pa.org/specifications](https://c2pa.org/specifications/)
