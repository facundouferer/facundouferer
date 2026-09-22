import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Exceptions are taught in 12-excepciones-y-manejo-de-errores.{es,en}.md
// (order 13). Sequencing is decided by frontmatter `order`, not filename:
// these five lessons all have order < 13, so none of them may use `throw`.
//
//   order 2  -> 23-algoritmia-verificacion-y-complejidad
//   order 3  -> 02-variables-tipos-datos-y-operadores
//   order 6  -> 05-metodos-y-funciones
//   order 11 -> 10-herencia-polimorfismo-y-sobrecarga
//   order 12 -> 11-clases-abstractas-interfaces-y-modelado

const LESSON_FILES = [
	'src/content/courses/java/23-algoritmia-verificacion-y-complejidad.es.md',
	'src/content/courses/java/23-algoritmia-verificacion-y-complejidad.en.md',
	'src/content/courses/java/02-variables-tipos-datos-y-operadores.es.md',
	'src/content/courses/java/02-variables-tipos-datos-y-operadores.en.md',
	'src/content/courses/java/05-metodos-y-funciones.es.md',
	'src/content/courses/java/05-metodos-y-funciones.en.md',
	'src/content/courses/java/10-herencia-polimorfismo-y-sobrecarga.es.md',
	'src/content/courses/java/10-herencia-polimorfismo-y-sobrecarga.en.md',
	'src/content/courses/java/11-clases-abstractas-interfaces-y-modelado.es.md',
	'src/content/courses/java/11-clases-abstractas-interfaces-y-modelado.en.md',
];

for (const filePath of LESSON_FILES) {
	test(`${filePath} does not use throw (comes before the exceptions lesson)`, async () => {
		const content = await readFile(filePath, 'utf8');
		assert.doesNotMatch(
			content,
			/\bthrow\b/,
			`${filePath} should not use "throw" — exceptions are taught later, in lesson 12-excepciones-y-manejo-de-errores (order 13)`,
		);
	});
}

test('order-2 algorithms lesson (ES and EN) validates with a documented sentinel value instead of throwing', async () => {
	const [es, en] = await Promise.all([
		readFile('src/content/courses/java/23-algoritmia-verificacion-y-complejidad.es.md', 'utf8'),
		readFile('src/content/courses/java/23-algoritmia-verificacion-y-complejidad.en.md', 'utf8'),
	]);
	assert.match(es, /Integer\.MIN_VALUE/, 'ES lesson should return a documented sentinel value');
	assert.match(en, /Integer\.MIN_VALUE/, 'EN lesson should return a documented sentinel value');
});

test('herencia and clases-abstractas lessons (ES and EN) use the constructor default-value pattern instead of throwing', async () => {
	const files = [
		'src/content/courses/java/10-herencia-polimorfismo-y-sobrecarga.es.md',
		'src/content/courses/java/10-herencia-polimorfismo-y-sobrecarga.en.md',
		'src/content/courses/java/11-clases-abstractas-interfaces-y-modelado.es.md',
		'src/content/courses/java/11-clases-abstractas-interfaces-y-modelado.en.md',
	];
	for (const filePath of files) {
		const content = await readFile(filePath, 'utf8');
		assert.match(
			content,
			/System\.out\.println\(/,
			`${filePath} should print a notice when it falls back to a default value`,
		);
	}
});
