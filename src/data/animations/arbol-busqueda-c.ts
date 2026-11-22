import type { AnimationScript, MotionCue, Subtitle } from './types';

// "A tree that sorts as it inserts": a short film (about two minutes) for the C lesson
// "Árboles binarios" (order: 33). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/arbol-busqueda-c.astro`):
// the heap with the nodes of a binary search tree (a pointer is an arrow from a socket
// of the parent to the child), the stack with the `raiz` of `main` and one frame per
// recursive call, and one module per instruction. The light blue cursor is the node
// under examination. The code is drawn inside the canvas (an editor that highlights the
// running line), so every step is a motion step and the cues below keep both halves in sync.

const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

/**
 * Pins captions on the step timeline: each one starts once the previous has been read
 * (same formula as `subtitleReadingTime`, for the slower locale) plus a pause. Cues are
 * placed relative to those starts to stay in sync with what is being said.
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

const enter = (at: number, el: string, dur?: number): MotionCue => ({ at, do: 'enter', el, ...(dur ? { dur } : {}) });
const exit = (at: number, el: string, dur = 350): MotionCue => ({ at, do: 'exit', el, dur });
const draw = (at: number, el: string, dur = 700): MotionCue => ({ at, do: 'draw', el, dur });
const type = (at: number, el: string, dur: number): MotionCue => ({ at, do: 'type', el, dur });
const pulse = (at: number, el: string): MotionCue => ({ at, do: 'pulse', el });
const flow = (at: number, el: string): MotionCue => ({ at, do: 'flow', el });
const move = (at: number, el: string, to: string, dur = 700): MotionCue => ({ at, do: 'move', el, to, dur });
/** The bar of the editor slides to one line. */
const line = (at: number, number: number): MotionCue => move(at, 'hl', `ln-${number}`, 500);
/** Camera cue that frames one of the `shot-*` anchors exactly (they carry their own zoom). */
const shot = (at: number, to: string, dur: number): MotionCue => ({ at, do: 'camera', to: [to], dur, pad: 0 });
const enterAll = (at: number, ids: string[], gap: number) => ids.map((el, index) => enter(at + index * gap, el));
const exitAll = (at: number, ids: string[], gap: number) => ids.map((el, index) => exit(at + index * gap, el));

const ids = (prefix: string, values: number[]) => values.map((value) => `${prefix}-${value}`);
const MODULES = {
	insert: ids('mi', [2, 3, 6, 7, 9, 10]),
	find: ids('mf', [2, 3, 5, 6, 8]),
	walk: ids('mt', [3, 4, 5, 11, 12, 13, 19, 20, 21]),
	free: ids('mr', [5, 6, 7, 10, 11]),
};
const VISITED = ids('vs', [20, 30, 40, 50, 60, 70, 80]);
const STRIP = (prefix: string) => ids(prefix, [1, 2, 3, 4, 5, 6, 7]);

// ─── Captions ───────────────────────────────────────────────────────────────
const nodes = timed(
	say('Un árbol vacío es un puntero `raiz` que vale `NULL`.', 'An empty tree is a pointer `root` that is `NULL`.'),
	say('`insertar(&raiz, 50)` busca un `NULL` donde colgar el nodo.', '`insert(&root, 50)` looks for a `NULL` to hang the node on.'),
	say('`raiz` apunta al nodo nuevo. Las direcciones reales varían.', '`root` points to the new node. Real addresses vary.'),
);
const descend = timed(
	say('Insertar 30: menor que 50, baja por `izquierdo`.', 'Insert 30: smaller than 50, it goes down `left`.'),
	say('Insertar 70: mayor que 50, baja por `derecho`.', 'Insert 70: larger than 50, it goes down `right`.'),
	say('Cada llamada recursiva repite la pregunta en un subárbol más chico.', 'Each recursive call repeats the question on a smaller subtree.'),
);
const place = timed(
	say('Insertar 40: menor que 50, izquierda; mayor que 30, derecha.', 'Insert 40: smaller than 50, left; larger than 30, right.'),
	say('El `derecho` de 30 es `NULL`: ahí se cuelga el nodo nuevo.', 'The `right` of 30 is `NULL`: the new node is hung there.'),
	say('20, 60 y 80 se insertan igual: quedan siete nodos.', '20, 60 and 80 go in the same way: seven nodes.'),
);
const search = timed(
	say('Buscar el 60 usa la misma regla, pero solo lee: derecha.', 'Searching for 60 uses the same rule but only reads: right.'),
	say('Menor que 70, izquierda: encuentra el 60 y devuelve el nodo.', 'Smaller than 70, left: it finds 60 and returns the node.'),
	say('Si llega a `NULL`, el valor no está: así responde el 65.', 'Reaching `NULL` means the value is not there: that is 65.'),
);
const inorder = timed(
	say('Inorden visita el izquierdo, luego el nodo y luego el derecho.', 'Inorder visits the left, then the node, then the right.'),
	say('En un árbol de búsqueda salen los valores ordenados: 20 30 40 50 60 70 80.', 'In a search tree the values come out sorted: 20 30 40 50 60 70 80.'),
);
const others = timed(
	say('Preorden visita el nodo antes que sus hijos: 50 30 20 40 70 60 80.', 'Preorder visits the node before its children: 50 30 20 40 70 60 80.'),
	say('Postorden lo visita después de sus hijos: 20 40 30 60 80 70 50.', 'Postorder visits it after its children: 20 40 30 60 80 70 50.'),
);
const release = timed(
	say('Liberar exige postorden: cada nodo se libera después de sus hijos.', 'Freeing takes postorder: each node is freed after its children.'),
	say('Liberar primero la raíz dejaría a sus hijos inalcanzables: una fuga.', 'Freeing the root first would leave its children unreachable: a leak.'),
	say('Al final `raiz = NULL` y la altura vale 0.', 'At the end `root = NULL` and the height is 0.'),
);
const shape = timed(
	say('Con 10, 20, 30, 40, 50 en orden, todo va a la derecha: degenera en lista.', 'Inserted in order 10, 20, 30, 40, 50, all goes right: it degenerates into a list.'),
	say('Buscar el 50 visita los cinco nodos: costo O(n).', 'Searching for 50 visits all five nodes: O(n) cost.'),
	say('Con otro orden (30, 10, 40, 20, 50) queda balanceado: el 50 a 3 pasos, O(log n).', 'In another order (30, 10, 40, 20, 50) it stays balanced: 50 is 3 steps away, O(log n).'),
);

/** A traversal marks a node as visited and appends its value to the strip of results. */
const visit = (at: number, node: number, chip: string, hlModule: string): MotionCue[] => [
	enter(at, `vs-${node}`),
	enter(at + 100, chip),
	pulse(at, hlModule),
];

export const script: AnimationScript = {
	chapters: [
		{ id: 'node', label: { es: 'Un árbol en el heap', en: 'A tree on the heap' } },
		{ id: 'insert', label: { es: 'Insertar un valor', en: 'Inserting a value' } },
		{ id: 'search', label: { es: 'Buscar un valor', en: 'Searching for a value' } },
		{ id: 'traverse', label: { es: 'Los tres recorridos', en: 'The three traversals' } },
		{ id: 'free', label: { es: 'Liberar el árbol', en: 'Freeing the tree' } },
		{ id: 'shape', label: { es: 'Balanceado o degenerado', en: 'Balanced or degenerate' } },
	],
	steps: [
		// ─── Scene 1. A tree on the heap ────────────────────────────────────
		{
			id: 'nodes',
			chapter: 'node',
			scene: 'journey',
			title: { es: 'Un árbol vacío y su raíz', en: 'An empty tree and its root' },
			subtitles: nodes.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 2400),
					enter(200, 'floor-heap'),
					enter(600, 'floor-stack'),
					enter(1000, 'floor-prog'),
					enter(1500, 'v-raiz'),
					enter(1800, 'rv-null'),
					pulse(2400, 'v-raiz'),
					enterAll(2600, MODULES.insert, 120),
					enter(3400, 'hl'),
					// The call that fills the empty tree.
					shot(nodes.start(1), 'shot-calls', 2400),
					enter(nodes.start(1) + 300, 'tt-n'),
					enter(nodes.start(1) + 600, 'fr-0'),
					enter(nodes.start(1) + 800, 'li-0-null'),
					line(nodes.start(1) + 900, 2),
					pulse(nodes.start(1) + 900, 'mi-2'),
					enter(nodes.start(1) + 1500, 'sl-50'),
					pulse(nodes.start(1) + 2000, 'v-raiz'),
					// The new node is created and the root pointer takes its address.
					line(nodes.start(2), 3),
					pulse(nodes.start(2), 'mi-3'),
					enter(nodes.start(2) + 300, 'nd-50', 800),
					draw(nodes.start(2) + 1300, 'ptr-raiz', 900),
					exit(nodes.start(2) + 2200, 'rv-null'),
					exit(nodes.start(2) + 2200, 'sl-50'),
					enter(nodes.start(2) + 2300, 'rv-root'),
					exit(nodes.start(2) + 3300, 'li-0-null'),
					exit(nodes.start(2) + 3300, 'fr-0'),
					exit(nodes.start(2) + 3300, 'tt-n'),
				),
			},
		},

		// ─── Scene 2. Inserting: left or right ──────────────────────────────
		{
			id: 'descend',
			chapter: 'insert',
			scene: 'journey',
			title: { es: 'Menores a la izquierda, mayores a la derecha', en: 'Smaller to the left, larger to the right' },
			subtitles: descend.list,
			motion: {
				cues: seq(
					shot(0, 'shot-calls', 1400),
					// Insert 30: smaller than 50, down the left link to a NULL.
					enter(200, 'tt-a'),
					enter(400, 'fr-0'),
					enter(550, 'li-0-50'),
					move(500, 'p', 'a-50', 1),
					enter(650, 'p'),
					line(800, 6),
					pulse(800, 'mi-6'),
					enter(1000, 'cm-1'),
					line(1700, 7),
					pulse(1700, 'mi-7'),
					enter(1800, 'fr-1'),
					enter(1950, 'li-1-null'),
					move(1800, 'p', 'a-h30', 900),
					enter(2800, 'sl-30'),
					line(2800, 2),
					pulse(2800, 'mi-2'),
					line(3300, 3),
					pulse(3300, 'mi-3'),
					enter(3300, 'nd-30', 700),
					exit(3500, 'sl-30'),
					draw(3800, 'ar-30', 600),
					// The call returns; insert 70: larger than 50, down the right link.
					exit(4400, 'li-1-null'),
					exit(4400, 'fr-1'),
					exit(4400, 'cm-1'),
					exit(4400, 'tt-a'),
					move(4400, 'p', 'a-50', 600),
					enter(4700, 'tt-b'),
					pulse(4700, 'fr-0'),
					line(4900, 6),
					pulse(4900, 'mi-6'),
					line(5300, 9),
					pulse(5300, 'mi-9'),
					enter(5400, 'cm-2'),
					line(6000, 10),
					pulse(6000, 'mi-10'),
					enter(6100, 'fr-1'),
					enter(6250, 'li-1-null'),
					move(6100, 'p', 'a-h70', 900),
					enter(7000, 'sl-70'),
					line(7000, 2),
					pulse(7000, 'mi-2'),
					line(7500, 3),
					pulse(7500, 'mi-3'),
					enter(7500, 'nd-70', 700),
					exit(7700, 'sl-70'),
					draw(8000, 'ar-70', 600),
					// Every recursive call is a frame that asks the same question again.
					pulse(descend.start(2) + 300, 'fr-0'),
					pulse(descend.start(2) + 900, 'fr-1'),
					exit(descend.start(2) + 2600, 'li-1-null'),
					exit(descend.start(2) + 2600, 'fr-1'),
					exit(descend.start(2) + 2600, 'cm-2'),
					exit(descend.start(2) + 3000, 'li-0-50'),
					exit(descend.start(2) + 3000, 'fr-0'),
					exit(descend.start(2) + 3000, 'tt-b'),
					exit(descend.start(2) + 3000, 'p'),
				),
			},
		},

		// ─── Scene 2 (cont.). Where the new node is hung ────────────────────
		{
			id: 'place',
			chapter: 'insert',
			scene: 'journey',
			title: { es: 'Dónde se cuelga el nodo nuevo', en: 'Where the new node is hung' },
			subtitles: place.list,
			motion: {
				cues: seq(
					shot(0, 'shot-calls', 1000),
					// Insert 40: left at 50, right at 30, and the right link of 30 is NULL.
					move(100, 'p', 'a-50', 1),
					enter(200, 'tt-i'),
					enter(400, 'fr-0'),
					enter(550, 'li-0-50'),
					enter(700, 'p'),
					line(800, 6),
					pulse(800, 'mi-6'),
					enter(1000, 'cm-3'),
					line(1500, 7),
					pulse(1500, 'mi-7'),
					enter(1600, 'fr-1'),
					enter(1750, 'li-1-30'),
					move(1600, 'p', 'a-30', 800),
					line(2500, 6),
					pulse(2500, 'mi-6'),
					line(2900, 9),
					pulse(2900, 'mi-9'),
					enter(3000, 'cm-4'),
					line(3600, 10),
					pulse(3600, 'mi-10'),
					enter(3700, 'fr-2'),
					enter(3850, 'li-2-null'),
					move(3700, 'p', 'a-h40', 800),
					// The empty socket is the place: the new node is hung on it.
					enter(place.start(1), 'sl-40'),
					line(place.start(1) + 100, 2),
					pulse(place.start(1) + 100, 'mi-2'),
					line(place.start(1) + 800, 3),
					pulse(place.start(1) + 800, 'mi-3'),
					enter(place.start(1) + 900, 'nd-40', 800),
					exit(place.start(1) + 1100, 'sl-40'),
					draw(place.start(1) + 1600, 'ar-40', 700),
					exit(place.start(1) + 2500, 'li-2-null'),
					exit(place.start(1) + 2500, 'fr-2'),
					exit(place.start(1) + 2800, 'li-1-30'),
					exit(place.start(1) + 2800, 'fr-1'),
					exit(place.start(1) + 2800, 'cm-3'),
					exit(place.start(1) + 2800, 'cm-4'),
					exit(place.start(1) + 3100, 'li-0-50'),
					exit(place.start(1) + 3100, 'fr-0'),
					exit(place.start(1) + 3100, 'tt-i'),
					exit(place.start(1) + 3100, 'p'),
					// The other three go in the same way.
					shot(place.start(2) - 200, 'shot-tree', 1800),
					enter(place.start(2) + 200, 'nd-20', 700),
					draw(place.start(2) + 700, 'ar-20', 600),
					enter(place.start(2) + 1200, 'nd-60', 700),
					draw(place.start(2) + 1700, 'ar-60', 600),
					enter(place.start(2) + 2200, 'nd-80', 700),
					draw(place.start(2) + 2700, 'ar-80', 600),
				),
			},
		},

		// ─── Scene 3. Searching with the same rule ──────────────────────────
		{
			id: 'search',
			chapter: 'search',
			scene: 'journey',
			title: { es: 'Buscar con la misma regla', en: 'Searching with the same rule' },
			subtitles: search.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 1500),
					exit(100, 'ed-ins'),
					enter(450, 'ed-find'),
					exitAll(100, MODULES.insert, 60),
					enterAll(700, MODULES.find, 120),
					shot(1900, 'shot-calls', 1400),
					// find(raiz, 60): larger than 50, right.
					enter(2100, 'tt-s'),
					enter(2250, 'fr-0'),
					enter(2400, 'ls-0'),
					move(2300, 'p', 'a-50', 1),
					enter(2450, 'p'),
					line(2400, 2),
					pulse(2400, 'mf-2'),
					line(2900, 5),
					pulse(2900, 'mf-5'),
					enter(3100, 'cm-5'),
					line(3600, 8),
					pulse(3600, 'mf-8'),
					enter(3700, 'fr-1'),
					enter(3850, 'ls-1'),
					move(3700, 'p', 'a-70', 800),
					// Smaller than 70, left; the node of 60 holds the value.
					line(search.start(1) + 100, 5),
					pulse(search.start(1) + 100, 'mf-5'),
					enter(search.start(1) + 300, 'cm-6'),
					line(search.start(1) + 800, 6),
					pulse(search.start(1) + 800, 'mf-6'),
					enter(search.start(1) + 900, 'fr-2'),
					enter(search.start(1) + 1050, 'ls-2'),
					move(search.start(1) + 900, 'p', 'a-60', 800),
					line(search.start(1) + 1800, 2),
					pulse(search.start(1) + 1800, 'mf-2'),
					line(search.start(1) + 2300, 3),
					pulse(search.start(1) + 2300, 'mf-3'),
					enter(search.start(1) + 2300, 'vs-60'),
					enter(search.start(1) + 2500, 'cm-7'),
					type(search.start(1) + 2900, 'o-s60', 800),
					// The calls return; searching for 65 ends on the NULL right of 60.
					exit(search.start(2) - 300, 'ls-2'),
					exit(search.start(2) - 300, 'fr-2'),
					exit(search.start(2) - 150, 'ls-1'),
					exit(search.start(2) - 150, 'fr-1'),
					exit(search.start(2), 'ls-0'),
					exit(search.start(2), 'fr-0'),
					exit(search.start(2), 'cm-5'),
					exit(search.start(2), 'cm-6'),
					exit(search.start(2), 'cm-7'),
					exit(search.start(2), 'vs-60'),
					exit(search.start(2), 'tt-s'),
					move(search.start(2) + 100, 'p', 'a-50', 600),
					move(search.start(2) + 800, 'p', 'a-70', 600),
					move(search.start(2) + 1500, 'p', 'a-60', 600),
					move(search.start(2) + 2200, 'p', 'a-h65', 700),
					enter(search.start(2) + 2700, 'ch-no'),
					type(search.start(2) + 2900, 'o-s65', 800),
				),
			},
		},

		// ─── Scene 4. The three traversals ──────────────────────────────────
		{
			id: 'inorder',
			chapter: 'traverse',
			scene: 'journey',
			title: { es: 'Recorrido inorden', en: 'Inorder traversal' },
			subtitles: inorder.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 1400),
					exit(100, 'ch-no'),
					exit(100, 'p'),
					exit(100, 'ed-find'),
					enter(450, 'ed-trav'),
					exitAll(100, MODULES.find, 60),
					enterAll(700, MODULES.walk, 100),
					line(500, 1),
					shot(1900, 'shot-calls', 1500),
					// The first descent shows the call stack: 50, 30, 20 and then NULL.
					move(1900, 'p', 'a-50', 1),
					enter(2000, 'tt-v'),
					enter(2050, 'fr-0'),
					enter(2100, 'p'),
					enter(2200, 'lv-0'),
					line(2300, 3),
					pulse(2300, 'mt-3'),
					enter(2500, 'fr-1'),
					enter(2650, 'lv-1'),
					move(2400, 'p', 'a-30', 700),
					line(2900, 3),
					pulse(2900, 'mt-3'),
					enter(3100, 'fr-2'),
					enter(3250, 'lv-2'),
					move(3000, 'p', 'a-20', 700),
					line(3500, 3),
					pulse(3500, 'mt-3'),
					enter(3700, 'fr-3'),
					enter(3850, 'lv-3'),
					// 20 is the first visit: its left is NULL.
					line(4300, 4),
					visit(4300, 20, 'ri-1', 'mt-4'),
					exit(4800, 'lv-3'),
					exit(4800, 'fr-3'),
					exit(4950, 'lv-2'),
					exit(4950, 'fr-2'),
					exit(5100, 'lv-1'),
					exit(5100, 'fr-1'),
					exit(5250, 'lv-0'),
					exit(5250, 'fr-0'),
					exit(5250, 'tt-v'),
					// Then the values come out in order.
					move(5300, 'p', 'a-30', 500),
					visit(5850, 30, 'ri-2', 'mt-4'),
					move(5950, 'p', 'a-40', 500),
					visit(6500, 40, 'ri-3', 'mt-4'),
					move(6600, 'p', 'a-50', 500),
					visit(7150, 50, 'ri-4', 'mt-4'),
					move(7250, 'p', 'a-60', 500),
					visit(7800, 60, 'ri-5', 'mt-4'),
					move(7900, 'p', 'a-70', 500),
					visit(8450, 70, 'ri-6', 'mt-4'),
					move(8550, 'p', 'a-80', 500),
					visit(9100, 80, 'ri-7', 'mt-4'),
					type(9500, 'o-in', 1200),
				),
			},
		},
		{
			id: 'others',
			chapter: 'traverse',
			scene: 'journey',
			title: { es: 'Preorden y postorden', en: 'Preorder and postorder' },
			subtitles: others.list,
			motion: {
				cues: seq(
					exitAll(0, [...VISITED, ...STRIP('ri')], 40),
					move(200, 'p', 'a-50', 800),
					line(300, 11),
					// Preorder: each node is visited before its children.
					visit(1000, 50, 'rp-1', 'mt-11'),
					move(1250, 'p', 'a-30', 500),
					visit(1800, 30, 'rp-2', 'mt-11'),
					move(1900, 'p', 'a-20', 500),
					visit(2450, 20, 'rp-3', 'mt-11'),
					move(2550, 'p', 'a-40', 500),
					visit(3100, 40, 'rp-4', 'mt-11'),
					move(3200, 'p', 'a-70', 500),
					visit(3750, 70, 'rp-5', 'mt-11'),
					move(3850, 'p', 'a-60', 500),
					visit(4400, 60, 'rp-6', 'mt-11'),
					move(4500, 'p', 'a-80', 500),
					visit(5050, 80, 'rp-7', 'mt-11'),
					type(5200, 'o-pre', 1000),
					// Postorder: each node is visited after its children.
					exitAll(5600, [...VISITED, ...STRIP('rp')], 40),
					line(5700, 21),
					move(5700, 'p', 'a-20', 800),
					visit(6600, 20, 'rq-1', 'mt-21'),
					move(6700, 'p', 'a-40', 500),
					visit(7250, 40, 'rq-2', 'mt-21'),
					move(7350, 'p', 'a-30', 500),
					visit(7900, 30, 'rq-3', 'mt-21'),
					move(8000, 'p', 'a-60', 500),
					visit(8550, 60, 'rq-4', 'mt-21'),
					move(8650, 'p', 'a-80', 500),
					visit(9200, 80, 'rq-5', 'mt-21'),
					move(9300, 'p', 'a-70', 500),
					visit(9850, 70, 'rq-6', 'mt-21'),
					move(9950, 'p', 'a-50', 500),
					visit(10500, 50, 'rq-7', 'mt-21'),
					type(10800, 'o-post', 1200),
				),
			},
		},

		// ─── Scene 5. Freeing in postorder ──────────────────────────────────
		{
			id: 'free',
			chapter: 'free',
			scene: 'journey',
			title: { es: 'Liberar en postorden', en: 'Freeing in postorder' },
			subtitles: release.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 1400),
					exitAll(0, [...VISITED, ...STRIP('rq')], 40),
					exit(100, 'ed-trav'),
					enter(450, 'ed-free'),
					exitAll(100, MODULES.walk, 50),
					enterAll(700, MODULES.free, 120),
					line(500, 1),
					shot(1900, 'shot-calls', 1400),
					// The first descent shows the stack again: 50, 30, 20 and then NULL.
					enter(2000, 'tt-f'),
					enter(2050, 'fr-0'),
					enter(2200, 'lv-0'),
					line(2300, 5),
					pulse(2300, 'mr-5'),
					enter(2500, 'fr-1'),
					enter(2650, 'lv-1'),
					move(2400, 'p', 'a-30', 600),
					line(2900, 5),
					pulse(2900, 'mr-5'),
					enter(3100, 'fr-2'),
					enter(3250, 'lv-2'),
					move(3000, 'p', 'a-20', 600),
					line(3500, 5),
					pulse(3500, 'mr-5'),
					enter(3700, 'fr-3'),
					enter(3850, 'lv-3'),
					// free(20): the leaf goes first, once its children (NULL) are done.
					line(4300, 7),
					pulse(4300, 'mr-7'),
					enter(4300, 'vs-20'),
					exit(4800, 'lv-3'),
					exit(4800, 'fr-3'),
					exit(4900, 'lv-2'),
					exit(4900, 'fr-2'),
					exit(4900, 'vs-20'),
					exit(4900, 'nd-20'),
					exit(4900, 'ar-20'),
					enter(release.start(1) + 100, 'ch-leak'),
					// Then 40, 30, 60, 80, 70 and finally the root.
					move(5200, 'p', 'a-40', 500),
					enter(5700, 'vs-40'),
					pulse(5700, 'mr-7'),
					exit(5950, 'vs-40'),
					exit(5950, 'nd-40'),
					exit(5950, 'ar-40'),
					move(6100, 'p', 'a-30', 500),
					enter(6600, 'vs-30'),
					pulse(6600, 'mr-7'),
					exit(6850, 'vs-30'),
					exit(6850, 'nd-30'),
					exit(6850, 'ar-30'),
					exit(6850, 'lv-1'),
					exit(6850, 'fr-1'),
					move(7000, 'p', 'a-60', 500),
					enter(7500, 'vs-60'),
					pulse(7500, 'mr-7'),
					exit(7750, 'vs-60'),
					exit(7750, 'nd-60'),
					exit(7750, 'ar-60'),
					exit(8000, 'ch-leak'),
					move(7900, 'p', 'a-80', 500),
					enter(8400, 'vs-80'),
					pulse(8400, 'mr-7'),
					exit(8650, 'vs-80'),
					exit(8650, 'nd-80'),
					exit(8650, 'ar-80'),
					move(8800, 'p', 'a-70', 500),
					enter(9300, 'vs-70'),
					pulse(9300, 'mr-7'),
					exit(9550, 'vs-70'),
					exit(9550, 'nd-70'),
					exit(9550, 'ar-70'),
					move(9700, 'p', 'a-50', 500),
					enter(10200, 'vs-50'),
					pulse(10200, 'mr-7'),
					exit(10450, 'vs-50'),
					exit(10450, 'nd-50'),
					exit(10450, 'lv-0'),
					exit(10450, 'fr-0'),
					exit(10450, 'tt-f'),
					exit(10500, 'p'),
					// The caller sets its pointer to NULL: the tree is empty again.
					line(10700, 11),
					pulse(10700, 'mr-11'),
					exit(11000, 'ptr-raiz'),
					exit(11200, 'rv-root'),
					enter(11300, 'rv-null'),
					type(11700, 'o-free', 1000),
				),
			},
		},

		// ─── Scene 6. Balanced or degenerate ────────────────────────────────
		{
			id: 'degenerate',
			chapter: 'shape',
			scene: 'journey',
			title: { es: 'El orden de inserción decide la forma', en: 'Insertion order decides the shape' },
			subtitles: shape.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 1400),
					exit(100, 'ed-free'),
					enter(450, 'ed-lin'),
					exitAll(100, MODULES.free, 60),
					line(500, 1),
					shot(1500, 'shot-chain', 1400),
					// 10, 20, 30, 40, 50 in order: every value goes to the right.
					line(1700, 2),
					enter(1700, 'dn-10', 600),
					line(2500, 3),
					enter(2500, 'dn-20', 600),
					draw(2900, 'dr-20', 500),
					line(3300, 4),
					enter(3300, 'dn-30', 600),
					draw(3700, 'dr-30', 500),
					line(4100, 5),
					enter(4100, 'dn-40', 600),
					draw(4500, 'dr-40', 500),
					line(4900, 6),
					enter(4900, 'dn-50', 600),
					draw(5300, 'dr-50', 500),
					// Searching for 50 walks the five nodes.
					move(shape.start(1) - 100, 'p', 'da-10', 1),
					enter(shape.start(1), 'p'),
					move(shape.start(1) + 500, 'p', 'da-20', 500),
					flow(shape.start(1) + 500, 'dr-20'),
					move(shape.start(1) + 1050, 'p', 'da-30', 500),
					flow(shape.start(1) + 1050, 'dr-30'),
					move(shape.start(1) + 1600, 'p', 'da-40', 500),
					flow(shape.start(1) + 1600, 'dr-40'),
					move(shape.start(1) + 2150, 'p', 'da-50', 500),
					flow(shape.start(1) + 2150, 'dr-50'),
					enter(shape.start(1) + 2700, 'ch-lin'),
					// The same values in another order: a balanced tree, 50 is three steps away.
					exit(shape.start(2), 'p'),
					shot(shape.start(2), 'shot-bal', 1400),
					exit(shape.start(2), 'ed-lin'),
					enter(shape.start(2) + 250, 'ed-bal'),
					line(shape.start(2) + 300, 2),
					enter(shape.start(2) + 300, 'bn-30', 600),
					line(shape.start(2) + 820, 3),
					enter(shape.start(2) + 820, 'bn-10', 600),
					draw(shape.start(2) + 1170, 'br-10', 500),
					line(shape.start(2) + 1340, 4),
					enter(shape.start(2) + 1340, 'bn-40', 600),
					draw(shape.start(2) + 1690, 'br-40', 500),
					line(shape.start(2) + 1860, 5),
					enter(shape.start(2) + 1860, 'bn-20', 600),
					draw(shape.start(2) + 2210, 'br-20', 500),
					line(shape.start(2) + 2380, 6),
					enter(shape.start(2) + 2380, 'bn-50', 600),
					draw(shape.start(2) + 2730, 'br-50', 500),
					move(shape.start(2) + 2900, 'p', 'ba-30', 1),
					enter(shape.start(2) + 3000, 'p'),
					move(shape.start(2) + 3350, 'p', 'ba-40', 500),
					flow(shape.start(2) + 3350, 'br-40'),
					move(shape.start(2) + 3850, 'p', 'ba-50', 500),
					flow(shape.start(2) + 3850, 'br-50'),
					enter(shape.start(2) + 4300, 'ch-bal'),
					// The camera pulls back to show both shapes side by side.
					shot(shape.start(2) + 4500, 'shot-all', 2200),
				),
			},
		},
	],
};
