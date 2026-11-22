import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

const SLUG = 'punteros-y-direcciones-c';
const COMPONENT = `src/components/presentaciones/${SLUG}.astro`;

test('presentations catalog binds punteros-y-direcciones-c to the C lesson', () => {
	const pres = presentations.find((p) => p.slug === SLUG);
	assert.ok(pres, `${SLUG} must be registered in the presentations array`);
	assert.deepEqual(pres.lesson, { course: 'c', slug: 'punteros-y-direcciones' });
	assert.equal(pres.image, `/img/presentations/${SLUG}.svg`);
	assert.ok(getPresentationsForLesson('c', 'punteros-y-direcciones').some((p) => p.slug === SLUG));
	assert.deepEqual(getLessonForPresentation(SLUG), { course: 'c', slug: 'punteros-y-direcciones' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync(`public/img/presentations/${SLUG}.svg`));
});

test('component offers the three didactic modes as a segmented control', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.match(content, /class="pd-seg"/);
	for (const mode of ['learn', 'practice', 'assess']) {
		assert.match(content, new RegExp(`data-mode="${mode}"`), `missing the ${mode} mode panel`);
	}
	assert.match(content, /'Aprender', 'Learn'/);
	assert.match(content, /'Practicar', 'Practice'/);
	assert.match(content, /'Evaluar', 'Assess'/);
});

test('component declares 8 learn scenes, 6 practice items and 6 graded questions', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	const ids = (prefix) => [...content.matchAll(new RegExp(`id: '${prefix}(\\d+)'`, 'g'))].map((m) => Number(m[1]));
	assert.deepEqual(ids('L'), [1, 2, 3, 4, 5, 6, 7, 8]);
	assert.deepEqual(ids('P'), [1, 2, 3, 4, 5, 6]);
	assert.deepEqual(ids('A'), [1, 2, 3, 4, 5, 6]);
	assert.match(content, /data-slide=\{i \+ 1\}/, 'slides are numbered per mode');
	assert.match(content, /data-grade/, 'assess mode grades at the end');
	assert.match(content, /aria-live="polite"/);
});

test('component covers the key terms of the lesson in both languages', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	const terms = [
		/dirección/,
		/address/,
		/desreferenci/i,
		/dereferenc/i,
		/int \*p = &x;/,
		/\(void \*\)&x/,
		/NULL/,
		/comportamiento indefinido/,
		/undefined behavior/,
		/pasaje por valor/,
		/pass by value/,
		/void intercambiar\(int \*a, int \*b\)/,
		/void swap\(int \*a, int \*b\)/,
		/const int \*p/,
		/int \*const q/,
		/parámetros de salida/,
		/output parameters/,
		/ilustrativas/,
		/illustrative/,
	];
	for (const term of terms) assert.match(content, term);
});

test('component keeps to the Organic tokens (no raw hex colors)', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.doesNotMatch(content, /(?<!&)#[0-9a-fA-F]{3,8}\b/);
	assert.match(content, /stroke-width="2\.75"/);
});
