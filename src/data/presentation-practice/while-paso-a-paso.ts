import type { PracticeSet } from './types';

// Practice and assessment for the "while paso a paso" presentation
// (lesson `sentencia-while`).
const CONTAR = `#include <stdio.h>

int main(void) {
    int i = 1;
    while (i <= 3) {
        printf("%d ", i);
        i++;
    }
    printf("\\n");
    return 0;
}`;

const NUNCA = `#include <stdio.h>

int main(void) {
    int i = 10;
    int vueltas = 0;
    while (i < 5) {
        vueltas++;
        i++;
    }
    printf("%d\\n", vueltas);
    return 0;
}`;

const SUMA = `#include <stdio.h>

int main(void) {
    int suma = 0;
    int i = 1;
    while (i <= 4) {
        suma += i;
        i++;
    }
    printf("%d\\n", suma);
    return 0;
}`;

const FINAL = `#include <stdio.h>

int main(void) {
    int i = 0;
    while (i < 3) {
        i++;
    }
    printf("%d\\n", i);
    return 0;
}`;

const CUENTA_ATRAS = `#include <stdio.h>

int main(void) {
    int n = 3;
    while (n > 0) {
        printf("%d ", n);
        n--;
    }
    printf("\\n");
    return 0;
}`;

const SIN_ACTUALIZAR = `#include <stdio.h>

int main(void) {
    int i = 0;
    while (i < 3) {
        printf("%d\\n", i);
    }
    return 0;
}`;

const PUNTO_Y_COMA = `#include <stdio.h>

int main(void) {
    int i = 0;
    while (i < 3);
    {
        i++;
    }
    printf("%d\\n", i);
    return 0;
}`;

const DOBLE = `#include <stdio.h>

int main(void) {
    int n = 1;
    int pasos = 0;
    while (n < 20) {
        n = n * 2;
        pasos++;
    }
    printf("%d %d\\n", n, pasos);
    return 0;
}`;

const CONTINUE = `/* c-check: skip */
int i = 0;
while (i < 5) {
    if (i == 2) {
        continue;
    }
    i++;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: CONTAR,
			options: [
				{ id: 'a', text: { es: '`1 2 3 `', en: '`1 2 3 `' } },
				{ id: 'b', text: { es: '`1 2 3 4 `', en: '`1 2 3 4 `' } },
				{ id: 'c', text: { es: '`0 1 2 `', en: '`0 1 2 `' } },
			],
			correct: 'a',
			explanation: {
				es: 'La condición `i <= 3` se evalúa antes de cada vuelta: con `i` valiendo 1, 2 y 3 es verdadera; cuando `i` llega a 4 es falsa y el ciclo termina sin imprimir el 4.',
				en: 'The condition `i <= 3` is evaluated before each iteration: with `i` equal to 1, 2 and 3 it is true; when `i` reaches 4 it is false and the loop ends without printing 4.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Qué valor imprime este programa?', en: 'What value does this program print?' },
			code: NUNCA,
			options: [
				{ id: 'a', text: { es: '0', en: '0' } },
				{ id: 'b', text: { es: '1', en: '1' } },
				{ id: 'c', text: { es: '5', en: '5' } },
			],
			correct: 'a',
			explanation: {
				es: 'El `while` evalúa la condición primero: `10 < 5` es falso desde el comienzo, así que el cuerpo no se ejecuta ni una vez y `vueltas` queda en 0.',
				en: 'The `while` evaluates the condition first: `10 < 5` is false from the start, so the body does not run even once and `vueltas` stays at 0.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Qué valor imprime este programa?', en: 'What value does this program print?' },
			code: SUMA,
			options: [
				{ id: 'a', text: { es: '6', en: '6' } },
				{ id: 'b', text: { es: '10', en: '10' } },
				{ id: 'c', text: { es: '15', en: '15' } },
			],
			correct: 'b',
			explanation: {
				es: '`suma` acumula 1, luego 1+2=3, luego 3+3=6 y por último 6+4=10. Cuando `i` vale 5, la condición `i <= 4` falla y el ciclo termina.',
				en: '`suma` accumulates 1, then 1+2=3, then 3+3=6 and finally 6+4=10. When `i` is 5, the condition `i <= 4` fails and the loop ends.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Qué valor tiene `i` al salir del ciclo?', en: 'What value does `i` have after the loop?' },
			code: FINAL,
			options: [
				{ id: 'a', text: { es: '2', en: '2' } },
				{ id: 'b', text: { es: '3', en: '3' } },
				{ id: 'c', text: { es: '4', en: '4' } },
			],
			correct: 'b',
			explanation: {
				es: '`i` sube de 0 a 3 con tres vueltas. Cuando vale 3, `i < 3` es falso y el ciclo termina: la variable conserva el valor que hizo falsa la condición.',
				en: '`i` goes from 0 to 3 in three iterations. When it is 3, `i < 3` is false and the loop ends: the variable keeps the value that made the condition false.',
			},
		},
		{
			id: 'p5',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: CUENTA_ATRAS,
			options: [
				{ id: 'a', text: { es: '`3 2 1 `', en: '`3 2 1 `' } },
				{ id: 'b', text: { es: '`3 2 1 0 `', en: '`3 2 1 0 `' } },
				{ id: 'c', text: { es: '`2 1 0 `', en: '`2 1 0 `' } },
			],
			correct: 'a',
			explanation: {
				es: 'Imprime `n` y luego lo reduce. Cuando `n` llega a 0, `n > 0` es falso y el ciclo termina antes de imprimir el 0.',
				en: 'It prints `n` and then decrements it. When `n` reaches 0, `n > 0` is false and the loop ends before printing 0.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué le pasa a este programa?', en: 'What happens to this program?' },
			code: SIN_ACTUALIZAR,
			options: [
				{ id: 'a', text: { es: 'Imprime `0 1 2` y termina', en: 'It prints `0 1 2` and ends' } },
				{ id: 'b', text: { es: 'Imprime `0` sin parar: ciclo infinito', en: 'It prints `0` forever: an infinite loop' } },
				{ id: 'c', text: { es: 'No compila', en: 'It does not compile' } },
			],
			correct: 'b',
			explanation: {
				es: 'Nada modifica `i` dentro del cuerpo, así que `i < 3` siempre es verdadero. Un ciclo `while` necesita que algo en el cuerpo acerque la condición a ser falsa.',
				en: 'Nothing changes `i` inside the body, so `i < 3` is always true. A `while` loop needs something in its body that moves the condition toward false.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Qué hace este programa?', en: 'What does this program do?' },
			code: PUNTO_Y_COMA,
			options: [
				{ id: 'a', text: { es: 'Imprime `3`', en: 'It prints `3`' } },
				{ id: 'b', text: { es: 'Imprime `1`', en: 'It prints `1`' } },
				{ id: 'c', text: { es: 'Nunca termina y no imprime nada', en: 'It never ends and prints nothing' } },
			],
			correct: 'c',
			explanation: {
				es: 'El `;` tras `while (i < 3)` es el cuerpo vacío del ciclo. `i` nunca cambia dentro de él, la condición sigue verdadera y el bloque `{ i++; }` de abajo jamás se alcanza.',
				en: 'The `;` after `while (i < 3)` is the loop\'s empty body. `i` never changes inside it, the condition stays true and the `{ i++; }` block below is never reached.',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: DOBLE,
			options: [
				{ id: 'a', text: { es: '`16 4`', en: '`16 4`' } },
				{ id: 'b', text: { es: '`32 5`', en: '`32 5`' } },
				{ id: 'c', text: { es: '`20 5`', en: '`20 5`' } },
			],
			correct: 'b',
			explanation: {
				es: '`n` pasa por 2, 4, 8, 16 (todavía menor que 20) y 32. Son 5 vueltas: la condición se evalúa antes de cada una, y 16 < 20 aún permite una vuelta más.',
				en: '`n` goes through 2, 4, 8, 16 (still below 20) and 32. That is 5 iterations: the condition is evaluated before each one, and 16 < 20 still allows another.',
			},
		},
		{
			id: 'a4',
			prompt: { es: '¿Qué defecto tiene este fragmento?', en: 'What is wrong with this fragment?' },
			code: CONTINUE,
			options: [
				{ id: 'a', text: { es: '`continue` salta `i++` y `i` se queda en 2: ciclo infinito', en: '`continue` skips `i++` and `i` stays at 2: an infinite loop' } },
				{ id: 'b', text: { es: '`continue` sale del ciclo cuando `i` vale 2', en: '`continue` leaves the loop when `i` is 2' } },
				{ id: 'c', text: { es: 'Ninguno: termina cuando `i` llega a 5', en: 'None: it ends when `i` reaches 5' } },
			],
			correct: 'a',
			explanation: {
				es: '`continue` salta a la siguiente evaluación de la condición sin ejecutar el resto del cuerpo, incluida la actualización. Hay que actualizar antes del `continue`.',
				en: '`continue` jumps to the next evaluation of the condition without running the rest of the body, the update included. Update before the `continue`.',
			},
		},
		{
			id: 'a5',
			prompt: {
				es: 'Quieres leer enteros hasta que `scanf` falle. ¿Qué condición usas?',
				en: 'You want to read integers until `scanf` fails. Which condition do you use?',
			},
			options: [
				{ id: 'a', text: { es: '`while (scanf("%d", &x) == 1)`', en: '`while (scanf("%d", &x) == 1)`' } },
				{ id: 'b', text: { es: '`while (scanf("%d", &x))`', en: '`while (scanf("%d", &x))`' } },
				{ id: 'c', text: { es: '`while (x != 0)` sin mirar a `scanf`', en: '`while (x != 0)` ignoring `scanf`' } },
			],
			correct: 'a',
			explanation: {
				es: '`scanf` devuelve 1 si leyó un entero, 0 si encontró otra cosa y `EOF` (distinto de 0) al terminar la entrada. Comparar con `== 1` evita seguir cuando falla; ignorarlo puede dar un ciclo infinito.',
				en: '`scanf` returns 1 if it read an integer, 0 if it found something else and `EOF` (non-zero) at the end of input. Comparing with `== 1` stops when it fails; ignoring it can give an infinite loop.',
			},
		},
		{
			id: 'a6',
			prompt: {
				es: 'Sabes que necesitas exactamente 10 vueltas con un contador. ¿Qué ciclo suele expresarlo mejor?',
				en: 'You know you need exactly 10 iterations with a counter. Which loop usually expresses it best?',
			},
			options: [
				{ id: 'a', text: { es: '`for`', en: '`for`' } },
				{ id: 'b', text: { es: '`while (true)` con `break`', en: '`while (true)` with `break`' } },
				{ id: 'c', text: { es: 'Un `switch`', en: 'A `switch`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Cuando la cantidad de vueltas se conoce, `for` junta inicio, condición y actualización en una línea. `while` se reserva para cuando las vueltas dependen de los datos.',
				en: 'When the number of iterations is known, `for` puts start, condition and update on one line. `while` is kept for when the iterations depend on the data.',
			},
		},
	],
};
