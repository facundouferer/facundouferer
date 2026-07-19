---
title: 'Strings and Functions'
course: 'java'
slug: 'strings-y-funciones'
order: 7
lang: 'en'
published: true
---

# Strings y Funciones

## El tipo String

A diferencia de los tipos primitivos, `String` es un objeto que representa una secuencia de caracteres.

### Inmutabilidad
Los Strings en Java son inmutables. Si cambias el valor de un String, Java crea un objeto nuevo en memoria.

```java
String saludo = "Hola";
saludo = saludo + " mundo"; // Se crea un nuevo objeto "Hola mundo"
```

### Métodos útiles de String
- `length()`: Tamaño del texto.
- `toUpperCase()` / `toLowerCase()`: Cambiar a mayúsculas/minúsculas.
- `contains("texto")`: Verifica si contiene una palabra.
- `indexOf("a")`: Busca la posición de un carácter.
- `equals("otro")`: Compara contenidos (¡no uses `==`!).

## Funciones (Métodos)

Una función es un bloque de código reutilizable que realiza una tarea específica.

```java
public static int suma(int a, int b) {
    return a + b;
}

// Llamada:
int resultado = suma(5, 3);
```

### Estructura de una función:
1. **Tipo de retorno:** El dato que devuelve (`int`, `String`, `void` si no devuelve nada).
2. **Nombre:** Para identificarla.
3. **Parámetros:** Datos que recibe para trabajar.
4. **Cuerpo:** El código dentro de `{ }`.
