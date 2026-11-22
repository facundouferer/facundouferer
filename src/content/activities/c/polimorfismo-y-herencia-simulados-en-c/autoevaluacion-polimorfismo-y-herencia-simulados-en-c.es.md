---
course: 'c'
lesson: 'polimorfismo-y-herencia-simulados-en-c'
slug: 'autoevaluacion-polimorfismo-y-herencia-simulados-en-c'
title: 'Autoevaluación: Polimorfismo y herencia simulados en C'
description: 'Once preguntas sobre tablas de operaciones con punteros a función, despacho manual, la estructura base como primer campo, conversiones peligrosas, herencia simulada y cuándo preferir una unión con etiqueta.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué significa **polimorfismo** en el diseño de la lección?'
    options:
      - id: 'a'
        text: 'Que una función tiene varios nombres.'
      - id: 'b'
        text: 'Que una misma operación (por ejemplo, `figura_area`) tiene distinto comportamiento según el tipo real del objeto.'
      - id: 'c'
        text: 'Que C elige automáticamente el método correcto, como en Java.'
      - id: 'd'
        text: 'Que una `struct` puede tener campos de distintos tipos.'
    correctOptionId: 'b'
    explanation: >-
      El bucle que recorre figuras llama a `figura_area` sin saber si es un
      círculo o un rectángulo. C no lo hace solo: el despacho se construye a
      mano con una tabla de punteros a función.
  - kind: 'single-choice'
    id: 'q2'
    prompt: 'Dentro de `FiguraOps`, ¿qué declara el campo `double (*area)(const Figura *self);`?'
    options:
      - id: 'a'
        text: 'Una función llamada `area` que devuelve `double *`.'
      - id: 'b'
        text: 'Un puntero a una función que recibe un `const Figura *` y devuelve `double`.'
      - id: 'c'
        text: 'Un arreglo de `double`.'
      - id: 'd'
        text: 'Un método de la estructura `Figura`.'
    correctOptionId: 'b'
    explanation: >-
      Los paréntesis en `(*area)` indican que `area` es un puntero. La tabla
      guarda, para cada tipo, la dirección de la función que calcula su área.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'Estas dos declaraciones de `area` declaran lo mismo.'
    code: |-
      double *area(const Figura *self);
      double (*area)(const Figura *self);
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      Sin los paréntesis, el `*` se une al tipo de retorno: se declara una
      función `area` que devuelve `double *`, no un puntero a función.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct Figura Figura;

      typedef struct {
          const char *nombre;
          double (*area)(const Figura *self);
      } FiguraOps;

      struct Figura {
          const FiguraOps *ops;
      };

      typedef struct {
          Figura base;
          double lado;
      } Cuadrado;

      typedef struct {
          Figura base;
          double ancho;
          double alto;
      } Rectangulo;

      static double cuadrado_area(const Figura *self) {
          const Cuadrado *q = (const Cuadrado *)self;
          return q->lado * q->lado;
      }

      static double rectangulo_area(const Figura *self) {
          const Rectangulo *r = (const Rectangulo *)self;
          return r->ancho * r->alto;
      }

      static const FiguraOps CUADRADO_OPS = {"cuadrado", cuadrado_area};
      static const FiguraOps RECTANGULO_OPS = {"rectangulo", rectangulo_area};

      int main(void) {
          Cuadrado q = {{&CUADRADO_OPS}, 3.0};
          Rectangulo r = {{&RECTANGULO_OPS}, 2.0, 5.0};
          Figura *figuras[] = {&r.base, &q.base, &r.base};
          double total = 0.0;

          for (size_t i = 0; i < 3; i++) {
              total += figuras[i]->ops->area(figuras[i]);
          }
          printf("%s %.1f\n", figuras[1]->ops->nombre, total);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`cuadrado 29.0`'
      - id: 'b'
        text: '`rectangulo 19.0`'
      - id: 'c'
        text: '`cuadrado 19.0`'
      - id: 'd'
        text: '`rectangulo 29.0`'
    correctOptionId: 'a'
    explanation: >-
      El arreglo tiene el rectángulo dos veces y el cuadrado una: 10 + 9 + 10 =
      29. `figuras[1]` es el cuadrado, así que su tabla da el nombre
      `cuadrado`. Cada llamada se despacha por la tabla guardada en el objeto.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'La conversión entre un `Circulo *` y un `Figura *` es válida porque `Figura base;` es el primer campo de `Circulo` y una estructura no tiene relleno antes de su primer campo.'
    correctAnswer: true
    explanation: >-
      El estándar garantiza que la dirección de una estructura coincide con la
      de su primer campo. Esa garantía es todo lo que sostiene la técnica; si la
      base no es el primer campo, la conversión deja de ser válida.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Este tipo compila sin advertencias, pero `figura_area` devuelve valores absurdos para él. ¿Cuál es el error?'
    code: |-
      typedef struct {
          double lado;
          Figura base;
      } Cuadrado;

      static double cuadrado_area(const Figura *self) {
          const Cuadrado *q = (const Cuadrado *)self;
          return q->lado * q->lado;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta `static` en la definición del tipo.'
      - id: 'b'
        text: '`base` no es el primer campo: la dirección de `base` no coincide con la del `Cuadrado` y la conversión lee `lado` en la memoria equivocada.'
      - id: 'c'
        text: '`lado` debería ser `int`.'
      - id: 'd'
        text: 'Las funciones de la tabla no pueden ser `static`.'
    correctOptionId: 'b'
    explanation: >-
      `self` apunta al campo `base`, que está después de `lado`. Convertirlo a
      `const Cuadrado *` produce un puntero desplazado: comportamiento
      indefinido. Además, `free(self)` recibiría una dirección que no vino de
      `malloc`. La corrección es poner `Figura base;` como primer campo.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Por qué en la lección hay una sola tabla `static const FiguraOps` por tipo, y cada objeto guarda solo un puntero a ella?'
    options:
      - id: 'a'
        text: 'Porque C no permite más de una variable `const` por archivo.'
      - id: 'b'
        text: 'Porque todos los objetos de un tipo comparten las mismas operaciones: copiar la tabla en cada objeto gastaría memoria sin beneficio.'
      - id: 'c'
        text: 'Porque los punteros a función no se pueden guardar dentro de una `struct`.'
      - id: 'd'
        text: 'Porque `static` hace que la tabla sea polimórfica.'
    correctOptionId: 'b'
    explanation: >-
      Las operaciones dependen del tipo, no del objeto. Una tabla compartida y
      constante ocupa memoria una sola vez y no se puede modificar por error.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Si `f` se creó con `rectangulo_crear`, el compilador rechaza la conversión `(const Circulo *)f`.'
    correctAnswer: false
    explanation: >-
      El compilador acepta cualquier conversión explícita entre punteros a
      estructuras y no sabe qué tipo de objeto hay detrás de `f`. Usar `c->radio`
      después es comportamiento indefinido: no hay seguridad de tipos.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      struct Persona {
          char nombre[30];
          int edad;
      };

      struct Alumno {
          struct Persona persona;
          int legajo;
      };

      void persona_cumplir_anios(struct Persona *p) {
          p->edad++;
      }

      void persona_mostrar(const struct Persona *p) {
          printf("%s (%d)\n", p->nombre, p->edad);
      }

      int main(void) {
          struct Alumno a = {{"Sofia", 19}, 4512};
          persona_cumplir_anios(&a.persona);
          persona_cumplir_anios((struct Persona *)&a);
          persona_mostrar(&a.persona);
          printf("Legajo: %d\n", a.legajo);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Sofia (20)` y `Legajo: 4512`'
      - id: 'b'
        text: '`Sofia (21)` y `Legajo: 4512`'
      - id: 'c'
        text: '`Sofia (21)` y `Legajo: 4513`'
      - id: 'd'
        text: 'No compila: un `Alumno` no es una `Persona`.'
    correctOptionId: 'b'
    explanation: >-
      Las dos llamadas modifican la misma persona: `&a.persona` es la forma
      segura y la conversión `(struct Persona *)&a` funciona porque `persona` es
      el primer campo, aunque el compilador no la verifica. La edad sube dos
      veces y el legajo no cambia.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Un programa maneja solo círculos y rectángulos, y nadie va a agregar tipos nuevos. ¿Qué diseño recomienda la lección?'
    options:
      - id: 'a'
        text: 'Una tabla de operaciones con punteros a función y una base como primer campo.'
      - id: 'b'
        text: 'Una unión con etiqueta (`enum` + `union`) y un `switch`: sin memoria dinámica ni conversiones.'
      - id: 'c'
        text: 'Tres niveles de estructuras base incrustadas.'
      - id: 'd'
        text: 'Variables globales para cada figura.'
    correctOptionId: 'b'
    explanation: >-
      Con un conjunto cerrado de tipos, la unión con etiqueta es más simple y
      rápida, y con `-Wall` el compilador avisa si un `switch` sobre el `enum`
      olvida un caso. La tabla de operaciones conviene cuando otros módulos
      agregan tipos sin tocar tu código.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Por qué la destrucción también se despacha por la tabla (`f->ops->destruir(f)`)?'
    options:
      - id: 'a'
        text: 'Porque `free` no acepta punteros a `Figura`.'
      - id: 'b'
        text: 'Porque solo el tipo concreto sabe qué contiene y qué debe liberar.'
      - id: 'c'
        text: 'Porque así el objeto se libera dos veces y es más seguro.'
      - id: 'd'
        text: 'Porque las funciones de despacho no pueden recibir `NULL`.'
    correctOptionId: 'b'
    explanation: >-
      Un tipo concreto podría tener partes dinámicas propias (por ejemplo, un
      nombre copiado). Quien recorre la interfaz `Figura` no las conoce; la
      función `destruir` de cada tipo libera todo en el orden correcto.
---
