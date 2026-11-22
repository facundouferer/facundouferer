import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script, session } from '../src/data/animations/rebase-git.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'rebase-git';
const LESSON = 'rebase-y-buenas-practicas';
const FILE = '06-rebase-y-buenas-practicas';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at ?? -1;

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
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['diverge', 'replay', 'conflict', 'rejected', 'lease', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['diverge', 'replay', 'conflict', 'resolve', 'rejected', 'stale', 'lease', 'recap'],
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
		// 1. Why does the branch need updating, and what does git fetch move?
		'feature/carrito',
		'git fetch',
		'solo se mueve `origin/main`',
		'divergencia',
		// 2. What does git rebase do with your commits?
		'git rebase origin/main',
		'aparta tus commits',
		'uno por uno',
		// 3. Why do the hashes change?
		'`a39a0ac` vuelve como `c6d3f43`',
		'commit nuevo',
		'otro padre',
		'el hash cambia',
		// 4. Where does a rebase stop on a conflict, and who are ours and theirs?
		'config.js',
		'se detiene',
		'git status',
		'`head` es la nueva base',
		'"ours" es `origin/main`',
		'"theirs", tu commit',
		// 5. How do you go on after resolving it?
		'git add',
		'sin `git commit`',
		'git rebase --continue',
		'no se borran',
		// 6. Why is a normal push rejected, and why --force-with-lease and never --force?
		'rechazado',
		'non-fast-forward',
		'no hagas `git pull`',
		'sin preguntar',
		'lo borraría',
		'--force-with-lease',
		'compara',
		'la reemplaza',
		'el pull request se actualiza solo',
		'regla de oro',
		'rama compartida',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|hacé|usá|resolvé|subí|dejá)\b/i);
	// Nothing from outside this lesson, and no git checkout anywhere.
	assert.doesNotMatch(all, /checkout|cherry-pick|reset --hard/i);
});

test('the English narration covers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'feature/cart',
		'only `origin/main` moves',
		'one by one',
		'`a45c681` comes back as `2c8e0f3`',
		'another parent',
		'the rebase stops',
		'`head` is the new base',
		'"ours" is `origin/main`',
		'no `git commit`',
		'git rebase --continue',
		'non-fast-forward',
		'do not run `git pull`',
		'without asking anything',
		'--force-with-lease',
		'replaces it',
		'the pull request updates itself',
		'golden rule',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
});

test('the terminal session is the one the lesson runs', () => {
	assert.deepEqual(session.commands, [
		'git fetch',
		'git log --oneline --graph --all',
		'git rebase origin/main',
		'git status',
		'git add config.js',
		'git rebase --continue',
		'git push',
		'git push --force-with-lease',
	]);
	assert.ok(session.commands.length + Math.max(...Object.values(session.outputs).map((lines) => lines.length)) <= 20);
	const outputs = (lang) => Object.fromEntries(Object.entries(session.outputs).map(([id, lines]) => [id, lines.map((line) => line.text[lang]).join('\n')]));
	const es = outputs('es');
	const en = outputs('en');
	assert.match(es.fetch, /10b4cc8\.\.7ac78ac {2}main {7}-> origin\/main/);
	assert.match(en.fetch, /1264b56\.\.d5e72ab {2}main {7}-> origin\/main/);
	assert.match(es.rebase, /CONFLICT \(content\): Merge conflict in config\.js/);
	assert.match(es.rebase, /could not apply 780488a/);
	assert.match(en.rebase, /could not apply b4c6c0a/);
	assert.match(es.status, /rebasing branch 'feature\/carrito' on '7ac78ac'/);
	assert.match(es.continue, /\[detached HEAD 1dfd393\] feat\(envio\): agrega envío gratis desde 10000/);
	assert.match(en.continue, /\[detached HEAD 5d1dad6\] feat\(shipping\): add free shipping from 10000/);
	assert.match(es.push, /\(non-fast-forward\)/);
	assert.match(es.stale, /\(stale info\)/);
	assert.match(es.lease, /\+ 780488a\.\.\.1dfd393 feature\/carrito -> feature\/carrito \(forced update\)/);
	assert.match(en.lease, /\+ b4c6c0a\.\.\.5d1dad6 feature\/cart -> feature\/cart \(forced update\)/);
	for (const lang of ['es', 'en']) {
		for (const lines of Object.values(session.outputs)) {
			for (const line of lines) assert.ok(line.text[lang].length <= 72, `output line fits the console: ${line.text[lang]}`);
		}
	}
	assert.doesNotMatch(JSON.stringify(session), /checkout/);
});

test('every command runs on its own module and line, in order', () => {
	const cues = cuesOf(...script.steps.map((step) => step.id));
	const lines = cues.filter((cue) => cue.do === 'move' && cue.el === 'hl').map((cue) => Number(cue.to.replace('ln-', '')));
	const modules = cues.filter((cue) => cue.do === 'move' && cue.el === 'p').map((cue) => Number(cue.to.replace('a-m', '')));
	assert.deepEqual(lines, [1, 2, 3, 4, 5, 6, 7, 8]);
	assert.deepEqual(modules, lines, 'the particle visits the module of the line being run');
	assert.deepEqual(
		idsOf(cues, 'type').filter((id) => id.startsWith('cmd-')),
		['cmd-1', 'cmd-2', 'cmd-3', 'cmd-4', 'cmd-5', 'cmd-6', 'cmd-7', 'cmd-8'],
	);
});

test('the commits are replayed one by one as new commits, and the replay stops on the conflict', () => {
	const diverge = cuesOf('diverge');
	assert.deepEqual(stopsOf(diverge, 'pk-fetch'), ['a-lc'], 'fetch brings the new commit down');
	assert.deepEqual(stopsOf(diverge, 'tg-om'), ['t1-lc'], 'only origin/main moves');
	assert.deepEqual(stopsOf(diverge, 'tg-feat'), [], 'your branch stays put');

	const replay = cuesOf('replay');
	assert.deepEqual(stopsOf(replay, 'pk-d'), ['a-ld2'], 'the first change lands on the new base');
	assert.ok(firstAt(replay, 'enter', 'n-ld2') > firstAt(replay, 'move', 'pk-d'), 'it becomes a new commit');
	assert.ok(idsOf(replay, 'enter').includes('old-ld') && idsOf(replay, 'enter').includes('old-le'), 'the originals are set aside');
	assert.deepEqual(stopsOf(replay, 'tg-head'), ['h-lc', 'h-ld2'], 'HEAD walks the new base');

	const conflict = cuesOf('conflict');
	assert.deepEqual(stopsOf(conflict, 'pk-e'), ['a-le2']);
	for (const id of ['cf-slot', 'bad-3', 'f-cfg', 'f-ours', 'f-theirs', 'lb-conflict']) assert.ok(idsOf(conflict, 'enter').includes(id), `conflict shows ${id}`);
	assert.ok(!idsOf(conflict, 'enter').includes('n-le2'), 'the second commit is not created while stopped');

	const resolve = cuesOf('resolve');
	assert.ok(firstAt(resolve, 'type', 'cmd-5') < firstAt(resolve, 'type', 'cmd-6'), 'git add before --continue');
	assert.ok(firstAt(resolve, 'enter', 'n-le2') > firstAt(resolve, 'type', 'cmd-6'), '--continue creates the second commit');
	assert.deepEqual(stopsOf(resolve, 'tg-feat'), ['t1-le2'], 'the branch moves to the replayed commits');
	assert.ok(!idsOf(resolve, 'exit').includes('n-ld') && !idsOf(resolve, 'exit').includes('n-le'), 'the old commits are not deleted');
});

test('a plain push is rejected; --force-with-lease checks the remote before replacing it', () => {
	const rejected = cuesOf('rejected');
	assert.deepEqual(stopsOf(rejected, 'pk-push'), ['a-push']);
	assert.ok(idsOf(rejected, 'enter').includes('lb-rejected'));
	assert.ok(!idsOf(rejected, 'enter').includes('n-re2'), 'nothing reaches GitHub');

	const stale = cuesOf('stale');
	assert.ok(idsOf(stale, 'enter').includes('n-rx'), "a teammate's commit on the remote branch");
	assert.ok(idsOf(stale, 'enter').includes('lb-force'), '--force would delete it');
	assert.deepEqual(stopsOf(stale, 'pk-lease'), ['a-lease-rx'], 'the lease is compared with the remote tip');
	assert.ok(idsOf(stale, 'enter').includes('lb-stale'), 'the lease refuses');
	assert.ok(!idsOf(stale, 'enter').includes('n-re2'), 'nothing is replaced');

	const lease = cuesOf('lease');
	assert.ok(idsOf(lease, 'exit').includes('n-rx'), 'back to the real example');
	assert.deepEqual(stopsOf(lease, 'pk-lease').at(-1), 'a-lease-re');
	const matched = firstAt(lease, 'enter', 'lb-match');
	assert.ok(matched > 0 && firstAt(lease, 'exit', 'n-re') > matched, 'the remote is replaced only after the check');
	assert.ok(idsOf(lease, 'enter').includes('n-re2') && idsOf(lease, 'enter').includes('lb-forced'));
	assert.deepEqual(stopsOf(lease, 'tg-rfeat').at(-1), 't1-re2');
	assert.deepEqual(stopsOf(lease, 'tg-ofeat'), ['t3-le2']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const generated = new Set([
		...session.commands.map((_, index) => `cmd-${index + 1}`),
		...session.commands.map((_, index) => `ln-${index + 1}`),
		...session.commands.map((_, index) => `m-${index + 1}`),
		...session.commands.map((_, index) => `a-m${index + 1}`),
		...Object.entries(session.outputs).flatMap(([id, lines]) => [`out-${id}`, ...lines.map((_, index) => `out-${id}-${index + 1}`)]),
	]);
	assert.match(component, /data-el=\{`cmd-\$\{line\.n\}`\}/);
	assert.match(component, /data-el=\{`out-\$\{output\.id\}`\}/);
	assert.match(component, /id: `out-\$\{id\}-\$\{index \+ 1\}`/);
	assert.match(component, /id: `m-\$\{line\.n\}`/);
	assert.match(component, /id: `a-m\$\{module\.n\}`/);
	assert.match(component, /id: `ln-\$\{line\.n\}`/);

	const known = (id) =>
		generated.has(id) ||
		component.includes(`data-el="${id}"`) ||
		component.includes(`data-anchor="${id}"`) ||
		component.includes(`id: '${id}'`);

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script, session } from '\.\.\/\.\.\/data\/animations\/rebase-git'/);
	assert.match(component, /highlightCode\(session\.commands\.join\('\\n'\), 'bash'\)/, 'the editor shows the session in bash');
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
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
	assert.equal((component.match(/data-slug='rebase-git'/g) ?? []).length, 4);

	// Hashes follow each locale of the lesson.
	for (const hash of ['10b4cc8', '7ac78ac', 'a39a0ac', '780488a', 'c6d3f43', '1dfd393', '1264b56', 'd5e72ab', 'a45c681', 'b4c6c0a', '2c8e0f3', '5d1dad6']) {
		assert.ok(component.includes(`'${hash}'`), `the canvas labels commit ${hash}`);
	}
});
