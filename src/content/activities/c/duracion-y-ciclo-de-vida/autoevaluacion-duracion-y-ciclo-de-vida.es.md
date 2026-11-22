---
course: 'c'
lesson: 'duracion-y-ciclo-de-vida'
slug: 'autoevaluacion-duracion-y-ciclo-de-vida'
title: 'Autoevaluación: Duración de almacenamiento y ciclo de vida'
description: 'Doce preguntas sobre duración automática y estática, tiempo de vida de los objetos, la pila y el montículo como modelos, punteros colgantes y alternativas correctas para devolver resultados.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué duración de almacenamiento tiene una variable local declarada sin `static` dentro de una función?'
    options:
      - id: 'a'
        text: 'Estática: existe durante todo el programa.'
      - id: 'b'
        text: 'Automática: su tiempo de vida termina en la llave de cierre de su bloque.'
      - id: 'c'
        text: 'Asignada: vive hasta que el programa decida destruirla.'
      - id: 'd'
        text: 'De hilo: vive mientras viva el hilo que la creó.'
    correctOptionId: 'b'
    explanation: >-
      Las variables locales y los parámetros tienen duración automática:
      empiezan a existir al entrar en su bloque y dejan de existir al salir de
      él. Cada llamada a la función crea objetos nuevos.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>

      int contar(void) {
          static int n = 0;
          n += 2;
          return n;
      }

      int main(void) {
          int a = contar();
          int b = contar();
          int c = contar();
          printf("%d %d %d\n", a, b, c);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`2 2 2`'
      - id: 'b'
        text: '`2 4 6`'
      - id: 'c'
        text: '`0 2 4`'
      - id: 'd'
        text: '`6 6 6`'
    correctOptionId: 'b'
    explanation: >-
      `n` es una local `static`: se inicializa una sola vez, antes de que
      empiece `main`, y conserva su valor entre llamadas. Cada llamada le suma
      2 y devuelve el valor actual.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>

      int siguiente(void) {
          int n = 0;
          n++;
          return n;
      }

      int main(void) {
          int a = siguiente();
          int b = siguiente();
          printf("%d %d\n", a, b);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1 2`'
      - id: 'b'
        text: '`0 1`'
      - id: 'c'
        text: '`1 1`'
      - id: 'd'
        text: 'Un valor impredecible, porque `n` muere al salir.'
    correctOptionId: 'c'
    explanation: >-
      Sin `static`, `n` tiene duración automática: cada llamada crea un `n`
      nuevo que empieza en 0. La función devuelve el **valor** de `n` (se
      copia), así que no importa que el objeto muera después.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'Una variable global sin inicializador empieza valiendo 0.'
    correctAnswer: true
    explanation: >-
      Los objetos con duración estática (globales y locales `static`) que no
      tienen un valor inicial se inicializan en cero. Las variables locales
      automáticas, en cambio, empiezan con un valor indeterminado.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Esta función tiene un error grave. ¿Cuál es y cómo se corrige?'
    code: |-
      int *doble(int x) {
          int resultado = 2 * x;
          return &resultado;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta inicializar `resultado` en 0; se corrige con `int resultado = 0;`.'
      - id: 'b'
        text: 'Devuelve la dirección de una variable automática que muere al terminar la función (puntero colgante). Se corrige devolviendo el valor: `int doble(int x) { return 2 * x; }`.'
      - id: 'c'
        text: 'No se puede multiplicar un parámetro; hay que copiarlo antes.'
      - id: 'd'
        text: 'No hay error si quien llama usa el puntero enseguida.'
    correctOptionId: 'b'
    explanation: >-
      `resultado` vive en el marco de `doble` y su tiempo de vida termina en la
      llave de cierre. El puntero devuelto queda colgante: usarlo es
      comportamiento indefinido, aunque lo uses en la línea siguiente. El
      compilador incluso avisa con las opciones del curso.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Un programa usa un puntero colgante y, al probarlo, imprime el valor esperado. ¿Qué conclusión es correcta?'
    options:
      - id: 'a'
        text: 'El programa es correcto, porque la prueba lo demuestra.'
      - id: 'b'
        text: 'Sigue siendo comportamiento indefinido: hoy la memoria todavía conserva el valor, pero con otro compilador, otras opciones o una llamada más puede fallar.'
      - id: 'c'
        text: 'El estándar garantiza que la memoria conserva el valor hasta la próxima llamada a una función.'
      - id: 'd'
        text: 'Basta con compilar sin `-Wall` para que el problema desaparezca.'
    correctOptionId: 'b'
    explanation: >-
      El comportamiento indefinido no significa "falla siempre": significa que
      el estándar no promete nada. Que funcione en una prueba no lo vuelve
      correcto.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'El estándar de C exige que las variables automáticas se guarden en una pila y las de duración asignada en un montículo.'
    correctAnswer: false
    explanation: >-
      El estándar habla de duraciones de almacenamiento y tiempos de vida. La
      pila y el montículo son la forma en que casi todas las implementaciones
      los resuelven y son modelos útiles para razonar, pero no son requisitos
      del lenguaje.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>

      const char *etiqueta(int numero) {
          static char texto[16];
          snprintf(texto, sizeof texto, "Caja %d", numero);
          return texto;
      }

      int main(void) {
          const char *a = etiqueta(1);
          const char *b = etiqueta(2);
          printf("%s / %s\n", a, b);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Caja 1 / Caja 2`'
      - id: 'b'
        text: '`Caja 2 / Caja 2`'
      - id: 'c'
        text: '`Caja 1 / Caja 1`'
      - id: 'd'
        text: 'Comportamiento indefinido: `texto` muere al salir de la función.'
    correctOptionId: 'b'
    explanation: >-
      `texto` es `static`, así que devolver su dirección es válido: no queda
      colgante. Pero hay un solo arreglo compartido: la segunda llamada pisa
      el contenido y `a` y `b` apuntan al mismo lugar.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Qué ocurre en este fragmento?'
    code: |-
      int *p = NULL;
      {
          int x = 5;
          p = &x;
      }
      printf("%d\n", *p);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Imprime `5` siempre, porque `x` sigue en la misma función.'
      - id: 'b'
        text: 'Imprime `0`, porque `x` se reinicia al salir del bloque.'
      - id: 'c'
        text: 'Es comportamiento indefinido: el tiempo de vida de `x` terminó en la llave de cierre del bloque y `p` quedó colgante.'
      - id: 'd'
        text: 'No compila: no se puede asignar la dirección de `x` a `p`.'
    correctOptionId: 'c'
    explanation: >-
      El tiempo de vida de una variable automática termina al salir de su
      bloque, no de la función. Después de la llave, `p` guarda una dirección
      que ya no corresponde a ningún objeto vivo.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Dentro de una función con un parámetro `n`, la declaración `static int total = n;` es válida.'
    correctAnswer: false
    explanation: >-
      Un objeto con duración estática se inicializa una sola vez, antes de que
      empiece `main`, así que su inicializador debe ser una expresión
      constante. `n` solo existe durante cada llamada.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Necesitas una función que arme un texto para quien la llama, sin puntero colgante y sin un búfer compartido entre llamadas. ¿Qué firma sigue el patrón del búfer provisto por el llamador?'
    options:
      - id: 'a'
        text: '`char *armar(int valor);`, que devuelve la dirección de un arreglo local.'
      - id: 'b'
        text: '`bool armar(char *destino, size_t capacidad, int valor);`, que escribe en el arreglo de quien llama sin pasar de la capacidad.'
      - id: 'c'
        text: '`void armar(char destino, int valor);`'
      - id: 'd'
        text: '`const char *armar(int valor);`, que usa un arreglo `static`.'
    correctOptionId: 'b'
    explanation: >-
      Con este patrón quien llama decide dónde vive el resultado y cuánto
      mide, y la función informa si el texto entró. Es lo que hacen
      `snprintf` y `fgets`. La opción con `static` funciona, pero comparte un
      único arreglo.
  - kind: 'single-choice'
    id: 'q12'
    prompt: '¿Qué duración de almacenamiento tienen los parámetros de una función?'
    options:
      - id: 'a'
        text: 'Automática, como las variables locales.'
      - id: 'b'
        text: 'Estática, porque se declaran en la firma de la función.'
      - id: 'c'
        text: 'La misma que el argumento con el que se llamó a la función.'
      - id: 'd'
        text: 'No tienen duración: no son objetos.'
    correctOptionId: 'a'
    explanation: >-
      Los parámetros son objetos locales de la función: se crean en cada
      llamada con una copia de los argumentos y dejan de existir cuando la
      función termina.
---
