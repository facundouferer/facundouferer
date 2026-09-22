import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const LESSONS = [
	'01-conceptos-basicos',
	'02-variables-tipos-datos-y-operadores',
	'03-control-de-flujo-y-bucles',
	'04-arrays-y-strings',
];

const BASE_DIR = 'src/content/activities/java';

function frontmatterValue(content, key) {
	const match = content.match(new RegExp(`^${key}:\\s*(?:'([^']*)'|(\\d+))$`, 'm'));
	assert.ok(match, `Expected top-level "${key}" in frontmatter`);
	return match[1] ?? match[2];
}

test('all four Java foundation lessons have their activities directories', () => {
	for (const lesson of LESSONS) {
		assert.ok(existsSync(`${BASE_DIR}/${lesson}`), `Directory missing: ${BASE_DIR}/${lesson}`);
	}
});

test('each foundation lesson has exactly one project and one quiz activity in Spanish', async () => {
	for (const lesson of LESSONS) {
		const dir = `${BASE_DIR}/${lesson}`;
		const files = await readdir(dir);
		const esFiles = files.filter((f) => f.endsWith('.es.md'));
		assert.equal(esFiles.length, 2, `Expected 2 activity files in ${dir}, found: ${esFiles.join(', ')}`);

		let hasProject = false;
		let hasQuiz = false;

		for (const file of esFiles) {
			const content = await readFile(`${dir}/${file}`, 'utf8');
			assert.equal(frontmatterValue(content, 'course'), 'java');
			assert.equal(frontmatterValue(content, 'lesson'), lesson);
			assert.equal(frontmatterValue(content, 'lang'), 'es');
			assert.match(content, /published:\s*true/);

			const kind = frontmatterValue(content, 'kind');
			if (kind === 'project') hasProject = true;
			if (kind === 'quiz') hasQuiz = true;
		}

		assert.ok(hasProject, `Missing project activity in ${dir}`);
		assert.ok(hasQuiz, `Missing quiz activity in ${dir}`);
	}
});

test('project activities have objectives, requirements, and exampleOutput', async () => {
	for (const lesson of LESSONS) {
		const dir = `${BASE_DIR}/${lesson}`;
		const files = await readdir(dir);
		for (const file of files) {
			if (!file.endsWith('.es.md')) continue;
			const content = await readFile(`${dir}/${file}`, 'utf8');
			if (frontmatterValue(content, 'kind') !== 'project') continue;

			assert.match(content, /objectives:/, `${file} must have objectives`);
			assert.match(content, /requirements:/, `${file} must have requirements`);
			assert.match(content, /exampleOutput:/, `${file} must have exampleOutput`);
		}
	}
});

test('quiz activities have 8-12 questions with mixed kinds and non-empty explanations', async () => {
	for (const lesson of LESSONS) {
		const dir = `${BASE_DIR}/${lesson}`;
		const files = await readdir(dir);
		for (const file of files) {
			if (!file.endsWith('.es.md')) continue;
			const content = await readFile(`${dir}/${file}`, 'utf8');
			if (frontmatterValue(content, 'kind') !== 'quiz') continue;

			const kinds = [...content.matchAll(/-\s*kind:\s*'(single-choice|true-false)'/g)].map((m) => m[1]);
			assert.ok(kinds.length >= 8 && kinds.length <= 12, `${file}: expected 8-12 questions, found ${kinds.length}`);
			assert.ok(kinds.includes('single-choice'), `${file}: must include single-choice questions`);
			assert.ok(kinds.includes('true-false'), `${file}: must include true-false questions`);

			const explanations = [...content.matchAll(/explanation:\s*>-\n((?:\s{4,}.+\n?)+)/g)];
			assert.equal(explanations.length, kinds.length, `${file}: each question must have an explanation`);
			for (const [, body] of explanations) {
				assert.ok(body.trim().length > 20, `${file}: explanation must have meaningful content`);
			}

			// Check that prompts do not cram multiple statements
			const promptLines = [...content.matchAll(/^\s*prompt:\s*'([^\n]*)'\s*$/gm)].map((m) => m[1]);
			for (const prompt of promptLines) {
				const statementCount = (prompt.match(/;/g) ?? []).length;
				assert.ok(statementCount <= 1, `${file}: prompt should not cram multiple statements: "${prompt}"`);
			}
		}
	}
});

test('curriculum sequencing: activities do not test concepts from later lessons', async () => {
	// Lesson 01: no loops, no types/casting in-depth, no arrays beyond args, no custom classes/methods
	const l1Dir = `${BASE_DIR}/01-conceptos-basicos`;
	for (const file of await readdir(l1Dir)) {
		const content = await readFile(`${l1Dir}/${file}`, 'utf8');
		assert.doesNotMatch(content, /\b(for\s*\(|while\s*\(|do\s*\{)/, `${file}: no loops in lesson 01`);
		assert.doesNotMatch(content, /\bextends\b/, `${file}: no inheritance in lesson 01`);
	}

	// Lesson 02: no loops, no arrays beyond args
	const l2Dir = `${BASE_DIR}/02-variables-tipos-datos-y-operadores`;
	for (const file of await readdir(l2Dir)) {
		const content = await readFile(`${l2Dir}/${file}`, 'utf8');
		assert.doesNotMatch(content, /\b(for\s*\(|while\s*\(|do\s*\{)/, `${file}: no loops in lesson 02`);
	}

	// Lesson 03: no custom methods (Lesson 05) or custom classes (Lesson 06-08)
	const l3Dir = `${BASE_DIR}/03-control-de-flujo-y-bucles`;
	for (const file of await readdir(l3Dir)) {
		const content = await readFile(`${l3Dir}/${file}`, 'utf8');
		assert.doesNotMatch(content, /\bextends\b/, `${file}: no inheritance in lesson 03`);
	}
});
