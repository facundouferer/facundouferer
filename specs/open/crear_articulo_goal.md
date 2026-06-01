Crear un artículo en ambos idiomas en base a este contenido y la imagen del artículo está en /img/articles/goal.png:

El `/goal` de Codex convierte una conversación en un contrato de ejecución persistente: no es “haz esto y dime qué pasó”, sino “persigue este resultado hasta que exista evidencia de que está terminado”. OpenAI lo define como un objetivo duradero para tareas largas con condición verificable de parada; se configura con `/goal <objective>`, se consulta con `/goal` y se controla con `/goal pause`, `/goal resume` o `/goal clear`. ([OpenAI Developers][1])

Su uso principal es claro: trabajos de desarrollo donde el camino no está completamente definido, pero el final sí. Por ejemplo, reducir la latencia p95 sin romper tests, migrar una API manteniendo compatibilidad, perseguir un bug intermitente, refactorizar por etapas o iterar sobre benchmarks. La gracia —y el peligro moderadamente civilizado— es que Codex puede entrar en un ciclo de planear, modificar, probar, revisar y continuar sin que el humano tenga que repetir cada cinco minutos “acuérdate de lo importante”. ([OpenAI Developers][2])

Los buenos casos de uso comparten tres ingredientes: un objetivo único, una forma objetiva de comprobar avance y límites explícitos. “Mejora el proyecto” es una plegaria; “migra el módulo X a Y, mantén verdes los tests A/B y no cambies la API pública” ya es ingeniería. OpenAI recomienda usarlo para migraciones, grandes refactors, experimentos, prototipos, juegos, loops de despliegue y tareas de investigación con artefacto final. ([OpenAI Developers][3])

Para quienes usan Codex, `/goal` cambia el rol de la herramienta: deja de ser copiloto de respuesta corta y se acerca a un agente de trabajo prolongado. Eso no elimina la supervisión; la desplaza hacia definir bien “terminado”, revisar diffs, validar pruebas y decidir cuándo pausar. En otras palabras, el programador no desaparece: asciende, con dudoso glamour, a redactor de contratos para una máquina muy obediente y ocasionalmente demasiado entusiasta.

También conviene recordar que la función ha sido tratada como experimental en algunas superficies y versiones, con diferencias entre CLI y apps de escritorio reportadas por usuarios. ([GitHub][4]) Su significado real, entonces, no es “autonomía mágica”, sino algo más útil: persistencia con criterio verificable. Menos épica, más CI pasando.

[1]: https://developers.openai.com/codex/cli/slash-commands?utm_source=chatgpt.com "Slash commands in Codex CLI"
[2]: https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex "Using Goals in Codex"
[3]: https://developers.openai.com/codex/use-cases/follow-goals "Follow a goal | Codex use cases"
[4]: https://github.com/openai/codex/issues/22049 "Codex macOS app should natively support `/goal` like Codex CLI · Issue #22049 · openai/codex · GitHub"

# Guía práctica de `/goal` en Codex: cómo convertir instrucciones en objetivos persistentes

La mayoría de las interacciones con Codex siguen un patrón sencillo: escribes una tarea, Codex la ejecuta y devuelve un resultado. Ese modelo funciona bien para cambios pequeños, pero empieza a mostrar límites cuando el trabajo requiere múltiples pasos, validaciones, pruebas y correcciones.

Ahí aparece `/goal`.

La función `/goal` permite definir un objetivo persistente que Codex mantendrá como referencia durante toda la sesión. En lugar de responder únicamente al último mensaje, el sistema intenta avanzar continuamente hacia un resultado final previamente definido.

Piensa en ello como la diferencia entre decir:

> "Corrige este error."

y decir:

> "Mi objetivo es eliminar este error sin romper ningún test existente."

En el segundo caso existe un criterio permanente que guía las decisiones posteriores.

---

## Concepto fundamental

La sintaxis básica es:

```bash
/goal <descripción del objetivo>
```

Por ejemplo:

```bash
/goal Reducir el tiempo de compilación del proyecto por debajo de 30 segundos manteniendo todos los tests verdes.
```

A partir de ese momento, Codex intentará evaluar sus acciones según ese objetivo.

La clave está en entender que `/goal` no es una tarea sino una meta.

Una tarea puede ser:

```text
Optimiza este archivo.
```

Un objetivo sería:

```text
Reducir el tiempo total de build a menos de 30 segundos.
```

El primero describe una acción.

El segundo describe un resultado verificable.

---

# Cómo escribir buenos objetivos

La calidad del resultado depende enormemente de la calidad del objetivo.

Un mal ejemplo:

```bash
/goal Mejorar el proyecto
```

¿Qué significa mejorar?

- Más rápido
- Más mantenible
- Menos errores
- Menor consumo de memoria

Nadie lo sabe.

Un objetivo mejor:

```bash
/goal Reducir el consumo de memoria del servicio de autenticación en al menos un 20% sin modificar la API pública.
```

Aquí aparecen tres elementos fundamentales:

1. Resultado esperado.
2. Restricciones.
3. Forma de validar éxito.

---

# Tutorial 1: corregir un bug

Supongamos que existe un error intermitente.

Definimos:

```bash
/goal Eliminar el error que produce timeouts en la autenticación manteniendo el comportamiento actual y todos los tests existentes.
```

Después podemos pedir:

```text
Investiga posibles causas.
```

Más tarde:

```text
Implementa la solución más segura.
```

Y luego:

```text
Ejecuta las pruebas relevantes.
```

Aunque las instrucciones cambien, Codex sigue teniendo presente el objetivo original.

---

# Tutorial 2: refactorización grande

Imaginemos una migración de JavaScript a TypeScript.

Primero:

```bash
/goal Migrar completamente el proyecto a TypeScript manteniendo compatibilidad funcional y cobertura de pruebas.
```

Luego pueden venir muchas tareas distintas:

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

Todas esas acciones contribuyen al mismo objetivo global.

Este es probablemente uno de los usos más potentes de `/goal`.

---

# Tutorial 3: optimización de rendimiento

Definimos:

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

Aquí Codex puede iterar varias veces sin perder de vista la métrica objetivo.

---

# Consultar el objetivo actual

En cualquier momento:

```bash
/goal
```

Codex mostrará el objetivo activo.

Es útil cuando la sesión lleva mucho tiempo y ya nadie recuerda exactamente qué se acordó al principio, una situación sorprendentemente común en proyectos de software y en reuniones corporativas.

---

# Pausar un objetivo

Si deseas trabajar temporalmente en otra cosa:

```bash
/goal pause
```

El objetivo queda suspendido.

Posteriormente:

```bash
/goal resume
```

para retomarlo.

Esto evita que tareas secundarias interfieran con el trabajo principal.

---

# Eliminar un objetivo

Cuando ya no es necesario:

```bash
/goal clear
```

La sesión vuelve a funcionar sin un objetivo persistente.

Conviene hacerlo cuando cambias completamente de contexto.

---

# Patrones recomendados

## Define métricas

Mejor:

```text
Reducir tiempo de build a menos de 30 segundos.
```

Peor:

```text
Hacer builds más rápidos.
```

---

## Añade restricciones

Mejor:

```text
Reducir uso de memoria sin modificar la API pública.
```

Peor:

```text
Reducir uso de memoria.
```

---

## Mantén un único objetivo principal

Mejor:

```text
Migrar el proyecto a TypeScript.
```

Peor:

```text
Migrar a TypeScript, optimizar rendimiento, mejorar UI y reorganizar la arquitectura.
```

Los objetivos múltiples suelen terminar generando prioridades ambiguas.

---

# Cuándo usar `/goal`

Funciona especialmente bien para:

- Refactorizaciones grandes.
- Migraciones tecnológicas.
- Optimización de rendimiento.
- Eliminación de bugs complejos.
- Desarrollo de prototipos.
- Automatización de tareas extensas.
- Investigación técnica con entregables concretos.

---

# Cuándo NO usar `/goal`

No aporta demasiado valor para tareas simples:

```text
Explícame una expresión regular.
```

```text
Genera una función en Python.
```

```text
Resume este archivo.
```

En estos casos el trabajo termina en una sola interacción y no existe un objetivo persistente que perseguir.

---

En la práctica, `/goal` representa uno de los cambios más importantes en la filosofía de uso de Codex. El usuario deja de describir cada paso y pasa a definir el resultado deseado. Codex sigue necesitando supervisión, validación y revisión humana, pero ya no trabaja únicamente sobre el último mensaje recibido. Trabaja sobre una intención permanente. Y, en ingeniería de software, recordar el objetivo original suele ser más difícil que escribir el código. Ahí es donde `/goal` resulta realmente útil.
