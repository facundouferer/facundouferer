import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script, VALUES, RECORDS } from '../src/data/animations/ordenamiento-comparado-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'ordenamiento-comparado-c';
const LESSON = 'ordenacion-de-arreglos';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '24-ordenacion-de-arreglos';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
/** Where a bar rests: moves that lift it (`dy`) are not resting places. */
const restsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el && cue.dy === undefined).map((cue) => cue.to);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;

// The lesson's algorithms, written again here so the film is checked against them.
function counts(values, algorithm) {
	const v = [...values];
	let comparisons = 0;
	let moves = 0;
	const swap = (i, j) => {
		[v[i], v[j]] = [v[j], v[i]];
		moves++;
	};
	if (algorithm === 'bubble') {
		for (let pass = 0; pass < v.length - 1; pass++) {
			let swapped = false;
			for (let j = 0; j < v.length - 1 - pass; j++) {
				comparisons++;
				if (v[j] > v[j + 1]) {
					swap(j, j + 1);
					swapped = true;
				}
			}
			if (!swapped) break;
		}
	} else if (algorithm === 'selection') {
		for (let i = 0; i < v.length - 1; i++) {
			let min = i;
			for (let j = i + 1; j < v.length; j++) {
				comparisons++;
				if (v[j] < v[min]) min = j;
			}
			swap(i, min);
		}
	} else {
		for (let i = 1; i < v.length; i++) {
			const actual = v[i];
			let j = i - 1;
			while (j >= 0) {
				comparisons++;
				if (!(v[j] > actual)) break;
				v[j + 1] = v[j];
				moves++;
				j--;
			}
			v[j + 1] = actual;
		}
	}
	return { comparisons, moves, sorted: v };
}

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
		['bubble', 'selection', 'insertion', 'growth', 'best', 'stable'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['bubble', 'selection', 'insertion', 'growth', 'best', 'stab-sel', 'stab-ins', 'verdict'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'journey', `${step.id} plays on the single canvas`);
		assert.ok(step.motion, `${step.id} is a motion step`);
		assert.ok(step.subtitles.every((sub) => typeof sub.at === 'number'), `${step.id} pins captions`);
		assert.ok(step.motion.cues.length >= 6, `${step.id} choreographs the canvas`);
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

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// 1. What does each sort compare and swap?
		'compara cada par de vecinos',
		'`intercambiar` los cruza',
		'busca el mínimo de la parte desordenada',
		'`v[j]` con `v[minimo]`',
		'levanta `actual = v[i]`',
		'desplaza a la derecha cada elemento mayor que `actual`',
		// 2. How many swaps does selection make?
		'un solo `intercambiar` por pasada: `n - 1`, 5 en total',
		'15 comparaciones y 10 intercambios',
		// 3. Why is insertion fast on sorted input?
		'compara con el vecino y no desplaza: 5, `o(n)`',
		// 4. Why does the flag help bubble sort?
		'una sola pasada',
		'`hubo_intercambio` queda en `false`: el `break` corta en 5',
		// growth
		'con `n = 100`, 4950',
		'cuatro veces más trabajo: eso es `o(n²)`',
		// 5. What is stability?
		'estable si los iguales conservan su orden',
		'bea salta sobre ana',
		'`v[j].nota > actual.nota`: estricto',
		'7 > 7 es falso',
		// 6. Which sort is stable?
		'inserción es estable',
		'burbuja e inserción solo mueven con `>` estricto: son estables',
		'selección no lo es',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|agregá|creá|buscá)\b/i);
	// Nothing the lesson does not teach here.
	assert.doesNotMatch(all, /puntero|qsort|merge|quicksort|malloc|\bárbol/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'compares each pair of neighbors',
		'`swap` crosses them',
		'looks for the minimum of the unsorted part',
		'`v[j]` with `v[min]`',
		'lifts `key = v[i]`',
		'shifts every element larger than `key` to the right',
		'one `swap` per pass: `n - 1`, 5 in all',
		'15 comparisons, 10 swaps',
		'compares with its neighbor and shifts nothing: 5, `o(n)`',
		'a single pass',
		'`swapped` stays `false`: the `break` stops after 5',
		'with `n = 100`',
		'four times the work: that is `o(n²)`',
		'stable if equal elements keep their order',
		'bea jumps over ana',
		'`v[j].grade > key.grade`: strict',
		'7 > 7 is false',
		'insertion is stable',
		'bubble and insertion only move on a strict `>`: they are stable',
		'selection is not',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /pointer|qsort|merge|quicksort|malloc|\btree/i);
});

test('the film sorts the array of the lesson: tallies match the algorithms', () => {
	assert.deepEqual(VALUES, [29, 10, 14, 37, 13, 5]);
	const expected = { a: counts(VALUES, 'bubble'), b: counts(VALUES, 'selection'), c: counts(VALUES, 'insertion') };
	assert.deepEqual([expected.a.comparisons, expected.a.moves], [15, 10]);
	assert.deepEqual([expected.b.comparisons, expected.b.moves], [15, 5], 'selection makes exactly n - 1 swaps');
	assert.deepEqual([expected.c.comparisons, expected.c.moves], [13, 10]);
	for (const [row, step] of [['a', 'bubble'], ['b', 'selection'], ['c', 'insertion']]) {
		const cues = cuesOf(step).filter((cue) => cue.do === 'enter');
		const tiles = (kind) => cues.filter((cue) => cue.el.startsWith(`${kind}-${row}-`)).map((cue) => cue.el);
		assert.deepEqual(
			tiles('tc'),
			Array.from({ length: expected[row].comparisons }, (_, k) => `tc-${row}-${k}`),
			`row ${row} counts ${expected[row].comparisons} comparisons, one tile each, in order`,
		);
		assert.deepEqual(
			tiles('ts'),
			Array.from({ length: expected[row].moves }, (_, k) => `ts-${row}-${k}`),
			`row ${row} counts ${expected[row].moves} swaps or shifts`,
		);
	}
	// Every number row ends sorted: the resting slots of each bar, replayed.
	const all = script.steps.flatMap((step) => step.motion.cues);
	for (const row of ['a', 'b', 'c']) {
		const slotOf = VALUES.map((_, i) => i);
		for (const cue of all) {
			const match = cue.do === 'move' && cue.dy === undefined && cue.el.startsWith(`b${row}`) && cue.to.match(new RegExp(`^a-s${row}(\\d)$`));
			if (match) slotOf[Number(cue.el.slice(2))] = Number(match[1]);
		}
		const bySlot = [];
		slotOf.forEach((slot, bar) => (bySlot[slot] = VALUES[bar]));
		assert.deepEqual(bySlot, [5, 10, 13, 14, 29, 37], `row ${row} ends sorted`);
	}
	// The programs print what the film types, and the sorted rows are not touched again.
	assert.deepEqual(idsOf(cuesOf('bubble', 'selection', 'insertion'), 'type').filter((id) => id.startsWith('oa-')), ['oa-1', 'oa-2', 'oa-3', 'oa-4']);
	assert.equal(cuesOf('best').filter((cue) => cue.do === 'move' && /^b[abc]\d$/.test(cue.el)).length, 0, 'sorted input moves no bar');
});

test('bubble sort: neighbors, the swap and its flag, then early exit on sorted input', () => {
	const cues = cuesOf('bubble');
	assert.ok(firstAt(cues, 'enter', 'fg-true') > firstAt(cues, 'enter', 'fg-false'), 'the flag turns true on the first swap');
	assert.deepEqual(stopsOf(cues, 'ba0').slice(0, 1), ['a-sa1'], 'the 29 moves first, one slot toward the end');
	const best = cuesOf('best');
	assert.ok(idsOf(best, 'exit').includes('fg-true') && idsOf(best, 'enter').includes('fg-false'), 'the flag is false again');
	assert.equal(stopsOf(best, 'pin-a-j').length, 5, 'the pin visits five neighbors: 5 comparisons');
	assert.ok(stopsOf(best, 'hl').includes('ln-16') && stopsOf(best, 'hl').includes('ln-17'), 'the bar reaches the break');
	assert.ok(firstAt(best, 'enter', 'm-a17') > firstAt(best, 'move', 'pin-a-j'), 'break runs after the last comparison');
	assert.ok(idsOf(best, 'enter').includes('ch-a-best'));
});

test('selection sort: one swap per pass, even when the minimum is already in place', () => {
	const cues = cuesOf('selection');
	assert.equal(idsOf(cues, 'enter').filter((id) => /^ts-b-\d+$/.test(id)).length, 5);
	assert.deepEqual(stopsOf(cues, 'pin-b-m').slice(0, 2), ['a-pb1', 'a-pb5'], 'the first pass finds 10, then 5 as the minimum');
	assert.deepEqual(restsOf(cues, 'bb0'), ['a-sb5', 'a-sb4'], 'the 29 swaps with the 5, and ends in slot 4 when the 29 is selected last');
	assert.deepEqual(restsOf(cues, 'bb5'), ['a-sb0'], 'the 5 goes first and stays');
	assert.ok(idsOf(cues, 'pulse').includes('bb1'), 'the 10 swaps with itself: still a swap');
});

test('insertion sort: lift, shift the larger ones, drop in the gap', () => {
	const cues = cuesOf('insertion');
	assert.ok(cues.some((cue) => cue.do === 'move' && cue.el === 'bc1' && cue.dy < 0), 'the element is lifted off the row');
	assert.deepEqual(restsOf(cues, 'bc1'), ['a-sc0', 'a-sc1'], 'the 10 is dropped at the start, then shifts for the 5');
	assert.deepEqual(restsOf(cues, 'bc5'), ['a-sc0'], 'the 5 is dropped at the start after five shifts');
	assert.equal(idsOf(cues, 'enter').filter((id) => /^st-c\d$/.test(id)).length, 6, 'the sorted prefix grows to the whole row');
	const best = cuesOf('best');
	assert.equal(stopsOf(best, 'pin-c-i').length, 5, 'on sorted input each element is compared once');
});

test('growth: towers for n = 100 and 200, then the sorted case', () => {
	const growth = cuesOf('growth');
	for (const id of ['tw-plate', 'tw-100', 'ch-n100', 'tw-200', 'ch-n200', 'ch-x4']) assert.ok(idsOf(growth, 'enter').includes(id), `growth shows ${id}`);
	assert.ok(idsOf(growth, 'draw').includes('fl-grow') && idsOf(growth, 'flow').includes('fl-grow'));
	const best = cuesOf('best');
	for (const id of ['tw-sb', 'tw-ss', 'tw-si', 'ch-sb', 'ch-ss', 'ch-si']) assert.ok(idsOf(best, 'enter').includes(id), `the sorted case shows ${id}`);
});

test('stability: selection reorders Bea and Ana, insertion keeps them', () => {
	assert.deepEqual(RECORDS, [7, 7, 5]);
	const selection = cuesOf('stab-sel');
	assert.deepEqual(restsOf(selection, 'bd0'), ['a-sd2'], 'Bea jumps to the end');
	assert.deepEqual(restsOf(selection, 'bd2'), ['a-sd0'], 'Ciro goes first');
	assert.deepEqual(restsOf(selection, 'bd1'), [], 'Ana never moves');
	assert.ok(firstAt(selection, 'enter', 'ch-d-jump') > firstAt(selection, 'enter', 'ch-d-order'));
	assert.ok(firstAt(selection, 'type', 'os-1') > firstAt(selection, 'move', 'bd0'));
	assert.ok(idsOf(selection, 'enter').includes('hot-bd0') && idsOf(selection, 'enter').includes('hot-bd1'));

	const insertion = cuesOf('stab-ins');
	assert.deepEqual(restsOf(insertion, 'be1'), ['a-se1', 'a-se2'], 'Ana stays, then shifts one slot for Ciro');
	assert.deepEqual(restsOf(insertion, 'be0'), ['a-se1'], 'Bea only moves when Ciro is inserted');
	assert.deepEqual(restsOf(insertion, 'be2'), ['a-se0'], 'Ciro lands first');
	assert.ok(idsOf(insertion, 'enter').includes('ch-e-strict'));
	assert.ok(idsOf(insertion, 'type').includes('os-2'));

	const verdict = cuesOf('verdict');
	for (const id of ['ch-v-a', 'ch-v-b', 'ch-v-c']) assert.ok(idsOf(verdict, 'enter').includes(id), `the verdict shows ${id}`);
	const lastShot = verdict.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all'], 'the film ends pulled back on the whole system');
});

test('every instruction runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	const modules = {
		a: [2, 3, 4, 8, 9, 10, 11, 12, 13, 16, 17],
		b: [2, 3, 4, 8, 9, 10, 11, 12, 15],
		c: [2, 3, 4, 5, 6, 7, 9],
		d: [7, 8, 9, 10, 11, 14, 15, 16],
		e: [2, 3, 4, 5, 6, 7, 9],
	};
	for (const [row, lines] of Object.entries(modules)) {
		for (const line of lines) {
			const key = `${row}${line}`;
			assert.ok(stopsOf(all, 'hl').includes(`ln-${line}`), `the bar reaches line ${line}`);
			assert.ok(stopsOf(all, 'px').includes(`a-m${key}`), `the flow visits module ${key}`);
			assert.ok(idsOf(all, 'enter').includes(`m-${key}`), `module ${key} is built`);
			assert.ok(idsOf(all, 'enter').includes(`on-${key}`), `module ${key} lights up`);
		}
	}
	// A module only pulses while it is on the stage: built before, and not faded since.
	const onStage = new Set();
	for (const cue of all) {
		if (cue.do === 'enter' && cue.el?.startsWith('m-')) onStage.add(cue.el);
		if (cue.do === 'exit' && cue.el?.startsWith('m-')) onStage.delete(cue.el);
		if (cue.do === 'pulse' && cue.el.startsWith('m-')) assert.ok(onStage.has(cue.el), `${cue.el} pulses while hidden`);
	}
	for (let line = 1; line <= 20; line++) assert.ok(idsOf(cuesOf('bubble'), 'type').includes(`ea-${line}`), `line ${line} is typed`);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const block = component.split('const moduleLines')[1].split('const moduleAt')[0];
	const moduleKeys = new Set();
	for (const m of block.matchAll(/\t([a-e]): \[([\s\S]*?)\n\t\],/g)) for (const n of m[2].matchAll(/\[(\d+), '/g)) moduleKeys.add(m[1] + n[1]);
	const rowSize = { a: 6, b: 6, c: 6, d: 3, e: 3 };
	const tally = { a: [15, 10], b: [15, 5], c: [13, 10] };

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`el: '${id}'`)) return true;
		let match = id.match(/^(fl|st)-([a-e])(\d)$/);
		if (match) return Number(match[3]) < rowSize[match[2]] && component.includes('`fl-${row.row}${cell.k}`') && component.includes('`st-${row.row}${cell.k}`');
		match = id.match(/^(?:lit-|hot-)?b([a-e])(\d)$/);
		if (match) return Number(match[2]) < rowSize[match[1]] && component.includes('id: `b${row}${i}`') && component.includes('`lit-${bar.id}`') && component.includes('`hot-${bar.id}`');
		match = id.match(/^a-s([a-e])(\d)$/);
		if (match) return Number(match[2]) < rowSize[match[1]] && component.includes('`a-s${row}${k}`');
		match = id.match(/^a-p([abc])(\d)$/);
		if (match) return Number(match[2]) < 6 && component.includes('`a-p${row}${k}`');
		match = id.match(/^tally-([abc])$/);
		if (match) return component.includes('`tally-${strip.row}`');
		match = id.match(/^t([cs])-([abc])-(\d+)$/);
		if (match) return Number(match[3]) < tally[match[2]][match[1] === 'c' ? 0 : 1] && component.includes('`t' + match[1] + '-${strip.row}-${cell.k}`');
		match = id.match(/^ch-([abc])-t([cs])$/);
		if (match) return component.includes('`ch-${strip.row}-t' + match[2] + '`');
		match = id.match(/^(?:m-|on-|a-m)([a-e]\d+)$/);
		if (match) return moduleKeys.has(match[1]) && component.includes('`m-${module.key}`') && component.includes('`a-m${module.key}`');
		match = id.match(/^ln-(\d+)$/);
		if (match) return Number(match[1]) <= 20 && component.includes('`ln-${index + 1}`');
		match = id.match(/^ea-(\d+)$/);
		if (match) return Number(match[1]) <= 20 && component.includes('`${page.el}-${line.n}`');
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
	// The swap function is spread in front of the bubble and selection programs (5 lines and a blank).
	assert.ok(component.includes("const swapFunction = [`void ${nm.swap}(int v[], int i, int j) {`, `    int ${nm.tmp} = v[i];`, '    v[i] = v[j];', `    v[j] = ${nm.tmp};`, '}', ''];"), 'the swap function of the lesson');
	assert.equal(program('programBubble').length, 1 + 14);
	assert.equal(program('programSelection').length, 1 + 11);
	assert.equal(program('programInsertion').length, 11);
	assert.equal(program('programStudentSelection').length, 18);
	assert.equal(program('programStudentInsertion').length, 11);
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the programs use C highlighting');
	for (const fragment of [
		"swap: t('intercambiar', 'swap')",
		"bubble: t('ordenar_burbuja', 'bubble_sort')",
		"selection: t('ordenar_seleccion', 'selection_sort')",
		"insertion: t('ordenar_insercion', 'insertion_sort')",
		"flag: t('hubo_intercambio', 'swapped')",
		"min: t('minimo', 'min')",
		"key: t('actual', 'key')",
		"student: t('Alumno', 'Student')",
		"grade: t('nota', 'grade')",
		'`void ${nm.swap}(int v[], int i, int j) {`',
		'`    for (int ${nm.pass} = 0; ${nm.pass} < n - 1; ${nm.pass}++) {`',
		'`        bool ${nm.flag} = false;`',
		"'            if (v[j] > v[j + 1]) {'",
		'`                ${nm.swap}(v, j, j + 1);`',
		'`        if (!${nm.flag}) {`',
		"'            break;'",
		'`            if (v[j] < v[${nm.min}]) {`',
		'`        ${nm.swap}(v, i, ${nm.min});`',
		'`        while (j >= 0 && v[j] > ${nm.key}) {`',
		"'            v[j + 1] = v[j];'",
		'`            if (v[j].${nm.grade} < v[${nm.min}].${nm.grade}) {`',
		'`        while (j >= 0 && v[j].${nm.grade} > ${nm.key}.${nm.grade}) {`',
		// Output, as cc -std=c23 prints it (both lessons print the same data).
		"t('original:  29 10 14 37 13 5', 'original:  29 10 14 37 13 5')",
		"t('burbuja:   5 10 13 14 29 37', 'bubble:    5 10 13 14 29 37')",
		"t('seleccion: 5 10 13 14 29 37', 'selection: 5 10 13 14 29 37')",
		"t('insercion: 5 10 13 14 29 37', 'insertion: 5 10 13 14 29 37')",
		"t('seleccion: Ciro(5) Ana(7) Bea(7)', 'selection: Ciro(5) Ana(7) Bea(7)')",
		"t('insercion: Ciro(5) Bea(7) Ana(7)', 'insertion: Ciro(5) Bea(7) Ana(7)')",
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// Every line fits the editor (68 monospace characters at 12.5px) once filled in, in both languages.
	const names = {
		es: { swap: 'intercambiar', tmp: 'aux', bubble: 'ordenar_burbuja', selection: 'ordenar_seleccion', insertion: 'ordenar_insercion', pass: 'pasada', flag: 'hubo_intercambio', min: 'minimo', key: 'actual', student: 'Alumno', name: 'nombre', grade: 'nota', selGrade: 'ordenar_seleccion_por_nota', insGrade: 'ordenar_insercion_por_nota' },
		en: { swap: 'swap', tmp: 'tmp', bubble: 'bubble_sort', selection: 'selection_sort', insertion: 'insertion_sort', pass: 'pass', flag: 'swapped', min: 'min', key: 'key', student: 'Student', name: 'name', grade: 'grade', selGrade: 'selection_sort_by_grade', insGrade: 'insertion_sort_by_grade' },
	};
	for (const lang of ['es', 'en']) {
		for (const name of ['programBubble', 'programSelection', 'programInsertion', 'programStudentSelection', 'programStudentInsertion']) {
			for (const line of program(name)) {
				const filled = line.trim().replace(/,$/, '').replace(/^[`']|[`']$/g, '').replace(/\$\{nm\.(\w+)\}/g, (_, key) => names[lang][key]);
				if (filled.startsWith('...')) continue;
				assert.doesNotMatch(filled, /\$\{/, `unfilled slot in ${line}`);
				assert.ok(filled.length <= 68, `a program line is too long (${filled.length}): ${filled}`);
			}
		}
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/ordenamiento-comparado-c'/);
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
	assert.equal((component.match(/data-slug='ordenamiento-comparado-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
