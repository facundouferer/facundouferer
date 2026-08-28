---
course: 'java'
slug: '09-clases-abstractas-interfaces-y-modelado'
title: 'Abstract Classes, Interfaces, and Code Organization'
description: 'Learn when to reach for an abstract class and when for an interface, implement several contracts at once, organize your code into packages, and model association, aggregation, and composition.'
order: 11
lang: 'en'
published: true
---

# Abstract Classes, Interfaces, and Code Organization

In the previous lesson, `Vehicle` had a quiet problem: nothing stops you from writing `new Vehicle("Ford")`. And a "generic vehicle" does not exist in the real world. It is a concept, not a thing.

Worse still: `Vehicle.start()` had to invent a default implementation (`"The vehicle starts."`) that no subclass actually uses. We wrote code purely so it would compile.

Java has two tools to fix this, and choosing badly between them is one of the design decisions you pay for the longest:

- **Abstract class**: an **incomplete** mold. It brings state and already-solved behavior, and leaves gaps the subclass is forced to fill.
- **Interface**: a **pure contract**. It says nothing about how anything is done, only what whoever signs it must be able to do.

---

## 1. Abstract classes: molds that cannot be instantiated

<figure class="diagram">
<svg viewBox="0 0 720 400" role="img" aria-labelledby="d-abs-t">
<title id="d-abs-t">Comparison between the anatomy of an abstract class and that of an interface</title>
<rect x="0" y="0" width="720" height="182" rx="20" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="24" y="30" font-size="14.5" font-weight="700" fill="var(--color-accent-2-700)">Abstract class — an incomplete mold</text>
<rect x="24" y="42" width="672" height="102" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="40" y="64" font-size="12" font-weight="700" fill="var(--color-text)">public abstract class Shape {</text>
<text x="52" y="86" font-size="12" fill="var(--color-text)">protected String name;</text>
<text x="360" y="86" font-size="11" fill="var(--color-accent-2-700)">← can hold STATE</text>
<text x="52" y="108" font-size="12" fill="var(--color-text)">public abstract double area();</text>
<text x="360" y="108" font-size="11" fill="var(--color-accent-2-700)">← no body: forces the subclass to write it</text>
<text x="52" y="130" font-size="12" fill="var(--color-text)">public void describe() { ... }</text>
<text x="360" y="130" font-size="11" fill="var(--color-accent-2-700)">← has a body: inherited as is</text>
<text x="24" y="166" font-size="12" fill="var(--color-neutral-800)">Cannot be instantiated: new Shape() is an error. And a class extends ONLY ONE abstract class.</text>
<rect x="0" y="198" width="720" height="190" rx="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="24" y="228" font-size="14.5" font-weight="700" fill="var(--color-accent-700)">Interface — a pure contract</text>
<rect x="24" y="240" width="672" height="116" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="40" y="262" font-size="12" font-weight="700" fill="var(--color-text)">public interface Drawable {</text>
<text x="52" y="284" font-size="12" fill="var(--color-text)">int MAX_LAYERS = 10;</text>
<text x="360" y="284" font-size="11" fill="var(--color-accent-700)">← constant: public static final</text>
<text x="52" y="306" font-size="12" fill="var(--color-text)">void draw();</text>
<text x="360" y="306" font-size="11" fill="var(--color-accent-700)">← abstract and public by default</text>
<text x="52" y="328" font-size="12" fill="var(--color-text)">default void highlight() { ... }</text>
<text x="360" y="328" font-size="11" fill="var(--color-accent-700)">← default implementation (Java 8+)</text>
<text x="52" y="350" font-size="12" fill="var(--color-text)">static Drawable empty() { ... }</text>
<text x="360" y="350" font-size="11" fill="var(--color-accent-700)">← utility belonging to the interface itself</text>
<text x="24" y="378" font-size="12" fill="var(--color-neutral-800)">Holds no instance state. And a class may implement AS MANY interfaces as it wants.</text>
</svg>
<figcaption>The abstract class contributes state and inheritable code; the interface contributes a contract any class can sign, no matter what it inherits from.</figcaption>
</figure>

A class marked `abstract` **cannot be instantiated**. It exists only to be extended:

```java
public abstract class Shape {
    protected final String name;

    protected Shape(String name) {              // yes, abstract classes have constructors
        this.name = name;
    }

    // Abstract method: no body. Every subclass MUST implement it.
    public abstract double area();
    public abstract double perimeter();

    // Concrete method: already solved, inherited as is.
    public void describe() {
        System.out.printf("%s → area %.2f, perimeter %.2f%n",
            name, area(), perimeter());
    }
}
```

Look carefully at `describe()`, because that is where the whole point lives: **it calls two methods that do not exist yet**. The abstract class writes the general algorithm once and delegates the concrete steps to whoever extends it.

```java
public class Circle extends Shape {
    private final double radius;

    public Circle(double radius) {
        super("Circle");
        if (radius <= 0) throw new IllegalArgumentException("Radius must be positive");
        this.radius = radius;
    }

    @Override
    public double area() { return Math.PI * radius * radius; }

    @Override
    public double perimeter() { return 2 * Math.PI * radius; }
}

public class Rectangle extends Shape {
    private final double width, height;

    public Rectangle(double width, double height) {
        super("Rectangle");
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() { return width * height; }

    @Override
    public double perimeter() { return 2 * (width + height); }
}
```

And now `new Shape(...)` does not even compile. **The compiler stopped allowing the object that made no sense.** That is exactly what we were after.

```java
// Shape s = new Shape("something");   // ERROR: Shape is abstract; cannot be instantiated

List<Shape> shapes = List.of(new Circle(3), new Rectangle(4, 5));
for (Shape s : shapes) {
    s.describe();   // polymorphism, same as the previous lesson
}
```

> If a subclass **does not implement** every abstract method it inherits, it must be declared `abstract` as well. Java will not let you have a concrete class with holes in it.

---

## 2. Interfaces: contracts anyone can sign

An interface describes **what can be done**, never how:

```java
public interface Payable {
    // Every method is public abstract by default: no need to write it
    void pay(double amount);
    boolean isAvailable();
}
```

Any class can sign it with `implements`, and the compiler forces it to honor the whole thing:

```java
public class CreditCard implements Payable {
    private final String number;
    private double availableCredit;

    public CreditCard(String number, double availableCredit) {
        this.number = number;
        this.availableCredit = availableCredit;
    }

    @Override
    public void pay(double amount) {
        if (amount > availableCredit) {
            throw new IllegalStateException("Insufficient credit");
        }
        availableCredit -= amount;
        System.out.println("Paid with card " + number);
    }

    @Override
    public boolean isAvailable() { return availableCredit > 0; }
}
```

The key point: `CreditCard` inherits from nobody. **The interface does not consume the single `extends` you have.** That is its decisive advantage.

### `default` and `static` methods

Since Java 8, an interface can carry implementations:

```java
public interface Payable {
    void pay(double amount);
    boolean isAvailable();

    // default: inheritable implementation that classes may override or not
    default void payIfPossible(double amount) {
        if (isAvailable()) {
            pay(amount);
        } else {
            System.out.println("Payment method unavailable.");
        }
    }

    // static: a utility belonging to the interface, not to the classes
    static boolean isValidAmount(double amount) {
        return amount > 0 && amount < 1_000_000;
    }
}
```

`default` methods exist for a very concrete reason: **they let you add a new method to an interface without breaking the thousand classes already implementing it**. Before Java 8, adding a method to a public interface broke the whole ecosystem depending on it.

Use them sparingly. An interface full of `default` methods stops being a contract and starts being a badly disguised abstract class.

---

## 3. Implementing several interfaces at once

This is where you see why interfaces are not simply "abstract classes without code":

<figure class="diagram">
<svg viewBox="0 0 720 320" role="img" aria-labelledby="d-impl-t">
<title id="d-impl-t">A class extends a single abstract class but implements several interfaces</title>
<defs><marker id="uml-i" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--color-neutral-100)" stroke="var(--color-accent-700)" stroke-width="1.5"/></marker></defs>
<rect x="0" y="24" width="200" height="80" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="100" y="46" font-size="10.5" text-anchor="middle" fill="var(--color-accent-2-800)">«abstract class»</text>
<text x="100" y="70" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Bird</text>
<text x="100" y="92" font-size="11.5" text-anchor="middle" fill="var(--color-text)">eat(), plumage</text>
<rect x="260" y="24" width="190" height="80" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="355" y="46" font-size="10.5" text-anchor="middle" fill="var(--color-accent-700)">«interface»</text>
<text x="355" y="70" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Swimmer</text>
<text x="355" y="92" font-size="11.5" text-anchor="middle" fill="var(--color-text)">swim()</text>
<rect x="510" y="24" width="210" height="80" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="615" y="46" font-size="10.5" text-anchor="middle" fill="var(--color-accent-700)">«interface»</text>
<text x="615" y="70" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Flyer</text>
<text x="615" y="92" font-size="11.5" text-anchor="middle" fill="var(--color-text)">fly(), maxAltitude()</text>
<path d="M285 206 L285 158 L100 158 L100 108" fill="none" stroke="var(--color-accent-2-700)" stroke-width="1.8" marker-end="url(#uml-i)"/>
<path d="M360 206 L360 108" fill="none" stroke="var(--color-accent)" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#uml-i)"/>
<path d="M435 206 L435 158 L615 158 L615 108" fill="none" stroke="var(--color-accent)" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#uml-i)"/>
<text x="150" y="150" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">extends (solid line, only one)</text>
<text x="450" y="150" font-size="11" font-weight="700" fill="var(--color-accent-700)">implements (dashed, as many as you like)</text>
<rect x="200" y="206" width="320" height="82" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="360" y="232" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-text)">Duck</text>
<text x="360" y="254" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">extends Bird implements Swimmer, Flyer</text>
<text x="360" y="274" font-size="11.5" text-anchor="middle" fill="var(--color-accent-700)">inherits eat(); implements swim() and fly()</text>
<text x="0" y="312" font-size="12" fill="var(--color-neutral-700)">Java has no multiple class inheritance, but an object can honor as many contracts as it needs.</text>
</svg>
<figcaption>One line of inheritance, many contracts. That is why interfaces are the tool for combining capabilities that share no common ancestor.</figcaption>
</figure>

```java
public class Duck extends Bird implements Swimmer, Flyer {
    @Override public void swim() { System.out.println("The duck swims."); }
    @Override public void fly()  { System.out.println("The duck flies."); }
}
```

And now the same object can be seen from different angles depending on what each method needs:

```java
Duck duck = new Duck();

Bird b = duck;       // as a bird
Swimmer s = duck;    // as something that swims
Flyer f = duck;      // as something that flies

// A method that only needs something to swim does not need to know it is a duck:
public void swimmingContest(List<Swimmer> participants) {
    for (Swimmer participant : participants) {
        participant.swim();
    }
}
```

That list can hold a `Duck`, a `Fish`, and a `Submarine` — three classes that share absolutely no ancestor. **The interface is the only thing they have in common, and it is enough.**

---

## 4. Which one to pick

| Criterion | Abstract class | Interface |
| --- | --- | --- |
| Relationship it expresses | **"is a"** — shared identity | **"is capable of"** — shared capability |
| How many you can use | Only one (`extends`) | As many as you want (`implements`) |
| Instance state | Yes, ordinary fields | No, only `static final` constants |
| Constructors | Yes | No |
| Method visibility | Anything, including `protected` | Always `public` |
| Adding a method later | Breaks subclasses if it is abstract | Breaks nothing if it is `default` |

The practical rule that holds in 90% of cases:

> **Interface by default. Abstract class only when there is genuinely shared state or code you do not want to repeat.**

And the two combine perfectly well — that is the most common pattern in serious libraries:

```java
public interface Repository<T> {
    void save(T entity);
    Optional<T> findById(long id);
}

// Abstract base that solves the repetitive part for any repository
public abstract class InMemoryRepository<T> implements Repository<T> {
    protected final Map<Long, T> store = new HashMap<>();

    @Override
    public Optional<T> findById(long id) {
        return Optional.ofNullable(store.get(id));
    }
    // save() stays abstract: each entity knows how to obtain its own id
}
```

---

## 5. Organization: packages

A **package** is a folder with a qualified name. It groups related classes, prevents name clashes, and controls visibility (remember `package-private` from lesson 8).

<figure class="diagram">
<svg viewBox="0 0 720 290" role="img" aria-labelledby="d-pkg-t">
<title id="d-pkg-t">A project's package structure and how it maps to the package declaration</title>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">The folder path and the package declaration must match. Always.</text>
<rect x="0" y="34" width="390" height="228" rx="18" fill="var(--color-accent-100)" stroke="var(--color-accent-400)"/>
<text x="18" y="58" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">com.facundouferer.shop</text>
<rect x="18" y="70" width="354" height="52" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="92" font-size="12" font-weight="700" fill="var(--color-text)">domain</text>
<text x="34" y="111" font-size="11" fill="var(--color-neutral-700)">Product.java · Customer.java · Order.java</text>
<rect x="18" y="130" width="354" height="52" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="152" font-size="12" font-weight="700" fill="var(--color-text)">service</text>
<text x="34" y="171" font-size="11" fill="var(--color-neutral-700)">CartService.java · PaymentService.java</text>
<rect x="18" y="190" width="354" height="52" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="212" font-size="12" font-weight="700" fill="var(--color-text)">Main.java</text>
<text x="34" y="231" font-size="11" fill="var(--color-neutral-700)">the application entry point</text>
<text x="406" y="58" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">package com.facundouferer.shop.domain;</text>
<text x="406" y="78" font-size="11.5" fill="var(--color-neutral-800)">First line of every file. If it does not match the</text>
<text x="406" y="96" font-size="11.5" fill="var(--color-neutral-800)">real path, it will not compile.</text>
<text x="406" y="130" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">import ...shop.domain.Product;</text>
<text x="406" y="150" font-size="11.5" fill="var(--color-neutral-800)">Needed to use a class from another package.</text>
<text x="406" y="168" font-size="11.5" fill="var(--color-neutral-800)">Within the same package it is unnecessary.</text>
<text x="406" y="202" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">Convention: your domain, reversed.</text>
<text x="406" y="222" font-size="11.5" fill="var(--color-neutral-800)">facundouferer.ar → com.facundouferer</text>
<text x="406" y="240" font-size="11.5" fill="var(--color-neutral-800)">So two different libraries never collide.</text>
<text x="0" y="284" font-size="12" fill="var(--color-neutral-700)">Group by responsibility (domain, service, repository), not by artifact type (all the interfaces in one bucket).</text>
</svg>
<figcaption>Packages are a project's first layer of architecture: the folder name already tells you what lives inside it.</figcaption>
</figure>

```java
package com.facundouferer.shop.domain;   // first line, mandatory

public class Product { ... }
```

Rules worth settling on from day one:

- All **lowercase**, no hyphens, no accents.
- The name starts with **your domain reversed** (`com.facundouferer`), so it never clashes with a third-party library.
- **One `.java` file per public class**, and the file is named after the class.
- Group by **responsibility**, not by artifact type. `shop.domain` and `shop.service` beat `shop.interfaces` and `shop.classes` every time.

---

## 6. Modeling relationships: association, aggregation, composition

Inheritance is not the only way to connect classes, nor the most common. In practice most relationships are **containment**, and they are told apart by a single question: **what happens to the part when the whole disappears?**

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-rel-t">
<title id="d-rel-t">Association, aggregation, and composition ordered from the weakest relationship to the strongest</title>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">The three ways to relate objects, from weakest to strongest</text>
<rect x="0" y="34" width="150" height="54" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="75" y="66" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Teacher</text>
<line x1="152" y1="61" x2="248" y2="61" stroke="var(--color-neutral-600)" stroke-width="2"/>
<rect x="250" y="34" width="150" height="54" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="325" y="66" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Course</text>
<text x="424" y="56" font-size="12" font-weight="700" fill="var(--color-neutral-800)">Association — they know each other and</text>
<text x="424" y="74" font-size="12" fill="var(--color-neutral-800)">collaborate, but each lives on its own.</text>
<rect x="0" y="122" width="150" height="54" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="75" y="154" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Team</text>
<path d="M152 149 L172 139 L192 149 L172 159 z" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<line x1="192" y1="149" x2="248" y2="149" stroke="var(--color-accent-2-700)" stroke-width="2"/>
<rect x="250" y="122" width="150" height="54" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="325" y="154" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Player</text>
<text x="424" y="144" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">Aggregation — the whole gathers parts that</text>
<text x="424" y="162" font-size="12" fill="var(--color-neutral-800)">already existed. Disband it and they remain.</text>
<rect x="0" y="210" width="150" height="54" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="75" y="242" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">House</text>
<path d="M152 237 L172 227 L192 237 L172 247 z" fill="var(--color-accent-700)" stroke="var(--color-accent-700)" stroke-width="1.8"/>
<line x1="192" y1="237" x2="248" y2="237" stroke="var(--color-accent-700)" stroke-width="2"/>
<rect x="250" y="210" width="150" height="54" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="325" y="242" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Room</text>
<text x="424" y="232" font-size="12" font-weight="700" fill="var(--color-accent-700)">Composition — the part cannot exist without</text>
<text x="424" y="250" font-size="12" fill="var(--color-neutral-800)">the whole. Demolish the house, it goes too.</text>
<text x="0" y="292" font-size="12" fill="var(--color-neutral-700)">Hollow diamond: the part survives. Filled diamond: the part dies with the whole, which creates it in its constructor.</text>
</svg>
<figcaption>The question that decides which is which: if I destroy the container, does the part still make sense on its own?</figcaption>
</figure>

```java
// ASSOCIATION: they know each other, neither owns the other
public class Teacher {
    private List<Course> courses = new ArrayList<>();
    public void assign(Course c) { courses.add(c); }
}

// AGGREGATION: the team receives players that already existed and outlives them
public class Team {
    private final List<Player> players;

    public Team(List<Player> players) {
        this.players = new ArrayList<>(players);   // defensive copy, lesson 8
    }
}

// COMPOSITION: the house CREATES its rooms and never lets them go
public class House {
    private final List<Room> rooms = new ArrayList<>();

    public House(int roomCount) {
        for (int i = 0; i < roomCount; i++) {
            rooms.add(new Room(i + 1));   // creates them right here
        }
    }

    public int roomCount() { return rooms.size(); }
    // There is no getRooms(): nobody outside touches the parts
}
```

Notice the pattern in the code: in **composition**, the container creates the parts in its own constructor and **does not expose them**. In **aggregation**, it receives them from outside. That difference in the code is exactly the conceptual difference.

---

## 7. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| Using an abstract class where an interface belongs | Burns the single available `extends` and the class can no longer inherit from what it actually needs. | Always start with the interface; add an abstract class only if there is shared state. |
| An interface with a `default` for every method | It stops being a contract and becomes an abstract class with no constructor and no state. | `default` is for evolving an interface without breaking implementations, not for writing logic. |
| Declaring mutable fields in an interface | Every field in an interface is `public static final`: a shared global constant, not object state. | If you need state, you need a class (abstract or otherwise). |
| Package that does not match the folder | Confusing compile errors about classes that "do not exist". | The `package` declaration must mirror the exact path. |
| Modeling as aggregation something that is composition | The part gets exposed and someone outside mutates it, or shares it between two containers. | If the part cannot live without the whole: create it inside and do not expose it. |
| One giant package holding every class | `package-private` protects nothing and the architecture is unreadable. | Split by responsibility from day one. |

---

## 8. Guided hands-on exercise

### Challenge: payment methods

1. Define the `Payable` interface with `void pay(double amount)`, `boolean isAvailable()`, and a `default` method `payIfPossible(double amount)` that only charges when the method is available.
2. Implement it in `CreditCard` (with available credit) and in `DigitalWallet` (with an account balance).
3. Create an abstract class `DigitalPaymentMethod implements Payable` that stores the holder's `email` and resolves `isAvailable()` using an `active` flag, leaving `pay()` abstract.
4. Make `DigitalWallet` extend that abstract class.
5. In `main`, build a `List<Payable>` and charge the same amount to every one of them in a single loop, with no `instanceof` and no casting.

<details>
<summary>See suggested solution</summary>

```java
import java.util.List;

public interface Payable {
    void pay(double amount);
    boolean isAvailable();

    default void payIfPossible(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (isAvailable()) {
            pay(amount);
        } else {
            System.out.println("  ✗ Method unavailable, charge skipped.");
        }
    }
}

// Abstract class: contributes the STATE and the shared behavior.
public abstract class DigitalPaymentMethod implements Payable {
    protected final String email;
    protected boolean active;

    protected DigitalPaymentMethod(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
        this.email = email;
        this.active = true;
    }

    @Override
    public boolean isAvailable() {
        return active;
    }

    public void deactivate() { this.active = false; }

    // pay() stays abstract: each digital method charges its own way.
}

public class DigitalWallet extends DigitalPaymentMethod {
    private double balance;

    public DigitalWallet(String email, double balance) {
        super(email);
        this.balance = balance;
    }

    @Override
    public boolean isAvailable() {
        return super.isAvailable() && balance > 0;   // reuses and refines
    }

    @Override
    public void pay(double amount) {
        if (amount > balance) throw new IllegalStateException("Insufficient balance");
        balance -= amount;
        System.out.printf("  ✓ Wallet (%s) — remaining balance $%.2f%n", email, balance);
    }
}

// Inherits from nobody: it only signs the contract.
public class CreditCard implements Payable {
    private final String lastFour;
    private double availableCredit;

    public CreditCard(String lastFour, double availableCredit) {
        this.lastFour = lastFour;
        this.availableCredit = availableCredit;
    }

    @Override
    public boolean isAvailable() { return availableCredit > 0; }

    @Override
    public void pay(double amount) {
        if (amount > availableCredit) throw new IllegalStateException("Insufficient credit");
        availableCredit -= amount;
        System.out.printf("  ✓ Card ****%s — remaining credit $%.2f%n",
            lastFour, availableCredit);
    }
}

public class MainCharges {
    public static void main(String[] args) {
        DigitalWallet emptyWallet = new DigitalWallet("empty@mail.com", 0);

        List<Payable> methods = List.of(
            new CreditCard("4417", 50000),
            new DigitalWallet("facu@mail.com", 30000),
            emptyWallet                                // no balance: will be skipped
        );

        System.out.println("Charging $12,500 to every method:");
        for (Payable method : methods) {
            method.payIfPossible(12500);   // the default decides; nobody asks for the type
        }
    }
}
```

**Two things to look at here.**

First: `CreditCard` and `DigitalWallet` share no ancestor whatsoever, and still live in the same `List<Payable>`. The interface was enough.

Second: `DigitalWallet.isAvailable()` calls `super.isAvailable()` and adds its own condition on top. It reuses the abstract class's rule instead of repeating it — exactly the pattern you used with `super.computeSalary()` in the previous lesson.

</details>

---

## Key takeaways

- An **abstract class** is an incomplete mold: it contributes state and code, forces the gaps to be filled, and cannot be instantiated.
- An **interface** is a contract: it says what can be done, not how, and it does not consume your single `extends`.
- Practical rule: **start with the interface**; add an abstract class only when there is genuinely shared state or logic.
- `default` methods exist so an interface can evolve without breaking the classes already implementing it.
- A class extends one class but implements every interface it needs. That is Java's answer to multiple inheritance.
- The `package` must match the folder, and grouping should follow **responsibility**, not artifact type.
- Association, aggregation, and composition are told apart by one question: if I destroy the whole, does the part still exist?
</content>
