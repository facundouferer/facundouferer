import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

const SLUG = 'tipos-sizeof-conversiones-c';
const COMPONENT = `src/components/presentaciones/${SLUG}.astro`;

test('catalog binds the C types presentation to the C lesson tipos-de-datos', () => {
	const pres = presentations.find((p) => p.slug === SLUG);
	assert.ok(pres, `${SLUG} must be registered in the presentations catalog`);
	assert.deepEqual(pres.lesson, { course: 'c', slug: 'tipos-de-datos' });
	assert.equal(pres.image, `/img/presentations/${SLUG}.svg`);
	assert.deepEqual(getLessonForPresentation(SLUG), { course: 'c', slug: 'tipos-de-datos' });

	const mapped = getPresentationsForLesson('c', 'tipos-de-datos').map((p) => p.slug);
	assert.ok(mapped.includes(SLUG));
	assert.ok(!mapped.includes('tipos_de_datos_en_javascript'), 'the JavaScript deck is no longer linked to the C lesson');
});

test('card SVG asset exists', () => {
	assert.ok(existsSync(`public/img/presentations/${SLUG}.svg`));
});

test('component offers the three didactic modes as a segmented control', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	for (const mode of ['learn', 'practice', 'assess']) {
		assert.match(content, new RegExp(`name="ts-mode" value="${mode}"`));
		assert.match(content, new RegExp(`data-mode="${mode}"`));
	}
	for (const label of ['Aprender', 'Learn', 'Practicar', 'Practice', 'Evaluar', 'Assess']) {
		assert.ok(content.includes(`'${label}'`), `missing mode label ${label}`);
	}
});

test('learn mode renders eight slides with a step control', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.match(content, /data-slide=\{si \+ 1\}/);
	const slides = content.slice(content.indexOf('const learn'), content.indexOf('interface PracticeItem'));
	assert.equal((slides.match(/^\t\ttitle: L\(/gm) ?? []).length, 8, 'eight learn slides');
	assert.match(content, /ts-step-next/);
	assert.match(content, /ts-step-prev/);
});

test('practice has six predict-the-next-state items and assess has six graded questions', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	const practice = content.slice(content.indexOf('const practice'), content.indexOf('interface AssessItem'));
	const assess = content.slice(content.indexOf('const assess'), content.indexOf('const lines'));
	assert.equal((practice.match(/^\t\tafter: \[/gm) ?? []).length, 6);
	assert.equal((assess.match(/^\t\tanswer: \d,$/gm) ?? []).length, 6);
	assert.match(content, /id="tsGradeBtn"/);
	assert.match(content, /aria-live="polite"/);
});

test('component covers the key terms of the lesson in both languages', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	for (const term of ['sizeof', 'size_t', '%zu', '<limits.h>', 'INT_MAX', 'UINT_MAX', 'CHAR_BIT', 'bool', '<stdbool.h>', '(double)', '-1 < 1u']) {
		assert.ok(content.includes(term), `missing term ${term}`);
	}
	for (const [es, en] of [
		['comportamiento indefinido', 'undefined behavior'],
		['da la vuelta', 'wraps around'],
		['Promoción entera', 'Integer promotion'],
		['Conversión aritmética usual', 'Usual arithmetic conversion'],
		['Conversión implícita', 'Implicit conversion'],
		['división entera', 'integer division'],
		['entero pequeño', 'small integer'],
	]) {
		assert.ok(content.toLowerCase().includes(es.toLowerCase()), `missing Spanish term ${es}`);
		assert.ok(content.toLowerCase().includes(en.toLowerCase()), `missing English term ${en}`);
	}
	assert.match(content, /0x1000/);
	assert.match(content, /ilustrativas/);
	assert.match(content, /illustrative/);
});

test('component uses Organic tokens only (no raw hex colors) and Lucide stroke width', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.equal((content.match(/(?<!&)#[0-9a-fA-F]{3,8}\b/g) ?? []).length, 0);
	for (const width of content.match(/stroke-width="[0-9.]+"/g) ?? []) {
		assert.equal(width, 'stroke-width="2.75"');
	}
	assert.doesNotMatch(content, /\bvos\b|\bpodés\b|\btenés\b|\bfijate\b/i, 'no voseo');
});
