import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the arrays-de-objetos-java record', () => {
	const pres = presentations.find((p) => p.slug === 'arrays-de-objetos-java');
	assert.ok(pres, 'arrays-de-objetos-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '09-arrays-de-objetos');
	assert.equal(pres.image, '/img/presentations/arrays-de-objetos-java.svg');
});

test('getPresentationsForLesson maps to java/09-arrays-de-objetos', () => {
	const mapped = getPresentationsForLesson('java', '09-arrays-de-objetos');
	assert.ok(mapped.some((p) => p.slug === 'arrays-de-objetos-java'));
	const lesson = getLessonForPresentation('arrays-de-objetos-java');
	assert.deepEqual(lesson, { course: 'java', slug: '09-arrays-de-objetos' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/arrays-de-objetos-java.svg'));
});

test('presentation Astro component exists and contains 5 slides', async () => {
	assert.ok(existsSync('src/components/presentaciones/arrays-de-objetos-java.astro'));
	const content = await readFile('src/components/presentaciones/arrays-de-objetos-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /Doble Nivel|Two Levels/i);
	assert.match(content, /NullPointerException/i);
	assert.match(content, /Capacidad|Capacity/i);
	assert.match(content, /Comparable|Comparator/i);
});

test('both presentation detail pages import and map arrays-de-objetos-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /ArraysDeObjetosJava/);
		assert.match(content, /'arrays-de-objetos-java':\s*ArraysDeObjetosJava/);
	}
});
