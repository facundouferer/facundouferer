import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The three parts of for": a short film (about two minutes) for the C lesson "For"
// (`sentencia-for`). It plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/bucle-for-c.astro`): the loop drawn as an isometric track
// with three stations taken from the header (initialization before the entrance, the
// condition as the gate, the update after the body), a light blue particle that is the
// execution flow and one cell, `i`, born at the entrance and gone at the exit. The
// lesson's program is drawn inside the canvas (an editor whose bar slides to the running
// line), so every step is a motion step and the cues keep both halves in sync.

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

/** The particle and the editor bar travel together: the particle to a station, the bar to its line. */
const runTo = (at: number, anchor: string, line: number, dur = 700): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: anchor, dur },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 500) },
];

/** The cell `i` shows one value at a time: the old one leaves, the new one lands. */
const setValue = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: `v-${from}`, dur: 200 },
	{ at: at + 150, do: 'enter', el: `v-${to}`, dur: 300 },
	{ at: at + 150, do: 'pulse', el: 'c-i', dur: 400 },
];

/** `i` is born at the entrance: the cell appears with its first value. */
const birth = (at: number, value: string): MotionCue[] => [
	{ at, do: 'enter', el: 'c-i', dur: 500 },
	{ at: at + 200, do: 'enter', el: `v-${value}`, dur: 300 },
];

/** `i` leaves with its scope: the cell and its last value go. */
const death = (at: number, value: string): MotionCue[] => [
	{ at, do: 'exit', el: `v-${value}`, dur: 300 },
	{ at, do: 'exit', el: 'c-i', dur: 500 },
];

type Loop = { head: number; body: number; exit: number };
const L1: Loop = { head: 5, body: 6, exit: 8 };
const L2: Loop = { head: 9, body: 10, exit: 12 };
const L3: Loop = { head: 13, body: 14, exit: 16 };
const L4: Loop = { head: 18, body: 19, exit: 21 };

type LapOptions = {
	/** Time scale of one pass (1 = about two seconds). */
	speed?: number;
	/** `for (...);`: the pass goes through the empty statement and skips the block. */
	empty?: boolean;
	/** `i-- > 0`: the value changes when the condition is checked, not at the update. */
	inCondition?: boolean;
};

/**
 * Passes of a loop, with the particle waiting at the gate. `values` lists what `i`
 * holds at each check of the condition; every check but the last is true. Returns
 * the cues and the moment the particle is back at the gate for the last check.
 */
function laps(t0: number, loop: Loop, values: string[], options: LapOptions = {}) {
	const k = options.speed ?? 1;
	const ms = (value: number) => Math.round(value * k);
	const cues: MotionCue[] = [];
	let t = t0;
	for (let j = 0; j < values.length - 1; j++) {
		const [now, next] = [values[j], values[j + 1]];
		cues.push({ at: t, do: 'pulse', el: `mc-${loop.head}`, dur: 400 });
		if (options.inCondition) cues.push(...setValue(t, now, next));
		if (options.empty) {
			cues.push({ at: t, do: 'move', el: 'p', to: 'a-semi', dur: ms(550) });
			cues.push({ at: t + ms(550), do: 'pulse', el: 'semi', dur: 400 });
		} else {
			cues.push(...runTo(t, 'a-body', loop.body, ms(550)));
			cues.push({ at: t + ms(550), do: 'pulse', el: `mb-${loop.body}`, dur: 400 });
		}
		cues.push(...runTo(t + ms(650), 'a-upd', loop.head, ms(500)));
		cues.push({ at: t + ms(1150), do: 'pulse', el: `mu-${loop.head}`, dur: 400 });
		if (!options.inCondition) cues.push(...setValue(t + ms(1150), now, next));
		cues.push({ at: t + ms(1250), do: 'move', el: 'p', to: 'a-front', dur: ms(400) });
		cues.push({ at: t + ms(1650), do: 'move', el: 'p', to: 'a-cond', dur: ms(400) });
		t += ms(2050);
	}
	return { cues, end: t };
}

/** A loop from its entrance: the bar on the header, `i` born, the particle at the gate. */
function enterLoop(t0: number, loop: Loop, first: string) {
	const cues: MotionCue[] = [
		...runTo(t0, 'a-init', loop.head, 700),
		{ at: t0 + 700, do: 'enter', el: `oi-${loop.head}`, dur: 300 },
		{ at: t0 + 700, do: 'pulse', el: `mi-${loop.head}`, dur: 400 },
		...birth(t0 + 800, first),
		{ at: t0 + 1300, do: 'exit', el: `oi-${loop.head}`, dur: 300 },
		{ at: t0 + 1300, do: 'move', el: 'p', to: 'a-cond', dur: 500 },
	];
	return { cues, end: t0 + 1800 };
}

const VALUES_UP = ['0', '1', '2', '3', '4', '5'];

// ─── Captions ───────────────────────────────────────────────────────────────
const build = timed(
	say('El `for` reúne en su encabezado las tres partes de un ciclo.', 'A `for` gathers the three parts of a loop in its header.'),
	say('`int i = 0` corre una sola vez, al comienzo.', '`int i = 0` runs only once, at the start.'),
	say('La condición, antes de cada vuelta; `i++`, al final de cada vuelta.', 'The condition, before each pass; `i++`, at the end of each pass.'),
);
const run = timed(
	say('Nace `i` en 0. `0 < 5` es verdadera y la línea 6 imprime 0.', '`i` is born at 0. `0 < 5` is true and line 6 prints 0.'),
	say('Luego `i++` la deja en 1, y así hasta imprimir 4.', 'Then `i++` makes it 1, and so on until it prints 4.'),
	say('`5 < 5` es falsa: cinco vueltas, seis evaluaciones.', '`5 < 5` is false: five passes, six checks.'),
);
const scope = timed(
	say('`i` nace en el encabezado: su alcance es el encabezado y el cuerpo.', '`i` is born in the header: its scope is the header and the body.'),
	say('Al salir del ciclo, deja de existir. Si necesitas el valor final, declara la variable antes del `for`.', 'When the loop ends, it no longer exists. If you need the final value, declare the variable before the `for`.'),
);
const asWhile = timed(
	say('Todo `for` puede escribirse como `while`: la inicialización va antes,', 'Every `for` can be written as a `while`: the initialization goes before it,'),
	say('la condición, en el `while`; la actualización, al final del cuerpo.', 'the condition, in the `while`; the update at the end of the body.'),
);
const count = timed(
	say('Cada `for` declara su propia `i`. La línea 9 cuenta hacia abajo con `i--`.', 'Each `for` declares its own `i`. Line 9 counts down with `i--`.'),
	say('La línea 13 cuenta de a pasos: `i += 5`.', 'Line 13 counts by steps: `i += 5`.'),
	say('La condición tiene que ser coherente con la actualización.', 'The condition has to be consistent with the update.'),
);
const semicolon = timed(
	say('Un `;` después del paréntesis es el cuerpo: la instrucción vacía.', 'A `;` after the parenthesis is the body: the empty statement.'),
	say('Cinco vueltas vacías; el bloque va después, una sola vez.', 'Five empty passes; the block comes after, only once.'),
	say('Y ahí `i` ya no existe: el compilador lo rechaza.', 'And there `i` no longer exists: the compiler rejects it.'),
);
const offByOne = timed(
	say('Con `i <= 5` en vez de `i < 5`, el ciclo da una vuelta de más.', 'With `i <= 5` instead of `i < 5`, the loop makes one extra pass.'),
	say('Imprime de 0 a 5: es el error por uno más frecuente.', 'It prints 0 to 5: the most common off-by-one error.'),
);
const wrap = timed(
	say('`size_t` no tiene valores negativos; baja con `i >= 0`.', '`size_t` has no negative values; it goes down with `i >= 0`.'),
	say('Tras mostrar 0, `i--` da la vuelta al valor máximo, `SIZE_MAX`.', 'After printing 0, `i--` wraps around to the maximum value, `SIZE_MAX`.'),
	say('`i >= 0` es siempre verdadera: nunca termina.', '`i >= 0` is always true: it never ends.'),
);
const close = timed(
	say('La corrección: `i-- > 0` compara el valor anterior y después lo decrementa.', 'The fix: `i-- > 0` compares the previous value and then decrements it.'),
	say('El cuerpo ve 2, 1 y 0.', 'The body sees 2, 1 and 0.'),
	say('Inicialización una vez, condición antes, actualización al final.', 'Initialization once, condition before, update at the end.'),
);

// ─── Timelines that depend on the passes ───────────────────────────────────
const runLoop = enterLoop(0, L1, '0');
const runLaps = laps(runLoop.end, L1, VALUES_UP, { speed: 0.72 });

const down = enterLoop(300, L2, '5');
const downLaps = laps(down.end, L2, ['5', '4', '3', '2', '1', '0'], { speed: 0.3 });
const STEPS_AT = Math.max(count.start(1), downLaps.end + 1100);
const by5 = enterLoop(STEPS_AT, L3, '0');
const by5Laps = laps(by5.end, L3, ['0', '5', '10', '15', '20', '25'], { speed: 0.3 });

const emptyLoop = enterLoop(semicolon.start(1), L1, '0');
const emptyLaps = laps(emptyLoop.end, L1, VALUES_UP, { speed: 0.3, empty: true });
const BLOCK_AT = emptyLaps.end + 200;

const extraLoop = enterLoop(900, L1, '0');
const extraLaps = laps(extraLoop.end, L1, [...VALUES_UP, '6'], { speed: 0.42 });

const wrapLoop = enterLoop(wrap.start(0) + 3200, L4, '3');
const wrapLaps = laps(wrapLoop.end, L4, ['3', '2', '1', '0', 'max'], { speed: 0.5 });
const MAX_AT = wrapLaps.end - Math.round(2050 * 0.5) + Math.round(1150 * 0.5);

const fixLoop = enterLoop(1100, L4, '3');
const fixLaps = laps(fixLoop.end, L4, ['3', '2', '1', '0'], { speed: 0.5, inCondition: true });
const PULLBACK_AT = Math.max(close.start(2), fixLaps.end + 2200);

export const script: AnimationScript = {
	chapters: [
		{ id: 'stations', label: { es: 'Tres estaciones', en: 'Three stations' } },
		{ id: 'scope', label: { es: 'Dónde vive el contador', en: 'Where the counter lives' } },
		{ id: 'while', label: { es: 'El mismo ciclo, como while', en: 'The same loop, as a while' } },
		{ id: 'steps', label: { es: 'Hacia abajo y de a pasos', en: 'Down and by steps' } },
		{ id: 'mistakes', label: { es: 'Dos errores clásicos', en: 'Two classic mistakes' } },
		{ id: 'unsigned', label: { es: 'Un contador sin signo', en: 'An unsigned counter' } },
	],
	steps: [
		// ─── Scene 1. Three stations ────────────────────────────────────────
		{
			id: 'build',
			chapter: 'stations',
			scene: 'journey',
			title: { es: 'El encabezado: tres partes', en: 'The header: three parts' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-track', 4000),
					{ at: 100, do: 'enter', el: 'track', dur: 900 },
					{ at: 900, do: 'enter', el: 'set-1', dur: 700 },
					{ at: 1300, do: 'enter', el: 'm-22', dur: 500 },
					{ at: build.start(1), do: 'enter', el: 'hl' },
					shot(build.start(1), 'shot-head', 1800),
					{ at: build.start(1) + 600, do: 'draw', el: 'ul-init', dur: 700 },
					{ at: build.start(1) + 900, do: 'pulse', el: 'mi-5' },
					{ at: build.start(1) + 1200, do: 'enter', el: 'r-init' },
					shot(build.start(2), 'shot-track', 1800),
					{ at: build.start(2) + 200, do: 'draw', el: 'ul-cond', dur: 700 },
					{ at: build.start(2) + 500, do: 'pulse', el: 'mc-5' },
					{ at: build.start(2) + 700, do: 'enter', el: 'r-cond' },
					{ at: build.start(2) + 2200, do: 'draw', el: 'ul-upd', dur: 700 },
					{ at: build.start(2) + 2500, do: 'pulse', el: 'mu-5' },
					{ at: build.start(2) + 2700, do: 'enter', el: 'r-upd' },
				),
			},
		},
		{
			id: 'laps',
			chapter: 'stations',
			scene: 'journey',
			title: { es: 'Vuelta tras vuelta', en: 'Pass after pass' },
			subtitles: run.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'enter', el: 'p', dur: 400 },
					runLoop.cues,
					runLaps.cues,
					{ at: runLoop.end, do: 'type', el: 'out-1', dur: runLaps.end - runLoop.end },
					{ at: runLaps.end, do: 'pulse', el: 'mc-5' },
					{ at: runLaps.end + 200, do: 'enter', el: 'f-5' },
					{ at: runLaps.end + 900, do: 'enter', el: 'tally-5' },
				),
			},
		},

		// ─── Scene 2. Where the counter lives ───────────────────────────────
		{
			id: 'scope',
			chapter: 'scope',
			scene: 'journey',
			title: { es: 'El alcance de la variable del for', en: 'The scope of the loop variable' },
			subtitles: scope.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'r-init', dur: 400 },
					{ at: 0, do: 'exit', el: 'r-cond', dur: 400 },
					{ at: 0, do: 'exit', el: 'r-upd', dur: 400 },
					{ at: 0, do: 'exit', el: 'f-5', dur: 400 },
					{ at: 0, do: 'exit', el: 'tally-5', dur: 400 },
					shot(200, 'shot-track', 1600),
					{ at: 600, do: 'enter', el: 'zone', dur: 800 },
					{ at: 900, do: 'draw', el: 'sc-i', dur: 900 },
					{ at: 1600, do: 'enter', el: 'lb-scope' },
					{ at: 2400, do: 'pulse', el: 'c-i' },
					shot(scope.start(1), 'shot-exit', 1800),
					...runTo(scope.start(1) + 200, 'a-exit', 8, 1000),
					...death(scope.start(1) + 700, '5'),
					{ at: scope.start(1) + 1200, do: 'enter', el: 'ox-8', dur: 300 },
					{ at: scope.start(1) + 1200, do: 'pulse', el: 'mx-8' },
					{ at: scope.start(1) + 1600, do: 'enter', el: 'no-i' },
					shot(scope.start(1) + 3400, 'shot-track', 1800),
					{ at: scope.start(1) + 3800, do: 'enter', el: 'lb-before' },
					{ at: scope.start(1) + 4600, do: 'pulse', el: 'lb-before' },
				),
			},
		},

		// ─── Scene 3. The same loop, as a while ─────────────────────────────
		{
			id: 'while',
			chapter: 'while',
			scene: 'journey',
			title: { es: 'for y while: la misma idea', en: 'for and while: the same idea' },
			subtitles: asWhile.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'no-i', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-scope', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-before', dur: 400 },
					{ at: 0, do: 'exit', el: 'ox-8', dur: 400 },
					{ at: 0, do: 'exit', el: 'sc-i', dur: 400 },
					...runTo(200, 'a-init', 5, 900),
					shot(200, 'shot-track', 1800),
					{ at: 1100, do: 'pulse', el: 'mi-5' },
					{ at: 1300, do: 'enter', el: 'w-init' },
					{ at: asWhile.start(1) + 200, do: 'pulse', el: 'mc-5' },
					{ at: asWhile.start(1) + 400, do: 'enter', el: 'w-cond' },
					{ at: asWhile.start(1) + 1800, do: 'pulse', el: 'mu-5' },
					{ at: asWhile.start(1) + 2000, do: 'enter', el: 'w-upd' },
					{ at: asWhile.start(1) + 3200, do: 'pulse', el: 'zone' },
					{ at: asWhile.start(1) + 3500, do: 'enter', el: 'w-brace' },
				),
			},
		},

		// ─── Scene 4. Down and by steps ─────────────────────────────────────
		{
			id: 'count',
			chapter: 'steps',
			scene: 'journey',
			title: { es: 'Contar hacia abajo y de a pasos', en: 'Counting down and by steps' },
			subtitles: count.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'w-init', dur: 400 },
					{ at: 0, do: 'exit', el: 'w-cond', dur: 400 },
					{ at: 0, do: 'exit', el: 'w-upd', dur: 400 },
					{ at: 0, do: 'exit', el: 'w-brace', dur: 400 },
					{ at: 0, do: 'exit', el: 'zone', dur: 400 },
					{ at: 0, do: 'exit', el: 'set-1', dur: 400 },
					{ at: 200, do: 'enter', el: 'set-2', dur: 500 },
					down.cues,
					downLaps.cues,
					{ at: down.end, do: 'type', el: 'out-2', dur: downLaps.end - down.end },
					...runTo(downLaps.end + 100, 'a-exit', 12, 700),
					...death(downLaps.end + 300, '0'),
					{ at: downLaps.end + 800, do: 'pulse', el: 'mx-12' },
					{ at: STEPS_AT - 600, do: 'exit', el: 'set-2', dur: 400 },
					{ at: STEPS_AT - 300, do: 'enter', el: 'set-3', dur: 500 },
					by5.cues,
					by5Laps.cues,
					{ at: by5.end, do: 'type', el: 'out-3', dur: by5Laps.end - by5.end },
					...runTo(by5Laps.end + 100, 'a-exit', 16, 700),
					...death(by5Laps.end + 300, '25'),
					{ at: by5Laps.end + 800, do: 'pulse', el: 'mx-16' },
				),
			},
		},

		// ─── Scene 5. Two classic mistakes ──────────────────────────────────
		{
			id: 'semicolon',
			chapter: 'mistakes',
			scene: 'journey',
			title: { es: 'Un ; después del paréntesis', en: 'A ; after the parenthesis' },
			subtitles: semicolon.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'set-3', dur: 400 },
					{ at: 300, do: 'enter', el: 'set-1', dur: 500 },
					...runTo(200, 'a-init', 5, 900),
					shot(200, 'shot-track', 1600),
					{ at: 1100, do: 'exit', el: 'code-5', dur: 300 },
					{ at: 1300, do: 'enter', el: 'alt-5s', dur: 300 },
					{ at: 1300, do: 'enter', el: 'hx-5', dur: 400 },
					{ at: 1900, do: 'enter', el: 'semi' },
					{ at: 2600, do: 'pulse', el: 'semi' },
					emptyLoop.cues,
					emptyLaps.cues,
					{ at: emptyLaps.end, do: 'pulse', el: 'mc-5' },
					...death(emptyLaps.end + 100, '5'),
					...runTo(BLOCK_AT, 'a-body', 6, 800),
					{ at: BLOCK_AT + 800, do: 'enter', el: 'ob-6', dur: 300 },
					{ at: BLOCK_AT + 800, do: 'pulse', el: 'mb-6' },
					{ at: Math.max(semicolon.start(2), BLOCK_AT + 1200), do: 'enter', el: 'no-i2' },
					{ at: Math.max(semicolon.start(2), BLOCK_AT + 1200) + 400, do: 'type', el: 'err-1', dur: 1200 },
				),
			},
		},
		{
			id: 'offbyone',
			chapter: 'mistakes',
			scene: 'journey',
			title: { es: '<= contra <', en: '<= versus <' },
			subtitles: offByOne.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'semi', dur: 400 },
					{ at: 0, do: 'exit', el: 'no-i2', dur: 400 },
					{ at: 0, do: 'exit', el: 'err-1', dur: 400 },
					{ at: 0, do: 'exit', el: 'ob-6', dur: 400 },
					{ at: 0, do: 'exit', el: 'alt-5s', dur: 300 },
					{ at: 200, do: 'exit', el: 'pc-1', dur: 300 },
					{ at: 300, do: 'enter', el: 'alt-5o', dur: 300 },
					{ at: 500, do: 'enter', el: 'pc-1o' },
					{ at: 600, do: 'pulse', el: 'hx-5' },
					extraLoop.cues,
					extraLaps.cues,
					{ at: extraLoop.end, do: 'type', el: 'out-obo', dur: extraLaps.end - extraLoop.end },
					{ at: extraLaps.end, do: 'pulse', el: 'mc-5' },
					{ at: extraLaps.end + 300, do: 'enter', el: 'tally-6' },
					...death(extraLaps.end + 600, '6'),
				),
			},
		},

		// ─── Scene 6. An unsigned counter ───────────────────────────────────
		{
			id: 'wrap',
			chapter: 'unsigned',
			scene: 'journey',
			title: { es: 'size_t da la vuelta', en: 'size_t wraps around' },
			subtitles: wrap.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'tally-6', dur: 400 },
					{ at: 0, do: 'exit', el: 'out-obo', dur: 400 },
					{ at: 0, do: 'exit', el: 'alt-5o', dur: 300 },
					{ at: 0, do: 'exit', el: 'hx-5', dur: 300 },
					{ at: 0, do: 'exit', el: 'pc-1o', dur: 300 },
					{ at: 300, do: 'enter', el: 'code-5', dur: 300 },
					{ at: 300, do: 'enter', el: 'pc-1', dur: 300 },
					{ at: 600, do: 'exit', el: 'set-1', dur: 400 },
					{ at: 900, do: 'enter', el: 'set-4', dur: 500 },
					shot(600, 'shot-track', 1600),
					{ at: 1000, do: 'exit', el: 'code-18', dur: 300 },
					{ at: 1200, do: 'enter', el: 'alt-18', dur: 300 },
					{ at: 1200, do: 'enter', el: 'hx-18', dur: 400 },
					...runTo(1000, 'a-decl', 17, 1000),
					{ at: 2000, do: 'enter', el: 'o-17', dur: 300 },
					{ at: 2000, do: 'pulse', el: 'm-17' },
					{ at: 2300, do: 'enter', el: 'lb-sizet' },
					{ at: 3100, do: 'exit', el: 'o-17', dur: 300 },
					wrapLoop.cues,
					wrapLaps.cues,
					{ at: wrapLoop.end, do: 'type', el: 'out-wrap', dur: wrapLaps.end - wrapLoop.end + 1500 },
					{ at: MAX_AT + 300, do: 'enter', el: 'lb-max' },
					{ at: wrapLaps.end, do: 'pulse', el: 'mc-18' },
					{ at: wrapLaps.end + 300, do: 'enter', el: 'true-max' },
					{ at: wrapLaps.end + 600, do: 'enter', el: 'loop-x', dur: 600 },
					{ at: wrapLaps.end + 800, do: 'flow', el: 'loop-x' },
					{ at: wrapLaps.end + 1200, do: 'pulse', el: 'true-max' },
				),
			},
		},
		{
			id: 'close',
			chapter: 'unsigned',
			scene: 'journey',
			title: { es: 'La cuenta regresiva correcta', en: 'The correct countdown' },
			subtitles: close.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'loop-x', dur: 400 },
					{ at: 0, do: 'exit', el: 'true-max', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-max', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-sizet', dur: 400 },
					{ at: 0, do: 'exit', el: 'out-wrap', dur: 400 },
					{ at: 0, do: 'exit', el: 'hx-18', dur: 300 },
					{ at: 0, do: 'exit', el: 'alt-18', dur: 300 },
					...death(0, 'max'),
					{ at: 300, do: 'exit', el: 'pc-4b', dur: 300 },
					{ at: 300, do: 'exit', el: 'pu-4b', dur: 300 },
					{ at: 400, do: 'enter', el: 'code-18', dur: 300 },
					{ at: 400, do: 'enter', el: 'hv-18', dur: 400 },
					{ at: 600, do: 'enter', el: 'pc-4f' },
					{ at: 600, do: 'enter', el: 'pu-4f' },
					{ at: 900, do: 'pulse', el: 'pc-4f' },
					fixLoop.cues,
					fixLaps.cues,
					{ at: fixLoop.end, do: 'type', el: 'out-4', dur: fixLaps.end - fixLoop.end },
					{ at: fixLaps.end, do: 'pulse', el: 'mc-18' },
					...death(fixLaps.end + 200, '0'),
					...runTo(fixLaps.end + 300, 'a-exit', 21, 700),
					{ at: fixLaps.end + 1000, do: 'pulse', el: 'mx-21' },
					...runTo(fixLaps.end + 1200, 'a-ret', 22, 700),
					{ at: fixLaps.end + 1900, do: 'enter', el: 'o-22', dur: 300 },
					{ at: fixLaps.end + 1900, do: 'pulse', el: 'm-22' },
					// The camera pulls back to reveal the whole track and its three stations.
					{ at: PULLBACK_AT, do: 'camera', to: 'all', dur: 3000 },
					{ at: PULLBACK_AT + 600, do: 'enter', el: 'r-init' },
					{ at: PULLBACK_AT + 1100, do: 'enter', el: 'r-cond' },
					{ at: PULLBACK_AT + 1600, do: 'enter', el: 'r-upd' },
					{ at: PULLBACK_AT + 2400, do: 'exit', el: 'hl', dur: 400 },
					{ at: PULLBACK_AT + 2800, do: 'pulse', el: 'track' },
				),
			},
		},
	],
};
