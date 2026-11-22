---
course: 'git'
lesson: 'el-principio-con-git'
slug: 'autoevaluacion-el-principio-con-git'
title: 'Autoevaluación: El principio con Git'
description: 'Doce preguntas sobre commits e historial, la configuración de identidad, las tres zonas de Git, git status, git add, git restore --staged, git commit, git diff y git log.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 12
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Acabas de crear `hola.txt` en un repositorio nuevo y ejecutas `git status`. ¿Qué significa que el archivo aparezca en `Untracked files`?'
    code: |-
      $ git status
      On branch main

      No commits yet

      Untracked files:
        (use "git add <file>..." to include in what will be committed)
          hola.txt

      nothing added to commit but untracked files present (use "git add" to track)
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Que el archivo ya está en el Staging Area y entrará en el próximo commit.'
      - id: 'b'
        text: 'Que el archivo ya quedó guardado en el historial, en un commit sin mensaje.'
      - id: 'c'
        text: 'Que Git ve el archivo pero todavía no lo controla: hay que prepararlo con `git add`.'
      - id: 'd'
        text: 'Que el archivo está dañado y Git no puede leerlo.'
    correctOptionId: 'c'
    explanation: >-
      `Untracked files` son archivos que Git ve pero todavía no controla. No están
      en el Staging Area ni en el historial (`No commits yet` indica que el historial
      está vacío). Para incluirlo en el próximo commit, primero lo preparas con `git add`.
  - kind: 'single-choice'
    id: 'q2'
    prompt: 'En el repositorio `recetas` ejecutas esta secuencia. ¿Qué muestra el último `git diff`?'
    code: |-
      $ echo "Paso 1: pelar las papas" >> tortilla.txt
      $ git add tortilla.txt
      $ echo "Paso 2: batir los huevos" >> tortilla.txt
      $ git diff
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Las dos líneas, `+Paso 1: pelar las papas` y `+Paso 2: batir los huevos`.'
      - id: 'b'
        text: 'Solo `+Paso 2: batir los huevos`.'
      - id: 'c'
        text: 'Solo `+Paso 1: pelar las papas`.'
      - id: 'd'
        text: 'Nada, porque el archivo ya se preparó con `git add`.'
    correctOptionId: 'b'
    explanation: >-
      `git diff` compara el Working Directory contra el Staging Area: muestra solo lo
      que cambiaste y todavía no preparaste, es decir, el Paso 2. El Paso 1 ya está en
      el Staging Area y aparece con `git diff --staged`, que muestra lo que entrará en
      el próximo commit.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'Ejecutar `git restore --staged hola.txt` borra del archivo las líneas que escribiste desde el último commit.'
    correctAnswer: false
    explanation: >-
      `git restore --staged` solo saca el cambio del Staging Area y lo devuelve al
      Working Directory: el archivo conserva lo que escribiste, solo deja de estar
      preparado. Es la flecha punteada del diagrama de las tres zonas.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Tu correo global es `ana@ejemplo.com`. Dentro del repositorio `recetas` ejecutas estos comandos. ¿Qué muestra el segundo?'
    code: |-
      $ git config --local user.email "ana@cocina.com"
      $ git config user.email
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: '`ana@ejemplo.com`, porque la configuración global siempre gana.'
      - id: 'b'
        text: 'Los dos correos, uno por línea.'
      - id: 'c'
        text: 'Un error, porque ya existe un correo global y Git no admite otro.'
      - id: 'd'
        text: '`ana@cocina.com`, porque la configuración local tiene prioridad sobre la global.'
    correctOptionId: 'd'
    explanation: >-
      `--local` se aplica solo al repositorio en el que estás, se guarda en
      `.git/config` y tiene prioridad sobre la global (`~/.gitconfig`). Dentro de
      `recetas` Git usa `ana@cocina.com`; en cualquier otro repositorio sigue usando
      el correo global.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Para crear commits y ver el historial con Git necesitas conexión a internet, porque Git guarda los commits en GitHub.'
    correctAnswer: false
    explanation: >-
      Git es un programa que instalas en tu computadora y funciona sin internet:
      guarda el historial en la carpeta oculta `.git` del repositorio. GitHub es un
      servicio web que aloja copias de repositorios Git y es el que necesita internet.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Después de tu primer `git commit` aparece esta salida. ¿Qué indica `root-commit`?'
    code: |-
      $ git commit -m "Agrega saludo inicial"
      [main (root-commit) edf5c7d] Agrega saludo inicial
       1 file changed, 1 insertion(+)
       create mode 100644 hola.txt
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Que es el primer commit del repositorio, el único que no tiene padre.'
      - id: 'b'
        text: 'Que el commit se creó con permisos de administrador (root).'
      - id: 'c'
        text: 'Que el commit incluye la carpeta raíz completa, aunque no hayas usado `git add`.'
      - id: 'd'
        text: 'Que `edf5c7d` es el hash del commit padre.'
    correctOptionId: 'a'
    explanation: >-
      `root-commit` indica que es el primer commit, el que no tiene padre. `edf5c7d`
      es el hash abreviado de este mismo commit (los primeros 7 de sus 40 caracteres
      hexadecimales), no el de su padre.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Preparaste `tortilla.txt` y también `notas.txt`, pero decides que `notas.txt` no debe entrar en este commit y quieres conservarlo en disco para más adelante. ¿Qué haces antes de `git commit`?'
    options:
      - id: 'a'
        text: 'Borras `notas.txt` del disco y haces el commit.'
      - id: 'b'
        text: 'Ejecutas `git add tortilla.txt` otra vez para que el commit incluya solo ese archivo.'
      - id: 'c'
        text: 'Ejecutas `git restore --staged notas.txt` para sacarlo del Staging Area.'
      - id: 'd'
        text: 'Nada: `git commit` solo incluye archivos que ya estaban en un commit anterior.'
    correctOptionId: 'c'
    explanation: >-
      El commit registra lo que está en el Staging Area. `git restore --staged notas.txt`
      lo saca de ahí sin tocar su contenido: el commit incluye solo `tortilla.txt` y
      `notas.txt` sigue en disco, listo para un commit futuro. Volver a preparar
      `tortilla.txt` no saca a `notas.txt` del Staging Area.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'En esta salida, `5904ec5` es el padre de `edf5c7d`.'
    code: |-
      $ git log --oneline
      5904ec5 (HEAD -> main) Agrega segunda línea al saludo
      edf5c7d Agrega saludo inicial
    codeLanguage: 'bash'
    correctAnswer: false
    explanation: >-
      `git log` muestra los commits del más reciente al más antiguo. `5904ec5` es el
      más reciente y su padre es `edf5c7d`; `edf5c7d` no tiene padre porque es el
      primero. `(HEAD -> main)` marca el commit en el que estás parado ahora.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Cuál de estos mensajes de commit sigue las reglas de la lección?'
    options:
      - id: 'a'
        text: '`arreglé cosas`'
      - id: 'b'
        text: '`Corrige la fecha del pie de página`'
      - id: 'c'
        text: '`cambios`'
      - id: 'd'
        text: '`Corrige la fecha, agrega el logo, cambia los colores y actualiza todos los textos`'
    correctOptionId: 'b'
    explanation: >-
      Un buen mensaje dice qué hace el commit en pocas palabras y en imperativo,
      empezando con un verbo como "Corrige". `arreglé cosas` y `cambios` son vagos, y
      el último mezcla varias ideas en una línea larga: cada commit debe tener una
      sola idea.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Si usas `git restore --staged` en un repositorio que todavía no tiene ningún commit, Git responde `fatal: could not resolve HEAD`.'
    correctAnswer: true
    explanation: >-
      `git restore --staged` necesita al menos un commit en el repositorio. Antes del
      primer commit el historial está vacío (`No commits yet`) y Git no tiene contra
      qué restaurar, por eso responde `fatal: could not resolve HEAD`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Agregaste la línea `Estoy aprendiendo Git` a `hola.txt` y ejecutas `git add hola.txt`. Sin editar nada más, ¿qué muestran ahora `git diff` y `git diff --staged`?'
    options:
      - id: 'a'
        text: 'Los dos muestran `+Estoy aprendiendo Git`.'
      - id: 'b'
        text: '`git diff` muestra `+Estoy aprendiendo Git` y `git diff --staged` no muestra nada.'
      - id: 'c'
        text: 'Ninguno muestra nada, porque el cambio ya está en el historial.'
      - id: 'd'
        text: '`git diff` no muestra nada y `git diff --staged` muestra `+Estoy aprendiendo Git`.'
    correctOptionId: 'd'
    explanation: >-
      Tras `git add`, no quedan cambios sin preparar, así que `git diff` (Working
      Directory contra Staging Area) no muestra nada. `git diff --staged` (Staging
      Area contra el último commit) muestra la línea, porque está esperando el commit;
      todavía no está en el historial.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Si editas un archivo ya guardado en un commit y ejecutas `git commit -m "Actualiza saludo"` sin hacer `git add`, Git guarda igualmente ese cambio.'
    correctAnswer: false
    explanation: >-
      `git commit` registra solo lo que está en el Staging Area. Si olvidas `git add`,
      no guarda nada: como el archivo ya existía, responde `no changes added to commit`. Por
      eso conviene revisar con `git status` antes de cada commit.
---
