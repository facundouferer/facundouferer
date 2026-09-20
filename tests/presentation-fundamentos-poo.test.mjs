import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the fundamentos-poo-clases-objetos-java record', () => {
	const pres = presentations.find((p) => p.slug === 'fundamentos-poo-clases-objetos-java');
	assert.ok(pres, 'fundamentos-poo-clases-objetos-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '07-fundamentos-poo-clases-y-objetos');
	assert.equal(pres.image, '/img/presentations/fundamentos-poo-clases-objetos-java.svg');
});

test('getPresentationsForLesson maps to java/07-fundamentos-poo-clases-y-objetos', () => {
	const mapped = getPresentationsForLesson('java', '07-fundamentos-poo-clases-y-objetos');
	assert.ok(mapped.some((p) => p.slug === 'fundamentos-poo-clases-objetos-java'));
	const lesson = getLessonForPresentation('fundamentos-poo-clases-objetos-java');
	assert.deepEqual(lesson, { course: 'java', slug: '07-fundamentos-poo-clases-y-objetos' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/fundamentos-poo-clases-objetos-java.svg'));
});

test('presentation Astro component exists and contains 4 slides', async () => {
	assert.ok(existsSync('src/components/presentaciones/fundamentos-poo-clases-objetos-java.astro'));
	const content = await readFile('src/components/presentaciones/fundamentos-poo-clases-objetos-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /Plano/);
	assert.match(content, /Persona/);
	assert.match(content, /this/);
	assert.match(content, /Aliasing/);
});

test('both presentation detail pages import and map fundamentos-poo-clases-objetos-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /FundamentosPooClasesObjetosJava/);
		assert.match(content, /'fundamentos-poo-clases-objetos-java':\s*FundamentosPooClasesObjetosJava/);
	}
});
