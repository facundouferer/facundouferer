import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

// Lesson 07-constructores-y-encapsulamiento (order 9) is taught before
// exceptions (lesson 10-excepciones-y-manejo-de-errores, order 13). Neither the
// lesson nor its activities may rely on exceptions, throw, or try/catch: at
// this point in the course, students only know if/else, return values, and
// default values.

const LESSON_ES = 'src/content/courses/java/08-constructores-y-encapsulamiento.es.md';
const LESSON_EN = 'src/content/courses/java/08-constructores-y-encapsulamiento.en.md';
const ACTIVITIES_DIR = 'src/content/activities/java/07-constructores-y-encapsulamiento';

// "Exception" (capitalized, as in IllegalArgumentException / RuntimeException /
// a bare `Exception` type) is banned. Lowercase "exception(s)" used in prose
// (e.g. a forward-reference note pointing at the exceptions lesson) is fine.
const FORBIDDEN_PATTERNS = [
	{ name: 'throw', pattern: /\bthrow\b/ },
	{ name: 'catch (', pattern: /catch\s*\(/ },
	{ name: 'try {', pattern: /try\s*\{/ },
	{ name: 'Exception', pattern: /Exception/ },
];

function assertNoExceptionUsage(filePath, content) {
	for (const { name, pattern } of FORBIDDEN_PATTERNS) {
		assert.doesNotMatch(
			content,
			pattern,
			`${filePath} should not use "${name}" — exceptions are taught later, in lesson 10-excepciones-y-manejo-de-errores`,
		);
	}
}

test('constructors lesson (ES) does not use exceptions', async () => {
	const content = await readFile(LESSON_ES, 'utf8');
	assertNoExceptionUsage(LESSON_ES, content);
});

test('constructors lesson (EN) does not use exceptions', async () => {
	const content = await readFile(LESSON_EN, 'utf8');
	assertNoExceptionUsage(LESSON_EN, content);
});

test('constructors lesson (ES) forward-references the exceptions lesson', async () => {
	const content = await readFile(LESSON_ES, 'utf8');
	assert.match(content, /\/cursos\/java\/10-excepciones-y-manejo-de-errores/);
});

test('constructors lesson (EN) forward-references the exceptions lesson', async () => {
	const content = await readFile(LESSON_EN, 'utf8');
	assert.match(content, /\/en\/courses\/java\/10-excepciones-y-manejo-de-errores/);
});

test('constructors lesson (ES and EN) uses boolean-returning setters as the validation pattern', async () => {
	const [es, en] = await Promise.all([readFile(LESSON_ES, 'utf8'), readFile(LESSON_EN, 'utf8')]);
	assert.match(es, /public\s+boolean\s+set\w+\(/, 'ES lesson should demonstrate a boolean-returning setter');
	assert.match(en, /public\s+boolean\s+set\w+\(/, 'EN lesson should demonstrate a boolean-returning setter');
});

test('constructors lesson activities do not use exceptions', async () => {
	const files = (await readdir(ACTIVITIES_DIR)).filter((file) => file.endsWith('.es.md'));
	assert.ok(files.length >= 2, 'expected the project and quiz activities to exist');
	for (const file of files) {
		const filePath = `${ACTIVITIES_DIR}/${file}`;
		const content = await readFile(filePath, 'utf8');
		assertNoExceptionUsage(filePath, content);
	}
});

test('project activity uses boolean-returning validation instead of throwing', async () => {
	const content = await readFile(`${ACTIVITIES_DIR}/gestion-catalogo-biblioteca.es.md`, 'utf8');
	assert.match(content, /public\s+boolean\s+setPrecioReposicion/);
	assert.match(content, /public\s+boolean\s+prestar/);
});
