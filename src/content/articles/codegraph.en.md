---
title: "CodeGraph: el mapa que tu código necesita"
title_en: "CodeGraph: The Map Your Codebase Needs"
slug: codegraph
date: 2026-07-06
author: Facundo Uferer
category: AI Development
tags:
  - CodeGraph
  - AI Agents
  - MCP
  - Developer Tools
excerpt: CodeGraph crea un grafo local de símbolos, llamadas y dependencias para que los agentes de IA entiendan el código sin pasearse por el repo como arqueólogos cansados.
excerpt_en: CodeGraph builds a local graph of symbols, calls, and dependencies so AI agents understand the codebase without wandering through the repo like tired archaeologists.
readingTime: 5
image: /img/articles/CodeGraph.png
lang: en
published: true
featured: false
---
![CodeGraph](/img/articles/CodeGraph.png)

CodeGraph joins the ever-growing family of tools trying to make coding agents stop behaving like interns armed with `grep`. Before asking an AI to understand a repository, it helps to give it a map of the territory. That map is a local graph of symbols, calls, imports, and dependencies, which agents can then query directly.

Instead of having the agent open file after file to mentally reconstruct an architecture, it uses `codegraph_explore` to retrieve structural context: which function calls which, what could break when touching a symbol, and which code fragments actually matter. According to its own benchmarks, this reduces tool calls and file reads, though the actual cost savings depend on repository size and usage volume.

The project also makes a sensible decision: it runs locally. The index lives in `.codegraph/`, uses SQLite, and auto-updates when code changes. There is anonymous telemetry, but it is documented and can be disabled, with no code, paths, or filenames ever sent.

Its best use case is medium to large repositories, especially when multiple agents or developers need to reason about flows, change impact, or cross-cutting dependencies. It does not replace reading code, tests, or human judgment. It just keeps the AI from wasting tokens rediscovering the wheel.

## Installation

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh

# Windows PowerShell
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex
```

With Node:

```bash
npm i -g @colbymchenry/codegraph
```

## Connect your agents

```bash
codegraph install
```

This sets up the MCP server for Claude Code, Cursor, Codex CLI, OpenCode, Hermes Agent, Gemini CLI, Antigravity IDE, and Kiro. It does not index the project yet.

## Index a project

```bash
cd your-project
codegraph init
```

Creates `.codegraph/` and generates the local index. It then auto-syncs when files change, with a 2-second debounce window.

## Useful commands

```bash
codegraph status
codegraph explore "how login works"
codegraph query UserService
codegraph callers authenticate
codegraph callees authenticate
codegraph impact authenticate
codegraph affected src/auth.ts
codegraph sync
codegraph uninit
```

The central command is `codegraph explore`, equivalent to the MCP tool `codegraph_explore`: it returns relevant code, call paths, and potential impact radius.

## Privacy and telemetry

The index lives locally in SQLite inside `.codegraph/codegraph.db`. Telemetry is anonymous and does not include code, paths, filenames, symbols, or queries. It can be turned off with:

```bash
codegraph telemetry off
```

At the time of writing, the project was at version `1.2.0`, has an MIT license, and is published as a binary or npm package `@colbymchenry/codegraph`.
