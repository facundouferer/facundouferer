---
course: 'java'
slug: '03-control-de-flujo-y-bucles'
title: 'Control de Flujo y Estructuras Repetitivas'
description: 'Aprendé a tomar decisiones con condicionales y a repetir tareas con bucles en Java.'
order: 3
lang: 'es'
published: true
---

# Control de Flujo y Estructuras Repetitivas

Las estructuras de control de flujo permiten alterar la secuencia de ejecución de un programa en función de condiciones o repetir un bloque de código múltiples veces.

## 1. Condicionales: `if`, `else if`, `else`

Permiten ejecutar código solo cuando se cumple una condición lógica:

```java
int nota = 85;

if (nota >= 90) {
    System.out.println("Excelente");
} else if (nota >= 70) {
    System.out.println("Aprobado");
} else {
    System.out.println("Reprobado");
}
```

### Operador Ternario
Sintaxis corta para asignaciones condicionales simples:
```java
String resultado = (nota >= 70) ? "Aprobado" : "Reprobado";
```

## 2. La Estructura `switch`

Es ideal cuando necesitamos evaluar múltiples valores posibles de una misma variable.

```java
int dia = 3;

switch (dia) {
    case 1:
        System.out.println("Lunes");
        break;
    case 2:
        System.out.println("Martes");
        break;
    case 3:
        System.out.println("Miércoles");
        break;
    default:
        System.out.println("Día no válido");
        break;
}
```

> **Java Moderno (Switch Expressions):**
> ```java
> String nombreDia = switch (dia) {
>     case 1 -> "Lunes";
>     case 2 -> "Martes";
>     case 3 -> "Miércoles";
>     default -> "Día no válido";
> };
> ```

## 3. Bucles e Iteración

### Bucle `for`
Utilizado cuando conocemos de antemano el número de iteraciones:

```java
for (int i = 1; i <= 5; i++) {
    System.out.println("Iteración número: " + i);
}
```

### Bucle `while`
Evalúa la condición **antes** de ejecutar el bloque:

```java
int contador = 0;
while (contador < 3) {
    System.out.println("Contador: " + contador);
    contador++;
}
```

### Bucle `do-while`
Garantiza que el bloque se ejecute **al menos una vez**, ya que la condición se evalúa al final:

```java
int numero = 10;
do {
    System.out.println("Se ejecuta al menos una vez");
} while (numero < 5);
```

## 4. Control de Bucles: `break` y `continue`

- `break`: Interrumpe e interrumpe inmediatamente el bucle.
- `continue`: Salta la iteración actual y pasa a la siguiente.

```java
for (int i = 1; i <= 10; i++) {
    if (i == 5) continue; // Salta el 5
    if (i == 8) break;    // Detiene el bucle en el 8
    System.out.print(i + " "); // Imprime: 1 2 3 4 6 7
}
```

## 5. Ejercicio Práctico
Escribí un programa en Java que use un bucle para calcular la suma de todos los números pares entre 1 y 100 e imprima el resultado final.
