---
course: 'c'
lesson: 'variables-y-constantes'
slug: 'autoevaluacion-variables-y-constantes'
title: 'Autoevaluación: Variables y Constantes'
description: 'Doce preguntas sobre declarar, inicializar y asignar, variables sin inicializar, identificadores, literales y sus sufijos, constantes con const y #define, y los separadores de dígitos de C23.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'En estas dos líneas, ¿qué hace la segunda?'
    code: |-
      int edad;
      edad = 18;
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Declara la variable `edad`.'
      - id: 'b'
        text: 'Inicializa la variable `edad`, porque es el primer valor que recibe.'
      - id: 'c'
        text: 'Asigna el valor 18 a una variable que ya existía.'
      - id: 'd'
        text: 'Compara `edad` con 18.'
    correctOptionId: 'c'
    explanation: >-
      La primera línea declara `edad` sin valor. La segunda le asigna 18 con
      `=`. Inicializar es dar el valor en la misma declaración (`int edad = 18;`).
      Comparar sería `edad == 18`.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Una variable local declarada sin inicializar, como `int total;`, empieza valiendo 0.'
    correctAnswer: false
    explanation: >-
      Su valor es indeterminado: contiene lo que haya quedado en esa zona de
      memoria. Leerlo antes de asignarle algo es un error de programa, aunque
      compile y a veces parezca funcionar. Por eso conviene inicializar siempre.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      #define BASE 3 + 2

      int main(void) {
          int resultado = BASE * 2;
          printf("%d\n", resultado);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`10`'
      - id: 'b'
        text: '`7`'
      - id: 'c'
        text: '`8`'
      - id: 'd'
        text: 'No compila: una macro no puede contener una suma.'
    correctOptionId: 'b'
    explanation: >-
      `#define` sustituye texto: la expresión queda `3 + 2 * 2`, y la
      multiplicación se resuelve primero, así que vale `3 + 4 = 7`. Con
      `#define BASE (3 + 2)` el resultado sería `10`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int codigo = 010;
          printf("%d\n", codigo + 1);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`11`'
      - id: 'b'
        text: '`011`'
      - id: 'c'
        text: '`9`'
      - id: 'd'
        text: '`3`'
    correctOptionId: 'c'
    explanation: >-
      Un `0` delante convierte el literal en octal: `010` vale 8, no 10. Por eso
      `codigo + 1` es 9. No agregues ceros a la izquierda "para alinear".
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Cuál de estos identificadores es válido en C?'
    options:
      - id: 'a'
        text: '`2total`'
      - id: 'b'
        text: '`precio-final`'
      - id: 'c'
        text: '`float`'
      - id: 'd'
        text: '`precio_final`'
    correctOptionId: 'd'
    explanation: >-
      Un identificador usa letras, dígitos y `_`, y no empieza con un dígito.
      `2total` empieza con un dígito, `precio-final` tiene un guion medio (que es
      el operador resta) y `float` es una palabra reservada.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'En C, `edad` y `Edad` son dos nombres distintos.'
    correctAnswer: true
    explanation: >-
      C distingue mayúsculas de minúsculas, así que son dos identificadores
      distintos. Que sea legal no significa que sea buena idea: usar nombres que
      solo difieren en una mayúscula confunde a quien lee.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Este programa no compila. ¿Por qué?'
    code: |-
      int main(void) {
          const int DIAS_SEMANA = 7;
          DIAS_SEMANA = 8;
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Porque `const` solo se puede usar con `double`.'
      - id: 'b'
        text: 'Porque `DIAS_SEMANA` es una constante: no se le puede asignar otro valor después de inicializarla.'
      - id: 'c'
        text: 'Porque los nombres en mayúsculas están reservados para las macros.'
      - id: 'd'
        text: 'Porque falta `#include <stdio.h>`.'
    correctOptionId: 'b'
    explanation: >-
      `const` crea un objeto con tipo que no se puede modificar. El compilador
      rechaza la asignación, y ese error es una ayuda: protege un valor que
      decidiste fijo. Si el valor debe cambiar, no tiene que ser `const`.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué tipo tiene el literal `9.81`, sin sufijo?'
    options:
      - id: 'a'
        text: '`float`'
      - id: 'b'
        text: '`double`'
      - id: 'c'
        text: '`int`, porque se redondea'
      - id: 'd'
        text: '`long`'
    correctOptionId: 'b'
    explanation: >-
      Un literal con punto decimal y sin sufijo es `double`. Para un `float` se
      escribe el sufijo `f` (`9.81f`), así el tipo del literal coincide con el de
      la variable.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      #define CANTIDAD 4

      int main(void) {
          const int PRECIO = 25;
          int total = 0;

          total = PRECIO * CANTIDAD;
          total = total - 10;
          printf("Total: %d\n", total);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Total: 100`'
      - id: 'b'
        text: '`Total: 0`'
      - id: 'c'
        text: '`Total: 90`'
      - id: 'd'
        text: 'No compila, porque `total` se asigna dos veces.'
    correctOptionId: 'c'
    explanation: >-
      `total` empieza en 0, después recibe `25 * 4 = 100` y luego
      `100 - 10 = 90`. Una variable puede asignarse todas las veces que haga
      falta: es la misma variable con otro contenido.
  - kind: 'true-false'
    id: 'q10'
    prompt: '`#define IVA 0.21` crea una variable de tipo `double` que el compilador verifica.'
    correctAnswer: false
    explanation: >-
      `#define` es una directiva del preprocesador: reemplaza el texto `IVA` por
      `0.21` antes de compilar y no crea ninguna variable. Para un valor con
      tipo que el compilador verifique, se prefiere `const double IVA = 0.21;`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Este programa debería mostrar `Suma: 15`, pero a veces muestra un número absurdo. ¿Cuál es el error?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int suma;
          suma = suma + 5;
          suma = suma + 10;
          printf("Suma: %d\n", suma);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta el sufijo `u` en los literales.'
      - id: 'b'
        text: '`suma` no está inicializada: la primera suma lee un valor indeterminado. Se corrige con `int suma = 0;`.'
      - id: 'c'
        text: 'No se puede usar una variable a ambos lados del `=`.'
      - id: 'd'
        text: '`printf` necesita `%f` para mostrar una suma.'
    correctOptionId: 'b'
    explanation: >-
      `suma = suma + 5` lee `suma` antes de que tenga un valor conocido. Es un
      error aunque compile; con `-Wall` el compilador suele avisarlo. Inicializar
      con un valor que tenga sentido (aquí, 0) lo resuelve.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'En C23, `1''000''000` es un literal válido que vale lo mismo que `1000000`.'
    correctAnswer: true
    explanation: >-
      C23 permite separar los dígitos con apóstrofes para leer mejor los
      números largos. Antes de C23 los separadores no existían, así que con
      `-std=c17` no los uses.
---
