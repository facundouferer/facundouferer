import type { PracticeSet } from './types';

// Practice and assessment for the "for paso a paso" presentation
// (lesson `sentencia-for`).
const CUENTA = `#include <stdio.h>

int main(void) {
    for (int i = 0; i < 3; i++) {
        printf("%d\\n", i);
    }
    return 0;
}`;

const SUMA = `#include <stdio.h>

int main(void) {
    int suma = 0;
    for (int i = 1; i <= 4; i++) {
        suma += i;
    }
    printf("%d\\n", suma);
    return 0;
}`;

const SALTO = `#include <stdio.h>

int main(void) {
    for (int i = 10; i > 0; i -= 3) {
        printf("%d ", i);
    }
    printf("\\n");
    return 0;
}`;

const FINAL = `#include <stdio.h>

int main(void) {
    int i;
    for (i = 0; i < 5; i++) {
    }
    printf("%d\\n", i);
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: CUENTA,
			options: [
				{ id: 'a', text: { es: '`1`, `2` y `3`', en: '`1`, `2` and `3`' } },
				{ id: 'b', text: { es: '`0`, `1` y `2`', en: '`0`, `1` and `2`' } },
				{ id: 'c', text: { es: '`0`, `1`, `2` y `3`', en: '`0`, `1`, `2` and `3`' } },
			],
			correct: 'b',
			explanation: {
				es: '`i` arranca en 0 y la condición `i < 3` se prueba antes de cada vuelta: corre con 0, 1 y 2. Cuando `i` llega a 3 la condición es falsa y el ciclo termina.',
				en: '`i` starts at 0 and the condition `i < 3` is tested before every pass: it runs with 0, 1 and 2. When `i` reaches 3 the condition is false and the loop ends.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Cuánto vale `suma` al terminar el ciclo?', en: 'What does `suma` hold when the loop ends?' },
			code: SUMA,
			options: [
				{ id: 'a', text: { es: '10', en: '10' } },
				{ id: 'b', text: { es: '6', en: '6' } },
				{ id: 'c', text: { es: '4', en: '4' } },
			],
			correct: 'a',
			explanation: {
				es: '`suma` acumula 1, luego 3, luego 6 y finalmente 10: el ciclo suma `i` con `i` valiendo 1, 2, 3 y 4.',
				en: '`suma` accumulates 1, then 3, then 6 and finally 10: the loop adds `i` while `i` is 1, 2, 3 and 4.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: SALTO,
			options: [
				{ id: 'a', text: { es: '`10 7 4 1`', en: '`10 7 4 1`' } },
				{ id: 'b', text: { es: '`10 7 4`', en: '`10 7 4`' } },
				{ id: 'c', text: { es: '`7 4 1`', en: '`7 4 1`' } },
			],
			correct: 'a',
			explanation: {
				es: 'El paso `i -= 3` resta 3 tras cada vuelta: 10, 7, 4 y 1 cumplen `i > 0`. Después `i` vale -2 y el ciclo termina.',
				en: 'The step `i -= 3` subtracts 3 after each pass: 10, 7, 4 and 1 satisfy `i > 0`. Then `i` is -2 and the loop ends.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Qué valor tiene `i` cuando se imprime?', en: 'What value does `i` have when it is printed?' },
			code: FINAL,
			options: [
				{ id: 'a', text: { es: '4', en: '4' } },
				{ id: 'b', text: { es: '5', en: '5' } },
				{ id: 'c', text: { es: '0', en: '0' } },
			],
			correct: 'b',
			explanation: {
				es: '`i` se declaró fuera del `for`, así que sigue existiendo después. El ciclo solo termina cuando `i < 5` es falso, es decir, con `i` valiendo 5.',
				en: '`i` was declared outside the `for`, so it still exists afterwards. The loop only ends when `i < 5` is false, that is, with `i` equal to 5.',
			},
		},
		{
			id: 'p5',
			prompt: {
				es: 'En `for (int i = 0; i < 5; i++)`, ¿cuántas veces se ejecuta la inicialización `int i = 0`?',
				en: 'In `for (int i = 0; i < 5; i++)`, how many times does the initialization `int i = 0` run?',
			},
			options: [
				{ id: 'a', text: { es: 'Una sola vez, al entrar al ciclo', en: 'Only once, when entering the loop' } },
				{ id: 'b', text: { es: 'Antes de cada vuelta', en: 'Before every pass' } },
				{ id: 'c', text: { es: 'Cinco veces', en: 'Five times' } },
			],
			correct: 'a',
			explanation: {
				es: 'La inicialización corre una única vez. Lo que se repite es la condición (antes de cada vuelta) y el incremento (después de cada vuelta).',
				en: 'The initialization runs a single time. What repeats is the condition (before every pass) and the increment (after every pass).',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: `#include <stdio.h>

int main(void) {
    for (int i = 2; i <= 8; i += 2) {
        printf("%d ", i);
    }
    printf("\\n");
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: '`2 4 6`', en: '`2 4 6`' } },
				{ id: 'b', text: { es: '`2 4 6 8`', en: '`2 4 6 8`' } },
				{ id: 'c', text: { es: '`2 3 4 5 6 7 8`', en: '`2 3 4 5 6 7 8`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Empieza en 2 y avanza de a 2. Como la condición es `<=`, el 8 todavía entra.',
				en: 'It starts at 2 and moves in steps of 2. Since the condition is `<=`, 8 still gets in.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: `#include <stdio.h>

int main(void) {
    int producto = 1;
    for (int i = 1; i <= 5; i++) {
        producto *= i;
    }
    printf("%d\\n", producto);
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: '120', en: '120' } },
				{ id: 'b', text: { es: '24', en: '24' } },
				{ id: 'c', text: { es: '15', en: '15' } },
			],
			correct: 'a',
			explanation: {
				es: 'El ciclo calcula 1·2·3·4·5 = 120 (el factorial de 5). Con `i <= 4` habría dado 24.',
				en: 'The loop computes 1·2·3·4·5 = 120 (the factorial of 5). With `i <= 4` it would have given 24.',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Cuántas veces se imprime `hola`?', en: 'How many times is `hola` printed?' },
			code: `#include <stdio.h>

int main(void) {
    for (int i = 5; i < 5; i++) {
        printf("hola\\n");
    }
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: 'Una vez', en: 'Once' } },
				{ id: 'b', text: { es: 'Cinco veces', en: 'Five times' } },
				{ id: 'c', text: { es: 'Ninguna', en: 'Never' } },
			],
			correct: 'c',
			explanation: {
				es: 'El `for` prueba la condición antes de la primera vuelta: `5 < 5` es falso y el cuerpo no corre ni una vez.',
				en: 'The `for` tests the condition before the first pass: `5 < 5` is false and the body never runs.',
			},
		},
		{
			id: 'a4',
			prompt: { es: '¿Qué problema tiene este ciclo?', en: 'What is wrong with this loop?' },
			code: `/* c-check: skip */
for (int i = 0; i < 5; i--) {
    printf("%d\\n", i);
}`,
			options: [
				{ id: 'a', text: { es: 'No compila porque falta `;`', en: 'It does not compile because `;` is missing' } },
				{ id: 'b', text: { es: '`i--` aleja a `i` de 5: la condición nunca se vuelve falsa y el ciclo no termina', en: '`i--` moves `i` away from 5: the condition never becomes false and the loop never ends' } },
				{ id: 'c', text: { es: 'Imprime solo `0` y termina', en: 'It prints only `0` and ends' } },
			],
			correct: 'b',
			explanation: {
				es: 'El incremento va en sentido contrario al límite: `i` baja a -1, -2, ... y `i < 5` sigue siendo verdadera. Es un ciclo infinito (hasta que `i` se desborda).',
				en: 'The step goes against the limit: `i` goes to -1, -2, ... and `i < 5` stays true. It is an infinite loop (until `i` overflows).',
			},
		},
		{
			id: 'a5',
			prompt: { es: '¿Cuál es la secuencia de pasos de un `for`?', en: 'What is the order of steps in a `for`?' },
			options: [
				{ id: 'a', text: { es: 'Inicializar, probar condición, cuerpo, incremento, probar condición...', en: 'Initialize, test condition, body, increment, test condition...' } },
				{ id: 'b', text: { es: 'Inicializar, cuerpo, incremento, probar condición...', en: 'Initialize, body, increment, test condition...' } },
				{ id: 'c', text: { es: 'Probar condición, inicializar, cuerpo, incremento...', en: 'Test condition, initialize, body, increment...' } },
			],
			correct: 'a',
			explanation: {
				es: 'La inicialización corre una vez; luego se repite: condición, cuerpo e incremento. Por eso el cuerpo puede no ejecutarse nunca.',
				en: 'The initialization runs once; then this repeats: condition, body and increment. That is why the body may never run.',
			},
		},
	],
};
