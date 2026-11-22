---
course: 'git'
lesson: 'conflictos'
slug: 'autoevaluacion-conflictos'
title: 'Autoevaluación: Ramas, fusión y conflictos'
description: 'Doce preguntas sobre ramas y HEAD, fusión fast-forward y merge commit, lectura de marcadores, resolución y cancelación de conflictos y borrado de ramas.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué es una rama en Git?'
    options:
      - id: 'a'
        text: 'Una copia completa de los archivos del proyecto guardada en otra carpeta.'
      - id: 'b'
        text: 'Una lista fija de commits que no cambia después de crearla.'
      - id: 'c'
        text: 'Un puntero móvil a un commit, que avanza cada vez que haces un commit en ella.'
      - id: 'd'
        text: 'Un respaldo automático de los cambios que todavía no confirmaste.'
    correctOptionId: 'c'
    explanation: >-
      Una rama no es una copia de los archivos: es solo un nombre (como `main`)
      que apunta al último commit de una línea de trabajo. Cada commit nuevo en
      esa rama hace avanzar el puntero al commit nuevo.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Si `git log` muestra `HEAD -> main`, tus próximos commits harán avanzar la rama `main`.'
    correctAnswer: true
    explanation: >-
      `HEAD` indica dónde estás. Cuando apunta a una rama (`HEAD -> main`), cada
      commit nuevo mueve esa rama. Solo en *detached HEAD* apunta directamente a
      un commit, sin rama.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'Estás en `main` y ves este grafo. ¿Qué hace `git merge despedida`?'
    code: |-
      $ git log --oneline --graph --all
      * 54f85d4 (despedida) Agrega despedida
      * 954f1dd (HEAD -> main) Agrega saludo inicial
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Crea un merge commit con dos padres que une `main` y `despedida`.'
      - id: 'b'
        text: 'Hace un fast-forward: adelanta el puntero `main` hasta `54f85d4` sin crear ningún commit nuevo.'
      - id: 'c'
        text: 'Mueve el puntero `despedida` hacia atrás hasta `954f1dd`.'
      - id: 'd'
        text: 'Produce un conflicto, porque las dos ramas tienen commits distintos.'
    correctOptionId: 'b'
    explanation: >-
      `main` no tuvo commits propios desde que creaste `despedida`, así que Git
      no necesita combinar nada: solo adelanta `main` hasta el commit de
      `despedida`. Eso es un fast-forward y no crea ningún commit.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Estás en `main` con este grafo y ejecutas `git merge autor`. ¿Qué ocurre?'
    code: |-
      $ git log --oneline --graph --all
      * 2cf59a0 (autor) Agrega autor
      | * 5d789cf (HEAD -> main) Mejora la despedida
      |/
      * 54f85d4 Agrega despedida
      * 954f1dd Agrega saludo inicial
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Git hace un fast-forward y `main` pasa a apuntar a `2cf59a0`.'
      - id: 'b'
        text: 'Git se niega a fusionar porque las ramas divergieron.'
      - id: 'c'
        text: 'Git copia `autor.txt` a `main` y borra el commit `5d789cf`.'
      - id: 'd'
        text: 'Git compara las dos puntas con el ancestro común `54f85d4` y crea un merge commit con dos padres.'
    correctOptionId: 'd'
    explanation: >-
      Las ramas divergieron: cada una tiene un commit que la otra no tiene, así
      que ya no alcanza con mover un puntero. Git hace una fusión de tres vías
      desde el ancestro común y, como cambiaron archivos distintos, crea el
      merge commit sin conflictos.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Una fusión fast-forward crea un commit nuevo con el mensaje `Merge branch ''<rama>''`.'
    correctAnswer: false
    explanation: >-
      En un fast-forward Git solo mueve el puntero de la rama actual hasta el
      commit de la otra rama: no crea ningún commit. El mensaje
      `Merge branch ''autor''` aparece en un merge commit, cuando las ramas divergieron.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿En qué situación `git merge` se detiene con un conflicto?'
    options:
      - id: 'a'
        text: 'Siempre que las dos ramas modificaron el mismo archivo, aunque sea en partes distintas.'
      - id: 'b'
        text: 'Cuando las dos ramas cambiaron las mismas líneas de forma diferente desde el ancestro común.'
      - id: 'c'
        text: 'Cada vez que la fusión necesita crear un merge commit.'
      - id: 'd'
        text: 'Cuando la rama que fusionas tiene más commits que la rama actual.'
    correctOptionId: 'b'
    explanation: >-
      Git combina solo los cambios que no se pisan: archivos distintos o partes
      distintas del mismo archivo. Hay conflicto cuando ambas ramas cambiaron
      las mismas líneas de forma diferente; Git no adivina cuál es la buena y te pregunta.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Después de `git merge saludo-formal` ves esta salida. ¿Qué significa y qué te toca hacer?'
    code: |-
      $ git merge saludo-formal
      Auto-merging saludo.txt
      CONFLICT (content): Merge conflict in saludo.txt
      Automatic merge failed; fix conflicts and then commit the result.
      $ git status
      On branch main
      You have unmerged paths.
        (fix conflicts and run "git commit")
        (use "git merge --abort" to abort the merge)

      Unmerged paths:
        (use "git add <file>..." to mark resolution)
              both modified:   saludo.txt
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'La fusión quedó a medias: debes editar `saludo.txt`, marcarlo con `git add` y cerrar con `git commit`, o cancelar con `git merge --abort`.'
      - id: 'b'
        text: 'La fusión terminó bien y Git eligió automáticamente la versión de `saludo-formal`.'
      - id: 'c'
        text: 'El repositorio quedó dañado y tienes que borrar `saludo.txt` para continuar.'
      - id: 'd'
        text: 'Git ya creó el merge commit; solo falta borrar la rama `saludo-formal`.'
    correctOptionId: 'a'
    explanation: >-
      `Automatic merge failed` indica que la fusión se detuvo esperando tu
      decisión. `git status` lista `saludo.txt` en `Unmerged paths` y te recuerda
      las salidas: resolver, marcar con `git add` y hacer commit, o abortar.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Estás en `main` fusionando `saludo-formal` y abres `saludo.txt`. ¿Qué versión es la de tu rama actual?'
    code: |-
      $ cat saludo.txt
      <<<<<<< HEAD
      Hola, mundo entero
      =======
      Buenos días, mundo
      >>>>>>> saludo-formal
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: '`Buenos días, mundo`, porque es la última versión escrita en el archivo.'
      - id: 'b'
        text: 'Ninguna: lo que está entre los marcadores es el ancestro común.'
      - id: 'c'
        text: '`Hola, mundo entero`, porque `<<<<<<< HEAD` abre la versión de la rama actual (`main`).'
      - id: 'd'
        text: 'Las dos, porque `=======` indica que Git ya las combinó.'
    correctOptionId: 'c'
    explanation: >-
      `<<<<<<< HEAD` abre la versión de tu rama actual, `=======` separa las dos
      versiones y `>>>>>>> saludo-formal` cierra la versión de la rama que estás
      fusionando. Tú decides el contenido final y borras las tres líneas de marcadores.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Si ejecutas `git merge --abort` en medio de un conflicto, vuelves al estado anterior a `git merge` y `git status` muestra `nothing to commit, working tree clean`.'
    correctAnswer: true
    explanation: >-
      `git merge --abort` cancela la fusión: `saludo.txt` vuelve a decir
      `Hola, mundo entero` y el árbol de trabajo queda limpio. Si intentas la
      fusión otra vez, obtienes el mismo `CONFLICT (content)`.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Ya dejaste `saludo.txt` con el contenido final y borraste los marcadores. ¿Qué comando lo marca como resuelto?'
    options:
      - id: 'a'
        text: '`git restore saludo.txt`'
      - id: 'b'
        text: '`git merge --abort`'
      - id: 'c'
        text: '`git branch -d saludo-formal`'
      - id: 'd'
        text: '`git add saludo.txt`'
    correctOptionId: 'd'
    explanation: >-
      `git add` marca el archivo como resuelto; después `git status` dice
      `All conflicts fixed but you are still merging.` y puedes cerrar la fusión.
      `git merge --abort` la cancelaría y `git branch -d` solo borra ramas.
  - kind: 'true-false'
    id: 'q11'
    prompt: 'Con todos los conflictos resueltos y marcados, `git merge --continue` hace lo mismo que `git commit`: abre el editor con el mensaje por defecto y cierra la fusión.'
    correctAnswer: true
    explanation: >-
      En ese punto los dos comandos son equivalentes: ambos abren el editor con
      `Merge branch ''saludo-formal''` y, al guardar y cerrar, crean el merge
      commit. Usa el que prefieras.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Ves este error. Significa que Git borró la rama `prueba` igual y descartó sus commits sin fusionar.'
    code: |-
      $ git branch -d prueba
      error: the branch 'prueba' is not fully merged
    codeLanguage: 'bash'
    correctAnswer: false
    explanation: >-
      Es un error: `git branch -d` se niega a borrar una rama con commits sin
      fusionar, así que `prueba` sigue existiendo. Para conservar esos
      commits, fusiona primero y borra después; `git branch -D` la fuerza solo
      si de verdad quieres descartar ese trabajo.
---
