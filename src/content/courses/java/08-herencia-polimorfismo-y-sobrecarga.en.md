---
course: 'java'
slug: '08-herencia-polimorfismo-y-sobrecarga'
title: 'Inheritance, Polymorphism, and Method Overloading'
description: 'Master single inheritance with extends, method overriding (@Override), method overloading, and polymorphism.'
order: 8
lang: 'en'
published: true
---

# Inheritance, Polymorphism, and Method Overloading

## 1. Single Inheritance (`extends`)
```java
public class Vehicle {
    protected String brand;
    public Vehicle(String brand) { this.brand = brand; }
    public void start() { System.out.println("Starting..."); }
}

public class Car extends Vehicle {
    public Car(String brand) { super(brand); }
    @Override
    public void start() { System.out.println("Car " + brand + " starting with push-button."); }
}
```

## 2. Overloading vs. Polymorphism
- **Overloading**: Same method name, different parameters.
- **Polymorphism**: Superclass reference invoking subclass-specific implementation.

## 3. Hands-on Exercise
Create an `Employee` superclass and a `Manager` subclass overriding `calculateSalary()`.
