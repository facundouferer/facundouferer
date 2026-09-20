---
course: 'java'
slug: '27-depuracion-codigo-limpio-y-refactorizacion'
title: 'Depuración, código limpio y refactorización'
description: 'Aprendé a depurar con breakpoints y watches, reconocer code smells en tu código Java y refactorizarlo de forma segura respaldado por tests JUnit.'
order: 25
lang: 'es'
published: true
---

# Depuración, código limpio y refactorización

Un programa rara vez funciona la primera vez que corre un test o el `main`. La depuración es el proceso sistemático para descubrir por qué el comportamiento observado difiere del esperado; el código limpio y la refactorización son las prácticas que mantienen esa base entendible a medida que crece. Son actividades relacionadas pero distintas: mezclarlas en un mismo paso —arreglar un bug mientras se reestructura el código— hace imposible saber cuál cambio causó qué efecto.

## 1. Depuración como bucle de retroalimentación

Depurar no es "probar cosas al azar hasta que funcione". Es un bucle repetible:

1. **Reproducir**: conseguí un caso mínimo y determinístico que dispare el fallo.
2. **Formular una hipótesis**: a partir del síntoma, proponé una causa concreta y verificable.
3. **Observar**: inspeccioná el estado real del programa —variables, pila de llamadas, orden de ejecución— para confirmar o refutar la hipótesis.
4. **Corregir**: aplicá el cambio mínimo que resuelve la causa, no el síntoma.
5. **Verificar**: volvé a ejecutar el caso reproducido y la suite de tests para confirmar que el fallo desapareció y que no se rompió nada más.

Si una hipótesis se refuta, no se descarta: es información. Volvé al paso de observación con una hipótesis más específica.

### Leer una traza de pila

```text
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "Order.subtotal()" because "order" is null
    at OrderCalculator.total(OrderCalculator.java:14)
    at Main.main(Main.java:9)
```

- La primera línea es el tipo de excepción y el mensaje: identifican **qué** falló.
- Cada línea `at ...` es un marco (*frame*) de la pila de llamadas, del más cercano al fallo (arriba) al punto de entrada (abajo).
- Buscá el primer marco que pertenezca a tu propio código, no a una librería: ahí suele estar el contexto útil para reproducir el problema.

### Cuándo `println` alcanza y cuándo no

`System.out.println` sirve para una inspección puntual y descartable: confirmar que un método se ejecuta, ver un valor una vez. Deja de alcanzar cuando:

- el fallo depende de temporización o concurrencia y el propio `println` cambia el comportamiento;
- necesitás inspeccionar un grafo de objetos completo, no un valor aislado;
- el punto de interés depende de una condición ("solo cuando `itemCount > 10`") y agregar un `if` únicamente para depurar ensucia el código;
- necesitás repetir la inspección muchas veces sin recompilar cada vez.

En esos casos, un depurador con breakpoints es más preciso y no deja huellas en el código fuente.

## 2. El depurador: breakpoints, watches y stepping

Los depuradores de IntelliJ IDEA, Visual Studio Code (con el Extension Pack for Java) y Eclipse comparten el mismo vocabulario, aunque los atajos de teclado difieran:

- **Breakpoint de línea**: pausa la ejecución justo antes de ejecutar esa línea. Se agrega haciendo clic en el margen izquierdo del editor.
- **Breakpoint condicional**: solo pausa cuando una expresión booleana es verdadera, por ejemplo `itemCount > 10`. Evita detenerse en cada iteración de un bucle cuando solo interesa un caso.
- **Watch (expresión observada)**: agregás una expresión al panel de *Watches* para que el depurador la evalúe en cada pausa, sin modificar el código para imprimirla.
- **Stepping**:
  - *Step over* ejecuta la línea actual sin entrar en los métodos que llama.
  - *Step into* entra al método invocado en la línea actual.
  - *Step out* termina el método actual y vuelve al que lo llamó.
  - *Resume* (continuar) deja correr el programa hasta el siguiente breakpoint.
- **Pila de llamadas (call stack)**: el panel de *Frames* muestra la cadena de métodos que llevó hasta el punto actual; permite ver el estado de las variables locales en cada nivel, no solo en el actual.
- **Variables**: el panel de variables muestra el estado del *scope* activo en cada pausa; expandir un objeto navega sus campos sin necesidad de imprimirlos.

## 3. Código limpio: legibilidad como requisito

El código se lee muchas más veces de las que se escribe. Código limpio significa optimizar para quien lo lee después, incluyendo a quien lo escribió:

- **Nombres significativos**: `calculateVolumeDiscount` comunica intención; `calc2` no. Un nombre bien elegido reduce la necesidad de comentarios.
- **Métodos pequeños con una única responsabilidad**: un método debería hacer una cosa y su nombre debería decir cuál. Si necesitás un "y" para describirlo ("calcula el total y envía el email"), probablemente hace dos cosas.
- **Evitar números mágicos**: un `0.21` disperso en el código no dice qué representa. `TAX_RATE = 0.21` sí, y centraliza el cambio si la tasa cambia.
- **Evitar duplicación**: la misma lógica copiada en dos lugares significa dos lugares para corregir el mismo bug. Si se corrige uno y se olvida el otro, el sistema queda inconsistente.
- **Comentarios que expliquen el porqué, no el qué**: `// suma 1 a i` no aporta nada sobre código que ya dice `i++`; `// se ajusta ±1 día por el huso horario del proveedor` explica una decisión que el código por sí solo no puede transmitir.

### Code smells (síntomas de diseño débil)

Un *code smell* no es un bug: el programa funciona, pero la señal indica que el diseño va a costar más de lo necesario mantener.

| Code smell | Síntoma | Refactor típico |
| :--- | :--- | :--- |
| Long method | El método crece porque acumula responsabilidades y es difícil de nombrar con precisión | Extract method |
| Long parameter list | Muchos parámetros primitivos, fácil de invocar en el orden equivocado | Introduce parameter object |
| Duplicated code | La misma lógica aparece copiada en más de un lugar | Extract method / extract class |
| Feature envy | Un método usa más los datos de otro objeto que los propios | Move method |
| Primitive obsession | Un `String` o un `int` modela un concepto de dominio (por ejemplo, un tipo de cliente) en lugar de un tipo propio | Introduce domain type / enum |
| God class | Una clase conoce y hace demasiado, se vuelve el punto de contacto de todo el sistema | Dividir por responsabilidad única |

## 4. Refactorización: cambiar la estructura sin cambiar el comportamiento

Refactorizar es modificar la estructura interna del código **sin alterar su comportamiento observable**, respaldado por una suite de tests JUnit que ya está en verde. Si los tests dejan de pasar durante una refactorización, no se avanza: se corrige o se revierte antes de seguir.

Refactorizaciones con nombre, entre las más frecuentes:

- **Extract method**: tomar un fragmento de un método largo y convertirlo en un método propio con un nombre que explique qué hace.
- **Rename**: cambiar el nombre de una variable, método o clase para que refleje su propósito real.
- **Introduce constant / parameter object**: reemplazar un valor literal por una constante nombrada, o agrupar varios parámetros relacionados en un único objeto.
- **Replace conditional with polymorphism**: cuando una condición (`if`/`switch`) decide comportamiento según un tipo, mover cada rama a una implementación específica de ese tipo.
- **Guard clauses**: reemplazar `if`/`else` anidados por retornos tempranos que descartan casos inválidos al inicio del método, reduciendo el nivel de anidamiento.

### Antes: un método con varios code smells

```java
public class OrderCalculator {
    public double total(String customerType, double subtotal, int itemCount, boolean express) {
        double tax;
        if (customerType.equals("REGULAR")) {
            tax = subtotal * 0.21;
        } else if (customerType.equals("WHOLESALE")) {
            tax = subtotal * 0.21;
        } else {
            tax = subtotal * 0.21;
        }
        double discount = 0;
        if (itemCount > 10) {
            discount = subtotal * 0.05;
        }
        if (customerType.equals("WHOLESALE") && itemCount > 10) {
            discount = subtotal * 0.10;
        }
        double shipping = express ? 15.0 : 5.0;
        return subtotal + tax - discount + shipping;
    }
}
```

`total` es un long method con long parameter list: mezcla el cálculo de impuesto, descuento y envío; repite `subtotal * 0.21` tres veces (duplicated code); usa `0.21`, `0.05`, `0.10`, `15.0` y `5.0` como números mágicos; y modela el tipo de cliente con un `String` comparado por igualdad (primitive obsession).

Antes de tocar una línea, dos tests JUnit capturan el comportamiento actual:

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class OrderCalculatorTest {

    private OrderCalculator calculator;

    @BeforeEach
    void createCalculator() {
        calculator = new OrderCalculator();
    }

    @Test
    void regularCustomerBelowDiscountThreshold() {
        double total = calculator.total("REGULAR", 500, 5, false);
        assertEquals(610.0, total, 0.001);
    }

    @Test
    void wholesaleCustomerAboveDiscountThreshold() {
        double total = calculator.total("WHOLESALE", 1000, 15, true);
        assertEquals(1125.0, total, 0.001);
    }
}
```

Con estos tests en verde, cada paso de refactorización se valida ejecutándolos de nuevo antes de continuar.

### Después: mismos resultados, estructura refactorizada en pasos pequeños

```java
enum CustomerType {
    REGULAR {
        @Override
        public double bulkDiscountRate() {
            return 0.05;
        }
    },
    WHOLESALE {
        @Override
        public double bulkDiscountRate() {
            return 0.10;
        }
    };

    public abstract double bulkDiscountRate();
}

record OrderRequest(CustomerType customerType, double subtotal, int itemCount, boolean express) {
    OrderRequest {
        if (subtotal < 0) throw new IllegalArgumentException("subtotal must not be negative");
        if (itemCount < 0) throw new IllegalArgumentException("itemCount must not be negative");
    }
}

public class OrderCalculator {
    private static final double TAX_RATE = 0.21;
    private static final int BULK_ITEM_THRESHOLD = 10;
    private static final double EXPRESS_SHIPPING = 15.0;
    private static final double STANDARD_SHIPPING = 5.0;

    public double total(OrderRequest request) {
        double tax = calculateTax(request.subtotal());
        double discount = calculateDiscount(request);
        double shipping = calculateShipping(request.express());
        return request.subtotal() + tax - discount + shipping;
    }

    private double calculateTax(double subtotal) {
        return subtotal * TAX_RATE;
    }

    private double calculateDiscount(OrderRequest request) {
        if (request.itemCount() <= BULK_ITEM_THRESHOLD) {
            return 0;
        }
        return request.subtotal() * request.customerType().bulkDiscountRate();
    }

    private double calculateShipping(boolean express) {
        return express ? EXPRESS_SHIPPING : STANDARD_SHIPPING;
    }
}
```

Cada paso —introducir la constante `TAX_RATE`, extraer `calculateTax`/`calculateDiscount`/`calculateShipping`, agregar la guard clause en `calculateDiscount`, reemplazar el `String customerType` por el enum `CustomerType`, reemplazar el condicional por el método polimórfico `bulkDiscountRate()`, e introducir `OrderRequest` como parameter object— se hizo por separado y se validó contra los mismos dos tests antes de seguir con el siguiente. El resultado es equivalente en comportamiento y mucho más fácil de extender: agregar un tercer tipo de cliente ahora es agregar una constante al enum, no una rama más al `if`.

## 5. Depurar y refactorizar no son el mismo paso

- **Depurar** cambia el comportamiento del programa: parte de un síntoma incorrecto y termina en un comportamiento corregido.
- **Refactorizar** preserva el comportamiento: parte de una suite en verde y termina en la misma suite en verde, con estructura distinta.

Mezclarlos —"ya que estoy arreglando este bug, aprovecho para reordenar la clase"— hace que un test roto no diga si falló por el bug original, por la corrección o por el reordenamiento. La disciplina práctica es: si aparece un bug mientras se refactoriza, se detiene la refactorización, se vuelve al último estado en verde, se corrige el bug con su propio test, y recién después se retoma la refactorización desde una base estable.
