import type { PracticeSet } from './types';

// Practice and assessment for the "contar palabras" presentation
// (lesson `cadenas-de-caracteres-y-operaciones`): a two-state machine
// (fuera / dentro de una palabra) walked with indices.
const base = (texto: string, extra = '') => `#include <stdbool.h>
#include <stdio.h>

size_t contar_palabras(const char s[]) {
    size_t palabras = 0;
    bool dentro = false;

    for (size_t i = 0; s[i] != '\\0'; i++) {
        bool separador = s[i] == ' ' || s[i] == '\\t' || s[i] == '\\n';
        if (separador) {
            dentro = false;
        } else if (!dentro) {
            dentro = true;
            palabras++;
        }
    }
    return palabras;
}

int main(void) {
    printf("%zu\\n", contar_palabras("${texto}"));${extra}
    return 0;
}`;

const SIN_BANDERA = `#include <stdio.h>

int main(void) {
    const char s[] = "uno dos";
    int palabras = 0;
    for (size_t i = 0; s[i] != '\\0'; i++) {
        if (s[i] != ' ') {
            palabras++;
        }
    }
    printf("%d\\n", palabras);
    return 0;
}`;

const SEGUIDOS = `#include <stdio.h>

int main(void) {
    const char s[] = "a  b";
    int espacios = 0;
    int cambios = 0;
    bool previo_espacio = true;
    for (size_t i = 0; s[i] != '\\0'; i++) {
        bool es_espacio = s[i] == ' ';
        if (previo_espacio && !es_espacio) {
            cambios++;
        }
        if (es_espacio) {
            espacios++;
        }
        previo_espacio = es_espacio;
    }
    printf("%d %d\\n", cambios, espacios);
    return 0;
}`;

const SIN_RESET = `#include <stdbool.h>
#include <stdio.h>

int main(void) {
    const char s[] = "a b c";
    int palabras = 0;
    bool dentro = false;
    for (size_t i = 0; s[i] != '\\0'; i++) {
        if (s[i] == ' ') {
            /* falta: dentro = false; */
        } else if (!dentro) {
            dentro = true;
            palabras++;
        }
    }
    printf("%d\\n", palabras);
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Cuántas palabras cuenta con `"Hola mundo"`?', en: 'How many words does it count for `"Hola mundo"`?' },
			code: base('Hola mundo'),
			options: [
				{ id: 'a', text: { es: '`2`', en: '`2`' } },
				{ id: 'b', text: { es: '`1`', en: '`1`' } },
				{ id: 'c', text: { es: '`9`', en: '`9`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Cada paso de "fuera" a "dentro" suma una palabra: una al ver la `H` y otra al ver la `m`. Los espacios ponen `dentro` en `false`.',
				en: 'Each switch from "outside" to "inside" adds one word: one at the `H` and another at the `m`. Spaces set `dentro` to `false`.',
			},
		},
		{
			id: 'p2',
			prompt: { es: 'Con espacios repetidos, ¿cuántas palabras cuenta `"  a   b  "`?', en: 'With repeated spaces, how many words does `"  a   b  "` count?' },
			code: base('  a   b  '),
			options: [
				{ id: 'a', text: { es: '`2`', en: '`2`' } },
				{ id: 'b', text: { es: '`5`', en: '`5`' } },
				{ id: 'c', text: { es: '`4`', en: '`4`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Solo cuenta la transición de fuera a dentro. Varios espacios seguidos no producen transiciones nuevas, así que solo `a` y `b` suman.',
				en: 'Only the switch from outside to inside counts. Several spaces in a row produce no new switches, so only `a` and `b` add.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Qué estado tiene `dentro` justo después de procesar la `a` de `"a b"`?', en: 'What state does `dentro` hold right after processing the `a` in `"a b"`?' },
			options: [
				{ id: 'a', text: { es: '`true`: estamos dentro de una palabra', en: '`true`: we are inside a word' } },
				{ id: 'b', text: { es: '`false`: la palabra ya terminó', en: '`false`: the word already ended' } },
				{ id: 'c', text: { es: 'Sin valor: se inicializa más tarde', en: 'No value: it is initialized later' } },
			],
			correct: 'a',
			explanation: {
				es: 'Al ver `a`, `dentro` era `false` y no es separador: pasa a `true` y se suma la palabra. Seguirá en `true` hasta el siguiente espacio.',
				en: 'On seeing `a`, `dentro` was `false` and it is not a separator: it becomes `true` and the word is counted. It stays `true` until the next space.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Cuántas palabras cuenta una cadena vacía `""`?', en: 'How many words does an empty string `""` count?' },
			code: base(''),
			options: [
				{ id: 'a', text: { es: '`0`', en: '`0`' } },
				{ id: 'b', text: { es: '`1`', en: '`1`' } },
				{ id: 'c', text: { es: 'Error: el `for` no puede arrancar', en: 'Error: the `for` cannot start' } },
			],
			correct: 'a',
			explanation: {
				es: '`s[0]` ya es `\'\\0\'`, la condición del `for` es falsa desde el inicio y `palabras` queda en 0.',
				en: '`s[0]` is already `\'\\0\'`, the `for` condition is false from the start and `palabras` stays 0.',
			},
		},
		{
			id: 'p5',
			prompt: { es: '¿Y con un tabulador y un salto de línea como separadores en `"uno\\tdos\\ntres"`?', en: 'And with a tab and a newline as separators in `"uno\\tdos\\ntres"`?' },
			code: base('uno\\tdos\\ntres'),
			options: [
				{ id: 'a', text: { es: '`3`', en: '`3`' } },
				{ id: 'b', text: { es: '`1`', en: '`1`' } },
				{ id: 'c', text: { es: '`2`', en: '`2`' } },
			],
			correct: 'a',
			explanation: {
				es: '`separador` también es verdadero para `\'\\t\'` y `\'\\n\'`, así que hay tres palabras: `uno`, `dos` y `tres`.',
				en: '`separador` is also true for `\'\\t\'` and `\'\\n\'`, so there are three words: `uno`, `dos` and `tres`.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime este conteo sin la variable `dentro`?', en: 'What does this count print without the `dentro` variable?' },
			code: SIN_BANDERA,
			options: [
				{ id: 'a', text: { es: '`6`', en: '`6`' } },
				{ id: 'b', text: { es: '`2`', en: '`2`' } },
				{ id: 'c', text: { es: '`7`', en: '`7`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Sin recordar si ya estamos dentro, cuenta cada carácter que no es espacio: `uno dos` tiene 6. Por eso hace falta el estado `dentro`.',
				en: 'Without remembering whether we are already inside, it counts every non-space character: `uno dos` has 6. That is why the `dentro` state is needed.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Qué imprime? (transiciones y espacios)', en: 'What does it print? (switches and spaces)' },
			code: `#include <stdbool.h>\n${SEGUIDOS}`,
			options: [
				{ id: 'a', text: { es: '`2 2`', en: '`2 2`' } },
				{ id: 'b', text: { es: '`2 1`', en: '`2 1`' } },
				{ id: 'c', text: { es: '`1 2`', en: '`1 2`' } },
			],
			correct: 'a',
			explanation: {
				es: 'En `"a  b"` hay dos espacios seguidos (`espacios` = 2) pero solo dos transiciones de fuera a dentro (la `a` y la `b`).',
				en: 'In `"a  b"` there are two spaces in a row (`espacios` = 2) but only two switches from outside to inside (the `a` and the `b`).',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Qué imprime este programa al que le falta `dentro = false`?', en: 'What does this program print when `dentro = false` is missing?' },
			code: SIN_RESET,
			options: [
				{ id: 'a', text: { es: '`1`', en: '`1`' } },
				{ id: 'b', text: { es: '`3`', en: '`3`' } },
				{ id: 'c', text: { es: '`5`', en: '`5`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Sin volver a `false` en los espacios, `dentro` se queda en `true` tras la primera letra y nunca se cuentan más palabras: 1 en vez de 3.',
				en: 'Without going back to `false` on spaces, `dentro` stays `true` after the first letter and no more words are ever counted: 1 instead of 3.',
			},
		},
		{
			id: 'a4',
			prompt: { es: '¿Cuál es la condición de corte del recorrido de una cadena?', en: 'What is the stopping condition when walking a string?' },
			options: [
				{ id: 'a', text: { es: '`s[i] != \'\\0\'`: hasta el terminador', en: '`s[i] != \'\\0\'`: up to the terminator' } },
				{ id: 'b', text: { es: '`i < 10`: un número fijo de vueltas', en: '`i < 10`: a fixed number of iterations' } },
				{ id: 'c', text: { es: '`s[i] != \' \'`: hasta el primer espacio', en: '`s[i] != \' \'`: up to the first space' } },
			],
			correct: 'a',
			explanation: {
				es: 'El `\'\\0\'` marca el final del texto, así que la función no necesita recibir la cantidad de caracteres.',
				en: 'The `\'\\0\'` marks the end of the text, so the function does not need to be given the number of characters.',
			},
		},
		{
			id: 'a5',
			prompt: { es: '¿Cuántas palabras cuenta `"Hola, mundo  feliz."`?', en: 'How many words does it count for `"Hola, mundo  feliz."`?' },
			code: base('Hola, mundo  feliz.'),
			options: [
				{ id: 'a', text: { es: '`3`', en: '`3`' } },
				{ id: 'b', text: { es: '`5`', en: '`5`' } },
				{ id: 'c', text: { es: '`4`', en: '`4`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Solo espacio, tabulador y salto de línea separan. La coma y el punto pertenecen a la palabra: `Hola,`, `mundo` y `feliz.`.',
				en: 'Only space, tab and newline separate. The comma and the period belong to the word: `Hola,`, `mundo` and `feliz.`.',
			},
		},
	],
};
