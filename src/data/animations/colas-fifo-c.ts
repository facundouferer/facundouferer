import type { AnimationScript, MotionCue, Subtitle } from './types';

// "First come, first served": a short film (about two minutes) for the C lesson
// "Colas". It plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/colas-fifo-c.astro`): the lesson's `cola_encolar` and
// `cola_desencolar` on the left and, on the right, three floors: the stack with the
// pointers `frente` and `final` (plates), the heap with one node per element (a slab
// with its address on the front edge and its value on top) and one module per
// instruction. A pointer is always an arrow. Magenta marks the problem (an
// uninitialized cell, the dangling `final`), violet what resolves it (`NULL`, the
// `free`, the line that restores the invariant). The film has three programs: the
// linked queue, the circular array and the round-robin loop of the lesson.

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

type Nested = MotionCue | Nested[];
const flat = (cues: Nested[]): MotionCue[] => cues.flatMap((cue) => (Array.isArray(cue) ? flat(cue) : [cue]));

type Prog = 'a' | 'b' | 'c';
const PROG_IDS = {
	a: { module: 'm-', lit: 'on-', stop: 'a-m' },
	b: { module: 'mb-', lit: 'onb-', stop: 'a-mb' },
	c: { module: 'mc-', lit: 'onc-', stop: 'a-mc' },
};

/**
 * One instruction runs: the bar slides to its editor line, the execution flow reaches
 * its module and the module lights up. `prog` picks the program: a is the linked
 * queue, b the circular array and c the round-robin loop.
 */
function exec(at: number, line: number, dur = 600, prog: Prog = 'a'): MotionCue[] {
	const ids = PROG_IDS[prog];
	return [
		{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 600) },
		{ at, do: 'move', el: 'p', to: `${ids.stop}${line}`, dur },
		{ at: at + dur, do: 'enter', el: `${ids.lit}${line}` },
		{ at: at + dur, do: 'pulse', el: `${ids.module}${line}` },
	];
}

/** A value on top of a plate or cell changes: the old text leaves, the new one arrives. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 300 },
	{ at: at + 250, do: 'enter', el: to },
];
const exit = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 350 }));
const enter = (at: number, ...els: string[]): MotionCue[] => els.map((el, index) => ({ at: at + index * 60, do: 'enter' as const, el }));

// ─── Captions ───────────────────────────────────────────────────────────────
const fifo = timed(
	say('Una cola es una fila: el primero en llegar es el primero en salir. Eso es FIFO.', 'A queue is a line: the first one in is the first one out. That is FIFO.'),
	say('Los nodos viven en el montículo. `frente` apunta al que sale y `final`, al último que llegó.', 'The nodes live on the heap. `front` points to the one that leaves, `rear` to the last to arrive.'),
);
const enqueue = timed(
	say('`cola_encolar` reserva un nodo con `malloc`. Si la cola está vacía, es frente y final.', '`queue_enqueue` allocates a node with `malloc`. If the queue is empty, it is front and rear.'),
	say('Con 20 y 30, `frente` no cambia: `final->siguiente` enlaza el nodo y `final` avanza.', 'With 20 and 30, `front` stays: `rear->next` links the node and `rear` advances.'),
);
const dequeue = timed(
	say('Desencolar toma el nodo del frente, guarda su valor y mueve `frente` al siguiente nodo…', 'Dequeue takes the node at the front, keeps its value and moves `front` to the next node…'),
	say('…y lo libera con `free`. La cola es dueña de cada nodo, así que es quien lo libera.', '…and frees it with `free`. The queue owns every node, so it is the one that frees it.'),
);
const last = timed(
	say('Sale el 30, el último. Si falta la línea 21, `final` sigue apuntando al nodo liberado.', 'The 30 leaves, the last one. If line 21 is missing, `rear` keeps pointing at the freed node.'),
	say('Es un puntero colgante: el próximo `cola_encolar` escribiría en memoria ya liberada.', 'That is a dangling pointer: the next `queue_enqueue` would write into freed memory.'),
);
const fix = timed(
	say('Con la línea 21, `final` vuelve a `NULL`: los dos punteros valen `NULL` o ninguno.', 'With line 21, `rear` goes back to `NULL`: both pointers are `NULL`, or neither is.'),
	say('Así se puede volver a encolar sin riesgo: el 99 es frente y final a la vez.', 'So enqueueing again is safe: the 99 is both front and rear at once.'),
);
const ring = timed(
	say('En un arreglo, `inicio` marca el frente y `cantidad` cuántos hay. Capacidad: 3.', 'In an array, `start` marks the front and `count` how many there are. Capacity: 3.'),
	say('Se encola en `(inicio + cantidad) % capacidad`: 1, 2 y 3 ocupan los lugares 0, 1 y 2.', 'It enqueues at `(start + count) % capacity`: 1, 2 and 3 take slots 0, 1 and 2.'),
	say('Llena: el 4 no entra y `cola_circular_encolar` devuelve `false`.', 'Full: the 4 does not fit and `circular_enqueue` returns `false`.'),
);
const wrap = timed(
	say('Desencolar devuelve el 1 y `inicio` pasa a `(0 + 1) % 3 = 1`. Ningún elemento se mueve.', 'Dequeue returns the 1 and `start` becomes `(0 + 1) % 3 = 1`. No element moves.'),
	say('El 4 va a `(1 + 2) % 3 = 0`: el índice dio la vuelta y usa el lugar libre. Salen 2, 3, 4.', 'The 4 goes to `(1 + 2) % 3 = 0`: the index wrapped around into the free slot. Out: 2, 3, 4.'),
);
const turns = timed(
	say('Un uso real: planificación por turnos. Cada proceso es un nodo de una cola de listos.', 'A real use: round-robin scheduling. Each process is a node of a ready queue.'),
	say('El del frente corre un quantum de 3. Si le falta, vuelve al final; si terminó, se libera.', 'The front one runs for a quantum of 3. If it needs more it goes to the rear; if done, it is freed.'),
	say('Cada proceso espera su turno en el orden en que llegó: eso es una cola FIFO.', 'Every process waits its turn in the order it arrived: that is a FIFO queue.'),
);

// ─── Linked queue helpers ───────────────────────────────────────────────────
// Node ids: `n<k>` (slab), `nq-<k>` (uninitialized value), `nv-<k>` (value), `nl-<k>`
// (the NULL of `siguiente`), `rel-n<k>` (released). Plates: `v-<plate>` with their
// value `pv-<plate>-<key>` and the pointer arrows `pt-<plate>-<slot>`.

const MODULES_ENQ = [2, 3, 4, 5, 6, 7, 9, 11, 12];
const MODULES_DEQ = [16, 17, 18, 19, 20, 21, 23, 24];
const MODULES_B = [2, 3, 5, 6, 7, 11, 12, 13, 14, 15];
const MODULES_C = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 19];

/**
 * `cola_encolar(value)` on node slot `k`. `first` is the empty-queue branch (line 7):
 * the node is also the front. Returns the cues; the run lasts 8 lines.
 */
function enq(at: number, k: number, pace: number, first: boolean, from: string): MotionCue[] {
	const P = pace + 70;
	const line = (index: number) => at + index * P;
	const done = (index: number) => line(index) + pace;
	const prev = k - 1;
	return flat([
		exec(line(0), 2, pace),
		enter(done(0), `n${k}`, `nq-${k}`, 'v-nodo'),
		{ at: done(0) + 250, do: 'type', el: `pv-nodo-n${k}`, dur: 250 },
		{ at: done(0) + 500, do: 'draw', el: `pt-nodo-${k}`, dur: 500 },
		exec(line(1), 3, pace),
		exec(line(2), 4, pace),
		swap(done(2), `nq-${k}`, `nv-${k}`),
		exec(line(3), 5, pace),
		enter(done(3), `nl-${k}`),
		exec(line(4), 6, pace),
		first
			? [
					exec(line(5), 7, pace),
					swap(done(5), `pv-frente-null`, `pv-frente-n${k}`),
					{ at: done(5) + 250, do: 'draw' as const, el: `pt-frente-${k}`, dur: 500 },
				]
			: [
					exec(line(5), 9, pace),
					exit(done(5), `nl-${prev}`),
					{ at: done(5) + 100, do: 'draw' as const, el: `lk-${prev}-${k}`, dur: 500 },
				],
		exec(line(6), 11, pace),
		swap(done(6), `pv-final-${from}`, `pv-final-n${k}`),
		first ? [] : exit(done(6), `pt-final-${prev}`),
		{ at: done(6) + 250, do: 'draw', el: `pt-final-${k}`, dur: 500 },
		exec(line(7), 12, pace),
		exit(done(7), 'v-nodo', `pv-nodo-n${k}`, `pt-nodo-${k}`),
	]);
}

/**
 * `cola_desencolar` of the front node `k` when another node `next` follows: the old
 * node is freed and its value is printed by `main` (`out`).
 */
function deq(at: number, k: number, next: number, pace: number, out: string): MotionCue[] {
	const P = pace + 70;
	const line = (index: number) => at + index * P;
	const done = (index: number) => line(index) + pace;
	return flat([
		exec(line(0), 16, pace),
		exec(line(1), 17, pace),
		enter(done(1), 'v-viejo'),
		{ at: done(1) + 200, do: 'type', el: `pv-viejo-n${k}`, dur: 250 },
		{ at: done(1) + 450, do: 'draw', el: `pt-viejo-${k}`, dur: 500 },
		exec(line(2), 18, pace),
		{ at: done(2), do: 'pulse', el: `nv-${k}` },
		exec(line(3), 19, pace),
		swap(done(3), `pv-frente-n${k}`, `pv-frente-n${next}`),
		exit(done(3), `pt-frente-${k}`),
		{ at: done(3) + 250, do: 'draw', el: `pt-frente-${next}`, dur: 500 },
		exec(line(4), 20, pace),
		exec(line(5), 23, pace),
		enter(done(5), `rel-n${k}`),
		exit(done(5), `nv-${k}`, `lk-${k}-${next}`),
		exec(line(6), 24, pace),
		exit(done(6), 'v-viejo', `pv-viejo-n${k}`, `pt-viejo-${k}`),
		{ at: done(6) + 100, do: 'type', el: out, dur: 400 },
	]);
}

// ─── Circular queue helpers ─────────────────────────────────────────────────
/** `cola_circular_encolar(value)` at cell `cell`; `count` is the `cantidad` before. */
function ringEnq(at: number, cell: number, value: number, count: number, chip: string, pace: number): MotionCue[] {
	const P = pace + 70;
	const line = (index: number) => at + index * P;
	const done = (index: number) => line(index) + pace;
	return flat([
		exec(line(0), 2, pace, 'b'),
		exec(line(1), 3, pace, 'b'),
		enter(done(1), chip),
		exec(line(2), 5, pace, 'b'),
		{ at: done(2), do: 'type', el: `cv-${cell}-${value}`, dur: 250 },
		{ at: done(2), do: 'pulse', el: `cc-${cell}` },
		exec(line(3), 6, pace, 'b'),
		swap(done(3), `pv-cant-${count}`, `pv-cant-${count + 1}`),
		exec(line(4), 7, pace, 'b'),
		exit(done(4) + 500, chip),
	]);
}

// ─── Round robin simulation ─────────────────────────────────────────────────
// The queue of the lesson: P1 needs 5 units, P2 needs 2, P3 needs 7; quantum 3.
const QUANTUM = 3;
const RR_ROWS = ['oc0', 'oc1', 'oc2', 'oc3', 'oc4', 'oc5'];

function roundRobin(at: number, pace: number): { cues: MotionCue[]; end: number } {
	const P = pace + 70;
	const remaining = [5, 2, 7];
	const order = [0, 1, 2];
	const cues: MotionCue[] = [];
	let cursor = at;
	let row = 0;
	let rear = 2;
	const frontArrow = (from: number | null, to: number | null, when: number) => {
		cues.push(...swap(when, `pv-frente-${from === null ? 'null' : `r${from}`}`, `pv-frente-${to === null ? 'null' : `r${to}`}`));
		if (from !== null) cues.push(...exit(when, `pt-frente-${from}`));
		if (to !== null) cues.push({ at: when + 250, do: 'draw', el: `pt-frente-${to}`, dur: 500 });
	};
	let frontNode: number | null = 0;
	while (order.length > 0) {
		const k = order.shift() as number;
		const newFront = order[0] ?? null;
		const used = Math.min(remaining[k], QUANTUM);
		const before = remaining[k];
		remaining[k] -= used;
		const line = (index: number) => cursor + index * P;
		const done = (index: number) => line(index) + pace;
		// Line 7: `desencolar_nodo` hands the front node over to `proceso`.
		cues.push(...exec(line(0), 7, pace, 'c'));
		cues.push(...enter(done(0), 'v-proc'));
		cues.push({ at: done(0) + 150, do: 'type', el: `pv-proc-r${k}`, dur: 250 });
		cues.push({ at: done(0) + 350, do: 'draw', el: `pt-proc-${k}`, dur: 450 });
		frontArrow(frontNode, newFront, done(0));
		frontNode = newFront;
		if (newFront !== null) cues.push(...exit(done(0), `rk-${k}-${newFront}`));
		if (newFront === null) {
			cues.push(...swap(done(0), `pv-final-r${rear}`, 'pv-final-null'));
			cues.push(...exit(done(0), `pt-final-${rear}`));
		}
		// Lines 8, 10 and 11: the slice, the clock and the time left.
		cues.push(...exec(line(1), 8, pace, 'c'));
		cues.push(...exec(line(2), 10, pace, 'c'));
		cues.push(...exec(line(3), 11, pace, 'c'));
		if (remaining[k] > 0) cues.push(...swap(done(3), `rv-${k}-${before}`, `rv-${k}-${remaining[k]}`));
		cues.push(...exec(line(4), 12, pace, 'c'));
		if (remaining[k] > 0) {
			// Lines 13 and 15: print and requeue at the rear.
			cues.push(...exec(line(5), 13, pace, 'c'));
			cues.push({ at: done(5), do: 'type', el: RR_ROWS[row], dur: 350 });
			cues.push(...exec(line(6), 15, pace, 'c'));
			if (order.length > 0) {
				cues.push({ at: done(6), do: 'draw', el: `rk-${rear}-${k}`, dur: 450 });
				cues.push(...swap(done(6), `pv-final-r${rear}`, `pv-final-r${k}`));
				cues.push(...exit(done(6), `pt-final-${rear}`));
			} else {
				cues.push(...swap(done(6), 'pv-final-null', `pv-final-r${k}`));
				frontArrow(null, k, done(6));
				frontNode = k;
			}
			cues.push({ at: done(6) + 250, do: 'draw', el: `pt-final-${k}`, dur: 450 });
			cues.push(...exit(done(6) + 100, 'v-proc', `pv-proc-r${k}`, `pt-proc-${k}`));
			order.push(k);
			rear = k;
			if (frontNode === null) frontNode = k;
			cursor = line(7);
		} else {
			// Lines 17 and 19: print and free; the loop owned the node.
			cues.push(...exec(line(5), 17, pace, 'c'));
			cues.push({ at: done(5), do: 'type', el: RR_ROWS[row], dur: 350 });
			cues.push(...exec(line(6), 19, pace, 'c'));
			cues.push(...enter(done(6), `rel-r${k}`));
			cues.push(...exit(done(6), `rv-${k}-${before}`, 'v-proc', `pv-proc-r${k}`, `pt-proc-${k}`));
			cursor = line(7);
		}
		row += 1;
	}
	return { cues, end: cursor };
}

// What is on the canvas after the linked demo and the circular demo: they leave the
// stage before the next program arrives.
const LINKED_CLEAR = [
	'ed-a', 'file-a', 'oa0', 'oa1', 'oa2', 'oa3', 'oa4', 'oa5',
	'n0', 'n1', 'n2', 'n3', 'nv-2', 'nv-3', 'nl-3', 'rel-n0', 'rel-n1', 'rel-n2',
	'v-frente', 'v-final', 'pv-frente-n3', 'pv-final-n3', 'pt-frente-3', 'pt-final-3',
	...MODULES_ENQ.flatMap((line) => [`m-${line}`, `on-${line}`]),
	...MODULES_DEQ.flatMap((line) => [`m-${line}`, `on-${line}`]),
];
const RING_CLEAR = [
	'ed-b', 'file-b', 'ob0', 'ob1', 'ob2', 'cc-0', 'cc-1', 'cc-2', 'cv-0-4', 'cv-1-2', 'cv-2-3', 'ix-0', 'ix-1', 'ix-2',
	'v-inicio', 'v-cant', 'pv-inicio-1', 'pv-cant-3', 'pt-inicio-1',
	...MODULES_B.flatMap((line) => [`mb-${line}`, `onb-${line}`]),
];

export const script: AnimationScript = {
	chapters: [
		{ id: 'fifo', label: { es: 'Primero en llegar, primero en salir', en: 'First in, first out' } },
		{ id: 'enqueue', label: { es: 'Encolar por el final', en: 'Enqueue at the rear' } },
		{ id: 'dequeue', label: { es: 'Desencolar por el frente', en: 'Dequeue at the front' } },
		{ id: 'empty', label: { es: 'La cola queda vacía', en: 'The queue becomes empty' } },
		{ id: 'circular', label: { es: 'La cola circular', en: 'The circular queue' } },
		{ id: 'turns', label: { es: 'Un uso real: turnos', en: 'A real use: turns' } },
	],
	steps: [
		// ─── Scene 1. A line, two pointers ──────────────────────────────────────
		{
			id: 'line',
			chapter: 'fifo',
			scene: 'journey',
			title: { es: 'Una fila de nodos', en: 'A line of nodes' },
			subtitles: fifo.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 1800),
					{ at: 200, do: 'enter', el: 'floor-stack' },
					{ at: 800, do: 'enter', el: 'floor-heap' },
					{ at: 1400, do: 'pulse', el: 'floor-heap' },
					{ at: 1700, do: 'enter', el: 'floor-prog' },
					MODULES_ENQ.map((line, index) => ({ at: 1900 + index * 80, do: 'enter' as const, el: `m-${line}` })),
					MODULES_DEQ.map((line, index) => ({ at: 2700 + index * 80, do: 'enter' as const, el: `m-${line}` })),
					{ at: 3500, do: 'enter', el: 'lb-sale' },
					{ at: 3800, do: 'enter', el: 'lb-entra' },
					{ at: 4200, do: 'pulse', el: 'lb-sale' },
					{ at: 4500, do: 'pulse', el: 'lb-entra' },
					shot(fifo.start(1), 'shot-queue', 1800),
					{ at: fifo.start(1) + 400, do: 'enter', el: 'v-frente' },
					{ at: fifo.start(1) + 500, do: 'enter', el: 'v-final' },
					{ at: fifo.start(1) + 900, do: 'type', el: 'pv-frente-null', dur: 300 },
					{ at: fifo.start(1) + 1000, do: 'type', el: 'pv-final-null', dur: 300 },
					{ at: fifo.start(1) + 1700, do: 'pulse', el: 'v-frente' },
					{ at: fifo.start(1) + 2300, do: 'pulse', el: 'v-final' },
					{ at: fifo.start(1) + 3000, do: 'enter', el: 'hl' },
					{ at: fifo.start(1) + 3100, do: 'enter', el: 'oa0' },
					{ at: fifo.start(1) + 3300, do: 'enter', el: 'p' },
				),
			},
		},

		// ─── Scene 2. Enqueue ───────────────────────────────────────────────────
		{
			id: 'enqueue',
			chapter: 'enqueue',
			scene: 'journey',
			title: { es: 'Encolar: 10, 20 y 30', en: 'Enqueue: 10, 20 and 30' },
			subtitles: enqueue.list,
			motion: {
				cues: seq(
					shot(0, 'shot-queue', 1200),
					{ at: 100, do: 'exit', el: 'lb-sale', dur: 400 },
					{ at: 100, do: 'exit', el: 'lb-entra', dur: 400 },
					enq(300, 0, 360, true, 'null'),
					{ at: 2600, do: 'enter', el: 'lb-first' },
					{ at: enqueue.start(1) - 200, do: 'exit', el: 'lb-first', dur: 400 },
					enq(enqueue.start(1), 1, 320, false, 'n0'),
					enq(enqueue.start(1) + 3200, 2, 280, false, 'n1'),
					{ at: enqueue.start(1) + 6200, do: 'enter', el: 'lb-o1' },
					{ at: enqueue.start(1) + 6700, do: 'pulse', el: 'pt-final-2' },
					{ at: enqueue.start(1) + 7000, do: 'type', el: 'oa1', dur: 700 },
				),
			},
		},

		// ─── Scene 3. Dequeue ───────────────────────────────────────────────────
		{
			id: 'dequeue',
			chapter: 'dequeue',
			scene: 'journey',
			title: { es: 'Desencolar: sale el primero', en: 'Dequeue: the first one leaves' },
			subtitles: dequeue.list,
			motion: {
				cues: seq(
					shot(0, 'shot-queue', 1200),
					{ at: 100, do: 'exit', el: 'lb-o1', dur: 400 },
					deq(400, 0, 1, 420, 'oa2'),
					deq(dequeue.start(1) + 600, 1, 2, 380, 'oa3'),
					{ at: dequeue.start(1) + 4300, do: 'pulse', el: 'pt-frente-2' },
					{ at: dequeue.start(1) + 4300, do: 'pulse', el: 'pt-final-2' },
				),
			},
		},

		// ─── Scene 4. The last node leaves and `final` is forgotten ──────────────
		{
			id: 'last',
			chapter: 'empty',
			scene: 'journey',
			title: { es: 'El último nodo y el final colgante', en: 'The last node and the dangling rear' },
			subtitles: last.list,
			motion: {
				cues: seq(
					shot(0, 'shot-queue', 1200),
					exec(300, 16, 380),
					exec(750, 17, 380),
					enter(1130, 'v-viejo'),
					{ at: 1330, do: 'type', el: 'pv-viejo-n2', dur: 250 },
					{ at: 1550, do: 'draw', el: 'pt-viejo-2', dur: 500 },
					exec(1200, 18, 380),
					exec(1650, 19, 380),
					swap(2030, 'pv-frente-n2', 'pv-frente-null'),
					exit(2030, 'pt-frente-2'),
					exec(2100, 20, 380),
					{ at: 2600, do: 'enter', el: 'lb-skip' },
					// The line that restores `final` (21) is not there: the bar jumps over it.
					exec(3000, 23, 500),
					enter(3500, 'rel-n2'),
					exit(3500, 'nv-2', 'nl-2'),
					{ at: 3800, do: 'enter', el: 'dg-final-2' },
					exit(3800, 'pt-final-2'),
					{ at: 4200, do: 'enter', el: 'lb-dg' },
					{ at: 4400, do: 'pulse', el: 'v-final' },
					{ at: last.start(1) + 400, do: 'enter', el: 'lb-uaf' },
					{ at: last.start(1) + 1200, do: 'pulse', el: 'dg-final-2' },
					{ at: last.start(1) + 2400, do: 'pulse', el: 'rel-n2' },
					{ at: last.start(1) + 3000, do: 'pulse', el: 'dg-final-2' },
				),
			},
		},

		// ─── Scene 5. The fix, and the queue works again ─────────────────────────
		{
			id: 'fix',
			chapter: 'empty',
			scene: 'journey',
			title: { es: 'final vuelve a NULL', en: 'rear goes back to NULL' },
			subtitles: fix.list,
			motion: {
				cues: seq(
					shot(0, 'shot-queue', 1200),
					{ at: 100, do: 'exit', el: 'lb-skip', dur: 300 },
					exec(300, 21, 500),
					exit(800, 'dg-final-2', 'lb-dg', 'lb-uaf'),
					swap(900, 'pv-final-n2', 'pv-final-null'),
					{ at: 1400, do: 'enter', el: 'lb-fix' },
					{ at: 1600, do: 'pulse', el: 'v-final' },
					{ at: 1600, do: 'pulse', el: 'v-frente' },
					exec(2000, 23, 400),
					exec(2500, 24, 400),
					exit(2900, 'v-viejo', 'pv-viejo-n2', 'pt-viejo-2'),
					{ at: 3000, do: 'type', el: 'oa4', dur: 400 },
					exit(fix.start(1), 'lb-fix'),
					enq(fix.start(1) + 300, 3, 380, true, 'null'),
					{ at: fix.start(1) + 3900, do: 'type', el: 'oa5', dur: 800 },
				),
			},
		},

		// ─── Scene 6. The circular array: it fills up ────────────────────────────
		{
			id: 'ring',
			chapter: 'circular',
			scene: 'journey',
			title: { es: 'La cola sobre un arreglo circular', en: 'A queue on a circular array' },
			subtitles: ring.list,
			motion: {
				cues: seq(
					// The linked queue is done: its nodes, pointers and modules leave the stage.
					LINKED_CLEAR.map((el) => ({ at: 0, do: 'exit' as const, el, dur: 400 })),
					['p', 'hl'].map((el) => ({ at: 0, do: 'exit' as const, el, dur: 400 })),
					shot(300, 'shot-ring', 1500),
					{ at: 700, do: 'enter', el: 'ed-b' },
					{ at: 700, do: 'enter', el: 'file-b' },
					[0, 1, 2].map((cell) => ({ at: 900 + cell * 150, do: 'enter' as const, el: `cc-${cell}` })),
					[0, 1, 2].map((cell) => ({ at: 1000 + cell * 150, do: 'enter' as const, el: `ix-${cell}` })),
					MODULES_B.map((line, index) => ({ at: 1100 + index * 80, do: 'enter' as const, el: `mb-${line}` })),
					{ at: 1900, do: 'enter', el: 'v-inicio' },
					{ at: 2000, do: 'enter', el: 'v-cant' },
					{ at: 2200, do: 'type', el: 'pv-inicio-0', dur: 200 },
					{ at: 2300, do: 'type', el: 'pv-cant-0', dur: 200 },
					{ at: 2600, do: 'draw', el: 'pt-inicio-0', dur: 500 },
					{ at: 2800, do: 'enter', el: 'hl' },
					{ at: 2800, do: 'move', el: 'p', to: 'a-mb2', dur: 1 },
					{ at: 2900, do: 'enter', el: 'p' },
					{ at: 3000, do: 'enter', el: 'ob0' },
					ringEnq(ring.start(1) + 200, 0, 1, 0, 'cf-a', 330),
					ringEnq(ring.start(1) + 2300, 1, 2, 1, 'cf-b', 330),
					ringEnq(ring.start(1) + 4400, 2, 3, 2, 'cf-c', 330),
					// The fourth does not fit: line 2 answers before any index is computed.
					exec(ring.start(2) + 300, 2, 400, 'b'),
					{ at: ring.start(2) + 700, do: 'enter', el: 'lb-llena' },
					{ at: ring.start(2) + 800, do: 'pulse', el: 'pv-cant-3' },
					exec(ring.start(2) + 1400, 7, 400, 'b'),
					{ at: ring.start(2) + 2100, do: 'type', el: 'ob1', dur: 700 },
				),
			},
		},

		// ─── Scene 7. The index wraps around ─────────────────────────────────────
		{
			id: 'wrap',
			chapter: 'circular',
			scene: 'journey',
			title: { es: 'El índice da la vuelta', en: 'The index wraps around' },
			subtitles: wrap.list,
			motion: {
				cues: seq(
					shot(0, 'shot-ring', 1000),
					{ at: 100, do: 'exit', el: 'lb-llena', dur: 300 },
					exec(300, 11, 350, 'b'),
					exec(750, 12, 350, 'b'),
					{ at: 1100, do: 'exit', el: 'cv-0-1', dur: 350 },
					exec(1200, 13, 350, 'b'),
					swap(1550, 'pv-inicio-0', 'pv-inicio-1'),
					exit(1550, 'pt-inicio-0'),
					{ at: 1800, do: 'draw', el: 'pt-inicio-1', dur: 500 },
					{ at: 1900, do: 'enter', el: 'cf-i' },
					exec(1650, 14, 350, 'b'),
					swap(2000, 'pv-cant-3', 'pv-cant-2'),
					exec(2100, 15, 350, 'b'),
					exit(wrap.start(1) - 200, 'cf-i'),
					exec(wrap.start(1) + 200, 2, 350, 'b'),
					exec(wrap.start(1) + 650, 3, 350, 'b'),
					{ at: wrap.start(1) + 1000, do: 'enter', el: 'cf-d' },
					{ at: wrap.start(1) + 1100, do: 'pulse', el: 'cc-0' },
					exec(wrap.start(1) + 1100, 5, 350, 'b'),
					{ at: wrap.start(1) + 1450, do: 'type', el: 'cv-0-4', dur: 250 },
					exec(wrap.start(1) + 1550, 6, 350, 'b'),
					swap(wrap.start(1) + 1900, 'pv-cant-2', 'pv-cant-3'),
					exec(wrap.start(1) + 2000, 7, 350, 'b'),
					{ at: wrap.start(1) + 2700, do: 'type', el: 'ob2', dur: 500 },
					{ at: wrap.start(1) + 3300, do: 'exit', el: 'cf-d', dur: 300 },
				),
			},
		},

		// ─── Scene 8. A real use: round robin; the whole system ──────────────────
		{
			id: 'turns',
			chapter: 'turns',
			scene: 'journey',
			title: { es: 'Planificación por turnos', en: 'Round-robin scheduling' },
			subtitles: turns.list,
			motion: {
				cues: (() => {
					const run = roundRobin(4900, 200);
					return seq(
						RING_CLEAR.map((el) => ({ at: 0, do: 'exit' as const, el, dur: 400 })),
						['p', 'hl'].map((el) => ({ at: 0, do: 'exit' as const, el, dur: 400 })),
						shot(300, 'shot-queue', 1600),
						{ at: 600, do: 'enter', el: 'ed-c' },
						{ at: 600, do: 'enter', el: 'file-c' },
						MODULES_C.map((line, index) => ({ at: 800 + index * 60, do: 'enter' as const, el: `mc-${line}` })),
						[0, 1, 2].map((k) => ({ at: 1100 + k * 150, do: 'enter' as const, el: `r${k}` })),
						[0, 1, 2].map((k) => ({ at: 1300 + k * 150, do: 'enter' as const, el: `rv-${k}-${[5, 2, 7][k]}` })),
						{ at: 1900, do: 'draw', el: 'rk-0-1', dur: 400 },
						{ at: 2200, do: 'draw', el: 'rk-1-2', dur: 400 },
						{ at: 2200, do: 'enter', el: 'v-frente' },
						{ at: 2300, do: 'enter', el: 'v-final' },
						{ at: 2500, do: 'type', el: 'pv-frente-r0', dur: 250 },
						{ at: 2600, do: 'type', el: 'pv-final-r2', dur: 250 },
						{ at: 2800, do: 'draw', el: 'pt-frente-0', dur: 400 },
						{ at: 3000, do: 'draw', el: 'pt-final-2', dur: 400 },
						{ at: 3200, do: 'enter', el: 'lb-rr' },
						{ at: 3300, do: 'enter', el: 'hl' },
						{ at: 3300, do: 'move', el: 'p', to: 'a-mc2', dur: 1 },
						{ at: 3400, do: 'enter', el: 'p' },
						exec(3500, 2, 260, 'c'),
						exec(3800, 3, 260, 'c'),
						exec(4100, 5, 260, 'c'),
						exec(4400, 6, 260, 'c'),
						{ at: 4300, do: 'exit', el: 'lb-rr', dur: 300 },
						run.cues,
						{ at: run.end + 300, do: 'exit', el: 'hl', dur: 400 },
						shot(run.end + 300, 'shot-all', 2600),
						{ at: run.end + 900, do: 'pulse', el: 'rel-r0' },
						{ at: run.end + 1300, do: 'pulse', el: 'rel-r1' },
						{ at: run.end + 1700, do: 'pulse', el: 'rel-r2' },
					);
				})(),
			},
		},
	],
};
