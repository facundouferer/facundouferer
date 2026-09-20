# Spec: Presentación Interactiva — Arrays de Objetos: Dos Niveles de Memoria en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/09-arrays-de-objetos`
  - Archivo de lección: `src/content/courses/java/09-arrays-de-objetos.es.md`
  - Slug de la lección: `09-arrays-de-objetos`
- **Slug de la presentación**: `arrays-de-objetos-java`
- **Archivo de componente**: `src/components/presentaciones/arrays-de-objetos-java.astro`
- **Asset de tarjeta**: `/img/presentations/arrays-de-objetos-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Arrays de Objetos: Doble Nivel de Memoria', en: 'Object Arrays: Two Levels of Memory in Java' }`
  - `description`: `{ es: 'El error de las casillas null, creación en dos pasos, capacidad vs cantidad y aliasing con diagramas de Heap.', en: 'The null slot trap, two-step creation, capacity vs size, and aliasing with Heap diagrams.' }`
  - `lesson`: `{ course: 'java', slug: '09-arrays-de-objetos' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

El paso de arrays primitivos a arrays de objetos es uno de los mayores saltos conceptuales en Java:
- Visualizar el **Doble Nivel de Memoria**: el array es un objeto en el Heap que no contiene personas o autos, sino *punteros/referencias* a otros objetos independientes en el Heap.
- Desarmar el error más común del novato: creer que `new Persona[5]` crea cinco personas (en realidad crea cinco casillas con valor `null`).
- Animar la **Creación en Dos Pasos**: 1. Crear el array contenedor, 2. Instanciar cada objeto y enlazarlo.
- Ilustrar el concepto de **Array Parcialmente Lleno**: separar la capacidad física del arreglo de la cantidad lógica real de elementos activos.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: Los Dos Niveles de Memoria en el Heap
- **Aspecto conceptual**: La variable en el Stack apunta al array. El array en el Heap contiene casillas con referencias que a su vez apuntan a cada instancia en el Heap.
- **Gráfica requerida (SVG interactivo)**:
  - Stack: Variable local `jugadores` con dirección `0x1000`.
  - Heap Nivel 1: Objeto array `Persona[3]` en `0x1000`. Sus 3 celdas contienen punteros: `0x5A00`, `0x5B00`, `0x5C00`.
  - Heap Nivel 2: Tres objetos independientes en memoria:
    - Objeto en `0x5A00`: `Persona("Messi", 10)`
    - Objeto en `0x5B00`: `Persona("Di María", 11)`
    - Objeto en `0x5C00`: `Persona("Dibu", 23)`
- **Interacción**: Al tocar una celda del array, se ilumina la flecha correspondiente hacia el objeto destino en el Heap.

### Slide 2: La Creación en Dos Pasos y la Trampa del `null`
- **Aspecto conceptual**:
  - Paso 1: `Persona[] plantel = new Persona[3];` -> El array nace con todas sus casillas en `null`.
  - Error típico: intentar hacer `plantel[0].getNombre()` antes del paso 2 produce `NullPointerException`.
  - Paso 2: `plantel[0] = new Persona("Lautaro");` -> Recién aquí se puebla la casilla.
- **Gráfica requerida (SVG)**:
  - Diagrama de las 3 casillas vacías con la etiqueta `null` en rojo.
  - Una mano intenta invocar un método sobre la casilla `[0]` y choca con un rayo eléctrico de `NullPointerException`.
  - Paso siguiente: el operador `new Persona(...)` coloca un puntero válido en la casilla y la llamada tiene éxito.

### Slide 3: Recorrer con Seguridad — El filtro contra nulos
- **Aspecto conceptual**: En un array que no está lleno al 100%, cualquier bucle `for` o `for-each` debe protegerse verificando `if (elem != null)`.
- **Gráfica requerida (SVG)**:
  - Array con 5 casillas: `[Objeto, Objeto, null, Objeto, null]`.
  - Cursor del bucle recorriendo: al detectar `null`, una compuerta lo saltea limpiamente sin ejecutar llamadas a métodos.

### Slide 4: Capacidad Física vs Cantidad Lógica
- **Aspecto conceptual**: Un array de tamaño 100 puede tener solo 4 elementos reales guardados. Una variable contadora `int cantidad = 4;` delimita los elementos válidos.
- **Gráfica requerida (SVG)**:
  - Array largo de 10 casillas:
    - Casillas `[0]` a `[3]` pintadas de verde con datos válidos (`cantidad = 4`).
    - Casillas `[4]` a `[9]` pintadas de gris translúcido (capacidad ociosa).
  - Animación de inserción: Al invocar `agregar(nuevo)`, se inserta en `plantel[cantidad]` y se incrementa `cantidad++`.
  - Alerta de desbordamiento: cuando `cantidad == capacidad`, el array se llena y se ilustra la técnica de duplicar capacidad con `Arrays.copyOf()`.

### Slide 5: Ordenar Arrays de Objetos — `Comparable` vs `Comparator`
- **Aspecto conceptual**: `Arrays.sort(plantel)` falla con `ClassCastException` a menos que los objetos implementen `Comparable` o se pase un `Comparator`.
- **Gráfica requerida (Simulador)**:
  - Array de jugadores desordenados por número de camiseta `[11, 23, 10]`.
  - Selector: "Ordenar por Camiseta" / "Ordenar alfabéticamente por Nombre".
  - Las flechas del array permutan sus direcciones hacia los objetos en el Heap, ordenando la lista sin clonar ningún objeto.

---

## 4. Estilo y Tokens de Diseño Organic
- Visualización multinivel clara, colores diferenciados para punteros en Stack y Heap, cumplimiento de `DESIGN.md`.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/09-arrays-de-objetos`
- **WHEN** un alumno explora la presentación
- **THEN** comprende el doble nivel de memoria en el Heap y la diferencia crítica entre capacidad y cantidad en arrays parcialmente llenos.
