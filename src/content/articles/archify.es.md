---
title: 'Archify: cuando el agente de IA también tiene que explicar la arquitectura'
slug: 'archify'
date: 2026-09-11
author: 'Facundo Uferer'
category: 'AI Tools'
tags:
  - Archify
  - Architecture
  - AI Agents
  - Developer Tools
excerpt: 'Archify convierte repositorios y descripciones técnicas en diagramas interactivos y verificables mediante una representación intermedia tipada en JSON.'
readingTime: 4
image: '/img/articles/archify.png'
lang: 'es'
published: true
featured: false
---
![Archify](/img/articles/archify.png)

Programar con agentes de IA tiene un pequeño problema secundario: después de que Claude, Codex o Cursor modifican medio proyecto, algún humano todavía tiene que entender qué demonios está pasando. **Archify** intenta resolver precisamente esa parte. Es una skill open source que permite transformar un repositorio o una descripción técnica en mapas interactivos de arquitectura, workflows, secuencias, flujos de datos y ciclos de vida. Funciona con Cursor, Claude Code, Codex CLI y OpenCode, entre otros entornos.

La diferencia importante está debajo del dibujo. El agente no genera directamente un montón de SVG esperando que parezca arquitectura: produce una **representación intermedia JSON tipada**, Archify la valida contra esquemas y reglas de layout y finalmente la compila de manera determinista a HTML/SVG. El resultado puede exportarse además como PNG, SVG, WebM o tarjetas para compartir. Esa separación entre razonamiento del agente y renderizado verificable es probablemente la mejor idea del proyecto.

## Diagramas interactivos y navegables

Los diagramas tampoco son simples imágenes. Permiten buscar componentes, seguir relaciones upstream y downstream, inspeccionar rutas entre nodos, comparar roles, cambiar temas y recorrer presentaciones guiadas. Para arquitectura basada en código, Archify puede incluso vincular componentes con archivos y líneas verificadas contra una revisión concreta del repositorio. Es decir, intenta que el diagrama sea documentación navegable y no ese PNG de arquitectura que alguien creó en 2023 y que todos fingen que todavía representa producción.

Hay una decisión de diseño interesante: **Archify no quiere auto-layout genérico**. Sus autores probaron ese camino con Mermaid y concluyeron que eliminaba precisamente aquello que hacía atractivos los resultados. El agente decide jerarquía, posición y énfasis; Archify controla consistencia y validación. Tampoco pretende convertirse en un editor WYSIWYG. Es una herramienta para agentes, no otro Draw.io con esteroides generativos.

## Cómo empezar

Necesitás Node.js 18 o superior. La instalación global más sencilla es:

```bash
npx skills add tt-a1i/archify -g
```

También podés probarlo sin instalar:

```bash
npx skills use tt-a1i/archify@archify --agent codex
```

Después abrí tu proyecto con un agente compatible y pedile, por ejemplo:

```text
Analyze this repository, then use Archify to create a high-level runtime architecture diagram. Show 8–12 core components, external dependencies and trust boundaries.
```

También podés empezar sin repositorio:

```text
Use Archify to draw: Browser -> API -> Redis cache -> PostgreSQL fallback.
```

Luego refinás conversando: “agregá Redis”, “mostrá el flujo de autenticación”, “resaltá el rollback” o “convertí esto en un sequence diagram”. Archify soporta `architecture`, `workflow`, `sequence`, `dataflow` y `lifecycle`.

Para comprobar la instalación manualmente podés ejecutar `node bin/archify.mjs doctor`, generar un ejemplo con `demo` y validar diagramas con `validate`. Pero para el usuario normal esa complejidad queda deliberadamente detrás del agente. Y ahí está probablemente su mayor atractivo: **Archify hace que documentar arquitectura se parezca más a hacer una pregunta y menos a pasar una tarde alineando rectángulos.**
