---
course: 'java'
lesson: '07-fundamentos-poo-clases-y-objetos'
slug: 'gestion-inventario-tienda'
title: 'Sistema de Gestión de Inventario de una Tienda'
description: 'Modelá una clase Producto con atributos y métodos, instanciá varios objetos con new y comprobá cómo las referencias comparten el mismo objeto en memoria.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 45
objectives:
  - 'Definir una clase con atributos (estado) y métodos (comportamiento).'
  - 'Instanciar varios objetos independientes con el operador new.'
  - 'Usar this para resolver el sombreamiento entre un parámetro y un atributo.'
  - 'Distinguir entre copiar una referencia y crear un objeto nuevo.'
requirements:
  - 'Crear la clase Producto.java con los atributos públicos nombre (String), codigo (String), precio (double) y stock (int).'
  - 'Implementar venderUnidades(int cantidad): si cantidad es positiva y no supera el stock disponible, descuenta el stock e informa la venta por consola; en caso contrario, informa el error (cantidad inválida o stock insuficiente).'
  - 'Implementar reponerStock(int cantidad): si cantidad es positiva, incrementa el stock e informa la reposición; en caso contrario, informa el error.'
  - 'Implementar actualizarPrecio(double precio), usando this.precio para resolver el sombreamiento con el parámetro precio, y mostrar el precio anterior junto al nuevo.'
  - 'Implementar mostrarFicha(), que imprima todos los datos del producto de forma prolija.'
  - 'En el método main, instanciar al menos tres objetos Producto con new, asignarles atributos distintos y llamar a sus métodos mostrando que cada objeto mantiene su propio estado, sin afectar a los demás.'
  - 'Demostrar el aliasing de referencias: guardar una referencia ya existente en otra variable (por ejemplo Producto copia = productoUno;), modificar copia.stock y mostrar que productoUno.stock también cambió, porque ambas variables apuntan al mismo objeto en el Heap.'
exampleOutput: |
  === Ficha de producto ===
  Código:  P-001
  Nombre:  Teclado mecánico
  Precio:  $45000.0
  Stock:   12
  ==========================
  Venta realizada: 3 unidades de Teclado mecánico. Stock restante: 9
  Error: stock insuficiente para vender 50 unidades de Teclado mecánico.
  Reposición registrada: +20 unidades. Stock actual: 29
  Precio actualizado de Teclado mecánico: $45000.0 -> $39900.0
  Stock de productoUno tras modificar copia: 29 (mismo objeto en el Heap)
extensionChallenges:
  - 'Agregar un método aplicarDescuento(double porcentaje) que reduzca el precio un porcentaje dado, validando que esté entre 0 y 100.'
  - 'Si ya viste arreglos, crear un arreglo de 3 objetos Producto y recorrerlo con un for llamando a mostrarFicha() en cada uno.'
deliveryTips:
  - 'Compilá con javac Producto.java MainInventario.java y ejecutá con java MainInventario.'
  - 'Usá nombres de variables descriptivos (productoUno, productoDos) en lugar de p1, p2.'
  - 'Probá primero los casos válidos y después los casos de error (stock insuficiente, cantidades negativas o cero).'
---

## Contexto

Una tienda necesita un pequeño sistema para llevar el control de sus productos:
cuántas unidades tiene de cada uno, a qué precio se vende y cómo registrar ventas
y reposiciones. Vas a modelar esto con una clase `Producto` y vas a crear varios
objetos independientes a partir de ella, tal como viste en la lección: el plano
(`Producto`) frente a cada edificación concreta (cada producto real del local).

## Consigna

Escribí una clase Java llamada `Producto.java` que represente un artículo de la
tienda, y una clase `MainInventario.java` con el método `main` que la ponga a
prueba.

### 1. Atributos de la clase `Producto`

Definí los siguientes atributos públicos (estado del objeto):

- `nombre` (`String`)
- `codigo` (`String`)
- `precio` (`double`)
- `stock` (`int`)

Estructura sugerida para arrancar (completá los cuerpos de los métodos):

```java
public class Producto {
    public String nombre;
    public String codigo;
    public double precio;
    public int stock;

    public void venderUnidades(int cantidad) { /* ... */ }
    public void reponerStock(int cantidad) { /* ... */ }
    public void actualizarPrecio(double precio) { /* ... */ }
    public void mostrarFicha() { /* ... */ }
}
```

### 2. Métodos (comportamiento)

- **`venderUnidades(int cantidad)`**: si `cantidad` es mayor a cero y no supera el
  `stock` disponible, descontá el stock e imprimí un mensaje de venta exitosa.
  Si no se cumple alguna condición, imprimí un mensaje de error explicando cuál.
- **`reponerStock(int cantidad)`**: si `cantidad` es mayor a cero, sumala al
  `stock` e imprimí la confirmación. Si no, imprimí un error.
- **`actualizarPrecio(double precio)`**: el parámetro se llama igual que el
  atributo (sombreamiento intencional). Usá `this.precio` para referirte al
  atributo del objeto y actualizá su valor, mostrando el precio anterior y el
  nuevo.
- **`mostrarFicha()`**: imprimí todos los datos del producto con un formato
  prolijo, como en el ejemplo de salida esperada.

### 3. Instanciación en `main`

En `MainInventario`, creá **al menos tres** objetos `Producto` distintos con el
operador `new`, asignales atributos diferentes y ejercitá sus métodos. Verificá
que modificar un objeto (por ejemplo, vender unidades de `productoUno`) no
afecta en nada a los otros objetos: cada `new` reserva su propio espacio en el
Heap.

### 4. Referencias: alias vs. objeto nuevo

Para cerrar, comprobá con código la diferencia entre **copiar una referencia** y
**crear un objeto nuevo**:

```java
Producto copia = productoUno;
copia.stock = 29;
// productoUno.stock también es 29: copia y productoUno son la MISMA
// referencia, apuntando al mismo objeto en el Heap.
```

Mostrá por consola el valor de `productoUno.stock` después de modificar `copia`
para dejar en evidencia que no se creó un objeto nuevo, solo una segunda
variable apuntando al mismo lugar de memoria.

## Salida esperada (aproximada)

Ver `exampleOutput` — el formato exacto de tus mensajes puede variar, pero debe
comunicar la misma información: qué se vendió, qué se repuso, el cambio de
precio y el resultado del aliasing.
