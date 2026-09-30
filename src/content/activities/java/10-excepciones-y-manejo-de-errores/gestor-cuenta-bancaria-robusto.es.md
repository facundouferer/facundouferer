---
course: 'java'
lesson: '10-excepciones-y-manejo-de-errores'
slug: 'gestor-cuenta-bancaria-robusto'
title: 'Gestor Bancario Resiliente con Excepciones de Dominio'
description: 'Diseñá un sistema de transacciones bancarias robusto definiendo excepciones personalizadas checked y unchecked, y gestionando bloques try-catch-finally.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 50
objectives:
  - 'Crear excepciones de dominio personalizadas que extiendan Exception (checked) y RuntimeException (unchecked).'
  - 'Comprender la jerarquía Throwable y la propagación de errores en la pila de llamadas.'
  - 'Implementar bloques try-catch-finally garantizando la integridad de las transacciones y la auditoría obligatoria.'
  - 'Aportar contexto semántico (saldo, monto) dentro de las excepciones en lugar de mensajes de texto planos.'
  - 'Eliminar antipatrones comunes como la captura silenciosa de excepciones o el uso de catch indiscriminados.'
requirements:
  - 'Crear la excepción checked SaldoInsuficienteException extends Exception con campos inmutables saldoDisponible (double) y montoSolicitado (double), y constructor canónico que llame a super(mensaje).'
  - 'Crear la excepción unchecked MontoInvalidoException extends IllegalArgumentException para valores negativos o cero.'
  - 'Crear CuentaBancaria.java con atributos privados numeroCuenta (String), titular (String) y saldo (double).'
  - 'Implementar depositar(double monto): valida con MontoInvalidoException si monto <= 0; de lo contrario incrementa el saldo.'
  - 'Implementar extraer(double monto) throws SaldoInsuficienteException: valida monto positivo y lanza SaldoInsuficienteException si monto > saldo.'
  - 'Implementar transferir(CuentaBancaria destino, double monto) throws SaldoInsuficienteException: debita de la cuenta actual y acredita en la cuenta destino asegurando consistencia.'
  - 'En MainBanco.java, envolver las operaciones en bloques try-catch-finally: capturar SaldoInsuficienteException imprimiendo los montos de contexto, capturar MontoInvalidoException, y asegurar que el bloque finally registre siempre el cierre del registro de auditoría.'
  - 'Comprobar que ante un fallo de extracción durante una transferencia, la cuenta de destino no se vea acreditada erróneamente.'
exampleOutput: |
  === Auditoría de Transacciones Bancarias ===
  [OK] Depósito exitoso de $100000.0 en cuenta CA-001 (Titular: Laura Torres)
  [OK] Saldo actual: $100000.0
  [ALERTA] Intento de extracción de $150000.0 rechazado:
           Saldo disponible ($100000.0) insuficiente para el monto solicitado ($150000.0).
  [ERROR] Intento de depósito con monto negativo rechazado: Monto no puede ser <= 0 (-500.0)
  --------------------------------------------------
  [AUDITORÍA - FINALLY]: Sesión transaccional cerrada con registro ID #8841.
deliveryTips:
  - 'Compilá con javac *.java y ejecutá con java MainBanco.'
  - 'Nunca uses un catch (Exception e) vacío: si atrapás una excepción, informá de qué tipo es y por qué ocurrió.'
  - 'Recordá que el bloque finally se ejecuta tanto si el try finaliza con éxito como si se lanza y captura una excepción.'
---

## Contexto

En aplicaciones financieras críticas, los fallos son inevitables: cuentas con fondos insuficientes, números de cuenta inexistentes o montos de transferencia ilógicos. Informar estos errores mediante valores booleanos o códigos de error numéricos es extremadamente peligroso, porque nada obliga al llamador a comprobar el resultado, dejando la puerta abierta a inconsistencias contables graves.

El sistema de **excepciones de Java** garantiza que ante una situación anómala se interrumpa el flujo normal de ejecución mediante un objeto rico en información, forzando a que la capa correspondiente capture el error o el sistema se detenga de forma segura.

## Consigna

Vas a implementar un módulo bancario resistente a fallos utilizando excepciones de dominio tipadas.

### 1. Jerarquía de excepciones personalizadas

- **`SaldoInsuficienteException.java` (Checked Exception)**:
  - `public class SaldoInsuficienteException extends Exception`
  - Campos inmutables:
    - `private final double saldoDisponible;`
    - `private final double montoSolicitado;`
  - Constructor:
    - `public SaldoInsuficienteException(String mensaje, double saldoDisponible, double montoSolicitado)`
    - Invoca a `super(mensaje)`.
  - Métodos getter para ambos campos para permitir auditoría detallada.
- **`MontoInvalidoException.java` (Unchecked Exception)**:
  - `public class MontoInvalidoException extends IllegalArgumentException`
  - Constructor que recibe el mensaje de error y delega en `super(mensaje)`.

### 2. Clase `CuentaBancaria`

- Atributos privados: `numeroCuenta` (`String`), `titular` (`String`), `saldo` (`double`).
- Constructor con validaciones básicas.
- Métodos:
  - `public void depositar(double monto)`: si `monto <= 0`, ejecuta `throw new MontoInvalidoException("Monto a depositar inválido: " + monto);`. Si es válido, suma al saldo.
  - `public void extraer(double monto) throws SaldoInsuficienteException`: si `monto <= 0`, lanza `MontoInvalidoException`. Si `monto > saldo`, ejecuta `throw new SaldoInsuficienteException("Fondos insuficientes", this.saldo, monto);`. De lo contrario, descuenta del saldo.
  - `public void transferir(CuentaBancaria destino, double monto) throws SaldoInsuficienteException`: si `destino == null`, lanza `IllegalArgumentException`. Extrae primero el monto de la cuenta de origen (lo cual puede lanzar la excepción si no alcanza) y luego lo deposita en la de destino.

### 3. Orquestación y auditoría con `try-catch-finally`

En `MainBanco.java`:
- Creá dos cuentas con saldos iniciales.
- Ejecutá la estructura con manejo riguroso de errores:
```java
try {
    // operaciones bancarias
} catch (SaldoInsuficienteException e) {
    // manejo específico con contexto
} catch (MontoInvalidoException e) {
    // manejo de argumento inválido
} finally {
    // auditoría que se ejecuta siempre
}
```
- Probá los siguientes casos:
  1. Un depósito válido.
  2. Una extracción válida.
  3. Una extracción que exceda el saldo (comprobá que el bloque `catch (SaldoInsuficienteException e)` atrape el error e imprima `e.getSaldoDisponible()` y `e.getMontoSolicitado()`).
  4. Una operación con monto negativo (comprobá que el bloque `catch (MontoInvalidoException e)` capture la violación).
- En el bloque `finally`, imprimí siempre el mensaje de confirmación de fin de sesión de auditoría, demostrando que `finally` se ejecuta sin importar el desenlace del `try`.
