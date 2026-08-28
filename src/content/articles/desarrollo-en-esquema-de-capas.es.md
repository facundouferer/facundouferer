---
title: 'Desarrollo con agentes de IA: un esquema de cuatro capas'
slug: 'desarrollo-en-esquema-de-capas'
date: 2026-08-27
author: 'Facundo Uferer'
category: 'AI Engineering'
tags:
  - AI Agents
  - Spec-Driven Development
  - TDD
  - Arquitectura
excerpt: 'El problema no es que los agentes escriban mal código. Es que a los tres meses nadie puede reconstruir por qué el sistema hace lo que hace. Cuatro capas, cuatro reglas de acoplamiento y cómo se acoplan las metodologías.'
readingTime: 18
lang: 'es'
published: true
featured: true
---

![Esquema de cuatro capas para desarrollo con agentes de IA](/img/articles/desarrollo-esquema-de-capas.svg)

Documento de referencia para equipos que incorporan agentes de IA al desarrollo de proyectos grandes, de larga vida y con varias personas.

## Por qué un esquema de capas

El problema no es que los agentes escriban mal código. Escriben razonablemente bien. El problema aparece a los tres meses, cuando nadie puede reconstruir por qué el sistema hace lo que hace, y las decisiones arquitectónicas quedaron sepultadas en sesiones de chat que ya no existen.

La causa es siempre la misma: **una sola herramienta terminó cubriendo responsabilidades que deberían estar separadas**. El tracker contiene la especificación, la especificación contiene el plan de tareas, el agente escribe sus propios criterios de aceptación, y el resultado es un sistema donde no hay ninguna fuente de verdad que se pueda auditar.

Este esquema separa cuatro responsabilidades y define reglas de acoplamiento entre ellas. Es independiente de qué agente, qué modelo o qué framework uses — esos son detalles de una sola capa, la más reemplazable.

## Parte 1 — Las cuatro capas

<figure class="diagram">
<svg viewBox="0 0 720 400" role="img" aria-labelledby="d-capas-t">
<title id="d-capas-t">Las cuatro capas: intención con autoridad máxima, coordinación, ejecución y verificación con poder de veto</title>
<defs><marker id="ar-capas" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-capas-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/></marker></defs>
<rect x="0" y="10" width="560" height="76" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<circle cx="38" cy="48" r="19" fill="var(--color-accent)"/>
<text x="38" y="55" font-size="17" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="72" y="42" font-size="16" font-weight="700" fill="var(--color-accent-700)">Intención</text>
<text x="72" y="66" font-size="12.5" fill="var(--color-text)">El contrato: qué debe hacer el sistema y por qué. Vive en el repo. Dueño humano.</text>
<text x="580" y="42" font-size="12" font-weight="700" fill="var(--color-accent-700)">AUTORIDAD MÁXIMA</text>
<text x="580" y="64" font-size="11.5" fill="var(--color-neutral-700)">sobrevive al proyecto</text>
<line x1="38" y1="90" x2="38" y2="106" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-capas)"/>
<rect x="0" y="112" width="560" height="76" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<circle cx="38" cy="150" r="19" fill="var(--color-neutral-600)"/>
<text x="38" y="157" font-size="17" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">2</text>
<text x="72" y="144" font-size="16" font-weight="700" fill="var(--color-neutral-800)">Coordinación</text>
<text x="72" y="168" font-size="12.5" fill="var(--color-text)">Quién hace qué, en qué orden. Vive fuera del repo. Referencia al contrato, no lo copia.</text>
<text x="580" y="152" font-size="11.5" fill="var(--color-neutral-700)">sobrevive al sprint</text>
<line x1="38" y1="192" x2="38" y2="208" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-capas)"/>
<rect x="0" y="214" width="560" height="76" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="7 6"/>
<circle cx="38" cy="252" r="19" fill="var(--color-neutral-600)"/>
<text x="38" y="259" font-size="17" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">3</text>
<text x="72" y="246" font-size="16" font-weight="700" fill="var(--color-neutral-800)">Ejecución</text>
<text x="72" y="270" font-size="12.5" fill="var(--color-text)">La traducción de contrato a diff. Deliberadamente desechable. Ante una duda, no adivina.</text>
<text x="580" y="254" font-size="11.5" fill="var(--color-neutral-700)">sobrevive a la sesión</text>
<line x1="38" y1="294" x2="38" y2="310" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-capas)"/>
<rect x="0" y="316" width="560" height="76" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<circle cx="38" cy="354" r="19" fill="var(--color-accent-2-700)"/>
<text x="38" y="361" font-size="17" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">4</text>
<text x="72" y="348" font-size="16" font-weight="700" fill="var(--color-accent-2-800)">Verificación</text>
<text x="72" y="372" font-size="12.5" fill="var(--color-text)">La prueba de que el diff satisface el contrato. Vive en el repo, junto al código.</text>
<text x="580" y="348" font-size="12" font-weight="700" fill="var(--color-accent-2-800)">PODER DE VETO</text>
<text x="580" y="370" font-size="11.5" fill="var(--color-neutral-700)">sobrevive al proyecto</text>
<path d="M700 340 L716 340 L716 48 L700 48" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" marker-end="url(#ar-capas-v)"/>
<text x="694" y="200" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)" transform="rotate(-90 694 200)" text-anchor="middle">la verificación corrige el contrato</text>
</svg>
<figcaption>La autoridad baja; la corrección sube. La capa 3 es la única desechable, y es también la única que cambia de herramienta cada seis meses.</figcaption>
</figure>

### Capa 1 · Intención

**Qué es:** el contrato. Qué debe hacer el sistema y por qué.

**Dos artefactos distintos:**

- *Estado vigente* — lo que el sistema hace hoy. Es descriptivo y siempre verdadero.
- *Propuesta de cambio* — el delta que se quiere introducir. Es prescriptivo y temporal.

Confundirlos es el error más común. Si mezclás ambos en un solo documento, en seis meses no vas a poder distinguir lo que el sistema hace de lo que alguien alguna vez propuso que hiciera.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-estado-t">
<title id="d-estado-t">Estado vigente contra propuesta de cambio: descriptivo y permanente contra prescriptivo y temporal</title>
<defs><marker id="ar-estado" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="20" width="330" height="176" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="22" y="48" font-size="15" font-weight="700" fill="var(--color-accent-700)">Estado vigente</text>
<text x="22" y="70" font-size="12" font-weight="700" fill="var(--color-neutral-800)">Lo que el sistema hace HOY</text>
<text x="22" y="96" font-size="12.5" fill="var(--color-text)">· descriptivo</text>
<text x="22" y="118" font-size="12.5" fill="var(--color-text)">· siempre verdadero</text>
<text x="22" y="140" font-size="12.5" fill="var(--color-text)">· permanente</text>
<rect x="22" y="152" width="286" height="30" rx="10" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="165" y="172" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">si querés saber qué hace, leé acá</text>
<rect x="390" y="20" width="330" height="176" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-width="2" stroke-dasharray="7 6"/>
<text x="412" y="48" font-size="15" font-weight="700" fill="var(--color-neutral-800)">Propuesta de cambio</text>
<text x="412" y="70" font-size="12" font-weight="700" fill="var(--color-neutral-800)">El delta que se quiere introducir</text>
<text x="412" y="96" font-size="12.5" fill="var(--color-text)">· prescriptiva</text>
<text x="412" y="118" font-size="12.5" fill="var(--color-text)">· temporal</text>
<rect x="412" y="130" width="86" height="26" rx="9" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="455" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">ADDED</text>
<rect x="504" y="130" width="96" height="26" rx="9" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="552" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">MODIFIED</text>
<rect x="606" y="130" width="98" height="26" rx="9" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="655" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">REMOVED</text>
<text x="412" y="176" font-size="12" font-weight="700" fill="var(--color-neutral-700)">vive sólo hasta que el ciclo cierra</text>
<path d="M388 108 L 336 108" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-estado)"/>
<text x="362" y="98" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">se absorbe</text>
<rect x="0" y="218" width="720" height="66" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="22" y="244" font-size="13" font-weight="700" fill="var(--color-accent-2-800)">Al cerrar el ciclo: el delta se absorbe en el estado vigente y la propuesta se archiva.</text>
<text x="22" y="268" font-size="12.5" fill="var(--color-text)">El paso que casi todos saltean. Sin él, la capa 1 se vuelve un cementerio de propuestas contradictorias.</text>
</svg>
<figcaption>Dos documentos, dos naturalezas. Mezclarlos es lo que hace que a los seis meses nadie sepa si una línea describe el sistema o sólo una intención vieja.</figcaption>
</figure>

**Dónde vive:** en el repositorio, versionado, revisado por PR como cualquier cambio de código.

**Quién es dueño:** una persona. Siempre. Un agente puede redactar un borrador, pero la aceptación es humana.

**Autoridad:** máxima. Ninguna otra capa puede contradecirla sin pasar por una revisión explícita.

### Capa 2 · Coordinación

**Qué es:** quién hace qué, en qué orden, bloqueado por qué.

**Contenido mínimo de una unidad de trabajo:** identificador, referencia al contrato correspondiente (no una copia), responsable humano y estado.

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

## Las cuatro reglas de acoplamiento

| Regla | Enunciado | Qué previene |
| --- | --- | --- |
| **Direccionalidad** | Cada capa referencia hacia arriba, nunca duplica | Cuatro versiones de la verdad, ninguna autoritativa |
| **Separación juez/ejecutor** | El criterio lo escribe una persona, antes, en la capa 1 | Circuito cerrado sobre sí mismo |
| **Persistencia asimétrica** | Capas 1 y 4 sobreviven al proyecto; la 2, al sprint; la 3, a la sesión | Conocimiento crítico en artefactos efímeros |
| **Granularidad alineada** | Un contrato = una unidad = un diff revisable = un set de evidencia | Review imposible, trazabilidad perdida |

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-reglas-t">
<title id="d-reglas-t">Las cuatro reglas de acoplamiento entre capas</title>
<defs><marker id="ar-reglas" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="12" width="348" height="146" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="40" font-size="14" font-weight="700" fill="var(--color-accent-700)">1 · Direccionalidad</text>
<text x="20" y="62" font-size="12" fill="var(--color-text)">Cada capa referencia hacia arriba, nunca duplica.</text>
<rect x="20" y="74" width="54" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="47" y="92" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">4</text>
<path d="M78 87 L 100 87" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-reglas)"/>
<rect x="104" y="74" width="54" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="131" y="92" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">3</text>
<path d="M162 87 L 184 87" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-reglas)"/>
<rect x="188" y="74" width="54" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="215" y="92" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">2</text>
<path d="M246 87 L 268 87" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-reglas)"/>
<rect x="272" y="74" width="54" height="26" rx="9" fill="var(--color-accent)" stroke="var(--color-accent-700)"/>
<text x="299" y="92" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="20" y="126" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">Previene: cuatro versiones de la verdad,</text>
<text x="20" y="145" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">ninguna autoritativa.</text>
<rect x="372" y="12" width="348" height="146" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="392" y="40" font-size="14" font-weight="700" fill="var(--color-accent-2-800)">2 · Separación juez/ejecutor</text>
<text x="392" y="62" font-size="12" fill="var(--color-text)">El criterio lo escribe una persona, antes.</text>
<rect x="392" y="74" width="140" height="30" rx="10" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="462" y="94" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">quien juzga</text>
<rect x="556" y="74" width="140" height="30" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="6 5"/>
<text x="626" y="94" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">quien ejecuta</text>
<text x="544" y="94" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">≠</text>
<text x="392" y="126" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">Previene: un circuito cerrado sobre sí</text>
<text x="392" y="145" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">mismo que no verifica nada.</text>
<rect x="0" y="176" width="348" height="152" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="20" y="204" font-size="14" font-weight="700" fill="var(--color-neutral-800)">3 · Persistencia asimétrica</text>
<rect x="20" y="216" width="94" height="26" rx="9" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-dasharray="6 5"/>
<text x="67" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">3: sesión</text>
<rect x="120" y="216" width="94" height="26" rx="9" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="167" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">2: sprint</text>
<rect x="220" y="216" width="108" height="26" rx="9" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="274" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">1 y 4: proyecto</text>
<text x="20" y="266" font-size="12" fill="var(--color-text)">Lo que dura más guarda lo que importa más.</text>
<text x="20" y="296" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">Previene: conocimiento crítico atrapado</text>
<text x="20" y="315" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">en artefactos efímeros.</text>
<rect x="372" y="176" width="348" height="152" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="392" y="204" font-size="14" font-weight="700" fill="var(--color-neutral-800)">4 · Granularidad alineada</text>
<rect x="392" y="216" width="74" height="26" rx="9" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="429" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">contrato</text>
<text x="474" y="234" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">=</text>
<rect x="484" y="216" width="66" height="26" rx="9" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="517" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">unidad</text>
<text x="558" y="234" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">=</text>
<rect x="568" y="216" width="56" height="26" rx="9" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="596" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">diff</text>
<text x="632" y="234" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">=</text>
<rect x="642" y="216" width="76" height="26" rx="9" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="680" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">evidencia</text>
<text x="392" y="266" font-size="12" fill="var(--color-text)">Si uno crece, el review deja de ser posible.</text>
<text x="392" y="296" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">Previene: PRs que se aprueban sin leer y</text>
<text x="392" y="315" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">trazabilidad perdida.</text>
</svg>
<figcaption>Las cuatro reglas no son estilo: cada una previene una falla concreta y observable, y el apartado de diagnóstico al final del artículo las usa al revés, como síntoma.</figcaption>
</figure>

### El ciclo

**Ida:** se propone un delta → se acuerda entre humanos → se convierte en unidad de trabajo → un agente lo ejecuta → la evidencia lo valida.

**Cierre:** el delta se absorbe en el estado vigente y la propuesta se archiva. Este paso es el que casi todos saltean, y es el que evita que la capa 1 se convierta en un cementerio de propuestas contradictorias.

**Vuelta:** hay dos caminos de retorno.

- *Desde verificación* — si la evidencia contradice el contrato, gana la evidencia y el contrato se corrige. Nunca al revés.
- *Desde ejecución* — si el agente encuentra una ambigüedad, sube. No resuelve.

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-ciclo-t">
<title id="d-ciclo-t">El ciclo completo: ida, cierre y las dos vueltas</title>
<defs><marker id="ar-ciclo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-ciclo-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/></marker><marker id="ar-ciclo-n" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker></defs>
<text x="2" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">IDA</text>
<rect x="0" y="30" width="126" height="58" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="63" y="55" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">propuesta</text>
<text x="63" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">de delta</text>
<path d="M128 59 L 148 59" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-ciclo)"/>
<rect x="152" y="30" width="126" height="58" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="215" y="55" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">acuerdo</text>
<text x="215" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">entre humanos</text>
<path d="M280 59 L 300 59" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-ciclo)"/>
<rect x="304" y="30" width="126" height="58" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="367" y="55" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">unidad</text>
<text x="367" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">de trabajo</text>
<path d="M432 59 L 452 59" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-ciclo)"/>
<rect x="456" y="30" width="126" height="58" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="6 5"/>
<text x="519" y="55" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">el agente</text>
<text x="519" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">ejecuta</text>
<path d="M584 59 L 604 59" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-ciclo)"/>
<rect x="608" y="30" width="112" height="58" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="664" y="55" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">la evidencia</text>
<text x="664" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">valida</text>
<text x="2" y="130" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">CIERRE</text>
<rect x="0" y="140" width="720" height="52" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="22" y="164" font-size="13" font-weight="700" fill="var(--color-accent-700)">El delta se absorbe en el estado vigente y la propuesta se archiva.</text>
<text x="22" y="184" font-size="11.5" fill="var(--color-text)">Es el paso que casi todos saltean. Sin él la capa 1 acumula propuestas que se contradicen entre sí.</text>
<text x="2" y="228" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">VUELTA — dos caminos, y ninguno es opcional</text>
<rect x="0" y="238" width="348" height="84" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="20" y="264" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">Desde verificación</text>
<path d="M20 276 L 84 276" stroke="var(--color-accent-2-600)" stroke-width="2.5" marker-end="url(#ar-ciclo-v)"/>
<text x="20" y="298" font-size="12" fill="var(--color-text)">Si la evidencia contradice al contrato,</text>
<text x="20" y="316" font-size="12" font-weight="700" fill="var(--color-accent-2-800)">gana la evidencia. Nunca al revés.</text>
<rect x="372" y="238" width="348" height="84" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="392" y="264" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">Desde ejecución</text>
<path d="M392 276 L 456 276" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-ciclo-n)"/>
<text x="392" y="298" font-size="12" fill="var(--color-text)">Si el agente encuentra una ambigüedad,</text>
<text x="392" y="316" font-size="12" font-weight="700" fill="var(--color-neutral-800)">sube. No resuelve.</text>
</svg>
<figcaption>El cierre es el paso invisible: nadie lo extraña hasta que la capa 1 ya se volvió inservible. Conviene tratarlo como parte del merge, no como tarea aparte.</figcaption>
</figure>

## Parte 2 — Herramientas por capa

Las herramientas cambian rápido; las capas no. Esta sección se desactualiza antes que el resto del artículo, y ese es exactamente el punto: si tu proceso depende de una herramienta específica, migrar te cuesta el proceso entero.

<figure class="diagram">
<svg viewBox="0 0 720 290" role="img" aria-labelledby="d-tools-t">
<title id="d-tools-t">Categorías de herramientas por capa y velocidad de rotación de cada una</title>
<rect x="0" y="14" width="720" height="60" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<circle cx="30" cy="44" r="15" fill="var(--color-accent)"/>
<text x="30" y="50" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="58" y="40" font-size="13" font-weight="700" fill="var(--color-accent-700)">Frameworks de especificación versionada</text>
<text x="58" y="62" font-size="12" fill="var(--color-text)">OpenSpec · Spec Kit · BMAD · Kiro · markdown propio  +  AGENTS.md / CLAUDE.md en la raíz</text>
<text x="712" y="48" font-size="11" text-anchor="end" fill="var(--color-neutral-700)">rota poco</text>
<rect x="0" y="82" width="720" height="60" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<circle cx="30" cy="112" r="15" fill="var(--color-neutral-600)"/>
<text x="30" y="118" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">2</text>
<text x="58" y="108" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Trackers con soporte para agentes</text>
<text x="58" y="130" font-size="12" fill="var(--color-text)">GitHub Issues · Linear · Jira — el criterio no es la funcionalidad, es quién más participa</text>
<text x="712" y="116" font-size="11" text-anchor="end" fill="var(--color-neutral-700)">rota poco</text>
<rect x="0" y="150" width="720" height="60" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-width="2" stroke-dasharray="7 6"/>
<circle cx="30" cy="180" r="15" fill="var(--color-neutral-600)"/>
<text x="30" y="186" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">3</text>
<text x="58" y="176" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Harness de agente — CLI, IDE o cloud</text>
<text x="58" y="198" font-size="12" fill="var(--color-text)">Elegila por ergonomía del equipo, no por benchmarks. Es la capa más reemplazable de las cuatro.</text>
<text x="712" y="184" font-size="11" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">ROTA MUCHO</text>
<rect x="0" y="218" width="720" height="60" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<circle cx="30" cy="248" r="15" fill="var(--color-accent-2-700)"/>
<text x="30" y="254" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">4</text>
<text x="58" y="244" font-size="13" font-weight="700" fill="var(--color-accent-2-800)">Frameworks de test, análisis estático y CI</text>
<text x="58" y="266" font-size="12" fill="var(--color-text)">Cucumber · Playwright · pytest · Vitest · linters · Actions — con gates bloqueantes, no informativos</text>
<text x="712" y="252" font-size="11" text-anchor="end" fill="var(--color-neutral-700)">rota poco</text>
</svg>
<figcaption>Las tres capas que importan rotan despacio. La que todo el mundo discute —qué agente usar— es justamente la que hay que poder cambiar sin costo.</figcaption>
</figure>

### Capa 1 · Intención

**Categoría:** frameworks de especificación versionada.

| Herramienta | Perfil | Notas |
| --- | --- | --- |
| **OpenSpec** | Brownfield, liviano | Separa estado vigente de propuestas con marcadores delta (ADDED/MODIFIED/REMOVED). Genera artefactos compactos, fáciles de revisar. Sus *stores* permiten specs compartidas entre repos. |
| **GitHub Spec Kit** | Greenfield, estructurado | Más exhaustivo y más verboso — genera aproximadamente el triple de contenido que OpenSpec para el mismo cambio. Requiere Python. |
| **BMAD-METHOD** | Multi-equipo, ceremonioso | Simula un equipo ágil completo con 12+ agentes especializados. Se justifica sólo a escala grande. |
| **Kiro** | IDE completo | Integra las cuatro capas en un solo entorno. Menor fricción inicial, mayor lock-in. |
| **Documentos propios** | Cualquiera | Un directorio de markdown con convenciones claras cubre el 80% del valor. No subestimes esta opción. |

**Requisito mínimo, independiente de la herramienta:** un archivo de convenciones en la raíz del repositorio (`AGENTS.md` o `CLAUDE.md`) que cualquier agente lea al iniciar. Esto es lo que hace portable el resto.

### Capa 2 · Coordinación

**Categoría:** trackers con soporte para agentes.

| Herramienta | Fortaleza | Límite |
| --- | --- | --- |
| **GitHub Issues** | Loops cortos entre idea, código, review y merge; muy programable vía Actions y GraphQL | Es una capa de coordinación developer-native, no un sistema de trabajo transversal a toda la organización |
| **Linear** | Trata a los agentes como participantes de primera clase: asignación directa, contexto del issue al lanzar la herramienta de código, soporte MCP | Vive fuera del repositorio, sin acceso nativo al código |
| **Jira** | Modelo administrativo y gobernanza para organizaciones grandes | Peso de configuración considerable |

El criterio de elección no es la funcionalidad sino **quién más tiene que participar**. Si sólo hay desarrolladores, Issues alcanza. Si hay diseño, producto o gestión involucrados, un tracker developer-native los excluye.

### Capa 3 · Ejecución

**Categoría:** harness de agente.

- **CLI:** Claude Code, Codex CLI, Gemini CLI, Aider
- **IDE:** Cursor, Cline, Roo Code, Copilot
- **Cloud/asíncronos:** agentes que toman un issue y devuelven un PR

Esta es la capa que más rápido rota y donde menos hay que invertir en integración profunda. Elegila por ergonomía del equipo, no por benchmarks. Los mejores agentes resuelven hoy entre 60% y 70% de SWE-bench Verified, pero ese benchmark usa issues curados con criterios de aceptación explícitos — condiciones que las tareas reales casi nunca tienen. El número dice más sobre la calidad de tu capa 1 que sobre el agente.

### Capa 4 · Verificación

**Categoría:** frameworks de test y automatización.

| Nivel | Herramientas típicas | Deriva de |
| --- | --- | --- |
| Aceptación | Cucumber, Behave, Playwright, contract testing | Criterios de la capa 1 |
| Unitario | pytest, Vitest, JUnit, Go testing | Diseño de la capa 3 |
| Estático | linters, type checkers, análisis de seguridad | Convenciones del repo |
| Orquestación | GitHub Actions, GitLab CI, y gates de merge | — |

**Regla de configuración:** los gates deben ser bloqueantes, no informativos. Un check que se puede mergear en rojo no es verificación, es decoración.

## Parte 3 — Cómo se acoplan las metodologías

Ninguna metodología cubre las cuatro capas. Cada una se concentra en una o dos y asume el resto. Entender **dónde pone el peso cada una** es lo que permite combinarlas sin superposición ni huecos.

### Matriz de cobertura

| Metodología | Capa 1 | Capa 2 | Capa 3 | Capa 4 |
| --- | :---: | :---: | :---: | :---: |
| Vibe coding | — | — | ●●● | — |
| Issue-driven | ○ | ●●● | ●● | ○ |
| SDD (spec-driven) | ●●● | ○ | ●● | ● |
| TDD (test-driven) | — | — | ●● | ●●● |
| BDD / ATDD | ●● | — | ● | ●●● |
| **SDD + TDD** | ●●● | ○ | ●● | ●●● |
| EDD (evaluation-driven) | ● | — | ● | ●●● |

●●● foco principal · ●● participación fuerte · ● participación parcial · ○ marginal · — no cubre

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-mapa-t">
<title id="d-mapa-t">Mapa de calor de cobertura: siete metodologías contra las cuatro capas</title>
<text x="200" y="26" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Capa 1</text>
<text x="316" y="26" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Capa 2</text>
<text x="432" y="26" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Capa 3</text>
<text x="548" y="26" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Capa 4</text>
<text x="0" y="56" font-size="12.5" fill="var(--color-text)">Vibe coding</text>
<rect x="142" y="38" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<rect x="258" y="38" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<rect x="374" y="38" width="112" height="26" rx="8" fill="var(--color-accent-600)"/>
<text x="430" y="56" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">foco</text>
<rect x="490" y="38" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<text x="0" y="90" font-size="12.5" fill="var(--color-text)">Issue-driven</text>
<rect x="142" y="72" width="112" height="26" rx="8" fill="var(--color-accent-200)"/>
<rect x="258" y="72" width="112" height="26" rx="8" fill="var(--color-accent-600)"/>
<text x="314" y="90" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">foco</text>
<rect x="374" y="72" width="112" height="26" rx="8" fill="var(--color-accent-400)"/>
<rect x="490" y="72" width="112" height="26" rx="8" fill="var(--color-accent-200)"/>
<text x="0" y="124" font-size="12.5" fill="var(--color-text)">SDD</text>
<rect x="142" y="106" width="112" height="26" rx="8" fill="var(--color-accent-600)"/>
<text x="198" y="124" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">foco</text>
<rect x="258" y="106" width="112" height="26" rx="8" fill="var(--color-accent-200)"/>
<rect x="374" y="106" width="112" height="26" rx="8" fill="var(--color-accent-400)"/>
<rect x="490" y="106" width="112" height="26" rx="8" fill="var(--color-accent-300)"/>
<text x="0" y="158" font-size="12.5" fill="var(--color-text)">TDD</text>
<rect x="142" y="140" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<rect x="258" y="140" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<rect x="374" y="140" width="112" height="26" rx="8" fill="var(--color-accent-2-400)"/>
<rect x="490" y="140" width="112" height="26" rx="8" fill="var(--color-accent-2-700)"/>
<text x="546" y="158" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">foco</text>
<text x="0" y="192" font-size="12.5" fill="var(--color-text)">BDD / ATDD</text>
<rect x="142" y="174" width="112" height="26" rx="8" fill="var(--color-accent-400)"/>
<rect x="258" y="174" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<rect x="374" y="174" width="112" height="26" rx="8" fill="var(--color-accent-2-300)"/>
<rect x="490" y="174" width="112" height="26" rx="8" fill="var(--color-accent-2-700)"/>
<text x="546" y="192" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">foco</text>
<rect x="-8" y="208" width="620" height="34" rx="10" fill="var(--color-accent-100)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="0" y="230" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">SDD + TDD</text>
<rect x="142" y="212" width="112" height="26" rx="8" fill="var(--color-accent-600)"/>
<text x="198" y="230" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">foco</text>
<rect x="258" y="212" width="112" height="26" rx="8" fill="var(--color-accent-200)"/>
<rect x="374" y="212" width="112" height="26" rx="8" fill="var(--color-accent-400)"/>
<rect x="490" y="212" width="112" height="26" rx="8" fill="var(--color-accent-2-700)"/>
<text x="546" y="230" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">foco</text>
<text x="0" y="272" font-size="12.5" fill="var(--color-text)">EDD</text>
<rect x="142" y="254" width="112" height="26" rx="8" fill="var(--color-accent-300)"/>
<rect x="258" y="254" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<rect x="374" y="254" width="112" height="26" rx="8" fill="var(--color-accent-2-300)"/>
<rect x="490" y="254" width="112" height="26" rx="8" fill="var(--color-accent-2-700)"/>
<text x="546" y="272" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">foco</text>
<text x="622" y="230" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">la única con</text>
<text x="622" y="246" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">foco en 1 y 4</text>
<text x="0" y="310" font-size="11.5" fill="var(--color-neutral-700)">Más saturado, más peso. Las celdas claras son participación parcial; las grises, no cubre.</text>
</svg>
<figcaption>Ninguna metodología cubre las cuatro capas sola. SDD + TDD es la única fila con foco principal en la 1 y en la 4 al mismo tiempo — que son, justamente, las dos que sobreviven al proyecto.</figcaption>
</figure>

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

| Variante | Quién escribe el test | Riesgo |
| --- | --- | --- |
| Humano escribe los tests | Persona | Bajo — pero es el cuello de botella |
| Checkpoint de revisión | Agente escribe, humano aprueba antes de implementar | Medio |
| Todo dentro del loop | Agente escribe test e implementación | **Alto** |

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

<figure class="diagram">
<svg viewBox="0 0 720 400" role="img" aria-labelledby="d-flujo-t">
<title id="d-flujo-t">El flujo SDD más TDD en seis pasos repartidos sobre los cuatro carriles de capa</title>
<defs><marker id="ar-flujo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="0" width="96" height="392" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="48" y="30" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">CAPA 1</text>
<text x="48" y="48" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">Intención</text>
<rect x="104" y="18" width="616" height="52" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<circle cx="130" cy="44" r="14" fill="var(--color-accent)"/>
<text x="130" y="49" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="154" y="40" font-size="13" font-weight="700" fill="var(--color-accent-700)">Contrato del cambio + escenarios Given-When-Then</text>
<text x="154" y="60" font-size="11.5" fill="var(--color-text)">Comportamiento esperado, alcance y criterios. Lo revisa y aprueba una persona.</text>
<line x1="130" y1="74" x2="130" y2="86" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-flujo)"/>
<rect x="104" y="90" width="616" height="46" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<circle cx="130" cy="113" r="14" fill="var(--color-neutral-600)"/>
<text x="130" y="118" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">2</text>
<text x="154" y="109" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Unidades de trabajo con responsable asignado</text>
<text x="154" y="128" font-size="11.5" fill="var(--color-text)">Capa 2 — el tracker apunta al contrato, no lo copia.</text>
<line x1="130" y1="140" x2="130" y2="152" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-flujo)"/>
<rect x="104" y="156" width="616" height="52" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<circle cx="130" cy="182" r="14" fill="var(--color-accent-2-700)"/>
<text x="130" y="187" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">3</text>
<text x="154" y="178" font-size="13" font-weight="700" fill="var(--color-accent-2-800)">Tests de aceptación que FALLAN — los escribe el juez</text>
<text x="154" y="198" font-size="11.5" fill="var(--color-text)">Capa 4, antes de ejecutar. Éste es el paso que hace la separación juez/ejecutor real.</text>
<line x1="130" y1="212" x2="130" y2="224" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-flujo)"/>
<rect x="104" y="228" width="616" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="7 6"/>
<circle cx="130" cy="254" r="14" fill="var(--color-neutral-600)"/>
<text x="130" y="259" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">4</text>
<text x="154" y="250" font-size="13" font-weight="700" fill="var(--color-neutral-800)">El agente implementa el mínimo para pasarlos</text>
<text x="154" y="270" font-size="11.5" fill="var(--color-text)">Capa 3 — con TDD unitario para el diseño interno. No toca los tests de aceptación.</text>
<line x1="130" y1="284" x2="130" y2="296" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-flujo)"/>
<rect x="104" y="300" width="616" height="46" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<circle cx="130" cy="323" r="14" fill="var(--color-accent-2-700)"/>
<text x="130" y="328" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">5</text>
<text x="154" y="319" font-size="13" font-weight="700" fill="var(--color-accent-2-800)">CI en verde, con gates bloqueantes</text>
<text x="154" y="338" font-size="11.5" fill="var(--color-text)">Capa 4 — aceptación y unitarios. Rojo no se mergea.</text>
<line x1="130" y1="350" x2="130" y2="362" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-flujo)"/>
<rect x="104" y="366" width="616" height="34" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<circle cx="130" cy="383" r="13" fill="var(--color-accent)"/>
<text x="130" y="388" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">6</text>
<text x="154" y="388" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">El delta se absorbe en el estado vigente y la propuesta se archiva.</text>
</svg>
<figcaption>El orden importa más que las herramientas: el paso 3 va antes que el 4, y lo escribe alguien distinto. Si el mismo agente hace los dos, volviste al circuito cerrado.</figcaption>
</figure>

**El flujo concreto, capa por capa:**

1. **Capa 1** — se escribe el contrato del cambio: comportamiento esperado, alcance, y los escenarios de aceptación en formato Given-When-Then. Lo revisa y aprueba una persona.
2. **Capa 2** — el contrato se convierte en una o más unidades de trabajo con responsable asignado.
3. **Capa 4 (primer paso)** — los escenarios se traducen a tests de aceptación ejecutables **que fallan**. Este paso ocurre *antes* de la ejecución, y es lo que hace la separación juez/ejecutor real y no declarativa.
4. **Capa 3** — el agente implementa el mínimo necesario para pasar los tests, usando TDD a nivel unitario para el diseño interno.
5. **Capa 4 (cierre)** — CI corre aceptación y unitarios. Los gates bloquean el merge si algo falla.
6. **Capa 1 (archivado)** — el delta se absorbe en el estado vigente.

**Por qué esta combinación específicamente:** la spec es la rienda; TDD es el mecanismo que la sostiene. Sin spec, TDD verifica bien la cosa equivocada. Sin TDD, la spec deriva silenciosamente durante la implementación. Código que se envía sin spec ni suite de tests se ve bien hasta el tercer sprint, cuando la deriva de comportamiento se acumula y refactorizar se convierte en arqueología.

**La regla que hace que no colapse:** los tests de aceptación del paso 3 los escribe una persona, o los escribe un agente distinto del que implementa y los revisa una persona. Si el mismo agente hace 3 y 4, volviste al circuito cerrado.

### EDD — Evaluation-driven development

**Qué es:** la adaptación del ciclo test-driven a componentes cuyo comportamiento no es determinista, como un LLM o un agente. En lugar de asserts binarios, se definen *evals*: conjuntos de casos representativos con métricas — exactitud, adherencia a instrucciones, calidad juzgada por otro modelo o por personas — que se corren de forma continua, antes y después de cada despliegue, para detectar regresiones cuando cambia el modelo, el prompt o los datos.

**Dónde vive:** capa 4, extendida más allá del merge.

Relevante sólo si lo que estás construyendo *incluye* componentes de IA. TDD y BDD asumen que una vez que el software pasa los tests, sigue siendo confiable — un supuesto válido para sistemas deterministas. Los componentes con LLM evolucionan con cambios de modelo, actualizaciones de conocimiento y variaciones de contexto, y exhiben comportamientos emergentes que ningún caso de test estático anticipa.

**Qué agrega:** evaluación continua post-despliegue, con métricas sobre dimensiones que no se capturan con asserts — coherencia de razonamiento, adherencia a restricciones, calidad de output.

**Cuándo incorporarlo:** si tu producto tiene un agente adentro, la capa 4 necesita este componente además de los tests tradicionales. Si sólo usás agentes *para* construir software determinista, no lo necesitás.

## Guía de adopción

**Si venís de vibe coding:** agregá primero la capa 4. Tests de aceptación antes que specs. Es el cambio con mejor relación esfuerzo/beneficio y el que hace visible el problema.

**Si venís de issue-driven:** agregá la capa 1 y adelgazá los issues. Migrá la sustancia técnica del tracker al repo.

**Si ya hacés SDD:** revisá si tus criterios de aceptación son ejecutables o son prosa. Si son prosa, tenés una capa 4 nominal.

**Si ya hacés TDD:** agregá la capa 1 para las decisiones que los tests no capturan — alcance, restricciones arquitectónicas, razones de diseño.

<figure class="diagram">
<svg viewBox="0 0 720 230" role="img" aria-labelledby="d-adopcion-t">
<title id="d-adopcion-t">Orden de adopción sugerido: capa 4, después capa 1, después capa 2 y por último capa 3</title>
<defs><marker id="ar-adop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="30" width="160" height="106" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<circle cx="34" cy="60" r="16" fill="var(--color-accent-2-700)"/>
<text x="34" y="66" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">4</text>
<text x="60" y="66" font-size="14" font-weight="700" fill="var(--color-accent-2-800)">Verificación</text>
<text x="20" y="94" font-size="11.5" fill="var(--color-text)">Primero, porque es lo</text>
<text x="20" y="112" font-size="11.5" fill="var(--color-text)">que hace visible el</text>
<text x="20" y="130" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">problema.</text>
<path d="M164 83 L 184 83" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-adop)"/>
<rect x="188" y="30" width="160" height="106" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<circle cx="222" cy="60" r="16" fill="var(--color-accent)"/>
<text x="222" y="66" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="248" y="66" font-size="14" font-weight="700" fill="var(--color-accent-700)">Intención</text>
<text x="208" y="94" font-size="11.5" fill="var(--color-text)">Después, para fijar</text>
<text x="208" y="112" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">la fuente de verdad</text>
<text x="208" y="130" font-size="11.5" fill="var(--color-text)">que la evidencia mide.</text>
<path d="M352 83 L 372 83" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-adop)"/>
<rect x="376" y="30" width="160" height="106" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<circle cx="410" cy="60" r="16" fill="var(--color-neutral-600)"/>
<text x="410" y="66" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">2</text>
<text x="436" y="66" font-size="14" font-weight="700" fill="var(--color-neutral-800)">Coordinación</text>
<text x="396" y="94" font-size="11.5" fill="var(--color-text)">Luego, para repartir</text>
<text x="396" y="112" font-size="11.5" fill="var(--color-text)">el trabajo sin absorber</text>
<text x="396" y="130" font-size="11.5" fill="var(--color-text)">la sustancia técnica.</text>
<path d="M540 83 L 560 83" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-adop)"/>
<rect x="564" y="30" width="156" height="106" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="7 6"/>
<circle cx="598" cy="60" r="16" fill="var(--color-neutral-600)"/>
<text x="598" y="66" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">3</text>
<text x="624" y="66" font-size="14" font-weight="700" fill="var(--color-neutral-800)">Ejecución</text>
<text x="584" y="94" font-size="11.5" fill="var(--color-text)">Al final, porque es la</text>
<text x="584" y="112" font-size="11.5" fill="var(--color-text)">que menos importa y</text>
<text x="584" y="130" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">la que más va a cambiar.</text>
<text x="2" y="176" font-size="12.5" fill="var(--color-text)">El orden es contraintuitivo a propósito: casi todos empiezan eligiendo agente, la última decisión que importa.</text>
<text x="2" y="204" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Indicador de salud: si alguien nuevo entiende qué hace el sistema leyendo sólo las capas 1 y 4, el esquema funciona.</text>
</svg>
<figcaption>Orden sugerido de implementación. La capa 3 va última porque es la que menos importa y la que más va a cambiar.</figcaption>
</figure>

**Orden de implementación sugerido:** capa 4 → capa 1 → capa 2 → optimizar capa 3. La capa 3 es la última porque es la que menos importa y la que más va a cambiar.

## Diagnóstico

Cuatro fallas, cada una identificable por qué capa se salió de lugar:

| Síntoma | Capa desplazada | Corrección |
| --- | --- | --- |
| El conocimiento del proyecto vive en el tracker | Sustancia migró de la 1 a la 2 | Mover contenido al repo, dejar referencias |
| Los tests siempre pasan, los bugs siempre llegan | La 3 escribe la 4 | Separar quién escribe el criterio |
| La spec dice una cosa, el sistema hace otra | La 1 no se archiva | Instituir el paso de cierre del ciclo |
| Los PRs se aprueban sin leer | Granularidad rota | Reducir el tamaño de la unidad de trabajo |

**Indicador de salud, en una frase:** si una persona nueva puede entender qué hace el sistema leyendo únicamente las capas 1 y 4, el esquema está funcionando.

## Referencias

- [OpenSpec](https://github.com/Fission-AI/OpenSpec)
- [GitHub Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [Andrej Karpathy, origen del término *vibe coding*](https://x.com/karpathy/status/1886192184808149383)
- [Dan North, *Introducing BDD*](https://dannorth.net/introducing-bdd/)
- [Martin Fowler, sobre TDD dentro del loop del agente](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html)
- [Augment Code, sobre la combinación spec + TDD](https://www.augmentcode.com/guides/spec-tdd-shippable-ai-generated-code)
- [Evaluation-Driven Development para agentes LLM](https://arxiv.org/pdf/2411.13768)
- [Taxonomía de frameworks para agentes de desarrollo](https://arxiv.org/pdf/2606.04967)
