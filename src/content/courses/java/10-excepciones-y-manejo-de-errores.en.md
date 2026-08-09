---
course: 'java'
slug: '10-excepciones-y-manejo-de-errores'
title: 'Exception Handling and Robustness'
description: 'Learn to capture and handle runtime errors with try-catch blocks and create custom exceptions.'
order: 10
lang: 'en'
published: true
---

# Exception Handling and Robustness

## 1. `try-catch-finally` Block
```java
try {
    int res = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Error: Division by zero.");
} finally {
    System.out.println("Always executes.");
}
```

## 2. Custom Exceptions
```java
public class InsufficientBalanceException extends Exception {
    public InsufficientBalanceException(String msg) { super(msg); }
}
```

## 3. Hands-on Exercise
Create an `InvalidAgeException` custom exception class and handle it inside `main`.
