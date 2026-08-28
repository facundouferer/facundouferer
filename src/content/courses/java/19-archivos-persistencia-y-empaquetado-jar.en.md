---
course: 'java'
slug: '17-archivos-persistencia-y-empaquetado-jar'
title: 'Files, Serialization, and JAR Packaging'
description: 'Learn to persist data with the modern Files and Path API, understand the decorator pattern behind streams, serialize objects and their pitfalls, and package your app into an executable JAR.'
order: 18
lang: 'en'
published: true
---

# Files, Serialization, and JAR Packaging

Everything you have built so far shares one problem: **it disappears when the program closes**. Lists, trees, graphs — all of it lives on the Heap, and the Heap evaporates when the JVM exits.

This lesson closes that loop with two topics that usually travel together: **how to save state to disk** and **how to ship your application** so somebody else can run it without your source code.

---

## 1. The two I/O families, and the decorator pattern

Java has two parallel I/O hierarchies, and mixing them up is the first source of bugs.

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-io-t">
<title id="d-io-t">Java's two stream families and the decorator pattern that wraps them</title>
<defs><marker id="ar-io" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="0" width="348" height="130" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="18" y="28" font-size="13" font-weight="700" fill="var(--color-neutral-900)">Bytes — binary data</text>
<text x="18" y="52" font-size="11.5" font-weight="700" fill="var(--color-text)">InputStream · OutputStream</text>
<text x="18" y="74" font-size="11.5" fill="var(--color-neutral-800)">Images, PDFs, audio, serialized</text>
<text x="18" y="92" font-size="11.5" fill="var(--color-neutral-800)">objects: anything that is not</text>
<text x="18" y="110" font-size="11.5" fill="var(--color-neutral-800)">readable text.</text>
<rect x="372" y="0" width="348" height="130" rx="18" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="390" y="28" font-size="13" font-weight="700" fill="var(--color-accent-2-700)">Characters — text</text>
<text x="390" y="52" font-size="11.5" font-weight="700" fill="var(--color-text)">Reader · Writer</text>
<text x="390" y="74" font-size="11.5" fill="var(--color-neutral-800)">They apply a CHARSET when turning</text>
<text x="390" y="92" font-size="11.5" fill="var(--color-neutral-800)">bytes into characters. Without one,</text>
<text x="390" y="110" font-size="11.5" fill="var(--color-neutral-800)">accents and non-ASCII break.</text>
<text x="0" y="164" font-size="13" font-weight="700" fill="var(--color-accent-700)">The decorator pattern: each layer adds one capability</text>
<rect x="0" y="178" width="500" height="94" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="202" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">BufferedReader</text>
<text x="140" y="202" font-size="11" fill="var(--color-neutral-800)">reads 8 KB blocks and serves them line by line</text>
<rect x="20" y="212" width="460" height="48" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="38" y="234" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">FileReader</text>
<text x="140" y="234" font-size="11" fill="var(--color-neutral-800)">knows how to open a file and read characters</text>
<rect x="38" y="240" width="424" height="16" rx="6" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="52" y="252" font-size="10.5" fill="var(--color-neutral-700)">"data.txt" — the actual file on disk</text>
<line x1="504" y1="225" x2="540" y2="225" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-io)"/>
<text x="548" y="204" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">Without the buffer,</text>
<text x="548" y="222" font-size="11.5" fill="var(--color-neutral-800)">each character is a trip</text>
<text x="548" y="240" font-size="11.5" fill="var(--color-neutral-800)">to disk. With it, one</text>
<text x="548" y="258" font-size="11.5" fill="var(--color-neutral-800)">trip every 8 KB.</text>
<text x="0" y="298" font-size="12" fill="var(--color-neutral-800)">new BufferedReader(new FileReader("data.txt"))  —  read it inside out: FileReader touches the disk,</text>
<text x="0" y="316" font-size="12" fill="var(--color-neutral-800)">BufferedReader cushions it. Same composition idea as lesson 10: wrap instead of inherit.</text>
<text x="0" y="336" font-size="12" font-weight="700" fill="var(--color-accent-700)">Reading a 10 MB file unbuffered can be a hundred times slower. This is not an optional optimization.</text>
</svg>
<figcaption>The <code>Buffered*</code> classes do not change what you do, they change how many times the disk is touched. That is why you always wrap.</figcaption>
</figure>

---

## 2. The modern way: `Files` and `Path`

Since Java 7 there is NIO.2, and for 90% of cases it turns ten lines into one.

<figure class="diagram">
<svg viewBox="0 0 720 250" role="img" aria-labelledby="d-nio-t">
<title id="d-nio-t">Comparison between the classic java.io API and the modern Files API</title>
<rect x="0" y="0" width="720" height="110" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="20" y="26" font-size="12.5" font-weight="700" fill="var(--color-neutral-900)">Classic java.io — reading a whole file</text>
<rect x="20" y="36" width="480" height="60" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="55" font-size="11" fill="var(--color-text)">StringBuilder sb = new StringBuilder();</text>
<text x="34" y="72" font-size="11" fill="var(--color-text)">try (BufferedReader r = new BufferedReader(new FileReader(f))) {</text>
<text x="34" y="89" font-size="11" fill="var(--color-text)">    String l; while ((l = r.readLine()) != null) sb.append(l).append("\n");  }</text>
<text x="518" y="60" font-size="12" font-weight="700" fill="var(--color-neutral-800)">4 lines, a loop,</text>
<text x="518" y="80" font-size="11.5" fill="var(--color-neutral-700)">and an assignment inside</text>
<text x="518" y="96" font-size="11.5" fill="var(--color-neutral-700)">the condition.</text>
<rect x="0" y="126" width="720" height="110" rx="18" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="20" y="152" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">Modern NIO.2 — the same thing</text>
<rect x="20" y="162" width="480" height="60" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="188" font-size="11.5" fill="var(--color-text)">Path path = Path.of("data.txt");</text>
<text x="34" y="210" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">String text = Files.readString(path);</text>
<text x="518" y="186" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">1 line</text>
<text x="518" y="206" font-size="11.5" fill="var(--color-neutral-800)">UTF-8 by default, closes</text>
<text x="518" y="222" font-size="11.5" fill="var(--color-neutral-800)">itself, no loop.</text>
</svg>
<figcaption>The classic API is still needed for huge files that will not fit in memory. For everything else, <code>Files</code>.</figcaption>
</figure>

```java
import java.nio.file.*;
import java.io.IOException;

Path path = Path.of("data", "catalog.txt");   // builds the path without manual separators

// Read it all at once (small and medium files)
String content = Files.readString(path);
List<String> lines = Files.readAllLines(path);

// Write
Files.writeString(path, "hello\n");                                 // overwrites
Files.writeString(path, "another line\n", StandardOpenOption.APPEND); // appends

// Queries
boolean exists = Files.exists(path);
long size      = Files.size(path);
Files.createDirectories(path.getParent());   // creates the whole hierarchy if missing
```

For large files, `Files.lines()` returns a lazy stream: **it processes line by line without loading everything into memory**.

```java
// Counts error lines in a 2 GB log without using 2 GB of RAM
try (Stream<String> lines = Files.lines(Path.of("app.log"))) {
    long errors = lines.filter(l -> l.contains("ERROR")).count();
    System.out.println("Errors: " + errors);
}
```

Note the `try-with-resources` from lesson 11: `Files.lines` opens a file, so it must be closed. `readString` and `readAllLines` do not need it because they close themselves.

### The charset trap

This is the classic bug that only shows up on somebody else's machine:

```java
// BAD: uses the operating system's default charset
new FileReader("data.txt");
new FileWriter("output.txt");

// GOOD: the charset is explicit and the file reads the same everywhere
Files.readString(path);                                    // UTF-8 by default
Files.newBufferedReader(path, StandardCharsets.UTF_8);
new FileWriter("output.txt", StandardCharsets.UTF_8);
```

A file written with Windows' default charset and read with Linux's turns every accented character into garbage. **Always pin UTF-8 explicitly.**

---

## 3. Serialization: saving whole objects

Writing text is fine for simple data. But how do you save a `Product` with all its fields, or an entire list of them?

**Serialization** turns a Heap object into a sequence of bytes, and back.

<figure class="diagram">
<svg viewBox="0 0 720 310" role="img" aria-labelledby="d-ser-t">
<title id="d-ser-t">The serialization and deserialization cycle of an object to a file</title>
<defs><marker id="ar-se" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="30" width="196" height="76" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="98" y="54" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Object on the Heap</text>
<text x="98" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">Product("Tea", 3200)</text>
<text x="98" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">lives in memory</text>
<line x1="198" y1="68" x2="238" y2="68" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-se)"/>
<rect x="244" y="30" width="212" height="76" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="350" y="54" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">ObjectOutputStream</text>
<text x="350" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">writeObject(product)</text>
<text x="350" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">walks the fields and flattens them</text>
<line x1="458" y1="68" x2="498" y2="68" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-se)"/>
<rect x="504" y="30" width="216" height="76" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="612" y="54" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">catalog.ser</text>
<text x="612" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">bytes on disk</text>
<text x="612" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">outlives the program</text>
<line x1="612" y1="110" x2="612" y2="140" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-se)"/>
<line x1="98" y1="140" x2="98" y2="110" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-se)"/>
<rect x="244" y="146" width="212" height="60" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="350" y="170" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">ObjectInputStream</text>
<text x="350" y="190" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">readObject() → a NEW object</text>
<line x1="504" y1="176" x2="460" y2="176" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-se)"/>
<line x1="240" y1="176" x2="200" y2="176" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-se)"/>
<text x="512" y="180" font-size="11" fill="var(--color-neutral-700)">reads</text>
<text x="0" y="180" font-size="11" fill="var(--color-neutral-700)">rebuilds</text>
<rect x="0" y="226" width="348" height="76" rx="16" fill="var(--color-neutral-100)" stroke="var(--color-neutral-500)" stroke-dasharray="5 4"/>
<text x="18" y="250" font-size="11.5" font-weight="700" fill="var(--color-neutral-900)">transient — what is NOT saved</text>
<text x="18" y="270" font-size="11" fill="var(--color-neutral-800)">Passwords, connections, caches. They come</text>
<text x="18" y="288" font-size="11" fill="var(--color-neutral-800)">back as null or 0.</text>
<rect x="372" y="226" width="348" height="76" rx="16" fill="var(--color-neutral-100)" stroke="var(--color-neutral-500)" stroke-dasharray="5 4"/>
<text x="390" y="250" font-size="11.5" font-weight="700" fill="var(--color-neutral-900)">serialVersionUID — the version number</text>
<text x="390" y="270" font-size="11" fill="var(--color-neutral-800)">If the class changes and you did not declare it,</text>
<text x="390" y="288" font-size="11" fill="var(--color-neutral-800)">Java recomputes it: InvalidClassException.</text>
</svg>
<figcaption>The object coming out of <code>readObject()</code> is <em>new</em>: same data, different memory address. And the class constructor never runs.</figcaption>
</figure>

```java
import java.io.*;
import java.util.List;

public class Product implements Serializable {           // marker: "I am serializable"
    private static final long serialVersionUID = 1L;     // ALWAYS declare it by hand

    private final String name;
    private final double price;
    private transient String computationCache;           // NOT saved

    public Product(String name, double price) {
        this.name = name;
        this.price = price;
    }
}

// Save a whole list in one go
try (ObjectOutputStream out = new ObjectOutputStream(
         Files.newOutputStream(Path.of("catalog.ser")))) {
    out.writeObject(catalog);
}

// Read it back
try (ObjectInputStream in = new ObjectInputStream(
         Files.newInputStream(Path.of("catalog.ser")))) {
    @SuppressWarnings("unchecked")
    List<Product> catalog = (List<Product>) in.readObject();
}
```

Three things you must know:

1. **Declare `serialVersionUID` by hand.** If you do not, Java derives one from the class structure. Add a field, that number changes, and every previously saved file becomes unreadable with `InvalidClassException`.
2. **`transient` excludes a field.** On deserialization it comes back as `null` or `0`. That is correct for passwords, open connections, and caches.
3. **The constructor does not run.** Java rebuilds the object field by field, skipping your constructor entirely. Every validation you put there **is not applied**.

> **In 2026, Java serialization is rare in new systems.** The format is proprietary — only another Java program can read it — it is brittle under class changes, and it has been the source of serious deserialization vulnerabilities. To exchange data today people use **JSON** (with Jackson or Gson) or binary formats like Protobuf. Learn it because you will meet it in existing code, not because it is the first choice.

---

## 4. Packaging: from source code to an executable JAR

Your program works in your IDE. Now you have to ship it.

<figure class="diagram">
<svg viewBox="0 0 720 250" role="img" aria-labelledby="d-jar-t">
<title id="d-jar-t">From source code to an executable JAR, step by step</title>
<defs><marker id="ar-jr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="30" width="150" height="70" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="75" y="56" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">Main.java</text>
<text x="75" y="76" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">source code</text>
<text x="75" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">that you write</text>
<line x1="152" y1="65" x2="188" y2="65" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-jr)"/>
<text x="170" y="56" font-size="10" text-anchor="middle" fill="var(--color-accent-700)">javac</text>
<rect x="194" y="30" width="150" height="70" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="269" y="56" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">Main.class</text>
<text x="269" y="76" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">bytecode</text>
<text x="269" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">the JVM understands</text>
<line x1="346" y1="65" x2="382" y2="65" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-jr)"/>
<text x="364" y="56" font-size="10" text-anchor="middle" fill="var(--color-accent-700)">jar</text>
<rect x="388" y="30" width="150" height="70" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="463" y="56" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">app.jar</text>
<text x="463" y="76" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">a ZIP with all the</text>
<text x="463" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">.class files inside</text>
<line x1="540" y1="65" x2="576" y2="65" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-jr)"/>
<rect x="582" y="30" width="138" height="70" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="651" y="56" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">java -jar</text>
<text x="651" y="76" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">runs on any machine</text>
<text x="651" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">with a JVM</text>
<rect x="150" y="130" width="420" height="94" rx="16" fill="var(--color-neutral-100)" stroke="var(--color-neutral-500)"/>
<text x="170" y="154" font-size="12" font-weight="700" fill="var(--color-neutral-900)">META-INF/MANIFEST.MF — inside the JAR</text>
<text x="170" y="178" font-size="11.5" fill="var(--color-text)">Manifest-Version: 1.0</text>
<text x="170" y="198" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">Main-Class: com.facundouferer.shop.Main</text>
<text x="170" y="216" font-size="11" fill="var(--color-neutral-700)">Without that line, java -jar has no idea where to start and fails.</text>
<line x1="463" y1="102" x2="420" y2="128" stroke="var(--color-neutral-500)" stroke-width="1.5" stroke-dasharray="4 3"/>
</svg>
<figcaption>A JAR is literally a ZIP file with a naming convention. You can open one with any unzip tool and look inside.</figcaption>
</figure>

```bash
# 1. Compile everything into bin/
javac -d bin $(find src -name "*.java")

# 2. Package it. The 'e' flag declares the main class in the manifest
jar cvfe app.jar com.facundouferer.shop.Main -C bin .

# 3. Run it on any machine with a JVM
java -jar app.jar
```

The `jar` flags: `c` create, `v` verbose, `f` file name, `e` entry point. The `-C bin .` part means "change into the `bin` folder and include everything in it".

In a real project you will use **Maven** or **Gradle**, which do this plus download dependencies, run the tests, and build a *fat jar* with the libraries bundled in:

```bash
mvn package        # jar lands in target/
./gradlew build    # jar lands in build/libs/
```

---

## 5. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| Not closing the file | The file stays locked and, when writing, whatever sat in the buffer is lost. | `try-with-resources`, always. |
| Using `FileReader`/`FileWriter` without a charset | It reads fine on your machine and breaks on another. Accents turn into garbage. | Pass `StandardCharsets.UTF_8` explicitly, or use `Files`. |
| Reading a huge file with `readAllLines` | `OutOfMemoryError` on a multi-GB log. | `Files.lines()` inside a `try-with-resources`. |
| Not declaring `serialVersionUID` | You add a field and every saved file stops loading: `InvalidClassException`. | `private static final long serialVersionUID = 1L;`. |
| Expecting the constructor to run on deserialization | Validations are skipped and the object can come back invalid. | Validate in `readObject`, or skip native serialization entirely. |
| Concatenating paths with `"/"` or `"\\"` by hand | Breaks when the operating system changes. | `Path.of("folder", "file.txt")`. |
| `jar` with no `Main-Class` in the manifest | `java -jar` replies "no main manifest attribute". | Use `jar cvfe` with the main class, or declare it in the manifest. |
| Serializing objects holding non-serializable fields | `NotSerializableException` at runtime. | Mark them `transient`, or make the class `Serializable` too. |

---

## 6. Guided hands-on exercise

### Challenge: a persistent catalog

1. Create a serializable `Product` with a declared `serialVersionUID`.
2. Write a `Catalog` with `save(Path)` and `load(Path)` using serialization.
3. Add `exportCSV(Path)` and `importCSV(Path)` using the `Files` API.
4. Handle "the file does not exist" by returning an empty catalog instead of blowing up.
5. Compare the two formats: open the `.ser` and the `.csv` in a text editor.

<details>
<summary>See suggested solution</summary>

```java
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Stream;

public class Product implements Serializable {
    private static final long serialVersionUID = 1L;   // declared by hand, on purpose

    private final String name;
    private final double price;
    private final int stock;

    public Product(String name, double price, int stock) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (price < 0) throw new IllegalArgumentException("Negative price");
        this.name = name;
        this.price = price;
        this.stock = stock;
    }

    public String getName() { return name; }
    public double getPrice() { return price; }
    public int getStock()    { return stock; }

    public String toCSVLine() {
        // Escape quotes in the name so the format does not break
        return String.format(Locale.US, "\"%s\";%.2f;%d",
                             name.replace("\"", "\"\""), price, stock);
    }

    public static Product fromCSVLine(String line) {
        String[] fields = line.split(";");
        if (fields.length != 3) {
            throw new IllegalArgumentException("Invalid CSV line: " + line);
        }
        String name = fields[0].replaceAll("^\"|\"$", "").replace("\"\"", "\"");
        return new Product(name,
                           Double.parseDouble(fields[1]),
                           Integer.parseInt(fields[2]));
    }

    @Override
    public String toString() {
        return String.format(Locale.US, "%-20s $%9.2f  x%d", name, price, stock);
    }
}

public class Catalog {

    private final List<Product> products = new ArrayList<>();

    public void add(Product p) { products.add(p); }
    public List<Product> getProducts() { return List.copyOf(products); }  // defensive copy

    // ── Native serialization: binary, Java-only ─────────────────
    public void save(Path path) throws IOException {
        Files.createDirectories(path.toAbsolutePath().getParent());
        try (ObjectOutputStream out = new ObjectOutputStream(
                 new BufferedOutputStream(Files.newOutputStream(path)))) {
            out.writeObject(products);
        }
    }

    @SuppressWarnings("unchecked")
    public static Catalog load(Path path) throws IOException, ClassNotFoundException {
        Catalog catalog = new Catalog();
        if (!Files.exists(path)) {
            return catalog;   // 4. missing file → empty catalog, no exception
        }
        try (ObjectInputStream in = new ObjectInputStream(
                 new BufferedInputStream(Files.newInputStream(path)))) {
            catalog.products.addAll((List<Product>) in.readObject());
        }
        return catalog;
    }

    // ── CSV: text, any program can read it ──────────────────────
    public void exportCSV(Path path) throws IOException {
        List<String> lines = new ArrayList<>();
        lines.add("name;price;stock");                       // header
        for (Product p : products) {
            lines.add(p.toCSVLine());
        }
        Files.write(path, lines, StandardCharsets.UTF_8);    // explicit charset
    }

    public static Catalog importCSV(Path path) throws IOException {
        Catalog catalog = new Catalog();
        if (!Files.exists(path)) return catalog;

        // Lazy stream: works exactly the same on a 5 GB CSV
        try (Stream<String> lines = Files.lines(path, StandardCharsets.UTF_8)) {
            lines.skip(1)                                    // skip the header
                 .filter(l -> !l.isBlank())
                 .map(Product::fromCSVLine)
                 .forEach(catalog::add);
        }
        return catalog;
    }

    public static void main(String[] args) throws Exception {
        Path ser = Path.of("data", "catalog.ser");
        Path csv = Path.of("data", "catalog.csv");
        Files.createDirectories(Path.of("data"));

        Catalog original = new Catalog();
        original.add(new Product("Loose leaf tea", 3200.00, 45));
        original.add(new Product("Ground coffee",  5800.50, 12));
        original.add(new Product("Sugar 1kg",      1150.00, 80));

        original.save(ser);
        original.exportCSV(csv);

        System.out.println("Recovered from .ser:");
        Catalog.load(ser).getProducts().forEach(p -> System.out.println("  " + p));

        System.out.println("\nRecovered from .csv:");
        Catalog.importCSV(csv).getProducts().forEach(p -> System.out.println("  " + p));

        System.out.println("\nMissing file → " +
            Catalog.load(Path.of("does-not-exist.ser")).getProducts().size() + " products");

        System.out.println("\nSizes:  .ser " + Files.size(ser) +
                           " bytes   ·   .csv " + Files.size(csv) + " bytes");
        System.out.println("\nCSV contents (readable by anyone):");
        Files.lines(csv).forEach(l -> System.out.println("  " + l));
    }
}
```

**Open both files in a text editor. That comparison is the real exercise.**

The `.csv` reads perfectly, Excel opens it, Python can parse it, and if tomorrow you add a field to `Product`, the old files remain readable.

The `.ser` is unreadable binary, only another Java program understands it, and if you add a field without minding `serialVersionUID`, every saved file turns to garbage.

That is why, unless you specifically need native serialization — caching between Java processes, replicated `HttpSession` — **pick a text format**. Today that would be JSON with Jackson, which is exactly what you will see in the next lesson with Spring Boot.

One detail worth noticing: `importCSV` uses `Files.lines()` with `try-with-resources` and a lazy stream. That same code works on a three-line CSV or a five-gigabyte one, because it never loads the whole file into memory.

</details>

---

## Key takeaways

- **Bytes** (`InputStream`/`OutputStream`) for binary; **characters** (`Reader`/`Writer`) for text with a charset.
- The `Buffered*` classes are a **decorator**: they do not change what you do, they change how often the disk is touched.
- For 90% of cases, `Files.readString`, `Files.writeString`, and `Files.lines` replace the whole classic API.
- **Pin UTF-8 explicitly.** The default charset is the cause of the bug that only appears on another machine.
- `Files.lines()` processes huge files without loading them, but needs `try-with-resources`.
- On deserialization, **the constructor does not run**: your validations are skipped.
- Declare `serialVersionUID` by hand or you will lose every saved file on the first class change.
- Prefer **text formats** (CSV, JSON) over native serialization: portable, readable, and stable.
- A JAR is a ZIP with a `MANIFEST.MF`; without `Main-Class` it is not executable.
</content>
