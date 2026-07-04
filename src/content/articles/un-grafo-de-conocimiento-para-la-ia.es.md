---
title: 'Un grafo de conocimiento para la IA'
title_en: 'A Knowledge Graph for AI'
slug: 'un-grafo-de-conocimiento-para-la-ia'
date: 2026-07-04
author: 'Facundo Uferer'
category: 'AI Tools'
tags:
  - AI
  - Graphify
  - Knowledge Graphs
  - Developer Tools
excerpt: 'Graphify convierte un proyecto completo en un grafo de conocimiento que ayuda a personas y asistentes de IA a entender arquitectura, dependencias y contexto.'
excerpt_en: 'Graphify turns a full project into a knowledge graph that helps people and AI assistants understand architecture, dependencies, and context.'
readingTime: 10
lang: 'es'
published: true
featured: false
---
![Grafo de conocimiento generado con Graphify](/img/articles/graphify.png)

Hay algo que con los años aprendí a valorar especialmente: seguir encontrándome con gente que sabe cosas que uno todavía no conoce. A Graphify **llegué gracias a Federico**, un desarrollador que conocí hace poco y que, comparado con mi edad, es un pibe muy joven.

Siempre agradezco esos cruces porque la juventud suele traer herramientas, enfoques y formas de trabajar que a veces escapan al radar de quienes ya llevamos varios años escribiendo código. La experiencia enseña muchas cosas; **las nuevas generaciones, en cambio, tienen una capacidad notable para descubrir y adoptar soluciones** que cambian la manera de trabajar. Esta fue una de esas ocasiones.

Empecé a usar Graphify en un desarrollo bastante grande en el que estoy trabajando. El proyecto está distribuido en varios repositorios, con documentación dispersa, distintos servicios, diagramas, bases de datos, infraestructura y una enorme cantidad de contexto que resulta difícil reconstruir cuando uno recién llega o necesita comprender un área específica.

Después de probarlo durante algunos días entendí por qué Federico la recomendó tanto: me permitió empezar a recorrer el proyecto de una forma completamente distinta y, sinceramente, me está yendo de diez. Hoy entiendo el sistema mucho más rápido que antes y puedo responder preguntas sobre la arquitectura sin pasar horas consultando a mi agente.

## Qué hace exactamente Graphify

En pocas palabras, Graphify convierte un proyecto completo en un grafo de conocimiento que puede ser consultado tanto por personas como por asistentes de inteligencia artificial.

En lugar de limitarse a indexar archivos o generar embeddings, construye un mapa donde cada componente del sistema, como clases, funciones, módulos, documentos, tablas, APIs y otros recursos, queda conectado mediante relaciones que reflejan cómo interactúan realmente entre sí.

El resultado es un modelo estructural del proyecto que permite entender flujos, dependencias y responsabilidades sin necesidad de recorrer manualmente cientos o miles de archivos.

Para conseguirlo combina varias tecnologías. Utiliza Tree-sitter para analizar el código fuente con precisión sintáctica, incorpora modelos de lenguaje para interpretar documentación, PDFs, imágenes y otros contenidos semiestructurados, y finalmente organiza toda esa información en un grafo construido con NetworkX.

Sobre ese grafo puede detectar comunidades de componentes, dependencias relevantes, nodos excesivamente acoplados y relaciones que normalmente permanecen ocultas hasta que alguien dedica semanas a estudiar la base de código.

## Por qué cambia el trabajo con asistentes

A partir del momento en que el proyecto tiene un grafo, empieza la parte realmente interesante. Es posible realizar consultas como identificar el recorrido completo del sistema de autenticación, descubrir qué componentes conectan dos servicios aparentemente independientes, explicar el propósito de un módulo específico o calcular el camino más corto entre distintas piezas de la aplicación.

Para quienes trabajan con asistentes como Claude Code, Codex, Cursor, Gemini CLI u OpenCode, el beneficio es inmediato: el asistente deja de explorar el proyecto como una colección de archivos aislados y empieza a razonar sobre la estructura completa del sistema.

Esto cambia la calidad de las respuestas. En lugar de intentar deducir relaciones leyendo archivos sueltos, el asistente dispone de un modelo estructurado de la arquitectura. Como consecuencia puede responder preguntas mucho más complejas con menos contexto.

Graphify también permite exportar el conocimiento generado hacia distintos formatos. Puede producir documentación tipo wiki, vaults para Obsidian, GraphML para herramientas de análisis, exportaciones compatibles con Neo4j o FalkorDB e incluso exponer el grafo mediante un servidor MCP para que otros asistentes puedan consultarlo de forma remota.

Esto convierte al proyecto en algo más que un visualizador de dependencias; funciona como una capa de conocimiento reutilizable para equipos completos.

## Privacidad y proveedores de IA

Otro detalle interesante es que el procesamiento del código mediante Tree-sitter se realiza localmente. Cuando se utilizan modelos de lenguaje, estos intervienen principalmente para enriquecer documentación, archivos PDF, imágenes y otros contenidos semánticos, reduciendo la necesidad de enviar el código fuente completo a servicios externos.

Además, Graphify admite múltiples proveedores de IA, desde OpenAI y Anthropic hasta Gemini, Ollama, Azure o Amazon Bedrock, por lo que resulta relativamente sencillo adaptarlo a distintos entornos de trabajo.

Naturalmente tiene algunas limitaciones. En proyectos extremadamente grandes, con miles de nodos, la visualización HTML puede volverse pesada y conviene trabajar directamente sobre el archivo `graph.json` o mediante el servidor MCP.

También es importante configurar correctamente el archivo `.graphifyignore` para evitar indexar directorios generados automáticamente, dependencias externas o archivos que no aportan valor al análisis.

## Guía completa de Graphify

### Paso 1: instalar Graphify

El proyecto recomienda utilizar **uv**, el administrador de paquetes desarrollado por Astral, aunque también puede instalarse mediante **pipx**.

Con **uv**:

```bash
uv tool install graphifyy
```

Con **pipx**:

```bash
pipx install graphifyy
```

Una vez instalado, conviene ejecutar:

```bash
graphify install
```

Este comando instala los recursos adicionales que necesita la herramienta.

Para verificar que todo quedó correctamente instalado:

```bash
graphify --help
```

Si aparece la ayuda del programa, la instalación fue exitosa.

### Paso 2: elegir el proyecto

Ubicate en la carpeta raíz del proyecto.

Por ejemplo:

```bash
cd ~/Proyectos/MiAplicacion
```

O en Windows:

```powershell
cd C:\Proyectos\MiAplicacion
```

Lo importante es ejecutar Graphify desde el directorio principal del repositorio.

### Paso 3: generar el grafo

Ahora simplemente ejecutamos:

```bash
graphify .
```

El punto (`.`) indica que debe analizar el directorio actual. Dependiendo del tamaño del proyecto, este proceso puede tardar desde unos segundos hasta varios minutos.

Durante el análisis Graphify:

- lee el código fuente;
- analiza la documentación;
- detecta clases y funciones;
- encuentra relaciones entre módulos;
- construye un grafo interno;
- genera documentación automática.

### Paso 4: revisar los resultados

Al finalizar aparecerá una carpeta nueva:

```text
graphify-out/
```

Dentro encontraremos algo similar a esto:

```text
graphify-out/
├── graph.html
├── graph.json
└── GRAPH_REPORT.md
```

Cada archivo tiene un propósito diferente.

`graph.html` es la visualización interactiva. Puede abrirse directamente desde el navegador y permite recorrer nodos, acercar o alejar el grafo, ver relaciones, descubrir dependencias e identificar componentes centrales.

`GRAPH_REPORT.md` es un informe generado automáticamente. Incluye observaciones como componentes principales, módulos muy acoplados, posibles "God Objects", relaciones importantes y un resumen de la arquitectura. Muchas veces este documento permite comprender un proyecto antes incluso de abrir el código.

`graph.json` es el corazón del sistema. Contiene todo el grafo estructurado y puede ser utilizado posteriormente por Graphify para responder consultas sin tener que volver a analizar todo el proyecto.

### Paso 5: realizar consultas

Una vez generado el grafo ya pueden hacerse preguntas.

Por ejemplo:

```bash
graphify query "Explain the authentication flow"
```

O:

```bash
graphify query "How does UserService interact with the database?"
```

También:

```bash
graphify explain UserService
```

O:

```bash
graphify path UserService DatabasePool
```

Estas consultas utilizan el grafo previamente construido, por lo que son mucho más rápidas que volver a recorrer todo el repositorio.

### Paso 6: comprender dependencias

Uno de los usos más interesantes consiste en responder preguntas como:

- ¿Qué llama a esta función?
- ¿Quién depende de este módulo?
- ¿Qué servicios utilizan esta clase?
- ¿Qué ocurre si elimino este componente?
- ¿Cuál es el recorrido completo de una petición HTTP?

En proyectos grandes estas respuestas suelen requerir horas de navegación manual. Graphify las obtiene recorriendo las relaciones del grafo.

### Paso 7: exportar documentación

Graphify permite generar distintos formatos.

Por ejemplo:

```bash
graphify . --wiki
```

Genera documentación estilo wiki.

También:

```bash
graphify . --obsidian
```

Produce un vault listo para Obsidian.

O bien:

```bash
graphify . --graphml
```

Esto permite importar el grafo en Gephi u otras herramientas de análisis. También existen exportaciones compatibles con Neo4j y FalkorDB.

### Paso 8: compartir el grafo con el equipo

Una práctica posible consiste en compartir la carpeta:

```text
graphify-out/
```

De esta forma otros desarrolladores pueden reutilizar el análisis y no todos necesitan reconstruir el grafo desde cero. En equipos con repositorios grandes, esta diferencia se nota rápido.

### Paso 9: instalar el git hook

Graphify puede actualizar automáticamente el grafo cuando cambia el proyecto.

Para ello:

```bash
graphify hook install
```

Cada vez que se realicen commits importantes el grafo podrá mantenerse sincronizado.

### Paso 10: utilizar Graphify con asistentes de IA

Aquí aparece una de sus mayores fortalezas.

Una vez generado el grafo, asistentes como:

- Claude Code
- Cursor
- Codex
- Gemini CLI
- OpenCode

pueden consultar directamente la estructura del proyecto.

En lugar de intentar deducir relaciones leyendo archivos aislados, el asistente dispone de un modelo estructurado de toda la arquitectura. Como consecuencia puede responder preguntas mucho más complejas con menos contexto.

## Configurar proveedores de IA

Si se desea enriquecer el análisis mediante modelos de lenguaje, basta con definir la clave correspondiente.

Por ejemplo:

```bash
export OPENAI_API_KEY=tu_api_key
```

O:

```bash
export ANTHROPIC_API_KEY=tu_api_key
```

También existe soporte para:

- Gemini
- Ollama
- Azure OpenAI
- Amazon Bedrock

Si únicamente se analiza código fuente, muchas funcionalidades continúan funcionando gracias a Tree-sitter sin necesidad de utilizar un modelo externo.

## Ignorar archivos innecesarios

Al igual que Git utiliza `.gitignore`, Graphify dispone de `.graphifyignore`.

Allí conviene excluir directorios como:

```text
node_modules
dist
build
target
coverage
vendor
```

Esto acelera considerablemente el análisis.

## Cuándo conviene usar Graphify

Graphify es especialmente útil cuando existen:

- monorepos;
- múltiples microservicios;
- varios repositorios relacionados;
- abundante documentación técnica;
- proyectos heredados;
- equipos grandes;
- onboarding de nuevos desarrolladores;
- auditorías de arquitectura.

En proyectos pequeños probablemente el beneficio sea menor, pero a medida que aumenta el tamaño del sistema el valor del grafo crece rápidamente.
