import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Every call stacks a frame": a short film (about two minutes) for the C lesson
// "Recursividad" (`recursividad`). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/recursividad-pila-c.astro`):
// the program on the left in an editor whose bar slides to the running line, and on the
// right the call stack as stacked isometric frames. `factorial(4)` pushes one frame per
// call, each with its own `n`, and the results come back down as the frames are popped;
// `sin_fin` piles frames up against a ceiling (the stack limit); the calls of
// `fibonacci(5)` form a tree on a floor, next to the loop that does the same work with
// two variables. Light blue is the execution flow, violet is what resolves (the base
// case, the value that comes back) and magenta is what goes wrong (no base case,
// repeated calls).

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

/** The particle and the editor bar travel together to the module of one line. */
const runTo = (at: number, anchor: string, line: number, dur = 700): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: anchor, dur },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 700) },
];

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

const OVER = Array.from({ length: 10 }, (_, index) => index + 1);
// The calls of fibonacci(5) in the order they run, and the ones that repeat earlier work
// (fibonacci(3) twice, fibonacci(2) three times).
const CALLS = [5, 4, 3, 2, 1, 0, 1, 2, 1, 0, 3, 2, 1, 0, 1];
const REPEATS = CALLS.flatMap((n, index) => (n === 3 || n === 2 ? [index] : []));
// What `actual` and `anterior` hold after each turn of the loop (the lesson's iterative version).
const LOOP_LINES = [10, 11, 12, 15, 16, 17, 18, 20];

/**
 * A new call: its frame is pushed, the bar goes to the `if` (line 4) and then to the
 * recursive call (line 7), which stays pending. The frame below stops being the active one.
 */
const push = (at: number, n: number): MotionCue[] => [
	{ at, do: 'enter', el: `fr-${n}`, dur: 700 },
	{ at: at + 500, do: 'pulse', el: `c-${n}` },
	...(n < 4 ? [{ at: at + 600, do: 'exit' as const, el: `on-${n + 1}-7`, dur: 300 }] : []),
	...runTo(at + 600, `a-m${n}-4`, 4, 600),
	{ at: at + 1200, do: 'enter', el: `on-${n}-4` },
	{ at: at + 1400, do: 'exit', el: `on-${n}-4`, dur: 300 },
	...runTo(at + 1400, `a-m${n}-7`, 7, 600),
	{ at: at + 2000, do: 'enter', el: `on-${n}-7` },
];

/**
 * A frame hands its value to the one below while it is popped: the token travels, the
 * particle and the bar follow it to the `return` of the receiver, and the pending
 * multiplication of the receiver turns into its result.
 */
const give = (at: number, n: number): MotionCue[] => {
	const receiver = n + 1;
	const to = n === 4 ? 'a-tmain' : `a-t${receiver}`;
	return [
		...(n > 1 ? [{ at, do: 'enter' as const, el: `rt-${n}` }, { at: at + 100, do: 'pulse' as const, el: `m-${n}-7` }] : []),
		{ at: at + 400, do: 'enter', el: `tk-${n}` },
		{ at: at + 700, do: 'move', el: `tk-${n}`, to, dur: 1400 },
		{ at: at + 700, do: 'move', el: 'p', to: n === 4 ? 'a-m16' : `a-m${receiver}-7`, dur: 1400 },
		{ at: at + 700, do: 'move', el: 'hl', to: n === 4 ? 'ln-16' : 'ln-7', dur: 700 },
		{ at: at + 800, do: 'exit', el: `fr-${n}`, dur: 800 },
		...(n > 1 ? [{ at: at + 800, do: 'exit' as const, el: `r-${n}`, dur: 400 }] : [{ at: at + 800, do: 'exit' as const, el: 'b-1', dur: 400 }]),
		{ at: at + 2100, do: 'exit', el: `tk-${n}`, dur: 300 },
		...(n < 4
			? [
					{ at: at + 2100, do: 'exit' as const, el: `w-${receiver}`, dur: 300 },
					{ at: at + 2200, do: 'enter' as const, el: `r-${receiver}` },
					{ at: at + 2300, do: 'pulse' as const, el: `c-${receiver}` },
				]
			: []),
	];
};

// ─── Captions ───────────────────────────────────────────────────────────────
const build = timed(
	say('Una función recursiva se llama a sí misma con un problema menor.', 'A recursive function calls itself on a smaller problem.'),
	say('Línea 5, el caso base: responde sin llamarse. Es la salida.', 'Line 5, the base case: it answers without calling itself.'),
	say('Línea 7, el caso recursivo: llama con `n - 1`, más cerca de la base.', 'Line 7, the recursive case: it calls with `n - 1`, closer to the base.'),
);
const down = timed(
	say('`factorial(4)` apila un marco en la pila de llamadas, con su propia `n`.', '`factorial(4)` pushes a frame on the call stack, with its own `n`.'),
	say('La línea 7 espera: `4 * factorial(3)` aún no tiene su resultado.', 'Line 7 waits: `4 * factorial(3)` has no result yet.'),
	say('Cada llamada apila otro marco, con su propia copia de `n`.', 'Each call stacks another frame, with its own copy of `n`.'),
);
const bottom = timed(
	say('`factorial(1)` cumple `n <= 1`: caso base, devuelve `1` sin llamarse.', '`factorial(1)` meets `n <= 1`: base case, returns `1` without calling itself.'),
	say('Hay cuatro marcos a la vez, cada uno con su multiplicación pendiente.', 'Four frames at once, each with its pending multiplication.'),
);
const up = timed(
	say('Al devolver `1`, el marco de `factorial(1)` sale de la pila.', 'Returning `1` pops the frame of `factorial(1)` off the stack.'),
	say('Las multiplicaciones pendientes se hacen a la vuelta: `2 * 1`, `3 * 2`.', 'Pending multiplications happen on the way back: `2 * 1`, `3 * 2`.'),
	say('Por fin `4 * 6` da `24`, vuelve a `main` y se imprime.', 'Finally `4 * 6` gives `24`, returns to `main` and is printed.'),
);
const overflow = timed(
	say('Sin caso base, `sin_fin` apila un marco tras otro, sin parar.', 'Without a base case, `endless` stacks frame after frame, never stopping.'),
	say('La pila es limitada: los marcos suben hasta un techo que no pasan.', 'The stack is limited: the frames rise to a ceiling they cannot pass.'),
	say('Se desborda la pila: el programa termina con `Segmentation fault`.', 'The stack overflows: the program ends with `Segmentation fault`.'),
);
const tree = timed(
	say('`fibonacci` hace dos llamadas por llamada: forman un árbol.', '`fibonacci` makes two calls per call: they form a tree.'),
	say('15 llamadas: `fibonacci(3)` se repite 2 veces, `fibonacci(2)`, 3.', '15 calls: `fibonacci(3)` repeats 2 times, `fibonacci(2)`, 3.'),
	say('Costo exponencial: `fibonacci(40)` hace más de 330 millones de llamadas.', 'Exponential cost: `fibonacci(40)` makes over 330 million calls.'),
);
const loop = timed(
	say('`fibonacci_iterativo` usa un ciclo con dos variables que se actualizan.', '`fibonacci_iterative` uses a loop with two variables that get updated.'),
	say('Llega al mismo `5` en 4 vueltas y con memoria constante.', 'It reaches the same `5` in 4 turns, with constant memory.'),
);
const close = timed(
	say('Evítala en recorridos lineales o si la profundidad es enorme.', 'Avoid it for linear traversals or when the depth is huge.'),
	say('Y si recalcula lo mismo, como `fibonacci`: gana el ciclo.', 'And if it recomputes the same work, like `fibonacci`: the loop wins.'),
	say('Úsala si el problema se parte en trozos menores y hay poca profundidad.', 'Use it when the problem splits into smaller parts and the depth is small.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'cases', label: { es: 'Caso base y caso recursivo', en: 'Base case and recursive case' } },
		{ id: 'down', label: { es: 'La pila crece', en: 'The stack grows' } },
		{ id: 'up', label: { es: 'Los resultados vuelven', en: 'The results come back' } },
		{ id: 'overflow', label: { es: 'Sin caso base', en: 'Without a base case' } },
		{ id: 'cost', label: { es: 'El costo de fibonacci', en: 'The cost of fibonacci' } },
		{ id: 'choose', label: { es: 'Cuándo usarla', en: 'When to use it' } },
	],
	steps: [
		// ─── Scene 1. Base case and recursive case ──────────────────────────
		{
			id: 'build',
			chapter: 'cases',
			scene: 'journey',
			title: { es: 'Dos partes: caso base y caso recursivo', en: 'Two parts: base case and recursive case' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-main', 3000),
					{ at: 100, do: 'enter', el: 'f-main', dur: 800 },
					{ at: 600, do: 'enter', el: 'm-16' },
					{ at: 900, do: 'enter', el: 'm-17' },
					{ at: 1300, do: 'enter', el: 'stack-tag' },
					{ at: 1600, do: 'enter', el: 'hl' },
					{ at: 1600, do: 'enter', el: 'p' },
					...runTo(build.start(0) + 1800, 'a-m16', 7, 700),
					{ at: build.start(0) + 2500, do: 'enter', el: 'hx-7' },
					{ at: build.start(1), do: 'exit', el: 'hx-7', dur: 300 },
					...runTo(build.start(1) + 100, 'a-m16', 5, 600),
					{ at: build.start(1) + 700, do: 'enter', el: 'hx-5' },
					{ at: build.start(1) + 1400, do: 'pulse', el: 'hx-5' },
					{ at: build.start(2), do: 'exit', el: 'hx-5', dur: 300 },
					...runTo(build.start(2) + 100, 'a-m16', 7, 600),
					{ at: build.start(2) + 700, do: 'enter', el: 'hx-7' },
					{ at: build.start(2) + 1400, do: 'pulse', el: 'hx-7' },
					{ at: build.start(2) + 3000, do: 'exit', el: 'hx-7', dur: 300 },
					...runTo(build.start(2) + 3100, 'a-m16', 16, 700),
					{ at: build.start(2) + 3900, do: 'enter', el: 'on-16' },
					{ at: build.start(2) + 3900, do: 'pulse', el: 'm-16' },
				),
			},
		},

		// ─── Scene 2. The stack grows ───────────────────────────────────────
		{
			id: 'down',
			chapter: 'down',
			scene: 'journey',
			title: { es: 'Cada llamada apila un marco', en: 'Each call pushes a frame' },
			subtitles: down.list,
			motion: {
				cues: seq(
					shot(0, 'shot-low', 2200),
					{ at: 200, do: 'exit', el: 'on-16', dur: 300 },
					...push(300, 4),
					{ at: down.start(1) + 300, do: 'enter', el: 'w-4' },
					{ at: down.start(1) + 400, do: 'pulse', el: 'on-4-7' },
					{ at: down.start(1) + 1400, do: 'pulse', el: 'w-4' },
					shot(down.start(2), 'shot-stack', 2200),
					...push(down.start(2) + 200, 3),
					{ at: down.start(2) + 2200, do: 'enter', el: 'w-3' },
					...push(down.start(2) + 2500, 2),
					{ at: down.start(2) + 4500, do: 'enter', el: 'w-2' },
				),
			},
		},
		{
			id: 'bottom',
			chapter: 'down',
			scene: 'journey',
			title: { es: 'Llegar al caso base', en: 'Reaching the base case' },
			subtitles: bottom.list,
			motion: {
				cues: seq(
					shot(0, 'shot-top', 2400),
					{ at: 100, do: 'enter', el: 'fr-1', dur: 700 },
					{ at: 600, do: 'pulse', el: 'c-1' },
					{ at: 700, do: 'exit', el: 'on-2-7', dur: 300 },
					...runTo(700, 'a-m1-4', 4, 600),
					{ at: 1300, do: 'enter', el: 'on-1-4' },
					{ at: 1600, do: 'exit', el: 'on-1-4', dur: 300 },
					...runTo(1600, 'a-m1-5', 5, 600),
					{ at: 2200, do: 'enter', el: 'on-1-5' },
					{ at: 2300, do: 'pulse', el: 'm-1-5' },
					{ at: 2600, do: 'enter', el: 'b-1' },
					shot(bottom.start(1), 'shot-stack', 2200),
					{ at: bottom.start(1) + 800, do: 'enter', el: 'lb-depth' },
					{ at: bottom.start(1) + 1000, do: 'pulse', el: 'c-1' },
					{ at: bottom.start(1) + 1400, do: 'pulse', el: 'c-2' },
					{ at: bottom.start(1) + 1800, do: 'pulse', el: 'c-3' },
					{ at: bottom.start(1) + 2200, do: 'pulse', el: 'c-4' },
				),
			},
		},

		// ─── Scene 3. The results come back ─────────────────────────────────
		{
			id: 'up',
			chapter: 'up',
			scene: 'journey',
			title: { es: 'La vuelta: los marcos se retiran', en: 'The way back: frames are popped' },
			subtitles: up.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-depth', dur: 300 },
					shot(0, 'shot-top', 1800),
					{ at: 200, do: 'draw', el: 'fl-up', dur: 1200 },
					...give(600, 1),
					shot(up.start(1), 'shot-mid', 2200),
					{ at: up.start(1), do: 'flow', el: 'fl-up' },
					...give(up.start(1) + 200, 2),
					...give(up.start(1) + 2700, 3),
					shot(up.start(2), 'shot-main', 2200),
					...give(up.start(2) + 200, 4),
					{ at: up.start(2) + 2400, do: 'enter', el: 'on-16' },
					{ at: up.start(2) + 2500, do: 'pulse', el: 'm-16' },
					{ at: up.start(2) + 2900, do: 'type', el: 'out-1', dur: 700 },
				),
			},
		},

		// ─── Scene 4. Without a base case ───────────────────────────────────
		{
			id: 'overflow',
			chapter: 'overflow',
			scene: 'journey',
			title: { es: 'Sin caso base, la pila se desborda', en: 'Without a base case, the stack overflows' },
			subtitles: overflow.list,
			motion: {
				cues: seq(
					...clear(0, 'fl-up', 'on-16'),
					shot(200, 'shot-over', 2400),
					...runTo(300, 'a-m17', 17, 800),
					{ at: 1100, do: 'enter', el: 'on-17' },
					{ at: 1100, do: 'pulse', el: 'm-17' },
					{ at: 1300, do: 'move', el: 'hl', to: 'ln-12', dur: 600 },
					{ at: 1900, do: 'enter', el: 'hx-12' },
					...OVER.flatMap((k): MotionCue[] => [
						{ at: 2000 + (k - 1) * 650, do: 'enter', el: `s-${k}`, dur: 500 },
						{ at: 2000 + (k - 1) * 650, do: 'move', el: 'p', to: `a-ms${k}`, dur: 600 },
					]),
					{ at: overflow.start(1), do: 'enter', el: 'ceil', dur: 700 },
					{ at: overflow.start(1) + 900, do: 'enter', el: 'lb-limit' },
					{ at: 2000 + 9 * 650 + 700, do: 'enter', el: 'ons-10' },
					{ at: 2000 + 9 * 650 + 800, do: 'pulse', el: 'ceil' },
					{ at: overflow.start(2), do: 'type', el: 'out-2', dur: 900 },
					{ at: overflow.start(2) + 500, do: 'enter', el: 'lb-crash' },
					{ at: overflow.start(2) + 1400, do: 'pulse', el: 'ceil' },
				),
			},
		},

		// ─── Scene 5. The cost of fibonacci ─────────────────────────────────
		{
			id: 'tree',
			chapter: 'cost',
			scene: 'journey',
			title: { es: 'fibonacci: un árbol de llamadas', en: 'fibonacci: a tree of calls' },
			subtitles: tree.list,
			motion: {
				cues: seq(
					...clear(0, 'f-main', 'm-16', 'm-17', 'on-17', 'stack-tag', 'hx-12', 'out-1', 'out-2', 'lb-limit', 'lb-crash', 'ceil', 'ed-a', ...OVER.map((k) => `s-${k}`)),
					shot(200, 'shot-tree', 2400),
					{ at: 400, do: 'enter', el: 'ed-b' },
					{ at: 500, do: 'enter', el: 'tfloor', dur: 800 },
					...runTo(700, 'a-tn0', 23, 900),
					{ at: 1700, do: 'move', el: 'hl', to: 'ln-7', dur: 400 },
					...CALLS.flatMap((_, i): MotionCue[] => [
						{ at: 2000 + i * 270, do: 'enter', el: `tn-${i}`, dur: 400 },
						...(i > 0
							? ([
									{ at: 2000 + i * 270, do: 'draw', el: `te-${i}`, dur: 300 },
									{ at: 2000 + i * 270, do: 'move', el: 'p', to: `a-tn${i}`, dur: 260 },
								] as MotionCue[])
							: []),
					]),
					{ at: 2000 + 14 * 270 + 600, do: 'enter', el: 'lb-node' },
					{ at: tree.start(1) + 1500, do: 'enter', el: 'lb-calls' },
					{ at: tree.start(1) + 1600, do: 'exit', el: 'p', dur: 400 },
					...REPEATS.map((i, k): MotionCue => ({ at: tree.start(1) + 1900 + k * 450, do: 'enter', el: `rp-${i}` })),
					{ at: tree.start(1) + 1900 + REPEATS.length * 450, do: 'enter', el: 'lb-rep' },
					{ at: tree.start(2) + 200, do: 'enter', el: 'lb-exp' },
					{ at: tree.start(2) + 300, do: 'pulse', el: 'tn-0' },
					...REPEATS.map((i, k): MotionCue => ({ at: tree.start(2) + 600 + k * 250, do: 'pulse', el: `rp-${i}` })),
					{ at: tree.start(2) + 2200, do: 'type', el: 'out-3', dur: 400 },
				),
			},
		},
		{
			id: 'loop',
			chapter: 'cost',
			scene: 'journey',
			title: { es: 'El mismo resultado con un ciclo', en: 'The same result with a loop' },
			subtitles: loop.list,
			motion: {
				cues: seq(
					shot(0, 'shot-loop', 2400),
					{ at: 200, do: 'enter', el: 'lfloor', dur: 800 },
					...LOOP_LINES.map((line, k): MotionCue => ({ at: 500 + k * 150, do: 'enter', el: `lm-${line}` })),
					{ at: 1900, do: 'enter', el: 'c-ant' },
					{ at: 2000, do: 'enter', el: 'c-act' },
					{ at: 300, do: 'enter', el: 'p', dur: 400 },
					{ at: 300, do: 'move', el: 'hl', to: 'ln-24', dur: 500 },
					...runTo(2300, 'a-l10', 10, 800),
					{ at: 3200, do: 'enter', el: 'ant-0' },
					...runTo(3500, 'a-l11', 11, 450),
					{ at: 4000, do: 'enter', el: 'act-0' },
					...runTo(4150, 'a-l12', 12, 450),
					// The loop: lines 15 to 18 run four times; `anterior` and `actual` take their new values.
					...[1, 2, 3, 4].flatMap((turn): MotionCue[] => {
						const at = 4800 + (turn - 1) * 1350;
						return [
							...runTo(at, 'a-l15', 15, 300),
							...runTo(at + 330, 'a-l16', 16, 300),
							...runTo(at + 660, 'a-l17', 17, 300),
							{ at: at + 960, do: 'exit', el: `ant-${turn - 1}`, dur: 250 },
							{ at: at + 1000, do: 'enter', el: `ant-${turn}` },
							...runTo(at + 990, 'a-l18', 18, 300),
							{ at: at + 1290, do: 'exit', el: `act-${turn - 1}`, dur: 250 },
							{ at: at + 1330, do: 'enter', el: `act-${turn}` },
						];
					}),
					...runTo(10300, 'a-l20', 20, 500),
					{ at: 10900, do: 'type', el: 'out-4', dur: 400 },
					{ at: 11000, do: 'enter', el: 'lb-turns' },
					{ at: 11400, do: 'enter', el: 'lb-mem' },
				),
			},
		},

		// ─── Scene 6. When to use it ────────────────────────────────────────
		{
			id: 'close',
			chapter: 'choose',
			scene: 'journey',
			title: { es: 'Cuándo usar recursión', en: 'When to use recursion' },
			subtitles: close.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'p', dur: 400 },
					// The camera pulls back to reveal the tree of calls next to the loop.
					{ at: 300, do: 'camera', to: 'all', dur: 3000 },
					{ at: 600, do: 'exit', el: 'hl', dur: 400 },
					{ at: 1200, do: 'enter', el: 'cl-1' },
					{ at: 1900, do: 'pulse', el: 'lb-turns' },
					{ at: close.start(1), do: 'exit', el: 'cl-1', dur: 300 },
					{ at: close.start(1) + 600, do: 'enter', el: 'cl-2' },
					{ at: close.start(1) + 1200, do: 'pulse', el: 'lb-calls' },
					{ at: close.start(1) + 1800, do: 'pulse', el: 'lb-rep' },
					{ at: close.start(2), do: 'exit', el: 'cl-2', dur: 300 },
					{ at: close.start(2) + 600, do: 'enter', el: 'cl-3' },
					{ at: close.start(2) + 1400, do: 'pulse', el: 'tn-0' },
					{ at: close.start(2) + 2000, do: 'pulse', el: 'cl-3' },
				),
			},
		},
	],
};
