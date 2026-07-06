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
lang: es
published: true
featured: false
---
![CodeGraph](/img/articles/CodeGraph.png)

CodeGraph entra en la familia cada vez más poblada de herramientas que intentan que los agentes de programación dejen de comportarse como pasantes con `grep`. Antes de pedirle a una IA que entienda un repositorio, conviene darle un mapa del territorio. Ese mapa es un grafo local de símbolos, llamadas, imports y dependencias, que luego se consulta desde agentes.

En lugar de que el agente abra archivo tras archivo para reconstruir mentalmente una arquitectura, usa `codegraph_explore` para recuperar contexto estructural: qué función llama a cuál, qué puede romperse al tocar un símbolo y qué fragmentos de código importan realmente. Según sus propios benchmarks, esto reduce llamadas a herramientas y lecturas de archivos, aunque el ahorro económico depende del tamaño del repositorio y del volumen de uso.

El proyecto también toma una decisión sensata: funciona localmente. El índice se guarda en `.codegraph/`, usa SQLite y se actualiza automáticamente cuando cambia el código. Hay telemetría anónima, pero documentada y desactivable, sin envío de código ni nombres de archivos.

Su mejor caso de uso está en repos medianos o grandes, especialmente cuando varios agentes o desarrolladores necesitan razonar sobre flujos, impacto de cambios o dependencias cruzadas. No reemplaza leer código, tests ni criterio humano; apenas evita que la IA desperdicie tokens redescubriendo la rueda.

## Instalación

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh

# Windows PowerShell
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex
```

Con Node también se puede usar:

```bash
npm i -g @colbymchenry/codegraph
```

## Conectar tus agentes

```bash
codegraph install
```

Esto configura el servidor MCP para Claude Code, Cursor, Codex CLI, OpenCode, Hermes Agent, Gemini CLI, Antigravity IDE y Kiro. No indexa todavía el proyecto.

## Indexar un proyecto

```bash
cd tu-proyecto
codegraph init
```

Crea `.codegraph/` y genera el índice local. Luego se autosincroniza cuando cambian archivos, con una ventana de espera de 2 segundos.

## Comandos útiles

```bash
codegraph status
codegraph explore "cómo funciona el login"
codegraph query UserService
codegraph callers authenticate
codegraph callees authenticate
codegraph impact authenticate
codegraph affected src/auth.ts
codegraph sync
codegraph uninit
```

El comando central es `codegraph explore`, equivalente a la herramienta MCP `codegraph_explore`: devuelve código relevante, rutas de llamadas y posible radio de impacto.

## Privacidad y telemetría

El índice vive localmente en SQLite dentro de `.codegraph/codegraph.db`. La telemetría es anónima y no incluye código, rutas, nombres de archivos, símbolos ni consultas. Se puede apagar con:

```bash
codegraph telemetry off
```

A la hora de escribir esto, el proyecto estaba en la versión `1.2.0`, tiene licencia MIT y se publica como binario o paquete npm `@colbymchenry/codegraph`.
