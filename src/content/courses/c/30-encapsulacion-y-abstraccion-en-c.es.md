---
title: 'Encapsulación y Abstracción'
course: 'c'
slug: 'encapsulacion-y-abstraccion-en-c'
order: 30
lang: 'es'
published: true
---

Dos ideas centrales de la POO son la **encapsulación** y la **abstracción**.

En C no aparecen como palabras clave del lenguaje, pero sus ideas sí pueden aplicarse.

En esta lección vas a aprender:

- qué es encapsulación
- qué es abstracción
- cómo usar `struct` y funciones para aproximar estas ideas en C
- por qué los módulos ayudan muchísimo

## Encapsulación

La **encapsulación** consiste en agrupar datos y operaciones relacionadas.

### Ejemplo

```c
struct Cuenta {
    float saldo;
};

void depositar(struct Cuenta* cuenta, float monto) {
    cuenta->saldo = cuenta->saldo + monto;
}
```

Acá los datos de la cuenta y las operaciones que la afectan están conceptualmente relacionadas.

## Abstracción

La **abstracción** consiste en mostrar lo importante y ocultar detalles innecesarios.

Por ejemplo, para usar una cuenta, tal vez te interese saber que podés depositar y extraer dinero, no exactamente cómo se almacena internamente cada dato.

## Encapsulación y módulos

En C, una forma muy útil de aproximar encapsulación es separar:

- la interfaz en `.h`
- la implementación en `.c`

Eso ayuda a que quien usa el módulo piense en “qué puede hacer” y no necesariamente en “cómo está implementado todo”.

## Ejemplo conceptual

### En `cuenta.h`

```c
struct Cuenta;
void depositar(struct Cuenta* cuenta, float monto);
```

### En `cuenta.c`

```c
struct Cuenta {
    float saldo;
};
```

## Resumen

- encapsulación agrupa datos y comportamiento relacionados
- abstracción destaca lo importante y esconde detalles innecesarios
- en C se aproximan usando `struct`, funciones y módulos

## Idea final

Aunque C no tenga encapsulación como mecanismo nativo de POO, sí permite diseñar programas donde los datos y las operaciones se mantengan organizados con mucha disciplina.