---
title: 'Operators and Type Conversion'
course: 'javascript'
slug: 'operadores-y-conversion'
order: 4
lang: 'en'
published: true
---

# Operadores y Conversión

## Operadores Básicos

### Aritméticos
- `+`, `-`, `*`, `/`
- `%` (Módulo: resto de la división)
- `++`, `--` (Incremento y decremento)

### Comparación
- `==` (Igualdad: ignora el tipo de dato).
- `===` (Igualdad estricta: ¡Recomendado! Compara valor y tipo).
- `!=`, `!==` (Desigualdad).
- `>`, `<`, `>=`, `<=`

### Lógicos
- `&&` (AND)
- `||` (OR)
- `!` (NOT)

### Asignación
- `=`, `+=`, `-=`, `*=`, `/=`

## Conversión de Datos (Casting)

A veces necesitás transformar un tipo en otro:

```javascript
// A Número
Number("123"); // 123
parseInt("10.5"); // 10
parseFloat("10.5"); // 10.5

// A String
String(123); // "123"
(123).toString(); // "123"

// A Boolean
Boolean(1); // true
Boolean(0); // false
```
