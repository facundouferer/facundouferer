---
course: 'java'
slug: '09-arrays-de-objetos'
title: 'Arrays of Objects: Holding and Iterating Many Instances'
description: 'Combine arrays with classes: create object arrays, avoid the NullPointerException from empty slots, iterate them, search, sort by hand with your own criterion, and manage capacity versus actual count.'
order: 10
lang: 'en'
published: true
---

# Arrays of Objects: Holding and Iterating Many Instances

In the [Arrays and String Handling in Java](/en/courses/java/04-arrays-y-strings) lesson you learned to store many values of the same type in an array. In the [OOP Fundamentals: Classes, Objects, and Attributes](/en/courses/java/07-fundamentos-poo-clases-y-objetos) and [Constructors, Access Modifiers, and Getters/Setters](/en/courses/java/07-constructores-y-encapsulamiento) lessons you learned to design a class that guarantees every object is born valid and stays consistent.

This lesson joins the two, and that intersection is where Java starts being useful for real work:

```java
Person p1 = new Person("Laura", 28);
Person p2 = new Person("Carlos", 35);
Person p3 = new Person("Ana", 41);
// and if there are 500?
```

Exactly the problem that led you to arrays in the [Arrays and String Handling in Java](/en/courses/java/04-arrays-y-strings) lesson, but now with objects. The solution is the same —an array— except for one detail that changes everything: **an array of objects does not hold objects, it holds references to objects**.

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

Notice what form C makes possible: **the validating constructor from the [Constructors, Access Modifiers, and Getters/Setters](/en/courses/java/07-constructores-y-encapsulamiento) lesson runs once per object**. If any input datum is invalid, the constructor replaces it with a safe default and logs a notice: the object is still born, just never with broken data. Without constructors you would have to create three empty objects and fill them afterwards — precisely the window of broken objects that lesson set out to close.

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
            System.out.println("Invalid name, used \"No name\" as default.");
            name = "No name";
        }
        if (age < 0 || age > 130) {
            System.out.println("Age out of range, used 0 as default.");
            age = 0;
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

- **`equalsIgnoreCase`, never `==`.** You are comparing the contents of two `String`s, and the [Arrays and String Handling in Java](/en/courses/java/04-arrays-y-strings) lesson already showed why `==` betrays you the moment the text comes from outside.
- **`p != null` first.** The order matters: evaluating `p.getName()` before the check blows up.
- **Returning `null` when absent.** That is this lesson's choice: the caller takes on the responsibility of checking the result before using it.

```java
Person found = findByName(people, "Ana");
if (found != null) {
    System.out.println("Found: " + found);
} else {
    System.out.println("Not on the roster");
}
```

> Forgetting that `if (found != null)` is the most common way to turn a "not found" into a `NullPointerException` three lines later.

---

## 6. Sorting: writing the criterion by hand

With `int[]`, `Arrays.sort(numbers)` was enough, because numbers have an obvious order. With objects there is none: are two people ordered by name, by age, by hire date? Someone has to decide, and for now that someone is you: `Arrays.sort(people)` compiles, but blows up at runtime because `Person` does not know how to compare itself.

Java has a mechanism to declare that criterion once and reuse it in any `Arrays.sort` call —you will see it in the [Iterators, Ordering, and the equals/hashCode Contract](/en/courses/java/14-iteradores-ordenamiento-equals-hashcode) lesson—. Until then, you sort by hand: walk the array and compare the chosen field with `<` and `>`, the same way you would sort an `int[]` if `Arrays.sort` did not exist.

Selection is the simplest algorithm to write by hand: on every pass you find the smallest-valued element in the rest of the array and move it to the front.

```java
public static void sortByAge(Person[] people) {
    for (int i = 0; i < people.length - 1; i++) {
        int smallestIndex = i;
        for (int j = i + 1; j < people.length; j++) {
            if (people[j].getAge() < people[smallestIndex].getAge()) {
                smallestIndex = j;
            }
        }
        if (smallestIndex != i) {
            Person temp = people[i];
            people[i] = people[smallestIndex];
            people[smallestIndex] = temp;
        }
    }
}
```

```java
sortByAge(people);
System.out.println(Arrays.toString(people));
// [Laura (28), Carlos (35), Ana (41)]
```

Notice the swap moves **references**, not objects: `temp` holds an arrow, not a copy of `Person`. Sorting an array of objects never duplicates what the slots point at.

To sort by another field —the name, for instance— you would repeat the same loop and change only the `if` condition. Repeating that loop once per criterion, with no guarantee about what happens to ties if you also need to break them by a second field, is exactly the problem the [Iterators, Ordering, and the equals/hashCode Contract](/en/courses/java/14-iteradores-ordenamiento-equals-hashcode) lesson solves: you will declare the ordering criterion once and hand it to `Arrays.sort`, without repeating the loop.

An object array with `null` inside **breaks any hand-written sort** with a `NullPointerException`, because `people[j].getAge()` blows up the moment `j` lands on an empty slot. One more reason not to leave holes.

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
<figcaption>This is the same shallow copy you saw in the [Arrays and String Handling in Java](/en/courses/java/04-arrays-y-strings) lesson, but inside a single array. Assigning one slot to another never duplicates the object.</figcaption>
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
<text x="2" y="288" font-size="12.5" fill="var(--color-text)">A class wrapping this array and this counter, exposing add/remove/get, is exactly The List ADT: Static, Dynamic, and Linked.</text>
</svg>
<figcaption>Separating <em>capacity</em> from <em>count</em> is the conceptual step that turns a loose array into a data structure. The List ADT from the [The List ADT: Static, Dynamic, and Linked](/en/courses/java/11-tad-listas-estaticas-y-dinamicas) lesson does exactly this internally.</figcaption>
</figure>

```java
public class Registry {
    private Person[] data = new Person[6];
    private int count = 0;                    // how many slots are in use

    public void add(Person p) {
        if (count == data.length) {
            // full: double the capacity (see the Arrays and String Handling in Java lesson, section 4)
            data = Arrays.copyOf(data, data.length * 2);
        }
        data[count] = p;
        count++;
    }

    public boolean remove(int index) {
        if (index < 0 || index >= count) {
            System.out.println("Invalid index: " + index);
            return false;
        }
        // shift everything to the right of it one position left
        for (int i = index; i < count - 1; i++) {
            data[i] = data[i + 1];
        }
        data[count - 1] = null;   // release the leftover reference
        count--;
        return true;
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

Those two marked lines void the encapsulation from the [Constructors, Access Modifiers, and Getters/Setters](/en/courses/java/07-constructores-y-encapsulamiento) lesson, for the same reason as section 7: the arrow is being shared.

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
- **Treating an object array as if `Arrays.sort` could order it on its own.** With objects you need to decide the comparison field and write the loop yourself.
- **Sorting an array with `null` inside.** `NullPointerException` the moment the comparison touches an empty slot.
- **Comparing objects with `==`.** That compares identity. Content needs `equals()` — its full contract arrives in the [Iterators, Ordering, and the equals/hashCode Contract](/en/courses/java/14-iteradores-ordenamiento-equals-hashcode) lesson.
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

### Exercise 3 — Sorting by age, descending

Sort a `Person[]` from oldest to youngest, without using `Arrays.sort`.

<details>
<summary>View suggested solution</summary>

```java
import java.util.Arrays;

public class SortPeople {
    public static void main(String[] args) {
        Person[] people = {
            new Person("Laura", 35),
            new Person("Ana", 41),
            new Person("Bruno", 35),
            new Person("Carlos", 28)
        };

        for (int i = 0; i < people.length - 1; i++) {
            int largestIndex = i;
            for (int j = i + 1; j < people.length; j++) {
                if (people[j].getAge() > people[largestIndex].getAge()) {
                    largestIndex = j;
                }
            }
            if (largestIndex != i) {
                Person temp = people[i];
                people[i] = people[largestIndex];
                people[largestIndex] = temp;
            }
        }

        System.out.println(Arrays.toString(people));
        // [Ana (41), Laura (35), Bruno (35), Carlos (28)]
    }
}
```

Laura and Bruno tie on age (35). This loop, written as it is, gives no guarantee about the relative order of ties —in this particular run Laura ends up before Bruno, but that is a consequence of the swaps, not a rule of the algorithm. Breaking ties predictably by a second criterion, such as name, without rewriting the whole loop every time, is exactly what you will learn to do in the [Iterators, Ordering, and the equals/hashCode Contract](/en/courses/java/14-iteradores-ordenamiento-equals-hashcode) lesson.
</details>

### Exercise 4 — An address book with dynamic capacity

Implement an `AddressBook` class that stores `Contact` objects in an internal array, grows on its own when full, and supports adding, searching by name, and removing by index.

<details>
<summary>View suggested solution</summary>

```java
import java.util.Arrays;

public class AddressBook {
    private Contact[] contacts = new Contact[4];
    private int count = 0;

    public boolean add(Contact c) {
        if (c == null) {
            System.out.println("The contact cannot be null, it was not added.");
            return false;
        }
        if (count == contacts.length) {
            contacts = Arrays.copyOf(contacts, contacts.length * 2);
        }
        contacts[count++] = c;
        return true;
    }

    public Contact find(String name) {
        for (int i = 0; i < count; i++) {
            if (contacts[i].getName().equalsIgnoreCase(name)) {
                return contacts[i];
            }
        }
        return null;
    }

    public boolean remove(int index) {
        if (index < 0 || index >= count) {
            System.out.println("Index " + index + " out of range [0, " + (count - 1) + "].");
            return false;
        }
        for (int i = index; i < count - 1; i++) {
            contacts[i] = contacts[i + 1];
        }
        contacts[--count] = null;
        return true;
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

This class is already, conceptually, a miniature dynamic list: internal array, doubling capacity, logical size separated from physical size, and shifting on removal. In the [The List ADT: Static, Dynamic, and Linked](/en/courses/java/11-tad-listas-estaticas-y-dinamicas) lesson you will formalise it as a List ADT and compare it with the linked version.
</details>

---

## Key takeaways

- An array of objects holds **references**, not objects. Everything odd about it follows from that.
- `new Person[3]` creates three `null`s. Creating the array and creating the objects are **two steps**.
- An array with empty slots is the cause of Java's most frequent `NullPointerException`.
- Override `toString()` on every class you store in an array: without it, printing tells you nothing.
- Searching is always a hand-written linear scan; if you return `null` when nothing matches, the caller must check `!= null` before using the result.
- Sorting objects demands choosing a criterion and comparing it field by field in your own loop; the [Iterators, Ordering, and the equals/hashCode Contract](/en/courses/java/14-iteradores-ordenamiento-equals-hashcode) lesson shows how to declare that criterion once and reuse it.
- Assigning one slot to another **does not copy the object**: you get two arrows to the same place.
- A class's internal array is copied on the way in and on the way out, or `private` protects nothing.
- Separating **capacity** from **count** is what turns an array into a data structure. That is the starting point of the List ADT.
