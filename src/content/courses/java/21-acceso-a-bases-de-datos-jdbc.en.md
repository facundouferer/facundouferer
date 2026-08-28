---
course: 'java'
slug: '19-acceso-a-bases-de-datos-jdbc'
title: 'Database Access with JDBC and Safe SQL'
description: 'Connect your application to a relational database with JDBC, understand why PreparedStatement eliminates SQL injection, handle transactions with commit and rollback, and organize data access with the DAO pattern.'
order: 21
lang: 'en'
published: true
---

# Database Access with JDBC and Safe SQL

In lesson 18 you saved data to files. It works — but try this with a file: find every product with stock below 10, sorted by price, while three other users are writing at the same time.

That is exactly what a **relational database** does, and why it exists. **JDBC** is the bridge between your Java code and it.

---

## 1. The architecture: why there is a layer in between

<figure class="diagram">
<svg viewBox="0 0 720 270" role="img" aria-labelledby="d-jdbc-t">
<title id="d-jdbc-t">The layers between application code and the database engine</title>
<defs><marker id="ar-jd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="20" width="720" height="52" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="20" y="42" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">Your code — ProductDAO, CustomerDAO</text>
<text x="20" y="62" font-size="11" fill="var(--color-neutral-800)">Speaks in objects: save(product), findById(4). It has no idea which engine sits below.</text>
<line x1="360" y1="74" x2="360" y2="94" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-jd)"/>
<rect x="0" y="98" width="720" height="52" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="120" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">java.sql — the standard JDBC API</text>
<text x="20" y="140" font-size="11" fill="var(--color-neutral-800)">Connection, PreparedStatement, ResultSet. They are INTERFACES: lesson 10 in its purest form.</text>
<line x1="360" y1="152" x2="360" y2="172" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-jd)"/>
<rect x="0" y="176" width="232" height="46" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="116" y="196" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">PostgreSQL driver</text>
<text x="116" y="214" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">implements the interfaces</text>
<rect x="244" y="176" width="232" height="46" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="360" y="196" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">MySQL driver</text>
<text x="360" y="214" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">implements the interfaces</text>
<rect x="488" y="176" width="232" height="46" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="604" y="196" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">H2 / SQLite driver</text>
<text x="604" y="214" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">implements the interfaces</text>
<text x="0" y="248" font-size="12" font-weight="700" fill="var(--color-accent-700)">Moving from PostgreSQL to MySQL means swapping a dependency and a URL. Your code never notices.</text>
<text x="0" y="266" font-size="11.5" fill="var(--color-neutral-700)">It is exactly the benefit of programming against interfaces, applied at industry scale.</text>
</svg>
<figcaption>JDBC is a contract; each vendor writes its implementation. Lesson 10 explained why that is worth it — here you see the payoff.</figcaption>
</figure>

```java
// The connection: URL, user, password
String url = "jdbc:postgresql://localhost:5432/shop";

try (Connection conn = DriverManager.getConnection(url, "user", "secret")) {
    System.out.println("Connected to " + conn.getMetaData().getDatabaseProductName());
}
```

Note the `try-with-resources` from lesson 11. **An unclosed connection is a leaked resource**, and with enough of them the database refuses new connections and the whole application goes down.

---

## 2. `Statement` vs `PreparedStatement`: the world's most famous vulnerability

This is the most important part of the lesson. Look at this code, which seems harmless:

```java
// NEVER DO THIS
String email = askTheUser();
String sql = "SELECT * FROM users WHERE email = '" + email + "'";
ResultSet rs = statement.executeQuery(sql);
```

<figure class="diagram">
<svg viewBox="0 0 720 350" role="img" aria-labelledby="d-inj-t">
<title id="d-inj-t">How malicious input becomes executable SQL through string concatenation</title>
<rect x="0" y="0" width="720" height="166" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)" stroke-width="2"/>
<text x="20" y="26" font-size="13" font-weight="700" fill="var(--color-neutral-900)">Concatenating user input — the data becomes CODE</text>
<rect x="20" y="38" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="58" font-size="11.5" fill="var(--color-text)">The user types into the form:   ' OR '1'='1</text>
<rect x="20" y="74" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="94" font-size="11.5" fill="var(--color-text)">Your code builds:   "SELECT * FROM users WHERE email = '" + input + "'"</text>
<rect x="20" y="110" width="680" height="30" rx="10" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<text x="34" y="130" font-size="11.5" font-weight="700" fill="var(--color-neutral-900)">The database receives:   SELECT * FROM users WHERE email = '' OR '1'='1'</text>
<text x="20" y="158" font-size="11.5" font-weight="700" fill="var(--color-neutral-900)">'1'='1' is always true → it returns EVERY user in the table.</text>
<rect x="0" y="182" width="720" height="166" rx="18" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="20" y="208" font-size="13" font-weight="700" fill="var(--color-accent-2-700)">With PreparedStatement — the data is NEVER code</text>
<rect x="20" y="220" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="240" font-size="11.5" fill="var(--color-text)">1. The template is sent first:   SELECT * FROM users WHERE email = ?</text>
<rect x="20" y="256" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="276" font-size="11.5" fill="var(--color-text)">2. The database compiles it and fixes its structure. It knows there is ONE parameter, and where.</text>
<rect x="20" y="292" width="680" height="30" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="34" y="312" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">3. The value travels separately, as DATA. It literally looks for the email  ' OR '1'='1</text>
<text x="20" y="340" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">It finds nobody, which is exactly right. The attack disappears by construction.</text>
</svg>
<figcaption>The difference is not that <code>PreparedStatement</code> "escapes quotes": it is that the query structure is fixed before the data exists. There is nothing left to escape.</figcaption>
</figure>

```java
// ALWAYS LIKE THIS
String sql = "SELECT id, name, price FROM products WHERE category = ? AND price < ?";

try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, category);      // indices start at 1, not 0
    ps.setDouble(2, maxPrice);

    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getString("name") + " — $" + rs.getDouble("price"));
        }
    }
}
```

Beyond security, `PreparedStatement` gives you two things for free:

- **Performance**: the database compiles the execution plan once and reuses it for every different value.
- **Typing**: `setDouble`, `setDate`, `setBoolean` handle the formatting. No more fighting date formats inside a SQL string.

> Parameter indices **start at 1**. It is one of the very few things in Java that does not start at zero, and a guaranteed `SQLException` the first time around.

---

## 3. Reading results and modifying data

A `ResultSet` is a **cursor**: it starts *before* the first row, and `next()` advances and returns `false` when there is nothing left.

```java
List<Product> products = new ArrayList<>();

try (PreparedStatement ps = conn.prepareStatement("SELECT id, name, price, stock FROM products");
     ResultSet rs = ps.executeQuery()) {

    while (rs.next()) {                       // ← without this while, you read nothing
        products.add(new Product(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getDouble("price"),
            rs.getInt("stock")
        ));
    }
}
```

To modify data you use `executeUpdate()`, which returns **how many rows were affected**:

```java
// INSERT, retrieving the id the database generates
String sql = "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)";

try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    ps.setString(1, "Loose leaf tea");
    ps.setDouble(2, 3200.00);
    ps.setInt(3, 45);

    int rows = ps.executeUpdate();
    System.out.println("Inserted: " + rows);

    try (ResultSet keys = ps.getGeneratedKeys()) {
        if (keys.next()) {
            System.out.println("Assigned id: " + keys.getLong(1));
        }
    }
}

// UPDATE — the WHERE is not optional
try (PreparedStatement ps = conn.prepareStatement(
         "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?")) {
    ps.setInt(1, quantity);
    ps.setLong(2, id);
    ps.setInt(3, quantity);        // the condition prevents negative stock

    if (ps.executeUpdate() == 0) {
        throw new IllegalStateException("Not enough stock, or the product does not exist");
    }
}
```

Notice that `if (executeUpdate() == 0)`: **the return value is information, not noise**. An `UPDATE` affecting zero rows almost always means something did not go as you expected.

---

## 4. Transactions: all or nothing

By default JDBC runs in **autocommit**: every statement is committed on its own, as soon as it runs. For a single operation that is fine. For two that depend on each other, it is a bomb.

<figure class="diagram">
<svg viewBox="0 0 720 320" role="img" aria-labelledby="d-tx-t">
<title id="d-tx-t">A bank transfer under autocommit versus the same one inside a transaction</title>
<rect x="0" y="0" width="720" height="140" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)" stroke-width="2"/>
<text x="20" y="26" font-size="13" font-weight="700" fill="var(--color-neutral-900)">autocommit = true (the default)</text>
<rect x="20" y="38" width="330" height="42" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="34" y="56" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">UPDATE accounts SET balance = balance - 5000</text>
<text x="34" y="73" font-size="11" fill="var(--color-neutral-800)">✓ committed instantly, no way back</text>
<rect x="370" y="38" width="330" height="42" rx="12" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<text x="384" y="56" font-size="11.5" font-weight="700" fill="var(--color-neutral-900)">UPDATE accounts SET balance = balance + 5000</text>
<text x="384" y="73" font-size="11" fill="var(--color-neutral-800)">✗ fails: the network dropped</text>
<text x="20" y="104" font-size="12" font-weight="700" fill="var(--color-neutral-900)">Result: the money left one account and never reached the other. It evaporated.</text>
<text x="20" y="126" font-size="11.5" fill="var(--color-neutral-800)">And no exception can fix it: the first UPDATE is already committed to disk.</text>
<rect x="0" y="156" width="720" height="164" rx="18" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="20" y="182" font-size="13" font-weight="700" fill="var(--color-accent-2-700)">conn.setAutoCommit(false) — one transaction</text>
<rect x="20" y="194" width="330" height="42" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="212" font-size="11.5" font-weight="700" fill="var(--color-text)">UPDATE ... balance - 5000</text>
<text x="34" y="229" font-size="11" fill="var(--color-neutral-700)">pending, not committed yet</text>
<rect x="370" y="194" width="330" height="42" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="384" y="212" font-size="11.5" font-weight="700" fill="var(--color-text)">UPDATE ... balance + 5000</text>
<text x="384" y="229" font-size="11" fill="var(--color-neutral-700)">✗ fails</text>
<rect x="20" y="246" width="680" height="38" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="34" y="270" font-size="12" font-weight="700" fill="var(--color-accent-2-800)">catch → conn.rollback()  —  the database undoes EVERYTHING, first UPDATE included</text>
<text x="20" y="306" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">Result: both accounts stay as they were. Either both things happen, or neither does.</text>
</svg>
<figcaption>A transaction is not a "just in case": it is the only way two dependent operations cannot end up half-done.</figcaption>
</figure>

```java
Connection conn = getConnection();
try {
    conn.setAutoCommit(false);              // 1. open the transaction

    debit(conn, sourceAccount, amount);
    credit(conn, targetAccount, amount);

    conn.commit();                          // 2. both succeeded: confirm

} catch (SQLException e) {
    conn.rollback();                        // 3. something failed: undo everything
    throw new TransferFailedException("Transfer could not be completed", e);  // lesson 11
} finally {
    conn.setAutoCommit(true);               // 4. leave the connection as we found it
    conn.close();
}
```

That `finally` with `setAutoCommit(true)` matters more than it looks: if the connection comes from a **pool** — and in production it always does — the next person to use it inherits whatever configuration you left behind.

---

## 5. Connections and pools

Opening a connection is **expensive**: DNS resolution, TCP handshake, authentication, protocol negotiation. Easily tens of milliseconds. Doing it per query is not viable.

That is why production uses a **connection pool**: a set of already-open connections that get lent out and returned.

```java
// HikariCP — the de facto standard, and what Spring Boot ships by default
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:postgresql://localhost:5432/shop");
config.setUsername("user");
config.setPassword("secret");
config.setMaximumPoolSize(10);

DataSource dataSource = new HikariDataSource(config);

// conn.close() does NOT close the connection: it returns it to the pool
try (Connection conn = dataSource.getConnection()) {
    // ...
}
```

With a pool, `close()` changes meaning: it **returns** the connection instead of destroying it. So you keep using `try-with-resources` exactly as before; it simply does something different underneath.

> A `Connection` is **not thread-safe**. If your application is concurrent — and after lesson 19 you know what that entails — each thread takes its own from the pool and returns it when done. Never share a `Connection` across threads.

---

## 6. The DAO pattern

Mixing SQL with business logic gets unmanageable fast. The **DAO** pattern (*Data Access Object*) concentrates all data access for an entity in one class:

```java
public interface ProductDAO {                        // the interface: the contract
    Optional<Product> findById(long id);
    List<Product> findByCategory(String category);
    long insert(Product product);
    boolean updateStock(long id, int delta);
    boolean delete(long id);
}
```

With that interface, the business service does not know whether PostgreSQL, a file, or an in-memory map for tests sits below. It is the same principle as lessons 10 and 12: **program against the contract**.

---

## 7. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| Concatenating user input into SQL | SQL injection: anyone can read, modify, or wipe the whole database. | `PreparedStatement` with `?`, always and without exception. |
| Not closing `Connection`, `PreparedStatement`, or `ResultSet` | Resource leak; the database eventually refuses new connections. | Nested `try-with-resources`. |
| Parameter indices starting at 0 | `SQLException` about an out-of-range index. | JDBC parameters start at **1**. |
| Leaving autocommit on for multi-step operations | Half-done states impossible to repair. | `setAutoCommit(false)`, `commit()`, and `rollback()`. |
| Not restoring the connection's original state | The next person taking it from the pool inherits your configuration. | Restore `setAutoCommit(true)` in the `finally`. |
| `SELECT *` in production code | Breaks when columns are added or reordered, and fetches data you never use. | Name the columns explicitly. |
| Ignoring what `executeUpdate()` returns | An `UPDATE` that affected nothing passes as successful. | Check the return value and act when it is 0. |
| Sharing a `Connection` across threads | Data corruption and unpredictable errors. | One connection per thread, taken from the pool. |
| Opening a connection per query | Enormous latency and a database drowning in connections. | A pool (HikariCP). |

---

## 8. Guided hands-on exercise

### Challenge: a product DAO

1. Create a `products` table and a DAO with the five CRUD operations.
2. Use `PreparedStatement` in all of them, with zero concatenation.
3. `findById` returns `Optional<Product>`, not `null`.
4. `decreaseStock` uses a transaction and fails when stock is insufficient.
5. Insert three products and verify everything works.

<details>
<summary>See suggested solution</summary>

```java
import java.sql.*;
import java.util.*;

public record Product(Long id, String name, double price, int stock) { }

public class JdbcProductDAO {

    private final javax.sql.DataSource dataSource;

    public JdbcProductDAO(javax.sql.DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void createTableIfMissing() throws SQLException {
        String ddl = """
            CREATE TABLE IF NOT EXISTS products (
                id     BIGINT AUTO_INCREMENT PRIMARY KEY,
                name   VARCHAR(120)  NOT NULL,
                price  DECIMAL(12,2) NOT NULL CHECK (price >= 0),
                stock  INT           NOT NULL CHECK (stock >= 0)
            )
            """;
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement()) {
            st.execute(ddl);   // fixed DDL, no user data: Statement is safe here
        }
    }

    // ── CREATE ──────────────────────────────────────────────────
    public long insert(Product p) throws SQLException {
        String sql = "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, p.name());       // index 1, not 0
            ps.setDouble(2, p.price());
            ps.setInt(3, p.stock());
            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) return keys.getLong(1);
                throw new SQLException("The database returned no generated id");
            }
        }
    }

    // ── READ ────────────────────────────────────────────────────
    public Optional<Product> findById(long id) throws SQLException {
        // Explicit columns: if a new one is added tomorrow, this does not break
        String sql = "SELECT id, name, price, stock FROM products WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                // Optional instead of null: lesson 11 explained why
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        }
    }

    public List<Product> findWithStockBelow(int threshold) throws SQLException {
        String sql = """
            SELECT id, name, price, stock
            FROM products
            WHERE stock < ?
            ORDER BY stock ASC, name ASC
            """;
        List<Product> result = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, threshold);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) result.add(map(rs));
            }
        }
        return result;
    }

    // ── UPDATE, inside a transaction ────────────────────────────
    public void decreaseStock(long id, int quantity) throws SQLException {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        // The WHERE includes stock >= ? : the database guarantees it never goes
        // negative, even when two threads run this at the same time.
        String sql = "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?";

        Connection conn = dataSource.getConnection();
        try {
            conn.setAutoCommit(false);

            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setInt(1, quantity);
                ps.setLong(2, id);
                ps.setInt(3, quantity);

                if (ps.executeUpdate() == 0) {
                    // Zero rows affected: it does not exist, or stock is short
                    throw new SQLException("Insufficient stock or missing product: " + id);
                }
            }

            recordMovement(conn, id, -quantity);   // second operation, same transaction
            conn.commit();

        } catch (SQLException e) {
            conn.rollback();   // undoes BOTH operations
            throw e;
        } finally {
            conn.setAutoCommit(true);   // leave the connection as we found it
            conn.close();               // with a pool, this returns it rather than destroying it
        }
    }

    private void recordMovement(Connection conn, long productId, int delta)
            throws SQLException {
        String sql = "INSERT INTO movements (product_id, delta) VALUES (?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, productId);
            ps.setInt(2, delta);
            ps.executeUpdate();
        }
        // No conn.commit() here: the caller owns the transaction
    }

    // ── DELETE ──────────────────────────────────────────────────
    public boolean delete(long id) throws SQLException {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM products WHERE id = ?")) {
            ps.setLong(1, id);
            return ps.executeUpdate() > 0;   // the return value says whether it deleted
        }
    }

    private Product map(ResultSet rs) throws SQLException {
        return new Product(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getDouble("price"),
            rs.getInt("stock")
        );
    }

    public static void main(String[] args) throws Exception {
        // In-memory H2: nothing to install to try this out
        com.zaxxer.hikari.HikariConfig config = new com.zaxxer.hikari.HikariConfig();
        config.setJdbcUrl("jdbc:h2:mem:shop;DB_CLOSE_DELAY=-1");
        config.setMaximumPoolSize(5);

        try (var ds = new com.zaxxer.hikari.HikariDataSource(config)) {
            JdbcProductDAO dao = new JdbcProductDAO(ds);
            dao.createTableIfMissing();

            long teaId = dao.insert(new Product(null, "Loose leaf tea", 3200.00, 45));
            dao.insert(new Product(null, "Ground coffee", 5800.50,  8));
            dao.insert(new Product(null, "Sugar 1kg",     1150.00,  3));

            System.out.println("Found: " + dao.findById(teaId).orElseThrow());
            System.out.println("Missing: " + dao.findById(9999));   // Optional.empty
            System.out.println("Low stock: " + dao.findWithStockBelow(10));

            dao.decreaseStock(teaId, 5);
            System.out.println("After removing 5: " + dao.findById(teaId).orElseThrow());

            try {
                dao.decreaseStock(teaId, 1000);   // more than exists
            } catch (SQLException e) {
                System.out.println("Correctly rejected: " + e.getMessage());
            }
            System.out.println("Untouched after rollback: " +
                dao.findById(teaId).orElseThrow());
        }
    }
}
```

**Three decisions worth more than the code.**

`WHERE id = ? AND stock >= ?` is not a convenience: it is what makes the operation **concurrency-safe**. If two threads try to take the last item at the same time, the database resolves the conflict; one of them gets zero rows affected and fails cleanly. With a `SELECT` followed by an `UPDATE`, both would see stock available and the result would go negative.

`recordMovement` **takes the `Connection` as a parameter and never commits**. That way it can take part in the caller's transaction. If it opened its own connection, it would sit outside the `rollback` and you would end up with a recorded movement for a deduction that never happened.

And `findById` returns `Optional<Product>`. "Not found" is not an exceptional error, it is a possible result. Returning `null` pushes the problem onto the caller, who will forget to check it.

</details>

---

## Key takeaways

- JDBC is a set of **interfaces**; each engine ships its driver. Switching databases means switching a dependency.
- **Never concatenate user input into SQL.** `PreparedStatement` with `?` does not escape quotes: it fixes the structure before the data exists.
- Parameter indices **start at 1**.
- `Connection`, `PreparedStatement`, and `ResultSet` are `AutoCloseable`: nested `try-with-resources`, always.
- Under autocommit, two dependent operations can end up half-done. That is what `setAutoCommit(false)` with `commit`/`rollback` is for.
- Restore the connection's state in the `finally`: with a pool, the next caller inherits it.
- A `Connection` is **not thread-safe**. One per thread, taken from the pool.
- What `executeUpdate()` returns is information: zero rows affected is almost never what you expected.
- The **DAO** pattern isolates SQL in one class per entity, behind an interface.
</content>
