---
course: 'java'
lesson: '19-acceso-a-bases-de-datos-jdbc'
slug: 'gestion-usuarios-dao-jdbc'
title: 'Implementación del Patrón DAO con JDBC Seguro y Transacciones ACID'
description: 'Construí una capa de persistencia relacional profesional con el patrón Data Access Object (DAO), consultas parametrizadas con PreparedStatement y control transaccional con commit y rollback.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 65
objectives:
  - 'Aplicar el patrón DAO para desacoplar el modelo de dominio de las operaciones SQL de bajo nivel.'
  - 'Prevenir vulnerabilidades de inyección SQL utilizando invariablemente consultas preparadas con `PreparedStatement`.'
  - 'Gestionar transacciones atómicas seguras en JDBC mediante `setAutoCommit(false)`, `commit()` y `rollback()`.'
  - 'Liberar conexiones y recursos relacionales de manera determinística mediante `try-with-resources`.'
requirements:
  - 'Crear la clase de dominio CuentaBancaria con atributos: id (Long), cbu (String), titular (String) y saldo (BigDecimal).'
  - 'Definir la interfaz CuentaDAO con métodos: void crear(CuentaBancaria cuenta), Optional<CuentaBancaria> buscarPorCbu(String cbu), List<CuentaBancaria> listarTodas() y void actualizarSaldo(Connection conn, String cbu, BigDecimal nuevoSaldo).'
  - 'Implementar CuentaDAOJdbc implements CuentaDAO utilizando una base en memoria (H2 o SQLite) o conexión JDBC estándar.'
  - 'Utilizar estrictamente PreparedStatement parametrizado con marcadores posicionales (?) en cada consulta (SELECT, INSERT, UPDATE).'
  - 'Crear la clase de servicio ServicioTransferencias con el método boolean transferir(String cbuOrigen, String cbuDestino, BigDecimal monto).'
  - 'Configurar la transacción manual en ServicioTransferencias: conn.setAutoCommit(false), verificar fondos, ejecutar débitos y créditos con la misma Connection, y en caso de error o saldo insuficiente ejecutar conn.rollback() antes de relanzar la excepción.'
  - 'Cerrar adecuadamente Connection, PreparedStatement y ResultSet con try-with-resources.'
  - 'En MainJDBC.java, inicializar el esquema de tablas (CREATE TABLE), dar de alta dos cuentas, ejecutar una transferencia exitosa y luego forzar una transferencia fallida para comprobar el rollback.'
exampleOutput: |
  === Sistema Bancario con JDBC y Patrón DAO ===
  1. Inicializando esquema relacional de base de datos...
  [OK] Tabla 'cuentas' creada exitosamente.

  2. Creando cuentas de prueba:
     - Cuenta 1: CBU=0001 | Titular=Lucas Albornoz | Saldo Inicial=$1000.00
     - Cuenta 2: CBU=0002 | Titular=Valeria Morales | Saldo Inicial=$500.00

  3. Iniciando transferencia segura de $300.00 de Lucas a Valeria...
  [TX] Conexión en modo transaccional (autoCommit = false).
  [TX] Débito completado en origen.
  [TX] Crédito completado en destino.
  [TX] Confirmando transacción con conn.commit()...
  [OK] Transferencia exitosa. Saldos actuales: Lucas=$700.00 | Valeria=$800.00

  4. Provocando transferencia inválida ($10000.00 - Fondos Insuficientes)...
  [ERROR] Saldo insuficiente en cuenta origen.
  [TX] Ejecutando conn.rollback() de emergencia...
  [OK] Rollback confirmado. Saldos intactos: Lucas=$700.00 | Valeria=$800.00
deliveryTips:
  - 'Recordá que en JDBC los índices de parámetros en `PreparedStatement` comienzan en 1 (1-based), no en 0.'
  - 'En las operaciones transaccionales, ambos updates deben compartir exactamente la misma instancia de `Connection`.'
  - 'Para dinero y saldos financieros utilizá siempre `BigDecimal` y nunca tipos de coma flotante inexactos (`double` o `float`).'
---

## Contexto

Guardar datos en archivos planos presenta graves limitaciones ante concurrencia, consultas complejas y necesidad de consistencia. Las **bases de datos relacionales** resuelven esto proveyendo garantías **ACID** (Atomicidad, Consistencia, Aislamiento y Durabilidad).

En el ecosistema Java, **JDBC (*Java Database Connectivity*)** es la especificación base que conecta la aplicación con cualquier motor SQL (PostgreSQL, MySQL, H2, SQLite):
1. **Patrón DAO (*Data Access Object*)**: aísla las consultas SQL de la lógica de negocio. El dominio habla con métodos orientados a objetos (`buscarPorCbu`), sin contaminarse con sintaxis de base de datos.
2. **Inyección SQL**: concatenar cadenas del usuario en un `Statement` es una de las vulnerabilidades más críticas de la historia informática. El uso de **`PreparedStatement`** precompila la estructura SQL en el motor y trata cualquier entrada del usuario estrictamente como datos literales.
3. **Control Transaccional**: una transferencia de dinero requiere dos escrituras (débito y crédito). Si la máquina se apaga o falla a mitad de camino, jamás debe quedar dinero en el limbo: o se ejecutan ambas (**`commit`**) o ninguna (**`rollback`**).

## Consigna

Vas a construir un módulo bancario robusto con JDBC puro siguiendo las mejores prácticas de la arquitectura de software.

### 1. Modelo de Dominio e Interfaz DAO

```java
public class CuentaBancaria {
    private final Long id;
    private final String cbu;
    private final String titular;
    private BigDecimal saldo;
    // constructor, getters, setters defensivos
}

public interface CuentaDAO {
    void crear(CuentaBancaria cuenta) throws SQLException;
    Optional<CuentaBancaria> buscarPorCbu(String cbu) throws SQLException;
    void actualizarSaldo(Connection conn, String cbu, BigDecimal nuevoSaldo) throws SQLException;
}
```

### 2. Prevención de Inyección SQL con `PreparedStatement`

En `CuentaDAOJdbc`:
```java
String sql = "INSERT INTO cuentas (cbu, titular, saldo) VALUES (?, ?, ?)";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, cuenta.getCbu());
    ps.setString(2, cuenta.getTitular());
    ps.setBigDecimal(3, cuenta.getSaldo());
    ps.executeUpdate();
}
```

### 3. Orquestación Transaccional en la Capa de Servicio

```java
public class ServicioTransferencias {
    private final DataSource dataSource; // o ConnectionFactory

    public void transferir(String cbuOrigen, String cbuDestino, BigDecimal monto) throws SQLException {
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false); // Desactivar autocommit
            try {
                // 1. Obtener y validar saldos
                // 2. Ejecutar debito en origen (usando conn)
                // 3. Ejecutar credito en destino (usando conn)
                conn.commit(); // Confirmar cambios atómicamente
            } catch (Exception ex) {
                conn.rollback(); // Revertir todo ante cualquier anomalía
                throw ex;
            }
        }
    }
}
```
