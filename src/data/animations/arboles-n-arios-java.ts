import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey through an N-ary tree": a short film (about two minutes) for the Java
// lesson "Árboles N-arios y representación con vectores" (order: 19). It plays on a
// single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/arboles-n-arios-java.astro`): an isometric floor where
// the nodes `A`..`E` stand as blocks, and a deck behind it holding the parallel
// vectors. The same nodes change state through the film: a fan of N-ary edges that
// does not fit a binary node (magenta), the violet first-child / next-sibling links
// that fix it, a light blue particle that walks the sibling chain, and finally the
// parent vector the particle climbs to the root, after the indices are validated.

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

/** Slides the editor bar to a line. */
const line = (at: number, n: number, dur = 400): MotionCue => ({ at, do: 'move', el: 'hl', to: `ln-${n}`, dur });

// ─── Captions ───────────────────────────────────────────────────────────────
const problem = timed(
	say(
		'Un árbol binario limita cada nodo a dos hijos. Un árbol N-ario admite cero o más hijos por nodo.',
		'A binary tree limits each node to two children. An N-ary tree allows zero or more children per node.',
	),
	say(
		'La raíz `A` tiene tres hijos. Con solo dos enlaces fijos, `D` se queda sin lugar.',
		'The root `A` has three children. With only two fixed links, `D` has no place left.',
	),
);
const lcrs = timed(
	say(
		'Cada nodo guarda solo dos referencias: `primerHijo` y `siguienteHermano`.',
		'Each node stores just two references: `firstChild` and `nextSibling`.',
	),
	say('`A` apunta solo a `B`; `B` enlaza a `C` y `C` a `D`.', '`A` points only to `B`; `B` links to `C` and `C` to `D`.'),
	say(
		'No es un árbol binario de búsqueda: los enlaces son relaciones, no comparaciones.',
		'It is not a binary search tree: the links are relationships, not comparisons.',
	),
);
const first = timed(
	say(
		'Para listar los hijos de `A`, el recorrido salta una sola vez por `primerHijo` y llega a `B`.',
		'To list the children of `A`, the walk jumps just once through `firstChild` and lands on `B`.',
	),
	say(
		'Mientras `hijo` no sea `null`, el ciclo `while` imprime su valor: `B`.',
		'While `child` is not `null`, the `while` loop prints its value: `B`.',
	),
);
const siblings = timed(
	say(
		'Luego avanza por `siguienteHermano`: imprime `C` y después `D`, sin volver a `A`.',
		'Then it moves along `nextSibling`: it prints `C` and then `D`, without returning to `A`.',
	),
	say(
		'Sigue la cadena de hermanos hasta `null` y el ciclo termina: la cantidad de hijos no importa.',
		'It follows the sibling chain until `null` and the loop ends: the number of children does not matter.',
	),
);
const vectors = timed(
	say(
		'Cada nodo recibe un índice de `0` a `4`; `etiquetas[i]` guarda su valor.',
		'Each node gets an index from `0` to `4`; `labels[i]` stores its value.',
	),
	say(
		'`padres[i]` guarda el índice del padre del nodo `i`. La raíz no tiene padre: guarda `-1`.',
		'`parents[i]` stores the index of the parent of node `i`. The root has no parent: it stores `-1`.',
	),
);
const validate = timed(
	say(
		'Antes de recorrer, `validarEnlace` revisa que cada índice exista o sea `-1`.',
		'Before walking, `validateLink` checks that every index exists or is `-1`.',
	),
	say(
		'Si `padres[4]` valiera `7`, se lanza `IndexOutOfBoundsException`: la entrada se rechaza, no se repara.',
		'If `parents[4]` were `7`, an `IndexOutOfBoundsException` is thrown: bad input is rejected, not repaired.',
	),
);
const climb = timed(
	say(
		'Desde `E` (índice `4`), leer `padres[actual]` sube un nivel en O(1).',
		'From `E` (index `4`), reading `parents[current]` climbs one level in O(1).',
	),
	say(
		'`E` sube a `B` y `B` sube a `A`: cada salto suma uno a la `profundidad`.',
		'`E` climbs to `B` and `B` climbs to `A`: each jump adds one to the `depth`.',
	),
	say(
		'En `A` se lee `-1`: es la raíz, profundidad 2. Un ciclo haría infinita la subida.',
		'At `A` it reads `-1`: the root, depth 2. A cycle would make the climb endless.',
	),
);
const recap = timed(
	say(
		'Con `primerHijo` y `siguienteHermano`, dos referencias alcanzan para cualquier cantidad de hijos.',
		'With `firstChild` and `nextSibling`, two references are enough for any number of children.',
	),
	say(
		'Con vectores, las relaciones son números: mejor localidad y el padre en O(1), con índices validados.',
		'With vectors, relationships are numbers: better locality and the parent in O(1), with validated indices.',
	),
);

const CELLS = [0, 1, 2, 3, 4];

export const script: AnimationScript = {
	chapters: [
		{ id: 'nary', label: { es: 'Un nodo, muchos hijos', en: 'One node, many children' } },
		{ id: 'lcrs', label: { es: 'Primer hijo y siguiente hermano', en: 'First child and next sibling' } },
		{ id: 'siblings', label: { es: 'Recorrer los hijos', en: 'Walking the children' } },
		{ id: 'vectors', label: { es: 'El árbol en vectores', en: 'The tree in vectors' } },
		{ id: 'climb', label: { es: 'Subir hasta la raíz', en: 'Climbing to the root' } },
		{ id: 'recap', label: { es: 'Dos representaciones', en: 'Two representations' } },
	],
	steps: [
		// ─── Scene 1. One node, many children ───────────────────────────────
		{
			id: 'problem',
			chapter: 'nary',
			scene: 'journey',
			title: { es: 'Un nodo, muchos hijos', en: 'One node, many children' },
			subtitles: problem.list,
			motion: {
				cues: seq(
					shot(0, 'shot-tree', 3000),
					{ at: 200, do: 'enter', el: 'floor' },
					{ at: 600, do: 'enter', el: 'n-a' },
					{ at: 700, do: 'type', el: 'ea-9', dur: 1200 },
					{ at: 1000, do: 'draw', el: 'e-ab', dur: 700 },
					{ at: 1200, do: 'draw', el: 'e-ac', dur: 700 },
					{ at: 1400, do: 'draw', el: 'e-ad', dur: 700 },
					{ at: 1700, do: 'enter', el: 'n-b' },
					{ at: 1900, do: 'enter', el: 'n-c' },
					{ at: 2100, do: 'type', el: 'ea-10', dur: 900 },
					{ at: 2200, do: 'enter', el: 'n-d' },
					{ at: 2700, do: 'draw', el: 'e-be', dur: 600 },
					{ at: 3200, do: 'enter', el: 'n-e' },
					{ at: 3800, do: 'enter', el: 'lb-nary' },
					{ at: 4600, do: 'pulse', el: 'n-a' },
					// A binary node has two slots: two children fit, the third one does not.
					shot(problem.start(1), 'shot-top', 1800),
					...clear(problem.start(1), 'lb-nary'),
					{ at: problem.start(1) + 400, do: 'enter', el: 'lb-two' },
					{ at: problem.start(1) + 900, do: 'draw', el: 'fl-ab', dur: 600 },
					{ at: problem.start(1) + 1500, do: 'draw', el: 'fl-ac', dur: 600 },
					{ at: problem.start(1) + 2400, do: 'draw', el: 'x-ad', dur: 600 },
					{ at: problem.start(1) + 3000, do: 'enter', el: 'x-d' },
					{ at: problem.start(1) + 3300, do: 'enter', el: 'lb-nofit' },
					{ at: problem.start(1) + 4000, do: 'pulse', el: 'x-d' },
				),
			},
		},

		// ─── Scene 2. First child and next sibling ──────────────────────────
		{
			id: 'lcrs',
			chapter: 'lcrs',
			scene: 'journey',
			title: { es: 'Dos referencias por nodo', en: 'Two references per node' },
			subtitles: lcrs.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-two', 'fl-ab', 'fl-ac', 'x-ad'),
					shot(0, 'shot-tree', 2000),
					...typeLines(200, 'ea', 1, 8, 260),
					{ at: 1300, do: 'enter', el: 'hv-34' },
					{ at: 2400, do: 'enter', el: 'lb-refs' },
					{ at: 3200, do: 'pulse', el: 'lb-refs' },
					// The fan of edges collapses into first-child and sibling links, line by line.
					...clear(lcrs.start(1), 'hv-34', 'x-d', 'lb-nofit'),
					{ at: lcrs.start(1) + 100, do: 'exit', el: 'e-ac', dur: 600 },
					{ at: lcrs.start(1) + 100, do: 'exit', el: 'e-ad', dur: 600 },
					{ at: lcrs.start(1) + 300, do: 'enter', el: 'hl' },
					{ at: lcrs.start(1) + 300, do: 'type', el: 'ea-11', dur: 500 },
					{ at: lcrs.start(1) + 400, do: 'draw', el: 'k-ab', dur: 600 },
					{ at: lcrs.start(1) + 900, do: 'exit', el: 'e-ab', dur: 300 },
					{ at: lcrs.start(1) + 900, do: 'enter', el: 'lb-fc' },
					{ at: lcrs.start(1) + 1100, do: 'draw', el: 'k-be', dur: 600 },
					{ at: lcrs.start(1) + 1600, do: 'exit', el: 'e-be', dur: 300 },
					line(lcrs.start(1) + 1800, 12),
					{ at: lcrs.start(1) + 1800, do: 'type', el: 'ea-12', dur: 400 },
					{ at: lcrs.start(1) + 2000, do: 'draw', el: 'k-bc', dur: 600 },
					{ at: lcrs.start(1) + 2500, do: 'enter', el: 'lb-ns' },
					line(lcrs.start(1) + 2800, 13),
					{ at: lcrs.start(1) + 2800, do: 'type', el: 'ea-13', dur: 400 },
					{ at: lcrs.start(1) + 3000, do: 'draw', el: 'k-cd', dur: 600 },
					{ at: lcrs.start(1) + 3700, do: 'enter', el: 'nul' },
					// The links encode relationships; nothing is compared.
					...clear(lcrs.start(2), 'lb-refs'),
					{ at: lcrs.start(2) + 300, do: 'enter', el: 'lb-nobst' },
					{ at: lcrs.start(2) + 1200, do: 'pulse', el: 'k-ab' },
					{ at: lcrs.start(2) + 1700, do: 'pulse', el: 'k-bc' },
					{ at: lcrs.start(2) + 2200, do: 'pulse', el: 'k-cd' },
					...typeLines(lcrs.start(2) + 2600, 'ea', 14, 20, 180),
				),
			},
		},

		// ─── Scene 3. Walking the children ──────────────────────────────────
		{
			id: 'first',
			chapter: 'siblings',
			scene: 'journey',
			title: { es: 'Un salto al primer hijo', en: 'One jump to the first child' },
			subtitles: first.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-nobst'),
					shot(0, 'shot-walk', 1800),
					line(200, 14, 500),
					{ at: 200, do: 'move', el: 'p', to: 'a-root', dur: 1 },
					{ at: 300, do: 'enter', el: 'p' },
					{ at: 300, do: 'enter', el: 'on-a' },
					{ at: 900, do: 'pulse', el: 'on-a' },
					{ at: 1600, do: 'draw', el: 'w-ab', dur: 800 },
					{ at: 1700, do: 'move', el: 'p', to: 'a-b', dur: 900 },
					{ at: 2600, do: 'enter', el: 'on-b' },
					{ at: 2700, do: 'pulse', el: 'lb-fc' },
					line(first.start(1), 15),
					{ at: first.start(1) + 600, do: 'pulse', el: 'on-b' },
					line(first.start(1) + 1500, 16),
					{ at: first.start(1) + 1800, do: 'type', el: 'out-1', dur: 400 },
					{ at: first.start(1) + 2300, do: 'pulse', el: 'n-b' },
				),
			},
		},
		{
			id: 'siblings',
			chapter: 'siblings',
			scene: 'journey',
			title: { es: 'La cadena de hermanos', en: 'The sibling chain' },
			subtitles: siblings.list,
			motion: {
				cues: seq(
					line(0, 17),
					{ at: 200, do: 'draw', el: 'w-bc', dur: 700 },
					{ at: 300, do: 'move', el: 'p', to: 'a-c', dur: 900 },
					{ at: 1200, do: 'enter', el: 'on-c' },
					line(1500, 16),
					{ at: 1700, do: 'type', el: 'out-2', dur: 400 },
					line(2400, 17),
					{ at: 2600, do: 'draw', el: 'w-cd', dur: 700 },
					{ at: 2700, do: 'move', el: 'p', to: 'a-d', dur: 900 },
					{ at: 3600, do: 'enter', el: 'on-d' },
					line(3900, 16),
					{ at: 4100, do: 'type', el: 'out-3', dur: 400 },
					line(siblings.start(1), 17),
					{ at: siblings.start(1) + 200, do: 'draw', el: 'w-dn', dur: 600 },
					{ at: siblings.start(1) + 300, do: 'move', el: 'p', to: 'a-null', dur: 900 },
					{ at: siblings.start(1) + 1200, do: 'pulse', el: 'nul' },
					line(siblings.start(1) + 1500, 15),
					{ at: siblings.start(1) + 2000, do: 'enter', el: 'lb-done' },
					shot(siblings.start(1) + 2600, 'shot-tree', 2000),
				),
			},
		},

		// ─── Scene 4. The tree in vectors ───────────────────────────────────
		{
			id: 'vectors',
			chapter: 'vectors',
			scene: 'journey',
			title: { es: 'Índices en lugar de referencias', en: 'Indices instead of references' },
			subtitles: vectors.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'on-a', 'on-b', 'on-c', 'on-d', 'w-ab', 'w-bc', 'w-cd', 'w-dn'),
					...clear(0, 'nul', 'lb-done', 'lb-fc', 'lb-ns', 'out-1', 'out-2', 'out-3', 'ea'),
					shot(0, 'shot-vec', 2200),
					{ at: 300, do: 'enter', el: 'eb' },
					...typeLines(400, 'eb', 1, 9, 150),
					{ at: 500, do: 'enter', el: 'deck' },
					...CELLS.map((k): MotionCue => ({ at: 900 + k * 200, do: 'enter', el: `ix-${k}` })),
					{ at: 1900, do: 'type', el: 'eb-10', dur: 700 },
					...CELLS.map((k): MotionCue => ({ at: 2000 + k * 150, do: 'enter', el: `lc-${k}` })),
					{ at: 2900, do: 'enter', el: 'lb-etq' },
					{ at: 3400, do: 'type', el: 'eb-19', dur: 200 },
					{ at: 3600, do: 'type', el: 'eb-20', dur: 200 },
					// The parent vector: every node stores the index of its parent.
					{ at: vectors.start(1) + 100, do: 'type', el: 'eb-11', dur: 600 },
					...CELLS.map((k): MotionCue => ({ at: vectors.start(1) + 200 + k * 150, do: 'enter', el: `pc-${k}` })),
					...CELLS.map((k): MotionCue => ({ at: vectors.start(1) + 300 + k * 150, do: 'enter', el: `pv-${k}` })),
					{ at: vectors.start(1) + 1200, do: 'enter', el: 'lb-padres' },
					{ at: vectors.start(1) + 1900, do: 'pulse', el: 'pc-1' },
					{ at: vectors.start(1) + 2100, do: 'pulse', el: 'pc-2' },
					{ at: vectors.start(1) + 2300, do: 'pulse', el: 'pc-3' },
					{ at: vectors.start(1) + 2500, do: 'pulse', el: 'n-a' },
					{ at: vectors.start(1) + 3100, do: 'pulse', el: 'pc-4' },
					{ at: vectors.start(1) + 3300, do: 'pulse', el: 'n-b' },
					{ at: vectors.start(1) + 4000, do: 'enter', el: 'lb-root' },
					{ at: vectors.start(1) + 4400, do: 'pulse', el: 'pc-0' },
				),
			},
		},
		{
			id: 'validate',
			chapter: 'vectors',
			scene: 'journey',
			title: { es: 'Índices validados', en: 'Validated indices' },
			subtitles: validate.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-root'),
					shot(0, 'shot-deck', 1600),
					line(0, 12, 1),
					{ at: 100, do: 'enter', el: 'hl' },
					{ at: 100, do: 'type', el: 'eb-12', dur: 700 },
					...CELLS.map((k): MotionCue => ({ at: 800 + k * 450, do: 'enter', el: `pok-${k}` })),
					{ at: 3100, do: 'enter', el: 'lb-ok' },
					// A hypothetical bad index: the same cell turns magenta and the method throws.
					...clear(validate.start(1), 'lb-ok', 'pok-4'),
					{ at: validate.start(1) + 200, do: 'exit', el: 'pv-4', dur: 300 },
					{ at: validate.start(1) + 200, do: 'exit', el: 'eb-11', dur: 300 },
					{ at: validate.start(1) + 400, do: 'type', el: 'eb-11x', dur: 600 },
					{ at: validate.start(1) + 500, do: 'enter', el: 'pv-bad' },
					{ at: validate.start(1) + 500, do: 'enter', el: 'px-4' },
					{ at: validate.start(1) + 1100, do: 'draw', el: 'rt-bad', dur: 700 },
					line(validate.start(1) + 1500, 5),
					line(validate.start(1) + 2000, 6),
					{ at: validate.start(1) + 2300, do: 'enter', el: 'hx-6' },
					{ at: validate.start(1) + 2400, do: 'enter', el: 'lb-bad' },
					{ at: validate.start(1) + 2700, do: 'type', el: 'out-x', dur: 800 },
					{ at: validate.start(1) + 3700, do: 'pulse', el: 'px-4' },
					// Back to the valid input.
					...clear(validate.start(1) + 5300, 'eb-11x', 'pv-bad', 'px-4', 'rt-bad', 'hx-6', 'lb-bad', 'out-x'),
					{ at: validate.start(1) + 5700, do: 'enter', el: 'eb-11' },
					{ at: validate.start(1) + 5700, do: 'enter', el: 'pv-4' },
					{ at: validate.start(1) + 5800, do: 'enter', el: 'pok-4' },
					line(validate.start(1) + 5800, 12),
				),
			},
		},

		// ─── Scene 5. Climbing to the root ──────────────────────────────────
		{
			id: 'climb',
			chapter: 'climb',
			scene: 'journey',
			title: { es: 'padres[actual] hasta la raíz', en: 'parents[current] up to the root' },
			subtitles: climb.list,
			motion: {
				cues: seq(
					...clear(0, ...CELLS.map((k) => `pok-${k}`)),
					shot(0, 'shot-climb', 1800),
					line(200, 13, 500),
					{ at: 200, do: 'type', el: 'eb-13', dur: 500 },
					{ at: 300, do: 'move', el: 'p', to: 'a-e', dur: 1 },
					{ at: 400, do: 'enter', el: 'p' },
					{ at: 400, do: 'enter', el: 'on-e' },
					{ at: 800, do: 'enter', el: 'dep-0' },
					line(1300, 14),
					{ at: 1300, do: 'type', el: 'eb-14', dur: 500 },
					{ at: 1600, do: 'enter', el: 'pon-4' },
					{ at: 1800, do: 'pulse', el: 'pv-4' },
					{ at: 2200, do: 'enter', el: 'lb-o1' },
					// E climbs to B, then B climbs to A.
					line(climb.start(1), 15),
					{ at: climb.start(1), do: 'type', el: 'eb-15', dur: 500 },
					{ at: climb.start(1) + 100, do: 'draw', el: 'up-eb', dur: 800 },
					{ at: climb.start(1) + 200, do: 'move', el: 'p', to: 'a-b', dur: 900 },
					{ at: climb.start(1) + 700, do: 'exit', el: 'on-e', dur: 400 },
					{ at: climb.start(1) + 1100, do: 'enter', el: 'on-b' },
					line(climb.start(1) + 1300, 16),
					{ at: climb.start(1) + 1300, do: 'type', el: 'eb-16', dur: 400 },
					{ at: climb.start(1) + 1500, do: 'exit', el: 'dep-0', dur: 300 },
					{ at: climb.start(1) + 1600, do: 'enter', el: 'dep-1' },
					{ at: climb.start(1) + 1700, do: 'exit', el: 'pon-4', dur: 400 },
					line(climb.start(1) + 2100, 14),
					{ at: climb.start(1) + 2200, do: 'enter', el: 'pon-1' },
					line(climb.start(1) + 2700, 15),
					{ at: climb.start(1) + 2800, do: 'draw', el: 'up-ba', dur: 800 },
					{ at: climb.start(1) + 2900, do: 'move', el: 'p', to: 'a-root', dur: 900 },
					{ at: climb.start(1) + 3400, do: 'exit', el: 'on-b', dur: 400 },
					{ at: climb.start(1) + 3800, do: 'enter', el: 'on-a' },
					line(climb.start(1) + 4000, 16),
					{ at: climb.start(1) + 4100, do: 'exit', el: 'dep-1', dur: 300 },
					{ at: climb.start(1) + 4200, do: 'enter', el: 'dep-2' },
					{ at: climb.start(1) + 4400, do: 'exit', el: 'pon-1', dur: 400 },
					// At the root the vector holds -1: the loop stops and the depth is printed.
					line(climb.start(2), 14),
					{ at: climb.start(2) + 100, do: 'enter', el: 'pon-0' },
					{ at: climb.start(2) + 400, do: 'pulse', el: 'pv-0' },
					{ at: climb.start(2) + 600, do: 'enter', el: 'lb-root' },
					{ at: climb.start(2) + 900, do: 'type', el: 'eb-17', dur: 200 },
					line(climb.start(2) + 1300, 18),
					{ at: climb.start(2) + 1300, do: 'type', el: 'eb-18', dur: 600 },
					{ at: climb.start(2) + 1700, do: 'type', el: 'out-b', dur: 500 },
					{ at: climb.start(2) + 2400, do: 'pulse', el: 'dep-2' },
					{ at: climb.start(2) + 3100, do: 'enter', el: 'lb-cycle' },
				),
			},
		},

		// ─── Scene 6. Two representations ───────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'Dos representaciones, mismas invariantes', en: 'Two representations, same invariants' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-cycle', 'lb-o1', 'lb-root', 'pon-0'),
					shot(200, 'shot-all', 2800),
					{ at: 600, do: 'flow', el: 'k-ab' },
					{ at: 600, do: 'flow', el: 'k-be' },
					{ at: 600, do: 'flow', el: 'k-bc' },
					{ at: 600, do: 'flow', el: 'k-cd' },
					{ at: 1000, do: 'enter', el: 'r-lcrs' },
					{ at: 2200, do: 'pulse', el: 'n-a' },
					{ at: recap.start(1) + 200, do: 'flow', el: 'up-eb' },
					{ at: recap.start(1) + 200, do: 'flow', el: 'up-ba' },
					{ at: recap.start(1) + 600, do: 'enter', el: 'r-vec' },
					{ at: recap.start(1) + 1400, do: 'pulse', el: 'deck' },
					{ at: recap.start(1) + 2000, do: 'exit', el: 'hl', dur: 400 },
					{ at: recap.start(1) + 3000, do: 'pulse', el: 'p' },
				),
			},
		},
	],
};
