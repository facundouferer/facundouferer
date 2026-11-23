---
title: 'Variables and Parameters'
course: 'c'
slug: 'variables-parametros-y-pasaje'
order: 16
lang: 'en'
published: true
---

Once you work with functions, a central question appears:

> which data does each function know, how long does it exist, and how does it get there?

This lesson answers those three questions: where a name is visible (**scope**), how long a variable lives (**duration**) and how data travels from a call into a function (argument passing).

## Objectives

- Tell local and global variables apart.
- Recognize the scope of a name: block, function and file scope.
- Tell automatic storage duration from static storage duration, and use a `static` local variable.
- Explain name shadowing.
- Explain why C passes arguments **always by value** and what that implies.

**Prerequisites:** `modularizacion-subprogramas-y-funciones` (functions, parameters, `return`, `static` functions) and `sentencia-switch-y-bloques-de-codigo` (blocks).

## Local variables

A **local variable** is declared inside a function (or inside any `{ }` block). It can only be used there.

```c
#include <stdio.h>

void greet(void) {
    int times = 3;              // local to greet
    for (int i = 0; i < times; i++) {
        printf("Hello\n");
    }
}

int main(void) {
    greet();
    // printf("%d\n", times);   // error: times does not exist in main
    return 0;
}
```

Two functions can have local variables with the same name without any conflict: they are different variables.

Every time a function is called, its local variables are created anew. That is why a local variable **does not remember** the value from the previous call, and an uninitialized local has an indeterminate value: reading it before assigning something is a bug. Always initialize your local variables.

## Global variables

A **global variable** is declared outside every function. Every function of the file that appears after the declaration can use it.

```c
#include <stdio.h>

int total_sales = 0;            // global

void record_sale(int amount) {
    total_sales = total_sales + amount;
}

int main(void) {
    record_sale(100);
    record_sale(250);
    printf("Total: %d\n", total_sales);   // Total: 350
    return 0;
}
```

It works, but it has a price. If many functions read and modify the same global, understanding its value requires reviewing the **whole** program; any function may be the culprit of a wrong value, and those functions can no longer be tested separately.

> Rule of thumb: prefer local variables and pass data as arguments and return values. Use a global only when there is a clear reason to share the data.

A global used by only one file can be declared `static`: just like with functions in the previous lesson, `static` at file level hides the name from the other files of the program.

## Scope: where a name is visible

The **scope** of a name is the part of the code where that name can be used. C has three scopes that matter to you now:

- **Block scope**: a name declared inside `{ }` is visible from its declaration to the brace that closes that block. This includes variables of an `if`, of a `for` (the `i` in `for (int i = 0; ...)` exists only inside the loop) and of any block.
- **Function scope**: a function's body is its outermost block, so its local variables and its **parameters** are visible in the whole function and nowhere else. (Technically, the standard reserves the term "function scope" for `goto` labels; parameters and locals have the block scope of the body. In practice people speak of "the function's scope" in this sense.)
- **File scope**: a name declared outside every function (a global or a function) is visible from its declaration to the end of the file.

```c
#include <stdio.h>

int limit = 10;                     // file scope

int sum_up_to(int n) {              // n: visible in the whole function
    int sum = 0;                    // sum: visible in the whole function
    for (int i = 1; i <= n; i++) {  // i: only inside the for
        if (i <= limit) {
            int twice = i * 2;      // twice: only inside the if
            sum = sum + twice;
        }
    }
    return sum;
}

int main(void) {
    printf("%d\n", sum_up_to(4));   // 2 + 4 + 6 + 8 = 20
    return 0;
}
```

Declaring each variable in the smallest block where it is used makes code easier to read: the reader knows the variable has no influence outside that block.

## Name shadowing

If an inner block declares a name that already exists in an outer scope, the inner name **shadows** the outer one inside that block:

```c
#include <stdio.h>

int x = 1;                          // global

int main(void) {
    printf("%d\n", x);              // 1: the global
    int x = 2;                      // shadows the global
    printf("%d\n", x);              // 2
    {
        int x = 3;                  // shadows the previous one
        printf("%d\n", x);          // 3
    }
    printf("%d\n", x);              // 2: the inner block's x no longer exists
    return 0;
}
```

It is legal, but confusing: when you read `x` you have to work out which of the three it is. Avoid reusing names in nested scopes. With the `-Wshadow` option, GCC and Clang warn you when it happens.

## Duration: how long a variable lives

Scope says **where** a name is visible; **duration** says **when the variable exists** in memory. They are different ideas.

- **Automatic duration**: ordinary local variables are born when execution enters their block and disappear when it leaves. Each call of the function has its own.
- **Static duration**: global variables exist during the whole execution of the program. They are initialized only once, before `main` starts, and if you give them no initial value they start at zero.

### `static` local variables

A local variable declared `static` combines both ideas: block **scope** (only visible inside the function) and static **duration** (it keeps its value between calls).

```c
#include <stdio.h>

int next_ticket(void) {
    static int counter = 0;     // initialized only once
    counter = counter + 1;
    return counter;
}

int main(void) {
    printf("Ticket %d\n", next_ticket());   // Ticket 1
    printf("Ticket %d\n", next_ticket());   // Ticket 2
    printf("Ticket %d\n", next_ticket());   // Ticket 3
    return 0;
}
```

Without `static`, `counter` would be created on every call with value `0` and the function would always return `1`. With `static`, the `= 0` applies only once and the value survives between calls; even so, no other function can touch it.

Notice that `static` has two meanings depending on where it is used: on a file-level function or variable it **hides the name** from other files; on a local variable it gives **static duration**.

The full treatment of storage duration (automatic, static and allocated), object lifetime and the related bugs comes in `duracion-y-ciclo-de-vida`, after pointers.

## Parameters and arguments

Remember the distinction from the previous lesson:

- **parameters** are the variables of the definition: `int add(int a, int b)`;
- **arguments** are the values of each call: `add(5, 3)`.

A parameter is, in every sense, **a local variable of the function** that starts with the value of the argument: it has function scope and automatic duration.

## C always passes arguments by value

This is the most important rule of the lesson:

> In C, arguments are passed **always by value**. When a function is called, each argument is evaluated and its **value** is copied into the parameter. The function works with that copy.

That is why a function cannot modify a caller's variable through a parameter:

```c
#include <stdio.h>

void double_it(int x) {
    x = x * 2;                                  // modifies the copy
    printf("Inside double_it: x = %d\n", x);
}

int main(void) {
    int number = 5;
    double_it(number);
    printf("In main: number = %d\n", number);
    return 0;
}
```

Output:

```text
Inside double_it: x = 10
In main: number = 5
```

Step by step:

| Moment | `number` (in `main`) | `x` (in `double_it`) |
|---|---|---|
| before the call | 5 | does not exist |
| on entering `double_it` | 5 | 5 (copy of the value) |
| after `x = x * 2` | 5 | 10 |
| back in `main` | 5 | no longer exists |

`number` and `x` are two different variables. The only thing that travelled from one to the other was the number `5`. It would not matter if the parameter were called `number` either: it would still be another variable, local to `double_it`.

### The right way for now: return the result

If you want `main` to get the doubled value, the function must **return** it and the caller decides what to do with it:

```c
#include <stdio.h>

int doubled(int x) {
    return x * 2;
}

int main(void) {
    int number = 5;
    number = doubled(number);           // the caller decides to change its variable
    printf("number = %d\n", number);    // number = 10
    return 0;
}
```

This has an advantage: reading `main`, you can clearly see that `number` changes, and where.

### What about "pass by reference"?

Other languages have **pass by reference**: the parameter becomes another name for the original variable, and modifying it modifies the original. **C does not have that mechanism.**

When a C function needs to modify a caller's variable (for example, to return two results, or to swap two values), a technique is used: the function receives the **address** of the variable through a **pointer**, and it reaches the original variable through that address. But the pointer is **also passed by value**: the function gets a copy of the address. The rule has no exceptions.

You already used a function that works like this: `scanf("%d", &n)` can store a value in `n` because it receives its address (`&n`, "the address of `n`"), not its value.

How to declare pointers and write your own functions with this technique is taught in `punteros-y-direcciones`. Until then, communicate results with `return`.

## Common mistakes

1. **Believing that assigning to a parameter changes the argument.** The copy is modified; the original stays the same.
2. **Expecting a local variable to remember its value** between calls without declaring it `static`.
3. **Reading an uninitialized local variable.** Its value is indeterminate.
4. **Overusing globals.** Any function can change them and the program becomes hard to follow and to test.
5. **Reusing names in nested blocks**, shadowing variables by accident.
6. **Saying that C passes arguments "by reference".** C always passes them by value; the pointer technique passes an address, and that address is copied too.

## Summary

- A local variable is visible only in its block; a global, from its declaration to the end of the file.
- **Scope** can be block, function (locals and parameters in the whole body) or file scope.
- Automatic **duration** lasts as long as the block; static duration, the whole execution. `static int counter` inside a function keeps its value between calls.
- An inner name shadows an outer one with the same name.
- C passes arguments **always by value**: the function receives copies. To communicate a result, use `return`; the pointer technique comes in `punteros-y-direcciones`.

## Practice exercises

### Exercise 1: predict the output

What does this program print? Justify each line.

```c
#include <stdio.h>

int value = 10;

int increment(int value) {
    value = value + 1;
    return value;
}

int main(void) {
    int result = increment(value);
    printf("%d %d\n", value, result);
    {
        int value = 50;
        printf("%d\n", increment(value));
    }
    printf("%d\n", value);
    return 0;
}
```

<details><summary>Show solution</summary>

```text
10 11
51
10
```

- The parameter `value` of `increment` shadows the global and receives a **copy** of `10`; the function returns `11` without touching the global, which stays at `10`.
- In the block, the local `value = 50` shadows the global; `increment` receives a copy of `50` and returns `51`.
- After the block, `value` is the global again: `10`.

</details>

### Exercise 2: counting calls

Write a function `void record_visit(void)` that, every time it is called, prints `Visit number N`, with `N` starting at 1. Do not use global variables. Call it four times from `main`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

void record_visit(void) {
    static int visits = 0;
    visits = visits + 1;
    printf("Visit number %d\n", visits);
}

int main(void) {
    for (int i = 0; i < 4; i++) {
        record_visit();
    }
    return 0;
}
```

`visits` has block scope (nobody outside the function can modify it) and static duration (it keeps its value between calls).

</details>

### Exercise 3: fixing a function with no effect

This program should apply a 10% discount to a price, but it always prints the original price. Explain why and fix it without using global variables.

```c
#include <stdio.h>

void apply_discount(double price) {
    price = price * 0.9;
}

int main(void) {
    double price = 200.0;
    apply_discount(price);
    printf("Final price: %.2f\n", price);
    return 0;
}
```

<details><summary>Show solution</summary>

C always passes arguments by value: `apply_discount` modifies its copy of `price`, which disappears when the function ends. The variable in `main` never changes. The function must return the new price:

```c
#include <stdio.h>

double discounted(double price) {
    return price * 0.9;
}

int main(void) {
    double price = 200.0;
    price = discounted(price);
    printf("Final price: %.2f\n", price);   // Final price: 180.00
    return 0;
}
```

</details>

### Exercise 4: identify scope and duration

For each variable of this fragment, state its scope and its duration.

```c
int attempts = 0;

int validate(int code) {
    static int failures = 0;
    int correct = code == 1234;
    if (!correct) {
        int penalty = 1;
        failures = failures + penalty;
    }
    attempts = attempts + 1;
    return correct;
}
```

<details><summary>Show solution</summary>

| Variable | Scope | Duration |
|---|---|---|
| `attempts` | file (from its declaration to the end) | static |
| `code` | the function `validate` (it is a parameter) | automatic |
| `failures` | block: the body of `validate` | static (because of `static`) |
| `correct` | block: the body of `validate` | automatic |
| `penalty` | block: only inside the `if` | automatic |

</details>
