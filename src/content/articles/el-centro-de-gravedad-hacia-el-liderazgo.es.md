---
title: 'El centro de gravedad del desarrollador se desplaza hacia el liderazgo'
slug: 'el-centro-de-gravedad-hacia-el-liderazgo'
date: 2026-08-23
author: 'Facundo Uferer'
category: 'Technical Essay'
tags: ['AI', 'Leadership', 'Software Engineering', 'Education']
excerpt: 'Programar nunca fue solo escribir código. Trabajar con agentes de IA exige definir encuadres, evaluar riesgos y liderar sistemas más que tipear sintaxis.'
readingTime: 5
lang: 'es'
published: true
featured: false
---
![El centro de gravedad del desarrollador hacia el liderazgo](/img/articles/liderazgo-ia.png)

Casi todo lo que se escribe sobre inteligencia artificial y desarrollo de software gira alrededor de una sola pregunta: *¿nos va a reemplazar?* Y creo que tal vez la pregunta está equivocada, porque asume que programar era el trabajo. Escribir código era la parte que más tiempo consumía, sí. Pero nunca fue la parte que más valor generaba.

Cuando doy clases, la parte difícil nunca es la sintaxis. El `for`, el puntero, el `malloc` o la estructura básica: todo eso se aprende relativamente rápido. Lo que cuesta enseñar —lo que a veces no llego a consolidar en un solo cuatrimestre— es **decidir qué programa hay que escribir**. Cómo se piensa un problema antes de tocar el teclado. Cuál de las cinco soluciones posibles es la que se va a poder mantener dentro de dos años. Eso siempre fue la verdadera ingeniería. El código era simplemente el vehículo.

Lo que pasó en la última década es que esa distinción se borró. Había tanta demanda de gente que escribiera código que "saber programar" y "ser ingeniero" se volvieron sinónimos en el mercado. La IA vino a deshacer esa confusión de la forma más directa posible: **automatizando justamente la mitad mecánica que se había confundido con el todo**.

## Lo que no se puede delegar

Si un agente autónomo borra datos porque le di credenciales que no debía darle, el error no es del agente. Es mío, por no haber evaluado el riesgo de antemano.

Es exactamente lo mismo que pasa con una persona recién incorporada a un equipo: no le das acceso directo a producción el primer día, no porque desconfíes de ella, sino porque todavía no construiste el marco donde su trabajo sea seguro y tolerante a fallos. Con la IA es idéntico. La herramienta no tiene la culpa de cómo la configurás ni del entorno donde la desplegás.

Y acá está el verdadero giro: **construir ese marco es un trabajo de liderazgo, no de mecanografía de código.**

## Del paso a paso al encuadre

Antes, programar consistía en definir explícitamente cada paso secuencial. Ahora, trabajar con agentes consiste en **definir el objetivo, los criterios de éxito y las restricciones**.

- Qué librerías están permitidas y cuáles no.
- Qué patrones arquitectónicos queremos y cuáles van a complicar el mantenimiento futuro.
- Qué permisos y límites de ejecución tiene la herramienta.
- Cómo vamos a verificar de manera determinista que lo que hizo está bien.

Es exactamente lo que se hace cuando se coordina un equipo multidisciplinario. En un equipo de cinco personas donde nadie hace lo mismo —desarrollo, producción audiovisual, diseño gráfico, gestión institucional— nadie le escribe el código a nadie ni le dibuja la pieza al diseñador. Lo que se hace es **traducir un pedido que llega con frecuencia ambiguo o contradictorio en objetivos claros**, con restricciones explícitas y una definición de terminado (*definition of done*) que todos interpretemos igual.

Después reviso. Después me hago cargo del resultado.

Esa es exactamente la misma operación mental que hoy aplicamos frente a un agente de IA.

## Lo que no cambia, y lo que cambia de forma

Frente a esta transición, hay dos realidades fundamentales que conviene no perder de vista:

### 1. Hay que seguir sabiendo programar

No para escribir cada línea a mano en el día a día, sino porque **no se puede supervisar lo que no se comprende a fondo**. Es la razón por la que sigo dando cursos de desarrollo en la universidad con total convicción.

Alguien que nunca escribió un ciclo a mano no tiene herramientas conceptuales para evaluar lo que un agente le devuelve; solo puede aceptarlo a ciegas. Y aceptar sin evaluar es el riesgo profesional más grande del sector en este momento, porque los modelos de lenguaje son extraordinariamente competentes haciendo que una respuesta conceptualmente equivocada parezca impecable.

### 2. La supervisión cambia de forma

Antes revisábamos código línea por línea buscando errores tipográficos o sintácticos. Ahora revisamos el encuadre global:

- Exigimos justificación de decisiones arquitectónicas contra documentación técnica oficial.
- Ejecutamos los tests nosotros mismos en lugar de confiar pasivamente en el reporte del agente.
- Diseñamos de antemano cómo validar cada requerimiento de forma determinista y reproducible.

La habilidad concreta más valiosa de este último tiempo no ha sido el *prompting* superficial: ha sido **agarrar un requerimiento complejo y partirlo en pedazos verificables e independientes**.

## Por qué esto importa hoy

Hay mucha gente formándose para un trabajo que se está achicando a pasos agigantados, mientras que el rol que crece no se enseña casi en ningún plan de estudio tradicional.

Rara vez te dan una materia dedicada a definir criterios de aceptación rigurosos, evaluar riesgos antes de delegar tareas críticas, o comunicar decisiones técnicas con claridad hacia arriba y hacia abajo. Y sin embargo, esas habilidades son, cada vez más, el corazón de nuestra profesión.

La ingeniería de software siempre fue esto. La única diferencia es que **hoy ya no queda dónde esconderse detrás de las líneas de código**.
