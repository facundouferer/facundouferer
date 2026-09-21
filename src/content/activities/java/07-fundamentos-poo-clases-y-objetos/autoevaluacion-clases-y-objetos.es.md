---
course: 'java'
lesson: '07-fundamentos-poo-clases-y-objetos'
slug: 'autoevaluacion-clases-y-objetos'
title: 'Autoevaluación: Clases, Objetos y el Operador new'
description: 'Diez preguntas sobre clases vs. objetos, el ciclo de new, this y referencias en memoria.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué representa una clase en Java?'
    options:
      - id: 'a'
        text: 'La instancia concreta creada en memoria durante la ejecución.'
      - id: 'b'
        text: 'El plano o molde que define qué atributos y métodos tendrán sus objetos.'
      - id: 'c'
        text: 'Un método estático que se ejecuta al iniciar el programa.'
      - id: 'd'
        text: 'Una variable de tipo primitivo declarada en el Stack.'
    correctOptionId: 'b'
    explanation: >-
      La clase es la plantilla abstracta definida en el código fuente: declara
      qué atributos (estado) y métodos (comportamiento) tendrá cada objeto,
      pero no es en sí misma un dato en memoria.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Una clase ocupa memoria de datos en el Heap durante la ejecución, igual que un objeto.'
    correctAnswer: false
    explanation: >-
      La clase no ocupa memoria de datos en el Heap. Solo el objeto (la
      instancia creada con new) ocupa ese espacio; la clase es la definición
      que la JVM usa para saber cómo construirlo.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'Al ejecutar new NombreClase(), ¿qué es lo primero que hace la JVM?'
    options:
      - id: 'a'
        text: 'Ejecuta el método main del programa.'
      - id: 'b'
        text: 'Reserva un bloque de memoria en el Heap para los atributos del objeto.'
      - id: 'c'
        text: 'Elimina cualquier objeto anterior del mismo tipo.'
      - id: 'd'
        text: 'Convierte la clase en una variable primitiva.'
    correctOptionId: 'b'
    explanation: >-
      El ciclo de new empieza con la reserva de memoria en el Heap: la JVM
      calcula el tamaño necesario según los atributos de la clase y asigna
      ese bloque antes de inicializar valores o invocar el constructor.
  - kind: 'true-false'
    id: 'q4'
    prompt: >-
      Si un atributo numérico (por ejemplo int o double) no se inicializa
      explícitamente, al instanciar el objeto con new toma un valor por
      defecto (0 o 0.0), en lugar de quedar indefinido.
    correctAnswer: true
    explanation: >-
      Java inicializa los atributos con valores por defecto durante la
      instanciación: int/long/byte pasan a 0, double/float a 0.0 y boolean a
      false. Nunca quedan "indefinidos" como en otros lenguajes.
  - kind: 'single-choice'
    id: 'q5'
    prompt: >-
      Declarás String nombre; como atributo de una clase, sin asignarle
      ningún valor. Después de instanciar el objeto con new, ¿cuál es el
      valor de nombre?
    options:
      - id: 'a'
        text: '"" (una cadena vacía)'
      - id: 'b'
        text: 'null'
      - id: 'c'
        text: '0'
      - id: 'd'
        text: 'Produce un error de compilación.'
    correctOptionId: 'b'
    explanation: >-
      Las referencias a objetos (como String) tienen null como valor por
      defecto, a diferencia de los tipos primitivos numéricos.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Dentro de un método de instancia, ¿qué representa la palabra reservada this?'
    options:
      - id: 'a'
        text: 'La clase donde está definido el método.'
      - id: 'b'
        text: 'Una referencia implícita al objeto actual que está ejecutando el método.'
      - id: 'c'
        text: 'El valor que devuelve el método.'
      - id: 'd'
        text: 'Un atributo compartido por todas las instancias de la clase.'
    correctOptionId: 'b'
    explanation: >-
      this es una referencia implícita al objeto sobre el cual se invocó el
      método; permite acceder a sus atributos y pasar la instancia actual
      como argumento a otros métodos.
  - kind: 'true-false'
    id: 'q7'
    prompt: >-
      Si el parámetro de un método se llama igual que un atributo de la
      clase (por ejemplo, ambos se llaman precio), es necesario escribir
      this.precio dentro del método para referirse al atributo en lugar de
      al parámetro local.
    correctAnswer: true
    explanation: >-
      Es el fenómeno de sombreamiento de variables (variable shadowing): el
      parámetro local "tapa" al atributo dentro del método, así que
      this.precio es la forma de desambiguar y referirse al atributo del
      objeto.
  - kind: 'single-choice'
    id: 'q8'
    prompt: >-
      Persona p1 = new Persona(); p1.nombre = "Ana"; Persona p2 = p1;
      p2.nombre = "Ana María"; ¿Qué valor tiene p1.nombre después de estas
      líneas?
    options:
      - id: 'a'
        text: 'Sigue siendo "Ana": p1 y p2 son objetos independientes.'
      - id: 'b'
        text: '"Ana María": p1 y p2 son dos referencias al mismo objeto en el Heap.'
      - id: 'c'
        text: 'null, porque p2 sobrescribió a p1.'
      - id: 'd'
        text: 'El código no compila.'
    correctOptionId: 'b'
    explanation: >-
      Persona p2 = p1; copia la referencia, no el objeto. p1 y p2 apuntan al
      mismo objeto en el Heap, así que modificar p2.nombre también se ve
      reflejado al leer p1.nombre.
  - kind: 'true-false'
    id: 'q9'
    prompt: >-
      La variable de referencia de un objeto (por ejemplo, Persona p1) se
      almacena en el Stack, mientras que los datos del objeto en sí residen
      en el Heap.
    correctAnswer: true
    explanation: >-
      Así funciona la memoria en Java: el Stack guarda la referencia (la
      "dirección") dentro del stack frame del método, mientras que el
      objeto con sus atributos vive en el Heap.
  - kind: 'single-choice'
    id: 'q10'
    prompt: >-
      Persona p1 = new Persona(); p1.nombre = "Laura"; Persona p2 = new
      Persona(); p2.nombre = "Carlos"; p1.nombre = "Marta";
      System.out.println(p2.nombre); ¿Qué imprime este código?
    options:
      - id: 'a'
        text: 'Marta'
      - id: 'b'
        text: 'Carlos'
      - id: 'c'
        text: 'Laura'
      - id: 'd'
        text: 'null'
    correctOptionId: 'b'
    explanation: >-
      A diferencia del caso de aliasing, acá p1 y p2 se crearon con dos
      llamadas a new independientes: son dos objetos distintos en el Heap.
      Cambiar p1.nombre no afecta a p2, que conserva "Carlos".
---

Marcá una respuesta en cada pregunta y presioná **Calificar** para ver tu
puntaje sobre 10 y la explicación de cada una.
