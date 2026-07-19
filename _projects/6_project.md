---
layout: page
title: my-agent-voice
description: Voice layer for my-agent — speak to your terminal agent
img: assets/img/projects/my-agent-voice.jpg
importance: 6
category: work
github: vikasudasi/my-agent-voice
---

my-agent-voice is the JARVIS layer for my-agent, adding real-time spoken interaction to a terminal-first agent workflow. It streams audio over LiveKit so you can talk naturally while the agent is planning, coding, or running commands.

**Key Features:**
- **Live Streaming Pipeline:** Low-latency audio transport with interrupt-friendly turn-taking for fluid back-and-forth conversations
- **Model-Agnostic Voice Runtime:** Designed to work with configurable STT/TTS voice providers and swap models without changing core workflow logic
- **Deep my-agent Integration:** Reuses my-agent memory, conversation state, and tool execution loop so voice and text stay in sync
- **Multilingual-Ready:** Supports multilingual interaction paths through the configured speech pipeline, including mixed-language sessions
- **Latency Focus:** Optimized for "speak -> think -> respond" cycles that feel interactive instead of batch-oriented