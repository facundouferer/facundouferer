import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey through a stack and a queue: LIFO versus FIFO": a two-minute film for
// Java lesson 17 ("TAD Pila y TAD Cola: Estructuras Lineales"). It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/tad-pilas-colas-java.astro`): the same three data,
// "A", "B" and "C", go through a linked `Pila` (one reference, `tope`) and then a
// linked `Cola` (two references, `frente` and `fondo`). The editor on the left
// shows each class with the calls that drive it; the isometric system on the
// right shows the nodes, the references that point at them and the module of
// every method that runs.

const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

// Captions are pinned (`at`) so the cues can be timed against them.
const readingMs = (sub: Subtitle) => 1200 + Math.max(sub.text.es.length, sub.text.en.length) * 55;
function timed(...subs: Subtitle[]) {
	let at = 0;
	const starts: number[] = [];
	const list = subs.map((sub) => {
		starts.push(at);
		const placed: Subtitle = { ...sub, at };
		at += readingMs(sub) + 150;
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
const bar = (at: number, line: number): MotionCue => ({ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 450 });
const go = (at: number, el: string, to: string, dur = 700): MotionCue => ({ at, do: 'move', el, to, dur });
const place = (at: number, el: string, to: string): MotionCue => ({ at, do: 'move', el, to, dur: 1 });

const typeLines = (at: number, page: 'ea' | 'eb', from: number, to: number, gap: number): MotionCue[] =>
	Array.from({ length: to - from + 1 }, (_, index) => ({
		at: at + index * gap,
		do: 'type' as const,
		el: `${page}-${from + index}`,
		dur: Math.max(200, gap),
	}));

const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/** `push(x)` on the stack: create the node, link it to the old top, move `tope` up. */
function push(at: number, node: string, slot: number, link?: string): MotionCue[] {
	return [
		bar(at, 4),
		{ at: at + 100, do: 'enter', el: node },
		go(at + 300, node, `a-s${slot}`),
		bar(at + 1100, 5),
		...(link ? [{ at: at + 1200, do: 'draw' as const, el: link, dur: 600 }] : []),
		bar(at + 1900, 6),
		go(at + 2000, 'ptr-top', `a-top-${slot}`, 600),
	];
}

/** `pop()` on the stack: read the top node, move `tope` down, the node leaves. */
function pop(at: number, node: string, below: string, link?: string): MotionCue[] {
	return [
		bar(at, 11),
		{ at: at + 100, do: 'pulse', el: node },
		bar(at + 700, 12),
		go(at + 800, 'ptr-top', `a-top-${below}`, 600),
		...(link ? clear(at + 800, link) : []),
		go(at + 1000, node, 'a-s-dock'),
		{ at: at + 1800, do: 'exit', el: node, dur: 400 },
	];
}

/** `enqueue(x)` on the queue: the node joins at the back and `fondo` moves to it. */
function enqueue(at: number, node: string, slot: number, link: string): MotionCue[] {
	return [
		bar(at, 4),
		{ at: at + 100, do: 'enter', el: node },
		go(at + 300, node, `a-q${slot}`, 900),
		bar(at + 1200, 6),
		{ at: at + 1300, do: 'draw', el: link, dur: 600 },
		bar(at + 1900, 7),
		go(at + 2000, 'ptr-back', `a-back-${slot}`, 600),
	];
}

/** `dequeue()` on the queue: read the front node, move `frente` on, the node leaves. */
function dequeue(at: number, node: string, next: number, link: string): MotionCue[] {
	return [
		bar(at, 12),
		{ at: at + 100, do: 'pulse', el: node },
		bar(at + 600, 13),
		go(at + 700, 'ptr-front', `a-front-${next}`, 600),
		...clear(at + 700, link),
		go(at + 900, node, 'a-q-out', 800),
		{ at: at + 1800, do: 'exit', el: node, dur: 400 },
	];
}

// ─── Captions ───────────────────────────────────────────────────────────────
// Each scene answers one question a student must be able to answer afterwards.

// 1. Where does a stack operate?
const stackSub = timed(
	say(
		'Una pila es una lista con un solo extremo abierto: el `tope`.',
		'A stack is a list with only one open end: the `top`.',
	),
	say(
		'`push` apila en el `tope` y `pop` saca del `tope`. Al empezar, `tope` es `null`.',
		'`push` adds at the `top` and `pop` takes from the `top`. At first, `top` is `null`.',
	),
);

// 2. How does push link a new node?
const pushSub = timed(
	say('`push("A")` crea un nodo y lo deja en el `tope`.', '`push("A")` creates a node and leaves it at the `top`.'),
	say(
		'Cada nodo nuevo apunta al `tope` anterior y pasa a ser el nuevo `tope`.',
		'Each new node points to the old `top` and becomes the new `top`.',
	),
	say('No hay bucles: apilar cuesta O(1), haya los nodos que haya.', 'No loops: pushing costs O(1), however many nodes there are.'),
);

// 3. In what order do elements leave a stack?
const popSub = timed(
	say(
		'`pop()` devuelve el dato del `tope` y baja el `tope` al siguiente. Sale `"C"`.',
		'`pop()` returns the data at the `top` and moves the `top` down. Out goes `"C"`.',
	),
	say('Después sale `"B"`: el último en entrar es el primero en salir. Eso es LIFO.', 'Then `"B"` leaves: last in, first out. That is LIFO.'),
);

// 4. What happens when you pop an empty stack?
const emptySub = timed(
	say('Sale `"A"` y el `tope` vuelve a `null`: la pila vacía.', 'Out goes `"A"` and the `top` is `null` again: the stack is empty.'),
	say(
		'Otro `pop()` se detiene en la guardia y lanza `NoSuchElementException`.',
		'Another `pop()` stops at the guard and throws `NoSuchElementException`.',
	),
);

// 5. Why does a queue need two references?
const queueSub = timed(
	say(
		'Una cola abre los dos extremos: se entra por el `fondo` y se sale por el `frente`.',
		'A queue opens both ends: you enter at the `back` and leave from the `front`.',
	),
	say(
		'Con un solo nodo, `frente` y `fondo` apuntan al mismo. `enqueue` cuesta O(1).',
		'With a single node, `front` and `back` point to the same one. `enqueue` costs O(1).',
	),
	say('Cada llegada se engancha al `fondo`, y el `fondo` avanza hasta ella.', 'Each arrival hooks onto the `back`, and the `back` moves to it.'),
);

// 6. In what order does a queue serve its nodes?
const fifoSub = timed(
	say(
		'`dequeue()` saca por el `frente`: primero `"A"`, después `"B"`. Es el orden de llegada.',
		'`dequeue()` takes from the `front`: first `"A"`, then `"B"`. It is arrival order.',
	),
	say('Los nodos no se corren: solo avanza el `frente`. FIFO, también en O(1).', 'The nodes do not shift: only the `front` moves on. FIFO, also in O(1).'),
);

// 7. Why must `fondo` be cleared when the last node leaves?
const lastSub = timed(
	say('Sale `"C"` y el `frente` queda en `null`.', 'Out goes `"C"` and the `front` becomes `null`.'),
	say(
		'Pero el `fondo` sigue apuntando a un nodo que ya no pertenece a la cola.',
		'But the `back` still points to a node that no longer belongs to the queue.',
	),
	say(
		'Por eso, si el `frente` queda en `null`, también `fondo = null`.',
		'That is why, if the `front` becomes `null`, also `back = null`.',
	),
);

// Recap: when to choose each one.
const recapSub = timed(
	say('La pila invierte el orden: sirve para deshacer o para la pila de llamadas.', 'The stack reverses the order: it fits undo or the call stack.'),
	say('La cola respeta el orden de llegada: la cola de impresión, los turnos.', 'The queue keeps arrival order: the print queue, turns.'),
	say('Solo tocan sus extremos, así que todas sus operaciones cuestan O(1).', 'They only touch their ends, so all their operations cost O(1).'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'stack', label: { es: 'La pila y su tope', en: 'The stack and its top' } },
		{ id: 'lifo', label: { es: 'Apilar y desapilar: LIFO', en: 'Push and pop: LIFO' } },
		{ id: 'empty', label: { es: 'La pila vacía', en: 'The empty stack' } },
		{ id: 'queue', label: { es: 'La cola: frente y fondo', en: 'The queue: front and back' } },
		{ id: 'fifo', label: { es: 'Desencolar: FIFO', en: 'Dequeue: FIFO' } },
		{ id: 'recap', label: { es: 'LIFO frente a FIFO', en: 'LIFO versus FIFO' } },
	],
	steps: [
		// ─── 1. The stack: one open end, the top ────────────────────────────
		{
			id: 'stack',
			chapter: 'stack',
			scene: 'journey',
			title: { es: 'La pila: todo pasa por el tope', en: 'The stack: everything happens at the top' },
			subtitles: stackSub.list,
			motion: {
				cues: seq(
					shot(0, 'shot-stack', 2200),
					{ at: 150, do: 'enter', el: 'floor-stack' },
					...typeLines(300, 'ea', 1, 16, 160),
					{ at: 700, do: 'enter', el: 'shaft' },
					{ at: 1200, do: 'draw', el: 'rt-stack', dur: 800 },
					{ at: 1800, do: 'enter', el: 'm-push' },
					{ at: 2000, do: 'enter', el: 'm-pop' },
					{ at: stackSub.start(1), do: 'enter', el: 'hl' },
					{ at: stackSub.start(1) + 300, do: 'enter', el: 'ptr-top' },
					{ at: stackSub.start(1) + 600, do: 'enter', el: 'top-null' },
					{ at: stackSub.start(1) + 1600, do: 'pulse', el: 'ptr-top' },
					{ at: stackSub.start(1) + 2600, do: 'pulse', el: 'top-null' },
				),
			},
		},

		// ─── 2. push: each new node goes on top ─────────────────────────────
		{
			id: 'push',
			chapter: 'lifo',
			scene: 'journey',
			title: { es: 'push: el nodo nuevo queda arriba', en: 'push: the new node goes on top' },
			subtitles: pushSub.list,
			motion: {
				cues: seq(
					{ at: 100, do: 'type', el: 'ea-17', dur: 900 },
					bar(100, 17),
					{ at: 300, do: 'enter', el: 'p' },
					{ at: 500, do: 'enter', el: 'push-on' },
					...push(800, 'sa', 0),
					...clear(2700, 'top-null'),
					...push(pushSub.start(1), 'sb', 1, 'lk-ba'),
					...push(pushSub.start(1) + 2700, 'sc', 2, 'lk-cb'),
					{ at: pushSub.start(2) + 300, do: 'enter', el: 'o1-push' },
					{ at: pushSub.start(2) + 1300, do: 'pulse', el: 'o1-push' },
				),
			},
		},

		// ─── 3. pop: last in, first out ─────────────────────────────────────
		{
			id: 'pop',
			chapter: 'lifo',
			scene: 'journey',
			title: { es: 'pop: el último en entrar sale primero', en: 'pop: last in, first out' },
			subtitles: popSub.list,
			motion: {
				cues: seq(
					...clear(100, 'push-on', 'o1-push'),
					{ at: 100, do: 'type', el: 'ea-18', dur: 900 },
					bar(100, 18),
					go(200, 'p', 'a-pop', 800),
					{ at: 1000, do: 'enter', el: 'pop-on' },
					...pop(1300, 'sc', '1', 'lk-cb'),
					...pop(popSub.start(1), 'sb', '0', 'lk-ba'),
					bar(popSub.start(1) + 2300, 18),
					{ at: popSub.start(1) + 2400, do: 'type', el: 'out-1', dur: 400 },
					{ at: popSub.start(1) + 2800, do: 'enter', el: 'lifo-chip' },
					{ at: popSub.start(1) + 3500, do: 'pulse', el: 'lifo-chip' },
				),
			},
		},

		// ─── 4. The empty stack and its guard ───────────────────────────────
		{
			id: 'underflow',
			chapter: 'empty',
			scene: 'journey',
			title: { es: 'pop sobre una pila vacía', en: 'pop on an empty stack' },
			subtitles: emptySub.list,
			motion: {
				cues: seq(
					shot(0, 'shot-empty', 1800),
					{ at: 100, do: 'type', el: 'ea-19', dur: 700 },
					bar(100, 19),
					...pop(500, 'sa', 'null'),
					{ at: 1600, do: 'enter', el: 'top-null' },
					bar(2500, 19),
					{ at: 2600, do: 'type', el: 'out-2', dur: 400 },
					{ at: emptySub.start(1), do: 'type', el: 'ea-20', dur: 700 },
					bar(emptySub.start(1), 20),
					bar(emptySub.start(1) + 700, 9),
					{ at: emptySub.start(1) + 800, do: 'pulse', el: 'top-null' },
					bar(emptySub.start(1) + 1400, 10),
					{ at: emptySub.start(1) + 1500, do: 'enter', el: 'hx-10' },
					{ at: emptySub.start(1) + 1500, do: 'exit', el: 'pop-on', dur: 300 },
					{ at: emptySub.start(1) + 1600, do: 'enter', el: 'pop-x' },
					{ at: emptySub.start(1) + 1800, do: 'enter', el: 'uf-chip' },
					{ at: emptySub.start(1) + 2200, do: 'type', el: 'out-3a', dur: 650 },
					{ at: emptySub.start(1) + 2800, do: 'type', el: 'out-3b', dur: 900 },
					{ at: emptySub.start(1) + 3400, do: 'pulse', el: 'uf-chip' },
				),
			},
		},

		// ─── 5. The queue: two references, enter at the back ────────────────
		{
			id: 'enqueue',
			chapter: 'queue',
			scene: 'journey',
			title: { es: 'La cola: se entra por el fondo', en: 'The queue: you enter at the back' },
			subtitles: queueSub.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'pop-x', 'uf-chip', 'hx-10', 'lifo-chip', 'out-1', 'out-2', 'out-3a', 'out-3b', 'ea', 'file-a', 'ptr-top', 'top-null'),
					shot(100, 'shot-queue', 2400),
					{ at: 400, do: 'enter', el: 'file-b' },
					{ at: 400, do: 'enter', el: 'eb' },
					...typeLines(500, 'eb', 1, 17, 140),
					{ at: 600, do: 'enter', el: 'floor-queue' },
					{ at: 1000, do: 'draw', el: 'rt-queue', dur: 900 },
					{ at: 1500, do: 'enter', el: 'm-enq' },
					{ at: 1650, do: 'enter', el: 'm-deq' },
					{ at: 1800, do: 'enter', el: 'm-clr' },
					{ at: 2300, do: 'enter', el: 'front-null' },
					{ at: 2500, do: 'enter', el: 'back-null' },
					// enqueue("A"): an empty queue, so both references point to the new node.
					{ at: queueSub.start(1), do: 'type', el: 'eb-18', dur: 900 },
					bar(queueSub.start(1), 18),
					place(queueSub.start(1), 'p', 'a-enq'),
					{ at: queueSub.start(1) + 100, do: 'enter', el: 'hl' },
					{ at: queueSub.start(1) + 100, do: 'enter', el: 'p' },
					{ at: queueSub.start(1) + 300, do: 'enter', el: 'enq-on' },
					bar(queueSub.start(1) + 600, 4),
					{ at: queueSub.start(1) + 700, do: 'enter', el: 'qa' },
					go(queueSub.start(1) + 900, 'qa', 'a-q0', 900),
					bar(queueSub.start(1) + 1800, 5),
					...clear(queueSub.start(1) + 1900, 'front-null'),
					{ at: queueSub.start(1) + 2100, do: 'enter', el: 'ptr-front' },
					bar(queueSub.start(1) + 2700, 7),
					...clear(queueSub.start(1) + 2800, 'back-null'),
					{ at: queueSub.start(1) + 3000, do: 'enter', el: 'ptr-back' },
					// enqueue("B") and enqueue("C"): each one hooks onto the back.
					...enqueue(queueSub.start(2), 'qb', 1, 'lq-ab'),
					...enqueue(queueSub.start(2) + 2700, 'qc', 2, 'lq-bc'),
				),
			},
		},

		// ─── 6. dequeue: arrival order ──────────────────────────────────────
		{
			id: 'dequeue',
			chapter: 'fifo',
			scene: 'journey',
			title: { es: 'dequeue: por orden de llegada', en: 'dequeue: in arrival order' },
			subtitles: fifoSub.list,
			motion: {
				cues: seq(
					{ at: 100, do: 'exit', el: 'enq-on', dur: 400 },
					{ at: 100, do: 'type', el: 'eb-19', dur: 900 },
					bar(100, 19),
					go(200, 'p', 'a-deq', 900),
					{ at: 1100, do: 'enter', el: 'deq-on' },
					...dequeue(1400, 'qa', 1, 'lq-ab'),
					...dequeue(fifoSub.start(1), 'qb', 2, 'lq-bc'),
					bar(fifoSub.start(1) + 2300, 19),
					{ at: fifoSub.start(1) + 2400, do: 'type', el: 'out-b1', dur: 400 },
					{ at: fifoSub.start(1) + 2800, do: 'enter', el: 'fifo-chip' },
					{ at: fifoSub.start(1) + 3500, do: 'pulse', el: 'fifo-chip' },
				),
			},
		},

		// ─── 7. The last node: fondo = null ─────────────────────────────────
		{
			id: 'last',
			chapter: 'fifo',
			scene: 'journey',
			title: { es: 'El último nodo: fondo = null', en: 'The last node: back = null' },
			subtitles: lastSub.list,
			motion: {
				cues: seq(
					{ at: 100, do: 'exit', el: 'fifo-chip', dur: 400 },
					{ at: 100, do: 'type', el: 'eb-20', dur: 700 },
					bar(100, 20),
					bar(600, 12),
					{ at: 700, do: 'pulse', el: 'qc' },
					bar(1200, 13),
					...clear(1300, 'ptr-front'),
					{ at: 1500, do: 'enter', el: 'front-null' },
					go(1700, 'qc', 'a-q-out', 800),
					{ at: 2600, do: 'exit', el: 'qc', dur: 400 },
					{ at: lastSub.start(1), do: 'enter', el: 'ghost-c' },
					{ at: lastSub.start(1) + 300, do: 'enter', el: 'orphan' },
					{ at: lastSub.start(1) + 900, do: 'pulse', el: 'ptr-back' },
					{ at: lastSub.start(1) + 1800, do: 'pulse', el: 'orphan' },
					bar(lastSub.start(2), 14),
					{ at: lastSub.start(2) + 100, do: 'enter', el: 'hv-14' },
					{ at: lastSub.start(2) + 100, do: 'exit', el: 'deq-on', dur: 300 },
					go(lastSub.start(2) + 100, 'p', 'a-clr', 600),
					{ at: lastSub.start(2) + 700, do: 'enter', el: 'clr-on' },
					...clear(lastSub.start(2) + 1000, 'ptr-back', 'ghost-c', 'orphan'),
					{ at: lastSub.start(2) + 1300, do: 'enter', el: 'back-null' },
					{ at: lastSub.start(2) + 1900, do: 'pulse', el: 'back-null' },
					bar(lastSub.start(2) + 2300, 20),
					{ at: lastSub.start(2) + 2400, do: 'type', el: 'out-b2', dur: 300 },
				),
			},
		},

		// ─── 8. Recap: LIFO versus FIFO, both in O(1) ───────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'LIFO y FIFO, las dos en O(1)', en: 'LIFO and FIFO, both in O(1)' },
			subtitles: recapSub.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'clr-on', 'hv-14', 'front-null', 'back-null'),
					shot(200, 'shot-all', 2800),
					// The same data again: C on top of the stack, A at the front of the queue.
					place(300, 'sa', 'a-s0'),
					place(300, 'sb', 'a-s1'),
					place(300, 'sc', 'a-s2'),
					place(300, 'qa', 'a-q0'),
					place(300, 'qb', 'a-q1'),
					place(300, 'qc', 'a-q2'),
					place(300, 'ptr-front', 'a-front-0'),
					place(300, 'ptr-back', 'a-back-2'),
					{ at: 600, do: 'enter', el: 'sa' },
					{ at: 750, do: 'enter', el: 'sb' },
					{ at: 900, do: 'enter', el: 'sc' },
					{ at: 1000, do: 'enter', el: 'lk-ba' },
					{ at: 1100, do: 'enter', el: 'lk-cb' },
					{ at: 1100, do: 'enter', el: 'ptr-top' },
					go(1100, 'ptr-top', 'a-top-2', 600),
					{ at: 1900, do: 'enter', el: 'lifo-chip' },
					{ at: 2200, do: 'flow', el: 'rt-stack' },
					{ at: recapSub.start(1), do: 'enter', el: 'qa' },
					{ at: recapSub.start(1) + 150, do: 'enter', el: 'qb' },
					{ at: recapSub.start(1) + 300, do: 'enter', el: 'qc' },
					{ at: recapSub.start(1) + 400, do: 'enter', el: 'lq-ab' },
					{ at: recapSub.start(1) + 500, do: 'enter', el: 'lq-bc' },
					{ at: recapSub.start(1) + 700, do: 'enter', el: 'ptr-front' },
					{ at: recapSub.start(1) + 800, do: 'enter', el: 'ptr-back' },
					{ at: recapSub.start(1) + 1100, do: 'enter', el: 'fifo-chip' },
					{ at: recapSub.start(1) + 1300, do: 'flow', el: 'rt-queue' },
					{ at: recapSub.start(2) + 300, do: 'enter', el: 'o1-chip' },
					{ at: recapSub.start(2) + 1300, do: 'pulse', el: 'o1-chip' },
					{ at: recapSub.start(2) + 2300, do: 'pulse', el: 'ptr-top' },
				),
			},
		},
	],
};
