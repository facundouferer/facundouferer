---
course: 'java'
slug: '01-conceptos-basicos'
title: 'Basic Concepts and Your First Java Program'
description: 'Understand the Java platform (JDK, JRE, JVM), WORA architecture, main method structure, and write your first interactive program.'
order: 1
lang: 'en'
published: true
---

# Basic Concepts and Your First Java Program

Welcome to the Java course! Java is one of the most popular, robust, and highly demanded programming languages in the software industry. From high-availability banking systems and massive enterprise backends to Android applications and modern microservices, Java is a cornerstone of modern software engineering.

In this introductory lesson, you will understand the core pillars that make Java so powerful, its internal compilation and execution architecture, the detailed anatomy of an executable class, and how to write your first program.

---

## 1. Java Architecture: Write Once, Run Anywhere (WORA)

Historically, programs written in languages like C or C++ had to be compiled specifically for each operating system and processor architecture (Windows x86, Linux ARM, macOS Apple Silicon). Java revolutionized the industry by introducing the **WORA** (*Write Once, Run Anywhere*) philosophy.

This is achieved by structuring the Java platform into three nested core components:

![Java Architecture Diagram: JDK, JRE, and JVM](/img/courses/java/java-architecture.jpg)

### Java Platform Components:

1. **JDK (Java Development Kit)**:
   - The complete bundle for **developers**.
   - Contains the compiler (`javac`), packaging utilities (`jar`), documentation generators (`javadoc`), debugger (`jdb`), and all tools required to write Java applications.

2. **JRE (Java Runtime Environment)**:
   - The environment needed to **run** Java applications.
   - Includes the JVM along with the core standard libraries (`java.lang`, `java.util`, `java.io`, `java.net`, etc.).

3. **JVM (Java Virtual Machine)**:
   - The operational core of Java—a software-emulated machine that interprets and executes **bytecode**.
   - Contains essential components such as:
     - **Class Loader**: Loads `.class` files into memory.
     - **Bytecode Verifier**: Checks code integrity and security before execution.
     - **JIT (Just-In-Time) Compiler**: Translates frequently executed bytecode fragments directly into native machine code for maximum performance.
     - **Garbage Collector**: Automatically manages memory, freeing objects that are no longer referenced.

---

## 2. Compilation and Execution Flow

Unlike purely interpreted languages (such as JavaScript or Python) or native compiled languages (such as C++), Java uses a **two-phase compilation process**:

![Java Compilation and Execution Pipeline Diagram](/img/courses/java/java-compilation-pipeline.jpg)

1. **Source Code (`.java`)**: Human-readable code written in your editor or IDE.
2. **Compiler `javac`**: Translates source code into a platform-independent intermediate format called **Bytecode**.
3. **Bytecode (`.class`)**: Compact instruction set designed for the JVM.
4. **Execution on JVM**: The JVM installed on the target OS (Windows, macOS, or Linux) reads the bytecode and executes it on the physical processor via interpretation and JIT compilation.

---

## 3. Detailed Anatomy of Your First Program

In Java, **all code must reside inside a class**. There are no standalone functions or global script code outside classes.

Let's create the classic `HolaMundo.java` program:

```java
public class HolaMundo {
    public static void main(String[] args) {
        System.out.println("Hello, World from Java!");
    }
}
```

### Word-by-Word Breakdown:

| Keyword / Identifier | Meaning in Java |
| :--- | :--- |
| `public` | Access modifier. Indicates that the class or method is accessible from anywhere in the project. |
| `class` | Declares a class—the fundamental building block of Object-Oriented Programming. |
| `HolaMundo` | Class name. **Golden rule**: The `.java` filename must match the public class name exactly (`HolaMundo.java`), including capitalization. |
| `static` | Indicates the method belongs to the class itself rather than a specific object instance. The JVM can invoke it without instantiating the class. |
| `void` | Specifies that the method performs an action but **returns no value**. |
| `main` | Reserved name for the application **entry point**. The JVM looks for a method named `main` to start execution. |
| `String[] args` | Array of text strings that receives command-line arguments passed to the program. |
| `System.out.println()` | Prints a string to the standard output console (`out`) followed by a new line. |

---

## 4. Compilation and Execution from Terminal

Follow the step-by-step workflow in your command prompt or terminal:

### Step 1: Create the File
Save the code above in a file named `HolaMundo.java`.

### Step 2: Compile
Run the `javac` compiler on your source file:
```bash
javac HolaMundo.java
```
If there are no syntax errors, a binary file named `HolaMundo.class` will be generated in the same folder.

### Step 3: Execute
Run the `java` virtual machine specifying only the class name (without the `.class` extension):
```bash
java HolaMundo
```

**Console Output:**
```text
Hello, World from Java!
```

---

## 5. Passing Command-Line Arguments

The `String[] args` parameter in the `main` signature allows us to receive input arguments when launching the program from the terminal:

```java
public class SaludoPersonalizado {
    public static void main(String[] args) {
        if (args.length > 0) {
            System.out.println("Hello, " + args[0] + "! Welcome to Java engineering.");
        } else {
            System.out.println("Hello, Anonymous Developer! Pass your name as an argument.");
        }
    }
}
```

### Compilation and Testing:
```bash
javac SaludoPersonalizado.java

# Running without arguments:
java SaludoPersonalizado
# Output: Hello, Anonymous Developer! Pass your name as an argument.

# Running with an argument:
java SaludoPersonalizado Facundo
# Output: Hello, Facundo! Welcome to Java engineering.
```

---

## 6. Style Conventions and Quality Guidelines

To write professional and readable Java code, follow standard naming conventions:

- **Classes and Interfaces**: Use `PascalCase` (e.g. `HolaMundo`, `CuentaBancaria`, `UsuarioService`).
- **Methods and Variables**: Use `camelCase` (e.g. `calculateTotal()`, `userName`, `initialBalance`).
- **Constants**: Use `UPPER_SNAKE_CASE` (e.g. `MAX_RETRY_COUNT`, `PI`).
- **Semicolon `;`**: Every statement in Java must terminate with `;`.
- **Comments**:
  ```java
  // Single-line comment

  /* 
     Multi-line comment
     for longer explanations.
  */

  /**
   * Javadoc comment for API documentation generation.
   */
  ```

---

## 7. Common Beginner Pitfalls

1. **`error: class HolaMundo is public, should be declared in a file named HolaMundo.java`**:
   - **Cause**: The filename does not match the `public` class name exactly (Java is case-sensitive).
2. **`Error: Could not find or load main class HolaMundo`**:
   - **Cause**: You ran `java HolaMundo.class` instead of `java HolaMundo`, or you are not in the correct directory.
3. **`java.lang.ArrayIndexOutOfBoundsException`**:
   - **Cause**: You tried accessing `args[0]` without checking `args.length > 0` when no arguments were supplied.

---

## 8. Hands-on Exercise

### Challenge:
Write a Java program named `PerfilDesarrollador.java` that:
1. Checks whether 2 arguments were passed from the console (Name and Favorite Language).
2. If arguments are present, prints a formatted message:
   `Developer: [Name] | Specialty: [Language]`
3. If arguments are missing, prints an explanatory usage message.

<details>
<summary>View Suggested Solution</summary>

```java
public class PerfilDesarrollador {
    public static void main(String[] args) {
        if (args.length >= 2) {
            String name = args[0];
            String language = args[1];
            System.out.println("==========================================");
            System.out.println(" Developer: " + name);
            System.out.println(" Specialty: " + language);
            System.out.println("==========================================");
        } else {
            System.out.println("Usage: java PerfilDesarrollador <YourName> <YourLanguage>");
        }
    }
}
```
</details>
