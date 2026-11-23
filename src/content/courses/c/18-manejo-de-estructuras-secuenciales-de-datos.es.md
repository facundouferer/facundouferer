---
title: 'Estructuras Secuenciales'
course: 'c'
slug: 'manejo-de-estructuras-secuenciales-de-datos'
description: 'Comprende por qué agrupar colecciones de datos en secuencia, la diferencia entre acceso secuencial y acceso directo, y cuándo usar un contenedor de tamaño fijo.'
order: 18
lang: 'es'
published: true
---

Hasta ahora cada dato de tus programas vivía en su propia variable. Eso funciona con tres o cuatro valores, pero un programa real maneja listas de notas, temperaturas de un mes o los caracteres de un nombre. Esta lección es un puente: explica **por qué** necesitamos estructuras que guarden muchos datos en orden y **qué preguntas** conviene hacerse sobre ellas antes de escribir la primera línea. La lección siguiente enseña la primera de esas estructuras en C, el **arreglo**.

## Objetivos

- Explicar por qué las variables sueltas no escalan cuando hay muchos datos del mismo tipo.
- Definir qué es una estructura secuencial de datos.
- Distinguir **acceso secuencial** de **acceso directo** (también llamado acceso aleatorio).
- Distinguir **tamaño estático** de **tamaño dinámico**.
- Ubicar en el curso las estructuras secuenciales que vas a estudiar y cuándo conviene cada una.

**Requisitos previos:** `sentencia-for` y `sentencia-while` (ciclos), `modularizacion-subprogramas-y-funciones` (funciones).

## El problema: variables sueltas

Supón que quieres el promedio de cinco notas. Con lo que sabes hasta ahora, escribirías algo así:

```c
#include <stdio.h>

int main(void) {
    int nota1 = 8;
    int nota2 = 6;
    int nota3 = 10;
    int nota4 = 7;
    int nota5 = 9;

    double promedio = (nota1 + nota2 + nota3 + nota4 + nota5) / 5.0;
    printf("Promedio: %.2f\n", promedio);
    return 0;
}
```

El programa es correcto, pero tiene un límite serio:

- **No escala.** Con 30 notas necesitas 30 variables y una suma de 30 términos.
- **No se puede recorrer.** Un ciclo `for` no puede "pasar" de `nota1` a `nota2`: son nombres distintos, no posiciones de algo común.
- **La cantidad queda fija en el código.** Si el curso tiene 31 alumnos, hay que reescribir el programa.

Lo que falta es una forma de decir "estas cinco notas son **un solo conjunto ordenado**, y quiero la nota que está en la posición 3".

## ¿Qué es una estructura secuencial de datos?

Una **estructura secuencial de datos** guarda varios elementos **uno detrás de otro**, en un orden. Cada elemento tiene un lugar en la secuencia: hay un primero, un segundo, y así hasta el último.

```text
posición:   0    1    2    3    4
nota:       8    6   10    7    9
```

Dos ideas cambian la forma de programar:

1. El conjunto tiene **un solo nombre** (por ejemplo, `notas`).
2. Cada elemento se identifica por su **posición**, que es un número. Como es un número, un ciclo puede generarla: `0, 1, 2, 3, 4`.

En C las posiciones empiezan en `0`. La lección siguiente explica por qué y cómo se escribe; por ahora basta con la idea.

## Acceso secuencial y acceso directo

No todas las secuencias permiten llegar a un elemento de la misma manera.

**Acceso secuencial.** Para llegar al elemento 4 hay que pasar por el 0, el 1, el 2 y el 3. Es como una cinta de música o una fila de personas tomadas de la mano: solo conoces al primero y cada uno te lleva al siguiente.

**Acceso directo (o aleatorio).** Puedes ir al elemento 4 sin mirar los anteriores, porque sabes exactamente dónde está. Es como una fila de casilleros numerados: vas directo al casillero 4.

| | Acceso directo | Acceso secuencial |
| --- | --- | --- |
| Llegar al elemento `k` | un solo paso, cualquiera sea `k` | `k` pasos desde el inicio |
| Ejemplo en C | arreglo (lecciones 19 y 20) | lista enlazada (lección 30) |
| Insertar en el medio | hay que correr los elementos siguientes | se "engancha" un elemento nuevo |

"Aleatorio" no significa "al azar": significa que puedes pedir **cualquier** posición en el orden que quieras y llegar con el mismo costo.

## Tamaño estático y tamaño dinámico

La otra pregunta clave es **cuántos elementos caben** y quién lo decide.

**Tamaño estático.** La cantidad máxima de elementos, la **capacidad**, se fija al escribir el programa y no cambia mientras se ejecuta. Si reservas lugar para 30 notas y llegan 31, la nota 31 no tiene dónde ir. Los arreglos de este módulo son así.

**Tamaño dinámico.** La estructura pide más espacio mientras el programa corre, a medida que llegan datos. Para eso hace falta pedir memoria al sistema en tiempo de ejecución, algo que verás en la lección `memoria-dinamica` (28) y que usan las listas, pilas y colas del módulo 7.

Con tamaño estático aparecen dos números distintos que conviene no confundir nunca:

- la **capacidad**: cuántos elementos caben como máximo;
- la **cantidad usada**: cuántos elementos tienen datos válidos ahora.

Una lista de inscriptos puede tener capacidad 40 y cantidad usada 27. Los ejemplos de las lecciones 19 y 20 llevan siempre esos dos números por separado.

## Operaciones típicas sobre una secuencia

Sea cual sea la estructura, casi todos los programas hacen las mismas operaciones:

- **recorrer**: visitar los elementos uno por uno (para mostrarlos, sumarlos, contarlos);
- **buscar**: averiguar si un valor está y en qué posición;
- **insertar** y **eliminar**: agregar o quitar un elemento;
- **actualizar**: cambiar el valor de una posición;
- **ordenar**: dejar los elementos de menor a mayor (o según otro criterio).

Lo que cambia de una estructura a otra es **cuánto cuesta** cada operación. Insertar al principio de un arreglo obliga a correr todos los elementos; en una lista enlazada es inmediato. Leer el elemento 500 de un arreglo es inmediato; en una lista hay que recorrer 500 nodos. Elegir bien la estructura es elegir qué operaciones quieres que sean baratas.

## El mapa del módulo

| Estructura | Acceso | Tamaño | Dónde se estudia |
| --- | --- | --- | --- |
| Arreglo | directo | estático | lecciones 19 y 20 |
| Cadena de caracteres (un arreglo de `char` con una marca de fin) | directo | estático | lección 21 |
| Búsqueda y ordenación sobre arreglos | directo | estático | lecciones 23 y 24 |
| Lista enlazada, pila, cola | secuencial | dinámico | lecciones 30 a 32 |

## Resumen

- Las variables sueltas no escalan ni se pueden recorrer con un ciclo.
- Una estructura secuencial guarda elementos en orden bajo un solo nombre, y cada elemento se identifica por su posición.
- Con **acceso directo** se llega a cualquier posición en un paso; con **acceso secuencial** hay que pasar por las anteriores.
- Con **tamaño estático** la capacidad se fija al escribir el programa; con **tamaño dinámico** crece en ejecución (lección 28).
- Capacidad y cantidad usada son números distintos.

## Ejercicios prácticos

### Ejercicio 1: ¿directo o secuencial?

Para cada situación, indica si el acceso es directo o secuencial y por qué:

1. Elegir la canción 7 de una lista de reproducción en el celular.
2. Llegar al vagón 7 de un tren caminando desde la locomotora.
3. Abrir el casillero 7 de un vestuario.
4. Escuchar el tema 7 de un casete sin botón de avance rápido.

<details><summary>Ver solución</summary>

1. **Directo**: el reproductor salta a la posición 7 sin reproducir las anteriores.
2. **Secuencial**: hay que atravesar los vagones 1 a 6.
3. **Directo**: el número del casillero indica dónde está.
4. **Secuencial**: la cinta tiene que pasar por los temas 1 a 6.

</details>

### Ejercicio 2: ¿estático o dinámico?

Indica qué tamaño conviene en cada caso y qué capacidad elegirías si es estático:

1. Las temperaturas máximas de cada día de una semana.
2. Los mensajes de un chat que el usuario puede seguir escribiendo sin límite.
3. Las notas de un curso que nunca supera los 40 alumnos.

<details><summary>Ver solución</summary>

1. **Estático**, capacidad 7: una semana siempre tiene 7 días.
2. **Dinámico**: no hay un máximo conocido al escribir el programa; la estructura tiene que crecer en ejecución.
3. **Estático**, capacidad 40, y una cantidad usada que puede ser menor (por ejemplo, 27 inscriptos).

</details>

### Ejercicio 3: capacidad y cantidad usada

Un programa reserva lugar para 10 pedidos. Ya registró 6. Responde:

1. ¿Cuál es la capacidad y cuál la cantidad usada?
2. ¿Cuántos pedidos más se pueden registrar?
3. Si se elimina un pedido, ¿qué número cambia?
4. ¿Qué debería hacer el programa si llega un pedido y la cantidad usada ya es igual a la capacidad?

<details><summary>Ver solución</summary>

1. Capacidad 10, cantidad usada 6.
2. Cuatro más (10 − 6).
3. Solo la cantidad usada (pasa a 5); la capacidad de una estructura estática no cambia.
4. Rechazar el pedido y avisarlo (por ejemplo, con un mensaje de error). Escribir más allá de la capacidad no es una opción: en C eso es un error grave que verás en la lección 19.

</details>

### Ejercicio 4: elegir estructura

Una aplicación muestra un ranking de 100 jugadores y el usuario pide con frecuencia "el jugador en el puesto 57". Casi nunca se agregan jugadores en el medio. ¿Conviene acceso directo o secuencial? Justifica con el costo de la operación más frecuente.

<details><summary>Ver solución</summary>

Acceso directo (un arreglo). La operación frecuente es leer una posición concreta: con acceso directo cuesta un paso; con acceso secuencial costaría 57 pasos. La desventaja del arreglo (insertar en el medio obliga a correr elementos) casi no importa, porque esa operación es rara.

</details>
