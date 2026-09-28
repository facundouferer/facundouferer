---
course: 'java'
lesson: '09-arrays-de-objetos'
slug: 'autoevaluacion-arrays-de-objetos'
title: 'Autoevaluación: Arrays de Objetos'
description: 'Diez preguntas sobre memoria en dos niveles, inicialización en dos pasos, NullPointerException, capacidad contra cantidad, ordenamiento manual y aliasing.'
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
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Ejecutar `Arrays.sort(personas)` sobre un array `Persona[]` sin haber definido un criterio de comparación compila correctamente pero falla en tiempo de ejecución.'
    correctAnswer: true
    explanation: >-
      `Arrays.sort` acepta arrays de objetos porque su firma recibe `Object[]`.
      Sin embargo, al no tener los objetos un orden natural evidente (a
      diferencia de los números primitivos), en tiempo de ejecución la JVM no
      sabe qué atributo comparar y arroja un error. Hasta ver interfaces en
      lecciones posteriores, el ordenamiento de objetos se resuelve a mano.
  - kind: 'single-choice'
    id: 'q6'
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
    id: 'q7'
    prompt: 'Observá el siguiente snippet sobre aliasing de referencias en un array:'
    code: |-
      Persona[] plantel = { new Persona("Ana", 20), new Persona("Beto", 25) };
      plantel[1] = plantel[0];
      plantel[1].cumplirAnios();
    options:
      - id: 'a'
        text: '`plantel[0].getEdad()` vale 21 porque ambas casillas apuntan al mismo objeto en el Heap; el objeto original "Beto" queda sin referencias.'
      - id: 'b'
        text: '`plantel[0].getEdad()` permanece en 20 porque la asignación entre casillas genera automáticamente una copia profunda del objeto.'
      - id: 'c'
        text: 'El compilador arroja un error de sintaxis porque dos posiciones del mismo array no pueden compartir una misma referencia.'
      - id: 'd'
        text: '`plantel[0].getEdad()` vale 21, y el objeto "Beto" se traslada a una casilla oculta del sistema.'
    correctOptionId: 'a'
    explanation: >-
      La asignación `plantel[1] = plantel[0]` copia el valor de la referencia,
      no el objeto. Ahora tanto la casilla 0 como la 1 apuntan a la misma
      `Persona` ("Ana"). Modificarla a través de una casilla se refleja en la
      otra. Además, el objeto "Beto" pierde su única referencia y queda libre
      para que el Garbage Collector lo recolecte.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'En una clase que administra un array parcialmente lleno con un contador `int cantidad`, los bucles que recorren el array deben iterar hasta `datos.length`.'
    correctAnswer: false
    explanation: >-
      `datos.length` indica la capacidad física total reservada, donde las
      casillas libres contienen `null`. `cantidad` representa cuántas casillas
      fueron efectivamente ocupadas por objetos válidos. Recorrer hasta
      `datos.length` provocaría `NullPointerException` al llegar a la primera
      posición vacía. La regla fundamental es iterar estrictamente hasta `i <
      cantidad`.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'Al eliminar un elemento de un array desplazando posiciones a la izquierda (`datos[i] = datos[i + 1]`), ¿por qué debe ejecutarse `datos[cantidad - 1] = null;`?'
    options:
      - id: 'a'
        text: 'Para liberar la referencia residual en la última posición y permitir que el Garbage Collector libere el objeto si ya nadie lo usa (evitando fugas de memoria).'
      - id: 'b'
        text: 'Para achicar la longitud física (`length`) del array en una unidad de forma automática.'
      - id: 'c'
        text: 'Porque de lo contrario se produciría un error `ArrayIndexOutOfBoundsException` en la próxima inserción.'
      - id: 'd'
        text: 'Porque Java prohíbe decrementar un contador entero sin asignar una casilla en `null` previamente.'
    correctOptionId: 'a'
    explanation: >-
      Al desplazar los elementos a la izquierda, la posición `cantidad - 1` sigue
      apuntando al objeto desplazado. Aunque el contador impida visitarlo, esa
      referencia oculta mantiene vivo al objeto e impide que el recolector de
      basura libere su memoria (un problema clásico denominado memory loitering
      o fuga de memoria lógica).
  - kind: 'true-false'
    id: 'q10'
    prompt: 'En la siguiente clase, retornar `this.alumnos` directamente en `getAlumnos()` rompe el encapsulamiento porque el cliente externo puede modificar el array interno:'
    code: |-
      public class Curso {
          private final Persona[] alumnos;
          public Curso(Persona[] lista) {
              this.alumnos = Arrays.copyOf(lista, lista.length);
          }
          public Persona[] getAlumnos() {
              return this.alumnos;
          }
      }
    correctAnswer: true
    explanation: >-
      Aunque el atributo sea `private final`, devolver la referencia directa al
      array permite que cualquier código externo altere su contenido (por
      ejemplo, haciendo `curso.getAlumnos()[0] = null;`). Para preservar el
      encapsulamiento y proteger la integridad del objeto, el getter debe
      devolver una copia defensiva (`Arrays.copyOf`).
---

Marcá una respuesta en cada pregunta y presioná **Calificar** para ver tu
puntaje sobre 10 y la explicación de cada una.
