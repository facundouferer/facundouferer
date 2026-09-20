import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the depuracion-codigo-limpio-java record', () => {
	const pres = presentations.find((p) => p.slug === 'depuracion-codigo-limpio-java');
	assert.ok(pres, 'depuracion-codigo-limpio-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '27-depuracion-codigo-limpio-y-refactorizacion');
	assert.equal(pres.image, '/img/presentations/depuracion-codigo-limpio-java.svg');
});

test('getPresentationsForLesson maps to java/27-depuracion-codigo-limpio-y-refactorizacion', () => {
	const mapped = getPresentationsForLesson('java', '27-depuracion-codigo-limpio-y-refactorizacion');
	assert.ok(mapped.some((p) => p.slug === 'depuracion-codigo-limpio-java'));
	const lesson = getLessonForPresentation('depuracion-codigo-limpio-java');
	assert.deepEqual(lesson, { course: 'java', slug: '27-depuracion-codigo-limpio-y-refactorizacion' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/depuracion-codigo-limpio-java.svg'));
});

test('presentation Astro component exists and contains 5 slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/depuracion-codigo-limpio-java.astro'));
	const content = await readFile('src/components/presentaciones/depuracion-codigo-limpio-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /Stack Trace|NullPointerException/i);
	assert.match(content, /Step Over|Step Into|breakpoint/i);
	assert.match(content, /Long Method|Primitive Obsession|Feature Envy|God Class/i);
	assert.match(content, /JUnit|Guard Claus/i);
	assert.match(content, /IVA_GENERAL|calcularDescuentoVolumen/i);
});

test('both presentation detail pages import and map depuracion-codigo-limpio-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /DepuracionCodigoLimpioJava/);
		assert.match(content, /'depuracion-codigo-limpio-java':\s*DepuracionCodigoLimpioJava/);
	}
});
