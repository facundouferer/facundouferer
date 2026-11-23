import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Replaced text and generic code": a short film (about two minutes) for the C lesson
// "El preprocesador y la programación genérica" (`preprocesador-y-programacion-generica`).
// It plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/macros-genericos-c.astro`). The editor on the left shows six
// programs of the lesson, one at a time (`ed-<program>`, with its console `co-<program>`):
// the `MAXIMO(i++, j)` macro, the unparenthesized square, the `do { } while (0)` swap, the
// `static inline` maximum, the `_Generic` absolute value and the `#if` on the standard. The
// isometric world on the right keeps one world per program (`w-<program>`) and, shared by
// all of them, two stations side by side: the preprocessor (`st-pp`), where names are
// swapped for text, and the compiler (`st-cc`), which only ever sees that text. Text is a
// dashed tile; a value is a plain pill. Light blue is the normal flow; magenta marks the
// trap (the second `i++`, the wrong `5`, the branch that is dropped); violet marks what
// handles it (the preprocessor, the parentheses, `do { } while (0)`, the chosen branch).

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

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 300 }));

/** Builds several elements one after the other, a beat apart. */
const build = (at: number, gap: number, ...els: string[]): MotionCue[] =>
	els.map((el, index) => ({ at: at + index * gap, do: 'enter' as const, el }));

/** One module per instruction, on the rail, labelled with its editor line. */
const modules = (at: number, program: string, lines: number[], gap = 90): MotionCue[] =>
	build(at, gap, ...lines.map((line) => `m-${program}-${line}`));

/**
 * Runs the instruction on editor line `line` of `program`: the bar slides to it, the
 * flow travels to its module and the module lights up. `prev` is the line that was lit.
 */
const run = (at: number, program: string, line: number, dur = 700, prev?: number): MotionCue[] => [
	...(prev ? clear(at, `on-${program}-${prev}`) : []),
	{ at, do: 'move', el: 'hl', to: `ln-${program}-${line}`, dur: Math.min(dur, 600) },
	{ at, do: 'move', el: 'p', to: `a-m-${program}-${line}`, dur },
	{ at: at + dur, do: 'enter', el: `on-${program}-${line}` },
];

/** Types one row of the console of `program`. */
const out = (at: number, program: string, row: number, dur = 700): MotionCue => ({ at, do: 'type', el: `out-${program}-${row}`, dur });

/** A value leaves where it was born and settles in its box. */
const store = (at: number, token: string, box: string, dur = 900): MotionCue[] => [
	{ at, do: 'enter', el: token },
	{ at: at + 100, do: 'move', el: token, to: `a-b-${box}`, dur },
];

/** Leaves a program: the bar, the flow, the editor, the console and the world fade out. */
const leave = (at: number, program: string, ...extra: string[]): MotionCue[] => [
	...clear(at, 'hl', 'p', `ed-${program}`, `co-${program}`, ...extra),
	...clear(at + 100, `w-${program}`),
];

/** Shows a program: the editor is typed in, its console and world appear, the bar waits on `line`. */
const arrive = (at: number, program: string, line: number): MotionCue[] => [
	{ at, do: 'type', el: `ed-${program}`, dur: 900 },
	{ at, do: 'enter', el: `co-${program}` },
	{ at, do: 'enter', el: `w-${program}` },
	{ at, do: 'move', el: 'hl', to: `ln-${program}-${line}`, dur: 1 },
	{ at, do: 'move', el: 'p', to: `a-m-${program}-${line}`, dur: 1 },
	{ at: at + 100, do: 'enter', el: 'hl' },
	{ at: at + 100, do: 'enter', el: 'p' },
];

/** A piece of text travels from its instruction to the preprocessor and comes out as tiles. */
const swapText = (at: number, token: string, tiles: string[]): MotionCue[] => [
	{ at, do: 'enter', el: token },
	{ at: at + 100, do: 'move', el: token, to: 'a-st', dur: 1300 },
	{ at: at + 1400, do: 'enter', el: 'on-st' },
	{ at: at + 1400, do: 'pulse', el: 'st-pp' },
	{ at: at + 1500, do: 'exit', el: token, dur: 300 },
	...build(at + 1700, 200, ...tiles),
];

// ─── Captions ───────────────────────────────────────────────────────────────
const station = timed(
	say('El preprocesador corre antes del compilador: cambia nombres por texto.', 'The preprocessor runs before the compiler: it swaps names for text.'),
	say('`#define` le da la receta de `MAXIMO(a, b)`.', '`#define` gives it the recipe for `MAX(a, b)`.'),
	say('En la línea 8 reemplaza la llamada en el lugar. No entiende tipos.', 'On line 8 it replaces the call in place. It knows no types.'),
);
const twice = timed(
	say('El argumento `i++` se copia dos veces: aparece dos veces en el texto.', 'The argument `i++` is copied twice: it appears twice in the text.'),
	say('El compilador lo evalúa dos veces: `i` pasa de 5 a 6 y luego a 7.', 'The compiler evaluates it twice: `i` goes from 5 to 6 and then to 7.'),
	say('Resultado real: `m = 6, i = 7`. Una macro no evalúa una vez.', 'Real result: `m = 6, i = 7`. A macro does not evaluate once.'),
);
const paren = timed(
	say('Sin paréntesis, `CUADRADO_MAL(2 + 1)` es solo texto: `2 + 1 * 2 + 1`.', 'Without parentheses, `SQUARE_BAD(2 + 1)` is just text: `2 + 1 * 2 + 1`.'),
	say('La multiplicación va primero: da 5, no 9.', 'Multiplication goes first: it gives 5, not 9.'),
	say('Con paréntesis en cada parámetro y en el total, da 9.', 'With parentheses on every parameter and on the whole, it gives 9.'),
);
const dowhile = timed(
	say('Una macro de varias sentencias se rompe dentro de un `if` sin llaves.', 'A macro of several statements breaks inside an `if` without braces.'),
	say('`do { } while (0)` las agrupa en una sola sentencia.', '`do { } while (0)` groups them into a single statement.'),
	say('Se usa con `;` como una llamada, y `if` y `else` funcionan: `3 8`.', 'It takes a `;` like a call, so `if` and `else` work: `3 8`.'),
);
const inline = timed(
	say('Una función `static inline` no reemplaza texto: tiene tipos.', 'A `static inline` function replaces no text: it has types.'),
	say('El argumento `i++` se evalúa una sola vez, antes de entrar.', 'The argument `i++` is evaluated only once, before going in.'),
	say('Resultado: `m = 5, i = 6`. Si una función alcanza, úsala.', 'Result: `m = 5, i = 6`. If a function is enough, use it.'),
);
const generic = timed(
	say('`_Generic` elige una rama según el tipo, al compilar.', '`_Generic` picks a branch by type, at compile time.'),
	say('`-4` es `int` y va a `abs`; `-7L` es `long` y va a `labs`.', '`-4` is `int` and goes to `abs`; `-7L` is `long` and goes to `labs`.'),
	say('`-2.5` es `double` y va a `fabs`. Solo cuenta el tipo.', '`-2.5` is `double` and goes to `fabs`. Only the type counts.'),
);
const cond = timed(
	say('`#if` decide qué texto llega al compilador: compara `__STDC_VERSION__`.', '`#if` decides which text reaches the compiler: it compares `__STDC_VERSION__`.'),
	say('Con C23 gana `nullptr`; la rama con `NULL` se descarta antes de compilar.', 'With C23, `nullptr` wins; the `NULL` branch is dropped before compiling.'),
	say('Así el mismo código se adapta al estándar o a la plataforma.', 'That is how the same code adapts to the standard or the platform.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'station', label: { es: 'Texto que se reemplaza', en: 'Text that is replaced' } },
		{ id: 'twice', label: { es: 'Se evalúa dos veces', en: 'Evaluated twice' } },
		{ id: 'paren', label: { es: 'Paréntesis y do while', en: 'Parentheses and do while' } },
		{ id: 'inline', label: { es: 'La función inline', en: 'The inline function' } },
		{ id: 'generic', label: { es: 'Elegir por tipo', en: 'Picking by type' } },
		{ id: 'cond', label: { es: 'Compilación condicional', en: 'Conditional compilation' } },
	],
	steps: [
		// ─── Scene 1. The preprocessor swaps names for text ─────────────────
		{
			id: 'station',
			chapter: 'station',
			scene: 'journey',
			title: { es: 'El preprocesador cambia nombres por texto', en: 'The preprocessor swaps names for text' },
			subtitles: station.list,
			motion: {
				cues: seq(
					shot(0, 'shot-pipe', 3000),
					{ at: 100, do: 'enter', el: 'w-macro' },
					{ at: 200, do: 'type', el: 'ed-macro', dur: 1000 },
					{ at: 200, do: 'enter', el: 'co-macro' },
					...build(400, 300, 'st-pp', 'lb-pp', 'st-cc', 'lb-cc'),
					{ at: 1700, do: 'draw', el: 'tr-flow', dur: 900 },
					...modules(900, 'macro', [3, 6, 7, 8, 9], 90),
					{ at: 1600, do: 'enter', el: 'hl' },
					{ at: 1600, do: 'enter', el: 'p' },
					{ at: 3000, do: 'enter', el: 'lb-before' },
					// Line 3 teaches the preprocessor the recipe of the macro.
					...clear(station.start(1), 'lb-before'),
					...run(station.start(1) + 100, 'macro', 3, 700),
					{ at: station.start(1) + 900, do: 'enter', el: 'on-st' },
					{ at: station.start(1) + 900, do: 'pulse', el: 'st-pp' },
					{ at: station.start(1) + 1100, do: 'enter', el: 'lb-recipe' },
					// Lines 6 and 7 are ordinary: they put their values in their boxes.
					...run(station.start(1) + 1700, 'macro', 6, 600, 3),
					{ at: station.start(1) + 2100, do: 'draw', el: 'fl-macro-6', dur: 600 },
					{ at: station.start(1) + 2400, do: 'enter', el: 'b-i' },
					...store(station.start(1) + 2500, 'tk-i5', 'i', 800),
					...run(station.start(1) + 2700, 'macro', 7, 600, 6),
					{ at: station.start(1) + 3100, do: 'draw', el: 'fl-macro-7', dur: 600 },
					{ at: station.start(1) + 3400, do: 'enter', el: 'b-j' },
					...store(station.start(1) + 3500, 'tk-j3', 'j', 800),
					// Line 8: the call goes into the preprocessor and comes out as plain text.
					...run(station.start(2), 'macro', 8, 700, 7),
					{ at: station.start(2) + 800, do: 'enter', el: 'b-m' },
					...swapText(station.start(2) + 900, 'tx-call', ['tx-1', 'tx-2', 'tx-3', 'tx-4']),
					{ at: station.start(2) + 3500, do: 'enter', el: 'lb-before' },
					{ at: station.start(2) + 4200, do: 'pulse', el: 'lb-before' },
				),
			},
		},
		{
			id: 'twice',
			chapter: 'twice',
			scene: 'journey',
			title: { es: 'MAXIMO(i++, j) evalúa i++ dos veces', en: 'MAX(i++, j) evaluates i++ twice' },
			subtitles: twice.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-recipe', 'lb-before', 'on-st'),
					shot(0, 'shot-eval', 2600),
					{ at: 400, do: 'enter', el: 'hx-macro-8' },
					{ at: 700, do: 'pulse', el: 'tx-1' },
					{ at: 1400, do: 'pulse', el: 'tx-3' },
					{ at: 2100, do: 'enter', el: 'lb-twice' },
					// The compiler reads the text: each copy of `i++` changes `i`.
					{ at: twice.start(1), do: 'enter', el: 'on-cc' },
					{ at: twice.start(1), do: 'pulse', el: 'st-cc' },
					{ at: twice.start(1) + 500, do: 'enter', el: 'tk-i6' },
					{ at: twice.start(1) + 600, do: 'move', el: 'tk-i6', to: 'a-b-i', dur: 1000 },
					{ at: twice.start(1) + 1500, do: 'exit', el: 'tk-i5', dur: 400 },
					{ at: twice.start(1) + 1900, do: 'pulse', el: 'b-i' },
					{ at: twice.start(1) + 2400, do: 'enter', el: 'tk-i7' },
					{ at: twice.start(1) + 2500, do: 'move', el: 'tk-i7', to: 'a-b-i', dur: 1000 },
					{ at: twice.start(1) + 3400, do: 'exit', el: 'tk-i6', dur: 400 },
					{ at: twice.start(1) + 3800, do: 'pulse', el: 'b-i' },
					// `m` receives the value of the second copy, which was 6.
					{ at: twice.start(2), do: 'enter', el: 'tk-m6' },
					{ at: twice.start(2) + 100, do: 'move', el: 'tk-m6', to: 'a-b-m', dur: 1000 },
					...run(twice.start(2) + 1200, 'macro', 9, 600, 8),
					out(twice.start(2) + 1900, 'macro', 1, 800),
					{ at: twice.start(2) + 2000, do: 'pulse', el: 'b-i' },
					{ at: twice.start(2) + 2300, do: 'pulse', el: 'b-m' },
					{ at: twice.start(2) + 2800, do: 'pulse', el: 'lb-twice' },
				),
			},
		},

		// ─── Scene 3. Parentheses and do { } while (0) ──────────────────────
		{
			id: 'paren',
			chapter: 'paren',
			scene: 'journey',
			title: { es: 'Los paréntesis importan', en: 'Parentheses matter' },
			subtitles: paren.list,
			motion: {
				cues: seq(
					...leave(0, 'macro', 'on-macro-9', 'on-cc', 'hx-macro-8'),
					shot(0, 'shot-paren', 2400),
					...arrive(400, 'paren', 3),
					...modules(900, 'paren', [3, 6], 100),
					{ at: 1500, do: 'enter', el: 'on-paren-3' },
					{ at: 1500, do: 'enter', el: 'on-st' },
					{ at: 1500, do: 'pulse', el: 'st-pp' },
					{ at: 1800, do: 'enter', el: 'lb-sq-bad' },
					...run(2300, 'paren', 6, 700, 3),
					...swapText(3000, 'tx-sq', ['tp-1', 'tp-2', 'tp-3']),
					// The compiler reads the tiles: the product binds tighter than the sums.
					{ at: paren.start(1) + 100, do: 'enter', el: 'on-cc' },
					{ at: paren.start(1) + 100, do: 'pulse', el: 'st-cc' },
					{ at: paren.start(1) + 200, do: 'enter', el: 'hx-paren-6' },
					{ at: paren.start(1) + 300, do: 'pulse', el: 'tp-2' },
					{ at: paren.start(1) + 700, do: 'enter', el: 'lb-prec' },
					out(paren.start(1) + 1500, 'paren', 1, 500),
					{ at: paren.start(1) + 1700, do: 'pulse', el: 'lb-prec' },
					// The fix: parentheses around the parameter and around the whole.
					...clear(paren.start(2), 'tp-1', 'tp-2', 'tp-3', 'lb-prec', 'lb-sq-bad', 'hx-paren-6'),
					{ at: paren.start(2) + 400, do: 'enter', el: 'lb-sq-ok' },
					...build(paren.start(2) + 900, 200, 'tq-1', 'tq-2', 'tq-3'),
					{ at: paren.start(2) + 1900, do: 'enter', el: 'lb-sq-nine' },
					{ at: paren.start(2) + 2600, do: 'pulse', el: 'lb-sq-nine' },
				),
			},
		},
		{
			id: 'dowhile',
			chapter: 'paren',
			scene: 'journey',
			title: { es: 'do { } while (0): una sola sentencia', en: 'do { } while (0): a single statement' },
			subtitles: dowhile.list,
			motion: {
				cues: seq(
					...leave(0, 'paren', 'on-paren-6', 'on-st', 'on-cc'),
					shot(0, 'shot-swap', 2400),
					...arrive(400, 'swap', 3),
					...modules(900, 'swap', [3, 13, 14, 17], 90),
					...run(1500, 'swap', 3, 600),
					...run(2300, 'swap', 13, 600, 3),
					...run(3000, 'swap', 14, 600, 13),
					...swapText(3600, 'tx-sw', ['ts-1', 'ts-2', 'ts-3']),
					// Without `do { } while (0)` only the first statement belongs to the `if`.
					{ at: 5900, do: 'draw', el: 'fr-bad', dur: 600 },
					{ at: dowhile.start(1) - 100, do: 'enter', el: 'lb-ifbad' },
					...clear(dowhile.start(1) + 1500, 'fr-bad', 'lb-ifbad'),
					{ at: dowhile.start(1) + 1900, do: 'draw', el: 'fr-do', dur: 900 },
					{ at: dowhile.start(1) + 2500, do: 'enter', el: 'lb-one' },
					{ at: dowhile.start(1) + 3200, do: 'pulse', el: 'fr-do' },
					...run(dowhile.start(2), 'swap', 17, 700, 14),
					out(dowhile.start(2) + 800, 'swap', 1, 500),
					{ at: dowhile.start(2) + 1200, do: 'pulse', el: 'fr-do' },
					{ at: dowhile.start(2) + 2000, do: 'pulse', el: 'lb-one' },
				),
			},
		},

		// ─── Scene 4. A function instead of a macro ─────────────────────────
		{
			id: 'inline',
			chapter: 'inline',
			scene: 'journey',
			title: { es: 'static inline: la alternativa segura', en: 'static inline: the safe alternative' },
			subtitles: inline.list,
			motion: {
				cues: seq(
					...leave(0, 'swap', 'on-swap-17', 'on-st'),
					shot(0, 'shot-inline', 2400),
					...arrive(400, 'inline', 3),
					...modules(900, 'inline', [3, 8, 9, 10], 100),
					{ at: 1500, do: 'enter', el: 'on-inline-3' },
					{ at: 1800, do: 'enter', el: 'lb-fn' },
					{ at: 2300, do: 'enter', el: 'lb-nopp' },
					{ at: 2800, do: 'pulse', el: 'lb-fn' },
					// `i` and the call: the argument goes to the compiler as a value, once.
					...run(inline.start(1), 'inline', 8, 600, 3),
					{ at: inline.start(1) + 700, do: 'enter', el: 'b-ii' },
					...store(inline.start(1) + 800, 'ti-5', 'ii', 800),
					...run(inline.start(1) + 1800, 'inline', 9, 600, 8),
					{ at: inline.start(1) + 2300, do: 'enter', el: 'b-mi' },
					{ at: inline.start(1) + 2500, do: 'enter', el: 'ti-arg' },
					{ at: inline.start(1) + 2600, do: 'move', el: 'ti-arg', to: 'a-cc', dur: 1300 },
					{ at: inline.start(1) + 3900, do: 'enter', el: 'on-cc' },
					{ at: inline.start(1) + 3900, do: 'pulse', el: 'st-cc' },
					{ at: inline.start(1) + 4000, do: 'exit', el: 'ti-arg', dur: 300 },
					{ at: inline.start(1) + 4100, do: 'enter', el: 'lb-once' },
					// One evaluation: `i` becomes 6 and the result, the old 5, goes to `m`.
					{ at: inline.start(2), do: 'enter', el: 'ti-6' },
					{ at: inline.start(2) + 100, do: 'move', el: 'ti-6', to: 'a-b-ii', dur: 1000 },
					{ at: inline.start(2) + 1000, do: 'exit', el: 'ti-5', dur: 400 },
					{ at: inline.start(2) + 1100, do: 'enter', el: 'ti-m5' },
					{ at: inline.start(2) + 1200, do: 'move', el: 'ti-m5', to: 'a-b-mi', dur: 1000 },
					...run(inline.start(2) + 2300, 'inline', 10, 600, 9),
					out(inline.start(2) + 2900, 'inline', 1, 800),
					{ at: inline.start(2) + 3000, do: 'pulse', el: 'b-ii' },
					{ at: inline.start(2) + 3300, do: 'pulse', el: 'b-mi' },
				),
			},
		},

		// ─── Scene 5. _Generic picks by type ────────────────────────────────
		{
			id: 'generic',
			chapter: 'generic',
			scene: 'journey',
			title: { es: '_Generic elige una función por tipo', en: '_Generic picks a function by type' },
			subtitles: generic.list,
			motion: {
				cues: seq(
					...leave(0, 'inline', 'on-inline-10', 'on-cc', 'lb-nopp'),
					shot(0, 'shot-gen', 2400),
					...arrive(400, 'generic', 5),
					...modules(900, 'generic', [5, 12, 13, 14], 90),
					...run(1500, 'generic', 5, 600),
					{ at: 2300, do: 'enter', el: 'sw' },
					...build(2600, 220, 'f-abs', 'f-labs', 'f-fabs'),
					{ at: 3500, do: 'enter', el: 'lb-ctime' },
					// `-4` is an int: the switch sends it to `abs`.
					...run(generic.start(1), 'generic', 12, 600, 5),
					{ at: generic.start(1) + 500, do: 'enter', el: 'tk-a4' },
					{ at: generic.start(1) + 600, do: 'move', el: 'tk-a4', to: 'a-sw', dur: 800 },
					{ at: generic.start(1) + 1400, do: 'enter', el: 'on-sw' },
					{ at: generic.start(1) + 1400, do: 'enter', el: 'ty-int' },
					{ at: generic.start(1) + 1600, do: 'draw', el: 'fl-gen-int', dur: 600 },
					{ at: generic.start(1) + 1800, do: 'move', el: 'tk-a4', to: 'a-f-abs', dur: 800 },
					{ at: generic.start(1) + 2600, do: 'pulse', el: 'f-abs' },
					out(generic.start(1) + 2700, 'generic', 1, 400),
					...clear(generic.start(1) + 3000, 'tk-a4', 'ty-int', 'fl-gen-int'),
					// `-7L` is a long: it goes to `labs`.
					...run(generic.start(1) + 3300, 'generic', 13, 600, 12),
					{ at: generic.start(1) + 3800, do: 'enter', el: 'tk-a7' },
					{ at: generic.start(1) + 3900, do: 'move', el: 'tk-a7', to: 'a-sw', dur: 800 },
					{ at: generic.start(1) + 4700, do: 'pulse', el: 'sw' },
					{ at: generic.start(1) + 4700, do: 'enter', el: 'ty-long' },
					{ at: generic.start(1) + 4900, do: 'draw', el: 'fl-gen-long', dur: 600 },
					{ at: generic.start(1) + 5100, do: 'move', el: 'tk-a7', to: 'a-f-labs', dur: 800 },
					{ at: generic.start(1) + 5900, do: 'pulse', el: 'f-labs' },
					out(generic.start(1) + 6000, 'generic', 2, 400),
					...clear(generic.start(1) + 6300, 'tk-a7', 'ty-long', 'fl-gen-long'),
					// `-2.5` is a double: it goes to `fabs`. Only its type decided it.
					...run(generic.start(2) + 700, 'generic', 14, 600, 13),
					{ at: generic.start(2) + 1200, do: 'enter', el: 'tk-a25' },
					{ at: generic.start(2) + 1300, do: 'move', el: 'tk-a25', to: 'a-sw', dur: 800 },
					{ at: generic.start(2) + 2100, do: 'pulse', el: 'sw' },
					{ at: generic.start(2) + 2100, do: 'enter', el: 'ty-double' },
					{ at: generic.start(2) + 2300, do: 'draw', el: 'fl-gen-double', dur: 600 },
					{ at: generic.start(2) + 2500, do: 'move', el: 'tk-a25', to: 'a-f-fabs', dur: 800 },
					{ at: generic.start(2) + 3300, do: 'pulse', el: 'f-fabs' },
					out(generic.start(2) + 3400, 'generic', 3, 400),
					{ at: generic.start(2) + 3900, do: 'enter', el: 'lb-typeonly' },
					{ at: generic.start(2) + 4600, do: 'pulse', el: 'lb-typeonly' },
				),
			},
		},

		// ─── Scene 6. Conditional compilation, and the whole pipeline ───────
		{
			id: 'cond',
			chapter: 'cond',
			scene: 'journey',
			title: { es: 'Compilación condicional', en: 'Conditional compilation' },
			subtitles: cond.list,
			motion: {
				cues: seq(
					...leave(0, 'generic', 'on-generic-14', 'tk-a25', 'on-sw'),
					shot(0, 'shot-cond', 2400),
					...arrive(400, 'cond', 3),
					...modules(900, 'cond', [3, 10, 11], 100),
					...run(1500, 'cond', 3, 700),
					{ at: 2300, do: 'enter', el: 'tc-ver' },
					{ at: 2400, do: 'move', el: 'tc-ver', to: 'a-st', dur: 1300 },
					{ at: 3700, do: 'enter', el: 'on-st' },
					{ at: 3700, do: 'pulse', el: 'st-pp' },
					{ at: 3800, do: 'exit', el: 'tc-ver', dur: 300 },
					{ at: 3900, do: 'enter', el: 'lb-ifc' },
					// The condition is true: one branch is kept, the other never reaches the compiler.
					{ at: cond.start(1) + 100, do: 'draw', el: 'fl-cond-a', dur: 700 },
					{ at: cond.start(1) + 100, do: 'draw', el: 'fl-cond-b', dur: 700 },
					{ at: cond.start(1) + 600, do: 'enter', el: 'tc-a' },
					{ at: cond.start(1) + 700, do: 'enter', el: 'tc-b' },
					{ at: cond.start(1) + 1300, do: 'enter', el: 'lb-keep' },
					{ at: cond.start(1) + 1500, do: 'enter', el: 'lb-drop' },
					{ at: cond.start(1) + 2300, do: 'exit', el: 'tc-b', dur: 500 },
					{ at: cond.start(1) + 2300, do: 'exit', el: 'fl-cond-b', dur: 500 },
					...run(cond.start(1) + 2600, 'cond', 10, 600, 3),
					// The use of the name is replaced by the branch that was kept, and only it is compiled.
					{ at: cond.start(1) + 3300, do: 'enter', el: 'tc-use' },
					{ at: cond.start(1) + 3400, do: 'move', el: 'tc-use', to: 'a-st', dur: 1200 },
					{ at: cond.start(1) + 4600, do: 'exit', el: 'tc-use', dur: 300 },
					{ at: cond.start(1) + 4600, do: 'pulse', el: 'st-pp' },
					{ at: cond.start(1) + 4800, do: 'move', el: 'tc-a', to: 'a-cc', dur: 1300 },
					{ at: cond.start(1) + 6100, do: 'enter', el: 'on-cc' },
					{ at: cond.start(1) + 6100, do: 'pulse', el: 'st-cc' },
					// Pull back: the whole pipeline, from the source to the compiler.
					shot(cond.start(2), 'shot-all', 3200),
					...run(cond.start(2) + 200, 'cond', 11, 600, 10),
					out(cond.start(2) + 900, 'cond', 1, 800),
					{ at: cond.start(2) + 1500, do: 'enter', el: 'lb-end' },
					{ at: cond.start(2) + 2300, do: 'pulse', el: 'st-pp' },
					{ at: cond.start(2) + 2900, do: 'pulse', el: 'st-cc' },
					{ at: cond.start(2) + 3500, do: 'pulse', el: 'lb-end' },
				),
			},
		},
	],
};
