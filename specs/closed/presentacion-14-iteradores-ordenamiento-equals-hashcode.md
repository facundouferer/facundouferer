# Spec: Presentación Interactiva — Iteradores, Ordenamiento y Contrato equals/hashCode

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/14-iteradores-ordenamiento-equals-hashcode`
  - Archivo de lección: `src/content/courses/java/16-iteradores-ordenamiento-equals-hashcode.es.md`
  - Slug de la lección: `14-iteradores-ordenamiento-equals-hashcode`
- **Slug de la presentación**: `iteradores-ordenamiento-equals-hashcode-java`
- **Archivo de componente**: `src/components/presentaciones/iteradores-ordenamiento-equals-hashcode-java.astro`
- **Asset de tarjeta**: `/img/presentations/iteradores-ordenamiento-equals-hashcode-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Iteradores, Ordenamiento y Contrato equals/hashCode', en: 'Iterators, Sorting, and equals/hashCode Contract' }`
  - `description`: `{ es: 'ConcurrentModificationException desmitificada, Comparator vs Comparable y colisiones en HashSet.', en: 'ConcurrentModificationException demystified, Comparator vs Comparable, and HashSet collisions.' }`
  - `lesson`: `{ course: 'java', slug: '14-iteradores-ordenamiento-equals-hashcode' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

Esta presentación aborda los errores más sutiles y peligrosos del día a día en Java:
- Mostrar exactamente qué código genera el compilador detrás de un bucle `for-each`.
- Visualizar el contador `modCount` frente a `expectedModCount` para comprender físicamente por qué ocurre `ConcurrentModificationException`.
- Demostrar la diferencia entre Orden Natural (`Comparable`) y Órdenes Múltiples (`Comparator`).
- Graficar la catástrofe de "objetos que desaparecen" en un `HashSet` cuando se viola el contrato de `equals` y `hashCode`.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: Qué hay realmente detrás de un `for-each`
- **Aspecto conceptual**: El bucle mejorado `for (T x : coleccion)` es azúcar sintáctico que se transforma en llamadas a `iterator()`, `hasNext()` y `next()`.
- **Gráfica requerida (SVG)**:
  - Dos paneles sincronizados:
    - Izquierda: El `for-each` conciso de 3 líneas.
    - Derecha: El código desazucarado real con la creación del objeto `Iterator`, el puntero de cursor interno y el `while(it.hasNext())`.
  - Animación del cursor avanzando a través de las celdas de la colección.

### Slide 2: La pesadilla de `ConcurrentModificationException`
- **Aspecto conceptual**: La colección lleva un contador `modCount` que incrementa con cada `add()` o `remove()`. El iterador guarda su propia copia `expectedModCount`. Si no coinciden al llamar a `next()`, se lanza la excepción.
- **Gráfica requerida (SVG interactivo)**:
  - Dos medidores visuales:
    - Odómetro 1: `lista.modCount = 5`
    - Odómetro 2: `iterator.expectedModCount = 5`
  - Simulación paso a paso:
    - Paso 1: Iteración normal, ambos contadores coinciden en 5.
    - Paso 2: El usuario invoca erróneamente `lista.remove(x)` directamente sobre la lista en lugar de `iterator.remove()`.
    - Paso 3: `lista.modCount` salta a 6, mientras `expectedModCount` sigue en 5.
    - Paso 4: En el siguiente `it.next()`, el comparador detecta `6 != 5` y dispara la alerta visual en rojo: `ConcurrentModificationException`.

### Slide 3: `Comparable` — El orden natural de una clase
- **Aspecto conceptual**: La interfaz `Comparable<T>` define un único orden intrínseco mediante `compareTo(T otro)`. Reglas del signo: negativo ($A < B$), cero ($A == B$), positivo ($A > B$).
- **Gráfica requerida (SVG)**:
  - Balanza de comparación interactiva:
    - Colocar dos objetos (ej. `Estudiante(nota = 8)` y `Estudiante(nota = 6)`).
    - La balanza se inclina visualmente mostrando la resta `8 - 6 = +2` (positivo: va después).
- **Interacción**: Selector para modificar notas y ver cómo la balanza reacciona y ordena un arreglo de 4 estudiantes.

### Slide 4: `Comparator` — Múltiples órdenes a demanda
- **Aspecto conceptual**: Cuando se necesita ordenar por apellido, por fecha, o por salario sin modificar la clase original. Uso de lambdas y `Comparator.comparing().thenComparing()`.
- **Gráfica requerida (SVG)**:
  - Diagrama de clasificación multi-criterio:
    - Criterio 1: Ordenar por `edad` ascendente.
    - Criterio 2 (Desempate): Si tienen la misma edad, ordenar por `apellido` alfabéticamente.
  - Tarjetas de personas reacomodándose suavemente con animación al alternar entre criterios de ordenamiento.

### Slide 5: El Contrato `equals` — Las 5 reglas inviolables
- **Aspecto conceptual**: 1. Reflexiva, 2. Simétrica, 3. Transitiva, 4. Consistente, 5. Null-check seguro.
- **Gráfica requerida (SVG)**:
  - 5 sellos de calidad visuales, cada uno ilustrado con un diagrama de conjuntos/flechas:
    - Simetría: `a.equals(b)` debe equivaler a `b.equals(a)`.
    - Transitividad: Si `a.equals(b)` y `b.equals(c)` son true, entonces `a.equals(c)` es true.
  - Contraejemplo gráfico: error común al comparar subclases con `instanceof` que rompe la simetría.

### Slide 6: El Contrato de Oro: `equals` y `hashCode`
- **Aspecto conceptual**: La regla sagrada: Si `a.equals(b) == true`, entonces `a.hashCode() == b.hashCode()` DEBE ser true obligatoriamente.
- **Gráfica requerida (SVG interactivo)**:
  - Escenario de desastre en un `HashSet`:
    - Creamos `new Producto("A123", 50)`. Sobrescribimos `equals` pero no `hashCode`.
    - Se agrega al `HashSet`. La JVM usa el `hashCode()` de `Object` (dirección de memoria) y lo ubica en el bucket `[7]`.
    - Luego buscamos `set.contains(new Producto("A123", 50))`. Aunque los campos son idénticos, el nuevo objeto tiene otra dirección de memoria y calcula un hash que apunta al bucket `[2]`.
    - La cubeta 2 está vacía: ¡El `HashSet` dice que el producto no existe aunque está adentro!
- **Interacción**: Demostración interactiva donde el alumno activa o desactiva la implementación de `hashCode()` para ver cómo la búsqueda pasa de fallar (rojo) a tener éxito inmediato (verde).

### Slide 7: Claves Mutables en Colecciones Hash — El objeto perdido
- **Aspecto conceptual**: Modificar los atributos de un objeto que ya está dentro de un `HashSet` corrompe su ubicación en los buckets.
- **Gráfica requerida (SVG)**:
  - El objeto se inserta en el bucket `[3]` calculado con su nombre original `"Carlos"`.
  - Mutación: `persona.setNombre("Alberto")`. Su nuevo hash correspondería al bucket `[9]`, pero el objeto físicamente sigue atrapado en el bucket `[3]`.
  - La búsqueda con `"Alberto"` revisa el bucket 9 y falla; la búsqueda con `"Carlos"` compara el nombre en el bucket 3 y falla. El objeto quedó atrapado e inaccesible (fuga de memoria).

---

## 4. Estilo y Tokens de Diseño Organic
- Visualización de odómetros y balanzas con diseño redondeado, contraste accesible y paleta Organic.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/14-iteradores-ordenamiento-equals-hashcode`
- **WHEN** un alumno utiliza la presentación interactiva
- **THEN** comprende visualmente la causalidad de `ConcurrentModificationException` y el fallo crítico de omitir `hashCode`.
