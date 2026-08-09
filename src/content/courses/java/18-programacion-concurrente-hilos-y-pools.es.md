---
course: 'java'
slug: '18-programacion-concurrente-hilos-y-pools'
title: 'Programación Concurrente: Hilos, Sincronización y Pools'
description: 'Creá tareas concurrentes con Thread y Runnable, sincronizá el acceso a memoria compartida y administrá hilos con ExecutorService.'
order: 18
lang: 'es'
published: true
---

# Programación Concurrente: Hilos, Sincronización y Pools

## 1. Creación de Hilos (`Runnable` vs `Thread`)
```java
Thread hilo = new Thread(() -> System.out.println("Hilo en paralelo"));
hilo.start();
```

## 2. Sincronización y Thread Pools
`synchronized`, `wait()`, `notify()`, `ExecutorService`.

## 3. Ejercicio Práctico
Simulá la descarga de 4 archivos con un pool de 2 hilos.
