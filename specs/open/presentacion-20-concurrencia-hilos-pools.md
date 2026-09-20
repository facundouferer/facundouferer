# Spec: Presentación Interactiva — Programación Concurrente: Hilos, Sincronización y Pools

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/19-programacion-concurrente-hilos-y-pools`
  - Archivo de lección: `src/content/courses/java/20-programacion-concurrente-hilos-y-pools.es.md`
  - Slug de la lección: `19-programacion-concurrente-hilos-y-pools`
- **Slug de la presentación**: `concurrencia-hilos-pools-java`
- **Archivo de componente**: `src/components/presentaciones/concurrencia-hilos-pools-java.astro`
- **Asset de tarjeta**: `/img/presentations/concurrencia-hilos-pools-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Hilos, Sincronización y Virtual Threads en Java', en: 'Threads, Synchronization, and Virtual Threads in Java' }`
  - `description`: `{ es: 'Stack vs Heap en el JMM, condiciones de carrera en count++, cerrojos synchronized, pools de hilos y Project Loom.', en: 'Stack vs Heap in JMM, count++ race conditions, synchronized locks, thread pools, and Project Loom.' }`
  - `lesson`: `{ course: 'java', slug: '19-programacion-concurrente-hilos-y-pools' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

La concurrencia es uno de los temas donde la intuición falla si no se visualiza lo que ocurre en hardware y memoria:
- Desmitificar la diferencia entre **Concurrencia** (gestión intercalada de tareas) y **Paralelismo** (ejecución simultánea en núcleos físicos).
- Ilustrar el **Java Memory Model (JMM)**: pilas privadas por hilo versus el Heap global compartido.
- Demostrar a nivel de micro-instrucciones por qué **`count++`** destruye datos en entornos concurrentes.
- Contrastar visualmente las soluciones: bloqueo con **`synchronized`**, visibilidad de caché con **`volatile`**, y operaciones atómicas sin bloqueo (**CAS** con `AtomicInteger`).
- Modelar el abrazo mortal (**Deadlock**) y las condiciones de Coffman.
- Explicar la evolución de los hilos de plataforma clásicos hacia los **Pools de `ExecutorService`** y los modernos **Virtual Threads (Project Loom)**.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: Concurrencia vs Paralelismo y el JMM (Stack vs Heap)
- **Aspecto conceptual**: Dos hilos pueden intercalarse en 1 CPU (*time-slicing*) o correr en paralelo en 2 núcleos. Cada hilo tiene su propio Stack, pero ambos leen y escriben en el mismo Heap.
- **Gráfica requerida (SVG de arquitectura de memoria)**:
  - Diagrama de hardware arriba: CPU Core 0 y CPU Core 1 con sus respectivas memorias caché L1/L2.
  - En la JVM:
    - Stack Hilo A (variables locales, marcos de función privados).
    - Stack Hilo B (variables locales, marcos de función privados).
    - Centro común: El **Heap** donde reside un objeto `Contador` en `0x4F10`. Las flechas de ambos hilos convergen en el mismo objeto.
- **Interacción**: Toggle entre modo "1 Core (Concurrente por turnos)" y "Multi-core (Paralelo simultáneo)" con indicadores de tiempo.

### Slide 2: Anatomía de una Condición de Carrera (*Race Condition* en `count++`)
- **Aspecto conceptual**: La instrucción Java `count++` no es atómica; son tres operaciones separadas: Lectura (`ILOAD`), Incremento (`IADD`), Escritura (`ISTORE`).
- **Gráfica requerida (SVG interactivo con línea temporal paso a paso)**:
  - Línea de tiempo paralela de Hilo 1 (naranja) e Hilo 2 (verde):
    - T0: Variable `count = 5` en Heap.
    - T1: Hilo 1 lee `5` a su registro local.
    - T2: Hilo 2 lee `5` a su registro local (¡antes de que Hilo 1 escriba!).
    - T3: Hilo 1 suma 1 (`6`) y escribe `count = 6`.
    - T4: Hilo 2 suma 1 a su valor (`6`) y escribe `count = 6`.
    - Resultado final: `count = 6` cuando debió ser `7`. Se perdió 1 actualización.
- **Interacción**: Simulador de "Ejecución Paso a Paso" donde el usuario avanza los pulsos de reloj y observa cómo se corrompe el valor.

### Slide 3: El Cerrojo Intrínseco (`synchronized`) vs Atómicos Hardware (CAS)
- **Aspecto conceptual**: 
  - `synchronized`: exclusión mutua basada en el monitor del objeto. Si el cerrojo está ocupado, el hilo se suspende (*BLOCKED*).
  - `AtomicInteger`: aprovecha la instrucción del procesador *Compare-And-Swap* (CAS), permitiendo concurrencia libre de bloqueos (*lock-free*).
- **Gráfica requerida (SVG comparativo)**:
  - Panel A: La cabina con cerradura (`synchronized`). Un hilo entra, cierra con llave roja. El segundo hilo queda en cola de espera.
  - Panel B: El loop CAS de `AtomicInteger`. Hilo intenta actualizar; si la memoria no cambió desde la lectura, el CPU intercambia el valor en un solo ciclo atómico; si cambió, reintenta inmediatamente.

### Slide 4: El Peligro del Deadlock y las Reglas de Prevención
- **Aspecto conceptual**: Bloqueo mutuo cuando dos o más hilos retienen un recurso mientras esperan el que tiene el otro.
- **Gráfica requerida (SVG de grafo cíclico)**:
  - Hilo A tiene el Lock 1 y pide el Lock 2.
  - Hilo B tiene el Lock 2 y pide el Lock 1.
  - Flechas circulares en rojo parpadeante formando un lazo cerrado irresoluble.
  - Demostración de la solución: **Orden canónico de adquisición**. Si ambos hilos siempre piden el Lock 1 antes que el Lock 2, el ciclo es físicamente imposible.

### Slide 5: De Platform Threads a Pools y Virtual Threads (Project Loom)
- **Aspecto conceptual**: Los hilos nativos del SO son pesados (~1 MB de memoria de stack, caros de crear). `ExecutorService` reutiliza un grupo fijo. Los *Virtual Threads* (Java 21) son ultraligeros y gestionados por la JVM.
- **Gráfica requerida (SVG evolutivo de 3 capas)**:
  - Capa 1: `new Thread()` manual (1 hilo Java = 1 hilo pesado del SO). Saturación rápida del sistema.
  - Capa 2: `ExecutorService` (Cola de tareas pendientes `BlockingQueue` que alimenta a 4 hilos fijos).
  - Capa 3: *Virtual Threads*. Miles de hilos virtuales montados dinámicamente sobre pocos hilos portadores (*carrier threads*). Si un hilo virtual se bloquea en I/O de red o disco, se desacopla sin bloquear el hilo nativo.
- **Interacción**: Gráfico interactivo que simula el consumo de RAM comparativo: 10.000 hilos tradicionales (~10 GB) vs 10.000 Virtual Threads (~15 MB).

---

## 4. Estilo y Tokens de Diseño Organic
- Esquema de colores de alerta y sincronización: `--color-accent` (terracotta) para hilos y bloqueos, `--color-accent-2` (sage) para estados seguros y atómicos.
- Tipografía Figtree para código y llamadas a métodos, Caprasimo para titulares.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/19-programacion-concurrente-hilos-y-pools`
- **WHEN** un estudiante interactúa con la presentación
- **THEN** comprende con exactitud por qué ocurre una condición de carrera en operaciones aparentemente atómicas y domina el funcionamiento de pools y Virtual Threads.
