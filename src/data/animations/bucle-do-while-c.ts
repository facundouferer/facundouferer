import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Do first, ask later": a short film (about two minutes) for the C lesson
// "Do-While" (order: 13). It plays on a single persistent canvas
// (`data-scene="dowhile"` in `src/components/animaciones/bucle-do-while-c.astro`):
// the program on the left, and on the right every loop is a track whose gate (the
// condition) stands AFTER the body, so the execution particle always crosses the
// body once before it is asked anything. Four tracks, one per program of the
// lesson: the body that runs once (and the `while` that would not), the input
// validation that asks again while the value is invalid, the menu where `break`
// only ends the `switch`, and the loop where `continue` jumps to the condition and
// `break` leaves the track (with a small `for` track to compare where `continue`
// lands there). Magenta marks the problem or the exceptional jump (invalid input,
// `continue`, `break`, the variable the condition cannot see); violet marks the
// gate that decides.

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

/** Fades several elements in or out at the same moment. */
const show = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'enter' as const, el }));
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/** Builds the modules of a track one after another. */
const build = (at: number, ...mods: string[]): MotionCue[] =>
	mods.map((mod, index) => ({ at: at + index * 90, do: 'enter' as const, el: `m-${mod}` }));

/**
 * Runs the module `mod` (track letter + editor line, e.g. `b8`): the bar slides to
 * its line, the particle travels to it and the module pulses when it arrives.
 */
const go = (at: number, mod: string, dur = 520): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${mod.slice(1)}`, dur: Math.min(dur, 450) },
	{ at, do: 'move', el: 'p', to: `a-${mod}`, dur },
	{ at: at + dur, do: 'pulse', el: `m-${mod}`, dur: 500 },
];

/** Runs several modules in a row, `gap` ms apart. */
const walk = (at: number, mods: string[], gap = 600): MotionCue[] =>
	mods.flatMap((mod, index) => go(at + index * gap, mod, gap - 80));

/** The particle glides to an anchor (a stop on a jump or on the way back). */
const hop = (at: number, to: string, dur = 380): MotionCue => ({ at, do: 'move', el: 'p', to, dur });

/** Back from the gate to the start of the body, along the return arc of track `t`. */
const loop = (at: number, t: string): MotionCue[] => [hop(at, `a-${t}-r1`), hop(at + 400, `a-${t}-r2`)];

/** A token glides from where it is to `to`. */
const glide = (at: number, el: string, to: string, dur = 600): MotionCue => ({ at, do: 'move', el, to, dur });

/** One value replaces another inside a plate. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 250 },
	{ at: at + 150, do: 'enter', el: to },
];

/** Moves the particle to the entry of another track while it is hidden. */
const teleport = (at: number, t: string): MotionCue[] => [
	{ at, do: 'exit', el: 'p', dur: 300 },
	{ at: at + 320, do: 'move', el: 'p', to: `a-${t}-in`, dur: 80 },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const once = timed(
	say(
		'En `do-while`, la puerta de la condición está al final, tras el cuerpo.',
		"In `do-while`, the condition's gate sits at the end, after the body.",
	),
	say(
		'El cuerpo muestra `El número es 10`; luego `numero < 5` es falso y sale.',
		'The body prints `The number is 10`; then `number < 5` is false, it leaves.',
	),
);
const before = timed(
	say(
		'Un `while` pone la puerta antes: con la misma condición, no muestra nada.',
		'A `while` puts the gate first: with the same condition, it prints nothing.',
	),
	say(
		'`while` puede dar cero vueltas; `do-while`, al menos una vez.',
		'`while` may make zero passes; `do-while` runs at least once.',
	),
);
const validate = timed(
	say(
		'Pedir un dato ocurre siempre una vez: es el molde natural de `do-while`.',
		'Asking for a value always happens once: the natural shape of `do-while`.',
	),
	say(
		'Llega `abc`: `scanf` no lee un número y `leidos` vale 0.',
		'`abc` arrives: `scanf` reads no number, so `items_read` is 0.',
	),
	say(
		'`getchar` descarta la línea: si no, `scanf` fallaría siempre.',
		'`getchar` discards the line, or `scanf` would fail forever.',
	),
);
const retry = timed(
	say(
		'Se repite mientras sea inválido: con `abc` o 150, otra vuelta.',
		'It repeats while invalid: with `abc` or 150, another pass.',
	),
	say(
		'Con 30 la condición es falsa: el ciclo termina y muestra la edad.',
		'With 30 the condition is false: the loop ends and prints the age.',
	),
);
const scope = timed(
	say(
		'El `while (...)` está después de la llave de cierre, fuera del bloque.',
		'The `while (...)` comes after the closing brace, outside the block.',
	),
	say(
		'No ve `c`, declarada dentro: `edad` y `leidos` van antes del `do`.',
		'It cannot see `c`, declared inside: `age` and `items_read` go before `do`.',
	),
);
const menu = timed(
	say(
		'Un menú se muestra al menos una vez y se repite hasta elegir salir.',
		'A menu is shown at least once and repeats until the user quits.',
	),
	say(
		'Cada `break` termina el `switch`, no el ciclo: el flujo sigue a la puerta.',
		'Each `break` ends the `switch`, not the loop: the flow goes on to the gate.',
	),
	say(
		'Lo que termina el menú es la condición `opcion != 0`.',
		'What ends the menu is the condition `option != 0`.',
	),
);
const jumps = timed(
	say(
		'Con `i` en 2, `continue` salta el resto y va a la condición.',
		'With `i` at 2, `continue` skips the rest and goes to the condition.',
	),
	say(
		'Con `i` en 5, `break` sale del ciclo y sigue después de él.',
		'With `i` at 5, `break` leaves the loop and goes on after it.',
	),
	say(
		'Muestra `1 3 4 | i = 5`; con `i++` primero, no hay ciclo infinito.',
		'It prints `1 3 4 | i = 5`; with `i++` first, there is no infinite loop.',
	),
);
const forjump = timed(
	say(
		'En un `for`, `continue` salta a la actualización y después a la condición.',
		'In a `for`, `continue` jumps to the update, then to the condition.',
	),
	say(
		'En `while` y `do-while`, la actualización tras `continue` se salta.',
		'In `while` and `do-while`, an update after `continue` is skipped.',
	),
);
const recap = timed(
	say(
		'`do-while` ejecuta el cuerpo y después pregunta: al menos una vez.',
		'`do-while` runs the body and then asks: at least once.',
	),
	say(
		'`break` sale del ciclo más interno; `continue` salta a la condición.',
		'`break` leaves the innermost loop; `continue` jumps to the condition.',
	),
);

// ─── Scene timings that depend on the captions ──────────────────────────────
const V1 = validate.start(1);
const V2 = validate.start(2);
const R1 = retry.start(1);
const S1 = scope.start(1);
const M1 = menu.start(1);
const M2 = menu.start(2);
const J1 = Math.max(jumps.start(1), 7000);
const J2 = Math.max(jumps.start(1), J1 + 5200);
const F1 = forjump.start(1);
const C1 = recap.start(1);

export const script: AnimationScript = {
	chapters: [
		{ id: 'once', label: { es: 'Al menos una vez', en: 'At least once' } },
		{ id: 'validate', label: { es: 'Validar una entrada', en: 'Validating input' } },
		{ id: 'scope', label: { es: 'Alcance del bloque', en: 'Block scope' } },
		{ id: 'menu', label: { es: 'Un menú', en: 'A menu' } },
		{ id: 'jumps', label: { es: 'break y continue', en: 'break and continue' } },
		{ id: 'whole', label: { es: 'Todas las pistas', en: 'All the tracks' } },
	],
	steps: [
		// ─── Scene 1. At least once ─────────────────────────────────────────
		{
			id: 'once',
			chapter: 'once',
			scene: 'dowhile',
			title: { es: 'El cuerpo va primero', en: 'The body comes first' },
			subtitles: once.list,
			motion: {
				cues: seq(
					shot(0, 'shot-a', 2400),
					show(200, 'trk-a', 'hl'),
					build(500, 'a4', 'a7', 'a8', 'a10'),
					{ at: 900, do: 'pulse', el: 'm-a8' },
					show(1100, 'p'),
					go(1300, 'a4'),
					go(2100, 'a7'),
					{ at: 2700, do: 'type', el: 'o-a1', dur: 700 },
					go(once.start(1) + 200, 'a8', 700),
					show(once.start(1) + 1000, 'lb-a-false'),
					go(once.start(1) + 1800, 'a10', 700),
					show(once.start(1) + 2600, 'lb-a-once'),
					{ at: once.start(1) + 3400, do: 'pulse', el: 'lb-a-once' },
				),
			},
		},
		{
			id: 'while',
			chapter: 'once',
			scene: 'dowhile',
			title: { es: 'Con while, cero vueltas', en: 'With while, zero passes' },
			subtitles: before.list,
			motion: {
				cues: seq(
					clear(0, 'lb-a-false'),
					teleport(0, 'a'),
					show(500, 'gw-a', 'lb-a-while'),
					show(900, 'p'),
					hop(1100, 'a-a-gw', 900),
					{ at: 2000, do: 'pulse', el: 'gw-a' },
					{ at: 2200, do: 'draw', el: 'by-a', dur: 800 },
					hop(2400, 'a-a-by', 600),
					hop(3000, 'a-a10', 600),
					{ at: 3400, do: 'type', el: 'o-a2', dur: 600 },
					show(before.start(1) + 200, 'lb-a-zero'),
					{ at: before.start(1) + 1200, do: 'pulse', el: 'lb-a-zero' },
					{ at: before.start(1) + 2200, do: 'pulse', el: 'lb-a-once' },
					{ at: before.start(1) + 3000, do: 'pulse', el: 'm-a7' },
				),
			},
		},

		// ─── Scene 2. Validating input ──────────────────────────────────────
		{
			id: 'validate',
			chapter: 'validate',
			scene: 'dowhile',
			title: { es: 'Pedir mientras sea inválido', en: 'Ask while it is invalid' },
			subtitles: validate.list,
			motion: {
				cues: seq(
					clear(0, 'lb-a-once', 'lb-a-zero', 'lb-a-while', 'gw-a', 'by-a', 'ed-a', 'file-a', 'o-a1', 'o-a2'),
					teleport(0, 'b'),
					shot(200, 'shot-b', 2600),
					show(450, 'ed-b', 'file-b'),
					show(700, 'trk-b'),
					build(900, 'b4', 'b5', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12', 'b13', 'b14', 'b15', 'b17', 'b18', 'b19'),
					show(1200, 'v-b4-0', 'v-b5-q'),
					show(2300, 'p'),
					walk(2400, ['b4', 'b5', 'b7']),
					{ at: 4000, do: 'type', el: 'o-b0', dur: 600 },
					show(V1, 't-abc'),
					{ at: V1 + 100, do: 'type', el: 'i-b0', dur: 300 },
					go(V1 + 300, 'b8'),
					glide(V1 + 400, 't-abc', 'a-b8'),
					show(V1 + 900, 'warn-b8'),
					swap(V1 + 1100, 'v-b5-q', 'v-b5-0'),
					walk(V1 + 1700, ['b9', 'b10', 'b11'], 550),
					go(V2, 'b12'),
					glide(V2 + 100, 't-abc', 'a-b-bin', 800),
					{ at: V2 + 900, do: 'exit', el: 't-abc', dur: 600 },
					go(V2 + 1500, 'b13'),
					{ at: V2 + 2100, do: 'type', el: 'o-b1', dur: 700 },
				),
			},
		},
		{
			id: 'retry',
			chapter: 'validate',
			scene: 'dowhile',
			title: { es: 'Otra vuelta hasta que sirva', en: 'Another pass until it fits' },
			subtitles: retry.list,
			motion: {
				cues: seq(
					go(0, 'b17', 600),
					show(600, 'lb-b-true'),
					{ at: 700, do: 'draw', el: 'arc-b', dur: 800 },
					loop(800, 'b'),
					clear(1500, 'warn-b8'),
					go(1600, 'b7', 450),
					{ at: 2100, do: 'type', el: 'o-b2', dur: 500 },
					show(2200, 't-150'),
					{ at: 2300, do: 'type', el: 'i-b2', dur: 300 },
					go(2500, 'b8', 450),
					glide(2600, 't-150', 'a-b4v', 600),
					swap(3200, 'v-b4-0', 'v-b4-150'),
					swap(3200, 'v-b5-0', 'v-b5-1'),
					{ at: 3300, do: 'exit', el: 't-150', dur: 300 },
					walk(3500, ['b9', 'b10', 'b14', 'b15'], 450),
					{ at: 5300, do: 'type', el: 'o-b3', dur: 500 },
					{ at: 5300, do: 'flow', el: 'arc-b' },
					go(R1, 'b17', 450),
					loop(R1 + 500, 'b'),
					go(R1 + 1300, 'b7', 400),
					{ at: R1 + 1700, do: 'type', el: 'o-b4', dur: 500 },
					show(R1 + 1800, 't-30'),
					{ at: R1 + 1900, do: 'type', el: 'i-b4', dur: 300 },
					go(R1 + 2100, 'b8', 400),
					glide(R1 + 2200, 't-30', 'a-b4v', 600),
					swap(R1 + 2800, 'v-b4-150', 'v-b4-30'),
					{ at: R1 + 2900, do: 'exit', el: 't-30', dur: 300 },
					walk(R1 + 3000, ['b9', 'b10', 'b14'], 400),
					clear(R1 + 3900, 'lb-b-true'),
					go(R1 + 4200, 'b17', 450),
					show(R1 + 4700, 'lb-b-false'),
					walk(R1 + 5100, ['b18', 'b19'], 500),
					{ at: R1 + 5600, do: 'type', el: 'o-b5', dur: 600 },
				),
			},
		},

		// ─── Scene 3. Block scope ───────────────────────────────────────────
		{
			id: 'scope',
			chapter: 'scope',
			scene: 'dowhile',
			title: { es: 'La condición está fuera del bloque', en: 'The condition is outside the block' },
			subtitles: scope.list,
			motion: {
				cues: seq(
					clear(0, 'lb-b-false', 'p'),
					shot(0, 'shot-scope', 2400),
					show(700, 'blk-b'),
					show(1100, 'lb-b-block'),
					{ at: 1500, do: 'move', el: 'hl', to: 'ln-17', dur: 500 },
					{ at: 2000, do: 'pulse', el: 'm-b17' },
					{ at: 2800, do: 'pulse', el: 'blk-b' },
					{ at: S1, do: 'draw', el: 'probe-b', dur: 800 },
					show(S1 + 800, 'x-b', 'warn-b17'),
					show(S1 + 1000, 'lb-b-c'),
					{ at: S1 + 1300, do: 'pulse', el: 'm-b11' },
					{ at: S1 + 2200, do: 'draw', el: 'rd-b', dur: 900 },
					{ at: S1 + 3100, do: 'pulse', el: 'm-b4' },
					{ at: S1 + 3400, do: 'pulse', el: 'm-b5' },
				),
			},
		},

		// ─── Scene 4. A menu ────────────────────────────────────────────────
		{
			id: 'menu',
			chapter: 'menu',
			scene: 'dowhile',
			title: { es: 'Un menú con do-while y switch', en: 'A menu with do-while and switch' },
			subtitles: menu.list,
			motion: {
				cues: seq(
					clear(0, 'blk-b', 'lb-b-block', 'probe-b', 'x-b', 'lb-b-c', 'rd-b', 'warn-b17', 'ed-b', 'file-b'),
					clear(0, 'o-b0', 'i-b0', 'o-b1', 'o-b2', 'i-b2', 'o-b3', 'o-b4', 'i-b4', 'o-b5'),
					{ at: 300, do: 'move', el: 'p', to: 'a-c-in', dur: 80 },
					shot(200, 'shot-c', 2400),
					show(450, 'ed-c', 'file-c', 'trk-c', 'sw-c', 'sw-end'),
					build(700, 'c4', 'c5', 'c7', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c17', 'c18'),
					show(1100, 'v-c4-0', 'v-c5-0'),
					show(1900, 'p'),
					walk(2000, ['c4', 'c5', 'c7'], 450),
					{ at: 3000, do: 'type', el: 'o-c0', dur: 500 },
					{ at: 3400, do: 'type', el: 'o-c1', dur: 300 },
					show(3500, 't-c1'),
					{ at: 3600, do: 'type', el: 'i-c1', dur: 200 },
					go(3700, 'c9', 400),
					glide(3800, 't-c1', 'a-c4v', 500),
					swap(4300, 'v-c4-0', 'v-c4-1'),
					{ at: 4400, do: 'exit', el: 't-c1', dur: 300 },
					// Lap 1: case 1, then break leaves the switch only.
					go(M1, 'c10', 400),
					go(M1 + 450, 'c11', 400),
					swap(M1 + 850, 'v-c5-0', 'v-c5-1'),
					hop(M1 + 950, 'a-c-sw', 500),
					show(M1 + 1300, 'lb-c-break'),
					go(M1 + 1600, 'c17', 450),
					{ at: M1 + 1900, do: 'draw', el: 'arc-c', dur: 600 },
					loop(M1 + 2100, 'c'),
					// Lap 2: case 3 shows the counter.
					go(M1 + 2900, 'c7', 350),
					{ at: M1 + 3200, do: 'type', el: 'o-c2', dur: 400 },
					{ at: M1 + 3500, do: 'type', el: 'o-c3', dur: 250 },
					show(M1 + 3500, 't-c3'),
					{ at: M1 + 3700, do: 'type', el: 'i-c3', dur: 200 },
					go(M1 + 3700, 'c9', 350),
					glide(M1 + 3800, 't-c3', 'a-c4v', 450),
					swap(M1 + 4250, 'v-c4-1', 'v-c4-3'),
					{ at: M1 + 4300, do: 'exit', el: 't-c3', dur: 300 },
					go(M1 + 4400, 'c10', 350),
					go(M1 + 4800, 'c13', 350),
					{ at: M1 + 5100, do: 'type', el: 'o-c4', dur: 400 },
					hop(M1 + 5300, 'a-c-sw', 400),
					go(M2, 'c17', 400),
					loop(M2 + 450, 'c'),
					// Lap 3: case 0 says goodbye; the condition ends the menu.
					go(M2 + 1250, 'c7', 350),
					{ at: M2 + 1550, do: 'type', el: 'o-c5', dur: 400 },
					{ at: M2 + 1850, do: 'type', el: 'o-c6', dur: 250 },
					show(M2 + 1850, 't-c0'),
					{ at: M2 + 2050, do: 'type', el: 'i-c6', dur: 200 },
					go(M2 + 2050, 'c9', 350),
					glide(M2 + 2150, 't-c0', 'a-c4v', 450),
					swap(M2 + 2600, 'v-c4-3', 'v-c4-z'),
					{ at: M2 + 2650, do: 'exit', el: 't-c0', dur: 300 },
					go(M2 + 2750, 'c10', 350),
					go(M2 + 3150, 'c14', 350),
					{ at: M2 + 3450, do: 'type', el: 'o-c7', dur: 400 },
					hop(M2 + 3600, 'a-c-sw', 400),
					go(M2 + 4050, 'c17', 400),
					show(M2 + 4500, 'lb-c-false'),
					go(M2 + 4900, 'c18', 450),
				),
			},
		},

		// ─── Scene 5. break and continue ────────────────────────────────────
		{
			id: 'jumps',
			chapter: 'jumps',
			scene: 'dowhile',
			title: { es: 'Adónde saltan break y continue', en: 'Where break and continue jump' },
			subtitles: jumps.list,
			motion: {
				cues: seq(
					clear(0, 'lb-c-break', 'lb-c-false', 'ed-c', 'file-c'),
					clear(0, 'o-c0', 'o-c1', 'i-c1', 'o-c2', 'o-c3', 'i-c3', 'o-c4', 'o-c5', 'o-c6', 'i-c6', 'o-c7'),
					teleport(0, 'd'),
					shot(200, 'shot-d', 2200),
					show(400, 'ed-d', 'file-d', 'trk-d'),
					build(600, 'd4', 'd6', 'd7', 'd8', 'd10', 'd11', 'd13', 'd14', 'd15', 'd16'),
					show(900, 'v-d4-0'),
					show(1400, 'p'),
					// i = 1: the whole body, then back.
					go(1500, 'd4', 350),
					go(1900, 'd6', 350),
					swap(2250, 'v-d4-0', 'v-d4-1'),
					walk(2300, ['d7', 'd10', 'd13'], 350),
					{ at: 3300, do: 'type', el: 'o-d1', dur: 200 },
					go(3400, 'd14', 350),
					{ at: 3600, do: 'draw', el: 'arc-d', dur: 500 },
					loop(3750, 'd'),
					// i = 2: continue jumps straight to the condition.
					go(4550, 'd6', 350),
					swap(4900, 'v-d4-1', 'v-d4-2'),
					walk(4950, ['d7', 'd8'], 400),
					{ at: 5700, do: 'draw', el: 'jc-d', dur: 700 },
					hop(5800, 'a-d-jc', 450),
					hop(6250, 'a-d14', 450),
					show(6400, 'lb-d-cont'),
					{ at: 6700, do: 'pulse', el: 'm-d14' },
					// i = 3 and i = 4: full laps.
					loop(J1, 'd'),
					go(J1 + 800, 'd6', 300),
					swap(J1 + 1100, 'v-d4-2', 'v-d4-3'),
					walk(J1 + 1150, ['d7', 'd10', 'd13'], 300),
					{ at: J1 + 2000, do: 'type', el: 'o-d3', dur: 200 },
					go(J1 + 2050, 'd14', 300),
					loop(J1 + 2400, 'd'),
					go(J1 + 3200, 'd6', 300),
					swap(J1 + 3500, 'v-d4-3', 'v-d4-4'),
					walk(J1 + 3550, ['d7', 'd10', 'd13'], 300),
					{ at: J1 + 4400, do: 'type', el: 'o-d4', dur: 200 },
					go(J1 + 4450, 'd14', 300),
					loop(J1 + 4800, 'd'),
					// i = 5: break leaves the track past the gate.
					go(J2, 'd6', 300),
					swap(J2 + 300, 'v-d4-4', 'v-d4-5'),
					walk(J2 + 350, ['d7', 'd10', 'd11'], 350),
					{ at: J2 + 1350, do: 'draw', el: 'jb-d', dur: 700 },
					hop(J2 + 1450, 'a-d-jb', 450),
					go(J2 + 1900, 'd15', 450),
					show(J2 + 2000, 'lb-d-break'),
					{ at: J2 + 2400, do: 'type', el: 'o-d5', dur: 500 },
					go(J2 + 3000, 'd16', 400),
					{ at: J2 + 3600, do: 'pulse', el: 'm-d6' },
				),
			},
		},
		{
			id: 'for',
			chapter: 'jumps',
			scene: 'dowhile',
			title: { es: 'continue en un for', en: 'continue in a for' },
			subtitles: forjump.list,
			motion: {
				cues: seq(
					clear(0, 'p'),
					shot(0, 'shot-for', 2400),
					show(800, 'for-f', 'lb-f-head'),
					{ at: 1600, do: 'draw', el: 'jc-f', dur: 800 },
					show(2400, 'lb-f-cont'),
					{ at: 2600, do: 'flow', el: 'jc-f' },
					{ at: 3000, do: 'pulse', el: 'm-f-upd' },
					{ at: 3600, do: 'pulse', el: 'lb-d-cont' },
					{ at: F1, do: 'flow', el: 'jc-d' },
					show(F1 + 300, 'lb-d-upd'),
					{ at: F1 + 900, do: 'pulse', el: 'm-d6' },
					{ at: F1 + 1800, do: 'pulse', el: 'lb-d-upd' },
				),
			},
		},

		// ─── Scene 6. All the tracks ────────────────────────────────────────
		{
			id: 'recap',
			chapter: 'whole',
			scene: 'dowhile',
			title: { es: 'La puerta al final', en: 'The gate at the end' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					clear(0, 'lb-d-upd', 'lb-f-cont'),
					shot(300, 'shot-all', 3200),
										{ at: 1600, do: 'flow', el: 'arc-c' },
					{ at: 1600, do: 'flow', el: 'arc-d' },
					{ at: 1900, do: 'pulse', el: 'm-a8' },
					{ at: 2300, do: 'pulse', el: 'm-b17' },
					{ at: 2700, do: 'pulse', el: 'm-c17' },
					{ at: 3100, do: 'pulse', el: 'm-d14' },
					show(3300, 'lb-sum'),
					{ at: C1 + 200, do: 'flow', el: 'jb-d' },
					{ at: C1 + 600, do: 'pulse', el: 'lb-d-break' },
					{ at: C1 + 1400, do: 'pulse', el: 'lb-d-cont' },
					{ at: C1 + 2200, do: 'pulse', el: 'lb-sum' },
				),
			},
		},
	],
};
