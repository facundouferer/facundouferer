CodeGraph entra en la familia cada vez más poblada de herramientas que intentan que los agentes de programación dejen de comportarse como pasantes con `grep`. Antes de pedirle a una IA que entienda un repositorio, conviene darle un mapa del territorio. Ese mapa es un grafo local de símbolos, llamadas, imports y dependencias, que luego se consulta desde agentes.

En lugar de que el agente abra archivo tras archivo para reconstruir mentalmente una arquitectura , usa `codegraph_explore` para recuperar contexto estructural: qué función llama a cuál, qué puede romperse al tocar un símbolo y qué fragmentos de código importan realmente. Según sus propios benchmarks, esto reduce llamadas a herramientas y lecturas de archivos, aunque el ahorro económico depende del tamaño del repositorio y del volumen de uso.

El proyecto también toma una decisión sensata: funciona localmente. El índice se guarda en `.codegraph/`, usa SQLite y se actualiza automáticamente cuando cambia el código. Hay telemetría anónima, pero documentada y desactivable, sin envío de código ni nombres de archivos. 

Su mejor caso de uso está en repos medianos o grandes, especialmente cuando varios agentes o desarrolladores necesitan razonar sobre flujos, impacto de cambios o dependencias cruzadas. No reemplaza leer código, tests ni criterio humano; apenas evita que la IA desperdicie tokens redescubriendo la rueda. 

## Guía de uso

CodeGraph es una CLI/MCP que crea un grafo local del código: símbolos, llamadas, imports, herencia y dependencias. Su promesa es que agentes como Claude Code, Cursor, Codex CLI, Gemini CLI, OpenCode, Kiro y otros consulten ese índice en vez de pasear por el repo con `grep` como arqueólogos cansados. 
A la hora de que escribí esto, el proyecto estaba en la versión `1.2.0` y tiene licencia MIT y publica binario/paquete npm `@colbymchenry/codegraph`. ([GitHub](https://raw.githubusercontent.com/colbymchenry/codegraph/main/package.json "raw.githubusercontent.com"))

1. **Instalar**
    

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

2. **Conectar tus agentes**
    

```bash
codegraph install
```

Esto configura el servidor MCP para Claude Code, Cursor, Codex CLI, opencode, Hermes Agent, Gemini CLI, Antigravity IDE y Kiro. No indexa todavía el proyecto. ([GitHub](https://github.com/colbymchenry/codegraph "GitHub - colbymchenry/codegraph: Pre-indexed code knowledge graph, auto syncs on code changes, for Claude Code, Codex, Gemini, Cursor, OpenCode, AntiGravity, Kiro, and Hermes Agent — fewer tokens, fewer tool calls, 100% local · GitHub"))

3. **Indexar un proyecto**
    

```bash
cd tu-proyecto
codegraph init
```

Crea `.codegraph/` y genera el índice local. Luego se autosincroniza cuando cambian archivos, con una ventana de espera de 2 segundos. ([GitHub](https://github.com/colbymchenry/codegraph "GitHub - colbymchenry/codegraph: Pre-indexed code knowledge graph, auto syncs on code changes, for Claude Code, Codex, Gemini, Cursor, OpenCode, AntiGravity, Kiro, and Hermes Agent — fewer tokens, fewer tool calls, 100% local · GitHub"))

4. **Comandos útiles**
    

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

El comando central es `codegraph explore`, equivalente a la herramienta MCP `codegraph_explore`: devuelve código relevante, rutas de llamadas y posible radio de impacto. ([GitHub](https://github.com/colbymchenry/codegraph "GitHub - colbymchenry/codegraph: Pre-indexed code knowledge graph, auto syncs on code changes, for Claude Code, Codex, Gemini, Cursor, OpenCode, AntiGravity, Kiro, and Hermes Agent — fewer tokens, fewer tool calls, 100% local · GitHub"))

5. **Privacidad y telemetría**
    

El índice vive localmente en SQLite dentro de `.codegraph/codegraph.db`. La telemetría es anónima y no incluye código, rutas, nombres de archivos, símbolos ni consultas; se puede apagar con:

```bash
codegraph telemetry off
```
