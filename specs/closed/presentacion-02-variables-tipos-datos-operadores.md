# Spec: Presentación Interactiva — Variables, Tipos de Datos y Operadores en Java

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/02-variables-tipos-datos-y-operadores`
  - Archivo de lección: `src/content/courses/java/02-variables-tipos-datos-y-operadores.es.md`
  - Slug de la lección: `02-variables-tipos-datos-y-operadores`
- **Slug de la presentación**: `variables-tipos-datos-operadores-java`
- **Archivo de componente**: `src/components/presentaciones/variables-tipos-datos-operadores-java.astro`
- **Asset de tarjeta**: `/img/presentations/variables-tipos-datos-operadores-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Variables, Tipos de Datos y Operadores en Java', en: 'Variables, Data Types, and Operators in Java' }`
  - `description`: `{ es: 'Los 8 tipos primitivos en memoria, casting implícito/explícito y cortocircuito lógico con simulador.', en: 'The 8 primitive types in memory, implicit/explicit casting, and logical short-circuit simulator.' }`
  - `lesson`: `{ course: 'java', slug: '02-variables-tipos-datos-y-operadores' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

Comprender cómo se estructuran los tipos de datos en los registros y en la memoria Stack evita desbordamientos y errores de redondeo numérico:
- Visualizar los **8 tipos primitivos** con sus anchos en bits (`1`, `8`, `16`, `32`, `64`) y sus rangos matemáticos en complemento a dos.
- Explicar físicamente el **Casting de Tipos**: ensanchamiento seguro (*Widening*) vs estrechamiento peligroso (*Narrowing*) con desbordamiento (*Integer Overflow*).
- Demostrar el mecanismo de **Evaluación de Cortocircuito** en operadores lógicos (`&&` y `||`), donde la segunda expresión ni siquiera se ejecuta si la primera ya define el resultado.
- Contrastar el almacenamiento directo de primitivos en la pila frente a las variables de referencia que apuntan al Heap.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: Los 8 Tipos Primitivos — El tamaño físico en memoria
- **Aspecto conceptual**: Java es de tipado estático y fuerte. Los primitivos no son objetos; son valores puros en bits.
- **Gráfica requerida (SVG interactivo)**:
  - 8 bloques o casilleros proporcionales a su ancho en bits:
    - `boolean`: 1 bit conceptual (bandera true/false).
    - `byte`: 8 bits ($-128$ a $127$).
    - `short`: 16 bits ($-32.768$ a $32.767$).
    - `char`: 16 bits sin signo ($0$ a $65.535$, código Unicode UTF-16).
    - `int`: 32 bits ($-2 \times 10^9$ a $2 \times 10^9$, el tipo entero estándar).
    - `long`: 64 bits (sufijo `L`).
    - `float`: 32 bits punto flotante IEEE 754 (sufijo `F`).
    - `double`: 64 bits punto flotante IEEE 754 (alta precisión estándar).
- **Interacción**: Al hacer click en cada tipo, se visualiza su representación binaria y un ejemplo de variable en memoria.

### Slide 2: Casting de Tipos — La escalera del ensanchamiento y el peligro del desbordamiento
- **Aspecto conceptual**:
  - Widening (automático): `byte -> short -> int -> long -> float -> double`. Cabe sin pérdida.
  - Narrowing (manual y riesgoso): `(byte) 130` da como resultado `-126` por desbordamiento de bits en complemento a dos.
- **Gráfica requerida (SVG)**:
  - Escalera ascendente: un vaso pequeño (`byte`, 8 bits) vertido en un balde grande (`int`, 32 bits). El líquido entra perfecto.
  - Al revés: intentar volcar un balde de 32 bits en el vaso de 8 bits. Los bits superiores son podados implacablemente.
  - Animación del desbordamiento de bits: `00000000 10000010` truncado a `10000010` (que en complemento a dos representa `-126`).

### Slide 3: Operadores Aritméticos y División Entera
- **Aspecto conceptual**: `5 / 2` en Java da `2`, no `2.5`. Para obtener decimales, al menos un operando debe ser flotante (`5.0 / 2`).
- **Gráfica requerida (SVG)**:
  - Balanza interactiva donde se comparan operaciones con operandos enteros vs operandos `double`.
  - El operador resto/módulo `%` visualizado como la parte sobrante de una división en trozos enteros.

### Slide 4: Operadores Lógicos y Cortocircuito (`&&` y `||`)
- **Aspecto conceptual**:
  - En `A && B`: si `A` es `false`, la JVM NO evalúa `B`.
  - En `A || B`: si `A` es `true`, la JVM NO evalúa `B`.
  - Esto evita errores catastróficos como `if (usuario != null && usuario.getEdad() >= 18)`.
- **Gráfica requerida (SVG interactivo)**:
  - Circuito eléctrico con dos interruptores en serie (`&&`) o en paralelo (`||`).
  - Interruptor 1 abierto (`false`): la corriente no pasa, la bombilla queda apagada y un indicador muestra que el interruptor 2 nunca se testeó.
  - Caso interactivo con `null-check`: demostrar cómo el cortocircuito salva al programa de un `NullPointerException`.

### Slide 5: Inmutabilidad de Variables con `final`
- **Aspecto conceptual**: La palabra clave `final` transforma una variable en constante de asignación única.
- **Gráfica requerida (SVG)**:
  - Casilla de memoria con un candado cerrado.
  - Intento de reasignación `PI = 3.1416;` que rebota contra el candado con un mensaje de error del compilador `cannot assign a value to final variable`.

---

## 4. Estilo y Tokens de Diseño Organic
- Gráficos con estética de laboratorio de hardware cálido, interruptores suaves, paleta Organic.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/02-variables-tipos-datos-y-operadores`
- **WHEN** un alumno explora la presentación
- **THEN** comprende visualmente la capacidad de cada tipo primitivo, el truncamiento de bits en casting forzado y el circuito de cortocircuito lógico.
