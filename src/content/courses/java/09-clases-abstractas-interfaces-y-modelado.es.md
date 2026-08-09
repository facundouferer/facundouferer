---
course: 'java'
slug: '09-clases-abstractas-interfaces-y-modelado'
title: 'Clases Abstractas, Interfaces y Organización del Código'
description: 'Comprendé las diferencias entre clases abstractas e interfaces, organizá tus paquetes y modelá relaciones reales entre objetos.'
order: 9
lang: 'es'
published: true
---

# Clases Abstractas, Interfaces y Organización del Código

## 1. Clases Abstractas (`abstract`) vs. Interfaces (`interface`)
```java
public abstract class Figura {
    public abstract double calcularArea();
}

public interface Dibujable {
    void dibujar();
}
```

## 2. Organización: Paquetes y Relaciones entre Objetos
- Paquetes: `package com.empresa.proyecto;`
- Relaciones: Asociación, Agregación y Composición.

## 3. Ejercicio Práctico
Diseñá una interfaz `Pagable` e impleméntala en `TarjetaCredito` y `MercadoPago`.
