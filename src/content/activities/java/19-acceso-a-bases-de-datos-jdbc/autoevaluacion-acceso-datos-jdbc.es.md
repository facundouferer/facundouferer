---
course: 'java'
lesson: '19-acceso-a-bases-de-datos-jdbc'
slug: 'autoevaluacion-acceso-datos-jdbc'
title: 'Autoevaluación: Acceso a Bases de Datos con JDBC, Seguridad y Transacciones'
description: 'Validá tus conocimientos sobre la arquitectura JDBC, prevención de inyección SQL con PreparedStatement, transacciones ACID y el patrón DAO.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Por qué la concatenación directa de cadenas del usuario en sentencias SQL (`"SELECT * FROM u WHERE id = " + input`) es altamente peligrosa?'
    options:
      - id: 'a'
        text: 'Porque hace que el query sea susceptible a Inyección SQL, permitiendo que un atacante altere la lógica de la consulta ejecutando código malicioso en el motor.'
      - id: 'b'
        text: 'Porque Java no permite concatenar cadenas con el operador +.'
      - id: 'c'
        text: 'Porque la base de datos se desconecta automáticamente.'
      - id: 'd'
        text: 'Porque las comillas simples consumen demasiada memoria RAM.'
    correctOptionId: 'a'
    explanation: >-
      Al concatenar texto sin procesar, cualquier dato introducido por el usuario puede cerrar comillas e inyectar comandos SQL adicionales (como `' OR '1'='1` o `; DROP TABLE usuarios;`), violando la seguridad de los datos.
  - kind: 'true-false'
    id: 'q2'
    prompt: '`PreparedStatement` previene la inyección SQL porque envía la estructura de la consulta al motor de base de datos para ser pre-compilada, tratando los parámetros como literales puros y nunca como código ejecutable.'
    correctAnswer: true
    explanation: >-
      Verdadero. La base de datos primero compila el árbol de ejecución sintáctico del SQL y luego inyecta los valores en las posiciones marcadas con `?`. Aunque el valor contenga sintaxis SQL, será interpretado estrictamente como un dato de tipo cadena o numérico.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'En la API de JDBC para `PreparedStatement`, ¿con qué número comienza el índice de los parámetros marcados con `?`?'
    options:
      - id: 'a'
        text: 'Comienza en 0.'
      - id: 'b'
        text: 'Comienza en 1.'
      - id: 'c'
        text: 'Comienza en -1.'
      - id: 'd'
        text: 'Depende de la versión de Java.'
    correctOptionId: 'b'
    explanation: >-
      A diferencia de los arreglos y listas en Java que son 0-based, la especificación estándar de JDBC define los parámetros posicionales como 1-based (`ps.setString(1, "...")`, `ps.setInt(2, 42)`).
  - kind: 'true-false'
    id: 'q4'
    prompt: 'Por defecto, una conexión JDBC (`Connection`) viene con `autoCommit` configurado en `true`, ejecutando y confirmando cada sentencia SQL de forma individual e inmediata.'
    correctAnswer: true
    explanation: >-
      Verdadero. Para agrupar múltiples operaciones bajo una misma transacción ACID, es indispensable llamar explícitamente a `connection.setAutoCommit(false)`.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué método de `Connection` debe ejecutarse cuando ocurre un fallo o excepción en medio de una transacción para deshacer todos los cambios pendientes?'
    options:
      - id: 'a'
        text: '`conn.close()`'
      - id: 'b'
        text: '`conn.rollback()`'
      - id: 'c'
        text: '`conn.commit()`'
      - id: 'd'
        text: '`conn.undo()`'
    correctOptionId: 'b'
    explanation: >-
      El método `rollback()` revierte todas las modificaciones realizadas desde el inicio de la transacción, preservando el principio de Atomicidad (*todo o nada*).
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Al recuperar datos con un `ResultSet`, el cursor se posiciona inicialmente antes de la primera fila, por lo que es obligatorio llamar a `rs.next()` antes de leer cualquier columna.'
    correctAnswer: true
    explanation: >-
      Verdadero. `rs.next()` avanza el cursor a la siguiente fila disponible y retorna `true` si existe dicha fila o `false` si ya no hay más registros que procesar.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Cuál es el beneficio primordial del patrón arquitectónico DAO (Data Access Object)?'
    options:
      - id: 'a'
        text: 'Acelerar la conexión a internet del servidor.'
      - id: 'b'
        text: 'Aislar y desacoplar la lógica de dominio y de negocio de los detalles técnicos y sintaxis SQL de la base de datos.'
      - id: 'c'
        text: 'Evitar el uso de interfaces en el código.'
      - id: 'd'
        text: 'Convertir la base de datos en archivos de texto plano.'
    correctOptionId: 'b'
    explanation: >-
      El patrón DAO expone una interfaz orientada a objetos (ej. `buscarPorId`, `guardar`) ocultando si los datos provienen de PostgreSQL, MySQL o una base en memoria, facilitando pruebas y mantenimiento.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Si una aplicación web no cierra adecuadamente sus instancias de `Connection` tras cada consulta, agotará el pool de conexiones del servidor de base de datos impidiendo que nuevos usuarios se conecten.'
    correctAnswer: true
    explanation: >-
      Verdadero. Las conexiones a bases de datos son recursos escasos y costosos. No cerrarlas provoca una fuga de conexiones (*connection leak*) que termina saturando y derribando el servicio.
---
