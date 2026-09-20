import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the concurrencia-hilos-pools-java record', () => {
	const pres = presentations.find((p) => p.slug === 'concurrencia-hilos-pools-java');
	assert.ok(pres, 'concurrencia-hilos-pools-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '19-programacion-concurrente-hilos-y-pools');
	assert.equal(pres.image, '/img/presentations/concurrencia-hilos-pools-java.svg');
});

test('getPresentationsForLesson maps to java/19-programacion-concurrente-hilos-y-pools', () => {
	const mapped = getPresentationsForLesson('java', '19-programacion-concurrente-hilos-y-pools');
	assert.ok(mapped.some((p) => p.slug === 'concurrencia-hilos-pools-java'));
	const lesson = getLessonForPresentation('concurrencia-hilos-pools-java');
	assert.deepEqual(lesson, { course: 'java', slug: '19-programacion-concurrente-hilos-y-pools' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/concurrencia-hilos-pools-java.svg'));
});

test('presentation Astro component exists and contains 5 slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/concurrencia-hilos-pools-java.astro'));
	const content = await readFile('src/components/presentaciones/concurrencia-hilos-pools-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /JMM|Stack vs Heap/i);
	assert.match(content, /Race Condition|count\+\+/i);
	assert.match(content, /synchronized|CAS|Atomic/i);
	assert.match(content, /Deadlock/i);
	assert.match(content, /Virtual Threads|Loom/i);
});

test('both presentation detail pages import and map concurrencia-hilos-pools-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /ConcurrenciaHilosPoolsJava/);
		assert.match(content, /'concurrencia-hilos-pools-java':\s*ConcurrenciaHilosPoolsJava/);
	}
});
