import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the constructores-encapsulamiento-java record', () => {
	const pres = presentations.find((p) => p.slug === 'constructores-encapsulamiento-java');
	assert.ok(pres, 'constructores-encapsulamiento-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '07-constructores-y-encapsulamiento');
	assert.equal(pres.image, '/img/presentations/constructores-encapsulamiento-java.svg');
});

test('getPresentationsForLesson maps to java/07-constructores-y-encapsulamiento', () => {
	const mapped = getPresentationsForLesson('java', '07-constructores-y-encapsulamiento');
	assert.ok(mapped.some((p) => p.slug === 'constructores-encapsulamiento-java'));
	const lesson = getLessonForPresentation('constructores-encapsulamiento-java');
	assert.deepEqual(lesson, { course: 'java', slug: '07-constructores-y-encapsulamiento' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/constructores-encapsulamiento-java.svg'));
});

test('presentation Astro component exists and contains 5 slides', async () => {
	assert.ok(existsSync('src/components/presentaciones/constructores-encapsulamiento-java.astro'));
	const content = await readFile('src/components/presentaciones/constructores-encapsulamiento-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /Invariante/i);
	assert.match(content, /this\(\)/i);
	assert.match(content, /Fuga de Referencia/i);
	assert.match(content, /Inmutabilidad/i);
});

test('both presentation detail pages import and map constructores-encapsulamiento-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /ConstructoresEncapsulamientoJava/);
		assert.match(content, /'constructores-encapsulamiento-java':\s*ConstructoresEncapsulamientoJava/);
	}
});
