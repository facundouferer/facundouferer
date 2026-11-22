import type { PracticeSet } from './types';

// Practice and assessment for the "if paso a paso" presentation
// (lesson `sentencia-if-else`).
const SIGNO = `#include <stdio.h>

int main(void) {
    int n = -4;
    if (n > 0) {
        printf("positivo\\n");
    }
    printf("fin\\n");
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: SIGNO,
			options: [
				{ id: 'a', text: { es: '`positivo` y luego `fin`', en: '`positivo` and then `fin`' } },
				{ id: 'b', text: { es: 'Solo `fin`', en: 'Only `fin`' } },
				{ id: 'c', text: { es: 'Nada: no compila', en: 'Nothing: it does not compile' } },
			],
			correct: 'b',
			explanation: {
				es: '`n > 0` vale 0 (falso) porque `n` es -4, así que el bloque del `if` se salta y el programa sigue con `printf("fin\\n")`.',
				en: '`n > 0` is 0 (false) because `n` is -4, so the `if` block is skipped and the program continues with `printf("fin\\n")`.',
			},
		},
		{
			id: 'p2',
			prompt: {
				es: 'Con `edad = 18`, ¿qué rama ejecuta `if (edad >= 18) { ... } else { ... }`?',
				en: 'With `edad = 18`, which branch does `if (edad >= 18) { ... } else { ... }` run?',
			},
			options: [
				{ id: 'a', text: { es: 'El bloque del `if`', en: 'The `if` block' } },
				{ id: 'b', text: { es: 'El bloque del `else`', en: 'The `else` block' } },
				{ id: 'c', text: { es: 'Los dos bloques', en: 'Both blocks' } },
			],
			correct: 'a',
			explanation: {
				es: '`18 >= 18` es verdadero, y un `if` con `else` ejecuta exactamente uno de los dos bloques: aquí el del `if`.',
				en: '`18 >= 18` is true, and an `if` with `else` runs exactly one of the two blocks: here the `if` block.',
			},
		},
		{
			id: 'p3',
			prompt: {
				es: 'En una cadena `if / else if / else`, `nota = 9` cumple `nota >= 6` y también `nota >= 9`. ¿Cuántas ramas se ejecutan si se pregunta primero por `>= 6`?',
				en: 'In an `if / else if / else` chain, `nota = 9` satisfies `nota >= 6` and also `nota >= 9`. How many branches run if `>= 6` is tested first?',
			},
			options: [
				{ id: 'a', text: { es: 'Una: la de `>= 6`', en: 'One: the `>= 6` one' } },
				{ id: 'b', text: { es: 'Dos: las dos condiciones verdaderas', en: 'Two: both true conditions' } },
				{ id: 'c', text: { es: 'Una: la de `>= 9`, la más específica', en: 'One: the `>= 9` one, the most specific' } },
			],
			correct: 'a',
			explanation: {
				es: 'Solo corre la primera rama cuya condición es verdadera y las demás ni se evalúan, por eso el orden de las condiciones importa.',
				en: 'Only the first branch whose condition is true runs and the rest are not even evaluated, which is why the order of the conditions matters.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Qué valor tiene `x` al final?', en: 'What value does `x` have at the end?' },
			code: `int x = 5;
if (x = 0) {
    x = 10;
}`,
			options: [
				{ id: 'a', text: { es: '10', en: '10' } },
				{ id: 'b', text: { es: '0', en: '0' } },
				{ id: 'c', text: { es: '5', en: '5' } },
			],
			correct: 'b',
			explanation: {
				es: '`x = 0` asigna 0 y esa expresión vale 0 (falso): el bloque no corre y `x` queda en 0. Se quería comparar con `==`.',
				en: '`x = 0` assigns 0 and that expression is worth 0 (false): the block does not run and `x` stays 0. The intent was to compare with `==`.',
			},
		},
		{
			id: 'p5',
			prompt: {
				es: '¿Cuántas veces se imprime `hola` en `if (0); printf("hola\\n");`?',
				en: 'How many times is `hola` printed in `if (0); printf("hola\\n");`?',
			},
			options: [
				{ id: 'a', text: { es: 'Ninguna', en: 'None' } },
				{ id: 'b', text: { es: 'Una', en: 'One' } },
				{ id: 'c', text: { es: 'Es un error de compilación', en: 'It is a compile error' } },
			],
			correct: 'b',
			explanation: {
				es: 'El `;` justo después del `if` es una sentencia vacía: el `if` controla esa sentencia vacía y el `printf` corre siempre.',
				en: 'The `;` right after the `if` is an empty statement: the `if` controls that empty statement and the `printf` always runs.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: `#include <stdio.h>

int main(void) {
    int n = 7;
    if (n % 2 == 0) {
        printf("par\\n");
    } else {
        printf("impar\\n");
    }
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: '`par`', en: '`par`' } },
				{ id: 'b', text: { es: '`impar`', en: '`impar`' } },
				{ id: 'c', text: { es: '`par` y `impar`', en: '`par` and `impar`' } },
			],
			correct: 'b',
			explanation: {
				es: '`7 % 2` es 1, distinto de 0, así que la condición es falsa y corre el `else`.',
				en: '`7 % 2` is 1, not 0, so the condition is false and the `else` runs.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Cuál condición escribe correctamente «`n` entre 1 y 10»?', en: 'Which condition correctly writes “`n` between 1 and 10”?' },
			options: [
				{ id: 'a', text: { es: '`1 <= n <= 10`', en: '`1 <= n <= 10`' } },
				{ id: 'b', text: { es: '`n >= 1 && n <= 10`', en: '`n >= 1 && n <= 10`' } },
				{ id: 'c', text: { es: '`n >= 1 || n <= 10`', en: '`n >= 1 || n <= 10`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Hay que combinar dos comparaciones con `&&`. `1 <= n <= 10` se evalúa como `(1 <= n) <= 10`, que siempre es verdadero.',
				en: 'Two comparisons must be combined with `&&`. `1 <= n <= 10` is evaluated as `(1 <= n) <= 10`, which is always true.',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Qué imprime?', en: 'What does it print?' },
			code: `#include <stdio.h>

int main(void) {
    int nota = 7;
    if (nota >= 4) {
        printf("aprobado\\n");
    } else if (nota >= 7) {
        printf("promocionado\\n");
    } else {
        printf("desaprobado\\n");
    }
    return 0;
}`,
			options: [
				{ id: 'a', text: { es: '`aprobado`', en: '`aprobado`' } },
				{ id: 'b', text: { es: '`promocionado`', en: '`promocionado`' } },
				{ id: 'c', text: { es: '`aprobado` y `promocionado`', en: '`aprobado` and `promocionado`' } },
			],
			correct: 'a',
			explanation: {
				es: '`nota >= 4` ya es verdadera, así que corre esa rama y el `else if` no se evalúa: la condición de `promocionado` nunca se alcanza.',
				en: '`nota >= 4` is already true, so that branch runs and the `else if` is not evaluated: the `promocionado` condition is never reached.',
			},
		},
		{
			id: 'a4',
			prompt: { es: 'En C, ¿qué significa que una condición sea «verdadera»?', en: 'In C, what does it mean for a condition to be “true”?' },
			options: [
				{ id: 'a', text: { es: 'Que vale exactamente 1', en: 'That it is exactly 1' } },
				{ id: 'b', text: { es: 'Que vale cualquier número distinto de 0', en: 'That it is any non-zero number' } },
				{ id: 'c', text: { es: 'Que es un valor `bool` `true`; los enteros no se aceptan', en: 'That it is a `bool` `true`; integers are not accepted' } },
			],
			correct: 'b',
			explanation: {
				es: 'Para el `if`, 0 es falso y cualquier otro valor es verdadero. Las comparaciones producen 1 o 0.',
				en: 'For `if`, 0 is false and any other value is true. Comparisons produce 1 or 0.',
			},
		},
		{
			id: 'a5',
			prompt: { es: '¿Por qué este código no hace lo que parece?', en: 'Why does this code not do what it seems to?' },
			code: `if (x > 0)
    printf("positivo\\n");
    printf("revisado\\n");`,
			options: [
				{ id: 'a', text: { es: 'Porque falta `else`', en: 'Because `else` is missing' } },
				{ id: 'b', text: { es: 'Porque sin llaves el `if` controla solo la primera sentencia; `revisado` se imprime siempre', en: 'Because without braces the `if` controls only the first statement; `revisado` always prints' } },
				{ id: 'c', text: { es: 'Porque `printf` no se puede usar dentro de un `if`', en: 'Because `printf` cannot be used inside an `if`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Sin llaves, el `if` abarca una sola sentencia. La sangría engaña: conviene usar siempre llaves.',
				en: 'Without braces, the `if` covers a single statement. The indentation misleads: always use braces.',
			},
		},
	],
};
