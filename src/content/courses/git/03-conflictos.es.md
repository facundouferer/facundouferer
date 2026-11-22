---
title: 'Ramas, fusión y conflictos'
course: 'git'
slug: 'conflictos'
description: 'Crea ramas para trabajar en paralelo, intégralas con git merge (fast-forward y merge commit) y resuelve conflictos paso a paso, todo en tu repositorio local.'
order: 3
lang: 'es'
published: true
---

# Ramas, fusión y conflictos

Una rama te permite probar una idea sin tocar la versión estable del proyecto. Cuando la idea funciona, la integras con `git merge`. Si las dos ramas cambiaron las mismas líneas, Git te pide que decidas: eso es un conflicto.

En esta lección aprenderás:

1. Qué es una rama y qué es `HEAD`.
2. A crear, listar, cambiar y borrar ramas con `git branch` y `git switch`.
3. A ver el historial como un grafo con `git log --oneline --graph --all`.
4. La diferencia entre una fusión fast-forward y un merge commit.
5. A leer los marcadores de un conflicto, resolverlo o cancelar la fusión.

Todo ocurre en tu computadora: no hace falta ningún servidor.

## Qué es una rama

Una rama es un **puntero móvil a un commit**. No es una copia de los archivos: es solo un nombre (por ejemplo `main`) que apunta al último commit de una línea de trabajo. Cada vez que haces un commit en esa rama, el puntero avanza al commit nuevo.

`HEAD` indica dónde estás. Normalmente apunta a una rama (`HEAD -> main`), y por eso tus commits nuevos hacen avanzar esa rama.

En la lección [Deshacer cambios](/cursos/git/deshacer-cambios) usaste `git switch --detach <hash>`: ahí `HEAD` apuntaba directamente a un commit, sin rama. Eso es *detached HEAD*. Con ramas, `HEAD` vuelve a apuntar a un nombre que avanza contigo.

## Preparar el repositorio de práctica

Todos los ejemplos de esta lección siguen uno detrás de otro en el mismo repositorio. Créalo en una carpeta vacía:

```bash
mkdir proyecto
cd proyecto
git init
```

Crea `saludo.txt` con este contenido:

```text
Hola mundo
```

```bash
git add saludo.txt
git commit -m "Agrega saludo inicial"
```

```text
[main (root-commit) 954f1dd] Agrega saludo inicial
 1 file changed, 1 insertion(+)
 create mode 100644 saludo.txt
```

Los hashes de tu terminal serán distintos: cada commit tiene el suyo.

## Ver, crear y cambiar de rama

### Listar ramas

```bash
git branch
```

```text
* main
```

El asterisco marca la rama actual, la que apunta `HEAD`.

### Crear una rama y cambiarte a ella

```bash
git switch -c despedida
```

```text
Switched to a new branch 'despedida'
```

`git switch -c <nombre>` crea la rama en el commit actual y te cambia a ella. Ahora `git branch` muestra:

```text
* despedida
  main
```

Si la rama ya existe, te cambias a ella sin `-c`:

```bash
git switch main
```

Al cambiar de rama, Git reemplaza los archivos de tu carpeta por los del commit al que apunta la nueva rama. Antes de cambiar, confirma tus cambios con un commit: si tienes cambios sin confirmar que chocan con la otra rama, Git se niega a cambiar para no perderlos.

## Ver el historial como un grafo

`git log --oneline` muestra solo la rama actual. Para ver todas las ramas y cómo se separan y se juntan:

```bash
git log --oneline --graph --all
```

- `--graph` dibuja las líneas de cada rama a la izquierda.
- `--all` incluye todas las ramas, no solo la actual.
- Entre paréntesis aparece a qué commit apunta cada rama y `HEAD`.

Lo usarás después de cada paso de esta lección.

## Fusión fast-forward

Sigue en la rama `despedida` (vuelve con `git switch despedida` si cambiaste a `main`). Crea `despedida.txt`:

```text
Hasta luego
```

```bash
git add despedida.txt
git commit -m "Agrega despedida"
git switch main
```

En `main` el archivo `despedida.txt` no existe: esa rama todavía apunta al commit anterior. El grafo lo muestra:

```bash
git log --oneline --graph --all
```

```text
* 54f85d4 (despedida) Agrega despedida
* 954f1dd (HEAD -> main) Agrega saludo inicial
```

`main` no se movió desde que creaste `despedida`. Para integrar, te paras en la rama que **recibe** los cambios y fusionas la otra:

```bash
git merge despedida
```

```text
Updating 954f1dd..54f85d4
Fast-forward
 despedida.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 despedida.txt
```

Como `main` no tenía commits propios, Git no necesita combinar nada: solo adelanta el puntero `main` hasta el commit de `despedida`. Eso es un **fast-forward**, y no crea ningún commit nuevo.

```text
* 54f85d4 (HEAD -> main, despedida) Agrega despedida
* 954f1dd Agrega saludo inicial
```

<figure class="diagram">
<svg viewBox="0 0 720 290" role="img" aria-labelledby="d-git-ff-l3-t">
<title id="d-git-ff-l3-t">Fusión fast-forward: main avanza hasta el commit de la rama despedida</title>
<defs>
  <marker id="ar-ff-l3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-ptr-l3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-700)"/>
  </marker>
</defs>

<!-- Before -->
<text x="40" y="40" font-size="13" font-weight="700" fill="var(--color-neutral-700)">Antes de git merge</text>
<path d="M 200 80 L 360 80" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="7 4"/>
<circle cx="200" cy="80" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="200" y="85" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>
<circle cx="360" cy="80" r="16" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="3"/>
<text x="360" y="85" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">B</text>
<path d="M 200 128 L 200 102" fill="none" stroke="var(--color-neutral-700)" stroke-width="1.5" marker-end="url(#ar-ptr-l3)"/>
<text x="200" y="145" font-size="13" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">HEAD -&gt; main</text>
<path d="M 360 128 L 360 102" fill="none" stroke="var(--color-neutral-700)" stroke-width="1.5" marker-end="url(#ar-ptr-l3)"/>
<text x="360" y="145" font-size="13" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">despedida</text>

<!-- After -->
<text x="40" y="190" font-size="13" font-weight="700" fill="var(--color-neutral-700)">Después de git merge despedida</text>
<path d="M 200 230 L 360 230" fill="none" stroke="var(--color-accent)" stroke-width="3"/>
<circle cx="200" cy="230" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="200" y="235" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>
<circle cx="360" cy="230" r="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="360" y="235" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<path d="M 210 200 C 250 180, 310 180, 348 204" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-ff-l3)"/>
<text x="280" y="176" font-size="11" text-anchor="middle" fill="var(--color-accent-700)">main avanza</text>
<text x="390" y="226" font-size="13" font-weight="700" font-family="monospace" fill="var(--color-accent-700)">HEAD -&gt; main, despedida</text>
<text x="390" y="246" font-size="11" fill="var(--color-neutral-700)">Sin commit nuevo: solo se mueve el puntero</text>
</svg>
<figcaption>Fast-forward: A es «Agrega saludo inicial» y B es «Agrega despedida». Como <code>main</code> no avanzó, <code>git merge despedida</code> solo mueve el puntero <code>main</code> de A a B.</figcaption>
</figure>

## Fusión con merge commit

Ahora haz que las dos ramas avancen, cada una en un archivo distinto. Crea la rama `autor` y agrega `autor.txt`:

```bash
git switch -c autor
```

```text
Autor: Ana
```

```bash
git add autor.txt
git commit -m "Agrega autor"
git switch main
```

En `main`, cambia `despedida.txt` para que diga:

```text
Hasta luego, nos vemos pronto
```

```bash
git add despedida.txt
git commit -m "Mejora la despedida"
git log --oneline --graph --all
```

```text
* 2cf59a0 (autor) Agrega autor
| * 5d789cf (HEAD -> main) Mejora la despedida
|/
* 54f85d4 Agrega despedida
* 954f1dd Agrega saludo inicial
```

Las ramas divergieron: cada una tiene un commit que la otra no tiene. Ya no alcanza con mover un puntero. Fusiona:

```bash
git merge autor
```

Git abre tu editor con el mensaje `Merge branch 'autor'`. Acéptalo: guarda y cierra el editor. Git responde:

```text
Merge made by the 'ort' strategy.
 autor.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 autor.txt
```

Git compara las dos puntas con su ancestro común (`54f85d4`), combina los cambios y crea un **merge commit**: un commit con dos padres. Por eso se llama fusión de tres vías.

```text
*   0a2af46 (HEAD -> main) Merge branch 'autor'
|\
| * 2cf59a0 (autor) Agrega autor
* | 5d789cf Mejora la despedida
|/
* 54f85d4 Agrega despedida
* 954f1dd Agrega saludo inicial
```

<figure class="diagram">
<svg viewBox="0 0 720 230" role="img" aria-labelledby="d-git-merge-l3-t">
<title id="d-git-merge-l3-t">Fusión de tres vías: main y autor divergen desde B y se unen en el merge commit M</title>
<defs>
  <marker id="ar-main-l3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-branch-l3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
</defs>

<!-- Branch main line -->
<path d="M 90 70 L 600 70" fill="none" stroke="var(--color-accent)" stroke-width="3" marker-end="url(#ar-main-l3)"/>
<text x="60" y="75" font-size="13" font-weight="700" font-family="monospace" text-anchor="end" fill="var(--color-accent-700)">main</text>

<!-- Branch autor curve -->
<path d="M 180 70 C 220 70, 230 150, 270 150 L 450 150 C 490 150, 500 70, 520 72" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="7 4" marker-end="url(#ar-branch-l3)"/>
<text x="210" y="175" font-size="13" font-weight="700" font-family="monospace" fill="var(--color-accent-2-800)">autor</text>

<!-- Commits on main -->
<circle cx="90" cy="70" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="90" y="75" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>

<circle cx="180" cy="70" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="180" y="75" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<text x="180" y="40" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">Ancestro común</text>

<circle cx="360" cy="70" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="360" y="75" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<text x="360" y="40" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">Cambia despedida.txt</text>

<!-- Commit on autor -->
<circle cx="360" cy="150" r="16" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="3"/>
<text x="360" y="155" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D</text>
<text x="360" y="190" font-size="11" text-anchor="middle" fill="var(--color-accent-2-800)">Crea autor.txt</text>

<!-- Merge commit M -->
<circle cx="540" cy="70" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="3.5"/>
<text x="540" y="76" font-size="13" font-weight="800" text-anchor="middle" fill="var(--color-accent-700)">M</text>
<text x="540" y="40" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Merge commit (dos padres)</text>
</svg>
<figcaption>Merge commit: A «Agrega saludo inicial», B «Agrega despedida», C «Mejora la despedida» en <code>main</code> y D «Agrega autor» en <code>autor</code>. Las dos ramas avanzaron en archivos distintos, así que <code>git merge autor</code> crea M sin conflictos.</figcaption>
</figure>

## Borrar una rama fusionada

Cuando una rama ya está integrada, su nombre sobra: los commits siguen en `main`.

```bash
git branch -d despedida
git branch -d autor
```

```text
Deleted branch despedida (was 54f85d4).
Deleted branch autor (was 2cf59a0).
```

`git branch -d` se niega a borrar una rama que tiene commits sin fusionar:

```text
error: the branch 'prueba' is not fully merged
```

Git te sugiere `git branch -D` para forzarlo. Úsalo solo si de verdad quieres descartar esos commits.

## Conflictos

### Cuándo hay un conflicto

Git combina solo los cambios que no se pisan: archivos distintos, o partes distintas del mismo archivo. Hay **conflicto** cuando las dos ramas cambiaron las mismas líneas de forma diferente desde el ancestro común. Git no adivina cuál versión es la buena: detiene la fusión y te pregunta.

### Provocar un conflicto

Sigue en el mismo repositorio, en `main`. Ahora `saludo.txt` dice `Hola mundo`. Crea una rama nueva y cambia esa línea:

```bash
git switch -c saludo-formal
```

Edita `saludo.txt` para que diga:

```text
Buenos días, mundo
```

```bash
git add saludo.txt
git commit -m "Usa un saludo formal"
git switch main
```

En `main`, `saludo.txt` vuelve a decir `Hola mundo`. Cambia la misma línea de otra forma:

```text
Hola, mundo entero
```

```bash
git add saludo.txt
git commit -m "Amplía el saludo"
git merge saludo-formal
```

```text
Auto-merging saludo.txt
CONFLICT (content): Merge conflict in saludo.txt
Automatic merge failed; fix conflicts and then commit the result.
```

La fusión quedó a medias. `git status` te dice qué archivos esperan una decisión:

```text
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   saludo.txt
```

### Leer los marcadores

Abre `saludo.txt`:

```text
<<<<<<< HEAD
Hola, mundo entero
=======
Buenos días, mundo
>>>>>>> saludo-formal
```

- `<<<<<<< HEAD` abre la versión de tu rama actual (`main`).
- `=======` separa las dos versiones.
- `>>>>>>> saludo-formal` cierra la versión de la rama que estás fusionando.

<figure class="diagram">
<svg viewBox="0 0 720 180" role="img" aria-labelledby="d-git-conflict-l3-t">
<title id="d-git-conflict-l3-t">Marcadores de conflicto en saludo.txt: versión de main, separador y versión de saludo-formal</title>
<rect x="40" y="25" width="640" height="130" rx="16" fill="var(--color-surface)" stroke="var(--color-divider)" stroke-width="1.5"/>
<text x="64" y="58" font-size="13" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</text>
<text x="64" y="80" font-size="13" font-family="monospace" fill="var(--color-accent-700)">Hola, mundo entero</text>
<text x="64" y="102" font-size="13" font-family="monospace" font-weight="700" fill="var(--color-neutral-700)">=======</text>
<text x="64" y="124" font-size="13" font-family="monospace" fill="var(--color-accent-2-800)">Buenos días, mundo</text>
<text x="64" y="146" font-size="13" font-family="monospace" font-weight="700" fill="var(--color-accent-2-800)">&gt;&gt;&gt;&gt;&gt;&gt;&gt; saludo-formal</text>
<text x="420" y="69" font-size="12" fill="var(--color-accent-700)">Tu rama actual (main)</text>
<text x="420" y="102" font-size="12" fill="var(--color-neutral-700)">Separador</text>
<text x="420" y="135" font-size="12" fill="var(--color-accent-2-800)">La rama que fusionas</text>
</svg>
<figcaption>Las dos ramas cambiaron la misma línea de <code>saludo.txt</code> desde el ancestro común, así que Git escribe ambas versiones entre marcadores y espera tu decisión.</figcaption>
</figure>

### Cancelar la fusión: `git merge --abort`

Si no quieres resolverlo ahora, vuelve al estado anterior a `git merge`:

```bash
git merge --abort
git status
```

```text
On branch main
nothing to commit, working tree clean
```

`saludo.txt` vuelve a decir `Hola, mundo entero`. Para seguir con el ejemplo, intenta la fusión otra vez:

```bash
git merge saludo-formal
```

Obtienes el mismo `CONFLICT (content)` de antes.

### Resolver el conflicto

1. Decide el contenido final. Puede ser una versión, la otra o una combinación.
2. Borra las tres líneas de marcadores (`<<<<<<<`, `=======`, `>>>>>>>`).
3. Guarda el archivo.

En este ejemplo combinamos las dos ideas. `saludo.txt` queda así:

```text
Buenos días, mundo entero
```

Marca el archivo como resuelto con `git add`:

```bash
git add saludo.txt
git status
```

```text
On branch main
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)
```

### Cerrar la fusión

```bash
git commit
```

Git abre el editor con el mensaje `Merge branch 'saludo-formal'`. Acéptalo: guarda y cierra.

```text
[main 6b5dba7] Merge branch 'saludo-formal'
```

`git merge --continue` hace lo mismo que `git commit` en este punto: también abre el editor con el mensaje por defecto. Usa el que prefieras.

```bash
git log --oneline --graph --all
git branch -d saludo-formal
```

```text
*   6b5dba7 (HEAD -> main) Merge branch 'saludo-formal'
|\
| * 54ee0a7 (saludo-formal) Usa un saludo formal
* | 022bf8c Amplía el saludo
|/
*   0a2af46 Merge branch 'autor'
...
```

## Qué puede recuperar Git y qué no

- **Lo que ya está en un commit casi siempre se puede recuperar.** Aunque borres una rama o te equivoques al fusionar, los commits siguen existiendo un tiempo y `git reflog` te muestra sus hashes (lo viste en [Deshacer cambios](/cursos/git/deshacer-cambios)).
- **Lo que nunca confirmaste no se puede recuperar.** `git restore` y `git reset --hard` descartan cambios sin commit, y Git no guarda copia de ellos.

Por eso: haz commit antes de cambiar de rama o de fusionar.

## Consejos

- Crea una rama por cada idea o tarea, con un nombre que la describa.
- Haz commits pequeños: los conflictos son más cortos y fáciles de leer.
- Fusiona seguido: cuanto más divergen dos ramas, más conflictos acumulan.
- Lee el conflicto completo antes de editar, y revisa el resultado con `git diff --staged` antes del commit.
- Errores comunes: hacer commit con marcadores todavía en el archivo, o borrar el archivo entero en lugar de las líneas en conflicto.

## Resumen

| Quiero... | Comando |
| --- | --- |
| Ver las ramas | `git branch` |
| Crear una rama y cambiarme a ella | `git switch -c <rama>` |
| Cambiar a una rama existente | `git switch <rama>` |
| Ver todas las ramas como grafo | `git log --oneline --graph --all` |
| Integrar otra rama en la actual | `git merge <rama>` |
| Marcar un conflicto como resuelto | `git add <archivo>` |
| Cerrar la fusión | `git commit` o `git merge --continue` |
| Cancelar una fusión con conflictos | `git merge --abort` |
| Borrar una rama ya fusionada | `git branch -d <rama>` |

## Ejercicios prácticos

### Ejercicio 1: una fusión fast-forward

En un repositorio nuevo con un commit en `main`, crea la rama `contacto`, agrega `contacto.txt` en un commit y fusiónala en `main`. Comprueba que Git responde `Fast-forward` y borra la rama.

<details>
<summary>Ver solución</summary>

```bash
git switch -c contacto
# Crea contacto.txt con cualquier texto
git add contacto.txt
git commit -m "Agrega contacto"
git switch main
git merge contacto
git log --oneline --graph --all
git branch -d contacto
```

`git merge` muestra `Fast-forward` porque `main` no tenía commits nuevos: solo avanzó el puntero.

</details>

### Ejercicio 2: un merge commit sin conflictos

Crea la rama `colores` y agrega `colores.txt` en un commit. Vuelve a `main` y, antes de fusionar, haz un commit que cambie otro archivo. Fusiona `colores` y mira el grafo.

<details>
<summary>Ver solución</summary>

```bash
git switch -c colores
# Crea colores.txt
git add colores.txt
git commit -m "Agrega colores"
git switch main
# Cambia saludo.txt
git add saludo.txt
git commit -m "Actualiza el saludo"
git merge colores
# Acepta el mensaje "Merge branch 'colores'" en el editor
git log --oneline --graph --all
```

Git responde `Merge made by the 'ort' strategy.` y el grafo muestra un commit con dos líneas que llegan a él: el merge commit.

</details>

### Ejercicio 3: cancelar y resolver un conflicto

Crea la rama `titulo` y cambia la primera línea de `saludo.txt`. En `main`, cambia esa misma línea de otra forma. Fusiona, cancela con `git merge --abort`, vuelve a fusionar y esta vez resuelve el conflicto cerrando con `git merge --continue`.

<details>
<summary>Ver solución</summary>

```bash
git switch -c titulo
# Cambia la primera línea de saludo.txt
git add saludo.txt
git commit -m "Cambia el saludo en titulo"
git switch main
# Cambia la misma línea con otro texto
git add saludo.txt
git commit -m "Cambia el saludo en main"
git merge titulo
# CONFLICT (content): Merge conflict in saludo.txt
git merge --abort
git status
# nothing to commit, working tree clean
git merge titulo
# Deja el contenido final y borra los marcadores
git add saludo.txt
git merge --continue
git branch -d titulo
```

</details>

### Ejercicio 4: una rama sin fusionar

Crea la rama `borrador`, haz un commit en ella, vuelve a `main` e intenta borrarla con `git branch -d`. ¿Qué responde Git y por qué? ¿Cómo la borrarías sin perder ese commit?

<details>
<summary>Ver solución</summary>

Git responde `error: the branch 'borrador' is not fully merged`, porque el commit de `borrador` no está en `main`: si borras la rama, ningún nombre apunta a ese commit. Para conservarlo, primero fusiona y después borra:

```bash
git merge borrador
git branch -d borrador
```

Si de verdad quieres descartar el trabajo, `git branch -D borrador` la borra igual.

</details>
