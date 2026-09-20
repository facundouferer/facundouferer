import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the arrays-strings-memoria-java record', () => {
	const pres = presentations.find((p) => p.slug === 'arrays-strings-memoria-java');
	assert.ok(pres, 'arrays-strings-memoria-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '04-arrays-y-strings');
	assert.equal(pres.image, '/img/presentations/arrays-strings-memoria-java.svg');
});

test('getPresentationsForLesson maps to java/04-arrays-y-strings', () => {
	const mapped = getPresentationsForLesson('java', '04-arrays-y-strings');
	assert.ok(mapped.some((p) => p.slug === 'arrays-strings-memoria-java'));
	const lesson = getLessonForPresentation('arrays-strings-memoria-java');
	assert.deepEqual(lesson, { course: 'java', slug: '04-arrays-y-strings' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/arrays-strings-memoria-java.svg'));
});

test('presentation Astro component exists and contains 5 slides', async () => {
	assert.ok(existsSync('src/components/presentaciones/arrays-strings-memoria-java.astro'));
	const content = await readFile('src/components/presentaciones/arrays-strings-memoria-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /0x2000/);
	assert.match(content, /String Constant Pool/);
	assert.match(content, /StringBuilder/);
});

test('both presentation detail pages import and map arrays-strings-memoria-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /ArraysStringsMemoriaJava/);
		assert.match(content, /'arrays-strings-memoria-java':\s*ArraysStringsMemoriaJava/);
	}
});
