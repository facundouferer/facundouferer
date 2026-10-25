---
title: 'Vertical Slice Architecture con IA: de la historia de usuario al código'
slug: 'vertical-slice-architecture-con-ia'
date: 2026-10-24
author: 'Facundo Uferer'
category: 'AI Engineering'
tags:
  - Vertical Slice Architecture
  - AI Agents
  - Software Architecture
  - User Stories
  - CQRS
excerpt: 'Cómo usar Vertical Slice Architecture para que la IA redacte historias, las convierta en issues e implemente cada una como una porción de código, con el desarrollador como orquestador.'
readingTime: 12
image: '/img/articles/vertical-slice-architecture-torta.png'
lang: 'es'
published: true
featured: false
---
## Introducción

La IA redacta las historias de usuario, las convierte en issues e implementa cada issue como una porción de código. El desarrollador deja de escribir cada línea y pasa a ser orquestador: define qué se construye, valida lo que produce la IA en cada paso y decide qué se integra. La clave es que una historia, una issue, una porción y un PR son la misma unidad de trabajo, del tamaño justo para que un agente la resuelva bien.

La mayoría de los proyectos se organizan por capas técnicas: `Controllers/`, `Services/`, `Repositories/`, `DTOs/` (un DTO, *Data Transfer Object*, es un objeto que solo transporta datos entre partes del sistema, sin lógica). Con esa estructura, cualquier cambio obliga al agente a leer y tocar cuatro o cinco carpetas llenas de código ajeno a la tarea.

VSA organiza el código por caso de uso. El agente recibe una tarea acotada, trabaja en una sola carpeta y entrega un cambio que el orquestador revisa en minutos.

## Qué es VSA

![Porción de torta con cuatro capas rotuladas: formulario, endpoint, handler y tabla](/img/articles/vertical-slice-architecture-torta.png)

De ahí el nombre: si el sistema es una torta de capas, una funcionalidad no es una capa entera sino una porción vertical que lleva un poco de cada una.

<figure class="diagram">
<svg viewBox="0 0 720 350" role="img" aria-labelledby="d-vsa-grid-t">
<title id="d-vsa-grid-t">Cuatro capas técnicas por cuatro funcionalidades; la porción "inscribir alumno" atraviesa las cuatro capas</title>
<text x="220" y="30" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">Crear alumno</text>
<text x="360" y="30" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Inscribir alumno</text>
<text x="500" y="30" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">Listar cursos</text>
<text x="640" y="30" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">Editar curso</text>
<rect x="150" y="44" width="560" height="54" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<rect x="150" y="102" width="560" height="54" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<rect x="150" y="160" width="560" height="54" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<rect x="150" y="218" width="560" height="54" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="138" y="77" font-size="13" font-weight="700" text-anchor="end" fill="var(--color-neutral-800)">Frontend</text>
<text x="138" y="135" font-size="13" font-weight="700" text-anchor="end" fill="var(--color-neutral-800)">Backend / API</text>
<text x="138" y="193" font-size="13" font-weight="700" text-anchor="end" fill="var(--color-neutral-800)">Controlador</text>
<text x="138" y="251" font-size="13" font-weight="700" text-anchor="end" fill="var(--color-neutral-800)">Base de datos</text>
<rect x="294" y="40" width="132" height="236" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="360" y="77" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">formulario</text>
<text x="360" y="135" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">endpoint</text>
<text x="360" y="193" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">handler</text>
<text x="360" y="251" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">tabla</text>
<rect x="300" y="288" width="120" height="24" rx="9" fill="var(--color-accent)"/>
<text x="360" y="304" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1 issue · 1 PR</text>
<rect x="150" y="331" width="36" height="10" rx="5" fill="var(--color-neutral-400)"/>
<text x="194" y="341" font-size="11.5" fill="var(--color-neutral-700)">Capa = corte horizontal</text>
<rect x="430" y="327" width="10" height="18" rx="5" fill="var(--color-accent)"/>
<text x="448" y="341" font-size="11.5" fill="var(--color-accent-700)">Porción = corte vertical, pantalla → base</text>
</svg>
<figcaption>Cada fila es una capa técnica; cada columna, una funcionalidad. Una porción toma un poco de cada capa, pero solo lo que esa funcionalidad necesita.</figcaption>
</figure>

Una porción vertical (*slice*) es un caso de uso completo con todo lo que necesita: endpoint, validación, lógica de negocio, acceso a datos, DTOs y tests. Jimmy Bogard, quien popularizó el enfoque, lo resume en un principio: minimizar el acoplamiento entre porciones y maximizarlo dentro de cada porción ([fuente](https://sessionize.com/s/jimmy-bogard/vertical-slice-architecture-effective-guardrails-f/185766)).

La diferencia se ve en la estructura de carpetas:

<figure class="diagram">
<svg viewBox="0 0 720 436" role="img" aria-labelledby="d-vsa-folders-t">
<title id="d-vsa-folders-t">Estructura por capas contra estructura por porciones: el caso de uso "inscribir alumno" repartido en cuatro carpetas o reunido en una</title>
<text x="0" y="22" font-size="15" font-weight="700" fill="var(--color-neutral-800)">Por capas</text>
<text x="340" y="22" font-size="12" font-weight="700" text-anchor="end" fill="var(--color-neutral-700)">4 carpetas para leer</text>
<text x="380" y="22" font-size="15" font-weight="700" fill="var(--color-accent-700)">Por porciones (VSA)</text>
<text x="720" y="22" font-size="12" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">1 carpeta para leer</text>
<rect x="0" y="40" width="340" height="74" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="14" y="62" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Controllers/</text>
<text x="14" y="82" font-size="12" fill="var(--color-neutral-700)">AlumnosController</text>
<rect x="14" y="90" width="190" height="20" rx="7" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="22" y="104" font-size="12" font-weight="700" fill="var(--color-accent-700)">InscripcionesController</text>
<rect x="0" y="122" width="340" height="74" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="14" y="144" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Services/</text>
<text x="14" y="164" font-size="12" fill="var(--color-neutral-700)">AlumnoService</text>
<rect x="14" y="172" width="190" height="20" rx="7" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="22" y="186" font-size="12" font-weight="700" fill="var(--color-accent-700)">InscripcionService</text>
<rect x="0" y="204" width="340" height="74" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="14" y="226" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Repositories/</text>
<text x="14" y="246" font-size="12" fill="var(--color-neutral-700)">AlumnoRepository</text>
<rect x="14" y="254" width="190" height="20" rx="7" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="22" y="268" font-size="12" font-weight="700" fill="var(--color-accent-700)">InscripcionRepository</text>
<rect x="0" y="286" width="340" height="74" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="14" y="308" font-size="13" font-weight="700" fill="var(--color-neutral-800)">DTOs/</text>
<text x="14" y="328" font-size="12" fill="var(--color-neutral-700)">AlumnoDto</text>
<rect x="14" y="336" width="190" height="20" rx="7" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="22" y="350" font-size="12" font-weight="700" fill="var(--color-accent-700)">InscripcionRequest</text>
<rect x="0" y="376" width="340" height="50" rx="14" fill="var(--color-neutral-300)" stroke="var(--color-divider)"/>
<text x="14" y="397" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Shared/</text>
<text x="14" y="415" font-size="11.5" fill="var(--color-neutral-700)">dominio · autenticación · conexión a la base</text>
<rect x="380" y="40" width="340" height="320" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="396" y="62" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Features/</text>
<rect x="396" y="78" width="308" height="66" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="410" y="100" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Alumnos/CrearAlumno/</text>
<text x="410" y="122" font-size="11.5" fill="var(--color-neutral-700)">request · handler · test_crear_alumno</text>
<rect x="616" y="86" width="76" height="20" rx="7" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="654" y="100" font-size="10.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">referencia</text>
<rect x="396" y="158" width="308" height="172" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="410" y="182" font-size="13" font-weight="700" fill="var(--color-accent-700)">Inscripciones/InscribirAlumno/</text>
<text x="410" y="208" font-size="12.5" fill="var(--color-text)">request</text>
<text x="410" y="230" font-size="12.5" fill="var(--color-text)">response</text>
<text x="410" y="252" font-size="12.5" fill="var(--color-text)">handler</text>
<text x="410" y="274" font-size="12.5" fill="var(--color-text)">test_inscribir</text>
<text x="410" y="310" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">todo el caso de uso en una carpeta</text>
<rect x="380" y="376" width="340" height="50" rx="14" fill="var(--color-neutral-300)" stroke="var(--color-divider)"/>
<text x="394" y="397" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Shared/</text>
<text x="394" y="415" font-size="11.5" fill="var(--color-neutral-700)">dominio · autenticación · conexión a la base</text>
</svg>
<figcaption>Lo resaltado es todo el código del caso de uso "inscribir alumno": repartido en cuatro carpetas a la izquierda, en una sola a la derecha. Para un agente, la derecha significa leer una carpeta en vez de cuatro.</figcaption>
</figure>

Tres reglas que el agente debe respetar y que conviene dejar escritas en el repositorio:

1. **Una porción = un caso de uso.** Un comando ("inscribir alumno") o una consulta ("listar alumnos"), al estilo CQRS (*Command Query Responsibility Segregation*: separar las operaciones que modifican datos, los comandos, de las que solo los leen, las consultas).
2. **Las porciones no se importan entre sí.** Lo que de verdad se comparte (entidades del dominio, autenticación, conexión a la base) va a `Shared/`.
3. **La duplicación es aceptable.** Dos porciones pueden tener DTOs parecidos. Es preferible a un DTO compartido que, al cambiar para un caso, rompe otro.

## Preparar el repositorio para trabajar con IA

Antes de asignar la primera issue a un agente, el repositorio tiene que dejar escritas las reglas que el agente no puede adivinar. Con VSA el código se ordena solo por convención, así que esa convención tiene que estar escrita y verificada automáticamente.

- Un archivo `AGENTS.md` en la raíz con las convenciones de porciones (o el archivo de instrucciones que lea el agente).
- Una porción de referencia completa, que el agente copie.
- La plantilla de issue en el repo (por ejemplo, `.github/ISSUE_TEMPLATE/porcion.md`), para que la IA la complete.
- Tests de arquitectura, generados por la IA, que fallen si una porción importa otra.
- CI que corra los tests y los tests de arquitectura en cada PR.
- Revisión de tests por IA: un segundo agente verifica que los tests cubran todos los criterios de la issue antes de la implementación; el orquestador resuelve solo lo que ese agente marque.
- Revisión periódica de `Shared/`: cuando la IA repite lo mismo en varias porciones, se extrae.

Ejemplo de `AGENTS.md`:

```markdown
# Convenciones
- Cada caso de uso vive en Features/<Módulo>/<Verbo><Sustantivo>/
- Archivos de una porción: request, response, handler y tests, con la
  extensión del lenguaje del proyecto
- Las porciones no se importan entre sí. Lo compartido va en Shared/.
- Porción de referencia: Features/Alumnos/CrearAlumno/
- Un PR = una issue = una porción.
- Escribí los tests antes del código, uno por criterio de aceptación.
- Los títulos de issue son verbos de caso de uso, nunca capas.
```

## Historias, issues y porciones: la misma unidad

Una buena historia de usuario ya es vertical: describe un resultado que el usuario obtiene, no una capa técnica. Con VSA, esa unidad pasa intacta por todo el proceso, y en cada nivel la IA produce el artefacto y el orquestador lo valida.

| Nivel | Ejemplo | Qué hace la IA | Qué valida el orquestador |
| --- | --- | --- | --- |
| Historia de usuario | Como docente, quiero inscribir un alumno a un curso para que acceda al aula. | La redacta desde notas, pedidos o el sistema actual | Que refleje la necesidad real; la prioridad |
| Issue | #42 Inscribir alumno a curso | La deriva de la historia, con criterios, carpeta y porción de referencia | Que sea una porción vertical y no una capa |
| Tests | Un test por criterio de aceptación | Los escribe antes del código; un segundo agente verifica que cubran los criterios | Solo lo que marque el agente revisor |
| Porción | `Features/Inscripciones/InscribirAlumno/` | La implementa copiando la porción de referencia | Lo hace el CI con tests de arquitectura |
| PR | `feature/42-inscribir-alumno`, una sola carpeta | Lo abre y corrige según comentarios | La revisión final y el merge |

<figure class="diagram">
<svg viewBox="0 0 720 200" role="img" aria-labelledby="d-vsa-unit-t">
<title id="d-vsa-unit-t">La misma unidad de trabajo pasa por historia, issue, tests, porción y PR; en cada paso la IA produce y el orquestador valida</title>
<defs><marker id="ar-vsa-unit" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker></defs>
<circle cx="6" cy="18" r="5" fill="var(--color-accent-2-600)"/>
<text x="18" y="22" font-size="11" font-weight="700" fill="var(--color-accent-2-800)">LA IA PRODUCE</text>
<text x="60" y="48" font-size="11.5" text-anchor="middle" fill="var(--color-text)">la redacta</text>
<text x="210" y="48" font-size="11.5" text-anchor="middle" fill="var(--color-text)">la deriva</text>
<text x="360" y="48" font-size="11.5" text-anchor="middle" fill="var(--color-text)">los escribe antes</text>
<text x="510" y="48" font-size="11.5" text-anchor="middle" fill="var(--color-text)">la implementa</text>
<text x="660" y="48" font-size="11.5" text-anchor="middle" fill="var(--color-text)">lo abre y corrige</text>
<line x1="60" y1="54" x2="60" y2="68" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="210" y1="54" x2="210" y2="68" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="360" y1="54" x2="360" y2="68" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="510" y1="54" x2="510" y2="68" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="660" y1="54" x2="660" y2="68" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-linecap="round"/>
<rect x="0" y="70" width="120" height="54" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="60" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Historia</text>
<text x="60" y="112" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">necesidad del usuario</text>
<line x1="124" y1="97" x2="146" y2="97" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-unit)"/>
<rect x="150" y="70" width="120" height="54" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="210" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Issue</text>
<text x="210" y="112" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">#42 Inscribir alumno</text>
<line x1="274" y1="97" x2="296" y2="97" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-unit)"/>
<rect x="300" y="70" width="120" height="54" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="360" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Tests</text>
<text x="360" y="112" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">uno por criterio</text>
<line x1="424" y1="97" x2="446" y2="97" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-unit)"/>
<rect x="450" y="70" width="120" height="54" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="510" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Porción</text>
<text x="510" y="112" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">una sola carpeta</text>
<line x1="574" y1="97" x2="596" y2="97" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-unit)"/>
<rect x="600" y="70" width="120" height="54" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="660" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">PR</text>
<text x="660" y="112" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">feature/42-…</text>
<line x1="60" y1="126" x2="60" y2="140" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="210" y1="126" x2="210" y2="140" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="360" y1="126" x2="360" y2="140" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="510" y1="126" x2="510" y2="140" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="660" y1="126" x2="660" y2="140" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round"/>
<text x="60" y="158" font-size="11.5" text-anchor="middle" fill="var(--color-text)">refleja la necesidad</text>
<text x="60" y="174" font-size="11.5" text-anchor="middle" fill="var(--color-text)">y la prioridad</text>
<text x="210" y="158" font-size="11.5" text-anchor="middle" fill="var(--color-text)">¿es una porción</text>
<text x="210" y="174" font-size="11.5" text-anchor="middle" fill="var(--color-text)">vertical?</text>
<text x="360" y="158" font-size="11.5" text-anchor="middle" fill="var(--color-text)">solo lo que marque</text>
<text x="360" y="174" font-size="11.5" text-anchor="middle" fill="var(--color-text)">el agente revisor</text>
<text x="510" y="158" font-size="11.5" text-anchor="middle" fill="var(--color-text)">CI con tests</text>
<text x="510" y="174" font-size="11.5" text-anchor="middle" fill="var(--color-text)">de arquitectura</text>
<text x="660" y="158" font-size="11.5" text-anchor="middle" fill="var(--color-text)">revisión final</text>
<text x="660" y="174" font-size="11.5" text-anchor="middle" fill="var(--color-text)">y merge</text>
<circle cx="6" cy="194" r="5" fill="var(--color-accent)"/>
<text x="18" y="198" font-size="11" font-weight="700" fill="var(--color-accent-700)">EL ORQUESTADOR VALIDA</text>
</svg>
<figcaption>Una sola unidad de trabajo atraviesa los cinco niveles. Arriba, lo que la IA produce en cada uno; abajo, lo que el orquestador valida antes de dejarla pasar al siguiente.</figcaption>
</figure>

El error más común de la IA al generar issues es cortar por capas: "crear tabla inscripciones", "crear endpoint", "crear pantalla". Ninguna entrega valor por sí sola y no se pueden probar de punta a punta. Si pasa, se rechaza el corte y se le pide que lo rehaga por caso de uso: una issue cerrada tiene que ser una funcionalidad que anda.

## Opción A: historias de usuario + issues

Conviene cuando hay usuarios de negocio y un producto con varias funcionalidades que priorizar. La historia vive en un nivel superior (épica, milestone o etiqueta) y cada issue es una porción de esa historia.

Flujo con IA:

1. La IA redacta las historias a partir de la necesidad, notas de reunión o la descripción del sistema actual.
   > Prompt: "A partir de estas notas, proponé historias de usuario para el módulo de inscripciones, en formato Como / quiero / para."
2. El orquestador prioriza y aprueba las historias.
3. La IA convierte cada historia en issues, una por porción, completando la plantilla del repositorio.
   > Prompt: "Convertí la historia #12 en issues. Cada issue debe ser una porción vertical, con criterios de aceptación, carpeta en Features/ y porción de referencia. Usá la plantilla de AGENTS.md."
4. El orquestador revisa el corte (ver [Cómo validar el corte](#cómo-validar-el-corte-que-propone-la-ia)) y recién entonces asigna las issues al agente.

Plantilla de issue que la IA completa:

```markdown
## #42 Inscribir alumno a curso
Historia: #12 Gestión de inscripciones
Como docente, quiero inscribir un alumno a un curso para que acceda al aula.

### Criterios de aceptación
- [ ] Alumno ya inscripto → error 409
- [ ] Curso sin cupo → error 422
- [ ] Inscripción exitosa → 201 y aparece en el listado del curso

### Porción
Features/Inscripciones/InscribirAlumno/

### Referencia
Features/Alumnos/CrearAlumno/

### No tocar
Otras porciones. Cambios a Shared/ requieren aviso en el PR.
```

## Opción B: solo issues

Conviene en equipos chicos, sistemas internos o migraciones, donde el formato de historia agrega ceremonia sin agregar claridad. La IA redacta la issue directamente desde un pedido breve.

> Prompt: "Escribí una issue para 'inscribir alumno a curso' con la plantilla de AGENTS.md. El objetivo es que el alumno acceda al aula del curso."

Resultado esperado:

```markdown
## Inscribir alumno a curso
Para: que el alumno acceda al aula del curso.

- [ ] Ya inscripto → 409
- [ ] Sin cupo → 422
- [ ] OK → 201

Porción: Features/Inscripciones/InscribirAlumno/
Referencia: Features/Alumnos/CrearAlumno/
```

En las dos opciones hay una regla que conviene incluir en el prompt: el título de la issue es un verbo que un usuario o sistema ejecuta ("Inscribir alumno", "Listar cursos activos"), nunca una capa ("Crear repositorio de cursos").

| | Historias + issues | Solo issues |
| --- | --- | --- |
| Mejor para | Productos con usuarios de negocio y priorización | Equipos chicos, sistemas internos, migraciones |
| Prompts de planificación | Dos: historias, luego issues | Uno: la issue directa |
| Validaciones del orquestador | Historias y corte en issues | Solo el corte en issues |
| Unidad que recibe el agente | Una issue = una porción | Una issue = una porción |

## Cómo validar el corte que propone la IA

La IA propone cómo dividir las historias; el orquestador decide. Cuando una historia es grande, el corte correcto genera historias más finas que siguen siendo verticales. Esta tabla sirve para corregir a la IA cuando corta mal:

| En vez de cortar por… | Cortar por… |
| --- | --- |
| Capa: tabla, endpoint, pantalla | Variante de la regla: inscripción simple → con lista de espera |
| Componente: backend, frontend | Camino feliz primero, casos de error después |
| "Todo el ABM de cursos" | Cada operación: crear, editar, dar de baja, listar |
| Infraestructura genérica por adelantado | Solo la infraestructura que la primera porción necesita |

Criterios para aceptar una issue generada por la IA (INVEST):

- Se puede probar de punta a punta, sola.
- Toca una sola carpeta de `Features/`, más cambios menores en `Shared/`.
- El PR se revisa en una sentada.
- Tiene entre dos y seis criterios de aceptación. Más que eso suele indicar que son dos porciones.

Una excepción razonable: la base técnica del proyecto (autenticación, conexión a la base, CI) se arma una vez de forma horizontal, antes de la primera porción.

La misma IA puede hacer una primera revisión del corte antes que el orquestador:

> Prompt: "Revisá estas issues. Marcá cualquiera que toque más de una carpeta de Features/, que esté nombrada por capa o que tenga más de seis criterios, y proponé cómo dividirla en porciones verticales."

## Implementar cada issue con un agente

Con la issue aprobada, el agente la implementa. La issue es el prompt: dice qué hacer, dónde hacerlo, qué no tocar y cuándo está terminado.

1. **Asignar la issue.** El prompt es corto porque la issue ya tiene todo: "Implementá la issue #42 siguiendo AGENTS.md."
2. **Tests primero.** El agente convierte cada criterio de aceptación en un test dentro de la carpeta de la porción. Un segundo agente revisa que los tests cubran lo que pide la issue antes de seguir; el orquestador resuelve lo que ese agente marque.
3. **Implementación.** El agente copia la estructura de la porción de referencia y escribe el código hasta que los tests pasen.
4. **CI.** Corren los tests y los tests de arquitectura. Si fallan, el agente corrige y vuelve a intentar.
5. **Revisión del orquestador.** El PR toca una sola carpeta y se revisa rápido. Los cambios se piden con un comentario en el PR y el agente los aplica.
6. **Merge y cierre.** El PR cierra la issue (`Closes #42`).

Como las porciones son independientes, varias issues pueden asignarse a varios agentes en paralelo sin conflictos de merge.

<figure class="diagram">
<svg viewBox="0 0 720 310" role="img" aria-labelledby="d-vsa-flow-t">
<title id="d-vsa-flow-t">Flujo de una issue: criterios a tests, el agente implementa, CI y revisión del orquestador devuelven el trabajo al agente hasta aprobar el merge</title>
<defs>
<marker id="ar-vsa-n" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker>
<marker id="ar-vsa-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker>
<marker id="ar-vsa-s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/></marker>
</defs>
<rect x="0" y="110" width="120" height="56" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="60" y="143" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Issue aprobada</text>
<line x1="124" y1="138" x2="146" y2="138" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-n)"/>
<rect x="150" y="110" width="130" height="56" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="215" y="143" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Criterios → tests</text>
<line x1="284" y1="138" x2="306" y2="138" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-n)"/>
<rect x="310" y="110" width="140" height="56" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="380" y="143" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Agente implementa</text>
<line x1="454" y1="138" x2="476" y2="138" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-n)"/>
<path d="M540 98 L600 138 L540 178 L480 138 Z" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5" stroke-linejoin="round"/>
<text x="540" y="143" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">¿CI pasa?</text>
<path d="M540 96 L540 60 L380 60 L380 106" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linejoin="round" marker-end="url(#ar-vsa-a)"/>
<text x="460" y="52" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">falla: vuelve al agente</text>
<line x1="540" y1="180" x2="540" y2="216" stroke="var(--color-accent-2-600)" stroke-width="2.5" marker-end="url(#ar-vsa-s)"/>
<text x="550" y="202" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">pasa</text>
<rect x="460" y="220" width="160" height="56" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="540" y="253" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Orquestador revisa</text>
<path d="M458 236 L420 236 L420 170" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linejoin="round" marker-end="url(#ar-vsa-a)"/>
<text x="412" y="200" font-size="11.5" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">pide cambios</text>
<line x1="458" y1="262" x2="316" y2="262" stroke="var(--color-accent-2-600)" stroke-width="2.5" marker-end="url(#ar-vsa-s)"/>
<text x="388" y="254" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">aprueba</text>
<rect x="150" y="234" width="160" height="56" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="230" y="267" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Merge, cierra #42</text>
<circle cx="6" cy="300" r="5" fill="var(--color-accent)"/>
<text x="18" y="304" font-size="11" font-weight="700" fill="var(--color-accent-700)">ciclos de corrección: el trabajo vuelve al agente</text>
</svg>
<figcaption>Dos ciclos de vuelta al agente: el CI cuando los tests fallan y el orquestador cuando pide cambios. El agente no decide cuándo terminó.</figcaption>
</figure>

Los dos ciclos de vuelta al agente (CI y revisión) son los que mantienen la calidad: el agente no decide cuándo terminó.

## Cómo implementarlo: mattpocock/skills

Para no armar todo desde cero, el proceso se puede montar sobre [mattpocock/skills](https://github.com/mattpocock/skills), una colección abierta (licencia MIT) que funciona con Claude Code, Codex, Copilot, Gemini CLI, Cursor y otros agentes.

### 1. Instalar

Un solo método por agente: instalar el plugin y además los archivos duplica los skills.

| Agente | Comando |
| --- | --- |
| Claude Code | `claude plugin install mattpocock-skills@claude-plugins-official` |
| Codex | `codex plugin marketplace add mattpocock/skills` y luego `codex plugin add mattpocock-skills@mattpocock` |
| GitHub Copilot (CLI y VS Code) | `copilot plugin marketplace add mattpocock/skills` y luego `copilot plugin install mattpocock-skills@mattpocock` |
| Gemini CLI | `gemini skills install https://github.com/mattpocock/skills.git --path skills/engineering` |
| Otros (Cursor, OpenCode, Windsurf…) | `npx skills@latest add mattpocock/skills -a <agente>`, incluyendo `setup-matt-pocock-skills` cuando pregunte qué skills instalar |

### 2. Configurar el repositorio (una vez)

Ejecutar `/setup-matt-pocock-skills`. Pregunta qué gestor de issues usar (GitHub, GitLab, archivos locales u otro), qué etiquetas se usan para clasificar issues y dónde guardar la documentación. Después se agrega el `AGENTS.md` con las convenciones de porciones de la sección [Preparar el repositorio](#preparar-el-repositorio-para-trabajar-con-ia).

### 3. Alinear con la IA: `/grill-with-docs`

La IA entrevista al orquestador, una pregunta por vez, hasta que todas las decisiones quedan explícitas. Mientras tanto mantiene un glosario del dominio (`GLOSSARY.md`) y registra decisiones de arquitectura (ADR). Es la etapa donde nacen las historias de usuario.

### 4. Escribir la especificación: `/to-spec`

Convierte lo conversado en una especificación y la publica en el gestor de issues. Cumple el rol de la historia de usuario o la épica.

### 5. Dividir en issues verticales: `/to-tickets`

Es el paso central. Se ejecuta sobre la especificación, por ejemplo `/to-tickets #12`, y:

1. Lee la especificación y explora el código; si conviene, propone un refactor previo para facilitar el trabajo.
2. Divide el trabajo en tickets tipo *tracer bullet*: cada uno atraviesa todas las capas, se puede verificar por sí solo y entra en una ventana de contexto nueva.
3. Marca las dependencias: qué ticket bloquea a cuál.
4. Muestra la lista al orquestador y pregunta si la granularidad es correcta, si las dependencias son reales y si hay que unir o dividir tickets. Itera hasta que el orquestador aprueba.
5. Publica una issue por ticket, con criterios de aceptación y la etiqueta `ready-for-agent` (o un archivo por ticket en `.scratch/<funcionalidad>/issues/` si se eligieron archivos locales).

El paso 4 es la validación del corte. Para reforzarla, antes de aprobar se puede correr sobre la lista el prompt de control de [Cómo validar el corte](#cómo-validar-el-corte-que-propone-la-ia). Un detalle: `/to-tickets` evita poner rutas de archivos en las issues porque se vuelven obsoletas, así que la carpeta de cada porción la define la convención de `AGENTS.md`, no la issue.

### 6. Implementar: `/implement` o `/implement-spec`

- `/implement` toma los tickets, trabaja con `/tdd` (primero un test que falla, después el código que lo hace pasar), corre los tests y cierra con `/code-review`. Ese review usa subagentes en paralelo que revisan dos cosas por separado: si el código respeta los estándares del repo y si implementa fielmente la issue. Es el agente revisor que describe este artículo.
- `/implement-spec` trabaja una especificación completa: lanza varios subagentes en paralelo sobre los tickets que no tienen bloqueos.

Cada pocos días conviene correr `/improve-codebase-architecture`, que busca dónde se está degradando la estructura y propone mejoras.

### Correspondencia con el proceso

| Etapa del artículo | Skill |
| --- | --- |
| Preparar el repositorio | `/setup-matt-pocock-skills` + `AGENTS.md` propio |
| Redactar historias | `/grill-with-docs` + `/to-spec` |
| Convertir historias en issues verticales | `/to-tickets` |
| Validar el corte | Preguntas de `/to-tickets` + prompt de control |
| Tests primero | `/tdd` |
| Implementar la porción | `/implement` |
| Agente revisor | `/code-review` |
| Varias porciones en paralelo | `/implement-spec` |

## Resumen del proceso

El proceso completo con IA, de punta a punta:

1. Preparar el repositorio una vez: convenciones, porción de referencia, plantilla de issue y tests de arquitectura.
2. La IA redacta las historias y el orquestador las prioriza (o, en la opción B, la IA redacta las issues directamente).
3. La IA convierte cada historia en issues verticales y el orquestador valida el corte.
4. El agente implementa cada issue como una porción, tests primero, copiando la porción de referencia.
5. CI y el orquestador aprueban el PR, que toca una sola carpeta.

En cada paso la IA produce y el orquestador decide. VSA es lo que hace posible ese reparto: cada unidad de trabajo es chica, completa y verificable, tanto para el agente que la escribe como para el orquestador que la revisa.

## Fuentes

- [Vertical Slice Architecture — Architecting ASP.NET Core Applications (Packt)](https://www.packtpub.com/en-gb/product/architecting-asp-net-core-applications-third-edition-21-9781805123385/chapter/getting-started-with-vertical-slice-architecture/vertical-slice-architecture)
- [Vertical Slice Architecture: Effective Guardrails for AI Development — Jimmy Bogard](https://sessionize.com/s/jimmy-bogard/vertical-slice-architecture-effective-guardrails-f/185766)
- [What Is Vertical Slicing And Why It Is Important — Edworking](https://edworking.com/blog/productivity/what-is-vertical-slicing-and-why-it-is-important)
- [Breaking the Horizontal Habit](https://thethunderislandnavigator.beehiiv.com/p/breaking-horizontal-habit)
