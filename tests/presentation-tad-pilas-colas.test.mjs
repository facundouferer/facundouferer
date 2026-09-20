import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the tad-pilas-colas-java record', () => {
	const pres = presentations.find((p) => p.slug === 'tad-pilas-colas-java');
	assert.ok(pres, 'tad-pilas-colas-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '12-tad-pilas-y-colas');
	assert.equal(pres.image, '/img/presentations/tad-pilas-colas-java.svg');
});

test('getPresentationsForLesson maps to java/12-tad-pilas-y-colas', () => {
	const mapped = getPresentationsForLesson('java', '12-tad-pilas-y-colas');
	assert.ok(mapped.some((p) => p.slug === 'tad-pilas-colas-java'));
	const lesson = getLessonForPresentation('tad-pilas-colas-java');
	assert.deepEqual(lesson, { course: 'java', slug: '12-tad-pilas-y-colas' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/tad-pilas-colas-java.svg'));
});

test('presentation Astro component exists and contains 6 slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/tad-pilas-colas-java.astro'));
	const content = await readFile('src/components/presentaciones/tad-pilas-colas-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /data-slide="6"/);
	assert.match(content, /LIFO/i);
	assert.match(content, /FIFO/i);
	assert.match(content, /Circular/i);
	assert.match(content, /Balance/i);
});

test('both presentation detail pages import and map tad-pilas-colas-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /TadPilasColasJava/);
		assert.match(content, /'tad-pilas-colas-java':\s*TadPilasColasJava/);
	}
});
