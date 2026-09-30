---
course: 'java'
lesson: '16-grafos-representacion-y-algoritmos'
slug: 'red-rutas-transporte-grafos'
title: 'Modelado de Red de Transporte: Lista de Adyacencia, BFS y Dijkstra'
description: 'Diseñá una red de transporte público modelada como un grafo con lista de adyacencia y resolvé la búsqueda de caminos mínimos por transbordos (BFS) y por tiempo acumulado (Dijkstra).'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 70
objectives:
  - 'Modelar redes complejas del mundo real utilizando grafos orientados a objetos con lista de adyacencia.'
  - 'Implementar el algoritmo de Búsqueda en Anchura (BFS) utilizando una Cola para encontrar el camino con menor número de saltos.'
  - 'Implementar el algoritmo de Dijkstra con `PriorityQueue` para hallar el camino de menor costo en un grafo ponderado.'
  - 'Encapsular el grafo separando la estructura topológica de los algoritmos de navegación y optimización.'
requirements:
  - 'Crear la clase inmutable o encapsulada Estacion (id, nombre) con equals y hashCode basados en id.'
  - 'Crear la clase Arista con destino (Estacion) y peso (double o int representando minutos de viaje).'
  - 'Implementar GrafoTransporte con almacenamiento basado en lista de adyacencia: Map<Estacion, List<Arista>> adj.'
  - 'Proveer métodos: void agregarEstacion(Estacion e), void conectarBidireccional(Estacion a, Estacion b, double minutos).'
  - 'Implementar List<Estacion> buscarCaminoMenosTransbordos(Estacion origen, Estacion destino) utilizando BFS con una Cola (Queue<Estacion>) y un mapa de predecesores.'
  - 'Implementar ResultadoRuta buscarRutaMasRapida(Estacion origen, Estacion destino) utilizando el algoritmo de Dijkstra con PriorityQueue, reconstruyendo el camino óptimo y la duración total.'
  - 'Validar que los pesos sean estrictamente positivos (> 0) y que los vértices existan en el grafo antes de conectar aristas.'
  - 'En MainGrafos.java, simular una red de metro/tren con al menos 6 estaciones y contrastar el camino con menos estaciones intermedias versus el camino más rápido en minutos.'
exampleOutput: |
  === Red de Transporte Metropolitano (Grafos) ===
  Estaciones registradas: [Retiro, Constitución, Once, Palermo, Belgrano, Flores]
  Conexiones y tiempos configurados con éxito.

  --- Consulta 1: Menor cantidad de transbordos (BFS) ---
  Origen: Retiro -> Destino: Flores
  Camino mínimo en saltos: Retiro -> Palermo -> Flores (2 transbordos / tramos)

  --- Consulta 2: Menor tiempo de viaje (Dijkstra) ---
  Origen: Retiro -> Destino: Flores
  Ruta óptima en tiempo: Retiro -> Once -> Constitución -> Flores
  Duración total: 18.5 minutos
  [OK] Dijkstra discriminó correctamente el camino más veloz a pesar de tener más estaciones.
deliveryTips:
  - 'En Dijkstra, creá una clase auxiliar privada NodoDijkstra(Estacion estacion, double distanciaAcumulada) que implemente `Comparable<NodoDijkstra>` para la `PriorityQueue`.'
  - 'Reconstruí el camino final desde el destino hacia el origen siguiendo el mapa de padres o predecesores y luego invertí la lista resultante.'
  - 'Utilizá `Double.POSITIVE_INFINITY` como valor inicial en el mapa de distancias mínimas.'
---

## Contexto

Cuando las relaciones entre entidades superan las restricciones jerárquicas de un árbol (donde no hay ciclos y cada nodo tiene un solo padre), el **Grafo** es la estructura adecuada. Un mapa de rutas viales, una red eléctrica o las conexiones de vuelos son grafos: conjuntos de **vértices** unidos por **aristas** con sentido (dirigidos) y costos asociados (ponderados).

La elección de la estructura interna impacta directamente en el rendimiento:
- **Lista de adyacencia**: óptima para grafos dispersos (*sparse graphs*), ocupando $O(V + E)$ en memoria y permitiendo iterar eficientemente sobre los vecinos directos de cada vértice.
- **Búsqueda en Anchura (BFS)**: explora por capas concéntricas utilizando una **Cola (FIFO)**, garantizando encontrar el camino más corto en cantidad de aristas (menor número de transbordos).
- **Algoritmo de Dijkstra**: explora mediante una **Cola de Prioridad**, garantizando encontrar el camino de mínimo costo acumulado (menor tiempo o distancia) en grafos con pesos positivos.

## Consigna

Vas a implementar un sistema de enrutamiento de transporte público en Java.

### 1. Modelo de Dominio

```java
public class Estacion {
    private final String id;
    private final String nombre;
    // constructor, getters, equals y hashCode basados en id
}

public class Arista {
    private final Estacion destino;
    private final double peso; // minutos de viaje
    // constructor y getters
}
```

### 2. Estructura del Grafo con Lista de Adyacencia

```java
public class GrafoTransporte {
    private final Map<Estacion, List<Arista>> adyacencia = new HashMap<>();

    public void agregarEstacion(Estacion estacion) {
        adyacencia.putIfAbsent(estacion, new ArrayList<>());
    }

    public void conectarBidireccional(Estacion a, Estacion b, double minutos) {
        if (minutos <= 0) throw new IllegalArgumentException("El tiempo debe ser mayor a cero");
        if (!adyacencia.containsKey(a) || !adyacencia.containsKey(b)) {
            throw new IllegalArgumentException("Ambas estaciones deben pertenecer al grafo");
        }
        adyacencia.get(a).add(new Arista(b, minutos));
        adyacencia.get(b).add(new Arista(a, minutos));
    }
}
```

### 3. Algoritmos de Búsqueda y Enrutamiento

1. **BFS (Menor cantidad de saltos)**:
   - Mantener un conjunto `Set<Estacion> visitados` y una cola `Queue<Estacion> cola`.
   - Registrar en un `Map<Estacion, Estacion> predecesores` para reconstruir el recorrido.
2. **Dijkstra (Menor tiempo acumulado)**:
   - Mantener un `Map<Estacion, Double> distancias` inicializado en infinito.
   - Encolar en `PriorityQueue` instancias de `(estacion, distanciaActual)`.
   - Cuando se relaja una arista $(u, v)$ con peso $w$: si $distancia[u] + w < distancia[v]$, actualizar $distancia[v]$ y registrar $u$ como predecesor de $v$.
