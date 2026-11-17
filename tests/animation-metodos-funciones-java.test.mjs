import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/metodos-funciones-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'metodos-funciones-java';
const LESSON = '05-metodos-y-funciones';
const FILE = '05-metodos-y-funciones';
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
		['call', 'stack', 'pass-by-value', 'return', 'overload', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['declare', 'invoke', 'push', 'mutate', 'caller-safe', 'return-pop', 'overload', 'recap'],
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
		// 1. How does main invoke a method and pass arguments?
		'flujo de ejecución',
		'firma',
		'argumentos',
		// 2. What happens on the Call Stack when a method is called?
		'pila de llamadas',
		'marco de pila',
		'variables locales',
		// 3. Why is Java strictly pass-by-value?
		'pasaje por valor',
		'copia',
		'intacta',
		// 4. What does return do to the value and the stack frame?
		'return',
		'desapila',
		// 5. How does method overloading work?
		'sobrecarga',
		'mismo nombre',
		'compilador',
		// 6. Recap of the Call Stack lifecycle and pass-by-value rule
		'lifo',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé)\b/i);
});

test('pass-by-value mutates only the local copy, then return hands the result back and pops the frame', () => {
	// Invoke & push: flow moves from main variable to call, then pushes into method frame.
	assert.deepEqual(stopsOf(cuesOf('invoke', 'push'), 'p'), ['a-var', 'a-call', 'a-m3']);
	assert.deepEqual(stopsOf(cuesOf('push'), 'hl'), ['ln-2', 'ln-3']);
	// Mutate & caller-safe: the wrong expectation that main's x changed is cleared when checking main.
	const safeCues = cuesOf('caller-safe');
	const cleared = safeCues.filter((cue) => cue.do === 'exit').map((cue) => cue.el);
	for (const id of ['rt-exp', 'var-x', 'exp', 'hx-14']) assert.ok(cleared.includes(id), `caller-safe clears ${id}`);
	assert.deepEqual(stopsOf(cuesOf('mutate', 'caller-safe'), 'p'), ['a-m3', 'a-var']);
	// Return & pop: flow enters calcularTotal, hits return, hands result to main and prints.
	const retCues = cuesOf('return-pop');
	assert.deepEqual(stopsOf(retCues, 'p'), ['a-calc-call', 'a-c8', 'a-c9', 'a-print', 'a-end']);
	assert.deepEqual(stopsOf(retCues, 'hl'), ['ln-17', 'ln-8', 'ln-9', 'ln-18', 'ln-19']);
	assert.deepEqual(retCues.filter((cue) => cue.do === 'type').map((cue) => cue.el), ['out-2']);
});

test('the overload is selected before the flow runs', () => {
	const cues = cuesOf('overload');
	const at = (kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;
	assert.ok(at('draw', 'rt-over') < at('enter', 'p'), 'the route to sumar(double, double) exists before execution starts');
	assert.ok(at('enter', 'calc-off') < at('enter', 'p'), 'the other overloads are discarded at compile time');
	assert.deepEqual(stopsOf(cues, 'p'), ['a-call', 'a-s11', 'a-end']);
	assert.deepEqual(stopsOf(cues, 'hl'), ['ln-17', 'ln-11', 'ln-18']);
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
		'`public class ${names.demo} {`',
		'`    public static void ${names.modify}(int ${names.num}) {`',
		'`        ${names.num} = 500;`',
		'`    public static int ${names.calcTotal}(int ${names.base}, int ${names.bonus}) {`',
		'`        int ${names.total} = ${names.base} + ${names.bonus};`',
		'`        return ${names.total};`',
		'`        ${names.modify}(x);`',
		'`        int ${names.res} = ${names.calcTotal}(x, 5);`',
		'`    public static int ${names.sum}(int a, int b) {`',
		'`    public static int ${names.sum}(int a, int b, int c) {`',
		'`    public static double ${names.sum}(double a, double b) {`',
		'`        double r = ${names.sum}(3.5, 2.5);`',
		"t('modificarPrimitivo', 'modifyPrimitive')",
		"t('calcularTotal', 'calculateTotal')",
		"t('sumar', 'add')",
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
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/metodos-funciones-java'/);
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
	assert.equal((component.match(/data-slug='metodos-funciones-java'/g) ?? []).length, 4);
});
