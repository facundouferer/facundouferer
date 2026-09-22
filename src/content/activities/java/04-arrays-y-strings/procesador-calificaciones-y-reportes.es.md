---
course: 'java'
lesson: '04-arrays-y-strings'
slug: 'procesador-calificaciones-y-reportes'
title: 'Procesador de Calificaciones y Generador de Reportes'
description: 'Construí una herramienta en Java que procese vectores y matrices de datos, aplique java.util.Arrays, compare cadenas de forma segura y ensamble un reporte tabular eficiente usando StringBuilder.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 50
objectives:
  - 'Comprender el modelo de memoria contigua en el Heap de los arrays y el acceso por índice en tiempo constante O(1).'
  - 'Manipular matrices bidimensionales mediante bucles for anidados.'
  - 'Utilizar los métodos auxiliares de la clase java.util.Arrays (sort, copyOf, toString).'
  - 'Demostrar la inmutabilidad de String y la diferencia crucial entre comparar referencias con == y comparar contenido con equals().'
  - 'Optimizar la concatenación intensiva de texto con StringBuilder para evitar la creación indiscriminada de objetos temporales.'
requirements:
  - 'Crear el archivo ReporteEstudiantes.java con el método principal: public static void main(String[] args).'
  - 'Declarar e inicializar un array de 4 estudiantes con cadenas desprolijas: String[] estudiantes = {"  ana martinez  ", "CARLOS LOPEZ", "  lucia diaz ", "beto vargas"}.'
  - 'Crear un nuevo array String[] nombresLimpios de igual tamaño y normalizar cada elemento con trim() y toUpperCase() en un bucle.'
  - 'Definir una matriz bidimensional int[][] calificaciones de 4 filas y 3 columnas con notas enteras representativas de tres asignaturas.'
  - 'Recorrer la matriz con bucles for anidados para calcular la suma y el promedio exacto con decimales (double) de cada estudiante, almacenándolos en un array double[] promedios.'
  - 'Demostrar el redimensionamiento de arrays con java.util.Arrays.copyOf(estudiantes, 5) para evidenciar que el tamaño original no puede alterarse in situ.'
  - 'Clonar u ordenar un array numérico con java.util.Arrays.sort() e imprimir el resultado compacto mediante java.util.Arrays.toString().'
  - 'Construir el reporte final íntegramente con una única instancia de StringBuilder mediante llamadas consecutivas a append(), formateando columnas legibles con nombre, notas, promedio y estado ("APROBADO" si promedio >= 7.0, "REGULAR" si >= 4.0, "DESAPROBADO" si < 4.0).'
  - 'Incluir al final un bloque de verificación de igualdad de Strings: comparar dos cadenas con idéntico texto creadas por vías distintas (un literal y un new String()), imprimiendo el resultado de == y el de .equals(), evidenciando la trampa del String Constant Pool.'
  - 'Imprimir por consola el reporte generado a partir de sb.toString().'
exampleOutput: |
  ======================================================================
   REPORTE DE RENDIMIENTO ACADÉMICO (Construido con StringBuilder)
  ======================================================================
   ESTUDIANTE          | ASIGNATURAS     | PROMEDIO | CONDICIÓN
  ----------------------------------------------------------------------
   ANA MARTINEZ        | [8, 9, 7]       |   8.00   | APROBADO
   CARLOS LOPEZ        | [4, 5, 6]       |   5.00   | REGULAR
   LUCIA DIAZ          | [9, 10, 10]     |   9.67   | APROBADO
   BETO VARGAS         | [2, 4, 3]       |   3.00   | DESAPROBADO
  ======================================================================
  [Arrays.sort] Puntuaciones ordenadas de menor a mayor:
  [2, 3, 4, 4, 5, 6, 7, 8, 9, 9, 10, 10]

  [Arrays.copyOf] Array ampliado (longitud 5):
  [  ana martinez  , CARLOS LOPEZ,   lucia diaz , beto vargas, null]

  ======================================================================
   VERIFICACIÓN DEL MODELO DE MEMORIA EN STRINGS
  ======================================================================
   str1 = "JAVA"; (String Constant Pool)
   str2 = new String("JAVA"); (Nuevo objeto en Heap)
   ¿str1 == str2?     false  -> Compara direcciones físicas de memoria distintas
   ¿str1.equals(str2)? true   -> Compara el contenido de caracteres
  ======================================================================
extensionChallenges:
  - 'Agregá un cálculo para determinar cuál de las tres asignaturas tuvo el promedio general más alto entre todos los alumnos.'
  - 'Probá qué ocurre si intentás acceder a calificaciones[0][3] y explicá en un comentario por qué la JVM lanza ArrayIndexOutOfBoundsException.'
deliveryTips:
  - 'Importá la utilidad con import java.util.Arrays; al comienzo del archivo fuente.'
  - 'No uses métodos fuera de main: concentrá la lógica dentro de main para dominar el uso de índices y matrices sin abstracciones intermedias.'
  - 'Recordá que length en un array es un atributo sin paréntesis (array.length), mientras que en String y StringBuilder es un método (str.length()).'
---

## Contexto

En el ecosistema Java, los **arrays** y los **Strings** comparten una raíz común: cómo la JVM organiza la memoria en el Heap.
1. Un array es un bloque contiguo de casillas de tamaño fijo. Si querés agrandarlo, debés pedir un bloque nuevo y copiar los elementos con `Arrays.copyOf()`.
2. Un `String` es un objeto inmutable respaldado por un array de caracteres. Cada vez que concatenás con el operador `+` en un bucle, la JVM crea un nuevo objeto en memoria y descarta el anterior, generando un desperdicio enorme de recursos. Para ensamblar reportes o textos dinámicos de forma eficiente, la herramienta profesional es **`StringBuilder`**.
3. Al comparar cadenas, el operador `==` evalúa si dos variables apuntan al mismo casillero del Heap, no si tienen las mismas letras. Por eso, comparar textos siempre exige **`.equals()`**.

## Consigna

Creá la clase `ReporteEstudiantes.java` que aplique estos conceptos para procesar las calificaciones de un grupo de estudiantes.

### 1. Datos de Origen

Declaralos en `main`:

```java
import java.util.Arrays;

public class ReporteEstudiantes {
    public static void main(String[] args) {
        String[] estudiantes = {"  ana martinez  ", "CARLOS LOPEZ", "  lucia diaz ", "beto vargas"};
        
        int[][] calificaciones = {
            {8, 9, 7},
            {4, 5, 6},
            {9, 10, 10},
            {2, 4, 3}
        };

        // 1. Normalizar nombres
        // 2. Calcular promedios
        // 3. Demostrar Arrays.copyOf y Arrays.sort
        // 4. Construir tabla con StringBuilder
        // 5. Demostrar == vs .equals()
    }
}
```

### 2. Procesamiento con StringBuilder

Instanciá `StringBuilder sb = new StringBuilder();` y agregá encabezados, filas de estudiantes y separadores con `.append()`. Al finalizar, mostrá el resultado con un único `System.out.println(sb.toString());`.

### 3. Prueba de Fuego: `==` vs `.equals()`

Creá dos variables:
```java
String base = "JAVA";
String dinamica = new String("JAVA");
```
Mostrá en consola por qué `base == dinamica` resulta `false` (apuntan a instancias distintas) mientras que `base.equals(dinamica)` resulta `true` (contienen la misma secuencia de caracteres).
