---
title: 'Guía práctica de /goal en Codex'
title_en: 'Practical Guide to /goal in Codex'
slug: guia-practica-goal-codex
date: 2026-06-01
author: Facundo Uferer
category: AI Engineering
tags:
  - AI
  - Codex
  - Developer Tools
  - Workflow
excerpt: Cómo usar /goal en Codex para convertir conversaciones largas en objetivos persistentes con criterio verificable de finalización.
excerpt_en: How to use /goal in Codex to turn long-running conversations into persistent objectives with verifiable completion criteria.
readingTime: 7
lang: es
published: true
featured: false
---
![Guía práctica de goal en Codex](/img/articles/goal.png)

El `/goal` de Codex convierte una conversación en **un contrato de ejecución persistente**. No es lo mismo que decir “hacé esto y contame qué pasó”. Es más parecido a decir: “perseguí este resultado hasta que exista evidencia razonable de que está terminado”.

OpenAI lo describe como una forma de darle a Codex **un objetivo duradero para trabajo largo**, con una condición verificable de parada. La operación básica es simple: se configura con `/goal <objetivo>`, se consulta con `/goal` y se controla con `/goal pause`, `/goal resume` o `/goal clear`.

La diferencia parece chica, pero en ingeniería de software es enorme. Un prompt normal le pide a Codex que haga la próxima acción. Un goal le dice cuál es **el estado final que tiene que perseguir**.

## Para qué sirve realmente

El caso de uso más claro aparece cuando el camino no está completamente definido, pero el final sí.

Por ejemplo:

- reducir la latencia p95 sin romper tests
- migrar una API manteniendo compatibilidad
- perseguir un bug intermitente
- refactorizar por etapas
- iterar sobre benchmarks
- investigar un problema hasta producir un artefacto verificable

La gracia —y el peligro moderadamente civilizado— es que Codex puede entrar en un ciclo de **planear, modificar, probar, revisar y continuar** sin que el humano tenga que repetir cada cinco minutos: “acordate de lo importante”.

Eso no significa autonomía mágica. Significa **persistencia con criterio verificable**. Menos épica, más CI pasando.

## Un goal no es una tarea

La sintaxis básica es:

```bash
/goal <descripción del objetivo>
```

Un ejemplo flojo sería:

```bash
/goal Mejorar el proyecto
```

Eso no es ingeniería. Es una plegaria con teclado.

¿Qué significa mejorar?

- más rápido
- más mantenible
- menos errores
- menor consumo de memoria
- mejor UI

Nadie lo sabe. Y si nadie lo sabe, Codex tampoco lo puede verificar.

Un objetivo mejor sería:

```bash
/goal Reducir el consumo de memoria del servicio de autenticación en al menos un 20% sin modificar la API pública.
```

Ahí aparecen tres ingredientes fundamentales:

1. **resultado esperado**
2. **restricciones explícitas**
3. **forma de validar éxito**

Esa es la diferencia entre tirar una intención al aire y escribir un contrato de ejecución.

## Cómo escribir buenos objetivos

Un buen `/goal` debería responder cuatro preguntas:

1. ¿Qué tiene que ser verdad al final?
2. ¿Cómo se comprueba?
3. ¿Qué no se puede romper?
4. ¿Cuándo debe parar Codex?

Por ejemplo:

```bash
/goal Reducir la latencia p95 del endpoint /search por debajo de 200 ms, verificado por el benchmark de búsqueda, sin cambiar el contrato público de la API.
```

Ese objetivo no solo dice “andá más rápido”. Dice **qué métrica importa**, **cómo se valida** y **qué frontera no se puede cruzar**.

OpenAI recomienda este tipo de estructura para trabajos largos: resultado medible, superficie de verificación, restricciones, límites y condición de bloqueo. Básicamente: no le des una nube de deseos; dale un mapa.

## Tutorial 1: corregir un bug

Supongamos que hay un error intermitente en autenticación.

Podés definir:

```bash
/goal Eliminar el error que produce timeouts en la autenticación manteniendo el comportamiento actual y todos los tests existentes.
```

Después podés pedir tareas parciales:

```text
Investiga posibles causas.
```

```text
Implementa la solución más segura.
```

```text
Ejecuta las pruebas relevantes.
```

Aunque las instrucciones cambien, Codex mantiene presente **el objetivo original**. Eso evita que cada interacción arranque desde cero o que el trabajo se desvíe por el último detalle mencionado.

## Tutorial 2: una refactorización grande

Imaginemos una migración de JavaScript a TypeScript.

```bash
/goal Migrar completamente el proyecto a TypeScript manteniendo compatibilidad funcional y cobertura de pruebas.
```

Luego pueden venir muchas acciones distintas:

```text
Convierte el módulo users.
```

```text
Corrige errores de tipado.
```

```text
Actualiza la configuración del compilador.
```

```text
Elimina tipos any innecesarios.
```

Todas esas acciones contribuyen al mismo objetivo global. Este es probablemente uno de los usos más potentes de `/goal`: **coordinar trabajo incremental sin perder la intención principal**.

## Tutorial 3: optimización de rendimiento

Otro ejemplo clásico:

```bash
/goal Reducir la latencia p95 del endpoint /search por debajo de 200 ms.
```

Después:

```text
Analiza los cuellos de botella.
```

```text
Propón varias estrategias.
```

```text
Implementa la más efectiva.
```

```text
Ejecuta benchmarks.
```

Acá Codex puede iterar varias veces sin perder de vista la métrica objetivo. Y eso es clave, porque en rendimiento el primer intento rara vez es el definitivo.

## Consultar, pausar y limpiar

Para ver el objetivo activo:

```bash
/goal
```

Para pausarlo temporalmente:

```bash
/goal pause
```

Para retomarlo:

```bash
/goal resume
```

Para eliminarlo:

```bash
/goal clear
```

Esto importa cuando querés trabajar temporalmente en otra cosa sin que el objetivo principal contamine cada decisión posterior.

## Cuándo usarlo

`/goal` funciona especialmente bien para:

- refactorizaciones grandes
- migraciones tecnológicas
- optimización de rendimiento
- eliminación de bugs complejos
- desarrollo de prototipos
- automatización de tareas extensas
- investigación técnica con entregables concretos

El patrón común es siempre el mismo: **trabajo largo, resultado claro y validación posible**.

## Cuándo no usarlo

No aporta demasiado para tareas simples:

```text
Explicame esta expresión regular.
```

```text
Generá una función en Python.
```

```text
Resumí este archivo.
```

En esos casos, el trabajo termina en una sola interacción. No hace falta un objetivo persistente para cruzar una calle de dos metros.

Tampoco conviene usar `/goal` cuando el objetivo es vago. “Mejorá el proyecto” o “refactorizá esto” suenan productivos, pero no definen qué significa terminar.

## El cambio de rol

Para quienes usan Codex, `/goal` cambia la relación con la herramienta. Codex deja de ser solo un copiloto de respuesta corta y se acerca a **un agente de trabajo prolongado**.

Eso no elimina la supervisión humana. La desplaza.

El humano sigue siendo responsable de:

- definir bien qué significa “terminado”
- revisar diffs
- validar pruebas
- decidir cuándo pausar
- reconocer cuándo el objetivo quedó mal planteado

En otras palabras, el programador no desaparece: asciende, con dudoso glamour, a **redactor de contratos para una máquina muy obediente y ocasionalmente demasiado entusiasta**.

## Un detalle importante: las superficies pueden variar

También conviene recordar que puede haber diferencias entre superficies de Codex. La documentación oficial describe `/goal` como parte de los comandos del CLI y como caso de uso para objetivos duraderos. A la vez, usuarios reportaron diferencias entre CLI y la app de macOS, especialmente alrededor de visibilidad, soporte y controles del goal.

La conclusión práctica es simple: si `/goal` no aparece, no asumas que estás loco. Verificá la versión, la superficie que estás usando y si la funcionalidad está habilitada.

## La idea central

En la práctica, `/goal` representa un cambio importante en la filosofía de uso de Codex. El usuario deja de describir cada paso y pasa a definir **el resultado deseado**.

Codex sigue necesitando supervisión, validación y revisión humana. Pero ya no trabaja únicamente sobre el último mensaje recibido. Trabaja sobre una intención persistente.

Y en ingeniería de software, recordar el objetivo original suele ser más difícil que escribir el código.

Ahí es donde `/goal` resulta realmente útil.

**Fuentes:**

- [OpenAI Developers — Slash commands in Codex CLI](https://developers.openai.com/codex/cli/slash-commands)
- [OpenAI Cookbook — Using Goals in Codex](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex)
- [OpenAI Developers — Follow a goal](https://developers.openai.com/codex/use-cases/follow-goals)
- [GitHub — Codex macOS app should natively support /goal like Codex CLI](https://github.com/openai/codex/issues/22049)
