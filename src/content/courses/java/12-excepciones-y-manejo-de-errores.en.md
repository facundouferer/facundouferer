---
course: 'java'
slug: '10-excepciones-y-manejo-de-errores'
title: 'Exception Handling and Robustness'
description: 'Understand the Throwable hierarchy, the difference between checked and unchecked, how an exception propagates up the stack, try-with-resources, custom exceptions, and the antipatterns to avoid.'
order: 11
lang: 'en'
published: true
---

# Exception Handling and Robustness

Back in lesson 8 you wrote this:

```java
if (price < 0) {
    throw new IllegalArgumentException("Price cannot be negative");
}
```

You used `throw` without anyone explaining what it means. This lesson closes that gap.

A real program fails constantly, and not because of you: the file is missing, the network drops, the user types `"twenty-two"` where a number belongs, the database refuses the connection. **The question is not whether it will fail, but what your code does when it does.**

Java has a very concrete answer: when something goes wrong, **an object is thrown** describing the problem, and normal execution stops until somebody **catches** it and decides what to do.

---

## 1. An exception is an object

This is the first thing to get out of the way: an exception is not an error code or some magical state. It is **an instance of a class**, with its inheritance hierarchy, its fields, and its methods — exactly like everything else you have been studying.

<figure class="diagram">
<svg viewBox="0 0 720 350" role="img" aria-labelledby="d-thr-t">
<title id="d-thr-t">The Throwable hierarchy with Error, checked Exception, and unchecked RuntimeException</title>
<rect x="270" y="6" width="180" height="44" rx="14" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="360" y="34" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">Throwable</text>
<line x1="360" y1="50" x2="360" y2="72" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="165" y1="72" x2="555" y2="72" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="165" y1="72" x2="165" y2="90" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="555" y1="72" x2="555" y2="90" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<rect x="30" y="90" width="270" height="82" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="48" y="114" font-size="13.5" font-weight="700" fill="var(--color-neutral-900)">Error</text>
<text x="48" y="136" font-size="11.5" fill="var(--color-neutral-800)">OutOfMemoryError, StackOverflowError.</text>
<text x="48" y="154" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">JVM failures. NOT meant to be caught.</text>
<rect x="420" y="90" width="270" height="82" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="438" y="114" font-size="13.5" font-weight="700" fill="var(--color-accent-2-800)">Exception</text>
<text x="438" y="136" font-size="11.5" fill="var(--color-neutral-800)">IOException, SQLException.</text>
<text x="438" y="154" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">CHECKED: the compiler forces you.</text>
<line x1="555" y1="172" x2="555" y2="196" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<rect x="420" y="196" width="270" height="100" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="438" y="220" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">RuntimeException</text>
<text x="438" y="242" font-size="11.5" fill="var(--color-neutral-800)">NullPointerException,</text>
<text x="438" y="260" font-size="11.5" fill="var(--color-neutral-800)">ArithmeticException,</text>
<text x="438" y="278" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">UNCHECKED: the compiler says nothing.</text>
<rect x="30" y="196" width="270" height="100" rx="16" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<text x="48" y="220" font-size="12" font-weight="700" fill="var(--color-neutral-800)">Why not catch an Error?</text>
<text x="48" y="242" font-size="11.5" fill="var(--color-neutral-700)">Because there is nothing you could do.</text>
<text x="48" y="260" font-size="11.5" fill="var(--color-neutral-700)">If the JVM ran out of memory, your catch</text>
<text x="48" y="278" font-size="11.5" fill="var(--color-neutral-700)">block will not get to run either.</text>
<text x="0" y="326" font-size="12" fill="var(--color-neutral-700)">Everything under RuntimeException is unchecked. The rest of Exception is checked. That line splits the world in two.</text>
</svg>
<figcaption>The hierarchy decides who is forced to deal with the failure. It is the single most important design decision when writing your own exception.</figcaption>
</figure>

Like any object, an exception carries useful information:

```java
catch (ArithmeticException e) {
    e.getMessage();       // "/ by zero" — the description
    e.getCause();         // the original exception, if this one wraps it
    e.getStackTrace();    // the full call trail
    e.printStackTrace();  // prints it to the error stream
}
```

---

## 2. `try`, `catch`, `finally` and the order they run in

```java
try {
    // the code that may fail
} catch (SomeException e) {
    // what to do if it fails that particular way
} finally {
    // what must happen no matter what
}
```

<figure class="diagram">
<svg viewBox="0 0 720 370" role="img" aria-labelledby="d-tcf-t">
<title id="d-tcf-t">Which blocks execute with and without an exception in a try-catch-finally</title>
<defs><marker id="ar-tcf" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker></defs>
<text x="0" y="24" font-size="13.5" font-weight="700" fill="var(--color-accent-2-700)">No exception</text>
<text x="375" y="24" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Exception thrown</text>
<rect x="0" y="38" width="345" height="56" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="18" y="60" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">try { ... }</text>
<text x="18" y="80" font-size="11.5" fill="var(--color-neutral-800)">runs in full, down to the last line</text>
<line x1="172" y1="96" x2="172" y2="110" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-tcf)"/>
<rect x="0" y="114" width="345" height="56" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<text x="18" y="136" font-size="12.5" font-weight="700" fill="var(--color-neutral-600)">catch (...) { ... }</text>
<text x="18" y="156" font-size="11.5" fill="var(--color-neutral-600)">SKIPPED entirely</text>
<line x1="172" y1="172" x2="172" y2="186" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-tcf)"/>
<rect x="0" y="190" width="345" height="56" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="18" y="212" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">finally { ... }</text>
<text x="18" y="232" font-size="11.5" fill="var(--color-neutral-800)">runs</text>
<line x1="172" y1="248" x2="172" y2="262" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-tcf)"/>
<rect x="0" y="266" width="345" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="18" y="288" font-size="12.5" font-weight="700" fill="var(--color-text)">the code after it</text>
<text x="18" y="307" font-size="11.5" fill="var(--color-neutral-700)">the program carries on normally</text>
<rect x="375" y="38" width="345" height="56" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="393" y="60" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">try { ... }</text>
<text x="393" y="80" font-size="11.5" fill="var(--color-neutral-800)">CUT SHORT at the failing line</text>
<line x1="547" y1="96" x2="547" y2="110" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-tcf)"/>
<rect x="375" y="114" width="345" height="56" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="393" y="136" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">catch (...) { ... }</text>
<text x="393" y="156" font-size="11.5" fill="var(--color-neutral-800)">runs, if the type matches</text>
<line x1="547" y1="172" x2="547" y2="186" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-tcf)"/>
<rect x="375" y="190" width="345" height="56" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="393" y="212" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">finally { ... }</text>
<text x="393" y="232" font-size="11.5" fill="var(--color-neutral-800)">runs all the same</text>
<line x1="547" y1="248" x2="547" y2="262" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-tcf)"/>
<rect x="375" y="266" width="345" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="393" y="288" font-size="12.5" font-weight="700" fill="var(--color-text)">the code after it</text>
<text x="393" y="307" font-size="11.5" fill="var(--color-neutral-700)">the program carries on normally</text>
<text x="0" y="344" font-size="12" font-weight="700" fill="var(--color-accent-700)">finally ALWAYS runs: exception or not, and even when there is a return inside the try.</text>
<text x="0" y="364" font-size="12" fill="var(--color-neutral-700)">The only thing skipped is the catch, when there was nothing to catch. Everything else runs the same.</text>
</svg>
<figcaption>The <code>try</code> lines after the failure never execute. That is the most common misreading of a long <code>try</code> block.</figcaption>
</figure>

That detail about the `try` being **cut short** matters more than it looks:

```java
try {
    System.out.println("A");
    int x = 10 / 0;              // ← thrown here
    System.out.println("B");     // ← NEVER runs
} catch (ArithmeticException e) {
    System.out.println("C");
}
System.out.println("D");

// Output: A, C, D
```

That is why `try` blocks should be **short**. A forty-line `try` is a block where you cannot tell what state things were left in when the exception fired.

---

## 3. Checked vs unchecked: who forces your hand

This distinction is unique to Java and it shapes how everything else gets written.

**Unchecked** (`RuntimeException` and its descendants): they represent **programming errors**. A `NullPointerException` is not handled, it is prevented. The compiler stays quiet because the fix is not a `catch`, it is fixing the code.

```java
String s = null;
s.length();                  // NullPointerException — the bug is the null, not the exception
int[] a = new int[3];
a[5] = 1;                    // ArrayIndexOutOfBoundsException — the bug is the 5
Integer.parseInt("hello");   // NumberFormatException — validate the input first
```

**Checked** (an `Exception` that is not a `RuntimeException`): they represent **expected environmental conditions** your code does not control. The file may not exist; that is not your bug, that is reality. The compiler forces you to decide.

And there are only two options. **Handle it:**

```java
public void loadConfiguration() {
    try {
        String content = Files.readString(Path.of("config.txt"));
        System.out.println(content);
    } catch (IOException e) {
        System.out.println("Could not read configuration, falling back to defaults.");
    }
}
```

**Or declare that you are not taking responsibility**, and let your caller deal with it:

```java
public String loadConfiguration() throws IOException {
    return Files.readString(Path.of("config.txt"));   // let the caller decide
}
```

> `throw` (throwing, inside the method) and `throws` (declaring, in the signature) are different things spelled almost identically. It is a classic source of confusion: `throw` is an action, `throws` is a warning.

---

## 4. Propagation: how an exception travels

When an exception is thrown and the current method does not catch it, **it is not lost**: the JVM abandons that method and offers the exception to whoever called it, and so on down the stack.

<figure class="diagram">
<svg viewBox="0 0 720 350" role="img" aria-labelledby="d-prop-t">
<title id="d-prop-t">An exception propagating down the call stack until it finds a catch</title>
<defs><marker id="ar-prop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">The exception travels up the stack until somebody catches it</text>
<rect x="60" y="34" width="400" height="56" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="80" y="56" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Integer.parseInt("twenty-two")</text>
<text x="80" y="76" font-size="11.5" fill="var(--color-neutral-800)">throw new NumberFormatException(...)</text>
<text x="476" y="68" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">the exception is BORN here</text>
<rect x="60" y="104" width="400" height="56" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="80" y="126" font-size="12.5" font-weight="700" fill="var(--color-text)">readLine()</text>
<text x="80" y="146" font-size="11.5" fill="var(--color-neutral-700)">has no try/catch</text>
<text x="476" y="138" font-size="11.5" fill="var(--color-neutral-700)">abandoned, keeps travelling</text>
<rect x="60" y="174" width="400" height="56" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="80" y="196" font-size="12.5" font-weight="700" fill="var(--color-text)">processFile()</text>
<text x="80" y="216" font-size="11.5" fill="var(--color-neutral-700)">has no try/catch either</text>
<text x="476" y="208" font-size="11.5" fill="var(--color-neutral-700)">abandoned, keeps travelling</text>
<rect x="60" y="244" width="400" height="56" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="80" y="266" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">main()</text>
<text x="80" y="286" font-size="11.5" fill="var(--color-neutral-800)">catch (NumberFormatException e) { ... }</text>
<text x="476" y="278" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">it STOPS here</text>
<line x1="36" y1="290" x2="36" y2="56" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-prop)"/>
<text x="0" y="326" font-size="12" fill="var(--color-neutral-700)">If nobody catches it, the JVM prints the stack trace and kills the thread. That stack trace is exactly this trail.</text>
</svg>
<figcaption>Every method that does not catch the exception is abandoned immediately: its code after the call never runs.</figcaption>
</figure>

This has an enormous design consequence: **you do not catch where the error happens, you catch where you can do something about it**. A method that reads a file almost never knows what to do if it is missing; the one that does know is whoever asked for the read.

A `catch` that cannot make any useful decision is a `catch` that should not be there.

---

## 5. Multiple `catch` blocks, and order matters

```java
try {
    process(data);
} catch (NumberFormatException e) {       // most specific first
    System.out.println("The value is not a valid number.");
} catch (IllegalArgumentException e) {    // NumberFormatException extends this one
    System.out.println("Invalid argument.");
} catch (Exception e) {                   // the broadest, last
    System.out.println("Unexpected error.");
}
```

Java tries the `catch` blocks **in order** and runs the first whose type matches. That is why they go **from most specific to most general**. Invert the order and the compiler stops you outright: the later blocks would be unreachable.

When two different types are handled the same way, do not duplicate the block — use **multi-catch**.

```java
try {
    connectAndSave();
} catch (IOException | SQLException e) {
    logger.error("Persistence failed: " + e.getMessage());
}
```

---

## 6. `try-with-resources`: the close you cannot forget

When you open a file, a connection, or a socket, you have to close it. Always. Including — especially — when something fails midway. Doing it by hand looks like this:

```java
BufferedReader reader = null;
try {
    reader = new BufferedReader(new FileReader("data.txt"));
    System.out.println(reader.readLine());
} catch (IOException e) {
    System.out.println("Read error.");
} finally {
    if (reader != null) {          // what if constructing it failed?
        try {
            reader.close();        // closing can throw too
        } catch (IOException e) {
            // and here almost nobody knows what to write
        }
    }
}
```

Nine lines of ceremony, two edge cases most people forget, and we still have not read anything useful. That is why `try-with-resources` exists:

```java
try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
    System.out.println(reader.readLine());
} catch (IOException e) {
    System.out.println("Read error.");
}
// reader is already closed, whatever happened
```

<figure class="diagram">
<svg viewBox="0 0 720 290" role="img" aria-labelledby="d-twr-t">
<title id="d-twr-t">All three exits from a try-with-resources block pass through the automatic close</title>
<defs><marker id="ar-twr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="150" y="6" width="420" height="52" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="28" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">try (var reader = new BufferedReader(...)) {</text>
<text x="360" y="47" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">the resource is declared inside the parentheses</text>
<path d="M300 60 L110 60 L110 100" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-twr)"/>
<path d="M360 60 L360 100" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-twr)"/>
<path d="M420 60 L610 60 L610 100" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-twr)"/>
<rect x="0" y="104" width="220" height="52" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="110" y="128" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">It finishes normally</text>
<text x="110" y="146" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">reached the last line</text>
<rect x="250" y="104" width="220" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="360" y="128" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">It throws an exception</text>
<text x="360" y="146" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">cut short halfway</text>
<rect x="500" y="104" width="220" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="610" y="128" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">It hits a return</text>
<text x="610" y="146" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">leaves early</text>
<path d="M110 158 L110 190 L330 190" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-twr)"/>
<path d="M360 158 L360 190" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-twr)"/>
<path d="M610 158 L610 190 L390 190" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-twr)"/>
<rect x="150" y="196" width="420" height="52" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="220" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">reader.close() — automatic</text>
<text x="360" y="238" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">before the catch or the finally even runs</text>
<text x="0" y="278" font-size="12" fill="var(--color-neutral-700)">Works with any class implementing AutoCloseable. You may declare several resources separated by semicolons.</text>
</svg>
<figcaption>All three exit paths converge on the same point. There is no way to forget the <code>close()</code> because you are not the one writing it.</figcaption>
</figure>

---

## 7. Custom exceptions

When the problem belongs to **your domain**, the standard exceptions describe it poorly. `IllegalStateException` is correct but mute; `InsufficientFundsException` tells you what happened from its name alone.

```java
// Unchecked: the caller could have prevented it by checking the balance first
public class InsufficientFundsException extends RuntimeException {
    private final double shortfall;

    public InsufficientFundsException(double requested, double available) {
        super(String.format("Short by $%.2f: $%.2f requested, $%.2f available",
              requested - available, requested, available));
        this.shortfall = requested - available;
    }

    public double getShortfall() { return shortfall; }
}
```

Notice the exception **carries data**, not just text. The `catch` block can use it:

```java
catch (InsufficientFundsException e) {
    System.out.printf("You are $%.2f short. Want to top up?%n", e.getShortfall());
}
```

### Checked or unchecked?

The question that decides it: **can whoever calls this method do something reasonable to recover?**

- **Yes, and it is an expected environmental condition** → `extends Exception` (checked). Example: `ConfigurationFileNotFound`.
- **No, or it is an API misuse** → `extends RuntimeException` (unchecked). Example: `InvalidAgeException`, because the caller should have validated first.

In practice most modern code leans **unchecked**, because checked exceptions force `throws` to propagate through the entire call chain, and that ends up polluting the signatures of methods that have nothing to do with the problem.

### Chaining causes

When you translate a low-level exception into one from your domain, **never lose the original**:

```java
try {
    return repository.findById(id);
} catch (SQLException e) {
    // The second argument is the cause: it preserves the full stack trace
    throw new RepositoryUnavailableException("Could not query customer " + id, e);
}
```

Without that `e`, the stack trace is truncated exactly where the information you needed for debugging lived. It is one of the most expensive mistakes in hours lost.

---

## 8. The four antipatterns

**1. The empty `catch`.** The worst of them, no contest:

```java
try {
    saveOrder(order);
} catch (Exception e) {
    // TODO: look into this later
}
```

The order was not saved, the user sees "done", and there is not a single trace in any log. **A swallowed error is infinitely worse than a visible one.**

**2. Catching `Exception` right away.** It catches everything, including the programming bugs you wanted to blow up loudly and early. Catch the most specific type you actually know how to handle.

**3. Exceptions for normal control flow.** A user not existing is not exceptional, it is Tuesday:

```java
// Bad: uses an exception for something that happens every day
try {
    User u = findUser(email);
    show(u);
} catch (UserNotFoundException e) {
    showSignupForm();
}

// Good: Optional expresses "may be absent" with no exception at all
Optional<User> u = findUser(email);
u.ifPresentOrElse(this::show, this::showSignupForm);
```

Beyond confusing the reader, throwing exceptions is expensive: constructing one captures the entire stack trace.

**4. `return` inside `finally`.** It silently discards the exception that was travelling:

```java
try {
    throw new IllegalStateException("something serious");
} finally {
    return 0;   // the exception VANISHES. Nobody ever finds out.
}
```

---

## 9. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| Empty `catch` | The failure disappears without a trace and the bug shows up much later, unrecognizable. | At minimum, log it. If it really is ignored on purpose, write that down in a comment. |
| `catch (Exception e)` as the first catch | It also traps the programming bugs that should have blown up. | Catch the most specific type you know how to handle. |
| Putting the general catch before the specific one | Compile error: the second `catch` is unreachable. | Order from most specific to most general. |
| Rethrowing without the cause: `throw new MyException(e.getMessage())` | The original stack trace is lost, and with it the line that actually failed. | `throw new MyException("context", e)`. |
| A fifty-line `try` block | Impossible to know what state things were in when the exception fired. | Short `try` blocks, wrapped around the operation that can fail. |
| Closing resources by hand in `finally` | Nesting, null checks, and a `close()` that can also fail. | `try-with-resources`. |
| Using exceptions for ordinary cases | Confusing and slow code: every exception captures the whole stack trace. | `Optional`, return values, or validating up front. |

---

## 10. Guided hands-on exercise

### Challenge: age validation

1. Create an `InvalidAgeException` extending `RuntimeException` that stores the rejected age and builds a descriptive message.
2. Create a `PersonRegistry` class with a `register(String name, int age)` method that throws it when the age is outside 0–120.
3. Add a `registerFromText(String name, String ageText)` method that parses the text and translates the `NumberFormatException` into your own exception, **preserving the cause**.
4. In `main`, try a valid case, an out-of-range age, and a text that is not a number. Catch each one and print a useful message.
5. Use a `finally` block to record that the registration attempt finished, successfully or not.

<details>
<summary>See suggested solution</summary>

```java
public class InvalidAgeException extends RuntimeException {
    private final int rejectedAge;

    public InvalidAgeException(int rejectedAge) {
        super("Invalid age: " + rejectedAge + ". It must be between 0 and 120.");
        this.rejectedAge = rejectedAge;
    }

    // Constructor with a cause: to wrap another exception without losing it
    public InvalidAgeException(String message, Throwable cause) {
        super(message, cause);
        this.rejectedAge = -1;
    }

    public int getRejectedAge() { return rejectedAge; }
}

public class PersonRegistry {
    private static final int MIN_AGE = 0;
    private static final int MAX_AGE = 120;

    public void register(String name, int age) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (age < MIN_AGE || age > MAX_AGE) {
            throw new InvalidAgeException(age);
        }
        System.out.println("  ✓ Registered: " + name + ", age " + age);
    }

    public void registerFromText(String name, String ageText) {
        int age;
        try {
            age = Integer.parseInt(ageText.trim());
        } catch (NumberFormatException e) {
            // Translate into OUR domain language, without losing the cause
            throw new InvalidAgeException(
                "'" + ageText + "' is not a valid number for an age", e);
        }
        register(name, age);   // the range validation lives in exactly one place
    }
}

public class MainRegistry {
    public static void main(String[] args) {
        PersonRegistry registry = new PersonRegistry();

        String[][] attempts = {
            {"Laura Gimenez", "28"},      // valid
            {"Carlos Ruiz",   "150"},     // out of range
            {"Ana Torres",    "thirty"}   // not a number
        };

        for (String[] attempt : attempts) {
            System.out.println("Trying to register " + attempt[0] + "...");
            try {
                registry.registerFromText(attempt[0], attempt[1]);
            } catch (InvalidAgeException e) {
                System.out.println("  ✗ " + e.getMessage());
                if (e.getCause() != null) {
                    // The original cause stays available for the technical log
                    System.out.println("    technical cause: " + e.getCause());
                }
            } catch (IllegalArgumentException e) {
                System.out.println("  ✗ Invalid data: " + e.getMessage());
            } finally {
                System.out.println("  — attempt finished —\n");
            }
        }
    }
}
```

**Three design decisions worth looking at here.**

`InvalidAgeException` is **unchecked** because the caller can validate the age beforehand: it is a usage error, not an environmental condition.

`registerFromText` **translates** the technical `NumberFormatException` into a domain exception, but passes `e` as the cause. The full stack trace remains available; only the language the problem is told in changes.

And `register` is the single place where the range rule lives. `registerFromText` parses and delegates. It is the same principle as the canonical constructor from lesson 8.

</details>

---

## Key takeaways

- An exception is **an object** with a hierarchy, data, and a stack trace. It is not an error code.
- **Unchecked** (`RuntimeException`) = programming error: prevent it, do not handle it. **Checked** = environmental condition: the compiler forces you to decide.
- The `try` block is **cut short** at the failing line; `finally` always runs, even with a `return` in the mix.
- The exception travels up the stack until it finds a `catch`. Catch **where you can act**, not where it happens.
- Order `catch` blocks from most specific to most general, and use multi-catch instead of duplicating blocks.
- `try-with-resources` for anything that opens and closes. No exceptions.
- When rethrowing, **always pass the cause**: without it you lose the line that actually failed.
- An empty `catch` is worse than not catching at all.
</content>
