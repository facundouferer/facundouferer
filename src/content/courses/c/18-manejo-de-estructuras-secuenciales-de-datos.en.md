---
title: 'Sequential Data Structures'
course: 'c'
slug: 'manejo-de-estructuras-secuenciales-de-datos'
order: 18
lang: 'en'
published: true
---

Until now every piece of data in your programs lived in its own variable. That works with three or four values, but a real program handles lists of grades, a month of temperatures or the characters of a name. This lesson is a bridge: it explains **why** we need structures that keep many values in order and **which questions** to ask about them before writing the first line. The next lesson teaches the first of those structures in C, the **array**.

## Objectives

- Explain why separate variables do not scale when there are many values of the same type.
- Define a sequential data structure.
- Tell **sequential access** from **direct access** (also called random access).
- Tell **static size** from **dynamic size**.
- Place in the course the sequential structures you will study and when each one fits.

**Prerequisites:** `sentencia-for` and `sentencia-while` (loops), `modularizacion-subprogramas-y-funciones` (functions).

## The problem: separate variables

Suppose you want the average of five grades. With what you know so far, you would write something like this:

```c
#include <stdio.h>

int main(void) {
    int grade1 = 8;
    int grade2 = 6;
    int grade3 = 10;
    int grade4 = 7;
    int grade5 = 9;

    double average = (grade1 + grade2 + grade3 + grade4 + grade5) / 5.0;
    printf("Average: %.2f\n", average);
    return 0;
}
```

The program is correct, but it has a serious limit:

- **It does not scale.** With 30 grades you need 30 variables and a sum of 30 terms.
- **It cannot be traversed.** A `for` loop cannot "move" from `grade1` to `grade2`: they are different names, not positions of something shared.
- **The count is fixed in the code.** If the class has 31 students, the program has to be rewritten.

What is missing is a way to say "these five grades are **one ordered collection**, and I want the grade at position 3".

## What is a sequential data structure?

A **sequential data structure** stores several elements **one after another**, in order. Each element has a place in the sequence: there is a first one, a second one, and so on up to the last.

```text
position:   0    1    2    3    4
grade:      8    6   10    7    9
```

Two ideas change the way you program:

1. The collection has **a single name** (for example, `grades`).
2. Each element is identified by its **position**, which is a number. Because it is a number, a loop can generate it: `0, 1, 2, 3, 4`.

In C positions start at `0`. The next lesson explains why and how to write it; for now the idea is enough.

## Sequential access and direct access

Not every sequence lets you reach an element the same way.

**Sequential access.** To reach element 4 you have to go through 0, 1, 2 and 3. It is like a music tape or a line of people holding hands: you only know the first one and each one leads you to the next.

**Direct (or random) access.** You can go to element 4 without looking at the previous ones, because you know exactly where it is. It is like a row of numbered lockers: you go straight to locker 4.

| | Direct access | Sequential access |
| --- | --- | --- |
| Reaching element `k` | one step, whatever `k` is | `k` steps from the start |
| Example in C | array (lessons 19 and 20) | linked list (lesson 30) |
| Inserting in the middle | the following elements must be shifted | a new element is "hooked" in |

"Random" does not mean "by chance": it means you can ask for **any** position in any order and reach it at the same cost.

## Static size and dynamic size

The other key question is **how many elements fit** and who decides it.

**Static size.** The maximum number of elements, the **capacity**, is fixed when the program is written and does not change while it runs. If you reserve room for 30 grades and 31 arrive, grade 31 has nowhere to go. The arrays of this module work this way.

**Dynamic size.** The structure asks for more space while the program runs, as data arrives. That needs memory requested from the system at run time, which you will see in the `memoria-dinamica` lesson (28) and which the lists, stacks and queues of module 7 use.

With a static size there are two different numbers you should never mix up:

- the **capacity**: how many elements fit at most;
- the **used count**: how many elements hold valid data right now.

A sign-up list can have capacity 40 and a used count of 27. The examples of lessons 19 and 20 always keep those two numbers apart.

## Typical operations on a sequence

Whatever the structure, almost every program performs the same operations:

- **traverse**: visit the elements one by one (to print, add or count them);
- **search**: find out whether a value is there and at which position;
- **insert** and **delete**: add or remove an element;
- **update**: change the value at a position;
- **sort**: arrange the elements from smallest to largest (or by another criterion).

What changes from one structure to another is **how much** each operation **costs**. Inserting at the front of an array forces every element to shift; in a linked list it is immediate. Reading element 500 of an array is immediate; in a list you have to walk through 500 nodes. Choosing the right structure means choosing which operations you want to be cheap.

## Map of the module

| Structure | Access | Size | Where it is studied |
| --- | --- | --- | --- |
| Array | direct | static | lessons 19 and 20 |
| Character string (a `char` array with an end mark) | direct | static | lesson 21 |
| Searching and sorting arrays | direct | static | lessons 23 and 24 |
| Linked list, stack, queue | sequential | dynamic | lessons 30 to 32 |

## Summary

- Separate variables do not scale and cannot be traversed with a loop.
- A sequential structure keeps elements in order under a single name, and each element is identified by its position.
- With **direct access** any position is reached in one step; with **sequential access** you go through the previous ones.
- With **static size** the capacity is fixed when the program is written; with **dynamic size** it grows at run time (lesson 28).
- Capacity and used count are different numbers.

## Practice exercises

### Exercise 1: direct or sequential?

For each situation, say whether access is direct or sequential, and why:

1. Choosing song 7 of a playlist on your phone.
2. Reaching car 7 of a train by walking from the engine.
3. Opening locker 7 in a changing room.
4. Listening to track 7 of a cassette with no fast-forward button.

<details><summary>Show solution</summary>

1. **Direct**: the player jumps to position 7 without playing the previous ones.
2. **Sequential**: you have to walk through cars 1 to 6.
3. **Direct**: the locker number tells you where it is.
4. **Sequential**: the tape has to go through tracks 1 to 6.

</details>

### Exercise 2: static or dynamic?

Say which size fits each case and which capacity you would choose if it is static:

1. The daily maximum temperatures of one week.
2. The messages of a chat where the user can keep writing with no limit.
3. The grades of a class that never exceeds 40 students.

<details><summary>Show solution</summary>

1. **Static**, capacity 7: a week always has 7 days.
2. **Dynamic**: there is no maximum known when the program is written; the structure has to grow at run time.
3. **Static**, capacity 40, with a used count that can be lower (for example, 27 students enrolled).

</details>

### Exercise 3: capacity and used count

A program reserves room for 10 orders. It has already recorded 6. Answer:

1. What are the capacity and the used count?
2. How many more orders can be recorded?
3. If an order is deleted, which number changes?
4. What should the program do if an order arrives and the used count already equals the capacity?

<details><summary>Show solution</summary>

1. Capacity 10, used count 6.
2. Four more (10 − 6).
3. Only the used count (it becomes 5); the capacity of a static structure does not change.
4. Reject the order and report it (for example, with an error message). Writing past the capacity is not an option: in C that is a serious bug you will see in lesson 19.

</details>

### Exercise 4: choosing a structure

An app shows a ranking of 100 players and the user often asks for "the player in place 57". Players are almost never added in the middle. Does direct or sequential access fit better? Justify it with the cost of the most frequent operation.

<details><summary>Show solution</summary>

Direct access (an array). The frequent operation is reading a specific position: with direct access it costs one step; with sequential access it would cost 57 steps. The array's drawback (inserting in the middle forces elements to shift) barely matters, because that operation is rare.

</details>
