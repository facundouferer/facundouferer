---
title: 'Diseño de software en C: ideas de la POO'
course: 'c'
slug: 'introduccion-a-poo-en-c'
description: 'Comprende cómo expresar abstracción y modularidad en C combinando estructuras de datos y funciones asociadas sin presentar a C como un lenguaje orientado a objetos.'
order: 41
lang: 'es'
published: true
---

Esta lección abre el módulo complementario **Diseño de software en C**. Es optativo: no hace falta para dominar el lenguaje, pero te muestra cómo se organizan programas grandes escritos en C, como bibliotecas, sistemas operativos o motores de juegos.

Hay que empezar por la verdad técnica completa: **C es un lenguaje procedural**. No es un lenguaje orientado a objetos y no tiene clases, herencia ni métodos como mecanismos del lenguaje. Lo que vas a estudiar en este módulo son **técnicas de diseño** que toman prestadas algunas ideas de la programación orientada a objetos (POO) y las construyen con herramientas que ya conoces: `struct`, funciones, punteros, punteros a función y módulos `.h`/`.c`. Cada técnica tiene un costo y un límite, y parte del trabajo es saber cuándo no usarla.

## Objetivos

- Explicar por qué C es un lenguaje procedural y qué significa "diseñar con ideas de la POO" en C.
- Entender la **abstracción** como diseñar un tipo alrededor de sus operaciones.
- Distinguir las ideas de la POO que C puede expresar (datos + funciones, interfaces) de las que no tiene de forma nativa (clases, herencia, despacho virtual, control de acceso).
- Comparar el enfoque estructurado con el enfoque orientado a objetos sobre el mismo problema.
- Decidir cuándo vale la pena este estilo y cuándo un diseño más simple es mejor.

**Requisitos previos:** `modularizacion-subprogramas-y-funciones` (`.h`/`.c`), `concepto-de-estructuras`, `punteros-arreglos-y-estructuras` (`->` y punteros a función), `memoria-dinamica` y `propiedad-y-errores-de-memoria`.

## Programación estructurada y programación orientada a objetos

Muchos estudiantes escuchan "POO" y creen que es solo otra sintaxis. No lo es: es otra forma de organizar el diseño del programa.

### Programación estructurada

La programación estructurada organiza la solución alrededor de secuencia, decisión, iteración y funciones. El foco está en **las acciones**: leer datos, procesarlos, mostrar resultados. Pensamos sobre todo en el flujo del algoritmo. Es el estilo que usaste durante todo el curso.

### Programación orientada a objetos

La POO organiza la solución alrededor de **entidades** que tienen datos propios (su **estado**) y operaciones asociadas a esos datos (su **comportamiento**). El foco ya no está solo en "qué pasos hacer", sino también en "qué entidades existen y cómo se comportan".

### El mismo problema, dos miradas

Supongamos un sistema de cuentas bancarias.

- **Enfoque estructurado:** leer saldo, depositar monto, extraer monto, mostrar saldo. La atención está en los pasos del proceso.
- **Enfoque orientado a objetos:** existe una **Cuenta**; la cuenta tiene un saldo; la cuenta puede depositar y extraer. La atención está en la entidad y en lo que se le puede pedir.

Una no reemplaza a la otra. Dentro de cada operación de una cuenta sigue habiendo secuencia, decisiones y ciclos. La diferencia está en **cómo se agrupa** el programa.

## Abstracción: diseñar alrededor de las operaciones

La idea de la POO que más le sirve a un programador de C es la **abstracción**: mostrar lo importante y ocultar lo innecesario. En la práctica significa diseñar un tipo **a partir de las operaciones que ofrece**, no a partir de sus campos.

Antes de escribir `struct Cuenta { ... }`, te preguntas: ¿qué necesita hacer quien use una cuenta?

- crear una cuenta con un saldo inicial;
- depositar;
- extraer, sin quedar en negativo;
- consultar el saldo.

Esa lista es la **interfaz** del tipo. Los campos son un detalle de implementación que podría cambiar (por ejemplo, guardar centavos en un `long long` en vez de pesos en un `double`) sin que cambie el código que usa la cuenta.

Ya aplicaste esta idea sin nombrarla: cuando usas `FILE *` con `fopen`, `fprintf` y `fclose`, nunca miras qué campos tiene `FILE`. Solo usas sus operaciones.

## Los cuatro pilares, vistos desde C

Cuando se habla de POO aparecen cuatro ideas clásicas. No son palabras para memorizar: son ideas de diseño. Esto es lo que C permite hacer con cada una:

| Idea de la POO | En un lenguaje orientado a objetos | En C |
| --- | --- | --- |
| Encapsulación | clases que agrupan datos y métodos | `struct` + funciones del mismo módulo |
| Abstracción | interfaces públicas | archivo `.h` con las operaciones, tipos opacos |
| Herencia | `extends`, clases derivadas | no existe; se simula con composición de `struct` |
| Polimorfismo | métodos virtuales | no existe; se simula con punteros a función |

### Lo que C sí puede expresar

- **Datos + funciones:** una `struct` guarda el estado y un grupo de funciones con un prefijo común (`cuenta_depositar`, `cuenta_extraer`) forma su comportamiento.
- **Interfaces:** un `.h` declara qué se puede hacer y el `.c` decide cómo. Con un puntero a función, además, puedes elegir en tiempo de ejecución qué operación se ejecuta.

### Lo que C no tiene de forma nativa

- **Clases:** no hay una unidad del lenguaje que agrupe datos y funciones. La agrupación es una convención tuya.
- **Herencia:** no hay tipos derivados. Puedes poner una `struct` dentro de otra, pero el compilador no sabe que una "es" la otra.
- **Despacho virtual:** no hay métodos que se elijan solos según el tipo real del objeto. Si lo quieres, armas a mano una tabla de punteros a función.
- **Control de acceso:** no hay `private` ni `public`. Lo más parecido es ocultar la definición de la `struct` en el `.c` (lección siguiente) y marcar las funciones auxiliares como `static`.

Por eso, si alguien dice "C es orientado a objetos igual que Java", está equivocado. Lo correcto es: "en C se pueden aplicar algunas ideas de la POO, con trabajo manual y sin ayuda del compilador".

## Un primer ejemplo: datos + funciones

Este programa modela una cuenta con una `struct` y funciones que reciben un puntero a ella. El saldo se guarda en centavos con un entero, porque `float` y `double` no representan exactamente valores como 0,10.

```c
#include <stdbool.h>
#include <stdio.h>

struct Cuenta {
    long long saldo_centavos;
};

void cuenta_iniciar(struct Cuenta *cuenta, long long saldo_inicial) {
    cuenta->saldo_centavos = saldo_inicial;
}

bool cuenta_depositar(struct Cuenta *cuenta, long long monto) {
    if (monto <= 0) {
        return false;
    }
    cuenta->saldo_centavos += monto;
    return true;
}

bool cuenta_extraer(struct Cuenta *cuenta, long long monto) {
    if (monto <= 0 || monto > cuenta->saldo_centavos) {
        return false;
    }
    cuenta->saldo_centavos -= monto;
    return true;
}

long long cuenta_saldo(const struct Cuenta *cuenta) {
    return cuenta->saldo_centavos;
}

int main(void) {
    struct Cuenta cuenta;
    cuenta_iniciar(&cuenta, 10000);

    cuenta_depositar(&cuenta, 2550);
    if (!cuenta_extraer(&cuenta, 50000)) {
        printf("Extraccion rechazada: saldo insuficiente\n");
    }
    printf("Saldo: %lld centavos\n", cuenta_saldo(&cuenta));
    return 0;
}
```

Salida:

```text
Extraccion rechazada: saldo insuficiente
Saldo: 12550 centavos
```

Observa tres decisiones de diseño:

- Cada función recibe **un puntero a la cuenta** como primer parámetro. C pasa ese puntero por valor, como cualquier argumento, pero a través de la copia de la dirección la función modifica la cuenta original.
- `cuenta_saldo` recibe `const struct Cuenta *`: promete no modificarla.
- Las reglas ("no se deposita un monto negativo", "no se extrae más de lo que hay") viven **dentro** de las operaciones, no repartidas por `main`.

Pero hay un problema: nada impide que `main` escriba `cuenta.saldo_centavos = -500;` y se salte todas las reglas. C no tiene control de acceso. En la lección siguiente vas a resolverlo con un **tipo opaco**.

## ¿Cuándo vale la pena este estilo?

Diseñar alrededor de operaciones tiene beneficios reales:

- **Modelado:** el programa se parece al problema (Cuenta, Alumno, Producto).
- **Organización:** cada tipo concentra su responsabilidad en un solo módulo.
- **Mantenimiento:** puedes cambiar la representación interna sin tocar a quien usa el tipo.
- **Reutilización:** un módulo bien definido se lleva a otro proyecto sin cambios.

Y también tiene costos en C, que en otros lenguajes paga el compilador por ti:

- más código: funciones de creación y destrucción, comprobaciones, convenciones de nombres;
- más memoria dinámica cuando ocultas la representación, con su responsabilidad de liberar;
- más indirección (punteros, punteros a función) y menos ayuda del compilador para detectar errores.

Una regla práctica: úsalo cuando un tipo tiene **reglas que proteger** (invariantes) o cuando **varias partes del programa** lo usan. Para un programa corto, una `struct` simple con dos funciones es mejor que una arquitectura imitada de Java. Un mal diseño "orientado a objetos" puede ser peor que un diseño estructurado claro.

## Qué viene en el módulo

- `encapsulacion-y-abstraccion-en-c`: tipos opacos, funciones de creación y destrucción, invariantes.
- `objetos-metodos-y-diseno-basado-en-struct`: operaciones con el objeto como primer parámetro, composición y manejo de errores.
- `polimorfismo-y-herencia-simulados-en-c`: tablas de operaciones con punteros a función, estructuras base y los límites de simular herencia.

## Resumen

- C es un lenguaje procedural; este módulo enseña técnicas de diseño inspiradas en la POO, no "POO en C".
- La programación estructurada pone el foco en el algoritmo; la POO, en las entidades y su comportamiento. Una no elimina a la otra.
- **Abstracción** es diseñar un tipo a partir de sus operaciones, no de sus campos.
- C expresa datos + funciones e interfaces; no tiene clases, herencia, despacho virtual ni control de acceso nativos.
- Estas técnicas cuestan código, memoria e indirección: úsalas cuando el problema lo justifique.

## Ejercicios prácticos

### Ejercicio 1: ¿qué tiene C de forma nativa?

Clasifica cada afirmación como verdadera o falsa y justifica en una línea:

1. C tiene la palabra clave `class`.
2. Una `struct` y funciones que reciben un puntero a ella pueden modelar estado y comportamiento.
3. C impide que el código de `main` modifique un campo de una `struct` cuya definición conoce.
4. C elige automáticamente qué función ejecutar según el tipo real de un objeto.

<details><summary>Ver solución</summary>

1. Falsa: C no tiene clases.
2. Verdadera: es la técnica básica de este módulo.
3. Falsa: si la definición está visible, cualquier código puede escribir sus campos; no hay `private`.
4. Falsa: no hay despacho virtual; se simula a mano con punteros a función.

</details>

### Ejercicio 2: diseñar alrededor de las operaciones

Un programa necesita un **termostato** que guarde una temperatura objetivo entre 10 y 30 grados. Antes de escribir campos, escribe la lista de operaciones que ofrecería y la regla que esas operaciones deben proteger.

<details><summary>Ver solución</summary>

Una posible interfaz:

- `termostato_iniciar(t, objetivo)`: fija el objetivo inicial (si está fuera de rango, lo ajusta o falla).
- `termostato_subir(t)` y `termostato_bajar(t)`: cambian el objetivo de a un grado.
- `termostato_objetivo(t)`: consulta el valor sin modificarlo (recibe `const`).

La regla que protegen: el objetivo siempre queda entre 10 y 30. Como todas las modificaciones pasan por estas funciones, alcanza con comprobarla dentro de ellas.

</details>

### Ejercicio 3: implementa el termostato

Escribe el termostato del ejercicio anterior con una `struct` y funciones que reciben un puntero a ella. `termostato_subir` devuelve `false` si ya está en 30. Pruébalo subiendo 25 veces desde 20.

<details><summary>Ver solución</summary>

```c
#include <stdbool.h>
#include <stdio.h>

struct Termostato {
    int objetivo;
};

bool termostato_iniciar(struct Termostato *t, int objetivo) {
    if (objetivo < 10 || objetivo > 30) {
        return false;
    }
    t->objetivo = objetivo;
    return true;
}

bool termostato_subir(struct Termostato *t) {
    if (t->objetivo >= 30) {
        return false;
    }
    t->objetivo++;
    return true;
}

bool termostato_bajar(struct Termostato *t) {
    if (t->objetivo <= 10) {
        return false;
    }
    t->objetivo--;
    return true;
}

int termostato_objetivo(const struct Termostato *t) {
    return t->objetivo;
}

int main(void) {
    struct Termostato t;
    if (!termostato_iniciar(&t, 20)) {
        return 1;
    }
    int rechazos = 0;
    for (int i = 0; i < 25; i++) {
        if (!termostato_subir(&t)) {
            rechazos++;
        }
    }
    printf("Objetivo: %d, rechazos: %d\n", termostato_objetivo(&t), rechazos);
    termostato_bajar(&t);
    printf("Despues de bajar: %d\n", termostato_objetivo(&t));
    return 0;
}
```

Muestra `Objetivo: 30, rechazos: 15` y luego `Despues de bajar: 29`.

</details>

### Ejercicio 4: ¿vale la pena?

Para cada caso, decide si conviene diseñar un tipo con interfaz propia o basta con código directo: (a) un programa de 40 líneas que promedia cinco notas; (b) una biblioteca de colas de impresión que usan tres módulos distintos de un sistema.

<details><summary>Ver solución</summary>

(a) Código directo: no hay reglas que proteger ni varios usuarios; una interfaz agregaría código sin beneficio. (b) Tipo con interfaz: varios módulos lo usan, la cola tiene invariantes (orden, capacidad) y su representación podría cambiar sin afectar a los usuarios.

</details>
