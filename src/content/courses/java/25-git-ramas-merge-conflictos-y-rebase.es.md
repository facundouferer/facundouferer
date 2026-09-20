---
course: 'java'
slug: '25-git-ramas-merge-conflictos-y-rebase'
title: 'Git: Ramas, Merge, Conflictos y Rebase'
description: 'Aprende a colaborar con ramas, integrar cambios, resolver conflictos, usar rebase con criterio y recuperar referencias con reflog.'
order: 8
lang: 'es'
published: true
---

# Git: Ramas, Merge, Conflictos y Rebase

Una rama permite desarrollar un cambio sin mover inmediatamente la línea principal. No crea una copia completa del proyecto: es una referencia liviana a una secuencia de commits.

Trabajar con ramas no elimina los conflictos. Hace visible dónde se separaron dos historias y permite decidir cómo integrarlas. `merge` y `rebase` resuelven esa integración de maneras diferentes; ninguno es universalmente mejor.

---

## 1. Comprobar el estado antes de cambiar la historia

Antes de crear, integrar o reescribir una rama, valida el contexto:

```bash
git status
git branch --show-current
git remote get-url origin
git log --oneline --decorate -5
```

Precondiciones recomendadas:

- estás en el repositorio y rama esperados;
- los cambios locales están confirmados o guardados de forma explícita;
- `origin` apunta al repositorio correcto;
- los tests de la rama actual pasan antes de integrar trabajo ajeno.

No uses `git reset --hard` para “limpiar” sin revisar: elimina cambios no confirmados. Si `git status` muestra trabajo que no pertenece a la operación, confírmalo en un commit coherente o detente y decide cómo preservarlo.

---

## 2. Crear y publicar una rama de trabajo

Actualiza primero la información remota sin modificar tu rama:

```bash
git fetch origin
git switch main
git pull --ff-only
git switch -c feature/calculadora
```

`git switch -c` crea la rama desde el commit actual y cambia hacia ella. Un nombre como `feature/calculadora` comunica intención; el equipo puede acordar prefijos como `fix/`, `docs/` o el identificador de una incidencia.

Después de uno o más commits pequeños y verificables, publica la rama y establece seguimiento:

```bash
git status
git push -u origin feature/calculadora
```

El seguimiento permite que futuros `git push` y `git pull` sepan qué rama remota corresponde. Publicar no integra la rama en `main`: normalmente abre la posibilidad de revisión mediante un pull request.

---

## 3. Formas de integrar con merge

`merge` conserva las identidades de los commits existentes y une historias.

### Fast-forward

Si `main` no avanzó desde que nació la rama, Git puede mover su referencia hacia adelante sin crear un commit adicional:

```bash
git switch main
git merge --ff-only feature/calculadora
```

Ventaja: historia mínima. Límite: la agrupación visual de la funcionalidad puede perderse. `--ff-only` falla de forma segura si la operación requiere otra estrategia.

### Merge commit

Cuando ambas ramas avanzaron, o cuando el equipo quiere conservar una frontera explícita, puede crear un commit con dos padres:

```bash
git switch main
git merge --no-ff feature/calculadora
```

Ventaja: preserva el contexto de la rama. Costo: agrega nodos de integración y puede hacer la historia más ramificada.

### Squash merge

`git merge --squash feature/calculadora` prepara el resultado combinado como un cambio nuevo, pero no crea un commit ni conserva la relación de merge. Puede simplificar muchos commits provisionales, a cambio de perder su identidad individual en `main`.

La política del repositorio decide qué forma usar. No cambies de estrategia solo para que el gráfico “se vea limpio”.

---

## 4. Detectar y resolver un conflicto de merge

Un conflicto aparece cuando Git no puede decidir cómo combinar cambios. No significa que se hayan perdido datos: Git detiene la operación y conserva las versiones para que una persona decida.

```bash
git switch main
git status
git merge --no-ff feature/calculadora
```

Si existe un conflicto, `git status` enumera los archivos. Dentro de ellos aparecen marcadores como estos:

```text
    <<<<<<< HEAD
versión de la rama actual
    =======
versión de feature/calculadora
    >>>>>>> feature/calculadora
```

Proceso seguro:

1. Abre cada archivo y entiende la intención de ambos lados.
2. Escribe el resultado correcto; no elijas “ours” o “theirs” automáticamente.
3. Elimina todos los marcadores.
4. Ejecuta `git diff --check` y los tests relevantes.
5. Prepara solo los archivos resueltos con `git add archivo`.
6. Comprueba `git status` y completa con `git merge --continue` o `git commit`.
7. Vuelve a ejecutar la verificación después del commit.

Si la integración fue iniciada sobre la rama incorrecta o necesitas investigar primero, vuelve al estado previo:

```bash
git merge --abort
git status
```

`git merge --abort` es preferible a editar referencias manualmente. Puede fallar si se mezclaron cambios locales no relacionados, otra razón para comenzar con un árbol limpio.

---

## 5. Qué hace rebase y cuál es su costo

`rebase` toma commits de una rama y los reproduce sobre una base diferente. Los commits reproducidos tienen nuevos identificadores porque cambian sus padres. El contenido final puede coincidir con un merge, pero la historia no es la misma.

Puede ser útil para actualizar una rama privada antes de revisión:

```bash
git fetch origin
git switch feature/calculadora
git status
git rebase origin/main
```

Ventajas posibles:

- historia lineal y fácil de recorrer;
- cada commit de la rama queda después de la base actual;
- los conflictos se resuelven commit por commit.

Costos:

- reescribe identificadores;
- puede exigir resolver un conflicto similar varias veces;
- dificulta colaborar si otras personas ya basaron trabajo en los commits antiguos.

**No hagas rebase de historial compartido** en `main` ni de una rama que otras personas consumen, salvo una coordinación explícita. Para historia pública, merge suele conservar mejor las referencias existentes.

---

## 6. Resolver conflictos durante rebase

Cuando rebase se detiene:

```bash
git status
```

Git indica el commit que intenta aplicar y los archivos en conflicto. Resuelve el contenido y continúa:

```bash
# Editar y eliminar <<<<<<<, ======= y >>>>>>>
git diff --check
git add ruta/al/archivo
git rebase --continue
```

Repite `status`, resolución, tests y `--continue` por cada commit conflictivo. No uses `git rebase --skip` sin verificar: descarta el parche del commit actual y puede eliminar funcionalidad.

Para abandonar toda la operación y recuperar la rama anterior al rebase:

```bash
git rebase --abort
git status
```

Después de un rebase exitoso, ejecuta la suite aplicable y compara la nueva historia:

```bash
git log --oneline --decorate --graph origin/main..HEAD
git status
```

---

## 7. Actualizar una rama reescrita con seguridad relativa

Si la rama era privada, ya estaba publicada y se reescribió deliberadamente, el remoto contiene los identificadores anteriores. Una actualización normal será rechazada.

`git push --force` reemplaza la referencia remota sin comprobar si otra persona publicó trabajo nuevo. **No lo uses como solución rápida.**

`--force-with-lease` agrega una condición: solo actualiza si la referencia remota coincide con la última que observaste. Sigue reescribiendo historia, pero reduce el riesgo de pisar cambios desconocidos:

```bash
git fetch origin
git log --oneline --left-right origin/feature/calculadora...HEAD
git push --force-with-lease origin feature/calculadora
```

Incluso con lease, avisa al equipo y confirma que la rama permite reescritura. Si es historia compartida, detente y usa merge o coordina un plan de recuperación.

---

## 8. Recuperar commits con reflog

El *reflog* registra movimientos recientes de referencias locales. Es útil después de un rebase, reset o cambio de rama equivocado:

```bash
git reflog --date=local
git show HASH_ENCONTRADO
```

Primero inspecciona el commit. Después crea una referencia de rescate sin mover ni borrar la rama actual:

```bash
git switch -c recovery/antes-del-rebase HASH_ENCONTRADO
git status
```

Trabaja desde esa rama para comparar o recuperar commits con revisión. El reflog es local, expira y no reemplaza un remoto o una copia de seguridad. No ejecutes mantenimiento agresivo mientras intentas recuperar datos.

---

## 9. Prácticas de colaboración

- Sincroniza referencias con `git fetch origin` antes de decidir una integración.
- Mantén commits pequeños, coherentes y verificables; no mezcles refactorizaciones ajenas al objetivo.
- Ejecuta tests antes y después de merge o rebase.
- Usa pull requests para revisar intención, no solo para detectar conflictos sintácticos.
- Acuerda si las ramas de trabajo pueden reescribirse y quién puede integrar `main`.
- Elimina una rama solo después de confirmar que sus commits están integrados y recuperables.
- Comunica force-with-lease antes de usarlo; el comando más seguro no reemplaza coordinación.

---

## 10. Ejercicio guiado

1. Desde una `main` limpia, crea `feature/saludo` con `git switch -c`.
2. Crea dos commits pequeños y publícalos con seguimiento.
3. Simula un cambio distinto en `main` y compara un merge commit con un rebase en ramas de práctica separadas.
4. Provoca un conflicto controlado, resuélvelo, ejecuta tests y completa la operación.
5. Repite y usa `--abort` para comprobar que puedes volver al estado inicial.
6. Localiza los movimientos con `git reflog` y crea una rama `recovery/` desde un commit anterior.

El objetivo no es preferir siempre rebase o merge, sino poder explicar el costo histórico, el riesgo colaborativo y el camino de recuperación de cada opción.
