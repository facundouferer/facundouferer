import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a node: static lists versus linked lists": a short film (about two
// minutes) for the Java lesson "TAD Lista: Estáticas, Dinámicas y Enlazadas"
// (order: 16). It plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/tad-listas-java.astro`): an isometric system with a
// contiguous array platform at the back and the Heap platform in front, where nodes
// lie scattered and linked by `siguiente` references.
// Light blue is the normal flow (reading, shifting, walking with `actual`), magenta
// is the broken insertion order that loses the list, and violet is the correct
// rewiring (`nuevo.siguiente = cabeza`, then `cabeza = nuevo`, and the removal jump).

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

// ─── Captions ───────────────────────────────────────────────────────────────
const array = timed(
	say(
		'Una lista estática guarda sus datos en un arreglo: celdas seguidas en memoria contigua.',
		'A static list keeps its data in an array: back-to-back cells in contiguous memory.',
	),
	say(
		'Por eso `obtener(1)` es una sola cuenta: salta directo a la celda 1 sin recorrer. Lectura en O(1).',
		'That is why `get(1)` is a single calculation: it jumps straight to cell 1 without walking. Reading is O(1).',
	),
);
const shift = timed(
	say(
		'`agregarAlInicio(10)` necesita libre la celda 0: antes debe desplazar cada elemento una posición.',
		'`addFirst(10)` needs cell 0 free: first it must shift every element one position to the right.',
	),
	say(
		'El `for` corre el 30 y luego el 20; con n elementos son n movimientos. Insertar al inicio cuesta O(n).',
		'The `for` loop moves 30 and then 20; with n elements that is n moves. Inserting at the front costs O(n).',
	),
);
const nodes = timed(
	say(
		'La lista enlazada usa otra pieza: el `Nodo`, un objeto con un `dato` y una referencia `siguiente`.',
		'The linked list uses another piece: the `Node`, an object with `data` and a `next` reference.',
	),
	say(
		'Los nodos quedan dispersos por el Heap. Solo `cabeza` sabe dónde empieza; el último apunta a `null`.',
		'Nodes sit scattered across the Heap. Only `head` knows where it starts; the last one points to `null`.',
	),
);
const order = timed(
	say(
		'`agregarAlInicio(10)` crea `nuevo` con `new Nodo(10)`: nace aislado, con `siguiente` en `null`.',
		'`addFirst(10)` creates `fresh` with `new Node(10)`: it is born isolated, with `next` set to `null`.',
	),
	say(
		'Si `cabeza = nuevo` va primero, se pierde el 20: compila, pero el recolector se lleva el resto de la lista.',
		'If `head = fresh` goes first, 20 is lost: it compiles, but the garbage collector takes the rest of the list.',
	),
);
const insert = timed(
	say(
		'El orden correcto: `nuevo.siguiente = cabeza` engancha primero al 20, que la lista ya tenía.',
		'The right order: `fresh.next = head` first hooks up node 20, which the list already had.',
	),
	say(
		'Recién después `cabeza = nuevo` adopta al 10 como primero. Ningún nodo se movió: inserción en O(1).',
		'Only then does `head = fresh` adopt 10 as the first. No node moved: insertion in O(1).',
	),
);
const traverse = timed(
	say(
		'`mostrar()` recorre con una variable auxiliar: `actual` arranca en `cabeza`, que nunca se mueve.',
		'`print()` walks with an auxiliary variable: `current` starts at `head`, which never moves.',
	),
	say(
		'Cada vuelta imprime `actual.dato` y avanza con `actual = actual.siguiente` hasta llegar a `null`.',
		'Each pass prints `current.data` and advances with `current = current.next` until it reaches `null`.',
	),
);
const remove = timed(
	say(
		'Para quitar el 20 hay que pararse en el nodo `anterior`: desde el 20 no se puede volver atrás.',
		'To remove 20 you have to stand on the `previous` node: from 20 there is no way back.',
	),
	say(
		'`anterior.siguiente = anterior.siguiente.siguiente` salta el 20; sin referencias, el recolector se lo lleva.',
		'`previous.next = previous.next.next` skips 20; with no references left, the garbage collector takes it.',
	),
);
const recap = timed(
	say(
		'El arreglo paga la inserción para que la lectura sea gratis: leer es O(1), insertar al inicio, O(n).',
		'The array pays for insertion so reading is free: reading is O(1), inserting at the front, O(n).',
	),
	say(
		'La lista enlazada paga la lectura para que la inserción sea gratis: caminar es O(n), enganchar es O(1).',
		'The linked list pays for reading so insertion is free: walking is O(n), hooking up is O(1).',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'static', label: { es: 'La lista estática', en: 'The static list' } },
		{ id: 'nodes', label: { es: 'Nodos en el Heap', en: 'Nodes in the Heap' } },
		{ id: 'insert', label: { es: 'Insertar al inicio', en: 'Inserting at the front' } },
		{ id: 'traverse', label: { es: 'Recorrer con actual', en: 'Walking with current' } },
		{ id: 'remove', label: { es: 'Eliminar es reenganchar', en: 'Removing is rewiring' } },
		{ id: 'recap', label: { es: 'Costos inversos', en: 'Opposite costs' } },
	],
	steps: [
		// ─── Scene 1. The static list ───────────────────────────────────────
		{
			id: 'array',
			chapter: 'static',
			scene: 'journey',
			title: { es: 'Celdas contiguas', en: 'Contiguous cells' },
			subtitles: array.list,
			motion: {
				cues: seq(
					shot(0, 'shot-arr', 4000),
					{ at: 200, do: 'enter', el: 'floor-arr' },
					...typeLines(300, 'ea', 1, 14, 200),
					{ at: 1400, do: 'enter', el: 'val-20' },
					{ at: 1600, do: 'enter', el: 'val-30' },
					{ at: 1900, do: 'enter', el: 'cnt-2' },
					{ at: 2600, do: 'pulse', el: 'floor-arr' },
					{ at: array.start(1) + 100, do: 'enter', el: 'hl' },
					{ at: array.start(1) + 100, do: 'move', el: 'hl', to: 'ln-5', dur: 500 },
					{ at: array.start(1) + 500, do: 'enter', el: 'p' },
					{ at: array.start(1) + 900, do: 'draw', el: 'rd-jump', dur: 700 },
					{ at: array.start(1) + 1000, do: 'move', el: 'p', to: 'a-s1', dur: 700 },
					{ at: array.start(1) + 1800, do: 'pulse', el: 'val-30' },
					{ at: array.start(1) + 2300, do: 'enter', el: 'lb-read' },
					{ at: array.start(1) + 3300, do: 'pulse', el: 'lb-read' },
				),
			},
		},
		{
			id: 'shift',
			chapter: 'static',
			scene: 'journey',
			title: { es: 'Insertar al inicio desplaza todo', en: 'Inserting at the front shifts everything' },
			subtitles: shift.list,
			motion: {
				cues: seq(
					...clear(0, 'rd-jump', 'lb-read', 'p'),
					{ at: 300, do: 'move', el: 'hl', to: 'ln-7', dur: 600 },
					{ at: 1200, do: 'enter', el: 'slot-in' },
					{ at: 1800, do: 'pulse', el: 'slot-in' },
					{ at: 2600, do: 'move', el: 'hl', to: 'ln-9', dur: 500 },
					{ at: shift.start(1) + 100, do: 'draw', el: 'sh-30', dur: 700 },
					{ at: shift.start(1) + 200, do: 'move', el: 'val-30', to: 'a-s2', dur: 900 },
					{ at: shift.start(1) + 1300, do: 'draw', el: 'sh-20', dur: 700 },
					{ at: shift.start(1) + 1400, do: 'move', el: 'val-20', to: 'a-s1', dur: 900 },
					{ at: shift.start(1) + 2300, do: 'enter', el: 'lb-shift' },
					{ at: shift.start(1) + 2600, do: 'move', el: 'hl', to: 'ln-11', dur: 500 },
					{ at: shift.start(1) + 3000, do: 'exit', el: 'slot-in', dur: 300 },
					{ at: shift.start(1) + 3200, do: 'enter', el: 'val-10' },
					{ at: shift.start(1) + 3700, do: 'move', el: 'hl', to: 'ln-12', dur: 400 },
					{ at: shift.start(1) + 3900, do: 'exit', el: 'cnt-2', dur: 300 },
					{ at: shift.start(1) + 4200, do: 'enter', el: 'cnt-3' },
					{ at: shift.start(1) + 4700, do: 'pulse', el: 'lb-shift' },
				),
			},
		},

		// ─── Scene 2. Nodes in the Heap ─────────────────────────────────────
		{
			id: 'nodes',
			chapter: 'nodes',
			scene: 'journey',
			title: { es: 'El nodo: dato y siguiente', en: 'The node: data and next' },
			subtitles: nodes.list,
			motion: {
				cues: seq(
					...clear(0, 'sh-30', 'sh-20', 'lb-shift', 'cnt-3'),
					shot(0, 'shot-heap', 3000),
					{ at: 300, do: 'move', el: 'hl', to: 'ln-16', dur: 600 },
					...typeLines(400, 'ea', 16, 20, 260),
					{ at: 600, do: 'enter', el: 'floor-heap' },
					{ at: 1500, do: 'enter', el: 'n1' },
					{ at: 1800, do: 'enter', el: 'n2' },
					{ at: 2500, do: 'enter', el: 'lb-node' },
					{ at: 3300, do: 'pulse', el: 'lb-node' },
					{ at: nodes.start(1) + 100, do: 'enter', el: 'm-head' },
					{ at: nodes.start(1) + 400, do: 'draw', el: 'rt-head-n1', dur: 800 },
					{ at: nodes.start(1) + 1300, do: 'draw', el: 'rt-n1-n2', dur: 800 },
					{ at: nodes.start(1) + 2200, do: 'enter', el: 'nul' },
					{ at: nodes.start(1) + 2300, do: 'draw', el: 'rt-n2-null', dur: 700 },
					{ at: nodes.start(1) + 3200, do: 'pulse', el: 'm-head' },
					{ at: nodes.start(1) + 4200, do: 'pulse', el: 'nul' },
				),
			},
		},

		// ─── Scene 3. Inserting at the front ────────────────────────────────
		{
			id: 'order',
			chapter: 'insert',
			scene: 'journey',
			title: { es: 'El orden no es negociable', en: 'The order is not negotiable' },
			subtitles: order.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-node', 'ea'),
					shot(0, 'shot-insert', 2600),
					{ at: 300, do: 'enter', el: 'eb' },
					...typeLines(400, 'eb', 1, 20, 90),
					{ at: 2300, do: 'move', el: 'hl', to: 'ln-5', dur: 500 },
					{ at: 2700, do: 'move', el: 'p', to: 'a-n0', dur: 1 },
					{ at: 2800, do: 'enter', el: 'n0' },
					{ at: 3000, do: 'enter', el: 'p' },
					{ at: 3200, do: 'enter', el: 'n0-null' },
					{ at: 4000, do: 'pulse', el: 'n0' },
					{ at: order.start(1) + 100, do: 'enter', el: 'hx-lost' },
					{ at: order.start(1) + 200, do: 'move', el: 'hl', to: 'ln-7', dur: 500 },
					{ at: order.start(1) + 900, do: 'exit', el: 'rt-head-n1', dur: 400 },
					{ at: order.start(1) + 1100, do: 'draw', el: 'rt-lost', dur: 800 },
					{ at: order.start(1) + 2100, do: 'enter', el: 'chain-lost' },
					{ at: order.start(1) + 2800, do: 'pulse', el: 'chain-lost' },
					{ at: order.start(1) + 3300, do: 'enter', el: 'lost-warn' },
					{ at: order.start(1) + 4300, do: 'pulse', el: 'lost-warn' },
				),
			},
		},
		{
			id: 'insert',
			chapter: 'insert',
			scene: 'journey',
			title: { es: 'Primero enganchar, después mover cabeza', en: 'Hook up first, then move head' },
			subtitles: insert.list,
			motion: {
				cues: seq(
					...clear(0, 'rt-lost', 'lost-warn', 'hx-lost', 'chain-lost'),
					{ at: 300, do: 'enter', el: 'rt-head-n1' },
					{ at: 600, do: 'move', el: 'hl', to: 'ln-6', dur: 500 },
					{ at: 1300, do: 'exit', el: 'n0-null', dur: 300 },
					{ at: 1500, do: 'draw', el: 'rt-new-n1', dur: 900 },
					{ at: 2500, do: 'pulse', el: 'n1' },
					{ at: insert.start(1) + 100, do: 'move', el: 'hl', to: 'ln-7', dur: 500 },
					{ at: insert.start(1) + 700, do: 'exit', el: 'rt-head-n1', dur: 300 },
					{ at: insert.start(1) + 1000, do: 'draw', el: 'rt-head-new', dur: 900 },
					{ at: insert.start(1) + 2000, do: 'pulse', el: 'n0' },
					{ at: insert.start(1) + 2500, do: 'pulse', el: 'n1' },
					{ at: insert.start(1) + 2700, do: 'pulse', el: 'n2' },
					{ at: insert.start(1) + 3100, do: 'enter', el: 'lb-ins' },
					{ at: insert.start(1) + 4000, do: 'pulse', el: 'lb-ins' },
				),
			},
		},

		// ─── Scene 4. Walking with actual ───────────────────────────────────
		{
			id: 'traverse',
			chapter: 'traverse',
			scene: 'journey',
			title: { es: 'actual recorre la cadena', en: 'current walks the chain' },
			subtitles: traverse.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-ins', 'p'),
					shot(0, 'shot-trav', 2400),
					{ at: 400, do: 'move', el: 'hl', to: 'ln-10', dur: 500 },
					{ at: 600, do: 'move', el: 'p', to: 'a-n0', dur: 1 },
					{ at: 800, do: 'enter', el: 'p' },
					{ at: 900, do: 'enter', el: 'lb-cur' },
					{ at: 1700, do: 'pulse', el: 'm-head' },
					{ at: 1300, do: 'flow', el: 'rt-head-new' },
					{ at: traverse.start(1) + 100, do: 'move', el: 'hl', to: 'ln-12', dur: 400 },
					{ at: traverse.start(1) + 200, do: 'pulse', el: 'n0' },
					{ at: traverse.start(1) + 1000, do: 'move', el: 'hl', to: 'ln-13', dur: 300 },
					{ at: traverse.start(1) + 1100, do: 'flow', el: 'rt-new-n1' },
					{ at: traverse.start(1) + 1200, do: 'move', el: 'p', to: 'a-n1', dur: 800 },
					{ at: traverse.start(1) + 2100, do: 'flow', el: 'rt-n1-n2' },
					{ at: traverse.start(1) + 2200, do: 'move', el: 'p', to: 'a-n2', dur: 800 },
					{ at: traverse.start(1) + 3100, do: 'flow', el: 'rt-n2-null' },
					{ at: traverse.start(1) + 3200, do: 'move', el: 'p', to: 'a-null', dur: 800 },
					{ at: traverse.start(1) + 4000, do: 'move', el: 'hl', to: 'ln-15', dur: 400 },
					{ at: traverse.start(1) + 4100, do: 'pulse', el: 'nul' },
					{ at: traverse.start(1) + 4300, do: 'type', el: 'out-1', dur: 1250 },
				),
			},
		},

		// ─── Scene 5. Removing is rewiring ──────────────────────────────────
		{
			id: 'remove',
			chapter: 'remove',
			scene: 'journey',
			title: { es: 'Saltar al nodo del medio', en: 'Skipping the middle node' },
			subtitles: remove.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-cur'),
					shot(0, 'shot-remove', 2200),
					{ at: 300, do: 'move', el: 'hl', to: 'ln-17', dur: 500 },
					{ at: 500, do: 'move', el: 'p', to: 'a-n0', dur: 1000 },
					{ at: 1500, do: 'enter', el: 'lb-prev' },
					{ at: 2200, do: 'pulse', el: 'n0' },
					{ at: 3000, do: 'pulse', el: 'n1' },
					{ at: remove.start(1) + 100, do: 'move', el: 'hl', to: 'ln-18', dur: 500 },
					{ at: remove.start(1) + 700, do: 'exit', el: 'rt-new-n1', dur: 300 },
					{ at: remove.start(1) + 900, do: 'draw', el: 'rt-skip', dur: 1000 },
					{ at: remove.start(1) + 2000, do: 'enter', el: 'n1-off' },
					{ at: remove.start(1) + 2600, do: 'pulse', el: 'n2' },
					{ at: remove.start(1) + 3200, do: 'type', el: 'out-2', dur: 1000 },
				),
			},
		},

		// ─── Scene 6. Opposite costs ────────────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'Desplazar o reenganchar', en: 'Shifting or rewiring' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'lb-prev'),
					shot(200, 'shot-all', 3000),
					{ at: 1200, do: 'enter', el: 'r-arr' },
					{ at: 1500, do: 'enter', el: 'cnt-3' },
					{ at: 1800, do: 'pulse', el: 'val-10' },
					{ at: 2100, do: 'pulse', el: 'val-20' },
					{ at: 2400, do: 'pulse', el: 'val-30' },
					{ at: 3200, do: 'pulse', el: 'r-arr' },
					{ at: recap.start(1) + 200, do: 'enter', el: 'r-list' },
					{ at: recap.start(1) + 700, do: 'flow', el: 'rt-skip' },
					{ at: recap.start(1) + 1200, do: 'pulse', el: 'n0' },
					{ at: recap.start(1) + 1600, do: 'pulse', el: 'n2' },
					{ at: recap.start(1) + 2600, do: 'pulse', el: 'r-list' },
				),
			},
		},
	],
};
