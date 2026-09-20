---
course: 'git'
slug: 'rebase-y-buenas-practicas'
title: 'Rebase y Buenas Prácticas en Git'
description: 'Aprende a mantener un historial limpio con git rebase, resolver conflictos paso a paso, estructurar commits atómicos y seguir las mejores prácticas de la industria.'
order: 4
lang: 'es'
published: true
---

# 🌿 Rebase y Buenas Prácticas en Git

Hasta ahora has visto cómo crear ramas con `git branch`, unirlas con `git merge` y solucionar conflictos directos. En proyectos profesionales y equipos de alto rendimiento, la forma en que integras tus cambios y documentas tu trabajo determina la mantenibilidad del código a largo plazo.

En esta lección aprenderás:
1. Qué es `git rebase` y cómo funciona internamente su modelo mental.
2. Cuándo conviene usar `merge` y cuándo `rebase` (criterio técnico y tradeoffs).
3. Cómo resolver conflictos durante un rebase paso a paso.
4. La Regla de Oro del Rebase (y por qué romperla perjudica a tu equipo).
5. Buenas prácticas profesionales: commits atómicos, Conventional Commits y gestión rigurosa de `.gitignore`.

---

# 🔄 ¿Qué es Git Rebase?

El comando `git merge` une dos historias creando un **commit de unión** (*merge commit*). Esto conserva la cronología exacta, pero genera ramas cruzadas en el árbol del historial.

`git rebase` ofrece un enfoque alternativo: **replantear la base** de tu rama. En lugar de crear un commit de fusión, Git toma los commits que hiciste en tu rama, los "despega" momentáneamente, avanza tu rama hasta la punta de la rama principal (`main`), y vuelve a aplicar (*replay*) tus commits uno a uno sobre esa nueva base.

### Modelo mental (antes y después)

Imagina esta situación: creaste una rama `feature` a partir del commit `B`. Mientras trabajabas, tus compañeros agregaron el commit `C` a `main`.

<figure class="diagram">
<svg viewBox="0 0 720 305" role="img" aria-labelledby="d-git-rebase-t">
<title id="d-git-rebase-t">Modelo mental de git rebase: replay de commits para un historial lineal</title>
<defs>
  <marker id="ar-rb-main" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-rb-feat" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
  <marker id="ar-replay" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-700)"/>
  </marker>
</defs>

<!-- SECTION 1: ANTES DEL REBASE -->
<text x="30" y="32" font-size="13" font-weight="700" fill="var(--color-neutral-800)">1. ANTES DEL REBASE (Ramas divergentes)</text>

<!-- main line 1 -->
<path d="M 60 70 L 370 70" fill="none" stroke="var(--color-accent)" stroke-width="3" marker-end="url(#ar-rb-main)"/>
<text x="45" y="75" font-size="12" font-family="monospace" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">main</text>

<!-- feature curve 1 -->
<path d="M 180 70 C 210 70, 220 120, 250 120 L 460 120" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#ar-rb-feat)"/>
<text x="200" y="138" font-size="12" font-family="monospace" font-weight="700" fill="var(--color-accent-2-800)">feature</text>

<!-- Commits section 1 -->
<circle cx="100" cy="70" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="100" y="75" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>

<circle cx="180" cy="70" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="180" y="75" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>

<circle cx="300" cy="70" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="300" y="75" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>

<circle cx="280" cy="120" r="14" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="280" y="125" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D</text>

<circle cx="390" cy="120" r="14" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="390" y="125" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">E</text>

<!-- Replay Arrow -->
<path d="M 500 115 C 560 115, 560 180, 500 190" fill="none" stroke="var(--color-accent-700)" stroke-width="2.5" marker-end="url(#ar-replay)"/>
<text x="590" y="152" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Replay de commits</text>

<!-- Divider -->
<line x1="30" y1="160" x2="690" y2="160" stroke="var(--color-divider)" stroke-width="1" stroke-dasharray="4 4"/>

<!-- SECTION 2: DESPUÉS DEL REBASE -->
<text x="30" y="185" font-size="13" font-weight="700" fill="var(--color-neutral-800)">2. DESPUÉS DE git rebase main (Historial lineal)</text>

<!-- Line 2: fully linear -->
<path d="M 60 230 L 640 230" fill="none" stroke="var(--color-accent)" stroke-width="3" marker-end="url(#ar-rb-main)"/>
<text x="45" y="235" font-size="12" font-family="monospace" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">main</text>

<circle cx="100" cy="230" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="100" y="235" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>

<circle cx="180" cy="230" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="180" y="235" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>

<circle cx="280" cy="230" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="280" y="235" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>

<!-- Rebased commits -->
<circle cx="390" cy="230" r="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="390" y="235" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D'</text>

<circle cx="500" cy="230" r="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="500" y="235" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">E'</text>
<text x="500" y="268" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">feature (punta)</text>

<rect x="360" y="278" width="280" height="20" rx="6" fill="var(--color-surface)" stroke="var(--color-divider)"/>
<text x="500" y="292" font-size="10" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Nuevos hashes SHA-1 · Historial 100% lineal</text>
</svg>
<figcaption>Modelo mental de <code>git rebase</code>: los commits de la rama de trabajo se despegan y se vuelven a aplicar secuencialmente sobre el último commit de <code>main</code>, logrando un historial limpio y sin bifurcaciones.</figcaption>
</figure>

Observa que los commits ahora se llaman `D'` y `E'`: **sus identificadores (hashes SHA-1) cambiaron**, porque ahora tienen un commit padre diferente (`C` en lugar de `B`).

El resultado es un **historial completamente lineal**, como si hubieses empezado a programar tu función justo después del commit `C`.

---

# ⚖️ Merge vs Rebase: Criterio Técnico

Ningún comando es intrínsecamente mejor que el otro; resuelven problemas diferentes con prioridades distintas:

| Criterio | `git merge` | `git rebase` |
| :--- | :--- | :--- |
| **Forma del historial** | Árbol con bifurcaciones y uniones explícitas | Línea recta continua y sin bifurcaciones |
| **Contexto histórico** | Conserva con exactitud cuándo se bifurcó y unió la rama | Reescribe la historia para simular trabajo secuencial |
| **Resolución de conflictos** | Se resuelve una sola vez en el *merge commit* | Se resuelve commit por commit durante la reaplicación |
| **Trazabilidad de Pull Requests** | Excelente para documentar la integración de un feature completo | Excelente para actualizar ramas locales antes de integrar |

### Regla práctica de la industria:
* Usa **`git rebase`** para mantener tu rama local actualizada con los últimos cambios de `main` antes de enviar un Pull Request.
* Usa **`git merge`** (o el botón de merge de GitHub) para integrar formalmente una funcionalidad terminada a la rama principal compartida.

---

# 🛠️ Cómo ejecutar un Rebase paso a paso

Supongamos que estás trabajando en la rama `feature/carrito` y quieres sincronizarla con las novedades que llegaron a `main`.

### 1. Actualiza tu rama principal local

```bash
# 1. Cambiar a la rama main
git switch main

# 2. Descargar las novedades del remoto asegurando fast-forward
git pull --ff-only
```

### 2. Vuelve a tu rama de trabajo

```bash
# Cambiar a tu rama de funcionalidad activa
git switch feature/carrito
```

### 3. Aplica el rebase sobre la punta de main

```bash
# Reaplicar los commits de feature/carrito encima de la punta actual de main
git rebase main
```

Si tus cambios no tocan las mismas líneas que `main`, Git aplicará cada commit automáticamente y verás:

```text
Successfully rebased and updated refs/heads/feature/carrito.
```

---

# 💥 Manejo de conflictos durante un Rebase

A diferencia de un merge (donde todos los conflictos se resuelven en un solo paso al final), durante un rebase Git reaplica los commits **uno a uno**. Si el commit `D` entra en conflicto con los cambios de `main`, el proceso se detiene en ese commit específico.

### Pasos para resolver el conflicto:

#### 1. Inspecciona qué archivos entraron en conflicto

```bash
# Ver qué archivos tienen conflictos en este commit específico
git status
```

Verás los archivos marcados como `both modified`.

#### 2. Abre el archivo y resuelve los marcadores

Al igual que en un merge tradicional, verás los marcadores de conflicto:

```text
<<<<<<< HEAD (novedades provenientes de main)
const TAX_RATE = 0.21;
=======
const TAX_RATE = 0.18;
>>>>>>> D (tu commit que se está reaplicando)
```

Edita el archivo, elige la versión correcta y borra los marcadores (`<<<<<<<`, `=======`, `>>>>>>>`).

#### 3. Marca el archivo como resuelto

```bash
# Marcar el conflicto de este paso como resuelto
git add src/config.js
```

#### 4. Continúa el rebase (¡NO hagas commit!)

⚠️ **Punto crítico**: En un rebase **no** ejecutas `git commit`. El commit original ya existe; Git simplemente necesita que le indiques que el conflicto de ese paso fue resuelto para continuar con el siguiente commit:

```bash
# Indicar a Git que continúe aplicando los siguientes commits
git rebase --continue
```

Git continuará aplicando los siguientes commits. Si otro commit presenta conflicto, repite estos pasos hasta que finalice.

#### ¿Algo salió mal o quieres cancelar?

Si te equivocaste o prefieres volver exactamente al estado en que estabas antes de iniciar el rebase, puedes abortar la operación limpiamente:

```bash
# Abortar el rebase por completo y restaurar la rama al estado previo
git rebase --abort
```

---

# 🚫 La Regla de Oro del Rebase

> **NUNCA hagas rebase sobre ramas públicas o compartidas.**

Aplica `rebase` únicamente a tus **ramas privadas locales** que nadie más ha descargado.

### ¿Por qué?
Como vimos, el rebase altera los hashes de los commits. Si haces rebase en una rama que tus compañeros de equipo ya clonaron (como `main` o `develop`), sus historiales locales quedarán desconectados del remoto. Si intentas forzar la subida con `git push --force`, reescribirás la historia de todos tus colaboradores, generando errores de sincronización y potenciales pérdidas de código.

---

# 🏆 Buenas Prácticas Profesionales con Git

Aprender los comandos no basta para trabajar en equipo. Los estándares de la industria exigen disciplina en el flujo de trabajo:

## 1. Commits atómicos y enfocados

Un commit atómico realiza **un único cambio lógico indivisible**.
* ❌ **Mal**: Un commit que agrega una pantalla de login, arregla un bug del carrito y refactoriza estilos de 15 archivos (`"varios arreglos y login"`).
* ✔️ **Bien**: Tres commits separados con propósito único.

### ¿Por qué son fundamentales?
* Hacen que el código sea fácil de revisar en un Pull Request.
* Permiten revertir una falla puntual con `git revert` sin deshacer trabajo sano.
* Facilitan encontrar el origen exacto de un bug usando `git bisect`.

---

## 2. Conventional Commits (El estándar de mensajes)

Los equipos profesionales usan el estándar **Conventional Commits** para mantener un historial legible por humanos y automatizable por herramientas de CI/CD:

```text
<tipo>(<alcance opcional>): <descripción corta en imperativo>
```

### Tipos comunes:
* **`feat:`** Una nueva característica o funcionalidad.
  * Ejemplo: `feat(auth): add google oauth login`
* **`fix:`** Corrección de un error o bug.
  * Ejemplo: `fix(cart): prevent negative item quantities`
* **`docs:`** Cambios exclusivamente en documentación o README.
  * Ejemplo: `docs(api): update endpoints table`
* **`refactor:`** Cambio en el código que no agrega funcionalidad ni arregla un bug (reestructuración, limpieza).
  * Ejemplo: `refactor(db): extract query builder helper`
* **`test:`** Añadir o corregir pruebas unitarias o de integración.
  * Ejemplo: `test(auth): add unit test for token validation`
* **`chore:`** Tareas auxiliares, actualización de dependencias o configuración del proyecto.
  * Ejemplo: `chore(deps): bump astro to version 6.0`

---

## 3. Uso riguroso de `.gitignore`

El archivo `.gitignore` le indica a Git qué archivos o carpetas deben ser ignorados y nunca formar parte del repositorio:

```text
# Dependencias (se descargan con el gestor de paquetes)
node_modules/
vendor/

# Archivos de compilación y empaquetado
dist/
build/
*.class

# Secretos y variables de entorno (¡CRÍTICO!)
.env
.env.local
*.pem
*.key

# Archivos temporales del sistema operativo y editores
.DS_Store
Thumbs.db
.vscode/
.idea/
```

### 🔒 Regla fundamental de seguridad:
**Nunca subas contraseñas, tokens, llaves de API ni archivos `.env` a Git.** Si un secreto llega a un commit, borrarlo en el siguiente commit no lo elimina del historial: cualquier persona con acceso al repositorio puede ver los commits anteriores. Si esto ocurre, debes revocar o rotar el secreto inmediatamente.

---

## 4. Inspección constante antes de confirmar

Antes de hacer `git add` y `git commit`, adquiere el hábito de revisar qué vas a incluir:

```bash
# Revisar de forma resumida el estado de archivos modificados y no rastreados
git status --short

# Comparar las líneas modificadas en el working tree contra el último commit
git diff
```

No confirmes archivos a ciegas con `git add .` sin antes comprobar que no estás agregando archivos temporales, logs o cambios no deseados.

---

# 📌 Resumen de Comandos de esta Lección

| Acción | Comando |
| :--- | :--- |
| Replantear la base de la rama actual sobre `main` | `git rebase main` |
| Continuar el rebase tras resolver un conflicto | `git rebase --continue` |
| Cancelar el rebase y volver al estado previo | `git rebase --abort` |
| Ver el estado conciso de los archivos | `git status --short` |
| Ver diferencias en archivos modificados | `git diff` |
