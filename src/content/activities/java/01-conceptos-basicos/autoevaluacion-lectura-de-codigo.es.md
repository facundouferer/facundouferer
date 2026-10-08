---
course: 'java'
lesson: '01-conceptos-basicos'
slug: 'autoevaluacion-lectura-de-codigo'
title: 'Autoevaluación: Lectura y Análisis de Código Java'
description: 'Doce fragmentos de código Java para analizar: estructura de una clase, errores de compilación, comentarios, convenciones, argumentos por consola, versiones del JDK y lectura del Javadoc.'
kind: 'quiz'
order: 3
lang: 'es'
published: true
estimatedMinutes: 25
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué ocurre al ejecutar `javac Programa.java` con este archivo?'
    code: |-
      System.out.println("Inicio");

      public class Programa {
          public static void main(String[] args) {
              System.out.println("Programa");
          }
      }
    options:
      - id: 'a'
        text: 'Compila y, al ejecutar `java Programa`, muestra `Inicio` y luego `Programa`.'
      - id: 'b'
        text: 'Compila y, al ejecutar `java Programa`, muestra solo `Programa`, porque la JVM ignora lo que está fuera de la clase.'
      - id: 'c'
        text: 'No compila: la primera instrucción está fuera de una clase y `javac` la rechaza.'
      - id: 'd'
        text: 'Compila, pero falla al ejecutar porque el programa tiene dos puntos de entrada.'
    correctOptionId: 'c'
    explanation: >-
      En Java todo el código vive obligatoriamente dentro de una clase: no
      existen instrucciones sueltas en el archivo. `javac` rechaza la primera
      línea con `error: class, interface, enum, or record expected` y, como hay
      un error, no genera `Programa.class`. Para que se imprima `Inicio`, esa
      instrucción debe moverse dentro de `main`.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué ocurre al ejecutar `javac HolaMundo.java` con este código?'
    code: |-
      public class HolaMundo {
          public static void main(String[] args) {
              System.out.println("Hola Mundo")
          }
      }
    options:
      - id: 'a'
        text: 'Compila con una advertencia y, al ejecutarlo, muestra `Hola Mundo`.'
      - id: 'b'
        text: "`javac` informa `error: ';' expected` y no genera el archivo `HolaMundo.class`."
      - id: 'c'
        text: 'Compila, pero `java HolaMundo` lanza una excepción en tiempo de ejecución.'
      - id: 'd'
        text: 'Compila y muestra `Hola Mundo` sin salto de línea al final.'
    correctOptionId: 'b'
    explanation: >-
      Cada instrucción en Java termina obligatoriamente con `;`. Al faltar,
      `javac` detiene la compilación con `error: ';' expected` señalando la
      línea 3. Mientras haya errores de compilación no se genera bytecode, así
      que no existe ningún `HolaMundo.class` que la JVM pueda ejecutar.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué se muestra en la consola al compilar y ejecutar `java Comentarios`?'
    code: |-
      public class Comentarios {
          public static void main(String[] args) {
              // System.out.println("Uno");
              System.out.println("Dos");
              /*
              System.out.println("Tres");
              */
              System.out.println("Cuatro"); // System.out.println("Cinco");
              /** System.out.println("Seis"); */
          }
      }
    options:
      - id: 'a'
        text: '`Dos`, `Cuatro` y `Seis`: los comentarios Javadoc sí se ejecutan.'
      - id: 'b'
        text: '`Dos`, `Tres` y `Cuatro`: el comentario multilínea solo oculta su primera línea.'
      - id: 'c'
        text: '`Dos`, `Cuatro` y `Cinco`: un comentario `//` al final de una línea no afecta a lo que sigue.'
      - id: 'd'
        text: '`Dos` y `Cuatro`, cada uno en su propia línea.'
    correctOptionId: 'd'
    explanation: >-
      El compilador descarta todo comentario: `//` anula el resto de la línea
      (incluido lo que aparece después de una instrucción, como `"Cinco"`),
      `/* ... */` anula todo el bloque aunque ocupe varias líneas, y `/** ... */`
      es un comentario Javadoc que solo sirve para generar documentación. Solo
      quedan dos instrucciones reales: las que imprimen `Dos` y `Cuatro`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Este código se guardó en `reporteVentas.java`. ¿Cuál es el diagnóstico correcto?'
    code: |-
      public class reporteVentas {
          public static void main(String[] args) {
              if (args.length > 0) {
                  String NombreCliente = args[0];
                  System.out.println("Cliente: " + NombreCliente);
              }
          }
      }
    options:
      - id: 'a'
        text: 'Compila y se ejecuta, pero no respeta las convenciones: la clase debería llamarse `ReporteVentas` (en `ReporteVentas.java`) y la variable, `nombreCliente`.'
      - id: 'b'
        text: 'No compila: el nombre de una clase debe empezar con mayúscula.'
      - id: 'c'
        text: 'No compila: una variable no puede empezar con mayúscula.'
      - id: 'd'
        text: 'Compila y respeta las convenciones de Java.'
    correctOptionId: 'a'
    explanation: >-
      `PascalCase` para clases y `camelCase` para variables son convenciones,
      no reglas del compilador: el programa compila y `java reporteVentas Lucia`
      imprime `Cliente: Lucia`. La regla que `javac` sí exige es que el archivo
      se llame igual que la clase pública, y aquí se cumple. Respetar las
      convenciones permite distinguir a simple vista una clase de una variable.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Compilaste `Saludo.java` cuando imprimía `"Versión 1"`. Después lo editaste hasta dejarlo como se ve abajo, lo guardaste y ejecutaste `java Saludo` **sin** volver a correr `javac`. ¿Qué se imprime?'
    code: |-
      public class Saludo {
          public static void main(String[] args) {
              System.out.println("Versión 2");
          }
      }
    options:
      - id: 'a'
        text: '`Versión 2`, porque la JVM lee siempre el archivo `.java` más reciente.'
      - id: 'b'
        text: 'Un error de compilación, porque `Saludo.java` y `Saludo.class` no coinciden.'
      - id: 'c'
        text: '`Versión 1` y `Versión 2`, una en cada línea.'
      - id: 'd'
        text: '`Versión 1`, porque la JVM ejecuta el bytecode de `Saludo.class` generado antes del cambio.'
    correctOptionId: 'd'
    explanation: >-
      Java compila en dos fases: `javac` traduce el `.java` a bytecode y
      `java Saludo` solo carga `Saludo.class`; el código fuente no se vuelve a
      leer. Hasta ejecutar `javac Saludo.java` otra vez, el `.class` conserva la
      versión anterior. Los IDE recompilan al presionar *Run*, por eso allí el
      cambio aparece enseguida.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Ejecutás `java ContarArgumentos uno dos tres`. ¿Qué se imprime?'
    code: |-
      public class ContarArgumentos {
          public static void main(String[] args) {
              System.out.println("Recibidos: " + args.length);
          }
      }
    options:
      - id: 'a'
        text: '`Recibidos: 4`, porque el nombre de la clase ocupa la posición `args[0]`.'
      - id: 'b'
        text: '`Recibidos: 3`'
      - id: 'c'
        text: '`Recibidos: 5`, porque se cuentan también `java` y `ContarArgumentos`.'
      - id: 'd'
        text: '`Recibidos: 2`, porque `length` devuelve la última posición válida.'
    correctOptionId: 'b'
    explanation: >-
      `args` contiene solo los valores escritos después del nombre de la clase:
      `"uno"`, `"dos"` y `"tres"`. Ni `java` ni `ContarArgumentos` forman parte
      del array. `args.length` es la cantidad de elementos (3), mientras que la
      última posición válida es `args[2]`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Con la solución del desafío `PerfilDesarrollador`, ejecutás `java PerfilDesarrollador Facundo`. ¿Qué ocurre?'
    code: |-
      public class PerfilDesarrollador {
          public static void main(String[] args) {
              if (args.length >= 2) {
                  String nombre = args[0];
                  String lenguaje = args[1];
                  System.out.println("Desarrollador: " + nombre + " | Especialidad: " + lenguaje);
              } else {
                  System.out.println("Uso: java PerfilDesarrollador <TuNombre> <TuLenguaje>");
              }
          }
      }
    options:
      - id: 'a'
        text: 'Imprime `Desarrollador: Facundo | Especialidad: null`.'
      - id: 'b'
        text: 'Lanza `ArrayIndexOutOfBoundsException` al leer `args[1]`.'
      - id: 'c'
        text: 'Imprime `Uso: java PerfilDesarrollador <TuNombre> <TuLenguaje>`.'
      - id: 'd'
        text: 'Imprime `Desarrollador: Facundo | Especialidad: ` con el lenguaje vacío.'
    correctOptionId: 'c'
    explanation: >-
      Con un solo argumento, `args.length` vale 1 y la condición
      `args.length >= 2` es falsa, así que se ejecuta el bloque `else`. La línea
      que lee `args[1]` nunca llega a ejecutarse: la verificación previa del
      tamaño es justamente lo que evita la excepción.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Compilás este programa con un JDK cuyo `javac --version` informa `javac 21` y copiás solo `HolaMundo.class` a un servidor donde `java --version` informa la versión 17. ¿Qué ocurre al ejecutar `java HolaMundo` en el servidor?'
    code: |-
      public class HolaMundo {
          public static void main(String[] args) {
              System.out.println("Hola Mundo");
          }
      }
    options:
      - id: 'a'
        text: 'Falla con `UnsupportedClassVersionError`: el bytecode fue generado para una versión de Java más nueva que la de esa JVM.'
      - id: 'b'
        text: 'Muestra `Hola Mundo`: el bytecode funciona en cualquier JVM, sin importar su versión.'
      - id: 'c'
        text: 'La JVM 17 recompila automáticamente el `.class` y luego lo ejecuta.'
      - id: 'd'
        text: 'Falla con un error de compilación de `javac` en el servidor.'
    correctOptionId: 'a'
    explanation: >-
      El bytecode es independiente del sistema operativo y del procesador, pero
      cada `.class` registra la versión de Java para la que fue generado. Una
      JVM 17 no puede cargar bytecode de Java 21 y responde con
      `UnsupportedClassVersionError`. La solución no es tocar el código: hay que
      usar una JVM compatible o recompilar explícitamente para la versión
      destino (por ejemplo, `javac --release 17 HolaMundo.java`).
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'Ejecutás el ejemplo `VistaPrevia` de la lección con `java VistaPrevia Programacion`. ¿Qué se imprime?'
    code: |-
      public class VistaPrevia {
          public static void main(String[] args) {
              if (args.length == 0 || args[0].isBlank()) {
                  System.err.println("Uso: java VistaPrevia <texto-no-vacio>");
                  return;
              }

              String texto = args[0];
              int finExclusivo = Math.min(10, texto.length());
              String resumen = texto.substring(0, finExclusivo);
              System.out.println(resumen);
          }
      }
    options:
      - id: 'a'
        text: '`Programacion`'
      - id: 'b'
        text: '`Programaci`'
      - id: 'c'
        text: '`Programacio`, porque el índice final es inclusivo.'
      - id: 'd'
        text: '`rogramacio`'
    correctOptionId: 'b'
    explanation: >-
      `"Programacion"` tiene 12 caracteres, así que `Math.min(10, 12)` vale 10.
      Según el Javadoc, en `substring(beginIndex, endIndex)` el inicio es
      inclusivo y el final exclusivo: se toman los índices 0 a 9, es decir, los
      10 primeros caracteres (`Programaci`).
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Esta variante de `VistaPrevia` omite `Math.min`. ¿Qué sucede al compilarla y ejecutar `java Recorte Java`?'
    code: |-
      public class Recorte {
          public static void main(String[] args) {
              if (args.length == 0) {
                  System.out.println("Uso: java Recorte <texto>");
                  return;
              }

              String texto = args[0];
              String resumen = texto.substring(0, 10);
              System.out.println(resumen);
          }
      }
    options:
      - id: 'a'
        text: 'No compila: `javac` detecta que 10 supera la longitud del texto.'
      - id: 'b'
        text: 'Compila e imprime `Java`, porque `substring` se detiene al llegar al final del texto.'
      - id: 'c'
        text: 'Compila, pero al ejecutar lanza una excepción de índice fuera de rango porque el índice final (10) supera la longitud (4).'
      - id: 'd'
        text: 'Compila e imprime `Java` seguido de seis espacios.'
    correctOptionId: 'c'
    explanation: >-
      El compilador no conoce el valor de `args[0]`: eso recién se sabe al
      ejecutar. La sección *Throws* del Javadoc de `substring` advierte que se
      lanza `IndexOutOfBoundsException` cuando `endIndex` es mayor que
      `length()`, y eso ocurre aquí
      (`StringIndexOutOfBoundsException: Range [0, 10) out of bounds for length 4`).
      Por eso la lección limita el índice con `Math.min(10, texto.length())`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Qué se imprime al ejecutar `java Iniciales`?'
    code: |-
      public class Iniciales {
          public static void main(String[] args) {
              String texto = "Bytecode";
              texto.substring(0, 4);
              System.out.println(texto);
          }
      }
    options:
      - id: 'a'
        text: '`Bytecode`'
      - id: 'b'
        text: '`Byte`'
      - id: 'c'
        text: '`code`'
      - id: 'd'
        text: 'Nada: no compila porque el resultado de `substring` no se guarda en ninguna variable.'
    correctOptionId: 'a'
    explanation: >-
      Como indica el Javadoc, `substring` devuelve un nuevo `String` y no
      modifica el original. El resultado (`"Byte"`) se descarta porque no se
      asigna a nada, y `texto` sigue valiendo `"Bytecode"`. Ignorar el valor
      devuelto es legal: compila, pero casi siempre es un error de lógica. Para
      conservarlo habría que escribir `String inicio = texto.substring(0, 4);`.
  - kind: 'single-choice'
    id: 'q12'
    prompt: 'El Javadoc de `String.isBlank()` indica `Since: 11`. Compilás este programa en un proyecto configurado para Java 8 con `javac --release 8 Vacio.java`. ¿Qué ocurre?'
    code: |-
      public class Vacio {
          public static void main(String[] args) {
              String texto = "   ";
              if (texto.isBlank()) {
                  System.out.println("Texto vacío");
              }
          }
      }
    options:
      - id: 'a'
        text: 'Compila y muestra `Texto vacío`: el Javadoc siempre describe la versión que tenés instalada.'
      - id: 'b'
        text: 'Compila con una advertencia `Deprecated` y no imprime nada.'
      - id: 'c'
        text: 'Compila, pero falla al ejecutar con `UnsupportedClassVersionError`.'
      - id: 'd'
        text: 'No compila: `javac` informa `cannot find symbol` para `isBlank()`, porque ese método no existe en la API de Java 8.'
    correctOptionId: 'd'
    explanation: >-
      `Since: 11` indica que el método se agregó en Java 11. Al compilar para
      Java 8, `javac` usa la API de esa versión, donde `isBlank()` no existe, y
      responde `error: cannot find symbol`. Cuando la documentación y el
      compilador no coinciden, hay que revisar la versión del proyecto: o se
      actualiza el JDK de forma deliberada, o se usa la alternativa documentada
      para la versión destino.
---

Analizá cada fragmento de código, elegí una respuesta por pregunta y presioná **Calificar** para comprobar si sabés predecir qué hacen `javac` y la JVM.
