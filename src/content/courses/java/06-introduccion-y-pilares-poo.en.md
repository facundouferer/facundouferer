---
course: 'java'
slug: '06-introduccion-y-pilares-poo'
title: 'Object-Oriented Programming and its Four Pillars'
description: 'Understand OOP paradigm, its advantages over procedural programming, and its 4 core pillars explained in Java with clear diagrams.'
order: 6
lang: 'en'
published: true
---

# Object-Oriented Programming and its Four Pillars

**Object-Oriented Programming (OOP)** is the dominant design paradigm in modern software engineering. Rather than structuring an application around loose functions or procedural scripts operating on global state, OOP models a system as an ecosystem of self-contained entities called **Objects**, combining data (state) and behavior (methods).

In this lesson, you will understand the transition from procedural programming to OOP and break down its **4 core pillars** using detailed diagrams and Java code.

---

## 1. What is the OOP Paradigm?

In procedural programming, data structures and functions are treated as separate concerns. As software grows, functions end up directly accessing and mutating shared state without boundaries, leading to **high coupling** and fragile codebases.

In **OOP**, a program is designed as a **clean network of encapsulated objects** that shield their internal state and communicate via message passing (method calls).

![Comparison: Procedural Programming vs Object-Oriented Programming Diagram](/img/courses/java/procedural-vs-oop.jpg)

### Key Differences:

| Criterion | Procedural Programming | Object-Oriented Programming (OOP) |
| :--- | :--- | :--- |
| **Primary Focus** | Sequential functions and algorithms | Objects with bounded responsibilities |
| **Data Management** | Globally shared data | Encapsulated state within objects |
| **Coupling** | High coupling (side effects) | Low coupling and high cohesion |
| **Maintainability** | Complex in medium/large systems | Scalable via modularity and reusability |

---

## 2. The 4 Pillars of Object-Oriented Programming

Every solid object-oriented architecture in Java rests on four fundamental pillars:

![The 4 Pillars of Object-Oriented Programming (OOP) in Java Diagram](/img/courses/java/java-oop-four-pillars.jpg)

---

### Pillar 1: Abstraction
**Abstraction** consists of modeling the essential characteristics of a real-world entity while omitting implementation details irrelevant to the application domain.

In Java, we model abstraction by identifying essential fields (attributes) and actions (methods) within a class:

```java
// Example of Abstraction in Java
public class Vehicle {
    // We only abstract features required for fleet management
    private String licensePlate;
    private String brand;
    private double currentSpeed;

    public void accelerate(double increment) {
        this.currentSpeed += increment;
    }
}
```

---

### Pillar 2: Encapsulation
**Encapsulation** protects and hides an object's internal state. External components cannot mutate an object's data arbitrarily; they must interact through a **controlled public interface** (`getters` and `setters` with validation logic).

```java
// Example of Encapsulation in Java
public class BankAccount {
    // Private field: No external class can alter balance directly
    private double balance;

    public BankAccount(double initialBalance) {
        if (initialBalance >= 0) {
            this.balance = initialBalance;
        }
    }

    // Balance is modified only via validated business logic
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
**Inheritance** allows a child class (**subclass**) to inherit state and behavior from a parent class (**superclass**), promoting code reuse and establishing an *"is-a"* relationship hierarchy.

In Java, inheritance is declared using the `extends` keyword:

```java
// Superclass (Base Class)
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void makeSound() {
        System.out.println("The animal makes a sound.");
    }
}

// Subclass (Inherits from Animal)
public class Dog extends Animal {
    public Dog(String name) {
        super(name); // Invokes Animal superclass constructor
    }

    @Override
    public void makeSound() {
        System.out.println(name + " says: Woof woof!");
    }
}
```

---

### Pillar 4: Polymorphism
**Polymorphism** (*"many forms"*) is the ability to treat objects of different subclasses as instances of a common superclass or interface. At runtime, the JVM dynamically dispatches method execution to the concrete object instance in memory (**dynamic method dispatch**).

```java
public class PolymorphismMain {
    public static void main(String[] args) {
        // Superclass array containing diverse subclass instances
        Animal[] animals = new Animal[2];
        animals[0] = new Dog("Buddy");
        animals[1] = new Cat("Whiskers");

        // Polymorphism: Each object responds with its concrete behavior
        for (Animal a : animals) {
            a.makeSound();
        }
    }
}
```

---

## 3. Guided Hands-on Exercise

### Challenge: Mobile Phone Modeling
Design a Java class named `Phone.java` applying **Abstraction** and **Encapsulation**:
1. Private fields: `brand`, `model`, `batteryPercentage` (integer 0 to 100).
2. Method `useApp(int minutes)` that consumes 1% battery for every 5 minutes of usage.
3. Method `chargeBattery(int amount)` that increases battery percentage up to 100%.

<details>
<summary>View Suggested Solution</summary>

```java
public class Phone {
    private String brand;
    private String model;
    private int batteryPercentage;

    public Phone(String brand, String model, int initialBattery) {
        this.brand = brand;
        this.model = model;
        this.batteryPercentage = Math.min(100, Math.max(0, initialBattery));
    }

    public void useApp(int minutes) {
        int consumption = minutes / 5;
        this.batteryPercentage = Math.max(0, this.batteryPercentage - consumption);
        System.out.println("Used app for " + minutes + " mins. Battery remaining: " + this.batteryPercentage + "%");
    }

    public void chargeBattery(int amount) {
        if (amount > 0) {
            this.batteryPercentage = Math.min(100, this.batteryPercentage + amount);
            System.out.println("Battery charged to: " + this.batteryPercentage + "%");
        }
    }

    public int getBatteryPercentage() {
        return batteryPercentage;
    }
}
```
</details>
