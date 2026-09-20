import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the control-flujo-bucles-java record', () => {
	const pres = presentations.find((p) => p.slug === 'control-flujo-bucles-java');
	assert.ok(pres, 'control-flujo-bucles-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '03-control-de-flujo-y-bucles');
	assert.equal(pres.image, '/img/presentations/control-flujo-bucles-java.svg');
});

test('getPresentationsForLesson maps to java/03-control-de-flujo-y-bucles', () => {
	const mapped = getPresentationsForLesson('java', '03-control-de-flujo-y-bucles');
	assert.ok(mapped.some((p) => p.slug === 'control-flujo-bucles-java'));
	const lesson = getLessonForPresentation('control-flujo-bucles-java');
	assert.deepEqual(lesson, { course: 'java', slug: '03-control-de-flujo-y-bucles' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/control-flujo-bucles-java.svg'));
});

test('presentation Astro component exists and contains 6 slides', async () => {
	assert.ok(existsSync('src/components/presentaciones/control-flujo-bucles-java.astro'));
	const content = await readFile('src/components/presentaciones/control-flujo-bucles-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /data-slide="6"/);
	assert.match(content, /switch/i);
	assert.match(content, /while/i);
	assert.match(content, /break/i);
});

test('both presentation detail pages import and map control-flujo-bucles-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /ControlFlujoBuclesJava/);
		assert.match(content, /'control-flujo-bucles-java':\s*ControlFlujoBuclesJava/);
	}
});
