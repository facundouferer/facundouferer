import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Repeat while it holds": a short film (about two minutes) for the C lesson
// "While". It plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/bucle-while-c.astro`): the program on the left, and
// on the right each while loop as an isometric track. A gate (the condition)
// stands before the body and is asked before every pass; the body instructions
// are stations around the loop; the variables are cells whose value changes in
// place on each pass. Light blue is the execution flow and the values it carries,
// violet a check that lets it through, magenta the gate closing, the sentinel,
// the missing update and the off-by-one.
//
// Two programs of the lesson run here: the sentinel loop (`notas.c`), first with
// the sentinel alone (zero passes) and then with 8 6 10 -1, and the count from 1
// to 5 (`contar.c`), first without its update (an infinite loop) and then fixed.

const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

/**
 * Pins captions on the step timeline: each one starts once the previous has been
 * read (same formula as `subtitleReadingTime`, for the slower locale) plus a pause,
 * or later when `from` asks for it. Cues are placed relative to those starts.
 */
const readingMs = (sub: Subtitle) => 1200 + Math.max(sub.text.es.length, sub.text.en.length) * 55;
function timed(...items: (Subtitle | [number, Subtitle])[]) {
	let at = 0;
	const starts: number[] = [];
	const list = items.map((item) => {
		const [from, sub] = Array.isArray(item) ? item : [0, item];
		at = Math.max(at, from);
		starts.push(at);
		const placed: Subtitle = { ...sub, at };
		at += readingMs(sub) + 200;
		return placed;
	});
	return { list, start: (index: number) => starts[index] ?? 0 };
}

/** Cues in chronological order: later cues must be scheduled after the ones they override. */
type Cues = MotionCue | Cues[];
const seq = (...cues: Cues[]): MotionCue[] =>
	(cues.flat(4) as MotionCue[])
		.map((cue, index) => ({ cue, index }))
		.sort((a, b) => a.cue.at - b.cue.at || a.index - b.index)
		.map((entry) => entry.cue);

/** Camera cue that frames one of the `shot-*` anchors exactly (they carry their own zoom). */
const shot = (at: number, to: string, dur: number): MotionCue => ({ at, do: 'camera', to: [to], dur, pad: 0 });

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 450 }));

/**
 * Runs the instruction on editor line `line`: slides the bar to it, sends the
 * execution particle to its module and bumps the module. `prefix` picks the track:
 * `m` for notas.c (upper), `mb` for contar.c (lower).
 */
const run = (at: number, line: number, prefix: 'm' | 'mb' = 'm', travel = 700): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 450 },
	{ at, do: 'move', el: 'fx', to: `a-${prefix}${line}`, dur: travel },
	{ at: at + travel, do: 'pulse', el: `${prefix}-${line}` },
];

/** Carries a chip from where it rests to an anchor, then lets it vanish into what it changes. */
const carry = (at: number, el: string, to: string, dur: number): MotionCue[] => [
	{ at, do: 'enter', el, dur: 300 },
	{ at: at + 200, do: 'move', el, to, dur },
	{ at: at + 200 + dur, do: 'exit', el, dur: 300 },
];

/** Swaps the value shown on a cell: the old state leaves, the new one appears in place. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 300 },
	{ at: at + 100, do: 'enter', el: to, dur: 400 },
];

/**
 * One pass of the sentinel loop: the gate is asked (`ev` shows the check), line 10
 * adds the grade to the accumulator, line 11 adds 1 to the counter and line 12
 * reads the next grade into `nota`. The trace chip `tr` records the pass.
 */
type Pass = { ev: string; pk: string; sum: [string, string]; inc: string; count: [string, string]; read: string; grade: [string, string]; tr: string };
/** `s` scales the pass: 1 is the first, slow pass; later passes run faster. */
const pass = (t: number, p: Pass, s = 1, openGate = false): Cues[] => {
	const o = (ms: number) => t + Math.round(ms * s);
	const d = (ms: number) => Math.round(ms * s);
	return [
		run(o(0), 9, 'm', d(700)),
		{ at: o(600), do: 'enter', el: p.ev },
		openGate ? { at: o(800), do: 'enter', el: 'open-a' } : { at: o(800), do: 'pulse', el: 'open-a' },
		{ at: o(1900), do: 'exit', el: p.ev, dur: 300 },
		run(o(1500), 10, 'm', d(700)),
		carry(o(2100), p.pk, 'a-top-suma', d(800)),
		swap(o(3100), ...p.sum),
		run(o(3200), 11, 'm', d(700)),
		carry(o(3800), p.inc, 'a-top-cant', d(700)),
		swap(o(4700), ...p.count),
		run(o(4800), 12, 'm', d(700)),
		{ at: o(5200), do: 'move', el: p.read, to: 'a-top-nota', dur: d(1000) },
		{ at: o(6200), do: 'exit', el: p.read, dur: 300 },
		swap(o(6200), ...p.grade),
		{ at: o(6500), do: 'enter', el: p.tr },
	];
};
const FAST = 0.8;
const PASS_MS = Math.round(7000 * FAST);

/** One pass of the counting loop, update included: check, print, add 1 to `i`. */
const countPass = (t: number, k: number): Cues[] => [
	run(t, 6, 'mb', 550),
	{ at: t + 550, do: 'enter', el: `tk-${k}`, dur: 300 },
	run(t + 600, 7, 'mb', 400),
	{ at: t + 1000, do: 'type', el: `oc-${k}`, dur: 300 },
	run(t + 1100, 8, 'mb', 400),
	swap(t + 1500, `v-i-${k}`, `v-i-${k + 1}`),
];
const COUNT_MS = 1800;

// ─── Captions ───────────────────────────────────────────────────────────────
const track = timed(
	say(
		'`while` es una pista con una compuerta: la condición se evalúa antes de cada vuelta, o iteración.',
		'`while` is a track with a gate: the condition is evaluated before each pass, or iteration.',
	),
	say(
		'Si es verdadera, corre el bloque y vuelve; si es falsa, sigue tras la llave de cierre.',
		'If true, the block runs and comes back; if false, it goes on after the closing brace.',
	),
);
const zero = timed(
	say('Primera ejecución, con solo -1: la línea 8 lo lee y la compuerta pregunta `nota != -1`.', 'First run, with just -1: line 8 reads it and the gate asks `grade != -1`.'),
	say('Es falso desde el principio: el bloque no se ejecuta. Un `while` puede hacer cero vueltas.', 'It is false from the start: the block never runs. A `while` can make zero passes.'),
);
const ZCHECK = 4100;
const first = timed(
	say('Segunda ejecución, con 8 6 10 -1: la línea 8 deja el 8 en `nota`.', 'Second run, with 8 6 10 -1: line 8 leaves 8 in `grade`.'),
	say('`suma` es un acumulador: empieza en 0 y en cada vuelta junta una nota.', '`sum` is an accumulator: it starts at 0 and gathers one grade per pass.'),
	say('`cantidad` es un contador: empieza en 0 y suma 1 por vuelta.', '`count` is a counter: it starts at 0 and adds 1 per pass.'),
);
const laps = timed(
	say('Vuelta 2: `suma` pasa a 14 y `cantidad` a 2. Vuelta 3: 24 y 3.', 'Pass 2: `sum` becomes 14 and `count` 2. Pass 3: 24 and 3.'),
	say('La traza anota el valor de las variables en cada vuelta.', 'The trace records the value of the variables on every pass.'),
);
const sentinel = timed(
	say('Al final del bloque se lee -1, el centinela: la señal de fin, no un dato.', 'The end of the block reads -1, the sentinel: the signal to stop, not data.'),
	say('`-1 != -1` es falso: la compuerta se cierra y el centinela no se procesa.', '`-1 != -1` is false: the gate closes and the sentinel is not processed.'),
	say('Leer antes del ciclo y al final del bloque es la lectura adelantada.', 'Reading before the loop and at the end of the block is a priming read.'),
);
const infinite = timed(
	say('Otro programa cuenta de 1 a 5. Sin la actualización de la línea 8, `i` nunca cambia.', 'Another program counts from 1 to 5. Without the update on line 8, `i` never changes.'),
	say('`i <= 5` siempre es verdadero: la compuerta no se cierra. Es un ciclo infinito.', '`i <= 5` is always true: the gate never closes. It is an infinite loop.'),
	say('Se detiene con Ctrl+C: nada acerca el estado al final.', 'Stop it with Ctrl+C: nothing moves the state to the end.'),
);
const FINAL_CHECK = 1400 + 5 * COUNT_MS;
const counting = timed(
	say('Con `i = i + 1;` vuelve la actualización: el contador avanza en cada vuelta.', 'With `i = i + 1;` the update is back: the counter moves on every pass.'),
	[
		FINAL_CHECK - 1200,
		say(
			'La condición se evaluó seis veces para cinco vueltas. Al salir, `i` vale 6.',
			'The condition was evaluated six times for five passes. After the loop, `i` is 6.',
		),
	],
);
const boundary = timed(
	say('Con `i < 5` habría solo cuatro vueltas: es un error por uno.', 'With `i < 5` there would be only four passes: an off-by-one error.'),
	say('Para detectarlo, haz la traza de la primera y la última vuelta.', 'To catch it, trace the first and the last pass.'),
	say('Estado inicial, condición y actualización: si falta uno, falla.', 'Initial state, condition and update: miss one and it fails.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'gate', label: { es: 'La condición va primero', en: 'The condition comes first' } },
		{ id: 'zero', label: { es: 'Cero vueltas', en: 'Zero passes' } },
		{ id: 'laps', label: { es: 'Contador y acumulador', en: 'Counter and accumulator' } },
		{ id: 'sentinel', label: { es: 'El valor centinela', en: 'The sentinel value' } },
		{ id: 'infinite', label: { es: 'Un ciclo infinito', en: 'An infinite loop' } },
		{ id: 'boundary', label: { es: 'Errores por uno', en: 'Off-by-one errors' } },
	],
	steps: [
		// ─── Scene 1. The condition comes first ─────────────────────────────
		{
			id: 'track',
			chapter: 'gate',
			scene: 'journey',
			title: { es: 'La pista del ciclo', en: 'The loop track' },
			subtitles: track.list,
			motion: {
				cues: seq(
					shot(0, 'shot-a', 2400),
					{ at: 100, do: 'enter', el: 'plate-a' },
					{ at: 300, do: 'draw', el: 'trk-a', dur: 1600 },
					{ at: 900, do: 'enter', el: 'm-9' },
					{ at: 1300, do: 'enter', el: 'sign-a' },
					{ at: 1300, do: 'enter', el: 'm-10' },
					{ at: 1500, do: 'enter', el: 'm-11' },
					{ at: 1700, do: 'enter', el: 'm-12' },
					{ at: 1900, do: 'draw', el: 'in-a', dur: 700 },
					{ at: 2300, do: 'enter', el: 'm-8' },
					{ at: 2500, do: 'enter', el: 'stdin' },
					{ at: 2700, do: 'draw', el: 'out-a', dur: 800 },
					{ at: 3100, do: 'enter', el: 'm-14' },
					{ at: 3300, do: 'enter', el: 'm-15' },
					{ at: 3400, do: 'enter', el: 'm-17' },
					{ at: 3500, do: 'enter', el: 'c-nota' },
					{ at: 3650, do: 'enter', el: 'c-cant' },
					{ at: 3800, do: 'enter', el: 'c-suma' },
					{ at: 3900, do: 'enter', el: 'n-nota' },
					{ at: 4000, do: 'enter', el: 'n-cant' },
					{ at: 4100, do: 'enter', el: 'n-suma' },
					{ at: track.start(1), do: 'enter', el: 'fx' },
					{ at: track.start(1) + 300, do: 'pulse', el: 'sign-a' },
					{ at: track.start(1) + 700, do: 'enter', el: 'open-a' },
					{ at: track.start(1) + 1000, do: 'move', el: 'fx', to: 'a-m10', dur: 800 },
					{ at: track.start(1) + 1900, do: 'move', el: 'fx', to: 'a-m11', dur: 800 },
					{ at: track.start(1) + 2800, do: 'move', el: 'fx', to: 'a-m12', dur: 800 },
					{ at: track.start(1) + 3700, do: 'move', el: 'fx', to: 'a-m9', dur: 800 },
					{ at: track.start(1) + 4400, do: 'pulse', el: 'sign-a' },
					{ at: track.start(1) + 4500, do: 'exit', el: 'open-a', dur: 300 },
					{ at: track.start(1) + 4600, do: 'enter', el: 'shut-a' },
					{ at: track.start(1) + 4800, do: 'move', el: 'fx', to: 'a-m14', dur: 800 },
					{ at: track.start(1) + 5600, do: 'pulse', el: 'm-14' },
					{ at: track.start(1) + 6000, do: 'exit', el: 'shut-a' },
				),
			},
		},

		// ─── Scene 2. Zero passes ───────────────────────────────────────────
		{
			id: 'zero',
			chapter: 'zero',
			scene: 'journey',
			title: { es: 'Cuando la condición ya es falsa', en: 'When the condition is already false' },
			subtitles: zero.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'enter', el: 'hl' },
					{ at: 200, do: 'type', el: 'oa-1', dur: 1200 },
					{ at: 300, do: 'pulse', el: 'c-nota' },
					{ at: 700, do: 'move', el: 'hl', to: 'ln-5', dur: 400 },
					{ at: 900, do: 'pulse', el: 'c-cant' },
					{ at: 900, do: 'enter', el: 'v-cant-0' },
					{ at: 1300, do: 'move', el: 'hl', to: 'ln-6', dur: 400 },
					{ at: 1500, do: 'pulse', el: 'c-suma' },
					{ at: 1500, do: 'enter', el: 'v-suma-0' },
					{ at: 1700, do: 'enter', el: 'in-z' },
					run(2200, 8),
					{ at: 2600, do: 'move', el: 'in-z', to: 'a-top-nota', dur: 1100 },
					{ at: 3700, do: 'exit', el: 'in-z', dur: 300 },
					{ at: 3800, do: 'enter', el: 'v-nota-z' },
					run(ZCHECK, 9),
					{ at: ZCHECK + 700, do: 'enter', el: 'ev-a1' },
					{ at: ZCHECK + 900, do: 'enter', el: 'shut-a' },
					{ at: ZCHECK + 2200, do: 'pulse', el: 'ev-a1' },
					{ at: zero.start(1), do: 'exit', el: 'ev-a1', dur: 300 },
					{ at: zero.start(1) + 300, do: 'enter', el: 'lb-zero' },
					run(zero.start(1) + 600, 14),
					{ at: zero.start(1) + 1300, do: 'pulse', el: 'v-cant-0' },
					run(zero.start(1) + 1900, 17),
					{ at: zero.start(1) + 2700, do: 'type', el: 'oa-2', dur: 1000 },
				),
			},
		},

		// ─── Scene 3. Counter and accumulator ───────────────────────────────
		{
			id: 'first',
			chapter: 'laps',
			scene: 'journey',
			title: { es: 'La primera vuelta', en: 'The first pass' },
			subtitles: first.list,
			motion: {
				cues: seq(
					clear(0, 'lb-zero', 'shut-a', 'v-nota-z'),
					{ at: 200, do: 'type', el: 'oa-3', dur: 1400 },
					{ at: 600, do: 'pulse', el: 'v-cant-0' },
					{ at: 600, do: 'pulse', el: 'v-suma-0' },
					{ at: 800, do: 'enter', el: 'in-8' },
					{ at: 950, do: 'enter', el: 'in-6' },
					{ at: 1100, do: 'enter', el: 'in-10' },
					{ at: 1250, do: 'enter', el: 'in-m1' },
					run(1700, 8),
					{ at: 2100, do: 'move', el: 'in-8', to: 'a-top-nota', dur: 1100 },
					{ at: 3200, do: 'exit', el: 'in-8', dur: 300 },
					{ at: 3300, do: 'enter', el: 'v-nota-8' },
					pass(
						Math.max(first.start(1) - 600, 3800),
						{
							ev: 'ev-a2',
							pk: 'pk-8',
							sum: ['v-suma-0', 'v-suma-8'],
							inc: 'inc-1',
							count: ['v-cant-0', 'v-cant-1'],
							read: 'in-6',
							grade: ['v-nota-8', 'v-nota-6'],
							tr: 'tr-1',
						},
						1,
						true,
					),
				),
			},
		},
		{
			id: 'laps',
			chapter: 'laps',
			scene: 'journey',
			title: { es: 'La traza, vuelta a vuelta', en: 'The trace, pass by pass' },
			subtitles: laps.list,
			motion: {
				cues: seq(
					shot(0, 'shot-ring', 1800),
					pass(200, {
						ev: 'ev-a3',
						pk: 'pk-6',
						sum: ['v-suma-8', 'v-suma-14'],
						inc: 'inc-2',
						count: ['v-cant-1', 'v-cant-2'],
						read: 'in-10',
						grade: ['v-nota-6', 'v-nota-10'],
						tr: 'tr-2',
					}, FAST),
					pass(200 + PASS_MS, {
						ev: 'ev-a4',
						pk: 'pk-10',
						sum: ['v-suma-14', 'v-suma-24'],
						inc: 'inc-3',
						count: ['v-cant-2', 'v-cant-3'],
						read: 'in-m1',
						grade: ['v-nota-10', 'v-nota-s'],
						tr: 'tr-3',
					}, FAST),
				),
			},
		},

		// ─── Scene 4. The sentinel ──────────────────────────────────────────
		{
			id: 'sentinel',
			chapter: 'sentinel',
			scene: 'journey',
			title: { es: 'El valor centinela', en: 'The sentinel value' },
			subtitles: sentinel.list,
			motion: {
				cues: seq(
					{ at: 300, do: 'pulse', el: 'v-nota-s' },
					run(sentinel.start(1), 9),
					{ at: sentinel.start(1) + 700, do: 'enter', el: 'ev-a5' },
					{ at: sentinel.start(1) + 800, do: 'exit', el: 'open-a', dur: 300 },
					{ at: sentinel.start(1) + 900, do: 'enter', el: 'shut-a' },
					carry(sentinel.start(1) + 1100, 'sx', 'a-m9', 1200),
					{ at: sentinel.start(1) + 2500, do: 'pulse', el: 'shut-a' },
					{ at: sentinel.start(1) + 2700, do: 'enter', el: 'lb-sent' },
					{ at: sentinel.start(1) + 3300, do: 'pulse', el: 'v-suma-24' },
					shot(sentinel.start(2), 'shot-exit', 2000),
					clear(sentinel.start(2), 'ev-a5', 'lb-sent'),
					{ at: sentinel.start(2) + 300, do: 'enter', el: 'on-8' },
					{ at: sentinel.start(2) + 500, do: 'enter', el: 'on-12' },
					{ at: sentinel.start(2) + 800, do: 'enter', el: 'lb-prime' },
					run(sentinel.start(2) + 1800, 14),
					run(sentinel.start(2) + 2800, 15),
					{ at: sentinel.start(2) + 3600, do: 'type', el: 'oa-4', dur: 900 },
				),
			},
		},

		// ─── Scene 5. An infinite loop ──────────────────────────────────────
		{
			id: 'infinite',
			chapter: 'infinite',
			scene: 'journey',
			title: { es: 'Falta la actualización', en: 'The update is missing' },
			subtitles: infinite.list,
			motion: {
				cues: seq(
					shot(0, 'shot-b', 2600),
					clear(0, 'on-8', 'on-12', 'lb-prime', 'file-a', 'ed-a', 'oa-1', 'oa-2', 'oa-3', 'oa-4'),
					{ at: 500, do: 'enter', el: 'file-b' },
					{ at: 500, do: 'enter', el: 'ed-b' },
					{ at: 300, do: 'enter', el: 'plate-b' },
					{ at: 400, do: 'draw', el: 'trk-b', dur: 1500 },
					{ at: 700, do: 'enter', el: 'mb-6' },
					{ at: 900, do: 'move', el: 'hl', to: 'ln-4', dur: 500 },
					{ at: 1000, do: 'enter', el: 'sign-b' },
					{ at: 1200, do: 'enter', el: 'mb-7' },
					{ at: 1400, do: 'enter', el: 'gone-8' },
					{ at: 1500, do: 'enter', el: 'mark-8' },
					{ at: 1500, do: 'draw', el: 'in-b', dur: 600 },
					{ at: 1600, do: 'enter', el: 'c-i' },
					{ at: 1700, do: 'draw', el: 'out-b', dur: 600 },
					{ at: 1800, do: 'enter', el: 'n-i' },
					{ at: 1800, do: 'move', el: 'fx', to: 'a-top-i', dur: 1600 },
					{ at: 2000, do: 'enter', el: 'mb-11' },
					{ at: 2200, do: 'enter', el: 'v-i-1' },
					{ at: 2400, do: 'type', el: 'ob-1', dur: 900 },
					{ at: 3400, do: 'pulse', el: 'c-i' },
					// Three passes with no update: i stays 1 and the gate stays open.
					[0, 1, 2].map((k): Cues[] => {
						const t = infinite.start(1) - 1800 + k * 2600;
						const check: MotionCue[] =
							k === 0
								? [
										{ at: t + 700, do: 'enter', el: 'ev-b1' },
										{ at: t + 800, do: 'enter', el: 'open-b' },
									]
								: [{ at: t + 700, do: 'pulse', el: 'ev-b1' }];
						return [
							run(t, 6, 'mb', 700),
							check,
							run(t + 1000, 7, 'mb', 600),
							{ at: t + 1600, do: 'type', el: `oi-${k + 1}`, dur: 300 },
							{ at: t + 1800, do: 'move', el: 'hl', to: 'ln-9', dur: 400 },
							{ at: t + 1800, do: 'move', el: 'fx', to: 'a-mb8', dur: 600 },
							{ at: t + 2400, do: 'pulse', el: 'v-i-1' },
						];
					}),
					{ at: infinite.start(1) + 3500, do: 'enter', el: 'lb-same' },
					{ at: infinite.start(1) + 4000, do: 'enter', el: 'inf' },
					{ at: infinite.start(2) + 1500, do: 'type', el: 'oi-4', dur: 400 },
					{ at: infinite.start(2) + 2000, do: 'pulse', el: 'mark-8' },
				),
			},
		},

		// ─── Scene 6. Off-by-one errors ─────────────────────────────────────
		{
			id: 'count',
			chapter: 'boundary',
			scene: 'journey',
			title: { es: 'Seis preguntas, cinco vueltas', en: 'Six checks, five passes' },
			subtitles: counting.list,
			motion: {
				cues: seq(
					clear(0, 'mark-8', 'gone-8', 'lb-same', 'inf', 'ev-b1', 'oi-1', 'oi-2', 'oi-3', 'oi-4', 'ob-1'),
					{ at: 300, do: 'enter', el: 'mb-8' },
					{ at: 300, do: 'move', el: 'hl', to: 'ln-8', dur: 400 },
					{ at: 600, do: 'type', el: 'ob-2', dur: 800 },
					{ at: 900, do: 'pulse', el: 'mb-8' },
					[1, 2, 3, 4, 5].flatMap((k) => countPass(1400 + (k - 1) * COUNT_MS, k)),
					// The sixth check finds i = 6: the gate closes and the program goes on.
					run(FINAL_CHECK, 6, 'mb', 600),
					{ at: FINAL_CHECK + 600, do: 'enter', el: 'tk-6', dur: 300 },
					{ at: FINAL_CHECK + 700, do: 'exit', el: 'open-b', dur: 300 },
					{ at: FINAL_CHECK + 800, do: 'enter', el: 'shut-b' },
					run(FINAL_CHECK + 1500, 11, 'mb', 700),
					{ at: FINAL_CHECK + 2200, do: 'type', el: 'oc-6', dur: 900 },
					{ at: counting.start(1) + 3400, do: 'pulse', el: 'v-i-6' },
				),
			},
		},
		{
			id: 'off-by-one',
			chapter: 'boundary',
			scene: 'journey',
			title: { es: 'Un error por uno', en: 'An off-by-one error' },
			subtitles: boundary.list,
			motion: {
				cues: seq(
					shot(0, 'shot-b-gate', 2000),
					{ at: 300, do: 'move', el: 'hl', to: 'ln-6', dur: 400 },
					{ at: 400, do: 'exit', el: 'sign-b', dur: 300 },
					{ at: 600, do: 'enter', el: 'sign-lt' },
					{ at: 1300, do: 'pulse', el: 'sign-lt' },
					{ at: 1500, do: 'enter', el: 'lb-four' },
					{ at: 2300, do: 'pulse', el: 'oc-5' },
					clear(boundary.start(1), 'lb-four', 'sign-lt'),
					{ at: boundary.start(1) + 300, do: 'enter', el: 'sign-b' },
					{ at: boundary.start(1) + 600, do: 'enter', el: 'lb-first' },
					{ at: boundary.start(1) + 800, do: 'pulse', el: 'tk-1' },
					{ at: boundary.start(1) + 1300, do: 'enter', el: 'lb-last' },
					{ at: boundary.start(1) + 1500, do: 'pulse', el: 'tk-5' },
					{ at: boundary.start(1) + 2200, do: 'enter', el: 'lb-rule' },
					// The camera pulls back to reveal both loops.
					{ at: boundary.start(2) + 200, do: 'camera', to: 'all', dur: 3200 },
					{ at: boundary.start(2) + 600, do: 'flow', el: 'trk-a' },
					{ at: boundary.start(2) + 700, do: 'flow', el: 'trk-b' },
					{ at: boundary.start(2) + 1800, do: 'pulse', el: 'c-i' },
					{ at: boundary.start(2) + 2400, do: 'pulse', el: 'sign-b' },
					{ at: boundary.start(2) + 3000, do: 'pulse', el: 'c-suma' },
				),
			},
		},
	],
};
