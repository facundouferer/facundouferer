import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the paquetes-namespaces-java record', () => {
	const pres = presentations.find((p) => p.slug === 'paquetes-namespaces-java');
	assert.ok(pres, 'paquetes-namespaces-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '09-clases-abstractas-interfaces-y-modelado');
	assert.equal(pres.image, '/img/presentations/paquetes-namespaces-java.svg');
});

test('getPresentationsForLesson maps to java/09-clases-abstractas-interfaces-y-modelado', () => {
	const mapped = getPresentationsForLesson('java', '09-clases-abstractas-interfaces-y-modelado');
	assert.ok(mapped.some((p) => p.slug === 'paquetes-namespaces-java'));
	const lesson = getLessonForPresentation('paquetes-namespaces-java');
	assert.deepEqual(lesson, { course: 'java', slug: '09-clases-abstractas-interfaces-y-modelado' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/paquetes-namespaces-java.svg'));
});

test('presentation Astro component exists and contains slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/paquetes-namespaces-java.astro'));
	const content = await readFile('src/components/presentaciones/paquetes-namespaces-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /data-slide="6"/);
	assert.match(content, /package/);
	assert.match(content, /FQCN/);
	assert.match(content, /import/);
	assert.match(content, /java\.sql\.Date/);
	assert.match(content, /package-private/);
	assert.match(content, /[Dd]ominio invertido|[Rr]everse[d]? domain/);
});

test('both presentation detail pages import and map paquetes-namespaces-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /PaquetesNamespacesJava/);
		assert.match(content, /'paquetes-namespaces-java':\s*PaquetesNamespacesJava/);
	}
});
