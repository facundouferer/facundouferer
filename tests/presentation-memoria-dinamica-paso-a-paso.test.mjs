import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

const SLUG = 'memoria-dinamica-paso-a-paso';
const COMPONENT = `src/components/presentaciones/${SLUG}.astro`;

test('catalog binds memoria-dinamica-paso-a-paso to the C lesson memoria-dinamica', () => {
	const pres = presentations.find((p) => p.slug === SLUG);
	assert.ok(pres, `${SLUG} must be registered in the presentations catalog`);
	assert.deepEqual(pres.lesson, { course: 'c', slug: 'memoria-dinamica' });
	assert.equal(pres.image, `/img/presentations/${SLUG}.svg`);
	assert.ok(getPresentationsForLesson('c', 'memoria-dinamica').some((p) => p.slug === SLUG));
	assert.deepEqual(getLessonForPresentation(SLUG), { course: 'c', slug: 'memoria-dinamica' });
});

test('card SVG asset exists', () => {
	assert.ok(existsSync(`public/img/presentations/${SLUG}.svg`));
});

test('component offers the three didactic modes as a segmented control', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.match(content, /class="md-seg" role="radiogroup"/);
	for (const mode of ['learn', 'practice', 'assess']) {
		assert.match(content, new RegExp(`name="mdMode" value="${mode}"`), `missing mode ${mode}`);
		assert.match(content, new RegExp(`data-mode="${mode}"`), `missing slides for mode ${mode}`);
	}
	assert.match(content, /t\('Aprender', 'Learn'\)/);
	assert.match(content, /t\('Practicar', 'Practice'\)/);
	assert.match(content, /t\('Evaluar', 'Assess'\)/);
});

test('learn mode has 6-8 stepped slides; practice has 5-6 predictions; assess has 5-6 graded questions', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	const section = (name) => content.split(`const ${name}:`)[1];
	const learnSlides = section('learn').split('const practice:')[0].match(/^\t\tkicker:/gm) ?? [];
	const practiceItems = section('practice').split('const assess:')[0].match(/^\t\tprompt:/gm) ?? [];
	const assessItems = section('assess').split('const ui =')[0].match(/^\t\tprompt:/gm) ?? [];
	assert.ok(learnSlides.length >= 6 && learnSlides.length <= 8, `learn slides: ${learnSlides.length}`);
	assert.ok(practiceItems.length >= 5 && practiceItems.length <= 6, `practice items: ${practiceItems.length}`);
	assert.ok(assessItems.length >= 5 && assessItems.length <= 6, `assess questions: ${assessItems.length}`);
	assert.match(content, /data-step-next/, 'learn slides need a step control');
	assert.match(content, /data-replay/, 'practice shows the animated transition');
	assert.match(content, /data-grade/, 'assess is graded at the end');
	assert.match(content, /aria-live="polite"/);
});

test('component covers the key terms of the lesson in both languages', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	for (const term of ['malloc', 'calloc', 'realloc', 'free(NULL)', 'sizeof *', 'NULL']) {
		assert.ok(content.includes(term), `missing term ${term}`);
	}
	for (const [es, en] of [
		['Montículo (heap)', 'Heap'],
		['puntero temporal', 'temporary pointer'],
		['colgante', 'dangling'],
		['fuga', 'leak'],
		['Un arreglo que crece', 'An array that grows'],
		['Leidos: 5 (capacidad 8), suma: 35', 'Read: 5 (capacity 8), sum: 35'],
		['Direcciones ilustrativas', 'Illustrative addresses'],
	]) {
		assert.ok(content.includes(es), `missing Spanish term ${es}`);
		assert.ok(content.includes(en), `missing English term ${en}`);
	}
});

test('component stays inside the Organic palette (no raw hex colors)', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.doesNotMatch(content, /(?<!&)#[0-9a-fA-F]{3,8}\b/);
});
