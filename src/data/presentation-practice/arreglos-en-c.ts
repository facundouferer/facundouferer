import type { PracticeSet } from './types';

// Practice and assessment for the "arreglos en C" presentation
// (lesson `arreglos-unidimensionales-y-multidimensionales`).
const INDICE = `#include <stdio.h>

int main(void) {
    int v[4] = {10, 20, 30, 40};
    printf("%d\\n", v[1]);
    return 0;
}`;

const PARCIAL = `#include <stdio.h>

int main(void) {
    int v[5] = {1, 2};
    printf("%d\\n", v[4]);
    return 0;
}`;

const TAMANIO = `#include <stdio.h>

int main(void) {
    int v[6] = {0};
    printf("%zu\\n", sizeof v / sizeof v[0]);
    return 0;
}`;

const ASIGNAR = `#include <stdio.h>

int main(void) {
    int v[3] = {3, 4, 0};
    v[2] = v[0] + v[1];
    printf("%d\\n", v[2]);
    return 0;
}`;

const MATRIZ = `#include <stdio.h>

int main(void) {
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    printf("%d\\n", m[1][0]);
    return 0;
}`;

const EXTREMOS = `#include <stdio.h>

int main(void) {
    int v[4] = {5, 6, 7, 8};
    printf("%d\\n", v[0] + v[3]);
    return 0;
}`;

const FUERA = `int v[3];
v[3] = 1;`;

const SIN_TAMANIO = `#include <stdio.h>

int main(void) {
    int v[] = {4, 8, 15};
    printf("%zu\\n", sizeof v / sizeof v[0]);
    return 0;
}`;

const SUMA_MATRIZ = `#include <stdio.h>

int main(void) {
    int m[2][2] = {{1, 2}, {3, 4}};
    printf("%d\\n", m[0][1] + m[1][1]);
    return 0;
}`;

const DUPLICAR = `#include <stdio.h>

void duplicar(int v[], int n) {
    for (int i = 0; i < n; i++) {
        v[i] = v[i] * 2;
    }
}

int main(void) {
    int v[3] = {1, 2, 3};
    duplicar(v, 3);
    printf("%d\\n", v[2]);
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: INDICE,
			options: [
				{ id: 'a', text: { es: '`10`', en: '`10`' } },
				{ id: 'b', text: { es: '`20`', en: '`20`' } },
				{ id: 'c', text: { es: '`30`', en: '`30`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Los índices empiezan en 0: `v[0]` es 10 y `v[1]` es 20.',
				en: 'Indexes start at 0: `v[0]` is 10 and `v[1]` is 20.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Qué imprime `v[4]`?', en: 'What does `v[4]` print?' },
			code: PARCIAL,
			options: [
				{ id: 'a', text: { es: '`0`', en: '`0`' } },
				{ id: 'b', text: { es: 'Un valor basura', en: 'A garbage value' } },
				{ id: 'c', text: { es: '`2`', en: '`2`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Si la lista inicial tiene menos valores que el arreglo, los elementos restantes se rellenan con 0.',
				en: 'If the initializer list has fewer values than the array, the remaining elements are filled with 0.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Cuántos elementos calcula `sizeof v / sizeof v[0]`?', en: 'How many elements does `sizeof v / sizeof v[0]` compute?' },
			code: TAMANIO,
			options: [
				{ id: 'a', text: { es: '`6`', en: '`6`' } },
				{ id: 'b', text: { es: '`24`', en: '`24`' } },
				{ id: 'c', text: { es: '`4`', en: '`4`' } },
			],
			correct: 'a',
			explanation: {
				es: '`sizeof v` son los bytes totales (6 * 4 = 24) y `sizeof v[0]` los de un elemento (4): 24 / 4 = 6.',
				en: '`sizeof v` is the total bytes (6 * 4 = 24) and `sizeof v[0]` those of one element (4): 24 / 4 = 6.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Qué valor queda en `v[2]`?', en: 'What value ends up in `v[2]`?' },
			code: ASIGNAR,
			options: [
				{ id: 'a', text: { es: '`0`', en: '`0`' } },
				{ id: 'b', text: { es: '`4`', en: '`4`' } },
				{ id: 'c', text: { es: '`7`', en: '`7`' } },
			],
			correct: 'c',
			explanation: {
				es: 'Se lee `v[0]` (3) y `v[1]` (4), se suman y el 7 se guarda en `v[2]`, que valía 0.',
				en: '`v[0]` (3) and `v[1]` (4) are read and added, and the 7 is stored in `v[2]`, which was 0.',
			},
		},
		{
			id: 'p5',
			prompt: { es: '¿Qué imprime `m[1][0]`?', en: 'What does `m[1][0]` print?' },
			code: MATRIZ,
			options: [
				{ id: 'a', text: { es: '`2`', en: '`2`' } },
				{ id: 'b', text: { es: '`4`', en: '`4`' } },
				{ id: 'c', text: { es: '`3`', en: '`3`' } },
			],
			correct: 'b',
			explanation: {
				es: 'El primer índice elige la fila y el segundo la columna: la fila 1 es `{4, 5, 6}` y su columna 0 es 4.',
				en: 'The first index picks the row and the second the column: row 1 is `{4, 5, 6}` and its column 0 is 4.',
			},
		},
		{
			id: 'p6',
			prompt: {
				es: 'Un arreglo `int v[8]` tiene 8 elementos. ¿Cuál es el último índice válido?',
				en: 'An array `int v[8]` has 8 elements. What is the last valid index?',
			},
			options: [
				{ id: 'a', text: { es: '`8`', en: '`8`' } },
				{ id: 'b', text: { es: '`7`', en: '`7`' } },
				{ id: 'c', text: { es: '`9`', en: '`9`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Los índices válidos van de 0 a n - 1, o sea de 0 a 7. El índice 8 ya está fuera del arreglo.',
				en: 'Valid indexes go from 0 to n - 1, that is 0 to 7. Index 8 is already outside the array.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: EXTREMOS,
			options: [
				{ id: 'a', text: { es: '`13`', en: '`13`' } },
				{ id: 'b', text: { es: '`14`', en: '`14`' } },
				{ id: 'c', text: { es: '`11`', en: '`11`' } },
			],
			correct: 'a',
			explanation: {
				es: '`v[0]` es 5 y `v[3]`, el último de 4 elementos, es 8: 5 + 8 = 13.',
				en: '`v[0]` is 5 and `v[3]`, the last of 4 elements, is 8: 5 + 8 = 13.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Qué problema tiene este fragmento?', en: 'What is wrong with this fragment?' },
			code: FUERA,
			options: [
				{ id: 'a', text: { es: 'Escribe fuera del arreglo: el último índice válido es 2', en: 'It writes outside the array: the last valid index is 2' } },
				{ id: 'b', text: { es: 'Falta inicializar el arreglo con llaves', en: 'The array must be initialized with braces' } },
				{ id: 'c', text: { es: 'Nada: `v[3]` es el tercer elemento', en: 'Nothing: `v[3]` is the third element' } },
			],
			correct: 'a',
			explanation: {
				es: 'Con 3 elementos los índices válidos son 0, 1 y 2. `v[3]` escribe más allá del arreglo: comportamiento indefinido que C no detecta.',
				en: 'With 3 elements the valid indexes are 0, 1 and 2. `v[3]` writes past the array: undefined behavior that C does not detect.',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: SIN_TAMANIO,
			options: [
				{ id: 'a', text: { es: '`12`', en: '`12`' } },
				{ id: 'b', text: { es: '`3`', en: '`3`' } },
				{ id: 'c', text: { es: 'No compila: falta el tamaño', en: 'It does not compile: the size is missing' } },
			],
			correct: 'b',
			explanation: {
				es: 'Con inicializador, el compilador deduce el tamaño del arreglo: 3 elementos. `sizeof v / sizeof v[0]` da 12 / 4 = 3.',
				en: 'With an initializer the compiler deduces the array size: 3 elements. `sizeof v / sizeof v[0]` gives 12 / 4 = 3.',
			},
		},
		{
			id: 'a4',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: SUMA_MATRIZ,
			options: [
				{ id: 'a', text: { es: '`4`', en: '`4`' } },
				{ id: 'b', text: { es: '`5`', en: '`5`' } },
				{ id: 'c', text: { es: '`6`', en: '`6`' } },
			],
			correct: 'c',
			explanation: {
				es: '`m[0][1]` es 2 (fila 0, columna 1) y `m[1][1]` es 4 (fila 1, columna 1): 2 + 4 = 6.',
				en: '`m[0][1]` is 2 (row 0, column 1) and `m[1][1]` is 4 (row 1, column 1): 2 + 4 = 6.',
			},
		},
		{
			id: 'a5',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: DUPLICAR,
			options: [
				{ id: 'a', text: { es: '`3`, porque la función trabaja con una copia', en: '`3`, because the function works on a copy' } },
				{ id: 'b', text: { es: '`6`, porque la función modifica el arreglo original', en: '`6`, because the function modifies the original array' } },
				{ id: 'c', text: { es: 'No compila: un arreglo no se puede pasar a una función', en: 'It does not compile: an array cannot be passed to a function' } },
			],
			correct: 'b',
			explanation: {
				es: 'Al pasar un arreglo, la función recibe acceso a sus elementos, no una copia. Por eso `duplicar` cambia el `v` de `main` y `v[2]` pasa de 3 a 6.',
				en: 'When an array is passed, the function gets access to its elements, not a copy. So `duplicar` changes the `v` in `main` and `v[2]` goes from 3 to 6.',
			},
		},
		{
			id: 'a6',
			prompt: {
				es: '¿Qué hace C si lees `v[10]` en un arreglo de 5 elementos?',
				en: 'What does C do if you read `v[10]` in a 5-element array?',
			},
			options: [
				{ id: 'a', text: { es: 'Detiene el programa con un error de índice', en: 'It stops the program with an index error' } },
				{ id: 'b', text: { es: 'Devuelve 0', en: 'It returns 0' } },
				{ id: 'c', text: { es: 'No lo comprueba: es comportamiento indefinido', en: 'It does not check: it is undefined behavior' } },
			],
			correct: 'c',
			explanation: {
				es: 'C no valida los índices en tiempo de ejecución. Leer fuera del arreglo es comportamiento indefinido: tú debes validar el índice.',
				en: 'C does not validate indexes at run time. Reading outside the array is undefined behavior: you must validate the index.',
			},
		},
	],
};
