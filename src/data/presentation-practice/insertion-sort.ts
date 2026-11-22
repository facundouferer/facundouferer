import type { PracticeSet } from './types';

// Practice and assessment for the "insertion sort" presentation
// (lesson `ordenacion-de-arreglos`).
const insertar = (arreglo: string, n: number, limite: number) => `#include <stdio.h>

int main(void) {
    int v[] = {${arreglo}};
    int n = ${n};
    for (int i = 1; i < ${limite}; i++) {
        int actual = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > actual) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = actual;
    }
    for (int i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\\n");
    return 0;
}`;

const TRES_ELEMENTOS = insertar('5, 2, 4, 6, 1', 5, 3);
const UN_ELEMENTO = insertar('8, 3, 5, 1', 4, 2);
const SIN_ULTIMO = insertar('9, 4, 7, 2', 4, 3);

const cuenta = (arreglo: string, n: number) => `#include <stdio.h>

int main(void) {
    int v[] = {${arreglo}};
    int n = ${n};
    int desplazamientos = 0;
    for (int i = 1; i < n; i++) {
        int actual = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > actual) {
            v[j + 1] = v[j];
            desplazamientos++;
            j--;
        }
        v[j + 1] = actual;
    }
    printf("%d\\n", desplazamientos);
    return 0;
}`;

const ORDENADO = cuenta('1, 2, 3, 4, 5', 5);
const INVERTIDO = cuenta('5, 4, 3, 2', 4);

const POSICION_HUECO = `#include <stdio.h>

int main(void) {
    int v[] = {2, 5, 7, 4};
    int i = 3;
    int actual = v[i];
    int j = i - 1;
    while (j >= 0 && v[j] > actual) {
        v[j + 1] = v[j];
        j--;
    }
    printf("%d\\n", j + 1);
    return 0;
}`;

const ORDEN_CONDICION = `/* c-check: skip */
#include <stdio.h>

int main(void) {
    int v[] = {3, 1, 2};
    int n = 3;
    for (int i = 1; i < n; i++) {
        int actual = v[i];
        int j = i - 1;
        while (v[j] > actual && j >= 0) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = actual;
    }
    return 0;
}`;

const SIN_INSERTAR = `#include <stdio.h>

int main(void) {
    int v[] = {3, 1, 2};
    int n = 3;
    for (int i = 1; i < n; i++) {
        int actual = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > actual) {
            v[j + 1] = v[j];
            j--;
        }
    }
    printf("%d %d %d\\n", v[0], v[1], v[2]);
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: {
				es: 'Se insertan los elementos de las posiciones 1 y 2 de `{5, 2, 4, 6, 1}`. ¿Qué imprime?',
				en: 'The elements at positions 1 and 2 of `{5, 2, 4, 6, 1}` are inserted. What does it print?',
			},
			code: TRES_ELEMENTOS,
			options: [
				{ id: 'a', text: { es: '`2 4 5 6 1`', en: '`2 4 5 6 1`' } },
				{ id: 'b', text: { es: '`2 5 4 6 1`', en: '`2 5 4 6 1`' } },
				{ id: 'c', text: { es: '`1 2 4 5 6`', en: '`1 2 4 5 6`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Con `i = 1` el 2 desplaza al 5 y queda `{2, 5, 4, 6, 1}`. Con `i = 2` el 4 desplaza al 5 y queda `{2, 4, 5, 6, 1}`. El bucle se detiene antes de tocar el 1: la parte izquierda ya está ordenada, la derecha todavía no.',
				en: 'With `i = 1`, 2 shifts 5 and it becomes `{2, 5, 4, 6, 1}`. With `i = 2`, 4 shifts 5 and it becomes `{2, 4, 5, 6, 1}`. The loop stops before touching 1: the left part is sorted, the right part is not yet.',
			},
		},
		{
			id: 'p2',
			prompt: {
				es: 'Se inserta solo el elemento de la posición 1 de `{8, 3, 5, 1}`. ¿Qué imprime?',
				en: 'Only the element at position 1 of `{8, 3, 5, 1}` is inserted. What does it print?',
			},
			code: UN_ELEMENTO,
			options: [
				{ id: 'a', text: { es: '`3 8 5 1`', en: '`3 8 5 1`' } },
				{ id: 'b', text: { es: '`3 5 8 1`', en: '`3 5 8 1`' } },
				{ id: 'c', text: { es: '`1 3 5 8`', en: '`1 3 5 8`' } },
			],
			correct: 'a',
			explanation: {
				es: '`actual` es 3. El 8 es mayor, así que se desplaza a la derecha, `j` llega a -1 y el 3 se coloca en `v[0]`. Los elementos de la derecha todavía no se tocaron.',
				en: '`actual` is 3. 8 is greater, so it shifts right, `j` reaches -1 and 3 is placed at `v[0]`. The elements on the right have not been touched yet.',
			},
		},
		{
			id: 'p3',
			prompt: {
				es: 'El arreglo ya está ordenado. ¿Cuántos desplazamientos hace?',
				en: 'The array is already sorted. How many shifts does it make?',
			},
			code: ORDENADO,
			options: [
				{ id: 'a', text: { es: '0', en: '0' } },
				{ id: 'b', text: { es: '4', en: '4' } },
				{ id: 'c', text: { es: '10', en: '10' } },
			],
			correct: 'a',
			explanation: {
				es: 'Cada `actual` se compara con su vecino de la izquierda, que no es mayor, y el `while` termina sin entrar. Nada se desplaza: solo hay `n - 1` comparaciones, el mejor caso `O(n)`.',
				en: 'Each `actual` is compared with its left neighbor, which is not greater, and the `while` ends without entering. Nothing shifts: there are only `n - 1` comparisons, the `O(n)` best case.',
			},
		},
		{
			id: 'p4',
			prompt: {
				es: 'Arreglo invertido `{5, 4, 3, 2}`. ¿Cuántos desplazamientos hace?',
				en: 'Reversed array `{5, 4, 3, 2}`. How many shifts does it make?',
			},
			code: INVERTIDO,
			options: [
				{ id: 'a', text: { es: '3', en: '3' } },
				{ id: 'b', text: { es: '4', en: '4' } },
				{ id: 'c', text: { es: '6', en: '6' } },
			],
			correct: 'c',
			explanation: {
				es: 'Cada elemento nuevo es menor que todos los de la izquierda y los desplaza a todos: 1 + 2 + 3 = 6, es decir `n(n - 1) / 2`. Es el peor caso, `O(n²)`.',
				en: 'Each new element is smaller than everything on its left and shifts all of it: 1 + 2 + 3 = 6, that is `n(n - 1) / 2`. It is the worst case, `O(n²)`.',
			},
		},
		{
			id: 'p5',
			prompt: {
				es: 'Se inserta el 4 en `{2, 5, 7, 4}` (`i = 3`). ¿En qué posición queda?',
				en: '4 is inserted into `{2, 5, 7, 4}` (`i = 3`). At which position does it end up?',
			},
			code: POSICION_HUECO,
			options: [
				{ id: 'a', text: { es: '0', en: '0' } },
				{ id: 'b', text: { es: '1', en: '1' } },
				{ id: 'c', text: { es: '2', en: '2' } },
			],
			correct: 'b',
			explanation: {
				es: 'El 7 y el 5 son mayores que 4 y se desplazan a la derecha. El 2 no, y el `while` se detiene con `j = 0`. El hueco queda en `j + 1 = 1`: el resultado es `{2, 4, 5, 7}`.',
				en: '7 and 5 are greater than 4 and shift right. 2 is not, and the `while` stops with `j = 0`. The gap is at `j + 1 = 1`: the result is `{2, 4, 5, 7}`.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: {
				es: 'Se insertan las posiciones 1 y 2 de `{9, 4, 7, 2}`. ¿Qué imprime?',
				en: 'Positions 1 and 2 of `{9, 4, 7, 2}` are inserted. What does it print?',
			},
			code: SIN_ULTIMO,
			options: [
				{ id: 'a', text: { es: '`4 7 9 2`', en: '`4 7 9 2`' } },
				{ id: 'b', text: { es: '`2 4 7 9`', en: '`2 4 7 9`' } },
				{ id: 'c', text: { es: '`4 9 7 2`', en: '`4 9 7 2`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Con `i = 1` queda `{4, 9, 7, 2}`; con `i = 2` el 7 desplaza al 9 y queda `{4, 7, 9, 2}`. El 2 nunca se inserta porque el bucle termina en `i < 3`.',
				en: 'With `i = 1` it becomes `{4, 9, 7, 2}`; with `i = 2`, 7 shifts 9 and it becomes `{4, 7, 9, 2}`. 2 is never inserted because the loop ends at `i < 3`.',
			},
		},
		{
			id: 'a2',
			prompt: {
				es: 'Falta una línea al final del bucle exterior. ¿Qué imprime con `{3, 1, 2}`?',
				en: 'A line is missing at the end of the outer loop. What does it print with `{3, 1, 2}`?',
			},
			code: SIN_INSERTAR,
			options: [
				{ id: 'a', text: { es: '`1 2 3`', en: '`1 2 3`' } },
				{ id: 'b', text: { es: '`3 3 3`', en: '`3 3 3`' } },
				{ id: 'c', text: { es: '`3 1 2`', en: '`3 1 2`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Falta `v[j + 1] = actual;`. Los elementos se desplazan pero el valor guardado en `actual` nunca se escribe en el hueco, así que se pierde. El 3 se copia sobre las posiciones que se desplazan y queda `{3, 3, 3}`.',
				en: '`v[j + 1] = actual;` is missing. Elements shift but the value saved in `actual` is never written into the gap, so it is lost. 3 is copied over the shifted positions and the result is `{3, 3, 3}`.',
			},
		},
		{
			id: 'a3',
			prompt: {
				es: 'El `while` está escrito como `v[j] > actual && j >= 0`. ¿Qué problema tiene?',
				en: 'The `while` is written as `v[j] > actual && j >= 0`. What is wrong with it?',
			},
			code: ORDEN_CONDICION,
			options: [
				{ id: 'a', text: { es: 'Lee `v[-1]` cuando `j` llega a -1', en: 'It reads `v[-1]` when `j` reaches -1' } },
				{ id: 'b', text: { es: 'No compila', en: 'It does not compile' } },
				{ id: 'c', text: { es: 'Ordena de mayor a menor', en: 'It sorts in descending order' } },
			],
			correct: 'a',
			explanation: {
				es: 'Compila, pero `&&` evalúa de izquierda a derecha: con `j = -1` primero se lee `v[-1]`, fuera del arreglo (comportamiento indefinido), y recién después se mira `j >= 0`. Por eso `j >= 0` va primero: el cortocircuito evita leer `v[-1]`.',
				en: 'It compiles, but `&&` evaluates left to right: with `j = -1` it first reads `v[-1]`, outside the array (undefined behavior), and only then checks `j >= 0`. That is why `j >= 0` goes first: short-circuiting avoids reading `v[-1]`.',
			},
		},
		{
			id: 'a4',
			prompt: {
				es: 'Con un arreglo ya ordenado de 5 elementos, ¿qué imprime este contador de desplazamientos?',
				en: 'With an already sorted 5-element array, what does this shift counter print?',
			},
			code: ORDENADO,
			options: [
				{ id: 'a', text: { es: '0', en: '0' } },
				{ id: 'b', text: { es: '4', en: '4' } },
				{ id: 'c', text: { es: '10', en: '10' } },
			],
			correct: 'a',
			explanation: {
				es: 'Ningún elemento es mayor que `actual`, así que el `while` nunca se ejecuta. El trabajo total es `n - 1` comparaciones: `O(n)`.',
				en: 'No element is greater than `actual`, so the `while` never runs. The total work is `n - 1` comparisons: `O(n)`.',
			},
		},
		{
			id: 'a5',
			prompt: {
				es: '¿Por qué inserción es buena opción para arreglos casi ordenados?',
				en: 'Why is insertion sort a good choice for almost sorted arrays?',
			},
			options: [
				{ id: 'a', text: { es: 'Cada elemento casi no se desplaza', en: 'Each element hardly shifts' } },
				{ id: 'b', text: { es: 'Siempre hace pocas comparaciones', en: 'It always makes few comparisons' } },
				{ id: 'c', text: { es: 'Usa memoria extra proporcional a `n`', en: 'It uses extra memory proportional to `n`' } },
			],
			correct: 'a',
			explanation: {
				es: 'El trabajo depende de cuánto se desplaza cada elemento. Si cada uno ya está cerca de su lugar, el costo se acerca al mejor caso `O(n)`. No siempre hace pocas comparaciones (en el peor caso son `O(n²)`) y su memoria extra es `O(1)`.',
				en: 'The work depends on how far each element shifts. If each one is already near its place, the cost approaches the `O(n)` best case. It does not always make few comparisons (worst case is `O(n²)`) and its extra memory is `O(1)`.',
			},
		},
		{
			id: 'a6',
			prompt: {
				es: '¿Inserción es estable y por qué?',
				en: 'Is insertion sort stable, and why?',
			},
			options: [
				{ id: 'a', text: { es: 'Sí: solo desplaza los estrictamente mayores', en: 'Yes: it only shifts strictly greater elements' } },
				{ id: 'b', text: { es: 'No: reordena los iguales al insertar', en: 'No: it reorders equal elements on insert' } },
				{ id: 'c', text: { es: 'No: usa una variable auxiliar', en: 'No: it uses an auxiliary variable' } },
			],
			correct: 'a',
			explanation: {
				es: 'El `while` usa `v[j] > actual` estricto: un elemento igual frena el desplazamiento, así que `actual` queda después de los iguales que ya estaban. El orden original de los iguales se conserva.',
				en: 'The `while` uses strict `v[j] > actual`: an equal element stops the shifting, so `actual` ends up after the equal ones already there. The original order of equal elements is kept.',
			},
		},
	],
};
