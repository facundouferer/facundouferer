# Spec: Presentación Interactiva — Herencia, Polimorfismo y Sobrecarga de Métodos

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/08-herencia-polimorfismo-y-sobrecarga`
  - Archivo de lección: `src/content/courses/java/10-herencia-polimorfismo-y-sobrecarga.es.md`
  - Slug de la lección: `08-herencia-polimorfismo-y-sobrecarga`
- **Slug de la presentación**: `herencia-polimorfismo-sobrecarga-java`
- **Archivo de componente**: `src/components/presentaciones/herencia-polimorfismo-sobrecarga-java.astro`
- **Asset de tarjeta**: `/img/presentations/herencia-polimorfismo-sobrecarga-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Herencia, Despacho Dinámico y Polimorfismo', en: 'Inheritance, Dynamic Method Dispatch, and Polymorphism' }`
  - `description`: `{ es: 'Prueba "es-un", encadenamiento de constructores con super(), sobrecarga vs sobrescritura y la tabla virtual de métodos (vtable).', en: '"Is-a" test, constructor chaining with super(), overloading vs overriding, and the virtual method table (vtable).' }`
  - `lesson`: `{ course: 'java', slug: '08-herencia-polimorfismo-y-sobrecarga' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

La herencia y el polimorfismo son dos de los conceptos más malinterpretados en POO:
- Demostrar la regla fundamental **"Es-Un" frente a "Tiene-Un"** para evitar jerarquías rígidas y favorecer la composición.
- Visualizar en memoria cómo un objeto de subclase en el Heap encapsula los campos de su superclase, y cómo funciona el encadenamiento de constructores con **`super()`**.
- Clarificar la frontera técnica entre **Sobrecarga (Overloading)** (tiempo de compilación, misma clase) y **Sobrescritura (Overriding)** (tiempo de ejecución, herencia).
- Iluminar el mecanismo del **Despacho Dinámico de Métodos (*Dynamic Method Dispatch*)** y la tabla de métodos virtuales (*vtable*).
- Graficar el polimorfismo en colecciones heterogéneas (`List<Vehiculo>`) y el casting seguro con `instanceof`.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: El Filtro Mental — "Es un" vs "Tiene un" (Herencia vs Composición)
- **Aspecto conceptual**: La herencia genera un acoplamiento permanente. Si la relación no supera la prueba "X es un Y", debe usarse composición ("X tiene un Y").
- **Gráfica requerida (SVG comparativo)**:
  - Lado izquierdo: **Herencia válida (`Auto extends Vehiculo`)**.
    - Tarjeta de `Vehiculo` arriba con atributos y métodos comunes. Flecha blanca triangular UML apuntando a la superclase desde `Auto`, `Moto` y `Camion`.
  - Lado derecho: **Error de modelado corregido (`Auto` y `Motor`)**.
    - Cruz roja sobre `Auto extends Motor`.
    - Check verde sobre `Auto` conteniendo una referencia privada `private Motor motor;` (composición en diamante).
- **Interacción**: Test interactivo de 3 preguntas rápidas ("¿Cliente es una Persona?", "¿Factura es una LíneaDeFactura?", "¿Cuadrado es un Rectángulo?") mostrando el veredicto arquitectónico.

### Slide 2: El Heap en Capas y el Encadenamiento con `super()`
- **Aspecto conceptual**: Al instanciar `new Auto("Toyota")`, no se crean dos objetos. Se crea un único objeto en el Heap compuesto por capas concéntricas (la capa `Vehiculo` y la envoltura `Auto`).
- **Gráfica requerida (SVG animado)**:
  - Diagrama de corte transversal del objeto en el Heap (`0x7B20`):
    - Núcleo interno: atributos heredados de `Vehiculo` (`marca = "Toyota"`).
    - Capa externa: atributos propios de `Auto` (`baulAbierto = false`).
  - Línea de tiempo de constructores:
    1. Llamada a `new Auto("Toyota")`.
    2. `super("Toyota")` se ejecuta antes de cualquier lógica propia de `Auto`.
    3. Inicialización del estado de `Vehiculo`.
    4. Ejecución del cuerpo de `Auto`.
- **Interacción**: Botón "Ver traza de constructores" que resalta paso a paso la regla: la superclase siempre nace antes que la subclase.

### Slide 3: Sobrecarga vs Sobrescritura — Compilación vs Runtime
- **Aspecto conceptual**:
  - Sobrecarga (*Overload*): Mismo nombre, distinta firma (parámetros). Resuelto por el compilador (*static binding*).
  - Sobrescritura (*Override*): Misma firma en subclase. Resuelto en tiempo de ejecución (*dynamic binding*).
- **Gráfica requerida (SVG / Matriz de decisión)**:
  - Tabla visual con dos columnas claras:
    - Columna A: Sobrecarga (`imprimir(int)`, `imprimir(String)`). Icono de javac evaluando tipos en el código estático.
    - Columna B: Sobrescritura (`@Override void arrancar()`). Icono de la JVM en caliente decidiendo a qué bloque de código saltar según la instancia real.
  - Alerta visual del `@Override`: Qué pasa si nos equivocamos de firma sin `@Override` (se convierte en sobrecarga accidental silenciosa).

### Slide 4: Despacho Dinámico y la Tabla de Métodos Virtuales (vtable)
- **Aspecto conceptual**:
  - `Vehiculo miAuto = new Auto("Ford");`
  - El compilador revisa el **tipo de la referencia** (`Vehiculo`): ¿tiene el método `arrancar()`? Sí.
  - En ejecución, la JVM inspecciona el **tipo del objeto real** en el Heap (`Auto`) a través de la vtable y ejecuta la versión sobrescrita.
- **Gráfica requerida (SVG de memoria y punteros de código)**:
  - Stack: Variable `miAuto` de tipo estático `Vehiculo` apuntando al Heap.
  - Heap: Objeto real con su puntero de clase (*klass pointer*) a la definición `Auto.class`.
  - Panel vtable: La tabla de funciones apunta a la dirección de memoria de `Auto.arrancar()`, no a `Vehiculo.arrancar()`.
- **Interacción**: Simulador con selector de tipo dinámico: cambiar la instancia a `Moto` o `Camion` y ver cómo el puntero de ejecución viaja a la implementación concreta.

### Slide 5: Colecciones Polimórficas, Casting Seguro y Pattern Matching
- **Aspecto conceptual**: Tratar objetos distintos bajo una interfaz común (`List<Vehiculo>`), invocando métodos polimórficos en un solo bucle. Downcasting seguro con `instanceof`.
- **Gráfica requerida (SVG de pasarela)**:
  - Una cinta transportadora (`List<Vehiculo> flota`) que contiene un `Auto`, una `Moto` y un `Camion`.
  - El bucle llama a `v.arrancar()`: cada vehículo reacciona a su manera sin ningún `switch` ni `if` de tipo.
  - Bloque condicional moderno de Java:
    - Código clásico ruidoso: `if (v instanceof Auto) { Auto a = (Auto) v; a.abrirBaul(); }`
    - Java 16+ Pattern Matching: `if (v instanceof Auto a) { a.abrirBaul(); }`

---

## 4. Estilo y Tokens de Diseño Organic
- Diagramas UML estilizados con el sistema Organic: bordes suaves (`var(--radius-md)`), colores terracotta (`--color-accent`) y sage (`--color-accent-2`), tipografía Figtree y titulares Caprasimo.
- Sin artificios de frameworks externos: SVG puro, accesible y reactivo.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/08-herencia-polimorfismo-y-sobrecarga`
- **WHEN** un estudiante explora la presentación
- **THEN** distingue con certeza cuándo usar herencia vs composición, entiende el papel de `super()`, y comprende cómo la JVM realiza el despacho dinámico mediante la vtable.
