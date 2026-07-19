---
title: 'Introduction to C'
course: 'c'
slug: 'introduccion-y-estructura'
order: 1
lang: 'en'
published: true
---

Antes de aprender a escribir instrucciones en C, necesitás entender una idea mucho más importante: **qué es un programa y qué estamos haciendo realmente cuando programamos**.

Programar no es tipear código porque sí. Programar es **describir una solución paso a paso** para que una computadora pueda ejecutarla.

En esta primera lección vas a aprender:

- qué es un programa
- qué es un lenguaje de programación
- qué son los paradigmas de programación
- cuáles son los paradigmas más conocidos
- buenas prácticas básicas al empezar a programar
- cómo es la estructura general de un programa en C

> Idea clave: antes de construir una casa, primero entendés los planos, los materiales y la lógica de la estructura. En programación pasa EXACTAMENTE lo mismo.

## ¿Qué es un programa?

Un **programa** es un conjunto de instrucciones escritas de forma ordenada para que una computadora realice una tarea.

Por ejemplo, un programa puede servir para:

- mostrar un mensaje en pantalla
- realizar cálculos
- guardar información
- controlar un dispositivo
- resolver un problema paso a paso

Lo importante no es solo que “haga algo”, sino que lo haga siguiendo una secuencia precisa de instrucciones.

Si una persona te dice:

> “prepará mate”

vos podés completar mentalmente los pasos que faltan.

Pero una computadora no trabaja así. La computadora necesita instrucciones claras, concretas y ordenadas.

Por eso un programa debe estar escrito con precisión.

## ¿Qué significa programar?

**Programar** es diseñar y escribir esas instrucciones para resolver un problema.

Eso implica:

1. entender el problema
2. pensar una solución
3. traducir esa solución a un lenguaje de programación

Acá está una de las primeras verdades importantes del curso: **primero está la lógica, después viene el código**.

Muchos principiantes quieren saltear esta parte y empezar a escribir cosas sin entender qué están resolviendo. Eso es un error.

Primero pensás.
Después organizás.
Recién al final escribís código.

## ¿Qué es un lenguaje de programación?

Un **lenguaje de programación** es un lenguaje formal que permite escribir instrucciones usando reglas precisas de sintaxis y significado.

Dicho más simple: es la forma en que nos comunicamos con la computadora para decirle qué queremos que haga.

Así como los seres humanos usamos idiomas como español o inglés, en informática usamos lenguajes como C, Java, Python o JavaScript para expresar soluciones.

Cada lenguaje tiene:

- su propia sintaxis
- sus propias reglas
- su propia forma de organizar los programas

## ¿Por qué usamos lenguajes de programación?

Porque la computadora, en su nivel más básico, no entiende frases humanas como:

> “sumá estos dos números y mostrálos en pantalla”

La computadora trabaja con instrucciones muy precisas.

Los lenguajes de programación existen para permitirnos escribir esas instrucciones de manera que:

- nosotros podamos entenderlas y mantenerlas
- una herramienta pueda traducirlas para que la máquina las ejecute

En el caso de C, el código fuente que escribimos se compila para transformarse en un programa ejecutable.

## ¿Qué es C y por qué aprenderlo?

El lenguaje **C** es uno de los lenguajes más importantes de la historia de la programación.

Fue diseñado para crear software eficiente, cercano al funcionamiento real de la máquina y con gran control sobre los recursos.

Aprender C es valioso porque:

- ayuda a entender mejor cómo piensa una computadora
- obliga a ser preciso con los datos y las instrucciones
- da una base muy sólida para aprender otros lenguajes después

C no “te esconde” tanto lo que pasa como otros lenguajes más modernos. Y eso, al aprender, es buenísimo.

Sí, al principio puede parecer más exigente. Pero justamente por eso enseña fundamentos de verdad.

## ¿Qué es un paradigma de programación?

Acá aparece una palabra que al principio suena complicada, pero la idea no lo es tanto.

Un **paradigma de programación** es una forma de pensar y organizar la solución de un problema al programar.

O sea: no habla solo del lenguaje, sino del **enfoque mental** con el que construís el programa.

Dos personas pueden resolver un problema parecido usando estilos muy distintos de programación.

Eso tiene que ver con los paradigmas.

Pensalo como estilos de construcción:

- una casa se puede construir con distintos métodos
- todos buscan resolver la necesidad de habitar un espacio
- pero la forma de organizar materiales, tareas y estructura puede cambiar

En programación pasa igual.

## Tipos de paradigmas de programación

Existen varios paradigmas. En esta etapa no hace falta dominarlos en profundidad, pero sí entender que existen.

### 1. Paradigma imperativo

En el paradigma **imperativo**, el programa se construye indicando **paso a paso** qué debe hacer la computadora.

La idea central es:

- guardar datos
- modificar datos
- ejecutar instrucciones en cierto orden

C trabaja principalmente con este paradigma.

Por eso C es excelente para empezar a entender cómo se ejecuta un programa.

### 2. Paradigma procedural

El paradigma **procedural** es una forma de organizar programas imperativos en partes o bloques de tareas.

En vez de poner todo junto sin estructura, el programa se divide en secciones que cumplen funciones concretas.

C también se asocia fuertemente con este paradigma.

Más adelante en el curso lo vas a notar mejor cuando empieces a dividir programas en partes más organizadas.

### 3. Paradigma orientado a objetos

En este paradigma, los programas se organizan alrededor de **objetos** que combinan datos y comportamiento.

Lenguajes como Java o C# son muy conocidos por usar este enfoque.

En este curso no vamos a empezar por ahí, porque primero necesitás una base más fundamental.

### 4. Paradigma funcional

En el paradigma funcional, se busca resolver problemas poniendo mucho foco en el uso de funciones y en transformar datos de manera controlada.

Es otro enfoque importante, pero no es el punto de partida en C inicial.

## Entonces, ¿qué paradigma usa C?

C se enseña principalmente como un lenguaje de estilo:

- **imperativo**
- **procedural**

Y eso tiene muchísimo sentido para principiantes, porque te obliga a entender:

- el orden de ejecución
- la estructura del programa
- cómo se representan los datos
- cómo se expresa una solución paso a paso

En otras palabras: C es ideal para construir fundamentos.

## Buenas prácticas de programación desde el día uno

Acá te voy a decir algo importante, loco: las buenas prácticas no se agregan al final. **Se aprenden desde el principio**.

Si desde la primera lección te acostumbrás a programar desordenado, después corregir eso cuesta muchísimo.

### 1. Escribí código claro

Tu código tiene que ser entendible.

No alcanza con que “funcione”. También tiene que poder leerse.

### 2. Usá nombres descriptivos

Aunque más adelante veas más ejemplos, desde ahora tenés que incorporar esta idea:

- malos nombres confunden
- buenos nombres explican la intención

Por ejemplo, esto es pobre:

```c
int x;
```

Esto comunica mejor:

```c
int edad;
```

### 3. Mantené el código ordenado

El orden visual importa.

- usá sangría consistente
- respetá los espacios
- no pegues todo sin estructura

Código ordenado = código más fácil de entender.

### 4. Comentá con criterio

Los comentarios sirven para explicar, pero no para reemplazar código claro.

Un comentario útil aclara una intención.

Un comentario inútil repite lo obvio.

### 5. No escribas cosas que todavía no entendés

Esta práctica te ahorra muchísimos problemas.

Si copiás estructuras sin entenderlas, no estás aprendiendo a programar: estás imitando símbolos.

Primero entendé el concepto.
Después escribí el código.

### 6. Respetá la sintaxis

En C, los detalles importan mucho.

- los paréntesis importan
- las llaves importan
- el punto y coma importa
- las mayúsculas y minúsculas importan

No es “casi igual”. En programación, casi igual suele significar incorrecto.

## Estructura de un programa en C

Ahora sí: veamos cómo se organiza un programa básico en C.

```c
#include <stdio.h>

int main() {
    printf("Hola, mundo\n");
    return 0;
}
```

Aunque todavía no entiendas cada detalle, vamos a desarmarlo parte por parte.

## Parte 1: directiva de preprocesador

```c
#include <stdio.h>
```

Esta línea comienza con `#`, lo cual indica que es una **directiva de preprocesador**.

En este caso, `#include` le dice al programa que incorpore lo necesario para poder usar ciertas herramientas de entrada y salida.

`stdio.h` es una biblioteca estándar muy usada en C.

En esta etapa, lo importante es que reconozcas esta línea como parte habitual de programas sencillos que muestran información en pantalla.

## Parte 2: la función `main`

```c
int main() {
```

La función `main` es el punto de entrada del programa.

Eso significa que cuando el programa empieza a ejecutarse, comienza por ahí.

Todavía no hace falta que entiendas profundamente qué es una función. Por ahora alcanza con esta idea:

> `main` es el lugar principal donde comienza la ejecución del programa.

### ¿Qué significa `int` antes de `main`?

Significa que `main` devuelve un valor entero al finalizar.

No hace falta profundizar demasiado todavía. Lo importante es reconocer que esa forma:

```c
int main()
```

es la estructura habitual del programa principal en C.

## Parte 3: llaves `{}`

```c
{
    printf("Hola, mundo\n");
    return 0;
}
```

Las llaves indican el bloque de instrucciones que pertenece a `main`.

Todo lo que está dentro de esas llaves forma parte del programa principal.

## Parte 4: sentencias

Dentro de `main` aparecen estas líneas:

```c
printf("Hola, mundo\n");
return 0;
```

Cada una es una **sentencia**, es decir, una instrucción que forma parte del programa.

En C, las sentencias normalmente terminan con `;`.

Ese punto y coma no es decorativo. Forma parte de la sintaxis.

## Parte 5: salida en pantalla con `printf`

```c
printf("Hola, mundo\n");
```

Esta instrucción muestra texto en pantalla.

Por ahora no hace falta estudiar `printf` en profundidad, porque eso pertenece mejor a la lección de entrada y salida.

En esta primera lección solo nos interesa reconocer que:

- es una instrucción escrita dentro de `main`
- sirve para mostrar un mensaje
- termina con `;`

## Parte 6: finalización del programa con `return 0`

```c
return 0;
```

Esta línea indica que el programa principal terminó y devolvió el valor `0`.

En programas básicos en C, se usa para señalar que la ejecución finalizó correctamente.

No hace falta ir más lejos por ahora. Lo importante es reconocer que suele aparecer al final de `main`.

## Comentarios en C

Los comentarios son textos que escribimos para explicar el código y que la computadora no ejecuta.

Hay dos formas básicas:

### Comentario de una línea

```c
// Este es un comentario de una línea
```

### Comentario de varias líneas

```c
/*
   Este es un comentario
   de varias líneas
*/
```

Los comentarios sirven para documentar ideas importantes o aclarar partes del código.

Pero ojo: si el código necesita comentarios para explicar TODO, muchas veces el problema no es la falta de comentarios, sino que el código está mal nombrado o mal organizado.

## Ejemplo completo con partes señaladas

```c
#include <stdio.h>

int main() {
    // Muestra un mensaje en pantalla
    printf("Hola, mundo\n");

    // Finaliza el programa
    return 0;
}
```

En este ejemplo podés reconocer:

- una directiva de preprocesador
- la función principal `main`
- un bloque delimitado por llaves
- sentencias terminadas en `;`
- comentarios

## Qué deberías llevarte de esta primera lección

Si esta lección quedó clara, ya entendés varias ideas grandes:

- un programa es un conjunto de instrucciones
- un lenguaje de programación es la herramienta con la que escribimos esas instrucciones
- un paradigma es una manera de pensar la solución
- C se trabaja principalmente desde un enfoque imperativo y procedural
- programar bien no es solo escribir código que compile, sino escribir código claro y ordenado
- un programa en C tiene una estructura básica reconocible

## Resumen

- un **programa** es una secuencia de instrucciones para resolver una tarea
- **programar** es pensar una solución y expresarla en un lenguaje formal
- un **lenguaje de programación** permite escribir instrucciones para la computadora
- un **paradigma** es una forma de organizar y pensar la solución
- C se usa principalmente desde los paradigmas **imperativo** y **procedural**
- las buenas prácticas empiezan desde el primer día
- un programa básico en C suele incluir `#include`, `main`, sentencias, llaves y `return 0`

## Idea final

No subestimes esta lección por ser la primera.

Acá no estás aprendiendo “solo el saludo inicial” del lenguaje. Estás aprendiendo **cómo pensar un programa**.

Y eso, hermano, vale más que memorizar veinte líneas de código sin entender nada.
