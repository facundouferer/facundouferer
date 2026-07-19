---
title: 'Variables and Constants'
course: 'c'
slug: 'variables-y-constantes'
order: 3
lang: 'en'
published: true
---

Las **variables** y las **constantes** son la base de casi todo programa. Antes de pedir datos al usuario, antes de tomar decisiones y antes de repetir tareas, un programa necesita **guardar información**.

En C, esa información se guarda en memoria usando nombres que nosotros elegimos.

En esta lección vas a aprender:

- qué es una variable
- qué significa declarar, inicializar y asignar
- cómo nombrar variables correctamente en C
- qué tipos de datos básicos se usan con más frecuencia
- qué es una constante y cuándo conviene usarla

> Idea clave: si no entendés bien variables y constantes, todo lo que viene después se vuelve más difícil. Esta parte es FUNDAMENTAL.

## ¿Qué es una variable?

Una **variable** es un espacio de memoria que tiene:

1. un **tipo de dato**
2. un **nombre**
3. un **valor** que puede cambiar

Pensalo así: una variable es como una caja con una etiqueta.

- La **etiqueta** es el nombre de la variable.
- El **contenido** de la caja es el valor guardado.
- El **tipo de dato** indica qué clase de valor puede guardarse ahí.

Por ejemplo:

```c
int edad = 18;
```

En esa línea:

- `int` indica que la variable guardará un número entero
- `edad` es el nombre de la variable
- `18` es el valor inicial

## ¿Por qué necesitamos variables?

Porque los programas trabajan con datos.

Por ejemplo, un programa puede necesitar guardar:

- la edad de una persona
- el precio de un producto
- la inicial de un nombre
- la cantidad de alumnos en un curso

Si no pudiéramos guardar esos valores, el programa no tendría con qué trabajar.

Mirá este ejemplo:

```c
int cantidadAlumnos = 30;
float precio = 1499.50;
char inicial = 'F';
```

Ahí el programa está guardando tres datos distintos:

- `cantidadAlumnos` guarda un entero
- `precio` guarda un número con decimales
- `inicial` guarda un único carácter

## Variables y memoria

Cuando un programa se ejecuta, usa memoria RAM.

Cada variable ocupa una parte de esa memoria. Vos no necesitás saber todavía la dirección exacta donde queda guardada, pero sí entender la idea general: **cada variable reserva un lugar para almacenar un dato**.

Podemos imaginarlo así:

```text
edad              -> 18
precio            -> 1499.50
inicial           -> F
```

Esto NO significa que la memoria realmente se vea así, pero sirve como modelo mental para empezar.

Lo importante es entender que el nombre de la variable le permite al programa encontrar el valor guardado.

## Declarar una variable

**Declarar** una variable significa informarle al compilador que esa variable va a existir y qué tipo de dato va a almacenar.

La forma general es:

```c
tipo nombreVariable;
```

Ejemplo:

```c
int edad;
```

Esta línea declara una variable llamada `edad` que podrá almacenar números enteros.

Todavía no le dimos un valor. Solamente dijimos que esa variable existe.

## Inicializar una variable

**Inicializar** una variable significa darle un valor en el mismo momento en que se declara.

Ejemplo:

```c
int edad = 18;
```

Acá pasan dos cosas al mismo tiempo:

1. se declara la variable `edad`
2. se le asigna el valor `18`

Inicializar suele ser una muy buena práctica, porque hace el código más claro y evita usar variables sin un valor válido.

## Asignar un valor

**Asignar** un valor significa guardar un dato dentro de una variable que ya existe.

Ejemplo:

```c
int edad;
edad = 18;
```

Primero declaramos la variable.
Después le asignamos un valor.

Esto es distinto de inicializar, porque la inicialización ocurre en la misma línea de la declaración.

## Declarar, inicializar y asignar: diferencia importante

Estas tres ideas se parecen, pero NO son lo mismo.

### Solo declaración

```c
int edad;
```

La variable existe, pero todavía no recibe un valor por decisión nuestra.

### Declaración con inicialización

```c
int edad = 18;
```

La variable se crea y ya empieza con un valor.

### Asignación posterior

```c
int edad;
edad = 18;
```

La variable se crea primero y recibe el valor después.

Entender esta diferencia es importantísimo, porque en programación el momento en que un valor aparece también importa.

## Tipos de datos básicos que vas a usar al comenzar

En C, toda variable necesita un tipo. El tipo define qué clase de dato puede guardarse.

Por ahora, los más importantes para empezar son estos:

### `int`

Se usa para números enteros, es decir, números sin parte decimal.

```c
int cantidad = 25;
int anio = 2026;
int temperaturaMinima = 8;
```

### `float`

Se usa para números con decimales.

```c
float altura = 1.75;
float precio = 2500.50;
float promedio = 8.4;
```

### `char`

Se usa para guardar **un solo carácter**.

```c
char letra = 'A';
char inicial = 'F';
char simbolo = '#';
```

Fijate en algo importante: los valores `char` se escriben entre **comillas simples**.

```c
char letra = 'A';
```

Eso representa un solo carácter.

> Más adelante vas a ver cómo trabajar con texto completo. Por ahora alcanza con entender que `char` guarda un solo carácter.

## Ejemplo completo y explicado

Mirá este programa simple:

```c
int main() {
    int edad = 18;
    float altura = 1.72;
    char inicial = 'F';

    return 0;
}
```

¿Qué está pasando ahí?

- `edad` guarda un número entero
- `altura` guarda un número decimal
- `inicial` guarda un carácter

El programa no muestra nada en pantalla todavía. Y está perfecto. En esta lección el objetivo no es mostrar datos, sino entender cómo se guardan.

## El valor de una variable puede cambiar

La palabra **variable** justamente indica que su valor puede variar.

Ejemplo:

```c
int edad = 18;
edad = 19;
```

Al final de ese fragmento, el valor guardado en `edad` es `19`.

La variable sigue siendo la misma, pero su contenido cambió.

Otro ejemplo:

```c
float precio = 1500.00;
precio = 1750.00;
```

Ahora `precio` ya no vale `1500.00`, sino `1750.00`.

## No uses variables sin darles un valor confiable

Una de las malas costumbres más peligrosas al empezar es declarar una variable y usarla sin haberle asignado un valor claro.

Por ejemplo:

```c
int edad;
```

Esa variable existe, sí. Pero si todavía no le diste un valor con una asignación, no deberías asumir que contiene un dato útil para tu programa.

Por eso, cuando sea posible, conviene inicializar:

```c
int edad = 0;
float precio = 0.0;
char inicial = ' ';
```

No siempre el valor inicial será cero o un espacio, pero la idea importante es esta: **el programa debe saber con qué valor empieza a trabajar**.

## Reglas para nombrar variables en C

No se puede poner cualquier nombre. C tiene reglas.

Un nombre de variable:

- puede usar letras
- puede usar números
- puede usar guion bajo `_`
- debe comenzar con una letra o con `_`
- no puede comenzar con un número
- no puede tener espacios
- no puede ser una palabra reservada del lenguaje

### Ejemplos válidos

```c
edad
edadAlumno
numero1
_total
precioFinal
```

### Ejemplos inválidos

```c
1edad
mi edad
float
precio-final
```

¿Por qué son inválidos?

- `1edad` empieza con número
- `mi edad` tiene espacio
- `float` es una palabra reservada del lenguaje
- `precio-final` tiene un guion medio, y eso no forma parte del nombre

## Buenas prácticas al nombrar variables

Una cosa es que un nombre sea válido y otra muy distinta es que sea claro.

Mirá estos ejemplos:

```c
int x;
float a;
char z;
```

Eso puede compilar, pero comunica muy poco.

Ahora mirá esto:

```c
int cantidadAlumnos;
float precioProducto;
char inicialNombre;
```

Mucho mejor.

Un buen nombre ayuda a entender el programa sin tener que adivinar.

### Recomendaciones

- usá nombres que describan el dato
- evitá nombres demasiado cortos si no aportan claridad
- mantené una forma de nombrar consistente

## ¿Qué es una constante?

Una **constante** es un dato cuyo valor no debe cambiar durante la ejecución del programa.

Es decir:

- una variable puede cambiar
- una constante debe permanecer igual

Esto sirve cuando hay valores fijos que tienen un significado importante en el programa.

Por ejemplo:

- la cantidad de días de la semana
- la cantidad de meses del año
- el valor aproximado de PI

## Declarar constantes con `const`

En C, una constante se puede declarar usando la palabra clave `const`.

Ejemplo:

```c
const int diasSemana = 7;
const int mesesAnio = 12;
const float PI = 3.14159;
```

En estos casos, esos valores se definen para no ser modificados después.

## Diferencia entre variable y constante

Mirá este ejemplo:

```c
int edad = 18;
const int diasSemana = 7;
```

- `edad` puede cambiar
- `diasSemana` no debería cambiar

Si más adelante en el código escribís:

```c
diasSemana = 8;
```

eso está mal, porque contradice la idea de haber declarado ese dato como constante.

La enseñanza importante acá no es memorizar un error del compilador, sino entender el concepto: **si un valor no debe cambiar, declararlo como constante hace el programa más claro y más seguro**.

## ¿Cuándo conviene usar una constante?

Conviene usar una constante cuando un valor:

- representa una regla fija
- tiene el mismo significado durante todo el programa
- no debería modificarse accidentalmente

Ejemplo:

```c
const int cantidadRuedasBicicleta = 2;
const int horasDia = 24;
```

Si esos valores son parte de la lógica del programa, declararlos como constantes comunica mejor la intención.

## Ejemplo comparando variables y constantes

```c
int edad = 18;
const int mesesAnio = 12;
```

En ese código:

- `edad` representa un dato que podría cambiar
- `mesesAnio` representa un dato fijo

Esa diferencia conceptual es más importante que la sintaxis.

## Errores comunes al empezar

### 1. Confundir el nombre con el valor

```c
int edad = 18;
```

- `edad` es el nombre
- `18` es el valor

No son lo mismo.

### 2. Creer que declarar es lo mismo que inicializar

No.

```c
int edad;
```

Eso solo declara.

```c
int edad = 18;
```

Eso declara e inicializa.

### 3. Usar nombres poco claros

```c
int a;
int dato;
```

Eso dice muy poco.

Es mejor:

```c
int cantidadEstudiantes;
```

### 4. Usar una variable sin haber decidido con qué valor empieza

Cuando recién empezás, conviene que cada variable importante tenga un valor inicial claro.

### 5. Declarar como variable algo que en realidad debería ser constante

Si un valor no va a cambiar, usar `const` hace que el código exprese mejor su intención.

## Resumen

- una **variable** guarda un dato que puede cambiar
- una **constante** guarda un dato que no debe cambiar
- en C, toda variable necesita un **tipo** y un **nombre**
- **declarar** es crear la variable
- **inicializar** es darle un valor al declararla
- **asignar** es darle un valor después de haberla declarado
- `int`, `float` y `char` son tipos básicos muy usados al comenzar
- un buen nombre hace el código mucho más entendible
- `const` se usa para representar valores fijos

## Idea final

Cuando programás, no escribís código porque sí: le estás diciendo a la computadora **qué datos existen** y **cómo debe tratarlos**.

Las variables y las constantes son la primera gran herramienta para modelar esa información.

Si esto te queda claro, el resto del camino empieza a tener sentido.
