---
title: 'Data Types'
course: 'javascript'
slug: 'tipos-de-datos'
order: 3
lang: 'en'
published: true
---

# Data Types

## Primitive Types
- **Number:** Numbers of any kind (integers or decimals).
- **String:** Text strings.
- **Boolean:** `true` or `false`.

## The "Crazy Values"
JavaScript has unique behaviors with certain values that can be confusing at first:

### 1. NaN (Not-a-Number)
Occurs when you perform an invalid math operation (e.g., `"hello" * 2`).
- Fun fact: `typeof NaN` is `"number"`.
- `NaN === NaN` is `false`! You must use `isNaN()` to check for it.

### 2. null
Represents the intentional absence of a value. It is an object (`typeof null` is `"object"`).

### 3. undefined
Means a variable has been declared but not assigned a value yet.

### 4. Falsy Values
In boolean contexts (like an `if`), these values evaluate to `false`:
- `0`
- `""` (empty string)
- `null`
- `undefined`
- `NaN`
- `false`

### The `typeof` operator
Use it to know what data type a variable has at that moment.

```javascript
let x = 10;
console.log(typeof x); // "number"
```
