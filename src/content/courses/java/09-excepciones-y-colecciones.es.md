---
title: 'Excepciones y Colecciones'
course: 'java'
slug: 'excepciones-y-colecciones'
order: 9
lang: 'es'
published: true
---

# Excepciones y Colecciones

## Excepciones

Las excepciones son eventos que ocurren durante la ejecución y rompen el flujo normal del programa.

### Manejo con `try-catch-finally`

```java
try {
    int resultado = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Error: No puedes dividir por cero.");
} finally {
    System.out.println("Este código siempre se ejecuta.");
}
```

- **Verificadas (Checked):** El compilador te obliga a manejarlas (ej: `IOException`).
- **No verificadas (Unchecked):** Errores lógicos (ej: `NullPointerException`).

## Colecciones

Son estructuras que permiten manejar grupos de objetos de forma flexible (a diferencia de los arrays).

- **Listas (`ArrayList`):** Permiten elementos duplicados y mantienen el orden.
- **Sets:** No permiten duplicados.
- **Maps:** Almacenan pares clave-valor.

```java
List<String> nombres = new ArrayList<>();
nombres.add("Java");
nombres.add("Spring");
```