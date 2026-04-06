---
title: 'Go to Brazil: un experimento de desarrollo 100% asistido por IA'
title_en: 'Go to Brazil: A 100% AI-Assisted Development Experiment'
slug: 'go-to-brazil-experiment'
date: 2025-02-10
author: 'Facundo Uferer'
category: 'AI Engineering'
tags: ['Case Study', 'AI', 'Tourism']
excerpt: 'Caso real sobre herramientas, orden de ejecucion y decisiones que permitieron entregar un producto funcional.'
excerpt_en: 'Real case study about tooling order and decisions that enabled a functional delivery.'
readingTime: 10
lang: 'es'
published: true
featured: true
---

 **“Go to Brazil”** es un pequeño sitio web experimental que desarrollé para explorar hasta qué punto es posible construir un producto digital utilizando únicamente herramientas de inteligencia artificial. El resultado puede verse públicamente en:

**[https://facundouferer.github.io/gotobrazil/en/](https://facundouferer.github.io/gotobrazil/en/)**

Más allá del sitio en sí, el verdadero interés del experimento fue observar **cómo se comporta un flujo de desarrollo completamente mediado por IA** y, sobre todo, descubrir **cuál es el punto donde todavía aparece un vacío que las herramientas actuales no logran cubrir completamente**.

---

## La premisa del experimento

La idea era simple pero estricta: **todo debía ser generado o asistido por inteligencia artificial**.

El rol humano quedaba reducido a:

- definir el objetivo general del proyecto
- coordinar las herramientas
- ejecutar el despliegue final

Ninguna parte del sitio —ni el diseño, ni la planificación, ni el código, ni las imágenes— debía ser creada manualmente sin asistencia de IA.

---

## Paso 1: diseño visual inicial con Stitch

El punto de partida fue el diseño visual del sitio. Para esto utilicé **Stitch de Google**, una herramienta de generación de interfaces basada en inteligencia artificial.

La IA produjo las primeras propuestas gráficas del sitio: estructura de la página principal, secciones, estilo visual y organización del contenido. En esta etapa se definieron elementos como:

- layout general del sitio
- jerarquía de secciones
- estilo visual orientado al turismo
- bloques de contenido principales

Este primer paso permitió obtener **una base visual rápidamente**, algo que tradicionalmente implicaría el trabajo de un diseñador UX/UI.

Sin embargo, como suele ocurrir con las interfaces generadas automáticamente, el resultado fue **una aproximación inicial más que un diseño final completamente refinado**.

---

## Paso 2: planificación del proyecto con Claude

Una vez definido el concepto visual, el siguiente paso fue **estructurar el proyecto completo**.

Para eso utilicé **Claude**, que generó una planificación detallada del sitio:

- estructura de páginas
- contenido esperado de cada sección
- arquitectura del proyecto
- tareas necesarias para el desarrollo
- lista completa de issues de implementación

En otras palabras, Claude actuó como **una especie de product manager y arquitecto de software**, transformando la idea inicial en un plan de trabajo estructurado.

Esta etapa resultó particularmente interesante porque permitió convertir un concepto difuso en **un roadmap de desarrollo concreto**, algo que normalmente requiere experiencia en gestión de proyectos de software.

---

## Paso 3: generación de issues con Codex

A partir de la planificación generada por Claude, utilicé **Codex** para transformar ese plan en **issues concretas de desarrollo**.

Cada issue representaba una tarea específica:

- crear componentes de interfaz
- implementar secciones del sitio
- integrar imágenes
- ajustar estilos
- preparar el contenido

El objetivo era simular el flujo de trabajo de un equipo de desarrollo real, donde el trabajo se organiza en tareas pequeñas y bien definidas.

De esta manera, la inteligencia artificial no solo ayudó a generar código, sino también a **estructurar el trabajo necesario para producirlo**.

---

## Paso 4: generación de imágenes con Nano Banana

El contenido visual del sitio fue generado utilizando **Nano Banana**, un generador de imágenes basado en inteligencia artificial.

Todas las ilustraciones e imágenes utilizadas en el sitio fueron producidas con prompts relacionados con:

- paisajes de Brasil
- turismo
- playas y naturaleza
- estética tropical

Esto permitió completar rápidamente el material gráfico sin recurrir a bancos de imágenes ni a diseño manual.

---

## Paso 5: desarrollo completo con OpenCode

La implementación del sitio se realizó utilizando **OpenCode**, trabajando con varios modelos de código abiertos y gratuitos.

El objetivo era que **todo el código fuera generado automáticamente** a partir de las especificaciones y las issues previamente definidas.

El proceso consistió en:

1. tomar cada issue generada
2. pedir al agente que implemente la funcionalidad
3. revisar el resultado
4. ajustar instrucciones si era necesario

Este proceso reproduce una dinámica interesante: en lugar de escribir código directamente, el desarrollador **describe lo que necesita y el agente lo implementa**.

En este sentido, el rol humano pasa de programador a **director del proceso de generación de software**.

---

## Paso 6: despliegue en GitHub Pages

Una vez finalizado el desarrollo, el sitio fue desplegado utilizando **GitHub Pages**, lo que permitió publicarlo rápidamente como un sitio estático accesible desde la web.

Este fue prácticamente el único paso completamente manual del proceso: **realizar el deploy final**.

---

## El resultado

El experimento demostró que hoy es posible construir un sitio web completo utilizando exclusivamente herramientas de inteligencia artificial para:

- diseño
- planificación
- generación de tareas
- producción de imágenes
- escritura de código

En términos de productividad, el proceso fue **extremadamente rápido** comparado con un desarrollo tradicional.

Sin embargo, el objetivo real del experimento no era comprobar si la IA puede programar, algo que ya sabemos que puede hacer, sino detectar **dónde aparecen las limitaciones reales**.

---

## El agujero que todavía no cubre la inteligencia artificial

La principal conclusión del experimento es que **la generación de código no es el problema principal**.

Las herramientas actuales pueden producir código funcional con bastante facilidad.

El verdadero desafío aparece en otro lugar: **la coherencia global del proyecto**.

Durante el desarrollo surgió repetidamente una dificultad que podría describirse como el gran agujero actual de la programación asistida por IA:

**la falta de comprensión profunda del sistema completo.**

Cada herramienta puede resolver tareas individuales muy bien:

- diseñar una pantalla
- generar una función
- crear una imagen
- escribir un componente

Pero ninguna herramienta mantiene todavía **una visión integral persistente del proyecto**.

Esto genera varios problemas:

- inconsistencias entre componentes
- decisiones arquitectónicas contradictorias
- pérdida de contexto entre tareas
- dificultad para mantener coherencia estética o estructural

En otras palabras, la inteligencia artificial es excelente resolviendo **problemas locales**, pero todavía tiene dificultades manejando **la complejidad sistémica de un proyecto completo**.

---

## El nuevo rol del desarrollador

Este experimento sugiere que el rol humano en el desarrollo asistido por IA no desaparece, sino que se desplaza hacia otro tipo de tareas.

El desarrollador se convierte en alguien que:

- mantiene la coherencia del sistema
- define el problema con claridad
- supervisa decisiones arquitectónicas
- corrige desviaciones del proceso automático

Es menos un programador en el sentido tradicional y más **un director técnico de sistemas generativos**.

---

## Una conclusión inesperada

El experimento “Go to Brazil” demuestra que **la programación asistida por IA ya es una realidad práctica**.

Un sitio completo puede construirse casi sin escribir código manualmente.

Pero también muestra algo más importante: el mayor desafío ya no es generar código, sino **mantener la inteligencia estructural del proyecto**.

Hasta que las herramientas puedan comprender y sostener esa visión global de manera autónoma, seguirá existiendo un espacio fundamental para el criterio humano.

Y probablemente ese sea, por ahora, **el verdadero trabajo del programador en la era de la inteligencia artificial**.
