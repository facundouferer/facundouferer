---
course: 'git'
lesson: 'deshacer-cambios'
slug: 'autoevaluacion-deshacer-cambios'
title: 'Autoevaluación: Deshacer cambios'
description: 'Doce preguntas sobre git restore, git commit --amend, git revert, los tres modos de git reset, git reflog y el detached HEAD.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Modificaste `saludo.txt` por error y todavía no hiciste `git add`. ¿Qué comando deja el archivo como está en el último commit?'
    code: |-
      $ git status
      On branch main
      Changes not staged for commit:
        (use "git add <file>..." to update what will be committed)
        (use "git restore <file>..." to discard changes in working directory)
      	modified:   saludo.txt
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: '`git restore --staged saludo.txt`'
      - id: 'b'
        text: '`git revert HEAD`'
      - id: 'c'
        text: '`git restore saludo.txt`'
      - id: 'd'
        text: '`git commit --amend`'
    correctOptionId: 'c'
    explanation: >-
      El cambio está solo en el working tree, y el propio `git status` sugiere
      `git restore <file>` para descartarlo. Es destructivo: como el cambio nunca
      estuvo en un commit, no se puede recuperar. `--staged` solo saca archivos del
      staging, y `revert` o `--amend` trabajan sobre commits.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Después de `git add saludo.txt`, ejecutar `git restore --staged saludo.txt` borra el cambio del archivo en tu working tree.'
    correctAnswer: false
    explanation: >-
      `--staged` no borra nada: saca el archivo del staging y el cambio sigue en tu
      working tree, por eso `git status` lo muestra como `modified` sin agregar. Si
      además quieres descartarlo, ejecutas después `git restore saludo.txt`.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'Observa los hashes de esta sesión. ¿Qué hace realmente `git commit --amend`?'
    code: |-
      $ git commit -m "Agrega despedia"
      [main 20633b9] Agrega despedia
      $ git commit --amend -m "Agrega despedida"
      [main cf59d35] Agrega despedida
      $ git add firma.txt
      $ git commit --amend --no-edit
      [main ad7fc4f] Agrega despedida
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Edita el mismo commit en su lugar; el hash cambia solo porque cambió la fecha.'
      - id: 'b'
        text: 'Crea un commit nuevo que reemplaza al último y descarta el anterior del historial.'
      - id: 'c'
        text: 'Agrega un commit nuevo encima del anterior, que sigue visible en `git log --oneline`.'
      - id: 'd'
        text: 'Deshace el último commit y deja sus cambios en el staging.'
    correctOptionId: 'b'
    explanation: >-
      `--amend` no edita el commit: crea uno nuevo y descarta el anterior del
      historial, por eso el hash pasa de `20633b9` a `cf59d35` y luego a `ad7fc4f`.
      Con `--no-edit` conserva el mensaje y suma lo que haya en el staging, como
      `firma.txt`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Tu equipo ya tiene el commit `Agrega despedida` y ahora hay que quitar sus archivos. ¿Cuál es la forma segura de deshacerlo?'
    options:
      - id: 'a'
        text: '`git reset --hard HEAD~1`, porque elimina el commit del historial.'
      - id: 'b'
        text: '`git commit --amend`, para corregir ese commit.'
      - id: 'c'
        text: '`git restore despedida.txt firma.txt`, para dejar los archivos como antes.'
      - id: 'd'
        text: '`git revert <hash>`, que crea un commit nuevo con el cambio inverso.'
    correctOptionId: 'd'
    explanation: >-
      `git revert` solo agrega un commit que aplica el cambio inverso y deja el
      original en el historial, así que nadie pierde nada. `reset` y `--amend`
      reescriben el historial: no se usan sobre commits que ya compartiste.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Acabas de deshacer el commit `Agrega lista de tareas` y ves esta salida. ¿Qué comando usaste?'
    code: |-
      $ git status
      On branch main
      Changes to be committed:
        (use "git restore --staged <file>..." to unstage)
      	new file:   tareas.txt
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: '`git reset --soft HEAD~1`'
      - id: 'b'
        text: '`git reset --mixed HEAD~1`'
      - id: 'c'
        text: '`git reset --hard HEAD~1`'
      - id: 'd'
        text: '`git revert HEAD`'
    correctOptionId: 'a'
    explanation: >-
      Con `--soft`, `HEAD` retrocede pero los cambios del commit deshecho quedan en
      el staging, listos para un nuevo commit: por eso aparecen en `Changes to be
      committed`. Con `--mixed` quedarían solo en el working tree y con `--hard` se
      perderían; `revert` no deja nada en el staging, crea un commit nuevo.
  - kind: 'true-false'
    id: 'q6'
    prompt: '`git reset HEAD~1`, sin indicar el modo, hace lo mismo que `git reset --mixed HEAD~1`.'
    correctAnswer: true
    explanation: >-
      `--mixed` es el modo por defecto. `HEAD` retrocede un commit (`HEAD~1` es el
      padre de `HEAD`), el staging queda igual a `HEAD` y los cambios del commit
      deshecho quedan en el working tree para volver a elegir qué agregar con
      `git add`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Tienes un commit reciente y, además, cambios sin commit en `saludo.txt`. Ejecutas `git reset --hard HEAD~1`. ¿Qué puedes recuperar después?'
    options:
      - id: 'a'
        text: 'Todo: tanto el commit como los cambios sin commit aparecen en `git reflog`.'
      - id: 'b'
        text: 'Nada: `--hard` borra el commit y los cambios para siempre.'
      - id: 'c'
        text: 'El commit deshecho, con `git reflog`; los cambios sin commit de `saludo.txt` se pierden.'
      - id: 'd'
        text: 'Solo los cambios sin commit, porque siguen en el staging.'
    correctOptionId: 'c'
    explanation: >-
      Lo que estuvo en un commit casi siempre se recupera con `git reflog`, aunque
      lo hayas sacado del historial con `reset`. Lo que nunca estuvo en un commit
      Git no lo registró: `--hard` deja el working tree igual a `HEAD` y esos
      cambios no se pueden recuperar. Por eso conviene hacer commits seguido.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Borraste el commit `Agrega lista de tareas` con `git reset --hard HEAD~1`. Según este reflog, ¿qué comando lo trae de vuelta?'
    code: |-
      $ git reflog
      946f52b HEAD@{0}: reset: moving to HEAD~1
      6b8f501 HEAD@{1}: commit: Agrega lista de tareas
      946f52b HEAD@{2}: revert: Revert "Cambia saludo a inglés"
      10fe8c7 HEAD@{3}: commit: Cambia saludo a inglés
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: '`git reset --hard 946f52b`'
      - id: 'b'
        text: '`git reset --hard 6b8f501`'
      - id: 'c'
        text: '`git revert 6b8f501`'
      - id: 'd'
        text: '`git restore tareas.txt`'
    correctOptionId: 'b'
    explanation: >-
      Cada línea del reflog es un movimiento de `HEAD`, del más reciente al más
      viejo. El commit borrado es `6b8f501` (`commit: Agrega lista de tareas`), y
      `git reset --hard 6b8f501` vuelve a ponerlo en la punta. `946f52b` es donde
      ya estás, y `revert` crearía un commit inverso en lugar de recuperarlo.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'El reflog se comparte con tu equipo y Git conserva sus entradas para siempre.'
    correctAnswer: false
    explanation: >-
      El reflog es un registro local de cada lugar por el que pasó `HEAD` en tu
      repositorio. Además, Git limpia sus entradas viejas después de un tiempo
      (90 días por defecto).
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Ejecutas estos comandos. ¿Qué significa `HEAD detached at 426061e`?'
    code: |-
      $ git switch --detach 426061e
      HEAD is now at 426061e Agrega saludo inicial
      $ git status
      HEAD detached at 426061e
      nothing to commit, working tree clean
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Que los commits posteriores a `426061e` se borraron del historial.'
      - id: 'b'
        text: 'Que `main` ahora apunta a `426061e`.'
      - id: 'c'
        text: 'Que el repositorio está dañado y hay que recuperarlo con `git reflog`.'
      - id: 'd'
        text: 'Que `HEAD` apunta directamente a un commit, fuera de `main`; conviene solo mirar y volver con `git switch main`.'
    correctOptionId: 'd'
    explanation: >-
      En detached HEAD, `HEAD` deja de apuntar a `main` y apunta directamente a un
      commit; `main` sigue en el último commit y no se borra nada. Puedes mirar
      archivos o ejecutar pruebas, pero evita hacer commits: no quedarían en `main`.
      Vuelves con `git switch main`.
  - kind: 'true-false'
    id: 'q11'
    prompt: '`git restore --source=426061e saludo.txt` deja `saludo.txt` como estaba en ese commit solo en tu working tree, sin mover `HEAD` ni crear un commit.'
    correctAnswer: true
    explanation: >-
      `--source=<hash>` le dice a `restore` de qué commit tomar el archivo. El
      cambio queda en el working tree y `git status` lo muestra como `modified`; si
      te convence, lo guardas con `git add` y un commit nuevo.
  - kind: 'true-false'
    id: 'q12'
    prompt: '`git restore <archivo>` también elimina un archivo nuevo que nunca agregaste con `git add`.'
    correctAnswer: false
    explanation: >-
      `git restore` solo afecta a archivos que Git ya sigue. Un archivo nuevo que
      nunca agregaste no se toca.
---

Elige una respuesta por pregunta y presiona **Calificar** para revisar qué tan bien distingues cómo deshacer cambios en el working tree, el staging y los commits.
