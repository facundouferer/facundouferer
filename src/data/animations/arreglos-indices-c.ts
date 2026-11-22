import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Contiguous cells and indexes": a short film (about two minutes) for the C lesson
// "Arreglos" (arreglos-unidimensionales-y-multidimensionales). It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/arreglos-indices-c.astro`): the program on the left, and
// on the right an isometric model of the array. `notas` is a row of five contiguous
// cells with its index on the front face and its value on top. The index being used is
// always a diamond selector resting on a cell: light blue inside the bound, magenta
// past it. One module per instruction stands in front of the array, labelled with its
// editor line, and the light blue particle is the execution flow. Magenta marks the
// problem (index 5, the neighbour it overwrites, the size a function cannot see); violet
// marks what resolves it (the length passed apart, the same cells reached by `v`).
// This lesson comes before pointers: nothing here is drawn as an address or an arrow.

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

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/** Fades several elements in, one after the other. */
const reveal = (at: number, gap: number, ...els: string[]): MotionCue[] =>
	els.map((el, index) => ({ at: at + index * gap, do: 'enter' as const, el }));

/** Replaces the value shown on top of a cell: the old one fades, the new one appears. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 250 },
	{ at: at + 150, do: 'enter', el: to, dur: 400 },
];

/**
 * Runs the instruction of module `id` (program letter + editor line): slides the bar
 * to its line, builds the module the first time, sends the particle to it and lights it.
 */
const run = (at: number, id: string, build = true): MotionCue[] => {
	const line = id.slice(1);
	return [
		{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
		...(build ? [{ at: at + 100, do: 'enter' as const, el: `m-${id}` }] : []),
		{ at: at + 100, do: 'move', el: 'px', to: `a-m${id}`, dur: 700 },
		build ? { at: at + 700, do: 'enter', el: `on-${id}` } : { at: at + 700, do: 'pulse', el: `m-${id}` },
	];
};

const cells = [0, 1, 2, 3, 4];
const rowA = ['a6', 'a7', 'a8', 'a9', 'a10', 'a12', 'a13', 'a15'];
const rowB = ['b6', 'b7', 'b9'];
const rowC = ['c15', 'c16', 'c18', 'c3', 'c8', 'c9', 'c11'];
const modulesOf = (ids: string[]) => ids.flatMap((id) => [`m-${id}`, `on-${id}`]);
const lits = cells.map((i) => `lit-c${i}`);

// ─── Captions ───────────────────────────────────────────────────────────────
const declare = timed(
	say('`int notas[CANTIDAD]` reserva cinco enteros contiguos.', '`int grades[COUNT]` reserves five contiguous ints.'),
	say('Cada celda tiene un índice, y el primero es 0.', 'Each cell has an index, and the first one is 0.'),
	say('`= {0}` pone todo en cero; sin inicializar, habría basura.', '`= {0}` sets everything to zero; uninitialized, it would be garbage.'),
);
const write = timed(
	say('`notas[0] = 8` escribe en el índice 0; `notas[2] = 10`, en el 2.', '`grades[0] = 8` writes at index 0; `grades[2] = 10`, at index 2.'),
	say('El último índice válido es `CANTIDAD - 1`, o sea 4.', 'The last valid index is `COUNT - 1`, that is 4.'),
	say('Leer usa la misma notación: `tercera = notas[2]` copia el 10.', 'Reading uses the same notation: `third = grades[2]` copies the 10.'),
);
const loop = timed(
	say('El ciclo recorre los índices válidos: `i` va de 0 a 4 y lee `notas[i]`.', 'The loop walks the valid indexes: `i` goes from 0 to 4 and reads `grades[i]`.'),
	say('Con `i` igual a 5, `i < CANTIDAD` es falsa y el ciclo termina.', 'With `i` equal to 5, `i < COUNT` is false and the loop ends.'),
	say('El programa imprime `8 0 10 0 9` y `tercera = 10`.', 'The program prints `8 0 10 0 9` and `third = 10`.'),
);
const bound = timed(
	say('`notas[5] = 4` usa el índice 5: fuera del límite, y C no lo comprueba.', '`grades[5] = 4` uses index 5: out of bounds, and C does not check it.'),
	say('Aquí el 4 cae sobre `otra`, la variable de al lado, y la cambia.', 'Here the 4 lands on `other`, the variable next to it, and changes it.'),
	say('Comportamiento indefinido: puede no notarse, cambiar otra variable o terminar el programa.', 'Undefined behavior: nothing may show, another variable may change, or the program may crash.'),
);
const count = timed(
	say('`sizeof puntos` da el total en bytes: aquí 20, cinco `int` de 4.', '`sizeof points` gives the total in bytes: here 20, five 4-byte `int`s.'),
	say('Dividido por `sizeof puntos[0]` da `n = 5`, solo donde el arreglo está declarado.', 'Divided by `sizeof points[0]` it gives `n = 5`, only where the array is declared.'),
);
const call = timed(
	say('`promedio(puntos, n)` no copia los elementos: usa el arreglo de `main`.', '`average(points, n)` copies no elements: it uses the array of `main`.'),
	say('Dentro, `sizeof v` no da 20: la función no sabe cuántos elementos hay.', 'Inside, `sizeof v` does not give 20: the function cannot know how many there are.'),
	say('Por eso la cantidad viaja aparte, en `size_t n`: imprime `Promedio: 8.00`.', 'So the count travels separately, in `size_t n`: it prints `Average: 8.00`.'),
);
const grid = timed(
	say('`int m[3][4]` son 3 filas de 4 columnas: 12 enteros.', '`int m[3][4]` is 3 rows of 4 columns: 12 ints.'),
	say('`m[1][2]` es fila 1, columna 2: el programa imprime `m[1][2] = 7`.', '`m[1][2]` is row 1, column 2: the program prints `m[1][2] = 7`.'),
);
const rows = timed(
	say('En memoria las filas quedan una detrás de otra: orden por filas.', 'In memory the rows sit one after another: row-major order.'),
	say('Por eso `sizeof m[0]` es una fila entera: `sizeof m[0] = 16`.', 'That is why `sizeof m[0]` is a whole row: `sizeof m[0] = 16`.'),
	say('Celdas contiguas, índices desde 0 y un límite que respetar.', 'Contiguous cells, indexes from 0, and a bound to respect.'),
);

// The loop of scene 3 spreads its five passes over the first caption.
const PASS = Math.floor((loop.start(1) - 500) / 5);
const passes = cells.flatMap((i): MotionCue[] => {
	const at = 300 + i * PASS;
	const body = at + Math.round(PASS * 0.4);
	return [
		...run(at, 'a12', i === 0),
		...(i === 0
			? [
					{ at: at + 600, do: 'enter' as const, el: 'v-i' },
					{ at: at + 800, do: 'enter' as const, el: 'iv-0' },
				]
			: swap(at + 300, `iv-${i - 1}`, `iv-${i}`)),
		...run(body, 'a13', i === 0),
		i === 0 ? { at: body + 200, do: 'enter', el: 'sel' } : { at: body + 100, do: 'move', el: 'sel', to: `a-c${i}`, dur: 500 },
		{ at: body + 500, do: 'enter', el: `lit-c${i}` },
		{ at: body + 550, do: 'type', el: `oa-p${i}`, dur: 300 },
	];
});

// Scene 6: the function reads the five cells and accumulates them.
const sums = ['su-0', 'su-8', 'su-14', 'su-24', 'su-31', 'su-40'];
const reads = cells.flatMap((i): MotionCue[] => {
	const at = call.start(2) + 1800 + i * 300;
	return [{ at, do: 'enter', el: `lit-c${i}` }, ...swap(at + 60, sums[i], sums[i + 1])];
});

export const script: AnimationScript = {
	chapters: [
		{ id: 'cells', label: { es: 'Celdas contiguas', en: 'Contiguous cells' } },
		{ id: 'index', label: { es: 'Leer y escribir por índice', en: 'Reading and writing by index' } },
		{ id: 'loop', label: { es: 'Recorrer de 0 a n - 1', en: 'Walking from 0 to n - 1' } },
		{ id: 'bound', label: { es: 'El límite del arreglo', en: 'The array bound' } },
		{ id: 'function', label: { es: 'Cantidad y funciones', en: 'Count and functions' } },
		{ id: 'matrix', label: { es: 'Una matriz en memoria', en: 'A matrix in memory' } },
	],
	steps: [
		// ─── Scene 1. Contiguous cells ──────────────────────────────────────
		{
			id: 'declare',
			chapter: 'cells',
			scene: 'journey',
			title: { es: 'Cinco celdas, numeradas desde 0', en: 'Five cells, numbered from 0' },
			subtitles: declare.list,
			motion: {
				cues: seq(
					shot(0, 'shot-cells', 3000),
					Array.from({ length: 17 }, (_, i): MotionCue => ({ at: 200 + i * 120, do: 'type', el: `ea-${i + 1}`, dur: 300 })),
					{ at: 2300, do: 'enter', el: 'plate-main' },
					{ at: 2400, do: 'move', el: 'hl', to: 'ln-6', dur: 1 },
					{ at: 2500, do: 'enter', el: 'hl' },
					{ at: 2600, do: 'enter', el: 'm-a6' },
					{ at: 2600, do: 'move', el: 'px', to: 'a-ma6', dur: 1 },
					{ at: 2700, do: 'enter', el: 'px' },
					{ at: 3200, do: 'enter', el: 'on-a6' },
					reveal(3300, 200, ...cells.map((i) => `c-${i}`)),
					{ at: 3500, do: 'enter', el: 'lb-notas' },
					{ at: declare.start(1) + 300, do: 'pulse', el: 'c-0' },
					{ at: declare.start(1) + 600, do: 'enter', el: 'ch-first' },
					reveal(declare.start(2) + 300, 150, ...cells.map((i) => `cv-${i}-0`)),
					{ at: declare.start(2) + 1200, do: 'enter', el: 'ch-zero' },
				),
			},
		},

		// ─── Scene 2. Reading and writing by index ──────────────────────────
		{
			id: 'write',
			chapter: 'index',
			scene: 'journey',
			title: { es: 'El índice elige la celda', en: 'The index picks the cell' },
			subtitles: write.list,
			motion: {
				cues: seq(
					clear(0, 'ch-first', 'ch-zero'),
					shot(0, 'shot-index', 1800),
					run(300, 'a7'),
					{ at: 600, do: 'enter', el: 'sel' },
					swap(1100, 'cv-0-0', 'cv-0-8'),
					run(2300, 'a8'),
					{ at: 2400, do: 'move', el: 'sel', to: 'a-c2', dur: 700 },
					swap(3100, 'cv-2-0', 'cv-2-10'),
					run(write.start(1), 'a9'),
					{ at: write.start(1) + 100, do: 'move', el: 'sel', to: 'a-c4', dur: 800 },
					{ at: write.start(1) + 900, do: 'enter', el: 'ch-last' },
					swap(write.start(1) + 1100, 'cv-4-0', 'cv-4-9'),
					{ at: write.start(1) + 1800, do: 'pulse', el: 'c-4' },
					run(write.start(2), 'a10'),
					{ at: write.start(2) + 100, do: 'move', el: 'sel', to: 'a-c2', dur: 800 },
					{ at: write.start(2) + 900, do: 'enter', el: 'lit-c2' },
					{ at: write.start(2) + 1100, do: 'enter', el: 'v-tercera' },
					{ at: write.start(2) + 1400, do: 'enter', el: 'tv-10' },
					{ at: write.start(2) + 2000, do: 'pulse', el: 'v-tercera' },
				),
			},
		},

		// ─── Scene 3. The loop over the valid indexes ───────────────────────
		{
			id: 'loop',
			chapter: 'loop',
			scene: 'journey',
			title: { es: 'Un ciclo de 0 a n - 1', en: 'A loop from 0 to n - 1' },
			subtitles: loop.list,
			motion: {
				cues: seq(
					clear(0, 'ch-last', 'lit-c2', 'sel'),
					shot(0, 'shot-loop', 1800),
					{ at: 450, do: 'move', el: 'sel', to: 'a-c0', dur: 1 },
					passes,
					run(loop.start(1), 'a12', false),
					swap(loop.start(1) + 300, 'iv-4', 'iv-5'),
					{ at: loop.start(1) + 600, do: 'draw', el: 'fl-loop', dur: 1400 },
					{ at: loop.start(1) + 900, do: 'enter', el: 'ch-cond' },
					{ at: loop.start(1) + 1800, do: 'pulse', el: 'v-i' },
					clear(loop.start(2), 'sel'),
					run(loop.start(2), 'a15'),
					{ at: loop.start(2) + 800, do: 'type', el: 'oa-2', dur: 600 },
					{ at: loop.start(2) + 1500, do: 'pulse', el: 'v-tercera' },
				),
			},
		},

		// ─── Scene 4. The bound ─────────────────────────────────────────────
		{
			id: 'bound',
			chapter: 'bound',
			scene: 'journey',
			title: { es: 'El índice 5 ya está afuera', en: 'Index 5 is already outside' },
			subtitles: bound.list,
			motion: {
				cues: seq(
					clear(
						0,
						'ea',
						...cells.map((i) => `oa-p${i}`),
						'oa-2',
						'fl-loop',
						'ch-cond',
						'v-i',
						'iv-5',
						'v-tercera',
						'tv-10',
						...lits,
						...modulesOf(rowA),
					),
					shot(0, 'shot-bound', 2400),
					{ at: 500, do: 'enter', el: 'eb' },
					run(700, 'b6'),
					swap(1300, 'cv-1-0', 'cv-1-6'),
					swap(1450, 'cv-3-0', 'cv-3-7'),
					run(2000, 'b7'),
					{ at: 2600, do: 'enter', el: 'v-otra' },
					{ at: 2800, do: 'enter', el: 'ov-1' },
					run(3200, 'b9'),
					{ at: 3300, do: 'enter', el: 'fail-b9' },
					{ at: 3700, do: 'enter', el: 'sel-x' },
					{ at: 3900, do: 'move', el: 'sel-x', to: 'a-c5', dur: 900 },
					{ at: 4600, do: 'enter', el: 'ch-out' },
					{ at: bound.start(1) + 300, do: 'enter', el: 'lit-otra' },
					swap(bound.start(1) + 500, 'ov-1', 'ov-4'),
					{ at: bound.start(1) + 1400, do: 'pulse', el: 'v-otra' },
					{ at: bound.start(2) + 300, do: 'enter', el: 'ch-ub' },
					{ at: bound.start(2) + 900, do: 'pulse', el: 'fail-b9' },
					{ at: bound.start(2) + 1700, do: 'pulse', el: 'ch-ub' },
				),
			},
		},

		// ─── Scene 5. Count and functions ───────────────────────────────────
		{
			id: 'count',
			chapter: 'function',
			scene: 'journey',
			title: { es: 'sizeof cuenta los elementos', en: 'sizeof counts the elements' },
			subtitles: count.list,
			motion: {
				cues: seq(
					clear(0, 'eb', 'fail-b9', 'sel-x', 'lit-otra', 'v-otra', 'ov-4', 'ch-out', 'ch-ub', 'lb-notas', ...modulesOf(rowB)),
					shot(0, 'shot-count', 2200),
					{ at: 500, do: 'enter', el: 'ec' },
					{ at: 900, do: 'enter', el: 'lb-puntos' },
					run(1000, 'c15'),
					{ at: 1800, do: 'draw', el: 'rule-all', dur: 1200 },
					{ at: 3000, do: 'enter', el: 'ch-szall' },
					run(count.start(1), 'c16'),
					{ at: count.start(1) + 600, do: 'draw', el: 'rule-one', dur: 700 },
					{ at: count.start(1) + 1300, do: 'enter', el: 'ch-szone' },
					{ at: count.start(1) + 2000, do: 'enter', el: 'ch-n' },
					{ at: count.start(1) + 2400, do: 'enter', el: 'v-n' },
					{ at: count.start(1) + 3200, do: 'pulse', el: 'plate-main' },
				),
			},
		},
		{
			id: 'call',
			chapter: 'function',
			scene: 'journey',
			title: { es: 'La cantidad viaja aparte', en: 'The count travels separately' },
			subtitles: call.list,
			motion: {
				cues: seq(
					clear(0, 'rule-all', 'rule-one', 'ch-szall', 'ch-szone', 'ch-n'),
					shot(0, 'shot-fn', 2400),
					run(300, 'c18'),
					{ at: 1000, do: 'enter', el: 'fn-prom' },
					run(1400, 'c3'),
					{ at: 2000, do: 'enter', el: 'v-v' },
					{ at: 2200, do: 'enter', el: 'v-n2' },
					{ at: 2600, do: 'draw', el: 'ring-v', dur: 1000 },
					{ at: 3600, do: 'enter', el: 'ch-same' },
					{ at: call.start(1) + 400, do: 'enter', el: 'ch-szv' },
					{ at: call.start(1) + 1200, do: 'pulse', el: 'v-v' },
					{ at: call.start(2) + 100, do: 'enter', el: 'ch-len' },
					{ at: call.start(2) + 300, do: 'pulse', el: 'v-n' },
					{ at: call.start(2) + 400, do: 'pulse', el: 'v-n2' },
					run(call.start(2) + 500, 'c8'),
					{ at: call.start(2) + 1000, do: 'enter', el: 'v-suma' },
					{ at: call.start(2) + 1200, do: 'enter', el: 'su-0' },
					run(call.start(2) + 1200, 'c9'),
					reads,
					run(call.start(2) + 3500, 'c11'),
					run(call.start(2) + 4100, 'c18', false),
					{ at: call.start(2) + 4700, do: 'type', el: 'oc-1', dur: 600 },
				),
			},
		},

		// ─── Scene 6. A matrix in memory ────────────────────────────────────
		{
			id: 'grid',
			chapter: 'matrix',
			scene: 'journey',
			title: { es: 'Filas y columnas', en: 'Rows and columns' },
			subtitles: grid.list,
			motion: {
				cues: seq(
					clear(
						0,
						'ec',
						'oc-1',
						'fn-prom',
						'v-v',
						'v-n2',
						'v-suma',
						'su-40',
						'ring-v',
						'ch-same',
						'ch-szv',
						'ch-len',
						'v-n',
						'lb-puntos',
						...cells.map((i) => `c-${i}`),
						'cv-0-8',
						'cv-1-6',
						'cv-2-10',
						'cv-3-7',
						'cv-4-9',
						...lits,
						...modulesOf(rowC),
					),
					shot(0, 'shot-grid', 2400),
					{ at: 500, do: 'enter', el: 'ed' },
					run(800, 'd4'),
					reveal(1400, 400, 'mx-r0', 'mx-r1', 'mx-r2'),
					{ at: 2800, do: 'enter', el: 'ch-dims' },
					run(grid.start(1), 'd10'),
					{ at: grid.start(1) + 700, do: 'enter', el: 'lit-m12' },
					{ at: grid.start(1) + 1000, do: 'enter', el: 'ch-m12' },
					{ at: grid.start(1) + 1500, do: 'type', el: 'od-1', dur: 600 },
				),
			},
		},
		{
			id: 'rows',
			chapter: 'matrix',
			scene: 'journey',
			title: { es: 'Fila tras fila', en: 'Row after row' },
			subtitles: rows.list,
			motion: {
				cues: seq(
					clear(0, 'ch-dims', 'ch-m12'),
					shot(0, 'shot-rows', 2000),
					{ at: 600, do: 'move', el: 'mx-r0', to: 'a-r0', dur: 1800 },
					{ at: 800, do: 'move', el: 'mx-r2', to: 'a-r2', dur: 1800 },
					reveal(2700, 200, 'ch-f0', 'ch-f1', 'ch-f2'),
					run(rows.start(1), 'd11'),
					{ at: rows.start(1) + 600, do: 'draw', el: 'rule-row', dur: 900 },
					{ at: rows.start(1) + 1500, do: 'enter', el: 'ch-row' },
					{ at: rows.start(1) + 1900, do: 'type', el: 'od-2', dur: 700 },
					// The camera pulls back to reveal the whole matrix laid out in memory.
					{ at: rows.start(2), do: 'camera', to: ['shot-all'], dur: 3200, pad: 0 },
					{ at: rows.start(2) + 300, do: 'enter', el: 'fl-rows' },
					{ at: rows.start(2) + 500, do: 'flow', el: 'fl-rows' },
					{ at: rows.start(2) + 2000, do: 'pulse', el: 'mx-r1' },
				),
			},
		},
	],
};
