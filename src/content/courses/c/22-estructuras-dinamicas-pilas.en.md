---
title: 'Dynamic Structures — Stacks'
course: 'c'
slug: 'estructuras-dinamicas-pilas'
order: 22
lang: 'en'
published: true
---

A **stack** is a structure where the last element that enters is the first one that leaves.

That's known as **LIFO**: Last In, First Out.

In this lesson you'll learn:

- what a stack is
- stack traversal
- search in stacks
- insertion in stacks
- basic extraction

## Insertion: push

Adding an element to the stack is called `push`.

## Extraction: pop

Removing the top element is called `pop`.

## Traversal

Traversal visits elements from the top down.

## Search

Search is done by traversing the stack element by element.

## Node example

```c
struct Nodo {
    int dato;
    struct Nodo* siguiente;
};
```

## Summary

- a stack follows the LIFO rule
- inserting is called `push`
- extracting is called `pop`
- it can also be traversed and searched

## Final thought

The stack is excellent for understanding that not all structures allow accessing data in any way. Each has its own usage logic.
