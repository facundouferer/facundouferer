# Spec: Presentación Interactiva — TAD Listas Estáticas, Dinámicas y Enlazadas en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/11-tad-listas-estaticas-y-dinamicas`
  - Archivo de lección: `src/content/courses/java/13-tad-listas-estaticas-y-dinamicas.es.md`
  - Slug de la lección: `11-tad-listas-estaticas-y-dinamicas`
- **Slug de la presentación**: `tad-listas-enlazadas-java`
- **Archivo de componente**: `src/components/presentaciones/tad-listas-enlazadas-java.astro`
- **Asset de tarjeta**: `/img/presentations/tad-listas-enlazadas-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'TAD Listas: Estáticas vs Enlazadas en Java', en: 'List ADT: Static vs Linked in Java' }`
  - `description`: `{ es: 'Punteros, manipulación de nodos en el Heap y costos temporales con simulador interactivo.', en: 'Pointers, Heap node manipulation, and time complexity with an interactive simulator.' }`
  - `lesson`: `{ course: 'java', slug: '11-tad-listas-estaticas-y-dinamicas' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

La comprensión profunda de las listas enlazadas reside en visualizar la memoria y el movimiento de referencias:
- Romper la confusión entre "acceso por índice" y "recorrido secuencial".
- Mostrar la diferencia física entre memoria contigua en arrays y nodos dispersos enlazados por direcciones de memoria.
- Animar paso a paso el "baile de punteros" para inserción al frente, al final y eliminación sin perder la referencia a la lista.
- Demostrar de forma interactiva por qué la inserción al frente es $O(1)$ en listas enlazadas pero $O(N)$ en arrays estáticos.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: ¿Qué es un TAD? La interfaz frente a la memoria
- **Aspecto conceptual**: La especificación abstracta (`Lista<T>` con `agregar`, `eliminar`, `obtener`, `tamano`) desacoplada de la implementación física.
- **Gráfica requerida (SVG)**:
  - Diagrama de caja negra: la interfaz `Lista` en el centro con sus métodos públicos.
  - Dos caminos de realización física que salen hacia abajo:
    - Camino 1: Bloques de memoria contiguos indexados (`ArrayList`).
    - Camino 2: Nodos dispersos en el Heap unidos por flechas (`LinkedList`).

### Slide 2: Memoria Contigua vs Nodos Dispersos en el Heap
- **Aspecto conceptual**: Localidad espacial de la memoria caché vs flexibilidad dinámica sin redimensionamiento costoso.
- **Gráfica requerida (SVG)**:
  - Vista comparativa de la memoria RAM:
    - Arriba (Array): Celdas numeradas consecutivas `[0]`, `[1]`, `[2]`, `[3]`, `[4]` con puntero base `0x1000 + i * size`. Acceso directo instantáneo en $O(1)$.
    - Abajo (Lista enlazada): Nodos ubicados en direcciones aleatorias (`0x3A20`, `0x8F14`, `0x10B8`) unidos por punteros `siguiente`. No hay salto directo al índice 4; hay que caminar nodo a nodo ($O(N)$).
- **Interacción**: Botón "Buscar elemento en índice 3" que muestra el acceso inmediato en el array vs la caminata secuencial de puntero en la lista.

### Slide 3: Anatomía de un Nodo
- **Aspecto conceptual**: La clase `Nodo<T>` contiene dos compartimentos: la carga útil (`T dato`) y la referencia autorreferencial (`Nodo<T> siguiente`).
- **Gráfica requerida (SVG)**:
  - Detalle ampliado de un nodo:
    - Celda izquierda: `dato` apuntando al objeto en el Heap (ej. `"Ana"`).
    - Celda derecha: `siguiente` con un punto y una flecha saliente hacia el siguiente nodo.
    - Último nodo: compartimento `siguiente` apuntando a `null` (representado visualmente como una conexión a tierra/tierra eléctrica).

### Slide 4: Inserción al Inicio (`agregarAlInicio`) — El baile de punteros
- **Aspecto conceptual**: Costo $O(1)$ constante. Si cambiás el puntero `cabeza` antes de enlazar el nuevo nodo, perdés toda la lista en el Garbage Collector.
- **Gráfica requerida (SVG animado interactivo)**:
  - Paso 1: Lista existente con `cabeza -> [Nodo A] -> [Nodo B]`.
  - Paso 2: Nace `nuevo = new Nodo(X)` flotando en el espacio.
  - Paso 3: Enlace crítico: `nuevo.siguiente = cabeza` (se traza la flecha verde desde X hacia A).
  - Paso 4: Actualización del puntero principal: `cabeza = nuevo` (la flecha cabeza se mueve de A hacia X).
- **Interacción**: Controles "Paso Anterior" y "Paso Siguiente" para que el alumno manipule la secuencia y vea qué ocurre si se invierten los pasos (demostración del error de referencia huérfana).

### Slide 5: Inserción al Final y Recorrido
- **Aspecto conceptual**: La necesidad de avanzar con un puntero auxiliar `actual` mientras `actual.siguiente != null`.
- **Gráfica requerida (SVG)**:
  - Diagrama de la lista con un cursor `actual` moviéndose paso a paso hasta detenerse en el último nodo.
  - Creación del nuevo nodo y conexión de `actual.siguiente = nuevo`.
- **Interacción**: Simulador donde el usuario ingresa un valor y observa la animación del recorrido desde la cabeza hasta el final.

### Slide 6: Eliminación de un Nodo Intermedio
- **Aspecto conceptual**: Buscar el nodo objetivo manteniendo una referencia al nodo `anterior` para puentearlo (`anterior.siguiente = actual.siguiente`).
- **Gráfica requerida (SVG)**:
  - Lista: `[Nodo 10] -> [Nodo 20] -> [Nodo 30] -> [Nodo 40]`.
  - Se desea eliminar `20`:
    - El puntero `anterior` apunta a `10` y `actual` a `20`.
    - Animación del puente: la flecha de `10` se desvía y conecta directamente con `30`.
    - `Nodo 20` queda sin referencias entrantes; se vuelve translúcido y es recolectado por el Garbage Collector.

### Slide 7: Variantes — Doblemente Enlazada y Circular
- **Aspecto conceptual**: Agregar puntero `anterior` para recorrido bidireccional; lista circular donde el último nodo apunta al primero.
- **Gráfica requerida (SVG)**:
  - Esquema interactivo alternable:
    - Modo Doble: Cada nodo tiene dos flechas bidireccionales (`anterior` y `siguiente`) y punteros a `cabeza` y `cola`.
    - Modo Circular: Flecha curvada desde el último nodo conectando de regreso a la cabeza.

### Slide 8: Tabla de Complejidad Big-O interactiva
- **Aspecto conceptual**: Comparativa de costos algorítmicos entre `ArrayList` y `LinkedList`.
- **Gráfica requerida (Tabla visual)**:
  - Filas: Acceso por índice, Inserción al inicio, Inserción al final, Búsqueda por valor, Eliminación.
  - Columnas: Array estático vs Lista enlazada simple vs Lista doblemente enlazada con tail.
  - Semáforo visual con verdes ($O(1)$) y rojos ($O(N)$) y explicación al hacer click en cada celda.

---

## 4. Estilo y Tokens de Diseño Organic
- Gráficos claros, flechas estilizadas con `stroke-width="2.75"` y terminaciones redondeadas.
- Nodos con `--color-surface`, bordes `--color-divider` y resaltado activo `--color-accent`.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/11-tad-listas-estaticas-y-dinamicas`
- **WHEN** el alumno ejecuta la presentación
- **THEN** puede experimentar la reconexión de punteros en los pasos de inserción y eliminación mediante el simulador interactivo
- **AND** la presentación se visualiza correctamente en español e inglés.
