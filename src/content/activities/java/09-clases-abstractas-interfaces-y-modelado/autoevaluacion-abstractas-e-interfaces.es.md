---
course: 'java'
lesson: '09-clases-abstractas-interfaces-y-modelado'
slug: 'autoevaluacion-abstractas-e-interfaces'
title: 'Autoevaluación: Clases Abstractas, Interfaces y Contratos de Software'
description: 'Evaluá tus conocimientos sobre diseño con clases abstractas, contratos de interfaces, métodos default y relaciones de modelado.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es la principal diferencia conceptual entre una clase abstracta y una interfaz en Java?'
    options:
      - id: 'a'
        text: 'Las interfaces se ejecutan más rápido porque no admiten métodos estáticos.'
      - id: 'b'
        text: 'Una clase abstracta representa un molde incompleto que puede compartir estado y código base; una interfaz es un contrato puro de capacidades que cualquier clase puede firmar.'
      - id: 'c'
        text: 'Las clases abstractas solo pueden tener métodos abstractos, mientras que las interfaces admiten atributos de instancia.'
      - id: 'd'
        text: 'No existe ninguna diferencia; son dos palabras clave sinónimas en Java.'
    correctOptionId: 'b'
    explanation: >-
      Una clase abstracta define una jerarquía conceptual de "es-un" con estado compartido (atributos de instancia) y código heredable. Una interfaz define un contrato de "sabe-hacer" enfocado en capacidades que clases no emparentadas pueden compartir.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Una clase abstracta puede tener métodos constructores, aunque no sea posible instanciarla directamente mediante el operador `new`.'
    correctAnswer: true
    explanation: >-
      Verdadero. Las clases abstractas pueden y suelen tener constructores (generalmente protected) para que las subclases inicialicen el estado común mediante `super(...)`. Lo que está prohibido es invocar `new ClaseAbstracta()`.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué modificadores se aplican implícitamente por defecto a cualquier variable declarada dentro de una interfaz en Java?'
    options:
      - id: 'a'
        text: 'private final'
      - id: 'b'
        text: 'protected static'
      - id: 'c'
        text: 'public static final'
      - id: 'd'
        text: 'package-private volatile'
    correctOptionId: 'c'
    explanation: >-
      En una interfaz, todas las variables son constantes: son implícitamente `public`, `static` y `final`. Las interfaces no pueden almacenar estado de instancia mutable.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'En Java, una misma clase concreta puede implementar múltiples interfaces separadas por comas mediante la palabra clave `implements`.'
    correctAnswer: true
    explanation: >-
      Verdadero. Aunque Java no admite herencia múltiple de clases (`extends`), sí permite implementar cualquier cantidad de interfaces, lo que permite componer múltiples capacidades en una sola clase.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué ocurre si una clase concreta hereda de una clase abstracta pero no implementa todos sus métodos abstractos declarados?'
    options:
      - id: 'a'
        text: 'Compila normalmente y la JVM crea implementaciones vacías automáticas en tiempo de ejecución.'
      - id: 'b'
        text: 'Falla en tiempo de compilación a menos que la propia subclase también sea declarada como abstract.'
      - id: 'c'
        text: 'El compilador lanza un aviso (warning) pero genera el archivo .class sin problemas.'
      - id: 'd'
        text: 'Los métodos no implementados se delegan automáticamente en java.lang.Object.'
    correctOptionId: 'b'
    explanation: >-
      Una clase concreta tiene la obligación contractual de implementar todos los métodos abstractos heredados. Si no lo hace, no puede ser instanciable y debe declararse también como `abstract`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Cuál es el propósito de los métodos `default` introducidos en las interfaces a partir de Java 8?'
    options:
      - id: 'a'
        text: 'Permitir que las interfaces declaren atributos de instancia mutables.'
      - id: 'b'
        text: 'Proveer una implementación base u opcional en la interfaz, permitiendo evolucionar contratos existentes sin romper las clases que ya los implementaban.'
      - id: 'c'
        text: 'Convertir la interfaz en una clase final que no puede ser extendida.'
      - id: 'd'
        text: 'Obligar a que todas las subclases sobrescriban el método sin excepción.'
    correctOptionId: 'b'
    explanation: >-
      Los métodos `default` permiten añadir nuevos métodos a interfaces ya publicadas con una implementación por defecto, evitando romper compatibilidad binaria con las clases clientes existentes.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Cómo se distingue la relación de Composición de la de Agregación en el modelado orientado a objetos?'
    options:
      - id: 'a'
        text: 'En la agregación el objeto hijo no puede existir sin el padre; en la composición sí.'
      - id: 'b'
        text: 'En la composición el ciclo de vida del objeto parte está estrictamente ligado al del objeto todo (si se destruye el todo, se destruye la parte); en la agregación los objetos tienen ciclos de vida independientes.'
      - id: 'c'
        text: 'La composición requiere el uso de extends y la agregación requiere implements.'
      - id: 'd'
        text: 'No hay distinción técnica; ambas relaciones se programan siempre con variables estáticas.'
    correctOptionId: 'b'
    explanation: >-
      La composición implica pertenencia fuerte y ciclo de vida dependiente (por ejemplo, una Casa y sus Habitaciones). La agregación es una relación débil donde las partes pueden existir independientemente (por ejemplo, un Departamento universitario y sus Profesores).
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Una interfaz en Java puede extender a otra interfaz utilizando la palabra clave `extends`.'
    correctAnswer: true
    explanation: >-
      Verdadero. Una interfaz puede heredar de una o más interfaces mediante `extends` (por ejemplo, `public interface SubInterfaz extends InterfazA, InterfazB`), acumulando sus contratos.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Desde el punto de vista de arquitectura y código limpio, ¿por qué es preferible programar contra interfaces en lugar de clases concretas?'
    options:
      - id: 'a'
        text: 'Porque las interfaces reducen automáticamente el uso de memoria en el Heap.'
      - id: 'b'
        text: 'Porque desacopla a los clientes de las implementaciones específicas, permitiendo intercambiar componentes y probarlos con facilidad sin modificar el código consumidor.'
      - id: 'c'
        text: 'Porque elimina la necesidad de escribir pruebas unitarias.'
      - id: 'd'
        text: 'Porque las interfaces garantizan que no ocurran excepciones en tiempo de ejecución.'
    correctOptionId: 'b'
    explanation: >-
      "Programar contra una interfaz y no contra una implementación" es uno de los principios capitales de la ingeniería de software: reduce el acoplamiento y permite reemplazar implementaciones sin afectar a las clases que consumen el contrato.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '`Persona` es una clase abstracta con `public abstract void hablar();`. Si `Empleado extends Persona` no implementa `hablar()` y no se declara `abstract`, ¿qué ocurre?'
    code: |
      abstract class Persona {
          public abstract void hablar();
      }
      
      class Empleado extends Persona {
          // no implementa hablar()
      }
    options:
      - id: 'a'
        text: 'Compila, y `hablar()` queda con un cuerpo vacío por defecto.'
      - id: 'b'
        text: 'Error de compilación: una subclase concreta debe implementar todos los métodos abstractos heredados o declararse también `abstract`.'
      - id: 'c'
        text: 'Compila, pero lanza una excepción al llamar a `hablar()`.'
      - id: 'd'
        text: 'Compila solo si `Empleado` implementa además una interfaz.'
    correctOptionId: 'b'
    explanation: >-
      Un método abstracto es una obligación contractual. Toda subclase concreta debe sobrescribirlo; si no puede o no quiere, debe declararse también `abstract` y pasar la obligación a sus propias subclases.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'La instrucción `Persona p = new Persona();` compila correctamente cuando `Persona` es una clase abstracta, siempre que `hablar()` esté implementado en alguna subclase.'
    correctAnswer: false
    explanation: >-
      Falso. Una clase abstracta nunca puede instanciarse con `new`, sin importar cuántas subclases la implementen. Lo que sí es válido es `Persona p = new Empleado();`: la referencia es del tipo abstracto y el objeto de una subclase concreta.
  - kind: 'single-choice'
    id: 'q13'
    prompt: '¿Qué imprime el `main` si `Jefe` define su propio `public static String tomarDecisiones()` (que devuelve "Decisión postergada hasta la próxima reunión de equipo.") e implementa `ParaJefes`, que también declara un `static String tomarDecisiones()`?'
    code: |
      Jefe empleado = new Jefe();
      System.out.println(empleado.tomarDecisiones());
    options:
      - id: 'a'
        text: '"Decisión postergada: falta información para resolver." (la versión de la interfaz).'
      - id: 'b'
        text: 'Nada: error de compilación por método duplicado.'
      - id: 'c'
        text: '"Decisión postergada hasta la próxima reunión de equipo." (la versión estática de `Jefe`).'
      - id: 'd'
        text: 'Una excepción en tiempo de ejecución por ambigüedad.'
    correctOptionId: 'c'
    explanation: >-
      Los métodos `static` de una interfaz no se heredan, así que no hay conflicto: `Jefe` solo ve su propio `tomarDecisiones()` estático. La versión de la interfaz solo se alcanzaría con `ParaJefes.tomarDecisiones()`.
  - kind: 'true-false'
    id: 'q14'
    prompt: 'Un método `static` declarado dentro de una interfaz se hereda en las clases que la implementan, por lo que `Jefe.tomarDecisiones()` ejecutaría el de `ParaJefes` si `Jefe` no definiera uno propio.'
    correctAnswer: false
    explanation: >-
      Falso. Los métodos estáticos de una interfaz pertenecen únicamente a la interfaz y no se heredan. Se invocan siempre con su nombre: `ParaJefes.tomarDecisiones()`. Si `Jefe` no define uno propio, `Jefe.tomarDecisiones()` no compila.
  - kind: 'single-choice'
    id: 'q15'
    prompt: 'Dadas `class Empleado extends Persona`, `interface ParaJefes` y `class Jefe extends Empleado implements ParaJefes`, ¿cuál de estas asignaciones NO compila?'
    options:
      - id: 'a'
        text: '`Persona p = new Jefe();`'
      - id: 'b'
        text: '`ParaJefes pj = new Jefe();`'
      - id: 'c'
        text: '`Empleado e = new Jefe();`'
      - id: 'd'
        text: '`ParaJefes pj = new Empleado();`'
    correctOptionId: 'd'
    explanation: >-
      `Jefe` es una `Empleado`, una `Persona` y además cumple el contrato `ParaJefes`. En cambio `Empleado` no implementa `ParaJefes`, así que un `Empleado` no es un `ParaJefes` y el compilador rechaza la asignación.
  - kind: 'true-false'
    id: 'q16'
    prompt: 'En una interfaz, escribir `public abstract String tomarDecisiones(String decision);` es redundante: todo método de interfaz sin cuerpo ya es `public abstract` de forma implícita.'
    correctAnswer: true
    explanation: >-
      Verdadero. Los miembros de una interfaz son públicos por defecto y, si no tienen cuerpo, abstractos. Escribir `public abstract` es válido, pero innecesario; por eso las clases que lo implementan deben declarar el método como `public`.
  - kind: 'single-choice'
    id: 'q17'
    prompt: 'Con `ParaJefes pj = new Jefe();`, ¿qué sucede al escribir `pj.hablar();` si `hablar()` está definido en `Persona` y heredado por `Jefe`?'
    options:
      - id: 'a'
        text: 'Compila y ejecuta `hablar()` de `Empleado`.'
      - id: 'b'
        text: 'Error de compilación: la referencia es de tipo `ParaJefes`, y ese tipo no declara `hablar()`.'
      - id: 'c'
        text: 'Compila, pero lanza `ClassCastException`.'
      - id: 'd'
        text: 'Compila solo si `ParaJefes` extiende `Persona`.'
    correctOptionId: 'b'
    explanation: >-
      El compilador solo permite invocar los métodos del tipo de la referencia, no los del objeto real. Para llamar a `hablar()` hay que usar una referencia `Persona`, `Empleado` o `Jefe`, o hacer un cast explícito.
  - kind: 'single-choice'
    id: 'q18'
    prompt: '`Figura` es abstracta y tiene el constructor `Figura(String color)`. ¿Qué sentido tiene que una clase abstracta tenga constructor si no puede instanciarse?'
    code: |
      abstract class Figura {
          String color;
          public Figura(String color) { this.color = color; }
      }
      
      class Circulo extends Figura {
          double radio;
          public Circulo(String color, double radio) {
              super(color);
              this.radio = radio;
          }
      }
    options:
      - id: 'a'
        text: 'Ninguno: el compilador lo ignora siempre.'
      - id: 'b'
        text: 'Lo ejecutan las subclases al llamar a `super(color)`, para inicializar el estado común (como el `color`).'
      - id: 'c'
        text: 'Solo sirve para crear arreglos de `Figura`.'
      - id: 'd'
        text: 'Permite instanciar la clase usando `new Figura("Rojo")`.'
    correctOptionId: 'b'
    explanation: >-
      Aunque la clase abstracta no se instancie directamente, sus subclases sí, y construir un `Circulo` implica construir primero su parte `Figura`. Por eso `Circulo` llama a `super(color)` en su constructor. Es una de las diferencias clave frente a una interfaz, que no tiene constructores.
  - kind: 'true-false'
    id: 'q19'
    prompt: 'Si `mostrarInformacion()` está definido solo en `Circulo` (no en `Figura` ni en `ParaMostrar`), la sentencia `Figura f = new Circulo("Rojo", 5); f.mostrarInformacion();` no compila.'
    correctAnswer: true
    explanation: >-
      Verdadero. El compilador valida contra el tipo de la referencia (`Figura`), que no declara `mostrarInformacion()`. Para usarlo habría que declarar el método en `Figura` o hacer un cast a `Circulo`.
  - kind: 'single-choice'
    id: 'q20'
    prompt: '`ParaMostrar` declara `String mostrarCantLados()`; `Circulo` devuelve "0" y `Rectangulo` devuelve "4". ¿Qué imprime este código?'
    code: |
      ParaMostrar[] figuras = {
          new Circulo("Rojo", 5),
          new Rectangulo("Azul", 4, 6)
      };
      for (ParaMostrar f : figuras) {
          System.out.println(f.mostrarCantLados());
      }
    options:
      - id: 'a'
        text: '0 y luego 4, aunque la referencia sea de tipo `ParaMostrar` (polimorfismo).'
      - id: 'b'
        text: '4 y luego 0, porque se ejecuta el último objeto creado.'
      - id: 'c'
        text: 'Error de compilación: `ParaMostrar` no se puede usar como tipo de un arreglo.'
      - id: 'd'
        text: 'null y null, porque la interfaz no tiene implementación.'
    correctOptionId: 'a'
    explanation: >-
      Se llama al método a través del contrato `ParaMostrar`, pero en ejecución cada objeto responde con su propia implementación: `Circulo` devuelve "0" y `Rectangulo` "4". Es polimorfismo por interfaz: el código que recorre el arreglo no sabe, ni necesita saber, qué figura concreta tiene.
  - kind: 'true-false'
    id: 'q21'
    prompt: '`Rectangulo` puede declararse como `class Rectangulo extends Figura, Marco implements ParaMostrar`, siempre que `Marco` también sea una clase.'
    correctAnswer: false
    explanation: >-
      Falso. Java solo permite herencia simple de clases: una clase puede extender una única clase. En cambio, puede implementar tantas interfaces como necesite, como hace `Rectangulo` al extender `Figura` e implementar `ParaMostrar`.
  - kind: 'single-choice'
    id: 'q22'
    prompt: '`ParaMostrar.mostrarCantLados()` es implícitamente `public`. Si `Circulo` lo implementara sin la palabra `public` (acceso por defecto, de paquete), ¿qué pasaría?'
    code: |
      class Circulo extends Figura implements ParaMostrar {
          String mostrarCantLados() {   // sin public
              return "0";
          }
      }
    options:
      - id: 'a'
        text: 'Compila sin problemas.'
      - id: 'b'
        text: 'Error de compilación: al implementar un método de interfaz no se puede reducir su visibilidad por debajo de `public`.'
      - id: 'c'
        text: 'Compila, pero el método no puede llamarse nunca.'
      - id: 'd'
        text: 'Solo da una advertencia.'
    correctOptionId: 'b'
    explanation: >-
      Una sobrescritura puede ampliar la visibilidad pero nunca reducirla. Como el método de la interfaz es `public`, la implementación también debe serlo. Por eso, en la clase abstracta `Figura` un método de acceso de paquete puede sobrescribirse como `public`, pero no al revés.
  - kind: 'single-choice'
    id: 'q23'
    prompt: '`WindowListener` declara siete métodos y `WindowAdapter` los implementa todos con cuerpo vacío. ¿Cuál es el propósito de esa clase adaptadora?'
    options:
      - id: 'a'
        text: 'Permitir que `WindowListener` se instancie directamente con `new`.'
      - id: 'b'
        text: 'Evitar tener que escribir los métodos vacíos que no te interesan: extendés la clase y sobrescribís solo el que necesitás.'
      - id: 'c'
        text: 'Hacer que los eventos de ventana se ejecuten más rápido.'
      - id: 'd'
        text: 'Reemplazar el uso de interfaces en Java.'
    correctOptionId: 'b'
    explanation: >-
      Implementar `WindowListener` directamente obliga a escribir los siete métodos aunque solo te interese uno. Una clase adaptadora provee implementaciones vacías por defecto, y la subclase sobrescribe únicamente lo relevante, como `windowActivated` en `EventosDeVentana`.
  - kind: 'true-false'
    id: 'q24'
    prompt: '`EventosDeVentana extends WindowAdapter` y sobrescribe solo `windowActivated`. Para que compile, también debe sobrescribir los otros seis métodos de `WindowListener`.'
    code: |
      class EventosDeVentana extends WindowAdapter {
          @Override
          public void windowActivated(WindowEvent e) {
              System.out.println("VENTANA ACTIVA");
          }
      }
    correctAnswer: false
    explanation: >-
      Falso. `WindowAdapter` ya implementa los siete métodos de `WindowListener` con cuerpo vacío, por lo que la subclase hereda esas implementaciones y puede sobrescribir solo los que necesite.
  - kind: 'single-choice'
    id: 'q25'
    prompt: '`miMarco.addWindowListener(new EventosDeVentana());` compila aunque el método espera un `WindowListener` y `EventosDeVentana` extiende `WindowAdapter`. ¿Por qué?'
    options:
      - id: 'a'
        text: 'Porque `EventosDeVentana` hereda de `WindowAdapter`, que implementa `WindowListener`; por lo tanto es un `WindowListener` (relación "es un").'
      - id: 'b'
        text: 'Porque Java convierte automáticamente cualquier clase al tipo que pida el método.'
      - id: 'c'
        text: 'Porque `addWindowListener` acepta cualquier `Object`.'
      - id: 'd'
        text: 'Porque `WindowAdapter` es una subclase de `JFrame`.'
    correctOptionId: 'a'
    explanation: >-
      `WindowAdapter` implementa `WindowListener`, y `EventosDeVentana` extiende `WindowAdapter`, de modo que un `EventosDeVentana` es también un `WindowListener`. Es el mismo polimorfismo por interfaz que permite usar un `Circulo` donde se espera un `ParaMostrar`.
---
