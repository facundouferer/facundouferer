---
course: 'c'
lesson: 'encapsulacion-y-abstraccion-en-c'
slug: 'autoevaluacion-encapsulacion-y-abstraccion-en-c'
title: 'Autoevaluación: Encapsulación y tipos opacos'
description: 'Once preguntas sobre tipos incompletos y opacos, funciones de creación y destrucción, propiedad y punteros prestados, invariantes, funciones static y la compilación de un módulo en varios archivos.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué hace la línea `typedef struct Cuenta Cuenta;` en `cuenta.h`, si la definición de la estructura está solo en `cuenta.c`?'
    options:
      - id: 'a'
        text: 'Define la estructura con todos sus campos visibles para quien incluya el encabezado.'
      - id: 'b'
        text: 'Declara `struct Cuenta` como tipo incompleto y le da el nombre corto `Cuenta`; quien incluye el encabezado solo puede usar `Cuenta *`.'
      - id: 'c'
        text: 'Reserva memoria para una cuenta.'
      - id: 'd'
        text: 'Hace que los campos de la cuenta sean `private`.'
    correctOptionId: 'b'
    explanation: >-
      Fuera de `cuenta.c`, `struct Cuenta` es un tipo incompleto: se pueden
      declarar y pasar punteros, pero no conocer sus campos. C no tiene
      `private`; el ocultamiento viene de que la definición no está visible.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Este `main.c` compila, porque `contador.h` declara el tipo `Contador`.'
    code: |-
      #include "contador.h"

      int main(void) {
          Contador c;
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      `Contador` es un tipo incompleto en `main.c`. Para declarar una variable,
      el compilador necesita conocer su tamaño, y no lo conoce; el error es
      "variable has incomplete type". Con un tipo opaco solo se declaran
      punteros (`Contador *c`).
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'En un archivo que incluye solo `cuenta.h` (tipo opaco), ¿cuál de estas líneas compila?'
    options:
      - id: 'a'
        text: '`size_t n = sizeof(Cuenta);`'
      - id: 'b'
        text: '`Cuenta *c = NULL;`'
      - id: 'c'
        text: '`c->saldo_centavos = 0;` (con `c` de tipo `Cuenta *`)'
      - id: 'd'
        text: '`Cuenta cuentas[10];`'
    correctOptionId: 'b'
    explanation: >-
      Con un tipo incompleto se pueden declarar punteros. `sizeof`, un arreglo
      de cuentas y el acceso a campos necesitan la definición completa, que solo
      existe en `cuenta.c`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Con el módulo `contador` de la lección (`contador_crear` devuelve `NULL` si `maximo <= 0`; `contador_incrementar` devuelve `false` al llegar al máximo), ¿qué muestra este `main.c`?'
    code: |-
      #include <stdio.h>

      #include "contador.h"

      int main(void) {
          Contador *a = contador_crear(2);
          Contador *b = contador_crear(0);
          int fallos = 0;

          for (int i = 0; i < 4; i++) {
              if (!contador_incrementar(a)) {
                  fallos++;
              }
          }
          printf("%d %d %s\n", contador_valor(a), fallos, b == NULL ? "nulo" : "creado");
          contador_destruir(a);
          contador_destruir(b);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`4 0 creado`'
      - id: 'b'
        text: '`2 2 nulo`'
      - id: 'c'
        text: '`2 2 creado`'
      - id: 'd'
        text: '`3 1 nulo`'
    correctOptionId: 'b'
    explanation: >-
      El contador `a` sube a 1 y a 2; las otras dos llamadas fallan porque ya
      llegó al máximo. `contador_crear(0)` rechaza el máximo y devuelve `NULL`.
      `contador_destruir(b)` recibe `NULL` y es seguro, porque `free(NULL)` no
      hace nada.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Un programa libera una cuenta de la lección con `free(c);` en lugar de `cuenta_destruir(c);`. ¿Qué problema tiene?'
    code: |-
      Cuenta *c = cuenta_crear("Luis", 500);
      if (c == NULL) {
          return 1;
      }
      free(c);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Ninguno: `free` y `cuenta_destruir` hacen lo mismo.'
      - id: 'b'
        text: 'No compila, porque `free` no acepta punteros a tipos opacos.'
      - id: 'c'
        text: 'Se libera el bloque de la cuenta pero no la copia del titular que contiene: hay una fuga de memoria.'
      - id: 'd'
        text: 'Se libera dos veces el mismo bloque.'
    correctOptionId: 'c'
    explanation: >-
      Quien usa un tipo opaco no sabe qué contiene, así que no puede saber qué
      liberar. `cuenta_destruir` libera primero el titular y después la cuenta;
      por eso la documentación de propiedad dice que el resultado de
      `cuenta_crear` se libera con `cuenta_destruir`.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Una función declarada `static` en `cuenta.c` se puede llamar desde `main.c` si se escribe su prototipo allí.'
    correctAnswer: false
    explanation: >-
      `static` le da enlace interno: la función solo existe dentro de
      `cuenta.c`. Aunque `main.c` declare un prototipo, el enlazador no la
      encuentra. Es lo más parecido a una operación privada que tiene C.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué es un **invariante** de un tipo?'
    options:
      - id: 'a'
        text: 'Una variable global que nunca cambia.'
      - id: 'b'
        text: 'Una condición que se cumple siempre que el objeto está disponible para quien lo usa, como "el saldo nunca es negativo".'
      - id: 'c'
        text: 'Un campo declarado con `const`.'
      - id: 'd'
        text: 'Una función que no recibe parámetros.'
    correctOptionId: 'b'
    explanation: >-
      La creación establece el invariante, cada operación lo mantiene y la
      destrucción libera todo. Con un tipo opaco, para verificarlo alcanza con
      revisar un solo archivo, porque nadie más puede tocar los campos.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Con la implementación de la lección, llamar a `cuenta_destruir(NULL)` es seguro.'
    correctAnswer: true
    explanation: >-
      `cuenta_destruir` comprueba `cuenta == NULL` y retorna sin hacer nada.
      Aceptar `NULL` simplifica el código de quien la usa, por ejemplo al
      limpiar después de una creación fallida.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'El enlazado de esta sesión falla. ¿Por qué?'
    code: |-
      $ gcc -std=c23 -Wall -Wextra -Wpedantic -c cuenta.c
      $ gcc -std=c23 -Wall -Wextra -Wpedantic -c main.c
      $ gcc main.o -o cuenta
      Undefined symbols for architecture arm64:
        "_cuenta_crear", referenced from:
            _main in main.o
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Falta `#include "cuenta.h"` en `main.c`.'
      - id: 'b'
        text: 'El comando de enlazado no recibe `cuenta.o`, que contiene las definiciones; debe ser `gcc cuenta.o main.o -o cuenta`.'
      - id: 'c'
        text: 'Las funciones de un tipo opaco no se pueden enlazar.'
      - id: 'd'
        text: 'Falta la opción `-fsanitize=address`.'
    correctOptionId: 'b'
    explanation: >-
      `main.c` compiló porque el encabezado declara `cuenta_crear`, pero la
      definición está en `cuenta.o`. El enlazador necesita los dos objetos (en
      GCC sobre Linux el mensaje es "undefined reference to cuenta_crear").
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Cuál es un costo real de usar un tipo opaco?'
    options:
      - id: 'a'
        text: 'El programa no puede tener más de un objeto de ese tipo.'
      - id: 'b'
        text: 'Quien usa el tipo no puede declarar el objeto en la pila: cada objeto pasa por `malloc` y necesita su función de destrucción.'
      - id: 'c'
        text: 'Las funciones del módulo no pueden recibir parámetros.'
      - id: 'd'
        text: 'Hay que compilar con un estándar anterior a C23.'
    correctOptionId: 'b'
    explanation: >-
      Como el tamaño es desconocido fuera del `.c`, los objetos se crean con
      memoria dinámica. Además, cada acceso es una llamada a función. Por eso un
      tipo sin reglas, como un punto con `x` e `y`, suele quedar mejor como
      estructura visible.
  - kind: 'true-false'
    id: 'q11'
    prompt: 'Este uso es correcto, porque `nombre` se obtuvo antes de destruir la cuenta.'
    code: |-
      Cuenta *c = cuenta_crear("Luis", 500);
      if (c == NULL) {
          return 1;
      }
      const char *nombre = cuenta_titular(c);
      cuenta_destruir(c);
      printf("%s\n", nombre);
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      `cuenta_titular` devuelve un puntero **prestado**, válido mientras la
      cuenta exista. Después de `cuenta_destruir`, `nombre` apunta a memoria
      liberada; AddressSanitizer informa `heap-use-after-free`. La corrección es
      usar `nombre` antes de destruir la cuenta.
---
