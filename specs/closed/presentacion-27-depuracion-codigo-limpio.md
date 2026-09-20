# Spec: Presentación Interactiva — Depuración, Código Limpio y Refactorización

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/27-depuracion-codigo-limpio-y-refactorizacion`
  - Archivo de lección: `src/content/courses/java/27-depuracion-codigo-limpio-y-refactorizacion.es.md`
  - Slug de la lección: `27-depuracion-codigo-limpio-y-refactorizacion`
- **Slug de la presentación**: `depuracion-codigo-limpio-java`
- **Archivo de componente**: `src/components/presentaciones/depuracion-codigo-limpio-java.astro`
- **Asset de tarjeta**: `/img/presentations/depuracion-codigo-limpio-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Depuración, Código Limpio y Refactorización', en: 'Debugging, Clean Code, and Refactoring' }`
  - `description`: `{ es: 'El bucle científico de depuración, breakpoints y watches en el IDE, catálogo de code smells y refactor seguro con JUnit.', en: 'Scientific debugging loop, breakpoints and watches in the IDE, code smells catalog, and test-backed refactoring.' }`
  - `lesson`: `{ course: 'java', slug: '27-depuracion-codigo-limpio-y-refactorizacion' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

Escribir código que la máquina entienda es solo la mitad del trabajo; la otra mitad es escribir código que los seres humanos puedan mantener, diagnosticar y mejorar:
- Desterrar la práctica de "probar cosas al azar con `System.out.println`" y enseñar el **bucle sistemático de depuración**.
- Visualizar la anatomía de un **Stack Trace** para identificar de inmediato la línea y el archivo culpable.
- Demostrar el funcionamiento de las herramientas de un **Depurador Moderno (IDE)**: breakpoints de línea, breakpoints condicionales, panel de variables, watches y controles de stepping (*Step Over*, *Step Into*, *Step Out*).
- Crear una galería gráfica interactiva de **Code Smells** habituales (*Long Method*, *Primitive Obsession*, *Feature Envy*, *God Class*).
- Modelar el proceso de **Refactorización Segura en Pasos Mínimos**, siempre respaldado por tests unitarios en verde.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: El Bucle Científico de Depuración y la Traza de Pila
- **Aspecto conceptual**: La depuración es un ciclo de investigación empírico (Reproducir -> Hipótesis -> Observar -> Corregir causa raíz -> Verificar). Una traza de pila se lee de arriba hacia abajo para encontrar el primer marco de nuestro propio código.
- **Gráfica requerida (SVG interactivo)**:
  - Diagrama circular del bucle de 5 pasos con flechas continuas.
  - Cuadro de simulación de un error real de consola:
    ```text
    Exception in thread "main" java.lang.NullPointerException: Cannot invoke "Order.subtotal()"
        at OrderCalculator.total(OrderCalculator.java:14)   <-- [MARCO RELEVANTE RESALTADO EN TERRACOTTA]
        at Main.main(Main.java:9)
    ```
  - Flechas explicativas desglosando el tipo de excepción, el mensaje explicativo y la pila de llamadas (*Call Stack*).

### Slide 2: La Cabina de Mando del Depurador (Breakpoints, Watches y Stepping)
- **Aspecto conceptual**: Un depurador congela el tiempo de ejecución de la JVM y permite examinar el estado de la memoria en vivo sin modificar el archivo fuente.
- **Gráfica requerida (Mockup interactivo de interfaz de IDE en SVG)**:
  - Columna izquierda (Código fuente):
    - Punto rojo en el margen (Breakpoint incondicional).
    - Punto naranja con signo de interrogación (Breakpoint condicional: `itemCount > 10`).
  - Columna central (Controles de stepping con flechas direccionales):
    - *Step Over* (salta la línea sin entrar al método).
    - *Step Into* (ingresa al código interno del método invocado).
    - *Step Out* (termina el método y vuelve al llamador).
    - *Resume* (continúa hasta el siguiente breakpoint).
  - Columna derecha (Paneles de inspección):
    - Variables locales activas con sus direcciones y valores primitivos.
    - Panel de *Watches* evaluando expresiones arbitrarias en tiempo real (`order.getItems().size()`).

### Slide 3: Museo Gráfico de Code Smells (Síntomas de Diseño Débil)
- **Aspecto conceptual**: Un *code smell* no es un fallo que impida compilar; es una señal de que el código será frágil y costoso de mantener a futuro.
- **Gráfica requerida (Tarjetas visuales comparativas)**:
  - Tarjeta 1: **Long Method** (Un pergamino interminable de 150 líneas -> Solución: *Extract Method*).
  - Tarjeta 2: **Primitive Obsession** (Usar `String telefono` y `double precio, String moneda` -> Solución: Introducir `PhoneNumber` y `Money`).
  - Tarjeta 3: **Feature Envy** (Un método en `Factura` que interactúa únicamente con los getters de `Cliente` -> Solución: *Move Method* a `Cliente`).
  - Tarjeta 4: **God Class** (Una clase `SistemaManager` con 50 métodos y 3.000 líneas -> Solución: Dividir por responsabilidad única).
- **Interacción**: Selector que permite hacer clic en cada smell y ver el extracto de código problemático junto con su prescripción técnica.

### Slide 4: Refactorización Segura — El Cinturón de Seguridad de JUnit
- **Aspecto conceptual**: Refactorizar es alterar la estructura interna sin cambiar el comportamiento observable. La regla de oro: nunca se refactoriza sobre código sin tests que estén en verde.
- **Gráfica requerida (SVG de ciclo de refactorización)**:
  - Paso 1: Suite de tests JUnit corriendo en VERDE (garantía de comportamiento actual).
  - Paso 2: Aplicar UN solo cambio estructural pequeño (ej. *Extract Method* con atajo del IDE).
  - Paso 3: Ejecutar la suite de nuevo de inmediato.
    - Si sigue en VERDE: Paso completado; commit atómico.
    - Si se pone en ROJO: Revertir de inmediato con `git checkout` o `Ctrl+Z`; no acumular errores.
  - Ilustración de las *Guard Clauses*: Aplanamiento de la "pirámide de la fatalidad" reemplazando `if/else` anidados de 4 niveles por retornos tempranos directos.

### Slide 5: Caso de Estudio en Vivo — De Código Espagueti a Código Limpio
- **Aspecto conceptual**: Transformación integral de una función de facturación con múltiples responsabilidades y números mágicos en un diseño modular, testeable y autodocumentado.
- **Gráfica requerida (Comparador interactivo antes / después)**:
  - Vista interactiva tipo *Diff Split*:
    - Lado Izquierdo (Antes): 45 líneas compactas, `0.21` clavado a fuego, variables llamadas `aux` y `flag`, 3 niveles de indentación.
    - Lado Derecho (Después): 12 líneas limpias, constantes con nombre (`IVA_GENERAL`), métodos pequeños con nombres descriptivos (`calcularDescuentoVolumen()`), sin números mágicos.

---

## 4. Estilo y Tokens de Diseño Organic
- Estética limpia y técnica enmarcada en el Organic Design System: fondos neutrales suaves, acentos de atención en terracotta (`--color-accent`) y estados de éxito en sage (`--color-accent-2`).
- Tipografía Figtree para código y diagramas, Caprasimo para encabezados.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/27-depuracion-codigo-limpio-y-refactorizacion`
- **WHEN** un alumno recorre la presentación
- **THEN** domina el uso del depurador con breakpoints y stepping, sabe reconocer los code smells más habituales y entiende cómo refactorizar con seguridad bajo cobertura de tests.
