---
title: 'POO en C'
course: 'c'
slug: 'introduccion-a-poo-en-c'
order: 29
lang: 'es'
published: true
---

Acá hay que decir la verdad técnica completa: **C no es un lenguaje orientado a objetos de forma nativa**.

No tiene clases, herencia ni métodos como mecanismos incorporados del lenguaje al estilo de C++ o Java.

Entonces, ¿por qué hablar de POO en C?

Porque muchas de las ideas de la programación orientada a objetos pueden **modelarse** en C usando:

- `struct`
- funciones
- punteros
- organización modular

En esta lección vas a aprender:

- qué es POO a nivel conceptual
- por qué C no la implementa de forma nativa
- cómo puede simularse en C
- diferencia entre programación estructurada y programación orientada a objetos
- beneficios de aplicar programación orientada a objetos
- qué ideas sí tiene sentido estudiar en este contexto

## ¿Qué es la programación orientada a objetos?

La **programación orientada a objetos** organiza el software alrededor de objetos que combinan:

- **estado**
- **comportamiento**

El estado son los datos.
El comportamiento son las operaciones que pueden hacerse sobre esos datos.

## Pilares de la programación orientada a objetos

Cuando se habla de POO, normalmente aparecen cuatro pilares clásicos:

- encapsulación
- abstracción
- herencia
- polimorfismo

Estos pilares NO significan “cuatro palabras para memorizar”. Significan cuatro ideas de diseño.

### 1. Encapsulación

La **encapsulación** consiste en agrupar datos y operaciones relacionadas.

La idea es que una entidad mantenga juntos:

- su estado
- las operaciones que actúan sobre ese estado

En C, esto puede aproximarse combinando `struct` con funciones relacionadas.

### 2. Abstracción

La **abstracción** consiste en mostrar lo importante y ocultar detalles innecesarios.

Por ejemplo, al usar una cuenta bancaria te interesa saber que puede depositar o extraer dinero, no todos los detalles internos de implementación.

### 3. Herencia

La **herencia** permite construir nuevos tipos a partir de otros, reutilizando y extendiendo características.

En C no existe como mecanismo nativo del lenguaje, pero algunas ideas parecidas pueden simularse mediante composición de estructuras.

### 4. Polimorfismo

El **polimorfismo** permite que una misma idea general de operación adopte comportamientos distintos según el contexto.

En C tampoco existe como mecanismo orientado a objetos nativo, pero ciertas aproximaciones pueden construirse usando punteros a función.

## Importante sobre los pilares en C

Acá hay que ser MUY precisos:

- los pilares de la POO existen como conceptos de diseño
- C no los implementa de manera nativa como lo hacen lenguajes orientados a objetos puros o híbridos
- en C se estudian como ideas que pueden modelarse o simularse parcialmente

Por eso, cuando en este curso hablamos de pilares de POO en C, hablamos de:

- **conceptos fundamentales de POO**
- y de **cómo aproximarlos con herramientas reales de C**

## Diferencia entre programación estructurada y programación orientada a objetos

Esta parte es IMPORTANTÍSIMA, porque muchos estudiantes escuchan “POO” y creen que es solo otra sintaxis. No. Es otra forma de organizar el pensamiento del programa.

### Programación estructurada

La programación estructurada organiza la solución principalmente alrededor de:

- secuencia
- decisión
- iteración
- funciones o procedimientos

El foco suele estar en **las acciones** que el programa realiza.

O sea: pensamos mucho en el flujo del algoritmo.

Por ejemplo:

- leer datos
- procesar datos
- mostrar resultados

### Programación orientada a objetos

La programación orientada a objetos organiza la solución alrededor de **entidades** que tienen:

- datos propios
- operaciones asociadas a esos datos

El foco ya no está solo en “qué pasos hacer”, sino también en **qué objetos existen en el problema y cómo se comportan**.

### Diferencia conceptual corta

- en programación estructurada, el centro suele ser el **algoritmo**
- en programación orientada a objetos, el centro suele ser el **modelo de objetos**

### Ejemplo intuitivo

Supongamos un sistema de cuentas bancarias.

#### En enfoque estructurado

Podrías pensar algo así:

- leer saldo
- depositar monto
- extraer monto
- mostrar saldo

La atención está puesta en las operaciones del proceso.

#### En enfoque orientado a objetos

Pensarías más bien en:

- existe una **Cuenta**
- la cuenta tiene un **saldo**
- la cuenta puede **depositar**
- la cuenta puede **extraer**

Ahora la atención está puesta en la entidad y en su comportamiento.

## ¿Quiere decir que una reemplaza a la otra?

No.

Y esto hay que decirlo bien.

La programación orientada a objetos NO elimina la programación estructurada. De hecho:

- sigue habiendo secuencia
- sigue habiendo decisiones
- sigue habiendo iteraciones
- sigue habiendo funciones

La diferencia está en **cómo se organiza el diseño general del programa**.

## Beneficios de la aplicación de la programación orientada a objetos

La POO se volvió importante porque ayuda a organizar mejor muchos sistemas complejos.

### 1. Mejor modelado del problema

Permite representar entidades del mundo del problema de manera más natural.

Por ejemplo:

- Cuenta
- Alumno
- Producto
- Rectángulo

Eso hace que el programa se parezca más a lo que intenta modelar.

### 2. Mayor organización del código

Cuando los datos y las operaciones relacionadas se agrupan, el código suele quedar más claro.

En vez de tener lógica dispersa, cada entidad concentra mejor su responsabilidad.

### 3. Mejor mantenimiento

Un diseño orientado a objetos bien pensado suele facilitar cambios futuros.

¿Por qué? Porque si una responsabilidad está bien localizada, es más fácil modificarla sin romper todo lo demás.

### 4. Reutilización

Cuando una estructura o diseño está bien armado, muchas ideas pueden reutilizarse en distintas partes del sistema o incluso en otros proyectos.

### 5. Mayor claridad conceptual

La POO ayuda a pensar el software en términos de componentes con identidad propia.

Eso no siempre hace el código “más corto”, pero muchas veces sí lo hace **más entendible**.

## Ojo: la POO NO resuelve todo mágicamente

Acá también hay que ser honestos.

La programación orientada a objetos no es una solución mágica.

Un mal diseño orientado a objetos puede ser peor que un diseño estructurado simple y claro.

Los beneficios aparecen cuando:

- el problema realmente lo justifica
- el diseño está bien pensado
- no se fuerza POO donde no hace falta

## ¿Qué falta en C?

En C no hay:

- clases
- objetos nativos
- métodos ligados al tipo como mecanismo del lenguaje
- herencia nativa
- polimorfismo nativo

Entonces, si alguien te dice “C es orientado a objetos igual que Java”, eso es incorrecto.

## ¿Qué sí puede hacerse en C?

Puede construirse un diseño con inspiración orientada a objetos.

Por ejemplo:

- representar una entidad con `struct`
- definir funciones que trabajen sobre esa estructura
- ocultar detalles mediante módulos
- simular polimorfismo con punteros a función

## Primer ejemplo conceptual

```c
struct Cuenta {
    float saldo;
};

void depositar(struct Cuenta* cuenta, float monto) {
    cuenta->saldo = cuenta->saldo + monto;
}
```

Acá ya aparece una idea parecida a objeto:

- la estructura `Cuenta` representa el estado
- la función `depositar` representa comportamiento

## Entonces, ¿es POO real?

No en sentido nativo del lenguaje.

Pero sí es una forma válida de enseñar y aplicar ideas orientadas a objetos dentro de C.

## Resumen

- la programación estructurada pone mucho foco en el algoritmo y el flujo
- la programación orientada a objetos pone mucho foco en las entidades y su comportamiento
- la POO ayuda a modelar mejor ciertos problemas, organizar código y mejorar mantenimiento
- C no es un lenguaje orientado a objetos nativo
- aun así, puede modelar conceptos de POO
- `struct` + funciones + punteros permiten construir diseños con estilo orientado a objetos

## Idea final

En C, aprender POO no significa aprender “clases mágicas ocultas”.

Significa aprender a construir abstracciones con las herramientas reales del lenguaje.

Y entender la diferencia con la programación estructurada te ayuda a ver que no estás cambiando solo la sintaxis: estás cambiando la manera de pensar el diseño del programa.