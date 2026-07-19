---
title: 'Strings and Functions'
course: 'java'
slug: 'strings-y-funciones'
order: 7
lang: 'en'
published: true
---

# Strings and Functions

## The String type

Unlike primitive types, `String` is an object that represents a sequence of characters.

### Immutability
Strings in Java are immutable. If you change a String value, Java creates a new object in memory.

```java
String saludo = "Hola";
saludo = saludo + " mundo"; // A new object "Hola mundo" is created
```

### Useful String methods
- `length()`: Returns the text length.
- `toUpperCase()` / `toLowerCase()`: Converts to uppercase/lowercase.
- `contains("text")`: Checks if it contains a substring.
- `indexOf("a")`: Searches for the position of a character.
- `equals("other")`: Compares contents (don't use `==`!).

## Functions (Methods)

A function is a reusable block of code that performs a specific task.

```java
public static int suma(int a, int b) {
    return a + b;
}

// Call:
int resultado = suma(5, 3);
```

### Structure of a function:
1. **Return type:** The data it returns (`int`, `String`, `void` if it returns nothing).
2. **Name:** To identify it.
3. **Parameters:** Data it receives to work with.
4. **Body:** The code inside `{ }`.
