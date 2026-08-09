---
course: 'java'
slug: '04-arrays-y-strings'
title: 'Arrays y Manejo de Strings en Java'
description: 'Dominá arreglos unidimensionales, matrices multidimensionales, la clase java.util.Arrays, la inmutabilidad de String y StringBuilder.'
order: 4
lang: 'es'
published: true
---

# Arrays y Manejo de Strings en Java

Para construir aplicaciones robustas en Java, el manejo eficiente de colecciones estáticas de datos y texto es un requisito fundamental. En esta lección aprenderás a manipular arreglos unidimensionales y multidimensionales, comprenderás el modelo de memoria de Java para objetos `String` y la pila (Stack) / montón (Heap), y descubrirás cuándo utilizar `StringBuilder` para optimizar el rendimiento.

---

## 1. Arreglos Unidimensionales (1D Arrays)

Un **array** es una estructura de datos de tamaño fijo que almacena elementos del mismo tipo en posiciones de memoria contiguas. Su índice inicial siempre es `0` y el último índice es `longitud - 1`.

![Modelo de Memoria para Arrays y Strings en Java](/img/courses/java/java-arrays-and-strings-memory.jpg)

### Declaración e Instanciación:
```java
// Opción 1: Declaración e instanciación vacía (valores por defecto)
int[] edades = new int[5]; // Se inicializan en 0

// Opción 2: Declaración con literales de inicialización
String[] lenguajes = {"Java", "Python", "TypeScript", "Go"};
```

### Valores por defecto al instanciar con `new`:
- `int`, `byte`, `short`, `long` $\rightarrow$ `0`
- `float`, `double` $\rightarrow$ `0.0`
- `boolean` $\rightarrow$ `false`
- Objetos / Referencias (`String`, etc.) $\rightarrow$ `null`

### Recorrido de Arrays:
```java
String[] frutas = {"Manzana", "Banana", "Naranja", "Frutilla"};

// Bucle tradicional (permite conocer el índice):
for (int i = 0; i < frutas.length; i++) {
    System.out.println("Índice " + i + ": " + frutas[i]);
}

// Bucle for-each (más limpio cuando no se requiere el índice):
for (String fruta : frutas) {
    System.out.println("Fruta: " + fruta);
}
```

---

## 2. Arrays Multidimensionales (Matrices)

En Java, una matriz es conceptualmente un **array de arrays**.

```java
// Matriz de 3 filas x 3 columnas
int[][] tablero = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Recorrido con bucles anidados:
for (int fila = 0; fila < tablero.length; fila++) {
    for (int col = 0; col < tablero[fila].length; col++) {
        System.out.print(tablero[fila][col] + "\t");
    }
    System.out.println(); // Salto de línea por fila
}
```

---

## 3. La Clase Utilitaria `java.util.Arrays`

Java incluye la clase `java.util.Arrays` con métodos estáticos para realizar operaciones comunes:

```java
import java.util.Arrays;

public class EjemploArrays {
    public static void main(String[] args) {
        int[] numeros = {42, 12, 89, 7, 23};

        // 1. Imprimir array de forma legible
        System.out.println("Original: " + Arrays.toString(numeros));

        // 2. Ordenar de menor a mayor (In-place quicksort/timsort)
        Arrays.sort(numeros);
        System.out.println("Ordenado: " + Arrays.toString(numeros));

        // 3. Búsqueda binaria (requiere que esté ordenado previamente)
        int indice = Arrays.binarySearch(numeros, 23);
        System.out.println("Índice del valor 23: " + indice);

        // 4. Copia parcial o total de array
        int[] copia = Arrays.copyOf(numeros, 3); // Copia los primeros 3 elementos
        System.out.println("Copia: " + Arrays.toString(copia));
    }
}
```

---

## 4. Manipulación de Texto: La Clase `String`

En Java, la clase `String` representa cadenas de caracteres. A diferencia de tipos primitivos, los `String` son **objetos inmutables**: una vez creados, su valor en memoria no puede ser modificado.

### String Constant Pool (El Pool de Strings):
Para optimizar memoria, la JVM mantiene una zona especial dentro de la memoria Heap llamada **String Constant Pool**. Cuando creás un `String` usando comillas dobles (`"Hola"`), la JVM verifica si ya existe en el pool y reutiliza la referencia en lugar de crear un objeto duplicado.

```java
String s1 = "Java";
String s2 = "Java";
String s3 = new String("Java");

System.out.println(s1 == s2);      // true  (apuntan a la misma referencia en el Pool)
System.out.println(s1 == s3);      // false (new crea un objeto nuevo en Heap fuera del Pool)
System.out.println(s1.equals(s3)); // true  (compara el contenido textual)
```

> **Regla de Oro**: Para comparar el **contenido** de dos cadenas en Java, usá SIEMPRE `.equals()` o `.equalsIgnoreCase()`. NUNCA usá `==`, ya que `==` compara referencias de memoria.

### Métodos Esenciales de `String`:
```java
String texto = "  Aprendiendo Java en 2026  ";

System.out.println(texto.length());             // 28 (longitud total)
System.out.println(texto.trim());               // Limpia espacios al inicio y final
System.out.println(texto.toUpperCase());        // Convierte a mayúsculas
System.out.println(texto.contains("Java"));     // true
System.out.println(texto.indexOf("Java"));      // 14 (índice donde inicia)
System.out.println(texto.substring(14, 18));    // "Java" (extrae rango de caracteres)
System.out.println(texto.replace("2026", "2027"));// Reemplaza texto
```

---

## 5. Concatenación Eficiente con `StringBuilder`

Dado que `String` es inmutable, realizar múltiples concatenaciones dentro de un bucle genera cientos de objetos temporales en la memoria Heap que el Recolector de Basura deberá limpiar posteriormente.

Para operaciones intensivas de construcción de texto, usá **`StringBuilder`**:

```java
// INEFICIENTE (Genera 1000 objetos temporales en Heap):
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado += i + ", ";
}

// EFICIENTE (Modifica un único buffer mutable en memoria):
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(", ");
}
String resultadoEficiente = sb.toString();
```

---

## 6. Ejercicio Práctico Guiado

### Desafío: Verificador de Palíndromos
Escribí un programa en Java que reciba una cadena de texto, elimine espacios e ignore mayúsculas/minúsculas, y determine si es un **Palíndromo** (un texto que se lee igual de izquierda a derecha que de derecha a izquierda).

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.Scanner;

public class VerificadorPalindromo {
    public static void main(String[] args) {
        String texto = "Neuquen";
        
        // 1. Normalizar: quitar espacios y pasar a minúsculas
        String limpio = texto.replaceAll("\\s+", "").toLowerCase();
        
        // 2. Invertir usando StringBuilder
        String invertido = new StringBuilder(limpio).reverse().toString();
        
        // 3. Comparar contenido
        boolean esPalindromo = limpio.equals(invertido);
        
        System.out.println("Texto original: " + texto);
        System.out.println("¿Es palíndromo?: " + esPalindromo);
    }
}
```
</details>
