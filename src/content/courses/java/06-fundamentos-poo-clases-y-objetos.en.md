---
course: 'java'
slug: '06-fundamentos-poo-clases-y-objetos'
title: 'OOP Fundamentals: Classes, Objects, and Attributes'
description: 'Understand class, object, state, behavior, and instantiation concepts in Java.'
order: 6
lang: 'en'
published: true
---

# OOP Fundamentals: Classes, Objects, and Attributes

Object-Oriented Programming centers on objects containing state (**attributes**) and behavior (**methods**).

## 1. Class vs. Object

- **Class**: The blueprint template defining fields and methods.
- **Object**: A physical instance allocated in heap memory.

```java
public class Person {
    String name;
    int age;

    public void greet() {
        System.out.println("Hello, I am " + name + " and I am " + age + " years old.");
    }
}
```

## 2. Instantiation and Usage

```java
public class Main {
    public static void main(String[] args) {
        Person p1 = new Person();
        p1.name = "Laura";
        p1.age = 28;
        p1.greet();
    }
}
```

## 3. Hands-on Exercise
Create a `BankAccount` class with `accountHolder` and `balance` attributes, instantiating two objects in `main`.
