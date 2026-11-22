import type { PracticeSet } from './types';

// Practice and assessment for the "strchr paso a paso" presentation
// (lesson `cadenas-de-caracteres-y-operaciones`). Before pointers: strchr is
// only used as `strchr(s, c) != NULL`, positions come from index helpers and
// `strcspn`.
const POSICION = `#include <stdio.h>

size_t posicion_de(const char s[], char c) {
    size_t i = 0;
    while (s[i] != '\\0' && s[i] != c) {
        i++;
    }
    return i;
}

int main(void) {
    printf("%zu\\n", posicion_de("Programacion", 'g'));
    return 0;
}`;

const AUSENTE = `#include <stdio.h>

size_t posicion_de(const char s[], char c) {
    size_t i = 0;
    while (s[i] != '\\0' && s[i] != c) {
        i++;
    }
    return i;
}

int main(void) {
    printf("%zu\\n", posicion_de("Java", 'z'));
    return 0;
}`;

const EXISTE = `#include <stdio.h>
#include <string.h>

int main(void) {
    char correo[] = "ana.ejemplo.com";
    if (strchr(correo, '@') != NULL) {
        printf("valido\\n");
    } else {
        printf("sin arroba\\n");
    }
    return 0;
}`;

const CSPN = `#include <stdio.h>
#include <string.h>

int main(void) {
    char correo[] = "ana@ejemplo.com";
    printf("%zu %zu\\n", strcspn(correo, "@"), strcspn(correo, "#"));
    return 0;
}`;

const PRIMERA = `#include <stdio.h>
#include <string.h>

int main(void) {
    char t[] = "banana";
    printf("%zu\\n", strcspn(t, "n"));
    return 0;
}`;

const ASIGNACION = `#include <stdio.h>
#include <string.h>

int main(void) {
    char t[] = "casa";
    if (strchr(t, 's') = NULL) {
        printf("no esta\\n");
    }
    return 0;
}`;

const MAYUSCULA = `#include <stdio.h>
#include <string.h>

int main(void) {
    char t[] = "Hola";
    printf("%d %d\\n", strchr(t, 'h') != NULL, strchr(t, 'H') != NULL);
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: {
				es: '¿Qué posición devuelve la búsqueda de `\'g\'` en `"Programacion"`?',
				en: 'What position does the search for `\'g\'` in `"Programacion"` return?',
			},
			code: POSICION,
			options: [
				{ id: 'a', text: { es: '`3`', en: '`3`' } },
				{ id: 'b', text: { es: '`4`', en: '`4`' } },
				{ id: 'c', text: { es: '`12`', en: '`12`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Los índices empiezan en 0: P(0) r(1) o(2) g(3). El recorrido se detiene en la primera `g`, en el índice 3.',
				en: 'Indices start at 0: P(0) r(1) o(2) g(3). The loop stops at the first `g`, at index 3.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Qué imprime cuando el carácter no está?', en: 'What does it print when the character is not there?' },
			code: AUSENTE,
			options: [
				{ id: 'a', text: { es: '`4`', en: '`4`' } },
				{ id: 'b', text: { es: '`0`', en: '`0`' } },
				{ id: 'c', text: { es: '`-1`', en: '`-1`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Si `c` no aparece, el recorrido llega al `\'\\0\'` y `i` vale la longitud de la cadena (4). Aquí no se usa `-1`: hay que comprobar `s[i] == \'\\0\'`.',
				en: 'If `c` does not appear, the loop reaches the `\'\\0\'` and `i` equals the length of the string (4). `-1` is not used here: you must check `s[i] == \'\\0\'`.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: EXISTE,
			options: [
				{ id: 'a', text: { es: '`sin arroba`', en: '`sin arroba`' } },
				{ id: 'b', text: { es: '`valido`', en: '`valido`' } },
				{ id: 'c', text: { es: 'Nada', en: 'Nothing' } },
			],
			correct: 'a',
			explanation: {
				es: '`strchr` devuelve `NULL` cuando el carácter no está, así que `strchr(correo, \'@\') != NULL` es falso y corre el `else`.',
				en: '`strchr` returns `NULL` when the character is absent, so `strchr(correo, \'@\') != NULL` is false and the `else` runs.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Qué imprime `strcspn`?', en: 'What does `strcspn` print?' },
			code: CSPN,
			options: [
				{ id: 'a', text: { es: '`3 15`', en: '`3 15`' } },
				{ id: 'b', text: { es: '`4 0`', en: '`4 0`' } },
				{ id: 'c', text: { es: '`3 0`', en: '`3 0`' } },
			],
			correct: 'a',
			explanation: {
				es: '`strcspn` devuelve la posición del primer carácter buscado (el `@` está en el índice 3) o, si no aparece, la longitud de la cadena (15).',
				en: '`strcspn` returns the position of the first searched character (the `@` is at index 3) or, if it does not appear, the length of the string (15).',
			},
		},
		{
			id: 'p5',
			prompt: { es: '¿Qué posición devuelve `strcspn` para `"n"` en `"banana"`?', en: 'What position does `strcspn` return for `"n"` in `"banana"`?' },
			code: PRIMERA,
			options: [
				{ id: 'a', text: { es: '`2`', en: '`2`' } },
				{ id: 'b', text: { es: '`4`', en: '`4`' } },
				{ id: 'c', text: { es: '`3`', en: '`3`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Solo importa la primera aparición: b(0) a(1) n(2). Las otras `n` no se consultan.',
				en: 'Only the first occurrence matters: b(0) a(1) n(2). The other `n` are not looked at.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime? (distingue mayúsculas)', en: 'What does it print? (case matters)' },
			code: MAYUSCULA,
			options: [
				{ id: 'a', text: { es: '`0 1`', en: '`0 1`' } },
				{ id: 'b', text: { es: '`1 1`', en: '`1 1`' } },
				{ id: 'c', text: { es: '`1 0`', en: '`1 0`' } },
			],
			correct: 'a',
			explanation: {
				es: '`\'h\'` y `\'H\'` tienen códigos distintos. En `"Hola"` no hay `h` minúscula (0) pero sí `H` (1).',
				en: '`\'h\'` and `\'H\'` have different codes. `"Hola"` has no lowercase `h` (0) but has `H` (1).',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: `#include <stdio.h>
#include <string.h>

int main(void) {
    char t[] = "ab";
    printf("%zu\\n", strcspn(t, "xyz"));
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: '`2`', en: '`2`' } },
				{ id: 'b', text: { es: '`0`', en: '`0`' } },
				{ id: 'c', text: { es: '`3`', en: '`3`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Ninguna de las letras de `"xyz"` aparece en `"ab"`, así que `strcspn` devuelve la longitud de la cadena: 2.',
				en: 'None of the letters of `"xyz"` appear in `"ab"`, so `strcspn` returns the length of the string: 2.',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Qué error tiene este programa?', en: 'What error does this program have?' },
			code: `/* c-check: skip */\n${ASIGNACION}`,
			options: [
				{ id: 'a', text: { es: 'Usa `=` (asignación) en lugar de `!=` o `==`', en: 'It uses `=` (assignment) instead of `!=` or `==`' } },
				{ id: 'b', text: { es: 'Falta `#include <stdlib.h>`', en: 'Missing `#include <stdlib.h>`' } },
				{ id: 'c', text: { es: '`strchr` no acepta un `char[]`', en: '`strchr` does not accept a `char[]`' } },
			],
			correct: 'a',
			explanation: {
				es: '`strchr(t, \'s\') = NULL` intenta asignar al resultado de la función y no compila. La pregunta correcta es `strchr(t, \'s\') == NULL` (o `!= NULL`).',
				en: '`strchr(t, \'s\') = NULL` tries to assign to the function result and does not compile. The right test is `strchr(t, \'s\') == NULL` (or `!= NULL`).',
			},
		},
		{
			id: 'a4',
			prompt: {
				es: 'Según el deck, ¿qué devuelve `strchr` en C y qué devuelven `indexOf` en Java y JavaScript?',
				en: 'According to the deck, what does `strchr` return in C and what do `indexOf` in Java and JavaScript return?',
			},
			options: [
				{ id: 'a', text: { es: 'C: ubicación o `NULL`; Java/JS: índice o `-1`', en: 'C: a location or `NULL`; Java/JS: index or `-1`' } },
				{ id: 'b', text: { es: 'Todos devuelven un índice o `-1`', en: 'All of them return an index or `-1`' } },
				{ id: 'c', text: { es: 'C: `-1`; Java/JS: `NULL`', en: 'C: `-1`; Java/JS: `NULL`' } },
			],
			correct: 'a',
			explanation: {
				es: '`strchr` no devuelve un índice sino la ubicación dentro del arreglo (algo que verás con punteros) o `NULL`; `indexOf` devuelve el índice entero o `-1`.',
				en: '`strchr` does not return an index but a location inside the array (something you will see with pointers) or `NULL`; `indexOf` returns the integer index or `-1`.',
			},
		},
		{
			id: 'a5',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: `#include <stdio.h>

size_t posicion_de(const char s[], char c) {
    size_t i = 0;
    while (s[i] != '\\0' && s[i] != c) {
        i++;
    }
    return i;
}

int main(void) {
    char t[] = "a,b,c";
    size_t pos = posicion_de(t, ',');
    printf("%zu %c\\n", pos, t[pos + 1]);
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: '`1 b`', en: '`1 b`' } },
				{ id: 'b', text: { es: '`1 ,`', en: '`1 ,`' } },
				{ id: 'c', text: { es: '`2 b`', en: '`2 b`' } },
			],
			correct: 'a',
			explanation: {
				es: 'La primera coma está en el índice 1; `t[pos + 1]` es el carácter siguiente, `b`.',
				en: 'The first comma is at index 1; `t[pos + 1]` is the next character, `b`.',
			},
		},
	],
};
