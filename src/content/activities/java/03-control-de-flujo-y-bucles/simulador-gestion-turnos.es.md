---
course: 'java'
lesson: '03-control-de-flujo-y-bucles'
slug: 'simulador-gestion-turnos'
title: 'Simulador de Gestión de Turnos y Facturación'
description: 'Implementá un sistema de control de flujo en Java que procese transacciones mediante bucles for y while, tome decisiones con if/else y switch, y controle saltos con break y continue.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 45
objectives:
  - 'Elegir la estructura de repetición adecuada (for, while, do-while) según el problema.'
  - 'Estructurar decisiones multifurcadas utilizando switch y condicionales if/else.'
  - 'Emplear el operador ternario para asignaciones condicionales concisas.'
  - 'Gobernar el ciclo de vida de un bucle mediante instrucciones de interrupción controlada (break y continue).'
  - 'Asegurar la consistencia de acumuladores y contadores evitando bucles infinitos.'
requirements:
  - 'Crear la clase SimuladorTurnos.java con su método public static void main(String[] args).'
  - 'Configurar una simulación de 8 turnos diarios mediante un bucle for que itere de 1 a 8.'
  - 'Generar un código de trámite numérico entre 1 y 4 para cada turno usando una fórmula aritmética basada en el número de turno: (turno * 3) % 4 + 1.'
  - 'Usar una estructura switch para evaluar el código: 1 = Consulta Rápida (10 min, $1500), 2 = Pago de Servicios (15 min, $2500), 3 = Soporte Técnico (30 min, $6000), 4 = Turno Cancelado.'
  - 'Si el código es 4 (Turno Cancelado), emitir un mensaje de aviso y ejecutar continue para saltar el procesamiento de ese turno sin sumar tiempo ni costo.'
  - 'Para trámites válidos, categorizar la prioridad con if/else: si el costo es >= $5000 asignar "Alta", de lo contrario "Estándar". Definir mediante un operador ternario si corresponde recargo de gestión urgente.'
  - 'En el caso de Pago de Servicios, usar un bucle while para simular el cobro fraccionado en pagos parciales de $1000 hasta saldar el monto total.'
  - 'Implementar un bucle do-while para simular una comprobación de firma digital que garantice ejecutarse al menos una vez por cliente atendido.'
  - 'Controlar el tope de jornada: si el tiempo acumulado alcanza o supera los 60 minutos, interrumpir inmediatamente el for con break informando el cierre de ventanilla.'
  - 'Al terminar la simulación, emitir un balance consolidado con: turnos programados, atendidos, cancelados, no procesados por falta de tiempo, minutos totales y recaudación final.'
exampleOutput: |
  ======================================================
   INICIO DE JORNADA - SIMULADOR DE VENTANILLA
  ======================================================
  [Turno #1] Código: 1 - Consulta Rápida | Demora: 10 min | Costo: $1500.00
             Prioridad: Estándar | Auditoría: OK (1 intento)
  [Turno #2] Código: 4 - CLIENTE AUSENTE / TURNO CANCELADO.
             Saltando turno con continue...
  [Turno #3] Código: 3 - Soporte Técnico | Demora: 30 min | Costo: $6000.00
             Prioridad: Alta | Auditoría: OK (1 intento)
  [Turno #4] Código: 2 - Pago de Servicios | Demora: 15 min | Costo: $2500.00
             Cobro fraccionado (while): Pago $1000 -> Pago $1000 -> Pago $500 (Saldado)
             Prioridad: Estándar | Auditoría: OK (1 intento)
  [Turno #5] Código: 1 - Consulta Rápida | Demora: 10 min | Costo: $1500.00
             Prioridad: Estándar | Auditoría: OK (1 intento)
  [ALERTA] Límite de 60 minutos alcanzado (Tiempo acumulado: 65 min).
           Cerrando ventanilla con break. Turnos restantes derivados a mañana.

  ======================================================
   BALANCE DIARIO CONSOLIDADO
  ======================================================
   Turnos planificados:      8
   Turnos atendidos:         4
   Turnos ausentes/saltados: 1
   Turnos postergados:       3
   Tiempo total insumido:    65 min
   Recaudación total:        $11500.00
  ======================================================
extensionChallenges:
  - 'Migrá el bloque switch tradicional a una expresión switch moderna de Java (case -> valor) y compará la claridad del código.'
  - 'Modificá la condición de corte para permitir una prórroga de hasta 15 minutos extras si el cliente en atención es de prioridad Alta.'
deliveryTips:
  - 'Asegurate de que las variables del bucle while decrementen adecuadamente para nunca generar un loop infinito.'
  - 'No uses arreglos ni métodos personalizados todavía: enfocate en la orquestación del flujo mediante estructuras de repetición y decisión en main.'
  - 'Verificá los valores acumuladores inicializándolos en 0 antes de comenzar el bucle for.'
---

## Contexto

El flujo de control es el sistema circulatorio de cualquier programa: determina qué caminos lógicos tomar y qué bloques repetir. Un sistema de atención al cliente en una sucursal bancaria o centro médico debe:
1. Recorrer turnos uno a uno (**bucle `for`**).
2. Omitir turnos donde el cliente no se presentó (**instrucción `continue`**).
3. Tomar decisiones según el tipo de trámite (**estructura `switch`**).
4. Cobrar en partes hasta que el saldo llegue a cero (**bucle `while`**).
5. Exigir al menos un control de auditoría de seguridad (**bucle `do-while`**).
6. Cerrar la ventanilla si se cumplió el tiempo límite del día (**instrucción `break`**).

Construir este simulador te permitirá dominar con precisión milimétrica cuándo utilizar cada estructura de control en Java.

## Consigna

Escribí la clase `SimuladorTurnos.java` que modele la jornada de atención de una oficina.

### 1. Variables de Control y Acumuladores

Inicializá antes del bucle las variables necesarias para el balance diario:
- `tiempoTotal` (`int`, minutos acumulados).
- `recaudacionTotal` (`double`, dinero cobrado).
- `atendidos` (`int`, cantidad de clientes exitosos).
- `cancelados` (`int`, clientes que faltaron).
- `limiteMinutos` (`final int = 60`).

### 2. Estructura Principal (`for`)

Iterá sobre 8 turnos:
```java
for (int turno = 1; turno <= 8; turno++) {
    // 1. Calcular código de trámite
    int codigo = (turno * 3) % 4 + 1;

    // 2. Evaluar trámite con switch
    // ...
}
```

### 3. Manejo de Saltos y Bucles Internos

- **`continue`**: cuando `codigo == 4`, incrementá el contador de cancelados, mostrá el aviso y llamá a `continue`. Esto salta inmediatamente el resto del cuerpo del bucle y pasa al siguiente turno.
- **`while`**: para trámites de tipo `2` ($2500), inicializá una variable local `saldoPendiente = 2500;` y en un `while (saldoPendiente > 0)` descontá pagos de $1000 (o el remanente si es menor) hasta llegar a 0.
- **`do-while`**: ejecutá una verificación de firma digital simulada. La condición se evalúa al final, asegurando que se realice al menos una comprobación.
- **`break`**: tras atender un turno, evaluá si `tiempoTotal >= limiteMinutos`. Si es así, avisá por consola y salí del bucle principal con `break`.
