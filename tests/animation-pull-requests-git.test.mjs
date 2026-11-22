import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script, outputRows } from '../src/data/animations/pull-requests-git.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'pull-requests-git';
const LESSON = 'ramas-y-pull-requests';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '05-ramas-y-pull-requests';
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

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['branch', 'pull-request', 'review', 'update', 'merge', 'cleanup'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['branch', 'push', 'open-pr', 'review', 'fetch', 'resolve', 'merge', 'cleanup'],
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
	// The camera ends pulling back to reveal the whole system.
	const lastShot = cuesOf('cleanup').filter((cue) => cue.do === 'camera').at(-1);
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
		// 1. Why does a task get its own branch, and what does `git switch -c` do?
		'no se sube directo a `main`',
		'su propia rama',
		'git switch -c agrega-contacto',
		'`head`',
		'`main` no se mueve',
		// 2. What does `git push -u` do with the branch?
		'git push -u origin agrega-contacto',
		'copia el commit',
		'origin/agrega-contacto',
		// 3. What is a Pull Request?
		'pull request',
		'integrar tu rama',
		'base `main`',
		'compare `agrega-contacto`',
		'gh pr create',
		'revisa',
		// 4. How does the author answer the review?
		'misma rama',
		'el pr sigue a la rama',
		// 5. How does the branch catch up when main moved?
		'`main` avanzó',
		'git fetch',
		'mueve `origin/main`',
		'sin tocar tus archivos',
		'git merge origin/main',
		'conflicto',
		'marcadores',
		'git commit --no-edit',
		'dos padres',
		'resueltos en tu rama',
		// 6. What happens at the merge and after it?
		'aprueba',
		'merge',
		'git switch main',
		'git pull',
		'git branch -d',
		'git push origin --delete',
		'git fetch --prune',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|abrí|subí)\b/i);
	// Rebase belongs to the next lesson: the film does not use it.
	assert.doesNotMatch(all, /rebase|force-with-lease|checkout/i);
});

test('the English narration covers the same questions with the localized names', () => {
	const all = narration('en');
	for (const concept of [
		'its own branch',
		'git switch -c add-contact',
		'git push -u origin add-contact',
		'origin/add-contact',
		'pull request',
		'compare `add-contact`',
		'the pr follows the branch',
		'git fetch',
		'git merge origin/main',
		'conflict',
		'two parents',
		'fast-forward',
		'git branch -d',
		'git push origin --delete',
		'git fetch --prune',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /rebase|force-with-lease|checkout/i);
});

test('commits travel between the floors: push lifts them, fetch and pull drop them', () => {
	// The branch is born on the same commit, then moves with each commit while main stays.
	const branch = cuesOf('branch');
	assert.deepEqual(stopsOf(branch, 'head'), ['h-feat-0', 'h-feat-b4e']);
	assert.deepEqual(stopsOf(branch, 't-a-feat'), ['ta-feat-b4e']);
	assert.deepEqual(stopsOf(branch, 't-a-main'), [], 'main does not move');

	// push -u: the commit rises to GitHub, where the branch appears.
	const push = cuesOf('push');
	assert.deepEqual(stopsOf(push, 'g-b4e'), ['n-g-b4e']);
	assert.ok(idsOf(push, 'enter').includes('t-g-feat'));
	assert.ok(idsOf(push, 'enter').includes('lb-track'));

	// The PR: a request from the branch into main, on GitHub.
	const openPr = cuesOf('open-pr');
	assert.ok(idsOf(openPr, 'enter').includes('pr'));
	assert.ok(idsOf(openPr, 'draw').includes('pr-link'));

	// Review: a new commit on the same branch updates the same PR.
	const review = cuesOf('review');
	assert.deepEqual(stopsOf(review, 'g-330'), ['n-g-330']);
	assert.deepEqual(stopsOf(review, 't-g-feat'), ['tg-feat-330']);
	assert.ok(!idsOf(review, 'enter').includes('pr'), 'no new PR is opened');

	// main moved: fetch drops Beto's commits and moves only origin/main.
	const fetch = cuesOf('fetch');
	assert.deepEqual(stopsOf(fetch, 'a-4ad'), ['n-a-4ad']);
	assert.deepEqual(stopsOf(fetch, 'a-258'), ['n-a-258']);
	assert.deepEqual(stopsOf(fetch, 't-a-om'), ['ta-om-258']);
	assert.deepEqual(stopsOf(fetch, 't-a-main'), [], 'fetch does not move main');
	assert.deepEqual(stopsOf(fetch, 't-a-feat'), [], 'fetch does not move the branch');
	for (const id of ['st-conflict', 'f-conflict', 'clash', 'on-10']) assert.ok(idsOf(fetch, 'enter').concat(idsOf(fetch, 'draw')).includes(id), `fetch shows ${id}`);

	// The resolution: a merge commit with two parents on the branch, then pushed.
	const resolve = cuesOf('resolve');
	for (const id of ['ae-330-cb2', 'ae-258-cb2']) assert.ok(idsOf(resolve, 'draw').includes(id), `cb26567 links to ${id}`);
	assert.deepEqual(stopsOf(resolve, 'g-cb2'), ['n-g-cb2']);
	assert.ok(firstAt(resolve, 'enter', 'st-ok') > firstAt(resolve, 'exit', 'st-conflict'), 'the PR loses its conflict');

	// The merge happens on GitHub; pull brings it down and fast-forwards main.
	const merge = cuesOf('merge');
	assert.ok(firstAt(merge, 'enter', 'g-29d') < firstAt(merge, 'enter', 'a-29d'), 'GitHub merges first');
	assert.deepEqual(stopsOf(merge, 'a-29d'), ['n-a-29d']);
	assert.deepEqual(stopsOf(merge, 't-a-main'), ['ta-main-29d']);
	assert.deepEqual(stopsOf(merge, 'head'), ['h-main-0', 'h-main-29d']);

	// Cleanup: the branch disappears locally, on GitHub and from Beto's clone.
	const cleanup = cuesOf('cleanup');
	for (const id of ['t-a-feat', 't-g-feat', 't-b-feat']) assert.ok(idsOf(cleanup, 'exit').includes(id), `cleanup removes ${id}`);
});

test('every command runs on its own module and types its real output', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	const run = stopsOf(all, 'hl').map((to) => Number(to.replace('ln-', '')));
	assert.deepEqual(run, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20], 'the bar walks the session in order');
	const modules = stopsOf(all, 'p').filter((to) => to.startsWith('a-m')).map((to) => Number(to.replace('a-m', '')));
	assert.deepEqual(modules, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 20], 'every command has a module');
	for (const [line, rows] of Object.entries(outputRows)) {
		const typed = idsOf(all, 'type').filter((id) => id.startsWith(`o-${line}-`));
		assert.equal(typed.length, rows, `output of line ${line} is typed row by row`);
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		// Generated ids: `<prefix>${...}` templates in the component.
		const output = id.match(/^o-(\d+)-(\d+)$/);
		if (output) return Number(output[2]) <= (outputRows[output[1]] ?? 0) && component.includes('`o-${line}-${index + 1}`');
		const coin = id.match(/^([ga])-(\w+)$/);
		if (coin && component.includes(`key: '${coin[2]}'`) && component.includes('`${floor}-${commit.key}`')) return true;
		const link = id.match(/^([ga])e-(\w+)-(\w+)$/);
		if (link && component.includes(`['${link[2]}', '${link[3]}']`)) return true;
		const node = id.match(/^n-([ga])-(\w+)$/);
		if (node && component.includes(`key: '${node[2]}'`)) return true;
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

test('the terminal session is the lesson workflow, with its names and outputs', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const session = component.split('const session = [')[1].split('].join')[0].trim().split('\n');
	assert.equal(session.length, 20, 'the editor holds 20 lines');
	for (const [index, fragment] of [
		[0, 'git switch -c ${names.branch}'],
		[3, 'git push -u origin ${names.branch}'],
		[4, 'gh pr create --base main'],
		[8, 'git fetch'],
		[9, 'git merge origin/main'],
		[11, 'git commit --no-edit'],
		[14, 'git switch main'],
		[15, 'git pull'],
		[16, 'git branch -d ${names.branch}'],
		[17, 'git push origin --delete ${names.branch}'],
		[19, 'git fetch --prune'],
	]) {
		assert.ok(session[index].includes(fragment), `line ${index + 1} runs ${fragment}`);
	}
	for (const fragment of [
		"t('agrega-contacto', 'add-contact')",
		"t('contacto.html', 'contact.html')",
		"t('Agrega página de contacto', 'Add contact page')",
		"t('Enlaza la página de contacto desde el menú', 'Link the contact page from the menu')",
		"t('github.com:equipo/sitio', 'github.com:team/website')",
		"hash: 'b4efc3f'",
		"hash: '330bf8b'",
		"hash: '2588f0d'",
		"hash: 'cb26567'",
		"hash: '29d937d'",
		'CONFLICT (content): Merge conflict in menu.html',
		'Merge remote-tracking branch',
		'2588f0d..29d937d',
		'Fast-forward',
		'(was cb26567)',
		'- [deleted]',
		'<<<<<<< HEAD',
		'>>>>>>> origin/main',
	]) {
		assert.ok(component.includes(fragment), `missing fragment: ${fragment}`);
	}
	assert.doesNotMatch(component, /git (checkout|rebase)/, 'no checkout or rebase in the film');
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script, outputRows } from '\.\.\/\.\.\/data\/animations\/pull-requests-git'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /highlightCode\(source, 'bash'\)/, 'the editor highlights a bash session');
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.equal((component.match(/data-slug='pull-requests-git'/g) ?? []).length, 4);
	assert.match(component, /font-family: var\(--font-body\)/);
	assert.doesNotMatch(component, /font-family: (?!var\(--font-body\)|monospace)/, 'fonts stay Organic or generic monospace');
});
