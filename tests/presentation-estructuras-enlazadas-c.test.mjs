import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

const SLUG = 'estructuras-enlazadas-c';
const LESSON = 'estructuras-dinamicas-listas';
const COMPONENT = `src/components/presentaciones/${SLUG}.astro`;

test('catalog binds estructuras-enlazadas-c to the C lesson estructuras-dinamicas-listas', () => {
	const pres = presentations.find((p) => p.slug === SLUG);
	assert.ok(pres, `${SLUG} must be registered in the presentations catalog`);
	assert.deepEqual(pres.lesson, { course: 'c', slug: LESSON });
	assert.equal(pres.image, `/img/presentations/${SLUG}.svg`);
	assert.ok(getPresentationsForLesson('c', LESSON).some((p) => p.slug === SLUG));
	assert.deepEqual(getLessonForPresentation(SLUG), { course: 'c', slug: LESSON });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync(`public/img/presentations/${SLUG}.svg`));
});

test('component offers the three didactic modes as a segmented control', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.match(content, /class="le-seg"/);
	for (const mode of ['learn', 'practice', 'assess']) {
		assert.match(content, new RegExp(`data-mode="${mode}"`), `missing mode panel ${mode}`);
	}
	assert.match(content, /learn: t\('Aprender', 'Learn'\)/);
	assert.match(content, /practice: t\('Practicar', 'Practice'\)/);
	assert.match(content, /assess: t\('Evaluar', 'Assess'\)/);
});

test('learn mode has 8 stepped slides; practice has 6 items; assess has 6 graded questions', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	const learnBlock = content.slice(content.indexOf('const learn: LearnSlide[]'), content.indexOf('/* ---------- Practice'));
	assert.equal((learnBlock.match(/^\t\tprogram: /gm) ?? []).length, 8);
	const practiceBlock = content.slice(content.indexOf('const practice: PracticeItem[]'), content.indexOf('/* ---------- Assess'));
	assert.equal((practiceBlock.match(/^\t\tprogram: /gm) ?? []).length, 6);
	const assessBlock = content.slice(content.indexOf('const assess: AssessItem[]'), content.indexOf('const labels'));
	assert.equal((assessBlock.match(/^\t\tprompt: /gm) ?? []).length, 6);
	assert.match(content, /data-act="grade"/);
	assert.match(content, /data-act="transition"/);
	assert.match(content, /aria-live="polite"/);
});

test('component covers the key terms of the lesson in both languages', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	const pairs = [
		['Nodo', 'Node'],
		['cabeza', 'head'],
		['siguiente', 'next'],
		['crear_nodo', 'create_node'],
		['insertar_al_inicio', 'insert_front'],
		['insertar_al_final', 'insert_back'],
		['insertar_ordenado', 'insert_sorted'],
		['eliminar', 'delete_value'],
		['destruir_lista', 'destroy_list'],
		['Nodo **', 'Node **'],
		['Desenganchar primero, liberar después', 'Unlink first, free afterwards'],
		['Guardar el siguiente antes de liberar', 'Save the next node before freeing'],
		['Correr datos frente a cambiar punteros', 'Shifting data against changing pointers'],
		['Fuga de memoria', 'Memory leak'],
		['colgante', 'dangling'],
		['dueño', 'owner'],
	];
	for (const [es, en] of pairs) {
		assert.ok(content.includes(es), `missing Spanish term "${es}"`);
		assert.ok(content.includes(en), `missing English term "${en}"`);
	}
	assert.match(content, /heap-use-after-free/);
});

test('component uses Organic tokens and no raw hex colors', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.doesNotMatch(content, /(?<!&)#[0-9a-fA-F]{3,8}\b/);
	assert.match(content, /stroke-width="2\.75"/);
	assert.doesNotMatch(content, /<header class="[a-z]{2}-header"/);
});
