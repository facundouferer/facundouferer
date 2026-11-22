---
course: 'git'
lesson: 'rebase-y-buenas-practicas'
slug: 'autoevaluacion-rebase-y-buenas-practicas'
title: 'Autoevaluación: Rebase y buenas prácticas en Git'
description: 'Doce preguntas sobre git rebase, conflictos durante un rebase, la regla de oro, --force-with-lease, rebase -i, git bisect, Conventional Commits, .gitignore, secretos y revisión antes de confirmar.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Estás en `feature/carrito` y este es el grafo después de `git fetch`. Ejecutas `git rebase origin/main` y no hay conflictos. ¿Qué queda en tu rama?'
    code: |-
      $ git log --oneline --graph --all
      * 780488a feat(envio): agrega envío gratis desde 10000
      * a39a0ac feat(carrito): calcula el total
      | * 7ac78ac fix(envio): actualiza el costo de envío
      |/
      * 10b4cc8 chore: agrega configuración inicial
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Un commit de merge nuevo con dos padres, `780488a` y `7ac78ac`, encima de tus dos commits.'
      - id: 'b'
        text: 'Los mismos commits `a39a0ac` y `780488a`, con sus hashes originales, ahora colgando de `7ac78ac`.'
      - id: 'c'
        text: 'Dos commits nuevos, con los mismos cambios y mensajes pero con hashes nuevos, encima de `7ac78ac`: un historial lineal.'
      - id: 'd'
        text: 'Git mueve `origin/main` hasta `780488a`, porque el rebase sube tus commits a `main`.'
    correctOptionId: 'c'
    explanation: >-
      `git rebase` cambia la base de tu rama: aparta tus commits, mueve la rama a la
      punta de `origin/main` y los vuelve a aplicar uno por uno. Los commits
      reaplicados son commits nuevos, por eso tienen hashes nuevos. No crea un commit
      de merge ni toca `origin/main`.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Durante un `git rebase origin/main` con conflicto, lo que aparece entre `<<<<<<< HEAD` y `=======` es la versión de tu commit.'
    correctAnswer: false
    explanation: >-
      Durante un rebase Git se para en la nueva base y trae tus commits, así que
      `HEAD` es `origin/main` (con tus commits ya reaplicados). Tu commit aparece entre
      `=======` y `>>>>>>>`, identificado por su hash y su mensaje. Es la inversión de
      "ours" y "theirs" respecto de un merge.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'El rebase se detuvo con este estado. Ya editaste `config.js`, borraste los marcadores y ejecutaste `git add config.js`. ¿Qué haces ahora?'
    code: |-
      $ git status
      interactive rebase in progress; onto 7ac78ac
      Last commands done (2 commands done):
         pick a39a0ac # feat(carrito): calcula el total
         pick 780488a # feat(envio): agrega envío gratis desde 10000
      No commands remaining.
      You are currently rebasing branch 'feature/carrito' on '7ac78ac'.
        (fix conflicts and then run "git rebase --continue")

      Unmerged paths:
          both modified:   config.js
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: '`git commit -m "feat(envio): agrega envío gratis desde 10000"` para guardar la resolución.'
      - id: 'b'
        text: '`git rebase --continue`, sin hacer commit.'
      - id: 'c'
        text: '`git rebase --skip`, para que Git siga con el commit siguiente.'
      - id: 'd'
        text: '`git push --force-with-lease`, para terminar el rebase en el remoto.'
    correctOptionId: 'b'
    explanation: >-
      En un rebase no ejecutas `git commit`: el commit que se está reaplicando ya tiene
      su mensaje, y `git rebase --continue` lo termina y sigue con los que queden.
      `--skip` descartaría tu commit. Si prefieres no seguir, `git rebase --abort`
      devuelve la rama al estado anterior al rebase.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Durante un `git rebase origin/main`, `config.js` tiene conflicto y quieres quedarte completa con la versión de tu commit. ¿Qué comando usas antes del `git add`?'
    options:
      - id: 'a'
        text: '`git restore --ours config.js`'
      - id: 'b'
        text: '`git merge --abort`'
      - id: 'c'
        text: '`git restore --staged config.js`'
      - id: 'd'
        text: '`git restore --theirs config.js`'
    correctOptionId: 'd'
    explanation: >-
      En un rebase, "ours" es `origin/main` (la nueva base) y "theirs" es tu commit que
      se está reaplicando. Por eso, para quedarte con tu versión usas `--theirs`.
      Después igual tienes que marcar el archivo como resuelto con `git add`.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Si confirmaste y subiste por error una llave de API, basta con borrarla en el commit siguiente para que deje de estar expuesta.'
    correctAnswer: false
    explanation: >-
      El secreto sigue en el historial y cualquiera con acceso al repositorio puede
      verlo; incluso reescribir el historial no garantiza nada porque otros pueden
      haberlo copiado. Lo único que realmente te protege es revocar o rotar el secreto
      de inmediato, y luego dejar de rastrear el archivo y agregarlo a `.gitignore`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Ya habías subido `feature/carrito`, hiciste rebase sobre `origin/main` y ahora el push falla así. Nadie más trabaja en esa rama. ¿Qué haces?'
    code: |-
      $ git push
      To github.com:tu-usuario/tienda.git
       ! [rejected]        feature/carrito -> feature/carrito (non-fast-forward)
      error: failed to push some refs to 'github.com:tu-usuario/tienda.git'
      hint: Updates were rejected because the tip of your current branch is behind
      hint: its remote counterpart. If you want to integrate the remote changes,
      hint: use 'git pull' before pushing again.
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: '`git push --force-with-lease`, para reemplazar la rama remota por la tuya solo si sigue donde la viste.'
      - id: 'b'
        text: '`git pull` y después `git push`, como sugiere el hint.'
      - id: 'c'
        text: '`git push --force`, que es lo mismo pero más corto.'
      - id: 'd'
        text: '`git rebase --abort`, porque el rechazo indica que el rebase quedó a medias.'
    correctOptionId: 'a'
    explanation: >-
      Después de un rebase tus commits tienen hashes nuevos y el remoto todavía tiene
      los viejos. `git pull` volvería a traer los commits viejos y los mezclaría con
      los nuevos. `--force` a secas borraría sin avisar un commit que alguien hubiera
      subido; `--force-with-lease` rechaza el push en ese caso.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Puedes hacer rebase de `main` sin problemas siempre que después lo subas con `git push --force-with-lease`.'
    correctAnswer: false
    explanation: >-
      La regla de oro dice que nunca hagas rebase de una rama sobre la que otras
      personas construyen, como `main`. El rebase reemplaza commits por commits
      nuevos, y quien ya tenía los viejos tendría que rehacer su trabajo o podría
      volver a subirlos duplicados. `--force-with-lease` no evita ese problema.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Ejecutaste `git rebase -i HEAD~3` y Git abrió esta lista de tareas. Quieres corregir el mensaje del primer commit y absorber "corrige typo" en el segundo, descartando su mensaje. ¿Qué palabras pones al principio de las tres líneas, en orden?'
    code: |-
      pick fdd62ee # feat(perfil): agrega pagina de perfil
      pick 92f548a # feat(perfil): muestra el nombre
      pick aa007a1 # corrige typo
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: '`reword`, `pick`, `drop`'
      - id: 'b'
        text: '`pick`, `reword`, `squash`'
      - id: 'c'
        text: '`reword`, `pick`, `fixup`'
      - id: 'd'
        text: '`reword`, `squash`, `pick`'
    correctOptionId: 'c'
    explanation: >-
      `reword` deja el cambio y te deja editar el mensaje; `fixup` une el commit al
      anterior y descarta su mensaje. `squash` también une, pero te hace combinar los
      dos mensajes, y `drop` eliminaría el commit junto con su cambio. La lista va del
      commit más viejo al más nuevo.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'Eliminas el endpoint `/v1/pedidos` y quienes usan tu API deben cambiar su código. ¿Qué mensaje sigue Conventional Commits?'
    options:
      - id: 'a'
        text: '`feat(api)!: elimina el endpoint /v1/pedidos`, con un pie `BREAKING CHANGE:` que explica qué usar en su lugar.'
      - id: 'b'
        text: '`Feat(API): Eliminé el endpoint /v1/pedidos.`'
      - id: 'c'
        text: '`fix: varios arreglos en la api`'
      - id: 'd'
        text: '`chore(api): elimina el endpoint /v1/pedidos`, porque es una tarea de mantenimiento.'
    correctOptionId: 'a'
    explanation: >-
      Un cambio que rompe compatibilidad se marca con `!` después del tipo o del
      alcance y se explica en un pie `BREAKING CHANGE:`. La descripción va en
      imperativo o presente, corta y sin punto final. `chore` es para tareas que no
      tocan el código de la aplicación, y "varios arreglos" no describe un cambio.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '`git bisect` terminó con esta salida. ¿Qué te dice y qué haces a continuación?'
    code: |-
      $ git bisect bad
      001853450c60781a09890b331a08c319a204d843 is the first bad commit
      commit 001853450c60781a09890b331a08c319a204d843
      Author: Ana <ana@example.com>

          feat(descuentos): agrega descuentos

       config.js   | 2 +-
       discount.js | 1 +
       2 files changed, 2 insertions(+), 1 deletion(-)
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Que el error está en el último commit de la rama; Git ya te devolvió a ella, así que no hace falta nada más.'
      - id: 'b'
        text: 'Que el culpable es `b38725a`, el primer commit que marcaste como `bad`; ejecutas `git bisect good` para confirmarlo.'
      - id: 'c'
        text: 'Que `discount.js` tiene el error, porque es el archivo nuevo del commit; ejecutas `git bisect start` otra vez.'
      - id: 'd'
        text: 'Que `0018534` es el primer commit con el error, y que además de "descuentos" tocó `config.js`; ejecutas `git bisect reset` para volver a tu rama.'
    correctOptionId: 'd'
    explanation: >-
      `git bisect` hace una búsqueda binaria y te informa el primer commit que está
      mal. Siempre terminas con `git bisect reset`, que te devuelve a la rama donde
      estabas. El culpable es un commit no atómico: tocó `config.js` aunque su mensaje
      habla de descuentos, y eso escondía el error.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'El archivo `.env` ya estaba en un commit. Lo agregas a `.gitignore` y Git sigue mostrándolo modificado. ¿Qué pasa y qué haces?'
    code: |-
      $ echo ".env" >> .gitignore
      $ git status --short
       M .env
      ?? .gitignore
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'El patrón está mal escrito: debería ser `/.env`; lo corriges y Git deja de verlo.'
      - id: 'b'
        text: '`.gitignore` solo afecta a archivos sin rastrear; ejecutas `git rm --cached .env`, que lo saca del índice sin borrarlo de tu disco.'
      - id: 'c'
        text: 'Ejecutas `git rm .env`, que deja de rastrearlo y conserva tu copia local.'
      - id: 'd'
        text: 'Basta con confirmar `.gitignore`: desde ese commit Git deja de rastrear `.env`.'
    correctOptionId: 'b'
    explanation: >-
      Ignorar no deja de rastrear: si un archivo ya está en un commit, Git sigue viendo
      sus cambios. `git rm --cached .env` lo quita del staging (aparece como `D `) y el
      archivo sigue en tu carpeta; luego confirmas ese cambio junto con `.gitignore`.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Si ya agregaste todos tus cambios con `git add`, `git diff` no muestra nada aunque haya cambios listos para confirmar; para verlos usas `git diff --staged`.'
    correctAnswer: true
    explanation: >-
      `git diff` compara el working tree contra el staging, no contra el último
      commit. `git diff --staged` compara el staging contra el último commit: es lo
      que va a entrar en el próximo commit. Creer que `git diff` compara contra el
      último commit es un error común.
---
