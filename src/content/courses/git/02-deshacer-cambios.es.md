---
course: 'git'
slug: 'deshacer-cambios'
title: 'Deshacer cambios'
description: 'Aprende a descartar cambios, corregir el último commit, revertir commits, mover HEAD con reset, inspeccionar commits viejos y recuperar trabajo con reflog.'
order: 2
lang: 'es'
published: true
---

# Deshacer cambios

Equivocarse es parte del trabajo. Lo importante es saber **qué** quieres deshacer y **dónde** está ese cambio: en el working tree, en el staging o ya en un commit. Cada caso tiene su comando.

En esta lección aprenderás a:

- Descartar cambios de un archivo con `git restore`.
- Sacar un archivo del staging con `git restore --staged`.
- Corregir el último commit con `git commit --amend`.
- Ver un commit con `git show` y deshacerlo con `git revert`.
- Mover `HEAD` hacia atrás con `git reset --soft`, `--mixed` y `--hard`.
- Recuperar un commit "perdido" con `git reflog`.
- Visitar un commit viejo con `git switch --detach` y traer un archivo del pasado con `git restore --source`.

## El proyecto de ejemplo

Toda la lección es un único ejemplo que puedes ejecutar de principio a fin. Empieza con un repositorio nuevo en otra carpeta, como en la lección anterior:

```bash
mkdir practica-deshacer
cd practica-deshacer
git init
echo "Hola mundo" > saludo.txt
git add saludo.txt
git commit -m "Agrega saludo inicial"
```

```text
[main (root-commit) 426061e] Agrega saludo inicial
 1 file changed, 1 insertion(+)
 create mode 100644 saludo.txt
```

Tus hashes serán distintos a los de esta lección, porque dependen del autor y de la fecha. Usa siempre los que te muestre tu terminal. Si tu Git está configurado en español, los mensajes también se verán traducidos.

## Descartar cambios en el working tree: `git restore`

Supón que modificas `saludo.txt` por error:

```bash
echo "Texto borrado sin querer" > saludo.txt
git status
```

```text
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   saludo.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

El propio `git status` te sugiere la salida. `git restore <archivo>` deja el archivo como está en el último commit:

```bash
git restore saludo.txt
cat saludo.txt
```

```text
Hola mundo
```

> **Atención:** `git restore <archivo>` es destructivo. Los cambios que no guardaste en un commit se pierden para siempre: Git nunca los registró, así que no hay forma de recuperarlos. Úsalo solo cuando estés seguro.

`git restore` solo afecta a archivos que Git ya sigue. Un archivo nuevo que nunca agregaste no se toca.

## Sacar un archivo del staging: `git restore --staged`

Ya lo viste en la lección anterior. Si hiciste `git add` de algo que no querías incluir en el próximo commit:

```bash
echo "Texto borrado sin querer" > saludo.txt
git add saludo.txt
git restore --staged saludo.txt
git status
```

```text
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   saludo.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

`--staged` no borra nada: el cambio sigue en tu working tree. Si además quieres descartarlo, combina los dos pasos:

```bash
git restore saludo.txt
```

## Corregir el último commit: `git commit --amend`

### Cambiar el mensaje

Haces un commit con un error de tipeo en el mensaje:

```bash
echo "Chau" > despedida.txt
git add despedida.txt
git commit -m "Agrega despedia"
```

```text
[main 20633b9] Agrega despedia
 1 file changed, 1 insertion(+)
 create mode 100644 despedida.txt
```

`--amend` reemplaza el último commit por uno nuevo con el mensaje corregido:

```bash
git commit --amend -m "Agrega despedida"
```

```text
[main cf59d35] Agrega despedida
 Date: Tue Mar 10 10:17:00 2026 +0000
 1 file changed, 1 insertion(+)
 create mode 100644 despedida.txt
```

### Agregar un archivo olvidado

También olvidaste incluir `firma.txt`. Lo agregas al staging y haces `--amend` sin cambiar el mensaje con `--no-edit`:

```bash
echo "Ana" > firma.txt
git add firma.txt
git commit --amend --no-edit
git log --oneline
```

```text
[main ad7fc4f] Agrega despedida
 Date: Tue Mar 10 10:17:00 2026 +0000
 2 files changed, 2 insertions(+)
 create mode 100644 despedida.txt
 create mode 100644 firma.txt
ad7fc4f Agrega despedida
426061e Agrega saludo inicial
```

Fíjate en el hash: pasó de `20633b9` a `cf59d35` y luego a `ad7fc4f`. `--amend` no edita el commit: crea uno nuevo y descarta el anterior del historial.

> **Regla:** usa `--amend` solo en commits que todavía no compartiste con otras personas. Si alguien ya tiene ese commit, tu historial y el suyo dejan de coincidir. Verás cómo se comparte el trabajo en la lección [Bajar y subir cambios](/cursos/git/bajar-y-subir-cambios).

## Ver un commit: `git show`

Ahora haces un cambio que después vas a querer deshacer:

```bash
echo "Hello world" > saludo.txt
git add saludo.txt
git commit -m "Cambia saludo a inglés"
git log --oneline
```

```text
10fe8c7 Cambia saludo a inglés
ad7fc4f Agrega despedida
426061e Agrega saludo inicial
```

`git show <hash>` muestra los datos del commit y exactamente qué cambió:

```bash
git show 10fe8c7
```

```text
commit 10fe8c7afb707fa7253ebbddc71b1d5e089345bc
Author: Ana <ana@example.com>
Date:   Tue Mar 10 10:25:00 2026 +0000

    Cambia saludo a inglés

diff --git a/saludo.txt b/saludo.txt
index 2d9b695..802992c 100644
--- a/saludo.txt
+++ b/saludo.txt
@@ -1 +1 @@
-Hola mundo
+Hello world
```

Las líneas con `-` son las que se quitaron y las líneas con `+` las que se agregaron.

## Deshacer un commit sin reescribir el historial: `git revert`

`git revert <hash>` crea un **commit nuevo** que aplica el cambio inverso. El commit original sigue en el historial:

```bash
git revert 10fe8c7
```

Git abre tu editor con el mensaje `Revert "Cambia saludo a inglés"`. Guarda y cierra:

```text
[main 946f52b] Revert "Cambia saludo a inglés"
 Date: Tue Mar 10 10:28:00 2026 +0000
 1 file changed, 1 insertion(+), 1 deletion(-)
```

```bash
cat saludo.txt
git log --oneline
```

```text
Hola mundo
946f52b Revert "Cambia saludo a inglés"
10fe8c7 Cambia saludo a inglés
ad7fc4f Agrega despedida
426061e Agrega saludo inicial
```

Como `revert` solo **agrega** un commit, es la forma segura de deshacer commits que ya compartiste con otras personas. Puedes revertir cualquier commit, no solo el último.

## Mover HEAD hacia atrás: `git reset`

`HEAD` señala el commit en el que estás parado. `git reset` mueve `HEAD` a otro commit, y los commits que quedan "adelante" salen del historial. La opción que elijas decide qué pasa con los cambios de esos commits.

`HEAD~1` significa "el padre de `HEAD`", es decir, un commit atrás.

Crea un commit para practicar:

```bash
echo "Comprar pan" > tareas.txt
git add tareas.txt
git commit -m "Agrega lista de tareas"
```

<figure class="diagram">
<svg viewBox="0 0 740 360" role="img" aria-labelledby="d-git-reset-l2-t">
<title id="d-git-reset-l2-t">Los tres modos de git reset HEAD~1: dónde quedan los cambios del commit deshecho</title>
<defs>
  <marker id="ar-reset-l2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
</defs>

<text x="215" y="34" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Repositorio (HEAD)</text>
<text x="425" y="34" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Staging</text>
<text x="635" y="34" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Working tree</text>

<!-- soft -->
<text x="20" y="95" font-size="13" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">--soft</text>
<rect x="130" y="62" width="170" height="56" rx="14" fill="var(--color-accent-100)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="215" y="95" font-size="12" text-anchor="middle" fill="var(--color-accent-800)">retrocede 1 commit</text>
<rect x="340" y="62" width="170" height="56" rx="14" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="425" y="95" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">los cambios quedan aquí</text>
<rect x="550" y="62" width="170" height="56" rx="14" fill="var(--color-surface)" stroke="var(--color-neutral-300)" stroke-width="2"/>
<text x="635" y="95" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">sin cambios</text>
<path d="M 300 90 L 336 90" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" marker-end="url(#ar-reset-l2)"/>

<!-- mixed -->
<text x="20" y="185" font-size="13" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">--mixed</text>
<text x="20" y="203" font-size="11" fill="var(--color-neutral-600)">(por defecto)</text>
<rect x="130" y="162" width="170" height="56" rx="14" fill="var(--color-accent-100)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="215" y="195" font-size="12" text-anchor="middle" fill="var(--color-accent-800)">retrocede 1 commit</text>
<rect x="340" y="162" width="170" height="56" rx="14" fill="var(--color-surface)" stroke="var(--color-neutral-300)" stroke-width="2"/>
<text x="425" y="195" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">igual a HEAD</text>
<rect x="550" y="162" width="170" height="56" rx="14" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="635" y="195" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">los cambios quedan aquí</text>
<path d="M 215 218 C 215 240, 635 240, 635 222" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" marker-end="url(#ar-reset-l2)"/>

<!-- hard -->
<text x="20" y="295" font-size="13" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">--hard</text>
<rect x="130" y="262" width="170" height="56" rx="14" fill="var(--color-accent-100)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="215" y="295" font-size="12" text-anchor="middle" fill="var(--color-accent-800)">retrocede 1 commit</text>
<rect x="340" y="262" width="170" height="56" rx="14" fill="var(--color-surface)" stroke="var(--color-neutral-300)" stroke-width="2"/>
<text x="425" y="295" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">igual a HEAD</text>
<rect x="550" y="262" width="170" height="56" rx="14" fill="var(--color-surface)" stroke="var(--color-accent-700)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="635" y="288" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">igual a HEAD</text>
<text x="635" y="306" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">los cambios se pierden</text>

<text x="20" y="348" font-size="11" fill="var(--color-neutral-600)">El commit deshecho sigue en git reflog y se puede recuperar en los tres casos.</text>
</svg>
<figcaption>Con <code>git reset HEAD~1</code>, HEAD retrocede en los tres modos. La diferencia es dónde quedan los cambios del commit deshecho.</figcaption>
</figure>

| Modo | HEAD | Staging | Working tree | Para qué sirve |
| --- | --- | --- | --- | --- |
| `--soft` | Retrocede | Conserva los cambios del commit | No cambia | Rehacer el commit (por ejemplo, unir varios en uno) |
| `--mixed` | Retrocede | Queda igual a HEAD | Conserva los cambios del commit | Volver a elegir qué agregar con `git add` |
| `--hard` | Retrocede | Queda igual a HEAD | Queda igual a HEAD | Descartar el commit y todo cambio sin commit |

### `git reset --soft`

```bash
git reset --soft HEAD~1
git status
```

```text
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   tareas.txt
```

El commit desapareció del historial, pero sus cambios están en el staging, listos para un nuevo commit. Vuelve a hacerlo para seguir practicando:

```bash
git commit -m "Agrega lista de tareas"
```

### `git reset --mixed`

Es el modo por defecto: `git reset HEAD~1` hace lo mismo.

```bash
git reset --mixed HEAD~1
git status
```

```text
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	tareas.txt

nothing added to commit but untracked files present (use "git add" to track)
```

Los cambios quedan solo en el working tree. Como `tareas.txt` era nuevo, Git lo muestra como un archivo sin seguimiento. Vuelve a crear el commit:

```bash
git add tareas.txt
git commit -m "Agrega lista de tareas"
```

### `git reset --hard`

```bash
git reset --hard HEAD~1
ls
git log --oneline
```

```text
HEAD is now at 946f52b Revert "Cambia saludo a inglés"
despedida.txt
firma.txt
saludo.txt
946f52b Revert "Cambia saludo a inglés"
10fe8c7 Cambia saludo a inglés
ad7fc4f Agrega despedida
426061e Agrega saludo inicial
```

`tareas.txt` ya no existe. `--hard` también descarta cualquier cambio sin commit de los archivos que Git sigue, y esos cambios **no se pueden recuperar**.

> **Cuidado:** `reset` reescribe el historial igual que `--amend`. No lo uses sobre commits que ya compartiste con otras personas: para esos usa `git revert`.

## Recuperar un commit con `git reflog`

El commit "Agrega lista de tareas" parece perdido, pero Git guarda un registro local de cada lugar por el que pasó `HEAD`:

```bash
git reflog
```

```text
946f52b HEAD@{0}: reset: moving to HEAD~1
6b8f501 HEAD@{1}: commit: Agrega lista de tareas
946f52b HEAD@{2}: reset: moving to HEAD~1
958d100 HEAD@{3}: commit: Agrega lista de tareas
946f52b HEAD@{4}: reset: moving to HEAD~1
0fd046b HEAD@{5}: commit: Agrega lista de tareas
946f52b HEAD@{6}: revert: Revert "Cambia saludo a inglés"
10fe8c7 HEAD@{7}: commit: Cambia saludo a inglés
ad7fc4f HEAD@{8}: commit (amend): Agrega despedida
cf59d35 HEAD@{9}: commit (amend): Agrega despedida
20633b9 HEAD@{10}: commit: Agrega despedia
426061e HEAD@{11}: commit (initial): Agrega saludo inicial
```

Cada línea es un movimiento, del más reciente al más viejo. El commit que borraste con `--hard` es `6b8f501`. Vuelve a él:

```bash
git reset --hard 6b8f501
ls
```

```text
HEAD is now at 6b8f501 Agrega lista de tareas
despedida.txt
firma.txt
saludo.txt
tareas.txt
```

Ahora puedes precisar qué se puede recuperar y qué no:

- Lo que estuvo en un commit casi siempre se recupera con `git reflog`, aunque lo hayas sacado del historial con `reset` o `--amend`. El reflog es local y Git limpia sus entradas viejas después de un tiempo (90 días por defecto).
- Lo que nunca estuvo en un commit se pierde con `git restore <archivo>` o `git reset --hard`. Haz commits seguido.

## Visitar un commit viejo: `git switch --detach`

A veces quieres ver el proyecto tal como estaba en un commit anterior, sin cambiar nada. `git switch --detach <hash>` mueve `HEAD` a ese commit:

```bash
git switch --detach 426061e
ls
git status
```

```text
HEAD is now at 426061e Agrega saludo inicial
saludo.txt
HEAD detached at 426061e
nothing to commit, working tree clean
```

Tu working tree ahora es el del primer commit: solo existe `saludo.txt`. Esto se llama **detached HEAD** ("HEAD desacoplado"): normalmente `HEAD` apunta a `main`, y `main` apunta al último commit. Ahora `HEAD` apunta directamente a un commit, fuera de `main`.

Puedes mirar archivos, compilar o ejecutar pruebas. Evita hacer commits aquí: no quedarían en `main` y sería fácil perderlos de vista. Cuando termines, vuelve:

```bash
git switch main
```

```text
Previous HEAD position was 426061e Agrega saludo inicial
Switched to branch 'main'
```

En la lección [Ramas, fusión y conflictos](/cursos/git/conflictos) verás qué es exactamente `main` y cómo trabajar con otras ramas.

## Traer un archivo del pasado: `git restore --source`

Si solo necesitas **un archivo** como estaba en otro commit, no hace falta moverte. Primero amplía el saludo:

```bash
echo "¿Cómo estás?" >> saludo.txt
git add saludo.txt
git commit -m "Amplía el saludo"
```

Decides que preferías el saludo original. `--source=<hash>` le dice a `restore` de qué commit tomar el archivo:

```bash
git restore --source=426061e saludo.txt
cat saludo.txt
git status
```

```text
Hola mundo
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   saludo.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

El archivo cambió solo en tu working tree. Si te convence, guárdalo con un commit nuevo:

```bash
git add saludo.txt
git commit -m "Vuelve al saludo original"
git log --oneline
```

```text
7b3c9fb Vuelve al saludo original
484d1b7 Amplía el saludo
6b8f501 Agrega lista de tareas
946f52b Revert "Cambia saludo a inglés"
10fe8c7 Cambia saludo a inglés
ad7fc4f Agrega despedida
426061e Agrega saludo inicial
```

## Qué comando usar

| Quiero deshacer... | Comando | ¿Reescribe el historial? |
| --- | --- | --- |
| Cambios de un archivo que no agregué al staging | `git restore <archivo>` | No, pero los cambios se pierden |
| Un archivo que agregué al staging por error | `git restore --staged <archivo>` | No |
| El mensaje o un archivo olvidado del último commit | `git commit --amend` | Sí |
| Un commit que ya compartí | `git revert <hash>` | No |
| El último commit, conservando sus cambios en el staging | `git reset --soft HEAD~1` | Sí |
| El último commit, conservando sus cambios en el working tree | `git reset --mixed HEAD~1` | Sí |
| El último commit y todos sus cambios | `git reset --hard HEAD~1` | Sí, y los cambios sin commit se pierden |
| Un reset o un amend que no debí hacer | `git reflog` y luego `git reset --hard <hash>` | Sí |
| Nada: solo quiero ver un commit viejo | `git switch --detach <hash>` y luego `git switch main` | No |
| Un archivo, para dejarlo como en otro commit | `git restore --source=<hash> <archivo>` | No |

## Ejercicios prácticos

Usa el repositorio `practica-deshacer` de esta lección o crea uno nuevo.

### Ejercicio 1: descartar un cambio

Agrega la línea `Línea de prueba` al final de `despedida.txt`. Comprueba con `git diff` qué cambió y luego descarta el cambio. Verifica que `git status` diga que no hay nada que confirmar.

<details>
<summary>Ver solución</summary>

```bash
echo "Línea de prueba" >> despedida.txt
git diff
git restore despedida.txt
git status
```

`git status` debe mostrar `nothing to commit, working tree clean`. El cambio se perdió para siempre porque nunca estuvo en un commit.

</details>

### Ejercicio 2: corregir el último commit

Crea `contacto.txt` con tu correo y haz un commit con el mensaje `Agrega contato`. Después crea `horario.txt`, que también debía ir en ese commit. Deja un único commit `Agrega contacto` con los dos archivos.

<details>
<summary>Ver solución</summary>

```bash
echo "ana@example.com" > contacto.txt
git add contacto.txt
git commit -m "Agrega contato"
echo "Lunes a viernes" > horario.txt
git add horario.txt
git commit --amend -m "Agrega contacto"
git show --stat HEAD
```

`git show --stat HEAD` muestra el commit `Agrega contacto` con `contacto.txt` y `horario.txt`. Esto es correcto solo porque todavía no compartiste ese commit.

</details>

### Ejercicio 3: revertir un commit viejo

Imagina que el commit `Agrega despedida` ya lo compartiste con tu equipo y ahora hay que quitar `despedida.txt` y `firma.txt`. Deshazlo sin reescribir el historial.

<details>
<summary>Ver solución</summary>

```bash
git log --oneline
git revert <hash-de-agrega-despedida>
git log --oneline
ls
```

Aparece un commit nuevo `Revert "Agrega despedida"` y los dos archivos ya no están. El commit original sigue en el historial, así que nadie pierde nada.

</details>

### Ejercicio 4: rescatar un commit borrado

Haz un commit cualquiera, bórralo con `git reset --hard HEAD~1` y recupéralo.

<details>
<summary>Ver solución</summary>

```bash
echo "Llamar a Luis" >> tareas.txt
git add tareas.txt
git commit -m "Agrega tarea pendiente"
git reset --hard HEAD~1
git reflog
git reset --hard <hash-de-agrega-tarea-pendiente>
git log --oneline
```

En `git reflog` el commit aparece como `commit: Agrega tarea pendiente`. Al volver con `git reset --hard <hash>`, `git log --oneline` lo muestra otra vez en la punta del historial.

</details>

### Ejercicio 5: comparar con el pasado

Sin hacer commits, mira cómo era `saludo.txt` en el primer commit. Después vuelve a `main`.

<details>
<summary>Ver solución</summary>

```bash
git log --oneline
git switch --detach <hash-del-primer-commit>
cat saludo.txt
git status
git switch main
```

`git status` muestra `HEAD detached at <hash>` mientras estás en el commit viejo. `git switch main` te devuelve al último commit. Otra opción sin moverte es `git show <hash>:saludo.txt`, que imprime el archivo de ese commit.

</details>
