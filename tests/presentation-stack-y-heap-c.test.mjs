import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

const COMPONENT = 'src/components/presentaciones/stack-y-heap-c.astro';

test('presentations catalog binds stack-y-heap-c to the C lesson duracion-y-ciclo-de-vida', () => {
	const pres = presentations.find((p) => p.slug === 'stack-y-heap-c');
	assert.ok(pres, 'stack-y-heap-c must be registered in the presentations array');
	assert.equal(pres.lesson.course, 'c');
	assert.equal(pres.lesson.slug, 'duracion-y-ciclo-de-vida');
	assert.equal(pres.image, '/img/presentations/stack-y-heap-c.svg');
	assert.ok(getPresentationsForLesson('c', 'duracion-y-ciclo-de-vida').some((p) => p.slug === 'stack-y-heap-c'));
	assert.deepEqual(getLessonForPresentation('stack-y-heap-c'), { course: 'c', slug: 'duracion-y-ciclo-de-vida' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/stack-y-heap-c.svg'));
});

test('the component offers the three didactic modes', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.match(content, /class="seg sh-modes"/);
	for (const mode of ['learn', 'practice', 'assess']) {
		assert.match(content, new RegExp(`data-mode="${mode}"`), `missing ${mode} slides`);
	}
	assert.match(content, /t\('Aprender', 'Learn'\)/);
	assert.match(content, /t\('Practicar', 'Practice'\)/);
	assert.match(content, /t\('Evaluar', 'Assess'\)/);
});

test('learn has 6-8 stepped slides, practice 5-6 predictions and assess 5-6 graded questions', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	const section = (name, next) => content.slice(content.indexOf(`const ${name}`), content.indexOf(`const ${next}`));
	const learnSlides = (section('learn', 'practice').match(/\n\t\{\n\t\tkicker:/g) ?? []).length;
	const practiceItems = (section('practice', 'durations').match(/\n\t\{\n\t\tcode:/g) ?? []).length;
	const assessItems = (section('assess', 'ui').match(/\n\t\tquestion:/g) ?? []).length;
	assert.ok(learnSlides >= 6 && learnSlides <= 8, `learn slides: ${learnSlides}`);
	assert.ok(practiceItems >= 5 && practiceItems <= 6, `practice items: ${practiceItems}`);
	assert.ok(assessItems >= 5 && assessItems <= 6, `assess questions: ${assessItems}`);
	assert.match(content, /data-step="next"/);
	assert.match(content, /data-transition/);
	assert.match(content, /data-grade/);
	assert.match(content, /aria-live="polite"/);
});

test('the deck covers the key terms of the lesson in both languages', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	const pairs = [
		['Duración automática', 'Automatic duration'],
		['Duración estática', 'Static duration'],
		['Duración asignada', 'Allocated duration'],
		['tiempo de vida', 'lifetime'],
		['puntero colgante', 'dangling pointer'],
		['comportamiento indefinido', 'undefined behavior'],
		['Pila (stack)', 'Stack'],
		['Montículo (heap)', 'Heap'],
		['no exige que exista una pila ni un montículo', 'does not require a stack or a heap'],
		['búfer del llamador', 'caller-provided buffer'],
	];
	for (const [es, en] of pairs) {
		assert.ok(content.includes(es), `missing Spanish term: ${es}`);
		assert.ok(content.includes(en), `missing English term: ${en}`);
	}
	for (const identifier of ['mostrar_cuadrado', 'show_square', 'siguiente_turno', 'next_turn', 'calcular_doble', 'compute_double', 'temporal', 'temporary', 'armar_saludo', 'build_greeting']) {
		assert.ok(content.includes(identifier), `missing lesson identifier: ${identifier}`);
	}
});

test('the deck does not teach allocation functions before the memoria-dinamica lesson', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.doesNotMatch(content, /\b(malloc|calloc|realloc|free)\s*\(/);
});

test('addresses are presented as illustrative and no voseo slips into Spanish copy', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.match(content, /Direcciones ilustrativas/);
	assert.match(content, /Illustrative addresses/);
	assert.doesNotMatch(content, /\b(podés|tenés|sabés|querés|elegí|mirá|fijate)\b/i);
});
