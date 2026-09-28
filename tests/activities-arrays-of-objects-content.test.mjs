import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const ACTIVITIES_DIR = 'src/content/activities/java/09-arrays-de-objetos';

function frontmatterValue(content, key) {
	const match = content.match(new RegExp(`^${key}:\\s*(?:'([^']*)'|(\\d+))$`, 'm'));
	assert.ok(match, `Expected top-level "${key}" in frontmatter`);
	return match[1] ?? match[2];
}

async function findActivityFile(kind) {
	if (!existsSync(ACTIVITIES_DIR)) return undefined;
	const files = await readdir(ACTIVITIES_DIR);
	for (const file of files) {
		if (!file.endsWith('.es.md')) continue;
		const content = await readFile(`${ACTIVITIES_DIR}/${file}`, 'utf8');
		if (frontmatterValue(content, 'kind') === kind) return { file, content };
	}
	return undefined;
}

let project;
let quiz;

test('lesson 09-arrays-de-objetos has its directory and exactly one project and one quiz activity in Spanish', async () => {
	assert.ok(existsSync(ACTIVITIES_DIR), `Directory missing: ${ACTIVITIES_DIR}`);
	const files = await readdir(ACTIVITIES_DIR);
	const esFiles = files.filter((f) => f.endsWith('.es.md'));
	assert.equal(esFiles.length, 2, `Expected 2 activity files, found: ${esFiles.join(', ')}`);

	project = await findActivityFile('project');
	quiz = await findActivityFile('quiz');
	assert.ok(project, 'a project-kind activity must exist');
	assert.ok(quiz, 'a quiz-kind activity must exist');
});

test('both activities reference course=java and lesson=09-arrays-de-objetos, lang es, published', async () => {
	for (const activity of [project, quiz]) {
		assert.equal(frontmatterValue(activity.content, 'course'), 'java');
		assert.equal(frontmatterValue(activity.content, 'lesson'), '09-arrays-de-objetos');
		assert.equal(frontmatterValue(activity.content, 'lang'), 'es');
		assert.match(activity.content, /published:\s*true/);
	}
});

test('project activity order is 1 and quiz activity order is 2', async () => {
	assert.equal(frontmatterValue(project.content, 'order'), '1');
	assert.equal(frontmatterValue(quiz.content, 'order'), '2');
});

// --- project activity: arrays of objects, capacity vs count, search, sort, defensive copy ---

test('project activity requirements cover arrays of objects, capacity vs count, search, and manual sort', async () => {
	const content = project.content;
	assert.match(content, /Jugador\[\]|Persona\[\]|\w+\[\]/, 'must require an array of objects');
	assert.match(content, /capacidad/i, 'must discuss array capacity');
	assert.match(content, /cantidad/i, 'must discuss actual count of elements');
	assert.match(content, /Arrays\.copyOf/, 'must demonstrate resizing or defensive copying with Arrays.copyOf');
	assert.match(content, /buscar/i, 'must include search functionality');
	assert.match(content, /ordenar/i, 'must include manual sorting');
	assert.match(content, /null/, 'must address null slots or null-checking');
	assert.match(content, /requirements:/);
	assert.match(content, /objectives:/);
	assert.match(content, /exampleOutput:/);
});

test('project activity does not rely on future lessons (no inheritance, interfaces, exceptions, or collections)', async () => {
	const content = project.content;
	assert.doesNotMatch(content, /\bextends\b/, 'inheritance (extends) belongs to lesson 11');
	assert.doesNotMatch(content, /\bsuper\(/, 'super(...) belongs to lesson 11');
	assert.doesNotMatch(content, /interface\s+\w+/, 'interfaces belong to lesson 12');
	assert.doesNotMatch(content, /implements\b/, 'implements belongs to lesson 12');
	assert.doesNotMatch(content, /throw\s+new\b/, 'throwing exceptions belongs to lesson 13');
	assert.doesNotMatch(content, /try\s*\{/, 'try-catch belongs to lesson 13');
	assert.doesNotMatch(content, /ArrayList|List<|Map<|Set</, 'collections belong to lesson 14');
	assert.doesNotMatch(content, /Comparable|Comparator/, 'Comparable/Comparator belong to lesson 15');
});

test('project activity demonstrates cleaning the trailing slot in elimination to prevent memory leaks', async () => {
	const content = project.content;
	assert.match(content, /null/, 'must assign null to the cleared slot');
	assert.match(content, /fuga de memoria|recolector de basura|referencia sobrante/i);
});

// --- quiz activity: 10 questions mixing single-choice and true-false ----------

test('quiz activity has between 8 and 12 questions mixing single-choice and true-false', async () => {
	const content = quiz.content;
	const questionKinds = [...content.matchAll(/-\s*kind:\s*'(single-choice|true-false)'/g)].map((m) => m[1]);
	assert.ok(questionKinds.length >= 8 && questionKinds.length <= 12, `expected 8-12 questions, found ${questionKinds.length}`);
	assert.ok(questionKinds.includes('single-choice'), 'expected at least one single-choice question');
	assert.ok(questionKinds.includes('true-false'), 'expected at least one true-false question');
});

test('quiz activity: every question has a non-empty explanation', async () => {
	const content = quiz.content;
	const explanationBlocks = [...content.matchAll(/explanation:\s*>-\n((?:\s{4,}.+\n?)+)/g)];
	assert.ok(explanationBlocks.length >= 8, `expected at least 8 explanations, found ${explanationBlocks.length}`);
	for (const [, body] of explanationBlocks) {
		assert.ok(body.trim().length > 20, 'explanation body must be real, non-trivial text');
	}
});

test('quiz activity covers two memory levels, two-step creation, capacity vs count, and aliasing', async () => {
	const content = quiz.content;
	assert.match(content, /referencia/i);
	assert.match(content, /NullPointerException/);
	assert.match(content, /capacidad/i);
	assert.match(content, /cantidad/i);
	assert.match(content, /aliasing|mismo objeto/i);
});

test('quiz activity does not test future concepts (no inheritance, interfaces, exceptions, collections)', async () => {
	const content = quiz.content;
	assert.doesNotMatch(content, /\bextends\b/);
	assert.doesNotMatch(content, /\bsuper\(/);
	assert.doesNotMatch(content, /\binterface\b/);
	assert.doesNotMatch(content, /\bimplements\b/);
	assert.doesNotMatch(content, /throw\s+new/);
	assert.doesNotMatch(content, /ArrayList/);
});

test('code-bearing questions in quiz use real YAML code fields with line breaks, not inline-prompt code', async () => {
	const content = quiz.content;
	const codeBlocks = [...content.matchAll(/code:\s*\|-?\n((?:\s{6,}.+\n?)+)/g)];
	assert.ok(codeBlocks.length >= 2, `expected at least 2 questions with a code field, found ${codeBlocks.length}`);
	for (const [, body] of codeBlocks) {
		assert.ok(body.includes('\n'), 'code field should be multi-line');
	}
});

test('no question prompt crams multiple ;-joined statements onto one line', async () => {
	const content = quiz.content;
	const promptLines = [...content.matchAll(/^\s*prompt:\s*'([^\n]*)'\s*$/gm)].map((m) => m[1]);
	assert.ok(promptLines.length >= 6, 'sanity: most prompts are simple single-line strings');
	for (const prompt of promptLines) {
		const statementCount = (prompt.match(/;/g) ?? []).length;
		assert.ok(statementCount <= 1, `prompt should not cram multiple statements: "${prompt}"`);
	}
});

test('inline code mentions in prompts/explanations use backticks (rendered as <code> on the page)', async () => {
	const content = quiz.content;
	assert.match(content, /`NullPointerException`/);
	assert.match(content, /`null`/);
});
