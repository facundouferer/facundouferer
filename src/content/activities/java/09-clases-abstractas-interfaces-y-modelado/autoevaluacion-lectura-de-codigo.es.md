---
course: 'java'
lesson: '09-clases-abstractas-interfaces-y-modelado'
slug: 'autoevaluacion-lectura-de-codigo'
title: 'Autoevaluación: Lectura de Código con Clases Abstractas e Interfaces'
description: 'Doce fragmentos de código para analizar: clases abstractas, interfaces con métodos default y static, varios contratos a la vez, paquetes y relaciones entre clases.'
kind: 'quiz'
order: 3
lang: 'es'
published: true
estimatedMinutes: 30
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué líneas del `main` impiden que este programa compile?'
    code: |-
      abstract class Mascota {
          private String nombre;

          public Mascota(String nombre) {
              this.nombre = nombre;
          }

          public abstract void emitirSonido();

          public String getNombre() {
              return nombre;
          }
      }

      class Gato extends Mascota {
          public Gato() {
              super("Gato");
          }

          @Override
          public void emitirSonido() {
              System.out.println("miau, miau, miau");
          }
      }

      public class Veterinaria {
          public static void main(String[] args) {
              Mascota[] refugio = new Mascota[3];   // línea A
              refugio[0] = new Gato();              // línea B
              Mascota otra = new Mascota("Tom");    // línea C
              refugio[0].emitirSonido();            // línea D
          }
      }
    options:
      - id: 'a'
        text: 'A y C: no se puede crear un array de un tipo abstracto ni instanciar `Mascota`.'
      - id: 'b'
        text: 'Solo C: `Mascota` no se puede instanciar, aunque sí se puede usar como tipo de variables y de arrays.'
      - id: 'c'
        text: 'Solo B: un `Gato` no se puede guardar en un array de `Mascota`.'
      - id: 'd'
        text: 'Ninguna: como `Mascota` tiene constructor, `new Mascota("Tom")` es válido.'
    correctOptionId: 'b'
    explanation: >-
      `new Mascota[3]` crea un array con tres referencias en `null`: no crea
      ningún objeto `Mascota`, así que es válido. La línea B guarda un `Gato`,
      que es una `Mascota`. La línea C intenta crear el objeto abstracto y
      `javac` responde `Mascota is abstract; cannot be instantiated`. El
      constructor de `Mascota` existe para que lo invoque `super("Gato")`, no
      para usarlo con `new`.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué se imprime al ejecutar `figura.describir()`?'
    code: |-
      abstract class Figura {
          protected String color;

          public Figura(String color) {
              this.color = color;
          }

          abstract double calcularArea();

          abstract String mostrarInformacion();

          public void describir() {
              System.out.println(mostrarInformacion() + " | área: " + calcularArea());
          }
      }

      class Rectangulo extends Figura {
          private double ancho, alto;

          public Rectangulo(String color, double ancho, double alto) {
              super(color);
              this.ancho = ancho;
              this.alto = alto;
          }

          @Override
          double calcularArea() {
              return ancho * alto;
          }

          @Override
          String mostrarInformacion() {
              return "Rectángulo: " + color + " de " + ancho + " x " + alto;
          }
      }

      public class Main {
          public static void main(String[] args) {
              Figura figura = new Rectangulo("Azul", 4, 6);
              figura.describir();
          }
      }
    options:
      - id: 'a'
        text: '`Rectángulo: Azul de 4.0 x 6.0 | área: 24.0`'
      - id: 'b'
        text: '`Rectángulo: Azul de 4 x 6 | área: 24`'
      - id: 'c'
        text: 'Nada: no compila porque `describir()` llama a métodos abstractos que no tienen cuerpo.'
      - id: 'd'
        text: 'Nada: compila, pero falla al ejecutar porque `Figura` no implementa `calcularArea()`.'
    correctOptionId: 'a'
    explanation: >-
      `describir()` es un método concreto escrito una sola vez en la clase
      abstracta, y delega los pasos concretos en `mostrarInformacion()` y
      `calcularArea()`. Al ejecutarse, el objeto es un `Rectangulo`, así que se
      usan sus implementaciones. Como `ancho` y `alto` son `double`, se
      imprimen como `4.0`, `6.0` y `24.0`.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra la última línea del `main`?'
    code: |-
      abstract class Vehiculo {
          private double hp;
          private int stock;
          private double precio;

          public Vehiculo(double hp, int stock, double precio) {
              this.hp = hp;
              this.stock = stock;
              this.precio = precio;
          }

          public int getStock() {
              return stock;
          }

          public void vender() {
              this.stock--;
          }

          abstract String verCaracteristicas();
      }

      class Terrestre extends Vehiculo {
          private int ruedas;

          public Terrestre(double hp, int stock, double precio, int ruedas) {
              super(hp, stock, precio);
              this.ruedas = ruedas;
          }

          @Override
          String verCaracteristicas() {
              return "Ruedas: " + ruedas;
          }
      }

      class Acuatico extends Vehiculo {
          private String tipoCasco;

          public Acuatico(double hp, int stock, double precio, String tipoCasco) {
              super(hp, stock, precio);
              this.tipoCasco = tipoCasco;
          }

          @Override
          String verCaracteristicas() {
              return "Tipo de casco: " + tipoCasco;
          }
      }

      public class Main {
          public static void main(String[] args) {
              Vehiculo auto = new Terrestre(200, 10, 10000, 4);
              Vehiculo barco = new Acuatico(500, 5, 20000, "Lancha");

              auto.vender();
              auto.vender();
              barco.vender();

              System.out.println(auto.getStock() + " | " + barco.getStock() + " | " + barco.verCaracteristicas());
          }
      }
    options:
      - id: 'a'
        text: '`7 | 7 | Tipo de casco: Lancha`: el stock declarado en la clase abstracta es compartido por todos los vehículos.'
      - id: 'b'
        text: '`10 | 5 | Tipo de casco: Lancha`: `vender()` está en `Vehiculo` y no modifica a los objetos de las subclases.'
      - id: 'c'
        text: '`8 | 4 | Tipo de casco: Lancha`'
      - id: 'd'
        text: 'Nada: no compila porque `stock` es `private` y las subclases no pueden usar `vender()`.'
    correctOptionId: 'c'
    explanation: >-
      Una clase abstracta sí tiene estado de instancia: cada objeto recibe sus
      propios `hp`, `stock` y `precio`. `auto` arranca con 10 y vende dos veces
      (8), y `barco` arranca con 5 y vende una vez (4). `vender()` es un método
      concreto que se hereda tal cual y accede a `stock` desde la propia clase
      `Vehiculo`, por eso que sea `private` no impide usarlo. El texto final lo
      resuelve la implementación de `Acuatico`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué se imprime al recorrer el array `medios`?'
    code: |-
      interface Pagable {
          boolean pagar(double monto);
          boolean estaDisponible();

          default void pagarSiPuede(double monto) {
              if (estaDisponible()) {
                  pagar(monto);
              } else {
                  System.out.println("Medio de pago no disponible.");
              }
          }
      }

      class TarjetaCredito implements Pagable {
          private final String numero;
          private double limiteDisponible;

          public TarjetaCredito(String numero, double limiteDisponible) {
              this.numero = numero;
              this.limiteDisponible = limiteDisponible;
          }

          @Override
          public boolean pagar(double monto) {
              limiteDisponible -= monto;
              System.out.println("Pagado con tarjeta " + numero);
              return true;
          }

          @Override
          public boolean estaDisponible() {
              return limiteDisponible > 0;
          }
      }

      public class Main {
          public static void main(String[] args) {
              Pagable[] medios = { new TarjetaCredito("4417", 1000), new TarjetaCredito("9021", 0) };
              for (Pagable medio : medios) {
                  medio.pagarSiPuede(500);
              }
          }
      }
    options:
      - id: 'a'
        text: '`Pagado con tarjeta 4417` y `Pagado con tarjeta 9021`: un método `default` no puede consultar el estado del objeto.'
      - id: 'b'
        text: 'Nada: no compila porque `TarjetaCredito` no implementa `pagarSiPuede`.'
      - id: 'c'
        text: '`Medio de pago no disponible.` dos veces.'
      - id: 'd'
        text: '`Pagado con tarjeta 4417` y luego `Medio de pago no disponible.`'
    correctOptionId: 'd'
    explanation: >-
      `TarjetaCredito` hereda `pagarSiPuede` de la interfaz sin tener que
      escribirlo. El método `default` llama a `estaDisponible()` y a `pagar()`
      del objeto real: la primera tarjeta tiene límite 1000 y cobra; la
      segunda tiene límite 0, así que `estaDisponible()` devuelve `false` y se
      imprime el aviso.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué ocurre al compilar este programa con las líneas A y B?'
    code: |-
      interface ParaJefes {
          String tomarDecisiones(String decision);

          static String politica() {
              return "Decidir con datos";
          }
      }

      abstract class Persona {
          public abstract void hablar();
      }

      class Empleado extends Persona {
          @Override
          public void hablar() {
              System.out.println("Empleado");
          }
      }

      class Jefe extends Empleado implements ParaJefes {
          @Override
          public String tomarDecisiones(String decision) {
              return "El jefe decide: " + decision;
          }
      }

      public class Main {
          public static void main(String[] args) {
              Jefe jefe = new Jefe();
              System.out.println(ParaJefes.politica());   // línea A
              System.out.println(jefe.politica());        // línea B
          }
      }
    options:
      - id: 'a'
        text: 'Compila y ambas líneas imprimen `Decidir con datos`.'
      - id: 'b'
        text: 'La línea B no compila: los métodos `static` de una interfaz pertenecen a la interfaz y no se heredan, así que se invocan como `ParaJefes.politica()`.'
      - id: 'c'
        text: 'La línea A no compila: un método `static` de una interfaz solo se puede llamar desde un objeto que la implemente.'
      - id: 'd'
        text: 'No compila porque una interfaz no puede tener métodos con cuerpo.'
    correctOptionId: 'b'
    explanation: >-
      Un método `static` de una interfaz es una utilidad de la interfaz, no de
      las clases que la firman. `ParaJefes.politica()` es la forma correcta de
      invocarlo. `Jefe` no lo hereda, por eso `jefe.politica()` produce
      `error: cannot find symbol`. Desde Java 8, las interfaces sí admiten
      métodos con cuerpo (`default` y `static`).
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Qué ocurre al compilar y ejecutar este código?'
    code: |-
      interface ParaJefes {
          String tomarDecisiones(String decision);
      }

      class Jefe implements ParaJefes {
          String tomarDecisiones(String decision) {
              return "El jefe decide: " + decision;
          }
      }

      public class Main {
          public static void main(String[] args) {
              ParaJefes jefe = new Jefe();
              System.out.println(jefe.tomarDecisiones("contratar"));
          }
      }
    options:
      - id: 'a'
        text: 'Compila e imprime `El jefe decide: contratar`.'
      - id: 'b'
        text: 'Compila, pero falla al ejecutar porque `Jefe` no es `public`.'
      - id: 'c'
        text: 'No compila: los métodos de una interfaz son implícitamente `public` y `Jefe` no puede implementarlo con menor visibilidad.'
      - id: 'd'
        text: 'No compila porque falta la anotación `@Override`.'
    correctOptionId: 'c'
    explanation: >-
      En una interfaz los métodos son siempre `public`, aunque no se escriba.
      Al omitir `public`, `Jefe` declara el método con visibilidad de paquete,
      y `javac` lo rechaza con
      `attempting to assign weaker access privileges; was public`. Se arregla
      declarando `public String tomarDecisiones(...)`. `@Override` es
      recomendable, pero no obligatorio.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Las variables `pato` y `n` apuntan al mismo objeto. ¿Qué ocurre al compilar este `main`?'
    code: |-
      interface Nadable {
          void nadar();
      }

      interface Volable {
          void volar();
      }

      class Ave {
      }

      class Pato extends Ave implements Nadable, Volable {
          @Override public void nadar() { System.out.println("El pato nada."); }
          @Override public void volar() { System.out.println("El pato vuela."); }
      }

      public class Main {
          public static void main(String[] args) {
              Pato pato = new Pato();
              Nadable n = pato;
              n.nadar();   // línea A
              n.volar();   // línea B
          }
      }
    options:
      - id: 'a'
        text: 'La línea B no compila: a través de una variable `Nadable` solo se ven los métodos que declara `Nadable`, aunque el objeto también sepa volar.'
      - id: 'b'
        text: 'Compila e imprime `El pato nada.` y `El pato vuela.`'
      - id: 'c'
        text: 'Compila, pero la línea B falla al ejecutar.'
      - id: 'd'
        text: 'La línea A no compila porque `n` no es de tipo `Pato`.'
    correctOptionId: 'a'
    explanation: >-
      Un mismo objeto puede verse desde ángulos distintos según el tipo de la
      variable. Vista como `Nadable`, solo expone `nadar()`; el compilador
      revisa el tipo de la variable y responde `cannot find symbol` para
      `volar()`. Para volar hay que mirarlo como `Volable` (o como `Pato`).
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Cuál de las dos declaraciones del `main` no compila?'
    code: |-
      interface Nadable {
          void nadar();
      }

      class Ave {
      }

      class Pato extends Ave implements Nadable {
          @Override public void nadar() { System.out.println("El pato nada."); }
      }

      class Submarino implements Nadable {
          @Override public void nadar() { System.out.println("El submarino se sumerge."); }
      }

      public class Main {
          public static void main(String[] args) {
              Nadable[] grupo = { new Pato(), new Submarino() };   // línea A
              Ave[] aves = { new Pato(), new Submarino() };        // línea B
          }
      }
    options:
      - id: 'a'
        text: 'Ninguna: `Pato` y `Submarino` saben nadar, así que ambos arrays son válidos.'
      - id: 'b'
        text: 'Ambas: un array no puede mezclar objetos de clases distintas.'
      - id: 'c'
        text: 'Solo la línea A: no se pueden crear arrays de una interfaz.'
      - id: 'd'
        text: 'Solo la línea B: `Submarino` no hereda de `Ave`, y lo único que comparte con `Pato` es la interfaz `Nadable`.'
    correctOptionId: 'd'
    explanation: >-
      `Pato` y `Submarino` no comparten ningún ancestro, pero los dos firman
      `Nadable`: por eso conviven en un `Nadable[]`. En cambio, un `Submarino`
      no es un `Ave`, y `javac` responde
      `incompatible types: Submarino cannot be converted to Ave`. La interfaz es
      lo único que tienen en común, y alcanza.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '`NotificadorBase` no implementa `enviar()`. ¿Qué ocurre al compilar y ejecutar este programa?'
    code: |-
      interface Notificador {
          void enviar(String mensaje);
          String canal();
      }

      abstract class NotificadorBase implements Notificador {
          @Override
          public String canal() {
              return "genérico";
          }
          // enviar() no se implementa acá
      }

      class NotificadorEmail extends NotificadorBase {
          @Override
          public void enviar(String mensaje) {
              System.out.println("[" + canal() + "] " + mensaje);
          }

          @Override
          public String canal() {
              return "email";
          }
      }

      public class Main {
          public static void main(String[] args) {
              Notificador notificador = new NotificadorEmail();
              notificador.enviar("Hola");
          }
      }
    options:
      - id: 'a'
        text: 'No compila: `NotificadorBase` debe implementar todos los métodos de `Notificador`.'
      - id: 'b'
        text: 'Compila e imprime `[email] Hola`.'
      - id: 'c'
        text: 'Compila e imprime `[genérico] Hola`, porque `canal()` ya estaba resuelto en la clase base.'
      - id: 'd'
        text: 'Compila, pero falla al ejecutar porque `enviar()` no tiene cuerpo en `NotificadorBase`.'
    correctOptionId: 'b'
    explanation: >-
      Es el patrón que combina interfaz y clase abstracta: `NotificadorBase`
      firma el contrato, resuelve una parte y, por ser abstracta, puede dejar
      `enviar()` pendiente para sus subclases. `NotificadorEmail` completa
      `enviar()` y redefine `canal()`. Como el objeto real es un
      `NotificadorEmail`, `canal()` devuelve `email`.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué ocurre al compilar `Auditoria.java`?'
    code: |-
      import java.util.Date;
      import java.sql.Date;

      public class Auditoria {
          private Date fechaOperacion = new Date();
      }
    options:
      - id: 'a'
        text: 'Compila: `Date` se refiere a `java.sql.Date` porque es el último import.'
      - id: 'b'
        text: 'Compila: `Date` se refiere a `java.util.Date` porque es el primer import.'
      - id: 'c'
        text: 'No compila: no se pueden importar dos clases con el mismo nombre simple. Hay que importar una y escribir el nombre completo (FQCN) de la otra.'
      - id: 'd'
        text: 'Compila, pero la JVM elige al azar cuál `Date` usar en cada ejecución.'
    correctOptionId: 'c'
    explanation: >-
      `java.util.Date` y `java.sql.Date` viven en paquetes distintos, pero
      comparten el nombre simple `Date`. Java no admite esa ambigüedad y
      rechaza el segundo `import`. La solución es importar la que más se usa y
      escribir el FQCN de la otra donde haga falta, por ejemplo
      `private java.sql.Date fechaPersistenciaBD;`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Las tres clases están en archivos separados, como indica el comentario de cada bloque. ¿Qué ocurre al compilarlas juntas?'
    code: |-
      // Archivo universidad/modelos/Persona.java
      package universidad.modelos;

      class Persona {
          private String nombre;

          public Persona(String nombre) {
              this.nombre = nombre;
          }

          public String getNombre() {
              return nombre;
          }
      }

      // Archivo universidad/modelos/Estudiante.java
      package universidad.modelos;

      public class Estudiante extends Persona {
          private String carrera;

          public Estudiante(String nombre, String carrera) {
              super(nombre);
              this.carrera = carrera;
          }

          public String getCarrera() {
              return carrera;
          }
      }

      // Archivo universidad/servicios/Registro.java
      package universidad.servicios;

      import universidad.modelos.Estudiante;
      import universidad.modelos.Persona;

      public class Registro {
          public void listar(Estudiante[] estudiantes) {
              for (Estudiante e : estudiantes) {
                  System.out.println(e.getNombre() + " - " + e.getCarrera());
              }
          }
      }
    options:
      - id: 'a'
        text: 'Falla `import universidad.modelos.Persona`: `Persona` es *package-private* y no se puede usar desde otro paquete.'
      - id: 'b'
        text: 'Compila sin errores, porque todas las clases están dentro de `universidad`.'
      - id: 'c'
        text: 'Falla `e.getNombre()`, porque ese método está declarado en `Persona`.'
      - id: 'd'
        text: 'Falla `Estudiante`, porque una clase pública no puede extender una clase *package-private*.'
    correctOptionId: 'a'
    explanation: >-
      `Persona` no tiene modificador, así que solo es visible dentro de
      `universidad.modelos`. Para el compilador, `universidad.servicios` es
      otro paquete, aunque comparta el prefijo, y responde
      `Persona is not public in universidad.modelos; cannot be accessed from outside package`.
      Si se quita ese `import`, todo compila: `Estudiante` es pública y
      `getNombre()` es un método `public` que hereda de `Persona`.
  - kind: 'single-choice'
    id: 'q12'
    prompt: 'Analizá cómo obtiene sus partes cada clase. ¿Qué relación modela `Libro` con `Pagina` y cuál `Biblioteca` con `Libro`?'
    code: |-
      import java.util.Arrays;

      class Pagina {
          private final int numero;

          Pagina(int numero) {
              this.numero = numero;
          }
      }

      class Libro {
          private final Pagina[] paginas;

          public Libro(int cantidadPaginas) {
              paginas = new Pagina[cantidadPaginas];
              for (int i = 0; i < cantidadPaginas; i++) {
                  paginas[i] = new Pagina(i + 1);
              }
          }

          public int cantidadPaginas() {
              return paginas.length;
          }
      }

      class Biblioteca {
          private final Libro[] libros;

          public Biblioteca(Libro[] libros) {
              this.libros = Arrays.copyOf(libros, libros.length);
          }
      }

      public class Main {
          public static void main(String[] args) {
              Libro[] libros = { new Libro(120), new Libro(80) };
              Biblioteca biblioteca = new Biblioteca(libros);
              System.out.println(libros[0].cantidadPaginas());
          }
      }
    options:
      - id: 'a'
        text: 'Ambas son composición, porque los dos arrays son `final`.'
      - id: 'b'
        text: '`Libro`–`Pagina` es agregación y `Biblioteca`–`Libro` es composición.'
      - id: 'c'
        text: 'Ambas son asociación, porque ninguna clase usa `extends`.'
      - id: 'd'
        text: '`Libro`–`Pagina` es composición y `Biblioteca`–`Libro` es agregación.'
    correctOptionId: 'd'
    explanation: >-
      `Libro` crea sus páginas en su propio constructor y no las expone: las
      páginas no existen fuera del libro, es composición. `Biblioteca` recibe
      libros que ya existían afuera (el `main` los sigue usando después), así
      que es agregación. `final` solo impide reasignar el array, no define el
      tipo de relación.
---

Analizá cada fragmento de código, elegí una respuesta por pregunta y presioná **Calificar** para comprobar si sabés predecir qué hacen `javac` y la JVM con clases abstractas, interfaces y paquetes.
