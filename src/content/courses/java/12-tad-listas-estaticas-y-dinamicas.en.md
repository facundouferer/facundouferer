---
course: 'java'
slug: '11-tad-listas-estaticas-y-dinamicas'
title: 'The List ADT: Static, Dynamic, and Linked'
description: 'Understand what an Abstract Data Type is, why an array and a linked list solve the same problem with opposite costs, and build singly linked, doubly linked, and circular lists from scratch.'
order: 12
lang: 'en'
published: true
---

# The List ADT: Static, Dynamic, and Linked

From here on the course changes subject. You already know how to model objects; now you will learn to **organize many objects** and — this is the important part — to pick the right organization for what you plan to do with them.

Let us start with a question that sounds silly: if `ArrayList` already exists, why implement a list by hand?

Because `ArrayList` is blazing fast at some things and terrible at others, and if you do not know **why**, you will choose badly. Implementing one once is what teaches you that difference for good.

---

## 1. What an ADT is

An **Abstract Data Type** is the separation of two things we tend to blur together:

- **The specification**: which operations it offers and what each one guarantees. The *what*.
- **The implementation**: how the data is laid out in memory and how each operation runs. The *how*.

<figure class="diagram">
<svg viewBox="0 0 720 310" role="img" aria-labelledby="d-adt-t">
<title id="d-adt-t">One List ADT solved by three different implementations</title>
<defs><marker id="ar-adt" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="110" y="6" width="500" height="104" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="32" font-size="14.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">List ADT — the specification (the WHAT)</text>
<text x="360" y="56" font-size="12" text-anchor="middle" fill="var(--color-text)">add(item) · remove(item) · get(index)</text>
<text x="360" y="76" font-size="12" text-anchor="middle" fill="var(--color-text)">size() · isEmpty() · contains(item)</text>
<text x="360" y="98" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">It says absolutely nothing about how the data is stored.</text>
<path d="M360 110 L360 140" fill="none" stroke="var(--color-accent)" stroke-width="1.8"/>
<line x1="112" y1="140" x2="608" y2="140" stroke="var(--color-accent)" stroke-width="1.8"/>
<path d="M112 140 L112 166" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-adt)"/>
<path d="M360 140 L360 166" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-adt)"/>
<path d="M608 140 L608 166" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-adt)"/>
<rect x="0" y="172" width="225" height="96" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="18" y="196" font-size="13" font-weight="700" fill="var(--color-text)">Fixed array</text>
<text x="18" y="218" font-size="11.5" fill="var(--color-neutral-700)">get(i) is instantaneous</text>
<text x="18" y="238" font-size="11.5" fill="var(--color-neutral-700)">but it can never grow</text>
<text x="18" y="258" font-size="11.5" fill="var(--color-neutral-700)">past its size</text>
<rect x="247" y="172" width="225" height="96" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="265" y="196" font-size="13" font-weight="700" fill="var(--color-accent-2-800)">ArrayList</text>
<text x="265" y="218" font-size="11.5" fill="var(--color-neutral-800)">an array recreated at a</text>
<text x="265" y="238" font-size="11.5" fill="var(--color-neutral-800)">bigger size when it fills</text>
<text x="265" y="258" font-size="11.5" fill="var(--color-neutral-800)">the general-purpose one</text>
<rect x="495" y="172" width="225" height="96" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="513" y="196" font-size="13" font-weight="700" fill="var(--color-text)">Linked list</text>
<text x="513" y="218" font-size="11.5" fill="var(--color-neutral-700)">loose nodes joined by</text>
<text x="513" y="238" font-size="11.5" fill="var(--color-neutral-700)">references; inserting at</text>
<text x="513" y="258" font-size="11.5" fill="var(--color-neutral-700)">the front is instant</text>
<text x="0" y="296" font-size="12" fill="var(--color-neutral-700)">Code using the list talks to the specification. Swapping the implementation does not force it to change one line.</text>
</svg>
<figcaption>The ADT is the contract; the three boxes below are different ways of honoring it, with wildly different costs.</figcaption>
</figure>

In Java the ADT is written as an **interface** — exactly what you saw in lesson 10:

```java
public interface List<T> {
    void add(T item);
    boolean remove(T item);
    T get(int index);
    int size();
    boolean isEmpty();
}
```

Whoever programs against `List<T>` neither knows nor cares whether there is an array or a chain of nodes inside. That ignorance is precisely the goal.

---

## 2. Two ways to store the same thing, with opposite costs

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-mem-t">
<title id="d-mem-t">The contiguous memory of an array versus the scattered nodes of a linked list</title>
<defs><marker id="ar-mem" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="0" y="22" font-size="13.5" font-weight="700" fill="var(--color-accent-2-700)">Static list — an array: contiguous memory, fixed size</text>
<rect x="0" y="34" width="112" height="50" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="56" y="65" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">10</text>
<rect x="116" y="34" width="112" height="50" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="172" y="65" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">20</text>
<rect x="232" y="34" width="112" height="50" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="288" y="65" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">30</text>
<rect x="348" y="34" width="112" height="50" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="404" y="65" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">40</text>
<rect x="464" y="34" width="112" height="50" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<text x="520" y="65" font-size="12" text-anchor="middle" fill="var(--color-neutral-600)">free</text>
<rect x="580" y="34" width="112" height="50" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<text x="636" y="65" font-size="12" text-anchor="middle" fill="var(--color-neutral-600)">free</text>
<text x="56" y="102" font-size="11" text-anchor="middle" fill="var(--color-neutral-600)">[0]</text>
<text x="172" y="102" font-size="11" text-anchor="middle" fill="var(--color-neutral-600)">[1]</text>
<text x="288" y="102" font-size="11" text-anchor="middle" fill="var(--color-neutral-600)">[2]</text>
<text x="404" y="102" font-size="11" text-anchor="middle" fill="var(--color-neutral-600)">[3]</text>
<text x="520" y="102" font-size="11" text-anchor="middle" fill="var(--color-neutral-600)">[4]</text>
<text x="636" y="102" font-size="11" text-anchor="middle" fill="var(--color-neutral-600)">[5]</text>
<text x="0" y="126" font-size="11.5" fill="var(--color-neutral-800)">Because the addresses are consecutive, the JVM computes where element 3 lives with simple arithmetic: get(i) is</text>
<text x="0" y="144" font-size="11.5" fill="var(--color-neutral-800)">instantaneous. But inserting at the front forces everything else to shift one slot to the right.</text>
<text x="0" y="188" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Linked list — nodes scattered across the Heap, joined by references</text>
<text x="0" y="228" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">head</text>
<line x1="40" y1="224" x2="86" y2="224" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-mem)"/>
<rect x="90" y="202" width="130" height="44" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<line x1="180" y1="202" x2="180" y2="246" stroke="var(--color-accent)"/>
<text x="135" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">10</text>
<circle cx="200" cy="224" r="4" fill="var(--color-accent-700)"/>
<path d="M200 224 C 240 224, 250 262, 286 262" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-mem)"/>
<rect x="290" y="240" width="130" height="44" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<line x1="380" y1="240" x2="380" y2="284" stroke="var(--color-accent)"/>
<text x="335" y="268" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">20</text>
<circle cx="400" cy="262" r="4" fill="var(--color-accent-700)"/>
<path d="M400 262 C 440 262, 450 224, 486 224" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-mem)"/>
<rect x="490" y="202" width="130" height="44" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<line x1="580" y1="202" x2="580" y2="246" stroke="var(--color-accent)"/>
<text x="535" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">30</text>
<line x1="588" y1="242" x2="612" y2="206" stroke="var(--color-neutral-600)" stroke-width="1.5"/>
<text x="632" y="228" font-size="11.5" fill="var(--color-neutral-700)">null</text>
<text x="0" y="308" font-size="11.5" fill="var(--color-neutral-800)">Nodes can sit anywhere on the Heap. Reaching the third one means walking through the two before it:</text>
<text x="0" y="326" font-size="11.5" fill="var(--color-neutral-800)">get(i) is slow. But inserting at the front is just changing one reference.</text>
</svg>
<figcaption>Neither one is better. They are inverses: whatever one makes instantaneous, the other makes expensive.</figcaption>
</figure>

Hold on to this idea, because it organizes everything that follows:

> **The array pays for insertion so that reading is free. The linked list pays for reading so that insertion is free.**

---

## 3. The node: the most important class in this lesson

A **node** is a tiny object holding two things: a value and a reference to the next node.

```java
public class Node<T> {
    T data;
    Node<T> next;   // ← a reference to another Node of the same type

    public Node(T data) {
        this.data = data;
        this.next = null;   // by default it points at nobody
    }
}
```

That `Node<T> next;` line is the one that trips everybody up: **a class referencing itself**. There is no infinite recursion there. Remember lesson 7: an object-typed field does not hold the object, it holds **a reference** (or `null`). A node does not contain another node: it knows where to find it.

---

## 4. Singly linked list, step by step

The whole list boils down to **a single reference**: the one pointing at the first node.

```java
public class LinkedList<T> {
    private Node<T> head;   // if it is null, the list is empty
    private int size;

    public boolean isEmpty() { return head == null; }
    public int size() { return size; }
}
```

### `addFirst`: the reference dance

These three lines are the heart of the whole structure, and **the order between them is non-negotiable**:

<figure class="diagram">
<svg viewBox="0 0 720 365" role="img" aria-labelledby="d-ins-t">
<title id="d-ins-t">The three states of the list while inserting a node at the front</title>
<defs><marker id="ar-ins" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-ins2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<text x="0" y="20" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">1. Node&lt;T&gt; fresh = new Node&lt;&gt;(5);   →   the new node is born isolated, list untouched</text>
<rect x="0" y="34" width="110" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="55" y="62" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">head</text>
<line x1="112" y1="56" x2="146" y2="56" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-ins)"/>
<rect x="150" y="34" width="150" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<line x1="255" y1="34" x2="255" y2="78" stroke="var(--color-neutral-500)"/>
<text x="202" y="62" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">10</text>
<circle cx="277" cy="56" r="4" fill="var(--color-neutral-700)"/>
<line x1="281" y1="56" x2="326" y2="56" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-ins)"/>
<rect x="330" y="34" width="150" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<line x1="435" y1="34" x2="435" y2="78" stroke="var(--color-neutral-500)"/>
<text x="382" y="62" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<line x1="443" y1="74" x2="467" y2="38" stroke="var(--color-neutral-600)" stroke-width="1.5"/>
<text x="500" y="61" font-size="11.5" fill="var(--color-neutral-700)">null</text>
<rect x="560" y="34" width="150" height="44" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<line x1="665" y1="34" x2="665" y2="78" stroke="var(--color-accent)"/>
<text x="612" y="62" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">5</text>
<line x1="673" y1="74" x2="697" y2="38" stroke="var(--color-accent-700)" stroke-width="1.5"/>
<text x="560" y="26" font-size="11" font-weight="700" fill="var(--color-accent-700)">fresh</text>
<text x="0" y="126" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">2. fresh.next = head;   →   the new node hooks up the old chain</text>
<text x="255" y="152" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">head (still here)</text>
<line x1="255" y1="156" x2="255" y2="164" stroke="var(--color-neutral-600)" stroke-width="1.8" marker-end="url(#ar-ins)"/>
<rect x="0" y="168" width="150" height="44" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<line x1="105" y1="168" x2="105" y2="212" stroke="var(--color-accent)"/>
<text x="52" y="196" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">5</text>
<circle cx="127" cy="190" r="4" fill="var(--color-accent-700)"/>
<line x1="131" y1="190" x2="176" y2="190" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-ins)"/>
<rect x="180" y="168" width="150" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<line x1="285" y1="168" x2="285" y2="212" stroke="var(--color-neutral-500)"/>
<text x="232" y="196" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">10</text>
<circle cx="307" cy="190" r="4" fill="var(--color-neutral-700)"/>
<line x1="311" y1="190" x2="356" y2="190" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-ins)"/>
<rect x="360" y="168" width="150" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<line x1="465" y1="168" x2="465" y2="212" stroke="var(--color-neutral-500)"/>
<text x="412" y="196" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<line x1="473" y1="208" x2="497" y2="172" stroke="var(--color-neutral-600)" stroke-width="1.5"/>
<text x="530" y="195" font-size="11.5" fill="var(--color-neutral-700)">null</text>
<text x="0" y="260" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">3. head = fresh;   →   only now does the list recognize it as its first node</text>
<text x="75" y="286" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">head</text>
<line x1="75" y1="290" x2="75" y2="298" stroke="var(--color-accent-2-700)" stroke-width="1.8" marker-end="url(#ar-ins2)"/>
<rect x="0" y="302" width="150" height="44" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<line x1="105" y1="302" x2="105" y2="346" stroke="var(--color-accent-2-600)"/>
<text x="52" y="330" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">5</text>
<circle cx="127" cy="324" r="4" fill="var(--color-accent-2-700)"/>
<line x1="131" y1="324" x2="176" y2="324" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-ins2)"/>
<rect x="180" y="302" width="150" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<line x1="285" y1="302" x2="285" y2="346" stroke="var(--color-neutral-500)"/>
<text x="232" y="330" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">10</text>
<circle cx="307" cy="324" r="4" fill="var(--color-neutral-700)"/>
<line x1="311" y1="324" x2="356" y2="324" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-ins)"/>
<rect x="360" y="302" width="150" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<line x1="465" y1="302" x2="465" y2="346" stroke="var(--color-neutral-500)"/>
<text x="412" y="330" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<line x1="473" y1="342" x2="497" y2="306" stroke="var(--color-neutral-600)" stroke-width="1.5"/>
<text x="530" y="329" font-size="11.5" fill="var(--color-neutral-700)">null</text>
<text x="560" y="329" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">Nothing was moved.</text>
</svg>
<figcaption>Steps 2 and 3 cannot be swapped: assign <code>head = fresh</code> first and you lose the only reference to the rest of the list, and the garbage collector takes it.</figcaption>
</figure>

```java
public void addFirst(T data) {
    Node<T> fresh = new Node<>(data);
    fresh.next = head;   // 2. the new node hooks up what was there
    head = fresh;        // 3. the list adopts it as its first
    size++;
}
```

Swap those last two lines and `head` points at the new node before anyone recorded where the old first node was. That reference is lost, and with it **the whole list**. It compiles perfectly. It breaks silently.

### Traversal: the pattern you will repeat forever

```java
public void print() {
    Node<T> current = head;          // a temporary pointer; never move head
    while (current != null) {
        System.out.print(current.data + " → ");
        current = current.next;      // the step that prevents an infinite loop
    }
    System.out.println("null");
}
```

**Never use `head` as the traversal variable.** Move it and you lose the start of the list with no way back. Always an auxiliary variable.

### Appending at the end

```java
public void addLast(T data) {
    Node<T> fresh = new Node<>(data);
    if (head == null) {              // special case: empty list
        head = fresh;
        size++;
        return;
    }
    Node<T> current = head;
    while (current.next != null) {   // note: next != null, not current != null
        current = current.next;      // you must walk the ENTIRE list
    }
    current.next = fresh;
    size++;
}
```

Notice the difference from the previous traversal: here the condition is `current.next != null`, because we want to stop **on the last node**, not step past it into `null`. That is a classic mistake.

And notice the cost: appending walks the whole list. That is the weakness of a singly linked list, and it is fixed by also keeping a `tail` reference.

---

## 5. Variants: doubly linked and circular

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-var-t">
<title id="d-var-t">Singly linked, doubly linked, and circular lists</title>
<defs><marker id="ar-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-v2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<text x="0" y="20" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">Singly linked — each node knows only the next one. Traversed in a single direction.</text>
<rect x="60" y="30" width="160" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="140" y="59" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">A</text>
<line x1="222" y1="53" x2="276" y2="53" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-v)"/>
<rect x="280" y="30" width="160" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="360" y="59" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">B</text>
<line x1="442" y1="53" x2="496" y2="53" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-v)"/>
<rect x="500" y="30" width="160" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="580" y="59" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">C</text>
<text x="670" y="58" font-size="11.5" fill="var(--color-neutral-700)">null</text>
<text x="0" y="114" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">Doubly linked — each node knows the next and the previous. Traversed both ways.</text>
<rect x="60" y="124" width="160" height="46" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="140" y="153" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">A</text>
<line x1="222" y1="140" x2="276" y2="140" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-v2)"/>
<line x1="276" y1="158" x2="222" y2="158" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-v2)"/>
<rect x="280" y="124" width="160" height="46" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="360" y="153" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">B</text>
<line x1="442" y1="140" x2="496" y2="140" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-v2)"/>
<line x1="496" y1="158" x2="442" y2="158" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-v2)"/>
<rect x="500" y="124" width="160" height="46" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="580" y="153" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">C</text>
<text x="0" y="208" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Circular — the last points back at the first. There is no null, so traversal does not stop on its own.</text>
<rect x="60" y="218" width="160" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="140" y="247" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>
<line x1="222" y1="241" x2="276" y2="241" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-v)"/>
<rect x="280" y="218" width="160" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="247" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<line x1="442" y1="241" x2="496" y2="241" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-v)"/>
<rect x="500" y="218" width="160" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="580" y="247" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<path d="M662 241 L692 241 L692 286 L140 286 L140 268" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-v)"/>
<text x="400" y="302" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">back to the first</text>
<text x="0" y="324" font-size="12" fill="var(--color-neutral-700)">In a circular list the stop condition cannot be != null: you stop when you return to the starting node.</text>
</svg>
<figcaption>Each variant trades extra memory for a more flexible traversal. The doubly linked one spends one more reference per node; the circular one spends nothing but changes how you walk it.</figcaption>
</figure>

In the **doubly linked** list, the node gains a backward reference:

```java
public class DoubleNode<T> {
    T data;
    DoubleNode<T> next;
    DoubleNode<T> previous;   // the one that makes it reversible
}
```

With that you can walk backwards and, above all, **delete a node given only that node**, without traversing to find its predecessor. That is what Java's `LinkedList` uses internally.

In the **circular** list, the last node points at the first. It is used for round-robin turns, buffers, and repeat-mode players. Traversal changes shape:

```java
// In a circular list this would be an infinite loop:
// while (current != null) { ... }

Node<T> current = head;
do {
    System.out.print(current.data + " → ");
    current = current.next;
} while (current != head);   // you stop when you get back to the start
```

---

## 6. The table that decides

| Operation | Array / `ArrayList` | Linked list |
| --- | --- | --- |
| `get(i)` by index | **O(1)** — arithmetic | O(n) — you have to walk |
| Insert at the front | O(n) — shift everything right | **O(1)** — two assignments |
| Insert at the end | **O(1)** amortized | O(n), or O(1) if you keep a `tail` |
| Insert in the middle | O(n) from the shifting | O(n) from the search |
| Remove the first | O(n) | **O(1)** |
| Search for a value | O(n) | O(n) |
| Memory per element | just the value | value **+ one reference** per node |

And the practical conclusion, which is what matters:

> **In 95% of cases, use `ArrayList`.** Sequential traversals over contiguous memory are far faster than the table suggests, because the processor prefetches whole contiguous blocks into its cache. A `LinkedList` with scattered nodes loses that advantage entirely.

`LinkedList` wins when you constantly insert and remove at the ends and almost never index into it. That case exists — you will see it in the next lesson, with stacks and queues — but it is the minority.

---

## 7. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| `head = fresh;` before `fresh.next = head;` | The reference to the rest of the list is lost and the collector takes it all. Compiles without a complaint. | Hook up first, move `head` second. |
| Traversing by moving `head` instead of an auxiliary variable | The list ends up truncated or empty after a plain read-only walk. | `Node<T> current = head;` and move `current`. |
| Forgetting `current = current.next;` inside the `while` | Infinite loop: the program hangs with no error at all. | The advance is part of the loop, not an optional detail. |
| Using `while (current != null)` when you want the last node | You end up on `null` and the `NullPointerException` lands on the next line. | `while (current.next != null)`. |
| Not handling the empty list | `NullPointerException` touching `head.next` when `head == null`. | Check `head == null` at the top of every operation. |
| Forgetting to update `size` | `size()` lies and everything depending on it breaks. | Change the counter in the same method that changes the structure. |
| Using `while (current != null)` on a circular list | Guaranteed infinite loop: there is never a `null`. | `do { ... } while (current != head);`. |

---

## 8. Guided hands-on exercise

### Challenge: `remove(T data)` on the singly linked list

Implement `remove` so that it:

1. Returns `true` when it removed something and `false` when the value was not there.
2. Works when the list is **empty**.
3. Works when the element to delete is the **head**.
4. Works when it is in the **middle** or at the **end**.
5. Updates `size` correctly.

Think through the four cases before writing anything. That is where all the difficulty of this exercise lives.

<details>
<summary>See suggested solution</summary>

```java
public class LinkedList<T> {
    private Node<T> head;
    private int size;

    public void addFirst(T data) {
        Node<T> fresh = new Node<>(data);
        fresh.next = head;
        head = fresh;
        size++;
    }

    public boolean remove(T data) {
        // CASE 1: empty list. Without this, the next line blows up.
        if (head == null) {
            return false;
        }

        // CASE 2: the element is the head.
        // It is different because there is no "previous" node to rewire.
        if (java.util.Objects.equals(head.data, data)) {
            head = head.next;   // the list now starts at the second node
            size--;
            return true;
        }

        // CASES 3 and 4: middle or end.
        // We always stand ONE node before the candidate, because unhooking a
        // node means modifying the 'next' of the node before it.
        Node<T> previous = head;
        while (previous.next != null) {
            if (java.util.Objects.equals(previous.next.data, data)) {
                previous.next = previous.next.next;   // the jump
                size--;
                return true;
            }
            previous = previous.next;
        }

        // We walked the whole list and it was not there.
        return false;
    }

    public void print() {
        Node<T> current = head;
        StringBuilder sb = new StringBuilder();
        while (current != null) {
            sb.append(current.data).append(" → ");
            current = current.next;
        }
        System.out.println(sb.append("null").append("  (size ").append(size).append(")"));
    }

    public static void main(String[] args) {
        LinkedList<Integer> list = new LinkedList<>();
        list.addFirst(30);
        list.addFirst(20);
        list.addFirst(10);
        list.print();                              // 10 → 20 → 30 → null  (size 3)

        System.out.println(list.remove(20));  // true  — middle case
        list.print();                              // 10 → 30 → null  (size 2)

        System.out.println(list.remove(10));  // true  — head case
        list.print();                              // 30 → null  (size 1)

        System.out.println(list.remove(99));  // false — not present
        System.out.println(list.remove(30));  // true  — last element
        list.print();                              // null  (size 0)

        System.out.println(list.remove(1));   // false — empty list
    }
}
```

**Two keys to this solution.**

First: we stand on the **node before** the one we want to delete, never on the node itself. In a singly linked list there is no way to reach a node's predecessor from the node, and without the predecessor you cannot rewire the chain. That is why the condition reads `previous.next.data` and not `current.data`.

Second: `Objects.equals(a, b)` instead of `a.equals(b)`, because it tolerates a stored `null` without throwing a `NullPointerException`.

And notice that "remove" never deletes anything: it merely stops pointing at it. With no reference reaching it, the garbage collector takes it away. In Java you never free memory by hand.

</details>

---

## Key takeaways

- An **ADT** separates the *what* (the specification) from the *how* (the implementation). In Java the *what* is written as an interface.
- Array and linked list have **inverse** costs: one pays for insertion so reading is free, the other the other way round.
- A node is an object holding a value and a **reference** to another node. It does not contain it: it knows where it is.
- In `addFirst`, the order of the two assignments is non-negotiable: hook up first, move `head` second.
- Always traverse with an **auxiliary variable**; moving `head` destroys the list.
- The four cases of every operation are: empty list, first element, middle element, element not present.
- The doubly linked list walks backwards and deletes without searching for the predecessor; the circular one has no `null` and changes the stop condition.
- In production, **`ArrayList` nearly always**. Contiguous memory beats the theory thanks to the processor cache.
</content>
