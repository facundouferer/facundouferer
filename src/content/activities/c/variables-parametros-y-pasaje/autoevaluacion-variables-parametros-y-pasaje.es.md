---
course: 'c'
lesson: 'variables-parametros-y-pasaje'
slug: 'autoevaluacion-variables-parametros-y-pasaje'
title: 'Autoevaluación: Variables, parámetros y pasaje'
description: 'Doce preguntas sobre variables locales y globales, alcance de bloque y de archivo, ocultamiento de nombres, duración automática y estática, variables locales static y el pasaje de argumentos siempre por valor.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'true-false'
    id: 'q1'
    prompt: 'En C, los argumentos se pasan siempre por valor: la función recibe una copia de cada argumento.'
    correctAnswer: true
    explanation: >-
      Al llamar a una función, cada argumento se evalúa y su valor se copia en
      el parámetro. No hay excepciones: incluso cuando se pasa una dirección,
      lo que se copia es esa dirección.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      void duplicar(int x) {
          x = x * 2;
          printf("Dentro: %d\n", x);
      }

      int main(void) {
          int numero = 7;
          duplicar(numero);
          printf("En main: %d\n", numero);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Dentro: 14` y `En main: 14`'
      - id: 'b'
        text: '`Dentro: 14` y `En main: 7`'
      - id: 'c'
        text: '`Dentro: 7` y `En main: 7`'
      - id: 'd'
        text: 'No compila, porque no se puede asignar a un parámetro.'
    correctOptionId: 'b'
    explanation: >-
      `x` es una variable local de `duplicar` que empieza con una copia del
      valor 7. Cambiar `x` no toca `numero`: lo único que viajó de una a otra
      fue el número 7.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int siguiente(void) {
          static int contador = 10;
          contador = contador + 5;
          return contador;
      }

      int main(void) {
          printf("%d ", siguiente());
          printf("%d ", siguiente());
          printf("%d\n", siguiente());
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`15 15 15`'
      - id: 'b'
        text: '`10 15 20`'
      - id: 'c'
        text: '`15 20 25`'
      - id: 'd'
        text: '`5 10 15`'
    correctOptionId: 'c'
    explanation: >-
      `contador` es local pero `static`: se inicializa una sola vez con 10 y
      conserva su valor entre llamadas. Cada llamada le suma 5: 15, 20 y 25. Sin
      `static`, mostraría `15 15 15`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int nivel = 1;

      int main(void) {
          printf("%d ", nivel);
          int nivel = 2;
          {
              int nivel = 3;
              nivel = nivel + 1;
              printf("%d ", nivel);
          }
          printf("%d\n", nivel);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1 4 2`'
      - id: 'b'
        text: '`1 4 4`'
      - id: 'c'
        text: '`2 4 2`'
      - id: 'd'
        text: '`1 3 2`'
    correctOptionId: 'a'
    explanation: >-
      El primer `printf` ve la global (1). Después, la local `nivel = 2` oculta a
      la global, y dentro del bloque otra `nivel` oculta a esa: vale 3 y pasa a
      4. Al cerrar el bloque, la variable interna deja de existir y vuelve a
      verse la de `main` (2). Es legal, pero confunde: `-Wshadow` lo avisa.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué afirmación sobre el "pasaje por referencia" es correcta en C?'
    options:
      - id: 'a'
        text: 'C pasa los números por valor y las variables por referencia.'
      - id: 'b'
        text: 'Basta con usar el mismo nombre en el parámetro y en el argumento para que la función modifique el original.'
      - id: 'c'
        text: 'C no tiene ese mecanismo: para modificar una variable de quien llama se pasa su dirección, y esa dirección también se copia (se pasa por valor).'
      - id: 'd'
        text: 'Se activa declarando el parámetro como `static`.'
    correctOptionId: 'c'
    explanation: >-
      La técnica de pasar una dirección (como en `scanf("%d", &n)`) permite que
      la función acceda a la variable original, pero no es un pasaje por
      referencia: la función recibe una copia de la dirección. Los punteros se
      estudian en `punteros-y-direcciones`; hasta entonces, comunica resultados
      con `return`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Este programa debería mostrar `Precio final: 180.00`, pero muestra `200.00`. ¿Cuál es la corrección adecuada con lo visto hasta ahora?'
    code: |-
      #include <stdio.h>

      void aplicar_descuento(double precio) {
          precio = precio * 0.9;
      }

      int main(void) {
          double precio = 200.0;
          aplicar_descuento(precio);
          printf("Precio final: %.2f\n", precio);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Hacer que la función devuelva el nuevo precio (`double con_descuento(double precio)`) y asignar el resultado en `main`: `precio = con_descuento(precio);`.'
      - id: 'b'
        text: 'Declarar el parámetro como `static double precio`.'
      - id: 'c'
        text: 'Cambiar el nombre del parámetro para que no coincida con el de `main`.'
      - id: 'd'
        text: 'Mover `printf` dentro de `aplicar_descuento`.'
    correctOptionId: 'a'
    explanation: >-
      La función modifica su copia, que desaparece al terminar. Devolver el
      resultado deja claro en `main` que `precio` cambia y dónde. Cambiar
      nombres no sirve: el parámetro sigue siendo otra variable.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Una variable global que no se inicializa explícitamente empieza valiendo 0.'
    correctAnswer: true
    explanation: >-
      Las variables con duración estática (las globales y las locales `static`)
      se inicializan una sola vez, antes de que empiece `main`, y si no les das
      un valor empiezan en cero. Las locales automáticas, en cambio, tienen un
      valor indeterminado.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Dentro de una función aparece `static int fallos = 0;`. ¿Qué alcance y qué duración tiene `fallos`?'
    options:
      - id: 'a'
        text: 'Alcance de archivo y duración automática.'
      - id: 'b'
        text: 'Alcance de bloque (solo se ve en la función) y duración estática (conserva su valor entre llamadas).'
      - id: 'c'
        text: 'Alcance de archivo y duración estática: cualquier función puede modificarla.'
      - id: 'd'
        text: 'Alcance de bloque y duración automática: se reinicia en cada llamada.'
    correctOptionId: 'b'
    explanation: >-
      El alcance dice dónde se ve un nombre y la duración dice cuándo existe la
      variable. Una local `static` combina alcance de bloque con duración
      estática.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'Este programa no compila. ¿Por qué?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int suma = 0;
          for (int i = 1; i <= 3; i++) {
              suma = suma + i;
          }
          printf("%d %d\n", suma, i);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Porque `suma` se modifica dentro del ciclo.'
      - id: 'b'
        text: 'Porque `i` se declaró en el `for` y solo existe dentro del ciclo: después de la llave de cierre ya no está en alcance.'
      - id: 'c'
        text: 'Porque `i` debería ser global.'
      - id: 'd'
        text: 'Porque `printf` no puede mostrar dos valores.'
    correctOptionId: 'b'
    explanation: >-
      El `i` de `for (int i = 1; ...)` tiene alcance de bloque: solo existe
      dentro del ciclo. Si necesitas su valor después, declárala antes del `for`.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Una variable local común (sin `static`) conserva su valor de una llamada a la siguiente.'
    correctAnswer: false
    explanation: >-
      Las locales comunes tienen duración automática: se crean de nuevo en cada
      llamada y desaparecen al salir. Para que conserve su valor, hay que
      declararla `static`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Qué efecto tiene `static` en `static int total_ventas = 0;` escrita fuera de toda función?'
    options:
      - id: 'a'
        text: 'Hace que la variable no se pueda modificar.'
      - id: 'b'
        text: 'Le da duración automática.'
      - id: 'c'
        text: 'La convierte en una variable local de `main`.'
      - id: 'd'
        text: 'Oculta su nombre a los demás archivos del programa: solo se puede usar en ese archivo.'
    correctOptionId: 'd'
    explanation: >-
      En el nivel de archivo, `static` oculta el nombre a las demás unidades de
      compilación, como con las funciones. La variable ya tenía duración
      estática por ser global; dentro de una función, en cambio, `static` le da
      duración estática.
  - kind: 'single-choice'
    id: 'q12'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int ajustar(int n) {
          n = n + 10;
          return n * 2;
      }

      int main(void) {
          int a = 1;
          int b = ajustar(a);
          a = ajustar(b);
          printf("%d %d\n", a, b);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`64 22`'
      - id: 'b'
        text: '`1 22`'
      - id: 'c'
        text: '`22 22`'
      - id: 'd'
        text: '`64 64`'
    correctOptionId: 'a'
    explanation: >-
      `ajustar(1)` trabaja con una copia: `(1 + 10) * 2` es 22, y `a` no cambia
      por la llamada. Después, `main` decide asignar: `a = ajustar(22)`, que es
      `(22 + 10) * 2 = 64`. `b` sigue en 22.
---
