---
course: 'java'
lesson: '07-constructores-y-encapsulamiento'
slug: 'autoevaluacion-constructores-y-encapsulamiento'
title: 'Autoevaluación: Constructores y Encapsulamiento'
description: 'Diez preguntas sobre constructores, el constructor por defecto, la delegación con this(...), el encapsulamiento y los accesores bien diseñados.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuáles son las dos reglas sintácticas que identifican a un constructor en Java?'
    options:
      - id: 'a'
        text: 'Se llama exactamente igual que la clase y no declara ningún tipo de retorno.'
      - id: 'b'
        text: 'Se llama `constructor` y devuelve `void`.'
      - id: 'c'
        text: 'Es `static` y se llama igual que la clase.'
      - id: 'd'
        text: 'Es `public` y no recibe ningún parámetro.'
    correctOptionId: 'a'
    explanation: >-
      Un constructor se reconoce por dos reglas: se llama exactamente igual
      que la clase, mayúsculas incluidas, y no declara tipo de retorno, ni
      siquiera `void`. Ninguna de las dos tiene que ver con `static` ni con
      la cantidad de parámetros.
  - kind: 'true-false'
    id: 'q2'
    prompt: >-
      Si se escribe `public void Producto(...)` con un tipo de retorno
      explícito, Java lo trata igual que a un constructor.
    correctAnswer: false
    explanation: >-
      Al declarar un tipo de retorno, Java lo compila como un método común
      llamado igual que la clase, no como un constructor. El objeto nunca se
      inicializa con ese código y no hay ningún aviso del compilador: es uno
      de los errores más silenciosos de la lección.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'De las cinco etapas que ejecuta la JVM al evaluar `new`, ¿en qué momento corre el cuerpo del constructor?'
    options:
      - id: 'a'
        text: 'Es la primera etapa, antes de reservar memoria en el Heap.'
      - id: 'b'
        text: 'Es la cuarta etapa: corre después de reservar memoria, asignar valores por defecto y ejecutar los inicializadores de instancia.'
      - id: 'c'
        text: 'Es la última etapa, después de que la referencia ya fue devuelta a la variable.'
      - id: 'd'
        text: 'No es una etapa fija: el compilador decide el orden según el código.'
    correctOptionId: 'b'
    explanation: >-
      El operador `new` reserva memoria, asigna valores por defecto y corre
      los inicializadores de instancia antes de llegar al cuerpo del
      constructor, que es la cuarta etapa. Recién en la quinta se devuelve
      la referencia. El objeto ya existe en memoria cuando tu código del
      constructor empieza a correr.
  - kind: 'true-false'
    id: 'q4'
    prompt: >-
      Si una clase no declara ningún constructor propio, igual se puede
      escribir `new NombreClase()`, porque el compilador agrega
      automáticamente un constructor vacío sin parámetros.
    correctAnswer: true
    explanation: >-
      Cuando no escribís ningún constructor, el compilador te regala uno
      público, vacío y sin parámetros. Ese regalo desaparece apenas
      declarás vos mismo un solo constructor.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Una clase `Persona` declara únicamente `public Persona(String nombre) { ... }`. ¿Qué ocurre al intentar `new Persona()`?'
    options:
      - id: 'a'
        text: 'Compila y crea un objeto con `nombre` en `null`.'
      - id: 'b'
        text: 'Error de compilación: el constructor sin argumentos ya no existe.'
      - id: 'c'
        text: 'Se ejecuta el constructor heredado de `Object`, sin inicializar `nombre`.'
      - id: 'd'
        text: 'Compila, pero lanza una excepción en tiempo de ejecución.'
    correctOptionId: 'b'
    explanation: >-
      Apenas la clase declara un constructor propio, el constructor sin
      parámetros que regalaba el compilador desaparece. Si `Persona` solo
      tiene `Persona(String nombre)`, `new Persona()` es un error de
      compilación, no un problema en tiempo de ejecución.
  - kind: 'true-false'
    id: 'q6'
    prompt: >-
      La llamada `this(...)` puede ir después de validar algunos
      parámetros dentro del constructor, siempre que se ejecute antes de
      asignar los atributos.
    correctAnswer: false
    explanation: >-
      `this(...)` tiene que ser la primera sentencia del constructor, sin
      excepción: no puede haber nada antes, ni siquiera una validación o un
      `System.out.println`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué ocurre al intentar compilar esta clase?'
    code: |-
      public class Ejemplo {
          public Ejemplo() {
              this(0);
          }

          public Ejemplo(int valor) {
              this();
          }
      }
    options:
      - id: 'a'
        text: 'Compila, y al instanciarla se produce un desbordamiento de pila (`StackOverflowError`) en tiempo de ejecución.'
      - id: 'b'
        text: 'Error de compilación: Java detecta el ciclo entre `Ejemplo()` y `Ejemplo(int)`.'
      - id: 'c'
        text: 'Compila sin problema: se ejecuta primero `Ejemplo()` y después `Ejemplo(int)`.'
      - id: 'd'
        text: 'Compila, pero solo puede invocarse `Ejemplo(int)` directamente; `Ejemplo()` queda inutilizable.'
    correctOptionId: 'b'
    explanation: >-
      `Ejemplo()` delega en `Ejemplo(int)` con `this(0)`, y `Ejemplo(int)`
      delega de vuelta en `Ejemplo()` con `this()`. Java detecta ese ciclo
      entre constructores en tiempo de compilación: es un error de
      compilación, nunca un desbordamiento en tiempo de ejecución.
  - kind: 'true-false'
    id: 'q8'
    prompt: >-
      Encapsular una clase significa declarar todos sus atributos `private`
      y generar un getter y un setter para cada uno con el IDE.
    correctAnswer: false
    explanation: >-
      Eso es ritual, no diseño. Encapsular significa que el objeto es dueño
      de su propio estado y el único responsable de mantenerlo consistente.
      Generar accesores para todos los campos por reflejo deja el estado tan
      expuesto como si fuera público, solo que con más ceremonia.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Cuándo vale la pena que un getter o un setter exista, según el criterio de la lección?'
    options:
      - id: 'a'
        text: 'Siempre: todo atributo `private` necesita su getter y su setter para poder usarse.'
      - id: 'b'
        text: 'Solo cuando hacen algo más que leer o escribir el atributo tal cual: validar, transformar o calcular.'
      - id: 'c'
        text: 'Nunca: los getters y setters son un antipatrón en cualquier clase Java.'
      - id: 'd'
        text: 'Solo cuando el atributo es `final`.'
    correctOptionId: 'b'
    explanation: >-
      Un getter o setter que solo lee o escribe el atributo tal cual es, en
      la práctica, un campo público con más ceremonia. Los accesores valen
      la pena cuando hacen algo real: validan, transforman, calculan, o
      directamente no existen y se reemplazan por un método de dominio.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Por qué este código rompe el encapsulamiento de `Curso`, a pesar de que `alumnos` es `private`?'
    code: |-
      public class Curso {
          private String[] alumnos = new String[30];

          public String[] getAlumnos() {
              return alumnos;
          }
      }

      Curso c = new Curso();
      c.getAlumnos()[0] = "Intruso";
      java.util.Arrays.fill(c.getAlumnos(), null);
    options:
      - id: 'a'
        text: '`getAlumnos()` debería ser `private` también.'
      - id: 'b'
        text: 'El getter devuelve la referencia interna al array; quien la recibe puede modificarlo directamente desde afuera.'
      - id: 'c'
        text: 'El problema es que `alumnos` debería declararse `final` para no poder reasignarse.'
      - id: 'd'
        text: 'El código no compila, así que la pregunta no aplica.'
    correctOptionId: 'b'
    explanation: >-
      El atributo es `private`, pero el getter entrega la dirección de
      memoria del array interno, no una copia. Lo que protege el
      `private` es el campo, no el objeto al que apunta: quien recibe esa
      referencia puede sobrescribir elementos como si el array fuera
      suyo (y `final` no lo evitaría: solo impide reasignar la
      referencia, no modificar su contenido). La solución es devolver una
      copia defensiva (con un `for` o `Arrays.copyOf`) o directamente no
      exponer el array y ofrecer solo las operaciones que tienen sentido
      (como `inscribir(alumno)`).
---

Marcá una respuesta en cada pregunta y presioná **Calificar** para ver tu
puntaje sobre 10 y la explicación de cada una.
