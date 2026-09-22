---
course: 'java'
slug: '05-metodos-y-funciones'
title: 'Métodos y Funciones en Java'
description: 'Comprendé la modularización de código, firmas de métodos, retorno de valores, pasaje por valor vs referencia, sobrecarga y la pila de llamadas (Call Stack).'
order: 6
lang: 'es'
published: true
---

# Métodos y Funciones en Java

En programación, un **método** (conocido también como función o procedimiento) es un bloque de código reutilizable diseñado para realizar una tarea específica. La modularización mediante métodos permite aplicar el principio **DRY** (*Don't Repeat Yourself*), mejorando la legibilidad, mantenibilidad y testabilidad de nuestras aplicaciones.

En esta lección aprenderás a definir métodos, manejar parámetros y valores de retorno, comprenderás el modelo de ejecución de Java basado en **Pasaje por Valor**, la sobrecarga de métodos y la Pila de Llamadas (*Call Stack*).

---

## 1. Declaración y Sintaxis de un Método

La firma general de un método en Java se compone de los siguientes elementos:

```java
[modificadores] <tipo_de_retorno> nombreDelMetodo([tipo param1, tipo param2, ...]) {
    // Cuerpo del método
    return valor; // (Requerido si el tipo de retorno no es void)
}
```

### Ejemplo fundamental:
```java
public class OperacionesMatematicas {

    // Método con retorno entero (int):
    public static int multiplicar(int a, int b) {
        return a * b;
    }

    // Método void (sin retorno):
    public static void mostrarMensaje(String mensaje) {
        System.out.println("[LOG]: " + mensaje);
    }

    public static void main(String[] args) {
        int resultado = multiplicar(6, 7);
        mostrarMensaje("El resultado de la multiplicación es: " + resultado);
    }
}
```

---

## 2. La Pila de Llamadas (Call Stack) y el Pasaje de Parámetros

Cuando se ejecuta una aplicación Java, la JVM administra un área de memoria llamada **Stack** (Pila). Cada vez que se invoca un método, la JVM crea un marco de pila (**Stack Frame**) que almacena sus variables locales y parámetros.

![Diagrama del Modelo de Ejecución de Métodos y Pila de Llamadas en Java](/img/courses/java/java-method-call-stack.jpg)

### Principio Fundamental: Java es Estrictamente Pasaje por Valor (Pass-by-Value)

En Java **NUNCA existe el pasaje por referencia puro**. Todos los argumentos se pasan copiando su valor:

1. **Para Tipos Primitivos (`int`, `double`, `boolean`, etc.)**:
   Se pasa una **copia del valor numérico/lógico**. Modificar el parámetro dentro del método no afecta a la variable original del llamador.

2. **Para Objetos y Arrays**:
   Se pasa una **copia del valor de la referencia** (la dirección de memoria). El método puede modificar el *contenido interno* del objeto, pero no puede reasignar la variable del llamador a un nuevo objeto en memoria.

### Demostración Práctica:
```java
public class DemostracionPasajeValor {

    public static void main(String[] args) {
        int x = 10;
        modificarPrimitivo(x);
        System.out.println("x en main: " + x); // Sigue siendo 10

        int[] numeros = {1, 2, 3};
        modificarArray(numeros);
        System.out.println("numeros[0] en main: " + numeros[0]); // Cambió a 99
    }

    public static void modificarPrimitivo(int numero) {
        numero = 500; // Solo modifica la copia local en el Stack Frame
    }

    public static void modificarArray(int[] arr) {
        arr[0] = 99; // Modifica el objeto en el Heap apuntado por la referencia
    }
}
```

---

## 3. Sobrecarga de Métodos (Method Overloading)

La **Sobrecarga** permite definir múltiples métodos con el **mismo nombre** dentro de una misma clase, siempre y cuando tengan **diferentes firmas** (distinta cantidad, tipo o secuencia de parámetros).

La JVM determina automáticamente qué método ejecutar según los argumentos enviados en la llamada:

```java
public class CalculadoraAvanzada {

    // 1. Suma de dos enteros
    public static int sumar(int a, int b) {
        return a + b;
    }

    // 2. Suma de tres enteros (distinto número de parámetros)
    public static int sumar(int a, int b, int c) {
        return a + b + c;
    }

    // 3. Suma de dos números decimales (distinto tipo de parámetros)
    public static double sumar(double a, double b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(sumar(5, 10));        // Llama a la versión 1 (int, int)
        System.out.println(sumar(5, 10, 15));    // Llama a la versión 2 (int, int, int)
        System.out.println(sumar(3.5, 2.5));     // Llama a la versión 3 (double, double)
    }
}
```

---

## 4. Métodos Estáticos (`static`) vs Métodos de Instancia

Hasta ahora hemos declarado nuestros métodos utilizando la palabra clave `static`.

- **Métodos Estáticos (`static`)**:
  - Pertenecen a la **clase** en sí.
  - Se pueden invocar directamente usando `NombreClase.nombreMetodo()` sin instanciar objetos con `new`.
  - Ideales para funciones de utilidad matemática o transformaciones puras (ej: `Math.max()`, `Math.sqrt()`).
- **Métodos de Instancia (sin `static`)**:
  - Pertenecen a los **objetos** creados a partir de la clase.
  - Pueden acceder al estado interno y atributos del objeto (profundizaremos en ellos en el módulo de POO).

---

## 5. Introducción a la Recursión

Un método es **recursivo** cuando se llama a sí mismo dentro de su propio cuerpo para resolver un problema dividiéndolo en subproblemas más pequeños.

Todo método recursivo requiere obligatoriamente dos partes:
1. **Caso Base**: Condición de parada que interrumpe las llamadas recursivas para evitar un `StackOverflowError`.
2. **Caso Recursivo**: Llamada al propio método reduciendo el problema hacia el caso base.

### Ejemplo Clásico: Factorial de un número ($n!$)
```java
public class RecursividadDemo {

    public static long factorial(int n) {
        // 1. Caso Base
        if (n <= 1) {
            return 1;
        }
        // 2. Caso Recursivo
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println("Factorial de 5: " + factorial(5)); // Output: 120
    }
}
```

Esta versión introductoria de `factorial` ilustra la estructura, pero acepta negativos como si fueran un caso base y puede desbordar `long`. No debería exponerse como API sin validar y acotar la entrada, como haremos a continuación.

### Formas de recursión

- **Recursión directa:** un método se llama a sí mismo, como `factorial`.
- **Recursión indirecta o recursión mutua:** un método llama a otro que finalmente vuelve a llamar al primero. Deben compartir una condición de terminación coherente.
- **Recursión de cola:** la llamada recursiva es la última operación del método; no queda un cálculo pendiente al regresar.

```java
static boolean esPar(int n) {
    if (n < 0) return false; // n inválido: valor centinela documentado
    if (n == 0) return true;
    return esImpar(n - 1); // Recursión indirecta
}

static boolean esImpar(int n) {
    if (n < 0) return false; // n inválido: valor centinela documentado
    if (n == 0) return false;
    return esPar(n - 1);   // Recursión mutua
}

static long sumarCola(int n, long acumulado) {
    if (n == 0) return acumulado;
    return sumarCola(n - 1, acumulado + n); // Recursión de cola
}
```

Aunque `sumarCola` tiene forma de cola, **Java no garantiza la optimización de llamadas de cola**. Cada llamada puede conservar su marco. Una profundidad `n` consume `O(n)` de pila y puede producir `StackOverflowError`; escribir la llamada al final no la vuelve segura.

### Ejemplo recursivo validado y acotado

El siguiente método acepta solo una profundidad conocida. El límite es parte del contrato, no una promesa de que todas las JVM soporten exactamente esa cantidad de marcos:

```java
public final class SumaRecursiva {
    private static final int MAX_RECURSIVE_DEPTH = 1_000;

    public static long sumarHasta(int n) {
        if (n < 0) {
            System.out.println("n no puede ser negativo");
            return -1; // valor centinela documentado: ninguna suma válida es negativa
        }
        if (n > MAX_RECURSIVE_DEPTH) {
            System.out.println("n supera el límite recursivo: " + MAX_RECURSIVE_DEPTH);
            return -1;
        }
        if (n == 0) {
            return 0; // Caso base
        }
        return n + sumarHasta(n - 1); // Recursión directa
    }
}
```

El caso base cubre `0`, cada llamada reduce `n` y la validación rechaza entradas que se alejan del dominio o exceden el límite. El tiempo es `O(n)` y la pila adicional también es `O(n)`.

### Cuándo preferir iteración

Usá recursión cuando la estructura del problema sea naturalmente recursiva —por ejemplo, árboles, divide-and-conquer o backtracking— y la profundidad esté acotada o controlada. Preferí un bucle o una pila explícita cuando:

- la entrada puede ser muy grande o proviene de una fuente no confiable;
- el problema es una secuencia lineal como contar, sumar o recorrer un array;
- necesitás consumo de memoria predecible;
- no podés demostrar que cada llamada avanza hacia un caso base.

Una versión iterativa de la suma usa `O(1)` de memoria adicional y evita depender del tamaño de la pila. La recursión no es “más avanzada” que un bucle: es una herramienta con un costo concreto.

---

## 6. Ejercicio Práctico Guiado

### Desafío: Biblioteca de Métodos Utilitarios
Escribí una clase Java llamada `EstadisticaUtils.java` que contenga:
1. Un método sobrecargado `promedio(int[] numeros)` y `promedio(double[] numeros)`.
2. Un método `obtenerMayor(int[] numeros)` que retorne el valor máximo.
3. Un método `imprimirResumen(String titulo, double resultado)` que presente los valores en pantalla.

<details>
<summary>Ver solución sugerida</summary>

```java
public class EstadisticaUtils {

    public static double promedio(int[] numeros) {
        double suma = 0;
        for (int num : numeros) {
            suma += num;
        }
        return numeros.length > 0 ? suma / numeros.length : 0;
    }

    public static double promedio(double[] numeros) {
        double suma = 0;
        for (double num : numeros) {
            suma += num;
        }
        return numeros.length > 0 ? suma / numeros.length : 0;
    }

    public static int obtenerMayor(int[] numeros) {
        int max = numeros[0];
        for (int num : numeros) {
            if (num > max) {
                max = num;
            }
        }
        return max;
    }

    public static void imprimirResumen(String titulo, double resultado) {
        System.out.println("----------------------------------------");
        System.out.println(" " + titulo + ": " + resultado);
        System.out.println("----------------------------------------");
    }

    public static void main(String[] args) {
        int[] notas = {8, 9, 10, 7, 9};
        double prom = promedio(notas);
        int notaMaxima = obtenerMayor(notas);

        imprimirResumen("Promedio General", prom);
        imprimirResumen("Nota Máxima", notaMaxima);
    }
}
```
</details>
