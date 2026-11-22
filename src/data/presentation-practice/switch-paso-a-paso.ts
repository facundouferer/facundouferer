import type { PracticeSet } from './types';

// Practice and assessment for the "switch paso a paso" presentation
// (lesson `sentencia-switch-y-bloques-de-codigo`).
const DIA = `#include <stdio.h>

int main(void) {
    int dia = 2;
    switch (dia) {
        case 1:
            printf("Lunes\\n");
            break;
        case 2:
            printf("Martes\\n");
            break;
        default:
            printf("Otro\\n");
            break;
    }
    return 0;
}`;

const SIN_BREAK = `#include <stdio.h>

int main(void) {
    int n = 1;
    switch (n) {
        case 1:
            printf("uno ");
        case 2:
            printf("dos ");
            break;
        case 3:
            printf("tres ");
            break;
    }
    printf("\\n");
    return 0;
}`;

const SIN_COINCIDENCIA = `#include <stdio.h>

int main(void) {
    int n = 9;
    switch (n) {
        case 1:
            printf("uno\\n");
            break;
        case 2:
            printf("dos\\n");
            break;
    }
    printf("fin\\n");
    return 0;
}`;

const AGRUPADO = `#include <stdio.h>

int main(void) {
    char letra = 'E';
    switch (letra) {
        case 'a':
        case 'A':
            printf("a\\n");
            break;
        case 'e':
        case 'E':
            printf("e\\n");
            break;
        default:
            printf("otra\\n");
            break;
    }
    return 0;
}`;

const DEFAULT_PRIMERO = `#include <stdio.h>

int main(void) {
    int n = 2;
    switch (n) {
        default:
            printf("def ");
        case 1:
            printf("uno ");
            break;
        case 2:
            printf("dos ");
            break;
    }
    printf("\\n");
    return 0;
}`;

const ALCANCE = `#include <stdio.h>

int main(void) {
    int x = 1;
    {
        int x = 2;
        printf("%d ", x);
    }
    printf("%d\\n", x);
    return 0;
}`;

const BLOQUE_CASE = `#include <stdio.h>

int main(void) {
    int opcion = 1;
    switch (opcion) {
        case 1: {
            int doble = opcion * 2;
            printf("%d\\n", doble);
            break;
        }
        default:
            printf("otra\\n");
            break;
    }
    return 0;
}`;

const FALLTHROUGH = `#include <stdio.h>

int main(void) {
    int nivel = 3;
    switch (nivel) {
        case 3:
            printf("alto ");
            [[fallthrough]];
        case 2:
            printf("medio ");
            break;
        default:
            printf("bajo ");
            break;
    }
    printf("\\n");
    return 0;
}`;

const REPETIDO = `/* c-check: skip */
switch (n) {
    case 1:
        printf("uno\\n");
        break;
    case 1:
        printf("otra vez uno\\n");
        break;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: DIA,
			options: [
				{ id: 'a', text: { es: '`Martes`', en: '`Martes`' } },
				{ id: 'b', text: { es: '`Martes` y luego `Otro`', en: '`Martes` and then `Otro`' } },
				{ id: 'c', text: { es: '`Otro`', en: '`Otro`' } },
			],
			correct: 'a',
			explanation: {
				es: 'El `switch` evalúa `dia` una vez (vale 2), salta al `case 2` y ejecuta hasta el `break`. `default` solo se usa cuando ningún `case` coincide.',
				en: 'The `switch` evaluates `dia` once (it is 2), jumps to `case 2` and runs until the `break`. `default` is used only when no `case` matches.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: SIN_BREAK,
			options: [
				{ id: 'a', text: { es: '`uno `', en: '`uno `' } },
				{ id: 'b', text: { es: '`uno dos `', en: '`uno dos `' } },
				{ id: 'c', text: { es: '`uno dos tres `', en: '`uno dos tres `' } },
			],
			correct: 'b',
			explanation: {
				es: 'Sin `break` en el `case 1`, la ejecución cae al caso siguiente y sigue hasta el primer `break`: imprime `uno ` y luego `dos `. El `case 3` no se ejecuta.',
				en: 'With no `break` in `case 1`, execution falls into the next case and continues until the first `break`: it prints `uno ` and then `dos `. `case 3` does not run.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: SIN_COINCIDENCIA,
			options: [
				{ id: 'a', text: { es: 'Nada', en: 'Nothing' } },
				{ id: 'b', text: { es: '`fin`', en: '`fin`' } },
				{ id: 'c', text: { es: '`uno` y luego `fin`', en: '`uno` and then `fin`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Ningún `case` vale 9 y no hay `default`, así que el `switch` no ejecuta nada y el programa sigue con lo que viene después: `fin`.',
				en: 'No `case` equals 9 and there is no `default`, so the `switch` runs nothing and the program continues with what follows: `fin`.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Qué imprime este programa con `letra = \'E\'`?', en: 'What does this program print with `letra = \'E\'`?' },
			code: AGRUPADO,
			options: [
				{ id: 'a', text: { es: '`a`', en: '`a`' } },
				{ id: 'b', text: { es: '`e`', en: '`e`' } },
				{ id: 'c', text: { es: '`otra`', en: '`otra`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Dos etiquetas seguidas (`case \'e\': case \'E\':`) comparten el mismo código. `\'E\'` coincide con la segunda y ejecuta la rama que imprime `e`.',
				en: 'Two labels in a row (`case \'e\': case \'E\':`) share the same code. `\'E\'` matches the second one and runs the branch that prints `e`.',
			},
		},
		{
			id: 'p5',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: ALCANCE,
			options: [
				{ id: 'a', text: { es: '`2 1`', en: '`2 1`' } },
				{ id: 'b', text: { es: '`2 2`', en: '`2 2`' } },
				{ id: 'c', text: { es: '`1 1`', en: '`1 1`' } },
			],
			correct: 'a',
			explanation: {
				es: 'El `x` del bloque oculta (*shadowing*) al `x` de afuera mientras el bloque está activo, y muere al cerrar la llave. Después se vuelve a ver el `x` original, que vale 1.',
				en: 'The block\'s `x` hides (*shadowing*) the outer `x` while the block is active, and dies at the closing brace. Afterwards the original `x`, which is 1, is visible again.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: DEFAULT_PRIMERO,
			options: [
				{ id: 'a', text: { es: '`dos `', en: '`dos `' } },
				{ id: 'b', text: { es: '`def uno dos `', en: '`def uno dos `' } },
				{ id: 'c', text: { es: '`def uno `', en: '`def uno `' } },
			],
			correct: 'a',
			explanation: {
				es: 'El lugar de `default` no importa para elegir el salto: `n` vale 2 y coincide con `case 2`, así que `default` ni se toca. Solo importa su posición si se cae hacia él o desde él.',
				en: 'The position of `default` does not matter for choosing the jump: `n` is 2 and matches `case 2`, so `default` is never touched. Its position only matters when execution falls into or out of it.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: FALLTHROUGH,
			options: [
				{ id: 'a', text: { es: '`alto `', en: '`alto `' } },
				{ id: 'b', text: { es: '`alto medio `', en: '`alto medio `' } },
				{ id: 'c', text: { es: '`medio `', en: '`medio `' } },
			],
			correct: 'b',
			explanation: {
				es: '`[[fallthrough]];` (C23) marca la caída como intencional: el programa pasa de `case 3` a `case 2` y se detiene en su `break`. Sin la marca, la caída es la misma pero el compilador puede avisar.',
				en: '`[[fallthrough]];` (C23) marks the fall as intentional: the program goes from `case 3` to `case 2` and stops at its `break`. Without the mark the fall is the same but the compiler may warn.',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Qué problema tiene este `switch`?', en: 'What is wrong with this `switch`?' },
			code: REPETIDO,
			options: [
				{ id: 'a', text: { es: 'Dos `case` con el mismo valor: no compila', en: 'Two `case` labels with the same value: it does not compile' } },
				{ id: 'b', text: { es: 'Corre solo el segundo `case 1`', en: 'Only the second `case 1` runs' } },
				{ id: 'c', text: { es: 'Nada: corre el primero', en: 'Nothing: the first one runs' } },
			],
			correct: 'a',
			explanation: {
				es: 'No puede haber dos `case` con el mismo valor en un mismo `switch`: el compilador lo rechaza porque el salto sería ambiguo.',
				en: 'A `switch` cannot have two `case` labels with the same value: the compiler rejects it because the jump would be ambiguous.',
			},
		},
		{
			id: 'a4',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: BLOQUE_CASE,
			options: [
				{ id: 'a', text: { es: '`1`', en: '`1`' } },
				{ id: 'b', text: { es: '`2`', en: '`2`' } },
				{ id: 'c', text: { es: '`otra`', en: '`otra`' } },
			],
			correct: 'b',
			explanation: {
				es: '`opcion` vale 1, entra al `case 1`, y dentro de su bloque `{}` declara `doble = 2`. El bloque limita el alcance de `doble` a ese caso, y el `break` sale del `switch`.',
				en: '`opcion` is 1, so it enters `case 1`, and inside its `{}` block it declares `doble = 2`. The block limits the scope of `doble` to that case, and `break` leaves the `switch`.',
			},
		},
		{
			id: 'a5',
			prompt: { es: '¿Cuál de estas expresiones NO puede usarse como expresión de un `switch`?', en: 'Which of these expressions can NOT be used as a `switch` expression?' },
			options: [
				{ id: 'a', text: { es: 'Un `char`', en: 'A `char`' } },
				{ id: 'b', text: { es: 'Un `int`', en: 'An `int`' } },
				{ id: 'c', text: { es: 'Un `double`', en: 'A `double`' } },
			],
			correct: 'c',
			explanation: {
				es: 'El `switch` exige un tipo entero (`int`, `long`, `unsigned`, `bool`, `char`). Un `double` o una cadena no sirven; tampoco un `case` con un rango como `nota >= 6`.',
				en: 'The `switch` requires an integer type (`int`, `long`, `unsigned`, `bool`, `char`). A `double` or a string will not do; neither will a `case` with a range like `nota >= 6`.',
			},
		},
		{
			id: 'a6',
			prompt: {
				es: 'Olvidas el `break` al final del último `case` de un `switch`. ¿Qué pasa?',
				en: 'You forget the `break` at the end of the last `case` of a `switch`. What happens?',
			},
			options: [
				{ id: 'a', text: { es: 'Nada grave: el `switch` termina ahí', en: 'Nothing serious: the `switch` ends there' } },
				{ id: 'b', text: { es: 'Error de compilación', en: 'A compile error' } },
				{ id: 'c', text: { es: 'Cae a un `case` inexistente y falla en ejecución', en: 'It falls into a nonexistent `case` and fails at run time' } },
			],
			correct: 'a',
			explanation: {
				es: 'Tras el último caso no hay más instrucciones: el `switch` termina. Aun así conviene poner el `break`, porque si luego agregas un caso, la caída sería un error difícil de ver.',
				en: 'After the last case there are no more statements: the `switch` ends. Still, put the `break` in: if you add a case later, the fall-through would be a hard-to-spot bug.',
			},
		},
	],
};
