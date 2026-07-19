---
title: 'Operators and Type Conversion'
course: 'javascript'
slug: 'operadores-y-conversion'
order: 4
lang: 'en'
published: true
---

# Operators and Type Conversion

## Basic Operators

### Arithmetic
- `+`, `-`, `*`, `/`
- `%` (Modulus: remainder of division)
- `++`, `--` (Increment and decrement)

### Comparison
- `==` (Equality: ignores data type).
- `===` (Strict equality: Recommended! Compares value and type).
- `!=`, `!==` (Inequality).
- `>`, `<`, `>=`, `<=`

### Logical
- `&&` (AND)
- `||` (OR)
- `!` (NOT)

### Assignment
- `=`, `+=`, `-=`, `*=`, `/=`

## Data Conversion (Casting)

Sometimes you need to convert one type to another:

```javascript
// To Number
Number("123"); // 123
parseInt("10.5"); // 10
parseFloat("10.5"); // 10.5

// To String
String(123); // "123"
(123).toString(); // "123"

// To Boolean
Boolean(1); // true
Boolean(0); // false
```
