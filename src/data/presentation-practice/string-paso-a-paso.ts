import type { PracticeSet } from './types';

// Practice and assessment for the "string paso a paso" presentation
// (lesson `cadenas-de-caracteres-y-operaciones`).
const CAPACIDAD = `#include <stdio.h>
#include <string.h>

int main(void) {
    char saludo[10] = "Hola";
    printf("%zu %zu\\n", sizeof saludo, strlen(saludo));
    return 0;
}`;

const MODIFICAR = `#include <stdio.h>

int main(void) {
    char saludo[] = "Hola";
    saludo[0] = 'h';
    saludo[2] = 'L';
    printf("%s\\n", saludo);
    return 0;
}`;

const CORTAR = `#include <stdio.h>

int main(void) {
    char palabra[] = "cadena";
    palabra[3] = '\\0';
    printf("%s\\n", palabra);
    return 0;
}`;

const MAYUS = `#include <stdio.h>

int main(void) {
    char s[] = "Ok 7";
    for (size_t i = 0; s[i] != '\\0'; i++) {
        if (s[i] >= 'a' && s[i] <= 'z') {
            s[i] = s[i] - 'a' + 'A';
        }
    }
    printf("%s\\n", s);
    return 0;
}`;

const ASIGNA = `/* c-check: skip */
#include <stdio.h>

int main(void) {
    char nombre[10] = "Ana";
    nombre = "Eva";
    printf("%s\n", nombre);
    return 0;
}`;

const SIN_TERMINADOR = `/* c-check: skip */
#include <stdio.h>

int main(void) {
    char sigla[3] = {'C', 'o', 'D'};
    printf("%s\\n", sigla);
    return 0;
}`;

const LONGITUD = `#include <stdio.h>
#include <string.h>

int main(void) {
    char t[] = "ab\\0cd";
    printf("%zu %zu\\n", sizeof t, strlen(t));
    return 0;
}`;

const CUENTA = `#include <stdio.h>

size_t longitud(const char s[]) {
    size_t n = 0;
    while (s[n] != '\\0') {
        n++;
    }
    return n;
}

int main(void) {
    printf("%zu\\n", longitud("C es facil"));
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: {
				es: '¿Qué imprime este programa (capacidad y longitud)?',
				en: 'What does this program print (capacity and length)?',
			},
			code: CAPACIDAD,
			options: [
				{ id: 'a', text: { es: '`10 4`', en: '`10 4`' } },
				{ id: 'b', text: { es: '`4 10`', en: '`4 10`' } },
				{ id: 'c', text: { es: '`10 10`', en: '`10 10`' } },
			],
			correct: 'a',
			explanation: {
				es: '`sizeof saludo` es la capacidad del arreglo (10) y `strlen` cuenta los caracteres antes del `\'\\0\'` (4: "Hola"). Son dos números distintos.',
				en: '`sizeof saludo` is the capacity of the array (10) and `strlen` counts the characters before the `\'\\0\'` (4: "Hola"). They are two different numbers.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Qué imprime después de modificar dos letras?', en: 'What does it print after changing two letters?' },
			code: MODIFICAR,
			options: [
				{ id: 'a', text: { es: '`hoLa`', en: '`hoLa`' } },
				{ id: 'b', text: { es: '`Hola`', en: '`Hola`' } },
				{ id: 'c', text: { es: '`HoLa`', en: '`HoLa`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Una cadena declarada como `char saludo[]` es un arreglo mutable: `saludo[0]` pasa a `h` y `saludo[2]` a `L`, y el resto queda igual.',
				en: 'A string declared as `char saludo[]` is a mutable array: `saludo[0]` becomes `h` and `saludo[2]` becomes `L`, and the rest stays the same.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Qué imprime si se escribe `\'\\0\'` en la posición 3?', en: 'What does it print if `\'\\0\'` is written at position 3?' },
			code: CORTAR,
			options: [
				{ id: 'a', text: { es: '`cad`', en: '`cad`' } },
				{ id: 'b', text: { es: '`cadena`', en: '`cadena`' } },
				{ id: 'c', text: { es: '`cadna`', en: '`cadna`' } },
			],
			correct: 'a',
			explanation: {
				es: '`printf` con `%s` avanza hasta el primer `\'\\0\'`. Al escribir uno en el índice 3, el texto termina ahí aunque el arreglo siga teniendo las demás letras.',
				en: '`printf` with `%s` advances until the first `\'\\0\'`. Writing one at index 3 ends the text there even though the array still holds the other letters.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Qué imprime este recorrido hasta el terminador?', en: 'What does this loop up to the terminator print?' },
			code: MAYUS,
			options: [
				{ id: 'a', text: { es: '`OK 7`', en: '`OK 7`' } },
				{ id: 'b', text: { es: '`OK`', en: '`OK`' } },
				{ id: 'c', text: { es: '`Ok 7`', en: '`Ok 7`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Solo las letras entre `\'a\'` y `\'z\'` se convierten: `k` pasa a `K`. La `O`, el espacio y el `7` no cumplen la condición y quedan igual.',
				en: 'Only letters between `\'a\'` and `\'z\'` are converted: `k` becomes `K`. The `O`, the space and the `7` fail the condition and stay the same.',
			},
		},
		{
			id: 'p5',
			prompt: {
				es: '¿Qué diferencia hay entre `"A"` y `\'A\'`?',
				en: 'What is the difference between `"A"` and `\'A\'`?',
			},
			options: [
				{ id: 'a', text: { es: '`"A"`: 2 (con `\'\\0\'`); `\'A\'` es un solo carácter', en: '`"A"`: 2 (with `\'\\0\'`); `\'A\'` is a single character' } },
				{ id: 'b', text: { es: '`"A"`: 1; `\'A\'`: 2', en: '`"A"`: 1; `\'A\'`: 2' } },
				{ id: 'c', text: { es: 'Los dos ocupan 1', en: 'Both take 1' } },
			],
			correct: 'a',
			explanation: {
				es: '`"A"` es una cadena: un arreglo de dos `char`, `\'A\'` y `\'\\0\'`. `\'A\'` es un único carácter.',
				en: '`"A"` is a string: an array of two `char`, `\'A\'` and `\'\\0\'`. `\'A\'` is a single character.',
			},
		},
		{
			id: 'p6',
			prompt: {
				es: 'Para guardar la cadena `"Hola"` (4 letras), ¿qué capacidad mínima necesita el arreglo?',
				en: 'To store the string `"Hola"` (4 letters), what minimum capacity does the array need?',
			},
			options: [
				{ id: 'a', text: { es: '4', en: '4' } },
				{ id: 'b', text: { es: '5', en: '5' } },
				{ id: 'c', text: { es: '3', en: '3' } },
			],
			correct: 'b',
			explanation: {
				es: 'Una cadena de longitud `L` necesita capacidad `L + 1`: las 4 letras más el terminador `\'\\0\'`.',
				en: 'A string of length `L` needs capacity `L + 1`: the 4 letters plus the `\'\\0\'` terminator.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: LONGITUD,
			options: [
				{ id: 'a', text: { es: '`6 2`', en: '`6 2`' } },
				{ id: 'b', text: { es: '`5 5`', en: '`5 5`' } },
				{ id: 'c', text: { es: '`6 5`', en: '`6 5`' } },
				{ id: 'd', text: { es: '`5 2`', en: '`5 2`' } },
			],
			correct: 'a',
			explanation: {
				es: 'El arreglo tiene 6 elementos (`a`, `b`, `\'\\0\'`, `c`, `d` y el terminador final), pero `strlen` se detiene en el primer `\'\\0\'`: longitud 2.',
				en: 'The array has 6 elements (`a`, `b`, `\'\\0\'`, `c`, `d` and the final terminator), but `strlen` stops at the first `\'\\0\'`: length 2.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: CUENTA,
			options: [
				{ id: 'a', text: { es: '`10`', en: '`10`' } },
				{ id: 'b', text: { es: '`11`', en: '`11`' } },
				{ id: 'c', text: { es: '`9`', en: '`9`' } },
			],
			correct: 'a',
			explanation: {
				es: '`"C es facil"` tiene 10 caracteres (los espacios cuentan) y el recorrido corta en el `\'\\0\'` sin contarlo.',
				en: '`"C es facil"` has 10 characters (spaces count) and the loop stops at the `\'\\0\'` without counting it.',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Qué problema tiene este programa?', en: 'What is wrong with this program?' },
			code: SIN_TERMINADOR,
			options: [
				{ id: 'a', text: { es: 'No hay `\'\\0\'`: `%s` seguiría leyendo más allá del arreglo', en: 'There is no `\'\\0\'`: `%s` would keep reading past the array' } },
				{ id: 'b', text: { es: 'No compila: faltan las comillas dobles', en: 'It does not compile: double quotes are missing' } },
				{ id: 'c', text: { es: 'Imprime `CoD` sin problema', en: 'It prints `CoD` with no problem' } },
			],
			correct: 'a',
			explanation: {
				es: 'Los tres `char` llenan el arreglo y no queda lugar para el terminador. Sin `\'\\0\'` no es una cadena y `printf` no sabe dónde detenerse: comportamiento indefinido.',
				en: 'The three `char` fill the array and leave no room for the terminator. Without `\'\\0\'` it is not a string and `printf` does not know where to stop: undefined behavior.',
			},
		},
		{
			id: 'a4',
			prompt: { es: '¿Qué ocurre al compilar este programa?', en: 'What happens when this program is compiled?' },
			code: ASIGNA,
			options: [
				{ id: 'a', text: { es: 'Error: un arreglo no se asigna con `=`', en: 'Error: an array cannot be assigned with `=`' } },
				{ id: 'b', text: { es: 'Compila e imprime `Eva`', en: 'It compiles and prints `Eva`' } },
				{ id: 'c', text: { es: 'Compila e imprime `Ana`', en: 'It compiles and prints `Ana`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Una cadena es un arreglo y los arreglos no se asignan con `=`. Para cambiar el contenido hay que copiarlo (por ejemplo con `snprintf` o `strcpy` con cuidado) o modificar sus letras una por una.',
				en: 'A string is an array and arrays cannot be assigned with `=`. To change the content you must copy it (for example with `snprintf` or `strcpy` with care) or modify its letters one by one.',
			},
		},
		{
			id: 'a5',
			prompt: {
				es: 'En el deck, ¿qué diferencia clave hay entre una cadena de C y un `String` de Java?',
				en: 'In the deck, what key difference is there between a C string and a Java `String`?',
			},
			options: [
				{ id: 'a', text: { es: 'C: arreglo de `char` terminado en `\'\\0\'`; Java: objeto inmutable con longitud', en: 'C: `char` array ending in `\'\\0\'`; Java: immutable object with a length' } },
				{ id: 'b', text: { es: 'C guarda la longitud al inicio; Java usa `\'\\0\'`', en: 'C stores the length at the start; Java uses `\'\\0\'`' } },
				{ id: 'c', text: { es: 'No hay diferencia en la representación', en: 'There is no difference in representation' } },
			],
			correct: 'a',
			explanation: {
				es: 'En C el texto termina donde está el `\'\\0\'` y se puede modificar letra por letra. En Java el `String` es inmutable y conoce su longitud.',
				en: 'In C the text ends where the `\'\\0\'` is and can be modified letter by letter. In Java the `String` is immutable and knows its length.',
			},
		},
	],
};
