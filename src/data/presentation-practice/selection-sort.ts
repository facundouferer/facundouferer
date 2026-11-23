import type { PracticeSet } from './types';

// Practice and assessment for the "selection sort" presentation
// (lesson `ordenacion-de-arreglos`).
const pasos = (arreglo: string, limite: number) => `#include <stdio.h>

int main(void) {
    int v[] = {${arreglo}};
    int n = 5;
    for (int i = 0; i < ${limite}; i++) {
        int minimo = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[minimo]) {
                minimo = j;
            }
        }
        int aux = v[i];
        v[i] = v[minimo];
        v[minimo] = aux;
    }
    for (int i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");
    return 0;
}`;

const PASO_1 = pasos('29, 10, 14, 37, 13', 1);
const PASO_2 = pasos('29, 10, 14, 37, 13', 2);
const PASO_3 = pasos('64, 25, 12, 22, 11', 3);

const CUENTA_COMPARACIONES = (arreglo: string, n: number) => `#include <stdio.h>

int main(void) {
    int v[] = {${arreglo}};
    int n = ${n};
    int comparaciones = 0;
    for (int i = 0; i < n - 1; i++) {
        int minimo = i;
        for (int j = i + 1; j < n; j++) {
            comparaciones++;
            if (v[j] < v[minimo]) {
                minimo = j;
            }
        }
        int aux = v[i];
        v[i] = v[minimo];
        v[minimo] = aux;
    }
    printf("%d\\n", comparaciones);
    return 0;
}`;

const ORDENADO = CUENTA_COMPARACIONES('1, 2, 3, 4', 4);
const INVERTIDO = CUENTA_COMPARACIONES('5, 4, 3, 2, 1', 5);

const POSICION_MINIMO = `#include <stdio.h>

int main(void) {
    int v[] = {4, 7, 2, 9};
    int n = 4;
    int minimo = 0;
    for (int j = 1; j < n; j++) {
        if (v[j] < v[minimo]) {
            minimo = j;
        }
    }
    printf("%d\\n", minimo);
    return 0;
}`;

const CUENTA_INTERCAMBIOS = `#include <stdio.h>

int main(void) {
    int v[] = {3, 1, 2, 5, 4};
    int n = 5;
    int intercambios = 0;
    for (int i = 0; i < n - 1; i++) {
        int minimo = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[minimo]) {
                minimo = j;
            }
        }
        int aux = v[i];
        v[i] = v[minimo];
        v[minimo] = aux;
        intercambios++;
    }
    printf("%d\\n", intercambios);
    return 0;
}`;

const INTERCAMBIA_MAL = `#include <stdio.h>

int main(void) {
    int v[] = {3, 1, 2};
    int n = 3;
    for (int i = 0; i < n - 1; i++) {
        int minimo = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[minimo]) {
                minimo = j;
            }
        }
        int aux = v[i];
        v[i] = v[n - 1];
        v[n - 1] = aux;
    }
    printf("%d %d %d\\n", v[0], v[1], v[2]);
    return 0;
}`;

const DOS_PASOS = `#include <stdio.h>

int main(void) {
    int v[] = {9, 3, 7, 1};
    int n = 4;
    for (int i = 0; i < 2; i++) {
        int minimo = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[minimo]) {
                minimo = j;
            }
        }
        int aux = v[i];
        v[i] = v[minimo];
        v[minimo] = aux;
    }
    printf("%d %d %d %d\\n", v[0], v[1], v[2], v[3]);
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: {
				es: 'Un solo paso de selección sobre `{29, 10, 14, 37, 13}`. ¿Qué imprime?',
				en: 'A single selection step over `{29, 10, 14, 37, 13}`. What does it print?',
			},
			code: PASO_1,
			options: [
				{ id: 'a', text: { es: '`10 29 14 37 13`', en: '`10 29 14 37 13`' } },
				{ id: 'b', text: { es: '`10 14 37 13 29`', en: '`10 14 37 13 29`' } },
				{ id: 'c', text: { es: '`13 10 14 37 29`', en: '`13 10 14 37 29`' } },
			],
			correct: 'a',
			explanation: {
				es: 'El mínimo de toda la parte desordenada es 10 (posición 1). Se intercambia con la posición 0: el 29 pasa a la posición 1. No se corre nada más; selección hace un solo intercambio por paso.',
				en: 'The minimum of the whole unsorted part is 10 (position 1). It is swapped with position 0: 29 goes to position 1. Nothing else moves; selection makes a single swap per step.',
			},
		},
		{
			id: 'p2',
			prompt: {
				es: 'Dos pasos sobre el mismo arreglo. ¿Cómo queda?',
				en: 'Two steps over the same array. What does it look like?',
			},
			code: PASO_2,
			options: [
				{ id: 'a', text: { es: '`10 13 14 37 29`', en: '`10 13 14 37 29`' } },
				{ id: 'b', text: { es: '`10 14 29 37 13`', en: '`10 14 29 37 13`' } },
				{ id: 'c', text: { es: '`10 13 29 14 37`', en: '`10 13 29 14 37`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Después del primer paso queda `{10, 29, 14, 37, 13}`. El mínimo de `{29, 14, 37, 13}` es 13 (posición 4) y se intercambia con la posición 1: el 29 viaja al final.',
				en: 'After the first step it is `{10, 29, 14, 37, 13}`. The minimum of `{29, 14, 37, 13}` is 13 (position 4) and it is swapped with position 1: 29 travels to the end.',
			},
		},
		{
			id: 'p3',
			prompt: {
				es: 'Tres pasos sobre `{64, 25, 12, 22, 11}`. ¿Qué imprime?',
				en: 'Three steps over `{64, 25, 12, 22, 11}`. What does it print?',
			},
			code: PASO_3,
			options: [
				{ id: 'a', text: { es: '`11 12 22 25 64`', en: '`11 12 22 25 64`' } },
				{ id: 'b', text: { es: '`11 12 25 22 64`', en: '`11 12 25 22 64`' } },
				{ id: 'c', text: { es: '`11 25 12 22 64`', en: '`11 25 12 22 64`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Paso 1: `{11, 25, 12, 22, 64}`. Paso 2: `{11, 12, 25, 22, 64}`. Paso 3: el mínimo de `{25, 22, 64}` es 22 y se intercambia con el 25: `{11, 12, 22, 25, 64}`. Resultó ordenado antes de terminar los pasos, pero la lógica no lo sabe y igual seguiría comparando.',
				en: 'Step 1: `{11, 25, 12, 22, 64}`. Step 2: `{11, 12, 25, 22, 64}`. Step 3: the minimum of `{25, 22, 64}` is 22 and it is swapped with 25: `{11, 12, 22, 25, 64}`. It ended up sorted before the steps ran out, but the logic does not know that and would keep comparing.',
			},
		},
		{
			id: 'p4',
			prompt: {
				es: 'En `{4, 7, 2, 9}`, ¿qué posición tiene `minimo` al terminar la búsqueda?',
				en: 'In `{4, 7, 2, 9}`, which position does `minimo` hold when the search ends?',
			},
			code: POSICION_MINIMO,
			options: [
				{ id: 'a', text: { es: '0', en: '0' } },
				{ id: 'b', text: { es: '2', en: '2' } },
				{ id: 'c', text: { es: '3', en: '3' } },
			],
			correct: 'b',
			explanation: {
				es: '`minimo` guarda una **posición**, no un valor. Empieza en 0 (valor 4); con `j = 2` se encuentra el 2, que es menor, y `minimo` pasa a 2. El 9 no lo supera. Se imprime la posición, 2.',
				en: '`minimo` stores a **position**, not a value. It starts at 0 (value 4); at `j = 2` it finds 2, which is smaller, and `minimo` becomes 2. 9 does not beat it. The position, 2, is printed.',
			},
		},
		{
			id: 'p5',
			prompt: {
				es: 'Arreglo ya ordenado `{1, 2, 3, 4}`. ¿Cuántas comparaciones hace selección?',
				en: 'Already sorted array `{1, 2, 3, 4}`. How many comparisons does selection make?',
			},
			code: ORDENADO,
			options: [
				{ id: 'a', text: { es: '3', en: '3' } },
				{ id: 'b', text: { es: '6', en: '6' } },
				{ id: 'c', text: { es: '0', en: '0' } },
			],
			correct: 'b',
			explanation: {
				es: 'Selección no puede saber que el mínimo ya está en su lugar sin mirar toda la parte desordenada: 3 + 2 + 1 = 6 comparaciones, igual que con cualquier otro arreglo de 4 elementos.',
				en: 'Selection cannot know the minimum is already in place without looking at the whole unsorted part: 3 + 2 + 1 = 6 comparisons, the same as with any other 4-element array.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: {
				es: 'Arreglo invertido `{5, 4, 3, 2, 1}`. ¿Cuántas comparaciones hace?',
				en: 'Reversed array `{5, 4, 3, 2, 1}`. How many comparisons does it make?',
			},
			code: INVERTIDO,
			options: [
				{ id: 'a', text: { es: '4', en: '4' } },
				{ id: 'b', text: { es: '10', en: '10' } },
				{ id: 'c', text: { es: '15', en: '15' } },
			],
			correct: 'b',
			explanation: {
				es: '4 + 3 + 2 + 1 = 10 = `n(n - 1) / 2`. Es la misma cantidad que en el mejor caso: selección siempre hace `n(n - 1) / 2` comparaciones, así que es `O(n²)` sin importar cómo vengan los datos.',
				en: '4 + 3 + 2 + 1 = 10 = `n(n - 1) / 2`. It is the same amount as in the best case: selection always makes `n(n - 1) / 2` comparisons, so it is `O(n²)` regardless of the data.',
			},
		},
		{
			id: 'a2',
			prompt: {
				es: 'Para `{3, 1, 2, 5, 4}`, ¿qué imprime este contador de intercambios?',
				en: 'For `{3, 1, 2, 5, 4}`, what does this swap counter print?',
			},
			code: CUENTA_INTERCAMBIOS,
			options: [
				{ id: 'a', text: { es: '4', en: '4' } },
				{ id: 'b', text: { es: '2', en: '2' } },
				{ id: 'c', text: { es: '10', en: '10' } },
			],
			correct: 'a',
			explanation: {
				es: 'Hay un intercambio por cada posición de `i`, aunque el mínimo ya estuviera en su lugar (en ese caso se intercambia consigo mismo). Son `n - 1 = 4` intercambios, la gran ventaja de selección cuando mover elementos es caro.',
				en: 'There is one swap for each value of `i`, even when the minimum was already in place (it then swaps with itself). That is `n - 1 = 4` swaps, the big advantage of selection when moving elements is expensive.',
			},
		},
		{
			id: 'a3',
			prompt: {
				es: 'Este programa lleva el mínimo a la posición equivocada. ¿Qué imprime con `{3, 1, 2}`?',
				en: 'This program moves the minimum to the wrong position. What does it print with `{3, 1, 2}`?',
			},
			code: INTERCAMBIA_MAL,
			options: [
				{ id: 'a', text: { es: '`1 2 3`', en: '`1 2 3`' } },
				{ id: 'b', text: { es: '`2 3 1`', en: '`2 3 1`' } },
				{ id: 'c', text: { es: '`3 1 2`', en: '`3 1 2`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Se calcula `minimo` pero no se usa: el intercambio es con `v[n - 1]`. Con `i = 0` queda `{2, 1, 3}` y con `i = 1` queda `{2, 3, 1}`. El intercambio correcto es `v[i]` con `v[minimo]`.',
				en: '`minimo` is computed but not used: the swap is with `v[n - 1]`. With `i = 0` it becomes `{2, 1, 3}` and with `i = 1` it becomes `{2, 3, 1}`. The right swap is `v[i]` with `v[minimo]`.',
			},
		},
		{
			id: 'a4',
			prompt: {
				es: 'Dos pasos sobre `{9, 3, 7, 1}`. ¿Qué imprime?',
				en: 'Two steps over `{9, 3, 7, 1}`. What does it print?',
			},
			code: DOS_PASOS,
			options: [
				{ id: 'a', text: { es: '`1 3 7 9`', en: '`1 3 7 9`' } },
				{ id: 'b', text: { es: '`1 3 9 7`', en: '`1 3 9 7`' } },
				{ id: 'c', text: { es: '`3 1 7 9`', en: '`3 1 7 9`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Paso 1: el mínimo es 1 y se intercambia con el 9: `{1, 3, 7, 9}`. Paso 2: el mínimo de `{3, 7, 9}` ya es el 3, en su posición, así que se intercambia consigo mismo y nada cambia.',
				en: 'Step 1: the minimum is 1 and it is swapped with 9: `{1, 3, 7, 9}`. Step 2: the minimum of `{3, 7, 9}` is already 3, in place, so it swaps with itself and nothing changes.',
			},
		},
		{
			id: 'a5',
			prompt: {
				es: '¿Selección es un ordenamiento estable?',
				en: 'Is selection sort a stable sort?',
			},
			options: [
				{ id: 'a', text: { es: 'No: el intercambio puede saltar sobre iguales', en: 'No: the swap can jump over equal elements' } },
				{ id: 'b', text: { es: 'Sí: nunca mueve elementos iguales', en: 'Yes: it never moves equal elements' } },
				{ id: 'c', text: { es: 'Sí, si usa `<` y no `<=`', en: 'Yes, if it uses `<` and not `<=`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Con `{2a, 2b, 1}` el mínimo es el 1 y se intercambia con `2a`: queda `{1, 2b, 2a}`. Los dos 2 invirtieron su orden original. El intercambio lejano rompe la estabilidad aunque la comparación sea estricta.',
				en: 'With `{2a, 2b, 1}` the minimum is 1 and it is swapped with `2a`: it becomes `{1, 2b, 2a}`. The two 2s reversed their original order. The long-distance swap breaks stability even if the comparison is strict.',
			},
		},
		{
			id: 'a6',
			prompt: {
				es: '¿Cuándo conviene elegir selección frente a burbuja o inserción?',
				en: 'When is selection a better choice than bubble or insertion sort?',
			},
			options: [
				{ id: 'a', text: { es: 'Cuando mover un elemento es muy caro', en: 'When moving an element is very expensive' } },
				{ id: 'b', text: { es: 'Cuando el arreglo está casi ordenado', en: 'When the array is almost sorted' } },
				{ id: 'c', text: { es: 'Cuando se necesita un orden estable', en: 'When a stable order is needed' } },
			],
			correct: 'a',
			explanation: {
				es: 'Selección hace exactamente `n - 1` intercambios, muy pocos frente a los otros dos. Con registros grandes eso importa. Con datos casi ordenados gana inserción (`O(n)`), y selección no es estable.',
				en: 'Selection makes exactly `n - 1` swaps, very few compared with the other two. With large records that matters. With almost sorted data insertion wins (`O(n)`), and selection is not stable.',
			},
		},
	],
};
