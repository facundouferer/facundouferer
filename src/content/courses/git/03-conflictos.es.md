---
title: 'Fusionar Ramas y Conflictos'
course: 'git'
slug: 'conflictos'
description: 'Domina el trabajo en ramas paralelas con branch y merge, y aprende a interpretar y resolver conflictos de integración paso a paso.'
order: 3
lang: 'es'
published: true
---

# 🔀 Ramas, Fusión y Manejo de Conflictos en Git

Cuando varios desarrolladores trabajan en paralelo sobre el mismo proyecto, las líneas de código divergen inevitablemente. Aprender a ramificar, fusionar y resolver los conflictos resultantes con precisión técnica es una habilidad imprescindible.

En esta lección aprenderás:
1. Cómo crear, cambiar y aislar trabajo en ramas con `git branch` y `git switch`.
2. Cómo integrar historias con `git merge` (fast-forward vs merge commit).
3. Qué es exactamente un conflicto de integración y por qué ocurre.
4. Cómo interpretar los marcadores de conflicto (`<<<<<<<`, `=======`, `>>>>>>>`).
5. El procedimiento paso a paso para resolver conflictos, testear y cerrar la fusión de forma limpia.

---

# 🌿 FUSIONAR RAMAS (MERGE) — EXPLICADO DESPACIO

## 🧠 Idea clave (primero la idea, luego los comandos)

Imagina esto:

* Rama `main` → versión estable del proyecto
* Rama `login` → estás trabajando una nueva función

👉 **Fusionar (merge)** significa:

> Traer los cambios de una rama a otra

Normalmente:

* Trabajas en una rama secundaria
* Fusionas **esa rama en `main`**

---

# 📊 Ejemplo visual de bifurcación y merge

<figure class="diagram">
<svg viewBox="0 0 720 280" role="img" aria-labelledby="d-git-merge-conflict-t">
<title id="d-git-merge-conflict-t">Bifurcación de ramas, integración con git merge y marcadores de conflicto</title>
<defs>
  <marker id="ar-main-l3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-branch-l3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
</defs>

<!-- Branch main line -->
<path d="M 60 70 L 620 70" fill="none" stroke="var(--color-accent)" stroke-width="3"/>
<text x="45" y="75" font-size="13" font-weight="700" font-family="monospace" text-anchor="end" fill="var(--color-accent-700)">main</text>

<!-- Branch feature/login curve -->
<path d="M 180 70 C 220 70, 230 150, 270 150 L 450 150 C 490 150, 500 70, 540 70" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-dasharray="7 4"/>
<text x="210" y="170" font-size="13" font-weight="700" font-family="monospace" fill="var(--color-accent-2-800)">login</text>

<!-- Commits on main -->
<circle cx="90" cy="70" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="90" y="75" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>

<circle cx="180" cy="70" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="180" y="75" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>

<circle cx="360" cy="70" r="16" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="3"/>
<text x="360" y="75" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<text x="360" y="45" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">Cambio en línea 2</text>

<!-- Commits on login -->
<circle cx="300" cy="150" r="16" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="3"/>
<text x="300" y="155" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D</text>

<circle cx="420" cy="150" r="16" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="3"/>
<text x="420" y="155" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">E</text>
<text x="420" y="185" font-size="11" text-anchor="middle" fill="var(--color-accent-2-800)">Cambio distinto en línea 2</text>

<!-- Merge Commit F -->
<circle cx="540" cy="70" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="3.5"/>
<text x="540" y="76" font-size="13" font-weight="800" text-anchor="middle" fill="var(--color-accent-700)">F</text>
<text x="540" y="40" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Merge Commit</text>

<!-- Conflict Marker Box (inset) -->
<rect x="60" y="205" width="600" height="60" rx="12" fill="var(--color-surface)" stroke="var(--color-divider)" stroke-width="1.5"/>
<text x="80" y="228" font-size="11.5" font-family="monospace" fill="var(--color-accent-700)">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (versión en main)</text>
<text x="80" y="244" font-size="11.5" font-family="monospace" fill="var(--color-neutral-700)">======= (separador)</text>
<text x="80" y="260" font-size="11.5" font-family="monospace" fill="var(--color-accent-2-800)">&gt;&gt;&gt;&gt;&gt;&gt;&gt; login (versión entrante)</text>
<text x="530" y="234" font-size="12" font-weight="700" fill="var(--color-accent-700)">¡Conflicto!</text>
<text x="530" y="252" font-size="11" fill="var(--color-neutral-700)">Misma línea modificada</text>
</svg>
<figcaption>Evolución de un merge con ramas divergentes: la rama <code>login</code> bifurca desde B y avanza en paralelo a <code>main</code>. Si ambas modifican las mismas líneas, Git inserta marcadores de conflicto antes de sellar el merge commit F.</figcaption>
</figure>

---

# 🧪 EJEMPLO REAL PASO A PASO (sin conflictos)

## Paso 1️⃣ Crear proyecto

```bash
# Inicializar repositorio de prueba
git init
```

Crear archivo:

```text
mensaje.txt
Hola mundo
```

```bash
# Preparar y crear el commit inicial en main
git add .
git commit -m "chore: mensaje inicial"
```

---

## Paso 2️⃣ Crear una rama nueva

```bash
# Crear la rama secundaria y saltar a ella
git checkout -b login
```

📌 Ahora estás en la rama `login`.

---

## Paso 3️⃣ Cambiar algo en la rama nueva

Editar `mensaje.txt`:

```text
Hola mundo
Agregando pantalla de login
```

Guardar:

```bash
# Confirmar el cambio en la rama login
git add .
git commit -m "feat: agrego pantalla de login"
```

---

## Paso 4️⃣ Volver a `main`

```bash
# Volver a la rama principal (los archivos se restauran a su estado en main)
git checkout main
```

📌 OJO: el archivo vuelve a su versión original en `main`.

---

## Paso 5️⃣ Fusionar la rama `login`

```bash
# Traer e integrar los cambios de login en main
git merge login
```

🎉 **Merge exitoso sin conflictos (Fast-Forward o auto-merge limpio)**

---

# ⚠️ AHORA: CONFLICTOS (lo importante)

## 🧠 ¿Cuándo hay conflictos?

Hay conflicto cuando:

* Dos ramas
* Cambian **la misma línea**
* De forma diferente

Git no sabe cuál elegir 🤯

---

# 💥 EJEMPLO REAL DE CONFLICTO

## Paso 1️⃣ Estado inicial

Archivo `mensaje.txt` en `main`:

```text
Hola mundo
```

---

## Paso 2️⃣ Rama `login` cambia el archivo

```bash
# Crear la rama de trabajo para la función
git checkout -b login
```

```text
Hola mundo desde login
```

```bash
# Preparar y confirmar la línea modificada en la rama login
git add .
git commit -m "feat: cambio texto en login"
```

---

## Paso 3️⃣ Volver a `main` y cambiar lo mismo

```bash
# Regresar a la rama main
git checkout main
```

```text
Hola mundo desde main
```

```bash
# Modificar la misma línea con otro contenido y confirmar en main
git add .
git commit -m "feat: cambio texto en main"
```

---

## Paso 4️⃣ Intentar fusionar (BOOM 💥)

```bash
# Intentar integrar la rama login en main (aquí Git detecta la colisión)
git merge login
```

Git responde:

```text
CONFLICT (content): Merge conflict in mensaje.txt
Automatic merge failed; fix conflicts and then commit the result.
```

---

# 🔍 QUÉ ES UN CONFLICTO (POR DENTRO)

Abres `mensaje.txt` y ves:

```text
<<<<<<< HEAD
Hola mundo desde main
=======
Hola mundo desde login
>>>>>>> login
```

### ¿Qué significa esto?

* `<<<<<<< HEAD` → lo que está en tu rama actual (`main`)
* `=======` → separador
* `>>>>>>> login` → lo que viene de la otra rama

---

# 🛠️ CÓMO RESOLVER EL CONFLICTO (PASO A PASO)

## Paso 1️⃣ Decidir qué queda

Opción A: quedarte con main:

```text
Hola mundo desde main
```

Opción B: quedarte con login:

```text
Hola mundo desde login
```

Opción C: combinar:

```text
Hola mundo desde main y login
```

👉 Tú decides.

---

## Paso 2️⃣ Borrar los marcadores

⚠️ **MUY IMPORTANTE**
Debes borrar:

```text
<<<<<<<
=======
>>>>>>>
```

---

## Paso 3️⃣ Guardar el archivo

El archivo debe quedar limpio:

```text
Hola mundo desde main y login
```

---

## Paso 4️⃣ Marcar como resuelto

```bash
# Informar a Git que el conflicto en este archivo ya fue resuelto
git add mensaje.txt
```

---

## Paso 5️⃣ Crear el commit de resolución

```bash
# Crear el commit final de merge que sella la resolución del conflicto
git commit -m "merge: resuelvo conflicto entre main y login"
```

🎉 Conflicto resuelto correctamente.

---

# 🔄 Flujo COMPLETO de merge con conflicto

```bash
# 1. Intentar la fusión de la rama
git merge login

# 2. Git reporta CONFLICT (content)
# 3. Abrir los archivos afectados en tu editor y resolver los marcadores

# 4. Marcar los archivos resueltos
git add .

# 5. Confirmar el commit de merge
git commit -m "merge: resuelvo conflicto"
```

---

# 🧠 Consejos profesionales

✔️ Haz `git pull` antes de trabajar
✔️ Haz commits pequeños
✔️ Usa ramas para TODO
✔️ Lee el conflicto con calma
✔️ Git NUNCA borra tu trabajo

---

# ❌ Errores comunes

❌ Borrar el archivo completo
❌ Hacer commit sin resolver
❌ Asustarse y cerrar todo 😅

---

# 🧠 RESUMEN FINAL

## Merge sin conflicto

```bash
git checkout main
git merge rama
```

## Merge con conflicto

1. Git avisa
2. Editas archivo
3. Borras marcadores
4. `git add`
5. `git commit`