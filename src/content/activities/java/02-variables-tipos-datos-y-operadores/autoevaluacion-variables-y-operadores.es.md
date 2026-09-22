---
course: 'java'
lesson: '02-variables-tipos-datos-y-operadores'
slug: 'autoevaluacion-variables-y-operadores'
title: 'Autoevaluación: Variables, Tipos de Datos y Operadores'
description: 'Diez preguntas sobre tipos primitivos, rangos, división entera, casting implícito y explícito, constantes y operadores lógicos.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es el valor almacenado en la variable `resultado` tras ejecutar esta línea en Java?'
    code: |-
      int resultado = 7 / 2;
    options:
      - id: 'a'
        text: '3'
      - id: 'b'
        text: '3.5'
      - id: 'c'
        text: '4'
      - id: 'd'
        text: 'No compila porque el resultado tiene decimales.'
    correctOptionId: 'a'
    explanation: >-
      En Java, cuando ambos operandos de una división son de tipo entero (`int`),
      la operación se evalúa como división entera y trunca cualquier parte decimal
      hacia cero, dando como resultado `3`. Para obtener `3.5` al menos uno de los
      dos operandos debe ser de tipo decimal (por ejemplo, `7.0 / 2` o `(double) 7 / 2`).
  - kind: 'true-false'
    id: 'q2'
    prompt: 'En Java, las variables locales declaradas dentro de un método reciben automáticamente un valor predeterminado como 0 o false si no se inicializan.'
    correctAnswer: false
    explanation: >-
      Las variables locales no reciben valores predeterminados. El compilador de
      Java exige que cumplan la regla de asignación definida (*definite assignment*):
      si intentás leer una variable local antes de asignarle un valor de forma
      demostrable, el código no compilará. Los valores por defecto solo aplican
      a los atributos (campos) de una clase.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué valor imprime por consola este fragmento de código?'
    code: |-
      double precio = 49.99;
      int precioEntero = (int) precio;
      System.out.println(precioEntero);
    options:
      - id: 'a'
        text: '50'
      - id: 'b'
        text: '49'
      - id: 'c'
        text: '49.99'
      - id: 'd'
        text: 'Lanza un error de ejecución por pérdida de precisión.'
    correctOptionId: 'b'
    explanation: >-
      El casting reductor o explícito de `double` a `int` mediante `(int)` trunca
      la parte fraccionaria sin redondear. Por lo tanto, `49.99` pasa a ser
      estrictamente `49`. Si se deseara un redondeo aritmético tradicional a 50,
      se debería utilizar un método matemático como `Math.round()`.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'Para asignar un literal numérico entero que supere el rango máximo de un `int` a una variable `long`, es obligatorio agregar el sufijo `L` o `l`.'
    correctAnswer: true
    explanation: >-
      Por defecto, todos los literales numéricos enteros en el código fuente de
      Java son interpretados por el compilador como tipo `int` (32 bits). Si el
      número excede `2,147,483,647`, el compilador dará error de número fuera de rango
      a menos que se agregue explícitamente el sufijo `L` (por ejemplo `3000000000L`).
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué ocurre al intentar compilar el siguiente fragmento de código?'
    code: |-
      int edad = 20;
      if (edad >= 18) {
          String mensaje = "Mayor de edad";
      }
      System.out.println(mensaje);
    options:
      - id: 'a'
        text: 'Imprime "Mayor de edad".'
      - id: 'b'
        text: 'Imprime null.'
      - id: 'c'
        text: 'Error de compilación: la variable mensaje no es visible fuera del bloque if.'
      - id: 'd'
        text: 'Error de ejecución al intentar acceder a memoria no inicializada.'
    correctOptionId: 'c'
    explanation: >-
      El ámbito (*scope*) y la visibilidad de una variable declarada dentro de un
      bloque delimitado por llaves `{ }` termina exactamente donde cierra ese bloque.
      La variable `mensaje` deja de existir al salir del `if`, por lo que el
      `System.out.println` posterior produce un error de compilación por símbolo no encontrado.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Si `x = 5`, ¿cuál es el valor resultante de la expresión lógica booleana?'
    code: |-
      int x = 5;
      boolean resultado = !(x > 3) || (x % 2 == 1);
    options:
      - id: 'a'
        text: 'true'
      - id: 'b'
        text: 'false'
      - id: 'c'
        text: '1'
      - id: 'd'
        text: 'Error de tipos incompatibles.'
    correctOptionId: 'a'
    explanation: >-
      Desglosemos paso a paso: `x > 3` es `true`, pero el operador `!` invierte su
      valor, quedando `false`. Luego, `x % 2` calcula el resto de `5 / 2`, que es `1`.
      La comparación `1 == 1` resulta en `true`. Finalmente, `false || true` se
      resuelve como `true`.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Una variable declarada con el modificador `final` se convierte en una constante cuyo valor no puede ser modificado tras su primera asignación.'
    correctAnswer: true
    explanation: >-
      En Java, `final` hace que la variable sea inmutable en su asignación.
      Cualquier intento posterior de reasignarle un valor provocará un error de
      compilación inmediato, garantizando la consistencia de los datos críticos.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Cuál de los siguientes tipos primitivos en Java almacena exactamente un carácter en formato Unicode ocupando 16 bits en memoria?'
    options:
      - id: 'a'
        text: 'byte'
      - id: 'b'
        text: 'short'
      - id: 'c'
        text: 'char'
      - id: 'd'
        text: 'String'
    correctOptionId: 'c'
    explanation: >-
      El tipo primitivo `char` ocupa 16 bits sin signo y almacena un único carácter
      codificado en UTF-16. `byte` (8 bits) y `short` (16 bits) son numéricos
      con signo, mientras que `String` no es un tipo primitivo sino una clase (tipo por referencia).
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Qué ocurre al ejecutar este fragmento de código con operadores de cortocircuito?'
    code: |-
      int x = 10;
      int divisor = 0;
      boolean seguro = (divisor != 0) && (x / divisor > 2);
      System.out.println(seguro);
    options:
      - id: 'a'
        text: 'Lanza una excepción ArithmeticException: / by zero.'
      - id: 'b'
        text: 'Imprime false sin lanzar ninguna excepción.'
      - id: 'c'
        text: 'Imprime true.'
      - id: 'd'
        text: 'El código no compila porque divisor vale cero.'
    correctOptionId: 'b'
    explanation: >-
      El operador `&&` evalúa mediante cortocircuito (*short-circuit*): si la primera
      expresión es `false` (`divisor != 0` resulta `false`), Java no evalúa la segunda
      expresión, ya que el resultado del AND nunca podrá ser verdadero. Esto evita que
      se ejecute la división por cero y previene un `ArithmeticException`.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'El fenómeno de sombreamiento (shadowing) se produce cuando un parámetro o variable local tiene el mismo identificador que un campo de clase, ocultándolo en ese bloque.'
    correctAnswer: true
    explanation: >-
      El sombreamiento ocurre cuando una variable con ámbito más interno (como un
      parámetro de método o constructor) comparte nombre con un campo de instancia
      o de clase. Dentro de ese bloque, el nombre resolverá siempre a la variable
      local, requiriendo el uso explícito de `this.nombre` para acceder al campo del objeto.
---

Elegí una respuesta por pregunta y presioná **Calificar** para revisar tu comprensión sobre variables, tipos de datos y operadores en Java.
