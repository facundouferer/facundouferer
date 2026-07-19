---
title: 'Fusionar Ramas y Conflictos'
course: 'git'
slug: 'conflictos'
order: 3
lang: 'es'
published: true
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

# 📊 Ejemplo visual (mental)

```
main:   A --- B --- C
                 \
login:             D --- E
```

Después del merge:

```
main:   A --- B --- C --- F
                 \     /
login:             D --- E
```

---

# 🧪 EJEMPLO REAL PASO A PASO (sin conflictos)

## Paso 1️⃣ Crear proyecto

```bash
git init
```

Crear archivo:

```text
mensaje.txt
Hola mundo
```

```bash
git add .
git commit -m "Mensaje inicial"
```

---

## Paso 2️⃣ Crear una rama nueva

```bash
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
git add .
git commit -m "Agrego login"
```

---

## Paso 4️⃣ Volver a `main`

```bash
git checkout main
```

📌 OJO: el archivo vuelve a su versión original.

---

## Paso 5️⃣ Fusionar la rama `login`

```bash
git merge login
```

🎉 **Merge exitoso sin conflictos**

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
git checkout -b login
```

```text
Hola mundo desde login
```

```bash
git add .
git commit -m "Cambio texto en login"
```

---

## Paso 3️⃣ Volver a `main` y cambiar lo mismo

```bash
git checkout main
```

```text
Hola mundo desde main
```

```bash
git add .
git commit -m "Cambio texto en main"
```

---

## Paso 4️⃣ Intentar fusionar (BOOM 💥)

```bash
git merge login
```

Git responde:

```
CONFLICT (content): Merge conflict in mensaje.txt
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

```
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
git add mensaje.txt
```

---

## Paso 5️⃣ Crear el commit de resolución

```bash
git commit -m "Resuelvo conflicto entre main y login"
```

🎉 Conflicto resuelto correctamente.

---

# 🔄 Flujo COMPLETO de merge con conflicto

```bash
git merge login
# conflicto
# editar archivo
git add .
git commit -m "Resuelvo conflicto"
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