import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the collections-framework-genericos-java record', () => {
	const pres = presentations.find((p) => p.slug === 'collections-framework-genericos-java');
	assert.ok(pres, 'collections-framework-genericos-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '13-java-collections-framework-y-genericos');
	assert.equal(pres.image, '/img/presentations/collections-framework-genericos-java.svg');
});

test('getPresentationsForLesson maps to java/13-java-collections-framework-y-genericos', () => {
	const mapped = getPresentationsForLesson('java', '13-java-collections-framework-y-genericos');
	assert.ok(mapped.some((p) => p.slug === 'collections-framework-genericos-java'));
	const lesson = getLessonForPresentation('collections-framework-genericos-java');
	assert.deepEqual(lesson, { course: 'java', slug: '13-java-collections-framework-y-genericos' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/collections-framework-genericos-java.svg'));
});

test('presentation Astro component exists and contains 7 slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/collections-framework-genericos-java.astro'));
	const content = await readFile('src/components/presentaciones/collections-framework-genericos-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /data-slide="6"/);
	assert.match(content, /data-slide="7"/);
	assert.match(content, /HashMap/i);
	assert.match(content, /Bucket|Cubeta/i);
	assert.match(content, /Erasure/i);
});

test('both presentation detail pages import and map collections-framework-genericos-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /CollectionsFrameworkGenericosJava/);
		assert.match(content, /'collections-framework-genericos-java':\s*CollectionsFrameworkGenericosJava/);
	}
});
