import type { PracticeSet } from './types';

// Practice and assessment for the "paso por valor y referencia" presentation
// (lesson `punteros-y-direcciones`). C always passes by value.
const DUPLICAR_VALOR = `#include <stdio.h>

void duplicar(int n) {
    n = n * 2;
}

int main(void) {
    int x = 10;
    duplicar(x);
    printf("%d\\n", x);
    return 0;
}`;

const DUPLICAR_PUNTERO = `#include <stdio.h>

void duplicar(int *n) {
    *n = *n * 2;
}

int main(void) {
    int x = 10;
    duplicar(&x);
    printf("%d\\n", x);
    return 0;
}`;

const INTERCAMBIAR_VALOR = `#include <stdio.h>

void intercambiar(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

int main(void) {
    int x = 5, y = 10;
    intercambiar(x, y);
    printf("%d %d\\n", x, y);
    return 0;
}`;

const INTERCAMBIAR_PUNTERO = `#include <stdio.h>

void intercambiar(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 5, y = 10;
    intercambiar(&x, &y);
    printf("%d %d\\n", x, y);
    return 0;
}`;

const REASIGNAR = `#include <stdio.h>

void reasignar(int *p) {
    int otro = 99;
    p = &otro;
    printf("%d\\n", *p);
}

int main(void) {
    int x = 1;
    reasignar(&x);
    printf("%d\\n", x);
    return 0;
}`;

const PONER = `#include <stdio.h>

void poner(int *p) {
    *p = 42;
}

int main(void) {
    int a = 1, b = 2;
    poner(&b);
    printf("%d %d\\n", a, b);
    return 0;
}`;

const SIN_AMPERSAND = `/* c-check: skip */
#include <stdio.h>

void duplicar(int *n) {
    *n = *n * 2;
}

int main(void) {
    int x = 10;
    duplicar(x);
    printf("%d\\n", x);
    return 0;
}`;

export const practice: PracticeSet = {
	practice: [
		{
			id: 'p1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: DUPLICAR_VALOR,
			options: [
				{ id: 'a', text: { es: '`10`', en: '`10`' } },
				{ id: 'b', text: { es: '`20`', en: '`20`' } },
				{ id: 'c', text: { es: 'No compila', en: 'It does not compile' } },
			],
			correct: 'a',
			explanation: {
				es: '`duplicar` recibe una copia de `x` en `n`. Duplicar `n` cambia solo la copia, en el marco de `duplicar`; `x` en `main` sigue valiendo 10.',
				en: '`duplicar` receives a copy of `x` in `n`. Doubling `n` changes only the copy, in the frame of `duplicar`; `x` in `main` is still 10.',
			},
		},
		{
			id: 'p2',
			prompt: { es: '¿Qué imprime ahora, cuando se pasa `&x`?', en: 'What does it print now, when `&x` is passed?' },
			code: DUPLICAR_PUNTERO,
			options: [
				{ id: 'a', text: { es: '`10`', en: '`10`' } },
				{ id: 'b', text: { es: '`20`', en: '`20`' } },
				{ id: 'c', text: { es: 'Una dirección de memoria', en: 'A memory address' } },
			],
			correct: 'b',
			explanation: {
				es: 'Se copia la dirección de `x` en `n`. `*n` es la propia variable `x`, así que `*n = *n * 2` la modifica. Lo que se pasó por valor fue la dirección.',
				en: 'The address of `x` is copied into `n`. `*n` is the variable `x` itself, so `*n = *n * 2` modifies it. What was passed by value was the address.',
			},
		},
		{
			id: 'p3',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: INTERCAMBIAR_VALOR,
			options: [
				{ id: 'a', text: { es: '`10 5`', en: '`10 5`' } },
				{ id: 'b', text: { es: '`5 10`', en: '`5 10`' } },
				{ id: 'c', text: { es: '`10 10`', en: '`10 10`' } },
			],
			correct: 'b',
			explanation: {
				es: '`a` y `b` son copias de `x` y de `y`. El intercambio ocurre entre las copias y desaparece al terminar la función, sin efecto en `main`.',
				en: '`a` and `b` are copies of `x` and `y`. The swap happens between the copies and disappears when the function ends, with no effect in `main`.',
			},
		},
		{
			id: 'p4',
			prompt: { es: 'Ahora `intercambiar` recibe punteros. ¿Qué imprime?', en: 'Now `intercambiar` receives pointers. What does it print?' },
			code: INTERCAMBIAR_PUNTERO,
			options: [
				{ id: 'a', text: { es: '`5 10`', en: '`5 10`' } },
				{ id: 'b', text: { es: '`10 5`', en: '`10 5`' } },
				{ id: 'c', text: { es: '`10 10`', en: '`10 10`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Las copias `a` y `b` contienen las direcciones de `x` e `y`. Escribir con `*a` y `*b` modifica las variables de `main`, por eso quedan intercambiadas.',
				en: 'The copies `a` and `b` hold the addresses of `x` and `y`. Writing through `*a` and `*b` modifies the variables of `main`, so they end up swapped.',
			},
		},
		{
			id: 'p5',
			prompt: {
				es: 'En Java, `modify(Dog d)` hace `d = new Dog("Fido")`. ¿Qué pasa con la variable del llamador?',
				en: 'In Java, `modify(Dog d)` does `d = new Dog("Fido")`. What happens to the caller variable?',
			},
			options: [
				{ id: 'a', text: { es: 'Apunta al nuevo `Dog`', en: 'It points to the new `Dog`' } },
				{ id: 'b', text: { es: 'No cambia', en: 'It does not change' } },
				{ id: 'c', text: { es: 'Se vuelve `null`', en: 'It becomes `null`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Java también pasa por valor: `d` es una copia de la referencia. Reasignarla cambia solo la copia local; mutar atributos con `d.setName(...)` sí afectaría al objeto.',
				en: 'Java also passes by value: `d` is a copy of the reference. Reassigning it changes only the local copy; mutating attributes with `d.setName(...)` would affect the object.',
			},
		},
		{
			id: 'p6',
			prompt: {
				es: 'En JavaScript, `update(user)` hace `user.age = 30` y luego `user = { age: 99 }`. ¿Cuánto vale `u.age` en el llamador?',
				en: 'In JavaScript, `update(user)` does `user.age = 30` and then `user = { age: 99 }`. What is `u.age` in the caller?',
			},
			options: [
				{ id: 'a', text: { es: '20, el valor original', en: '20, the original value' } },
				{ id: 'b', text: { es: '30', en: '30' } },
				{ id: 'c', text: { es: '99', en: '99' } },
			],
			correct: 'b',
			explanation: {
				es: 'La asignación `user.age = 30` muta el objeto compartido. La segunda línea solo vuelve a vincular el nombre local `user`, sin efecto fuera.',
				en: 'The assignment `user.age = 30` mutates the shared object. The second line only rebinds the local name `user`, with no effect outside.',
			},
		},
	],
	assess: [
		{
			id: 'a1',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: REASIGNAR,
			options: [
				{ id: 'a', text: { es: '`99` y luego `1`', en: '`99` and then `1`' } },
				{ id: 'b', text: { es: '`99` y luego `99`', en: '`99` and then `99`' } },
				{ id: 'c', text: { es: '`1` y luego `1`', en: '`1` and then `1`' } },
			],
			correct: 'a',
			explanation: {
				es: '`p` es una copia de la dirección de `x`. Hacer `p = &otro` cambia solo la copia: dentro se lee 99, pero `x` nunca se tocó y vale 1.',
				en: '`p` is a copy of the address of `x`. Doing `p = &otro` changes only the copy: inside it reads 99, but `x` was never touched and is 1.',
			},
		},
		{
			id: 'a2',
			prompt: { es: '¿Qué imprime este programa?', en: 'What does this program print?' },
			code: PONER,
			options: [
				{ id: 'a', text: { es: '`42 2`', en: '`42 2`' } },
				{ id: 'b', text: { es: '`1 42`', en: '`1 42`' } },
				{ id: 'c', text: { es: '`1 2`', en: '`1 2`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Se pasó la dirección de `b`, así que `*p = 42` escribe en `b`. La variable `a` no participa y conserva su 1.',
				en: 'The address of `b` was passed, so `*p = 42` writes into `b`. The variable `a` takes no part and keeps its 1.',
			},
		},
		{
			id: 'a3',
			prompt: {
				es: '`duplicar` espera un `int *`, pero `main` la llama con `duplicar(x)`. ¿Qué ocurre?',
				en: '`duplicar` expects an `int *`, but `main` calls it with `duplicar(x)`. What happens?',
			},
			code: SIN_AMPERSAND,
			options: [
				{ id: 'a', text: { es: 'Imprime `20`', en: 'It prints `20`' } },
				{ id: 'b', text: { es: 'Error de compilación: falta `&x`', en: 'Compile error: `&x` is missing' } },
				{ id: 'c', text: { es: 'Imprime `10`', en: 'It prints `10`' } },
			],
			correct: 'b',
			explanation: {
				es: 'Un `int` no es una dirección. El compilador rechaza pasar `x` donde se espera `int *`; hay que escribir `duplicar(&x)` para entregar la dirección.',
				en: 'An `int` is not an address. The compiler rejects passing `x` where an `int *` is expected; you must write `duplicar(&x)` to hand over the address.',
			},
		},
		{
			id: 'a4',
			prompt: { es: '¿Tiene C paso por referencia?', en: 'Does C have pass by reference?' },
			options: [
				{ id: 'a', text: { es: 'Sí, con `&` en el parámetro', en: 'Yes, with `&` in the parameter' } },
				{ id: 'b', text: { es: 'No: todo se pasa por valor', en: 'No: everything is passed by value' } },
				{ id: 'c', text: { es: 'Sí, pero solo para `int`', en: 'Yes, but only for `int`' } },
			],
			correct: 'b',
			explanation: {
				es: 'C copia siempre el argumento. Para modificar una variable del llamador se pasa su dirección, que es un valor más y también se copia. El alias de parámetro es de C++.',
				en: 'C always copies the argument. To modify a caller variable you pass its address, which is just another value and is copied too. Reference parameters belong to C++.',
			},
		},
		{
			id: 'a5',
			prompt: {
				es: 'En Python, `process(lst)` hace `lst.append(100)` y después `lst = [1, 2]`. Con `data = [1]`, ¿qué vale `data` al volver?',
				en: 'In Python, `process(lst)` does `lst.append(100)` and then `lst = [1, 2]`. With `data = [1]`, what is `data` on return?',
			},
			options: [
				{ id: 'a', text: { es: '`[1]`', en: '`[1]`' } },
				{ id: 'b', text: { es: '`[1, 100]`', en: '`[1, 100]`' } },
				{ id: 'c', text: { es: '`[1, 2]`', en: '`[1, 2]`' } },
			],
			correct: 'b',
			explanation: {
				es: '`append` muta la lista compartida, así que `data` queda `[1, 100]`. La asignación posterior solo vincula el nombre local a otra lista.',
				en: '`append` mutates the shared list, so `data` becomes `[1, 100]`. The later assignment only binds the local name to another list.',
			},
		},
		{
			id: 'a6',
			prompt: {
				es: 'En `void f(int *p)`, ¿qué se copia al llamar `f(&x)`?',
				en: 'In `void f(int *p)`, what is copied when calling `f(&x)`?',
			},
			options: [
				{ id: 'a', text: { es: 'El valor de `x`', en: 'The value of `x`' } },
				{ id: 'b', text: { es: 'La dirección de `x`', en: 'The address of `x`' } },
				{ id: 'c', text: { es: 'Nada: `p` es la propia `x`', en: 'Nothing: `p` is `x` itself' } },
			],
			correct: 'b',
			explanation: {
				es: '`p` es una variable local que recibe una copia de la dirección `&x`. Por eso `*p` alcanza a `x`, pero cambiar `p` no mueve nada fuera de `f`.',
				en: '`p` is a local variable that receives a copy of the address `&x`. That is why `*p` reaches `x`, but changing `p` moves nothing outside `f`.',
			},
		},
	],
};
