---
course: 'c'
lesson: 'introduccion-a-poo-en-c'
slug: 'autoevaluacion-introduccion-a-poo-en-c'
title: 'Autoevaluación: Diseño de software en C: ideas de la POO'
description: 'Once preguntas sobre por qué C es un lenguaje procedural, la abstracción como diseño alrededor de operaciones, qué ideas de la POO puede expresar C y cuáles no, y cuándo conviene este estilo.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál de estas afirmaciones describe correctamente a C?'
    options:
      - id: 'a'
        text: 'C es un lenguaje orientado a objetos, igual que Java, pero con otra sintaxis.'
      - id: 'b'
        text: 'C es un lenguaje procedural; algunas ideas de la POO se pueden aplicar con técnicas de diseño manuales.'
      - id: 'c'
        text: 'C tiene clases, pero no herencia.'
      - id: 'd'
        text: 'C no permite agrupar datos y funciones de ninguna manera.'
    correctOptionId: 'b'
    explanation: >-
      C no tiene clases, herencia, métodos ni control de acceso como mecanismos
      del lenguaje. Con `struct`, funciones, punteros y módulos `.h`/`.c` se
      construyen técnicas inspiradas en la POO, con trabajo manual y sin ayuda
      del compilador.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'En C, si una `struct Alumno` contiene una `struct Persona` como campo, el compilador sabe que un alumno "es" una persona.'
    correctAnswer: false
    explanation: >-
      Poner una `struct` dentro de otra es composición: el alumno **tiene** una
      persona. C no tiene tipos derivados; la relación "es un" sería solo una
      convención del programador.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdbool.h>
      #include <stdio.h>

      struct Cuenta {
          long long saldo_centavos;
      };

      bool cuenta_extraer(struct Cuenta *cuenta, long long monto) {
          if (monto <= 0 || monto > cuenta->saldo_centavos) {
              return false;
          }
          cuenta->saldo_centavos -= monto;
          return true;
      }

      int main(void) {
          struct Cuenta cuenta = {5000};
          int rechazos = 0;

          long long montos[] = {2000, 4000, -100, 3000};
          for (int i = 0; i < 4; i++) {
              if (!cuenta_extraer(&cuenta, montos[i])) {
                  rechazos++;
              }
          }
          printf("%lld %d\n", cuenta.saldo_centavos, rechazos);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`-4100 0`'
      - id: 'b'
        text: '`0 2`'
      - id: 'c'
        text: '`3000 1`'
      - id: 'd'
        text: '`1000 2`'
    correctOptionId: 'b'
    explanation: >-
      2000 se extrae (queda 3000); 4000 supera el saldo y se rechaza; -100 no es
      un monto válido y se rechaza; 3000 se extrae y deja el saldo en 0. Las
      reglas viven dentro de `cuenta_extraer`, así que el saldo nunca queda
      negativo.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'En el diseño de un tipo, ¿qué significa **abstracción**?'
    options:
      - id: 'a'
        text: 'Diseñar el tipo a partir de las operaciones que ofrece, y tratar los campos como un detalle de implementación.'
      - id: 'b'
        text: 'Declarar todos los campos de la `struct` antes de pensar en las funciones.'
      - id: 'c'
        text: 'Usar solo variables globales para que todas las funciones vean los datos.'
      - id: 'd'
        text: 'Escribir el programa entero dentro de `main` para que sea más fácil de leer.'
    correctOptionId: 'a'
    explanation: >-
      Abstraer es mostrar lo importante y ocultar lo innecesario: primero se
      define qué necesita hacer quien usa el tipo (su interfaz). Los campos
      podrían cambiar sin que cambie el código que usa esas operaciones, como
      pasa con `FILE *` y `fopen`, `fprintf` y `fclose`.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Este programa compila sin errores y muestra `Saldo: -500`, porque C no tiene control de acceso sobre los campos de una `struct` visible.'
    code: |-
      #include <stdio.h>

      struct Cuenta {
          long long saldo_centavos;
      };

      int main(void) {
          struct Cuenta cuenta = {100};
          cuenta.saldo_centavos = -500;
          printf("Saldo: %lld\n", cuenta.saldo_centavos);
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: true
    explanation: >-
      Si la definición de la `struct` está visible, cualquier código puede
      escribir sus campos y saltarse las reglas de las operaciones. No existe
      `private`. La lección siguiente resuelve esto con un tipo opaco.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdbool.h>
      #include <stdio.h>

      struct Termostato {
          int objetivo;
      };

      bool termostato_bajar(struct Termostato *t) {
          if (t->objetivo <= 10) {
              return false;
          }
          t->objetivo--;
          return true;
      }

      int main(void) {
          struct Termostato t = {13};
          int bajadas = 0;
          while (termostato_bajar(&t)) {
              bajadas++;
          }
          printf("%d %d\n", t.objetivo, bajadas);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`10 3`'
      - id: 'b'
        text: '`9 4`'
      - id: 'c'
        text: '`10 4`'
      - id: 'd'
        text: 'El ciclo no termina.'
    correctOptionId: 'a'
    explanation: >-
      El objetivo baja de 13 a 12, 11 y 10: tres bajadas aceptadas. Con 10, la
      operación devuelve `false` sin modificar nada y el ciclo termina. La regla
      "nunca por debajo de 10" la protege la propia operación.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Cuál de estas ideas de la POO **sí** puede expresar C directamente con sus herramientas?'
    options:
      - id: 'a'
        text: 'Campos `private` que el compilador protege.'
      - id: 'b'
        text: 'Métodos virtuales que se eligen solos según el tipo real del objeto.'
      - id: 'c'
        text: 'Estado y comportamiento: una `struct` más funciones que reciben un puntero a ella.'
      - id: 'd'
        text: 'Clases declaradas con la palabra clave `class`.'
    correctOptionId: 'c'
    explanation: >-
      La `struct` guarda el estado y un grupo de funciones con un prefijo común
      forma el comportamiento. El control de acceso, el despacho virtual y las
      clases no existen de forma nativa; algunos se simulan a mano.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Cuando se organiza un programa alrededor de entidades, dentro de cada operación sigue habiendo secuencia, decisiones y ciclos.'
    correctAnswer: true
    explanation: >-
      La POO no reemplaza a la programación estructurada: cambia cómo se agrupa
      el programa. El cuerpo de `cuenta_extraer`, por ejemplo, sigue siendo una
      decisión con `if`.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'Este programa muestra `Saldo: 100` en lugar de `Saldo: 150`. ¿Cuál es el error?'
    code: |-
      #include <stdio.h>

      struct Cuenta {
          long long saldo_centavos;
      };

      void cuenta_depositar(struct Cuenta cuenta, long long monto) {
          cuenta.saldo_centavos += monto;
      }

      int main(void) {
          struct Cuenta cuenta = {100};
          cuenta_depositar(cuenta, 50);
          printf("Saldo: %lld\n", cuenta.saldo_centavos);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`%lld` no sirve para `long long`.'
      - id: 'b'
        text: 'La función recibe una copia de la cuenta; debe recibir `struct Cuenta *` y llamarse con `&cuenta`.'
      - id: 'c'
        text: 'Falta `return` en `cuenta_depositar`.'
      - id: 'd'
        text: 'Las `struct` no se pueden pasar a funciones.'
    correctOptionId: 'b'
    explanation: >-
      C pasa los argumentos por valor: la función modifica su copia y la copia
      desaparece al terminar. Con un puntero como primer parámetro (que también
      se copia), la función llega a la cuenta original a través de la dirección.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Para un programa de 40 líneas que promedia cinco notas, siempre conviene diseñar un tipo con interfaz propia, funciones de creación y destrucción.'
    correctAnswer: false
    explanation: >-
      Estas técnicas cuestan código, memoria dinámica e indirección. Valen la
      pena cuando un tipo tiene reglas que proteger o lo usan varias partes del
      programa. En un programa corto sin invariantes, el código directo es más
      claro.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Qué indica el `const` en `long long cuenta_saldo(const struct Cuenta *cuenta);`?'
    options:
      - id: 'a'
        text: 'Que el saldo de la cuenta nunca puede cambiar en todo el programa.'
      - id: 'b'
        text: 'Que la función promete no modificar la cuenta a través de ese puntero.'
      - id: 'c'
        text: 'Que la función devuelve una constante.'
      - id: 'd'
        text: 'Que la cuenta se copia antes de entrar a la función.'
    correctOptionId: 'b'
    explanation: >-
      `const struct Cuenta *` es un puntero a una cuenta que la función no
      modifica. Documenta que `cuenta_saldo` es una consulta y el compilador
      rechaza cualquier asignación a sus campos dentro de ella.
---
