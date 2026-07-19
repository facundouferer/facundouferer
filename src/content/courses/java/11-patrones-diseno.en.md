---
title: 'Design Patterns'
course: 'java'
slug: 'patrones-diseno'
order: 11
lang: 'en'
published: true
---

# Design Patterns

Design patterns are proven solutions to common problems in software development. They are not rigid rules, but guidelines.

## Classification

1. **Creational Patterns:** Focus on how objects are created (e.g., `Singleton`, `Factory`).
2. **Structural Patterns:** How objects are organized and composed (e.g., `Adapter`, `Composite`).
3. **Behavioral Patterns:** How objects interact and communicate with each other.

## State Pattern
Allows an object to change its behavior when its internal state changes. Ideal for avoiding many complex `if/else` statements.

**Example:** A music player with states `Playing`, `Paused`, `Stopped`.

## Template Method Pattern
Defines the skeleton of an algorithm in a superclass, but lets subclasses override specific steps without changing the overall structure.

**Example:** A board game where all games have the steps `start()`, `play()` and `end()`, but each game implements them differently.
