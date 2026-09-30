---
course: 'java'
lesson: '14-iteradores-ordenamiento-equals-hashcode'
slug: 'autoevaluacion-iteradores-ordenamiento-equals-hashcode'
title: 'Autoevaluación: Iteradores, Ordenamiento y Contrato equals/hashCode'
description: 'Validá tus conocimientos sobre Iterable, Iterator, Comparable vs Comparator, y las consecuencias de violar el contrato equals/hashCode.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Si dos objetos en Java son considerados iguales según el método `equals(Object)` (es decir, `a.equals(b) == true`), ¿cuál es la regla OBLIGATORIA sobre sus códigos hash?'
    options:
      - id: 'a'
        text: 'Deben tener obligatoriamente el mismo hashCode().'
      - id: 'b'
        text: 'Deben tener códigos hash diferentes para evitar colisiones.'
      - id: 'c'
        text: 'El valor de hashCode() es indistinto; la JVM no lo utiliza.'
      - id: 'd'
        text: 'Solo deben tener el mismo hashCode si ambos objetos son inmutables.'
    correctOptionId: 'a'
    explanation: >-
      El contrato de Java establece que si dos objetos son iguales según `equals()`, ambos DEBEN devolver exactamente el mismo valor en `hashCode()`. De lo contrario, colecciones como `HashSet` o `HashMap` los ubicarán en buckets diferentes y no podrán detectarlos.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Si dos objetos tienen el mismo valor de `hashCode()`, el método `equals()` obligatoriamente debe retornar `true`.'
    correctAnswer: false
    explanation: >-
      Falso. El hash tiene un rango finito de valores (un entero de 32 bits), por lo que objetos diferentes pueden producir el mismo hash (colisión de hash). La implicación inversa no es obligatoria.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué excepción se lanza si se intenta eliminar un elemento directamente desde la colección (`lista.remove(...)`) mientras se la recorre con un bucle for-each tradicional?'
    options:
      - id: 'a'
        text: 'NullPointerException'
      - id: 'b'
        text: 'ConcurrentModificationException'
      - id: 'c'
        text: 'UnsupportedOperationException'
      - id: 'd'
        text: 'IndexOutOfBoundsException'
    correctOptionId: 'b'
    explanation: >-
      Los iteradores de Java implementan una política de fail-fast: mantienen un contador interno de modificaciones (`modCount`). Si la estructura muta sin usar el propio `iterator.remove()`, se detecta la inconsistencia y se lanza `ConcurrentModificationException`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Cuál es la diferencia de diseño fundamental entre `Comparable<T>` y `Comparator<T>`?'
    options:
      - id: 'a'
        text: 'Comparable se define dentro de la clase de la entidad para establecer su orden natural; Comparator es un objeto externo que define criterios de ordenación alternativos o desacoplados.'
      - id: 'b'
        text: 'Comparable solo sirve para números y Comparator para cadenas.'
      - id: 'c'
        text: 'Comparable pertenece al paquete java.io y Comparator a java.lang.'
      - id: 'd'
        text: 'No hay diferencia técnica; son sinónimos legados.'
    correctOptionId: 'a'
    explanation: >-
      `Comparable<T>` requiere modificar la clase propia implementando `compareTo(T o)`, proveyendo el orden estándar. `Comparator<T>` implementa `compare(T o1, T o2)` en clases o lambdas separadas, permitiendo múltiples criterios de orden sin tocar la entidad.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'El método `compareTo(T o)` debe devolver un número negativo si `this` es menor que `o`, cero si son equivalentes, y un número positivo si `this` es mayor que `o`.'
    correctAnswer: true
    explanation: >-
      Verdadero. Esta convención tripartita (< 0, == 0, > 0) es la base que utilizan todos los algoritmos de ordenamiento como `Collections.sort()` y `Arrays.sort()`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Por qué mutar los campos de un objeto después de haberlo insertado como clave en un `HashSet` o `HashMap` es un grave error de programación?'
    options:
      - id: 'a'
        text: 'Porque el Garbage Collector elimina inmediatamente el objeto mutado.'
      - id: 'b'
        text: 'Porque el hashCode del objeto cambia, y la colección buscará en un bucket diferente al momento de intentar recuperarlo o eliminarlo, volviéndolo invisible.'
      - id: 'c'
        text: 'Porque la JVM convierte la colección en un arreglo estático de solo lectura.'
      - id: 'd'
        text: 'Porque provoca un fallo de hardware en la memoria caché.'
    correctOptionId: 'b'
    explanation: >-
      Los buckets de las estructuras hash se calculan al momento de insertar el objeto. Si sus atributos cambian y modifican el valor devuelto por `hashCode()`, las búsquedas futuras se dirigirán al nuevo bucket (donde el objeto no está), perdiendo la referencia.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Un objeto puede recorrerse con la sintaxis de bucle for-each (`for (Tipo x : coleccion)`) siempre y cuando su clase implemente la interfaz `java.lang.Iterable`.'
    correctAnswer: true
    explanation: >-
      Verdadero. El bucle for-each de Java es azúcar sintáctico que el compilador traduce a llamadas a `iterator()`, `hasNext()` y `next()` sobre cualquier objeto que implemente `Iterable`.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'En la implementación del método `equals(Object o)`, ¿cuál es el primer paso recomendado por razones de rendimiento y corrección reflexiva?'
    options:
      - id: 'a'
        text: 'Castear directamente o al tipo actual.'
      - id: 'b'
        text: 'Verificar si this == o (identidad de referencia en memoria).'
      - id: 'c'
        text: 'Comparar los campos numéricos primero.'
      - id: 'd'
        text: 'Imprimir un mensaje de depuración en consola.'
    correctOptionId: 'b'
    explanation: >-
      Si `this == o`, estamos comparando el objeto consigo mismo; retornar `true` de inmediato es una comprobación sumamente rápida que evita casteos y accesos a memoria innecesarios.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'El método `iterator.remove()` puede invocarse múltiples veces seguidas de forma válida luego de una única llamada a `iterator.next()`.'
    correctAnswer: false
    explanation: >-
      Falso. `remove()` solo puede invocarse una vez por cada llamada a `next()`. Si se llama dos veces seguidas o antes del primer `next()`, lanza `IllegalStateException`.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Cuál de las siguientes afirmaciones sobre la relación entre `Comparable` y `equals` describe una buena práctica de diseño?'
    options:
      - id: 'a'
        text: 'Es fuertemente recomendado que el orden natural sea consistente con equals: (x.compareTo(y) == 0) == (x.equals(y)).'
      - id: 'b'
        text: 'compareTo nunca debe retornar 0 si equals retorna true.'
      - id: 'c'
        text: 'equals solo debe usarse si no existe compareTo.'
      - id: 'd'
        text: 'TreeSet y TreeMap utilizan equals en lugar de compareTo para determinar duplicados.'
    correctOptionId: 'a'
    explanation: >-
      Aunque no es estrictamente obligatorio para compilar, cuando `compareTo` no es consistente con `equals`, colecciones ordenadas como `TreeSet` o `TreeMap` pueden comportarse de manera extraña o violar el contrato general de `Set` o `Map`.
---
