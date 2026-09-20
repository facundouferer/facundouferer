# Spec: Presentación Interactiva — Árboles N-arios y Representación con Vectores en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/26-arboles-n-arios-y-representacion-con-vectores`
  - Archivo de lección: `src/content/courses/java/26-arboles-n-arios-y-representacion-con-vectores.es.md`
  - Slug de la lección: `26-arboles-n-arios-y-representacion-con-vectores`
- **Slug de la presentación**: `arboles-n-arios-vectores-java`
- **Archivo de componente**: `src/components/presentaciones/arboles-n-arios-vectores-java.astro`
- **Asset de tarjeta**: `/img/presentations/arboles-n-arios-vectores-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Árboles N-arios y Representación con Vectores', en: 'N-ary Trees and Vector Representation in Java' }`
  - `description`: `{ es: 'Transformación Primer Hijo - Siguiente Hermano (LCRS) y vector de padres con animador interactivo.', en: 'Left-Child Right-Sibling (LCRS) transformation and parent vector with interactive animator.' }`
  - `lesson`: `{ course: 'java', slug: '26-arboles-n-arios-y-representacion-con-vectores' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

Los árboles generales (donde un nodo puede tener una cantidad ilimitada de hijos, como un sistema de archivos o el DOM) plantean problemas de memoria si se usan punteros fijos. Esta presentación busca:
- Visualizar el problema del "grado variable": por qué reservar un arreglo de tamaño fijo para hijos desperdicia memoria en hojas y restringe la flexibilidad.
- Explicar y animar paso a paso la **Transformación Primer Hijo / Siguiente Hermano (LCRS)**: cómo convertir cualquier árbol N-ario en un árbol binario estricto sin perder información estructural.
- Demostrar la **Representación compacta con Vector de Padres**: un simple array unidimensional `padre[i]` que codifica toda la topología del árbol en memoria contigua.
- Comparar los costos de subir hacia la raíz ($O(1)$ en vector de padres) frente a listar los hijos ($O(N)$ en vector de padres vs $O(1)$ en lista de hijos).

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: Árboles N-arios — El modelo del mundo real
- **Aspecto conceptual**: A diferencia de los árboles binarios, los nodos pueden tener $0, 1, 2, \dots, K$ hijos (árbol de directorios, jerarquía de etiquetas HTML/XML, categorías y subcategorías).
- **Gráfica requerida (SVG)**:
  - Diagrama de un árbol general de carpetas:
    - Raíz: `/`
    - Hijos de `/`: `bin`, `home`, `etc`, `var` (4 hijos).
    - Hijos de `home`: `facundo`, `invitado` (2 hijos).
    - Hijos de `etc`: `nginx`, `ssh`, `hosts`, `resolv.conf`, `ssl` (5 hijos).
  - Resaltar la asimetría de grados entre nodos.

### Slide 2: El Dilema de Implementación — Arrays de hijos vs Punteros
- **Aspecto conceptual**:
  - Opción A: Cada nodo tiene `Nodo[] hijos = new Nodo[MAX]`. Desperdicio brutal de memoria en nodos hoja que no tienen hijos ($MAX \times \text{memoria vacía}$).
  - Opción B: Cada nodo tiene `List<Nodo> hijos`. Excelente flexibilidad, pero sobrecarga de objetos `ArrayList` o `LinkedList` por cada nodo.
- **Gráfica requerida (SVG)**:
  - Comparativa de huella de memoria en el Heap para ambas opciones, ilustrando las celdas nulas desperdiciadas.

### Slide 3: Transformación Primer Hijo / Siguiente Hermano (LCRS)
- **Aspecto conceptual**: Cada nodo solo necesita dos referencias:
  1. `primerHijo`: apunta al primer hijo de su lista de descendientes directos.
  2. `siguienteHermano`: apunta al hermano inmediato ubicado a su derecha en el mismo nivel.
- **Gráfica requerida (SVG interactivo)**:
  - Transformación visual fluida:
    - Estado inicial: El árbol N-ario tradicional en forma de organigrama.
    - Animación interactiva: Las ramas que caen hacia los hijos se contraen; solo el hijo más izquierdo mantiene la conexión vertical hacia abajo (`primerHijo`), mientras los demás hijos se encadenan horizontalmente hacia la derecha (`siguienteHermano`).
    - Al rotar 45 grados las conexiones horizontales, ¡aparece mágicamente un árbol binario estándar!
- **Interacción**: Deslizador (slider) que transiciona suavemente entre la vista N-aria original y la vista binaria LCRS.

### Slide 4: Recorrido en Preorden de un Árbol N-ario
- **Aspecto conceptual**: Visitar el nodo padre antes que a todos sus descendientes, recorriendo cada subárbol de izquierda a derecha.
- **Gráfica requerida (SVG)**:
  - Trazado de ruta numerada sobre el árbol N-ario: `1 -> 2 -> 3 -> 4 -> 5 -> 6`.
  - Equivalencia exacta: Mostrar cómo el recorrido en Preorden sobre el árbol LCRS produce la misma secuencia de elementos.

### Slide 5: Representación con Vector de Padres (`padre[i]`)
- **Aspecto conceptual**: Se numeran los nodos de `0` a `N-1`. Un array unidimensional `int[] padre` almacena en la posición `i` el índice del padre del nodo `i` (la raíz suele tener valor `-1`).
- **Gráfica requerida (SVG interactivo)**:
  - Diagrama dual:
    - Arriba: El árbol con nodos etiquetados con su número (`0` raíz, `1`, `2`, `3` hijos de `0`, `4` hijo de `1`).
    - Abajo: La tabla del vector de padres con sus índices:
      `padre = [-1, 0, 0, 0, 1]`
  - Al hacer click en cualquier celda de la tabla (ej. índice 4), se ilumina la flecha que conecta el nodo 4 con el nodo 1 en el árbol.

### Slide 6: Algoritmos sobre el Vector de Padres
- **Aspecto conceptual**:
  - ¿Subir a la raíz? Instantáneo: `while (p != -1) p = padre[p];`.
  - ¿Buscar el ancestro común más cercano (LCA)? Subir marcando visitados.
  - ¿Listar los hijos de un nodo? Requiere barrer todo el array en $O(N)$.
- **Gráfica requerida (Simulador)**:
  - Animación del ascenso hacia la raíz desde cualquier nodo seleccionado por el usuario.
  - Visualización del costo de listar hijos: animación que revisa cada casilla del vector buscando las que tengan `padre[j] == nodoSeleccionado`.

### Slide 7: Árboles K-arios Completos y Fórmulas de Índices
- **Aspecto conceptual**: Si cada nodo tiene exactamente $K$ hijos y el árbol es completo, se puede prescindir de punteros y de tabla de padres, calculando índices matemáticamente como en un Heap binario.
- **Gráfica requerida (SVG)**:
  - Para árbol ternario ($K = 3$): Hijo $j$-ésimo de $i$ está en $3i + j$. El padre de $i$ está en $\lfloor (i - 1) / 3 \rfloor$.
  - Mapeo directo entre la estructura arbórea y las posiciones contiguas de un array lineal.

---

## 4. Estilo y Tokens de Diseño Organic
- Gráficos con estética de organigrama redondeado, contrastes con terracota para hijos y sage para hermanos.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/26-arboles-n-arios-y-representacion-con-vectores`
- **WHEN** el usuario interactúa con la presentación
- **THEN** puede experimentar la transformación interactiva LCRS y comprender la dualidad entre el árbol gráfico y el vector de padres en memoria.
