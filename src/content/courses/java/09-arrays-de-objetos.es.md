---
course: 'java'
slug: '09-arrays-de-objetos'
title: 'Arrays de Objetos: Guardar y Recorrer Muchas Instancias'
description: 'Combiná arrays con clases: creá arrays de objetos, evitá el NullPointerException de las casillas vacías, recorrelos, buscá, ordená con Comparable y Comparator, y manejá capacidad contra cantidad real.'
order: 9
lang: 'es'
published: true
---

# Arrays de Objetos: Guardar y Recorrer Muchas Instancias

En la lección 4 aprendiste a guardar muchos valores del mismo tipo en un array. En las lecciones 7 y 8 aprendiste a diseñar una clase que garantiza que cada objeto nazca válido y se mantenga consistente.

Esta lección junta las dos cosas, y ese cruce es donde Java empieza a servir para algo real:

```java
Persona p1 = new Persona("Laura", 28);
Persona p2 = new Persona("Carlos", 35);
Persona p3 = new Persona("Ana", 41);
// ¿y si son 500?
```

Exactamente el mismo problema que te llevó al array en la lección 4, pero ahora con objetos. La solución es la misma —un array— salvo por un detalle que cambia todo: **un array de objetos no guarda objetos, guarda referencias a objetos**.

Ese detalle es responsable del `NullPointerException` más común de todo Java, de que dos casillas puedan modificar el mismo objeto sin que lo notes, y de que `Arrays.sort` no funcione hasta que le expliques cómo comparar. Vamos por partes.

---

## 1. Un array de objetos tiene dos niveles de memoria

Un `int[]` guarda los números adentro. Un `Persona[]` guarda **direcciones** que apuntan a objetos que viven en otro lado del Heap.

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-obj-mem-t">
<title id="d-obj-mem-t">Un array de primitivos guarda los valores; un array de objetos guarda referencias a objetos externos</title>
<defs><marker id="ar-objmem" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">int[] edades = {28, 35, 41};</text>
<rect x="0" y="34" width="240" height="56" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<rect x="12" y="44" width="68" height="36" rx="10" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="46" y="69" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">28</text>
<rect x="86" y="44" width="68" height="36" rx="10" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="120" y="69" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">35</text>
<rect x="160" y="44" width="68" height="36" rx="10" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="194" y="69" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">41</text>
<text x="258" y="58" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">Un solo nivel.</text>
<text x="258" y="78" font-size="12" fill="var(--color-text)">El valor está dentro de la casilla.</text>
<text x="2" y="126" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Persona[] personas = {new Persona("Laura", 28), ...};</text>
<rect x="0" y="140" width="240" height="56" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<rect x="12" y="150" width="68" height="36" rx="10" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="46" y="174" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">ref</text>
<rect x="86" y="150" width="68" height="36" rx="10" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="120" y="174" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">ref</text>
<rect x="160" y="150" width="68" height="36" rx="10" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="194" y="174" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">ref</text>
<path d="M46 190 C 46 226, 300 214, 336 224" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-objmem)"/>
<path d="M120 190 C 120 240, 300 250, 336 256" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-objmem)"/>
<path d="M194 190 C 194 254, 300 286, 336 288" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-objmem)"/>
<rect x="344" y="204" width="376" height="40" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="362" y="229" font-size="13" font-weight="700" fill="var(--color-text)">Persona</text>
<text x="702" y="229" font-size="12.5" text-anchor="end" fill="var(--color-neutral-800)">nombre="Laura"  edad=28</text>
<rect x="344" y="248" width="376" height="40" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="362" y="273" font-size="13" font-weight="700" fill="var(--color-text)">Persona</text>
<text x="702" y="273" font-size="12.5" text-anchor="end" fill="var(--color-neutral-800)">nombre="Carlos"  edad=35</text>
<rect x="344" y="292" width="376" height="40" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="362" y="317" font-size="13" font-weight="700" fill="var(--color-text)">Persona</text>
<text x="702" y="317" font-size="12.5" text-anchor="end" fill="var(--color-neutral-800)">nombre="Ana"  edad=41</text>
<text x="258" y="164" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Dos niveles.</text>
<text x="258" y="184" font-size="12" fill="var(--color-text)">La casilla solo apunta.</text>
</svg>
<figcaption>El array de objetos es un array de flechas. Los objetos son independientes de él: el array puede desaparecer y los objetos sobrevivir, y un mismo objeto puede estar apuntado desde varias casillas.</figcaption>
</figure>

De esa indirección salen las tres reglas que gobiernan el resto de la lección:

- **Crear el array no crea los objetos.** Son dos pasos, no uno.
- **Copiar una casilla copia la flecha, no el objeto.** Dos casillas pueden apuntar al mismo lugar.
- **Una casilla puede no apuntar a nada.** Ese "nada" se llama `null`, y es la fuente de errores número uno.

---

## 2. Los dos pasos de la creación

Este es el error inaugural de todo el que empieza con arrays de objetos:

```java
Persona[] personas = new Persona[3];

System.out.println(personas.length);          // 3   — el array existe
System.out.println(personas[0]);              // null — pero está vacío
System.out.println(personas[0].getNombre());  // NullPointerException
```

`new Persona[3]` reserva **tres casillas capaces de apuntar a una `Persona`**. No construye ninguna `Persona`. Es la diferencia entre comprar tres sobres y escribir tres cartas.

<figure class="diagram">
<svg viewBox="0 0 720 322" role="img" aria-labelledby="d-dos-pasos-t">
<title id="d-dos-pasos-t">Crear el array y crear los objetos son dos operaciones distintas</title>
<defs><marker id="ar-pasos" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="0" width="720" height="132" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<circle cx="32" cy="34" r="16" fill="var(--color-neutral-600)"/>
<text x="32" y="40" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="60" y="30" font-size="14" font-weight="700" fill="var(--color-neutral-800)">new Persona[3]</text>
<text x="60" y="49" font-size="12.5" fill="var(--color-text)">Reserva tres casillas. Las tres quedan en null: no hay ningún objeto todavía.</text>
<rect x="60" y="62" width="180" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-neutral-600)" stroke-width="2" stroke-dasharray="6 5"/>
<text x="150" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">null</text>
<rect x="250" y="62" width="180" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-neutral-600)" stroke-width="2" stroke-dasharray="6 5"/>
<text x="340" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">null</text>
<rect x="440" y="62" width="180" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-neutral-600)" stroke-width="2" stroke-dasharray="6 5"/>
<text x="530" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">null</text>
<text x="640" y="92" font-size="12" font-weight="700" fill="var(--color-neutral-700)">length = 3</text>
<line x1="32" y1="136" x2="32" y2="152" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-pasos)"/>
<rect x="0" y="158" width="720" height="132" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<circle cx="32" cy="192" r="16" fill="var(--color-accent-700)"/>
<text x="32" y="198" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">2</text>
<text x="60" y="188" font-size="14" font-weight="700" fill="var(--color-accent-700)">personas[i] = new Persona(...)</text>
<text x="60" y="207" font-size="12.5" fill="var(--color-text)">Recién ahora se construyen los objetos y cada casilla pasa a apuntar a uno.</text>
<rect x="60" y="220" width="180" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="150" y="242" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">Laura</text>
<text x="150" y="260" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">28 años</text>
<rect x="250" y="220" width="180" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="340" y="242" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">Carlos</text>
<text x="340" y="260" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">35 años</text>
<rect x="440" y="220" width="180" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="530" y="242" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">Ana</text>
<text x="530" y="260" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">41 años</text>
<text x="640" y="248" font-size="12" font-weight="700" fill="var(--color-accent-700)">length = 3</text>
<text x="2" y="312" font-size="12.5" fill="var(--color-text)">Si te salteás el paso 2 para alguna casilla, esa casilla sigue en null y explota la primera vez que la uses.</text>
</svg>
<figcaption>Con primitivos el paso 2 no existe: <code>new int[3]</code> ya te deja tres ceros usables. Con objetos, el array nace vacío y llenarlo es trabajo tuyo.</figcaption>
</figure>

Las tres formas de llenarlo:

```java
// A) Literal: creás array y objetos en una sola expresión
Persona[] personas = {
    new Persona("Laura", 28),
    new Persona("Carlos", 35),
    new Persona("Ana", 41)
};

// B) Casilla por casilla
Persona[] equipo = new Persona[3];
equipo[0] = new Persona("Laura", 28);
equipo[1] = new Persona("Carlos", 35);
equipo[2] = new Persona("Ana", 41);

// C) En un bucle, que es el caso real
String[] nombres = {"Laura", "Carlos", "Ana"};
int[] edades = {28, 35, 41};

Persona[] plantel = new Persona[nombres.length];
for (int i = 0; i < plantel.length; i++) {
    plantel[i] = new Persona(nombres[i], edades[i]);
}
```

Fijate lo que hace posible la forma C: **el constructor validador de la lección 8 corre una vez por cada objeto**. Si alguno de los datos de entrada es inválido, el objeto ni siquiera llega a existir. Sin constructores tendrías que crear los tres objetos vacíos y llenarlos después a mano, que es exactamente la ventana de tiempo con objetos rotos que la lección 8 se ocupó de cerrar.

---

## 3. El `null` en las casillas: el error más común de Java

Un array parcialmente lleno es una bomba de tiempo:

```java
Persona[] personas = new Persona[5];
personas[0] = new Persona("Laura", 28);
personas[1] = new Persona("Carlos", 35);
// las casillas 2, 3 y 4 quedaron en null

for (Persona p : personas) {
    System.out.println(p.getNombre());   // NullPointerException en la tercera vuelta
}
```

Tenés tres formas de defenderte, en orden de preferencia:

```java
// 1. La mejor: que el array no tenga casillas de más
Persona[] personas = new Persona[2];   // creá exactamente las que vas a llenar

// 2. Si no podés, verificá antes de usar
for (Persona p : personas) {
    if (p != null) {
        System.out.println(p.getNombre());
    }
}

// 3. Si el null nunca debería pasar, fallá fuerte y temprano
import java.util.Objects;

public void registrar(Persona p) {
    this.persona = Objects.requireNonNull(p, "La persona no puede ser null");
}
```

> La opción 2 es un parche, no una solución. Un array con `null` adentro casi siempre significa que en realidad necesitabas **capacidad y cantidad por separado** — es el tema de la sección 8, y es la puerta de entrada al TAD Lista.

---

## 4. Recorrer y mostrar

Recorrer es igual que con primitivos, con la diferencia de que ahora cada elemento tiene métodos.

```java
for (Persona p : personas) {
    System.out.println(p.getNombre() + " tiene " + p.getEdad() + " años");
}

// Con índice, cuando necesitás reemplazar la referencia de una casilla
for (int i = 0; i < personas.length; i++) {
    if (personas[i].getEdad() < 18) {
        personas[i] = new Persona(personas[i].getNombre(), 18);
    }
}
```

### `toString()`: sin él, imprimir un array de objetos no sirve

```java
System.out.println(Arrays.toString(personas));
// [Persona@1b6d3586, Persona@4554617c, Persona@74a14482]
```

Eso que ves es el `toString()` que hereda de `Object`: nombre de la clase, arroba y el hash en hexadecimal. Inútil. La solución es sobrescribirlo en tu clase:

```java
public class Persona {
    private final String nombre;
    private final int edad;

    public Persona(String nombre, int edad) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío");
        }
        if (edad < 0 || edad > 130) {
            throw new IllegalArgumentException("Edad fuera de rango: " + edad);
        }
        this.nombre = nombre;
        this.edad = edad;
    }

    public String getNombre() { return nombre; }
    public int getEdad()      { return edad; }

    @Override
    public String toString() {
        return nombre + " (" + edad + ")";
    }
}
```

```java
System.out.println(Arrays.toString(personas));
// [Laura (28), Carlos (35), Ana (41)]
```

**Escribí `toString()` en toda clase que vayas a meter en un array.** El costo son tres líneas y te ahorra horas de depuración a ciegas.

---

## 5. Buscar dentro de un array de objetos

Con primitivos buscabas un valor. Con objetos buscás *el objeto cuyo atributo cumple algo*, y eso siempre es un recorrido lineal escrito a mano:

```java
public static Persona buscarPorNombre(Persona[] personas, String nombre) {
    for (Persona p : personas) {
        if (p != null && p.getNombre().equalsIgnoreCase(nombre)) {
            return p;      // encontrada: cortamos acá
        }
    }
    return null;           // recorrimos todo y no está
}
```

Tres decisiones de diseño que valen más que el código:

- **`equalsIgnoreCase`, nunca `==`.** Comparás el contenido de dos `String`, y ya viste en la lección 4 por qué `==` te traiciona apenas el texto viene de afuera.
- **`p != null` primero.** El orden importa: si evaluás `p.getNombre()` antes de la comprobación, explota.
- **Devolver `null` cuando no está** es la opción tradicional, pero traslada el problema a quien llama. En Java moderno se prefiere `Optional<Persona>`, que obliga a contemplar el caso de "no encontrado":

```java
import java.util.Optional;

public static Optional<Persona> buscar(Persona[] personas, String nombre) {
    for (Persona p : personas) {
        if (p != null && p.getNombre().equalsIgnoreCase(nombre)) {
            return Optional.of(p);
        }
    }
    return Optional.empty();
}

// Quien llama no puede ignorar el caso vacío:
buscar(personas, "Ana")
    .ifPresentOrElse(
        p -> System.out.println("Encontrada: " + p),
        () -> System.out.println("No está en el plantel")
    );
```

---

## 6. Ordenar: `Arrays.sort` necesita que le expliques el criterio

Con `int[]` alcanzaba con `Arrays.sort(numeros)`, porque los números tienen un orden obvio. Con objetos no lo hay: ¿dos personas se ordenan por nombre, por edad, por fecha de ingreso?

```java
Arrays.sort(personas);   // ClassCastException: Persona cannot be cast to Comparable
```

Java te ofrece dos mecanismos, y la diferencia entre ellos es conceptual, no técnica.

<figure class="diagram">
<svg viewBox="0 0 720 318" role="img" aria-labelledby="d-comp-t">
<title id="d-comp-t">Comparable define el orden natural dentro de la clase; Comparator define órdenes alternativos desde afuera</title>
<rect x="0" y="30" width="340" height="150" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="56" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Comparable</text>
<text x="20" y="76" font-size="12" font-weight="700" fill="var(--color-neutral-800)">El orden natural, uno solo</text>
<text x="20" y="99" font-size="12.5" fill="var(--color-text)">Vive DENTRO de la clase Persona.</text>
<text x="20" y="120" font-size="12.5" fill="var(--color-text)">Se implementa compareTo(otra).</text>
<text x="20" y="141" font-size="12.5" fill="var(--color-text)">Responde: "¿cuál es EL orden de esta clase?"</text>
<text x="20" y="166" font-size="12" font-weight="700" fill="var(--color-accent-700)">Arrays.sort(personas);</text>
<rect x="380" y="30" width="340" height="150" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="400" y="56" font-size="13.5" font-weight="700" fill="var(--color-accent-2-800)">Comparator</text>
<text x="400" y="76" font-size="12" font-weight="700" fill="var(--color-neutral-800)">Órdenes alternativos, los que quieras</text>
<text x="400" y="99" font-size="12.5" fill="var(--color-text)">Vive FUERA, es un objeto aparte.</text>
<text x="400" y="120" font-size="12.5" fill="var(--color-text)">Se arma con Comparator.comparing(...).</text>
<text x="400" y="141" font-size="12.5" fill="var(--color-text)">Responde: "¿cómo quiero ordenar ACÁ?"</text>
<text x="400" y="166" font-size="12" font-weight="700" fill="var(--color-accent-2-800)">Arrays.sort(personas, porEdad);</text>
<rect x="0" y="204" width="720" height="72" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="22" y="230" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Los dos devuelven un int, y solo importa su signo</text>
<rect x="22" y="240" width="200" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-neutral-600)"/>
<text x="122" y="258" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">negativo: a va antes</text>
<rect x="234" y="240" width="200" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-neutral-600)"/>
<text x="334" y="258" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">cero: da igual el orden</text>
<rect x="446" y="240" width="200" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-neutral-600)"/>
<text x="546" y="258" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">positivo: a va después</text>
<text x="2" y="298" font-size="12.5" fill="var(--color-text)">Una clase tiene como mucho UN Comparable, pero puede tener tantos Comparator como criterios necesites.</text>
<text x="2" y="314" font-size="12" fill="var(--color-neutral-700)">Nunca restes fechas ni valores grandes para armar el int: usá Integer.compare(a, b) y evitás el desbordamiento.</text>
</svg>
<figcaption>Si tu clase tiene un orden evidente y único —un DNI, un número de legajo— usá <code>Comparable</code>. Para todo lo demás, un <code>Comparator</code> por criterio.</figcaption>
</figure>

### Orden natural con `Comparable`

```java
public class Persona implements Comparable<Persona> {
    // ... atributos y constructor ...

    @Override
    public int compareTo(Persona otra) {
        return this.nombre.compareToIgnoreCase(otra.nombre);
    }
}
```

```java
Arrays.sort(personas);
System.out.println(Arrays.toString(personas));
// [Ana (41), Carlos (35), Laura (28)]
```

### Órdenes alternativos con `Comparator`

```java
import java.util.Comparator;

// Por edad, de menor a mayor
Arrays.sort(personas, Comparator.comparingInt(Persona::getEdad));

// Por edad descendente
Arrays.sort(personas, Comparator.comparingInt(Persona::getEdad).reversed());

// Por edad y, a igual edad, por nombre
Arrays.sort(personas, Comparator
        .comparingInt(Persona::getEdad)
        .thenComparing(Persona::getNombre));
```

> `Arrays.sort` sobre objetos usa TimSort, que es **estable**: los elementos que empatan conservan el orden en que estaban. Por eso `thenComparing` es la forma correcta de desempatar, y por eso ordenar dos veces seguidas con criterios distintos no da lo mismo que un criterio compuesto.

Un array de objetos con `null` adentro **rompe cualquier ordenamiento** con `NullPointerException`, porque el comparador termina invocando métodos sobre la casilla vacía. Otro motivo para no dejar huecos.

---

## 7. Aliasing: la casilla apunta, no contiene

Esta es la consecuencia menos intuitiva de los dos niveles de memoria.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-alias-t">
<title id="d-alias-t">Dos casillas que apuntan al mismo objeto comparten cualquier cambio</title>
<defs><marker id="ar-alias" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">equipo[2] = equipo[0];   equipo[2].cumplirAnios();</text>
<rect x="0" y="40" width="300" height="180" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="20" y="64" font-size="12" font-weight="700" fill="var(--color-neutral-800)">equipo</text>
<rect x="20" y="76" width="260" height="40" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="40" y="101" font-size="13" font-weight="700" fill="var(--color-text)">[0] ref</text>
<rect x="20" y="124" width="260" height="40" rx="12" fill="var(--color-bg)" stroke="var(--color-neutral-600)"/>
<text x="40" y="149" font-size="13" font-weight="700" fill="var(--color-text)">[1] ref</text>
<rect x="20" y="172" width="260" height="40" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="40" y="197" font-size="13" font-weight="700" fill="var(--color-text)">[2] ref</text>
<path d="M282 96 L 396 118" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-alias)"/>
<path d="M282 192 L 396 138" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-alias)"/>
<path d="M282 144 L 396 208" fill="none" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-alias)"/>
<rect x="404" y="100" width="316" height="58" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="424" y="124" font-size="13.5" font-weight="700" fill="var(--color-text)">Persona "Laura"</text>
<text x="424" y="146" font-size="12.5" fill="var(--color-accent-700)">edad: 28 → 29   (cambió una sola vez)</text>
<rect x="404" y="186" width="316" height="46" rx="14" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="424" y="215" font-size="13" font-weight="700" fill="var(--color-text)">Persona "Carlos"</text>
<text x="2" y="258" font-size="12.5" fill="var(--color-text)">equipo[0] y equipo[2] son dos flechas al MISMO objeto. Modificarlo por una se ve por la otra: equipo[0].getEdad() ahora es 29.</text>
<text x="2" y="278" font-size="12.5" fill="var(--color-text)">El objeto de la casilla [2] original quedó sin referencias y se lo lleva el recolector de basura.</text>
<text x="2" y="296" font-size="12" fill="var(--color-neutral-700)">Para tener dos objetos independientes hay que construir uno nuevo, no copiar la referencia.</text>
</svg>
<figcaption>Esto es lo mismo que viste con la copia superficial en la lección 4, pero adentro de un solo array. Asignar una casilla a otra nunca duplica el objeto.</figcaption>
</figure>

```java
Persona[] equipo = {
    new Persona("Laura", 28),
    new Persona("Carlos", 35),
    new Persona("Ana", 41)
};

equipo[2] = equipo[0];        // ahora [0] y [2] apuntan al MISMO objeto
System.out.println(equipo[0] == equipo[2]);   // true
```

Lo mismo pasa al copiar el array entero:

```java
Persona[] copia = Arrays.copyOf(equipo, equipo.length);

System.out.println(copia == equipo);          // false — son dos arrays distintos
System.out.println(copia[0] == equipo[0]);    // true  — comparten los objetos
```

Una **copia profunda** hay que escribirla:

```java
Persona[] profunda = new Persona[equipo.length];
for (int i = 0; i < equipo.length; i++) {
    profunda[i] = new Persona(equipo[i].getNombre(), equipo[i].getEdad());
}
```

> Este problema desaparece si tu clase es **inmutable** —atributos `final` y sin setters, como la `Persona` de arriba—. Si nadie puede modificar el objeto, compartir la referencia no puede hacer daño. Es la misma razón por la que nunca sufrís aliasing con `String`.

---

## 8. Capacidad contra cantidad: el array parcialmente lleno

Casi siempre no sabés de antemano cuántos objetos vas a guardar. La solución clásica es reservar de más y llevar la cuenta de cuántas casillas están realmente usadas.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-cap-t">
<title id="d-cap-t">Capacidad es el largo del array; cantidad es cuántas casillas están realmente ocupadas</title>
<defs><marker id="ar-cap" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Persona[] datos = new Persona[6];   int cantidad = 3;</text>
<rect x="0" y="36" width="112" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="56" y="60" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Laura</text>
<text x="56" y="78" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">[0]</text>
<rect x="118" y="36" width="112" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="174" y="60" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Carlos</text>
<text x="174" y="78" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">[1]</text>
<rect x="236" y="36" width="112" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="292" y="60" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Ana</text>
<text x="292" y="78" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">[2]</text>
<rect x="354" y="36" width="112" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="6 5"/>
<text x="410" y="60" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-700)">null</text>
<text x="410" y="78" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">[3]</text>
<rect x="472" y="36" width="112" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="6 5"/>
<text x="528" y="60" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-700)">null</text>
<text x="528" y="78" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">[4]</text>
<rect x="590" y="36" width="112" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="6 5"/>
<text x="646" y="60" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-700)">null</text>
<text x="646" y="78" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">[5]</text>
<path d="M0 102 L 348 102" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
<path d="M0 94 L 0 110" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
<path d="M348 94 L 348 110" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
<text x="14" y="128" font-size="13" font-weight="700" fill="var(--color-accent-700)">cantidad = 3 — la parte que existe de verdad</text>
<path d="M0 152 L 702 152" fill="none" stroke="var(--color-neutral-600)" stroke-width="3" stroke-linecap="round"/>
<path d="M0 144 L 0 160" stroke="var(--color-neutral-600)" stroke-width="3" stroke-linecap="round"/>
<path d="M702 144 L 702 160" stroke="var(--color-neutral-600)" stroke-width="3" stroke-linecap="round"/>
<text x="14" y="178" font-size="13" font-weight="700" fill="var(--color-neutral-700)">datos.length = 6 — la capacidad reservada</text>
<rect x="0" y="198" width="720" height="66" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="22" y="224" font-size="13" font-weight="700" fill="var(--color-accent-2-800)">Regla de oro: recorré hasta cantidad, nunca hasta datos.length</text>
<text x="22" y="248" font-size="12.5" fill="var(--color-text)">for (int i = 0; i menor que cantidad; i++)  →  así jamás tocás una casilla null.</text>
<text x="2" y="288" font-size="12.5" fill="var(--color-text)">Una clase que envuelva este array y este contador, con agregar/eliminar/obtener, es exactamente un TAD Lista: la lección 13.</text>
</svg>
<figcaption>Separar <em>capacidad</em> de <em>cantidad</em> es el paso conceptual que convierte un array suelto en una estructura de datos. <code>ArrayList</code> hace exactamente esto por dentro.</figcaption>
</figure>

```java
public class Registro {
    private Persona[] datos = new Persona[6];
    private int cantidad = 0;                 // cuántas casillas están usadas

    public void agregar(Persona p) {
        if (cantidad == datos.length) {
            // se llenó: duplicamos la capacidad (lección 4, sección 4)
            datos = Arrays.copyOf(datos, datos.length * 2);
        }
        datos[cantidad] = p;
        cantidad++;
    }

    public void eliminar(int indice) {
        if (indice < 0 || indice >= cantidad) {
            throw new IndexOutOfBoundsException("Índice inválido: " + indice);
        }
        // corremos todo lo que está a la derecha una posición a la izquierda
        for (int i = indice; i < cantidad - 1; i++) {
            datos[i] = datos[i + 1];
        }
        datos[cantidad - 1] = null;   // liberamos la referencia sobrante
        cantidad--;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void listar() {
        for (int i = 0; i < cantidad; i++) {    // hasta cantidad, no hasta length
            System.out.println(datos[i]);
        }
    }
}
```

Prestá atención a `datos[cantidad - 1] = null;` en `eliminar`. Sin esa línea el programa funciona igual, pero la última casilla sigue apuntando a un objeto que ya nadie usa y el recolector de basura no puede liberarlo. Es una fuga de memoria pequeña, silenciosa y perfectamente evitable.

---

## 9. Un array de objetos como atributo: composición y copia defensiva

El caso más frecuente no es un array suelto en el `main`, es un array **adentro** de otra clase:

```java
public class Curso {
    private final String nombre;
    private final Persona[] alumnos;

    public Curso(String nombre, Persona[] alumnos) {
        this.nombre = nombre;
        this.alumnos = alumnos;          // MAL
    }

    public Persona[] getAlumnos() {
        return alumnos;                  // MAL
    }
}
```

Las dos líneas marcadas anulan el encapsulamiento de la lección 8, por el mismo motivo de la sección 7: se está compartiendo la flecha.

```java
Persona[] lista = { new Persona("Laura", 28) };
Curso curso = new Curso("Java", lista);

lista[0] = new Persona("Intruso", 99);   // modificamos el array desde afuera
System.out.println(curso.getAlumnos()[0]);   // Intruso (99)

curso.getAlumnos()[0] = null;            // y también desde el getter
```

La corrección es copiar en la entrada y en la salida:

```java
public Curso(String nombre, Persona[] alumnos) {
    this.nombre = nombre;
    this.alumnos = Arrays.copyOf(alumnos, alumnos.length);   // copia al entrar
}

public Persona[] getAlumnos() {
    return Arrays.copyOf(alumnos, alumnos.length);           // copia al salir
}
```

Con una `Persona` inmutable, la copia superficial alcanza: nadie puede modificar los objetos apuntados. Si `Persona` tuviera setters, harían falta copias profundas para blindar el `Curso` de verdad.

---

## 10. Errores frecuentes

- **Creer que `new Persona[3]` crea tres personas.** Crea tres `null`.
- **Recorrer hasta `length` teniendo un contador.** Recorré hasta `cantidad`.
- **No sobrescribir `toString()`.** Imprimís hashes en hexadecimal y depurás a ciegas.
- **`Arrays.sort` sin `Comparable` ni `Comparator`.** `ClassCastException` en ejecución, no en compilación.
- **Ordenar un array con `null` adentro.** `NullPointerException` dentro del comparador.
- **Comparar objetos con `==`.** Compara identidad. Para contenido hace falta `equals()` — su contrato completo llega en la lección 16.
- **Asignar `a[i] = a[j]` creyendo que copia.** Copia la referencia; quedan dos flechas al mismo objeto.
- **Exponer el array interno de una clase.** Un `private` no sirve de nada si el getter devuelve la referencia.
- **Olvidar `datos[cantidad - 1] = null` al eliminar.** Deja viva una referencia que el GC no puede liberar.

---

## 11. Ejercicios prácticos guiados

### Ejercicio 1 — Estadísticas del plantel

Dado un `Persona[]` sin `null`, mostrá la persona más joven, la más grande y el promedio de edad en un solo recorrido.

<details>
<summary>Ver solución sugerida</summary>

```java
public class Estadisticas {

    public static void informe(Persona[] personas) {
        if (personas == null || personas.length == 0) {
            System.out.println("No hay personas para analizar");
            return;
        }

        // Arrancamos con el primer elemento, no con valores inventados
        Persona masJoven = personas[0];
        Persona masGrande = personas[0];
        long sumaEdades = 0;

        for (Persona p : personas) {
            if (p.getEdad() < masJoven.getEdad())  masJoven = p;
            if (p.getEdad() > masGrande.getEdad()) masGrande = p;
            sumaEdades += p.getEdad();
        }

        double promedio = (double) sumaEdades / personas.length;

        System.out.println("Más joven: " + masJoven);
        System.out.println("Más grande: " + masGrande);
        System.out.println("Promedio: %.1f años".formatted(promedio));
    }

    public static void main(String[] args) {
        Persona[] plantel = {
            new Persona("Laura", 28),
            new Persona("Carlos", 35),
            new Persona("Ana", 41)
        };
        informe(plantel);
    }
}
```

Fijate que `masJoven` guarda **la referencia al objeto**, no la edad. Así, cuando terminás el recorrido, tenés la persona entera y no solo su número: podés imprimir su nombre sin volver a buscarla.
</details>

### Ejercicio 2 — Filtrar en un array nuevo

Escribí un método que reciba un `Persona[]` y devuelva otro array solo con las personas mayores de una edad dada. El array resultante no debe tener casillas sobrantes.

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.Arrays;

public static Persona[] mayoresDe(Persona[] personas, int edadMinima) {
    // 1. Reservamos con la capacidad máxima posible
    Persona[] resultado = new Persona[personas.length];
    int cantidad = 0;

    // 2. Llenamos solo con los que cumplen
    for (Persona p : personas) {
        if (p != null && p.getEdad() >= edadMinima) {
            resultado[cantidad] = p;
            cantidad++;
        }
    }

    // 3. Recortamos a la cantidad real: sin este paso quedan null al final
    return Arrays.copyOf(resultado, cantidad);
}
```

Los tres pasos son el patrón estándar de filtrado con arrays: **reservar de más, contar, recortar**. El paso 3 es el que suele faltar, y es el que evita que el array devuelto tenga `null` que exploten después.

Notá también que el array resultante comparte los objetos con el original (aliasing, sección 7). Para este caso está bien: filtrar no debería duplicar personas.
</details>

### Ejercicio 3 — Ordenar por dos criterios

Ordená un `Persona[]` por edad descendente y, a igual edad, por nombre alfabético.

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.Arrays;
import java.util.Comparator;

public class OrdenarPersonas {
    public static void main(String[] args) {
        Persona[] personas = {
            new Persona("Laura", 35),
            new Persona("Ana", 41),
            new Persona("Bruno", 35),
            new Persona("Carlos", 28)
        };

        Arrays.sort(personas, Comparator
                .comparingInt(Persona::getEdad).reversed()
                .thenComparing(Persona::getNombre));

        System.out.println(Arrays.toString(personas));
        // [Ana (41), Bruno (35), Laura (35), Carlos (28)]
    }
}
```

El orden de los métodos importa: `.reversed()` invierte **solo lo acumulado hasta ese punto**, así que se aplica a la edad y no al desempate por nombre. Si escribieras `.thenComparing(...).reversed()`, invertirías los dos criterios a la vez.

Una alternativa escrita a mano, para ver qué hace por dentro:

```java
Arrays.sort(personas, (a, b) -> {
    int porEdad = Integer.compare(b.getEdad(), a.getEdad());   // b antes que a = descendente
    if (porEdad != 0) return porEdad;
    return a.getNombre().compareTo(b.getNombre());
});
```
</details>

### Ejercicio 4 — Agenda con capacidad dinámica

Implementá una clase `Agenda` que guarde `Contacto` en un array interno, crezca sola cuando se llena, y permita agregar, buscar por nombre y eliminar por índice.

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.Arrays;
import java.util.Optional;

public class Agenda {
    private Contacto[] contactos = new Contacto[4];
    private int cantidad = 0;

    public void agregar(Contacto c) {
        if (c == null) {
            throw new IllegalArgumentException("El contacto no puede ser null");
        }
        if (cantidad == contactos.length) {
            contactos = Arrays.copyOf(contactos, contactos.length * 2);
        }
        contactos[cantidad++] = c;
    }

    public Optional<Contacto> buscar(String nombre) {
        for (int i = 0; i < cantidad; i++) {
            if (contactos[i].getNombre().equalsIgnoreCase(nombre)) {
                return Optional.of(contactos[i]);
            }
        }
        return Optional.empty();
    }

    public void eliminar(int indice) {
        if (indice < 0 || indice >= cantidad) {
            throw new IndexOutOfBoundsException(
                "Índice " + indice + " fuera de rango [0, " + (cantidad - 1) + "]");
        }
        for (int i = indice; i < cantidad - 1; i++) {
            contactos[i] = contactos[i + 1];
        }
        contactos[--cantidad] = null;
    }

    public int getCantidad() {
        return cantidad;
    }

    public Contacto[] listar() {
        // copia defensiva y recortada: ni referencias internas ni null sobrantes
        return Arrays.copyOf(contactos, cantidad);
    }
}
```

Esta clase ya es, conceptualmente, un `ArrayList` en miniatura: array interno, capacidad que se duplica, tamaño lógico separado del físico y desplazamiento al eliminar. En la lección 13 vas a formalizarla como TAD Lista y a compararla con la versión enlazada.
</details>

---

## Para llevarte

- Un array de objetos guarda **referencias**, no objetos. Todo lo raro que hace sale de ahí.
- `new Persona[3]` crea tres `null`. Crear el array y crear los objetos son **dos pasos**.
- Un array con casillas vacías es la causa del `NullPointerException` más frecuente de Java.
- Sobrescribí `toString()` en toda clase que vayas a guardar en un array: sin él, imprimir no informa nada.
- Buscar es siempre un recorrido lineal escrito a mano; devolvé `Optional` en vez de `null` cuando puedas.
- `Arrays.sort` sobre objetos exige un criterio: `Comparable` para el orden natural, `Comparator` para los demás.
- Asignar una casilla a otra **no copia el objeto**: quedan dos flechas al mismo lugar.
- Un array interno de una clase se copia al entrar y al salir, o el `private` no protege nada.
- Separar **capacidad** de **cantidad** es lo que convierte un array en una estructura de datos. Ese es el punto de partida del TAD Lista.
