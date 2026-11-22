import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/algoritmo-estados-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'algoritmo-estados-c';
const LESSON = 'procesos-y-estados';
const FILE = '02-procesos-y-estados';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cues = Object.fromEntries(script.steps.map((step) => [step.id, step.motion.cues]));
const has = (id, cue) => cues[id].some((entry) => Object.entries(cue).every(([key, value]) => entry[key] === value));
const firstAt = (id, kind, el) => cues[id].find((cue) => cue.do === kind && cue.el === el)?.at;

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
		['state', 'trace', 'assign', 'swap', 'stations', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['state', 'trace', 'formula', 'lost', 'aux', 'stations', 'recap'],
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

test('the particle, the editor bar and each token never start a move before the previous one ends', () => {
	for (const step of script.steps) {
		const movers = new Set(step.motion.cues.filter((cue) => cue.do === 'move').map((cue) => cue.el));
		for (const el of movers) {
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
		console.log(`${SLUG} ${lang}: ${(total / 1000).toFixed(1)} s`);
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

test('narration answers the questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// What is the state?
		'secuencia ordenada de acciones',
		'una caja por variable',
		'el estado es el conjunto de valores',
		'`?`, indeterminado',
		// How does each action change it? What does a trace table show?
		'tabla de traza',
		'valor de cada variable después de cada acción',
		'`numero = 5;` guarda el 5',
		'calcula `numero + 3` y guarda 8',
		'`resultado: 8`',
		'estado final',
		// Why is an assignment not a formula?
		'guarda un valor a la vez',
		'guardó un valor, no la fórmula',
		'asignarlo otra vez',
		// Why does a swap need a temporary variable?
		'`x = y;` copia el 8 en `x`',
		'el 3 ya no está en ninguna variable',
		'el intercambio falló',
		'variable auxiliar',
		'conserva el 3',
		'`x` vale 8 e `y` vale 3',
		// What are input, processing and output?
		'entrada, proceso y salida',
		'entrada: el dato `numero = 5`',
		'proceso: `numero + 3`',
		'salida: `printf` lo muestra',
		'qué tengo',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|vos|escribí|hacé|usá|asigná)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'ordered sequence of actions',
		'one box per variable',
		'the state is the set of values',
		'`?`, indeterminate',
		'trace table',
		'value of each variable after each action',
		'`number = 5;` stores 5',
		'computes `number + 3` and stores 8',
		'`result: 8`',
		'final state',
		'one value at a time',
		'stored a value, not the formula',
		'assign it again',
		'`x = y;` copies 8 into `x`',
		'the 3 is no longer in any variable',
		'the swap failed',
		'auxiliary variable',
		'keeps the 3',
		'`x` is 8 and `y` is 3',
		'input, processing and output',
		'input: the datum `number = 5`',
		'processing: `number + 3`',
		'output: `printf` shows it',
		'what you have',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
});

test('each action changes one box and adds one row to the trace table', () => {
	// Complete example: declarations, then numero = 5, resultado = numero + 3, printf.
	for (const el of ['c-num', 'c-res', 'tq-num', 'tq-res']) assert.ok(has('state', { do: 'enter', el }), `${el} is created`);
	assert.ok(has('trace', { do: 'exit', el: 'tq-num' }) && has('trace', { do: 'enter', el: 'tk-5' }), 'line 7 replaces ? with 5');
	assert.ok(has('trace', { do: 'draw', el: 'fl-calc' }) && has('trace', { do: 'enter', el: 'tk-8' }), 'line 8 stores 8');
	assert.ok(has('trace', { do: 'type', el: 'out-1' }), 'line 10 prints on the screen');
	for (const row of [0, 1, 2, 3]) assert.ok(has('trace', { do: 'enter', el: `tr-1-${row}` }), `row ${row} of the trace table`);
	assert.deepEqual(
		cues.trace.filter((cue) => cue.do === 'move' && cue.el === 'tbh-1').map((cue) => cue.to),
		['ta-1-1', 'ta-1-2', 'ta-1-3'],
		'the table bar follows the rows',
	);
	// The bar and the module of every instruction of the program run in editor order.
	assert.deepEqual(
		cues.trace.filter((cue) => cue.do === 'move' && cue.el === 'hl').map((cue) => cue.to),
		['ln-1-7', 'ln-1-8', 'ln-1-10', 'ln-1-12'],
	);

	// An assignment stores a value: n changes, doble keeps 14 and the formula is shown crossed out.
	assert.ok(has('formula', { do: 'exit', el: 'tk-n7' }) && has('formula', { do: 'enter', el: 'tk-n8' }));
	assert.ok(has('formula', { do: 'draw', el: 'fl-fx' }) && has('formula', { do: 'enter', el: 'lb-nofx' }));
	assert.ok(!has('formula', { do: 'exit', el: 'tk-d14' }), 'doble keeps its 14');
	assert.ok(firstAt('formula', 'draw', 'fl-fx') > firstAt('formula', 'enter', 'tk-n8'), 'the formula is questioned after n changed');
	for (const row of [0, 1, 2]) assert.ok(has('formula', { do: 'enter', el: `tr-2-${row}` }));

	// The failed swap: x = y replaces the 3 and loses it; y = x copies the 8 again.
	assert.ok(has('lost', { do: 'move', el: 'tk-x8', to: 'a-c-x' }));
	assert.ok(has('lost', { do: 'exit', el: 'tk-x3' }) && has('lost', { do: 'enter', el: 'lb-lost' }));
	assert.ok(has('lost', { do: 'move', el: 'tk-y8b', to: 'a-c-y' }) && has('lost', { do: 'exit', el: 'tk-y8' }));
	for (const row of [0, 1, 2, 3]) assert.ok(has('lost', { do: 'enter', el: `tr-3-${row}` }));

	// The fixed swap goes through the auxiliary box: x -> temp, y -> x, temp -> y.
	assert.ok(has('aux', { do: 'enter', el: 'c-aux' }) && has('aux', { do: 'enter', el: 'tm-q' }));
	assert.ok(has('aux', { do: 'move', el: 'tm-a3', to: 'a-c-aux' }), 'auxiliar = x keeps the 3');
	assert.ok(has('aux', { do: 'move', el: 'tm-x8', to: 'a-c-x' }), 'x = y');
	assert.ok(has('aux', { do: 'move', el: 'tm-y3', to: 'a-c-y' }), 'y = auxiliar gives the 3 back');
	assert.ok(!has('aux', { do: 'exit', el: 'tm-a3' }), 'the auxiliary box keeps the 3');
	for (const row of [0, 1, 2, 3, 4, 5]) assert.ok(has('aux', { do: 'enter', el: `tr-4-${row}` }));
	assert.deepEqual(
		cues.aux.filter((cue) => cue.do === 'move' && cue.el === 'hl').map((cue) => cue.to),
		['ln-4-1', 'ln-4-1', 'ln-4-2', 'ln-4-3', 'ln-4-5', 'ln-4-6', 'ln-4-7'],
	);

	// Input, processing and output: three stations, the value travels through them, the camera pulls back.
	for (const el of ['z-in', 'z-proc', 'z-out', 'on-in', 'on-proc', 'on-out', 'br-in', 'br-proc', 'br-out']) {
		assert.ok(has('stations', { do: 'enter', el }), `${el} appears`);
	}
	assert.ok(has('stations', { do: 'move', el: 'ts-5', to: 'a-proc' }) && has('stations', { do: 'move', el: 'ts-8', to: 'a-out' }));
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`m-${...}`) or listed in the frontmatter (`id: 'lb-state'`) count as present.
	const built = [
		[/^(m|on)-\d-\d+$/, '`m-${module.page}-${module.line}`', '`on-${module.page}-${module.line}`'],
		[/^a-m-\d-\d+$/, '`a-m-${module.page}-${module.line}`'],
		[/^ln-\d-\d+$/, '`ln-${page.id}-${line.n}`'],
		[/^tb-\d$/, '`tb-${table.id}`'],
		[/^tbh-\d$/, '`tbh-${table.id}`'],
		[/^tr-\d-\d+$/, '`tr-${table.id}-${index}`'],
		[/^ta-\d-\d+$/, '`ta-${table.id}-${index}`'],
		[/^pg-\d$/, '`pg-${page.id}`'],
		[/^c-(num|res|n|dbl|x|y|aux)$/, '`c-${cell.key}`', "key: '"],
		[/^a-c-(num|res|n|dbl|x|y|aux)$/, '`a-c-${cell.key}`'],
		[/^(z|on)-(in|proc|out)$/, '`z-${station.key}`', '`on-${station.key}`'],
		[/^a-(in|proc|out)$/, '`a-${station.key}`'],
		[/^out-\d$/, '`out-${index + 1}`'],
	];
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		return built.some(([pattern, ...needles]) => pattern.test(id) && needles.some((needle) => component.includes(needle)));
	};
	// A cell key is declared as `key: 'num'`.
	for (const key of ['num', 'res', 'n', 'dbl', 'x', 'y', 'aux']) assert.ok(component.includes(`key: '${key}'`), `cell ${key}`);

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the code in the canvas is the lesson programs and the real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		// Complete example (page 1) and its output.
		"'#include <stdio.h>'",
		"'int main(void) {'",
		'`    int ${names.num};`',
		'`    int ${names.res};`',
		'`    ${names.num} = 5;`',
		'`    ${names.res} = ${names.num} + 3;`',
		'`    printf("${names.screen}: %d\\\\n", ${names.res});`',
		"'    return 0;'",
		"num: t('numero', 'number')",
		"res: t('resultado', 'result')",
		"dbl: t('doble', 'twice')",
		"aux: t('auxiliar', 'temp')",
		"screen: t('Resultado', 'Result')",
		'`${names.screen}: 8`',
		// Assignment fragment.
		"lines: ['int n = 7;', `int ${names.dbl} = n * 2;`, 'n = n + 1;']",
		// Failed swap.
		"lines: ['int x = 3;', 'int y = 8;', '', 'x = y;', 'y = x;']",
		// Swap with the auxiliary variable.
		"lines: ['int x = 3;', 'int y = 8;', `int ${names.aux};`, '', `${names.aux} = x;`, 'x = y;', `y = ${names.aux};`]",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// The instructions with a module are exactly the executable lines of each page.
	assert.ok(component.includes('instructions: [4, 5, 7, 8, 10, 12]'));
	assert.ok(component.includes('instructions: [1, 2, 3],'));
	assert.ok(component.includes('instructions: [1, 2, 4, 5]'));
	assert.ok(component.includes('instructions: [1, 2, 3, 5, 6, 7]'));
	// Trace tables are the lesson's own: every value of its four tables.
	for (const fragment of [
		"cells: [['5', 'new'], [Q, 'unk']]",
		"cells: [['5', undefined], ['8', 'new']]",
		"screen: `${names.screen}: 8`",
		"cells: [['7', 'new'], [Q, 'unk']]",
		"cells: [['8', 'new'], ['14', 'hold']]",
		"cells: [['8', 'new'], ['8', undefined]]",
		"cells: [['8', undefined], ['8', 'bad']]",
		"cells: [['3', undefined], ['8', undefined], ['3', 'aux']]",
		"cells: [['8', undefined], ['3', 'aux'], ['3', undefined]]",
	]) {
		assert.ok(component.includes(fragment), `missing trace row: ${fragment}`);
	}
	// The lesson shows no pointers or functions in this example.
	assert.doesNotMatch(component, /scanf|malloc|\*\w+ =|&\w+/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/algoritmo-estados-c'/);
	assert.match(component, /highlightCode\(page\.lines\.join\('\\n'\), 'c'\)/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');
	assert.match(component, /font-family: var\(--font-body\)/);

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
