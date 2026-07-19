---
title: 'Bajar y subir cambios'
course: 'git'
slug: 'bajar-y-subir-cambios'
order: 2
lang: 'es'
published: true
---

# 🔁 Idea clave antes de empezar

Cuando usas Git normalmente hay **dos copias del proyecto**:

1️⃣ **Tu computadora** (repositorio local)  
2️⃣ **Internet (GitHub)** (repositorio remoto, normalmente en **GitHub**)

👉 **Bajar cambios** = traer lo que está en GitHub a tu PC  
👉 **Subir cambios** = enviar lo que hiciste en tu PC a GitHub

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
git pull
```

### ¿Qué hace `git pull`?

Hace **dos cosas automáticamente**:

1. 📥 Descarga los cambios del repositorio remoto
    
2. 🔀 Los mezcla con tu proyecto local
    

---

## 📌 Ejemplo real (paso a paso)

### Situación:

- Tu proyecto está en GitHub
    
- Un compañero cambió un archivo
    
- Tú quieres ese cambio
    

### Pasos:

1️⃣ Entras a la carpeta del proyecto:

```bash
cd mi-proyecto
```

2️⃣ Bajas los cambios:

```bash
git pull
```

3️⃣ Git responde algo como:

```
Actualizando a1b2c3d..e4f5g6h
1 archivo modificado
```

🎉 Listo, ya tienes los cambios.

---

## ❗ Error común al hacer pull

Si Git dice algo como:

```
error: Your local changes would be overwritten
```

👉 Significa:

> Tienes cambios sin guardar (sin commit)

### Solución:

Guarda tus cambios primero:

```bash
git add .
git commit -m "Guardo cambios antes del pull"
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
git status
```

---

### 3️⃣ Agregas cambios

```bash
git add .
```

---

### 4️⃣ Guardas cambios (commit)

```bash
git commit -m "Actualizo el texto de saludo"
```

👉 Hasta aquí **TODO ES LOCAL** (solo en tu PC).

---

### 5️⃣ Subes a GitHub (push)

```bash
git push
```

🎉 Ahora el cambio está en GitHub.

---

## 🌍 Primera vez que haces push (importante)

La **primera vez** Git necesita saber **a dónde subir**.

Se hace así:

```bash
git push -u origin main
```

### ¿Qué significa?

- `origin` → repositorio remoto (GitHub)
    
- `main` → rama principal
    
- `-u` → lo recuerda para el futuro
    

Después de esto, solo usarás:

```bash
git push
```

---

# 🔄 Ciclo REAL de trabajo (vida real)

En un trabajo real SIEMPRE haces esto:

```bash
git pull
# trabajar
git add .
git commit -m "Mensaje claro"
git push
```

📌 **Este ciclo te salva de problemas**

---

# ⚠️ Conflictos al bajar cambios (explicado fácil)

Un **conflicto** pasa cuando:

- Tú cambiaste una línea
    
- Otra persona cambió la misma línea
    

Git no sabe cuál usar 😵‍💫

### Git te mostrará algo así:

```text
<<<<<<< HEAD
Tu versión
=======
Versión del otro
>>>>>>> commit
```

### Solución:

1. Abres el archivo
    
2. Eliges qué versión queda
    
3. Borras los símbolos
    
4. Guardas
    
5. Haces:
    

```bash
git add .
git commit -m "Resuelvo conflicto"
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