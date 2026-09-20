# Spec: Presentación Interactiva — Java Collections Framework y Genéricos

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/13-java-collections-framework-y-genericos`
  - Archivo de lección: `src/content/courses/java/15-java-collections-framework-y-genericos.es.md`
  - Slug de la lección: `13-java-collections-framework-y-genericos`
- **Slug de la presentación**: `collections-framework-genericos-java`
- **Archivo de componente**: `src/components/presentaciones/collections-framework-genericos-java.astro`
- **Asset de tarjeta**: `/img/presentations/collections-framework-genericos-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Java Collections Framework y Genéricos', en: 'Java Collections Framework and Generics' }`
  - `description`: `{ es: 'Jerarquía completa, familias List/Set/Map/Queue y anatomía interna de HashMap con simulador de buckets.', en: 'Full hierarchy, List/Set/Map/Queue families, and internal HashMap anatomy with bucket simulator.' }`
  - `lesson`: `{ course: 'java', slug: '13-java-collections-framework-y-genericos' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

El Java Collections Framework (JCF) es el núcleo estándar de estructuras de datos en Java. Esta presentación busca:
- Proporcionar un mapa taxonómico interactivo de la jerarquía completa (`Collection`, `List`, `Set`, `Queue` y `Map`).
- Desmitificar los Genéricos demostrando visualmente cómo el compilador inserta chequeos de tipos y cómo opera el **Type Erasure** en el bytecode.
- Comparar las 4 familias en base a orden, duplicados y costo de acceso.
- Revelar el funcionamiento interno de **`HashMap`**: cálculo de hash, direccionamiento de cubetas (buckets), colisiones y transformación a árboles rojo-negro (Treeification).

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: El mapa taxonómico del Java Collections Framework
- **Aspecto conceptual**: La estructura de herencia entre interfaces (`Iterable` en la cima) y sus implementaciones concretas. Por qué `Map` es una jerarquía independiente.
- **Gráfica requerida (SVG interactivo)**:
  - Grafo jerárquico organizado por colores:
    - Nivel 1 (Azul/Sage): Interfaces fundamentales (`Collection`, `List`, `Set`, `Queue`, `Map`).
    - Nivel 2 (Terracota): Clases concretas (`ArrayList`, `LinkedList`, `HashSet`, `TreeSet`, `HashMap`, `TreeMap`, `ArrayDeque`, `PriorityQueue`).
- **Interacción**: Al pasar el mouse o hacer click en cualquier colección, se despliega una ficha técnica con: Orden de elementos, ¿Permite duplicados?, Complejidad de búsqueda/inserción.

### Slide 2: Genéricos — Adiós a los `ClassCastException` en runtime
- **Aspecto conceptual**: Tipado seguro en tiempo de compilación frente a las colecciones sin tipo de Java 1.4 (`List` vs `List<String>`).
- **Gráfica requerida (SVG)**:
  - Lado izquierdo: Lista cruda `List` recibiendo un `String`, un `Integer` y un `Date`. El error explota recién al castear en runtime con una animación de advertencia.
  - Lado derecho: Lista genérica `List<Usuario>` con un escudo protector en tiempo de compilación que rechaza de inmediato cualquier tipo incompatible antes de compilar.

### Slide 3: Las 4 Familias — Tabla de decisión visual interactiva
- **Aspecto conceptual**: Cuándo usar `List`, `Set`, `Map` o `Queue`.
- **Gráfica requerida (SVG)**:
  - Diagrama de decisión guiada (Árbol de preguntas):
    - "¿Necesitás pares clave-valor?" -> Sí: `Map` (¿Ordenado? `TreeMap`; ¿Rápido? `HashMap`).
    - "¿Necesitás elementos únicos?" -> Sí: `Set` (¿Orden de inserción? `LinkedHashSet`; ¿Orden natural? `TreeSet`; ¿Máxima velocidad? `HashSet`).
    - "¿Necesitás orden posicional e índices?" -> Sí: `List` (`ArrayList`).
    - "¿Es una cola de procesamiento?" -> Sí: `Queue` / `Deque` (`ArrayDeque`).
- **Interacción**: Filtro de preguntas que ilumina el camino hacia la estructura óptima.

### Slide 4: Anatomía Interna de `HashMap` — Cubetas (Buckets) y Hashing
- **Aspecto conceptual**: Cómo un `HashMap` logra acceso en tiempo constante promedio $O(1)$ usando un array de cubetas y la función hash.
- **Gráfica requerida (SVG interactivo)**:
  - Array principal de cubetas: `Node<K,V>[] table` con 16 posiciones (`0` a `15`).
  - Proceso de inserción:
    - Clave `"juan"` -> `hashCode()` genera un número entero (ej. `3254921`).
    - Operación bit a bit: `hash & (16 - 1) = 9`.
    - La clave y su valor se colocan en el bucket `[9]`.

### Slide 5: Manejo de Colisiones y Treeification (Árboles Rojo-Negro)
- **Aspecto conceptual**: Qué sucede cuando dos claves distintas caen en el mismo bucket; degradación a lista enlazada y optimización a `TreeNode` a partir de 8 colisiones (`TREEIFY_THRESHOLD`).
- **Gráfica requerida (SVG animado)**:
  - Bucket `[4]` recibiendo dos claves distintas con el mismo índice (colisión).
  - Se forma una lista enlazada dentro del bucket: `Nodo("clave1") -> Nodo("clave2")`.
  - Animación de colisión masiva: al llegar al 8vo elemento, la lista se transforma dinámicamente en un pequeño árbol balanceado rojo-negro, recuperando costo $O(\log N)$ en el peor caso.

### Slide 6: Simulador Interactivo de `HashMap`
- **Aspecto conceptual**: Insertar, buscar y eliminar claves en vivo viendo la distribución de los buckets.
- **Gráfica requerida (Simulador UI)**:
  - Formulario: Campo de clave (`String`) y valor (`String`), botón "Put", "Get", "Remove".
  - Grilla de 8 cubetas visuales. Al insertar una clave, se anima el cálculo del hash, se ilumina el bucket correspondiente y se añade el nodo.
  - Indicador de Factor de Carga (`loadFactor = 0.75`): si la cantidad de elementos supera el umbral, se visualiza el `resize()` duplicando el tamaño del array a 16.

### Slide 7: Type Erasure — La letra chica de los Genéricos
- **Aspecto conceptual**: Los genéricos existen solo para el compilador; en el bytecode se reemplazan por su límite (`Object` o la clase acotada) e inserción de casts automáticos.
- **Gráfica requerida (SVG)**:
  - Código Java fuente con `<T extends Comparable<T>>` frente al código Bytecode compilado donde `T` fue reemplazado por `Comparable`.
  - Explicación visual de por qué no se puede hacer `new T()` ni `new T[10]` en Java.

---

## 4. Estilo y Tokens de Diseño Organic
- Estructura limpia de nodos y tablas de cubetas con colores de acento terracota y sage.
- Cumplimiento estricto de accesibilidad e i18n bilingüe.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/13-java-collections-framework-y-genericos`
- **WHEN** un alumno explora la presentación
- **THEN** puede operar el simulador de `HashMap` para observar cómo se calculan los buckets y se resuelven las colisiones
- **AND** la jerarquía del JCF se comprende mediante el árbol de decisiones visual.
