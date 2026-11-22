---
title: 'Bajar y subir cambios'
course: 'git'
slug: 'bajar-y-subir-cambios'
description: 'Conecta tu repositorio con GitHub, autentícate con HTTPS o SSH y sincroniza tu trabajo con push, fetch y pull, resolviendo los errores más comunes.'
order: 4
lang: 'es'
published: true
---

# Bajar y subir cambios: repositorios remotos y GitHub

Hasta ahora todo tu trabajo vivió en tu computadora. En esta lección conectas tu repositorio con una copia en GitHub, publicas tus commits y traes los de otras personas sin perder nada en el camino.

En esta lección aprenderás:

1. Qué es un repositorio remoto y qué significan `origin` y `origin/main`.
2. Cómo autenticarte en GitHub con HTTPS o con SSH.
3. Cómo publicar tu repositorio con `git push -u origin main` y copiar uno existente con `git clone`.
4. Cómo ver qué cambió en el remoto con `git fetch` y traerlo con `git pull`.
5. Cómo salir de los errores más comunes: push rechazado, ramas divergentes y cambios locales que se sobrescribirían.

Para concentrarte en la sincronización, en toda la lección trabajas directamente en `main`. En un equipo real lo habitual es trabajar en ramas y proponer los cambios con Pull Requests: ese flujo llega en la lección 5, [Ramas y Pull Requests](/cursos/git/ramas-y-pull-requests).

## Local y remoto

Un **repositorio remoto** es otra copia del mismo repositorio, guardada en otro lugar: normalmente un servidor como GitHub. Tu copia local y la remota tienen su propio historial, y Git no las sincroniza solo: tú decides cuándo enviar y cuándo traer commits.

- `origin` es el nombre corto (alias) que Git usa por convención para el remoto principal. En lugar de escribir la URL completa, escribes `origin`.
- `main` es tu rama local.
- `origin/main` es una **rama de seguimiento remoto**: la foto que tu repositorio guarda de dónde estaba `main` en `origin` la última vez que te comunicaste con él. Solo se actualiza cuando ejecutas `git fetch`, `git pull` o `git push`.

<figure class="diagram">
<svg viewBox="0 0 720 270" role="img" aria-labelledby="d-git-sync-l4-t">
<title id="d-git-sync-l4-t">Sincronización entre el repositorio local y el remoto origin</title>
<defs>
  <marker id="ar-push-l4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-fetch-l4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
  <marker id="ar-pull-l4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-700)"/>
  </marker>
</defs>

<!-- Local repository -->
<rect x="20" y="25" width="280" height="220" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)" stroke-width="2"/>
<text x="160" y="55" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Repositorio local (tu PC)</text>
<rect x="40" y="75" width="240" height="42" rx="10" fill="var(--color-bg)" stroke="var(--color-divider)"/>
<text x="55" y="101" font-size="12" font-family="monospace" fill="var(--color-text)">Working tree y staging</text>
<rect x="40" y="130" width="240" height="42" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="55" y="156" font-size="12" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">Rama local: main</text>
<rect x="40" y="185" width="240" height="42" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="55" y="211" font-size="12" font-family="monospace" fill="var(--color-neutral-700)">Seguimiento: origin/main</text>

<!-- Remote repository -->
<rect x="420" y="25" width="280" height="220" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="560" y="55" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Remoto origin (GitHub)</text>
<rect x="440" y="100" width="240" height="85" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="560" y="135" font-size="13" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">main</text>
<text x="560" y="160" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Historial compartido</text>

<!-- Push: local main -> remote main -->
<path d="M 280 138 L 414 138" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-push-l4)"/>
<text x="360" y="129" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git push</text>

<!-- Pull: remote -> local main (fetch + merge) -->
<path d="M 420 164 L 286 164" fill="none" stroke="var(--color-accent-700)" stroke-width="2.5" marker-end="url(#ar-pull-l4)"/>
<text x="360" y="181" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git pull</text>

<!-- Fetch: remote -> origin/main only -->
<path d="M 420 214 L 286 214" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#ar-fetch-l4)"/>
<text x="360" y="206" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">git fetch</text>
</svg>
<figcaption><code>git push</code> envía los commits de tu <code>main</code> al remoto. <code>git fetch</code> solo actualiza <code>origin/main</code>, sin tocar tus archivos. <code>git pull</code> hace un fetch y además integra <code>origin/main</code> en tu <code>main</code>.</figcaption>
</figure>

> Los mensajes de Git de esta lección están en inglés, como en la mayoría de las instalaciones. Si tu sistema está en español, verás los mismos mensajes traducidos.

## Autenticarte en GitHub

Para subir commits a GitHub, el servidor tiene que saber quién eres. Hay dos formas de conectarte, y cada una usa una URL distinta para el mismo repositorio:

- HTTPS: `https://github.com/ana/mi-proyecto.git`
- SSH: `git@github.com:ana/mi-proyecto.git`

### HTTPS con un token personal

GitHub **no acepta la contraseña de tu cuenta** para operaciones de Git. Cuando Git te pida una contraseña, tienes que pegar un **token de acceso personal** (*personal access token*):

1. En GitHub, ve a Settings → Developer settings → Personal access tokens.
2. Genera un token con permiso de escritura sobre el contenido de tus repositorios y cópialo (GitHub lo muestra una sola vez).
3. La primera vez que hagas `git push`, escribe tu usuario y pega el token como contraseña.

El gestor de credenciales de tu sistema (el llavero en macOS, Git Credential Manager en Windows) guarda el token para que no tengas que repetirlo.

### HTTPS con GitHub CLI

La forma más simple con HTTPS es la herramienta oficial de GitHub, `gh` (GitHub CLI). Después de instalarla, ejecuta:

```bash
# Inicia sesión en GitHub y configura Git para usar esas credenciales
gh auth login
```

El asistente te pregunta a qué cuenta entrar, si prefieres HTTPS o SSH, y abre el navegador para autorizarte. Al terminar, `gh` guarda las credenciales y Git las usa en cada `push` y `pull`.

### SSH con una clave

Con SSH te identificas con un par de claves: una privada, que nunca sale de tu computadora, y una pública, que le das a GitHub.

1. Genera la clave:

```bash
# Crea un par de claves de tipo ed25519 con tu email como comentario
ssh-keygen -t ed25519 -C "ana@example.com"
```

Presiona Enter para guardarla en la ubicación por defecto (`~/.ssh/id_ed25519`) y elige una frase de contraseña (*passphrase*) para protegerla.

2. Muestra la clave **pública** y cópiala completa. Es una sola línea que empieza con `ssh-ed25519` y termina con tu email:

```bash
cat ~/.ssh/id_ed25519.pub
```

3. En GitHub, ve a Settings → SSH and GPG keys → New SSH key, pega la clave y guárdala.
4. Prueba la conexión:

```bash
ssh -T git@github.com
```

La primera vez, SSH te pide confirmar la huella del servidor: compárala con las huellas que GitHub publica en su documentación y responde `yes`. Si todo está bien, GitHub responde con un saludo del estilo `Hi ana! You've successfully authenticated, but GitHub does not provide shell access.`

Desde ahora usa la URL SSH (`git@github.com:usuario/repositorio.git`) para tus repositorios. En los ejemplos de esta lección usamos SSH.

## Conectar tu repositorio con GitHub

Ana tiene un repositorio local con un commit:

```text
[main (root-commit) 8e2a90d] Agrega README
 1 file changed, 7 insertions(+)
 create mode 100644 README.md
```

### Crear el repositorio vacío en GitHub

En GitHub, usa el botón **+** → New repository, ponle un nombre (`mi-proyecto`) y créalo **vacío**: sin README, sin `.gitignore` y sin licencia. Si GitHub crea un primer commit, el remoto tendrá trabajo que tú no tienes y tu primer push será rechazado.

### Registrar el remoto

```bash
# Registra el remoto con el alias origin
git remote add origin git@github.com:ana/mi-proyecto.git

# Lista los remotos configurados
git remote -v
```

```text
origin	git@github.com:ana/mi-proyecto.git (fetch)
origin	git@github.com:ana/mi-proyecto.git (push)
```

### El primer push

```bash
# Sube main a origin y deja configurado el seguimiento
git push -u origin main
```

Git muestra unas líneas de progreso y termina con:

```text
To github.com:ana/mi-proyecto.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

- `origin` es el remoto al que subes.
- `main` es la rama que subes.
- `-u` (`--set-upstream`) guarda la relación entre tu `main` y `origin/main`. Por eso la última línea dice que `main` ahora sigue a `origin/main`.

Gracias a `-u`, desde ahora te alcanza con `git push` y `git pull`, sin repetir el remoto ni la rama. Además, `git status` compara tu rama con `origin/main`:

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

## Clonar un repositorio

Beto, compañero de Ana, quiere su propia copia. No necesita `git init` ni `git remote add`: `git clone` descarga el repositorio completo con todo su historial.

```bash
# Copia el repositorio en la carpeta beto
git clone git@github.com:ana/mi-proyecto.git beto
```

```text
Cloning into 'beto'...
```

Si no indicas la carpeta, Git usa el nombre del repositorio (`mi-proyecto`). El clon ya tiene el remoto `origin` configurado y su `main` ya sigue a `origin/main`, así que Beto puede usar `git push` y `git pull` directamente.

## Ver qué hay de nuevo con `git fetch`

Beto agrega un archivo y lo sube:

```text
[main 670e72e] Agrega lista de tareas
 1 file changed, 1 insertion(+)
 create mode 100644 tareas.txt
```

```text
To github.com:ana/mi-proyecto.git
   8e2a90d..670e72e  main -> main
```

En la computadora de Ana, `git status` todavía dice que todo está al día:

```text
On branch main
Your branch is up to date with 'origin/main'.
```

No es un error: `git status` compara con `origin/main`, y `origin/main` es la foto de la última vez que Ana habló con GitHub. Para actualizar esa foto sin tocar sus archivos, Ana usa `git fetch`:

```bash
# Descarga los commits nuevos y actualiza origin/main
git fetch
```

```text
From github.com:ana/mi-proyecto
   8e2a90d..670e72e  main       -> origin/main
```

Ahora `git status` cuenta la verdad:

```text
On branch main
Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.
  (use "git pull" to update your local branch)
```

Para ver exactamente qué commits llegaron, usa `git log main..origin/main`: lista los commits que están en `origin/main` y todavía no están en `main`. Con `--oneline` el resultado es más corto:

```bash
git log --oneline main..origin/main
```

```text
670e72e Agrega lista de tareas
```

`git fetch` nunca modifica tu rama ni tus archivos: es la forma segura de mirar antes de integrar.

## Traer e integrar con `git pull`

`git pull` hace dos cosas seguidas:

1. `git fetch`: descarga los commits nuevos y actualiza `origin/main`.
2. Integra `origin/main` en tu rama actual con un merge, como el que viste en la lección 3.

```bash
git pull
```

```text
Updating 8e2a90d..670e72e
Fast-forward
 tareas.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 tareas.txt
```

Como Ana no tenía commits propios, el merge es un **fast-forward**: Git solo adelanta `main` hasta `origin/main`.

El caso contrario es cuando tú tienes commits que el remoto no tiene. Ana agrega una tarea y hace commit:

```text
[main 1bc10be] Agrega tarea de SSH
 1 file changed, 1 insertion(+)
```

`git status` le avisa que está adelantada:

```text
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)
```

Y `git push` lo publica:

```text
To github.com:ana/mi-proyecto.git
   670e72e..1bc10be  main -> main
```

## Cuando el push es rechazado

Mientras tanto, Beto cambió el título del README e hizo commit sin traer antes el trabajo de Ana:

```text
[main b47f806] Cambia el título del README
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Al hacer `git push`, GitHub lo rechaza:

```text
To github.com:ana/mi-proyecto.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'github.com:ana/mi-proyecto.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

Un push solo puede **adelantar** la rama remota (un fast-forward). El `main` de GitHub tiene el commit de Ana, que Beto no tiene; si GitHub aceptara el push, ese commit desaparecería de la rama. Por eso lo rechaza y no se pierde nada.

Si Beto ya hubiera hecho `git fetch`, el motivo diría `(non-fast-forward)` en lugar de `(fetch first)`. Es la misma situación y tiene la misma solución:

1. `git pull` para integrar el trabajo del remoto.
2. `git push` para publicar el resultado.

No intentes forzar el push para "ganar": borrarías el trabajo de tu compañero en el remoto.

## Ramas divergentes

Beto hace `git pull`, pero Git se detiene:

```text
From github.com:ana/mi-proyecto
   670e72e..1bc10be  main       -> origin/main
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.
```

El fetch sí se hizo (lo muestra la primera línea), pero la integración no. `git status` explica por qué:

```text
On branch main
Your branch and 'origin/main' have diverged,
and have 1 and 1 different commits each, respectively.
  (use "git pull" if you want to integrate the remote branch with yours)
```

`main` y `origin/main` **divergieron**: cada uno tiene un commit que el otro no tiene, así que un fast-forward ya no alcanza. Git necesita saber cómo quieres unirlos y no elige por ti. Configúralo una vez para todos tus repositorios:

```bash
# Integra con un merge cuando las ramas divergen
git config --global pull.rebase false
```

- `pull.rebase false` une las dos historias con un **merge commit**, exactamente como en la lección 3. Es la opción que usamos en este curso.
- `git pull --ff-only` (o `git config --global pull.ff only`) es la opción estricta: solo acepta fast-forwards y, si las ramas divergen, se detiene sin cambiar nada para que decidas tú.
- La tercera opción, rebase, se explica en la lección 6, [Rebase y buenas prácticas en Git](/cursos/git/rebase-y-buenas-practicas).

Con la configuración hecha, Beto repite el pull. Git abre el editor con el mensaje del merge commit ya escrito (`Merge branch 'main' of github.com:ana/mi-proyecto`); guarda y cierra, igual que en la lección 3:

```text
Merge made by the 'ort' strategy.
 tareas.txt | 1 +
 1 file changed, 1 insertion(+)
```

```bash
git log --oneline --graph
```

```text
*   0a7d96a Merge branch 'main' of github.com:ana/mi-proyecto
|\  
| * 1bc10be Agrega tarea de SSH
* | b47f806 Cambia el título del README
|/  
* 670e72e Agrega lista de tareas
* 8e2a90d Agrega README
```

Ahora el `main` de Beto contiene todo lo que hay en el remoto, así que su push es un fast-forward y se acepta:

```text
To github.com:ana/mi-proyecto.git
   1bc10be..0a7d96a  main -> main
```

## Cambios locales que el pull sobrescribiría

Ana está editando el README (agregó una línea al final) y todavía no hizo commit. Hace `git pull` para traer el merge de Beto:

```text
From github.com:ana/mi-proyecto
   1bc10be..0a7d96a  main       -> origin/main
Updating 1bc10be..0a7d96a
error: Your local changes to the following files would be overwritten by merge:
	README.md
Please commit your changes or stash them before you merge.
Aborting
```

La causa: Ana tiene cambios sin commit en un **archivo** que el pull necesita modificar (`README.md`, cuyo título cambió Beto). No importa si las líneas son las mismas o no: basta con que el archivo esté modificado en tu working tree. Los cambios sin commit en otros archivos no bloquean el pull.

Git cancela (`Aborting`) antes de tocar nada, así que el trabajo de Ana sigue intacto. Tiene dos salidas:

- Hacer commit de su cambio y repetir el `git pull`, si el cambio ya está listo.
- Guardarlo temporalmente con `git stash`, si todavía está a medias.

### Guardar cambios a un lado con `git stash`

`git stash` guarda tus cambios sin commit (del working tree y del staging) en una pila aparte y deja el working tree limpio, igual que el último commit.

```bash
# Guarda los cambios sin commit y limpia el working tree
git stash
```

```text
Saved working directory and index state WIP on main: 1bc10be Agrega tarea de SSH
```

```bash
# Lista lo que hay guardado en la pila
git stash list
```

```text
stash@{0}: WIP on main: 1bc10be Agrega tarea de SSH
```

Con el working tree limpio, el pull funciona:

```text
Updating 1bc10be..0a7d96a
Fast-forward
 README.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Por último, Ana recupera su cambio:

```bash
# Aplica el último stash y lo quita de la pila
git stash pop
```

```text
Auto-merging README.md
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
Dropped refs/stash@{0} (15692687de0ccf010efaeb14aac08a5f37f4f3ae)
```

El README ahora tiene el título nuevo de Beto y la línea que Ana estaba escribiendo. Ten en cuenta:

- Si tu cambio y el que llegó tocan las mismas líneas, `git stash pop` produce un conflicto. Lo resuelves como en la lección 3 y Git conserva la entrada en la pila (`The stash entry is kept in case you need it again.`) hasta que la descartes.
- Por defecto, `git stash` no guarda los archivos nuevos que Git todavía no sigue (*untracked*). Para incluirlos, usa `git stash -u`.

## Conflictos al hacer pull

Si tú y otra persona cambiaron las mismas líneas, el merge que hace `git pull` se detiene con un conflicto:

```text
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

Es el mismo conflicto de merge que ya sabes resolver: sigue el procedimiento de la [lección 3](/cursos/git/conflictos) (editar el archivo, `git add`, `git commit`, o cancelar con `git merge --abort`). Cuando termines, publica el resultado con `git push`.

## El ciclo diario

```bash
# 1. Al empezar: trae lo que subieron los demás
git pull

# 2. Trabaja y guarda tus avances
git add README.md
git commit -m "Describe cómo instalar el proyecto"

# 3. Antes de publicar: integra lo que haya llegado mientras tanto
git pull

# 4. Publica tus commits
git push
```

## Resumen de comandos

| Acción | Comando |
|---|---|
| Registrar el remoto | `git remote add origin <url>` |
| Ver los remotos | `git remote -v` |
| Primer push con seguimiento | `git push -u origin main` |
| Copiar un repositorio | `git clone <url>` |
| Descargar sin integrar | `git fetch` |
| Ver qué commits llegaron | `git log main..origin/main` |
| Descargar e integrar | `git pull` |
| Integrar con merge al divergir | `git config --global pull.rebase false` |
| Subir commits | `git push` |
| Guardar cambios a un lado | `git stash` |
| Ver lo guardado | `git stash list` |
| Recuperar lo guardado | `git stash pop` |

## Ejercicios prácticos

No necesitas GitHub ni otra persona para practicar. Un **repositorio bare** (`git init --bare`) es un repositorio sin working tree, que solo guarda el historial: funciona como remoto, igual que GitHub. Dos clones en carpetas distintas hacen de Ana y de Beto. La URL del remoto es simplemente la ruta a la carpeta.

### Ejercicio 1: preparar el laboratorio

Crea una carpeta `practica` con un repositorio bare `remoto.git`. Crea al lado el repositorio `ana` con un `README.md` de cinco líneas (`Línea 1` a `Línea 5`), haz commit, conéctalo al remoto y publícalo con seguimiento. Después clona el remoto en la carpeta `beto` y comprueba que tiene el commit de Ana.

<details>
<summary>Ver solución</summary>

```bash
mkdir practica
cd practica
git init --bare remoto.git

mkdir ana
cd ana
git init
# Crea README.md con las líneas "Línea 1" a "Línea 5"
git add README.md
git commit -m "Agrega README"
git remote add origin ../remoto.git
git remote -v
git push -u origin main

cd ..
git clone remoto.git beto
cd beto
git log --oneline
```

`git remote -v` muestra `../remoto.git` para fetch y push, y el `git log --oneline` de Beto muestra el commit `Agrega README`.

</details>

### Ejercicio 2: mirar antes de integrar

Desde `beto`, crea `tareas.txt`, haz commit y súbelo. Desde `ana`, comprueba qué dice `git status` antes y después de `git fetch`, lista los commits que llegaron y luego intégralos.

<details>
<summary>Ver solución</summary>

```bash
# En beto
git add tareas.txt
git commit -m "Agrega lista de tareas"
git push

# En ana
git status
git fetch
git status
git log --oneline main..origin/main
git pull
```

Antes del fetch, `git status` dice `Your branch is up to date with 'origin/main'.` porque `origin/main` está desactualizado. Después dice `Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.`, el log muestra `Agrega lista de tareas` y el pull es un `Fast-forward`.

</details>

### Ejercicio 3: push rechazado y ramas divergentes

Ana crea `autores.txt` y Beto crea `LICENCIA.txt`, cada uno con su commit. Ana sube primero. Luego Beto intenta subir. Haz que Beto integre el trabajo de Ana con un merge y publique el resultado. Por último, actualiza a Ana.

<details>
<summary>Ver solución</summary>

```bash
# En ana
git add autores.txt
git commit -m "Agrega autores"
git push

# En beto
git add LICENCIA.txt
git commit -m "Agrega licencia"
git push
# ! [rejected]        main -> main (fetch first)

# Solo si todavía no lo configuraste
git config --global pull.rebase false

git pull
# Se abre el editor con el mensaje del merge commit: guarda y cierra
git log --oneline --graph
git push

# En ana
git pull
```

El push de Beto es rechazado porque el remoto tiene el commit de Ana. El pull crea un merge commit (`Merge made by the 'ort' strategy.`) y el grafo muestra las dos líneas unidas. El segundo push se acepta, y el pull de Ana es un fast-forward.

</details>

### Ejercicio 4: guardar a un lado con stash

Beto cambia `Línea 1` por `Línea uno` en el README, hace commit y sube. Ana, sin hacer commit, cambia `Línea 5` por `Línea cinco` y hace `git pull`. Resuelve la situación sin perder el cambio de Ana y publica su cambio.

<details>
<summary>Ver solución</summary>

```bash
# En ana, con README.md modificado y sin commit
git pull
# error: Your local changes to the following files would be overwritten by merge:
#	README.md

git stash
git stash list
git pull
git stash pop
git add README.md
git commit -m "Cambia la línea 5"
git push
```

El pull falla porque Ana tiene cambios sin commit en `README.md`, un archivo que el pull modifica. Después de `git stash pop`, el README tiene `Línea uno` y `Línea cinco`: los cambios están en líneas distintas, así que no hay conflicto.

</details>

### Ejercicio 5: conflicto al hacer pull

Beto trae lo último y cambia `Línea 3` por `Línea tres (Beto)`; Ana la cambia por `Línea tres (Ana)`. Ambos hacen commit. Ana sube primero. Haz que Beto traiga el cambio, resuelva el conflicto dejando `Línea tres` y publique el resultado.

<details>
<summary>Ver solución</summary>

```bash
# En beto
git pull
# CONFLICT (content): Merge conflict in README.md

# Edita README.md: borra los marcadores y deja "Línea tres"
git add README.md
git commit
git push
```

El conflicto se resuelve igual que en la lección 3. `git commit` sin `-m` abre el editor con el mensaje del merge ya escrito. Después del push, el remoto tiene el merge commit con la línea resuelta.

</details>
