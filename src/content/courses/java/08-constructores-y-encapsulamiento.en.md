---
course: 'java'
slug: '07-constructores-y-encapsulamiento'
title: 'Constructors, Access Modifiers, and Getters/Setters'
description: 'Learn how to guarantee every object is born valid using constructors, overloading, and this(), then shield its internal state with encapsulation, access modifiers, and defensive copies.'
order: 8
lang: 'en'
published: true
---

# Constructors, Access Modifiers, and Getters/Setters

In the previous lesson you created objects like this:

```java
Person p1 = new Person();
p1.name = "Laura";
p1.age = 28;
```

It works, but it hides a serious problem: **between line 1 and line 3 there is a broken object**. A `Person` with no name and an age of `0` is an object the class happily allows you to create even though it represents nobody. And if someone forgets line 2, that invalid object travels through the whole program until it blows up somewhere far away, where the failure no longer resembles its cause.

This lesson solves exactly that, with two tools that work together:

- **Constructors** guarantee an object is born complete and valid. There is no window of time in which it exists half-assembled.
- **Encapsulation** guarantees that, once born valid, nothing outside can make it invalid.

---

## 1. The constructor: the only moment an object is born

A **constructor** is a special block of code the JVM runs automatically during `new`, and only then. You recognize it by two syntactic rules:

1. It is named **exactly like the class** (capitalization included).
2. It declares **no return type**. Not `void`, not `int`, nothing.

```java
public class Product {
    private String name;
    private double price;

    // Constructor: same name as the class, no return type
    public Product(String name, double price) {
        this.name = name;
        this.price = price;
    }
}
```

### What actually happens when you run `new`

The constructor is not the first step of `new` — it is the fourth. Understanding the full order explains why a field can hold `0` even when your constructor assigns something else to it.

<figure class="diagram">
<svg viewBox="0 0 720 500" role="img" aria-labelledby="d-new-t">
<title id="d-new-t">The five stages the JVM runs when evaluating the new operator</title>
<defs><marker id="ar-new" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="22" font-size="15" font-weight="700" fill="var(--color-accent-700)">Product p = new Product("Yerba", 3200);</text>
<rect x="0" y="40" width="720" height="72" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<circle cx="34" cy="76" r="17" fill="var(--color-accent)"/>
<text x="34" y="82" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="68" y="70" font-size="15" font-weight="700" fill="var(--color-accent-700)">Heap allocation</text>
<text x="68" y="93" font-size="13" fill="var(--color-text)">The JVM reserves a memory block sized for every declared field.</text>
<line x1="34" y1="115" x2="34" y2="125" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-new)"/>
<rect x="0" y="128" width="720" height="72" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<circle cx="34" cy="164" r="17" fill="var(--color-accent)"/>
<text x="34" y="170" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">2</text>
<text x="68" y="158" font-size="15" font-weight="700" fill="var(--color-accent-700)">Default values</text>
<text x="68" y="181" font-size="13" fill="var(--color-text)">Every numeric field becomes 0, booleans become false and references become null.</text>
<line x1="34" y1="203" x2="34" y2="213" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-new)"/>
<rect x="0" y="216" width="720" height="72" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<circle cx="34" cy="252" r="17" fill="var(--color-accent)"/>
<text x="34" y="258" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">3</text>
<text x="68" y="246" font-size="15" font-weight="700" fill="var(--color-accent-700)">Instance initializers</text>
<text x="68" y="269" font-size="13" fill="var(--color-text)">Fields declared with a value and { } blocks, in the order they appear in the file.</text>
<line x1="34" y1="291" x2="34" y2="301" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-new)"/>
<rect x="0" y="304" width="720" height="72" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<circle cx="34" cy="340" r="17" fill="var(--color-accent-700)"/>
<text x="34" y="346" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">4</text>
<text x="68" y="334" font-size="15" font-weight="700" fill="var(--color-accent-700)">Constructor body</text>
<text x="68" y="357" font-size="13" fill="var(--color-text)">Only now does your code run: validate arguments, assign fields, compute derived state.</text>
<line x1="34" y1="379" x2="34" y2="389" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-new)"/>
<rect x="0" y="392" width="720" height="72" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<circle cx="34" cy="428" r="17" fill="var(--color-accent-2-700)"/>
<text x="34" y="434" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">5</text>
<text x="68" y="422" font-size="15" font-weight="700" fill="var(--color-accent-2-800)">Reference returned</text>
<text x="68" y="445" font-size="13" fill="var(--color-text)">The variable p, living on the Stack, now points at the finished object on the Heap.</text>
<text x="2" y="486" font-size="12" fill="var(--color-neutral-700)">If the constructor throws, everything dies at stage 4: the variable p never gets to point at the object.</text>
</svg>
<figcaption>The <code>new</code> operator runs five stages. The constructor is the fourth, not the first: the object already exists in memory by the time your code starts running.</figcaption>
</figure>

The practical consequence of stage 5 is huge: **if the constructor validates and throws, the invalid object never sees daylight**. No reference points at it, so the garbage collector takes it away. That is the difference between validating in the constructor and validating afterwards.

---

## 2. The default constructor and the trap it hides

If you write **no constructor at all**, the compiler hands you an empty, parameterless one:

```java
public class Person {
    private String name;
    // The compiler implicitly inserts:
    // public Person() { }
}

Person p = new Person(); // Compiles
```

But the moment you write **a single constructor of your own**, that gift disappears:

```java
public class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }
}

Person p = new Person();          // Compilation ERROR
Person q = new Person("Laura");   // Correct
```

This is not a language quirk — it is deliberate. If you declared that a `Person` needs a name in order to exist, the compiler upholds that decision and refuses to let you create one without it. **A constructor is a contract, and the compiler is the one that enforces it.**

> If you also want to keep allowing `new Person()`, you have to write it explicitly yourself. Don't write it out of habit: write it only if a data-less object genuinely makes sense in your domain.

---

## 3. Constructor overloading and delegation with `this(...)`

A class can have several constructors as long as they **differ in their parameter list** (count, types, or order). That is *overloading*, the same concept you already saw for methods.

The classic mistake is duplicating logic across all of them:

```java
// BAD: the price validation is copied three times.
public Product() {
    this.name = "Unnamed";
    this.price = 0;
}
public Product(String name) {
    this.name = name;
    this.price = 0;
}
public Product(String name, double price) {
    this.name = name;
    if (price < 0) throw new IllegalArgumentException("Negative price");
    this.price = price;
}
```

If tomorrow you add a new rule — the name cannot be blank — you have to remember to touch all three. You will forget one. It always happens.

The fix is **`this(...)`**: a constructor can call another constructor of the same class and delegate the work to it. You pick **one canonical constructor** that concentrates the validation, and the rest simply supply default values.

<figure class="diagram">
<svg viewBox="0 0 720 250" role="img" aria-labelledby="d-this-t">
<title id="d-this-t">Overloaded constructors delegating to a single canonical constructor</title>
<defs><marker id="ar-this" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="30" width="250" height="64" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="20" y="56" font-size="13.5" font-weight="700" fill="var(--color-text)">Product()</text>
<text x="20" y="78" font-size="12.5" fill="var(--color-neutral-700)">this("Unnamed", 0);</text>
<rect x="0" y="124" width="250" height="64" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="20" y="150" font-size="13.5" font-weight="700" fill="var(--color-text)">Product(String name)</text>
<text x="20" y="172" font-size="12.5" fill="var(--color-neutral-700)">this(name, 0);</text>
<path d="M252 60 C 296 60, 300 100, 334 106" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-this)"/>
<path d="M252 154 C 296 154, 300 124, 334 118" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-this)"/>
<text x="262" y="97" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">this(...)</text>
<rect x="340" y="42" width="380" height="150" rx="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="362" y="70" font-size="13" font-weight="700" fill="var(--color-accent-700)">Product(String name, double price)</text>
<text x="362" y="92" font-size="11.5" fill="var(--color-neutral-800)">CANONICAL CONSTRUCTOR</text>
<text x="362" y="118" font-size="12.5" fill="var(--color-text)">· validates name is neither null nor blank</text>
<text x="362" y="139" font-size="12.5" fill="var(--color-text)">· validates price is not negative</text>
<text x="362" y="160" font-size="12.5" fill="var(--color-text)">· assigns the fields</text>
<text x="362" y="182" font-size="12" font-weight="700" fill="var(--color-accent-700)">The only place where the rule lives.</text>
<text x="2" y="228" font-size="12" fill="var(--color-neutral-700)">A new rule is added in one place and all three constructors inherit it automatically.</text>
</svg>
<figcaption>Delegation with <code>this(...)</code>: convenience constructors never repeat logic — they just fill in defaults and call the canonical one.</figcaption>
</figure>

```java
public class Product {
    private String name;
    private double price;

    public Product() {
        this("Unnamed", 0);             // delegates
    }

    public Product(String name) {
        this(name, 0);                  // delegates
    }

    // Canonical constructor: ALL validation lives here
    public Product(String name, double price) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be blank");
        }
        if (price < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        this.name = name;
        this.price = price;
    }
}
```

Two rules the compiler will enforce around `this(...)`:

1. **It must be the first statement in the constructor.** You cannot put anything before it, not even a `System.out.println`.
2. **No cycles allowed.** If `A()` calls `B()` and `B()` calls `A()`, that is a compile error, not a runtime stack overflow.

---

## 4. Encapsulation: the problem it actually solves

Encapsulation is **not** "make everything `private` and let the IDE generate getters and setters." That is ritual, not design. Encapsulation is this:

> **The object owns its own state and is solely responsible for keeping it consistent.**

As long as a field is `public`, any line in any file of the project can leave it in an impossible state, and there is no way to prevent it or to find out who did it.

<figure class="diagram">
<svg viewBox="0 0 720 480" role="img" aria-labelledby="d-encap-t">
<title id="d-encap-t">Comparison between a class with public fields and an encapsulated class</title>
<defs><marker id="ar-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker><marker id="ar-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<rect x="0" y="0" width="720" height="230" rx="22" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="24" y="32" font-size="15" font-weight="700" fill="var(--color-neutral-800)">Unencapsulated — public fields</text>
<rect x="24" y="52" width="190" height="60" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="119" y="76" font-size="12.5" text-anchor="middle" fill="var(--color-text)">External code</text>
<text x="119" y="96" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">p.price = -500;</text>
<text x="253" y="74" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-700)">direct access</text>
<line x1="216" y1="84" x2="288" y2="84" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-bad)"/>
<rect x="296" y="52" width="176" height="60" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-500)"/>
<text x="384" y="78" font-size="12.5" text-anchor="middle" fill="var(--color-text)">public double price;</text>
<text x="384" y="97" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-600)">no defense at all</text>
<line x1="474" y1="84" x2="546" y2="84" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-bad)"/>
<rect x="554" y="52" width="142" height="60" rx="14" fill="var(--color-neutral-300)" stroke="var(--color-neutral-500)"/>
<text x="625" y="78" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">price = -500</text>
<text x="625" y="97" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-700)">impossible state</text>
<text x="24" y="148" font-size="12.5" fill="var(--color-neutral-800)">The object is inconsistent and nobody could stop it. The error will surface at billing time,</text>
<text x="24" y="170" font-size="12.5" fill="var(--color-neutral-800)">three layers up, where no trace is left of what caused it.</text>
<text x="24" y="202" font-size="13" font-weight="700" fill="var(--color-neutral-900)">Possible culprits: the entire project.</text>
<rect x="0" y="248" width="720" height="230" rx="22" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="24" y="280" font-size="15" font-weight="700" fill="var(--color-accent-2-700)">Encapsulated — private fields</text>
<rect x="24" y="300" width="190" height="60" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="119" y="324" font-size="12.5" text-anchor="middle" fill="var(--color-text)">External code</text>
<text x="119" y="344" font-size="12" text-anchor="middle" fill="var(--color-neutral-700)">p.setPrice(-500);</text>
<text x="253" y="322" font-size="11.5" text-anchor="middle" fill="var(--color-accent-2-700)">the only door</text>
<line x1="216" y1="332" x2="288" y2="332" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-good)"/>
<rect x="296" y="298" width="176" height="64" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="384" y="322" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">setPrice()</text>
<text x="384" y="343" font-size="11.5" text-anchor="middle" fill="var(--color-text)">if (price &lt; 0) throw ...</text>
<line x1="474" y1="332" x2="546" y2="332" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-good)"/>
<rect x="554" y="300" width="142" height="60" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="625" y="326" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">price untouched</text>
<text x="625" y="345" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-700)">rejected upfront</text>
<text x="24" y="396" font-size="12.5" fill="var(--color-text)">The invalid assignment is rejected before it reaches the field. The error surfaces on the exact</text>
<text x="24" y="418" font-size="12.5" fill="var(--color-text)">line that caused it, with a stack trace pointing straight at the culprit.</text>
<text x="24" y="450" font-size="13" font-weight="700" fill="var(--color-accent-2-700)">Possible culprits: one.</text>
</svg>
<figcaption>The real difference is not stylistic — it is <em>where the error is detected</em>. Encapsulation turns a diffuse bug into an exception with an exact address.</figcaption>
</figure>

Look closely at the last line of each panel, because that is the whole point. With public fields, when you find a negative price in production you have to audit the entire project. With a validating setter, the `IllegalArgumentException` is thrown on the exact line that caused it and the stack trace takes you straight to the culprit.

---

## 5. The four access modifiers

Java defines four visibility levels, from most open to most closed. Think of them as concentric circles of trust:

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-mod-t">
<title id="d-mod-t">Java's four visibility levels as concentric circles</title>
<rect x="2" y="6" width="716" height="318" rx="26" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="24" y="36" font-size="15" font-weight="700" fill="var(--color-neutral-800)">public</text>
<text x="88" y="36" font-size="12" fill="var(--color-neutral-700)">— any class in any package, including another project entirely</text>
<rect x="34" y="54" width="652" height="258" rx="24" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="56" y="84" font-size="15" font-weight="700" fill="var(--color-accent-2-700)">protected</text>
<text x="140" y="84" font-size="12" fill="var(--color-neutral-800)">— same package, plus subclasses even if they live in another package</text>
<rect x="66" y="102" width="588" height="198" rx="22" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="88" y="132" font-size="15" font-weight="700" fill="var(--color-accent-2-800)">no modifier</text>
<text x="200" y="132" font-size="12" fill="var(--color-neutral-800)">(package-private) — only classes in the same package</text>
<rect x="98" y="150" width="524" height="138" rx="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="120" y="180" font-size="15" font-weight="700" fill="var(--color-accent-700)">private</text>
<text x="186" y="180" font-size="12" fill="var(--color-neutral-900)">— inside the declaring class only</text>
<text x="120" y="208" font-size="12.5" fill="var(--color-text)">Not even subclasses can see it.</text>
<text x="120" y="232" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">This is your default for every field. Always.</text>
<text x="120" y="256" font-size="12.5" fill="var(--color-text)">Start closed and open only what other code genuinely needs:</text>
<text x="120" y="276" font-size="12.5" fill="var(--color-text)">closing what you already published breaks every one of your users.</text>
</svg>
<figcaption>The further inward, the less code can touch it — and the less surface you have to audit when something goes wrong.</figcaption>
</figure>

| Modifier | Same class | Same package | Subclass in another package | Any class |
| --- | --- | --- | --- | --- |
| `private` | Yes | No | No | No |
| *(no modifier)* | Yes | Yes | No | No |
| `protected` | Yes | Yes | Yes | No |
| `public` | Yes | Yes | Yes | Yes |

**The working rule**: fields are always `private`; methods are `public` only if they are part of the contract the class offers the world. Everything else stays as closed as possible. Widening visibility later is trivial; narrowing it breaks all the code that already depended on it.

---

## 6. Getters and setters done right

An auto-generated getter/setter pair that does nothing but read and write the field is, in practice, a public field with extra ceremony:

```java
// This encapsulates NOTHING. It is a public field in disguise.
public double getPrice() { return price; }
public void setPrice(double price) { this.price = price; }
```

Accessors earn their keep when they **do something**: validate, transform, compute — or simply do not exist.

```java
public class BankAccount {
    private final String owner;   // final: never changes after the constructor
    private double balance;

    public BankAccount(String owner, double initialBalance) {
        if (owner == null || owner.isBlank()) {
            throw new IllegalArgumentException("Owner is required");
        }
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Initial balance cannot be negative");
        }
        this.owner = owner;
        this.balance = initialBalance;
    }

    // Getter: yes. Reading the balance is part of the public contract.
    public double getBalance() { return balance; }

    // Balance setter: NO. Nobody should be able to write the balance directly.
    // Instead, domain operations that express intent:
    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit must be positive");
        }
        this.balance += amount;
    }

    public void withdraw(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal must be positive");
        }
        if (amount > balance) {
            throw new IllegalStateException("Insufficient funds");
        }
        this.balance -= amount;
    }
}
```

Compare the two ways of writing the same thing:

```java
account.setBalance(account.getBalance() - 5000);   // What is going on here? Was anything validated?
account.withdraw(5000);                            // Intent is explicit and the rule is enforced.
```

The second version is not just more readable: it is the only one of the two in which the insufficient-funds rule can exist at all. **Methods should name domain operations, not data movements.**

---

## 7. Reference leaking: the bug that breaks encapsulation without you noticing

This is where most "encapsulated" classes fall apart. Look:

```java
public class Course {
    private List<String> students = new ArrayList<>();

    public List<String> getStudents() {
        return students;   // ⚠️ We are handing out the internal reference
    }
}
```

Everything looks right: the field is `private`, there is a getter. But:

```java
Course c = new Course();
c.getStudents().add("Intruder");   // We mutate internal state from outside
c.getStudents().clear();           // And wipe it entirely
```

The getter handed over the **memory address of the internal list**, not a copy. Whoever receives it has full control. The `private` bought you nothing, because `private` protects the *field*, not the *object it points to*.

There are three fixes, from least to most rigid:

```java
// 1. Read-only view: cheap, but still shares the underlying list.
public List<String> getStudents() {
    return Collections.unmodifiableList(students);
}

// 2. Defensive copy: the caller gets its own independent list.
public List<String> getStudents() {
    return new ArrayList<>(students);
}

// 3. Do not expose the collection: expose only the operations that make sense.
public void enroll(String student) {
    if (student == null || student.isBlank()) {
        throw new IllegalArgumentException("Invalid student");
    }
    students.add(student);
}

public int enrolledCount() { return students.size(); }
```

The third option is almost always the best one, and not for tidiness: it is the only one that later lets you add a rule like "maximum 30 students" without changing the class's public signature.

> The same trap applies to constructors: if you receive a `List` as a parameter and assign it directly with `this.list = list`, whoever passed it keeps a live reference to your internal state. Copy it on the way in too.

---

## 8. Immutability: encapsulation taken to its limit

An **immutable** object never changes after birth. Because it never changes, it cannot become inconsistent, it needs no setters, and it is safe to share across threads with no synchronization at all.

```java
public final class Coordinate {          // final: nobody can subclass and break the rules
    private final double latitude;       // final: assigned only in the constructor
    private final double longitude;

    public Coordinate(double latitude, double longitude) {
        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("Latitude out of range");
        }
        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("Longitude out of range");
        }
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }

    // To "modify", return a new instance
    public Coordinate shift(double dLat, double dLon) {
        return new Coordinate(latitude + dLat, longitude + dLon);
    }
}
```

Since Java 16 there is a shorthand for this kind of data carrier, the **record**, which generates the constructor, accessors, `equals`, `hashCode`, and `toString` for you:

```java
public record Coordinate(double latitude, double longitude) {
    // Compact constructor: you only write the validation
    public Coordinate {
        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("Latitude out of range");
        }
    }
}
```

You will see this a lot in modern code. For now, keep the underlying idea: **the less an object can change, the fewer ways there are to break it.**

---

## 9. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| `public void Product(...)` with a return type | Java compiles it as an **ordinary method** named `Product`, not a constructor. The object is never initialized and you get no warning. | Delete the return type. |
| Assigning without `this` under shadowing: `name = name;` | The parameter assigns to itself. The field stays `null`. Compiles cleanly. | Use `this.name = name;`. |
| Calling an overridable method from the constructor | The subclass runs that method before its own fields are initialized. | Have the constructor call only `private` or `final` methods. |
| Validating in the setter but not in the constructor | The object can be born invalid and is only protected afterwards. | Have the constructor delegate to the setter, or both delegate to a private validator. |
| Generating getters and setters for every field by reflex | Nominal encapsulation: the state is as exposed as if it were public. | Expose only what the contract genuinely requires. |

---

## 10. Guided hands-on exercise

### Challenge: the `Student` class

Write a `Student` class that satisfies **all** of these conditions:

1. Fields `name` (String) and `gpa` (double), both `private`. `name` must never be changeable once the object is created.
2. A canonical constructor taking name and gpa that validates the name is neither null nor blank, and that the gpa sits between `0.0` and `10.0`.
3. A convenience constructor taking only the name and starting with a gpa of `0.0`, **without duplicating the validation**.
4. A setter for `gpa` that enforces the same range rule as the constructor.
5. A `passed()` method returning `true` when the gpa is `6.0` or higher.
6. A `main` proving the object rejects invalid values both at construction time and at modification time.

<details>
<summary>See suggested solution</summary>

```java
public class Student {
    private final String name;   // final: fixed by the constructor, never changes
    private double gpa;

    // Convenience constructor: delegates, does not duplicate
    public Student(String name) {
        this(name, 0.0);
    }

    // Canonical constructor
    public Student(String name, double gpa) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be blank");
        }
        this.name = name;
        setGpa(gpa);   // reuses the range validation, kept in a single place
    }

    public String getName() {
        return name;
    }

    public double getGpa() {
        return gpa;
    }

    public void setGpa(double gpa) {
        if (gpa < 0.0 || gpa > 10.0) {
            throw new IllegalArgumentException(
                "GPA must be between 0.0 and 10.0, received: " + gpa);
        }
        this.gpa = gpa;
    }

    public boolean passed() {
        return gpa >= 6.0;
    }

    @Override
    public String toString() {
        return name + " — gpa " + gpa + (passed() ? " (passed)" : " (failed)");
    }

    public static void main(String[] args) {
        Student s1 = new Student("Laura Gimenez", 8.4);
        System.out.println(s1);              // Laura Gimenez — gpa 8.4 (passed)

        Student s2 = new Student("Carlos Ruiz");
        System.out.println(s2);              // Carlos Ruiz — gpa 0.0 (failed)

        s2.setGpa(7.2);
        System.out.println(s2);              // Carlos Ruiz — gpa 7.2 (passed)

        // The object defends itself on modification
        try {
            s2.setGpa(15.0);
        } catch (IllegalArgumentException ex) {
            System.out.println("Rejected: " + ex.getMessage());
        }

        // And on construction: this object never comes into existence
        try {
            Student invalid = new Student("", 5.0);
        } catch (IllegalArgumentException ex) {
            System.out.println("Rejected: " + ex.getMessage());
        }
    }
}
```

**What matters about this solution is not that it compiles, but that the `0.0–10.0` range rule is written exactly once.** The canonical constructor calls `setGpa`, and the convenience constructor calls the canonical one. If the range becomes `1.0–10.0` tomorrow, you change one line and all three paths are fixed.

</details>

---

## Key takeaways

- The constructor is the **only guarantee** that an object is born valid; validating there prevents an invalid object from ever existing.
- Writing a constructor removes the one the compiler used to give you. That is a feature, not a bug.
- `this(...)` concentrates validation in a canonical constructor and stops rules from being duplicated.
- Encapsulation means making the object **responsible for its own consistency**, not mass-generating accessors.
- `private` is the default for every field. Open only what the contract requires.
- Returning an internal collection without copying **cancels encapsulation**, no matter how `private` the field is.
- What cannot change cannot break: prefer `final` and immutability whenever the domain allows it.
</content>
