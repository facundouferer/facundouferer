# Spec: Navegabilidad Rápida a Presentaciones en Lecciones

## Status: COMPLETED

Implemented in `src/components/LessonPresentationsMenu.astro`, integrated into `src/pages/cursos/[course]/[lesson].astro` and `src/pages/en/courses/[course]/[lesson].astro`. Fixed CSS specificity conflict with `.card` by adding `.lesson-presentations-panel[hidden] { display: none !important; }`, ensuring the panel remains strictly closed until user clicks the trigger. Verified with `tests/lesson-presentations-menu.test.mjs`, `npm run astro -- check`, and `npm run build`.

---

## 1. Contexto y Problema

### 1.1 Necesidad original
En las páginas de lección (`src/pages/cursos/[course]/[lesson].astro` y `src/pages/en/courses/[course]/[lesson].astro`), el bloque de presentaciones asociadas (`LessonPresentations.astro`) se renderiza al final del artículo. Para lecciones extensas, los usuarios deben desplazarse hasta el final para descubrir los recursos interactivos. Por ello se diseñó un disparador superior (`LessonPresentationsMenu.astro`) junto al encabezado de la lección.

### 1.2 Defecto detectado (Solapamiento / Panel desplegado por defecto)
Al ingresar a cualquier lección que posee presentaciones asociadas (por ejemplo `/cursos/java/02-variables-tipos-datos-y-operadores`), el panel flotante (*Presentaciones disponibles*) aparece **abierto de manera predeterminada**, solapando el título `<h1>`, tags y el inicio del texto explicativo.

**Causa raíz técnica:**
El panel contenedor en `LessonPresentationsMenu.astro` utiliza las clases combinadas `.lesson-presentations-panel.card`. En `src/styles/global.css`, la clase del sistema `.card` define:
```css
.card {
	display: flex;
	flex-direction: column;
	...
}
```
Debido a las reglas de precedencia y especificidad de CSS de autor frente al agente de usuario, la regla `.card { display: flex; }` sobreescribe el estilo por defecto del navegador para el atributo HTML nativo `hidden` (`[hidden] { display: none; }`). Por lo tanto, aunque el elemento posea el atributo `hidden` en el marcado estático, se computa como `display: flex`, permaneciendo visible desde la carga inicial sin que el usuario haya interactuado.

---

## 2. Objetivo

1. Garantizar que el panel de presentaciones disponibles **permanezca estrictamente oculto por defecto** (`display: none`) al cargar la página y no tape el contenido de la lección.
2. Hacer que el panel **solo se despliegue cuando el usuario haga click explícitamente en el botón de presentaciones de la lección** (o lo active mediante teclado con `Enter`/`Space`).
3. Mantener el cierre fluido e inmediato al hacer click nuevamente en el botón, al hacer click fuera del panel (*click outside*), o al presionar `Escape`.

---

## 3. Requerimientos Funcionales y Técnicos

### RF-1: Renderizado Condicional
- El botón disparador (`LessonPresentationsMenu`) **SOLO** debe renderizarse si la lección posee una o más presentaciones asociadas (`lessonPresentations.length > 0`).
- Si la lección no tiene presentaciones asociadas, el componente no debe renderizar markup ni ocupar espacio en el DOM.

### RF-2: Ubicación y Disparador (Trigger)
- Ubicarse en el encabezado de la lección alineado con el título `<h1>` (`.lesson-title-row`).
- Botón interactivo accesible con el ícono Lucide `presentation` (`stroke-width: 2.75`) y un badge circular indicador con la cantidad de presentaciones disponibles.
- Utilizar clases y tokens del Organic Design System (`.btn`, `.btn-secondary`, `var(--color-surface)`, `var(--color-accent)`, `var(--color-divider)`).

### RF-3: Estado Inicial Oculto y Prevención de Solapamiento (FIX CRÍTICO)
- **Oculto por defecto**: El panel flotante debe iniciar y permanecer estrictamente invisible (`display: none`) al renderizarse y cargarse la página.
- **Blindaje de especificidad CSS**:
  - Debe asegurarse mediante una regla CSS explícita con suficiente especificidad que el panel esté oculto cuando tenga el atributo `hidden` (por ejemplo: `.lesson-presentations-panel[hidden] { display: none !important; }`), evitando que `.card { display: flex }` lo fuerce a ser visible.
- **Despliegue bajo demanda**:
  - Al hacer click en el botón disparador (o presionar `Enter`/`Space`), el panel debe desplegarse adyacente al botón y actualizar `aria-expanded="true"`.
- **Cierre**:
  - Hacer click de nuevo en el disparador debe cerrar el panel (`aria-expanded="false"` y aplicación de `hidden`).
  - Hacer click fuera del panel (*click outside*) debe cerrar el panel.
  - Presionar la tecla `Escape` debe cerrar el panel y devolver el foco al botón disparador.
  - Hacer click en cualquiera de los enlaces de presentación debe cerrar el panel.

### RF-4: Accesibilidad (a11y)
- El disparador `<button>` debe poseer:
  - `type="button"`
  - `aria-haspopup="dialog"`
  - `aria-expanded="false"` en estado inicial y cerrado; `"true"` cuando está desplegado.
  - `aria-controls="lesson-presentations-panel"`
  - `aria-label` descriptivo obtenido desde los diccionarios i18n (`t('courses.lessonPresentations.menuButtonLabel')`).
- El contenedor del menú debe poseer `role="dialog"` y `aria-label` descriptivo (`t('courses.lessonPresentations.menuHeading')`).
- Gestión de teclado accesible y retorno de foco al disparador tras cerrar con `Escape`.

### RF-5: Internacionalización (i18n)
- Claves obligatorias en `src/i18n/es.json` y `src/i18n/en.json`:
  - `courses.lessonPresentations.menuButtonLabel`: Label del botón disparador ("Ver presentaciones de esta lección" / "View presentations for this lesson").
  - `courses.lessonPresentations.menuHeading`: Título del panel ("Presentaciones disponibles" / "Available presentations").
  - `courses.lessonPresentations.close`: Texto de cierre si aplica ("Cerrar" / "Close").

---

## 4. Diseño Técnico y Cambios Requeridos

### Componente: `src/components/LessonPresentationsMenu.astro`

1. **Aislamiento en CSS**:
   En el bloque `<style>` de `LessonPresentationsMenu.astro`:
   ```css
   .lesson-presentations-panel[hidden] {
   	display: none !important;
   }
   ```
2. **Sincronización de eventos y ciclos de vida**:
   El script debe registrarse tanto en la ejecución directa como ante eventos de navegación de Astro (`astro:page-load`), asegurando que ante cada navegación el panel nazca cerrado.

---

## 5. Criterios de Aceptación (Escenarios GIVEN / WHEN / THEN)

### Escenario 1: Estado inicial no intrusivo (Sin solapamiento)
- **GIVEN** una lección con presentaciones (ej. `/cursos/java/02-variables-tipos-datos-y-operadores` o `/cursos/c/17-cadenas-de-caracteres-y-operaciones`)
- **WHEN** el usuario ingresa a la lección
- **THEN** el botón de presentaciones se visualiza junto al título
- **AND** el panel "Presentaciones disponibles" permanece COMPLETAMENTE OCULTO (`display: none`)
- **AND** ningún contenido, título o texto de la lección es tapado ni solapado
- **AND** el botón disparador posee `aria-expanded="false"`

### Escenario 2: Despliegue bajo click en el botón
- **GIVEN** la página de una lección con presentaciones en estado inicial (panel cerrado)
- **WHEN** el usuario hace click en el botón disparador de presentaciones
- **THEN** el panel de presentaciones se despliega adyacente al botón
- **AND** el botón disparador pasa a `aria-expanded="true"`
- **AND** se listan los accesos a las presentaciones disponibles con sus tags y títulos

### Escenario 3: Cierre por click exterior, Escape o re-click
- **GIVEN** el panel de presentaciones abierto
- **WHEN** el usuario hace click nuevamente en el botón, hace click fuera del contenedor, o pulsa `Escape`
- **THEN** el panel vuelve inmediatamente a estar oculto (`display: none`)
- **AND** el botón pasa a `aria-expanded="false"`
- **AND** en caso de `Escape`, el foco regresa al botón disparador

### Escenario 4: Lección sin presentaciones asociadas
- **GIVEN** una lección que no posee presentaciones en `src/data/presentations.ts`
- **WHEN** el usuario visita la lección
- **THEN** el componente no renderiza nada en el DOM y no ocupa espacio.

### Escenario 5: Soporte bilingüe
- **GIVEN** la página en inglés `/en/courses/[course]/[lesson]`
- **WHEN** el usuario abre el menú
- **THEN** el encabezado muestra "Available presentations" y las rutas corresponden a `/en/presentaciones/...`

---

## 6. Plan de Verificación (TDD)

1. **Test unitario del componente y reglas CSS**:
   - `tests/lesson-presentations-menu.test.mjs`:
     - Existencia e integración del componente en páginas de lección ES y EN.
     - Presencia de la regla CSS que garantiza que `.lesson-presentations-panel[hidden]` oculte el panel con `display: none !important`.
     - Atributos de accesibilidad (`aria-expanded="false"` inicial, `aria-haspopup="dialog"`).
2. **Validación estática**:
   - `npm run astro -- check`
3. **Suite de regresión**:
   - `npm test`
