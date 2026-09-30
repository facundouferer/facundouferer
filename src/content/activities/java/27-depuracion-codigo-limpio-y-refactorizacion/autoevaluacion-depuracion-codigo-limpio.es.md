---
course: 'java'
lesson: '27-depuracion-codigo-limpio-y-refactorizacion'
slug: 'autoevaluacion-depuracion-codigo-limpio'
title: 'Autoevaluación: Depuración Sistemática, Código Limpio y Refactorización'
description: 'Validá tus conocimientos sobre el ciclo metódico de depuración, uso de breakpoints en el depurador, reconocimiento de code smells y técnicas de refactorización segura.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es la definición formal de Refactorización en ingeniería de software?'
    options:
      - id: 'a'
        text: 'Reescribir todo el sistema desde cero en un nuevo lenguaje de programación.'
      - id: 'b'
        text: 'Modificar la estructura interna del código para mejorar su legibilidad y mantenibilidad sin alterar en absoluto su comportamiento externo observable.'
      - id: 'c'
        text: 'Agregar tres nuevas funcionalidades al mismo tiempo que se corrige un bug en producción.'
      - id: 'd'
        text: 'Comprimir los archivos de código fuente para que ocupen menos espacio en el disco.'
    correctOptionId: 'b'
    explanation: >-
      La refactorización es una disciplina de diseño: reorganiza clases y métodos para hacerlos más limpios y extensibles, pero garantizando que desde la perspectiva del usuario o de los tests, las entradas y salidas continúen produciendo idénticos resultados.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Un "Code Smell" (olor en el código) representa un error de compilación o un bug que detiene inmediatamente la ejecución del programa.'
    correctAnswer: false
    explanation: >-
      Falso. Un code smell no es un fallo que rompe el programa; es un síntoma de diseño deficiente (como métodos de 100 líneas o código duplicado) que aumenta la deuda técnica y hace que el mantenimiento futuro sea propenso a errores.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'En el bucle sistemático de depuración (Debugging), ¿cuál es el primer paso indispensable antes de proponer cualquier hipótesis o tocar el código?'
    options:
      - id: 'a'
        text: 'Reinstalar el sistema operativo del equipo.'
      - id: 'b'
        text: 'Reproducir el error de manera confiable con un caso mínimo y determinístico.'
      - id: 'c'
        text: 'Borrar los tests que estén fallando.'
      - id: 'd'
        text: 'Cambiar nombres de variables al azar.'
    correctOptionId: 'b'
    explanation: >-
      Si no se puede reproducir el fallo de forma predecible, es imposible saber qué lo causa y no se podrá verificar objetivamente si una corrección realmente solucionó el problema.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Al examinar una traza de pila (Stack Trace) que reporta una excepción en Java, ¿qué indica la primera línea de la traza?'
    options:
      - id: 'a'
        text: 'El nombre de usuario que ejecutó la máquina virtual.'
      - id: 'b'
        text: 'El tipo de excepción específico que ocurrió (por ejemplo, `NullPointerException`) junto con su mensaje descriptivo de error.'
      - id: 'c'
        text: 'La versión de la base de datos conectada.'
      - id: 'd'
        text: 'La cantidad total de memoria RAM disponible en el servidor.'
    correctOptionId: 'b'
    explanation: >-
      La cabecera de la traza de pila identifica exactamente el tipo de fallo (`java.lang.NullPointerException`, `IndexOutOfBoundsException`, etc.) y el mensaje explicativo emitido en el momento del lanzamiento.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Un "Breakpoint Condicional" en el depurador pausa la ejecución del hilo únicamente cuando se cumple una condición lógica booleana especificada por el desarrollador (por ejemplo, `i == 500`).'
    correctAnswer: true
    explanation: >-
      Verdadero. Esto evita tener que presionar "Continuar" cientos de veces manualmente dentro de un bucle extenso, deteniendo el programa únicamente en la iteración exacta donde se manifiesta la anomalía.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'En el control de ejecución paso a paso de un depurador, ¿cuál es la diferencia entre "Step Over" y "Step Into"?'
    options:
      - id: 'a'
        text: 'Step Over ejecuta la línea actual sin entrar al detalle interno de los métodos invocados; Step Into se adentra en el cuerpo del método invocado para examinar su código línea a línea.'
      - id: 'b'
        text: 'Step Over borra el método y Step Into lo duplica.'
      - id: 'c'
        text: 'Step Into solo funciona con librerías externas.'
      - id: 'd'
        text: 'No hay ninguna diferencia; son sinónimos.'
    correctOptionId: 'a'
    explanation: >-
      "Step Over" permite avanzar pasando por alto el interior de métodos que ya sabemos que funcionan; "Step Into" es necesario cuando sospechamos que el bug se encuentra dentro del método invocado en esa línea.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Reemplazar números literales arbitrarios (números mágicos como `0.21` o `3600`) por constantes descriptivas (`TASA_IVA`, `SEGUNDOS_POR_HORA`) es una práctica fundamental de Clean Code porque comunica la intención de negocio y centraliza los cambios.'
    correctAnswer: true
    explanation: >-
      Verdadero. Los números mágicos oscurecen la razón de ser del cálculo; una constante nombrada auto-documenta el código y permite actualizar el valor en un solo lugar si la regla cambia.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Por qué es una regla dorada tener una suite de pruebas automatizadas en verde antes de iniciar una sesión de refactorización?'
    options:
      - id: 'a'
        text: 'Porque los tests de regresión actúan como red de seguridad, alertando de inmediato si un cambio en la estructura interna alteró involuntariamente el comportamiento del programa.'
      - id: 'b'
        text: 'Porque el compilador de Java no permite editar archivos sin tests.'
      - id: 'c'
        text: 'Porque los tests hacen que el archivo .class ocupe menos espacio.'
      - id: 'd'
        text: 'Porque la refactorización solo se puede hacer sobre clases de prueba.'
    correctOptionId: 'a'
    explanation: >-
      Refactorizar sin tests automatizados es apostar a ciegas: no hay forma confiable de saber si una reestructuración interna rompió un caso de borde o una regla de negocio previa.
---
