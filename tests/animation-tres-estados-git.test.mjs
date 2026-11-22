import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/tres-estados-git.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'tres-estados-git';
const LESSON = 'el-principio-con-git';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '01-el-principio-con-git';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;

test(`catalog binds ${SLUG} to git/${LESSON} as the lesson's only animation`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'git', slug: LESSON });
	assert.deepEqual(
		getAnimationsForLesson('git', LESSON).map((entry) => entry.slug),
		[SLUG],
	);
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'git', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/git/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/git/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['repo', 'stage', 'commit', 'diff', 'unstage', 'history'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['init', 'add', 'commit', 'modify', 'staged', 'unstage', 'chain', 'log'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'journey', `${step.id} plays on the single canvas`);
		assert.ok(step.motion, `${step.id} is a motion step`);
		assert.ok(step.subtitles.every((sub) => typeof sub.at === 'number'), `${step.id} pins captions`);
		assert.ok(step.motion.cues.length >= 10, `${step.id} choreographs the canvas`);
		const starts = step.motion.cues.map((cue) => cue.at);
		assert.deepEqual(starts, [...starts].sort((a, b) => a - b), `${step.id} lists its cues in order`);
	}
	const kinds = new Set(script.steps.flatMap((step) => step.motion.cues.map((cue) => cue.do)));
	for (const kind of ['enter', 'exit', 'draw', 'type', 'move', 'pulse', 'flow', 'camera']) assert.ok(kinds.has(kind), `uses the ${kind} cue`);
});

test('the film lasts between 90 and 120 seconds in both languages', () => {
	for (const lang of ['es', 'en']) {
		const steps = resolveScript(script, lang).steps;
		const total = steps.reduce((sum, step) => sum + step.duration, 0);
		assert.ok(total >= 90_000 && total <= 120_000, `${lang} runs for ${Math.round(total / 1000)} s`);
		for (const step of steps) {
			assert.ok(step.duration > Math.max(...step.motion.cues.map(cueEnd)), `${step.id} (${lang}) outlasts its cues`);
		}
	}
});

test('every step has a bilingual title and two or three short captions', () => {
	for (const step of script.steps) {
		assert.ok(step.subtitles.length >= 2 && step.subtitles.length <= 3, `${step.id} narrates in two or three captions`);
		for (const lang of ['es', 'en']) {
			assert.ok(step.title[lang]?.length > 0, `${step.id} title.${lang}`);
			for (const sub of step.subtitles) {
				const length = sub.text[lang]?.length ?? 0;
				assert.ok(length >= 15 && length <= 120, `${step.id} caption.${lang} must be short (${length}): ${sub.text[lang]}`);
			}
		}
	}
});

const narration = (lang) =>
	resolveScript(script, lang)
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n')
		.toLowerCase();

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// 1. Where does a new file live?
		'git init',
		'.git',
		'working directory',
		'untracked files',
		'aún no lo controla',
		// 2. What does `git add` do?
		'git add hola.txt',
		'staging area',
		'próximo commit',
		// 3. What does a commit store?
		'git commit -m',
		'foto de los archivos',
		'hash, autor, fecha, mensaje y padre',
		'edf5c7d',
		'root-commit',
		'sin padre',
		// 4. How do commits link?
		'5904ec5',
		'hash de su padre',
		'se encadena el historial',
		'head -> main',
		'git log --oneline',
		// 5. What does each diff compare?
		'`git diff` compara el working directory contra el staging area',
		'`git diff --staged` compara el staging area contra el último commit',
		'+estoy aprendiendo git',
		'modified',
		// 6. How to unstage a change?
		'git restore --staged hola.txt',
		'conserva lo que escribiste',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|agregá|creá)\b/i);
	// Curriculum sequencing: nothing from later lessons.
	assert.doesNotMatch(all, /checkout|switch|branch|rama|merge|push|pull|fetch|remote|github|rebase|reset|revert|stash|amend/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'working directory',
		'untracked files',
		'git add hello.txt',
		'staging area',
		'next commit',
		'hash, author, date, message and parent',
		'c5b1fcb',
		'root-commit',
		'24c9a2a',
		'the history is chained',
		'head -> main',
		'`git diff` compares the working directory against the staging area',
		'`git diff --staged` compares the staging area against the last commit',
		'+i am learning git',
		'git restore --staged hello.txt',
		'keeps what you wrote',
		'git log --oneline',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /checkout|switch|branch|merge|push|pull|fetch|remote|github|rebase|reset|revert|stash|amend/i);
});

test('the file travels through the three areas and becomes a chain of commits', () => {
	// The new file is untracked in the Working Directory.
	const init = cuesOf('init');
	for (const id of ['z-wd', 'z-st', 'z-repo', 'disk', 'c1', 'st-untracked']) assert.ok(idsOf(init, 'enter').includes(id), `init shows ${id}`);

	// git add takes it to the Staging Area; git commit turns it into the root commit.
	assert.deepEqual(stopsOf(cuesOf('add'), 'c1'), ['a-st']);
	assert.ok(idsOf(cuesOf('add'), 'enter').includes('st-staged'));
	const commit = cuesOf('commit');
	assert.deepEqual(stopsOf(commit, 'c1'), ['a-repo']);
	assert.ok(firstAt(commit, 'enter', 'n1') > firstAt(commit, 'exit', 'c1'), 'the card becomes the commit node');
	assert.ok(idsOf(commit, 'enter').includes('lb-root'));

	// The second edit: git diff looks between the Working Directory and the Staging Area,
	// git diff --staged between the Staging Area and the last commit.
	const modify = cuesOf('modify');
	assert.ok(idsOf(modify, 'enter').includes('c2'));
	assert.ok(idsOf(modify, 'enter').includes('st-modified'));
	assert.ok(idsOf(modify, 'draw').includes('cmp-wd'));
	assert.ok(!idsOf(modify, 'draw').includes('cmp-st'));
	const staged = cuesOf('staged');
	assert.deepEqual(stopsOf(staged, 'c2'), ['a-st']);
	assert.ok(idsOf(staged, 'draw').includes('cmp-st'));
	assert.ok(firstAt(staged, 'draw', 'cmp-st') > firstAt(staged, 'move', 'c2'), 'diff --staged runs once the change is staged');

	// git restore --staged sends it back without losing it; git add stages it again.
	const unstage = cuesOf('unstage');
	assert.deepEqual(stopsOf(unstage, 'c2'), ['a-wd', 'a-st']);
	assert.ok(!idsOf(unstage, 'exit').includes('disk'), 'the file stays on disk');
	assert.ok(idsOf(unstage, 'draw').includes('fl-back'));

	// The second commit points to its parent and HEAD moves to it.
	const chain = cuesOf('chain');
	assert.deepEqual(stopsOf(chain, 'c2'), ['a-repo2']);
	assert.deepEqual(stopsOf(chain, 'head'), ['a-head-2']);
	for (const id of ['n2', 'head']) assert.ok(idsOf(chain, 'enter').includes(id));
	assert.ok(idsOf(chain, 'draw').includes('link'), 'the parent link is drawn');

	// git log --oneline prints the chain, and the camera pulls back to the whole system.
	const log = cuesOf('log');
	assert.deepEqual(idsOf(log, 'type').filter((id) => /^o14-/.test(id)), ['o14-1', 'o14-2']);
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
});

test('every command runs on its editor line and lights its own module', () => {
	const commands = [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14];
	const all = script.steps.flatMap((step) => step.motion.cues);
	for (const line of commands) {
		assert.ok(stopsOf(all, 'hl').includes(`ln-${line}`), `the bar reaches line ${line}`);
		assert.ok(stopsOf(all, 'p').includes(`a-m${line}`), `the flow visits the module of line ${line}`);
		assert.ok(idsOf(all, 'enter').includes(`m-${line}`), `module ${line} is built`);
		assert.ok(idsOf(all, 'enter').includes(`on-${line}`), `module ${line} lights up`);
	}
	for (const line of [2, 6]) assert.ok(idsOf(all, 'type').includes(`ed-${line}`), `comment line ${line} is typed`);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`lit: '${id}'`)) return true;
		// Output rows `o<line>-<row>` come from the `outputs` table.
		const row = id.match(/^o(\d+)-(\d+)$/);
		if (row) return new RegExp(`line: ${row[1]},\\s*rows:`).test(component) && Number(row[2]) <= 6;
		const prefix = id.replace(/\d+$/, '');
		return prefix !== id && component.includes('`' + prefix + '${');
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the terminal in the canvas is the session the lesson teaches', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const session = component.split('const session = [')[1].split('].join')[0].trim().split('\n');
	assert.equal(session.length, 14, 'the editor holds the 14 lines of the session');
	const expected = [
		"'git init',",
		"`# ${t('creas', 'create')} ${names.file}`,",
		"'git status',",
		'`git add ${names.file}`,',
		'`git commit -m "${msg.first}"`,',
		"`# ${t('agregas una línea a', 'add a line to')} ${names.file}`,",
		"'git status',",
		"'git diff',",
		'`git add ${names.file}`,',
		"'git diff --staged',",
		'`git restore --staged ${names.file}`,',
		'`git add ${names.file}`,',
		'`git commit -m "${msg.second}"`,',
		"'git log --oneline',",
	];
	assert.deepEqual(
		session.map((line) => line.trim()),
		expected,
	);
	assert.match(component, /highlightCode\(session, 'bash'\)/, 'the session uses bash highlighting');
	for (const fragment of [
		"t('hola.txt', 'hello.txt')",
		"t('mi-proyecto', 'my-project')",
		"t('Agrega saludo inicial', 'Add initial greeting')",
		"t('Agrega segunda línea al saludo', 'Add a second line to the greeting')",
		"t('edf5c7d', 'c5b1fcb')",
		"t('5904ec5', '24c9a2a')",
		"t('Estoy aprendiendo Git', 'I am learning Git')",
		'Initialized empty Git repository in /home/ana/',
		"'Untracked files:'",
		'[main (root-commit) ${hash.first}] ${msg.first}',
		"'Changes not staged for commit:'",
		"'@@ -1 +1,2 @@'",
		'(HEAD -> main)',
	]) {
		assert.ok(component.includes(fragment), `missing session fragment: ${fragment}`);
	}
	// Every line fits the editor (about 64 characters) once its names are filled in, in both languages.
	const longest = {
		'${names.file}': 'hello.txt',
		'${msg.first}': 'Add initial greeting',
		'${msg.second}': 'Add a second line to the greeting',
		"${t('creas', 'create')}": 'create',
		"${t('agregas una línea a', 'add a line to')}": 'agregas una línea a',
	};
	for (const line of session) {
		let filled = line.trim().slice(1, -2);
		for (const [slot, value] of Object.entries(longest)) filled = filled.replaceAll(slot, value);
		assert.doesNotMatch(filled, /\$\{/, `unfilled slot in ${line}`);
		assert.ok(filled.length <= 60, `a session line is too long (${filled.length}): ${filled}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/tres-estados-git'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');
	assert.match(component, /font-family: var\(--font-body\)/);

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.equal((component.match(/data-slug='tres-estados-git'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
