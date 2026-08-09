---
course: 'java'
slug: '01-conceptos-basicos'
title: 'Conceptos Básicos y Tu Primer Programa en Java'
description: 'Comprendé la plataforma Java (JDK, JRE, JVM), la arquitectura WORA, la estructura del método main y escribí tu primer programa interactivo.'
order: 1
lang: 'es'
published: true
---

# Conceptos Básicos y Tu Primer Programa en Java

¡Bienvenido al curso de Java! Java es uno de los lenguajes de programación más populares, robustos y demandados en la industria del software. Desde plataformas bancarias de alta disponibilidad y sistemas backend empresariales masivos hasta aplicaciones Android y microservicios modernos, Java es una piedra angular de la ingeniería moderna.

En esta primera lección comprenderás los pilares que hacen a Java tan potente, su arquitectura interna de compilación y ejecución, la anatomía detallada de una clase ejecutable y cómo escribir tu primer programa.

---

## 1. La Arquitectura de Java: Write Once, Run Anywhere (WORA)

Históricamente, los programas escritos en lenguajes como C o C++ debían compilarse específicamente para cada sistema operativo y arquitectura de procesador (Windows x86, Linux ARM, macOS Apple Silicon). Java revolucionó la industria introduciendo la filosofía **WORA** (*Escribir una vez, ejecutar en cualquier lugar*).

Esto se logra dividiendo la plataforma Java en tres componentes esenciales anidados:

![Diagrama de Arquitectura de Java: JDK, JRE y JVM](/img/courses/java/java-architecture.jpg)

### Componentes de la Plataforma Java:

1. **JDK (Java Development Kit - Kit de Desarrollo Java)**:
   - Es el paquete completo para **desarrolladores**.
   - Incluye el compilador (`javac`), utilidades de empaquetado (`jar`), generadores de documentación (`javadoc`), el depurador (`jdb`) y todas las herramientas necesarias para escribir código.

2. **JRE (Java Runtime Environment - Entorno de Ejecución Java)**:
   - Es el paquete necesario para **ejecutar** aplicaciones Java.
   - Contiene la JVM junto con las librerías estándar del lenguaje (`java.lang`, `java.util`, `java.io`, `java.net`, etc.).

3. **JVM (Java Virtual Machine - Máquina Virtual de Java)**:
   - Es el corazón operativo de Java. Una máquina simulada por software que interpreta y ejecuta el **bytecode**.
   - Incluye componentes clave como:
     - **Class Loader**: Carga los archivos `.class` en memoria.
     - **Bytecode Verifier**: Comprueba la seguridad e integridad del código antes de ejecutarlo.
     - **Compilador JIT (Just-In-Time)**: Traduce fragmentos de bytecode frecuentemente ejecutados directamente a código máquina nativo para maximizar el rendimiento.
     - **Garbage Collector (Recolector de Basura)**: Gestiona automáticamente la memoria, liberando objetos que ya no están en uso.

---

## 2. El Flujo de Compilación y Ejecución

A diferencia de lenguajes puros interpretados (como JavaScript o Python) o compilados nativos (como C++), Java utiliza un proceso de **compilación en dos fases**:

![Flujo de Compilación y Ejecución en Java](/img/courses/java/java-compilation-pipeline.jpg)

1. **Código Fuente (`.java`)**: Es el texto entendible por humanos que escribís en tu editor o IDE.
2. **Compilador `javac`**: Traduce el código fuente a un formato intermedio independiente de la plataforma llamado **Bytecode**.
3. **Bytecode (`.class`)**: Conjunto de instrucciones compactas diseñadas para la JVM.
4. **Ejecución en JVM**: La JVM instalada en el sistema operativo destino (Windows, macOS o Linux) lee el bytecode y lo ejecuta sobre el procesador real mediante interpretación y compilación JIT.

---

## 3. Anatomía Completa de tu Primer Programa

En Java, **todo el código vive obligatoriamente dentro de una clase**. No existen funciones sueltas o código global fuera de clases.

Creemos el clásico programa `HolaMundo.java`:

```java
public class HolaMundo {
    public static void main(String[] args) {
        System.out.println("¡Hola, Mundo desde Java!");
    }
}
```

### Desglose Palabra por Palabra:

| Palabra clave | Significado en Java |
| :--- | :--- |
| `public` | Modificador de acceso. Significa que la clase o método es accesible desde cualquier parte del proyecto. |
| `class` | Declara una clase, el bloque constructivo fundamental de la Programación Orientada a Objetos. |
| `HolaMundo` | Nombre de la clase. **Regla de oro**: El archivo `.java` debe llamarse exactamente igual que la clase pública (`HolaMundo.java`), respetando mayúsculas. |
| `static` | Indica que el método pertenece a la clase en sí y no a una instancia (objeto) concreta. La JVM puede llamarlo sin instanciar la clase. |
| `void` | Indica que el método realiza una acción pero **no devuelve ningún valor**. |
| `main` | Nombre del **punto de entrada** (entry point). La JVM busca exactamente un método llamado `main` para iniciar la ejecución. |
| `String[] args` | Array de cadenas de texto que recibe los argumentos pasados al programa desde la consola de comandos. |
| `System.out.println()` | Imprime una línea en la consola estándar (`out`) seguida de un salto de línea. |

---

## 4. Compilación y Ejecución desde la Consola

Sigamos el flujo paso a paso utilizando la terminal:

### Paso 1: Crear el archivo
Guardá el código anterior en un archivo llamado `HolaMundo.java`.

### Paso 2: Compilar
Ejecutá el compilador `javac` pasándole el archivo fuente:
```bash
javac HolaMundo.java
```
Si no hay errores de sintaxis, se creará el archivo binario `HolaMundo.class` en el mismo directorio.

### Paso 3: Ejecutar
Ejecutá la máquina virtual `java` indicando únicamente el nombre de la clase (sin la extensión `.class`):
```bash
java HolaMundo
```

**Salida en consola:**
```text
¡Hola, Mundo desde Java!
```

---

## 5. Paso de Argumentos por Consola

El parámetro `String[] args` en la firma de `main` nos permite recibir parámetros cuando ejecutamos el programa. Veamos un ejemplo práctico:

```java
public class SaludoPersonalizado {
    public static void main(String[] args) {
        if (args.length > 0) {
            System.out.println("¡Hola, " + args[0] + "! Bienvenido a la ingeniería en Java.");
        } else {
            System.out.println("¡Hola, Desarrollador Anónimo! Pasá tu nombre como argumento.");
        }
    }
}
```

### Compilación y prueba:
```bash
javac SaludoPersonalizado.java

# Ejecución sin argumentos:
java SaludoPersonalizado
# Resultado: ¡Hola, Desarrollador Anónimo! Pasá tu nombre como argumento.

# Ejecución pasando un argumento:
java SaludoPersonalizado Facundo
# Resultado: ¡Hola, Facundo! Bienvenido a la ingeniería en Java.
```

---

## 6. Convenciones de Estilo e Indicadores de Calidad

Para escribir código Java profesional y legible, seguí siempre estas convenciones estándar:

- **Clases e Interfaces**: Usan `PascalCase` (ej: `HolaMundo`, `CuentaBancaria`, `UsuarioService`).
- **Métodos y Variables**: Usan `camelCase` (ej: `calcularTotal()`, `nombreUsuario`, `saldoInicial`).
- **Constantes**: Usan `UPPER_SNAKE_CASE` (ej: `MAX_RETRY_COUNT`, `PI`).
- **Punto y coma `;`**: Cada instrucción en Java finaliza obligatoriamente con `;`.
- **Comentarios**:
  ```java
  // Comentario de una sola línea

  /* 
     Comentario multilínea
     para explicaciones extensas.
  */

  /**
   * Comentario Javadoc para generar documentación de APIs.
   */
  ```

---

## 7. Errores Comunes de Principiantes

1. **`error: class HolaMundo is public, should be declared in a file named HolaMundo.java`**:
   - **Causa**: El nombre del archivo no coincide exactamente con el nombre de la clase `public` (atención a las mayúsculas).
2. **`Error: Could not find or load main class HolaMundo`**:
   - **Causa**: Estás ejecutando `java HolaMundo.class` en lugar de `java HolaMundo`, o no te encontrás en el directorio correcto.
3. **`java.lang.ArrayIndexOutOfBoundsException`**:
   - **Causa**: Intentaste acceder a `args[0]` sin verificar primero `args.length > 0` cuando no enviaste argumentos en la terminal.

---

## 8. Ejercicio Práctico

### Desafío:
Escribí un programa en Java llamado `PerfilDesarrollador.java` que:
1. Verifique si se le pasaron 2 argumentos desde la consola (Nombre y Lenguaje Favorito).
2. Si se pasaron los argumentos, imprima un mensaje formateado:
   `Desarrollador: [Nombre] | Especialidad: [Lenguaje]`
3. Si no se pasaron argumentos, muestre un mensaje de uso explicativo.

<details>
<summary>Ver solución sugerida</summary>

```java
public class PerfilDesarrollador {
    public static void main(String[] args) {
        if (args.length >= 2) {
            String nombre = args[0];
            String lenguaje = args[1];
            System.out.println("==========================================");
            System.out.println(" Desarrollador: " + nombre);
            System.out.println(" Especialidad:  " + lenguaje);
            System.out.println("==========================================");
        } else {
            System.out.println("Uso: java PerfilDesarrollador <TuNombre> <TuLenguaje>");
        }
    }
}
```
</details>