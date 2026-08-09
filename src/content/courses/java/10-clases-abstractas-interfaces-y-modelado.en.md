---
course: 'java'
slug: '09-clases-abstractas-interfaces-y-modelado'
title: 'Abstract Classes, Interfaces, and Code Organization'
description: 'Understand differences between abstract classes and interfaces, organize packages, and model domain relationships.'
order: 10
lang: 'en'
published: true
---

# Abstract Classes, Interfaces, and Code Organization

## 1. Abstract Classes vs. Interfaces
```java
public abstract class Shape {
    public abstract double calculateArea();
}

public interface Drawable {
    void draw();
}
```

## 2. Packages and Object Relationships
- Packages: `package com.company.project;`
- Relationships: Association, Aggregation, Composition.

## 3. Hands-on Exercise
Design a `Payable` interface and implement it in `CreditCard` and `PayPal` classes.
