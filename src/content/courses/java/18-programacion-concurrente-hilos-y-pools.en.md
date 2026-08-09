---
course: 'java'
slug: '18-programacion-concurrente-hilos-y-pools'
title: 'Concurrent Programming: Threads, Synchronization, and Pools'
description: 'Create concurrent tasks with Thread and Runnable, synchronize shared memory access, and manage execution with ExecutorService.'
order: 18
lang: 'en'
published: true
---

# Concurrent Programming: Threads, Synchronization, and Pools

## 1. Thread Creation (`Runnable` vs `Thread`)
```java
Thread t = new Thread(() -> System.out.println("Parallel thread"));
t.start();
```

## 2. Synchronization & Thread Pools
`synchronized`, `wait()`, `notify()`, `ExecutorService`.

## 3. Hands-on Exercise
Simulate parallel file downloads using a 2-thread pool.
