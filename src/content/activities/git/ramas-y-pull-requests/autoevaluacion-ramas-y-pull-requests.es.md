---
course: 'git'
lesson: 'ramas-y-pull-requests'
slug: 'autoevaluacion-ramas-y-pull-requests'
title: 'Autoevaluación: Ramas y Pull Requests'
description: 'Doce preguntas sobre el flujo de ramas de funcionalidad, abrir y actualizar un Pull Request, ponerse al día con main, las opciones de merge de GitHub, la limpieza de ramas y las reglas de protección.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Ana empieza su tarea con esta sesión. ¿Qué logra la opción `-u` del último comando?'
    code: |-
      $ git switch main
      $ git pull
      $ git switch -c agrega-contacto
      $ git add contacto.html
      $ git commit -m "Agrega página de contacto"
      $ git push -u origin agrega-contacto
      To github.com:equipo/sitio.git
       * [new branch]      agrega-contacto -> agrega-contacto
      branch 'agrega-contacto' set up to track 'origin/agrega-contacto'.
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Crea automáticamente el Pull Request de la rama en GitHub.'
      - id: 'b'
        text: 'Sube los commits de `agrega-contacto` directamente a `main` en el remoto.'
      - id: 'c'
        text: 'Conecta la rama local con `origin/agrega-contacto`, así en adelante basta con `git push` en esa rama.'
      - id: 'd'
        text: 'Es obligatoria en cada push de la rama; sin ella Git no sabe adónde subir los commits nuevos.'
    correctOptionId: 'c'
    explanation: >-
      La primera vez, `-u` conecta la rama local con la remota, igual que con
      `main` en la lección 4. A partir de ahí, en esa rama alcanza con `git push`.
      El PR no se crea solo: GitHub muestra un enlace o el botón
      **Compare & pull request**, y lo abres tú.
  - kind: 'single-choice'
    id: 'q2'
    prompt: 'Al abrir el Pull Request en GitHub ves arriba dos ramas, **base** y **compare**. ¿Cómo deben quedar para el PR de Ana?'
    options:
      - id: 'a'
        text: '**base**: `agrega-contacto` y **compare**: `main`, porque base es la rama donde se hizo el trabajo.'
      - id: 'b'
        text: '**base**: `main` y **compare**: `agrega-contacto`, porque base es la rama que recibirá los cambios.'
      - id: 'c'
        text: 'Las dos en `agrega-contacto`, porque el PR compara la rama consigo misma antes y después de los commits.'
      - id: 'd'
        text: 'Las dos en `main`, porque los cambios ya se subieron con `git push`.'
    correctOptionId: 'b'
    explanation: >-
      **base** es la rama que recibirá los cambios (`main`) y **compare** es tu
      rama (`agrega-contacto`). El PR muestra las diferencias entre ambas en
      **Files changed** y tus commits en **Commits**.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'Beto pide en la revisión que Ana agregue un enlace en el menú. Para que el cambio llegue a la revisión, Ana debe cerrar su PR y abrir uno nuevo con el commit corregido.'
    correctAnswer: false
    explanation: >-
      Ana no abre un PR nuevo: sigue en su rama, hace el cambio, crea otro commit
      y ejecuta `git push`. El PR sigue a la rama, no a un commit fijo, así que el
      commit nuevo aparece en él al instante y Beto puede revisar de nuevo.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Ana ya tiene un PR abierto para `agrega-contacto` y ejecuta esto. ¿Qué pasa con el PR?'
    code: |-
      $ git add menu.html
      $ git commit -m "Enlaza la página de contacto desde el menú"
      [agrega-contacto 330bf8b] Enlaza la página de contacto desde el menú
       1 file changed, 1 insertion(+)
      $ git push
      To github.com:equipo/sitio.git
         b4efc3f..330bf8b  agrega-contacto -> agrega-contacto
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'El commit `330bf8b` aparece en el mismo PR, porque el PR sigue a la rama `agrega-contacto`.'
      - id: 'b'
        text: 'Nada: el PR quedó fijo en `b4efc3f` y hay que abrir otro para `330bf8b`.'
      - id: 'c'
        text: 'GitHub hace el merge del PR automáticamente, porque llegó un commit nuevo.'
      - id: 'd'
        text: 'El push se rechaza, porque una rama con un PR abierto no acepta más commits.'
    correctOptionId: 'a'
    explanation: >-
      La salida `b4efc3f..330bf8b agrega-contacto -> agrega-contacto` indica que
      la rama remota avanzó un commit. Como el PR sigue a la rama, el commit nuevo
      se ve en él enseguida. El merge solo ocurre cuando alguien pulsa el botón,
      normalmente después de la aprobación.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Para unir el `main` actualizado a tu rama, después de `git fetch` primero tienes que cambiar a `main` con `git switch main` y recién ahí ejecutar `git merge origin/main`.'
    correctAnswer: false
    explanation: >-
      `git fetch` actualiza `origin/main` sin tocar tus archivos. Desde tu propia
      rama ejecutas `git merge origin/main` y esa rama remota se une a la tuya; no
      hace falta cambiar a `main`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Mientras su PR esperaba revisión, `main` avanzó con el PR de Beto. Ana, en `agrega-contacto`, obtiene esto. ¿Qué debe hacer a continuación?'
    code: |-
      $ git fetch
      From github.com:equipo/sitio
       * [new branch]      agrega-blog -> origin/agrega-blog
         0aaf85e..2588f0d  main        -> origin/main
      $ git merge origin/main
      Auto-merging menu.html
      CONFLICT (content): Merge conflict in menu.html
      Automatic merge failed; fix conflicts and then commit the result.
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Ejecutar `git push` tal cual y resolver el conflicto después, en la web de GitHub.'
      - id: 'b'
        text: 'Cambiar a `main` con `git switch main` y resolver ahí el conflicto, que es donde entraron los cambios de Beto.'
      - id: 'c'
        text: 'Borrar la rama con `git branch -D agrega-contacto` y empezar de nuevo desde `main`.'
      - id: 'd'
        text: 'Editar `menu.html` dejando los dos enlaces sin marcadores, y luego `git add menu.html`, `git commit --no-edit` y `git push`.'
    correctOptionId: 'd'
    explanation: >-
      Es un conflicto de merge normal y se resuelve en tu rama: dejas el archivo
      como debe quedar, sin marcadores, lo marcas como resuelto con `git add`,
      cierras el merge con `git commit --no-edit` (acepta el mensaje que Git
      propone) y subes el resultado. Si te equivocas a mitad, `git merge --abort`
      te devuelve al estado anterior.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Resolver el conflicto en tu rama, y no en `main`, tiene una ventaja: el PR muestra la resolución y el equipo la revisa antes de que llegue a `main`.'
    correctAnswer: true
    explanation: >-
      El merge commit con la resolución se sube a tu rama, así que aparece en el
      PR. El equipo puede revisarlo como cualquier otro cambio, y `main` solo
      recibe la resolución cuando el PR se aprueba e integra.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Tu rama tiene commits como "arreglo" y "otra vez", que son pasos intermedios. ¿Qué opción del botón de merge de GitHub conviene para que `main` no los reciba uno por uno?'
    options:
      - id: 'a'
        text: '**Create a merge commit**, porque une todos los commits en uno solo.'
      - id: 'b'
        text: '**Squash and merge**, porque junta todos los commits de la rama en un solo commit nuevo.'
      - id: 'c'
        text: '**Rebase and merge**, porque descarta los commits intermedios y deja solo el último.'
      - id: 'd'
        text: 'Ninguna: GitHub siempre agrega todos los commits de la rama a `main`.'
    correctOptionId: 'b'
    explanation: >-
      **Squash and merge** junta todos los commits de la rama en un solo commit
      nuevo. **Create a merge commit** conserva cada commit y agrega un merge
      commit que los une; **Rebase and merge** copia los commits uno por uno sobre
      `main`. Cada repositorio decide qué opciones permite.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'El PR de Ana se integró con **Squash and merge**. Ya actualizó su `main` y al borrar la rama obtiene esto. ¿Qué pasa y qué conviene hacer?'
    code: |-
      $ git branch -d agrega-contacto
      error: the branch 'agrega-contacto' is not fully merged
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'El PR no se integró en realidad; hay que volver a hacer el merge desde GitHub.'
      - id: 'b'
        text: 'La rama remota todavía existe; basta con `git push origin --delete agrega-contacto` para que `-d` funcione.'
      - id: 'c'
        text: 'Los commits de la rama no están en `main` (hay uno nuevo que los resume); si comprobaste en GitHub que el PR está integrado, usas `git branch -D agrega-contacto`.'
      - id: 'd'
        text: 'Falta un `git fetch --prune`; después `git branch -d` borra la rama sin error.'
    correctOptionId: 'c'
    explanation: >-
      Con **Squash and merge**, `main` recibe un commit nuevo que resume la rama,
      no sus commits. Por eso `git branch -d` cree que la rama no está integrada y
      se niega. `git branch -D` no hace esa comprobación, así que úsalo solo
      después de confirmar en GitHub que el PR se integró.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Ana borró la rama remota con este comando. En el clon de Beto, un `git fetch` sin opciones basta para que `origin/agrega-contacto` deje de figurar.'
    code: |-
      $ git push origin --delete agrega-contacto
      To github.com:equipo/sitio.git
       - [deleted]         agrega-contacto
    codeLanguage: 'bash'
    correctAnswer: false
    explanation: >-
      `git fetch` no borra por defecto las ramas remotas que ya no existen, así que
      Beto todavía ve `origin/agrega-contacto`. Con `git fetch --prune` sí se
      elimina, y la salida lo muestra como `[deleted] (none) -> origin/agrega-contacto`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'El PR de Ana ya se integró en GitHub. Ella ejecuta esto en su clon. ¿Qué le pasó a su `main` local?'
    code: |-
      $ git switch main
      Switched to branch 'main'
      Your branch is behind 'origin/main' by 2 commits, and can be fast-forwarded.
        (use "git pull" to update your local branch)
      $ git pull
      From github.com:equipo/sitio
         2588f0d..29d937d  main       -> origin/main
      Updating 0aaf85e..29d937d
      Fast-forward
       contacto.html | 2 ++
       menu.html     | 2 ++
       2 files changed, 4 insertions(+)
       create mode 100644 contacto.html
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Todavía no tenía el trabajo integrado; `git pull` lo trajo avanzando en línea recta (fast-forward) y ahora incluye `contacto.html`.'
      - id: 'b'
        text: 'GitHub ya lo había actualizado al hacer el merge, así que `git pull` no cambió nada.'
      - id: 'c'
        text: '`git pull` creó un merge commit nuevo para unir `main` con `agrega-contacto`.'
      - id: 'd'
        text: '`git pull` borró la rama local `agrega-contacto`, porque ya estaba integrada.'
    correctOptionId: 'a'
    explanation: >-
      El merge ocurrió en el remoto; tu `main` local no se entera hasta que lo
      actualizas. `Fast-forward` indica que Git solo movió `main` hacia adelante,
      sin merge commit. La rama local sigue existiendo: se borra aparte con
      `git branch -d agrega-contacto`.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Si `main` tiene activada la regla **Require a pull request before merging**, un `git push` directo a `main` se rechaza.'
    correctAnswer: true
    explanation: >-
      Las reglas de protección de ramas (en **Settings** > **Branches** o con
      **Rulesets**) hacen obligatorio el flujo de la lección: con esta regla los
      cambios solo llegan a `main` a través de un Pull Request. Otras reglas
      comunes exigen aprobaciones o que pasen las pruebas automáticas.
---
