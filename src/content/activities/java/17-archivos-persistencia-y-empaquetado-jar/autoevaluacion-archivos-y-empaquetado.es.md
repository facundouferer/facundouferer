---
course: 'java'
lesson: '17-archivos-persistencia-y-empaquetado-jar'
slug: 'autoevaluacion-archivos-y-empaquetado'
title: 'Autoevaluación: Persistencia de Archivos, NIO.2, Serialización y JARs'
description: 'Validá tus conocimientos sobre gestión de flujos de E/S, recursos cerrables automáticamente, serialización de objetos y empaquetado ejecutable.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es la diferencia fundamental entre la familia InputStream/OutputStream y la familia Reader/Writer en Java?'
    options:
      - id: 'a'
        text: 'InputStream/OutputStream procesa bytes en crudo (8 bits); Reader/Writer procesa caracteres interpretando codificaciones de texto (como UTF-8).'
      - id: 'b'
        text: 'Reader/Writer es para archivos de más de 1 GB e InputStream para archivos pequeños.'
      - id: 'c'
        text: 'InputStream solo lee de la red y Reader solo del disco.'
      - id: 'd'
        text: 'No hay ninguna diferencia; Reader es un alias obsoleto de InputStream.'
    correctOptionId: 'a'
    explanation: >-
      Los streams manejan bytes binarios directos sin interpretar significado semántico. Los Readers y Writers traducen bytes a caracteres Unicode utilizando una codificación explícita (Charset), evitando corrupciones de caracteres con acentos o caracteres multiconjunto.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'El patrón arquitectónico que utiliza Java al envolver un `FileReader` dentro de un `BufferedReader` es el patrón Decorador (Decorator).'
    correctAnswer: true
    explanation: >-
      Verdadero. En lugar de crear subclases para cada combinación posible de lectura y amortiguación, el patrón Decorador envuelve un componente que implementa la misma interfaz para agregar una responsabilidad adicional (amortiguación en bloques de memoria).
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Por qué es indispensable utilizar la sentencia `try-with-resources` al trabajar con archivos y sockets en Java?'
    options:
      - id: 'a'
        text: 'Porque acelera la velocidad de lectura de la CPU.'
      - id: 'b'
        text: 'Porque garantiza que cualquier recurso que implemente `AutoCloseable` invoque su método `close()` automáticamente, evitando fugas de descriptores de archivo incluso ante excepciones.'
      - id: 'c'
        text: 'Porque comprime el archivo automáticamente en formato ZIP.'
      - id: 'd'
        text: 'Porque convierte el código a un script sin necesidad de compilar.'
    correctOptionId: 'b'
    explanation: >-
      Los descriptores de archivos son recursos finitos administrados por el sistema operativo. El bloque `try-with-resources` garantiza el cierre determinístico y la liberación de los recursos al salir del bloque, ocurra o no una excepción.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'Al declarar un atributo con la palabra clave `transient` en una clase que implementa `Serializable`, dicho atributo NO será incluido en el flujo de bytes persistido a disco.'
    correctAnswer: true
    explanation: >-
      Verdadero. El modificador `transient` le indica al motor de serialización de Java que omita el campo (útil para datos sensibles como contraseñas, cachés locales o referencias a recursos del sistema no serializables como sockets).
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Cuál es el propósito del campo `private static final long serialVersionUID` en una clase serializable?'
    options:
      - id: 'a'
        text: 'Indicar la cantidad máxima de instancias permitidas en el Heap.'
      - id: 'b'
        text: 'Servir como firma de control de versión para validar que la clase cargada en memoria coincide estructuralmente con la clase que generó el archivo serializado.'
      - id: 'c'
        text: 'Encriptar el archivo binario con una clave de 64 bits.'
      - id: 'd'
        text: 'Es un identificador autoincremental de base de datos.'
    correctOptionId: 'b'
    explanation: >-
      Si la clase se modifica y el `serialVersionUID` no coincide con el guardado en el archivo, Java lanza inmediatamente `InvalidClassException`, evitando que se reconstruya un objeto corrupto o inconsistente.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'La clase `java.nio.file.Files` introducida en NIO.2 requiere siempre instanciar objetos con el operador `new` para realizar operaciones sobre archivos.'
    correctAnswer: false
    explanation: >-
      Falso. `Files` es una clase de utilidad que ofrece métodos estáticos puros (`Files.readString()`, `Files.writeString()`, `Files.exists()`, `Files.copy()`), interactuando con objetos inmutables de tipo `Path`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué información debe contener el archivo `META-INF/MANIFEST.MF` para que un archivo `.jar` pueda ejecutarse directamente con `java -jar mi-app.jar`?'
    options:
      - id: 'a'
        text: 'La clave `Main-Class` especificando el nombre completamente calificado de la clase que contiene el método `public static void main`.'
      - id: 'b'
        text: 'La lista de contraseñas de los usuarios del sistema.'
      - id: 'c'
        text: 'El código fuente completo de todos los archivos .java.'
      - id: 'd'
        text: 'La versión del sistema operativo del servidor.'
    correctOptionId: 'a'
    explanation: >-
      El comando `java -jar` inspecciona el archivo `MANIFEST.MF` buscando el encabezado `Main-Class: com.ejemplo.MiClasePrincipal` para saber qué clase iniciar como punto de entrada de la aplicación.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Un archivo JAR (*Java ARchive*) utiliza internamente el formato estándar de compresión ZIP.'
    correctAnswer: true
    explanation: >-
      Verdadero. Un archivo `.jar` es en esencia un archivo con formato ZIP que agrupa paquetes de archivos compilados `.class`, metadatos en `META-INF/` y recursos estáticos.
---
