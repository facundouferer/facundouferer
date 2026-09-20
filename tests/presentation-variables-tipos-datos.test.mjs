import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the variables-tipos-datos-operadores-java record', () => {
	const pres = presentations.find((p) => p.slug === 'variables-tipos-datos-operadores-java');
	assert.ok(pres, 'variables-tipos-datos-operadores-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '02-variables-tipos-datos-y-operadores');
	assert.equal(pres.image, '/img/presentations/variables-tipos-datos-operadores-java.svg');
});

test('getPresentationsForLesson maps to java/02-variables-tipos-datos-y-operadores', () => {
	const mapped = getPresentationsForLesson('java', '02-variables-tipos-datos-y-operadores');
	assert.ok(mapped.some((p) => p.slug === 'variables-tipos-datos-operadores-java'));
	const lesson = getLessonForPresentation('variables-tipos-datos-operadores-java');
	assert.deepEqual(lesson, { course: 'java', slug: '02-variables-tipos-datos-y-operadores' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/variables-tipos-datos-operadores-java.svg'));
});

test('presentation Astro component exists and contains 5 slides', async () => {
	assert.ok(existsSync('src/components/presentaciones/variables-tipos-datos-operadores-java.astro'));
	const content = await readFile('src/components/presentaciones/variables-tipos-datos-operadores-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /byte/);
	assert.match(content, /Widening/);
	assert.match(content, /Cortocircuito/);
});

test('both presentation detail pages import and map variables-tipos-datos-operadores-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /VariablesTiposDatosOperadoresJava/);
		assert.match(content, /'variables-tipos-datos-operadores-java':\s*VariablesTiposDatosOperadoresJava/);
	}
});
