---
course: 'java'
lesson: '19-programacion-concurrente-hilos-y-pools'
slug: 'procesador-tareas-concurrente-pools'
title: 'Procesamiento de Tareas con Thread Pools, Callable y Sincronización Segura'
description: 'Construí un procesador de tareas financieras concurrentes utilizando ExecutorService, Callable y Future, protegiendo recursos compartidos frente a condiciones de carrera.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 65
objectives:
  - 'Diferenciar la ejecución secuencial de la concurrente coordinada mediante un pool de hilos administrado.'
  - 'Implementar tareas concurrentes con valor de retorno y manejo de excepciones utilizando `Callable<V>` y `Future<V>`.'
  - 'Identificar y neutralizar condiciones de carrera (*race conditions*) sobre estado compartido mediante bloques sincronizados o atómicos.'
  - 'Gestionar el ciclo de vida de un `ExecutorService` garantizando el apagado ordenado (*graceful shutdown*).'
requirements:
  - 'Crear la clase CuentaBancaria con saldo (double) y transaccionesExitosas (int).'
  - 'Implementar un método void transferir(double monto) demostrando cómo la falta de sincronización corrompe el saldo cuando múltiples hilos intentan operar a la vez.'
  - 'Crear CuentaBancariaSincronizada protegiendo la sección crítica con synchronized (o Atomic / ReentrantLock), garantizando que ningún retiro exceda el saldo ni se pierdan actualizaciones.'
  - 'Definir la tarea TareaTransaccion implements Callable<ResultadoTransaccion> que simule una operación bancaria con latencia de red (Thread.sleep) y retorne el estado de éxito o rechazo.'
  - 'En ProcesadorLotesConcurrente, crear un pool de hilos con Executors.newFixedThreadPool(4) para procesar un lote de 20 transacciones concurrentes.'
  - 'Iterar la lista de Future<ResultadoTransaccion>, obteniendo los resultados con future.get() y acumulando métricas de auditoría.'
  - 'Implementar el protocolo de apagado seguro: shutdown(), awaitTermination(5, TimeUnit.SECONDS) y shutdownNow() en caso de timeout.'
  - 'En MainConcurrencia.java, contrastar la ejecución insegura frente a la sincronizada, evidenciando la consistencia final de los saldos.'
exampleOutput: |
  === Simulación de Concurrencia Bancaria ===
  [TEST 1] Ejecutando 20 transacciones concurrentes en Cuenta INSEGURA...
  Saldo esperado: $1000.00 | Saldo final obtenido: $1420.00 -> ¡CONDICIÓN DE CARRERA DETECTADA!

  [TEST 2] Ejecutando 20 transacciones concurrentes en Cuenta SINCRONIZADA...
  Lanzando pool de 4 hilos (ExecutorService)...
  [Hilo-pool-1] Transacción #1 procesada: +$100.00
  [Hilo-pool-2] Transacción #2 procesada: -$50.00
  [Hilo-pool-3] Transacción #3 procesada: +$200.00
  ...
  Cerrando ExecutorService y esperando finalización de tareas...
  [OK] Pool detenido ordenadamente.
  Saldo final consistente: $1250.00 | Total operaciones registradas: 20
  [OK] Invariante de consistencia garantizado.
deliveryTips:
  - 'Recordá que llamar a `hilo.run()` no crea un nuevo hilo; se debe invocar `hilo.start()` o delegar la tarea en `executor.submit(...)`.'
  - 'Cada llamada a `future.get()` bloquea al hilo principal hasta que la tarea individual correspondiente finalice; planificá el orden de recolección adecuadamente.'
  - 'Al manejar `InterruptedException`, restaurá el estado de interrupción con `Thread.currentThread().interrupt()` si relanzás o finalizás el flujo.'
---

## Contexto

En sistemas empresariales modernos, procesar peticiones secuencialmente conduce a cuellos de botella severos. La **programación concurrente** permite despachar tareas de E/S o cómputo aprovechando los núcleos del procesador.

Sin embargo, cuando múltiples hilos acceden y modifican el mismo objeto en el **Heap** compartido sin coordinación, surge el peligro de las **condiciones de carrera** (*race conditions*):
Operaciones compuestas como `contador++` o `saldo = saldo - monto` involucran lectura, cálculo y escritura. Si los hilos intercalan estos pasos, se producen inconsistencias o pérdidas de datos invisibles al compilador.

Para resolver esto de forma profesional:
1. Se utiliza un **`ExecutorService`** para reutilizar un conjunto acotado de hilos (*Thread Pool*), evitando el costo prohibitivo de instanciar miles de hilos del sistema operativo.
2. Se utilizan tareas **`Callable<V>`** que devuelven resultados mediante **`Future<V>`**.
3. Se protegen las secciones críticas mediante exclusión mutua (**`synchronized`**) o primitivas atómicas.

## Consigna

Vas a implementar un procesador concurrente de transacciones bancarias, evidenciando la importancia de la sincronización y la correcta administración de hilos.

### 1. Modelo de Dominio Seguro

```java
public class CuentaBancariaSegura {
    private double saldo;
    private int operaciones;

    public CuentaBancariaSegura(double saldoInicial) {
        this.saldo = saldoInicial;
    }

    public synchronized boolean procesarMovimiento(double monto) {
        if (monto < 0 && saldo + monto < 0) {
            return false; // Fondos insuficientes
        }
        this.saldo += monto;
        this.operaciones++;
        return true;
    }

    public synchronized double getSaldo() {
        return saldo;
    }
}
```

### 2. Tarea Concurrente con `Callable`

```java
public class TareaTransaccion implements Callable<ResultadoTransaccion> {
    private final int id;
    private final double monto;
    private final CuentaBancariaSegura cuenta;

    // constructor...

    @Override
    public ResultadoTransaccion call() throws Exception {
        // Simular latencia de validación externa
        Thread.sleep(50);
        boolean exito = cuenta.procesarMovimiento(monto);
        return new ResultadoTransaccion(id, monto, exito);
    }
}
```

### 3. Orquestación con `ExecutorService` y Apagado Ordenado

- Crear el pool: `ExecutorService executor = Executors.newFixedThreadPool(4);`
- Enviar las tareas con `executor.submit(...)` acumulando los `Future<ResultadoTransaccion>`.
- Protocolo de parada (*Graceful Shutdown*):
  ```java
  executor.shutdown();
  try {
      if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
          executor.shutdownNow();
      }
  } catch (InterruptedException e) {
      executor.shutdownNow();
      Thread.currentThread().interrupt();
  }
  ```
