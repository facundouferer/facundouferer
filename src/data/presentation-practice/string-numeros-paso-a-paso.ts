import type { PracticeSet } from './types';

// Practice and assessment for the "string y números paso a paso" presentation
// (lesson `cadenas-de-caracteres-y-operaciones`).
const SUMA = `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char a[] = "12";
    char b[] = "30";
    printf("%d\\n", atoi(a) + atoi(b));
    return 0;
}`;

const UNIR = `#include <stdio.h>

int main(void) {
    char a[] = "12";
    char b[] = "30";
    char unidos[8];
    snprintf(unidos, sizeof unidos, "%s%s", a, b);
    printf("%s\\n", unidos);
    return 0;
}`;

const BASURA = `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    printf("%d\\n", atoi("123abc"));
    return 0;
}`;

const HOLA = `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = atoi("hola");
    printf("%d\\n", n);
    return 0;
}`;

const A_TEXTO = `#include <stdio.h>
#include <string.h>

int main(void) {
    char texto[12];
    snprintf(texto, sizeof texto, "%d", 4096);
    printf("%s %zu\\n", texto, strlen(texto));
    return 0;
}`;

const CORTA = `#include <stdio.h>

int main(void) {
    char texto[4];
    int escritos = snprintf(texto, sizeof texto, "%d", 123456);
    printf("%s %d\\n", texto, escritos);
    return 0;
}`;

const MANUAL = `#include <stdio.h>

int main(void) {
    char s[] = "407";
    int valor = 0;
    for (size_t i = 0; s[i] != '\\0'; i++) {
        valor = valor * 10 + (s[i] - '0');
    }
    printf("%d\\n", valor);
    return 0;
}`;

const SPRINTF = `/* c-check: skip */
#include <stdio.h>

int main(void) {
    char texto[3];
    sprintf(texto, "%d", 123456);
    printf("%s\\n", texto);
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime? (se suman los valores)', en: 'What does it print? (the values are added)' },
			code: SUMA,
			options: [
				{ id: 'a', text: { es: '`42`', en: '`42`' } },
				{ id: 'b', text: { es: '`1230`', en: '`1230`' } },
				{ id: 'c', text: { es: '`12 30`', en: '`12 30`' } },
			],
			correct: 'a',
			explanation: {
				es: '`atoi` convierte cada texto en un `int` (12 y 30) y el `+` suma números: 42.',
				en: '`atoi` converts each text into an `int` (12 and 30) and `+` adds numbers: 42.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Qué imprime? (se unen los textos)', en: 'What does it print? (the texts are joined)' },
			code: UNIR,
			options: [
				{ id: 'a', text: { es: '`42`', en: '`42`' } },
				{ id: 'b', text: { es: '`1230`', en: '`1230`' } },
				{ id: 'c', text: { es: '`12+30`', en: '`12+30`' } },
			],
			correct: 'b',
			explanation: {
				es: '`snprintf` con `"%s%s"` junta los dos textos tal cual: `"12"` y `"30"` forman `"1230"`. No hay conversión a número.',
				en: '`snprintf` with `"%s%s"` joins the two texts as they are: `"12"` and `"30"` make `"1230"`. There is no conversion to a number.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Qué imprime `atoi("123abc")`?', en: 'What does `atoi("123abc")` print?' },
			code: BASURA,
			options: [
				{ id: 'a', text: { es: '`123`', en: '`123`' } },
				{ id: 'b', text: { es: '`0`', en: '`0`' } },
				{ id: 'c', text: { es: 'Un error en ejecución', en: 'A runtime error' } },
			],
			correct: 'a',
			explanation: {
				es: '`atoi` lee los dígitos del comienzo y se detiene en la primera letra, sin avisar del resto: devuelve 123.',
				en: '`atoi` reads the leading digits and stops at the first letter, without reporting the rest: it returns 123.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Qué imprime `atoi("hola")`?', en: 'What does `atoi("hola")` print?' },
			code: HOLA,
			options: [
				{ id: 'a', text: { es: '`0`', en: '`0`' } },
				{ id: 'b', text: { es: '`-1`', en: '`-1`' } },
				{ id: 'c', text: { es: 'No compila', en: 'It does not compile' } },
			],
			correct: 'a',
			explanation: {
				es: 'Sin dígitos que leer, `atoi` devuelve 0. Es el mismo resultado que `atoi("0")`, por eso no distingue el error de un cero real.',
				en: 'With no digits to read, `atoi` returns 0. That is the same result as `atoi("0")`, so it cannot tell an error from a real zero.',
			},
		},
		{
			id: 'p5',
			prompt: { es: '¿Qué imprime (texto y longitud)?', en: 'What does it print (text and length)?' },
			code: A_TEXTO,
			options: [
				{ id: 'a', text: { es: '`4096 4`', en: '`4096 4`' } },
				{ id: 'b', text: { es: '`4096 5`', en: '`4096 5`' } },
				{ id: 'c', text: { es: '`4096 12`', en: '`4096 12`' } },
			],
			correct: 'a',
			explanation: {
				es: '`%d` escribe los cuatro dígitos como caracteres. `strlen` cuenta 4; los 12 son la capacidad del arreglo, no la longitud.',
				en: '`%d` writes the four digits as characters. `strlen` counts 4; the 12 is the capacity of the array, not the length.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: MANUAL,
			options: [
				{ id: 'a', text: { es: '`407`', en: '`407`' } },
				{ id: 'b', text: { es: '`11`', en: '`11`' } },
				{ id: 'c', text: { es: '`4070`', en: '`4070`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Cada vuelta multiplica lo acumulado por 10 y suma el dígito (`s[i] - \'0\'`): 4, luego 40 + 0, luego 400 + 7 = 407.',
				en: 'Each iteration multiplies the accumulated value by 10 and adds the digit (`s[i] - \'0\'`): 4, then 40 + 0, then 400 + 7 = 407.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Qué imprime (texto y valor devuelto)?', en: 'What does it print (text and returned value)?' },
			code: CORTA,
			options: [
				{ id: 'a', text: { es: '`123 6`', en: '`123 6`' } },
				{ id: 'b', text: { es: '`123 3`', en: '`123 3`' } },
				{ id: 'c', text: { es: '`123456 6`', en: '`123456 6`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Con capacidad 4 caben 3 dígitos y el `\'\\0\'`. `snprintf` trunca a `123`, pero devuelve cuántos caracteres habría escrito: 6, mayor o igual que la capacidad, señal de truncamiento.',
				en: 'With capacity 4, 3 digits and the `\'\\0\'` fit. `snprintf` truncates to `123` but returns how many characters it would have written: 6, greater than or equal to the capacity, a sign of truncation.',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Qué problema tiene este programa?', en: 'What is wrong with this program?' },
			code: SPRINTF,
			options: [
				{ id: 'a', text: { es: '`sprintf` no recibe la capacidad: desborda el arreglo', en: '`sprintf` takes no capacity: it overflows the array' } },
				{ id: 'b', text: { es: '`%d` no puede escribir en un `char[]`', en: '`%d` cannot write into a `char[]`' } },
				{ id: 'c', text: { es: 'Ninguno: imprime `12`', en: 'None: it prints `12`' } },
			],
			correct: 'a',
			explanation: {
				es: '`sprintf` escribe los 6 dígitos y el terminador en un arreglo de 3: desbordamiento. La alternativa es `snprintf` con `sizeof texto`.',
				en: '`sprintf` writes 6 digits and the terminator into an array of 3: an overflow. The alternative is `snprintf` with `sizeof texto`.',
			},
		},
		{
			id: 'a4',
			prompt: {
				es: '¿Por qué `atoi` no sirve cuando el texto viene del usuario?',
				en: 'Why is `atoi` a poor fit when the text comes from the user?',
			},
			options: [
				{ id: 'a', text: { es: 'No informa errores: `"hola"` y `"0"` dan lo mismo', en: 'It reports no errors: `"hola"` and `"0"` give the same result' } },
				{ id: 'b', text: { es: 'Solo convierte números de un dígito', en: 'It only converts one-digit numbers' } },
				{ id: 'c', text: { es: 'Modifica la cadena original', en: 'It modifies the original string' } },
			],
			correct: 'a',
			explanation: {
				es: 'Ese es su límite: devuelve 0 para texto inválido y es indefinido si el número no cabe. `strtol` (lección de la biblioteca estándar) sí detecta esos casos.',
				en: 'That is its limit: it returns 0 for invalid text and is undefined if the number does not fit. `strtol` (standard library lesson) does detect those cases.',
			},
		},
		{
			id: 'a5',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    printf("%d\\n", atoi("  58 años"));
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: '`58`', en: '`58`' } },
				{ id: 'b', text: { es: '`0`', en: '`0`' } },
				{ id: 'c', text: { es: '`5`', en: '`5`' } },
			],
			correct: 'a',
			explanation: {
				es: '`atoi` ignora los espacios iniciales, lee los dígitos `58` y se detiene en la primera letra.',
				en: '`atoi` skips leading whitespace, reads the digits `58` and stops at the first letter.',
			},
		},
	],
};
