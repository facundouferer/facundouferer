---
course: 'java'
lesson: '12-tad-pilas-y-colas'
slug: 'autoevaluacion-tad-pilas-y-colas'
title: 'Autoevaluación: TAD Pila y Cola, Comportamientos LIFO y FIFO'
description: 'Validá tu comprensión sobre estructuras restringidas de acceso lineal, complejidades temporales O(1), punteros de control y aplicaciones prácticas.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es la diferencia fundamental en la disciplina de acceso entre una Pila y una Cola?'
    options:
      - id: 'a'
        text: 'La Pila sigue LIFO (el último en entrar es el primero en salir) y la Cola sigue FIFO (el primero en entrar es el primero en salir).'
      - id: 'b'
        text: 'La Pila permite acceso aleatorio por índice numérico y la Cola solo por clave.'
      - id: 'c'
        text: 'La Cola no permite eliminar elementos intermedios pero la Pila sí.'
      - id: 'd'
        text: 'Ambas tienen exactamente la misma disciplina de acceso pero distinta sintaxis.'
    correctOptionId: 'a'
    explanation: >-
      Por definición matemática de ambos TADs, la Pila restringe el acceso al extremo superior (LIFO: Last-In, First-Out), mientras que la Cola inserta por un extremo y extrae por el opuesto (FIFO: First-In, First-Out).
  - kind: 'true-false'
    id: 'q2'
    prompt: 'En una implementación enlazada de una Cola que solo guarda un puntero a la cabeza (`primero`) pero NO al final (`ultimo`), la operación de encolar (`enqueue`) al final puede costar O(N).'
    correctAnswer: true
    explanation: >-
      Verdadero. Si no se mantiene una referencia directa al último nodo de la cola, para encolar un elemento es necesario recorrer toda la lista enlazada desde el inicio hasta el final, degradando la operación a O(N). Mantener el puntero al último nodo permite que sea O(1).
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Por qué la estructura de Pila es la opción natural para verificar delimitadores anidados como `({[]})`?'
    options:
      - id: 'a'
        text: 'Porque el delimitador de cierre más próximo siempre debe emparejarse con el delimitador de apertura más reciente que se haya visto (LIFO).'
      - id: 'b'
        text: 'Porque una pila ordena alfabéticamente los caracteres automáticamente.'
      - id: 'c'
        text: 'Porque la pila almacena caracteres en disco para no saturar la memoria.'
      - id: 'd'
        text: 'Porque la cola consumiría el doble de ciclos de CPU para la misma tarea.'
    correctOptionId: 'a'
    explanation: >-
      El anidamiento sintáctico cumple con la propiedad LIFO: el último símbolo abierto es el primero que debe cerrarse. Por eso, al apilar las aperturas y verificar que cada cierre coincida con el tope de la pila, se garantiza la correcta anidación.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'Al ejecutar la operación `pop()` en una Pila o `dequeue()` en una Cola, si la estructura está vacía se debe retornar `null` silenciosamente sin alertar de un estado inválido.'
    correctAnswer: false
    explanation: >-
      Falso. En un diseño robusto y defensivo orientado a objetos, intentar extraer de una estructura vacía viola una precondición, por lo que debe comunicarse explícitamente mediante una excepción (como `NoSuchElementException` o `IllegalStateException`) o un tipo contenedor explícito como `Optional<T>`.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Si encolamos sucesivamente los números 10, 20, 30 en una Cola vacía, y luego ejecutamos un `dequeue()`, ¿qué valor devuelve la llamada?'
    options:
      - id: 'a'
        text: '30'
      - id: 'b'
        text: '20'
      - id: 'c'
        text: '10'
      - id: 'd'
        text: 'Lanza una excepción de índice fuera de rango.'
    correctOptionId: 'c'
    explanation: >-
      Al ser una cola FIFO, el primer elemento encolado (10) es el primero en ser desencolado y retornado.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'La operación `peek()` (o `top()`) permite inspeccionar el elemento próximo a salir sin modificar el estado ni el tamaño de la estructura.'
    correctAnswer: true
    explanation: >-
      Verdadero. A diferencia de `pop()` o `dequeue()`, `peek()` es una consulta pura idempotente que no altera el tamaño ni desvincula ningún nodo.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué ocurre con las referencias en una ColaEnlazada cuando se desencola el único elemento que quedaba?'
    options:
      - id: 'a'
        text: 'Solo se actualiza `cabeza` a `null`, no importa a qué apunte `cola`.'
      - id: 'b'
        text: 'Tanto `cabeza` como `cola` deben actualizarse a `null` para reflejar el estado de estructura vacía y permitir la recolección de basura.'
      - id: 'c'
        text: 'La JVM elimina la instancia de la cola automáticamente.'
      - id: 'd'
        text: 'Se debe reiniciar la cola asignando un nuevo arreglo estático.'
    correctOptionId: 'b'
    explanation: >-
      Si la cola tenía un solo nodo, al extraerlo tanto `cabeza` como `cola` apuntaban al mismo nodo. Si no actualizamos `cola` a `null`, quedaría una referencia obsoleta (*dangling reference*) que viola el invariante de que una cola vacía tiene ambas referencias nulas.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'El Call Stack o pila de ejecución de la máquina virtual de Java (JVM) utiliza la semántica de Pila para gestionar los marcos de activación de métodos.'
    correctAnswer: true
    explanation: >-
      Verdadero. Cuando un método llama a otro, se apila un nuevo marco de ejecución; al terminar la invocación, se desapila para retomar el control en el método invocador.
---
