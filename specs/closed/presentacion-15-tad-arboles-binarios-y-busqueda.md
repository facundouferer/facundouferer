# Spec: Presentación Interactiva — TAD Árboles Binarios y de Búsqueda (ABB) en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/15-tad-arboles-binarios-y-busqueda`
  - Archivo de lección: `src/content/courses/java/17-tad-arboles-binarios-y-busqueda.es.md`
  - Slug de la lección: `15-tad-arboles-binarios-y-busqueda`
- **Slug de la presentación**: `tad-arboles-binarios-busqueda-java`
- **Archivo de componente**: `src/components/presentaciones/tad-arboles-binarios-busqueda-java.astro`
- **Asset de tarjeta**: `/img/presentations/tad-arboles-binarios-busqueda-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'TAD Árboles Binarios y Búsqueda (ABB) en Java', en: 'Binary Trees and BST in Java' }`
  - `description`: `{ es: 'Recorridos DFS/BFS, propiedad ABB, inserción y eliminación con simulador de árbol interactivo.', en: 'DFS/BFS traversals, BST invariant, insert and delete with interactive tree simulator.' }`
  - `lesson`: `{ course: 'java', slug: '15-tad-arboles-binarios-y-busqueda' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

Los árboles representan la entrada a las estructuras no lineales y jerárquicas:
- Visualizar claramente la terminología anatómica: Raíz, ramas, hojas, niveles y altura.
- Animar los tres recorridos en profundidad (**Preorden**, **Inorden**, **Postorden**) mostrando simultáneamente el Stack de llamadas recursivas y la cinta de salida.
- Visualizar el recorrido en anchura (**BFS por niveles**) mostrando cómo la Cola orquesta el orden de visita.
- Proveer un **Simulador interactivo de Árbol Binario de Búsqueda (ABB)**: inserción paso a paso, búsqueda y el caso más complejo: **eliminación de un nodo con dos hijos** reemplazándolo por su sucesor inorden.
- Ilustrar el problema del desbalanceo y degradación a lista enlazada $O(N)$.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: Anatomía de un Árbol Binario
- **Aspecto conceptual**: Estructura jerárquica recursiva. Cada nodo tiene a lo sumo dos hijos: `izquierdo` y `derecho`.
- **Gráfica requerida (SVG interactivo)**:
  - Árbol binario de 7 nodos con etiquetas visuales:
    - Nodo superior: Etiqueta "Raíz" (Root).
    - Nodos sin descendientes: Etiqueta "Hojas" (Leaves).
    - Líneas horizontales segmentadas indicando Nivel 0, Nivel 1, Nivel 2.
    - Barra lateral indicando la Altura total ($H = 3$).
- **Interacción**: El usuario hace click en cualquier nodo para ver su subárbol izquierdo y derecho resaltados con sombras de color.

### Slide 2: Los 3 Recorridos en Profundidad (DFS)
- **Aspecto conceptual**:
  - Preorden (Raíz - Izq - Der): clonar o serializar la estructura.
  - Inorden (Izq - Raíz - Der): en un ABB entrega los elementos ordenados ascendentemente.
  - Postorden (Izq - Der - Raíz): cálculo de espacio en disco o destrucción segura de nodos hijos antes del padre.
- **Gráfica requerida (SVG animado con simulador)**:
  - Árbol con 7 números: `[50, 30, 70, 20, 40, 60, 80]`.
  - Cinta de salida que se va llenando con los números a medida que son visitados.
  - Pila de llamadas recursivas visible al costado (`recorrer(nodo)`).
- **Interacción**: Selector de modo (Preorden / Inorden / Postorden) con botón "Siguiente paso" para observar el movimiento del puntero y la generación de la lista resultante.

### Slide 3: Recorrido por Niveles (BFS) con una Cola
- **Aspecto conceptual**: Explorar nivel por nivel de arriba hacia abajo y de izquierda a derecha. Utiliza una estructura auxiliar FIFO (Cola).
- **Gráfica requerida (SVG)**:
  - El árbol arriba y una Cola horizontal abajo.
  - Animación: Se encola la raíz -> se desencola y se imprime -> se encolan sus hijos izquierdo y derecho -> se repite el ciclo.
  - Conexión visual clara entre el nodo que sale de la cola y el nodo que se ilumina en el árbol.

### Slide 4: Invariante del Árbol Binario de Búsqueda (ABB)
- **Aspecto conceptual**: Para todo nodo con clave $K$, todos los valores del subárbol izquierdo son menores que $K$, y todos los del subárbol derecho son mayores.
- **Gráfica requerida (SVG)**:
  - Conos de validez: Para un nodo con valor `50`, se sombrea en verde suave el cono izquierdo con la regla `< 50`, y el cono derecho con la regla `> 50`.
  - Demostración de búsqueda: buscando el número `65`, el puntero compara con `50` (va a la derecha), luego con `70` (va a la izquierda) y lo encuentra en 2 comparaciones ($O(\log N)$).

### Slide 5: Simulador de Inserción en ABB
- **Aspecto conceptual**: Búsqueda del hueco natural donde debe caer el nuevo nodo como una nueva hoja.
- **Gráfica requerida (Simulador interactivo)**:
  - Input para ingresar un número entero.
  - El nuevo nodo desciende rebotando: compara con cada nodo del camino hasta topar con un puntero `null`, donde se ancla y se enlaza.

### Slide 6: Eliminación en ABB — Los 3 casos
- **Aspecto conceptual**:
  - Caso 1: Nodo hoja (se elimina directamente apuntando el padre a `null`).
  - Caso 2: Nodo con 1 hijo (el padre del nodo pasa a apuntar directamente al único hijo).
  - Caso 3: Nodo con 2 hijos (se busca el sucesor inorden: el menor del subárbol derecho; se copia su valor y se elimina el sucesor).
- **Gráfica requerida (SVG paso a paso)**:
  - Demostración animada del Caso 3:
    - Queremos eliminar la raíz `50`.
    - Una lupa baja al subárbol derecho (`70`) y dobla a la izquierda hasta encontrar el mínimo (`60`).
    - El valor `60` asciende a la raíz reemplazando al `50`.
    - El nodo `60` original en la rama inferior es eliminado limpiamente.

### Slide 7: El problema del Desbalanceo
- **Aspecto conceptual**: Si insertás elementos ya ordenados (`10, 20, 30, 40, 50`), el árbol se degenera en una lista enlazada con altura $N$ y costo $O(N)$.
- **Gráfica requerida (SVG)**:
  - Comparativa lado a lado:
    - Izquierda: Árbol balanceado perfecto con 7 nodos (Altura = 3).
    - Derecha: Árbol degenerado con los mismos 7 nodos formando una línea diagonal continua (Altura = 7).
  - Introducción gráfica al concepto de rotación y árboles auto-balanceados (AVL / Red-Black).

---

## 4. Estilo y Tokens de Diseño Organic
- Nodos circulares con radio amplio, líneas de conexión suaves (`stroke-width="2.75"`).
- Resaltado de nodos visitados en Sage (`--color-accent-2`) y nodos en conflicto en Terracota (`--color-accent`).

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/15-tad-arboles-binarios-y-busqueda`
- **WHEN** el alumno ejecuta la presentación
- **THEN** puede probar los recorridos DFS/BFS y el algoritmo de eliminación con 2 hijos paso a paso.
