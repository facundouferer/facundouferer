import type { PracticeSet } from './types';

// Practice and assessment for the "bubble sort" presentation
// (lesson `ordenacion-de-arreglos`).
const UNA_PASADA = `#include <stdio.h>

int main(void) {
    int v[] = {5, 1, 4, 2, 8};
    int n = 5;
    for (int j = 0; j < n - 1; j++) {
        if (v[j] > v[j + 1]) {
            int aux = v[j];
            v[j] = v[j + 1];
            v[j + 1] = aux;
        }
    }
    for (int i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");
    return 0;
}`;

const CORTE_ORDENADO = `#include <stdio.h>
#include <stdbool.h>

int main(void) {
    int v[] = {1, 2, 3, 4, 5};
    int n = 5;
    int comparaciones = 0;
    for (int pasada = 0; pasada < n - 1; pasada++) {
        bool hubo_intercambio = false;
        for (int j = 0; j < n - 1 - pasada; j++) {
            comparaciones++;
            if (v[j] > v[j + 1]) {
                int aux = v[j];
                v[j] = v[j + 1];
                v[j + 1] = aux;
                hubo_intercambio = true;
            }
        }
        if (!hubo_intercambio) {
            break;
        }
    }
    printf("%d\\n", comparaciones);
    return 0;
}`;

const CUENTA_INTERCAMBIOS = `#include <stdio.h>

int main(void) {
    int v[] = {4, 3, 2, 1};
    int n = 4;
    int intercambios = 0;
    for (int pasada = 0; pasada < n - 1; pasada++) {
        for (int j = 0; j < n - 1 - pasada; j++) {
            if (v[j] > v[j + 1]) {
                int aux = v[j];
                v[j] = v[j + 1];
                v[j + 1] = aux;
                intercambios++;
            }
        }
    }
    printf("%d\\n", intercambios);
    return 0;
}`;

const DOS_PASADAS = `#include <stdio.h>

int main(void) {
    int v[] = {6, 5, 4, 3};
    int n = 4;
    for (int pasada = 0; pasada < 2; pasada++) {
        for (int j = 0; j < n - 1 - pasada; j++) {
            if (v[j] > v[j + 1]) {
                int aux = v[j];
                v[j] = v[j + 1];
                v[j + 1] = aux;
            }
        }
    }
    for (int i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");
    return 0;
}`;

const ULTIMO = `#include <stdio.h>

int main(void) {
    int v[] = {2, 9, 1, 3};
    int n = 4;
    for (int j = 0; j < n - 1; j++) {
        if (v[j] > v[j + 1]) {
            int aux = v[j];
            v[j] = v[j + 1];
            v[j + 1] = aux;
        }
    }
    printf("%d\\n", v[n - 1]);
    return 0;
}`;

const CUENTA_PASADAS = `#include <stdio.h>
#include <stdbool.h>

int main(void) {
    int v[] = {2, 1, 3, 4, 5};
    int n = 5;
    int pasadas = 0;
    for (int pasada = 0; pasada < n - 1; pasada++) {
        bool hubo_intercambio = false;
        pasadas++;
        for (int j = 0; j < n - 1 - pasada; j++) {
            if (v[j] > v[j + 1]) {
                int aux = v[j];
                v[j] = v[j + 1];
                v[j + 1] = aux;
                hubo_intercambio = true;
            }
        }
        if (!hubo_intercambio) {
            break;
        }
    }
    printf("%d\\n", pasadas);
    return 0;
}`;

const SWAP_ROTO = `#include <stdio.h>

int main(void) {
    int v[] = {3, 1, 2};
    int n = 3;
    for (int j = 0; j < n - 1; j++) {
        if (v[j] > v[j + 1]) {
            v[j] = v[j + 1];
            v[j + 1] = v[j];
        }
    }
    printf("%d %d %d\\n", v[0], v[1], v[2]);
    return 0;
}`;

const LIMITE_MAL = `/* c-check: skip */
#include <stdio.h>

int main(void) {
    int v[] = {3, 1, 2};
    int n = 3;
    for (int pasada = 0; pasada < n - 1; pasada++) {
        for (int j = 0; j < n - pasada; j++) {
            if (v[j] > v[j + 1]) {
                int aux = v[j];
                v[j] = v[j + 1];
                v[j + 1] = aux;
            }
        }
    }
    return 0;
}`;

const UNA_PASADA_7 = `#include <stdio.h>

int main(void) {
    int v[] = {7, 3, 5, 1};
    int n = 4;
    for (int j = 0; j < n - 1; j++) {
        if (v[j] > v[j + 1]) {
            int aux = v[j];
            v[j] = v[j + 1];
            v[j + 1] = aux;
        }
    }
    printf("%d %d %d %d\\n", v[0], v[1], v[2], v[3]);
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: {
				es: 'Una sola pasada de burbuja sobre `{5, 1, 4, 2, 8}`. ¿Qué imprime?',
				en: 'A single bubble pass over `{5, 1, 4, 2, 8}`. What does it print?',
			},
			code: UNA_PASADA,
			options: [
				{ id: 'a', text: { es: '`1 2 4 5 8`', en: '`1 2 4 5 8`' } },
				{ id: 'b', text: { es: '`1 4 2 5 8`', en: '`1 4 2 5 8`' } },
				{ id: 'c', text: { es: '`1 5 4 2 8`', en: '`1 5 4 2 8`' } },
			],
			correct: 'b',
			explanation: {
				es: 'El 5 se compara con el 1 y se intercambian; luego con el 4 y con el 2, y también sube. Con el 8 ya no se intercambia porque 5 < 8. Una pasada no alcanza para ordenar todo: solo asegura que el 8 quede al final y arrastra al 5 hasta antes de él.',
				en: '5 is compared with 1 and swapped, then with 4 and with 2, and keeps rising. Against 8 there is no swap because 5 < 8. One pass does not sort everything: it only guarantees the largest ends up last and carries the 5 up to just before it.',
			},
		},
		{
			id: 'p2',
			prompt: {
				es: 'El arreglo ya está ordenado y el método tiene corte temprano. ¿Cuántas comparaciones hace?',
				en: 'The array is already sorted and the method has an early exit. How many comparisons does it make?',
			},
			code: CORTE_ORDENADO,
			options: [
				{ id: 'a', text: { es: '4', en: '4' } },
				{ id: 'b', text: { es: '10', en: '10' } },
				{ id: 'c', text: { es: '0', en: '0' } },
			],
			correct: 'a',
			explanation: {
				es: 'La primera pasada hace `n - 1 = 4` comparaciones y no intercambia nada, así que `hubo_intercambio` sigue en `false` y el `break` corta. Sin el corte serían 4 + 3 + 2 + 1 = 10.',
				en: 'The first pass makes `n - 1 = 4` comparisons and swaps nothing, so `hubo_intercambio` stays `false` and the `break` stops. Without the exit it would be 4 + 3 + 2 + 1 = 10.',
			},
		},
		{
			id: 'p3',
			prompt: {
				es: 'Arreglo invertido `{4, 3, 2, 1}`. ¿Cuántos intercambios se cuentan?',
				en: 'Reversed array `{4, 3, 2, 1}`. How many swaps are counted?',
			},
			code: CUENTA_INTERCAMBIOS,
			options: [
				{ id: 'a', text: { es: '3', en: '3' } },
				{ id: 'b', text: { es: '6', en: '6' } },
				{ id: 'c', text: { es: '4', en: '4' } },
			],
			correct: 'b',
			explanation: {
				es: 'En el peor caso cada comparación intercambia: 3 + 2 + 1 = 6, que es `n(n - 1) / 2`. Por eso burbuja es `O(n²)` también en intercambios.',
				en: 'In the worst case every comparison swaps: 3 + 2 + 1 = 6, which is `n(n - 1) / 2`. That is why bubble sort is `O(n²)` in swaps too.',
			},
		},
		{
			id: 'p4',
			prompt: {
				es: 'Dos pasadas completas sobre `{6, 5, 4, 3}`. ¿Cómo queda el arreglo?',
				en: 'Two full passes over `{6, 5, 4, 3}`. What does the array look like?',
			},
			code: DOS_PASADAS,
			options: [
				{ id: 'a', text: { es: '`3 4 5 6`', en: '`3 4 5 6`' } },
				{ id: 'b', text: { es: '`5 4 3 6`', en: '`5 4 3 6`' } },
				{ id: 'c', text: { es: '`4 3 5 6`', en: '`4 3 5 6`' } },
			],
			correct: 'c',
			explanation: {
				es: 'La pasada 1 deja `{5, 4, 3, 6}` (el 6 sube al final). La pasada 2 solo mira las tres primeras posiciones y deja `{4, 3, 5, 6}`: después de `k` pasadas, los `k` mayores ya están en su lugar, pero lo demás todavía puede estar desordenado.',
				en: 'Pass 1 leaves `{5, 4, 3, 6}` (the 6 rises to the end). Pass 2 only looks at the first three positions and leaves `{4, 3, 5, 6}`: after `k` passes the `k` largest are in place, but the rest can still be unsorted.',
			},
		},
		{
			id: 'p5',
			prompt: {
				es: 'Después de una pasada sobre `{2, 9, 1, 3}`, ¿qué vale `v[n - 1]`?',
				en: 'After one pass over `{2, 9, 1, 3}`, what is `v[n - 1]`?',
			},
			code: ULTIMO,
			options: [
				{ id: 'a', text: { es: '3', en: '3' } },
				{ id: 'b', text: { es: '9', en: '9' } },
				{ id: 'c', text: { es: '2', en: '2' } },
			],
			correct: 'b',
			explanation: {
				es: 'El 9 es el mayor y en cada comparación gana contra su vecino de la derecha, así que "burbujea" hasta la última posición. Toda pasada termina con el máximo de la parte recorrida en su lugar definitivo.',
				en: '9 is the largest and wins every comparison against its right neighbor, so it "bubbles" to the last position. Every pass ends with the maximum of the traversed part in its final place.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: {
				es: 'Con corte temprano, ¿cuántas pasadas ejecuta este programa sobre `{2, 1, 3, 4, 5}`?',
				en: 'With the early exit, how many passes does this program run over `{2, 1, 3, 4, 5}`?',
			},
			code: CUENTA_PASADAS,
			options: [
				{ id: 'a', text: { es: '1', en: '1' } },
				{ id: 'b', text: { es: '2', en: '2' } },
				{ id: 'c', text: { es: '4', en: '4' } },
			],
			correct: 'b',
			explanation: {
				es: 'La pasada 1 intercambia el 2 con el 1 y deja el arreglo ordenado, pero el programa todavía no lo sabe. La pasada 2 no intercambia nada y es la que dispara el `break`. Hace falta una pasada extra para comprobar que ya está ordenado.',
				en: 'Pass 1 swaps 2 and 1 and leaves the array sorted, but the program does not know it yet. Pass 2 swaps nothing and triggers the `break`. An extra pass is needed to confirm it is already sorted.',
			},
		},
		{
			id: 'a2',
			prompt: {
				es: 'Este intercambio está mal escrito. ¿Qué imprime el programa?',
				en: 'This swap is written wrongly. What does the program print?',
			},
			code: SWAP_ROTO,
			options: [
				{ id: 'a', text: { es: '`1 2 3`', en: '`1 2 3`' } },
				{ id: 'b', text: { es: '`1 1 2`', en: '`1 1 2`' } },
				{ id: 'c', text: { es: '`1 3 2`', en: '`1 3 2`' } },
				{ id: 'd', text: { es: 'No compila', en: 'It does not compile' } },
			],
			correct: 'b',
			explanation: {
				es: 'Falta la variable auxiliar. `v[j] = v[j + 1]` destruye el valor original de `v[j]`, y la línea siguiente copia ese mismo valor de vuelta: queda duplicado. Con `{3, 1, 2}` el 3 se pierde y el resultado es `{1, 1, 2}`.',
				en: 'The auxiliary variable is missing. `v[j] = v[j + 1]` destroys the original value of `v[j]`, and the next line copies that same value back: it ends up duplicated. With `{3, 1, 2}` the 3 is lost and the result is `{1, 1, 2}`.',
			},
		},
		{
			id: 'a3',
			prompt: {
				es: 'La condición interna usa `j < n - pasada` en lugar de `j < n - 1 - pasada`. ¿Qué problema tiene?',
				en: 'The inner condition uses `j < n - pasada` instead of `j < n - 1 - pasada`. What is wrong with it?',
			},
			code: LIMITE_MAL,
			options: [
				{ id: 'a', text: { es: 'En la primera pasada lee `v[n]`, fuera del arreglo', en: 'In the first pass it reads `v[n]`, outside the array' } },
				{ id: 'b', text: { es: 'No ordena nunca', en: 'It never sorts' } },
				{ id: 'c', text: { es: 'No compila', en: 'It does not compile' } },
			],
			correct: 'a',
			explanation: {
				es: 'Compila sin errores, pero cuando `j` vale `n - 1` el programa compara con `v[j + 1] = v[n]`, una posición que no existe: comportamiento indefinido. El límite correcto es `n - 1 - pasada` porque cada pasada compara pares y los últimos `pasada` elementos ya están en su lugar.',
				en: 'It compiles without errors, but when `j` is `n - 1` the program compares with `v[j + 1] = v[n]`, a position that does not exist: undefined behavior. The right bound is `n - 1 - pasada` because each pass compares pairs and the last `pasada` elements are already in place.',
			},
		},
		{
			id: 'a4',
			prompt: {
				es: 'Una pasada sobre `{7, 3, 5, 1}`. ¿Qué imprime?',
				en: 'One pass over `{7, 3, 5, 1}`. What does it print?',
			},
			code: UNA_PASADA_7,
			options: [
				{ id: 'a', text: { es: '`1 3 5 7`', en: '`1 3 5 7`' } },
				{ id: 'b', text: { es: '`3 5 1 7`', en: '`3 5 1 7`' } },
				{ id: 'c', text: { es: '`3 7 5 1`', en: '`3 7 5 1`' } },
			],
			correct: 'b',
			explanation: {
				es: 'El 7 se intercambia con el 3, con el 5 y con el 1, y termina en la última posición. Los demás avanzan una posición a la izquierda sin reordenarse entre sí: queda `{3, 5, 1, 7}`.',
				en: '7 is swapped with 3, with 5 and with 1, and ends up in the last position. The others shift one position left without being reordered among themselves: `{3, 5, 1, 7}`.',
			},
		},
		{
			id: 'a5',
			prompt: {
				es: '¿Cuál es el mejor caso de burbuja con corte temprano y por qué?',
				en: 'What is the best case of bubble sort with early exit, and why?',
			},
			options: [
				{ id: 'a', text: { es: '`O(n)`: una pasada sin intercambios', en: '`O(n)`: one pass without swaps' } },
				{ id: 'b', text: { es: '`O(1)`: no compara nada', en: '`O(1)`: it compares nothing' } },
				{ id: 'c', text: { es: '`O(n²)`: siempre hace todas las pasadas', en: '`O(n²)`: it always makes every pass' } },
			],
			correct: 'a',
			explanation: {
				es: 'Si el arreglo ya está ordenado, la primera pasada hace `n - 1` comparaciones, no intercambia y corta: `O(n)`. Sin la variable `hubo_intercambio`, el mejor caso también sería `O(n²)`.',
				en: 'If the array is already sorted, the first pass makes `n - 1` comparisons, swaps nothing and stops: `O(n)`. Without the `hubo_intercambio` variable the best case would also be `O(n²)`.',
			},
		},
		{
			id: 'a6',
			prompt: {
				es: '¿Burbuja es un ordenamiento estable?',
				en: 'Is bubble sort a stable sort?',
			},
			options: [
				{ id: 'a', text: { es: 'Sí: solo intercambia si `>` estricto', en: 'Yes: it only swaps on strict `>`' } },
				{ id: 'b', text: { es: 'No: mezcla los elementos iguales', en: 'No: it shuffles equal elements' } },
				{ id: 'c', text: { es: 'Depende del tamaño del arreglo', en: 'It depends on the array size' } },
			],
			correct: 'a',
			explanation: {
				es: 'Dos elementos iguales nunca se intercambian porque la condición es `v[j] > v[j + 1]`, con `>` estricto. Como solo se mueven vecinos, su orden relativo original se conserva: es estable.',
				en: 'Two equal elements are never swapped because the condition is `v[j] > v[j + 1]`, strict `>`. Since only neighbors move, their original relative order is kept: it is stable.',
			},
		},
	],
};
