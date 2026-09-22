import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// The exceptions lesson (order 13) opens by referencing what the student
// wrote in the constructors lesson (order 9). That lesson was rewritten to
// validate with a boolean-returning setter and a safe default instead of
// throwing, so the exceptions lesson's hook must reference that pattern
// (not a `throw new IllegalArgumentException(...)` example that no longer
// exists there) and use its silent-failure gap as the motivation for
// exceptions.

const LESSON_ES = 'src/content/courses/java/12-excepciones-y-manejo-de-errores.es.md';
const LESSON_EN = 'src/content/courses/java/12-excepciones-y-manejo-de-errores.en.md';

test('exceptions lesson (ES) hook references the boolean-returning setter from the constructors lesson, not the old throw example', async () => {
	const content = await readFile(LESSON_ES, 'utf8');
	assert.match(content, /\[Constructores, Modificadores de Acceso y Getters\/Setters\]\(\/cursos\/java\/07-constructores-y-encapsulamiento\)/);
	assert.match(content, /public\s+boolean\s+setPrecio\(/);
	assert.doesNotMatch(content, /if\s*\(precio\s*<\s*0\)\s*\{\s*\n\s*throw new IllegalArgumentException/);
});

test('exceptions lesson (EN) hook references the boolean-returning setter from the constructors lesson, not the old throw example', async () => {
	const content = await readFile(LESSON_EN, 'utf8');
	assert.match(content, /\[Constructors, Access Modifiers, and Getters\/Setters\]\(\/en\/courses\/java\/07-constructores-y-encapsulamiento\)/);
	assert.match(content, /public\s+boolean\s+setPrice\(/);
	assert.doesNotMatch(content, /if\s*\(price\s*<\s*0\)\s*\{\s*\n\s*throw new IllegalArgumentException/);
});

test('exceptions lesson (ES and EN) motivates exceptions with the silent-failure gap of an ignored boolean return', async () => {
	const [es, en] = await Promise.all([readFile(LESSON_ES, 'utf8'), readFile(LESSON_EN, 'utf8')]);
	assert.match(es, /ignorar por accidente/);
	assert.match(en, /ignored by accident/);
});

test('exceptions lesson (ES and EN) still teaches throw/try/catch — that is what this lesson is for', async () => {
	const [es, en] = await Promise.all([readFile(LESSON_ES, 'utf8'), readFile(LESSON_EN, 'utf8')]);
	assert.match(es, /\bthrow\b/);
	assert.match(es, /catch\s*\(/);
	assert.match(en, /\bthrow\b/);
	assert.match(en, /catch\s*\(/);
});
