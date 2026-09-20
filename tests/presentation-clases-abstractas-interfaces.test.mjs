import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the clases-abstractas-interfaces-java record', () => {
	const pres = presentations.find((p) => p.slug === 'clases-abstractas-interfaces-java');
	assert.ok(pres, 'clases-abstractas-interfaces-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '09-clases-abstractas-interfaces-y-modelado');
	assert.equal(pres.image, '/img/presentations/clases-abstractas-interfaces-java.svg');
});

test('getPresentationsForLesson maps to java/09-clases-abstractas-interfaces-y-modelado', () => {
	const mapped = getPresentationsForLesson('java', '09-clases-abstractas-interfaces-y-modelado');
	assert.ok(mapped.some((p) => p.slug === 'clases-abstractas-interfaces-java'));
	const lesson = getLessonForPresentation('clases-abstractas-interfaces-java');
	assert.deepEqual(lesson, { course: 'java', slug: '09-clases-abstractas-interfaces-y-modelado' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/clases-abstractas-interfaces-java.svg'));
});

test('presentation Astro component exists and contains 7 slides', async () => {
	assert.ok(existsSync('src/components/presentaciones/clases-abstractas-interfaces-java.astro'));
	const content = await readFile('src/components/presentaciones/clases-abstractas-interfaces-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /data-slide="6"/);
	assert.match(content, /data-slide="7"/);
	assert.match(content, /Clase Abstracta|Abstract Class/i);
	assert.match(content, /Interface/i);
	assert.match(content, /default/i);
	assert.match(content, /Agregaci|Composici/i);
});

test('both presentation detail pages import and map clases-abstractas-interfaces-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /ClasesAbstractasInterfacesJava/);
		assert.match(content, /'clases-abstractas-interfaces-java':\s*ClasesAbstractasInterfacesJava/);
	}
});
