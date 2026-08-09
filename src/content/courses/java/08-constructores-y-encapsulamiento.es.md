---
course: 'java'
slug: '07-constructores-y-encapsulamiento'
title: 'Constructores, Modificadores de Acceso y Getters/Setters'
description: 'Aprendé a garantizar que todo objeto nazca válido usando constructores, sobrecarga y this(), y a blindar su estado interno con encapsulamiento, modificadores de acceso y copias defensivas.'
order: 8
lang: 'es'
published: true
---

# Constructores, Modificadores de Acceso y Getters/Setters

En la lección anterior creabas objetos así:

```java
Persona p1 = new Persona();
p1.nombre = "Laura";
p1.edad = 28;
```

Funciona, pero tiene un problema grave: **entre la línea 1 y la línea 3 existe un objeto roto**. Un `Persona` sin nombre y con edad `0` es un objeto que la clase permite crear pero que no representa a ninguna persona real. Y si alguien olvida la línea 2, ese objeto inválido va a circular por todo el programa hasta explotar mucho más lejos, en un lugar donde el error ya no se parece en nada a su causa.

Esta lección resuelve exactamente eso con dos herramientas que trabajan juntas:

- **Constructores**: garantizan que un objeto nazca completo y válido. No hay ventana de tiempo en la que exista a medio armar.
- **Encapsulamiento**: garantiza que, una vez nacido válido, nadie lo pueda dejar inválido desde afuera.

---

## 1. El constructor: el único momento en que un objeto nace

Un **constructor** es un bloque de código especial que la JVM ejecuta automáticamente durante `new`, y solo entonces. Se reconoce por dos reglas sintácticas:

1. Se llama **exactamente igual que la clase** (mayúsculas incluidas).
2. **No declara tipo de retorno**. Ni `void`, ni `int`, ni nada.

```java
public class Producto {
    private String nombre;
    private double precio;

    // Constructor: mismo nombre que la clase, sin tipo de retorno
    public Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}
```

### Qué pasa realmente cuando ejecutás `new`

El constructor no es el primer paso de `new`, es el cuarto. Entender el orden completo explica por qué un atributo puede valer `0` incluso cuando en el constructor le asignás otra cosa.

<figure class="diagram">
<svg viewBox="0 0 900 250" role="img" aria-labelledby="d-new-title">
<title id="d-new-title">Las cinco etapas que ejecuta la JVM al evaluar el operador new</title>
<defs>
<marker id="ar-new" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
</marker>
</defs>
<text x="4" y="20" font-size="14" font-weight="700" fill="var(--color-accent-700)">Producto p = new Producto("Yerba", 3200);</text>

<rect x="3" y="58" width="158" height="140" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<circle cx="27" cy="58" r="14" fill="var(--color-accent)"/>
<text x="27" y="63" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="20" y="100" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Reserva en Heap</text>
<text x="20" y="124" font-size="10.5" fill="var(--color-text)">La JVM aparta un</text>
<text x="20" y="140" font-size="10.5" fill="var(--color-text)">bloque del tamaño</text>
<text x="20" y="156" font-size="10.5" fill="var(--color-text)">de todos los</text>
<text x="20" y="172" font-size="10.5" fill="var(--color-text)">atributos.</text>

<rect x="187" y="58" width="158" height="140" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<circle cx="211" cy="58" r="14" fill="var(--color-accent)"/>
<text x="211" y="63" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">2</text>
<text x="204" y="100" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Valores por</text>
<text x="204" y="116" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">defecto</text>
<text x="204" y="140" font-size="10.5" fill="var(--color-text)">numéricos = 0</text>
<text x="204" y="156" font-size="10.5" fill="var(--color-text)">boolean = false</text>
<text x="204" y="172" font-size="10.5" fill="var(--color-text)">referencias = null</text>

<rect x="371" y="58" width="158" height="140" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<circle cx="395" cy="58" r="14" fill="var(--color-accent)"/>
<text x="395" y="63" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">3</text>
<text x="388" y="100" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Inicializadores</text>
<text x="388" y="124" font-size="10.5" fill="var(--color-text)">Campos declarados</text>
<text x="388" y="140" font-size="10.5" fill="var(--color-text)">con valor y bloques</text>
<text x="388" y="156" font-size="10.5" fill="var(--color-text)">de instancia { },</text>
<text x="388" y="172" font-size="10.5" fill="var(--color-text)">en orden textual.</text>

<rect x="555" y="58" width="158" height="140" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<circle cx="579" cy="58" r="14" fill="var(--color-accent-700)"/>
<text x="579" y="63" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">4</text>
<text x="572" y="100" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Constructor</text>
<text x="572" y="124" font-size="10.5" fill="var(--color-text)">Recién acá corre</text>
<text x="572" y="140" font-size="10.5" fill="var(--color-text)">tu código: validar,</text>
<text x="572" y="156" font-size="10.5" fill="var(--color-text)">asignar, calcular</text>
<text x="572" y="172" font-size="10.5" fill="var(--color-text)">derivados.</text>

<rect x="739" y="58" width="158" height="140" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2)"/>
<circle cx="763" cy="58" r="14" fill="var(--color-accent-2-700)"/>
<text x="763" y="63" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">5</text>
<text x="756" y="100" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">Devuelve la</text>
<text x="756" y="116" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">referencia</text>
<text x="756" y="140" font-size="10.5" fill="var(--color-text)">La variable p del</text>
<text x="756" y="156" font-size="10.5" fill="var(--color-text)">Stack ya apunta al</text>
<text x="756" y="172" font-size="10.5" fill="var(--color-text)">objeto del Heap.</text>

<line x1="165" y1="128" x2="183" y2="128" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-new)"/>
<line x1="349" y1="128" x2="367" y2="128" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-new)"/>
<line x1="533" y1="128" x2="551" y2="128" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-new)"/>
<line x1="717" y1="128" x2="735" y2="128" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-new)"/>

<text x="4" y="228" font-size="11" fill="var(--color-neutral-700)">Si el constructor lanza una excepción, la ejecución muere en la etapa 4: la variable p nunca llega a apuntar al objeto.</text>
</svg>
<figcaption>El operador <code>new</code> ejecuta cinco etapas. El constructor es la cuarta, no la primera: el objeto ya existe en memoria cuando tu código empieza a correr.</figcaption>
</figure>

La consecuencia práctica de la etapa 5 es enorme: **si el constructor valida y lanza una excepción, el objeto inválido nunca sale a la luz**. No hay referencia que lo apunte, así que el recolector de basura se lo lleva. Esa es la diferencia entre validar en el constructor y validar después.

---

## 2. El constructor por defecto y la trampa que esconde

Si vos **no escribís ningún constructor**, el compilador te regala uno vacío y sin parámetros:

```java
public class Persona {
    private String nombre;
    // El compilador inserta implícitamente:
    // public Persona() { }
}

Persona p = new Persona(); // Compila
```

Pero apenas escribís **un solo constructor propio**, ese regalo desaparece:

```java
public class Persona {
    private String nombre;

    public Persona(String nombre) {
        this.nombre = nombre;
    }
}

Persona p = new Persona();          // ERROR de compilación
Persona q = new Persona("Laura");   // Correcto
```

Y esto no es un capricho del lenguaje: es intencional. Si declaraste que una `Persona` necesita un nombre para existir, el compilador te sostiene esa decisión y te impide crear una sin él. **El constructor es un contrato, y el compilador es quien lo hace cumplir.**

> Si además querés seguir permitiendo `new Persona()`, tenés que escribirlo vos mismo explícitamente. No lo escribas por costumbre: escribilo solo si un objeto sin datos tiene sentido real en tu dominio.

---

## 3. Sobrecarga de constructores y delegación con `this(...)`

Una clase puede tener varios constructores siempre que **difieran en su lista de parámetros** (cantidad, tipos u orden). Eso es *sobrecarga*, el mismo concepto que ya viste en métodos.

El error clásico es duplicar la lógica en cada uno:

```java
// MAL: la validación de precio está copiada tres veces.
public Producto() {
    this.nombre = "Sin nombre";
    this.precio = 0;
}
public Producto(String nombre) {
    this.nombre = nombre;
    this.precio = 0;
}
public Producto(String nombre, double precio) {
    this.nombre = nombre;
    if (precio < 0) throw new IllegalArgumentException("Precio negativo");
    this.precio = precio;
}
```

Si mañana agregás una regla nueva —que el nombre no pueda estar vacío— tenés que acordarte de tocar los tres. Vas a olvidarte de uno. Siempre pasa.

La solución es **`this(...)`**: un constructor puede llamar a otro constructor de la misma clase y delegarle todo el trabajo. Se elige **un único constructor canónico** que concentra la validación, y el resto simplemente le pasa valores por defecto.

<figure class="diagram">
<svg viewBox="0 0 900 250" role="img" aria-labelledby="d-this-title">
<title id="d-this-title">Constructores sobrecargados delegando en un único constructor canónico</title>
<defs>
<marker id="ar-this" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/>
</marker>
</defs>

<rect x="4" y="26" width="330" height="66" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="24" y="52" font-size="12.5" font-weight="700" fill="var(--color-text)">Producto()</text>
<text x="24" y="74" font-size="11" fill="var(--color-neutral-700)">this("Sin nombre", 0);</text>

<rect x="4" y="116" width="330" height="66" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="24" y="142" font-size="12.5" font-weight="700" fill="var(--color-text)">Producto(String nombre)</text>
<text x="24" y="164" font-size="11" fill="var(--color-neutral-700)">this(nombre, 0);</text>

<rect x="470" y="40" width="426" height="150" rx="22" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="494" y="68" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Producto(String nombre, double precio)</text>
<text x="494" y="92" font-size="11" fill="var(--color-neutral-800)">CONSTRUCTOR CANÓNICO</text>
<text x="494" y="118" font-size="11" fill="var(--color-text)">· valida que nombre no sea nulo ni vacío</text>
<text x="494" y="138" font-size="11" fill="var(--color-text)">· valida que precio no sea negativo</text>
<text x="494" y="158" font-size="11" fill="var(--color-text)">· asigna los atributos</text>
<text x="494" y="178" font-size="11" fill="var(--color-accent-700)">Es el único lugar donde vive la regla.</text>

<path d="M338 59 C 400 59, 410 95, 466 105" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-this)"/>
<path d="M338 149 C 400 149, 410 125, 466 118" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-this)"/>
<text x="352" y="102" font-size="11" font-weight="700" fill="var(--color-accent-700)">this(...)</text>

<text x="4" y="228" font-size="11" fill="var(--color-neutral-700)">Una regla nueva se agrega en un solo lugar y los tres constructores la heredan automáticamente.</text>
</svg>
<figcaption>Delegación con <code>this(...)</code>: los constructores de conveniencia no repiten lógica, solo completan valores por defecto y llaman al canónico.</figcaption>
</figure>

```java
public class Producto {
    private String nombre;
    private double precio;

    public Producto() {
        this("Sin nombre", 0);          // delega
    }

    public Producto(String nombre) {
        this(nombre, 0);                // delega
    }

    // Constructor canónico: acá vive TODA la validación
    public Producto(String nombre, double precio) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío");
        }
        if (precio < 0) {
            throw new IllegalArgumentException("El precio no puede ser negativo");
        }
        this.nombre = nombre;
        this.precio = precio;
    }
}
```

Dos reglas que el compilador te va a exigir con `this(...)`:

1. **Tiene que ser la primera sentencia del constructor.** No podés poner nada antes, ni siquiera un `System.out.println`.
2. **No puede haber ciclos.** Si `A()` llama a `B()` y `B()` llama a `A()`, es error de compilación, no un desbordamiento en tiempo de ejecución.

---

## 4. Encapsulamiento: qué problema resuelve de verdad

Encapsular **no es** "poné todo `private` y generá getters y setters con el IDE". Eso es ritual, no diseño. Encapsular es esto:

> **El objeto es dueño de su propio estado y es el único responsable de mantenerlo consistente.**

Mientras un atributo sea `public`, cualquier línea de cualquier archivo del proyecto puede dejarlo en un estado imposible, y no hay forma de impedirlo ni de saber quién lo hizo.

<figure class="diagram">
<svg viewBox="0 0 900 320" role="img" aria-labelledby="d-encap-title">
<title id="d-encap-title">Comparación entre una clase con campos públicos y una clase encapsulada</title>
<defs>
<marker id="ar-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/>
</marker>
<marker id="ar-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/>
</marker>
</defs>

<rect x="3" y="6" width="430" height="308" rx="24" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="27" y="38" font-size="13.5" font-weight="700" fill="var(--color-neutral-800)">Sin encapsular — campos public</text>

<rect x="27" y="60" width="150" height="52" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="102" y="82" font-size="11" text-anchor="middle" fill="var(--color-text)">Código externo</text>
<text x="102" y="99" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">p.precio = -500;</text>

<line x1="177" y1="86" x2="270" y2="86" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-bad)"/>
<text x="223" y="76" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">acceso directo</text>

<rect x="278" y="52" width="132" height="68" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-500)"/>
<text x="344" y="76" font-size="11" text-anchor="middle" fill="var(--color-text)">public double</text>
<text x="344" y="93" font-size="11" text-anchor="middle" fill="var(--color-text)">precio;</text>
<text x="344" y="111" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-600)">sin defensa</text>

<rect x="27" y="150" width="383" height="76" rx="16" fill="var(--color-neutral-300)" stroke="var(--color-neutral-500)"/>
<text x="47" y="176" font-size="12" font-weight="700" fill="var(--color-neutral-900)">Estado resultante: precio = -500</text>
<text x="47" y="198" font-size="11" fill="var(--color-neutral-800)">El objeto quedó en un estado imposible y nadie</text>
<text x="47" y="214" font-size="11" fill="var(--color-neutral-800)">pudo impedirlo.</text>

<text x="27" y="256" font-size="11" fill="var(--color-neutral-700)">El error aparece al facturar, tres capas más arriba,</text>
<text x="27" y="272" font-size="11" fill="var(--color-neutral-700)">donde ya no hay ninguna pista de quién lo causó.</text>
<text x="27" y="298" font-size="11" font-weight="700" fill="var(--color-neutral-800)">Culpables posibles: todo el proyecto.</text>

<rect x="467" y="6" width="430" height="308" rx="24" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="491" y="38" font-size="13.5" font-weight="700" fill="var(--color-accent-2-700)">Encapsulado — campos private</text>

<rect x="491" y="60" width="150" height="52" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="566" y="82" font-size="11" text-anchor="middle" fill="var(--color-text)">Código externo</text>
<text x="566" y="99" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">p.setPrecio(-500);</text>

<line x1="641" y1="86" x2="712" y2="86" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-good)"/>

<rect x="720" y="46" width="154" height="80" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="797" y="70" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">setPrecio()</text>
<text x="797" y="90" font-size="10.5" text-anchor="middle" fill="var(--color-text)">if (precio &lt; 0)</text>
<text x="797" y="107" font-size="10.5" text-anchor="middle" fill="var(--color-text)">throw ...</text>
<text x="797" y="122" font-size="10" text-anchor="middle" fill="var(--color-accent-700)">la única puerta</text>

<rect x="491" y="150" width="383" height="76" rx="16" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="511" y="176" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">private double precio;  →  intacto</text>
<text x="511" y="198" font-size="11" fill="var(--color-text)">La asignación inválida se rechaza antes de tocar</text>
<text x="511" y="214" font-size="11" fill="var(--color-text)">el atributo.</text>

<text x="491" y="256" font-size="11" fill="var(--color-neutral-700)">El error aparece exactamente en la línea que lo</text>
<text x="491" y="272" font-size="11" fill="var(--color-neutral-700)">provocó, con el stack trace apuntando al culpable.</text>
<text x="491" y="298" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">Culpables posibles: uno.</text>
</svg>
<figcaption>La diferencia real no es estilística: es <em>dónde se detecta el error</em>. Encapsular convierte un bug difuso en una excepción con dirección exacta.</figcaption>
</figure>

Prestá atención a la última línea de cada panel, porque ahí está todo. Con campos públicos, cuando encontrás un precio negativo en producción tenés que auditar el proyecto entero. Con un setter que valida, el `IllegalArgumentException` se lanza en la línea exacta que lo causó y el stack trace te lleva directo al culpable.

---

## 5. Los cuatro modificadores de acceso

Java define cuatro niveles de visibilidad, del más abierto al más cerrado. Pensalos como círculos concéntricos de confianza:

<figure class="diagram">
<svg viewBox="0 0 900 340" role="img" aria-labelledby="d-mod-title">
<title id="d-mod-title">Los cuatro niveles de visibilidad de Java como círculos concéntricos</title>

<rect x="4" y="8" width="892" height="324" rx="28" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="30" y="38" font-size="13.5" font-weight="700" fill="var(--color-neutral-800)">public</text>
<text x="98" y="38" font-size="11.5" fill="var(--color-neutral-700)">— cualquier clase de cualquier paquete, incluso de otro proyecto que use tu librería</text>

<rect x="44" y="58" width="812" height="254" rx="26" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="70" y="88" font-size="13.5" font-weight="700" fill="var(--color-accent-2-700)">protected</text>
<text x="158" y="88" font-size="11.5" fill="var(--color-neutral-800)">— mismo paquete, más las subclases aunque vivan en otro paquete</text>

<rect x="84" y="108" width="732" height="184" rx="24" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="110" y="138" font-size="13.5" font-weight="700" fill="var(--color-accent-2-800)">sin modificador</text>
<text x="238" y="138" font-size="11.5" fill="var(--color-neutral-800)">(package-private) — solo clases del mismo paquete</text>

<rect x="124" y="158" width="652" height="114" rx="22" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="150" y="188" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">private</text>
<text x="218" y="188" font-size="11.5" fill="var(--color-neutral-900)">— solo dentro de la propia clase. Ni las subclases lo ven.</text>
<text x="150" y="216" font-size="11.5" fill="var(--color-text)">Este es tu valor por defecto para atributos. Siempre.</text>
<text x="150" y="240" font-size="11.5" fill="var(--color-text)">Empezá cerrado y abrí solo lo que otro código realmente necesita usar.</text>
<text x="150" y="260" font-size="11" fill="var(--color-accent-700)">Cerrar después lo que ya publicaste rompe a todos tus usuarios.</text>
</svg>
<figcaption>Cuanto más adentro, menos código puede tocarlo y menos superficie tenés que auditar cuando algo falla.</figcaption>
</figure>

| Modificador | Misma clase | Mismo paquete | Subclase en otro paquete | Cualquier clase |
| --- | --- | --- | --- | --- |
| `private` | Sí | No | No | No |
| *(sin modificador)* | Sí | Sí | No | No |
| `protected` | Sí | Sí | Sí | No |
| `public` | Sí | Sí | Sí | Sí |

**La regla operativa**: atributos siempre `private`; métodos `public` solo si forman parte del contrato que la clase le ofrece al mundo. Todo lo demás, lo más cerrado posible. Abrir visibilidad después es trivial; cerrarla rompe todo el código que ya dependía de ella.

---

## 6. Getters y setters bien hechos

Un getter/setter generado automáticamente que no hace más que leer y escribir el atributo es, en la práctica, un campo público con más ceremonia:

```java
// Esto NO encapsula nada. Es un campo public disfrazado.
public double getPrecio() { return precio; }
public void setPrecio(double precio) { this.precio = precio; }
```

Los accesores valen la pena cuando **hacen algo**: validan, transforman, calculan o directamente no existen.

```java
public class CuentaBancaria {
    private final String titular;   // final: no cambia nunca después del constructor
    private double saldo;

    public CuentaBancaria(String titular, double saldoInicial) {
        if (titular == null || titular.isBlank()) {
            throw new IllegalArgumentException("El titular es obligatorio");
        }
        if (saldoInicial < 0) {
            throw new IllegalArgumentException("El saldo inicial no puede ser negativo");
        }
        this.titular = titular;
        this.saldo = saldoInicial;
    }

    // Getter: sí. Leer el saldo es parte del contrato público.
    public double getSaldo() { return saldo; }

    // Setter de saldo: NO. Nadie debería poder escribir el saldo directamente.
    // En su lugar, operaciones del dominio que expresan la intención:
    public void depositar(double monto) {
        if (monto <= 0) {
            throw new IllegalArgumentException("El depósito debe ser positivo");
        }
        this.saldo += monto;
    }

    public void retirar(double monto) {
        if (monto <= 0) {
            throw new IllegalArgumentException("El retiro debe ser positivo");
        }
        if (monto > saldo) {
            throw new IllegalStateException("Fondos insuficientes");
        }
        this.saldo -= monto;
    }
}
```

Compará las dos formas de escribir lo mismo:

```java
cuenta.setSaldo(cuenta.getSaldo() - 5000);   // ¿Qué está pasando acá? ¿Se validó algo?
cuenta.retirar(5000);                         // La intención es explícita y la regla se aplica.
```

La segunda versión no solo es más legible: es la única de las dos en la que la regla de fondos insuficientes puede existir. **Los métodos deberían nombrar operaciones del dominio, no movimientos de datos.**

---

## 7. La fuga de referencia: el error que rompe el encapsulamiento sin que lo notes

Este es el punto donde la mayoría de las clases "encapsuladas" se caen. Mirá:

```java
public class Curso {
    private List<String> alumnos = new ArrayList<>();

    public List<String> getAlumnos() {
        return alumnos;   // ⚠️ Devolvemos la referencia interna
    }
}
```

Todo parece correcto: el atributo es `private`, hay un getter. Pero:

```java
Curso c = new Curso();
c.getAlumnos().add("Intruso");   // Modificamos el estado interno desde afuera
c.getAlumnos().clear();          // Y lo vaciamos entero
```

El getter entregó la **dirección de memoria de la lista interna**, no una copia. Quien la recibe tiene control total. El `private` no sirvió de nada, porque lo que protege el `private` es el *campo*, no el *objeto al que apunta*.

Hay tres soluciones, de menor a mayor rigidez:

```java
// 1. Vista de solo lectura: barata, pero comparte la lista subyacente.
public List<String> getAlumnos() {
    return Collections.unmodifiableList(alumnos);
}

// 2. Copia defensiva: el llamador recibe una lista propia e independiente.
public List<String> getAlumnos() {
    return new ArrayList<>(alumnos);
}

// 3. No exponer la colección: exponer solo las operaciones que tienen sentido.
public void inscribir(String alumno) {
    if (alumno == null || alumno.isBlank()) {
        throw new IllegalArgumentException("Alumno inválido");
    }
    alumnos.add(alumno);
}

public int cantidadInscriptos() { return alumnos.size(); }
```

La tercera opción es casi siempre la mejor, y no por prolijidad: es la única que te deja agregar después una regla como "máximo 30 inscriptos" sin cambiar la firma pública de la clase.

> La misma trampa aplica a los constructores: si recibís una `List` por parámetro y la asignás directo con `this.lista = lista`, quien te la pasó conserva una referencia viva a tu estado interno. Copiala al entrar también.

---

## 8. Inmutabilidad: el encapsulamiento llevado al extremo

Un objeto **inmutable** no cambia nunca después de nacer. Como no cambia, no puede quedar inconsistente, no necesita setters y es seguro compartirlo entre hilos sin sincronización alguna.

```java
public final class Coordenada {          // final: nadie puede heredar y romper las reglas
    private final double latitud;        // final: solo se asignan en el constructor
    private final double longitud;

    public Coordenada(double latitud, double longitud) {
        if (latitud < -90 || latitud > 90) {
            throw new IllegalArgumentException("Latitud fuera de rango");
        }
        if (longitud < -180 || longitud > 180) {
            throw new IllegalArgumentException("Longitud fuera de rango");
        }
        this.latitud = latitud;
        this.longitud = longitud;
    }

    public double getLatitud() { return latitud; }
    public double getLongitud() { return longitud; }

    // Para "modificar", se devuelve una instancia nueva
    public Coordenada desplazar(double dLat, double dLon) {
        return new Coordenada(latitud + dLat, longitud + dLon);
    }
}
```

Desde Java 16, para este tipo de portadores de datos existe una forma corta, el **record**, que genera constructor, getters, `equals`, `hashCode` y `toString` automáticamente:

```java
public record Coordenada(double latitud, double longitud) {
    // Constructor compacto: solo escribís la validación
    public Coordenada {
        if (latitud < -90 || latitud > 90) {
            throw new IllegalArgumentException("Latitud fuera de rango");
        }
    }
}
```

Lo vas a ver mucho en código moderno. Por ahora quedate con la idea de fondo: **cuanto menos pueda cambiar un objeto, menos formas hay de romperlo.**

---

## 9. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| `public void Producto(...)` con tipo de retorno | Java lo compila como un **método común** llamado `Producto`, no como constructor. El objeto nunca se inicializa y no hay ningún aviso. | Borrar el tipo de retorno. |
| Asignar sin `this` habiendo sombreado: `nombre = nombre;` | El parámetro se asigna a sí mismo. El atributo queda en `null`. Compila sin errores. | Usar `this.nombre = nombre;`. |
| Llamar a un método sobrescribible desde el constructor | La subclase ejecuta el método antes de que sus propios campos estén inicializados. | Que el constructor llame solo a métodos `private` o `final`. |
| Validar en el setter pero no en el constructor | El objeto puede nacer inválido y solo se protege después. | El constructor delega en el setter, o ambos delegan en un validador privado. |
| Generar getters y setters para todos los campos por reflejo | Encapsulamiento nominal: el estado queda tan expuesto como si fuera público. | Exponer solo lo que el contrato realmente necesita. |

---

## 10. Ejercicio práctico guiado

### Desafío: clase `Estudiante`

Escribí una clase `Estudiante` que cumpla **todas** estas condiciones:

1. Atributos `nombre` (String) y `promedio` (double), ambos `private`. El `nombre` no debe poder cambiar nunca una vez creado el objeto.
2. Un constructor canónico que reciba nombre y promedio y valide que el nombre no sea nulo ni vacío, y que el promedio esté entre `0.0` y `10.0`.
3. Un constructor de conveniencia que reciba solo el nombre y arranque con promedio `0.0`, **sin duplicar la validación**.
4. Un setter para `promedio` que aplique la misma regla de rango que el constructor.
5. Un método `aprobo()` que devuelva `true` si el promedio es mayor o igual a `6.0`.
6. Un `main` que demuestre que el objeto rechaza valores inválidos tanto al construirse como al modificarse.

<details>
<summary>Ver solución sugerida</summary>

```java
public class Estudiante {
    private final String nombre;   // final: se fija en el constructor y no cambia más
    private double promedio;

    // Constructor de conveniencia: delega, no duplica
    public Estudiante(String nombre) {
        this(nombre, 0.0);
    }

    // Constructor canónico
    public Estudiante(String nombre, double promedio) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío");
        }
        this.nombre = nombre;
        setPromedio(promedio);   // reutiliza la validación de rango en un solo lugar
    }

    public String getNombre() {
        return nombre;
    }

    public double getPromedio() {
        return promedio;
    }

    public void setPromedio(double promedio) {
        if (promedio < 0.0 || promedio > 10.0) {
            throw new IllegalArgumentException(
                "El promedio debe estar entre 0.0 y 10.0, recibido: " + promedio);
        }
        this.promedio = promedio;
    }

    public boolean aprobo() {
        return promedio >= 6.0;
    }

    @Override
    public String toString() {
        return nombre + " — promedio " + promedio + (aprobo() ? " (aprobado)" : " (desaprobado)");
    }

    public static void main(String[] args) {
        Estudiante e1 = new Estudiante("Laura Giménez", 8.4);
        System.out.println(e1);              // Laura Giménez — promedio 8.4 (aprobado)

        Estudiante e2 = new Estudiante("Carlos Ruiz");
        System.out.println(e2);              // Carlos Ruiz — promedio 0.0 (desaprobado)

        e2.setPromedio(7.2);
        System.out.println(e2);              // Carlos Ruiz — promedio 7.2 (aprobado)

        // El objeto se defiende al modificarse
        try {
            e2.setPromedio(15.0);
        } catch (IllegalArgumentException ex) {
            System.out.println("Rechazado: " + ex.getMessage());
        }

        // Y también al construirse: este objeto nunca llega a existir
        try {
            Estudiante invalido = new Estudiante("", 5.0);
        } catch (IllegalArgumentException ex) {
            System.out.println("Rechazado: " + ex.getMessage());
        }
    }
}
```

**Lo importante de esta solución no es que compile, sino que la regla del rango `0.0–10.0` está escrita una sola vez.** El constructor canónico llama a `setPromedio`, y el constructor de conveniencia llama al canónico. Si mañana el rango pasa a ser `1.0–10.0`, cambiás una línea y los tres caminos quedan corregidos.

</details>

---

## Para llevarte

- El constructor es la **única garantía** de que un objeto nazca válido; validar ahí impide que el objeto inválido llegue siquiera a existir.
- Escribir un constructor elimina el que el compilador te regalaba. Eso es una función, no un bug.
- `this(...)` concentra la validación en un constructor canónico y evita que las reglas se dupliquen.
- Encapsular es hacer que el objeto sea **responsable de su propia consistencia**, no generar accesores en masa.
- `private` es el valor por defecto de todo atributo. Abrí solo lo que el contrato necesita.
- Devolver una colección interna sin copiar **anula el encapsulamiento** por más `private` que tenga el campo.
- Lo que no puede cambiar, no puede romperse: preferí `final` e inmutabilidad siempre que el dominio lo permita.
</content>
</invoke>
