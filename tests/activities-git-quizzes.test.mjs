import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

// One self-assessment quiz per Git lesson (Spanish, like every activity):
// src/content/activities/git/<lesson>/autoevaluacion-<lesson>.es.md, 10-12
// questions with valid answers, bash snippets, and nothing from later lessons
// (same sequencing contract as tests/courses-git-curriculum.test.mjs).

const LESSONS = [
	'el-principio-con-git',
	'deshacer-cambios',
	'conflictos',
	'bajar-y-subir-cambios',
	'ramas-y-pull-requests',
	'rebase-y-buenas-practicas',
];

const REMOTE = ['git push', 'git pull', 'git fetch', 'git remote', 'git clone'];
const BANNED = {
	'el-principio-con-git': ['git switch', 'git branch', 'git merge', 'git reset', 'git revert', 'git stash', 'git rebase', ...REMOTE],
	'deshacer-cambios': ['git switch -c', 'git branch', 'git merge', 'git stash', 'git rebase', ...REMOTE],
	conflictos: ['git stash', 'git rebase', ...REMOTE],
	'bajar-y-subir-cambios': ['git rebase', '--force'],
	'ramas-y-pull-requests': ['git rebase', '--force'],
	'rebase-y-buenas-practicas': [],
};

// Common voseo forms; Git lessons use neutral "tú".
const VOSEO = /\b(tenés|podés|querés|hacés|sabés|ejecutás|escribís|usás|agregás|creás|hacé|ejecutá|probá|mirá|elegí|fijate|imaginá)\b/i;

const path = (lesson) => `src/content/activities/git/${lesson}/autoevaluacion-${lesson}.es.md`;

// Splits the YAML `questions:` list into one text block per question.
function questions(content) {
	const start = content.indexOf('\nquestions:\n');
	const end = content.indexOf('\n---', start);
	return content.slice(start, end).split(/\n  - kind: /).slice(1).map((block) => `kind: ${block}`);
}

for (const lesson of LESSONS) {
	test(`${lesson} has a published Spanish self-assessment quiz`, async () => {
		assert.ok(existsSync(path(lesson)), `missing ${path(lesson)}`);
		const content = await readFile(path(lesson), 'utf8');
		assert.match(content, /^course: 'git'$/m);
		assert.match(content, new RegExp(`^lesson: '${lesson}'$`, 'm'));
		assert.match(content, new RegExp(`^slug: 'autoevaluacion-${lesson}'$`, 'm'));
		assert.match(content, /^kind: 'quiz'$/m);
		assert.match(content, /^lang: 'es'$/m);
		assert.match(content, /^published: true$/m);
		assert.match(content, /^estimatedMinutes: \d+$/m);
	});

	test(`${lesson} quiz has 10-12 questions with unique ids and valid answers`, async () => {
		const blocks = questions(await readFile(path(lesson), 'utf8'));
		assert.ok(blocks.length >= 10 && blocks.length <= 12, `found ${blocks.length} questions`);
		const ids = blocks.map((block) => block.match(/^\s+id: '([^']+)'$/m)?.[1]);
		assert.equal(new Set(ids).size, blocks.length, 'question ids must be unique');
		let singles = 0;
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
				assert.match(block, /^\s+codeLanguage: 'bash'$/m, 'snippets are shell sessions');
			}
		}
		assert.ok(singles >= blocks.length / 2, 'at least half are single-choice');
	});

	test(`${lesson} quiz uses only this and earlier lessons and neutral Spanish`, async () => {
		const content = await readFile(path(lesson), 'utf8');
		for (const command of BANNED[lesson]) {
			assert.ok(!content.includes(command), `must not use "${command}" yet`);
		}
		assert.doesNotMatch(content, /git checkout/);
		assert.doesNotMatch(content, VOSEO);
	});
}
