---
course: 'git'
lesson: 'bajar-y-subir-cambios'
slug: 'autoevaluacion-bajar-y-subir-cambios'
title: 'Autoevaluación: Bajar y subir cambios'
description: 'Doce preguntas sobre origin y origin/main, autenticación en GitHub, push con seguimiento, clone, fetch, pull, push rechazado, ramas divergentes y git stash.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Beto acaba de subir un commit a GitHub. En la computadora de Ana, sin ejecutar nada más, `git status` muestra esto. ¿Por qué no avisa del commit nuevo?'
    code: |-
      $ git status
      On branch main
      Your branch is up to date with 'origin/main'.
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Porque el push de Beto todavía no llegó a GitHub y hay que esperar unos minutos.'
      - id: 'b'
        text: 'Porque `git status` solo mira el working tree y el staging, nunca el remoto.'
      - id: 'c'
        text: 'Porque compara con `origin/main`, que es la foto de la última vez que Ana habló con GitHub; hasta que no haga `git fetch` (o `git pull`), esa foto no cambia.'
      - id: 'd'
        text: 'Porque Ana no usó `-u` en su primer push y por eso Git no compara con el remoto.'
    correctOptionId: 'c'
    explanation: >-
      `origin/main` es una rama de seguimiento remoto: solo se actualiza con
      `git fetch`, `git pull` o `git push`. `git status` compara `main` con esa
      foto, no con GitHub en vivo, así que sigue diciendo que todo está al día
      hasta que Ana ejecute `git fetch`.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Después de ejecutar `git fetch`, los archivos nuevos que subió tu compañero ya aparecen en tu working tree.'
    correctAnswer: false
    explanation: >-
      `git fetch` descarga los commits y actualiza `origin/main`, pero nunca
      modifica tu rama ni tus archivos. Para integrarlos en tu `main` necesitas
      `git pull` (que hace el fetch y además el merge). Antes puedes mirar qué
      llegó con `git log --oneline main..origin/main`.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'Beto hizo un commit sin traer antes el trabajo de Ana y su push termina así. ¿Qué debe hacer?'
    code: |-
      $ git push
      To github.com:ana/mi-proyecto.git
       ! [rejected]        main -> main (fetch first)
      error: failed to push some refs to 'github.com:ana/mi-proyecto.git'
      hint: Updates were rejected because the remote contains work that you do not
      hint: have locally.
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Forzar el push para que su versión de `main` quede en GitHub.'
      - id: 'b'
        text: 'Ejecutar `git pull` para integrar el trabajo del remoto y después `git push` para publicar el resultado.'
      - id: 'c'
        text: 'Ejecutar solo `git fetch` y repetir `git push`.'
      - id: 'd'
        text: 'Borrar su carpeta y hacer `git clone` de nuevo para empezar desde el remoto.'
    correctOptionId: 'b'
    explanation: >-
      Un push solo puede adelantar la rama remota (fast-forward). El remoto tiene
      un commit de Ana que Beto no tiene: primero lo integra con `git pull` y luego
      publica con `git push`. Forzar el push borraría el trabajo de Ana en el
      remoto, y un fetch solo no cambia el `main` de Beto.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Beto hace `git pull` y Git se detiene con este mensaje. ¿Qué pasó?'
    code: |-
      $ git pull
      From github.com:ana/mi-proyecto
         670e72e..1bc10be  main       -> origin/main
      hint: You have divergent branches and need to specify how to reconcile them.
      fatal: Need to specify how to reconcile divergent branches.
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Ni el fetch ni la integración se hicieron: `origin/main` sigue como estaba.'
      - id: 'b'
        text: 'Hay un conflicto en `README.md` que debe resolver editando el archivo.'
      - id: 'c'
        text: 'Git hizo un fast-forward, pero Beto debe confirmarlo antes de hacer push.'
      - id: 'd'
        text: 'El fetch sí se hizo, pero `main` y `origin/main` divergieron y Git no elige cómo unirlos; con `git config --global pull.rebase false` el pull los une con un merge commit.'
    correctOptionId: 'd'
    explanation: >-
      La primera línea muestra que el fetch actualizó `origin/main`. Cada rama
      tiene un commit que la otra no tiene, así que un fast-forward ya no alcanza.
      Git no decide por ti: `pull.rebase false` une las dos historias con un merge
      commit, la opción que usa el curso.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Con `git pull --ff-only`, si tu rama y `origin/main` divergieron, Git se detiene sin cambiar nada para que decidas tú.'
    correctAnswer: true
    explanation: >-
      `--ff-only` (o `git config --global pull.ff only`) es la opción estricta:
      solo acepta fast-forwards. Si las ramas divergen, no crea ningún merge
      commit y deja tu rama como estaba.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Ana tiene una línea nueva sin commit en `README.md` y hace `git pull`. ¿Qué afirmación es correcta?'
    code: |-
      $ git pull
      Updating 1bc10be..0a7d96a
      error: Your local changes to the following files would be overwritten by merge:
              README.md
      Please commit your changes or stash them before you merge.
      Aborting
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Git canceló antes de tocar nada: el cambio de Ana sigue intacto y puede hacer commit o guardarlo con `git stash` antes de repetir el pull.'
      - id: 'b'
        text: 'Git descartó el cambio de Ana para poder traer la versión del remoto.'
      - id: 'c'
        text: 'El error aparece solo porque Ana y Beto editaron exactamente las mismas líneas del README.'
      - id: 'd'
        text: 'Git dejó el README con marcadores de conflicto que Ana debe resolver.'
    correctOptionId: 'a'
    explanation: >-
      `Aborting` significa que Git se detuvo sin modificar nada. La causa es que
      `README.md` está modificado en el working tree y el pull necesita cambiar ese
      archivo; no importa si las líneas coinciden. Las salidas son hacer commit o
      guardar el cambio con `git stash`.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Cualquier cambio sin commit en tu working tree bloquea `git pull`, aunque esté en un archivo que el pull no necesita modificar.'
    correctAnswer: false
    explanation: >-
      Solo bloquean el pull los cambios sin commit en archivos que el pull tiene
      que modificar. Los cambios sin commit en otros archivos no lo impiden.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Ana ejecuta esta secuencia y el pull trae el título nuevo de Beto, que está en otra línea del README. ¿Cómo queda todo al final?'
    code: |-
      $ git stash
      Saved working directory and index state WIP on main: 1bc10be Agrega tarea de SSH
      $ git pull
      Updating 1bc10be..0a7d96a
      Fast-forward
      $ git stash pop
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'El README tiene el título de Beto y la línea de Ana, ya con commit, y el stash sigue en la pila.'
      - id: 'b'
        text: 'El README solo tiene la línea de Ana, porque `git stash pop` reemplaza el archivo completo por lo guardado.'
      - id: 'c'
        text: 'El README tiene el título de Beto y la línea de Ana como cambio sin commit, y la entrada se quitó de la pila.'
      - id: 'd'
        text: 'El README solo tiene el título de Beto: la línea de Ana se perdió al hacer el pull.'
    correctOptionId: 'c'
    explanation: >-
      `git stash` guardó el cambio en una pila y dejó el working tree limpio, así
      que el pull funcionó. `git stash pop` aplica el último stash y lo quita de la
      pila: el README combina ambos cambios y la línea de Ana vuelve como cambio
      sin commit (`modified: README.md`).
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Por defecto, `git stash` también guarda los archivos nuevos que Git todavía no sigue (untracked).'
    correctAnswer: false
    explanation: >-
      Por defecto `git stash` guarda los cambios del working tree y del staging de
      archivos que Git ya sigue. Para incluir los archivos untracked hay que usar
      `git stash -u`.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Ana publica su repositorio por primera vez con `git push -u origin main`. ¿Qué aporta `-u`?'
    options:
      - id: 'a'
        text: 'Guarda la relación entre su `main` y `origin/main`, así que desde ahora le alcanza con `git push` y `git pull`, y `git status` compara con `origin/main`.'
      - id: 'b'
        text: 'Sube también los cambios que todavía no tienen commit.'
      - id: 'c'
        text: 'Crea el repositorio en GitHub si todavía no existe.'
      - id: 'd'
        text: 'Registra el remoto `origin`, por lo que no hace falta `git remote add`.'
    correctOptionId: 'a'
    explanation: >-
      `-u` (`--set-upstream`) configura el seguimiento: por eso la salida dice
      `branch 'main' set up to track 'origin/main'`. El remoto se registra antes
      con `git remote add origin <url>`, y el repositorio de GitHub se crea vacío
      desde la web.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Ana usa la URL HTTPS de su repositorio y, en su primer `git push`, Git le pide usuario y contraseña. ¿Qué debe escribir como contraseña?'
    options:
      - id: 'a'
        text: 'La contraseña de su cuenta de GitHub.'
      - id: 'b'
        text: 'Su clave privada SSH, `~/.ssh/id_ed25519`.'
      - id: 'c'
        text: 'Nada: con HTTPS GitHub no pide autenticación para subir commits.'
      - id: 'd'
        text: 'Un token de acceso personal generado en Settings → Developer settings → Personal access tokens.'
    correctOptionId: 'd'
    explanation: >-
      GitHub no acepta la contraseña de la cuenta para operaciones de Git. Con
      HTTPS se pega un token de acceso personal (o se inicia sesión con
      `gh auth login`). La clave privada SSH nunca sale de tu computadora y solo
      sirve con la URL SSH.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Después de `git clone git@github.com:ana/mi-proyecto.git beto`, Beto ya puede usar `git pull` y `git push` sin ejecutar `git remote add origin`.'
    correctAnswer: true
    explanation: >-
      `git clone` descarga el repositorio completo con su historial, deja el
      remoto `origin` configurado y hace que `main` siga a `origin/main`. Beto
      puede usar `git push` y `git pull` directamente.
---
