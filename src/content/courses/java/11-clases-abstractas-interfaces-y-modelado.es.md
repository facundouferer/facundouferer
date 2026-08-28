---
course: 'java'
slug: '09-clases-abstractas-interfaces-y-modelado'
title: 'Clases Abstractas, Interfaces y Organización del Código'
description: 'Entendé cuándo usar una clase abstracta y cuándo una interfaz, implementá varios contratos a la vez, organizá tu código en paquetes y modelá asociación, agregación y composición.'
order: 10
lang: 'es'
published: true
---

# Clases Abstractas, Interfaces y Organización del Código

En la lección anterior, `Vehiculo` tenía un problema silencioso: nada impide escribir `new Vehiculo("Ford")`. Y un "vehículo genérico" no existe en el mundo real. Es un concepto, no una cosa.

Peor todavía: `Vehiculo.arrancar()` tuvo que inventar una implementación por defecto (`"El vehículo arranca."`) que ninguna subclase usa de verdad. Escribimos código solo para que compile.

Java tiene dos herramientas para resolver esto, y elegir mal entre ellas es una de las decisiones de diseño que más caro se paga:

- **Clase abstracta**: un molde **incompleto**. Trae estado y comportamiento ya resueltos, y deja huecos que la subclase está obligada a llenar.
- **Interfaz**: un **contrato puro**. No dice cómo se hace nada, solo qué tiene que saber hacer quien la firme.

---

## 1. Clases abstractas: moldes que no se pueden instanciar

<figure class="diagram">
<svg viewBox="0 0 720 400" role="img" aria-labelledby="d-abs-t">
<title id="d-abs-t">Comparación entre la anatomía de una clase abstracta y la de una interfaz</title>
<rect x="0" y="0" width="720" height="182" rx="20" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="24" y="30" font-size="14.5" font-weight="700" fill="var(--color-accent-2-700)">Clase abstracta — un molde incompleto</text>
<rect x="24" y="42" width="672" height="102" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="40" y="64" font-size="12" font-weight="700" fill="var(--color-text)">public abstract class Figura {</text>
<text x="52" y="86" font-size="12" fill="var(--color-text)">protected String nombre;</text>
<text x="360" y="86" font-size="11" fill="var(--color-accent-2-700)">← puede guardar ESTADO</text>
<text x="52" y="108" font-size="12" fill="var(--color-text)">public abstract double calcularArea();</text>
<text x="360" y="108" font-size="11" fill="var(--color-accent-2-700)">← sin cuerpo: obliga a la subclase</text>
<text x="52" y="130" font-size="12" fill="var(--color-text)">public void describir() { ... }</text>
<text x="360" y="130" font-size="11" fill="var(--color-accent-2-700)">← con cuerpo: se hereda tal cual</text>
<text x="24" y="166" font-size="12" fill="var(--color-neutral-800)">No se puede instanciar: new Figura() es error. Y una clase extiende SOLO UNA clase abstracta.</text>
<rect x="0" y="198" width="720" height="190" rx="20" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="24" y="228" font-size="14.5" font-weight="700" fill="var(--color-accent-700)">Interfaz — un contrato puro</text>
<rect x="24" y="240" width="672" height="116" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="40" y="262" font-size="12" font-weight="700" fill="var(--color-text)">public interface Dibujable {</text>
<text x="52" y="284" font-size="12" fill="var(--color-text)">int MAX_CAPAS = 10;</text>
<text x="360" y="284" font-size="11" fill="var(--color-accent-700)">← constante: public static final</text>
<text x="52" y="306" font-size="12" fill="var(--color-text)">void dibujar();</text>
<text x="360" y="306" font-size="11" fill="var(--color-accent-700)">← abstracto y público por defecto</text>
<text x="52" y="328" font-size="12" fill="var(--color-text)">default void resaltar() { ... }</text>
<text x="360" y="328" font-size="11" fill="var(--color-accent-700)">← implementación por defecto (Java 8+)</text>
<text x="52" y="350" font-size="12" fill="var(--color-text)">static Dibujable vacio() { ... }</text>
<text x="360" y="350" font-size="11" fill="var(--color-accent-700)">← utilidad de la propia interfaz</text>
<text x="24" y="378" font-size="12" fill="var(--color-neutral-800)">No guarda estado de instancia. Y una clase puede implementar TODAS las interfaces que quiera.</text>
</svg>
<figcaption>La clase abstracta aporta estado y código heredable; la interfaz aporta un contrato que cualquier clase puede firmar, sin importar de quién herede.</figcaption>
</figure>

Una clase marcada como `abstract` **no se puede instanciar**. Solo existe para ser extendida:

```java
public abstract class Figura {
    protected final String nombre;

    protected Figura(String nombre) {          // sí, las abstractas tienen constructor
        this.nombre = nombre;
    }

    // Método abstracto: sin cuerpo. Cada subclase DEBE implementarlo.
    public abstract double calcularArea();
    public abstract double calcularPerimetro();

    // Método concreto: ya resuelto, se hereda tal cual.
    public void describir() {
        System.out.printf("%s → área %.2f, perímetro %.2f%n",
            nombre, calcularArea(), calcularPerimetro());
    }
}
```

Mirá bien `describir()`, porque ahí está la gracia del asunto: **llama a dos métodos que todavía no existen**. La clase abstracta escribe el algoritmo general una sola vez y delega los pasos concretos en quien la extienda.

```java
public class Circulo extends Figura {
    private final double radio;

    public Circulo(double radio) {
        super("Círculo");
        if (radio <= 0) throw new IllegalArgumentException("El radio debe ser positivo");
        this.radio = radio;
    }

    @Override
    public double calcularArea() { return Math.PI * radio * radio; }

    @Override
    public double calcularPerimetro() { return 2 * Math.PI * radio; }
}

public class Rectangulo extends Figura {
    private final double base, altura;

    public Rectangulo(double base, double altura) {
        super("Rectángulo");
        this.base = base;
        this.altura = altura;
    }

    @Override
    public double calcularArea() { return base * altura; }

    @Override
    public double calcularPerimetro() { return 2 * (base + altura); }
}
```

Y ahora `new Figura(...)` ni siquiera compila. **El compilador dejó de permitir el objeto que no tenía sentido.** Eso es exactamente lo que buscábamos.

```java
// Figura f = new Figura("algo");   // ERROR: Figura is abstract; cannot be instantiated

List<Figura> figuras = List.of(new Circulo(3), new Rectangulo(4, 5));
for (Figura f : figuras) {
    f.describir();   // polimorfismo, igual que en la lección anterior
}
```

> Si una subclase **no implementa** todos los métodos abstractos que hereda, tiene que declararse `abstract` ella también. Java no te deja tener una clase concreta con huecos.

---

## 2. Interfaces: contratos que cualquiera puede firmar

Una interfaz describe **qué se puede hacer**, nunca cómo:

```java
public interface Pagable {
    // Todos los métodos son public abstract por defecto: no hace falta escribirlo
    void pagar(double monto);
    boolean estaDisponible();
}
```

Cualquier clase puede firmarlo con `implements`, y el compilador la obliga a cumplirlo entero:

```java
public class TarjetaCredito implements Pagable {
    private final String numero;
    private double limiteDisponible;

    public TarjetaCredito(String numero, double limiteDisponible) {
        this.numero = numero;
        this.limiteDisponible = limiteDisponible;
    }

    @Override
    public void pagar(double monto) {
        if (monto > limiteDisponible) {
            throw new IllegalStateException("Límite insuficiente");
        }
        limiteDisponible -= monto;
        System.out.println("Pagado con tarjeta " + numero);
    }

    @Override
    public boolean estaDisponible() { return limiteDisponible > 0; }
}
```

Lo importante: `TarjetaCredito` no hereda de nadie. **La interfaz no consume el único `extends` que tenés.** Esa es su ventaja decisiva.

### Métodos `default` y `static`

Desde Java 8 una interfaz puede traer implementaciones:

```java
public interface Pagable {
    void pagar(double monto);
    boolean estaDisponible();

    // default: implementación heredable que las clases pueden sobrescribir o no
    default void pagarSiPuede(double monto) {
        if (estaDisponible()) {
            pagar(monto);
        } else {
            System.out.println("Medio de pago no disponible.");
        }
    }

    // static: utilidad que pertenece a la interfaz, no a las clases
    static boolean esMontoValido(double monto) {
        return monto > 0 && monto < 1_000_000;
    }
}
```

Los `default` existen por una razón muy concreta: **permiten agregar un método nuevo a una interfaz sin romper las mil clases que ya la implementaban**. Antes de Java 8, agregar un método a una interfaz pública rompía todo el ecosistema que dependía de ella.

Úsalos con moderación. Una interfaz llena de `default` deja de ser un contrato y empieza a ser una clase abstracta mal disfrazada.

---

## 3. Implementar varias interfaces a la vez

Acá se ve por qué las interfaces no son simplemente "clases abstractas sin código":

<figure class="diagram">
<svg viewBox="0 0 720 320" role="img" aria-labelledby="d-impl-t">
<title id="d-impl-t">Una clase extiende una sola clase abstracta pero implementa varias interfaces</title>
<defs><marker id="uml-i" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--color-neutral-100)" stroke="var(--color-accent-700)" stroke-width="1.5"/></marker></defs>
<rect x="0" y="24" width="200" height="80" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="100" y="46" font-size="10.5" text-anchor="middle" fill="var(--color-accent-2-800)">«abstract class»</text>
<text x="100" y="70" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Ave</text>
<text x="100" y="92" font-size="11.5" text-anchor="middle" fill="var(--color-text)">comer(), plumaje</text>
<rect x="260" y="24" width="190" height="80" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="355" y="46" font-size="10.5" text-anchor="middle" fill="var(--color-accent-700)">«interface»</text>
<text x="355" y="70" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Nadable</text>
<text x="355" y="92" font-size="11.5" text-anchor="middle" fill="var(--color-text)">nadar()</text>
<rect x="510" y="24" width="210" height="80" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="615" y="46" font-size="10.5" text-anchor="middle" fill="var(--color-accent-700)">«interface»</text>
<text x="615" y="70" font-size="15" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Volable</text>
<text x="615" y="92" font-size="11.5" text-anchor="middle" fill="var(--color-text)">volar(), altitudMaxima()</text>
<path d="M285 206 L285 158 L100 158 L100 108" fill="none" stroke="var(--color-accent-2-700)" stroke-width="1.8" marker-end="url(#uml-i)"/>
<path d="M360 206 L360 108" fill="none" stroke="var(--color-accent)" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#uml-i)"/>
<path d="M435 206 L435 158 L615 158 L615 108" fill="none" stroke="var(--color-accent)" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#uml-i)"/>
<text x="150" y="150" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">extends (línea llena, solo una)</text>
<text x="450" y="150" font-size="11" font-weight="700" fill="var(--color-accent-700)">implements (punteada, las que quieras)</text>
<rect x="200" y="206" width="320" height="82" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="360" y="232" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-text)">Pato</text>
<text x="360" y="254" font-size="11.5" text-anchor="middle" fill="var(--color-neutral-800)">extends Ave implements Nadable, Volable</text>
<text x="360" y="274" font-size="11.5" text-anchor="middle" fill="var(--color-accent-700)">hereda comer(); implementa nadar() y volar()</text>
<text x="0" y="312" font-size="12" fill="var(--color-neutral-700)">Java no tiene herencia múltiple de clases, pero un objeto sí puede cumplir todos los contratos que necesite.</text>
</svg>
<figcaption>Una sola línea de herencia, muchos contratos. Por eso las interfaces son la herramienta para combinar capacidades que no comparten un ancestro.</figcaption>
</figure>

```java
public class Pato extends Ave implements Nadable, Volable {
    @Override public void nadar() { System.out.println("El pato nada."); }
    @Override public void volar() { System.out.println("El pato vuela."); }
}
```

Y ahora un mismo objeto puede verse desde ángulos distintos según lo que necesite cada método:

```java
Pato pato = new Pato();

Ave a = pato;        // como ave
Nadable n = pato;    // como algo que nada
Volable v = pato;    // como algo que vuela

// Un método que solo necesita que algo nade, no necesita saber que es un pato:
public void competenciaDeNatacion(List<Nadable> participantes) {
    for (Nadable participante : participantes) {
        participante.nadar();
    }
}
```

En esa lista pueden convivir un `Pato`, un `Pez` y un `Submarino`, tres clases que no comparten absolutamente ningún ancestro. **La interfaz es lo único que tienen en común, y alcanza.**

---

## 4. Cuál elegir

| Criterio | Clase abstracta | Interfaz |
| --- | --- | --- |
| Relación que expresa | **"es un"** — comparten identidad | **"es capaz de"** — comparten una capacidad |
| Cuántas se pueden usar | Solo una (`extends`) | Todas las que quieras (`implements`) |
| Estado de instancia | Sí, campos normales | No, solo constantes `static final` |
| Constructores | Sí | No |
| Visibilidad de los métodos | Cualquiera, incluida `protected` | Siempre `public` |
| Agregar un método después | Rompe las subclases si es abstracto | No rompe nada si es `default` |

La regla práctica que funciona en el 90 % de los casos:

> **Interfaz por defecto. Clase abstracta solo cuando hay estado o código realmente compartido que no querés repetir.**

Y las dos se combinan sin problema, que es el patrón más habitual en las librerías serias:

```java
public interface Repositorio<T> {
    void guardar(T entidad);
    Optional<T> buscarPorId(long id);
}

// Base abstracta que resuelve lo repetitivo para cualquier repositorio
public abstract class RepositorioEnMemoria<T> implements Repositorio<T> {
    protected final Map<Long, T> almacen = new HashMap<>();

    @Override
    public Optional<T> buscarPorId(long id) {
        return Optional.ofNullable(almacen.get(id));
    }
    // guardar() queda abstracto: cada entidad sabe cómo obtener su propio id
}
```

---

## 5. Organización: paquetes

Un **paquete** es una carpeta con un nombre calificado. Sirve para agrupar clases relacionadas, evitar choques de nombres y controlar la visibilidad (acordate del `package-private` de la lección 8).

<figure class="diagram">
<svg viewBox="0 0 720 290" role="img" aria-labelledby="d-pkg-t">
<title id="d-pkg-t">Estructura de paquetes de un proyecto y su correspondencia con la declaración package</title>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">La ruta de carpetas y la declaración package tienen que coincidir. Siempre.</text>
<rect x="0" y="34" width="390" height="228" rx="18" fill="var(--color-accent-100)" stroke="var(--color-accent-400)"/>
<text x="18" y="58" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">com.facundouferer.tienda</text>
<rect x="18" y="70" width="354" height="52" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="92" font-size="12" font-weight="700" fill="var(--color-text)">dominio</text>
<text x="34" y="111" font-size="11" fill="var(--color-neutral-700)">Producto.java · Cliente.java · Pedido.java</text>
<rect x="18" y="130" width="354" height="52" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="152" font-size="12" font-weight="700" fill="var(--color-text)">servicio</text>
<text x="34" y="171" font-size="11" fill="var(--color-neutral-700)">CarritoServicio.java · PagoServicio.java</text>
<rect x="18" y="190" width="354" height="52" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="212" font-size="12" font-weight="700" fill="var(--color-text)">Main.java</text>
<text x="34" y="231" font-size="11" fill="var(--color-neutral-700)">el punto de entrada de la aplicación</text>
<text x="406" y="58" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">package com.facundouferer.tienda.dominio;</text>
<text x="406" y="78" font-size="11.5" fill="var(--color-neutral-800)">Primera línea de cada archivo. Si no coincide con</text>
<text x="406" y="96" font-size="11.5" fill="var(--color-neutral-800)">la ruta real, no compila.</text>
<text x="406" y="130" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">import ...tienda.dominio.Producto;</text>
<text x="406" y="150" font-size="11.5" fill="var(--color-neutral-800)">Necesario para usar una clase de otro paquete.</text>
<text x="406" y="168" font-size="11.5" fill="var(--color-neutral-800)">Dentro del mismo paquete no hace falta.</text>
<text x="406" y="202" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">Convención: tu dominio al revés.</text>
<text x="406" y="222" font-size="11.5" fill="var(--color-neutral-800)">facundouferer.ar → com.facundouferer</text>
<text x="406" y="240" font-size="11.5" fill="var(--color-neutral-800)">Así dos librerías distintas nunca chocan.</text>
<text x="0" y="284" font-size="12" fill="var(--color-neutral-700)">Agrupá por responsabilidad (dominio, servicio, repositorio), no por tipo de artefacto (todas las interfaces juntas).</text>
</svg>
<figcaption>Los paquetes son la primera línea de arquitectura de un proyecto: el nombre de la carpeta ya cuenta qué hace lo que hay adentro.</figcaption>
</figure>

```java
package com.facundouferer.tienda.dominio;   // primera línea, obligatoria

public class Producto { ... }
```

Reglas que conviene fijar desde el primer día:

- Todo en **minúsculas**, sin guiones ni tildes.
- El nombre arranca con **tu dominio al revés** (`com.facundouferer`), para que nunca choque con una librería de terceros.
- **Un archivo `.java` por clase pública**, y el archivo se llama igual que la clase.
- Agrupá por **responsabilidad**, no por tipo de artefacto. `tienda.dominio` y `tienda.servicio` es mucho mejor que `tienda.interfaces` y `tienda.clases`.

---

## 6. Modelar relaciones: asociación, agregación y composición

Heredar no es la única forma de conectar clases, ni la más frecuente. En la práctica, la mayoría de las relaciones son de **contención**, y se distinguen por una sola pregunta: **¿qué pasa con la parte cuando desaparece el todo?**

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-rel-t">
<title id="d-rel-t">Asociación, agregación y composición ordenadas de la relación más débil a la más fuerte</title>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">Las tres formas de relacionar objetos, de la más débil a la más fuerte</text>
<rect x="0" y="34" width="150" height="54" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="75" y="66" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Profesor</text>
<line x1="152" y1="61" x2="248" y2="61" stroke="var(--color-neutral-600)" stroke-width="2"/>
<rect x="250" y="34" width="150" height="54" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="325" y="66" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Curso</text>
<text x="424" y="56" font-size="12" font-weight="700" fill="var(--color-neutral-800)">Asociación — se conocen y colaboran,</text>
<text x="424" y="74" font-size="12" fill="var(--color-neutral-800)">pero cada uno vive por su cuenta.</text>
<rect x="0" y="122" width="150" height="54" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="75" y="154" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Equipo</text>
<path d="M152 149 L172 139 L192 149 L172 159 z" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<line x1="192" y1="149" x2="248" y2="149" stroke="var(--color-accent-2-700)" stroke-width="2"/>
<rect x="250" y="122" width="150" height="54" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="325" y="154" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Jugador</text>
<text x="424" y="144" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">Agregación — el todo agrupa partes que</text>
<text x="424" y="162" font-size="12" fill="var(--color-neutral-800)">ya existían. Si se disuelve, ellas siguen.</text>
<rect x="0" y="210" width="150" height="54" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="75" y="242" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Casa</text>
<path d="M152 237 L172 227 L192 237 L172 247 z" fill="var(--color-accent-700)" stroke="var(--color-accent-700)" stroke-width="1.8"/>
<line x1="192" y1="237" x2="248" y2="237" stroke="var(--color-accent-700)" stroke-width="2"/>
<rect x="250" y="210" width="150" height="54" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="325" y="242" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Habitación</text>
<text x="424" y="232" font-size="12" font-weight="700" fill="var(--color-accent-700)">Composición — la parte no existe sin el</text>
<text x="424" y="250" font-size="12" fill="var(--color-neutral-800)">todo. Se demuele la casa, se va con ella.</text>
<text x="0" y="292" font-size="12" fill="var(--color-neutral-700)">Rombo hueco: la parte sobrevive. Rombo lleno: la parte muere con el todo, y el todo la crea en su constructor.</text>
</svg>
<figcaption>La pregunta que decide cuál es cuál: si destruyo el objeto contenedor, ¿la parte sigue teniendo sentido por sí sola?</figcaption>
</figure>

```java
// ASOCIACIÓN: se conocen, ninguno es dueño del otro
public class Profesor {
    private List<Curso> cursos = new ArrayList<>();
    public void asignar(Curso c) { cursos.add(c); }
}

// AGREGACIÓN: el equipo recibe jugadores que ya existían y les sobrevive
public class Equipo {
    private final List<Jugador> jugadores;

    public Equipo(List<Jugador> jugadores) {
        this.jugadores = new ArrayList<>(jugadores);   // copia defensiva, lección 8
    }
}

// COMPOSICIÓN: la casa CREA sus habitaciones y no las suelta nunca
public class Casa {
    private final List<Habitacion> habitaciones = new ArrayList<>();

    public Casa(int cantidadHabitaciones) {
        for (int i = 0; i < cantidadHabitaciones; i++) {
            habitaciones.add(new Habitacion(i + 1));   // las crea acá adentro
        }
    }

    public int cantidadHabitaciones() { return habitaciones.size(); }
    // No hay getHabitaciones(): nadie de afuera toca las partes
}
```

Fijate el patrón en el código: en la **composición**, el contenedor crea las partes en su propio constructor y **no las expone**. En la **agregación**, las recibe de afuera. Esa diferencia en el código es exactamente la diferencia conceptual.

---

## 7. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| Usar clase abstracta donde va una interfaz | Se gasta el único `extends` disponible y la clase ya no puede heredar de lo que realmente necesita. | Empezar siempre por la interfaz; agregar clase abstracta solo si hay estado compartido. |
| Interfaz con un `default` para cada método | Deja de ser un contrato y pasa a ser una clase abstracta sin constructor ni estado. | Los `default` son para evolucionar la interfaz sin romper implementaciones, no para escribir lógica. |
| Declarar campos mutables en una interfaz | Todo campo en una interfaz es `public static final`: es una constante global compartida, no estado del objeto. | Si necesitás estado, necesitás una clase (abstracta o no). |
| Paquete que no coincide con la carpeta | Error de compilación confuso sobre clases que "no existen". | La declaración `package` tiene que reflejar la ruta exacta. |
| Modelar como agregación algo que es composición | La parte queda expuesta y alguien de afuera la modifica o la comparte entre dos contenedores. | Si la parte no vive sin el todo: crearla adentro y no exponerla. |
| Un solo paquete gigante con todas las clases | El `package-private` deja de proteger nada y no se entiende la arquitectura. | Separar por responsabilidad desde el primer día. |

---

## 8. Ejercicio práctico guiado

### Desafío: medios de pago

1. Definí la interfaz `Pagable` con `void pagar(double monto)`, `boolean estaDisponible()` y un método `default` `pagarSiPuede(double monto)` que solo cobre si el medio está disponible.
2. Implementala en `TarjetaCredito` (con límite disponible) y en `MercadoPago` (con saldo en cuenta).
3. Creá una clase abstracta `MedioDePagoDigital implements Pagable` que guarde el `email` del titular y resuelva `estaDisponible()` con un campo `activo`, dejando `pagar()` abstracto.
4. Hacé que `MercadoPago` extienda esa clase abstracta.
5. En el `main`, armá una `List<Pagable>` y cobrá el mismo monto a todos con un solo bucle, sin `instanceof` y sin castear.

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.List;

public interface Pagable {
    void pagar(double monto);
    boolean estaDisponible();

    default void pagarSiPuede(double monto) {
        if (monto <= 0) {
            throw new IllegalArgumentException("El monto debe ser positivo");
        }
        if (estaDisponible()) {
            pagar(monto);
        } else {
            System.out.println("  ✗ Medio no disponible, se omite el cobro.");
        }
    }
}

// Clase abstracta: aporta el ESTADO y el comportamiento compartido.
public abstract class MedioDePagoDigital implements Pagable {
    protected final String email;
    protected boolean activo;

    protected MedioDePagoDigital(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }
        this.email = email;
        this.activo = true;
    }

    @Override
    public boolean estaDisponible() {
        return activo;
    }

    public void desactivar() { this.activo = false; }

    // pagar() sigue abstracto: cada medio digital cobra a su manera.
}

public class MercadoPago extends MedioDePagoDigital {
    private double saldo;

    public MercadoPago(String email, double saldo) {
        super(email);
        this.saldo = saldo;
    }

    @Override
    public boolean estaDisponible() {
        return super.estaDisponible() && saldo > 0;   // reutiliza y refina
    }

    @Override
    public void pagar(double monto) {
        if (monto > saldo) throw new IllegalStateException("Saldo insuficiente");
        saldo -= monto;
        System.out.printf("  ✓ MercadoPago (%s) — saldo restante $%.2f%n", email, saldo);
    }
}

// No hereda de nadie: solo firma el contrato.
public class TarjetaCredito implements Pagable {
    private final String ultimosCuatro;
    private double limiteDisponible;

    public TarjetaCredito(String ultimosCuatro, double limiteDisponible) {
        this.ultimosCuatro = ultimosCuatro;
        this.limiteDisponible = limiteDisponible;
    }

    @Override
    public boolean estaDisponible() { return limiteDisponible > 0; }

    @Override
    public void pagar(double monto) {
        if (monto > limiteDisponible) throw new IllegalStateException("Límite insuficiente");
        limiteDisponible -= monto;
        System.out.printf("  ✓ Tarjeta ****%s — límite restante $%.2f%n",
            ultimosCuatro, limiteDisponible);
    }
}

public class MainCobros {
    public static void main(String[] args) {
        MercadoPago mpVacio = new MercadoPago("vacio@mail.com", 0);

        List<Pagable> medios = List.of(
            new TarjetaCredito("4417", 50000),
            new MercadoPago("facu@mail.com", 30000),
            mpVacio                                   // sin saldo: se va a omitir
        );

        System.out.println("Cobrando $12.500 a cada medio:");
        for (Pagable medio : medios) {
            medio.pagarSiPuede(12500);   // el default decide; nadie pregunta el tipo
        }
    }
}
```

**Dos cosas para mirar acá.**

La primera: `TarjetaCredito` y `MercadoPago` no comparten ningún ancestro, y aun así conviven en la misma `List<Pagable>`. La interfaz fue suficiente.

La segunda: `MercadoPago.estaDisponible()` llama a `super.estaDisponible()` y le suma su propia condición. Reutiliza la regla de la clase abstracta en lugar de repetirla, exactamente el mismo patrón que usaste con `super.calcularSalario()` en la lección anterior.

</details>

---

## Para llevarte

- Una **clase abstracta** es un molde incompleto: aporta estado y código, obliga a llenar los huecos y no se puede instanciar.
- Una **interfaz** es un contrato: dice qué se sabe hacer, no cómo, y no consume tu único `extends`.
- Regla práctica: **empezá por la interfaz**; agregá una clase abstracta solo cuando haya estado o lógica realmente compartida.
- Los métodos `default` existen para hacer evolucionar una interfaz sin romper a quienes ya la implementaban.
- Una clase extiende una sola clase, pero implementa todas las interfaces que necesite. Esa es la salida de Java a la herencia múltiple.
- El `package` tiene que coincidir con la carpeta, y conviene agrupar por **responsabilidad**, no por tipo de artefacto.
- Asociación, agregación y composición se distinguen con una sola pregunta: si destruyo el todo, ¿la parte sigue existiendo?
</content>
