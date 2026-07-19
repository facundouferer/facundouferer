---
title: 'Recursion'
course: 'c'
slug: 'recursividad'
order: 27
lang: 'en'
published: true
---

Recursion is one of those ideas that at first seem confusing or "magical," but when you manage to visualize what happens behind the scenes in the computer's memory, it changes the way you program forever.

In its simplest definition: **a recursive function is a function that calls itself.**

In this lesson you'll learn:
- What recursion is through a simple real-world analogy.
- The two mandatory rules of every recursive function (Base Case and Recursive Step).
- What the **Call Stack** is and how RAM works during recursion.
- What a **Stack Overflow** is (and how to prevent your program from crashing).
- Practical examples in C: Factorial and Fibonacci analyzed step by step.
- When to use recursion and when it's better to use a simple loop (`for` or `while`).

---

## The Nested Boxes Analogy

Imagine you're given a large wooden box. When you open it, you discover there's a smaller box inside. And inside that one, an even smaller one. You're told that somewhere among all the nested boxes is the **treasure key**.

How would you design an algorithm to find it? You have two ways to solve this:

### Option 1: The iterative approach (Loops)
1. Build a stack with the boxes you find.
2. While the stack is not empty:
   - Grab a box.
   - If there's another box inside, add it to your stack.
   - If the key is inside, you're done!

### Option 2: The recursive approach (Calling yourself)
1. Look at the contents of the current box.
2. If you find another box, **do the exact same thing** (call the search function on that new box).
3. If you find the key, you're done!

```text
Function FindKey(Box)
   1. Open Box
   2. If what's inside is the KEY -> Terminate! (Base Case)
   3. If what's inside is another BOX -> FindKey(NewBox) (Recursive Step)
```

In the recursive option, you don't need to keep a manual list of boxes left to check. The computer automatically remembers which box you were in.

---

## The Two Golden Rules of Recursion

If you write a function that calls itself without control, you'll freeze the computer. Every correct recursive function must follow two strict rules:

1. **The Base Case (The emergency exit)**: The condition that tells the function when to stop and start returning values. Without this, the function would call itself infinitely.
2. **The Recursive Step (Moving toward the exit)**: The call to the function itself, but **with a modified argument** that gets closer to the base case. If you always call the function with the same value, you'll never reach the stopping condition.

---

## What happens in memory? The Call Stack

To understand recursion, you need to understand the **Call Stack**.

When your program executes a function, the computer reserves a block of memory (called a *Stack Frame*) to store that function's local variables and parameters. This block is placed on top of a stack, like plates.

* If function `A` calls function `B`, `B`'s plate goes on top of `A`'s.
* The computer can only work with the plate that's **on top**.
* When function `B` finishes, its plate is removed and the computer returns to function `A` right where it left off.

### The memory trace with Factorial

The factorial of a number $N$ (written as $N!$) is the product of all numbers from $1$ to $N$. For example, $3! = 3 \times 2 \times 1 = 6$.

Let's see the implementation in C:

```c
int factorial(int n) {
    // 1. Base Case: If n is 1, no further calculation needed
    if (n == 1) {
        return 1;
    } 
    // 2. Recursive Step: n is greater than 1, multiply n by factorial of (n-1)
    else {
        return n * factorial(n - 1);
    }
}
```

If we call `factorial(3)`, look at how the functions stack up in the Call Stack:

```text
Step 1: We call factorial(3)
[ factorial(3) -> waiting for factorial(2) to respond ]  <-- Stack Top

Step 2: factorial(3) calls factorial(2)
[ factorial(2) -> waiting for factorial(1) to respond ]  <-- Stack Top
[ factorial(3) -> waiting... ]

Step 3: factorial(2) calls factorial(1)
[ factorial(1) -> Base case! Returns 1 ]                 <-- Stack Top
[ factorial(2) -> waiting... ]
[ factorial(3) -> waiting... ]
```

Once we reach the base case (`factorial(1)` returns `1`), the stack starts **unwinding** and resolving pending operations from top to bottom:

```text
Step 4: factorial(1) returns 1. factorial(2) calculates: 2 * 1 = 2
[ factorial(2) -> returns 2 ]                            <-- Stack Top
[ factorial(3) -> waiting... ]

Step 5: factorial(2) returns 2. factorial(3) calculates: 3 * 2 = 6
[ factorial(3) -> returns 6 ]                            <-- Stack Top

Final Result: 6. The stack is empty.
```

---

## The number one danger: Stack Overflow

What happens if we forget the base case or the recursive step doesn't approach it?

```c
// WARNING! Infinite recursion
void funcionInfinita() {
    funcionInfinita(); 
}
```

Each call to `funcionInfinita()` puts a new plate on the memory stack without removing the previous ones. Since the computer's physical memory is limited, eventually the stack will fill up completely.

When this happens, the operating system interrupts the program throwing a fatal error: **Stack Overflow**. Your program will crash.

---

## Advanced Example: The Fibonacci sequence

The famous Fibonacci sequence starts with $0$ and $1$, and each subsequent term is the sum of the previous two: $0, 1, 1, 2, 3, 5, 8, 13...$

```c
int fibonacci(int n) {
    // Base cases
    if (n == 0) return 0;
    if (n == 1) return 1;
    
    // Recursive step (double call)
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### Why is recursive Fibonacci inefficient?
If you call `fibonacci(5)`, the function splits into two calls (`fibonacci(4)` and `fibonacci(3)`), and these in turn split into two more, creating a **call tree**:

```text
                     fib(5)
                   /        \
               fib(4)        fib(3)
              /      \      /      \
          fib(3)   fib(2) fib(2)   fib(1)
          /    \
      fib(2)  fib(1)
```

Notice that `fibonacci(3)` is calculated **2 times**, and `fibonacci(2)` is calculated **3 times** completely independently. For large numbers (like `fibonacci(50)`), the computer will have to perform billions of duplicate calculations and will take minutes or even hours to respond.

---

## Recursion vs. Iteration: Which one to choose?

| Criterion | Recursion | Iteration (`for`/`while` Loops) |
|---|---|---|
| **Structure** | Elegant, clean code, easier to read for hierarchical problems (like trees or graphs). | Requires more manual control variables, but the code is very sequential. |
| **Memory** | **High Cost**. Consumes space in the Call Stack for each recursive call. | **Low Cost**. Uses a constant amount of memory regardless of the number of repetitions. |
| **Speed** | Slower due to the cost of creating and destroying stack frames in memory. | Faster, since they are direct instruction jumps in the processor. |

### General rule:
* Use **iteration** for simple, linear tasks (traversing an array, counting numbers, accumulators).
* Use **recursion** when working with recursively defined structures (like binary trees, system folders) or advanced sorting algorithms (*Merge Sort*, *Quick Sort*).

---

## Summary of Learnings

- Recursion consists of solving a problem by breaking it into smaller versions of itself.
- **Base Case**: Stops the function and prevents a Stack Overflow.
- **Recursive Step**: Calls the function again with a modified argument.
- The computer's memory uses a **Call Stack** to remember where each suspended function was going.
- The elegance of recursion comes at a cost in speed and memory usage.
