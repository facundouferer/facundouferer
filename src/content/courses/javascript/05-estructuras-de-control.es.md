---
title: 'Estructuras de Control'
course: 'javascript'
slug: 'estructuras-de-control'
order: 5
lang: 'es'
published: true
---

# Estructuras de Control

Las estructuras de control permiten que tu código tome decisiones basadas en condiciones.

## Condicionales

### if / else if / else
Es la forma más común de ramificar el flujo del programa.

```javascript
let edad = 18;

if (edad >= 18) {
    console.log("Podés pasar");
} else if (edad >= 16) {
    console.log("Pasás con tutor");
} else {
    console.log("No podés pasar");
}
```

### Operador Ternario
Una forma corta de escribir un `if/else` simple.
`condicion ? valor_si_true : valor_si_false`

```javascript
const mensaje = edad >= 18 ? "Adulto" : "Menor";
```

### switch
Ideal para comparar una variable contra múltiples valores fijos.

```javascript
let dia = 1;
switch(dia) {
    case 1: console.log("Lunes"); break;
    case 2: console.log("Martes"); break;
    default: console.log("Otro día");
}
```

## ¿Cuándo usar cada uno?
- **`if`**: Cuando tenés condiciones complejas (`a > 10 && b < 5`) o rangos.
- **`switch`**: Cuando comparás un solo valor contra muchas opciones específicas (ej: días de la semana, tipos de usuario).