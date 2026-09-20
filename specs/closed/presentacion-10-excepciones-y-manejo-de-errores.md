# Spec: Presentación Interactiva — Excepciones y Manejo de Errores en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/10-excepciones-y-manejo-de-errores`
  - Archivo de lección: `src/content/courses/java/12-excepciones-y-manejo-de-errores.es.md`
  - Slug de la lección: `10-excepciones-y-manejo-de-errores`
- **Slug de la presentación**: `excepciones-manejo-errores-java`
- **Archivo de componente**: `src/components/presentaciones/excepciones-manejo-errores-java.astro`
- **Asset de tarjeta**: `/img/presentations/excepciones-manejo-errores-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Manejo de Excepciones y Robustez en Java', en: 'Exception Handling and Robustness in Java' }`
  - `description`: `{ es: 'Propagación en la pila de llamadas, try-with-resources y jerarquía Throwable con simulaciones paso a paso.', en: 'Call stack propagation, try-with-resources, and Throwable hierarchy with step-by-step simulations.' }`
  - `lesson`: `{ course: 'java', slug: '10-excepciones-y-manejo-de-errores' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

El manejo de excepciones suele enseñarse de forma abstracta o meramente sintáctica. Esta presentación tiene como objetivo:
- Mostrar que una excepción es un **objeto vivo en el Heap** con stack trace, mensaje y causa.
- Visualizar el proceso físico de **desenrollado del Call Stack (Stack Unwinding)** cuando se lanza una excepción.
- Distinguir de forma cromática y estructural las excepciones Checked (exigidas por el compilador) de las Unchecked (errores de programación o bugs).
- Desmitificar el orden de ejecución de `try`, `catch`, `finally` y el cierre automático de `try-with-resources`.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: El árbol genealógico de `Throwable`
- **Aspecto conceptual**: La raíz `Throwable` y sus dos grandes ramas: `Error` (problemas fatales de la JVM como `OutOfMemoryError`) y `Exception` (recuperables).
- **Gráfica requerida (SVG)**:
  - Diagrama de árbol con jerarquía de clases tipadas en colores Organic:
    - Raíz: `Throwable`.
    - Rama izquierda: `Error` (rojo terracota oscuro, con ícono de advertencia de sistema: `StackOverflowError`, `OutOfMemoryError`).
    - Rama derecha: `Exception` (azul sage).
      - Sub-rama: `RuntimeException` (Unchecked: `NullPointerException`, `IndexOutOfBoundsException`, `IllegalArgumentException`).
      - Sub-rama: Checked Exceptions (`IOException`, `SQLException`).
  - Línea divisoria marcada: "El Compilador te obliga a declarar o atrapar" vs "Errores lógicos de runtime".
- **Interacción**: Filtro para resaltar solo Checked o solo Unchecked, mostrando el impacto en la firma del método (`throws`).

### Slide 2: Anatomía de una Excepción en Memoria
- **Aspecto conceptual**: `throw new MiExcepcion("Mensaje")` instancia un objeto en el Heap que toma una instantánea del Call Stack actual.
- **Gráfica requerida (SVG)**:
  - Visualización del Heap: Caja del objeto `MiExcepcion` con sus campos internos:
    - `message: "Saldo insuficiente: $500 requerido, $120 disponible"`
    - `stackTrace: [ Operacion.debitar(), Cajero.retirar(), Main.main() ]`
    - `cause: null`
  - Puntero desde la referencia del método activo hacia el objeto en el Heap.

### Slide 3: Desenrollado de la Pila (Call Stack Unwinding) — Simulador paso a paso
- **Aspecto conceptual**: Si un método lanza una excepción y no la atrapa, su marco de pila se destruye y la excepción sube al llamador.
- **Gráfica requerida (SVG)**:
  - Representación vertical de la Pila de Ejecución (Call Stack) con 4 marcos:
    - `main()` (posee bloque `try-catch`)
    - `procesarOrden()`
    - `validarStock()`
    - `consultarBaseDeDatos()` (aquí ocurre `SQLException`)
- **Interacción paso a paso**:
  - Paso 1: Ocurre el error en `consultarBaseDeDatos()`. Se crea el objeto excepción.
  - Paso 2: `consultarBaseDeDatos()` no tiene catch. El frame explota/desaparece.
  - Paso 3: Sube a `validarStock()`, no tiene catch. El frame desaparece.
  - Paso 4: Sube a `procesarOrden()`, no tiene catch. El frame desaparece.
  - Paso 5: Llega a `main()`. El bloque `catch (SQLException e)` captura el objeto. El programa se recupera y no colapsa.

### Slide 4: Máquina de estados de `try-catch-finally`
- **Aspecto conceptual**: Garantía de ejecución de `finally` incluso con retornos tempranos o excepciones no atrapadas.
- **Gráfica requerida (SVG)**:
  - Diagrama de flujo con carriles de estado:
    - Ruta A (Camino feliz): `try` completo -> salta `catch` -> ejecuta `finally` -> sigue el programa.
    - Ruta B (Error atrapado): `try` falla en línea N -> salta al `catch` coincidente -> ejecuta `finally` -> sigue el programa.
    - Ruta C (Error no atrapado): `try` falla -> no coincide ningún `catch` -> ejecuta `finally` -> la excepción continúa subiendo.
- **Interacción**: Botones para detonar cada una de las tres rutas y ver cómo se iluminan los bloques correspondientes.

### Slide 5: `try-with-resources` y la interfaz `AutoCloseable`
- **Aspecto conceptual**: Cierre seguro de recursos sin anidar `finally` farragosos.
- **Gráfica requerida (SVG)**:
  - Comparativa lado a lado:
    - Izquierda: El código legado de 25 líneas con `finally` y `null-checks` propensos a bugs.
    - Derecha: `try (BufferedReader br = ...)`, mostrando el resorte automático que invoca `close()` antes del catch y finally.
  - Diagrama de secuencia temporal ilustrando el momento exacto en que la JVM llama a `br.close()`.

### Slide 6: Excepciones personalizadas y encadenamiento de causas
- **Aspecto conceptual**: Traducir excepciones técnicas de bajo nivel a excepciones del dominio (`PagoFallidoException` causada por `SocketTimeoutException`).
- **Gráfica requerida (SVG)**:
  - Diagrama de capas arquitectónicas (Infraestructura -> Dominio).
  - Dos objetos conectados por la flecha `cause`: `PagoFallidoException` encapsulando `SocketTimeoutException`.
  - Impresión de consola simulada mostrando `Caused by: java.net.SocketTimeoutException: Read timed out`.

### Slide 7: Desafío guiado — Los 4 Antipatrones a evitar
- **Aspecto conceptual**: Errores comunes que arruinan la observabilidad en producción.
- **Gráfica requerida (Tarjetas con código interactivo)**:
  - 1. *El tragador de errores* (`catch (Exception e) {}`): Animación de advertencia de "Bomba de tiempo silenciosa".
  - 2. *El atrapador indiscriminado* (`catch (Throwable t)`): Captura de `ThreadDeath` o `VirtualMachineError`.
  - 3. *Loguear y relanzar*: Duplicación del stack trace en los logs.
  - 4. *Perder la causa original* (`throw new MiExcepcion(e.getMessage())` sin pasar `e`).

---

## 4. Estilo y Tokens de Diseño Organic
- Gráficos claros con esquinas redondeadas (`rx="16"`).
- Colores para severidad: Acento terracota (`--color-accent`) para excepciones y stack unwinding, Sage (`--color-accent-2`) para bloques recuperados y `AutoCloseable`.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/10-excepciones-y-manejo-de-errores`
- **WHEN** un estudiante ingresa a su presentación
- **THEN** comprende visualmente el flujo de ejecución y el desenrollado de la pila mediante la animación interactiva paso a paso
- **AND** la presentación cuenta con textos bilingües y soporte de accesibilidad.
