---
course: 'java'
slug: '12-tad-pilas-y-colas'
title: 'TAD Pila y TAD Cola: Estructuras Lineales'
description: 'Dominá las estructuras LIFO y FIFO, implementalas desde cero sobre nodos y sobre arreglos, entendé la cola circular y resolvé el clásico problema del balanceo de paréntesis.'
order: 13
lang: 'es'
published: true
---

# TAD Pila y TAD Cola: Estructuras Lineales

En la lección anterior construiste una lista que hace de todo: insertar donde sea, borrar donde sea, leer donde sea.

Ahora vamos a hacer lo contrario: **quitar poderes**. Una pila y una cola son listas a las que les prohibimos casi todo. Solo se puede tocar un extremo.

Y esa restricción, que suena a limitación, es exactamente lo que las hace valiosas por dos razones:

1. **Expresan intención.** Si un método recibe una `Pila`, ya sabés que el orden importa y que solo se toca la punta. Con una `Lista` genérica no sabés nada.
2. **Garantizan velocidad.** Como solo se opera en los extremos, todas las operaciones son **O(1)**. Siempre. Sin excepciones ni casos raros.

---

## 1. La Pila (LIFO): el último en entrar es el primero en salir

Pensá en una pila de platos: apilás arriba y sacás de arriba. Para llegar al de abajo tenés que sacar todos los de encima.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-pila-t">
<title id="d-pila-t">Estructura de una pila LIFO con las operaciones push y pop actuando sobre el tope</title>
<defs><marker id="ar-p" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-p2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">Pila (LIFO) — todo pasa por el mismo extremo: el tope</text>
<line x1="255" y1="52" x2="255" y2="256" stroke="var(--color-neutral-600)" stroke-width="3"/>
<line x1="465" y1="52" x2="465" y2="256" stroke="var(--color-neutral-600)" stroke-width="3"/>
<line x1="255" y1="256" x2="465" y2="256" stroke="var(--color-neutral-600)" stroke-width="3"/>
<rect x="263" y="196" width="194" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="360" y="228" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">A</text>
<text x="482" y="227" font-size="11" fill="var(--color-neutral-600)">el primero que entró</text>
<rect x="263" y="140" width="194" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="360" y="172" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">B</text>
<rect x="263" y="84" width="194" height="52" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="116" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<text x="482" y="107" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">TOPE — el único</text>
<text x="482" y="123" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">accesible</text>
<path d="M120 46 L200 46 L200 92 L257 92" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-p)"/>
<text x="0" y="50" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">push(D)</text>
<text x="0" y="68" font-size="11" fill="var(--color-neutral-700)">entra por arriba</text>
<path d="M463 76 L520 76 L520 46 L640 46" fill="none" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-p2)"/>
<text x="596" y="80" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">pop() → C</text>
<text x="596" y="98" font-size="11" fill="var(--color-neutral-700)">sale por arriba</text>
<text x="0" y="284" font-size="12" fill="var(--color-neutral-800)">Para llegar a A hay que sacar C y después B. No existe forma de acceder al medio de una pila.</text>
</svg>
<figcaption>Las tres operaciones —<code>push</code>, <code>pop</code> y <code>peek</code>— actúan sobre el mismo punto. Nada más está permitido.</figcaption>
</figure>

Las operaciones son solo cuatro:

| Operación | Qué hace |
| --- | --- |
| `push(dato)` | Apila un elemento nuevo en el tope. |
| `pop()` | Saca y devuelve el elemento del tope. |
| `peek()` | Mira el tope **sin sacarlo**. |
| `estaVacia()` | Dice si queda algo. |

### Implementación sobre nodos

Acá se ve por qué la lección anterior importaba: una pila es exactamente una lista enlazada donde **solo usás `agregarAlInicio` y `eliminarPrimero`**. Las dos operaciones O(1) de la lista enlazada.

```java
public class Pila<T> {
    private Nodo<T> tope;     // es la "cabeza" de la lección anterior, con otro nombre
    private int tamanio;

    public void push(T dato) {
        Nodo<T> nuevo = new Nodo<>(dato);
        nuevo.siguiente = tope;    // el mismo baile de referencias de siempre
        tope = nuevo;
        tamanio++;
    }

    public T pop() {
        if (estaVacia()) {
            throw new NoSuchElementException("La pila está vacía");
        }
        T dato = tope.dato;
        tope = tope.siguiente;     // el nodo viejo queda sin referencias: se lo lleva el GC
        tamanio--;
        return dato;
    }

    public T peek() {
        if (estaVacia()) {
            throw new NoSuchElementException("La pila está vacía");
        }
        return tope.dato;          // mira, no toca
    }

    public boolean estaVacia() { return tope == null; }
    public int tamanio() { return tamanio; }
}
```

Fijate que **no hay ningún bucle**. Ninguna operación recorre nada. Por eso todas son O(1).

> Lanzar una excepción al hacer `pop()` sobre una pila vacía es la decisión correcta: sacar de una pila vacía es un error de uso del programador, no una condición esperable. Es `RuntimeException`, tal cual lo discutimos en la lección 11.

---

## 2. La Cola (FIFO): el primero en entrar es el primero en salir

Una fila del banco. Se entra por atrás, se atiende por adelante, y nadie se cuela.

<figure class="diagram">
<svg viewBox="0 0 720 250" role="img" aria-labelledby="d-cola-t">
<title id="d-cola-t">Estructura de una cola FIFO con entrada por el fondo y salida por el frente</title>
<defs><marker id="ar-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-c2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">Cola (FIFO) — se entra por un extremo y se sale por el otro</text>
<line x1="160" y1="56" x2="560" y2="56" stroke="var(--color-neutral-600)" stroke-width="3"/>
<line x1="160" y1="140" x2="560" y2="140" stroke="var(--color-neutral-600)" stroke-width="3"/>
<rect x="170" y="66" width="118" height="64" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="229" y="104" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">A</text>
<rect x="298" y="66" width="118" height="64" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="357" y="104" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">B</text>
<rect x="426" y="66" width="118" height="64" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="485" y="104" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<text x="229" y="160" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">FRENTE</text>
<text x="229" y="176" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">el que sale</text>
<text x="485" y="160" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">FONDO</text>
<text x="485" y="176" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">el último que entró</text>
<line x1="156" y1="98" x2="76" y2="98" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-c2)"/>
<text x="0" y="94" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">dequeue()</text>
<text x="0" y="112" font-size="11" fill="var(--color-neutral-700)">devuelve A</text>
<line x1="644" y1="98" x2="566" y2="98" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-c)"/>
<text x="640" y="94" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">enqueue(D)</text>
<text x="640" y="112" font-size="11" fill="var(--color-neutral-700)">entra al fondo</text>
<text x="0" y="216" font-size="12" fill="var(--color-neutral-800)">A diferencia de la pila, la cola necesita DOS referencias: una al frente y otra al fondo. Con una sola, alguna</text>
<text x="0" y="234" font-size="12" fill="var(--color-neutral-800)">de las dos operaciones tendría que recorrer toda la estructura y dejaría de ser O(1).</text>
</svg>
<figcaption>La cola es justicia por orden de llegada. Su implementación necesita dos punteros; la pila se arregla con uno.</figcaption>
</figure>

```java
public class Cola<T> {
    private Nodo<T> frente;   // por acá se sale
    private Nodo<T> fondo;    // por acá se entra
    private int tamanio;

    public void enqueue(T dato) {
        Nodo<T> nuevo = new Nodo<>(dato);
        if (estaVacia()) {
            frente = nuevo;
            fondo = nuevo;        // con un solo elemento, ambos apuntan al mismo nodo
        } else {
            fondo.siguiente = nuevo;   // engancho al final
            fondo = nuevo;             // y muevo el fondo
        }
        tamanio++;
    }

    public T dequeue() {
        if (estaVacia()) {
            throw new NoSuchElementException("La cola está vacía");
        }
        T dato = frente.dato;
        frente = frente.siguiente;
        if (frente == null) {
            fondo = null;         // ← el caso que casi todos olvidan
        }
        tamanio--;
        return dato;
    }

    public T peek() {
        if (estaVacia()) throw new NoSuchElementException("La cola está vacía");
        return frente.dato;
    }

    public boolean estaVacia() { return frente == null; }
}
```

Ese `if (frente == null) fondo = null;` es **el error clásico** de esta estructura. Si sacás el último elemento y no limpiás `fondo`, queda apuntando a un nodo que ya no pertenece a la cola. El próximo `enqueue` lo engancha ahí y los datos aparecen en un lugar fantasma. Compila, corre, y da resultados incorrectos.

---

## 3. La cola circular: por qué existe el operador `%`

Si implementás la cola sobre un **arreglo** en lugar de nodos, aparece un problema que no es obvio.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-circ-t">
<title id="d-circ-t">Cola lineal sobre arreglo que desperdicia espacio frente a cola circular que lo reutiliza</title>
<text x="0" y="20" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">Cola lineal sobre arreglo — después de tres dequeue</text>
<rect x="0" y="32" width="114" height="52" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<rect x="120" y="32" width="114" height="52" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<rect x="240" y="32" width="114" height="52" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<rect x="360" y="32" width="114" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="417" y="64" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">C</text>
<rect x="480" y="32" width="114" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="537" y="64" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">D</text>
<rect x="600" y="32" width="114" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="657" y="64" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">E</text>
<text x="417" y="102" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">↑ frente = 3</text>
<text x="657" y="102" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">fondo llegó al final ↑</text>
<text x="0" y="128" font-size="11.5" fill="var(--color-neutral-800)">Quedan tres lugares libres, pero la cola se declara llena: el fondo ya no puede avanzar. Se desperdicia la mitad</text>
<text x="0" y="146" font-size="11.5" fill="var(--color-neutral-800)">del arreglo, y la única salida sería correr todos los elementos hacia la izquierda en cada dequeue. O(n).</text>
<text x="0" y="186" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Cola circular — el índice da la vuelta con el módulo</text>
<rect x="0" y="198" width="114" height="52" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="57" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">F</text>
<rect x="120" y="198" width="114" height="52" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="177" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">G</text>
<rect x="240" y="198" width="114" height="52" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<rect x="360" y="198" width="114" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="417" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">C</text>
<rect x="480" y="198" width="114" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="537" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">D</text>
<rect x="600" y="198" width="114" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="657" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">E</text>
<text x="417" y="268" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">↑ frente = 3</text>
<text x="177" y="268" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">↑ fondo = 1, dio la vuelta</text>
<text x="0" y="294" font-size="12" font-weight="700" fill="var(--color-accent-700)">fondo = (fondo + 1) % capacidad   →   al pasarse del final vuelve a 0 y reutiliza los huecos.</text>
</svg>
<figcaption>El operador módulo convierte un arreglo lineal en un anillo. Es el truco que hace que una cola sobre arreglo no desperdicie memoria.</figcaption>
</figure>

```java
public class ColaCircular<T> {
    private final Object[] datos;
    private int frente = 0;
    private int cantidad = 0;
    private final int capacidad;

    public ColaCircular(int capacidad) {
        this.capacidad = capacidad;
        this.datos = new Object[capacidad];
    }

    public void enqueue(T dato) {
        if (cantidad == capacidad) {
            throw new IllegalStateException("La cola está llena");
        }
        int fondo = (frente + cantidad) % capacidad;   // ← el módulo hace la magia
        datos[fondo] = dato;
        cantidad++;
    }

    @SuppressWarnings("unchecked")
    public T dequeue() {
        if (cantidad == 0) {
            throw new NoSuchElementException("La cola está vacía");
        }
        T dato = (T) datos[frente];
        datos[frente] = null;                     // liberamos la referencia para el GC
        frente = (frente + 1) % capacidad;        // ← y acá también
        cantidad--;
        return dato;
    }
}
```

Este patrón —un arreglo de tamaño fijo con dos índices que dan la vuelta— se llama **buffer circular**, y está en todos lados: en los drivers de audio, en los buffers de red, en los sistemas de logging. Cuando lo veas en el mundo real, vas a saber exactamente qué es.

---

## 4. Dónde se usan de verdad

**Pilas:**

- **La pila de llamadas de la JVM.** Cada llamada a un método apila un *stack frame*; cada `return` lo desapila. El `StackOverflowError` de una recursión infinita es literalmente esta pila desbordándose. Y el stack trace de la lección 11 es esa pila, impresa.
- **Deshacer (Ctrl+Z).** Cada acción se apila; deshacer es un `pop`.
- **El botón "atrás" del navegador.**
- **Evaluación de expresiones y verificación de sintaxis**, que es el ejercicio de esta lección.

**Colas:**

- **Cola de impresión**, cola de tareas, cola de mensajes.
- **Recorrido BFS de grafos y árboles**, que vas a ver en las lecciones 16 y 17.
- **Productor-consumidor** entre hilos: un hilo encola trabajo, otro lo desencola. Es la base de los `ExecutorService` de la lección 19.
- **Atención de pedidos** en cualquier sistema donde el orden de llegada sea la regla.

---

## 5. Cómo se hace en Java de verdad

No implementes esto en producción. Java ya lo trae, y bien hecho:

```java
import java.util.ArrayDeque;
import java.util.Deque;

// PILA
Deque<String> pila = new ArrayDeque<>();
pila.push("A");
pila.push("B");
System.out.println(pila.pop());    // B
System.out.println(pila.peek());   // A (sin sacarlo)

// COLA
Deque<String> cola = new ArrayDeque<>();
cola.offer("A");                   // enqueue
cola.offer("B");
System.out.println(cola.poll());   // A — dequeue
```

Un `Deque` ("double ended queue") permite operar en los dos extremos, así que sirve como pila y como cola. `ArrayDeque` es la implementación recomendada para ambos casos: usa por dentro exactamente un buffer circular como el que acabás de ver.

> **No uses la clase `Stack` de Java.** Es de 1996, hereda de `Vector`, está sincronizada innecesariamente en cada operación —lo que la hace lenta— y, lo peor, itera de abajo hacia arriba, al revés de como funciona una pila. La documentación oficial de Java recomienda `ArrayDeque` en su lugar.

También existen `offer`/`poll` como alternativas a `add`/`remove`: las primeras devuelven `null` o `false` cuando la operación no se puede hacer, las segundas lanzan excepción. Elegí según si el caso es esperable o es un error.

---

## 6. El clásico: ¿está balanceada la expresión?

Este problema es el "hola mundo" de las pilas, y aparece en entrevistas laborales con una frecuencia sospechosa. La idea es verificar que cada `(`, `[` y `{` tenga su cierre correspondiente, **en el orden correcto**.

<figure class="diagram">
<svg viewBox="0 0 720 320" role="img" aria-labelledby="d-bal-t">
<title id="d-bal-t">Traza paso a paso de la verificación de balanceo con una pila</title>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">Traza de { a + [ b * ( c ) ] }</text>
<rect x="0" y="30" width="130" height="34" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="65" y="52" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">carácter</text>
<rect x="136" y="30" width="300" height="34" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="286" y="52" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">acción</text>
<rect x="442" y="30" width="278" height="34" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="581" y="52" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">pila (el tope, a la derecha)</text>
<text x="65" y="90" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">{</text>
<text x="152" y="90" font-size="11.5" fill="var(--color-neutral-800)">es apertura → push</text>
<text x="458" y="90" font-size="12" font-weight="700" fill="var(--color-accent-700)">{</text>
<line x1="0" y1="100" x2="720" y2="100" stroke="var(--color-divider)"/>
<text x="65" y="124" font-size="13" text-anchor="middle" fill="var(--color-neutral-600)">a  +</text>
<text x="152" y="124" font-size="11.5" fill="var(--color-neutral-600)">no es paréntesis → se ignora</text>
<text x="458" y="124" font-size="12" font-weight="700" fill="var(--color-accent-700)">{</text>
<line x1="0" y1="134" x2="720" y2="134" stroke="var(--color-divider)"/>
<text x="65" y="158" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">[</text>
<text x="152" y="158" font-size="11.5" fill="var(--color-neutral-800)">es apertura → push</text>
<text x="458" y="158" font-size="12" font-weight="700" fill="var(--color-accent-700)">{  [</text>
<line x1="0" y1="168" x2="720" y2="168" stroke="var(--color-divider)"/>
<text x="65" y="192" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">(</text>
<text x="152" y="192" font-size="11.5" fill="var(--color-neutral-800)">es apertura → push</text>
<text x="458" y="192" font-size="12" font-weight="700" fill="var(--color-accent-700)">{  [  (</text>
<line x1="0" y1="202" x2="720" y2="202" stroke="var(--color-divider)"/>
<text x="65" y="226" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">)</text>
<text x="152" y="226" font-size="11.5" fill="var(--color-neutral-800)">es cierre → pop da ( ✓ coincide</text>
<text x="458" y="226" font-size="12" font-weight="700" fill="var(--color-accent-700)">{  [</text>
<line x1="0" y1="236" x2="720" y2="236" stroke="var(--color-divider)"/>
<text x="65" y="260" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">]</text>
<text x="152" y="260" font-size="11.5" fill="var(--color-neutral-800)">es cierre → pop da [ ✓ coincide</text>
<text x="458" y="260" font-size="12" font-weight="700" fill="var(--color-accent-700)">{</text>
<line x1="0" y1="270" x2="720" y2="270" stroke="var(--color-divider)"/>
<text x="65" y="294" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">}</text>
<text x="152" y="294" font-size="11.5" fill="var(--color-neutral-800)">es cierre → pop da { ✓ coincide</text>
<text x="458" y="294" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">(vacía) → BALANCEADO ✓</text>
<text x="0" y="316" font-size="11.5" fill="var(--color-neutral-700)">Si al terminar la pila no está vacía, quedó una apertura sin cerrar. Si un pop no coincide, se cerró en desorden.</text>
</svg>
<figcaption>La pila recuerda exactamente qué falta cerrar y en qué orden. Ninguna otra estructura da esa respuesta tan directo.</figcaption>
</figure>

La clave conceptual: **el último símbolo que abriste es el primero que tenés que cerrar**. Esa frase es, palabra por palabra, la definición de LIFO. Por eso el problema y la estructura encajan perfecto.

---

## 7. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| No poner `fondo = null` al vaciar la cola | `fondo` queda apuntando a un nodo huérfano; el próximo `enqueue` escribe en el vacío. | En `dequeue`, si `frente` quedó en `null`, limpiar también `fondo`. |
| `pop()` o `peek()` sin chequear si está vacía | `NullPointerException` en vez de un mensaje que se entienda. | Validar y lanzar `NoSuchElementException` con un texto claro. |
| Confundir `pop()` con `peek()` | Se consume un elemento que solo se quería mirar, y el bug aparece mucho después. | `peek` mira, `pop` saca. |
| Cola sobre arreglo sin módulo | Se llena "falsamente" con medio arreglo libre. | `(indice + 1) % capacidad`. |
| Usar `java.util.Stack` | Sincronización innecesaria e iteración al revés de como funciona una pila. | `ArrayDeque` como `Deque`. |
| Olvidar `datos[frente] = null` en la cola circular | El arreglo retiene referencias a objetos ya desencolados y el GC no puede liberarlos. | Limpiar la celda al desencolar. |
| Usar una pila donde el orden de llegada importa | Se atiende primero al último que llegó. | Si el orden de llegada manda, es una cola. |

---

## 8. Ejercicio práctico guiado

### Desafío: `esBalanceado(String expresion)`

Escribí un método que devuelva `true` si todos los símbolos de apertura `(`, `[`, `{` tienen su cierre correspondiente en el orden correcto.

Casos que tiene que resolver bien:

| Entrada | Resultado | Por qué |
| --- | --- | --- |
| `{ a + [ b * ( c ) ] }` | `true` | Todo cierra en orden |
| `( ( a )` | `false` | Queda un `(` sin cerrar |
| `( a ] )` | `false` | Cierra con el símbolo equivocado |
| `) a (` | `false` | Cierra algo que nunca se abrió |
| `""` (vacío) | `true` | No hay nada desbalanceado |

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;

public class VerificadorDeBalanceo {

    // Cada cierre apunta a su apertura correspondiente
    private static final Map<Character, Character> PARES = Map.of(
        ')', '(',
        ']', '[',
        '}', '{'
    );

    public static boolean esBalanceado(String expresion) {
        if (expresion == null) {
            return false;
        }

        Deque<Character> pila = new ArrayDeque<>();

        for (char c : expresion.toCharArray()) {

            if (PARES.containsValue(c)) {
                // Es una apertura: la anotamos y seguimos
                pila.push(c);

            } else if (PARES.containsKey(c)) {
                // Es un cierre. Dos formas de fallar acá:

                // 1) No hay nada abierto: se cierra algo que nunca se abrió
                if (pila.isEmpty()) {
                    return false;
                }

                // 2) Lo último que se abrió no es del mismo tipo
                if (pila.pop() != PARES.get(c)) {
                    return false;
                }
            }
            // Cualquier otro carácter no participa: se ignora
        }

        // Tercera forma de fallar: quedaron aperturas sin cerrar.
        // Si la pila está vacía, todo cerró correctamente.
        return pila.isEmpty();
    }

    public static void main(String[] args) {
        String[] casos = {
            "{ a + [ b * ( c ) ] }",   // true
            "( ( a )",                 // false: falta un cierre
            "( a ] )",                 // false: cierre cruzado
            ") a (",                   // false: cierra sin abrir
            "",                        // true: nada que desbalancear
            "sin simbolos"             // true
        };

        for (String caso : casos) {
            System.out.printf("%-24s → %s%n", "\"" + caso + "\"", esBalanceado(caso));
        }
    }
}
```

**Lo importante de este ejercicio son las tres formas de fallar**, y cada una se detecta en un momento distinto:

1. **Durante el recorrido, con la pila vacía**: apareció un cierre sin apertura previa. Caso `) a (`.
2. **Durante el recorrido, con `pop()` que no coincide**: se cerró en el orden equivocado. Caso `( a ] )`.
3. **Al terminar, con la pila no vacía**: quedaron aperturas colgadas. Caso `( ( a )`.

Si tu solución solo contempla la tercera, el caso `) a (` va a devolver `true` y no vas a entender por qué. Ese es exactamente el punto del ejercicio.

Fijate además que la pila **nunca guarda más de lo necesario**: cada apertura resuelta se saca inmediatamente. En una expresión de mil caracteres bien balanceada, la pila nunca supera el nivel de anidamiento real.

</details>

---

## Para llevarte

- Pila y cola son listas **con poderes restringidos**, y esa restricción es la característica, no la carencia.
- Como solo se toca un extremo, **todas las operaciones son O(1)**. Sin bucles, sin recorridos.
- La **pila** necesita un solo puntero (`tope`); la **cola** necesita dos (`frente` y `fondo`).
- Al desencolar el último elemento hay que limpiar `fondo` también. Es el bug más común de la cola.
- El operador `%` convierte un arreglo en un anillo: eso es una **cola circular**, y está en drivers, buffers de red y sistemas de logging.
- `pop`/`dequeue` sobre una estructura vacía es un error de uso: lanzá `NoSuchElementException`.
- En Java real usá **`ArrayDeque`** como `Deque`, nunca la vieja clase `Stack`.
- "Lo último que abrí es lo primero que tengo que cerrar" es LIFO expresado en palabras. Por eso la pila resuelve el balanceo.
</content>
