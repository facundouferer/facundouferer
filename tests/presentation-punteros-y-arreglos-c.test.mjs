import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

const SLUG = 'punteros-y-arreglos-c';
const COMPONENT = `src/components/presentaciones/${SLUG}.astro`;

test('catalog binds punteros-y-arreglos-c to the C lesson punteros-arreglos-y-estructuras', () => {
	const pres = presentations.find((p) => p.slug === SLUG);
	assert.ok(pres, `${SLUG} must be registered in the presentations catalog`);
	assert.equal(pres.lesson.course, 'c');
	assert.equal(pres.lesson.slug, 'punteros-arreglos-y-estructuras');
	assert.equal(pres.image, `/img/presentations/${SLUG}.svg`);
	assert.ok(getPresentationsForLesson('c', 'punteros-arreglos-y-estructuras').some((p) => p.slug === SLUG));
	assert.deepEqual(getLessonForPresentation(SLUG), { course: 'c', slug: 'punteros-arreglos-y-estructuras' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync(`public/img/presentations/${SLUG}.svg`));
});

test('component offers the three didactic modes as a segmented control', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.match(content, /class="pa-screen"/);
	assert.match(content, /role="radiogroup"/);
	for (const mode of ['learn', 'practice', 'assess']) {
		assert.match(content, new RegExp(`name="paMode" value="${mode}"`), `mode ${mode} must be selectable`);
	}
	assert.match(content, /'Aprender'/);
	assert.match(content, /'Practicar'/);
	assert.match(content, /'Evaluar'/);
	assert.match(content, /'Learn'/);
	assert.match(content, /'Practice'/);
	assert.match(content, /'Assess'/);
});

test('component has 8 learn slides, 6 practice items and 6 graded questions plus the result slide', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	for (let i = 1; i <= 21; i++) {
		assert.match(content, new RegExp(`data-slide="${i}"`), `slide ${i} must exist`);
	}
	assert.equal((content.match(/data-mode="learn" data-item/g) ?? []).length, 8);
	assert.equal((content.match(/data-mode="practice" data-item/g) ?? []).length, 6);
	assert.equal((content.match(/data-mode="assess" data-item/g) ?? []).length, 7);
	assert.match(content, /id="paGradeBtn"/);
	assert.match(content, /aria-live="polite"/);
});

test('component teaches the lesson key terms in both languages', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	for (const term of ['a[i] == *(a + i)', 'ptrdiff_t', '%td', 'sizeof v', '->', 'int **', 'void *', 'int (*f)(int, int)', "'\\\\0'", '0x1000']) {
		assert.ok(content.includes(term), `missing term ${term}`);
	}
	for (const es of ['decae a puntero', 'una posición después del final', 'comportamiento indefinido', 'promedio', 'mi_strlen', 'struct Punto', 'Las direcciones son ilustrativas']) {
		assert.ok(content.includes(es), `missing Spanish term ${es}`);
	}
	for (const en of ['decays to a pointer', 'one past the end', 'undefined behavior', 'average', 'my_strlen', 'struct Point', 'Addresses are illustrative']) {
		assert.ok(content.includes(en), `missing English term ${en}`);
	}
});

test('component uses Organic tokens only (no raw hex colors) and no voseo', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.equal((content.match(/(?<!&)#[0-9a-fA-F]{3,8}\b/g) ?? []).length, 0);
	assert.doesNotMatch(content, /\b(podés|tenés|sabés|querés|calculá|elegí|mirá)\b/);
});
