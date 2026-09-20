import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the arboles-n-arios-vectores-java record', () => {
	const pres = presentations.find((p) => p.slug === 'arboles-n-arios-vectores-java');
	assert.ok(pres, 'arboles-n-arios-vectores-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '26-arboles-n-arios-y-representacion-con-vectores');
	assert.equal(pres.image, '/img/presentations/arboles-n-arios-vectores-java.svg');
});

test('getPresentationsForLesson maps to java/26-arboles-n-arios-y-representacion-con-vectores', () => {
	const mapped = getPresentationsForLesson('java', '26-arboles-n-arios-y-representacion-con-vectores');
	assert.ok(mapped.some((p) => p.slug === 'arboles-n-arios-vectores-java'));
	const lesson = getLessonForPresentation('arboles-n-arios-vectores-java');
	assert.deepEqual(lesson, { course: 'java', slug: '26-arboles-n-arios-y-representacion-con-vectores' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/arboles-n-arios-vectores-java.svg'));
});

test('presentation Astro component exists and contains 7 slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/arboles-n-arios-vectores-java.astro'));
	const content = await readFile('src/components/presentaciones/arboles-n-arios-vectores-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /data-slide="6"/);
	assert.match(content, /data-slide="7"/);
	assert.match(content, /primerHijo/);
	assert.match(content, /siguienteHermano/);
	assert.match(content, /LCRS/);
	assert.match(content, /Preorden|preorder/i);
	assert.match(content, /padre\[i\]|padre\[/);
	assert.match(content, /padre\[p\]|O\(1\)/);
	assert.match(content, /O\(N\)/);
	assert.match(content, /K-ari|ternari|K =? ?3/i);
	assert.match(content, /3.?i.?\+.?j|3i \+ j/i);
});

test('both presentation detail pages import and map arboles-n-arios-vectores-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /ArbolesNAriosVectoresJava/);
		assert.match(content, /'arboles-n-arios-vectores-java':\s*ArbolesNAriosVectoresJava/);
	}
});
