import type { PracticeSet } from './types';

// Practice and assessment for the "do-while paso a paso" presentation
// (lesson `sentencia-do-while`).
const UNA_VEZ = `#include <stdio.h>

int main(void) {
    int n = 10;
    do {
        printf("n = %d\\n", n);
        n++;
    } while (n < 5);
    return 0;
}`;

const CUENTA = `#include <stdio.h>

int main(void) {
    int i = 1;
    do {
        printf("%d ", i);
        i++;
    } while (i <= 3);
    printf("\\n");
    return 0;
}`;

const DIGITOS = `#include <stdio.h>

int main(void) {
    int n = 1234;
    int cantidad = 0;
    do {
        n /= 10;
        cantidad++;
    } while (n != 0);
    printf("%d\\n", cantidad);
    return 0;
}`;

const VALOR = `#include <stdio.h>

int main(void) {
    int x = 3;
    do {
        x *= 2;
    } while (x < 20);
    printf("%d\\n", x);
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: UNA_VEZ,
			options: [
				{ id: 'a', text: { es: 'Nada, porque `10 < 5` es falso', en: 'Nothing, because `10 < 5` is false' } },
				{ id: 'b', text: { es: '`n = 10`', en: '`n = 10`' } },
				{ id: 'c', text: { es: '`n = 10` y `n = 11`', en: '`n = 10` and `n = 11`' } },
			],
			correct: 'b',
			explanation: {
				es: 'El `do-while` ejecuta el cuerpo y recién después evalúa la condición. Se imprime una vez y, como `11 < 5` es falso, el ciclo termina.',
				en: 'The `do-while` runs the body and only then evaluates the condition. It prints once and, since `11 < 5` is false, the loop ends.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: CUENTA,
			options: [
				{ id: 'a', text: { es: '`1 2`', en: '`1 2`' } },
				{ id: 'b', text: { es: '`1 2 3 4`', en: '`1 2 3 4`' } },
				{ id: 'c', text: { es: '`1 2 3`', en: '`1 2 3`' } },
			],
			correct: 'c',
			explanation: {
				es: 'Después de imprimir 3, `i` vale 4 y `i <= 3` es falso, así que no hay una cuarta vuelta.',
				en: 'After printing 3, `i` is 4 and `i <= 3` is false, so there is no fourth pass.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Qué valor imprime este programa?', en: 'What value does this program print?' },
			code: VALOR,
			options: [
				{ id: 'a', text: { es: '24', en: '24' } },
				{ id: 'b', text: { es: '12', en: '12' } },
				{ id: 'c', text: { es: '6', en: '6' } },
			],
			correct: 'a',
			explanation: {
				es: '`x` pasa de 3 a 6, 12 y 24. Con 6 y 12 la condición `x < 20` es verdadera y repite; con 24 es falsa y se detiene.',
				en: '`x` goes from 3 to 6, 12 and 24. With 6 and 12 the condition `x < 20` is true and it repeats; with 24 it is false and stops.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Cuántos dígitos cuenta este programa para `n = 1234`?', en: 'How many digits does this program count for `n = 1234`?' },
			code: DIGITOS,
			options: [
				{ id: 'a', text: { es: '3', en: '3' } },
				{ id: 'b', text: { es: '4', en: '4' } },
				{ id: 'c', text: { es: '5', en: '5' } },
			],
			correct: 'b',
			explanation: {
				es: 'Cada vuelta divide `n` entre 10: 123, 12, 1 y 0. Son cuatro vueltas y, al llegar a 0, la condición `n != 0` corta el ciclo.',
				en: 'Each pass divides `n` by 10: 123, 12, 1 and 0. That is four passes and, on reaching 0, the condition `n != 0` stops the loop.',
			},
		},
		{
			id: 'p5',
			prompt: {
				es: '¿Qué hace falta al final de `do { ... } while (cond)` para que compile?',
				en: 'What must follow `do { ... } while (cond)` for it to compile?',
			},
			options: [
				{ id: 'a', text: { es: 'Un punto y coma `;`', en: 'A semicolon `;`' } },
				{ id: 'b', text: { es: 'Nada, igual que el `while`', en: 'Nothing, just like `while`' } },
				{ id: 'c', text: { es: 'Una llave `}` extra', en: 'An extra `}`' } },
			],
			correct: 'a',
			explanation: {
				es: 'La sentencia `do-while` termina con `;` después de la condición. Es una de las pocas sentencias de control que lo exige.',
				en: 'The `do-while` statement ends with `;` after the condition. It is one of the few control statements that requires it.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Cuántas veces se imprime `hola`?', en: 'How many times is `hola` printed?' },
			code: `#include <stdio.h>

int main(void) {
    int veces = 0;
    do {
        printf("hola\\n");
        veces++;
    } while (veces < 0);
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: 'Ninguna', en: 'Never' } },
				{ id: 'b', text: { es: 'Una vez', en: 'Once' } },
				{ id: 'c', text: { es: 'Infinitas veces', en: 'Forever' } },
			],
			correct: 'b',
			explanation: {
				es: 'El cuerpo corre antes de mirar la condición. Después `veces` vale 1, `1 < 0` es falso y el ciclo termina.',
				en: 'The body runs before the condition is checked. Afterwards `veces` is 1, `1 < 0` is false and the loop ends.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: `#include <stdio.h>

int main(void) {
    int suma = 0;
    int i = 1;
    do {
        suma += i;
        i++;
    } while (i < 5);
    printf("%d\\n", suma);
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: '10', en: '10' } },
				{ id: 'b', text: { es: '15', en: '15' } },
				{ id: 'c', text: { es: '6', en: '6' } },
			],
			correct: 'a',
			explanation: {
				es: 'Suma 1, 2, 3 y 4. Cuando `i` vale 5 la condición `i < 5` es falsa, así que el 5 no se suma.',
				en: 'It adds 1, 2, 3 and 4. When `i` is 5 the condition `i < 5` is false, so 5 is not added.',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Por qué este ciclo no termina nunca?', en: 'Why does this loop never end?' },
			code: `/* c-check: skip */
int i = 0;
do {
    printf("%d\\n", i);
} while (i < 3);`,
			options: [
				{ id: 'a', text: { es: 'Porque un `do-while` siempre es infinito', en: 'Because a `do-while` is always infinite' } },
				{ id: 'b', text: { es: 'Porque falta el `;` final', en: 'Because the final `;` is missing' } },
				{ id: 'c', text: { es: 'Porque nada modifica `i` y `i < 3` queda siempre verdadera', en: 'Because nothing changes `i` and `i < 3` stays true forever' } },
			],
			correct: 'c',
			explanation: {
				es: 'El cuerpo debe acercar la condición a ser falsa. Falta un `i++` dentro del bloque: sin él `i` siempre vale 0.',
				en: 'The body must move the condition toward false. An `i++` is missing inside the block: without it `i` is always 0.',
			},
		},
		{
			id: 'a4',
			prompt: { es: '¿Cuál es la diferencia esencial entre `while` y `do-while`?', en: 'What is the essential difference between `while` and `do-while`?' },
			options: [
				{ id: 'a', text: { es: '`do-while` prueba la condición después del cuerpo, así que corre al menos una vez', en: '`do-while` tests the condition after the body, so it runs at least once' } },
				{ id: 'b', text: { es: '`do-while` es más rápido que `while`', en: '`do-while` is faster than `while`' } },
				{ id: 'c', text: { es: '`while` solo sirve con contadores y `do-while` con cualquier condición', en: '`while` only works with counters and `do-while` with any condition' } },
			],
			correct: 'a',
			explanation: {
				es: 'Es una cuestión de orden: el `while` prueba antes y puede no correr nunca; el `do-while` prueba después y corre mínimo una vez.',
				en: 'It is a matter of order: `while` tests first and may never run; `do-while` tests afterwards and runs at least once.',
			},
		},
		{
			id: 'a5',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: `#include <stdio.h>

int main(void) {
    int n = 0;
    do {
        n += 5;
    } while (n < 12);
    printf("%d\\n", n);
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: '10', en: '10' } },
				{ id: 'b', text: { es: '15', en: '15' } },
				{ id: 'c', text: { es: '12', en: '12' } },
			],
			correct: 'b',
			explanation: {
				es: '`n` toma 5, 10 y 15. Con 10 la condición `n < 12` aún es verdadera; con 15 es falsa y se detiene, de modo que se imprime 15.',
				en: '`n` takes 5, 10 and 15. With 10 the condition `n < 12` is still true; with 15 it is false and stops, so 15 is printed.',
			},
		},
	],
};
