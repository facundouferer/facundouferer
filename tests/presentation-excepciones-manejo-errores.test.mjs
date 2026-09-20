import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the excepciones-manejo-errores-java record', () => {
	const pres = presentations.find((p) => p.slug === 'excepciones-manejo-errores-java');
	assert.ok(pres, 'excepciones-manejo-errores-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '10-excepciones-y-manejo-de-errores');
	assert.equal(pres.image, '/img/presentations/excepciones-manejo-errores-java.svg');
});

test('getPresentationsForLesson maps to java/10-excepciones-y-manejo-de-errores', () => {
	const mapped = getPresentationsForLesson('java', '10-excepciones-y-manejo-de-errores');
	assert.ok(mapped.some((p) => p.slug === 'excepciones-manejo-errores-java'));
	const lesson = getLessonForPresentation('excepciones-manejo-errores-java');
	assert.deepEqual(lesson, { course: 'java', slug: '10-excepciones-y-manejo-de-errores' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/excepciones-manejo-errores-java.svg'));
});

test('presentation Astro component exists and contains 7 slides', async () => {
	assert.ok(existsSync('src/components/presentaciones/excepciones-manejo-errores-java.astro'));
	const content = await readFile('src/components/presentaciones/excepciones-manejo-errores-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /data-slide="6"/);
	assert.match(content, /data-slide="7"/);
	assert.match(content, /Throwable/i);
	assert.match(content, /Call Stack|Pila de Llamadas/i);
	assert.match(content, /try-with-resources/i);
	assert.match(content, /finally/i);
});

test('both presentation detail pages import and map excepciones-manejo-errores-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /ExcepcionesManejoErroresJava/);
		assert.match(content, /'excepciones-manejo-errores-java':\s*ExcepcionesManejoErroresJava/);
	}
});
