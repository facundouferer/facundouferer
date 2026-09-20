import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the herencia-polimorfismo-sobrecarga-java record', () => {
	const pres = presentations.find((p) => p.slug === 'herencia-polimorfismo-sobrecarga-java');
	assert.ok(pres, 'herencia-polimorfismo-sobrecarga-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '08-herencia-polimorfismo-y-sobrecarga');
	assert.equal(pres.image, '/img/presentations/herencia-polimorfismo-sobrecarga-java.svg');
});

test('getPresentationsForLesson maps to java/08-herencia-polimorfismo-y-sobrecarga', () => {
	const mapped = getPresentationsForLesson('java', '08-herencia-polimorfismo-y-sobrecarga');
	assert.ok(mapped.some((p) => p.slug === 'herencia-polimorfismo-sobrecarga-java'));
	const lesson = getLessonForPresentation('herencia-polimorfismo-sobrecarga-java');
	assert.deepEqual(lesson, { course: 'java', slug: '08-herencia-polimorfismo-y-sobrecarga' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/herencia-polimorfismo-sobrecarga-java.svg'));
});

test('presentation Astro component exists and contains 5 slides', async () => {
	assert.ok(existsSync('src/components/presentaciones/herencia-polimorfismo-sobrecarga-java.astro'));
	const content = await readFile('src/components/presentaciones/herencia-polimorfismo-sobrecarga-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /Es un|Tiene un/i);
	assert.match(content, /super\(\)/i);
	assert.match(content, /Sobrecarga|Overload/i);
	assert.match(content, /vtable|despacho/i);
});

test('both presentation detail pages import and map herencia-polimorfismo-sobrecarga-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /HerenciaPolimorfismoSobrecargaJava/);
		assert.match(content, /'herencia-polimorfismo-sobrecarga-java':\s*HerenciaPolimorfismoSobrecargaJava/);
	}
});
