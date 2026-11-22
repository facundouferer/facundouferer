import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

// The Git course curriculum (odd/tasks/git-course-overhaul.md, S5-S8):
// six lessons in a fixed order, a roadmap that follows it, an exercises
// section with solutions in every lesson, no `git checkout`, the commands each
// lesson is responsible for teaching, and no commands from later lessons.

const GIT_DIR = 'src/content/courses/git';

const LESSONS = [
	{ order: 1, slug: 'el-principio-con-git', file: '01-el-principio-con-git' },
	{ order: 2, slug: 'deshacer-cambios', file: '02-deshacer-cambios' },
	{ order: 3, slug: 'conflictos', file: '03-conflictos' },
	{ order: 4, slug: 'bajar-y-subir-cambios', file: '04-bajar-y-subir-cambios' },
	{ order: 5, slug: 'ramas-y-pull-requests', file: '05-ramas-y-pull-requests' },
	{ order: 6, slug: 'rebase-y-buenas-practicas', file: '06-rebase-y-buenas-practicas' },
];

const LOCALES = [
	{ lang: 'es', exercises: '## Ejercicios prácticos', solution: '<summary>Ver solución</summary>' },
	{ lang: 'en', exercises: '## Practice exercises', solution: '<summary>Show solution</summary>' },
];

// Commands each lesson must teach (S7).
const REQUIRED = {
	'el-principio-con-git': ['git config --global user.name', 'git init', 'git status', 'git add', 'git restore --staged', 'git commit -m', 'git diff --staged', 'git log --oneline'],
	'deshacer-cambios': ['git restore', 'git commit --amend', 'git revert', 'git reset --soft', 'git reset --mixed', 'git reset --hard', 'git switch --detach', 'git restore --source', 'git reflog', 'git show'],
	conflictos: ['git branch', 'git switch -c', 'git switch', 'git log --oneline --graph --all', 'git merge', 'git merge --abort', 'git branch -d'],
	'bajar-y-subir-cambios': ['git remote add origin', 'git remote -v', 'git push -u origin main', 'git clone', 'git fetch', 'origin/main', 'git log main..origin/main', 'git pull', 'pull.rebase', 'git stash', 'git stash pop', 'ssh-keygen -t ed25519', 'ssh -T git@github.com'],
	'ramas-y-pull-requests': ['git switch -c', 'git push -u origin', 'Pull Request', 'git merge origin/main', 'git push origin --delete', 'git fetch --prune'],
	'rebase-y-buenas-practicas': ['git rebase origin/main', 'git rebase --continue', 'git rebase --abort', 'git rebase -i', '--force-with-lease', 'git rm --cached', 'git diff --staged', 'git add -p', 'BREAKING CHANGE'],
};

// Commands a lesson must not use yet, because a later lesson teaches them (S7).
const REMOTE = ['git push', 'git pull', 'git fetch', 'git remote', 'git clone'];
const BANNED = {
	'el-principio-con-git': ['git switch', 'git branch', 'git merge', 'git reset', 'git revert', 'git stash', 'git rebase', ...REMOTE],
	'deshacer-cambios': ['git switch -c', 'git branch', 'git merge', 'git stash', 'git rebase', ...REMOTE],
	conflictos: ['git stash', 'git rebase', ...REMOTE],
	'bajar-y-subir-cambios': ['git rebase', '--force'],
	'ramas-y-pull-requests': ['git rebase', '--force'],
	'rebase-y-buenas-practicas': [],
};

const read = (lesson, lang) => readFile(`${GIT_DIR}/${lesson.file}.${lang}.md`, 'utf8');
const field = (content, key) => content.match(new RegExp(`^${key}:\\s*'?([^'\\n]+)'?\\s*$`, 'm'))?.[1].trim();
// Prose and code, without the inline SVG diagrams.
const body = (content) => content.replace(/<svg[\s\S]*?<\/svg>/g, '');

test('the git course has exactly six lessons per locale', async () => {
	const files = await readdir(GIT_DIR);
	for (const { lang } of LOCALES) {
		const expected = LESSONS.map((lesson) => `${lesson.file}.${lang}.md`).sort();
		assert.deepEqual(files.filter((file) => file.endsWith(`.${lang}.md`)).sort(), expected);
	}
});

for (const lesson of LESSONS) {
	for (const { lang } of LOCALES) {
		test(`${lesson.file}.${lang} declares its slug, order, course and locale`, async () => {
			const content = await read(lesson, lang);
			assert.equal(field(content, 'slug'), lesson.slug);
			assert.equal(Number(field(content, 'order')), lesson.order);
			assert.equal(field(content, 'course'), 'git');
			assert.equal(field(content, 'lang'), lang);
		});
	}
}

test('the git roadmap lists the lessons in order, each once', async () => {
	const index = await readFile(`${GIT_DIR}/index.md`, 'utf8');
	const roadmap = index.slice(index.indexOf('\nroadmap:'));
	const slugs = [...roadmap.matchAll(/^\s*-\s*'([^']+)'\s*$/gm)].map((match) => match[1]);
	assert.deepEqual(slugs, LESSONS.map((lesson) => lesson.slug));
});

for (const lesson of LESSONS) {
	for (const { lang, exercises, solution } of LOCALES) {
		const name = `${lesson.file}.${lang}`;

		test(`${name} ends with at least three exercises with solutions`, async () => {
			const content = await read(lesson, lang);
			const start = content.indexOf(`\n${exercises}\n`);
			assert.ok(start !== -1, `${name} needs "${exercises}"`);
			assert.ok(content.slice(start).split(solution).length - 1 >= 3, `${name} needs 3+ solutions`);
		});

		test(`${name} does not use git checkout`, async () => {
			assert.doesNotMatch(await read(lesson, lang), /git checkout/);
		});

		test(`${name} teaches the commands it owns`, async () => {
			const content = await read(lesson, lang);
			for (const command of REQUIRED[lesson.slug]) {
				assert.ok(content.includes(command), `${name} must teach "${command}"`);
			}
		});

		test(`${name} does not use commands taught in a later lesson`, async () => {
			const content = body(await read(lesson, lang));
			for (const command of BANNED[lesson.slug]) {
				assert.ok(!content.includes(command), `${name} must not use "${command}" yet`);
			}
		});

		test(`${name} is free of the errors found in the review`, async () => {
			const content = await read(lesson, lang);
			assert.doesNotMatch(content, /e4f5g6h/, 'invalid hash in sample output');
			assert.doesNotMatch(content, /NUNCA borra|NEVER deletes/i, 'Git can lose uncommitted work');
		});
	}
}
