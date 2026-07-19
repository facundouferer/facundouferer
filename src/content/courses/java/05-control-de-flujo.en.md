---
title: 'Flow Control'
course: 'java'
slug: 'control-de-flujo'
order: 5
lang: 'en'
published: true
---

# Control de Flujo

Las estructuras de control nos permiten decidir qué camino sigue nuestro programa basándose en condiciones o repitiendo tareas.

## Estructuras Condicionales

### El bloque `if / else`
Permite ejecutar código solo si se cumple una condición.

```java
int num = 10;
if (num > 0) {
    System.out.println("Es positivo");
} else if (num == 0) {
    System.out.println("Es cero");
} else {
    System.out.println("Es negativo");
}
```

### Estructura `switch-case`
Ideal para evaluar una sola variable contra múltiples valores posibles.

```java
int dia = 1;
switch(dia) {
    case 1: System.out.println("Lunes"); break;
    case 2: System.out.println("Martes"); break;
    default: System.out.println("Otro día");
}
```

## Estructuras de Repetición (Bucles)

### Bucle `while`
Repite mientras la condición sea verdadera.

```java
int i = 0;
while (i < 5) {
    System.out.println("Contando: " + i);
    i++;
}
```

### Bucle `for`
Ideal cuando sabemos cuántas veces queremos repetir algo.

```java
for (int j = 0; j < 5; j++) {
    System.out.println("Iteración: " + j);
}
```
