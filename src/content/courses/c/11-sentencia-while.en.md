---
title: 'While Loop'
course: 'c'
slug: 'sentencia-while'
description: 'Repeat statements while a condition holds with while, control loops with counters, accumulators and sentinel values without falling into infinite loops.'
order: 11
lang: 'en'
published: true
---

So far you have seen how a program runs actions in sequence and how it chooses between paths. Now another fundamental problem appears: **repeating actions**.

That is the job of iteration statements. The first one you will study is `while`.

## Objectives

By the end of this lesson you will be able to:

- explain what an iteration is and why `while` checks the condition **before** each pass
- design a loop from its initial state, its condition and its update
- use counters and accumulators inside a loop
- write **sentinel** loops and loops that read data until `scanf` fails
- recognize and avoid infinite loops and off-by-one errors

**Prerequisites:** lessons 6 (*Input and Output*, validation with `scanf(...) != 1`), 7 (*Operators*) and 8 to 10 (*If-Else*, *Ternary Operator*, *Switch and Code Blocks*).

## What is an iteration?

An **iteration** is each repetition of a group of instructions. If a loop prints five numbers, there were five iterations (or "passes").

Repeating is not copying the same code many times: it is controlling how a **state** changes while a condition keeps holding.

## What does `while` do?

The `while` statement repeats a block **while a condition is true** (non-zero).

```c
while (condition) {
    statements;
}
```

The order of execution is always the same:

1. the condition is evaluated
2. if it is false, the loop ends and the program continues after the closing brace
3. if it is true, the whole block runs
4. go back to step 1

Because the condition is checked **first**, the block of a `while` can run **zero times**.

## The three elements of a loop

Every well-designed loop has three elements:

1. **initial state**: the value of the variables before entering
2. **continuation condition**: what is asked before each pass
3. **state update**: what changes inside the block and brings the loop closer to its end

If you forget any of the three, the loop is almost always wrong.

```c
#include <stdio.h>

int main(void) {
    int i = 1;              // initial state

    while (i <= 5) {        // condition
        printf("%d\n", i);
        i = i + 1;          // update
    }

    printf("After the loop, i is %d\n", i);
    return 0;
}
```

### Tracing the loop

A **trace** is a table with the value of the variables at each step. It is the best tool to understand (and debug) a loop:

| Pass | `i` when checked | `i <= 5` | Printed | `i` at the end |
| --- | --- | --- | --- | --- |
| 1 | 1 | true | `1` | 2 |
| 2 | 2 | true | `2` | 3 |
| 3 | 3 | true | `3` | 4 |
| 4 | 4 | true | `4` | 5 |
| 5 | 5 | true | `5` | 6 |
| — | 6 | false | — | — |

The condition was evaluated **six** times for five passes, and after the loop `i` is `6`: the first value that does not satisfy the condition.

### Zero iterations

```c
#include <stdio.h>

int main(void) {
    int balance = 0;

    while (balance > 0) {
        printf("There is still balance\n");
        balance = balance - 100;
    }

    printf("Done\n");
    return 0;
}
```

Only `Done` is printed: the condition was false from the start and the block never ran. That is correct, since it makes no sense to withdraw from an empty balance.

## Counters and accumulators

Two patterns appear in almost every loop:

- a **counter** counts how many times something happens: it starts at 0 and adds 1 (`count = count + 1;`)
- an **accumulator** gathers values: it starts at the neutral element of the operation (0 to add, 1 to multiply) and takes in one value per pass (`sum = sum + value;`)

```c
#include <stdio.h>

int main(void) {
    int n;

    printf("Add from 1 up to: ");
    if (scanf("%d", &n) != 1 || n < 1 || n > 10000) {
        printf("Enter an integer between 1 and 10000\n");
        return 1;
    }

    int i = 1;
    int sum = 0;       // accumulator
    int evens = 0;     // counter

    while (i <= n) {
        sum = sum + i;
        if (i % 2 == 0) {
            evens = evens + 1;
        }
        i = i + 1;
    }

    printf("Sum from 1 to %d: %d\n", n, sum);
    printf("Even numbers in the range: %d\n", evens);
    return 0;
}
```

The limit of 10000 is not a whim: the sum from 1 to n grows fast, and overflowing an `int` is **undefined behavior** (lesson 7). Validating the input range protects the accumulator.

## Sentinel loops

Often you do not know how many values the user will enter. A classic solution is to agree on a **sentinel value**: a special value that is not data but the signal "I am done".

The pattern is called **priming read**: read once before the loop and again at the end of the block, so the condition always asks about the last value read.

```c
#include <stdio.h>

int main(void) {
    int grade;
    int count = 0;
    int sum = 0;

    printf("Grade (-1 to finish): ");
    if (scanf("%d", &grade) != 1) {
        printf("Invalid input\n");
        return 1;
    }

    while (grade != -1) {           // -1 is the sentinel
        sum = sum + grade;
        count = count + 1;

        printf("Grade (-1 to finish): ");
        if (scanf("%d", &grade) != 1) {
            printf("Invalid input\n");
            return 1;
        }
    }

    if (count > 0) {
        printf("Average of %d grades: %.2f\n", count, (double) sum / count);
    } else {
        printf("No grades were entered\n");
    }
    return 0;
}
```

Details that matter:

- the sentinel is **not processed**: when `-1` arrives, the condition fails before adding it
- the sentinel must be a value that is never valid data (a grade cannot be `-1`)
- if the first value is already the sentinel, the loop makes zero passes, which is why the average is computed only when `count > 0`: dividing by zero would be an error

## Reading until `scanf` fails

Another way to stop is to use the value `scanf` returns. As you saw in lesson 6, `scanf("%d", &x)` returns `1` if it read an integer, `0` if it found something that is not a number and `EOF` if the input ended. So the read itself can be the condition:

```c
#include <stdio.h>

int main(void) {
    int value;
    int count = 0;
    int maximum = 0;

    printf("Enter integers (finish with a letter or end of input):\n");
    while (scanf("%d", &value) == 1) {
        if (count == 0 || value > maximum) {
            maximum = value;
        }
        count = count + 1;
    }

    if (count > 0) {
        printf("Read: %d, maximum: %d\n", count, maximum);
    } else {
        printf("No number was read\n");
    }
    return 0;
}
```

The condition `scanf(...) == 1` reads **and** asks in the same step. End of input is signaled with `Ctrl+D` on Linux and macOS, or `Ctrl+Z` followed by Enter on Windows. This pattern is ideal when the data comes from a redirected file (`./program < data.txt`).

Notice how `maximum` is initialized: the first value read sets it (`count == 0`). Initializing it to `0` would fail if every number were negative.

## Infinite loops

An **infinite loop** happens when the condition never becomes false. If it happens while running, stop the program with `Ctrl+C`.

Typical causes:

```c
// 1. Missing update: i is always 1
int i = 1;
while (i <= 5) {
    printf("%d\n", i);
}

// 2. The update goes the wrong way
int j = 1;
while (j <= 5) {
    printf("%d\n", j);
    j = j - 1;
}

// 3. The condition uses != and the value "jumps over" it: k goes 1, 3, 5, ..., never 10
int k = 1;
while (k != 10) {
    k = k + 2;
}

// 4. A semicolon after the parenthesis: the body of the while is the empty statement
int m = 1;
while (m <= 5);
{
    m = m + 1;
}
```

The fourth one is the sneakiest: `while (m <= 5);` repeats the empty statement `;` forever, and the block below is a standalone block that is never reached.

Before writing a loop, ask yourself:

> Which statement in the block moves the state toward the end of the loop, and am I sure the condition will become false?

Sometimes an infinite loop is intentional (a server, a menu) and is written `while (true)` or `while (1)`; in that case it **must** have an explicit exit with `break` or `return` inside the block.

> **Modern C (C23):** `true` and `false` are keywords, so `while (true)` compiles without including anything. **Basic C:** in C99 and C17 you need `#include <stdbool.h>` to use `true`; that is why older code uses `while (1)`.

## Off-by-one errors

An **off-by-one error** is a loop that makes one pass too many or too few. It is the most common loop bug in any language.

```c
// We want 10 passes
int i = 0;
while (i <= 10) {   // 11 passes: 0, 1, ..., 10
    i = i + 1;
}

int j = 0;
while (j < 10) {    // 10 passes: 0, 1, ..., 9
    j = j + 1;
}

int k = 1;
while (k <= 10) {   // 10 passes: 1, 2, ..., 10
    k = k + 1;
}
```

Rule of thumb: with `i` starting at `a` and the condition `i < b` there are `b - a` passes; with `i <= b`, there are `b - a + 1`. To check it, trace the **first** and the **last** pass: that is where almost all of these errors hide.

## `break` and `continue` (preview)

Inside any loop, `break` leaves the loop immediately and `continue` jumps to the next evaluation of the condition. You will study them in detail, with criteria for using them, in lesson 13. Here one warning specific to `while` is enough:

```c
int i = 0;
while (i < 5) {
    if (i == 2) {
        continue;      // skips the update: i stays at 2 forever
    }
    printf("%d\n", i);
    i = i + 1;
}
```

In a `while`, the update is just another statement in the block. If `continue` skips it, the loop becomes infinite. The fix is to update **before** the `continue`, or to restructure with an `if`.

## When should you use `while`?

`while` is the natural choice when the repetition depends on a condition and **you do not know in advance how many passes there will be**: reading until a sentinel, processing until the input ends, splitting the digits of a number, repeating until a goal is reached.

When the number of passes is known (counting from 1 to n), `for` (lesson 12) usually expresses it better.

## Common mistakes

1. **Forgetting the update** or writing it in the wrong direction: infinite loop.
2. **Putting `;` after `while (...)`**: the body becomes the empty statement.
3. **Using `<=` where `<` belonged** (or the reverse): one pass too many or too few.
4. **Not initializing** the counter or the accumulator: it starts with an indeterminate value.
5. **Processing the sentinel** as if it were data, or dividing by the count without checking that it is greater than 0.
6. **Ignoring the value of `scanf`**: if the user types a letter, `scanf` fails every time and the loop may never end.

## Summary

- `while` checks the condition **before** each pass, so it may run zero times
- every loop has an initial state, a condition and an update
- a counter counts occurrences; an accumulator gathers values; both are initialized before the loop
- a **sentinel** loop uses a priming read and does not process the stop value
- `while (scanf("%d", &x) == 1)` reads until the input ends or is not a number
- tracing the first and last pass catches infinite loops and off-by-one errors

## Practice exercises

### Exercise 1: trace it

Without running it, write the trace of `n` and `steps` and the program's output.

```c
#include <stdio.h>

int main(void) {
    int n = 6;
    int steps = 0;

    while (n != 1) {
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
        steps = steps + 1;
    }

    printf("Steps: %d\n", steps);
    return 0;
}
```

<details><summary>Show solution</summary>

| Pass | `n` at the start | `n` at the end | `steps` |
| --- | --- | --- | --- |
| 1 | 6 | 3 | 1 |
| 2 | 3 | 10 | 2 |
| 3 | 10 | 5 | 3 |
| 4 | 5 | 16 | 4 |
| 5 | 16 | 8 | 5 |
| 6 | 8 | 4 | 6 |
| 7 | 4 | 2 | 7 |
| 8 | 2 | 1 | 8 |

When `n` is `1`, the condition `n != 1` is false. The output is `Steps: 8`. The number of passes is not known in advance: that is why it is a typical `while` case.

</details>

### Exercise 2: maximum and count with a sentinel

Write a program that reads positive integers until `0` (the sentinel) is entered and shows how many were entered and which was the largest. If the user types something that is not a number, print `Invalid input` and end with `return 1;`. If a negative number is entered, print `Ignored` and do not count it. If there was no positive number, print `No data`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    int number;
    int count = 0;
    int largest = 0;

    printf("Number (0 to finish): ");
    if (scanf("%d", &number) != 1) {
        printf("Invalid input\n");
        return 1;
    }

    while (number != 0) {
        if (number < 0) {
            printf("Ignored\n");
        } else {
            if (count == 0 || number > largest) {
                largest = number;
            }
            count = count + 1;
        }

        printf("Number (0 to finish): ");
        if (scanf("%d", &number) != 1) {
            printf("Invalid input\n");
            return 1;
        }
    }

    if (count > 0) {
        printf("Count: %d, largest: %d\n", count, largest);
    } else {
        printf("No data\n");
    }
    return 0;
}
```

The priming read appears twice: before the loop and at the end of the block. The `0` is never processed as data.

</details>

### Exercise 3: find the bugs

This program should print `10 8 6 4 2` and then the sum `30`. It has three bugs. Find and fix them.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int i = 10;
    int sum;

    while (i >= 0);
    {
        printf("%d ", i);
        sum = sum + i;
        i = i - 2;
    }
    printf("\nSum: %d\n", sum);
    return 0;
}
```

<details><summary>Show solution</summary>

1. `while (i >= 0);` has a `;` that leaves the loop with an empty body: since `i` never changes, it is an infinite loop.
2. `sum` is not initialized: write `int sum = 0;`.
3. `i >= 0` includes `0`, which must not be printed (off by one): the right condition is `i > 0`.

```c
#include <stdio.h>

int main(void) {
    int i = 10;
    int sum = 0;

    while (i > 0) {
        printf("%d ", i);
        sum = sum + i;
        i = i - 2;
    }
    printf("\nSum: %d\n", sum);
    return 0;
}
```

</details>

### Exercise 4: read until end of input

Write a program that reads integers until `scanf` stops returning `1` and shows how many were even and how many odd. Test it by typing numbers and finishing with `Ctrl+D` (or `Ctrl+Z` and Enter on Windows).

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    int value;
    int evens = 0;
    int odds = 0;

    while (scanf("%d", &value) == 1) {
        if (value % 2 == 0) {
            evens = evens + 1;
        } else {
            odds = odds + 1;
        }
    }

    printf("Even: %d, odd: %d\n", evens, odds);
    return 0;
}
```

With negative values, `value % 2` can be `-1`, which is why it is compared with `== 0` and not with `== 1`.

</details>
