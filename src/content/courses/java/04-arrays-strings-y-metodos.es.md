---
course: 'java'
slug: '04-arrays-strings-y-metodos'
title: 'Arrays, Strings y Creación de Métodos'
description: 'Manipulá arreglos unidimensionales y matrices, manejá la clase String y organizá tu código en métodos reutilizables.'
order: 4
lang: 'es'
published: true
---

# Arrays, Strings y Creación de Métodos

Para construir programas más estructurados y complejos, necesitamos trabajar con colecciones homogéneas de datos de tamaño fijo (arrays), manipular texto de forma eficiente (`String` y `StringBuilder`), y modularizar nuestro código en métodos.

## 1. Arrays Unidimensionales

Un array es una estructura de datos de tamaño fijo que almacena elementos del mismo tipo en posiciones contiguas de memoria. Su índice comienza en `0`.

```java
// Declaración y creación
int[] numeros = new int[5]; // Array de 5 enteros inicializados en 0
numeros[0] = 10;
numeros[1] = 20;

// Declaración con valores iniciales
String[] frutas = {"Manzana", "Banana", "Naranja"};

// Recorrido con bucle for-each
for (String fruta : frutas) {
    System.out.println("Fruta: " + fruta);
}
```

## 2. Arrays Multidimensionales (Matrices)

Una matriz es un array de arrays (filas y columnas):

```java
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6}
};

// Acceso y recorrido de matriz
for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        System.out.print(matriz[i][j] + " ");
    }
    System.out.println();
}
```

## 3. Manipulación de Texto: `String` y `StringBuilder`

En Java, los objetos `String` son **inmutables** (no pueden cambiarse una vez creados). Si necesitás realizar múltiples modificaciones o concatenaciones en bucles, utilizá `StringBuilder` para mayor eficiencia de memoria.

```java
String saludo = "Hola, Java";
System.out.println("Longitud: " + saludo.length());
System.out.println("Mayúsculas: " + saludo.toUpperCase());
System.out.println("Contiene Java: " + saludo.contains("Java"));

// Uso eficiente de StringBuilder
StringBuilder sb = new StringBuilder();
sb.append("Hola");
sb.append(" ");
sb.append("Mundo");
String resultado = sb.toString(); // "Hola Mundo"
```

## 4. Creación de Métodos Estáticos

Un método es un bloque de código reutilizable que realiza una tarea específica.

```java
public class Calculadora {

    public static void main(String[] args) {
        int res = sumar(15, 25);
        imprimirResultado("Suma", res);
    }

    // Método con retorno
    public static int sumar(int a, int b) {
        return a + b;
    }

    // Método void (sin retorno)
    public static void imprimirResultado(String operacion, int valor) {
        System.out.println("Resultado de " + operacion + ": " + valor);
    }
}
```

## 5. Ejercicio Práctico
Creá un programa con un método llamado `encontrarMaximo` que reciba un array de enteros `int[]` y devuelva el número más grande dentro del array.
