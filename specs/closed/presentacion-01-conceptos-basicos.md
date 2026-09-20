# Spec: Presentación Interactiva — Conceptos Básicos, JVM y Tu Primer Programa en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/01-conceptos-basicos`
  - Archivo de lección: `src/content/courses/java/01-conceptos-basicos.es.md`
  - Slug de la lección: `01-conceptos-basicos`
- **Slug de la presentación**: `conceptos-basicos-jvm-java`
- **Archivo de componente**: `src/components/presentaciones/conceptos-basicos-jvm-java.astro`
- **Asset de tarjeta**: `/img/presentations/conceptos-basicos-jvm-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Conceptos Básicos, JVM y Tu Primer Programa', en: 'Basic Concepts, JVM, and Your First Program' }`
  - `description`: `{ es: 'El pipeline de compilación a bytecode, arquitectura interna de la JVM y anatomía de main().', en: 'Compilation pipeline to bytecode, internal JVM architecture, and anatomy of main().' }`
  - `lesson`: `{ course: 'java', slug: '01-conceptos-basicos' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

Para quien inicia en Java, la relación entre el archivo `.java`, el compilador `javac`, el archivo `.class` y la máquina virtual suele ser una caja negra. Esta presentación tiene como objetivo:
- Mostrar paso a paso el **Pipeline de Compilación y Ejecución**: del texto legible por humanos al Bytecode y de allí al código máquina nativo vía la JVM.
- Desarmar la arquitectura interna de la **Java Virtual Machine (JVM)**: ClassLoader, Bytecode Verifier, Execution Engine (Intérprete + JIT Compiler) y Garbage Collector.
- Analizar visualmente la signatura más famosa de la computación: `public static void main(String[] args)`, explicando la razón de cada palabra clave.
- Introducir las dos grandes zonas de memoria: el **Stack** de ejecución y el **Heap** de objetos.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: El Lema "Write Once, Run Anywhere" — ¿Cómo funciona de verdad?
- **Aspecto conceptual**: La independencia de plataforma gracias al Bytecode intermedio.
- **Gráfica requerida (SVG)**:
  - Diagrama de flujo de 3 etapas:
    1. Archivo fuente `HolaMundo.java` en texto claro.
    2. El compilador `javac` transforma el código en `HolaMundo.class` (Bytecode: instrucciones universales de la JVM).
    3. Tres máquinas distintas (Windows x86_64, macOS Apple Silicon ARM64, Linux Server): cada una tiene su propia JVM instalada que interpreta el mismo e idéntico `.class` traduciéndolo a sus instrucciones nativas de CPU.
- **Interacción**: Botón para cambiar de arquitectura (x86_64 a ARM64) y ver cómo el Bytecode no cambia, pero la JVM genera instrucciones ensamblador específicas para cada chip.

### Slide 2: Anatomía Interna de la JVM
- **Aspecto conceptual**: Componentes clave del runtime de Java.
- **Gráfica requerida (SVG)**:
  - Diagrama de bloques modulares:
    - **ClassLoader Subsystem**: Carga, enlace y verificación de clases.
    - **Runtime Data Areas**: Method Area, Heap, JVM Stacks, PC Registers, Native Method Stacks.
    - **Execution Engine**:
      - Intérprete (ejecución línea a línea rápida al arrancar).
      - Compilador JIT (Just-In-Time) detectando "hotspots" y compilando bucles críticos a código máquina ultrarrápido.
      - Garbage Collector (limpieza de objetos en desuso).
- **Interacción**: El usuario hace hover en cada bloque para iluminar su función y responsabilidades.

### Slide 3: Desglosando `public static void main(String[] args)`
- **Aspecto conceptual**: El punto de entrada obligatorio para aplicaciones independientes.
- **Gráfica requerida (SVG interactivo)**:
  - La declaración del método diseccionada en 5 fichas interactivas:
    - `public`: Accesible por la JVM desde fuera de cualquier paquete.
    - `static`: La JVM puede invocarlo sin necesidad de instanciar un objeto previo con `new`.
    - `void`: No devuelve ningún valor de retorno al SO (los errores se informan con excepciones o `System.exit()`).
    - `main`: El identificador canónico buscado por el cargador de la JVM.
    - `String[] args`: Vector de argumentos de línea de comandos pasados por el usuario.
- **Interacción**: Terminal interactiva simulada abajo. Al escribir `java MiApp archivo.txt 100`, se visualiza cómo se puebla el arreglo `args[0] = "archivo.txt"` y `args[1] = "100"`.

### Slide 4: Entrada y Salida Básica — `System.out` y `Scanner`
- **Aspecto conceptual**: Cómo fluyen los streams estándar `System.in`, `System.out` y `System.err`.
- **Gráfica requerida (SVG)**:
  - Tuberías de comunicación entre el proceso Java y la consola del sistema operativo.
  - La clase `Scanner` analizando un buffer de texto entrante token por token (`nextInt()`, `nextLine()`).

### Slide 5: Introducción al Stack y al Heap
- **Aspecto conceptual**: Dónde viven las variables primitivas locales frente a las instancias.
- **Gráfica requerida (SVG)**:
  - Columna izquierda: Pila de ejecución (Stack Frame de `main`) con variables `int edad = 25;` y `double saldo = 1500.0;`.
  - Columna derecha: El Heap (vacío de momento, preparando la transición hacia objetos y cadenas).

---

## 4. Estilo y Tokens de Diseño Organic
- Acorde a [`DESIGN.md`](file:///Users/facundouferer/Devs/facundouferer/DESIGN.md): Fondo `--color-bg`, tarjetas `--color-surface`, acento terracota y trazos `stroke-width="2.75"`.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/01-conceptos-basicos`
- **WHEN** un alumno explora su presentación
- **THEN** comprende visualmente el rol del bytecode, la JVM y la firma del método `main` con animaciones interactivas.
