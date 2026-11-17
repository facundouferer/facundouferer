import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/algoritmia-complejidad-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'algoritmia-complejidad-java';
const LESSON = '23-algoritmia-verificacion-y-complejidad';
const FILE = '23-algoritmia-verificacion-y-complejidad';
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
	assert.ok(existsSync(`src/content/courses/java/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['contract', 'linear', 'binary', 'halve', 'found', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['contract', 'sentinel', 'linear', 'invariant', 'midpoint', 'halve', 'found', 'recap'],
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
		// 1. Specification & contract
		'precondición',
		'postcondición',
		'valor centinela',
		// 2. Linear search O(n)
		'búsqueda lineal',
		'o(n)',
		'peor caso',
		// 3. Binary search & loop invariant
		'búsqueda binaria',
		'invariante de bucle',
		'izquierda',
		'derecha',
		'medio',
		// 4. Halving the search space
		'mitad',
		'descarta',
		// 5. Reaching the target in O(log n)
		'o(log n)',
		'índice',
		// 6. Recap: correctness vs efficiency
		'contrato',
		'corrección',
		'complejidad',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé)\b/i);
});

test('linear search traverses elements sequentially while binary search halves the space', () => {
	// Linear search visits array slots one by one (magenta cost trail).
	const linear = cuesOf('linear');
	assert.deepEqual(stopsOf(linear, 'p'), ['a-s0', 'a-s1', 'a-s2', 'a-s3', 'a-s4', 'a-s5']);
	// Binary search inspects middle (slot 3), discards left half (slots 0..3), then lands on slot 5.
	const midpoint = cuesOf('midpoint');
	assert.ok(stopsOf(midpoint, 'p').includes('a-s3'), 'midpoint inspects middle slot 3');
	const halve = cuesOf('halve');
	assert.ok(halve.some((cue) => cue.do === 'enter' && cue.el === 'veil-left'), 'halve dims discarded left half');
	const found = cuesOf('found');
	assert.ok(stopsOf(found, 'p').includes('a-s5'), 'found lands on target slot 5');
	assert.ok(found.some((cue) => cue.do === 'type' && cue.el === 'out-2'), 'found prints binary search result');
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

test('the code in the canvas is the program the narration describes and respects lesson 6 sequencing', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		'`    static int ${names.linearSearch}(int[] ${names.sorted}, int ${names.target}) {`',
		'`    static int ${names.binarySearch}(int[] ${names.sorted}, int ${names.target}) {`',
		'`            int ${names.middle} = ${names.left} + (${names.right} - ${names.left}) / 2;`',
		"t('busquedaLineal', 'linearSearch')",
		"t('busquedaBinaria', 'binarySearch')",
		"t('ordenados', 'sorted')",
		"t('objetivo', 'target')",
		"t('izquierda', 'left')",
		"t('derecha', 'right')",
		"t('medio', 'middle')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// Curriculum sequencing: lesson 6 is before OOP and exceptions.
	assert.doesNotMatch(component, /\b(throw|try|catch|extends|implements|@Override)\b/);
	const lines = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.ok(lines('sourceA').length <= 20, 'sourceA has at most 20 lines');
	assert.ok(lines('sourceB').length <= 20, 'sourceB has at most 20 lines');
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/algoritmia-complejidad-java'/);
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
	assert.equal((component.match(/data-slug='algoritmia-complejidad-java'/g) ?? []).length, 4);
});
