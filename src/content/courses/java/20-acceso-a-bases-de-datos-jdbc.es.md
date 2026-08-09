---
course: 'java'
slug: '19-acceso-a-bases-de-datos-jdbc'
title: 'Acceso a Bases de Datos con JDBC y SQL Seguro'
description: 'Conectá tu aplicación a bases de datos relacionales con JDBC, ejecutá consultas CRUD y prevení inyecciones SQL con PreparedStatement.'
order: 20
lang: 'es'
published: true
---

# Acceso a Bases de Datos con JDBC y SQL Seguro

## 1. Conexión JDBC y `PreparedStatement`
```java
String sql = "INSERT INTO usuarios (nombre, email) VALUES (?, ?)";
try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setString(1, "Facundo");
    pstmt.setString(2, "facundo@ejemplo.com");
    pstmt.executeUpdate();
}
```

## 2. Prevención de Inyecciones SQL
Uso de parámetros `?` precompilados.

## 3. Ejercicio Práctico
Creá una tabla `productos` e insertá 3 filas usando `PreparedStatement`.
