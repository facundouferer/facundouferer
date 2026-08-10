---
course: 'java'
slug: '14-iteradores-ordenamiento-equals-hashcode'
title: 'Iteradores, Ordenamiento y Contrato equals/hashCode'
description: 'Entendé qué hay detrás del for-each, por qué salta ConcurrentModificationException, cómo ordenar con Comparable y Comparator, y por qué romper el contrato equals/hashCode hace que tus objetos desaparezcan.'
order: 15
lang: 'es'
published: true
---

# Iteradores, Ordenamiento y Contrato equals/hashCode

En la lección anterior quedaron tres deudas: por qué un `HashSet` a veces guarda duplicados, cómo se ordena una colección de objetos propios, y qué es esa `ConcurrentModificationException` que aparece al borrar mientras recorrés.

Las tres tienen la misma raíz: **las colecciones de Java hacen preguntas sobre tus objetos, y si tus objetos contestan mal, todo falla en silencio.**

---

## 1. Qué hay realmente detrás de un `for-each`

Este bucle que venís usando desde la lección 4:

```java
for (String nombre : nombres) {
    System.out.println(nombre);
}
```

El compilador lo traduce a esto:

```java
Iterator<String> it = nombres.iterator();
while (it.hasNext()) {
    String nombre = it.next();
    System.out.println(nombre);
}
```

Un **`Iterator`** es un objeto con solo tres métodos: `hasNext()`, `next()` y `remove()`. Y una colección es recorrible con for-each únicamente si implementa `Iterable`, que exige exactamente un método: `iterator()`.

Por eso podés recorrer un `ArrayList`, un `HashSet` y un `ArrayDeque` con la misma sintaxis aunque por dentro no se parezcan en nada. **El for-each no habla con la colección: habla con su iterador.**

---

## 2. `ConcurrentModificationException`: por qué pasa

Este código parece razonable y falla siempre:

```java
List<String> tareas = new ArrayList<>(List.of("estudiar", "descansar", "practicar"));

for (String t : tareas) {
    if (t.startsWith("d")) {
        tareas.remove(t);      // ← ConcurrentModificationException
    }
}
```

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-cme-t">
<title id="d-cme-t">Por qué modificar una colección durante un for-each lanza ConcurrentModificationException</title>
<rect x="0" y="0" width="720" height="182" rx="20" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="20" y="28" font-size="13.5" font-weight="700" fill="var(--color-neutral-900)">Modificar la colección durante el for-each</text>
<rect x="20" y="40" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="60" font-size="11.5" fill="var(--color-text)">1. El for-each crea un Iterator, que memoriza el modCount actual de la lista: 0</text>
<rect x="20" y="76" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="96" font-size="11.5" fill="var(--color-text)">2. tareas.remove("descansar") modifica la lista por fuera: su modCount pasa a 1</text>
<rect x="20" y="112" width="680" height="30" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="132" font-size="11.5" fill="var(--color-text)">3. En la vuelta siguiente, next() compara el modCount memorizado (0) con el actual (1)</text>
<rect x="20" y="148" width="680" height="30" rx="10" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<text x="34" y="168" font-size="11.5" font-weight="700" fill="var(--color-neutral-900)">4. No coinciden → ConcurrentModificationException. El iterador se declara desactualizado.</text>
<rect x="0" y="198" width="720" height="126" rx="20" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="20" y="226" font-size="13.5" font-weight="700" fill="var(--color-accent-2-700)">Las dos formas correctas de borrar mientras recorrés</text>
<rect x="20" y="238" width="680" height="34" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="259" font-size="11.5" fill="var(--color-text)">it.remove()  →  borra a través del propio iterador, que sincroniza su modCount y sigue válido</text>
<rect x="20" y="278" width="680" height="34" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="299" font-size="11.5" fill="var(--color-text)">lista.removeIf(t -&gt; t.startsWith("d"))  →  una línea, sin iterador explícito. La forma moderna.</text>
</svg>
<figcaption>La excepción no protege la colección: te protege a vos de recorrer una estructura que cambió debajo de tus pies y de saltearte elementos sin darte cuenta.</figcaption>
</figure>

```java
// Opción 1: el iterador explícito
Iterator<String> it = tareas.iterator();
while (it.hasNext()) {
    if (it.next().startsWith("d")) {
        it.remove();          // el iterador borra Y se mantiene consistente
    }
}

// Opción 2: removeIf — desde Java 8, y es la que vas a usar el 95 % de las veces
tareas.removeIf(t -> t.startsWith("d"));
```

> El nombre de la excepción confunde: **no tiene nada que ver con hilos ni con concurrencia**. Pasa igual en un programa de un solo hilo. Se llama así porque la colección fue modificada "concurrentemente" respecto del recorrido en curso.

---

## 3. `Comparable`: el orden natural de una clase

Si intentás ordenar una lista de objetos propios, Java te frena:

```java
List<Libro> libros = new ArrayList<>();
Collections.sort(libros);   // ERROR: Libro no es Comparable
```

Y tiene razón: **¿ordenar por qué?** ¿Título, autor, páginas, año? Java no puede adivinarlo. Se lo tenés que decir.

`Comparable` define el **orden natural**: el orden por defecto, el que tiene sentido cuando nadie pide otra cosa.

```java
public class Libro implements Comparable<Libro> {
    private final String titulo;
    private final String autor;
    private final int paginas;

    @Override
    public int compareTo(Libro otro) {
        return this.titulo.compareTo(otro.titulo);   // orden natural: por título
    }
}
```

<figure class="diagram">
<svg viewBox="0 0 720 240" role="img" aria-labelledby="d-cmp-t">
<title id="d-cmp-t">Los tres valores de retorno de compareTo y su significado para el ordenamiento</title>
<text x="0" y="22" font-size="13" font-weight="700" fill="var(--color-accent-700)">Qué significa lo que devuelve a.compareTo(b)</text>
<rect x="0" y="36" width="226" height="98" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="113" y="64" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">negativo</text>
<text x="113" y="88" font-size="12" text-anchor="middle" fill="var(--color-text)">a va ANTES que b</text>
<text x="113" y="110" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">a es "menor"</text>
<rect x="247" y="36" width="226" height="98" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="360" y="64" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">cero</text>
<text x="360" y="88" font-size="12" text-anchor="middle" fill="var(--color-text)">son equivalentes</text>
<text x="360" y="110" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">para este orden</text>
<rect x="494" y="36" width="226" height="98" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="607" y="64" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">positivo</text>
<text x="607" y="88" font-size="12" text-anchor="middle" fill="var(--color-text)">a va DESPUÉS que b</text>
<text x="607" y="110" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">a es "mayor"</text>
<rect x="0" y="152" width="720" height="76" rx="16" fill="var(--color-neutral-100)" stroke="var(--color-neutral-500)" stroke-dasharray="5 4"/>
<text x="20" y="176" font-size="12.5" font-weight="700" fill="var(--color-neutral-900)">La trampa clásica: return this.edad - otro.edad;</text>
<text x="20" y="198" font-size="11.5" fill="var(--color-neutral-800)">Con valores grandes esa resta desborda el int y devuelve un signo equivocado: la lista sale mal ordenada</text>
<text x="20" y="216" font-size="11.5" fill="var(--color-neutral-800)">y no hay ninguna excepción que te avise. Usá siempre Integer.compare(this.edad, otro.edad).</text>
</svg>
<figcaption>El valor exacto no importa, solo el signo. Por eso devolver la resta parece funcionar — hasta el día en que los números son grandes.</figcaption>
</figure>

Con `Comparable` implementado, todo el ecosistema de Java funciona solo: `Collections.sort()`, `lista.sort(null)`, `TreeSet`, `TreeMap` y `Arrays.sort()`.

---

## 4. `Comparator`: todos los otros órdenes

El problema de `Comparable` es que **solo podés tener uno**. ¿Y si a veces querés ordenar por páginas y otras por autor?

Para eso está `Comparator`: un orden que vive **fuera** de la clase.

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-cor-t">
<title id="d-cor-t">Comparable define un único orden interno; Comparator permite muchos órdenes externos</title>
<defs><marker id="ar-co" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="0" width="720" height="120" rx="20" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="20" y="28" font-size="13.5" font-weight="700" fill="var(--color-accent-2-700)">Comparable — el orden natural, escrito DENTRO de la clase</text>
<rect x="20" y="40" width="400" height="62" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="62" font-size="11.5" font-weight="700" fill="var(--color-text)">class Libro implements Comparable&lt;Libro&gt;</text>
<text x="34" y="84" font-size="11.5" fill="var(--color-text)">public int compareTo(Libro otro) { ... }</text>
<text x="440" y="60" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">Solo puede haber UNO por clase.</text>
<text x="440" y="80" font-size="11.5" fill="var(--color-neutral-800)">Lo usan Collections.sort(lista),</text>
<text x="440" y="98" font-size="11.5" fill="var(--color-neutral-800)">TreeSet y TreeMap por defecto.</text>
<rect x="0" y="136" width="720" height="164" rx="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="164" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Comparator — órdenes externos, tantos como necesites</text>
<rect x="20" y="180" width="180" height="100" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="110" y="222" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Libro</text>
<text x="110" y="244" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">sin tocar la clase</text>
<path d="M202 206 L232 206" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-co)"/>
<path d="M202 230 L232 230" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-co)"/>
<path d="M202 254 L232 254" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-co)"/>
<rect x="240" y="182" width="460" height="32" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="254" y="203" font-size="11.5" fill="var(--color-text)">Comparator.comparing(Libro::getTitulo)</text>
<rect x="240" y="220" width="460" height="32" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="254" y="241" font-size="11.5" fill="var(--color-text)">Comparator.comparingInt(Libro::getPaginas).reversed()</text>
<rect x="240" y="258" width="460" height="32" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="254" y="279" font-size="11.5" fill="var(--color-text)">comparing(Libro::getAutor).thenComparing(Libro::getTitulo)</text>
<text x="0" y="320" font-size="12" fill="var(--color-neutral-700)">Comparator sirve incluso para clases que no escribiste vos y no podés modificar. Comparable, no.</text>
</svg>
<figcaption>El orden natural es una propiedad de la clase; un comparador es una decisión de quien ordena. Por eso pueden coexistir muchos.</figcaption>
</figure>

```java
// Ordenar por páginas, de menor a mayor
libros.sort(Comparator.comparingInt(Libro::getPaginas));

// De mayor a menor
libros.sort(Comparator.comparingInt(Libro::getPaginas).reversed());

// Por autor y, a igual autor, por título
libros.sort(
    Comparator.comparing(Libro::getAutor)
              .thenComparing(Libro::getTitulo)
);

// Con nulos al final, sin que reviente
libros.sort(Comparator.comparing(Libro::getAutor,
            Comparator.nullsLast(Comparator.naturalOrder())));
```

Fijate que `sort` ordena **la lista original en el lugar**. Si necesitás conservar el orden original, copiá primero: `new ArrayList<>(libros).sort(...)`.

---

## 5. El contrato `equals`: cinco reglas

Por defecto, `Object.equals()` compara **referencias**: devuelve `true` solo si son literalmente el mismo objeto en el Heap. Para casi cualquier clase de dominio, eso está mal:

```java
Libro a = new Libro("1984", "Orwell", 328);
Libro b = new Libro("1984", "Orwell", 328);

System.out.println(a == b);        // false — son dos objetos distintos, obvio
System.out.println(a.equals(b));   // false — pero ESTO debería ser true
```

Sobrescribir `equals` significa firmar un contrato de cinco cláusulas:

| Regla | Qué significa |
| --- | --- |
| **Reflexiva** | `a.equals(a)` siempre es `true`. |
| **Simétrica** | Si `a.equals(b)`, entonces `b.equals(a)`. |
| **Transitiva** | Si `a.equals(b)` y `b.equals(c)`, entonces `a.equals(c)`. |
| **Consistente** | Llamarlo diez veces devuelve lo mismo, si nada cambió. |
| **Contra `null`** | `a.equals(null)` es `false`, nunca lanza excepción. |

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;                    // atajo: mismo objeto
    if (o == null || getClass() != o.getClass()) return false;
    Libro otro = (Libro) o;
    return paginas == otro.paginas
        && Objects.equals(titulo, otro.titulo)     // tolera null en ambos lados
        && Objects.equals(autor, otro.autor);
}
```

> El parámetro es `Object o`, **no** `Libro o`. Si escribís `public boolean equals(Libro o)` estás **sobrecargando**, no sobrescribiendo, y las colecciones —que llaman a `equals(Object)`— van a seguir usando la versión heredada. Es exactamente el error que `@Override` detecta, tal cual lo vimos en la lección 9.

---

## 6. `hashCode`: el que rompe todo cuando falta

Acá está el problema real. `equals` solo no alcanza:

<figure class="diagram">
<svg viewBox="0 0 720 320" role="img" aria-labelledby="d-hc-t">
<title id="d-hc-t">Qué pasa cuando dos objetos son equals pero tienen hashCode distinto</title>
<defs><marker id="ar-hc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker></defs>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">equals() bien, hashCode() sin sobrescribir</text>
<rect x="0" y="32" width="290" height="76" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="145" y="58" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">libro1 = new Libro("1984")</text>
<text x="145" y="80" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-700)">hashCode() heredado de Object</text>
<text x="145" y="98" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">= 366712642</text>
<rect x="430" y="32" width="290" height="76" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="575" y="58" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">libro2 = new Libro("1984")</text>
<text x="575" y="80" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-700)">hashCode() heredado de Object</text>
<text x="575" y="98" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">= 1829164700</text>
<line x1="292" y1="70" x2="428" y2="70" stroke="var(--color-accent-2-700)" stroke-width="2"/>
<text x="360" y="62" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">equals() → true</text>
<line x1="145" y1="112" x2="145" y2="146" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-hc)"/>
<line x1="575" y1="112" x2="575" y2="146" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-hc)"/>
<rect x="50" y="150" width="190" height="46" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="145" y="178" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">bucket 2</text>
<rect x="480" y="150" width="190" height="46" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="575" y="178" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">bucket 11</text>
<text x="360" y="178" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">cajones distintos</text>
<rect x="0" y="212" width="720" height="56" rx="16" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<text x="20" y="236" font-size="12.5" font-weight="700" fill="var(--color-neutral-900)">set.add(libro1); set.add(libro2);   →   set.size() == 2</text>
<text x="20" y="256" font-size="11.5" fill="var(--color-neutral-800)">El Set nunca los comparó: como cayeron en cajones distintos, equals() jamás llegó a ejecutarse.</text>
<text x="0" y="292" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">LA REGLA: si a.equals(b) es true, entonces a.hashCode() == b.hashCode() TIENE que ser true.</text>
<text x="0" y="312" font-size="12" fill="var(--color-neutral-700)">Al revés no hace falta: dos objetos distintos pueden compartir hashCode. Eso es una colisión, y es normal.</text>
</svg>
<figcaption>El <code>HashSet</code> no recorre todo comparando: primero calcula el cajón. Si el cajón está mal, la comparación nunca ocurre.</figcaption>
</figure>

Por eso la regla es absoluta: **si sobrescribís `equals`, sobrescribí `hashCode`.** No es opcional ni una buena práctica: es una condición para que las colecciones funcionen.

```java
@Override
public int hashCode() {
    return Objects.hash(titulo, autor, paginas);   // los MISMOS campos que equals
}
```

`Objects.hash(...)` combina los valores con una fórmula ya probada. **Usá exactamente los mismos campos en `equals` y en `hashCode`**: si `equals` compara tres campos y `hashCode` usa dos, el contrato sigue cumpliéndose; si usa uno que `equals` ignora, se rompe.

### El atajo: `record`

Si tu clase es un simple portador de datos, un `record` genera `equals`, `hashCode` y `toString` correctos automáticamente:

```java
public record Libro(String titulo, String autor, int paginas) implements Comparable<Libro> {
    @Override
    public int compareTo(Libro otro) {
        return this.titulo.compareTo(otro.titulo);
    }
}
```

Tres líneas y el contrato está garantizado por el compilador. Es la razón por la que los `record` de la lección 8 aparecen tanto en código moderno.

---

## 7. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| Sobrescribir `equals` y no `hashCode` | Los `HashSet` guardan duplicados y `HashMap.get()` devuelve `null` con la clave correcta. | Sobrescribir siempre los dos, con los mismos campos. |
| Escribir `equals(Libro o)` en vez de `equals(Object o)` | Es una sobrecarga, no una sobrescritura. Las colecciones siguen usando la comparación por referencia. | Firma `equals(Object o)` y anotar con `@Override`. |
| `compareTo` devolviendo `a - b` | Con valores grandes el `int` desborda y el orden sale invertido, sin ninguna excepción. | `Integer.compare(a, b)`. |
| Usar `==` para comparar `String` | Compara referencias; funciona con literales por el pool de strings y falla con strings construidos. | `.equals()`, o `Objects.equals()` si puede haber `null`. |
| Modificar un objeto ya guardado en un `HashSet` | Cambia su `hashCode`, queda en el cajón viejo y `contains()` devuelve `false` sobre un objeto que está adentro. | Claves y elementos de `Set` inmutables. |
| Borrar con `lista.remove(x)` dentro de un for-each | `ConcurrentModificationException`. | `removeIf(...)` o `iterator.remove()`. |
| `compareTo` inconsistente con `equals` | Un `TreeSet` descarta elementos que `equals` considera distintos, porque para él `compareTo == 0` significa duplicado. | Que `compareTo` devuelva `0` exactamente cuando `equals` sea `true`. |

---

## 8. Ejercicio práctico guiado

### Desafío: la clase `Libro`

1. Creá `Libro` con `titulo`, `autor` y `paginas`, todos inmutables.
2. Implementá `equals` y `hashCode` usando los tres campos.
3. Implementá `Comparable<Libro>` con orden natural por título.
4. Demostrá que un `HashSet` descarta el duplicado.
5. Ordená una lista por el orden natural y después con tres `Comparator` distintos.
6. Mostrá qué pasa con un `TreeSet` cuyo `compareTo` solo mira el título.

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.*;

public final class Libro implements Comparable<Libro> {
    private final String titulo;
    private final String autor;
    private final int paginas;

    public Libro(String titulo, String autor, int paginas) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("El título es obligatorio");
        }
        if (paginas <= 0) {
            throw new IllegalArgumentException("Las páginas deben ser positivas");
        }
        this.titulo = titulo;
        this.autor = autor;
        this.paginas = paginas;
    }

    public String getTitulo() { return titulo; }
    public String getAutor() { return autor; }
    public int getPaginas() { return paginas; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Libro otro = (Libro) o;
        return paginas == otro.paginas
            && Objects.equals(titulo, otro.titulo)
            && Objects.equals(autor, otro.autor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(titulo, autor, paginas);   // los mismos tres campos
    }

    @Override
    public int compareTo(Libro otro) {
        return this.titulo.compareTo(otro.titulo);     // orden natural: por título
    }

    @Override
    public String toString() {
        return String.format("%-28s %-18s %4d p.", titulo, autor, paginas);
    }

    public static void main(String[] args) {
        Libro a = new Libro("1984", "Orwell", 328);
        Libro b = new Libro("1984", "Orwell", 328);   // idéntico a 'a'

        System.out.println("a == b        → " + (a == b));        // false
        System.out.println("a.equals(b)   → " + a.equals(b));     // true
        System.out.println("mismo hash    → " + (a.hashCode() == b.hashCode()));  // true

        // 4. El HashSet descarta el duplicado gracias al par equals/hashCode
        Set<Libro> sinDuplicados = new HashSet<>(List.of(a, b));
        System.out.println("\nHashSet size  → " + sinDuplicados.size());   // 1

        List<Libro> libros = new ArrayList<>(List.of(
            new Libro("Rayuela",       "Cortázar", 736),
            new Libro("El Aleph",      "Borges",   146),
            new Libro("1984",          "Orwell",   328),
            new Libro("Ficciones",     "Borges",   174)
        ));

        // 5a. Orden natural: usa compareTo
        Collections.sort(libros);
        System.out.println("\nPor título (orden natural):");
        libros.forEach(l -> System.out.println("  " + l));

        // 5b. Por páginas, descendente
        libros.sort(Comparator.comparingInt(Libro::getPaginas).reversed());
        System.out.println("\nPor páginas (descendente):");
        libros.forEach(l -> System.out.println("  " + l));

        // 5c. Por autor y, a igual autor, por título
        libros.sort(Comparator.comparing(Libro::getAutor)
                              .thenComparing(Libro::getTitulo));
        System.out.println("\nPor autor, después por título:");
        libros.forEach(l -> System.out.println("  " + l));

        // 6. La trampa del TreeSet
        Set<Libro> arbol = new TreeSet<>(libros);
        System.out.println("\nLibros en la lista: " + libros.size());
        System.out.println("Libros en el TreeSet: " + arbol.size());
        System.out.println("(iguales, porque no hay dos títulos repetidos)");

        Libro otroConMismoTitulo = new Libro("1984", "Otro Autor", 500);
        arbol.add(otroConMismoTitulo);
        System.out.println("\nDespués de agregar otro libro titulado \"1984\": " + arbol.size());
        System.out.println("El TreeSet lo RECHAZÓ: para él, compareTo == 0 significa duplicado,");
        System.out.println("aunque equals() diga que son libros distintos.");
    }
}
```

**Lo más importante de este ejercicio es el punto 6.**

`equals` compara título, autor y páginas. `compareTo` solo mira el título. Son **inconsistentes**, y eso no molesta a nadie hasta que el objeto entra en un `TreeSet` o un `TreeMap`: esas estructuras **ignoran `equals` por completo** y deciden duplicados con `compareTo == 0`.

Resultado: un libro que `equals` considera distinto desaparece del conjunto sin error, sin excepción y sin aviso.

La solución cuando el orden natural tiene que ser consistente:

```java
@Override
public int compareTo(Libro otro) {
    int porTitulo = this.titulo.compareTo(otro.titulo);
    if (porTitulo != 0) return porTitulo;
    int porAutor = Objects.compare(this.autor, otro.autor,
                                   Comparator.nullsFirst(Comparator.naturalOrder()));
    if (porAutor != 0) return porAutor;
    return Integer.compare(this.paginas, otro.paginas);   // nunca la resta
}
```

Ahora `compareTo` devuelve `0` exactamente cuando `equals` devuelve `true`, y las dos familias de colecciones coinciden.

</details>

---

## Para llevarte

- El `for-each` no habla con la colección: usa su **`Iterator`** por detrás.
- `ConcurrentModificationException` no tiene nada que ver con hilos: es el iterador detectando que la colección cambió por fuera.
- Para borrar mientras recorrés: **`removeIf(...)`**, o `iterator.remove()`.
- `Comparable` = un orden natural, adentro de la clase. `Comparator` = muchos órdenes, afuera y para clases que no controlás.
- En `compareTo` importa **solo el signo**, y nunca uses `a - b`: usá `Integer.compare(a, b)`.
- Si sobrescribís `equals`, **sobrescribí `hashCode`**. Con los mismos campos. Sin excepciones.
- La firma correcta es `equals(Object o)`. Con `Libro o` estás sobrecargando y las colecciones no lo usan.
- `TreeSet` y `TreeMap` ignoran `equals` y deciden duplicados con `compareTo == 0`. Mantenelos consistentes.
- Un `record` genera `equals` y `hashCode` correctos gratis.
</content>
