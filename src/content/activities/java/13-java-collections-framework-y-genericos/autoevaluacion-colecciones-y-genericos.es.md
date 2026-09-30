---
course: 'java'
lesson: '13-java-collections-framework-y-genericos'
slug: 'autoevaluacion-colecciones-y-genericos'
title: 'Autoevaluación: Java Collections Framework y Tipos Genéricos'
description: 'Validá tus conocimientos sobre List, Set, Map, parametrización de tipos <T>, comodines y seguridad de tipos en Java.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es la diferencia fundamental en el contrato entre las interfaces `List` y `Set` dentro del Java Collections Framework?'
    options:
      - id: 'a'
        text: 'List solo almacena tipos primitivos, mientras que Set almacena objetos.'
      - id: 'b'
        text: 'List mantiene una secuencia indexada ordenada por inserción y admite duplicados; Set modela un conjunto matemático que no admite elementos duplicados.'
      - id: 'c'
        text: 'Set permite acceder a los elementos por índice posicional y List no.'
      - id: 'd'
        text: 'List es inmutable por defecto y Set es siempre mutable.'
    correctOptionId: 'b'
    explanation: >-
      `List` representa una colección indexada donde el orden de inserción se preserva y se permiten elementos repetidos. `Set` garantiza la unicidad de sus elementos según el contrato de `equals()`.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'En Java, `Map<K, V>` hereda directamente de la interfaz `Collection<E>`.'
    correctAnswer: false
    explanation: >-
      Falso. `Map` no extiende de `Collection` porque no representa una colección de elementos individuales, sino un mapeo de pares clave-valor (donde las claves forman un `Set` y los valores una `Collection`).
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué ventaja crucial ofrece el uso de tipos genéricos (`List<String>`) frente al uso de colecciones sin tipo (`raw types`, como `List`) introducidas en versiones antiguas de Java?'
    options:
      - id: 'a'
        text: 'El código compila directamente a código máquina nativo sin pasar por bytecode.'
      - id: 'b'
        text: 'Permite comprobación estática de tipos en tiempo de compilación y elimina la necesidad de casteos manuales propensos a ClassCastException en tiempo de ejecución.'
      - id: 'c'
        text: 'Duplica automáticamente la capacidad del Heap en tiempo de ejecución.'
      - id: 'd'
        text: 'Permite almacenar tipos primitivos sin autoboxing.'
    correctOptionId: 'b'
    explanation: >-
      Los Genéricos introducen seguridad de tipos (type safety) en tiempo de compilación. El compilador verifica que solo se agreguen objetos del tipo parametrizado, evitando errores en tiempo de ejecución al recuperar datos.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'La implementación `HashMap` ofrece operaciones de inserción (`put`), búsqueda (`get`) y eliminación (`remove`) en tiempo constante promedio O(1).'
    correctAnswer: true
    explanation: >-
      Verdadero. Al utilizar una función hash eficiente y una tabla de buckets, `HashMap` accede a las entradas en tiempo promedio O(1), siempre que la distribución de `hashCode()` sea uniforme.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Al diseñar una clase genérica, ¿qué significa la cláusula de acotación `<T extends Comparable<T>>`?'
    options:
      - id: 'a'
        text: 'Que el tipo T debe ser obligatoriamente una clase abstracta.'
      - id: 'b'
        text: 'Que el parámetro de tipo T está restringido a clases que implementen o extiendan la interfaz Comparable<T>, garantizando que sus instancias puedan compararse entre sí.'
      - id: 'c'
        text: 'Que la clase solo puede instanciarse con números enteros.'
      - id: 'd'
        text: 'Que T no puede tener métodos sobrescritos.'
    correctOptionId: 'b'
    explanation: >-
      Las acotaciones superiores (`bounded type parameters`) restringen los tipos admisibles y permiten que dentro de la clase genérica se invoquen los métodos provistos por el tipo acotado (en este caso, `compareTo`).
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Por qué la regla de Clean Code aconseja devolver colecciones inmutables (como `Collections.unmodifiableList(...)`) o copias defensivas desde los métodos de acceso de un servicio o repositorio?'
    options:
      - id: 'a'
        text: 'Para evitar que código externo modifique directamente el estado interno de la clase eludiendo las validaciones del dominio.'
      - id: 'b'
        text: 'Porque la JVM no permite retornar listas mutables entre distintas clases.'
      - id: 'c'
        text: 'Para forzar que el recolector de basura elimine la lista inmediatamente.'
      - id: 'd'
        text: 'Porque las listas inmutables consumen la mitad de memoria RAM.'
    correctOptionId: 'a'
    explanation: >-
      Devolver una referencia directa a una colección interna rompe el encapsulamiento: cualquier cliente podría vaciarla o corromper sus datos sin que el repositorio o entidad tenga control sobre ello.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'En tiempo de ejecución (runtime), la JVM conserva toda la información de los parámetros genéricos mediante un mecanismo llamado "Type Retention".'
    correctAnswer: false
    explanation: >-
      Falso. Java implementa los genéricos mediante "Type Erasure" (borrado de tipos): el compilador verifica los tipos y luego reemplaza los parámetros por `Object` (o su acotación superior), insertando los casts necesarios en el bytecode.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Cuándo es preferible utilizar `LinkedList` en lugar de `ArrayList`?'
    options:
      - id: 'a'
        text: 'Siempre, porque LinkedList es más moderna y consume menos memoria.'
      - id: 'b'
        text: 'Cuando el caso de uso requiere lecturas aleatorias continuas por índice (get(i)).'
      - id: 'c'
        text: 'Cuando se realizan inserciones y eliminaciones muy frecuentes en los extremos (al inicio o final) y se implementa una cola o deque, evitando el realojamiento continuo del arreglo interno.'
      - id: 'd'
        text: 'Nunca; LinkedList está deprecada en Java moderno.'
    correctOptionId: 'c'
    explanation: >-
      `LinkedList` destaca en inserciones y borrados en los extremos O(1). Sin embargo, para acceso posicional `ArrayList` es superior (O(1) frente a O(n)) y presenta mucha mejor localidad espacial en memoria caché.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Un `HashSet` garantiza que al iterar sobre sus elementos, estos se presentarán exactamente en el mismo orden en que fueron insertados.'
    correctAnswer: false
    explanation: >-
      Falso. `HashSet` no garantiza ningún orden particular al iterar. Si se requiere preservar el orden de inserción debe usarse `LinkedHashSet`, y si se requiere orden natural debe usarse `TreeSet`.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué método de `Map` permite obtener el valor asociado a una clave o devolver un valor predeterminado si la clave no existe, evitando comprobaciones manuales con `if`?'
    options:
      - id: 'a'
        text: 'map.findOrDefault(clave, defaultVal)'
      - id: 'b'
        text: 'map.getOrDefault(clave, defaultVal)'
      - id: 'c'
        text: 'map.search(clave).orElse(defaultVal)'
      - id: 'd'
        text: 'map.fetchOrFallback(clave, defaultVal)'
    correctOptionId: 'b'
    explanation: >-
      `getOrDefault(Object key, V defaultValue)` es el método estándar de `Map` que simplifica y vuelve más legible el manejo de claves potencialmente ausentes.
---
