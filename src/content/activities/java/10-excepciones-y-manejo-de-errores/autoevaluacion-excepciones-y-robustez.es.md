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
    prompt: 'Observá estas dos excepciones y los métodos que las lanzan. ¿Qué diferencia hay entre ellos para el compilador?'
    code: |
      class ArchivoNoEncontradoException extends Exception { }
      class EdadInvalidaException extends RuntimeException { }
      
      static void a() {
          throw new ArchivoNoEncontradoException();
      }
      
      static void b() {
          throw new EdadInvalidaException();
      }
    options:
      - id: 'a'
        text: 'Ambos compilan sin problemas; la diferencia es solo el nombre de la clase.'
      - id: 'b'
        text: '`a()` no compila: la excepción es checked y exige `try-catch` o `throws`; `b()` compila porque la excepción es unchecked (hereda de `RuntimeException`).'
      - id: 'c'
        text: '`b()` no compila porque las excepciones unchecked siempre deben declararse con `throws`.'
      - id: 'd'
        text: 'Ninguno compila: `throw` solo se puede usar dentro de un `try`.'
    correctOptionId: 'b'
    explanation: >-
      Las checked exceptions representan condiciones de error recuperables del entorno (como archivos no encontrados o fallas de red) y el compilador exige gestionarlas. Las unchecked (hijas de `RuntimeException`) suelen representar errores de programación o violación de precondiciones (como `NullPointerException` o `IllegalArgumentException`).
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Observá el método. Al llamar a `leer()`, se imprime `cierre` aunque el `try` ejecute un `return`.'
    code: |
      static int leer() {
          try {
              return 1;
          } finally {
              System.out.println("cierre");
          }
      }
    correctAnswer: true
    explanation: >-
      Verdadero. La garantía fundamental de `finally` es ejecutarse siempre antes de salir del ámbito del método, lo que lo hace el lugar idóneo para liberar recursos, cerrar conexiones o emitir registros de auditoría.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'Observá el código. ¿Por qué es una mala idea el `catch (Error e)` en este caso?'
    code: |
      try {
          recursivo(1);
      } catch (Error e) {
          System.out.println("Seguimos como si nada");
      }
      
      static void recursivo(int n) {
          recursivo(n + 1);   // sin caso base
      }
    options:
      - id: 'a'
        text: 'Porque Java no permite sintácticamente escribir `catch (Error e)`.'
      - id: 'b'
        text: 'Porque el desbordamiento de pila (`StackOverflowError`) es una falla grave de la JVM: la aplicación no puede garantizar un estado consistente después de atraparlo.'
      - id: 'c'
        text: 'Porque los `Error` solo pueden producirse en lenguajes no tipados.'
      - id: 'd'
        text: 'Porque al capturar un `Error` se desinstala el recolector de basura.'
    correctOptionId: 'b'
    explanation: >-
      La recursión sin caso base lanza `StackOverflowError`, un `Error`: indica un problema grave de la JVM (pila agotada). Atraparlo y seguir ejecutando es un antipatrón peligroso porque el estado interno ya no es confiable. Lo correcto es arreglar la causa, en este caso agregar un caso base.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'Observá el método. Según este código, `throws` (en la firma) instancia y lanza la excepción, mientras que `throw` (en el cuerpo) declara qué excepciones pueden propagarse al llamador.'
    code: |
      static void validar(int n) throws IllegalArgumentException {
          if (n < 0) {
              throw new IllegalArgumentException("negativo");
          }
      }
    correctAnswer: false
    explanation: >-
      Falso. Es exactamente al revés: `throw` (en singular) se usa dentro del cuerpo del método para lanzar una instancia concreta (`throw new MiExcepcion();`), mientras que `throws` (en plural) se utiliza en la firma del método para declarar las excepciones checked que pueden escapar (`void metodo() throws IOException`).
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Observá la cadena de llamadas. ¿Qué ocurre al ejecutar `main`?'
    code: |
      static void a() {
          b();
          System.out.println("fin a");
      }
      static void b() {
          c();
          System.out.println("fin b");
      }
      static void c() {
          throw new IllegalStateException("falla");
      }
      public static void main(String[] args) {
          a();
          System.out.println("fin main");
      }
    options:
      - id: 'a'
        text: 'La excepción sube por `c`, `b`, `a` y `main` sin que nadie la capture: no se imprime ningún "fin" y el hilo termina con el stack trace.'
      - id: 'b'
        text: 'Se imprime `fin b`, `fin a` y `fin main`, y después el stack trace.'
      - id: 'c'
        text: 'La excepción se convierte silenciosamente en `null` y se imprime `fin main`.'
      - id: 'd'
        text: '`c()` retorna cero automáticamente y la ejecución continúa.'
    correctOptionId: 'a'
    explanation: >-
      Ningún método tiene `catch`, así que la excepción se propaga hacia atrás por los frames de la pila (`c` → `b` → `a` → `main`). Cada método queda abandonado inmediatamente, por eso las líneas que siguen a cada llamada nunca se ejecutan. Al llegar a la base sin ser capturada, el hilo termina y la JVM muestra el stack trace.
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
    prompt: 'Observá la clase. Esta excepción personalizada es válida: además del mensaje heredado de `Throwable`, transporta un atributo de dominio propio (`montoSolicitado`).'
    code: |
      class SaldoInsuficienteException extends Exception {
          private final double montoSolicitado;
      
          public SaldoInsuficienteException(String mensaje, double montoSolicitado) {
              super(mensaje);
              this.montoSolicitado = montoSolicitado;
          }
      
          public double getMontoSolicitado() {
              return montoSolicitado;
          }
      }
    correctAnswer: true
    explanation: >-
      Verdadero. Al ser una clase Java estándar, una excepción propia puede y debe enriquecerse con campos inmutables y métodos que provean información contextual valiosa para el registro y manejo del error.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Observá el código. ¿Qué método de `Throwable` falta en el `catch` interno para recuperar la excepción original (`SQLException`) que provocó `RepositorioException`?'
    code: |
      try {
          try {
              repo.buscar(id);
          } catch (SQLException e) {
              throw new RepositorioException("No se pudo consultar", e);
          }
      } catch (RepositorioException e) {
          Throwable original = e.______();
      }
    options:
      - id: 'a'
        text: '`getRootException()`'
      - id: 'b'
        text: '`getCause()`'
      - id: 'c'
        text: '`getPrevious()`'
      - id: 'd'
        text: '`getCaller()`'
    correctOptionId: 'b'
    explanation: >-
      `getCause()` devuelve el `Throwable` original que fue pasado como causa al construir la excepción actual (por ejemplo, `new MiExcepcion("Fallo en servicio", sqlException)`), preservando la cadena diagnóstica completa.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Observá el código. Recorrer el array hasta que salte `ArrayIndexOutOfBoundsException` para terminar el bucle es una práctica recomendada y de alto rendimiento.'
    code: |
      int[] arr = {10, 20, 30};
      int i = 0;
      try {
          while (true) {
              System.out.println(arr[i]);
              i++;
          }
      } catch (ArrayIndexOutOfBoundsException e) {
          System.out.println("fin");
      }
    correctAnswer: false
    explanation: >-
      Falso. Las excepciones están pensadas para situaciones anómalas. Crear y propagar excepciones implica capturar el Stack Trace de la pila de llamadas, lo que conlleva un coste de procesamiento significativo; jamás deben usarse para sustituir condiciones booleanas normales de parada en bucles.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Observá el orden de los bloques `catch`. ¿Qué ocurre al compilar?'
    code: |
      static void abrir() throws IOException { ... }
      
      try {
          abrir();
      } catch (Exception e) {
          System.out.println("Error general");
      } catch (IOException e) {
          System.out.println("Error de entrada/salida");
      }
    options:
      - id: 'a'
        text: 'Compila, y ante una `IOException` se ejecuta el primer `catch` porque se evalúa de arriba hacia abajo.'
      - id: 'b'
        text: 'Error de compilación: el `catch (IOException e)` es inalcanzable porque `Exception` ya atrapa todas sus subclases; hay que ordenar de la más específica a la más general.'
      - id: 'c'
        text: 'Compila con una advertencia, pero ambos `catch` se ejecutan.'
      - id: 'd'
        text: 'Compila, porque `Exception` solo atrapa excepciones unchecked.'
    correctOptionId: 'b'
    explanation: >-
      Java evalúa los `catch` de arriba hacia abajo. `catch (Exception e)` en primer lugar atrapa todas las excepciones hijas, por lo que el `catch (IOException e)` nunca podría ejecutarse y el compilador lo rechaza como código inalcanzable. Se debe invertir el orden: primero `IOException`, después `Exception`.
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
    prompt: 'Observá los bloques `catch`. Este orden es válido: el último `catch (Exception e)` actúa como red de seguridad para cualquier excepción que no se haya previsto.'
    code: |
      try {
          int numero = leer.nextInt();
          System.out.println(100 / numero);
      } catch (InputMismatchException e) {
          System.out.println("Debés ingresar un número");
      } catch (ArithmeticException e) {
          System.out.println("No se puede dividir por cero");
      } catch (Exception e) {
          System.out.println("Algo salió mal: " + e.getMessage());
      }
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
    prompt: 'Observá la clase. Esta excepción propia es unchecked, porque la creó el programador y no pertenece a la biblioteca estándar.'
    code: |
      class NumeroPequenio extends IOException {
          public NumeroPequenio(String mensajeError) {
              super(mensajeError);
          }
      }
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
    prompt: 'Observá el código. El `FileWriter` se cierra automáticamente al terminar el bloque, haya ocurrido una excepción o no, sin llamar a `writer.close()` ni usar un `finally`.'
    code: |
      try (FileWriter writer = new FileWriter(ruta)) {
          writer.write("Hola, este es un archivo de prueba.");
      } catch (IOException e) {
          System.out.println("Ocurrió un error al escribir en el archivo.");
      }
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
    prompt: 'Observá el método. Para compilar, `validarDni` debería declarar `throws IllegalArgumentException` en su firma.'
    code: |
      static void validarDni(int dni) {
          if (dni <= 0) {
              throw new IllegalArgumentException("El DNI debe ser positivo");
          }
      }
    correctAnswer: false
    explanation: >-
      Falso. `IllegalArgumentException` es unchecked (hereda de `RuntimeException`), por lo que el compilador no exige `throws` ni `try-catch`. En cambio, un método que lance una excepción propia que extiende `Exception` (como `MenorDeEdadException`) sí debe declararla con `throws` o capturarla dentro.
---
