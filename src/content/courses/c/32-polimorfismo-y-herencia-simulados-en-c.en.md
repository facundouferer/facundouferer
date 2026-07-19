---
title: 'Polymorphism and Inheritance Simulated in C'
course: 'c'
slug: 'polimorfismo-y-herencia-simulados-en-c'
order: 32
lang: 'en'
published: true
---

Two of the most famous ideas in OOP are **inheritance** and **polymorphism**.

C does not offer them natively, but certain behaviors can be simulated with design and function pointers.

In this lesson you will learn:

- why inheritance and polymorphism are not native in C
- how they can be approximated conceptually
- what role function pointers play

## Simulated inheritance

A simple way to approximate inheritance in C is through composing related structures.

### Conceptual example

```c
struct Persona {
    char nombre[30];
};

struct Alumno {
    struct Persona persona;
    int legajo;
};
```

Here `Alumno` contains a `Persona` and adds more information.

It's not native inheritance, but it resembles an extension of behavior or structure.

## Simulated polymorphism with function pointers

Function pointers allow choosing which behavior to execute.

### Conceptual example

```c
typedef void (*AccionSaludo)();
```

And then different functions could fulfill different behaviors under the same general idea.

## Why does this matter?

Because it shows that design ideas can survive even when the language doesn't have the specific syntax.

But we also have to be honest:

- it's not the same as native OOP
- it requires more manual work
- it requires more design discipline

## Summary

- C has no native inheritance or polymorphism
- some ideas can be approximated with composition and function pointers
- this allows building more flexible designs within the real limits of the language

## Final thought

Learning OOP in C is learning to separate the concept from the syntax.

And that makes you a better programmer, because you stop relying on "magic keywords" of the language and start understanding the design behind them.
