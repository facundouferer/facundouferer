# Spec: Presentación Interactiva — Algoritmos: Especificación, Verificación y Complejidad

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/23-algoritmia-verificacion-y-complejidad`
  - Archivo de lección: `src/content/courses/java/23-algoritmia-verificacion-y-complejidad.es.md`
  - Slug de la lección: `23-algoritmia-verificacion-y-complejidad`
- **Slug de la presentación**: `algoritmia-verificacion-complejidad-java`
- **Archivo de componente**: `src/components/presentaciones/algoritmia-verificacion-complejidad-java.astro`
- **Asset de tarjeta**: `/img/presentations/algoritmia-verificacion-complejidad-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Algoritmia: Especificación, Invariantes y Big-O', en: 'Algorithms: Specification, Invariants, and Big-O' }`
  - `description`: `{ es: 'Tripletas de Hoare, invariantes de bucle paso a paso y curvas de complejidad asintótica.', en: 'Hoare triples, step-by-step loop invariants, and asymptotic complexity curves.' }`
  - `lesson`: `{ course: 'java', slug: '23-algoritmia-verificacion-y-complejidad' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

La verificación formal y el análisis de algoritmos proveen el rigor necesario para diseñar software predecible y escalable:
- Visualizar la **Tripleta de Hoare $\{P\} C \{Q\}$**: el contrato formal entre precondición, comando y postcondición.
- Demostrar el poder de los **Invariantes de Bucle** mediante la división gráfica de arreglos en tres zonas: la zona ya procesada/invariante, la celda en inspección y la zona pendiente.
- Contrastar las curvas de crecimiento temporal de la notación **Big-O** ($O(1), O(\log N), O(N), O(N \log N), O(N^2), O(2^N)$) en un gráfico interactivo.
- Demostrar la diferencia entre corrección parcial (no da respuestas erróneas) y corrección total (garantiza terminación sin bucles infinitos).

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: La Tripleta de Hoare $\{P\} C \{Q\}$ — El Contrato Matemático
- **Aspecto conceptual**: Si la precondición $P$ es verdadera antes de ejecutar el bloque $C$, entonces la postcondición $Q$ será indefectiblemente verdadera al terminar.
- **Gráfica requerida (SVG)**:
  - Túnel de transformación formal:
    - Entrada (Compuerta Verde): Precondición $P$ (ej. `n >= 0`). Si el dato no cumple, la compuerta se cierra (excepción previa / `IllegalArgumentException`).
    - Cámara de ejecución: Bloque $C$ (código del algoritmo).
    - Salida (Compuerta Azul): Postcondición $Q$ (ej. `resultado == n!`).

### Slide 2: Invariantes de Bucle — El estado que nunca se rompe
- **Aspecto conceptual**: Una afirmación lógica que es verdadera: 1. Antes de iniciar el bucle, 2. Al final de cada iteración, y 3. Al terminar el bucle, garantizando la postcondición.
- **Gráfica requerida (SVG interactivo)**:
  - Un arreglo visual dividido en franjas cromáticas:
    - Franja Verde (Izquierda): `[0 .. i-1]` -> Elementos ya ordenados y procesados (Invariante satisfecho).
    - Franja Terracota (Centro): `i` -> Elemento activo siendo evaluado.
    - Franja Gris (Derecha): `[i+1 .. n-1]` -> Elementos pendientes de procesar.
- **Interacción paso a paso**: Botón "Avanzar iteración" que desliza el puntero `i` hacia la derecha, expandiendo la zona verde protegida por el invariante hasta cubrir todo el arreglo.

### Slide 3: Corrección Total y Función Cota (Terminación)
- **Aspecto conceptual**: La función variante o de cota entera positiva que decrece estrictamente en cada iteración y garantiza que el bucle no entra en loop infinito.
- **Gráfica requerida (SVG)**:
  - Una barra de progreso descendente con valor $V = n - i$. En cada iteración $V$ cae ($V \to 0$). Al alcanzar cero, el bucle se detiene físicamente.

### Slide 4: El Gráfico Interactivo de Notación Big-O
- **Aspecto conceptual**: Cómo escala el tiempo de ejecución a medida que el tamaño de entrada $N$ crece hacia el infinito.
- **Gráfica requerida (Gráfico cartesiano interactivo)**:
  - Eje X: Tamaño de entrada $N$ ($10$ a $1.000.000$). Eje Y: Operaciones / Tiempo.
  - Curvas trazadas con estética Organic:
    - Verde: $O(1)$ constante y $O(\log N)$ logarítmica.
    - Sage: $O(N)$ lineal y $O(N \log N)$ quasi-lineal.
    - Terracota: $O(N^2)$ cuadrática.
    - Rojo vibrante: $O(2^N)$ exponencial (despegue vertical explosivo).
- **Interacción**: Slider para mover $N$ y ver cómo $N^2$ explota en millones de operaciones mientras $\log N$ apenas sube a 20 operaciones.

### Slide 5: Casos de Análisis: Mejor, Peor y Caso Promedio
- **Aspecto conceptual**: Por qué un algoritmo no tiene una única velocidad. Ejemplo: Búsqueda lineal ($O(1)$ mejor caso si está al principio, $O(N)$ peor caso si no existe).
- **Gráfica requerida (SVG)**:
  - Tres escenarios visuales animados para una búsqueda:
    - Escenario 1 (Mejor): Elemento encontrado en índice 0 (1 comparación).
    - Escenario 2 (Promedio): Elemento en la mitad del arreglo ($N/2$ comparaciones).
    - Escenario 3 (Peor): Elemento ausente ($N$ comparaciones completas).

---

## 4. Estilo y Tokens de Diseño Organic
- Gráficos claros, ejes cartesianos suaves sin líneas duras, paleta Organic conforme a `DESIGN.md`.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/23-algoritmia-verificacion-y-complejidad`
- **WHEN** un alumno utiliza la presentación
- **THEN** puede experimentar la verificación de invariantes en el arreglo segmentado y comparar el crecimiento asintótico de las funciones en el gráfico Big-O interactivo.
