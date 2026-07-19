---
title: 'Manejo de Archivos'
course: 'java'
slug: 'archivos'
order: 12
lang: 'es'
published: true
---

# Manejo de Archivos en Java

Java proporciona clases en `java.io` y `java.nio.file` para leer y escribir datos en archivos de forma persistente.

## Escribir en un archivo

Usamos `FileWriter` y `BufferedWriter` para mayor eficiencia.

```java
try (BufferedWriter writer = new BufferedWriter(new FileWriter("archivo.txt"))) {
    writer.write("Hola, esto es una línea de texto.");
    writer.newLine();
    writer.write("¡Aprendiendo Java!");
} catch (IOException e) {
    e.printStackTrace();
}
```

## Leer de un archivo

Usamos `FileReader` y `BufferedReader`.

```java
try (BufferedReader reader = new BufferedReader(new FileReader("archivo.txt"))) {
    String linea;
    while ((linea = reader.readLine()) != null) {
        System.out.println(linea);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

## El bloque `try-with-resources`

Fíjate que en los ejemplos anteriores usamos `try (...)`. Esto es una excelente práctica en Java que asegura que el archivo se cierre automáticamente al terminar, incluso si ocurre un error, evitando fugas de memoria.