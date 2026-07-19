---
title: 'Lambdas e Interfaces Funcionales'
course: 'java'
slug: 'lambdas-interfaces'
order: 10
lang: 'es'
published: true
---

# Lambdas e Interfaces Funcionales

Java permite el paradigma de programación funcional desde la versión 8.

## Interfaces Funcionales

Es una interfaz que tiene exactamente un método abstracto. Se suelen marcar con `@FunctionalInterface`.

```java
@FunctionalInterface
public interface Operacion {
    int ejecutar(int a, int b);
}
```

## Expresiones Lambda

Son una forma concisa de implementar una interfaz funcional sin crear una clase completa.

**Sintaxis:** `(parámetros) -> expresión`

```java
// Ejemplo de lambda para sumar
Operacion suma = (a, b) -> a + b;
System.out.println(suma.ejecutar(5, 3)); // 8
```

## Stream API y Aplicaciones

Las lambdas son muy potentes cuando se usan con colecciones:

- `forEach`: Recorre elementos.
- `filter`: Filtra elementos según una condición.
- `map`: Transforma elementos.
- `anyMatch` / `allMatch`: Verifica condiciones.

### Ejemplo:
```java
List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5, 6);
List<Integer> pares = numeros.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
// Resultado: [2, 4, 6]
```