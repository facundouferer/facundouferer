---
course: 'java'
lesson: '02-variables-tipos-datos-y-operadores'
slug: 'calculadora-metricas-rendimiento'
title: 'Calculadora de Métricas de Rendimiento y Costos'
description: 'Construí un programa que gestione métricas operativas y salarios usando primitivos adecuados, constantes final, casting explícito y operadores relacionales y lógicos.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 40
objectives:
  - 'Elegir tipos primitivos adecuados según precisión, magnitud y consumo en memoria.'
  - 'Declarar constantes inmutables con la palabra clave final.'
  - 'Evitar el truncamiento accidental en divisiones enteras mediante casting explícito.'
  - 'Componer condiciones lógicas complejas utilizando operadores relacionales y lógicos con cortocircuito.'
  - 'Comprender la regla de asignación definida (definite assignment) en variables locales.'
requirements:
  - 'Crear el archivo CalculadoraMetricas.java con el método ejecutable: public static void main(String[] args).'
  - 'Definir tres constantes inmutables usando final: TARIFA_HORA_BASE (3200.0), HORAS_JORNADA_ESTANDAR (8), y BONO_DESEMPENO (15000.0).'
  - 'Declarar variables locales representativas: diasTrabajados (int con valor 20), totalHoras (int con valor 175), calificacion (char con valor "A") y turnoNocturno (boolean con valor true).'
  - 'Calcular el promedio de horas trabajadas por día: usar casting explícito (double) totalHoras / diasTrabajados para no perder precisión decimal.'
  - 'Calcular el sueldo base bruto multiplicando totalHoras por TARIFA_HORA_BASE.'
  - 'Si turnoNocturno es verdadero, aplicar un adicional del 15% sobre el sueldo base acumulado.'
  - 'Evaluar la elegibilidad al bono con una expresión lógica: esElegible = (promedioHoras >= 8.5 && (calificacion == "A" || calificacion == "B")) || turnoNocturno.'
  - 'Sumar BONO_DESEMPENO al sueldo si esElegible es true para obtener el sueldo total.'
  - 'Simular una liquidación en efectivo sin monedas: aplicar casting explícito reductor (long) sueldoTotal y calcular los centavos residuales descartados.'
  - 'Imprimir por consola el reporte completo con formato prolijo, mostrando variables, cálculos y el desglose final.'
exampleOutput: |
  =============================================
   REPORTE DE RENDIMIENTO Y LIQUIDACIÓN
  =============================================
   Días laborados:           20
   Total de horas:           175
   Calificación obtenida:    A
   Turno nocturno:           Sí
  ---------------------------------------------
   Promedio diario:          8.75 hs/día
   Sueldo base:              $560000.00
   Recargo nocturno (15%):   $84000.00
   Elegible para bono:       Sí
   Bono aplicado:            $15000.00
  ---------------------------------------------
   Sueldo total:             $659000.00
   Liquidación en billetes:  $659000
   Centavos descartados:     $0.00
  =============================================
extensionChallenges:
  - 'Probá qué ocurre si declarás una variable int resultado; e intentás imprimirla sin asignarle valor: observá el error de definite assignment del compilador.'
  - 'Cambiá el total de horas a un valor que genere centavos fraccionarios (ej. 173 horas con tarifa de decimales) y verificá la precisión del truncamiento con (long).'
deliveryTips:
  - 'No uses bucles (for, while) ni métodos personalizados: resolvé el flujo secuencial y condicional dentro del método main.'
  - 'Prestá especial atención a la división: en Java, 175 / 20 da 8 (entero), mientras que (double) 175 / 20 da 8.75.'
  - 'Compilá con javac CalculadoraMetricas.java y corré con java CalculadoraMetricas.'
---

## Contexto

En sistemas financieros y de nómina, un error en el tipo de datos o un mal uso de los operadores produce fallas silenciosas graves:
- Una división de dos variables enteras (`int / int`) descarta los decimales sin redondear, perdiendo horas o fracciones monetarias esenciales.
- Olvidar la palabra clave `final` en una tarifa permite que cualquier línea posterior altere un valor que debía ser inmutable.
- Confundir operadores lógicos puede dejar a un empleado sin su bonificación legítima o asignar fondos indebidos.

Como arquitecto de software, aprender a dominar los tipos de datos fundamentales y las operaciones básicas en Java es la base que te garantiza construir cálculos deterministas y confiables.

## Consigna

Escribí el programa `CalculadoraMetricas.java` que realice el procesamiento salarial y operativo de un período de trabajo siguiendo las reglas descriptas.

### 1. Constantes y Variables

Declaralas dentro de `main`:

```java
public class CalculadoraMetricas {
    public static void main(String[] args) {
        // Constantes inmutables
        final double TARIFA_HORA_BASE = 3200.0;
        final int HORAS_JORNADA_ESTANDAR = 8;
        final double BONO_DESEMPENO = 15000.0;

        // Variables del período
        int diasTrabajados = 20;
        int totalHoras = 175;
        char calificacion = 'A';
        boolean turnoNocturno = true;

        // Continuá con los cálculos...
    }
}
```

### 2. Puntos Clave a Considerar

1. **División entera vs con decimales**: si hacés `totalHoras / diasTrabajados`, Java evalúa `175 / 20` como tipo `int`, resultando en `8` en lugar de `8.75`. Debés forzar la conversión de al menos un operando: `(double) totalHoras / diasTrabajados`.
2. **Evaluación de reglas con cortocircuito**: utilizá operadores `&&` (AND) y `||` (OR) agrupando con paréntesis para que la prioridad de las condiciones exprese fielmente la regla de negocio.
3. **Casting explícito estrecho (*narrowing*)**: para simular el pago en efectivo entero, convertí el total decimal con `(long) sueldoTotal`. Documentá en un comentario por qué esta conversión pierde información.
