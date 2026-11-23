---
title: 'For Loop'
course: 'c'
slug: 'sentencia-for'
order: 12
lang: 'en'
published: true
---

After learning `while`, a very common structure appears for repetition with a compact, controlled shape: `for`.

## Objectives

By the end of this lesson you will be able to:

- explain the three parts of a `for` and when each one runs
- declare the loop variable inside the `for` and know how far its scope reaches
- count up, count down and count by steps
- apply the **counter** pattern and the accumulator inside a `for`
- rewrite a `for` as a `while` and choose which one fits
- avoid the typical mistakes: `;` after the parenthesis, changing the counter inside the body, `<=` versus `<`, and unsigned counters counting down

**Prerequisites:** lesson 11 (*While Loop*: initial state, condition, update, off-by-one errors) and lesson 5 (*Data Types*: `size_t`, unsigned integer overflow).

## What does `for` do?

The `for` statement repeats a block and gathers in a single line the three elements of any loop:

```c
for (initialization; condition; update) {
    statements;
}
```

Order of execution:

1. **initialization**: runs **only once**, at the start
2. **condition**: evaluated **before each pass**; if false, the loop ends
3. **body**: runs if the condition was true
4. **update**: runs **at the end of each pass**, then back to step 2

As with `while`, if the condition is false from the start, the body runs zero times.

## Basic example

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        printf("%d\n", i);
    }
    return 0;
}
```

- initialization: `int i = 1` (declares the counter and gives it a value)
- condition: `i <= 5`
- update: `i++`, which is equivalent to `i = i + 1` (lesson 7)

Trace: the condition is evaluated with `i` = 1, 2, 3, 4, 5 (true, it prints) and with `i` = 6 (false, it ends). Five passes, six evaluations of the condition.

## The variable declared in the `for` and its scope

Since C99, the initialization can **declare** the loop variable. That variable exists only inside the `for`: its **scope** is the header and the body. When the loop ends, it no longer exists.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i < 3; i++) {
        printf("%d\n", i);
    }
    printf("%d\n", i);   // error: 'i' is not declared in this scope
    return 0;
}
```

This is an advantage: the counter does not "leak" and cannot be used by accident later. If you need the final value after the loop, declare the variable **before** it:

```c
#include <stdio.h>

int main(void) {
    int n = 37;
    int divisor;

    for (divisor = 2; n % divisor != 0; divisor++) {
        // no body needed: the condition looks for the first divisor
    }

    printf("The smallest divisor of %d greater than 1 is %d\n", n, divisor);
    return 0;
}
```

Because `divisor` was declared outside, its value is still available after the loop (here `37`, since 37 is prime).

> **Portability:** declaring the variable inside the `for` is valid since C99 and, of course, in C17 and C23. Only compilers in C89 mode (`-std=c89`) reject it; that is why very old code declares every variable at the start of the function.

## Counting up, down and by steps

The update can be any expression. The condition has to be consistent with it:

```c
#include <stdio.h>

int main(void) {
    // up: 0 1 2 3 4
    for (int i = 0; i < 5; i++) {
        printf("%d ", i);
    }
    printf("\n");

    // down: 5 4 3 2 1
    for (int i = 5; i > 0; i--) {
        printf("%d ", i);
    }
    printf("\n");

    // by steps: 0 5 10 15 20
    for (int i = 0; i <= 20; i += 5) {
        printf("%d ", i);
    }
    printf("\n");

    // powers of 2 below 100: 1 2 4 8 16 32 64
    for (int p = 1; p < 100; p *= 2) {
        printf("%d ", p);
    }
    printf("\n");
    return 0;
}
```

Each `for` declares its own `i`: since the scope ends with the loop, they do not clash.

Avoid using `double` as a counter: `0.1` is not represented exactly (lesson 5), and a loop such as `for (double x = 0.0; x != 1.0; x += 0.1)` may never end. Count with integers and compute the `double` inside the body.

## The counter pattern

The `for` variable **walks** through values; a separate **counter** **counts** how many of them satisfy something. Do not confuse them.

```c
#include <stdio.h>

int main(void) {
    int n;

    printf("Limit: ");
    if (scanf("%d", &n) != 1 || n < 1) {
        printf("Enter a positive integer\n");
        return 1;
    }

    int multiples = 0;        // counter
    long long sum = 0;        // accumulator

    for (int i = 1; i <= n; i++) {
        if (i % 3 == 0) {
            multiples++;
            sum += i;
        }
    }

    printf("Between 1 and %d there are %d multiples of 3; they add up to %lld\n", n, multiples, sum);
    return 0;
}
```

- `i` goes from 1 to `n`: it says **which number is being looked at**
- `multiples` starts at 0 and grows only when the condition holds
- `sum` is a `long long` to have more room before an overflow

## `for` and `while`: the same idea

Every `for` can be written as a `while`:

```c
for (int i = 1; i <= 5; i++) {
    printf("%d\n", i);
}
```

is equivalent to:

```c
{
    int i = 1;
    while (i <= 5) {
        printf("%d\n", i);
        i++;
    }
}
```

The outer braces reproduce the scope: `i` does not exist outside. There is a single practical difference: in a `for`, `continue` jumps to the end of the body and **runs the update**; in the equivalent `while`, if `continue` comes before `i++`, it skips it (you saw this in lesson 11).

Which one to choose?

- `for`, when a variable **walks** a known range: from 1 to n, from n to 0, by steps
- `while`, when the repetition depends on a condition rather than on counting: a sentinel, end of input, "until the number is 1"

## Common mistakes

### 1. A `;` after the parenthesis

```c
for (int i = 0; i < 5; i++);
{
    printf("Hello\n");
}
```

The `;` is the body of the loop (the empty statement). The `for` makes five passes doing nothing and then the block runs **only once**. Also, inside that block `i` no longer exists.

### 2. Changing the counter inside the body

```c
for (int i = 0; i < 10; i++) {
    printf("%d\n", i);
    i = i + 1;     // now the loop steps by 2 and the header does not say so
}
```

A reader expects the `for` header to describe the whole walk. If the step changes, change it in the update (`i += 2`). If the walk depends on what happens inside, it probably should have been a `while`.

### 3. `<=` versus `<`

| Header | Values of `i` | Passes |
| --- | --- | --- |
| `for (int i = 0; i < n; i++)` | 0 … n-1 | n |
| `for (int i = 1; i <= n; i++)` | 1 … n | n |
| `for (int i = 0; i <= n; i++)` | 0 … n | n + 1 |

The `0` and `< n` form is the usual one in C (you will use it with arrays later in the course). Mixing `0` with `<= n` makes one pass too many: it is the most frequent off-by-one error.

### 4. Unsigned counters counting down

`size_t` (lesson 5) is an unsigned type: it has no negative values. When it is `0` and you subtract 1, it **wraps around** to the maximum value (`SIZE_MAX`). That is why this loop never ends:

<!-- c-check: skip -->
```c
#include <stddef.h>
#include <stdio.h>

int main(void) {
    size_t n = 3;

    for (size_t i = n; i >= 0; i--) {   // i >= 0 is ALWAYS true
        printf("%zu\n", i);
    }
    return 0;
}
```

After printing `0`, `i--` leaves `i` with a huge number, which is still `>= 0`. With `-Wextra`, GCC warns that the comparison is always true. Two correct forms:

```c
#include <stddef.h>
#include <stdio.h>

int main(void) {
    size_t n = 3;

    // 1. The condition never needs to reach a negative value
    for (size_t i = n; i > 0; i--) {
        printf("%zu ", i - 1);       // prints 2 1 0
    }
    printf("\n");

    // 2. Compare and decrement inside the condition
    for (size_t i = n; i-- > 0; ) {
        printf("%zu ", i);           // prints 2 1 0
    }
    printf("\n");
    return 0;
}
```

In the second form, `i-- > 0` compares the **previous** value and then decrements it, so the body sees `2`, `1` and `0`. Any part of the header can be left empty; here the update is already in the condition.

## Summary

- `for (initialization; condition; update)`: the initialization runs once, the condition before each pass, the update at the end of each pass
- the variable declared in the `for` (C99+) only exists inside the loop
- the loop variable walks through values; a separate **counter** counts those that satisfy something
- every `for` is equivalent to a `while`, except for the detail of `continue` and the update
- watch out for `;` after the parenthesis, changing the counter in the body, `<=` versus `<`, and unsigned counters going down to 0

## Practice exercises

### Exercise 1: predict the output

```c
#include <stdio.h>

int main(void) {
    for (int i = 20; i > 0; i -= 6) {
        printf("%d ", i);
    }
    printf("\n");

    int passes = 0;
    for (int j = 1; j <= 100; j *= 3) {
        passes++;
    }
    printf("%d\n", passes);
    return 0;
}
```

<details><summary>Show solution</summary>

```text
20 14 8 2
5
```

The first loop goes down by 6; after `2` the update leaves `i` at `-4` and the condition fails. The second one walks `j` = 1, 3, 9, 27, 81 (five passes); the next value, `243`, no longer satisfies `j <= 100`.

</details>

### Exercise 2: divisors of a number

Write a program that reads an integer `n` between 1 and 100000, prints all its divisors on one line and, with a counter, reports how many there are. If it has exactly 2 divisors, also report that it is prime.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    int n;

    printf("Number (1 to 100000): ");
    if (scanf("%d", &n) != 1 || n < 1 || n > 100000) {
        printf("Invalid input\n");
        return 1;
    }

    int divisors = 0;
    for (int d = 1; d <= n; d++) {
        if (n % d == 0) {
            printf("%d ", d);
            divisors++;
        }
    }
    printf("\nNumber of divisors: %d\n", divisors);

    if (divisors == 2) {
        printf("%d is prime\n", n);
    }
    return 0;
}
```

`d` walks the candidates; `divisors` counts only those that divide `n`.

</details>

### Exercise 3: from while to for

Rewrite this loop as an equivalent `for`, with the variable declared in the header.

```c
#include <stdio.h>

int main(void) {
    int k = 10;
    while (k >= 0) {
        printf("%d ", k);
        k = k - 2;
    }
    printf("\n");
    return 0;
}
```

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    for (int k = 10; k >= 0; k -= 2) {
        printf("%d ", k);
    }
    printf("\n");
    return 0;
}
```

Both print `10 8 6 4 2 0`. The only difference is that now `k` does not exist after the loop.

</details>

### Exercise 4: countdown with `size_t`

A classmate wrote this countdown and the program never ends. Explain why and fix it without changing the type of `i`.

<!-- c-check: skip -->
```c
#include <stddef.h>
#include <stdio.h>

int main(void) {
    for (size_t i = 5; i >= 0; i--) {
        printf("%zu...\n", i);
    }
    printf("Liftoff!\n");
    return 0;
}
```

<details><summary>Show solution</summary>

`size_t` has no negative values: when `i` is `0`, `i--` wraps around to `SIZE_MAX` and `i >= 0` is still true. The `0` must be printed without the condition depending on going below 0:

```c
#include <stddef.h>
#include <stdio.h>

int main(void) {
    for (size_t i = 6; i-- > 0; ) {
        printf("%zu...\n", i);
    }
    printf("Liftoff!\n");
    return 0;
}
```

It prints from `5...` down to `0...` and then `Liftoff!`. Another valid option is `for (size_t i = 6; i > 0; i--)` printing `i - 1`.

</details>
