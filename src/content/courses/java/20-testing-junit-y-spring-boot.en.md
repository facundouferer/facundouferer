---
course: 'java'
slug: '20-testing-junit-y-spring-boot'
title: 'Testing with JUnit and Your First Spring Boot App'
description: 'Write unit tests with JUnit 5, practice debugging techniques, and implement a full REST CRUD service with Spring Boot.'
order: 20
lang: 'en'
published: true
---

# Testing with JUnit and Your First Spring Boot App

## 1. Unit Testing with JUnit 5
```java
@Test
public void testAdd() {
    assertEquals(15, calculator.add(5, 10));
}
```

## 2. Spring Boot 3-Tier Layered Architecture
- `@RestController`
- `@Service`
- `@Repository`

## 3. Hands-on Exercise
Write a `ProductServiceTest` unit test class using JUnit 5.
