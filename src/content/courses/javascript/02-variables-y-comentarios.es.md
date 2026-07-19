---
title: 'Variables, Constantes y Comentarios'
course: 'javascript'
slug: 'variables-y-comentarios'
order: 2
lang: 'es'
published: true
---

# Variables, Constantes y Comentarios

## Comentarios
Los comentarios son notas que dejamos en el código para nosotros u otros desarrolladores. No se ejecutan.

- **Línea simple:** Se usa `//`.
- **Bloque (múltiples líneas):** Se usa `/* ... */`.

```javascript
// Este es un comentario de una sola línea
/*
   Este es un comentario
   que abarca varias líneas
*/
```

## Declaración de variables

JavaScript tiene tres palabras clave para crear contenedores de datos:

1. **`var`**: Forma antigua. Tiene ámbito de función y puede dar problemas de confusión (evitá usarla).
2. **`let`**: Forma moderna. Permite reasignar valores y tiene ámbito de bloque.
3. **`const`**: Para valores que no van a cambiar. Una vez asignado, no se puede modificar.

### El ámbito (Scope)
Es el lugar donde una variable vive y es accesible.
- **Global:** Fuera de cualquier función o bloque.
- **Local / Bloque:** Dentro de `{ }`, como en un `if` o una función.

```javascript
if (true) {
    let mensaje = "Hola"; // Solo vive dentro de este bloque
    var saludo = "Buen día"; // Escapa al bloque (problema de var)
}
console.log(saludo); // Funciona
console.log(mensaje); // ¡Error! ReferenceError
```

**Regla de oro:** Usá `const` por defecto. Si necesitás cambiar el valor más adelante, usá `let`.