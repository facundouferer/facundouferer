---
course: 'java'
slug: '04-arrays-y-strings'
title: 'Arrays and String Handling in Java'
description: 'Master single-dimensional arrays, multidimensional matrices, java.util.Arrays utility class, String immutability, and StringBuilder.'
order: 4
lang: 'en'
published: true
---

# Arrays and String Handling in Java

To build robust applications in Java, efficiently handling static collections of data and text is a fundamental requirement. In this lesson, you will learn to manipulate single-dimensional and multidimensional arrays, understand Java's memory model for `String` objects across Stack and Heap (String Constant Pool), and discover when to use `StringBuilder` to optimize performance.

---

## 1. Single-Dimensional Arrays (1D Arrays)

An **array** is a fixed-size data structure storing elements of the same type in contiguous memory locations. Its initial index is always `0`, and the last index is `length - 1`.

![Java Array and String Memory Model Diagram](/img/courses/java/java-arrays-and-strings-memory.jpg)

### Declaration and Instantiation:
```java
// Option 1: Declaration and empty instantiation (default values)
int[] ages = new int[5]; // Initialized to 0

// Option 2: Declaration with initialization literals
String[] languages = {"Java", "Python", "TypeScript", "Go"};
```

### Default Values upon `new` Instantiation:
- `int`, `byte`, `short`, `long` $\rightarrow$ `0`
- `float`, `double` $\rightarrow$ `0.0`
- `boolean` $\rightarrow$ `false`
- Objects / References (`String`, etc.) $\rightarrow$ `null`

### Iterating Arrays:
```java
String[] fruits = {"Apple", "Banana", "Orange", "Strawberry"};

// Traditional loop (useful when index is needed):
for (int i = 0; i < fruits.length; i++) {
    System.out.println("Index " + i + ": " + fruits[i]);
}

// Enhanced for-each loop (cleaner when index is not required):
for (String fruit : fruits) {
    System.out.println("Fruit: " + fruit);
}
```

---

## 2. Multidimensional Arrays (Matrices)

In Java, a matrix is conceptually an **array of arrays**.

```java
// 3 rows x 3 columns matrix
int[][] grid = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Iteration using nested loops:
for (int row = 0; row < grid.length; row++) {
    for (int col = 0; col < grid[row].length; col++) {
        System.out.print(grid[row][col] + "\t");
    }
    System.out.println(); // Line break per row
}
```

---

## 3. The `java.util.Arrays` Utility Class

Java provides the `java.util.Arrays` class featuring static methods for common operations:

```java
import java.util.Arrays;

public class ArraysExample {
    public static void main(String[] args) {
        int[] numbers = {42, 12, 89, 7, 23};

        // 1. Print array legibly
        System.out.println("Original: " + Arrays.toString(numbers));

        // 2. Sort in ascending order (In-place quicksort/timsort)
        Arrays.sort(numbers);
        System.out.println("Sorted: " + Arrays.toString(numbers));

        // 3. Binary search (requires array to be sorted first)
        int index = Arrays.binarySearch(numbers, 23);
        System.out.println("Index of value 23: " + index);

        // 4. Partial array copy
        int[] copy = Arrays.copyOf(numbers, 3); // Copies first 3 elements
        System.out.println("Copy: " + Arrays.toString(copy));
    }
}
```

---

## 4. Text Manipulation: The `String` Class

In Java, the `String` class represents sequence of characters. Unlike primitive types, `String` instances are **immutable objects**: once created, their memory value cannot be changed.

### String Constant Pool:
To optimize memory, the JVM maintains a special area within Heap memory named the **String Constant Pool**. When creating a string literal (`"Hello"`), the JVM checks if it already exists in the pool and reuses the reference instead of instantiating duplicate objects.

```java
String s1 = "Java";
String s2 = "Java";
String s3 = new String("Java");

System.out.println(s1 == s2);      // true  (point to same reference in Constant Pool)
System.out.println(s1 == s3);      // false (new creates a distinct object outside the Pool)
System.out.println(s1.equals(s3)); // true  (compares textual content)
```

> **Golden Rule**: Always use `.equals()` or `.equalsIgnoreCase()` to compare textual content in Java. NEVER use `==`, as `==` compares memory references.

### Essential `String` Methods:
```java
String text = "  Learning Java in 2026  ";

System.out.println(text.length());             // 25
System.out.println(text.trim());               // Trims leading/trailing whitespace
System.out.println(text.toUpperCase());        // Converts to uppercase
System.out.println(text.contains("Java"));     // true
System.out.println(text.indexOf("Java"));      // 12
System.out.println(text.substring(12, 16));    // "Java"
System.out.println(text.replace("2026", "2027"));// Replaces substring
```

---

## 5. Efficient Concatenation with `StringBuilder`

Because `String` is immutable, performing multiple string concatenations inside a loop creates hundreds of temporary objects in Heap memory that the Garbage Collector must collect later.

For heavy string construction tasks, use **`StringBuilder`**:

```java
// INEFFICIENT (Generates 1000 temporary objects in Heap):
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i + ", ";
}

// EFFICIENT (Modifies a single mutable memory buffer):
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(", ");
}
String efficientResult = sb.toString();
```

---

## 6. Guided Hands-on Exercise

### Challenge: Palindrome Verifier
Write a Java program that accepts a string, removes whitespace, ignores case, and determines whether it is a **Palindrome** (reads the same backward as forward).

<details>
<summary>View Suggested Solution</summary>

```java
public class PalindromeChecker {
    public static void main(String[] args) {
        String text = "Racecar";
        
        // 1. Normalize: remove spaces and convert to lowercase
        String clean = text.replaceAll("\\s+", "").toLowerCase();
        
        // 2. Reverse using StringBuilder
        String reversed = new StringBuilder(clean).reverse().toString();
        
        // 3. Compare content
        boolean isPalindrome = clean.equals(reversed);
        
        System.out.println("Original text: " + text);
        System.out.println("Is palindrome?: " + isPalindrome);
    }
}
```
</details>
