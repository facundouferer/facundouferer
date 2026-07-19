---
title: 'Data Types'
course: 'javascript'
slug: 'tipos-de-datos'
order: 3
lang: 'en'
published: true
---

# Tipos de Datos

## Tipos Primitivos
- **Number:** Números de cualquier tipo (enteros o decimales).
- **String:** Cadenas de texto.
- **Boolean:** `true` o `false`.

## Los "Valores Locos"
JavaScript tiene comportamientos únicos con ciertos valores que pueden confundir al principio:

### 1. NaN (Not-a-Number)
Ocurre cuando hacés una operación matemática inválida (ej: `"hola" * 2`).
- Dato curioso: `typeof NaN` es `"number"`.
- ¡`NaN === NaN` es `false`! Debés usar `isNaN()` para verificarlo.

### 2. null
Representa la ausencia intencionada de un valor. Es un objeto (`typeof null` es `"object"`).

### 3. undefined
Significa que una variable ha sido declarada pero no se le ha asignado ningún valor todavía.

### 4. Falsy Values
En contextos booleanos (como un `if`), estos valores se evalúan como `false`:
- `0`
- `""` (cadena vacía)
- `null`
- `undefined`
- `NaN`
- `false`

### El operador `typeof`
Sirve para saber qué tipo de dato tiene una variable en ese momento.

```javascript
let x = 10;
console.log(typeof x); // "number"
```
