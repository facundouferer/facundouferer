---
course: 'java'
slug: '11-tad-listas-estaticas-y-dinamicas'
title: 'TAD Lista: Estáticas, Dinámicas y Enlazadas'
description: 'Comprendé el concepto de Tipo Abstracto de Dato (TAD) e implementá listas estáticas, dinámicas, circulares y doblemente enlazadas.'
order: 11
lang: 'es'
published: true
---

# TAD Lista: Estáticas, Dinámicas y Enlazadas

## 1. ¿Qué es un TAD?
Separación entre especificación e implementación.

## 2. Lista Enlazada Simple con Nodos
```java
public class Nodo {
    int dato;
    Nodo siguiente;
    public Nodo(int dato) { this.dato = dato; }
}

public class ListaEnlazada {
    private Nodo cabeza;
    public void agregarAlInicio(int dato) {
        Nodo nuevo = new Nodo(dato);
        nuevo.siguiente = cabeza;
        cabeza = nuevo;
    }
}
```

## 3. Ejercicio Práctico
Implementá el método `eliminar(int dato)` en la lista enlazada simple.
