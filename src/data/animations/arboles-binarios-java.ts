import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a search in a binary search tree (BST)": a two-minute film for
// Java lesson 18 (`15-tad-arboles-binarios-y-busqueda`, file `17-tad-arboles-binarios-y-busqueda`).
// Played on a single persistent motion canvas (`data-scene="journey"` in
// `src/components/animaciones/arboles-binarios-java.astro`): the code editor on the
// left highlights the executing line while the isometric 2.5D tree on the right
// shows the BST invariant, `buscar(35)` discarding half the tree at each level in
// O(log n), the degenerate chain in O(n) (magenta), `insertar(25)` attaching a new
// leaf at a `null` link, and `inOrden` visiting the values in ascending order.
// Identifiers follow the lesson: `NodoArbol`/`TreeNode`, `valor`/`value`.

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

const seq = (...cues: MotionCue[]): MotionCue[] =>
	cues
		.map((cue, index) => ({ cue, index }))
		.sort((a, b) => a.cue.at - b.cue.at || a.index - b.index)
		.map((entry) => entry.cue);

const shot = (at: number, to: string, dur: number): MotionCue => ({ at, do: 'camera', to: [to], dur, pad: 0 });

const typeLines = (at: number, page: 'ea' | 'eb', from: number, to: number, gap: number): MotionCue[] =>
	Array.from({ length: to - from + 1 }, (_, index) => ({
		at: at + index * gap,
		do: 'type' as const,
		el: `${page}-${from + index}`,
		dur: Math.max(200, gap),
	}));

const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/** In-order visit: the flow lands on a node and the node receives its visiting order. */
const visit = (at: number, key: number): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a-n${key}`, dur: 450 },
	{ at: at + 400, do: 'enter', el: `ord-${key}` },
];
const IN_ORDER = [20, 25, 30, 35, 50, 60, 70, 80];

// ─── Captions ───────────────────────────────────────────────────────────────
const nodes = timed(
	say(
		'Cada `NodoArbol` guarda su `valor` y dos enlaces: `izquierdo` y `derecho`.',
		'Each `TreeNode` stores its `value` and two links: `left` and `right`.',
	),
	say(
		'Desde la raíz `50` cuelgan dos subárboles: `30` a la izquierda y `70` a la derecha.',
		'From the root `50` hang two subtrees: `30` on the left and `70` on the right.',
	),
);
const rule = timed(
	say(
		'La propiedad del ABB: valores menores a la izquierda (`<`) y mayores a la derecha (`>`).',
		'The BST property: smaller values on the left (`<`) and larger values on the right (`>`).',
	),
	say(
		'Esa regla se cumple en todo nodo: convierte cada búsqueda en una decisión.',
		'That rule holds at every node: it turns every search into a decision.',
	),
);
const root = timed(
	say(
		'En `main`, `buscar(35)` arranca en la raíz `50` y compara: `35 < 50`.',
		'In `main`, `search(35)` starts at the root `50` and compares: `35 < 50`.',
	),
	say(
		'Al doblar a la izquierda hacia `30`, descarta todo el subárbol derecho de una vez.',
		'By branching left toward `30`, it discards the entire right subtree at once.',
	),
	say(
		'Los nodos `70`, `60` y `80` ni siquiera se visitan: `35` no puede estar ahí.',
		'Nodes `70`, `60` and `80` are never even visited: `35` cannot be there.',
	),
);
const found = timed(
	say(
		'En el nodo `30` vuelve a comparar: como `35 > 30`, dobla a la derecha y descarta `20`.',
		'At node `30` it compares again: since `35 > 30`, it branches right and discards `20`.',
	),
	say(
		'Llega a `35 == 35`: valor encontrado en `O(log n)` pasos, proporcional a la altura.',
		'It reaches `35 == 35`: value found in `O(log n)` steps, proportional to the height.',
	),
);
const degenerate = timed(
	say(
		'Pero cuidado: si insertas valores ya ordenados, el árbol degenera en una cadena.',
		'But beware: if you insert values already sorted, the tree degenerates into a chain.',
	),
	say(
		'Sin subárboles que descartar, buscar vuelve a costar `O(n)` como en una lista.',
		'With no subtrees to discard, searching costs `O(n)` again just like a list.',
	),
);
const insert = timed(
	say(
		'`insertar(25)` baja con la misma regla: `25 < 50` a `30`, y `25 < 30` a `20`.',
		'`insert(25)` descends by the same rule: `25 < 50` to `30`, and `25 < 30` to `20`.',
	),
	say(
		'Como `25 > 20`, sigue el enlace derecho y encuentra `null`: el lugar vacío.',
		'Since `25 > 20`, it follows the right link and hits `null`: the empty spot.',
	),
	say(
		'El caso base crea `new NodoArbol(25)`; al volver, `nodo.derecho` lo engancha como nueva hoja.',
		'The base case creates `new TreeNode(25)`; on return, `node.right` attaches it as a new leaf.',
	),
);
const inorder = timed(
	say(
		'Los recorridos `preOrden`, `inOrden` y `postOrden` cambian cuándo visitan la raíz.',
		'The `preOrder`, `inOrder` and `postOrder` traversals change when they visit the root.',
	),
	say(
		'Como `inOrden` visita izquierdo, raíz y derecho, recorre los valores en orden ascendente.',
		'Because `inOrder` visits left, root and right, it walks the values in ascending order.',
	),
);
const recap = timed(
	say(
		'Propiedad del ABB: menores a la izquierda y mayores a la derecha en cada subárbol.',
		'BST property: smaller values on the left and larger on the right in every subtree.',
	),
	say(
		'Si el árbol está balanceado, cada paso descarta la mitad del árbol: `O(log n)`.',
		'When the tree is balanced, each step discards half the tree: `O(log n)`.',
	),
	say(
		'Y el recorrido `inOrden` entrega todos los valores ordenados sin ordenar nada.',
		'And the `inOrder` traversal delivers all the values sorted without sorting anything.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'invariant', label: { es: 'La propiedad del ABB', en: 'The BST property' } },
		{ id: 'root-cut', label: { es: 'Descartar medio árbol', en: 'Discarding half the tree' } },
		{ id: 'found-balance', label: { es: 'O(log n) frente a O(n)', en: 'O(log n) versus O(n)' } },
		{ id: 'insert', label: { es: 'Insertar en un enlace null', en: 'Inserting at a null link' } },
		{ id: 'traversal', label: { es: 'Recorrido inOrden ordenado', en: 'Sorted inOrder traversal' } },
		{ id: 'recap', label: { es: 'Resumen del viaje', en: 'Journey recap' } },
	],
	steps: [
		// ─── Scene 1. The BST property ───────────────────────────────────────
		{
			id: 'nodes',
			chapter: 'invariant',
			scene: 'journey',
			title: { es: 'Nodos con valor, izquierdo y derecho', en: 'Nodes with value, left and right' },
			subtitles: nodes.list,
			motion: {
				cues: seq(
					shot(0, 'shot-tree', 4200),
					{ at: 150, do: 'enter', el: 'floor-tree' },
					...typeLines(250, 'ea', 1, 5, 300),
					{ at: 900, do: 'enter', el: 'n50' },
					{ at: 1300, do: 'enter', el: 'lb-root' },
					{ at: 1800, do: 'pulse', el: 'n50' },
					{ at: nodes.start(1), do: 'draw', el: 'edge-50-30', dur: 700 },
					{ at: nodes.start(1) + 200, do: 'draw', el: 'edge-50-70', dur: 700 },
					{ at: nodes.start(1) + 700, do: 'enter', el: 'n30' },
					{ at: nodes.start(1) + 900, do: 'enter', el: 'n70' },
					{ at: nodes.start(1) + 1400, do: 'draw', el: 'edge-30-20', dur: 600 },
					{ at: nodes.start(1) + 1500, do: 'draw', el: 'edge-30-35', dur: 600 },
					{ at: nodes.start(1) + 1600, do: 'draw', el: 'edge-70-60', dur: 600 },
					{ at: nodes.start(1) + 1700, do: 'draw', el: 'edge-70-80', dur: 600 },
					{ at: nodes.start(1) + 2100, do: 'enter', el: 'n20' },
					{ at: nodes.start(1) + 2250, do: 'enter', el: 'n35' },
					{ at: nodes.start(1) + 2400, do: 'enter', el: 'n60' },
					{ at: nodes.start(1) + 2550, do: 'enter', el: 'n80' },
				),
			},
		},
		{
			id: 'rule',
			chapter: 'invariant',
			scene: 'journey',
			title: { es: 'Menores a la izquierda, mayores a la derecha', en: 'Smaller on the left, larger on the right' },
			subtitles: rule.list,
			motion: {
				cues: seq(
					shot(0, 'shot-invariant', 2400),
					...typeLines(200, 'ea', 6, 20, 170),
					{ at: 400, do: 'enter', el: 'hv-a6' },
					{ at: 700, do: 'enter', el: 'zone-left' },
					{ at: 900, do: 'enter', el: 'ch-less' },
					{ at: 1500, do: 'pulse', el: 'ch-less' },
					{ at: 2100, do: 'enter', el: 'zone-right' },
					{ at: 2300, do: 'enter', el: 'ch-greater' },
					{ at: 2900, do: 'pulse', el: 'ch-greater' },
					{ at: rule.start(1) + 200, do: 'enter', el: 'ch-inv' },
					{ at: rule.start(1) + 900, do: 'pulse', el: 'n30' },
					{ at: rule.start(1) + 1500, do: 'pulse', el: 'n70' },
					{ at: rule.start(1) + 2200, do: 'pulse', el: 'ch-inv' },
				),
			},
		},

		// ─── Scene 2. Discarding half the tree ───────────────────────────────
		{
			id: 'root',
			chapter: 'root-cut',
			scene: 'journey',
			title: { es: 'buscar(35): primera comparación en 50', en: 'search(35): first comparison at 50' },
			subtitles: root.list,
			motion: {
				cues: seq(
					...clear(0, 'zone-left', 'zone-right', 'ch-less', 'ch-greater', 'ch-inv', 'hv-a6'),
					shot(0, 'shot-root', 2200),
					{ at: 150, do: 'enter', el: 'floor-main' },
					{ at: 300, do: 'enter', el: 'm-search' },
					{ at: 450, do: 'enter', el: 'm-ins' },
					{ at: 600, do: 'enter', el: 'hl' },
					{ at: 650, do: 'enter', el: 'p' },
					{ at: 800, do: 'move', el: 'p', to: 'a-call-search', dur: 700 },
					{ at: 800, do: 'move', el: 'hl', to: 'ln-20', dur: 500 },
					{ at: 1500, do: 'enter', el: 'm-search-on' },
					{ at: 1600, do: 'move', el: 'hl', to: 'ln-10', dur: 400 },
					{ at: 1800, do: 'draw', el: 'fl-call-root', dur: 800 },
					{ at: 1900, do: 'move', el: 'p', to: 'a-n50', dur: 1000 },
					{ at: 2200, do: 'move', el: 'hl', to: 'ln-15', dur: 500 },
					{ at: 2900, do: 'enter', el: 'n50-on' },
					{ at: 3100, do: 'enter', el: 'ch-cmp-50' },
					{ at: 3700, do: 'pulse', el: 'ch-cmp-50' },
					{ at: root.start(1) + 200, do: 'move', el: 'hl', to: 'ln-16', dur: 500 },
					{ at: root.start(1) + 400, do: 'draw', el: 'fl-50-30', dur: 800 },
					{ at: root.start(1) + 500, do: 'move', el: 'p', to: 'a-n30', dur: 1000 },
					{ at: root.start(1) + 1500, do: 'enter', el: 'veil-right' },
					{ at: root.start(1) + 1700, do: 'enter', el: 'ch-discard-r' },
					{ at: root.start(2) + 400, do: 'pulse', el: 'ch-discard-r' },
					{ at: root.start(2) + 1800, do: 'pulse', el: 'n30' },
				),
			},
		},

		// ─── Scene 3. O(log n) vs degenerate O(n) ────────────────────────────
		{
			id: 'found',
			chapter: 'found-balance',
			scene: 'journey',
			title: { es: 'Segunda comparación y hallazgo en O(log n)', en: 'Second comparison and O(log n) match' },
			subtitles: found.list,
			motion: {
				cues: seq(
					...clear(0, 'ch-cmp-50', 'ch-discard-r'),
					shot(0, 'shot-left', 2200),
					{ at: 300, do: 'enter', el: 'n30-on' },
					{ at: 400, do: 'move', el: 'hl', to: 'ln-15', dur: 500 },
					{ at: 700, do: 'enter', el: 'ch-cmp-30' },
					{ at: 1300, do: 'pulse', el: 'ch-cmp-30' },
					{ at: 1800, do: 'move', el: 'hl', to: 'ln-17', dur: 500 },
					{ at: 2000, do: 'enter', el: 'veil-n20' },
					{ at: 2300, do: 'draw', el: 'fl-30-35', dur: 800 },
					{ at: 2400, do: 'move', el: 'p', to: 'a-n35', dur: 1000 },
					{ at: found.start(1) + 100, do: 'move', el: 'hl', to: 'ln-14', dur: 500 },
					{ at: found.start(1) + 300, do: 'enter', el: 'hv-a14' },
					{ at: found.start(1) + 400, do: 'enter', el: 'n35-found' },
					{ at: found.start(1) + 700, do: 'enter', el: 'ch-found' },
					{ at: found.start(1) + 1100, do: 'type', el: 'out-1', dur: 700 },
					{ at: found.start(1) + 1900, do: 'pulse', el: 'n35-found' },
					{ at: found.start(1) + 2700, do: 'pulse', el: 'ch-found' },
				),
			},
		},
		{
			id: 'degenerate',
			chapter: 'found-balance',
			scene: 'journey',
			title: { es: 'El peligro: árbol degenerado en cadena O(n)', en: 'The trap: a tree degenerated into an O(n) chain' },
			subtitles: degenerate.list,
			motion: {
				cues: seq(
					...clear(0, 'ch-cmp-30', 'ch-found', 'hv-a14'),
					shot(0, 'shot-deg', 2200),
					{ at: 300, do: 'enter', el: 'floor-deg' },
					{ at: 600, do: 'enter', el: 'deg-chain' },
					{ at: 1100, do: 'draw', el: 'rt-deg', dur: 1100 },
					{ at: 1400, do: 'enter', el: 'hx-a17' },
					{ at: 2200, do: 'enter', el: 'ch-deg-order' },
					{ at: 2900, do: 'pulse', el: 'ch-deg-order' },
					{ at: degenerate.start(1) + 200, do: 'enter', el: 'ch-deg-on' },
					{ at: degenerate.start(1) + 900, do: 'flow', el: 'rt-deg' },
					{ at: degenerate.start(1) + 1600, do: 'pulse', el: 'deg-chain' },
					{ at: degenerate.start(1) + 2500, do: 'pulse', el: 'ch-deg-on' },
				),
			},
		},

		// ─── Scene 4. Inserting at a null link ───────────────────────────────
		{
			id: 'insert',
			chapter: 'insert',
			scene: 'journey',
			title: { es: 'insertar(25): bajar hasta null y colgar la hoja', en: 'insert(25): descend to null and attach the leaf' },
			subtitles: insert.list,
			motion: {
				cues: seq(
					...clear(
						0,
						'floor-deg',
						'deg-chain',
						'rt-deg',
						'hx-a17',
						'ch-deg-order',
						'ch-deg-on',
						'veil-right',
						'veil-n20',
						'n50-on',
						'n30-on',
						'n35-found',
						'fl-call-root',
						'fl-50-30',
						'fl-30-35',
						'm-search-on',
						'out-1',
						'ea',
					),
					shot(0, 'shot-insert', 2200),
					{ at: 300, do: 'enter', el: 'eb' },
					...typeLines(350, 'eb', 1, 20, 110),
					{ at: 700, do: 'move', el: 'p', to: 'a-call-ins', dur: 600 },
					{ at: 700, do: 'move', el: 'hl', to: 'ln-20', dur: 500 },
					{ at: 1300, do: 'enter', el: 'm-ins-on' },
					{ at: 1400, do: 'move', el: 'hl', to: 'ln-3', dur: 400 },
					{ at: 1500, do: 'draw', el: 'fl-call-ins', dur: 700 },
					{ at: 1600, do: 'move', el: 'p', to: 'a-n50', dur: 800 },
					{ at: 2000, do: 'move', el: 'hl', to: 'ln-7', dur: 400 },
					{ at: 2400, do: 'enter', el: 'n50-on' },
					{ at: 2600, do: 'draw', el: 'fl-i-50-30', dur: 600 },
					{ at: 2600, do: 'move', el: 'hl', to: 'ln-8', dur: 300 },
					{ at: 2700, do: 'move', el: 'p', to: 'a-n30', dur: 800 },
					{ at: 3200, do: 'move', el: 'hl', to: 'ln-7', dur: 300 },
					{ at: 3500, do: 'enter', el: 'n30-on' },
					{ at: 3700, do: 'draw', el: 'fl-i-30-20', dur: 600 },
					{ at: 3700, do: 'move', el: 'hl', to: 'ln-8', dur: 300 },
					{ at: 3800, do: 'move', el: 'p', to: 'a-n20', dur: 800 },
					{ at: 4600, do: 'enter', el: 'n20-on' },
					{ at: insert.start(1) + 200, do: 'move', el: 'hl', to: 'ln-9', dur: 400 },
					{ at: insert.start(1) + 700, do: 'move', el: 'hl', to: 'ln-10', dur: 400 },
					{ at: insert.start(1) + 800, do: 'enter', el: 'slot-null' },
					{ at: insert.start(1) + 1100, do: 'enter', el: 'ch-null' },
					{ at: insert.start(1) + 1700, do: 'pulse', el: 'slot-null' },
					{ at: insert.start(2) + 100, do: 'move', el: 'hl', to: 'ln-6', dur: 500 },
					{ at: insert.start(2) + 300, do: 'enter', el: 'hv-b6' },
					{ at: insert.start(2) + 500, do: 'exit', el: 'slot-null', dur: 300 },
					{ at: insert.start(2) + 600, do: 'draw', el: 'edge-20-25', dur: 700 },
					{ at: insert.start(2) + 600, do: 'draw', el: 'fl-i-20-25', dur: 700 },
					{ at: insert.start(2) + 800, do: 'move', el: 'p', to: 'a-n25', dur: 800 },
					{ at: insert.start(2) + 1200, do: 'enter', el: 'n25' },
					{ at: insert.start(2) + 1500, do: 'enter', el: 'ch-leaf-25' },
					{ at: insert.start(2) + 2000, do: 'move', el: 'hl', to: 'ln-10', dur: 500 },
					{ at: insert.start(2) + 2600, do: 'pulse', el: 'n25' },
				),
			},
		},

		// ─── Scene 5. In-order traversal visits values in sorted order ───────
		{
			id: 'inorder',
			chapter: 'traversal',
			scene: 'journey',
			title: { es: 'Recorrido inOrden: izquierdo · raíz · derecho', en: 'inOrder traversal: left · root · right' },
			subtitles: inorder.list,
			motion: {
				cues: seq(
					...clear(
						0,
						'ch-null',
						'ch-leaf-25',
						'hv-b6',
						'n50-on',
						'n30-on',
						'n20-on',
						'fl-call-ins',
						'fl-i-50-30',
						'fl-i-30-20',
						'fl-i-20-25',
						'm-ins-on',
					),
					shot(0, 'shot-traversal', 2200),
					{ at: 300, do: 'move', el: 'hl', to: 'ln-20', dur: 500 },
					{ at: 600, do: 'enter', el: 'ch-orders' },
					{ at: 1400, do: 'pulse', el: 'ch-orders' },
					{ at: 2200, do: 'move', el: 'hl', to: 'ln-15', dur: 500 },
					{ at: 3000, do: 'move', el: 'hl', to: 'ln-16', dur: 500 },
					{ at: 3300, do: 'enter', el: 'hv-b16' },
					...IN_ORDER.flatMap((key, index) => visit(inorder.start(1) + index * 600, key)),
					{ at: inorder.start(1) + 4900, do: 'type', el: 'out-2', dur: 1000 },
					{ at: inorder.start(1) + 5000, do: 'enter', el: 'ch-sorted' },
					{ at: inorder.start(1) + 5800, do: 'pulse', el: 'ch-sorted' },
				),
			},
		},

		// ─── Scene 6. Recap ──────────────────────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'El orden vive en la forma del árbol', en: 'The order lives in the shape of the tree' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'ch-orders', 'ch-sorted', 'hv-b16', ...IN_ORDER.map((key) => `ord-${key}`)),
					shot(100, 'shot-all', 2600),
					{ at: 500, do: 'enter', el: 'fl-call-root' },
					{ at: 600, do: 'enter', el: 'fl-50-30' },
					{ at: 700, do: 'enter', el: 'fl-30-35' },
					{ at: 900, do: 'enter', el: 'n50-on' },
					{ at: 1000, do: 'enter', el: 'n30-on' },
					{ at: 1100, do: 'enter', el: 'n35-found' },
					{ at: 1400, do: 'enter', el: 'r-inv' },
					{ at: 1800, do: 'flow', el: 'fl-call-root' },
					{ at: 1800, do: 'flow', el: 'fl-50-30' },
					{ at: 1800, do: 'flow', el: 'fl-30-35' },
					{ at: 2200, do: 'pulse', el: 'r-inv' },
					{ at: recap.start(1) + 200, do: 'enter', el: 'r-log' },
					{ at: recap.start(1) + 900, do: 'pulse', el: 'n35-found' },
					{ at: recap.start(1) + 1800, do: 'pulse', el: 'r-log' },
					{ at: recap.start(2) + 200, do: 'enter', el: 'r-ord' },
					{ at: recap.start(2) + 900, do: 'pulse', el: 'n25' },
					{ at: recap.start(2) + 1800, do: 'pulse', el: 'r-ord' },
				),
			},
		},
	],
};
