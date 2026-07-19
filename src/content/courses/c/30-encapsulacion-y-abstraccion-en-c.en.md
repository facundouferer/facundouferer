---
title: 'Encapsulation and Abstraction in C'
course: 'c'
slug: 'encapsulacion-y-abstraccion-en-c'
order: 30
lang: 'en'
published: true
---

Two central ideas of OOP are **encapsulation** and **abstraction**.

They don't appear as language keywords in C, but their ideas can still be applied.

In this lesson you will learn:

- what encapsulation is
- what abstraction is
- how to use `struct` and functions to approximate these ideas in C
- why modules help immensely

## Encapsulation

**Encapsulation** consists of grouping related data and operations together.

### Example

```c
struct Cuenta {
    float saldo;
};

void depositar(struct Cuenta* cuenta, float monto) {
    cuenta->saldo = cuenta->saldo + monto;
}
```

Here the account data and the operations that affect it are conceptually related.

## Abstraction

**Abstraction** consists of showing what matters and hiding unnecessary details.

For example, to use an account you might care about knowing you can deposit and withdraw money, not exactly how each piece of data is stored internally.

## Encapsulation and modules

In C, a very useful way to approximate encapsulation is to separate:

- the interface in `.h`
- the implementation in `.c`

That helps the module user think about "what it can do" rather than "how everything is implemented."

## Conceptual example

### In `cuenta.h`

```c
struct Cuenta;
void depositar(struct Cuenta* cuenta, float monto);
```

### In `cuenta.c`

```c
struct Cuenta {
    float saldo;
};
```

## Summary

- encapsulation groups related data and behavior together
- abstraction highlights what's important and hides unnecessary details
- in C they are approximated using `struct`, functions, and modules

## Final thought

Even though C doesn't have encapsulation as a native OOP mechanism, it does allow you to design programs where data and operations stay organized with great discipline.
