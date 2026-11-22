import type { PracticeSet } from './types';

// Practice and assessment for the "for anidado y tabla de multiplicar"
// presentation (lesson `programacion-esquematica-y-sentencias-anidadas`).
const TABLA = `#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 2; i++) {
        for (int j = 1; j <= 3; j++) {
            printf("%d ", i * j);
        }
        printf("\\n");
    }
    return 0;
}`;

const CUENTA = `#include <stdio.h>

int main(void) {
    int veces = 0;
    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < 3; j++) {
            veces++;
        }
    }
    printf("%d\\n", veces);
    return 0;
}`;

const TRIANGULO = `#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= i; j++) {
            printf("*");
        }
        printf("\\n");
    }
    return 0;
}`;

const PARES = `#include <stdio.h>

int main(void) {
    for (int x = 0; x < 2; x++) {
        for (int y = 0; y < 2; y++) {
            printf("(%d,%d) ", x, y);
        }
    }
    printf("\\n");
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: TABLA,
			options: [
				{ id: 'a', text: { es: 'Dos filas: `1 2 3` y `2 4 6`', en: 'Two rows: `1 2 3` and `2 4 6`' } },
				{ id: 'b', text: { es: 'Tres filas: `1 2`, `2 4` y `3 6`', en: 'Three rows: `1 2`, `2 4` and `3 6`' } },
				{ id: 'c', text: { es: 'Una fila: `1 2 3 2 4 6`', en: 'One row: `1 2 3 2 4 6`' } },
			],
			correct: 'a',
			explanation: {
				es: 'El ciclo externo (`i`) elige la fila y el interno (`j`) recorre las columnas. Tras cada fila completa, el `printf("\\n")` del externo salta de línea.',
				en: 'The outer loop (`i`) picks the row and the inner one (`j`) walks the columns. After each full row, the outer `printf("\\n")` moves to a new line.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Cuánto vale `veces` al terminar?', en: 'What does `veces` hold at the end?' },
			code: CUENTA,
			options: [
				{ id: 'a', text: { es: '7', en: '7' } },
				{ id: 'b', text: { es: '12', en: '12' } },
				{ id: 'c', text: { es: '3', en: '3' } },
			],
			correct: 'b',
			explanation: {
				es: 'El cuerpo interno corre 3 veces por cada una de las 4 vueltas del externo: 4 × 3 = 12.',
				en: 'The inner body runs 3 times for each of the 4 outer passes: 4 × 3 = 12.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Qué dibuja este programa?', en: 'What does this program draw?' },
			code: TRIANGULO,
			options: [
				{ id: 'a', text: { es: 'Tres filas de tres asteriscos', en: 'Three rows of three asterisks' } },
				{ id: 'b', text: { es: 'Filas de 1, 2 y 3 asteriscos', en: 'Rows of 1, 2 and 3 asterisks' } },
				{ id: 'c', text: { es: 'Filas de 3, 2 y 1 asteriscos', en: 'Rows of 3, 2 and 1 asterisks' } },
			],
			correct: 'b',
			explanation: {
				es: 'El límite del ciclo interno es `i`, que cambia en cada fila: la fila 1 tiene 1 asterisco, la 2 tiene 2 y la 3 tiene 3.',
				en: 'The inner loop limit is `i`, which changes on each row: row 1 has 1 asterisk, row 2 has 2 and row 3 has 3.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Cuál es el tercer par que se imprime?', en: 'Which is the third pair printed?' },
			code: PARES,
			options: [
				{ id: 'a', text: { es: '`(1,0)`', en: '`(1,0)`' } },
				{ id: 'b', text: { es: '`(0,1)`', en: '`(0,1)`' } },
				{ id: 'c', text: { es: '`(1,1)`', en: '`(1,1)`' } },
			],
			correct: 'a',
			explanation: {
				es: 'El orden es `(0,0)`, `(0,1)`, `(1,0)`, `(1,1)`: la variable interna `y` cambia más rápido y la externa `x` solo avanza cuando `y` terminó su recorrido.',
				en: 'The order is `(0,0)`, `(0,1)`, `(1,0)`, `(1,1)`: the inner variable `y` changes fastest and the outer `x` only advances when `y` has finished its run.',
			},
		},
		{
			id: 'p5',
			prompt: {
				es: 'Una tabla de multiplicar de 9 filas y 9 columnas con dos `for` anidados, ¿cuántas veces ejecuta el `printf` de cada celda?',
				en: 'A 9-row by 9-column multiplication table with two nested `for` loops: how many times does the per-cell `printf` run?',
			},
			options: [
				{ id: 'a', text: { es: '18', en: '18' } },
				{ id: 'b', text: { es: '81', en: '81' } },
				{ id: 'c', text: { es: '9', en: '9' } },
			],
			correct: 'b',
			explanation: {
				es: 'El interno completa sus 9 vueltas por cada una de las 9 del externo: 9 × 9 = 81 celdas.',
				en: 'The inner loop completes its 9 passes for each of the 9 outer ones: 9 × 9 = 81 cells.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: `#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            printf("%d\\t", i * j);
        }
        printf("\\n");
    }
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: 'Una tabla donde la última fila es `3 6 9`', en: 'A table whose last row is `3 6 9`' } },
				{ id: 'b', text: { es: 'Una tabla donde la última fila es `1 2 3`', en: 'A table whose last row is `1 2 3`' } },
				{ id: 'c', text: { es: 'Una tabla donde la última fila es `9`', en: 'A table whose last row is `9`' } },
			],
			correct: 'a',
			explanation: {
				es: 'En la última fila `i` vale 3 y `j` recorre 1, 2 y 3: los productos son 3, 6 y 9.',
				en: 'On the last row `i` is 3 and `j` runs 1, 2 and 3: the products are 3, 6 and 9.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Cuántas veces se imprime `x`?', en: 'How many times is `x` printed?' },
			code: `#include <stdio.h>

int main(void) {
    for (int i = 0; i < 3; i++) {
        for (int j = i; j < 3; j++) {
            printf("x");
        }
    }
    printf("\\n");
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: '9 veces', en: '9 times' } },
				{ id: 'b', text: { es: '3 veces', en: '3 times' } },
				{ id: 'c', text: { es: '6 veces', en: '6 times' } },
			],
			correct: 'c',
			explanation: {
				es: 'Como `j` arranca en `i`, el interno corre 3 veces con `i = 0`, 2 con `i = 1` y 1 con `i = 2`: 3 + 2 + 1 = 6.',
				en: 'Since `j` starts at `i`, the inner loop runs 3 times with `i = 0`, 2 with `i = 1` and 1 with `i = 2`: 3 + 2 + 1 = 6.',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Qué error tiene este código?', en: 'What is wrong with this code?' },
			code: `/* c-check: skip */
for (int i = 0; i < 3; i++) {
    for (int i = 0; i < 3; i++) {
        printf("%d", i);
    }
}`,
			options: [
				{ id: 'a', text: { es: 'No hay error; los dos `i` son la misma variable', en: 'No error; both `i` are the same variable' } },
				{ id: 'b', text: { es: 'Los dos ciclos usan el nombre `i`: el interno oculta al externo y confunde la lectura', en: 'Both loops use the name `i`: the inner one hides the outer one and confuses the reading' } },
				{ id: 'c', text: { es: 'Un `for` no puede contener a otro', en: 'A `for` cannot contain another one' } },
			],
			correct: 'b',
			explanation: {
				es: 'Compila, pero el `i` interno es otra variable que oculta al externo, y dentro del bloque ya no se puede usar la fila. Cada ciclo anidado necesita su propio contador (`i`, `j`).',
				en: 'It compiles, but the inner `i` is a different variable that hides the outer one, and the row can no longer be used inside the block. Each nested loop needs its own counter (`i`, `j`).',
			},
		},
		{
			id: 'a4',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: `#include <stdio.h>

int main(void) {
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            if (j == 1) {
                continue;
            }
            printf("%d%d ", i, j);
        }
    }
    printf("\\n");
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: '`00 02 10 12`', en: '`00 02 10 12`' } },
				{ id: 'b', text: { es: '`00 01 02 10 11 12`', en: '`00 01 02 10 11 12`' } },
				{ id: 'c', text: { es: '`00 10`', en: '`00 10`' } },
			],
			correct: 'a',
			explanation: {
				es: '`continue` salta solo el resto de la vuelta del ciclo interno cuando `j` vale 1; el ciclo externo sigue normal.',
				en: '`continue` only skips the rest of the inner loop pass when `j` is 1; the outer loop carries on normally.',
			},
		},
		{
			id: 'a5',
			prompt: { es: 'Si el ciclo externo hace N vueltas y el interno M, ¿cuántas veces corre el cuerpo interno?', en: 'If the outer loop makes N passes and the inner one M, how many times does the inner body run?' },
			options: [
				{ id: 'a', text: { es: 'N + M', en: 'N + M' } },
				{ id: 'b', text: { es: 'N × M', en: 'N × M' } },
				{ id: 'c', text: { es: 'M', en: 'M' } },
			],
			correct: 'b',
			explanation: {
				es: 'El interno se reinicia y completa sus M vueltas en cada una de las N del externo, así que el total es N × M.',
				en: 'The inner loop restarts and completes its M passes on each of the N outer ones, so the total is N × M.',
			},
		},
	],
};
