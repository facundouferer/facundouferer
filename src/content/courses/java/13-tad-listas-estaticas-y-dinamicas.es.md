---
course: 'java'
slug: '11-tad-listas-estaticas-y-dinamicas'
title: 'TAD Lista: Estáticas, Dinámicas y Enlazadas'
description: 'Comprendé qué es un Tipo Abstracto de Dato, por qué un arreglo y una lista enlazada resuelven lo mismo con costos opuestos, e implementá listas simples, dobles y circulares desde cero.'
order: 13
lang: 'es'
published: true
---

# TAD Lista: Estáticas, Dinámicas y Enlazadas

Desde acá el curso cambia de tema. Ya sabés modelar objetos y, en la lección 9, ya guardaste muchos en un array con su contador de cantidad. Ahora vas a formalizar esa idea y —esto es lo importante— a elegir la organización correcta según lo que vayas a hacer con los datos.

Empecemos con una pregunta que parece tonta: si ya existe `ArrayList`, ¿para qué implementar una lista a mano?

Porque `ArrayList` es rapidísimo para algunas cosas y desastroso para otras, y si no sabés **por qué**, vas a elegir mal. Implementarla una vez es lo que te enseña esa diferencia para siempre.

---

## 1. Qué es un TAD

Un **Tipo Abstracto de Dato** es la separación entre dos cosas que solemos mezclar:

- **La especificación**: qué operaciones ofrece y qué garantiza cada una. El *qué*.
- **La implementación**: cómo se guardan los datos en memoria y cómo se ejecuta cada operación. El *cómo*.

<figure class="diagram">
<svg viewBox="0 0 720 310" role="img" aria-labelledby="d-tad-t">
<title id="d-tad-t">Un mismo TAD Lista resuelto por tres implementaciones distintas</title>
<defs><marker id="ar-tad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="110" y="6" width="500" height="104" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="32" font-size="14.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">TAD Lista — la especificación (el QUÉ)</text>
<text x="360" y="56" font-size="12" text-anchor="middle" fill="var(--color-text)">agregar(dato) · eliminar(dato) · obtener(indice)</text>
<text x="360" y="76" font-size="12" text-anchor="middle" fill="var(--color-text)">tamaño() · estaVacia() · contiene(dato)</text>
<text x="360" y="98" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">No dice absolutamente nada sobre cómo se guardan los datos.</text>
<path d="M360 110 L360 140" fill="none" stroke="var(--color-accent)" stroke-width="1.8"/>
<line x1="112" y1="140" x2="608" y2="140" stroke="var(--color-accent)" stroke-width="1.8"/>
<path d="M112 140 L112 166" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-tad)"/>
<path d="M360 140 L360 166" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-tad)"/>
<path d="M608 140 L608 166" fill="none" stroke="var(--color-accent)" stroke-width="1.8" marker-end="url(#ar-tad)"/>
<rect x="0" y="172" width="225" height="96" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="18" y="196" font-size="13" font-weight="700" fill="var(--color-text)">Arreglo fijo</text>
<text x="18" y="218" font-size="11.5" fill="var(--color-neutral-700)">obtener(i) es instantáneo</text>
<text x="18" y="238" font-size="11.5" fill="var(--color-neutral-700)">pero no puede crecer</text>
<text x="18" y="258" font-size="11.5" fill="var(--color-neutral-700)">nunca</text>
<rect x="247" y="172" width="225" height="96" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="265" y="196" font-size="13" font-weight="700" fill="var(--color-accent-2-800)">ArrayList</text>
<text x="265" y="218" font-size="11.5" fill="var(--color-neutral-800)">arreglo que se recrea</text>
<text x="265" y="238" font-size="11.5" fill="var(--color-neutral-800)">más grande al llenarse</text>
<text x="265" y="258" font-size="11.5" fill="var(--color-neutral-800)">el de uso general</text>
<rect x="495" y="172" width="225" height="96" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="513" y="196" font-size="13" font-weight="700" fill="var(--color-text)">Lista enlazada</text>
<text x="513" y="218" font-size="11.5" fill="var(--color-neutral-700)">nodos sueltos unidos</text>
<text x="513" y="238" font-size="11.5" fill="var(--color-neutral-700)">por referencias; insertar</text>
<text x="513" y="258" font-size="11.5" fill="var(--color-neutral-700)">al inicio es instantáneo</text>
<text x="0" y="296" font-size="12" fill="var(--color-neutral-700)">El código que usa la lista habla con la especificación. Cambiar de implementación no lo obliga a cambiar ni una línea.</text>
</svg>
<figcaption>El TAD es el contrato; las tres cajas de abajo son formas distintas de cumplirlo, con costos completamente diferentes.</figcaption>
</figure>

En Java el TAD se escribe como una **interfaz** —justo lo que viste en la lección 10—:

```java
public interface Lista<T> {
    void agregar(T dato);
    boolean eliminar(T dato);
    T obtener(int indice);
    int tamanio();
    boolean estaVacia();
}
```

Quien programa contra `Lista<T>` no sabe ni le importa si adentro hay un arreglo o una cadena de nodos. Esa ignorancia es exactamente el objetivo.

---

## 2. Dos formas de guardar lo mismo, con costos opuestos

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-mem-t">
<title id="d-mem-t">Memoria contigua de un arreglo frente a los nodos dispersos de una lista enlazada</title>
<defs><marker id="ar-mem" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="0" y="22" font-size="13.5" font-weight="700" fill="var(--color-accent-2-700)">Lista estática — un arreglo: memoria contigua, tamaño fijo</text>
<rect x="0" y="34" width="112" height="50" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="56" y="65" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">10</text>
<rect x="116" y="34" width="112" height="50" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="172" y="65" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">20</text>
<rect x="232" y="34" width="112" height="50" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="288" y="65" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">30</text>
<rect x="348" y="34" width="112" height="50" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="404" y="65" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">40</text>
<rect x="464" y="34" width="112" height="50" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<text x="520" y="65" font-size="12" text-anchor="middle" fill="var(--color-neutral-600)">libre</text>
<rect x="580" y="34" width="112" height="50" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<text x="636" y="65" font-size="12" text-anchor="middle" fill="var(--color-neutral-600)">libre</text>
<text x="56" y="102" font-size="11" text-anchor="middle" fill="var(--color-neutral-600)">[0]</text>
<text x="172" y="102" font-size="11" text-anchor="middle" fill="var(--color-neutral-600)">[1]</text>
<text x="288" y="102" font-size="11" text-anchor="middle" fill="var(--color-neutral-600)">[2]</text>
<text x="404" y="102" font-size="11" text-anchor="middle" fill="var(--color-neutral-600)">[3]</text>
<text x="520" y="102" font-size="11" text-anchor="middle" fill="var(--color-neutral-600)">[4]</text>
<text x="636" y="102" font-size="11" text-anchor="middle" fill="var(--color-neutral-600)">[5]</text>
<text x="0" y="126" font-size="11.5" fill="var(--color-neutral-800)">Como las direcciones son consecutivas, la JVM calcula dónde está el elemento 3 con una cuenta: obtener(i) es</text>
<text x="0" y="144" font-size="11.5" fill="var(--color-neutral-800)">instantáneo. Pero insertar al principio obliga a correr todo lo demás una posición a la derecha.</text>
<text x="0" y="188" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Lista enlazada — nodos sueltos por el Heap, unidos por referencias</text>
<text x="0" y="228" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">cabeza</text>
<line x1="46" y1="224" x2="86" y2="224" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-mem)"/>
<rect x="90" y="202" width="130" height="44" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<line x1="180" y1="202" x2="180" y2="246" stroke="var(--color-accent)"/>
<text x="135" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">10</text>
<circle cx="200" cy="224" r="4" fill="var(--color-accent-700)"/>
<path d="M200 224 C 240 224, 250 262, 286 262" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-mem)"/>
<rect x="290" y="240" width="130" height="44" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<line x1="380" y1="240" x2="380" y2="284" stroke="var(--color-accent)"/>
<text x="335" y="268" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">20</text>
<circle cx="400" cy="262" r="4" fill="var(--color-accent-700)"/>
<path d="M400 262 C 440 262, 450 224, 486 224" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-mem)"/>
<rect x="490" y="202" width="130" height="44" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<line x1="580" y1="202" x2="580" y2="246" stroke="var(--color-accent)"/>
<text x="535" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">30</text>
<line x1="588" y1="242" x2="612" y2="206" stroke="var(--color-neutral-600)" stroke-width="1.5"/>
<text x="632" y="228" font-size="11.5" fill="var(--color-neutral-700)">null</text>
<text x="0" y="308" font-size="11.5" fill="var(--color-neutral-800)">Los nodos pueden estar en cualquier parte del Heap. Para llegar al tercero hay que pasar por los dos anteriores:</text>
<text x="0" y="326" font-size="11.5" fill="var(--color-neutral-800)">obtener(i) es lento. Pero insertar al principio es solo cambiar una referencia.</text>
</svg>
<figcaption>Ninguna de las dos es mejor. Son inversas: lo que una hace instantáneo, la otra lo hace caro.</figcaption>
</figure>

Quedate con esta idea, porque es la que ordena todo lo que viene:

> **El arreglo paga la inserción para que la lectura sea gratis. La lista enlazada paga la lectura para que la inserción sea gratis.**

---

## 3. El nodo: la clase más importante de la lección

Un **nodo** es un objeto minúsculo con dos cosas: un dato y una referencia al nodo siguiente.

```java
public class Nodo<T> {
    T dato;
    Nodo<T> siguiente;   // ← una referencia a otro Nodo, del mismo tipo

    public Nodo(T dato) {
        this.dato = dato;
        this.siguiente = null;   // por defecto no apunta a nadie
    }
}
```

Esa línea `Nodo<T> siguiente;` es la que suele trabar a todo el mundo: **una clase que se referencia a sí misma**. No hay ninguna recursión infinita ahí. Acordate de la lección 7: un atributo de tipo objeto no guarda el objeto, guarda **una referencia** (o `null`). Un nodo no contiene a otro nodo: sabe dónde encontrarlo.

---

## 4. Lista enlazada simple, paso a paso

La lista completa se reduce a **una sola referencia**: la que apunta al primer nodo.

```java
public class ListaEnlazada<T> {
    private Nodo<T> cabeza;   // si es null, la lista está vacía
    private int tamanio;

    public boolean estaVacia() { return cabeza == null; }
    public int tamanio() { return tamanio; }
}
```

### `agregarAlInicio`: el baile de referencias

Estas tres líneas son el corazón de toda la estructura, y **el orden entre ellas no es negociable**:

<figure class="diagram">
<svg viewBox="0 0 720 365" role="img" aria-labelledby="d-ins-t">
<title id="d-ins-t">Los tres estados de la lista al insertar un nodo al inicio</title>
<defs><marker id="ar-ins" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-ins2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<text x="0" y="20" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">1. Nodo&lt;T&gt; nuevo = new Nodo&lt;&gt;(5);   →   el nodo nace aislado, sin tocar la lista</text>
<rect x="0" y="34" width="110" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="55" y="62" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">cabeza</text>
<line x1="112" y1="56" x2="146" y2="56" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-ins)"/>
<rect x="150" y="34" width="150" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<line x1="255" y1="34" x2="255" y2="78" stroke="var(--color-neutral-500)"/>
<text x="202" y="62" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">10</text>
<circle cx="277" cy="56" r="4" fill="var(--color-neutral-700)"/>
<line x1="281" y1="56" x2="326" y2="56" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-ins)"/>
<rect x="330" y="34" width="150" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<line x1="435" y1="34" x2="435" y2="78" stroke="var(--color-neutral-500)"/>
<text x="382" y="62" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<line x1="443" y1="74" x2="467" y2="38" stroke="var(--color-neutral-600)" stroke-width="1.5"/>
<text x="500" y="61" font-size="11.5" fill="var(--color-neutral-700)">null</text>
<rect x="560" y="34" width="150" height="44" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<line x1="665" y1="34" x2="665" y2="78" stroke="var(--color-accent)"/>
<text x="612" y="62" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">5</text>
<line x1="673" y1="74" x2="697" y2="38" stroke="var(--color-accent-700)" stroke-width="1.5"/>
<text x="560" y="26" font-size="11" font-weight="700" fill="var(--color-accent-700)">nuevo</text>
<text x="0" y="126" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">2. nuevo.siguiente = cabeza;   →   el nodo nuevo engancha la cadena vieja</text>
<text x="255" y="152" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">cabeza (sigue acá)</text>
<line x1="255" y1="156" x2="255" y2="164" stroke="var(--color-neutral-600)" stroke-width="1.8" marker-end="url(#ar-ins)"/>
<rect x="0" y="168" width="150" height="44" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<line x1="105" y1="168" x2="105" y2="212" stroke="var(--color-accent)"/>
<text x="52" y="196" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">5</text>
<circle cx="127" cy="190" r="4" fill="var(--color-accent-700)"/>
<line x1="131" y1="190" x2="176" y2="190" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-ins)"/>
<rect x="180" y="168" width="150" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<line x1="285" y1="168" x2="285" y2="212" stroke="var(--color-neutral-500)"/>
<text x="232" y="196" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">10</text>
<circle cx="307" cy="190" r="4" fill="var(--color-neutral-700)"/>
<line x1="311" y1="190" x2="356" y2="190" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-ins)"/>
<rect x="360" y="168" width="150" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<line x1="465" y1="168" x2="465" y2="212" stroke="var(--color-neutral-500)"/>
<text x="412" y="196" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<line x1="473" y1="208" x2="497" y2="172" stroke="var(--color-neutral-600)" stroke-width="1.5"/>
<text x="530" y="195" font-size="11.5" fill="var(--color-neutral-700)">null</text>
<text x="0" y="260" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">3. cabeza = nuevo;   →   recién ahora la lista reconoce al nodo como su primero</text>
<text x="75" y="286" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">cabeza</text>
<line x1="75" y1="290" x2="75" y2="298" stroke="var(--color-accent-2-700)" stroke-width="1.8" marker-end="url(#ar-ins2)"/>
<rect x="0" y="302" width="150" height="44" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<line x1="105" y1="302" x2="105" y2="346" stroke="var(--color-accent-2-600)"/>
<text x="52" y="330" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">5</text>
<circle cx="127" cy="324" r="4" fill="var(--color-accent-2-700)"/>
<line x1="131" y1="324" x2="176" y2="324" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-ins2)"/>
<rect x="180" y="302" width="150" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<line x1="285" y1="302" x2="285" y2="346" stroke="var(--color-neutral-500)"/>
<text x="232" y="330" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">10</text>
<circle cx="307" cy="324" r="4" fill="var(--color-neutral-700)"/>
<line x1="311" y1="324" x2="356" y2="324" stroke="var(--color-neutral-600)" stroke-width="2" marker-end="url(#ar-ins)"/>
<rect x="360" y="302" width="150" height="44" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<line x1="465" y1="302" x2="465" y2="346" stroke="var(--color-neutral-500)"/>
<text x="412" y="330" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<line x1="473" y1="342" x2="497" y2="306" stroke="var(--color-neutral-600)" stroke-width="1.5"/>
<text x="530" y="329" font-size="11.5" fill="var(--color-neutral-700)">null</text>
<text x="560" y="329" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">Ningún elemento se movió.</text>
</svg>
<figcaption>Los pasos 2 y 3 no se pueden invertir: si primero hacés <code>cabeza = nuevo</code>, perdés la única referencia al resto de la lista y se la lleva el recolector de basura.</figcaption>
</figure>

```java
public void agregarAlInicio(T dato) {
    Nodo<T> nuevo = new Nodo<>(dato);
    nuevo.siguiente = cabeza;   // 2. el nuevo engancha lo que había
    cabeza = nuevo;             // 3. la lista adopta al nuevo como primero
    tamanio++;
}
```

Si invertís las dos últimas líneas, `cabeza` pasa a apuntar al nodo nuevo antes de que nadie guarde dónde estaba el viejo primero. Esa referencia se pierde, y con ella **toda la lista**. Compila perfecto. Se rompe en silencio.

### Recorrer: el patrón que vas a repetir toda tu vida

```java
public void mostrar() {
    Nodo<T> actual = cabeza;          // un puntero temporal, nunca movemos cabeza
    while (actual != null) {
        System.out.print(actual.dato + " → ");
        actual = actual.siguiente;    // el paso que evita el bucle infinito
    }
    System.out.println("null");
}
```

**Nunca uses `cabeza` como variable de recorrido.** Si la movés, perdés el principio de la lista y no hay vuelta atrás. Siempre una variable auxiliar.

### Agregar al final

```java
public void agregarAlFinal(T dato) {
    Nodo<T> nuevo = new Nodo<>(dato);
    if (cabeza == null) {             // caso especial: lista vacía
        cabeza = nuevo;
        tamanio++;
        return;
    }
    Nodo<T> actual = cabeza;
    while (actual.siguiente != null) {   // ojo: siguiente != null, no actual != null
        actual = actual.siguiente;       // hay que caminar TODA la lista
    }
    actual.siguiente = nuevo;
    tamanio++;
}
```

Fijate la diferencia con el recorrido anterior: acá la condición es `actual.siguiente != null`, porque queremos quedarnos parados **en el último nodo**, no pasarnos a `null`. Es un error clásico.

Y notá el costo: agregar al final recorre la lista entera. Es la debilidad de la enlazada simple, y se resuelve guardando también una referencia `cola`.

---

## 5. Variantes: doble y circular

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-var-t">
<title id="d-var-t">Lista simplemente enlazada, doblemente enlazada y circular</title>
<defs><marker id="ar-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-v2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<text x="0" y="20" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">Simple — cada nodo conoce solo al siguiente. Se recorre en un único sentido.</text>
<rect x="60" y="30" width="160" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="140" y="59" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">A</text>
<line x1="222" y1="53" x2="276" y2="53" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-v)"/>
<rect x="280" y="30" width="160" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="360" y="59" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">B</text>
<line x1="442" y1="53" x2="496" y2="53" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-v)"/>
<rect x="500" y="30" width="160" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="580" y="59" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">C</text>
<text x="670" y="58" font-size="11.5" fill="var(--color-neutral-700)">null</text>
<text x="0" y="114" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">Doble — cada nodo conoce al siguiente y al anterior. Se recorre en los dos sentidos.</text>
<rect x="60" y="124" width="160" height="46" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="140" y="153" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">A</text>
<line x1="222" y1="140" x2="276" y2="140" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-v2)"/>
<line x1="276" y1="158" x2="222" y2="158" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-v2)"/>
<rect x="280" y="124" width="160" height="46" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="360" y="153" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">B</text>
<line x1="442" y1="140" x2="496" y2="140" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-v2)"/>
<line x1="496" y1="158" x2="442" y2="158" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-v2)"/>
<rect x="500" y="124" width="160" height="46" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="580" y="153" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">C</text>
<text x="0" y="208" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Circular — el último apunta al primero. No hay null, así que el recorrido no termina solo.</text>
<rect x="60" y="218" width="160" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="140" y="247" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">A</text>
<line x1="222" y1="241" x2="276" y2="241" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-v)"/>
<rect x="280" y="218" width="160" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="247" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">B</text>
<line x1="442" y1="241" x2="496" y2="241" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-v)"/>
<rect x="500" y="218" width="160" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="580" y="247" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<path d="M662 241 L692 241 L692 286 L140 286 L140 268" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-v)"/>
<text x="400" y="302" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">vuelve al primero</text>
<text x="0" y="324" font-size="12" fill="var(--color-neutral-700)">En la circular, la condición de corte no puede ser != null: hay que parar al volver al nodo de partida.</text>
</svg>
<figcaption>Cada variante paga memoria extra por un recorrido más flexible. La doble gasta una referencia más por nodo; la circular no gasta nada, pero cambia cómo se recorre.</figcaption>
</figure>

En la **doblemente enlazada**, el nodo suma una referencia hacia atrás:

```java
public class NodoDoble<T> {
    T dato;
    NodoDoble<T> siguiente;
    NodoDoble<T> anterior;   // el que la vuelve reversible
}
```

Con eso podés recorrer para atrás y, sobre todo, **eliminar un nodo teniendo solo ese nodo**, sin recorrer nada para encontrar al anterior. Es lo que usa `LinkedList` de Java internamente.

En la **circular**, el último apunta al primero. Sirve para turnos rotativos, buffers y reproductores en modo repetición. El recorrido cambia de forma:

```java
// En una lista circular, esto sería un bucle infinito:
// while (actual != null) { ... }

Nodo<T> actual = cabeza;
do {
    System.out.print(actual.dato + " → ");
    actual = actual.siguiente;
} while (actual != cabeza);   // el corte es volver al punto de partida
```

---

## 6. La tabla que decide

| Operación | Arreglo / `ArrayList` | Lista enlazada |
| --- | --- | --- |
| `obtener(i)` por índice | **O(1)** — una cuenta | O(n) — hay que caminar |
| Insertar al inicio | O(n) — corre todo a la derecha | **O(1)** — dos asignaciones |
| Insertar al final | **O(1)** amortizado | O(n), u O(1) si guardás `cola` |
| Insertar en el medio | O(n) por el corrimiento | O(n) por la búsqueda |
| Eliminar el primero | O(n) | **O(1)** |
| Buscar un valor | O(n) | O(n) |
| Memoria por elemento | solo el dato | dato **+ una referencia** por nodo |

Y la conclusión práctica, que es la que importa:

> **En el 95 % de los casos usá `ArrayList`.** Los recorridos secuenciales sobre memoria contigua son muchísimo más rápidos de lo que la tabla sugiere, porque el procesador precarga bloques enteros de memoria contigua en su caché. Una `LinkedList` con nodos dispersos pierde esa ventaja por completo.

`LinkedList` gana cuando insertás y eliminás constantemente en los extremos y casi nunca accedés por índice. Ese caso existe —lo vas a ver en la próxima lección, con pilas y colas— pero es minoritario.

---

## 7. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| `cabeza = nuevo;` antes de `nuevo.siguiente = cabeza;` | Se pierde la referencia al resto de la lista y el recolector se lleva todo. Compila sin quejarse. | Primero enganchar, después mover `cabeza`. |
| Recorrer moviendo `cabeza` en vez de una variable auxiliar | La lista queda truncada o vacía después de un simple recorrido. | `Nodo<T> actual = cabeza;` y mover `actual`. |
| Olvidar `actual = actual.siguiente;` dentro del `while` | Bucle infinito: el programa se cuelga sin ningún error. | El avance es parte del bucle, no un detalle opcional. |
| Usar `while (actual != null)` cuando querés el último nodo | Terminás en `null` y el `NullPointerException` llega en la línea siguiente. | `while (actual.siguiente != null)`. |
| No contemplar la lista vacía | `NullPointerException` al tocar `cabeza.siguiente` sobre `cabeza == null`. | Chequear `cabeza == null` al principio de cada operación. |
| Olvidar actualizar `tamanio` | `tamanio()` miente y todo lo que dependa de él falla. | Modificar el contador en el mismo método que modifica la estructura. |
| Usar `while (actual != null)` en una lista circular | Bucle infinito garantizado: nunca hay `null`. | `do { ... } while (actual != cabeza);`. |

---

## 8. Ejercicio práctico guiado

### Desafío: `eliminar(T dato)` en la lista enlazada simple

Implementá `eliminar` de forma que:

1. Devuelva `true` si eliminó algo y `false` si el dato no estaba.
2. Funcione cuando la lista está **vacía**.
3. Funcione cuando el elemento a borrar es la **cabeza**.
4. Funcione cuando está en el **medio** o al **final**.
5. Actualice `tamanio` correctamente.

Pensá los cuatro casos antes de escribir. Ahí está toda la dificultad del ejercicio.

<details>
<summary>Ver solución sugerida</summary>

```java
public class ListaEnlazada<T> {
    private Nodo<T> cabeza;
    private int tamanio;

    public void agregarAlInicio(T dato) {
        Nodo<T> nuevo = new Nodo<>(dato);
        nuevo.siguiente = cabeza;
        cabeza = nuevo;
        tamanio++;
    }

    public boolean eliminar(T dato) {
        // CASO 1: lista vacía. Sin esto, la línea siguiente explota.
        if (cabeza == null) {
            return false;
        }

        // CASO 2: el elemento buscado es la cabeza.
        // Es distinto porque no hay un nodo "anterior" al que reengancharle.
        if (java.util.Objects.equals(cabeza.dato, dato)) {
            cabeza = cabeza.siguiente;   // la lista arranca en el segundo
            tamanio--;
            return true;
        }

        // CASO 3 y 4: medio o final.
        // Nos paramos SIEMPRE un nodo antes del candidato, porque para
        // desenganchar un nodo hay que modificar el 'siguiente' del anterior.
        Nodo<T> anterior = cabeza;
        while (anterior.siguiente != null) {
            if (java.util.Objects.equals(anterior.siguiente.dato, dato)) {
                anterior.siguiente = anterior.siguiente.siguiente;   // el salto
                tamanio--;
                return true;
            }
            anterior = anterior.siguiente;
        }

        // Recorrimos todo y no estaba.
        return false;
    }

    public void mostrar() {
        Nodo<T> actual = cabeza;
        StringBuilder sb = new StringBuilder();
        while (actual != null) {
            sb.append(actual.dato).append(" → ");
            actual = actual.siguiente;
        }
        System.out.println(sb.append("null").append("  (tamaño ").append(tamanio).append(")"));
    }

    public static void main(String[] args) {
        ListaEnlazada<Integer> lista = new ListaEnlazada<>();
        lista.agregarAlInicio(30);
        lista.agregarAlInicio(20);
        lista.agregarAlInicio(10);
        lista.mostrar();                                    // 10 → 20 → 30 → null  (tamaño 3)

        System.out.println(lista.eliminar(20));  // true  — caso medio
        lista.mostrar();                                    // 10 → 30 → null  (tamaño 2)

        System.out.println(lista.eliminar(10));  // true  — caso cabeza
        lista.mostrar();                                    // 30 → null  (tamaño 1)

        System.out.println(lista.eliminar(99));  // false — no estaba
        System.out.println(lista.eliminar(30));  // true  — último elemento
        lista.mostrar();                                    // null  (tamaño 0)

        System.out.println(lista.eliminar(1));   // false — lista vacía
    }
}
```

**Las dos claves de esta solución.**

La primera: nos paramos en el **nodo anterior** al que queremos borrar, nunca en el nodo mismo. En una lista simple, desde un nodo no hay forma de llegar al que lo precede, y sin el anterior no podés reenganchar la cadena. Por eso la condición es `anterior.siguiente.dato` y no `actual.dato`.

La segunda: `Objects.equals(a, b)` en lugar de `a.equals(b)`, porque tolera que el dato guardado sea `null` sin lanzar `NullPointerException`.

Y fijate que "eliminar" nunca borra nada: solo deja de apuntarlo. Sin ninguna referencia que lo alcance, el recolector de basura se lo lleva. En Java no se libera memoria a mano.

</details>

---

## Para llevarte

- Un **TAD** separa el *qué* (la especificación) del *cómo* (la implementación). En Java el *qué* se escribe como una interfaz.
- Arreglo y lista enlazada tienen costos **inversos**: uno paga la inserción para que la lectura sea gratis, el otro al revés.
- Un nodo es un objeto con un dato y una **referencia** a otro nodo. No lo contiene: sabe dónde está.
- En `agregarAlInicio`, el orden de las dos asignaciones no es negociable: enganchar primero, mover `cabeza` después.
- Recorré siempre con una **variable auxiliar**; mover `cabeza` destruye la lista.
- Los cuatro casos de toda operación son: lista vacía, primer elemento, elemento del medio, elemento inexistente.
- La doble permite ir para atrás y borrar sin buscar al anterior; la circular no tiene `null` y cambia la condición de corte.
- En producción, **`ArrayList` casi siempre**. La memoria contigua le gana a la teoría gracias a la caché del procesador.
</content>
