---
course: 'git'
slug: 'ramas-y-pull-requests'
title: 'Ramas y Pull Requests'
description: 'Trabaja en equipo con el flujo de ramas de funcionalidad: crea una rama, súbela, abre un Pull Request en GitHub, responde a la revisión, mantén la rama al día con main y limpia todo después del merge.'
order: 5
lang: 'es'
published: true
---

# Ramas y Pull Requests

En la lección anterior trabajaste solo, directamente sobre `main`, para aprender a sincronizar con un remoto. En un equipo eso no escala: aquí vas a juntar lo que ya sabes de ramas ([lección 3](/cursos/git/conflictos)) y de remotos ([lección 4](/cursos/git/bajar-y-subir-cambios)) en el flujo que usan casi todos los equipos con GitHub.

En esta lección aprenderás:

- Por qué un equipo no sube cambios directamente a `main`.
- El flujo de ramas de funcionalidad (*feature branch*) de principio a fin.
- Cómo abrir un Pull Request en GitHub y cómo funciona la revisión.
- Cómo mantener tu rama al día con `main` y resolver un conflicto antes del merge.
- Qué opciones de merge ofrece GitHub y cómo limpiar las ramas al terminar.

## Por qué no se sube directo a `main`

`main` es la rama que todo el equipo comparte y, normalmente, la que se publica. Si cada persona sube ahí sus commits en cuanto los hace:

- Un error llega a todos sin que nadie lo haya revisado.
- Los cambios a medio terminar se mezclan con el código que ya funciona.
- No queda un lugar donde discutir un cambio antes de aceptarlo.

La solución es que cada tarea viva en **su propia rama**. Cuando la tarea está lista, propones integrarla a `main` con un **Pull Request** (PR): una página de GitHub que muestra las diferencias entre tu rama y `main`, donde el equipo comenta, pide cambios y, al final, aprueba y hace el merge.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-git-pr-l5-t">
<title id="d-git-pr-l5-t">Flujo de una rama de funcionalidad con Pull Request</title>
<defs>
  <marker id="ar-main-l5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-feat-l5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
</defs>

<rect x="190" y="18" width="300" height="46" rx="14" fill="var(--color-surface)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="340" y="38" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Pull Request en GitHub</text>
<text x="340" y="55" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">revisión, comentarios, cambios pedidos</text>

<path d="M 40 220 L 680 220" fill="none" stroke="var(--color-accent)" stroke-width="3" marker-end="url(#ar-main-l5)"/>
<text x="40" y="250" font-size="12" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">main</text>

<path d="M 100 220 C 130 220, 140 120, 180 120 L 470 120 C 530 120, 560 220, 600 220" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#ar-feat-l5)"/>
<text x="150" y="105" font-size="12" font-family="monospace" font-weight="700" fill="var(--color-accent-2-800)">agrega-contacto</text>

<circle cx="100" cy="220" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="100" y="225" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>
<circle cx="380" cy="220" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="380" y="225" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<text x="380" y="252" font-size="10" text-anchor="middle" fill="var(--color-neutral-700)">PR de un compañero</text>
<circle cx="600" cy="220" r="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="600" y="225" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">M</text>
<text x="600" y="252" font-size="10" text-anchor="middle" fill="var(--color-neutral-700)">merge del PR</text>

<circle cx="230" cy="120" r="14" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="230" y="125" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">C1</text>
<circle cx="330" cy="120" r="14" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="330" y="125" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">C2</text>
<circle cx="440" cy="120" r="14" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="440" y="125" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">C3</text>
<path d="M 380 206 C 400 170, 420 150, 434 134" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#ar-main-l5)"/>

<text x="230" y="160" font-size="10" text-anchor="middle" fill="var(--color-neutral-700)">1. commits</text>
<text x="330" y="160" font-size="10" text-anchor="middle" fill="var(--color-neutral-700)">2. cambio pedido</text>
<text x="470" y="160" font-size="10" text-anchor="middle" fill="var(--color-neutral-700)">3. merge de origin/main</text>
<text x="40" y="285" font-size="11" fill="var(--color-neutral-700)">Cada push a la rama actualiza el mismo Pull Request; al aprobarlo, GitHub crea M en main.</text>
</svg>
<figcaption>La rama <code>agrega-contacto</code> sale de <code>main</code>, recibe commits mientras se revisa el Pull Request, incorpora lo que llegó a <code>main</code> (B) y vuelve a <code>main</code> con el merge (M).</figcaption>
</figure>

## El ejemplo de esta lección

Ana y Beto trabajan en el sitio web de un equipo. El repositorio en GitHub tiene `index.html` y un menú en `menu.html`:

```html
<nav>
  <a href="index.html">Inicio</a>
</nav>
```

A Ana le toca agregar una página de contacto. Todos los comandos que siguen se ejecutan en su clon.

## El flujo de una rama de funcionalidad

### 1. Parte de un `main` actualizado

Antes de crear la rama, ponte en `main` y trae lo último del remoto, así la rama nace del estado más reciente:

```bash
git switch main
git pull
```

```text
Already on 'main'
Your branch is up to date with 'origin/main'.
Already up to date.
```

### 2. Crea la rama y trabaja en ella

Usa un nombre corto que describa la tarea:

```bash
git switch -c agrega-contacto
```

```text
Switched to a new branch 'agrega-contacto'
```

Trabaja y haz commits como siempre. Puedes hacer uno o varios:

```bash
git add contacto.html
git commit -m "Agrega página de contacto"
```

```text
[agrega-contacto b4efc3f] Agrega página de contacto
 1 file changed, 2 insertions(+)
 create mode 100644 contacto.html
```

### 3. Sube la rama al remoto

La primera vez, `-u` conecta tu rama local con la remota, igual que hiciste con `main` en la lección 4:

```bash
git push -u origin agrega-contacto
```

```text
To github.com:equipo/sitio.git
 * [new branch]      agrega-contacto -> agrega-contacto
branch 'agrega-contacto' set up to track 'origin/agrega-contacto'.
```

Cuando el remoto es GitHub, la respuesta incluye además unas líneas que empiezan con `remote:` y un enlace para crear el Pull Request de esa rama. A partir de ahora, en esta rama basta con `git push`.

## Abrir el Pull Request

### Desde la web de GitHub

1. Entra al repositorio en GitHub. Justo después del push aparece un aviso amarillo con el botón **Compare & pull request** (comparar y crear pull request). Si no lo ves, ve a la pestaña **Pull requests** y pulsa **New pull request** (nuevo pull request).
2. Revisa las dos ramas de arriba: **base** es la rama que recibirá los cambios (`main`) y **compare** es tu rama (`agrega-contacto`).
3. Escribe un **título** claro, por ejemplo "Agrega página de contacto".
4. En la **descripción** explica qué cambia, por qué y cómo probarlo. Quien revisa no estuvo en tu cabeza mientras programabas.
5. Si tu equipo lo usa, elige revisores en **Reviewers** (revisores).
6. Pulsa **Create pull request** (crear pull request).

El PR muestra la pestaña **Commits** con tus commits y **Files changed** (archivos modificados) con las diferencias línea por línea.

### Desde la terminal con GitHub CLI

Si configuraste `gh` en la lección 4 (`gh auth login`), puedes abrir el PR sin salir de la terminal:

```bash
gh pr create --base main --title "Agrega página de contacto" --body "Nueva página con el correo del equipo."
```

`gh` crea el PR y muestra su dirección. Con `gh pr create` sin opciones te pregunta los datos uno por uno.

## La revisión

Quien revisa abre **Files changed** y puede:

- Dejar comentarios en una línea concreta (con el botón **+** que aparece al pasar el cursor).
- Terminar la revisión con **Review changes** (revisar cambios) y elegir **Comment** (solo comentar), **Approve** (aprobar) o **Request changes** (pedir cambios).

Los comentarios no son ataques personales: son la forma de que el código que llega a `main` lo entiendan al menos dos personas. Responde a cada uno, y cuando lo resuelvas marca la conversación con **Resolve conversation** (resolver conversación).

### Más commits actualizan el mismo PR

Supongamos que Beto pide: "Agrega un enlace a la página de contacto en el menú". Ana no abre un PR nuevo: sigue en su rama, hace el cambio y sube otro commit.

```bash
git add menu.html
git commit -m "Enlaza la página de contacto desde el menú"
git push
```

```text
[agrega-contacto 330bf8b] Enlaza la página de contacto desde el menú
 1 file changed, 1 insertion(+)
To github.com:equipo/sitio.git
   b4efc3f..330bf8b  agrega-contacto -> agrega-contacto
```

El PR sigue la rama, no un commit fijo: el commit nuevo aparece en él al instante y Beto puede revisar de nuevo.

## Mantener la rama al día con `main`

Mientras el PR de Ana esperaba revisión, el equipo aceptó el PR de Beto, que agregaba un enlace al blog en el mismo menú. `main` avanzó y la rama de Ana quedó atrás. GitHub lo avisa en el PR, y si hay un conflicto muestra **This branch has conflicts that must be resolved** (esta rama tiene conflictos que deben resolverse) y no deja hacer el merge.

La forma de ponerse al día que ya conoces es traer `main` y unirlo a tu rama:

```bash
git fetch
```

```text
From github.com:equipo/sitio
 * [new branch]      agrega-blog -> origin/agrega-blog
   0aaf85e..2588f0d  main        -> origin/main
```

`git fetch` actualizó `origin/main` sin tocar tus archivos. Ahora une esa rama remota a la tuya (no hace falta cambiar a `main`):

```bash
git merge origin/main
```

```text
Auto-merging menu.html
CONFLICT (content): Merge conflict in menu.html
Automatic merge failed; fix conflicts and then commit the result.
```

### Resolver el conflicto en tu rama

Es un conflicto de merge normal, el mismo de la [lección 3](/cursos/git/conflictos), donde verás qué significan los marcadores. `menu.html` quedó así:

```html
<nav>
  <a href="index.html">Inicio</a>
<<<<<<< HEAD
  <a href="contacto.html">Contacto</a>
=======
  <a href="blog.html">Blog</a>
>>>>>>> origin/main
</nav>
```

El menú debe tener los dos enlaces. Deja el archivo así, sin marcadores:

```html
<nav>
  <a href="index.html">Inicio</a>
  <a href="blog.html">Blog</a>
  <a href="contacto.html">Contacto</a>
</nav>
```

Marca el conflicto como resuelto, cierra el merge con su mensaje por defecto y sube el resultado:

```bash
git add menu.html
git commit --no-edit
git push
```

```text
[agrega-contacto cb26567] Merge remote-tracking branch 'origin/main' into agrega-contacto
To github.com:equipo/sitio.git
   330bf8b..cb26567  agrega-contacto -> agrega-contacto
```

`--no-edit` acepta el mensaje que Git propone sin abrir el editor. El PR ya no tiene conflictos. Así queda la historia:

```bash
git log --oneline --graph --all
```

```text
*   cb26567 Merge remote-tracking branch 'origin/main' into agrega-contacto
|\
| *   2588f0d Merge pull request #1 from beto/agrega-blog
| |\
| | * 4ad06a6 Agrega enlace al blog
| |/
* | 330bf8b Enlaza la página de contacto desde el menú
* | b4efc3f Agrega página de contacto
|/
* 0aaf85e Agrega página de inicio
```

Resolver el conflicto en tu rama, y no en `main`, tiene una ventaja: el PR muestra la resolución y el equipo la revisa antes de que llegue a `main`. Si te equivocas en mitad del merge, `git merge --abort` te devuelve al estado anterior.

## Las opciones de merge de GitHub

Cuando el PR está aprobado, el botón verde de abajo hace el merge. Su flecha permite elegir entre tres formas:

| Opción | Qué hace en `main` | Cuándo conviene |
| :--- | :--- | :--- |
| **Create a merge commit** (crear un commit de merge) | Agrega todos los commits de la rama y un merge commit que los une | Quieres conservar cada commit y ver dónde entró el PR |
| **Squash and merge** (aplastar y hacer merge) | Junta todos los commits de la rama en un solo commit nuevo | Los commits de la rama son pasos intermedios ("arreglo", "otra vez") |
| **Rebase and merge** (rebase y merge) | Copia los commits de la rama uno por uno sobre `main`, sin merge commit | Quieres una historia lineal; lo entenderás en la [lección 6](/cursos/git/rebase-y-buenas-practicas) |

Cada repositorio decide cuáles de estas opciones están permitidas.

## Después del merge

La rama cumplió su función. Actualiza tu `main` local, que todavía no tiene el trabajo integrado:

```bash
git switch main
git pull
```

```text
Switched to branch 'main'
Your branch is behind 'origin/main' by 2 commits, and can be fast-forwarded.
  (use "git pull" to update your local branch)
From github.com:equipo/sitio
   2588f0d..29d937d  main       -> origin/main
Updating 0aaf85e..29d937d
Fast-forward
 contacto.html | 2 ++
 menu.html     | 2 ++
 2 files changed, 4 insertions(+)
 create mode 100644 contacto.html
```

Borra la rama local, que ya está integrada:

```bash
git branch -d agrega-contacto
```

```text
Deleted branch agrega-contacto (was cb26567).
```

Borra también la rama del remoto (GitHub ofrece además el botón **Delete branch** en el PR ya integrado):

```bash
git push origin --delete agrega-contacto
```

```text
To github.com:equipo/sitio.git
 - [deleted]         agrega-contacto
```

En el clon de Beto todavía figura `origin/agrega-contacto`, porque `git fetch` no borra por defecto las ramas remotas que ya no existen. Con `--prune` sí lo hace:

```bash
git fetch --prune
```

```text
From github.com:equipo/sitio
 - [deleted]         (none)     -> origin/agrega-contacto
```

Si el PR se integró con **Squash and merge**, los commits de tu rama no están en `main` (hay uno nuevo que los resume) y `git branch -d` se niega con `error: the branch 'agrega-contacto' is not fully merged`. Si comprobaste en GitHub que el PR está integrado, bórrala con `git branch -D agrega-contacto`, que no hace esa comprobación.

## Reglas de protección de ramas

Para que nadie suba directo a `main` aunque quiera, GitHub permite proteger ramas desde **Settings** > **Branches** (configuración > ramas) o con **Rulesets** (conjuntos de reglas). Las reglas más comunes:

- **Require a pull request before merging** (exigir un pull request antes del merge): un `git push` directo a `main` se rechaza.
- **Require approvals** (exigir aprobaciones): hace falta al menos una aprobación de otra persona.
- **Require status checks to pass** (exigir que pasen las comprobaciones): el merge espera a que pasen las pruebas automáticas.

Con estas reglas, el flujo de esta lección deja de ser una costumbre y pasa a ser obligatorio.

## Resumen

| Paso | Comando o acción |
| :--- | :--- |
| Partir de `main` actualizado | `git switch main` y `git pull` |
| Crear la rama | `git switch -c <rama>` |
| Subirla por primera vez | `git push -u origin <rama>` |
| Abrir el PR | **Compare & pull request** o `gh pr create` |
| Responder a la revisión | Más commits y `git push` |
| Ponerse al día con `main` | `git fetch` y `git merge origin/main` |
| Limpiar después del merge | `git switch main`, `git pull`, `git branch -d <rama>`, `git push origin --delete <rama>`, `git fetch --prune` |

## Ejercicios prácticos

Puedes hacer estos ejercicios solo y sin GitHub: un repositorio *bare* hace de servidor y dos clones hacen de Ana y Beto. Prepara el escenario una vez:

```bash
mkdir practica-pr && cd practica-pr
git init --bare equipo.git
git clone equipo.git ana
git clone equipo.git beto
cd ana
git config user.name "Ana"
git config user.email "ana@example.com"
printf '<nav>\n  <a href="index.html">Inicio</a>\n</nav>\n' > menu.html
git add menu.html
git commit -m "Agrega menú"
git push -u origin main
cd ../beto
git config user.name "Beto"
git config user.email "beto@example.com"
git pull
```

Como un repositorio local no tiene botón de Pull Request, el merge del PR lo simula Beto, que hace de revisor: une la rama en su `main` con un merge commit y lo sube. Es lo mismo que hace GitHub con **Create a merge commit**.

### Ejercicio 1: un PR de principio a fin

Desde el clon de Ana, crea la rama `agrega-contacto`, agrega `contacto.html` con un commit y sube la rama. Luego, desde el clon de Beto, trae la rama, intégrala en `main` como lo haría el botón de merge y súbela. Por último, vuelve a Ana y actualiza su `main`.

<details>
<summary>Ver solución</summary>

```bash
cd ../ana
git switch main
git pull
git switch -c agrega-contacto
echo "<h1>Contacto</h1>" > contacto.html
git add contacto.html
git commit -m "Agrega página de contacto"
git push -u origin agrega-contacto

cd ../beto
git fetch
git merge --no-ff -m "Merge pull request #1 from ana/agrega-contacto" origin/agrega-contacto
git push

cd ../ana
git switch main
git pull
```

`--no-ff` obliga a crear el merge commit aunque Git pudiera avanzar `main` en línea recta, igual que GitHub con **Create a merge commit**. Al final `git log --oneline --graph` en Ana muestra el merge commit encima de su commit.

</details>

### Ejercicio 2: actualizar la rama y resolver un conflicto

Ana crea la rama `agrega-blog` y agrega en `menu.html`, debajo de Inicio, `<a href="blog.html">Blog</a>`; hace commit y sube la rama. Mientras tanto Beto, en `main`, agrega en la misma posición `<a href="faq.html">Preguntas</a>`, hace commit y sube. Pon al día la rama de Ana con `main`, resuelve el conflicto dejando los dos enlaces y sube el resultado.

<details>
<summary>Ver solución</summary>

```bash
cd ../ana
git switch -c agrega-blog
# edita menu.html y agrega el enlace al blog
git add menu.html
git commit -m "Agrega enlace al blog"
git push -u origin agrega-blog

cd ../beto
git pull
# edita menu.html y agrega el enlace a preguntas
git add menu.html
git commit -m "Agrega enlace a preguntas"
git push

cd ../ana
git fetch
git merge origin/main
# CONFLICT (content): Merge conflict in menu.html
# edita menu.html: deja los dos enlaces y borra los marcadores
git add menu.html
git commit --no-edit
git push
```

El conflicto se resuelve en la rama de Ana y no en `main`; en un PR real, el equipo vería esa resolución antes del merge.

</details>

### Ejercicio 3: integrar y limpiar

Simula desde Beto el merge de la rama `agrega-blog` del ejercicio 2 y súbelo. Luego, desde Ana, actualiza `main`, borra la rama local y la remota. Por último, en Beto, comprueba con `git branch -a` que todavía ve `origin/agrega-blog` y haz que desaparezca.

<details>
<summary>Ver solución</summary>

```bash
cd ../beto
git fetch
git merge --no-ff -m "Merge pull request #2 from ana/agrega-blog" origin/agrega-blog
git push

cd ../ana
git switch main
git pull
git branch -d agrega-blog
git push origin --delete agrega-blog

cd ../beto
git branch -a
git fetch --prune
git branch -a
```

`git branch -d` funciona porque la rama ya está integrada en `main`. El primer `git branch -a` de Beto todavía lista `remotes/origin/agrega-blog`; después de `git fetch --prune` ya no aparece.

</details>

### Ejercicio 4: el mismo PR recibe más commits

Desde Ana, crea la rama `mejora-contacto`, cambia el título de `contacto.html`, haz commit y sube la rama. Imagina que Beto pide en la revisión que agregues un párrafo con el correo. Haz ese cambio y súbelo. ¿Hace falta abrir algo nuevo? Comprueba desde Beto qué commits tiene la rama remota.

<details>
<summary>Ver solución</summary>

```bash
cd ../ana
git switch -c mejora-contacto
# edita el título de contacto.html
git add contacto.html
git commit -m "Mejora el título de contacto"
git push -u origin mejora-contacto
# agrega el párrafo con el correo
git add contacto.html
git commit -m "Agrega el correo de contacto"
git push

cd ../beto
git fetch
git log --oneline main..origin/mejora-contacto
```

No hace falta abrir nada nuevo: el PR sigue a la rama, así que cada `git push` lo actualiza. El `git log` de Beto muestra los dos commits de la rama.

</details>
