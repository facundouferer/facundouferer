---
course: 'java'
slug: '13-java-collections-framework-y-genericos'
title: 'Colecciones en Java y Genéricos (JCF)'
description: 'Recorré el Java Collections Framework completo, entendé por qué existen los genéricos, aprendé cómo funciona un HashMap por dentro y adquirí el criterio para elegir la colección correcta.'
order: 15
lang: 'es'
published: true
---

# Colecciones en Java y Genéricos (JCF)

Durante dos lecciones implementaste listas, pilas y colas a mano. Ahora la buena noticia: **nada de eso hay que escribirlo en producción**. Java lo trae todo, optimizado durante treinta años y probado por millones de aplicaciones.

Pero fijate lo que ganaste: cuando alguien te diga "usá un `HashMap`", vas a saber que por dentro hay un arreglo y un mecanismo de colisiones. Cuando veas `LinkedList`, vas a saber por qué acceder al elemento 500 es lento. **Esa es la diferencia entre usar una herramienta y entenderla.**

---

## 1. La jerarquía del Java Collections Framework

<figure class="diagram">
<svg viewBox="0 0 720 355" role="img" aria-labelledby="d-jcf-t">
<title id="d-jcf-t">Jerarquía del Java Collections Framework con sus interfaces e implementaciones principales</title>
<rect x="193" y="6" width="150" height="34" rx="12" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="268" y="28" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">Iterable</text>
<line x1="268" y1="40" x2="268" y2="56" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<rect x="193" y="56" width="150" height="34" rx="12" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="268" y="78" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">Collection</text>
<line x1="268" y1="90" x2="268" y2="110" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="85" y1="110" x2="451" y2="110" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="85" y1="110" x2="85" y2="136" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="268" y1="110" x2="268" y2="136" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="451" y1="110" x2="451" y2="136" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<rect x="0" y="136" width="170" height="38" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="85" y="160" font-size="13.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">List</text>
<rect x="183" y="136" width="170" height="38" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="268" y="160" font-size="13.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Set</text>
<rect x="366" y="136" width="170" height="38" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="451" y="160" font-size="13.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Queue</text>
<rect x="549" y="136" width="170" height="38" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="634" y="160" font-size="13.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Map</text>
<text x="549" y="128" font-size="10.5" font-weight="700" fill="var(--color-accent-2-700)">NO extiende Collection</text>
<rect x="0" y="190" width="170" height="120" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="14" y="212" font-size="11.5" font-weight="700" fill="var(--color-text)">ArrayList</text>
<text x="14" y="228" font-size="11" fill="var(--color-neutral-700)">índice O(1) · el default</text>
<text x="14" y="252" font-size="11.5" font-weight="700" fill="var(--color-text)">LinkedList</text>
<text x="14" y="268" font-size="11" fill="var(--color-neutral-700)">extremos O(1)</text>
<text x="14" y="292" font-size="11" fill="var(--color-neutral-600)">admite duplicados</text>
<rect x="183" y="190" width="170" height="120" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="197" y="212" font-size="11.5" font-weight="700" fill="var(--color-text)">HashSet</text>
<text x="197" y="228" font-size="11" fill="var(--color-neutral-700)">sin orden · O(1)</text>
<text x="197" y="252" font-size="11.5" font-weight="700" fill="var(--color-text)">TreeSet</text>
<text x="197" y="268" font-size="11" fill="var(--color-neutral-700)">ordenado · O(log n)</text>
<text x="197" y="292" font-size="11" fill="var(--color-neutral-600)">sin duplicados</text>
<rect x="366" y="190" width="170" height="120" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="380" y="212" font-size="11.5" font-weight="700" fill="var(--color-text)">ArrayDeque</text>
<text x="380" y="228" font-size="11" fill="var(--color-neutral-700)">pila y cola · O(1)</text>
<text x="380" y="252" font-size="11.5" font-weight="700" fill="var(--color-text)">PriorityQueue</text>
<text x="380" y="268" font-size="11" fill="var(--color-neutral-700)">sale el menor primero</text>
<text x="380" y="292" font-size="11" fill="var(--color-neutral-600)">orden de procesamiento</text>
<rect x="549" y="190" width="170" height="120" rx="14" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="563" y="212" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">HashMap</text>
<text x="563" y="228" font-size="11" fill="var(--color-neutral-800)">sin orden · O(1)</text>
<text x="563" y="252" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">TreeMap</text>
<text x="563" y="268" font-size="11" fill="var(--color-neutral-800)">ordenado por clave</text>
<text x="563" y="292" font-size="11" fill="var(--color-neutral-700)">clave → valor</text>
<text x="0" y="332" font-size="12" fill="var(--color-neutral-700)">Todo lo que cuelga de Collection guarda elementos sueltos y se puede recorrer con for-each. Map guarda</text>
<text x="0" y="350" font-size="12" fill="var(--color-neutral-700)">asociaciones, así que su interfaz es distinta: por eso queda afuera de la jerarquía.</text>
</svg>
<figcaption>Las cajas de arriba son interfaces (el TAD); las de abajo, implementaciones. Programá siempre contra las de arriba.</figcaption>
</figure>

Esa última frase es una regla concreta, no un consejo:

```java
// Bien: el tipo de la variable es la interfaz
List<String> nombres = new ArrayList<>();
Map<String, Integer> stock = new HashMap<>();

// Mal: te atás a la implementación
ArrayList<String> nombres = new ArrayList<>();
```

Con la primera forma, cambiar a `LinkedList` es tocar **una palabra**. Con la segunda, si alguien usó un método propio de `ArrayList`, es tocar todo. Es exactamente el principio del TAD de la lección 12, aplicado a la biblioteca estándar.

---

## 2. Genéricos: el problema que vinieron a resolver

Antes de Java 5 las colecciones guardaban `Object`. Todo compilaba, y los errores aparecían cuando el programa ya estaba en producción.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-gen-t">
<title id="d-gen-t">Sin genéricos el error aparece en ejecución; con genéricos aparece en compilación</title>
<defs><marker id="ar-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker><marker id="ar-g2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<rect x="0" y="0" width="720" height="136" rx="20" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="20" y="28" font-size="13.5" font-weight="700" fill="var(--color-neutral-900)">Sin genéricos — la colección guarda Object</text>
<rect x="20" y="40" width="410" height="80" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="60" font-size="11.5" fill="var(--color-text)">List lista = new ArrayList();</text>
<text x="34" y="78" font-size="11.5" fill="var(--color-text)">lista.add("hola");</text>
<text x="34" y="96" font-size="11.5" fill="var(--color-text)">lista.add(42);</text>
<text x="230" y="96" font-size="11" fill="var(--color-neutral-600)">← compila perfecto</text>
<text x="34" y="114" font-size="11.5" fill="var(--color-text)">String s = (String) lista.get(1);</text>
<line x1="434" y1="80" x2="482" y2="80" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-g)"/>
<rect x="490" y="52" width="212" height="60" rx="14" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="596" y="76" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">ClassCastException</text>
<text x="596" y="96" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">en EJECUCIÓN, con usuarios</text>
<rect x="0" y="152" width="720" height="126" rx="20" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="20" y="180" font-size="13.5" font-weight="700" fill="var(--color-accent-2-700)">Con genéricos — la colección declara qué guarda</text>
<rect x="20" y="192" width="410" height="66" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="212" font-size="11.5" fill="var(--color-text)">List&lt;String&gt; lista = new ArrayList&lt;&gt;();</text>
<text x="34" y="230" font-size="11.5" fill="var(--color-text)">lista.add("hola");</text>
<text x="34" y="248" font-size="11.5" fill="var(--color-text)">lista.add(42);</text>
<text x="180" y="248" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">← ni siquiera compila</text>
<line x1="434" y1="222" x2="482" y2="222" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-g2)"/>
<rect x="490" y="194" width="212" height="60" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="596" y="218" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Error de compilación</text>
<text x="596" y="238" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">en tu IDE, antes de nada</text>
<text x="0" y="296" font-size="12" fill="var(--color-neutral-700)">Los genéricos no hacen el programa más rápido: adelantan el momento en que descubrís el error. Eso vale oro.</text>
</svg>
<figcaption>El casteo desaparece y el error se mueve de la madrugada de un domingo a los tres segundos después de escribir la línea.</figcaption>
</figure>

Con genéricos, además, el compilador ya sabe qué sale de la colección y **el casteo desaparece**:

```java
List<String> nombres = new ArrayList<>();
nombres.add("Laura");
String primero = nombres.get(0);   // sin casteo: el compilador sabe que es String
```

El `<>` vacío de la derecha se llama **diamante** y le dice al compilador "el mismo tipo que declaré a la izquierda". Escribir `new ArrayList<String>()` no está mal, es redundante.

---

## 3. Las cuatro familias, y cuándo usar cada una

### `List` — orden de inserción, duplicados permitidos

```java
List<String> tareas = new ArrayList<>();
tareas.add("Estudiar POO");
tareas.add("Practicar listas");
tareas.add("Estudiar POO");        // se repite, y está bien

System.out.println(tareas.get(1));      // acceso por índice
System.out.println(tareas.size());      // 3
```

### `Set` — sin duplicados, y el orden depende de la implementación

```java
Set<String> etiquetas = new HashSet<>();
etiquetas.add("java");
etiquetas.add("poo");
etiquetas.add("java");              // ignorado, ya estaba

System.out.println(etiquetas.size());   // 2
```

`HashSet` no garantiza ningún orden. `LinkedHashSet` conserva el orden de inserción. `TreeSet` mantiene los elementos ordenados y te da operaciones como `first()`, `last()` y `headSet()`.

**Cuidado**: para que un `HashSet` detecte duplicados de tus propias clases, esas clases tienen que implementar `equals()` y `hashCode()` correctamente. Sin eso, dos objetos idénticos entran los dos. Es el tema central de la próxima lección.

### `Map` — asociar una clave a un valor

Es la colección más usada de todas, y la que más se subutiliza:

```java
Map<String, Integer> stock = new HashMap<>();
stock.put("yerba", 12);
stock.put("café", 5);
stock.put("yerba", 20);            // sobrescribe: las claves son únicas

System.out.println(stock.get("yerba"));           // 20
System.out.println(stock.get("azúcar"));          // null — no está
System.out.println(stock.getOrDefault("azúcar", 0));  // 0 — mucho mejor

// Recorrer un Map:
for (Map.Entry<String, Integer> entrada : stock.entrySet()) {
    System.out.println(entrada.getKey() + " → " + entrada.getValue());
}
```

Los métodos modernos de `Map` eliminan casi todos los `if` que se solían escribir a mano:

```java
// En lugar de: if (!mapa.containsKey(k)) mapa.put(k, new ArrayList<>());
mapa.computeIfAbsent(clave, k -> new ArrayList<>()).add(valor);

// En lugar de: contador.put(p, contador.containsKey(p) ? contador.get(p) + 1 : 1);
contador.merge(palabra, 1, Integer::sum);

// En lugar de: if (mapa.get(k) == null) mapa.put(k, v);
mapa.putIfAbsent(clave, valor);
```

### `Queue` / `Deque` — orden de procesamiento

Ya los viste en la lección 13. `ArrayDeque` para pila y cola; `PriorityQueue` cuando el próximo a salir no es el que llegó primero, sino el de mayor prioridad.

---

## 4. Cómo funciona un `HashMap` por dentro

Esto explica de una vez por qué `get()` es O(1) y por qué `equals`/`hashCode` importan tanto.

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-hash-t">
<title id="d-hash-t">Recorrido interno de una búsqueda en un HashMap desde la clave hasta el bucket</title>
<defs><marker id="ar-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="30" width="170" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="85" y="54" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">clave "gato"</text>
<text x="85" y="72" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">lo que vos escribís</text>
<line x1="172" y1="56" x2="206" y2="56" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-h)"/>
<rect x="210" y="30" width="190" height="52" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="305" y="54" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">hashCode()</text>
<text x="305" y="72" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">devuelve 3181970</text>
<line x1="402" y1="56" x2="436" y2="56" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-h)"/>
<rect x="440" y="30" width="280" height="52" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="580" y="54" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">3181970 % 16 → bucket 2</text>
<text x="580" y="72" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">una cuenta: por eso es O(1)</text>
<rect x="0" y="112" width="190" height="38" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="16" y="136" font-size="11.5" fill="var(--color-neutral-600)">bucket 0 — vacío</text>
<rect x="0" y="156" width="190" height="38" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="16" y="180" font-size="11.5" fill="var(--color-neutral-600)">bucket 1 — vacío</text>
<rect x="0" y="200" width="190" height="38" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="16" y="224" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">bucket 2</text>
<rect x="0" y="244" width="190" height="38" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="16" y="268" font-size="11.5" fill="var(--color-neutral-600)">bucket 3 — vacío</text>
<line x1="192" y1="219" x2="234" y2="219" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-h)"/>
<text x="240" y="194" font-size="11" font-weight="700" fill="var(--color-accent-700)">colisión: dos claves distintas cayeron en el mismo bucket</text>
<rect x="240" y="200" width="210" height="38" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="345" y="224" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">"gato" → 4</text>
<line x1="452" y1="219" x2="486" y2="219" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-h)"/>
<rect x="490" y="200" width="210" height="38" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="595" y="224" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">"toga" → 9</text>
<text x="240" y="262" font-size="11.5" fill="var(--color-neutral-800)">Dentro del bucket, equals() compara la clave real y decide cuál de los dos es.</text>
<text x="0" y="302" font-size="12" fill="var(--color-neutral-800)">hashCode() elige el cajón; equals() elige el elemento dentro del cajón. Si hashCode está mal, la clave se busca</text>
<text x="0" y="320" font-size="12" fill="var(--color-neutral-800)">en el cajón equivocado y el HashMap responde "no está" aunque el objeto esté guardado.</text>
</svg>
<figcaption>Con hash bien distribuido casi no hay colisiones y <code>get()</code> es una cuenta. Con hash malo, todo cae en un bucket y el mapa degenera en una lista: O(n).</figcaption>
</figure>

Esa última frase del pie es el motivo por el que la próxima lección existe. Un `hashCode()` mal implementado no rompe la compilación ni lanza ninguna excepción: solo hace que tu `HashMap` sea cien veces más lento, o que directamente no encuentre lo que guardaste.

---

## 5. Escribir tus propios genéricos

No son solo para usar; también podés escribirlos. Una **clase genérica** declara sus parámetros de tipo entre `<>`:

```java
public class Caja<T> {
    private T contenido;

    public void guardar(T contenido) { this.contenido = contenido; }
    public T sacar() { return contenido; }
}

Caja<String> cajaTexto = new Caja<>();
cajaTexto.guardar("hola");
String s = cajaTexto.sacar();   // sin casteo
```

Un **método genérico** declara su propio parámetro de tipo antes del retorno:

```java
public static <T> T primero(List<T> lista) {
    if (lista.isEmpty()) throw new NoSuchElementException("Lista vacía");
    return lista.get(0);
}
```

Y podés **acotar** el tipo con `extends`, para poder usar métodos del tipo acotado:

```java
// T tiene que ser comparable, así podemos usar compareTo
public static <T extends Comparable<T>> T maximo(List<T> lista) {
    T mayor = lista.get(0);
    for (T elemento : lista) {
        if (elemento.compareTo(mayor) > 0) mayor = elemento;
    }
    return mayor;
}
```

Por convención los parámetros de tipo son una sola letra mayúscula: `T` (type), `E` (element), `K` y `V` (key, value), `R` (result).

### Type erasure: la letra chica

Los genéricos existen **solo en tiempo de compilación**. La JVM no sabe nada de ellos: en el bytecode, `List<String>` y `List<Integer>` son la misma cosa. Se llama *borrado de tipos*, y explica limitaciones que de otra forma parecen arbitrarias:

```java
List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass());   // true — son la misma clase

// T[] arreglo = new T[10];   // no se puede: en ejecución no se sabe qué es T
```

---

## 6. Cuál elegir

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-dec-t">
<title id="d-dec-t">Árbol de decisión para elegir la colección adecuada</title>
<defs><marker id="ar-d" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="190" y="6" width="340" height="44" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="34" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">¿Necesitás asociar una clave a un valor?</text>
<path d="M280 52 L170 52 L170 92" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-d)"/>
<text x="196" y="72" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">NO</text>
<path d="M440 52 L550 52 L550 92" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-d)"/>
<text x="500" y="72" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">SÍ</text>
<rect x="20" y="96" width="300" height="44" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="170" y="124" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">¿Se permiten elementos repetidos?</text>
<rect x="400" y="96" width="300" height="44" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="550" y="124" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">¿Las claves tienen que estar ordenadas?</text>
<path d="M110 142 L85 142 L85 182" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-d)"/>
<path d="M230 142 L265 142 L265 182" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-d)"/>
<path d="M490 142 L455 142 L455 182" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-d)"/>
<path d="M610 142 L635 142 L635 182" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-d)"/>
<rect x="0" y="186" width="170" height="62" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="85" y="208" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">SÍ, se repiten</text>
<text x="85" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">ArrayList</text>
<rect x="180" y="186" width="170" height="62" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="265" y="208" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">NO, son únicos</text>
<text x="265" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">HashSet</text>
<rect x="370" y="186" width="170" height="62" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="455" y="208" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">NO, da igual el orden</text>
<text x="455" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">HashMap</text>
<rect x="550" y="186" width="170" height="62" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="635" y="208" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">SÍ, ordenadas</text>
<text x="635" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">TreeMap</text>
<text x="0" y="278" font-size="12" fill="var(--color-neutral-700)">Si además necesitás conservar el orden de inserción, cambiá HashSet por LinkedHashSet y HashMap por</text>
<text x="0" y="296" font-size="12" fill="var(--color-neutral-700)">LinkedHashMap. Si trabajás con pilas o colas, ArrayDeque. Todo lo demás es un caso especial.</text>
</svg>
<figcaption>Cuatro preguntas cubren el 90 % de las decisiones. Cuando ninguna encaja, ahí sí conviene mirar el caso especial.</figcaption>
</figure>

| Necesito... | Uso |
| --- | --- |
| Orden de inserción y acceso por índice | `ArrayList` |
| Insertar y borrar mucho en los extremos | `ArrayDeque` |
| Elementos únicos, sin importar el orden | `HashSet` |
| Elementos únicos, siempre ordenados | `TreeSet` |
| Clave → valor, acceso rapidísimo | `HashMap` |
| Clave → valor, recorrido en orden de clave | `TreeMap` |
| Clave → valor, en orden de inserción | `LinkedHashMap` |
| Sacar siempre el de mayor prioridad | `PriorityQueue` |

---

## 7. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| Declarar `ArrayList<T> x = new ArrayList<>()` | Te atás a la implementación y cambiarla obliga a tocar todo el código que la usa. | Declarar con la interfaz: `List<T> x = new ArrayList<>()`. |
| Usar objetos propios en `HashSet`/`HashMap` sin `equals`/`hashCode` | Se guardan duplicados y `get()` devuelve `null` con la clave correcta. | Implementar ambos métodos de forma coherente (lección 15). |
| Modificar una colección mientras se la recorre con for-each | `ConcurrentModificationException`. | `Iterator.remove()` o `removeIf()` (lección 15). |
| `mapa.get(k)` sin contemplar `null` | `NullPointerException` al desempaquetar un `Integer` que vino en `null`. | `getOrDefault(k, valorPorDefecto)`. |
| Usar `LinkedList` "porque insertar es más rápido" | En la práctica es más lenta que `ArrayList` por los fallos de caché. | `ArrayList` salvo que midas y demuestres lo contrario. |
| Usar clave mutable en un `HashMap` | Si el objeto cambia, su `hashCode` cambia y queda perdido en el bucket viejo. | Claves inmutables: `String`, `Integer`, o clases con campos `final`. |
| Intentar modificar una lista de `List.of(...)` | `UnsupportedOperationException`: es inmutable. | `new ArrayList<>(List.of(...))` si necesitás modificarla. |

---

## 8. Ejercicio práctico guiado

### Desafío: contador de frecuencias de palabras

Escribí un programa que reciba un texto y muestre cuántas veces aparece cada palabra.

1. Normalizá el texto: todo a minúsculas, sin signos de puntuación.
2. Contá las frecuencias con un `Map<String, Integer>`.
3. Mostrá el resultado **ordenado por frecuencia descendente** y, a igual frecuencia, alfabéticamente.
4. Mostrá también cuántas palabras distintas hay, usando un `Set`.
5. Ignorá palabras vacías de significado (`de`, `la`, `el`, `y`, `que`...).

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.*;

public class ContadorDePalabras {

    private static final Set<String> VACIAS = Set.of(
        "de", "la", "el", "y", "que", "en", "a", "los", "las", "un", "una", "es"
    );

    public static Map<String, Integer> contar(String texto) {
        Map<String, Integer> frecuencias = new HashMap<>();

        // \\p{L}+ toma secuencias de letras, incluidas las acentuadas
        for (String palabra : texto.toLowerCase().split("[^\\p{L}]+")) {
            if (palabra.isBlank() || VACIAS.contains(palabra)) {
                continue;
            }
            // merge: si no está, guarda 1; si está, aplica Integer::sum
            frecuencias.merge(palabra, 1, Integer::sum);
        }
        return frecuencias;
    }

    public static void main(String[] args) {
        String texto = """
            La programación orientada a objetos organiza el software en objetos.
            Cada objeto combina estado y comportamiento, y el estado de un objeto
            se protege con encapsulamiento. La herencia y el polimorfismo permiten
            que el software crezca sin reescribir el software existente.
            """;

        Map<String, Integer> frecuencias = contar(texto);

        // Un Set nos da las palabras distintas sin escribir una sola línea de lógica
        Set<String> distintas = frecuencias.keySet();
        System.out.println("Palabras distintas (sin contar vacías): " + distintas.size());
        System.out.println("Total de apariciones: " +
            frecuencias.values().stream().mapToInt(Integer::intValue).sum());
        System.out.println();

        // Ordenamos: primero por frecuencia descendente, después alfabéticamente
        List<Map.Entry<String, Integer>> ordenadas = new ArrayList<>(frecuencias.entrySet());
        ordenadas.sort(
            Map.Entry.<String, Integer>comparingByValue().reversed()
                .thenComparing(Map.Entry.comparingByKey())
        );

        System.out.println("Top 8:");
        for (Map.Entry<String, Integer> e : ordenadas.subList(0, Math.min(8, ordenadas.size()))) {
            System.out.printf("  %-16s %s%n", e.getKey(), "▮".repeat(e.getValue()) + " " + e.getValue());
        }

        // Bonus: agrupar palabras por su longitud, con computeIfAbsent
        Map<Integer, List<String>> porLongitud = new TreeMap<>();
        for (String palabra : distintas) {
            porLongitud.computeIfAbsent(palabra.length(), k -> new ArrayList<>()).add(palabra);
        }
        System.out.println("\nPalabras de 10 letras: " + porLongitud.getOrDefault(10, List.of()));
    }
}
```

**Tres cosas para mirar acá.**

`frecuencias.merge(palabra, 1, Integer::sum)` reemplaza al clásico `if (mapa.containsKey(p)) mapa.put(p, mapa.get(p) + 1); else mapa.put(p, 1);`. Una línea en lugar de cuatro, y sin posibilidad de equivocarse en el caso de la primera aparición.

`porLongitud.computeIfAbsent(len, k -> new ArrayList<>()).add(palabra)` es el patrón para armar un mapa de listas. Sin él tendrías que chequear si la lista existe antes de agregar, en cada iteración.

Y `VACIAS` es un `Set`, no una `List`, porque lo único que hacemos con él es preguntar `contains`. En un `Set` eso es O(1); en una `List` sería O(n) y se ejecuta una vez por palabra del texto. **Elegir la colección correcta es una decisión de rendimiento, no de estilo.**

</details>

---

## Para llevarte

- El JCF separa **interfaces** (el TAD) de **implementaciones**. Declará siempre con la interfaz.
- `Map` **no** extiende `Collection`: guarda asociaciones, no elementos sueltos.
- Los genéricos no aceleran nada: **adelantan el error** de la producción al momento de escribir la línea.
- El **borrado de tipos** hace que los genéricos no existan en ejecución. De ahí vienen sus limitaciones.
- En un `HashMap`, `hashCode()` elige el bucket y `equals()` elige el elemento dentro del bucket.
- Un `hashCode()` mal hecho no lanza ninguna excepción: solo hace que no encuentres lo que guardaste.
- `merge`, `computeIfAbsent`, `getOrDefault` y `putIfAbsent` eliminan la mayoría de los `if` alrededor de un mapa.
- Elegir la colección correcta **es una decisión de rendimiento**: `contains` sobre un `Set` es O(1); sobre una `List`, O(n).
</content>
