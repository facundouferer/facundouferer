---
course: 'java'
lesson: '09-clases-abstractas-interfaces-y-modelado'
slug: 'autoevaluacion-abstractas-e-interfaces'
title: 'Autoevaluación: Clases Abstractas, Interfaces y Contratos de Software'
description: 'Evaluá tus conocimientos sobre diseño con clases abstractas, contratos de interfaces, métodos default y relaciones de modelado.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es la principal diferencia conceptual entre una clase abstracta y una interfaz en Java?'
    options:
      - id: 'a'
        text: 'Las interfaces se ejecutan más rápido porque no admiten métodos estáticos.'
      - id: 'b'
        text: 'Una clase abstracta representa un molde incompleto que puede compartir estado y código base; una interfaz es un contrato puro de capacidades que cualquier clase puede firmar.'
      - id: 'c'
        text: 'Las clases abstractas solo pueden tener métodos abstractos, mientras que las interfaces admiten atributos de instancia.'
      - id: 'd'
        text: 'No existe ninguna diferencia; son dos palabras clave sinónimas en Java.'
    correctOptionId: 'b'
    explanation: >-
      Una clase abstracta define una jerarquía conceptual de "es-un" con estado compartido (atributos de instancia) y código heredable. Una interfaz define un contrato de "sabe-hacer" enfocado en capacidades que clases no emparentadas pueden compartir.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Una clase abstracta puede tener métodos constructores, aunque no sea posible instanciarla directamente mediante el operador `new`.'
    correctAnswer: true
    explanation: >-
      Verdadero. Las clases abstractas pueden y suelen tener constructores (generalmente protected) para que las subclases inicialicen el estado común mediante `super(...)`. Lo que está prohibido es invocar `new ClaseAbstracta()`.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué modificadores se aplican implícitamente por defecto a cualquier variable declarada dentro de una interfaz en Java?'
    options:
      - id: 'a'
        text: 'private final'
      - id: 'b'
        text: 'protected static'
      - id: 'c'
        text: 'public static final'
      - id: 'd'
        text: 'package-private volatile'
    correctOptionId: 'c'
    explanation: >-
      En una interfaz, todas las variables son constantes: son implícitamente `public`, `static` y `final`. Las interfaces no pueden almacenar estado de instancia mutable.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'En Java, una misma clase concreta puede implementar múltiples interfaces separadas por comas mediante la palabra clave `implements`.'
    correctAnswer: true
    explanation: >-
      Verdadero. Aunque Java no admite herencia múltiple de clases (`extends`), sí permite implementar cualquier cantidad de interfaces, lo que permite componer múltiples capacidades en una sola clase.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué ocurre si una clase concreta hereda de una clase abstracta pero no implementa todos sus métodos abstractos declarados?'
    options:
      - id: 'a'
        text: 'Compila normalmente y la JVM crea implementaciones vacías automáticas en tiempo de ejecución.'
      - id: 'b'
        text: 'Falla en tiempo de compilación a menos que la propia subclase también sea declarada como abstract.'
      - id: 'c'
        text: 'El compilador lanza un aviso (warning) pero genera el archivo .class sin problemas.'
      - id: 'd'
        text: 'Los métodos no implementados se delegan automáticamente en java.lang.Object.'
    correctOptionId: 'b'
    explanation: >-
      Una clase concreta tiene la obligación contractual de implementar todos los métodos abstractos heredados. Si no lo hace, no puede ser instanciable y debe declararse también como `abstract`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Cuál es el propósito de los métodos `default` introducidos en las interfaces a partir de Java 8?'
    options:
      - id: 'a'
        text: 'Permitir que las interfaces declaren atributos de instancia mutables.'
      - id: 'b'
        text: 'Proveer una implementación base u opcional en la interfaz, permitiendo evolucionar contratos existentes sin romper las clases que ya los implementaban.'
      - id: 'c'
        text: 'Convertir la interfaz en una clase final que no puede ser extendida.'
      - id: 'd'
        text: 'Obligar a que todas las subclases sobrescriban el método sin excepción.'
    correctOptionId: 'b'
    explanation: >-
      Los métodos `default` permiten añadir nuevos métodos a interfaces ya publicadas con una implementación por defecto, evitando romper compatibilidad binaria con las clases clientes existentes.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Cómo se distingue la relación de Composición de la de Agregación en el modelado orientado a objetos?'
    options:
      - id: 'a'
        text: 'En la agregación el objeto hijo no puede existir sin el padre; en la composición sí.'
      - id: 'b'
        text: 'En la composición el ciclo de vida del objeto parte está estrictamente ligado al del objeto todo (si se destruye el todo, se destruye la parte); en la agregación los objetos tienen ciclos de vida independientes.'
      - id: 'c'
        text: 'La composición requiere el uso de extends y la agregación requiere implements.'
      - id: 'd'
        text: 'No hay distinción técnica; ambas relaciones se programan siempre con variables estáticas.'
    correctOptionId: 'b'
    explanation: >-
      La composición implica pertenencia fuerte y ciclo de vida dependiente (por ejemplo, una Casa y sus Habitaciones). La agregación es una relación débil donde las partes pueden existir independientemente (por ejemplo, un Departamento universitario y sus Profesores).
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Una interfaz en Java puede extender a otra interfaz utilizando la palabra clave `extends`.'
    correctAnswer: true
    explanation: >-
      Verdadero. Una interfaz puede heredar de una o más interfaces mediante `extends` (por ejemplo, `public interface SubInterfaz extends InterfazA, InterfazB`), acumulando sus contratos.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Desde el punto de vista de arquitectura y código limpio, ¿por qué es preferible programar contra interfaces en lugar de clases concretas?'
    options:
      - id: 'a'
        text: 'Porque las interfaces reducen automáticamente el uso de memoria en el Heap.'
      - id: 'b'
        text: 'Porque desacopla a los clientes de las implementaciones específicas, permitiendo intercambiar componentes y probarlos con facilidad sin modificar el código consumidor.'
      - id: 'c'
        text: 'Porque elimina la necesidad de escribir pruebas unitarias.'
      - id: 'd'
        text: 'Porque las interfaces garantizan que no ocurran excepciones en tiempo de ejecución.'
    correctOptionId: 'b'
    explanation: >-
      "Programar contra una interfaz y no contra una implementación" es uno de los principios capitales de la ingeniería de software: reduce el acoplamiento y permite reemplazar implementaciones sin afectar a las clases que consumen el contrato.
---
