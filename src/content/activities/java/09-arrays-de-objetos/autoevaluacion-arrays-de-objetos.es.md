---
course: 'java'
lesson: '09-arrays-de-objetos'
slug: 'autoevaluacion-arrays-de-objetos'
title: 'Autoevaluación: Arrays de Objetos'
description: 'Ocho preguntas sobre memoria en dos niveles, inicialización en dos pasos, NullPointerException, capacidad contra cantidad, intercambio de referencias, aliasing y copias defensivas.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Al declarar `Persona[] personas = new Persona[5];`, ¿qué estructura se reserva exactamente en memoria?'
    options:
      - id: 'a'
        text: 'Se reservan 5 casillas contiguas preparadas para almacenar referencias a objetos `Persona`, todas inicializadas en `null`.'
      - id: 'b'
        text: 'Se construyen 5 instancias completas de `Persona` en el Heap con sus atributos en cero o cadenas vacías.'
      - id: 'c'
        text: 'Se reservan los atributos de 5 personas directamente dentro de la memoria interna del array en el Stack.'
      - id: 'd'
        text: 'Se crea una estructura inmutable que rechaza cualquier asignación posterior de nuevas referencias.'
    correctOptionId: 'a'
    explanation: >-
      Un array de objetos no guarda los objetos en sus casillas, sino
      direcciones de memoria (referencias). Al ejecutar `new Persona[5]`, la JVM
      solo reserva el bloque de 5 casillas vacías (`null`). Cada objeto debe ser
      creado explícitamente en un segundo paso mediante `new Persona(...)`.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'El siguiente código compila sin errores pero lanza un `NullPointerException` en tiempo de ejecución:'
    code: |-
      Persona[] equipo = new Persona[3];
      System.out.println(equipo[0].getNombre());
    correctAnswer: true
    explanation: >-
      `new Persona[3]` reserva 3 casillas donde cada elemento comienza valiendo
      `null`. El compilador lo acepta porque la expresión es sintácticamente
      válida, pero al intentar desreferenciar `equipo[0]` invocando un método
      sobre una casilla vacía, la JVM arroja inmediatamente `NullPointerException`.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Cuál es la principal ventaja de utilizar la inicialización literal `{ new Persona(...), new Persona(...) }`?'
    options:
      - id: 'a'
        text: 'Reserva el array y construye cada instancia en una sola expresión, garantizando que ninguna casilla quede en `null`.'
      - id: 'b'
        text: 'Convierte automáticamente a los objetos creados en instancias inmutables.'
      - id: 'c'
        text: 'Almacena los objetos en el Stack en lugar del Heap para evitar la recolección de basura.'
      - id: 'd'
        text: 'Permite omitir la declaración de constructores en la clase `Persona`.'
    correctOptionId: 'a'
    explanation: >-
      La sintaxis literal fusiona en un paso atómico la reserva del array y la
      construcción de cada objeto. Su longitud coincide exactamente con la
      cantidad de instancias provistas y elimina por completo el riesgo de
      dejar casillas con `null`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'En el siguiente método de búsqueda lineal, ¿por qué es indispensable evaluar `p != null` antes que `p.getNombre()`?'
    code: |-
      public static Persona buscar(Persona[] personas, String nombre) {
          for (Persona p : personas) {
              if (p != null && p.getNombre().equalsIgnoreCase(nombre)) {
                  return p;
              }
          }
          return null;
      }
    options:
      - id: 'a'
        text: 'Por la evaluación de cortocircuito del operador `&&`: si `p` es `null`, la segunda parte no se ejecuta y se evita un `NullPointerException`.'
      - id: 'b'
        text: 'Porque el operador `&&` siempre evalúa primero la condición de la derecha y luego la de la izquierda.'
      - id: 'c'
        text: 'Porque el compilador de Java rechaza el código si una invocación a método precede a una comprobación nula.'
      - id: 'd'
        text: 'Porque `equalsIgnoreCase` devolvería `true` al ejecutarse sobre un objeto nulo.'
    correctOptionId: 'a'
    explanation: >-
      Java utiliza cortocircuito en las operaciones lógicas: si la condición
      izquierda de un `&&` resulta falsa (`p` es `null`), el motor no evalúa la
      expresión derecha. Si invirtiéramos el orden, al procesar la primera casilla
      vacía el programa intentaría llamar a `.getNombre()` sobre `null` y
      fallaría con `NullPointerException`.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Al ordenar un array de objetos intercambiando posiciones con una variable temporal como en el siguiente snippet, ¿qué ocurre en memoria?'
    code: |-
      Persona temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    options:
      - id: 'a'
        text: 'Se intercambian únicamente las referencias contenidas en las casillas del array; los objetos en el Heap no se mueven ni se duplican.'
      - id: 'b'
        text: 'Se clonan los objetos en nuevas posiciones del Heap y se eliminan las instancias originales.'
      - id: 'c'
        text: 'Se copian los valores atributo por atributo entre los dos objetos involucrados.'
      - id: 'd'
        text: 'La JVM traslada la ubicación física de los objetos dentro del Heap para respetar el nuevo orden de índices.'
    correctOptionId: 'a'
    explanation: >-
      Un array de objetos almacena flechas (referencias). Al realizar el swap
      mediante la variable temporal, únicamente se reasignan las direcciones que
      guardan las casillas del array. Los objetos permanecen intactos en su
      posición original del Heap sin duplicar datos ni consumir memoria extra.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Qué imprime la última línea del siguiente código?'
    code: |-
      Persona[] plantel = { new Persona("Ana", 20), new Persona("Beto", 25) };
      plantel[1] = plantel[0];
      System.out.println(plantel[1].getNombre() + " " + plantel[1].getEdad());
    options:
      - id: 'a'
        text: '`Ana 20`, porque las dos casillas ahora apuntan al mismo objeto "Ana"; el objeto "Beto" queda sin ninguna referencia.'
      - id: 'b'
        text: '`Beto 25`, porque asignar una casilla a otra no cambia los objetos que ya estaban creados.'
      - id: 'c'
        text: 'No compila: dos posiciones del mismo array no pueden guardar la misma referencia.'
      - id: 'd'
        text: '`Ana 20`, porque la asignación crea en el Heap una copia nueva e independiente del objeto "Ana".'
    correctOptionId: 'a'
    explanation: >-
      `plantel[1] = plantel[0]` copia la flecha (la referencia), no el objeto.
      Después de esa línea, las casillas 0 y 1 apuntan al mismo objeto "Ana",
      por eso se imprime `Ana 20`. No se crea ninguna copia: sigue habiendo un
      solo objeto "Ana" en el Heap. El objeto "Beto" pierde su única referencia
      y queda libre para que el Garbage Collector lo recolecte.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'En una clase que administra un array parcialmente lleno con un contador `int cantidad`, los bucles que recorren el array deben iterar hasta `datos.length`.'
    correctAnswer: false
    explanation: >-
      `datos.length` indica la capacidad física total reservada, donde las
      casillas libres contienen `null`. `cantidad` representa cuántas casillas
      fueron efectivamente ocupadas por objetos válidos. Recorrer hasta
      `datos.length` provocaría `NullPointerException` al llegar a la primera
      posición vacía. La regla fundamental es iterar estrictamente hasta `i <
      cantidad`.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Mirá la clase `Curso` y el código que la usa. Después de ejecutar la última línea, el array `alumnos` que está guardado adentro del curso también quedó con `null` en la posición 0.'
    code: |-
      public class Curso {
          private final Persona[] alumnos;

          public Curso(Persona[] lista) {
              this.alumnos = Arrays.copyOf(lista, lista.length);
          }

          public Persona[] getAlumnos() {
              return this.alumnos;   // devuelve la flecha al array interno
          }
      }

      // Código de otra clase que usa a Curso:
      Curso curso = new Curso(new Persona[] { new Persona("Ana", 20) });
      Persona[] lista = curso.getAlumnos();
      lista[0] = null;
    correctAnswer: true
    explanation: >-
      `getAlumnos()` no devuelve una copia: devuelve la misma referencia que
      guarda el atributo `alumnos`. Entonces `lista` y `curso.alumnos` son dos
      flechas al MISMO array, y `lista[0] = null` borra al alumno adentro del
      curso. Que el atributo sea `private` impide escribir `curso.alumnos`, y
      que sea `final` impide reasignarlo a otro array, pero ninguna de las dos
      cosas protege las casillas. Así se rompe el encapsulamiento: código de
      afuera cambió el estado interno sin pasar por ningún método de `Curso`.
      La solución es la misma que en el constructor: devolver una copia con
      `return Arrays.copyOf(alumnos, alumnos.length);`. Así quien llama recibe
      su propio array y puede modificarlo sin tocar el del curso.
---

Marcá una respuesta en cada pregunta y presioná **Calificar** para ver tu
puntaje sobre 10 y la explicación de cada una.
