# Spec: Presentación Interactiva — Control de Flujo y Bucles en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/03-control-de-flujo-y-bucles`
  - Archivo de lección: `src/content/courses/java/03-control-de-flujo-y-bucles.es.md`
  - Slug de la lección: `03-control-de-flujo-y-bucles`
- **Slug de la presentación**: `control-flujo-bucles-java`
- **Archivo de componente**: `src/components/presentaciones/control-flujo-bucles-java.astro`
- **Asset de tarjeta**: `/img/presentations/control-flujo-bucles-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Control de Flujo: Condicionales y Bucles en Java', en: 'Control Flow: Conditionals and Loops in Java' }`
  - `description`: `{ es: 'Diagramas de flujo animados de if/else, switch moderno, y la anatomía interna de for, while y do-while.', en: 'Animated flowcharts of if/else, modern switch, and the internal anatomy of for, while, and do-while.' }`
  - `lesson`: `{ course: 'java', slug: '03-control-de-flujo-y-bucles' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

Los condicionales y los bucles son los rieles por donde viaja la ejecución de un programa:
- Traducir estructuras de control a **Diagramas de Flujo interactivos** con bifurcaciones claras.
- Visualizar el peligro del *fall-through* en `switch` clásico por olvidar un `break`, contrastándolo con las expresiones `switch` modernas con flechas (`->`).
- Deconstruir el ciclo de vida del bucle `for` en sus 4 tiempos exactos: 1. Inicialización, 2. Evaluación de condición, 3. Cuerpo, 4. Incremento.
- Demostrar físicamente la diferencia entre `while` (puede ejecutarse cero veces) y `do-while` (garantiza al menos una ejecución).
- Animar el comportamiento de `break` (escape total del bucle) frente a `continue` (salto inmediato a la siguiente iteración).

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: La Bifurcación — `if`, `else if`, `else`
- **Aspecto conceptual**: Evaluación secuencial excluyente. La primera condición que dé `true` ejecuta su bloque y salta todo el resto.
- **Gráfica requerida (SVG interactivo)**:
  - Vía férrea con agujas de desvío:
    - Rombo 1 (`edad < 13`): Desvío hacia "Infantil".
    - Rombo 2 (`edad < 18`): Desvío hacia "Juvenil".
    - Vía directa por defecto (`else`): "Adulto".
- **Interacción**: Deslizador de edad para ver el vagón deslizarse y tomar el carril correspondiente en tiempo real.

### Slide 2: El Operador Ternario `condicion ? valor1 : valor2`
- **Aspecto conceptual**: Expresión compacta que evalúa y produce un valor en una sola línea.
- **Gráfica requerida (SVG)**:
  - Báscula o compuerta selector: entra una señal booleana; si es verde conmuta la salida al canal A, si es roja conmuta al canal B.

### Slide 3: `switch` Clásico vs `switch` Moderno (`->`)
- **Aspecto conceptual**:
  - Peligro del switch clásico: olvidar `break` provoca caída en cascada ejecutando casos indeseados (*fall-through*).
  - Moderno (Java 14+): Sintaxis con flecha `case LUNES -> "Comienzo de semana";` sin fall-through y con capacidad de retornar valores directamente.
- **Gráfica requerida (SVG)**:
  - Dos paneles interactivos:
    - Izquierda (Con error): Una bola cae en el `case 1`, y por no tener `break`, rueda y activa también el `case 2` y el `case 3` por accidente.
    - Derecha (Moderno con `->`): La bola entra en el compartimento exclusivo y una compuerta la extrae limpiamente sin tocar los demás casos.

### Slide 4: Anatomía del Bucle `for` — El ciclo en 4 tiempos
- **Aspecto conceptual**: La trampa frecuente de creer que todo en `for (int i = 0; i < n; i++)` corre a la vez.
- **Gráfica requerida (SVG con simulador)**:
  - Visualización circular con 4 cuadrantes numerados y un puntero de reloj:
    - Tiempo 1 (Solo una vez al inicio): `int i = 0;`
    - Tiempo 2 (Al entrar): ¿Es `i < 3`? Si es true, avanza.
    - Tiempo 3 (Adentro): Ejecuta el cuerpo del bucle.
    - Tiempo 4 (Al terminar el cuerpo): Incrementa `i++`. Vuelve al Tiempo 2.
- **Interacción**: Botón "Tick" para que el alumno avance el reloj paso a paso, viendo cómo cambia la variable `i` en la tabla de traza lateral.

### Slide 5: `while` vs `do-while` — ¿Quién revisa la entrada?
- **Aspecto conceptual**:
  - `while`: Revisa la entrada en la puerta. Si la condición es falsa de arranque, el cuerpo NUNCA se ejecuta.
  - `do-while`: Deja pasar primero y pide el boleto a la salida. Siempre se ejecuta al menos una vez (ideal para menús interactivos).
- **Gráfica requerida (SVG)**:
  - Metáfora del molinete de acceso:
    - `while`: Molinete en la entrada del salón.
    - `do-while`: Salón abierto con molinete ubicado en la puerta de salida.

### Slide 6: Control de Flujo: `break` vs `continue`
- **Aspecto conceptual**:
  - `break`: Rompe la repetición y eyecta el puntero de ejecución fuera del bucle.
  - `continue`: Cancela el resto de la iteración actual y salta directo al siguiente incremento.
- **Gráfica requerida (SVG interactivo)**:
  - Bucle iterando sobre números del 1 al 10.
  - Al llegar a 5:
    - Con `break`: Animación de un muro que clausura el bucle y salta a la línea posterior al for.
    - Con `continue`: Animación de un trampolín que esquiva el `println` del número 5 y cae directo en el 6.

---

## 4. Estilo y Tokens de Diseño Organic
- Gráficos de rieles y compuertas con curvas suaves, terminales redondeadas, paleta Organic.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/03-control-de-flujo-y-bucles`
- **WHEN** el alumno ejecuta la presentación
- **THEN** puede operar el reloj de 4 tiempos del bucle `for` y verificar el desvío visual de `break` y `continue`.
