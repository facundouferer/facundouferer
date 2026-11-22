import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/arreglos-indices-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'arreglos-indices-c';
const LESSON = 'arreglos-unidimensionales-y-multidimensionales';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '19-arreglos-unidimensionales-y-multidimensionales';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
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
		['cells', 'index', 'loop', 'bound', 'function', 'matrix'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['declare', 'write', 'loop', 'bound', 'count', 'call', 'grid', 'rows'],
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

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// The array: contiguous cells, initialized with = {0}.
		'`int notas[cantidad]`',
		'contiguos',
		'`= {0}` pone todo en cero',
		// 1. Where do indexes start?
		'el primero es 0',
		'`notas[0] = 8` escribe en el índice 0',
		// 2. What is the last valid index?
		'el último índice válido es `cantidad - 1`, o sea 4',
		'`i` va de 0 a 4',
		'`i < cantidad` es falsa y el ciclo termina',
		'`8 0 10 0 9`',
		'`tercera = 10`',
		// 3. What happens past the bound?
		'`notas[5] = 4` usa el índice 5: fuera del límite',
		'c no lo comprueba',
		'cae sobre `otra`',
		'comportamiento indefinido',
		// 4. How does sizeof give the count, and where does it work?
		'`sizeof puntos` da el total en bytes',
		'`sizeof puntos[0]` da `n = 5`',
		'solo donde el arreglo está declarado',
		// 6. Why does a function need the length?
		'no copia los elementos',
		'`sizeof v` no da 20',
		'la función no sabe cuántos elementos hay',
		'la cantidad viaja aparte, en `size_t n`',
		'`promedio: 8.00`',
		// 5. How is a matrix stored?
		'3 filas de 4 columnas',
		'`m[1][2] = 7`',
		'una detrás de otra',
		'orden por filas',
		'`sizeof m[0] = 16`',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|agregá|creá)\b/i);
	// This lesson comes before pointers and dynamic memory.
	assert.doesNotMatch(all, /puntero|dirección|0x[0-9a-f]|malloc|free\(|heap|montículo|\*\(/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'`int grades[count]`',
		'contiguous',
		'`= {0}` sets everything to zero',
		'the first one is 0',
		'the last valid index is `count - 1`, that is 4',
		'`i` goes from 0 to 4',
		'`i < count` is false and the loop ends',
		'`third = 10`',
		'`grades[5] = 4` uses index 5: out of bounds',
		'c does not check it',
		'lands on `other`',
		'undefined behavior',
		'`sizeof points` gives the total in bytes',
		'only where the array is declared',
		'copies no elements',
		'`sizeof v` does not give 20',
		'the count travels separately, in `size_t n`',
		'`average: 8.00`',
		'3 rows of 4 columns',
		'`m[1][2] = 7`',
		'row-major order',
		'`sizeof m[0] = 16`',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /pointer|address|0x[0-9a-f]|malloc|free\(|heap|\*\(/i);
});

test('indexes start at 0, writes pick a cell, and the loop stays inside 0..n-1', () => {
	const declare = cuesOf('declare');
	assert.deepEqual(
		idsOf(declare, 'enter').filter((id) => /^c-\d$/.test(id)),
		['c-0', 'c-1', 'c-2', 'c-3', 'c-4'],
	);
	assert.deepEqual(
		idsOf(declare, 'enter').filter((id) => /^cv-\d-0$/.test(id)),
		['cv-0-0', 'cv-1-0', 'cv-2-0', 'cv-3-0', 'cv-4-0'],
		'= {0} sets every cell to zero',
	);

	const write = cuesOf('write');
	assert.deepEqual(stopsOf(write, 'sel'), ['a-c2', 'a-c4', 'a-c2']);
	for (const id of ['cv-0-8', 'cv-2-10', 'cv-4-9', 'ch-last', 'v-tercera', 'tv-10']) assert.ok(idsOf(write, 'enter').includes(id), `write shows ${id}`);

	// The loop: the selector visits 0..4, never index 5, and the output is typed per pass.
	const loop = cuesOf('loop');
	assert.deepEqual(stopsOf(loop, 'sel'), ['a-c0', 'a-c1', 'a-c2', 'a-c3', 'a-c4']);
	assert.deepEqual(
		idsOf(loop, 'enter').filter((id) => /^lit-c\d$/.test(id)),
		['lit-c0', 'lit-c1', 'lit-c2', 'lit-c3', 'lit-c4'],
	);
	assert.deepEqual(idsOf(loop, 'enter').filter((id) => id.startsWith('iv-')), ['iv-0', 'iv-1', 'iv-2', 'iv-3', 'iv-4', 'iv-5']);
	assert.deepEqual(idsOf(loop, 'type'), ['oa-p0', 'oa-p1', 'oa-p2', 'oa-p3', 'oa-p4', 'oa-2']);
	assert.ok(firstAt(loop, 'enter', 'ch-cond') > firstAt(loop, 'enter', 'iv-5'), 'the loop ends once i is 5');
});

test('index 5 is past the bound: the write changes the neighbour, shown as a state change', () => {
	const bound = cuesOf('bound');
	assert.deepEqual(stopsOf(bound, 'sel-x'), ['a-c5']);
	for (const id of ['eb', 'fail-b9', 'v-otra', 'ov-1', 'lit-otra', 'ov-4', 'ch-out', 'ch-ub']) assert.ok(idsOf(bound, 'enter').includes(id), `bound shows ${id}`);
	assert.ok(idsOf(bound, 'exit').includes('ov-1'), 'the old value of the neighbour is replaced');
	assert.ok(!idsOf(bound, 'exit').includes('v-otra'), 'the neighbour is not destroyed');
	assert.ok(firstAt(bound, 'enter', 'ov-4') > firstAt(bound, 'enter', 'fail-b9'));
	assert.deepEqual(idsOf(bound, 'type'), [], 'undefined behavior prints no output in the film');
});

test('sizeof counts where the array is declared; the function gets the count apart', () => {
	const count = cuesOf('count');
	assert.ok(idsOf(count, 'draw').includes('rule-all'));
	assert.ok(idsOf(count, 'draw').includes('rule-one'));
	for (const id of ['ec', 'ch-szall', 'ch-szone', 'ch-n', 'v-n']) assert.ok(idsOf(count, 'enter').includes(id), `count shows ${id}`);

	const call = cuesOf('call');
	for (const id of ['fn-prom', 'v-v', 'v-n2', 'ch-same', 'ch-szv', 'ch-len', 'v-suma']) assert.ok(idsOf(call, 'enter').includes(id), `call shows ${id}`);
	assert.ok(idsOf(call, 'draw').includes('ring-v'), 'v reaches the same cells');
	assert.ok(!idsOf(call, 'exit').some((id) => /^c-\d$/.test(id)), 'the array is not copied');
	assert.deepEqual(idsOf(call, 'enter').filter((id) => id.startsWith('su-')), ['su-0', 'su-8', 'su-14', 'su-24', 'su-31', 'su-40']);
	assert.ok(firstAt(call, 'type', 'oc-1') > firstAt(call, 'enter', 'su-40'), 'the average is printed once the sum is complete');
});

test('the matrix is laid out row after row and the camera pulls back', () => {
	const grid = cuesOf('grid');
	for (const id of ['ed', 'mx-r0', 'mx-r1', 'mx-r2', 'lit-m12', 'ch-m12']) assert.ok(idsOf(grid, 'enter').includes(id), `grid shows ${id}`);
	assert.deepEqual(idsOf(grid, 'type'), ['od-1']);

	const rows = cuesOf('rows');
	assert.deepEqual(stopsOf(rows, 'mx-r0'), ['a-r0']);
	assert.deepEqual(stopsOf(rows, 'mx-r2'), ['a-r2']);
	assert.deepEqual(idsOf(rows, 'type'), ['od-2']);
	assert.ok(idsOf(rows, 'draw').includes('rule-row'), 'sizeof m[0] measures one row');
	const lastShot = rows.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
	assert.ok(idsOf(rows, 'flow').includes('fl-rows'));
});

test('every instruction runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	const modules = ['a6', 'a7', 'a8', 'a9', 'a10', 'a12', 'a13', 'a15', 'b6', 'b7', 'b9', 'c15', 'c16', 'c18', 'c3', 'c8', 'c9', 'c11', 'd4', 'd10', 'd11'];
	for (const key of modules) {
		assert.ok(stopsOf(all, 'hl').includes(`ln-${key.slice(1)}`), `the bar reaches line ${key.slice(1)}`);
		assert.ok(stopsOf(all, 'px').includes(`a-m${key}`), `the flow visits module ${key}`);
		assert.ok(idsOf(all, 'enter').includes(`m-${key}`), `module ${key} is built`);
		assert.ok(idsOf(all, 'enter').includes(`on-${key}`), `module ${key} lights up`);
	}
	for (let line = 1; line <= 17; line++) assert.ok(idsOf(cuesOf('declare'), 'type').includes(`ea-${line}`), `line ${line} is typed`);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`el: '${id}'`)) return true;
		let match = id.match(/^(?:c-|lit-c)(\d)$/);
		if (match) return Number(match[1]) <= 4 && component.includes('`c-${cell.index}`') && component.includes('`lit-c${cell.index}`');
		match = id.match(/^(?:m-|on-|a-m)([abcd]\d+)$/);
		if (match) return component.includes(`['${match[1]}', `) && component.includes('`m-${module.key}`') && component.includes('`a-m${module.key}`');
		match = id.match(/^a-c(\d)$/);
		if (match) return Number(match[1]) <= 5 && component.includes('`a-c${index}`');
		match = id.match(/^a-r(\d)$/);
		if (match) return Number(match[1]) <= 2 && component.includes('`a-r${row}`');
		match = id.match(/^(?:mx-r|ch-f)(\d)$/);
		if (match) return Number(match[1]) <= 2 && component.includes('`mx-r${row.row}`') && component.includes('`ch-f${row}`');
		match = id.match(/^ln-(\d+)$/);
		if (match) return Number(match[1]) <= 20 && component.includes('`ln-${index + 1}`');
		match = id.match(/^ea-(\d+)$/);
		if (match) return Number(match[1]) <= 17 && component.includes('`${page.el}-${line.n}`');
		match = id.match(/^oa-p(\d)$/);
		if (match) return Number(match[1]) <= 4 && component.includes('`oa-p${index}`');
		match = id.match(/^cv-(\d)-(\d+)$/);
		if (match) return component.includes('`cv-${index}-${value}`') && component.includes(`[0, ${match[2] === '0' ? '' : match[2]}`);
		match = id.match(/^iv-(\d)$/);
		if (match) return component.includes('[0, 1, 2, 3, 4, 5]') && component.includes('`iv-${value}`');
		match = id.match(/^su-(\d+)$/);
		if (match) return component.includes('[0, 8, 14, 24, 31, 40]') && component.includes('`su-${value}`');
		return false;
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the editor holds the lesson programs, highlighted as C, and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const program = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.equal(program('programIndex').length, 17);
	assert.equal(program('programBound').length, 12);
	assert.equal(program('programAverage').length, 20);
	assert.equal(program('programMatrix').length, 13);
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the programs use C highlighting');
	for (const fragment of [
		"notas: t('notas', 'grades')",
		"cantidad: t('CANTIDAD', 'COUNT')",
		"tercera: t('tercera', 'third')",
		"otra: t('otra', 'other')",
		"puntos: t('puntos', 'points')",
		"promedio: t('promedio', 'average')",
		'`    int ${id.notas}[${id.cantidad}] = {0};`',
		'`    ${id.notas}[${id.cantidad} - 1] = 9;`',
		'`    for (size_t i = 0; i < ${id.cantidad}; i++) {`',
		'`    ${id.notas}[5] = 4;`',
		'`double ${id.promedio}(const int v[], size_t n) {`',
		'`    size_t n = sizeof ${id.puntos} / sizeof ${id.puntos}[0];`',
		"'    int m[3][4] = {'",
		// Output, as cc -std=c23 prints it.
		"['8 ', '0 ', '10 ', '0 ', '9']",
		'`${id.tercera} = 10`',
		'`${id.Promedio}: 8.00`',
		"'m[1][2] = 7'",
		"'sizeof m[0] = 16'",
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// Every line fits the editor once its identifiers are filled in, in both languages.
	const longest = {
		'${id.notas}': 'grades',
		'${id.cantidad}': 'CANTIDAD',
		'${id.tercera}': 'tercera',
		'${id.otra}': 'other',
		'${id.puntos}': 'puntos',
		'${id.promedio}': 'promedio',
		'${id.Promedio}': 'Promedio',
		'${id.suma}': 'suma',
	};
	for (const name of ['programIndex', 'programBound', 'programAverage', 'programMatrix']) {
		for (const line of program(name)) {
			let filled = line.trim().slice(1, -2);
			for (const [slot, value] of Object.entries(longest)) filled = filled.replaceAll(slot, value);
			assert.doesNotMatch(filled, /\$\{/, `unfilled slot in ${line}`);
			assert.ok(filled.length <= 64, `a program line is too long (${filled.length}): ${filled}`);
		}
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/arreglos-indices-c'/);
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
	assert.equal((component.match(/data-slug='arreglos-indices-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
