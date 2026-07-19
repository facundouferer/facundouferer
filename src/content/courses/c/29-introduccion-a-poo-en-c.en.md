---
title: 'Introduction to OOP in C'
course: 'c'
slug: 'introduccion-a-poo-en-c'
order: 29
lang: 'en'
published: true
---

Here's the full technical truth: **C is not natively an object-oriented language**.

It doesn't have classes, inheritance, or methods as built-in language mechanisms like C++ or Java do.

So why talk about OOP in C?

Because many of the ideas of object-oriented programming can be **modeled** in C using:

- `struct`
- functions
- pointers
- modular organization

In this lesson you will learn:

- what OOP is at a conceptual level
- why C doesn't implement it natively
- how it can be simulated in C
- the difference between structured programming and object-oriented programming
- benefits of applying object-oriented programming
- which ideas actually make sense to study in this context

## What is object-oriented programming?

**Object-oriented programming** organizes software around objects that combine:

- **state**
- **behavior**

State is the data.
Behavior is the operations that can be performed on that data.

## Pillars of object-oriented programming

When talking about OOP, four classic pillars usually appear:

- encapsulation
- abstraction
- inheritance
- polymorphism

These pillars do NOT mean "four words to memorize." They mean four design ideas.

### 1. Encapsulation

**Encapsulation** consists of grouping related data and operations together.

The idea is that an entity keeps together:

- its state
- the operations that act on that state

In C, this can be approximated by combining `struct` with related functions.

### 2. Abstraction

**Abstraction** consists of showing what matters and hiding unnecessary details.

For example, when using a bank account you care about knowing it can deposit or withdraw money, not all the internal implementation details.

### 3. Inheritance

**Inheritance** allows building new types from existing ones, reusing and extending features.

In C it does not exist as a native language mechanism, but some similar ideas can be simulated through struct composition.

### 4. Polymorphism

**Polymorphism** allows the same general operation idea to take on different behaviors depending on the context.

In C it also doesn't exist as a native object-oriented mechanism, but certain approaches can be built using function pointers.

## Important note about the pillars in C

Here we need to be VERY precise:

- the pillars of OOP exist as design concepts
- C does not implement them natively the way pure or hybrid object-oriented languages do
- in C they are studied as ideas that can be partially modeled or simulated

That's why, when in this course we talk about OOP pillars in C, we talk about:

- **fundamental OOP concepts**
- and **how to approximate them with real C tools**

## Difference between structured programming and object-oriented programming

This part is EXTREMELY IMPORTANT, because many students hear "OOP" and think it's just another syntax. No. It's another way of organizing program thinking.

### Structured programming

Structured programming organizes the solution mainly around:

- sequence
- decision
- iteration
- functions or procedures

The focus is usually on **the actions** the program performs.

In other words: we think a lot about the algorithm flow.

For example:

- read data
- process data
- show results

### Object-oriented programming

Object-oriented programming organizes the solution around **entities** that have:

- their own data
- operations associated with that data

The focus is no longer just on "what steps to do," but also on **what objects exist in the problem and how they behave**.

### Short conceptual difference

- in structured programming, the center is usually the **algorithm**
- in object-oriented programming, the center is usually the **object model**

### Intuitive example

Suppose a bank account system.

#### Structured approach

You might think something like:

- read balance
- deposit amount
- withdraw amount
- show balance

The attention is on the process operations.

#### Object-oriented approach

You would think more like:

- there is an **Account**
- the account has a **balance**
- the account can **deposit**
- the account can **withdraw**

Now the attention is on the entity and its behavior.

## Does this mean one replaces the other?

No.

And this needs to be said clearly.

Object-oriented programming does NOT eliminate structured programming. In fact:

- there is still sequence
- there are still decisions
- there are still iterations
- there are still functions

The difference is in **how the overall program design is organized**.

## Benefits of applying object-oriented programming

OOP became important because it helps organize many complex systems better.

### 1. Better problem modeling

It allows representing real-world problem entities more naturally.

For example:

- Account
- Student
- Product
- Rectangle

This makes the program look more like what it's trying to model.

### 2. Better code organization

When related data and operations are grouped together, the code is usually clearer.

Instead of having scattered logic, each entity better concentrates its responsibility.

### 3. Better maintainability

A well-thought-out object-oriented design usually makes future changes easier.

Why? Because if a responsibility is well localized, it's easier to modify without breaking everything else.

### 4. Reusability

When a structure or design is well built, many ideas can be reused in different parts of the system or even in other projects.

### 5. Greater conceptual clarity

OOP helps think about software in terms of components with their own identity.

This doesn't always make code "shorter," but it often makes it **more understandable**.

## Caution: OOP does NOT magically solve everything

Here we also need to be honest.

Object-oriented programming is not a magic solution.

A bad object-oriented design can be worse than a simple, clear structured design.

The benefits appear when:

- the problem really justifies it
- the design is well thought out
- OOP is not forced where it's not needed

## What's missing in C?

In C there are no:

- classes
- native objects
- methods tied to the type as a language mechanism
- native inheritance
- native polymorphism

So if someone tells you "C is object-oriented just like Java," that's incorrect.

## What CAN be done in C?

A design with object-oriented inspiration can be built.

For example:

- represent an entity with `struct`
- define functions that work on that structure
- hide details through modules
- simulate polymorphism with function pointers

## First conceptual example

```c
struct Cuenta {
    float saldo;
};

void depositar(struct Cuenta* cuenta, float monto) {
    cuenta->saldo = cuenta->saldo + monto;
}
```

Here an object-like idea already appears:

- the `Cuenta` structure represents the state
- the `depositar` function represents behavior

## So, is it real OOP?

Not in the native language sense.

But it is a valid way to teach and apply object-oriented ideas within C.

## Summary

- structured programming puts a lot of focus on the algorithm and flow
- object-oriented programming puts a lot of focus on entities and their behavior
- OOP helps model certain problems better, organize code, and improve maintainability
- C is not a native object-oriented language
- still, it can model OOP concepts
- `struct` + functions + pointers allow building designs with an object-oriented style

## Final thought

In C, learning OOP does not mean learning "hidden magic classes."

It means learning to build abstractions with the real tools of the language.

And understanding the difference from structured programming helps you see that you're not just changing the syntax: you're changing the way you think about program design.
