import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/arboles-binarios-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'arboles-binarios-java';
const LESSON = '15-tad-arboles-binarios-y-busqueda';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '17-tad-arboles-binarios-y-busqueda';
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
		['invariant', 'root-cut', 'found-balance', 'insert', 'traversal', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['nodes', 'rule', 'root', 'found', 'degenerate', 'insert', 'inorder', 'recap'],
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
		// 1. What does each node store, and what is the BST property?
		'`NodoArbol`',
		'`valor`',
		'`izquierdo`',
		'`derecho`',
		'propiedad del ABB',
		'menores a la izquierda',
		'mayores a la derecha',
		// 2. How does the first comparison discard half the tree?
		'`buscar(35)`',
		'`35 < 50`',
		'descarta todo el subárbol derecho',
		// 3. Why is search O(log n), and when does it fall to O(n)?
		'`35 > 30`',
		'O(log n)',
		'proporcional a la altura',
		'degenera en una cadena',
		'O(n)',
		// 4. Where does insertion hang the new node?
		'`insertar(25)`',
		'`null`',
		'`new NodoArbol(25)`',
		'`nodo.derecho`',
		'nueva hoja',
		// 5. Why does inOrden visit the values in ascending order?
		'`preOrden`',
		'`inOrden`',
		'`postOrden`',
		'izquierdo, raíz y derecho',
		'orden ascendente',
		// 6. Recap: what does the shape of the tree buy?
		'mitad del árbol',
		'valores ordenados',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé)\b/i);
});

test('search(35) visits only 50 -> 30 -> 35 and discards the right subtree at once', () => {
	assert.deepEqual(stopsOf(cuesOf('root', 'found'), 'p'), ['a-call-search', 'a-n50', 'a-n30', 'a-n35']);
	const rootCues = cuesOf('root');
	assert.ok(rootCues.some((cue) => cue.do === 'enter' && cue.el === 'veil-right'), 'right subtree is veiled when going left from 50');
	const foundCues = cuesOf('found');
	assert.ok(foundCues.some((cue) => cue.do === 'enter' && cue.el === 'veil-n20'), 'left child 20 is veiled when going right from 30');
	assert.ok(foundCues.some((cue) => cue.do === 'enter' && cue.el === 'n35-found'), 'target 35 lights up in violet when found');
});

test('insert(25) descends 50 -> 30 -> 20 -> right null link and attaches leaf 25', () => {
	const ins = cuesOf('insert');
	assert.deepEqual(stopsOf(ins, 'p'), ['a-call-ins', 'a-n50', 'a-n30', 'a-n20', 'a-n25']);
	const at = (kind, el) => ins.find((cue) => cue.do === kind && cue.el === el)?.at;
	assert.ok(at('enter', 'slot-null') < at('enter', 'n25'), 'null link is highlighted before leaf 25 attaches');
});

test('inOrden visits 20 25 30 35 50 60 70 80 and prints them in ascending order', async () => {
	const stops = stopsOf(cuesOf('inorder'), 'p');
	assert.deepEqual(stops, ['a-n20', 'a-n25', 'a-n30', 'a-n35', 'a-n50', 'a-n60', 'a-n70', 'a-n80']);
	const keys = stops.map((stop) => Number(stop.slice(3)));
	assert.deepEqual(keys, [...keys].sort((a, b) => a - b), 'the visits come out sorted');
	const component = await readFile(COMPONENT, 'utf8');
	assert.ok(component.includes("text: '20 25 30 35 50 60 70 80'"), 'the console prints the sorted values');
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
		'`class ${names.node} {`',
		'`    int ${names.value};`',
		'`    ${names.node} ${names.left}, ${names.right};`',
		'`    boolean ${names.search}(${names.node} ${names.nodeVar}, int ${names.value}) {`',
		'`        if (${names.nodeVar} == null) return false;`',
		'`        if (${names.value} == ${names.nodeVar}.${names.value}) return true;`',
		'`        return ${names.value} < ${names.nodeVar}.${names.value}`',
		'`    ${names.node} ${names.insert}(${names.node} ${names.nodeVar}, int ${names.value}) {`',
		'`        if (${names.nodeVar} == null) return new ${names.node}(${names.value});`',
		'`            ${names.nodeVar}.${names.right} = ${names.insert}(${names.nodeVar}.${names.right}, ${names.value});`',
		'`    void ${names.inorder}(${names.node} ${names.nodeVar}) {`',
		'`        ${names.inorder}(${names.nodeVar}.${names.left});`',
		"t('NodoArbol', 'TreeNode')",
		"t('valor', 'value')",
		"t('izquierdo', 'left')",
		"t('derecho', 'right')",
		"t('buscar', 'search')",
		"t('insertar', 'insert')",
		"t('inOrden', 'inOrder')",
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
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/arboles-binarios-java'/);
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
	assert.equal((component.match(/data-slug='arboles-binarios-java'/g) ?? []).length, 4);
});
