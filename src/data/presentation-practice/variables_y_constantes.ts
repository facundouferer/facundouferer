import type { PracticeSet } from './types';

// Practice and assessment for the "variables y constantes" presentation
// (lesson `variables-y-constantes`).
const SUMA = `#include <stdio.h>

int main(void) {
    int x = 5;
    x = x + 3;
    x = x * 2;
    printf("%d\\n", x);
    return 0;
}`;

const COPIA = `#include <stdio.h>

int main(void) {
    int a = 10;
    int b = 20;
    a = b;
    b = a + 1;
    printf("%d %d\\n", a, b);
    return 0;
}`;

const CONSTANTE = `/* c-check: skip */
#include <stdio.h>

int main(void) {
    const int MAX = 3;
    MAX = 4;
    printf("%d\\n", MAX);
    return 0;
}`;

const CARACTER = `#include <stdio.h>

int main(void) {
    char c = 'A';
    c = c + 2;
    printf("%c\\n", c);
    return 0;
}`;

const DEFINE = `#include <stdio.h>
#define N 5

int main(void) {
    printf("%d\\n", N * 2);
    return 0;
}`;

const EDAD = `#include <stdio.h>

int main(void) {
    int edad = 20;
    edad = edad + 1;
    printf("%d\\n", edad);
    return 0;
}`;

const SIN_INICIAR = `#include <stdio.h>

int main(void) {
    int total;
    total = total + 1;
    printf("%d\\n", total);
    return 0;
}`;

const LIMITE = `#include <stdio.h>

int main(void) {
    const int LIMITE = 5;
    int y = LIMITE + 1;
    printf("%d\\n", y);
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: SUMA,
			options: [
				{ id: 'a', text: { es: '`8`', en: '`8`' } },
				{ id: 'b', text: { es: '`16`', en: '`16`' } },
				{ id: 'c', text: { es: '`13`', en: '`13`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Cada asignación usa el valor actual de `x` y lo reemplaza: 5, luego 5 + 3 = 8, luego 8 * 2 = 16.',
				en: 'Each assignment uses the current value of `x` and replaces it: 5, then 5 + 3 = 8, then 8 * 2 = 16.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Qué valores imprime `a` y `b`?', en: 'What values do `a` and `b` print?' },
			code: COPIA,
			options: [
				{ id: 'a', text: { es: '`10 20`', en: '`10 20`' } },
				{ id: 'b', text: { es: '`20 20`', en: '`20 20`' } },
				{ id: 'c', text: { es: '`20 21`', en: '`20 21`' } },
			],
			correct: 'c',
			explanation: {
				es: '`a = b` copia 20 dentro de `a`. Después `b = a + 1` ya ve el nuevo valor de `a`, así que `b` vale 21.',
				en: '`a = b` copies 20 into `a`. Then `b = a + 1` already sees the new value of `a`, so `b` is 21.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Qué ocurre al compilar este programa?', en: 'What happens when this program is compiled?' },
			code: CONSTANTE,
			options: [
				{ id: 'a', text: { es: 'Imprime `4`', en: 'It prints `4`' } },
				{ id: 'b', text: { es: 'Imprime `3`', en: 'It prints `3`' } },
				{ id: 'c', text: { es: 'Error: no se puede asignar a una constante `const`', en: 'Error: a `const` constant cannot be assigned to' } },
			],
			correct: 'c',
			explanation: {
				es: 'Una variable `const` solo recibe valor al declararla. Asignarle después (`MAX = 4`) es un error de compilación.',
				en: 'A `const` variable only gets its value at declaration. Assigning to it later (`MAX = 4`) is a compile error.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Qué carácter imprime?', en: 'What character does it print?' },
			code: CARACTER,
			options: [
				{ id: 'a', text: { es: '`A`', en: '`A`' } },
				{ id: 'b', text: { es: '`C`', en: '`C`' } },
				{ id: 'c', text: { es: '`67`', en: '`67`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Un `char` guarda un número: `\'A\'` es 65 y `c + 2` es 67, que `%c` muestra como `C`. Con `%d` se vería `67`.',
				en: 'A `char` stores a number: `\'A\'` is 65 and `c + 2` is 67, which `%c` shows as `C`. With `%d` you would see `67`.',
			},
		},
		{
			id: 'p5',
			prompt: { es: '¿Qué imprime este programa que usa `#define`?', en: 'What does this program that uses `#define` print?' },
			code: DEFINE,
			options: [
				{ id: 'a', text: { es: '`10`', en: '`10`' } },
				{ id: 'b', text: { es: '`N * 2`', en: '`N * 2`' } },
				{ id: 'c', text: { es: '`52`', en: '`52`' } },
			],
			correct: 'a',
			explanation: {
				es: 'El preprocesador reemplaza `N` por `5` antes de compilar, y la línea queda `printf("%d\\n", 5 * 2)`: imprime 10.',
				en: 'The preprocessor replaces `N` with `5` before compiling, and the line becomes `printf("%d\\n", 5 * 2)`: it prints 10.',
			},
		},
		{
			id: 'p6',
			prompt: {
				es: 'Una variable local `int total;` se declara sin valor inicial. ¿Qué contiene justo después?',
				en: 'A local variable `int total;` is declared with no initial value. What does it hold right after?',
			},
			options: [
				{ id: 'a', text: { es: 'Siempre 0', en: 'Always 0' } },
				{ id: 'b', text: { es: 'Un valor basura impredecible', en: 'An unpredictable garbage value' } },
				{ id: 'c', text: { es: 'Nada: no se puede declarar sin valor', en: 'Nothing: it cannot be declared without a value' } },
			],
			correct: 'b',
			explanation: {
				es: 'C no inicializa las variables locales: conservan lo que había en esa memoria. Por eso conviene asignarles un valor al declararlas.',
				en: 'C does not initialize local variables: they keep whatever was in that memory. That is why you should give them a value when declaring them.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: EDAD,
			options: [
				{ id: 'a', text: { es: '`20`', en: '`20`' } },
				{ id: 'b', text: { es: '`21`', en: '`21`' } },
				{ id: 'c', text: { es: '`edad + 1`', en: '`edad + 1`' } },
			],
			correct: 'b',
			explanation: {
				es: 'La asignación evalúa `edad + 1` con el valor actual (20) y guarda 21 en `edad`.',
				en: 'The assignment evaluates `edad + 1` with the current value (20) and stores 21 in `edad`.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Cuál es un nombre de variable válido en C?', en: 'Which is a valid variable name in C?' },
			options: [
				{ id: 'a', text: { es: '`2cosas`', en: '`2cosas`' } },
				{ id: 'b', text: { es: '`total_final`', en: '`total_final`' } },
				{ id: 'c', text: { es: '`mi-var`', en: '`mi-var`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Un nombre usa letras, dígitos y `_`, y no puede empezar con un dígito. `mi-var` se leería como una resta.',
				en: 'A name uses letters, digits and `_`, and cannot start with a digit. `mi-var` would be read as a subtraction.',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Qué problema tiene este programa?', en: 'What is wrong with this program?' },
			code: SIN_INICIAR,
			options: [
				{ id: 'a', text: { es: 'No compila porque `total` no tiene valor', en: 'It does not compile because `total` has no value' } },
				{ id: 'b', text: { es: 'Lee `total` sin inicializar: el resultado es impredecible', en: 'It reads `total` uninitialized: the result is unpredictable' } },
				{ id: 'c', text: { es: 'Imprime siempre `1`', en: 'It always prints `1`' } },
			],
			correct: 'b',
			explanation: {
				es: '`total + 1` usa un valor que nunca se asignó. El programa compila (con una advertencia), pero el resultado no es confiable.',
				en: '`total + 1` uses a value that was never assigned. The program compiles (with a warning), but the result is not reliable.',
			},
		},
		{
			id: 'a4',
			prompt: { es: '¿Cuál de estos es un literal de carácter?', en: 'Which of these is a character literal?' },
			options: [
				{ id: 'a', text: { es: '`"A"`', en: '`"A"`' } },
				{ id: 'b', text: { es: '`\'A\'`', en: '`\'A\'`' } },
				{ id: 'c', text: { es: '`A`', en: '`A`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Las comillas simples marcan un carácter. Las comillas dobles forman una cadena (`"A"` ocupa dos bytes con el terminador) y `A` sin comillas sería un identificador.',
				en: 'Single quotes mark a character. Double quotes form a string (`"A"` takes two bytes with the terminator) and a bare `A` would be an identifier.',
			},
		},
		{
			id: 'a5',
			prompt: {
				es: '¿Qué ventaja tiene `const int N = 5;` frente a `#define N 5`?',
				en: 'What advantage does `const int N = 5;` have over `#define N 5`?',
			},
			options: [
				{ id: 'a', text: { es: 'Tiene un tipo y el compilador lo revisa', en: 'It has a type and the compiler checks it' } },
				{ id: 'b', text: { es: 'Ocupa menos memoria siempre', en: 'It always uses less memory' } },
				{ id: 'c', text: { es: 'Permite cambiar el valor más adelante', en: 'It lets you change the value later' } },
			],
			correct: 'a',
			explanation: {
				es: '`const` crea una variable con tipo, sujeta a las reglas del compilador. `#define` es un reemplazo de texto sin tipo y no se puede cambiar después.',
				en: '`const` creates a typed variable subject to compiler rules. `#define` is an untyped text replacement and cannot be changed later.',
			},
		},
		{
			id: 'a6',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: LIMITE,
			options: [
				{ id: 'a', text: { es: '`5`', en: '`5`' } },
				{ id: 'b', text: { es: '`6`', en: '`6`' } },
				{ id: 'c', text: { es: '`LIMITE + 1`', en: '`LIMITE + 1`' } },
			],
			correct: 'b',
			explanation: {
				es: '`LIMITE` vale 5 y solo se lee, no se modifica: `y` recibe 5 + 1 = 6.',
				en: '`LIMITE` is 5 and is only read, never modified: `y` gets 5 + 1 = 6.',
			},
		},
	],
};
