---
course: 'java'
slug: '16-grafos-representacion-y-algoritmos'
title: 'Grafos: Matriz, Lista de Adyacencia, BFS, DFS y Dijkstra'
description: 'Modelá redes con grafos, elegí entre matriz y lista de adyacencia, implementá BFS y DFS con la estructura correcta, y entendé cómo Dijkstra encuentra el camino más barato.'
order: 18
lang: 'es'
published: true
---

# Grafos: Matriz, Lista de Adyacencia, BFS, DFS y Dijkstra

Un árbol tiene una regla estricta: **cada nodo tiene exactamente un padre y no hay ciclos**. Eso alcanza para jerarquías, pero se queda corto para casi todo lo demás.

En una red social, si vos sos amigo de Ana y Ana es amiga de Luis, y Luis también es amigo tuyo, ¿quién es el padre de quién? En un mapa de calles, ¿cuál es la raíz? Ninguna de esas preguntas tiene sentido, porque **eso no es un árbol: es un grafo**.

Un **grafo** es la estructura más general de todas. De hecho, un árbol es simplemente un grafo con restricciones: conectado, sin ciclos y con una raíz elegida.

---

## 1. Vocabulario

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-graf-t">
<title id="d-graf-t">Grafo no dirigido y grafo dirigido con pesos, con su vocabulario básico</title>
<defs><marker id="ar-gd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="0" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">No dirigido — la relación va en los dos sentidos</text>
<line x1="70" y1="80" x2="200" y2="60" stroke="var(--color-accent-2-700)" stroke-width="2"/>
<line x1="200" y1="60" x2="270" y2="160" stroke="var(--color-accent-2-700)" stroke-width="2"/>
<line x1="270" y1="160" x2="150" y2="200" stroke="var(--color-accent-2-700)" stroke-width="2"/>
<line x1="150" y1="200" x2="40" y2="170" stroke="var(--color-accent-2-700)" stroke-width="2"/>
<line x1="40" y1="170" x2="70" y2="80" stroke="var(--color-accent-2-700)" stroke-width="2"/>
<line x1="70" y1="80" x2="270" y2="160" stroke="var(--color-accent-2-700)" stroke-width="2"/>
<circle cx="70" cy="80" r="20" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="70" y="86" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">A</text>
<circle cx="200" cy="60" r="20" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="200" y="66" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">B</text>
<circle cx="270" cy="160" r="20" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="270" y="166" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">C</text>
<circle cx="150" cy="200" r="20" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="150" y="206" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D</text>
<circle cx="40" cy="170" r="20" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="40" y="176" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">E</text>
<text x="0" y="240" font-size="11" fill="var(--color-neutral-800)">"A es amigo de B" implica "B es amigo de A".</text>
<text x="0" y="256" font-size="11" fill="var(--color-neutral-800)">El grado de A es 3: lo tocan tres aristas.</text>
<line x1="345" y1="10" x2="345" y2="270" stroke="var(--color-divider)" stroke-width="1.5"/>
<text x="375" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Dirigido y con pesos — sentido y costo</text>
<line x1="445" y1="80" x2="556" y2="63" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-gd)"/>
<line x1="575" y1="80" x2="639" y2="141" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-gd)"/>
<line x1="626" y1="171" x2="546" y2="194" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-gd)"/>
<line x1="506" y1="194" x2="437" y2="176" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-gd)"/>
<line x1="418" y1="151" x2="440" y2="102" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-gd)"/>
<text x="498" y="62" font-size="11" font-weight="700" fill="var(--color-accent-700)">4</text>
<text x="620" y="104" font-size="11" font-weight="700" fill="var(--color-accent-700)">2</text>
<text x="588" y="196" font-size="11" font-weight="700" fill="var(--color-accent-700)">5</text>
<text x="468" y="200" font-size="11" font-weight="700" fill="var(--color-accent-700)">1</text>
<text x="404" y="124" font-size="11" font-weight="700" fill="var(--color-accent-700)">7</text>
<circle cx="445" cy="80" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="445" y="86" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>
<circle cx="575" cy="60" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="575" y="66" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<circle cx="645" cy="160" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="645" y="166" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<circle cx="525" cy="200" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="525" y="206" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">D</text>
<circle cx="415" cy="170" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="415" y="176" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">E</text>
<text x="375" y="240" font-size="11" fill="var(--color-neutral-800)">"A sigue a B" no implica "B sigue a A".</text>
<text x="375" y="256" font-size="11" fill="var(--color-neutral-800)">El peso es el costo de recorrer esa arista.</text>
<text x="0" y="292" font-size="12" fill="var(--color-neutral-700)">VÉRTICE: cada círculo. ARISTA: cada línea. VECINOS de A: los vértices con los que A tiene una arista directa.</text>
</svg>
<figcaption>Con estos cuatro atributos —dirigido o no, con peso o sin peso— se modela casi cualquier red del mundo real.</figcaption>
</figure>

Ejemplos que ya usás todos los días:

| Sistema | Vértices | Aristas | Tipo |
| --- | --- | --- | --- |
| Red social (amistades) | Personas | "son amigos" | No dirigido |
| Red social (seguidores) | Personas | "sigue a" | Dirigido |
| Mapas y navegación | Esquinas | Calles con distancia | Dirigido con pesos |
| Internet | Routers | Enlaces con latencia | Dirigido con pesos |
| Dependencias de un build | Módulos | "depende de" | Dirigido, sin ciclos |

---

## 2. Las dos formas de representarlo

Un grafo no se guarda "como se ve". Hay dos representaciones estándar, y elegir mal cuesta caro.

<figure class="diagram">
<svg viewBox="0 0 720 320" role="img" aria-labelledby="d-rep-t">
<title id="d-rep-t">Matriz de adyacencia y lista de adyacencia para el mismo grafo</title>
<text x="0" y="18" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">Grafo: A–B, A–C, B–C, C–D</text>
<line x1="55" y1="50" x2="55" y2="110" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="72" y1="43" x2="163" y2="103" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="55" y1="128" x2="163" y2="121" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="180" y1="130" x2="180" y2="168" stroke="var(--color-neutral-600)" stroke-width="2"/>
<circle cx="55" cy="34" r="17" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="55" y="39" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">A</text>
<circle cx="55" cy="128" r="17" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="55" y="133" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">B</text>
<circle cx="180" cy="113" r="17" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="180" y="118" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">C</text>
<circle cx="180" cy="185" r="17" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="180" y="190" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">D</text>
<text x="250" y="18" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">Matriz de adyacencia</text>
<text x="270" y="42" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">A</text>
<text x="316" y="42" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">B</text>
<text x="362" y="42" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">C</text>
<text x="408" y="42" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">D</text>
<text x="238" y="70" font-size="11" font-weight="700" text-anchor="end" fill="var(--color-neutral-700)">A</text>
<text x="238" y="102" font-size="11" font-weight="700" text-anchor="end" fill="var(--color-neutral-700)">B</text>
<text x="238" y="134" font-size="11" font-weight="700" text-anchor="end" fill="var(--color-neutral-700)">C</text>
<text x="238" y="166" font-size="11" font-weight="700" text-anchor="end" fill="var(--color-neutral-700)">D</text>
<rect x="248" y="50" width="44" height="28" rx="6" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="270" y="70" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">0</text>
<rect x="294" y="50" width="44" height="28" rx="6" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="316" y="70" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">1</text>
<rect x="340" y="50" width="44" height="28" rx="6" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="362" y="70" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">1</text>
<rect x="386" y="50" width="44" height="28" rx="6" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="408" y="70" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">0</text>
<rect x="248" y="82" width="44" height="28" rx="6" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="270" y="102" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">1</text>
<rect x="294" y="82" width="44" height="28" rx="6" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="316" y="102" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">0</text>
<rect x="340" y="82" width="44" height="28" rx="6" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="362" y="102" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">1</text>
<rect x="386" y="82" width="44" height="28" rx="6" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="408" y="102" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">0</text>
<rect x="248" y="114" width="44" height="28" rx="6" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="270" y="134" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">1</text>
<rect x="294" y="114" width="44" height="28" rx="6" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="316" y="134" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">1</text>
<rect x="340" y="114" width="44" height="28" rx="6" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="362" y="134" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">0</text>
<rect x="386" y="114" width="44" height="28" rx="6" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="408" y="134" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">1</text>
<rect x="248" y="146" width="44" height="28" rx="6" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="270" y="166" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">0</text>
<rect x="294" y="146" width="44" height="28" rx="6" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="316" y="166" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">0</text>
<rect x="340" y="146" width="44" height="28" rx="6" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="362" y="166" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">1</text>
<rect x="386" y="146" width="44" height="28" rx="6" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="408" y="166" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">0</text>
<text x="470" y="18" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">Lista de adyacencia</text>
<rect x="470" y="46" width="250" height="30" rx="10" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="484" y="66" font-size="11.5" fill="var(--color-text)">A  →  [ B, C ]</text>
<rect x="470" y="82" width="250" height="30" rx="10" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="484" y="102" font-size="11.5" fill="var(--color-text)">B  →  [ A, C ]</text>
<rect x="470" y="118" width="250" height="30" rx="10" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="484" y="138" font-size="11.5" fill="var(--color-text)">C  →  [ A, B, D ]</text>
<rect x="470" y="154" width="250" height="30" rx="10" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="484" y="174" font-size="11.5" fill="var(--color-text)">D  →  [ C ]</text>
<line x1="0" y1="206" x2="720" y2="206" stroke="var(--color-divider)"/>
<text x="0" y="228" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">¿Existe la arista A–D?</text>
<text x="290" y="228" font-size="11.5" fill="var(--color-accent-700)">O(1) — una sola consulta</text>
<text x="500" y="228" font-size="11.5" fill="var(--color-neutral-800)">O(grado) — hay que recorrer</text>
<text x="0" y="252" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">Recorrer los vecinos de A</text>
<text x="290" y="252" font-size="11.5" fill="var(--color-neutral-800)">O(V) — mira toda la fila</text>
<text x="500" y="252" font-size="11.5" fill="var(--color-accent-2-700)">O(grado) — solo los que hay</text>
<text x="0" y="276" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">Memoria</text>
<text x="290" y="276" font-size="11.5" fill="var(--color-neutral-800)">O(V²) siempre, aunque esté vacío</text>
<text x="500" y="276" font-size="11.5" fill="var(--color-accent-2-700)">O(V + E)</text>
<text x="0" y="300" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">Cuándo conviene</text>
<text x="290" y="300" font-size="11.5" fill="var(--color-neutral-800)">grafo denso (casi todos conectados)</text>
<text x="500" y="300" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">grafo disperso: el caso normal</text>
</svg>
<figcaption>Una red social con mil millones de personas y doscientos amigos cada una: la matriz pediría un trillón de celdas; la lista, doscientos mil millones. Por eso en la práctica se usa lista.</figcaption>
</figure>

En Java, la lista de adyacencia se escribe con un `Map`, que ya conocés de la lección 14:

```java
public class Grafo<V> {
    private final Map<V, List<V>> adyacencia = new HashMap<>();

    public void agregarVertice(V v) {
        adyacencia.putIfAbsent(v, new ArrayList<>());
    }

    // No dirigido: la arista se agrega en los dos sentidos
    public void agregarArista(V origen, V destino) {
        adyacencia.computeIfAbsent(origen,  k -> new ArrayList<>()).add(destino);
        adyacencia.computeIfAbsent(destino, k -> new ArrayList<>()).add(origen);
    }

    public List<V> vecinos(V v) {
        return adyacencia.getOrDefault(v, List.of());
    }
}
```

Fijate que `computeIfAbsent` y `getOrDefault` —los métodos de `Map` de la lección 14— hacen todo el trabajo pesado. Sin ellos harían falta cuatro `if` extra.

---

## 3. BFS y DFS: el mismo algoritmo con distinta memoria

Recorrer un grafo tiene un problema que los árboles no tenían: **los ciclos**. Si A conecta con B, B con C y C con A, un recorrido ingenuo da vueltas para siempre.

La solución es un `Set` de visitados. Y con eso, los dos recorridos clásicos difieren en **una sola cosa**: qué estructura guarda los vértices pendientes.

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-bfs-t">
<title id="d-bfs-t">Orden de visita de BFS y DFS sobre el mismo grafo partiendo de A</title>
<text x="0" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">BFS — con una COLA (FIFO)</text>
<line x1="60" y1="70" x2="170" y2="50" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<line x1="60" y1="70" x2="110" y2="150" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<line x1="170" y1="50" x2="280" y2="80" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<line x1="170" y1="50" x2="230" y2="150" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<line x1="110" y1="150" x2="230" y2="150" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<line x1="280" y1="80" x2="230" y2="150" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<line x1="230" y1="150" x2="170" y2="230" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<circle cx="60" cy="70" r="19" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-700)" stroke-width="2.5"/>
<text x="60" y="76" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">A1</text>
<circle cx="170" cy="50" r="19" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="170" y="56" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">B2</text>
<circle cx="110" cy="150" r="19" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="110" y="156" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">D3</text>
<circle cx="280" cy="80" r="19" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="280" y="86" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">C4</text>
<circle cx="230" cy="150" r="19" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="230" y="156" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">E5</text>
<circle cx="170" cy="230" r="19" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="170" y="236" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">F6</text>
<text x="0" y="278" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">A · B · D · C · E · F</text>
<text x="0" y="298" font-size="11" fill="var(--color-neutral-800)">Explora por CAPAS: primero todos los vecinos</text>
<text x="0" y="314" font-size="11" fill="var(--color-neutral-800)">directos, después los vecinos de esos.</text>
<text x="0" y="334" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">Encuentra el camino más corto en cantidad de aristas.</text>
<line x1="345" y1="10" x2="345" y2="330" stroke="var(--color-divider)" stroke-width="1.5"/>
<text x="375" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">DFS — con una PILA (LIFO) o recursión</text>
<line x1="435" y1="70" x2="545" y2="50" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<line x1="435" y1="70" x2="485" y2="150" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<line x1="545" y1="50" x2="655" y2="80" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<line x1="545" y1="50" x2="605" y2="150" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<line x1="485" y1="150" x2="605" y2="150" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<line x1="655" y1="80" x2="605" y2="150" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<line x1="605" y1="150" x2="545" y2="230" stroke="var(--color-neutral-500)" stroke-width="1.8"/>
<circle cx="435" cy="70" r="19" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="435" y="76" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A1</text>
<circle cx="545" cy="50" r="19" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="545" y="56" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B2</text>
<circle cx="485" cy="150" r="19" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="485" y="156" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">D5</text>
<circle cx="655" cy="80" r="19" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="655" y="86" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C3</text>
<circle cx="605" cy="150" r="19" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="605" y="156" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">E4</text>
<circle cx="545" cy="230" r="19" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="545" y="236" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">F6</text>
<text x="375" y="278" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">A · B · C · E · D · F</text>
<text x="375" y="298" font-size="11" fill="var(--color-neutral-800)">Se HUNDE hasta el fondo por un camino antes</text>
<text x="375" y="314" font-size="11" fill="var(--color-neutral-800)">de volver atrás y probar otro.</text>
<text x="375" y="334" font-size="11" font-weight="700" fill="var(--color-accent-700)">Sirve para detectar ciclos y ordenar dependencias.</text>
</svg>
<figcaption>Mismo grafo, mismo punto de partida, mismo código: lo único que cambia es si los pendientes salen por donde entraron o por donde entró el último.</figcaption>
</figure>

```java
// BFS — cola: primero en entrar, primero en salir
public List<V> bfs(V inicio) {
    List<V> orden = new ArrayList<>();
    Set<V> visitados = new HashSet<>();
    Queue<V> pendientes = new ArrayDeque<>();

    visitados.add(inicio);       // ← marcar AL ENCOLAR, no al desencolar
    pendientes.offer(inicio);

    while (!pendientes.isEmpty()) {
        V actual = pendientes.poll();
        orden.add(actual);

        for (V vecino : vecinos(actual)) {
            if (visitados.add(vecino)) {     // add devuelve false si ya estaba
                pendientes.offer(vecino);
            }
        }
    }
    return orden;
}

// DFS — recursivo: la pila de llamadas de la JVM hace de pila
public List<V> dfs(V inicio) {
    List<V> orden = new ArrayList<>();
    dfs(inicio, new HashSet<>(), orden);
    return orden;
}

private void dfs(V actual, Set<V> visitados, List<V> orden) {
    if (!visitados.add(actual)) return;   // ya lo visitamos: cortar
    orden.add(actual);
    for (V vecino : vecinos(actual)) {
        dfs(vecino, visitados, orden);
    }
}
```

> **Marcá como visitado al encolar, no al desencolar.** Si esperás a sacarlo de la cola, un mismo vértice puede entrar varias veces antes de procesarse por primera vez. En un grafo grande eso no es un detalle: multiplica el trabajo y puede agotar la memoria.

---

## 4. Dijkstra: el camino más barato

BFS encuentra el camino con **menos aristas**. Pero si las aristas tienen peso —kilómetros, minutos, costo— el camino más corto en cantidad de saltos puede ser carísimo.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-dij-t">
<title id="d-dij-t">Evolución de la tabla de distancias del algoritmo de Dijkstra</title>
<defs><marker id="ar-dj" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<line x1="70" y1="50" x2="206" y2="50" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-dj)"/>
<text x="140" y="40" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">4</text>
<line x1="50" y1="70" x2="50" y2="146" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-dj)"/>
<text x="34" y="115" font-size="12" font-weight="700" fill="var(--color-accent-700)">2</text>
<line x1="66" y1="157" x2="214" y2="63" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-dj)"/>
<text x="120" y="98" font-size="12" font-weight="700" fill="var(--color-accent-700)">1</text>
<line x1="230" y1="70" x2="230" y2="146" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-dj)"/>
<text x="242" y="115" font-size="12" font-weight="700" fill="var(--color-accent-700)">5</text>
<line x1="70" y1="176" x2="206" y2="172" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-dj)"/>
<text x="140" y="194" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">8</text>
<line x1="218" y1="187" x2="156" y2="240" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-dj)"/>
<text x="200" y="226" font-size="12" font-weight="700" fill="var(--color-accent-700)">3</text>
<circle cx="50" cy="50" r="20" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-700)" stroke-width="2.5"/>
<text x="50" y="56" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">A</text>
<circle cx="230" cy="50" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="230" y="56" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<circle cx="50" cy="170" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="50" y="176" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<circle cx="230" cy="170" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="230" y="176" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">D</text>
<circle cx="140" cy="256" r="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="140" y="262" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">E</text>
<text x="330" y="18" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">paso</text>
<text x="468" y="18" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">A</text>
<text x="524" y="18" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">B</text>
<text x="580" y="18" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">C</text>
<text x="636" y="18" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">D</text>
<text x="692" y="18" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">E</text>
<rect x="330" y="26" width="390" height="30" rx="8" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="340" y="46" font-size="11" fill="var(--color-text)">inicio</text>
<text x="468" y="46" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">0</text>
<text x="524" y="46" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<text x="580" y="46" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<text x="636" y="46" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<text x="692" y="46" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<rect x="330" y="60" width="390" height="30" rx="8" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="340" y="80" font-size="11" fill="var(--color-text)">visito A</text>
<text x="468" y="80" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">0</text>
<text x="524" y="80" font-size="11.5" text-anchor="middle" fill="var(--color-text)">4</text>
<text x="580" y="80" font-size="11.5" text-anchor="middle" fill="var(--color-text)">2</text>
<text x="636" y="80" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<text x="692" y="80" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<rect x="330" y="94" width="390" height="30" rx="8" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="340" y="114" font-size="11" font-weight="700" fill="var(--color-accent-700)">visito C</text>
<text x="468" y="114" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">0</text>
<text x="524" y="114" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">3</text>
<text x="580" y="114" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">2</text>
<text x="636" y="114" font-size="11.5" text-anchor="middle" fill="var(--color-text)">10</text>
<text x="692" y="114" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<rect x="330" y="128" width="390" height="30" rx="8" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="340" y="148" font-size="11" fill="var(--color-text)">visito B</text>
<text x="468" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">0</text>
<text x="524" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">3</text>
<text x="580" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">2</text>
<text x="636" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">8</text>
<text x="692" y="148" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<rect x="330" y="162" width="390" height="30" rx="8" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="340" y="182" font-size="11" fill="var(--color-text)">visito D</text>
<text x="468" y="182" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">0</text>
<text x="524" y="182" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">3</text>
<text x="580" y="182" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">2</text>
<text x="636" y="182" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">8</text>
<text x="692" y="182" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">11</text>
<text x="330" y="222" font-size="12" font-weight="700" fill="var(--color-accent-700)">El camino más corto de A a B NO es la arista directa, que cuesta 4.</text>
<text x="330" y="242" font-size="12" fill="var(--color-neutral-800)">Es A → C → B, con costo 2 + 1 = 3. La fila "visito C" es donde se descubre.</text>
<text x="330" y="266" font-size="11.5" fill="var(--color-neutral-700)">Dijkstra visita siempre el vértice pendiente más barato y relaja sus aristas:</text>
<text x="330" y="284" font-size="11.5" fill="var(--color-neutral-700)">si llegar por acá es más barato que lo anotado, actualiza la distancia.</text>
</svg>
<figcaption>Ese salto de 4 a 3 en la columna B es todo el algoritmo: una arista más barata puede aparecer por un camino más largo en cantidad de saltos.</figcaption>
</figure>

```java
public Map<V, Integer> dijkstra(V origen) {
    Map<V, Integer> distancia = new HashMap<>();
    Set<V> visitados = new HashSet<>();

    // La cola de prioridad de la lección 14: siempre saca el más barato
    PriorityQueue<V> cola = new PriorityQueue<>(
        Comparator.comparingInt(v -> distancia.getOrDefault(v, Integer.MAX_VALUE))
    );

    distancia.put(origen, 0);
    cola.offer(origen);

    while (!cola.isEmpty()) {
        V actual = cola.poll();
        if (!visitados.add(actual)) continue;   // ya lo procesamos

        for (Arista<V> arista : aristasDe(actual)) {
            int nueva = distancia.get(actual) + arista.peso();
            // "Relajar": si por acá sale más barato, actualizamos
            if (nueva < distancia.getOrDefault(arista.destino(), Integer.MAX_VALUE)) {
                distancia.put(arista.destino(), nueva);
                cola.offer(arista.destino());
            }
        }
    }
    return distancia;
}
```

> Dijkstra **no funciona con pesos negativos**. Su garantía se basa en que una vez que visitás un vértice, su distancia ya es definitiva; con un peso negativo eso deja de ser cierto. Para ese caso existe Bellman-Ford.

---

## 5. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| Recorrer sin un `Set` de visitados | Bucle infinito apenas hay un ciclo, que es casi siempre. | Un `HashSet<V>` de visitados, consultado antes de encolar. |
| Marcar como visitado al desencolar | Un vértice entra a la cola varias veces; el trabajo se multiplica. | Marcar en el momento de encolar. |
| Usar matriz de adyacencia para un grafo grande y disperso | O(V²) de memoria: un millón de vértices son un billón de celdas. | Lista de adyacencia (`Map<V, List<V>>`). |
| Olvidar la arista inversa en un grafo no dirigido | El grafo queda dirigido sin querer y los recorridos no llegan a la mitad. | Agregar la arista en los dos sentidos. |
| Usar BFS para caminos con pesos | Devuelve el camino con menos saltos, que puede ser el más caro. | Dijkstra cuando las aristas tienen costo. |
| Usar Dijkstra con pesos negativos | Da resultados incorrectos sin lanzar ninguna excepción. | Bellman-Ford. |
| DFS recursivo sobre un grafo enorme | `StackOverflowError` a partir de unos miles de niveles. | DFS iterativo con `ArrayDeque` como pila explícita. |

---

## 6. Ejercicio práctico guiado

### Desafío: grados de separación en una red social

Implementá `saltosMinimos(String desde, String hasta)` que devuelva la cantidad mínima de intermediarios entre dos personas, y `caminoMasCorto(...)` que devuelva la cadena de personas.

Pensá por qué **BFS es la única opción correcta** acá, y por qué DFS daría un resultado equivocado.

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.*;

public class RedSocial {

    private final Map<String, List<String>> amigos = new HashMap<>();

    public void agregarAmistad(String a, String b) {
        // No dirigido: la amistad va en los dos sentidos
        amigos.computeIfAbsent(a, k -> new ArrayList<>()).add(b);
        amigos.computeIfAbsent(b, k -> new ArrayList<>()).add(a);
    }

    /**
     * BFS: devuelve la cantidad mínima de saltos, o -1 si no hay conexión.
     * DFS NO sirve acá: encontraría *un* camino, no el más corto.
     */
    public int saltosMinimos(String desde, String hasta) {
        if (!amigos.containsKey(desde) || !amigos.containsKey(hasta)) return -1;
        if (desde.equals(hasta)) return 0;

        Set<String> visitados = new HashSet<>();
        Queue<String> cola = new ArrayDeque<>();

        visitados.add(desde);
        cola.offer(desde);
        int saltos = 0;

        while (!cola.isEmpty()) {
            int personasEnEsteNivel = cola.size();   // ← la clave del conteo por niveles
            saltos++;

            for (int i = 0; i < personasEnEsteNivel; i++) {
                String actual = cola.poll();

                for (String amigo : amigos.getOrDefault(actual, List.of())) {
                    if (amigo.equals(hasta)) return saltos;
                    if (visitados.add(amigo)) {      // add devuelve false si ya estaba
                        cola.offer(amigo);
                    }
                }
            }
        }
        return -1;   // recorrimos todo lo alcanzable y no apareció
    }

    /**
     * Misma idea, pero guardando de dónde vino cada persona
     * para poder reconstruir el camino al final.
     */
    public List<String> caminoMasCorto(String desde, String hasta) {
        if (!amigos.containsKey(desde) || !amigos.containsKey(hasta)) return List.of();

        Map<String, String> vinoDe = new HashMap<>();
        Set<String> visitados = new HashSet<>();
        Queue<String> cola = new ArrayDeque<>();

        visitados.add(desde);
        cola.offer(desde);

        while (!cola.isEmpty()) {
            String actual = cola.poll();

            if (actual.equals(hasta)) {
                // Reconstruimos el camino yendo hacia atrás desde el destino
                LinkedList<String> camino = new LinkedList<>();
                for (String p = hasta; p != null; p = vinoDe.get(p)) {
                    camino.addFirst(p);
                }
                return camino;
            }

            for (String amigo : amigos.getOrDefault(actual, List.of())) {
                if (visitados.add(amigo)) {
                    vinoDe.put(amigo, actual);   // recordamos el padre en el recorrido
                    cola.offer(amigo);
                }
            }
        }
        return List.of();
    }

    public static void main(String[] args) {
        RedSocial red = new RedSocial();
        red.agregarAmistad("Ana",    "Beto");
        red.agregarAmistad("Beto",   "Carla");
        red.agregarAmistad("Carla",  "Diego");
        red.agregarAmistad("Ana",    "Elena");
        red.agregarAmistad("Elena",  "Diego");
        red.agregarAmistad("Fabián", "Gala");   // grupo desconectado del resto

        System.out.println("Ana → Diego  : " + red.saltosMinimos("Ana", "Diego"));
        System.out.println("Camino       : " + red.caminoMasCorto("Ana", "Diego"));
        System.out.println("Ana → Fabián : " + red.saltosMinimos("Ana", "Fabián"));
        System.out.println("Ana → Ana    : " + red.saltosMinimos("Ana", "Ana"));
    }
}
```

Salida:

```
Ana → Diego  : 2
Camino       : [Ana, Elena, Diego]
Ana → Fabián : -1
Ana → Ana    : 0
```

**Por qué BFS y no DFS.** De Ana a Diego hay dos caminos: `Ana → Beto → Carla → Diego` (3 saltos) y `Ana → Elena → Diego` (2 saltos). Un DFS que arranque por Beto encuentra el de 3 saltos primero, lo devuelve, y nunca se entera de que había uno mejor.

BFS explora por capas: **agota todo lo que está a 1 salto antes de mirar nada a 2 saltos**. Por eso el primer camino que encuentra es necesariamente el más corto. Es una garantía del algoritmo, no una casualidad.

**El detalle de `cola.size()`.** Guardar el tamaño de la cola al empezar cada vuelta es lo que permite saber dónde termina un nivel y empieza el siguiente. Sin eso podés saber *si* hay camino, pero no de cuántos saltos.

**Y el mapa `vinoDe`.** BFS te dice que llegaste, pero no por dónde. Anotando el padre de cada persona al descubrirla, después reconstruís el camino caminando hacia atrás desde el destino. Es el mismo truco que usa un GPS para dibujarte la ruta.

</details>

---

## Para llevarte

- Un **grafo** es la estructura más general: un árbol es un grafo conectado, sin ciclos y con raíz.
- **Lista de adyacencia** para grafos dispersos (casi todos los reales); matriz solo si es denso.
- En Java, la lista de adyacencia es un `Map<V, List<V>>`, y `computeIfAbsent` hace el trabajo pesado.
- Sin un `Set` de **visitados**, cualquier ciclo convierte el recorrido en un bucle infinito.
- BFS y DFS son el mismo algoritmo: **solo cambia si los pendientes están en una cola o en una pila**.
- Marcá los vértices como visitados **al encolar**, nunca al desencolar.
- **BFS da el camino con menos aristas**; si las aristas tienen peso, hace falta Dijkstra.
- Dijkstra visita siempre el pendiente más barato y **relaja** las aristas. No sirve con pesos negativos.
</content>
