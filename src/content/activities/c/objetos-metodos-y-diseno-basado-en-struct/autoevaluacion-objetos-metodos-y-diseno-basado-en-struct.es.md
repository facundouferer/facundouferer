---
course: 'c'
lesson: 'objetos-metodos-y-diseno-basado-en-struct'
slug: 'autoevaluacion-objetos-metodos-y-diseno-basado-en-struct'
title: 'Autoevaluación: Objetos y operaciones: diseño basado en struct'
description: 'Once preguntas sobre el objeto como primer parámetro, paso por valor o por puntero, consultas con const, composición y delegación, propiedad de las partes y errores con códigos de resultado y parámetros de salida.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'En el diseño basado en `struct`, ¿cómo se escribe una operación que modifica un rectángulo?'
    options:
      - id: 'a'
        text: 'Como una función dentro de la `struct`, igual que un método.'
      - id: 'b'
        text: 'Como una función con un prefijo común que recibe la dirección del rectángulo como primer parámetro: `void rectangulo_escalar(struct Rectangulo *r, double factor)`.'
      - id: 'c'
        text: 'Como una función sin parámetros que usa un rectángulo global.'
      - id: 'd'
        text: 'Como una macro del preprocesador.'
    correctOptionId: 'b'
    explanation: >-
      C no tiene métodos. El puntero como primer parámetro cumple el papel de
      `this` o `self`, pero explícito, y el prefijo `rectangulo_` evita choques
      de nombres porque C no tiene espacios de nombres.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      struct Rectangulo {
          double base;
          double altura;
      };

      void rectangulo_escalar(struct Rectangulo r, double factor) {
          r.base *= factor;
          r.altura *= factor;
      }

      int main(void) {
          struct Rectangulo rect = {4.0, 2.0};
          rectangulo_escalar(rect, 3.0);
          printf("%.1f x %.1f\n", rect.base, rect.altura);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`12.0 x 6.0`'
      - id: 'b'
        text: '`4.0 x 2.0`'
      - id: 'c'
        text: '`12.0 x 2.0`'
      - id: 'd'
        text: 'No compila.'
    correctOptionId: 'b'
    explanation: >-
      C pasa los argumentos por valor: `r` es una copia de `rect`. Escalar la
      copia no afecta al original. Para modificarlo, la función debe recibir
      `struct Rectangulo *` y llamarse con `&rect`.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'Una operación que solo lee el objeto debería recibir un puntero a `const`, por ejemplo `double rectangulo_area(const struct Rectangulo *r)`.'
    correctAnswer: true
    explanation: >-
      El `const` documenta que es una consulta, hace que el compilador rechace
      modificaciones accidentales y permite llamarla desde código que solo tiene
      un `const struct Rectangulo *`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué ocurre al compilar esta consulta?'
    code: |-
      struct Rectangulo {
          double base;
          double altura;
      };

      double rectangulo_area(const struct Rectangulo *r) {
          if (r->base < 0) {
              r->base = 0;
          }
          return r->base * r->altura;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Compila sin advertencias y corrige la base negativa.'
      - id: 'b'
        text: 'Error de compilación: no se puede asignar a un campo a través de un puntero a `const`.'
      - id: 'c'
        text: 'Compila, pero la asignación se ignora en tiempo de ejecución.'
      - id: 'd'
        text: 'Error de enlazado.'
    correctOptionId: 'b'
    explanation: >-
      La firma promete no modificar el objeto y el compilador hace cumplir esa
      promesa. Si una operación necesita corregir datos, es una modificadora y
      debe recibir `struct Rectangulo *`; mejor aún, la regla se valida al crear
      o modificar el rectángulo, no en una consulta.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué es la **composición**?'
    options:
      - id: 'a'
        text: 'Construir un tipo con otros tipos como campos: un rectángulo **tiene** una esquina que es un punto.'
      - id: 'b'
        text: 'Llamar a dos funciones en la misma línea.'
      - id: 'c'
        text: 'Un mecanismo del lenguaje para que un tipo herede las funciones de otro.'
      - id: 'd'
        text: 'Copiar una estructura en otra con `=`.'
    correctOptionId: 'a'
    explanation: >-
      En la composición cada tipo conserva sus operaciones y el tipo compuesto
      delega en las de sus partes, como `rectangulo_mover`, que llama a
      `punto_mover` sobre su esquina.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      struct Punto {
          int x;
          int y;
      };

      void punto_mover(struct Punto *p, int dx, int dy) {
          p->x += dx;
          p->y += dy;
      }

      struct Segmento {
          struct Punto inicio;
          struct Punto fin;
      };

      void segmento_mover(struct Segmento *s, int dx, int dy) {
          punto_mover(&s->inicio, dx, dy);
          punto_mover(&s->fin, dx, dy);
      }

      int main(void) {
          struct Segmento s = {{0, 0}, {3, 4}};
          segmento_mover(&s, 2, -1);
          segmento_mover(&s, 1, 1);
          printf("(%d, %d) -> (%d, %d)\n", s.inicio.x, s.inicio.y, s.fin.x, s.fin.y);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`(3, 0) -> (6, 4)`'
      - id: 'b'
        text: '`(0, 0) -> (3, 4)`'
      - id: 'c'
        text: '`(3, 0) -> (3, 4)`'
      - id: 'd'
        text: '`(2, -1) -> (5, 3)`'
    correctOptionId: 'a'
    explanation: >-
      Cada movimiento se delega en los dos puntos. En total se suma 3 a x y 0 a
      y: el inicio pasa de (0, 0) a (3, 0) y el fin de (3, 4) a (6, 4).
  - kind: 'true-false'
    id: 'q7'
    prompt: 'En `punto_mover(&r->esquina, dx, dy)`, la expresión `&r->esquina` equivale a `(&r)->esquina`.'
    correctAnswer: false
    explanation: >-
      `->` tiene más precedencia que `&`, así que `&r->esquina` es
      `&(r->esquina)`: la dirección del campo `esquina` dentro del rectángulo al
      que apunta `r`.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <string.h>

      enum Resultado { RES_OK, RES_NO_ENCONTRADO };

      struct Alumno {
          char nombre[16];
          int nota;
      };

      enum Resultado buscar_nota(const struct Alumno *alumnos, size_t n, const char *nombre, int *nota) {
          for (size_t i = 0; i < n; i++) {
              if (strcmp(alumnos[i].nombre, nombre) == 0) {
                  *nota = alumnos[i].nota;
                  return RES_OK;
              }
          }
          return RES_NO_ENCONTRADO;
      }

      int main(void) {
          struct Alumno curso[] = {{"Ana", 9}, {"Leo", 6}};
          int nota = -1;
          enum Resultado r1 = buscar_nota(curso, 2, "Leo", &nota);
          enum Resultado r2 = buscar_nota(curso, 2, "Eva", &nota);
          printf("%d %d %d\n", r1, r2, nota);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`0 1 -1`'
      - id: 'b'
        text: '`0 1 6`'
      - id: 'c'
        text: '`1 0 6`'
      - id: 'd'
        text: '`0 0 9`'
    correctOptionId: 'b'
    explanation: >-
      Los enumeradores valen 0 y 1 en orden. La primera búsqueda encuentra a Leo
      y escribe 6 en `nota` por el parámetro de salida. La segunda no encuentra
      a Eva, devuelve `RES_NO_ENCONTRADO` y no toca `nota`, que conserva 6.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'En el inventario de la lección, si `realloc` falla al agregar un producto, el inventario conserva su arreglo anterior y la operación devuelve `INV_SIN_MEMORIA`.'
    correctAnswer: true
    explanation: >-
      El resultado de `realloc` se guarda primero en un puntero auxiliar
      (`mas`). Solo si no es `NULL` se reemplaza el arreglo. Así ninguna
      operación deja el objeto roto.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Por qué conviene que una búsqueda devuelva un código de resultado y entregue el dato por un parámetro de salida, en lugar de devolver `-1` cuando no encuentra nada?'
    options:
      - id: 'a'
        text: 'Porque las funciones de C no pueden devolver números negativos.'
      - id: 'b'
        text: 'Porque así el llamador distingue por qué falló y no hace falta reservar un valor especial que podría ser un dato válido.'
      - id: 'c'
        text: 'Porque un parámetro de salida es más rápido que un valor de retorno.'
      - id: 'd'
        text: 'Porque `-1` no compila con `-Wpedantic`.'
    correctOptionId: 'b'
    explanation: >-
      Un stock o una nota podrían ser legítimamente cualquier número. El código
      de resultado (`INV_OK`, `INV_NO_ENCONTRADO`...) separa el éxito o la causa
      del error del dato, como hacen muchas funciones de la biblioteca estándar.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Un `struct Inventario` es dueño de su arreglo dinámico `productos`. ¿Cómo debe liberarlo `main`?'
    options:
      - id: 'a'
        text: 'Con `free(inv.productos)` y después con `free(&inv)`.'
      - id: 'b'
        text: 'Llamando a `inventario_liberar(&inv)`, que libera el arreglo y deja el inventario vacío.'
      - id: 'c'
        text: 'No hace falta liberarlo: el sistema lo libera al terminar `main`.'
      - id: 'd'
        text: 'Con `free` sobre cada producto del arreglo.'
    correctOptionId: 'b'
    explanation: >-
      El contenedor crea y libera sus partes; quien lo usa solo llama a sus
      operaciones. `free(&inv)` sería un error grave, porque `inv` vive en la
      pila y no vino de `malloc`.
---
