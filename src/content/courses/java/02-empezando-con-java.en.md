---
title: 'Getting Started with Java'
course: 'java'
slug: 'empezando-con-java'
order: 2
lang: 'en'
published: true
---

# Getting Started with Java

Java is a powerful, versatile general-purpose programming language. It is used in everything from mobile applications (Android) to large enterprise systems and servers.

## What is Java?

Unlike languages like JavaScript (which is interpreted), Java is a compiled language. This means the code you write is translated into an intermediate format called **Bytecode**, which is then executed by the Java Virtual Machine (JVM) on any platform.

## The advantages of learning Java

- **High job demand:** It is one of the most widely used languages in the industry.
- **Portability:** "Write once, run anywhere".
- **Flexibility:** It adapts to multiple types of projects.
- **Active community:** Thousands of libraries and available support.

## The first Java program

```java
public class MiPrograma {
    public static void main(String[] args) {
        System.out.println("¡Hola, mundo!");
    }
}
```

### What did we just do?

1. `public class MiPrograma`: Defines a public class called `MiPrograma`.
2. `public static void main(String[] args)`: The program's entry point. It is the first thing that runs.
3. `System.out.println("¡Hola, mundo!")`: Prints the text to the console and jumps to the next line.

## Standard output

In Java we use the `System.out` class to display information:

- `System.out.println()`: Prints and jumps to a new line.
- `System.out.print()`: Prints without jumping to a new line.
- `System.out.printf()`: Allows printing with formatting (like in C).
- `System.out.write()`: Writes a single character (less common).

### Example of `printf`:
```java
String nombre = "Juan";
int edad = 25;
System.out.printf("Nombre: %s, Edad: %d
", nombre, edad);
```
