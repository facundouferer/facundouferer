---
course: 'java'
lesson: '10-excepciones-y-manejo-de-errores'
slug: 'autoevaluacion-excepciones-y-robustez'
title: 'Autoevaluación: Manejo de Excepciones, Jerarquía Throwable y Robustez'
description: 'Validá tus conocimientos sobre checked vs unchecked, try-catch-finally, propagación en la pila y diseño de excepciones personalizadas.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'En la jerarquía de Java que desciende de `Throwable`, ¿cuál es la diferencia crucial entre una excepción "checked" y una "unchecked"?'
    options:
      - id: 'a'
        text: 'Las checked son lanzadas exclusivamente por el sistema operativo, mientras que las unchecked las crea la JVM.'
      - id: 'b'
        text: 'Las checked (subclases directas de Exception) obligan al compilador a verificar que sean capturadas con try-catch o declaradas con throws; las unchecked (subclases de RuntimeException) no exigen este tratamiento obligatorio al compilar.'
      - id: 'c'
        text: 'Las unchecked consumen memoria en el Heap y las checked en el Stack.'
      - id: 'd'
        text: 'No hay diferencia técnica; es solo una convención de nombres.'
    correctOptionId: 'b'
    explanation: >-
      Las checked exceptions representan condiciones de error recuperables del entorno (como archivos no encontrados o fallas de red) y el compilador exige gestionarlas. Las unchecked (hijas de `RuntimeException`) suelen representar errores de programación o violación de precondiciones (como `NullPointerException` o `IllegalArgumentException`).
  - kind: 'true-false'
    id: 'q2'
    prompt: 'El bloque `finally` se ejecuta siempre, tanto si el bloque `try` termina exitosamente como si se produce una excepción atrapada por un `catch` o incluso si el `try` ejecuta una sentencia `return`.'
    correctAnswer: true
    explanation: >-
      Verdadero. La garantía fundamental de `finally` es ejecutarse siempre antes de salir del ámbito del método, lo que lo hace el lugar idóneo para liberar recursos, cerrar conexiones o emitir registros de auditoría.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Por qué se desaconseja terminantemente capturar la clase `Error` (como `OutOfMemoryError` o `StackOverflowError`) en un bloque `catch` ordinario?'
    options:
      - id: 'a'
        text: 'Porque Java no permite sintácticamente escribir catch (Error e).'
      - id: 'b'
        text: 'Porque los Errores representan fallas críticas e irrecuperables de la propia máquina virtual (JVM) ante las cuales la aplicación no puede garantizar un estado consistente.'
      - id: 'c'
        text: 'Porque los Errores solo pueden producirse en lenguajes no tipados.'
      - id: 'd'
        text: 'Porque al capturar un Error se desinstala el recolector de basura.'
    correctOptionId: 'b'
    explanation: >-
      Los `Error` indican problemas graves en el subsistema de la JVM (agotamiento de memoria de Heap, desbordamiento físico de pila). Intentar atraparlos y seguir ejecutando es un antipatrón peligroso porque la memoria o el estado interno ya están corrompidos.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'La palabra clave `throw` se utiliza para declarar en la firma del método qué excepciones pueden propagarse al llamador, mientras que `throws` se usa para instanciar y lanzar la excepción.'
    correctAnswer: false
    explanation: >-
      Falso. Es exactamente al revés: `throw` (en singular) se usa dentro del cuerpo del método para lanzar una instancia concreta (`throw new MiExcepcion();`), mientras que `throws` (en plural) se utiliza en la firma del método para declarar las excepciones checked que pueden escapar (`void metodo() throws IOException`).
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué sucede si un método lanza una excepción y ni ese método ni sus llamadores en la pila de ejecución la capturan con un bloque `catch`?'
    options:
      - id: 'a'
        text: 'La excepción se propaga subiendo por el Call Stack hasta el hilo principal; si nadie la atrapa, el hilo termina abruptamente imprimiendo el Stack Trace en consola.'
      - id: 'b'
        text: 'La JVM reinicia el método problemático desde la primera línea automáticamente.'
      - id: 'c'
        text: 'La excepción se convierte silenciosamente en null y la ejecución continúa.'
      - id: 'd'
        text: 'El método retorna automáticamente el valor cero.'
    correctOptionId: 'a'
    explanation: >-
      Las excepciones se propagan hacia atrás a través de los Stack Frames en la pila de llamadas hasta encontrar un bloque `catch` compatible. Si la excepción alcanza la base de la pila sin ser capturada, el hilo finaliza y la JVM muestra la traza de error.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Por qué dejar un bloque `catch` completamente vacío (swallowing exception) se considera uno de los peores antipatrones de programación?'
    code: |
      try {
          procesarArchivo();
      } catch (Exception e) {
          // vacío
      }
    options:
      - id: 'a'
        text: 'Porque el compilador genera un error de sintaxis impidiendo compilar.'
      - id: 'b'
        text: 'Porque silencia la falla por completo, ocultando la causa raíz del problema y dejando la aplicación en un estado inconsistente sin que nadie sepa que algo falló.'
      - id: 'c'
        text: 'Porque duplica el tamaño del archivo bytecode .class.'
      - id: 'd'
        text: 'Porque bloquea el Garbage Collector indefinidamente.'
    correctOptionId: 'b'
    explanation: >-
      "Tragarse" excepciones destruye la visibilidad de los errores: el programa continúa como si nada hubiera ocurrido, pero con datos corruptos o transacciones a medio hacer, volviendo la depuración casi imposible.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Una excepción personalizada en Java puede encapsular y transportar atributos de dominio propios (como `montoSolicitado` o `idUsuario`) además del mensaje textual heredado de `Throwable`.'
    correctAnswer: true
    explanation: >-
      Verdadero. Al ser una clase Java estándar, una excepción propia puede y debe enriquecerse con campos inmutables y métodos que provean información contextual valiosa para el registro y manejo del error.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'En el encadenamiento de excepciones (exception chaining), ¿qué método de `Throwable` permite recuperar la excepción original que provocó la excepción actual?'
    options:
      - id: 'a'
        text: 'e.getRootException()'
      - id: 'b'
        text: 'e.getCause()'
      - id: 'c'
        text: 'e.getPrevious()'
      - id: 'd'
        text: 'e.getCaller()'
    correctOptionId: 'b'
    explanation: >-
      `getCause()` devuelve el `Throwable` original que fue pasado como causa al construir la excepción actual (por ejemplo, `new MiExcepcion("Fallo en servicio", sqlException)`), preservando la cadena diagnóstica completa.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Utilizar excepciones de forma habitual para controlar el flujo normal de bucles (por ejemplo, recorrer un array hasta que salte un `ArrayIndexOutOfBoundsException` para terminar el bucle) es una práctica recomendada de alto rendimiento.'
    correctAnswer: false
    explanation: >-
      Falso. Las excepciones están pensadas para situaciones anómalas. Crear y propagar excepciones implica capturar el Stack Trace de la pila de llamadas, lo que conlleva un coste de procesamiento significativo; jamás deben usarse para sustituir condiciones booleanas normales de parada en bucles.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Cuando se declaran múltiples bloques `catch` para un mismo `try`, ¿cuál es la regla obligatoria respecto al orden en que deben ubicarse?'
    options:
      - id: 'a'
        text: 'Deben ordenarse alfabéticamente por el nombre de la clase.'
      - id: 'b'
        text: 'Deben ordenarse de la subclase más específica a la superclase más general; de lo contrario, el compilador avisa que el bloque más específico es inalcanzable.'
      - id: 'c'
        text: 'La clase general Exception debe ir obligatoriamente en el primer bloque catch.'
      - id: 'd'
        text: 'El orden es completamente irrelevante para el compilador de Java.'
    correctOptionId: 'b'
    explanation: >-
      Java evalúa los bloques `catch` de arriba hacia abajo. Si se coloca un `catch (Exception e)` al principio, este atrapará todas las excepciones hijas antes de que puedan llegar a bloques más específicos como `catch (IOException e)`, provocando un error de código inalcanzable al compilar.
---
