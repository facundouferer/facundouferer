import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/sincronizacion-remota-git.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'sincronizacion-remota-git';
const LESSON = 'bajar-y-subir-cambios';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '04-bajar-y-subir-cambios';
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
		['remote', 'clone', 'fetch', 'pull', 'rejected', 'fix'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['push', 'clone', 'stale', 'fetch', 'pull', 'rejected', 'merge', 'recap'],
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
		// 1. How does Ana publish her repository on GitHub, and what does -u leave set up?
		'git remote add',
		'`origin`',
		'git push -u origin main',
		'siguiendo a `origin/main`',
		// 2. What does git clone give Beto?
		'git clone',
		'todo su historial',
		'ya sigue a `origin/main`',
		// 3. Why does git status say "up to date" when the remote moved ahead?
		'git status',
		'al día',
		'la foto',
		// 4. What does git fetch change, and what does it leave alone?
		'git fetch',
		'solo mueve `origin/main`',
		'no cambian',
		'atrás por 1 commit',
		// 5. What does git pull do, and when is it a fast-forward?
		'git pull',
		'merge de `origin/main` en `main`',
		'fast-forward',
		// 6. Why is a push rejected, and how is it fixed?
		'rechaza',
		'trabajo que beto no tiene',
		'solo adelanta la rama remota',
		'pull.rebase false',
		'dos padres',
		'primero `git pull`, después `git push`',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|subí|traé)\b/i);
	// Concepts from later lessons stay out of the film.
	assert.doesNotMatch(all, /--force|stash|pull request|git rebase|rebase -i|\brama nueva\b|switch/i);
});

test('the English narration covers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'git remote add',
		'git push -u origin main',
		'tracks `origin/main`',
		'git clone',
		'all its history',
		'up to date',
		'snapshot',
		'only moves `origin/main`',
		'behind by 1 commit',
		'fast-forward',
		'rejects',
		'only moves the remote forward',
		'pull.rebase false',
		'two parents',
		'`git pull` first, then `git push`',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /--force|stash|pull request|git rebase|rebase -i/i);
});

test('commits travel between Ana, the remote and Beto along the pipes', () => {
	// push -u: Ana's commit reaches the remote; Ana's main starts tracking origin/main.
	const push = cuesOf('push');
	assert.deepEqual(stopsOf(push, 'pk-push1'), ['a-port-ana', 'a-port-rem-a', 'a-rem-c1']);
	for (const id of ['rem-c1', 'rem-main', 'ana-origin']) assert.ok(idsOf(push, 'enter').includes(id), `push shows ${id}`);

	// clone: a copy of the whole history lands on Beto's computer, with both tags.
	const clone = cuesOf('clone');
	assert.deepEqual(stopsOf(clone, 'pk-clone'), ['a-port-rem-b', 'a-port-beto', 'a-beto-c1']);
	for (const id of ['beto-c1', 'beto-main', 'beto-origin']) assert.ok(idsOf(clone, 'enter').includes(id), `clone shows ${id}`);

	// Beto's push moves the remote, but Ana's origin/main stays where it was.
	const stale = cuesOf('stale');
	assert.deepEqual(stopsOf(stale, 'pk-push2'), ['a-port-beto', 'a-port-rem-b', 'a-rem-c2']);
	assert.deepEqual(stopsOf(stale, 'rem-main'), ['s-rem-m1']);
	assert.deepEqual(stopsOf(stale, 'ana-origin'), [], 'git status does not refresh origin/main');

	// fetch only moves origin/main; pull moves main.
	const fetch = cuesOf('fetch');
	assert.deepEqual(stopsOf(fetch, 'pk-fetch'), ['a-port-rem-a', 'a-port-ana', 'a-ana-c2']);
	assert.deepEqual(stopsOf(fetch, 'ana-origin'), ['s-ana-o1']);
	assert.deepEqual(stopsOf(fetch, 'ana-main'), [], 'fetch never moves main');
	const pull = cuesOf('pull');
	assert.deepEqual(stopsOf(pull, 'ana-main'), ['s-ana-m1', 's-ana-m2'], 'fast-forward, then Ana commits');
	assert.deepEqual(stopsOf(pull, 'pk-push3'), ['a-port-ana', 'a-port-rem-a', 'a-rem-c3']);
});

test('the rejected push bounces back; pull merges and the next push is accepted', () => {
	const rejected = cuesOf('rejected');
	assert.deepEqual(stopsOf(rejected, 'pk-rej'), ['a-port-beto', 'a-port-rem-b', 'a-port-beto'], 'the push comes back');
	for (const id of ['rem-c3-bad', 'ch-rejected', 'hx-16', 'o-16-1']) {
		assert.ok([...idsOf(rejected, 'enter'), ...idsOf(rejected, 'type')].includes(id), `rejection shows ${id}`);
	}
	assert.deepEqual(stopsOf(rejected, 'rem-main'), [], 'the remote does not move');
	assert.ok(!idsOf(rejected, 'enter').includes('rem-b'), 'Beto\'s commit never reaches the remote');

	const merge = cuesOf('merge');
	assert.deepEqual(stopsOf(merge, 'pk-pull'), ['a-port-rem-b', 'a-port-beto', 'a-beto-c3']);
	assert.ok(firstAt(merge, 'enter', 'beto-c3') < firstAt(merge, 'enter', 'beto-m'), 'fetch first, then the merge commit');
	for (const id of ['lk-beto-3m', 'lk-beto-bm']) assert.ok(idsOf(merge, 'draw').includes(id), `merge commit has parent link ${id}`);
	assert.deepEqual(stopsOf(merge, 'beto-main'), ['s-beto-m3']);

	const recap = cuesOf('recap');
	assert.deepEqual(stopsOf(recap, 'pk-push4m'), ['a-port-beto', 'a-port-rem-b', 'a-rem-m']);
	assert.deepEqual(stopsOf(recap, 'rem-main'), ['s-rem-m3']);
	for (const id of ['rem-b', 'rem-m', 'ch-accepted']) assert.ok(idsOf(recap, 'enter').includes(id), `the accepted push shows ${id}`);
});

test('every command is typed, highlighted and runs its own module, in editor order', () => {
	const cues = script.steps.flatMap((step) => step.motion.cues);
	const typed = idsOf(cues, 'type').filter((id) => /^e-\d+$/.test(id));
	assert.deepEqual(typed, Array.from({ length: 19 }, (_, index) => `e-${index + 1}`));
	const bar = stopsOf(cues, 'hl');
	const flow = stopsOf(cues, 'p');
	for (let n = 1; n <= 19; n += 1) {
		assert.ok(bar.includes(`ln-${n}`), `the bar reaches line ${n}`);
		assert.ok(flow.includes(`a-m-${n}`), `the flow reaches module ${n}`);
		assert.ok(idsOf(cues, 'enter').includes(`on-${n}`), `module ${n} lights up`);
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`'${id}'`)) return true;
		if (id.startsWith('a-') && component.includes('`a-${node.id}`') && known(id.slice(2))) return true;
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
	const session = component.split('const session: ')[1].split('];')[0];
	const commands = [...session.matchAll(/cmd: ([`'])(.*?)\1 }/g)].map((match) => match[2]);
	assert.deepEqual(commands, [
		'git remote add origin ${url}',
		'git push -u origin main',
		'git clone ${url} ${names.bob}',
		'git add ${names.tasks}',
		'git commit -m "${msg.c2}"',
		'git push',
		'git status',
		'git fetch',
		'git status',
		'git pull',
		'git add ${names.tasks}',
		'git commit -m "${msg.c3}"',
		'git push',
		'git add README.md',
		'git commit -m "${msg.b}"',
		'git push',
		'git config --global pull.rebase false',
		'git pull',
		'git push',
	]);
	assert.ok(commands.length <= 20, 'the editor holds at most 20 lines');
	for (const fragment of [
		"repo: t('mi-proyecto', 'my-project')",
		"bob: t('beto', 'bob')",
		"tasks: t('tareas.txt', 'tasks.txt')",
		"c2: t('Agrega lista de tareas', 'Add task list')",
		"c3: t('Agrega tarea de SSH', 'Add SSH task')",
		"b: t('Cambia el título del README', 'Change the README title')",
		"c1: t('8e2a90d', '66bc8a9')",
		"m: t('0a7d96a', 'e9d7ba4')",
		"' * [new branch]      main -> main'",
		`"branch 'main' set up to track 'origin/main'."`,
		`"Your branch is up to date with 'origin/main'."`,
		`"Your branch is behind 'origin/main' by 1 commit,"`,
		"'Fast-forward'",
		"' ! [rejected]        main -> main (fetch first)'",
		`"Merge made by the 'ort' strategy."`,
	]) {
		assert.ok(component.includes(fragment), `missing fragment: ${fragment}`);
	}
	const outputBlock = component.split('const outputs: ')[1].split('];')[0];
	const outputs = [...outputBlock.matchAll(/text: (?:`|'|")(.*?)(?:`|'|") },/g)].map((match) => match[1]);
	for (const line of outputs) assert.ok(line.length <= 70, `output line too long for the editor: ${line}`);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/sincronizacion-remota-git'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.match(component, /highlightCode\(.*'bash'\)/, 'the terminal uses the bash highlighter');
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.equal((component.match(/data-slug='sincronizacion-remota-git'/g) ?? []).length, 4);
});

test('the card thumbnail stays in the Organic palette', async () => {
	const svg = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const colors = new Set([...svg.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((match) => match[0].toLowerCase()));
	const organic = new Set(['#f1e8d9', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76', '#faf5ec']);
	for (const color of colors) assert.ok(organic.has(color), `thumbnail color ${color} is not Organic`);
	assert.doesNotMatch(svg, /#f7038a|#00203a/, 'the film palette stays out of the card');
});
