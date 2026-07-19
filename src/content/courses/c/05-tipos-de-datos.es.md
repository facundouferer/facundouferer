---
title: 'Tipos de Datos'
course: 'c'
slug: 'tipos-de-datos'
order: 5
lang: 'es'
published: true
---

En las lecciones anteriores viste que un programa en C necesita una estructura básica, puede guardar información en variables y puede mostrar o recibir datos.

Ahora aparece una pregunta FUNDAMENTAL:

> ¿Qué clase de dato estoy guardando realmente?

La respuesta a esa pregunta tiene que ver con los **tipos de datos**.

En C, no alcanza con decir “quiero guardar un valor”. También hay que decir **qué tipo de valor es**.

En esta lección vas a aprender:

- qué es un tipo de dato
- qué son los tipos primitivos de datos
- cuál es el dominio de cada tipo
- qué operaciones son válidas según el tipo
- cómo se relacionan los tipos con la memoria
- qué son los datos compuestos
- qué son las estructuras de datos
- qué diferencia hay entre estructuras estáticas y dinámicas
- cómo se relacionan constantes y variables con los tipos de datos

> Idea clave: el tipo de dato define qué puede guardar una variable, qué operaciones tienen sentido sobre ese valor y cómo se representa en memoria.

## ¿Qué es un tipo de dato?

Un **tipo de dato** es una clasificación que le indica al lenguaje:

- qué clase de valor se va a almacenar
- qué operaciones se pueden hacer con ese valor
- cuánto espacio de memoria puede necesitar
- cómo debe interpretarse ese contenido

Por ejemplo, no es lo mismo guardar:

- un número entero
- un número con decimales
- un carácter

Aunque todos sean “datos”, no se representan igual ni se trabajan igual.

## ¿Por qué C necesita tipos de datos?

Porque C es un lenguaje donde el manejo de datos debe ser explícito.

Si querés guardar una edad, normalmente usarás un entero.
Si querés guardar una altura, probablemente usarás un decimal.
Si querés guardar una inicial, usarás un carácter.

Eso significa que el programa necesita saber de antemano cómo tratar cada valor.

## Tipos primitivos de datos

Los **tipos primitivos** son los tipos básicos que el lenguaje ofrece para representar datos simples.

En una primera etapa, los más importantes son estos:

- `int`
- `float`
- `double`
- `char`

### `int`

Se usa para representar números enteros, es decir, números sin parte decimal.

```c
int edad = 18;
int cantidadAlumnos = 32;
int anio = 2026;
```

### `float`

Se usa para representar números con decimales.

```c
float altura = 1.75;
float precio = 1499.50;
float promedio = 8.4;
```

### `double`

También representa números con decimales, pero con mayor precisión que `float`.

```c
double distancia = 12345.6789;
double temperatura = 21.4567;
```

### `char`

Se usa para representar un solo carácter.

```c
char inicial = 'F';
char letra = 'A';
char simbolo = '#';
```

Fijate en algo importante: un `char` representa **un solo carácter**, no una palabra completa.

## Dominio de cada tipo

El **dominio** de un tipo de dato es el conjunto de valores que ese tipo puede representar.

Dicho más simple: cada tipo tiene un rango o universo de valores posibles.

### Dominio de `int`

`int` representa números enteros.

Por ejemplo:

- valores positivos
- valores negativos
- cero

```c
int temperatura = -3;
int cantidad = 0;
int edad = 20;
```

### Dominio de `float` y `double`

`float` y `double` representan números reales aproximados, es decir, valores con parte decimal.

```c
float altura = 1.72;
double distancia = 1500.3456;
```

### Dominio de `char`

`char` representa un único carácter.

```c
char letra = 'Z';
char digito = '7';
char simbolo = '*';
```

Ojo con esto: `'7'` no es lo mismo que `7`.

- `'7'` es un carácter
- `7` es un número entero

Eso cambia completamente el tipo de dato.

## Operaciones válidas según el tipo

No todos los tipos admiten las mismas operaciones de la misma forma.

Acá está una de las ideas más importantes de la lección: **el tipo de dato condiciona qué operaciones tienen sentido**.

### Operaciones válidas con `int`

Con números enteros tiene sentido hacer operaciones matemáticas como:

- sumar
- restar
- multiplicar
- dividir

```c
int a = 10;
int b = 5;
int resultado = a + b;
```

### Operaciones válidas con `float` y `double`

También admiten operaciones matemáticas.

```c
float precio1 = 10.5;
float precio2 = 2.5;
float total = precio1 + precio2;
```

### Operaciones con `char`

Con `char`, el uso básico inicial no es “hacer cuentas”, sino representar caracteres.

```c
char inicial = 'F';
```

Aunque internamente un carácter tiene una representación numérica, al comenzar conviene pensar `char` como un tipo para guardar **un símbolo individual**.

## Cuando una operación no tiene sentido pedagógico

Acá hay algo importante: no todo lo que el lenguaje permite conviene enseñarlo de entrada.

Por ejemplo, en niveles más avanzados vas a descubrir que ciertos tipos pueden participar en conversiones automáticas o comportamientos más complejos.

Pero al comenzar, lo correcto es entender esto:

- `int`, `float` y `double` se usan para trabajar con valores numéricos
- `char` se usa para representar un carácter

Primero construimos la idea correcta. Después ya habrá tiempo para refinarla.

## Ocupación de memoria

Cada tipo de dato ocupa espacio en memoria.

Eso significa que no todos los tipos almacenan la información de la misma manera ni con el mismo tamaño.

### Idea importante sobre el tamaño

El tamaño exacto de un tipo puede depender de la implementación, del compilador y de la arquitectura donde corre el programa.

O sea: NO es serio enseñar que todos los tamaños son absolutamente fijos en cualquier máquina.

Sin embargo, para empezar, sí podés quedarte con esta idea:

- `char` suele ocupar menos memoria que `int`
- `int` suele ocupar menos memoria que `double`
- cuanto más complejo o preciso es el dato, más memoria puede requerir

### Relación entre tipo y memoria

Elegir un tipo no es solamente elegir un “nombre técnico”. También es decidir:

- qué clase de valor querés representar
- cuánta precisión necesitás
- cómo se almacenará ese valor

Eso más adelante va a importar muchísimo cuando trabajes con estructuras más grandes y con colecciones de datos.

## Ejemplo conceptual de memoria

Pensá en estas declaraciones:

```c
char inicial = 'F';
int edad = 18;
double distancia = 1234.5678;
```

Aunque las tres variables guardan datos, no lo hacen del mismo modo.

- `inicial` guarda un único carácter
- `edad` guarda un entero
- `distancia` guarda un número decimal con mayor precisión

Por eso no tendría sentido asumir que las tres ocupan lo mismo en memoria.

## Tipos de datos: constantes y variables

Los tipos de datos se relacionan tanto con **variables** como con **constantes**.

### Variable tipada

```c
int edad = 18;
```

Acá:

- `int` es el tipo
- `edad` es la variable
- `18` es el valor

### Constante tipada

```c
const int diasSemana = 7;
```

Acá:

- `int` sigue siendo el tipo de dato
- `diasSemana` es una constante
- `7` es el valor fijo

La diferencia entre variable y constante NO cambia el concepto de tipo. Lo que cambia es si ese valor puede modificarse o no.

## ¿Qué son los datos compuestos?

Hasta ahora hablamos de datos simples o básicos.

Pero muchas veces un solo dato no alcanza.

Por ejemplo, una persona puede necesitar:

- nombre
- edad
- altura
- inicial

Eso ya no es un dato simple aislado, sino un conjunto de datos relacionados.

A esa idea general la podemos conectar con los **datos compuestos**.

Un **dato compuesto** es un dato formado por varios elementos o por una organización más compleja que un valor primitivo individual.

## Ejemplos conceptuales de datos compuestos

Sin entrar todavía en detalle técnico, algunos ejemplos de datos compuestos o estructuras que agrupan datos son:

- arreglos
- cadenas de caracteres
- registros o estructuras
- listas
- pilas
- colas
- árboles

No hace falta dominarlos ahora. Lo importante es entender que existen niveles de organización más complejos que un solo `int` o un solo `char`.

## ¿Qué es una estructura de datos?

Una **estructura de datos** es una forma de organizar datos para poder almacenarlos, acceder a ellos y trabajar con ellos de manera ordenada.

O sea: no se trata solo de “tener datos”, sino de **cómo los organizamos**.

Por ejemplo:

- a veces querés guardar varios valores del mismo tipo
- otras veces querés agrupar datos diferentes que pertenecen a una misma entidad
- otras veces necesitás una organización que facilite ciertas operaciones

Eso es justamente el terreno de las estructuras de datos.

## Estructuras estáticas y dinámicas

Las estructuras de datos pueden clasificarse, de manera general, en **estáticas** y **dinámicas**.

### Estructuras estáticas

Son aquellas cuyo tamaño o capacidad queda definido de forma fija.

La idea principal es que su tamaño está previsto de antemano.

Más adelante vas a ver ejemplos claros de esto.

### Estructuras dinámicas

Son aquellas cuya organización puede crecer o cambiar durante la ejecución del programa.

Esto permite más flexibilidad, pero también exige un manejo más cuidadoso.

Por ahora no hace falta profundizar. Alcanzan estas dos ideas:

- estática: tamaño más fijo o predefinido
- dinámica: tamaño u organización más flexible durante la ejecución

## ¿Por qué esta distinción importa?

Porque no es lo mismo guardar:

- un solo número
- varios números
- una colección de elementos cuyo tamaño ya conocés
- una colección cuyo tamaño puede cambiar

Cada necesidad pide una organización distinta.

Y todo eso empieza, justamente, entendiendo primero qué es un tipo de dato simple.

## Errores comunes al empezar

### 1. Creer que todos los datos son iguales

No.

No es lo mismo guardar un entero, un decimal o un carácter.

### 2. Elegir un tipo sin pensar qué representa

El tipo debe elegirse por el dato real que querés modelar.

### 3. Confundir un carácter con un número

```c
char digito = '7';
int numero = 7;
```

No representan lo mismo.

### 4. Pensar que el tamaño de cada tipo es universal y fijo

En programación real, el tamaño exacto puede depender del entorno.

### 5. Mezclar el concepto de tipo con el de variable

El tipo describe la naturaleza del dato.
La variable es el nombre del espacio donde lo guardás.

## Resumen

- un **tipo de dato** define qué clase de valor se puede almacenar
- los tipos primitivos más importantes al comenzar son `int`, `float`, `double` y `char`
- cada tipo tiene un **dominio** de valores posibles
- no todos los tipos admiten las mismas operaciones con el mismo sentido
- los tipos también están relacionados con la **ocupación de memoria**
- variables y constantes siempre tienen un tipo de dato
- además de los datos primitivos, existen **datos compuestos** y **estructuras de datos**
- las estructuras pueden ser **estáticas** o **dinámicas**

## Idea final

Cuando elegís un tipo de dato, no estás escribiendo una palabra técnica porque sí.

Estás tomando una decisión de diseño sobre:

- qué representa el dato
- cómo se guarda
- qué se puede hacer con él
- cómo debe interpretarlo el programa

Y eso, hermano, es una de las bases más importantes de toda la programación.