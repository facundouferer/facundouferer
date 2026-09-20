# Spec: Presentación Interactiva — Arrays y Manejo de Strings en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/04-arrays-y-strings`
  - Archivo de lección: `src/content/courses/java/04-arrays-y-strings.es.md`
  - Slug de la lección: `04-arrays-y-strings`
- **Slug de la presentación**: `arrays-strings-memoria-java`
- **Archivo de componente**: `src/components/presentaciones/arrays-strings-memoria-java.astro`
- **Asset de tarjeta**: `/img/presentations/arrays-strings-memoria-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Arrays y Strings: Memoria y el Pool de Cadenas', en: 'Arrays and Strings: Memory and the Constant Pool' }`
  - `description`: `{ es: 'Memoria contigua, String Constant Pool en el Heap, la trampa de == vs equals y StringBuilder.', en: 'Contiguous memory, String Constant Pool in Heap, the == vs equals trap, and StringBuilder.' }`
  - `lesson`: `{ course: 'java', slug: '04-arrays-y-strings' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

La gestión de arrays y cadenas en Java suele ser fuente de errores masivos de rendimiento y lógica:
- Demostrar físicamente por qué el acceso a un array por índice es $O(1)$: la fórmula de cálculo de dirección base `dir = base + i * tamaño`.
- Graficar la trampa mortal de **`==` vs `.equals()`** en cadenas: entender qué es y dónde vive el **String Constant Pool** en el Heap.
- Ilustrar la **inmutabilidad de String**: cómo concatenar en un bucle con `+` crea cientos de objetos basura en el Heap.
- Mostrar el funcionamiento interno de **`StringBuilder`**: un buffer dinámico `char[]` que muta in-situ y duplica su capacidad cuando se llena.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: Memoria Contigua en Arrays — Por qué el índice 0
- **Aspecto conceptual**: Los elementos de un array viven pegados uno al lado del otro en la RAM.
- **Gráfica requerida (SVG)**:
  - Tira de celdas de memoria contiguas `[0]`, `[1]`, `[2]`, `[3]`, `[4]`.
  - Puntero base `0x2000`. Cada `int` mide 4 bytes.
  - Cálculo gráfico en vivo:
    - Índice 0: `0x2000 + 0 * 4 = 0x2000` (desplazamiento cero).
    - Índice 3: `0x2000 + 3 * 4 = 0x200C` (salto inmediato de hardware sin recorrer los elementos intermedios).
  - Alerta de borde: Intentar acceder a `[5]` choca con una barrera roja: `ArrayIndexOutOfBoundsException`.

### Slide 2: Matrices y Arrays Irregulares (Jagged Arrays)
- **Aspecto conceptual**: En Java no existen matrices cuadradas contiguas en C; una matriz es un array cuyos elementos son referencias a otros arrays independientes de longitudes dispares.
- **Gráfica requerida (SVG)**:
  - Vector principal vertical `matriz` de 3 casillas.
  - Cada casilla tiene una flecha hacia un array horizontal distinto en el Heap:
    - Fila 0 tiene 2 columnas: `[A, B]`
    - Fila 1 tiene 5 columnas: `[C, D, E, F, G]`
    - Fila 2 tiene 3 columnas: `[H, I, J]`
- **Interacción**: El usuario altera la longitud de cada fila dinámicamente observando cómo cada fila es un objeto autónomo.

### Slide 3: Inmutabilidad de String — El texto grabado en piedra
- **Aspecto conceptual**: Un objeto `String` jamás puede modificarse. Cualquier método como `.toUpperCase()` o `+` crea un nuevo objeto en el Heap.
- **Gráfica requerida (SVG)**:
  - `String s1 = "hola";` apunta al objeto `"hola"` en el Heap.
  - Se ejecuta `s1.toUpperCase();`.
  - Se crea un nuevo objeto `"HOLA"` flotando en el Heap, pero `s1` sigue apuntando a `"hola"` porque no se reasignó. El objeto `"HOLA"` cae al Garbage Collector si nadie lo guarda.

### Slide 4: El String Constant Pool — La trampa de `==` frente a `.equals()`
- **Aspecto conceptual**: Java optimiza memoria reutilizando literales idénticos en un área especial del Heap llamada String Constant Pool.
- **Gráfica requerida (SVG interactivo)**:
  - Dos zonas en el Heap: La memoria general y la piscina especial **String Constant Pool**.
  - Declaramos:
    - `String a = "java";` -> entra al Pool.
    - `String b = "java";` -> la JVM detecta que ya existe y apunta `b` a la misma dirección del Pool.
    - `String c = new String("java");` -> la palabra `new` fuerza un nuevo objeto fuera del pool.
  - Test interactivo:
    - ¿`a == b`? **TRUE** (ambos apuntan al mismo casillero del pool).
    - ¿`a == c`? **FALSE** (direcciones de memoria distintas en Stack).
    - ¿`a.equals(c)`? **TRUE** (el contenido de caracteres es idéntico).

### Slide 5: `StringBuilder` — La fábrica eficiente de texto
- **Aspecto conceptual**: Concatenar dentro de un bucle de 10.000 vueltas con `+` genera 10.000 objetos String intermedios, colapsando el Garbage Collector. `StringBuilder` muta un solo buffer.
- **Gráfica requerida (SVG)**:
  - Comparador de rendimiento:
    - Izquierda (Bucle con `String +=`): Una tormenta de objetos efímeros colapsando el Heap.
    - Derecha (Con `StringBuilder`): Una única caja con un arreglo interno `char[]` que expande su capacidad copiando bloques solo cuando se satura.
- **Interacción**: Deslizador de iteraciones para ver la comparativa de tiempo y memoria asignada.

---

## 4. Estilo y Tokens de Diseño Organic
- Visualizaciones con bloques suaves de memoria, paleta cálida y flechas de punteros redondeadas.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/04-arrays-y-strings`
- **WHEN** un alumno interactúa con la presentación
- **THEN** comprende visualmente la fórmula de direccionamiento de arrays, el aislamiento del String Pool y la superioridad de `StringBuilder`.
