---
course: 'java'
slug: '15-tad-arboles-binarios-y-busqueda'
title: 'TAD Árbol: Recorridos y Árbol Binario de Búsqueda'
description: 'Pasá de las estructuras lineales a las jerárquicas: vocabulario de árboles, los tres recorridos en profundidad, el recorrido por niveles con una cola, el ABB y por qué se degenera.'
order: 17
lang: 'es'
published: true
---

# TAD Árbol: Recorridos y Árbol Binario de Búsqueda

Todo lo que viste hasta acá era **lineal**: cada elemento tiene un anterior y un siguiente, y buscar algo implica, en el peor caso, recorrer todo.

Un **árbol** rompe esa linealidad. Cada nodo puede tener varios hijos, y eso habilita algo muy poderoso: **descartar la mitad de los datos en cada paso**. Buscar entre un millón de elementos deja de costar un millón de comparaciones y pasa a costar veinte.

Y además, muchísimas cosas del mundo real *son* árboles: el sistema de archivos, el DOM de una página, el organigrama de una empresa, la jerarquía de clases de Java, las decisiones de un juego.

---

## 1. Vocabulario

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-arb-t">
<title id="d-arb-t">Anatomía de un árbol binario con raíz, nodos internos, hojas y niveles</title>
<text x="0" y="46" font-size="11" font-weight="700" fill="var(--color-neutral-600)">nivel 0</text>
<text x="0" y="126" font-size="11" font-weight="700" fill="var(--color-neutral-600)">nivel 1</text>
<text x="0" y="206" font-size="11" font-weight="700" fill="var(--color-neutral-600)">nivel 2</text>
<line x1="360" y1="62" x2="200" y2="98" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="360" y1="62" x2="520" y2="98" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="200" y1="142" x2="120" y2="178" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="200" y1="142" x2="280" y2="178" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="520" y1="142" x2="440" y2="178" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="520" y1="142" x2="600" y2="178" stroke="var(--color-neutral-600)" stroke-width="2"/>
<circle cx="360" cy="40" r="22" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="360" y="46" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">50</text>
<text x="392" y="30" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">RAÍZ — el único nodo sin padre</text>
<circle cx="200" cy="120" r="22" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="200" y="126" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">30</text>
<circle cx="520" cy="120" r="22" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="520" y="126" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">70</text>
<text x="232" y="112" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">nodos internos</text>
<text x="232" y="128" font-size="11" fill="var(--color-neutral-700)">tienen padre y al menos un hijo</text>
<circle cx="120" cy="200" r="22" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="120" y="206" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<circle cx="280" cy="200" r="22" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="280" y="206" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">40</text>
<circle cx="440" cy="200" r="22" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="440" y="206" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">60</text>
<circle cx="600" cy="200" r="22" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="600" y="206" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">80</text>
<line x1="98" y1="232" x2="622" y2="232" stroke="var(--color-neutral-500)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="360" y="250" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">HOJAS — no tienen hijos</text>
<text x="0" y="278" font-size="12" fill="var(--color-neutral-800)">ALTURA del árbol = 2 (la cantidad de aristas del camino más largo desde la raíz hasta una hoja).</text>
<text x="0" y="296" font-size="12" fill="var(--color-neutral-800)">SUBÁRBOL = cualquier nodo junto con todos sus descendientes. El nodo 30 con el 20 y el 40 es un subárbol.</text>
</svg>
<figcaption>Un árbol binario limita a dos los hijos de cada nodo: izquierdo y derecho. Esa restricción es la que permite las búsquedas rápidas.</figcaption>
</figure>

La clase que lo modela es la hermana de la `Nodo` de la lección 12, con una referencia más:

```java
public class NodoArbol {
    int valor;
    NodoArbol izquierdo;
    NodoArbol derecho;

    public NodoArbol(int valor) {
        this.valor = valor;
    }
}

public class ArbolBinario {
    private NodoArbol raiz;   // igual que 'cabeza', pero acá se llama raíz
}
```

Y como cada nodo tiene dos hijos que a su vez son árboles completos, **todo en los árboles se resuelve con recursión**. Es la estructura de datos donde la recursión deja de ser un ejercicio académico y se vuelve la herramienta natural.

---

## 2. Los tres recorridos en profundidad

Recorrer una lista tiene un solo orden posible. Un árbol tiene varios, y cada uno sirve para algo distinto.

Los tres se diferencian **únicamente en dónde se procesa la raíz** respecto de sus subárboles:

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-rec-t">
<title id="d-rec-t">Los tres recorridos en profundidad sobre el mismo árbol y sus resultados</title>
<line x1="360" y1="52" x2="280" y2="70" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="360" y1="52" x2="440" y2="70" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="280" y1="102" x2="240" y2="120" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="280" y1="102" x2="320" y2="120" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="440" y1="102" x2="400" y2="120" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="440" y1="102" x2="480" y2="120" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<circle cx="360" cy="34" r="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="39" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">50</text>
<circle cx="280" cy="86" r="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="280" y="91" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">30</text>
<circle cx="440" cy="86" r="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="440" y="91" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">70</text>
<circle cx="240" cy="138" r="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="240" y="143" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<circle cx="320" cy="138" r="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="320" y="143" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">40</text>
<circle cx="400" cy="138" r="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="400" y="143" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">60</text>
<circle cx="480" cy="138" r="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="480" y="143" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">80</text>
<rect x="0" y="176" width="720" height="46" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="16" y="196" font-size="12" font-weight="700" fill="var(--color-text)">Pre-orden</text>
<text x="16" y="213" font-size="10.5" fill="var(--color-neutral-700)">Raíz · Izq · Der</text>
<text x="150" y="205" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">50  30  20  40  70  60  80</text>
<text x="420" y="205" font-size="11" fill="var(--color-neutral-800)">sirve para copiar o serializar el árbol</text>
<rect x="0" y="230" width="720" height="46" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="16" y="250" font-size="12" font-weight="700" fill="var(--color-accent-700)">In-orden</text>
<text x="16" y="267" font-size="10.5" fill="var(--color-neutral-800)">Izq · Raíz · Der</text>
<text x="150" y="259" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">20  30  40  50  60  70  80</text>
<text x="420" y="259" font-size="11" font-weight="700" fill="var(--color-accent-700)">en un ABB sale ORDENADO de menor a mayor</text>
<rect x="0" y="284" width="720" height="46" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="16" y="304" font-size="12" font-weight="700" fill="var(--color-text)">Post-orden</text>
<text x="16" y="321" font-size="10.5" fill="var(--color-neutral-700)">Izq · Der · Raíz</text>
<text x="150" y="313" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">20  40  30  60  80  70  50</text>
<text x="420" y="313" font-size="11" fill="var(--color-neutral-800)">sirve para liberar o borrar: los hijos primero</text>
</svg>
<figcaption>El nombre indica cuándo se visita la raíz: <em>pre</em> antes, <em>in</em> en el medio, <em>post</em> después. Los subárboles siempre van izquierdo y luego derecho.</figcaption>
</figure>

El código es casi idéntico en los tres casos. **Lo único que se mueve es una línea:**

```java
public void preOrden(NodoArbol nodo) {
    if (nodo == null) return;               // caso base: siempre primero
    System.out.print(nodo.valor + " ");     // ← la raíz, ANTES
    preOrden(nodo.izquierdo);
    preOrden(nodo.derecho);
}

public void inOrden(NodoArbol nodo) {
    if (nodo == null) return;
    inOrden(nodo.izquierdo);
    System.out.print(nodo.valor + " ");     // ← la raíz, EN EL MEDIO
    inOrden(nodo.derecho);
}

public void postOrden(NodoArbol nodo) {
    if (nodo == null) return;
    postOrden(nodo.izquierdo);
    postOrden(nodo.derecho);
    System.out.print(nodo.valor + " ");     // ← la raíz, DESPUÉS
}
```

El `if (nodo == null) return;` es el **caso base**, y no es un detalle: sin él la recursión no termina nunca y obtenés un `StackOverflowError`. Que, como viste en la lección 13, es literalmente la pila de llamadas de la JVM desbordándose.

> **In-orden sobre un ABB devuelve los datos ordenados.** Esa propiedad, que parece un truco de magia, es la razón por la que un `TreeMap` puede recorrerse en orden de clave sin ordenar nada: el orden ya está en la forma del árbol.

---

## 3. Recorrido por niveles (BFS), con una cola

Los tres recorridos anteriores bajan hasta el fondo antes de moverse al lado. A veces querés lo contrario: **visitar el árbol nivel por nivel**.

La recursión no sirve acá. Lo que sirve es una **cola**, exactamente la de la lección 13:

```java
public void porNiveles() {
    if (raiz == null) return;

    Queue<NodoArbol> cola = new ArrayDeque<>();
    cola.offer(raiz);

    while (!cola.isEmpty()) {
        NodoArbol actual = cola.poll();
        System.out.print(actual.valor + " ");

        if (actual.izquierdo != null) cola.offer(actual.izquierdo);
        if (actual.derecho  != null) cola.offer(actual.derecho);
    }
}
// Salida: 50 30 70 20 40 60 80
```

Fijate el mecanismo: **encolo los hijos y los proceso recién cuando terminé con todos los del nivel actual**. Ese "primero en entrar, primero en salir" de la cola es exactamente lo que produce el orden por niveles.

Si cambiás la cola por una **pila**, obtenés un recorrido en profundidad sin recursión. Cambiar la estructura cambia el algoritmo, sin tocar el resto del código. Es la misma idea que vas a usar en grafos, en la lección siguiente.

---

## 4. El Árbol Binario de Búsqueda

Hasta acá los árboles solo guardaban datos. Un **ABB** agrega una regla que lo cambia todo:

> Para **todo** nodo: cada valor del subárbol **izquierdo** es menor, y cada valor del subárbol **derecho** es mayor.

Con esa regla, buscar deja de recorrer y pasa a **decidir**:

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-abb-t">
<title id="d-abb-t">Camino de comparaciones al buscar el valor 40 en un árbol binario de búsqueda</title>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">buscar(40) — cada comparación descarta medio árbol</text>
<line x1="360" y1="58" x2="200" y2="98" stroke="var(--color-accent)" stroke-width="3"/>
<line x1="360" y1="58" x2="520" y2="98" stroke="var(--color-neutral-400)" stroke-width="1.5"/>
<line x1="200" y1="142" x2="120" y2="178" stroke="var(--color-neutral-400)" stroke-width="1.5"/>
<line x1="200" y1="142" x2="280" y2="178" stroke="var(--color-accent)" stroke-width="3"/>
<line x1="520" y1="142" x2="440" y2="178" stroke="var(--color-neutral-400)" stroke-width="1.5"/>
<line x1="520" y1="142" x2="600" y2="178" stroke="var(--color-neutral-400)" stroke-width="1.5"/>
<circle cx="360" cy="36" r="22" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="360" y="42" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">50</text>
<text x="392" y="34" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">40 &lt; 50 → voy a la izquierda</text>
<text x="392" y="50" font-size="11" fill="var(--color-neutral-700)">descarto 70, 60 y 80 de una</text>
<circle cx="200" cy="120" r="22" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="200" y="126" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">30</text>
<text x="232" y="118" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">40 &gt; 30 → voy a la derecha</text>
<text x="232" y="134" font-size="11" fill="var(--color-neutral-700)">descarto el 20</text>
<circle cx="520" cy="120" r="22" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="520" y="126" font-size="13" text-anchor="middle" fill="var(--color-neutral-500)">70</text>
<circle cx="120" cy="200" r="22" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="120" y="206" font-size="13" text-anchor="middle" fill="var(--color-neutral-500)">20</text>
<circle cx="280" cy="200" r="22" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="3"/>
<text x="280" y="206" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">40</text>
<text x="312" y="205" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">encontrado ✓</text>
<circle cx="440" cy="200" r="22" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="440" y="206" font-size="13" text-anchor="middle" fill="var(--color-neutral-500)">60</text>
<circle cx="600" cy="200" r="22" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="600" y="206" font-size="13" text-anchor="middle" fill="var(--color-neutral-500)">80</text>
<text x="0" y="256" font-size="12" fill="var(--color-neutral-800)">Tres comparaciones sobre siete nodos. Los nodos grises nunca se miraron: la propiedad del ABB garantiza</text>
<text x="0" y="274" font-size="12" fill="var(--color-neutral-800)">que el 40 no puede estar ahí, así que no hace falta comprobarlo.</text>
<text x="0" y="294" font-size="12" font-weight="700" fill="var(--color-accent-700)">Con un millón de nodos bien balanceados, esto son 20 comparaciones. En una lista serían un millón.</text>
</svg>
<figcaption>Cada nivel que bajás descarta la mitad de lo que queda. Eso es exactamente lo que significa O(log n).</figcaption>
</figure>

```java
public boolean buscar(int valor) {
    return buscar(raiz, valor);
}

private boolean buscar(NodoArbol nodo, int valor) {
    if (nodo == null) return false;               // llegué al vacío: no está
    if (valor == nodo.valor) return true;         // lo encontré
    return valor < nodo.valor
        ? buscar(nodo.izquierdo, valor)           // más chico: a la izquierda
        : buscar(nodo.derecho, valor);            // más grande: a la derecha
}
```

La inserción usa exactamente la misma lógica: baja hasta encontrar un lugar vacío y ahí cuelga el nodo nuevo.

```java
public void insertar(int valor) {
    raiz = insertar(raiz, valor);
}

private NodoArbol insertar(NodoArbol nodo, int valor) {
    if (nodo == null) return new NodoArbol(valor);   // acá va

    if (valor < nodo.valor) {
        nodo.izquierdo = insertar(nodo.izquierdo, valor);
    } else if (valor > nodo.valor) {
        nodo.derecho = insertar(nodo.derecho, valor);
    }
    // si es igual, no hacemos nada: un ABB no admite duplicados
    return nodo;
}
```

El patrón `nodo.izquierdo = insertar(nodo.izquierdo, valor)` —reasignar el resultado de la recursión— es la forma idiomática de modificar árboles en Java. Evita tener que llevar una referencia al padre.

---

## 5. El talón de Aquiles: el desbalanceo

Todo lo anterior asume que el árbol tiene forma de árbol. Pero eso **no está garantizado**:

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-bal-t">
<title id="d-bal-t">Árbol binario de búsqueda balanceado frente a uno degenerado en cadena</title>
<text x="0" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">Inserto 40, 20, 60, 10, 30, 50, 70</text>
<line x1="172" y1="56" x2="100" y2="94" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<line x1="172" y1="56" x2="245" y2="94" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<line x1="100" y1="134" x2="60" y2="170" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<line x1="100" y1="134" x2="140" y2="170" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<line x1="245" y1="134" x2="205" y2="170" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<line x1="245" y1="134" x2="285" y2="170" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<circle cx="172" cy="38" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="172" y="43" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">40</text>
<circle cx="100" cy="112" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="100" y="117" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">20</text>
<circle cx="245" cy="112" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="245" y="117" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">60</text>
<circle cx="60" cy="188" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="60" y="193" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">10</text>
<circle cx="140" cy="188" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="140" y="193" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">30</text>
<circle cx="205" cy="188" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="205" y="193" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">50</text>
<circle cx="285" cy="188" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="285" y="193" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">70</text>
<text x="0" y="240" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">BALANCEADO — altura 2</text>
<text x="0" y="258" font-size="11.5" fill="var(--color-neutral-800)">Peor búsqueda: 3 comparaciones.</text>
<text x="0" y="276" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">O(log n)</text>
<line x1="345" y1="10" x2="345" y2="290" stroke="var(--color-divider)" stroke-width="1.5"/>
<text x="375" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Inserto 10, 20, 30, 40, 50, 60, 70 (ya ordenados)</text>
<line x1="410" y1="44" x2="440" y2="66" stroke="var(--color-accent)" stroke-width="1.8"/>
<line x1="450" y1="82" x2="480" y2="104" stroke="var(--color-accent)" stroke-width="1.8"/>
<line x1="490" y1="120" x2="520" y2="142" stroke="var(--color-accent)" stroke-width="1.8"/>
<line x1="530" y1="158" x2="560" y2="180" stroke="var(--color-accent)" stroke-width="1.8"/>
<line x1="570" y1="196" x2="600" y2="218" stroke="var(--color-accent)" stroke-width="1.8"/>
<circle cx="396" cy="34" r="17" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="396" y="39" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">10</text>
<circle cx="450" cy="76" r="17" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="450" y="81" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">20</text>
<circle cx="504" cy="118" r="17" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="504" y="123" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">30</text>
<circle cx="558" cy="160" r="17" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="558" y="165" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">40</text>
<circle cx="612" cy="202" r="17" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="612" y="207" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">50</text>
<text x="650" y="228" font-size="11.5" fill="var(--color-neutral-700)">...</text>
<text x="375" y="252" font-size="12" font-weight="700" fill="var(--color-accent-700)">DEGENERADO — altura 6</text>
<text x="375" y="270" font-size="11.5" fill="var(--color-neutral-800)">Es una lista enlazada con nodos de árbol.</text>
<text x="375" y="288" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">O(n) — perdiste toda la ventaja</text>
<text x="0" y="322" font-size="12" fill="var(--color-neutral-800)">Insertar datos ya ordenados degenera el ABB. Por eso existen los árboles AVL y rojo-negro, que se reequilibran</text>
<text x="0" y="338" font-size="12" fill="var(--color-neutral-800)">solos en cada inserción. TreeMap y TreeSet de Java son árboles rojo-negro: nunca degeneran.</text>
</svg>
<figcaption>El mismo conjunto de datos, dos formas distintas. La diferencia entre 3 comparaciones y 7 la decide el orden de inserción, no el algoritmo.</figcaption>
</figure>

Este es el motivo por el que **no vas a implementar un ABB en producción**. `TreeMap` y `TreeSet` son árboles rojo-negro: se reacomodan solos con rotaciones en cada inserción y garantizan O(log n) sin importar en qué orden llegan los datos.

Lo que sí te llevás es entender **por qué** son O(log n) y qué pasaría si no se balancearan.

---

## 6. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| Olvidar el caso base `if (nodo == null) return;` | Recursión infinita → `StackOverflowError`. | El caso base es siempre la primera línea del método recursivo. |
| Escribir `insertar(nodo.izquierdo, v)` sin reasignar | El nodo nuevo se crea y se pierde: el árbol no cambia y no hay ningún error. | `nodo.izquierdo = insertar(nodo.izquierdo, v);`. |
| Insertar datos ya ordenados en un ABB propio | El árbol degenera en una lista y toda búsqueda pasa a O(n). | Mezclar los datos, o usar `TreeMap`/`TreeSet`. |
| Usar recursión para el recorrido por niveles | No funciona: BFS necesita memoria de tipo cola, no de tipo pila. | `ArrayDeque` como cola, con el bucle `while (!cola.isEmpty())`. |
| Confundir altura con cantidad de nodos | Los cálculos de complejidad salen mal. | Altura = aristas del camino más largo. Un árbol de un solo nodo tiene altura 0. |
| Insertar duplicados sin definir qué hacer | El árbol crece con datos repetidos o los pierde en silencio. | Decidir explícitamente: ignorar, contar repeticiones, o mandarlos siempre a la derecha. |
| Recursión muy profunda sobre un árbol degenerado | `StackOverflowError` con datos que "deberían" entrar. | Balancear, o convertir el recorrido a iterativo con una pila explícita. |

---

## 7. Ejercicio práctico guiado

### Desafío: completar el ABB

Implementá sobre `ArbolBinarioBusqueda`:

1. `insertar(int valor)`, sin duplicados.
2. `buscar(int valor)` que devuelva `boolean`.
3. `altura()` del árbol.
4. `contarNodos()` y `contarHojas()`.
5. `esABBValido()` que verifique que la propiedad se cumple en **todo** el árbol.
6. Los tres recorridos en profundidad y el recorrido por niveles.

El punto 5 es más difícil de lo que parece. Pensalo antes de mirar la solución.

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class ArbolBinarioBusqueda {

    private static class NodoArbol {
        int valor;
        NodoArbol izquierdo, derecho;
        NodoArbol(int valor) { this.valor = valor; }
    }

    private NodoArbol raiz;

    // ── 1. Inserción ────────────────────────────────────────────
    public void insertar(int valor) {
        raiz = insertar(raiz, valor);
    }

    private NodoArbol insertar(NodoArbol nodo, int valor) {
        if (nodo == null) return new NodoArbol(valor);
        if (valor < nodo.valor)      nodo.izquierdo = insertar(nodo.izquierdo, valor);
        else if (valor > nodo.valor) nodo.derecho   = insertar(nodo.derecho, valor);
        // igual → se ignora, no admitimos duplicados
        return nodo;   // devolver el nodo es lo que hace funcionar la reasignación
    }

    // ── 2. Búsqueda ─────────────────────────────────────────────
    public boolean buscar(int valor) {
        return buscar(raiz, valor);
    }

    private boolean buscar(NodoArbol nodo, int valor) {
        if (nodo == null) return false;
        if (valor == nodo.valor) return true;
        return valor < nodo.valor ? buscar(nodo.izquierdo, valor)
                                  : buscar(nodo.derecho, valor);
    }

    // ── 3. Altura ───────────────────────────────────────────────
    public int altura() {
        return altura(raiz);
    }

    private int altura(NodoArbol nodo) {
        if (nodo == null) return -1;   // -1 para que una hoja dé altura 0
        return 1 + Math.max(altura(nodo.izquierdo), altura(nodo.derecho));
    }

    // ── 4. Conteos ──────────────────────────────────────────────
    public int contarNodos() { return contarNodos(raiz); }

    private int contarNodos(NodoArbol nodo) {
        if (nodo == null) return 0;
        return 1 + contarNodos(nodo.izquierdo) + contarNodos(nodo.derecho);
    }

    public int contarHojas() { return contarHojas(raiz); }

    private int contarHojas(NodoArbol nodo) {
        if (nodo == null) return 0;
        if (nodo.izquierdo == null && nodo.derecho == null) return 1;
        return contarHojas(nodo.izquierdo) + contarHojas(nodo.derecho);
    }

    // ── 5. Validación del ABB ───────────────────────────────────
    public boolean esABBValido() {
        return esValido(raiz, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    // La clave: cada nodo hereda un RANGO permitido, no solo la comparación
    // con su padre inmediato. Al bajar a la izquierda, el máximo permitido
    // pasa a ser el valor del padre; al bajar a la derecha, el mínimo.
    private boolean esValido(NodoArbol nodo, long min, long max) {
        if (nodo == null) return true;
        if (nodo.valor <= min || nodo.valor >= max) return false;
        return esValido(nodo.izquierdo, min, nodo.valor)
            && esValido(nodo.derecho,   nodo.valor, max);
    }

    // ── 6. Recorridos ───────────────────────────────────────────
    public void preOrden()  { preOrden(raiz);  System.out.println(); }
    public void inOrden()   { inOrden(raiz);   System.out.println(); }
    public void postOrden() { postOrden(raiz); System.out.println(); }

    private void preOrden(NodoArbol n) {
        if (n == null) return;
        System.out.print(n.valor + " ");
        preOrden(n.izquierdo);
        preOrden(n.derecho);
    }

    private void inOrden(NodoArbol n) {
        if (n == null) return;
        inOrden(n.izquierdo);
        System.out.print(n.valor + " ");
        inOrden(n.derecho);
    }

    private void postOrden(NodoArbol n) {
        if (n == null) return;
        postOrden(n.izquierdo);
        postOrden(n.derecho);
        System.out.print(n.valor + " ");
    }

    public void porNiveles() {
        if (raiz == null) { System.out.println("(vacío)"); return; }
        Queue<NodoArbol> cola = new ArrayDeque<>();
        cola.offer(raiz);
        while (!cola.isEmpty()) {
            NodoArbol actual = cola.poll();
            System.out.print(actual.valor + " ");
            if (actual.izquierdo != null) cola.offer(actual.izquierdo);
            if (actual.derecho  != null) cola.offer(actual.derecho);
        }
        System.out.println();
    }

    public static void main(String[] args) {
        ArbolBinarioBusqueda arbol = new ArbolBinarioBusqueda();
        for (int v : new int[]{50, 30, 70, 20, 40, 60, 80}) {
            arbol.insertar(v);
        }

        System.out.print("Pre-orden : "); arbol.preOrden();    // 50 30 20 40 70 60 80
        System.out.print("In-orden  : "); arbol.inOrden();     // 20 30 40 50 60 70 80
        System.out.print("Post-orden: "); arbol.postOrden();   // 20 40 30 60 80 70 50
        System.out.print("Niveles   : "); arbol.porNiveles();  // 50 30 70 20 40 60 80

        System.out.println("\nAltura        : " + arbol.altura());        // 2
        System.out.println("Nodos         : " + arbol.contarNodos());     // 7
        System.out.println("Hojas         : " + arbol.contarHojas());     // 4
        System.out.println("buscar(40)    : " + arbol.buscar(40));        // true
        System.out.println("buscar(45)    : " + arbol.buscar(45));        // false
        System.out.println("esABBValido() : " + arbol.esABBValido());     // true

        // Demostración del desbalanceo
        ArbolBinarioBusqueda degenerado = new ArbolBinarioBusqueda();
        for (int v : new int[]{10, 20, 30, 40, 50, 60, 70}) {
            degenerado.insertar(v);
        }
        System.out.println("\nMismos 7 valores, insertados ordenados:");
        System.out.println("Altura: " + degenerado.altura() + "  ← era 2, ahora es 6");
    }
}
```

**El punto 5 es donde casi todo el mundo se equivoca.** La solución intuitiva es comparar cada nodo solo con su padre:

```java
// MAL: solo mira al padre inmediato
if (nodo.izquierdo != null && nodo.izquierdo.valor >= nodo.valor) return false;
```

Ese código da `true` para este árbol, que **no es un ABB válido**:

```
      50
     /  \
   30    70
  /  \
20    60      ← el 60 es mayor que 50 y está en el subárbol IZQUIERDO de 50
```

El 60 respeta a su padre (30), pero viola la regla respecto de la raíz. Por eso hay que arrastrar un **rango** `(min, max)` que se va estrechando al bajar: al ir a la izquierda de 50 el máximo permitido pasa a ser 50, y el 60 queda fuera de rango.

Usamos `long` para el rango porque un nodo puede valer legítimamente `Integer.MIN_VALUE`, y con `int` no habría forma de representar un límite inferior a ese.

</details>

---

## Para llevarte

- Un árbol rompe la linealidad y permite **descartar la mitad de los datos en cada paso**.
- Todo en árboles se resuelve con **recursión**, y todo método recursivo arranca con su caso base.
- Los tres recorridos DFS se diferencian en una sola línea: dónde se procesa la raíz.
- **In-orden sobre un ABB devuelve los datos ordenados.** Por eso `TreeMap` se recorre en orden sin ordenar nada.
- El recorrido por niveles (BFS) necesita una **cola**, no recursión.
- La propiedad del ABB —izquierda menor, derecha mayor, **en todo el árbol**— es lo que convierte una búsqueda en una decisión.
- Insertar datos ya ordenados **degenera** el ABB en una lista y lo lleva de O(log n) a O(n).
- En producción usá `TreeMap`/`TreeSet`: son árboles rojo-negro que se reequilibran solos.
</content>
