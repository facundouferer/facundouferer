---
title: 'Control Structures'
course: 'javascript'
slug: 'estructuras-de-control'
order: 5
lang: 'en'
published: true
---

# Control Structures

Control structures let your code make decisions based on conditions.

## Conditionals

### if / else if / else
This is the most common way to branch the program flow.

```javascript
let edad = 18;

if (edad >= 18) {
    console.log("You can enter");
} else if (edad >= 16) {
    console.log("You can enter with a guardian");
} else {
    console.log("You cannot enter");
}
```

### Ternary Operator
A short way to write a simple `if/else`.
`condition ? value_if_true : value_if_false`

```javascript
const mensaje = edad >= 18 ? "Adult" : "Minor";
```

### switch
Ideal for comparing a variable against multiple fixed values.

```javascript
let dia = 1;
switch(dia) {
    case 1: console.log("Monday"); break;
    case 2: console.log("Tuesday"); break;
    default: console.log("Other day");
}
```

## When to use each?
- **`if`**: When you have complex conditions (`a > 10 && b < 5`) or ranges.
- **`switch`**: When comparing a single value against many specific options (e.g., days of the week, user types).
