# Spec: Presentación Interactiva — Archivos, Persistencia y Empaquetado JAR en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/17-archivos-persistencia-y-empaquetado-jar`
  - Archivo de lección: `src/content/courses/java/19-archivos-persistencia-y-empaquetado-jar.es.md`
  - Slug de la lección: `17-archivos-persistencia-y-empaquetado-jar`
- **Slug de la presentación**: `archivos-persistencia-jar-java`
- **Archivo de componente**: `src/components/presentaciones/archivos-persistencia-jar-java.astro`
- **Asset de tarjeta**: `/img/presentations/archivos-persistencia-jar-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Archivos, Serialización y Empaquetado JAR en Java', en: 'Files, Serialization, and JAR Packaging in Java' }`
  - `description`: `{ es: 'Patrón Decorador en I/O, NIO.2, serialVersionUID y empaquetado nativo con jpackage.', en: 'I/O Decorator Pattern, NIO.2, serialVersionUID, and native packaging with jpackage.' }`
  - `lesson`: `{ course: 'java', slug: '17-archivos-persistencia-y-empaquetado-jar' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

La entrada/salida y el empaquetado suelen generar confusión por la abundancia de clases en `java.io` y el paso de código fuente a software ejecutable:
- Visualizar la división fundamental entre **Streams de Bytes** (imágenes, audio, binarios) y **Streams de Caracteres** (texto con encoding).
- Comprender el **Patrón Decorador** en `java.io` mediante una metáfora gráfica de capas ("la cebolla de streams").
- Demostrar el flujo de **Serialización de Objetos**: cómo un grafo de objetos en el Heap se aplana a una secuencia de bytes (`0xAC ED`) y los peligros de omitir `serialVersionUID`.
- Desarmar la anatomía de un archivo **JAR** (su naturaleza ZIP y el rol del archivo `MANIFEST.MF`).
- Ilustrar el pipeline de distribución moderno desde el `.java` hasta el binario nativo (.exe / .dmg / .deb) vía **`jpackage`**.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: El Universo de I/O — Bytes vs Caracteres
- **Aspecto conceptual**: Todo en disco son bytes. La diferencia radica en si la JVM los lee crudos o los decodifica a caracteres usando un charset (UTF-8).
- **Gráfica requerida (SVG)**:
  - Dos tuberías paralelas con flujo de datos hacia el disco:
    - Tubería 1 (Bytes): `InputStream` / `OutputStream` transportando ceros y unos en bloques de 8 bits (`byte`).
    - Tubería 2 (Caracteres): `Reader` / `Writer` transportando caracteres Unicode de 16 bits (`char`), con un filtro de conversión intermedia (Charset UTF-8).
- **Interacción**: Demostración de la "trampa de la codificación": un archivo de texto con la palabra `"Canción"` leído como bytes en ISO-8859-1 vs UTF-8 mostrando el típico error de caracteres rotos (`CanciÃ³n`).

### Slide 2: El Patrón Decorador — La cebolla de Streams
- **Aspecto conceptual**: En lugar de crear una clase para cada combinación de características, `java.io` utiliza decoradores que envuelven otros streams agregando funcionalidad (buffering, parseo tipado).
- **Gráfica requerida (SVG interactivo)**:
  - Capas concéntricas (estilo muñeca rusa o cebolla):
    - Núcleo: `FileInputStream("datos.bin")` (conexión física directa con el archivo en disco).
    - Capa intermedia: `BufferedInputStream` (agrega una memoria intermedia de 8 KB en RAM para evitar cientos de accesos lentos al disco).
    - Capa externa: `DataInputStream` (agrega métodos convenientes como `readDouble()`, `readUTF()`).
- **Interacción**: El usuario agrega o quita la capa de `BufferedInputStream` y observa una gráfica de velocidad simulada: 10.000 lecturas directas (lento, muchas I/O calls al SO) vs lecturas con buffer (rápido, bloques consolidados).

### Slide 3: Java NIO.2 Moderno (`java.nio.file`)
- **Aspecto conceptual**: Las APIs modernas introducidas en Java 7 que reemplazan a la anticuada clase `java.io.File`. Inmutabilidad de `Path` y métodos atómicos de `Files`.
- **Gráfica requerida (SVG)**:
  - Comparativa visual:
    - Antiguo `File`: Código imperativo de 15 líneas para leer un archivo de texto.
    - Moderno `Files`: `List<String> lineas = Files.readAllLines(path, StandardCharsets.UTF_8);` en 1 línea limpia.
  - Diagrama de árbol de directorios con `Files.walk()` explorando recursivamente carpetas de manera perezosa (Lazy Streams).

### Slide 4: Serialización — Aplanar Objetos del Heap a Disco
- **Aspecto conceptual**: La interfaz `Serializable` permite volcar el estado completo de un objeto a un stream. Uso de `transient` para campos sensibles que no deben persistirse.
- **Gráfica requerida (SVG animado)**:
  - Objeto en el Heap: `Usuario(id=1, nombre="Facundo", passwordHash="xyz123", tokenSesion="abc")`.
  - El campo `tokenSesion` tiene la palabra reservada `transient`.
  - Animación de serialización: El objeto pasa por un túnel (`ObjectOutputStream`) y se aplana en un flujo binario comenzando con el número mágico de Java `0xAC ED 00 05`.
  - En el archivo resultante en disco, el campo `transient` aparece vacío o con valor por defecto (`null`).

### Slide 5: El rol crítico de `serialVersionUID`
- **Aspecto conceptual**: Si la clase cambia (se añade un atributo) y no se especificó un `serialVersionUID` fijo, la JVM genera uno dinámico y la deserialización arroja `InvalidClassException`.
- **Gráfica requerida (SVG)**:
  - Paso 1: Clase `Factura` versión 1 (hash autogenerado `0x84A1`). Guardamos la factura en disco.
  - Paso 2: Agregamos un campo `emailCliente` al código Java. La JVM recalcula el hash a `0x32B9`.
  - Paso 3: Intentamos leer la factura vieja del disco: los hashes no coinciden y la JVM arroja un error en rojo: `InvalidClassException: local class incompatible`.
  - Solución visual: Fijar `private static final long serialVersionUID = 1L;` para habilitar compatibilidad hacia atrás.

### Slide 6: Anatomía de un Archivo JAR (Java Archive)
- **Aspecto conceptual**: Un archivo `.jar` no es magia: es un archivo comprimido en formato ZIP con una estructura estricta y un manifiesto.
- **Gráfica requerida (SVG)**:
  - Caja del archivo `mi-aplicacion.jar` abierta revelando su contenido:
    - Carpeta `com/empresa/app/` con los archivos binarios compilados `.class`.
    - Carpeta `META-INF/` con el archivo `MANIFEST.MF`.
  - Zoom en `MANIFEST.MF`:
    ```manifest
    Manifest-Version: 1.0
    Main-Class: com.empresa.app.Main
    ```
  - Explicación visual de cómo el comando `java -jar mi-aplicacion.jar` lee `Main-Class` para saber qué método `main()` ejecutar.

### Slide 7: Distribución Nativa con `jpackage`
- **Aspecto conceptual**: Cómo generar instaladores independientes que incluyen una JVM mínima a medida mediante `jlink`, sin exigir que el cliente final tenga Java instalado.
- **Gráfica requerida (Pipeline de distribución)**:
  - Pipeline de 4 estaciones:
    1. Código fuente `.java` -> `javac` -> Archivos `.class`.
    2. Archivos `.class` + `MANIFEST.MF` -> `jar -cfe` -> Archivo `.jar`.
    3. `.jar` + JDK -> `jlink` -> JRE mínima recortada (solo módulos necesarios).
    4. JRE mínima + lanzador nativo -> `jpackage` -> Instalador nativo (`.exe` para Windows, `.dmg` para macOS, `.deb` para Linux).

---

## 4. Estilo y Tokens de Diseño Organic
- Gráficos claros, tubos de datos con estética cálida, sin esquinas agresivas, acordes a `DESIGN.md`.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/17-archivos-persistencia-y-empaquetado-jar`
- **WHEN** un alumno recorre la presentación
- **THEN** comprende visualmente el patrón decorador de streams, el funcionamiento de la serialización con `serialVersionUID` y la anatomía interna de un JAR.
