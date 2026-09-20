---
title: 'El principio con Git'
course: 'git'
slug: 'el-principio-con-git'
description: 'Comprende los fundamentos del control de versiones, instala y configura tu identidad con git config y domina el ciclo de tres estados.'
order: 1
lang: 'es'
published: true
---

# 🚀 El principio con Git: Fundamentos y Primeros Pasos

El control de versiones es la habilidad base de cualquier desarrollador moderno. Sin él, coordinar código en equipo o volver a un estado funcional anterior es prácticamente imposible.

En esta lección aprenderás:
1. Qué es Git y por qué es el estándar indiscutido de la industria.
2. Conceptos fundamentales: repositorios, archivos, commits e historial.
3. Cómo instalar Git y configurar tu identidad obligatoria con `git config`.
4. El ciclo de vida de los tres estados: Working Directory, Staging Area y Repository.
5. Cómo inspeccionar el historial y crear tus primeras ramas de trabajo.

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

```bash
git --version
```

---

# ⚙️ Configuración inicial (obligatorio antes de empezar)

Antes de crear tu primer commit, Git **necesita saber quién eres**. Cada cambio en el historial queda firmado con un nombre y un correo electrónico.

### Configurar tu identidad

Ejecuta en tu terminal:

```bash
git config --global user.name "Tu Nombre Completo"
git config --global user.email "tu-correo@ejemplo.com"
```

> 💡 **Nota importante**: `user.name` y `user.email` son metadatos para firmar los commits, no credenciales para autenticarte contra GitHub. Puedes usar el mismo correo de tu cuenta de GitHub para que la plataforma vincule tus commits a tu perfil.

### Configurar la rama principal por defecto

Históricamente Git llamaba a la rama inicial `master`. El estándar actual de la industria y de GitHub es `main`:

```bash
git config --global init.defaultBranch main
```

### ¿Dónde se guarda esta configuración?

* **`--global`**: Aplica a todos los repositorios en tu computadora (se guarda en el archivo `~/.gitconfig`).
* **`--local`**: Aplica únicamente al repositorio actual (útil si manejas una cuenta laboral y otra personal).

Para verificar tu configuración activa en cualquier momento:

```bash
git config --list
```

---

# 🚀 Empezando con Git (primeros pasos)

## Paso 1: Crear un proyecto

Crea una carpeta y entra en ella:

```bash
# Crear la carpeta de nuestro nuevo proyecto
mkdir mi-proyecto

# Entrar al directorio del proyecto
cd mi-proyecto
```

---

## Paso 2: Inicializar Git

Dentro de la carpeta:

```bash
# Inicializar un nuevo repositorio Git local en este directorio
git init
```

👉 Esto crea un repositorio Git.

💡 Git ahora controla esta carpeta.

---

# 📂 El estado de Git (muy importante)

Siempre puedes preguntar:

```bash
# Consultar el estado actual del directorio de trabajo y del staging area
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

Git trabaja en **3 zonas fundamentales**:

### 1️⃣ Working Directory
Tus archivos normales en disco, donde programas y editas.

### 2️⃣ Staging Area
El área de preparación donde seleccionas exactamente qué cambios formarán parte del próximo commit.

### 3️⃣ Repository (.git)
La base de datos local donde Git guarda el historial definitivo en forma de commits.

<figure class="diagram">
<svg viewBox="0 0 720 260" role="img" aria-labelledby="d-git-3zonas-t">
<title id="d-git-3zonas-t">Las tres zonas de Git: Working Directory, Staging Area y Repository</title>
<defs>
  <marker id="ar-fwd-l1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-back-l1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
</defs>

<!-- Zone 1: Working Directory -->
<rect x="20" y="30" width="200" height="155" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)" stroke-width="2"/>
<text x="120" y="58" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">1. Working Directory</text>
<text x="120" y="80" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Archivos en disco</text>
<rect x="40" y="100" width="160" height="32" rx="8" fill="var(--color-bg)" stroke="var(--color-divider)"/>
<text x="120" y="121" font-size="11" font-family="monospace" text-anchor="middle" fill="var(--color-text)">hola.txt (modificado)</text>
<text x="120" y="162" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">Cambios sin preparar</text>

<!-- Zone 2: Staging Area -->
<rect x="260" y="30" width="200" height="155" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="58" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">2. Staging Area</text>
<text x="360" y="80" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Preparados para commit</text>
<rect x="280" y="100" width="160" height="32" rx="8" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="360" y="121" font-size="11" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">hola.txt (en stage)</text>
<text x="360" y="162" font-size="11" text-anchor="middle" fill="var(--color-accent-700)">Listo para el snapshot</text>

<!-- Zone 3: Repository -->
<rect x="500" y="30" width="200" height="155" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="600" y="58" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">3. Repository (.git)</text>
<text x="600" y="80" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Historial permanente</text>
<rect x="520" y="100" width="160" height="32" rx="8" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="600" y="121" font-size="11" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">commit: a1b2c3d</text>
<text x="600" y="162" font-size="11" text-anchor="middle" fill="var(--color-accent-2-800)">Versión registrada</text>

<!-- Arrow 1: git add -->
<path d="M 220 116 L 254 116" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-fwd-l1)"/>
<text x="240" y="106" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git add</text>

<!-- Arrow 2: git commit -->
<path d="M 460 116 L 494 116" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-fwd-l1)"/>
<text x="480" y="106" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git commit</text>

<!-- Arrow 3: restore staged -->
<path d="M 360 185 C 360 225, 120 225, 120 191" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ar-back-l1)"/>
<text x="240" y="235" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">git restore --staged (deshacer stage)</text>
</svg>
<figcaption>El ciclo de vida en tres estados de Git: tus modificaciones en el directorio de trabajo se seleccionan con <code>git add</code> hacia el Staging Area y se confirman con <code>git commit</code> en la base de datos local.</figcaption>
</figure>

Para mover un archivo a staging:

```bash
# Agregar un archivo específico al staging area
git add hola.txt
```

O todos los archivos modificados a la vez:

```bash
# Agregar todos los cambios del directorio actual al staging area
git add .
```

---

# 💾 Guardar cambios (commit)

Ahora guarda los cambios:

```bash
# Crear un commit que registra los cambios del staging area en el historial
git commit -m "Agrego archivo hola.txt"
```

🎉 ¡Primer commit hecho!

---

# 🔁 Flujo básico de Git (memorízalo)

Este es el **flujo más importante de Git**:

```text
Editar → git add → git commit
```

Siempre será así.

---

# 🧪 Modificar un archivo

Edita `hola.txt`:

```text
Hola mundo
Estoy aprendiendo Git
```

Revisa estado:

```bash
# Verificar qué archivos fueron modificados tras la edición
git status
```

Agrega y guarda:

```bash
# Preparar las modificaciones en el staging area
git add .

# Confirmar la nueva versión en el repositorio
git commit -m "Actualizo mensaje de saludo"
```

---

# ⏪ Volver atrás en el tiempo

Ver historial:

```bash
# Listar los commits cronológicos con su autor, fecha y hash identificador
git log
```

Verás una lista de commits. Cada commit tiene un **ID** único.

Para volver a un commit:

```bash
# Inspeccionar el estado del proyecto en un commit específico (modo lectura)
git checkout ID_DEL_COMMIT
```

⚠️ Esto es modo lectura (no para trabajar directamente).

---

# 🌿 Ramas (branches)

## ¿Qué es una rama?

Una rama es una **línea paralela de trabajo**.

🌱 Te permite:

- Probar ideas sin afectar la rama principal
- Trabajar en equipo en paralelo sin pisarse

La rama principal se llama:

```text
main
```

---

## Crear una rama

```bash
# Crear una nueva rama a partir del commit actual
git branch nueva-funcion
```

Cambiar a ella:

```bash
# Cambiar de rama de trabajo
git checkout nueva-funcion
```

O en un solo paso (muy recomendado):

```bash
# Crear la rama y cambiar a ella inmediatamente
git checkout -b nueva-funcion
```

---

## Fusionar ramas (merge)

Vuelve a main:

```bash
# Regresar a la rama principal
git checkout main
```

Fusiona:

```bash
# Integrar los commits de la rama secundaria en la rama actual (main)
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

1. Crear un repositorio vacío en GitHub (sin README ni .gitignore iniciales).
2. Conectar el repositorio local con el remoto:

```bash
# Asociar la URL remota de GitHub bajo el alias 'origin'
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
```

3. Subir código y configurar seguimiento:

```bash
# Subir la rama local 'main' al remoto 'origin' y configurar seguimiento (-u)
git push -u origin main
```

---

# 📥 Descargar un proyecto

```bash
# Clonar un repositorio existente desde GitHub a tu equipo
git clone https://github.com/usuario/repositorio.git
```

---

# ⚠️ Errores comunes

❌ No hacer commits seguido  
❌ Mensajes de commit malos  
❌ Trabajar sin ramas  
❌ No usar git status

---

# 🧠 Próximos pasos en este curso

Ahora que conoces las bases y el ciclo local, avanza con las siguientes lecciones del curso:

1. **Lección 2: Bajar y subir cambios**: Sincronización remota con GitHub (`pull`, `push`, tracking branches).
2. **Lección 3: Fusionar ramas y conflictos**: Trabajo colaborativo con ramas (`branch`, `merge`) y cómo resolver conflictos de integración.
3. **Lección 4: Rebase y buenas prácticas**: Rebase paso a paso, historial lineal, commits atómicos, Conventional Commits y uso correcto de `.gitignore`.

---

# 📌 Resumen final

Git te permite:

- Guardar versiones
- Volver atrás
- Trabajar en equipo
- Programar profesionalmente

Flujo clave que usarás a diario:

```bash
# 1. Comprobar qué archivos cambiaron
git status

# 2. Agregar los cambios al área de preparación
git add .

# 3. Guardar el snapshot con un mensaje claro
git commit -m "feat: agrego mensaje claro"
```