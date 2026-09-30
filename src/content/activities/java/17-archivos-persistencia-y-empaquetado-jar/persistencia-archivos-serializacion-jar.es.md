---
course: 'java'
lesson: '17-archivos-persistencia-y-empaquetado-jar'
slug: 'persistencia-archivos-serializacion-jar'
title: 'Persistencia en Disco con NIO.2, Serialización de Objetos y Empaquetado JAR'
description: 'Construí un sistema de persistencia dual (CSV y binario serializado) utilizando NIO.2 y try-with-resources, y generá un archivo JAR ejecutable con manifiesto.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 65
objectives:
  - 'Diferenciar el manejo de flujos de texto (Reader/Writer, NIO.2) frente a flujos de bytes y serialización binaria.'
  - 'Implementar persistencia robusta utilizando `Path`, `Files` y el patrón decorador de buffers con `try-with-resources`.'
  - 'Gestionar el ciclo de vida de objetos serializables controlando `serialVersionUID` y campos `transient`.'
  - 'Empaquetar y distribuir una aplicación Java en un archivo ejecutable `.jar` con manifiesto configurado.'
requirements:
  - 'Crear la clase Producto implements Serializable con campos: id (int), nombre (String), precio (double), stock (int), y un campo transient private String tokenSesion.'
  - 'Declarar explícitamente private static final long serialVersionUID = 1L en Producto.'
  - 'Implementar RepositorioProductos con métodos para guardar y cargar colecciones de productos en disco.'
  - 'Persistencia 1 (NIO.2 / Texto CSV): void exportarCSV(Path ruta, List<Producto> productos) y List<Producto> importarCSV(Path ruta) utilizando Files.newBufferedReader y Files.newBufferedWriter o Files.writeString.'
  - 'Persistencia 2 (Binario / Serialización): void guardarBinario(Path ruta, List<Producto> productos) y List<Producto> cargarBinario(Path ruta) usando ObjectOutputStream y ObjectInputStream envueltos en try-with-resources.'
  - 'Garantizar que tras la deserialización binaria, el campo transient tokenSesion se reinicialice o sea evaluado correctamente como null.'
  - 'En MainInventario.java, crear productos, guardarlos en CSV, modificar la lista, guardar en binario, recargarlos y verificar la integridad de los datos.'
  - 'Incluir en el README o documentación los comandos exactos de terminal para compilar el proyecto y empaquetarlo en app-inventario.jar con su clase principal.'
exampleOutput: |
  === Sistema de Persistencia de Inventario ===
  1. Creando catálogo en memoria con 3 productos...
  2. Exportando catálogo a formato CSV en 'datos/inventario.csv' (NIO.2)...
  [OK] Archivo CSV generado correctamente (4 líneas escritas con cabecera).

  3. Guardando copia de respaldo binaria en 'datos/backup.dat' (Serialización)...
  [OK] 3 objetos serializados en disco.

  4. Simulando reinicio de la aplicación (limpieza de memoria)...
  5. Cargando datos desde respaldo binario 'datos/backup.dat'...
  Productos recuperados:
    - [ID: 1] Teclado Mecánico | Precio: $85.50 | Stock: 14 | Token: null (transient verificado)
    - [ID: 2] Monitor 27 IPS   | Precio: $240.00 | Stock: 8  | Token: null (transient verificado)
    - [ID: 3] Mouse Ergonómico | Precio: $45.00  | Stock: 22 | Token: null (transient verificado)
  [OK] Integridad de datos preservada exitosamente.
deliveryTips:
  - 'Asegurate de que el directorio padre exista antes de escribir con `Files.createDirectories(ruta.getParent())`.'
  - 'El bloque try-with-resources garantiza el cierre de streams y flush de buffers incluso si ocurre una IOException imprevista.'
  - 'Para compilar y empaquetar ejecutá: javac -d bin src/*.java && jar cvfe app-inventario.jar MainInventario -C bin .'
---

## Contexto

El Heap de la JVM es volátil: cuando el proceso de la aplicación finaliza, todos los objetos creados se pierden irreversiblemente. La **persistencia en almacenamiento secundario (disco)** es el puente necesario para mantener el estado entre ejecuciones.

En Java coexisten dos vías fundamentales de persistencia de archivos:
1. **Archivos de Texto Plano estructurado (CSV, JSON)**: legibles por humanos e interoperables entre distintos lenguajes. Desde Java 7, la API **NIO.2 (`java.nio.file.Files` y `Path`)** provee métodos de alto nivel con soporte nativo de codificación UTF-8.
2. **Serialización de Objetos (`java.io.ObjectOutputStream`)**: convierte el grafo de objetos en una secuencia de bytes binarios nativa de Java, gobernada por la interfaz marcadora `Serializable`, el identificador de versión `serialVersionUID` y el modificador `transient` para excluir datos sensibles o efímeros.

Finalmente, una aplicación no se distribuye como código fuente disperso, sino empaquetada en un archivo comprimido **JAR (*Java ARchive*)** con su clase de entrada declarada en el encabezado `Main-Class` de su manifiesto.

## Consigna

Vas a implementar un gestor de catálogo con persistencia dual y preparar su empaquetado para distribución.

### 1. Modelo de Dominio y Serialización

```java
public class Producto implements Serializable {
    private static final long serialVersionUID = 1L;

    private final int id;
    private final String nombre;
    private final double precio;
    private final int stock;
    private transient String tokenSesion; // No debe persistirse a disco
    // constructor, getters, toString
}
```

### 2. Persistencia con NIO.2 y Serialización Binaria

- **`exportarCSV(Path ruta, List<Producto> productos)`**:
  - Escribir cabecera: `id,nombre,precio,stock`.
  - Iterar y formatear cada fila utilizando `BufferedWriter` obtenido mediante `Files.newBufferedWriter(ruta, StandardCharsets.UTF_8)`.
- **`guardarBinario(Path ruta, List<Producto> productos)`**:
  - Utilizar `new ObjectOutputStream(Files.newOutputStream(ruta))` dentro de un `try-with-resources`.
  - Serializar la lista completa en una única operación: `oos.writeObject(productos)`.
- **`cargarBinario(Path ruta)`**:
  - Leer mediante `ObjectInputStream` y realizar el casteo defensivo comprobando `instanceof List<?>`.

### 3. Empaquetado y Ejecución en Terminal

Documentá los comandos de construcción del artefacto ejecutable:
```bash
# 1. Compilar clases al directorio destino
javac -d out $(find . -name "*.java")

# 2. Empaquetar JAR especificando punto de entrada
jar cvfe inventario.jar MainInventario -C out .

# 3. Ejecutar el artefacto distribuible de forma autónoma
java -jar inventario.jar
```
