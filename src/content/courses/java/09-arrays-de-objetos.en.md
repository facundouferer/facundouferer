---
course: 'java'
slug: '09-arrays-de-objetos'
title: 'Arrays of Objects: Holding and Iterating Many Instances'
description: 'Combine arrays with classes: create object arrays, avoid the NullPointerException from empty slots, iterate them, search, sort with Comparable and Comparator, and manage capacity versus actual count.'
order: 9
lang: 'en'
published: true
---

# Arrays of Objects: Holding and Iterating Many Instances

In lesson 4 you learned to store many values of the same type in an array. In lessons 7 and 8 you learned to design a class that guarantees every object is born valid and stays consistent.

This lesson joins the two, and that intersection is where Java starts being useful for real work:

```java
Person p1 = new Person("Laura", 28);
Person p2 = new Person("Carlos", 35);
Person p3 = new Person("Ana", 41);
// and if there are 500?
```

Exactly the problem that led you to arrays in lesson 4, but now with objects. The solution is the same —an array— except for one detail that changes everything: **an array of objects does not hold objects, it holds references to objects**.

That detail is responsible for the most common `NullPointerException` in all of Java, for two slots being able to modify the same object without you noticing, and for `Arrays.sort` refusing to work until you explain how to compare. Let's take it apart.

---

## 1. An array of objects has two levels of memory

An `int[]` holds the numbers inside it. A `Person[]` holds **addresses** pointing at objects that live elsewhere on the Heap.

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-obj-mem-t">
<title id="d-obj-mem-t">An array of primitives holds the values; an array of objects holds references to external objects</title>
<defs><marker id="ar-objmem" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">int[] ages = {28, 35, 41};</text>
<rect x="0" y="34" width="240" height="56" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<rect x="12" y="44" width="68" height="36" rx="10" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="46" y="69" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">28</text>
<rect x="86" y="44" width="68" height="36" rx="10" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="120" y="69" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">35</text>
<rect x="160" y="44" width="68" height="36" rx="10" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="194" y="69" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">41</text>
<text x="258" y="58" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">One level.</text>
<text x="258" y="78" font-size="12" fill="var(--color-text)">The value sits inside the slot.</text>
<text x="2" y="126" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Person[] people = {new Person("Laura", 28), ...};</text>
<rect x="0" y="140" width="240" height="56" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<rect x="12" y="150" width="68" height="36" rx="10" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="46" y="174" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">ref</text>
<rect x="86" y="150" width="68" height="36" rx="10" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="120" y="174" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">ref</text>
<rect x="160" y="150" width="68" height="36" rx="10" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="194" y="174" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">ref</text>
<path d="M46 190 C 46 226, 300 214, 336 224" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-objmem)"/>
<path d="M120 190 C 120 240, 300 250, 336 256" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-objmem)"/>
<path d="M194 190 C 194 254, 300 286, 336 288" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-objmem)"/>
<rect x="344" y="204" width="376" height="40" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="362" y="229" font-size="13" font-weight="700" fill="var(--color-text)">Person</text>
<text x="702" y="229" font-size="12.5" text-anchor="end" fill="var(--color-neutral-800)">name="Laura"  age=28</text>
<rect x="344" y="248" width="376" height="40" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="362" y="273" font-size="13" font-weight="700" fill="var(--color-text)">Person</text>
<text x="702" y="273" font-size="12.5" text-anchor="end" fill="var(--color-neutral-800)">name="Carlos"  age=35</text>
<rect x="344" y="292" width="376" height="40" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="362" y="317" font-size="13" font-weight="700" fill="var(--color-text)">Person</text>
<text x="702" y="317" font-size="12.5" text-anchor="end" fill="var(--color-neutral-800)">name="Ana"  age=41</text>
<text x="258" y="164" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Two levels.</text>
<text x="258" y="184" font-size="12" fill="var(--color-text)">The slot only points.</text>
</svg>
<figcaption>An array of objects is an array of arrows. The objects are independent of it: the array can disappear and the objects survive, and one object can be pointed at from several slots.</figcaption>
</figure>

Three rules follow from that indirection, and they govern the rest of the lesson:

- **Creating the array does not create the objects.** That is two steps, not one.
- **Copying a slot copies the arrow, not the object.** Two slots can point at the same place.
- **A slot can point at nothing.** That "nothing" is called `null`, and it is the number-one source of errors.

---

## 2. The two steps of creation

This is the opening mistake of everyone starting with object arrays:

```java
Person[] people = new Person[3];

System.out.println(people.length);        // 3    — the array exists
System.out.println(people[0]);            // null — but it is empty
System.out.println(people[0].getName());  // NullPointerException
```

`new Person[3]` reserves **three slots capable of pointing at a `Person`**. It builds no `Person` at all. It is the difference between buying three envelopes and writing three letters.

<figure class="diagram">
<svg viewBox="0 0 720 322" role="img" aria-labelledby="d-dos-pasos-t">
<title id="d-dos-pasos-t">Creating the array and creating the objects are two distinct operations</title>
<defs><marker id="ar-pasos" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="0" width="720" height="132" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<circle cx="32" cy="34" r="16" fill="var(--color-neutral-600)"/>
<text x="32" y="40" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="60" y="30" font-size="14" font-weight="700" fill="var(--color-neutral-800)">new Person[3]</text>
<text x="60" y="49" font-size="12.5" fill="var(--color-text)">Reserves three slots. All three are null: there is no object yet.</text>
<rect x="60" y="62" width="180" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-neutral-600)" stroke-width="2" stroke-dasharray="6 5"/>
<text x="150" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">null</text>
<rect x="250" y="62" width="180" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-neutral-600)" stroke-width="2" stroke-dasharray="6 5"/>
<text x="340" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">null</text>
<rect x="440" y="62" width="180" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-neutral-600)" stroke-width="2" stroke-dasharray="6 5"/>
<text x="530" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">null</text>
<text x="640" y="92" font-size="12" font-weight="700" fill="var(--color-neutral-700)">length = 3</text>
<line x1="32" y1="136" x2="32" y2="152" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-pasos)"/>
<rect x="0" y="158" width="720" height="132" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<circle cx="32" cy="192" r="16" fill="var(--color-accent-700)"/>
<text x="32" y="198" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">2</text>
<text x="60" y="188" font-size="14" font-weight="700" fill="var(--color-accent-700)">people[i] = new Person(...)</text>
<text x="60" y="207" font-size="12.5" fill="var(--color-text)">Only now are the objects built and each slot starts pointing at one.</text>
<rect x="60" y="220" width="180" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="150" y="242" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">Laura</text>
<text x="150" y="260" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">28 years old</text>
<rect x="250" y="220" width="180" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="340" y="242" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">Carlos</text>
<text x="340" y="260" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">35 years old</text>
<rect x="440" y="220" width="180" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="530" y="242" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">Ana</text>
<text x="530" y="260" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">41 years old</text>
<text x="640" y="248" font-size="12" font-weight="700" fill="var(--color-accent-700)">length = 3</text>
<text x="2" y="312" font-size="12.5" fill="var(--color-text)">Skip step 2 for any slot and that slot stays null, blowing up the first time you use it.</text>
</svg>
<figcaption>With primitives step 2 does not exist: <code>new int[3]</code> already hands you three usable zeroes. With objects, the array is born empty and filling it is your job.</figcaption>
</figure>

The three ways to fill it:

```java
// A) Literal: array and objects in a single expression
Person[] people = {
    new Person("Laura", 28),
    new Person("Carlos", 35),
    new Person("Ana", 41)
};

// B) Slot by slot
Person[] team = new Person[3];
team[0] = new Person("Laura", 28);
team[1] = new Person("Carlos", 35);
team[2] = new Person("Ana", 41);

// C) In a loop, which is the real-world case
String[] names = {"Laura", "Carlos", "Ana"};
int[] ages = {28, 35, 41};

Person[] roster = new Person[names.length];
for (int i = 0; i < roster.length; i++) {
    roster[i] = new Person(names[i], ages[i]);
}
```

Notice what form C makes possible: **the validating constructor from lesson 8 runs once per object**. If any input datum is invalid, the object never comes into existence. Without constructors you would have to create three empty objects and fill them afterwards — precisely the window of broken objects that lesson 8 set out to close.

---

## 3. `null` in the slots: Java's most common error

A partially filled array is a time bomb:

```java
Person[] people = new Person[5];
people[0] = new Person("Laura", 28);
people[1] = new Person("Carlos", 35);
// slots 2, 3 and 4 stayed null

for (Person p : people) {
    System.out.println(p.getName());   // NullPointerException on the third pass
}
```

You have three defenses, in order of preference:

```java
// 1. Best: do not have extra slots at all
Person[] people = new Person[2];   // create exactly as many as you will fill

// 2. If you cannot, check before using
for (Person p : people) {
    if (p != null) {
        System.out.println(p.getName());
    }
}

// 3. If null should never happen, fail loudly and early
import java.util.Objects;

public void register(Person p) {
    this.person = Objects.requireNonNull(p, "The person cannot be null");
}
```

> Option 2 is a patch, not a fix. An array with `null` inside almost always means you actually needed **capacity and count as separate things** — that is section 8, and it is the doorway into the List ADT.

---

## 4. Iterating and printing

Iterating works just as with primitives, except each element now has methods.

```java
for (Person p : people) {
    System.out.println(p.getName() + " is " + p.getAge() + " years old");
}

// With an index, when you need to replace a slot's reference
for (int i = 0; i < people.length; i++) {
    if (people[i].getAge() < 18) {
        people[i] = new Person(people[i].getName(), 18);
    }
}
```

### `toString()`: without it, printing an object array is useless

```java
System.out.println(Arrays.toString(people));
// [Person@1b6d3586, Person@4554617c, Person@74a14482]
```

What you see is the `toString()` inherited from `Object`: class name, at sign, and the hash in hexadecimal. Useless. The fix is to override it in your class:

```java
public class Person {
    private final String name;
    private final int age;

    public Person(String name, int age) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        if (age < 0 || age > 130) {
            throw new IllegalArgumentException("Age out of range: " + age);
        }
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge()     { return age; }

    @Override
    public String toString() {
        return name + " (" + age + ")";
    }
}
```

```java
System.out.println(Arrays.toString(people));
// [Laura (28), Carlos (35), Ana (41)]
```

**Write `toString()` on every class you plan to put in an array.** It costs three lines and saves hours of blind debugging.

---

## 5. Searching inside an array of objects

With primitives you searched for a value. With objects you search for *the object whose field satisfies something*, and that is always a hand-written linear scan:

```java
public static Person findByName(Person[] people, String name) {
    for (Person p : people) {
        if (p != null && p.getName().equalsIgnoreCase(name)) {
            return p;      // found: stop here
        }
    }
    return null;           // scanned everything, not there
}
```

Three design decisions worth more than the code itself:

- **`equalsIgnoreCase`, never `==`.** You are comparing the contents of two `String`s, and lesson 4 already showed why `==` betrays you the moment the text comes from outside.
- **`p != null` first.** The order matters: evaluating `p.getName()` before the check blows up.
- **Returning `null` when absent** is the traditional option, but it pushes the problem onto the caller. Modern Java prefers `Optional<Person>`, which forces the "not found" case to be handled:

```java
import java.util.Optional;

public static Optional<Person> find(Person[] people, String name) {
    for (Person p : people) {
        if (p != null && p.getName().equalsIgnoreCase(name)) {
            return Optional.of(p);
        }
    }
    return Optional.empty();
}

// The caller cannot ignore the empty case:
find(people, "Ana")
    .ifPresentOrElse(
        p -> System.out.println("Found: " + p),
        () -> System.out.println("Not on the roster")
    );
```

---

## 6. Sorting: `Arrays.sort` needs you to supply the criterion

With `int[]`, `Arrays.sort(numbers)` was enough, because numbers have an obvious order. With objects there is none: are two people ordered by name, by age, by hire date?

```java
Arrays.sort(people);   // ClassCastException: Person cannot be cast to Comparable
```

Java offers two mechanisms, and the difference between them is conceptual, not technical.

<figure class="diagram">
<svg viewBox="0 0 720 318" role="img" aria-labelledby="d-comp-t">
<title id="d-comp-t">Comparable defines the natural order inside the class; Comparator defines alternative orders from outside</title>
<rect x="0" y="30" width="340" height="150" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="56" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Comparable</text>
<text x="20" y="76" font-size="12" font-weight="700" fill="var(--color-neutral-800)">The natural order, only one</text>
<text x="20" y="99" font-size="12.5" fill="var(--color-text)">Lives INSIDE the Person class.</text>
<text x="20" y="120" font-size="12.5" fill="var(--color-text)">You implement compareTo(other).</text>
<text x="20" y="141" font-size="12.5" fill="var(--color-text)">Answers: "what is THE order of this class?"</text>
<text x="20" y="166" font-size="12" font-weight="700" fill="var(--color-accent-700)">Arrays.sort(people);</text>
<rect x="380" y="30" width="340" height="150" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="400" y="56" font-size="13.5" font-weight="700" fill="var(--color-accent-2-800)">Comparator</text>
<text x="400" y="76" font-size="12" font-weight="700" fill="var(--color-neutral-800)">Alternative orders, as many as you like</text>
<text x="400" y="99" font-size="12.5" fill="var(--color-text)">Lives OUTSIDE, it is a separate object.</text>
<text x="400" y="120" font-size="12.5" fill="var(--color-text)">Built with Comparator.comparing(...).</text>
<text x="400" y="141" font-size="12.5" fill="var(--color-text)">Answers: "how do I want to sort HERE?"</text>
<text x="400" y="166" font-size="12" font-weight="700" fill="var(--color-accent-2-800)">Arrays.sort(people, byAge);</text>
<rect x="0" y="204" width="720" height="72" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="22" y="230" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Both return an int, and only its sign matters</text>
<rect x="22" y="240" width="200" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-neutral-600)"/>
<text x="122" y="258" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">negative: a comes first</text>
<rect x="234" y="240" width="200" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-neutral-600)"/>
<text x="334" y="258" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">zero: order is irrelevant</text>
<rect x="446" y="240" width="200" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-neutral-600)"/>
<text x="546" y="258" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">positive: a comes later</text>
<text x="2" y="298" font-size="12.5" fill="var(--color-text)">A class has at most ONE Comparable, but it can have as many Comparators as you need criteria.</text>
<text x="2" y="314" font-size="12" fill="var(--color-neutral-700)">Never subtract dates or large values to build that int: use Integer.compare(a, b) and avoid overflow.</text>
</svg>
<figcaption>If your class has an obvious, single order —an ID, an employee number— use <code>Comparable</code>. For everything else, one <code>Comparator</code> per criterion.</figcaption>
</figure>

### Natural order with `Comparable`

```java
public class Person implements Comparable<Person> {
    // ... fields and constructor ...

    @Override
    public int compareTo(Person other) {
        return this.name.compareToIgnoreCase(other.name);
    }
}
```

```java
Arrays.sort(people);
System.out.println(Arrays.toString(people));
// [Ana (41), Carlos (35), Laura (28)]
```

### Alternative orders with `Comparator`

```java
import java.util.Comparator;

// By age, ascending
Arrays.sort(people, Comparator.comparingInt(Person::getAge));

// By age, descending
Arrays.sort(people, Comparator.comparingInt(Person::getAge).reversed());

// By age and, on a tie, by name
Arrays.sort(people, Comparator
        .comparingInt(Person::getAge)
        .thenComparing(Person::getName));
```

> `Arrays.sort` on objects uses TimSort, which is **stable**: tied elements keep the order they were already in. That is why `thenComparing` is the correct way to break ties, and why sorting twice with different criteria is not the same as one composite criterion.

An object array with `null` inside **breaks any sort** with a `NullPointerException`, because the comparator ends up calling methods on the empty slot. One more reason not to leave holes.

---

## 7. Aliasing: the slot points, it does not contain

This is the least intuitive consequence of the two levels of memory.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-alias-t">
<title id="d-alias-t">Two slots pointing at the same object share every change</title>
<defs><marker id="ar-alias" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">team[2] = team[0];   team[2].haveBirthday();</text>
<rect x="0" y="40" width="300" height="180" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="20" y="64" font-size="12" font-weight="700" fill="var(--color-neutral-800)">team</text>
<rect x="20" y="76" width="260" height="40" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="40" y="101" font-size="13" font-weight="700" fill="var(--color-text)">[0] ref</text>
<rect x="20" y="124" width="260" height="40" rx="12" fill="var(--color-bg)" stroke="var(--color-neutral-600)"/>
<text x="40" y="149" font-size="13" font-weight="700" fill="var(--color-text)">[1] ref</text>
<rect x="20" y="172" width="260" height="40" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="40" y="197" font-size="13" font-weight="700" fill="var(--color-text)">[2] ref</text>
<path d="M282 96 L 396 118" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-alias)"/>
<path d="M282 192 L 396 138" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-alias)"/>
<path d="M282 144 L 396 208" fill="none" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-alias)"/>
<rect x="404" y="100" width="316" height="58" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="424" y="124" font-size="13.5" font-weight="700" fill="var(--color-text)">Person "Laura"</text>
<text x="424" y="146" font-size="12.5" fill="var(--color-accent-700)">age: 28 → 29   (changed only once)</text>
<rect x="404" y="186" width="316" height="46" rx="14" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="424" y="215" font-size="13" font-weight="700" fill="var(--color-text)">Person "Carlos"</text>
<text x="2" y="258" font-size="12.5" fill="var(--color-text)">team[0] and team[2] are two arrows to the SAME object. Change it through one and the other sees it: team[0].getAge() is 29.</text>
<text x="2" y="278" font-size="12.5" fill="var(--color-text)">The object originally in slot [2] is left unreferenced and the garbage collector takes it.</text>
<text x="2" y="296" font-size="12" fill="var(--color-neutral-700)">To get two independent objects you must construct a new one, not copy the reference.</text>
</svg>
<figcaption>This is the same shallow copy you saw in lesson 4, but inside a single array. Assigning one slot to another never duplicates the object.</figcaption>
</figure>

```java
Person[] team = {
    new Person("Laura", 28),
    new Person("Carlos", 35),
    new Person("Ana", 41)
};

team[2] = team[0];            // now [0] and [2] point at the SAME object
System.out.println(team[0] == team[2]);   // true
```

The same happens when copying the whole array:

```java
Person[] copy = Arrays.copyOf(team, team.length);

System.out.println(copy == team);          // false — two distinct arrays
System.out.println(copy[0] == team[0]);    // true  — they share the objects
```

A **deep copy** has to be written by hand:

```java
Person[] deep = new Person[team.length];
for (int i = 0; i < team.length; i++) {
    deep[i] = new Person(team[i].getName(), team[i].getAge());
}
```

> This problem disappears if your class is **immutable** —`final` fields and no setters, like the `Person` above. If nobody can modify the object, sharing the reference cannot do harm. It is the same reason you never suffer aliasing with `String`.

---

## 8. Capacity versus count: the partially filled array

Most of the time you do not know upfront how many objects you will store. The classic solution is to reserve extra and keep a count of how many slots are actually in use.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-cap-t">
<title id="d-cap-t">Capacity is the array's length; count is how many slots are actually occupied</title>
<defs><marker id="ar-cap" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Person[] data = new Person[6];   int count = 3;</text>
<rect x="0" y="36" width="112" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="56" y="60" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Laura</text>
<text x="56" y="78" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">[0]</text>
<rect x="118" y="36" width="112" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="174" y="60" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Carlos</text>
<text x="174" y="78" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">[1]</text>
<rect x="236" y="36" width="112" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="292" y="60" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Ana</text>
<text x="292" y="78" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">[2]</text>
<rect x="354" y="36" width="112" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="6 5"/>
<text x="410" y="60" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-700)">null</text>
<text x="410" y="78" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">[3]</text>
<rect x="472" y="36" width="112" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="6 5"/>
<text x="528" y="60" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-700)">null</text>
<text x="528" y="78" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">[4]</text>
<rect x="590" y="36" width="112" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="6 5"/>
<text x="646" y="60" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-700)">null</text>
<text x="646" y="78" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">[5]</text>
<path d="M0 102 L 348 102" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
<path d="M0 94 L 0 110" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
<path d="M348 94 L 348 110" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
<text x="14" y="128" font-size="13" font-weight="700" fill="var(--color-accent-700)">count = 3 — the part that actually exists</text>
<path d="M0 152 L 702 152" fill="none" stroke="var(--color-neutral-600)" stroke-width="3" stroke-linecap="round"/>
<path d="M0 144 L 0 160" stroke="var(--color-neutral-600)" stroke-width="3" stroke-linecap="round"/>
<path d="M702 144 L 702 160" stroke="var(--color-neutral-600)" stroke-width="3" stroke-linecap="round"/>
<text x="14" y="178" font-size="13" font-weight="700" fill="var(--color-neutral-700)">data.length = 6 — the reserved capacity</text>
<rect x="0" y="198" width="720" height="66" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="22" y="224" font-size="13" font-weight="700" fill="var(--color-accent-2-800)">Golden rule: iterate up to count, never up to data.length</text>
<text x="22" y="248" font-size="12.5" fill="var(--color-text)">for (int i = 0; i less than count; i++)  →  that way you never touch a null slot.</text>
<text x="2" y="288" font-size="12.5" fill="var(--color-text)">A class wrapping this array and this counter, exposing add/remove/get, is exactly a List ADT: lesson 13.</text>
</svg>
<figcaption>Separating <em>capacity</em> from <em>count</em> is the conceptual step that turns a loose array into a data structure. <code>ArrayList</code> does exactly this internally.</figcaption>
</figure>

```java
public class Registry {
    private Person[] data = new Person[6];
    private int count = 0;                    // how many slots are in use

    public void add(Person p) {
        if (count == data.length) {
            // full: double the capacity (lesson 4, section 4)
            data = Arrays.copyOf(data, data.length * 2);
        }
        data[count] = p;
        count++;
    }

    public void remove(int index) {
        if (index < 0 || index >= count) {
            throw new IndexOutOfBoundsException("Invalid index: " + index);
        }
        // shift everything to the right of it one position left
        for (int i = index; i < count - 1; i++) {
            data[i] = data[i + 1];
        }
        data[count - 1] = null;   // release the leftover reference
        count--;
    }

    public int getCount() {
        return count;
    }

    public void list() {
        for (int i = 0; i < count; i++) {     // up to count, not up to length
            System.out.println(data[i]);
        }
    }
}
```

Pay attention to `data[count - 1] = null;` in `remove`. Without that line the program still works, but the last slot keeps pointing at an object nobody uses any more and the garbage collector cannot free it. It is a small, silent, entirely avoidable memory leak.

---

## 9. An object array as a field: composition and defensive copies

The most frequent case is not a loose array in `main`, it is an array **inside** another class:

```java
public class Course {
    private final String name;
    private final Person[] students;

    public Course(String name, Person[] students) {
        this.name = name;
        this.students = students;        // BAD
    }

    public Person[] getStudents() {
        return students;                 // BAD
    }
}
```

Those two marked lines void the encapsulation from lesson 8, for the same reason as section 7: the arrow is being shared.

```java
Person[] list = { new Person("Laura", 28) };
Course course = new Course("Java", list);

list[0] = new Person("Intruder", 99);      // modified the array from outside
System.out.println(course.getStudents()[0]);   // Intruder (99)

course.getStudents()[0] = null;            // and through the getter too
```

The fix is to copy on the way in and on the way out:

```java
public Course(String name, Person[] students) {
    this.name = name;
    this.students = Arrays.copyOf(students, students.length);   // copy on entry
}

public Person[] getStudents() {
    return Arrays.copyOf(students, students.length);            // copy on exit
}
```

With an immutable `Person`, a shallow copy is enough: nobody can modify the objects being pointed at. If `Person` had setters, deep copies would be required to truly shield the `Course`.

---

## 10. Common mistakes

- **Believing `new Person[3]` creates three people.** It creates three `null`s.
- **Iterating up to `length` when you keep a counter.** Iterate up to `count`.
- **Not overriding `toString()`.** You print hex hashes and debug blind.
- **`Arrays.sort` with neither `Comparable` nor `Comparator`.** `ClassCastException` at runtime, not at compile time.
- **Sorting an array with `null` inside.** `NullPointerException` inside the comparator.
- **Comparing objects with `==`.** That compares identity. Content needs `equals()` — its full contract arrives in lesson 16.
- **Writing `a[i] = a[j]` believing it copies.** It copies the reference; you end up with two arrows to one object.
- **Exposing a class's internal array.** A `private` is worth nothing if the getter hands out the reference.
- **Forgetting `data[count - 1] = null` on removal.** It keeps alive a reference the GC cannot free.

---

## 11. Guided hands-on exercises

### Exercise 1 — Roster statistics

Given a `Person[]` with no `null`s, report the youngest person, the oldest, and the average age in a single pass.

<details>
<summary>View suggested solution</summary>

```java
public class Statistics {

    public static void report(Person[] people) {
        if (people == null || people.length == 0) {
            System.out.println("No people to analyse");
            return;
        }

        // Start from the first element, not from invented values
        Person youngest = people[0];
        Person oldest = people[0];
        long ageSum = 0;

        for (Person p : people) {
            if (p.getAge() < youngest.getAge()) youngest = p;
            if (p.getAge() > oldest.getAge())   oldest = p;
            ageSum += p.getAge();
        }

        double average = (double) ageSum / people.length;

        System.out.println("Youngest: " + youngest);
        System.out.println("Oldest: " + oldest);
        System.out.println("Average: %.1f years".formatted(average));
    }

    public static void main(String[] args) {
        Person[] roster = {
            new Person("Laura", 28),
            new Person("Carlos", 35),
            new Person("Ana", 41)
        };
        report(roster);
    }
}
```

Note that `youngest` holds **the reference to the object**, not the age. That way, when the scan finishes you have the whole person rather than just a number: you can print their name without searching again.
</details>

### Exercise 2 — Filter into a new array

Write a method that takes a `Person[]` and returns another array holding only the people above a given age. The result must have no leftover slots.

<details>
<summary>View suggested solution</summary>

```java
import java.util.Arrays;

public static Person[] olderThan(Person[] people, int minimumAge) {
    // 1. Reserve the maximum possible capacity
    Person[] result = new Person[people.length];
    int count = 0;

    // 2. Fill only with those who qualify
    for (Person p : people) {
        if (p != null && p.getAge() >= minimumAge) {
            result[count] = p;
            count++;
        }
    }

    // 3. Trim to the real count: without this step nulls remain at the end
    return Arrays.copyOf(result, count);
}
```

The three steps are the standard array-filtering pattern: **over-reserve, count, trim**. Step 3 is the one usually missing, and it is what stops the returned array from carrying `null`s that blow up later.

Note too that the resulting array shares its objects with the original (aliasing, section 7). For this case that is correct: filtering should not duplicate people.
</details>

### Exercise 3 — Sorting by two criteria

Sort a `Person[]` by age descending and, on equal age, by name alphabetically.

<details>
<summary>View suggested solution</summary>

```java
import java.util.Arrays;
import java.util.Comparator;

public class SortPeople {
    public static void main(String[] args) {
        Person[] people = {
            new Person("Laura", 35),
            new Person("Ana", 41),
            new Person("Bruno", 35),
            new Person("Carlos", 28)
        };

        Arrays.sort(people, Comparator
                .comparingInt(Person::getAge).reversed()
                .thenComparing(Person::getName));

        System.out.println(Arrays.toString(people));
        // [Ana (41), Bruno (35), Laura (35), Carlos (28)]
    }
}
```

Method order matters: `.reversed()` inverts **only what has accumulated up to that point**, so it applies to age and not to the name tie-breaker. Writing `.thenComparing(...).reversed()` would invert both criteria at once.

A hand-written alternative, to see what happens underneath:

```java
Arrays.sort(people, (a, b) -> {
    int byAge = Integer.compare(b.getAge(), a.getAge());   // b before a = descending
    if (byAge != 0) return byAge;
    return a.getName().compareTo(b.getName());
});
```
</details>

### Exercise 4 — An address book with dynamic capacity

Implement an `AddressBook` class that stores `Contact` objects in an internal array, grows on its own when full, and supports adding, searching by name, and removing by index.

<details>
<summary>View suggested solution</summary>

```java
import java.util.Arrays;
import java.util.Optional;

public class AddressBook {
    private Contact[] contacts = new Contact[4];
    private int count = 0;

    public void add(Contact c) {
        if (c == null) {
            throw new IllegalArgumentException("The contact cannot be null");
        }
        if (count == contacts.length) {
            contacts = Arrays.copyOf(contacts, contacts.length * 2);
        }
        contacts[count++] = c;
    }

    public Optional<Contact> find(String name) {
        for (int i = 0; i < count; i++) {
            if (contacts[i].getName().equalsIgnoreCase(name)) {
                return Optional.of(contacts[i]);
            }
        }
        return Optional.empty();
    }

    public void remove(int index) {
        if (index < 0 || index >= count) {
            throw new IndexOutOfBoundsException(
                "Index " + index + " out of range [0, " + (count - 1) + "]");
        }
        for (int i = index; i < count - 1; i++) {
            contacts[i] = contacts[i + 1];
        }
        contacts[--count] = null;
    }

    public int getCount() {
        return count;
    }

    public Contact[] list() {
        // defensive, trimmed copy: no internal references, no leftover nulls
        return Arrays.copyOf(contacts, count);
    }
}
```

This class is already, conceptually, a miniature `ArrayList`: internal array, doubling capacity, logical size separated from physical size, and shifting on removal. In lesson 13 you will formalise it as a List ADT and compare it with the linked version.
</details>

---

## Key takeaways

- An array of objects holds **references**, not objects. Everything odd about it follows from that.
- `new Person[3]` creates three `null`s. Creating the array and creating the objects are **two steps**.
- An array with empty slots is the cause of Java's most frequent `NullPointerException`.
- Override `toString()` on every class you store in an array: without it, printing tells you nothing.
- Searching is always a hand-written linear scan; return `Optional` instead of `null` where you can.
- `Arrays.sort` on objects demands a criterion: `Comparable` for the natural order, `Comparator` for the rest.
- Assigning one slot to another **does not copy the object**: you get two arrows to the same place.
- A class's internal array is copied on the way in and on the way out, or `private` protects nothing.
- Separating **capacity** from **count** is what turns an array into a data structure. That is the starting point of the List ADT.
