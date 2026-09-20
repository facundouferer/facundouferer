import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the grafos-algoritmos-java record', () => {
	const pres = presentations.find((p) => p.slug === 'grafos-algoritmos-java');
	assert.ok(pres, 'grafos-algoritmos-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '16-grafos-representacion-y-algoritmos');
	assert.equal(pres.image, '/img/presentations/grafos-algoritmos-java.svg');
});

test('getPresentationsForLesson maps to java/16-grafos-representacion-y-algoritmos', () => {
	const mapped = getPresentationsForLesson('java', '16-grafos-representacion-y-algoritmos');
	assert.ok(mapped.some((p) => p.slug === 'grafos-algoritmos-java'));
	const lesson = getLessonForPresentation('grafos-algoritmos-java');
	assert.deepEqual(lesson, { course: 'java', slug: '16-grafos-representacion-y-algoritmos' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/grafos-algoritmos-java.svg'));
});

test('presentation Astro component exists and contains 6 slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/grafos-algoritmos-java.astro'));
	const content = await readFile('src/components/presentaciones/grafos-algoritmos-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /data-slide="6"/);
	assert.match(content, /BFS|Breadth-First/i);
	assert.match(content, /DFS|Depth-First/i);
	assert.match(content, /Dijkstra/i);
	assert.match(content, /Floyd/i);
});

test('both presentation detail pages import and map grafos-algoritmos-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /GrafosAlgoritmosJava/);
		assert.match(content, /'grafos-algoritmos-java':\s*GrafosAlgoritmosJava/);
	}
});
