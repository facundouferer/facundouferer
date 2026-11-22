import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/busqueda-binaria-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'busqueda-binaria-c';
const LESSON = 'busqueda-en-arreglos';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '23-busqueda-en-arreglos';
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
		['linear', 'halve', 'empty', 'sorted', 'growth', 'middle'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['scan', 'miss', 'zone', 'found', 'empty', 'unsorted', 'growth', 'middle'],
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
		// 1. How does linear search work?
		'celda por celda, desde el índice 0',
		'una vez por celda',
		'`return 2` corta la búsqueda',
		// 2. How does binary search discard half?
		'`inicio` y `fin` marcan la zona donde la clave puede estar',
		'menor que 23: se descarta la mitad izquierda',
		'mayor que 23: `fin = 6`',
		'cada comparación descarta la mitad',
		// 3. Why must the array be sorted?
		'exige un arreglo ordenado',
		'descarta su propia celda',
		'el arreglo tiene que estar ordenado',
		// 4. When does it return -1?
		'ningún índice válido es negativo',
		'`inicio > fin`, la zona quedó vacía',
		'devuelve -1',
		// 5. How many steps does each need?
		'la búsqueda lineal es `o(n)`',
		'tres comparaciones en lugar de las seis',
		'lineal 1024 pasos, binaria 11',
		'un solo paso: `o(log n)`',
		// 6. Why compute mid as inicio + (fin - inicio) / 2?
		'`inicio + fin` puede superar `int_max`',
		'comportamiento indefinido',
		'`fin - inicio` sí entra',
		'`inicio + (fin - inicio) / 2` nunca pasa de `fin`',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|agregá|creá|buscá)\b/i);
	// Nothing the lesson does not teach here (pointers and bsearch come later).
	assert.doesNotMatch(all, /puntero|bsearch|qsort|malloc|\bárbol/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'cell by cell, from index 0',
		'once per cell',
		'`return 2` ends the search',
		'`low` and `high` mark the zone where the key can be',
		'less than 23: the left half is discarded',
		'greater than 23: `high = 6`',
		'each comparison discards half',
		'needs a sorted array',
		'discards its own cell',
		'the array has to be sorted',
		'no valid index is negative',
		'`low > high`, the zone is empty',
		'returns -1',
		'linear search is `o(n)`',
		'three comparisons instead of the six',
		'linear 1024 steps, binary 11',
		'a single step: `o(log n)`',
		'`low + high` can exceed `int_max`',
		'undefined behavior',
		'`high - low` does fit',
		'`low + (high - low) / 2` never goes past `high`',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /pointer|bsearch|qsort|malloc|\btree/i);
});

test('linear search: the cursor visits the cells in order and stops at the key or past the end', () => {
	const scan = cuesOf('scan');
	assert.deepEqual(
		idsOf(scan, 'enter').filter((id) => /^ca-\d$/.test(id)),
		['ca-0', 'ca-1', 'ca-2', 'ca-3', 'ca-4'],
	);
	assert.deepEqual(stopsOf(scan, 'pin-i'), ['a-ca1', 'a-ca2'], 'searching 8 stops on index 2');
	assert.deepEqual(idsOf(scan, 'enter').filter((id) => /^k-\d$/.test(id)), ['k-0', 'k-1', 'k-2', 'k-3'], 'three comparisons');
	assert.ok(idsOf(scan, 'enter').includes('hit-ca2'));
	assert.ok(firstAt(scan, 'type', 'oa-1') > firstAt(scan, 'enter', 'hit-ca2'), 'the position is printed once found');

	const miss = cuesOf('miss');
	assert.deepEqual(stopsOf(miss, 'pin-i'), ['a-ca0', 'a-ca1', 'a-ca2', 'a-ca3', 'a-ca4', 'a-ca5'], 'searching 4 visits every cell');
	assert.deepEqual(idsOf(miss, 'enter').filter((id) => /^k-[1-9]$/.test(id)), ['k-1', 'k-2', 'k-3', 'k-4', 'k-5'], 'n comparisons');
	assert.ok(firstAt(miss, 'enter', 'ch-retm1') > firstAt(miss, 'enter', 'k-5'), '-1 comes after the last comparison');
	assert.ok(idsOf(miss, 'draw').includes('fl-scan'));
	assert.ok(idsOf(miss, 'type').includes('oa-2'));
});

test('binary search: medio follows the lesson trace for 23 and 40, and the zone darkens by halves', () => {
	const found = cuesOf('zone', 'found');
	assert.deepEqual(stopsOf(found, 'pin-mid'), ['a-cb7', 'a-cb5'], 'medio is 4, then 7, then 5');
	assert.deepEqual(stopsOf(found, 'pin-lo'), ['a-cb5'], 'inicio = 5');
	assert.deepEqual(stopsOf(found, 'pin-hi'), ['a-cb6'], 'fin = 6');
	assert.deepEqual(idsOf(found, 'enter').filter((id) => id.startsWith('dim-cb')), ['dim-cb0', 'dim-cb1', 'dim-cb2', 'dim-cb3', 'dim-cb4', 'dim-cb7', 'dim-cb8', 'dim-cb9']);
	assert.ok(idsOf(found, 'enter').includes('hit-cb5'));
	assert.ok(idsOf(found, 'type').includes('ob-1'));
	assert.ok(idsOf(found, 'draw').includes('fl-jumps'));

	const empty = cuesOf('empty');
	assert.deepEqual(
		stopsOf(empty, 'pin-mid'),
		['a-cb4', 'a-cb7', 'a-cb5', 'a-cb6'],
		'searching 40 compares four cells',
	);
	assert.deepEqual(stopsOf(empty, 'pin-lo'), ['a-cb0', 'a-cb5', 'a-cb6', 'a-cb7'], 'inicio ends at 7');
	assert.deepEqual(stopsOf(empty, 'pin-hi'), ['a-cb9', 'a-cb6'], 'fin ends at 6');
	assert.ok(firstAt(empty, 'enter', 'ch-empty') > Math.max(...empty.filter((cue) => cue.el === 'pin-lo' && cue.do === 'move').map((cue) => cue.at)));
	assert.ok(firstAt(empty, 'type', 'ob-2') > firstAt(empty, 'enter', 'ch-retm1b'));
});

test('unsorted array: the first pass discards the cell that holds the key, and the search returns -1', () => {
	const cues = cuesOf('unsorted');
	assert.deepEqual(stopsOf(cues, 'pin-mid'), ['a-ca2', 'a-ca2', 'a-ca3', 'a-ca4']);
	const dims = idsOf(cues, 'enter').filter((id) => id.startsWith('dim-ca'));
	assert.deepEqual(dims, ['dim-ca0', 'dim-ca1', 'dim-ca2', 'dim-ca3', 'dim-ca4']);
	assert.ok(firstAt(cues, 'enter', 'miss-ca0') >= firstAt(cues, 'enter', 'dim-ca0'), '10 is thrown away with the left half');
	assert.ok(idsOf(cues, 'enter').includes('ch-bad'));
});

test('growth and the safe middle: towers for 1024 vs 11, the overflow, then the pull-back', () => {
	const growth = cuesOf('growth');
	for (const id of ['tw-plate', 'tw-lin', 'ch-lin', 'tw-bin', 'ch-bin', 'ch-double']) assert.ok(idsOf(growth, 'enter').includes(id), `growth shows ${id}`);
	const middle = cuesOf('middle');
	for (const id of ['ch-big', 'g-max', 'ch-max', 'g-sum', 'ch-sum', 'ch-ub', 'ch-diff', 'g-safe', 'ch-safe']) assert.ok(idsOf(middle, 'enter').includes(id), `middle shows ${id}`);
	assert.ok(firstAt(middle, 'enter', 'ch-ub') > firstAt(middle, 'enter', 'ch-sum'));
	assert.ok(stopsOf(middle, 'hl').includes('ln-7'), 'the bar returns to the line that computes medio');
	const lastShot = middle.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
	assert.ok(idsOf(middle, 'flow').includes('fl-jumps'));
});

test('every instruction runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	const modules = ['a13', 'a14', 'a15', 'a4', 'a5', 'a6', 'a16', 'a17', 'a19', 'a9', 'a20', 'b21', 'b22', 'b23', 'b4', 'b5', 'b6', 'b7', 'b8', 'b11', 'b12', 'b14', 'b9', 'b24', 'b17'];
	for (const key of modules) {
		assert.ok(stopsOf(all, 'hl').includes(`ln-${key.slice(1)}`), `the bar reaches line ${key.slice(1)}`);
		assert.ok(stopsOf(all, 'px').includes(`a-m${key}`), `the flow visits module ${key}`);
		assert.ok(idsOf(all, 'enter').includes(`m-${key}`), `module ${key} is built`);
		assert.ok(idsOf(all, 'enter').includes(`on-${key}`), `module ${key} lights up`);
	}
	for (let line = 1; line <= 23; line++) assert.ok(idsOf(cuesOf('scan'), 'type').includes(`ea-${line}`), `line ${line} is typed`);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`el: '${id}'`)) return true;
		let match = id.match(/^(?:lit-|dim-)?c([ab])-?(\d)$/);
		if (match) {
			const max = match[1] === 'a' ? 4 : 9;
			return Number(match[2]) <= max && component.includes('`${row.key}-${cell.index}`') && component.includes('`lit-${row.key}${cell.index}`') && component.includes('`dim-${row.key}${cell.index}`');
		}
		match = id.match(/^a-c([ab])(\d)$/);
		if (match) return Number(match[2]) <= (match[1] === 'a' ? 5 : 9) && component.includes('`a-c' + match[1] + '${index}`');
		match = id.match(/^(?:m-|on-|a-m)([ab]\d+)$/);
		if (match) return component.includes(`['${match[1]}', `) && component.includes('`m-${module.key}`') && component.includes('`a-m${module.key}`');
		match = id.match(/^ln-(\d+)$/);
		if (match) return Number(match[1]) <= 26 && component.includes('`ln-${index + 1}`');
		match = id.match(/^ea-(\d+)$/);
		if (match) return Number(match[1]) <= 23 && component.includes('`${page.el}-${line.n}`');
		match = id.match(/^cl-(\d+)$/);
		if (match) return component.includes('[8, 4, 23, 40, 10]') && component.includes('`cl-${value}`') && [8, 4, 23, 40, 10].includes(Number(match[1]));
		match = id.match(/^k-(\d)$/);
		if (match) return Number(match[1]) <= 5 && component.includes('`k-${value}`');
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
	assert.equal(program('programLinear').length, 23);
	assert.equal(program('programBinary').length, 26);
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the programs use C highlighting');
	for (const fragment of [
		"lineal: t('buscar_lineal', 'linear_search')",
		"binaria: t('buscar_binaria', 'binary_search')",
		"inicio: t('inicio', 'low')",
		"fin: t('fin', 'high')",
		"medio: t('medio', 'mid')",
		"'    for (int i = 0; i < n; i++) {'",
		'`        if (v[i] == ${id.clave}) {`',
		"'    return -1;'",
		'`    int ${id.numeros}[] = {10, 5, 8, 2, 7};`',
		'`    while (${id.inicio} <= ${id.fin}) {`',
		'`        int ${id.medio} = ${id.inicio} + (${id.fin} - ${id.inicio}) / 2;`',
		'`            ${id.inicio} = ${id.medio} + 1;`',
		'`            ${id.fin} = ${id.medio} - 1;`',
		"'    int v[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};'",
		// Output, as cc -std=c23 prints it.
		"t('8 está en la posición 2', '8 is at position 2')",
		"t('4 no está en el arreglo', '4 is not in the array')",
		"t('23 está en la posición 5', '23 is at position 5')",
		"t('40 devuelve -1', '40 returns -1')",
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// Every line fits the editor (68 monospace characters at 12.5px) once filled in, in both languages.
	const fill = (line, lang) => {
		let filled = line.trim().slice(1, -2);
		const longest = {
			'${id.lineal}': 'linear_search',
			'${id.binaria}': 'buscar_binaria',
			'${id.numeros}': 'numbers',
			'${id.clave}': 'clave',
			'${id.inicio}': 'inicio',
			'${id.fin}': 'high',
			'${id.medio}': 'medio',
		};
		for (const [slot, value] of Object.entries(longest)) filled = filled.replaceAll(slot, value);
		// The template doubles the backslash of the newline escape; the editor shows one.
		filled = filled.replaceAll('\\\\n', '\\n');
		return filled.replace(/\$\{t\('([^']*)', '([^']*)'\)\}/g, (_, es, en) => (lang === 'es' ? es : en));
	};
	for (const lang of ['es', 'en']) {
		for (const line of [...program('programLinear'), ...program('programBinary')]) {
			const filled = fill(line, lang);
			assert.doesNotMatch(filled, /\$\{/, `unfilled slot in ${line}`);
			assert.ok(filled.length <= 68, `a program line is too long (${filled.length}): ${filled}`);
		}
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/busqueda-binaria-c'/);
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
	assert.equal((component.match(/data-slug='busqueda-binaria-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
