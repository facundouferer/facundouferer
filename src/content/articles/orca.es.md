---
title: 'Orca: la IDE diseñada alrededor de los agentes de IA'
slug: 'orca'
date: 2026-09-11
author: 'Facundo Uferer'
category: 'AI Development'
tags:
  - Orca
  - ADE
  - Git Worktrees
  - AI Agents
  - Developer Tools
excerpt: 'Orca invierte la fórmula de los editores con IA: un entorno de desarrollo para agentes basado en git worktrees paralelos, diffs asistidos y control multi-agente.'
readingTime: 4
image: '/img/articles/orca.png'
lang: 'es'
published: true
featured: false
---
![Orca Agent Development Environment](/img/articles/orca.png)

Durante los últimos años la industria se dedicó a insertar inteligencia artificial dentro de los IDE: primero autocompletado, después chat y finalmente agentes capaces de modificar proyectos enteros. Orca propone invertir la ecuación. En lugar de construir un editor y agregarle agentes, construye el entorno alrededor de ellos.

Técnicamente sus creadores prefieren llamarlo **ADE, Agent Development Environment**, y probablemente tengan razón: cuando Claude Code, Codex, Cursor CLI, Gemini, OpenCode y compañía empiezan a hacer buena parte del trabajo, mirar un archivo durante ocho horas deja de ser necesariamente el centro de la jornada.

## La gran idea: git worktrees en paralelo

La gran idea de Orca son los **worktrees paralelos**. Cada tarea puede vivir en su propio `git worktree`, con branch, archivos, terminales y agente independientes. Es posible darle el mismo bug a Claude Code, Codex y Cursor, dejarlos trabajar simultáneamente, comparar los tres diffs y quedarse con la mejor solución.

No hay que hacer stash, cambiar de branch compulsivamente ni confiar en la memoria para recordar qué terminal estaba haciendo qué. Git, por una vez, termina ayudando a reducir la confusión en lugar de participar activamente en ella.

## Cabina de control para agentes sintéticos

Orca resulta especialmente interesante porque no termina cuando el agente acaba de escribir. Ofrece un conjunto de capacidades pensadas para el ciclo completo:

- **Visor de diffs optimizado:** pensado específicamente para evaluar cambios producidos por modelos de lenguaje.
- **Comentarios en línea e iteración:** permite comentar líneas directamente y reenviar todas las observaciones agrupadas al agente para una nueva pasada.
- **Atribución de autoría:** distingue claramente qué líneas fueron escritas por humanos y cuáles por IA.
- **Ecosistema integrado:** incorpora navegador Chromium, terminales dedicadas, GitHub, Linear y ejecución remota vía SSH.
- **Supervisión móvil:** incluye app para monitorear agentes que siguen corriendo en servidores o máquinas remotas.

Ese conjunto convierte a Orca menos en “otro editor con IA” y más en una **cabina de control para un pequeño ejército de programadores sintéticos**, con los roces habituales convenientemente sustituidos por límites de tasa. Además, es open source bajo licencia MIT, funciona en macOS, Windows y Linux y respeta tus suscripciones existentes.

## Cómo empezar con Orca

1. **Instalación:** descargá Orca desde [onOrca.dev](https://onorca.dev) para Windows, macOS o Linux. En macOS también podés usar `brew install --cask stablyai/orca/orca`.
2. **Configurá tus agentes:** instalá al menos un agente CLI compatible (Claude Code, Codex, Cursor CLI, etc.). Orca no incluye el modelo: utiliza tus suscripciones y herramientas locales.
3. **Agregá tu repositorio:** abrí **Add Repo**, elegí un repositorio Git existente y creá un nuevo worktree con el botón `+`.
4. **Ejecución simultánea:** creá dos o tres worktrees desde el mismo branch, asigná la misma tarea a distintos agentes y compará sus soluciones.
5. **Permisos y autonomía:** revisá **Settings → Agents → Agent Permissions**. Al principio conviene mantenerlo en **Manual** y aumentar la autonomía a medida que ganes confianza en el flujo.

Orca no será necesaria para quien todavía utiliza un único agente para tareas ocasionales. Pero cuando el desarrollo pasa de pedirle algo puntual a un chat a **coordinar múltiples agentes que investigan, implementan, prueban y revisan en paralelo**, el IDE tradicional empieza a sentirse limitado. Para ese nuevo flujo, Orca es una de las propuestas más sólidas del momento.
