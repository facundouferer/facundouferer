# Spec: Presentación Interactiva — Clases Abstractas, Interfaces y Modelado en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/09-clases-abstractas-interfaces-y-modelado`
  - Archivo de lección: `src/content/courses/java/11-clases-abstractas-interfaces-y-modelado.es.md`
  - Slug de la lección: `09-clases-abstractas-interfaces-y-modelado`
- **Slug de la presentación**: `clases-abstractas-interfaces-java`
- **Archivo de componente**: `src/components/presentaciones/clases-abstractas-interfaces-java.astro`
- **Asset de tarjeta**: `/img/presentations/clases-abstractas-interfaces-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Clases Abstractas e Interfaces en Java', en: 'Abstract Classes and Interfaces in Java' }`
  - `description`: `{ es: 'Contratos, jerarquías, métodos default y relaciones UML con diagramas interactivos.', en: 'Contracts, hierarchies, default methods, and UML relationships with interactive diagrams.' }`
  - `lesson`: `{ course: 'java', slug: '09-clases-abstractas-interfaces-y-modelado' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

Esta presentación transforma conceptos de arquitectura y diseño orientado a objetos en representaciones visuales comprensibles:
- Visualizar por qué una clase abstracta no puede tener instancias directas en el Heap.
- Representar una interfaz como un conector/enchufe universal que desacopla la invocación de la implementación.
- Comparar visualmente la herencia múltiple de comportamiento (`default methods`) frente a la herencia simple de estado.
- Modelar gráficamente las relaciones UML (Asociación, Agregación, Composición) destacando el ciclo de vida de los objetos en memoria.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: Clase Abstracta — El molde incompleto en memoria
- **Aspecto conceptual**: La clase abstracta define atributos y métodos comunes, pero deja métodos abstractos vacíos para que las subclases los completen.
- **Gráfica requerida (SVG)**:
  - Diagrama de memoria Heap: mostrar un intento fallido de `new Figura()` con un sello rojo de "No instanciable".
  - Al lado, dos objetos concretos instanciados: `new Circulo(radio)` y `new Rectangulo(base, altura)`, mostrando cómo cada uno hereda el molde base pero aloja sus propios campos específicos en el Heap.
  - Conexiones de punteros VTable con el puntero al método `calcularArea()` resuelto dinámicamente según la clase concreta.
- **Interacción**: Selector para alternar entre `Circulo` y `Rectangulo` y observar cómo se calculan las áreas con su fórmula visual correspondiente.

### Slide 2: Interfaces — El contrato y conector universal
- **Aspecto conceptual**: Las interfaces definen capacidades (`can-do`) y desacoplan el cliente de la implementación concreta.
- **Gráfica requerida (SVG)**:
  - Metáfora visual de enchufe/puerto USB: una interfaz `Exportable` con método `exportar()`.
  - Tres dispositivos que encajan en el puerto: `DocumentoPDF`, `ReporteExcel`, `MensajeJSON`.
  - El cliente solo ve el puerto `Exportable` sin conocer los detalles internos de compresión de PDF o serialización JSON.
- **Interacción**: El usuario arrastra o selecciona el exportador para ver el flujo de datos transformándose hacia el formato destino.

### Slide 3: Métodos `default` y `static` en Interfaces (Java 8+)
- **Aspecto conceptual**: Evolución de interfaces sin romper contratos existentes; resolución del "problema del diamante" en interfaces.
- **Gráfica requerida (SVG)**:
  - Diagrama en diamante: Interfaz `A` (método `default void saludar()`), `B` extiende `A`, `C` extiende `A`, y `ClaseD` implementa `B` y `C`.
  - Código visual con el operador `B.super.saludar()` para desambiguar la colisión.
  - Indicadores con colores Organic (`--color-accent` terracotta para advertencia de colisión y `--color-accent-2` sage para resolución).

### Slide 4: Herencia vs Implementación — Tabla de decisión visual
- **Aspecto conceptual**: Matriz clara de cuándo usar `abstract class` (relación `is-a`, estado compartido, constructores) vs `interface` (relación `can-do`, tipos polimórficos ortogonales).
- **Gráfica requerida (SVG / Tarjetas)**:
  - Matriz 2x2 interactiva con iconos claros y contrastes de color.
  - Ejemplo visual de `Pato`: extiende `Ave` (clase abstracta) e implementa `Volador` y `Nadador` (interfaces).

### Slide 5: Namespaces y Packages — La geografía del código
- **Aspecto conceptual**: FQCN (`com.empresa.pagos.Servicio`), visibilidad `package-private`, y prevención de colisiones.
- **Gráfica requerida (SVG)**:
  - Dos cajas de paquetes visuales: `com.tienda.pedidos` y `com.tienda.envios`.
  - Ambas contienen una clase llamada `Item`.
  - Diagrama de colisión resuelto mediante import explícito y FQCN en la clase cliente `Checkout`.
  - Visualización del modificador por defecto (sin keyword): visible dentro del paquete, invisible fuera.

### Slide 6: Modelado de Relaciones — Asociación, Agregación y Composición
- **Aspecto conceptual**: Fuerza de unión y ciclo de vida de los objetos enlazados.
- **Gráfica requerida (SVG)**:
  - **Asociación**: `Conductor` —flecha simple— `Vehiculo` (usan servicios mutuos sin pertenencia).
  - **Agregación**: `Departamento` —rombo blanco— `Profesor` (el profesor sobrevive si el departamento cierra).
  - **Composición**: `Factura` —rombo negro— `ItemFactura` (si se destruye la factura, sus ítems se destruyen en cascada en el Heap).
- **Interacción**: Botón "Destruir contenedor" que anima la recolección de basura (GC) demostrando qué objetos sobreviven y cuáles desaparecen en cada relación.

### Slide 7: Desafío interactivo — Simulador de Medios de Pago
- **Aspecto conceptual**: Ejecución polimórfica de `procesarPago()` sobre un arreglo de `MedioPago` con validación de interfaces `Reembolsable` y `Notificable`.
- **Gráfica requerida (SVG / Simulador)**:
  - Consola gráfica con selector: `TarjetaCredito`, `MercadoPago`, `CryptoTransfer`.
  - Visualización de la llamada al método abstracto implementado y verificación con `instanceof Reembolsable`.
  - Trazado de estado: Saldo, Comisión aplicada, Estado del pago (Aprobado/Rechazado).

---

## 4. Estilo y Tokens de Diseño Organic
- Cumplimiento de [`DESIGN.md`](file:///Users/facundouferer/Devs/facundouferer/DESIGN.md):
  - Paleta: Ground `--color-bg` (#f5ead8), Cards `--color-surface` (#ebddc5), Acentos `--color-accent` (#c67139) y `--color-accent-2` (#7a8a5e).
  - Tipografía: Titulares en Caprasimo, textos y chips de código en Figtree.
  - SVG: `stroke-width="2.75"`, radios redondeados en esquinas (`rx="16"`).

## 5. Criterios de Aceptación
- **GIVEN** un estudiante cursando la lección `09-clases-abstractas-interfaces-y-modelado`
- **WHEN** abre la presentación interactiva
- **THEN** puede recorrer las 7 diapositivas con botones o flechas del teclado
- **AND** cada concepto clave está ilustrado con su diagrama SVG explicativo
- **AND** la presentación se encuentra registrada en `src/data/presentations.ts` y se accede desde el botón del encabezado de la lección.
