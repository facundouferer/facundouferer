import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Asking for memory and giving it back": a short film (about two minutes) for the C
// lesson "Memoria dinámica: malloc, calloc, realloc y free". It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/memoria-dinamica-c.astro`): the lesson's growing array on
// the left, and on the right two separate floors, the stack frame of `main` with its
// variables and the heap with its blocks, plus one module per instruction. A pointer is
// always an arrow from its variable to the first cell of a block; a block is a row of
// cells with the address on the front edge and the value on top. Magenta marks the
// problem (uninitialized cells, `NULL`, a dangling pointer); violet what resolves it
// (the `NULL` check, `free`, the zeros of `calloc`). The last scene swaps the editor for
// the lesson's `calloc` example and pulls back to the whole system.

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

/**
 * One instruction runs: the bar slides to its editor line, the execution flow reaches
 * its module and the module lights up. `program` 'b' is the `calloc` example.
 */
function exec(at: number, line: number, dur = 700, program: 'a' | 'b' = 'a'): MotionCue[] {
	const mod = program === 'a' ? `m-${line}` : `mb-${line}`;
	const lit = program === 'a' ? `on-${line}` : `onb-${line}`;
	const stop = program === 'a' ? `a-m${line}` : `a-mb${line}`;
	return [
		{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 600) },
		{ at, do: 'move', el: 'p', to: stop, dur },
		{ at: at + dur, do: 'enter', el: lit },
		{ at: at + dur, do: 'pulse', el: mod },
	];
}

/** A value on top of a plate or cell changes: the old text leaves, the new one arrives. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 300 },
	{ at: at + 250, do: 'enter', el: to },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const floors = timed(
	say(
		'La pila guarda las variables de `main`. El montículo (heap) es otro piso, hecho de bloques.',
		'The stack holds the variables of `main`. The heap is another floor, made of blocks.',
	),
	say(
		'Un bloque del montículo vive desde que lo pides hasta que llamas a `free`.',
		'A heap block lives from the moment you ask for it until you call `free`.',
	),
);
const reserve = timed(
	say(
		'`malloc(capacidad * sizeof *numeros)` pide bytes para 4 elementos del tamaño de un `int`.',
		'`malloc(capacity * sizeof *numbers)` asks for bytes for 4 elements the size of an `int`.',
	),
	say(
		'Devuelve la dirección del bloque y `numeros` la guarda. Las direcciones reales varían.',
		'It returns the address of the block and `numbers` stores it. Real addresses vary.',
	),
);
const check = timed(
	say(
		'Si no hay memoria, `malloc` devuelve `NULL`. Usar ese puntero sería comportamiento indefinido.',
		'If there is no memory, `malloc` returns `NULL`. Using that pointer would be undefined behavior.',
	),
	say(
		'Por eso cada reserva se comprueba: `numeros` no es `NULL` y la barrera se abre.',
		'So every allocation is checked: `numbers` is not `NULL` and the gate opens.',
	),
);
const fill = timed(
	say(
		'Llegan 5, 8, 13 y 2. Cada uno va a `numeros[cantidad]`: el bloque se usa como un arreglo.',
		'In come 5, 8, 13 and 2. Each goes to `numbers[count]`: the block is used as an array.',
	),
	say(
		'Con `sizeof *numeros` en lugar de `sizeof(int)`, el tamaño se ajusta solo si cambia el tipo.',
		'With `sizeof *numbers` instead of `sizeof(int)`, the size adjusts itself if the type changes.',
	),
);
const full = timed(
	say(
		'Llega el 7 y `cantidad == capacidad`: está lleno. `realloc` pide un bloque del doble.',
		'In comes 7 and `count == capacity`: it is full. `realloc` asks for a block twice as big.',
	),
	say(
		'Va a un puntero temporal, `nuevo`. Si `realloc` falla, devuelve `NULL` y el bloque viejo sigue válido.',
		'It goes to a temporary, `bigger`. On failure `realloc` returns `NULL` and the old block stays valid.',
	),
	say(
		'Con `numeros = realloc(numeros, ...)`, un fallo perdería la única dirección del bloque.',
		'With `numbers = realloc(numbers, ...)`, a failure would lose the block\'s only address.',
	),
);
const grow = timed(
	say(
		'Funcionó: el bloque nuevo puede estar en otra dirección. Los datos se copiaron y el viejo se liberó.',
		'It worked: the new block may be at another address. The data was copied and the old one released.',
	),
	say(
		'Recién ahora `numeros = nuevo` y la capacidad pasa a 8. Imprime `Leidos: 5 (capacidad 8)`.',
		'Only now `numbers = bigger` and the capacity becomes 8. It prints `Read: 5 (capacity 8)`.',
	),
);
const release = timed(
	say(
		'`free(numeros)` devuelve el bloque. `numeros` aún guarda su dirección: es un puntero colgante.',
		'`free(numbers)` gives the block back. `numbers` still holds its address: a dangling pointer.',
	),
	say(
		'Por eso se le asigna `NULL`: un uso posterior falla de forma predecible al comprobar `NULL`.',
		'That is why it is set to `NULL`: a later use fails predictably when it checks for `NULL`.',
	),
);
const zeros = timed(
	say(
		'Otro ejemplo: `calloc(dias, sizeof *ventas)` reserva 7 elementos con todos los bytes en cero.',
		'Another example: `calloc(days, sizeof *sales)` reserves 7 elements with every byte at zero.',
	),
	say(
		'Solo se escribe `ventas[2] = 15`; el resto ya vale 0. `free(ventas)` devuelve el bloque.',
		'Only `sales[2] = 15` is written; the rest is already 0. `free(sales)` gives it back.',
	),
	say(
		'Pedir, comprobar, usar y liberar cada bloque exactamente una vez.',
		'Ask, check, use, and release every block exactly once.',
	),
);

// The modules of the growing array, in the order they are built.
const MODULES_A = [2, 3, 4, 8, 9, 10, 11, 13, 14, 15, 17, 18, 20, 21, 22];
const MODULES_B = [2, 3, 4, 7, 8, 9, 11, 12];

/** One pass of the reading loop that stores `value` in cell `index` (no growth). */
function store(at: number, index: number): MotionCue[] {
	const pace = 420;
	return [
		...exec(at, 8, pace),
		...exec(at + pace + 80, 9, pace),
		...exec(at + 2 * (pace + 80), 17, pace),
		...swap(at + 2 * (pace + 80) + pace, `va-q${index}`, `va-${index}`),
		...exec(at + 3 * (pace + 80), 18, pace),
		...swap(at + 3 * (pace + 80) + pace, `val-cnt-${index}`, `val-cnt-${index + 1}`),
	];
}

export const script: AnimationScript = {
	chapters: [
		{ id: 'heap', label: { es: 'Pedir un bloque', en: 'Asking for a block' } },
		{ id: 'check', label: { es: 'Comprobar NULL', en: 'Checking for NULL' } },
		{ id: 'fill', label: { es: 'Usar el bloque', en: 'Using the block' } },
		{ id: 'grow', label: { es: 'Crecer con realloc', en: 'Growing with realloc' } },
		{ id: 'free', label: { es: 'Liberar con free', en: 'Releasing with free' } },
		{ id: 'calloc', label: { es: 'Ceros con calloc', en: 'Zeros with calloc' } },
	],
	steps: [
		// ─── Scene 1. Two floors, and a block that is asked for ──────────────
		{
			id: 'floors',
			chapter: 'heap',
			scene: 'journey',
			title: { es: 'La pila y el montículo', en: 'The stack and the heap' },
			subtitles: floors.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 1800),
					{ at: 200, do: 'enter', el: 'floor-stack' },
					{ at: 900, do: 'enter', el: 'floor-heap' },
					{ at: 1400, do: 'pulse', el: 'floor-heap' },
					{ at: 1800, do: 'enter', el: 'floor-prog' },
					MODULES_A.map((line, index) => ({ at: 2000 + index * 90, do: 'enter' as const, el: `m-${line}` })),
					{ at: 3400, do: 'enter', el: 'gt-4' },
					{ at: 3400, do: 'enter', el: 'gt-4-bar' },
					{ at: 3500, do: 'enter', el: 'gt-13' },
					{ at: 3500, do: 'enter', el: 'gt-13-bar' },
					shot(floors.start(1), 'shot-prog', 2000),
					{ at: floors.start(1) + 400, do: 'enter', el: 'hl' },
					{ at: floors.start(1) + 400, do: 'enter', el: 'p' },
					exec(floors.start(1) + 500, 2, 900),
					{ at: floors.start(1) + 1500, do: 'enter', el: 'v-cap' },
					{ at: floors.start(1) + 1700, do: 'type', el: 'val-cap-4', dur: 300 },
					{ at: floors.start(1) + 1900, do: 'enter', el: 'v-cnt' },
					{ at: floors.start(1) + 2100, do: 'type', el: 'val-cnt-0', dur: 300 },
					{ at: floors.start(1) + 3000, do: 'pulse', el: 'floor-stack' },
				),
			},
		},
		{
			id: 'malloc',
			chapter: 'heap',
			scene: 'journey',
			title: { es: 'malloc reserva un bloque', en: 'malloc reserves a block' },
			subtitles: reserve.list,
			motion: {
				cues: seq(
					shot(0, 'shot-malloc', 2000),
					exec(300, 3, 900),
					{ at: 1400, do: 'enter', el: 'lb-sizeof' },
					{ at: reserve.start(0) + 2600, do: 'enter', el: 'blk-a' },
					[0, 1, 2, 3].map((index) => ({ at: reserve.start(0) + 3000 + index * 150, do: 'enter' as const, el: `va-q${index}` })),
					{ at: reserve.start(0) + 3800, do: 'enter', el: 'lb-uninit' },
					{ at: reserve.start(1) + 200, do: 'exit', el: 'lb-sizeof', dur: 400 },
					{ at: reserve.start(1) + 300, do: 'enter', el: 'v-num' },
					{ at: reserve.start(1) + 600, do: 'type', el: 'val-num-a', dur: 500 },
					{ at: reserve.start(1) + 1200, do: 'draw', el: 'ptr-a', dur: 1000 },
					{ at: reserve.start(1) + 2400, do: 'pulse', el: 'blk-a' },
					{ at: reserve.start(1) + 2300, do: 'exit', el: 'lb-uninit', dur: 300 },
					{ at: reserve.start(1) + 2600, do: 'enter', el: 'lb-addr' },
				),
			},
		},

		// ─── Scene 2. The NULL check is a gate ─────────────────────────────────
		{
			id: 'check',
			chapter: 'check',
			scene: 'journey',
			title: { es: 'La reserva puede fallar', en: 'An allocation can fail' },
			subtitles: check.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-addr', dur: 400 },
					shot(100, 'shot-gate', 1800),
					{ at: 500, do: 'move', el: 'hl', to: 'ln-4', dur: 500 },
					{ at: 500, do: 'move', el: 'p', to: 'a-gate4', dur: 800 },
					{ at: 1400, do: 'pulse', el: 'gt-4-bar' },
					{ at: 1800, do: 'enter', el: 'lb-null' },
					{ at: check.start(1), do: 'exit', el: 'lb-null', dur: 400 },
					{ at: check.start(1) + 300, do: 'pulse', el: 'v-num' },
					{ at: check.start(1) + 1200, do: 'exit', el: 'gt-4-bar', dur: 400 },
					{ at: check.start(1) + 1400, do: 'enter', el: 'gt-4-open' },
					exec(check.start(1) + 1600, 4, 700),
				),
			},
		},

		// ─── Scene 3. The block is used as an array ────────────────────────────
		{
			id: 'fill',
			chapter: 'fill',
			scene: 'journey',
			title: { es: 'Llenar el bloque', en: 'Filling the block' },
			subtitles: fill.list,
			motion: {
				cues: seq(
					shot(0, 'shot-malloc', 1600),
					{ at: 200, do: 'type', el: 'o-in', dur: 900 },
					{ at: 600, do: 'exit', el: 'gt-4-open', dur: 400 },
					{ at: 600, do: 'enter', el: 'gt-4-bar' },
					store(1000, 0),
					store(2950, 1),
					store(4900, 2),
					store(6850, 3),
					{ at: fill.start(1) + 2500, do: 'enter', el: 'lb-sizeof' },
					{ at: fill.start(1) + 3000, do: 'pulse', el: 'blk-a' },
				),
			},
		},

		// ─── Scene 4. The array grows with realloc ─────────────────────────────
		{
			id: 'full',
			chapter: 'grow',
			scene: 'journey',
			title: { es: 'El bloque está lleno', en: 'The block is full' },
			subtitles: full.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-sizeof', dur: 400 },
					shot(0, 'shot-grow', 1800),
					exec(300, 8, 600),
					exec(1000, 9, 600),
					{ at: 1700, do: 'enter', el: 'lb-full' },
					{ at: 1700, do: 'pulse', el: 'blk-a' },
					exec(full.start(0) + 3200, 10, 500),
					exec(full.start(0) + 3800, 11, 600),
					// What would happen if it failed: NULL in the temporary, the old block intact.
					{ at: full.start(1) + 200, do: 'exit', el: 'lb-full', dur: 400 },
					{ at: full.start(1) + 400, do: 'enter', el: 'v-nuevo' },
					{ at: full.start(1) + 1800, do: 'enter', el: 'val-nuevo-null' },
					{ at: full.start(1) + 1800, do: 'enter', el: 'lb-fail' },
					{ at: full.start(1) + 2800, do: 'pulse', el: 'ptr-a' },
					{ at: full.start(1) + 3000, do: 'enter', el: 'lb-valid' },
					{ at: full.start(2) + 600, do: 'pulse', el: 'v-num' },
					{ at: full.start(2) + 1400, do: 'pulse', el: 'ptr-a' },
					{ at: full.start(2) + 3800, do: 'exit', el: 'val-nuevo-null', dur: 400 },
					{ at: full.start(2) + 3800, do: 'exit', el: 'lb-fail', dur: 400 },
					{ at: full.start(2) + 3800, do: 'exit', el: 'lb-valid', dur: 400 },
				),
			},
		},
		{
			id: 'grow',
			chapter: 'grow',
			scene: 'journey',
			title: { es: 'realloc con un puntero temporal', en: 'realloc through a temporary pointer' },
			subtitles: grow.list,
			motion: {
				cues: seq(
					shot(0, 'shot-heap', 1600),
					{ at: 300, do: 'pulse', el: 'm-11' },
					{ at: 500, do: 'enter', el: 'blk-b' },
					[4, 5, 6, 7].map((index) => ({ at: 900 + (index - 4) * 120, do: 'enter' as const, el: `vb-q${index}` })),
					{ at: 1400, do: 'draw', el: 'cp-ab', dur: 1000 },
					[0, 1, 2, 3].map((index) => ({ at: 2000 + index * 200, do: 'enter' as const, el: `vb-${index}` })),
					{ at: 3000, do: 'enter', el: 'rel-a' },
					{ at: 3200, do: 'enter', el: 'lb-rel-a' },
					{ at: 3400, do: 'exit', el: 'ptr-a', dur: 400 },
					{ at: 3400, do: 'enter', el: 'dg-a' },
					{ at: 4000, do: 'type', el: 'val-nuevo', dur: 500 },
					{ at: 4600, do: 'draw', el: 'ptr-nb', dur: 900 },
					// Only once the check passes does the old pointer take the new address.
					shot(grow.start(1), 'shot-grow', 1400),
					{ at: grow.start(1), do: 'exit', el: 'gt-13-bar', dur: 300 },
					{ at: grow.start(1) + 200, do: 'enter', el: 'gt-13-open' },
					exec(grow.start(1), 13, 500),
					exec(grow.start(1) + 600, 14, 500),
					{ at: grow.start(1) + 1100, do: 'exit', el: 'dg-a', dur: 300 },
					swap(grow.start(1) + 1100, 'val-num-a', 'val-num-b'),
					{ at: grow.start(1) + 1300, do: 'draw', el: 'ptr-b', dur: 700 },
					exec(grow.start(1) + 1500, 15, 500),
					swap(grow.start(1) + 2000, 'val-cap-4', 'val-cap-8'),
					// `nuevo` lives in the `if` block: it disappears at its closing brace.
					{ at: grow.start(1) + 2500, do: 'exit', el: 'ptr-nb', dur: 400 },
					{ at: grow.start(1) + 2500, do: 'exit', el: 'val-nuevo', dur: 400 },
					{ at: grow.start(1) + 2600, do: 'exit', el: 'v-nuevo', dur: 400 },
					{ at: grow.start(1) + 2600, do: 'exit', el: 'gt-13-open', dur: 300 },
					{ at: grow.start(1) + 2800, do: 'enter', el: 'gt-13-bar' },
					exec(grow.start(1) + 2700, 17, 500),
					swap(grow.start(1) + 3200, 'vb-q4', 'vb-4'),
					exec(grow.start(1) + 3500, 18, 500),
					swap(grow.start(1) + 4000, 'val-cnt-4', 'val-cnt-5'),
					exec(grow.start(1) + 4300, 8, 500),
					exec(grow.start(1) + 4900, 20, 600),
					{ at: grow.start(1) + 5500, do: 'type', el: 'o-out', dur: 900 },
				),
			},
		},

		// ─── Scene 5. free gives the block back ────────────────────────────────
		{
			id: 'free',
			chapter: 'free',
			scene: 'journey',
			title: { es: 'free y después NULL', en: 'free, then NULL' },
			subtitles: release.list,
			motion: {
				cues: seq(
					shot(0, 'shot-grow', 1600),
					exec(200, 21, 800),
					{ at: 1200, do: 'enter', el: 'rel-b' },
					{ at: 1400, do: 'enter', el: 'lb-rel-b' },
					{ at: 2200, do: 'exit', el: 'ptr-b', dur: 400 },
					{ at: 2300, do: 'enter', el: 'dg-b' },
					{ at: 2800, do: 'pulse', el: 'val-num-b' },
					{ at: 3200, do: 'enter', el: 'lb-dangling' },
					exec(release.start(1) + 300, 22, 700),
					{ at: release.start(1) + 1000, do: 'exit', el: 'dg-b', dur: 400 },
					{ at: release.start(1) + 1000, do: 'exit', el: 'lb-dangling', dur: 400 },
					swap(release.start(1) + 1000, 'val-num-b', 'val-num-null'),
					{ at: release.start(1) + 1700, do: 'pulse', el: 'v-num' },
					{ at: release.start(1) + 2600, do: 'move', el: 'hl', to: 'ln-23', dur: 500 },
				),
			},
		},

		// ─── Scene 6. calloc starts at zero; the whole system ──────────────────
		{
			id: 'calloc',
			chapter: 'calloc',
			scene: 'journey',
			title: { es: 'calloc pone todo en cero', en: 'calloc sets everything to zero' },
			subtitles: zeros.list,
			motion: {
				cues: seq(
					// The first program has ended: its frame and its modules are gone.
					[
						'v-cap', 'v-num', 'v-cnt', 'val-cap-8', 'val-num-null', 'val-cnt-5', 'ed-a', 'file-a', 'o-in', 'o-out', 'p',
						'gt-4', 'gt-4-bar', 'gt-13', 'gt-13-bar', 'lb-rel-a', 'lb-rel-b',
					].map(
						(el) => ({ at: 0, do: 'exit' as const, el, dur: 400 }),
					),
					MODULES_A.flatMap((line) => [
						{ at: 100, do: 'exit' as const, el: `m-${line}`, dur: 400 },
						{ at: 100, do: 'exit' as const, el: `on-${line}`, dur: 400 },
					]),
					{ at: 600, do: 'enter', el: 'ed-b' },
					{ at: 600, do: 'enter', el: 'file-b' },
					shot(300, 'shot-calloc', 1800),
					MODULES_B.map((line, index) => ({ at: 700 + index * 90, do: 'enter' as const, el: `mb-${line}` })),
					{ at: 1400, do: 'enter', el: 'gtb-4' },
					{ at: 1400, do: 'enter', el: 'gtb-4-bar' },
					{ at: 1500, do: 'move', el: 'p', to: 'a-mb2', dur: 1 },
					{ at: 1600, do: 'enter', el: 'p' },
					exec(1600, 2, 500, 'b'),
					{ at: 2100, do: 'enter', el: 'v-dias' },
					{ at: 2300, do: 'type', el: 'val-dias', dur: 200 },
					exec(2700, 3, 700, 'b'),
					{ at: 3400, do: 'enter', el: 'blk-c' },
					[0, 1, 2, 3, 4, 5, 6].map((index) => ({ at: 3700 + index * 100, do: 'enter' as const, el: `vc-${index}` })),
					{ at: 4400, do: 'enter', el: 'lb-zero' },
					{ at: 4600, do: 'enter', el: 'v-ventas' },
					{ at: 4800, do: 'type', el: 'val-ventas', dur: 400 },
					{ at: 5300, do: 'draw', el: 'ptr-c', dur: 800 },
					{ at: zeros.start(1), do: 'exit', el: 'gtb-4-bar', dur: 300 },
					{ at: zeros.start(1) + 200, do: 'enter', el: 'gtb-4-open' },
					exec(zeros.start(1), 4, 500, 'b'),
					exec(zeros.start(1) + 600, 7, 500, 'b'),
					swap(zeros.start(1) + 1100, 'vc-2', 'vc-15'),
					exec(zeros.start(1) + 1500, 8, 400, 'b'),
					exec(zeros.start(1) + 2000, 9, 400, 'b'),
					[1, 2, 3, 4, 5, 6, 7].map((row) => ({ at: zeros.start(1) + 2300 + (row - 1) * 220, do: 'type' as const, el: `o-b${row}`, dur: 200 })),
					exec(zeros.start(1) + 4000, 11, 600, 'b'),
					{ at: zeros.start(1) + 4600, do: 'enter', el: 'rel-c' },
					{ at: zeros.start(1) + 4700, do: 'exit', el: 'ptr-c', dur: 400 },
					{ at: zeros.start(1) + 4800, do: 'enter', el: 'lb-rel-c' },
					{ at: zeros.start(1) + 4800, do: 'exit', el: 'lb-zero', dur: 300 },
					// The camera pulls back: three blocks asked for, three blocks given back.
					exec(zeros.start(2), 12, 500, 'b'),
					shot(zeros.start(2) + 300, 'shot-all', 2800),
					{ at: zeros.start(2) + 600, do: 'flow', el: 'cp-ab' },
					{ at: zeros.start(2) + 1200, do: 'pulse', el: 'rel-a' },
					{ at: zeros.start(2) + 1600, do: 'pulse', el: 'rel-b' },
					{ at: zeros.start(2) + 2000, do: 'pulse', el: 'rel-c' },
					{ at: zeros.start(2) + 2800, do: 'exit', el: 'hl', dur: 400 },
				),
			},
		},
	],
};
