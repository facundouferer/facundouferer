---
course: 'java'
slug: '01-conceptos-basicos'
title: 'Basic Concepts and Your First Java Program'
description: 'Understand the Java platform (JDK, JRE, JVM), class structure, and write your first Hello World program.'
order: 1
lang: 'en'
published: true
---

# Basic Concepts and Your First Java Program

Welcome to the Java course! Java is one of the most popular, robust, and widely used programming languages in the enterprise world, from backend web development to mobile apps and high-performance systems.

## 1. Java Architecture: Write Once, Run Anywhere

Java operates on the "Write Once, Run Anywhere" philosophy. This is achieved through three key components:

- **JDK (Java Development Kit)**: The development toolkit. Contains the compiler (`javac`), libraries, and tools for Java development.
- **JRE (Java Runtime Environment)**: The environment needed to run Java programs (includes JVM and base libraries).
- **JVM (Java Virtual Machine)**: Executes Java bytecode on any operating system (Windows, Linux, macOS).

```
Source Code (.java) ──[javac]──> Bytecode (.class) ──[JVM]──> OS Execution
```

## 2. Java Program Structure

In Java, **all code lives inside a class**. The minimum structure for an executable program is:

```java
public class HolaMundo {
    public static void main(String[] args) {
        System.out.println("Hello, World from Java!");
    }
}
```

### Step-by-step Breakdown:
- `public class HolaMundo`: Defines a public class named `HolaMundo`. The filename MUST match the class name (`HolaMundo.java`).
- `public static void main(String[] args)`: The **entry point** of the application.
  - `public`: Accessible from anywhere.
  - `static`: Can be executed without instantiating an object of the class.
  - `void`: Does not return any value.
  - `String[] args`: Arguments passed from the command line interface.
- `System.out.println(...)`: Prints text to the console with a new line.

## 3. Compilation and Execution from Terminal

1. Save code in a file named `HolaMundo.java`.
2. Open terminal and compile:
   ```bash
   javac HolaMundo.java
   ```
3. Run the compiled bytecode:
   ```bash
   java HolaMundo
   ```

## 4. Hands-on Exercise
Create a Java program that prints your name, favorite programming language, and primary goal for this course to the console.
