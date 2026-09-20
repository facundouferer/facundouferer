import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the conceptos-basicos-jvm-java record', () => {
	const pres = presentations.find((p) => p.slug === 'conceptos-basicos-jvm-java');
	assert.ok(pres, 'conceptos-basicos-jvm-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '01-conceptos-basicos');
	assert.equal(pres.image, '/img/presentations/conceptos-basicos-jvm-java.svg');
});

test('getPresentationsForLesson maps to java/01-conceptos-basicos', () => {
	const mapped = getPresentationsForLesson('java', '01-conceptos-basicos');
	assert.ok(mapped.some((p) => p.slug === 'conceptos-basicos-jvm-java'));
	const lesson = getLessonForPresentation('conceptos-basicos-jvm-java');
	assert.deepEqual(lesson, { course: 'java', slug: '01-conceptos-basicos' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/conceptos-basicos-jvm-java.svg'));
});

test('presentation Astro component exists and contains 5 slides', async () => {
	assert.ok(existsSync('src/components/presentaciones/conceptos-basicos-jvm-java.astro'));
	const content = await readFile('src/components/presentaciones/conceptos-basicos-jvm-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /public static void main/);
	assert.match(content, /ClassLoader/);
	assert.match(content, /Bytecode/);
});

test('both presentation detail pages import and map conceptos-basicos-jvm-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /ConceptosBasicosJvmJava/);
		assert.match(content, /'conceptos-basicos-jvm-java':\s*ConceptosBasicosJvmJava/);
	}
});
