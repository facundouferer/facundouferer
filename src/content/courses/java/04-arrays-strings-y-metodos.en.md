---
course: 'java'
slug: '04-arrays-strings-y-metodos'
title: 'Arrays, Strings, and Method Creation'
description: 'Manipulate single and multi-dimensional arrays, handle the String class, and structure code into reusable methods.'
order: 4
lang: 'en'
published: true
---

# Arrays, Strings, and Method Creation

To build structured and complex programs, we need to work with fixed-size homogeneous data collections (arrays), efficiently manipulate text (`String` and `StringBuilder`), and modularize our code into methods.

## 1. Single-Dimensional Arrays

An array is a fixed-size data structure that stores elements of the same type in contiguous memory locations. Indexing starts at `0`.

```java
// Declaration and creation
int[] numbers = new int[5]; // Array of 5 integers initialized to 0
numbers[0] = 10;
numbers[1] = 20;

// Declaration with literal values
String[] fruits = {"Apple", "Banana", "Orange"};

// Iteration using enhanced for-each loop
for (String fruit : fruits) {
    System.out.println("Fruit: " + fruit);
}
```

## 2. Multi-Dimensional Arrays (Matrices)

A matrix is an array of arrays (rows and columns):

```java
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6}
};

// Access and nested iteration
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        System.out.print(matrix[i][j] + " ");
    }
    System.out.println();
}
```

## 3. Text Manipulation: `String` and `StringBuilder`

In Java, `String` objects are **immutable** (cannot be modified once created). If you perform frequent modifications or concatenations inside loops, use `StringBuilder` for memory efficiency.

```java
String greeting = "Hello, Java";
System.out.println("Length: " + greeting.length());
System.out.println("Uppercase: " + greeting.toUpperCase());
System.out.println("Contains Java: " + greeting.contains("Java"));

// Memory efficient StringBuilder
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
String result = sb.toString(); // "Hello World"
```

## 4. Creating Static Methods

A method is a reusable block of code that performs a specific task.

```java
public class Calculator {

    public static void main(String[] args) {
        int res = add(15, 25);
        printResult("Addition", res);
    }

    // Method with return value
    public static int add(int a, int b) {
        return a + b;
    }

    // Void method (no return value)
    public static void printResult(String operation, int value) {
        System.out.println("Result of " + operation + ": " + value);
    }
}
```

## 5. Hands-on Exercise
Write a program with a static method named `findMax` that receives an integer array `int[]` and returns the largest number inside the array.
