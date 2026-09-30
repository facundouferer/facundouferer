---
course: 'java'
lesson: '26-arboles-n-arios-y-representacion-con-vectores'
slug: 'sistema-archivos-arbol-n-ario'
title: 'Modelado Jerárquico con Árboles N-arios y Transformación Primer Hijo / Siguiente Hermano'
description: 'Construí un árbol N-ario genérico para modelar jerarquías reales como directorios, implementá recorridos en preorden con sangría visual y la transformación a representación binaria de primer hijo / siguiente hermano.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 65
objectives:
  - 'Modelar estructuras jerárquicas con grado arbitrario (cero o más hijos por nodo).'
  - 'Implementar algoritmos de recorrido en preorden generando visualizaciones indentadas de jerarquías.'
  - 'Comprender y programar la transformación canónica N-ario a binario mediante enlaces Primer Hijo / Siguiente Hermano.'
  - 'Validar rigurosamente los invariantes estructurales: unicidad de raíz, ausencia de ciclos y rechazo de referencias nulas.'
requirements:
  - 'Crear la clase genérica NodoNario<T> con atributos privados: T valor, List<NodoNario<T>> hijos y referencia opcional NodoNario<T> padre.'
  - 'Crear la clase ArbolNario<T> con la referencia a la raiz y métodos para agregar nodos validando que no existan ciclos ni padres nulos.'
  - 'Implementar List<T> recorridoPreorden() y void imprimirJerarquia() mostrando sangría visual según la profundidad de cada nodo (estilo árbol de terminal).'
  - 'Implementar el cálculo recursivo de métricas: int contarNodos(), int calcularAltura() e int contarHojas().'
  - 'Crear la clase NodoBinarioHermano<T> (con punteros primerHijo y siguienteHermano) e implementar el método NodoBinarioHermano<T> transformarABinario() en ArbolNario<T>.'
  - 'Validar que el enlace siguienteHermano de la raíz binaria transformada sea estrictamente null (invariante de raíz única).'
  - 'En MainArbolNario.java, modelar una estructura de carpetas de un proyecto (ej: src, controllers, models, utils), imprimirla y verificar la conversión a primer hijo / siguiente hermano.'
exampleOutput: |
  === Estructura Jerárquica N-aria (Sistema de Archivos) ===
  root/
    ├── src/
    │   ├── controllers/
    │   │   └── UserController.java
    │   ├── models/
    │   │   └── User.java
    │   └── utils/
    └── pom.xml

  Métricas del Árbol N-ario:
  Total de nodos: 7
  Altura máxima: 3
  Cantidad de hojas: 3

  Recorrido Preorden:
  [root, src, controllers, UserController.java, models, User.java, utils, pom.xml]

  === Transformación Primer Hijo / Siguiente Hermano ===
  [OK] Raíz binaria: 'root'
  [OK] Primer hijo de 'root': 'src'
  [OK] Siguiente hermano de 'src': 'pom.xml'
  [OK] Siguiente hermano de 'root' es null (invariante verificado).
deliveryTips:
  - 'Para la indentación visual en imprimirJerarquia(), podés pasar un entero nivel a la función recursiva e imprimir "  ".repeat(nivel) antes del valor.'
  - 'Al transformar a primer hijo / siguiente hermano, conectá secuencialmente la lista de hijos del nodo actual haciendo que cada hijo apunte al siguiente mediante siguienteHermano.'
  - 'Asegurate de que la lista de hijos esté encapsulada (retornando colecciones inmutables o copias defensivas) para no vulnerar el estado interno.'
---

## Contexto

A diferencia de los árboles binarios restringidos a dos ramas por nodo, los **árboles N-arios (o generales)** permiten modelar de forma natural cualquier estructura jerárquica del mundo real: sistemas de archivos, organigramas corporativos, menús de navegación y árboles de sintaxis abstracta (AST).

Un desafío clásico de ingeniería es cómo almacenar y procesar estas jerarquías:
1. Mediante listas dinámicas de hijos en cada nodo (`List<NodoNario<T>>`).
2. Mediante la transformación isomórfica a **Primer Hijo / Siguiente Hermano** (*Left-Child / Right-Sibling*), que permite representar cualquier árbol N-ario como un árbol binario estándar sin desperdiciar memoria.
3. Mediante representación con vectores contiguos e índices numéricos para optimizar la localidad de caché.

## Consigna

Vas a implementar un árbol N-ario genérico, su visualización indentada y su transformación a la estructura de primer hijo y siguiente hermano.

### 1. Modelo de Dominio N-ario

```java
public class NodoNario<T> {
    private final T valor;
    private final List<NodoNario<T>> hijos = new ArrayList<>();
    private NodoNario<T> padre;

    public NodoNario(T valor) {
        if (valor == null) throw new IllegalArgumentException("El valor no puede ser null");
        this.valor = valor;
    }

    public void agregarHijo(NodoNario<T> hijo) {
        if (hijo == null) throw new IllegalArgumentException("Hijo no puede ser null");
        if (hijo.padre != null) throw new IllegalStateException("El nodo ya posee un padre asignado");
        hijo.padre = this;
        this.hijos.add(hijo);
    }
    // getters defensivos...
}
```

### 2. Algoritmos de Recorrido y Métricas

- **Recorrido Preorden**: procesar el nodo actual y luego invocar recursivamente el preorden para cada uno de sus hijos en orden de aparición.
- **Altura**: $0$ si el nodo es hoja; caso contrario $1 + \max(\text{altura de sus hijos})$.
- **Hojas**: nodos cuya lista de hijos tiene tamaño 0.

### 3. Transformación Primer Hijo / Siguiente Hermano

En la estructura binaria equivalente:
- El enlace `primerHijo` apunta al primer elemento de la lista de hijos.
- El enlace `siguienteHermano` conecta en cadena horizontal a cada hermano con el posterior.
- **Invariante crítico**: la raíz del árbol general no tiene hermanos; su puntero `siguienteHermano` debe ser estrictamente `null`.
