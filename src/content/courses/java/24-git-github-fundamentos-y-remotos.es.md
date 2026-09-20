---
course: 'java'
slug: '24-git-github-fundamentos-y-remotos'
title: 'Git y GitHub: Fundamentos y Repositorios Remotos'
description: 'Aprendé un flujo seguro con Git local, GitHub, configuración de identidad, commits, remotos, clone, fetch, pull y push.'
order: 7
lang: 'es'
published: true
---

# Git y GitHub: Fundamentos y Repositorios Remotos

Git registra versiones de un proyecto en tu equipo. GitHub aloja repositorios Git y agrega colaboración, revisión, incidencias y automatización. **Git y GitHub no son lo mismo**: podés usar Git sin GitHub, y GitHub es un servicio de alojamiento que se apoya en Git.

Esta lección construye un flujo completo sin asumir que ya tenés credenciales configuradas. La prioridad es saber qué cambia cada comando antes de ejecutarlo.

---

## 1. Instalar y verificar Git

Instalá Git desde el sitio oficial o desde el gestor de paquetes confiable de tu sistema. Evitá instaladores reenviados por terceros. Después verificá qué ejecutable y versión usarás:

```bash
git --version
git help --all
```

Si la terminal responde `command not found`, la instalación no terminó o Git no está en `PATH`. Cerrá y abrí la terminal, confirmá la ruta según tu sistema y corregí la instalación antes de crear un repositorio.

También comprobá el directorio actual antes de cualquier comando que modifique archivos:

```bash
pwd
git rev-parse --show-toplevel
```

El segundo comando falla fuera de un repositorio. Ese error es información útil: no ejecutes `git init` automáticamente hasta confirmar que realmente querés crear un repositorio en ese directorio.

---

## 2. Configurar la identidad con el alcance correcto

Cada commit guarda nombre y correo del autor. La configuración global se usa como valor predeterminado para todos tus repositorios:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@example.com"
```

Un repositorio puede necesitar otra identidad, por ejemplo una dirección laboral. Dentro de ese repositorio, la configuración local tiene prioridad:

```bash
git config --local user.name "Tu Nombre Profesional"
git config --local user.email "tu-correo-laboral@example.com"
```

Revisá el valor efectivo y su origen antes de publicar:

```bash
git config --show-origin --get user.name
git config --show-origin --get user.email
```

`user.name` y `user.email` identifican commits; **no autentican contra GitHub**. Si Git informa `Author identity unknown`, configurá el alcance correcto y volvé a intentar el commit. No inventes datos ni cambies toda la configuración global si el ajuste corresponde solo al proyecto.

---

## 3. Crear el repositorio local y el primer commit

Partí de un directorio de proyecto que ya revisaste:

```bash
cd mi-proyecto
git init -b main
git status
```

`git status` es el tablero de control: muestra archivos sin seguimiento, cambios preparados y la rama actual. Antes de preparar archivos, creá `.gitignore` para excluir contenido regenerable o sensible:

```text
# Compilación y herramientas
target/
.idea/
*.class

# Configuración local y secretos
.env
*.key
```

`.gitignore` no borra ni deja de seguir un archivo que ya fue confirmado. Tampoco reemplaza la revisión: nombres como `.env.production` requieren una regla adecuada.

Prepará solo lo que entendés, inspeccioná y confirmá:

```bash
git status --short
git add README.md src/ .gitignore
git diff --cached
git commit -m "chore: initialize Java project"
git status
```

El área de preparación (*staging area*) permite decidir qué formará el próximo commit. Si agregaste el archivo equivocado, retiralo sin borrar su contenido:

```bash
git restore --staged ruta/al/archivo
git status --short
```

Nunca confirmes contraseñas, tokens, claves privadas ni archivos `.env`. Si un secreto llegó a un commit, borrarlo en el siguiente commit no lo elimina del historial: **rotá o revocá el secreto primero** y seguí un procedimiento de limpieza de historial revisado por el equipo.

---

## 4. Crear un repositorio en GitHub sin duplicar historia

Para publicar un repositorio local existente:

1. Iniciá sesión en la cuenta de GitHub que realmente debe alojarlo.
2. Creá un repositorio vacío con el nombre y la visibilidad correctos.
3. No generes README, licencia ni `.gitignore` desde GitHub si ya existen localmente; así evitás dos historias iniciales distintas.
4. Revisá nuevamente `git diff --cached`, el último commit y la ausencia de secretos.
5. Copiá la URL HTTPS o SSH desde la página del repositorio; no la escribas de memoria.

Elegir público o privado controla acceso, pero **un repositorio privado no es un gestor de secretos**. Credenciales y datos sensibles deben permanecer fuera del historial.

---

## 5. HTTPS o SSH

| Transporte | Ventajas | Consideraciones |
| :--- | :--- | :--- |
| **HTTPS** | Funciona bien detrás de muchos proxies y es simple con un gestor de credenciales. | GitHub no acepta la contraseña de la cuenta para operaciones Git; la autenticación puede usar navegador, gestor de credenciales o token según tu entorno. No pegues tokens en la URL. |
| **SSH** | Cómodo para uso frecuente y no envía un token en cada operación. | Requiere crear una clave, proteger la clave privada y registrar únicamente la clave pública en GitHub. Puede estar bloqueado en algunas redes. |

Esta lección no asume credenciales disponibles. Elegí el método permitido por tu organización y seguí la documentación de autenticación correspondiente. Nunca reutilices una clave privada de otra persona ni la agregues al repositorio.

---

## 6. Conectar, validar y publicar

Agregá el remoto con la URL que copiaste:

```bash
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git remote -v
git remote get-url origin
git branch --show-current
```

Antes de enviar, verificá tres hechos:

- `origin` apunta a la cuenta y repositorio esperados;
- la rama actual es `main` —o el nombre acordado por el equipo—;
- el directorio de trabajo no contiene cambios olvidados.

Publicá el primer commit y establecé el seguimiento (*upstream*):

```bash
git push -u origin main
```

`-u` vincula la rama local `main` con `origin/main`. Después, `git push` y `git pull` pueden usar ese seguimiento sin repetir nombres. Si tu rama tiene otro nombre, no copies `main` a ciegas: usá la salida validada de `git branch --show-current`.

Un error de autenticación no autoriza a probar credenciales ajenas. Confirmá la URL, el protocolo elegido y la sesión o clave explícitamente configurada para esa cuenta.

---

## 7. Clonar y sincronizar un repositorio existente

`git clone` crea una copia local, configura `origin` y normalmente establece seguimiento para la rama inicial:

```bash
git clone https://github.com/USUARIO/REPOSITORIO.git
cd REPOSITORIO
git remote get-url origin
git branch --show-current
git status
```

Para sincronizar, distinguí estas operaciones:

- `git fetch origin` descarga referencias y commits remotos **sin integrar** cambios en tu rama.
- `git pull` ejecuta una descarga y luego integra según la configuración. Antes de usarlo, revisá que estés en la rama correcta y que el trabajo local esté guardado.
- `git push` envía commits locales al remoto configurado; no envía archivos que nunca fueron confirmados.

Un flujo deliberado permite inspeccionar antes de integrar:

```bash
git status
git fetch origin
git log --oneline --decorate --graph HEAD..origin/main
git pull --ff-only
git push
```

`--ff-only` evita crear una integración implícita cuando las historias divergieron. Si falla, no fuerces: inspeccioná ambas historias y resolvé la estrategia con el equipo.

---

## 8. Recuperación no destructiva ante errores comunes

### `remote origin already exists`

No elimines el remoto sin mirar adónde apunta:

```bash
git remote get-url origin
git remote -v
```

Si la URL es incorrecta y confirmaste la nueva, actualizala explícitamente:

```bash
git remote set-url origin URL_CORRECTA
```

### `rejected (non-fast-forward)` al hacer push

El remoto contiene commits que tu rama no tiene. Conservá ambas historias mientras investigás:

```bash
git status
git fetch origin
git log --oneline --left-right HEAD...origin/main
```

Luego integrá con la política del equipo. **No respondas con force-push ni con `git push --force`**: podrías borrar trabajo remoto. La reescritura de historia se tratará en la siguiente lección y requiere coordinación.

### Archivo preparado por error

Usá `git restore --staged archivo`; el archivo permanece en tu directorio. Evitá `git reset --hard`, porque puede descartar cambios no confirmados.

### Rama o remoto equivocados

Detenete y validá antes de reintentar:

```bash
git branch --show-current
git remote get-url origin
git status --short
```

Repetir comandos sin comprender el diagnóstico suele empeorar el estado. Primero preservá los datos; después corregí configuración o integración.

---

## 9. Ejercicio guiado

1. Creá un directorio con un `README.md` y un archivo Java pequeño.
2. Inicializá Git en `main`, agregá un `.gitignore` y configurá identidad local si corresponde.
3. Prepará archivos específicos, inspeccioná `git diff --cached` y creá un commit.
4. Creá un repositorio vacío en GitHub y elegí conscientemente HTTPS o SSH.
5. Agregá `origin`, verificá URL y rama, y recién entonces ejecutá `git push -u origin main`.
6. En otro directorio, usá `git clone`, verificá el remoto y compará `fetch` con `pull`.

El ejercicio termina cuando podés explicar qué datos existen localmente, cuáles llegaron a GitHub y qué seguimiento conecta ambas ramas.
