---
title: 'Recursion'
course: 'c'
slug: 'recursividad'
description: 'Solve problems by splitting them into smaller instances of the same kind with a clear base case, tracing each activation frame on the call stack.'
order: 17
lang: 'en'
published: true
---

Recursion looks like "magic" the first time you see it, but it stops being magic as soon as you look at what happens in memory while it runs. In its simplest definition:

> A **recursive function** is a function that calls itself.

It works because each call solves a **smaller** version of the same problem, until it reaches one so small that it is answered without calling itself again.

## Objectives

- Recognize the **base case** and the **recursive case** of a recursive function.
- Follow the **call stack** of a recursive function step by step.
- Write recursive functions with scalar data: factorial, power, digit sum, greatest common divisor and Fibonacci.
- Compare recursion and iteration and estimate the cost of a recursive solution.
- Explain the depth limit and stack overflow, and decide when recursion is not a good idea.

**Prerequisites:** `modularizacion-subprogramas-y-funciones` (functions, `return`, functions calling functions) and `variables-parametros-y-pasaje` (local variables, automatic duration, pass by value).

## An analogy: boxes inside boxes

You get a box as a present. Inside it there is a smaller box, and inside that one another, and so on. One of them holds the key. One way to look for it:

```text
find_key(box):
    open the box
    if the key is inside: stop                  (base case)
    if there is another box inside: find_key(that box)   (recursive case)
```

Every time you open a box you do **exactly the same** with a smaller problem. And you do not need to write down which box you were in: when you are done with the inner box, you go back to the outer one. In a program, the call stack takes care of that.

## The two parts of every recursive function

1. **Base case**: a condition where the function answers **without calling itself**. It is the exit.
2. **Recursive case**: the function calls itself with an argument **closer to the base case**.

Both are mandatory. Without a base case, the function calls itself forever. With a base case but without getting closer to it (for example, always calling itself with the same value), it never ends either.

### First example: factorial

The factorial of an integer `n >= 0` is the product of all integers from 1 to `n`, and by definition `0! = 1`. For example, `4! = 4 * 3 * 2 * 1 = 24`.

The definition has a recursive shape: `n! = n * (n - 1)!`. In C:

```c
#include <stdio.h>

// Requires n >= 0. With long long, the result is correct up to n = 20.
long long factorial(int n) {
    if (n <= 1) {
        return 1;                     // base case: 0! = 1! = 1
    }
    return n * factorial(n - 1);      // recursive case: n - 1 gets closer to 1
}

int main(void) {
    for (int i = 0; i <= 5; i++) {
        printf("%d! = %lld\n", i, factorial(i));
    }
    return 0;
}
```

Notice the comment: `21!` no longer fits in a `long long`, and overflowing a signed integer is undefined behavior. Documenting the valid range is part of writing the function well.

## The call stack

To understand recursion you need to understand how **any** function call runs.

Every time a function is called, the program reserves a **frame** (*stack frame*) with its parameters, its local variables and the point it must return to when it finishes. Frames are stacked like plates: the frame of the running function is always on top. That structure is the **call stack**.

- When `A` calls `B`, `B`'s frame is pushed on top of `A`'s, and `A` is paused.
- Only the function of the top frame runs.
- When `B` executes `return`, its frame is popped and `A` continues exactly where it left off, with the returned value.

This connects with the previous lesson: local variables have automatic duration because they live in the frame, and they disappear when the frame is popped. In a recursive function, **each call has its own frame** and its own copy of `n`: there is not a single `n` that keeps changing.

### `factorial(4)` step by step

**Going down (calls are pushed).** Each call waits for the result of the next one:

| Step | Running call | Base case? | Pending | Stack (top on the left) |
|---|---|---|---|---|
| 1 | `factorial(4)` | no | `4 * factorial(3)` | `f(4)` |
| 2 | `factorial(3)` | no | `3 * factorial(2)` | `f(3)` · `f(4)` |
| 3 | `factorial(2)` | no | `2 * factorial(1)` | `f(2)` · `f(3)` · `f(4)` |
| 4 | `factorial(1)` | **yes** | nothing: returns `1` | `f(1)` · `f(2)` · `f(3)` · `f(4)` |

**Coming back up (frames are popped and pending multiplications are completed):**

| Step | Popped frame | Computation | Returns | Remaining stack |
|---|---|---|---|---|
| 5 | `f(1)` | — | `1` | `f(2)` · `f(3)` · `f(4)` |
| 6 | `f(2)` | `2 * 1` | `2` | `f(3)` · `f(4)` |
| 7 | `f(3)` | `3 * 2` | `6` | `f(4)` |
| 8 | `f(4)` | `4 * 6` | `24` | empty: back to `main` |

At the deepest point (step 4) there are **four `factorial` frames** on the stack at the same time, each with its own `n`. The recursion depth is the maximum number of simultaneous frames: for `factorial(n)` it is `n`.

The multiplications are not done on the way down: they are done **on the way back**, when each call receives the result of the one it called.

## More examples with numbers

### Power

`base` raised to `exponent` (with `exponent >= 0`): `b^0 = 1` and `b^e = b * b^(e-1)`.

```c
// Requires exponent >= 0.
long long power(long long base, int exponent) {
    if (exponent == 0) {
        return 1;                                   // base case
    }
    return base * power(base, exponent - 1);        // recursive case
}
```

### Digit sum

The sum of the digits of `1234` is `4` (the last digit, `1234 % 10`) plus the sum of the digits of `123` (`1234 / 10`).

```c
// Requires n >= 0.
int digit_sum(int n) {
    if (n < 10) {
        return n;                                   // base case: a single digit
    }
    return n % 10 + digit_sum(n / 10);              // recursive case
}
```

### Greatest common divisor (Euclid's algorithm)

The greatest common divisor of `a` and `b` equals that of `b` and `a % b`, and that of `a` and `0` is `a`. Each step shrinks the second number, so the base case is always reached.

```c
// Requires a >= 0 and b >= 0, not both zero.
int gcd(int a, int b) {
    if (b == 0) {
        return a;                                   // base case
    }
    return gcd(b, a % b);                           // recursive case
}
```

Trace of `gcd(48, 18)`: `gcd(48, 18)` → `gcd(18, 12)` → `gcd(12, 6)` → `gcd(6, 0)` → returns `6`. Here the recursive call is the last thing the function does (no operation is pending on the way back): this is called **tail recursion**.

### A program that uses them

```c
#include <stdio.h>

long long power(long long base, int exponent);
int digit_sum(int n);
int gcd(int a, int b);

int main(void) {
    printf("2^10 = %lld\n", power(2, 10));                  // 1024
    printf("digit sum of 1234 = %d\n", digit_sum(1234));    // 10
    printf("gcd(48, 18) = %d\n", gcd(48, 18));              // 6
    return 0;
}

long long power(long long base, int exponent) {
    if (exponent == 0) {
        return 1;
    }
    return base * power(base, exponent - 1);
}

int digit_sum(int n) {
    if (n < 10) {
        return n;
    }
    return n % 10 + digit_sum(n / 10);
}

int gcd(int a, int b) {
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}
```

## Fibonacci and exponential cost

The Fibonacci sequence starts with `0` and `1`, and each term is the sum of the previous two: `0, 1, 1, 2, 3, 5, 8, 13, ...`. The definition is naturally recursive:

```c
// Requires n >= 0.
long long fibonacci(int n) {
    if (n < 2) {
        return n;                                   // base cases: fib(0) = 0, fib(1) = 1
    }
    return fibonacci(n - 1) + fibonacci(n - 2);     // two recursive calls
}
```

It is correct, but very inefficient. Each call makes **two** calls, and they form a tree:

```text
fib(5)
├── fib(4)
│   ├── fib(3)
│   │   ├── fib(2)
│   │   │   ├── fib(1)
│   │   │   └── fib(0)
│   │   └── fib(1)
│   └── fib(2)
│       ├── fib(1)
│       └── fib(0)
└── fib(3)
    ├── fib(2)
    │   ├── fib(1)
    │   └── fib(0)
    └── fib(1)
```

That is 15 calls to compute `fib(5)`: `fib(3)` is computed twice, `fib(2)` three times, each time from scratch. The number of calls grows roughly like `1.6^n`: an **exponential cost**. `fibonacci(40)` makes more than 330 million calls for a result a loop gets in 40 steps:

```c
// Requires n >= 0. Same answer, n steps and constant memory.
long long fibonacci_iterative(int n) {
    long long previous = 0;
    long long current = 1;
    if (n == 0) {
        return 0;
    }
    for (int i = 1; i < n; i++) {
        long long next = previous + current;
        previous = current;
        current = next;
    }
    return current;
}
```

The lesson: a recursive definition does not mean the best implementation is recursive. Before choosing, think about **how many calls** your function makes.

## Depth limit and stack overflow

The call stack has a limited size. Every call that has not finished yet takes a frame. If the recursion is too deep (or infinite), the stack fills up and the program ends abruptly: a **stack overflow**. On Linux and macOS it usually shows up as `Segmentation fault`.

```c
// BUG: no base case. Each call pushes a new frame until the stack runs out.
void endless(int n) {
    endless(n + 1);
}
```

The typical causes are:

- **forgetting the base case**;
- **not getting closer to the base case**: for example, `factorial(-3)` with an `n == 1` condition never gets there (that is why our version uses `n <= 1` and documents that it requires `n >= 0`);
- **a legitimate but huge depth**: summing 1 to 10 million recursively needs 10 million simultaneous frames, even if the function is correct.

> **Portability:** the C standard fixes neither the stack size nor a maximum recursion depth. They depend on the system and its configuration: the main thread commonly gets about 8 MB on Linux and macOS and 1 MB on Windows. Nor does it guarantee that the compiler turns tail recursion into a loop; some do when optimizing (`-O2`), but a correct program must not rely on it.

## Recursion or iteration

Everything solved with recursion can be solved with loops, and vice versa. The question is which one expresses the problem better at a reasonable cost.

| Criterion | Recursion | Iteration (`for`, `while`) |
|---|---|---|
| Clarity | very clear when the problem is defined in terms of itself (branching structures, divide and conquer) | very clear for linear traversals and accumulations |
| Memory | one frame per pending call: grows with depth | constant: the same variables on every pass |
| Risk | stack overflow if the depth is large | no stack risk |
| Speed | every call has an extra cost (pushing and popping the frame) | no such cost |

### When not to use recursion

- When the problem is a simple **linear traversal** (counting, summing 1 to `n`, walking through a sequence): a loop is just as clear and uses no stack.
- When the **depth** can be large or depends on external data you do not control.
- When the recursion **recomputes** the same subproblems, like naive Fibonacci.

And when to use it: when the solution is naturally described as "solve the same thing on smaller parts" and the depth is small. You will see it in efficient sorting algorithms and in structures like binary trees, later in the course.

## Common mistakes

1. **Forgetting the base case** or writing it so it is never met.
2. **Not shrinking the problem** in the recursive call (calling with the same argument).
3. **Forgetting the `return`** before the recursive call in a function that returns a value: the call happens, but its result is lost.
4. **Not documenting the valid range** (for example, `n >= 0`) nor the overflow limit of the return type.
5. **Using recursion where a loop is simpler** or where the depth can be huge.

## Summary

- A recursive function calls itself with a smaller problem.
- It needs a **base case** (answers without calling itself) and a **recursive case** that gets closer to it.
- Each call has its own frame on the **call stack**, with its own parameters and local variables.
- Pending operations are resolved on the way back, as frames are popped.
- Depth is limited by the stack size; exceeding it causes a stack overflow.
- Naive recursive Fibonacci has exponential cost; a loop solves it in `n` steps.

## Practice exercises

### Exercise 1: counting digits

Write a recursive function `int count_digits(int n)` that returns how many digits an integer `n >= 0` has (`0` has one digit). Identify the base case and the recursive case.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

// Requires n >= 0.
int count_digits(int n) {
    if (n < 10) {
        return 1;                           // base case: a single digit
    }
    return 1 + count_digits(n / 10);        // recursive case: one digit fewer
}

int main(void) {
    printf("%d\n", count_digits(0));         // 1
    printf("%d\n", count_digits(7));         // 1
    printf("%d\n", count_digits(2026));      // 4
    return 0;
}
```

Each call drops the last digit with `n / 10`, so `n` gets closer to a single-digit number.

</details>

### Exercise 2: tracing the stack

Draw the call stack of `digit_sum(472)` (the function from the lesson): which calls are pushed, which is the base case and what each one returns on the way back.

<details><summary>Show solution</summary>

Going down:

| Call | Pending |
|---|---|
| `digit_sum(472)` | `2 + digit_sum(47)` |
| `digit_sum(47)` | `7 + digit_sum(4)` |
| `digit_sum(4)` | base case: returns `4` |

Coming back:

| Popped frame | Computation | Returns |
|---|---|---|
| `digit_sum(4)` | — | `4` |
| `digit_sum(47)` | `7 + 4` | `11` |
| `digit_sum(472)` | `2 + 11` | `13` |

The maximum depth is 3: one frame per digit.

</details>

### Exercise 3: recursive and iterative

Write two versions of a function that sums the integers from 1 to `n` (`n >= 0`): `recursive_sum` and `iterative_sum`. Check that they agree for several values and explain which one you would choose for `n = 10000000` and why.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

// Requires n >= 0.
long long recursive_sum(int n) {
    if (n == 0) {
        return 0;
    }
    return n + recursive_sum(n - 1);
}

// Requires n >= 0.
long long iterative_sum(int n) {
    long long sum = 0;
    for (int i = 1; i <= n; i++) {
        sum = sum + i;
    }
    return sum;
}

int main(void) {
    for (int n = 0; n <= 100; n = n + 25) {
        printf("n = %d: %lld %lld\n", n, recursive_sum(n), iterative_sum(n));
    }
    return 0;
}
```

For `n = 10000000` the iterative one is the right choice: the recursive one would need ten million simultaneous frames on the stack and would probably overflow it, while the iterative one always uses the same two variables.

</details>

### Exercise 4: find the bug

This function should compute `base` raised to `exponent`, but `bad_power(2, 3)` ends in a stack overflow. Why? Fix it.

```c
long long bad_power(long long base, int exponent) {
    if (exponent == 0) {
        return 1;
    }
    return base * bad_power(base, exponent);
}
```

<details><summary>Show solution</summary>

The recursive case calls itself with the **same** `exponent`, so it never gets closer to the base case: the recursion is infinite and each call pushes a frame until the stack runs out. The exponent must shrink:

```c
long long power(long long base, int exponent) {
    if (exponent == 0) {
        return 1;
    }
    return base * power(base, exponent - 1);
}
```

It is also worth documenting that it requires `exponent >= 0`: with a negative exponent it would never reach `0` either.

</details>
