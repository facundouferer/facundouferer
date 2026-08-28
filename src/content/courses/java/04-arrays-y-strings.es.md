---
course: 'java'
slug: '04-arrays-y-strings'
title: 'Arrays y Manejo de Strings en Java'
description: 'Dominá arreglos unidimensionales, matrices y arrays irregulares, la clase java.util.Arrays, el modelo de memoria de String, el String Constant Pool y StringBuilder.'
order: 4
lang: 'es'
published: true
---

# Arrays y Manejo de Strings en Java

Hasta acá guardaste datos en variables sueltas: una edad, un nombre, un precio. Eso alcanza mientras sepas de antemano cuántos valores vas a manejar. Pero apenas necesitás las notas de un curso, los píxeles de una imagen o las palabras de un texto, declarar `nota1`, `nota2`, `nota3`… deja de ser una opción.

El **array** es la primera estructura de datos del lenguaje: un contenedor de tamaño fijo que guarda muchos valores del mismo tipo bajo un único nombre. Y el **String** —que parece un tipo más— es en realidad un objeto construido sobre un array de caracteres, con una regla propia que cambia todo: es inmutable.

Esta lección cubre las dos cosas juntas porque comparten el mismo trasfondo: **cómo Java acomoda los datos en memoria**. Entender eso es lo que después explica por qué `==` falla al comparar textos, por qué concatenar dentro de un bucle es lento, y por qué un array no puede crecer.

![Modelo de Memoria para Arrays y Strings en Java](/img/courses/java/java-arrays-and-strings-memory.jpg)

---

## 1. Por qué existe el array: memoria contigua y acceso constante

Un **array** es un bloque de memoria **contiguo** —un solo tramo, sin huecos— dividido en casillas del mismo tamaño. Esa decisión de diseño explica prácticamente todo lo demás.

<figure class="diagram">
<svg viewBox="0 0 720 285" role="img" aria-labelledby="d-arrmem-t">
<title id="d-arrmem-t">La variable array vive en el Stack y apunta a un bloque contiguo del Heap</title>
<defs><marker id="ar-arrmem" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="15" font-weight="700" fill="var(--color-accent-700)">int[] edades = new int[5];</text>
<rect x="0" y="44" width="200" height="120" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="20" y="70" font-size="12" font-weight="700" fill="var(--color-neutral-800)">STACK</text>
<rect x="20" y="86" width="160" height="58" rx="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="36" y="110" font-size="13.5" font-weight="700" fill="var(--color-text)">edades</text>
<text x="36" y="131" font-size="12" fill="var(--color-neutral-700)">0x7f3a2c (referencia)</text>
<path d="M182 112 C 236 112, 240 100, 286 100" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-arrmem)"/>
<rect x="292" y="44" width="428" height="120" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="312" y="70" font-size="12" font-weight="700" fill="var(--color-accent-2-800)">HEAP — un solo bloque contiguo</text>
<text x="700" y="70" font-size="12" font-weight="700" text-anchor="end" fill="var(--color-accent-2-800)">length = 5</text>
<rect x="312" y="82" width="72" height="44" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="348" y="110" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="348" y="146" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">[0]</text>
<rect x="392" y="82" width="72" height="44" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="428" y="110" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="428" y="146" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">[1]</text>
<rect x="472" y="82" width="72" height="44" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="508" y="110" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="508" y="146" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">[2]</text>
<rect x="552" y="82" width="72" height="44" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="588" y="110" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="588" y="146" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">[3]</text>
<rect x="632" y="82" width="72" height="44" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="668" y="110" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="668" y="146" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">[4]</text>
<rect x="0" y="188" width="720" height="70" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="22" y="216" font-size="14.5" font-weight="700" fill="var(--color-accent-700)">dirección de edades[i] = dirección base + i × tamaño de la casilla</text>
<text x="22" y="240" font-size="12.5" fill="var(--color-text)">Una multiplicación y una suma: llegar a edades[0] cuesta exactamente lo mismo que llegar a edades[4].</text>
<text x="2" y="278" font-size="12" fill="var(--color-neutral-700)">El índice empieza en 0 porque no es un número de orden: es el desplazamiento en casillas desde el inicio del bloque.</text>
</svg>
<figcaption>La variable vive en el Stack y solo guarda una referencia. Los datos viven en el Heap, uno al lado del otro. De esa contigüidad salen las tres reglas del array: índice desde 0, acceso instantáneo y tamaño fijo.</figcaption>
</figure>

Tres consecuencias que conviene tener claras desde el principio:

- **El índice arranca en 0** porque no cuenta posiciones, mide *desplazamiento*. `edades[0]` está a cero casillas del inicio. Por eso el último índice válido siempre es `length - 1`.
- **El acceso es instantáneo** —lo que en análisis de algoritmos se escribe O(1)—. No hay búsqueda: hay una cuenta aritmética. Es la propiedad que hace del array la base de casi todas las demás estructuras.
- **El tamaño no puede cambiar.** Justo después del bloque hay otra cosa en memoria. Para "agrandar" un array hay que pedir un bloque nuevo y copiar; lo vemos en la sección 4.

> `length` es un **atributo**, no un método: se escribe `array.length` sin paréntesis. En `String`, en cambio, es un método: `texto.length()`. Es una de las inconsistencias históricas de Java y una fuente clásica de errores de compilación.

---

## 2. Declarar, instanciar e inicializar

Estas tres cosas son distintas y conviene no confundirlas: **declarar** crea la variable, **instanciar** reserva el bloque en el Heap, **inicializar** pone los valores.

```java
// Forma 1: declarar e instanciar vacío (Java llena con valores por defecto)
int[] edades = new int[5];

// Forma 2: literal de inicialización (el tamaño lo deduce el compilador)
String[] lenguajes = {"Java", "Python", "TypeScript", "Go"};

// Forma 3: instanciación anónima (útil para pasar un array a un método)
imprimir(new int[]{10, 20, 30});

// Declarar ahora, instanciar después
double[] precios;          // precios vale null: no hay bloque todavía
precios = new double[3];   // ahora sí existe el bloque
```

La sintaxis `int edades[]` también compila —viene heredada de C— pero **no la uses**. `int[] edades` dice lo correcto: el tipo de la variable es *array de int*, no *int*.

### Valores por defecto al instanciar con `new`

Java nunca deja memoria con basura: al reservar el bloque lo pone en cero binario, que cada tipo interpreta a su manera.

| Tipo | Valor por defecto |
| --- | --- |
| `byte`, `short`, `int`, `long` | `0` |
| `float`, `double` | `0.0` |
| `char` | `'\u0000'` (el carácter nulo) |
| `boolean` | `false` |
| Cualquier referencia (`String`, objetos, arrays) | `null` |

Esto tiene una consecuencia práctica importante: `new String[3]` **no** te da tres cadenas vacías, te da tres `null`. Recorrerlo y llamar a `.length()` sin verificar termina en `NullPointerException`.

### Los dos errores que vas a ver seguro

```java
int[] datos = new int[3];

datos[3] = 99;   // ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
datos[-1] = 99;  // ArrayIndexOutOfBoundsException: Index -1 out of bounds for length 3

int n = -5;
int[] otro = new int[n];   // NegativeArraySizeException: -5
```

Los tres son errores de **ejecución**, no de compilación: el compilador no sabe qué valor va a tener el índice. Java verifica el rango en cada acceso —a diferencia de C, donde escribir fuera del array corrompe memoria en silencio—. Es un costo pequeño a cambio de que el error aparezca exactamente donde se produjo.

---

## 3. Recorrer un array

```java
String[] frutas = {"Manzana", "Banana", "Naranja", "Frutilla"};

// A) for clásico: tenés el índice, podés modificar el array
for (int i = 0; i < frutas.length; i++) {
    System.out.println("Índice " + i + ": " + frutas[i]);
}

// B) for-each: más limpio cuando el índice no importa
for (String fruta : frutas) {
    System.out.println("Fruta: " + fruta);
}

// C) hacia atrás
for (int i = frutas.length - 1; i >= 0; i--) {
    System.out.println(frutas[i]);
}
```

**Cuándo usar cada uno.** El `for-each` es la opción por defecto: se lee mejor y elimina de raíz los errores de índice. Pero tiene un límite que sorprende a mucha gente:

```java
int[] numeros = {1, 2, 3};

for (int n : numeros) {
    n = n * 2;          // NO modifica el array: n es una copia del valor
}
System.out.println(Arrays.toString(numeros));   // [1, 2, 3]

for (int i = 0; i < numeros.length; i++) {
    numeros[i] = numeros[i] * 2;   // esto SÍ lo modifica
}
System.out.println(Arrays.toString(numeros));   // [2, 4, 6]
```

La variable del `for-each` es una copia de cada elemento, no la casilla en sí. Regla simple: **si tenés que escribir en el array, necesitás el índice**; si solo tenés que leerlo, usá `for-each`.

---

## 4. El tamaño es fijo: qué hacer cuando el array se llena

No existe `array.add(...)`. Un array de 4 posiciones muere con 4 posiciones. Cuando necesitás más, la única salida es pedir un bloque nuevo y copiar el contenido.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-grow-t">
<title id="d-grow-t">Un array no crece: se crea uno más grande y se copian los elementos</title>
<defs><marker id="ar-grow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="15" font-weight="700" fill="var(--color-accent-700)">int[] copia = Arrays.copyOf(datos, 8);</text>
<text x="2" y="52" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">datos — length 4, sin lugar libre</text>
<rect x="0" y="62" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="40" y="91" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">10</text>
<rect x="86" y="62" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="126" y="91" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<rect x="172" y="62" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="212" y="91" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">30</text>
<rect x="258" y="62" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="298" y="91" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">40</text>
<line x1="169" y1="116" x2="169" y2="158" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-grow)"/>
<text x="186" y="143" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">bloque nuevo + copia elemento por elemento</text>
<text x="2" y="186" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">copia — length 8, los 4 nuevos con el valor por defecto</text>
<rect x="0" y="196" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="40" y="225" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">10</text>
<rect x="86" y="196" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="126" y="225" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<rect x="172" y="196" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="212" y="225" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">30</text>
<rect x="258" y="196" width="80" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="298" y="225" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">40</text>
<rect x="344" y="196" width="80" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="384" y="225" font-size="15" text-anchor="middle" fill="var(--color-neutral-700)">0</text>
<rect x="430" y="196" width="80" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="470" y="225" font-size="15" text-anchor="middle" fill="var(--color-neutral-700)">0</text>
<rect x="516" y="196" width="80" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="556" y="225" font-size="15" text-anchor="middle" fill="var(--color-neutral-700)">0</text>
<rect x="602" y="196" width="80" height="46" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="642" y="225" font-size="15" text-anchor="middle" fill="var(--color-neutral-700)">0</text>
<text x="2" y="270" font-size="12.5" fill="var(--color-text)">El array original queda sin referencias y se lo lleva el recolector de basura. Copiar n elementos cuesta n operaciones.</text>
<text x="2" y="291" font-size="12" fill="var(--color-neutral-700)">Por eso ArrayList duplica la capacidad en vez de agrandar de a uno: así el costo de copiar se reparte y deja de notarse.</text>
</svg>
<figcaption>Crecer siempre significa copiar. La estrategia de duplicar la capacidad —en vez de sumar una casilla— es la que hace viable a <code>ArrayList</code>, que vas a ver en la lección de colecciones.</figcaption>
</figure>

```java
import java.util.Arrays;

int[] datos = {10, 20, 30, 40};

// Opción 1: Arrays.copyOf — la más legible
int[] masGrande = Arrays.copyOf(datos, 8);        // [10, 20, 30, 40, 0, 0, 0, 0]

// Opción 2: un rango concreto (el índice final NO se incluye)
int[] medio = Arrays.copyOfRange(datos, 1, 3);    // [20, 30]

// Opción 3: System.arraycopy — control total sobre origen y destino
int[] destino = new int[8];
System.arraycopy(datos, 0, destino, 0, datos.length);
//               origen, desde, destino, hacia, cuántos
```

Este trabajo manual es exactamente el que `ArrayList` te ahorra. Pero conviene haberlo hecho a mano una vez: es la única forma de entender por qué agregar elementos a una lista a veces es instantáneo y a veces no.

---

## 5. Arrays de primitivos vs. arrays de objetos

La diferencia importa mucho más de lo que parece.

```java
int[] numeros = new int[3];        // 3 casillas con el valor 0
String[] nombres = new String[3];  // 3 casillas con la referencia null

System.out.println(numeros[0]);           // 0
System.out.println(nombres[0]);           // null
System.out.println(nombres[0].length());  // NullPointerException
```

Un array de primitivos **contiene los valores**. Un array de objetos **contiene referencias**: los objetos viven en otra parte del Heap y el array solo guarda las direcciones. Eso explica el comportamiento de las copias:

```java
StringBuilder[] original = { new StringBuilder("Hola") };
StringBuilder[] copia = Arrays.copyOf(original, 1);

copia[0].append(" mundo");

System.out.println(original[0]);               // "Hola mundo"  ← ¡también cambió!
System.out.println(original[0] == copia[0]);   // true
```

`Arrays.copyOf` hace una **copia superficial** (*shallow copy*): duplica el array de referencias, no los objetos apuntados. Los dos arrays son distintos, pero apuntan a los mismos objetos. Si necesitás independencia real —una **copia profunda**— tenés que clonar cada elemento vos mismo.

Con `String` este problema no aparece nunca, y la razón es la sección 8: los `String` son inmutables, así que compartir la referencia no puede hacer daño.

> Los arrays de objetos tienen bastante más tela que cortar —casillas en `null`, ordenamiento con `Comparator`, capacidad contra cantidad—, pero necesitan clases y constructores. Por eso tienen lección propia: **Arrays de Objetos**, la número 9, justo después de encapsulamiento.

---

## 6. Matrices y arrays irregulares

En Java **no existen las matrices** como tipo propio. Lo que existe es un array cuyos elementos son, a su vez, arrays.

<figure class="diagram">
<svg viewBox="0 0 720 322" role="img" aria-labelledby="d-matrix-t">
<title id="d-matrix-t">Una matriz en Java es un array de referencias a otros arrays, que pueden tener distinta longitud</title>
<defs><marker id="ar-matrix" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="15" font-weight="700" fill="var(--color-accent-700)">int[][] datos = new int[3][];</text>
<rect x="0" y="40" width="170" height="222" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="18" y="64" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">datos — array externo</text>
<rect x="18" y="76" width="134" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="34" y="106" font-size="13.5" font-weight="700" fill="var(--color-text)">[0] ref</text>
<rect x="18" y="132" width="134" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="34" y="162" font-size="13.5" font-weight="700" fill="var(--color-text)">[1] ref</text>
<rect x="18" y="188" width="134" height="48" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="34" y="218" font-size="13.5" font-weight="700" fill="var(--color-text)">[2] ref</text>
<text x="18" y="254" font-size="11.5" fill="var(--color-neutral-800)">datos.length = 3</text>
<path d="M154 100 L 272 100" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-matrix)"/>
<path d="M154 156 L 272 156" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-matrix)"/>
<path d="M154 212 L 272 212" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-matrix)"/>
<rect x="280" y="76" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="315" y="106" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">1</text>
<rect x="356" y="76" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="391" y="106" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">2</text>
<rect x="432" y="76" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="467" y="106" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">3</text>
<text x="718" y="106" font-size="12" font-weight="700" text-anchor="end" fill="var(--color-accent-2-800)">length 3</text>
<rect x="280" y="132" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="315" y="162" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">4</text>
<rect x="356" y="132" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="391" y="162" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">5</text>
<rect x="432" y="132" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="467" y="162" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">6</text>
<rect x="508" y="132" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="543" y="162" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">7</text>
<rect x="584" y="132" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="619" y="162" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">8</text>
<text x="718" y="162" font-size="12" font-weight="700" text-anchor="end" fill="var(--color-accent-2-800)">length 5</text>
<rect x="280" y="188" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="315" y="218" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">9</text>
<rect x="356" y="188" width="70" height="48" rx="12" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="391" y="218" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="718" y="218" font-size="12" font-weight="700" text-anchor="end" fill="var(--color-accent-2-800)">length 2</text>
<text x="2" y="288" font-size="12.5" fill="var(--color-text)">Cada fila es un objeto array independiente, con su propia longitud. Por eso el bucle interno usa datos[fila].length.</text>
<text x="2" y="309" font-size="12" fill="var(--color-neutral-700)">La matriz rectangular es solo el caso particular en el que todas las filas se crearon del mismo tamaño.</text>
</svg>
<figcaption>Un <code>int[][]</code> es un array de referencias. Las filas viven separadas en el Heap, así que nada obliga a que midan lo mismo: eso es un <em>jagged array</em>.</figcaption>
</figure>

```java
// Matriz rectangular: 3 filas x 3 columnas
int[][] tablero = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Recorrido con bucles anidados
for (int fila = 0; fila < tablero.length; fila++) {
    for (int col = 0; col < tablero[fila].length; col++) {   // ← length de ESA fila
        System.out.print(tablero[fila][col] + " ");
    }
    System.out.println();
}

// Recorrido con for-each anidado (cuando no necesitás los índices)
for (int[] fila : tablero) {
    for (int valor : fila) {
        System.out.print(valor + " ");
    }
    System.out.println();
}
```

Array irregular (*jagged*), cuando cada fila tiene un tamaño propio:

```java
int[][] datos = new int[3][];      // solo el array externo; las filas quedan en null
datos[0] = new int[]{1, 2, 3};
datos[1] = new int[]{4, 5, 6, 7, 8};
datos[2] = new int[]{9, 0};

System.out.println(datos[1].length);   // 5
```

Escribir `tablero[fila].length` en vez de `tablero[0].length` no es un detalle estético: es lo que hace que el mismo bucle funcione con matrices rectangulares e irregulares.

> Para imprimir una matriz completa, `Arrays.toString()` no alcanza: te muestra las direcciones de memoria de las filas. Usá **`Arrays.deepToString(tablero)`**.

---

## 7. `java.util.Arrays`: el cinturón de herramientas

Casi nada de lo que necesitás hacer con un array hace falta escribirlo a mano. `java.util.Arrays` ya lo tiene.

| Método | Qué hace |
| --- | --- |
| `Arrays.toString(a)` | Representación legible de un array de una dimensión |
| `Arrays.deepToString(m)` | Lo mismo para matrices y arrays anidados |
| `Arrays.sort(a)` | Ordena **modificando el array original** (in-place) |
| `Arrays.sort(a, desde, hasta)` | Ordena solo un rango |
| `Arrays.binarySearch(a, v)` | Búsqueda binaria — **exige el array ya ordenado** |
| `Arrays.copyOf(a, n)` | Copia redimensionada |
| `Arrays.copyOfRange(a, d, h)` | Copia de un rango, `h` excluido |
| `Arrays.fill(a, v)` | Rellena todas las casillas con un valor |
| `Arrays.equals(a, b)` | Compara **contenido** de arrays de una dimensión |
| `Arrays.deepEquals(m, n)` | Compara contenido de arrays anidados |
| `Arrays.stream(a)` | Convierte el array en un stream para sumar, filtrar, promediar |

```java
import java.util.Arrays;

public class EjemploArrays {
    public static void main(String[] args) {
        int[] numeros = {42, 12, 89, 7, 23};

        System.out.println("Original: " + Arrays.toString(numeros));

        Arrays.sort(numeros);                         // ordena el array original
        System.out.println("Ordenado: " + Arrays.toString(numeros));   // [7, 12, 23, 42, 89]

        int indice = Arrays.binarySearch(numeros, 23);
        System.out.println("Índice de 23: " + indice);                 // 2

        int[] copia = Arrays.copyOf(numeros, 3);
        System.out.println("Copia: " + Arrays.toString(copia));        // [7, 12, 23]

        int[] ceros = new int[5];
        Arrays.fill(ceros, -1);
        System.out.println(Arrays.toString(ceros));                    // [-1, -1, -1, -1, -1]

        // Estadísticas sin escribir un solo bucle
        System.out.println("Suma: " + Arrays.stream(numeros).sum());
        System.out.println("Máximo: " + Arrays.stream(numeros).max().getAsInt());
        System.out.println("Promedio: " + Arrays.stream(numeros).average().getAsDouble());
    }
}
```

### Dos trampas que hay que conocer

**1. `==` tampoco sirve para comparar arrays.** Compara referencias, igual que con los objetos:

```java
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};

System.out.println(a == b);                // false — son dos bloques distintos
System.out.println(a.equals(b));           // false — un array no sobrescribe equals
System.out.println(Arrays.equals(a, b));   // true  — esta es la correcta
```

**2. `binarySearch` sobre un array desordenado devuelve basura silenciosamente.** No lanza excepción, no avisa: simplemente retorna un número sin sentido, porque el algoritmo asume que el array está ordenado. Ordená siempre antes de buscar.

---

## 8. Strings: por qué son inmutables

Un `String` es un objeto que envuelve una secuencia de caracteres. Su regla central es que **una vez creado, su contenido no cambia jamás**. Ningún método de `String` modifica la cadena original: todos devuelven una cadena nueva.

<figure class="diagram">
<svg viewBox="0 0 720 250" role="img" aria-labelledby="d-immut-t">
<title id="d-immut-t">Concatenar no modifica el String original: crea uno nuevo y abandona el anterior</title>
<defs><marker id="ar-immut" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="15" font-weight="700" fill="var(--color-accent-700)">String saludo = "Ho";   saludo = saludo + "la";</text>
<text x="2" y="48" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">ANTES</text>
<rect x="0" y="58" width="150" height="52" rx="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="90" font-size="13.5" font-weight="700" fill="var(--color-text)">saludo</text>
<path d="M152 84 L 224 84" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-immut)"/>
<rect x="232" y="58" width="190" height="52" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="327" y="90" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">"Ho"</text>
<text x="2" y="146" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">DESPUÉS</text>
<rect x="0" y="156" width="150" height="52" rx="14" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="188" font-size="13.5" font-weight="700" fill="var(--color-text)">saludo</text>
<path d="M152 182 L 224 182" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-immut)"/>
<rect x="232" y="156" width="190" height="52" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="327" y="188" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-text)">"Hola"</text>
<text x="440" y="150" font-size="12" font-weight="700" fill="var(--color-neutral-700)">el objeto anterior sigue en el Heap:</text>
<rect x="440" y="156" width="280" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-width="2" stroke-dasharray="6 5"/>
<text x="580" y="180" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">"Ho"</text>
<text x="580" y="198" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-700)">sin referencias — se lo lleva el GC</text>
<text x="2" y="236" font-size="12.5" fill="var(--color-text)">La variable cambió de objetivo; el objeto "Ho" nunca cambió. Eso es la inmutabilidad: se reemplaza la referencia, no el contenido.</text>
</svg>
<figcaption>El signo <code>=</code> reasigna la <em>variable</em>. El objeto original queda intacto y, si nadie más lo apunta, se convierte en basura.</figcaption>
</figure>

```java
String texto = "hola";
texto.toUpperCase();                   // devuelve "HOLA", pero se descarta
System.out.println(texto);             // "hola" — no cambió nada

String mayus = texto.toUpperCase();    // así sí: guardás el resultado
System.out.println(mayus);             // "HOLA"
```

Olvidar la asignación es el error número uno con `String`. Como el método no falla ni avisa, el programa sigue corriendo con el valor viejo.

**¿Por qué Java tomó esta decisión?** No es un capricho:

- **Seguridad.** Rutas de archivo, URLs y credenciales viajan como `String`. Si fueran mutables, un método al que le pasaste una ruta ya validada podría cambiarla después de la validación.
- **Concurrencia.** Un objeto que no cambia se puede compartir entre hilos sin ningún tipo de sincronización.
- **Rendimiento del hashing.** `String` calcula su `hashCode()` una sola vez y lo cachea. Es lo que hace que usar cadenas como clave de un `HashMap` sea rápido.
- **Reutilización.** Como nadie puede modificarlos, la JVM puede compartir un mismo objeto entre muchas variables. Eso es el pool.

---

## 9. El String Constant Pool y la trampa de `==`

Para no duplicar cadenas idénticas, la JVM mantiene una zona especial dentro del Heap llamada **String Constant Pool**. Cuando escribís un literal entre comillas, la JVM busca primero en el pool y reutiliza el objeto si ya está.

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-pool-t">
<title id="d-pool-t">Los literales comparten un objeto en el String Constant Pool; new String crea siempre uno nuevo</title>
<defs><marker id="ar-pool" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="2" y="20" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">String s1 = "Java";   String s2 = "Java";   String s3 = new String("Java");</text>
<rect x="0" y="40" width="190" height="212" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="18" y="64" font-size="12" font-weight="700" fill="var(--color-neutral-800)">STACK</text>
<rect x="18" y="76" width="154" height="46" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="36" y="105" font-size="14" font-weight="700" fill="var(--color-text)">s1</text>
<rect x="18" y="132" width="154" height="46" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="36" y="161" font-size="14" font-weight="700" fill="var(--color-text)">s2</text>
<rect x="18" y="188" width="154" height="46" rx="12" fill="var(--color-bg)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<text x="36" y="217" font-size="14" font-weight="700" fill="var(--color-text)">s3</text>
<rect x="222" y="40" width="498" height="212" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="242" y="64" font-size="12" font-weight="700" fill="var(--color-neutral-800)">HEAP</text>
<rect x="242" y="76" width="458" height="86" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="262" y="98" font-size="12" font-weight="700" fill="var(--color-accent-700)">STRING CONSTANT POOL</text>
<rect x="262" y="106" width="418" height="44" rx="12" fill="var(--color-bg)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="284" y="134" font-size="15" font-weight="700" fill="var(--color-text)">"Java"</text>
<text x="660" y="134" font-size="12" text-anchor="end" fill="var(--color-neutral-800)">un único objeto compartido</text>
<rect x="242" y="180" width="458" height="54" rx="16" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<text x="264" y="204" font-size="15" font-weight="700" fill="var(--color-text)">"Java"</text>
<text x="678" y="204" font-size="12" text-anchor="end" fill="var(--color-neutral-800)">objeto nuevo, fuera del pool</text>
<text x="264" y="223" font-size="11.5" fill="var(--color-neutral-700)">creado por new: mismo contenido, distinta identidad</text>
<path d="M174 96 L 254 118" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-pool)"/>
<path d="M174 152 L 254 138" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-pool)"/>
<path d="M174 210 L 234 207" fill="none" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-pool)"/>
<text x="2" y="286" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">s1 == s2 → true</text>
<text x="240" y="286" font-size="13.5" font-weight="700" fill="var(--color-neutral-700)">s1 == s3 → false</text>
<text x="470" y="286" font-size="13.5" font-weight="700" fill="var(--color-accent-2-800)">s1.equals(s3) → true</text>
<text x="2" y="312" font-size="12.5" fill="var(--color-text)">== responde "¿son el mismo objeto?".  equals() responde "¿dicen lo mismo?".  Casi siempre querés la segunda pregunta.</text>
<text x="2" y="332" font-size="12" fill="var(--color-neutral-700)">new String("Java") es, por eso mismo, código a evitar: gasta memoria para obtener un duplicado que nunca necesitás.</text>
</svg>
<figcaption>El pool es la razón por la que <code>==</code> a veces "parece funcionar" con cadenas. Funciona por casualidad, y deja de hacerlo apenas la cadena se arma en tiempo de ejecución.</figcaption>
</figure>

```java
String s1 = "Java";
String s2 = "Java";
String s3 = new String("Java");

System.out.println(s1 == s2);       // true  — misma referencia del pool
System.out.println(s1 == s3);       // false — new siempre crea un objeto aparte
System.out.println(s1.equals(s3));  // true  — compara el contenido
```

Y el caso que convence a cualquiera de no usar nunca `==`:

```java
String a = "Java";
String b = "Ja" + "va";                    // el compilador lo resuelve: va al pool
System.out.println(a == b);                // true

String parte = "Ja";
String c = parte + "va";                   // se arma en ejecución: objeto nuevo
System.out.println(a == c);                // false  ← mismo texto, otro objeto
System.out.println(a.equals(c));           // true
```

> **Regla de oro:** para comparar el **contenido** de dos cadenas usá siempre `.equals()` o `.equalsIgnoreCase()`. `==` compara identidad de objetos y va a traicionarte apenas la cadena venga de un archivo, de la consola o de una concatenación.

**Truco defensivo contra `NullPointerException`:** si uno de los dos lados puede ser `null`, poné el literal a la izquierda.

```java
String entrada = null;

entrada.equals("salir");   // NullPointerException
"salir".equals(entrada);   // false — seguro
```

---

## 10. Recorrer y cortar texto: todo es cuestión de índices

Un `String` se indexa igual que un array, desde `0` hasta `length() - 1`.

<figure class="diagram">
<svg viewBox="0 0 720 212" role="img" aria-labelledby="d-idx-t">
<title id="d-idx-t">Los índices de una cadena y cómo funciona substring con índice final excluido</title>
<text x="2" y="20" font-size="15" font-weight="700" fill="var(--color-accent-700)">String t = "Java 2026";</text>
<rect x="28" y="38" width="64" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="60" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">J</text>
<text x="60" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">0</text>
<rect x="98" y="38" width="64" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="130" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">a</text>
<text x="130" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">1</text>
<rect x="168" y="38" width="64" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="200" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">v</text>
<text x="200" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">2</text>
<rect x="238" y="38" width="64" height="52" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="270" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">a</text>
<text x="270" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">3</text>
<rect x="308" y="38" width="64" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="340" y="70" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-700)">espacio</text>
<text x="340" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">4</text>
<rect x="378" y="38" width="64" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="410" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">2</text>
<text x="410" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">5</text>
<rect x="448" y="38" width="64" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="480" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">0</text>
<text x="480" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">6</text>
<rect x="518" y="38" width="64" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="550" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">2</text>
<text x="550" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">7</text>
<rect x="588" y="38" width="64" height="52" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="620" y="73" font-size="20" font-weight="700" text-anchor="middle" fill="var(--color-text)">6</text>
<text x="620" y="110" font-size="12.5" text-anchor="middle" fill="var(--color-neutral-800)">8</text>
<path d="M28 140 L 302 140" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
<path d="M28 132 L 28 148" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
<path d="M302 132 L 302 148" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
<text x="318" y="138" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">t.substring(0, 4) → "Java"</text>
<text x="318" y="158" font-size="12.5" fill="var(--color-text)">el índice inicial se incluye, el final NO</text>
<text x="2" y="186" font-size="12.5" fill="var(--color-text)">t.length() es 9, pero el último índice válido es 8. t.charAt(9) lanza StringIndexOutOfBoundsException.</text>
<text x="2" y="204" font-size="12" fill="var(--color-neutral-700)">Ese mismo criterio "inicio incluido, fin excluido" reaparece en copyOfRange, en subList y en casi toda la biblioteca de Java.</text>
</svg>
<figcaption>El par <em>inicio incluido / fin excluido</em> es una convención de toda la biblioteca estándar. Aprendida una vez, sirve para <code>substring</code>, <code>copyOfRange</code>, <code>subList</code> y los <code>Stream</code>.</figcaption>
</figure>

### Métodos esenciales de `String`

| Método | Devuelve |
| --- | --- |
| `length()` | Cantidad de caracteres |
| `charAt(i)` | El carácter en la posición `i` |
| `substring(d, h)` | El fragmento de `d` a `h - 1` |
| `indexOf(s)` / `lastIndexOf(s)` | Primera / última posición de `s`, o `-1` si no está |
| `contains(s)` | `true` si `s` aparece en la cadena |
| `startsWith(s)` / `endsWith(s)` | `true` si empieza / termina con `s` |
| `toUpperCase()` / `toLowerCase()` | Una copia en mayúsculas / minúsculas |
| `trim()` / `strip()` | Una copia sin espacios en los extremos |
| `isEmpty()` / `isBlank()` | Si mide 0 / si solo tiene espacios |
| `replace(a, b)` | Una copia con `a` reemplazado por `b` |
| `split(regex)` | Un `String[]` partido por el separador |
| `String.join(sep, partes)` | Une varias cadenas con un separador |
| `repeat(n)` | La cadena repetida `n` veces |
| `toCharArray()` | Un `char[]` con los caracteres |

```java
String texto = "  Aprendiendo Java en 2026  ";

System.out.println(texto.length());              // 28
System.out.println(texto.trim());                // "Aprendiendo Java en 2026"
System.out.println(texto.toUpperCase());         // "  APRENDIENDO JAVA EN 2026  "
System.out.println(texto.contains("Java"));      // true
System.out.println(texto.indexOf("Java"));       // 14
System.out.println(texto.substring(14, 18));     // "Java"
System.out.println(texto.replace("2026", "2027"));

// Partir y volver a unir
String csv = "Buenos Aires,Neuquén,Córdoba,Salta";
String[] provincias = csv.split(",");
System.out.println(provincias.length);           // 4
System.out.println(String.join(" | ", provincias));

// Recorrer carácter por carácter
String palabra = "Java";
for (int i = 0; i < palabra.length(); i++) {
    System.out.println(i + ": " + palabra.charAt(i));
}
for (char c : palabra.toCharArray()) {
    System.out.println(c);
}
```

### `trim()` vs `strip()`, `isEmpty()` vs `isBlank()`

```java
String s = "      ";

System.out.println(s.isEmpty());   // false — tiene 6 caracteres
System.out.println(s.isBlank());   // true  — todos son espacios en blanco
```

`strip()` (Java 11+) es la versión moderna de `trim()`: entiende el rango completo de espacios Unicode, mientras que `trim()` solo elimina caracteres por debajo de `U+0020`. En código nuevo, usá `strip()` e `isBlank()`.

### Formatear e interpolar

```java
String nombre = "Laura";
double promedio = 8.457;

// Concatenación simple
System.out.println("Alumna: " + nombre + " — promedio " + promedio);

// formatted / String.format: control sobre decimales y ancho
System.out.println("Alumna: %s — promedio %.2f".formatted(nombre, promedio));
// Alumna: Laura — promedio 8,46

// Bloques de texto (Java 15+): saltos de línea sin escapes
String json = """
        {
          "nombre": "Laura",
          "promedio": 8.46
        }
        """;
```

---

## 11. `StringBuilder`: cuándo la inmutabilidad se vuelve cara

La inmutabilidad tiene un precio, y se paga dentro de los bucles. Cada `+=` sobre un `String` crea un objeto nuevo y copia todo lo acumulado hasta ese momento.

<figure class="diagram">
<svg viewBox="0 0 720 318" role="img" aria-labelledby="d-sb-t">
<title id="d-sb-t">Concatenar Strings en un bucle copia todo en cada vuelta; StringBuilder reutiliza un único buffer</title>
<rect x="0" y="40" width="340" height="232" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="20" y="68" font-size="14" font-weight="700" fill="var(--color-accent-700)">resultado += i;</text>
<text x="20" y="88" font-size="11.5" fill="var(--color-neutral-800)">un objeto nuevo por vuelta</text>
<rect x="20" y="98" width="60" height="24" rx="8" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="90" y="115" font-size="11.5" fill="var(--color-neutral-800)">vuelta 1 — copia 1 carácter</text>
<rect x="20" y="128" width="110" height="24" rx="8" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="140" y="145" font-size="11.5" fill="var(--color-neutral-800)">vuelta 2 — copia 2</text>
<rect x="20" y="158" width="160" height="24" rx="8" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="190" y="175" font-size="11.5" fill="var(--color-neutral-800)">vuelta 3 — copia 3</text>
<rect x="20" y="188" width="210" height="24" rx="8" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="240" y="205" font-size="11.5" fill="var(--color-neutral-800)">vuelta 4 — copia 4</text>
<text x="20" y="234" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">… y así 996 veces más</text>
<text x="20" y="256" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">1000 objetos y ~500.000 copias</text>
<rect x="380" y="40" width="340" height="232" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="400" y="68" font-size="14" font-weight="700" fill="var(--color-accent-2-800)">sb.append(i);</text>
<text x="400" y="88" font-size="11.5" fill="var(--color-neutral-800)">un único buffer mutable que se rellena</text>
<rect x="400" y="98" width="290" height="42" rx="12" fill="var(--color-bg)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<rect x="404" y="102" width="120" height="34" rx="9" fill="var(--color-accent-2-600)"/>
<text x="464" y="124" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">usado</text>
<text x="610" y="124" font-size="12" text-anchor="middle" fill="var(--color-neutral-800)">libre</text>
<text x="400" y="166" font-size="11.5" fill="var(--color-neutral-800)">cuando se llena, duplica la capacidad:</text>
<rect x="400" y="176" width="66" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="433" y="194" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">16</text>
<rect x="476" y="176" width="66" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="509" y="194" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">32</text>
<rect x="552" y="176" width="66" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="585" y="194" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">64</text>
<rect x="628" y="176" width="62" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="659" y="194" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">128</text>
<text x="400" y="234" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">solo se copia al redimensionar</text>
<text x="400" y="256" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">1 objeto y ~7 redimensionamientos</text>
<text x="2" y="294" font-size="12.5" fill="var(--color-text)">Con 1.000 vueltas la diferencia se mide en milisegundos; con 100.000, en minutos contra milisegundos.</text>
<text x="2" y="312" font-size="12" fill="var(--color-neutral-700)">El costo del bucle izquierdo crece con el cuadrado del número de vueltas; el del derecho crece de forma proporcional.</text>
</svg>
<figcaption>La diferencia no es de estilo: es de orden de magnitud. Concatenar en bucle copia toda la cadena acumulada en cada vuelta; <code>StringBuilder</code> escribe en un buffer y solo copia cuando se le agota la capacidad.</figcaption>
</figure>

```java
// INEFICIENTE: 1000 objetos temporales y medio millón de caracteres copiados
String resultado = "";
for (int i = 0; i < 1000; i++) {
    resultado += i + ", ";
}

// EFICIENTE: un único buffer mutable
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(", ");
}
String resultadoEficiente = sb.toString();
```

### La API de `StringBuilder`

```java
StringBuilder sb = new StringBuilder("Hola");

sb.append(" mundo");            // "Hola mundo"
sb.insert(0, ">> ");            // ">> Hola mundo"
sb.replace(0, 3, "-- ");        // "-- Hola mundo"
sb.deleteCharAt(0);             // "- Hola mundo"
sb.reverse();                   // "odnum aloH -"
System.out.println(sb.length());
System.out.println(sb.toString());   // convertir a String al final

// Encadenamiento: cada método devuelve el mismo StringBuilder
String frase = new StringBuilder()
        .append("Java")
        .append(" ")
        .append(2026)
        .toString();
```

Si sabés más o menos cuánto texto vas a acumular, reservá la capacidad de entrada y te ahorrás todos los redimensionamientos: `new StringBuilder(4096)`.

### Cuándo NO hace falta `StringBuilder`

El compilador ya optimiza la concatenación dentro de **una sola expresión**. Esto está perfecto así:

```java
String mensaje = "Hola " + nombre + ", tenés " + cantidad + " mensajes";
```

El problema aparece únicamente cuando la concatenación ocurre **repetida a lo largo de varias iteraciones**, porque ahí el compilador no puede fusionarlas: cada vuelta es una expresión distinta.

### `StringBuilder` vs `StringBuffer`

Son la misma clase con la misma API. `StringBuffer` es la versión antigua y **sincronizada**: cada método es seguro entre hilos, y por eso es más lenta. Usá `StringBuilder` salvo que varios hilos vayan a escribir en el mismo buffer, cosa que casi nunca pasa.

---

## 12. Errores frecuentes

- **Confundir `length` con `length()`.** `array.length` es un atributo; `texto.length()` es un método.
- **Comparar cadenas con `==`.** Funciona con literales y falla con todo lo demás. Usá `.equals()`.
- **Olvidar asignar el resultado.** `texto.trim();` no hace nada; `texto = texto.trim();` sí.
- **Iterar hasta `<= length`.** El último índice válido es `length - 1`.
- **Usar `binarySearch` sin ordenar.** No falla: devuelve un resultado incorrecto en silencio.
- **Esperar que `Arrays.copyOf` clone los objetos.** Copia referencias, no objetos.
- **Imprimir una matriz con `toString`.** Para arrays anidados va `deepToString`.
- **Recorrer un `String[]` recién creado con `new`.** Todas sus casillas son `null` hasta que las llenes.
- **Concatenar dentro de un bucle largo.** Ahí `StringBuilder` no es una preferencia, es una necesidad.

---

## 13. Ejercicios prácticos guiados

### Ejercicio 1 — Verificador de palíndromos

Escribí un programa que reciba una cadena, ignore espacios y mayúsculas, y determine si se lee igual en los dos sentidos.

<details>
<summary>Ver solución sugerida</summary>

```java
public class VerificadorPalindromo {

    public static boolean esPalindromo(String texto) {
        if (texto == null) return false;

        // 1. Normalizar: sin espacios, todo en minúsculas
        String limpio = texto.replaceAll("\\s+", "").toLowerCase();

        // 2. Comparar desde los dos extremos hacia el centro
        int izq = 0;
        int der = limpio.length() - 1;
        while (izq < der) {
            if (limpio.charAt(izq) != limpio.charAt(der)) {
                return false;
            }
            izq++;
            der--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(esPalindromo("Neuquen"));            // true
        System.out.println(esPalindromo("Anita lava la tina")); // true
        System.out.println(esPalindromo("Java"));               // false
    }
}
```

La versión corta usa `StringBuilder`:

```java
String limpio = texto.replaceAll("\\s+", "").toLowerCase();
String invertido = new StringBuilder(limpio).reverse().toString();
boolean esPalindromo = limpio.equals(invertido);
```

Las dos son correctas, pero no cuestan lo mismo: la de los dos punteros no crea ninguna cadena nueva y corta apenas encuentra la primera diferencia; la de `StringBuilder` siempre recorre e invierte el texto completo. Con cadenas cortas da igual; con textos grandes, no.
</details>

### Ejercicio 2 — Estadísticas de un array

Dado un `int[]`, calculá el mínimo, el máximo y el promedio en **un solo recorrido**, sin usar `Arrays.sort`.

<details>
<summary>Ver solución sugerida</summary>

```java
public class Estadisticas {
    public static void main(String[] args) {
        int[] temperaturas = {18, 25, 12, 31, 22, 9, 27};

        if (temperaturas.length == 0) {
            System.out.println("El array está vacío");
            return;
        }

        // Arrancar con el primer elemento, nunca con 0:
        // si todos los valores fueran negativos, el máximo daría 0 y sería falso.
        int min = temperaturas[0];
        int max = temperaturas[0];
        long suma = 0;

        for (int t : temperaturas) {
            if (t < min) min = t;
            if (t > max) max = t;
            suma += t;
        }

        double promedio = (double) suma / temperaturas.length;

        System.out.println("Mínima: " + min);                       // 9
        System.out.println("Máxima: " + max);                       // 31
        System.out.println("Promedio: %.2f".formatted(promedio));   // 20,57
    }
}
```

Dos detalles que importan: inicializar `min` y `max` con `temperaturas[0]` en lugar de `0`, y el `(double)` antes de dividir —sin él, `suma / length` sería una división entera y perderías los decimales.
</details>

### Ejercicio 3 — Contar palabras y encontrar la más larga

Dado un texto, mostrá cuántas palabras tiene y cuál es la más larga.

<details>
<summary>Ver solución sugerida</summary>

```java
public class AnalizadorTexto {
    public static void main(String[] args) {
        String texto = "  Java  es un lenguaje   compilado e interpretado  ";

        // strip() saca los espacios de los extremos;
        // \\s+ parte por uno o más espacios, así los espacios dobles no generan
        // palabras vacías.
        String[] palabras = texto.strip().split("\\s+");

        String masLarga = "";
        for (String palabra : palabras) {
            if (palabra.length() > masLarga.length()) {
                masLarga = palabra;
            }
        }

        System.out.println("Palabras: " + palabras.length);        // 7
        System.out.println("Más larga: " + masLarga);              // interpretado

        // Reconstruir el texto normalizado
        System.out.println(String.join(" ", palabras));
    }
}
```

Si partieras con `split(" ")` en lugar de `split("\\s+")`, los espacios dobles producirían cadenas vacías y el conteo daría mal. Es el motivo por el que casi siempre conviene partir por la expresión regular.
</details>

### Ejercicio 4 — Transponer una matriz

Escribí un método que reciba una matriz rectangular de `int` y devuelva su transpuesta (filas por columnas).

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.Arrays;

public class Transponer {

    public static int[][] transponer(int[][] m) {
        int filas = m.length;
        int columnas = m[0].length;

        // La transpuesta invierte las dimensiones
        int[][] t = new int[columnas][filas];

        for (int i = 0; i < filas; i++) {
            for (int j = 0; j < columnas; j++) {
                t[j][i] = m[i][j];
            }
        }
        return t;
    }

    public static void main(String[] args) {
        int[][] original = {
            {1, 2, 3},
            {4, 5, 6}
        };

        System.out.println(Arrays.deepToString(original));
        // [[1, 2, 3], [4, 5, 6]]

        System.out.println(Arrays.deepToString(transponer(original)));
        // [[1, 4], [2, 5], [3, 6]]
    }
}
```

Fijate que el array de salida se declara `new int[columnas][filas]`, no `new int[filas][columnas]`: es el error más común de este ejercicio y se manifiesta como un `ArrayIndexOutOfBoundsException` apenas la matriz no es cuadrada.
</details>

---

## Para llevarte

- El array guarda sus elementos en un **bloque contiguo**: de ahí salen el índice desde 0, el acceso instantáneo y el tamaño fijo.
- `array.length` es atributo; `texto.length()` es método. El último índice válido siempre es `length - 1`.
- Un array no crece: crecer es **crear uno nuevo y copiar**. Eso es exactamente lo que `ArrayList` automatiza.
- Los arrays de objetos guardan **referencias**: `Arrays.copyOf` hace copia superficial, no profunda.
- Una matriz es un **array de arrays**. Sus filas son objetos independientes y pueden medir distinto.
- `Arrays` ya resuelve ordenar, buscar, copiar, rellenar y comparar. `binarySearch` exige ordenar primero.
- `String` es **inmutable**: ningún método lo modifica, todos devuelven una cadena nueva que hay que asignar.
- El **String Constant Pool** hace que `==` a veces parezca funcionar. El contenido se compara con `.equals()`, siempre.
- `StringBuilder` es obligatorio cuando concatenás **dentro de un bucle**; en una sola expresión el compilador ya lo resuelve por vos.
