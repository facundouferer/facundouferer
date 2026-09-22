---
course: 'java'
lesson: '06-introduccion-y-pilares-poo'
slug: 'mapa-responsabilidades'
title: 'Mapa de responsabilidades de una biblioteca'
description: 'Rediseñá conceptualmente un sistema de préstamos usando objetos y los cuatro pilares de POO.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 25
objectives:
  - 'Distinguir datos compartidos y funciones sueltas de responsabilidades agrupadas en objetos.'
  - 'Reconocer abstracción, encapsulamiento, herencia y polimorfismo en un modelo sencillo.'
  - 'Explicar por qué una regla de negocio debe tener una única responsabilidad clara.'
requirements:
  - 'Dibujar un esquema inicial con las funciones registrarPrestamo, devolverMaterial y calcularMulta que modifican una lista compartida de préstamos.'
  - 'Proponer al menos dos objetos del dominio y anotar para cada uno qué información conoce y qué acciones ofrece, sin escribir código Java.'
  - 'Elegir tres datos esenciales para representar un préstamo y justificar un detalle que dejarías fuera del modelo: eso es abstracción.'
  - 'Indicar qué información no debería modificarse desde fuera y qué acción controlada permitiría cambiarla: eso es encapsulamiento.'
  - 'Describir una relación de especialización válida, por ejemplo Material → Libro y Material → Revista, e identificar una característica común: eso es herencia.'
  - 'Describir una acción común, como calcularPlazo, que Libro y Revista podrían responder de modo diferente: eso es polimorfismo.'
  - 'Explicar en dos frases cómo el esquema nuevo reduce los cambios accidentales sobre información compartida.'
exampleOutput: |
  Préstamo: conoce fecha de retiro, fecha límite y estado.
  Acciones: registrar devolución, consultar vencimiento.
  Material: conoce título y disponibilidad.
  Libro y Revista son especializaciones de Material.
  calcularPlazo: un libro concede 21 días; una revista, 7 días.
  El estado del préstamo se modifica solo al registrar una devolución válida.
deliveryTips:
  - 'Entregá un diagrama y una breve explicación; esta actividad evalúa el modelo, no la sintaxis de Java.'
  - 'Preguntate quién debe ser responsable de cada dato antes de dibujar flechas entre objetos.'
---

## Contexto

Una biblioteca pequeña usa una lista de préstamos compartida por varias funciones. Si una función cambia el estado sin respetar las reglas de devolución, otra puede calcular mal los vencimientos. Tu tarea es **reorganizar las responsabilidades**, no programar la solución.

## Consigna

Creá dos diagramas: uno de la organización inicial, con funciones separadas y datos compartidos, y otro con objetos que reúnen información y acciones relacionadas. Debajo, explicá los cuatro pilares usando las decisiones de tu propio modelo.

No necesitás escribir clases, crear instancias ni usar sintaxis que se estudiará en lecciones posteriores. Lo importante es defender por qué cada responsabilidad queda donde la ubicás.
