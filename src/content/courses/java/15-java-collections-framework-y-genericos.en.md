---
course: 'java'
slug: '13-java-collections-framework-y-genericos'
title: 'Java Collections and Generics (JCF)'
description: 'Walk through the whole Java Collections Framework, understand why generics exist, learn how a HashMap works internally, and build the judgment to pick the right collection.'
order: 15
lang: 'en'
published: true
---

# Java Collections and Generics (JCF)

For two lessons you implemented lists, stacks, and queues by hand. Now the good news: **none of that should ever be written in production**. Java ships all of it, tuned over thirty years and battle-tested by millions of applications.

But look at what you gained: when somebody says "use a `HashMap`", you now know there is an array and a collision mechanism inside. When you see `LinkedList`, you know why reaching element 500 is slow. **That is the difference between using a tool and understanding it.**

---

## 1. The Java Collections Framework hierarchy

<figure class="diagram">
<svg viewBox="0 0 720 355" role="img" aria-labelledby="d-jcf-t">
<title id="d-jcf-t">The Java Collections Framework hierarchy with its main interfaces and implementations</title>
<rect x="193" y="6" width="150" height="34" rx="12" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="268" y="28" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">Iterable</text>
<line x1="268" y1="40" x2="268" y2="56" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<rect x="193" y="56" width="150" height="34" rx="12" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="268" y="78" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">Collection</text>
<line x1="268" y1="90" x2="268" y2="110" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="85" y1="110" x2="451" y2="110" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="85" y1="110" x2="85" y2="136" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="268" y1="110" x2="268" y2="136" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="451" y1="110" x2="451" y2="136" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<rect x="0" y="136" width="170" height="38" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="85" y="160" font-size="13.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">List</text>
<rect x="183" y="136" width="170" height="38" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="268" y="160" font-size="13.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Set</text>
<rect x="366" y="136" width="170" height="38" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="451" y="160" font-size="13.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Queue</text>
<rect x="549" y="136" width="170" height="38" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="634" y="160" font-size="13.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Map</text>
<text x="549" y="128" font-size="10.5" font-weight="700" fill="var(--color-accent-2-700)">does NOT extend Collection</text>
<rect x="0" y="190" width="170" height="120" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="14" y="212" font-size="11.5" font-weight="700" fill="var(--color-text)">ArrayList</text>
<text x="14" y="228" font-size="11" fill="var(--color-neutral-700)">index O(1) · the default</text>
<text x="14" y="252" font-size="11.5" font-weight="700" fill="var(--color-text)">LinkedList</text>
<text x="14" y="268" font-size="11" fill="var(--color-neutral-700)">ends O(1)</text>
<text x="14" y="292" font-size="11" fill="var(--color-neutral-600)">duplicates allowed</text>
<rect x="183" y="190" width="170" height="120" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="197" y="212" font-size="11.5" font-weight="700" fill="var(--color-text)">HashSet</text>
<text x="197" y="228" font-size="11" fill="var(--color-neutral-700)">unordered · O(1)</text>
<text x="197" y="252" font-size="11.5" font-weight="700" fill="var(--color-text)">TreeSet</text>
<text x="197" y="268" font-size="11" fill="var(--color-neutral-700)">sorted · O(log n)</text>
<text x="197" y="292" font-size="11" fill="var(--color-neutral-600)">no duplicates</text>
<rect x="366" y="190" width="170" height="120" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="380" y="212" font-size="11.5" font-weight="700" fill="var(--color-text)">ArrayDeque</text>
<text x="380" y="228" font-size="11" fill="var(--color-neutral-700)">stack and queue · O(1)</text>
<text x="380" y="252" font-size="11.5" font-weight="700" fill="var(--color-text)">PriorityQueue</text>
<text x="380" y="268" font-size="11" fill="var(--color-neutral-700)">smallest comes out first</text>
<text x="380" y="292" font-size="11" fill="var(--color-neutral-600)">processing order</text>
<rect x="549" y="190" width="170" height="120" rx="14" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="563" y="212" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">HashMap</text>
<text x="563" y="228" font-size="11" fill="var(--color-neutral-800)">unordered · O(1)</text>
<text x="563" y="252" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">TreeMap</text>
<text x="563" y="268" font-size="11" fill="var(--color-neutral-800)">sorted by key</text>
<text x="563" y="292" font-size="11" fill="var(--color-neutral-700)">key → value</text>
<text x="0" y="332" font-size="12" fill="var(--color-neutral-700)">Everything under Collection holds standalone elements and can be walked with for-each. Map holds</text>
<text x="0" y="350" font-size="12" fill="var(--color-neutral-700)">associations, so its interface is different: that is why it sits outside the hierarchy.</text>
</svg>
<figcaption>The boxes on top are interfaces (the ADT); the ones below are implementations. Always program against the ones on top.</figcaption>
</figure>

That last sentence is a concrete rule, not advice:

```java
// Good: the variable's type is the interface
List<String> names = new ArrayList<>();
Map<String, Integer> stock = new HashMap<>();

// Bad: you tie yourself to the implementation
ArrayList<String> names = new ArrayList<>();
```

With the first form, switching to `LinkedList` means changing **one word**. With the second, if anyone used an `ArrayList`-specific method, it means changing everything. It is exactly the ADT principle from lesson 12, applied to the standard library.

---

## 2. Generics: the problem they came to solve

Before Java 5, collections stored `Object`. Everything compiled, and errors surfaced once the program was already in production.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-gen-t">
<title id="d-gen-t">Without generics the error appears at runtime; with generics it appears at compile time</title>
<defs><marker id="ar-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker><marker id="ar-g2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<rect x="0" y="0" width="720" height="136" rx="20" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="20" y="28" font-size="13.5" font-weight="700" fill="var(--color-neutral-900)">Without generics — the collection stores Object</text>
<rect x="20" y="40" width="410" height="80" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="60" font-size="11.5" fill="var(--color-text)">List list = new ArrayList();</text>
<text x="34" y="78" font-size="11.5" fill="var(--color-text)">list.add("hello");</text>
<text x="34" y="96" font-size="11.5" fill="var(--color-text)">list.add(42);</text>
<text x="230" y="96" font-size="11" fill="var(--color-neutral-600)">← compiles just fine</text>
<text x="34" y="114" font-size="11.5" fill="var(--color-text)">String s = (String) list.get(1);</text>
<line x1="434" y1="80" x2="482" y2="80" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-g)"/>
<rect x="490" y="52" width="212" height="60" rx="14" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="596" y="76" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">ClassCastException</text>
<text x="596" y="96" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">at RUNTIME, with users on it</text>
<rect x="0" y="152" width="720" height="126" rx="20" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="20" y="180" font-size="13.5" font-weight="700" fill="var(--color-accent-2-700)">With generics — the collection declares what it stores</text>
<rect x="20" y="192" width="410" height="66" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="212" font-size="11.5" fill="var(--color-text)">List&lt;String&gt; list = new ArrayList&lt;&gt;();</text>
<text x="34" y="230" font-size="11.5" fill="var(--color-text)">list.add("hello");</text>
<text x="34" y="248" font-size="11.5" fill="var(--color-text)">list.add(42);</text>
<text x="180" y="248" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">← does not even compile</text>
<line x1="434" y1="222" x2="482" y2="222" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-g2)"/>
<rect x="490" y="194" width="212" height="60" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="596" y="218" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Compile error</text>
<text x="596" y="238" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">in your IDE, before anything</text>
<text x="0" y="296" font-size="12" fill="var(--color-neutral-700)">Generics do not make the program faster: they move the moment you find the bug. That is worth a fortune.</text>
</svg>
<figcaption>The cast disappears and the error moves from a Sunday at 3 a.m. to three seconds after typing the line.</figcaption>
</figure>

With generics the compiler also knows what comes out of the collection, so **the cast disappears**:

```java
List<String> names = new ArrayList<>();
names.add("Laura");
String first = names.get(0);   // no cast: the compiler knows it is a String
```

The empty `<>` on the right is called the **diamond** and tells the compiler "the same type I declared on the left". Writing `new ArrayList<String>()` is not wrong, just redundant.

---

## 3. The four families, and when to use each

### `List` — insertion order, duplicates allowed

```java
List<String> tasks = new ArrayList<>();
tasks.add("Study OOP");
tasks.add("Practice lists");
tasks.add("Study OOP");        // repeats, and that is fine

System.out.println(tasks.get(1));      // access by index
System.out.println(tasks.size());      // 3
```

### `Set` — no duplicates, and order depends on the implementation

```java
Set<String> tags = new HashSet<>();
tags.add("java");
tags.add("oop");
tags.add("java");               // ignored, already present

System.out.println(tags.size());    // 2
```

`HashSet` guarantees no order at all. `LinkedHashSet` preserves insertion order. `TreeSet` keeps elements sorted and gives you operations like `first()`, `last()`, and `headSet()`.

**Careful**: for a `HashSet` to detect duplicates of your own classes, those classes must implement `equals()` and `hashCode()` correctly. Without that, two identical objects both get in. That is the core topic of the next lesson.

### `Map` — associating a key with a value

It is the most used collection of all, and the most under-used:

```java
Map<String, Integer> stock = new HashMap<>();
stock.put("tea", 12);
stock.put("coffee", 5);
stock.put("tea", 20);              // overwrites: keys are unique

System.out.println(stock.get("tea"));               // 20
System.out.println(stock.get("sugar"));             // null — not there
System.out.println(stock.getOrDefault("sugar", 0)); // 0 — much better

// Walking a Map:
for (Map.Entry<String, Integer> entry : stock.entrySet()) {
    System.out.println(entry.getKey() + " → " + entry.getValue());
}
```

The modern `Map` methods eliminate almost every `if` people used to write by hand:

```java
// Instead of: if (!map.containsKey(k)) map.put(k, new ArrayList<>());
map.computeIfAbsent(key, k -> new ArrayList<>()).add(value);

// Instead of: counter.put(w, counter.containsKey(w) ? counter.get(w) + 1 : 1);
counter.merge(word, 1, Integer::sum);

// Instead of: if (map.get(k) == null) map.put(k, v);
map.putIfAbsent(key, value);
```

### `Queue` / `Deque` — processing order

You already met them in lesson 13. `ArrayDeque` for stacks and queues; `PriorityQueue` when the next item out is not the one that arrived first but the highest-priority one.

---

## 4. How a `HashMap` works inside

This explains once and for all why `get()` is O(1) and why `equals`/`hashCode` matter so much.

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-hash-t">
<title id="d-hash-t">The internal path of a HashMap lookup, from the key to the bucket</title>
<defs><marker id="ar-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="30" width="170" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="85" y="54" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">key "cat"</text>
<text x="85" y="72" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">what you write</text>
<line x1="172" y1="56" x2="206" y2="56" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-h)"/>
<rect x="210" y="30" width="190" height="52" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="305" y="54" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">hashCode()</text>
<text x="305" y="72" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">returns 98262</text>
<line x1="402" y1="56" x2="436" y2="56" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-h)"/>
<rect x="440" y="30" width="280" height="52" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="580" y="54" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">98262 % 16 → bucket 2</text>
<text x="580" y="72" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">plain arithmetic: hence O(1)</text>
<rect x="0" y="112" width="190" height="38" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="16" y="136" font-size="11.5" fill="var(--color-neutral-600)">bucket 0 — empty</text>
<rect x="0" y="156" width="190" height="38" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="16" y="180" font-size="11.5" fill="var(--color-neutral-600)">bucket 1 — empty</text>
<rect x="0" y="200" width="190" height="38" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="16" y="224" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">bucket 2</text>
<rect x="0" y="244" width="190" height="38" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="16" y="268" font-size="11.5" fill="var(--color-neutral-600)">bucket 3 — empty</text>
<line x1="192" y1="219" x2="234" y2="219" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-h)"/>
<text x="240" y="194" font-size="11" font-weight="700" fill="var(--color-accent-700)">collision: two different keys landed in the same bucket</text>
<rect x="240" y="200" width="210" height="38" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="345" y="224" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">"cat" → 4</text>
<line x1="452" y1="219" x2="486" y2="219" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-h)"/>
<rect x="490" y="200" width="210" height="38" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="595" y="224" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">"act" → 9</text>
<text x="240" y="262" font-size="11.5" fill="var(--color-neutral-800)">Inside the bucket, equals() compares the real key and decides which one it is.</text>
<text x="0" y="302" font-size="12" fill="var(--color-neutral-800)">hashCode() picks the drawer; equals() picks the item inside the drawer. If hashCode is wrong, the key is looked</text>
<text x="0" y="320" font-size="12" fill="var(--color-neutral-800)">up in the wrong drawer and the HashMap answers "not found" even though the object is stored.</text>
</svg>
<figcaption>With a well-distributed hash there are almost no collisions and <code>get()</code> is arithmetic. With a bad hash everything lands in one bucket and the map degenerates into a list: O(n).</figcaption>
</figure>

That last sentence in the caption is the reason the next lesson exists. A badly implemented `hashCode()` breaks no compilation and throws no exception: it just makes your `HashMap` a hundred times slower, or makes it fail to find what you stored.

---

## 5. Writing your own generics

They are not only for consuming; you can write them too. A **generic class** declares its type parameters between `<>`:

```java
public class Box<T> {
    private T content;

    public void put(T content) { this.content = content; }
    public T take() { return content; }
}

Box<String> textBox = new Box<>();
textBox.put("hello");
String s = textBox.take();   // no cast
```

A **generic method** declares its own type parameter before the return type:

```java
public static <T> T first(List<T> list) {
    if (list.isEmpty()) throw new NoSuchElementException("Empty list");
    return list.get(0);
}
```

And you can **bound** the type with `extends`, so you can call methods of the bound:

```java
// T must be comparable, so we can call compareTo
public static <T extends Comparable<T>> T max(List<T> list) {
    T largest = list.get(0);
    for (T item : list) {
        if (item.compareTo(largest) > 0) largest = item;
    }
    return largest;
}
```

By convention type parameters are single uppercase letters: `T` (type), `E` (element), `K` and `V` (key, value), `R` (result).

### Type erasure: the fine print

Generics exist **only at compile time**. The JVM knows nothing about them: in bytecode, `List<String>` and `List<Integer>` are the same thing. This is called *type erasure*, and it explains limitations that otherwise look arbitrary:

```java
List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass());   // true — the same class

// T[] array = new T[10];   // not allowed: at runtime nobody knows what T is
```

---

## 6. Which one to pick

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-dec-t">
<title id="d-dec-t">Decision tree for choosing the right collection</title>
<defs><marker id="ar-d" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="190" y="6" width="340" height="44" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="34" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Do you need to associate a key with a value?</text>
<path d="M280 52 L170 52 L170 92" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-d)"/>
<text x="196" y="72" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">NO</text>
<path d="M440 52 L550 52 L550 92" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-d)"/>
<text x="500" y="72" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">YES</text>
<rect x="20" y="96" width="300" height="44" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="170" y="124" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Are repeated elements allowed?</text>
<rect x="400" y="96" width="300" height="44" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="550" y="124" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Do the keys need to stay sorted?</text>
<path d="M110 142 L85 142 L85 182" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-d)"/>
<path d="M230 142 L265 142 L265 182" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-d)"/>
<path d="M490 142 L455 142 L455 182" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-d)"/>
<path d="M610 142 L635 142 L635 182" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-d)"/>
<rect x="0" y="186" width="170" height="62" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="85" y="208" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">YES, repeats allowed</text>
<text x="85" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">ArrayList</text>
<rect x="180" y="186" width="170" height="62" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="265" y="208" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">NO, must be unique</text>
<text x="265" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">HashSet</text>
<rect x="370" y="186" width="170" height="62" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="455" y="208" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">NO, order irrelevant</text>
<text x="455" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">HashMap</text>
<rect x="550" y="186" width="170" height="62" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="635" y="208" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">YES, sorted</text>
<text x="635" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">TreeMap</text>
<text x="0" y="278" font-size="12" fill="var(--color-neutral-700)">If you also need insertion order preserved, swap HashSet for LinkedHashSet and HashMap for LinkedHashMap.</text>
<text x="0" y="296" font-size="12" fill="var(--color-neutral-700)">If you are working with stacks or queues, ArrayDeque. Everything else is a special case.</text>
</svg>
<figcaption>Four questions cover 90% of the decisions. When none of them fits, that is when it pays to look at the special case.</figcaption>
</figure>

| I need... | I use |
| --- | --- |
| Insertion order and index access | `ArrayList` |
| Heavy insert and delete at the ends | `ArrayDeque` |
| Unique elements, order irrelevant | `HashSet` |
| Unique elements, always sorted | `TreeSet` |
| Key → value, blazing fast access | `HashMap` |
| Key → value, iteration in key order | `TreeMap` |
| Key → value, in insertion order | `LinkedHashMap` |
| Always take the highest-priority item | `PriorityQueue` |

---

## 7. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| Declaring `ArrayList<T> x = new ArrayList<>()` | You tie yourself to the implementation, and changing it forces edits everywhere it is used. | Declare with the interface: `List<T> x = new ArrayList<>()`. |
| Using your own objects in `HashSet`/`HashMap` without `equals`/`hashCode` | Duplicates get stored and `get()` returns `null` with the correct key. | Implement both consistently (lesson 15). |
| Modifying a collection while walking it with for-each | `ConcurrentModificationException`. | `Iterator.remove()` or `removeIf()` (lesson 15). |
| `map.get(k)` without handling `null` | `NullPointerException` unboxing an `Integer` that came back `null`. | `getOrDefault(k, defaultValue)`. |
| Using `LinkedList` "because inserting is faster" | In practice it is slower than `ArrayList` because of cache misses. | `ArrayList` unless you measure and prove otherwise. |
| Using a mutable key in a `HashMap` | If the object changes, its `hashCode` changes and it is lost in the old bucket. | Immutable keys: `String`, `Integer`, or classes with `final` fields. |
| Trying to modify a `List.of(...)` list | `UnsupportedOperationException`: it is immutable. | `new ArrayList<>(List.of(...))` when you need to modify it. |

---

## 8. Guided hands-on exercise

### Challenge: a word frequency counter

Write a program that takes a text and reports how many times each word appears.

1. Normalize the text: all lowercase, no punctuation.
2. Count frequencies with a `Map<String, Integer>`.
3. Print the result **sorted by frequency descending** and, on ties, alphabetically.
4. Also report how many distinct words there are, using a `Set`.
5. Ignore stop words (`the`, `and`, `of`, `a`, `in`...).

<details>
<summary>See suggested solution</summary>

```java
import java.util.*;

public class WordCounter {

    private static final Set<String> STOP_WORDS = Set.of(
        "the", "and", "of", "a", "in", "to", "is", "it", "that", "with", "on", "an"
    );

    public static Map<String, Integer> count(String text) {
        Map<String, Integer> frequencies = new HashMap<>();

        // \\p{L}+ takes runs of letters, accented ones included
        for (String word : text.toLowerCase().split("[^\\p{L}]+")) {
            if (word.isBlank() || STOP_WORDS.contains(word)) {
                continue;
            }
            // merge: if absent, store 1; if present, apply Integer::sum
            frequencies.merge(word, 1, Integer::sum);
        }
        return frequencies;
    }

    public static void main(String[] args) {
        String text = """
            Object oriented programming organizes the software in objects.
            Each object combines state and behavior, and the state of an object
            is protected with encapsulation. Inheritance and polymorphism let
            the software grow without rewriting the software that already works.
            """;

        Map<String, Integer> frequencies = count(text);

        // A Set gives us the distinct words with no logic written at all
        Set<String> distinct = frequencies.keySet();
        System.out.println("Distinct words (stop words excluded): " + distinct.size());
        System.out.println("Total occurrences: " +
            frequencies.values().stream().mapToInt(Integer::intValue).sum());
        System.out.println();

        // Sort: frequency descending first, then alphabetically
        List<Map.Entry<String, Integer>> sorted = new ArrayList<>(frequencies.entrySet());
        sorted.sort(
            Map.Entry.<String, Integer>comparingByValue().reversed()
                .thenComparing(Map.Entry.comparingByKey())
        );

        System.out.println("Top 8:");
        for (Map.Entry<String, Integer> e : sorted.subList(0, Math.min(8, sorted.size()))) {
            System.out.printf("  %-16s %s%n", e.getKey(), "▮".repeat(e.getValue()) + " " + e.getValue());
        }

        // Bonus: group words by length, with computeIfAbsent
        Map<Integer, List<String>> byLength = new TreeMap<>();
        for (String word : distinct) {
            byLength.computeIfAbsent(word.length(), k -> new ArrayList<>()).add(word);
        }
        System.out.println("\n10-letter words: " + byLength.getOrDefault(10, List.of()));
    }
}
```

**Three things to look at here.**

`frequencies.merge(word, 1, Integer::sum)` replaces the classic `if (map.containsKey(w)) map.put(w, map.get(w) + 1); else map.put(w, 1);`. One line instead of four, with no chance of botching the first-occurrence case.

`byLength.computeIfAbsent(len, k -> new ArrayList<>()).add(word)` is the pattern for building a map of lists. Without it you would check whether the list exists before appending, on every single iteration.

And `STOP_WORDS` is a `Set`, not a `List`, because the only thing we do with it is ask `contains`. On a `Set` that is O(1); on a `List` it would be O(n), executed once per word in the text. **Choosing the right collection is a performance decision, not a style one.**

</details>

---

## Key takeaways

- The JCF separates **interfaces** (the ADT) from **implementations**. Always declare with the interface.
- `Map` does **not** extend `Collection`: it holds associations, not standalone elements.
- Generics speed up nothing: they **move the error forward**, from production to the moment you type the line.
- **Type erasure** means generics do not exist at runtime. That is where their limitations come from.
- In a `HashMap`, `hashCode()` picks the bucket and `equals()` picks the element inside the bucket.
- A bad `hashCode()` throws no exception: it just makes you unable to find what you stored.
- `merge`, `computeIfAbsent`, `getOrDefault`, and `putIfAbsent` remove most of the `if` blocks around a map.
- Picking the right collection **is a performance decision**: `contains` on a `Set` is O(1); on a `List`, O(n).
</content>
