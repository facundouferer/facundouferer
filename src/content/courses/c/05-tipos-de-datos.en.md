---
title: 'Data Types'
course: 'c'
slug: 'tipos-de-datos'
order: 5
lang: 'en'
published: true
---

In previous lessons you saw that a C program needs a basic structure, can store information in variables, and can display or receive data.

Now a FUNDAMENTAL question appears:

> What kind of data am I really storing?

The answer to that question has to do with **data types**.

In C, it's not enough to say "I want to store a value." You also have to say **what type of value it is**.

In this lesson you'll learn:

- what a data type is
- what primitive data types are
- what the domain of each type is
- what operations are valid depending on the type
- how types relate to memory
- what compound data is
- what data structures are
- what the difference is between static and dynamic structures
- how constants and variables relate to data types

> Key idea: the data type defines what a variable can store, what operations make sense on that value, and how it's represented in memory.

## What is a data type?

A **data type** is a classification that tells the language:

- what kind of value will be stored
- what operations can be done with that value
- how much memory space it may need
- how that content should be interpreted

For example, it's not the same to store:

- an integer
- a decimal number
- a character

Even though they're all "data," they're not represented or handled the same way.

## Why does C need data types?

Because C is a language where data handling must be explicit.

If you want to store an age, you'll normally use an integer.
If you want to store a height, you'll probably use a decimal.
If you want to store an initial, you'll use a character.

That means the program needs to know in advance how to treat each value.

## Primitive data types

**Primitive types** are the basic types that the language offers to represent simple data.

In a first stage, the most important ones are these:

- `int`
- `float`
- `double`
- `char`

### `int`

Used to represent integers, that is, numbers without a decimal part.

```c
int edad = 18;
int cantidadAlumnos = 32;
int anio = 2026;
```

### `float`

Used to represent numbers with decimals.

```c
float altura = 1.75;
float precio = 1499.50;
float promedio = 8.4;
```

### `double`

Also represents numbers with decimals, but with greater precision than `float`.

```c
double distancia = 12345.6789;
double temperatura = 21.4567;
```

### `char`

Used to represent a single character.

```c
char inicial = 'F';
char letra = 'A';
char simbolo = '#';
```

Notice something important: a `char` represents **a single character**, not a full word.

## Domain of each type

The **domain** of a data type is the set of values that type can represent.

Put more simply: each type has a range or universe of possible values.

### Domain of `int`

`int` represents integers.

For example:

- positive values
- negative values
- zero

```c
int temperatura = -3;
int cantidad = 0;
int edad = 20;
```

### Domain of `float` and `double`

`float` and `double` represent approximate real numbers, that is, values with a decimal part.

```c
float altura = 1.72;
double distancia = 1500.3456;
```

### Domain of `char`

`char` represents a single character.

```c
char letra = 'Z';
char digito = '7';
char simbolo = '*';
```

Be careful with this: `'7'` is not the same as `7`.

- `'7'` is a character
- `7` is an integer

That completely changes the data type.

## Valid operations by type

Not all types support the same operations in the same way.

Here's one of the most important ideas of the lesson: **the data type determines which operations make sense**.

### Valid operations with `int`

With integers, it makes sense to do mathematical operations like:

- adding
- subtracting
- multiplying
- dividing

```c
int a = 10;
int b = 5;
int resultado = a + b;
```

### Valid operations with `float` and `double`

They also support mathematical operations.

```c
float precio1 = 10.5;
float precio2 = 2.5;
float total = precio1 + precio2;
```

### Operations with `char`

With `char`, the basic initial use isn't "doing math," but representing characters.

```c
char inicial = 'F';
```

Although internally a character has a numeric representation, when starting it's best to think of `char` as a type for storing **an individual symbol**.

## When an operation doesn't make pedagogical sense

Here's something important: not everything the language allows is suitable to teach from the start.

For example, at more advanced levels you'll discover that certain types can participate in automatic conversions or more complex behaviors.

But when starting, the correct thing is to understand this:

- `int`, `float`, and `double` are used to work with numeric values
- `char` is used to represent a character

First we build the correct idea. Later there will be time to refine it.

## Memory usage

Each data type occupies space in memory.

That means not all types store information the same way or with the same size.

### Important idea about size

The exact size of a type can depend on the implementation, the compiler, and the architecture where the program runs.

In other words: it's NOT serious to teach that all sizes are absolutely fixed on any machine.

However, to start, you can keep this idea:

- `char` usually occupies less memory than `int`
- `int` usually occupies less memory than `double`
- the more complex or precise the data, the more memory it may require

### Relationship between type and memory

Choosing a type isn't just choosing a "technical name." It's also deciding:

- what kind of value you want to represent
- how much precision you need
- how that value will be stored

Later that will matter a lot when you work with larger structures and collections of data.

## Conceptual memory example

Think about these declarations:

```c
char inicial = 'F';
int edad = 18;
double distancia = 1234.5678;
```

Although all three variables store data, they don't do it the same way.

- `inicial` stores a single character
- `edad` stores an integer
- `distancia` stores a decimal number with greater precision

That's why it wouldn't make sense to assume all three occupy the same memory.

## Data types: constants and variables

Data types relate to both **variables** and **constants**.

### Typed variable

```c
int edad = 18;
```

Here:

- `int` is the type
- `edad` is the variable
- `18` is the value

### Typed constant

```c
const int diasSemana = 7;
```

Here:

- `int` is still the data type
- `diasSemana` is a constant
- `7` is the fixed value

The difference between variable and constant does NOT change the concept of type. What changes is whether that value can be modified or not.

## What are compound data?

So far we've talked about simple or basic data.

But many times a single piece of data isn't enough.

For example, a person might need:

- name
- age
- height
- initial

That's no longer an isolated simple datum, but a set of related data.

We can connect that general idea with **compound data**.

A **compound datum** is data made up of several elements or a more complex organization than an individual primitive value.

## Conceptual examples of compound data

Without going into technical detail yet, some examples of compound data or structures that group data are:

- arrays
- character strings
- records or structs
- lists
- stacks
- queues
- trees

No need to master them now. The important thing is to understand that there are levels of organization more complex than a single `int` or a single `char`.

## What is a data structure?

A **data structure** is a way of organizing data to store, access, and work with it in an orderly fashion.

In other words: it's not just about "having data," but about **how we organize it**.

For example:

- sometimes you want to store several values of the same type
- other times you want to group different data that belongs to the same entity
- other times you need an organization that facilitates certain operations

That's precisely the territory of data structures.

## Static and dynamic structures

Data structures can be classified, in a general way, into **static** and **dynamic**.

### Static structures

Those whose size or capacity is fixed.

The main idea is that their size is planned in advance.

Later you'll see clear examples of this.

### Dynamic structures

Those whose organization can grow or change during program execution.

This allows more flexibility, but also requires more careful handling.

For now, no need to go deep. These two ideas are enough:

- static: more fixed or predefined size
- dynamic: more flexible size or organization during execution

## Why does this distinction matter?

Because it's not the same to store:

- a single number
- several numbers
- a collection of elements whose size you already know
- a collection whose size can change

Each need calls for a different organization.

And all of that starts, precisely, by first understanding what a simple data type is.

## Common mistakes when starting

### 1. Believing all data is the same

No.

It's not the same to store an integer, a decimal, or a character.

### 2. Choosing a type without thinking about what it represents

The type should be chosen based on the actual data you want to model.

### 3. Confusing a character with a number

```c
char digito = '7';
int numero = 7;
```

They don't represent the same thing.

### 4. Thinking each type's size is universal and fixed

In real programming, the exact size can depend on the environment.

### 5. Mixing up the concept of type with that of variable

The type describes the nature of the data.
The variable is the name of the space where you store it.

## Summary

- a **data type** defines what kind of value can be stored
- the most important primitive types when starting are `int`, `float`, `double`, and `char`
- each type has a **domain** of possible values
- not all types support the same operations with the same meaning
- types are also related to **memory usage**
- variables and constants always have a data type
- in addition to primitive data, there are **compound data** and **data structures**
- structures can be **static** or **dynamic**

## Final thought

When you choose a data type, you're not writing a technical word for no reason.

You're making a design decision about:

- what the data represents
- how it's stored
- what can be done with it
- how the program should interpret it

And that, friend, is one of the most important foundations of all programming.
