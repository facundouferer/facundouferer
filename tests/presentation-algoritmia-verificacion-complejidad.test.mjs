import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the algoritmia-verificacion-complejidad-java record', () => {
	const pres = presentations.find((p) => p.slug === 'algoritmia-verificacion-complejidad-java');
	assert.ok(pres, 'algoritmia-verificacion-complejidad-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '23-algoritmia-verificacion-y-complejidad');
	assert.equal(pres.image, '/img/presentations/algoritmia-verificacion-complejidad-java.svg');
});

test('getPresentationsForLesson maps to java/23-algoritmia-verificacion-y-complejidad', () => {
	const mapped = getPresentationsForLesson('java', '23-algoritmia-verificacion-y-complejidad');
	assert.ok(mapped.some((p) => p.slug === 'algoritmia-verificacion-complejidad-java'));
	const lesson = getLessonForPresentation('algoritmia-verificacion-complejidad-java');
	assert.deepEqual(lesson, { course: 'java', slug: '23-algoritmia-verificacion-y-complejidad' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/algoritmia-verificacion-complejidad-java.svg'));
});

test('presentation Astro component exists and contains 5 slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/algoritmia-verificacion-complejidad-java.astro'));
	const content = await readFile('src/components/presentaciones/algoritmia-verificacion-complejidad-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /Hoare/i);
	assert.match(content, /[Ii]nvariante/i);
	assert.match(content, /[Cc]orrección [Tt]otal|[Ff]unción [Cc]ota|V = n/i);
	assert.match(content, /Big-O/i);
	assert.match(content, /[Mm]ejor [Cc]aso|[Pp]eor [Cc]aso/i);
});

test('both presentation detail pages import and map algoritmia-verificacion-complejidad-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /AlgoritmiaVerificacionComplejidadJava/);
		assert.match(content, /'algoritmia-verificacion-complejidad-java':\s*AlgoritmiaVerificacionComplejidadJava/);
	}
});
