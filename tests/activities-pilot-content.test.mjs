import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const ACTIVITIES_DIR = 'src/content/activities/java/07-fundamentos-poo-clases-y-objetos';

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

test('lesson 07 has exactly one project and one quiz pilot activity', async () => {
	const files = await readdir(ACTIVITIES_DIR);
	const esFiles = files.filter((f) => f.endsWith('.es.md'));
	assert.equal(esFiles.length, 2, `Expected 2 activity files, found: ${esFiles.join(', ')}`);

	project = await findActivityFile('project');
	quiz = await findActivityFile('quiz');
	assert.ok(project, 'a project-kind activity must exist');
	assert.ok(quiz, 'a quiz-kind activity must exist');
});

test('both pilot activities reference course=java and lesson=07-fundamentos-poo-clases-y-objetos, lang es, published', async () => {
	for (const activity of [project, quiz]) {
		assert.equal(frontmatterValue(activity.content, 'course'), 'java');
		assert.equal(frontmatterValue(activity.content, 'lesson'), '07-fundamentos-poo-clases-y-objetos');
		assert.equal(frontmatterValue(activity.content, 'lang'), 'es');
		assert.match(activity.content, /published:\s*true/);
	}
});

// --- project activity: teaches exactly lesson 07's material -----------------

test('project activity requirements cover attributes, new instantiation, this, and references (lesson 07 scope)', async () => {
	const content = project.content;
	assert.match(content, /public class Producto|class Producto/i, 'sanity: about a Producto class');
	assert.match(content, /new /);
	assert.match(content, /this\./);
	assert.match(content, /venderUnidades/);
	assert.match(content, /reponerStock/);
	assert.match(content, /mostrarFicha/);
	assert.match(content, /requirements:/);
	assert.match(content, /objectives:/);
	assert.match(content, /exampleOutput:/);
});

test('project activity does not require encapsulation or custom constructors (lesson 08 scope, not yet taught)', async () => {
	const content = project.content;
	assert.doesNotMatch(content, /private\s+(String|int|double|boolean)/, 'attributes must stay public, matching lesson 07');
	assert.doesNotMatch(content, /public Producto\(/, 'no custom parametrized constructor requirement');
});

test('project activity demonstrates reference aliasing (copying a reference vs a new object)', async () => {
	const content = project.content;
	assert.match(content, /mismo objeto|misma referencia|alias/i);
});

// --- quiz activity: ~10 questions, mixed kinds, explanations present --------

test('quiz activity has between 8 and 12 questions mixing single-choice and true-false', async () => {
	const content = quiz.content;
	const questionKinds = [...content.matchAll(/-\s*kind:\s*'(single-choice|true-false)'/g)].map((m) => m[1]);
	assert.ok(questionKinds.length >= 8 && questionKinds.length <= 12, `expected 8-12 questions, found ${questionKinds.length}`);
	assert.ok(questionKinds.includes('single-choice'), 'expected at least one single-choice question');
	assert.ok(questionKinds.includes('true-false'), 'expected at least one true-false question');
});

test('quiz activity: every question has a non-empty explanation', async () => {
	const content = quiz.content;
	// Explanations are authored as YAML folded scalars (`explanation: >-`) so
	// long text stays readable; assert one per question and that each is
	// followed by real (non-blank) body text before the next key/list item.
	const explanationBlocks = [...content.matchAll(/explanation:\s*>-\n((?:\s{4,}.+\n?)+)/g)];
	assert.ok(explanationBlocks.length >= 8, `expected at least 8 explanations, found ${explanationBlocks.length}`);
	for (const [, body] of explanationBlocks) {
		assert.ok(body.trim().length > 20, 'explanation body must be real, non-trivial text');
	}
});

test('quiz activity covers class vs object, new/Heap, this, and references (lesson 07 topics)', async () => {
	const content = quiz.content;
	assert.match(content, /clase/i);
	assert.match(content, /objeto/i);
	assert.match(content, /new/);
	assert.match(content, /Heap/);
	assert.match(content, /this/);
	assert.match(content, /referencia/i);
});

test('quiz activity does not test constructors or encapsulation (lesson 08 scope)', async () => {
	const content = quiz.content;
	assert.doesNotMatch(content, /encapsulamiento/i);
	assert.doesNotMatch(content, /modificador de acceso|private\b/i);
});
