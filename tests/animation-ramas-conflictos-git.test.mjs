import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/ramas-conflictos-git.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'ramas-conflictos-git';
const LESSON = 'conflictos';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '03-conflictos';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;

test(`catalog binds ${SLUG} to git/${LESSON} as its only animation`, () => {
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

test('script is valid: six chapters played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['pointers', 'branch', 'fastforward', 'threeway', 'conflict', 'resolve'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['pointer', 'create', 'advance', 'ff', 'diverge', 'merge', 'conflict', 'resolve'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'journey', `${step.id} plays on the single canvas`);
		assert.ok(step.motion, `${step.id} is a motion step`);
		assert.ok(!step.show && !step.focus && !step.code && !step.shell, `${step.id} draws everything in the canvas`);
		assert.ok(step.subtitles.every((sub) => typeof sub.at === 'number'), `${step.id} pins captions`);
		assert.ok(step.motion.cues.length >= 8, `${step.id} choreographs the canvas`);
		const starts = step.motion.cues.map((cue) => cue.at);
		assert.deepEqual(starts, [...starts].sort((a, b) => a - b), `${step.id} lists its cues in order`);
	}
	const kinds = new Set(script.steps.flatMap((step) => step.motion.cues.map((cue) => cue.do)));
	for (const kind of ['enter', 'exit', 'draw', 'type', 'move', 'pulse', 'flow', 'camera']) assert.ok(kinds.has(kind), `uses the ${kind} cue`);
	// The camera ends pulling back to reveal the whole history.
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
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
				assert.ok(length >= 15 && length <= 110, `${step.id} caption.${lang} must be short (${length}): ${sub.text[lang]}`);
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
		// 1. What is a branch, and what does HEAD mark?
		'puntero móvil',
		'no copia archivos',
		'`head` marca dónde estás',
		'* main',
		// 2. What does `git switch -c` do?
		'git switch -c despedida',
		'en el commit actual y te cambia a ella',
		'avanza solo la rama de `head`',
		// 3. What is a fast-forward merge?
		'no tiene commits propios',
		'solo adelanta el puntero',
		'fast-forward',
		'no crea ningún commit',
		// 4. When and how does Git create a merge commit?
		'divergieron',
		'ancestro común',
		'merge commit',
		'dos padres',
		// 5. When is there a conflict?
		'la misma línea',
		'no adivina',
		'conflict',
		'marcadores',
		// 6. How is a conflict resolved?
		'borras los marcadores',
		'git add',
		'resuelto',
		'git commit',
		'cierra la fusión',
		'git branch -d',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|decidí|borrá|creá)\b/i);
});

test('the English narration covers the same six questions', () => {
	const all = narration('en');
	for (const concept of [
		'movable pointer',
		'`head` marks where you are',
		'git switch -c farewell',
		'at the current commit and switches to it',
		'only moves the pointer forward',
		'fast-forward creates no commit',
		'diverged',
		'common ancestor',
		'two parents',
		'the same line',
		'does not guess',
		'conflict',
		'markers',
		'marks it as resolved',
		'finishes the merge',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
});

test('the film stays inside the lesson: no remotes, rebase or checkout', () => {
	const component = readFile(COMPONENT, 'utf8');
	for (const lang of ['es', 'en']) {
		assert.doesNotMatch(narration(lang), /\b(rebase|push|pull|fetch|origin|checkout|stash|clone)\b/);
	}
	return component.then((source) => assert.doesNotMatch(source, /git (rebase|push|pull|fetch|checkout|stash|clone)\b/));
});

test('labels slide between commits: the fast-forward creates no commit', () => {
	const create = cuesOf('create');
	assert.ok(idsOf(create, 'enter').includes('t-desp'), 'switch -c adds a label on the current commit');
	assert.deepEqual(stopsOf(create, 'head'), ['a-a-h2'], 'HEAD moves to the new branch');

	const advance = cuesOf('advance');
	assert.ok(idsOf(advance, 'enter').includes('c-b'), 'a commit creates a node');
	assert.deepEqual(stopsOf(advance, 't-desp'), ['a-b-1'], 'only the branch HEAD is on moves');
	assert.deepEqual(stopsOf(advance, 't-main'), [], 'main stays behind');
	assert.deepEqual(stopsOf(advance, 'head'), ['a-b-h1', 'a-a-h1'], 'switch main takes HEAD back');

	const ff = cuesOf('ff');
	assert.deepEqual(idsOf(ff, 'enter').filter((id) => id.startsWith('c-')), [], 'the fast-forward creates no commit');
	assert.deepEqual(stopsOf(ff, 't-main'), ['a-b-2', 'a-b-1'], 'main slides to the commit of the other branch');
	assert.ok(idsOf(ff, 'enter').includes('lb-ff'));
	assert.ok(idsOf(ff, 'exit').includes('t-desp'), 'branch -d removes only the label');
	assert.ok(!idsOf(ff, 'exit').includes('c-b'), 'the commit stays');
});

test('diverged branches meet in a merge commit with two parents', () => {
	const diverge = cuesOf('diverge');
	assert.deepEqual(idsOf(diverge, 'enter').filter((id) => /^c-[a-z0-9]+$/.test(id)), ['c-d', 'c-c']);
	assert.deepEqual(stopsOf(diverge, 't-autor'), ['a-d-1']);
	assert.deepEqual(stopsOf(diverge, 't-main'), ['a-c-1']);

	const merge = cuesOf('merge');
	assert.ok(idsOf(merge, 'enter').includes('c-b-anc'), 'the common ancestor lights up');
	assert.deepEqual(idsOf(merge, 'draw').sort(), ['e-cm1', 'e-dm1'], 'two parent links');
	assert.ok(idsOf(merge, 'enter').includes('c-m1'));
	assert.deepEqual(stopsOf(merge, 't-main'), ['a-m1-1']);
	assert.ok(firstAt(merge, 'enter', 'c-m1') > firstAt(merge, 'enter', 'c-b-anc'), 'Git compares with the ancestor first');
});

test('the same line on two branches stops the merge; add and commit close it', () => {
	const conflict = cuesOf('conflict');
	assert.deepEqual(stopsOf(conflict, 't-formal'), ['a-e-1']);
	assert.deepEqual(stopsOf(conflict, 't-main'), ['a-f-1']);
	for (const id of ['c-m2-wait', 'g-m2', 'lb-conflict', 'hxc-8', 'fv-markers', 'm-c7-on']) {
		assert.ok(idsOf(conflict, 'enter').includes(id), `the conflict shows ${id}`);
	}
	assert.ok(!idsOf(conflict, 'enter').includes('c-m2'), 'no merge commit while the conflict is open');
	assert.deepEqual(idsOf(conflict, 'type').filter((id) => id.startsWith('fvm-')), ['fvm-1', 'fvm-2', 'fvm-3', 'fvm-4', 'fvm-5']);

	const resolve = cuesOf('resolve');
	const resolved = firstAt(resolve, 'enter', 'fv-final');
	const added = firstAt(resolve, 'enter', 'm-c10-on');
	const committed = firstAt(resolve, 'enter', 'm-c11-on');
	const merged = firstAt(resolve, 'enter', 'c-m2');
	assert.ok(resolved < added && added < committed && committed < merged, 'edit, git add, git commit, merge commit');
	assert.deepEqual(stopsOf(resolve, 't-main'), ['a-m2-1']);
	assert.ok(idsOf(resolve, 'exit').includes('c-m2-wait'));
	assert.ok(idsOf(resolve, 'exit').includes('t-formal'), 'branch -d removes the merged label');
});

test('every command runs on its module and its editor line', () => {
	for (const step of script.steps) {
		for (const cue of step.motion.cues.filter((entry) => entry.do === 'move' && entry.el === 'p')) {
			const [, page, line] = cue.to.match(/^a-m-([abc])(\d+)$/) ?? [];
			assert.ok(page, `${step.id}: the particle stops on a module (${cue.to})`);
			const bar = step.motion.cues.find((entry) => entry.do === 'move' && entry.el === 'hl' && entry.at === cue.at);
			assert.equal(bar?.to, `ln-${line}`, `${step.id}: the bar runs line ${line} with the particle`);
			assert.ok(idsOf(step.motion.cues, 'type').includes(`e${page}-${line}`), `${step.id}: line ${line} is typed`);
		}
	}
});

test('the terminal session is the lesson session, localized like the lesson', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"cmd('git branch')",
		"out('* main')",
		'cmd(`git switch -c ${br.desp}`)',
		"out(`Switched to a new branch '${br.desp}'`)",
		'cmd(`git commit -m "${msg.desp}"`)',
		"cmd('git switch main')",
		'cmd(`git merge ${br.desp}`)',
		'out(`Updating ${hash.a}..${hash.b}`)',
		"out('Fast-forward')",
		'cmd(`git branch -d ${br.desp}`)',
		'out("Merge made by the \'ort\' strategy.")',
		'err(`CONFLICT (content): Merge conflict in ${files.saludo}`)',
		"err('Automatic merge failed; fix conflicts and then commit the result.')",
		"cmd('git commit')",
		"out(`[main ${hash.m2}] Merge branch '${br.formal}'`)",
		"t('despedida', 'farewell')",
		"t('autor', 'author')",
		"t('saludo-formal', 'formal-greeting')",
		"t('saludo.txt', 'greeting.txt')",
		"t('Agrega despedida', 'Add farewell')",
		"t('Mejora la despedida', 'Improve the farewell')",
		"t('Usa un saludo formal', 'Use a formal greeting')",
		"t('Amplía el saludo', 'Expand the greeting')",
		"t('Buenos días, mundo entero', 'Good morning, whole world')",
		"t('954f1dd', '84e98ce')",
		"t('54f85d4', '1c21b09')",
		"t('0a2af46', 'a73905e')",
		"t('6b5dba7', '5f1ebe6')",
		"'<<<<<<< HEAD'",
		"'======='",
		'`>>>>>>> ${br.formal}`',
	]) {
		assert.ok(component.includes(fragment), `missing session fragment: ${fragment}`);
	}
	const lines = (name) => component.split(`const ${name}: Line[] = [`)[1].split('];')[0].trim().split('\n');
	for (const name of ['sessionA', 'sessionB', 'sessionC']) assert.ok(lines(name).length <= 20, `${name} fits the editor`);
	assert.match(lines('sessionA')[2], /git switch -c/, 'A3 creates the branch');
	assert.match(lines('sessionA')[8], /git merge/, 'A9 merges (fast-forward)');
	assert.match(lines('sessionB')[6], /git merge/, 'B7 merges (merge commit)');
	assert.match(lines('sessionC')[6], /git merge/, 'C7 merges (conflict)');
	assert.match(lines('sessionC')[7], /CONFLICT/, 'C8 reports the conflict');
	assert.match(lines('sessionC')[9], /git add/, 'C10 marks the file as resolved');
	assert.match(lines('sessionC')[10], /cmd\('git commit'\)/, 'C11 closes the merge');
	assert.match(component, /highlightLine\(line\.text, 'bash'\)/, 'commands use the bash tokenizer');
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Literal ids, plus template ids such as data-el={`m-${module.page}${module.n}-on`}
	// or anchor ids built as id: `a-${commit.id}-h1`.
	const literal = new Set([...component.matchAll(/data-(?:el|anchor)="([^"]+)"/g)].map((match) => match[1]));
	const templates = [...component.matchAll(/(?:data-(?:el|anchor)=\{|id: )`([^`]+)`/g)].map(
		(match) => new RegExp(`^${match[1].replace(/\$\{[^}]+\}/g, '[a-z0-9-]+?').replace(/[.]/g, '\\.')}$`),
	);
	const named = new Set([...component.matchAll(/id: '([^']+)'/g)].map((match) => match[1]));
	const known = (id) => literal.has(id) || named.has(id) || templates.some((pattern) => pattern.test(id));

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
	for (const id of ['shot-start', 'shot-a', 'shot-b', 'shot-c', 'shot-all']) assert.ok(named.has(id), `camera anchor ${id}`);
	for (const id of ['c-a', 'c-b', 'c-c', 'c-d', 'c-m1', 'c-e', 'c-f', 'c-m2']) assert.ok(known(id), `commit node ${id}`);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/ramas-conflictos-git'/);
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
	assert.equal((component.match(/data-slug='ramas-conflictos-git'/g) ?? []).length, 4);
});
