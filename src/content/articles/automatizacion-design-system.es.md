---
title: "Automatización del Design System"
title_en: "Design System Automation"
slug: automatizacion-design-system
date: 2026-04-24
author: Facundo Uferer
category: AI Design
tags:
  - AI
  - Design System
  - Claude
  - Figma
excerpt: En mi compilado de design systems convertí referencias visuales en pequeños sistemas navegables y usé Claude Design como bisturí para documentar, no para improvisar.
excerpt_en: In my design systems compilation, I turned visual references into small navigable systems and used Claude Design like a scalpel for documentation, not improvisation.
readingTime: 4
image: /img/articles/designsystems.png
lang: es
published: true
featured: false
---
![Automatización del Design System](/img/articles/designsystems.png)

**Nota**

En mi compilado de design systems reuní referencias visuales que me gustaron y las convertí en pequeños sistemas navegables: colores, tipografías, componentes, layouts y esa ilusión saludable de que el caos puede documentarse. La herramienta central fue **Claude Design**, el nuevo producto experimental de Anthropic para crear diseños, prototipos, slides y piezas visuales conversando con Claude. Según Anthropic, permite generar una primera versión desde un prompt, iterar con comentarios, editar elementos y exportar a PDF, PPTX, Canva o HTML. También puede construir un design system leyendo archivos, código o referencias del equipo.

**El flujo ideal es** simple: darle contexto visual, explicar qué se quiere construir, revisar el canvas, pedir variantes y corregir con precisión. No conviene pedirle “haceme algo lindo”, porque ahí la IA entra en modo póster de startup financiada por ansiedad. Funciona mucho mejor con instrucciones concretas: audiencia, layout, tono, componentes, restricciones y ejemplos.

El problema es el costo. **Claude Design** está disponible para planes Pro, Max, Team y Enterprise, pero usa los límites de la suscripción. En el plan de 20 dólares, trabajando con diseño, imágenes, iteraciones y prototipos, los tokens se consumen rápido; Anthropic incluso ofrece “extra usage” pago cuando se superan esos límites.

## Cómo hacerlo si sos pobre

Por eso mi recomendación práctica es separar el proceso: primero hacer un buen diseño base en **Figma** o en **Google Stitch**, que genera interfaces web y mobile desde lenguaje natural y está pensado para idear UI rápido. Luego, con esa dirección visual ya definida, usar una IA más barata —por ejemplo Minimax— para documentar tokens, componentes, reglas, estados y ejemplos de uso. Claude Design brilla, sí, pero **conviene usarlo como bisturí**, no como excavadora.

## Mi Design System

- [Explorarlo online](https://facundouferer.github.io/designsystems/)
