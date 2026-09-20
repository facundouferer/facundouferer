---
course: 'java'
slug: '19-programacion-concurrente-hilos-y-pools'
title: 'Programación Concurrente: Hilos, Sincronización y Pools'
description: 'Dominá la concurrencia en Java: ciclo de vida de hilos, sincronización de memoria compartida, condiciones de carrera, ExecutorService y Virtual Threads.'
order: 24
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

---

## 7. Coordinación entre Hilos: `wait()`, `notify()` y Deadlocks

`synchronized`, las variables atómicas y `volatile` resuelven el acceso exclusivo a un dato compartido, pero no alcanzan cuando un hilo necesita **esperar** a que otro hilo lleve una condición a un estado determinado (por ejemplo, "hay un elemento disponible" o "hay espacio libre"). Para eso Java expone `wait()`, `notify()` y `notifyAll()`, heredados de `Object`. Con ellos aparece también el riesgo opuesto a la condición de carrera: el **deadlock**, un punto muerto donde el programa deja de avanzar para siempre.

### El monitor: por qué `wait()` y `notify()` exigen el lock

Cada objeto en Java tiene asociado un **monitor** implícito. `wait()`, `notify()` y `notifyAll()` solo tienen sentido dentro de un bloque o método `synchronized` sobre ese mismo objeto, porque necesitan que el hilo llamante sea el **dueño** del monitor:

- `wait()` libera el lock del monitor y suspende el hilo hasta que otro hilo llame a `notify()`/`notifyAll()` sobre el mismo objeto (o expire un timeout, si se usó la variante con tiempo). Antes de devolver el control, el hilo vuelve a **adquirir** el lock.
- `notify()` despierta **un** hilo en espera sobre ese monitor, elegido de forma no determinística.
- `notifyAll()` despierta a **todos** los hilos en espera sobre ese monitor; cada uno vuelve a competir por el lock.

Si alguno de estos métodos se invoca fuera de un bloque `synchronized` sobre el objeto correspondiente, la JVM lanza `IllegalMonitorStateException` en tiempo de ejecución: no hay forma de "esperar" o "avisar" sobre un lock que el hilo no posee.

```java
public class SharedResource {
    private final Object lock = new Object();
    private boolean dataReady = false;

    public void produce() {
        synchronized (lock) {
            dataReady = true;
            lock.notifyAll(); // despierta a todos los hilos en espera sobre "lock"
        }
    }

    public void consume() throws InterruptedException {
        synchronized (lock) {
            while (!dataReady) {
                lock.wait(); // libera "lock" y espera a que produce() avise
            }
            System.out.println("Dato listo para consumir");
        }
    }
}

// lock.wait();          // fuera de synchronized (lock): IllegalMonitorStateException
```

### El bucle de espera: `while`, nunca `if`

`wait()` puede retornar sin que la condición esperada sea realmente cierta. Esto ocurre por dos motivos:

1. **Despertar espurio** (*spurious wakeup*): la especificación de Java permite que un hilo salga de `wait()` sin que nadie haya llamado a `notify()`/`notifyAll()`, por razones internas de la JVM o del sistema operativo.
2. **Condición ya consumida**: con `notifyAll()`, varios hilos compiten por el lock; el primero en reobtenerlo puede dejar la condición en un estado que ya no aplica para los siguientes.

Por eso la condición se comprueba dentro de un `while`, nunca de un `if`:

```java
synchronized (lock) {
    while (!conditionMet()) { // re-verifica cada vez que el hilo despierta
        lock.wait();
    }
    // acá sí está garantizado que conditionMet() es verdadera
}
```

Un `if` solo comprueba la condición una vez, antes de dormir; si el hilo despierta por error (o la condición vuelve a cambiar), continúa con datos inválidos sin que el compilador ni el runtime lo adviertan.

### Preferí notifyAll() en lugar de notify()

`notify()` despierta un único hilo elegido arbitrariamente. Si el monitor tiene hilos esperando por **condiciones distintas** (por ejemplo, unos esperan "hay espacio" y otros "hay un elemento"), `notify()` puede despertar al hilo equivocado, que vuelve a comprobar su condición, la encuentra falsa y se duerme de nuevo: el hilo que sí podía avanzar nunca fue avisado. Esto se conoce como **señal perdida** (*lost wakeup*).

`notifyAll()` despierta a todos; cada uno revisa su propio `while` y solo continúa el que corresponde. Cuesta más CPU porque todos compiten por el lock, pero es la opción segura por defecto. Usá `notify()` solamente cuando podés demostrar que todos los hilos en espera comparten exactamente la misma condición.

### Ejemplo: buffer acotado productor-consumidor

Un caso clásico de coordinación es un **buffer acotado**: los productores esperan si está lleno, los consumidores esperan si está vacío.

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class BoundedBuffer<T> {
    private final Object lock = new Object();
    private final Deque<T> items = new ArrayDeque<>();
    private final int capacity;

    public BoundedBuffer(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("capacity must be positive");
        }
        this.capacity = capacity;
    }

    public void put(T item) throws InterruptedException {
        synchronized (lock) {
            while (items.size() == capacity) {
                lock.wait(); // sin espacio: esperar a que un consumidor libere uno
            }
            items.addLast(item);
            lock.notifyAll(); // puede despertar a un consumidor esperando un elemento
        }
    }

    public T take() throws InterruptedException {
        synchronized (lock) {
            while (items.isEmpty()) {
                lock.wait(); // sin elementos: esperar a que un productor agregue uno
            }
            T item = items.removeFirst();
            lock.notifyAll(); // puede despertar a un productor esperando espacio
            return item;
        }
    }
}
```

`put()` y `take()` comparten el mismo lock (el propio objeto `lock`), así que nunca se ejecutan al mismo tiempo. `notifyAll()` es obligatorio acá porque conviven dos condiciones distintas ("hay espacio" y "hay elemento") sobre el mismo monitor; `notify()` podría despertar al hilo equivocado y dejar al programa colgado.

### Deadlocks: las cuatro condiciones de Coffman

Un **deadlock** (interbloqueo) ocurre cuando dos o más hilos quedan bloqueados para siempre, cada uno esperando un recurso que retiene otro. Coffman describió cuatro condiciones que, dadas **todas juntas**, hacen posible un deadlock:

1. **Exclusión mutua**: al menos un recurso (un lock) solo puede ser usado por un hilo a la vez.
2. **Retención y espera** (*hold-and-wait*): un hilo mantiene un recurso mientras espera adquirir otro.
3. **Sin apropiación** (*no preemption*): un recurso no puede ser arrebatado a un hilo; solo lo libera voluntariamente.
4. **Espera circular** (*circular wait*): existe un ciclo de hilos donde cada uno espera un recurso que retiene el siguiente.

Romper **cualquiera** de las cuatro condiciones evita el deadlock. En la práctica, la más fácil de atacar en código Java es la espera circular, mediante un orden consistente de adquisición.

### Un deadlock mínimo con dos locks

```java
public class DeadlockDemo {
    private static final Object LOCK_A = new Object();
    private static final Object LOCK_B = new Object();

    static void transferAtoB() {
        synchronized (LOCK_A) {
            sleepBriefly();
            synchronized (LOCK_B) {
                System.out.println("Transferencia A -> B completa");
            }
        }
    }

    static void transferBtoA() {
        synchronized (LOCK_B) {
            sleepBriefly();
            synchronized (LOCK_A) {
                System.out.println("Transferencia B -> A completa");
            }
        }
    }

    private static void sleepBriefly() {
        try {
            Thread.sleep(50);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public static void main(String[] args) {
        new Thread(DeadlockDemo::transferAtoB).start();
        new Thread(DeadlockDemo::transferBtoA).start();
        // con mala suerte en el entrelazado, ambos hilos quedan bloqueados
        // para siempre: uno tiene LOCK_A y espera LOCK_B, el otro tiene
        // LOCK_B y espera LOCK_A
    }
}
```

Si el primer hilo entra a `transferAtoB()` y adquiere `LOCK_A`, y casi al mismo tiempo el segundo hilo entra a `transferBtoA()` y adquiere `LOCK_B`, ambos quedan esperando un lock que el otro ya tiene y nunca va a soltar. El programa no lanza ninguna excepción: simplemente deja de progresar.

### Prevención: orden de locks, `tryLock` con tiempo límite y bloqueos acotados

- **Orden consistente de los locks.** Si todos los hilos adquieren `LOCK_A` antes que `LOCK_B` (nunca al revés), la espera circular es imposible. Cuando los locks son dinámicos, un orden estable como `System.identityHashCode()` sirve de criterio:

```java
static void transferOrdered(Object first, Object second, Runnable action) {
    Object low = System.identityHashCode(first) <= System.identityHashCode(second) ? first : second;
    Object high = low == first ? second : first;
    synchronized (low) {
        synchronized (high) {
            action.run();
        }
    }
}
```

- **`tryLock` con tiempo límite.** `ReentrantLock` permite intentar adquirir un lock con un timeout en lugar de bloquear indefinidamente. Si no se consigue el segundo lock, el hilo libera el primero y puede reintentar más tarde:

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

ReentrantLock lockA = new ReentrantLock();
ReentrantLock lockB = new ReentrantLock();

boolean transfer() throws InterruptedException {
    if (lockA.tryLock(500, TimeUnit.MILLISECONDS)) {
        try {
            if (lockB.tryLock(500, TimeUnit.MILLISECONDS)) {
                try {
                    return true; // sección crítica con ambos locks
                } finally {
                    lockB.unlock();
                }
            }
        } finally {
            lockA.unlock();
        }
    }
    return false; // no se pudieron obtener ambos locks: reintentar más tarde
}
```

- **Bloqueos acotados.** Cuanto más corto sea el bloque `synchronized` (o el tramo entre `lock()` y `unlock()`), menos tiempo retiene un hilo un recurso y menor es la ventana para un deadlock. Evitá llamar a código desconocido (I/O, callbacks, otro lock) mientras sostenés un lock.

### Diagnóstico: `jstack`, volcados de hilos y JConsole/VisualVM

Cuando un programa deja de responder, la primera pregunta es si está en deadlock o simplemente lento. `jstack`, incluido en el JDK, genera un **volcado de hilos** (*thread dump*) con el estado y la pila de cada hilo de la JVM:

```sh
jps                        # lista procesos Java en ejecución con su PID
jstack <pid> > thread-dump.txt
grep -A 20 "Found one Java-level deadlock" thread-dump.txt
```

Si hay un deadlock, `jstack` lo detecta automáticamente e imprime una sección con el texto literal `Found one Java-level deadlock`, seguida de los hilos involucrados, qué lock tiene cada uno y cuál está esperando.

**JConsole** y **VisualVM**, ambos incluidos o descargables junto al JDK, ofrecen la misma información con interfaz gráfica: la pestaña de hilos tiene un botón "Detect Deadlock" que resalta los hilos bloqueados entre sí y su cadena de espera, sin tener que leer un volcado de texto a mano.

### Alternativas más seguras de alto nivel

`wait()`/`notify()`/`synchronized` son las herramientas de más bajo nivel; usarlas a mano es propenso a errores. `java.util.concurrent` ofrece utilidades de más alto nivel que ya resuelven estos problemas internamente:

- **`BlockingQueue`** (`ArrayBlockingQueue`, `LinkedBlockingQueue`): reemplaza directamente un buffer acotado hecho a mano. `put()` y `take()` ya manejan la espera y el aviso correctamente.
- **`ReentrantLock` + `Condition`**: en vez de un único monitor con `wait()`/`notifyAll()`, `newCondition()` permite tener **múltiples colas de espera** independientes (por ejemplo, una para "no lleno" y otra para "no vacío"), evitando despertar hilos que no corresponden.
- **`CountDownLatch`**: coordina un evento de "esperar hasta que N tareas terminen", como esperar a que varios hilos de arranque terminen antes de aceptar tráfico.
- El resto de `java.util.concurrent` (`Semaphore`, `CyclicBarrier`, `ExecutorService`, `CompletableFuture`) cubre la gran mayoría de los escenarios de coordinación sin tocar `wait()`/`notify()` directamente. Reservá el monitor manual para entender estas herramientas o para mantener código heredado.
