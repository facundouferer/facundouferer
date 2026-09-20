---
title: 'Bajar y subir cambios'
course: 'git'
slug: 'bajar-y-subir-cambios'
description: 'Aprende a sincronizar tu trabajo local con GitHub mediante pull, push y upstream tracking, integrando cambios ajenos sin perder tu progreso.'
order: 2
lang: 'es'
published: true
---

# 🔄 Bajar y Subir Cambios: Repositorios Remotos y GitHub

Trabajar de forma aislada en tu computadora es solo el primer paso. El verdadero poder del control de versiones se despliega cuando sincronizas tu trabajo con repositorios remotos alojados en plataformas como GitHub, coordinando avances con otros desarrolladores.

En esta lección aprenderás:
1. La arquitectura entre repositorios locales y remotos (`origin`).
2. Cómo publicar tus commits en la nube con `git push`.
3. La diferencia fundamental entre `git fetch` y `git pull`.
4. Cómo configurar ramas de seguimiento (*upstream tracking* con `-u`).
5. El flujo de trabajo diario para descargar cambios de forma segura sin pisar tu trabajo.

---

# 🔁 Idea clave antes de empezar

Cuando usas Git normalmente hay **dos copias del proyecto**:

1️⃣ **Tu computadora** (repositorio local)  
2️⃣ **Internet (GitHub)** (repositorio remoto, normalmente bajo el alias **origin**)

👉 **Bajar cambios** = traer lo que está en GitHub a tu PC (`git pull`)  
👉 **Subir cambios** = enviar lo que confirmaste en tu PC a GitHub (`git push`)

<figure class="diagram">
<svg viewBox="0 0 720 270" role="img" aria-labelledby="d-git-sync-t">
<title id="d-git-sync-t">Sincronización entre Repositorio Local y Repositorio Remoto (GitHub)</title>
<defs>
  <marker id="ar-push-l2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
  </marker>
  <marker id="ar-fetch-l2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/>
  </marker>
  <marker id="ar-pull-l2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-700)"/>
  </marker>
</defs>

<!-- Local Box -->
<rect x="20" y="25" width="280" height="220" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)" stroke-width="2"/>
<text x="160" y="55" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">💻 Repositorio Local (Tu PC)</text>
<rect x="40" y="75" width="240" height="42" rx="10" fill="var(--color-bg)" stroke="var(--color-divider)"/>
<text x="55" y="101" font-size="12" font-family="monospace" fill="var(--color-text)">Working Tree &amp; Staging</text>
<rect x="40" y="130" width="240" height="42" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="55" y="156" font-size="12" font-family="monospace" font-weight="700" fill="var(--color-accent-700)">Rama local: main</text>
<rect x="40" y="185" width="240" height="42" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="55" y="211" font-size="12" font-family="monospace" fill="var(--color-neutral-700)">Tracking ref: origin/main</text>

<!-- Remote Box -->
<rect x="420" y="25" width="280" height="220" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="560" y="55" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">☁️ Remoto (GitHub - origin)</text>
<rect x="440" y="100" width="240" height="85" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="560" y="135" font-size="13" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">refs/heads/main</text>
<text x="560" y="160" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">Historial compartido en la nube</text>

<!-- Arrow Push (Local -> Remote) -->
<path d="M 300 95 L 414 95" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-push-l2)"/>
<text x="360" y="86" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git push</text>

<!-- Arrow Fetch (Remote -> Local tracking ref) -->
<path d="M 420 150 L 306 150" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#ar-fetch-l2)"/>
<text x="360" y="142" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-2-800)">git fetch</text>

<!-- Arrow Pull (Remote -> Local working tree + merge) -->
<path d="M 420 205 L 306 205" fill="none" stroke="var(--color-accent-700)" stroke-width="2.5" marker-end="url(#ar-pull-l2)"/>
<text x="360" y="196" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle" fill="var(--color-accent-700)">git pull (fetch+merge)</text>
</svg>
<figcaption>Sincronización Git: <code>git push</code> publica tus commits locales en GitHub, mientras que <code>git pull</code> descarga los cambios remotos y los fusiona en tu rama activa de trabajo.</figcaption>
</figure>

---

# 📥 BAJAR CAMBIOS (pull)

## 🧠 ¿Cuándo necesitas bajar cambios?

- Al empezar a trabajar
- Cuando alguien más cambió el proyecto
- Cuando trabajas en varios dispositivos
- Para evitar conflictos

💡 **Regla de oro**:  
👉 _Antes de trabajar → baja cambios_

---

## 🔹 Comando principal para bajar cambios

```bash
# Descarga los commits del remoto y los fusiona en la rama actual
git pull
```

### ¿Qué hace `git pull`?

Hace **dos cosas automáticamente**:

1. 📥 **`git fetch`**: Descarga los nuevos commits del repositorio remoto sin tocar tus archivos de trabajo.
2. 🔀 **`git merge`**: Los mezcla automáticamente con tu rama local activa.

---

## 📌 Ejemplo real (paso a paso)

### Situación:

- Tu proyecto está en GitHub
- Un compañero cambió un archivo
- Tú quieres ese cambio en tu máquina

### Pasos:

1️⃣ Entras a la carpeta del proyecto:

```bash
# Navegar a la carpeta de trabajo
cd mi-proyecto
```

2️⃣ Bajas los cambios:

```bash
# Traer y fusionar los cambios de GitHub
git pull
```

3️⃣ Git responde algo como:

```text
Actualizando a1b2c3d..e4f5g6h
1 archivo modificado
```

🎉 Listo, ya tienes los cambios integrados.

---

## ❗ Error común al hacer pull

Si Git dice algo como:

```text
error: Your local changes would be overwritten
```

👉 Significa:

> Tienes cambios sin guardar (sin commit) en las mismas líneas que fueron modificadas en el remoto.

### Solución:

Guarda tus cambios locales en un commit antes de traer lo ajeno:

```bash
# 1. Preparar tus cambios pendientes
git add .

# 2. Confirmar tu trabajo local
git commit -m "chore: guardo cambios antes del pull"

# 3. Ahora sí bajar y fusionar las novedades remotas
git pull
```

---

# 📤 SUBIR CAMBIOS (push)

## 🧠 ¿Cuándo necesitas subir cambios?

- Cuando terminaste una tarea
    
- Cuando quieres respaldar tu trabajo
    
- Cuando otros necesitan tus cambios
    

💡 **Regla de oro**:  
👉 _Después de trabajar → sube cambios_

---

## 🔹 Flujo completo para subir cambios

⚠️ **Esto es MUY importante, memorízalo**:

```text
Editar → add → commit → push
```

---

## 📌 Ejemplo completo de subir cambios

### 1️⃣ Modificas un archivo

Editas:

```text
hola.txt
```

---

### 2️⃣ Revisas estado

```bash
# Consultar el archivo modificado en el working directory
git status
```

---

### 3️⃣ Agregas cambios

```bash
# Preparar las modificaciones en el staging area
git add .
```

---

### 4️⃣ Guardas cambios (commit)

```bash
# Crear el commit en la base de datos local
git commit -m "docs: actualizo el texto de saludo"
```

👉 Hasta aquí **TODO ES LOCAL** (solo en tu PC).

---

### 5️⃣ Subes a GitHub (push)

```bash
# Enviar los commits locales a la rama remota vinculada
git push
```

🎉 Ahora el cambio está en GitHub.

---

## 🌍 Primera vez que haces push (importante)

La **primera vez** Git necesita saber **a dónde subir**.

Se hace así:

```bash
# Subir al remoto origin y configurar seguimiento para que en el futuro baste con escribir 'git push'
git push -u origin main
```

### ¿Qué significa?

- `origin` → el alias del repositorio remoto (GitHub)
- `main` → la rama que estás subiendo
- `-u` → establece el upstream (rastreo) para que Git recuerde la asociación

Después de esto, en el día a día solo usarás:

```bash
# Subir cambios con seguimiento ya configurado
git push
```

---

# 🔄 Ciclo REAL de trabajo (vida real)

En un trabajo profesional diario SIEMPRE sigues este orden:

```bash
# 1. Al comenzar el día: traer las novedades del equipo
git pull

# 2. Trabajar, programar y probar localmente...

# 3. Preparar las modificaciones terminadas
git add .

# 4. Crear un commit con propósito único
git commit -m "feat: implemento cálculo de descuentos"

# 5. Publicar tus cambios en el repositorio compartido
git push
```

📌 **Este ciclo te salva de problemas**

---

# ⚠️ Conflictos al bajar cambios (explicado fácil)

Un **conflicto** pasa cuando:

- Tú cambiaste una línea
- Otra persona cambió la misma línea
- Ambos intentaron subir o bajar cambios

Git no sabe cuál de las dos versiones es la correcta 😵‍💫

### Git te mostrará algo así:

```text
<<<<<<< HEAD
Tu versión local
=======
Versión que viene de GitHub
>>>>>>> commit_remoto
```

### Solución:

1. Abres el archivo con tu editor
2. Decides qué versión queda (o combinas ambas)
3. Borras los símbolos marcadores (`<<<<<<<`, `=======`, `>>>>>>>`)
4. Guardas el archivo limpio
5. Confirmas la resolución:

```bash
# 1. Marcar el archivo resuelto como preparado
git add .

# 2. Crear el commit de resolución
git commit -m "fix: resuelvo conflicto de merge con origin/main"

# 3. Subir la versión unificada a GitHub
git push
```

---

# 🧠 Comandos esenciales (resumen)

|Acción|Comando|
|---|---|
|Ver estado|`git status`|
|Bajar cambios|`git pull`|
|Agregar cambios|`git add .`|
|Guardar cambios|`git commit -m "mensaje"`|
|Subir cambios|`git push`|

---

# ❌ Errores típicos de principiantes

❌ Hacer `push` sin `pull` antes  
❌ No hacer commits  
❌ Mensajes como “cambios”  
❌ Trabajar directo en `main` en equipo

---

# 🧠 Regla final (muy importante)

📥 **Antes de trabajar** → `git pull`  
📤 **Después de trabajar** → `git push`