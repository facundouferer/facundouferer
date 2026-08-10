---
course: 'java'
slug: '08-herencia-polimorfismo-y-sobrecarga'
title: 'Herencia, Polimorfismo y Sobrecarga de Métodos'
description: 'Dominá la herencia con extends y super, la sobrescritura con @Override, la diferencia entre sobrecarga y sobrescritura, el despacho dinámico y cuándo conviene componer en lugar de heredar.'
order: 9
lang: 'es'
published: true
---

# Herencia, Polimorfismo y Sobrecarga de Métodos

Hasta ahora cada clase que escribiste vivía sola. Pero en cualquier sistema real vas a encontrarte con clases que comparten buena parte de su estado y su comportamiento: un `Auto`, una `Moto` y un `Camión` tienen marca, arrancan y frenan.

Copiar y pegar esos atributos en las tres clases funciona hasta el día en que cambia una regla. Ahí tenés que acordarte de los tres lugares. Ya sabés cómo termina eso.

La **herencia** resuelve ese problema, y el **polimorfismo** —que es su consecuencia, no un tema aparte— es lo que hace que valga la pena. Esta lección trata las dos cosas juntas, porque separadas no se entienden.

---

## 1. Herencia: `extends` y la prueba del "es un"

Una clase puede **extender** a otra y recibir automáticamente todos sus atributos y métodos:

```java
public class Vehiculo {
    protected String marca;

    public Vehiculo(String marca) {
        this.marca = marca;
    }

    public void arrancar() {
        System.out.println("El vehículo arranca.");
    }

    public void frenar() {
        System.out.println("El vehículo frena.");
    }
}

public class Auto extends Vehiculo {
    public Auto(String marca) {
        super(marca);
    }

    @Override
    public void arrancar() {
        System.out.println("Auto " + marca + " arrancando con botón.");
    }

    public void abrirBaul() {
        System.out.println("Baúl abierto.");
    }
}
```

`Auto` no declara `marca` ni `frenar()`, pero los tiene. Los heredó.

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-herencia-t">
<title id="d-herencia-t">Jerarquía de herencia: una superclase Vehículo y tres subclases</title>
<defs><marker id="uml-gen" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="11" markerHeight="11" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="var(--color-neutral-100)" stroke="var(--color-accent-700)" stroke-width="1.5"/></marker></defs>
<rect x="210" y="10" width="300" height="102" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="38" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Vehículo</text>
<text x="360" y="60" font-size="12" text-anchor="middle" fill="var(--color-text)">protected String marca;</text>
<text x="360" y="80" font-size="12" text-anchor="middle" fill="var(--color-text)">public void arrancar()</text>
<text x="360" y="100" font-size="12" text-anchor="middle" fill="var(--color-text)">public void frenar()</text>
<path d="M360 155 L360 116" fill="none" stroke="var(--color-accent-700)" stroke-width="1.8" marker-end="url(#uml-gen)"/>
<line x1="105" y1="155" x2="615" y2="155" stroke="var(--color-accent-700)" stroke-width="1.8"/>
<line x1="105" y1="155" x2="105" y2="200" stroke="var(--color-accent-700)" stroke-width="1.8"/>
<line x1="360" y1="155" x2="360" y2="200" stroke="var(--color-accent-700)" stroke-width="1.8"/>
<line x1="615" y1="155" x2="615" y2="200" stroke="var(--color-accent-700)" stroke-width="1.8"/>
<rect x="0" y="200" width="210" height="104" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="18" y="226" font-size="13.5" font-weight="700" fill="var(--color-text)">Auto</text>
<text x="18" y="252" font-size="11.5" fill="var(--color-neutral-700)">hereda: marca, frenar()</text>
<text x="18" y="272" font-size="11.5" fill="var(--color-accent-700)">@Override arrancar()</text>
<text x="18" y="292" font-size="11.5" fill="var(--color-text)">+ abrirBaul()</text>
<rect x="255" y="200" width="210" height="104" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="273" y="226" font-size="13.5" font-weight="700" fill="var(--color-text)">Moto</text>
<text x="273" y="252" font-size="11.5" fill="var(--color-neutral-700)">hereda: marca, frenar()</text>
<text x="273" y="272" font-size="11.5" fill="var(--color-accent-700)">@Override arrancar()</text>
<text x="273" y="292" font-size="11.5" fill="var(--color-text)">+ hacerCaballito()</text>
<rect x="510" y="200" width="210" height="104" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="528" y="226" font-size="13.5" font-weight="700" fill="var(--color-text)">Camión</text>
<text x="528" y="252" font-size="11.5" fill="var(--color-neutral-700)">hereda: marca, arrancar()</text>
<text x="528" y="272" font-size="11.5" fill="var(--color-accent-700)">@Override frenar()</text>
<text x="528" y="292" font-size="11.5" fill="var(--color-text)">+ cargar(kg)</text>
<text x="0" y="330" font-size="12" fill="var(--color-neutral-700)">Cada subclase recibe todo lo de Vehículo y solo redefine lo que necesita cambiar. La flecha apunta al padre.</text>
</svg>
<figcaption>La herencia va de lo general a lo específico. Lo que está arriba lo tienen todos; lo que está abajo es lo propio de cada uno.</figcaption>
</figure>

### La prueba antes de escribir `extends`

Antes de heredar, hacete esta pregunta en voz alta: **"¿un X *es un* Y?"**

- Un `Auto` **es un** `Vehiculo`. ✔ Herencia correcta.
- Un `Auto` **es un** `Motor`. ✘ Un auto **tiene** un motor. Eso es composición, no herencia.

Si la frase suena rara, la herencia está mal. Y una herencia mal puesta no se nota el primer día: se nota seis meses después, cuando la subclase hereda cinco métodos que no tienen ningún sentido en ella.

> Java tiene **herencia simple**: una clase extiende a una sola clase. No existe `extends A, B`. Para combinar comportamientos de varios orígenes están las interfaces, que vas a ver en la lección siguiente.

---

## 2. `super`: la cadena de constructores

Acá está la parte que más confunde al principio. Cuando instanciás una subclase, **no se ejecuta un constructor: se ejecuta toda la cadena**, desde el ancestro más lejano hasta la clase concreta.

<figure class="diagram">
<svg viewBox="0 0 720 350" role="img" aria-labelledby="d-super-t">
<title id="d-super-t">Orden de ejecución de la cadena de constructores con super</title>
<defs><marker id="ar-up" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-dn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<text x="150" y="22" font-size="14" font-weight="700" fill="var(--color-accent-700)">Auto a = new Auto("Toyota");</text>
<line x1="128" y1="278" x2="128" y2="52" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-up)"/>
<text x="4" y="130" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">1. Primero suben</text>
<text x="4" y="148" font-size="11.5" fill="var(--color-neutral-800)">las llamadas a</text>
<text x="4" y="166" font-size="11.5" fill="var(--color-neutral-800)">super(...) hasta</text>
<text x="4" y="184" font-size="11.5" fill="var(--color-neutral-800)">llegar a Object.</text>
<rect x="150" y="40" width="430" height="66" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="170" y="66" font-size="13.5" font-weight="700" fill="var(--color-text)">Object()</text>
<text x="170" y="88" font-size="11.5" fill="var(--color-neutral-700)">La raíz implícita de toda clase Java. Se ejecuta primero.</text>
<rect x="150" y="132" width="430" height="66" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="170" y="158" font-size="13.5" font-weight="700" fill="var(--color-accent-2-800)">Vehiculo(String marca)</text>
<text x="170" y="180" font-size="11.5" fill="var(--color-neutral-800)">this.marca = marca;  →  el estado heredado ya queda listo.</text>
<rect x="150" y="224" width="430" height="66" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="170" y="250" font-size="13.5" font-weight="700" fill="var(--color-accent-700)">Auto(String marca)</text>
<text x="170" y="272" font-size="11.5" fill="var(--color-neutral-800)">El cuerpo propio de Auto corre ÚLTIMO, con todo lo de arriba listo.</text>
<line x1="602" y1="52" x2="602" y2="278" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-dn)"/>
<text x="620" y="130" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">2. Después se</text>
<text x="620" y="148" font-size="11.5" fill="var(--color-neutral-800)">ejecutan los</text>
<text x="620" y="166" font-size="11.5" fill="var(--color-neutral-800)">cuerpos, de</text>
<text x="620" y="184" font-size="11.5" fill="var(--color-neutral-800)">arriba hacia</text>
<text x="620" y="202" font-size="11.5" fill="var(--color-neutral-800)">abajo.</text>
<text x="0" y="332" font-size="12" fill="var(--color-neutral-700)">Cuando el cuerpo de Auto empieza a correr, la parte heredada del objeto ya está completamente inicializada.</text>
</svg>
<figcaption>La llamada sube y la ejecución baja. Por eso una subclase nunca trabaja sobre un estado heredado a medio construir.</figcaption>
</figure>

Tres reglas que el compilador aplica sin excepción:

1. **`super(...)` tiene que ser la primera sentencia del constructor.** Igual que `this(...)`, y por la misma razón: nada puede correr antes de que la parte heredada esté lista.
2. **Si no escribís `super(...)`, Java inserta `super()` sin argumentos automáticamente.**
3. **Si la superclase no tiene constructor sin argumentos, esa inserción automática falla** y el compilador te obliga a llamar explícitamente a uno que sí exista.

Este es el error más frecuente de toda la lección:

```java
public class Vehiculo {
    protected String marca;
    public Vehiculo(String marca) { this.marca = marca; }
    // Al escribir este constructor, Vehiculo dejó de tener uno sin argumentos
}

public class Auto extends Vehiculo {
    public Auto() {
        // ERROR: Java intenta insertar super() y Vehiculo no tiene ese constructor
    }
}
```

`super` también sirve para **llamar a la versión del padre de un método** que estás sobrescribiendo, algo muy común cuando querés extender el comportamiento en lugar de reemplazarlo:

```java
@Override
public void arrancar() {
    super.arrancar();                  // primero hace lo que hace todo vehículo
    System.out.println("...y activa el arranque sin llave.");
}
```

---

## 3. Sobrescritura: `@Override` y el contrato que no podés romper

**Sobrescribir** es redefinir en la subclase un método que ya existe en la superclase, con la **misma firma**: mismo nombre, mismos tipos de parámetros, en el mismo orden.

La anotación `@Override` no es obligatoria, pero **escribila siempre**. No cambia nada en tiempo de ejecución; lo que hace es pedirle al compilador que verifique que realmente estás sobrescribiendo algo:

```java
public class Auto extends Vehiculo {
    @Override
    public void arrancar(int velocidad) {   // ← ERROR de compilación, y eso es bueno
        ...
    }
}
```

Sin `@Override`, ese método compilaría perfecto. Java lo trataría como un método **nuevo** de `Auto` llamado `arrancar` que recibe un `int`, y el `arrancar()` original seguiría heredado sin cambios. Tu código correría, no haría lo que esperabas, y no habría ningún error para guiarte. `@Override` convierte un bug silencioso en un error de compilación.

### Qué puede y qué no puede cambiar la subclase

| Elemento | Regla al sobrescribir |
| --- | --- |
| Nombre y parámetros | Idénticos. Si cambian, ya no es sobrescritura sino un método nuevo. |
| Tipo de retorno | Igual, o un **subtipo** del original (retorno covariante). |
| Visibilidad | Igual o **más abierta**. Un método `public` no puede volverse `protected`. |
| Excepciones *checked* | Las mismas, menos, o subtipos. Nunca una más amplia. |
| Métodos `private`, `static` o `final` | No se pueden sobrescribir. |

La regla de la visibilidad tiene una lógica muy concreta: si alguien puede tratar a un `Auto` como un `Vehiculo`, y `Vehiculo.arrancar()` es público, entonces `arrancar()` tiene que seguir siendo invocable en el `Auto`. Cerrarlo rompería esa promesa.

---

## 4. Sobrecarga y sobrescritura: se parecen los nombres, no los conceptos

Estas dos palabras se confunden todo el tiempo, y la diferencia de fondo es **cuándo se decide qué método se ejecuta**.

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-over-t">
<title id="d-over-t">Diferencia entre sobrecarga, resuelta al compilar, y sobrescritura, resuelta al ejecutar</title>
<defs><marker id="ar-ov" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="0" width="720" height="150" rx="20" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="24" y="32" font-size="14.5" font-weight="700" fill="var(--color-neutral-800)">Sobrecarga (overloading) — la decide el COMPILADOR</text>
<text x="24" y="54" font-size="12" fill="var(--color-neutral-700)">Varios métodos distintos, con el mismo nombre, dentro de la misma clase:</text>
<rect x="24" y="66" width="205" height="42" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="126" y="92" font-size="12" text-anchor="middle" fill="var(--color-text)">imprimir(String t)</text>
<rect x="249" y="66" width="205" height="42" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="351" y="92" font-size="12" text-anchor="middle" fill="var(--color-text)">imprimir(int n)</text>
<rect x="474" y="66" width="222" height="42" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="585" y="92" font-size="12" text-anchor="middle" fill="var(--color-text)">imprimir(String t, int n)</text>
<text x="24" y="132" font-size="12" fill="var(--color-neutral-800)">Elige uno mirando los TIPOS de los argumentos que escribiste. Todo queda resuelto antes de ejecutar.</text>
<rect x="0" y="166" width="720" height="164" rx="20" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="24" y="198" font-size="14.5" font-weight="700" fill="var(--color-accent-2-700)">Sobrescritura (overriding) — la decide la JVM</text>
<text x="24" y="220" font-size="12" fill="var(--color-neutral-800)">Un mismo método, redefinido más abajo en la jerarquía:</text>
<rect x="24" y="232" width="280" height="46" rx="12" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="164" y="252" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">Vehiculo.arrancar()</text>
<text x="164" y="269" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">la versión general</text>
<line x1="312" y1="255" x2="380" y2="255" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-ov)"/>
<rect x="392" y="232" width="304" height="46" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="544" y="252" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Auto.arrancar()  @Override</text>
<text x="544" y="269" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">la versión que gana si el objeto es un Auto</text>
<text x="24" y="304" font-size="12" fill="var(--color-neutral-800)">Elige uno mirando el OBJETO real que hay en el Heap. Solo se sabe cuando el programa ya está corriendo.</text>
</svg>
<figcaption>Sobrecarga: misma clase, firmas distintas, decisión en tiempo de compilación. Sobrescritura: clases distintas, misma firma, decisión en tiempo de ejecución.</figcaption>
</figure>

```java
public class Consola {
    public void imprimir(String texto) { ... }
    public void imprimir(int numero) { ... }
    public void imprimir(String texto, int veces) { ... }
}
```

Nada de esto es herencia. Es simplemente comodidad: tres formas de llamar a algo que conceptualmente es lo mismo.

> **El tipo de retorno no cuenta para la sobrecarga.** `int calcular()` y `double calcular()` en la misma clase no compilan: el compilador no tiene forma de decidir cuál querés cuando escribís `calcular();` a secas.

---

## 5. Polimorfismo y despacho dinámico

Acá se junta todo lo anterior. Una variable declarada como `Vehiculo` puede apuntar a **cualquier** objeto que sea un `Vehiculo`, incluidos los de sus subclases:

```java
Vehiculo v = new Auto("Toyota");
v.arrancar();   // Imprime: "Auto Toyota arrancando con botón."
```

Fijate lo que pasó: la variable dice `Vehiculo`, pero se ejecutó el código de `Auto`. **Eso es polimorfismo**, y el mecanismo se llama *despacho dinámico*.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-poli-t">
<title id="d-poli-t">Despacho dinámico: el tipo de la variable y el tipo del objeto deciden cosas distintas</title>
<defs><marker id="ar-poli" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<text x="0" y="22" font-size="14" font-weight="700" fill="var(--color-accent-700)">Vehiculo v = new Auto("Toyota");</text>
<rect x="0" y="36" width="262" height="112" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="18" y="58" font-size="11" font-weight="700" fill="var(--color-neutral-700)">STACK</text>
<rect x="18" y="68" width="226" height="62" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="34" y="92" font-size="13" font-weight="700" fill="var(--color-text)">Vehiculo v</text>
<text x="34" y="114" font-size="11" fill="var(--color-neutral-700)">tipo declarado: Vehiculo</text>
<line x1="248" y1="99" x2="326" y2="99" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-poli)"/>
<rect x="334" y="36" width="386" height="112" rx="18" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="352" y="58" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">HEAP</text>
<rect x="352" y="68" width="350" height="62" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="368" y="92" font-size="13" font-weight="700" fill="var(--color-accent-700)">objeto Auto</text>
<text x="368" y="114" font-size="11" fill="var(--color-neutral-800)">tipo real: Auto — acá vive arrancar() sobrescrito</text>
<rect x="0" y="172" width="262" height="46" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="131" y="200" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">v.arrancar();</text>
<line x1="270" y1="195" x2="326" y2="195" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-poli)"/>
<rect x="334" y="172" width="386" height="46" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="527" y="200" font-size="12.5" text-anchor="middle" fill="var(--color-accent-2-800)">"Auto Toyota arrancando con botón."</text>
<text x="0" y="252" font-size="12.5" fill="var(--color-text)">El tipo de la VARIABLE decide qué métodos podés escribir. Lo revisa el compilador.</text>
<text x="0" y="274" font-size="12.5" fill="var(--color-text)">El tipo del OBJETO decide qué código se ejecuta. Lo resuelve la JVM en cada llamada.</text>
<text x="0" y="296" font-size="12" font-weight="700" fill="var(--color-accent-700)">Esas dos frases son, literalmente, la definición de polimorfismo.</text>
</svg>
<figcaption>La variable determina el contrato visible; el objeto determina la implementación que corre. Compilador y JVM miran cosas distintas.</figcaption>
</figure>

### Para qué sirve esto de verdad

El valor del polimorfismo no está en una llamada suelta, está en poder escribir código que **no sabe con qué subclase está trabajando y no le importa**:

```java
public class Taller {
    // Este método no conoce Auto, Moto ni Camión. Y no necesita conocerlos.
    public void revisar(List<Vehiculo> flota) {
        for (Vehiculo v : flota) {
            v.arrancar();   // cada objeto ejecuta SU propia versión
            v.frenar();
        }
    }
}

List<Vehiculo> flota = List.of(
    new Auto("Toyota"),
    new Moto("Honda"),
    new Camion("Scania")
);
new Taller().revisar(flota);
```

Mañana agregás una clase `Bicicleta extends Vehiculo` y `Taller` la maneja sin que toques una sola línea suya. **Ese es el premio**: código nuevo que se integra sin modificar el que ya funcionaba.

La alternativa sin polimorfismo es esta cadena, que crece para siempre y hay que tocar cada vez:

```java
// El código que el polimorfismo te ahorra escribir
if (v instanceof Auto) {
    ((Auto) v).arrancarAuto();
} else if (v instanceof Moto) {
    ((Moto) v).arrancarMoto();
} else if (v instanceof Camion) {
    ...
}
```

### Casteo y `instanceof`

Con una referencia de tipo `Vehiculo` solo podés llamar a lo que `Vehiculo` declara. Si necesitás algo específico de la subclase, tenés que hacer un casteo, y hacerlo con red:

```java
Vehiculo v = new Auto("Toyota");

// v.abrirBaul();  // ERROR: Vehiculo no declara abrirBaul()

if (v instanceof Auto auto) {   // pattern matching, desde Java 16
    auto.abrirBaul();           // 'auto' ya viene casteado y listo
}
```

Sin la comprobación, un casteo a un tipo equivocado revienta en ejecución con `ClassCastException`. Y si te encontrás casteando seguido, tomalo como una señal: probablemente el método que necesitás debería estar declarado en la superclase.

---

## 6. Cuándo NO heredar

La herencia es la relación más fuerte que existe entre dos clases: la subclase queda atada a los detalles internos del padre para siempre. Cada cambio en la superclase puede romper subclases que nadie tocó.

Por eso la regla de la industria es **preferir composición antes que herencia**:

```java
// Herencia forzada: ¿un Auto ES UN Motor? No.
public class Auto extends Motor { ... }

// Composición: un Auto TIENE UN motor. Esto sí.
public class Auto {
    private final Motor motor;

    public Auto(Motor motor) {
        this.motor = motor;
    }

    public void arrancar() {
        motor.encender();   // delega en el motor
    }
}
```

La composición te deja cambiar el motor sin tocar el auto, y probar el auto con un motor de mentira. La herencia no te deja ninguna de las dos cosas.

Cuando una clase **no debe** ser extendida, decilo con `final` y que el compilador lo haga cumplir:

```java
public final class Coordenada { ... }   // nadie puede heredar de acá

public class Cuenta {
    public final void acreditar(double m) { ... }   // este método no se sobrescribe
}
```

---

## 7. Todo hereda de `Object`

Aunque no escribas `extends`, **toda clase en Java hereda de `Object`**. De ahí vienen métodos que ya usaste sin darte cuenta:

```java
public class Auto extends Vehiculo {
    @Override
    public String toString() {
        return "Auto{marca='" + marca + "'}";
    }
}

Auto a = new Auto("Toyota");
System.out.println(a);   // Java llama a toString() solo
```

Sin sobrescribir `toString()`, `System.out.println(a)` imprime algo como `Auto@1b6d3586`: el nombre de la clase y un código hash. Inútil para depurar. Sobrescribirlo cuesta dos líneas y te devuelve horas.

`Object` también trae `equals()` y `hashCode()`, que tienen reglas propias y bastante trampa. Los vas a ver en profundidad en la lección de iteradores y ordenamiento.

---

## 8. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| Sobrescribir cambiando los parámetros | Java lo toma como un método nuevo. El original sigue heredado y tu código no hace nada de lo que esperás. | Poner `@Override` siempre: convierte el bug en error de compilación. |
| Constructor de subclase sin `super(...)` cuando el padre no tiene constructor vacío | Error de compilación poco claro sobre un constructor que nunca escribiste. | Llamar explícitamente a `super(argumentos)` en la primera línea. |
| Llamar a un método sobrescribible desde el constructor del padre | Corre la versión de la subclase antes de que sus campos estén inicializados: valores en `null` o `0` sin explicación. | Que los constructores llamen solo a métodos `private` o `final`. |
| Castear sin comprobar con `instanceof` | `ClassCastException` en ejecución. | Usar `if (v instanceof Auto auto)`, o repensar por qué necesitás el casteo. |
| Heredar para reutilizar código, sin que exista un "es un" | Jerarquías rígidas donde la subclase hereda métodos sin sentido. | Componer: tener el objeto como atributo y delegarle. |
| Confundir sobrecarga con sobrescritura | Se espera polimorfismo y se obtiene una selección estática hecha por el compilador. | Sobrecarga: misma clase, firmas distintas. Sobrescritura: subclase, misma firma. |

---

## 9. Ejercicio práctico guiado

### Desafío: jerarquía de empleados

1. Creá una superclase `Empleado` con `nombre` y `sueldoBase` (ambos protegidos o privados con getters), un constructor que valide que el sueldo no sea negativo, y un método `calcularSalario()` que devuelva el sueldo base.
2. Creá `Gerente extends Empleado`, que agregue un `bono` y sobrescriba `calcularSalario()` para sumarlo.
3. Creá `Vendedor extends Empleado`, con `ventasDelMes` y una comisión del 8 %.
4. Sobrescribí `toString()` en las tres.
5. En el `main`, armá una `List<Empleado>` con objetos de los tres tipos, recorrela **una sola vez** y mostrá el salario de cada uno. El bucle no debe usar `instanceof` ni castear.

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.List;

public class Empleado {
    private final String nombre;
    private final double sueldoBase;

    public Empleado(String nombre, double sueldoBase) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (sueldoBase < 0) {
            throw new IllegalArgumentException("El sueldo base no puede ser negativo");
        }
        this.nombre = nombre;
        this.sueldoBase = sueldoBase;
    }

    public String getNombre() { return nombre; }
    public double getSueldoBase() { return sueldoBase; }

    public double calcularSalario() {
        return sueldoBase;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + " " + nombre;
    }
}

public class Gerente extends Empleado {
    private final double bono;

    public Gerente(String nombre, double sueldoBase, double bono) {
        super(nombre, sueldoBase);          // primera sentencia, obligatorio
        if (bono < 0) {
            throw new IllegalArgumentException("El bono no puede ser negativo");
        }
        this.bono = bono;
    }

    @Override
    public double calcularSalario() {
        return super.calcularSalario() + bono;   // extiende, no reemplaza
    }
}

public class Vendedor extends Empleado {
    private static final double COMISION = 0.08;
    private final double ventasDelMes;

    public Vendedor(String nombre, double sueldoBase, double ventasDelMes) {
        super(nombre, sueldoBase);
        if (ventasDelMes < 0) {
            throw new IllegalArgumentException("Las ventas no pueden ser negativas");
        }
        this.ventasDelMes = ventasDelMes;
    }

    @Override
    public double calcularSalario() {
        return super.calcularSalario() + ventasDelMes * COMISION;
    }
}

public class MainNomina {
    public static void main(String[] args) {
        List<Empleado> nomina = List.of(
            new Empleado("Ana Torres", 800000),
            new Gerente("Luis Paz", 1500000, 400000),
            new Vendedor("Sofía Ríos", 700000, 2500000)
        );

        double total = 0;
        // Un solo bucle, sin instanceof y sin casteos:
        for (Empleado e : nomina) {
            double salario = e.calcularSalario();
            total += salario;
            System.out.printf("%-22s $ %,.2f%n", e, salario);
        }
        System.out.printf("%-22s $ %,.2f%n", "TOTAL", total);
    }
}
```

**Lo que hay que mirar acá es el bucle.** No pregunta de qué tipo es cada empleado, y sin embargo cada uno calcula su salario a su manera. Si mañana agregás `Pasante extends Empleado`, ese bucle sigue funcionando sin una sola modificación. Eso es polimorfismo haciendo su trabajo.

Fijate también en `super.calcularSalario()`: `Gerente` y `Vendedor` no repiten la lógica del sueldo base, la reutilizan y le suman lo suyo.

</details>

---

## Para llevarte

- `extends` solo se justifica si la frase **"un X es un Y"** es verdadera. Si no, componé.
- La cadena de constructores **sube con `super(...)` y se ejecuta bajando**: el padre siempre queda inicializado antes que el hijo.
- Escribí `@Override` siempre: transforma un método fantasma silencioso en un error de compilación.
- **Sobrecarga** = misma clase, firmas distintas, la decide el compilador. **Sobrescritura** = subclase, misma firma, la decide la JVM.
- La variable define qué podés llamar; el objeto define qué se ejecuta. Ahí está todo el polimorfismo.
- El beneficio real es escribir código que funciona con subclases que todavía no existen.
- Castear seguido es un síntoma de que el diseño de la jerarquía está pidiendo un método en la superclase.
- Preferí composición antes que herencia, y marcá con `final` lo que no debe extenderse.
</content>
