import type { PracticeSet } from './types';

// Practice and assessment for the "operaciones con arreglos" presentation
// (lesson `operaciones-con-arreglos`).
const SUMA = `#include <stdio.h>

int main(void) {
    int v[4] = {2, 4, 6, 8};
    int suma = 0;
    for (int i = 0; i < 4; i++) {
        suma += v[i];
    }
    printf("%d\\n", suma);
    return 0;
}`;

const MAXIMO = `#include <stdio.h>

int main(void) {
    int v[3] = {3, 9, 2};
    int max = v[0];
    for (int i = 1; i < 3; i++) {
        if (v[i] > max) {
            max = v[i];
        }
    }
    printf("%d\\n", max);
    return 0;
}`;

const BUSCAR = `#include <stdio.h>

int main(void) {
    int v[4] = {5, 7, 9, 7};
    int pos = -1;
    for (int i = 0; i < 4 && pos == -1; i++) {
        if (v[i] == 7) {
            pos = i;
        }
    }
    printf("%d\\n", pos);
    return 0;
}`;

const INSERTAR = `#include <stdio.h>

int main(void) {
    int v[4] = {1, 2, 4, 0};
    int n = 3;
    int pos = 2;
    for (int i = n; i > pos; i--) {
        v[i] = v[i - 1];
    }
    v[pos] = 3;
    printf("%d\\n", v[3]);
    return 0;
}`;

const INVERTIR = `#include <stdio.h>

int main(void) {
    int v[4] = {1, 2, 3, 4};
    int n = 4;
    for (int i = 0; i < n / 2; i++) {
        int tmp = v[i];
        v[i] = v[n - 1 - i];
        v[n - 1 - i] = tmp;
    }
    printf("%d\\n", v[0]);
    return 0;
}`;

const ATRAS = `/* c-check: skip */
for (size_t i = n - 1; i >= 0; i--) {
    printf("%d\\n", v[i]);
}`;

const PARES = `#include <stdio.h>

int main(void) {
    int v[5] = {1, 2, 3, 4, 6};
    int pares = 0;
    for (int i = 0; i < 5; i++) {
        if (v[i] % 2 == 0) {
            pares++;
        }
    }
    printf("%d\\n", pares);
    return 0;
}`;

const PROMEDIO = `#include <stdio.h>

int main(void) {
    int v[2] = {3, 4};
    int suma = v[0] + v[1];
    printf("%d\\n", suma / 2);
    return 0;
}`;

const ELIMINAR = `#include <stdio.h>

int main(void) {
    int v[4] = {1, 2, 3, 4};
    int n = 4;
    int pos = 1;
    for (int i = pos; i < n - 1; i++) {
        v[i] = v[i + 1];
    }
    n--;
    printf("%d %d\\n", v[1], n);
    return 0;
}`;

const INSERTAR_MAL = `#include <stdio.h>

int main(void) {
    int v[5] = {1, 2, 3, 0, 0};
    int n = 3;
    int pos = 0;
    for (int i = pos; i < n; i++) {
        v[i + 1] = v[i];
    }
    v[pos] = 9;
    printf("%d\\n", v[3]);
    return 0;
}`;

const COPIA = `/* c-check: skip */
int a[3] = {1, 2, 3};
int b[3];
b = a;`;

const NO_ENCONTRADO = `#include <stdio.h>

int buscar(const int v[], int n, int x) {
    for (int i = 0; i < n; i++) {
        if (v[i] == x) {
            return i;
        }
    }
    return -1;
}

int main(void) {
    int v[3] = {4, 5, 6};
    printf("%d\\n", buscar(v, 3, 9));
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime este recorrido con acumulador?', en: 'What does this traversal with an accumulator print?' },
			code: SUMA,
			options: [
				{ id: 'a', text: { es: '`20`', en: '`20`' } },
				{ id: 'b', text: { es: '`12`', en: '`12`' } },
				{ id: 'c', text: { es: '`8`', en: '`8`' } },
			],
			correct: 'a',
			explanation: {
				es: '`suma` empieza en 0 y acumula cada elemento: 2, 6, 12 y finalmente 20.',
				en: '`suma` starts at 0 and accumulates each element: 2, 6, 12 and finally 20.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Qué valor tiene `max` al terminar?', en: 'What value does `max` have at the end?' },
			code: MAXIMO,
			options: [
				{ id: 'a', text: { es: '`3`', en: '`3`' } },
				{ id: 'b', text: { es: '`9`', en: '`9`' } },
				{ id: 'c', text: { es: '`2`', en: '`2`' } },
			],
			correct: 'b',
			explanation: {
				es: '`max` parte de `v[0]` (3). En `i = 1`, 9 > 3, así que `max` pasa a 9. En `i = 2`, 2 no supera a 9.',
				en: '`max` starts at `v[0]` (3). At `i = 1`, 9 > 3, so `max` becomes 9. At `i = 2`, 2 does not beat 9.',
			},
		},
		{
			id: 'p3',
			prompt: { es: 'La búsqueda guarda la primera posición del 7. ¿Qué imprime?', en: 'The search stores the first position of the 7. What does it print?' },
			code: BUSCAR,
			options: [
				{ id: 'a', text: { es: '`1`', en: '`1`' } },
				{ id: 'b', text: { es: '`3`', en: '`3`' } },
				{ id: 'c', text: { es: '`-1`', en: '`-1`' } },
			],
			correct: 'a',
			explanation: {
				es: 'El 7 aparece primero en el índice 1. Allí `pos` deja de ser -1 y la condición `pos == -1` corta el bucle, así que no llega al índice 3.',
				en: 'The 7 first appears at index 1. There `pos` stops being -1 and the `pos == -1` condition ends the loop, so it never reaches index 3.',
			},
		},
		{
			id: 'p4',
			prompt: { es: 'Se inserta el 3 en la posición 2 corriendo elementos. ¿Qué queda en `v[3]`?', en: 'The 3 is inserted at position 2 by shifting elements. What ends up in `v[3]`?' },
			code: INSERTAR,
			options: [
				{ id: 'a', text: { es: '`0`', en: '`0`' } },
				{ id: 'b', text: { es: '`3`', en: '`3`' } },
				{ id: 'c', text: { es: '`4`', en: '`4`' } },
			],
			correct: 'c',
			explanation: {
				es: 'El corrimiento va de atrás hacia adelante: `v[3] = v[2]` mueve el 4 a la última posición antes de que `v[2]` se sobrescriba con el 3.',
				en: 'The shift goes from back to front: `v[3] = v[2]` moves the 4 to the last position before `v[2]` is overwritten with the 3.',
			},
		},
		{
			id: 'p5',
			prompt: { es: 'Tras invertir el arreglo con intercambios, ¿qué imprime `v[0]`?', en: 'After reversing the array with swaps, what does `v[0]` print?' },
			code: INVERTIR,
			options: [
				{ id: 'a', text: { es: '`1`', en: '`1`' } },
				{ id: 'b', text: { es: '`2`', en: '`2`' } },
				{ id: 'c', text: { es: '`4`', en: '`4`' } },
			],
			correct: 'c',
			explanation: {
				es: 'En `i = 0` se intercambian `v[0]` y `v[3]`, y el 4 llega al principio. El bucle solo recorre la mitad (`n / 2`) porque cada intercambio arregla dos posiciones.',
				en: 'At `i = 0`, `v[0]` and `v[3]` are swapped, and the 4 reaches the front. The loop only covers half (`n / 2`) because each swap fixes two positions.',
			},
		},
		{
			id: 'p6',
			prompt: { es: '¿Qué le pasa a este recorrido hacia atrás?', en: 'What happens to this backwards traversal?' },
			code: ATRAS,
			options: [
				{ id: 'a', text: { es: 'Termina bien en `i = 0`', en: 'It ends fine at `i = 0`' } },
				{ id: 'b', text: { es: 'Nunca termina: `size_t` no tiene signo y `i >= 0` siempre es verdadera', en: 'It never ends: `size_t` is unsigned and `i >= 0` is always true' } },
				{ id: 'c', text: { es: 'No compila porque `size_t` no admite `--`', en: 'It does not compile because `size_t` does not allow `--`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Un `size_t` nunca es negativo: al restar 1 a 0 vuelve al valor máximo. Para recorrer hacia atrás se usa, por ejemplo, `for (size_t i = n; i-- > 0;)`.',
				en: 'A `size_t` is never negative: subtracting 1 from 0 wraps to the maximum value. To go backwards use, for example, `for (size_t i = n; i-- > 0;)`.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: PARES,
			options: [
				{ id: 'a', text: { es: '`2`', en: '`2`' } },
				{ id: 'b', text: { es: '`3`', en: '`3`' } },
				{ id: 'c', text: { es: '`12`', en: '`12`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Los elementos pares son 2, 4 y 6: el contador sube tres veces.',
				en: 'The even elements are 2, 4 and 6: the counter goes up three times.',
			},
		},
		{
			id: 'a2',
			prompt: { es: 'Se quiere el promedio de 3 y 4. ¿Qué imprime este código?', en: 'The goal is the average of 3 and 4. What does this code print?' },
			code: PROMEDIO,
			options: [
				{ id: 'a', text: { es: '`3.5`', en: '`3.5`' } },
				{ id: 'b', text: { es: '`3`', en: '`3`' } },
				{ id: 'c', text: { es: '`4`', en: '`4`' } },
			],
			correct: 'b',
			explanation: {
				es: '`suma / 2` es una división entera: 7 / 2 da 3 y se pierde la parte decimal. Para obtener 3.5 hay que dividir como `double`.',
				en: '`suma / 2` is an integer division: 7 / 2 gives 3 and the decimal part is lost. To get 3.5 you must divide as `double`.',
			},
		},
		{
			id: 'a3',
			prompt: { es: 'Se elimina el elemento de la posición 1 corriendo los siguientes. ¿Qué imprime?', en: 'The element at position 1 is removed by shifting the following ones. What does it print?' },
			code: ELIMINAR,
			options: [
				{ id: 'a', text: { es: '`2 4`', en: '`2 4`' } },
				{ id: 'b', text: { es: '`3 3`', en: '`3 3`' } },
				{ id: 'c', text: { es: '`3 4`', en: '`3 4`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Los elementos se corren hacia la izquierda: `v[1]` pasa a ser 3 y el arreglo queda `{1, 3, 4}`. Al final `n--` deja la cantidad lógica en 3.',
				en: 'Elements shift to the left: `v[1]` becomes 3 and the array is `{1, 3, 4}`. At the end `n--` sets the logical count to 3.',
			},
		},
		{
			id: 'a4',
			prompt: { es: 'Este código intenta insertar un 9 al principio. ¿Qué imprime `v[3]`?', en: 'This code tries to insert a 9 at the front. What does `v[3]` print?' },
			code: INSERTAR_MAL,
			options: [
				{ id: 'a', text: { es: '`3`, el último elemento original', en: '`3`, the last original element' } },
				{ id: 'b', text: { es: '`1`, porque el corrimiento hacia adelante pisa los valores', en: '`1`, because the forward shift overwrites the values' } },
				{ id: 'c', text: { es: '`0`, el valor que tenía', en: '`0`, the value it had' } },
			],
			correct: 'b',
			explanation: {
				es: 'Corriendo de adelante hacia atrás, cada `v[i + 1] = v[i]` copia un valor ya pisado: el 1 se propaga y el arreglo queda `{9, 1, 1, 1, 0}`. El corrimiento para insertar debe ir desde el final.',
				en: 'Shifting from front to back, each `v[i + 1] = v[i]` copies an already overwritten value: the 1 spreads and the array becomes `{9, 1, 1, 1, 0}`. The shift to insert must start from the end.',
			},
		},
		{
			id: 'a5',
			prompt: { es: '¿Por qué falla este intento de copiar un arreglo?', en: 'Why does this attempt to copy an array fail?' },
			code: COPIA,
			options: [
				{ id: 'a', text: { es: 'Los arreglos no se asignan con `=`: hay que copiar elemento por elemento', en: 'Arrays cannot be assigned with `=`: you must copy element by element' } },
				{ id: 'b', text: { es: 'Porque `b` debería ser más grande que `a`', en: 'Because `b` should be larger than `a`' } },
				{ id: 'c', text: { es: 'Porque falta inicializar `b`', en: 'Because `b` must be initialized' } },
			],
			correct: 'a',
			explanation: {
				es: 'Un arreglo no es un valor que se pueda asignar completo: `b = a` es un error de compilación. Se copia con un bucle que recorre los índices.',
				en: 'An array is not a value that can be assigned whole: `b = a` is a compile error. You copy with a loop over the indexes.',
			},
		},
		{
			id: 'a6',
			prompt: { es: '¿Qué imprime este programa cuando el valor no está en el arreglo?', en: 'What does this program print when the value is not in the array?' },
			code: NO_ENCONTRADO,
			options: [
				{ id: 'a', text: { es: '`0`', en: '`0`' } },
				{ id: 'b', text: { es: '`3`', en: '`3`' } },
				{ id: 'c', text: { es: '`-1`', en: '`-1`' } },
			],
			correct: 'c',
			explanation: {
				es: 'Ningún elemento vale 9, así que el bucle termina sin `return` y la función devuelve -1, un índice imposible que significa «no encontrado».',
				en: 'No element is 9, so the loop ends without a `return` and the function returns -1, an impossible index meaning “not found”.',
			},
		},
	],
};
