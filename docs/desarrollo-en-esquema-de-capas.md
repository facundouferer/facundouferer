# Desarrollo con agentes de IA: un esquema de cuatro capas

**Versión 1.0 — agosto 2026**

Documento de referencia para equipos que incorporan agentes de IA al desarrollo de proyectos grandes, de larga vida y con varias personas.

---

## Por qué un esquema de capas

El problema no es que los agentes escriban mal código. Escriben razonablemente bien. El problema aparece a los tres meses, cuando nadie puede reconstruir por qué el sistema hace lo que hace, y las decisiones arquitectónicas quedaron sepultadas en sesiones de chat que ya no existen.

La causa es siempre la misma: **una sola herramienta terminó cubriendo responsabilidades que deberían estar separadas**. El tracker contiene la especificación, la especificación contiene el plan de tareas, el agente escribe sus propios criterios de aceptación, y el resultado es un sistema donde no hay ninguna fuente de verdad que se pueda auditar.

Este esquema separa cuatro responsabilidades y define reglas de acoplamiento entre ellas. Es independiente de qué agente, qué modelo o qué framework uses — esos son detalles de una sola capa, la más reemplazable.

---

## Parte 1 — Las cuatro capas

![Esquema de cuatro capas: 1 Intención (autoridad) → 2 Coordinación → 3 Ejecución → 4 Verificación (veto), y la verificación corrige la capa 1](assets/esquema-cuatro-capas.svg)

### Capa 1 · Intención

**Qué es:** el contrato. Qué debe hacer el sistema y por qué.

**Dos artefactos distintos:**

- *Estado vigente* — lo que el sistema hace hoy. Es descriptivo y siempre verdadero.
- *Propuesta de cambio* — el delta que se quiere introducir. Es prescriptivo y temporal.

Confundirlos es el error más común. Si mezclás ambos en un solo documento, en seis meses no vas a poder distinguir lo que el sistema hace de lo que alguien alguna vez propuso que hiciera.

![Capa 1, dos artefactos: el estado vigente (descriptivo, siempre verdadero, permanente) y la propuesta de cambio (prescriptiva, temporal, con marcadores ADDED, MODIFIED y REMOVED); al cerrar el ciclo el delta se absorbe y la propuesta se archiva](assets/estado-vigente-vs-propuesta.svg)

**Dónde vive:** en el repositorio, versionado, revisado por PR como cualquier cambio de código.

**Quién es dueño:** una persona. Siempre. Un agente puede redactar un borrador, pero la aceptación es humana.

**Autoridad:** máxima. Ninguna otra capa puede contradecirla sin pasar por una revisión explícita.

### Capa 2 · Coordinación

**Qué es:** quién hace qué, en qué orden, bloqueado por qué.

**Contenido mínimo de una unidad de trabajo:**

- Identificador
- Referencia al contrato correspondiente (no una copia)
- Responsable humano
- Estado

**Dónde vive:** fuera del repositorio. El estado de quién está haciendo qué cambia mucho más rápido que el código, y versionarlo en ramas genera conflictos permanentes sin aportar nada.

**Regla crítica:** la unidad de trabajo **referencia** al contrato, nunca lo contiene. Si la sustancia técnica migra al tracker, perdiste la capacidad de reconstruir el proyecto desde el repositorio.

### Capa 3 · Ejecución

**Qué es:** la traducción de contrato a diff.

**Artefactos que produce:** plan de tareas, diff, log de la sesión.

**Dónde vive:** en ningún lado permanente. Es deliberadamente desechable.

**Prueba de diseño:** si mañana se pierde todo el output de esta capa, no debería perderse información. Si algo producido acá se vuelve indispensable para entender el sistema, es señal de que pertenecía a la capa 1 y hay que promoverlo.

**Límite:** el agente no puede modificar el contrato por su cuenta. Ante una ambigüedad, se detiene y consulta. No adivina. Esta es la regla más difícil de sostener y la que más define la calidad del sistema a largo plazo — un agente que adivina bien el 90% de las veces te deja un 10% de decisiones arquitectónicas tomadas por nadie y documentadas en ningún lado.

### Capa 4 · Verificación

**Qué es:** la prueba de que el diff satisface el contrato.

**Artefactos:** tests de aceptación derivados de los criterios de la capa 1, tests unitarios, la automatización que los corre, y los gates que bloquean el merge.

**Dónde vive:** en el repositorio, junto al código.

**Autoridad:** poder de veto. Es la única capa que no se puede convencer con argumentos.

**Regla crítica:** el criterio de aceptación se escribe **antes** de que la capa 3 arranque, y por alguien distinto del ejecutor. Si el que implementa también define qué cuenta como éxito, la verificación deja de verificar.

---

## Las cuatro reglas de acoplamiento


| Regla                        | Enunciado                                                              | Qué previene                                        |
| ---------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------- |
| **Direccionalidad**          | Cada capa referencia hacia arriba, nunca duplica                       | Cuatro versiones de la verdad, ninguna autoritativa |
| **Separación juez/ejecutor** | El criterio lo escribe una persona, antes, en la capa 1                | Circuito cerrado sobre sí mismo                     |
| **Persistencia asimétrica**  | Capas 1 y 4 sobreviven al proyecto; la 2, al sprint; la 3, a la sesión | Conocimiento crítico en artefactos efímeros         |
| **Granularidad alineada**    | Un contrato = una unidad = un diff revisable = un set de evidencia     | Review imposible, trazabilidad perdida              |

![Las cuatro reglas de acoplamiento: direccionalidad (cada capa referencia hacia arriba, nunca duplica), separación juez/ejecutor (el criterio lo escribe una persona, antes), persistencia asimétrica (la capa 3 vive una sesión, la 2 un sprint, las capas 1 y 4 el proyecto) y granularidad alineada (un contrato = una unidad = un diff = una evidencia)](assets/reglas-de-acoplamiento.svg)

### El ciclo

**Ida:** se propone un delta → se acuerda entre humanos → se convierte en unidad de trabajo → un agente lo ejecuta → la evidencia lo valida.

**Cierre:** el delta se absorbe en el estado vigente y la propuesta se archiva. Este paso es el que casi todos saltean, y es el que evita que la capa 1 se convierta en un cementerio de propuestas contradictorias.

**Vuelta:** hay dos caminos de retorno.

- *Desde verificación* — si la evidencia contradice el contrato, gana la evidencia y el contrato se corrige. Nunca al revés.
- *Desde ejecución* — si el agente encuentra una ambigüedad, sube. No resuelve.

![El ciclo completo: ida (propuesta, acuerdo entre humanos, unidad de trabajo, el agente ejecuta, la evidencia valida), cierre (el delta se absorbe en el estado vigente y la propuesta se archiva) y las dos vueltas: desde verificación gana la evidencia y se corrige el contrato; desde ejecución, ante una ambigüedad el agente sube y no resuelve](assets/ciclo-ida-cierre-vuelta.svg)

---

## Parte 2 — Herramientas por capa

Las herramientas cambian rápido; las capas no. Esta sección se desactualiza antes que el resto del documento, y ese es exactamente el punto: si tu proceso depende de una herramienta específica, migrar te cuesta el proceso entero.

![Herramientas por capa: frameworks de especificación versionada más AGENTS.md o CLAUDE.md (capa 1), trackers con soporte para agentes (capa 2), harness de agente por CLI, IDE o cloud (capa 3, la que más rota) y frameworks de test, análisis estático y CI con gates bloqueantes (capa 4)](assets/herramientas-por-capa.svg)

### Capa 1 · Intención

**Categoría:** frameworks de especificación versionada.


| Herramienta            | Perfil                    | Notas                                                                                                                                                                                    |
| ---------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **OpenSpec**           | Brownfield, liviano       | Separa estado vigente de propuestas con marcadores delta (ADDED/MODIFIED/REMOVED). Genera artefactos compactos, fáciles de revisar. Sus *stores* permiten specs compartidas entre repos. |
| **GitHub Spec Kit**    | Greenfield, estructurado  | Más exhaustivo y más verboso — genera aproximadamente el triple de contenido que OpenSpec para el mismo cambio. Requiere Python.                                                         |
| **BMAD-METHOD**        | Multi-equipo, ceremonioso | Simula un equipo ágil completo con 12+ agentes especializados. Se justifica sólo a escala grande.                                                                                        |
| **Kiro**               | IDE completo              | Integra las cuatro capas en un solo entorno. Menor fricción inicial, mayor lock-in.                                                                                                      |
| **Documentos propios** | Cualquiera                | Un directorio de markdown con convenciones claras cubre el 80% del valor. No subestimes esta opción.                                                                                     |


**Requisito mínimo, independiente de la herramienta:** un archivo de convenciones en la raíz del repositorio (`AGENTS.md` o `CLAUDE.md`) que cualquier agente lea al iniciar. Esto es lo que hace portable el resto.

### Capa 2 · Coordinación

**Categoría:** trackers con soporte para agentes.


| Herramienta       | Fortaleza                                                                                                                                       | Límite                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **GitHub Issues** | Loops cortos entre idea, código, review y merge; muy programable vía Actions y GraphQL                                                          | Es una capa de coordinación developer-native, no un sistema de trabajo transversal a toda la organización |
| **Linear**        | Trata a los agentes como participantes de primera clase: asignación directa, contexto del issue al lanzar la herramienta de código, soporte MCP | Vive fuera del repositorio, sin acceso nativo al código                                                   |
| **Jira**          | Modelo administrativo y gobernanza para organizaciones grandes                                                                                  | Peso de configuración considerable                                                                        |


El criterio de elección no es la funcionalidad sino **quién más tiene que participar**. Si sólo hay desarrolladores, Issues alcanza. Si hay diseño, producto o gestión involucrados, un tracker developer-native los excluye.

### Capa 3 · Ejecución

**Categoría:** harness de agente.

- **CLI:** Claude Code, Codex CLI, Gemini CLI, Aider
- **IDE:** Cursor, Cline, Roo Code, Copilot
- **Cloud/asíncronos:** agentes que toman un issue y devuelven un PR

Esta es la capa que más rápido rota y donde menos hay que invertir en integración profunda. Elegila por ergonomía del equipo, no por benchmarks. Los mejores agentes resuelven hoy entre 60% y 70% de SWE-bench Verified, pero ese benchmark usa issues curados con criterios de aceptación explícitos — condiciones que las tareas reales casi nunca tienen. El número dice más sobre la calidad de tu capa 1 que sobre el agente.

### Capa 4 · Verificación

**Categoría:** frameworks de test y automatización.


| Nivel        | Herramientas típicas                           | Deriva de              |
| ------------ | ---------------------------------------------- | ---------------------- |
| Aceptación   | Cucumber, Behave, Playwright, contract testing | Criterios de la capa 1 |
| Unitario     | pytest, Vitest, JUnit, Go testing              | Diseño de la capa 3    |
| Estático     | linters, type checkers, análisis de seguridad  | Convenciones del repo  |
| Orquestación | GitHub Actions, GitLab CI, y gates de merge    | —                      |


**Regla de configuración:** los gates deben ser bloqueantes, no informativos. Un check que se puede mergear en rojo no es verificación, es decoración.

---

## Parte 3 — Cómo se acoplan las metodologías

Ninguna metodología cubre las cuatro capas. Cada una se concentra en una o dos y asume el resto. Entender **dónde pone el peso cada una** es lo que permite combinarlas sin superposición ni huecos.

### Matriz de cobertura


| Metodología             | Capa 1 | Capa 2 | Capa 3 | Capa 4 |
| ----------------------- | :------: | :------: | :------: | :------: |
| Vibe coding             | —      | —      | ●●●    | —      |
| Issue-driven            | ○      | ●●●    | ●●     | ○      |
| SDD (spec-driven)       | ●●●    | ○      | ●●     | ●      |
| TDD (test-driven)       | —      | —      | ●●     | ●●●    |
| BDD / ATDD              | ●●     | —      | ●      | ●●●    |
| **SDD + TDD**           | ●●●    | ○      | ●●     | ●●●    |
| EDD (evaluation-driven) | ●      | —      | ●      | ●●●    |


●●● foco principal · ●● participación fuerte · ● participación parcial · ○ marginal · — no cubre

![Mapa de calor de cobertura: siete metodologías contra las cuatro capas; SDD + TDD, la combinación recomendada, es la única con foco principal en las capas 1 y 4 a la vez](assets/mapa-metodologias.svg)

### Vibe coding

**Qué es:** describir en lenguaje natural lo que se quiere, dejar que el agente genere el código y aceptar el resultado si "funciona", iterando por conversación y sin leer el código en detalle. No hay contrato previo ni criterio de éxito fijado de antemano: el criterio es la impresión del que prueba. El término lo popularizó Andrej Karpathy a principios de 2025 para describir ese modo de trabajo en el que uno se olvida de que el código existe.

**Dónde vive:** capa 3, exclusivamente.

Funciona bien para prototipos, exploración y scripts descartables — contextos donde el costo de equivocarse es cero y el artefacto no tiene futuro.

**Por qué falla a escala:** todo el conocimiento queda en la capa más efímera. Cuando la sesión termina, la información se pierde. Con varias personas, cada una construye un modelo mental distinto del sistema y nadie puede reconciliarlos.

**Cuándo usarlo igual:** dentro de una unidad de trabajo ya acotada por un contrato. El vibe coding es una técnica válida de capa 3; el problema es usarlo *como metodología*.

### Issue-driven development

**Qué es:** organizar el trabajo alrededor de los issues de un tracker. Cada cambio nace como un issue, ahí se discute, se prioriza y se asigna, y se cierra cuando el PR asociado se mergea. Es la práctica por defecto de casi cualquier equipo que usa GitHub, GitLab o Jira, y por eso muchos la aplican sin ponerle nombre.

**Dónde vive:** capa 2, con derrame a la capa 3.

El issue es la unidad de trabajo y el punto de entrada del agente. En su forma pura, el agente lee el issue, navega el código y devuelve un PR.

**Fortaleza:** cero fricción de adopción. No cambia cómo trabaja el equipo, sólo agrega un actor.

**Debilidad estructural:** al no tener capa 1, el issue termina absorbiendo la especificación. Empieza como tres líneas y termina siendo un documento de diseño enterrado en comentarios. A los seis meses tenés un tracker con miles de issues cerrados y ninguna descripción coherente del sistema.

**Cómo integrarlo bien:** mantené el issue delgado y que apunte al contrato. Issue-driven es una excelente capa 2 y una pésima capa 1.

### SDD — Spec-driven development

**Qué es:** escribir y aprobar una especificación — qué debe hacer el sistema, con qué alcance y bajo qué restricciones — antes de generar código, y usar esa spec como entrada directa del agente en vez de un prompt suelto. Es la metodología detrás de las herramientas de la capa 1 de la Parte 2 (OpenSpec, Spec Kit, Kiro): cada una es una forma distinta de estructurar la spec y de encadenarla con el plan y las tareas.

**Dónde vive:** capa 1, con influencia fuerte sobre la 3.

Invierte la relación tradicional: la especificación deja de ser documentación que se escribe después y pasa a ser la fuente que dirige la generación, los checklists y la descomposición en tareas.

**Diferencia clave con un PRD tradicional:** un documento de diseño está escrito para lectores humanos, que interpretan ambigüedades y llenan huecos con contexto organizacional. Los agentes también llenan huecos — pero no de la forma que uno querría. Sin alcance explícito, avanzan rápido en la dirección equivocada.

**Su punto ciego:** SDD por sí solo es débil en la capa 4. Produce documentos que describen comportamiento esperado, pero la traducción a evidencia ejecutable queda implícita. Además, las propuestas son estáticas: en implementaciones largas, el contrato y el código derivan sin que nada lo detecte.

**Tres niveles de autoridad de la spec sobre el código:**

1. *Spec-first* — la spec precede y restringe, el código sigue siendo el entregable principal
2. *Spec-anchored* — se agregan capas de gobernanza y checkpoints de supervisión
3. *Spec-as-source* — la spec es el artefacto primario y el código, derivado

La mayoría de los equipos debería empezar en el nivel 1.

### TDD — Test-driven development

**Qué es:** escribir primero un test automatizado que falla porque la funcionalidad todavía no existe, después el código mínimo para que pase, y por último refactorizar con el test como red de seguridad. Ese ciclo — *red, green, refactor* — se repite en incrementos chicos, a nivel unitario. Lo formalizó Kent Beck dentro de Extreme Programming, y es tanto una técnica de verificación como de diseño: obliga a definir la interfaz de un componente antes de implementarlo.

**Dónde vive:** capa 4, con influencia fuerte sobre la 3.

Con agentes, hay tres variantes según dónde esté el humano:


| Variante                 | Quién escribe el test                               | Riesgo                              |
| ------------------------ | --------------------------------------------------- | ----------------------------------- |
| Humano escribe los tests | Persona                                             | Bajo — pero es el cuello de botella |
| Checkpoint de revisión   | Agente escribe, humano aprueba antes de implementar | Medio                               |
| Todo dentro del loop     | Agente escribe test e implementación                | **Alto**                            |


**El riesgo de la tercera variante es concreto, no teórico.** Kent Beck documentó agentes que borraban los tests que fallaban en vez de arreglar la implementación subyacente. El agente optimiza el criterio que le diste — si el criterio es "que el suite esté verde" y el agente controla el suite, tenés un incentivo mal alineado.

**Su punto ciego:** TDD no dice nada sobre *qué* construir. Verifica que hiciste bien lo que decidiste hacer, no que hayas decidido lo correcto. Un sistema con 100% de cobertura puede estar resolviendo el problema equivocado.

### BDD / ATDD

**Qué es:** dos nombres para una misma idea, con énfasis distintos.

- *BDD (Behavior-Driven Development)* — evolución de TDD propuesta por Dan North. En vez de tests unitarios, se describe el comportamiento esperado del sistema en escenarios de lenguaje natural estructurado (*Given-When-Then*: dado un estado inicial, cuando ocurre una acción, entonces se espera un resultado), escritos entre negocio, desarrollo y testing, y automatizados con herramientas como Cucumber o Behave.
- *ATDD (Acceptance Test-Driven Development)* — la misma práctica vista desde el test: los criterios de aceptación se acuerdan con quien pide el cambio y se convierten en tests ejecutables **antes** de implementar.

En la práctica se usan casi como sinónimos. BDD pone el peso en el lenguaje compartido; ATDD, en el test de aceptación como contrato.

**Dónde vive:** puente entre capa 1 y capa 4.

Los escenarios funcionan simultáneamente como especificación legible y como test ejecutable. Es la metodología que naturalmente conecta intención con evidencia.

**Su ventaja específica en este esquema:** resuelve la traducción que SDD deja implícita. El criterio de aceptación deja de ser prosa interpretable y pasa a ser un artefacto que corre.

**Su riesgo con agentes:** cuando el agente genera los escenarios a partir de una descripción de dominio, esos escenarios tienden a reflejar la distribución de entrenamiento del modelo antes que los casos borde específicos de tu dominio. Los escenarios generados por IA necesitan revisión humana enfocada en **completitud**, no en corrección — el problema no suele ser que el escenario esté mal, sino que falten los tres que importan.

### SDD + TDD — la combinación recomendada

**Qué es:** no es una metodología nueva sino la combinación explícita de las dos anteriores: SDD para fijar el contrato y el alcance antes de empezar, y TDD — con escenarios BDD como puente — para convertir ese contrato en tests que fallan antes de que el agente escriba código. Cada una cubre el punto ciego de la otra.

**Dónde vive:** capas 1 y 4 simultáneamente, que es exactamente lo que ninguna de las dos cubre sola.

Las dos metodologías operan en niveles arquitectónicos distintos, y por eso se integran en vez de competir: TDD dirige el diseño de interfaces mediante ciclos red-green-refactor a nivel unitario, mientras SDD se apila encima para imponer restricciones arquitectónicas.

**El flujo concreto, capa por capa:**

1. **Capa 1** — se escribe el contrato del cambio: comportamiento esperado, alcance, y los escenarios de aceptación en formato Given-When-Then. Lo revisa y aprueba una persona.
2. **Capa 2** — el contrato se convierte en una o más unidades de trabajo con responsable asignado.
3. **Capa 4 (primer paso)** — los escenarios se traducen a tests de aceptación ejecutables **que fallan**. Este paso ocurre *antes* de la ejecución, y es lo que hace la separación juez/ejecutor real y no declarativa.
4. **Capa 3** — el agente implementa el mínimo necesario para pasar los tests, usando TDD a nivel unitario para el diseño interno.
5. **Capa 4 (cierre)** — CI corre aceptación y unitarios. Los gates bloquean el merge si algo falla.
6. **Capa 1 (archivado)** — el delta se absorbe en el estado vigente.

![Flujo SDD + TDD en seis pasos sobre los cuatro carriles: contrato con escenarios (capa 1), unidades de trabajo (capa 2), tests de aceptación que fallan escritos por el juez (capa 4), implementación mínima con TDD unitario por el ejecutor (capa 3), CI en verde con gates bloqueantes (capa 4) y archivado del delta (capa 1)](assets/flujo-sdd-tdd.svg)

**Por qué esta combinación específicamente:** la spec es la rienda; TDD es el mecanismo que la sostiene. Sin spec, TDD verifica bien la cosa equivocada. Sin TDD, la spec deriva silenciosamente durante la implementación. Código que se envía sin spec ni suite de tests se ve bien hasta el tercer sprint, cuando la deriva de comportamiento se acumula y refactorizar se convierte en arqueología.

**La regla que hace que no colapse:** los tests de aceptación del paso 3 los escribe una persona, o los escribe un agente distinto del que implementa y los revisa una persona. Si el mismo agente hace 3 y 4, volviste al circuito cerrado.

### EDD — Evaluation-driven development

**Qué es:** la adaptación del ciclo test-driven a componentes cuyo comportamiento no es determinista, como un LLM o un agente. En lugar de asserts binarios, se definen *evals*: conjuntos de casos representativos con métricas — exactitud, adherencia a instrucciones, calidad juzgada por otro modelo o por personas — que se corren de forma continua, antes y después de cada despliegue, para detectar regresiones cuando cambia el modelo, el prompt o los datos.

**Dónde vive:** capa 4, extendida más allá del merge.

Relevante sólo si lo que estás construyendo *incluye* componentes de IA. TDD y BDD asumen que una vez que el software pasa los tests, sigue siendo confiable — un supuesto válido para sistemas deterministas. Los componentes con LLM evolucionan con cambios de modelo, actualizaciones de conocimiento y variaciones de contexto, y exhiben comportamientos emergentes que ningún caso de test estático anticipa.

**Qué agrega:** evaluación continua post-despliegue, con métricas sobre dimensiones que no se capturan con asserts — coherencia de razonamiento, adherencia a restricciones, calidad de output.

**Cuándo incorporarlo:** si tu producto tiene un agente adentro, la capa 4 necesita este componente además de los tests tradicionales. Si sólo usás agentes *para* construir software determinista, no lo necesitás.

---

## Guía de adopción

**Si venís de vibe coding:** agregá primero la capa 4. Tests de aceptación antes que specs. Es el cambio con mejor relación esfuerzo/beneficio y el que hace visible el problema.

**Si venís de issue-driven:** agregá la capa 1 y adelgazá los issues. Migrá la sustancia técnica del tracker al repo.

**Si ya hacés SDD:** revisá si tus criterios de aceptación son ejecutables o son prosa. Si son prosa, tenés una capa 4 nominal.

**Si ya hacés TDD:** agregá la capa 1 para las decisiones que los tests no capturan — alcance, restricciones arquitectónicas, razones de diseño.

**Orden de implementación sugerido:** capa 4 → capa 1 → capa 2 → optimizar capa 3. La capa 3 es la última porque es la que menos importa y la que más va a cambiar.

![Orden de adopción sugerido: primero la capa 4 (hace visible el problema), después la capa 1 (fija la fuente de verdad), luego la capa 2 (coordina sin absorber la sustancia) y por último la capa 3 (la que menos importa y más cambia)](assets/orden-de-adopcion.svg)

---

## Diagnóstico

Cuatro fallas, cada una identificable por qué capa se salió de lugar:


| Síntoma                                          | Capa desplazada                | Corrección                                 |
| ------------------------------------------------ | ------------------------------ | ------------------------------------------ |
| El conocimiento del proyecto vive en el tracker  | Sustancia migró de la 1 a la 2 | Mover contenido al repo, dejar referencias |
| Los tests siempre pasan, los bugs siempre llegan | La 3 escribe la 4              | Separar quién escribe el criterio          |
| La spec dice una cosa, el sistema hace otra      | La 1 no se archiva             | Instituir el paso de cierre del ciclo      |
| Los PRs se aprueban sin leer                     | Granularidad rota              | Reducir el tamaño de la unidad de trabajo  |


**Indicador de salud, en una frase:** si una persona nueva puede entender qué hace el sistema leyendo únicamente las capas 1 y 4, el esquema está funcionando.

---

## Referencias

- OpenSpec — [https://github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)
- GitHub Spec Kit — [https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- Andrej Karpathy, origen del término *vibe coding* — [https://x.com/karpathy/status/1886192184808149383](https://x.com/karpathy/status/1886192184808149383)
- Dan North, *Introducing BDD* — [https://dannorth.net/introducing-bdd/](https://dannorth.net/introducing-bdd/)
- Martin Fowler, sobre TDD dentro del loop del agente — [https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html)
- Augment Code, sobre la combinación spec + TDD — [https://www.augmentcode.com/guides/spec-tdd-shippable-ai-generated-code](https://www.augmentcode.com/guides/spec-tdd-shippable-ai-generated-code)
- Evaluation-Driven Development para agentes LLM — [https://arxiv.org/pdf/2411.13768](https://arxiv.org/pdf/2411.13768)
- Taxonomía de frameworks para agentes de desarrollo — [https://arxiv.org/pdf/2606.04967](https://arxiv.org/pdf/2606.04967)

