---
course: 'java'
lesson: '27-depuracion-codigo-limpio-y-refactorizacion'
slug: 'refactorizacion-facturacion-codigo-limpio'
title: 'Refactorización de Sistema de Facturación y Diagnóstico de Code Smells'
description: 'Tomá un módulo heredado con métodos gigantes y números mágicos, asegurá su comportamiento con tests de caracterización en JUnit y aplicales técnicas de refactorización limpia paso a paso.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 65
objectives:
  - 'Identificar code smells comunes en bases de código reales: métodos largos, números mágicos, obsesión por primitivos y duplicación.'
  - 'Escribir una red de seguridad con pruebas de caracterización antes de modificar una sola línea de código heredado.'
  - 'Aplicar refactorizaciones canónicas paso a paso: Extraer Método, Reemplazar Número Mágico con Constante, e Introducir Objeto de Parámetro.'
  - 'Garantizar que el comportamiento observable del sistema se preserve intacto tras cada transformación.'
requirements:
  - 'Analizar la clase legado FacturadorMonolitico que calcula subtotales, IVA (0.21), descuentos por volumen (0.10 ante compras > $5000), costos de envío y genera texto en un solo método de 80 líneas.'
  - 'Crear la suite FacturadorTest con JUnit 5 conteniendo al menos 4 tests de caracterización (casos con y sin descuento, clientes VIP y carritos con múltiples items).'
  - 'Eliminar todos los números mágicos creando constantes descriptivas con nombres significativos (TASA_IVA, UMBRAL_DESCUENTO_VOLUMEN, PORCENTAJE_DESCUENTO_VOLUMEN).'
  - 'Refactorizar la obsesión por primitivos introduciendo los tipos de dominio: ItemFactura (descripcion, precioUnitario, cantidad) y Cliente (nombre, esVip, email).'
  - 'Aplicar Extraer Método para dividir el cálculo en funciones puras con una única responsabilidad: calcularSubtotal(), aplicarDescuentos() y calcularImpuestos().'
  - 'Separar la generación del reporte impreso en una clase o interfaz dedicada (ej. FormateadorFactura), desacoplando la lógica contable de la presentación.'
  - 'Ejecutar la suite de tests tras cada micropaso de refactorización verificando que se mantengan 100% en verde.'
  - 'En MainRefactor.java, comparar la legibilidad del código refactorizado frente al original, emitiendo una factura de muestra con desglose detallado.'
exampleOutput: |
  === Refactorización de Facturación: Suite de Tests ===
  [TEST] Ejecutando tests de caracterización sobre código legado...
  [OK] facturaSinDescuento_calculaTotalCorrectamente() PASSED
  [OK] facturaConDescuentoMayorista_aplicaDiezPorCiento() PASSED
  [OK] clienteVip_aplicaBonificacionEspecial() PASSED
  [OK] Todos los tests verdes. Red de seguridad establecida.

  === Aplicando Refactorizaciones ===
  [REFACTOR] Reemplazo de números mágicos por constantes descriptivas... OK
  [REFACTOR] Introducción de Value Objects: ItemFactura y Cliente... OK
  [REFACTOR] Extracción de métodos puros: Subtotal, Descuentos, Impuestos... OK
  [REFACTOR] Desacoplamiento de presentación en FormateadorFactura... OK

  Re-ejecutando tests de regresión...
  Tests run: 3, Failures: 0, Errors: 0. ¡Comportamiento idéntico garantizado!

  === Factura Emitida con Código Limpio ===
  Cliente: Tech Solutions SA (VIP)
  Items: 2 x Notebook ($1200.00 c/u), 5 x Mouse ($40.00 c/u)
  Subtotal:   $ 2600.00
  Descuentos: -$  260.00 (10% descuento por cliente VIP)
  IVA (21%):  $  491.40
  Total:      $ 2831.40
deliveryTips:
  - 'Nunca intentes arreglar un bug y refactorizar al mismo tiempo; son dos disciplinas separadas que se contaminan entre sí.'
  - 'El atajo de refactorización de tu IDE (Shift+F6 para renombrar, Cmd+Alt+M o Ctrl+Alt+M para extraer método) minimiza errores tipográficos.'
  - 'Mantené los commits pequeños: un commit por cada refactorización atómica con todos los tests pasando.'
---

## Contexto

El código de software pasa más del **80% de su ciclo de vida en fase de mantenimiento y lectura**, no de escritura. Un código difícil de entender o plagado de "olores" (*code smells*) incrementa exponencialmente los costos del proyecto y la probabilidad de introducir regresiones.

Un **Code Smell** no es un error de compilación ni un fallo en tiempo de ejecución: es un síntoma de diseño deficiente que anticipa dificultades futuras. Los más frecuentes incluyen:
- **Método Largo (*Long Method*)**: métodos de decenas de líneas que hacen múltiples cosas a la vez.
- **Números Mágicos (*Magic Numbers*)**: literales numéricos como `0.21` o `15` dispersos sin nombre que explique su significado de negocio.
- **Obsesión por Primitivos (*Primitive Obsession*)**: pasar `String nombre, String apellido, String calle, int numero` en vez de un objeto `Direccion` o `Persona`.
- **Código Duplicado (*DRY Violation*)**: la misma fórmula repetida en varios lugares; si la regla cambia, se actualiza uno y se olvida el otro.

La **Refactorización** es la técnica disciplinada para reestructurar el diseño interno de un programa mejorando su legibilidad y mantenibilidad **sin alterar en absoluto su comportamiento externo observable**, siempre respaldada por una suite sólida de pruebas unitarias.

## Consigna

Vas a rescatar un módulo heredado de facturación que funciona pero es ininteligible.

### 1. Código Legado a Diagnosticar

```java
// Código legado con code smells severos
public class FacturadorMonolitico {
    public void procesar(String[] nombres, double[] precios, int[] cants, boolean vip, String cliente) {
        double sub = 0;
        for (int i = 0; i < precios.length; i++) {
            sub += precios[i] * cants[i];
        }
        double d = 0;
        if (sub > 5000 || vip) { // números mágicos y flags
            d = sub * 0.10;
        }
        double total = (sub - d) * 1.21; // número mágico de IVA
        System.out.println("FACTURA para " + cliente + ": Sub=" + sub + ", Desc=" + d + ", Total=" + total);
    }
}
```

### 2. Plan de Refactorización Disciplinada

1. **Paso 0 - Red de Seguridad**: Escribir `FacturadorTest` con JUnit 5 cubriendo los casos representativos antes de tocar una sola línea de código fuente.
2. **Paso 1 - Eliminar Números Mágicos**:
   ```java
   private static final BigDecimal TASA_IVA_GENERAL = new BigDecimal("0.21");
   private static final BigDecimal UMBRAL_DESCUENTO_VOLUMEN = new BigDecimal("5000.00");
   private static final BigDecimal PORCENTAJE_DESCUENTO = new BigDecimal("0.10");
   ```
3. **Paso 2 - Introducir Objetos de Valor**:
   - Crear el registro o clase inmutable `ItemFactura(String nombre, BigDecimal precioUnitario, int cantidad)`.
   - Crear `Cliente(String nombre, boolean esVip)`.
4. **Paso 3 - Extraer Métodos de Responsabilidad Única**:
   - `calcularSubtotal(List<ItemFactura> items)`
   - `determinarDescuento(BigDecimal subtotal, Cliente cliente)`
   - `calcularImpuestos(BigDecimal montoNeto)`
5. **Paso 4 - Desacoplar Salida**:
   - Crear `Factura` como objeto inmutable con los resultados.
   - Delegar la impresión en `GeneradorReporteFactura`.
