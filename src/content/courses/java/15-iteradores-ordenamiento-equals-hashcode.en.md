---
course: 'java'
slug: '14-iteradores-ordenamiento-equals-hashcode'
title: 'Iterators, Ordering, and the equals/hashCode Contract'
description: 'Understand what sits behind a for-each, why ConcurrentModificationException fires, how to sort with Comparable and Comparator, and why breaking the equals/hashCode contract makes your objects vanish.'
order: 15
lang: 'en'
published: true
---

# Iterators, Ordering, and the equals/hashCode Contract

The previous lesson left three debts: why a `HashSet` sometimes stores duplicates, how to sort a collection of your own objects, and what that `ConcurrentModificationException` is that shows up when you delete while iterating.

All three share one root: **Java's collections ask questions about your objects, and if your objects answer badly, everything fails silently.**

---

## 1. What is really behind a `for-each`

This loop you have been using since lesson 4:

```java
for (String name : names) {
    System.out.println(name);
}
```

The compiler translates it into this:

```java
Iterator<String> it = names.iterator();
while (it.hasNext()) {
    String name = it.next();
    System.out.println(name);
}
```

An **`Iterator`** is an object with just three methods: `hasNext()`, `next()`, and `remove()`. And a collection is for-each-able only if it implements `Iterable`, which demands exactly one method: `iterator()`.

That is why you can walk an `ArrayList`, a `HashSet`, and an `ArrayDeque` with identical syntax even though internally they have nothing in common. **The for-each does not talk to the collection: it talks to its iterator.**

---

## 2. `ConcurrentModificationException`: why it happens

This code looks reasonable and fails every time:

```java
List<String> tasks = new ArrayList<>(List.of("study", "rest", "practice"));

for (String t : tasks) {
    if (t.startsWith("r")) {
        tasks.remove(t);      // ← ConcurrentModificationException
    }
}
```

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-cme-t">
<title id="d-cme-t">Why modifying a collection during a for-each throws ConcurrentModificationException</title>
<rect x="0" y="0" width="720" height="182" rx="20" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="20" y="28" font-size="13.5" font-weight="700" fill="var(--color-neutral-900)">Modifying the collection during the for-each</text>
<rect x="20" y="40" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="60" font-size="11.5" fill="var(--color-text)">1. The for-each creates an Iterator, which memorizes the list's current modCount: 0</text>
<rect x="20" y="76" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="96" font-size="11.5" fill="var(--color-text)">2. tasks.remove("rest") modifies the list from outside: its modCount becomes 1</text>
<rect x="20" y="112" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="132" font-size="11.5" fill="var(--color-text)">3. On the next round, next() compares the memorized modCount (0) with the current one (1)</text>
<rect x="20" y="148" width="680" height="30" rx="10" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<text x="34" y="168" font-size="11.5" font-weight="700" fill="var(--color-neutral-900)">4. They differ → ConcurrentModificationException. The iterator declares itself stale.</text>
<rect x="0" y="198" width="720" height="126" rx="20" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="20" y="226" font-size="13.5" font-weight="700" fill="var(--color-accent-2-700)">The two correct ways to delete while iterating</text>
<rect x="20" y="238" width="680" height="34" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="259" font-size="11.5" fill="var(--color-text)">it.remove()  →  deletes through the iterator itself, which syncs its modCount and stays valid</text>
<rect x="20" y="278" width="680" height="34" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="299" font-size="11.5" fill="var(--color-text)">list.removeIf(t -&gt; t.startsWith("r"))  →  one line, no explicit iterator. The modern way.</text>
</svg>
<figcaption>The exception does not protect the collection: it protects you from walking a structure that shifted under your feet and silently skipping elements.</figcaption>
</figure>

```java
// Option 1: the explicit iterator
Iterator<String> it = tasks.iterator();
while (it.hasNext()) {
    if (it.next().startsWith("r")) {
        it.remove();          // the iterator deletes AND stays consistent
    }
}

// Option 2: removeIf — since Java 8, and what you will use 95% of the time
tasks.removeIf(t -> t.startsWith("r"));
```

> The exception's name is misleading: **it has nothing to do with threads or concurrency**. It happens just the same in a single-threaded program. It is named that way because the collection was modified "concurrently" with respect to the traversal in progress.

---

## 3. `Comparable`: a class's natural order

Try to sort a list of your own objects and Java stops you:

```java
List<Book> books = new ArrayList<>();
Collections.sort(books);   // ERROR: Book is not Comparable
```

And it is right to: **sort by what?** Title, author, pages, year? Java cannot guess. You have to say.

`Comparable` defines the **natural order**: the default one, the order that makes sense when nobody asks for anything else.

```java
public class Book implements Comparable<Book> {
    private final String title;
    private final String author;
    private final int pages;

    @Override
    public int compareTo(Book other) {
        return this.title.compareTo(other.title);   // natural order: by title
    }
}
```

<figure class="diagram">
<svg viewBox="0 0 720 240" role="img" aria-labelledby="d-cmp-t">
<title id="d-cmp-t">The three return values of compareTo and what they mean for sorting</title>
<text x="0" y="22" font-size="13" font-weight="700" fill="var(--color-accent-700)">What a.compareTo(b) returning each value means</text>
<rect x="0" y="36" width="226" height="98" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="113" y="64" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">negative</text>
<text x="113" y="88" font-size="12" text-anchor="middle" fill="var(--color-text)">a comes BEFORE b</text>
<text x="113" y="110" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">a is "smaller"</text>
<rect x="247" y="36" width="226" height="98" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="360" y="64" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">zero</text>
<text x="360" y="88" font-size="12" text-anchor="middle" fill="var(--color-text)">they are equivalent</text>
<text x="360" y="110" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">for this ordering</text>
<rect x="494" y="36" width="226" height="98" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="607" y="64" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">positive</text>
<text x="607" y="88" font-size="12" text-anchor="middle" fill="var(--color-text)">a comes AFTER b</text>
<text x="607" y="110" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">a is "greater"</text>
<rect x="0" y="152" width="720" height="76" rx="16" fill="var(--color-neutral-100)" stroke="var(--color-neutral-500)" stroke-dasharray="5 4"/>
<text x="20" y="176" font-size="12.5" font-weight="700" fill="var(--color-neutral-900)">The classic trap: return this.age - other.age;</text>
<text x="20" y="198" font-size="11.5" fill="var(--color-neutral-800)">With large values that subtraction overflows the int and returns the wrong sign: the list comes out</text>
<text x="20" y="216" font-size="11.5" fill="var(--color-neutral-800)">misordered with no exception to warn you. Always use Integer.compare(this.age, other.age).</text>
</svg>
<figcaption>The exact value does not matter, only the sign. Which is why returning the subtraction seems to work — until the day the numbers get big.</figcaption>
</figure>

With `Comparable` implemented, the whole Java ecosystem works on its own: `Collections.sort()`, `list.sort(null)`, `TreeSet`, `TreeMap`, and `Arrays.sort()`.

---

## 4. `Comparator`: every other order

The problem with `Comparable` is that **you only get one**. What if sometimes you want to sort by pages and sometimes by author?

That is what `Comparator` is for: an ordering that lives **outside** the class.

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-cor-t">
<title id="d-cor-t">Comparable defines one internal order; Comparator allows many external ones</title>
<defs><marker id="ar-co" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="0" width="720" height="120" rx="20" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="20" y="28" font-size="13.5" font-weight="700" fill="var(--color-accent-2-700)">Comparable — the natural order, written INSIDE the class</text>
<rect x="20" y="40" width="400" height="62" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="62" font-size="11.5" font-weight="700" fill="var(--color-text)">class Book implements Comparable&lt;Book&gt;</text>
<text x="34" y="84" font-size="11.5" fill="var(--color-text)">public int compareTo(Book other) { ... }</text>
<text x="440" y="60" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">There can be only ONE per class.</text>
<text x="440" y="80" font-size="11.5" fill="var(--color-neutral-800)">Used by Collections.sort(list),</text>
<text x="440" y="98" font-size="11.5" fill="var(--color-neutral-800)">TreeSet, and TreeMap by default.</text>
<rect x="0" y="136" width="720" height="164" rx="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="164" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Comparator — external orderings, as many as you need</text>
<rect x="20" y="180" width="180" height="100" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="110" y="222" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Book</text>
<text x="110" y="244" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">class untouched</text>
<path d="M202 206 L232 206" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-co)"/>
<path d="M202 230 L232 230" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-co)"/>
<path d="M202 254 L232 254" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-co)"/>
<rect x="240" y="182" width="460" height="32" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="254" y="203" font-size="11.5" fill="var(--color-text)">Comparator.comparing(Book::getTitle)</text>
<rect x="240" y="220" width="460" height="32" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="254" y="241" font-size="11.5" fill="var(--color-text)">Comparator.comparingInt(Book::getPages).reversed()</text>
<rect x="240" y="258" width="460" height="32" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="254" y="279" font-size="11.5" fill="var(--color-text)">comparing(Book::getAuthor).thenComparing(Book::getTitle)</text>
<text x="0" y="320" font-size="12" fill="var(--color-neutral-700)">Comparator even works for classes you did not write and cannot modify. Comparable does not.</text>
</svg>
<figcaption>The natural order is a property of the class; a comparator is a decision made by whoever sorts. Which is why many can coexist.</figcaption>
</figure>

```java
// Sort by pages, ascending
books.sort(Comparator.comparingInt(Book::getPages));

// Descending
books.sort(Comparator.comparingInt(Book::getPages).reversed());

// By author and, within an author, by title
books.sort(
    Comparator.comparing(Book::getAuthor)
              .thenComparing(Book::getTitle)
);

// With nulls last, without blowing up
books.sort(Comparator.comparing(Book::getAuthor,
           Comparator.nullsLast(Comparator.naturalOrder())));
```

Note that `sort` orders **the original list in place**. If you need the original order preserved, copy first: `new ArrayList<>(books).sort(...)`.

---

## 5. The `equals` contract: five rules

By default, `Object.equals()` compares **references**: it returns `true` only when they are literally the same object on the Heap. For almost any domain class, that is wrong:

```java
Book a = new Book("1984", "Orwell", 328);
Book b = new Book("1984", "Orwell", 328);

System.out.println(a == b);        // false — two distinct objects, obviously
System.out.println(a.equals(b));   // false — but THIS should be true
```

Overriding `equals` means signing a five-clause contract:

| Rule | What it means |
| --- | --- |
| **Reflexive** | `a.equals(a)` is always `true`. |
| **Symmetric** | If `a.equals(b)`, then `b.equals(a)`. |
| **Transitive** | If `a.equals(b)` and `b.equals(c)`, then `a.equals(c)`. |
| **Consistent** | Calling it ten times returns the same, as long as nothing changed. |
| **Against `null`** | `a.equals(null)` is `false`, and never throws. |

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;                    // shortcut: same object
    if (o == null || getClass() != o.getClass()) return false;
    Book other = (Book) o;
    return pages == other.pages
        && Objects.equals(title, other.title)      // tolerates null on both sides
        && Objects.equals(author, other.author);
}
```

> The parameter is `Object o`, **not** `Book o`. Writing `public boolean equals(Book o)` is **overloading**, not overriding, and collections — which call `equals(Object)` — will keep using the inherited version. It is exactly the bug `@Override` catches, as we saw in lesson 9.

---

## 6. `hashCode`: the one that breaks everything when missing

Here is the real problem. `equals` alone is not enough:

<figure class="diagram">
<svg viewBox="0 0 720 320" role="img" aria-labelledby="d-hc-t">
<title id="d-hc-t">What happens when two objects are equal but have different hash codes</title>
<defs><marker id="ar-hc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker></defs>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">equals() done right, hashCode() left unoverridden</text>
<rect x="0" y="32" width="290" height="76" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="145" y="58" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">book1 = new Book("1984")</text>
<text x="145" y="80" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-700)">hashCode() inherited from Object</text>
<text x="145" y="98" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">= 366712642</text>
<rect x="430" y="32" width="290" height="76" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="575" y="58" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">book2 = new Book("1984")</text>
<text x="575" y="80" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-700)">hashCode() inherited from Object</text>
<text x="575" y="98" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">= 1829164700</text>
<line x1="292" y1="70" x2="428" y2="70" stroke="var(--color-accent-2-700)" stroke-width="2"/>
<text x="360" y="62" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">equals() → true</text>
<line x1="145" y1="112" x2="145" y2="146" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-hc)"/>
<line x1="575" y1="112" x2="575" y2="146" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-hc)"/>
<rect x="50" y="150" width="190" height="46" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="145" y="178" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">bucket 2</text>
<rect x="480" y="150" width="190" height="46" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="575" y="178" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">bucket 11</text>
<text x="360" y="178" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">different drawers</text>
<rect x="0" y="212" width="720" height="56" rx="16" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<text x="20" y="236" font-size="12.5" font-weight="700" fill="var(--color-neutral-900)">set.add(book1); set.add(book2);   →   set.size() == 2</text>
<text x="20" y="256" font-size="11.5" fill="var(--color-neutral-800)">The Set never compared them: landing in different drawers, equals() was never even called.</text>
<text x="0" y="292" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">THE RULE: if a.equals(b) is true, then a.hashCode() == b.hashCode() MUST be true.</text>
<text x="0" y="312" font-size="12" fill="var(--color-neutral-700)">The converse is not required: two different objects may share a hash code. That is a collision, and it is normal.</text>
</svg>
<figcaption>A <code>HashSet</code> does not scan everything comparing: it computes the drawer first. If the drawer is wrong, the comparison never happens.</figcaption>
</figure>

Which is why the rule is absolute: **if you override `equals`, override `hashCode`.** It is not optional or a nice-to-have: it is a precondition for collections to work.

```java
@Override
public int hashCode() {
    return Objects.hash(title, author, pages);   // the SAME fields as equals
}
```

`Objects.hash(...)` combines the values with a proven formula. **Use exactly the same fields in `equals` and `hashCode`**: if `equals` compares three fields and `hashCode` uses two, the contract still holds; if it uses one that `equals` ignores, it breaks.

### The shortcut: `record`

If your class is a plain data carrier, a `record` generates correct `equals`, `hashCode`, and `toString` automatically:

```java
public record Book(String title, String author, int pages) implements Comparable<Book> {
    @Override
    public int compareTo(Book other) {
        return this.title.compareTo(other.title);
    }
}
```

Three lines and the contract is guaranteed by the compiler. That is why the `record` from lesson 8 shows up so much in modern code.

---

## 7. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| Overriding `equals` but not `hashCode` | `HashSet` stores duplicates and `HashMap.get()` returns `null` with the correct key. | Always override both, with the same fields. |
| Writing `equals(Book o)` instead of `equals(Object o)` | It is an overload, not an override. Collections keep comparing by reference. | Signature `equals(Object o)` with `@Override`. |
| `compareTo` returning `a - b` | With large values the `int` overflows and the order inverts, with no exception. | `Integer.compare(a, b)`. |
| Using `==` to compare `String` | It compares references; works with literals thanks to the string pool and fails with constructed strings. | `.equals()`, or `Objects.equals()` if `null` is possible. |
| Modifying an object already stored in a `HashSet` | Its `hashCode` changes, it stays in the old drawer, and `contains()` returns `false` on an object that is inside. | Immutable keys and `Set` elements. |
| Deleting with `list.remove(x)` inside a for-each | `ConcurrentModificationException`. | `removeIf(...)` or `iterator.remove()`. |
| `compareTo` inconsistent with `equals` | A `TreeSet` drops elements that `equals` considers distinct, because to it `compareTo == 0` means duplicate. | Make `compareTo` return `0` exactly when `equals` is `true`. |

---

## 8. Guided hands-on exercise

### Challenge: the `Book` class

1. Create `Book` with `title`, `author`, and `pages`, all immutable.
2. Implement `equals` and `hashCode` using the three fields.
3. Implement `Comparable<Book>` with a natural order by title.
4. Show that a `HashSet` discards the duplicate.
5. Sort a list by natural order and then with three different `Comparator`s.
6. Show what happens with a `TreeSet` whose `compareTo` only looks at the title.

<details>
<summary>See suggested solution</summary>

```java
import java.util.*;

public final class Book implements Comparable<Book> {
    private final String title;
    private final String author;
    private final int pages;

    public Book(String title, String author, int pages) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (pages <= 0) {
            throw new IllegalArgumentException("Pages must be positive");
        }
        this.title = title;
        this.author = author;
        this.pages = pages;
    }

    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public int getPages() { return pages; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Book other = (Book) o;
        return pages == other.pages
            && Objects.equals(title, other.title)
            && Objects.equals(author, other.author);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, author, pages);   // the same three fields
    }

    @Override
    public int compareTo(Book other) {
        return this.title.compareTo(other.title);    // natural order: by title
    }

    @Override
    public String toString() {
        return String.format("%-28s %-18s %4d p.", title, author, pages);
    }

    public static void main(String[] args) {
        Book a = new Book("1984", "Orwell", 328);
        Book b = new Book("1984", "Orwell", 328);   // identical to 'a'

        System.out.println("a == b        → " + (a == b));        // false
        System.out.println("a.equals(b)   → " + a.equals(b));     // true
        System.out.println("same hash     → " + (a.hashCode() == b.hashCode()));  // true

        // 4. The HashSet discards the duplicate thanks to the equals/hashCode pair
        Set<Book> deduplicated = new HashSet<>(List.of(a, b));
        System.out.println("\nHashSet size  → " + deduplicated.size());   // 1

        List<Book> books = new ArrayList<>(List.of(
            new Book("Hopscotch",  "Cortazar", 736),
            new Book("The Aleph",  "Borges",   146),
            new Book("1984",       "Orwell",   328),
            new Book("Fictions",   "Borges",   174)
        ));

        // 5a. Natural order: uses compareTo
        Collections.sort(books);
        System.out.println("\nBy title (natural order):");
        books.forEach(x -> System.out.println("  " + x));

        // 5b. By pages, descending
        books.sort(Comparator.comparingInt(Book::getPages).reversed());
        System.out.println("\nBy pages (descending):");
        books.forEach(x -> System.out.println("  " + x));

        // 5c. By author, then by title
        books.sort(Comparator.comparing(Book::getAuthor)
                             .thenComparing(Book::getTitle));
        System.out.println("\nBy author, then by title:");
        books.forEach(x -> System.out.println("  " + x));

        // 6. The TreeSet trap
        Set<Book> tree = new TreeSet<>(books);
        System.out.println("\nBooks in the list: " + books.size());
        System.out.println("Books in the TreeSet: " + tree.size());
        System.out.println("(equal, because no two titles repeat)");

        Book sameTitleDifferentBook = new Book("1984", "Another Author", 500);
        tree.add(sameTitleDifferentBook);
        System.out.println("\nAfter adding another book titled \"1984\": " + tree.size());
        System.out.println("The TreeSet REJECTED it: to it, compareTo == 0 means duplicate,");
        System.out.println("even though equals() says they are different books.");
    }
}
```

**The most important part of this exercise is point 6.**

`equals` compares title, author, and pages. `compareTo` only looks at the title. They are **inconsistent**, and nobody minds until the object enters a `TreeSet` or a `TreeMap`: those structures **ignore `equals` entirely** and decide duplicates by `compareTo == 0`.

Result: a book that `equals` considers distinct vanishes from the set with no error, no exception, and no warning.

The fix, when the natural order must be consistent:

```java
@Override
public int compareTo(Book other) {
    int byTitle = this.title.compareTo(other.title);
    if (byTitle != 0) return byTitle;
    int byAuthor = Objects.compare(this.author, other.author,
                                   Comparator.nullsFirst(Comparator.naturalOrder()));
    if (byAuthor != 0) return byAuthor;
    return Integer.compare(this.pages, other.pages);   // never the subtraction
}
```

Now `compareTo` returns `0` exactly when `equals` returns `true`, and both families of collections agree.

</details>

---

## Key takeaways

- The `for-each` does not talk to the collection: it uses its **`Iterator`** behind the scenes.
- `ConcurrentModificationException` has nothing to do with threads: it is the iterator detecting that the collection changed from outside.
- To delete while iterating: **`removeIf(...)`**, or `iterator.remove()`.
- `Comparable` = one natural order, inside the class. `Comparator` = many orders, outside, and for classes you do not control.
- In `compareTo` only **the sign** matters, and never use `a - b`: use `Integer.compare(a, b)`.
- If you override `equals`, **override `hashCode`**. With the same fields. No exceptions.
- The correct signature is `equals(Object o)`. With `Book o` you are overloading and collections will not use it.
- `TreeSet` and `TreeMap` ignore `equals` and decide duplicates by `compareTo == 0`. Keep them consistent.
- A `record` gives you correct `equals` and `hashCode` for free.
</content>
