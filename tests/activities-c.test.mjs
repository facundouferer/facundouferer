import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { DONE_STAGE, LESSONS, TAUGHT_AT, activityStage, orderOf } from './helpers/c-curriculum.mjs';

// S8 of odd/tasks/c-course-redesign.md: every C lesson has, in Spanish,
// src/content/activities/c/<lesson>/autoevaluacion-<lesson>.es.md (a 10-12
// question quiz mixing concepts, output prediction and error detection) and
// one code project, both using only topics taught up to that lesson.

// Whole words only: \b treats accented letters as non-word characters.
const VOSEO = /(?<!\p{L})(tenés|podés|querés|hacés|sabés|ejecutás|escribís|usás|agregás|creás|compilás|declarás|hacé|ejecutá|probá|mirá|elegí|fijate|imaginá|construí|implementá|escribí|compilá|usá|creá|agregá|definí|declará|recordá|pensá|completá|validá|mostrá|leé|guardá)(?!\p{L})/iu;

const dir = (lesson) => `src/content/activities/c/${lesson.slug}`;
const quizPath = (lesson) => `${dir(lesson)}/autoevaluacion-${lesson.slug}.es.md`;

function questions(content) {
	const start = content.indexOf('\nquestions:\n');
	const end = content.indexOf('\n---', start);
	return content.slice(start, end).split(/\n  - kind: /).slice(1).map((block) => `kind: ${block}`);
}

function assertSequencing(lesson, content, name) {
	for (const [owner, pattern, description] of TAUGHT_AT) {
		if (lesson.order >= orderOf[owner]) continue;
		assert.doesNotMatch(content, pattern, `${name} must not use ${description} before ${owner}`);
	}
}

for (const lesson of LESSONS.filter((lesson) => activityStage(lesson) <= DONE_STAGE)) {
	test(`${lesson.slug} has a published Spanish self-assessment quiz`, async () => {
		assert.ok(existsSync(quizPath(lesson)), `missing ${quizPath(lesson)}`);
		const content = await readFile(quizPath(lesson), 'utf8');
		assert.match(content, /^course: 'c'$/m);
		assert.match(content, new RegExp(`^lesson: '${lesson.slug}'$`, 'm'));
		assert.match(content, new RegExp(`^slug: 'autoevaluacion-${lesson.slug}'$`, 'm'));
		assert.match(content, /^kind: 'quiz'$/m);
		assert.match(content, /^lang: 'es'$/m);
		assert.match(content, /^published: true$/m);
		assert.match(content, /^estimatedMinutes: \d+$/m);
	});

	test(`${lesson.slug} quiz has 10-12 questions with valid answers and code to read`, async () => {
		const blocks = questions(await readFile(quizPath(lesson), 'utf8'));
		assert.ok(blocks.length >= 10 && blocks.length <= 12, `found ${blocks.length} questions`);
		const ids = blocks.map((block) => block.match(/^\s+id: '([^']+)'$/m)?.[1]);
		assert.equal(new Set(ids).size, blocks.length, 'question ids must be unique');
		let singles = 0;
		let withCode = 0;
		for (const block of blocks) {
			assert.match(block, /^\s+explanation: /m, 'every question explains its answer');
			if (block.startsWith("kind: 'single-choice'")) {
				singles += 1;
				const options = [...block.matchAll(/^\s+- id: '([^']+)'$/gm)].map((m) => m[1]);
				const correct = block.match(/^\s+correctOptionId: '([^']+)'$/m)?.[1];
				assert.ok(options.length >= 3, 'single-choice needs 3+ options');
				assert.ok(options.includes(correct), `correctOptionId ${correct} must be an option`);
			} else {
				assert.match(block, /^kind: 'true-false'/);
				assert.match(block, /^\s+correctAnswer: (true|false)$/m);
			}
			if (/^\s+code: /m.test(block)) {
				withCode += 1;
				assert.match(block, /^\s+codeLanguage: '(c|bash)'$/m, 'snippets are C or a shell session');
			}
		}
		assert.ok(singles >= blocks.length / 2, 'at least half are single-choice');
		assert.ok(withCode >= 4, 'at least four questions read code (prediction or error detection)');
	});

	test(`${lesson.slug} has one code project`, async () => {
		const files = existsSync(dir(lesson)) ? await readdir(dir(lesson)) : [];
		const projects = [];
		for (const file of files.filter((name) => name.endsWith('.es.md'))) {
			const content = await readFile(`${dir(lesson)}/${file}`, 'utf8');
			if (/^kind: 'project'$/m.test(content)) projects.push(content);
		}
		assert.equal(projects.length, 1, 'exactly one project per lesson');
		const [content] = projects;
		assert.match(content, /^course: 'c'$/m);
		assert.match(content, new RegExp(`^lesson: '${lesson.slug}'$`, 'm'));
		assert.match(content, /^lang: 'es'$/m);
		assert.match(content, /^exampleOutput: /m);
		assert.match(content, /-std=c23/, 'the project states the course compile command');
		const requirements = content.slice(content.indexOf('\nrequirements:\n')).split('\n').filter((line) => /^  - /.test(line));
		assert.ok(requirements.length >= 3, 'at least three requirements');
	});

	test(`${lesson.slug} activities use only earlier topics and neutral Spanish`, async () => {
		const files = existsSync(dir(lesson)) ? await readdir(dir(lesson)) : [];
		for (const file of files) {
			const content = await readFile(`${dir(lesson)}/${file}`, 'utf8');
			assertSequencing(lesson, content, file);
			assert.doesNotMatch(content, VOSEO, `${file} must not use voseo`);
			assert.doesNotMatch(content, /\bvoid\s+main\s*\(/, `${file}: main returns int`);
		}
	});
}
