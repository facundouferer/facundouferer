---
course: 'java'
lesson: '05-metodos-y-funciones'
slug: 'procesador-estadistico-modular'
title: 'Procesador Estadístico y Métricas Modulares'
description: 'Desarrollá una clase utilitaria aplicando métodos modulares, sobrecarga, demostración de pasaje por valor y recursión acotada con centinelas.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 40
objectives:
  - 'Modularizar operaciones aplicando responsabilidad única y el principio DRY.'
  - 'Demostrar en la práctica el pasaje por valor (pass-by-value) tanto en primitivos como en referencias de arrays.'
  - 'Implementar sobrecarga de métodos (overloading) para operar sobre distintos tipos numéricos.'
  - 'Construir un método recursivo acotado con caso base y valor centinela ante parámetros inválidos.'
  - 'Aplicar código limpio: métodos concisos, nombres expresivos y sin efectos secundarios no documentados.'
requirements:
  - 'Crear la clase EstadisticaUtils.java con métodos estáticos enfocados en tareas específicas.'
  - 'Implementar sobrecarga de métodos: calcularPromedio(int[] valores) y calcularPromedio(double[] valores). Ambos deben validar array null o vacío retornando -1.0 como centinela documentado.'
  - 'Implementar obtenerMaximo(int[] valores), retornando el mayor elemento o Integer.MIN_VALUE si el array es null o vacío.'
  - 'Implementar potenciaRecursiva(int base, int exponente) de forma recursiva acotada: validar que exponente no sea negativo (retornar -1 como centinela) ni supere MAX_EXPONENTE = 20, con caso base exponente == 0 devolviendo 1.'
  - 'Implementar el método probarPasajePorValor(int numero, int[] arreglo): reasignar numero = 999 y modificar arreglo[0] = 999.'
  - 'En la clase MainEstadistica.java, ejecutar pruebas que demuestren que la variable primitiva en main conserva su valor intacto, mientras que la posición del array sí cambió en memoria Heap.'
  - 'Implementar imprimirReporte(String metrica, double resultado) para centralizar la presentación en consola sin duplicar lógica de formato.'
exampleOutput: |
  === Reporte Estadístico Modular ===
  Promedio enteros: 14.50
  Promedio decimales: 22.75
  Valor máximo: 35
  Potencia recursiva (2^8): 256.00
  === Demostración de Pasaje por Valor ===
  Valor primitivo antes: 10 | después: 10 (sin cambios en Stack)
  Elemento array antes: 10 | después: 999 (modificado en Heap)
deliveryTips:
  - 'Compilá con javac EstadisticaUtils.java MainEstadistica.java y ejecutá con java MainEstadistica.'
  - 'No uses excepciones todavía; las validaciones deben retornar valores centinela documentados e imprimir un mensaje informativo.'
  - 'Asegurate de que cada método resuelva solo una tarea y tenga un nombre con verbo que describa su acción.'
---

## Contexto

En el desarrollo de software profesional, un código sin modularizar se vuelve un monolito frágil, difícil de testear y propenso a errores por duplicación. Al aislar cada cálculo en métodos independientes y reutilizables, aplicamos el principio **DRY** (*Don't Repeat Yourself*) y sentamos las bases de un código limpio y mantenible.

Además, entender cómo la JVM gestiona la memoria en la pila de llamadas (**Call Stack**) y el **pasaje por valor** evita errores clásicos al esperar que un método reasigne variables externas.

## Consigna

Vas a construir dos clases:
1. `EstadisticaUtils.java`: biblioteca de métodos estáticos de cálculo y análisis.
2. `MainEstadistica.java`: programa principal que valida el comportamiento, demuestra la sobrecarga de métodos y comprueba la mecánica del pasaje por valor.

### 1. Métodos de cálculo y sobrecarga

- `calcularPromedio(int[] valores)`: calcula la suma y retorna el promedio como `double`. Si el array es `null` o tiene longitud 0, informa el error y retorna `-1.0`.
- `calcularPromedio(double[] valores)`: sobrecarga del método anterior para admitir arrays de coma flotante, aplicando la misma regla de validación.
- `obtenerMaximo(int[] valores)`: recorre el array buscando el elemento de mayor magnitud. Ante entrada inválida (`null` o vacío), retorna `Integer.MIN_VALUE`.

### 2. Recursión acotada y segura

- `potenciaRecursiva(int base, int exponente)`:
  - Define una constante privada `private static final int MAX_EXPONENTE = 20`.
  - Si `exponente < 0` o `exponente > MAX_EXPONENTE`, informa que el parámetro está fuera de los límites permitidos y retorna `-1`.
  - **Caso base**: si `exponente == 0`, retorna `1`.
  - **Caso recursivo**: retorna `base * potenciaRecursiva(base, exponente - 1)`.

### 3. Experimento de pasaje por valor

- `probarPasajePorValor(int numero, int[] arreglo)`:
  - Modifica el parámetro local `numero = 999`.
  - Modifica la posición referenciada `arreglo[0] = 999`.
- En `main`:
  - Declará `int valor = 10;` y `int[] datos = { 10, 20, 30 };`.
  - Imprimí sus valores antes de la llamada.
  - Invocá `probarPasajePorValor(valor, datos);`.
  - Imprimí sus valores después y explicá por qué `valor` sigue valiendo `10` y `datos[0]` cambió a `999`.
