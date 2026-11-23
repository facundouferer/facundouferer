---
course: 'c'
lesson: 'estructuras-dinamicas-pilas'
slug: 'calculadora-polaca-inversa'
title: 'Calculadora en notación polaca inversa'
description: 'Programa que evalúa expresiones enteras en notación polaca inversa con una pila enlazada, informa cada error sin romperse y libera los nodos que quedan en la pila en todos los caminos de salida.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 75
objectives:
  - 'Usar una pila enlazada para evaluar expresiones en notación polaca inversa.'
  - 'Distinguir los errores de una expresión (faltan operandos, sobran operandos, división por cero, símbolo inválido) sin desreferenciar NULL.'
  - 'Destruir la pila antes de cada return anticipado, para que ningún error deje nodos sin liberar.'
requirements:
  - 'La pila enlazada de la lección (Nodo, Pila, pila_apilar, pila_desapilar, pila_destruir) guarda enteros; cada nodo se reserva con malloc(sizeof *nodo) y se comprueba contra NULL.'
  - 'El programa lee la entrada línea por línea con fgets, ignora las líneas vacías y evalúa cada una: los números (enteros no negativos de una o más cifras) se apilan; cada operador +, -, * o / desapila dos valores (primero el derecho, después el izquierdo) y apila el resultado.'
  - 'Una expresión correcta se muestra como <expresión> = <resultado>. Los errores se muestran como <expresión> -> Error: <mensaje>, con los mensajes faltan operandos (un operador sin dos valores o una línea sin valores), sobran operandos (al final queda más de un valor), división por cero y símbolo inválido ''<c>''.'
  - 'La división es la división entera de C: 7 2 / da 3.'
  - 'Cada función que termina antes de tiempo destruye la pila antes de return; al final de cada línea la pila queda vacía.'
  - 'Al terminar la entrada se muestra Expresiones: <n>, correctas: <m>.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa y la versión con -fsanitize=address no produce ningún informe.'
exampleOutput: |
  $ ./programa < expresiones.txt
  3 4 + = 7
  5 1 2 + 4 * + 3 - = 14
  10 2 8 * + 3 - = 23
  7 2 / = 3
  4 0 / -> Error: división por cero
  1 + -> Error: faltan operandos
  1 2 3 + -> Error: sobran operandos
  7 2 % -> Error: símbolo inválido '%'
  Expresiones: 8, correctas: 4
extensionChallenges:
  - 'Agrega el operador ^ (potencia entera con exponente no negativo) e informa Error: exponente negativo cuando corresponda.'
  - 'Cambia la pila enlazada por la pila sobre un arreglo dinámico de la lección sin modificar evaluar: solo cambian las funciones de la pila.'
  - 'Agrega contadores de reservas y liberaciones en pila_apilar y pila_desapilar, y muestra al final que son iguales.'
deliveryTips:
  - 'Escribe una función evaluar(const char *expresion, int *resultado, char *simbolo) que devuelva un valor de un enum con un caso por resultado posible; main solo elige el mensaje.'
  - 'El orden importa en - y /: en 9 3 - el primer valor que desapilas es 3, el operando derecho.'
  - 'Para reconocer una cifra no hace falta ninguna biblioteca: c >= ''0'' && c <= ''9''. El valor de la cifra es c - ''0''.'
  - 'En macOS, AddressSanitizer no detecta fugas. Allí puedes contarlas: suma uno en cada malloc correcto y uno en cada free, y compara los dos números al final.'
---

## Contexto

En la notación polaca inversa (RPN, *Reverse Polish Notation*) los operadores van **después** de sus operandos: `3 4 +` significa 3 + 4, y `5 1 2 + 4 * + 3 -` significa 5 + (1 + 2) × 4 − 3. No hacen falta paréntesis ni reglas de precedencia, y por eso la usaron calculadoras científicas y la usan hoy muchos intérpretes por dentro.

Evaluarla es el ejemplo perfecto de pila: cada número se apila; cada operador desapila sus dos operandos, calcula y apila el resultado. Si la expresión es correcta, al final queda exactamente un valor. Si no lo es, la evaluación termina antes de tiempo **con nodos todavía en la pila**, el mismo problema que el de los paréntesis balanceados de la lección.

## Consigna

1. Crea el archivo de entrada `expresiones.txt` con estas ocho líneas (y, si quieres, alguna línea vacía, que el programa debe ignorar):

   ```text
   3 4 +
   5 1 2 + 4 * + 3 -
   10 2 8 * + 3 -
   7 2 /
   4 0 /
   1 +
   1 2 3 +
   7 2 %
   ```

2. Escribe `programa.c` con la pila enlazada de la lección y este punto de partida:

   ```c
   typedef enum { CORRECTA, FALTAN, SOBRAN, DIVISION_POR_CERO, SIMBOLO_INVALIDO, SIN_MEMORIA } Resultado;

   // Evalúa expresion. Si es correcta guarda el valor en *resultado; si tiene un
   // símbolo inválido, lo guarda en *simbolo. La pila es local: se destruye
   // antes de cada return, así que esta función no deja memoria reservada.
   Resultado evaluar(const char *expresion, int *resultado, char *simbolo);
   ```

   `main` lee cada línea con `fgets`, quita el `'\n'` con `strcspn`, llama a `evaluar` y muestra el mensaje que corresponde.

3. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

4. Compila con AddressSanitizer y ejecuta. No debe aparecer **ningún informe**, y la salida debe coincidir con la de ejemplo:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address programa.c -o programa
   ./programa < expresiones.txt
   ```

   Con una entrada vacía (`printf "" | ./programa`) debe mostrar `Expresiones: 0, correctas: 0`.

## Criterios de evaluación

- [ ] La salida para `expresiones.txt` coincide exactamente con la de ejemplo, y la entrada vacía muestra `Expresiones: 0, correctas: 0`.
- [ ] Cada uno de los cuatro errores se detecta con su mensaje, sin desreferenciar `NULL` ni dividir por cero.
- [ ] Ningún camino de `evaluar` termina sin destruir la pila: AddressSanitizer no informa nada y las reservas coinciden con las liberaciones.
- [ ] Cada `malloc` se comprueba; las operaciones de la pila informan su resultado con `bool` y el dato viaja por un puntero de salida.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
