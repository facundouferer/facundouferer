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
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Un programa pide un número con `Scanner` y el usuario escribe `abc`. ¿Qué excepción lanza `leer.nextInt()` y de qué tipo es?'
    code: |
      Scanner leer = new Scanner(System.in);
      int nroUno = leer.nextInt();   // el usuario escribe: abc
    options:
      - id: 'a'
        text: '`NumberFormatException`, una excepción checked.'
      - id: 'b'
        text: '`IOException`, una excepción checked que el compilador obliga a capturar.'
      - id: 'c'
        text: '`InputMismatchException`, una excepción unchecked (hereda de `RuntimeException`), por lo que el compilador no obliga a capturarla.'
      - id: 'd'
        text: '`ArithmeticException`, porque `abc` no se puede convertir en número.'
    correctOptionId: 'c'
    explanation: >-
      `Scanner.nextInt()` lanza `InputMismatchException` cuando el siguiente texto no tiene formato de entero. Es unchecked: el compilador no te obliga a manejarla, pero un programa robusto debe prever que el usuario puede escribir cualquier cosa. `NumberFormatException` es la que lanza `Integer.parseInt`, no `Scanner`.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'En este código, el `catch (ArithmeticException e)` nunca se ejecuta aunque el usuario ingrese `0` como segundo número, porque la división es entre un `int` y un `double` y el resultado es `Infinity`.'
    code: |
      try {
          int nroUno = leer.nextInt();
          double nroDos = leer.nextInt();
          double resultado = nroUno / nroDos;
          System.out.println("El resultado es: " + resultado);
      } catch (ArithmeticException e) {
          System.out.println("No se puede dividir por ZERO!");
      }
    correctAnswer: true
    explanation: >-
      Verdadero. `ArithmeticException` solo se lanza en la división entera por cero (`int / int`). Cuando algún operando es `double`, la división sigue la aritmética de punto flotante y devuelve `Infinity` (o `NaN` en `0.0 / 0.0`) sin lanzar nada. Moraleja: un `catch` solo sirve si el código del `try` realmente puede lanzar esa excepción.
  - kind: 'single-choice'
    id: 'q13'
    prompt: 'En este código con `try` anidados, el usuario escribe `hola` como primer número. ¿Qué se imprime?'
    code: |
      int nroUno = 0;
      int nroDos = 0;
      try {
          try {
              nroUno = leer.nextInt();
              nroDos = leer.nextInt();
          } catch (Exception e) {
              System.out.println("Solo se admiten números");
          }
          System.out.println(nroUno / nroDos);
      } catch (ArithmeticException e) {
          System.out.println("No pudimos dividir: " + e.getMessage());
      }
      System.out.println("Fin del programa");
    options:
      - id: 'a'
        text: 'Solo se admiten números / No pudimos dividir: / by zero / Fin del programa'
      - id: 'b'
        text: 'Solo se admiten números / Fin del programa'
      - id: 'c'
        text: 'La excepción escapa de ambos `try` y el programa termina con un stack trace.'
      - id: 'd'
        text: 'Solo se admiten números / 0 / Fin del programa'
    correctOptionId: 'a'
    explanation: >-
      El `catch (Exception e)` interno atrapa la `InputMismatchException` y el flujo continúa después del `try` interno. Pero como `nroUno` y `nroDos` quedaron en `0`, la división `0 / 0` lanza `ArithmeticException` con mensaje `/ by zero`, que atrapa el `catch` externo. Atrapar una excepción no "arregla" el estado: acá los datos quedaron inválidos y el error reaparece más abajo.
  - kind: 'true-false'
    id: 'q14'
    prompt: 'Es válido escribir `catch (InputMismatchException e)`, luego `catch (ArithmeticException e)` y al final `catch (Exception e)`: el último actúa como red de seguridad para cualquier excepción que no se haya previsto.'
    correctAnswer: true
    explanation: >-
      Verdadero. Los `catch` se evalúan en orden, y mientras las clases específicas (que no se heredan entre sí) estén antes que la general `Exception`, el código compila. El `catch (Exception e)` final atrapa lo imprevisto. Eso sí: úsalo para informar o registrar el error, nunca vacío.
  - kind: 'single-choice'
    id: 'q15'
    prompt: 'Se define una excepción propia y un método que la declara. ¿Qué ocurre al compilar `main`?'
    code: |
      class LongitudDelNumero extends Exception {
          public LongitudDelNumero(String mensaje) { super(mensaje); }
      }

      static void evaluarNumero(int n) throws LongitudDelNumero {
          if (n < 100) throw new LongitudDelNumero("Número inferior a 100");
      }

      public static void main(String[] args) {
          evaluarNumero(50);
      }
    options:
      - id: 'a'
        text: 'Compila y, al ejecutar, imprime el stack trace de `LongitudDelNumero`.'
      - id: 'b'
        text: 'Error de compilación: la excepción es checked y `main` debe capturarla con `try-catch` o declararla con `throws`.'
      - id: 'c'
        text: 'Compila, pero la JVM ignora la excepción porque es personalizada.'
      - id: 'd'
        text: 'Error de compilación: `throw` solo puede usarse con excepciones de la biblioteca estándar de Java.'
    correctOptionId: 'b'
    explanation: >-
      Al extender `Exception` (sin ser `RuntimeException`), `LongitudDelNumero` es checked. El compilador exige que quien llama a `evaluarNumero` la maneje o la propague. Si hubiera extendido `RuntimeException`, el código compilaría sin ese requisito.
  - kind: 'true-false'
    id: 'q16'
    prompt: 'Una excepción propia que declara `class NumeroPequenio extends IOException` es unchecked, porque la creó el programador y no pertenece a la biblioteca estándar.'
    correctAnswer: false
    explanation: >-
      Falso. Que una excepción sea checked o unchecked depende de su herencia, no de quién la escribió: `IOException` es checked, así que todas sus subclases también lo son. Además, extender `IOException` para un error que no tiene que ver con entrada/salida confunde el diseño; conviene extender `Exception` (checked) o `RuntimeException` (unchecked) según corresponda.
  - kind: 'single-choice'
    id: 'q17'
    prompt: 'Este código intenta dividir por cero pero el único `catch` es de otro tipo. ¿Qué pasa?'
    code: |
      try {
          int resultado = 10 / 0;
      } catch (InputMismatchException e) {
          System.out.println("Texto inválido");
      } finally {
          System.out.println("Limpieza");
      }
      System.out.println("Fin del programa");
    options:
      - id: 'a'
        text: 'Imprime `Texto inválido`, `Limpieza` y `Fin del programa`.'
      - id: 'b'
        text: 'Imprime `Limpieza` y `Fin del programa`; el `finally` absorbe la excepción.'
      - id: 'c'
        text: 'Imprime solo `Fin del programa`; el `finally` no corre si ningún `catch` coincide.'
      - id: 'd'
        text: 'Imprime `Limpieza`, y luego la `ArithmeticException` sigue propagándose: el programa termina con un stack trace y nunca llega a `Fin del programa`.'
    correctOptionId: 'd'
    explanation: >-
      Ningún `catch` coincide con `ArithmeticException`, así que la excepción no queda atrapada. Aun así, `finally` se ejecuta siempre antes de abandonar el bloque, e imprime `Limpieza`. Después la excepción sigue subiendo por la pila, y como nadie la captura el hilo termina con el stack trace. `finally` limpia, pero no atrapa.
  - kind: 'true-false'
    id: 'q18'
    prompt: 'Cuando se escribe `try (FileWriter writer = new FileWriter(ruta)) { ... }`, el `FileWriter` se cierra automáticamente al terminar el bloque, haya ocurrido una excepción o no, sin necesidad de llamar a `writer.close()` ni de usar un `finally`.'
    correctAnswer: true
    explanation: >-
      Verdadero. Es `try-with-resources`: todo recurso que implemente `AutoCloseable` y se declare entre los paréntesis del `try` se cierra solo. Además, `FileWriter` lanza `IOException` (checked) si la ruta no es válida, por ejemplo si el directorio no existe, así que igualmente hace falta un `catch (IOException e)` o un `throws`.
  - kind: 'single-choice'
    id: 'q19'
    prompt: 'Un programa repite la lectura de un número dentro de un `while` y, ante una `InputMismatchException`, ejecuta `leer.nextLine()` dentro del `catch`. ¿Para qué sirve esa llamada?'
    code: |
      while (seguir) {
          try {
              int nroUno = leer.nextInt();
              seguir = false;
          } catch (InputMismatchException e) {
              System.out.println("Error al ingresar los datos");
              leer.nextLine();
          }
      }
    options:
      - id: 'a'
        text: 'Para volver a lanzar la excepción hacia el método llamador.'
      - id: 'b'
        text: 'Para descartar el texto inválido que quedó en el buffer del `Scanner`; sin eso, el siguiente `nextInt()` lo vuelve a leer, falla otra vez y el bucle no termina nunca.'
      - id: 'c'
        text: 'Para cerrar el `Scanner` y liberar el recurso.'
      - id: 'd'
        text: 'Para convertir el texto inválido en un número por defecto.'
    correctOptionId: 'b'
    explanation: >-
      Cuando `nextInt()` falla, el token inválido no se consume: sigue en el buffer. Si no se descarta con `nextLine()`, cada reintento lee lo mismo y lanza la misma excepción, generando un bucle infinito. Es el patrón clásico para validar entrada con reintento.
  - kind: 'true-false'
    id: 'q20'
    prompt: 'Un método que ejecuta `throw new IllegalArgumentException("El DNI debe ser positivo")` está obligado a declarar `throws IllegalArgumentException` en su firma; de lo contrario no compila.'
    correctAnswer: false
    explanation: >-
      Falso. `IllegalArgumentException` es unchecked (hereda de `RuntimeException`), por lo que el compilador no exige `throws` ni `try-catch`. En cambio, un método que lance una excepción propia que extiende `Exception` (como `MenorDeEdadException`) sí debe declararla con `throws` o capturarla dentro.
---
