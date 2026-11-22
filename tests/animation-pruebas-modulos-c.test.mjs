import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/pruebas-modulos-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'pruebas-modulos-c';
const LESSON = 'pruebas-estilo-y-portabilidad';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '37-pruebas-estilo-y-portabilidad';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const entered = (cues) => cues.filter((cue) => cue.do === 'enter').map((cue) => cue.el);
const exited = (cues) => cues.filter((cue) => cue.do === 'exit').map((cue) => cue.el);

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.ok(getAnimationsForLesson('c', LESSON).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.equal(animation.image, `/img/animations/${SLUG}.svg`);
	assert.ok(existsSync(`public${animation.image}`));
});

test('the lesson exists in both languages and the thumbnail keeps the Organic palette', async () => {
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.en.md`));
	const svg = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 400 200"/);
	assert.match(svg, /fill="#f1e8d9"/, 'cream ground');
	assert.match(svg, /#c0714a/, 'terracotta');
	assert.match(svg, /#7d9a76/, 'sage');
	assert.match(svg, /stroke-width="2\.75"/, 'Lucide stroke');
	assert.doesNotMatch(svg, /#00203a|#f7038a/, 'the film palette stays out of the thumbnail');
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['unit', 'assert', 'cases', 'ndebug', 'runner', 'portable'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['intro', 'assert-fail', 'assert-fix', 'cases', 'ndebug', 'runner', 'make', 'portable'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'tests', `${step.id} plays on the single canvas`);
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

// The six questions: what a unit test checks, what assert does and its message, which
// cases to test, what the runner reports, why NDEBUG matters and why fixed-width
// integers help portability.
const questions = {
	es: [
		'prueba unitaria',
		'una función',
		'`assert`',
		'compuerta',
		'qué falló',
		'código de salida',
		'134',
		'cero y vacío',
		'negativos',
		'INT_MAX',
		'regresión',
		'-DNDEBUG',
		'sin comprobar nada',
		'nunca compiles pruebas con `ndebug`',
		'VERIFICAR',
		'3 pruebas, 1 fallidas',
		'EXIT_FAILURE',
		'estado de salida',
		'make test',
		'`char`',
		'signo',
		'`uint8_t`',
		'<stdint.h>',
		'ancho y signo',
	],
	en: [
		'unit test',
		'one function',
		'`assert`',
		'gate',
		'what failed',
		'exit code',
		'134',
		'zero and empty',
		'negatives',
		'INT_MAX',
		'regression',
		'-DNDEBUG',
		'without checking anything',
		'never build tests with `ndebug`',
		'CHECK',
		'3 tests, 1 failed',
		'EXIT_FAILURE',
		'exit status',
		'make test',
		'`char`',
		'signed',
		'`uint8_t`',
		'<stdint.h>',
		'width and sign',
	],
};

test('narration answers the six questions of the brief in both languages', () => {
	for (const lang of ['es', 'en']) {
		const all = resolveScript(script, lang)
			.steps.map((step) => `${step.title} ${step.text}`)
			.join('\n')
			.toLowerCase();
		for (const concept of questions[lang]) assert.ok(all.includes(concept.toLowerCase()), `${lang} narration should mention ${concept}`);
	}
	const es = resolveScript(script, 'es').steps.map((step) => step.text).join('\n');
	// The brief asks for neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(es, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|compilá|corregí|probá|poné)\b/i);
});

test('the probe crosses the module and meets its gate; a false assert closes the line', () => {
	// Every run starts at the test machine, crosses the module under test and lands on a gate.
	const intro = cuesOf('intro');
	assert.deepEqual(stopsOf(intro, 'pr'), ['a-tm', 'a-fn', 'a-g6']);
	assert.ok(intro.some((cue) => cue.do === 'enter' && cue.el === 'g6-on'), 'the first gate opens');
	assert.deepEqual(entered(intro).filter((el) => /^g\d+$/.test(el)), ['g6', 'g7', 'g8', 'g9', 'g10'], 'one gate per assert line');

	const failure = cuesOf('assert-fail');
	assert.deepEqual(stopsOf(failure, 'pr'), ['a-tm', 'a-fn', 'a-g7']);
	for (const el of ['r-bad', 'fn-x', 'bug', 'g7-x', 'hx-7', 'cut', 'veil', 'msg']) assert.ok(entered(failure).includes(el), `${el} shows the failure`);
	assert.ok(!entered(failure).some((el) => /^g(8|9|10)-on$/.test(el)), 'nothing past the closed gate runs');
	for (const row of ['t2-0', 't2-1', 't2-2', 't2-3', 't2-4']) assert.ok(cuesOf('assert-fail').some((cue) => cue.do === 'type' && cue.el === row), `terminal row ${row}`);

	const fix = cuesOf('assert-fix');
	assert.deepEqual(stopsOf(fix, 'pr'), ['a-tm', 'a-fn', 'a-g7']);
	for (const el of ['g7-x', 'cut', 'veil', 'hx-7', 'msg', 'bug', 'fn-x']) assert.ok(exited(fix).includes(el), `${el} clears after the fix`);
	assert.deepEqual(entered(fix).filter((el) => /^g\d+-on$/.test(el)), ['g7-on', 'g8-on', 'g9-on', 'g10-on'], 'every gate opens in line order');
});

test('boundary cases ride the same line and NDEBUG removes the gates and their lines', () => {
	const cases = cuesOf('cases');
	assert.deepEqual(stopsOf(cases, 'pr').filter((to) => to.startsWith('a-g')), ['a-g9', 'a-g8']);
	for (const el of ['cs-zero', 'cs-one', 'cs-neg', 'cs-max', 'reg']) assert.ok(entered(cases).includes(el), `${el} names a case`);

	const ndebug = cuesOf('ndebug');
	for (const [index, gate] of ['g6', 'g7', 'g8', 'g9', 'g10'].entries()) {
		assert.ok(exited(ndebug).includes(gate), `${gate} vanishes`);
		assert.ok(exited(ndebug).includes(`${gate}-on`), `${gate} loses its lit state`);
		assert.ok(exited(ndebug).includes(`ea-${6 + index}`), `the assert on line ${6 + index} vanishes from the editor`);
	}
	assert.deepEqual(stopsOf(ndebug, 'pr'), ['a-tm', 'a-fn', 'a-rn'], 'the probe crosses the empty belt unchecked');
	for (const el of ['nd', 'fn-x', 'bug', 'all', 'nochk', 'fg', 'fg-note']) assert.ok(entered(ndebug).includes(el), `${el} explains NDEBUG`);
});

test('the runner counts every check, keeps going after a failure and sets the exit status', () => {
	const runner = cuesOf('runner');
	assert.deepEqual(stopsOf(runner, 'pr'), ['a-tm', 'a-fn', 'a-v14']);
	assert.deepEqual(entered(runner).filter((el) => /^v\d+$/.test(el)), ['v14', 'v15', 'v16']);
	// The first check fails and the other two still run: the counters go 1/1, 2/1 and 3/1.
	assert.deepEqual(entered(runner).filter((el) => /^cr-\d$/.test(el)), ['cr-0', 'cr-1', 'cr-2', 'cr-3']);
	assert.deepEqual(entered(runner).filter((el) => /^cf-\d$/.test(el)), ['cf-0', 'cf-1']);
	for (const el of ['v14-x', 'hx-14', 'fm', 'v15-on', 'v16-on', 'rn-x', 'st-1']) assert.ok(entered(runner).includes(el), `${el} shows the run`);
	assert.ok(!entered(runner).includes('v15-x') && !entered(runner).includes('v16-x'), 'only the first check fails');

	const make = cuesOf('make');
	const order = entered(make).filter((el) => ['mk-on', 'mk-x', 'mkerr'].includes(el));
	assert.deepEqual(order, ['mk-on', 'mk-x', 'mkerr', 'mk-on'], 'make starts, stops on a non-zero status and ends green after the fix');
	for (const row of ['t7-0', 't7-1', 't7-2', 't7-3', 't7-4', 't7-5', 't7-6']) assert.ok(make.some((cue) => cue.do === 'type' && cue.el === row), `terminal row ${row}`);
});

test('the same byte is read two ways by two platforms, then once by fixed-width types', () => {
	const portable = cuesOf('portable');
	assert.deepEqual(stopsOf(portable, 'by'), ['a-bay-a', 'a-bay-b']);
	assert.deepEqual(stopsOf(portable, 'bu'), ['a-bay-a', 'a-bay-b']);
	assert.deepEqual(entered(portable).filter((el) => el.startsWith('rs-')), ['rs-a1', 'rs-b1', 'rs-a2', 'rs-b2']);
	for (const el of ['szl', 'szf']) assert.ok(entered(portable).includes(el), `${el} compares sizes`);
	const last = portable.filter((cue) => cue.do === 'camera').at(-1);
	assert.equal(last.to, 'all', 'the camera pulls back at the end');
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="tests" data-motion/);

	// Ids built in a loop (`ea-${n}`) or listed in the frontmatter (`id: 'a-tm'`) count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`lit: '${id}'`)) return true;
		const gate = id.match(/^([gv]\d+)-(on|x)$/);
		if (gate) return component.includes(`id: '${gate[1]}'`) && (gate[2] === 'on' || new RegExp(`id: '${gate[1]}'[^}]*x: true`).test(component));
		const anchor = id.match(/^a-([gv]\d+)$/);
		if (anchor) return component.includes(`id: '${anchor[1]}'`) && component.includes('`a-${item.id}`');
		const line = id.match(/^e([a-d])-\d+$/);
		if (line) return component.includes(`id: 'e${line[1]}'`) && component.includes('`${page.id}-${line.n}`');
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

test('the code and terminal in the canvas are the lesson programs and the real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		// The assert test: the gate lines of the film are the editor lines 6 to 10.
		"'#include <assert.h>'",
		'`    assert(${names.sum}(2, 3) == 5);`',
		'`    assert(${names.div}(7, 2) == 3);`',
		'`    assert(${names.div}(-7, 2) == -3);`',
		'`    assert(${names.div}(0, 5) == 0);`',
		'`    assert(${names.can}(0) == false);`',
		'`    printf("${names.pass}\\\\n");`',
		"{ id: 'g6', line: 6, u: 2.2, tag: '5'",
		"{ id: 'g7', line: 7, u: 3.0, tag: '3'",
		"{ id: 'g10', line: 10, u: 5.4, tag: 'false'",
		// The runner: the check on line 14 fails against the buggy module.
		'`#define ${names.check}(${names.cond}) do { \\\\`',
		'`    ${names.check}(${names.div}(7, 2) == 3);`',
		'`    return ${names.failed} == 0 ? EXIT_SUCCESS : EXIT_FAILURE;`',
		"{ id: 'v14', line: 14, u: 3.0, tag: '3'",
		'`${names.test}:14: ${names.failWord}: ${names.div}(7, 2) == 3`',
		'`3 ${names.tests}, 1 ${names.failedCount}`',
		'`3 ${names.tests}, 0 ${names.failedCount}`',
		// The Makefile target, the portable types and the real output.
		'`test: ${names.mod} ${names.testBin}`',
		"'    char c = (char)200;'",
		'`    uint8_t ${names.bright} = 200;`',
		'`    int32_t ${names.balance} = -1500;`',
		"text: '-56'",
		"text: '200'",
		"text: '134'",
		'`Assertion failed: (${names.div}(7, 2) == 3), function main,`',
		'`  file ${names.test}, line 7.`',
		"'(a + b - 1) / b'",
		"text: 'a / b'",
		"'-DNDEBUG'",
		"highlightCode(source, language)",
		"names.line}, sizeof ${names.line}, ${names.file}) != NULL);",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// Spanish identifiers in the Spanish film, English identifiers in the English one.
	for (const pair of ["t('test_calculadora.c', 'test_calculator.c')", "t('sumar', 'add')", "t('dividir', 'divide')", "t('se_puede_dividir', 'can_divide')", "t('VERIFICAR', 'CHECK')", "t('Todas las pruebas pasaron.', 'All tests passed.')", "t('saldo', 'balance')"]) {
		assert.ok(component.includes(pair), `missing localized name: ${pair}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/pruebas-modulos-c'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
