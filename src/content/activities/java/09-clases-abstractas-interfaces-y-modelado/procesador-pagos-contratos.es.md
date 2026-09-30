---
course: 'java'
lesson: '09-clases-abstractas-interfaces-y-modelado'
slug: 'procesador-pagos-contratos'
title: 'Diseño de Procesador de Pagos con Clases Abstractas e Interfaces'
description: 'Implementá un motor de pagos desacoplado utilizando una clase abstracta con método plantilla e interfaces para contratos de notificación y facturación.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 55
objectives:
  - 'Distinguir cuándo emplear una clase abstracta y cuándo una interfaz según el requerimiento de diseño.'
  - 'Implementar el patrón Template Method en una clase abstracta para orquestar la transacción de forma segura.'
  - 'Firmar e implementar múltiples interfaces en una clase concreta para garantizar capacidades transversales.'
  - 'Diseñar arquitectura con bajo acoplamiento y alta cohesión respetando principios de código limpio.'
requirements:
  - 'Definir la interfaz public interface Notificable con el contrato void enviarComprobante(String destinatario).'
  - 'Definir la interfaz public interface Facturable con el contrato String generarFacturaFiscal().'
  - 'Crear la clase public abstract class MetodoPago con atributos protegidos titular (String) y moneda (String), constructor protegido, método plantilla procesarTransaccion(double monto) y método abstracto debitar(double montoNeto).'
  - 'Crear TarjetaCredito.java que extienda MetodoPago e implemente Notificable y Facturable, con atributos numeroEnmascarado (String) y cuotas (int).'
  - 'Crear TransferenciaBancaria.java que extienda MetodoPago e implemente Notificable, con atributo cbuAlias (String).'
  - 'En el método plantilla procesarTransaccion de MetodoPago: validar que monto sea positivo, calcular comisión, llamar a debitar(montoNeto) e imprimir el estado de la operación sin duplicar este flujo en las subclases.'
  - 'En MainPagos.java, procesar pagos a través de una colección fija de MetodoPago[] demostrando polimorfismo tanto por clase abstracta como por interfaz (invocando enviarComprobante solo en aquellos que implementen Notificable).'
exampleOutput: |
  === Procesamiento de Transacciones ===
  [Tarjeta] Iniciando transacción para: Ana García
  Monto: $50000.0 (Comisión 3%: $1500.0) -> Débito neto: $51500.0
  Débito aprobado en 3 cuotas con tarjeta terminada en 4321.
  [Comprobante] Notificación enviada a ana.garcia@email.com
  [Factura] Comprobante fiscal tipo B generado: FACT-0001-9872
  --------------------------------------------------
  [Transferencia] Iniciando transacción para: Carlos Pérez
  Monto: $20000.0 (Sin comisión) -> Débito neto: $20000.0
  Transferencia bancaria acreditada exitosamente hacia ALIAS: emp.pagos.cx
  [Comprobante] Notificación enviada a carlos@perez.me
  --------------------------------------------------
  Transacciones completadas con éxito.
deliveryTips:
  - 'Compilá con javac *.java y ejecutá con java MainPagos.'
  - 'Las clases abstractas pueden tener constructores que las subclases invocan con super(...), aunque no puedan instanciarse directamente con new.'
  - 'No uses colecciones dinámicas todavía; utilizá arreglos nativos MetodoPago[] para almacenar el lote de pagos.'
---

## Contexto

En sistemas transaccionales modernos, como pasarelas de pago o plataformas de e-commerce, acoplar la lógica de cobro a un medio específico (como una tarjeta puntual) es un error arquitectónico grave. Los medios de pago comparten estado (titular, moneda, comisiones) y una secuencia obligatoria de procesamiento, pero difieren radicalmente en cómo autorizan el débito.

Además, ciertas operaciones (como emitir comprobantes por correo o generar facturación fiscal) son **capacidades transversales** que no corresponden a la jerarquía de pagos en sí. Aquí es donde brillan las **interfaces**: contratos independientes que cualquier clase puede firmar, sin importar de qué clase herede.

## Consigna

Vas a construir un sistema desacoplado compuesto por contratos e implementaciones.

### 1. Las interfaces de contrato puro

- `Notificable.java`:
  - `void enviarComprobante(String destinatario);`
- `Facturable.java`:
  - `String generarFacturaFiscal();`

### 2. La clase abstracta `MetodoPago` y el patrón plantilla

- Atributos protegidos:
  - `protected String titular;`
  - `protected String moneda;`
- Constructor protegido:
  - `protected MetodoPago(String titular, String moneda)`
- Método plantilla concreto `public boolean procesarTransaccion(double monto)`:
  - Si `monto <= 0`, informa `"Monto inválido para la transacción."` y retorna `false`.
  - Imprime inicio de la transacción para el titular.
  - Invoca al método abstracto `debitar(monto)`.
  - Si el débito fue exitoso, informa la confirmación y retorna `true`.
- Método abstracto:
  - `public abstract boolean debitar(double monto);` (cada medio de pago define sus reglas y comisiones particulares).

### 3. Subclases concretas e interfaces múltiples

- **`TarjetaCredito`**:
  - `extends MetodoPago implements Notificable, Facturable`
  - Atributos privados: `numeroEnmascarado` (`String`) y `cuotas` (`int`).
  - Implementa `debitar(double monto)` aplicando una comisión del 3% si las cuotas superan 1.
  - Implementa `enviarComprobante(String destinatario)` simulando el despacho por email.
  - Implementa `generarFacturaFiscal()` retornando el código fiscal.
- **`TransferenciaBancaria`**:
  - `extends MetodoPago implements Notificable`
  - Atributo privado: `cbuAlias` (`String`).
  - Implementa `debitar(double monto)` debitando el importe directo sin comisiones.
  - Implementa `enviarComprobante(String destinatario)`.

### 4. Orquestación polimórfica en `MainPagos`

- Creá un arreglo `MetodoPago[] pagos = new MetodoPago[2];` conteniendo una `TarjetaCredito` y una `TransferenciaBancaria`.
- Recorré el arreglo invocando `p.procesarTransaccion(...)`.
- Mediante `instanceof`, comprobá si cada objeto implementa `Notificable` y, en caso afirmativo, despachá el comprobante al correo correspondiente.
