---
title: 'El principio con Git'
course: 'git'
slug: 'el-principio-con-git'
order: 1
lang: 'es'
published: true
---

# ¿Qué es Git?

**Git es un sistema de control de versiones.**

👉 En palabras simples:  
**Git sirve para guardar la historia de los cambios de un proyecto**, igual que un “guardar partida” en un videojuego.

### Analogía sencilla

Imagina que escribes un trabajo en Word:

- Versión 1
    
- Versión 2
    
- Versión final
    
- Versión final FINAL 😅
    

Git hace eso automáticamente, pero:

- Guarda **cada cambio**
    
- Te permite **volver atrás**
    
- Te deja **trabajar en equipo sin pisarse**
    
- Funciona perfecto con código
    

---

# 🧠 ¿Por qué Git es tan importante?

Aprender Git te permite:

- No perder tu trabajo
    
- Trabajar con otras personas
    
- Probar ideas sin romper nada
    
- Trabajar como un programador profesional
    

💡 **TODAS** las empresas de tecnología usan Git.

---

# 🧩 Conceptos fundamentales (muy importante)

Antes de usar comandos, necesitas entender **estos conceptos clave**:

## 1️⃣ Repositorio (repo)

Es el **proyecto**.

📦 Piensa en un repositorio como:

> Una carpeta especial que Git controla

Puede contener:

- Código
    
- Imágenes
    
- Documentación
    
- Cualquier archivo
    

---

## 2️⃣ Archivo

Son los archivos normales:

- `.html`
    
- `.css`
    
- `.js`
    
- `.txt`
    

Git **observa** estos archivos y detecta cambios.

---

## 3️⃣ Versión / Commit

Un **commit** es una **foto del proyecto en un momento del tiempo**.

📸 Cada commit:

- Tiene un mensaje (“qué hice”)
    
- Tiene fecha
    
- Tiene autor
    

Ejemplo de mensaje de commit:

```
Agrego botón de login
```

---

## 4️⃣ Historial

Git guarda todos los commits en orden.

Esto te permite:

- Ver qué cambió
    
- Volver a una versión anterior
    
- Saber quién hizo qué
    

---

# 🧰 Instalación de Git

### En Windows

Descarga desde:  
👉 [https://git-scm.com](https://git-scm.com/)

Instálalo dejando las opciones por defecto.

### En macOS

```
brew install git
```

### En Linux

```
sudo apt install git
```

Verifica que está instalado:

```
git --version
```

---

# 🚀 Empezando con Git (primeros pasos)

## Paso 1: Crear un proyecto

Crea una carpeta:

```
mi-proyecto
```

Entra a la carpeta:

```
cd mi-proyecto
```

---

## Paso 2: Inicializar Git

Dentro de la carpeta:

```
git init
```

👉 Esto crea un repositorio Git.

💡 Git ahora controla esta carpeta.

---

# 📂 El estado de Git (muy importante)

Siempre puedes preguntar:

```
git status
```

Esto te dice:

- Qué archivos cambiaron
    
- Qué está listo para guardar
    
- Qué no
    

---

# 📝 Crear tu primer archivo

Crea un archivo llamado:

```
hola.txt
```

Contenido:

```
Hola, este es mi primer proyecto con Git
```

Revisa el estado:

```
git status
```

Verás algo como:

> archivo nuevo no rastreado

---

# ➕ Agregar archivos (staging)

Git trabaja en **3 zonas**:

### 1️⃣ Working Directory

Tus archivos normales

### 2️⃣ Staging Area

Archivos listos para guardar

### 3️⃣ Repository

Archivos guardados (commits)

Para mover un archivo a staging:

```
git add hola.txt
```

O todos:

```
git add .
```

---

# 💾 Guardar cambios (commit)

Ahora guarda los cambios:

```
git commit -m "Agrego archivo hola.txt"
```

🎉 ¡Primer commit hecho!

---

# 🔁 Flujo básico de Git (memorízalo)

Este es el **flujo más importante de Git**:

```
Editar → git add → git commit
```

Siempre será así.

---

# 🧪 Modificar un archivo

Edita `hola.txt`:

```
Hola mundo
Estoy aprendiendo Git
```

Revisa estado:

```
git status
```

Agrega y guarda:

```
git add .
git commit -m "Actualizo mensaje de saludo"
```

---

# ⏪ Volver atrás en el tiempo

Ver historial:

```
git log
```

Verás una lista de commits.

Cada commit tiene un **ID**.

Para volver a un commit:

```
git checkout ID_DEL_COMMIT
```

⚠️ Esto es modo lectura (no para trabajar).

---

# 🌿 Ramas (branches)

## ¿Qué es una rama?

Una rama es una **línea paralela de trabajo**.

🌱 Te permite:

- Probar ideas
    
- No romper el proyecto principal
    

La rama principal se llama:

```
main
```

---

## Crear una rama

```
git branch nueva-funcion
```

Cambiar a ella:

```
git checkout nueva-funcion
```

O en un solo paso:

```
git checkout -b nueva-funcion
```

---

## Fusionar ramas (merge)

Vuelve a main:

```
git checkout main
```

Fusiona:

```
git merge nueva-funcion
```

---

# 🌍 Git vs GitHub (muy importante)

🚫 **Git NO es GitHub**

|Git|GitHub|
|---|---|
|Herramienta local|Plataforma online|
|Controla versiones|Guarda repositorios|
|Funciona sin internet|Requiere internet|

GitHub usa Git, pero **no son lo mismo**.

---

# ☁️ Subir proyecto a GitHub (básico)

1. Crear repositorio en GitHub
    
2. Conectar repositorio local:
    

```
git remote add origin URL
```

3. Subir código:
    

```
git push -u origin main
```

---

# 📥 Descargar un proyecto

```
git clone URL_DEL_REPO
```

---

# ⚠️ Errores comunes

❌ No hacer commits seguido  
❌ Mensajes de commit malos  
❌ Trabajar sin ramas  
❌ No usar git status

---

# 🧠 Qué debes aprender después

Cuando domines esto:

1. `.gitignore`
    
2. Conflictos de merge
    
3. Rebase
    
4. GitHub Flow
    
5. Pull Requests
    

---

# 📌 Resumen final

Git te permite:

- Guardar versiones
    
- Volver atrás
    
- Trabajar en equipo
    
- Programar profesionalmente
    

Flujo clave:

```
git status
git add .
git commit -m "mensaje claro"
```