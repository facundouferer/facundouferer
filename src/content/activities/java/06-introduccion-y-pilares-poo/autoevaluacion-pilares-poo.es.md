---
course: 'java'
lesson: '06-introduccion-y-pilares-poo'
slug: 'autoevaluacion-pilares-poo'
title: 'Autoevaluación: paradigma y pilares de POO'
description: 'Seis preguntas conceptuales sobre objetos, responsabilidades y los cuatro pilares.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
estimatedMinutes: 10
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué diferencia principal propone la POO frente a funciones que modifican datos compartidos?'
    options:
      - id: 'a'
        text: 'Agrupar información y acciones relacionadas bajo responsabilidades delimitadas.'
      - id: 'b'
        text: 'Eliminar toda función del programa.'
      - id: 'c'
        text: 'Compartir todos los datos entre todos los componentes.'
    correctOptionId: 'a'
    explanation: >-
      Un objeto reúne estado y comportamiento relacionado. Esto delimita
      responsabilidades y evita que cualquier función modifique datos sin control.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Abstraer significa representar absolutamente todos los detalles de una entidad real.'
    correctAnswer: false
    explanation: >-
      Abstraer significa seleccionar las características relevantes para el
      problema actual y dejar fuera los detalles que no aportan al modelo.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'En una cuenta bancaria, ¿qué decisión expresa encapsulamiento?'
    options:
      - id: 'a'
        text: 'Permitir que cualquier componente cambie el saldo libremente.'
      - id: 'b'
        text: 'Ofrecer una acción depositar que valide el monto antes de cambiar el saldo.'
      - id: 'c'
        text: 'Copiar el saldo en cada función del programa.'
    correctOptionId: 'b'
    explanation: >-
      Encapsular protege el estado y permite cambios solo mediante acciones
      controladas que pueden aplicar las reglas del dominio.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'Si Perro es una especialización de Animal, la relación «es un» ejemplifica herencia.'
    correctAnswer: true
    explanation: >-
      La herencia expresa una relación de especialización: Perro es un Animal
      y conserva las características comunes de esa categoría.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Cuál de estas situaciones representa polimorfismo?'
    options:
      - id: 'a'
        text: 'Dos animales responden a la acción hacerSonido de forma distinta.'
      - id: 'b'
        text: 'Dos funciones cambian la misma variable global.'
      - id: 'c'
        text: 'Una clase contiene únicamente información sin acciones.'
    correctOptionId: 'a'
    explanation: >-
      El polimorfismo permite pedir una misma acción a entidades relacionadas
      y obtener una respuesta diferente según cada tipo concreto.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Reducir el acoplamiento implica que cada objeto tenga responsabilidades claras y se comunique mediante acciones definidas.'
    correctAnswer: true
    explanation: >-
      Los límites claros reducen dependencias sobre detalles internos y hacen
      que un cambio local tenga menos efectos inesperados en otros componentes.
---

Elegí una respuesta por pregunta y presioná **Calificar** para revisar tu comprensión de los conceptos de esta lección.
