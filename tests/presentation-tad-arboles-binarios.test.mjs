import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the tad-arboles-binarios-busqueda-java record', () => {
	const pres = presentations.find((p) => p.slug === 'tad-arboles-binarios-busqueda-java');
	assert.ok(pres, 'tad-arboles-binarios-busqueda-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '15-tad-arboles-binarios-y-busqueda');
	assert.equal(pres.image, '/img/presentations/tad-arboles-binarios-busqueda-java.svg');
});

test('getPresentationsForLesson maps to java/15-tad-arboles-binarios-y-busqueda', () => {
	const mapped = getPresentationsForLesson('java', '15-tad-arboles-binarios-y-busqueda');
	assert.ok(mapped.some((p) => p.slug === 'tad-arboles-binarios-busqueda-java'));
	const lesson = getLessonForPresentation('tad-arboles-binarios-busqueda-java');
	assert.deepEqual(lesson, { course: 'java', slug: '15-tad-arboles-binarios-y-busqueda' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/tad-arboles-binarios-busqueda-java.svg'));
});

test('presentation Astro component exists and contains 7 slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/tad-arboles-binarios-busqueda-java.astro'));
	const content = await readFile('src/components/presentaciones/tad-arboles-binarios-busqueda-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /data-slide="6"/);
	assert.match(content, /data-slide="7"/);
	assert.match(content, /ABB|BST/i);
	assert.match(content, /Inorden|Preorden|Postorden/i);
	assert.match(content, /Sucesor|Elimina/i);
});

test('both presentation detail pages import and map tad-arboles-binarios-busqueda-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /TadArbolesBinariosBusquedaJava/);
		assert.match(content, /'tad-arboles-binarios-busqueda-java':\s*TadArbolesBinariosBusquedaJava/);
	}
});
