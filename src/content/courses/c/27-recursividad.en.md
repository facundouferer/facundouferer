---
title: 'Recursion'
course: 'c'
slug: 'recursividad'
order: 27
lang: 'en'
published: true
---

La recursividad es una de esas ideas que al principio parecen confusas o "mágicas", pero cuando lográs visualizar qué pasa detrás de escena en la memoria de la computadora, te cambia la forma de programar para siempre.

En su definición más simple: **una función recursiva es una función que se llama a sí misma.**

En esta lección vas a aprender:
- Qué es la recursividad a través de una analogía sencilla del mundo real.
- Las dos reglas obligatorias de toda función recursiva (Caso Base y Paso Recursivo).
- Qué es el **Call Stack (Pila de llamadas)** y cómo funciona la memoria RAM durante la recursión.
- Qué es un **Stack Overflow** (y cómo evitar que tu programa se rompa).
- Ejemplos prácticos en C: Factorial y Fibonacci analizados paso a paso.
- Cuándo usar recursividad y cuándo es mejor usar un simple ciclo (`for` o `while`).

---

## La Analogía de las Cajas Anidadas

Imaginá que te regalan una caja de madera grande. Al abrirla, descubrís que adentro hay otra caja más chica. Y adentro de esa, otra más chica. Te dicen que en alguna de todas las cajas anidadas está la **llave del tesoro**.

¿Cómo harías un algoritmo para encontrarla? Tenés dos formas de resolverlo:

### Opción 1: El enfoque iterativo (Ciclos)
1. Armás una pila con las cajas que vas encontrando.
2. Mientras la pila no esté vacía:
   - Agarrás una caja.
   - Si adentro hay otra caja, la sumás a tu pila.
   - Si adentro está la llave, ¡terminaste!

### Opción 2: El enfoque recursivo (Llamarse a uno mismo)
1. Mirás el contenido de la caja actual.
2. Si encontrás otra caja, **hacés exactamente lo mismo** (llamar a la función de búsqueda sobre esa nueva caja).
3. Si encontrás la llave, ¡terminaste!

```text
Función BuscarLlave(Caja)
   1. Abrir Caja
   2. Si lo que hay adentro es la LLAVE -> ¡Terminar! (Caso Base)
   3. Si lo que hay adentro es otra CAJA -> BuscarLlave(NuevaCaja) (Paso Recursivo)
```

En la opción recursiva, no necesitás llevar una lista manual de las cajas que te quedan por revisar. La computadora se encarga de recordar en qué caja estabas de manera automática.

---

## Las Dos Reglas de Oro de la Recursividad

Si escribís una función que se llama a sí misma sin control, vas a congelar la computadora. Toda función recursiva correcta debe cumplir dos reglas estrictas:

1. **El Caso Base (La salida de emergencia)**: Es la condición que le dice a la función cuándo debe detenerse y empezar a devolver valores. Sin esto, la función se llamaría infinitamente.
2. **El Paso Recursivo (Acercarse a la salida)**: Es la llamada a la función a sí misma, pero **con un argumento modificado** que esté más cerca del caso base. Si llamás a la función siempre con el mismo valor, nunca vas a llegar a la condición de parada.

---

## ¿Qué pasa en la memoria? El Call Stack (Pila de llamadas)

Para entender la recursividad, tenés que entender el **Call Stack** (Pila de llamadas). 

Cuando tu programa ejecuta una función, la computadora reserva un bloque de memoria (llamado *Stack Frame* o Marco de Pila) para almacenar las variables locales y los parámetros de esa función. Este bloque se coloca arriba de una pila, como si fueran platos.

* Si la función `A` llama a la función `B`, el plato de `B` se pone arriba del de `A`.
* La computadora solo puede trabajar con el plato que está **arriba del todo**.
* Cuando la función `B` termina, su plato se retira y la computadora vuelve a la función `A` justo donde la había dejado.

### La traza de memoria con Factorial

El factorial de un número $N$ (escrito como $N!$) es el producto de todos los números desde $1$ hasta $N$. Por ejemplo, $3! = 3 \times 2 \times 1 = 6$.

Veamos la implementación en C:

```c
int factorial(int n) {
    // 1. Caso Base: Si n es 1, no hace falta calcular nada más
    if (n == 1) {
        return 1;
    } 
    // 2. Paso Recursivo: n es mayor a 1, multiplicamos n por el factorial de (n-1)
    else {
        return n * factorial(n - 1);
    }
}
```

Si llamamos a `factorial(3)`, mirá cómo se van apilando las funciones en el Call Stack:

```text
Paso 1: Llamamos a factorial(3)
[ factorial(3) -> espera que factorial(2) responda ]  <-- Cima del Stack

Paso 2: factorial(3) llama a factorial(2)
[ factorial(2) -> espera que factorial(1) responda ]  <-- Cima del Stack
[ factorial(3) -> esperando... ]

Paso 3: factorial(2) llama a factorial(1)
[ factorial(1) -> ¡Caso base! Devuelve 1 ]            <-- Cima del Stack
[ factorial(2) -> esperando... ]
[ factorial(3) -> esperando... ]
```

Una vez que llegamos al caso base (`factorial(1)` que devuelve `1`), la pila empieza a **desapilarse** y a resolver las operaciones pendientes de arriba hacia abajo:

```text
Paso 4: factorial(1) retorna 1. factorial(2) calcula: 2 * 1 = 2
[ factorial(2) -> retorna 2 ]                         <-- Cima del Stack
[ factorial(3) -> esperando... ]

Paso 5: factorial(2) retorna 2. factorial(3) calcula: 3 * 2 = 6
[ factorial(3) -> retorna 6 ]                         <-- Cima del Stack

Resultado Final: 6. La pila queda vacía.
```

---

## El peligro número uno: Stack Overflow (Desbordamiento de Pila)

¿Qué pasa si nos olvidamos del caso base o si el paso recursivo no se acerca a él?

```c
// ¡CUIDADO! Recursión infinita
void funcionInfinita() {
    funcionInfinita(); 
}
```

Cada llamada a `funcionInfinita()` va a poner un nuevo plato en la pila de memoria sin retirar los anteriores. Dado que la memoria física de la computadora es limitada, llegará un momento en el que la pila se llenará por completo. 

Cuando esto ocurre, el sistema operativo interrumpe el programa lanzando un error fatal: **Stack Overflow** (Desbordamiento de Pila). Tu programa se cerrará de golpe.

---

## Ejemplo Avanzado: La sucesión de Fibonacci

La famosa sucesión de Fibonacci empieza con $0$ y $1$, y cada término siguiente es la suma de los dos anteriores: $0, 1, 1, 2, 3, 5, 8, 13...$

```c
int fibonacci(int n) {
    // Casos base
    if (n == 0) return 0;
    if (n == 1) return 1;
    
    // Paso recursivo (doble llamada)
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### ¿Por qué Fibonacci recursivo es ineficiente?
Si llamás a `fibonacci(5)`, la función se divide en dos llamadas (`fibonacci(4)` y `fibonacci(3)`), y estas a su vez en otras dos, creando un **árbol de llamadas**:

```text
                     fib(5)
                   /        \
               fib(4)        fib(3)
              /      \      /      \
          fib(3)   fib(2) fib(2)   fib(1)
          /    \
      fib(2)  fib(1)
```

Fijate que `fibonacci(3)` se calcula **2 veces**, y `fibonacci(2)` se calcula **3 veces** de forma completamente independiente. Para números grandes (como `fibonacci(50)`), la computadora tendrá que realizar miles de millones de cálculos duplicados y tardará minutos o incluso horas en responder.

---

## Recursividad vs. Iteración: ¿Cuál elegir?

| Criterio | Recursividad | Iteración (Ciclos `for`/`while`) |
|---|---|---|
| **Estructura** | Código elegante, limpio y más fácil de leer en problemas jerárquicos (como árboles o gráficos). | Requiere más variables de control manuales, pero el código es muy secuencial. |
| **Memoria** | **Costo Alto**. Consume espacio en el Call Stack por cada llamada recursiva. | **Costo Bajo**. Utiliza una cantidad constante de memoria independientemente del número de repeticiones. |
| **Velocidad** | Más lenta debido al costo de crear y destruir marcos de pila en memoria. | Más rápida, ya que son saltos de instrucciones directos en el procesador. |

### Regla general:
* Usa **iteración** para tareas simples y lineales (recorrer un arreglo, contar números, acumuladores).
* Usa **recursividad** cuando estés trabajando con estructuras que se definen recursivamente (como árboles binarios, carpetas del sistema) o algoritmos de ordenación avanzados (*Merge Sort*, *Quick Sort*).

---

## Resumen de Aprendizajes

- La recursividad consiste en resolver un problema dividiéndolo en versiones más pequeñas de sí mismo.
- **Caso Base**: Detiene la función y evita un Stack Overflow.
- **Paso Recursivo**: Vuelve a llamar a la función modificando el argumento.
- La memoria de la computadora usa un **Call Stack** para recordar dónde iba cada función suspendida.
- La elegancia de la recursividad tiene un costo en velocidad y uso de memoria.
