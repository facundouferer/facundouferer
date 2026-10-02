---
title: 'Cómo funciona el harness de OpenCode y cómo programar con IA sin gastar un centavo'
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
excerpt: 'Análisis técnico del harness agéntico de OpenCode: cómo desacoplar el entorno de ejecución del modelo y configurar flujos de desarrollo con IA sin pagar suscripciones.'
readingTime: 8
lang: 'es'
published: true
featured: false
---
![Imagen por defecto del articulo](/img/articles/imagenotfound.png)

En el desarrollo de software asistido por inteligencia artificial existe una confusión frecuente: creer que la capacidad de un asistente depende exclusivamente de qué tan grande o reciente sea el modelo de lenguaje (LLM).

La realidad de la ingeniería de software es muy distinta. Un LLM por sí solo no es más que **un generador probabilístico de texto**. Aislado en un servidor, no puede leer el árbol de dependencias de un proyecto, no puede compilar código, no puede ejecutar tests de regresión ni puede comprobar si una modificación rompió el contrato de una interfaz.

Para que un modelo actúe como un agente de ingeniería necesita un **harness** (arnés de ejecución): el sistema de soporte, herramientas, permisos y contexto que conecta la capacidad de razonamiento del modelo con el sistema operativo y el entorno de trabajo del desarrollador.

**OpenCode** nace bajo esta premisa como una alternativa de código abierto y completamente agnóstica a los modelos comerciales, permitiendo operar herramientas agénticas avanzadas sin quedar atado a suscripciones cerradas ni a facturaciones mensuales obligatorias.

---

## Qué es exactamente un Agent Harness

En la literatura de pruebas y benchmarking de software, un *harness* es el marco que configura el entorno, provee entradas y recopila resultados. En el contexto de agentes de codificación autónomos, el arnés cumple una función análoga: **es el sistema operativo del agente**.

Si el modelo de lenguaje es el cerebro, el harness representa **los ojos, las manos y el sistema nervioso**:

1. **El bucle de ejecución (Agent Loop):** Orquesta el ciclo interactivo. Envía el contexto al modelo, analiza sintácticamente las intenciones o llamadas a funciones (*tool calling*), ejecuta la herramienta correspondiente de manera determinista y retroalimenta la salida estándar o el error hacia la ventana de contexto.
2. **Sistema de archivos e I/O determinista:** Expone primitivas seguras para listar directorios, buscar texto mediante expresiones regulares, inspeccionar rangos de líneas y aplicar parches atómicos en disco.
3. **Frontera de permisos y seguridad:** Establece una barrera de contención (*sandbox*) configurable. Define si una acción potencialmente destructiva —como ejecutar un comando en Bash o sobreescribir un archivo central— debe ejecutarse en silencio, solicitar confirmación humana (*ask*) o bloquearse de inmediato (*deny*).
4. **Gestión de contexto y memoria persistente:** Ingesta jerárquica de directivas de proyecto (archivos como `AGENTS.md` o `CLAUDE.md`), persistencia de sesiones en almacenamiento local y mecanismos de compactación para no desbordar la ventana de tokens.
5. **Retroalimentación de compiladores (LSP):** Conexión directa con servidores de Language Server Protocol para capturar diagnósticos de sintaxis y tipos sin necesidad de que el humano los copie a mano.
6. **Mecanismos de reversión (Undo/Redo):** Registro estructurado de deltas y operaciones en disco que permite revertir cambios fallidos con precisión quirúrgica.

Herramientas propietarias como Claude Code o los asistentes integrados en IDEs comerciales encapsulan este arnés bajo licencias cerradas y suscripciones propietarias. OpenCode desacopla esta arquitectura por completo.

---

## La arquitectura interna de OpenCode

El diseño de OpenCode (mantenido por la organización **Anomaly**) se apoya en un patrón **cliente-servidor** modular:

```
┌────────────────────────────────────────────────────────┐
│                   Superficies de Cliente               │
│      (TUI Terminal en Go / Desktop App / IDE Plugin)   │
└───────────────────────────▲────────────────────────────┘
                            │ HTTP / JSON-RPC
┌───────────────────────────▼────────────────────────────┐
│                  Servidor OpenCode (Runtime)           │
│           (Orquestación en Bun/TypeScript y Go)        │
├────────────────────────────────────────────────────────┤
│  • Bucle Agéntico (Agent Loop)                         │
│  • Gestor de Sesiones & Memoria (~/.local/share/...)   │
│  • Barrera de Permisos (allow / ask / deny)            │
│  • Subagentes (General, Explore, Scout)                │
│  • Herramientas nativas (Bash, Files, LSP, MCP)        │
└───────────────────────────▲────────────────────────────┘
                            │ Conectores agnósticos (75+ providers)
┌───────────────────────────▼────────────────────────────┐
│                    Capa de Inteligencia                │
│  (Ollama Local / Google AI Studio / Groq / OpenRouter) │
└────────────────────────────────────────────────────────┘
```

### 1. Desacoplamiento entre interfaz y motor
El servidor central gestiona el estado de las sesiones, las herramientas y la comunicación con los proveedores de LLM. Sobre esta base pueden operar simultáneamente una interfaz de terminal basada en texto (TUI), extensiones para editores de código (como VS Code o Zed) o herramientas de integración continua.

### 2. Integración con Language Server Protocol (LSP)
Una de las capacidades más avanzadas de su arnés es la integración con servidores LSP mediante la bandera `OPENCODE_EXPERIMENTAL_LSP_TOOL=true`. En lugar de forzar al modelo a predecir a ciegas si un método existe o si los tipos coinciden, el agente consulta directamente al servidor de lenguaje del proyecto (como `tsserver`, `gopls` o `rust-analyzer`), recibiendo diagnósticos exactos en tiempo real.

### 3. Protocolo de Contexto de Modelo (MCP)
OpenCode implementa soporte nativo para **Model Context Protocol (MCP)**, permitiendo conectar servidores externos de herramientas (bases de datos, documentación interna, APIs de despliegue) sin tener que recompilar el arnés ni modificar el núcleo del software.

### 4. Orquestación de subagentes especializados
Para evitar saturar la sesión principal con búsquedas exploratorias pesadas, OpenCode incluye subagentes preconfigurados como `Explore` y `Scout`. El agente principal delega la investigación de rutas y lecturas extensas a un subagente y recibe únicamente un resumen consolidado. El parámetro de configuración `subagent_depth` previene ciclos de recursión descontrolados.

---

## El mito del costo: Cómo usar IA de alto nivel sin gastar dinero

La creencia de que programar con agentes de IA requiere pagar 20 o 50 dólares mensuales por persona se debe a que la mayoría de los usuarios contrata el arnés y el modelo en un mismo paquete cerrado.

Al usar un arnés agnóstico como OpenCode, el desarrollador puede seleccionar proveedores de inferencia gratuitos sin resignar calidad técnica. Existen tres estrategias principales para lograrlo:

---

### Estrategia 1: Inferencia 100% local con Ollama

La opción más limpia para entornos corporativos o proyectos con requerimientos estrictos de confidencialidad es ejecutar modelos abiertos en la propia máquina.

OpenCode incorpora **detección automática de Ollama**: al iniciar, verifica si el servicio local está respondiendo en `http://127.0.0.1:11434` e importa automáticamente los modelos instalados a la lista disponible.

#### Modelos recomendados para ingeniería de código
- **Qwen 2.5 Coder (7B, 14B o 32B):** Actualmente uno de los modelos más sólidos en generación de código, seguimiento de directivas e invocación de herramientas estructuradas.
- **DeepSeek Coder V2:** Excelente capacidad de razonamiento algorítmico y depuración de sintaxis.
- **Llama 3.1 / 3.3 (8B u 70B vía cuantización):** Gran balance en comprensión general de instrucciones.

#### El detalle crítico del Context Window en Ollama
Por defecto, Ollama inicializa muchas instancias con una ventana de contexto de 2.048 o 4.096 tokens para optimizar memoria de GPU. Para un chat casual alcanza, pero para un agente de desarrollo esto produce fallos inmediatos: el código de un archivo mediano agota el búfer y el agente pierde la noción del proyecto.

Es indispensable exportar la variable de entorno para ampliar la ventana de contexto antes de iniciar el servicio:

```bash
export OLLAMA_CONTEXT_LENGTH=65536
ollama serve
```

Y luego descargar el modelo deseado:

```bash
ollama pull qwen2.5-coder:7b
```

Al abrir OpenCode, el modelo aparecerá disponible automáticamente sin requerir credenciales ni claves de API.

---

### Estrategia 2: Niveles gratuitos de proveedores Cloud (Free Tier)

Si la máquina local no dispone de una GPU dedicada o memoria RAM suficiente para modelos densos, diversos proveedores en la nube ofrecen accesos con cuotas gratuitas suficientes para el trabajo cotidiano de desarrollo.

#### 1. Google AI Studio (Gemini Flash)
Google ofrece a través de AI Studio una cuota gratuita generosa para desarrollo personal con sus modelos **Gemini 2.5 Flash** y **Gemini 2.5 Flash Lite**.
- **Ventaja competitiva:** Ventana de contexto nativa masiva (hasta un millón de tokens) y alta velocidad de procesamiento. Permite cargar proyectos medianos completos en contexto sin degradación.
- **Cómo obtenerla:** Se genera una API key en [aistudio.google.com](https://aistudio.google.com/) y se conecta en OpenCode mediante el comando interactivo:
  ```bash
  /connect
  ```

#### 2. Groq Cloud
Groq provee inferencia ultraveloz mediante sus unidades de procesamiento LPU (Language Processing Unit), ofreciendo una capa gratuita con modelos de primer nivel como `llama-3.3-70b-versatile` y `qwen-2.5-coder-32b`.
- **Ventaja competitiva:** Velocidad de generación superior a los 300 tokens por segundo, ideal para interacciones cortas de refactorización y generación de tests.
- **Cómo obtenerla:** Se genera la clave en la consola de Groq y se asocia en OpenCode seleccionando el proveedor `groq`.

#### 3. OpenRouter (Modelos comunitarios `:free`)
OpenRouter permite acceder a más de un centenar de modelos de distintos laboratorios. Su catálogo incluye variantes gratuitas patrocinadas marcadas explícitamente con el sufijo `:free` (por ejemplo, `deepseek/deepseek-r1:free` o `meta-llama/llama-3.3-70b-instruct:free`).

---

### Estrategia 3: Enrutamiento híbrido mediante `opencode.json`

OpenCode permite definir la configuración de proveedores tanto de manera global (`~/.config/opencode/opencode.json`) como por repositorio (`opencode.json` en la raíz del proyecto).

Un ejemplo de configuración híbrida que aprovecha proveedores gratuitos luce así:

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

Con esta arquitectura, el desarrollador puede usar:
- Un modelo ultrarrápido en Groq o Gemini Flash para tareas exploratorias y mapas de contexto.
- Un modelo local con Ollama para modificar código confidencial y redactar commits en total aislamiento.

---

## Flujo de trabajo práctico: De cero a ejecución

Poner en marcha este entorno toma menos de cinco minutos:

1. **Instalación de OpenCode:**
   ```bash
   # Vía gestor de paquetes o binario oficial
   npm install -g @opencode-ai/cli
   ```
2. **Conexión de credenciales:**
   Dentro de la terminal de OpenCode, se ejecuta el comando `/connect` para ingresar las claves gratuitas obtenidas en Google AI Studio o Groq. Las credenciales se almacenan localmente en `~/.local/share/opencode/auth.json`.
3. **Selección del modelo:**
   Mediante `/models`, se selecciona la opción deseada (por ejemplo, `ollama/qwen2.5-coder:7b` o el modelo configurado en Groq).
4. **Definición del contrato de trabajo (`AGENTS.md`):**
   El arnés lee de forma nativa los archivos de directivas del repositorio. Incluir un archivo `AGENTS.md` con las reglas de arquitectura, comandos de prueba (`npm test`, `cargo test`) y convenciones de código asegura que cualquier modelo respete los estándares del equipo.

---

## Conceptos antes que herramientas

El ecosistema de herramientas de desarrollo asistido por IA avanza con rapidez, pero las leyes de la ingeniería de software permanecen inalterables:

- **Ningún modelo de lenguaje corrige una mala arquitectura.** Si un proyecto carece de separación de responsabilidades, tipado estricto o límites claros de dominio, el agente multiplicará la deuda técnica con mayor velocidad.
- **La automatización no sustituye la verificación.** La fortaleza de un harness como OpenCode no radica en la magia del autocompletado, sino en su capacidad para ejecutar ciclos de retroalimentación verificables: escribir pruebas antes de implementar (TDD), ejecutar análisis estático y auditar diffs antes de cada commit.
- **El programador mantiene la dirección técnica.** La IA ejecuta; el humano diseña, valida y toma las decisiones de fondo.

Desacoplar el arnés del modelo no es únicamente una forma de ahorrar dinero: es la decisión arquitectónica correcta para conservar la soberanía sobre el propio entorno de desarrollo.

---

**Fuentes y documentación oficial:**

- [OpenCode Official Documentation — Agentic Harness & Core Concepts](https://opencode.ai/docs)
- [GitHub Repository — anomalyco/opencode](https://github.com/anomalyco/opencode)
- [OpenCode Providers Reference — Ollama, Groq, and Cloud Integrations](https://opencode.ai/docs/providers)
- [Ollama Documentation — Model Library & Context Length Configuration](https://ollama.com/)
- [Google AI Studio — Gemini Developer Documentation](https://ai.google.dev/)
- [Groq Cloud Documentation — Fast LLM Inference & Free Tier](https://groq.com/)
