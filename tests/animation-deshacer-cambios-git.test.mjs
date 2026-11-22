import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/deshacer-cambios-git.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'deshacer-cambios-git';
const LESSON = 'deshacer-cambios';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '02-deshacer-cambios';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const linesRun = (cues) => cues.filter((cue) => cue.do === 'move' && cue.el === 'hl').map((cue) => Number(cue.to.slice(3)));

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
		['restore', 'amend', 'revert', 'reset', 'reflog', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['chain', 'restore', 'amend', 'revert', 'soft', 'mixed', 'hard', 'reflog', 'recap'],
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
		// 1. What is HEAD, and what does `git restore` do with an uncommitted change?
		'`head`',
		'`main`',
		'hash',
		'git restore',
		'working tree',
		'se pierde para siempre',
		// 2. What does `--amend` do to the last commit?
		'--amend',
		'crea uno nuevo',
		'sale del historial',
		'--no-edit',
		'sin compartir',
		// 3. How does `git revert` undo a commit without rewriting history?
		'git revert',
		'cambio inverso',
		'sigue en el historial',
		'ya compartiste',
		// 4. Where do the changes land with --soft, --mixed and --hard?
		'head~1',
		'--soft',
		'staging',
		'--mixed',
		'por defecto',
		'--hard',
		'igual a `head`',
		'ya no existe',
		// 5. How do you get a commit back after `reset --hard`?
		'git reflog',
		'cada lugar',
		'git reset --hard 6b8f501',
		// 6. What can be recovered and what cannot?
		'casi siempre se recupera',
		'nunca estuvo en un commit',
		'reescriben el historial',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|hacé|usá|volvé|deshacé)\b/i);
	// Topics from later lessons stay out of the film.
	assert.doesNotMatch(all, /checkout|stash|rebase|push|pull|fetch|merge|branch|rama/i);
});

test('the English narration covers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'`head`',
		'git restore',
		'lost for good',
		'--amend',
		'creates a new one',
		'leaves the history',
		'git revert',
		'opposite change',
		'stays in the history',
		'--soft',
		'staging area',
		'--mixed',
		'working tree',
		'--hard',
		'git reflog',
		'git reset --hard bdf42a1',
		'almost always be recovered',
		'never in a commit',
		'rewrite history',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /checkout|stash|rebase|push|pull|fetch|merge|branch/i);
});

test('the editor runs every command once, in order, and each has its module', () => {
	const lines = script.steps.flatMap((step) => linesRun(step.motion.cues));
	assert.deepEqual(lines, Array.from({ length: 18 }, (_, index) => index + 1));
	const typed = script.steps.flatMap((step) => idsOf(step.motion.cues, 'type')).filter((id) => id.startsWith('e-'));
	assert.deepEqual(typed, lines.map((n) => `e-${n}`));
	const stops = script.steps.flatMap((step) => stopsOf(step.motion.cues, 'p'));
	assert.deepEqual(stops, lines.map((n) => `a-m-${n}`), 'the particle visits the module of each command');
	const lit = script.steps.flatMap((step) => idsOf(step.motion.cues, 'enter')).filter((id) => /^on-\d+$/.test(id));
	assert.deepEqual(lit, lines.map((n) => `on-${n}`), 'the module of each command lights up');
});

test('HEAD moves along the chain: forward with each commit, back with each reset', () => {
	const tips = script.steps.flatMap((step) => stopsOf(step.motion.cues, 'head'));
	assert.deepEqual(tips, ['a-tip-1', 'a-tip-2', 'a-tip-3', 'a-tip-4', 'a-tip-3', 'a-tip-4', 'a-tip-3', 'a-tip-4', 'a-tip-3', 'a-tip-4']);
});

test('restore discards the change; amend and reset drop commits that reflog brings back', () => {
	const restore = cuesOf('restore');
	assert.ok(idsOf(restore, 'enter').includes('f-saludo'), 'the wrong change appears in the working tree');
	assert.ok(idsOf(restore, 'exit').includes('f-saludo'), 'restore discards it');
	assert.ok(idsOf(restore, 'enter').includes('lb-lost'));

	// --amend replaces the last commit twice: two new hashes, the old ones out of the history.
	const amend = cuesOf('amend');
	assert.deepEqual(stopsOf(amend, 'c-typo'), ['a-o-1']);
	assert.deepEqual(stopsOf(amend, 'c-am1'), ['a-o-2']);
	for (const id of ['c-typo-off', 'c-am1-off', 'c-am1', 'c-am2', 'lb-out']) assert.ok(idsOf(amend, 'enter').includes(id), `amend shows ${id}`);
	assert.deepEqual(stopsOf(amend, 'f-firma'), ['a-slot-1'], 'the forgotten file joins the amended commit');

	// revert adds a commit; the original stays.
	const revert = cuesOf('revert');
	assert.ok(idsOf(revert, 'enter').includes('c-revert'));
	assert.ok(!revert.some((cue) => cue.el === 'c-change' && (cue.do === 'move' || cue.do === 'exit')), 'the reverted commit stays in place');

	// The three resets: where the changes of the undone commit land.
	assert.deepEqual(stopsOf(cuesOf('soft'), 'f-tareas').at(-1), 'a-stage');
	assert.deepEqual(stopsOf(cuesOf('mixed'), 'f-tareas').at(-1), 'a-work');
	const hard = cuesOf('hard');
	assert.deepEqual(stopsOf(hard, 'c-t3'), ['a-o-5']);
	assert.ok(!hard.some((cue) => cue.el === 'f-tareas' && cue.do === 'enter'), '--hard leaves no change behind');
	assert.ok(idsOf(hard, 'enter').includes('lb-gone'));
	for (const [step, node] of [
		['soft', 'c-t1'],
		['mixed', 'c-t2'],
		['hard', 'c-t3'],
	]) {
		assert.ok(idsOf(cuesOf(step), 'enter').includes(`${node}-off`), `${step} drops ${node} out of the history`);
	}

	// reflog lights the lane and brings the commit deleted with --hard back.
	const reflog = cuesOf('reflog');
	assert.ok(idsOf(reflog, 'enter').includes('rf-lane'));
	assert.ok(idsOf(reflog, 'flow').includes('rf-lane'));
	assert.ok(idsOf(reflog, 'exit').includes('c-t3-off'));
	assert.deepEqual(stopsOf(reflog, 'c-t3'), ['a-slot-4']);
	assert.ok(idsOf(reflog, 'enter').includes('lb-back'));
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		if (/^c-[a-z0-9]+-off$/.test(id) && component.includes('data-el={`${node.id}-off`}')) return component.includes(`id: '${id.slice(0, -4)}'`);
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

test('the terminal in the canvas is the session the lesson runs', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const session = component.split('const session = [')[1].split('].join')[0].trim().split('\n');
	assert.equal(session.length, 18, 'one command per line, at most 20 lines');
	for (const [index, fragment] of [
		[0, 'git commit -m "${names.initial}"'],
		[2, 'git restore ${names.greeting}'],
		[4, 'git commit --amend -m "${names.farewell}"'],
		[6, 'git commit --amend --no-edit'],
		[8, 'git revert ${hash.change}'],
		[10, 'git reset --soft HEAD~1'],
		[12, 'git reset --mixed HEAD~1'],
		[15, 'git reset --hard HEAD~1'],
		[16, 'git reflog'],
		[17, 'git reset --hard ${hash.t3}'],
	]) {
		assert.ok(session[index].includes(fragment), `line ${index + 1} should run ${fragment}`);
	}
	for (const fragment of [
		"t('saludo.txt', 'greeting.txt')",
		"t('firma.txt', 'signature.txt')",
		"t('tareas.txt', 'tasks.txt')",
		"t('Agrega despedia', 'Add farewel')",
		"t('Cambia saludo a inglés', 'Change greeting to Spanish')",
		"t('Agrega lista de tareas', 'Add task list')",
		"t('426061e', '261c13d')",
		"t('20633b9', '77dde29')",
		"t('cf59d35', 'f3e279c')",
		"t('ad7fc4f', '9a6ac3b')",
		"t('10fe8c7', '2f55221')",
		"t('946f52b', '42a3fa7')",
		"t('6b8f501', 'bdf42a1')",
		'HEAD is now at ${hash.revert} ${revertMsg}',
		'HEAD@{1}: commit: ${names.list}',
		"highlightCode(session, 'bash')",
	]) {
		assert.ok(component.includes(fragment), `missing terminal fragment: ${fragment}`);
	}
	assert.ok(session.every((line) => line.length <= 66), 'every command fits the editor width');
});

test('the hashes of the film are the ones the lesson prints', async () => {
	const [es, en] = await Promise.all(['es', 'en'].map((lang) => readFile(`src/content/courses/git/${FILE}.${lang}.md`, 'utf8')));
	for (const hash of ['426061e', '20633b9', 'cf59d35', 'ad7fc4f', '10fe8c7', '946f52b', '0fd046b', '958d100', '6b8f501']) assert.ok(es.includes(hash), `es lesson prints ${hash}`);
	for (const hash of ['261c13d', '77dde29', 'f3e279c', '9a6ac3b', '2f55221', '42a3fa7', '21b77ad', '952ade9', 'bdf42a1']) assert.ok(en.includes(hash), `en lesson prints ${hash}`);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/deshacer-cambios-git'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /stroke-width="(?!2\.75)[^"]*" viewBox="0 0 24 24"|viewBox="0 0 24 24" stroke-width="(?!2\.75)/, 'every icon uses 2.75');
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.doesNotMatch(component, /font-family: (?!var\(--font-body\)|monospace)/, 'fonts stay Organic plus generic monospace');
	assert.equal((component.match(/data-slug='deshacer-cambios-git'/g) ?? []).length, 4);
});
