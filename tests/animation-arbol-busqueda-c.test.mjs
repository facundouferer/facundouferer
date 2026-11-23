import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/arbol-busqueda-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'arbol-busqueda-c';
const LESSON = 'arboles-binarios';
const FILE = '33-arboles-binarios';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const step = (id) => script.steps.find((entry) => entry.id === id);
const cues = (id, kind) => step(id).motion.cues.filter((cue) => cue.do === kind);
const entered = (id, prefix) => cues(id, 'enter').filter((cue) => cue.el.startsWith(prefix)).map((cue) => Number(cue.el.slice(prefix.length)));

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.ok(getAnimationsForLesson('c', LESSON).map((entry) => entry.slug).includes(SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['node', 'insert', 'search', 'traverse', 'free', 'shape'],
	);
	assert.deepEqual(
		script.steps.map((entry) => entry.id),
		['nodes', 'descend', 'place', 'search', 'inorder', 'others', 'free', 'degenerate'],
	);
	for (const entry of script.steps) {
		assert.equal(entry.scene, 'journey', `${entry.id} plays on the single canvas`);
		assert.ok(entry.motion, `${entry.id} is a motion step`);
		assert.ok(entry.subtitles.every((sub) => typeof sub.at === 'number'), `${entry.id} pins captions`);
		assert.ok(entry.motion.cues.length >= 10, `${entry.id} choreographs the canvas`);
		const starts = entry.motion.cues.map((cue) => cue.at);
		assert.deepEqual(starts, [...starts].sort((a, b) => a - b), `${entry.id} lists its cues in order`);
	}
	const kinds = new Set(script.steps.flatMap((entry) => entry.motion.cues.map((cue) => cue.do)));
	for (const kind of ['enter', 'exit', 'draw', 'type', 'move', 'pulse', 'flow', 'camera']) assert.ok(kinds.has(kind), `uses the ${kind} cue`);
});

test('the film lasts between 90 and 120 seconds in both languages', () => {
	for (const lang of ['es', 'en']) {
		const steps = resolveScript(script, lang).steps;
		const total = steps.reduce((sum, entry) => sum + entry.duration, 0);
		console.log(`${SLUG} ${lang}: ${(total / 1000).toFixed(1)} s`);
		assert.ok(total >= 90_000 && total <= 120_000, `${lang} runs for ${Math.round(total / 1000)} s`);
		for (const entry of steps) {
			assert.ok(entry.duration > Math.max(...entry.motion.cues.map(cueEnd)), `${entry.id} (${lang}) outlasts its cues`);
		}
	}
});

test('every step has a bilingual title and one to three short captions', () => {
	for (const entry of script.steps) {
		assert.ok(entry.subtitles.length >= 1 && entry.subtitles.length <= 3, `${entry.id} narrates in one to three captions`);
		for (const lang of ['es', 'en']) {
			assert.ok(entry.title[lang]?.length > 0, `${entry.id} title.${lang}`);
			for (const sub of entry.subtitles) {
				const length = sub.text[lang]?.length ?? 0;
				assert.ok(length >= 15 && length <= 120, `${entry.id} caption.${lang} must be short (${length}): ${sub.text[lang]}`);
			}
		}
	}
});

test('narration answers the six questions of the brief in neutral Spanish', () => {
	const all = resolveScript(script, 'es')
		.steps.map((entry) => `${entry.title} ${entry.text}`)
		.join('\n')
		.toLowerCase();
	for (const concept of [
		'puntero',
		'`null`',
		// how insert chooses left or right
		'menor que 50',
		'mayor que 50',
		'`izquierdo`',
		'`derecho`',
		'recursiva',
		// where a new node attaches
		'se cuelga el nodo nuevo',
		// how search works
		'misma regla',
		'solo lee',
		'devuelve el nodo',
		'el valor no está',
		// what each traversal gives
		'inorden',
		'preorden',
		'postorden',
		'ordenados',
		'20 30 40 50 60 70 80',
		'50 30 20 40 70 60 80',
		'20 40 30 60 80 70 50',
		// why free goes in postorder
		'después de sus hijos',
		'inalcanzables',
		'fuga',
		// why a sorted insertion order degenerates
		'en orden',
		'todo va a la derecha',
		'degenera en lista',
		'o(n)',
		'balanceado',
		'o(log n)',
		'direcciones reales varían',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// The brief asks for neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés)\b/i);
});

test('narration answers the same questions in English', () => {
	const all = resolveScript(script, 'en')
		.steps.map((entry) => `${entry.title} ${entry.text}`)
		.join('\n')
		.toLowerCase();
	for (const concept of [
		'pointer',
		'`null`',
		'smaller than 50',
		'larger than 50',
		'`left`',
		'`right`',
		'recursive',
		'the new node is hung there',
		'same rule',
		'only reads',
		'returns the node',
		'the value is not there',
		'inorder',
		'preorder',
		'postorder',
		'sorted',
		'after its children',
		'unreachable',
		'leak',
		'in order',
		'degenerates into a list',
		'o(n)',
		'balanced',
		'o(log n)',
		'real addresses vary',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
});

test('insertion follows the lesson: the new node is hung where a NULL is found', () => {
	// 30 and 70 under the root, 40 on the right of 30, then the leaves 20, 60 and 80.
	assert.deepEqual(entered('descend', 'nd-'), [30, 70]);
	assert.deepEqual(entered('place', 'nd-'), [40, 20, 60, 80]);
	// Each link is drawn after its node exists.
	for (const id of ['descend', 'place']) {
		for (const cue of cues(id, 'draw')) {
			const child = cue.el.replace('ar-', 'nd-');
			const born = step(id).motion.cues.find((other) => other.do === 'enter' && other.el === child);
			assert.ok(born && born.at < cue.at, `${cue.el} is drawn after ${child}`);
		}
	}
	// The cursor stops on the NULL socket before the node is hung.
	assert.deepEqual(cues('place', 'move').filter((cue) => cue.el === 'p').map((cue) => cue.to), ['a-50', 'a-30', 'a-h40']);
	// Left when smaller, right when larger.
	const bars = (id) => cues(id, 'move').filter((cue) => cue.el === 'hl').map((cue) => cue.to);
	assert.deepEqual(bars('descend').filter((to) => ['ln-7', 'ln-10'].includes(to)), ['ln-7', 'ln-10']);
	assert.deepEqual(bars('place').filter((to) => ['ln-7', 'ln-10'].includes(to)), ['ln-7', 'ln-10']);
});

test('search follows the same path and answers with NULL for a missing value', () => {
	const path = cues('search', 'move').filter((cue) => cue.el === 'p').map((cue) => cue.to);
	assert.deepEqual(path, ['a-50', 'a-70', 'a-60', 'a-50', 'a-70', 'a-60', 'a-h65']);
	assert.deepEqual(cues('search', 'type').map((cue) => cue.el), ['o-s60', 'o-s65']);
});

test('the three traversals visit the nodes in the order the lesson shows', () => {
	assert.deepEqual(entered('inorder', 'vs-'), [20, 30, 40, 50, 60, 70, 80]);
	assert.deepEqual(entered('others', 'vs-'), [50, 30, 20, 40, 70, 60, 80, 20, 40, 30, 60, 80, 70, 50]);
	assert.deepEqual(cues('inorder', 'type').map((cue) => cue.el), ['o-in']);
	assert.deepEqual(cues('others', 'type').map((cue) => cue.el), ['o-pre', 'o-post']);
});

test('free goes in postorder: every node is released after its children', () => {
	const gone = cues('free', 'exit').filter((cue) => /^nd-\d+$/.test(cue.el));
	const order = gone.map((cue) => Number(cue.el.slice(3)));
	assert.deepEqual(order, [20, 40, 30, 60, 80, 70, 50]);
	const children = { 30: [20, 40], 70: [60, 80], 50: [30, 70] };
	for (const [parent, kids] of Object.entries(children)) {
		const parentAt = gone.find((cue) => cue.el === `nd-${parent}`).at;
		for (const kid of kids) assert.ok(gone.find((cue) => cue.el === `nd-${kid}`).at < parentAt, `${kid} is freed before ${parent}`);
	}
	// The caller sets raiz to NULL afterwards.
	const nulled = cues('free', 'enter').find((cue) => cue.el === 'rv-null');
	assert.ok(nulled && nulled.at > gone.at(-1).at);
	assert.deepEqual(cues('free', 'type').map((cue) => cue.el), ['o-free']);
});

test('a list needs five steps to reach the 50 and a balanced tree three', () => {
	const path = cues('degenerate', 'move').filter((cue) => cue.el === 'p').map((cue) => cue.to);
	assert.deepEqual(path, ['da-10', 'da-20', 'da-30', 'da-40', 'da-50', 'ba-30', 'ba-40', 'ba-50']);
	assert.deepEqual(entered('degenerate', 'dn-'), [10, 20, 30, 40, 50]);
	assert.deepEqual(entered('degenerate', 'bn-'), [30, 10, 40, 20, 50]);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`ln-${n}`) or listed in the frontmatter (`id: 'a-h30'`) count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		const prefix = id.replace(/\d+$/, '');
		return prefix !== id && component.includes('`' + prefix + '${');
	};

	for (const entry of script.steps) {
		for (const cue of entry.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${entry.id})`);
			}
		}
	}
});

test('the code in the canvas is the lesson code the narration describes', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		'`bool ${n.insert}(${n.node} **${n.root}, int ${n.value}) {`',
		'`    if (*${n.root} == NULL) {`',
		'`        *${n.root} = ${n.create}(${n.value});`',
		'`        return ${n.insert}(&(*${n.root})->${n.left}, ${n.value});`',
		'`        return ${n.insert}(&(*${n.root})->${n.right}, ${n.value});`',
		'`const ${n.node} *${n.find}(const ${n.node} *${n.root}, int ${n.value}) {`',
		'`    if (${n.root} == NULL || ${n.root}->${n.value} == ${n.value}) {`',
		'`        return ${n.find}(${n.root}->${n.left}, ${n.value});`',
		'`        printf("%d ", ${n.root}->${n.value});`',
		'`void ${n.destroy}(${n.node} *${n.root}) {`',
		'`    free(${n.root});`',
		"t('raiz', 'root')",
		"t('izquierdo', 'left')",
		"t('derecho', 'right')",
		"t('destruir_arbol', 'destroy_tree')",
		"t('¿Está el 60? sí', 'Is 60 there? yes')",
		"t('¿Está el 65? no', 'Is 65 there? no')",
		"t('Inorden:   20 30 40 50 60 70 80', 'Inorder:   20 30 40 50 60 70 80')",
		"t('Preorden:  50 30 20 40 70 60 80', 'Preorder:  50 30 20 40 70 60 80')",
		"t('Postorden: 20 40 30 60 80 70 50', 'Postorder: 20 40 30 60 80 70 50')",
		"t('Altura después de destruir: 0', 'Height after destroying: 0')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/arbol-busqueda-c'/);
	assert.match(component, /import { highlightCode } from '\.\.\/\.\.\/utils\/highlightCode'/);
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the editor highlights C');
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
