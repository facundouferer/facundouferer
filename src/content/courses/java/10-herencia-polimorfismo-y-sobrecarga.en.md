---
course: 'java'
slug: '08-herencia-polimorfismo-y-sobrecarga'
title: 'Inheritance, Polymorphism, and Method Overloading'
description: 'Master inheritance with extends and super, overriding with @Override, the real difference between overloading and overriding, dynamic dispatch, and when composition beats inheritance.'
order: 10
lang: 'en'
published: true
---

# Inheritance, Polymorphism, and Method Overloading

So far every class you wrote lived on its own. But in any real system you run into classes that share a good chunk of their state and behavior: a `Car`, a `Motorcycle`, and a `Truck` all have a brand, they all start and they all brake.

Copy-pasting those members into three classes works right up until a rule changes. Then you have to remember all three places. You already know how that ends.

**Inheritance** solves that problem, and **polymorphism** — which is its consequence, not a separate topic — is what makes it worth having. This lesson covers both together, because apart they do not make sense.

---

## 1. Inheritance: `extends` and the "is-a" test

A class can **extend** another and automatically receive all of its fields and methods:

```java
public class Vehicle {
    protected String brand;

    public Vehicle(String brand) {
        this.brand = brand;
    }

    public void start() {
        System.out.println("The vehicle starts.");
    }

    public void brake() {
        System.out.println("The vehicle brakes.");
    }
}

public class Car extends Vehicle {
    public Car(String brand) {
        super(brand);
    }

    @Override
    public void start() {
        System.out.println("Car " + brand + " starting with a push button.");
    }

    public void openTrunk() {
        System.out.println("Trunk open.");
    }
}
```

`Car` declares neither `brand` nor `brake()`, yet it has both. It inherited them.

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-inherit-t">
<title id="d-inherit-t">Inheritance hierarchy: a Vehicle superclass and three subclasses</title>
<defs><marker id="uml-gen" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="11" markerHeight="11" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--color-neutral-100)" stroke="var(--color-accent-700)" stroke-width="1.5"/></marker></defs>
<rect x="210" y="10" width="300" height="102" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="38" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Vehicle</text>
<text x="360" y="60" font-size="12" text-anchor="middle" fill="var(--color-text)">protected String brand;</text>
<text x="360" y="80" font-size="12" text-anchor="middle" fill="var(--color-text)">public void start()</text>
<text x="360" y="100" font-size="12" text-anchor="middle" fill="var(--color-text)">public void brake()</text>
<path d="M360 155 L360 116" fill="none" stroke="var(--color-accent-700)" stroke-width="1.8" marker-end="url(#uml-gen)"/>
<line x1="105" y1="155" x2="615" y2="155" stroke="var(--color-accent-700)" stroke-width="1.8"/>
<line x1="105" y1="155" x2="105" y2="200" stroke="var(--color-accent-700)" stroke-width="1.8"/>
<line x1="360" y1="155" x2="360" y2="200" stroke="var(--color-accent-700)" stroke-width="1.8"/>
<line x1="615" y1="155" x2="615" y2="200" stroke="var(--color-accent-700)" stroke-width="1.8"/>
<rect x="0" y="200" width="210" height="104" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="18" y="226" font-size="13.5" font-weight="700" fill="var(--color-text)">Car</text>
<text x="18" y="252" font-size="11.5" fill="var(--color-neutral-700)">inherits: brand, brake()</text>
<text x="18" y="272" font-size="11.5" fill="var(--color-accent-700)">@Override start()</text>
<text x="18" y="292" font-size="11.5" fill="var(--color-text)">+ openTrunk()</text>
<rect x="255" y="200" width="210" height="104" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="273" y="226" font-size="13.5" font-weight="700" fill="var(--color-text)">Motorcycle</text>
<text x="273" y="252" font-size="11.5" fill="var(--color-neutral-700)">inherits: brand, brake()</text>
<text x="273" y="272" font-size="11.5" fill="var(--color-accent-700)">@Override start()</text>
<text x="273" y="292" font-size="11.5" fill="var(--color-text)">+ wheelie()</text>
<rect x="510" y="200" width="210" height="104" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="528" y="226" font-size="13.5" font-weight="700" fill="var(--color-text)">Truck</text>
<text x="528" y="252" font-size="11.5" fill="var(--color-neutral-700)">inherits: brand, start()</text>
<text x="528" y="272" font-size="11.5" fill="var(--color-accent-700)">@Override brake()</text>
<text x="528" y="292" font-size="11.5" fill="var(--color-text)">+ load(kg)</text>
<text x="0" y="330" font-size="12" fill="var(--color-neutral-700)">Every subclass receives everything from Vehicle and only redefines what it needs to change. The arrow points at the parent.</text>
</svg>
<figcaption>Inheritance runs from the general to the specific. What sits on top belongs to everyone; what sits below is each class's own.</figcaption>
</figure>

### The test to run before writing `extends`

Before inheriting, say this out loud: **"is an X an Y?"**

- A `Car` **is a** `Vehicle`. ✔ Inheritance is right.
- A `Car` **is an** `Engine`. ✘ A car **has** an engine. That is composition, not inheritance.

If the sentence sounds odd, the inheritance is wrong. And a wrong inheritance does not show up on day one: it shows up six months later, when the subclass has inherited five methods that make no sense in it.

> Java has **single inheritance**: a class extends exactly one class. There is no `extends A, B`. To combine behavior from several sources you use interfaces, which you will see in the next lesson.

---

## 2. `super`: the constructor chain

This is the part that confuses people most at the start. When you instantiate a subclass, **it does not run one constructor: it runs the whole chain**, from the most distant ancestor down to the concrete class.

<figure class="diagram">
<svg viewBox="0 0 720 350" role="img" aria-labelledby="d-super-t">
<title id="d-super-t">Execution order of the constructor chain with super</title>
<defs><marker id="ar-up" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-dn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<text x="150" y="22" font-size="14" font-weight="700" fill="var(--color-accent-700)">Car c = new Car("Toyota");</text>
<line x1="128" y1="278" x2="128" y2="52" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-up)"/>
<text x="4" y="130" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">1. The super(...)</text>
<text x="4" y="148" font-size="11.5" fill="var(--color-neutral-800)">calls travel up</text>
<text x="4" y="166" font-size="11.5" fill="var(--color-neutral-800)">first, all the way</text>
<text x="4" y="184" font-size="11.5" fill="var(--color-neutral-800)">to Object.</text>
<rect x="150" y="40" width="430" height="66" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="170" y="66" font-size="13.5" font-weight="700" fill="var(--color-text)">Object()</text>
<text x="170" y="88" font-size="11.5" fill="var(--color-neutral-700)">The implicit root of every Java class. It runs first.</text>
<rect x="150" y="132" width="430" height="66" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="170" y="158" font-size="13.5" font-weight="700" fill="var(--color-accent-2-800)">Vehicle(String brand)</text>
<text x="170" y="180" font-size="11.5" fill="var(--color-neutral-800)">this.brand = brand;  →  the inherited state is now ready.</text>
<rect x="150" y="224" width="430" height="66" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="170" y="250" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Car(String brand)</text>
<text x="170" y="272" font-size="11.5" fill="var(--color-neutral-800)">Car's own body runs LAST, with everything above already set.</text>
<line x1="602" y1="52" x2="602" y2="278" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-dn)"/>
<text x="620" y="130" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">2. The bodies</text>
<text x="620" y="148" font-size="11.5" fill="var(--color-neutral-800)">then execute</text>
<text x="620" y="166" font-size="11.5" fill="var(--color-neutral-800)">downward, top</text>
<text x="620" y="184" font-size="11.5" fill="var(--color-neutral-800)">to bottom.</text>
<text x="0" y="332" font-size="12" fill="var(--color-neutral-700)">By the time Car's body starts running, the inherited part of the object is already fully initialized.</text>
</svg>
<figcaption>The call goes up and the execution comes down. That is why a subclass never works on half-built inherited state.</figcaption>
</figure>

Three rules the compiler enforces without exception:

1. **`super(...)` must be the first statement in the constructor.** Same as `this(...)`, and for the same reason: nothing may run before the inherited part is ready.
2. **If you do not write `super(...)`, Java inserts a no-argument `super()` automatically.**
3. **If the superclass has no no-argument constructor, that automatic insertion fails** and the compiler forces you to explicitly call one that does exist.

This is the single most common error in the whole lesson:

```java
public class Vehicle {
    protected String brand;
    public Vehicle(String brand) { this.brand = brand; }
    // By writing this constructor, Vehicle no longer has a no-arg one
}

public class Car extends Vehicle {
    public Car() {
        // ERROR: Java tries to insert super() and Vehicle has no such constructor
    }
}
```

`super` also lets you **call the parent's version of a method** you are overriding, which is very common when you want to extend behavior rather than replace it:

```java
@Override
public void start() {
    super.start();                     // first do what every vehicle does
    System.out.println("...and engage keyless ignition.");
}
```

---

## 3. Overriding: `@Override` and the contract you cannot break

**Overriding** means redefining, in the subclass, a method that already exists in the superclass, with the **same signature**: same name, same parameter types, in the same order.

The `@Override` annotation is not mandatory, but **write it every time**. It changes nothing at runtime; what it does is ask the compiler to verify you are actually overriding something:

```java
public class Car extends Vehicle {
    @Override
    public void start(int speed) {   // ← compile error, and that is a good thing
        ...
    }
}
```

Without `@Override`, that method would compile perfectly. Java would treat it as a **new** `Car` method named `start` taking an `int`, and the original `start()` would remain inherited and untouched. Your code would run, would not do what you expected, and there would be no error to guide you. `@Override` turns a silent bug into a compile error.

### What the subclass may and may not change

| Element | Rule when overriding |
| --- | --- |
| Name and parameters | Identical. If they change, it is a new method, not an override. |
| Return type | The same, or a **subtype** of the original (covariant return). |
| Visibility | The same or **wider**. A `public` method cannot become `protected`. |
| Checked exceptions | The same, fewer, or subtypes. Never anything broader. |
| `private`, `static`, or `final` methods | Cannot be overridden at all. |

The visibility rule has a very concrete logic: if anyone can treat a `Car` as a `Vehicle`, and `Vehicle.start()` is public, then `start()` must remain callable on the `Car`. Narrowing it would break that promise.

---

## 4. Overloading and overriding: similar names, different concepts

These two words get mixed up constantly, and the underlying difference is **when the decision about which method runs is made**.

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-over-t">
<title id="d-over-t">The difference between overloading, resolved at compile time, and overriding, resolved at runtime</title>
<defs><marker id="ar-ov" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="0" width="720" height="150" rx="20" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="24" y="32" font-size="14.5" font-weight="700" fill="var(--color-neutral-800)">Overloading — decided by the COMPILER</text>
<text x="24" y="54" font-size="12" fill="var(--color-neutral-700)">Several different methods sharing a name inside the same class:</text>
<rect x="24" y="66" width="205" height="42" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="126" y="92" font-size="12" text-anchor="middle" fill="var(--color-text)">print(String t)</text>
<rect x="249" y="66" width="205" height="42" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="351" y="92" font-size="12" text-anchor="middle" fill="var(--color-text)">print(int n)</text>
<rect x="474" y="66" width="222" height="42" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="585" y="92" font-size="12" text-anchor="middle" fill="var(--color-text)">print(String t, int n)</text>
<text x="24" y="132" font-size="12" fill="var(--color-neutral-800)">It picks one by looking at the TYPES of the arguments you wrote. All resolved before the program runs.</text>
<rect x="0" y="166" width="720" height="164" rx="20" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="24" y="198" font-size="14.5" font-weight="700" fill="var(--color-accent-2-700)">Overriding — decided by the JVM</text>
<text x="24" y="220" font-size="12" fill="var(--color-neutral-800)">One method, redefined further down the hierarchy:</text>
<rect x="24" y="232" width="280" height="46" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="164" y="252" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">Vehicle.start()</text>
<text x="164" y="269" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">the general version</text>
<line x1="312" y1="255" x2="380" y2="255" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-ov)"/>
<rect x="392" y="232" width="304" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="544" y="252" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Car.start()  @Override</text>
<text x="544" y="269" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">the version that wins if the object is a Car</text>
<text x="24" y="304" font-size="12" fill="var(--color-neutral-800)">It picks one by looking at the actual OBJECT on the Heap. Only knowable once the program is running.</text>
</svg>
<figcaption>Overloading: same class, different signatures, decided at compile time. Overriding: different classes, same signature, decided at runtime.</figcaption>
</figure>

```java
public class Console {
    public void print(String text) { ... }
    public void print(int number) { ... }
    public void print(String text, int times) { ... }
}
```

None of this is inheritance. It is simply convenience: three ways to call something that is conceptually one operation.

> **Return type does not count for overloading.** `int compute()` and `double compute()` in the same class will not compile: the compiler has no way to decide which one you meant when you write a bare `compute();`.

---

## 5. Polymorphism and dynamic dispatch

This is where everything above comes together. A variable declared as `Vehicle` can point at **any** object that is a `Vehicle`, including instances of its subclasses:

```java
Vehicle v = new Car("Toyota");
v.start();   // Prints: "Car Toyota starting with a push button."
```

Notice what happened: the variable says `Vehicle`, but `Car`'s code ran. **That is polymorphism**, and the mechanism is called *dynamic dispatch*.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-poly-t">
<title id="d-poly-t">Dynamic dispatch: the variable type and the object type decide different things</title>
<defs><marker id="ar-poly" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="0" y="22" font-size="14" font-weight="700" fill="var(--color-accent-700)">Vehicle v = new Car("Toyota");</text>
<rect x="0" y="36" width="262" height="112" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="18" y="58" font-size="11" font-weight="700" fill="var(--color-neutral-700)">STACK</text>
<rect x="18" y="68" width="226" height="62" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="92" font-size="13" font-weight="700" fill="var(--color-text)">Vehicle v</text>
<text x="34" y="114" font-size="11" fill="var(--color-neutral-700)">declared type: Vehicle</text>
<line x1="248" y1="99" x2="326" y2="99" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-poly)"/>
<rect x="334" y="36" width="386" height="112" rx="18" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="352" y="58" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">HEAP</text>
<rect x="352" y="68" width="350" height="62" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="368" y="92" font-size="13" font-weight="700" fill="var(--color-accent-700)">Car object</text>
<text x="368" y="114" font-size="11" fill="var(--color-neutral-800)">actual type: Car — the overridden start() lives here</text>
<rect x="0" y="172" width="262" height="46" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="131" y="200" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">v.start();</text>
<line x1="270" y1="195" x2="326" y2="195" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-poly)"/>
<rect x="334" y="172" width="386" height="46" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="527" y="200" font-size="12.5" text-anchor="middle" fill="var(--color-accent-2-800)">"Car Toyota starting with a push button."</text>
<text x="0" y="252" font-size="12.5" fill="var(--color-text)">The VARIABLE type decides which methods you are allowed to write. The compiler checks it.</text>
<text x="0" y="274" font-size="12.5" fill="var(--color-text)">The OBJECT type decides which code actually runs. The JVM resolves it on every call.</text>
<text x="0" y="296" font-size="12" font-weight="700" fill="var(--color-accent-700)">Those two sentences are, literally, the definition of polymorphism.</text>
</svg>
<figcaption>The variable determines the visible contract; the object determines the implementation that runs. Compiler and JVM are looking at different things.</figcaption>
</figure>

### What it is actually for

The value of polymorphism is not in one isolated call — it is in being able to write code that **does not know which subclass it is working with, and does not care**:

```java
public class Garage {
    // This method knows nothing about Car, Motorcycle, or Truck. It does not need to.
    public void inspect(List<Vehicle> fleet) {
        for (Vehicle v : fleet) {
            v.start();   // each object runs ITS own version
            v.brake();
        }
    }
}

List<Vehicle> fleet = List.of(
    new Car("Toyota"),
    new Motorcycle("Honda"),
    new Truck("Scania")
);
new Garage().inspect(fleet);
```

Tomorrow you add a `Bicycle extends Vehicle` class and `Garage` handles it without you touching a single line of it. **That is the payoff**: new code that plugs in without modifying code that already worked.

The alternative without polymorphism is this chain, which grows forever and has to be edited every time:

```java
// The code polymorphism saves you from writing
if (v instanceof Car) {
    ((Car) v).startCar();
} else if (v instanceof Motorcycle) {
    ((Motorcycle) v).startMotorcycle();
} else if (v instanceof Truck) {
    ...
}
```

### Casting and `instanceof`

With a `Vehicle` reference you may only call what `Vehicle` declares. If you need something specific to the subclass you have to cast — and cast with a safety net:

```java
Vehicle v = new Car("Toyota");

// v.openTrunk();  // ERROR: Vehicle does not declare openTrunk()

if (v instanceof Car car) {   // pattern matching, since Java 16
    car.openTrunk();          // 'car' arrives already cast and ready
}
```

Without the check, a cast to the wrong type blows up at runtime with `ClassCastException`. And if you find yourself casting often, take it as a signal: the method you need should probably be declared on the superclass.

---

## 6. When NOT to inherit

Inheritance is the strongest relationship two classes can have: the subclass is tied to the parent's internal details forever. Every change in the superclass can break subclasses nobody touched.

That is why the industry rule is **prefer composition over inheritance**:

```java
// Forced inheritance: is a Car AN Engine? No.
public class Car extends Engine { ... }

// Composition: a Car HAS AN engine. This one holds.
public class Car {
    private final Engine engine;

    public Car(Engine engine) {
        this.engine = engine;
    }

    public void start() {
        engine.ignite();   // delegates to the engine
    }
}
```

Composition lets you swap the engine without touching the car, and test the car with a fake engine. Inheritance lets you do neither.

When a class **must not** be extended, say so with `final` and let the compiler enforce it:

```java
public final class Coordinate { ... }   // nobody can inherit from this

public class Account {
    public final void credit(double amount) { ... }   // this method cannot be overridden
}
```

---

## 7. Everything inherits from `Object`

Even when you never write `extends`, **every Java class inherits from `Object`**. That is where methods you have already used without noticing come from:

```java
public class Car extends Vehicle {
    @Override
    public String toString() {
        return "Car{brand='" + brand + "'}";
    }
}

Car c = new Car("Toyota");
System.out.println(c);   // Java calls toString() on its own
```

Without overriding `toString()`, `System.out.println(c)` prints something like `Car@1b6d3586`: the class name and a hash code. Useless for debugging. Overriding it costs two lines and gives you back hours.

`Object` also brings `equals()` and `hashCode()`, which have rules of their own and plenty of traps. You will cover them in depth in the lesson on iterators and ordering.

---

## 8. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| Overriding while changing the parameters | Java treats it as a brand-new method. The original stays inherited and your code does none of what you expected. | Always write `@Override`: it turns the bug into a compile error. |
| Subclass constructor with no `super(...)` when the parent has no empty constructor | A confusing compile error about a constructor you never wrote. | Explicitly call `super(arguments)` on the first line. |
| Calling an overridable method from the parent's constructor | The subclass version runs before its fields are initialized: unexplained `null` or `0` values. | Have constructors call only `private` or `final` methods. |
| Casting without checking with `instanceof` | `ClassCastException` at runtime. | Use `if (v instanceof Car car)`, or rethink why you need the cast at all. |
| Inheriting just to reuse code, with no real "is-a" | Rigid hierarchies where the subclass inherits meaningless methods. | Compose: hold the object as a field and delegate to it. |
| Confusing overloading with overriding | You expect polymorphism and get a static selection made by the compiler. | Overloading: same class, different signatures. Overriding: subclass, same signature. |

---

## 9. Guided hands-on exercise

### Challenge: an employee hierarchy

1. Create an `Employee` superclass with `name` and `baseSalary` (private with getters), a constructor validating that the salary is not negative, and a `computeSalary()` method returning the base salary.
2. Create `Manager extends Employee`, adding a `bonus` and overriding `computeSalary()` to add it.
3. Create `SalesRep extends Employee`, with `monthlySales` and an 8% commission.
4. Override `toString()` in all three.
5. In `main`, build a `List<Employee>` holding objects of all three types, iterate it **once**, and print each salary. The loop must not use `instanceof` and must not cast.

<details>
<summary>See suggested solution</summary>

```java
import java.util.List;

public class Employee {
    private final String name;
    private final double baseSalary;

    public Employee(String name, double baseSalary) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (baseSalary < 0) {
            throw new IllegalArgumentException("Base salary cannot be negative");
        }
        this.name = name;
        this.baseSalary = baseSalary;
    }

    public String getName() { return name; }
    public double getBaseSalary() { return baseSalary; }

    public double computeSalary() {
        return baseSalary;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + " " + name;
    }
}

public class Manager extends Employee {
    private final double bonus;

    public Manager(String name, double baseSalary, double bonus) {
        super(name, baseSalary);            // first statement, mandatory
        if (bonus < 0) {
            throw new IllegalArgumentException("Bonus cannot be negative");
        }
        this.bonus = bonus;
    }

    @Override
    public double computeSalary() {
        return super.computeSalary() + bonus;   // extends, does not replace
    }
}

public class SalesRep extends Employee {
    private static final double COMMISSION = 0.08;
    private final double monthlySales;

    public SalesRep(String name, double baseSalary, double monthlySales) {
        super(name, baseSalary);
        if (monthlySales < 0) {
            throw new IllegalArgumentException("Sales cannot be negative");
        }
        this.monthlySales = monthlySales;
    }

    @Override
    public double computeSalary() {
        return super.computeSalary() + monthlySales * COMMISSION;
    }
}

public class MainPayroll {
    public static void main(String[] args) {
        List<Employee> payroll = List.of(
            new Employee("Ana Torres", 800000),
            new Manager("Luis Paz", 1500000, 400000),
            new SalesRep("Sofia Rios", 700000, 2500000)
        );

        double total = 0;
        // One loop, no instanceof and no casts:
        for (Employee e : payroll) {
            double salary = e.computeSalary();
            total += salary;
            System.out.printf("%-22s $ %,.2f%n", e, salary);
        }
        System.out.printf("%-22s $ %,.2f%n", "TOTAL", total);
    }
}
```

**The thing to look at here is the loop.** It never asks what type each employee is, and yet each one computes its salary its own way. If tomorrow you add `Intern extends Employee`, that loop keeps working without a single edit. That is polymorphism doing its job.

Notice `super.computeSalary()` too: `Manager` and `SalesRep` do not repeat the base-salary logic, they reuse it and add their own part on top.

</details>

---

## Key takeaways

- `extends` is only justified when the sentence **"an X is a Y"** is true. Otherwise, compose.
- The constructor chain **goes up via `super(...)` and executes coming down**: the parent is always initialized before the child.
- Write `@Override` every time: it turns a silent phantom method into a compile error.
- **Overloading** = same class, different signatures, decided by the compiler. **Overriding** = subclass, same signature, decided by the JVM.
- The variable defines what you can call; the object defines what runs. That is the whole of polymorphism.
- The real benefit is writing code that works with subclasses that do not exist yet.
- Frequent casting is a symptom that the hierarchy is asking for a method on the superclass.
- Prefer composition over inheritance, and mark with `final` whatever must not be extended.
</content>
