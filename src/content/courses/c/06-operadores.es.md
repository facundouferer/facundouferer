---
title: 'Operadores'
course: 'c'
slug: 'operadores'
order: 6
lang: 'es'
published: true
---

Una vez que entendés qué tipos de datos existen, el siguiente paso natural es aprender **qué podés hacer con esos datos**.

Ahí entran en juego los **operadores**.

Un operador es un símbolo que le indica al programa qué acción debe realizar con uno o más valores.

En esta lección vas a aprender:

- qué es un operador
- operadores matemáticos
- operadores relacionales
- operadores lógicos
- operadores de asignación
- precedencia entre operadores

> Idea clave: los operadores son parte del lenguaje con el que construís expresiones. Si no entendés qué hace cada uno y en qué orden actúan, el código se vuelve confuso muy rápido.

## ¿Qué es un operador?

Un **operador** es un símbolo que representa una operación.

Por ejemplo, en matemáticas ya conocés símbolos como:

- `+`
- `-`
- `*`
- `/`

En programación pasa algo parecido, pero además existen operadores para:

- comparar valores
- combinar condiciones lógicas
- asignar valores a variables

## ¿Qué es una expresión?

Antes de seguir, necesitás esta idea.

Una **expresión** es una combinación de valores, variables y operadores que produce un resultado.

Por ejemplo:

```c
5 + 3
```

Eso es una expresión.

También:

```c
edad + 1
```

Y también:

```c
nota >= 6
```

Los operadores forman parte de esas expresiones.

## Operadores matemáticos

Los operadores matemáticos permiten realizar cálculos numéricos.

Los más importantes al comenzar son estos:

- `+` suma
- `-` resta
- `*` multiplicación
- `/` división
- `%` resto de una división entera

## Suma `+`

```c
int a = 10;
int b = 5;
int resultado = a + b;
```

Acá, `resultado` vale `15`.

## Resta `-`

```c
int a = 10;
int b = 5;
int resultado = a - b;
```

Acá, `resultado` vale `5`.

## Multiplicación `*`

```c
int a = 4;
int b = 3;
int resultado = a * b;
```

Acá, `resultado` vale `12`.

## División `/`

```c
int a = 10;
int b = 2;
int resultado = a / b;
```

Acá, `resultado` vale `5`.

### Atención con la división entre enteros

Mirá este ejemplo:

```c
int resultado = 5 / 2;
```

Si trabajás con enteros, el resultado no conserva la parte decimal.

O sea, en este contexto el resultado será `2`.

Esto al principio sorprende muchísimo, pero hay que entenderlo bien: **el tipo de dato influye en el resultado de la operación**.

## Resto `%`

El operador `%` devuelve el resto de una división entera.

```c
int resto = 10 % 3;
```

Acá, `resto` vale `1`, porque:

- `10 / 3` da `3`
- sobra `1`

Este operador solo tiene sentido con valores enteros en el nivel en que estamos trabajando.

## Operadores de asignación

Los operadores de asignación sirven para guardar un valor en una variable.

El más importante y fundamental es:

- `=` asignación simple

## Asignación simple `=`

```c
int edad;
edad = 18;
```

Acá, el operador `=` toma el valor `18` y lo guarda en la variable `edad`.

Esto es IMPORTANTÍSIMO: en programación, `=` no significa lo mismo que en matemática escolar.

En C:

```c
edad = 18;
```

no significa “edad es igual a 18” como una afirmación abstracta, sino:

> guardá 18 dentro de la variable `edad`

## Asignación usando el valor previo de la variable

```c
int edad = 18;
edad = edad + 1;
```

Esto puede leerse así:

1. tomá el valor actual de `edad`
2. sumale `1`
3. guardá el resultado nuevamente en `edad`

Al final, `edad` vale `19`.

## Operadores de asignación combinados

Además de `=`, existen formas abreviadas muy usadas:

- `+=`
- `-=`
- `*=`
- `/=`
- `%=`

### `+=`

```c
int puntos = 10;
puntos += 5;
```

Equivale a:

```c
puntos = puntos + 5;
```

### `-=`

```c
int stock = 20;
stock -= 3;
```

Equivale a:

```c
stock = stock - 3;
```

### `*=`

```c
int valor = 4;
valor *= 2;
```

Equivale a:

```c
valor = valor * 2;
```

### `/=`

```c
int numero = 20;
numero /= 4;
```

Equivale a:

```c
numero = numero / 4;
```

### `%=`

```c
int resto = 10;
resto %= 3;
```

Equivale a:

```c
resto = resto % 3;
```

## ¿Qué son los operadores relacionales?

Los operadores relacionales sirven para **comparar valores**.

Se usan para responder preguntas como:

- ¿es igual?
- ¿es distinto?
- ¿es mayor?
- ¿es menor?

Los principales son:

- `==` igual que
- `!=` distinto de
- `>` mayor que
- `<` menor que
- `>=` mayor o igual que
- `<=` menor o igual que

## Ejemplos de operadores relacionales

```c
edad == 18
edad != 18
nota > 6
precio < 1000
cantidad >= 10
cantidad <= 20
```

Aunque más adelante los vas a usar en estructuras como decisiones, por ahora lo importante es entender el significado de cada comparación.

## Diferencia entre `=` y `==`

Este es uno de los errores más comunes al empezar.

- `=` asigna un valor
- `==` compara dos valores

Mirá la diferencia:

```c
edad = 18;
```

Eso asigna.

```c
edad == 18
```

Eso compara.

No confundas estas dos cosas porque cambian por completo el sentido del código.

## ¿Qué son los operadores lógicos?

Los operadores lógicos permiten combinar o modificar expresiones relacionales.

Los más importantes son:

- `&&` significa “y”
- `||` significa “o”
- `!` significa “no” o negación

## Operador lógico `&&`

Se usa cuando querés que dos expresiones sean verdaderas al mismo tiempo.

```c
edad >= 18 && edad <= 65
```

La idea conceptual es:

- la primera comparación debe cumplirse
- y la segunda también

## Operador lógico `||`

Se usa cuando alcanza con que se cumpla al menos una de las expresiones.

```c
letra == 'a' || letra == 'A'
```

## Operador lógico `!`

Se usa para negar una expresión.

```c
!(edad == 18)
```

Esto expresa la negación de esa comparación.

## Importante: por ahora entendé el significado, no adelantes estructuras

Los operadores relacionales y lógicos suelen usarse muchísimo junto con sentencias de decisión.

Pero NO hace falta adelantarse a esa lección.

En esta etapa lo importante es que entiendas qué significa cada operador y qué tipo de resultado conceptual produce una comparación o una combinación lógica.

## Precedencia entre operadores

Cuando una expresión tiene varios operadores, no siempre se evalúa de izquierda a derecha sin más.

Existe un **orden de precedencia**, es decir, un orden de prioridad.

Pensalo como las reglas de una cuenta matemática.

Por ejemplo, en matemática sabés que la multiplicación tiene prioridad sobre la suma.

En C ocurre algo parecido.

## Regla general simplificada para empezar

Sin entrar todavía en todas las reglas avanzadas, podés empezar con este orden general:

1. paréntesis `()`
2. operadores aritméticos como `*`, `/`, `%`
3. operadores aritméticos como `+`, `-`
4. operadores relacionales como `>`, `<`, `>=`, `<=`
5. operadores de igualdad como `==`, `!=`
6. operador lógico `&&`
7. operador lógico `||`
8. asignación `=` y operadores de asignación combinados

Esta versión simplificada alcanza muy bien para empezar a leer expresiones.

## Ejemplo de precedencia

```c
int resultado = 2 + 3 * 4;
```

Primero se resuelve:

```c
3 * 4
```

Después:

```c
2 + 12
```

Por lo tanto, `resultado` vale `14`.

## Uso de paréntesis para dar claridad

Si querés dejar más clara una expresión, usá paréntesis.

```c
int resultado = (2 + 3) * 4;
```

Ahora primero se resuelve:

```c
2 + 3
```

Y después se multiplica por `4`.

El resultado será `20`.

Los paréntesis no solo sirven para cambiar el orden. También sirven para hacer el código más claro al leerlo.

## Errores comunes al empezar

### 1. Confundir `=` con `==`

Es el clásico error de principiante.

- `=` asigna
- `==` compara

### 2. Olvidar la precedencia

```c
int resultado = 2 + 3 * 4;
```

Si asumís que esto da `20`, te equivocás.

### 3. Creer que la división siempre conserva decimales

```c
int resultado = 5 / 2;
```

Con enteros, ese resultado no conserva la parte decimal.

### 4. Usar operadores sin pensar en el tipo de dato

El tipo de dato influye en la operación y en el resultado.

### 5. Escribir expresiones demasiado confusas

Cuando una expresión empieza a verse enredada, los paréntesis ayudan mucho a hacer explícita la intención.

## Resumen

- un **operador** es un símbolo que representa una acción sobre valores
- los operadores matemáticos permiten hacer cálculos
- los operadores relacionales permiten comparar valores
- los operadores lógicos permiten combinar o negar comparaciones
- los operadores de asignación permiten guardar resultados en variables
- `=` y `==` no significan lo mismo
- la **precedencia** define en qué orden se evalúan los operadores
- los paréntesis ayudan a controlar y aclarar ese orden

## Idea final

Los operadores son el lenguaje interno con el que empezás a construir expresiones más potentes.

Pero ojo: no se trata solo de memorizar símbolos.

Se trata de entender:

- qué hace cada operador
- con qué tipo de datos tiene sentido usarlo
- qué resultado produce
- en qué orden actúa dentro de una expresión

Si eso te queda claro, después las estructuras más complejas se entienden MUCHO mejor.