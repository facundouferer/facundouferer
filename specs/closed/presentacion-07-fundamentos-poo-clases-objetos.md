# Spec: Presentación Interactiva — Fundamentos de POO: Clases, Objetos y Atributos

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/07-fundamentos-poo-clases-y-objetos`
  - Archivo de lección: `src/content/courses/java/07-fundamentos-poo-clases-y-objetos.es.md`
  - Slug de la lección: `07-fundamentos-poo-clases-y-objetos`
- **Slug de la presentación**: `fundamentos-poo-clases-objetos-java`
- **Archivo de componente**: `src/components/presentaciones/fundamentos-poo-clases-objetos-java.astro`
- **Asset de tarjeta**: `/img/presentations/fundamentos-poo-clases-objetos-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Clases, Objetos y el Ciclo del Operador new', en: 'Classes, Objects, and the new Operator Lifecycle' }`
  - `description`: `{ es: 'El plano frente a la edificación, ciclo en 4 tiempos de new, puntero this y aliasing en memoria.', en: 'Blueprint vs building, 4-step new lifecycle, this pointer, and memory aliasing.' }`
  - `lesson`: `{ course: 'java', slug: '07-fundamentos-poo-clases-y-objetos' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

El paso de la programación estructurada a la orientada a objetos suele tropezar al confundir el archivo de clase con los objetos vivos:
- Usar la metáfora del **Plano arquitectónico (Clase)** frente a las **Múltiples Edificaciones construidas (Objetos en Heap)**.
- Descomponer el ciclo de instanciación del operador `new` en sus 4 fases exactas de memoria.
- Visualizar el puntero implícito **`this`** resolviendo el sombreamiento de variables (*variable shadowing*).
- Demostrar el concepto de **Aliasing**: qué ocurre cuando dos variables de la pila apuntan a la misma dirección del Heap.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: La Metáfora del Plano vs la Edificación
- **Aspecto conceptual**: La clase `Auto` está escrita una sola vez en el disco. En el Heap podemos tener 100 objetos `Auto` distintos, cada uno con su propio color y matrícula.
- **Gráfica requerida (SVG)**:
  - Lado izquierdo (Plano azul arquitectónico): La clase `CuentaBancaria` con moldes de atributos (`numero`, `titular`, `saldo`).
  - Lado derecho (La ciudad/Heap): Tres casas reales construidas con el mismo plano:
    - Objeto 1: `Cuenta("1001", "Lucía", $5000)`
    - Objeto 2: `Cuenta("1002", "Marcos", $120)`
    - Objeto 3: `Cuenta("1003", "Elena", $94000)`
- **Interacción**: Selector para editar el saldo de la Cuenta 2 y comprobar que el estado de las Cuentas 1 y 3 permanece intacto.

### Slide 2: El Ciclo de Vida del Operador `new` — 4 tiempos en memoria
- **Aspecto conceptual**: `Persona p = new Persona("Ana", 28);` no es una sola acción mágica.
- **Gráfica requerida (SVG animado interactivo)**:
  - Vista dual: Columna izquierda (Stack de ejecución de `main`) y Columna derecha (Heap).
  - Animación paso a paso:
    - **Fase 1 (Reserva)**: `new Persona` pide memoria a la JVM. Se reserva un bloque en el Heap en la dirección `0x5A10`.
    - **Fase 2 (Puesta a cero)**: La JVM inicializa los campos a valores por defecto (`nombre = null`, `edad = 0`).
    - **Fase 3 (Constructor)**: Se ejecuta el constructor `Persona("Ana", 28)` sobre la dirección `0x5A10`, sobreescribiendo los valores iniciales.
    - **Fase 4 (Asignación)**: La dirección `0x5A10` se escribe en la variable local `p` dentro del Stack.
- **Interacción**: Botones "Paso Anterior" y "Paso Siguiente" para que el alumno controle el flujo de la creación.

### Slide 3: El Puntero `this` y el Sombreamiento de Variables
- **Aspecto conceptual**: Cuando el parámetro del método se llama igual que el atributo (`nombre = nombre`), el atributo queda oculto (*shadowed*). `this.nombre` fuerza el acceso al atributo de la instancia actual.
- **Gráfica requerida (SVG)**:
  - Diagrama del método en ejecución:
    - El parámetro local `nombre` ("Pedro") en el stack.
    - El objeto en el Heap con su campo `this.nombre`.
    - Flechas de resolución: sin `this`, la flecha apunta en bucle al parámetro local; con `this`, la flecha viaja hacia el atributo del objeto en el Heap.

### Slide 4: Referencias vs Copias — El peligro del Aliasing
- **Aspecto conceptual**: `Persona b = a;` NO crea un clon del objeto. Solo crea un segundo puntero hacia la misma casilla de memoria.
- **Gráfica requerida (SVG interactivo)**:
  - Dos variables en el Stack: `p1` y `p2`.
  - Ambas contienen la misma dirección `0x5A10` y sus flechas convergen en un único objeto `Persona("Juan")` en el Heap.
  - Simulador: Al cambiar `p2.setNombre("Carlos")`, la variable `p1.getNombre()` también devuelve `"Carlos"` automáticamente.

---

## 4. Estilo y Tokens de Diseño Organic
- Gráficos arquitectónicos amigables, planos con esquinas redondeadas y acentos en terracotta y sage.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/07-fundamentos-poo-clases-y-objetos`
- **WHEN** un alumno recorre la presentación
- **THEN** comprende el ciclo en 4 tiempos de `new` y la diferencia entre duplicar una referencia y duplicar un objeto.
