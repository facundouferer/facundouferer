import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Nodes linked by pointers": a short film (about two minutes) for the C lesson
// "Listas" (estructuras-dinamicas-listas). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/listas-enlazadas-c.astro`):
// the lesson's functions on the left, in four small programs that are swapped as the
// story moves on, and on the right three floors, the heap with the nodes of the list,
// the stack with the pointer variables and one module per instruction. A node is two
// cells, `dato` and `siguiente`; every pointer, the `siguiente` links and the variables
// of the stack alike, is an arrow. A key marks the owner of a node and leaves when the
// node is freed. Magenta marks the exceptional (`NULL`, uninitialized cells, a read
// after `free`); violet marks what resolves it (the `NULL` check, `free`, the owner).
// The list is the lesson's own: 3 -> 7 -> 9, then 5 at the head, 11 at the tail, the
// 7 deleted from the middle, the 5 deleted from the head, and the list destroyed.

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

type Program = 'a' | 'b' | 'c' | 'd';

/** The instructions that have a module, per program (the editor lines they sit on). */
const LINES: Record<Program, number[]> = {
	a: [6, 7, 8, 9, 13, 14, 15, 16, 21, 22],
	b: [2, 3, 4, 8, 9, 10, 12, 16, 17],
	c: [2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 18, 19, 20, 21],
	d: [2, 3, 4, 5, 6, 8, 11, 12],
};

/** One instruction runs: the bar slides to its editor line, the flow reaches its module and it lights up. */
function exec(at: number, program: Program, line: number, dur = 600): MotionCue[] {
	return [
		{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 500) },
		{ at, do: 'move', el: 'p', to: `a-m${program}${line}`, dur },
		{ at: at + dur, do: 'enter', el: `on-${program}${line}` },
		{ at: at + dur, do: 'pulse', el: `m-${program}${line}` },
	];
}

/** A line that declares or ends something and has no module: only the bar visits it. */
const bar = (at: number, line: number, dur = 500): MotionCue => ({ at, do: 'move', el: 'hl', to: `ln-${line}`, dur });

/** The modules of a program are built one after the other. */
const build = (at: number, program: Program, gap = 60): MotionCue[] =>
	LINES[program].map((line, index) => ({ at: at + index * gap, do: 'enter' as const, el: `m-${program}${line}` }));

/** The program ends: its file, its modules and their lit states leave. */
const retire = (at: number, program: Program): MotionCue[] =>
	LINES[program].flatMap((line) => [
		{ at, do: 'exit' as const, el: `m-${program}${line}`, dur: 400 },
		{ at, do: 'exit' as const, el: `on-${program}${line}`, dur: 400 },
	]);

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/** Fades several elements in at the same moment. */
const show = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'enter' as const, el }));

/** A value on top of a plate or cell changes: the old text leaves, the new one arrives. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 300 },
	{ at: at + 250, do: 'enter', el: to },
];

/** A pointer variable moves to another node: the old arrow leaves, the new one is drawn. */
const retarget = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 300 },
	{ at: at + 250, do: 'draw', el: to, dur: 600 },
];

/** A node appears with its fields filled in: the cells, `dato`, `siguiente` and its key. */
const node = (at: number, id: string, next: string, key = true): MotionCue[] => [
	{ at, do: 'enter', el: `nd-${id}` },
	{ at: at + 150, do: 'enter', el: `dv-${id}` },
	{ at: at + 250, do: 'enter', el: next },
	...(key ? [{ at: at + 400, do: 'enter' as const, el: `key-${id}` }] : []),
];

// ─── Captions ───────────────────────────────────────────────────────────────
const list = timed(
	say(
		'Una lista es una cadena de nodos en el heap. `cabeza`, en la pila, apunta al primero.',
		'A list is a chain of nodes on the heap. `head`, on the stack, points to the first.',
	),
	say(
		'Cada nodo guarda un `dato` y `siguiente`, la dirección del que sigue. El último guarda `NULL`.',
		'Each node holds a `value` and `next`, the address of the one after it. The last holds `NULL`.',
	),
);
const reserve = timed(
	say(
		'`crear_nodo` pide un bloque con `malloc(sizeof *nodo)` y lo comprueba contra `NULL`.',
		'`create_node` asks for a block with `malloc(sizeof *node)` and checks it against `NULL`.',
	),
	say(
		'Guarda `dato = 5` y `siguiente = NULL`. La llave marca al dueño. Las direcciones reales varían.',
		'It stores `value = 5` and `next = NULL`. The key marks the owner. Real addresses vary.',
	),
);
const head = timed(
	say(
		'Cambiar `cabeza` exige pasar su dirección: `Nodo **cabeza`, porque C pasa por valor.',
		'Changing `head` needs its address: `Node **head`, because C passes by value.',
	),
	say(
		'`nuevo->siguiente = *cabeza`: el nuevo apunta al que era el primero.',
		'`new_node->next = *head`: the new node points to what was the first.',
	),
	say(
		'Después `*cabeza = nuevo`. Hacerlo antes perdería el resto de la lista.',
		'Then `*head = new_node`. Doing it first would lose the rest of the list.',
	),
);
const tail = timed(
	say(
		'Al final hay que recorrer: `ultimo` avanza mientras `ultimo->siguiente` no sea `NULL`.',
		'At the end you must walk: `last` advances while `last->next` is not `NULL`.',
	),
	say(
		'En el nodo que apunta a `NULL`, `ultimo->siguiente = nuevo` engancha el 11 al final.',
		'At the node that points to `NULL`, `last->next = new_node` hooks the 11 on at the end.',
	),
);
// The walk takes longer than the first caption: the second one waits for `ultimo` to arrive.
const TAIL_LINK = 7500;
tail.list[1] = { ...tail.list[1], at: TAIL_LINK };
const middle = timed(
	say(
		'`eliminar(&cabeza, 7)`: `anterior` y `actual` avanzan juntos hasta encontrar el 7.',
		'`delete_value(&head, 7)`: `previous` and `current` advance together until they find the 7.',
	),
	say(
		'`anterior->siguiente = actual->siguiente` salta el 7; recién entonces `free(actual)` lo libera.',
		'`previous->next = current->next` skips the 7; only then does `free(current)` release it.',
	),
);
const first = timed(
	say(
		'Con el 5, `anterior` es `NULL`: no hay vecino y cambia la cabeza: `*cabeza = actual->siguiente`.',
		'With the 5, `previous` is `NULL`: there is no neighbor, so the head changes: `*head = current->next`.',
	),
	say(
		'Primero se desengancha y después se libera: nadie lee un nodo ya liberado.',
		'Unlink first, release after: nobody reads a node that is already released.',
	),
);
const destroy = timed(
	say(
		'`destruir_lista` libera nodo por nodo y antes de cada `free` guarda `siguiente`.',
		'`destroy_list` frees node by node and saves `next` before every `free`.',
	),
	say(
		'Si liberara `actual` antes, `actual->siguiente` leería un bloque ya liberado.',
		'Freeing `current` first would make `current->next` read a released block.',
	),
	say(
		'Con el siguiente a salvo: `free(actual)`, `actual = siguiente`, hasta `NULL`.',
		'With next safe: `free(current)`, `current = next`, until `NULL`.',
	),
);
const end = timed(
	say(
		'Al terminar, `*cabeza = NULL`: una lista vacía es una cabeza que vale `NULL`.',
		'At the end, `*head = NULL`: an empty list is a head that equals `NULL`.',
	),
	say(
		'Cada nodo tuvo un dueño y se liberó una vez. Lo que marca el final siempre es `NULL`.',
		'Every node had one owner and was released once. What marks the end is always `NULL`.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'node', label: { es: 'Qué guarda un nodo', en: 'What a node holds' } },
		{ id: 'head', label: { es: 'La cabeza y el doble puntero', en: 'The head and the double pointer' } },
		{ id: 'tail', label: { es: 'Insertar al final', en: 'Inserting at the end' } },
		{ id: 'delete', label: { es: 'Eliminar un nodo', en: 'Deleting a node' } },
		{ id: 'destroy', label: { es: 'Destruir la lista', en: 'Destroying the list' } },
		{ id: 'end', label: { es: 'El final de la lista', en: 'The end of the list' } },
	],
	steps: [
		// ─── Scene 1. A chain of nodes ───────────────────────────────────────
		{
			id: 'list',
			chapter: 'node',
			scene: 'journey',
			title: { es: 'Una cadena de nodos', en: 'A chain of nodes' },
			subtitles: list.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 2000),
					show(200, 'floor-stack', 'floor-heap'),
					node(1000, 'n3', 'sg-n3-5080', false),
					node(1500, 'n7', 'sg-n7-5030', false),
					node(2000, 'n9', 'sg-n9-null', false),
					{ at: 2800, do: 'enter', el: 'v-cabeza' },
					{ at: 3100, do: 'type', el: 'pv-cabeza-5010', dur: 400 },
					{ at: 3500, do: 'draw', el: 'ar-cabeza-n3', dur: 900 },
					{ at: 4100, do: 'draw', el: 'lk-n3-n7', dur: 700 },
					{ at: 4500, do: 'draw', el: 'lk-n7-n9', dur: 700 },
					{ at: 5300, do: 'pulse', el: 'v-cabeza' },
					shot(list.start(1), 'shot-list', 1800),
					{ at: list.start(1) + 300, do: 'enter', el: 'hl' },
					bar(list.start(1) + 400, 2),
					{ at: list.start(1) + 700, do: 'enter', el: 'lb-dato' },
					{ at: list.start(1) + 900, do: 'pulse', el: 'dv-n3' },
					bar(list.start(1) + 1700, 3),
					{ at: list.start(1) + 1800, do: 'enter', el: 'lb-sig' },
					{ at: list.start(1) + 2000, do: 'pulse', el: 'sg-n3-5080' },
					{ at: list.start(1) + 3300, do: 'enter', el: 'lb-end' },
					{ at: list.start(1) + 3600, do: 'pulse', el: 'sg-n9-null' },
					{ at: list.start(1) + 4400, do: 'pulse', el: 'nd-n9' },
				),
			},
		},
		{
			id: 'malloc',
			chapter: 'node',
			scene: 'journey',
			title: { es: 'malloc reserva un nodo', en: 'malloc reserves a node' },
			subtitles: reserve.list,
			motion: {
				cues: seq(
					clear(0, 'lb-dato', 'lb-sig', 'lb-end'),
					shot(100, 'shot-new', 1800),
					show(300, 'floor-prog'),
					build(500, 'a', 70),
					show(1200, 'gt-a7', 'gt-a7-bar', 'gt-a14', 'gt-a14-bar', 'p'),
					exec(1500, 'a', 21, 650),
					exec(2300, 'a', 13, 550),
					exec(3000, 'a', 6, 700),
					{ at: 3100, do: 'enter', el: 'lb-sizeof' },
					{ at: 3900, do: 'enter', el: 'v-nodo' },
					{ at: 4100, do: 'enter', el: 'nd-n5' },
					{ at: 4300, do: 'enter', el: 'q-n5-d' },
					{ at: 4400, do: 'enter', el: 'q-n5-s' },
					{ at: 4600, do: 'type', el: 'pv-nodo-5050', dur: 400 },
					{ at: 4900, do: 'draw', el: 'ar-nodo-n5', dur: 800 },
					{ at: 4800, do: 'exit', el: 'lb-sizeof', dur: 300 },
					{ at: 5000, do: 'enter', el: 'lb-uninit' },
					exec(5300, 'a', 7, 500),
					{ at: 5500, do: 'pulse', el: 'gt-a7-bar' },
					{ at: 5800, do: 'exit', el: 'gt-a7-bar', dur: 300 },
					{ at: 5900, do: 'enter', el: 'gt-a7-open' },
					{ at: reserve.start(1) + 300, do: 'exit', el: 'lb-uninit', dur: 300 },
					exec(reserve.start(1) + 400, 'a', 8, 550),
					swap(reserve.start(1) + 1000, 'q-n5-d', 'dv-n5'),
					exec(reserve.start(1) + 1500, 'a', 9, 550),
					swap(reserve.start(1) + 2100, 'q-n5-s', 'sg-n5-null'),
					{ at: reserve.start(1) + 2700, do: 'enter', el: 'key-n5' },
					{ at: reserve.start(1) + 2800, do: 'enter', el: 'lb-owner' },
					{ at: reserve.start(1) + 3200, do: 'enter', el: 'key-n3' },
					{ at: reserve.start(1) + 3300, do: 'enter', el: 'key-n7' },
					{ at: reserve.start(1) + 3400, do: 'enter', el: 'key-n9' },
					{ at: reserve.start(1) + 4300, do: 'exit', el: 'lb-owner', dur: 300 },
					{ at: reserve.start(1) + 4500, do: 'enter', el: 'lb-addr' },
				),
			},
		},

		// ─── Scene 2. Insert at the head through Nodo ** ─────────────────────
		{
			id: 'head',
			chapter: 'head',
			scene: 'journey',
			title: { es: 'Insertar al inicio con Nodo **', en: 'Inserting at the front with Node **' },
			subtitles: head.list,
			motion: {
				cues: seq(
					shot(0, 'shot-head', 1800),
					clear(100, 'lb-addr', 'v-nodo', 'pv-nodo-5050', 'ar-nodo-n5'),
					show(400, 'v-nuevo'),
					{ at: 700, do: 'type', el: 'pv-nuevo-5050', dur: 400 },
					{ at: 1000, do: 'draw', el: 'ar-nuevo-n5', dur: 800 },
					bar(1100, 12, 500),
					{ at: 1500, do: 'enter', el: 'v-param' },
					{ at: 1800, do: 'type', el: 'pv-param-addr', dur: 400 },
					{ at: 2100, do: 'draw', el: 'ar-param-cabeza', dur: 900 },
					{ at: 2700, do: 'enter', el: 'lb-ptrptr' },
					{ at: 3400, do: 'pulse', el: 'v-cabeza' },
					exec(3900, 'a', 13, 450),
					exec(4500, 'a', 14, 450),
					{ at: 4800, do: 'exit', el: 'gt-a14-bar', dur: 300 },
					{ at: 4900, do: 'enter', el: 'gt-a14-open' },
					clear(head.start(1), 'lb-ptrptr'),
					exec(head.start(1) + 200, 'a', 15, 650),
					{ at: head.start(1) + 1000, do: 'draw', el: 'lk-n5-n3', dur: 900 },
					swap(head.start(1) + 1300, 'sg-n5-null', 'sg-n5-5010'),
					{ at: head.start(1) + 2000, do: 'enter', el: 'lb-step1' },
					{ at: head.start(1) + 2800, do: 'pulse', el: 'nd-n5' },
					clear(head.start(2), 'lb-step1'),
					exec(head.start(2) + 200, 'a', 16, 650),
					{ at: head.start(2) + 1000, do: 'exit', el: 'ar-cabeza-n3', dur: 300 },
					swap(head.start(2) + 1100, 'pv-cabeza-5010', 'pv-cabeza-5050'),
					{ at: head.start(2) + 1500, do: 'draw', el: 'ar-cabeza-n5', dur: 800 },
					{ at: head.start(2) + 1900, do: 'enter', el: 'lb-step2' },
					{ at: head.start(2) + 2800, do: 'pulse', el: 'v-cabeza' },
					exec(head.start(2) + 3300, 'a', 22, 550),
					{ at: head.start(2) + 3900, do: 'type', el: 'o-a1', dur: 900 },
					{ at: head.start(2) + 4500, do: 'exit', el: 'lb-step2', dur: 300 },
				),
			},
		},

		// ─── Scene 3. Insert at the tail: walk the chain ─────────────────────
		{
			id: 'tail',
			chapter: 'tail',
			scene: 'journey',
			title: { es: 'Insertar al final: recorrer la cadena', en: 'Inserting at the end: walking the chain' },
			subtitles: tail.list,
			motion: {
				cues: seq(
					shot(0, 'shot-tail', 2200),
					// The first program ends: its frame leaves with its modules.
					clear(0, 'ed-a', 'file-a', 'o-a1', 'gt-a7', 'gt-a7-open', 'gt-a14', 'gt-a14-open', 'v-param', 'pv-param-addr', 'ar-param-cabeza', 'v-nuevo', 'pv-nuevo-5050', 'ar-nuevo-n5'),
					retire(100, 'a'),
					show(500, 'ed-b', 'file-b'),
					build(600, 'b', 50),
					show(1100, 'gt-b3', 'gt-b3-bar'),
					exec(1300, 'b', 16, 450),
					exec(1900, 'b', 2, 450),
					{ at: 2100, do: 'enter', el: 'v-nuevo' },
					node(2300, 'n11', 'sg-n11-null'),
					{ at: 2600, do: 'type', el: 'pv-nuevo-50a0', dur: 300 },
					{ at: 2900, do: 'draw', el: 'ar-nuevo-n11', dur: 800 },
					exec(2500, 'b', 3, 450),
					{ at: 3000, do: 'exit', el: 'gt-b3-bar', dur: 300 },
					{ at: 3100, do: 'enter', el: 'gt-b3-open' },
					exec(3500, 'b', 4, 450),
					exec(4100, 'b', 8, 450),
					{ at: 4300, do: 'enter', el: 'v-ultimo' },
					{ at: 4600, do: 'type', el: 'pv-ultimo-5050', dur: 300 },
					{ at: 4900, do: 'draw', el: 'ar-ultimo-n5', dur: 600 },
					// The walk: while `ultimo->siguiente` is not NULL, `ultimo` moves to the next node.
					exec(5400, 'b', 9, 300),
					exec(5730, 'b', 10, 300),
					retarget(6060, 'ar-ultimo-n5', 'ar-ultimo-n3'),
					swap(6060, 'pv-ultimo-5050', 'pv-ultimo-5010'),
					exec(6200, 'b', 9, 300),
					exec(6530, 'b', 10, 300),
					retarget(6860, 'ar-ultimo-n3', 'ar-ultimo-n7'),
					swap(6860, 'pv-ultimo-5010', 'pv-ultimo-5080'),
					exec(7000, 'b', 9, 300),
					exec(7330, 'b', 10, 300),
					retarget(7660, 'ar-ultimo-n7', 'ar-ultimo-n9'),
					swap(7660, 'pv-ultimo-5080', 'pv-ultimo-5030'),
					{ at: TAIL_LINK + 400, do: 'enter', el: 'lb-last' },
					{ at: TAIL_LINK + 700, do: 'pulse', el: 'sg-n9-null' },
					exec(TAIL_LINK + 1500, 'b', 12, 550),
					{ at: TAIL_LINK + 2200, do: 'draw', el: 'lk-n9-n11', dur: 900 },
					swap(TAIL_LINK + 2400, 'sg-n9-null', 'sg-n9-50a0'),
					{ at: TAIL_LINK + 3300, do: 'pulse', el: 'nd-n11' },
					clear(TAIL_LINK + 3300, 'lb-last'),
					exec(TAIL_LINK + 3800, 'b', 17, 500),
					{ at: TAIL_LINK + 4400, do: 'type', el: 'o-b1', dur: 1000 },
				),
			},
		},

		// ─── Scene 4. Delete: relink, then free ──────────────────────────────
		{
			id: 'middle',
			chapter: 'delete',
			scene: 'journey',
			title: { es: 'Eliminar un nodo del medio', en: 'Deleting a node from the middle' },
			subtitles: middle.list,
			motion: {
				cues: seq(
					shot(0, 'shot-del', 2000),
					clear(0, 'ed-b', 'file-b', 'o-b1', 'gt-b3', 'gt-b3-open', 'v-nuevo', 'pv-nuevo-50a0', 'ar-nuevo-n11', 'v-ultimo', 'pv-ultimo-5030', 'ar-ultimo-n9'),
					retire(100, 'b'),
					show(500, 'ed-c', 'file-c'),
					build(600, 'c', 40),
					exec(1200, 'c', 18, 400),
					exec(1700, 'c', 2, 400),
					{ at: 1900, do: 'enter', el: 'v-actual' },
					{ at: 2100, do: 'type', el: 'pv-actual-5050', dur: 250 },
					{ at: 2300, do: 'draw', el: 'ar-actual-n5', dur: 500 },
					exec(2200, 'c', 3, 400),
					{ at: 2400, do: 'enter', el: 'v-anterior' },
					{ at: 2600, do: 'type', el: 'pv-anterior-null', dur: 250 },
					// First pass of the loop: 5 is not 7, both pointers advance.
					exec(3000, 'c', 4, 350),
					exec(3400, 'c', 5, 350),
					{ at: 3800, do: 'draw', el: 'ar-anterior-n5', dur: 500 },
					swap(3800, 'pv-anterior-null', 'pv-anterior-5050'),
					exec(3900, 'c', 6, 350),
					retarget(4300, 'ar-actual-n5', 'ar-actual-n3'),
					swap(4300, 'pv-actual-5050', 'pv-actual-5010'),
					// Second pass: 3 is not 7 either.
					exec(4800, 'c', 4, 350),
					exec(5200, 'c', 5, 350),
					retarget(5600, 'ar-anterior-n5', 'ar-anterior-n3'),
					swap(5600, 'pv-anterior-5050', 'pv-anterior-5010'),
					exec(5700, 'c', 6, 350),
					retarget(6100, 'ar-actual-n3', 'ar-actual-n7'),
					swap(6100, 'pv-actual-5010', 'pv-actual-5080'),
					exec(middle.start(1) + 400, 'c', 8, 400),
					exec(middle.start(1) + 900, 'c', 9, 400),
					exec(middle.start(1) + 1400, 'c', 12, 500),
					{ at: middle.start(1) + 1900, do: 'exit', el: 'lk-n3-n7', dur: 300 },
					{ at: middle.start(1) + 2000, do: 'draw', el: 'lk-n3-n9', dur: 900 },
					swap(middle.start(1) + 2200, 'sg-n3-5080', 'sg-n3-5030'),
					{ at: middle.start(1) + 3000, do: 'pulse', el: 'nd-n3' },
					exec(middle.start(1) + 3300, 'c', 14, 550),
					{ at: middle.start(1) + 3900, do: 'enter', el: 'rel-n7' },
					{ at: middle.start(1) + 3900, do: 'exit', el: 'key-n7', dur: 400 },
					{ at: middle.start(1) + 4000, do: 'exit', el: 'lk-n7-n9', dur: 300 },
					{ at: middle.start(1) + 4100, do: 'enter', el: 'lb-rel-n7' },
					exec(middle.start(1) + 4900, 'c', 19, 450),
					{ at: middle.start(1) + 5500, do: 'type', el: 'o-c1', dur: 900 },
				),
			},
		},
		{
			id: 'first',
			chapter: 'delete',
			scene: 'journey',
			title: { es: 'Eliminar la cabeza', en: 'Deleting the head' },
			subtitles: first.list,
			motion: {
				cues: seq(
					clear(0, 'lb-rel-n7', 'ar-actual-n7', 'ar-anterior-n3', 'pv-anterior-5010', 'pv-actual-5080'),
					exec(300, 'c', 20, 450),
					{ at: 800, do: 'enter', el: 'pv-anterior-null' },
					{ at: 800, do: 'enter', el: 'pv-actual-5050' },
					{ at: 900, do: 'enter', el: 'ar-actual-n5' },
					exec(1200, 'c', 2, 400),
					exec(1700, 'c', 3, 400),
					exec(2200, 'c', 4, 400),
					exec(2700, 'c', 8, 400),
					exec(3200, 'c', 9, 400),
					{ at: 3400, do: 'enter', el: 'lb-nohead' },
					exec(3900, 'c', 10, 500),
					{ at: 4500, do: 'exit', el: 'ar-cabeza-n5', dur: 300 },
					swap(4600, 'pv-cabeza-5050', 'pv-cabeza-5010'),
					{ at: 5000, do: 'enter', el: 'ar-cabeza-n3' },
					{ at: 5300, do: 'pulse', el: 'v-cabeza' },
					{ at: first.start(1) + 100, do: 'exit', el: 'lb-nohead', dur: 300 },
					exec(first.start(1) + 400, 'c', 14, 550),
					{ at: first.start(1) + 1000, do: 'enter', el: 'rel-n5' },
					{ at: first.start(1) + 1000, do: 'exit', el: 'key-n5', dur: 400 },
					{ at: first.start(1) + 1100, do: 'exit', el: 'lk-n5-n3', dur: 300 },
					{ at: first.start(1) + 1500, do: 'pulse', el: 'v-cabeza' },
					exec(first.start(1) + 2300, 'c', 21, 450),
					{ at: first.start(1) + 2900, do: 'type', el: 'o-c2', dur: 800 },
				),
			},
		},

		// ─── Scene 5. Destroy: save the next one before free ─────────────────
		{
			id: 'destroy',
			chapter: 'destroy',
			scene: 'journey',
			title: { es: 'Destruir la lista nodo por nodo', en: 'Destroying the list node by node' },
			subtitles: destroy.list,
			motion: {
				cues: seq(
					shot(0, 'shot-destroy', 2000),
					clear(0, 'ed-c', 'file-c', 'o-c1', 'o-c2', 'v-anterior', 'pv-anterior-null', 'v-actual', 'pv-actual-5050', 'ar-actual-n5'),
					retire(100, 'c'),
					show(500, 'ed-d', 'file-d'),
					build(600, 'd', 50),
					exec(1100, 'd', 11, 450),
					exec(1700, 'd', 2, 450),
					{ at: 1900, do: 'enter', el: 'v-actual' },
					{ at: 2100, do: 'enter', el: 'pv-actual-5010' },
					{ at: 2400, do: 'enter', el: 'ar-actual-n3' },
					exec(2500, 'd', 3, 400),
					exec(3000, 'd', 4, 450),
					{ at: 3200, do: 'enter', el: 'v-siguiente' },
					{ at: 3400, do: 'type', el: 'pv-siguiente-5030', dur: 300 },
					{ at: 3700, do: 'draw', el: 'ar-siguiente-n9', dur: 700 },
					{ at: 4300, do: 'enter', el: 'lb-save' },
					// What would happen without saving it: the read of `actual->siguiente` after the free.
					clear(destroy.start(1), 'lb-save'),
					{ at: destroy.start(1) + 300, do: 'enter', el: 'lb-uaf' },
					{ at: destroy.start(1) + 500, do: 'pulse', el: 'sg-n3-5030' },
					{ at: destroy.start(1) + 1400, do: 'pulse', el: 'nd-n3' },
					clear(destroy.start(1) + 2300, 'lb-uaf'),
					{ at: destroy.start(1) + 2600, do: 'pulse', el: 'ar-siguiente-n9' },
					{ at: destroy.start(1) + 2900, do: 'pulse', el: 'v-siguiente' },
					// First node: free it, then `actual` takes the saved address.
					exec(destroy.start(1) + 3400, 'd', 5, 450),
					{ at: destroy.start(1) + 4000, do: 'enter', el: 'rel-n3' },
					{ at: destroy.start(1) + 4000, do: 'exit', el: 'key-n3', dur: 400 },
					{ at: destroy.start(1) + 4100, do: 'exit', el: 'lk-n3-n9', dur: 300 },
					exec(destroy.start(1) + 4500, 'd', 6, 400),
					retarget(destroy.start(1) + 4900, 'ar-actual-n3', 'ar-actual-n9'),
					swap(destroy.start(1) + 4900, 'pv-actual-5010', 'pv-actual-5030'),
					// Second node.
					exec(destroy.start(2) + 100, 'd', 4, 400),
					retarget(destroy.start(2) + 500, 'ar-siguiente-n9', 'ar-siguiente-n11'),
					swap(destroy.start(2) + 500, 'pv-siguiente-5030', 'pv-siguiente-50a0'),
					exec(destroy.start(2) + 900, 'd', 5, 400),
					{ at: destroy.start(2) + 1400, do: 'enter', el: 'rel-n9' },
					{ at: destroy.start(2) + 1400, do: 'exit', el: 'key-n9', dur: 400 },
					{ at: destroy.start(2) + 1500, do: 'exit', el: 'lk-n9-n11', dur: 300 },
					exec(destroy.start(2) + 1800, 'd', 6, 400),
					retarget(destroy.start(2) + 2200, 'ar-actual-n9', 'ar-actual-n11'),
					swap(destroy.start(2) + 2200, 'pv-actual-5030', 'pv-actual-50a0'),
					// Last node: its `siguiente` is NULL, so `actual` ends at NULL too.
					exec(destroy.start(2) + 2800, 'd', 4, 400),
					{ at: destroy.start(2) + 3200, do: 'exit', el: 'ar-siguiente-n11', dur: 300 },
					swap(destroy.start(2) + 3200, 'pv-siguiente-50a0', 'pv-siguiente-null'),
					exec(destroy.start(2) + 3600, 'd', 5, 400),
					{ at: destroy.start(2) + 4100, do: 'enter', el: 'rel-n11' },
					{ at: destroy.start(2) + 4100, do: 'exit', el: 'key-n11', dur: 400 },
					exec(destroy.start(2) + 4500, 'd', 6, 400),
					{ at: destroy.start(2) + 4900, do: 'exit', el: 'ar-actual-n11', dur: 300 },
					swap(destroy.start(2) + 4900, 'pv-actual-50a0', 'pv-actual-null'),
				),
			},
		},

		// ─── Scene 6. The end of the list; the whole system ──────────────────
		{
			id: 'end',
			chapter: 'end',
			scene: 'journey',
			title: { es: 'NULL marca el final', en: 'NULL marks the end' },
			subtitles: end.list,
			motion: {
				cues: seq(
					exec(200, 'd', 3, 400),
					exec(800, 'd', 8, 500),
					{ at: 1400, do: 'exit', el: 'ar-cabeza-n3', dur: 400 },
					swap(1400, 'pv-cabeza-5010', 'pv-cabeza-null'),
					{ at: 2000, do: 'enter', el: 'lb-empty' },
					{ at: 2400, do: 'pulse', el: 'v-cabeza' },
					exec(3000, 'd', 12, 450),
					{ at: 3600, do: 'type', el: 'o-d1', dur: 400 },
					clear(end.start(1), 'v-siguiente', 'pv-siguiente-null', 'v-actual', 'pv-actual-null', 'lb-empty'),
					// The camera pulls back: five nodes were asked for and given back, and only NULL is left.
					shot(end.start(1) + 400, 'shot-all', 2800),
					{ at: end.start(1) + 800, do: 'pulse', el: 'rel-n5' },
					{ at: end.start(1) + 1200, do: 'pulse', el: 'rel-n3' },
					{ at: end.start(1) + 1600, do: 'pulse', el: 'rel-n7' },
					{ at: end.start(1) + 2000, do: 'pulse', el: 'rel-n9' },
					{ at: end.start(1) + 2400, do: 'pulse', el: 'rel-n11' },
					{ at: end.start(1) + 3000, do: 'pulse', el: 'v-cabeza' },
					{ at: end.start(1) + 3800, do: 'exit', el: 'hl', dur: 400 },
				),
			},
		},
	],
};
