---
title: 'How the OpenCode Harness Works and How to Code with AI for Free'
slug: 'harness-opencode-ia-sin-costo'
date: 2026-10-02
author: 'Facundo Uferer'
category: 'AI Engineering'
tags:
  - AI
  - OpenCode
  - Developer Tools
  - Open Source
  - Architecture
excerpt: 'An architectural deep dive into OpenCode as an agentic harness: decoupling execution runtime from the model and building zero-cost AI engineering workflows.'
readingTime: 8
lang: 'en'
published: true
featured: false
---
![Default article image](/img/articles/imagenotfound.png)

In modern AI-assisted software development, there is a persistent misconception: the assumption that an assistant’s engineering capability depends almost exclusively on the raw size or parameter count of the underlying Large Language Model (LLM).

Software engineering reality tells a very different story. In isolation, an LLM is merely **a probabilistic next-token generator**. Trapped on a remote server, it cannot inspect your project dependency graph, compile source code, execute regression test suites, or verify whether a modification violated an architectural contract.

To function as a true engineering agent, a model requires a **harness**: the runtime infrastructure, deterministic tooling, permission boundaries, and context management layer that bridges the model’s reasoning abilities with the developer’s operating system and workspace.

**OpenCode** was architected to address this challenge as an open-source, fully model-agnostic agent harness, enabling developers to run advanced agentic workflows without vendor lock-in or recurring subscription fees.

---

## What an Agent Harness Actually Is

In software testing and benchmarking terminology, a test harness is the scaffolding that configures the environment, feeds inputs, and collects outputs. In the context of autonomous coding agents, an agentic harness plays a directly analogous role: **it is the operating system of the agent**.

If the language model represents the brain, the harness represents **the hands, eyes, and nervous system**:

1. **The Execution Loop (Agent Loop):** Manages the conversational and task lifecycle. It formats project context, prompts the model, parses tool calls deterministically, executes those actions in the host environment, and feeds standard output or errors back into the context window.
2. **Deterministic File System & Workspace I/O:** Exposes safe primitives to traverse directories, execute regular expression code searches, inspect specific line slices, and apply atomic file diffs to disk.
3. **Security and Permission Boundaries:** Establishes a configurable sandbox policy (`allow`, `ask`, or `deny`) over sensitive operations, such as executing arbitrary Bash scripts or overwriting configuration files.
4. **Context Window & Persistent Memory Management:** Handles the ingestion of repository guidelines (such as `AGENTS.md` or `CLAUDE.md`), manages persistent multi-session storage, and implements compaction routines to prevent context overflow.
5. **Compiler Feedback via Language Server Protocol (LSP):** Interacts directly with language servers to capture real-time syntax errors and type diagnostics, eliminating the need for manual copy-pasting.
6. **State Tracking and Rollback (Undo/Redo):** Maintains a verifiable history of filesystem mutations, allowing developers to roll back unintended changes cleanly.

Proprietary tools such as Claude Code or IDE-locked commercial assistants tightly bundle this harness with proprietary inference APIs and subscription tiers. OpenCode completely decouples these concerns.

---

## The Internal Architecture of OpenCode

Maintained by **Anomaly**, OpenCode is structured around a modular **client-server architecture**:

```
┌────────────────────────────────────────────────────────┐
│                   Client Surfaces                      │
│     (Go-based Terminal TUI / Desktop App / IDE Plugin) │
└───────────────────────────▲────────────────────────────┘
                            │ HTTP / JSON-RPC
┌───────────────────────────▼────────────────────────────┐
│                 OpenCode Server (Runtime)              │
│         (Orchestration in Bun/TypeScript and Go)       │
├────────────────────────────────────────────────────────┤
│  • Agent Execution Loop                                │
│  • Session & Storage Management (~/.local/share/...)   │
│  • Granular Permissions (allow / ask / deny)           │
│  • Subagent System (General, Explore, Scout)           │
│  • Core Tools (Bash, Files, LSP, MCP)                  │
└───────────────────────────▲────────────────────────────┘
                            │ Model-Agnostic Connectors (75+ providers)
┌───────────────────────────▼────────────────────────────┐
│                    Intelligence Layer                  │
│  (Local Ollama / Google AI Studio / Groq / OpenRouter) │
└────────────────────────────────────────────────────────┘
```

### 1. Interface and Engine Decoupling
The core server process manages agent lifecycles, session persistence, tool execution, and provider handshakes. Independent clients — whether a high-performance terminal UI (TUI) written in Go, desktop interfaces, or editor extensions (such as VS Code or Zed) — communicate with this server over standard protocols.

### 2. Native Language Server Protocol (LSP) Integration
Rather than relying on the LLM to guess whether an imported symbol exists or matches required signatures, OpenCode supports experimental LSP integration (enabled via `OPENCODE_EXPERIMENTAL_LSP_TOOL=true`). The agent queries the repository's active language server (such as `tsserver`, `gopls`, or `rust-analyzer`), receiving precise compiler feedback without wasting prompt tokens.

### 3. Model Context Protocol (MCP) Support
OpenCode natively supports Anthropic's **Model Context Protocol (MCP)**. This enables developers to connect specialized external tool servers — including databases, issue trackers, or documentation indexes — without patching or recompiling the harness itself.

### 4. Specialized Subagent Orchestration
To prevent large exploratory file traversals from polluting the primary reasoning context, OpenCode provides built-in subagents like `Explore` and `Scout`. The main agent delegates directory reconnaissance to a subagent and receives only a concise synthesis. The `subagent_depth` configuration prevents uncontrolled recursive delegation.

---

## Debunking the Cost Myth: High-Grade AI Without Subscriptions

The belief that agentic coding requires a recurring monthly subscription stems from the fact that commercial vendors bundle the execution harness with proprietary model access.

By adopting a model-agnostic harness like OpenCode, developers can leverage high-performing free inference tiers without sacrificing code quality. Three core strategies make this possible:

---

### Strategy 1: Fully Local Inference with Ollama

For sensitive enterprise codebases or offline workflows, running open models locally on your workstation provides complete privacy with zero ongoing operational cost.

OpenCode features **automatic Ollama discovery**: when initialized, it probes `http://127.0.0.1:11434` and registers locally downloaded models into the `/models` catalog.

#### Recommended Models for Code Engineering
- **Qwen 2.5 Coder (7B, 14B, or 32B):** Currently one of the strongest open weights for instruction following, code synthesis, and structured function calling.
- **DeepSeek Coder V2:** Outstanding algorithmic reasoning and multi-file debugging capabilities.
- **Llama 3.1 / 3.3 (8B or quantized 70B):** Reliable general instruction following and natural conversation flow.

#### The Critical Ollama Context Window Setting
By default, Ollama instances often default to a 2,048 or 4,096 token context window to conserve GPU memory. While sufficient for conversational queries, this constraint breaks agentic harnesses: reading a single medium-sized source file exhausts the buffer.

To use local models effectively with an agent harness, you must configure a 64k+ context window before starting Ollama:

```bash
export OLLAMA_CONTEXT_LENGTH=65536
ollama serve
```

Then pull the desired coding model:

```bash
ollama pull qwen2.5-coder:7b
```

Once launched, OpenCode automatically detects the model without requiring authentication keys.

---

### Strategy 2: Cloud Provider Free Tiers

When developing on hardware without dedicated high-memory GPUs, several cloud providers offer generous free developer tiers that easily support everyday engineering workloads.

#### 1. Google AI Studio (Gemini Flash)
Google AI Studio provides a free usage tier for individual developers featuring **Gemini 2.5 Flash** and **Gemini 2.5 Flash Lite**.
- **Competitive Advantage:** Massive native context windows (up to 1 million tokens) and fast processing speeds. Large repository sections can be ingested without immediate truncation.
- **Setup:** Create a developer key at [aistudio.google.com](https://aistudio.google.com/) and configure it in OpenCode using the interactive command:
  ```bash
  /connect
  ```

#### 2. Groq Cloud
Groq provides high-throughput inference powered by its LPU (Language Processing Unit) architecture. Its free tier offers models such as `llama-3.3-70b-versatile` and `qwen-2.5-coder-32b`.
- **Competitive Advantage:** Generation speeds often exceeding 300 tokens per second, making interactive linting, refactoring, and test writing instantaneous.
- **Setup:** Generate an API key in the Groq dashboard and register it under the `groq` provider in OpenCode.

#### 3. OpenRouter (Sponsored `:free` Endpoints)
OpenRouter catalogs dozens of models, including open weights hosted with free community endpoints marked with the `:free` suffix (e.g., `deepseek/deepseek-r1:free` or `meta-llama/llama-3.3-70b-instruct:free`).

---

### Strategy 3: Hybrid Routing via `opencode.json`

OpenCode configuration can be defined globally in `~/.config/opencode/opencode.json` or committed at the repository root in `opencode.json`.

Here is an example configuration combining multiple free providers:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "settings": {
        "baseURL": "http://127.0.0.1:11434/v1"
      }
    },
    "groq": {
      "options": {
        "apiKey": "{env:GROQ_API_KEY}"
      }
    }
  },
  "subagent_depth": 1,
  "permission": {
    "bash": "ask",
    "edit": "allow"
  }
}
```

This setup enables a cost-effective operational pattern:
- Fast cloud models (via Groq or Gemini Flash) handle exploration, codebase mapping, and draft tests.
- Local models (via Ollama) handle private code modifications, commit drafting, and local review.

---

## Practical Quickstart: From Setup to Execution

Setting up this zero-cost agent environment takes only a few minutes:

1. **Install OpenCode:**
   ```bash
   npm install -g @opencode-ai/cli
   ```
2. **Configure Provider Credentials:**
   Run the `/connect` command within the OpenCode terminal to securely store free API keys obtained from Google AI Studio or Groq. Keys are stored locally in `~/.local/share/opencode/auth.json`.
3. **Select an Active Model:**
   Use the `/models` command to select an active model (such as `ollama/qwen2.5-coder:7b` or your connected Groq model).
4. **Establish the Repository Contract (`AGENTS.md`):**
   OpenCode natively reads repository-level instruction files. Defining architectural constraints, strict test commands (`npm test`, `cargo test`), and code conventions in `AGENTS.md` ensures consistent adherence regardless of the model currently connected.

---

## Core Engineering Principles

While AI development tools evolve rapidly, core software engineering fundamentals remain unchanged:

- **No language model compensates for poor architecture.** If a codebase lacks clear separation of concerns, disciplined interfaces, or test coverage, an AI agent will merely amplify technical debt faster.
- **Automation is not a substitute for verification.** The true value of an agentic harness like OpenCode lies in running deterministic feedback loops: writing tests before implementation (TDD), executing static linters, and auditing diffs before every commit.
- **The engineer leads; the agent executes.** Human developers remain fully accountable for architectural choices, domain boundaries, and overall design integrity.

Decoupling the execution harness from the model is more than a cost-saving measure: it is a foundational architectural choice that preserves technical control over your engineering environment.

---

**Official Sources and Documentation:**

- [OpenCode Official Documentation — Agentic Harness & Core Concepts](https://opencode.ai/docs)
- [GitHub Repository — anomalyco/opencode](https://github.com/anomalyco/opencode)
- [OpenCode Providers Reference — Ollama, Groq, and Cloud Integrations](https://opencode.ai/docs/providers)
- [Ollama Documentation — Model Library & Context Length Configuration](https://ollama.com/)
- [Google AI Studio — Gemini Developer Documentation](https://ai.google.dev/)
- [Groq Cloud Documentation — Fast LLM Inference & Free Tier](https://groq.com/)
