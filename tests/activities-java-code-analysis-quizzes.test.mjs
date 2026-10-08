import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

// Some lessons add a second quiz on top of the standard project + quiz pair: a
// code-analysis quiz where every question is single-choice over a Java snippet.
// It always lives in `autoevaluacion-lectura-de-codigo.es.md` with `order: 3`.
const BASE_DIR = 'src/content/activities/java';
const CODE_ANALYSIS_FILE = 'autoevaluacion-lectura-de-codigo.es.md';
const LESSONS = [
	{ slug: '01-conceptos-basicos', siblingQuiz: 'autoevaluacion-conceptos-basicos.es.md' },
	{ slug: '09-clases-abstractas-interfaces-y-modelado', siblingQuiz: 'autoevaluacion-abstractas-e-interfaces.es.md' },
];

function quizPrompts(content) {
	return [...content.matchAll(/^\s*prompt:\s*'([^\n]*)'\s*$/gm)].map((m) => m[1]);
}

for (const lesson of LESSONS) {
	const dir = `${BASE_DIR}/${lesson.slug}`;

	test(`${lesson.slug} code-analysis quiz: 10-12 single-choice questions over Java code, none repeated from the sibling quiz`, async () => {
		assert.ok(existsSync(`${dir}/${CODE_ANALYSIS_FILE}`), `missing ${dir}/${CODE_ANALYSIS_FILE}`);
		const content = await readFile(`${dir}/${CODE_ANALYSIS_FILE}`, 'utf8');
		const sibling = await readFile(`${dir}/${lesson.siblingQuiz}`, 'utf8');

		assert.match(content, /^kind: 'quiz'$/m);
		assert.match(content, /^order: 3$/m);
		assert.match(content, new RegExp(`^lesson: '${lesson.slug}'$`, 'm'));

		const kinds = [...content.matchAll(/-\s*kind:\s*'(single-choice|true-false)'/g)].map((m) => m[1]);
		assert.ok(kinds.length >= 10 && kinds.length <= 12, `expected 10-12 questions, found ${kinds.length}`);
		assert.ok(kinds.every((kind) => kind === 'single-choice'), 'every question must be single-choice');

		const codeBlocks = [...content.matchAll(/^\s+code:\s*\|-\n((?:\s{6,}.*\n|\n)+)/gm)].map((m) => m[1]);
		assert.equal(codeBlocks.length, kinds.length, 'every question must include a Java code snippet');
		for (const code of codeBlocks) {
			assert.match(code, /\b(class|interface)\s+\w+/, 'each snippet must be Java code to analyze');
		}

		const explanations = [...content.matchAll(/explanation:\s*>-\n((?:\s{6,}.+\n?)+)/g)];
		assert.equal(explanations.length, kinds.length, 'every question must have an explanation');

		const prompts = quizPrompts(content);
		assert.equal(prompts.length, kinds.length, 'every prompt must be a single-quoted one-liner');
		assert.equal(new Set(prompts).size, prompts.length, 'prompts must not repeat within the quiz');
		const siblingPrompts = new Set(quizPrompts(sibling));
		for (const prompt of prompts) {
			assert.ok(!siblingPrompts.has(prompt), `prompt repeated from ${lesson.siblingQuiz}: "${prompt}"`);
		}

		// Students only see the questions: never point them to external source code.
		assert.doesNotMatch(content, /repositorio|github\.com/i, 'quiz must not reference the course repository');
	});
}
