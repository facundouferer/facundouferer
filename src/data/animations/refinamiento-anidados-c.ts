import type { AnimationScript, MotionCue, Subtitle } from './types';

// "From problem to program, step by step": a short film (about two minutes) for the C
// lesson "Programación Esquemática" (`programacion-esquematica-y-sentencias-anidadas`).
// It plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/refinamiento-anidados-c.astro`). The upper half is the
// refinement: the problem plate splits into the four level-1 steps, each step into
// level-2 tiles, and every tile receives the modules of its C lines. The lower half is
// a loop machine: an outer track that carries an inner track, with the counters, the
// table the two loops fill and the flag that leaves both loops. The editor on the left
// swaps between the pseudocode and the lesson's four programs; a light blue particle is
// the execution flow and a bar slides to the running line.

const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

/**
 * Pins captions on the step timeline: each one starts once the previous has been
 * read (same formula as `subtitleReadingTime`, for the slower locale) plus a pause.
 * Cues are placed relative to those starts to stay in sync with what is being said.
 */
const readingMs = (sub: Subtitle) => 1200 + Math.max(sub.text.es.length, sub.text.en.length) * 55;
function timed(...subs: Subtitle[]) {
	let at = 0;
	const starts: number[] = [];
	const list = subs.map((sub) => {
		starts.push(at);
		const placed: Subtitle = { ...sub, at };
		at += readingMs(sub) + 200;
		return placed;
	});
	return { list, start: (index: number) => starts[index] ?? 0 };
}

/** Cues in chronological order: later cues must be scheduled after the ones they override. */
const seq = (...cues: (MotionCue | MotionCue[])[]): MotionCue[] =>
	cues
		.flat()
		.map((cue, index) => ({ cue, index }))
		.sort((a, b) => a.cue.at - b.cue.at || a.index - b.index)
		.map((entry) => entry.cue);

/** Camera cue that frames one of the `shot-*` anchors exactly (they carry their own zoom). */
const shot = (at: number, to: string, dur: number): MotionCue => ({ at, do: 'camera', to: [to], dur, pad: 0 });

/** The particle and the editor bar travel together to the module `key` of editor line `line`. */
const runTo = (at: number, key: string, line: number, dur = 600): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a-${key}`, dur },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 500) },
];

/** A counter shows a new value: the old text leaves, the new one enters. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 150 },
	{ at: at + 100, do: 'enter', el: to, dur: 200 },
];

/** One pass of the inner loop of the table: check `j`, then print the cell `i * j`. */
function innerPass(at: number, row: number, col: number, hop: number): MotionCue[] {
	return [
		...runTo(at, 't5', 5, hop),
		...(col > 1 ? swap(at + hop - 150, `jv-${col - 1}`, `jv-${col}`) : [{ at: at + hop - 100, do: 'enter', el: `jv-${col}`, dur: 200 } as MotionCue]),
		...runTo(at + hop, 't6', 6, hop),
		{ at: at + 2 * hop - 100, do: 'enter', el: `g-${row}-${col}`, dur: 250 },
		{ at: at + 2 * hop - 100, do: 'type', el: `o-${row}-${col}`, dur: 150 },
	];
}

// ─── Captions ───────────────────────────────────────────────────────────────
const statement = timed(
	say('Enunciado: mostrar los primos de 2 a `n` y, al final, cuántos hay.', 'Problem statement: print the primes from 2 to `n` and, at the end, how many.'),
	say('El refinamiento sucesivo va de lo general a lo particular, por niveles.', 'Stepwise refinement goes from the general to the specific, in levels.'),
	say('El nivel 1 dice qué hay que hacer, en cuatro pasos grandes.', 'Level 1 says what has to be done, in four big steps.'),
);
const levels = timed(
	say('Ya se ven los esquemas: secuencia, iteración y selección.', 'The schemes already show: sequence, iteration and selection.'),
	say('El nivel 2 descompone cada paso en pasos más pequeños.', 'Level 2 breaks each step into smaller ones.'),
	say('¿Es primo? Probar divisores `d` mientras `d * d <= k`.', 'Is it prime? Try divisors `d` while `d * d <= k`.'),
);
const translate = timed(
	say('Cada línea del nivel 2 tiene una traducción directa a C.', 'Each line of level 2 has a direct translation into C.'),
	say('Cada paso pequeño se vuelve una instrucción, con su línea en el editor.', 'Each small step becomes a statement, with its line in the editor.'),
	say('Con `n` = 20 muestra 8 primos. El `break` sale solo del ciclo de `d`.', 'With `n` = 20 it prints 8 primes. The `break` leaves only the `d` loop.'),
);
const table = timed(
	say('En un ciclo anidado, el interno se ejecuta completo en cada vuelta del externo.', 'In a nested loop, the inner one runs completely on each pass of the outer one.'),
	say('El externo recorre las filas con `i`; el interno, las columnas con `j`.', 'The outer loop walks the rows with `i`; the inner one, the columns with `j`.'),
);
const trace = timed(
	say('La variable externa solo cambia cuando el interno terminó: `i` pasa a 2.', 'The outer variable only changes when the inner loop has finished: `i` becomes 2.'),
	say('Y `j` vuelve a empezar desde 1: el `for` interno se inicializa otra vez.', 'And `j` starts again from 1: the inner `for` is initialized again.'),
	say('5 filas por 5 columnas: el cuerpo interno se ejecuta 5 × 5 = 25 veces.', '5 rows by 5 columns: the inner body runs 5 × 5 = 25 times.'),
);
const triangle = timed(
	say('El límite del interno puede depender de la variable del externo: `col <= fila`.', 'The inner limit can depend on the outer variable: `col <= row`.'),
	say('La fila 1 da 1 vuelta y la fila 4, cuatro: 1 + 2 + 3 + 4 = 10 vueltas.', 'Row 1 makes 1 pass and row 4, four: 1 + 2 + 3 + 4 = 10 passes.'),
);
const found = timed(
	say('Buscar 42 en la tabla del 1 al 9: `encontrado` empieza en `false`.', 'Search for 42 in the 1 to 9 table: `found` starts as `false`.'),
	say('Con `i` = 6 y `j` = 7 lo encuentra, y `break` sale solo del ciclo de `j`.', 'With `i` = 6 and `j` = 7 it finds it, and `break` leaves only the `j` loop.'),
	say('La condición `!encontrado` corta también el externo: muestra 42 = 6 x 7.', 'The condition `!found` ends the outer loop too: it prints 42 = 6 x 7.'),
);
const close = timed(
	say('Para salir de dos ciclos, una variable de control en la condición del externo.', 'To leave two loops, a control variable in the condition of the outer one.'),
	say('Y antes del código, el pseudocódigo: separa qué hace el programa de cómo se escribe.', 'And before the code, the pseudocode: it separates what the program does from how it is written.'),
);

// ─── Level 2: the tiles of each row, with their pseudocode and C lines ─────
// Keep in sync with `rows` in the component (tile ids `tl-<row>-<index>`).
const tiles = [
	{ id: 'tl-0-0', ps: 1, lines: [4, 5, 6] },
	{ id: 'tl-0-1', ps: 2, lines: [7, 8] },
	{ id: 'tl-1-0', ps: 4, lines: [10] },
	{ id: 'tl-1-1', ps: 5, lines: [11] },
	{ id: 'tl-2-0', ps: 6, lines: [12] },
	{ id: 'tl-2-1', ps: 7, lines: [13] },
	{ id: 'tl-2-2', ps: 8, lines: [14, 15, 16] },
	{ id: 'tl-2-3', ps: 11, lines: [19, 20, 21] },
	{ id: 'tl-3-0', ps: 14, lines: [24, 25] },
];

/** Level 2 appears tile by tile while the bar walks the pseudocode. */
const tileCues = (from: number, gap: number): MotionCue[] =>
	tiles.flatMap((tile, index) => [
		{ at: from + index * gap, do: 'move', el: 'hl', to: `ln-${tile.ps}`, dur: Math.min(gap - 50, 400) } as MotionCue,
		{ at: from + index * gap + 200, do: 'enter', el: tile.id, dur: 300 } as MotionCue,
	]);

/** Then every tile receives the modules of its C lines. */
const moduleCues = (from: number, gap: number): MotionCue[] =>
	tiles.flatMap((tile, index) => [
		{ at: from + index * gap, do: 'move', el: 'hl', to: `ln-${tile.lines[0]}`, dur: Math.min(gap - 50, 400) } as MotionCue,
		...tile.lines.map((line, k) => ({ at: from + index * gap + 150 + k * 80, do: 'enter', el: `m-p${line}`, dur: 300 }) as MotionCue),
	]);

// Table: the first row, pass by pass (hop = one particle move).
const HOP = 420;
const ROW1 = table.start(1) + 600;
const row1 = [1, 2, 3, 4, 5].flatMap((col) => innerPass(ROW1 + 1000 + (col - 1) * 2 * HOP, 1, col, HOP));
const ROW1_END = ROW1 + 1000 + 10 * HOP;

// Trace: the second row, faster.
const HOP2 = 330;
const ROW2 = trace.start(1) + 400;
const row2 = [1, 2, 3, 4, 5].flatMap((col) => innerPass(ROW2 + (col - 1) * 2 * HOP2, 2, col, HOP2));
const ROW2_END = ROW2 + 10 * HOP2;

/** Rows 3 to 5 of the table: the outer header, one whole inner run, the newline. */
function fullRow(at: number, row: number): MotionCue[] {
	return [
		...runTo(at, 't4', 4, 300),
		...swap(at + 200, `iv-${row - 1}`, `iv-${row}`),
		...runTo(at + 300, 't5', 5, 300),
		...swap(at + 500, 'jv-5', 'jv-1'),
		...runTo(at + 600, 't6', 6, 300),
		...swap(at + 750, 'jv-1', 'jv-5'),
		{ at: at + 800, do: 'enter', el: `g-r${row}`, dur: 300 },
		{ at: at + 800, do: 'type', el: `o-r${row}`, dur: 300 },
		...runTo(at + 900, 't8', 8, 300),
	];
}

/** A row of the triangle: `fila` takes its value, `col` counts up to it. */
function triangleRow(at: number, row: number): MotionCue[] {
	return [
		...runTo(at, 't4', 4, 350),
		...(row > 1 ? swap(at + 250, `iv-${row - 1}`, `iv-${row}`) : [{ at: at + 250, do: 'enter', el: 'iv-1', dur: 200 } as MotionCue]),
		...runTo(at + 350, 't5', 5, 350),
		...(row > 1 ? swap(at + 600, `jv-${row - 1}`, 'jv-1') : [{ at: at + 600, do: 'enter', el: 'jv-1', dur: 200 } as MotionCue]),
		...runTo(at + 700, 't6', 6, 350),
		...(row > 1 ? swap(at + 900, 'jv-1', `jv-${row}`) : []),
		{ at: at + 950, do: 'enter', el: `tr-${row}`, dur: 300 },
		{ at: at + 950, do: 'type', el: `ot-${row}`, dur: 250 },
		...runTo(at + 1050, 't8', 8, 350),
	];
}

const T_ROWS = triangle.start(0) + 2600;

// Search: rows 1 to 5 pass in a time-lapse; row 6 is followed until j = 7.
const F_LAPSE = found.start(1) - 2400;

export const script: AnimationScript = {
	chapters: [
		{ id: 'refine', label: { es: 'De lo general a lo particular', en: 'From the general to the specific' } },
		{ id: 'translate', label: { es: 'Del pseudocódigo a C', en: 'From pseudocode to C' } },
		{ id: 'nested', label: { es: 'Un ciclo dentro de otro', en: 'A loop inside another' } },
		{ id: 'trace', label: { es: 'Cómo cambian i y j', en: 'How i and j change' } },
		{ id: 'depends', label: { es: 'El interno depende del externo', en: 'The inner depends on the outer' } },
		{ id: 'exit', label: { es: 'Salir de dos ciclos', en: 'Leaving two loops' } },
	],
	steps: [
		// ─── Scene 1. From the general to the specific ──────────────────────
		{
			id: 'statement',
			chapter: 'refine',
			scene: 'journey',
			title: { es: 'Un problema, cuatro pasos', en: 'One problem, four steps' },
			subtitles: statement.list,
			motion: {
				cues: seq(
					shot(0, 'shot-problem', 2400),
					{ at: 200, do: 'enter', el: 'fn-ps' },
					{ at: 400, do: 'enter', el: 'prob', dur: 700 },
					{ at: 1100, do: 'type', el: 'lb-prob', dur: 1200 },
					{ at: 2600, do: 'pulse', el: 'prob' },
					shot(statement.start(1), 'shot-refine', 2400),
					{ at: statement.start(1) + 600, do: 'draw', el: 'sp-0', dur: 600 },
					{ at: statement.start(1) + 800, do: 'draw', el: 'sp-1', dur: 700 },
					{ at: statement.start(1) + 1000, do: 'draw', el: 'sp-2', dur: 800 },
					{ at: statement.start(1) + 1200, do: 'draw', el: 'sp-3', dur: 900 },
					{ at: statement.start(2), do: 'enter', el: 'ed-l1' },
					{ at: statement.start(2), do: 'enter', el: 'hl' },
					{ at: statement.start(2) + 200, do: 'enter', el: 'r0', dur: 500 },
					{ at: statement.start(2) + 800, do: 'move', el: 'hl', to: 'ln-2', dur: 400 },
					{ at: statement.start(2) + 900, do: 'enter', el: 'r1', dur: 500 },
					{ at: statement.start(2) + 1500, do: 'move', el: 'hl', to: 'ln-3', dur: 400 },
					{ at: statement.start(2) + 1600, do: 'enter', el: 'r2', dur: 500 },
					{ at: statement.start(2) + 2200, do: 'move', el: 'hl', to: 'ln-4', dur: 400 },
					{ at: statement.start(2) + 2300, do: 'enter', el: 'r3', dur: 500 },
				),
			},
		},
		{
			id: 'levels',
			chapter: 'refine',
			scene: 'journey',
			title: { es: 'Cada paso se divide', en: 'Each step is split' },
			subtitles: levels.list,
			motion: {
				cues: seq(
					{ at: 200, do: 'enter', el: 'tg-seq' },
					{ at: 900, do: 'move', el: 'hl', to: 'ln-2', dur: 400 },
					{ at: 1000, do: 'enter', el: 'tg-iter' },
					{ at: 1100, do: 'pulse', el: 'r1' },
					{ at: 1900, do: 'move', el: 'hl', to: 'ln-3', dur: 400 },
					{ at: 2000, do: 'enter', el: 'tg-sel' },
					{ at: 2100, do: 'pulse', el: 'r2' },
					{ at: levels.start(1), do: 'exit', el: 'ed-l1', dur: 300 },
					{ at: levels.start(1) + 300, do: 'enter', el: 'ed-l2' },
					...tileCues(levels.start(1) + 500, 440),
					{ at: levels.start(2) + 300, do: 'move', el: 'hl', to: 'ln-7', dur: 500 },
					{ at: levels.start(2) + 700, do: 'pulse', el: 'tl-2-1' },
					{ at: levels.start(2) + 900, do: 'enter', el: 'lb-div' },
				),
			},
		},

		// ─── Scene 2. From pseudocode to C ──────────────────────────────────
		{
			id: 'translate',
			chapter: 'translate',
			scene: 'journey',
			title: { es: 'Cada paso, una instrucción', en: 'Each step, a statement' },
			subtitles: translate.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-div', dur: 300 },
					{ at: 0, do: 'exit', el: 'ed-l2', dur: 300 },
					{ at: 0, do: 'exit', el: 'fn-ps', dur: 300 },
					{ at: 300, do: 'enter', el: 'fn-primes' },
					{ at: 300, do: 'enter', el: 'ed-primes' },
					...moduleCues(translate.start(1) - 1800, 460),
					// The program runs with n = 20: read, try every k, print the primes and the count.
					{ at: translate.start(2), do: 'move', el: 'p', to: 'a-p6', dur: 1 },
					{ at: translate.start(2) + 50, do: 'enter', el: 'p' },
					{ at: translate.start(2) + 50, do: 'move', el: 'hl', to: 'ln-6', dur: 400 },
					{ at: translate.start(2) + 300, do: 'type', el: 'out-p1', dur: 600 },
					...runTo(translate.start(2) + 900, 'p11', 11, 500),
					...runTo(translate.start(2) + 1400, 'p13', 13, 450),
					...runTo(translate.start(2) + 1850, 'p16', 16, 450),
					{ at: translate.start(2) + 2300, do: 'enter', el: 'hx-16' },
					{ at: translate.start(2) + 2300, do: 'enter', el: 'on-p16' },
					...runTo(translate.start(2) + 2500, 'p20', 20, 500),
					{ at: translate.start(2) + 3000, do: 'type', el: 'out-p2', dur: 700 },
					...runTo(translate.start(2) + 3700, 'p24', 24, 500),
					{ at: translate.start(2) + 4200, do: 'type', el: 'out-p3', dur: 600 },
				),
			},
		},

		// ─── Scene 3. A loop inside another ─────────────────────────────────
		{
			id: 'table',
			chapter: 'nested',
			scene: 'journey',
			title: { es: 'La tabla de multiplicar', en: 'The multiplication table' },
			subtitles: table.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'out-pr', dur: 400 },
					{ at: 0, do: 'exit', el: 'hx-16', dur: 400 },
					{ at: 0, do: 'exit', el: 'on-p16', dur: 400 },
					{ at: 0, do: 'exit', el: 'ed-primes', dur: 300 },
					{ at: 0, do: 'exit', el: 'fn-primes', dur: 300 },
					{ at: 300, do: 'enter', el: 'fn-table' },
					{ at: 300, do: 'enter', el: 'ed-table' },
					shot(200, 'shot-loops', 2400),
					{ at: 600, do: 'draw', el: 'rg-outer', dur: 1200 },
					{ at: 1400, do: 'enter', el: 'plat', dur: 600 },
					{ at: 1800, do: 'draw', el: 'rg-inner', dur: 900 },
					{ at: 2300, do: 'enter', el: 'm-t4' },
					{ at: 2500, do: 'enter', el: 'm-t5' },
					{ at: 2700, do: 'enter', el: 'm-t6' },
					{ at: 2900, do: 'enter', el: 'm-t8' },
					{ at: 3100, do: 'enter', el: 'm-t10' },
					{ at: 3300, do: 'enter', el: 'lb-outer' },
					{ at: 3600, do: 'enter', el: 'lb-inner' },
					{ at: table.start(1), do: 'enter', el: 'c-i' },
					{ at: table.start(1) + 200, do: 'enter', el: 'c-j' },
					{ at: table.start(1) + 400, do: 'enter', el: 'grid', dur: 600 },
					...runTo(ROW1, 't4', 4, 900),
					{ at: ROW1 + 800, do: 'enter', el: 'iv-1', dur: 200 },
					...row1,
					...runTo(ROW1_END, 't8', 8, HOP),
					{ at: ROW1_END + HOP, do: 'pulse', el: 'm-t8' },
				),
			},
		},

		// ─── Scene 4. How i and j change ────────────────────────────────────
		{
			id: 'trace',
			chapter: 'trace',
			scene: 'journey',
			title: { es: 'i espera, j vuelve a 1', en: 'i waits, j starts over' },
			subtitles: trace.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-outer', dur: 300 },
					{ at: 0, do: 'exit', el: 'lb-inner', dur: 300 },
					shot(100, 'shot-rings', 1600),
					...runTo(500, 't4', 4, 700),
					...swap(1100, 'iv-1', 'iv-2'),
					{ at: 1300, do: 'pulse', el: 'c-i' },
					// The inner for starts again: j goes back to 1.
					{ at: trace.start(1) - 300, do: 'exit', el: 'jv-5', dur: 150 },
					{ at: trace.start(1), do: 'enter', el: 'lb-reset' },
					...row2,
					...runTo(ROW2_END, 't8', 8, HOP2),
					// Rows 3 to 5, and the count of inner passes.
					shot(trace.start(2) - 600, 'shot-grid', 1400),
					{ at: trace.start(2) - 600, do: 'exit', el: 'lb-reset', dur: 300 },
					{ at: trace.start(2) - 400, do: 'flow', el: 'rg-inner' },
					...fullRow(trace.start(2) - 300, 3),
					...fullRow(trace.start(2) + 900, 4),
					...fullRow(trace.start(2) + 2100, 5),
					{ at: trace.start(2) + 3400, do: 'enter', el: 'lb-25' },
					{ at: trace.start(2) + 3700, do: 'pulse', el: 'grid' },
				),
			},
		},

		// ─── Scene 5. The inner depends on the outer ────────────────────────
		{
			id: 'triangle',
			chapter: 'depends',
			scene: 'journey',
			title: { es: 'Un límite que cambia', en: 'A limit that changes' },
			subtitles: triangle.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-25', dur: 300 },
					{ at: 0, do: 'exit', el: 'tbl', dur: 400 },
					{ at: 0, do: 'exit', el: 'out-tbl', dur: 400 },
					{ at: 0, do: 'exit', el: 'iv-5', dur: 200 },
					{ at: 0, do: 'exit', el: 'jv-5', dur: 200 },
					{ at: 0, do: 'exit', el: 'ed-table', dur: 300 },
					{ at: 0, do: 'exit', el: 'fn-table', dur: 300 },
					{ at: 300, do: 'enter', el: 'fn-tri' },
					{ at: 300, do: 'enter', el: 'ed-tri' },
					{ at: 300, do: 'exit', el: 'nm-i', dur: 200 },
					{ at: 300, do: 'exit', el: 'nm-j', dur: 200 },
					{ at: 500, do: 'enter', el: 'nm-row' },
					{ at: 500, do: 'enter', el: 'nm-col' },
					shot(300, 'shot-loops', 1600),
					{ at: 700, do: 'move', el: 'hl', to: 'ln-5', dur: 500 },
					{ at: 1200, do: 'draw', el: 'dep', dur: 900 },
					{ at: 1800, do: 'enter', el: 'lb-dep' },
					...[1, 2, 3, 4].flatMap((row) => triangleRow(T_ROWS + (row - 1) * 1500, row)),
					{ at: triangle.start(1) + 2800, do: 'enter', el: 'lb-10' },
					{ at: triangle.start(1) + 3200, do: 'pulse', el: 'tri' },
				),
			},
		},

		// ─── Scene 6. Leaving two loops ─────────────────────────────────────
		{
			id: 'found',
			chapter: 'exit',
			scene: 'journey',
			title: { es: 'Una bandera corta los dos ciclos', en: 'A flag ends both loops' },
			subtitles: found.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-dep', dur: 300 },
					{ at: 0, do: 'exit', el: 'dep', dur: 300 },
					{ at: 0, do: 'exit', el: 'lb-10', dur: 300 },
					{ at: 0, do: 'exit', el: 'tri', dur: 400 },
					{ at: 0, do: 'exit', el: 'out-tri', dur: 400 },
					{ at: 0, do: 'exit', el: 'grid', dur: 400 },
					{ at: 0, do: 'exit', el: 'iv-4', dur: 200 },
					{ at: 0, do: 'exit', el: 'jv-4', dur: 200 },
					{ at: 0, do: 'exit', el: 'nm-row', dur: 200 },
					{ at: 0, do: 'exit', el: 'nm-col', dur: 200 },
					{ at: 0, do: 'exit', el: 'ed-tri', dur: 300 },
					{ at: 0, do: 'exit', el: 'fn-tri', dur: 300 },
					...['t4', 't5', 't6', 't8', 't10'].map((key) => ({ at: 100, do: 'exit', el: `m-${key}`, dur: 300 }) as MotionCue),
					{ at: 300, do: 'enter', el: 'fn-found' },
					{ at: 300, do: 'enter', el: 'ed-found' },
					{ at: 300, do: 'enter', el: 'nm-i' },
					{ at: 300, do: 'enter', el: 'nm-j' },
					...['f4', 'f5', 'f6', 'f7', 'f9', 'f10', 'f11', 'f12', 'f13', 'f14', 'f15', 'f20', 'f21', 'f23', 'f25'].map(
						(key, index) => ({ at: 500 + index * 90, do: 'enter', el: `m-${key}`, dur: 300 }) as MotionCue,
					),
					{ at: 1400, do: 'enter', el: 'c-flag', dur: 500 },
					...runTo(1700, 'f5', 5, 900),
					{ at: 2600, do: 'enter', el: 'fv-0', dur: 200 },
					{ at: 2700, do: 'pulse', el: 'c-flag' },
					// Rows 1 to 5 in a time-lapse: the inner loop runs to 9 without a match.
					...runTo(F_LAPSE, 'f9', 9, 500),
					{ at: F_LAPSE + 500, do: 'enter', el: 'iv-1', dur: 150 },
					{ at: F_LAPSE + 500, do: 'flow', el: 'rg-outer' },
					...runTo(F_LAPSE + 600, 'f10', 10, 400),
					...swap(F_LAPSE + 900, 'iv-1', 'iv-2'),
					...swap(F_LAPSE + 1200, 'iv-2', 'iv-3'),
					...runTo(F_LAPSE + 1000, 'f11', 11, 400),
					...swap(F_LAPSE + 1500, 'iv-3', 'iv-4'),
					...runTo(F_LAPSE + 1400, 'f10', 10, 400),
					...swap(F_LAPSE + 1800, 'iv-4', 'iv-5'),
					...runTo(F_LAPSE + 1800, 'f11', 11, 400),
					...swap(F_LAPSE + 2100, 'iv-5', 'iv-6'),
					// Row 6: j reaches 7, the flag turns true and break leaves the j loop.
					...runTo(found.start(1), 'f10', 10, 400),
					{ at: found.start(1) + 300, do: 'enter', el: 'jv-7', dur: 200 },
					...runTo(found.start(1) + 400, 'f11', 11, 400),
					{ at: found.start(1) + 800, do: 'pulse', el: 'm-f11' },
					...runTo(found.start(1) + 900, 'f12', 12, 400),
					...swap(found.start(1) + 1200, 'fv-0', 'fv-1'),
					{ at: found.start(1) + 1400, do: 'pulse', el: 'c-flag' },
					...runTo(found.start(1) + 1400, 'f13', 13, 300),
					...runTo(found.start(1) + 1700, 'f14', 14, 300),
					...runTo(found.start(1) + 2000, 'f15', 15, 400),
					{ at: found.start(1) + 2400, do: 'enter', el: 'hx-15' },
					{ at: found.start(1) + 2400, do: 'enter', el: 'on-f15' },
					{ at: found.start(1) + 2600, do: 'enter', el: 'lb-break' },
					// The outer condition reads the flag and ends the outer loop too.
					...runTo(found.start(2), 'f9', 9, 800),
					{ at: found.start(2) + 800, do: 'enter', el: 'on-f9' },
					{ at: found.start(2) + 900, do: 'enter', el: 'lb-gate' },
					{ at: found.start(2) + 1100, do: 'pulse', el: 'c-flag' },
					...runTo(found.start(2) + 1700, 'f20', 20, 700),
					...runTo(found.start(2) + 2400, 'f21', 21, 500),
					{ at: found.start(2) + 2900, do: 'type', el: 'out-f1', dur: 600 },
				),
			},
		},
		{
			id: 'close',
			chapter: 'exit',
			scene: 'journey',
			title: { es: 'Del problema al programa', en: 'From problem to program' },
			subtitles: close.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-break', dur: 300 },
					{ at: 0, do: 'exit', el: 'on-f15', dur: 300 },
					...runTo(200, 'f25', 25, 600),
					{ at: 800, do: 'pulse', el: 'lb-gate' },
					// The camera pulls back to reveal the refinement and the loop machine.
					{ at: 1400, do: 'camera', to: 'all', dur: 3200 },
					{ at: 2000, do: 'pulse', el: 'c-flag' },
					{ at: close.start(1), do: 'pulse', el: 'prob' },
					{ at: close.start(1) + 400, do: 'pulse', el: 'r0' },
					{ at: close.start(1) + 700, do: 'pulse', el: 'r1' },
					{ at: close.start(1) + 1000, do: 'pulse', el: 'r2' },
					{ at: close.start(1) + 1300, do: 'pulse', el: 'r3' },
					{ at: close.start(1) + 2000, do: 'enter', el: 'lb-next' },
					{ at: close.start(1) + 2600, do: 'exit', el: 'hl', dur: 400 },
					{ at: close.start(1) + 3000, do: 'pulse', el: 'lb-next' },
				),
			},
		},
	],
};
