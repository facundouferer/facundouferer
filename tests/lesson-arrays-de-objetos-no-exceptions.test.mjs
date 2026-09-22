import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Lesson 09-arrays-de-objetos (order 10) is taught before exceptions (lesson
// 10-excepciones-y-manejo-de-errores, order 13). It may not use throw/try/catch
// syntax: at this point in the course, students only know if/else, return
// values, and default values (same pattern as the constructors lesson).
//
// Naming a JVM crash (NullPointerException, ArrayIndexOutOfBoundsException,
// ClassCastException) as prose describing what happens when you misuse an
// array is fine — that is the lesson's whole point and is not exception
// *syntax*. Only `throw`, `try {` and `catch (` are banned.

const LESSON_ES = 'src/content/courses/java/09-arrays-de-objetos.es.md';
const LESSON_EN = 'src/content/courses/java/09-arrays-de-objetos.en.md';

const FORBIDDEN_PATTERNS = [
	{ name: 'throw', pattern: /\bthrow\b/ },
	{ name: 'catch (', pattern: /catch\s*\(/ },
	{ name: 'try {', pattern: /\btry\s*\{/ },
];

function assertNoExceptionSyntax(filePath, content) {
	for (const { name, pattern } of FORBIDDEN_PATTERNS) {
		assert.doesNotMatch(
			content,
			pattern,
			`${filePath} should not use "${name}" — exceptions are taught later, in lesson 10-excepciones-y-manejo-de-errores`,
		);
	}
}

test('arrays-de-objetos lesson (ES) does not use throw/try/catch syntax', async () => {
	const content = await readFile(LESSON_ES, 'utf8');
	assertNoExceptionSyntax(LESSON_ES, content);
});

test('arrays-de-objetos lesson (EN) does not use throw/try/catch syntax', async () => {
	const content = await readFile(LESSON_EN, 'utf8');
	assertNoExceptionSyntax(LESSON_EN, content);
});

test('arrays-de-objetos lesson (ES and EN) still names JVM crashes as prose (not banned)', async () => {
	const [es, en] = await Promise.all([readFile(LESSON_ES, 'utf8'), readFile(LESSON_EN, 'utf8')]);
	assert.match(es, /NullPointerException/);
	assert.match(en, /NullPointerException/);
});

test('Registro/Registry.eliminar/remove is boolean-returning, not throwing', async () => {
	const [es, en] = await Promise.all([readFile(LESSON_ES, 'utf8'), readFile(LESSON_EN, 'utf8')]);
	assert.match(es, /public\s+boolean\s+eliminar\(int indice\)/);
	assert.match(en, /public\s+boolean\s+remove\(int index\)/);
});

test('Agenda/AddressBook agregar+eliminar (add+remove) are boolean-returning, not throwing', async () => {
	const [es, en] = await Promise.all([readFile(LESSON_ES, 'utf8'), readFile(LESSON_EN, 'utf8')]);
	assert.match(es, /public\s+boolean\s+agregar\(Contacto c\)/);
	assert.match(es, /public\s+boolean\s+eliminar\(int indice\)/g);
	assert.match(en, /public\s+boolean\s+add\(Contact c\)/);
	assert.match(en, /public\s+boolean\s+remove\(int index\)/g);
});

test('arrays-de-objetos lesson (ES and EN) does not claim invalid input prevents the object from existing', async () => {
	const [es, en] = await Promise.all([readFile(LESSON_ES, 'utf8'), readFile(LESSON_EN, 'utf8')]);
	assert.doesNotMatch(es, /ni siquiera llega a existir/);
	assert.doesNotMatch(en, /never comes into existence/);
	assert.match(es, /valor por defecto seguro/);
	assert.match(en, /safe default/);
});
