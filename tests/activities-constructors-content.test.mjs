import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const ACTIVITIES_DIR = 'src/content/activities/java/07-constructores-y-encapsulamiento';

function frontmatterValue(content, key) {
	const match = content.match(new RegExp(`^${key}:\\s*(?:'([^']*)'|(\\d+))$`, 'm'));
	assert.ok(match, `Expected top-level "${key}" in frontmatter`);
	return match[1] ?? match[2];
}

async function findActivityFile(kind) {
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

test('lesson 07-constructores-y-encapsulamiento has exactly one project and one quiz activity', async () => {
	const files = await readdir(ACTIVITIES_DIR);
	const esFiles = files.filter((f) => f.endsWith('.es.md'));
	assert.equal(esFiles.length, 2, `Expected 2 activity files, found: ${esFiles.join(', ')}`);

	project = await findActivityFile('project');
	quiz = await findActivityFile('quiz');
	assert.ok(project, 'a project-kind activity must exist');
	assert.ok(quiz, 'a quiz-kind activity must exist');
});

test('both activities reference course=java and lesson=07-constructores-y-encapsulamiento, lang es, published', async () => {
	for (const activity of [project, quiz]) {
		assert.equal(frontmatterValue(activity.content, 'course'), 'java');
		assert.equal(frontmatterValue(activity.content, 'lesson'), '07-constructores-y-encapsulamiento');
		assert.equal(frontmatterValue(activity.content, 'lang'), 'es');
		assert.match(activity.content, /published:\s*true/);
	}
});

test('project activity order is 1 and quiz activity order is 2', async () => {
	assert.equal(frontmatterValue(project.content, 'order'), '1');
	assert.equal(frontmatterValue(quiz.content, 'order'), '2');
});

// --- project activity: constructors, this(...), encapsulation, validated accessors ---

test('project activity requires a canonical constructor, this(...) delegation, and private attributes', async () => {
	const content = project.content;
	assert.match(content, /private\s+(final\s+)?(String|int|double|boolean)/, 'attributes must be private (lesson 08 scope)');
	assert.match(content, /public\s+\w+\(String[^)]*\)\s*\{/i, 'a parametrized public constructor is expected in the suggested structure');
	assert.match(content, /this\(/, 'this(...) delegation between constructors is expected');
	assert.match(content, /IllegalArgumentException/, 'constructor/setter validation should reject invalid data');
	assert.match(content, /requirements:/);
	assert.match(content, /objectives:/);
	assert.match(content, /exampleOutput:/);
});

test('project activity does not rely on inheritance or arrays-of-objects concepts (later lessons, not yet taught)', async () => {
	const content = project.content;
	assert.doesNotMatch(content, /\bextends\b/, 'inheritance (extends) belongs to a later lesson');
	assert.doesNotMatch(content, /\bsuper\(/, 'super(...) belongs to a later lesson');
	assert.doesNotMatch(content, /@Override/, '@Override / polymorphism belongs to a later lesson');
	assert.doesNotMatch(content, /Comparable|Comparator|Arrays\.sort/, 'sorting with Comparable/Comparator belongs to the arrays-of-objects lesson');
	assert.doesNotMatch(content, /\w+\[\]/, 'raw object arrays belong to the arrays-of-objects lesson');
});

test('project activity mentions the default constructor disappearing once a custom one is declared', async () => {
	const content = project.content;
	assert.match(content, /no compila|ya no (existe|tiene)|desaparece/i);
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

test('quiz activity covers constructors, this(...), default constructor, and encapsulation (lesson topics)', async () => {
	const content = quiz.content;
	assert.match(content, /constructor/i);
	assert.match(content, /this\(/);
	assert.match(content, /encapsulamiento/i);
	assert.match(content, /private/);
});

test('quiz activity does not test inheritance or arrays-of-objects concepts (later lessons)', async () => {
	const content = quiz.content;
	assert.doesNotMatch(content, /\bextends\b/);
	assert.doesNotMatch(content, /\bsuper\(/);
	assert.doesNotMatch(content, /polimorfismo/i);
	assert.doesNotMatch(content, /Comparable|Comparator|Arrays\.sort/);
});

test('code-bearing questions use a real YAML code field with line breaks, not inline-prompt code', async () => {
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
	assert.match(content, /`this\(/);
	assert.match(content, /`private`/);
});
