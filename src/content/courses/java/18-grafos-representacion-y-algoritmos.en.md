---
course: 'java'
slug: '16-grafos-representacion-y-algoritmos'
title: 'Graphs: Matrix, Adjacency List, BFS, DFS, and Dijkstra'
description: 'Model networks with graphs, choose between an adjacency matrix and an adjacency list, implement BFS and DFS with the right structure, and understand how Dijkstra finds the cheapest path.'
order: 17
lang: 'en'
published: true
---

# Graphs: Matrix, Adjacency List, BFS, DFS, and Dijkstra

A tree has a strict rule: **each node has exactly one parent and there are no cycles**. That is enough for hierarchies, but falls short for almost everything else.

In a social network, if you are friends with Ana and Ana is friends with Luis, and Luis is also friends with you, who is whose parent? On a street map, which corner is the root? Neither question makes sense, because **that is not a tree: it is a graph**.

A **graph** is the most general structure of all. In fact, a tree is simply a graph with restrictions: connected, acyclic, and with a chosen root.

---

## 1. Vocabulary

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-graph-t">
<title id="d-graph-t">An undirected graph and a weighted directed graph, with their basic vocabulary</title>
<defs><marker id="ar-gd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="0" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">Undirected — the relation goes both ways</text>
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
<text x="0" y="240" font-size="11" fill="var(--color-neutral-800)">"A is friends with B" implies "B is friends with A".</text>
<text x="0" y="256" font-size="11" fill="var(--color-neutral-800)">A's degree is 3: three edges touch it.</text>
<line x1="345" y1="10" x2="345" y2="270" stroke="var(--color-divider)" stroke-width="1.5"/>
<text x="375" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Directed and weighted — direction and cost</text>
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
<text x="375" y="240" font-size="11" fill="var(--color-neutral-800)">"A follows B" does not imply "B follows A".</text>
<text x="375" y="256" font-size="11" fill="var(--color-neutral-800)">The weight is the cost of traversing that edge.</text>
<text x="0" y="292" font-size="12" fill="var(--color-neutral-700)">VERTEX: each circle. EDGE: each line. A's NEIGHBORS: the vertices A shares a direct edge with.</text>
</svg>
<figcaption>With these four attributes — directed or not, weighted or not — you can model almost any real-world network.</figcaption>
</figure>

Examples you already use every day:

| System | Vertices | Edges | Type |
| --- | --- | --- | --- |
| Social network (friendships) | People | "are friends" | Undirected |
| Social network (followers) | People | "follows" | Directed |
| Maps and navigation | Intersections | Streets with distance | Directed, weighted |
| The internet | Routers | Links with latency | Directed, weighted |
| Build dependencies | Modules | "depends on" | Directed, acyclic |

---

## 2. The two ways to represent it

A graph is not stored "as it looks". There are two standard representations, and choosing wrong is expensive.

<figure class="diagram">
<svg viewBox="0 0 720 320" role="img" aria-labelledby="d-rep-t">
<title id="d-rep-t">Adjacency matrix and adjacency list for the same graph</title>
<text x="0" y="18" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">Graph: A–B, A–C, B–C, C–D</text>
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
<text x="250" y="18" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">Adjacency matrix</text>
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
<text x="470" y="18" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">Adjacency list</text>
<rect x="470" y="46" width="250" height="30" rx="10" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="484" y="66" font-size="11.5" fill="var(--color-text)">A  →  [ B, C ]</text>
<rect x="470" y="82" width="250" height="30" rx="10" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="484" y="102" font-size="11.5" fill="var(--color-text)">B  →  [ A, C ]</text>
<rect x="470" y="118" width="250" height="30" rx="10" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="484" y="138" font-size="11.5" fill="var(--color-text)">C  →  [ A, B, D ]</text>
<rect x="470" y="154" width="250" height="30" rx="10" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="484" y="174" font-size="11.5" fill="var(--color-text)">D  →  [ C ]</text>
<line x1="0" y1="206" x2="720" y2="206" stroke="var(--color-divider)"/>
<text x="0" y="228" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">Does edge A–D exist?</text>
<text x="290" y="228" font-size="11.5" fill="var(--color-accent-700)">O(1) — a single lookup</text>
<text x="500" y="228" font-size="11.5" fill="var(--color-neutral-800)">O(degree) — you must scan</text>
<text x="0" y="252" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">Iterate A's neighbors</text>
<text x="290" y="252" font-size="11.5" fill="var(--color-neutral-800)">O(V) — scans the whole row</text>
<text x="500" y="252" font-size="11.5" fill="var(--color-accent-2-700)">O(degree) — only what exists</text>
<text x="0" y="276" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">Memory</text>
<text x="290" y="276" font-size="11.5" fill="var(--color-neutral-800)">O(V²) always, even when empty</text>
<text x="500" y="276" font-size="11.5" fill="var(--color-accent-2-700)">O(V + E)</text>
<text x="0" y="300" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">When it wins</text>
<text x="290" y="300" font-size="11.5" fill="var(--color-neutral-800)">dense graph (nearly all connected)</text>
<text x="500" y="300" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">sparse graph: the normal case</text>
</svg>
<figcaption>A social network with a billion people and two hundred friends each: the matrix would demand a quintillion cells; the list, two hundred billion. That is why lists win in practice.</figcaption>
</figure>

In Java, the adjacency list is written with a `Map`, which you already know from lesson 14:

```java
public class Graph<V> {
    private final Map<V, List<V>> adjacency = new HashMap<>();

    public void addVertex(V v) {
        adjacency.putIfAbsent(v, new ArrayList<>());
    }

    // Undirected: the edge is added in both directions
    public void addEdge(V from, V to) {
        adjacency.computeIfAbsent(from, k -> new ArrayList<>()).add(to);
        adjacency.computeIfAbsent(to,   k -> new ArrayList<>()).add(from);
    }

    public List<V> neighbors(V v) {
        return adjacency.getOrDefault(v, List.of());
    }
}
```

Notice that `computeIfAbsent` and `getOrDefault` — the `Map` methods from lesson 14 — do all the heavy lifting. Without them you would need four extra `if` blocks.

---

## 3. BFS and DFS: the same algorithm with different memory

Traversing a graph has a problem trees did not: **cycles**. If A connects to B, B to C, and C back to A, a naive traversal loops forever.

The fix is a `Set` of visited vertices. And with that, the two classic traversals differ in **exactly one thing**: which structure holds the pending vertices.

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-bfs-t">
<title id="d-bfs-t">Visit order of BFS and DFS over the same graph starting from A</title>
<text x="0" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">BFS — with a QUEUE (FIFO)</text>
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
<text x="0" y="298" font-size="11" fill="var(--color-neutral-800)">Explores in LAYERS: all direct neighbors first,</text>
<text x="0" y="314" font-size="11" fill="var(--color-neutral-800)">then the neighbors of those.</text>
<text x="0" y="334" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">Finds the shortest path measured in edges.</text>
<line x1="345" y1="10" x2="345" y2="330" stroke="var(--color-divider)" stroke-width="1.5"/>
<text x="375" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">DFS — with a STACK (LIFO) or recursion</text>
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
<text x="375" y="298" font-size="11" fill="var(--color-neutral-800)">DIVES to the bottom along one path before</text>
<text x="375" y="314" font-size="11" fill="var(--color-neutral-800)">backtracking and trying another.</text>
<text x="375" y="334" font-size="11" font-weight="700" fill="var(--color-accent-700)">Good for cycle detection and dependency ordering.</text>
</svg>
<figcaption>Same graph, same starting point, same code: the only difference is whether pending vertices leave in the order they arrived or in reverse.</figcaption>
</figure>

```java
// BFS — queue: first in, first out
public List<V> bfs(V start) {
    List<V> order = new ArrayList<>();
    Set<V> visited = new HashSet<>();
    Queue<V> pending = new ArrayDeque<>();

    visited.add(start);       // ← mark ON ENQUEUE, not on dequeue
    pending.offer(start);

    while (!pending.isEmpty()) {
        V current = pending.poll();
        order.add(current);

        for (V neighbor : neighbors(current)) {
            if (visited.add(neighbor)) {     // add returns false if already present
                pending.offer(neighbor);
            }
        }
    }
    return order;
}

// DFS — recursive: the JVM call stack serves as the stack
public List<V> dfs(V start) {
    List<V> order = new ArrayList<>();
    dfs(start, new HashSet<>(), order);
    return order;
}

private void dfs(V current, Set<V> visited, List<V> order) {
    if (!visited.add(current)) return;   // already visited: stop
    order.add(current);
    for (V neighbor : neighbors(current)) {
        dfs(neighbor, visited, order);
    }
}
```

> **Mark as visited on enqueue, not on dequeue.** If you wait until you pull it off the queue, the same vertex can be enqueued several times before it is first processed. On a large graph that is not a detail: it multiplies the work and can exhaust memory.

---

## 4. Dijkstra: the cheapest path

BFS finds the path with the **fewest edges**. But when edges carry weight — kilometers, minutes, cost — the path with the fewest hops can be wildly expensive.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-dij-t">
<title id="d-dij-t">How Dijkstra's distance table evolves step by step</title>
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
<text x="330" y="18" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">step</text>
<text x="468" y="18" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">A</text>
<text x="524" y="18" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">B</text>
<text x="580" y="18" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">C</text>
<text x="636" y="18" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">D</text>
<text x="692" y="18" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">E</text>
<rect x="330" y="26" width="390" height="30" rx="8" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="340" y="46" font-size="11" fill="var(--color-text)">start</text>
<text x="468" y="46" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">0</text>
<text x="524" y="46" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<text x="580" y="46" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<text x="636" y="46" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<text x="692" y="46" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<rect x="330" y="60" width="390" height="30" rx="8" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="340" y="80" font-size="11" fill="var(--color-text)">visit A</text>
<text x="468" y="80" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">0</text>
<text x="524" y="80" font-size="11.5" text-anchor="middle" fill="var(--color-text)">4</text>
<text x="580" y="80" font-size="11.5" text-anchor="middle" fill="var(--color-text)">2</text>
<text x="636" y="80" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<text x="692" y="80" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<rect x="330" y="94" width="390" height="30" rx="8" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="340" y="114" font-size="11" font-weight="700" fill="var(--color-accent-700)">visit C</text>
<text x="468" y="114" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">0</text>
<text x="524" y="114" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">3</text>
<text x="580" y="114" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">2</text>
<text x="636" y="114" font-size="11.5" text-anchor="middle" fill="var(--color-text)">10</text>
<text x="692" y="114" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<rect x="330" y="128" width="390" height="30" rx="8" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="340" y="148" font-size="11" fill="var(--color-text)">visit B</text>
<text x="468" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">0</text>
<text x="524" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">3</text>
<text x="580" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">2</text>
<text x="636" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">8</text>
<text x="692" y="148" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">∞</text>
<rect x="330" y="162" width="390" height="30" rx="8" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="340" y="182" font-size="11" fill="var(--color-text)">visit D</text>
<text x="468" y="182" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">0</text>
<text x="524" y="182" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">3</text>
<text x="580" y="182" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">2</text>
<text x="636" y="182" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">8</text>
<text x="692" y="182" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">11</text>
<text x="330" y="222" font-size="12" font-weight="700" fill="var(--color-accent-700)">The shortest path from A to B is NOT the direct edge, which costs 4.</text>
<text x="330" y="242" font-size="12" fill="var(--color-neutral-800)">It is A → C → B, costing 2 + 1 = 3. The "visit C" row is where it is discovered.</text>
<text x="330" y="266" font-size="11.5" fill="var(--color-neutral-700)">Dijkstra always visits the cheapest pending vertex and relaxes its edges:</text>
<text x="330" y="284" font-size="11.5" fill="var(--color-neutral-700)">if arriving this way is cheaper than what is recorded, it updates the distance.</text>
</svg>
<figcaption>That drop from 4 to 3 in column B is the entire algorithm: a cheaper route can appear through a path with more hops.</figcaption>
</figure>

```java
public Map<V, Integer> dijkstra(V source) {
    Map<V, Integer> distance = new HashMap<>();
    Set<V> visited = new HashSet<>();

    // The priority queue from lesson 14: always pulls the cheapest
    PriorityQueue<V> queue = new PriorityQueue<>(
        Comparator.comparingInt(v -> distance.getOrDefault(v, Integer.MAX_VALUE))
    );

    distance.put(source, 0);
    queue.offer(source);

    while (!queue.isEmpty()) {
        V current = queue.poll();
        if (!visited.add(current)) continue;   // already processed

        for (Edge<V> edge : edgesFrom(current)) {
            int candidate = distance.get(current) + edge.weight();
            // "Relax": if this route is cheaper, record it
            if (candidate < distance.getOrDefault(edge.to(), Integer.MAX_VALUE)) {
                distance.put(edge.to(), candidate);
                queue.offer(edge.to());
            }
        }
    }
    return distance;
}
```

> Dijkstra **does not work with negative weights**. Its guarantee rests on a visited vertex's distance being final; a negative weight breaks that. For that case there is Bellman-Ford.

---

## 5. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| Traversing without a visited `Set` | Infinite loop as soon as there is a cycle, which is nearly always. | A `HashSet<V>` of visited vertices, checked before enqueueing. |
| Marking as visited on dequeue | A vertex enters the queue several times; the work multiplies. | Mark at the moment of enqueueing. |
| Using an adjacency matrix for a large sparse graph | O(V²) memory: a million vertices means a trillion cells. | Adjacency list (`Map<V, List<V>>`). |
| Forgetting the reverse edge in an undirected graph | The graph becomes accidentally directed and traversals miss half of it. | Add the edge in both directions. |
| Using BFS for weighted paths | It returns the fewest-hops path, which may be the most expensive. | Dijkstra when edges carry cost. |
| Using Dijkstra with negative weights | Wrong results, with no exception thrown. | Bellman-Ford. |
| Recursive DFS on a huge graph | `StackOverflowError` past a few thousand levels. | Iterative DFS with `ArrayDeque` as an explicit stack. |

---

## 6. Guided hands-on exercise

### Challenge: degrees of separation in a social network

Implement `minimumHops(String from, String to)` returning the minimum number of intermediaries between two people, plus `shortestPath(...)` returning the chain of people.

Think about why **BFS is the only correct choice** here, and why DFS would give the wrong answer.

<details>
<summary>See suggested solution</summary>

```java
import java.util.*;

public class SocialNetwork {

    private final Map<String, List<String>> friends = new HashMap<>();

    public void addFriendship(String a, String b) {
        // Undirected: friendship goes both ways
        friends.computeIfAbsent(a, k -> new ArrayList<>()).add(b);
        friends.computeIfAbsent(b, k -> new ArrayList<>()).add(a);
    }

    /**
     * BFS: returns the minimum number of hops, or -1 when unreachable.
     * DFS is NO good here: it would find *a* path, not the shortest one.
     */
    public int minimumHops(String from, String to) {
        if (!friends.containsKey(from) || !friends.containsKey(to)) return -1;
        if (from.equals(to)) return 0;

        Set<String> visited = new HashSet<>();
        Queue<String> queue = new ArrayDeque<>();

        visited.add(from);
        queue.offer(from);
        int hops = 0;

        while (!queue.isEmpty()) {
            int peopleAtThisLevel = queue.size();   // ← the key to counting levels
            hops++;

            for (int i = 0; i < peopleAtThisLevel; i++) {
                String current = queue.poll();

                for (String friend : friends.getOrDefault(current, List.of())) {
                    if (friend.equals(to)) return hops;
                    if (visited.add(friend)) {      // add returns false if present
                        queue.offer(friend);
                    }
                }
            }
        }
        return -1;   // walked everything reachable and never found them
    }

    /**
     * Same idea, but recording where each person was reached from
     * so the path can be reconstructed at the end.
     */
    public List<String> shortestPath(String from, String to) {
        if (!friends.containsKey(from) || !friends.containsKey(to)) return List.of();

        Map<String, String> cameFrom = new HashMap<>();
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new ArrayDeque<>();

        visited.add(from);
        queue.offer(from);

        while (!queue.isEmpty()) {
            String current = queue.poll();

            if (current.equals(to)) {
                // Rebuild the path by walking backwards from the destination
                LinkedList<String> path = new LinkedList<>();
                for (String p = to; p != null; p = cameFrom.get(p)) {
                    path.addFirst(p);
                }
                return path;
            }

            for (String friend : friends.getOrDefault(current, List.of())) {
                if (visited.add(friend)) {
                    cameFrom.put(friend, current);   // remember the traversal parent
                    queue.offer(friend);
                }
            }
        }
        return List.of();
    }

    public static void main(String[] args) {
        SocialNetwork net = new SocialNetwork();
        net.addFriendship("Ana",   "Beto");
        net.addFriendship("Beto",  "Carla");
        net.addFriendship("Carla", "Diego");
        net.addFriendship("Ana",   "Elena");
        net.addFriendship("Elena", "Diego");
        net.addFriendship("Fabian","Gala");   // group disconnected from the rest

        System.out.println("Ana → Diego  : " + net.minimumHops("Ana", "Diego"));
        System.out.println("Path         : " + net.shortestPath("Ana", "Diego"));
        System.out.println("Ana → Fabian : " + net.minimumHops("Ana", "Fabian"));
        System.out.println("Ana → Ana    : " + net.minimumHops("Ana", "Ana"));
    }
}
```

Output:

```
Ana → Diego  : 2
Path         : [Ana, Elena, Diego]
Ana → Fabian : -1
Ana → Ana    : 0
```

**Why BFS and not DFS.** From Ana to Diego there are two paths: `Ana → Beto → Carla → Diego` (3 hops) and `Ana → Elena → Diego` (2 hops). A DFS that starts with Beto finds the 3-hop path first, returns it, and never learns a better one existed.

BFS explores in layers: **it exhausts everything one hop away before looking at anything two hops away**. That is why the first path it finds is necessarily the shortest. It is a guarantee of the algorithm, not luck.

**The `queue.size()` detail.** Capturing the queue size at the top of each round is what lets you know where one level ends and the next begins. Without it you can tell *whether* a path exists, but not how many hops it takes.

**And the `cameFrom` map.** BFS tells you that you arrived, but not by which route. By recording each person's parent as you discover them, you reconstruct the path afterwards by walking backwards from the destination. It is the same trick a GPS uses to draw your route.

</details>

---

## Key takeaways

- A **graph** is the most general structure: a tree is a connected, acyclic graph with a chosen root.
- **Adjacency list** for sparse graphs (nearly all real ones); matrix only when it is dense.
- In Java the adjacency list is a `Map<V, List<V>>`, and `computeIfAbsent` does the heavy lifting.
- Without a **visited** `Set`, any cycle turns the traversal into an infinite loop.
- BFS and DFS are the same algorithm: **the only difference is a queue versus a stack**.
- Mark vertices visited **on enqueue**, never on dequeue.
- **BFS gives the fewest-edges path**; when edges have weight, you need Dijkstra.
- Dijkstra always visits the cheapest pending vertex and **relaxes** its edges. It is invalid with negative weights.
</content>
