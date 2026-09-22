import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

// Lesson 07-constructores-y-encapsulamiento (order 9) is taught before the
// Java Collections Framework lesson (15-java-collections-framework-y-genericos,
// order 16). Its reference-leak example must use a plain array (String[]),
// not java.util.List / ArrayList, which are future-topic APIs at this point
// in the course.

const LESSON_ES = 'src/content/courses/java/08-constructores-y-encapsulamiento.es.md';
const LESSON_EN = 'src/content/courses/java/08-constructores-y-encapsulamiento.en.md';
const PRESENTATION = 'src/components/presentaciones/constructores-encapsulamiento-java.astro';
const ACTIVITIES_DIR = 'src/content/activities/java/07-constructores-y-encapsulamiento';

const FORBIDDEN_PATTERNS = [
	{ name: 'ArrayList', pattern: /\bArrayList\b/ },
	{ name: 'List<', pattern: /\bList</ },
];

function assertNoListUsage(filePath, content) {
	for (const { name, pattern } of FORBIDDEN_PATTERNS) {
		assert.doesNotMatch(
			content,
			pattern,
			`${filePath} should not use "${name}" — the Collections Framework is taught later, in lesson 15-java-collections-framework-y-genericos (order 16)`,
		);
	}
}

test('constructors lesson (ES) does not use List/ArrayList', async () => {
	const content = await readFile(LESSON_ES, 'utf8');
	assertNoListUsage(LESSON_ES, content);
});

test('constructors lesson (EN) does not use List/ArrayList', async () => {
	const content = await readFile(LESSON_EN, 'utf8');
	assertNoListUsage(LESSON_EN, content);
});

test('constructors lesson (ES and EN) uses a String[] array for the reference-leak example', async () => {
	const [es, en] = await Promise.all([readFile(LESSON_ES, 'utf8'), readFile(LESSON_EN, 'utf8')]);
	assert.match(es, /String\[\]\s+alumnos/, 'ES lesson should declare alumnos as a String[] array');
	assert.match(en, /String\[\]\s+students/, 'EN lesson should declare students as a String[] array');
});

test('constructores-encapsulamiento presentation does not use List/ArrayList', async () => {
	const content = await readFile(PRESENTATION, 'utf8');
	assertNoListUsage(PRESENTATION, content);
});

test('constructors lesson activities do not use List/ArrayList', async () => {
	const files = (await readdir(ACTIVITIES_DIR)).filter((file) => file.endsWith('.md'));
	assert.ok(files.length >= 2, 'expected the project and quiz activities to exist');
	for (const file of files) {
		const filePath = `${ACTIVITIES_DIR}/${file}`;
		const content = await readFile(filePath, 'utf8');
		assertNoListUsage(filePath, content);
	}
});
