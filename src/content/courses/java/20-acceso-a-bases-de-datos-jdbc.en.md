---
course: 'java'
slug: '19-acceso-a-bases-de-datos-jdbc'
title: 'Database Access with JDBC and Secure SQL'
description: 'Connect applications to relational databases using JDBC, execute CRUD queries, and prevent SQL injection using PreparedStatement.'
order: 20
lang: 'en'
published: true
---

# Database Access with JDBC and Secure SQL

## 1. JDBC Connections & `PreparedStatement`
```java
String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setString(1, "Facundo");
    pstmt.setString(2, "facundo@example.com");
    pstmt.executeUpdate();
}
```

## 2. Preventing SQL Injection
Use `?` placeholders instead of manual string concatenation.

## 3. Hands-on Exercise
Insert 3 products into a `products` table using `PreparedStatement`.
