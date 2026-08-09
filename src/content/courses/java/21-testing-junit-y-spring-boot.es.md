---
course: 'java'
slug: '20-testing-junit-y-spring-boot'
title: 'Testing con JUnit y Tu Primera App en Spring Boot'
description: 'Escribí pruebas unitarias con JUnit 5, practicá depuración e implementá un servicio REST CRUD completo con Spring Boot.'
order: 21
lang: 'es'
published: true
---

# Testing con JUnit y Tu Primera App en Spring Boot

## 1. Unit Testing con JUnit 5
```java
@Test
public void testSumar() {
    assertEquals(15, calculadora.sumar(5, 10));
}
```

## 2. Spring Boot y Arquitectura REST en 3 Capas
- `@RestController`
- `@Service`
- `@Repository`

## 3. Ejercicio Práctico
Escribí una clase de prueba `ProductoServicioTest` con JUnit 5.
