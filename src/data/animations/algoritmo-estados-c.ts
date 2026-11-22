import type { AnimationScript, MotionCue, Subtitle } from './types';

// "State changes step by step": a short film (about two minutes) for the C lesson
// "Secuencia de Acciones" (`procesos-y-estados`). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/algoritmo-estados-c.astro`).
// The editor shows the lesson's own programs, one page at a time: the complete example
// (page 1) and the fragments of the assignment, failed swap and fixed swap (pages 2 to
// 4). The isometric world on the right draws each variable as a box and each value as a
// pill resting on it; a trace table fills row by row beside the boxes, one row per
// executed action. Light blue is the normal flow; magenta marks the exceptional (an
// indeterminate `?`, the value a failed swap loses, a formula that is not stored); violet
// marks what resolves it (the auxiliary variable). The closing scenes place each action
// of the first program on one of three stations: input, processing and output.

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
const seq = (...cues: MotionCue[]): MotionCue[] =>
	cues
		.map((cue, index) => ({ cue, index }))
		.sort((a, b) => a.cue.at - b.cue.at || a.index - b.index)
		.map((entry) => entry.cue);

/** Camera cue that frames one of the `shot-*` anchors exactly (they carry their own zoom). */
const shot = (at: number, to: string, dur: number): MotionCue => ({ at, do: 'camera', to: [to], dur, pad: 0 });

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/**
 * Runs the instruction on editor line `line` of `page`: the bar slides to the line, the
 * particle travels to its module and the module lights up (it stays lit once run).
 */
const run = (at: number, page: number, line: number): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${page}-${line}`, dur: 500 },
	{ at, do: 'move', el: 'p', to: `a-m-${page}-${line}`, dur: 700 },
	{ at: at + 700, do: 'enter', el: `on-${page}-${line}` },
];

/** Moves the bar and the particle to a page's first instruction at once, before it runs. */
const park = (at: number, page: number, line: number): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${page}-${line}`, dur: 1 },
	{ at, do: 'move', el: 'p', to: `a-m-${page}-${line}`, dur: 1 },
];

/** Builds the modules of a page one after another. */
const modulesIn = (at: number, page: number, lines: number[], gap = 150): MotionCue[] =>
	lines.map((line, index) => ({ at: at + index * gap, do: 'enter' as const, el: `m-${page}-${line}` }));

/** The row of a trace table appears and the table's bar frames it. */
const row = (at: number, table: number, index: number, bar = true): MotionCue[] => [
	{ at, do: 'enter', el: `tr-${table}-${index}` },
	...(bar && index > 0 ? [{ at, do: 'move', el: `tbh-${table}`, to: `ta-${table}-${index}`, dur: 400 } as MotionCue] : []),
];

/** A copy of a value starts on the box it is read from and travels to the box it is stored in. */
const copy = (at: number, token: string, from: string, to: string, via: string, dur = 800): MotionCue[] => [
	{ at, do: 'move', el: token, to: from, dur: 1 },
	{ at: at + 100, do: 'enter', el: token },
	{ at: at + 100, do: 'draw', el: via, dur },
	{ at: at + 200, do: 'move', el: token, to, dur },
];

const lines = (page: number, list: number[]) => list.flatMap((line) => [`m-${page}-${line}`, `on-${page}-${line}`]);

// ─── Captions ───────────────────────────────────────────────────────────────
const state = timed(
	say(
		'Un algoritmo es una secuencia ordenada de acciones. Cada módulo es una instrucción.',
		'An algorithm is an ordered sequence of actions. Each module is one instruction.',
	),
	say(
		'Las líneas 4 y 5 crean una caja por variable. El estado es el conjunto de valores: aún `?`, indeterminado.',
		'Lines 4 and 5 create one box per variable. The state is the set of values: still `?`, indeterminate.',
	),
);
const trace = timed(
	say(
		'Una tabla de traza anota el valor de cada variable después de cada acción.',
		'A trace table records the value of each variable after each action.',
	),
	say(
		'Línea 7: `numero = 5;` guarda el 5. Línea 8 calcula `numero + 3` y guarda 8.',
		'Line 7: `number = 5;` stores 5. Line 8 computes `number + 3` and stores 8.',
	),
	say(
		'Línea 10: `printf` escribe `Resultado: 8`, la parte observable del estado final.',
		'Line 10: `printf` writes `Result: 8`, the observable part of the final state.',
	),
);
const formula = timed(
	say(
		'Otro fragmento: `int n = 7;` guarda 7 y `doble` guarda `n * 2`: 14.',
		'Another fragment: `int n = 7;` stores 7 and `twice` stores `n * 2`: 14.',
	),
	say(
		'Luego `n = n + 1;` guarda 8. El 7 se pierde: una caja guarda un valor a la vez.',
		'Then `n = n + 1;` stores 8. The 7 is gone: a box holds one value at a time.',
	),
	say(
		'Pero `doble` sigue en 14: guardó un valor, no la fórmula. Hay que asignarlo otra vez.',
		'But `twice` still holds 14: it stored a value, not the formula. Assign it again.',
	),
);
const lost = timed(
	say(
		'Queremos intercambiar `x` e `y`. Primer intento: `x = y;` y luego `y = x;`.',
		'We want to swap `x` and `y`. First attempt: `x = y;` and then `y = x;`.',
	),
	say(
		'Línea 4: `x = y;` copia el 8 en `x`. El 3 ya no está en ninguna variable.',
		'Line 4: `x = y;` copies 8 into `x`. The 3 is no longer in any variable.',
	),
	say(
		'Línea 5: `y = x;` copia otra vez el 8. Las dos valen 8: el intercambio falló.',
		'Line 5: `y = x;` copies the 8 again. Both hold 8: the swap failed.',
	),
);
const aux = timed(
	say(
		'La solución: una variable auxiliar guarda el 3 antes de que se pierda.',
		'The fix: an auxiliary variable keeps the 3 before it is lost.',
	),
	say(
		'Línea 5: `auxiliar = x;` conserva el 3. Línea 6: `x = y;` ya no pierde nada.',
		'Line 5: `temp = x;` keeps the 3. Line 6: `x = y;` loses nothing now.',
	),
	say(
		'Línea 7: `y = auxiliar;` devuelve el 3 a `y`. Ahora `x` vale 8 e `y` vale 3.',
		'Line 7: `y = temp;` gives the 3 back to `y`. Now `x` is 8 and `y` is 3.',
	),
);
const stations = timed(
	say(
		'Volvamos al primer programa: casi todo algoritmo tiene entrada, proceso y salida.',
		'Back to the first program: almost every algorithm has input, processing and output.',
	),
	say(
		'Entrada: el dato `numero = 5`. Proceso: `numero + 3`. Salida: `printf` lo muestra.',
		'Input: the datum `number = 5`. Processing: `number + 3`. Output: `printf` shows it.',
	),
	say(
		'Identificarlas dice qué tengo, qué hago con eso y qué obtengo.',
		'Spotting them tells you what you have, what to do and what you get.',
	),
);
const recap = timed(
	say(
		'Cada acción cambia una caja; la tabla de traza anota el estado tras cada una.',
		'Each action changes a box; the trace table records the state after each one.',
	),
	say(
		'Un algoritmo es esa secuencia: entrada, proceso y salida, un estado tras otro.',
		'An algorithm is that sequence: input, processing and output, one state after another.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'state', label: { es: 'El estado', en: 'The state' } },
		{ id: 'trace', label: { es: 'Tabla de traza', en: 'Trace table' } },
		{ id: 'assign', label: { es: 'Valor, no fórmula', en: 'A value, not a formula' } },
		{ id: 'swap', label: { es: 'Intercambio', en: 'Swapping' } },
		{ id: 'stations', label: { es: 'Entrada, proceso, salida', en: 'Input, processing, output' } },
		{ id: 'recap', label: { es: 'La secuencia', en: 'The sequence' } },
	],
	steps: [
		// ─── Scene 1. The state ─────────────────────────────────────────────
		{
			id: 'state',
			chapter: 'state',
			scene: 'journey',
			title: { es: 'Acciones y estado', en: 'Actions and state' },
			subtitles: state.list,
			motion: {
				cues: seq(
					shot(0, 'shot-world', 3000),
					...modulesIn(300, 1, [4, 5, 7, 8, 10, 12]),
					{ at: state.start(1) - 600, do: 'enter', el: 'hl' },
					{ at: state.start(1) - 600, do: 'enter', el: 'p' },
					...run(state.start(1) + 300, 1, 4),
					{ at: state.start(1) + 1000, do: 'enter', el: 'c-num' },
					{ at: state.start(1) + 1100, do: 'enter', el: 'tq-num' },
					...run(state.start(1) + 1900, 1, 5),
					{ at: state.start(1) + 2600, do: 'enter', el: 'c-res' },
					{ at: state.start(1) + 2700, do: 'enter', el: 'tq-res' },
					shot(state.start(1) + 2700, 'shot-boxes', 2200),
					{ at: state.start(1) + 3600, do: 'enter', el: 'lb-state' },
					{ at: state.start(1) + 4500, do: 'enter', el: 'lb-unk' },
					{ at: state.start(1) + 5300, do: 'pulse', el: 'tq-num' },
					{ at: state.start(1) + 5600, do: 'pulse', el: 'tq-res' },
				),
			},
		},

		// ─── Scene 2. The trace table ───────────────────────────────────────
		{
			id: 'trace',
			chapter: 'trace',
			scene: 'journey',
			title: { es: 'La tabla de traza', en: 'The trace table' },
			subtitles: trace.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-state', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-unk', dur: 400 },
					shot(100, 'shot-trace', 2500),
					{ at: 700, do: 'enter', el: 'tb-1' },
					{ at: 1100, do: 'enter', el: 'tbh-1' },
					{ at: 1200, do: 'enter', el: 'tr-1-0' },
					{ at: 2600, do: 'pulse', el: 'tr-1-0' },
					// Line 7 stores 5: the `?` of numero is replaced and a row is added.
					...run(trace.start(1) + 200, 1, 7),
					{ at: trace.start(1) + 900, do: 'exit', el: 'tq-num', dur: 400 },
					{ at: trace.start(1) + 1000, do: 'enter', el: 'tk-5' },
					...row(trace.start(1) + 1100, 1, 1),
					// Line 8 reads numero, computes 8 and stores it in resultado.
					...run(trace.start(1) + 2200, 1, 8),
					{ at: trace.start(1) + 2900, do: 'draw', el: 'fl-calc', dur: 800 },
					{ at: trace.start(1) + 3700, do: 'exit', el: 'tq-res', dur: 400 },
					{ at: trace.start(1) + 3800, do: 'enter', el: 'tk-8' },
					...row(trace.start(1) + 3900, 1, 2),
					// Line 10 shows it on the screen.
					...run(trace.start(2) + 200, 1, 10),
					{ at: trace.start(2) + 1000, do: 'type', el: 'out-1', dur: 900 },
					...row(trace.start(2) + 1900, 1, 3),
					{ at: trace.start(2) + 2800, do: 'pulse', el: 'tr-1-3' },
					...run(trace.start(2) + 3400, 1, 12),
				),
			},
		},

		// ─── Scene 3. A value, not a formula ────────────────────────────────
		{
			id: 'formula',
			chapter: 'assign',
			scene: 'journey',
			title: { es: 'Una asignación guarda un valor', en: 'An assignment stores a value' },
			subtitles: formula.list,
			motion: {
				cues: seq(
					...clear(
						0,
						'pg-1',
						'fn-1',
						'tb-1',
						'c-num',
						'c-res',
						'tk-5',
						'tk-8',
						'out-1',
						'fl-calc',
						...lines(1, [4, 5, 7, 8, 10, 12]),
					),
					{ at: 500, do: 'enter', el: 'pg-2' },
					{ at: 500, do: 'enter', el: 'fn-2' },
					...park(500, 2, 1),
					...modulesIn(700, 2, [1, 2, 3]),
					{ at: 1000, do: 'enter', el: 'tb-2' },
					{ at: 1200, do: 'enter', el: 'tbh-2' },
					// `int n = 7;` creates n with the value 7.
					...run(1400, 2, 1),
					{ at: 2100, do: 'enter', el: 'c-n' },
					{ at: 2200, do: 'enter', el: 'tk-n7' },
					...row(2300, 2, 0),
					// `int doble = n * 2;` reads n and stores the result, a value, in doble.
					...run(3300, 2, 2),
					{ at: 4000, do: 'draw', el: 'fl-rd', dur: 800 },
					{ at: 4600, do: 'enter', el: 'c-dbl' },
					{ at: 4800, do: 'enter', el: 'tk-d14' },
					...row(5000, 2, 1),
					// `n = n + 1;` replaces the 7: the old value is lost.
					...run(formula.start(1) + 200, 2, 3),
					{ at: formula.start(1) + 900, do: 'exit', el: 'tk-n7', dur: 400 },
					{ at: formula.start(1) + 1100, do: 'enter', el: 'tk-n8' },
					...row(formula.start(1) + 1300, 2, 2),
					// The formula is not stored: doble keeps 14.
					{ at: formula.start(2), do: 'exit', el: 'fl-rd', dur: 400 },
					{ at: formula.start(2) + 300, do: 'draw', el: 'fl-fx', dur: 800 },
					{ at: formula.start(2) + 1000, do: 'enter', el: 'lb-fx' },
					{ at: formula.start(2) + 1700, do: 'enter', el: 'lb-nofx' },
					{ at: formula.start(2) + 2400, do: 'pulse', el: 'tk-d14' },
					{ at: formula.start(2) + 3000, do: 'pulse', el: 'lb-nofx' },
				),
			},
		},

		// ─── Scene 4. A swap that loses a value ─────────────────────────────
		{
			id: 'lost',
			chapter: 'swap',
			scene: 'journey',
			title: { es: 'Un intercambio que pierde un valor', en: 'A swap that loses a value' },
			subtitles: lost.list,
			motion: {
				cues: seq(
					...clear(
						0,
						'pg-2',
						'tb-2',
						'c-n',
						'c-dbl',
						'tk-n8',
						'tk-d14',
						'fl-fx',
						'lb-fx',
						'lb-nofx',
						...lines(2, [1, 2, 3]),
					),
					{ at: 500, do: 'enter', el: 'pg-3' },
					...park(500, 3, 1),
					...modulesIn(600, 3, [1, 2, 4, 5]),
					{ at: 900, do: 'enter', el: 'tb-3' },
					{ at: 1100, do: 'enter', el: 'tbh-3' },
					// `int x = 3;` and `int y = 8;` set up the state to swap.
					...run(1300, 3, 1),
					{ at: 2000, do: 'enter', el: 'c-x' },
					{ at: 2100, do: 'enter', el: 'tk-x3' },
					...row(2200, 3, 0),
					...run(2900, 3, 2),
					{ at: 3600, do: 'enter', el: 'c-y' },
					{ at: 3700, do: 'enter', el: 'tk-y8' },
					...row(3800, 3, 1),
					// `x = y;` copies 8 into x: the 3 is replaced and lost.
					...run(lost.start(1) + 200, 3, 4),
					...copy(lost.start(1) + 900, 'tk-x8', 'a-c-y', 'a-c-x', 'fl-b1'),
					{ at: lost.start(1) + 1900, do: 'exit', el: 'tk-x3', dur: 450 },
					...row(lost.start(1) + 2000, 3, 2),
					{ at: lost.start(1) + 2300, do: 'enter', el: 'lb-lost' },
					// `y = x;` copies the 8 again: both boxes hold 8.
					...run(lost.start(2) + 200, 3, 5),
					...copy(lost.start(2) + 900, 'tk-y8b', 'a-c-x', 'a-c-y', 'fl-b2'),
					{ at: lost.start(2) + 1900, do: 'exit', el: 'tk-y8', dur: 450 },
					...row(lost.start(2) + 2000, 3, 3),
					{ at: lost.start(2) + 2700, do: 'pulse', el: 'tk-x8' },
					{ at: lost.start(2) + 2900, do: 'pulse', el: 'tk-y8b' },
					{ at: lost.start(2) + 3300, do: 'pulse', el: 'lb-lost' },
				),
			},
		},

		// ─── Scene 5. The auxiliary variable ────────────────────────────────
		{
			id: 'aux',
			chapter: 'swap',
			scene: 'journey',
			title: { es: 'Una variable auxiliar', en: 'An auxiliary variable' },
			subtitles: aux.list,
			motion: {
				cues: seq(
					...clear(0, 'pg-3', 'tb-3', 'tk-x8', 'tk-y8b', 'fl-b1', 'fl-b2', 'lb-lost', ...lines(3, [1, 2, 4, 5])),
					{ at: 500, do: 'enter', el: 'pg-4' },
					...park(500, 4, 1),
					...modulesIn(600, 4, [1, 2, 3, 5, 6, 7], 100),
					{ at: 900, do: 'enter', el: 'tb-4' },
					{ at: 1100, do: 'enter', el: 'tbh-4' },
					// The program starts again: x and y get their values, then the auxiliary box appears.
					...run(1200, 4, 1),
					{ at: 1900, do: 'enter', el: 'tm-x3' },
					...row(2000, 4, 0),
					...run(2600, 4, 2),
					{ at: 3300, do: 'enter', el: 'tm-y8' },
					...row(3400, 4, 1),
					...run(4000, 4, 3),
					{ at: 4700, do: 'enter', el: 'c-aux' },
					{ at: 4800, do: 'enter', el: 'tm-q' },
					...row(4900, 4, 2),
					// `auxiliar = x;` keeps the 3.
					...run(aux.start(1) + 200, 4, 5),
					...copy(aux.start(1) + 900, 'tm-a3', 'a-c-x', 'a-c-aux', 'fl-a1'),
					{ at: aux.start(1) + 1900, do: 'exit', el: 'tm-q', dur: 400 },
					...row(aux.start(1) + 2000, 4, 3),
					{ at: aux.start(1) + 2100, do: 'enter', el: 'lb-aux' },
					// `x = y;` no longer loses the 3: it is safe in the auxiliary box.
					...run(aux.start(1) + 2800, 4, 6),
					...copy(aux.start(1) + 3500, 'tm-x8', 'a-c-y', 'a-c-x', 'fl-a2'),
					{ at: aux.start(1) + 4500, do: 'exit', el: 'tm-x3', dur: 450 },
					...row(aux.start(1) + 4600, 4, 4),
					// `y = auxiliar;` gives the 3 back.
					...run(aux.start(2) + 200, 4, 7),
					...copy(aux.start(2) + 900, 'tm-y3', 'a-c-aux', 'a-c-y', 'fl-a3'),
					{ at: aux.start(2) + 1900, do: 'exit', el: 'tm-y8', dur: 450 },
					...row(aux.start(2) + 2000, 4, 5),
					{ at: aux.start(2) + 2800, do: 'pulse', el: 'tm-x8' },
					{ at: aux.start(2) + 3000, do: 'pulse', el: 'tm-y3' },
					{ at: aux.start(2) + 3300, do: 'pulse', el: 'tr-4-5' },
				),
			},
		},

		// ─── Scene 6. Input, processing and output ──────────────────────────
		{
			id: 'stations',
			chapter: 'stations',
			scene: 'journey',
			title: { es: 'Entrada, proceso y salida', en: 'Input, processing and output' },
			subtitles: stations.list,
			motion: {
				cues: seq(
					...clear(
						0,
						'pg-4',
						'fn-2',
						'tb-4',
						'c-x',
						'c-y',
						'c-aux',
						'tm-x8',
						'tm-y3',
						'tm-a3',
						'fl-a1',
						'fl-a2',
						'fl-a3',
						'lb-aux',
						...lines(4, [1, 2, 3, 5, 6, 7]),
					),
					{ at: 500, do: 'enter', el: 'pg-1' },
					{ at: 500, do: 'enter', el: 'fn-1' },
					...park(500, 1, 7),
					...modulesIn(600, 1, [4, 5, 7, 8, 10, 12], 100),
					shot(200, 'shot-stations', 2600),
					{ at: 1000, do: 'enter', el: 'z-in' },
					{ at: 1200, do: 'enter', el: 'z-proc' },
					{ at: 1400, do: 'enter', el: 'z-out' },
					{ at: 1700, do: 'enter', el: 'lb-in' },
					{ at: 1900, do: 'enter', el: 'lb-proc' },
					{ at: 2100, do: 'enter', el: 'lb-out' },
					// Input: the datum 5 (line 7).
					...run(stations.start(1) + 200, 1, 7),
					{ at: stations.start(1) + 300, do: 'enter', el: 'br-in' },
					{ at: stations.start(1) + 900, do: 'enter', el: 'on-in' },
					{ at: stations.start(1) + 900, do: 'enter', el: 'ct-in' },
					{ at: stations.start(1) + 1100, do: 'enter', el: 'ts-5' },
					// Processing: numero + 3 (line 8).
					...run(stations.start(1) + 2000, 1, 8),
					{ at: stations.start(1) + 2100, do: 'enter', el: 'br-proc' },
					{ at: stations.start(1) + 2700, do: 'draw', el: 'fl-io1', dur: 800 },
					{ at: stations.start(1) + 2800, do: 'move', el: 'ts-5', to: 'a-proc', dur: 900 },
					{ at: stations.start(1) + 3700, do: 'enter', el: 'on-proc' },
					{ at: stations.start(1) + 3700, do: 'enter', el: 'ct-proc' },
					{ at: stations.start(1) + 3800, do: 'exit', el: 'ts-5', dur: 400 },
					{ at: stations.start(1) + 3900, do: 'enter', el: 'ts-8' },
					// Output: printf shows 8 (line 10).
					...run(stations.start(1) + 3600, 1, 10),
					{ at: stations.start(1) + 3700, do: 'enter', el: 'br-out' },
					{ at: stations.start(1) + 4300, do: 'draw', el: 'fl-io2', dur: 800 },
					{ at: stations.start(1) + 4400, do: 'move', el: 'ts-8', to: 'a-out', dur: 900 },
					{ at: stations.start(1) + 5300, do: 'enter', el: 'on-out' },
					{ at: stations.start(1) + 5300, do: 'enter', el: 'ct-out' },
					{ at: stations.start(1) + 5400, do: 'type', el: 'out-1', dur: 900 },
					// The three parts, one by one.
					{ at: stations.start(2) + 300, do: 'pulse', el: 'lb-in' },
					{ at: stations.start(2) + 1000, do: 'pulse', el: 'lb-proc' },
					{ at: stations.start(2) + 1700, do: 'pulse', el: 'lb-out' },
				),
			},
		},

		// ─── Scene 7. The sequence ──────────────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'Cada acción cambia el estado', en: 'Each action changes the state' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'ts-8', dur: 400 },
					// The camera pulls back to reveal the stations, the boxes with their final state and the modules.
					shot(300, 'shot-all', 3200),
					{ at: 900, do: 'enter', el: 'c-num' },
					{ at: 1050, do: 'enter', el: 'c-res' },
					{ at: 1300, do: 'enter', el: 'tk-5' },
					{ at: 1450, do: 'enter', el: 'tk-8' },
					{ at: 2000, do: 'draw', el: 'fl-calc', dur: 800 },
					{ at: 3000, do: 'pulse', el: 'tk-5' },
					{ at: 3300, do: 'pulse', el: 'tk-8' },
					{ at: recap.start(1) + 200, do: 'enter', el: 'lb-end' },
					{ at: recap.start(1) + 1200, do: 'flow', el: 'fl-io1' },
					{ at: recap.start(1) + 1200, do: 'flow', el: 'fl-io2' },
					{ at: recap.start(1) + 2400, do: 'pulse', el: 'lb-end' },
				),
			},
		},
	],
};
