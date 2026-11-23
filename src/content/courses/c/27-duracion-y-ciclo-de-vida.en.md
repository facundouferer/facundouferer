---
title: 'Storage duration and object lifetime'
course: 'c'
slug: 'duracion-y-ciclo-de-vida'
order: 27
lang: 'en'
published: true
---

In the last two lessons you learned that a pointer stores the address of an object. One question is just as important: **for how long does that object exist?** A pointer is only useful while the object it points to is still alive. When the object stops existing, the address is still stored in the pointer, but it no longer means anything.

## Objectives

- Understand what the **lifetime** of an object is.
- Tell apart **automatic storage duration**, **static storage duration**, allocated storage duration and thread storage duration.
- Use the stack and the heap as models to reason about memory, knowing that the standard does not require them.
- Recognize a **dangling pointer** and explain why using it is **undefined behavior**.
- Choose a correct alternative: return by value, use a caller-provided buffer or, carefully, `static`.

**Prerequisites:** `sentencia-switch-y-bloques-de-codigo` (blocks and scope), `variables-parametros-y-pasaje` (local and global variables), `punteros-y-direcciones` and `punteros-arreglos-y-estructuras`.

## Objects and lifetime

In C, an **object** is a region of memory that holds a value: an `int` variable, an array, a structure. Every object has a **lifetime**: the part of the execution during which the object exists, has a fixed address and keeps the last value stored in it.

The lifetime depends on the object's **storage duration**, and the duration depends on *where* and *how* it is declared. C defines four:

| Duration | Which objects have it | Starts | Ends |
| --- | --- | --- | --- |
| Automatic | local variables and parameters | on entering the block | on leaving the block (the closing brace) |
| Static | global variables and `static` locals | before `main` starts | when the program ends |
| Allocated | memory requested at run time | when requested | when released |
| Thread | `thread_local` variables | when the thread is created | when the thread ends |

Do not confuse **scope** with **lifetime**. Scope is a source-code idea: *where* you can write a variable's name. Lifetime is an execution idea: *when* the object exists. A `static` local variable has block scope (you can only name it inside its function) but lives for the whole program.

## Automatic storage duration

Variables declared inside a block, without `static`, have **automatic storage duration**. They are created when execution enters the block and stop existing at the closing brace `}`. Function parameters behave the same way: they live for the duration of that call.

```c
#include <stdio.h>

void show_square(int n) {
    int square = n * n;            // born on entering the function
    printf("%d squared is %d\n", n, square);
}                                  // n and square stop existing here

int main(void) {
    for (int i = 1; i <= 3; i++) {
        int twice = i * 2;         // a new object on every iteration
        printf("twice %d: %d\n", i, twice);
    }                              // twice ends at the end of each iteration
    show_square(4);
    show_square(5);                // another call, other objects
    return 0;
}
```

Each call to `show_square` creates its own `n` and its own `square`. That is why recursion works: every recursive call has its own automatic variables, independent from those of the other calls.

An **uninitialized** automatic variable holds an indeterminate value. Reading it before assigning something is an error: always initialize your local variables.

## Static storage duration

Global variables and local variables declared with `static` have **static storage duration**: they exist during the whole execution of the program. They are initialized only once, before `main` starts, and if you give them no initial value they start at zero.

```c
#include <stdio.h>

int total_calls = 0;               // global: static storage duration

int next_turn(void) {
    static int turn = 0;           // static local: initialized only once
    turn++;
    total_calls++;
    return turn;
}

int main(void) {
    printf("Turn %d\n", next_turn());
    printf("Turn %d\n", next_turn());
    printf("Turn %d\n", next_turn());
    printf("Calls: %d\n", total_calls);
    return 0;
}
```

Output:

```
Turn 1
Turn 2
Turn 3
Calls: 3
```

`turn` keeps its value between calls because it is not destroyed when the function returns. Its scope, however, is still the block of `next_turn`: you cannot write `turn` from `main`.

The initializer of an object with static storage duration must be a constant expression: `static int turn = 0;` is valid, `static int turn = n;` (with `n` a parameter) is not.

## Allocated storage duration

Sometimes the size of the data is only known while the program runs, or an object must stay alive after the function that created it returns. That is what **allocated storage duration** is for: the program requests memory at run time and decides when to give it back. The standard library functions that do it (`malloc`, `calloc`, `realloc` and `free`) are the topic of the next lesson, `memoria-dinamica`. For now it is enough to know that, with this duration, the lifetime is not marked by a brace but by the program itself.

## Thread storage duration

A program can run several threads at once. A variable declared with `thread_local` has **thread storage duration**: each thread has its own copy, which lives as long as that thread. You will see it in the advanced concurrency module; here we only name it to complete the map.

> **Basic C:** up to C17 the keyword is spelled `_Thread_local` (or `thread_local` if you include `<threads.h>`).

> **Modern C (C23):** `thread_local` becomes a keyword of the language; no header is needed.

> **Portability:** `<threads.h>` is optional in the standard and not every platform ships it; concurrency is covered in the advanced module.

## The stack and the heap: models to reason with

Two pictures are commonly used to explain the durations:

- **The stack:** an area where every function call pushes a *frame* with its automatic variables and parameters. When the function returns, the frame is popped and that memory is reused by the next call.
- **The heap:** an area that provides the memory of allocated storage duration. Blocks are requested and returned in any order.

Variables with static storage duration usually live in yet another area, prepared when the program is loaded.

<svg viewBox="0 0 640 260" role="img" aria-label="Memory model: static area, stack with call frames and heap with blocks" style="width:100%;height:auto;font-family:var(--font-body)">
  <rect x="10" y="20" width="190" height="220" rx="18" fill="var(--color-surface)" stroke="var(--color-text)" stroke-width="2"/>
  <text x="105" y="48" text-anchor="middle" fill="var(--color-text)" font-size="18">Static</text>
  <rect x="30" y="70" width="150" height="40" rx="12" fill="var(--color-accent-2)" opacity="0.35"/>
  <text x="105" y="96" text-anchor="middle" fill="var(--color-text)" font-family="monospace" font-size="14">total_calls</text>
  <rect x="30" y="120" width="150" height="40" rx="12" fill="var(--color-accent-2)" opacity="0.35"/>
  <text x="105" y="146" text-anchor="middle" fill="var(--color-text)" font-family="monospace" font-size="14">turn</text>
  <rect x="225" y="20" width="190" height="220" rx="18" fill="var(--color-surface)" stroke="var(--color-text)" stroke-width="2"/>
  <text x="320" y="48" text-anchor="middle" fill="var(--color-text)" font-size="18">Stack</text>
  <rect x="245" y="180" width="150" height="44" rx="12" fill="var(--color-accent)" opacity="0.3"/>
  <text x="320" y="207" text-anchor="middle" fill="var(--color-text)" font-family="monospace" font-size="14">main: i, twice</text>
  <rect x="245" y="128" width="150" height="44" rx="12" fill="var(--color-accent)" opacity="0.55"/>
  <text x="320" y="155" text-anchor="middle" fill="var(--color-text)" font-family="monospace" font-size="14">f: n, square</text>
  <text x="320" y="100" text-anchor="middle" fill="var(--color-text)" font-size="13">grows on each call,</text>
  <text x="320" y="117" text-anchor="middle" fill="var(--color-text)" font-size="13">shrinks on return</text>
  <rect x="440" y="20" width="190" height="220" rx="18" fill="var(--color-surface)" stroke="var(--color-text)" stroke-width="2"/>
  <text x="535" y="48" text-anchor="middle" fill="var(--color-text)" font-size="18">Heap</text>
  <rect x="460" y="70" width="70" height="40" rx="12" fill="var(--color-accent-2)" opacity="0.6"/>
  <rect x="540" y="70" width="70" height="40" rx="12" fill="var(--color-text)" opacity="0.12"/>
  <rect x="460" y="120" width="150" height="40" rx="12" fill="var(--color-accent-2)" opacity="0.6"/>
  <text x="535" y="200" text-anchor="middle" fill="var(--color-text)" font-size="13">blocks requested and</text>
  <text x="535" y="217" text-anchor="middle" fill="var(--color-text)" font-size="13">returned on demand</text>
</svg>

These are **explanatory models**, not rules of the language. The C standard talks about storage durations and lifetimes; it does not require a stack or a heap to exist. A compiler may keep an automatic variable only in a register, or remove it if it is not needed. Reason with the stack and the heap, but remember that the real guarantee is the duration.

## Dangling pointers

A **dangling pointer** is a pointer that holds the address of an object whose lifetime has already ended. The pointer does not change, but the object no longer exists: the memory may be reused for something else at any moment.

### Returning the address of a local variable

This is the most common mistake. The function returns the address of `result`, but `result` has automatic storage duration and stops existing as soon as the function ends.

<!-- c-check: skip -->

```c
#include <stdio.h>

int *compute_double(int n) {
    int result = n * 2;
    return &result;                // ERROR: result dies on return
}

int main(void) {
    int *p = compute_double(21);
    printf("%d\n", *p);            // uses a dangling pointer
    return 0;
}
```

Fortunately, the compiler usually catches it:

```
clang: warning: address of stack memory associated with local variable 'result' returned [-Wreturn-stack-address]
gcc:   warning: function returns address of local variable [-Wreturn-local-addr]
```

With `-Werror` that warning becomes an error and the program does not even compile. It is a good reason to always compile with warnings enabled.

### Using a pointer after its block ended

The compiler cannot always warn you. In this program the pointer outlives the block where the variable lived, and it compiles without any warning:

```c
#include <stdio.h>

int main(void) {
    int *p = NULL;
    {
        int temporary = 42;
        p = &temporary;
        printf("Inside the block: %d\n", *p);   // correct: temporary is alive
    }                                           // temporary stops existing
    printf("Outside the block: %d\n", *p);      // ERROR: p is dangling
    return 0;
}
```

The second read of `*p` is wrong even though it compiles. The same happens if you store the address of a local variable in a global variable or in a structure that lives longer than that variable.

## Undefined behavior: why it "works" today and fails tomorrow

Using a dangling pointer is **undefined behavior**: the standard does not say what must happen. The program may print the old value, print garbage, crash or do something completely different.

The dangerous part is that it often *seems to work*. If nobody has reused that memory yet, the old value is still there and the program prints `42`. But any of these is enough:

- adding a function call in between (its frame overwrites the memory),
- compiling with optimizations (`-O2`), which rearrange variables,
- switching compiler or platform,

and the same program prints something else. The compiler may even assume undefined behavior never happens and optimize accordingly. That is why you cannot "prove" a program with undefined behavior correct by running it: you have to reason about lifetimes.

> **Rule:** a pointer is valid only while the object it points to is alive. Before storing an address, ask yourself who lives longer: the pointer or the object.

## Correct alternatives

### 1. Return by value

If the result is small, return it as a value. The value is copied to the caller, so it does not matter that the local variable dies. Structures can be returned by value too:

```c
#include <stdio.h>

struct point {
    int x;
    int y;
};

struct point midpoint(struct point a, struct point b) {
    struct point middle = { (a.x + b.x) / 2, (a.y + b.y) / 2 };
    return middle;                 // the value is copied, not the address
}

int main(void) {
    struct point a = { 0, 0 };
    struct point b = { 10, 4 };
    struct point m = midpoint(a, b);
    printf("(%d, %d)\n", m.x, m.y);
    return 0;
}
```

### 2. A caller-provided buffer

If the result is an array or a string, the caller creates the array (which lives in *its* frame) and passes the function a pointer and the capacity. The function writes there:

```c
#include <stdio.h>

// Writes a greeting for name into destination, which must hold at least
// capacity characters. Returns false if it does not fit.
bool build_greeting(char *destination, size_t capacity, const char *name) {
    int written = snprintf(destination, capacity, "Hello, %s", name);
    return written >= 0 && (size_t)written < capacity;
}

int main(void) {
    char greeting[32];             // lives in main, as long as main uses it
    if (build_greeting(greeting, sizeof greeting, "Ann")) {
        printf("%s\n", greeting);
    }
    return 0;
}
```

`snprintf` works like `printf`, but it writes into an array and never goes past the given capacity; it returns how many characters it *wanted* to write, so if that number is not smaller than the capacity, the text was truncated.

This is the pattern used by library functions such as `snprintf` and `fgets`: the caller decides where the result lives and how big it is.

> **Basic C:** up to C17, `bool` requires `#include <stdbool.h>`.

> **Modern C (C23):** `bool`, `true` and `false` are keywords; the header is no longer needed.

### 3. A `static` local variable (carefully)

A `static` variable lives for the whole program, so returning its address does not leave a dangling pointer:

```c
#include <stdio.h>

const char *day_name(int day) {
    static char text[16];
    snprintf(text, sizeof text, "Day %d", day);
    return text;                   // valid: text has static storage duration
}

int main(void) {
    const char *a = day_name(1);
    const char *b = day_name(2);
    printf("%s / %s\n", a, b);     // prints "Day 2 / Day 2"
    return 0;
}
```

It works, but it has serious drawbacks:

- **There is only one shared object:** each call overwrites the previous result. In the example, `a` and `b` point to the same array, so both show `Day 2`.
- **It is not reentrant:** if two threads call the function at the same time, the results get mixed.
- **The size is fixed** and stays reserved even when unused.

Use it only when those limitations do not matter. The third complete option, creating a new object on every call, needs allocated storage duration and you will see it in the next lesson.

## Summary

- Every object has a **lifetime** determined by its storage duration.
- **Automatic storage duration:** local variables and parameters; they end at the closing brace of their block.
- **Static storage duration:** globals and `static` locals; they live for the whole program and are initialized once.
- **Allocated storage duration:** decided by the program; next lesson. **Thread storage duration:** advanced module.
- The stack and the heap are useful models, not requirements of the standard.
- A **dangling pointer** points to a dead object; using it is **undefined behavior**, even if it seems to work.
- To return results: by value, in a caller-provided buffer or, within its limits, in a `static`.

## Practice exercises

### Exercise 1: classify the duration

State the storage duration of each object: `total`, `counter`, `x`, `i` and `buffer`.

```c
int total = 0;

void process(int x) {
    static int counter = 0;
    char buffer[8] = "";
    for (int i = 0; i < x; i++) {
        counter++;
    }
    total += counter + buffer[0];
}
```

<details><summary>Show solution</summary>

- `total`: static storage duration (global variable).
- `counter`: static storage duration (`static` local); initialized only once and keeps its value between calls.
- `x`: automatic storage duration (parameter); lives for each call.
- `i`: automatic storage duration; lives only inside the `for`.
- `buffer`: automatic storage duration; lives until the closing brace of `process`.

</details>

### Exercise 2: find the bug

The function must return the largest value of an array. What is wrong and how do you fix it?

<!-- c-check: skip -->

```c
int *largest(const int *values, size_t n) {
    int maximum = values[0];
    for (size_t i = 1; i < n; i++) {
        if (values[i] > maximum) {
            maximum = values[i];
        }
    }
    return &maximum;
}
```

<details><summary>Show solution</summary>

It returns the address of `maximum`, which has automatic storage duration: on return, the caller receives a dangling pointer. Since the result is a single `int`, the right fix is to return it by value:

```c
int largest(const int *values, size_t n) {
    int maximum = values[0];
    for (size_t i = 1; i < n; i++) {
        if (values[i] > maximum) {
            maximum = values[i];
        }
    }
    return maximum;
}
```

Another valid option is to return a pointer *to the array element* (`&values[i]`), because the array belongs to the caller and is still alive.

</details>

### Exercise 3: predict the output

What does this program print?

```c
#include <stdio.h>

int count(void) {
    static int times = 0;
    int local = 0;
    times++;
    local++;
    return times * 10 + local;
}

int main(void) {
    printf("%d\n", count());
    printf("%d\n", count());
    printf("%d\n", count());
    return 0;
}
```

<details><summary>Show solution</summary>

```
11
21
31
```

`times` has static storage duration and accumulates 1, 2, 3. `local` has automatic storage duration: it is created again on every call with value 0 and ends at 1.

</details>

### Exercise 4: repair the function

`format_price` returns a formatted text, but the program sometimes prints garbage. Rewrite it with the caller-provided buffer pattern.

<!-- c-check: skip -->

```c
const char *format_price(double price) {
    char text[32];
    snprintf(text, sizeof text, "$ %.2f", price);
    return text;
}
```

<details><summary>Show solution</summary>

`text` is automatic and dies on return. The caller must provide the space:

```c
#include <stdio.h>

bool format_price(char *destination, size_t capacity, double price) {
    int written = snprintf(destination, capacity, "$ %.2f", price);
    return written >= 0 && (size_t)written < capacity;
}

int main(void) {
    char text[32];
    if (format_price(text, sizeof text, 1234.5)) {
        printf("%s\n", text);
    }
    return 0;
}
```

</details>

### Exercise 5: who lives longer?

A structure `struct record { int *data; };` is declared global. Inside a function you write `int value = 7; global_record.data = &value;`. Is it correct to use `*global_record.data` from `main` after calling that function? Justify it with storage durations.

<details><summary>Show solution</summary>

No. `global_record` has static storage duration and lives for the whole program, but `value` has automatic storage duration and stops existing when the function returns. The stored pointer is left dangling and reading it from `main` is undefined behavior. A pointer must never outlive the object it points to: store the value (`int data;`) instead of its address, or point to an object with static storage duration.

</details>
