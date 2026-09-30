---
course: 'java'
lesson: '20-testing-junit-y-spring-boot'
slug: 'autoevaluacion-testing-junit-spring-boot'
title: 'Autoevaluación: Testing Unitario con JUnit 5 y Fundamentos de Spring Boot'
description: 'Evaluá tus conocimientos sobre la pirámide de pruebas, el patrón AAA, TDD, diseño desacoplado de microservicios e inyección de dependencias en Spring Boot.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Por qué la Pirámide de Pruebas recomienda que la gran mayoría de los tests sean unitarios y no de integración o de extremo a extremo (E2E)?'
    options:
      - id: 'a'
        text: 'Porque los tests de integración están prohibidos por el compilador de Java.'
      - id: 'b'
        text: 'Porque los tests unitarios se ejecutan en milisegundos, son determinísticos y aíslan la causa exacta del error; los tests E2E son lentos, costosos de mantener y frágiles ante cambios menores.'
      - id: 'c'
        text: 'Porque los tests unitarios solo se escriben después de desplegar a producción.'
      - id: 'd'
        text: 'Porque JUnit solo permite probar métodos de menos de 10 líneas.'
    correctOptionId: 'b'
    explanation: >-
      Invertir la pirámide (cono de helado) genera suites que tardan decenas de minutos en ejecutarse y fallan por problemas ajenos a la lógica de negocio (como caídas de red o base de datos), desincentivando que los desarrolladores corran pruebas localmente.
  - kind: 'single-choice'
    id: 'q2'
    prompt: 'En el patrón AAA (Arrange-Act-Assert) para pruebas unitarias, ¿qué debe contener la fase "Act"?'
    options:
      - id: 'a'
        text: 'La creación de la base de datos y la inserción de 50 registros.'
      - id: 'b'
        text: 'Exactamente una única acción: la invocación del método o comportamiento específico que se somete a prueba.'
      - id: 'c'
        text: 'La verificación de todas las aserciones finales del test.'
      - id: 'd'
        text: 'El cierre de los sockets de red.'
    correctOptionId: 'b'
    explanation: >-
      La fase ACT debe invocar exclusivamente la operación concreta bajo prueba. Si un test contiene múltiples bloques ACT, en realidad está probando múltiples escenarios y debe dividirse en tests independientes.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'En el ciclo de Desarrollo Guiado por Pruebas (TDD), el orden correcto de las fases es: Rojo (escribir prueba que falla), Verde (código mínimo para pasar), Refactorización (mejorar diseño sin romper la prueba).'
    correctAnswer: true
    explanation: >-
      Verdadero. El ciclo Red-Green-Refactor asegura que las pruebas realmente validen el comportamiento previsto y guía la arquitectura del software de forma modular y verificable.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'En JUnit 5, ¿cuál es la forma idiomática y moderna de verificar que un método lanza una excepción esperada?'
    options:
      - id: 'a'
        text: 'Capturarla con un bloque try-catch manual y llamar a fail() si no se lanza.'
      - id: 'b'
        text: 'Utilizar el método `assertThrows(TipoExcepcion.class, () -> llamadaMetodo())`.'
      - id: 'c'
        text: 'Agregar el parámetro `@Test(expected = TipoExcepcion.class)` como se hacía en JUnit 4.'
      - id: 'd'
        text: 'Declarar la excepción en la cláusula `throws` de la clase de test.'
    correctOptionId: 'b'
    explanation: >-
      `assertThrows` ejecuta la expresión lambda provista, captura la excepción esperada y retorna la instancia para que podamos realizar aserciones adicionales sobre su mensaje o estado interno.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'El método anotado con `@BeforeEach` en una clase de test de JUnit 5 se ejecuta una única vez antes de toda la suite de pruebas.'
    correctAnswer: false
    explanation: >-
      Falso. `@BeforeEach` se ejecuta antes de cada método de test individual, garantizando el aislamiento (*fresh fixture*) para que ningún test contamine el estado del siguiente. Para ejecutarse una sola vez al inicio de la clase se utiliza `@BeforeAll`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'En la arquitectura de tres capas de Spring Boot, ¿cuál es la responsabilidad única del `@RestController`?'
    options:
      - id: 'a'
        text: 'Ejecutar consultas SQL directas contra el motor relacional.'
      - id: 'b'
        text: 'Traducir el protocolo HTTP (rutas, parámetros, deserialización de JSON, códigos de estado) hacia llamadas de servicios de negocio y viceversa.'
      - id: 'c'
        text: 'Calcular los algoritmos complejos de la empresa.'
      - id: 'd'
        text: 'Crear los índices y restricciones de las tablas.'
    correctOptionId: 'b'
    explanation: >-
      El controlador es un adaptador de entrada: no debe contener lógica de negocio ni cálculos financieros. Recibe la petición HTTP, invoca al servicio adecuado y responde con el DTO y código HTTP semántico correspondiente.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'En Spring Boot, inyectar dependencias a través del constructor es preferible a la inyección sobre campos con `@Autowired`, ya que facilita la inmutabilidad y permite instanciar la clase en tests unitarios sin levantar el contenedor de Spring.'
    correctAnswer: true
    explanation: >-
      Verdadero. La inyección por constructor explicita las dependencias obligatorias de la clase, evita referencias nulas y permite instanciar el servicio con un simple `new MiServicio(mockRepo)` en cualquier prueba unitaria de JUnit 5 pura.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Al diseñar un endpoint REST de creación de recursos (`POST /api/recursos`), ¿cuál es el código de estado HTTP semántico recomendado cuando la creación fue exitosa?'
    options:
      - id: 'a'
        text: '200 OK'
      - id: 'b'
        text: '201 Created (acompañado habitualmente del encabezado `Location`)'
      - id: 'c'
        text: '204 No Content'
      - id: 'd'
        text: '301 Moved Permanently'
    correctOptionId: 'b'
    explanation: >-
      El estándar HTTP especifica que una creación exitosa debe responder con `201 Created`, indicando en el encabezado `Location` la URL donde puede consultarse el nuevo recurso generado.
---
