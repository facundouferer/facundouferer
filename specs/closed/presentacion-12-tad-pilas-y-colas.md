# Spec: Presentación Interactiva — TAD Pila y TAD Cola en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/12-tad-pilas-y-colas`
  - Archivo de lección: `src/content/courses/java/14-tad-pilas-y-colas.es.md`
  - Slug de la lección: `12-tad-pilas-y-colas`
- **Slug de la presentación**: `tad-pilas-colas-java`
- **Archivo de componente**: `src/components/presentaciones/tad-pilas-colas-java.astro`
- **Asset de tarjeta**: `/img/presentations/tad-pilas-colas-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'TAD Pila (LIFO) y TAD Cola (FIFO) en Java', en: 'Stack (LIFO) and Queue (FIFO) ADTs in Java' }`
  - `description`: `{ es: 'Estructuras lineales, cola circular con aritmética modular y balanceo de expresiones con simuladores.', en: 'Linear data structures, circular queue with modular arithmetic, and expression balancing simulators.' }`
  - `lesson`: `{ course: 'java', slug: '12-tad-pilas-y-colas' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

Las pilas y colas imponen disciplinas de acceso restringidas fundamentales en computación:
- Visualizar la disciplina **LIFO** (Last In, First Out) mediante una pila física vertical donde solo el tope es accesible.
- Visualizar la disciplina **FIFO** (First In, First Out) mediante una fila horizontal con extremos separados de entrada (tail) y salida (head).
- Explicar visual y matemáticamente el funcionamiento de la **Cola Circular en Arrays** usando el operador módulo (`%`).
- Proporcionar un **Simulador interactivo del algoritmo de balanceo de paréntesis/llaves/corchetes**, observando la pila reaccionar en tiempo real frente a cada caracter.
- Modelar una **Simulación de eventos discretos con dos colas**, visualizando la atención concurrente en un sistema.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: La Pila (LIFO) — La metáfora física del tubo y platos
- **Aspecto conceptual**: Solo se puede acceder, insertar (`push`) y extraer (`pop`) por un único punto: el `tope` (top).
- **Gráfica requerida (SVG interactivo)**:
  - Estructura vertical con paredes laterales.
  - Bloques numerados apilándose desde el fondo: `[10]`, `[20]`, `[30]`.
  - Puntero `tope` señalando al elemento superior.
  - Operaciones:
    - `push(40)`: Un nuevo bloque desciende desde arriba y se posa sobre el 30. El puntero `tope` sube.
    - `pop()`: El bloque superior se eleva y sale del tubo. El puntero `tope` baja.
    - `peek()`: Una lupa ilumina el elemento superior sin removerlo.
- **Interacción**: Botones `push()`, `pop()` y `peek()` para que el usuario manipule la pila y experimente con el desbordamiento (`StackOverflow`) y subdesbordamiento (`EmptyStackException`).

### Slide 2: La Cola (FIFO) — La fila de atención honesta
- **Aspecto conceptual**: Inserción por el extremo trasero (`enqueue` / `offer`) y extracción por el extremo delantero (`dequeue` / `poll`).
- **Gráfica requerida (SVG interactivo)**:
  - Tubo horizontal con flujo de izquierda a derecha.
  - Puntero `frente` en el extremo de salida y puntero `fin` en el extremo de entrada.
  - Al desencolar, el elemento al frente sale. Al encolar, un nuevo elemento entra por el fin.

### Slide 3: Cola Circular sobre Array — La magia del operador módulo (`%`)
- **Aspecto conceptual**: En un array lineal tradicional, al desencolar quedan celdas vacías al inicio que se desperdician. La cola circular reutiliza el espacio envolviendo los índices con `(fin + 1) % capacidad`.
- **Gráfica requerida (SVG)**:
  - Diagrama en forma de reloj circular con 8 posiciones (`[0]` a `[7]`).
  - Punteros `frente` y `fin` orbitando alrededor del círculo.
  - Visualización del cálculo matemático paso a paso: cuando `fin == 7`, la siguiente inserción calcula `(7 + 1) % 8 = 0`, reutilizando la celda 0 vacía.
- **Interacción**: Simulador de cola circular donde el alumno encola y desencola viendo cómo los punteros giran continuamente en el anillo.

### Slide 4: Casos de uso en el mundo real
- **Aspecto conceptual**: Dónde vive cada estructura en la arquitectura de software moderna.
- **Gráfica requerida (SVG)**:
  - Dos paneles comparativos:
    - **Pila en acción**: El Call Stack de la JVM y el historial de "Deshacer / Rehacer" (Ctrl+Z / Ctrl+Y) en un editor de texto.
    - **Cola en acción**: Cola de mensajes (RabbitMQ/Kafka), buffer de paquetes de red del router y spooler de impresión del SO.

### Slide 5: Simulador del Algoritmo de Expresiones Balanceadas
- **Aspecto conceptual**: Determinar si una cadena con `()`, `[]`, `{}` está bien anidada. Regla: aperturas van a la pila; cierres deben coincidir con el tope.
- **Gráfica requerida (SVG y motor interactivo)**:
  - Selector de expresiones:
    - Caso válido: `"{ [ ( a + b ) * c ] }"`
    - Caso inválido 1 (cierre cruzado): `"{ [ ( ] ) }"`
    - Caso inválido 2 (apertura sobrante): `"{ [ ( ) ]"`
    - Entrada personalizada por el usuario.
  - Tira de caracteres con cabezal de lectura que avanza uno a uno.
  - Pila lateral que muestra los símbolos empujados y desapilados.
  - Alerta visual verde (Balanceado) o roja con el motivo del fallo (ej. "Se esperaba ']' pero se encontró ')'").

### Slide 6: Simulación de Eventos Discretos — Dos colas de atención
- **Aspecto conceptual**: Modelado de un sistema real (banco o peaje) con colas independientes, tiempos de llegada y despacho.
- **Gráfica requerida (SVG)**:
  - Dos cajas de atención: Caja 1 (Atención rápida) y Caja 2 (Atención general).
  - Cola de clientes visualizada como avatares Organic avanzando en el tiempo simulado ($T = 0, 1, 2, \dots$).
  - Gráfico de métricas en tiempo real: Tiempo promedio de espera, Clientes atendidos, Ocupación de cada caja.

---

## 4. Estilo y Tokens de Diseño Organic
- Geometría circular orgánica para la cola circular, colores tierra y sage.
- Elementos interactivos con botones táctiles claros y soporte de teclado.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/12-tad-pilas-y-colas`
- **WHEN** el alumno interactúa con el simulador de balanceo de expresiones
- **THEN** puede ingresar o seleccionar una expresión y ver paso a paso cómo la pila valida o rechaza la estructura
- **AND** la cola circular demuestra visualmente la vuelta al índice 0 mediante `%`.
