---
title: 'Introducción a C'
course: 'c'
slug: 'introduccion-y-estructura'
order: 1
lang: 'es'
published: true
---

Antes de aprender a escribir instrucciones en C, necesitas entender una idea mucho más importante: **qué es un programa y qué estamos haciendo realmente cuando programamos**.

Programar no es tipear código porque sí. Programar es **describir una solución paso a paso** para que una computadora pueda ejecutarla.

**Objetivos**

- Explicar qué es un programa, qué es un lenguaje de programación y qué es un paradigma.
- Reconocer para qué se usa C hoy y por qué vale la pena aprenderlo.
- Conocer cómo está organizado el curso: el estándar que usamos, el comando de compilación y sus tres niveles.
- Identificar las partes de un programa en C: `#include <stdio.h>`, `int main(void)`, el bloque entre llaves, las sentencias, los comentarios y `return 0;`.
- Escribir, compilar y ejecutar tu primer programa.

**Requisitos previos:** ninguno. Esta es la primera lección del curso.

> Idea clave: antes de construir una casa, primero entiendes los planos, los materiales y la lógica de la estructura. En programación pasa exactamente lo mismo.

## ¿Qué es un programa?

Un **programa** es un conjunto de instrucciones escritas de forma ordenada para que una computadora realice una tarea.

Por ejemplo, un programa puede servir para:

- mostrar un mensaje en pantalla
- realizar cálculos
- guardar información
- controlar un dispositivo
- resolver un problema paso a paso

Lo importante no es solo que "haga algo", sino que lo haga siguiendo una secuencia precisa de instrucciones.

Si una persona te dice:

> "prepara el desayuno"

tú puedes completar mentalmente los pasos que faltan.

Pero una computadora no trabaja así. La computadora necesita instrucciones claras, concretas y ordenadas.

Por eso un programa debe estar escrito con precisión.

## ¿Qué significa programar?

**Programar** es diseñar y escribir esas instrucciones para resolver un problema.

Eso implica:

1. entender el problema
2. pensar una solución
3. traducir esa solución a un lenguaje de programación

Aquí está una de las primeras verdades importantes del curso: **primero está la lógica, después viene el código**.

Muchos principiantes quieren saltarse esta parte y empezar a escribir cosas sin entender qué están resolviendo. Eso es un error.

Primero piensas.
Después organizas.
Recién al final escribes código.

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

> "suma estos dos números y muéstralos en pantalla"

La computadora trabaja con instrucciones muy precisas.

Los lenguajes de programación existen para permitirnos escribir esas instrucciones de manera que:

- nosotros podamos entenderlas y mantenerlas
- una herramienta pueda traducirlas para que la máquina las ejecute

En el caso de C, esa herramienta es el **compilador**: transforma el código fuente que escribimos en un programa **ejecutable**.

## ¿Qué es C y por qué aprenderlo?

El lenguaje **C** es uno de los lenguajes más importantes de la historia de la programación. Nació a comienzos de los años setenta para escribir el sistema operativo Unix y desde entonces nunca dejó de usarse.

Fue diseñado para crear software eficiente, cercano al funcionamiento real de la máquina y con gran control sobre los recursos.

Aprender C es valioso porque:

- ayuda a entender mejor cómo funciona una computadora
- obliga a ser preciso con los datos y las instrucciones
- da una base muy sólida para aprender otros lenguajes después

C no "te esconde" tanto lo que pasa como otros lenguajes más modernos. Y eso, al aprender, es una gran ventaja.

Sí, al principio puede parecer más exigente. Pero justamente por eso enseña fundamentos de verdad.

### ¿Para qué se usa C hoy?

C no es un lenguaje de museo. Hoy se usa para:

- **sistemas operativos**: el núcleo de Linux está escrito en C, y también buena parte de los núcleos de Windows y macOS
- **sistemas embebidos**: microcontroladores de autos, electrodomésticos, equipos médicos y dispositivos IoT
- **intérpretes y lenguajes**: el intérprete principal de Python (CPython) y el de Lua están escritos en C
- **bases de datos y herramientas**: SQLite, PostgreSQL, Redis y Git
- **bibliotecas de alto rendimiento**: compresión, criptografía, gráficos y redes que luego usan otros lenguajes

Cuando un lenguaje como Python o JavaScript necesita velocidad o hablar directamente con el sistema, muy a menudo termina llamando a código escrito en C.

## ¿Qué es un paradigma de programación?

Aquí aparece una palabra que al principio suena complicada, pero la idea no lo es tanto.

Un **paradigma de programación** es una forma de pensar y organizar la solución de un problema al programar.

O sea: no habla solo del lenguaje, sino del **enfoque mental** con el que construyes el programa.

Dos personas pueden resolver un problema parecido usando estilos muy distintos de programación. Eso tiene que ver con los paradigmas.

Piénsalo como estilos de construcción:

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

C trabaja principalmente con este paradigma. Por eso C es excelente para empezar a entender cómo se ejecuta un programa.

### 2. Paradigma procedural

El paradigma **procedural** es una forma de organizar programas imperativos en partes o bloques de tareas.

En vez de poner todo junto sin estructura, el programa se divide en secciones que cumplen funciones concretas.

C también se asocia fuertemente con este paradigma. Lo vas a notar mejor cuando empieces a dividir programas en funciones.

### 3. Paradigma orientado a objetos

En este paradigma, los programas se organizan alrededor de **objetos** que combinan datos y comportamiento.

Lenguajes como Java o C# son muy conocidos por usar este enfoque. C **no** es un lenguaje orientado a objetos; en el módulo complementario del curso verás cómo se pueden aplicar algunas de esas ideas de diseño en C, y cuáles son sus límites.

### 4. Paradigma funcional

En el paradigma funcional, se busca resolver problemas poniendo mucho foco en el uso de funciones y en transformar datos de manera controlada.

Es otro enfoque importante, pero no es el punto de partida en C.

## Entonces, ¿qué paradigma usa C?

C se usa principalmente con un estilo:

- **imperativo**
- **procedural**

Y eso tiene muchísimo sentido para principiantes, porque te obliga a entender:

- el orden de ejecución
- la estructura del programa
- cómo se representan los datos
- cómo se expresa una solución paso a paso

En otras palabras: C es ideal para construir fundamentos.

## Cómo funciona este curso

Antes de escribir código, conviene saber con qué reglas vamos a trabajar.

### El estándar del curso: C23

C no pertenece a una empresa. Lo define un **estándar** internacional (ISO/IEC 9899) que se actualiza cada varios años: C89, C99, C11, C17 y, el más reciente, **C23**.

Este curso usa **ISO C23** y compila siempre con este comando:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
```

- `-std=c23` pide el estándar C23.
- `-Wall -Wextra -Wpedantic` activan las advertencias: el compilador te avisa de errores probables y de código que se aparta del estándar.

Necesitas **GCC 14 o posterior**, o **Clang 18 o posterior** (con Clang el comando es igual, cambiando `gcc` por `clang`). La regla del curso es que todo programa **compila sin advertencias**.

> **Portabilidad:** si tu compilador es más antiguo y no reconoce `-std=c23`, usa `-std=c2x`. Cuando un tema cambia entre C17 y C23, la lección lo marca en un recuadro como este.

En la lección 3, [Compilación, enlazado y advertencias](/cursos/c/compilacion-y-enlazado), verás en detalle qué hace cada parte de ese comando, qué etapas atraviesa el código y cómo leer los mensajes del compilador.

### Los tres niveles del curso

El curso avanza en tres niveles:

1. **Aprender a programar** (módulos 1 y 2): lógica, algoritmos, datos y control de flujo.
2. **Dominar C** (módulos 3 a 8): funciones, tipos derivados, punteros, memoria, biblioteca estándar y organización modular.
3. **Práctica profesional** (módulos 9 a 11): depuración, pruebas, portabilidad, herramientas y C moderno.

Los dos últimos módulos, **C moderno y C23** y **Diseño de software en C**, son **opcionales**: profundizan para quien quiere ir más allá, pero no son requisito para completar el curso.

Cada lección empieza con sus objetivos y requisitos previos y termina con ejercicios prácticos resueltos. Además, cada lección tiene una autoevaluación y un proyecto para practicar.

## Buenas prácticas de programación desde el día uno

Las buenas prácticas no se agregan al final. **Se aprenden desde el principio**.

Si desde la primera lección te acostumbras a programar desordenado, después corregir eso cuesta muchísimo.

### 1. Escribe código claro

Tu código tiene que ser entendible. No alcanza con que "funcione": también tiene que poder leerse.

### 2. Usa nombres descriptivos

Desde ahora incorpora esta idea:

- los malos nombres confunden
- los buenos nombres explican la intención

Por ejemplo, esto es pobre:

```c
int x;
```

Esto comunica mejor:

```c
int edad;
```

### 3. Mantén el código ordenado

El orden visual importa.

- usa sangría consistente
- respeta los espacios
- no pegues todo sin estructura

Código ordenado = código más fácil de entender.

### 4. Comenta con criterio

Los comentarios sirven para explicar, pero no para reemplazar código claro.

Un comentario útil aclara una intención. Un comentario inútil repite lo obvio.

### 5. No escribas cosas que todavía no entiendes

Si copias estructuras sin entenderlas, no estás aprendiendo a programar: estás imitando símbolos.

Primero entiende el concepto. Después escribe el código.

### 6. Respeta la sintaxis

En C, los detalles importan mucho.

- los paréntesis importan
- las llaves importan
- el punto y coma importa
- las mayúsculas y minúsculas importan: `int` es una palabra del lenguaje, `Int` no

No es "casi igual". En programación, casi igual suele significar incorrecto.

## Estructura de un programa en C

Ahora sí: veamos cómo se organiza un programa básico en C.

```c
#include <stdio.h>

int main(void) {
    printf("Hola, mundo\n");
    return 0;
}
```

Aunque todavía no entiendas cada detalle, vamos a desarmarlo parte por parte.

### Parte 1: directiva de preprocesador

La primera línea es `#include <stdio.h>`.

Empieza con `#`, lo cual indica que es una **directiva de preprocesador**: una indicación que se procesa antes de compilar.

`#include` incorpora al programa las declaraciones de un archivo de cabecera. `stdio.h` es la cabecera de **entrada y salida estándar** (*standard input/output*), y es la que nos permite usar `printf`.

### Parte 2: la función `main`

La línea `int main(void) {` abre la función `main`.

`main` es el **punto de entrada** del programa: cuando el programa empieza a ejecutarse, comienza por la primera sentencia de `main`.

Todavía no hace falta que entiendas qué es una función en profundidad. Por ahora alcanza con esta idea:

> `main` es el lugar donde comienza la ejecución del programa.

Cada parte de `int main(void)` significa algo:

- `int`: `main` devuelve un número entero cuando termina.
- `main`: el nombre obligatorio de la función principal.
- `(void)`: `main` no recibe datos.

La forma `void main` aparece en libros viejos y en algunos tutoriales, pero **no es C estándar**: `main` siempre devuelve `int`. En este curso nunca la usamos.

> **C básico:** en C17 y anteriores, `int main()` con los paréntesis vacíos significa "sin decir qué parámetros recibe", no "sin parámetros". Por eso se escribe `int main(void)`.
>
> **C moderno (C23):** en C23, `int main()` y `int main(void)` significan lo mismo. Igual seguimos escribiendo `(void)`: deja la intención explícita y funciona con cualquier versión del estándar.

### Parte 3: llaves `{}`

Las llaves `{` y `}` delimitan el **bloque** de instrucciones que pertenece a `main`.

Todo lo que está dentro de esas llaves forma parte del programa principal.

### Parte 4: sentencias

Dentro de `main` aparecen `printf("Hola, mundo\n");` y `return 0;`.

Cada una es una **sentencia**, es decir, una instrucción que forma parte del programa. Se ejecutan una después de otra, en el orden en que aparecen.

En C, las sentencias terminan con `;`. Ese punto y coma no es decorativo: forma parte de la sintaxis. Si falta, el programa no compila.

### Parte 5: salida en pantalla con `printf`

`printf("Hola, mundo\n");` muestra texto en pantalla.

`printf` escribe exactamente el texto que recibe entre comillas. La secuencia `\n` significa **salto de línea**: lo que se escriba después aparece en la línea siguiente. Si un `printf` no termina en `\n`, el próximo texto sigue en la misma línea.

`printf` tiene muchas más posibilidades que verás en la lección de [entrada y salida](/cursos/c/entrada-y-salida).

### Parte 6: finalización del programa con `return 0`

`return 0;` indica que `main` terminó y devolvió el valor `0`.

Ese valor se entrega al sistema operativo, y `0` es la convención para decir "todo salió bien". `return` no muestra nada en pantalla. Por eso `main` termina con `return 0;`.

## Comentarios en C

Los comentarios son textos que escribimos para explicar el código y que el compilador ignora.

Hay dos formas:

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

Un truco útil: si pones `//` delante de una sentencia, esa sentencia deja de ejecutarse, porque se convierte en comentario.

Pero ojo: si el código necesita comentarios para explicarlo todo, muchas veces el problema no es la falta de comentarios, sino que el código está mal nombrado o mal organizado.

## Ejemplo completo con partes señaladas

```c
#include <stdio.h>

/*
   Muestra un saludo de bienvenida al curso.
*/
int main(void) {
    // Muestra el mensaje en dos líneas
    printf("Hola, mundo\n");
    printf("Bienvenida al curso de C\n");

    // Finaliza el programa indicando que todo salió bien
    return 0;
}
```

En este ejemplo puedes reconocer:

- una directiva de preprocesador
- la función principal `main`
- un bloque delimitado por llaves
- sentencias terminadas en `;`
- comentarios de una y de varias líneas

## Tu primer programa: compilar y ejecutar

1. Guarda el ejemplo anterior en un archivo llamado `hola.c`.
2. Compílalo con el comando del curso:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic hola.c -o hola
   ```

3. Si el compilador no muestra ningún mensaje, se creó el ejecutable `hola`. Ejecútalo:

   ```bash
   ./hola
   ```

La salida es:

```text
Hola, mundo
Bienvenida al curso de C
```

Si el compilador muestra un error o una advertencia, léelo con calma: indica el archivo, la línea y qué esperaba encontrar. En la lección 3 aprenderás a interpretar esos mensajes.

## Resumen

- un **programa** es una secuencia de instrucciones para resolver una tarea
- **programar** es pensar una solución y expresarla en un lenguaje formal
- un **lenguaje de programación** permite escribir instrucciones para la computadora; en C, el compilador las transforma en un ejecutable
- un **paradigma** es una forma de organizar y pensar la solución; C se usa principalmente desde los paradigmas **imperativo** y **procedural**
- C se usa hoy en sistemas operativos, sistemas embebidos, intérpretes, bases de datos y bibliotecas de alto rendimiento
- el curso usa el estándar **C23** y compila con `gcc -std=c23 -Wall -Wextra -Wpedantic`, sin advertencias
- un programa básico en C tiene `#include <stdio.h>`, `int main(void)`, un bloque entre llaves, sentencias terminadas en `;` y `return 0;`
- las buenas prácticas empiezan desde el primer día

## Idea final

No subestimes esta lección por ser la primera.

Aquí no estás aprendiendo "solo el saludo inicial" del lenguaje. Estás aprendiendo **cómo pensar un programa**.

Y eso vale más que memorizar veinte líneas de código sin entender nada.

## Ejercicios prácticos

### Ejercicio 1: encuentra los errores

Este programa tiene tres errores. Encuéntralos y escribe la versión corregida.

<!-- c-check: skip -->
```c
#include <stdio.h>

Int main(void) {
    printf("Mi primer programa\n")
    printf("Funciona\n");
}
```

<details><summary>Ver solución</summary>

1. `Int` debe escribirse `int`: C distingue mayúsculas de minúsculas.
2. Falta el `;` al final del primer `printf`.
3. Falta `return 0;` al final de `main`.

```c
#include <stdio.h>

int main(void) {
    printf("Mi primer programa\n");
    printf("Funciona\n");
    return 0;
}
```

</details>

### Ejercicio 2: predice la salida

¿Qué muestra este programa? Escribe la salida exacta, línea por línea, antes de ejecutarlo.

```c
#include <stdio.h>

int main(void) {
    printf("Uno, ");
    printf("dos\n");
    // printf("tres\n");
    printf("cuatro\n");
    return 0;
}
```

<details><summary>Ver solución</summary>

```text
Uno, dos
cuatro
```

El primer `printf` no termina en `\n`, así que `dos` sigue en la misma línea. La línea de `tres` es un comentario y no se ejecuta.

</details>

### Ejercicio 3: tu tarjeta de presentación

Escribe un programa completo que muestre tres líneas: tu nombre, el nombre del curso y una meta personal. Incluye un comentario de varias líneas que explique qué hace el programa y compílalo con el comando del curso sin advertencias.

<details><summary>Ver solución</summary>

Una solución posible:

```c
#include <stdio.h>

/*
   Muestra una tarjeta de presentación de tres líneas:
   nombre, curso y meta personal.
*/
int main(void) {
    printf("Nombre: Ana Torres\n");
    printf("Curso: C de Cero a Profesional\n");
    printf("Meta: escribir código claro\n");
    return 0;
}
```

Se compila con `gcc -std=c23 -Wall -Wextra -Wpedantic tarjeta.c -o tarjeta` y se ejecuta con `./tarjeta`.

</details>

### Ejercicio 4: lenguaje, paradigma y estándar

Responde con tus palabras:

1. ¿Cuál es la diferencia entre un lenguaje de programación y un paradigma?
2. ¿Qué indica la opción `-std=c23` del comando de compilación?
3. ¿Por qué en este curso nunca se escribe `void main`?

<details><summary>Ver solución</summary>

1. Un lenguaje es la herramienta formal con la que escribimos instrucciones (C, Java, Python). Un paradigma es una forma de pensar y organizar la solución (imperativo, procedural, orientado a objetos, funcional). C se usa principalmente con los paradigmas imperativo y procedural.
2. Le pide al compilador que use el estándar ISO C23, el que sigue el curso. Con compiladores antiguos se usa `-std=c2x`.
3. Porque el estándar de C establece que `main` devuelve un `int`. La forma correcta es `int main(void)` con `return 0;` al final.

</details>
