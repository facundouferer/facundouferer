---
course: 'java'
slug: '05-introduccion-y-pilares-poo'
title: 'Object-Oriented Programming and its Pillars'
description: 'Understand the Object-Oriented Programming paradigm, its benefits over procedural programming, and its 4 core pillars in Java.'
order: 5
lang: 'en'
published: true
---

# Object-Oriented Programming and its Pillars

**Object-Oriented Programming (OOP)** is a software design paradigm that models real-world domain concepts by encapsulating data and behavior inside entities called **Objects**. Java is natively designed around OOP principles.

## 1. What is the OOP Paradigm?

In procedural programming, data and functions are treated separately. This causes coupling and maintenance issues as systems grow in complexity.

In **OOP**, an application is designed as a network of **independent objects** communicating with each other by sending messages (method invocations).

### Procedural vs. Object-Oriented Programming:
- **Procedural**: `functions(global_data)` ──> High risk of accidental state corruption.
- **OOP**: `object.executeBehavior()` ──> The object protects its own internal state.

```
       ┌──────────────────────────────────────────┐
       │                 OBJECT                   │
       │  ┌────────────────────────────────────┐  │
       │  │  State (Attributes / Data Fields)  │  │
       │  └────────────────────────────────────┘  │
       │  ┌────────────────────────────────────┐  │
       │  │ Behavior (Methods / Functions)     │  │
       │  └────────────────────────────────────┘  │
       └──────────────────────────────────────────┘
```

## 2. The 4 Pillars of Object-Oriented Programming

Every robust OOP architecture rests on four essential pillars:

---

### Pillar 1: Abstraction
**Abstraction** involves identifying essential features of a real-world concept while removing non-essential implementation details.

In Java, we represent abstraction by defining relevant attributes and actions using classes and interfaces.

```java
// Abstraction Example in Java
public class Car {
    // Only abstract attributes relevant to a traffic system
    private String licensePlate;
    private String model;
    private double currentSpeed;

    public void accelerate(double increment) {
        this.currentSpeed += increment;
    }
}
```

---

### Pillar 2: Encapsulation
**Encapsulation** bundles internal state data and restricts direct access from external code, exposing only controlled methods for interaction.

In Java, encapsulation is implemented using access modifiers (`private`, `public`) alongside `getters` and `setters`.

```java
// Encapsulation Example in Java
public class BankAccount {
    // Private attribute: No outside class can alter balance directly
    private double balance;

    public BankAccount(double initialBalance) {
        if (initialBalance >= 0) {
            this.balance = initialBalance;
        }
    }

    // Balance is modified only through validated business rules
    public void deposit(double amount) {
        if (amount > 0) {
            this.balance += amount;
        }
    }

    public double getBalance() {
        return this.balance;
    }
}
```

---

### Pillar 3: Inheritance
**Inheritance** enables creating a new class (subclass) based on an existing class (superclass), inheriting state and behaviors while adding or overriding features.

In Java, inheritance uses the `extends` keyword.

```java
// Base Class (Superclass)
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void makeSound() {
        System.out.println("The animal makes a sound.");
    }
}

// Derived Class (Subclass inheriting from Animal)
public class Dog extends Animal {
    public Dog(String name) {
        super(name); // Calls Animal constructor
    }

    @Override
    public void makeSound() {
        System.out.println(name + " barks: Woof woof!");
    }
}
```

---

### Pillar 4: Polymorphism
**Polymorphism** ("many forms") is the ability to treat instances of different derived classes uniformly through a common parent reference, executing specific behavior dynamically at runtime.

```java
// Polymorphism Example in Java
public class Main {
    public static void main(String[] args) {
        // Array of superclass type holding different subclass instances
        Animal[] farm = new Animal[2];
        farm[0] = new Dog("Buddy");
        farm[1] = new Cat("Whiskers");

        // Polymorphism: Each object responds with its specific implementation
        for (Animal a : farm) {
            a.makeSound();
        }
    }
}
```

---

## 3. Hands-on Exercise
Identify a real-world entity (e.g., a `Smartphone`) and write a Java code snippet applying Abstraction (core fields) and Encapsulation (private `batteryLevel` field with charge and drain methods).
