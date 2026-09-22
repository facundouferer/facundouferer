---
course: 'java'
lesson: '04-arrays-y-strings'
slug: 'autoevaluacion-arrays-y-strings'
title: 'Autoevaluación: Arrays y Manejo de Strings'
description: 'Diez preguntas sobre memoria contigua, índices, valores por defecto, inmutabilidad de String, el String Constant Pool, equals vs == y StringBuilder.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Por qué el acceso a un elemento de un array mediante su índice (por ejemplo arr[i]) tiene un costo de tiempo constante O(1)?'
    options:
      - id: 'a'
        text: 'Porque la JVM realiza una búsqueda binaria interna sobre los datos.'
      - id: 'b'
        text: 'Porque los elementos residen en un bloque contiguo de memoria y su dirección física se calcula con una simple suma aritmética.'
      - id: 'c'
        text: 'Porque los arrays se guardan siempre en la memoria caché del procesador.'
      - id: 'd'
        text: 'Porque Java reserva un puntero individual para cada elemento en el Stack.'
    correctOptionId: 'b'
    explanation: >-
      Un array en Java es un bloque continuo y sin huecos en el Heap. La dirección
      de cualquier elemento se obtiene instantáneamente con la fórmula:
      `dirección_base + índice * tamaño_casilla`. Al no requerir búsquedas ni
      recorridos, el acceso es inmediato (O(1)).
  - kind: 'true-false'
    id: 'q2'
    prompt: 'La instrucción `String[] nombres = new String[4];` inicializa un array con cuatro cadenas de texto vacías `""`.'
    correctAnswer: false
    explanation: >-
      `String` es un tipo por referencia, no primitivo. Al instanciar un array
      de referencias con `new`, Java inicializa cada casilla con su valor por defecto,
      que es `null`. Si intentás llamar a `nombres[0].length()` sin haber asignado
      un objeto antes, se producirá un `NullPointerException`.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué salida produce por consola la ejecución del siguiente código?'
    code: |-
      String s1 = new String("Java");
      String s2 = new String("Java");
      System.out.println(s1 == s2);
      System.out.println(s1.equals(s2));
    options:
      - id: 'a'
        text: 'true y true'
      - id: 'b'
        text: 'false y true'
      - id: 'c'
        text: 'true y false'
      - id: 'd'
        text: 'false y false'
    correctOptionId: 'b'
    explanation: >-
      El operador `==` compara referencias (direcciones de memoria en el Heap).
      Al usar `new String()`, se crean dos objetos distintos en posiciones de memoria
      diferentes, por lo que `s1 == s2` da `false`. Por otro lado, el método `.equals()`
      compara el contenido de caracteres, devolviendo `true`.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'Una vez creado un array en Java, es posible modificar su tamaño en memoria aumentando su capacidad sin crear un nuevo bloque.'
    correctAnswer: false
    explanation: >-
      Los arrays en Java son estrictamente de longitud fija. Inmediatamente
      después de su bloque contiguo en el Heap puede haber otros datos ubicados
      por la JVM. Para "agrandar" un array se debe instanciar un nuevo array de
      mayor capacidad y copiar los elementos existentes (por ejemplo con `Arrays.copyOf`).
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué excepción arroja este código al ejecutarse?'
    code: |-
      int[] numeros = {10, 20, 30};
      System.out.println(numeros[3]);
    options:
      - id: 'a'
        text: 'NullPointerException'
      - id: 'b'
        text: 'ArrayIndexOutOfBoundsException'
      - id: 'c'
        text: 'NegativeArraySizeException'
      - id: 'd'
        text: 'No lanza excepción: imprime 0 por defecto.'
    correctOptionId: 'b'
    explanation: >-
      Los índices en un array de tamaño 3 van desde `0` hasta `length - 1` (es decir,
      0, 1 y 2). Intentar acceder al índice `3` excede los límites válidos del bloque,
      provocando un `ArrayIndexOutOfBoundsException` en tiempo de ejecución.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Por qué se recomienda utilizar StringBuilder en lugar de concatenar con el operador + dentro de un bucle de muchas iteraciones?'
    options:
      - id: 'a'
        text: 'Porque el operador + no compila dentro de bucles.'
      - id: 'b'
        text: 'Porque String es inmutable: concatenar con + crea un objeto nuevo en cada vuelta, saturando la memoria y el Garbage Collector.'
      - id: 'c'
        text: 'Porque StringBuilder convierte automáticamente los datos a tipos primitivos.'
      - id: 'd'
        text: 'Porque StringBuilder guarda los datos en el Stack en lugar del Heap.'
    correctOptionId: 'b'
    explanation: >-
      Al ser `String` inmutable, cada concatenación con `+` genera un nuevo objeto
      `String` en el Heap y descarta el anterior, resultando en un costo cuadrático
      O(n²) y gran presión para el Garbage Collector. `StringBuilder` mantiene un
      búfer interno modificable que muta en memoria con costo lineal O(n).
  - kind: 'true-false'
    id: 'q7'
    prompt: 'En Java, para consultar la longitud de un array se accede al atributo `array.length` (sin paréntesis), mientras que en String se llama al método `texto.length()` (con paréntesis).'
    correctAnswer: true
    explanation: >-
      Es una distinción histórica fundamental en Java: en los arrays, `length`
      es una propiedad especial inmutable del contenedor (`array.length`),
      mientras que en la clase `String` es un método que devuelve la cantidad
      de caracteres (`texto.length()`).
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué valor imprime este código en consola tras invocar toUpperCase()?'
    code: |-
      String texto = "hola";
      texto.toUpperCase();
      System.out.println(texto);
    options:
      - id: 'a'
        text: 'HOLA'
      - id: 'b'
        text: 'hola'
      - id: 'c'
        text: 'null'
      - id: 'd'
        text: 'Error de compilación porque toUpperCase requiere parámetros.'
    correctOptionId: 'b'
    explanation: >-
      Los Strings son inmutables. El método `toUpperCase()` no modifica la cadena
      original `"hola"`, sino que genera y retorna una nueva instancia con el texto
      en mayúsculas. Como en el código no se reasignó el resultado (`texto = texto.toUpperCase();`),
      la variable `texto` conserva su valor original `"hola"`.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Qué método de la clase `java.util.Arrays` permite imprimir en una sola línea el contenido legible de un vector unidimensional (por ejemplo `[1, 2, 3]`)?'
    options:
      - id: 'a'
        text: 'Arrays.toString(array)'
      - id: 'b'
        text: 'Arrays.print(array)'
      - id: 'c'
        text: 'array.toText()'
      - id: 'd'
        text: 'System.out.printArray(array)'
    correctOptionId: 'a'
    explanation: >-
      Si pasás un array directamente a `System.out.println(array)`, Java imprimirá
      la representación por defecto del objeto (ej. `[I@7f3a2c`). La utilidad
      estándar `Arrays.toString(array)` formatea los elementos entre corchetes
      separados por comas.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'El String Constant Pool es una zona del Heap donde la JVM reutiliza instancias de literales de texto idénticos para ahorrar memoria.'
    correctAnswer: true
    explanation: >-
      Cuando se define un literal como `String a = "hola";` y luego `String b = "hola";`,
      la JVM no duplica la memoria: ambas referencias apuntan a la misma entrada
      dentro del String Constant Pool. Por eso, en literales puros, `a == b` evalúa `true`.
---

Elegí una respuesta por pregunta y presioná **Calificar** para comprobar tu dominio sobre arrays, matrices, inmutabilidad y manipulación de cadenas en Java.
