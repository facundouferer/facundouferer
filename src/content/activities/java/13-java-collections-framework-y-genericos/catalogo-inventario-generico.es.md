---
course: 'java'
lesson: '13-java-collections-framework-y-genericos'
slug: 'catalogo-inventario-generico'
title: 'Repositorio Genérico y Catálogo de Inventario con JCF'
description: 'Diseñá un repositorio genérico in-memory utilizando List, Set y Map del Java Collections Framework, implementando parametrización de tipos y control de duplicados.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 50
objectives:
  - 'Construir interfaces y clases genéricas con restricciones de tipos (<T extends Identificable<ID>>).'
  - 'Seleccionar y combinar adecuadamente estructuras de Java Collections Framework (List, Set, Map) según la complejidad requerida.'
  - 'Garantizar el encapsulamiento devolviendo colecciones inmutables o copias defensivas.'
  - 'Aplicar el principio de responsabilidad única separando las entidades del dominio de la lógica de almacenamiento.'
requirements:
  - 'Definir la interfaz genérica Identificable<ID> con el método ID getId().'
  - 'Crear la clase de dominio Producto que implemente Identificable<String> con campos privados inmutables o protegidos: id (String), nombre (String), categoria (String) y precio (double).'
  - 'Definir la interfaz Repositorio<T extends Identificable<ID>, ID> con métodos: guardar(T entidad), buscarPorId(ID id), listarTodos(), eliminar(ID id) y existe(ID id).'
  - 'Implementar RepositorioMemoria<T extends Identificable<ID>, ID> utilizando internamente un Map<ID, T> (HashMap) para búsquedas O(1).'
  - 'Crear la clase CatalogoProductos que utilice el repositorio y mantenga un Set<String> (HashSet) con las categorías únicas registradas.'
  - 'En MainInventario.java, registrar productos de distintas categorías, buscar por identificador, iterar sobre la lista devuelta y validar que no se permitan productos nulos ni identificadores duplicados.'
exampleOutput: |
  === Sistema de Gestión de Inventario Genérico ===
  [OK] Producto registrado: PROD-101 | Laptop Pro 16" | Tecnología | $1850.0
  [OK] Producto registrado: PROD-102 | Monitor 4K 27" | Tecnología | $420.0
  [OK] Producto registrado: PROD-103 | Escritorio Regulable | Mobiliario | $550.0
  --------------------------------------------------
  Categorías disponibles en catálogo: [Mobiliario, Tecnología]
  Búsqueda por ID (PROD-102): Encontrado -> Monitor 4K 27" ($420.0)
  Total de ítems en inventario: 3
  [ALERTA] Intento de duplicado rechazado: Ya existe entidad con ID PROD-101.
deliveryTips:
  - 'Compilá con javac *.java y ejecutá con java MainInventario.'
  - 'Utilizá Collections.unmodifiableList() o new ArrayList<>(...) para no exponer la estructura interna del repositorio.'
  - 'Validá los argumentos de entrada lanzando IllegalArgumentException cuando corresponda.'
---

## Contexto

En el desarrollo de software corporativo moderno, manejar entidades de negocio (productos, clientes, órdenes) mediante estructuras primitivas o colecciones sin tipos (`raw types` como `ArrayList` sin `<>`) introduce graves riesgos de errores en tiempo de ejecución (`ClassCastException`).

El **Java Collections Framework (JCF)** provee abstracciones de alto nivel (`List`, `Set`, `Map`) que, combinadas con **tipos genéricos (`Generics`)**, permiten diseñar componentes reutilizables, fuertemente tipados y eficientes.

## Consigna

Vas a implementar un motor de almacenamiento en memoria genérico siguiendo las mejores prácticas de Programación Orientada a Objetos y Código Limpio.

### 1. Abstracción del Dominio

- **`Identificable.java`**:
  ```java
  public interface Identificable<ID> {
      ID getId();
  }
  ```
- **`Producto.java`**:
  - Implementa `Identificable<String>`.
  - Atributos privados: `id` (`String`), `nombre` (`String`), `categoria` (`String`), `precio` (`double`).
  - Constructor canónico que valide que ningún `String` sea nulo o vacío y que el `precio` sea estrictamente mayor a 0.
  - Métodos accesores (getters) y método `toString()` formateado con claridad.

### 2. Capa de Persistencia Genérica

- **`Repositorio.java`**:
  - Interfaz genérica con restricción de tipos:
  ```java
  public interface Repositorio<T extends Identificable<ID>, ID> {
      void guardar(T entidad);
      T buscarPorId(ID id);
      List<T> listarTodos();
      boolean eliminar(ID id);
      boolean existe(ID id);
      int contar();
  }
  ```
- **`RepositorioMemoria.java`**:
  - Implementación que utiliza un `Map<ID, T> almacenamiento = new HashMap<>();`.
  - `guardar(T entidad)`: si `entidad == null`, lanza `IllegalArgumentException`. Si ya existe una entidad con esa clave (`almacenamiento.containsKey(entidad.getId())`), lanza `IllegalStateException` con un mensaje descriptivo.
  - `buscarPorId(ID id)`: retorna la entidad encontrada o `null`.
  - `listarTodos()`: devuelve una copia inmutable o una nueva lista `new ArrayList<>(almacenamiento.values())`, protegiendo la colección interna contra modificaciones externas no autorizadas.

### 3. Servicio de Catálogo

- **`CatalogoProductos.java`**:
  - Encapsula una instancia de `Repositorio<Producto, String>`.
  - Mantiene un `Set<String> categorias = new HashSet<>();` que registra automáticamente las categorías existentes sin duplicados.
  - Provee métodos para agregar productos, consultar categorías únicas (`Set<String>`) y buscar por ID.

### 4. Demostración en `MainInventario`

En `MainInventario.java`:
1. Instanciá el catálogo.
2. Registrá varios productos válidos.
3. Mostrá la lista completa y el conjunto de categorías únicas.
4. Realizá una búsqueda exitosa y otra fallida.
5. Verificá que al intentar ingresar un producto con un ID existente, el sistema capture la excepción e informe el rechazo.
