---
course: 'java'
slug: '17-archivos-persistencia-y-empaquetado-jar'
title: 'Archivos, Serialización y Empaquetado JAR'
description: 'Aprendé a persistir datos con la API moderna de Files y Path, entendé el patrón decorador de los streams, serializá objetos con sus trampas, y empaquetá tu aplicación en un JAR ejecutable.'
order: 19
lang: 'es'
published: true
---

# Archivos, Serialización y Empaquetado JAR

Todo lo que construiste hasta acá tiene el mismo problema: **desaparece al cerrar el programa**. Las listas, los árboles, los grafos, todo vive en el Heap, y el Heap se evapora cuando la JVM termina.

Esta lección cierra ese círculo con dos temas que suelen ir juntos: **cómo guardar el estado en disco** y **cómo entregar tu aplicación** para que otro la ejecute sin tener tu código.

---

## 1. Las dos familias de I/O, y el patrón decorador

Java tiene dos jerarquías paralelas para entrada/salida, y confundirlas es la primera fuente de bugs.

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-io-t">
<title id="d-io-t">Las dos familias de streams de Java y el patrón decorador que las envuelve</title>
<defs><marker id="ar-io" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="0" width="348" height="130" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="18" y="28" font-size="13" font-weight="700" fill="var(--color-neutral-900)">Bytes — datos binarios</text>
<text x="18" y="52" font-size="11.5" font-weight="700" fill="var(--color-text)">InputStream · OutputStream</text>
<text x="18" y="74" font-size="11.5" fill="var(--color-neutral-800)">Imágenes, PDFs, audio, objetos</text>
<text x="18" y="92" font-size="11.5" fill="var(--color-neutral-800)">serializados: cualquier cosa que no</text>
<text x="18" y="110" font-size="11.5" fill="var(--color-neutral-800)">sea texto legible.</text>
<rect x="372" y="0" width="348" height="130" rx="18" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="390" y="28" font-size="13" font-weight="700" fill="var(--color-accent-2-700)">Caracteres — texto</text>
<text x="390" y="52" font-size="11.5" font-weight="700" fill="var(--color-text)">Reader · Writer</text>
<text x="390" y="74" font-size="11.5" fill="var(--color-neutral-800)">Aplican una CODIFICACIÓN al</text>
<text x="390" y="92" font-size="11.5" fill="var(--color-neutral-800)">traducir bytes a caracteres. Sin ella,</text>
<text x="390" y="110" font-size="11.5" fill="var(--color-neutral-800)">las tildes y las ñ se rompen.</text>
<text x="0" y="164" font-size="13" font-weight="700" fill="var(--color-accent-700)">El patrón decorador: cada capa agrega una capacidad</text>
<rect x="0" y="178" width="500" height="94" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="202" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">BufferedReader</text>
<text x="140" y="202" font-size="11" fill="var(--color-neutral-800)">lee bloques de 8 KB y sirve línea por línea</text>
<rect x="20" y="212" width="460" height="48" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="38" y="234" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">FileReader</text>
<text x="140" y="234" font-size="11" fill="var(--color-neutral-800)">sabe abrir un archivo y leer caracteres</text>
<rect x="38" y="240" width="424" height="16" rx="6" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="52" y="252" font-size="10.5" fill="var(--color-neutral-700)">"datos.txt" — el archivo real en el disco</text>
<line x1="504" y1="225" x2="540" y2="225" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-io)"/>
<text x="548" y="204" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">Sin el buffer, cada</text>
<text x="548" y="222" font-size="11.5" fill="var(--color-neutral-800)">carácter sería una ida</text>
<text x="548" y="240" font-size="11.5" fill="var(--color-neutral-800)">al disco. Con él, una</text>
<text x="548" y="258" font-size="11.5" fill="var(--color-neutral-800)">cada 8 KB.</text>
<text x="0" y="298" font-size="12" fill="var(--color-neutral-800)">new BufferedReader(new FileReader("datos.txt"))  —  se lee de adentro hacia afuera: el FileReader toca el</text>
<text x="0" y="316" font-size="12" fill="var(--color-neutral-800)">disco, el BufferedReader lo amortigua. Es la misma composición de la lección 10: envolver en lugar de heredar.</text>
<text x="0" y="336" font-size="12" font-weight="700" fill="var(--color-accent-700)">Leer sin buffer un archivo de 10 MB puede ser cien veces más lento. No es una optimización opcional.</text>
</svg>
<figcaption>Los <code>Buffered*</code> no cambian lo que hacés, cambian cuántas veces se toca el disco. Por eso se envuelve siempre.</figcaption>
</figure>

---

## 2. La forma moderna: `Files` y `Path`

Desde Java 7 existe NIO.2, y para el 90 % de los casos convierte diez líneas en una.

<figure class="diagram">
<svg viewBox="0 0 720 250" role="img" aria-labelledby="d-nio-t">
<title id="d-nio-t">Comparación entre la API clásica de java.io y la API moderna de Files</title>
<rect x="0" y="0" width="720" height="110" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="20" y="26" font-size="12.5" font-weight="700" fill="var(--color-neutral-900)">java.io clásico — leer un archivo entero</text>
<rect x="20" y="36" width="480" height="60" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="55" font-size="11" fill="var(--color-text)">StringBuilder sb = new StringBuilder();</text>
<text x="34" y="72" font-size="11" fill="var(--color-text)">try (BufferedReader r = new BufferedReader(new FileReader(f))) {</text>
<text x="34" y="89" font-size="11" fill="var(--color-text)">    String l; while ((l = r.readLine()) != null) sb.append(l).append("\n");  }</text>
<text x="518" y="60" font-size="12" font-weight="700" fill="var(--color-neutral-800)">4 líneas, un bucle</text>
<text x="518" y="80" font-size="11.5" fill="var(--color-neutral-700)">y una asignación dentro</text>
<text x="518" y="96" font-size="11.5" fill="var(--color-neutral-700)">de la condición.</text>
<rect x="0" y="126" width="720" height="110" rx="18" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="20" y="152" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">NIO.2 moderno — lo mismo</text>
<rect x="20" y="162" width="480" height="60" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="188" font-size="11.5" fill="var(--color-text)">Path ruta = Path.of("datos.txt");</text>
<text x="34" y="210" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">String texto = Files.readString(ruta);</text>
<text x="518" y="186" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">1 línea</text>
<text x="518" y="206" font-size="11.5" fill="var(--color-neutral-800)">UTF-8 por defecto, cierra</text>
<text x="518" y="222" font-size="11.5" fill="var(--color-neutral-800)">sola, sin bucle.</text>
</svg>
<figcaption>El API clásico sigue siendo necesario para archivos gigantes que no entran en memoria. Para todo lo demás, <code>Files</code>.</figcaption>
</figure>

```java
import java.nio.file.*;
import java.io.IOException;

Path ruta = Path.of("datos", "catalogo.txt");   // arma la ruta sin separadores a mano

// Leer todo de una (archivos chicos y medianos)
String contenido = Files.readString(ruta);
List<String> lineas = Files.readAllLines(ruta);

// Escribir
Files.writeString(ruta, "hola\n");                                  // sobrescribe
Files.writeString(ruta, "otra línea\n", StandardOpenOption.APPEND); // agrega al final

// Consultas
boolean existe   = Files.exists(ruta);
long tamanio     = Files.size(ruta);
Files.createDirectories(ruta.getParent());   // crea toda la jerarquía si falta
```

Para archivos grandes, `Files.lines()` devuelve un stream perezoso: **procesa línea por línea sin cargar todo en memoria**.

```java
// Cuenta las líneas de error de un log de 2 GB sin usar 2 GB de RAM
try (Stream<String> lineas = Files.lines(Path.of("app.log"))) {
    long errores = lineas.filter(l -> l.contains("ERROR")).count();
    System.out.println("Errores: " + errores);
}
```

Fijate el `try-with-resources` de la lección 11: `Files.lines` abre un archivo, así que hay que cerrarlo. `readString` y `readAllLines` no lo necesitan porque cierran solos.

### La trampa de la codificación

Este es el bug clásico que aparece solo en la máquina de otra persona:

```java
// MAL: usa la codificación por defecto del sistema operativo
new FileReader("datos.txt");
new FileWriter("salida.txt");

// BIEN: la codificación es explícita y el archivo se lee igual en todos lados
Files.readString(ruta);                                    // UTF-8 por defecto
Files.newBufferedReader(ruta, StandardCharsets.UTF_8);
new FileWriter("salida.txt", StandardCharsets.UTF_8);
```

Un archivo escrito con la codificación por defecto de Windows y leído con la de Linux convierte cada `ñ` y cada `á` en basura. **Fijá siempre UTF-8 explícitamente.**

---

## 3. Serialización: guardar objetos enteros

Escribir texto está bien para datos simples. Pero ¿cómo guardás un `Producto` con sus atributos, o una lista entera de ellos?

La **serialización** convierte un objeto del Heap en una secuencia de bytes, y viceversa.

<figure class="diagram">
<svg viewBox="0 0 720 310" role="img" aria-labelledby="d-ser-t">
<title id="d-ser-t">Ciclo de serialización y deserialización de un objeto a un archivo</title>
<defs><marker id="ar-se" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="30" width="196" height="76" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="98" y="54" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Objeto en el Heap</text>
<text x="98" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">Producto("Yerba", 3200)</text>
<text x="98" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">vive en memoria</text>
<line x1="198" y1="68" x2="238" y2="68" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-se)"/>
<rect x="244" y="30" width="212" height="76" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="350" y="54" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">ObjectOutputStream</text>
<text x="350" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">writeObject(producto)</text>
<text x="350" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">recorre los campos y los aplana</text>
<line x1="458" y1="68" x2="498" y2="68" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-se)"/>
<rect x="504" y="30" width="216" height="76" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="612" y="54" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">catalogo.ser</text>
<text x="612" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">bytes en el disco</text>
<text x="612" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">sobrevive al programa</text>
<line x1="612" y1="110" x2="612" y2="140" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-se)"/>
<line x1="98" y1="140" x2="98" y2="110" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-se)"/>
<rect x="244" y="146" width="212" height="60" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="350" y="170" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">ObjectInputStream</text>
<text x="350" y="190" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">readObject() → objeto NUEVO</text>
<line x1="504" y1="176" x2="460" y2="176" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-se)"/>
<line x1="240" y1="176" x2="200" y2="176" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-se)"/>
<text x="504" y="180" font-size="11" fill="var(--color-neutral-700)">lee</text>
<text x="0" y="180" font-size="11" fill="var(--color-neutral-700)">reconstruye</text>
<rect x="0" y="226" width="348" height="76" rx="16" fill="var(--color-neutral-100)" stroke="var(--color-neutral-500)" stroke-dasharray="5 4"/>
<text x="18" y="250" font-size="11.5" font-weight="700" fill="var(--color-neutral-900)">transient — lo que NO se guarda</text>
<text x="18" y="270" font-size="11" fill="var(--color-neutral-800)">Contraseñas, conexiones, cachés. Al volver</text>
<text x="18" y="288" font-size="11" fill="var(--color-neutral-800)">quedan en null o 0.</text>
<rect x="372" y="226" width="348" height="76" rx="16" fill="var(--color-neutral-100)" stroke="var(--color-neutral-500)" stroke-dasharray="5 4"/>
<text x="390" y="250" font-size="11.5" font-weight="700" fill="var(--color-neutral-900)">serialVersionUID — el número de versión</text>
<text x="390" y="270" font-size="11" fill="var(--color-neutral-800)">Si cambia la clase y no lo declaraste vos,</text>
<text x="390" y="288" font-size="11" fill="var(--color-neutral-800)">Java lo recalcula: InvalidClassException.</text>
</svg>
<figcaption>El objeto que sale de <code>readObject()</code> es <em>nuevo</em>: mismos datos, otra dirección de memoria. Y el constructor de la clase nunca se ejecuta.</figcaption>
</figure>

```java
import java.io.*;
import java.util.List;

public class Producto implements Serializable {          // marcador: "soy serializable"
    private static final long serialVersionUID = 1L;     // declaralo SIEMPRE, a mano

    private final String nombre;
    private final double precio;
    private transient String cacheDeCalculo;             // NO se guarda

    public Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}

// Guardar una lista entera de una sola vez
try (ObjectOutputStream out = new ObjectOutputStream(
         Files.newOutputStream(Path.of("catalogo.ser")))) {
    out.writeObject(catalogo);
}

// Recuperarla
try (ObjectInputStream in = new ObjectInputStream(
         Files.newInputStream(Path.of("catalogo.ser")))) {
    @SuppressWarnings("unchecked")
    List<Producto> catalogo = (List<Producto>) in.readObject();
}
```

Tres cosas que hay que saber sí o sí:

1. **`serialVersionUID` declaralo a mano.** Si no lo hacés, Java calcula uno a partir de la estructura de la clase. Agregás un campo, ese número cambia, y todos los archivos guardados antes dejan de poder leerse con `InvalidClassException`.
2. **`transient` excluye un campo.** Al deserializar queda en `null` o `0`. Es lo correcto para contraseñas, conexiones abiertas y cachés.
3. **El constructor no corre.** Java reconstruye el objeto campo por campo, salteándose tu constructor. Toda la validación que pusiste ahí **no se aplica**.

> **En 2026, la serialización de Java se usa poco en sistemas nuevos.** El formato es propietario —solo lo lee otro programa Java—, es frágil ante cambios en las clases, y ha sido fuente de vulnerabilidades graves de deserialización. Para intercambiar datos hoy se usa **JSON** (con Jackson o Gson) o formatos binarios como Protobuf. Aprendela porque la vas a encontrar en código existente, no porque sea la primera opción.

---

## 4. Empaquetar: del código fuente al JAR ejecutable

Tu programa funciona en tu IDE. Ahora hay que entregarlo.

<figure class="diagram">
<svg viewBox="0 0 720 250" role="img" aria-labelledby="d-jar-t">
<title id="d-jar-t">Del código fuente al JAR ejecutable, paso a paso</title>
<defs><marker id="ar-jr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="30" width="150" height="70" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="75" y="56" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">Main.java</text>
<text x="75" y="76" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">código fuente</text>
<text x="75" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">que escribís vos</text>
<line x1="152" y1="65" x2="188" y2="65" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-jr)"/>
<text x="170" y="56" font-size="10" text-anchor="middle" fill="var(--color-accent-700)">javac</text>
<rect x="194" y="30" width="150" height="70" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="269" y="56" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">Main.class</text>
<text x="269" y="76" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">bytecode</text>
<text x="269" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">que entiende la JVM</text>
<line x1="346" y1="65" x2="382" y2="65" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-jr)"/>
<text x="364" y="56" font-size="10" text-anchor="middle" fill="var(--color-accent-700)">jar</text>
<rect x="388" y="30" width="150" height="70" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="463" y="56" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">app.jar</text>
<text x="463" y="76" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">un ZIP con todos</text>
<text x="463" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">los .class adentro</text>
<line x1="540" y1="65" x2="576" y2="65" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-jr)"/>
<rect x="582" y="30" width="138" height="70" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="651" y="56" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">java -jar</text>
<text x="651" y="76" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">corre en cualquier</text>
<text x="651" y="92" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">máquina con JVM</text>
<rect x="150" y="130" width="420" height="94" rx="16" fill="var(--color-neutral-100)" stroke="var(--color-neutral-500)"/>
<text x="170" y="154" font-size="12" font-weight="700" fill="var(--color-neutral-900)">META-INF/MANIFEST.MF — dentro del JAR</text>
<text x="170" y="178" font-size="11.5" fill="var(--color-text)">Manifest-Version: 1.0</text>
<text x="170" y="198" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">Main-Class: com.facundouferer.tienda.Main</text>
<text x="170" y="216" font-size="11" fill="var(--color-neutral-700)">Sin esa línea, java -jar no sabe por dónde empezar y falla.</text>
<line x1="463" y1="102" x2="420" y2="128" stroke="var(--color-neutral-500)" stroke-width="1.5" stroke-dasharray="4 3"/>
</svg>
<figcaption>Un JAR es literalmente un archivo ZIP con una convención de nombres. Podés abrirlo con cualquier descompresor y ver qué hay adentro.</figcaption>
</figure>

```bash
# 1. Compilar todo a la carpeta bin/
javac -d bin $(find src -name "*.java")

# 2. Empaquetar. La 'e' declara la clase principal en el manifiesto
jar cvfe app.jar com.facundouferer.tienda.Main -C bin .

# 3. Ejecutar en cualquier máquina que tenga una JVM
java -jar app.jar
```

Las banderas de `jar`: `c` crear, `v` verboso, `f` nombre del archivo, `e` *entry point*. La parte `-C bin .` significa "cambiá a la carpeta `bin` y meté todo lo que hay ahí".

En un proyecto real vas a usar **Maven** o **Gradle**, que hacen esto y además descargan dependencias, corren los tests y arman un *fat jar* con las librerías incluidas:

```bash
mvn package        # deja el jar en target/
./gradlew build    # lo deja en build/libs/
```

---

## 5. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| No cerrar el archivo | El archivo queda bloqueado y, al escribir, se pierde lo que quedó en el buffer. | `try-with-resources`, siempre. |
| Usar `FileReader`/`FileWriter` sin charset | El archivo se lee bien en tu máquina y se rompe en otra. Tildes y `ñ` convertidas en basura. | Pasar `StandardCharsets.UTF_8` explícitamente, o usar `Files`. |
| Leer un archivo enorme con `readAllLines` | `OutOfMemoryError` con un log de varios GB. | `Files.lines()` dentro de un `try-with-resources`. |
| No declarar `serialVersionUID` | Agregás un campo y todos los archivos guardados dejan de leerse: `InvalidClassException`. | `private static final long serialVersionUID = 1L;`. |
| Esperar que el constructor corra al deserializar | Las validaciones no se aplican y el objeto puede quedar inválido. | Validar en `readObject`, o directamente no usar serialización nativa. |
| Concatenar rutas con `"/"` o `"\\"` a mano | Falla al cambiar de sistema operativo. | `Path.of("carpeta", "archivo.txt")`. |
| `jar` sin `Main-Class` en el manifiesto | `java -jar` responde "no main manifest attribute". | Usar `jar cvfe` con la clase principal, o declararla en el manifiesto. |
| Serializar objetos con campos no serializables | `NotSerializableException` en tiempo de ejecución. | Marcarlos `transient`, o que la clase también implemente `Serializable`. |

---

## 6. Ejercicio práctico guiado

### Desafío: catálogo persistente

1. Creá `Producto` serializable, con `serialVersionUID` declarado.
2. Escribí `Catalogo` con `guardar(Path)` y `cargar(Path)` usando serialización.
3. Agregá `exportarCSV(Path)` e `importarCSV(Path)` con la API `Files`.
4. Manejá el caso "el archivo no existe" devolviendo un catálogo vacío, sin que explote.
5. Compará los dos formatos: abrí el `.ser` y el `.csv` en un editor de texto.

<details>
<summary>Ver solución sugerida</summary>

```java
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Stream;

public class Producto implements Serializable {
    private static final long serialVersionUID = 1L;   // declarado a mano, a propósito

    private final String nombre;
    private final double precio;
    private final int stock;

    public Producto(String nombre, double precio, int stock) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (precio < 0) throw new IllegalArgumentException("Precio negativo");
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }
    public int getStock()     { return stock; }

    public String aLineaCSV() {
        // Escapamos las comillas del nombre para no romper el formato
        return String.format(Locale.US, "\"%s\";%.2f;%d",
                             nombre.replace("\"", "\"\""), precio, stock);
    }

    public static Producto desdeLineaCSV(String linea) {
        String[] campos = linea.split(";");
        if (campos.length != 3) {
            throw new IllegalArgumentException("Línea CSV inválida: " + linea);
        }
        String nombre = campos[0].replaceAll("^\"|\"$", "").replace("\"\"", "\"");
        return new Producto(nombre,
                            Double.parseDouble(campos[1]),
                            Integer.parseInt(campos[2]));
    }

    @Override
    public String toString() {
        return String.format(Locale.US, "%-20s $%9.2f  x%d", nombre, precio, stock);
    }
}

public class Catalogo {

    private final List<Producto> productos = new ArrayList<>();

    public void agregar(Producto p) { productos.add(p); }
    public List<Producto> getProductos() { return List.copyOf(productos); }  // copia defensiva

    // ── Serialización nativa: binaria, solo la lee Java ──────────
    public void guardar(Path ruta) throws IOException {
        Files.createDirectories(ruta.toAbsolutePath().getParent());
        try (ObjectOutputStream out = new ObjectOutputStream(
                 new BufferedOutputStream(Files.newOutputStream(ruta)))) {
            out.writeObject(productos);
        }
    }

    @SuppressWarnings("unchecked")
    public static Catalogo cargar(Path ruta) throws IOException, ClassNotFoundException {
        Catalogo catalogo = new Catalogo();
        if (!Files.exists(ruta)) {
            return catalogo;   // 4. archivo inexistente → catálogo vacío, sin excepción
        }
        try (ObjectInputStream in = new ObjectInputStream(
                 new BufferedInputStream(Files.newInputStream(ruta)))) {
            catalogo.productos.addAll((List<Producto>) in.readObject());
        }
        return catalogo;
    }

    // ── CSV: texto, lo lee cualquier programa ────────────────────
    public void exportarCSV(Path ruta) throws IOException {
        List<String> lineas = new ArrayList<>();
        lineas.add("nombre;precio;stock");                    // encabezado
        for (Producto p : productos) {
            lineas.add(p.aLineaCSV());
        }
        Files.write(ruta, lineas, StandardCharsets.UTF_8);    // charset explícito
    }

    public static Catalogo importarCSV(Path ruta) throws IOException {
        Catalogo catalogo = new Catalogo();
        if (!Files.exists(ruta)) return catalogo;

        // Stream perezoso: funciona igual con un CSV de 5 GB
        try (Stream<String> lineas = Files.lines(ruta, StandardCharsets.UTF_8)) {
            lineas.skip(1)                                    // salteamos el encabezado
                  .filter(l -> !l.isBlank())
                  .map(Producto::desdeLineaCSV)
                  .forEach(catalogo::agregar);
        }
        return catalogo;
    }

    public static void main(String[] args) throws Exception {
        Path ser = Path.of("datos", "catalogo.ser");
        Path csv = Path.of("datos", "catalogo.csv");
        Files.createDirectories(Path.of("datos"));

        Catalogo original = new Catalogo();
        original.agregar(new Producto("Yerba Playadito", 3200.00, 45));
        original.agregar(new Producto("Café molido",     5800.50, 12));
        original.agregar(new Producto("Azúcar 1kg",      1150.00, 80));

        original.guardar(ser);
        original.exportarCSV(csv);

        System.out.println("Recuperado del .ser:");
        Catalogo.cargar(ser).getProductos().forEach(p -> System.out.println("  " + p));

        System.out.println("\nRecuperado del .csv:");
        Catalogo.importarCSV(csv).getProductos().forEach(p -> System.out.println("  " + p));

        System.out.println("\nArchivo inexistente → " +
            Catalogo.cargar(Path.of("no-existe.ser")).getProductos().size() + " productos");

        System.out.println("\nTamaños:  .ser " + Files.size(ser) +
                           " bytes   ·   .csv " + Files.size(csv) + " bytes");
        System.out.println("\nContenido del CSV (legible por cualquiera):");
        Files.lines(csv).forEach(l -> System.out.println("  " + l));
    }
}
```

**Abrí los dos archivos en un editor de texto. Esa comparación es el ejercicio de verdad.**

El `.csv` se lee perfecto, lo abre Excel, lo puede parsear Python, y si mañana agregás un campo a `Producto` los archivos viejos siguen siendo legibles.

El `.ser` es binario ilegible, solo lo entiende otro programa Java, y si agregás un campo sin cuidar el `serialVersionUID` todos los archivos guardados se vuelven basura.

Por eso, salvo que necesites específicamente serialización nativa —caché entre procesos Java, `HttpSession` replicada—, **elegí un formato de texto**. Hoy sería JSON con Jackson, que es lo que vas a ver en la próxima lección con Spring Boot.

Detalle a mirar: `importarCSV` usa `Files.lines()` con `try-with-resources` y un stream perezoso. Ese mismo código funciona con un CSV de tres líneas o de cinco gigabytes, porque nunca carga el archivo entero en memoria.

</details>

---

## Para llevarte

- **Bytes** (`InputStream`/`OutputStream`) para binario; **caracteres** (`Reader`/`Writer`) para texto con codificación.
- Los `Buffered*` son un **decorador**: no cambian qué hacés, cambian cuántas veces se toca el disco.
- Para el 90 % de los casos, `Files.readString`, `Files.writeString` y `Files.lines` reemplazan todo el API clásico.
- **Fijá UTF-8 explícitamente.** La codificación por defecto es la causa del bug que solo aparece en otra máquina.
- `Files.lines()` procesa archivos gigantes sin cargarlos en memoria, pero necesita `try-with-resources`.
- Al deserializar, **el constructor no se ejecuta**: tus validaciones no se aplican.
- Declará `serialVersionUID` a mano o vas a perder todos los archivos guardados al primer cambio de la clase.
- Preferí **formatos de texto** (CSV, JSON) antes que la serialización nativa: son portables, legibles y estables.
- Un JAR es un ZIP con un `MANIFEST.MF`; sin `Main-Class` no es ejecutable.
</content>
