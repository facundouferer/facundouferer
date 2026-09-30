---
course: 'java'
lesson: '05-metodos-y-funciones'
slug: 'autoevaluacion-metodos-y-funciones'
title: 'Autoevaluación: Métodos, Pila de Llamadas y Modularización'
description: 'Poné a prueba tu comprensión sobre pasaje por valor, pila de llamadas, sobrecarga de métodos y recursión en Java.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'En Java, ¿cuál es el mecanismo exacto mediante el cual se pasan los argumentos a un método?'
    options:
      - id: 'a'
        text: 'Pasaje por referencia para objetos y por valor para primitivos.'
      - id: 'b'
        text: 'Siempre y estrictamente pasaje por valor (pass-by-value) en todos los casos.'
      - id: 'c'
        text: 'Pasaje por valor si la variable es local y por referencia si es un atributo de clase.'
      - id: 'd'
        text: 'Depende de si el método se declara con la palabra clave static o no.'
    correctOptionId: 'b'
    explanation: >-
      En Java no existe el pasaje por referencia puro. Para los tipos primitivos se pasa una copia del valor numérico/lógico, y para los objetos o arrays se pasa una copia del valor de la referencia (la dirección de memoria).
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Si un método reasigna una variable de parámetro que apunta a un array con `arreglo = new int[5];`, el array del método llamador también apuntará al nuevo objeto creado.'
    code: |
      public static void reasignar(int[] arreglo) {
          arreglo = new int[5];
      }
    correctAnswer: false
    explanation: >-
      Falso. Como el pasaje es por valor, el método solo recibe una copia de la referencia. Al reasignar la variable local dentro del método, únicamente cambia el puntero en su propio Stack Frame, dejando intacta la referencia original del llamador.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué combinación de elementos define de forma única la firma (signature) de un método para la sobrecarga?'
    options:
      - id: 'a'
        text: 'El nombre del método, el tipo de retorno y los modificadores de acceso.'
      - id: 'b'
        text: 'El nombre del método y la lista ordenada de tipos de sus parámetros.'
      - id: 'c'
        text: 'El nombre del método y el nombre de las variables de los parámetros.'
      - id: 'd'
        text: 'El tipo de retorno y la visibilidad public o private.'
    correctOptionId: 'b'
    explanation: >-
      La firma de un método en Java está compuesta exclusivamente por su nombre y la cantidad, tipos y orden de sus parámetros. El tipo de retorno y los modificadores no forman parte de la firma y no bastan para sobrecargar.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'Dos métodos en la misma clase con el mismo nombre y exactamente los mismos parámetros, pero con diferente tipo de retorno (uno `int` y el otro `double`), compilan correctamente gracias a la sobrecarga.'
    code: |
      public static int calcular(int x) { return x * 2; }
      public static double calcular(int x) { return x * 2.0; }
    correctAnswer: false
    explanation: >-
      Falso. El compilador rechaza esta declaración porque el tipo de retorno no diferencia una sobrecarga. Si se invoca `calcular(5);` sin asignar el resultado, el compilador no tendría forma de saber cuál método invocar.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué sucede en la memoria de la JVM cada vez que un método es invocado?'
    options:
      - id: 'a'
        text: 'Se crea un nuevo objeto en el Heap con el código del método.'
      - id: 'b'
        text: 'Se reserva un Stack Frame en la Pila (Call Stack) que almacena sus variables locales y parámetros.'
      - id: 'c'
        text: 'Se destruyen las variables locales del método que realizó la llamada.'
      - id: 'd'
        text: 'Se suspende la recolección de basura hasta que el método retorne.'
    correctOptionId: 'b'
    explanation: >-
      Cada invocación de método crea un Stack Frame en el Call Stack. Al terminar la ejecución y llegar a un `return`, ese marco se desapila y se destruyen sus variables locales, liberando la memoria de la pila.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Un método estático (`static`) puede invocarse directamente a través del nombre de la clase sin necesidad de crear una instancia previa con el operador `new`.'
    correctAnswer: true
    explanation: >-
      Verdadero. Los métodos estáticos pertenecen a la clase y no a una instancia particular, por lo que pueden llamarse como `NombreClase.metodo()` directamente.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Cuál es la función principal del "caso base" en un método recursivo?'
    options:
      - id: 'a'
        text: 'Definir el valor con el que debe inicializarse la llamada en main.'
      - id: 'b'
        text: 'Detener la cadena de llamadas recursivas para evitar un desbordamiento de pila (StackOverflowError).'
      - id: 'c'
        text: 'Duplicar la memoria asignada al Call Stack.'
      - id: 'd'
        text: 'Convertir la ejecución recursiva en un bucle while optimizado.'
    correctOptionId: 'b'
    explanation: >-
      El caso base es la condición de parada fundamental. Sin él, el método continuaría llamándose indefinidamente hasta agotar la memoria asignada a la pila de ejecución, lanzando un `StackOverflowError`.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Cuál será la salida de este programa al ejecutarse?'
    code: |
      public class Test {
          public static void alterar(int[] datos, int num) {
              datos[0] = 50;
              num = 100;
          }
          public static void main(String[] args) {
              int[] lista = { 10 };
              int valor = 20;
              alterar(lista, valor);
              System.out.println(lista[0] + " " + valor);
          }
      }
    options:
      - id: 'a'
        text: '10 20'
      - id: 'b'
        text: '50 20'
      - id: 'c'
        text: '50 100'
      - id: 'd'
        text: '10 100'
    correctOptionId: 'b'
    explanation: >-
      El valor del primitivo `valor` (20) se copió a `num`, por lo que su modificación no afecta a `valor`. Sin embargo, `lista` y `datos` apuntan al mismo array en el Heap, de modo que `datos[0] = 50` altera la posición visible para `lista[0]`. La salida es `50 20`.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Java optimiza automáticamente todas las funciones con recursión de cola (tail recursion) convirtiéndolas en bucles en tiempo de compilación.'
    correctAnswer: false
    explanation: >-
      Falso. La especificación de Java no garantiza la optimización de llamadas de cola (Tail Call Optimization). Cada llamada recursiva sigue consumiendo un Stack Frame, por lo que recursiones profundas pueden causar `StackOverflowError` independientemente de su estructura.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Desde la perspectiva de código limpio y buenas prácticas, ¿cuál es el objetivo del principio de Responsabilidad Única aplicado a métodos?'
    options:
      - id: 'a'
        text: 'Garantizar que todo método reciba al menos tres parámetros.'
      - id: 'b'
        text: 'Hacer que cada método realice una única tarea bien definida, facilitando su comprensión, prueba y reutilización.'
      - id: 'c'
        text: 'Evitar el uso de bucles for dentro de métodos estáticos.'
      - id: 'd'
        text: 'Obligar a que todos los métodos retornen un valor booleano.'
    correctOptionId: 'b'
    explanation: >-
      Un método con una única responsabilidad es más fácil de nombrar con claridad, testear aisladamente y mantener a lo largo del tiempo, reduciendo efectos secundarios no deseados.
---
