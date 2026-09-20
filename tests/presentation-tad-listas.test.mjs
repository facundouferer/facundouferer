import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the tad-listas-enlazadas-java record', () => {
	const pres = presentations.find((p) => p.slug === 'tad-listas-enlazadas-java');
	assert.ok(pres, 'tad-listas-enlazadas-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '11-tad-listas-estaticas-y-dinamicas');
	assert.equal(pres.image, '/img/presentations/tad-listas-enlazadas-java.svg');
});

test('getPresentationsForLesson maps to java/11-tad-listas-estaticas-y-dinamicas', () => {
	const mapped = getPresentationsForLesson('java', '11-tad-listas-estaticas-y-dinamicas');
	assert.ok(mapped.some((p) => p.slug === 'tad-listas-enlazadas-java'));
	const lesson = getLessonForPresentation('tad-listas-enlazadas-java');
	assert.deepEqual(lesson, { course: 'java', slug: '11-tad-listas-estaticas-y-dinamicas' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/tad-listas-enlazadas-java.svg'));
});

test('presentation Astro component exists and contains 8 slides', async () => {
	assert.ok(existsSync('src/components/presentaciones/tad-listas-enlazadas-java.astro'));
	const content = await readFile('src/components/presentaciones/tad-listas-enlazadas-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /data-slide="6"/);
	assert.match(content, /data-slide="7"/);
	assert.match(content, /data-slide="8"/);
	assert.match(content, /TAD|ADT/i);
	assert.match(content, /Contigua|Dispers/i);
	assert.match(content, /Nodo|Node/i);
	assert.match(content, /O\(1\)|O\(N\)/);
});

test('both presentation detail pages import and map tad-listas-enlazadas-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /TadListasEnlazadasJava/);
		assert.match(content, /'tad-listas-enlazadas-java':\s*TadListasEnlazadasJava/);
	}
});
