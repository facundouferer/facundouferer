import type { PracticeSet } from './types';

// Practice and assessment for the "if-else paso a paso" presentation
// (lesson `sentencia-if-else`).
const CADENA = `#include <stdio.h>

int main(void) {
    int nota = 7;
    if (nota >= 9) {
        printf("A\\n");
    } else if (nota >= 6) {
        printf("B\\n");
    } else {
        printf("C\\n");
    }
    return 0;
}`;

const SIN_LLAVES = `#include <stdio.h>

int main(void) {
    int n = 0;
    if (n > 0)
        printf("a\\n");
        printf("b\\n");
    return 0;
}`;

const PUNTO_Y_COMA = `#include <stdio.h>

int main(void) {
    int n = -1;
    if (n > 0);
    {
        printf("positivo\\n");
    }
    return 0;
}`;

const CORTOCIRCUITO = `#include <stdio.h>

int main(void) {
    int personas = 0;
    int total = 100;
    if (personas != 0 && total / personas > 50) {
        printf("caro\\n");
    } else {
        printf("sin datos\\n");
    }
    return 0;
}`;

const DOS_IF = `#include <stdio.h>

int main(void) {
    int x = 10;
    if (x > 5) {
        printf("A");
    }
    if (x > 8) {
        printf("B");
    }
    printf("\\n");
    return 0;
}`;

const ENCADENADO = `#include <stdio.h>

int main(void) {
    int x = 10;
    if (x > 5) {
        x = x + 1;
    } else if (x > 8) {
        x = x + 100;
    }
    printf("%d\\n", x);
    return 0;
}`;

const ORDEN = `/* c-check: skip */
int nota = 10;
if (nota >= 6) {
    printf("aprobado\\n");
} else if (nota >= 9) {
    printf("sobresaliente\\n");
}`;

const RANGO = `/* c-check: skip */
#include <stdio.h>

int main(void) {
    int n = 50;
    if (1 <= n <= 10) {
        printf("dentro\\n");
    } else {
        printf("fuera\\n");
    }
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: CADENA,
			options: [
				{ id: 'a', text: { es: 'Solo `B`', en: 'Only `B`' } },
				{ id: 'b', text: { es: '`B` y luego `C`', en: '`B` and then `C`' } },
				{ id: 'c', text: { es: 'Solo `A`', en: 'Only `A`' } },
			],
			correct: 'a',
			explanation: {
				es: '`7 >= 9` es falso, así que se prueba `7 >= 6`, que es verdadero: se ejecuta esa rama y el resto de la cadena (incluido el `else`) se salta.',
				en: '`7 >= 9` is false, so `7 >= 6` is tested, and it is true: that branch runs and the rest of the chain (the `else` included) is skipped.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: SIN_LLAVES,
			options: [
				{ id: 'a', text: { es: 'Nada', en: 'Nothing' } },
				{ id: 'b', text: { es: 'Solo `b`', en: 'Only `b`' } },
				{ id: 'c', text: { es: '`a` y luego `b`', en: '`a` and then `b`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Sin llaves, el `if` controla solo la instrucción que le sigue. `n > 0` es falso, se salta `printf("a")`, y `printf("b")` corre siempre aunque la sangría sugiera lo contrario.',
				en: 'Without braces, the `if` controls only the statement right after it. `n > 0` is false, so `printf("a")` is skipped, and `printf("b")` always runs even if the indentation suggests otherwise.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: PUNTO_Y_COMA,
			options: [
				{ id: 'a', text: { es: 'Nada, porque `n > 0` es falso', en: 'Nothing, because `n > 0` is false' } },
				{ id: 'b', text: { es: '`positivo`', en: '`positivo`' } },
				{ id: 'c', text: { es: 'Nada: no compila', en: 'Nothing: it does not compile' } },
			],
			correct: 'b',
			explanation: {
				es: 'El `;` después de `if (n > 0)` es una instrucción vacía: es todo lo que controla el `if`. El bloque `{ ... }` que sigue ya no depende de la condición y se ejecuta siempre.',
				en: 'The `;` after `if (n > 0)` is an empty statement: that is all the `if` controls. The `{ ... }` block that follows no longer depends on the condition and always runs.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: CORTOCIRCUITO,
			options: [
				{ id: 'a', text: { es: '`sin datos`', en: '`sin datos`' } },
				{ id: 'b', text: { es: '`caro`', en: '`caro`' } },
				{ id: 'c', text: { es: 'El programa se detiene por dividir entre 0', en: 'The program stops from dividing by 0' } },
			],
			correct: 'a',
			explanation: {
				es: '`personas != 0` es falso, y `&&` no evalúa su lado derecho cuando el izquierdo ya es falso: nunca se hace `total / personas`. La condición completa es falsa y corre el `else`.',
				en: '`personas != 0` is false, and `&&` does not evaluate its right side when the left one is already false: `total / personas` is never computed. The whole condition is false and the `else` runs.',
			},
		},
		{
			id: 'p5',
			prompt: {
				es: 'Con `edad = 17`, ¿qué rama ejecuta `if (edad >= 18) { ... } else { ... }`?',
				en: 'With `edad = 17`, which branch does `if (edad >= 18) { ... } else { ... }` run?',
			},
			options: [
				{ id: 'a', text: { es: 'El bloque del `if`', en: 'The `if` block' } },
				{ id: 'b', text: { es: 'El bloque del `else`', en: 'The `else` block' } },
				{ id: 'c', text: { es: 'Ninguno', en: 'Neither' } },
			],
			correct: 'b',
			explanation: {
				es: '`17 >= 18` es falso. Cuando hay `else`, siempre se ejecuta exactamente uno de los dos bloques, así que corre el del `else`.',
				en: '`17 >= 18` is false. When there is an `else`, exactly one of the two blocks always runs, so the `else` one runs.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: DOS_IF,
			options: [
				{ id: 'a', text: { es: '`A`', en: '`A`' } },
				{ id: 'b', text: { es: '`AB`', en: '`AB`' } },
				{ id: 'c', text: { es: '`B`', en: '`B`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Son dos `if` independientes, no una cadena: cada condición se evalúa por separado. `10 > 5` y `10 > 8` son verdaderas, así que se ejecutan las dos.',
				en: 'These are two independent `if` statements, not a chain: each condition is evaluated separately. `10 > 5` and `10 > 8` are both true, so both run.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Qué valor imprime este programa?', en: 'What value does this program print?' },
			code: ENCADENADO,
			options: [
				{ id: 'a', text: { es: '11', en: '11' } },
				{ id: 'b', text: { es: '111', en: '111' } },
				{ id: 'c', text: { es: '110', en: '110' } },
			],
			correct: 'a',
			explanation: {
				es: '`10 > 5` es verdadero y `x` pasa a 11. Como la rama del `if` se ejecutó, el `else if` ni se evalúa: la suma de 100 nunca ocurre.',
				en: '`10 > 5` is true and `x` becomes 11. Since the `if` branch ran, the `else if` is not even evaluated: the +100 never happens.',
			},
		},
		{
			id: 'a3',
			prompt: {
				es: 'Con `nota = 10`, ¿qué imprime este fragmento y qué error tiene?',
				en: 'With `nota = 10`, what does this fragment print and what is wrong with it?',
			},
			code: ORDEN,
			options: [
				{ id: 'a', text: { es: '`aprobado`: la rama `>= 9` es inalcanzable por el orden', en: '`aprobado`: the `>= 9` branch is unreachable because of the order' } },
				{ id: 'b', text: { es: '`sobresaliente`, porque es la más específica', en: '`sobresaliente`, because it is the most specific' } },
				{ id: 'c', text: { es: '`aprobado` y `sobresaliente`', en: '`aprobado` and `sobresaliente`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Todo valor que cumple `>= 9` ya cumple `>= 6`, y esa condición va primero: la cadena se detiene ahí. La solución es probar primero la condición más restrictiva.',
				en: 'Every value that satisfies `>= 9` already satisfies `>= 6`, and that condition comes first: the chain stops there. The fix is to test the most restrictive condition first.',
			},
		},
		{
			id: 'a4',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: RANGO,
			options: [
				{ id: 'a', text: { es: '`fuera`', en: '`fuera`' } },
				{ id: 'b', text: { es: '`dentro`', en: '`dentro`' } },
				{ id: 'c', text: { es: 'Nada: no compila', en: 'Nothing: it does not compile' } },
			],
			correct: 'b',
			explanation: {
				es: '`1 <= n <= 10` se evalúa de izquierda a derecha: `1 <= 50` da 1, y luego `1 <= 10` da 1 (verdadero). GCC lo compila con un aviso (algunos compiladores lo rechazan como error), pero siempre es verdadero. Se escribe `n >= 1 && n <= 10`.',
				en: '`1 <= n <= 10` is evaluated left to right: `1 <= 50` gives 1, and then `1 <= 10` gives 1 (true). GCC compiles it with a warning (some compilers reject it as an error), but it is always true. Write `n >= 1 && n <= 10`.',
			},
		},
		{
			id: 'a5',
			prompt: {
				es: 'Un `else` sin llaves, ¿a qué `if` pertenece cuando hay dos `if` anidados antes?',
				en: 'A braceless `else` with two nested `if` statements before it: which `if` does it belong to?',
			},
			options: [
				{ id: 'a', text: { es: 'Al `if` más cercano que aún no tiene `else`', en: 'The nearest `if` that does not have an `else` yet' } },
				{ id: 'b', text: { es: 'Al primer `if`, el más externo', en: 'The first, outermost `if`' } },
				{ id: 'c', text: { es: 'A la sangría que tenga', en: 'Whichever the indentation suggests' } },
			],
			correct: 'a',
			explanation: {
				es: 'El compilador ignora la sangría: un `else` se une al `if` más cercano sin `else`. Por eso conviene usar siempre llaves en los `if` anidados.',
				en: 'The compiler ignores indentation: an `else` attaches to the nearest `if` without an `else`. That is why you should always use braces in nested `if` statements.',
			},
		},
		{
			id: 'a6',
			prompt: {
				es: 'Quieres elegir entre `1 < n <= 5`, `5 < n <= 10` y `n > 10`. ¿Qué estructura conviene?',
				en: 'You want to choose between `1 < n <= 5`, `5 < n <= 10` and `n > 10`. Which structure fits?',
			},
			options: [
				{ id: 'a', text: { es: 'Una cadena `else if`', en: 'An `else if` chain' } },
				{ id: 'b', text: { es: 'Un `switch` con un `case` por rango', en: 'A `switch` with one `case` per range' } },
				{ id: 'c', text: { es: 'Un `switch` sobre `n` como `double`', en: 'A `switch` on `n` as a `double`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Un `case` compara por igualdad con una constante entera, no admite rangos. Las comparaciones con `<`, `<=` o `>` se resuelven con una cadena `else if`.',
				en: 'A `case` compares for equality with an integer constant and does not accept ranges. Comparisons with `<`, `<=` or `>` are handled with an `else if` chain.',
			},
		},
	],
};
