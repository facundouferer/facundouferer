import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of an algorithm: contract, invariant and O(log n)": a short film (about
// two minutes) for the Java lesson "Algoritmos: Especificación, Verificación y
// Complejidad" (lesson 6). It plays on a single persistent canvas (`data-scene="journey"`
// in `src/components/animaciones/algoritmia-complejidad-java.astro`): an isometric
// system where the sorted array is a row of indexed modules, a light blue particle is
// the execution flow, a magenta trail shows the linear O(n) scan cost, and a violet
// invariant bracket shows binary search halving the space in O(log n) steps.

const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

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

/** Types the editor lines `from`..`to` of one page (`ea` or `eb`), one after the other. */
const typeLines = (at: number, page: 'ea' | 'eb', from: number, to: number, gap: number): MotionCue[] =>
	Array.from({ length: to - from + 1 }, (_, index) => ({
		at: at + index * gap,
		do: 'type' as const,
		el: `${page}-${from + index}`,
		dur: Math.max(200, gap),
	}));

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

// ─── Captions ───────────────────────────────────────────────────────────────
const contract = timed(
	say(
		'Un algoritmo empieza con un contrato verificable: entradas, precondición y postcondición.',
		'An algorithm starts with a verifiable contract: inputs, precondition, and postcondition.',
	),
	say(
		'La precondición exige que `ordenados` no sea `null` y esté en orden ascendente.',
		'The precondition requires that `sorted` is not `null` and is in ascending order.',
	),
);

const sentinel = timed(
	say(
		'La postcondición promete devolver el índice de `objetivo = 23`, o `-1` si no está.',
		'The postcondition promises to return the index of `target = 23`, or `-1` if absent.',
	),
	say(
		'Si la entrada es inválida o el valor falta, `-1` actúa como valor centinela documentado.',
		'If the input is invalid or the value is missing, `-1` acts as a documented sentinel value.',
	),
);

const linear = timed(
	say(
		'La búsqueda lineal recorre el arreglo desde el inicio, comparando casillero por casillero.',
		'Linear search scans the array from the beginning, comparing slot by slot.',
	),
	say(
		'Para hallar `23` en el índice `5`, revisa seis posiciones: en el peor caso crece como `O(n)`.',
		'To find `23` at index `5`, it checks six positions: in the worst case it grows as `O(n)`.',
	),
	say(
		'Es un algoritmo correcto, pero ignora que los datos ya estaban ordenados.',
		'It is a correct algorithm, but it ignores that the data was already sorted.',
	),
);

const invariant = timed(
	say(
		'La búsqueda binaria aprovecha el orden manteniendo un rango `[izquierda..derecha]`.',
		'Binary search exploits the order by maintaining a range `[left..right]`.',
	),
	say(
		'Su invariante de bucle afirma: si `objetivo` existe, vive dentro de `[izquierda..derecha]`.',
		'Its loop invariant states: if `target` exists, it lives inside `[left..right]`.',
	),
);

const midpoint = timed(
	say(
		'En la primera vuelta, calcula `medio = izquierda + (derecha - izquierda) / 2`, que da `3`.',
		'On the first iteration, it computes `middle = left + (right - left) / 2`, which gives `3`.',
	),
	say(
		'Lee `ordenados[3] = 12` y lo compara con `23`: como `12 < 23`, el objetivo está a la derecha.',
		'It reads `sorted[3] = 12` and compares it with `23`: since `12 < 23`, the target lies to the right.',
	),
);

const halve = timed(
	say(
		'Una sola comparación descarta la mitad izquierda completa: los índices `0` a `3`.',
		'A single comparison discards the entire left half: indices `0` through `3`.',
	),
	say(
		'Actualiza `izquierda = medio + 1` (`4`): el invariante de bucle se conserva en `[4..6]`.',
		'It updates `left = middle + 1` (`4`): the loop invariant is preserved on `[4..6]`.',
	),
);

const found = timed(
	say(
		'En la segunda vuelta, el nuevo `medio` entre `4` y `6` es el índice `5`.',
		'On the second iteration, the new `middle` between `4` and `6` is index `5`.',
	),
	say(
		'Allí encuentra `ordenados[5] = 23` y devuelve el índice `5`, cumpliendo la postcondición.',
		'There it finds `sorted[5] = 23` and returns index `5`, satisfying the postcondition.',
	),
	say(
		'Al partir el espacio a la mitad en cada paso, el costo baja de `O(n)` a `O(log n)`.',
		'By halving the space on every step, the cost drops from `O(n)` to `O(log n)`.',
	),
);

const recap = timed(
	say(
		'Un buen diseño une tres piezas: contrato claro, corrección por invariante y complejidad.',
		'Good design unites three pieces: a clear contract, correctness by invariant, and complexity.',
	),
	say(
		'Con un millón de datos, `O(n)` puede hacer un millón de pasos; `O(log n)`, apenas veinte.',
		'With one million items, `O(n)` may take a million steps; `O(log n)` takes barely twenty.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'contract', label: { es: 'El contrato del algoritmo', en: 'The algorithm contract' } },
		{ id: 'linear', label: { es: 'Búsqueda lineal O(n)', en: 'Linear search O(n)' } },
		{ id: 'binary', label: { es: 'Invariante y punto medio', en: 'Invariant and midpoint' } },
		{ id: 'halve', label: { es: 'Descartar la mitad', en: 'Discarding half' } },
		{ id: 'found', label: { es: 'Objetivo en O(log n)', en: 'Target in O(log n)' } },
		{ id: 'recap', label: { es: 'Contrato, corrección y escala', en: 'Contract, correctness and scale' } },
	],
	steps: [
		// ─── Scene 1. Specification & contract ──────────────────────────────
		{
			id: 'contract',
			chapter: 'contract',
			scene: 'journey',
			title: { es: 'Precondición: arreglo no nulo y ordenado', en: 'Precondition: non-null sorted array' },
			subtitles: contract.list,
			motion: {
				cues: seq(
					shot(0, 'shot-array', 2800),
					{ at: 200, do: 'enter', el: 'floor-arr' },
					...typeLines(300, 'ea', 1, 10, 220),
					{ at: 900, do: 'enter', el: 's-0' },
					{ at: 1050, do: 'enter', el: 's-1' },
					{ at: 1200, do: 'enter', el: 's-2' },
					{ at: 1350, do: 'enter', el: 's-3' },
					{ at: 1500, do: 'enter', el: 's-4' },
					{ at: 1650, do: 'enter', el: 's-5' },
					{ at: 1800, do: 'enter', el: 's-6' },
					{ at: contract.start(1) + 200, do: 'enter', el: 'hc-2' },
					{ at: contract.start(1) + 400, do: 'enter', el: 'ch-pre' },
					{ at: contract.start(1) + 1200, do: 'pulse', el: 'ch-pre' },
					...typeLines(contract.start(1) + 1400, 'ea', 11, 18, 200),
				),
			},
		},
		{
			id: 'sentinel',
			chapter: 'contract',
			scene: 'journey',
			title: { es: 'Postcondición y valor centinela (-1)', en: 'Postcondition and sentinel value (-1)' },
			subtitles: sentinel.list,
			motion: {
				cues: seq(
					shot(0, 'shot-main', 2200),
					{ at: 150, do: 'enter', el: 'floor-main' },
					{ at: 350, do: 'enter', el: 'm-call' },
					{ at: 550, do: 'enter', el: 'm-ret' },
					{ at: 750, do: 'draw', el: 'tr-main', dur: 800 },
					{ at: 1200, do: 'enter', el: 'obj-target', dur: 700 },
					{ at: 1900, do: 'pulse', el: 'obj-target' },
					{ at: 2400, do: 'enter', el: 'ch-post' },
					{ at: 3100, do: 'pulse', el: 'ch-post' },
					{ at: sentinel.start(1) + 200, do: 'enter', el: 'hx-3' },
					{ at: sentinel.start(1) + 500, do: 'enter', el: 'ch-sent' },
					{ at: sentinel.start(1) + 1400, do: 'pulse', el: 'ch-sent' },
					{ at: sentinel.start(1) + 2200, do: 'pulse', el: 'm-ret' },
				),
			},
		},

		// ─── Scene 2. Linear search O(n) ────────────────────────────────────
		{
			id: 'linear',
			chapter: 'linear',
			scene: 'journey',
			title: { es: 'Búsqueda lineal: paso a paso en O(n)', en: 'Linear search: step by step in O(n)' },
			subtitles: linear.list,
			motion: {
				cues: seq(
					shot(0, 'shot-linear', 2200),
					...clear(100, 'hc-2', 'hx-3', 'ch-sent'),
					{ at: 300, do: 'enter', el: 'hl' },
					{ at: 400, do: 'enter', el: 'p' },
					{ at: 500, do: 'move', el: 'hl', to: 'ln-5', dur: 500 },
					{ at: 600, do: 'move', el: 'p', to: 'a-s0', dur: 650 },
					{ at: 1250, do: 'enter', el: 'lin-0' },
					{ at: 1400, do: 'move', el: 'p', to: 'a-s1', dur: 650 },
					{ at: 2050, do: 'enter', el: 'lin-1' },
					{ at: 2200, do: 'move', el: 'p', to: 'a-s2', dur: 650 },
					{ at: 2850, do: 'enter', el: 'lin-2' },
					{ at: 3000, do: 'move', el: 'p', to: 'a-s3', dur: 650 },
					{ at: 3650, do: 'enter', el: 'lin-3' },
					{ at: linear.start(1) + 100, do: 'move', el: 'p', to: 'a-s4', dur: 650 },
					{ at: linear.start(1) + 750, do: 'enter', el: 'lin-4' },
					{ at: linear.start(1) + 900, do: 'move', el: 'p', to: 'a-s5', dur: 650 },
					{ at: linear.start(1) + 900, do: 'move', el: 'hl', to: 'ln-7', dur: 500 },
					{ at: linear.start(1) + 1550, do: 'enter', el: 's5-on' },
					{ at: linear.start(1) + 1700, do: 'draw', el: 'rt-lin', dur: 900 },
					{ at: linear.start(1) + 2200, do: 'enter', el: 'ch-on' },
					{ at: linear.start(1) + 2600, do: 'type', el: 'out-1', dur: 700 },
					{ at: linear.start(2) + 400, do: 'pulse', el: 'ch-on' },
					{ at: linear.start(2) + 1600, do: 'pulse', el: 's5-on' },
				),
			},
		},

		// ─── Scene 3. Binary search & loop invariant ────────────────────────
		{
			id: 'invariant',
			chapter: 'binary',
			scene: 'journey',
			title: { es: 'Búsqueda binaria e invariante de bucle', en: 'Binary search and loop invariant' },
			subtitles: invariant.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'ea', 'lin-0', 'lin-1', 'lin-2', 'lin-3', 'lin-4', 's5-on', 'rt-lin', 'ch-on'),
					shot(100, 'shot-binary', 2200),
					{ at: 500, do: 'enter', el: 'eb' },
					...typeLines(600, 'eb', 1, 20, 140),
					{ at: 1200, do: 'enter', el: 'hl' },
					{ at: 1300, do: 'move', el: 'hl', to: 'ln-5', dur: 500 },
					{ at: 1800, do: 'enter', el: 'br-full' },
					{ at: 2100, do: 'enter', el: 'ch-left0' },
					{ at: 2400, do: 'enter', el: 'ch-right6' },
					{ at: invariant.start(1) + 200, do: 'move', el: 'hl', to: 'ln-7', dur: 500 },
					{ at: invariant.start(1) + 500, do: 'enter', el: 'hv-7' },
					{ at: invariant.start(1) + 800, do: 'enter', el: 'ch-inv' },
					{ at: invariant.start(1) + 1700, do: 'pulse', el: 'ch-inv' },
					{ at: invariant.start(1) + 2600, do: 'pulse', el: 'br-full' },
				),
			},
		},
		{
			id: 'midpoint',
			chapter: 'binary',
			scene: 'journey',
			title: { es: 'Inspeccionar el elemento medio', en: 'Inspecting the middle element' },
			subtitles: midpoint.list,
			motion: {
				cues: seq(
					shot(0, 'shot-mid', 2000),
					{ at: 200, do: 'move', el: 'hl', to: 'ln-8', dur: 500 },
					{ at: 400, do: 'move', el: 'p', to: 'a-call', dur: 1 },
					{ at: 500, do: 'enter', el: 'p' },
					{ at: 700, do: 'draw', el: 'fl-mid1', dur: 800 },
					{ at: 800, do: 'move', el: 'p', to: 'a-s3', dur: 1000 },
					{ at: 1800, do: 'enter', el: 's3-mid' },
					{ at: 2000, do: 'enter', el: 'ch-mid3' },
					{ at: 2700, do: 'pulse', el: 'ch-mid3' },
					{ at: midpoint.start(1) + 200, do: 'move', el: 'hl', to: 'ln-11', dur: 500 },
					{ at: midpoint.start(1) + 800, do: 'pulse', el: 's3-mid' },
					{ at: midpoint.start(1) + 1300, do: 'enter', el: 'ch-cmp1' },
					{ at: midpoint.start(1) + 2200, do: 'pulse', el: 'ch-cmp1' },
					{ at: midpoint.start(1) + 3000, do: 'pulse', el: 'obj-target' },
				),
			},
		},

		// ─── Scene 4. Halving the search space ──────────────────────────────
		{
			id: 'halve',
			chapter: 'halve',
			scene: 'journey',
			title: { es: 'Descartar la mitad en un paso', en: 'Discarding half in a single step' },
			subtitles: halve.list,
			motion: {
				cues: seq(
					shot(0, 'shot-halve', 2000),
					...clear(200, 's3-mid', 'ch-mid3', 'ch-cmp1', 'br-full', 'ch-left0'),
					{ at: 700, do: 'enter', el: 'veil-left', dur: 700 },
					{ at: 1100, do: 'enter', el: 'ch-half' },
					{ at: 1900, do: 'pulse', el: 'ch-half' },
					{ at: 2700, do: 'pulse', el: 'veil-left' },
					{ at: halve.start(1) + 200, do: 'move', el: 'hl', to: 'ln-12', dur: 500 },
					{ at: halve.start(1) + 600, do: 'enter', el: 'br-right' },
					{ at: halve.start(1) + 900, do: 'enter', el: 'ch-left4' },
					{ at: halve.start(1) + 1600, do: 'pulse', el: 'ch-left4' },
					{ at: halve.start(1) + 2400, do: 'pulse', el: 'ch-inv' },
					{ at: halve.start(1) + 3200, do: 'pulse', el: 'br-right' },
				),
			},
		},

		// ─── Scene 5. Reaching the target in O(log n) ───────────────────────
		{
			id: 'found',
			chapter: 'found',
			scene: 'journey',
			title: { es: 'Hallazgo en O(log n) y postcondición', en: 'Found in O(log n) and postcondition' },
			subtitles: found.list,
			motion: {
				cues: seq(
					shot(0, 'shot-found', 2000),
					...clear(100, 'ch-half'),
					{ at: 300, do: 'move', el: 'hl', to: 'ln-8', dur: 500 },
					{ at: 600, do: 'draw', el: 'fl-mid2', dur: 800 },
					{ at: 700, do: 'move', el: 'p', to: 'a-s5', dur: 900 },
					{ at: 1600, do: 'enter', el: 's5-bin' },
					{ at: 1800, do: 'enter', el: 'ch-mid5' },
					{ at: 2500, do: 'pulse', el: 'ch-mid5' },
					{ at: found.start(1) + 200, do: 'move', el: 'hl', to: 'ln-10', dur: 500 },
					{ at: found.start(1) + 600, do: 'enter', el: 'hv-10' },
					{ at: found.start(1) + 900, do: 'draw', el: 'fl-ret', dur: 800 },
					{ at: found.start(1) + 1000, do: 'move', el: 'p', to: 'a-ret', dur: 900 },
					{ at: found.start(1) + 1900, do: 'enter', el: 'ret-on' },
					{ at: found.start(1) + 2100, do: 'type', el: 'out-2', dur: 700 },
					{ at: found.start(2) + 200, do: 'enter', el: 'ch-ologn' },
					{ at: found.start(2) + 1100, do: 'pulse', el: 'ch-ologn' },
					{ at: found.start(2) + 2200, do: 'pulse', el: 'ret-on' },
				),
			},
		},

		// ─── Scene 6. Recap ─────────────────────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'Contrato, invariante y O(n) frente a O(log n)', en: 'Contract, invariant and O(n) vs O(log n)' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'ch-mid5', 'ch-left4', 'ch-right6'),
					shot(200, 'shot-all', 2800),
					{ at: 600, do: 'enter', el: 'rt-lin' },
					{ at: 800, do: 'enter', el: 'ch-on' },
					{ at: 1000, do: 'enter', el: 'ch-ologn' },
					{ at: 1200, do: 'enter', el: 'ch-pre' },
					{ at: 1400, do: 'enter', el: 'ch-post' },
					{ at: 1600, do: 'enter', el: 'ch-inv' },
					{ at: 2000, do: 'flow', el: 'fl-mid1' },
					{ at: 2000, do: 'flow', el: 'fl-mid2' },
					{ at: 2000, do: 'flow', el: 'fl-ret' },
					{ at: 2600, do: 'pulse', el: 'ch-pre' },
					{ at: recap.start(1) + 300, do: 'pulse', el: 'ch-on' },
					{ at: recap.start(1) + 1400, do: 'pulse', el: 'ch-ologn' },
					{ at: recap.start(1) + 2400, do: 'pulse', el: 's5-bin' },
				),
			},
		},
	],
};
