---
course: 'java'
slug: '23-algoritmia-verificacion-y-complejidad'
title: 'Algoritmos: Especificación, Verificación y Complejidad'
description: 'Aprendé a diseñar, verificar y comparar algoritmos mediante contratos, pruebas y análisis de complejidad temporal y espacial.'
order: 2
lang: 'es'
published: true
---

# Algoritmos: Especificación, Verificación y Complejidad

Programar no empieza al escribir Java. Primero hay que entender el problema, definir qué significa resolverlo y elegir un procedimiento que termine con una respuesta correcta. Ese procedimiento finito y ordenado es un **algoritmo**.

En esta lección vas a recorrer el ciclo completo: especificar, diseñar, verificar, implementar, probar y analizar. El objetivo no es memorizar fórmulas, sino poder justificar dos preguntas diferentes:

1. **¿El algoritmo produce el resultado correcto?**
2. **¿Usa tiempo y memoria razonables cuando crece la entrada?**

---

## 1. De un problema ambiguo a una especificación verificable

Una **especificación** describe el comportamiento esperado sin imponer todavía una implementación. Conviene escribirla como un contrato:

| Parte | Pregunta | Ejemplo: buscar el máximo |
| :--- | :--- | :--- |
| Entradas | ¿Qué datos recibe? | Un array de enteros. |
| Precondiciones | ¿Qué debe cumplirse antes? | El array no puede ser `null` ni estar vacío. |
| Salida | ¿Qué devuelve? | Un entero presente en el array. |
| Postcondición | ¿Qué debe ser cierto después? | Ningún elemento es mayor que el valor devuelto. |
| Errores | ¿Cómo falla ante entradas inválidas? | Lanza `IllegalArgumentException`. |

Una frase como “buscar un número grande” no se puede verificar. En cambio, la postcondición anterior permite construir pruebas y revisar el algoritmo.

```java
static int maximo(int[] valores) {
    if (valores == null || valores.length == 0) {
        throw new IllegalArgumentException("valores debe contener al menos un elemento");
    }

    int maximoActual = valores[0];
    for (int i = 1; i < valores.length; i++) {
        if (valores[i] > maximoActual) {
            maximoActual = valores[i];
        }
    }
    return maximoActual;
}
```

La validación es parte del contrato, no un detalle opcional. Usar `0` como respuesta predeterminada para un array vacío sería inseguro: `0` podría parecer un resultado válido aunque nunca estuviera en la entrada. Cuando no existe un valor neutral correcto, es mejor **fallar de forma explícita**.

---

## 2. Fases del desarrollo de un algoritmo

Un proceso disciplinado evita corregir con parches un problema mal entendido:

1. **Comprender el problema:** identificar el objetivo, los datos disponibles y los casos límite.
2. **Especificar el contrato:** declarar entradas, salidas, precondiciones, postcondiciones y errores.
3. **Diseñar alternativas:** expresar pasos en lenguaje natural, pseudocódigo o diagramas antes de acoplarlos a Java.
4. **Argumentar la corrección:** explicar por qué cada paso conserva las condiciones necesarias para llegar al resultado.
5. **Analizar la eficiencia:** estimar tiempo y memoria según el tamaño de entrada `n`.
6. **Implementar:** traducir el diseño con nombres claros, validación y manejo explícito de fallos.
7. **Probar y depurar:** comprobar casos normales, límites e inválidos.
8. **Medir y mejorar:** optimizar solo cuando exista evidencia, conservando las pruebas de corrección.

Estas fases pueden retroalimentarse. Si una prueba descubre que la especificación no define qué ocurre con duplicados, hay que corregir el contrato antes de cambiar el código.

---

## 3. Verificación, pruebas y corrección

La **verificación** pregunta si el diseño satisface su especificación. Las pruebas aportan evidencia mediante ejemplos concretos, pero no demuestran por sí solas que todos los casos posibles funcionen.

Para `maximo`, una estrategia mínima incluye:

```java
assertEquals(9, maximo(new int[] { 4, 9, 2 })); // caso normal
assertEquals(-3, maximo(new int[] { -8, -3, -10 })); // evita el falso valor inicial 0
assertEquals(7, maximo(new int[] { 7 })); // frontera mínima válida
assertThrows(IllegalArgumentException.class, () -> maximo(new int[] {}));
assertThrows(IllegalArgumentException.class, () -> maximo(null));
```

Además de probar, podemos razonar con un **invariante de bucle**: antes de cada iteración, `maximoActual` es el máximo del segmento ya recorrido. La comparación incorpora el elemento siguiente sin romper esa propiedad. Al terminar, el segmento recorrido es todo el array; por lo tanto, la postcondición se cumple.

### Corrección no es eficiencia

Un algoritmo puede ser correcto y aun así resultar demasiado lento. Este método detecta duplicados correctamente:

```java
static boolean tieneDuplicadosLento(int[] valores) {
    if (valores == null) {
        throw new IllegalArgumentException("valores no puede ser null");
    }
    for (int i = 0; i < valores.length; i++) {
        for (int j = i + 1; j < valores.length; j++) {
            if (valores[i] == valores[j]) {
                return true;
            }
        }
    }
    return false;
}
```

Su resultado es correcto, pero compara pares mediante dos bucles. Para entradas grandes, una solución con `HashSet<Integer>` suele reducir el tiempo a cambio de memoria adicional. **Optimizar implica elegir un intercambio**, no declarar que una versión es universalmente mejor.

---

## 4. Complejidad temporal y espacial

La **complejidad temporal** describe cómo crece la cantidad de operaciones. La **complejidad espacial** describe cómo crece la memoria adicional usada por el algoritmo; no cuenta necesariamente la entrada original.

Medir milisegundos sirve para evaluar una ejecución real, pero depende del hardware, la JVM, el calentamiento del JIT y los datos. El análisis asintótico permite comparar tendencias independientemente de esas condiciones.

### Notación asintótica y Big O

La notación **Big O** expresa una cota de crecimiento cuando `n` se vuelve grande. Ignora constantes y términos menores para enfocarse en el factor dominante.

| Complejidad | Crecimiento típico | Ejemplo |
| :--- | :--- | :--- |
| `O(1)` | Constante | Leer `valores[0]` por índice. |
| `O(log n)` | Logarítmico | Búsqueda binaria en un array ordenado. |
| `O(n)` | Lineal | Recorrer un array para hallar el máximo. |
| `O(n log n)` | Lineal-logarítmico | Ordenamiento eficiente como `Arrays.sort` para objetos bajo comparaciones habituales. |
| `O(n²)` | Cuadrático | Comparar cada elemento con todos los posteriores. |

`3n + 20` se clasifica como `O(n)`: al crecer `n`, el término lineal domina. Dos algoritmos con la misma Big O todavía pueden comportarse distinto por constantes, acceso a memoria o distribución de datos; Big O es una guía de escalabilidad, no un cronómetro.

### Caso mejor, promedio y peor

Una búsqueda lineal puede encontrar el valor en la primera posición (`O(1)` en el mejor caso) o revisar todo el array (`O(n)` en el peor caso). Si no se aclara otra cosa, suele informarse el peor caso porque ofrece un límite predecible.

---

## 5. Ejemplo práctico: búsqueda binaria segura

La búsqueda binaria descarta la mitad del espacio en cada iteración, por eso usa `O(log n)` tiempo y `O(1)` espacio adicional en su versión iterativa. Su precondición crítica es que el array esté ordenado.

```java
static int busquedaBinaria(int[] ordenados, int objetivo) {
    if (ordenados == null) {
        throw new IllegalArgumentException("ordenados no puede ser null");
    }

    int izquierda = 0;
    int derecha = ordenados.length - 1;

    while (izquierda <= derecha) {
        int medio = izquierda + (derecha - izquierda) / 2;
        int valor = ordenados[medio];

        if (valor == objetivo) {
            return medio;
        }
        if (valor < objetivo) {
            izquierda = medio + 1;
        } else {
            derecha = medio - 1;
        }
    }
    return -1; // valor centinela documentado: el objetivo no existe
}
```

El cálculo del punto medio evita el posible desbordamiento de `(izquierda + derecha) / 2`. Devolver `-1` es seguro porque ningún índice válido es negativo y el contrato documenta ese valor. Otra API podría preferir `OptionalInt`; lo importante es no ocultar la ausencia.

### Pruebas esenciales

- Array vacío: devuelve `-1` sin acceder a una posición inválida.
- Objetivo al inicio, al final y en el medio.
- Objetivo ausente.
- Valores negativos y repetidos, declarando qué coincidencia se acepta.
- Entrada `null`: falla explícitamente.
- Array desordenado: el llamador viola la precondición; en una API pública podría validarse con costo `O(n)` o exponerse un método que ordene una copia de forma segura.

---

## 6. Comparar alternativas con honestidad

Supongamos que queremos responder muchas búsquedas sobre datos inicialmente desordenados:

- Una búsqueda lineal cuesta `O(n)` tiempo y `O(1)` espacio por consulta.
- Ordenar una copia cuesta `O(n log n)` tiempo y `O(n)` espacio; luego cada búsqueda binaria cuesta `O(log n)`.
- Construir un `HashSet` cuesta normalmente `O(n)` tiempo y `O(n)` espacio; una consulta suele costar `O(1)`, pero pierde orden y su peor caso teórico puede degradarse.

Para una sola consulta, preparar otra estructura puede costar más que recorrer. Para miles de consultas, la preparación puede amortizarse. La entrada real, las garantías requeridas y la memoria disponible deciden.

---

## 7. Fallos frecuentes

1. **Implementar antes de especificar:** aparecen casos límite contradictorios.
2. **Probar solo el camino feliz:** `null`, vacío, negativos o desbordamientos quedan invisibles.
3. **Confundir “pasó mis pruebas” con una demostración:** las pruebas cubren casos; el razonamiento cubre propiedades.
4. **Confundir corrección con eficiencia:** una salida correcta puede llegar demasiado tarde o agotar memoria.
5. **Usar Big O como tiempo exacto:** `O(n)` no significa `n` milisegundos.
6. **Ignorar precondiciones:** la búsqueda binaria sobre datos desordenados puede devolver resultados incorrectos sin lanzar error.
7. **Optimizar demasiado pronto:** aumenta la complejidad del código sin evidencia de un problema real.

---

## 8. Ejercicio integrador

Diseñá un método `indicePrimero(int[] valores, int objetivo)`:

1. Escribí el contrato, incluido el comportamiento ante `null` y cuando el objetivo no existe.
2. Implementá una solución lineal.
3. Argumentá su corrección mediante un invariante.
4. Indicá complejidad temporal y espacial.
5. Creá pruebas para array vacío, primera posición, última posición, duplicados y ausencia.
6. Explicá por qué ordenar primero cambiaría el significado de los índices originales.

La solución esperada usa `O(n)` tiempo, `O(1)` espacio adicional y devuelve `-1` si no hay coincidencia. Esa decisión es un **valor centinela documentado**, no una respuesta inventada.

---

## Resumen

Un algoritmo profesional nace de un contrato claro, se sostiene con un argumento de corrección y pruebas, y se evalúa con análisis temporal y espacial. La notación asintótica permite anticipar la escalabilidad, mientras que la medición confirma el comportamiento real. Primero hacé que el resultado sea correcto; después mejorá su eficiencia sin perder esa garantía.
