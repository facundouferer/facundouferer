import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/tad-listas-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'tad-listas-java';
const LESSON = '11-tad-listas-estaticas-y-dinamicas';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '13-tad-listas-estaticas-y-dinamicas';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);

test(`catalog binds ${SLUG} to java/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: LESSON });
	assert.deepEqual(
		getAnimationsForLesson('java', LESSON).map((entry) => entry.slug),
		[SLUG],
	);
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/java/${FILE}.es.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['static', 'nodes', 'insert', 'traverse', 'remove', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['array', 'shift', 'nodes', 'order', 'insert', 'traverse', 'remove', 'recap'],
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

test('every step has a bilingual title and one to three short captions', () => {
	for (const step of script.steps) {
		assert.ok(step.subtitles.length >= 1 && step.subtitles.length <= 3, `${step.id} narrates in one to three captions`);
		for (const lang of ['es', 'en']) {
			assert.ok(step.title[lang]?.length > 0, `${step.id} title.${lang}`);
			for (const sub of step.subtitles) {
				const length = sub.text[lang]?.length ?? 0;
				assert.ok(length >= 15 && length <= 120, `${step.id} caption.${lang} must be short (${length}): ${sub.text[lang]}`);
			}
		}
	}
});

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = resolveScript(script, 'es')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n');
	for (const concept of [
		// 1. Static list: contiguous memory, O(1) index access, O(n) shift on front insert.
		'memoria contigua',
		'O(1)',
		'desplazar',
		'O(n)',
		// 2. Dynamic linked list: Nodo with dato and siguiente, scattered in the Heap.
		'Nodo',
		'dato',
		'siguiente',
		'cabeza',
		'Heap',
		// 3. Inserting at head: order matters, nuevo.siguiente = cabeza then cabeza = nuevo.
		'nuevo.siguiente = cabeza',
		'cabeza = nuevo',
		'recolector',
		// 4. Traversing with actual following actual = actual.siguiente until null.
		'actual',
		'actual = actual.siguiente',
		'null',
		// 5. Removing in the middle by rewiring anterior.siguiente.
		'anterior',
		'anterior.siguiente = anterior.siguiente.siguiente',
		// 6. Recap: contiguous shifting vs pointer rewiring.
		'lectura',
		'inserción',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé)\b/i);
});

test('head insertion checks wrong order first and then rewires in O(1) without moving existing nodes', () => {
	const orderCues = cuesOf('order');
	// Wrong order warning shown in magenta before the clean rewiring in `insert`.
	assert.ok(orderCues.some((cue) => cue.do === 'enter' && cue.el === 'lost-warn'), 'shows the lost-list warning');
	assert.ok(orderCues.some((cue) => cue.do === 'draw' && cue.el === 'rt-lost'), 'draws the broken head link');

	const insertCues = cuesOf('insert');
	const cleared = insertCues.filter((cue) => cue.do === 'exit').map((cue) => cue.el);
	for (const id of ['rt-lost', 'lost-warn', 'hx-lost']) assert.ok(cleared.includes(id), `insert clears ${id}`);
	const at = (kind, el) => insertCues.find((cue) => cue.do === kind && cue.el === el)?.at;
	assert.ok(at('draw', 'rt-new-n1') < at('draw', 'rt-head-new'), 'nuevo.siguiente = cabeza happens before cabeza = nuevo');
});

test('traversal walks actual from node to node until null and removal rewires around the middle node', () => {
	const travCues = cuesOf('traverse');
	assert.deepEqual(stopsOf(travCues, 'p'), ['a-n0', 'a-n1', 'a-n2', 'a-null']);
	assert.deepEqual(travCues.filter((cue) => cue.do === 'type').map((cue) => cue.el), ['out-1']);

	const remCues = cuesOf('remove');
	assert.ok(remCues.some((cue) => cue.do === 'draw' && cue.el === 'rt-skip'), 'draws the bypass link over the middle node');
	assert.ok(remCues.some((cue) => cue.do === 'enter' && cue.el === 'n1-off'), 'dims the unhooked middle node');
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		if (component.includes(`tagChip('${id}'`)) return true;
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

test('the code in the canvas is the program the narration describes', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		'`class ${names.staticList} {`',
		'`class ${names.node} {`',
		'`class ${names.linkedList} {`',
		'`        ${names.fresh}.${names.next} = ${names.head};`',
		'`        ${names.head} = ${names.fresh};`',
		'`        while (${names.current} != null) {`',
		'`            ${names.current} = ${names.current}.${names.next};`',
		'`        ${names.prev}.${names.next} = ${names.prev}.${names.next}.${names.next};`',
		"t('Nodo', 'Node')",
		"t('dato', 'data')",
		"t('siguiente', 'next')",
		"t('cabeza', 'head')",
		"t('nuevo', 'fresh')",
		"t('actual', 'current')",
		"t('anterior', 'previous')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	const lines = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.equal(lines('sourceA').length, 20);
	assert.equal(lines('sourceB').length, 20);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/tad-listas-java'/);
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
	assert.equal((component.match(/data-slug='tad-listas-java'/g) ?? []).length, 4);
});
