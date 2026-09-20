import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the iteradores-ordenamiento-equals-hashcode-java record', () => {
	const pres = presentations.find((p) => p.slug === 'iteradores-ordenamiento-equals-hashcode-java');
	assert.ok(pres, 'iteradores-ordenamiento-equals-hashcode-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '14-iteradores-ordenamiento-equals-hashcode');
	assert.equal(pres.image, '/img/presentations/iteradores-ordenamiento-equals-hashcode-java.svg');
});

test('getPresentationsForLesson maps to java/14-iteradores-ordenamiento-equals-hashcode', () => {
	const mapped = getPresentationsForLesson('java', '14-iteradores-ordenamiento-equals-hashcode');
	assert.ok(mapped.some((p) => p.slug === 'iteradores-ordenamiento-equals-hashcode-java'));
	const lesson = getLessonForPresentation('iteradores-ordenamiento-equals-hashcode-java');
	assert.deepEqual(lesson, { course: 'java', slug: '14-iteradores-ordenamiento-equals-hashcode' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/iteradores-ordenamiento-equals-hashcode-java.svg'));
});

test('presentation Astro component exists and contains 7 slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/iteradores-ordenamiento-equals-hashcode-java.astro'));
	const content = await readFile('src/components/presentaciones/iteradores-ordenamiento-equals-hashcode-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /data-slide="6"/);
	assert.match(content, /data-slide="7"/);
	assert.match(content, /ConcurrentModificationException/i);
	assert.match(content, /Comparable|Comparator/i);
	assert.match(content, /hashCode/i);
});

test('both presentation detail pages import and map iteradores-ordenamiento-equals-hashcode-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /IteradoresOrdenamientoEqualsHashcodeJava/);
		assert.match(content, /'iteradores-ordenamiento-equals-hashcode-java':\s*IteradoresOrdenamientoEqualsHashcodeJava/);
	}
});
