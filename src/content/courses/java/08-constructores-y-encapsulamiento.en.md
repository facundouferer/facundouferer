---
course: 'java'
slug: '07-constructores-y-encapsulamiento'
title: 'Constructors, Access Modifiers, and Getters/Setters'
description: 'Learn to initialize objects using constructors and protect internal state with encapsulation.'
order: 8
lang: 'en'
published: true
---

# Constructors, Access Modifiers, and Getters/Setters

Encapsulation protects object internal state from unauthorized external mutation.

## 1. Constructors and Getters/Setters

```java
public class Product {
    private String name;
    private double price;

    public Product(String name, double price) {
        this.name = name;
        setPrice(price);
    }

    public String getName() { return name; }
    public void setPrice(double price) {
        if (price >= 0) this.price = price;
    }
}
```

## 2. Access Modifiers
`public`, `protected`, package-private (default), `private`.

## 3. Hands-on Exercise
Create a `Student` class with private `name` and `gpa` attributes, ensuring `gpa` stays between 0.0 and 10.0.
