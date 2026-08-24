---
course: 'java'
slug: '04-arrays-y-strings'
title: 'Arrays and String Handling in Java'
description: 'Master single-dimensional arrays, matrices and jagged arrays, the java.util.Arrays utility class, the String memory model, the String Constant Pool, and StringBuilder.'
order: 4
lang: 'en'
published: true
---

# Arrays and String Handling in Java

So far you have stored data in individual variables: one age, one name, one price. That works as long as you know upfront how many values you need. But the moment you have to handle the grades of a course, the pixels of an image, or the words of a document, declaring `grade1`, `grade2`, `grade3`… stops being an option.

The **array** is the language's first data structure: a fixed-size container that holds many values of the same type under a single name. And the **String** —which looks like just another type— is really an object built on top of a character array, with one rule of its own that changes everything: it is immutable.

This lesson covers both together because they share the same foundation: **how Java lays data out in memory**. Understanding that is what later explains why `==` fails when comparing text, why concatenating inside a loop is slow, and why an array cannot grow.

![Java Array and String Memory Model Diagram](/img/courses/java/java-arrays-and-strings-memory.jpg)

---

## 1. Why arrays exist: contiguous memory and constant-time access

An **array** is a **contiguous** block of memory —a single stretch, no gaps— divided into slots of the same size. That design decision explains almost everything else.

<figure class="diagram">
<svg viewBox="0 0 720 285" role="img" aria-labelledby="d-arrmem-t">
<title id="d-arrmem-t">The array variable lives on the Stack and points to a contiguous block on the Heap</title>
<defs><marker id="ar-arrmem" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="15" font-weight="700" fill="var(--color-accent-700)">int[] ages = new int[5];</text>
<rect x="0" y="44" width="200" height="120" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="20" y="70" font-size="12" font-weight="700" fill="var(--color-neutral-800)">STACK</text>
<rect x="20" y="86" width="160" height="58" rx="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="36" y="110" font-size="13.5" font-weight="700" fill="var(--color-text)">ages</text>
<text x="36" y="131" font-size="12" fill="var(--color-neutral-700)">0x7f3a2c (reference)</text>
<path d="M182 112 C 236 112, 240 100, 286 100" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-arrmem)"/>
<rect x="292" y="44" width="428" height="120" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="312" y="70" font-size="12" font-weight="700" fill="var(--color-accent-2-800)">HEAP — one contiguous block</text>
<text x="700" y="70" font-size="12" font-weight="700" text-anchor="end" fill="var(--color-accent-2-800)">length = 5</text>
<rect x="312" y="82" width="72" height="44" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="348" y="110" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="348" y="146" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">[0]</text>
<rect x="392" y="82" width="72" height="44" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="428" y="110" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="428" y="146" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">[1]</text>
<rect x="472" y="82" width="72" height="44" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="508" y="110" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="508" y="146" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">[2]</text>
<rect x="552" y="82" width="72" height="44" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="588" y="110" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="588" y="146" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">[3]</text>
<rect x="632" y="82" width="72" height="44" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="668" y="110" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="668" y="146" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">[4]</text>
<rect x="0" y="188" width="720" height="70" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="22" y="216" font-size="14.5" font-weight="700" fill="var(--color-accent-700)">address of ages[i] = base address + i × slot size</text>
<text x="22" y="240" font-size="12.5" fill="var(--color-text)">One multiplication and one addition: reaching ages[0] costs exactly the same as reaching ages[4].</text>
<text x="2" y="278" font-size="12" fill="var(--color-neutral-700)">The index starts at 0 because it is not an ordinal number: it is the offset, in slots, from the start of the block.</text>
</svg>
<figcaption>The variable lives on the Stack and only holds a reference. The data lives on the Heap, side by side. That contiguity is where the array's three rules come from: zero-based indexing, instant access, and fixed size.</figcaption>
</figure>

Three consequences worth internalising from the start:

- **The index starts at 0** because it does not count positions, it measures *offset*. `ages[0]` sits zero slots from the beginning. That is why the last valid index is always `length - 1`.
- **Access is instant** —written O(1) in algorithm analysis. There is no searching: there is arithmetic. This property is what makes the array the foundation of nearly every other data structure.
- **The size cannot change.** Right after the block, something else lives in memory. To "grow" an array you must request a new block and copy; see section 4.

> `length` is a **field**, not a method: you write `array.length` without parentheses. On `String`, however, it *is* a method: `text.length()`. This is one of Java's historical inconsistencies and a classic source of compile errors.

---

## 2. Declaring, instantiating, and initializing

These are three different things and it pays not to blur them: **declaring** creates the variable, **instantiating** reserves the block on the Heap, **initializing** puts the values in.

```java
// Form 1: declare and instantiate empty (Java fills in default values)
int[] ages = new int[5];

// Form 2: initialization literal (the compiler infers the size)
String[] languages = {"Java", "Python", "TypeScript", "Go"};

// Form 3: anonymous instantiation (handy for passing an array to a method)
print(new int[]{10, 20, 30});

// Declare now, instantiate later
double[] prices;          // prices is null: there is no block yet
prices = new double[3];   // now the block exists
```

The `int ages[]` syntax also compiles —inherited from C— but **do not use it**. `int[] ages` says the right thing: the variable's type is *array of int*, not *int*.

### Default values on `new` instantiation

Java never leaves memory full of garbage: when it reserves the block it zeroes it out, and each type reads those zeroes its own way.

| Type | Default value |
| --- | --- |
| `byte`, `short`, `int`, `long` | `0` |
| `float`, `double` | `0.0` |
| `char` | `'\u0000'` (the null character) |
| `boolean` | `false` |
| Any reference (`String`, objects, arrays) | `null` |

This has an important practical consequence: `new String[3]` does **not** give you three empty strings, it gives you three `null`s. Iterating over it and calling `.length()` without checking ends in a `NullPointerException`.

### The two errors you will definitely see

```java
int[] data = new int[3];

data[3] = 99;   // ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
data[-1] = 99;  // ArrayIndexOutOfBoundsException: Index -1 out of bounds for length 3

int n = -5;
int[] other = new int[n];   // NegativeArraySizeException: -5
```

All three are **runtime** errors, not compile errors: the compiler cannot know what value the index will hold. Java checks the range on every access —unlike C, where writing past the end of an array silently corrupts memory. It is a small cost in exchange for the error surfacing exactly where it happened.

---

## 3. Iterating an array

```java
String[] fruits = {"Apple", "Banana", "Orange", "Strawberry"};

// A) classic for: you have the index, you can modify the array
for (int i = 0; i < fruits.length; i++) {
    System.out.println("Index " + i + ": " + fruits[i]);
}

// B) for-each: cleaner when the index does not matter
for (String fruit : fruits) {
    System.out.println("Fruit: " + fruit);
}

// C) backwards
for (int i = fruits.length - 1; i >= 0; i--) {
    System.out.println(fruits[i]);
}
```

**When to use each.** `for-each` is the default choice: it reads better and eliminates index errors entirely. But it has a limitation that surprises many people:

```java
int[] numbers = {1, 2, 3};

for (int n : numbers) {
    n = n * 2;          // does NOT modify the array: n is a copy of the value
}
System.out.println(Arrays.toString(numbers));   // [1, 2, 3]

for (int i = 0; i < numbers.length; i++) {
    numbers[i] = numbers[i] * 2;   // this DOES modify it
}
System.out.println(Arrays.toString(numbers));   // [2, 4, 6]
```

The `for-each` variable is a copy of each element, not the slot itself. Simple rule: **if you have to write into the array, you need the index**; if you only have to read it, use `for-each`.

---

## 4. The size is fixed: what to do when the array fills up

There is no `array.add(...)`. An array of 4 slots dies with 4 slots. When you need more, the only way out is to request a new block and copy the contents over.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-grow-t">
<title id="d-grow-t">An array does not grow: a bigger one is created and the elements are copied over</title>
<defs><marker id="ar-grow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="15" font-weight="700" fill="var(--color-accent-700)">int[] copy = Arrays.copyOf(data, 8);</text>
<text x="2" y="52" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">data — length 4, no free slot left</text>
<rect x="0" y="62" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="40" y="91" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">10</text>
<rect x="86" y="62" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="126" y="91" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<rect x="172" y="62" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="212" y="91" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">30</text>
<rect x="258" y="62" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="298" y="91" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">40</text>
<line x1="169" y1="116" x2="169" y2="158" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-grow)"/>
<text x="186" y="143" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">new block + element-by-element copy</text>
<text x="2" y="186" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">copy — length 8, the 4 new slots hold the default value</text>
<rect x="0" y="196" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="40" y="225" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">10</text>
<rect x="86" y="196" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="126" y="225" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<rect x="172" y="196" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="212" y="225" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">30</text>
<rect x="258" y="196" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="298" y="225" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">40</text>
<rect x="344" y="196" width="80" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="384" y="225" font-size="15" text-anchor="middle" fill="var(--color-neutral-700)">0</text>
<rect x="430" y="196" width="80" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="470" y="225" font-size="15" text-anchor="middle" fill="var(--color-neutral-700)">0</text>
<rect x="516" y="196" width="80" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="556" y="225" font-size="15" text-anchor="middle" fill="var(--color-neutral-700)">0</text>
<rect x="602" y="196" width="80" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="642" y="225" font-size="15" text-anchor="middle" fill="var(--color-neutral-700)">0</text>
<text x="2" y="270" font-size="12.5" fill="var(--color-text)">The original array is left unreferenced and the garbage collector takes it. Copying n elements costs n operations.</text>
<text x="2" y="291" font-size="12" fill="var(--color-neutral-700)">That is why ArrayList doubles its capacity instead of growing one slot at a time: the copying cost gets amortised away.</text>
</svg>
<figcaption>Growing always means copying. Doubling the capacity —rather than adding one slot— is exactly what makes <code>ArrayList</code> viable, as you will see in the collections lesson.</figcaption>
</figure>

```java
import java.util.Arrays;

int[] data = {10, 20, 30, 40};

// Option 1: Arrays.copyOf — the most readable
int[] bigger = Arrays.copyOf(data, 8);           // [10, 20, 30, 40, 0, 0, 0, 0]

// Option 2: a specific range (the end index is NOT included)
int[] middle = Arrays.copyOfRange(data, 1, 3);   // [20, 30]

// Option 3: System.arraycopy — full control over source and destination
int[] target = new int[8];
System.arraycopy(data, 0, target, 0, data.length);
//               source, from, target, to, how many
```

This manual work is precisely what `ArrayList` saves you. But it is worth doing by hand once: it is the only way to understand why adding to a list is sometimes instant and sometimes not.

---

## 5. Arrays of primitives vs. arrays of objects

The difference matters far more than it looks.

```java
int[] numbers = new int[3];     // 3 slots holding the value 0
String[] names = new String[3]; // 3 slots holding the reference null

System.out.println(numbers[0]);        // 0
System.out.println(names[0]);          // null
System.out.println(names[0].length()); // NullPointerException
```

An array of primitives **holds the values**. An array of objects **holds references**: the objects live elsewhere on the Heap and the array only stores their addresses. That explains how copies behave:

```java
StringBuilder[] original = { new StringBuilder("Hello") };
StringBuilder[] copy = Arrays.copyOf(original, 1);

copy[0].append(" world");

System.out.println(original[0]);               // "Hello world"  ← it changed too!
System.out.println(original[0] == copy[0]);    // true
```

`Arrays.copyOf` performs a **shallow copy**: it duplicates the array of references, not the objects they point at. The two arrays are distinct, but they point at the same objects. If you need genuine independence —a **deep copy**— you have to clone each element yourself.

With `String` this problem never shows up, and the reason is section 8: `String`s are immutable, so sharing a reference cannot do any harm.

---

## 6. Matrices and jagged arrays

Java **has no matrix type**. What it has is an array whose elements are themselves arrays.

<figure class="diagram">
<svg viewBox="0 0 720 322" role="img" aria-labelledby="d-matrix-t">
<title id="d-matrix-t">A matrix in Java is an array of references to other arrays, which may have different lengths</title>
<defs><marker id="ar-matrix" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="15" font-weight="700" fill="var(--color-accent-700)">int[][] data = new int[3][];</text>
<rect x="0" y="40" width="170" height="222" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="18" y="64" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">data — outer array</text>
<rect x="18" y="76" width="134" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="34" y="106" font-size="13.5" font-weight="700" fill="var(--color-text)">[0] ref</text>
<rect x="18" y="132" width="134" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="34" y="162" font-size="13.5" font-weight="700" fill="var(--color-text)">[1] ref</text>
<rect x="18" y="188" width="134" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="34" y="218" font-size="13.5" font-weight="700" fill="var(--color-text)">[2] ref</text>
<text x="18" y="254" font-size="11.5" fill="var(--color-neutral-800)">data.length = 3</text>
<path d="M154 100 L 272 100" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-matrix)"/>
<path d="M154 156 L 272 156" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-matrix)"/>
<path d="M154 212 L 272 212" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-matrix)"/>
<rect x="280" y="76" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="315" y="106" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">1</text>
<rect x="356" y="76" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="391" y="106" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">2</text>
<rect x="432" y="76" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="467" y="106" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">3</text>
<text x="718" y="106" font-size="12" font-weight="700" text-anchor="end" fill="var(--color-accent-2-800)">length 3</text>
<rect x="280" y="132" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="315" y="162" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">4</text>
<rect x="356" y="132" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="391" y="162" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">5</text>
<rect x="432" y="132" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="467" y="162" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">6</text>
<rect x="508" y="132" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="543" y="162" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">7</text>
<rect x="584" y="132" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="619" y="162" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">8</text>
<text x="718" y="162" font-size="12" font-weight="700" text-anchor="end" fill="var(--color-accent-2-800)">length 5</text>
<rect x="280" y="188" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="315" y="218" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">9</text>
<rect x="356" y="188" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="391" y="218" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="718" y="218" font-size="12" font-weight="700" text-anchor="end" fill="var(--color-accent-2-800)">length 2</text>
<text x="2" y="288" font-size="12.5" fill="var(--color-text)">Each row is an independent array object with its own length. That is why the inner loop uses data[row].length.</text>
<text x="2" y="309" font-size="12" fill="var(--color-neutral-700)">A rectangular matrix is simply the special case where every row happened to be created at the same size.</text>
</svg>
<figcaption>An <code>int[][]</code> is an array of references. The rows live separately on the Heap, so nothing forces them to be the same size: that is a <em>jagged array</em>.</figcaption>
</figure>

```java
// Rectangular matrix: 3 rows x 3 columns
int[][] grid = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Iteration with nested loops
for (int row = 0; row < grid.length; row++) {
    for (int col = 0; col < grid[row].length; col++) {   // ← length of THAT row
        System.out.print(grid[row][col] + " ");
    }
    System.out.println();
}

// Nested for-each (when you do not need the indices)
for (int[] row : grid) {
    for (int value : row) {
        System.out.print(value + " ");
    }
    System.out.println();
}
```

A jagged array, where each row has its own size:

```java
int[][] data = new int[3][];      // only the outer array; the rows stay null
data[0] = new int[]{1, 2, 3};
data[1] = new int[]{4, 5, 6, 7, 8};
data[2] = new int[]{9, 0};

System.out.println(data[1].length);   // 5
```

Writing `grid[row].length` instead of `grid[0].length` is not a stylistic detail: it is what makes the same loop work for both rectangular and jagged arrays.

> To print a whole matrix, `Arrays.toString()` is not enough: it shows you the memory addresses of the rows. Use **`Arrays.deepToString(grid)`**.

---

## 7. `java.util.Arrays`: the tool belt

Almost nothing you need to do with an array has to be written by hand. `java.util.Arrays` already has it.

| Method | What it does |
| --- | --- |
| `Arrays.toString(a)` | Readable representation of a one-dimensional array |
| `Arrays.deepToString(m)` | The same for matrices and nested arrays |
| `Arrays.sort(a)` | Sorts **modifying the original array** (in place) |
| `Arrays.sort(a, from, to)` | Sorts only a range |
| `Arrays.binarySearch(a, v)` | Binary search — **requires an already sorted array** |
| `Arrays.copyOf(a, n)` | Resized copy |
| `Arrays.copyOfRange(a, f, t)` | Copy of a range, `t` excluded |
| `Arrays.fill(a, v)` | Fills every slot with a value |
| `Arrays.equals(a, b)` | Compares the **contents** of one-dimensional arrays |
| `Arrays.deepEquals(m, n)` | Compares the contents of nested arrays |
| `Arrays.stream(a)` | Turns the array into a stream to sum, filter, average |

```java
import java.util.Arrays;

public class ArraysExample {
    public static void main(String[] args) {
        int[] numbers = {42, 12, 89, 7, 23};

        System.out.println("Original: " + Arrays.toString(numbers));

        Arrays.sort(numbers);                        // sorts the original array
        System.out.println("Sorted: " + Arrays.toString(numbers));   // [7, 12, 23, 42, 89]

        int index = Arrays.binarySearch(numbers, 23);
        System.out.println("Index of 23: " + index);                 // 2

        int[] copy = Arrays.copyOf(numbers, 3);
        System.out.println("Copy: " + Arrays.toString(copy));        // [7, 12, 23]

        int[] zeros = new int[5];
        Arrays.fill(zeros, -1);
        System.out.println(Arrays.toString(zeros));                  // [-1, -1, -1, -1, -1]

        // Statistics without writing a single loop
        System.out.println("Sum: " + Arrays.stream(numbers).sum());
        System.out.println("Max: " + Arrays.stream(numbers).max().getAsInt());
        System.out.println("Average: " + Arrays.stream(numbers).average().getAsDouble());
    }
}
```

### Two traps worth knowing

**1. `==` is no good for comparing arrays either.** It compares references, just like with any object:

```java
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};

System.out.println(a == b);                // false — two distinct blocks
System.out.println(a.equals(b));           // false — an array does not override equals
System.out.println(Arrays.equals(a, b));   // true  — this is the right one
```

**2. `binarySearch` on an unsorted array silently returns garbage.** It throws nothing, warns about nothing: it just returns a meaningless number, because the algorithm assumes the array is sorted. Always sort before searching.

---

## 8. Strings: why they are immutable

A `String` is an object wrapping a sequence of characters. Its central rule is that **once created, its contents never change**. No `String` method modifies the original string: they all return a new one.

<figure class="diagram">
<svg viewBox="0 0 720 250" role="img" aria-labelledby="d-immut-t">
<title id="d-immut-t">Concatenating does not modify the original String: it creates a new one and abandons the old</title>
<defs><marker id="ar-immut" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="15" font-weight="700" fill="var(--color-accent-700)">String greeting = "Hel";   greeting = greeting + "lo";</text>
<text x="2" y="48" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">BEFORE</text>
<rect x="0" y="58" width="150" height="52" rx="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="90" font-size="13.5" font-weight="700" fill="var(--color-text)">greeting</text>
<path d="M152 84 L 224 84" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-immut)"/>
<rect x="232" y="58" width="190" height="52" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="327" y="90" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">"Hel"</text>
<text x="2" y="146" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">AFTER</text>
<rect x="0" y="156" width="150" height="52" rx="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="188" font-size="13.5" font-weight="700" fill="var(--color-text)">greeting</text>
<path d="M152 182 L 224 182" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-immut)"/>
<rect x="232" y="156" width="190" height="52" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="327" y="188" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">"Hello"</text>
<text x="440" y="150" font-size="12" font-weight="700" fill="var(--color-neutral-700)">the previous object is still on the Heap:</text>
<rect x="440" y="156" width="280" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-width="2" stroke-dasharray="6 5"/>
<text x="580" y="180" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">"Hel"</text>
<text x="580" y="198" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-700)">unreferenced — the GC takes it</text>
<text x="2" y="236" font-size="12.5" fill="var(--color-text)">The variable changed target; the object "Hel" never changed. That is immutability: the reference is replaced, not the contents.</text>
</svg>
<figcaption>The <code>=</code> sign reassigns the <em>variable</em>. The original object stays untouched and, if nothing else points at it, becomes garbage.</figcaption>
</figure>

```java
String text = "hello";
text.toUpperCase();                   // returns "HELLO", but it is discarded
System.out.println(text);             // "hello" — nothing changed

String upper = text.toUpperCase();    // this is the way: keep the result
System.out.println(upper);            // "HELLO"
```

Forgetting the assignment is the number-one `String` mistake. Since the method neither fails nor warns, the program keeps running with the old value.

**Why did Java make this decision?** It is not arbitrary:

- **Security.** File paths, URLs, and credentials travel as `String`. If they were mutable, a method you handed an already-validated path to could change it after validation.
- **Concurrency.** An object that never changes can be shared across threads with no synchronization at all.
- **Hashing performance.** `String` computes its `hashCode()` once and caches it. That is what makes strings fast as `HashMap` keys.
- **Reuse.** Since nobody can modify them, the JVM can share one object across many variables. That is the pool.

---

## 9. The String Constant Pool and the `==` trap

To avoid duplicating identical strings, the JVM maintains a special area inside the Heap called the **String Constant Pool**. When you write a quoted literal, the JVM looks in the pool first and reuses the object if it is already there.

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-pool-t">
<title id="d-pool-t">Literals share one object in the String Constant Pool; new String always creates a fresh one</title>
<defs><marker id="ar-pool" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">String s1 = "Java";   String s2 = "Java";   String s3 = new String("Java");</text>
<rect x="0" y="40" width="190" height="212" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="18" y="64" font-size="12" font-weight="700" fill="var(--color-neutral-800)">STACK</text>
<rect x="18" y="76" width="154" height="46" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="36" y="105" font-size="14" font-weight="700" fill="var(--color-text)">s1</text>
<rect x="18" y="132" width="154" height="46" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="36" y="161" font-size="14" font-weight="700" fill="var(--color-text)">s2</text>
<rect x="18" y="188" width="154" height="46" rx="12" fill="var(--color-bg)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<text x="36" y="217" font-size="14" font-weight="700" fill="var(--color-text)">s3</text>
<rect x="222" y="40" width="498" height="212" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="242" y="64" font-size="12" font-weight="700" fill="var(--color-neutral-800)">HEAP</text>
<rect x="242" y="76" width="458" height="86" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="262" y="98" font-size="12" font-weight="700" fill="var(--color-accent-700)">STRING CONSTANT POOL</text>
<rect x="262" y="106" width="418" height="44" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="284" y="134" font-size="15" font-weight="700" fill="var(--color-text)">"Java"</text>
<text x="660" y="134" font-size="12" text-anchor="end" fill="var(--color-neutral-800)">a single shared object</text>
<rect x="242" y="180" width="458" height="54" rx="16" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<text x="264" y="204" font-size="15" font-weight="700" fill="var(--color-text)">"Java"</text>
<text x="678" y="204" font-size="12" text-anchor="end" fill="var(--color-neutral-800)">new object, outside the pool</text>
<text x="264" y="223" font-size="11.5" fill="var(--color-neutral-700)">created by new: same contents, different identity</text>
<path d="M174 96 L 254 118" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-pool)"/>
<path d="M174 152 L 254 138" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-pool)"/>
<path d="M174 210 L 234 207" fill="none" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-pool)"/>
<text x="2" y="286" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">s1 == s2 → true</text>
<text x="240" y="286" font-size="13.5" font-weight="700" fill="var(--color-neutral-700)">s1 == s3 → false</text>
<text x="470" y="286" font-size="13.5" font-weight="700" fill="var(--color-accent-2-800)">s1.equals(s3) → true</text>
<text x="2" y="312" font-size="12.5" fill="var(--color-text)">== answers "are these the same object?".  equals() answers "do these say the same thing?".  You almost always want the second.</text>
<text x="2" y="332" font-size="12" fill="var(--color-neutral-700)">new String("Java") is, for that very reason, code to avoid: it spends memory on a duplicate you never need.</text>
</svg>
<figcaption>The pool is why <code>==</code> sometimes "seems to work" with strings. It works by coincidence, and stops working the moment the string is built at runtime.</figcaption>
</figure>

```java
String s1 = "Java";
String s2 = "Java";
String s3 = new String("Java");

System.out.println(s1 == s2);       // true  — same reference from the pool
System.out.println(s1 == s3);       // false — new always creates a separate object
System.out.println(s1.equals(s3));  // true  — compares the contents
```

And the case that convinces anyone never to use `==`:

```java
String a = "Java";
String b = "Ja" + "va";                    // the compiler folds it: goes to the pool
System.out.println(a == b);                // true

String part = "Ja";
String c = part + "va";                    // built at runtime: a new object
System.out.println(a == c);                // false  ← same text, different object
System.out.println(a.equals(c));           // true
```

> **Golden rule:** to compare the **contents** of two strings, always use `.equals()` or `.equalsIgnoreCase()`. `==` compares object identity and will betray you the moment the string comes from a file, from the console, or from a concatenation.

**A defensive trick against `NullPointerException`:** if either side could be `null`, put the literal on the left.

```java
String input = null;

input.equals("quit");   // NullPointerException
"quit".equals(input);   // false — safe
```

---

## 10. Walking and slicing text: it is all about indices

A `String` is indexed just like an array, from `0` to `length() - 1`.

<figure class="diagram">
<svg viewBox="0 0 720 212" role="img" aria-labelledby="d-idx-t">
<title id="d-idx-t">String indices and how substring works with an excluded end index</title>
<text x="2" y="20" font-size="15" font-weight="700" fill="var(--color-accent-700)">String t = "Java 2026";</text>
<rect x="28" y="38" width="64" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="60" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">J</text>
<text x="60" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">0</text>
<rect x="98" y="38" width="64" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="130" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">a</text>
<text x="130" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">1</text>
<rect x="168" y="38" width="64" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="200" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">v</text>
<text x="200" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">2</text>
<rect x="238" y="38" width="64" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="270" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">a</text>
<text x="270" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">3</text>
<rect x="308" y="38" width="64" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="340" y="70" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-700)">space</text>
<text x="340" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">4</text>
<rect x="378" y="38" width="64" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="410" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">2</text>
<text x="410" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">5</text>
<rect x="448" y="38" width="64" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="480" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="480" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">6</text>
<rect x="518" y="38" width="64" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="550" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">2</text>
<text x="550" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">7</text>
<rect x="588" y="38" width="64" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="620" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">6</text>
<text x="620" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">8</text>
<path d="M28 140 L 302 140" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
<path d="M28 132 L 28 148" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
<path d="M302 132 L 302 148" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
<text x="318" y="138" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">t.substring(0, 4) → "Java"</text>
<text x="318" y="158" font-size="12.5" fill="var(--color-text)">the start index is included, the end index is NOT</text>
<text x="2" y="186" font-size="12.5" fill="var(--color-text)">t.length() is 9, but the last valid index is 8. t.charAt(9) throws StringIndexOutOfBoundsException.</text>
<text x="2" y="204" font-size="12" fill="var(--color-neutral-700)">That same "start inclusive, end exclusive" rule reappears in copyOfRange, in subList, and across most of the Java library.</text>
</svg>
<figcaption>The <em>start inclusive / end exclusive</em> pair is a convention of the whole standard library. Learn it once and it serves <code>substring</code>, <code>copyOfRange</code>, <code>subList</code>, and the <code>Stream</code> API.</figcaption>
</figure>

### Essential `String` methods

| Method | Returns |
| --- | --- |
| `length()` | Number of characters |
| `charAt(i)` | The character at position `i` |
| `substring(f, t)` | The fragment from `f` to `t - 1` |
| `indexOf(s)` / `lastIndexOf(s)` | First / last position of `s`, or `-1` if absent |
| `contains(s)` | `true` if `s` occurs in the string |
| `startsWith(s)` / `endsWith(s)` | `true` if it starts / ends with `s` |
| `toUpperCase()` / `toLowerCase()` | A copy in upper / lower case |
| `trim()` / `strip()` | A copy without leading and trailing whitespace |
| `isEmpty()` / `isBlank()` | Whether it has length 0 / only whitespace |
| `replace(a, b)` | A copy with `a` replaced by `b` |
| `split(regex)` | A `String[]` split by the separator |
| `String.join(sep, parts)` | Joins several strings with a separator |
| `repeat(n)` | The string repeated `n` times |
| `toCharArray()` | A `char[]` with the characters |

```java
String text = "  Learning Java in 2026  ";

System.out.println(text.length());              // 25
System.out.println(text.trim());                // "Learning Java in 2026"
System.out.println(text.toUpperCase());         // "  LEARNING JAVA IN 2026  "
System.out.println(text.contains("Java"));      // true
System.out.println(text.indexOf("Java"));       // 11
System.out.println(text.substring(11, 15));     // "Java"
System.out.println(text.replace("2026", "2027"));

// Split and join back
String csv = "Buenos Aires,Neuquén,Córdoba,Salta";
String[] provinces = csv.split(",");
System.out.println(provinces.length);           // 4
System.out.println(String.join(" | ", provinces));

// Walk character by character
String word = "Java";
for (int i = 0; i < word.length(); i++) {
    System.out.println(i + ": " + word.charAt(i));
}
for (char c : word.toCharArray()) {
    System.out.println(c);
}
```

### `trim()` vs `strip()`, `isEmpty()` vs `isBlank()`

```java
String s = "      ";

System.out.println(s.isEmpty());   // false — it has 6 characters
System.out.println(s.isBlank());   // true  — they are all whitespace
```

`strip()` (Java 11+) is the modern version of `trim()`: it understands the full range of Unicode whitespace, whereas `trim()` only removes characters below `U+0020`. In new code, use `strip()` and `isBlank()`.

### Formatting and interpolation

```java
String name = "Laura";
double average = 8.457;

// Plain concatenation
System.out.println("Student: " + name + " — average " + average);

// formatted / String.format: control over decimals and width
System.out.println("Student: %s — average %.2f".formatted(name, average));
// Student: Laura — average 8.46

// Text blocks (Java 15+): line breaks without escapes
String json = """
        {
          "name": "Laura",
          "average": 8.46
        }
        """;
```

---

## 11. `StringBuilder`: when immutability gets expensive

Immutability has a price, and you pay it inside loops. Every `+=` on a `String` creates a new object and copies everything accumulated so far.

<figure class="diagram">
<svg viewBox="0 0 720 318" role="img" aria-labelledby="d-sb-t">
<title id="d-sb-t">Concatenating Strings in a loop copies everything on each pass; StringBuilder reuses one buffer</title>
<rect x="0" y="40" width="340" height="232" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="20" y="68" font-size="14" font-weight="700" fill="var(--color-accent-700)">result += i;</text>
<text x="20" y="88" font-size="11.5" fill="var(--color-neutral-800)">one new object per pass</text>
<rect x="20" y="98" width="60" height="24" rx="8" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="90" y="115" font-size="11.5" fill="var(--color-neutral-800)">pass 1 — copies 1 character</text>
<rect x="20" y="128" width="110" height="24" rx="8" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="140" y="145" font-size="11.5" fill="var(--color-neutral-800)">pass 2 — copies 2</text>
<rect x="20" y="158" width="160" height="24" rx="8" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="190" y="175" font-size="11.5" fill="var(--color-neutral-800)">pass 3 — copies 3</text>
<rect x="20" y="188" width="210" height="24" rx="8" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="240" y="205" font-size="11.5" fill="var(--color-neutral-800)">pass 4 — copies 4</text>
<text x="20" y="234" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">… and so on 996 more times</text>
<text x="20" y="256" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">1000 objects and ~500,000 copies</text>
<rect x="380" y="40" width="340" height="232" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="400" y="68" font-size="14" font-weight="700" fill="var(--color-accent-2-800)">sb.append(i);</text>
<text x="400" y="88" font-size="11.5" fill="var(--color-neutral-800)">one mutable buffer being filled in</text>
<rect x="400" y="98" width="290" height="42" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<rect x="404" y="102" width="120" height="34" rx="9" fill="var(--color-accent-2-600)"/>
<text x="464" y="124" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">used</text>
<text x="610" y="124" font-size="12" text-anchor="middle" fill="var(--color-neutral-800)">free</text>
<text x="400" y="166" font-size="11.5" fill="var(--color-neutral-800)">when it fills up, the capacity doubles:</text>
<rect x="400" y="176" width="66" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="433" y="194" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">16</text>
<rect x="476" y="176" width="66" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="509" y="194" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">32</text>
<rect x="552" y="176" width="66" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="585" y="194" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">64</text>
<rect x="628" y="176" width="62" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="659" y="194" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">128</text>
<text x="400" y="234" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">copying happens only on resize</text>
<text x="400" y="256" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">1 object and ~7 resizes</text>
<text x="2" y="294" font-size="12.5" fill="var(--color-text)">At 1,000 passes the difference is milliseconds; at 100,000, it is minutes versus milliseconds.</text>
<text x="2" y="312" font-size="12" fill="var(--color-neutral-700)">The left loop's cost grows with the square of the number of passes; the right one's grows proportionally.</text>
</svg>
<figcaption>The difference is not stylistic, it is an order of magnitude. Concatenating in a loop copies the whole accumulated string on every pass; <code>StringBuilder</code> writes into a buffer and only copies when it runs out of capacity.</figcaption>
</figure>

```java
// INEFFICIENT: 1000 temporary objects and half a million characters copied
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i + ", ";
}

// EFFICIENT: one mutable buffer
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(", ");
}
String efficientResult = sb.toString();
```

### The `StringBuilder` API

```java
StringBuilder sb = new StringBuilder("Hello");

sb.append(" world");            // "Hello world"
sb.insert(0, ">> ");            // ">> Hello world"
sb.replace(0, 3, "-- ");        // "-- Hello world"
sb.deleteCharAt(0);             // "- Hello world"
sb.reverse();                   // "dlrow olleH -"
System.out.println(sb.length());
System.out.println(sb.toString());   // convert to String at the end

// Chaining: every method returns the same StringBuilder
String phrase = new StringBuilder()
        .append("Java")
        .append(" ")
        .append(2026)
        .toString();
```

If you roughly know how much text you will accumulate, reserve the capacity upfront and skip every resize: `new StringBuilder(4096)`.

### When you do NOT need `StringBuilder`

The compiler already optimizes concatenation inside **a single expression**. This is perfectly fine as is:

```java
String message = "Hi " + name + ", you have " + count + " messages";
```

The problem only appears when concatenation is **repeated across several iterations**, because there the compiler cannot fuse them: each pass is a separate expression.

### `StringBuilder` vs `StringBuffer`

They are the same class with the same API. `StringBuffer` is the older, **synchronized** version: every method is thread-safe, and that is why it is slower. Use `StringBuilder` unless several threads will write into the same buffer, which almost never happens.

---

## 12. Common mistakes

- **Confusing `length` with `length()`.** `array.length` is a field; `text.length()` is a method.
- **Comparing strings with `==`.** It works with literals and fails with everything else. Use `.equals()`.
- **Forgetting to assign the result.** `text.trim();` does nothing; `text = text.trim();` does.
- **Iterating up to `<= length`.** The last valid index is `length - 1`.
- **Calling `binarySearch` without sorting.** It does not fail: it silently returns a wrong result.
- **Expecting `Arrays.copyOf` to clone objects.** It copies references, not objects.
- **Printing a matrix with `toString`.** For nested arrays you need `deepToString`.
- **Iterating a `String[]` freshly created with `new`.** Every slot is `null` until you fill it.
- **Concatenating inside a long loop.** There `StringBuilder` is not a preference, it is a necessity.

---

## 13. Guided hands-on exercises

### Exercise 1 — Palindrome checker

Write a program that takes a string, ignores whitespace and case, and decides whether it reads the same in both directions.

<details>
<summary>View suggested solution</summary>

```java
public class PalindromeChecker {

    public static boolean isPalindrome(String text) {
        if (text == null) return false;

        // 1. Normalize: no spaces, all lowercase
        String clean = text.replaceAll("\\s+", "").toLowerCase();

        // 2. Compare from both ends towards the middle
        int left = 0;
        int right = clean.length() - 1;
        while (left < right) {
            if (clean.charAt(left) != clean.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("Racecar"));           // true
        System.out.println(isPalindrome("Never odd or even")); // true
        System.out.println(isPalindrome("Java"));              // false
    }
}
```

The short version uses `StringBuilder`:

```java
String clean = text.replaceAll("\\s+", "").toLowerCase();
String reversed = new StringBuilder(clean).reverse().toString();
boolean isPalindrome = clean.equals(reversed);
```

Both are correct, but they do not cost the same: the two-pointer version creates no new string and bails out at the first mismatch; the `StringBuilder` one always walks and reverses the entire text. With short strings it makes no difference; with large ones it does.
</details>

### Exercise 2 — Array statistics

Given an `int[]`, compute the minimum, maximum, and average in **a single pass**, without using `Arrays.sort`.

<details>
<summary>View suggested solution</summary>

```java
public class Statistics {
    public static void main(String[] args) {
        int[] temperatures = {18, 25, 12, 31, 22, 9, 27};

        if (temperatures.length == 0) {
            System.out.println("The array is empty");
            return;
        }

        // Start from the first element, never from 0:
        // if every value were negative, the maximum would come out as 0 and be wrong.
        int min = temperatures[0];
        int max = temperatures[0];
        long sum = 0;

        for (int t : temperatures) {
            if (t < min) min = t;
            if (t > max) max = t;
            sum += t;
        }

        double average = (double) sum / temperatures.length;

        System.out.println("Min: " + min);                        // 9
        System.out.println("Max: " + max);                        // 31
        System.out.println("Average: %.2f".formatted(average));   // 20.57
    }
}
```

Two details that matter: initialising `min` and `max` from `temperatures[0]` rather than `0`, and the `(double)` cast before dividing —without it, `sum / length` would be integer division and you would lose the decimals.
</details>

### Exercise 3 — Count words and find the longest

Given a text, report how many words it has and which one is the longest.

<details>
<summary>View suggested solution</summary>

```java
public class TextAnalyzer {
    public static void main(String[] args) {
        String text = "  Java  is a compiled   and interpreted language  ";

        // strip() removes leading and trailing whitespace;
        // \\s+ splits on one or more spaces, so double spaces do not produce
        // empty words.
        String[] words = text.strip().split("\\s+");

        String longest = "";
        for (String word : words) {
            if (word.length() > longest.length()) {
                longest = word;
            }
        }

        System.out.println("Words: " + words.length);       // 7
        System.out.println("Longest: " + longest);          // interpreted

        // Rebuild the normalized text
        System.out.println(String.join(" ", words));
    }
}
```

If you split with `split(" ")` instead of `split("\\s+")`, double spaces would produce empty strings and the count would be wrong. That is why splitting on the regular expression is almost always the right call.
</details>

### Exercise 4 — Transpose a matrix

Write a method that takes a rectangular `int` matrix and returns its transpose (rows become columns).

<details>
<summary>View suggested solution</summary>

```java
import java.util.Arrays;

public class Transpose {

    public static int[][] transpose(int[][] m) {
        int rows = m.length;
        int columns = m[0].length;

        // The transpose swaps the dimensions
        int[][] t = new int[columns][rows];

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                t[j][i] = m[i][j];
            }
        }
        return t;
    }

    public static void main(String[] args) {
        int[][] original = {
            {1, 2, 3},
            {4, 5, 6}
        };

        System.out.println(Arrays.deepToString(original));
        // [[1, 2, 3], [4, 5, 6]]

        System.out.println(Arrays.deepToString(transpose(original)));
        // [[1, 4], [2, 5], [3, 6]]
    }
}
```

Note that the output array is declared `new int[columns][rows]`, not `new int[rows][columns]`: it is the most common mistake in this exercise and it shows up as an `ArrayIndexOutOfBoundsException` as soon as the matrix is not square.
</details>

---

## Key takeaways

- An array stores its elements in a **contiguous block**: that is where zero-based indexing, instant access, and the fixed size come from.
- `array.length` is a field; `text.length()` is a method. The last valid index is always `length - 1`.
- An array does not grow: growing means **creating a new one and copying**. That is exactly what `ArrayList` automates.
- Arrays of objects hold **references**: `Arrays.copyOf` makes a shallow copy, not a deep one.
- A matrix is an **array of arrays**. Its rows are independent objects and may differ in length.
- `Arrays` already solves sorting, searching, copying, filling, and comparing. `binarySearch` requires sorting first.
- `String` is **immutable**: no method modifies it, they all return a new string you have to assign.
- The **String Constant Pool** is why `==` sometimes appears to work. Contents are compared with `.equals()`, always.
- `StringBuilder` is mandatory when you concatenate **inside a loop**; within a single expression the compiler already handles it for you.
