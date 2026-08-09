---
course: 'java'
slug: '15-tad-arboles-binarios-y-busqueda'
title: 'TAD Árbol: Recorridos y Árbol Binario de Búsqueda'
description: 'Comprendé la estructura jerárquica del TAD Árbol, recorridos en profundidad y la implementación de un Árbol Binario de Búsqueda (ABB).'
order: 15
lang: 'es'
published: true
---

# TAD Árbol: Recorridos y Árbol Binario de Búsqueda

## 1. Definición y Recorridos (DFS/BFS)
Pre-orden, In-orden, Post-orden y por Niveles.

## 2. Árbol Binario de Búsqueda (ABB)
Propiedad fundamental: subárbol izquierdo menor, subárbol derecho mayor.

```java
public class NodoArbol {
    int valor;
    NodoArbol izquierdo, derecho;
    public NodoArbol(int v) { valor = v; }
}
```

## 3. Ejercicio Práctico
Implementá `buscar(int valor)` en un ABB.
