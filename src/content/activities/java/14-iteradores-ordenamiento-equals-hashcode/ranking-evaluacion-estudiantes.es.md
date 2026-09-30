---
course: 'java'
lesson: '14-iteradores-ordenamiento-equals-hashcode'
slug: 'ranking-evaluacion-estudiantes'
title: 'Sistema de Ranking y Auditoría con Contrato equals/hashCode y Comparadores'
description: 'Diseñá un modelo de estudiantes implementando Comparable para orden natural, Comparators desacoplados por criterios múltiples y el contrato riguroso de equals y hashCode.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 50
objectives:
  - 'Implementar el contrato bidireccional estricto entre equals(Object) y hashCode().'
  - 'Comprender por qué las claves utilizadas en tablas Hash deben ser inmutables.'
  - 'Implementar la interfaz Comparable<T> para definir el orden natural de una entidad.'
  - 'Crear múltiples clases Comparator<T> desacopladas para ordenar por criterios alternativos.'
  - 'Utilizar Iterator<T> para remover elementos de forma segura durante un recorrido.'
requirements:
  - 'Crear la clase Estudiante con campos privados inmutables legajo (String), nombre (String) y promedio (double).'
  - 'Sobrescribir equals(Object) y hashCode() basándose exclusivamente en el campo identificador inmutable legajo.'
  - 'Implementar Comparable<Estudiante> en Estudiante ordenando por orden alfabético de nombre como orden natural.'
  - 'Crear el comparador ComparadorPorPromedioDescendente que implemente Comparator<Estudiante> ordenando de mayor a menor promedio.'
  - 'Crear la clase RegistroAcademico que almacene estudiantes en un Set<Estudiante> (HashSet) y permita buscar, ordenar y depurar.'
  - 'Implementar en RegistroAcademico el método eliminarConPromedioInferiorA(double umbral) utilizando un Iterator explícito para evitar ConcurrentModificationException.'
  - 'En MainRanking.java, demostrar inserción sin duplicados en HashSet, orden natural con Collections.sort(...) y ordenación alternativa con el Comparator.'
exampleOutput: |
  === Sistema de Ranking Académico ===
  [OK] Registrando estudiantes en conjunto Hash...
  Estudiantes únicos en registro: 4
  [ALERTA] Intento de ingresar duplicado con legajo EST-001 ignorado por HashSet.
  --------------------------------------------------
  Listado en Orden Natural (Nombre alfabético):
  1. Ana Gómez | Legajo: EST-002 | Promedio: 9.20
  2. Carlos Pérez | Legajo: EST-001 | Promedio: 7.80
  3. Javier López | Legajo: EST-004 | Promedio: 4.50
  4. Martina Ruiz | Legajo: EST-003 | Promedio: 8.90
  --------------------------------------------------
  Ranking por Rendimiento (Promedio Descendente):
  1. Ana Gómez (9.20)
  2. Martina Ruiz (8.90)
  3. Carlos Pérez (7.80)
  4. Javier López (4.50)
  --------------------------------------------------
  Depuración: Eliminando estudiantes con promedio menor a 6.00 con Iterator...
  [AUDITORÍA] Removido: Javier López (4.50)
  Total de estudiantes vigentes: 3
deliveryTips:
  - 'Compilá con javac *.java y ejecutá con java MainRanking.'
  - 'Recordá que en equals debes verificar si obj == this, luego instanceof o getClass(), y castear.'
  - 'Nunca uses un foreach (for : collection) para invocar collection.remove() mientras iteras, usá iterator.remove().'
---

## Contexto

En sistemas de información reales, la identidad de una entidad y su orden de presentación son conceptos ortogonales. Dos objetos pueden ser idénticos según el negocio (mismo legajo o DNI) aunque se presenten ordenados por diferentes métricas (apellido, fecha de inscripción o rendimiento).

Si se sobrescribe `equals()` sin sobrescribir `hashCode()`, o si las claves de un `HashSet` o `HashMap` mutan sus campos de identidad, las estructuras Hash pierden la capacidad de localizar las entradas, provocando pérdida de datos silenciosa y duplicados espurios.

## Consigna

Vas a implementar un sistema de gestión académica donde la identidad de los estudiantes esté sólidamente protegida y el ordenamiento sea flexible.

### 1. Entidad Inmutable y Contrato `equals/hashCode`

- **`Estudiante.java`**:
  - Implementa `Comparable<Estudiante>`.
  - Atributos privados:
    - `private final String legajo;`
    - `private final String nombre;`
    - `private final double promedio;`
  - Constructor con validaciones: `legajo` y `nombre` no nulos ni vacíos; `promedio` entre 0.0 y 10.0.
  - Métodos accesores (getters).
  - **Sobrescritura de `equals(Object o)`**:
    - Si `this == o`, retorna `true`.
    - Si `o == null || getClass() != o.getClass()`, retorna `false`.
    - Compara `this.legajo.equals(other.legajo)`.
  - **Sobrescritura de `hashCode()`**:
    - Genera el hash a partir de `Objects.hash(legajo)`.
  - **Implementación de `compareTo(Estudiante otro)`**:
    - Orden natural por nombre: `this.nombre.compareToIgnoreCase(otro.nombre)`.

### 2. Comparador Alternativo Desacoplado

- **`ComparadorPorPromedioDescendente.java`**:
  - Implementa `Comparator<Estudiante>`.
  - En `compare(Estudiante a, Estudiante b)`:
    - Compara `Double.compare(b.getPromedio(), a.getPromedio())` (orden descendente).
    - En caso de empate en promedio, desempata por orden alfabético de nombre.

### 3. Servicio de Registro Académico con `Iterator`

- **`RegistroAcademico.java`**:
  - Contiene un `Set<Estudiante> estudiantes = new HashSet<>();`.
  - Métodos:
    - `public boolean agregar(Estudiante estudiante)`: valida nulo y delega en el set.
    - `public List<Estudiante> obtenerOrdenadosPorNombre()`: genera una nueva lista con los elementos y la ordena con `Collections.sort(lista)`.
    - `public List<Estudiante> obtenerRankingPorPromedio()`: genera una lista y la ordena con `Collections.sort(lista, new ComparadorPorPromedioDescendente())`.
    - `public void eliminarConPromedioInferiorA(double umbral)`:
      - Obtiene un `Iterator<Estudiante> it = estudiantes.iterator();`.
      - Recorre con `while (it.hasNext())`.
      - Si `it.next().getPromedio() < umbral`, ejecuta `it.remove();` para eliminar de forma segura durante la iteración.

### 4. Prueba Integral en `MainRanking`

1. Instanciá `RegistroAcademico`.
2. Agregá al menos 4 estudiantes con distintos legajos y promedios.
3. Intentá agregar un estudiante con un legajo ya existente (comprobá que el `HashSet` lo rechace devolviendo `false`).
4. Mostrá la lista en orden natural (alfabético).
5. Mostrá la lista en orden por promedio descendente.
6. Ejecutá la depuración por umbral y verificá el estado final de la colección.
