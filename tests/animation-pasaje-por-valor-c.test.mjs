import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/pasaje-por-valor-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'pasaje-por-valor-c';
const LESSON = 'variables-parametros-y-pasaje';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '16-variables-parametros-y-pasaje';
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
		['copy', 'scope', 'pop', 'return', 'static', 'value'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['build', 'call', 'change', 'scope', 'pop', 'return', 'static', 'close'],
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
		// What does the parameter receive?
		'recibe una copia del valor',
		// Why does the caller's variable not change?
		'su marco se quita de la pila',
		'nunca tocó la variable de quien llama',
		// How do you bring a result back?
		'lo devuelve con `return`',
		// Where is a variable visible?
		'solo se ve en el bloque',
		'allí no existe',
		// What does static change?
		'`static int contador`',
		'una sola vez',
		'conserva su valor entre llamadas',
		// Does C have pass by reference?
		'siempre por valor',
		'c no tiene pasaje por referencia',
		'su dirección',
		'punteros-y-direcciones',
		'pila de llamadas',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'receives a copy of the value',
		'popped off the stack',
		"never touched the caller's variable",
		'returns it with `return`',
		'visible only in the block',
		'does not exist there',
		'`static int counter`',
		'only once',
		'keeps its value between calls',
		'always passed by value',
		'no pass by reference',
		'its address',
		'call stack',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

test('the caller keeps 5 after the call and only stores 10 when it assigns the returned value', () => {
	const cues = Object.fromEntries(script.steps.map((step) => [step.id, step.motion.cues]));
	const has = (id, cue) => cues[id].some((entry) => Object.entries(cue).every(([key, value]) => entry[key] === value));
	assert.ok(has('build', { do: 'enter', el: 'num-5' }));
	// The copy changes inside the frame; the caller's cell is never touched there.
	assert.ok(has('change', { do: 'enter', el: 'x-10' }));
	for (const id of ['call', 'change', 'scope', 'pop']) {
		assert.ok(!cues[id].some((cue) => ['num-5', 'num-10'].includes(cue.el)), `${id} does not touch the caller's value`);
	}
	assert.ok(has('pop', { do: 'exit', el: 'f-dup' }));
	assert.ok(has('return', { do: 'move', el: 'tk-ret', to: 'a-num' }));
	assert.ok(has('return', { do: 'enter', el: 'num-10' }));
	// The static counter lives on the shelf and survives the frame of its function.
	const counter = cues.static.filter((cue) => cue.do === 'enter' && /^cnt-/.test(cue.el)).map((cue) => cue.el);
	assert.deepEqual(counter, ['cnt-0', 'cnt-1', 'cnt-2']);
	assert.ok(!cues.static.some((cue) => cue.do === 'exit' && cue.el === 'shelf'));
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`m-${...}`) or listed in the frontmatter (`id: 'f-dup'`) count as present.
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

test('the code in the canvas is the lesson program and its real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'#include <stdio.h>'",
		'`void ${names.twice}(int x) {`',
		"'    x = x * 2;'",
		'`int ${names.doubled}(int x) { return x * 2; }`',
		'`    static int ${names.counter} = 0;`',
		'`    ${names.counter} = ${names.counter} + 1;`',
		'`    int ${names.number} = 5;`',
		'`    ${names.twice}(${names.number});`',
		'`    ${names.number} = ${names.doubled}(${names.number});`',
		"twice: t('duplicar', 'double_it')",
		"doubled: t('duplicado', 'doubled')",
		"next: t('siguiente_turno', 'next_ticket')",
		"counter: t('contador', 'counter')",
		"number: t('numero', 'number')",
		"t('Dentro de duplicar', 'Inside double_it')}: x = 10",
		"t('En main', 'In main')}: ${names.number} = 5",
		'`${names.number} = 10`',
		"t('Turno', 'Ticket')} 1",
		"t('Turno', 'Ticket')} 2",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// No pointer code: the technique is only announced, as the lesson does.
	assert.doesNotMatch(component, /int \*|&\$\{names|\w->/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/pasaje-por-valor-c'/);
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
