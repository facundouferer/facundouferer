---
title: 'El principio con Git'
course: 'git'
slug: 'el-principio-con-git'
description: 'Instala y configura Git, crea tu primer repositorio y domina el ciclo local de tres zonas: git status, git add, git commit, git diff y git log.'
order: 1
lang: 'es'
published: true
---

# El principio con Git

Git es la herramienta que usan casi todos los equipos de software para guardar la historia de su código. En esta lección trabajas solo, en tu computadora, sin internet.

En esta lección aprenderás:

1. Qué es Git y qué son un repositorio, un commit y el historial.
2. Cómo instalar Git y configurar tu identidad con `git config`.
3. Cómo crear un repositorio con `git init`.
4. El ciclo de las tres zonas: `git status`, `git add`, `git restore --staged` y `git commit`.
5. Cómo ver qué cambió con `git diff` y `git diff --staged`.
6. Cómo leer el historial con `git log`.

## Qué es Git

**Git es un sistema de control de versiones**: guarda fotos sucesivas de tu proyecto para que puedas ver qué cambió, cuándo, quién lo hizo y volver a una versión anterior.

Sin Git, terminas con carpetas como estas:

```text
informe.docx
informe-v2.docx
informe-final.docx
informe-final-AHORA-SI.docx
```

Con Git tienes un solo archivo y una historia ordenada de todas sus versiones, con una explicación de cada cambio.

### Conceptos fundamentales

- **Repositorio (repo)**: una carpeta cuyo historial controla Git. Git guarda ese historial en una subcarpeta oculta llamada `.git`.
- **Commit**: una foto del estado de los archivos en un momento dado. Es la unidad del historial.
- **Historial**: la cadena de commits, del más reciente al primero.

Cada commit guarda:

- **Hash**: un identificador único de 40 caracteres hexadecimales, por ejemplo `edf5c7dd85da2be768183a849deb5eea36fa0d3e`. Se suele mostrar abreviado a los primeros 7: `edf5c7d`.
- **Autor**: nombre y correo de quien lo creó.
- **Fecha**: cuándo se creó.
- **Mensaje**: qué cambió y por qué, escrito por ti.
- **Padre**: el hash del commit anterior. Así se encadena el historial. El primer commit del repositorio no tiene padre.

### Git y GitHub no son lo mismo

| Git | GitHub |
| --- | --- |
| Programa que instalas en tu computadora | Servicio web |
| Guarda el historial de tu proyecto | Aloja copias de repositorios Git en internet |
| Funciona sin internet | Necesita internet |
| Lo usas desde la terminal | Lo usas desde el navegador (y desde Git) |

GitHub usa Git para que varias personas compartan un repositorio, pero todo lo de esta lección ocurre solo en tu computadora.

## Instalar Git

### Windows

Descarga el instalador de [git-scm.com](https://git-scm.com/) e instálalo con las opciones por defecto. También puedes usar `winget` desde PowerShell:

```bash
winget install --id Git.Git -e --source winget
```

Usa la terminal **Git Bash** que se instala junto con Git para seguir esta lección.

### macOS

Instala las herramientas de línea de comandos de Xcode, que incluyen Git:

```bash
xcode-select --install
```

O, si usas Homebrew:

```bash
brew install git
```

### Linux (Debian y Ubuntu)

```bash
sudo apt update
sudo apt install git
```

### Linux (Fedora)

```bash
sudo dnf install git
```

### Verificar la instalación

```bash
git --version
```

```text
git version 2.52.0
```

Tu número de versión puede ser otro; cualquier versión reciente sirve.

## Configurar tu identidad

Git firma cada commit con un nombre y un correo. Configúralos una sola vez:

```bash
git config --global user.name "Ana García"
git config --global user.email "ana@ejemplo.com"
```

`user.name` y `user.email` son solo datos que se escriben en cada commit; no son una contraseña ni una cuenta. Si más adelante usas GitHub, conviene poner el mismo correo de tu cuenta para que vincule tus commits a tu perfil.

Configura también el nombre de la línea principal del historial. El estándar actual es `main`:

```bash
git config --global init.defaultBranch main
```

### `--global` y `--local`

- `--global`: se aplica a todos tus repositorios. Se guarda en `~/.gitconfig`.
- `--local`: se aplica solo al repositorio en el que estás y tiene prioridad sobre la global. Se guarda en `.git/config`. Es la opción por defecto si no indicas ninguna.

Por ejemplo, para usar tu correo del trabajo solo en un repositorio (ejecútalo dentro de ese repositorio):

```bash
git config --local user.email "ana@trabajo.com"
```

Para ver toda tu configuración:

```bash
git config --list
```

```text
user.name=Ana García
user.email=ana@ejemplo.com
init.defaultbranch=main
```

La lista real puede incluir más líneas; lo importante es que aparezcan tus tres valores. Git muestra los nombres de las claves en minúsculas (`init.defaultbranch`).

## Crear un repositorio

Crea una carpeta para el proyecto y entra en ella:

```bash
mkdir mi-proyecto
cd mi-proyecto
```

Convierte la carpeta en un repositorio:

```bash
git init
```

```text
Initialized empty Git repository in /home/ana/mi-proyecto/.git/
```

Git creó la carpeta oculta `.git`, donde guardará todo el historial. No la edites a mano: si la borras, pierdes el historial.

## Preguntarle a Git qué pasa: `git status`

`git status` es el comando que más usarás. Te dice qué archivos cambiaron y qué entrará en el próximo commit:

```bash
git status
```

```text
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

`No commits yet` significa que el historial está vacío. `On branch main` indica el nombre de la línea principal que configuraste con `init.defaultBranch`.

Crea un archivo `hola.txt` con este contenido:

```text
Hola, este es mi primer proyecto con Git
```

Y vuelve a preguntar:

```bash
git status
```

```text
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	hola.txt

nothing added to commit but untracked files present (use "git add" to track)
```

`Untracked files` son archivos que Git ve pero todavía no controla.

## Las tres zonas de Git

Git trabaja con tres zonas:

1. **Working Directory (directorio de trabajo)**: tus archivos en disco, donde editas.
2. **Staging Area (área de preparación)**: lo que elegiste incluir en el próximo commit.
3. **Repository (`.git`)**: el historial de commits.

<figure class="diagram">
<svg viewBox="0 0 720 260" role="img" aria-labelledby="d-git-3zonas-t">
<title id="d-git-3zonas-t">Las tres zonas de Git: Working Directory, Staging Area y Repository</title>
<defs>
  <marker id="ar-fwd-l1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-back-l1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
</defs>

<!-- Zone 1: Working Directory -->
<rect x="20" y="30" width="180" height="155" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)" stroke-width="2"/>
<text x="110" y="58" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">1. Working Directory</text>
<text x="110" y="80" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Archivos en disco</text>
<rect x="35" y="100" width="150" height="32" rx="8" fill="var(--color-bg)" stroke="var(--color-divider)"/>
<text x="110" y="121" font-size="11" font-family="monospace" text-anchor="middle" fill="var(--color-text)">hola.txt (modificado)</text>
<text x="110" y="162" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">Cambios sin preparar</text>

<!-- Zone 2: Staging Area -->
<rect x="270" y="30" width="180" height="155" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="58" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">2. Staging Area</text>
<text x="360" y="80" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Preparado para commit</text>
<rect x="285" y="100" width="150" height="32" rx="8" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="360" y="121" font-size="11" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">hola.txt (en stage)</text>
<text x="360" y="162" font-size="11" text-anchor="middle" fill="var(--color-accent-700)">Entra en el próximo commit</text>

<!-- Zone 3: Repository -->
<rect x="520" y="30" width="180" height="155" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="610" y="58" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">3. Repository (.git)</text>
<text x="610" y="80" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Historial de commits</text>
<rect x="535" y="100" width="150" height="32" rx="8" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="610" y="121" font-size="11" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">commit edf5c7d</text>
<text x="610" y="162" font-size="11" text-anchor="middle" fill="var(--color-accent-2-800)">Versión registrada</text>

<!-- Arrow 1: git add -->
<path d="M 200 116 L 264 116" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-fwd-l1)"/>
<text x="234" y="106" font-size="10" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git add</text>

<!-- Arrow 2: git commit -->
<path d="M 450 116 L 514 116" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-fwd-l1)"/>
<text x="484" y="106" font-size="10" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git commit</text>

<!-- Arrow 3: git restore staged -->
<path d="M 360 185 C 360 225, 110 225, 110 191" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ar-back-l1)"/>
<text x="235" y="242" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">git restore --staged (sacar del stage)</text>
</svg>
<figcaption>Con <code>git add</code> pasas un cambio del directorio de trabajo al Staging Area, con <code>git commit</code> lo registras en el historial y con <code>git restore --staged</code> lo sacas del Staging Area sin perder lo que editaste.</figcaption>
</figure>

El flujo básico, que repetirás todos los días:

```text
editar → git add → git commit
```

## Preparar cambios: `git add`

Agrega `hola.txt` al Staging Area:

```bash
git add hola.txt
```

Para agregar todos los archivos nuevos y modificados de la carpeta actual (y sus subcarpetas) en un solo paso:

```bash
git add .
```

## Guardar una versión: `git commit`

Crea el commit con un mensaje:

```bash
git commit -m "Agrega saludo inicial"
```

```text
[main (root-commit) edf5c7d] Agrega saludo inicial
 1 file changed, 1 insertion(+)
 create mode 100644 hola.txt
```

- `edf5c7d` es el hash abreviado del commit. El tuyo será distinto: depende del contenido, del autor y de la fecha.
- `root-commit` indica que es el primer commit, el que no tiene padre.

### Cómo escribir un buen mensaje

Un buen mensaje dice qué hace el commit, en pocas palabras y en imperativo, como una orden:

| Mal | Bien |
| --- | --- |
| `cambios` | `Agrega saludo inicial` |
| `arreglé cosas` | `Corrige la fecha del pie de página` |
| `asdf` | `Agrega segunda línea al saludo` |

Reglas simples:

- Una sola idea por commit.
- Una línea corta (unos 50 caracteres).
- Empieza con un verbo: "Agrega", "Corrige", "Elimina", "Actualiza".

## Ver qué cambió: `git diff`

Agrega una segunda línea a `hola.txt`:

```text
Hola, este es mi primer proyecto con Git
Estoy aprendiendo Git
```

```bash
git status
```

```text
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   hola.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

El archivo está modificado pero no preparado. Git sugiere `git restore <file>` para descartar el cambio; no lo uses todavía: borra lo que editaste y lo verás con cuidado en la próxima lección.

Para ver exactamente qué cambió:

```bash
git diff
```

```text
diff --git a/hola.txt b/hola.txt
index b3e1e42..cf18bfc 100644
--- a/hola.txt
+++ b/hola.txt
@@ -1 +1,2 @@
 Hola, este es mi primer proyecto con Git
+Estoy aprendiendo Git
```

Las líneas con `+` se agregaron y las líneas con `-` se eliminaron. Las demás son contexto.

Hay dos comparaciones distintas:

| Comando | Compara | Muestra |
| --- | --- | --- |
| `git diff` | Working Directory contra Staging Area | Lo que cambiaste y todavía **no** preparaste |
| `git diff --staged` | Staging Area contra el último commit | Lo que **entrará** en el próximo commit |

Compruébalo: prepara el cambio y repite los dos comandos.

```bash
git add hola.txt
git diff
git diff --staged
```

Ahora `git diff` no muestra nada (no hay cambios sin preparar) y `git diff --staged` muestra la línea `+Estoy aprendiendo Git`, porque está en el Staging Area esperando el commit.

## Sacar un archivo del Staging Area: `git restore --staged`

Si preparaste algo que no querías incluir, sácalo del Staging Area:

```bash
git status
```

```text
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   hola.txt
```

```bash
git restore --staged hola.txt
git status
```

```text
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   hola.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

El cambio volvió al Working Directory: **el archivo conserva lo que escribiste**, solo dejó de estar preparado. Es exactamente la flecha punteada del diagrama.

`git restore --staged` necesita al menos un commit en el repositorio. Si lo usas antes del primer commit, Git responde `fatal: could not resolve HEAD`.

Prepara el cambio otra vez y guárdalo:

```bash
git add hola.txt
git commit -m "Agrega segunda línea al saludo"
```

```text
[main 5904ec5] Agrega segunda línea al saludo
 1 file changed, 1 insertion(+)
```

## Leer el historial: `git log`

```bash
git log
```

```text
commit 5904ec5af99175bd0ec2e55c66c52f30083a77f4 (HEAD -> main)
Author: Ana García <ana@ejemplo.com>
Date:   Sun Nov 22 01:17:59 2026 -0300

    Agrega segunda línea al saludo

commit edf5c7dd85da2be768183a849deb5eea36fa0d3e
Author: Ana García <ana@ejemplo.com>
Date:   Sun Nov 22 01:17:59 2026 -0300

    Agrega saludo inicial
```

Cada bloque es un commit, del más reciente al más antiguo, con su hash completo, autor, fecha y mensaje. El commit `5904ec5` tiene como padre a `edf5c7d`, y `edf5c7d` no tiene padre porque es el primero. `(HEAD -> main)` marca el commit en el que estás parado ahora.

Para una vista compacta, una línea por commit:

```bash
git log --oneline
```

```text
5904ec5 (HEAD -> main) Agrega segunda línea al saludo
edf5c7d Agrega saludo inicial
```

Si el historial no entra en la pantalla, Git lo muestra paginado: avanza con la barra espaciadora y sal con `q`.

## Errores comunes

- **Olvidar `git add`**: `git commit` responde `no changes added to commit` (si solo modificaste archivos) o `nothing added to commit` (si solo hay archivos nuevos), o guarda solo lo que estaba preparado. Revisa con `git status` antes de cada commit.
- **Hacer commit sin identidad**: si no configuraste `user.name` y `user.email`, Git se niega a crear el commit (`Author identity unknown`) o lo firma con datos adivinados a partir de tu sistema. Configura tu identidad antes del primer commit.
- **Ejecutar `git init` en la carpeta equivocada**: hazlo dentro de la carpeta del proyecto, nunca en tu carpeta de usuario.
- **Commits gigantes con mensajes vagos**: haz commits pequeños y frecuentes, cada uno con un mensaje claro.

## Resumen

- Git guarda la historia de tu proyecto como una cadena de commits; cada commit tiene hash, autor, fecha, mensaje y padre.
- `git config --global` configura tu identidad una vez; `--local` la cambia solo para un repositorio.
- `git init` crea el repositorio y `git status` te dice en qué zona está cada cambio.
- `git add` pasa cambios al Staging Area, `git restore --staged` los saca y `git commit -m` los registra en el historial.
- `git diff` muestra lo no preparado y `git diff --staged` lo que entrará en el próximo commit.
- `git log` y `git log --oneline` muestran el historial.

En la próxima lección, Deshacer cambios, aprenderás a descartar modificaciones y a volver a versiones anteriores; más adelante verás ramas, conflictos y cómo publicar tu repositorio en GitHub.

## Ejercicios prácticos

### Ejercicio 1: tu primer repositorio

Crea una carpeta `recetas`, conviértela en un repositorio, crea un archivo `tortilla.txt` con la línea `Ingredientes: huevos y papas` y guárdalo en un commit con el mensaje `Agrega receta de tortilla`. Comprueba el resultado con `git log --oneline`.

<details>
<summary>Ver solución</summary>

```bash
mkdir recetas
cd recetas
git init
echo "Ingredientes: huevos y papas" > tortilla.txt
git status
git add tortilla.txt
git commit -m "Agrega receta de tortilla"
git log --oneline
```

`git status` muestra `tortilla.txt` en `Untracked files` antes del `git add`. Al final, `git log --oneline` muestra un solo commit con tu mensaje (con un hash distinto al de cualquier otra persona).

</details>

### Ejercicio 2: `git diff` contra `git diff --staged`

En el repositorio `recetas`, agrega a `tortilla.txt` la línea `Paso 1: pelar las papas` y prepárala con `git add`. Después agrega la línea `Paso 2: batir los huevos` sin prepararla. Antes de ejecutarlos, predice qué mostrará `git diff` y qué mostrará `git diff --staged`.

<details>
<summary>Ver solución</summary>

```bash
echo "Paso 1: pelar las papas" >> tortilla.txt
git add tortilla.txt
echo "Paso 2: batir los huevos" >> tortilla.txt
git diff
git diff --staged
```

- `git diff` muestra solo `+Paso 2: batir los huevos`: es el cambio que está en el Working Directory y todavía no está en el Staging Area.
- `git diff --staged` muestra solo `+Paso 1: pelar las papas`: es lo que entraría en el próximo commit.

`git status` muestra `tortilla.txt` dos veces, en `Changes to be committed` y en `Changes not staged for commit`, porque el archivo tiene una parte preparada y otra no.

</details>

### Ejercicio 3: elegir qué entra en el commit

Sigue en `recetas`. Prepara todo con `git add .`, crea un archivo nuevo `notas.txt` con la línea `Probar con cebolla` y prepáralo también. Luego decide que `notas.txt` no debe entrar en este commit: sácalo del Staging Area, haz el commit solo con `tortilla.txt` y el mensaje `Agrega los primeros pasos de la tortilla`, y comprueba que `notas.txt` sigue en disco.

<details>
<summary>Ver solución</summary>

```bash
git add .
echo "Probar con cebolla" > notas.txt
git add notas.txt
git restore --staged notas.txt
git status
git commit -m "Agrega los primeros pasos de la tortilla"
git status
```

Después de `git restore --staged notas.txt`, `git status` muestra `tortilla.txt` en `Changes to be committed` y `notas.txt` en `Untracked files`. El commit incluye solo `tortilla.txt`. `notas.txt` sigue en disco con su contenido, listo para un commit futuro.

</details>

### Ejercicio 4: identidad solo para un repositorio

En el repositorio `recetas`, configura el correo `ana@cocina.com` solo para ese repositorio. Comprueba qué correo usa Git dentro de `recetas` y crea un commit para ver que lo firma con ese correo.

<details>
<summary>Ver solución</summary>

```bash
git config --local user.email "ana@cocina.com"
git config user.email
git add notas.txt
git commit -m "Agrega notas de la receta"
git log
```

`git config user.email` muestra `ana@cocina.com`, porque la configuración local tiene prioridad sobre la global. En `git log`, el commit más reciente aparece con `Author: Ana García <ana@cocina.com>`, y los anteriores conservan el correo con el que se crearon. En cualquier otro repositorio Git sigue usando el correo global.

</details>
