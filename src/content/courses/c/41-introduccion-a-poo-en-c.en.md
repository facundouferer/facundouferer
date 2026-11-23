---
title: 'Software Design in C: Ideas from OOP'
course: 'c'
slug: 'introduccion-a-poo-en-c'
order: 41
lang: 'en'
published: true
---

This lesson opens the complementary module **Software design in C**. It is optional: you do not need it to master the language, but it shows you how large programs written in C, such as libraries, operating systems or game engines, are organized.

Let's start with the full technical truth: **C is a procedural language**. It is not an object-oriented language, and it has no classes, inheritance or methods as language mechanisms. What you will study in this module are **design techniques** that borrow some ideas from object-oriented programming (OOP) and build them with tools you already know: `struct`, functions, pointers, function pointers and `.h`/`.c` modules. Every technique has a cost and a limit, and part of the job is knowing when not to use it.

## Objectives

- Explain why C is a procedural language and what "designing with ideas from OOP" means in C.
- Understand **abstraction** as designing a type around its operations.
- Tell apart the OOP ideas C can express (data + functions, interfaces) from the ones it does not have natively (classes, inheritance, virtual dispatch, access control).
- Compare the structured approach with the object-oriented approach on the same problem.
- Decide when this style is worth it and when a simpler design is better.

**Prerequisites:** `modularizacion-subprogramas-y-funciones` (`.h`/`.c`), `concepto-de-estructuras`, `punteros-arreglos-y-estructuras` (`->` and function pointers), `memoria-dinamica` and `propiedad-y-errores-de-memoria`.

## Structured programming and object-oriented programming

Many students hear "OOP" and think it is just another syntax. It is not: it is another way to organize the design of a program.

### Structured programming

Structured programming organizes the solution around sequence, selection, iteration and functions. The focus is on **actions**: read data, process it, show results. We think mostly about the flow of the algorithm. It is the style you have used throughout this course.

### Object-oriented programming

OOP organizes the solution around **entities** that have their own data (their **state**) and operations associated with that data (their **behavior**). The focus is no longer only on "which steps to take", but also on "which entities exist and how they behave".

### The same problem, two views

Suppose a bank account system.

- **Structured approach:** read the balance, deposit an amount, withdraw an amount, show the balance. The attention is on the steps of the process.
- **Object-oriented approach:** there is an **Account**; the account has a balance; the account can deposit and withdraw. The attention is on the entity and on what you can ask of it.

One does not replace the other. Inside every account operation there is still sequence, selection and loops. The difference is in **how the program is grouped**.

## Abstraction: designing around operations

The OOP idea that helps a C programmer the most is **abstraction**: show what matters and hide what does not. In practice it means designing a type **from the operations it offers**, not from its fields.

Before writing `struct Account { ... }`, you ask: what does someone using an account need to do?

- create an account with an initial balance;
- deposit;
- withdraw, without going negative;
- query the balance.

That list is the type's **interface**. The fields are an implementation detail that could change (for example, storing cents in a `long long` instead of units in a `double`) without changing the code that uses the account.

You have already applied this idea without naming it: when you use `FILE *` with `fopen`, `fprintf` and `fclose`, you never look at the fields of `FILE`. You only use its operations.

## The four pillars, seen from C

When people talk about OOP, four classic ideas come up. They are not words to memorize: they are design ideas. This is what C lets you do with each one:

| OOP idea | In an object-oriented language | In C |
| --- | --- | --- |
| Encapsulation | classes that group data and methods | `struct` + functions of the same module |
| Abstraction | public interfaces | `.h` file with the operations, opaque types |
| Inheritance | `extends`, derived classes | does not exist; simulated with `struct` composition |
| Polymorphism | virtual methods | does not exist; simulated with function pointers |

### What C can express

- **Data + functions:** a `struct` holds the state, and a group of functions with a common prefix (`account_deposit`, `account_withdraw`) forms its behavior.
- **Interfaces:** a `.h` declares what can be done and the `.c` decides how. With a function pointer you can also choose at run time which operation runs.

### What C does not have natively

- **Classes:** no language unit groups data and functions. The grouping is your convention.
- **Inheritance:** there are no derived types. You can put one `struct` inside another, but the compiler does not know that one "is" the other.
- **Virtual dispatch:** there are no methods chosen automatically by the object's real type. If you want it, you build a table of function pointers by hand.
- **Access control:** there is no `private` or `public`. The closest thing is hiding the `struct` definition in the `.c` (next lesson) and marking helper functions `static`.

So if someone says "C is object oriented just like Java", they are wrong. The correct statement is: "in C you can apply some ideas from OOP, with manual work and without help from the compiler".

## A first example: data + functions

This program models an account with a `struct` and functions that receive a pointer to it. The balance is stored in cents as an integer, because `float` and `double` cannot represent values such as 0.10 exactly.

```c
#include <stdbool.h>
#include <stdio.h>

struct Account {
    long long balance_cents;
};

void account_init(struct Account *account, long long initial_balance) {
    account->balance_cents = initial_balance;
}

bool account_deposit(struct Account *account, long long amount) {
    if (amount <= 0) {
        return false;
    }
    account->balance_cents += amount;
    return true;
}

bool account_withdraw(struct Account *account, long long amount) {
    if (amount <= 0 || amount > account->balance_cents) {
        return false;
    }
    account->balance_cents -= amount;
    return true;
}

long long account_balance(const struct Account *account) {
    return account->balance_cents;
}

int main(void) {
    struct Account account;
    account_init(&account, 10000);

    account_deposit(&account, 2550);
    if (!account_withdraw(&account, 50000)) {
        printf("Withdrawal rejected: insufficient funds\n");
    }
    printf("Balance: %lld cents\n", account_balance(&account));
    return 0;
}
```

Output:

```text
Withdrawal rejected: insufficient funds
Balance: 12550 cents
```

Notice three design decisions:

- Every function receives **a pointer to the account** as its first parameter. C passes that pointer by value, like any argument, but through the copy of the address the function modifies the original account.
- `account_balance` receives `const struct Account *`: it promises not to modify it.
- The rules ("no negative deposits", "no withdrawing more than there is") live **inside** the operations, not scattered across `main`.

But there is a problem: nothing stops `main` from writing `account.balance_cents = -500;` and skipping every rule. C has no access control. In the next lesson you will solve it with an **opaque type**.

## When is this style worth it?

Designing around operations has real benefits:

- **Modeling:** the program resembles the problem (Account, Student, Product).
- **Organization:** each type keeps its responsibility in a single module.
- **Maintenance:** you can change the internal representation without touching the code that uses the type.
- **Reuse:** a well-defined module moves to another project unchanged.

It also has costs in C, which in other languages the compiler pays for you:

- more code: creation and destruction functions, checks, naming conventions;
- more dynamic memory when you hide the representation, with the responsibility of freeing it;
- more indirection (pointers, function pointers) and less help from the compiler to catch mistakes.

A practical rule: use it when a type has **rules to protect** (invariants) or when **several parts of the program** use it. For a short program, a simple `struct` with two functions is better than an architecture imitated from Java. A bad "object-oriented" design can be worse than a clear structured design.

## What comes in this module

- `encapsulacion-y-abstraccion-en-c`: opaque types, creation and destruction functions, invariants.
- `objetos-metodos-y-diseno-basado-en-struct`: operations with the object as first parameter, composition and error handling.
- `polimorfismo-y-herencia-simulados-en-c`: operation tables with function pointers, base structs and the limits of simulating inheritance.

## Summary

- C is a procedural language; this module teaches design techniques inspired by OOP, not "OOP in C".
- Structured programming focuses on the algorithm; OOP, on entities and their behavior. One does not remove the other.
- **Abstraction** is designing a type from its operations, not from its fields.
- C expresses data + functions and interfaces; it has no native classes, inheritance, virtual dispatch or access control.
- These techniques cost code, memory and indirection: use them when the problem justifies it.

## Practice exercises

### Exercise 1: what does C have natively?

Classify each statement as true or false and justify it in one line:

1. C has the keyword `class`.
2. A `struct` and functions that receive a pointer to it can model state and behavior.
3. C prevents code in `main` from modifying a field of a `struct` whose definition it can see.
4. C automatically chooses which function to run based on an object's real type.

<details><summary>Show solution</summary>

1. False: C has no classes.
2. True: it is the basic technique of this module.
3. False: if the definition is visible, any code can write its fields; there is no `private`.
4. False: there is no virtual dispatch; it is simulated by hand with function pointers.

</details>

### Exercise 2: design around the operations

A program needs a **thermostat** that stores a target temperature between 10 and 30 degrees. Before writing fields, write the list of operations it would offer and the rule those operations must protect.

<details><summary>Show solution</summary>

A possible interface:

- `thermostat_init(t, target)`: sets the initial target (if it is out of range, it adjusts it or fails).
- `thermostat_up(t)` and `thermostat_down(t)`: change the target by one degree.
- `thermostat_target(t)`: queries the value without modifying it (receives `const`).

The rule they protect: the target always stays between 10 and 30. Since every modification goes through these functions, checking it inside them is enough.

</details>

### Exercise 3: implement the thermostat

Write the thermostat from the previous exercise with a `struct` and functions that receive a pointer to it. `thermostat_up` returns `false` if it is already at 30. Test it by going up 25 times from 20.

<details><summary>Show solution</summary>

```c
#include <stdbool.h>
#include <stdio.h>

struct Thermostat {
    int target;
};

bool thermostat_init(struct Thermostat *t, int target) {
    if (target < 10 || target > 30) {
        return false;
    }
    t->target = target;
    return true;
}

bool thermostat_up(struct Thermostat *t) {
    if (t->target >= 30) {
        return false;
    }
    t->target++;
    return true;
}

bool thermostat_down(struct Thermostat *t) {
    if (t->target <= 10) {
        return false;
    }
    t->target--;
    return true;
}

int thermostat_target(const struct Thermostat *t) {
    return t->target;
}

int main(void) {
    struct Thermostat t;
    if (!thermostat_init(&t, 20)) {
        return 1;
    }
    int rejected = 0;
    for (int i = 0; i < 25; i++) {
        if (!thermostat_up(&t)) {
            rejected++;
        }
    }
    printf("Target: %d, rejected: %d\n", thermostat_target(&t), rejected);
    thermostat_down(&t);
    printf("After going down: %d\n", thermostat_target(&t));
    return 0;
}
```

It prints `Target: 30, rejected: 15` and then `After going down: 29`.

</details>

### Exercise 4: is it worth it?

For each case, decide whether it pays to design a type with its own interface or whether direct code is enough: (a) a 40-line program that averages five grades; (b) a print-queue library used by three different modules of a system.

<details><summary>Show solution</summary>

(a) Direct code: there are no rules to protect and no multiple users; an interface would add code with no benefit. (b) A type with an interface: several modules use it, the queue has invariants (order, capacity) and its representation could change without affecting its users.

</details>
