---
course: 'java'
lesson: '03-control-de-flujo-y-bucles'
slug: 'autoevaluacion-control-de-flujo'
title: 'Autoevaluación: Control de Flujo y Estructuras Repetitivas'
description: 'Diez preguntas sobre condicionales if/else, operador ternario, switch, bucles for, while, do-while, break y continue.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué salida genera este bucle for que utiliza la instrucción continue?'
    code: |-
      for (int i = 1; i <= 4; i++) {
          if (i == 2) {
              continue;
          }
          System.out.print(i + " ");
      }
    options:
      - id: 'a'
        text: '1 2 3 4'
      - id: 'b'
        text: '1 3 4 '
      - id: 'c'
        text: '1 '
      - id: 'd'
        text: '2 3 4 '
    correctOptionId: 'b'
    explanation: >-
      La instrucción `continue` salta inmediatamente el resto del cuerpo del bucle
      en la iteración actual y avanza a la siguiente (ejecutando el paso de
      incremento `i++`). Cuando `i == 2`, la sentencia `System.out.print` se omite,
      imprimiéndose únicamente `1 3 4 `.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'El bucle do-while garantiza que su cuerpo de instrucciones se ejecutará al menos una vez, incluso si la condición booleana es inicialmente falsa.'
    correctAnswer: true
    explanation: >-
      A diferencia de `while` y `for`, que evalúan la condición antes de ingresar
      al bloque (*pre-test*), `do-while` es un bucle de post-condición (*post-test*):
      ejecuta primero el bloque y recién al final evalúa la condición lógica para
      decidir si debe repetir.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué sucede si se omite la sentencia break en un bloque case de una estructura switch tradicional en Java?'
    options:
      - id: 'a'
        text: 'Se produce el fenómeno de fall-through y la ejecución continúa evaluando los casos siguientes.'
      - id: 'b'
        text: 'El compilador javac rechaza el archivo con error de sintaxis.'
      - id: 'c'
        text: 'La JVM lanza una excepción de ejecución y finaliza el programa.'
      - id: 'd'
        text: 'El switch termina automáticamente tras la primera coincidencia.'
    correctOptionId: 'a'
    explanation: >-
      En el `switch` clásico heredado de C, omitir `break` provoca una caída en
      cascada (*fall-through*): la JVM continúa ejecutando secuencialmente las
      instrucciones de los siguientes `case` (e incluso el `default`), sin importar
      si coinciden con el valor original, hasta hallar un `break` o cerrar el bloque.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'En un bucle while (condicion), la condición se comprueba por primera vez únicamente después de que el cuerpo completó su primera iteración.'
    correctAnswer: false
    explanation: >-
      El bucle `while` evalúa su condición **antes** de ejecutar cualquier instrucción
      de su cuerpo. Si la condición es `false` al inicio, el bloque del bucle
      no se ejecutará ninguna vez.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Cuál es el valor final de la variable `mensaje` tras evaluar este operador ternario anidado?'
    code: |-
      int puntaje = 65;
      String mensaje = (puntaje >= 70) ? "Aprobado" : (puntaje >= 60) ? "Recuperatorio" : "Reprobado";
    options:
      - id: 'a'
        text: 'Aprobado'
      - id: 'b'
        text: 'Recuperatorio'
      - id: 'c'
        text: 'Reprobado'
      - id: 'd'
        text: 'No compila por anidar operadores ternarios.'
    correctOptionId: 'b'
    explanation: >-
      La condición inicial `puntaje >= 70` (`65 >= 70`) es `false`, por lo que se
      evalúa la rama negativa: `(puntaje >= 60) ? "Recuperatorio" : "Reprobado"`.
      Como `65 >= 60` es `true`, el operador asigna `"Recuperatorio"`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Cuántas veces se ejecuta el cuerpo del siguiente bucle while?'
    code: |-
      int k = 10;
      while (k < 5) {
          k++;
      }
    options:
      - id: 'a'
        text: '0 veces'
      - id: 'b'
        text: '1 vez'
      - id: 'c'
        text: '5 veces'
      - id: 'd'
        text: 'Infinitas veces'
    correctOptionId: 'a'
    explanation: >-
      La condición evaluada es `10 < 5`, la cual es estrictamente falsa desde el
      primer momento. Como `while` valida la condición antes de entrar, el cuerpo
      no se ejecuta ni una sola vez.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Una instrucción break invocada dentro de un bucle anidado interrumpe todos los bucles exteriores que lo envuelven.'
    correctAnswer: false
    explanation: >-
      Un `break` sin etiqueta solo interrumpe el bucle más inmediato (más interno)
      en el cual se encuentra escrito. El bucle exterior continúa con su curso
      normal de iteraciones a menos que se utilicen etiquetas de salto (*labeled break*).
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué secuencia numérica imprime en la terminal este fragmento con break?'
    code: |-
      for (int i = 0; i < 5; i++) {
          if (i == 3) {
              break;
          }
          System.out.print(i);
      }
    options:
      - id: 'a'
        text: '012'
      - id: 'b'
        text: '0123'
      - id: 'c'
        text: '0124'
      - id: 'd'
        text: '34'
    correctOptionId: 'a'
    explanation: >-
      En las iteraciones con `i = 0`, `i = 1` e `i = 2` la condición `i == 3` es falsa
      y se imprime cada número. Cuando `i` alcanza el valor `3`, se ejecuta `break`,
      que cancela de forma inmediata el bucle sin llegar al `System.out.print`,
      obteniendo `012`.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Cuál es el rol de la sección default en una sentencia switch?'
    options:
      - id: 'a'
        text: 'Es obligatoria y debe ser siempre el primer caso evaluado.'
      - id: 'b'
        text: 'Se ejecuta cuando el valor de la variable evaluada no coincide con ninguno de los valores de los bloques case.'
      - id: 'c'
        text: 'Define el valor predeterminado que debe asignarse a la variable en caso de error.'
      - id: 'd'
        text: 'Reinicia el flujo del switch para volver a comparar desde el principio.'
    correctOptionId: 'b'
    explanation: >-
      La cláusula `default` actúa como camino residual o de escape: si ninguna de
      las constantes especificadas en los `case` coincide con el valor evaluado,
      el control se transfiere al bloque `default`. Aunque no es estrictamente
      obligatoria, es una buena práctica de ingeniería incluirla siempre para
      manejar casos imprevistos.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Una variable declarada en la cabecera de un bucle for, como en `for (int i = 0; ... )`, puede ser leída fuera del bucle una vez que este finaliza.'
    correctAnswer: false
    explanation: >-
      El ámbito (*scope*) de la variable de control `i` declarada en la cláusula
      de inicialización del `for` queda restringido estrictamente al encabezado y
      al cuerpo del propio bucle. Al terminar el ciclo, la variable deja de ser
      visible y cualquier intento de leerla fuera producirá un error de compilación.
---

Elegí una respuesta por pregunta y presioná **Calificar** para poner a prueba tu dominio sobre control de flujo y bucles en Java.
