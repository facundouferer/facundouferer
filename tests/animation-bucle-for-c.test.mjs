import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/bucle-for-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'bucle-for-c';
const LESSON = 'sentencia-for';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '12-sentencia-for';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.deepEqual(animation.tag, { es: 'C', en: 'C' });
	assert.ok(getAnimationsForLesson('c', LESSON).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['stations', 'scope', 'while', 'steps', 'mistakes', 'unsigned'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['build', 'laps', 'scope', 'while', 'count', 'semicolon', 'offbyone', 'wrap', 'close'],
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

test('the particle and the editor bar never start a move before the previous one ends', () => {
	for (const step of script.steps) {
		for (const el of ['p', 'hl']) {
			const moves = step.motion.cues.filter((cue) => cue.do === 'move' && cue.el === el);
			moves.slice(1).forEach((cue, index) => {
				assert.ok(cue.at >= cueEnd(moves[index]), `${step.id}: ${el} moves to ${cue.to} while still travelling`);
			});
		}
	}
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

const narration = (lang) =>
	resolveScript(script, lang)
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n')
		.toLowerCase();

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// When does each part run?
		'corre una sola vez',
		'antes de cada vuelta',
		'al final de cada vuelta',
		'cinco vueltas, seis evaluaciones',
		// Where does the counter live?
		'su alcance es el encabezado y el cuerpo',
		'deja de existir',
		'declara la variable antes del `for`',
		// How do you count down or by steps?
		'cuenta hacia abajo con `i--`',
		'cuenta de a pasos',
		'coherente con la actualización',
		// How does for map to while?
		'puede escribirse como `while`',
		'la inicialización va antes',
		'la actualización, al final del cuerpo',
		// Why is `for (...);` a bug?
		'la instrucción vacía',
		'una sola vez',
		'el compilador lo rechaza',
		'una vuelta de más',
		'error por uno',
		// Why does a size_t countdown with >= 0 never end?
		'`size_t` no tiene valores negativos',
		'da la vuelta al valor máximo',
		'`size_max`',
		'nunca termina',
		'`i-- > 0` compara el valor anterior',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|declará|necesitás)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'runs only once',
		'before each pass',
		'at the end of each pass',
		'five passes, six checks',
		'its scope is the header and the body',
		'no longer exists',
		'declare the variable before the `for`',
		'counts down with `i--`',
		'counts by steps',
		'consistent with the update',
		'can be written as a `while`',
		'the initialization goes before',
		'the update at the end of the body',
		'the empty statement',
		'the compiler rejects it',
		'one extra pass',
		'off-by-one',
		'`size_t` has no negative values',
		'wraps around to the maximum value',
		'`size_max`',
		'never ends',
		'`i-- > 0` compares the previous value',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

test('i is born at the entrance of every loop and gone at its exit', () => {
	const cues = Object.fromEntries(script.steps.map((step) => [step.id, step.motion.cues]));
	const has = (id, cue) => cues[id].some((entry) => Object.entries(cue).every(([key, value]) => entry[key] === value));
	// Loop 1 counts 0 to 4 and stops when the condition sees 5.
	const values = (id) => cues[id].filter((cue) => cue.do === 'enter' && /^v-/.test(cue.el)).map((cue) => cue.el.slice(2));
	assert.deepEqual(values('laps'), ['0', '1', '2', '3', '4', '5']);
	assert.deepEqual(values('count'), ['5', '4', '3', '2', '1', '0', '0', '5', '10', '15', '20', '25']);
	assert.deepEqual(values('offbyone'), ['0', '1', '2', '3', '4', '5', '6']);
	assert.deepEqual(values('wrap'), ['3', '2', '1', '0', 'max']);
	assert.deepEqual(values('close'), ['3', '2', '1', '0']);
	// The cell is born with each loop and leaves with it: never at line 8 or after.
	assert.ok(has('laps', { do: 'enter', el: 'c-i' }));
	assert.ok(has('scope', { do: 'exit', el: 'c-i' }));
	assert.equal(cues.count.filter((cue) => cue.el === 'c-i' && cue.do === 'enter').length, 2, 'each for declares its own i');
	// With the `;`, i is gone before the block runs.
	const gone = cues.semicolon.find((cue) => cue.do === 'exit' && cue.el === 'c-i').at;
	const block = cues.semicolon.find((cue) => cue.do === 'move' && cue.el === 'p' && cue.to === 'a-body').at;
	assert.ok(gone <= block, 'i leaves before the block after the ; runs');
	assert.ok(!cues.semicolon.some((cue) => cue.do === 'move' && cue.el === 'p' && cue.to === 'a-body' && cue.at < gone));
	// The endless countdown keeps turning; the fix exits.
	assert.ok(has('wrap', { do: 'flow', el: 'loop-x' }));
	assert.ok(has('close', { do: 'move', el: 'p', to: 'a-exit' }));
	assert.ok(has('close', { do: 'camera', to: 'all' }));
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`mi-${...}`) or listed in the frontmatter (`id: 'f-5'`) count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`part('${id}'`) || component.includes(`lit: '${id}'`)) return true;
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

test('the code in the canvas is the lesson program and its real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'    for (int i = 0; i < 5; i++) {'",
		"'    for (int i = 5; i > 0; i--) {'",
		"'    for (int i = 0; i <= 20; i += 5) {'",
		"'    size_t n = 3;'",
		"'    for (size_t i = n; i-- > 0; ) {'",
		`'        printf("%zu ", i);'`,
		// The mistakes of the lesson.
		"'    for (int i = 0; i < 5; i++); {'",
		"'    for (int i = 0; i <= 5; i++) {'",
		"'    for (size_t i = n; i >= 0; i--) {'",
		// Real output of the program and of its broken versions.
		"['0 1 2 3 4 ', '5 4 3 2 1 ', '0 5 10 15 20 ', '2 1 0 ']",
		"'0 1 2 3 4 5 '",
		"'3 2 1 0 18446744073709551615 18446744073709551614 …'",
		"t(\"error: 'i' no está declarada en este alcance\", \"error: 'i' is not declared in this scope\")",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/bucle-for-c'/);
	assert.match(component, /highlightCode\(source, 'c'\)/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
