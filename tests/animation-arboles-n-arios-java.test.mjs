import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/arboles-n-arios-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'arboles-n-arios-java';
const LESSON = '26-arboles-n-arios-y-representacion-con-vectores';
const FILE = '26-arboles-n-arios-y-representacion-con-vectores';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const typed = (cues) => cues.filter((cue) => cue.do === 'type').map((cue) => cue.el);

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
		['nary', 'lcrs', 'siblings', 'vectors', 'climb', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['problem', 'lcrs', 'first', 'siblings', 'vectors', 'validate', 'climb', 'recap'],
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
		// 1. Why does a binary node not fit an N-ary tree?
		'árbol n-ario',
		'dos hijos',
		'cero o más hijos',
		'sin lugar',
		// 2. How do two references hold any number of children?
		'dos referencias',
		'primerHijo',
		'siguienteHermano',
		'no es un árbol binario de búsqueda',
		// 3. How are all the children of a node visited?
		'una sola vez',
		'cadena de hermanos hasta `null`',
		// 4. How is the tree stored in vectors?
		'padres[i]',
		'etiquetas[i]',
		'índice',
		'`-1`',
		// 5. Why are the indices validated?
		'validarEnlace',
		'IndexOutOfBoundsException',
		'se rechaza',
		// 6. How does a node climb to the root, and what does it cost?
		'padres[actual]',
		'O(1)',
		'profundidad',
		'ciclo',
		// Recap: why choose the vector representation.
		'localidad',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|modelá|transformalas|almacenalas)\b/i);
});

test('the LCRS walk jumps once to primerHijo and follows siguienteHermano to null', () => {
	const walk = cuesOf('first', 'siblings');
	assert.deepEqual(stopsOf(walk, 'p'), ['a-root', 'a-b', 'a-c', 'a-d', 'a-null']);
	assert.deepEqual(stopsOf(walk, 'hl'), ['ln-14', 'ln-15', 'ln-16', 'ln-17', 'ln-16', 'ln-17', 'ln-16', 'ln-17', 'ln-15']);
	assert.deepEqual(typed(walk), ['out-1', 'out-2', 'out-3']);
	// The links are built line by line before the walk: first children, then siblings.
	const links = cuesOf('lcrs').filter((cue) => cue.do === 'draw').map((cue) => cue.el);
	assert.deepEqual(links, ['k-ab', 'k-be', 'k-bc', 'k-cd']);
});

test('a bad index is rejected and the climb follows padres[actual] up to -1', () => {
	const val = cuesOf('validate');
	for (const id of ['eb-11x', 'pv-bad', 'px-4', 'rt-bad', 'hx-6', 'lb-bad', 'out-x']) {
		const shown = val.findIndex((cue) => (cue.do === 'enter' || cue.do === 'type' || cue.do === 'draw') && cue.el === id);
		const cleared = val.findIndex((cue) => cue.do === 'exit' && cue.el === id);
		assert.ok(shown >= 0 && cleared > shown, `validate shows and then clears ${id}`);
	}
	for (const id of ['eb-11', 'pv-4', 'pok-4']) {
		const cleared = val.findIndex((cue) => cue.do === 'exit' && cue.el === id);
		const back = val.findIndex((cue, index) => index > cleared && cue.do === 'enter' && cue.el === id);
		assert.ok(cleared >= 0 && back > cleared, `validate restores ${id} with enter`);
	}

	const climb = cuesOf('climb');
	assert.deepEqual(stopsOf(climb, 'p'), ['a-e', 'a-b', 'a-root']);
	assert.deepEqual(stopsOf(climb, 'hl'), ['ln-13', 'ln-14', 'ln-15', 'ln-16', 'ln-14', 'ln-15', 'ln-16', 'ln-14', 'ln-18']);
	assert.ok(typed(climb).includes('out-b'));
	const depths = climb.filter((cue) => cue.do === 'enter' && cue.el.startsWith('dep-')).map((cue) => cue.el);
	assert.deepEqual(depths, ['dep-0', 'dep-1', 'dep-2']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
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
		'`class ${names.node} {`',
		'`    ${names.node} ${names.firstChild};`',
		'`    ${names.node} ${names.nextSibling};`',
		'`        a.${names.firstChild} = b;  b.${names.firstChild} = e;`',
		'`        b.${names.nextSibling} = c;`',
		'`        c.${names.nextSibling} = d;`',
		'`        ${names.node} ${names.child} = a.${names.firstChild};`',
		'`        while (${names.child} != null) {`',
		'`            ${names.child} = ${names.child}.${names.nextSibling};`',
		'`    static final int ${names.none} = -1;`',
		'`            throw new IndexOutOfBoundsException("${strings.index}" + i);`',
		'`        String[] ${names.labels} = {"A", "B", "C", "D", "E"};`',
		'`        int[] ${names.parents} = {-1, 0, 0, 0, 1};`',
		'`        int[] ${names.parents} = {-1, 0, 0, 0, 7};`',
		'`        while (${names.parents}[${names.curr}] != ${names.none}) {`',
		'`            ${names.curr} = ${names.parents}[${names.curr}];`',
		"t('primerHijo', 'firstChild')",
		"t('siguienteHermano', 'nextSibling')",
		"t('SIN_INDICE', 'NO_INDEX')",
		"t('validarEnlace', 'validateLink')",
		"t('padres', 'parents')",
		"t('etiquetas', 'labels')",
		"t('profundidad', 'depth')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	const lines = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.equal(lines('sourceA').length, 20, 'the first program fits the 20-line editor');
	assert.equal(lines('sourceB').length, 20, 'the second program fits the 20-line editor');
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/arboles-n-arios-java'/);
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
	assert.equal((component.match(/data-slug='arboles-n-arios-java'/g) ?? []).length, 4);
});
