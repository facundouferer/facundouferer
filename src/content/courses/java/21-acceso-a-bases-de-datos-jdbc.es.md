---
course: 'java'
slug: '19-acceso-a-bases-de-datos-jdbc'
title: 'Acceso a Bases de Datos con JDBC y SQL Seguro'
description: 'Conectá tu aplicación a una base relacional con JDBC, entendé por qué PreparedStatement elimina la inyección SQL, manejá transacciones con commit y rollback, y organizá el acceso a datos con el patrón DAO.'
order: 21
lang: 'es'
published: true
---

# Acceso a Bases de Datos con JDBC y SQL Seguro

En la lección 18 guardaste datos en archivos. Funciona, pero probá lo siguiente con un archivo: buscar todos los productos con stock menor a 10, ordenados por precio, mientras otros tres usuarios están escribiendo al mismo tiempo.

Eso es exactamente lo que hace una **base de datos relacional**, y por eso existe. **JDBC** es el puente entre tu código Java y ella.

---

## 1. La arquitectura: por qué hay una capa en el medio

<figure class="diagram">
<svg viewBox="0 0 720 270" role="img" aria-labelledby="d-jdbc-t">
<title id="d-jdbc-t">Capas entre el código de la aplicación y el motor de base de datos</title>
<defs><marker id="ar-jd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="20" width="720" height="52" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="20" y="42" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">Tu código — ProductoDAO, ClienteDAO</text>
<text x="20" y="62" font-size="11" fill="var(--color-neutral-800)">Habla en objetos: guardar(producto), buscarPorId(4). No sabe qué motor hay abajo.</text>
<line x1="360" y1="74" x2="360" y2="94" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-jd)"/>
<rect x="0" y="98" width="720" height="52" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="120" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">java.sql — la API estándar de JDBC</text>
<text x="20" y="140" font-size="11" fill="var(--color-neutral-800)">Connection, PreparedStatement, ResultSet. Son INTERFACES: la lección 10 en estado puro.</text>
<line x1="360" y1="152" x2="360" y2="172" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-jd)"/>
<rect x="0" y="176" width="232" height="46" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="116" y="196" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">driver PostgreSQL</text>
<text x="116" y="214" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">implementa las interfaces</text>
<rect x="244" y="176" width="232" height="46" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="360" y="196" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">driver MySQL</text>
<text x="360" y="214" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">implementa las interfaces</text>
<rect x="488" y="176" width="232" height="46" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="604" y="196" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">driver H2 / SQLite</text>
<text x="604" y="214" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">implementa las interfaces</text>
<text x="0" y="248" font-size="12" font-weight="700" fill="var(--color-accent-700)">Cambiar de PostgreSQL a MySQL es cambiar una dependencia y una URL. Tu código no se entera.</text>
<text x="0" y="266" font-size="11.5" fill="var(--color-neutral-700)">Es exactamente el beneficio de programar contra interfaces, aplicado a escala de industria.</text>
</svg>
<figcaption>JDBC es un contrato; cada fabricante escribe su implementación. La lección 10 explicaba por qué esto vale la pena — acá se ve el resultado.</figcaption>
</figure>

```java
// La conexión: URL, usuario, contraseña
String url = "jdbc:postgresql://localhost:5432/tienda";

try (Connection conn = DriverManager.getConnection(url, "usuario", "clave")) {
    System.out.println("Conectado a " + conn.getMetaData().getDatabaseProductName());
}
```

Fijate el `try-with-resources` de la lección 11. **Una conexión no cerrada es un recurso perdido**, y con suficientes de ellas la base rechaza conexiones nuevas y la aplicación entera se cae.

---

## 2. `Statement` vs `PreparedStatement`: la vulnerabilidad más famosa del mundo

Esta es la parte más importante de la lección. Mirá este código, que parece inofensivo:

```java
// NUNCA HAGAS ESTO
String email = pedirAlUsuario();
String sql = "SELECT * FROM usuarios WHERE email = '" + email + "'";
ResultSet rs = statement.executeQuery(sql);
```

<figure class="diagram">
<svg viewBox="0 0 720 350" role="img" aria-labelledby="d-inj-t">
<title id="d-inj-t">Cómo una entrada maliciosa se convierte en SQL ejecutable con concatenación de cadenas</title>
<rect x="0" y="0" width="720" height="166" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)" stroke-width="2"/>
<text x="20" y="26" font-size="13" font-weight="700" fill="var(--color-neutral-900)">Concatenando la entrada del usuario — el dato se vuelve CÓDIGO</text>
<rect x="20" y="38" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="58" font-size="11.5" fill="var(--color-text)">El usuario escribe en el formulario:   ' OR '1'='1</text>
<rect x="20" y="74" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="94" font-size="11.5" fill="var(--color-text)">Tu código arma:   "SELECT * FROM usuarios WHERE email = '" + entrada + "'"</text>
<rect x="20" y="110" width="680" height="30" rx="10" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<text x="34" y="130" font-size="11.5" font-weight="700" fill="var(--color-neutral-900)">La base recibe:   SELECT * FROM usuarios WHERE email = '' OR '1'='1'</text>
<text x="20" y="158" font-size="11.5" font-weight="700" fill="var(--color-neutral-900)">'1'='1' es siempre verdadero → devuelve TODOS los usuarios de la tabla.</text>
<rect x="0" y="182" width="720" height="166" rx="18" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="20" y="208" font-size="13" font-weight="700" fill="var(--color-accent-2-700)">Con PreparedStatement — el dato NUNCA es código</text>
<rect x="20" y="220" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="240" font-size="11.5" fill="var(--color-text)">1. Se envía primero la plantilla:   SELECT * FROM usuarios WHERE email = ?</text>
<rect x="20" y="256" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="276" font-size="11.5" fill="var(--color-text)">2. La base la compila y fija su estructura. Ya sabe que hay UN parámetro y dónde va.</text>
<rect x="20" y="292" width="680" height="30" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="34" y="312" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">3. El valor viaja aparte, como DATO. Busca literalmente el email  ' OR '1'='1</text>
<text x="20" y="340" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">No encuentra a nadie, que es exactamente lo correcto. El ataque desaparece por construcción.</text>
</svg>
<figcaption>La diferencia no es que <code>PreparedStatement</code> "escape comillas": es que la estructura de la consulta se fija antes de que el dato exista. No hay nada que escapar.</figcaption>
</figure>

```java
// SIEMPRE ASÍ
String sql = "SELECT id, nombre, precio FROM productos WHERE categoria = ? AND precio < ?";

try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, categoria);     // los índices arrancan en 1, no en 0
    ps.setDouble(2, precioMaximo);

    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getString("nombre") + " — $" + rs.getDouble("precio"));
        }
    }
}
```

Además de la seguridad, `PreparedStatement` te da dos cosas gratis:

- **Rendimiento**: la base compila el plan de ejecución una vez y lo reutiliza para cada valor distinto.
- **Tipado**: `setDouble`, `setDate`, `setBoolean` se encargan del formato. Nunca más pelear con el formato de fechas dentro de un string SQL.

> El índice de los parámetros **arranca en 1**. Es una de las poquísimas cosas en Java que no empieza en cero, y una fuente garantizada de `SQLException` la primera vez.

---

## 3. Recorrer resultados y modificar datos

Un `ResultSet` es un **cursor**: arranca *antes* de la primera fila, y `next()` avanza y devuelve `false` cuando se acabaron.

```java
List<Producto> productos = new ArrayList<>();

try (PreparedStatement ps = conn.prepareStatement("SELECT id, nombre, precio, stock FROM productos");
     ResultSet rs = ps.executeQuery()) {

    while (rs.next()) {                       // ← sin este while, no leés nada
        productos.add(new Producto(
            rs.getLong("id"),
            rs.getString("nombre"),
            rs.getDouble("precio"),
            rs.getInt("stock")
        ));
    }
}
```

Para modificar datos se usa `executeUpdate()`, que devuelve **cuántas filas se afectaron**:

```java
// INSERT, recuperando el id que genera la base
String sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";

try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    ps.setString(1, "Yerba Playadito");
    ps.setDouble(2, 3200.00);
    ps.setInt(3, 45);

    int filas = ps.executeUpdate();
    System.out.println("Insertadas: " + filas);

    try (ResultSet claves = ps.getGeneratedKeys()) {
        if (claves.next()) {
            System.out.println("Id asignado: " + claves.getLong(1));
        }
    }
}

// UPDATE — el WHERE no es opcional
try (PreparedStatement ps = conn.prepareStatement(
         "UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?")) {
    ps.setInt(1, cantidad);
    ps.setLong(2, id);
    ps.setInt(3, cantidad);        // la condición evita dejar el stock negativo

    if (ps.executeUpdate() == 0) {
        throw new IllegalStateException("Sin stock suficiente o el producto no existe");
    }
}
```

Fijate ese `if (executeUpdate() == 0)`: **el valor de retorno es información, no ruido**. Un `UPDATE` que afecta cero filas casi siempre significa que algo no salió como esperabas.

---

## 4. Transacciones: todo o nada

Por defecto, JDBC está en **autocommit**: cada sentencia se confirma sola, apenas se ejecuta. Para una operación suelta está bien. Para dos que dependen entre sí, es una bomba.

<figure class="diagram">
<svg viewBox="0 0 720 320" role="img" aria-labelledby="d-tx-t">
<title id="d-tx-t">Una transferencia bancaria con autocommit frente a la misma dentro de una transacción</title>
<rect x="0" y="0" width="720" height="140" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)" stroke-width="2"/>
<text x="20" y="26" font-size="13" font-weight="700" fill="var(--color-neutral-900)">autocommit = true (el valor por defecto)</text>
<rect x="20" y="38" width="330" height="42" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="34" y="56" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">UPDATE cuentas SET saldo = saldo - 5000 ...</text>
<text x="34" y="73" font-size="11" fill="var(--color-neutral-800)">✓ confirmado al instante, ya no hay vuelta atrás</text>
<rect x="370" y="38" width="330" height="42" rx="12" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<text x="384" y="56" font-size="11.5" font-weight="700" fill="var(--color-neutral-900)">UPDATE cuentas SET saldo = saldo + 5000 ...</text>
<text x="384" y="73" font-size="11" fill="var(--color-neutral-800)">✗ falla: se cortó la red</text>
<text x="20" y="104" font-size="12" font-weight="700" fill="var(--color-neutral-900)">Resultado: el dinero salió de una cuenta y no llegó a la otra. Se evaporó.</text>
<text x="20" y="126" font-size="11.5" fill="var(--color-neutral-800)">Y no hay ninguna excepción que lo arregle: el primer UPDATE ya está confirmado en disco.</text>
<rect x="0" y="156" width="720" height="164" rx="18" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="20" y="182" font-size="13" font-weight="700" fill="var(--color-accent-2-700)">conn.setAutoCommit(false) — una transacción</text>
<rect x="20" y="194" width="330" height="42" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="212" font-size="11.5" font-weight="700" fill="var(--color-text)">UPDATE ... saldo - 5000</text>
<text x="34" y="229" font-size="11" fill="var(--color-neutral-700)">pendiente, todavía no confirmado</text>
<rect x="370" y="194" width="330" height="42" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="384" y="212" font-size="11.5" font-weight="700" fill="var(--color-text)">UPDATE ... saldo + 5000</text>
<text x="384" y="229" font-size="11" fill="var(--color-neutral-700)">✗ falla</text>
<rect x="20" y="246" width="680" height="38" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="34" y="270" font-size="12" font-weight="700" fill="var(--color-accent-2-800)">catch → conn.rollback()  —  la base deshace TODO, incluido el primer UPDATE</text>
<text x="20" y="306" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">Resultado: las dos cuentas quedan como estaban. O pasan las dos cosas, o no pasa ninguna.</text>
</svg>
<figcaption>Una transacción no es "por si acaso": es la única forma de que dos operaciones dependientes no puedan quedar a medio camino.</figcaption>
</figure>

```java
Connection conn = obtenerConexion();
try {
    conn.setAutoCommit(false);              // 1. abrimos la transacción

    debitar(conn, cuentaOrigen, monto);
    acreditar(conn, cuentaDestino, monto);

    conn.commit();                          // 2. las dos salieron bien: confirmamos

} catch (SQLException e) {
    conn.rollback();                        // 3. algo falló: deshacemos todo
    throw new TransferenciaFallidaException("No se pudo transferir", e);  // lección 11
} finally {
    conn.setAutoCommit(true);               // 4. dejamos la conexión como la encontramos
    conn.close();
}
```

Ese `finally` con `setAutoCommit(true)` importa más de lo que parece: si la conexión viene de un **pool** —y en producción siempre viene de un pool—, la próxima persona que la use la recibe con la configuración que vos dejaste.

---

## 5. Conexiones y pools

Abrir una conexión es **caro**: resolución de DNS, handshake TCP, autenticación, negociación de protocolo. Fácilmente decenas de milisegundos. Hacerlo por cada consulta es inviable.

Por eso en producción se usa un **pool de conexiones**: un conjunto de conexiones ya abiertas que se prestan y se devuelven.

```java
// HikariCP — el estándar de facto, y el que trae Spring Boot por defecto
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:postgresql://localhost:5432/tienda");
config.setUsername("usuario");
config.setPassword("clave");
config.setMaximumPoolSize(10);

DataSource dataSource = new HikariDataSource(config);

// conn.close() NO cierra la conexión: la devuelve al pool
try (Connection conn = dataSource.getConnection()) {
    // ...
}
```

Con el pool, `close()` cambia de significado: **devuelve** la conexión en lugar de destruirla. Por eso seguís usando `try-with-resources` igual que siempre; simplemente hace algo distinto por debajo.

> Un `Connection` **no es seguro entre hilos**. Si tu aplicación es concurrente —y con la lección 19 ya sabés lo que eso implica—, cada hilo pide la suya al pool y la devuelve al terminar. Nunca compartas una `Connection` entre hilos.

---

## 6. El patrón DAO

Mezclar SQL con lógica de negocio se vuelve inmanejable rápido. El patrón **DAO** (*Data Access Object*) concentra todo el acceso a datos de una entidad en una clase:

```java
public interface ProductoDAO {                       // la interfaz: el contrato
    Optional<Producto> buscarPorId(long id);
    List<Producto> buscarPorCategoria(String categoria);
    long insertar(Producto producto);
    boolean actualizarStock(long id, int delta);
    boolean eliminar(long id);
}
```

Con esa interfaz, el servicio de negocio no sabe si abajo hay PostgreSQL, un archivo o un mapa en memoria para los tests. Es el mismo principio de las lecciones 10 y 12: **programar contra el contrato**.

---

## 7. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| Concatenar entradas del usuario en el SQL | Inyección SQL: cualquiera puede leer, modificar o borrar toda la base. | `PreparedStatement` con `?`, siempre y sin excepciones. |
| No cerrar `Connection`, `PreparedStatement` o `ResultSet` | Fuga de recursos; la base termina rechazando conexiones nuevas. | `try-with-resources` anidado. |
| Índices de parámetros empezando en 0 | `SQLException` sobre un índice fuera de rango. | Los parámetros de JDBC arrancan en **1**. |
| Dejar autocommit en operaciones de varios pasos | Estados a medio camino imposibles de reparar. | `setAutoCommit(false)`, `commit()` y `rollback()`. |
| No devolver la conexión a su estado original | La siguiente persona que la toma del pool hereda tu configuración. | Restaurar `setAutoCommit(true)` en el `finally`. |
| `SELECT *` en código de producción | Se rompe al agregar o reordenar columnas, y trae datos que no usás. | Nombrar las columnas explícitamente. |
| Ignorar lo que devuelve `executeUpdate()` | Un `UPDATE` que no afectó ninguna fila pasa por exitoso. | Chequear el retorno y actuar cuando es 0. |
| Compartir una `Connection` entre hilos | Corrupción de datos y errores impredecibles. | Una conexión por hilo, tomada del pool. |
| Abrir una conexión por cada consulta | Latencia enorme y la base saturada de conexiones. | Un pool (HikariCP). |

---

## 8. Ejercicio práctico guiado

### Desafío: DAO de productos

1. Creá la tabla `productos` y un DAO con las cinco operaciones CRUD.
2. Usá `PreparedStatement` en todas, sin una sola concatenación.
3. `buscarPorId` devuelve `Optional<Producto>`, no `null`.
4. `descontarStock` usa una transacción y falla si no hay stock suficiente.
5. Insertá tres productos y verificá que todo funciona.

<details>
<summary>Ver solución sugerida</summary>

```java
import java.sql.*;
import java.util.*;

public record Producto(Long id, String nombre, double precio, int stock) { }

public class ProductoDAOJdbc {

    private final javax.sql.DataSource dataSource;

    public ProductoDAOJdbc(javax.sql.DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void crearTablaSiNoExiste() throws SQLException {
        String ddl = """
            CREATE TABLE IF NOT EXISTS productos (
                id      BIGINT AUTO_INCREMENT PRIMARY KEY,
                nombre  VARCHAR(120)  NOT NULL,
                precio  DECIMAL(12,2) NOT NULL CHECK (precio >= 0),
                stock   INT           NOT NULL CHECK (stock  >= 0)
            )
            """;
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement()) {
            st.execute(ddl);   // DDL fijo, sin datos del usuario: Statement es seguro acá
        }
    }

    // ── CREATE ──────────────────────────────────────────────────
    public long insertar(Producto p) throws SQLException {
        String sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, p.nombre());     // índice 1, no 0
            ps.setDouble(2, p.precio());
            ps.setInt(3, p.stock());
            ps.executeUpdate();

            try (ResultSet claves = ps.getGeneratedKeys()) {
                if (claves.next()) return claves.getLong(1);
                throw new SQLException("La base no devolvió el id generado");
            }
        }
    }

    // ── READ ────────────────────────────────────────────────────
    public Optional<Producto> buscarPorId(long id) throws SQLException {
        // Columnas explícitas: si mañana se agrega una, esto no se rompe
        String sql = "SELECT id, nombre, precio, stock FROM productos WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                // Optional en lugar de null: la lección 11 lo explicaba
                return rs.next() ? Optional.of(mapear(rs)) : Optional.empty();
            }
        }
    }

    public List<Producto> buscarConStockMenorA(int umbral) throws SQLException {
        String sql = """
            SELECT id, nombre, precio, stock
            FROM productos
            WHERE stock < ?
            ORDER BY stock ASC, nombre ASC
            """;
        List<Producto> resultado = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, umbral);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) resultado.add(mapear(rs));
            }
        }
        return resultado;
    }

    // ── UPDATE, dentro de una transacción ───────────────────────
    public void descontarStock(long id, int cantidad) throws SQLException {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser positiva");
        }

        // El WHERE incluye stock >= ? : la base garantiza que no quede negativo,
        // incluso si dos hilos ejecutan esto al mismo tiempo.
        String sql = "UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?";

        Connection conn = dataSource.getConnection();
        try {
            conn.setAutoCommit(false);

            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setInt(1, cantidad);
                ps.setLong(2, id);
                ps.setInt(3, cantidad);

                if (ps.executeUpdate() == 0) {
                    // Cero filas afectadas: o no existe, o no alcanza el stock
                    throw new SQLException("Stock insuficiente o producto inexistente: " + id);
                }
            }

            registrarMovimiento(conn, id, -cantidad);   // segunda operación, misma transacción
            conn.commit();

        } catch (SQLException e) {
            conn.rollback();   // deshace las DOS operaciones
            throw e;
        } finally {
            conn.setAutoCommit(true);   // devolvemos la conexión como la encontramos
            conn.close();               // con pool, esto la devuelve, no la destruye
        }
    }

    private void registrarMovimiento(Connection conn, long productoId, int delta)
            throws SQLException {
        String sql = "INSERT INTO movimientos (producto_id, delta) VALUES (?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, productoId);
            ps.setInt(2, delta);
            ps.executeUpdate();
        }
        // Sin conn.commit() acá: la transacción la controla quien llamó
    }

    // ── DELETE ──────────────────────────────────────────────────
    public boolean eliminar(long id) throws SQLException {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM productos WHERE id = ?")) {
            ps.setLong(1, id);
            return ps.executeUpdate() > 0;   // el retorno dice si borró algo
        }
    }

    private Producto mapear(ResultSet rs) throws SQLException {
        return new Producto(
            rs.getLong("id"),
            rs.getString("nombre"),
            rs.getDouble("precio"),
            rs.getInt("stock")
        );
    }

    public static void main(String[] args) throws Exception {
        // H2 en memoria: no hace falta instalar nada para probar
        com.zaxxer.hikari.HikariConfig config = new com.zaxxer.hikari.HikariConfig();
        config.setJdbcUrl("jdbc:h2:mem:tienda;DB_CLOSE_DELAY=-1");
        config.setMaximumPoolSize(5);

        try (var ds = new com.zaxxer.hikari.HikariDataSource(config)) {
            ProductoDAOJdbc dao = new ProductoDAOJdbc(ds);
            dao.crearTablaSiNoExiste();

            long idYerba = dao.insertar(new Producto(null, "Yerba Playadito", 3200.00, 45));
            dao.insertar(new Producto(null, "Café molido",  5800.50,  8));
            dao.insertar(new Producto(null, "Azúcar 1kg",   1150.00,  3));

            System.out.println("Buscado: " + dao.buscarPorId(idYerba).orElseThrow());
            System.out.println("Inexistente: " + dao.buscarPorId(9999));   // Optional.empty
            System.out.println("Stock bajo: " + dao.buscarConStockMenorA(10));

            dao.descontarStock(idYerba, 5);
            System.out.println("Tras descontar 5: " + dao.buscarPorId(idYerba).orElseThrow());

            try {
                dao.descontarStock(idYerba, 1000);   // más de lo que hay
            } catch (SQLException e) {
                System.out.println("Rechazado correctamente: " + e.getMessage());
            }
            System.out.println("Intacto tras el rollback: " +
                dao.buscarPorId(idYerba).orElseThrow());
        }
    }
}
```

**Tres decisiones que valen más que el código.**

`WHERE id = ? AND stock >= ?` no es una comodidad: es lo que hace que la operación sea **segura ante concurrencia**. Si dos hilos intentan descontar el último producto al mismo tiempo, la base resuelve el conflicto; uno de los dos recibe cero filas afectadas y falla limpio. Con un `SELECT` seguido de un `UPDATE`, los dos verían stock disponible y el resultado quedaría negativo.

`registrarMovimiento` **recibe la `Connection` como parámetro y no hace `commit`**. Así puede participar de la transacción de quien la llame. Si abriera su propia conexión, quedaría fuera del `rollback` y tendrías un movimiento registrado de un descuento que nunca ocurrió.

Y `buscarPorId` devuelve `Optional<Producto>`. "No existe" no es un error excepcional, es un resultado posible. Devolver `null` traslada el problema al que llama, que se va a olvidar de chequearlo.

</details>

---

## Para llevarte

- JDBC es un conjunto de **interfaces**; cada motor trae su driver. Cambiar de base es cambiar una dependencia.
- **Nunca concatenes entradas del usuario en un SQL.** `PreparedStatement` con `?` no escapa comillas: fija la estructura antes de que el dato exista.
- Los índices de parámetros **empiezan en 1**.
- `Connection`, `PreparedStatement` y `ResultSet` son `AutoCloseable`: `try-with-resources` anidado, siempre.
- Con autocommit, dos operaciones dependientes pueden quedar a medio camino. Para eso está `setAutoCommit(false)` con `commit`/`rollback`.
- Restaurá el estado de la conexión en el `finally`: con pool, la hereda el siguiente.
- Una `Connection` **no es segura entre hilos**. Una por hilo, tomada del pool.
- El valor que devuelve `executeUpdate()` es información: cero filas afectadas casi nunca es lo que esperabas.
- El patrón **DAO** aísla el SQL en una clase por entidad, detrás de una interfaz.
</content>
