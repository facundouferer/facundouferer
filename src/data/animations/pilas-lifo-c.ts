import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Last in, first out": a short film (about two minutes) for the C lesson "Pilas". It
// plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/pilas-lifo-c.astro`): the lesson's code on the left (the
// linked stack's `push` and `pop`, then the array stack's `push` with `realloc`, then
// the balanced brackets checker) and on the right the heap floor, the variables of
// `main` and one module per instruction. A stack of linked nodes is a column of plates
// where only the top one is touched; a pointer is always an arrow (the top pointer, and
// the `next` of every node). Magenta marks the problem (`NULL`, the empty pop, the
// mismatch); violet what resolves it (the checks, `free`). Addresses are short and
// fictional; real ones vary.

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

type Program = 'a' | 'b' | 'c';

/**
 * One instruction runs: the bar slides to its editor line, the execution flow reaches
 * its module and the module lights up. `a` is the linked stack, `b` the array stack and
 * `c` the brackets checker.
 */
function exec(program: Program, at: number, line: number, dur = 600): MotionCue[] {
	return [
		{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 500) },
		{ at, do: 'move', el: 'p', to: `a${program}-${line}`, dur },
		{ at: at + dur, do: 'enter', el: `on${program}-${line}` },
		{ at: at + dur, do: 'pulse', el: `m${program}-${line}` },
	];
}

/** A value on top of a plate or cell changes: the old text leaves, the new one arrives. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 300 },
	{ at: at + 250, do: 'enter', el: to },
];

const exits = (at: number, ids: string[], dur = 400): MotionCue[] => ids.map((el) => ({ at, do: 'exit' as const, el, dur }));

// ─── Captions ───────────────────────────────────────────────────────────────
const rule = timed(
	say('Una pila solo se toca por un extremo, el tope: se agrega y se quita ahí.', 'A stack is only touched at one end, the top: you add and remove there.'),
	say('El último en entrar es el primero en salir: LIFO, como una pila de platos.', 'The last one in is the first one out: LIFO, like a stack of plates.'),
);
const push = timed(
	say('`pila_apilar` pide un nodo con `malloc` y comprueba que no sea `NULL`.', '`stack_push` asks for a node with `malloc` and checks it is not `NULL`.'),
	say('El nodo nuevo apunta al tope anterior y pasa a ser el tope.', 'The new node points to the old top and becomes the top.'),
	say('Entran el 20 y el 30, cada uno encima. El tope es el 30.', 'In come 20 and 30, each on top. The top is 30.'),
);
const pop = timed(
	say('`pila_desapilar` copia el dato del tope, 30, antes de tocar el nodo.', '`stack_pop` copies the top value, 30, before touching the node.'),
	say('El tope baja un nodo y `free(viejo)` lo devuelve: lo libera la pila.', 'The top moves down and `free(old)` gives the node back: the stack frees it.'),
	say('Salen el 20 y el 10, al revés de como entraron. La pila queda vacía.', 'Out go 20 and 10, the reverse of how they came in. The stack is empty.'),
);
const empty = timed(
	say('Si se desapila otra vez, `tope == NULL`: no hay nada y devuelve `false`.', 'Popping again, `top == NULL`: there is nothing, so it returns `false`.'),
	say('No se toca `NULL` ni hay crash: `main` informa el error.', 'No `NULL` is touched and nothing crashes: `main` reports the error.'),
);
const full = timed(
	say('La misma pila sobre un arreglo: el tope es la última posición ocupada.', 'The same stack on an array: the top is the last occupied position.'),
	say('Llega el 5 y `cantidad == capacidad`: el arreglo está lleno y debe crecer.', 'In comes 5 and `count == capacity`: the array is full and must grow.'),
);
const grow = timed(
	say('`realloc` pide el doble y lo guarda en `nuevos`, no en `datos`.', '`realloc` asks for double and keeps it in `new_data`, not in `data`.'),
	say('Solo con `nuevos != NULL`, `datos` lo adopta: capacidad 8, y entra el 5.', 'Only with `new_data != NULL` does `data` adopt it: capacity 8, and 5 goes in.'),
	say('Con 10 elementos la capacidad llega a 16: duplicar hace raro `realloc`.', 'With 10 elements the capacity reaches 16: doubling makes `realloc` rare.'),
);
const brackets = timed(
	say('Cada apertura se apila y cada cierre debe coincidir con el tope.', 'Every opening is pushed and every closing must match the top.'),
	say('En `{[(a + b) * c]}` entran `{`, `[` y `(`, y salen en orden inverso.', 'In `{[(a + b) * c]}`, `{`, `[` and `(` go in and come out in reverse.'),
	say('La pila termina vacía: `tope == NULL`. La expresión está balanceada.', 'The stack ends up empty: `top == NULL`. The expression is balanced.'),
);
const mismatch = timed(
	say('En `{(a + b]`, el `]` encuentra `(` arriba y esperaba `[`: no coinciden.', 'In `{(a + b]`, the `]` finds `(` on top but expected `[`: no match.'),
	say('Antes de retornar, `destruir_pila` libera el nodo de `{` que seguía apilado.', 'Before returning, `destroy_stack` frees the `{` node that was still stacked.'),
	say('Cada nodo sale de `malloc` y se libera una sola vez, salga como salga.', 'Each node comes from `malloc` and is freed exactly once, however it returns.'),
);

// The modules of each program, in the order they are built.
const MODULES_A = [2, 3, 6, 7, 8, 9, 10, 13, 14, 16, 17, 18, 19, 20, 21];
const MODULES_B = [2, 3, 5, 7, 10, 11, 13, 14, 15];
const MODULES_C = [2, 3, 4, 5, 9, 10, 11, 13, 14, 18, 19, 20];
const modulesOf = (program: Program, lines: number[]) => lines.flatMap((line) => [`m${program}-${line}`, `on${program}-${line}`]);

/** `push(value)` of the linked stack: the `k`-th node arrives. `fast` skips the check and the return. */
function pushLinked(k: number, at: number, fast: boolean): MotionCue[] {
	const pace = fast ? 460 : 520;
	const gap = fast ? 60 : 90;
	const lines = fast ? [2, 6, 7, 8, 9] : [2, 3, 6, 7, 8, 9, 10];
	const when = new Map<number, number>();
	const cues: MotionCue[] = [{ at, do: 'enter', el: `cl-ap${k}` }];
	lines.forEach((line, index) => {
		const start = at + 200 + index * (pace + gap);
		cues.push(...exec('a', start, line, pace));
		when.set(line, start + pace);
	});
	const arrived = (line: number) => when.get(line) ?? at;
	cues.push({ at: arrived(2), do: 'enter', el: `nd-a${k}` });
	if (!fast) {
		cues.push({ at: arrived(3), do: 'exit', el: 'gta-3-bar', dur: 300 }, { at: arrived(3) + 200, do: 'enter', el: 'gta-3-open' });
	}
	cues.push({ at: arrived(6), do: 'enter', el: `nv-a${k}` });
	if (k > 1) cues.push({ at: arrived(7), do: 'draw', el: `lk-a${k}`, dur: 500 });
	cues.push(...swap(arrived(8), `tv-a${k - 1}`, `tv-a${k}`));
	if (k > 1) cues.push({ at: arrived(8), do: 'exit', el: `tp-a${k - 1}`, dur: 300 });
	cues.push({ at: arrived(8) + 300, do: 'draw', el: `tp-a${k}`, dur: 700 });
	cues.push(...swap(arrived(9), `cv-${k - 1}`, `cv-${k}`));
	cues.push({ at: arrived(fast ? 9 : 10) + 500, do: 'exit', el: `cl-ap${k}`, dur: 300 });
	return cues;
}

/** `pop` of the linked stack: the node `k` leaves and is freed. `fast` skips the explanations. */
function popLinked(k: number, at: number): MotionCue[] {
	const call = 4 - k;
	const lines = [13, 16, 18, 19, 20];
	const cues: MotionCue[] = [{ at, do: 'enter', el: `cl-de${call}` }];
	const when = new Map<number, number>();
	lines.forEach((line, index) => {
		const start = at + 200 + index * 440;
		cues.push(...exec('a', start, line, 380));
		when.set(line, start + 380);
	});
	const arrived = (line: number) => when.get(line) ?? at;
	if (k > 1) cues.push({ at: arrived(18), do: 'exit', el: `lk-a${k}`, dur: 300 });
	cues.push(...swap(arrived(18), `tv-a${k}`, `tv-a${k - 1}`));
	cues.push({ at: arrived(18), do: 'exit', el: `tp-a${k}`, dur: 300 });
	if (k > 1) cues.push({ at: arrived(18) + 300, do: 'draw', el: `tp-a${k - 1}`, dur: 600 });
	cues.push({ at: arrived(19), do: 'enter', el: `rl-a${k}` });
	cues.push({ at: arrived(19) + 100, do: 'exit', el: `nd-a${k}`, dur: 300 });
	cues.push({ at: arrived(19) + 100, do: 'exit', el: `nv-a${k}`, dur: 300 });
	cues.push({ at: arrived(19) + 700, do: 'exit', el: `rl-a${k}`, dur: 400 });
	cues.push(...swap(arrived(20), `cv-${k}`, `cv-${k - 1}`));
	cues.push({ at: arrived(20) + 400, do: 'type', el: `oa-${call}`, dur: 300 });
	cues.push({ at: arrived(20) + 600, do: 'exit', el: `cl-de${call}`, dur: 300 });
	return cues;
}

/** An opening symbol of the brackets checker: the cursor reaches it and its node is pushed. */
function pushSymbol(k: number, tape: number, index: number, at: number): MotionCue[] {
	const lines = [4, 5];
	const cues: MotionCue[] = [{ at, do: 'move', el: 'cur', to: `t${tape}-${index}`, dur: 450 }];
	cues.push(...exec('c', at + 400, lines[0], 330), ...exec('c', at + 800, lines[1], 330));
	const done = at + 800 + 330;
	cues.push({ at: done, do: 'enter', el: `nd-c${k}` }, { at: done + 100, do: 'enter', el: `nv-c${k}` });
	if (k > 1) cues.push({ at: done + 100, do: 'draw', el: `lk-c${k}`, dur: 450 }, { at: done + 100, do: 'exit', el: `tp-c${k - 1}`, dur: 300 });
	cues.push(...swap(done + 100, `tv-c${k - 1}`, `tv-c${k}`));
	cues.push({ at: done + 400, do: 'draw', el: `tp-c${k}`, dur: 600 });
	return cues;
}

/** A closing symbol that matches: the top node is popped and freed. */
function popSymbol(k: number, tape: number, index: number, at: number): MotionCue[] {
	const cues: MotionCue[] = [{ at, do: 'move', el: 'cur', to: `t${tape}-${index}`, dur: 450 }];
	cues.push(...exec('c', at + 400, 9, 300), ...exec('c', at + 750, 10, 300), ...exec('c', at + 1100, 11, 330));
	const done = at + 1100 + 330;
	if (k > 1) cues.push({ at: done, do: 'exit', el: `lk-c${k}`, dur: 300 });
	cues.push(...swap(done, `tv-c${k}`, `tv-c${k - 1}`));
	cues.push({ at: done, do: 'exit', el: `tp-c${k}`, dur: 300 });
	if (k > 1) cues.push({ at: done + 300, do: 'draw', el: `tp-c${k - 1}`, dur: 500 });
	cues.push({ at: done + 100, do: 'enter', el: `rl-c${k}` });
	cues.push({ at: done + 200, do: 'exit', el: `nd-c${k}`, dur: 300 }, { at: done + 200, do: 'exit', el: `nv-c${k}`, dur: 300 });
	cues.push({ at: done + 800, do: 'exit', el: `rl-c${k}`, dur: 400 });
	return cues;
}

export const script: AnimationScript = {
	chapters: [
		{ id: 'lifo', label: { es: 'La regla LIFO', en: 'The LIFO rule' } },
		{ id: 'push', label: { es: 'Apilar con malloc', en: 'Pushing with malloc' } },
		{ id: 'pop', label: { es: 'Desapilar y liberar', en: 'Popping and freeing' } },
		{ id: 'empty', label: { es: 'Una pila vacía', en: 'An empty stack' } },
		{ id: 'array', label: { es: 'La pila con arreglo', en: 'The array stack' } },
		{ id: 'brackets', label: { es: 'Paréntesis balanceados', en: 'Balanced brackets' } },
	],
	steps: [
		// ─── Scene 1. A stack is touched at one end ──────────────────────────
		{
			id: 'rule',
			chapter: 'lifo',
			scene: 'journey',
			title: { es: 'Solo se toca el tope', en: 'Only the top is touched' },
			subtitles: rule.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 1800),
					{ at: 200, do: 'enter', el: 'floor-stack' },
					{ at: 700, do: 'enter', el: 'floor-heap' },
					{ at: 1200, do: 'enter', el: 'floor-prog' },
					MODULES_A.map((line, index) => ({ at: 1500 + index * 80, do: 'enter' as const, el: `ma-${line}` })),
					{ at: 2900, do: 'enter', el: 'gta-3' },
					{ at: 2900, do: 'enter', el: 'gta-3-bar' },
					{ at: 3000, do: 'enter', el: 'gta-13' },
					{ at: 3000, do: 'enter', el: 'gta-13-bar' },
					{ at: 3300, do: 'enter', el: 'v-tope' },
					{ at: 3600, do: 'type', el: 'tv-a0', dur: 300 },
					{ at: 3900, do: 'enter', el: 'v-cant' },
					{ at: 4200, do: 'type', el: 'cv-0', dur: 300 },
					{ at: 4700, do: 'pulse', el: 'floor-heap' },
					shot(rule.start(1), 'shot-col', 1800),
					{ at: rule.start(1) + 600, do: 'enter', el: 'ch-lifo' },
					{ at: rule.start(1) + 1500, do: 'pulse', el: 'floor-heap' },
					{ at: rule.start(1) + 2500, do: 'pulse', el: 'v-tope' },
				),
			},
		},

		// ─── Scene 2. Push: malloc, check, place on top ──────────────────────
		{
			id: 'push',
			chapter: 'push',
			scene: 'journey',
			title: { es: 'Apilar un nodo', en: 'Pushing a node' },
			subtitles: push.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'ch-lifo', dur: 400 },
					shot(0, 'shot-prog', 1400),
					{ at: 200, do: 'enter', el: 'hl' },
					{ at: 200, do: 'enter', el: 'p' },
					{ at: 300, do: 'type', el: 'oa-0', dur: 900 },
					pushLinked(1, 400, false),
					shot(push.start(1), 'shot-col', 1400),
					pushLinked(2, push.start(1) + 300, true),
					pushLinked(3, push.start(2) + 200, true),
					{ at: push.start(2) + 3000, do: 'pulse', el: 'tp-a3' },
					{ at: push.start(2) + 3500, do: 'pulse', el: 'nd-a3' },
					{ at: push.start(2) + 3500, do: 'pulse', el: 'tv-a3' },
				),
			},
		},

		// ─── Scene 3. Pop: copy, move the top, free ──────────────────────────
		{
			id: 'pop',
			chapter: 'pop',
			scene: 'journey',
			title: { es: 'Desapilar y liberar', en: 'Popping and freeing' },
			subtitles: pop.list,
			motion: {
				cues: seq(
					shot(0, 'shot-col', 1400),
					{ at: 100, do: 'enter', el: 'cl-de1' },
					exec('a', 300, 13, 700),
					{ at: 1000, do: 'exit', el: 'gta-13-bar', dur: 300 },
					{ at: 1200, do: 'enter', el: 'gta-13-open' },
					exec('a', 1500, 16, 700),
					{ at: 2200, do: 'enter', el: 'ch-viejo' },
					exec('a', 2900, 17, 700),
					{ at: 3600, do: 'enter', el: 'ch-copy' },
					{ at: 3700, do: 'pulse', el: 'nv-a3' },
					exec('a', pop.start(1) + 100, 18, 700),
					{ at: pop.start(1) + 800, do: 'exit', el: 'lk-a3', dur: 300 },
					{ at: pop.start(1) + 800, do: 'exit', el: 'tp-a3', dur: 300 },
					swap(pop.start(1) + 800, 'tv-a3', 'tv-a2'),
					{ at: pop.start(1) + 1100, do: 'draw', el: 'tp-a2', dur: 600 },
					exec('a', pop.start(1) + 1500, 19, 700),
					{ at: pop.start(1) + 2200, do: 'enter', el: 'rl-a3' },
					{ at: pop.start(1) + 2300, do: 'exit', el: 'nd-a3', dur: 300 },
					{ at: pop.start(1) + 2300, do: 'exit', el: 'nv-a3', dur: 300 },
					{ at: pop.start(1) + 2300, do: 'exit', el: 'ch-viejo', dur: 300 },
					{ at: pop.start(1) + 2300, do: 'exit', el: 'ch-copy', dur: 300 },
					{ at: pop.start(1) + 2400, do: 'enter', el: 'ch-free' },
					exec('a', pop.start(1) + 2900, 20, 500),
					swap(pop.start(1) + 3400, 'cv-3', 'cv-2'),
					exec('a', pop.start(1) + 3600, 21, 500),
					{ at: pop.start(1) + 4200, do: 'type', el: 'oa-1', dur: 300 },
					{ at: pop.start(1) + 4300, do: 'exit', el: 'ch-free', dur: 300 },
					{ at: pop.start(1) + 4300, do: 'exit', el: 'rl-a3', dur: 400 },
					{ at: pop.start(1) + 4300, do: 'exit', el: 'cl-de1', dur: 300 },
					popLinked(2, pop.start(2) + 100),
					popLinked(1, pop.start(2) + 2500),
				),
			},
		},

		// ─── Scene 4. Popping an empty stack is refused ──────────────────────
		{
			id: 'empty',
			chapter: 'empty',
			scene: 'journey',
			title: { es: 'Desapilar una pila vacía', en: 'Popping an empty stack' },
			subtitles: empty.list,
			motion: {
				cues: seq(
					shot(0, 'shot-col', 1400),
					// The check of line 13 is closed again: there is no top to read.
					{ at: 0, do: 'exit', el: 'gta-13-open', dur: 300 },
					{ at: 200, do: 'enter', el: 'gta-13-bar' },
					{ at: 300, do: 'enter', el: 'cl-de4' },
					exec('a', 600, 13, 800),
					{ at: 1500, do: 'pulse', el: 'gta-13-bar' },
					{ at: 1700, do: 'enter', el: 'ch-null' },
					{ at: 2400, do: 'pulse', el: 'v-tope' },
					{ at: 2400, do: 'pulse', el: 'tv-a0' },
					exec('a', empty.start(1) + 200, 14, 800),
					{ at: empty.start(1) + 1100, do: 'pulse', el: 'ma-14' },
					{ at: empty.start(1) + 1500, do: 'type', el: 'oa-4', dur: 900 },
					{ at: empty.start(1) + 2800, do: 'exit', el: 'ch-null', dur: 400 },
					{ at: empty.start(1) + 2800, do: 'exit', el: 'cl-de4', dur: 400 },
				),
			},
		},

		// ─── Scene 5. The array stack is full ────────────────────────────────
		{
			id: 'full',
			chapter: 'array',
			scene: 'journey',
			title: { es: 'La pila sobre un arreglo', en: 'The stack on an array' },
			subtitles: full.list,
			motion: {
				cues: seq(
					// The first program has ended: its frame and its modules are gone.
					exits(0, [
						...modulesOf('a', MODULES_A),
						'gta-3', 'gta-3-open', 'gta-13', 'gta-13-bar', 'ed-a', 'file-a', 'oa-0', 'oa-1', 'oa-2', 'oa-3', 'oa-4',
						'v-tope', 'tv-a0', 'cv-0', 'p', 'hl',
					]),
					shot(100, 'shot-arr', 2000),
					{ at: 600, do: 'enter', el: 'ed-b' },
					{ at: 600, do: 'enter', el: 'file-b' },
					MODULES_B.map((line, index) => ({ at: 800 + index * 90, do: 'enter' as const, el: `mb-${line}` })),
					{ at: 1700, do: 'enter', el: 'gtb-7' },
					{ at: 1700, do: 'enter', el: 'gtb-7-bar' },
					{ at: 1900, do: 'type', el: 'ob-0', dur: 900 },
					{ at: 2000, do: 'enter', el: 'blk-xa' },
					[0, 1, 2, 3].map((index) => ({ at: 2300 + index * 150, do: 'enter' as const, el: `xa-${index}` })),
					{ at: 3000, do: 'enter', el: 'v-datos' },
					{ at: 3300, do: 'type', el: 'dv-a', dur: 400 },
					{ at: 3700, do: 'draw', el: 'pt-xa', dur: 900 },
					{ at: 4000, do: 'type', el: 'cn-4', dur: 300 },
					{ at: 4100, do: 'enter', el: 'v-capa' },
					{ at: 4400, do: 'type', el: 'kv-4', dur: 300 },
					{ at: 4800, do: 'pulse', el: 'blk-xa' },
					{ at: 4900, do: 'move', el: 'p', to: 'ab-2', dur: 1 },
					{ at: 4900, do: 'move', el: 'hl', to: 'ln-2', dur: 1 },
					{ at: full.start(1) + 100, do: 'enter', el: 'p' },
					{ at: full.start(1) + 100, do: 'enter', el: 'hl' },
					{ at: full.start(1) + 200, do: 'enter', el: 'cl-ar5' },
					exec('b', full.start(1) + 500, 2, 800),
					{ at: full.start(1) + 1400, do: 'enter', el: 'ch-full' },
					{ at: full.start(1) + 1400, do: 'pulse', el: 'blk-xa' },
					{ at: full.start(1) + 2200, do: 'pulse', el: 'v-capa' },
				),
			},
		},
		{
			id: 'grow',
			chapter: 'array',
			scene: 'journey',
			title: { es: 'Crecer con realloc', en: 'Growing with realloc' },
			subtitles: grow.list,
			motion: {
				cues: seq(
					shot(0, 'shot-arr', 1400),
					{ at: 100, do: 'exit', el: 'ch-full', dur: 300 },
					exec('b', 200, 3, 600),
					exec('b', 900, 5, 700),
					{ at: 1600, do: 'enter', el: 'blk-xb' },
					[4, 5, 6, 7].map((index) => ({ at: 1800 + (index - 4) * 120, do: 'enter' as const, el: `xq-${index}` })),
					{ at: 2300, do: 'enter', el: 'v-nuevos' },
					{ at: 2600, do: 'draw', el: 'cp-ab', dur: 1000 },
					[0, 1, 2, 3].map((index) => ({ at: 3200 + index * 180, do: 'enter' as const, el: `xb-${index}` })),
					{ at: 3900, do: 'enter', el: 'rel-xa' },
					{ at: 4000, do: 'enter', el: 'ch-rel' },
					{ at: 4100, do: 'type', el: 'nw-b', dur: 400 },
					{ at: 4400, do: 'draw', el: 'pt-nb', dur: 700 },
					// What would happen if it failed: nuevos is NULL, datos still points to a valid block.
					{ at: 4500, do: 'enter', el: 'ch-fail' },
					{ at: grow.start(1) - 200, do: 'enter', el: 'ch-valid' },
					exec('b', grow.start(1) + 200, 7, 600),
					{ at: grow.start(1) + 800, do: 'exit', el: 'gtb-7-bar', dur: 300 },
					{ at: grow.start(1) + 1000, do: 'enter', el: 'gtb-7-open' },
					{ at: grow.start(1) + 1100, do: 'exit', el: 'ch-fail', dur: 300 },
					{ at: grow.start(1) + 1100, do: 'exit', el: 'ch-valid', dur: 300 },
					exec('b', grow.start(1) + 1200, 10, 600),
					{ at: grow.start(1) + 1800, do: 'exit', el: 'pt-xa', dur: 300 },
					swap(grow.start(1) + 1800, 'dv-a', 'dv-b'),
					{ at: grow.start(1) + 2000, do: 'draw', el: 'pt-xb', dur: 600 },
					exec('b', grow.start(1) + 2000, 11, 500),
					swap(grow.start(1) + 2500, 'kv-4', 'kv-8'),
					{ at: grow.start(1) + 2800, do: 'exit', el: 'pt-nb', dur: 300 },
					{ at: grow.start(1) + 2800, do: 'exit', el: 'nw-b', dur: 300 },
					{ at: grow.start(1) + 2900, do: 'exit', el: 'v-nuevos', dur: 300 },
					exec('b', grow.start(1) + 2800, 13, 500),
					swap(grow.start(1) + 3300, 'xq-4', 'xb-4'),
					exec('b', grow.start(1) + 3500, 14, 500),
					swap(grow.start(1) + 4000, 'cn-4', 'cn-5'),
					exec('b', grow.start(1) + 4200, 15, 500),
					{ at: grow.start(2) + 200, do: 'exit', el: 'ch-rel', dur: 300 },
					{ at: grow.start(2) + 300, do: 'enter', el: 'ch-cap' },
					{ at: grow.start(2) + 900, do: 'type', el: 'ob-1', dur: 900 },
					{ at: grow.start(2) + 2200, do: 'pulse', el: 'v-capa' },
					{ at: grow.start(2) + 2200, do: 'pulse', el: 'kv-8' },
				),
			},
		},

		// ─── Scene 6. The use case: balanced brackets ────────────────────────
		{
			id: 'brackets',
			chapter: 'brackets',
			scene: 'journey',
			title: { es: 'Verificar paréntesis balanceados', en: 'Checking balanced brackets' },
			subtitles: brackets.list,
			motion: {
				cues: seq(
					exits(0, [
						...modulesOf('b', MODULES_B),
						'gtb-7', 'gtb-7-open', 'ed-b', 'file-b', 'ob-0', 'ob-1', 'cl-ar5', 'ch-cap', 'p', 'hl',
						'blk-xa', 'blk-xb', 'rel-xa', 'cp-ab', 'pt-xb',
						'xa-0', 'xa-1', 'xa-2', 'xa-3', 'xb-0', 'xb-1', 'xb-2', 'xb-3', 'xb-4', 'xq-5', 'xq-6', 'xq-7',
						'v-datos', 'dv-b', 'v-capa', 'kv-8', 'v-cant', 'cn-5',
					]),
					shot(300, 'shot-br', 1800),
					{ at: 600, do: 'enter', el: 'ed-c' },
					{ at: 600, do: 'enter', el: 'file-c' },
					MODULES_C.map((line, index) => ({ at: 800 + index * 90, do: 'enter' as const, el: `mc-${line}` })),
					{ at: 1900, do: 'enter', el: 'tape-1' },
					{ at: 2200, do: 'enter', el: 'v-tope' },
					{ at: 2500, do: 'type', el: 'tv-c0', dur: 300 },
					{ at: 2700, do: 'move', el: 'cur', to: 't1-0', dur: 1 },
					{ at: 2700, do: 'move', el: 'p', to: 'ac-2', dur: 1 },
					{ at: 2700, do: 'move', el: 'hl', to: 'ln-2', dur: 1 },
					{ at: 2900, do: 'enter', el: 'cur' },
					{ at: 2900, do: 'enter', el: 'p' },
					{ at: 2900, do: 'enter', el: 'hl' },
					exec('c', 3000, 2, 300),
					exec('c', 3500, 3, 300),
					pushSymbol(1, 1, 0, 3900),
					pushSymbol(2, 1, 1, 5000),
					pushSymbol(3, 1, 2, 6100),
					shot(brackets.start(1), 'shot-br', 1200),
					popSymbol(3, 1, 8, brackets.start(1) + 1900),
					popSymbol(2, 1, 13, brackets.start(1) + 3600),
					popSymbol(1, 1, 14, brackets.start(1) + 5300),
					exec('c', brackets.start(2) + 1500, 18, 600),
					exec('c', brackets.start(2) + 2300, 19, 500),
					exec('c', brackets.start(2) + 3000, 20, 500),
					{ at: brackets.start(2) + 3600, do: 'type', el: 'oc-1', dur: 900 },
					{ at: brackets.start(2) + 4300, do: 'enter', el: 'ch-bal' },
				),
			},
		},
		{
			id: 'mismatch',
			chapter: 'brackets',
			scene: 'journey',
			title: { es: 'Un cierre que no coincide', en: 'A closing that does not match' },
			subtitles: mismatch.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'tape-1', dur: 400 },
					{ at: 0, do: 'exit', el: 'ch-bal', dur: 400 },
					{ at: 0, do: 'exit', el: 'cur', dur: 300 },
					shot(0, 'shot-br', 1400),
					{ at: 500, do: 'enter', el: 'tape-2' },
					{ at: 800, do: 'move', el: 'cur', to: 't2-0', dur: 1 },
					{ at: 900, do: 'enter', el: 'cur' },
					pushSymbol(1, 2, 0, 1000),
					pushSymbol(2, 2, 1, 2200),
					// `]` arrives: the pop returns `(`, but `]` expects `[`.
					{ at: 3600, do: 'move', el: 'cur', to: 't2-7', dur: 500 },
					exec('c', mismatch.start(0) + 3900, 9, 300),
					exec('c', mismatch.start(0) + 4250, 10, 300),
					exec('c', mismatch.start(0) + 4600, 11, 330),
					{ at: mismatch.start(0) + 4930, do: 'exit', el: 'lk-c2', dur: 300 },
					{ at: mismatch.start(0) + 4930, do: 'exit', el: 'tp-c2', dur: 300 },
					swap(mismatch.start(0) + 4930, 'tv-c2', 'tv-c1'),
					{ at: mismatch.start(0) + 5230, do: 'draw', el: 'tp-c1', dur: 500 },
					{ at: mismatch.start(0) + 5000, do: 'enter', el: 'rl-c2' },
					{ at: mismatch.start(0) + 5100, do: 'exit', el: 'nd-c2', dur: 300 },
					{ at: mismatch.start(0) + 5100, do: 'exit', el: 'nv-c2', dur: 300 },
					{ at: mismatch.start(0) + 5300, do: 'enter', el: 'ch-mis' },
					{ at: mismatch.start(0) + 5700, do: 'exit', el: 'rl-c2', dur: 400 },
					// Returning early: destroy_stack frees what is still stacked.
					exec('c', mismatch.start(1) + 100, 13, 600),
					{ at: mismatch.start(1) + 800, do: 'enter', el: 'ch-dest' },
					{ at: mismatch.start(1) + 900, do: 'exit', el: 'tp-c1', dur: 300 },
					swap(mismatch.start(1) + 900, 'tv-c1', 'tv-c0'),
					{ at: mismatch.start(1) + 1000, do: 'enter', el: 'rl-c1' },
					{ at: mismatch.start(1) + 1100, do: 'exit', el: 'nd-c1', dur: 300 },
					{ at: mismatch.start(1) + 1100, do: 'exit', el: 'nv-c1', dur: 300 },
					{ at: mismatch.start(1) + 1600, do: 'exit', el: 'rl-c1', dur: 400 },
					exec('c', mismatch.start(1) + 1800, 14, 600),
					{ at: mismatch.start(1) + 2600, do: 'type', el: 'oc-2', dur: 900 },
					{ at: mismatch.start(1) + 3200, do: 'enter', el: 'ch-nobal' },
					{ at: mismatch.start(2) + 200, do: 'exit', el: 'ch-mis', dur: 300 },
					{ at: mismatch.start(2) + 200, do: 'exit', el: 'ch-dest', dur: 300 },
					{ at: mismatch.start(2) + 200, do: 'exit', el: 'ch-nobal', dur: 300 },
					// The camera pulls back: every node asked for was given back once.
					shot(mismatch.start(2) + 400, 'shot-all', 2800),
					{ at: mismatch.start(2) + 1000, do: 'enter', el: 'ch-once' },
					{ at: mismatch.start(2) + 1800, do: 'pulse', el: 'floor-heap' },
					{ at: mismatch.start(2) + 2600, do: 'pulse', el: 'v-tope' },
					{ at: mismatch.start(2) + 3200, do: 'exit', el: 'hl', dur: 400 },
				),
			},
		},
	],
};
