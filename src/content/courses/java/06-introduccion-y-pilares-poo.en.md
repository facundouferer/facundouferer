---
course: 'java'
slug: '06-introduccion-y-pilares-poo'
title: 'Object-Oriented Programming and its Four Pillars'
description: 'Understand OOP paradigm, its advantages over procedural programming, and its 4 core pillars explained in Java with clear diagrams.'
order: 7
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

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="comparison-title-en comparison-desc-en" xmlns="http://www.w3.org/2000/svg">
  <title id="comparison-title-en">Procedural programming / Object-oriented programming</title>
  <desc id="comparison-desc-en">From functions sharing data to objects that combine state and behavior under one responsibility.</desc>
  <rect x="8" y="8" width="344" height="324" rx="28" fill="var(--color-accent-100)" />
  <rect x="368" y="8" width="344" height="324" rx="28" fill="var(--color-accent-2-100)" />
  <text x="28" y="45" font-family="var(--font-heading)" font-size="19" fill="var(--color-accent-900)">Procedural programming</text>
  <text x="388" y="45" font-family="var(--font-heading)" font-size="17" fill="var(--color-accent-2-900)">Object-oriented programming</text>
  <rect x="95" y="136" width="170" height="72" rx="18" fill="var(--color-surface)" stroke="var(--color-accent-700)" stroke-width="2" />
  <text x="180" y="177" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-text)">Shared data</text>
  <rect x="40" y="71" width="120" height="46" rx="23" fill="var(--color-accent-300)" />
  <rect x="200" y="71" width="120" height="46" rx="23" fill="var(--color-accent-300)" />
  <text x="100" y="99" text-anchor="middle" font-size="15" fill="var(--color-accent-900)">Function A</text>
  <text x="260" y="99" text-anchor="middle" font-size="15" fill="var(--color-accent-900)">Function B</text>
  <path d="M100 117 L145 136 M260 117 L215 136" stroke="var(--color-accent-700)" stroke-width="3" stroke-linecap="round" />
  <text x="180" y="256" text-anchor="middle" font-size="13" fill="var(--color-accent-900)">Both functions change the same data</text>
  <rect x="423" y="80" width="234" height="177" rx="28" fill="var(--color-surface)" stroke="var(--color-accent-2-700)" stroke-width="3" />
  <text x="540" y="113" text-anchor="middle" font-family="var(--font-heading)" font-size="21" fill="var(--color-accent-2-900)">Object</text>
  <rect x="447" y="130" width="186" height="40" rx="20" fill="var(--color-accent-2-200)" />
  <rect x="447" y="180" width="186" height="40" rx="20" fill="var(--color-accent-2-200)" />
  <text x="540" y="156" text-anchor="middle" font-size="15" fill="var(--color-accent-2-900)">Protected state</text>
  <text x="540" y="206" text-anchor="middle" font-size="15" fill="var(--color-accent-2-900)">Behavior</text>
  <text x="540" y="290" text-anchor="middle" font-size="14" fill="var(--color-accent-2-900)">Public interface</text>
</svg>
<figcaption>From functions sharing data to objects that combine state and behavior under one responsibility.</figcaption>
</figure>

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

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="pillars-title-en pillars-desc-en" xmlns="http://www.w3.org/2000/svg">
  <title id="pillars-title-en">Four pillars, one idea: model responsibilities with clear boundaries.</title>
  <desc id="pillars-desc-en">The four pillars describe how to model, protect, specialize and vary behavior.</desc>
  <rect x="8" y="8" width="704" height="324" rx="28" fill="var(--color-neutral-100)" />
  <path d="M360 51 V75 M185 75 H535 M185 75 V94 M535 75 V94" fill="none" stroke="var(--color-accent-700)" stroke-width="3" stroke-linecap="round" />
  <circle cx="360" cy="41" r="21" fill="var(--color-accent-300)" />
  <text x="360" y="47" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-accent-900)">POO</text>
  <rect x="36" y="94" width="310" height="92" rx="24" fill="var(--color-accent-100)" />
  <rect x="374" y="94" width="310" height="92" rx="24" fill="var(--color-accent-2-100)" />
  <rect x="36" y="204" width="310" height="92" rx="24" fill="var(--color-accent-2-100)" />
  <rect x="374" y="204" width="310" height="92" rx="24" fill="var(--color-accent-100)" />
  <circle cx="76" cy="140" r="22" fill="var(--color-accent-300)" />
  <circle cx="414" cy="140" r="22" fill="var(--color-accent-2-300)" />
  <circle cx="76" cy="250" r="22" fill="var(--color-accent-2-300)" />
  <circle cx="414" cy="250" r="22" fill="var(--color-accent-300)" />
  <text x="76" y="146" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-text)">1</text>
  <text x="414" y="146" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-text)">2</text>
  <text x="76" y="256" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-text)">3</text>
  <text x="414" y="256" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-text)">4</text>
  <text x="111" y="134" font-family="var(--font-heading)" font-size="19" fill="var(--color-accent-900)">Abstraction</text>
  <text x="449" y="134" font-family="var(--font-heading)" font-size="19" fill="var(--color-accent-2-900)">Encapsulation</text>
  <text x="111" y="244" font-family="var(--font-heading)" font-size="19" fill="var(--color-accent-2-900)">Inheritance</text>
  <text x="449" y="244" font-family="var(--font-heading)" font-size="19" fill="var(--color-accent-900)">Polymorphism</text>
  <text x="111" y="162" font-size="14" fill="var(--color-text)">Select the essentials</text>
  <text x="449" y="162" font-size="14" fill="var(--color-text)">Protect the state</text>
  <text x="111" y="272" font-size="14" fill="var(--color-text)">Specialize a class</text>
  <text x="449" y="272" font-size="14" fill="var(--color-text)">One interface, varied responses</text>
</svg>
<figcaption>The four pillars describe how to model, protect, specialize and vary behavior.</figcaption>
</figure>

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
