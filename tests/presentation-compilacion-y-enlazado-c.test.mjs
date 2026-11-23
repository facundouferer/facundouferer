import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

const SLUG = 'compilacion-y-enlazado-c';
const COMPONENT = `src/components/presentaciones/${SLUG}.astro`;

test('catalog binds compilacion-y-enlazado-c to the C lesson compilacion-y-enlazado', () => {
	const pres = presentations.find((p) => p.slug === SLUG);
	assert.ok(pres, `${SLUG} must be registered in the presentations catalog`);
	assert.deepEqual(pres.lesson, { course: 'c', slug: 'compilacion-y-enlazado' });
	assert.equal(pres.image, `/img/presentations/${SLUG}.svg`);
	assert.ok(getPresentationsForLesson('c', 'compilacion-y-enlazado').some((p) => p.slug === SLUG));
	assert.deepEqual(getLessonForPresentation(SLUG), { course: 'c', slug: 'compilacion-y-enlazado' });
});

test('card SVG asset exists', () => {
	assert.ok(existsSync(`public/img/presentations/${SLUG}.svg`));
});

test('component offers the three didactic modes as a segmented control', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.match(content, /class="lk-seg" role="radiogroup"/);
	for (const mode of ['learn', 'practice', 'assess']) {
		assert.match(content, new RegExp(`name="lkMode" value="${mode}"`), `mode ${mode} must be selectable`);
		assert.match(content, new RegExp(`data-mode="${mode}"`), `mode ${mode} must render slides`);
	}
	assert.match(content, /'Aprender' : 'Learn'/);
	assert.match(content, /'Practicar' : 'Practice'/);
	assert.match(content, /'Evaluar' : 'Assess'/);
});

test('learn mode walks the four stages with a step control', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.match(content, /class="lk-pipe"/);
	assert.match(content, /lk-step-next/);
	assert.match(content, /lk-step-prev/);
	assert.match(content, /aria-live="polite"/);
	for (const flag of ['gcc -E', 'gcc -S', 'gcc -std=c23 -c', '-o ${f}']) {
		assert.ok(content.includes(flag), `learn mode must show ${flag}`);
	}
	const learnSlides = content.match(/learnSlides: LearnSlide\[\] = \[[\s\S]*?\n\];/)?.[0] ?? '';
	const count = (learnSlides.match(/^\t\{\n\t\tkicker:/gm) ?? []).length;
	assert.ok(count >= 6 && count <= 8, `expected 6-8 learn slides, got ${count}`);
});

test('practice and assess modes carry 5-6 items each and a final grade', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	const practice = content.match(/practiceItems: PracticeItem\[\] = \[[\s\S]*?\n\];/)?.[0] ?? '';
	const assess = content.match(/assessItems: AssessItem\[\] = \[[\s\S]*?\n\];/)?.[0] ?? '';
	const practiceCount = (practice.match(/^\t\{$/gm) ?? []).length;
	const assessCount = (assess.match(/^\t\{$/gm) ?? []).length;
	assert.ok(practiceCount >= 5 && practiceCount <= 6, `expected 5-6 practice items, got ${practiceCount}`);
	assert.ok(assessCount >= 5 && assessCount <= 6, `expected 5-6 assess questions, got ${assessCount}`);
	assert.match(content, /class="lk-feedback" aria-live="polite"/);
	assert.match(content, /lk-replay/);
	assert.match(content, /id="lkGradeBtn"/);
	assert.match(content, /id="lkScore" aria-live="polite"/);
});

test('component covers the lesson key terms in both languages', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	const terms = [
		['Preprocesador', 'Preprocessor'],
		['Compilador', 'Compiler'],
		['Ensamblador', 'Assembler'],
		['Enlazador', 'Linker'],
		['biblioteca estándar de C', 'C standard library'],
		['archivo objeto', 'object file'],
		['advertencia', 'warning'],
		['estado de salida', 'exit status'],
	];
	for (const [es, en] of terms) {
		assert.ok(content.includes(es), `missing Spanish term ${es}`);
		assert.ok(content.includes(en), `missing English term ${en}`);
	}
	for (const token of ['undefined reference', 'stdoi.h', 'prinft', '-Wall -Wextra -Wpedantic', '-Werror', 'echo $?', "'SALUDO' : 'GREETING'"]) {
		assert.ok(content.includes(token), `missing lesson token ${token}`);
	}
});

test('component stays on Organic tokens and has no voseo', async () => {
	const content = await readFile(COMPONENT, 'utf8');
	assert.equal((content.match(/(?<!&)#[0-9a-fA-F]{3,8}\b/g) ?? []).length, 0, 'no raw hex colors');
	assert.doesNotMatch(content, /stroke-width="(?!2\.75")[0-9.]+"/, 'Lucide icons use stroke-width 2.75');
	assert.doesNotMatch(content, /\b(tenés|podés|querés|sabés|mirá|elegí|avanzá|corregí)\b/i);
});
