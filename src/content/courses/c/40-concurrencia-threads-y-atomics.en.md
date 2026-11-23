---
title: 'Concurrency: threads and atomics'
course: 'c'
slug: 'concurrencia-threads-y-atomics'
description: 'Run tasks in parallel with threads, understand how race conditions arise on shared state and synchronize with mutexes and atomic operations.'
order: 40
lang: 'en'
published: true
---

> **Optional deepening path.** This lesson closes the advanced module *Modern C and C23* and is a specialization: you do not need it for the rest of the course. Concurrency is one of the hardest topics in programming; take it once you master pointers, memory and debugging.

Until now, every program did one thing at a time: one instruction after another. A **concurrent** program has several threads of execution that advance at the same time and **share memory**. That lets you use several processor cores, but it opens a new class of bugs: bugs that appear once in a thousand runs, change from one run to the next and vanish when you try to observe them. In this lesson you learn C's tools for working with threads and, above all, how to avoid those bugs.

## Objectives

- Tell concurrency from parallelism and understand what threads share.
- Recognize a **race condition** and why a data race is undefined behavior.
- Create and wait for threads with `<threads.h>` (C11, optional) and with POSIX `pthread`.
- Protect shared data with a mutex and with atomic operations (`<stdatomic.h>`).
- Know what condition variables are for.
- Detect races with ThreadSanitizer, avoid deadlocks and decide when **not** to use threads.

**Prerequisites:** `punteros-arreglos-y-estructuras` (function pointers and `void *`), `duracion-y-ciclo-de-vida`, `memoria-dinamica`, `depuracion-y-sanitizers` and `c23-moderno`.

## Concurrency and parallelism

- **Concurrency:** several tasks are **in progress** at the same time. They can take turns on a single core: the operating system runs a bit of one, then a bit of another.
- **Parallelism:** several tasks run **at the same instant**, on different cores.

Concurrency is a way to **structure** a program; parallelism is a way to **run** it. A concurrent program can run in parallel if there are several cores, but it must be correct in both cases.

A **thread** is a sequence of execution inside a process. All the threads of a process **share** global variables, `static` variables and dynamic memory. Each thread has **its own stack**: its local variables and parameters are its own. That is the root of everything: whatever is shared and modified needs protection.

## An example: the race condition

Two threads increment the same counter a million times each. The result should be 2,000,000. We use POSIX `pthread`, available on Linux and macOS; you will see the standard version below.

```c
#include <stdio.h>
#include <pthread.h>

static long counter = 0; // shared by both threads

static void *increment(void *arg) {
    (void)arg;
    for (int i = 0; i < 1000000; i++) {
        counter++; // data race: two threads modify it without protection
    }
    return NULL;
}

int main(void) {
    pthread_t a;
    pthread_t b;
    if (pthread_create(&a, NULL, increment, NULL) != 0) {
        return 1;
    }
    if (pthread_create(&b, NULL, increment, NULL) != 0) {
        pthread_join(a, NULL);
        return 1;
    }
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("counter = %ld\n", counter);
    return 0;
}
```

Compile with `-pthread`, which adds what threads need when compiling and linking:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -pthread counter.c -o counter
```

Three runs in a row may show `counter = 1328153`, `counter = 1117138` and `counter = 1786290`. Almost never 2,000,000.

Why? Because `counter++` is not a single operation. The processor takes three steps: **read** the value, **add** 1 and **write** it. If both threads read 41 at once, both write 42, and one increment is lost:

| Thread A | Thread B | `counter` |
| --- | --- | --- |
| reads 41 | | 41 |
| | reads 41 | 41 |
| adds: 42 | | 41 |
| | adds: 42 | 41 |
| writes 42 | | 42 |
| | writes 42 | 42 |

A **race condition** is a bug where the result depends on the (unpredictable) order in which threads interleave. When, in addition, two threads access the same variable without synchronization and at least one of them writes, there is a **data race**, and in C that is **undefined behavior**: not only can increments be lost, the compiler may optimize the code assuming the race does not exist and produce any result.

## Standard threads: `<threads.h>`

C11 added a thread library to the standard, `<threads.h>`:

| Function | Purpose |
| --- | --- |
| `thrd_create(&thread, function, arg)` | creates a thread that runs `int function(void *arg)` |
| `thrd_join(thread, &result)` | waits for the thread to finish and collects its return value |
| `mtx_init(&m, mtx_plain)` / `mtx_destroy(&m)` | creates and destroys a mutex |
| `mtx_lock(&m)` / `mtx_unlock(&m)` | acquires and releases the mutex |
| `cnd_wait`, `cnd_signal`, `cnd_broadcast` | condition variables |

The functions return `thrd_success` when all goes well. This is the counter fixed with a **mutex** (*mutual exclusion*): only one thread at a time can hold it, so the increment is protected.

<!-- c-check: skip -->
```c
#include <stdio.h>
#include <threads.h>

static long counter = 0;
static mtx_t lock;

static int increment(void *arg) {
    (void)arg;
    for (int i = 0; i < 1000000; i++) {
        mtx_lock(&lock);
        counter++; // critical section
        mtx_unlock(&lock);
    }
    return 0;
}

int main(void) {
    if (mtx_init(&lock, mtx_plain) != thrd_success) {
        return 1;
    }
    thrd_t a;
    thrd_t b;
    if (thrd_create(&a, increment, NULL) != thrd_success) {
        return 1;
    }
    if (thrd_create(&b, increment, NULL) != thrd_success) {
        thrd_join(a, NULL);
        return 1;
    }
    thrd_join(a, NULL);
    thrd_join(b, NULL);
    mtx_destroy(&lock);
    printf("counter = %ld\n", counter);
    return 0;
}
```

This program carries the not-compiled marker because it needs `<threads.h>`, and not every platform has it.

> **Portability:** `<threads.h>` is **optional** since C11: an implementation may not provide it, and in that case it defines the `__STDC_NO_THREADS__` macro. glibc includes it since version 2.28 (Linux); macOS, at the time of writing, does **not** have it (it defines `__STDC_NO_THREADS__`). That is why, in practice, the most widely available alternative is POSIX `pthread` on Linux and macOS, and the Windows thread API on Windows. You can check in code with `#ifdef __STDC_NO_THREADS__` or `__has_include(<threads.h>)`.

## The same fix with `pthread`

POSIX `pthread` is not part of the C standard but of the POSIX standard, and it is available on Linux, macOS and other Unix-like systems. The ideas are the same; the names change:

| `<threads.h>` (C11) | `<pthread.h>` (POSIX) |
| --- | --- |
| `thrd_t`, `thrd_create`, `thrd_join` | `pthread_t`, `pthread_create`, `pthread_join` |
| function `int f(void *)` | function `void *f(void *)` |
| `mtx_t`, `mtx_lock`, `mtx_unlock` | `pthread_mutex_t`, `pthread_mutex_lock`, `pthread_mutex_unlock` |
| `cnd_t`, `cnd_wait`, `cnd_signal` | `pthread_cond_t`, `pthread_cond_wait`, `pthread_cond_signal` |

```c
#include <stdio.h>
#include <pthread.h>

static long counter = 0;
static pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

static void *increment(void *arg) {
    (void)arg;
    for (int i = 0; i < 1000000; i++) {
        pthread_mutex_lock(&lock);
        counter++; // critical section
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    pthread_t a;
    pthread_t b;
    if (pthread_create(&a, NULL, increment, NULL) != 0) {
        return 1;
    }
    if (pthread_create(&b, NULL, increment, NULL) != 0) {
        pthread_join(a, NULL);
        return 1;
    }
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("counter = %ld\n", counter);
    return 0;
}
```

Now it always prints `counter = 2000000`. The code between `lock` and `unlock` is called the **critical section**: keep it as short as you can, because while one thread runs it, the others wait.

## Passing data to a thread

A thread function receives a single `void *`. To pass it several values, group them in a structure and pass its address. The best design is for each thread to work on **its own part** of the data: if nothing is shared for writing, no synchronization is needed.

```c
#include <stdio.h>
#include <pthread.h>

#define COUNT 1000
#define THREADS 4

typedef struct {
    const int *data;
    size_t from;
    size_t to;
    long sum; // each thread writes only its own
} Slice;

static void *sum_slice(void *arg) {
    Slice *s = arg;
    s->sum = 0;
    for (size_t i = s->from; i < s->to; i++) {
        s->sum += s->data[i];
    }
    return NULL;
}

int main(void) {
    static int numbers[COUNT];
    for (size_t i = 0; i < COUNT; i++) {
        numbers[i] = (int)i + 1;
    }

    pthread_t threads[THREADS];
    Slice slices[THREADS];
    size_t step = COUNT / THREADS;
    for (size_t t = 0; t < THREADS; t++) {
        slices[t] = (Slice){ numbers, t * step, (t == THREADS - 1) ? COUNT : (t + 1) * step, 0 };
        if (pthread_create(&threads[t], NULL, sum_slice, &slices[t]) != 0) {
            for (size_t k = 0; k < t; k++) {
                pthread_join(threads[k], NULL);
            }
            return 1;
        }
    }

    long total = 0;
    for (size_t t = 0; t < THREADS; t++) {
        pthread_join(threads[t], NULL);
        total += slices[t].sum; // safe: the thread has finished
    }
    printf("total = %ld\n", total);
    return 0;
}
```

It prints `total = 500500`. Two lifetime details, which you saw in `duracion-y-ciclo-de-vida`: `slices` must stay alive while the threads use it (here it lives until the end of `main`), and reading `slices[t].sum` is safe only **after** `pthread_join`, which guarantees the thread has finished and its writes are visible.

## Atomic operations: `<stdatomic.h>`

For something as simple as a counter, a mutex is too much. C11 added `<stdatomic.h>`: **atomic** types and operations, which run as one indivisible step, with no other thread seeing an intermediate state.

```c
#include <stdio.h>
#include <pthread.h>
#include <stdatomic.h>

static atomic_int counter = 0;

static void *increment(void *arg) {
    (void)arg;
    for (int i = 0; i < 1000000; i++) {
        atomic_fetch_add(&counter, 1); // read, add and write in one step
    }
    return NULL;
}

int main(void) {
    pthread_t a;
    pthread_t b;
    if (pthread_create(&a, NULL, increment, NULL) != 0) {
        return 1;
    }
    if (pthread_create(&b, NULL, increment, NULL) != 0) {
        pthread_join(a, NULL);
        return 1;
    }
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("counter = %d\n", atomic_load(&counter));
    return 0;
}
```

It always prints `counter = 2000000`, with no mutex.

- `atomic_int` is an atomic `int` (there are also `atomic_long`, `atomic_bool` and `_Atomic(T)` for other types).
- `atomic_fetch_add(&x, n)` adds `n` and returns the previous value; `atomic_load` and `atomic_store` read and write atomically.
- On an `atomic_int`, even `counter++` is atomic. Writing `atomic_fetch_add` makes the intent visible to the reader.
- By default, these operations use the strongest memory order (`memory_order_seq_cst`), which is the easiest to reason about. Weaker orders exist for optimization, and they are expert territory.

An atomic protects **one** variable. If you need to keep **several** variables consistent together (for example, the balances of two accounts), you need a mutex.

> **Portability:** `<stdatomic.h>` is also **optional** since C11 (if missing, `__STDC_NO_ATOMICS__` is defined), but GCC and Clang provide it on common platforms, and it works the same with `<threads.h>` or `pthread` threads.

## Condition variables

Sometimes a thread needs more than exclusion: it needs to **wait until something happens**: an item in a queue, another thread finishing a stage. Doing it with a loop that keeps asking wastes the processor. A **condition variable** lets the thread sleep until another one signals:

<!-- c-check: skip -->
```c
// Consumer: waits until there is data.
mtx_lock(&lock);
while (count == 0) {            // always in a while, never in an if
    cnd_wait(&has_data, &lock); // releases the mutex, sleeps, and re-acquires it on wake-up
}
int item = queue[--count];
mtx_unlock(&lock);

// Producer: adds an item and signals.
mtx_lock(&lock);
queue[count++] = new_item;
cnd_signal(&has_data);
mtx_unlock(&lock);
```

The condition is checked again in a `while` because a thread may wake up without the condition being true (*spurious wake-up*) or because another thread got there first. With `pthread`, the equivalent functions are `pthread_cond_wait` and `pthread_cond_signal`.

## Detecting races: ThreadSanitizer

A data race may not show up in your tests and appear in production. Just like AddressSanitizer for memory (you saw it in `depuracion-y-sanitizers`), **ThreadSanitizer** instruments the program and detects data races **when they happen** during execution:

```bash
gcc -std=c23 -Wall -Wextra -g -pthread -fsanitize=thread counter.c -o counter
./counter
```

With the first program of the lesson (the unprotected counter), the report starts with `WARNING: ThreadSanitizer: data race` and shows the two conflicting lines (`counter++` in both threads) with the call stack of each access.

- `-fsanitize=thread` cannot be combined with `-fsanitize=address`: they are two separate builds.
- It makes the program several times slower and uses more memory; it is for testing, not production.
- It only detects races that **happen** in that run: if a code path does not run, it is not checked.

> **Portability:** ThreadSanitizer is available in GCC and Clang on 64-bit Linux, and in Clang on macOS. It is not part of the C standard: it is a compiler tool.

## Deadlock and lock ordering

A **deadlock** happens when two threads wait for each other forever. The classic case: two mutexes taken in opposite order.

<!-- c-check: skip -->
```c
// Thread 1: transfer from A to B      // Thread 2: transfer from B to A
mtx_lock(&account_a.lock);             mtx_lock(&account_b.lock);
mtx_lock(&account_b.lock); // waits    mtx_lock(&account_a.lock); // waits
```

Thread 1 holds A and waits for B; thread 2 holds B and waits for A. Neither ever advances.

The rule that prevents it: **every thread takes the locks in the same global order**. For example, always the account with the lower number first:

<!-- c-check: skip -->
```c
void transfer(Account *from, Account *to, long amount) {
    Account *first = from->number < to->number ? from : to;
    Account *second = from->number < to->number ? to : from;
    mtx_lock(&first->lock);
    mtx_lock(&second->lock);
    from->balance -= amount;
    to->balance += amount;
    mtx_unlock(&second->lock);
    mtx_unlock(&first->lock);
}
```

Other useful rules: do not call unknown functions (callbacks) while holding a lock, keep critical sections short, and if a function takes a lock, it must release it on **every** exit path, including error paths.

## When not to use threads

Threads add complexity and bugs that are hard to reproduce. Before using them, ask yourself:

- **Is the program slow because of computation?** If it spends most of its time waiting for disk or network, more threads do not speed it up as much as you expect; asynchronous I/O or several processes are sometimes better.
- **Can the work be split into independent parts?** If every step needs the previous result, there is nothing to parallelize.
- **Is the task small?** Creating a thread costs time; to add a hundred numbers, a simple loop is faster.
- **Did you measure?** Optimize only what a measurement points to as slow.
- **Is there a simpler alternative?** Several independent processes (each with its own memory) or a library that already handles the parallelism avoid sharing memory.

If you decide to use them: share as little as possible, prefer each thread working on its own data, protect everything shared with a mutex or an atomic, and test with ThreadSanitizer.

## Common mistakes

- Modifying a shared variable without protection "because it is just a `++`".
- Forgetting `pthread_join` (or `thrd_join`) and reading results before the thread finishes, or ending `main` with threads still running.
- Passing a thread the address of a local variable that stops existing before the thread uses it.
- Using an `if` instead of a `while` around `cnd_wait`.
- Taking two locks in a different order in different places of the code.
- Using `volatile` to synchronize threads: in C, `volatile` does **not** make any operation atomic nor prevent data races.
- Assuming `<threads.h>` exists on every platform.

## Summary

- Threads share globals, `static` variables and dynamic memory; each one has its own stack.
- A **race condition** makes the result depend on the interleaving; a data race is **undefined behavior**.
- `<threads.h>` (C11, **optional**) offers `thrd_create`, `thrd_join`, `mtx_lock`, `mtx_unlock` and condition variables; POSIX `pthread` is the most available alternative (Linux and macOS), compiled with `-pthread`.
- A mutex protects a critical section; `atomic_int` and `atomic_fetch_add` protect a single variable without a mutex.
- ThreadSanitizer (`-fsanitize=thread`) detects races at run time.
- Avoid deadlocks by always taking locks in the same order.
- Use threads only when the work splits into independent parts and a measurement justifies it.

## Practice exercises

### Exercise 1: what can it be?

In the first program of the lesson (two threads, a million unprotected `counter++` each), can the result be greater than 2,000,000? Exactly 2,000,000? What does the C standard say?

<details><summary>Show solution</summary>

Under the "read, add, write" model, increments can only be **lost**, so in practice the result does not exceed 2,000,000 and sometimes (rarely) reaches it. But the standard says something stronger: the program has a data race, and that is **undefined behavior**. The standard guarantees no result at all, not even that the program ends well. That is why you do not reason about "how much is lost": you remove the race.

</details>

### Exercise 2: protect the accumulator

This program adds the numbers from 1 to 1000 with four threads that accumulate into a global variable. Fix it with a `pthread` mutex, and then think of a version that needs no synchronization inside the loop.

<!-- c-check: skip -->
```c
static long total = 0;

static void *add(void *arg) {
    Slice *s = arg;
    for (int i = s->from; i <= s->to; i++) {
        total += i;
    }
    return NULL;
}
```

<details><summary>Show solution</summary>

With a mutex, the addition to `total` goes into a critical section:

<!-- c-check: skip -->
```c
static long total = 0;
static pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

static void *add(void *arg) {
    Slice *s = arg;
    for (int i = s->from; i <= s->to; i++) {
        pthread_mutex_lock(&lock);
        total += i;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}
```

It works, but the threads spend almost all their time waiting for the lock. The better version accumulates into a **local** variable and takes the lock **only once** at the end, or, as in the lesson's `sum_slice` example, stores the partial sum in each thread's `Slice` and `main` adds them after `pthread_join`, with no mutex at all.

</details>

### Exercise 3: atomic counter of even numbers

Write a `pthread` program in which two threads each go through half of an integer array and count, in a shared `atomic_int`, how many numbers are even. The array holds the numbers from 1 to 100. The result must be 50.

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <pthread.h>
#include <stdatomic.h>

#define N 100

static int numbers[N];
static atomic_int evens = 0;

typedef struct {
    size_t from;
    size_t to;
} Half;

static void *count_evens(void *arg) {
    const Half *h = arg;
    for (size_t i = h->from; i < h->to; i++) {
        if (numbers[i] % 2 == 0) {
            atomic_fetch_add(&evens, 1);
        }
    }
    return NULL;
}

int main(void) {
    for (size_t i = 0; i < N; i++) {
        numbers[i] = (int)i + 1;
    }
    Half first = { 0, N / 2 };
    Half second = { N / 2, N };
    pthread_t a;
    pthread_t b;
    if (pthread_create(&a, NULL, count_evens, &first) != 0) {
        return 1;
    }
    if (pthread_create(&b, NULL, count_evens, &second) != 0) {
        pthread_join(a, NULL);
        return 1;
    }
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("evens = %d\n", atomic_load(&evens));
    return 0;
}
```

The `numbers` array is shared too, but the threads only **read** it after `main` filled it before creating them: concurrent reads with no writes are not a data race.

</details>

### Exercise 4: find the deadlock

A program has two functions that may run in different threads. Can it deadlock? How do you fix it?

<!-- c-check: skip -->
```c
void record_sale(void) {
    mtx_lock(&stock_lock);
    mtx_lock(&cash_lock);
    // ...
    mtx_unlock(&cash_lock);
    mtx_unlock(&stock_lock);
}

void return_product(void) {
    mtx_lock(&cash_lock);
    mtx_lock(&stock_lock);
    // ...
    mtx_unlock(&stock_lock);
    mtx_unlock(&cash_lock);
}
```

<details><summary>Show solution</summary>

Yes. If one thread runs `record_sale` and takes `stock_lock` while another runs `return_product` and takes `cash_lock`, each waits for the lock the other holds: deadlock. The fix is to set a global order, for example "always `stock_lock` before `cash_lock`", and make `return_product` follow it:

<!-- c-check: skip -->
```c
void return_product(void) {
    mtx_lock(&stock_lock);
    mtx_lock(&cash_lock);
    // ...
    mtx_unlock(&cash_lock);
    mtx_unlock(&stock_lock);
}
```

</details>

### Exercise 5: threads or not?

For each case, decide whether you would use threads and why: (a) a program that reads a 20-line configuration file; (b) applying a filter to every pixel of an 8000 × 6000 image; (c) computing the first thousand terms of a sequence where each term depends on the previous one.

<details><summary>Show solution</summary>

- (a) **No.** The work is tiny; creating threads would cost more than reading the file, and it adds complexity with no benefit.
- (b) **Yes, probably.** There is a lot of computation and each pixel (or each band of rows) is independent: each thread processes its band without sharing written data. Measure to choose the number of threads.
- (c) **No.** Each term needs the previous one: the work is sequential by nature and there is nothing to split.

</details>
