# Spec: Presentación Interactiva — Constructores, Encapsulamiento y Modificadores de Acceso

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/07-constructores-y-encapsulamiento`
  - Archivo de lección: `src/content/courses/java/08-constructores-y-encapsulamiento.es.md`
  - Slug de la lección: `07-constructores-y-encapsulamiento`
- **Slug de la presentación**: `constructores-encapsulamiento-java`
- **Archivo de componente**: `src/components/presentaciones/constructores-encapsulamiento-java.astro`
- **Asset de tarjeta**: `/img/presentations/constructores-encapsulamiento-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Constructores, Encapsulamiento y Fuga de Referencia', en: 'Constructors, Encapsulation, and Reference Leaks' }`
  - `description`: `{ es: 'Delegación this(), matriz de los 4 modificadores de acceso, copia defensiva e inmutabilidad.', en: 'this() delegation, 4 access modifiers matrix, defensive copying, and immutability.' }`
  - `lesson`: `{ course: 'java', slug: '07-constructores-y-encapsulamiento' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

El encapsulamiento no es simplemente poner `private` y generar getters y setters ciegamente:
- Visualizar el **Constructor como Guardián de Invariantes**: garantizar que ningún objeto nazca en un estado inválido o corrupto.
- Animar la **Delegación de Constructores con `this(...)`**: cómo un constructor sobrecargado invoca a otro para evitar código duplicado.
- Presentar la **Matriz Interactiva de los 4 Modificadores de Acceso** (`public`, `protected`, `package-private`, `private`).
- Ilustrar el peligro invisible de la **Fuga de Referencia (Reference Leak)**: cómo exponer un atributo mutable (como una `Date` o `List`) rompe el encapsulamiento permitiendo mutaciones externas no autorizadas.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: El Constructor — La aduana de los invariantes
- **Aspecto conceptual**: La creación del objeto es el único momento en que se pueden rechazar parámetros inválidos antes de que el objeto exista en el sistema.
- **Gráfica requerida (SVG)**:
  - Aduana de control:
    - Intento 1: `new Estudiante("Ana", -5)`. El guardia del constructor detecta `nota < 0`, dispara `IllegalArgumentException` y el objeto es destruido antes de registrarse.
    - Intento 2: `new Estudiante("Ana", 9)`. Pasa la validación y el objeto se construye con sello de integridad verificado.

### Slide 2: Sobrecarga y Delegación con `this(...)`
- **Aspecto conceptual**: Reutilizar la lógica de inicialización en un solo constructor principal o canónico.
- **Gráfica requerida (SVG)**:
  - Cascada de constructores:
    - Constructor 1: `public Libro(String titulo)` -> llama a `this(titulo, "Anónimo", 0.0);`
    - Constructor 2: `public Libro(String titulo, String autor)` -> llama a `this(titulo, autor, 0.0);`
    - Constructor Principal: valida y asigna todos los campos.
  - Animación de flechas de invocación mostrando por qué `this(...)` debe ser la primera sentencia obligatoria.

### Slide 3: Matriz Interactiva de los 4 Modificadores de Acceso
- **Aspecto conceptual**: El alcance visible de los miembros de una clase.
- **Gráfica requerida (Tabla matricial interactiva)**:
  - 4 niveles de visibilidad:
    1. `private`: Solo dentro de la misma clase (escudo rojo).
    2. *default* (package-private): Dentro del mismo paquete (escudo naranja).
    3. `protected`: Mismo paquete + subclases en otros paquetes (escudo amarillo).
    4. `public`: Visible desde todo el universo (escudo verde).
- **Interacción**: El usuario selecciona un modificador y ve en un mapa de paquetes qué clases tienen acceso y cuáles quedan bloqueadas.

### Slide 4: La Fuga de Referencia (*Reference Leak*) — El caballo de Troya
- **Aspecto conceptual**: Si un getter devuelve la referencia directa a una colección o fecha interna (`return this.fechas;`), un atacante externo puede mutar la lista interna saltándose todos los setters y validaciones.
- **Gráfica requerida (SVG interactivo)**:
  - Diagrama del objeto `HistorialMedico` en el Heap con su lista interna privada `consultas`.
  - El getter inseguro `getConsultas()` devuelve el puntero a esa lista.
  - El código cliente hace `historial.getConsultas().clear();`.
  - La lista interna queda borrada sin que el objeto `HistorialMedico` haya podido impedirlo.
  - **Solución con Copia Defensiva**: Mostrar cómo devolver `new ArrayList<>(this.consultas)` o `Collections.unmodifiableList(this.consultas)` neutraliza el ataque.

### Slide 5: Inmutabilidad — El encapsulamiento llevado a la perfección
- **Aspecto conceptual**: Objetos cuyos datos jamás cambian tras su creación (ej. `String`, `LocalDate`, `record`).
- **Gráfica requerida (SVG)**:
  - Caja blindada: Atributos `private final`, sin métodos setters, con copias defensivas en el constructor.
  - Los hilos concurrentes pueden leer el objeto simultáneamente sin riesgo de condiciones de carrera ni bloqueos.

---

## 4. Estilo y Tokens de Diseño Organic
- Gráficos de escudos y blindaje visual redondeado, contrastes con acento terracota para advertencias y sage para copias defensivas.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/07-constructores-y-encapsulamiento`
- **WHEN** un alumno explora la presentación
- **THEN** comprende la fuga de referencia a través de la animación interactiva y domina la matriz de modificadores de acceso.
