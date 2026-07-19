---
title: 'Sequential Data Structures'
course: 'c'
slug: 'manejo-de-estructuras-secuenciales-de-datos'
order: 14
lang: 'en'
published: true
---

So far you've worked with individual variables. But when a program needs to handle many related data, you need a better way to organize them.

That's where **sequential data structures** come in.

In this lesson you'll learn:

- what a sequential data structure is
- why individual variables aren't enough
- what it means for data to be ordered in a sequence
- what operations are typically done on a sequence

> Key idea: a sequential structure lets you think of several data as an ordered set rather than isolated variables.

## What is a sequential data structure?

A **sequential data structure** is an organization where elements are arranged one after another following an order.

For example, a sequence of grades could look like this:

```text
8, 6, 10, 7, 9
```

Here you don't think of five separate variables, but of an ordered collection of five values.

## Why aren't individual variables enough?

Look at this example:

```c
int nota1 = 8;
int nota2 = 6;
int nota3 = 10;
int nota4 = 7;
int nota5 = 9;
```

This can work for very few data, but it has problems:

- it's hard to traverse them in order
- it's hard to apply the same operation to all of them
- it doesn't scale well if the amount increases
- it makes the program rigid and messy

## Relationship between sequence and operations

When data is organized sequentially, very important operations emerge:

- **traversal**: visiting elements one by one
- **search**: finding a value within the sequence
- **insertion**: adding a new element
- **update**: changing an existing element

## Conceptual example

Suppose you have the ages of four people:

```text
20, 18, 25, 19
```

The program can ask questions like:

- what is the first age?
- what is the third one?
- is age 25 in the sequence?
- which one is the largest?

## What sequential structures will you study?

In this part of the course you'll mainly work with:

- arrays
- character strings
- linked lists
- stacks
- queues

Not all work the same way, but they all organize data sequentially.

## Summary

- a sequential structure organizes several data following an order
- it lets you treat a collection as a set
- it makes traversal, search, and insertion easier
- it's the foundation for understanding arrays, strings, and various dynamic structures

## Final thought

When you move from individual variables to sequential structures, your program starts handling real data instead of just isolated values.
