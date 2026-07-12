# Un grafo de conocimiento para la IA

Hay algo que con los años aprendí a valorar especialmente: seguir encontrándome con gente que sabe cosas que uno todavía no conoce. A Graphify **llegué gracias a Federico**, un desarrollador que conocí hace poco y que, comparado con mi edad, es un pibe muy joven. Siempre agradezco esos cruces porque la juventud suele traer herramientas, enfoques y formas de trabajar que a veces escapan al radar de quienes ya llevamos varios años escribiendo código. La experiencia enseña muchas cosas; **las nuevas generaciones, en cambio, tienen una capacidad notable para descubrir y adoptar soluciones** que cambian la manera de trabajar. Esta fue una de esas ocasiones.

Empecé a usar Graphify en un desarrollo bastante grande en el que estoy trabajando. El proyecto está distribuido en varios repositorios, con documentación dispersa, distintos servicios, diagramas, bases de datos, infraestructura y una enorme cantidad de contexto que resulta difícil reconstruir cuando uno recién llega o necesita comprender un área específica. Después de probarlo durante algunos días entendí por qué Federico la recomendó tanto: me permitió empezar a recorrer el proyecto de una forma completamente distinta y, sinceramente, me está yendo de diez. Hoy entiendo el sistema mucho más rápido que antes y puedo responder preguntas sobre la arquitectura sin pasar horas consultando a mi agente.

**¿Qué hace exactamente Graphify?** En pocas palabras, convierte un proyecto completo en un grafo de conocimiento que puede ser consultado tanto por personas como por asistentes de inteligencia artificial. En lugar de limitarse a indexar archivos o generar embeddings, construye un mapa donde cada componente del sistema —clases, funciones, módulos, documentos, tablas, APIs y otros recursos— queda conectado mediante relaciones que reflejan cómo interactúan realmente entre sí. El resultado es un modelo estructural del proyecto que permite entender flujos, dependencias y responsabilidades sin necesidad de recorrer manualmente cientos o miles de archivos.

Para conseguirlo combina varias tecnologías. Utiliza Tree-sitter para analizar el código fuente con precisión sintáctica, incorpora modelos de lenguaje para interpretar documentación, PDFs, imágenes y otros contenidos semiestructurados, y finalmente organiza toda esa información en un grafo construido con NetworkX. Sobre ese grafo puede detectar comunidades de componentes, dependencias relevantes, nodos excesivamente acoplados y relaciones que normalmente permanecen ocultas hasta que alguien dedica semanas a estudiar la base de código.

La instalación es bastante sencilla. El proyecto recomienda utilizar `uv` o `pipx`, ya que el paquete publicado en PyPI se llama `graphifyy`, aunque el comando disponible en la terminal es simplemente `graphify`. Una vez instalado, basta con ejecutar Graphify desde la raíz del repositorio para que analice el proyecto completo y genere una carpeta llamada `graphify-out`. Allí aparecen tres archivos fundamentales: un `graph.html` con una visualización interactiva, un `GRAPH_REPORT.md` que resume los principales hallazgos de la arquitectura y un `graph.json` que almacena el grafo completo para consultas posteriores sin necesidad de volver a procesar todo el código.

A partir de ese momento comienza la parte realmente interesante. Es posible realizar consultas como identificar el recorrido completo del sistema de autenticación, descubrir qué componentes conectan dos servicios aparentemente independientes, explicar el propósito de un módulo específico o calcular el camino más corto entre distintas piezas de la aplicación. Para quienes trabajan con asistentes como Claude Code, Codex, Cursor, Gemini CLI u OpenCode, el beneficio es inmediato: el asistente deja de explorar el proyecto como una colección de archivos aislados y empieza a razonar sobre la estructura completa del sistema.

Graphify también permite exportar el conocimiento generado hacia distintos formatos. Puede producir documentación tipo wiki, vaults para Obsidian, GraphML para herramientas de análisis, exportaciones compatibles con Neo4j o FalkorDB e incluso exponer el grafo mediante un servidor MCP para que otros asistentes puedan consultarlo de forma remota. Esto convierte al proyecto en algo más que un visualizador de dependencias; funciona como una capa de conocimiento reutilizable para equipos completos.

Otro detalle interesante es que el procesamiento del código mediante Tree-sitter se realiza localmente. Cuando se utilizan modelos de lenguaje, estos intervienen principalmente para enriquecer documentación, archivos PDF, imágenes y otros contenidos semánticos, reduciendo la necesidad de enviar el código fuente completo a servicios externos. Además, Graphify admite múltiples proveedores de IA, desde OpenAI y Anthropic hasta Gemini, Ollama, Azure o Amazon Bedrock, por lo que resulta relativamente sencillo adaptarlo a distintos entornos de trabajo.

Naturalmente tiene algunas limitaciones. En proyectos extremadamente grandes, con miles de nodos, la visualización HTML puede volverse pesada y conviene trabajar directamente sobre el archivo `graph.json` o mediante el servidor MCP. También es importante configurar correctamente el archivo `.graphifyignore` para evitar indexar directorios generados automáticamente, dependencias externas o archivos que no aportan valor al análisis.

# Guía completa de Graphify: instalación y uso paso a paso

## Paso 1: Instalar Graphify

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

---

## Paso 2: Elegir el proyecto

Ubicate en la carpeta raíz del proyecto.

Por ejemplo:

```bash
cd ~/Proyectos/MiAplicacion
```

o en Windows:

```powershell
cd C:\Proyectos\MiAplicacion
```

Lo importante es ejecutar Graphify desde el directorio principal del repositorio.

---

## Paso 3: Generar el grafo

Ahora simplemente ejecutamos:

```bash
graphify .
```

El punto (`.`) indica que debe analizar el directorio actual.

Dependiendo del tamaño del proyecto, este proceso puede tardar desde unos segundos hasta varios minutos.

Durante el análisis Graphify:

- Lee el código fuente.
- Analiza la documentación.
- Detecta clases y funciones.
- Encuentra relaciones entre módulos.
- Construye un grafo interno.
- Genera documentación automática.

---

## Paso 4: Revisar los resultados

Al finalizar aparecerá una carpeta nueva:

```
graphify-out/
```

Dentro encontraremos algo similar a esto:

```
graphify-out/
│
├── graph.html
├── graph.json
├── GRAPH_REPORT.md
└── ...
```

Cada archivo tiene un propósito diferente.

### graph.html

Es la visualización interactiva.

Puede abrirse directamente desde el navegador.

Allí es posible:

- recorrer nodos;
- acercar o alejar el grafo;
- ver relaciones;
- descubrir dependencias;
- identificar componentes centrales.

Es probablemente la forma más intuitiva de comenzar a explorar un proyecto desconocido.

---

### GRAPH_REPORT.md

Es un informe generado automáticamente.

Incluye observaciones como:

- componentes principales;
- módulos muy acoplados;
- posibles "God Objects";
- relaciones importantes;
- resumen de la arquitectura.

Muchas veces este documento permite comprender un proyecto antes incluso de abrir el código.

---

### graph.json

Es el corazón del sistema.

Contiene todo el grafo estructurado.

Este archivo será utilizado posteriormente por Graphify para responder consultas sin tener que volver a analizar todo el proyecto.

---

# Paso 5: Realizar consultas

Una vez generado el grafo ya pueden hacerse preguntas.

Por ejemplo:

```bash
graphify query "Explain the authentication flow"
```

o

```bash
graphify query "How does UserService interact with the database?"
```

También:

```bash
graphify explain UserService
```

o

```bash
graphify path UserService DatabasePool
```

Estas consultas utilizan el grafo previamente construido, por lo que son mucho más rápidas que volver a recorrer todo el repositorio.

---

# Paso 6: Comprender dependencias

Uno de los usos más interesantes consiste en responder preguntas como:

- ¿Qué llama a esta función?
- ¿Quién depende de este módulo?
- ¿Qué servicios utilizan esta clase?
- ¿Qué ocurre si elimino este componente?
- ¿Cuál es el recorrido completo de una petición HTTP?

En proyectos grandes estas respuestas suelen requerir horas de navegación manual.

Graphify las obtiene recorriendo las relaciones del grafo.

---

# Paso 7: Exportar documentación

Graphify permite generar distintos formatos.

Por ejemplo:

```bash
graphify . --wiki
```

Genera documentación estilo Wiki.

También:

```bash
graphify . --obsidian
```

Produce un Vault listo para Obsidian.

O bien:

```bash
graphify . --graphml
```

Para importar el grafo en Gephi u otras herramientas de análisis.

También existen exportaciones compatibles con Neo4j y FalkorDB.

---

# Paso 8: Compartir el grafo con el equipo

Una práctica recomendada consiste en incluir la carpeta:

```
graphify-out
```

dentro del repositorio para que otros desarrolladores puedan reutilizar el análisis.

De esta forma no todos necesitan reconstruir el grafo desde cero.

---

# Paso 9: Instalar el Git Hook

Graphify puede actualizar automáticamente el grafo cuando cambia el proyecto.

Para ello:

```bash
graphify hook install
```

Cada vez que se realicen commits importantes el grafo podrá mantenerse sincronizado.

---

# Paso 10: Utilizar Graphify con asistentes de IA

Aquí aparece una de sus mayores fortalezas.

Una vez generado el grafo, asistentes como:

- Claude Code
- Cursor
- Codex
- Gemini CLI
- OpenCode

pueden consultar directamente la estructura del proyecto.

Esto cambia completamente la calidad de las respuestas.

En lugar de intentar deducir relaciones leyendo archivos aislados, el asistente dispone de un modelo estructurado de toda la arquitectura.

Como consecuencia puede responder preguntas mucho más complejas con menos contexto.

---

# Configurar proveedores de IA

Si se desea enriquecer el análisis mediante modelos de lenguaje, basta con definir la clave correspondiente.

Por ejemplo:

```bash
export OPENAI_API_KEY=tu_api_key
```

o

```bash
export ANTHROPIC_API_KEY=tu_api_key
```

También existe soporte para:

- Gemini
- Ollama
- Azure OpenAI
- Amazon Bedrock

Si únicamente se analiza código fuente, muchas funcionalidades continúan funcionando gracias a Tree-sitter sin necesidad de utilizar un modelo externo.

---

# Ignorar archivos innecesarios

Al igual que Git utiliza `.gitignore`, Graphify dispone de `.graphifyignore`.

Allí conviene excluir directorios como:

```
node_modules
dist
build
target
coverage
vendor
```

Esto acelera considerablemente el análisis.

---

# ¿Cuándo conviene usar Graphify?

Es especialmente útil cuando existen:

- monorepos;
- múltiples microservicios;
- varios repositorios relacionados;
- abundante documentación técnica;
- proyectos heredados;
- equipos grandes;
- onboarding de nuevos desarrolladores;
- auditorías de arquitectura.

En proyectos pequeños probablemente el beneficio sea menor, pero a medida que aumenta el tamaño del sistema el valor del grafo crece rápidamente.

