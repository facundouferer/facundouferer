---
course: 'java'
slug: '10-excepciones-y-manejo-de-errores'
title: 'Manejo de Excepciones y Robustez'
description: 'Entendé la jerarquía Throwable, la diferencia entre checked y unchecked, cómo se propaga una excepción por la pila, try-with-resources, excepciones personalizadas y los antipatrones que hay que evitar.'
order: 12
lang: 'es'
published: true
---

# Manejo de Excepciones y Robustez

En la lección 8 escribiste esto:

```java
if (precio < 0) {
    throw new IllegalArgumentException("El precio no puede ser negativo");
}
```

Usaste `throw` sin que nadie te explicara qué significa. Esta lección cierra ese hueco.

Un programa real falla todo el tiempo, y no por culpa tuya: el archivo no está, la red se cae, el usuario escribe `"veintidós"` donde iba un número, la base de datos rechaza la conexión. **La pregunta no es si va a fallar, sino qué hace tu código cuando falla.**

Java tiene una respuesta muy concreta: cuando algo sale mal, se **lanza un objeto** que describe el problema, y la ejecución normal se interrumpe hasta que alguien lo **atrape** y decida qué hacer.

---

## 1. Una excepción es un objeto

Esto es lo primero que hay que sacarse de encima: una excepción no es un código de error ni un estado mágico. Es **una instancia de una clase**, con su jerarquía de herencia, sus atributos y sus métodos, exactamente como todo lo que venís viendo.

<figure class="diagram">
<svg viewBox="0 0 720 350" role="img" aria-labelledby="d-thr-t">
<title id="d-thr-t">Jerarquía de Throwable con Error, Exception checked y RuntimeException unchecked</title>
<rect x="270" y="6" width="180" height="44" rx="14" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="360" y="34" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">Throwable</text>
<line x1="360" y1="50" x2="360" y2="72" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="165" y1="72" x2="555" y2="72" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="165" y1="72" x2="165" y2="90" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="555" y1="72" x2="555" y2="90" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<rect x="30" y="90" width="270" height="82" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="48" y="114" font-size="13.5" font-weight="700" fill="var(--color-neutral-900)">Error</text>
<text x="48" y="136" font-size="11.5" fill="var(--color-neutral-800)">OutOfMemoryError, StackOverflowError.</text>
<text x="48" y="154" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">Fallas de la JVM. NO se capturan.</text>
<rect x="420" y="90" width="270" height="82" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="438" y="114" font-size="13.5" font-weight="700" fill="var(--color-accent-2-800)">Exception</text>
<text x="438" y="136" font-size="11.5" fill="var(--color-neutral-800)">IOException, SQLException.</text>
<text x="438" y="154" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">CHECKED: el compilador te obliga.</text>
<line x1="555" y1="172" x2="555" y2="196" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<rect x="420" y="196" width="270" height="100" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="438" y="220" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">RuntimeException</text>
<text x="438" y="242" font-size="11.5" fill="var(--color-neutral-800)">NullPointerException,</text>
<text x="438" y="260" font-size="11.5" fill="var(--color-neutral-800)">ArithmeticException,</text>
<text x="438" y="278" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">UNCHECKED: el compilador no dice nada.</text>
<rect x="30" y="196" width="270" height="100" rx="16" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<text x="48" y="220" font-size="12" font-weight="700" fill="var(--color-neutral-800)">¿Por qué no capturar un Error?</text>
<text x="48" y="242" font-size="11.5" fill="var(--color-neutral-700)">Porque no hay nada que puedas hacer.</text>
<text x="48" y="260" font-size="11.5" fill="var(--color-neutral-700)">Si la JVM se quedó sin memoria, tu</text>
<text x="48" y="278" font-size="11.5" fill="var(--color-neutral-700)">catch tampoco va a poder ejecutarse.</text>
<text x="0" y="326" font-size="12" fill="var(--color-neutral-700)">Todo lo que cuelga de RuntimeException es unchecked. El resto de Exception es checked. Esa línea divide el mundo en dos.</text>
</svg>
<figcaption>La jerarquía define quién te obliga a hacerte cargo. Es la decisión de diseño más importante al crear una excepción propia.</figcaption>
</figure>

Como cualquier objeto, una excepción trae información útil:

```java
catch (ArithmeticException e) {
    e.getMessage();       // "/ by zero" — la descripción
    e.getCause();         // la excepción original, si esta la envuelve
    e.getStackTrace();    // el recorrido completo de llamadas
    e.printStackTrace();  // lo imprime en la salida de error
}
```

---

## 2. `try`, `catch`, `finally` y el orden en que corren

```java
try {
    // el código que puede fallar
} catch (TipoDeExcepcion e) {
    // qué hacer si falla de esa manera
} finally {
    // lo que hay que hacer sí o sí, pase lo que pase
}
```

<figure class="diagram">
<svg viewBox="0 0 720 370" role="img" aria-labelledby="d-tcf-t">
<title id="d-tcf-t">Qué bloques se ejecutan con y sin excepción en un try-catch-finally</title>
<defs><marker id="ar-tcf" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker></defs>
<text x="0" y="24" font-size="13.5" font-weight="700" fill="var(--color-accent-2-700)">Sin excepción</text>
<text x="375" y="24" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Con excepción</text>
<rect x="0" y="38" width="345" height="56" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="18" y="60" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">try { ... }</text>
<text x="18" y="80" font-size="11.5" fill="var(--color-neutral-800)">se ejecuta entero, hasta la última línea</text>
<line x1="172" y1="96" x2="172" y2="110" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-tcf)"/>
<rect x="0" y="114" width="345" height="56" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<text x="18" y="136" font-size="12.5" font-weight="700" fill="var(--color-neutral-600)">catch (...) { ... }</text>
<text x="18" y="156" font-size="11.5" fill="var(--color-neutral-600)">SE SALTEA por completo</text>
<line x1="172" y1="172" x2="172" y2="186" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-tcf)"/>
<rect x="0" y="190" width="345" height="56" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="18" y="212" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">finally { ... }</text>
<text x="18" y="232" font-size="11.5" fill="var(--color-neutral-800)">se ejecuta</text>
<line x1="172" y1="248" x2="172" y2="262" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-tcf)"/>
<rect x="0" y="266" width="345" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="18" y="288" font-size="12.5" font-weight="700" fill="var(--color-text)">el código que sigue</text>
<text x="18" y="307" font-size="11.5" fill="var(--color-neutral-700)">el programa continúa normalmente</text>
<rect x="375" y="38" width="345" height="56" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="393" y="60" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">try { ... }</text>
<text x="393" y="80" font-size="11.5" fill="var(--color-neutral-800)">se CORTA en la línea que falla</text>
<line x1="547" y1="96" x2="547" y2="110" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-tcf)"/>
<rect x="375" y="114" width="345" height="56" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="393" y="136" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">catch (...) { ... }</text>
<text x="393" y="156" font-size="11.5" fill="var(--color-neutral-800)">se ejecuta, si el tipo coincide</text>
<line x1="547" y1="172" x2="547" y2="186" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-tcf)"/>
<rect x="375" y="190" width="345" height="56" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="393" y="212" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">finally { ... }</text>
<text x="393" y="232" font-size="11.5" fill="var(--color-neutral-800)">se ejecuta igual</text>
<line x1="547" y1="248" x2="547" y2="262" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-tcf)"/>
<rect x="375" y="266" width="345" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="393" y="288" font-size="12.5" font-weight="700" fill="var(--color-text)">el código que sigue</text>
<text x="393" y="307" font-size="11.5" fill="var(--color-neutral-700)">el programa continúa normalmente</text>
<text x="0" y="344" font-size="12" font-weight="700" fill="var(--color-accent-700)">finally se ejecuta SIEMPRE: con excepción, sin excepción, e incluso si hay un return adentro del try.</text>
<text x="0" y="364" font-size="12" fill="var(--color-neutral-700)">Lo único que se saltea es el catch, cuando no hubo nada que atrapar. Todo lo demás corre igual.</text>
</svg>
<figcaption>Las líneas del <code>try</code> posteriores a la falla nunca se ejecutan. Es el error más común al leer un <code>try</code> largo.</figcaption>
</figure>

Ese detalle del `try` que **se corta** es más importante de lo que parece:

```java
try {
    System.out.println("A");
    int x = 10 / 0;              // ← acá se lanza
    System.out.println("B");     // ← NUNCA se ejecuta
} catch (ArithmeticException e) {
    System.out.println("C");
}
System.out.println("D");

// Salida: A, C, D
```

Por eso conviene que los bloques `try` sean **cortos**. Un `try` de cuarenta líneas es un bloque donde no sabés en qué punto quedó todo cuando saltó la excepción.

---

## 3. Checked vs unchecked: quién te obliga

Esta distinción es exclusiva de Java y define cómo se escribe todo el resto.

**Unchecked** (`RuntimeException` y sus hijas): representan **errores de programación**. Un `NullPointerException` no se maneja, se evita. El compilador no te dice nada porque la solución no es un `catch`, es arreglar el código.

```java
String s = null;
s.length();                  // NullPointerException — el bug es el null, no la excepción
int[] a = new int[3];
a[5] = 1;                    // ArrayIndexOutOfBoundsException — el bug es el 5
Integer.parseInt("hola");    // NumberFormatException — validá la entrada antes
```

**Checked** (`Exception` sin ser `RuntimeException`): representan **condiciones esperables del entorno** que tu código no controla. El archivo puede no existir; eso no es un bug tuyo, es la realidad. El compilador te obliga a decidir qué hacés.

Y solo hay dos opciones. **Manejarla:**

```java
public void leerConfiguracion() {
    try {
        String contenido = Files.readString(Path.of("config.txt"));
        System.out.println(contenido);
    } catch (IOException e) {
        System.out.println("No se pudo leer la configuración, uso los valores por defecto.");
    }
}
```

**O declarar que no te hacés cargo**, y que se ocupe quien te llamó:

```java
public String leerConfiguracion() throws IOException {
    return Files.readString(Path.of("config.txt"));   // que decida el de arriba
}
```

> `throw` (lanzar, dentro del método) y `throws` (declarar, en la firma) son cosas distintas y se escriben casi igual. Es una fuente clásica de confusión: `throw` es una acción, `throws` es una advertencia.

---

## 4. La propagación: cómo sube una excepción

Cuando se lanza una excepción y el método actual no la atrapa, **no se pierde**: la JVM abandona ese método y la ofrece al que lo llamó, y así sucesivamente hacia abajo en la pila.

<figure class="diagram">
<svg viewBox="0 0 720 350" role="img" aria-labelledby="d-prop-t">
<title id="d-prop-t">Propagación de una excepción hacia abajo en la pila de llamadas hasta encontrar un catch</title>
<defs><marker id="ar-prop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">La excepción sube por la pila hasta que alguien la atrapa</text>
<rect x="60" y="34" width="400" height="56" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="80" y="56" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Integer.parseInt("veintidós")</text>
<text x="80" y="76" font-size="11.5" fill="var(--color-neutral-800)">throw new NumberFormatException(...)</text>
<text x="476" y="68" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">acá NACE la excepción</text>
<rect x="60" y="104" width="400" height="56" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="80" y="126" font-size="12.5" font-weight="700" fill="var(--color-text)">leerLinea()</text>
<text x="80" y="146" font-size="11.5" fill="var(--color-neutral-700)">no tiene try/catch</text>
<text x="476" y="138" font-size="11.5" fill="var(--color-neutral-700)">abandona y sigue bajando</text>
<rect x="60" y="174" width="400" height="56" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="80" y="196" font-size="12.5" font-weight="700" fill="var(--color-text)">procesarArchivo()</text>
<text x="80" y="216" font-size="11.5" fill="var(--color-neutral-700)">tampoco tiene try/catch</text>
<text x="476" y="208" font-size="11.5" fill="var(--color-neutral-700)">abandona y sigue bajando</text>
<rect x="60" y="244" width="400" height="56" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="80" y="266" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">main()</text>
<text x="80" y="286" font-size="11.5" fill="var(--color-neutral-800)">catch (NumberFormatException e) { ... }</text>
<text x="476" y="278" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">acá SE DETIENE</text>
<line x1="36" y1="290" x2="36" y2="56" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-prop)"/>
<text x="0" y="326" font-size="12" fill="var(--color-neutral-700)">Si nadie la atrapa, la JVM imprime el stack trace y termina el hilo. Ese stack trace es exactamente este recorrido.</text>
</svg>
<figcaption>Cada método que no atrapa la excepción es abandonado inmediatamente: su código posterior a la llamada no se ejecuta.</figcaption>
</figure>

Esto tiene una consecuencia de diseño enorme: **no tenés que capturar donde ocurre el error, sino donde podés hacer algo con él**. Un método que lee un archivo casi nunca sabe qué hacer si no existe; el que sí sabe es el que lo mandó a leer.

Un `catch` que no puede tomar ninguna decisión útil es un `catch` que sobra.

---

## 5. Varios `catch`, y el orden importa

```java
try {
    procesar(datos);
} catch (NumberFormatException e) {       // más específica primero
    System.out.println("El dato no es un número válido.");
} catch (IllegalArgumentException e) {    // NumberFormatException hereda de esta
    System.out.println("Argumento inválido.");
} catch (Exception e) {                   // la más general, al final
    System.out.println("Error inesperado.");
}
```

Java prueba los `catch` **en orden** y ejecuta el primero cuyo tipo coincida. Por eso **van de lo más específico a lo más general**. Si invertís el orden, el compilador te frena directamente: los `catch` posteriores serían inalcanzables.

Cuando dos tipos distintos se manejan igual, no dupliques el bloque: usá **multi-catch**.

```java
try {
    conectarYGuardar();
} catch (IOException | SQLException e) {
    logger.error("Falló la persistencia: " + e.getMessage());
}
```

---

## 6. `try-with-resources`: el cierre que no te podés olvidar

Cuando abrís un archivo, una conexión o un socket, tenés que cerrarlo. Siempre. Incluso —sobre todo— si algo falla en el medio. Hacerlo a mano se ve así:

```java
BufferedReader lector = null;
try {
    lector = new BufferedReader(new FileReader("datos.txt"));
    System.out.println(lector.readLine());
} catch (IOException e) {
    System.out.println("Error de lectura.");
} finally {
    if (lector != null) {          // ¿y si falló al construirlo?
        try {
            lector.close();        // cerrar también puede lanzar excepción
        } catch (IOException e) {
            // y acá casi nadie sabe qué poner
        }
    }
}
```

Nueve líneas de ceremonia, dos casos borde que la mayoría olvida, y todavía no leímos nada útil. Por eso existe `try-with-resources`:

```java
try (BufferedReader lector = new BufferedReader(new FileReader("datos.txt"))) {
    System.out.println(lector.readLine());
} catch (IOException e) {
    System.out.println("Error de lectura.");
}
// lector ya está cerrado, pase lo que pase
```

<figure class="diagram">
<svg viewBox="0 0 720 290" role="img" aria-labelledby="d-twr-t">
<title id="d-twr-t">Las tres salidas posibles de un bloque try-with-resources pasan siempre por el cierre automático</title>
<defs><marker id="ar-twr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="150" y="6" width="420" height="52" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="28" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">try (var lector = new BufferedReader(...)) {</text>
<text x="360" y="47" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">el recurso queda declarado en el paréntesis</text>
<path d="M300 60 L110 60 L110 100" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-twr)"/>
<path d="M360 60 L360 100" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-twr)"/>
<path d="M420 60 L610 60 L610 100" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-twr)"/>
<rect x="0" y="104" width="220" height="52" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="110" y="128" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Termina bien</text>
<text x="110" y="146" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">llegó a la última línea</text>
<rect x="250" y="104" width="220" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="360" y="128" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">Lanza una excepción</text>
<text x="360" y="146" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">se corta a la mitad</text>
<rect x="500" y="104" width="220" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="610" y="128" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">Hace un return</text>
<text x="610" y="146" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">sale antes de tiempo</text>
<path d="M110 158 L110 190 L330 190" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-twr)"/>
<path d="M360 158 L360 190" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-twr)"/>
<path d="M610 158 L610 190 L390 190" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-twr)"/>
<rect x="150" y="196" width="420" height="52" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="220" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">lector.close() — automático</text>
<text x="360" y="238" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">antes de que se ejecute el catch o el finally</text>
<text x="0" y="278" font-size="12" fill="var(--color-neutral-700)">Funciona con cualquier clase que implemente AutoCloseable. Podés declarar varios recursos separados por punto y coma.</text>
</svg>
<figcaption>Los tres caminos de salida convergen en el mismo punto. No hay forma de olvidarse el <code>close()</code> porque no lo escribís vos.</figcaption>
</figure>

---

## 7. Excepciones personalizadas

Cuando el problema es de **tu dominio**, las excepciones estándar no lo describen bien. `IllegalStateException` es correcta pero muda; `SaldoInsuficienteException` te dice qué pasó desde el nombre.

```java
// Unchecked: el llamador puede prevenirlo consultando el saldo antes
public class SaldoInsuficienteException extends RuntimeException {
    private final double faltante;

    public SaldoInsuficienteException(double solicitado, double disponible) {
        super(String.format("Faltan $%.2f: se pidieron $%.2f y hay $%.2f",
              solicitado - disponible, solicitado, disponible));
        this.faltante = solicitado - disponible;
    }

    public double getFaltante() { return faltante; }
}
```

Fijate que la excepción **lleva datos**, no solo un texto. El `catch` puede usarlos:

```java
catch (SaldoInsuficienteException e) {
    System.out.printf("Te faltan $%.2f. ¿Querés cargar saldo?%n", e.getFaltante());
}
```

### ¿Checked o unchecked?

La pregunta que decide: **¿quien llama a este método puede hacer algo razonable para recuperarse?**

- **Sí, y es una condición esperable del entorno** → `extends Exception` (checked). Ejemplo: `ArchivoDeConfiguracionNoEncontrado`.
- **No, o es un error de uso de la API** → `extends RuntimeException` (unchecked). Ejemplo: `EdadInvalidaException`, porque el llamador debería haber validado antes.

En la práctica, la mayoría del código moderno se inclina por **unchecked**, porque las checked obligan a propagar `throws` por toda la cadena de llamadas y eso termina ensuciando firmas de métodos que no tienen nada que ver con el problema.

### Encadenar causas

Cuando traducís una excepción de bajo nivel a una de tu dominio, **nunca pierdas la original**:

```java
try {
    return repositorio.buscarPorId(id);
} catch (SQLException e) {
    // El segundo argumento es la causa: conserva el stack trace completo
    throw new RepositorioNoDisponibleException("No se pudo consultar el cliente " + id, e);
}
```

Sin ese `e`, el stack trace se corta justo donde estaba la información que necesitabas para depurar. Es uno de los errores que más horas cuesta.

---

## 8. Los cuatro antipatrones

**1. El `catch` vacío.** El peor de todos, sin competencia:

```java
try {
    guardarPedido(pedido);
} catch (Exception e) {
    // TODO: ver esto después
}
```

El pedido no se guardó, el usuario ve "listo", y no hay ni un rastro en ningún log. **Un error tragado es infinitamente peor que un error visible.**

**2. Capturar `Exception` de entrada.** Atrapa todo, incluidos los bugs de programación que querías que explotaran fuerte y temprano. Capturá el tipo más específico que sepas manejar.

**3. Excepciones para control de flujo normal.** Que un usuario no exista no es excepcional, es martes:

```java
// Mal: usa una excepción para algo que pasa todos los días
try {
    Usuario u = buscarUsuario(email);
    mostrar(u);
} catch (UsuarioNoEncontradoException e) {
    mostrarFormularioDeRegistro();
}

// Bien: el Optional expresa "puede no haber" sin ninguna excepción
Optional<Usuario> u = buscarUsuario(email);
u.ifPresentOrElse(this::mostrar, this::mostrarFormularioDeRegistro);
```

Además de confundir al que lee, lanzar excepciones es caro: construirlas implica capturar el stack trace completo.

**4. `return` dentro de `finally`.** Descarta silenciosamente la excepción que estaba viajando:

```java
try {
    throw new IllegalStateException("algo grave");
} finally {
    return 0;   // la excepción DESAPARECE. Nadie se entera nunca.
}
```

---

## 9. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| `catch` vacío | El fallo desaparece sin rastro y el bug aparece mucho después, irreconocible. | Como mínimo, registrarlo. Si de verdad se ignora a propósito, dejarlo escrito en un comentario. |
| `catch (Exception e)` como primer catch | Atrapa también los bugs de programación que deberían explotar. | Capturar el tipo más específico que sepas manejar. |
| Poner el `catch` general antes que el específico | Error de compilación: el segundo `catch` es inalcanzable. | Ordenar de lo más específico a lo más general. |
| Relanzar sin la causa: `throw new MiException(e.getMessage())` | Se pierde el stack trace original y con él la línea que falló de verdad. | `throw new MiException("contexto", e)`. |
| Bloque `try` de cincuenta líneas | Imposible saber en qué punto quedó el estado cuando saltó la excepción. | `try` cortos, alrededor de la operación que puede fallar. |
| Cerrar recursos en `finally` a mano | Anidamiento, `null` checks y un `close()` que también puede fallar. | `try-with-resources`. |
| Usar excepciones para casos normales | Código confuso y lento: cada excepción captura el stack trace completo. | `Optional`, valores de retorno o validación previa. |

---

## 10. Ejercicio práctico guiado

### Desafío: validación de edad

1. Creá una excepción `EdadInvalidaException` que extienda `RuntimeException`, guarde la edad rechazada y arme un mensaje descriptivo.
2. Creá una clase `RegistroDePersonas` con un método `registrar(String nombre, int edad)` que la lance si la edad no está entre 0 y 120.
3. Agregá un método `registrarDesdeTexto(String nombre, String edadTexto)` que convierta el texto y traduzca el `NumberFormatException` a tu propia excepción, **conservando la causa**.
4. En el `main`, probá un caso válido, una edad fuera de rango y un texto que no es número. Capturá cada uno y mostrá un mensaje útil.
5. Usá un `finally` para dejar constancia de que el intento de registro terminó, haya salido bien o mal.

<details>
<summary>Ver solución sugerida</summary>

```java
public class EdadInvalidaException extends RuntimeException {
    private final int edadRechazada;

    public EdadInvalidaException(int edadRechazada) {
        super("Edad inválida: " + edadRechazada + ". Debe estar entre 0 y 120.");
        this.edadRechazada = edadRechazada;
    }

    // Constructor con causa: para envolver otra excepción sin perderla
    public EdadInvalidaException(String mensaje, Throwable causa) {
        super(mensaje, causa);
        this.edadRechazada = -1;
    }

    public int getEdadRechazada() { return edadRechazada; }
}

public class RegistroDePersonas {
    private static final int EDAD_MINIMA = 0;
    private static final int EDAD_MAXIMA = 120;

    public void registrar(String nombre, int edad) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (edad < EDAD_MINIMA || edad > EDAD_MAXIMA) {
            throw new EdadInvalidaException(edad);
        }
        System.out.println("  ✓ Registrado: " + nombre + ", " + edad + " años");
    }

    public void registrarDesdeTexto(String nombre, String edadTexto) {
        int edad;
        try {
            edad = Integer.parseInt(edadTexto.trim());
        } catch (NumberFormatException e) {
            // Traducimos al lenguaje de NUESTRO dominio, sin perder la causa
            throw new EdadInvalidaException(
                "'" + edadTexto + "' no es un número válido para una edad", e);
        }
        registrar(nombre, edad);   // la validación de rango vive en un solo lugar
    }
}

public class MainRegistro {
    public static void main(String[] args) {
        RegistroDePersonas registro = new RegistroDePersonas();

        String[][] intentos = {
            {"Laura Giménez", "28"},      // válido
            {"Carlos Ruiz",   "150"},     // fuera de rango
            {"Ana Torres",    "treinta"}  // no es un número
        };

        for (String[] intento : intentos) {
            System.out.println("Intentando registrar a " + intento[0] + "...");
            try {
                registro.registrarDesdeTexto(intento[0], intento[1]);
            } catch (EdadInvalidaException e) {
                System.out.println("  ✗ " + e.getMessage());
                if (e.getCause() != null) {
                    // La causa original sigue disponible para el log técnico
                    System.out.println("    causa técnica: " + e.getCause());
                }
            } catch (IllegalArgumentException e) {
                System.out.println("  ✗ Dato inválido: " + e.getMessage());
            } finally {
                System.out.println("  — intento finalizado —\n");
            }
        }
    }
}
```

**Tres decisiones de diseño para mirar acá.**

`EdadInvalidaException` es **unchecked** porque quien llama puede validar la edad antes: es un error de uso, no una condición del entorno.

`registrarDesdeTexto` **traduce** el `NumberFormatException` técnico a una excepción del dominio, pero pasa `e` como causa. El stack trace completo sigue disponible; solo cambia el idioma en que se cuenta el problema.

Y `registrar` es el único lugar donde vive la regla del rango. `registrarDesdeTexto` convierte y delega. Es el mismo principio del constructor canónico de la lección 8.

</details>

---

## Para llevarte

- Una excepción es **un objeto** con jerarquía, datos y stack trace. No es un código de error.
- **Unchecked** (`RuntimeException`) = error de programación: se evita, no se maneja. **Checked** = condición del entorno: el compilador te obliga a decidir.
- El `try` **se corta** en la línea que falla; el `finally` se ejecuta siempre, incluso con `return` de por medio.
- La excepción sube por la pila hasta encontrar un `catch`. Capturá **donde puedas hacer algo**, no donde ocurre.
- Los `catch` van de lo más específico a lo más general, y el multi-catch evita duplicar bloques.
- `try-with-resources` para todo lo que se abre y se cierra. Sin excepciones.
- Al relanzar, **pasá siempre la causa**: sin ella perdés la línea donde realmente falló.
- Un `catch` vacío es peor que no capturar nada.
</content>
