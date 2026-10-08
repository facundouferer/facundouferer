import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const LESSONS = [
	{
		slug: '05-metodos-y-funciones',
		order: 5,
		expectedConcepts: [/pasaje por valor|pass-by-value/i, /sobrecarga|overload/i, /recurs/i],
		forbiddenConcepts: [/\bextends\b/, /\binterface\s+\w+/, /\bthrow\s+new\b/, /\bArrayList\b/],
	},
	{
		slug: '23-algoritmia-verificacion-y-complejidad',
		order: 6,
		expectedConcepts: [/precondici/i, /postcondici/i, /Big\s*O|O\(n\)|O\(log\s*n\)/i, /invariante/i, /b[uú]squeda binaria/i],
		forbiddenConcepts: [/\bextends\b/, /\binterface\s+\w+/, /\bthrow\s+new\b/, /\bArrayList\b/],
	},
	{
		slug: '08-herencia-polimorfismo-y-sobrecarga',
		order: 11,
		expectedConcepts: [/\bextends\b/, /\bsuper\(/, /@Override/, /polimorf/i],
		forbiddenConcepts: [/\binterface\s+\w+/, /\bimplements\b/, /\bthrow\s+new\b/, /\bArrayList\b/],
	},
	{
		slug: '09-clases-abstractas-interfaces-y-modelado',
		order: 12,
		expectedConcepts: [/abstract\s+class/, /\binterface\s+\w+/, /\bimplements\b/],
		forbiddenConcepts: [/\bthrow\s+new\b/, /\bArrayList\b/],
	},
	{
		slug: '10-excepciones-y-manejo-de-errores',
		order: 13,
		expectedConcepts: [/\btry\s*\{/, /\bcatch\s*\(/, /\bfinally\s*\{/, /\bthrow\s+new\b/, /\bthrows\b/, /checked|unchecked/i],
		forbiddenConcepts: [/\bArrayList\b/, /\bHashMap\b/],
	},
];

const BASE_DIR = 'src/content/activities/java';

// Lesson 09 adds a code-analysis quiz on top of the standard project + quiz
// pair; its own rules live in activities-java-code-analysis-quizzes.test.mjs.
const CODE_ANALYSIS_FILE = 'autoevaluacion-lectura-de-codigo.es.md';
const LESSONS_WITH_CODE_ANALYSIS = new Set(['09-clases-abstractas-interfaces-y-modelado']);

function frontmatterValue(content, key) {
	const match = content.match(new RegExp(`^${key}:\\s*(?:'([^']*)'|(\\d+))$`, 'm'));
	assert.ok(match, `Expected top-level "${key}" in frontmatter`);
	return match[1] ?? match[2];
}

test('all 5 requested Java lessons have their activities directories', () => {
	for (const lesson of LESSONS) {
		const dir = `${BASE_DIR}/${lesson.slug}`;
		assert.ok(existsSync(dir), `Directory missing: ${dir}`);
	}
});

test('each lesson has exactly one project and one standard quiz activity in Spanish with correct metadata', async () => {
	for (const lesson of LESSONS) {
		const dir = `${BASE_DIR}/${lesson.slug}`;
		assert.ok(existsSync(dir), `Directory missing: ${dir}`);
		const files = await readdir(dir);
		const esFiles = files.filter((f) => f.endsWith('.es.md'));
		const expectedFiles = LESSONS_WITH_CODE_ANALYSIS.has(lesson.slug) ? 3 : 2;
		assert.equal(esFiles.length, expectedFiles, `Expected ${expectedFiles} activity files in ${dir}, found: ${esFiles.join(', ')}`);

		let hasProject = false;
		let hasQuiz = false;

		for (const file of esFiles) {
			if (file === CODE_ANALYSIS_FILE) continue;
			const content = await readFile(`${dir}/${file}`, 'utf8');
			assert.equal(frontmatterValue(content, 'course'), 'java');
			assert.equal(frontmatterValue(content, 'lesson'), lesson.slug);
			assert.equal(frontmatterValue(content, 'lang'), 'es');
			assert.match(content, /published:\s*true/);

			const kind = frontmatterValue(content, 'kind');
			if (kind === 'project') {
				hasProject = true;
				assert.equal(frontmatterValue(content, 'order'), '1');
				assert.match(content, /objectives:/);
				assert.match(content, /requirements:/);
				assert.match(content, /exampleOutput:/);
			}
			if (kind === 'quiz') {
				hasQuiz = true;
				assert.equal(frontmatterValue(content, 'order'), '2');
				const questionKinds = [...content.matchAll(/-\s*kind:\s*'(single-choice|true-false)'/g)].map((m) => m[1]);
				assert.ok(questionKinds.length >= 8 && questionKinds.length <= 12, `expected 8-12 questions in ${file}, found ${questionKinds.length}`);
				assert.ok(questionKinds.includes('single-choice'), `expected single-choice questions in ${file}`);
				assert.ok(questionKinds.includes('true-false'), `expected true-false questions in ${file}`);

				const explanationBlocks = [...content.matchAll(/explanation:\s*>-\n((?:\s{4,}.+\n?)+)/g)];
				assert.ok(explanationBlocks.length >= 8, `expected explanations in ${file}, found ${explanationBlocks.length}`);
			}
		}

		assert.ok(hasProject, `Missing project activity in ${dir}`);
		assert.ok(hasQuiz, `Missing quiz activity in ${dir}`);
	}
});

test('curriculum sequencing: each activity adheres to permitted and forbidden concepts for its lesson', async () => {
	for (const lesson of LESSONS) {
		const dir = `${BASE_DIR}/${lesson.slug}`;
		if (!existsSync(dir)) continue;
		const files = await readdir(dir);
		for (const file of files.filter((f) => f.endsWith('.es.md'))) {
			const content = await readFile(`${dir}/${file}`, 'utf8');

			for (const forbidden of lesson.forbiddenConcepts) {
				assert.doesNotMatch(
					content,
					forbidden,
					`Lesson ${lesson.slug} (${file}) violates sequencing by containing forbidden pattern ${forbidden}`
				);
			}
		}
	}
});

test('each project activity contains the required conceptual coverage for its lesson', async () => {
	for (const lesson of LESSONS) {
		const dir = `${BASE_DIR}/${lesson.slug}`;
		if (!existsSync(dir)) continue;
		const files = await readdir(dir);
		for (const file of files.filter((f) => f.endsWith('.es.md'))) {
			const content = await readFile(`${dir}/${file}`, 'utf8');
			const kind = frontmatterValue(content, 'kind');
			if (kind !== 'project') continue;

			for (const expected of lesson.expectedConcepts) {
				assert.match(
					content,
					expected,
					`Lesson ${lesson.slug} project (${file}) must cover expected concept ${expected}`
				);
			}
		}
	}
});
