---
title: 'Schematic Programming and Nested Statements'
course: 'c'
slug: 'programacion-esquematica-y-sentencias-anidadas'
order: 14
lang: 'en'
published: true
---

You have already seen sequence, selection and iteration. Now comes a bigger idea: **how to think about whole programs by combining those structures without losing clarity**.

That connects with **schematic programming**, with **stepwise refinement** and with the controlled use of **nested statements**.

## Objectives

By the end of this lesson you will be able to:

- recognize the sequence, selection and iteration schemes in a problem
- go from a problem statement to pseudocode and from pseudocode to C through stepwise refinement
- write and trace nested loops and decisions inside loops
- choose the right control structure for each part of a problem
- review a loop with a checklist of common mistakes

**Prerequisites:** lessons 8 to 13 (*If-Else*, *Ternary Operator*, *Switch and Code Blocks*, *While Loop*, *For Loop*, *Do-While Loop*).

## What is schematic programming?

**Schematic programming** is a way of designing programs from well-known control schemes. Instead of improvising, you think about the problem with three basic structures:

1. **Sequence**: one action after another.
2. **Selection**: choosing between possible paths (`if`, `switch`, the ternary operator).
3. **Iteration**: repeating actions while a condition says so (`while`, `for`, `do-while`).

A huge number of programs are built by combining just these three schemes. You do not invent the logic from scratch every time: you recognize patterns.

## Stepwise refinement

**Stepwise refinement** means solving a problem from the general to the specific: first a description with a few big steps, then each step is broken into smaller ones, until each one translates directly into a C statement.

### From the problem statement to pseudocode

**Problem statement:** read an integer `n` between 2 and 1000 and print every prime number from 2 to `n`, and at the end how many there are.

**Level 1** (what has to be done):

```text
read n and validate it
for each number from 2 to n
    if it is prime, print it and count it
print the count
```

The schemes are already visible: **sequence** (read, process, print), **iteration** (for each number) and **selection** (if it is prime).

**Level 2** (how "is prime" is decided): a number `k` is prime if no `d` between 2 and `k - 1` divides it. It is enough to try while `d * d <= k`, because if `k` has a divisor larger than its square root, it also has a smaller one.

```text
read n
if reading fails or n is not between 2 and 1000
    report the error and stop
primes ← 0
for k from 2 to n
    is_prime ← true
    for d from 2 while d * d <= k
        if k is divisible by d
            is_prime ← false
            stop trying divisors
    if is_prime
        print k
        primes ← primes + 1
print primes
```

### From pseudocode to C

Each line of level 2 has a direct translation:

```c
#include <stdio.h>

int main(void) {
    int n;

    printf("Print primes up to (2 to 1000): ");
    if (scanf("%d", &n) != 1 || n < 2 || n > 1000) {
        printf("Invalid input\n");
        return 1;
    }

    int primes = 0;
    for (int k = 2; k <= n; k++) {
        bool is_prime = true;

        for (int d = 2; d * d <= k; d++) {
            if (k % d == 0) {
                is_prime = false;
                break;              // stop trying divisors
            }
        }

        if (is_prime) {
            printf("%d ", k);
            primes++;
        }
    }

    printf("\nThere are %d primes between 2 and %d\n", primes, n);
    return 0;
}
```

The `break` leaves **only the inner loop** (the `d` loop): the `k` loop goes on with the next number. And `is_prime` is set back to `true` at the start of **every** outer pass: if it were initialized only once before the outer `for`, the first composite number would leave it `false` forever.

> **Modern C (C23):** `bool`, `true` and `false` are keywords. **Basic C:** in C99 and C17, this program needs `#include <stdbool.h>`.

Writing the pseudocode first is not a waste of time: it separates **what** the program does from **how** it is written in C, and logic errors show up before compiling.

## Nested statements

A **nested statement** is a control structure placed inside another one:

- an `if` inside another `if`
- an `if` inside a `while` (deciding something on each pass)
- a `for` inside another `for` (nested loops)
- a `switch` inside a `do-while` (the menus of lesson 13)

### Decisions inside a loop

```c
#include <stdio.h>

int main(void) {
    int number;
    int sum = 0;

    printf("Enter a number (0 to finish): ");
    if (scanf("%d", &number) != 1) {
        printf("Invalid input\n");
        return 1;
    }

    while (number != 0) {
        if (number > 0) {
            sum = sum + number;
        }

        printf("Enter a number (0 to finish): ");
        if (scanf("%d", &number) != 1) {
            printf("Invalid input\n");
            return 1;
        }
    }

    printf("The sum of the positive numbers is %d\n", sum);
    return 0;
}
```

Sequence to initialize and print, iteration with a sentinel to repeat the reading, selection to decide whether to add.

### Nested loops: the multiplication table

In a nested loop, the inner loop runs **completely** on each pass of the outer one. The classic example is a table: the outer loop walks the rows and the inner one, the columns.

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= 5; j++) {
            printf("%d\t", i * j);
        }
        printf("\n");
    }
    return 0;
}
```

- the inner `printf("%d\t", ...)` writes one cell and a tab
- the `printf("\n")` is **after** the inner loop and **inside** the outer one: it ends each row
- the inner body runs 5 × 5 = 25 times

If the inner loop makes `m` passes for each of the `n` outer passes, the inner body runs `n × m` times. With large sizes that product grows fast: it is worth computing it before nesting.

### When the inner loop depends on the outer one

The limit of the inner loop can depend on the outer variable:

```c
#include <stdio.h>

int main(void) {
    for (int row = 1; row <= 4; row++) {
        for (int col = 1; col <= row; col++) {
            printf("%d", col);
        }
        printf("\n");
    }
    return 0;
}
```

Output:

```text
1
12
123
1234
```

On row 1 the inner loop makes 1 pass; on row 4, 4 passes: 1 + 2 + 3 + 4 = 10 inner passes in total.

## Tracing nested loops

To follow a nested loop, the trace has one row per **inner** pass, and the outer variable only changes when the inner loop has finished. For the table reduced to `i` from 1 to 2 and `j` from 1 to 3:

| `i` | `j` | `i * j` | Row output so far |
| --- | --- | --- | --- |
| 1 | 1 | 1 | `1` |
| 1 | 2 | 2 | `1 2` |
| 1 | 3 | 3 | `1 2 3`, newline |
| 2 | 1 | 2 | `2` |
| 2 | 2 | 4 | `2 4` |
| 2 | 3 | 6 | `2 4 6`, newline |

When `i` changes, `j` **starts again from 1**: the initialization of the inner `for` runs again on every outer pass.

## Criteria for choosing a control structure

| Situation | Structure |
| --- | --- |
| Two paths depending on a condition | `if` / `else` |
| Several paths depending on ranges or different conditions | `if` / `else if` |
| Choosing a **value** between two | ternary operator `? :` |
| Several paths depending on the exact value of an integer | `switch` |
| Repeating a known number of times or walking a range | `for` |
| Repeating while something holds, possibly zero times (sentinel, end of input) | `while` |
| Repeating at least once (input validation, menu) | `do-while` |
| Ending a search as soon as the result is found | `break` inside the loop |

When two structures work, choose the one that makes the intent **most visible**: a `for` that shows the whole range in its header, a `while` whose condition says exactly when to stop.

## When to nest and when it becomes a problem

Nesting is reasonable when it expresses a real dependency: "for each row, for each column" or "on each pass, decide something".

It becomes a problem when there are so many levels that it is no longer clear what controls what. Warning signs:

- more than three levels of braces
- a `break` where it is not clear which loop it leaves
- having to scroll to find the end of a block

The solution is to extract parts with their own name. In lesson 15 you will learn to write **functions**, the tool for that: the inner loop of the primes example will become an `is_prime` function.

### Leaving two loops at once

`break` only leaves the innermost loop. To end the outer one too, use a control variable in its condition:

```c
#include <stdio.h>

int main(void) {
    int target = 42;
    bool found = false;
    int row = 0;
    int col = 0;

    for (int i = 1; i <= 9 && !found; i++) {
        for (int j = 1; j <= 9; j++) {
            if (i * j == target) {
                found = true;
                row = i;
                col = j;
                break;              // leaves the j loop
            }
        }
    }                               // !found stops the i loop

    if (found) {
        printf("%d = %d x %d\n", target, row, col);
    } else {
        printf("%d is not in the 1 to 9 table\n", target);
    }
    return 0;
}
```

It prints `42 = 6 x 7`.

## Checklist of loop mistakes

Before calling a loop finished, go through this list:

1. **Initialization:** does every counter and accumulator have an initial value? Is it in the right place? An accumulator that must start from zero **on every row** goes inside the outer loop, not before it.
2. **Condition:** `<` or `<=`? Trace the first and the last pass.
3. **Update:** does it exist, and does it bring the condition closer to false? Does it go in the right direction?
4. **`;` after the header:** `while (...);` and `for (...);` have an empty body.
5. **`continue` in `while` or `do-while`:** does it skip the update?
6. **Counter changed inside a `for`:** the header should describe the whole walk.
7. **Same variable in two nested loops:** if the inner loop also uses `i`, it breaks the outer one. Use distinct names (`row`, `col`).
8. **Unsigned counters going down:** with `size_t`, `i >= 0` is always true.
9. **Zero passes:** if the loop may not run, what happens afterwards? (for example, dividing by a count that is 0).
10. **`break` in nested loops or in `switch`:** it only leaves the innermost structure.
11. **Overflow:** can the accumulator exceed the maximum of its type? Validate the input or use a wider type.
12. **Input:** is the value of `scanf` checked? If not, a letter can leave the loop reading the same thing forever.

## Good practices

- think about the scheme and write the pseudocode before the code
- indent every level and always use braces, even when the block has a single statement
- give nested loop variables names that say what they walk
- keep each block with a clear purpose
- compute how many times the innermost body runs

## Summary

- schematic programming organizes solutions with sequence, selection and iteration
- **stepwise refinement** goes from a problem statement to pseudocode and from there to C, from the general to the specific
- in a nested loop, the inner loop runs completely on each outer pass and restarts every time
- each control structure has its typical situation; choose the one that keeps the intent visible
- `break` only leaves the innermost loop; to leave several, use a control variable
- the checklist catches most loop mistakes before running the program

## Practice exercises

### Exercise 1: trace a nested loop

Without running it, write the output and how many times `total++` runs.

```c
#include <stdio.h>

int main(void) {
    int total = 0;

    for (int i = 3; i >= 1; i--) {
        for (int j = 0; j < i; j++) {
            printf("*");
            total++;
        }
        printf("\n");
    }

    printf("%d\n", total);
    return 0;
}
```

<details><summary>Show solution</summary>

```text
***
**
*
6
```

With `i = 3`, `j` takes 0, 1 and 2 (three asterisks); with `i = 2`, two; with `i = 1`, one. `total++` runs 3 + 2 + 1 = 6 times.

</details>

### Exercise 2: average per student (stepwise refinement)

Problem statement: read the number of students (1 to 50); for each one, read 3 integer grades and print their average with one decimal. First write the level 1 and level 2 pseudocode, then the program. If a read fails, print `Invalid input` and end with `return 1;`.

<details><summary>Show solution</summary>

Level 1:

```text
read the number of students
for each student
    read their 3 grades and print the average
```

Level 2:

```text
read count; if it fails or is not between 1 and 50, stop
for s from 1 to count
    sum ← 0
    for k from 1 to 3
        read grade; if it fails, stop
        sum ← sum + grade
    print sum / 3 with one decimal
```

```c
#include <stdio.h>

int main(void) {
    int count;

    printf("Number of students (1 to 50): ");
    if (scanf("%d", &count) != 1 || count < 1 || count > 50) {
        printf("Invalid input\n");
        return 1;
    }

    for (int s = 1; s <= count; s++) {
        int sum = 0;                          // restarts for each student

        for (int k = 1; k <= 3; k++) {
            int grade;
            printf("Student %d, grade %d: ", s, k);
            if (scanf("%d", &grade) != 1) {
                printf("Invalid input\n");
                return 1;
            }
            sum += grade;
        }

        printf("Average of student %d: %.1f\n", s, sum / 3.0);
    }
    return 0;
}
```

`sum / 3.0` divides as `double`; `sum / 3` would be integer division (lesson 7).

</details>

### Exercise 3: find the bug

This program should print the sum of each row of the 1 to 3 table (`Row 1: 6`, `Row 2: 12`, `Row 3: 18`), but it prints 6, 18 and 36. Which checklist item fails? Fix it.

```c
#include <stdio.h>

int main(void) {
    int sum = 0;

    for (int row = 1; row <= 3; row++) {
        for (int col = 1; col <= 3; col++) {
            sum += row * col;
        }
        printf("Row %d: %d\n", row, sum);
    }
    return 0;
}
```

<details><summary>Show solution</summary>

Item 1 fails (initialization in the right place): `sum` is initialized only once, before the outer loop, so it carries the values of the previous rows. It must restart at the beginning of each row:

```c
#include <stdio.h>

int main(void) {
    for (int row = 1; row <= 3; row++) {
        int sum = 0;
        for (int col = 1; col <= 3; col++) {
            sum += row * col;
        }
        printf("Row %d: %d\n", row, sum);
    }
    return 0;
}
```

</details>

### Exercise 4: choose the structure

For each part, say which control structure you would use and why.

1. Ask for a numeric password until it is correct.
2. Print the numbers from 100 to 1 in steps of 10.
3. Add up the prices a cashier enters until they type `0`.
4. Print the name of the day from a number from 1 to 7.
5. Draw a rectangle of `height` rows by `width` columns of `#`.

<details><summary>Show solution</summary>

1. `do-while`: it must be asked **at least once** and repeated while it is wrong.
2. `for`: known range with a fixed step, `for (int i = 100; i >= 1; i -= 10)`.
3. `while` with a **sentinel** and a priming read: there may be zero prices.
4. `switch`: several paths depending on the exact value of an integer.
5. Two nested `for` loops: the outer one walks the rows and the inner one the columns; the newline goes after the inner loop.

</details>
