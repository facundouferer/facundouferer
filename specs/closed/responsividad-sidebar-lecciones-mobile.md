# Spec: Responsividad y Menú Flotante de Navegación de Lecciones en Mobile

## 1. Contexto y Diagnóstico del Problema

En las páginas de lección ([`src/pages/cursos/[course]/[lesson].astro`](file:///Users/facundouferer/Devs/facundouferer/src/pages/cursos/[course]/[lesson].astro) y [`src/pages/en/courses/[course]/[lesson].astro`](file:///Users/facundouferer/Devs/facundouferer/src/pages/en/courses/[course]/[lesson].astro)), la grilla `.lesson-layout` define un sidebar lateral en desktop (`@media (width >= 960px)`).

Sin embargo, en dispositivos móviles (`< 960px`), `.lesson-sidebar` se renderiza linealmente en el flujo de la página **antes** del contenido principal (`.lesson-main`). En cursos con muchas lecciones (como C con 32 lecciones o Java con 12 lecciones), el sidebar ocupa una altura vertical excesiva en la pantalla, tapando y postergando el título y cuerpo de la lección hasta el final de un scroll prolongado.

## 2. Objetivo

Mejorar la experiencia y responsividad móvil de las páginas de lección:
1. En pantallas pequeñas (`< 960px`), ocultar el sidebar del flujo estático de la página para que el usuario acceda inmediatamente al contenido de la lección.
2. Proveer un botón flotante pequeño, accesible y sutil (FAB / floating trigger) en una posición fija (ej. esquina inferior derecha).
3. Al presionar el botón flotante, abrir un menú contextual / drawer modal con scroll interno que permita recorrer el temario completo del curso.
4. Al hacer click en una lección, cerrar automáticamente el drawer y navegar hacia la lección elegida.
5. Mantener intacto el diseño actual de dos columnas con sidebar sticky en pantallas de escritorio (`>= 960px`).

---

## 3. Requerimientos Funcionales

### RF-1: Ocultamiento del Sidebar en Flujo Móvil
- En viewport móvil (`< 960px`), `.lesson-sidebar` no debe empujar ni anteceder al contenido de `.lesson-main`.
- El contenido de la lección (`.article-shell`) debe quedar visible en la parte superior sin requerir scroll previo.

### RF-2: Botón Flotante Disparador (Floating Trigger)
- En viewport móvil (`< 960px`), renderizar un disparador flotante fijo:
  - Posición: fijo en la pantalla (`position: fixed; bottom: var(--space-4); right: var(--space-4); z-index: 40;`).
  - Apariencia: botón redondo o píldora con elevación (`.elev-md`), ícono semántico (Lucide `list` o `book-open` a `stroke-width: 2.75`) y etiqueta accesible.
  - Dimensiones de tap target mínimas de 44x44px (cumplimiento WCAG 2.2).
- En desktop (`>= 960px`), el botón flotante debe estar oculto (`display: none;`).

### RF-3: Drawer / Modal Desplegable con Scroll
- Al interactuar con el botón flotante (click o teclado `Enter`/`Space`):
  - Se despliega una vista superpuesta (drawer / modal sheet) con backdrop.
  - Incluye encabezado con el título del curso, metadatos y un botón de cierre accesible (`X`).
  - Contiene el listado completo de lecciones ([`LessonsList.astro`](file:///Users/facundouferer/Devs/facundouferer/src/components/LessonsList.astro)) con scroll vertical interno suave y limitado a la altura visible (`max-height: calc(100dvh - ...)`).
  - Incluye el enlace de retorno al catálogo/curso (`← Volver al curso`).

### RF-4: Cierre Automático y Navegación
- El drawer debe cerrarse y restaurar el scroll de la página cuando:
  - El usuario hace click en cualquier lección del listado.
  - El usuario hace click en el botón de cerrar (`X`).
  - El usuario hace click en el backdrop/overlay exterior.
  - El usuario presiona la tecla `Escape`.

### RF-5: Accesibilidad (a11y)
- Disparador: `<button type="button">` con `aria-haspopup="dialog"`, `aria-expanded="false"` / `"true"`, `aria-controls="mobile-sidebar-drawer"`.
- Drawer: contenedor con `role="dialog"`, `aria-modal="true"`, `aria-label` descriptivo.
- Gestión de foco: foco inicial en el drawer al abrir, retorno de foco al botón flotante al cerrar.
- Bloqueo de scroll de fondo (`body { overflow: hidden }`) mientras el modal esté activo para evitar scroll indeseado en la página de fondo.

### RF-6: Internacionalización (i18n)
- Claves en `src/i18n/es.json` y `src/i18n/en.json`:
  - `courses.mobileNav.openButton`: "Temario" / "Lessons"
  - `courses.mobileNav.dialogTitle`: "Temario del curso" / "Course lessons"
  - `courses.mobileNav.closeButton`: "Cerrar temario" / "Close lessons menu"

---

## 4. Diseño Técnico y UI Organic

### Directrices de [`DESIGN.md`](file:///Users/facundouferer/Devs/facundouferer/DESIGN.md):
- **Botón Flotante**:
  - Utilizar `.btn.btn-primary` o `.btn.btn-secondary` con elevación `.elev-md` o `.elev-lg`.
  - Color terracotta (`--color-accent`) o surface (`--color-surface`) con borde `var(--color-divider)`.
- **Backdrop**:
  - `background: color-mix(in srgb, var(--color-text) 35%, transparent);`
  - `backdrop-filter: blur(4px);`
- **Panel Drawer**:
  - Borde redondeado suave (`--radius-lg`), fondo `var(--color-surface)`, borde `1px solid var(--color-divider)`.
  - Espaciado y scroll con clase utilitaria Organic `.scroll-organic`.

### Arquitectura de Componentes
Opciones de implementación limpias:
- Adaptar `.lesson-sidebar` en `src/pages/cursos/[course]/[lesson].astro` y su contraparte en inglés para funcionar como sidebar normal en desktop y drawer off-canvas en mobile, activado por un `<button class="mobile-sidebar-toggle">`.
- O extraer un componente reusable de sidebar o drawer si mejora la mantenibilidad sin duplicar marcado.

---

## 5. Criterios de Aceptación (Escenarios GIVEN / WHEN / THEN)

### Escenario 1: Vista móvil inicial
- **GIVEN** un usuario en dispositivo móvil (ancho `< 960px`) en una lección de cualquier curso
- **WHEN** la página carga
- **THEN** el sidebar de lecciones NO debe aparecer arriba del contenido del artículo
- **AND** el título `<h1>` y contenido de la lección deben estar visibles de inmediato
- **AND** debe observarse un botón flotante pequeño para abrir el temario

### Escenario 2: Apertura del temario móvil
- **GIVEN** la vista móvil con el botón flotante visible
- **WHEN** el usuario toca el botón flotante
- **THEN** se abre el panel drawer con el listado scrollable de lecciones
- **AND** el atributo `aria-expanded` del botón pasa a `"true"`
- **AND** el scroll del body queda bloqueado

### Escenario 3: Selección de lección y cierre
- **GIVEN** el panel drawer abierto en mobile
- **WHEN** el usuario hace click en una lección del listado
- **THEN** el drawer se cierra
- **AND** el navegador navega a la URL de la lección seleccionada

### Escenario 4: Cierre con Escape o backdrop
- **GIVEN** el panel drawer abierto en mobile
- **WHEN** el usuario toca fuera del panel o presiona `Escape`
- **THEN** el drawer se cierra sin navegar
- **AND** el foco vuelve al botón flotante

### Escenario 5: Comportamiento en Desktop (regresión visual)
- **GIVEN** un usuario en pantalla de escritorio (`>= 960px`)
- **WHEN** visita una página de lección
- **THEN** el sidebar permanece fijo/sticky en la columna izquierda
- **AND** el botón flotante de mobile no es visible (`display: none`)

---

## 6. Plan de Verificación (TDD)

1. **Test unitario y de layout**:
   - Crear `tests/lesson-mobile-sidebar.test.mjs`.
   - Validar la existencia del botón flotante y atributos accesibles (`aria-haspopup`, `aria-expanded`).
   - Validar estilos responsive (`@media (width < 960px)` y `@media (width >= 960px)`).
   - Validar claves i18n en `es.json` y `en.json`.
2. **Chequeo de tipos y construcción**:
   - `npm run astro -- check`
   - `npm run build`
3. **Pruebas de regresión**:
   - `node --test tests/courses-detail-routing.test.mjs`
   - `node --test tests/lesson-presentations-menu.test.mjs`
   - `npm test`
