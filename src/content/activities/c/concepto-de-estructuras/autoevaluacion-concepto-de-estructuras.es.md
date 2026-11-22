---
course: 'c'
lesson: 'concepto-de-estructuras'
slug: 'autoevaluacion-concepto-de-estructuras'
title: 'Autoevaluación: Estructuras (struct)'
description: 'Doce preguntas sobre definición y declaración de estructuras, inicializadores designados, copia por valor, arreglos de estructuras, typedef, enum, union etiquetada, relleno y comparación campo por campo.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Después de escribir solo la definición `struct alumno { int legajo; char nombre[40]; double promedio; };`, ¿qué existe en el programa?'
    options:
      - id: 'a'
        text: 'Una variable llamada `alumno` con sus tres campos en cero.'
      - id: 'b'
        text: 'Un tipo nuevo, `struct alumno`, pero ninguna variable de ese tipo.'
      - id: 'c'
        text: 'Un arreglo de 40 alumnos.'
      - id: 'd'
        text: 'Nada: la definición solo es válida dentro de `main`.'
    correctOptionId: 'b'
    explanation: >-
      Definir la estructura describe el plano del registro: qué campos tiene y
      de qué tipo. Las variables se declaran después, por ejemplo con
      `struct alumno a;`, y cada una tiene sus propios campos.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <string.h>

      struct alumno {
          int legajo;
          char nombre[40];
          double promedio;
      };

      int main(void) {
          struct alumno c = {.legajo = 1023};

          printf("%d %.2f %zu\n", c.legajo, c.promedio, strlen(c.nombre));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1023 0.00 0`'
      - id: 'b'
        text: 'Un promedio y un largo impredecibles, porque esos campos no se inicializaron.'
      - id: 'c'
        text: '`1023 0.00 40`'
      - id: 'd'
        text: 'No compila: con inicializadores designados hay que nombrar todos los campos.'
    correctOptionId: 'a'
    explanation: >-
      Con un inicializador designado, los campos que no se nombran quedan en
      cero: el promedio vale `0.0` y el nombre es la cadena vacía, cuyo largo
      es 0. El 40 es la capacidad del arreglo, no el largo de la cadena.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'Si `a` y `b` son variables `struct alumno`, la asignación `b = a;` copia todos los campos, incluido el arreglo `nombre`, y después `a` y `b` son registros independientes.'
    correctAnswer: true
    explanation: >-
      A diferencia de los arreglos sueltos, las estructuras se pueden asignar
      con `=`. La copia es campo por campo, incluidos los arreglos que están
      dentro, así que cambiar `b.nombre` no cambia `a.nombre`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      typedef struct {
          char nombre[10];
          int puntos;
      } Jugador;

      void sumar_diez(Jugador j) {
          j.puntos += 10;
      }

      Jugador sumar_cinco(Jugador j) {
          j.puntos += 5;
          return j;
      }

      int main(void) {
          Jugador a = {.nombre = "Ana", .puntos = 3};

          sumar_diez(a);
          Jugador b = sumar_cinco(a);
          printf("%d %d\n", a.puntos, b.puntos);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`13 18`'
      - id: 'b'
        text: '`3 8`'
      - id: 'c'
        text: '`13 8`'
      - id: 'd'
        text: '`3 18`'
    correctOptionId: 'b'
    explanation: >-
      C pasa las estructuras por valor: cada función recibe una copia.
      `sumar_diez` cambia su copia, que desaparece al terminar, así que `a`
      sigue con 3. `sumar_cinco` devuelve su copia modificada y esa copia se
      guarda en `b`, que vale 8.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Este programa no compila. ¿Cuál es el error y cómo se corrige?'
    code: |-
      #include <stdio.h>

      struct alumno {
          int legajo;
          char nombre[40];
      };

      int main(void) {
          struct alumno a = {.legajo = 7};
          a.nombre = "Ana";
          printf("%d %s\n", a.legajo, a.nombre);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta el `;` después de `struct alumno a`; se corrige agregándolo.'
      - id: 'b'
        text: '`nombre` es un arreglo y no se le puede asignar con `=`; se copia la cadena con `strcpy` (o con una copia segura como `snprintf`), incluyendo `<string.h>` si hace falta.'
      - id: 'c'
        text: 'Un campo cadena no puede tener 40 caracteres; hay que declararlo como `char nombre;`.'
      - id: 'd'
        text: 'El operador correcto para acceder al campo es `a:nombre`.'
    correctOptionId: 'b'
    explanation: >-
      Un campo `char nombre[40]` es un arreglo, y un arreglo no se asigna con
      `=` (el compilador avisa que el tipo `char[40]` no es asignable). Un
      literal solo se puede usar al inicializar; después la cadena se copia
      con una función.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Dos variables del mismo tipo `struct punto` se pueden comparar directamente con `a == b`.'
    correctAnswer: false
    explanation: >-
      C no define `==` para estructuras: el código no compila. Se escribe una
      función que compara los campos que definen la igualdad para el problema,
      usando `strcmp` para las cadenas.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      enum nivel { BAJO, MEDIO = 5, ALTO };

      int main(void) {
          printf("%d %d %d\n", BAJO, MEDIO, ALTO);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`0 1 2`'
      - id: 'b'
        text: '`1 5 6`'
      - id: 'c'
        text: '`0 5 6`'
      - id: 'd'
        text: '`0 5 2`'
    correctOptionId: 'c'
    explanation: >-
      El primer enumerador vale 0 si no se le asigna otro valor. `MEDIO` vale
      5 porque se lo indica, y cada enumerador siguiente vale uno más que el
      anterior: `ALTO` vale 6.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Después de `typedef struct alumno Alumno;`, `Alumno` y `struct alumno` son dos tipos distintos e incompatibles.'
    correctAnswer: false
    explanation: >-
      `typedef` no crea un tipo nuevo: crea un alias. `Alumno` y
      `struct alumno` son exactamente el mismo tipo y se pueden mezclar.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Por qué una `union` casi siempre va dentro de una `struct` junto con un campo `enum` (una unión etiquetada)?'
    options:
      - id: 'a'
        text: 'Porque la `union` guarda un solo campo a la vez y no recuerda cuál se escribió último; la etiqueta indica qué campo es válido leer.'
      - id: 'b'
        text: 'Porque una `union` sin `enum` no compila.'
      - id: 'c'
        text: 'Porque el `enum` hace que la `union` guarde todos sus campos al mismo tiempo.'
      - id: 'd'
        text: 'Porque así la `union` ocupa la suma de los tamaños de sus campos.'
    correctOptionId: 'a'
    explanation: >-
      Los campos de una `union` comparten la misma memoria. Leer un campo
      distinto del último escrito reinterpreta esos bytes y da un resultado
      sin sentido. La etiqueta, que se escribe junto con el dato, dice cuál
      leer.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Una estructura tiene un `char`, un `int` y otro `char`. En una plataforma típica, `sizeof` de la estructura da 12 aunque los campos suman 6 bytes. ¿Por qué?'
    options:
      - id: 'a'
        text: 'Porque el compilador reordena los campos de mayor a menor.'
      - id: 'b'
        text: 'Porque `sizeof` cuenta también el nombre de la estructura.'
      - id: 'c'
        text: 'Porque el compilador agrega bytes de relleno para que cada campo quede alineado, también al final de la estructura.'
      - id: 'd'
        text: 'Porque cada campo ocupa siempre 4 bytes.'
    correctOptionId: 'c'
    explanation: >-
      El relleno (padding) deja el `int` en una dirección alineada y agrega
      bytes al final para que, en un arreglo, el siguiente elemento también
      quede alineado. Los campos se guardan en el orden declarado; por eso hay
      que usar `sizeof` y no sumar tamaños a mano.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      struct item {
          char nombre[10];
          int cantidad;
      };

      int main(void) {
          struct item despensa[] = {{"pan", 2}, {"leche", 0}, {"queso", 3}};
          size_t n = sizeof despensa / sizeof despensa[0];
          int total = 0;

          for (size_t i = 0; i < n; i++) {
              if (despensa[i].cantidad > 0) {
                  total += despensa[i].cantidad;
              }
          }
          printf("%zu %d\n", n, total);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 5`'
      - id: 'b'
        text: '`2 5`'
      - id: 'c'
        text: '`42 5`'
      - id: 'd'
        text: '`3 2`'
    correctOptionId: 'a'
    explanation: >-
      `sizeof despensa / sizeof despensa[0]` da la cantidad de elementos: 3,
      sea cual sea el tamaño de cada registro. El ciclo suma las cantidades
      mayores que cero: 2 + 3 = 5.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Comparar todos los bytes de dos estructuras (por ejemplo con `memcmp`) es una forma confiable de saber si tienen los mismos datos.'
    correctAnswer: false
    explanation: >-
      Los bytes de relleno pueden tener cualquier valor, y lo mismo pasa con
      los caracteres que quedan después del `\0` de una cadena. Dos registros
      con los mismos datos pueden diferir en esos bytes. Se compara campo por
      campo.
---
