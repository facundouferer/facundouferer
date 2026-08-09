---
course: 'java'
slug: '19-programacion-concurrente-hilos-y-pools'
title: 'Concurrent Programming: Threads, Synchronization, and Pools'
description: 'Master Java concurrency: thread lifecycle, shared memory synchronization, race conditions, ExecutorService, and Virtual Threads.'
order: 19
lang: 'en'
published: true
---

# Concurrent Programming: Threads, Synchronization, and Pools

In the era of multi-core processors, **concurrent programming** is a crucial discipline for fully leveraging hardware capacity, building high-throughput web servers, and executing I/O bound or heavy computational tasks without blocking the main application flow.

In this lesson, you will learn to manage execution threads in Java, understand the shared memory model and its synchronization challenges, manage thread pools using the `java.util.concurrent` framework, and explore modern **Virtual Threads** introduced in recent versions of the language.

---

## 1. Concurrency vs. Parallelism and Java Memory Model

Before writing code, it is essential to distinguish between two concepts that are frequently confused:

- **Concurrency**: Managing multiple tasks by interleaving their execution over time. Can occur even on a single-core processor using *Time-Slicing* by the OS scheduler.
- **Parallelism**: Physically executing two or more tasks at the exact same instant across separate CPU cores.

![Java Thread Lifecycle States and Stack vs Heap Shared Memory Model Diagram](/img/courses/java/java-thread-lifecycle.jpg)

### The Java Memory Model (JMM):
- **Stack**: Every thread possesses its own private execution stack storing local variables and object references.
- **Heap**: Global shared memory accessible by all threads where instantiated objects reside. Concurrency challenges arise when multiple threads attempt to **read and write to shared Heap memory** simultaneously.

---

## 2. Thread Creation and Lifecycle (`Thread` vs `Runnable` vs `Callable`)

In Java, a **Thread** represents the smallest unit of execution scheduled by the operating system.

### Defining Thread Tasks:

#### Option A: Implementing the `Runnable` Functional Interface (Recommended)
```java
public class RunnableTask implements Runnable {
    @Override
    public void run() {
        System.out.println("Executing inside thread: " + Thread.currentThread().getName());
    }
}

// Lambda usage:
Thread thread1 = new Thread(() -> System.out.println("Parallel thread running"));
thread1.start(); // NEVER call run() directly; start() spawns the OS thread.
```

#### Option B: Result-bearing tasks with `Callable<V>` and `Future<V>`
Unlike `Runnable`, `Callable` can return a value and throw checked exceptions:
```java
import java.util.concurrent.*;

Callable<Integer> complexTask = () -> {
    Thread.sleep(1000);
    return 42 * 2;
};
```

---

## 3. Race Conditions and Synchronization

When two or more threads mutate a shared variable without coordination, a **Race Condition** occurs, causing silent data corruption.

### The Non-Atomic Increment Problem (`count++`):
The `count++` operation consists of 3 distinct steps: (1) Read current value, (2) Increment by 1, (3) Write new value. If two threads execute this concurrently, they can overwrite each other's updates.

```java
public class UnsafeCounter {
    private int count = 0;

    // UNSAFE: If 10 threads increment 1000 times each, final count will rarely equal 10000.
    public void increment() {
        count++;
    }
}
```

### Synchronization Solutions in Java:

#### 1. `synchronized` Blocks and Methods (Intrinsic Locks)
Guarantees mutual exclusion: only one thread can execute the protected block at a time.
```java
public class SafeCounter {
    private int count = 0;

    public synchronized void increment() {
        count++; // Thread-safe
    }

    public synchronized int getCount() {
        return count;
    }
}
```

#### 2. Atomic Variables (`java.util.concurrent.atomic`)
For simple numeric operations, atomic classes use hardware-level instructions (*Compare-And-Swap - CAS*) without lock overhead:
```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounter {
    private AtomicInteger count = new AtomicInteger(0);

    public void increment() {
        count.incrementAndGet(); // Pure atomic operation
    }
}
```

#### 3. Memory Visibility with `volatile`
The `volatile` keyword instructs the JVM to read and write a variable directly to/from main RAM memory, bypassing CPU core caches (L1/L2).

---

## 4. Thread Pools with `ExecutorService`

In production applications, manually creating individual threads via `new Thread()` is an anti-pattern: OS thread creation is expensive in CPU and memory (~1MB stack per thread), and spawning unbounded threads risks out-of-memory crashes (`OutOfMemoryError`).

The solution is to reuse a managed set of worker threads using **Thread Pools** via the `ExecutorService` API.

![Java ExecutorService Thread Pool Model Architecture Diagram](/img/courses/java/java-thread-pool-executors.jpg)

### Common Thread Pool Factories:
- **`Executors.newFixedThreadPool(int n)`**: Reuses a fixed number of worker threads.
- **`Executors.newCachedThreadPool()`**: Creates threads on demand and reclaims idle ones.
- **`Executors.newSingleThreadExecutor()`**: Guarantees sequential task execution on a single worker thread.

### Practical `ExecutorService` and `Future` Example:
```java
import java.util.concurrent.*;

public class ThreadPoolExample {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        // 1. Create a Pool of 3 worker threads
        ExecutorService executor = Executors.newFixedThreadPool(3);

        // 2. Submit Callable tasks returning Future results
        Future<String> task1 = executor.submit(() -> {
            Thread.sleep(1500);
            return "Process A result";
        });

        Future<String> task2 = executor.submit(() -> {
            Thread.sleep(1000);
            return "Process B result";
        });

        // 3. Retrieve results from Futures (.get() blocks until task completion)
        System.out.println("Waiting for responses...");
        System.out.println("Received: " + task1.get());
        System.out.println("Received: " + task2.get());

        // 4. Shutdown executor to allow clean JVM exit
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);
    }
}
```

---

## 5. The Future of Concurrency: Virtual Threads (Java 21+)

In recent Java releases (Project Loom), the platform introduced **Virtual Threads**. Unlike traditional OS-backed platform threads, Virtual Threads are lightweight threads managed directly by the JVM in user space.

You can launch millions of virtual threads concurrently without overwhelming RAM or the underlying OS:

```java
// Creating a Virtual Thread per task Executor (Java 21+)
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        final int taskId = i;
        executor.submit(() -> {
            Thread.sleep(1000);
            return "Virtual task #" + taskId;
        });
    }
} // Try-with-resources automatically closes the executor when tasks finish
```

---

## 6. Guided Hands-on Exercise

### Challenge: Concurrent Download Manager
Develop a program simulating the download of 5 heavy files using a pool of **2 concurrent worker threads**:
1. Each download task should take a random duration between 1 to 3 seconds and print start/completion logs including the processing thread name.
2. Measure the total elapsed time from start until pool termination.

<details>
<summary>View Suggested Solution</summary>

```java
import java.util.concurrent.*;
import java.util.Random;

public class ConcurrentDownloader {

    static class DownloadTask implements Runnable {
        private final String fileName;

        public DownloadTask(String fileName) {
            this.fileName = fileName;
        }

        @Override
        public void run() {
            String currentThread = Thread.currentThread().getName();
            System.out.println("[" + currentThread + "] Starting download: " + fileName);
            try {
                int downloadTime = 1000 + new Random().nextInt(2000);
                Thread.sleep(downloadTime);
                System.out.println("[" + currentThread + "] ✔ Completed download: " + fileName);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        long start = System.currentTimeMillis();
        ExecutorService pool = Executors.newFixedThreadPool(2);

        String[] files = {"video_hd.mp4", "backup.zip", "dataset.csv", "doc.pdf", "image.raw"};

        for (String file : files) {
            pool.submit(new DownloadTask(file));
        }

        pool.shutdown();
        pool.awaitTermination(30, TimeUnit.SECONDS);

        long end = System.currentTimeMillis();
        System.out.println("==========================================");
        System.out.println("All downloads finished in: " + (end - start) + " ms");
        System.out.println("==========================================");
    }
}
```
</details>
