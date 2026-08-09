---
course: 'java'
slug: '10-excepciones-y-manejo-de-errores'
title: 'Manejo de Excepciones y Robustez'
description: 'Aprendé a capturar y manejar errores en tiempo de ejecución con try-catch, y a crear excepciones personalizadas.'
order: 10
lang: 'es'
published: true
---

# Manejo de Excepciones y Robustez

## 1. El Bloque `try-catch-finally`
```java
try {
    int resultado = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Error: División por cero.");
} finally {
    System.out.println("Se ejecuta siempre.");
}
```

## 2. Excepciones Personalizadas
```java
public class SaldoInsuficienteException extends Exception {
    public SaldoInsuficienteException(String msg) { super(msg); }
}
```

## 3. Ejercicio Práctico
Creá una excepción personalizada `EdadInvalidaException` y capturala en el método `main`.
