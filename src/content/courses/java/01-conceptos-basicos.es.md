---
course: 'java'
slug: '01-conceptos-basicos'
title: 'Conceptos Básicos y Tu Primer Programa en Java'
description: 'Comprendé la plataforma Java (JDK, JRE, JVM), la estructura de una clase y escribí tu primer programa Hola Mundo.'
order: 1
lang: 'es'
published: true
---

# Conceptos Básicos y Tu Primer Programa en Java

¡Bienvenido al curso de Java! Java es uno de los lenguajes de programación más populares, robustos y utilizados en el mundo laboral, desde desarrollo web backend empresarial hasta aplicaciones móviles y de alto rendimiento.

## 1. La Arquitectura de Java: Write Once, Run Anywhere

Java funciona bajo la filosofía de "Escribir una vez, ejecutar en cualquier lugar". Esto se logra a través de tres componentes clave:

- **JDK (Java Development Kit)**: El kit de herramientas de desarrollo. Contiene el compilador (`javac`), librerías y utilidades para programar en Java.
- **JRE (Java Runtime Environment)**: Entorno de ejecución necesario para correr programas Java (incluye la JVM y las librerías base).
- **JVM (Java Virtual Machine)**: La Máquina Virtual de Java. Interpreta y ejecuta el código en bytecode de Java en cualquier sistema operativo (Windows, Linux, macOS).

```
Código Fuente (.java) ──[javac]──> Bytecode (.class) ──[JVM]──> Ejecución en OS
```

## 2. Estructura de un Programa en Java

En Java, **todo el código vive dentro de una clase**. La estructura mínima de un programa ejecutable es la siguiente:

```java
public class HolaMundo {
    public static void main(String[] args) {
        System.out.println("¡Hola, Mundo desde Java!");
    }
}
```

### Desglose paso a paso:
- `public class HolaMundo`: Define una clase pública llamada `HolaMundo`. El nombre del archivo DEBE ser idéntico al nombre de la clase (`HolaMundo.java`).
- `public static void main(String[] args)`: Es el **punto de entrada** (entry point) de la aplicación.
  - `public`: Accesible desde cualquier lugar.
  - `static`: Se puede ejecutar sin necesidad de crear una instancia (objeto) de la clase.
  - `void`: No retorna ningún valor.
  - `String[] args`: Parámetros o argumentos pasados desde la consola de comandos.
- `System.out.println(...)`: Imprime un texto en la consola y agrega un salto de línea.

## 3. Compilación y Ejecución desde la Consola

1. Guardá el código en un archivo llamado `HolaMundo.java`.
2. Abrí la terminal y compilá el archivo:
   ```bash
   javac HolaMundo.java
   ```
   Esto generará un archivo `HolaMundo.class` con el bytecode.
3. Ejecutá el programa compilado:
   ```bash
   java HolaMundo
   ```

## 4. Ejercicio Práctico
Creá un programa en Java que imprima en la consola tu nombre, tu lenguaje de programación favorito y tu meta principal con este curso.