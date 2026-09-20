# Spec: Presentación Interactiva — Grafos: Representación y Algoritmos en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/16-grafos-representacion-y-algoritmos`
  - Archivo de lección: `src/content/courses/java/18-grafos-representacion-y-algoritmos.es.md`
  - Slug de la lección: `16-grafos-representacion-y-algoritmos`
- **Slug de la presentación**: `grafos-algoritmos-java`
- **Archivo de componente**: `src/components/presentaciones/grafos-algoritmos-java.astro`
- **Asset de tarjeta**: `/img/presentations/grafos-algoritmos-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Grafos: Matriz, Lista, BFS, DFS y Dijkstra', en: 'Graphs: Matrix, List, BFS, DFS, and Dijkstra' }`
  - `description`: `{ es: 'Representación en memoria, recorridos BFS/DFS, Dijkstra y Floyd-Warshall con simulador de grafos interactivo.', en: 'Memory representation, BFS/DFS traversals, Dijkstra, and Floyd-Warshall with interactive graph simulator.' }`
  - `lesson`: `{ course: 'java', slug: '16-grafos-representacion-y-algoritmos' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

Los grafos son la estructura de datos más general y potente en la ingeniería de software:
- Contrastar visualmente las dos grandes representaciones en memoria: la **Matriz de Adyacencia** (tabla booleana/ponderada) y la **Lista de Adyacencia** (arreglo de listas enlazadas).
- Demostrar que **BFS** y **DFS** son el mismo algoritmo conceptual pero alimentados por estructuras de memoria diferentes: BFS usa una **Cola** (expansión por capas/olas) y DFS usa una **Pila** (inmersión en profundidad).
- Desarrollar un **Simulador interactivo del Algoritmo de Dijkstra**, visualizando la tabla de distancias tentativas y la relajación de aristas con una `PriorityQueue`.
- Ilustrar el algoritmo de **Floyd–Warshall**, animando la evolución de la matriz $D^{(k)}$ considerando nodos intermedios.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: El Lenguaje de los Grafos
- **Aspecto conceptual**: Conjunto de vértices $V$ y aristas $E$. Variaciones fundamentales: No dirigido vs Dirigido (Dígrafo), Ponderado (con pesos) vs No ponderado.
- **Gráfica requerida (SVG)**:
  - Grafo interactivo de 5 nodos (`A`, `B`, `C`, `D`, `E`) con aristas estilizadas según `DESIGN.md`.
  - Selector de modo:
    - Modo No Dirigido: Líneas simples entre nodos.
    - Modo Dirigido: Flechas con sentido de dirección.
    - Modo Ponderado: Etiquetas con costos/pesos (ej. distancias en km) sobre cada arista.

### Slide 2: Matriz de Adyacencia vs Lista de Adyacencia
- **Aspecto conceptual**: La elección crítica de memoria según la densidad del grafo (disperso vs denso).
- **Gráfica requerida (SVG interactivo)**:
  - Un mismo grafo de 4 vértices renderizado a la izquierda.
  - A la derecha, dos representaciones sincronizadas que se pueden alternar:
    - **Matriz de Adyacencia**: Cuadrícula $4 \times 4$ de números `0` y `1` (o pesos). Si existe arista $(A, C)$, la celda `[0][2]` brilla en color terracota.
    - **Lista de Adyacencia**: Array vertical de 4 casillas; cada casilla tiene una lista enlazada con sus vecinos directos (`A -> [B, C]`).
- **Interacción**: El usuario agrega o quita una arista en el grafo y observa en tiempo real cómo se actualiza la matriz o la lista.

### Slide 3: BFS (Breadth-First Search) — La onda expansiva
- **Aspecto conceptual**: Explora los nodos por capas de cercanía desde el origen. Garantiza el camino con menor cantidad de saltos. Emplea una Cola FIFO.
- **Gráfica requerida (SVG con simulador paso a paso)**:
  - Grafo con 7 nodos y una Cola horizontal en la parte inferior.
  - Código de colores de estados:
    - Gris: No visitado.
    - Terracota (`--color-accent`): Encolado / En proceso.
    - Sage (`--color-accent-2`): Visitado y cerrado.
  - La onda expansiva de BFS se dibuja como círculos concéntricos de nivel: Nivel 0 (origen), Nivel 1 (vecinos inmediatos), Nivel 2 (vecinos de vecinos).
- **Interacción**: Botón "Siguiente paso" que desencola el nodo actual, ilumina sus vecinos no visitados y los agrega a la cola.

### Slide 4: DFS (Depth-First Search) — El hilo de Ariadna
- **Aspecto conceptual**: Avanza por una rama hasta el fondo antes de retroceder (backtracking). Emplea una Pila LIFO o recursión en el Call Stack.
- **Gráfica requerida (SVG)**:
  - El mismo grafo de 7 nodos, pero con una Pila vertical en lugar de una cola.
  - Animación del camino que avanza hasta topar con un callejón sin salida, y el retroceso (backtracking) volviendo al nodo previo para intentar otra rama.

### Slide 5: Algoritmo de Dijkstra — El camino más corto con pesos
- **Aspecto conceptual**: Caminos mínimos desde un nodo fuente en grafos con pesos no negativos. Utiliza relajación de aristas y una cola de prioridad (`PriorityQueue`).
- **Gráfica requerida (Simulador completo)**:
  - Grafo de 6 nodos con pesos (`A` origen, `F` destino).
  - Tabla de distancias tentativas:
    | Nodo | Distancia mínima tentativa | Nodo previo | Visitado |
  - Caja visual de la `PriorityQueue` conteniendo pares `(nodo, distancia)`.
- **Interacción paso a paso**:
  - En cada paso se extrae el nodo con menor distancia tentativa.
  - Se relajan sus aristas salientes: si `dist[u] + peso < dist[v]`, la tabla se actualiza en verde y se encola el nuevo valor.
  - Al llegar a `F`, se traza en color terracota intenso el camino óptimo reconstruido desde el destino hacia el origen usando los nodos previos.

### Slide 6: Algoritmo de Floyd–Warshall — Todos contra todos
- **Aspecto conceptual**: Caminos mínimos entre todos los pares de vértices en $O(V^3)$. Programación dinámica evaluando cada nodo intermedio $K$.
- **Gráfica requerida (SVG)**:
  - Matriz de distancias $D^{(k)}$ evolucionando en 4 pasos.
  - Visualización de la comparación fundamental:
    `D[i][j] = Math.min(D[i][j], D[i][k] + D[k][j])`
  - Cuadrantes iluminados mostrando la fila $i$, la columna $j$ y la intersección con el nodo pivote $k$.

---

## 4. Estilo y Tokens de Diseño Organic
- Nodos circulares con tipografía Figtree en negrita, aristas con terminaciones redondeadas, sin flechas afiladas ni estética de ingeniería dura.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/16-grafos-representacion-y-algoritmos`
- **WHEN** un alumno interactúa con la presentación
- **THEN** puede alternar entre Matriz y Lista de Adyacencia en tiempo real y ejecutar el simulador de Dijkstra paso a paso para ver la relajación de aristas.
