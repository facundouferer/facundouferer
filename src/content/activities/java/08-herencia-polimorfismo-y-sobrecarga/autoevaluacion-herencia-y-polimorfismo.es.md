---
course: 'java'
lesson: '08-herencia-polimorfismo-y-sobrecarga'
slug: 'autoevaluacion-herencia-y-polimorfismo'
title: 'Autoevaluación: Herencia, Polimorfismo y Sobrescritura de Métodos'
description: 'Validá tus conocimientos sobre la relación es-un, uso de super, la anotación @Override, despacho dinámico y polimorfismo.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'En Java, ¿cuántas clases directas puede extender una clase mediante la palabra clave `extends`?'
    options:
      - id: 'a'
        text: 'Cualquier cantidad, separadas por coma.'
      - id: 'b'
        text: 'Exactamente una sola clase directa (herencia simple de clases).'
      - id: 'c'
        text: 'Hasta dos clases, una concreta y una abstracta.'
      - id: 'd'
        text: 'Depende de si las clases se encuentran en el mismo paquete o no.'
    correctOptionId: 'b'
    explanation: >-
      Java implementa herencia simple de implementación para clases: una clase solo puede extender directamente a una única superclase, evitando problemas de ambigüedad como el problema del diamante.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'La llamada al constructor de la superclase mediante `super(...)` dentro del constructor de una subclase debe ser obligatoriamente la primera instrucción ejecutable.'
    code: |
      public Auto(String marca, int puertas) {
          this.puertas = puertas;
          super(marca); // ¿Es válido aquí?
      }
    correctAnswer: false
    explanation: >-
      Falso. En Java, la llamada a `super(...)` (o a otro constructor con `this(...)`) debe ser estrictamente la primera sentencia del constructor. Si se coloca después de cualquier otra instrucción, el compilador genera un error.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué visibilidad otorga el modificador de acceso `protected` a un atributo o método en Java?'
    options:
      - id: 'a'
        text: 'Solo es accesible dentro de la misma clase donde fue declarado.'
      - id: 'b'
        text: 'Es accesible desde cualquier clase de cualquier paquete sin restricciones.'
      - id: 'c'
        text: 'Es accesible por cualquier clase dentro del mismo paquete y por cualquier subclase, incluso si está en un paquete diferente.'
      - id: 'd'
        text: 'Solo es accesible por clases que implementen una interfaz compartida.'
    correctOptionId: 'c'
    explanation: >-
      El nivel `protected` combina acceso a nivel de paquete (package-private) con acceso a través de la línea de herencia para subclases ubicadas en paquetes externos.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'La anotación `@Override` es opcional para que el polimorfismo funcione, pero es una buena práctica crítica porque hace que el compilador verifique que realmente estemos sobrescribiendo un método de la superclase.'
    correctAnswer: true
    explanation: >-
      Verdadero. Si cometemos un error en el nombre o en los tipos de parámetros sin usar `@Override`, el compilador tratará el método como uno nuevo sobrecargado, y la sobrescritura fallará silenciosamente.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Si tenemos la referencia `Vehiculo v = new Camion();`, y la clase `Camion` declara un método propio `descargarCarga()` que no existe en `Vehiculo`, ¿qué ocurre al escribir `v.descargarCarga();`?'
    options:
      - id: 'a'
        text: 'Se ejecuta normalmente porque el objeto en el Heap es un Camion.'
      - id: 'b'
        text: 'Falla en tiempo de compilación, porque el compilador solo conoce los métodos declarados en el tipo estático de la referencia (Vehiculo).'
      - id: 'c'
        text: 'El programa lanza un NullPointerException en tiempo de ejecución.'
      - id: 'd'
        text: 'La JVM añade automáticamente el método a la clase Vehiculo.'
    correctOptionId: 'b'
    explanation: >-
      El compilador valida los métodos contra el tipo estático de la variable (`Vehiculo`). Para invocar `descargarCarga()`, es necesario verificar el tipo con `instanceof` y realizar un casteo explícito a `Camion`.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Un método declarado con el modificador `final` en una superclase puede ser sobrescrito por cualquier subclase siempre que se agregue `@Override`.'
    correctAnswer: false
    explanation: >-
      Falso. El modificador `final` en un método prohíbe explícitamente su sobrescritura en cualquier subclase, garantizando que el comportamiento definido por la superclase permanezca inmutable.

---
