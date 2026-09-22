---
course: 'java'
lesson: '01-conceptos-basicos'
slug: 'autoevaluacion-conceptos-basicos'
title: 'Autoevaluación: Conceptos Básicos y Plataforma Java'
description: 'Diez preguntas sobre arquitectura Java, JDK vs JRE vs JVM, bytecode, compilación y paso de argumentos.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es la responsabilidad principal de la Máquina Virtual de Java (JVM)?'
    options:
      - id: 'a'
        text: 'Cargar, verificar y ejecutar el bytecode traduciéndolo a instrucciones del sistema operativo anfitrión.'
      - id: 'b'
        text: 'Compilar el código fuente .java directamente a binario ejecutable del procesador.'
      - id: 'c'
        text: 'Proveer un editor de texto interactivo para desarrolladores.'
      - id: 'd'
        text: 'Servir como base de datos interna para las variables del programa.'
    correctOptionId: 'a'
    explanation: >-
      La JVM es una máquina abstracta simulada por software que toma el bytecode
      contenido en archivos `.class`, lo verifica mediante el Bytecode Verifier
      y lo ejecuta sobre el hardware destino usando su intérprete y el compilador JIT.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'El bytecode (.class) generado por javac es específico de la arquitectura del procesador (como x86 o ARM).'
    correctAnswer: false
    explanation: >-
      El bytecode es un conjunto de instrucciones universal e independiente del
      hardware. Es precisamente la JVM de cada sistema operativo la encargada de
      traducir ese bytecode neutral a las instrucciones específicas del procesador.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'Si declarás una clase pública llamada `public class ServidorWeb`, ¿cómo debe nombrarse obligatoriamente su archivo fuente?'
    options:
      - id: 'a'
        text: 'servidorweb.java (las mayúsculas no importan en Java).'
      - id: 'b'
        text: 'ServidorWeb.java, respetando exactamente mayúsculas y minúsculas.'
      - id: 'c'
        text: 'ServidorWeb.class.'
      - id: 'd'
        text: 'Cualquier nombre es válido siempre que esté en la misma carpeta.'
    correctOptionId: 'b'
    explanation: >-
      En Java, una clase pública exige que el archivo físico coincida exactamente
      con su nombre, incluyendo la distinción entre mayúsculas y minúsculas
      (`ServidorWeb.java`). De lo contrario, `javac` rechaza la compilación con un error.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'El comando javac ejecuta directamente el programa en la consola sin generar archivos en el disco.'
    correctAnswer: false
    explanation: >-
      `javac` es el compilador de Java: toma el archivo fuente `.java` y genera
      el archivo binario `.class` (bytecode). Para ejecutar el programa se debe
      invocar a la JVM mediante el comando `java`.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Por qué el método `main` se declara con el modificador `static`?'
    options:
      - id: 'a'
        text: 'Porque la JVM necesita invocar el método de inicio sin instanciar previamente un objeto de la clase.'
      - id: 'b'
        text: 'Para indicar que las variables dentro del método no pueden cambiar de valor.'
      - id: 'c'
        text: 'Porque es una regla que solo aplica en sistemas operativos Windows.'
      - id: 'd'
        text: 'Para evitar que el programa consuma memoria en la JVM.'
    correctOptionId: 'a'
    explanation: >-
      Al ser `static`, el método pertenece a la clase en sí y no a una instancia.
      Esto permite que la JVM busque y ejecute el punto de entrada inmediatamente
      después de cargar la clase, sin requerir la creación de un objeto con `new`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Tras compilar con éxito un archivo `Calculadora.java`, ¿cuál es el comando correcto para ejecutar el programa en la terminal?'
    options:
      - id: 'a'
        text: 'java Calculadora'
      - id: 'b'
        text: 'java Calculadora.class'
      - id: 'c'
        text: 'javac Calculadora'
      - id: 'd'
        text: 'run Calculadora.java'
    correctOptionId: 'a'
    explanation: >-
      El comando `java` recibe el nombre de la clase completamente calificado,
      nunca el nombre del archivo con extensión `.class`. Si escribís `java Calculadora.class`,
      la JVM buscará una clase llamada `class` dentro de un paquete `Calculadora` y fallará.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué ocurre al ejecutar este programa desde la terminal sin pasar ningún argumento?'
    code: |-
      public class Saludo {
          public static void main(String[] args) {
              System.out.println(args[0]);
          }
      }
    options:
      - id: 'a'
        text: 'Imprime null en la consola.'
      - id: 'b'
        text: 'Lanza una excepción ArrayIndexOutOfBoundsException en tiempo de ejecución.'
      - id: 'c'
        text: 'El código no compila porque args está vacío.'
      - id: 'd'
        text: 'Imprime una cadena vacía "" sin errores.'
    correctOptionId: 'b'
    explanation: >-
      Cuando no se pasan argumentos desde la terminal, el array `args` tiene
      longitud 0 (`args.length == 0`). Intentar acceder al índice `0` provoca
      un `ArrayIndexOutOfBoundsException` al ejecutarse. Por eso siempre se debe
      verificar el tamaño antes de indexar.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'El compilador JIT (Just-In-Time) dentro de la JVM traduce fragmentos frecuentes de bytecode a código máquina nativo para optimizar la velocidad.'
    correctAnswer: true
    explanation: >-
      El compilador JIT analiza el código mientras se ejecuta e identifica las
      partes más calientes (*hotspots*), compilándolas directamente a código de
      máquina nativo para que corran a la máxima velocidad del procesador.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'De acuerdo con las convenciones estándar de código en Java, ¿cuál de los siguientes nombres identifica correctamente a una clase?'
    options:
      - id: 'a'
        text: 'gestor_usuarios'
      - id: 'b'
        text: 'GestorUsuarios'
      - id: 'c'
        text: 'gestorUsuarios'
      - id: 'd'
        text: 'GESTOR_USUARIOS'
    correctOptionId: 'b'
    explanation: >-
      Las clases e interfaces en Java siguen la convención `PascalCase` (cada
      palabra inicia con mayúscula, sin guiones ni subrayados). `camelCase` se
      reserva para métodos y variables, mientras que `UPPER_SNAKE_CASE` se usa
      para constantes.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'En la firma `public static void main(String[] args)`, la palabra `void` indica que el método no devuelve ningún valor al finalizar.'
    correctAnswer: true
    explanation: >-
      `void` especifica que el método no retorna datos al invocador. A diferencia
      de lenguajes como C, en Java el método `main` no retorna un código entero
      de salida: si se necesita finalizar con un código específico, se utiliza
      `System.exit(codigo)`.
---

Elegí una respuesta por pregunta y presioná **Calificar** para revisar tu comprensión de los fundamentos de la plataforma Java.
