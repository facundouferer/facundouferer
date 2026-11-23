---
title: 'Operators'
course: 'c'
slug: 'operadores'
description: 'Apply arithmetic, relational and logical operators, understand precedence and short-circuit evaluation in && and ||, and avoid undefined behavior.'
order: 7
lang: 'en'
published: true
---

You already know how to store data, what its type is and how to display it. The next step is to **operate** on it: compute, compare and combine conditions. That is what **operators** are for.

## Objectives

By the end of this lesson you will be able to:

- use the arithmetic operators, including `%`, and predict the sign of its result
- compare values with the relational operators
- combine conditions with `&&`, `||` and `!`, and take advantage of **short-circuit** evaluation
- use compound assignment and the prefix and postfix increment and decrement operators
- read expressions by applying precedence and associativity
- tell apart defined, unspecified and **undefined behavior**
- recognize the bitwise operators

**Prerequisites:** lessons 1 to 6, especially *Data types* (integer division, conversions, overflow) and *Input and output* (`printf`).

## Expressions

An **expression** is a combination of values, variables and operators that produces a result: `5 + 3`, `age + 1`, `grade >= 6`. An **operator** is the symbol that names the operation; the values it acts on are called **operands**.

## Arithmetic operators

| Operator | Operation | Example | Result |
| --- | --- | --- | --- |
| `+` | addition | `10 + 5` | `15` |
| `-` | subtraction | `10 - 5` | `5` |
| `*` | multiplication | `4 * 3` | `12` |
| `/` | division | `10 / 4` | `2` |
| `%` | remainder of integer division | `10 % 4` | `2` |

### Integer division

If both operands are integers, `/` performs an **integer division**: it discards the fractional part, truncating toward zero. `7 / 2` is `3` and `-7 / 2` is `-3`. If at least one operand is floating, the division keeps the decimals: `7 / 2.0` is `3.5`. You already saw this in lesson 5 with `(double)sum / count`.

### The remainder `%` and its sign

`%` only works with integers and returns what is left over from the integer division. C guarantees that this always holds:

```text
(a / b) * b + a % b == a
```

Since division truncates toward zero, **the remainder has the sign of the dividend** (the left operand):

| Expression | Result |
| --- | --- |
| `7 % 3` | `1` |
| `-7 % 3` | `-1` |
| `7 % -3` | `1` |
| `-7 % -3` | `-1` |

Typical use: `number % 2` is `0` if the number is even. But careful: for a negative odd number it is `-1`, not `1`. To check whether a number is odd, compare `number % 2 != 0`.

> **Portability:** before C99, the rounding of `/` with negative operands depended on the compiler. Since C99, and of course in C23, integer division always truncates toward zero.

Dividing an integer by zero (`x / 0` or `x % 0`) is undefined behavior; you will see below what that means.

## Relational operators

They compare two values and give `1` if the comparison is true or `0` if it is false. The result is an `int`.

| Operator | Meaning |
| --- | --- |
| `==` | equal to |
| `!=` | not equal to |
| `<` | less than |
| `>` | greater than |
| `<=` | less than or equal to |
| `>=` | greater than or equal to |

```c
#include <stdio.h>

int main(void) {
    int grade = 7;

    printf("%d\n", grade >= 6);   // 1
    printf("%d\n", grade == 10);  // 0
    return 0;
}
```

Do not confuse `=` (assigns) with `==` (compares). `grade = 10` stores 10 in `grade`; `grade == 10` asks whether it is 10.

## Logical operators

They combine conditions. They treat any nonzero value as true and zero as false; their result is `1` or `0`.

| Operator | Meaning | True when |
| --- | --- | --- |
| `&&` | "and" | both operands are true |
| `\|\|` | "or" | at least one is true |
| `!` | "not" | the operand is false |

```c
age >= 18 && age <= 65        // between 18 and 65 inclusive
letter == 'a' || letter == 'A' // it is the letter a, upper or lower case
!(age >= 18)                  // not an adult
```

### Short-circuit evaluation

`&&` and `||` evaluate **the left operand first** and only evaluate the right one if needed:

- in `a && b`, if `a` is false, the result is already false: **`b` is not evaluated**
- in `a || b`, if `a` is true, the result is already true: **`b` is not evaluated**

This is called **short-circuit** evaluation, and it is a guarantee of the language, not an optional optimization. Its most important practical use is **guarding a dangerous operation** with a previous condition:

```c
#include <stdio.h>

int main(void) {
    int total = 50;
    int people = 0;

    // If people is 0, the division never runs.
    int isExpensive = people != 0 && total / people > 20;

    printf("More than 20 per person? %d\n", isExpensive);
    return 0;
}
```

Since `people != 0` is false, `&&` stops and `total / people` is not computed: no division by zero. **Order matters**: `total / people > 20 && people != 0` would divide first.

## Assignment

`=` stores the value on the right in the variable on the left. Read it as "store into", not "is equal to":

```c
int age = 18;
age = age + 1;   // takes the current value, adds 1 and stores it: 19
```

In C assignment is also an expression: its value is the assigned value. That is why `a = b = 0;` works (it stores 0 in `b` and then in `a`).

### Compound assignment

| Short form | Equivalent to |
| --- | --- |
| `x += 5` | `x = x + 5` |
| `x -= 3` | `x = x - 3` |
| `x *= 2` | `x = x * 2` |
| `x /= 4` | `x = x / 4` |
| `x %= 3` | `x = x % 3` |

## Increment and decrement

`++` adds 1 to a variable and `--` subtracts 1. Each has two forms:

- **prefix** (`++x`): increments first, and the expression has the **new** value
- **postfix** (`x++`): the expression has the **old** value, and the variable is incremented anyway

```c
#include <stdio.h>

int main(void) {
    int a = 5;
    int b = 5;

    int x = ++a;   // a becomes 6, x gets 6
    int y = b++;   // y gets 5, b becomes 6

    printf("a=%d x=%d\n", a, x);
    printf("b=%d y=%d\n", b, y);
    return 0;
}
```

Output:

```text
a=6 x=6
b=6 y=5
```

If you only want to increment (`counter++;` on a line by itself), both forms do the same. The difference shows up when you use the value of the expression.

## Precedence and associativity

When an expression has several operators, **precedence** decides which one groups first, as in math: `2 + 3 * 4` is `2 + (3 * 4)`, which is `14`.

If two operators have the same precedence, **associativity** decides: most group left to right (`10 - 4 - 3` is `(10 - 4) - 3`, which is `3`), but unary operators and assignment group right to left (`a = b = 0` is `a = (b = 0)`).

From highest to lowest precedence, the ones you will use:

| Level | Operators | Associativity |
| --- | --- | --- |
| 1 | `x++` `x--` (postfix) | left to right |
| 2 | `++x` `--x` `!` `~` unary `-`, cast `(type)`, `sizeof` | right to left |
| 3 | `*` `/` `%` | left to right |
| 4 | `+` `-` | left to right |
| 5 | `<<` `>>` | left to right |
| 6 | `<` `<=` `>` `>=` | left to right |
| 7 | `==` `!=` | left to right |
| 8 | `&` (bitwise) | left to right |
| 9 | `^` | left to right |
| 10 | `\|` (bitwise) | left to right |
| 11 | `&&` | left to right |
| 12 | `\|\|` | left to right |
| 13 | `?:` (lesson 9) | right to left |
| 14 | `=` `+=` `-=` and the other assignments | right to left |

You do not need to memorize all of it. Remember three things: arithmetic comes before comparisons, comparisons before `&&` and `||`, and assignment comes almost last. **When in doubt, use parentheses**: `(2 + 3) * 4` is `20` and reads better too.

## Order of evaluation: what precedence does not say

Precedence says **how operands are grouped**, not **in which order they are computed**. In `a * b + c * d`, precedence ensures the two products are added, but the standard does not say which product is computed first. For most operators, the order of evaluation of the operands is **unspecified**: each compiler may choose.

The exceptions guarantee left to right: `&&`, `||` (that is why short-circuit exists), `?:` and the comma.

As long as the operands have no side effects, the order does not change the result. The problem appears when the same expression **modifies** a variable and also uses it.

## Defined, unspecified and undefined

The C standard classifies what a program does into four categories:

- **Defined:** the standard says exactly what happens. `7 / 2` is `3` everywhere.
- **Implementation-defined:** each compiler chooses, but must document it. The size of `int`, or whether `char` is signed.
- **Unspecified:** there are several valid options and the compiler does not have to say which one it takes. The order of evaluation of the operands of `+`.
- **Undefined behavior:** the standard **imposes no requirements at all**. The program may give an absurd result, work today and fail tomorrow, or behave differently with another optimization level. A program with undefined behavior is an incorrect program, even if it seems to work.

Examples of undefined behavior you can already write:

<!-- c-check: skip -->
```c
#include <stdio.h>
#include <limits.h>

int main(void) {
    int i = 1;
    i = i++ + 1;          // modifies i twice with no defined order

    int big = INT_MAX;
    big = big + 1;        // overflow of a signed integer

    int zero = 0;
    int r = 10 / zero;    // integer division by zero

    printf("%d %d %d\n", i, big, r);
    return 0;
}
```

- `i = i++ + 1;` modifies `i` twice (with `++` and with `=`) without the standard ordering those modifications. With `-Wall`, Clang warns: `multiple unsequenced modifications to 'i'`. The correct version is simply `i = i + 2;` or `i += 2;`.
- `INT_MAX + 1` overflows an `int`. Unlike `unsigned` values, it does not "wrap around" in a guaranteed way.
- Dividing by zero may terminate the program with an error.

The practical rule: **do not modify a variable more than once in the same expression, and do not read it in the same expression where you modify it** (unless `&&`, `||`, `?:` or the comma sits in between). In the *Debugging and sanitizers* lesson you will see tools that catch these errors at run time.

## Bitwise operators

They work on the individual bits of an integer. Use them with `unsigned` types:

| Operator | Operation | Example with `a = 12u` (1100) and `b = 10u` (1010) |
| --- | --- | --- |
| `&` | bitwise AND | `a & b` is `8` (1000) |
| `\|` | bitwise OR | `a \| b` is `14` (1110) |
| `^` | exclusive OR | `a ^ b` is `6` (0110) |
| `~` | complement | flips every bit |
| `<<` | left shift | `1u << 3` is `8` |
| `>>` | right shift | `a >> 2` is `3` |

A typical use is testing a bit: `number & 1u` is `1` if `number` is odd.

Do not confuse `&` with `&&` or `|` with `||`: the first ones work bit by bit and do **not** short-circuit; the second ones combine conditions.

## Common mistakes

1. **Confusing `=` with `==`.**
2. **Expecting decimals from an integer division.** `7 / 2` is `3`.
3. **Assuming `%` is always positive.** `-7 % 3` is `-1`.
4. **Putting the guard after the operation.** `a / b > 2 && b != 0` divides before checking.
5. **Modifying a variable twice in one expression.** `i = i++ + 1;` is undefined behavior.
6. **Relying on precedence instead of using parentheses.** `x & 1 == 0` is `x & (1 == 0)`.

## Summary

- `/` between integers truncates toward zero; `%` gives the remainder with the sign of the dividend
- relational and logical operators give `1` or `0`
- `&&` and `||` evaluate left to right with **short-circuit**: they can guard operations
- `++x` has the new value; `x++` has the old value
- precedence and associativity decide how an expression is grouped; parentheses make it clear
- the order of evaluation of operands is almost never specified
- **undefined behavior** (such as `i = i++ + 1;` or overflowing an `int`) makes the program incorrect

## Practice exercises

### Exercise 1: predict the output

```c
#include <stdio.h>

int main(void) {
    int a = 3;
    int b = a++ * 2;
    int c = --a + 10 % 4;
    int d = -9 / 2;
    int e = -9 % 2;

    printf("%d %d %d %d %d\n", a, b, c, d, e);
    return 0;
}
```

<details><summary>Show solution</summary>

It prints `3 6 5 -4 -1`.

- `b = a++ * 2`: uses the old value (3), `b` is `6`, and `a` becomes 4.
- `c = --a + 10 % 4`: `a` goes back to 3; `10 % 4` is `2` (`%` goes before `+`); `c` is `5`.
- `-9 / 2` truncates toward zero: `-4`.
- `-9 % 2` has the sign of the dividend: `-1`. Check: `(-4) * 2 + (-1) == -9`.

</details>

### Exercise 2: find the bug

This line should tell whether the average per person exceeds 100 without ever dividing by zero, but it fails when `people` is 0. Fix it.

```c
int exceeds = total / people > 100 && people > 0;
```

<details><summary>Show solution</summary>

`&&` evaluates left to right, so the division happens before `people` is checked. Swap the order so the short-circuit guards the division:

```c
#include <stdio.h>

int main(void) {
    int total = 500;
    int people = 0;

    int exceeds = people > 0 && total / people > 100;

    printf("%d\n", exceeds);
    return 0;
}
```

If `people` is 0, `people > 0` is false and `total / people` is not evaluated.

</details>

### Exercise 3: find the precedence bug

The goal is to print `1` when `number` is even, using its least significant bit. Why does this version always print `0`?

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    unsigned int number = 8u;
    printf("%d\n", number & 1u == 0u);
    return 0;
}
```

<details><summary>Show solution</summary>

`==` has higher precedence than `&`, so the expression is `number & (1u == 0u)`, that is `number & 0`, which is always `0`. The compiler even warns with `-Wall`. Fix with parentheses:

```c
#include <stdio.h>

int main(void) {
    unsigned int number = 8u;
    printf("%d\n", (number & 1u) == 0u);
    return 0;
}
```

</details>

### Exercise 4: defined or undefined?

Classify each line (assume `int i = 2;` before each one) as defined or undefined behavior, and give the final value of `i` when it is defined: (a) `i = i + 1;` (b) `i++;` (c) `i = i++;` (d) `i += i * 3;`

<details><summary>Show solution</summary>

- (a) Defined: `i` is `3`.
- (b) Defined: `i` is `3`.
- (c) Undefined: `i` is modified twice (with `++` and with `=`) with no defined order.
- (d) Defined: `i` is read in the expression `i * 3` and modified only once with `+=`; `i` is `2 + 6 = 8`.

</details>
