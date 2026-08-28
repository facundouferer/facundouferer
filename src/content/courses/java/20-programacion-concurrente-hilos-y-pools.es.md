---
course: 'java'
slug: '19-programacion-concurrente-hilos-y-pools'
title: 'Programación Concurrente: Hilos, Sincronización y Pools'
description: 'Dominá la concurrencia en Java: ciclo de vida de hilos, sincronización de memoria compartida, condiciones de carrera, ExecutorService y Virtual Threads.'
order: 20
lang: 'es'
published: true
---

# Programación Concurrente: Hilos, Sincronización y Pools

En la era de los procesadores con múltiples núcleos (*multicore*), la **programación concurrente** es una disciplina fundamental para aprovechar el hardware al máximo, construir servidores web de alto rendimiento y ejecutar operaciones de I/O (entrada/salida) o cómputo pesado sin bloquear la aplicación principal.

En esta lección aprenderás a gestionar hilos de ejecución en Java, comprenderás el modelo de memoria compartida y sus problemas de sincronización, administrarás pools de hilos mediante el framework `java.util.concurrent` y conocerás los modernos **Virtual Threads** introducidos en las versiones recientes del lenguaje.

---

## 1. Concurrencia vs. Paralelismo y el Modelo de Memoria en Java

Antes de escribir código, es crucial distinguir dos conceptos que frecuentemente se confunden:

- **Concurrencia**: Administrar múltiples tareas intercalando su ejecución en el tiempo. Puede ocurrir incluso en un procesador de un solo núcleo mediante *Time-Slicing* (división de tiempo por el planificador del SO).
- **Paralelismo**: Ejecutar físicamente dos o más tareas al mismo instante exacto de tiempo en núcleos de procesador separados.

![Estados del Ciclo de Vida de un Hilo y Modelo de Memoria Stack vs Heap](/img/courses/java/java-thread-lifecycle.jpg)

### El Modelo de Memoria de Java (JMM - Java Memory Model):
- **Stack (Pila)**: Cada hilo posee su propia pila de ejecución privada con variables locales y referencias a objetos.
- **Heap (Montón)**: Memoria compartida global entre todos los hilos donde residen los objetos instanciados. La concurrencia se vuelve compleja cuando múltiples hilos intentan **leer y escribir sobre la misma zona del Heap** simultáneamente.

---

## 2. Creación y Ciclo de Vida de Hilos (`Thread` vs `Runnable` vs `Callable`)

En Java, un **Hilo** (`Thread`) representa la unidad mínima de ejecución asignada por el sistema operativo.

### Formas de definir la tarea de un Hilo:

#### Opción A: Implementando la interfaz funcional `Runnable` (Recomendado)
```java
public class TareaRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Ejecutando en el hilo: " + Thread.currentThread().getName());
    }
}

// Uso con Lambdas:
Thread hilo1 = new Thread(() -> System.out.println("Hilo paralelo ejecutándose"));
hilo1.start(); // NUNCA llamar a run() directamente; start() inicia el nuevo hilo en el SO.
```

#### Opción B: Tareas que devuelven resultados con `Callable<V>` y `Future<V>`
A diferencia de `Runnable`, `Callable` puede devolver un valor y lanzar excepciones comprobadas:
```java
import java.util.concurrent.*;

Callable<Integer> calculoComplejo = () -> {
    Thread.sleep(1000);
    return 42 * 2;
};
```

---

## 3. Condiciones de Carrera (*Race Conditions*) y Sincronización

Cuando dos o más hilos modifican una variable compartida sin control, ocurre una **Condición de Carrera** (*Race Condition*), provocando corrupción silenciosa de datos.

### El Problema de la Operación no Atómica (`count++`):
La instrucción `count++` consta internamente de 3 pasos: (1) Leer valor actual, (2) Incrementar en 1, (3) Escribir nuevo valor. Si dos hilos la ejecutan en paralelo, pueden sobreescribir sus cambios.

```java
public class ContadorInseguro {
    private int contador = 0;

    // INSEGURO: Si 10 hilos incrementan 1000 veces cada uno, el resultado final raras veces será 10000.
    public void incrementar() {
        contador++;
    }
}
```

### Soluciones de Sincronización en Java:

#### 1. Bloques y Métodos `synchronized` (Intrinsic Locks)
Garantiza exclusión mutua: solo un hilo puede ejecutar el bloque protegido a la vez.
```java
public class ContadorSeguro {
    private int contador = 0;

    public synchronized void incrementar() {
        contador++; // Seguro frente a múltiples hilos
    }

    public synchronized int getContador() {
        return contador;
    }
}
```

#### 2. Variables Atómicas (`java.util.concurrent.atomic`)
Para operaciones numéricas simples, las clases atómicas usan instrucciones del procesador a nivel de hardware (*Compare-And-Swap - CAS*) sin necesidad de bloqueos pesados:
```java
import java.util.concurrent.atomic.AtomicInteger;

public class ContadorAtomico {
    private AtomicInteger contador = new AtomicInteger(0);

    public void incrementar() {
        contador.incrementAndGet(); // Operación atómica pura
    }
}
```

#### 3. Visibilidad de memoria con `volatile`
La palabra clave `volatile` indica a la JVM que las lecturas y escrituras de una variable deben hacerse directamente sobre la memoria RAM principal, sin almacenarse en la caché del núcleo procesador (L1/L2).

---

## 4. Pools de Hilos con `ExecutorService`

En aplicaciones de producción, crear manualmente hilos individuales mediante `new Thread()` es una **mala práctica anti-patrón**: la creación de un hilo del SO es costosa en recursos y memoria (aprox 1MB de pila por hilo), y lanzar hilos sin límite provoca desbordamiento de memoria (`OutOfMemoryError`).

La solución es reutilizar un conjunto finito de hilos usando **Thread Pools** mediante la API `ExecutorService`.

![Arquitectura del Framework ExecutorService y Pools de Hilos](/img/courses/java/java-thread-pool-executors.jpg)

### Tipos Comunes de Pools de Hilos:
- **`Executors.newFixedThreadPool(int n)`**: Reutiliza un número fijo de hilos en paralelo.
- **`Executors.newCachedThreadPool()`**: Crea hilos según demanda y destruye los inactivos.
- **`Executors.newSingleThreadExecutor()`**: Garatiza ejecución secuencial de tareas en un único hilo.

### Ejemplo Práctico con `ExecutorService` y `Future`:
```java
import java.util.concurrent.*;

public class EjemploThreadPool {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        // 1. Crear un Pool de 3 hilos trabajadores
        ExecutorService executor = Executors.newFixedThreadPool(3);

        // 2. Enviar tareas Callable que retornan un resultado futuro
        Future<String> tarea1 = executor.submit(() -> {
            Thread.sleep(1500);
            return "Resultado de Proceso A";
        });

        Future<String> tarea2 = executor.submit(() -> {
            Thread.sleep(1000);
            return "Resultado de Proceso B";
        });

        // 3. Obtener resultados de los Futures (El método .get() bloquea hasta completar la tarea)
        System.out.println("Esperando respuestas...");
        System.out.println("Recibido: " + tarea1.get());
        System.out.println("Recibido: " + tarea2.get());

        // 4. Apagar el Pool de hilos para permitir que la JVM finalice limpiamente
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);
    }
}
```

---

## 5. El Futuro de la Concurrencia: Virtual Threads (Java 21+)

En versiones recientes de Java (Project Loom), la plataforma introdujo los **Virtual Threads** (Hilos Virtuales). A diferencia de los hilos tradicionales del SO (*Platform Threads*), los Hilos Virtuales son ligeros, gestionados directamente por la JVM en espacio de usuario.

Podés crear millones de hilos virtuales simultáneamente sin saturar la RAM ni el sistema operativo:

```java
// Creación de un Executor de Hilos Virtuales (Java 21+)
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        final int taskId = i;
        executor.submit(() -> {
            Thread.sleep(1000);
            return "Tarea virtual #" + taskId;
        });
    }
} // El try-with-resources cierra automáticamente el executor al finalizar todas las tareas
```

---

## 6. Ejercicio Práctico Guiado

### Desafío: Simulador de Descargas Múltiples Concurrentes
Desarrollá un programa que simule la descarga de 5 archivos pesados utilizando un pool de **2 hilos concurrentes**:
1. Cada tarea de descarga debe tardar un tiempo aleatorio de 1 a 3 segundos e imprimir el inicio y fin de la descarga indicando qué hilo la procesó.
2. Medí el tiempo total transcurrido desde el inicio hasta el cierre del pool.

<details>
<summary>Ver solución sugerida</summary>

```java
import java.util.concurrent.*;
import java.util.Random;

public class DescargadorConcurrente {

    static class TareaDescarga implements Runnable {
        private final String nombreArchivo;

        public TareaDescarga(String nombreArchivo) {
            this.nombreArchivo = nombreArchivo;
        }

        @Override
        public void run() {
            String hiloActual = Thread.currentThread().getName();
            System.out.println("[" + hiloActual + "] Iniciando descarga: " + nombreArchivo);
            try {
                int tiempoDescarga = 1000 + new Random().nextInt(2000);
                Thread.sleep(tiempoDescarga);
                System.out.println("[" + hiloActual + "] ✔ Completada descarga: " + nombreArchivo);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        long inicio = System.currentTimeMillis();
        ExecutorService pool = Executors.newFixedThreadPool(2);

        String[] archivos = {"video_hd.mp4", "backup.zip", "dataset.csv", "documento.pdf", "imagen.raw"};

        for (String archivo : archivos) {
            pool.submit(new TareaDescarga(archivo));
        }

        pool.shutdown();
        pool.awaitTermination(30, TimeUnit.SECONDS);

        long fin = System.currentTimeMillis();
        System.out.println("==========================================");
        System.out.println("Todas las descargas finalizaron en: " + (fin - inicio) + " ms");
        System.out.println("==========================================");
    }
}
```
</details>
