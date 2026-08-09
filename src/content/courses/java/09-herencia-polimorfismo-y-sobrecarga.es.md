---
course: 'java'
slug: '08-herencia-polimorfismo-y-sobrecarga'
title: 'Herencia, Polimorfismo y Sobrecarga de Métodos'
description: 'Dominá la herencia simple con extends, la sobrescritura (@Override), la sobrecarga y el polimorfismo.'
order: 9
lang: 'es'
published: true
---

# Herencia, Polimorfismo y Sobrecarga de Métodos

## 1. Herencia Simple (`extends`)
```java
public class Vehiculo {
    protected String marca;
    public Vehiculo(String marca) { this.marca = marca; }
    public void arrancar() { System.out.println("Arrancando..."); }
}

public class Auto extends Vehiculo {
    public Auto(String marca) { super(marca); }
    @Override
    public void arrancar() { System.out.println("Auto " + marca + " arrancando con botón."); }
}
```

## 2. Sobrecarga vs Polimorfismo
- **Sobrecarga**: Mismo nombre, distintos parámetros.
- **Polimorfismo**: Referencia de superclase ejecutando el comportamiento de la subclase.

## 3. Ejercicio Práctico
Creá la superclase `Empleado` y la subclase `Gerente` que sobrescriba `calcularSalario()`.
