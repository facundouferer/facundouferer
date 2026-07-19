---
title: 'Lambdas and Interfaces'
course: 'java'
slug: 'lambdas-interfaces'
order: 10
lang: 'en'
published: true
---

# Lambdas and Functional Interfaces

Java has supported the functional programming paradigm since version 8.

## Functional Interfaces

A functional interface is an interface that has exactly one abstract method. They are usually marked with `@FunctionalInterface`.

```java
@FunctionalInterface
public interface Operacion {
    int ejecutar(int a, int b);
}
```

## Lambda Expressions

Lambdas are a concise way to implement a functional interface without creating a full class.

**Syntax:** `(parameters) -> expression`

```java
// Example of a lambda for adding
Operacion suma = (a, b) -> a + b;
System.out.println(suma.ejecutar(5, 3)); // 8
```

## Stream API and Applications

Lambdas are very powerful when used with collections:

- `forEach`: Iterates over elements.
- `filter`: Filters elements based on a condition.
- `map`: Transforms elements.
- `anyMatch` / `allMatch`: Checks conditions.

### Example:
```java
List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5, 6);
List<Integer> pares = numeros.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
// Result: [2, 4, 6]
```
