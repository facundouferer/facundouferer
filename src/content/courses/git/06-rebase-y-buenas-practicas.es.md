---
course: 'git'
slug: 'rebase-y-buenas-practicas'
title: 'Rebase y buenas prácticas en Git'
description: 'Actualiza tu rama con git rebase, resuelve conflictos durante un rebase, ordena tus commits con rebase -i y adopta las prácticas de un equipo profesional: commits atómicos, Conventional Commits, .gitignore y revisión antes de confirmar.'
order: 6
lang: 'es'
published: true
---

# Rebase y buenas prácticas en Git

En la [lección anterior](/cursos/git/ramas-y-pull-requests) trabajaste con una rama de funcionalidad y un Pull Request, y actualizaste tu rama con `git fetch` + `git merge origin/main`. Esa forma funciona, pero cada actualización agrega un commit de merge a tu rama. En esta lección aprenderás la alternativa que usan muchos equipos para mantener un historial limpio, y las prácticas que hacen que ese historial sea útil.

En esta lección aprenderás:

1. Qué hace `git rebase` y por qué cambia los hashes de tus commits.
2. Cuándo conviene `merge` y cuándo `rebase`.
3. Cómo actualizar tu rama con `git fetch` + `git rebase origin/main`.
4. Cómo resolver un conflicto durante un rebase, y por qué "ours" y "theirs" se invierten.
5. La regla de oro del rebase y cómo subir tu rama con `git push --force-with-lease`.
6. Cómo ordenar tus commits con `git rebase -i`.
7. Buenas prácticas: commits atómicos, `git bisect`, Conventional Commits, `.gitignore`, secretos y revisión antes de confirmar.

A partir de esta lección, todos los mensajes de commit siguen el estándar **Conventional Commits**, que se explica más abajo.

## Qué es rebase

`git merge` une dos historias creando un **commit de merge** que tiene dos padres. Conserva exactamente lo que pasó, pero el historial se llena de bifurcaciones y uniones.

`git rebase` hace otra cosa: **cambia la base de tu rama**. Git toma los commits que hiciste en tu rama, los aparta, mueve tu rama hasta la punta de la otra rama y vuelve a aplicar (*replay*) tus commits uno por uno encima.

### Modelo mental

Creaste la rama `feature/carrito` desde el commit `B`. Mientras trabajabas, alguien del equipo integró el commit `C` en `main`.

<figure class="diagram">
<svg viewBox="0 0 720 320" role="img" aria-labelledby="d-git-rebase-l6-t">
<title id="d-git-rebase-l6-t">Modelo mental de git rebase: los commits de la rama se vuelven a aplicar sobre la punta de main con hashes nuevos</title>
<defs>
  <marker id="ar-rb-main-l6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-rb-feat-l6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
  <marker id="ar-replay-l6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-700)"/>
  </marker>
</defs>

<text x="30" y="32" font-size="13" font-weight="700" fill="var(--color-neutral-800)">1. Antes del rebase: las ramas divergen</text>

<path d="M 60 70 L 330 70" fill="none" stroke="var(--color-accent)" stroke-width="3" marker-end="url(#ar-rb-main-l6)"/>
<text x="45" y="75" font-size="12" font-family="monospace" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">main</text>

<path d="M 180 70 C 210 70, 220 120, 250 120 L 440 120" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#ar-rb-feat-l6)"/>
<text x="460" y="125" font-size="12" font-family="monospace" font-weight="700" fill="var(--color-accent-2-800)">feature/carrito</text>

<circle cx="100" cy="70" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="100" y="75" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>
<circle cx="180" cy="70" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="180" y="75" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<circle cx="290" cy="70" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="290" y="75" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<circle cx="280" cy="120" r="14" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="280" y="125" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D</text>
<circle cx="390" cy="120" r="14" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="390" y="125" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">E</text>

<path d="M 600 110 C 650 120, 650 190, 600 205" fill="none" stroke="var(--color-accent-700)" stroke-width="2.5" marker-end="url(#ar-replay-l6)"/>
<text x="668" y="162" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">replay</text>

<text x="30" y="190" font-size="13" font-weight="700" fill="var(--color-neutral-800)">2. Después de git rebase origin/main: historial lineal</text>

<path d="M 60 240 L 290 240" fill="none" stroke="var(--color-accent)" stroke-width="3"/>
<path d="M 290 240 L 530 240" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="6 4" marker-end="url(#ar-rb-feat-l6)"/>
<text x="45" y="245" font-size="12" font-family="monospace" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">main</text>

<circle cx="100" cy="240" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="100" y="245" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>
<circle cx="180" cy="240" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="180" y="245" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<circle cx="290" cy="240" r="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="290" y="245" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<text x="290" y="278" font-size="11" font-family="monospace" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">main</text>

<circle cx="380" cy="240" r="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="380" y="245" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D'</text>
<circle cx="480" cy="240" r="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="480" y="245" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">E'</text>
<text x="550" y="245" font-size="12" font-family="monospace" font-weight="700" fill="var(--color-accent-2-800)">feature/carrito</text>

<rect x="340" y="288" width="300" height="22" rx="8" fill="var(--color-surface)" stroke="var(--color-divider)"/>
<text x="490" y="303" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">D' y E' son commits nuevos: hashes nuevos</text>
</svg>
<figcaption>Modelo mental de <code>git rebase</code>: los commits <code>D</code> y <code>E</code> de la rama se vuelven a aplicar sobre <code>C</code>, la punta de <code>main</code>. El resultado son dos commits nuevos, <code>D'</code> y <code>E'</code>, y un historial sin bifurcaciones.</figcaption>
</figure>

Los commits ahora se llaman `D'` y `E'` porque **son commits nuevos**: tienen el mismo cambio y el mismo mensaje, pero otro padre (`C` en lugar de `B`). Como el hash de un commit depende de su padre, sus hashes cambian. Los commits originales `D` y `E` no se borran en el momento: quedan sin rama que los apunte y todavía puedes encontrarlos con `git reflog` (lo viste en [Deshacer cambios](/cursos/git/deshacer-cambios)).

Esto tiene una consecuencia importante: **un rebase reescribe la historia de tu rama**. Más abajo verás cuándo eso es seguro y cuándo no.

## Merge o rebase: cómo elegir

Ninguno es mejor que el otro; resuelven el mismo problema con prioridades distintas.

| Criterio | `git merge` | `git rebase` |
| :--- | :--- | :--- |
| Forma del historial | Con bifurcaciones y commits de merge | Lineal |
| Qué pasa con tus commits | No cambian | Se reemplazan por commits nuevos (hashes nuevos) |
| Conflictos | Se resuelven una sola vez, en el commit de merge | Se resuelven commit por commit, a medida que se reaplican |
| Seguro en ramas compartidas | Sí | No |
| Si te equivocas | `git merge --abort` durante el merge | `git rebase --abort` durante el rebase |

Un criterio práctico que usan muchos equipos:

- Usa **`git rebase origin/main`** para actualizar **tu propia** rama de funcionalidad antes de abrir o actualizar un Pull Request. Así la revisión muestra solo tus cambios, encima de lo último de `main`.
- Usa **merge** (en GitHub, con el botón del Pull Request) para integrar la funcionalidad terminada en `main`. En la [lección 5](/cursos/git/ramas-y-pull-requests) viste las opciones de GitHub: la opción *Rebase and merge* hace exactamente este replay del lado del servidor.
- Si tu rama la comparten varias personas, actualízala con `git merge origin/main`, como en la lección anterior.

## Rebase paso a paso

Retomemos el flujo de la lección 5. Estás en tu rama `feature/carrito`, que ya subiste con `git push -u origin feature/carrito` para abrir el Pull Request. Tiene dos commits. Mientras tanto, Beto integró en `main` un cambio en el costo de envío.

### 1. Descarga las novedades

```bash
git fetch
```

```text
From github.com:tu-usuario/tienda
   10b4cc8..7ac78ac  main       -> origin/main
```

`git status` no te avisa nada, porque compara tu rama con `origin/feature/carrito`, no con `main`:

```text
On branch feature/carrito
Your branch is up to date with 'origin/feature/carrito'.

nothing to commit, working tree clean
```

Para ver la divergencia, mira el grafo de todas las ramas:

```bash
git log --oneline --graph --all
```

```text
* 780488a feat(envio): agrega envío gratis desde 10000
* a39a0ac feat(carrito): calcula el total
| * 7ac78ac fix(envio): actualiza el costo de envío
|/
* 10b4cc8 chore: agrega configuración inicial
```

### 2. Haz el rebase sobre origin/main

No hace falta actualizar tu `main` local primero: `origin/main` ya tiene lo último que descargaste.

```bash
git rebase origin/main
```

Si tus commits no chocan con los cambios de `main`, Git los reaplica solos y termina con:

```text
Successfully rebased and updated refs/heads/feature/carrito.
```

En este ejemplo, Beto y tú modificaron la misma línea de `config.js`, así que el rebase se detiene con un conflicto.

## Conflictos durante un rebase

En un merge, todos los conflictos aparecen juntos al final. En un rebase, Git reaplica tus commits **de a uno**, y se detiene en el primer commit que choca:

```text
Auto-merging config.js
CONFLICT (content): Merge conflict in config.js
error: could not apply 780488a... feat(envio): agrega envío gratis desde 10000
hint: Resolve all conflicts manually, mark them as resolved with
hint: "git add/rm <conflicted_files>", then run "git rebase --continue".
hint: You can instead skip this commit: run "git rebase --skip".
hint: To abort and get back to the state before "git rebase", run "git rebase --abort".
hint: Disable this message with "git config set advice.mergeConflict false"
Could not apply 780488a... # feat(envio): agrega envío gratis desde 10000
```

El primer commit (`a39a0ac`, que solo crea `cart.js`) ya se reaplicó sin problemas; el segundo es el que choca.

### 1. Mira el estado

```bash
git status
```

```text
interactive rebase in progress; onto 7ac78ac
Last commands done (2 commands done):
   pick a39a0ac # feat(carrito): calcula el total
   pick 780488a # feat(envio): agrega envío gratis desde 10000
No commands remaining.
You are currently rebasing branch 'feature/carrito' on '7ac78ac'.
  (fix conflicts and then run "git rebase --continue")
  (use "git rebase --skip" to skip this patch)
  (use "git rebase --abort" to check out the original branch)

Unmerged paths:
  (use "git restore --staged <file>..." to unstage)
  (use "git add <file>..." to mark resolution)
	both modified:   config.js

no changes added to commit (use "git add" and/or "git commit -a")
```

Git te dice en qué commit está, cuántos quedan y qué archivo tiene el conflicto.

### 2. Resuelve los marcadores

Abre `config.js`:

```text
const TAX_RATE = 0.21;
<<<<<<< HEAD
const SHIPPING_COST = 700;
=======
const SHIPPING_COST = 600;
const FREE_SHIPPING_FROM = 10000;
>>>>>>> 780488a (feat(envio): agrega envío gratis desde 10000)
```

Los marcadores son los mismos que conoces de [Ramas, fusión y conflictos](/cursos/git/conflictos), pero fíjate en qué hay de cada lado:

- Entre `<<<<<<< HEAD` y `=======` está la versión de **`origin/main`** (con tus commits ya reaplicados). Durante un rebase, `HEAD` es la nueva base, no tu rama.
- Entre `=======` y `>>>>>>>` está **tu commit**, identificado por su hash y su mensaje (`780488a (feat(envio): ...)`).

Decide el resultado y borra los marcadores. Aquí te quedas con el costo nuevo de Beto y con tu envío gratis:

```js
const TAX_RATE = 0.21;
const SHIPPING_COST = 700;
const FREE_SHIPPING_FROM = 10000;
```

### La inversión de "ours" y "theirs"

En un merge estás parado en tu rama y traes la otra: "ours" (nuestro) es tu rama y "theirs" (de ellos) es la que traes. En un rebase pasa al revés, porque Git se para en la nueva base y trae tus commits:

| Durante... | `HEAD` / "ours" | "theirs" |
| :--- | :--- | :--- |
| `git merge origin/main` | Tu rama | `origin/main` |
| `git rebase origin/main` | `origin/main` (la nueva base) | Tu commit que se está reaplicando |

Esto importa cuando quieres quedarte con un lado completo de un archivo en conflicto. Durante un rebase:

```bash
# Quedarte con TU versión del archivo (la de tu commit)
git restore --theirs config.js

# Quedarte con la versión de origin/main
git restore --ours config.js
```

Después de cualquiera de los dos, igual tienes que marcar el archivo como resuelto con `git add`.

### 3. Marca el archivo como resuelto

```bash
git add config.js
```

### 4. Continúa el rebase, sin hacer commit

En un rebase **no** ejecutas `git commit`. El commit que se está reaplicando ya tiene su mensaje; solo le dices a Git que siga:

```bash
git rebase --continue
```

Git puede abrir tu editor con el mensaje del commit para que lo confirmes: guarda y cierra. Luego continúa con los commits que queden:

```text
[detached HEAD 1dfd393] feat(envio): agrega envío gratis desde 10000
 1 file changed, 1 insertion(+)
Successfully rebased and updated refs/heads/feature/carrito.
```

El `detached HEAD` del mensaje es normal: durante el rebase Git construye los commits nuevos sin rama y, al terminar, mueve `feature/carrito` a ellos. Si otro commit tuviera conflicto, repetirías los pasos 1 a 4.

Mira el resultado:

```bash
git log --oneline --graph --all
```

```text
* 1dfd393 feat(envio): agrega envío gratis desde 10000
* c6d3f43 feat(carrito): calcula el total
* 7ac78ac fix(envio): actualiza el costo de envío
| * 780488a feat(envio): agrega envío gratis desde 10000
| * a39a0ac feat(carrito): calcula el total
|/
* 10b4cc8 chore: agrega configuración inicial
```

Tus dos commits ahora están encima de `7ac78ac` y tienen hashes nuevos (`c6d3f43` y `1dfd393`). La rama de la derecha son tus commits viejos, que todavía están en `origin/feature/carrito` porque aún no subiste nada.

### Si algo sale mal: git rebase --abort

Si te confundiste o prefieres no seguir, cancela el rebase en cualquier momento antes de que termine:

```bash
git rebase --abort
```

No muestra nada, pero tu rama vuelve exactamente al estado anterior al rebase, con sus commits y hashes originales.

## La regla de oro del rebase

> **Nunca hagas rebase de una rama sobre la que otras personas construyen**: `main`, `develop` o cualquier rama compartida.

### Por qué

Un rebase reemplaza commits por commits nuevos. Si otra persona ya tiene los commits viejos y trabaja encima de ellos, su historia y la del remoto dejan de coincidir: tendría que rehacer su trabajo sobre los commits nuevos, y es fácil que alguien vuelva a subir los commits viejos duplicados o que se pierda trabajo.

### Tu propia rama ya subida: git push --force-with-lease

Hacer rebase de **tu propia** rama de funcionalidad, aunque ya la hayas subido, es normal antes de un Pull Request: nadie más construye sobre ella. Pero después del rebase, un `git push` normal es rechazado:

```bash
git push
```

```text
To github.com:tu-usuario/tienda.git
 ! [rejected]        feature/carrito -> feature/carrito (non-fast-forward)
error: failed to push some refs to 'github.com:tu-usuario/tienda.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

Es el mismo rechazo que viste en [Bajar y subir cambios](/cursos/git/bajar-y-subir-cambios), pero aquí **no** debes hacer `git pull`: eso volvería a traer tus commits viejos y los mezclaría con los nuevos. Lo que quieres es reemplazar la rama remota por la tuya:

```bash
git push --force-with-lease
```

```text
To github.com:tu-usuario/tienda.git
 + 780488a...1dfd393 feature/carrito -> feature/carrito (forced update)
```

El Pull Request se actualiza solo con los commits nuevos.

### Por qué nunca --force a secas

`git push --force` reemplaza la rama remota sin preguntar nada. Si un compañero subió un commit a tu rama mientras tú hacías el rebase, `--force` lo borra del remoto sin avisarte.

`--force-with-lease` solo reemplaza la rama remota si todavía está donde la viste la última vez (en tu `origin/feature/carrito`). Si alguien subió algo que no tienes, el push se rechaza:

```text
To github.com:tu-usuario/tienda.git
 ! [rejected]        feature/carrito -> feature/carrito (stale info)
error: failed to push some refs to 'github.com:tu-usuario/tienda.git'
```

En ese caso, ejecuta `git fetch`, mira qué subió esa persona con `git log feature/carrito..origin/feature/carrito` e incorpóralo antes de volver a subir. Ojo: un `git fetch` actualiza lo que Git "vio", así que si haces fetch y después fuerzas sin mirar, `--force-with-lease` ya no te protege.

## Ordenar tus commits con git rebase -i

Antes de pedir revisión, a veces tu rama tiene commits que no cuentan bien la historia: un mensaje con errores, un commit "corrige typo" que arregla el anterior. El **rebase interactivo** te deja reescribir los últimos commits de tu rama:

```bash
git log --oneline
```

```text
aa007a1 corrige typo
92f548a feat(perfil): muestra el nombre
fdd62ee feat(perfil): agrega pagina de perfil
75efdbd docs: agrega README
```

```bash
# Editar los últimos 3 commits
git rebase -i HEAD~3
```

`HEAD~3` significa "tres commits antes de `HEAD`": el rebase reescribe los tres commits que vienen después. Git abre tu editor con la **lista de tareas** (*todo list*), del más viejo al más nuevo:

```text
pick fdd62ee # feat(perfil): agrega pagina de perfil
pick 92f548a # feat(perfil): muestra el nombre
pick aa007a1 # corrige typo

# Rebase 75efdbd..aa007a1 onto 75efdbd (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
...
```

Cambias la palabra del principio de cada línea para decir qué hacer con ese commit:

| Comando | Qué hace |
| :--- | :--- |
| `pick` | Deja el commit como está |
| `reword` | Deja el cambio, pero te deja editar el mensaje |
| `squash` | Une el commit al anterior y te deja combinar los dos mensajes |
| `fixup` | Une el commit al anterior y descarta su mensaje |
| `drop` | Elimina el commit (y su cambio) |

También puedes reordenar las líneas. Para corregir el mensaje del primer commit y absorber "corrige typo" en el segundo, deja la lista así:

```text
reword fdd62ee # feat(perfil): agrega pagina de perfil
pick 92f548a # feat(perfil): muestra el nombre
fixup aa007a1 # corrige typo
```

Guarda y cierra. Por el `reword`, Git abre el editor con el mensaje del primer commit; lo cambias a `feat(perfil): agrega la página de perfil`, guardas y cierras:

```text
Successfully rebased and updated refs/heads/feature/perfil.
```

```bash
git log --oneline
```

```text
e73874b feat(perfil): muestra el nombre
e1e4cdd feat(perfil): agrega la página de perfil
75efdbd docs: agrega README
```

Tres commits pasaron a ser dos, con mensajes claros. Como todo rebase, `rebase -i` crea commits nuevos: aplica la regla de oro. Úsalo en tu propia rama y, si ya la habías subido, actualízala con `git push --force-with-lease`. Si algo sale mal a mitad de camino, `git rebase --abort` también funciona aquí.

## Buenas prácticas profesionales

### Commits atómicos

Un commit atómico contiene **un único cambio lógico**: completo, y sin nada más.

- Mal: un commit que agrega la pantalla de login, arregla un error del carrito y cambia estilos en 15 archivos, con el mensaje "varios arreglos".
- Bien: tres commits, cada uno con un propósito y un mensaje que lo describe.

Por qué importa:

- Un Pull Request con commits atómicos se revisa commit por commit.
- Si un cambio rompe algo, lo deshaces con `git revert` (lo viste en [Deshacer cambios](/cursos/git/deshacer-cambios)) sin llevarte trabajo sano.
- Cuando buscas qué commit introdujo un error, el commit culpable es pequeño y fácil de entender.

### Encontrar el commit que rompió algo con git bisect

Supón que la tasa de impuestos aparece mal (`2.1` en lugar de `0.21`), sabes que en el primer commit estaba bien y no sabes cuándo se rompió:

```text
d51cd7c feat(pagos): agrega pagos
b38725a feat(cupones): agrega cupones
0018534 feat(descuentos): agrega descuentos
ff73773 feat(envio): agrega el envío
3b00b17 feat(carrito): agrega el carrito
8f425ec chore: agrega configuración
```

`git bisect` hace una búsqueda binaria en el historial: te lleva a un commit intermedio, tú dices si está bien o mal, y repite hasta encontrar el primero que está mal.

```bash
git bisect start
git bisect bad            # el commit actual tiene el error
git bisect good 8f425ec   # este commit estaba bien
```

```text
Bisecting: 2 revisions left to test after this (roughly 1 step)
[ff7377351c0c7d187a7be1034fa200cf1571dc17] feat(envio): agrega el envío
```

Git te dejó en `ff73773` (en detached HEAD, como cuando inspeccionabas un commit viejo). Pruebas el proyecto: aquí `config.js` tiene `0.21`, así que está bien:

```bash
git bisect good
```

```text
Bisecting: 0 revisions left to test after this (roughly 1 step)
[b38725aa9728af740bd7a7c4593af9565d8f93b0] feat(cupones): agrega cupones
```

Aquí ya aparece `2.1`:

```bash
git bisect bad
```

```text
Bisecting: 0 revisions left to test after this (roughly 0 steps)
[001853450c60781a09890b331a08c319a204d843] feat(descuentos): agrega descuentos
```

También está mal:

```bash
git bisect bad
```

```text
001853450c60781a09890b331a08c319a204d843 is the first bad commit
commit 001853450c60781a09890b331a08c319a204d843
Author: Ana <ana@example.com>
Date:   Sun Nov 22 01:18:42 2026 -0300

    feat(descuentos): agrega descuentos

 config.js   | 2 +-
 discount.js | 1 +
 2 files changed, 2 insertions(+), 1 deletion(-)
 create mode 100644 discount.js
```

Termina siempre con `git bisect reset`, que te devuelve a la rama donde estabas:

```bash
git bisect reset
```

Fíjate en el culpable: un commit de "descuentos" que además tocó `config.js`. Un commit no atómico esconde el error; si el cambio de la tasa hubiera tenido su propio commit, su mensaje ya lo habría delatado.

### Conventional Commits

**Conventional Commits** es un estándar de mensajes que hace el historial fácil de leer y permite que las herramientas generen versiones y notas de cambios automáticamente:

```text
<tipo>(<alcance opcional>): <descripción>

<cuerpo opcional>

<pie opcional>
```

- La **descripción** va en imperativo o en presente, corta y sin punto final: `agrega`, `corrige`, `elimina` (en inglés, `add`, `fix`, `remove`).
- El **alcance** indica la parte del proyecto afectada: `feat(carrito): ...`.
- El **cuerpo** explica el porqué, si hace falta.

Tipos habituales:

| Tipo | Cuándo usarlo | Ejemplo |
| :--- | :--- | :--- |
| `feat` | Una funcionalidad nueva | `feat(carrito): agrega envío gratis desde 10000` |
| `fix` | La corrección de un error | `fix(carrito): evita cantidades negativas` |
| `docs` | Solo documentación | `docs: explica cómo instalar el proyecto` |
| `style` | Formato sin cambio de comportamiento (espacios, comas, sangría) | `style: aplica el formato del linter` |
| `refactor` | Reestructura el código sin agregar funcionalidad ni corregir errores | `refactor(db): extrae el constructor de consultas` |
| `perf` | Mejora de rendimiento | `perf(catalogo): cachea la lista de productos` |
| `test` | Agrega o corrige pruebas | `test(auth): prueba la validación del token` |
| `build` | Sistema de compilación o dependencias | `build: actualiza astro a la versión 6` |
| `ci` | Configuración de integración continua | `ci: ejecuta las pruebas en cada Pull Request` |
| `chore` | Tareas de mantenimiento que no tocan el código de la aplicación | `chore: ignora la carpeta de logs` |

#### Cambios que rompen compatibilidad

Si un cambio obliga a quienes usan tu código a cambiar el suyo, márcalo con `!` después del tipo (o del alcance) y explícalo en un pie `BREAKING CHANGE:`:

```text
feat(api)!: elimina el endpoint /v1/pedidos

BREAKING CHANGE: los clientes deben usar /v2/pedidos, que devuelve los pedidos paginados.
```

Para escribir un mensaje con cuerpo o pie, puedes usar `git commit` sin `-m` (Git abre el editor) o varios `-m`, uno por párrafo:

```bash
git commit -m "feat(api)!: elimina el endpoint /v1/pedidos" -m "BREAKING CHANGE: los clientes deben usar /v2/pedidos, que devuelve los pedidos paginados."
```

### .gitignore

El archivo `.gitignore`, en la raíz del proyecto, le dice a Git qué archivos no debe rastrear. Se versiona como cualquier otro archivo, así todo el equipo ignora lo mismo.

```text
# Dependencias (se reinstalan con el gestor de paquetes)
node_modules/

# Resultado de la compilación
dist/

# Logs, excepto uno que sí queremos versionar
*.log
!importante.log

# Secretos y variables de entorno
.env
.env.local
*.pem
```

| Patrón | Significado |
| :--- | :--- |
| `dist/` | La carpeta `dist` y todo su contenido, en cualquier nivel |
| `*.log` | Cualquier archivo que termine en `.log` |
| `!importante.log` | Excepción: este archivo sí se rastrea |
| `/.env` | Solo el `.env` de la raíz, no los de subcarpetas |
| `# ...` | Comentario |

#### Ignorar no deja de rastrear

`.gitignore` solo afecta a los archivos **sin rastrear**. Si un archivo ya está en un commit, agregarlo a `.gitignore` no cambia nada: Git sigue viendo sus cambios. Por ejemplo, con `.env` ya confirmado:

```bash
echo ".env" >> .gitignore
git status --short
```

```text
 M .env
?? .gitignore
```

Para que Git deje de rastrearlo **sin borrarlo de tu disco**, quítalo del índice con `git rm --cached`:

```bash
git rm --cached .env
```

```text
rm '.env'
```

```bash
git status --short
```

```text
D  .env
?? .gitignore
```

La `D` en la primera columna significa "eliminado del staging": en el próximo commit, `.env` deja de estar en el repositorio, pero el archivo sigue en tu carpeta. Confirma los dos cambios juntos:

```bash
git add .gitignore
git commit -m "chore: deja de rastrear el archivo .env"
```

Para una carpeta entera, agrega `-r`: `git rm -r --cached logs/`.

#### Un gitignore global para tu sistema y tu editor

Archivos como `.DS_Store` (macOS), `Thumbs.db` (Windows) o `.vscode/` y `.idea/` (editores) dependen de **tu** computadora, no del proyecto. En lugar de agregarlos al `.gitignore` de cada repositorio, ponlos en un gitignore global:

```bash
# Crear el archivo con tus patrones personales
printf ".DS_Store\nThumbs.db\n.vscode/\n.idea/\n" > ~/.gitignore_global

# Decirle a Git que lo use en todos tus repositorios
git config --global core.excludesFile ~/.gitignore_global
```

Desde ese momento, `git status` deja de mostrar esos archivos en todos tus proyectos.

### Secretos

**Nunca subas contraseñas, tokens, llaves de API ni archivos `.env` a Git.** Si un secreto llega a un commit, borrarlo en el commit siguiente no alcanza: sigue en el historial y cualquiera con acceso al repositorio puede verlo. Y si ya lo subiste, reescribir el historial tampoco garantiza nada, porque otras personas o servicios pueden haberlo copiado.

Si te pasa:

1. **Revoca o rota el secreto de inmediato** (genera uno nuevo en el servicio y desactiva el viejo). Esto es lo único que realmente te protege.
2. Deja de rastrear el archivo con `git rm --cached` y agrégalo a `.gitignore`.
3. Para compartir la configuración, versiona un archivo de ejemplo sin valores reales, como `.env.example`.

### Revisar antes de confirmar

Antes de cada commit, revisa qué vas a incluir. Estos comandos los viste en [El principio con Git](/cursos/git/el-principio-con-git); aquí se juntan en un hábito.

#### git status --short

```bash
git status --short
```

```text
MM app.js
?? notas.txt
```

Cada línea tiene dos columnas: la primera es el **staging** y la segunda el **working tree**.

| Código | Significado |
| :--- | :--- |
| `M ` | Modificado y en staging |
| ` M` | Modificado, sin agregar al staging |
| `MM` | Una parte en staging y otra modificada después |
| `A ` | Archivo nuevo en staging |
| `D ` | Eliminado en staging |
| `??` | Sin rastrear |

#### git diff y git diff --staged

| Comando | Compara |
| :--- | :--- |
| `git diff` | Working tree contra **staging**: lo que todavía no agregaste |
| `git diff --staged` | Staging contra el **último commit**: lo que va a entrar en el próximo commit |
| `git diff HEAD` | Working tree contra el último commit: todo lo que cambiaste |

Un error común es creer que `git diff` compara contra el último commit: si ya agregaste todo con `git add`, `git diff` no muestra nada, aunque haya cambios listos para confirmar. Para ver eso usa `git diff --staged`.

#### git add -p: agregar por partes

Si en un archivo hiciste dos cambios que no tienen relación, `git add -p` (de *patch*) te muestra cada bloque de cambios (*hunk*) y te pregunta si lo agregas. Así armas commits atómicos aunque hayas trabajado en dos cosas a la vez.

```bash
git add -p
```

```text
diff --git a/app.js b/app.js
index ec9ab75..3f3e2d2 100644
--- a/app.js
+++ b/app.js
@@ -1,5 +1,5 @@
 function saludar() {
-  console.log('hola');
+  console.log('hola, mundo');
 }


(1/2) Stage this hunk [y,n,q,a,d,k,K,j,J,g,/,e,p,P,?]?
```

Las respuestas más usadas:

- `y`: agrega este bloque.
- `n`: no lo agregues.
- `s`: divide el bloque en bloques más pequeños, si se puede.
- `q`: termina sin preguntar por los bloques que faltan.
- `?`: muestra la ayuda.

Si respondes `y` al primer bloque y `n` al segundo, `git status --short` muestra `MM app.js`: `git diff --staged` muestra solo el primer cambio (lo que irá al commit) y `git diff` solo el segundo (lo que queda afuera).

No uses `git add .` a ciegas: primero `git status --short`, después `git diff`, y agrega lo que corresponde.

## Resumen de comandos

| Acción | Comando |
| :--- | :--- |
| Reaplicar tu rama sobre lo último del remoto | `git fetch` + `git rebase origin/main` |
| Continuar después de resolver un conflicto | `git add <archivo>` + `git rebase --continue` |
| Cancelar el rebase y volver al estado anterior | `git rebase --abort` |
| Quedarte con tu versión durante un rebase | `git restore --theirs <archivo>` |
| Subir tu propia rama después de un rebase | `git push --force-with-lease` |
| Reescribir los últimos 3 commits | `git rebase -i HEAD~3` |
| Buscar el commit que introdujo un error | `git bisect start`, `bad`, `good <hash>`, `reset` |
| Dejar de rastrear un archivo sin borrarlo | `git rm --cached <archivo>` |
| Usar un gitignore global | `git config --global core.excludesFile ~/.gitignore_global` |
| Ver el estado resumido | `git status --short` |
| Ver lo que no está en staging | `git diff` |
| Ver lo que va a entrar en el commit | `git diff --staged` |
| Agregar cambios por partes | `git add -p` |

## Ejercicios prácticos

Haz los ejercicios en una carpeta de práctica. No necesitas GitHub: en un repositorio local, `main` cumple el papel de `origin/main`.

### Ejercicio 1: rebase con conflicto

1. Crea un repositorio con un archivo `precio.txt` que diga `PRECIO = 100` y confírmalo en `main`.
2. Crea la rama `feature/oferta`, cambia la línea a `PRECIO = 80` y confírmalo.
3. Vuelve a `main`, cambia la línea a `PRECIO = 120` y confírmalo.
4. Vuelve a `feature/oferta` y haz rebase sobre `main`. Resuelve el conflicto quedándote con `PRECIO = 96` y termina el rebase.
5. Comprueba con `git log --oneline --graph --all` que el historial es lineal.

<details>
<summary>Ver solución</summary>

```bash
git init practica-rebase
cd practica-rebase
echo "PRECIO = 100" > precio.txt
git add precio.txt
git commit -m "feat: agrega el precio"

git switch -c feature/oferta
echo "PRECIO = 80" > precio.txt
git add precio.txt
git commit -m "feat(oferta): aplica el descuento"

git switch main
echo "PRECIO = 120" > precio.txt
git add precio.txt
git commit -m "fix: actualiza el precio"

git switch feature/oferta
git rebase main
```

El rebase se detiene con `CONFLICT (content): Merge conflict in precio.txt`. El archivo queda así:

```text
<<<<<<< HEAD
PRECIO = 120
=======
PRECIO = 80
>>>>>>> 0faced0 (feat(oferta): aplica el descuento)
```

Arriba está `main` (la nueva base) y abajo tu commit; el hash será otro en tu computadora. Deja solo `PRECIO = 96` y continúa:

```bash
echo "PRECIO = 96" > precio.txt
git add precio.txt
git rebase --continue
git log --oneline --graph --all
```

El grafo es una sola línea: `feat(oferta): aplica el descuento` quedó encima de `fix: actualiza el precio`. Si en el paso 4 te equivocas, `git rebase --abort` te devuelve al estado anterior.

</details>

### Ejercicio 2: unir commits con rebase -i

1. En una rama nueva `feature/contacto`, crea tres commits: uno que crea `contacto.html`, otro que le agrega un formulario y un tercero con el mensaje `wip` que corrige un error del formulario.
2. Con `git rebase -i`, une el commit `wip` al del formulario sin conservar su mensaje, y cambia el mensaje del primero a `feat(contacto): agrega la página de contacto`.
3. Comprueba que quedan dos commits.

<details>
<summary>Ver solución</summary>

```bash
git switch -c feature/contacto
echo "<h1>Contacto</h1>" > contacto.html
git add contacto.html
git commit -m "feat(contacto): pagina"
echo "<form></form>" >> contacto.html
git add contacto.html
git commit -m "feat(contacto): agrega el formulario"
echo "<!-- corrige el formulario -->" >> contacto.html
git add contacto.html
git commit -m "wip"

git rebase -i HEAD~3
```

En la lista de tareas, deja:

```text
reword <hash1> # feat(contacto): pagina
pick <hash2> # feat(contacto): agrega el formulario
fixup <hash3> # wip
```

Guarda y cierra. Cuando Git abra el mensaje del primer commit, cámbialo por `feat(contacto): agrega la página de contacto`. Luego:

```bash
git log --oneline
```

Muestra dos commits nuevos para la rama: `feat(contacto): agrega el formulario` y `feat(contacto): agrega la página de contacto`. Si hubieras usado `squash` en lugar de `fixup`, Git te habría dejado combinar los dos mensajes.

</details>

### Ejercicio 3: dejar de rastrear un archivo

1. En un repositorio, crea `.env` con `TOKEN=secreto` y confírmalo (por error).
2. Agrega `.env` a `.gitignore` y comprueba con `git status --short` que Git sigue viendo sus cambios si lo modificas.
3. Haz que Git deje de rastrearlo sin borrarlo de tu disco y confirma el cambio.
4. ¿Qué más tendrías que hacer si ese token fuera real y el repositorio estuviera en GitHub?

<details>
<summary>Ver solución</summary>

```bash
echo "TOKEN=secreto" > .env
git add .env
git commit -m "chore: agrega configuración"

echo ".env" >> .gitignore
echo "TOKEN=otro" > .env
git status --short
```

```text
 M .env
?? .gitignore
```

`.env` sigue apareciendo como modificado porque ya estaba rastreado. Quítalo del índice:

```bash
git rm --cached .env
git add .gitignore
git commit -m "chore: deja de rastrear el archivo .env"
git status --short
ls -a
```

`git status --short` ya no muestra `.env` y `ls -a` confirma que el archivo sigue en tu carpeta.

Si el token fuera real, todavía está en el historial (en el primer commit): tendrías que **revocarlo o rotarlo** en el servicio que lo emitió. Dejar de rastrearlo solo evita que vuelva a entrar.

</details>

### Ejercicio 4: commits atómicos con git add -p y Conventional Commits

1. En un archivo ya confirmado, haz dos cambios sin relación: corrige un error en una función y agrega un comentario de documentación en otra parte del archivo, lejos del primero.
2. Usa `git add -p` para confirmar cada cambio en su propio commit, con un mensaje Conventional Commits adecuado.
3. Escribe el mensaje que usarías para un cambio que renombra la opción `--color` de tu programa a `--tema`, de forma que quienes usaban `--color` tengan que cambiar sus scripts.

<details>
<summary>Ver solución</summary>

```bash
git add -p
```

Responde `y` al bloque de la corrección y `n` al del comentario. Revisa antes de confirmar:

```bash
git diff --staged   # solo la corrección
git commit -m "fix: corrige el cálculo del total"

git add -p          # ahora queda solo el bloque del comentario: responde y
git diff --staged   # solo el comentario
git commit -m "docs: documenta la función de envío"
```

Si los dos cambios aparecen en un mismo bloque, responde `s` para dividirlo.

Para el cambio incompatible:

```text
feat!: renombra la opción --color a --tema

BREAKING CHANGE: la opción --color ya no existe; usa --tema.
```

El `!` y el pie `BREAKING CHANGE:` avisan que quienes usan el programa tienen que cambiar algo.

</details>
