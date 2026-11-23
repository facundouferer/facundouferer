import type { PracticeSet } from './types';

// Practice and assessment for the "modularidad en C" presentation
// (lesson `modularizacion-subprogramas-y-funciones`). Scalars only.
const SUMAR = `#include <stdio.h>

int sumar(int a, int b) {
    return a + b;
}

int main(void) {
    int r = sumar(2, 3) * 2;
    printf("%d\\n", r);
    return 0;
}`;

const COPIA = `#include <stdio.h>

void duplicar(int n) {
    n = n * 2;
}

int main(void) {
    int x = 10;
    duplicar(x);
    printf("%d\\n", x);
    return 0;
}`;

const PROTOTIPO = `#include <stdio.h>

int cuadrado(int x);

int main(void) {
    printf("%d\\n", cuadrado(4));
    return 0;
}

int cuadrado(int x) {
    return x * x;
}`;

const ALCANCE_LOCAL = `#include <stdio.h>

int total = 0;

void acumular(int n) {
    int total = 100;
    total = total + n;
}

int main(void) {
    acumular(5);
    printf("%d\\n", total);
    return 0;
}`;

const BLOQUE = `#include <stdio.h>

void saludar(void) {
    printf("hola\\n");
}

int main(void) {
    int r = 0;
    saludar();
    if (r == 0) {
        int dentro = 3;
        r = dentro + 1;
    }
    printf("%d\\n", r);
    return 0;
}`;

const CONTAR = `#include <stdio.h>

int contar(int n) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        c = c + 1;
    }
    return c;
}

int main(void) {
    int a = contar(3);
    int b = contar(a);
    printf("%d %d\\n", a, b);
    return 0;
}`;

const SIN_PROTOTIPO = `/* c-check: skip */
#include <stdio.h>

int main(void) {
    printf("%d\\n", triple(4));
    return 0;
}

int triple(int x) {
    return x * 3;
}`;

const VOID_VALOR = `/* c-check: skip */
#include <stdio.h>

void mostrar(int n) {
    printf("%d\\n", n);
}

int main(void) {
    int r = mostrar(3);
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: SUMAR,
			options: [
				{ id: 'a', text: { es: '`5`', en: '`5`' } },
				{ id: 'b', text: { es: '`10`', en: '`10`' } },
				{ id: 'c', text: { es: '`7`', en: '`7`' } },
			],
			correct: 'b',
			explanation: {
				es: 'La llamada `sumar(2, 3)` se reemplaza por su valor de retorno, 5, y luego se multiplica por 2: `r` vale 10.',
				en: 'The call `sumar(2, 3)` is replaced by its return value, 5, and then multiplied by 2: `r` is 10.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: COPIA,
			options: [
				{ id: 'a', text: { es: '`10`', en: '`10`' } },
				{ id: 'b', text: { es: '`20`', en: '`20`' } },
				{ id: 'c', text: { es: 'No compila', en: 'It does not compile' } },
			],
			correct: 'a',
			explanation: {
				es: 'El parámetro `n` es una copia de `x`. Cada llamada tiene sus propios parámetros y variables locales, así que `x` en `main` no cambia.',
				en: 'The parameter `n` is a copy of `x`. Each call has its own parameters and local variables, so `x` in `main` does not change.',
			},
		},
		{
			id: 'p3',
			prompt: {
				es: '`cuadrado` se define después de `main`, pero hay un prototipo arriba. ¿Qué imprime?',
				en: '`cuadrado` is defined after `main`, but there is a prototype above. What does it print?',
			},
			code: PROTOTIPO,
			options: [
				{ id: 'a', text: { es: '`16`', en: '`16`' } },
				{ id: 'b', text: { es: '`8`', en: '`8`' } },
				{ id: 'c', text: { es: 'Error: falta definirla antes', en: 'Error: it must be defined first' } },
			],
			correct: 'a',
			explanation: {
				es: 'El prototipo le dice al compilador el nombre, los parámetros y el retorno antes de la llamada; con él, el orden de las definiciones deja de importar.',
				en: 'The prototype tells the compiler the name, parameters and return type before the call; with it, the order of the definitions stops mattering.',
			},
		},
		{
			id: 'p4',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: ALCANCE_LOCAL,
			options: [
				{ id: 'a', text: { es: '`0`', en: '`0`' } },
				{ id: 'b', text: { es: '`5`', en: '`5`' } },
				{ id: 'c', text: { es: '`105`', en: '`105`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Dentro de `acumular`, `int total = 100;` crea una variable local que oculta a la global. La suma modifica la local, y la global sigue en 0.',
				en: 'Inside `acumular`, `int total = 100;` creates a local variable that hides the global one. The sum changes the local, and the global is still 0.',
			},
		},
		{
			id: 'p5',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: BLOQUE,
			options: [
				{ id: 'a', text: { es: '`hola` y luego `4`', en: '`hola` and then `4`' } },
				{ id: 'b', text: { es: '`hola` y luego `0`', en: '`hola` and then `0`' } },
				{ id: 'c', text: { es: 'Error: `dentro` no existe fuera del bloque', en: 'Error: `dentro` does not exist outside the block' } },
			],
			correct: 'a',
			explanation: {
				es: '`saludar` imprime `hola` y vuelve al punto de la llamada. `dentro` vive solo en el bloque, pero `r` es de `main`: queda en 4 al salir del bloque.',
				en: '`saludar` prints `hola` and returns to the call point. `dentro` lives only in the block, but `r` belongs to `main`: it stays 4 after the block.',
			},
		},
		{
			id: 'p6',
			prompt: {
				es: 'En C, ¿puede haber dos funciones `add`, una con `int` y otra con `double`, en el mismo programa?',
				en: 'In C, can a program have two functions `add`, one with `int` and one with `double`?',
			},
			options: [
				{ id: 'a', text: { es: 'Sí, como en Java', en: 'Yes, like in Java' } },
				{ id: 'b', text: { es: 'No: cada nombre tiene un único prototipo', en: 'No: each name has a single prototype' } },
				{ id: 'c', text: { es: 'Sí, si están en archivos distintos', en: 'Yes, if they are in different files' } },
			],
			correct: 'b',
			explanation: {
				es: 'C no tiene sobrecarga nativa: el nombre identifica a la función y solo puede haber una. Por eso se usan nombres distintos, como `sumar_int` y `sumar_double`.',
				en: 'C has no native overloading: the name identifies the function and there can be only one. That is why you use different names, like `sumar_int` and `sumar_double`.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: CONTAR,
			options: [
				{ id: 'a', text: { es: '`3 3`', en: '`3 3`' } },
				{ id: 'b', text: { es: '`3 0`', en: '`3 0`' } },
				{ id: 'c', text: { es: '`3 6`', en: '`3 6`' } },
			],
			correct: 'a',
			explanation: {
				es: 'Cada llamada crea su propio `c`, que arranca en 0. `contar(3)` devuelve 3 y `contar(a)` pasa una copia de 3, así que también devuelve 3.',
				en: 'Each call creates its own `c`, which starts at 0. `contar(3)` returns 3 and `contar(a)` passes a copy of 3, so it also returns 3.',
			},
		},
		{
			id: 'a2',
			prompt: {
				es: '`main` llama a `triple` antes de su definición y no hay prototipo. ¿Qué ocurre?',
				en: '`main` calls `triple` before its definition and there is no prototype. What happens?',
			},
			code: SIN_PROTOTIPO,
			options: [
				{ id: 'a', text: { es: 'Imprime `12`', en: 'It prints `12`' } },
				{ id: 'b', text: { es: 'Error de compilación: `triple` no está declarada', en: 'Compile error: `triple` is not declared' } },
				{ id: 'c', text: { es: 'Imprime `4`', en: 'It prints `4`' } },
			],
			correct: 'b',
			explanation: {
				es: 'El compilador lee de arriba hacia abajo y, en la llamada, no conoce `triple`. La solución es agregar el prototipo `int triple(int x);` antes de `main`.',
				en: 'The compiler reads top to bottom and, at the call, does not know `triple`. The fix is to add the prototype `int triple(int x);` before `main`.',
			},
		},
		{
			id: 'a3',
			prompt: { es: '¿Qué ocurre al compilar este programa?', en: 'What happens when this program is compiled?' },
			code: VOID_VALOR,
			options: [
				{ id: 'a', text: { es: '`r` vale 3', en: '`r` is 3' } },
				{ id: 'b', text: { es: '`r` vale 0', en: '`r` is 0' } },
				{ id: 'c', text: { es: 'Error: una función `void` no devuelve valor', en: 'Error: a `void` function returns no value' } },
			],
			correct: 'c',
			explanation: {
				es: 'Un procedimiento `void` ejecuta acciones, como imprimir, pero no retorna nada que guardar. Para obtener un resultado, la función debe declarar un tipo de retorno.',
				en: 'A `void` procedure runs actions, such as printing, but returns nothing to store. To get a result, the function must declare a return type.',
			},
		},
		{
			id: 'a4',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: ALCANCE_LOCAL,
			options: [
				{ id: 'a', text: { es: '`105`', en: '`105`' } },
				{ id: 'b', text: { es: '`5`', en: '`5`' } },
				{ id: 'c', text: { es: '`0`', en: '`0`' } },
			],
			correct: 'c',
			explanation: {
				es: 'La variable local `total` oculta a la global dentro de `acumular`. `main` imprime la global, que nunca se modificó.',
				en: 'The local variable `total` hides the global one inside `acumular`. `main` prints the global, which was never modified.',
			},
		},
		{
			id: 'a5',
			prompt: {
				es: '¿Para qué sirve el prototipo de una función?',
				en: 'What is the prototype of a function for?',
			},
			options: [
				{ id: 'a', text: { es: 'Para que se ejecute más rápido', en: 'To make it run faster' } },
				{ id: 'b', text: { es: 'Para que el compilador compruebe cada llamada', en: 'So the compiler checks every call' } },
				{ id: 'c', text: { es: 'Para reservar memoria para sus variables', en: 'To reserve memory for its variables' } },
			],
			correct: 'b',
			explanation: {
				es: 'El prototipo declara tipos de parámetros y de retorno, y permite detectar llamadas con argumentos de más, de menos o de tipo incompatible.',
				en: 'The prototype declares parameter and return types, and lets the compiler detect calls with too many, too few or incompatible arguments.',
			},
		},
		{
			id: 'a6',
			prompt: {
				es: 'En un módulo `calculadora`, ¿qué debe ir en `calculadora.h`?',
				en: 'In a `calculadora` module, what belongs in `calculadora.h`?',
			},
			options: [
				{ id: 'a', text: { es: 'Los prototipos, protegidos con guardas', en: 'The prototypes, protected with guards' } },
				{ id: 'b', text: { es: 'El cuerpo completo de cada función', en: 'The full body of each function' } },
				{ id: 'c', text: { es: 'Solo la función `main`', en: 'Only the `main` function' } },
			],
			correct: 'a',
			explanation: {
				es: 'El `.h` es la interfaz: lo que el módulo ofrece. La implementación va en `calculadora.c`, y las guardas de inclusión evitan repetir definiciones al incluirlo varias veces.',
				en: 'The `.h` is the interface: what the module offers. The implementation goes in `calculadora.c`, and the include guards avoid repeating definitions when it is included several times.',
			},
		},
	],
};
