---
course: 'java'
lesson: '01-conceptos-basicos'
slug: 'autoevaluacion-lectura-de-codigo'
title: 'Autoevaluación: Lectura y Análisis de Código Java'
description: 'Doce fragmentos de código Java para analizar: errores de compilación, comentarios, argumentos por consola, contratos de String y el ciclo javac/java.'
kind: 'quiz'
order: 3
lang: 'es'
published: true
estimatedMinutes: 25
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Este es el `HolaMundo.java` del repositorio del curso, con un detalle cambiado. ¿Qué ocurre al ejecutar `javac HolaMundo.java`?'
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
        text: 'Compila, pero `java HolaMundo` lanza una excepción en tiempo de ejecución.'
      - id: 'c'
        text: "`javac` informa `error: ';' expected` y no genera el archivo `HolaMundo.class`."
      - id: 'd'
        text: 'Compila y muestra `Hola Mundo` sin salto de línea al final.'
    correctOptionId: 'c'
    explanation: >-
      Cada instrucción en Java termina obligatoriamente con `;`. Al faltar,
      `javac` detiene la compilación con `error: ';' expected` señalando la
      línea 3. Mientras haya errores de compilación no se genera bytecode, así
      que no existe ningún `HolaMundo.class` que la JVM pueda ejecutar.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué resultado produce `javac HolaMundo.java` con este código?'
    code: |-
      public class HolaMundo {
          public static void main(String[] args) {
              system.out.println("Hola Mundo");
          }
      }
    options:
      - id: 'a'
        text: 'No compila: Java distingue mayúsculas de minúsculas, `system` no es `System` y `javac` informa `error: package system does not exist`.'
      - id: 'b'
        text: 'Compila, porque Java ignora las mayúsculas en los nombres de las clases del JDK.'
      - id: 'c'
        text: 'Compila, pero la JVM falla al ejecutar porque no encuentra `system`.'
      - id: 'd'
        text: 'Compila y muestra `hola mundo` en minúsculas.'
    correctOptionId: 'a'
    explanation: >-
      Java es *case-sensitive*: `System` (la clase de `java.lang`) y `system`
      son identificadores distintos. Como `system` no existe, el compilador
      intenta interpretarlo como un paquete y responde
      `error: package system does not exist`. El error se detecta al compilar,
      antes de que la JVM intervenga.
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
      En Java, `args` contiene solo los valores escritos después del nombre de
      la clase: `{"uno", "dos", "tres"}`. Ni `java` ni `ContarArgumentos` forman
      parte del array (a diferencia de `argv[0]` en C). `length` es la cantidad
      de elementos (3); la última posición válida es `args.length - 1` (2).
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Con el programa `SaludoPersonalizado` de la lección, ejecutás `java SaludoPersonalizado Ana Gomez` (sin comillas). ¿Qué se imprime?'
    code: |-
      public class SaludoPersonalizado {
          public static void main(String[] args) {
              if (args.length > 0) {
                  System.out.println("¡Hola, " + args[0] + "! Bienvenido a la ingeniería en Java.");
              } else {
                  System.out.println("¡Hola, Desarrollador Anónimo! Pasá tu nombre como argumento.");
              }
          }
      }
    options:
      - id: 'a'
        text: '`¡Hola, Ana Gomez! Bienvenido a la ingeniería en Java.`'
      - id: 'b'
        text: '`¡Hola, Gomez! Bienvenido a la ingeniería en Java.`'
      - id: 'c'
        text: '`¡Hola, Ana! Bienvenido a la ingeniería en Java.`'
      - id: 'd'
        text: '`¡Hola, Desarrollador Anónimo! Pasá tu nombre como argumento.`'
    correctOptionId: 'c'
    explanation: >-
      La terminal separa los argumentos por espacios: `args` vale
      `{"Ana", "Gomez"}` y el programa solo usa `args[0]`. Para enviar el nombre
      completo como un único argumento hay que encerrarlo entre comillas:
      `java SaludoPersonalizado "Ana Gomez"` imprime `¡Hola, Ana Gomez! ...`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Qué se imprime al ejecutar `java Concatenar 2 3`?'
    code: |-
      public class Concatenar {
          public static void main(String[] args) {
              if (args.length >= 2) {
                  System.out.println("Resultado: " + args[0] + args[1]);
              }
          }
      }
    options:
      - id: 'a'
        text: '`Resultado: 23`'
      - id: 'b'
        text: '`Resultado: 5`'
      - id: 'c'
        text: '`Resultado: 2 3`'
      - id: 'd'
        text: 'Nada: no compila porque los argumentos no se pueden sumar.'
    correctOptionId: 'a'
    explanation: >-
      `args` es un `String[]`: aunque en la terminal escribas números, el
      programa recibe los textos `"2"` y `"3"`. Entre textos, `+` concatena,
      por eso el resultado es `Resultado: 23`. Convertir texto a número es un
      tema de lecciones posteriores.
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
        text: 'Imprime `Desarrollador: Facundo | Especialidad: ` con el lenguaje vacío.'
      - id: 'd'
        text: 'Imprime `Uso: java PerfilDesarrollador <TuNombre> <TuLenguaje>`.'
    correctOptionId: 'd'
    explanation: >-
      Con un solo argumento, `args.length` vale 1 y la condición
      `args.length >= 2` es falsa, así que se ejecuta el bloque `else`. La línea
      que lee `args[1]` nunca llega a ejecutarse: la verificación previa del
      tamaño es justamente lo que evita la excepción.
  - kind: 'single-choice'
    id: 'q8'
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
        text: '`Programaci` seguido de `o`, porque el índice final es inclusivo.'
      - id: 'd'
        text: '`rogramacio`'
    correctOptionId: 'b'
    explanation: >-
      `"Programacion"` tiene 12 caracteres, así que `Math.min(10, 12)` vale 10.
      Según el Javadoc, en `substring(beginIndex, endIndex)` el inicio es
      inclusivo y el final exclusivo: se toman los índices 0 a 9, es decir, los
      10 primeros caracteres (`Programaci`).
  - kind: 'single-choice'
    id: 'q9'
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
        text: 'Compila, pero al ejecutar lanza `StringIndexOutOfBoundsException` porque el índice final (10) supera la longitud (4).'
      - id: 'd'
        text: 'Compila e imprime `Java` seguido de seis espacios.'
    correctOptionId: 'c'
    explanation: >-
      El compilador no conoce el valor de `args[0]`: eso recién se sabe al
      ejecutar. El Javadoc de `substring` declara en *Throws* una
      `IndexOutOfBoundsException` cuando `endIndex` es mayor que `length()`; la
      JVM lanza su subtipo `StringIndexOutOfBoundsException`
      (`Range [0, 10) out of bounds for length 4`). Por eso la lección limita el
      índice con `Math.min(10, texto.length())`.
  - kind: 'single-choice'
    id: 'q10'
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
    id: 'q11'
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
    id: 'q12'
    prompt: 'El repositorio del curso tiene un archivo llamado `operadoresTernarios.java` cuya clase empieza en minúscula. Siguiendo esa misma idea, este código se guardó en `reporteVentas.java`. ¿Cuál es el diagnóstico correcto?'
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
        text: 'No compila: el nombre de una clase debe empezar con mayúscula.'
      - id: 'b'
        text: 'No compila: una variable no puede empezar con mayúscula.'
      - id: 'c'
        text: 'Compila y se ejecuta, pero no respeta las convenciones: la clase debería llamarse `ReporteVentas` (en `ReporteVentas.java`) y la variable, `nombreCliente`.'
      - id: 'd'
        text: 'Compila y respeta las convenciones de Java.'
    correctOptionId: 'c'
    explanation: >-
      `PascalCase` para clases y `camelCase` para variables son convenciones,
      no reglas del compilador: el programa compila y `java reporteVentas Lucia`
      imprime `Cliente: Lucia`. La regla que `javac` sí exige es que el archivo
      se llame igual que la clase pública, y aquí se cumple. Respetar las
      convenciones hace que cualquier desarrollador Java distinga a simple vista
      una clase de una variable.
---

Analizá cada fragmento de código, elegí una respuesta por pregunta y presioná **Calificar**. Varias preguntas parten de ejemplos de la lección y del [repositorio del curso](https://github.com/facundouferer/cursodejava).
