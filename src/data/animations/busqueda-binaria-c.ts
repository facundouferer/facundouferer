import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Halving the search": a short film (about two minutes) for the C lesson "Búsqueda de
// datos en arreglos". It plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/busqueda-binaria-c.astro`): the program on the left, and
// on the right an isometric row of cells, each with its index on the front edge and its
// value on top. The linear search is a cursor `i` that visits the cells one by one; the
// binary search keeps two markers, `inicio` and `fin`, around the zone where the key can
// still be, and a third one, `medio`, on the cell it compares. A discarded cell darkens.
// A counter beside the row counts comparisons. One module per instruction stands in
// front of the row, labelled with its editor line, and the light blue particle is the
// execution flow. Magenta marks the problem (the unsorted array, the overflowing sum);
// violet what resolves it (the markers, the cell found, the safe middle).

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

/** Replaces a value shown on a cell: the old one fades, the new one appears. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 250 },
	{ at: at + 150, do: 'enter', el: to, dur: 400 },
];

/** Slides a marker to a cell. */
const slide = (at: number, el: string, to: string, dur = 600): MotionCue => ({ at, do: 'move', el, to, dur });

/**
 * Runs the instruction of module `id` (program letter + editor line): slides the bar
 * to its line, builds the module the first time, sends the particle to it and lights
 * it. `fast` halves the moves, for loops that repeat many times.
 */
const run = (at: number, id: string, build = true, fast = false): MotionCue[] => {
	const line = id.slice(1);
	const hop = fast ? 220 : 600;
	const lead = fast ? 50 : 100;
	return [
		{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: fast ? 200 : 450 },
		...(build ? [{ at: at + lead, do: 'enter' as const, el: `m-${id}` }] : []),
		{ at: at + lead, do: 'move', el: 'px', to: `a-m${id}`, dur: hop },
		build ? { at: at + lead + hop, do: 'enter', el: `on-${id}` } : { at: at + lead + hop, do: 'pulse', el: `m-${id}`, dur: fast ? 300 : 600 },
	];
};

const rowA = [0, 1, 2, 3, 4];
const rowB = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const modulesA = ['a13', 'a14', 'a15', 'a4', 'a5', 'a6', 'a16', 'a17', 'a19', 'a9', 'a20'];
const modulesOf = (ids: string[]) => ids.flatMap((id) => [`m-${id}`, `on-${id}`]);

// ─── Captions ───────────────────────────────────────────────────────────────
const scan = timed(
	say('`buscar_lineal` mira `numeros` celda por celda, desde el índice 0.', '`linear_search` checks `numbers` cell by cell, from index 0.'),
	say('Compara cada `v[i]` con la clave 8, una vez por celda.', 'Each `v[i]` is compared with the key 8, once per cell.'),
	say('En la tercera, `v[2] == 8`: `return 2` corta la búsqueda.', 'On the third, `v[2] == 8`: `return 2` ends the search.'),
);
const miss = timed(
	say('Ahora busca 4: revisa las cinco celdas y ninguna coincide.', 'Now it looks for 4: all five cells, no match.'),
	say('Sin coincidencia, `return -1`: ningún índice válido es negativo.', 'No match, so `return -1`: no valid index is negative.'),
	say('En el peor caso, `n` comparaciones: la búsqueda lineal es `O(n)`.', 'Worst case, `n` comparisons: linear search is `O(n)`.'),
);
const zone = timed(
	say('La binaria exige un arreglo ordenado: `v` va de 2 a 91.', 'Binary search needs a sorted array: `v` runs 2 to 91.'),
	say('`inicio` y `fin` marcan la zona donde la clave puede estar.', '`low` and `high` mark the zone where the key can be.'),
	say('`v[medio]` es 16, menor que 23: se descarta la mitad izquierda.', '`v[mid]` is 16, less than 23: the left half is discarded.'),
);
const found = timed(
	say('Ahora `v[7]` es 56, mayor que 23: `fin = 6`.', 'Now `v[7]` is 56, greater than 23: `high = 6`.'),
	say('`medio` es 5 y `v[5] == 23`: devuelve 5.', '`mid` is 5 and `v[5] == 23`: it returns 5.'),
	say('Tres comparaciones en lugar de las seis de la búsqueda lineal.', 'Three comparisons instead of the six of linear search.'),
);
const empty = timed(
	say('Buscar 40: la zona se achica en cada vuelta y no aparece.', 'Searching for 40: the zone shrinks each pass, no match.'),
	say('`inicio` pasa a 7 con `fin` en 6: `inicio > fin`, la zona quedó vacía.', '`low` becomes 7 with `high` at 6: `low > high`, the zone is empty.'),
	say('El `while` termina y la función devuelve -1.', 'The `while` ends and the function returns -1.'),
);
const unsorted = timed(
	say('Descartar supone que a la izquierda de `medio` todo es menor.', 'Discarding assumes everything left of `mid` is smaller.'),
	say('En `{10, 5, 8, 2, 7}`, buscar 10 descarta su propia celda.', 'In `{10, 5, 8, 2, 7}`, searching 10 discards its own cell.'),
	say('Devuelve -1 sin error: el arreglo tiene que estar ordenado.', 'It returns -1, no error: the array has to be sorted.'),
);
const growth = timed(
	say('Lineal: hasta `n` celdas. Binaria: parte la zona en dos.', 'Linear: up to `n` cells. Binary: halves the zone.'),
	say('Con `n = 1024` y la clave al final: lineal 1024 pasos, binaria 11.', 'With `n = 1024`, key at the end: linear 1024 steps, binary 11.'),
	say('Con el doble de datos, la binaria suma un solo paso: `O(log n)`.', 'Double the data and binary adds a single step: `O(log n)`.'),
);
const middle = timed(
	say('Con índices grandes, `inicio + fin` puede superar `INT_MAX`.', 'With large indexes, `low + high` can exceed `INT_MAX`.'),
	say('Desbordar `int` es comportamiento indefinido; `fin - inicio` sí entra.', 'Overflowing `int` is undefined behavior; `high - low` does fit.'),
	say('`inicio + (fin - inicio) / 2` nunca pasa de `fin`: es la forma segura.', '`low + (high - low) / 2` never goes past `high`: write the safe form.'),
);

// ─── Loops ──────────────────────────────────────────────────────────────────

/** One pass of the linear `for`: the cursor reaches cell `i`, compares it and counts it. */
const linearPass = (at: number, i: number, gap: number, first: boolean): MotionCue[] => [
	...run(at, 'a4', first, !first),
	first ? { at: at + 300, do: 'enter', el: 'pin-i' } : slide(at + 100, 'pin-i', `a-ca${i}`, 400),
	...run(at + gap * 0.4, 'a5', first, !first),
	{ at: at + gap * 0.4 + 400, do: 'enter', el: `lit-ca${i}`, dur: 300 },
	...swap(at + gap * 0.4 + 450, `k-${i}`, `k-${i + 1}`),
];

/**
 * One pass of the binary `while` over row `row` (`ca` or `cb`): `medio` lands on `mid`,
 * the cell is compared and counted, and the half that cannot hold the key darkens while
 * `inicio` or `fin` moves past `medio`. `goRight` is the result of `v[medio] < clave`.
 */
type Pass = { mid: number; goRight: boolean; dims: number[]; count: number };
const binaryPass = (at: number, row: 'ca' | 'cb', pass: Pass, gap: number): MotionCue[] => {
	const step = gap / 5;
	const marker = pass.goRight ? 'pin-lo' : 'pin-hi';
	const target = pass.goRight ? pass.mid + 1 : pass.mid - 1;
	return [
		...run(at, 'b6', false, true),
		...run(at + step, 'b7', false, true),
		slide(at + step + 200, 'pin-mid', `a-${row}${pass.mid}`, 400),
		...run(at + step * 2, 'b8', false, true),
		{ at: at + step * 2 + 300, do: 'enter', el: `lit-${row}${pass.mid}`, dur: 250 },
		...swap(at + step * 2 + 300, `k-${pass.count - 1}`, `k-${pass.count}`),
		...run(at + step * 3, 'b11', false, true),
		...run(at + step * 4, pass.goRight ? 'b12' : 'b14', false, true),
		...reveal(at + step * 4 + 250, 40, ...pass.dims.map((i) => `dim-${row}${i}`)),
		slide(at + step * 4 + 250, marker, `a-${row}${target}`, 450),
		{ at: at + gap - 150, do: 'exit', el: `lit-${row}${pass.mid}`, dur: 200 },
	];
};

// The search for 40: four comparisons, then the zone is empty.
const EMPTY_GAP = 1350;
const EMPTY_START = 1900;
const emptyPasses: Pass[] = [
	{ mid: 4, goRight: true, dims: [0, 1, 2, 3, 4], count: 1 },
	{ mid: 7, goRight: false, dims: [7, 8, 9], count: 2 },
	{ mid: 5, goRight: true, dims: [5], count: 3 },
	{ mid: 6, goRight: true, dims: [6], count: 4 },
];

// The search for 10 in the unsorted array: the first pass throws away the cell it is in.
const UNSORTED_GAP = 1500;
const unsortedPasses: Pass[] = [
	{ mid: 2, goRight: true, dims: [0, 1, 2], count: 1 },
	{ mid: 3, goRight: true, dims: [3], count: 2 },
	{ mid: 4, goRight: true, dims: [4], count: 3 },
];

export const script: AnimationScript = {
	chapters: [
		{ id: 'linear', label: { es: 'Búsqueda lineal', en: 'Linear search' } },
		{ id: 'halve', label: { es: 'Descartar la mitad', en: 'Discarding half' } },
		{ id: 'empty', label: { es: 'La zona vacía', en: 'The empty zone' } },
		{ id: 'sorted', label: { es: 'Por qué ordenado', en: 'Why sorted' } },
		{ id: 'growth', label: { es: 'Contar pasos', en: 'Counting steps' } },
		{ id: 'middle', label: { es: 'El medio seguro', en: 'The safe middle' } },
	],
	steps: [
		// ─── Scene 1. Linear search ─────────────────────────────────────────
		{
			id: 'scan',
			chapter: 'linear',
			scene: 'journey',
			title: { es: 'Mirar celda por celda', en: 'Checking cell by cell' },
			subtitles: scan.list,
			motion: {
				cues: seq(
					shot(0, 'shot-a', 3000),
					Array.from({ length: 23 }, (_, i): MotionCue => ({ at: 150 + i * 100, do: 'type', el: `ea-${i + 1}`, dur: 250 })),
					{ at: 2500, do: 'enter', el: 'plate' },
					{ at: 2600, do: 'move', el: 'hl', to: 'ln-13', dur: 1 },
					{ at: 2700, do: 'enter', el: 'hl' },
					{ at: 2800, do: 'enter', el: 'm-a13' },
					{ at: 2800, do: 'move', el: 'px', to: 'a-ma13', dur: 1 },
					{ at: 2900, do: 'enter', el: 'px' },
					{ at: 3300, do: 'enter', el: 'on-a13' },
					reveal(3400, 160, ...rowA.map((i) => `ca-${i}`)),
					run(scan.start(1) - 1400, 'a14'),
					run(scan.start(1) - 700, 'a15'),
					reveal(scan.start(1) - 100, 150, 'v-clave', 'cl-8', 'v-pasos', 'k-0'),
					linearPass(scan.start(1) + 600, 0, 2000, true),
					{ at: scan.start(1) + 2500, do: 'exit', el: 'lit-ca0', dur: 250 },
					linearPass(scan.start(1) + 2600, 1, 1500, false),
					{ at: scan.start(1) + 4000, do: 'exit', el: 'lit-ca1', dur: 250 },
					linearPass(scan.start(2), 2, 1500, false),
					run(scan.start(2) + 1300, 'a6'),
					{ at: scan.start(2) + 1900, do: 'enter', el: 'hit-ca2' },
					{ at: scan.start(2) + 2100, do: 'enter', el: 'ch-ret2' },
					run(scan.start(2) + 2600, 'a16'),
					run(scan.start(2) + 3200, 'a17'),
					{ at: scan.start(2) + 3800, do: 'type', el: 'oa-1', dur: 700 },
				),
			},
		},
		{
			id: 'miss',
			chapter: 'linear',
			scene: 'journey',
			title: { es: 'Si no está, devuelve -1', en: 'If it is not there, it returns -1' },
			subtitles: miss.list,
			motion: {
				cues: seq(
					clear(0, 'hit-ca2', 'lit-ca2', 'ch-ret2', 'k-3', 'cl-8'),
					run(200, 'a19'),
					{ at: 800, do: 'enter', el: 'cl-4' },
					{ at: 900, do: 'enter', el: 'k-0' },
					...rowA.flatMap((i) => [
						...linearPass(1500 + i * 1100, i, 1100, false),
						{ at: 1500 + i * 1100 + 1000, do: 'exit' as const, el: `lit-ca${i}`, dur: 200 },
					]),
					{ at: 7100, do: 'move', el: 'hl', to: 'ln-4', dur: 250 },
					slide(7100, 'pin-i', 'a-ca5', 500),
					{ at: 7400, do: 'enter', el: 'ghost-a' },
					run(7700, 'a9'),
					{ at: 8300, do: 'enter', el: 'ch-retm1' },
					run(8800, 'a20'),
					{ at: 9400, do: 'type', el: 'oa-2', dur: 700 },
					{ at: miss.start(2) + 200, do: 'draw', el: 'fl-scan', dur: 1600 },
					{ at: miss.start(2) + 1200, do: 'pulse', el: 'k-5' },
					{ at: miss.start(2) + 1600, do: 'enter', el: 'ch-on' },
				),
			},
		},

		// ─── Scene 2. Binary search: discard half ───────────────────────────
		{
			id: 'zone',
			chapter: 'halve',
			scene: 'journey',
			title: { es: 'Una zona entre inicio y fin', en: 'A zone between low and high' },
			subtitles: zone.list,
			motion: {
				cues: seq(
					clear(
						0,
						'ea',
						'oa-1',
						'oa-2',
						'pin-i',
						'ghost-a',
						'fl-scan',
						'ch-on',
						'ch-retm1',
						'cl-4',
						'k-5',
						...rowA.flatMap((i) => [`ca-${i}`, `lit-ca${i}`]),
						...modulesOf(modulesA),
					),
					shot(0, 'shot-b', 2400),
					{ at: 500, do: 'enter', el: 'eb' },
					run(700, 'b21'),
					reveal(1200, 100, ...rowB.map((i) => `cb-${i}`)),
					{ at: 2400, do: 'enter', el: 'ch-sorted' },
					run(3000, 'b22'),
					run(3600, 'b23'),
					{ at: 4200, do: 'enter', el: 'cl-23' },
					{ at: 4300, do: 'enter', el: 'k-0' },
					clear(zone.start(1), 'ch-sorted'),
					run(zone.start(1) + 200, 'b4'),
					{ at: zone.start(1) + 700, do: 'enter', el: 'pin-lo' },
					run(zone.start(1) + 1300, 'b5'),
					{ at: zone.start(1) + 1800, do: 'enter', el: 'pin-hi' },
					shot(zone.start(1) + 2200, 'shot-zone', 2200),
					run(zone.start(2), 'b6'),
					run(zone.start(2) + 600, 'b7'),
					{ at: zone.start(2) + 1100, do: 'enter', el: 'pin-mid' },
					{ at: zone.start(2) + 1300, do: 'enter', el: 'ch-mid4' },
					run(zone.start(2) + 1900, 'b8'),
					{ at: zone.start(2) + 2500, do: 'enter', el: 'lit-cb4' },
					swap(zone.start(2) + 2500, 'k-0', 'k-1'),
					{ at: zone.start(2) + 2700, do: 'enter', el: 'ch-cmp1' },
					run(zone.start(2) + 3300, 'b11'),
					run(zone.start(2) + 3900, 'b12'),
					reveal(zone.start(2) + 4400, 80, ...[0, 1, 2, 3, 4].map((i) => `dim-cb${i}`)),
					slide(zone.start(2) + 4500, 'pin-lo', 'a-cb5', 700),
				),
			},
		},
		{
			id: 'found',
			chapter: 'halve',
			scene: 'journey',
			title: { es: 'Cada comparación descarta la mitad', en: 'Each comparison discards half' },
			subtitles: found.list,
			motion: {
				cues: seq(
					clear(0, 'ch-mid4', 'ch-cmp1', 'lit-cb4'),
					run(300, 'b6', false),
					run(900, 'b7', false),
					slide(1300, 'pin-mid', 'a-cb7', 600),
					run(1700, 'b8', false),
					{ at: 2200, do: 'enter', el: 'lit-cb7' },
					swap(2200, 'k-1', 'k-2'),
					{ at: 2400, do: 'enter', el: 'ch-cmp2' },
					run(3000, 'b11', false),
					run(3500, 'b14'),
					reveal(4000, 80, ...[7, 8, 9].map((i) => `dim-cb${i}`)),
					slide(4100, 'pin-hi', 'a-cb6', 700),
					clear(found.start(1), 'lit-cb7', 'ch-cmp2'),
					shot(found.start(1), 'shot-hit', 1800),
					run(found.start(1) + 200, 'b7', false),
					slide(found.start(1) + 600, 'pin-mid', 'a-cb5', 500),
					run(found.start(1) + 1100, 'b8', false),
					{ at: found.start(1) + 1600, do: 'enter', el: 'hit-cb5' },
					swap(found.start(1) + 1600, 'k-2', 'k-3'),
					run(found.start(1) + 2000, 'b9'),
					{ at: found.start(1) + 2500, do: 'enter', el: 'ch-ret5' },
					run(found.start(2), 'b23', false),
					{ at: found.start(2) + 500, do: 'type', el: 'ob-1', dur: 700 },
					shot(found.start(2) + 300, 'shot-b', 2000),
					{ at: found.start(2) + 900, do: 'draw', el: 'fl-jumps', dur: 1400 },
					{ at: found.start(2) + 2400, do: 'enter', el: 'ch-3v6' },
					{ at: found.start(2) + 2800, do: 'pulse', el: 'k-3' },
				),
			},
		},

		// ─── Scene 3. The empty zone ────────────────────────────────────────
		{
			id: 'empty',
			chapter: 'empty',
			scene: 'journey',
			title: { es: 'La zona vacía devuelve -1', en: 'An empty zone returns -1' },
			subtitles: empty.list,
			motion: {
				cues: seq(
					clear(0, 'hit-cb5', 'ch-ret5', 'ch-3v6', 'fl-jumps', 'cl-23', 'k-3', ...[0, 1, 2, 3, 4, 7, 8, 9].map((i) => `dim-cb${i}`)),
					run(300, 'b24'),
					{ at: 800, do: 'enter', el: 'cl-40' },
					{ at: 900, do: 'enter', el: 'k-0' },
					run(1000, 'b4', false, true),
					slide(1100, 'pin-lo', 'a-cb0', 500),
					run(1300, 'b5', false, true),
					slide(1400, 'pin-hi', 'a-cb9', 500),
					emptyPasses.flatMap((pass, index) => binaryPass(EMPTY_START + index * EMPTY_GAP, 'cb', pass, EMPTY_GAP)),
					// After the fourth pass `inicio` has crossed `fin`: the loop condition fails.
					run(EMPTY_START + emptyPasses.length * EMPTY_GAP + 100, 'b6', false),
					{ at: EMPTY_START + emptyPasses.length * EMPTY_GAP + 700, do: 'enter', el: 'ch-empty' },
					{ at: EMPTY_START + emptyPasses.length * EMPTY_GAP + 1100, do: 'pulse', el: 'pin-lo' },
					{ at: EMPTY_START + emptyPasses.length * EMPTY_GAP + 1400, do: 'pulse', el: 'pin-hi' },
					run(empty.start(2), 'b17'),
					{ at: empty.start(2) + 500, do: 'enter', el: 'ch-retm1b' },
					run(empty.start(2) + 1000, 'b24', false),
					{ at: empty.start(2) + 1500, do: 'type', el: 'ob-2', dur: 600 },
				),
			},
		},

		// ─── Scene 4. Why the array must be sorted ──────────────────────────
		{
			id: 'unsorted',
			chapter: 'sorted',
			scene: 'journey',
			title: { es: 'Sin orden, responde mal', en: 'Unsorted, it answers wrong' },
			subtitles: unsorted.list,
			motion: {
				cues: seq(
					clear(
						0,
						'ch-empty',
						'ch-retm1b',
						'ob-1',
						'ob-2',
						'pin-lo',
						'pin-hi',
						'pin-mid',
						'cl-40',
						'k-4',
						...rowB.flatMap((i) => [`cb-${i}`, `dim-cb${i}`]),
					),
					shot(0, 'shot-a', 2400),
					reveal(600, 120, ...rowA.map((i) => `ca-${i}`)),
					{ at: 1300, do: 'enter', el: 'ch-call10' },
					{ at: 1500, do: 'enter', el: 'cl-10' },
					{ at: 1600, do: 'enter', el: 'k-0' },
					slide(1600, 'pin-lo', 'a-ca0', 1),
					slide(1600, 'pin-hi', 'a-ca4', 1),
					slide(1600, 'pin-mid', 'a-ca2', 1),
					run(1800, 'b4', false, true),
					{ at: 2000, do: 'enter', el: 'pin-lo' },
					run(2300, 'b5', false, true),
					{ at: 2500, do: 'enter', el: 'pin-hi' },
					run(2900, 'b7', false),
					{ at: 3300, do: 'enter', el: 'pin-mid' },
					{ at: 3800, do: 'enter', el: 'ch-assume' },
					binaryPass(unsorted.start(1), 'ca', unsortedPasses[0], UNSORTED_GAP),
					{ at: unsorted.start(1) + UNSORTED_GAP, do: 'enter', el: 'miss-ca0' },
					{ at: unsorted.start(1) + UNSORTED_GAP + 300, do: 'pulse', el: 'miss-ca0' },
					unsortedPasses.slice(1).flatMap((pass, index) => binaryPass(unsorted.start(1) + (index + 1) * UNSORTED_GAP + 400, 'ca', pass, UNSORTED_GAP)),
					run(unsorted.start(2), 'b6', false),
					run(unsorted.start(2) + 600, 'b17', false),
					{ at: unsorted.start(2) + 1200, do: 'enter', el: 'ch-bad' },
					{ at: unsorted.start(2) + 1800, do: 'pulse', el: 'miss-ca0' },
				),
			},
		},

		// ─── Scene 5. Counting steps ────────────────────────────────────────
		{
			id: 'growth',
			chapter: 'growth',
			scene: 'journey',
			title: { es: 'O(n) frente a O(log n)', en: 'O(n) versus O(log n)' },
			subtitles: growth.list,
			motion: {
				cues: seq(
					clear(
						0,
						'ch-assume',
						'ch-call10',
						'ch-bad',
						'miss-ca0',
						'pin-lo',
						'pin-hi',
						'pin-mid',
						'cl-10',
						'k-3',
						'v-clave',
						'v-pasos',
						...rowA.flatMap((i) => [`ca-${i}`, `dim-ca${i}`]),
					),
					shot(0, 'shot-all', 2600),
					reveal(500, 80, ...rowB.map((i) => `cb-${i}`)),
					{ at: 1600, do: 'draw', el: 'fl-lin', dur: 1800 },
					// fl-jumps left the canvas in scene 3: after an exit it comes back only with enter.
					{ at: 3200, do: 'enter', el: 'fl-jumps' },
					shot(growth.start(1), 'shot-tower', 2200),
					{ at: growth.start(1) + 300, do: 'enter', el: 'tw-plate' },
					{ at: growth.start(1) + 900, do: 'enter', el: 'tw-lin' },
					{ at: growth.start(1) + 1500, do: 'enter', el: 'ch-lin' },
					{ at: growth.start(1) + 2400, do: 'enter', el: 'tw-bin' },
					{ at: growth.start(1) + 3000, do: 'enter', el: 'ch-bin' },
					{ at: growth.start(2) + 300, do: 'enter', el: 'ch-double' },
					{ at: growth.start(2) + 1200, do: 'pulse', el: 'tw-lin' },
					{ at: growth.start(2) + 1900, do: 'pulse', el: 'tw-bin' },
				),
			},
		},

		// ─── Scene 6. The middle without overflow ───────────────────────────
		{
			id: 'middle',
			chapter: 'middle',
			scene: 'journey',
			title: { es: 'El medio sin desbordamiento', en: 'The middle without overflow' },
			subtitles: middle.list,
			motion: {
				cues: seq(
					clear(0, 'tw-lin', 'tw-bin', 'ch-lin', 'ch-bin', 'ch-double', 'fl-lin', 'fl-jumps'),
					run(300, 'b7', false),
					{ at: 900, do: 'enter', el: 'ch-big' },
					{ at: 1700, do: 'enter', el: 'g-max' },
					{ at: 2100, do: 'enter', el: 'ch-max' },
					{ at: 3200, do: 'enter', el: 'g-sum' },
					{ at: 3600, do: 'enter', el: 'ch-sum' },
					{ at: middle.start(1) + 200, do: 'enter', el: 'ch-ub' },
					{ at: middle.start(1) + 600, do: 'pulse', el: 'g-sum' },
					{ at: middle.start(1) + 2400, do: 'enter', el: 'ch-diff' },
					clear(middle.start(2), 'g-sum', 'ch-sum', 'ch-ub'),
					{ at: middle.start(2) + 300, do: 'enter', el: 'g-safe' },
					{ at: middle.start(2) + 800, do: 'enter', el: 'ch-safe' },
					run(middle.start(2) + 1200, 'b7', false),
					// The camera pulls back to reveal the whole row and the jumps the search took.
					{ at: middle.start(2) + 1800, do: 'camera', to: ['shot-all'], dur: 3200, pad: 0 },
					{ at: middle.start(2) + 2200, do: 'enter', el: 'fl-jumps' },
					{ at: middle.start(2) + 2400, do: 'flow', el: 'fl-jumps' },
					{ at: middle.start(2) + 3600, do: 'pulse', el: 'cb-5' },
				),
			},
		},
	],
};
