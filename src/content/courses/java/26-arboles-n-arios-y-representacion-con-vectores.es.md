---
course: 'java'
slug: '26-arboles-n-arios-y-representacion-con-vectores'
title: 'Árboles N-arios y representación con vectores'
description: 'Modelá jerarquías con cantidad variable de hijos, transformalas mediante primer hijo y siguiente hermano, y almacenalas con índices validados.'
order: 21
lang: 'es'
published: true
---

# Árboles N-arios y representación con vectores

Un árbol binario limita cada nodo a dos hijos. Un **árbol N-ario** permite cero o más hijos por nodo, por lo que representa de forma natural directorios, menús, organigramas y categorías.

## 1. Vocabulario e invariantes

- La **raíz** es el único nodo sin padre.
- Todo nodo que no sea la raíz tiene exactamente un padre.
- Los **hermanos** comparten padre; una **hoja** no tiene hijos.
- La **profundidad** cuenta aristas desde la raíz; la **altura** es el camino descendente más largo.
- Un árbol es conexo y no tiene ciclos. Con `n` nodos no vacíos posee exactamente `n - 1` relaciones padre-hijo.

Una estructura vacía es un árbol válido y tiene recorrido vacío. En una estructura no vacía, dos raíces, un hijo con varios padres, un índice inexistente o un ciclo violan las invariantes: conviene rechazarlos, no intentar “repararlos” en silencio.

### Recorrido en preorden

El **preorden** visita el nodo y luego cada subárbol hijo, de izquierda a derecha:

```java
static <T> void preorden(NodoN<T> nodo, java.util.function.Consumer<T> visitar) {
    if (nodo == null) return; // árbol vacío: resultado vacío
    visitar.accept(nodo.valor());
    for (NodoN<T> hijo : nodo.hijos()) {
        if (hijo == null) {
            throw new IllegalStateException("un hijo no puede ser null");
        }
        preorden(hijo, visitar);
    }
}

record NodoN<T>(T valor, java.util.List<NodoN<T>> hijos) {
    NodoN {
        java.util.Objects.requireNonNull(valor, "valor obligatorio");
        hijos = java.util.List.copyOf(
            java.util.Objects.requireNonNull(hijos, "hijos obligatorios")
        );
    }
}
```

Visitar los `n` nodos cuesta **O(n)** tiempo. La pila necesita O(h) espacio, donde `h` es la altura; un árbol muy profundo puede requerir un recorrido iterativo.

## 2. Transformación primer hijo / siguiente hermano

Cualquier árbol N-ario ordenado puede interpretarse como binario sin perder el orden:

- el enlace izquierdo apunta al **primer hijo**;
- el enlace derecho apunta al **siguiente hermano**.

Para transformar N-ario → binario, se convierte el primer hijo y se encadenan sus hermanos mediante enlaces derechos. Los demás hijos no se conectan directamente al padre. El árbol vacío produce una raíz binaria vacía.

La interpretación inversa binario → N-ario comienza en la raíz, recorre su cadena izquierda-derecha como lista de hijos y repite el proceso para cada hijo. El enlace derecho de la raíz debe ser vacío: si existe, representa un hermano de la raíz y la entrada está mal formada. También deben rechazarse ciclos o nodos binarios alcanzables por más de un camino.

```text
N-ario:              Binario primer-hijo/siguiente-hermano:
A                    A
├─ B                 /
│  ├─ D              B ── C
│  └─ E              /    /
└─ C                 D──E F
   └─ F
```

No es un árbol binario de búsqueda: `izquierdo` y `derecho` codifican relaciones, no comparaciones. Convertir o reconstruir visita cada nodo una vez: **O(n)** tiempo y O(h) espacio auxiliar.

## 3. Representación con vectores e índices

Las referencias son expresivas, pero un vector mejora la **localidad** de memoria y permite serializar relaciones como números. Este diseño almacena nodos en un `List<NodoIndexado>` y usa tres índices: padre, primer hijo y siguiente hermano. `SIN_INDICE` representa ausencia.

```java
import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public final class ArbolIndexado {
    private static final int SIN_INDICE = -1;
    private static final int CAPACIDAD_MAXIMA = 10_000;

    public record NodoIndexado(
        String valor,
        int padre,
        int primerHijo,
        int siguienteHermano
    ) {
        public NodoIndexado {
            if (valor == null || valor.isBlank()) {
                throw new IllegalArgumentException("valor obligatorio");
            }
        }
    }

    private final List<NodoIndexado> nodos;
    private final int raiz;

    public ArbolIndexado(List<NodoIndexado> nodos, int raiz) {
        if (nodos == null) throw new IllegalArgumentException("nodos obligatorios");
        if (nodos.size() > CAPACIDAD_MAXIMA) {
            throw new IllegalArgumentException("capacidad máxima excedida");
        }
        this.nodos = List.copyOf(nodos);
        if (nodos.isEmpty()) {
            if (raiz != SIN_INDICE) throw new IllegalArgumentException("árbol vacío sin raíz");
            this.raiz = SIN_INDICE;
            return;
        }
        exigirIndice(raiz, "raíz");
        this.raiz = raiz;
        validar();
    }

    private void exigirIndice(int indice, String campo) {
        if (indice < 0 || indice >= nodos.size()) {
            throw new IndexOutOfBoundsException("índice inválido en " + campo + ": " + indice);
        }
    }

    private void validarEnlace(int indice, String campo) {
        if (indice != SIN_INDICE) exigirIndice(indice, campo);
    }

    private void validar() {
        if (nodos.get(raiz).padre() != SIN_INDICE) {
            throw new IllegalArgumentException("la raíz no puede tener padre");
        }
        for (int i = 0; i < nodos.size(); i++) {
            NodoIndexado n = nodos.get(i);
            validarEnlace(n.padre(), "padre");
            validarEnlace(n.primerHijo(), "primer hijo");
            validarEnlace(n.siguienteHermano(), "siguiente hermano");
        }

        Set<Integer> vistos = new HashSet<>();
        ArrayDeque<Integer> pendientes = new ArrayDeque<>();
        pendientes.push(raiz);
        while (!pendientes.isEmpty()) {
            int actual = pendientes.pop();
            if (!vistos.add(actual)) {
                throw new IllegalArgumentException("ciclo o nodo con varios padres");
            }
            int hijo = nodos.get(actual).primerHijo();
            Set<Integer> hermanos = new HashSet<>();
            while (hijo != SIN_INDICE) {
                if (!hermanos.add(hijo)) {
                    throw new IllegalArgumentException("ciclo en cadena de hermanos");
                }
                if (nodos.get(hijo).padre() != actual) {
                    throw new IllegalArgumentException("padre inconsistente");
                }
                pendientes.push(hijo);
                hijo = nodos.get(hijo).siguienteHermano();
            }
        }
        if (vistos.size() != nodos.size()) {
            throw new IllegalArgumentException("existen nodos inalcanzables");
        }
    }

    public List<String> preorden() {
        if (raiz == SIN_INDICE) return List.of();
        java.util.ArrayList<String> salida = new java.util.ArrayList<>();
        recorrer(raiz, salida);
        return List.copyOf(salida);
    }

    private void recorrer(int indice, List<String> salida) {
        salida.add(nodos.get(indice).valor());
        for (int hijo = nodos.get(indice).primerHijo();
             hijo != SIN_INDICE;
             hijo = nodos.get(hijo).siguienteHermano()) {
            recorrer(hijo, salida);
        }
    }
}
```

La validación es O(n): cada nodo y enlace válido se procesa una cantidad acotada de veces. El límite de capacidad evita aceptar entradas que agoten memoria, y `List.copyOf` impide mutaciones externas posteriores.

## 4. Costos y elección

| Operación o propiedad | Nodos con referencias | Vector con índices |
| :--- | :--- | :--- |
| Recorrido completo | O(n) | O(n), normalmente con mejor localidad |
| Insertar con posición conocida | O(1), más asignación | O(1) amortizado; puede reasignar el vector |
| Buscar padre sin enlace padre | O(n) | O(1) con índice `padre` |
| Eliminar subárbol | O(k), con recolección automática | O(k), pero compactar cambia índices |
| Capacidad dispersa | Sin huecos explícitos | Índices estables pueden dejar huecos |

Los índices son útiles para persistencia, redes y pools compactos. Las referencias facilitan ediciones y evitan actualizar índices al compactar. En ambos casos, insertar o borrar exige conservar padre, primer hijo y cadena de hermanos; rendimiento sin invariantes solo produce corrupción más rápido.
