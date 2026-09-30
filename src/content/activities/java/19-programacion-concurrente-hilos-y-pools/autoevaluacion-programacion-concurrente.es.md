---
course: 'java'
lesson: '19-programacion-concurrente-hilos-y-pools'
slug: 'autoevaluacion-programacion-concurrente'
title: 'Autoevaluación: Programación Concurrente, Sincronización y Pools de Hilos'
description: 'Comprobá tus conocimientos sobre el modelo de memoria de Java, condiciones de carrera, secciones críticas con synchronized y gestión de tareas con ExecutorService.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Por qué la operación `contador++` NO es segura cuando la ejecutan múltiples hilos concurrentemente sin sincronización?'
    options:
      - id: 'a'
        text: 'Porque la JVM no permite números enteros en hilos secundarios.'
      - id: 'b'
        text: 'Porque no es una operación atómica: consta internamente de tres pasos (leer, incrementar y escribir), permitiendo que otros hilos intercalen sus accesos y sobreescriban datos.'
      - id: 'c'
        text: 'Porque el Garbage Collector bloquea las variables estáticas.'
      - id: 'd'
        text: 'Porque el operador ++ solo funciona en métodos estáticos.'
    correctOptionId: 'b'
    explanation: >-
      Al no ser atómica, si dos hilos leen el valor 5 simultáneamente, ambos calcularán 6 y escribirán 6, perdiéndose uno de los dos incrementos. Esto se conoce como condición de carrera (*race condition*).
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Llamar directamente a `hilo.run()` en lugar de `hilo.start()` inicia un nuevo hilo de ejecución en el sistema operativo.'
    correctAnswer: false
    explanation: >-
      Falso. Llamar a `run()` ejecuta el método secuencialmente en el mismo hilo actual (como cualquier método ordinario). Para que la JVM solicite al sistema operativo crear e iniciar un nuevo hilo, se debe invocar obligatoriamente `start()`.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'En el Java Memory Model (JMM), ¿cuál es la diferencia principal entre el Stack y el Heap en un entorno multihilo?'
    options:
      - id: 'a'
        text: 'Cada hilo tiene su propio Stack privado con variables locales; el Heap es un espacio compartido entre todos los hilos donde residen los objetos instanciados.'
      - id: 'b'
        text: 'El Heap es privado de cada hilo y el Stack se comparte entre todos.'
      - id: 'c'
        text: 'En Java no existe el Stack para hilos concurrentes.'
      - id: 'd'
        text: 'El Stack solo guarda strings y el Heap solo números.'
    correctOptionId: 'a'
    explanation: >-
      Las variables locales primitivas y referencias de método son privadas de cada hilo en su Call Stack. Los objetos reales habitan en el Heap, accesible por cualquier hilo que tenga una referencia a ellos, siendo la fuente de posibles conflictos de concurrencia.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'A diferencia de `Runnable`, la interfaz `Callable<V>` permite que la tarea retorne un valor de tipo V y lance excepciones comprobadas (*checked exceptions*).'
    correctAnswer: true
    explanation: >-
      Verdadero. La firma de `Callable<V>` es `V call() throws Exception`, lo que permite devolver el resultado del cómputo asíncrono y gestionar excepciones que ocurran dentro del hilo.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Por qué la industria prefiere utilizar un `ExecutorService` con un pool de hilos en lugar de crear un `new Thread(...)` cada vez que se requiere una tarea?'
    options:
      - id: 'a'
        text: 'Porque crear hilos del sistema operativo tiene un costo alto de CPU y memoria; un pool reutiliza hilos existentes y acota el consumo de recursos impidiendo que el servidor colapse.'
      - id: 'b'
        text: 'Porque `Thread` fue eliminado en Java 8.'
      - id: 'c'
        text: 'Porque los pools de hilos ejecutan código sin necesidad de compilarlo.'
      - id: 'd'
        text: 'Porque un ExecutorService solo puede ejecutar una tarea por día.'
    correctOptionId: 'a'
    explanation: >-
      Crear un hilo del SO implica reservar memoria para su Stack y solicitar recursos al kernel. Si entran 10.000 peticiones y creamos 10.000 hilos, la máquina se quedará sin memoria (`OutOfMemoryError`). Un pool fija un límite saludable y encola las tareas pendientes.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Cuando un método se declara como `public synchronized void miMetodo()`, el hilo que lo invoca adquiere automáticamente el cerrojo (*lock* o monitor) intrínseco de la instancia `this`.'
    correctAnswer: true
    explanation: >-
      Verdadero. Cualquier otro hilo que intente invocar un método sincronizado sobre esa misma instancia quedará en estado bloqueado (*BLOCKED*) hasta que el primer hilo libere el monitor.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué sucede si invocamos `future.get()` sobre un objeto `Future<T>` cuya tarea aún se encuentra ejecutándose en segundo plano?'
    options:
      - id: 'a'
        text: 'Retorna `null` inmediatamente.'
      - id: 'b'
        text: 'Cancela la tarea.'
      - id: 'c'
        text: 'Bloquea el hilo invocador de manera síncrona hasta que la tarea termine y el resultado esté disponible.'
      - id: 'd'
        text: 'Lanza una excepción de compilación.'
    correctOptionId: 'c'
    explanation: >-
      El método `future.get()` es una operación bloqueante que espera la compleción de la tarea. Para evitar bloqueos indefinidos, suele utilizarse la sobrecarga con tiempo límite: `future.get(timeout, unit)`.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'El método `executor.shutdown()` detiene inmediatamente todas las tareas en curso interrumpiendo violentamente los hilos.'
    correctAnswer: false
    explanation: >-
      Falso. `shutdown()` inicia un apagado ordenado (*graceful shutdown*): no acepta nuevas tareas pero permite que las ya enviadas terminen normalmente. El método que intenta interrumpir las tareas activas de inmediato es `shutdownNow()`.
---
