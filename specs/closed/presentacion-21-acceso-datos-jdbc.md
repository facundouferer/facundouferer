# Spec: Presentación Interactiva — Acceso a Bases de Datos con JDBC y SQL Seguro

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/19-acceso-a-bases-de-datos-jdbc`
  - Archivo de lección: `src/content/courses/java/21-acceso-a-bases-de-datos-jdbc.es.md`
  - Slug de la lección: `19-acceso-a-bases-de-datos-jdbc`
- **Slug de la presentación**: `acceso-datos-jdbc-java`
- **Archivo de componente**: `src/components/presentaciones/acceso-datos-jdbc-java.astro`
- **Asset de tarjeta**: `/img/presentations/acceso-datos-jdbc-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'JDBC, Inyección SQL y Manejo de Transacciones', en: 'JDBC, SQL Injection, and Transaction Management' }`
  - `description`: `{ es: 'Arquitectura de drivers, Statement vs PreparedStatement, cursor de ResultSet, commit/rollback y pools HikariCP.', en: 'Driver architecture, Statement vs PreparedStatement, ResultSet cursor, commit/rollback, and HikariCP pools.' }`
  - `lesson`: `{ course: 'java', slug: '19-acceso-a-bases-de-datos-jdbc' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

Conectar una aplicación a una base de datos relacional introduce cuestiones críticas de seguridad, arquitectura y rendimiento:
- Ilustrar la **arquitectura desacoplada de JDBC**: cómo el contrato de interfaces de `java.sql` permite cambiar de motor (Postgres, MySQL, Oracle) cambiando únicamente la dependencia del Driver.
- Desarmar gráficamente la mecánica de la **Inyección SQL**: por qué concatenar cadenas confunde datos con código ejecutable, y cómo **`PreparedStatement`** pre-compila el árbol de consulta en el motor antes de vincular los parámetros.
- Modelar el cursor interno del **`ResultSet`** y su ciclo de vida con `try-with-resources`.
- Enseñar la máquina de estados de las **Transacciones ACID** (`commit` y `rollback`) con el clásico ejemplo de la transferencia bancaria.
- Comparar el costo de abrir conexiones individuales frente al uso de un **Pool de Conexiones (HikariCP)**.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: La Arquitectura en Capas de JDBC — Interfaces a Escala Industrial
- **Aspecto conceptual**: La aplicación no depende de ningún motor específico. Se programa contra las interfaces de `java.sql` (`Connection`, `Statement`, `ResultSet`), y el Driver de cada fabricante aporta la implementación binaria.
- **Gráfica requerida (SVG de capas)**:
  - Capa superior (Aplicación / DAOs): `ProductoDAO`, `ClienteDAO`.
  - Capa intermedia (API JDBC estándar): Interfaces de `java.sql` en color terracotta.
  - Capa inferior (Drivers intercambiables):
    - Driver PostgreSQL (puerto 5432).
    - Driver MySQL (puerto 3306).
    - Driver H2 / SQLite (memoria local).
- **Interacción**: Selector de base de datos que demuestra cómo el código Java de la capa superior no cambia ni una sola línea al alternar entre PostgreSQL y SQLite.

### Slide 2: Inyección SQL vs PreparedStatement — La Separación Estructural
- **Aspecto conceptual**: Concatenar `"SELECT * FROM usuarios WHERE email = '" + entrada + "'"` permite inyectar `' OR '1'='1`. Con `PreparedStatement`, la consulta se compila primero como un árbol sintáctico fijo y los datos viajan después como parámetros puros.
- **Gráfica requerida (SVG comparativo de dos paneles)**:
  - Panel A (`Statement` inseguro):
    - Entrada maliciosa del usuario: `' OR '1'='1`.
    - La consulta se reconstruye en el parser del motor y el dato se transmuta en operador lógico, devolviendo la base de datos entera.
  - Panel B (`PreparedStatement` seguro):
    - La plantilla `... WHERE email = ?` se pre-compila en el motor.
    - El valor `' OR '1'='1` viaja aislado en el payload de datos. El motor busca literalmente una cuenta cuyo correo sea exactamente esa cadena de caracteres, resultando en cero coincidencias.
- **Interacción**: Consola interactiva donde el estudiante ingresa diferentes payloads de inyección y observa cómo `PreparedStatement` los desactiva automáticamente.

### Slide 3: El Cursor de ResultSet — Recorriendo Registros en Memoria
- **Aspecto conceptual**: `ResultSet` no es una lista en memoria; es un cursor bidireccional/adelantado que apunta a un buffer que dialoga con la base de datos.
- **Gráfica requerida (SVG interactivo con cursor)**:
  - Una tabla con 3 filas de registros: `(1, "Teclado", 45.0)`, `(2, "Mouse", 20.0)`, `(3, "Monitor", 220.0)`.
  - Posición inicial: El cursor apunta a `[ANTES DE LA PRIMERA FILA]`.
  - Animación de llamadas a `rs.next()`: El puntero avanza fila por fila.
  - Mapeo de métodos: `rs.getInt("id")`, `rs.getString("nombre")`, `rs.getDouble("precio")` extrayendo datos tipados.
  - Al superar la fila 3, `rs.next()` devuelve `false` y el bucle termina.

### Slide 4: Transacciones ACID — El Protocolo Atómico de Transferencia
- **Aspecto conceptual**: Si una transferencia de dinero de Cuenta A a Cuenta B se interrumpe a la mitad, el dinero no puede evaporarse. O se aplican todos los cambios (`commit`), o no se aplica ninguno (`rollback`).
- **Gráfica requerida (SVG de máquina de estados)**:
  - Estado 1: `conn.setAutoCommit(false);` (inicia el área de trabajo aislada).
  - Paso 1: `UPDATE cuenta SET saldo = saldo - 100 WHERE id = 1;` (saldo decrementado).
  - Bifurcación:
    - **Camino feliz**: Paso 2 exitoso -> `conn.commit();` -> Los cambios se persisten en disco de forma permanente.
    - **Camino de fallo**: Falla el sistema o la red -> bloque `catch` -> `conn.rollback();` -> El saldo de la Cuenta 1 se restaura inmediatamente al valor original.
- **Interacción**: Botón "Simular caída de red en Paso 2" para ver la ejecución instantánea del `rollback` y la preservación de la consistencia.

### Slide 5: Pools de Conexiones (HikariCP) y el Patrón DAO
- **Aspecto conceptual**: Abrir una conexión TCP/TLS con handshake y autenticación cuesta cientos de milisegundos. Un Pool mantiene conexiones ya abiertas listas para su uso.
- **Gráfica requerida (SVG de estación de servicio)**:
  - Sin pool: Petición web -> Apertura de socket TCP lenta -> Handshake -> Query -> Cierre -> Latencia alta.
  - Con HikariCP: Un estanque con 10 conexiones activas esperando. La petición toma una conexión libre, ejecuta la consulta en milisegundos y al llamar a `conn.close()`, la conexión vuelve al estanque en lugar de destruirse.
  - Diagrama de clases del Patrón DAO: `ProductoDAO` encapsula todo el código SQL y devuelve objetos de dominio limpios `Producto`.

---

## 4. Estilo y Tokens de Diseño Organic
- Gráficos claros inspirados en el Organic Design System con paleta en tonos piedra (`--color-surface`), terracota (`--color-accent`) y verde salvia (`--color-accent-2`).
- Indicadores visuales de seguridad y candados para operaciones transaccionales y sanitizadas.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/19-acceso-a-bases-de-datos-jdbc`
- **WHEN** un alumno repasa la presentación
- **THEN** entiende la raíz técnica de la inyección SQL, sabe estructurar transacciones con `commit`/`rollback` y comprende por qué es indispensable usar un pool como HikariCP en producción.
