import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Named boxes and boxes that do not change": a short film (about two minutes) for the
// C lesson "Variables y Constantes" (`variables-y-constantes`). It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/variables-constantes-c.astro`). The editor on the left
// shows five programs of the lesson, one at a time (`ed-<program>`, with its console
// `co-<program>`): the complete example, the uninitialized variable, suffixed literals,
// the `const` assignment that does not compile, and the unparenthesized macro. The
// isometric world on the right keeps one world per program (`w-<program>`). A variable is
// a box with a type and a name (the tag above it); a value is a pill that travels from
// the module of its line into the box. Light blue is the normal flow; magenta marks the
// bug or the refusal (the indeterminate "?", the assignment to a constant, the wrong
// result); violet marks what handles it (a lock, the preprocessor, the fix).

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

/** Builds several elements at the same moment, a beat apart. */
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

/** A value leaves the module of its line and settles in its box. */
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

// ─── Captions ───────────────────────────────────────────────────────────────
const declare = timed(
	say('Cada módulo es una instrucción y marca su línea del editor.', 'Each module is an instruction and shows its editor line.'),
	say('Declarar reserva una caja con tipo y nombre: `int edad`.', 'Declaring reserves a box with a type and a name: `int age`.'),
	say('Inicializar pone el primer valor en ella: `= 18`.', 'Initializing puts the first value in it: `= 18`.'),
);
const assign = timed(
	say('Las líneas 8 y 9 hacen lo mismo con `precio` e `inicial`.', 'Lines 8 and 9 do the same with `price` and `initial`.'),
	say('Asignar reemplaza el valor: `edad` pasa de 18 a 19.', 'Assigning replaces the value: `age` goes from 18 to 19.'),
	say('Es la misma caja con otro contenido, y `printf` lo lee: 19.', 'Same box, new content, and `printf` reads it: 19.'),
);
const unset = timed(
	say('`int total;` declara, pero nadie puso un valor en la caja.', '`int total;` declares, but nobody put a value in the box.'),
	say('Su valor es indeterminado: lo que había en esa memoria.', 'Its value is indeterminate: whatever that memory held.'),
	say('Leerlo es un error de programa, aunque compile. Usa `= 0`.', 'Reading it is a program bug even if it compiles. Use `= 0`.'),
);
const literals = timed(
	say('Todo literal tiene un tipo: `255`, sin sufijo, es `int`.', 'Every literal has a type: `255`, with no suffix, is `int`.'),
	say('El sufijo `u` cambia el tipo: `100u` es `unsigned int`.', 'The `u` suffix changes the type: `100u` is `unsigned int`.'),
	say('`3.14159` es `double`; con sufijo `f`, `9.81f` es `float`.', '`3.14159` is `double`; with the `f` suffix, `9.81f` is `float`.'),
);
const constant = timed(
	say('`const` crea una caja con candado: el valor queda fijo.', '`const` creates a box with a lock: the value stays fixed.'),
	say('Asignarle un valor no compila: el compilador lo rechaza.', 'Assigning to it does not compile: the compiler rejects it.'),
	say('Ese error es una ayuda: protege lo que decidiste fijar.', 'That error is a help: it protects what you decided to fix.'),
);
const define = timed(
	say('`#define` no crea cajas: es texto del preprocesador.', '`#define` creates no boxes: it is preprocessor text.'),
	say('Antes de compilar cambia `MESES_ANIO` por `12`.', 'Before compiling it swaps `MONTHS_PER_YEAR` for `12`.'),
	say('Sin variable y sin tipo, `printf` recibe `12`.', 'No variable and no type: `printf` just receives `12`.'),
);
const trap = timed(
	say('Es solo texto: `BASE * 2` queda como `4 + 1 * 2`.', 'It is just text: `BASE * 2` becomes `4 + 1 * 2`.'),
	say('La multiplicación va primero: da 6, no 10.', 'Multiplication goes first: it gives 6, not 10.'),
	say('Con paréntesis, `#define BASE (4 + 1)`, da 10.', 'With parentheses, `#define BASE (4 + 1)`, it gives 10.'),
);
const prefer = timed(
	say('`const` tiene tipo, respeta las llaves y el depurador lo ve.', '`const` has a type, respects braces and the debugger sees it.'),
	say('`#define` es texto sin tipo y vale hasta el final del archivo.', '`#define` is untyped text that lasts to the end of the file.'),
	say('Por eso se prefiere `const`; `#define` es para el preprocesador.', 'So prefer `const`; leave `#define` for the preprocessor.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'declare', label: { es: 'Declarar e inicializar', en: 'Declare and initialize' } },
		{ id: 'unset', label: { es: 'Sin inicializar', en: 'Uninitialized' } },
		{ id: 'literal', label: { es: 'Literales con sufijo', en: 'Suffixed literals' } },
		{ id: 'const', label: { es: 'La caja con candado', en: 'The locked box' } },
		{ id: 'define', label: { es: 'Texto que se reemplaza', en: 'Text that is replaced' } },
		{ id: 'prefer', label: { es: 'Cuál elegir', en: 'Which one to pick' } },
	],
	steps: [
		// ─── Scene 1. Declare, initialize, assign ───────────────────────────
		{
			id: 'declare',
			chapter: 'declare',
			scene: 'journey',
			title: { es: 'Una caja con tipo y nombre', en: 'A box with a type and a name' },
			subtitles: declare.list,
			motion: {
				cues: seq(
					shot(0, 'shot-shelf', 3500),
					{ at: 100, do: 'enter', el: 'w-main' },
					{ at: 200, do: 'type', el: 'ed-main', dur: 1000 },
					{ at: 200, do: 'enter', el: 'co-main' },
					...modules(500, 'main', [3, 6, 7, 8, 9, 11, 13, 14, 15, 16], 90),
					{ at: 1500, do: 'enter', el: 'hl' },
					{ at: 1500, do: 'enter', el: 'p' },
					// Line 6 runs inside the first caption: a `const` box, with its first value.
					...run(2300, 'main', 6, 700),
					{ at: 2900, do: 'draw', el: 'fl-main-6', dur: 700 },
					{ at: 3300, do: 'enter', el: 'b-iva' },
					...store(3500, 'tk-iva', 'iva', 900),
					// Line 7: first the box is declared, then it is initialized.
					...run(declare.start(1), 'main', 7, 700, 6),
					{ at: declare.start(1) + 800, do: 'enter', el: 'b-edad' },
					{ at: declare.start(1) + 1000, do: 'enter', el: 'lb-decl' },
					{ at: declare.start(1) + 1600, do: 'pulse', el: 'b-edad' },
					{ at: declare.start(1) + 2400, do: 'pulse', el: 'lb-decl' },
					{ at: declare.start(2), do: 'draw', el: 'fl-main-7', dur: 700 },
					...store(declare.start(2) + 100, 'tk-e18', 'edad', 1000),
					{ at: declare.start(2) + 300, do: 'exit', el: 'lb-decl', dur: 300 },
					{ at: declare.start(2) + 900, do: 'enter', el: 'lb-init' },
					{ at: declare.start(2) + 1500, do: 'pulse', el: 'tk-e18' },
					{ at: declare.start(2) + 2400, do: 'pulse', el: 'lb-init' },
				),
			},
		},
		{
			id: 'assign',
			chapter: 'declare',
			scene: 'journey',
			title: { es: 'Asignar reemplaza el valor', en: 'Assigning replaces the value' },
			subtitles: assign.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-init', 'fl-main-6', 'fl-main-7'),
					...run(200, 'main', 8, 700, 7),
					{ at: 600, do: 'draw', el: 'fl-main-8', dur: 700 },
					{ at: 900, do: 'enter', el: 'b-precio' },
					...store(1000, 'tk-precio', 'precio', 1000),
					...run(2400, 'main', 9, 700, 8),
					{ at: 2800, do: 'draw', el: 'fl-main-9', dur: 700 },
					{ at: 3100, do: 'enter', el: 'b-inicial' },
					...store(3200, 'tk-inicial', 'inicial', 1000),
					// Line 11: the new value takes the place of the old one, in the same box.
					...run(assign.start(1), 'main', 11, 700, 9),
					{ at: assign.start(1) + 600, do: 'draw', el: 'fl-main-11', dur: 700 },
					{ at: assign.start(1) + 900, do: 'enter', el: 'lb-assign' },
					{ at: assign.start(1) + 1000, do: 'enter', el: 'tk-e19' },
					{ at: assign.start(1) + 1100, do: 'move', el: 'tk-e19', to: 'a-b-edad', dur: 1000 },
					{ at: assign.start(1) + 1700, do: 'exit', el: 'tk-e18', dur: 400 },
					{ at: assign.start(1) + 2300, do: 'pulse', el: 'b-edad' },
					{ at: assign.start(1) + 2600, do: 'pulse', el: 'tk-e19' },
					// Lines 13 to 15 read the boxes and print the real output.
					...clear(assign.start(2), 'lb-assign', 'fl-main-8', 'fl-main-9', 'fl-main-11'),
					...run(assign.start(2), 'main', 13, 600, 11),
					out(assign.start(2) + 600, 'main', 1),
					{ at: assign.start(2) + 700, do: 'pulse', el: 'b-edad' },
					...run(assign.start(2) + 1500, 'main', 14, 600, 13),
					out(assign.start(2) + 2100, 'main', 2),
					{ at: assign.start(2) + 2200, do: 'pulse', el: 'b-inicial' },
					...run(assign.start(2) + 3000, 'main', 15, 600, 14),
					out(assign.start(2) + 3600, 'main', 3, 900),
					{ at: assign.start(2) + 3700, do: 'pulse', el: 'b-precio' },
					{ at: assign.start(2) + 3900, do: 'pulse', el: 'b-iva' },
				),
			},
		},

		// ─── Scene 2. A box that was never initialized ──────────────────────
		{
			id: 'unset',
			chapter: 'unset',
			scene: 'journey',
			title: { es: 'Una caja sin inicializar', en: 'A box that was never initialized' },
			subtitles: unset.list,
			motion: {
				cues: seq(
					...leave(0, 'main', 'on-main-15'),
					shot(0, 'shot-bug', 2400),
					...arrive(400, 'bug', 4),
					...modules(900, 'bug', [4, 5, 6], 100),
					{ at: 1500, do: 'enter', el: 'on-bug-4' },
					{ at: 1700, do: 'enter', el: 'b-total' },
					{ at: 2400, do: 'enter', el: 'lb-empty' },
					{ at: 3000, do: 'pulse', el: 'b-total' },
					// Whatever the memory held fills the box with an indeterminate "?".
					{ at: unset.start(1) + 200, do: 'enter', el: 'lo-1' },
					{ at: unset.start(1) + 450, do: 'enter', el: 'lo-2' },
					{ at: unset.start(1) + 700, do: 'enter', el: 'lo-3' },
					{ at: unset.start(1) + 500, do: 'exit', el: 'lb-empty', dur: 300 },
					{ at: unset.start(1) + 1500, do: 'move', el: 'lo-1', to: 'a-b-total', dur: 900 },
					{ at: unset.start(1) + 1500, do: 'move', el: 'lo-2', to: 'a-b-total', dur: 900 },
					{ at: unset.start(1) + 1500, do: 'move', el: 'lo-3', to: 'a-b-total', dur: 900 },
					...clear(unset.start(1) + 2400, 'lo-1', 'lo-2', 'lo-3'),
					{ at: unset.start(1) + 2500, do: 'enter', el: 'tk-q' },
					{ at: unset.start(1) + 2700, do: 'enter', el: 'lb-indet' },
					{ at: unset.start(1) + 3200, do: 'pulse', el: 'tk-q' },
					// Line 5 reads it: the compiler warns; the fix is to initialize.
					...run(unset.start(2), 'bug', 5, 700, 4),
					{ at: unset.start(2) + 700, do: 'enter', el: 'hx-bug-5' },
					{ at: unset.start(2) + 900, do: 'draw', el: 'fl-bug-5', dur: 800 },
					out(unset.start(2) + 1500, 'bug', 1, 800),
					out(unset.start(2) + 2300, 'bug', 2, 800),
					{ at: unset.start(2) + 1700, do: 'enter', el: 'lb-noread' },
					...clear(unset.start(2) + 3300, 'lb-indet', 'lb-noread', 'hx-bug-5', 'fl-bug-5'),
					{ at: unset.start(2) + 3500, do: 'enter', el: 'fx-init' },
					{ at: unset.start(2) + 3700, do: 'enter', el: 'tk-zero' },
					{ at: unset.start(2) + 3800, do: 'move', el: 'tk-zero', to: 'a-b-total', dur: 800 },
					{ at: unset.start(2) + 4000, do: 'exit', el: 'tk-q', dur: 400 },
				),
			},
		},

		// ─── Scene 3. Literals and their suffixes ───────────────────────────
		{
			id: 'literals',
			chapter: 'literal',
			scene: 'journey',
			title: { es: 'El tipo de un literal', en: 'The type of a literal' },
			subtitles: literals.list,
			motion: {
				cues: seq(
					...leave(0, 'bug', 'on-bug-5'),
					shot(0, 'shot-lit', 2400),
					...arrive(400, 'lit', 4),
					...modules(900, 'lit', [4, 5, 6, 7, 8, 9], 100),
					{ at: 1500, do: 'enter', el: 'on-lit-4' },
					{ at: 1600, do: 'draw', el: 'fl-lit-4', dur: 700 },
					{ at: 1900, do: 'enter', el: 'b-dec' },
					...store(2000, 'tk-dec', 'dec', 900),
					{ at: 3000, do: 'enter', el: 'ty-dec' },
					// `100u`: the suffix turns an int literal into an unsigned int.
					...run(literals.start(1), 'lit', 5, 700, 4),
					{ at: literals.start(1) + 600, do: 'draw', el: 'fl-lit-5', dur: 700 },
					{ at: literals.start(1) + 800, do: 'enter', el: 'b-n' },
					...store(literals.start(1) + 900, 'tk-n', 'n', 900),
					{ at: literals.start(1) + 1900, do: 'enter', el: 'ty-n' },
					{ at: literals.start(1) + 2300, do: 'enter', el: 'lb-suffix' },
					{ at: literals.start(1) + 2900, do: 'pulse', el: 'tk-n' },
					// `3.14159` has no suffix (double); `9.81f` does (float).
					...run(literals.start(2), 'lit', 6, 600, 5),
					{ at: literals.start(2) + 500, do: 'draw', el: 'fl-lit-6', dur: 600 },
					{ at: literals.start(2) + 700, do: 'enter', el: 'b-pi' },
					...store(literals.start(2) + 800, 'tk-pi', 'pi', 800),
					{ at: literals.start(2) + 1700, do: 'enter', el: 'ty-pi' },
					...run(literals.start(2) + 1900, 'lit', 7, 600, 6),
					{ at: literals.start(2) + 2400, do: 'draw', el: 'fl-lit-7', dur: 600 },
					{ at: literals.start(2) + 2600, do: 'enter', el: 'b-g' },
					...store(literals.start(2) + 2700, 'tk-g', 'g', 800),
					{ at: literals.start(2) + 3600, do: 'enter', el: 'ty-g' },
					{ at: literals.start(2) + 4000, do: 'pulse', el: 'lb-suffix' },
					// Lines 8 and 9 print the real output.
					...run(literals.start(2) + 4000, 'lit', 8, 500, 7),
					out(literals.start(2) + 4500, 'lit', 1, 600),
					...run(literals.start(2) + 5000, 'lit', 9, 500, 8),
					out(literals.start(2) + 5500, 'lit', 2, 600),
				),
			},
		},

		// ─── Scene 4. The box with a lock ───────────────────────────────────
		{
			id: 'const',
			chapter: 'const',
			scene: 'journey',
			title: { es: 'Una caja con candado', en: 'A box with a lock' },
			subtitles: constant.list,
			motion: {
				cues: seq(
					...leave(0, 'lit', 'on-lit-9'),
					shot(0, 'shot-const', 2400),
					...arrive(400, 'const', 2),
					...modules(900, 'const', [2, 3], 100),
					{ at: 1500, do: 'enter', el: 'on-const-2' },
					{ at: 1600, do: 'draw', el: 'fl-const-2', dur: 700 },
					{ at: 1800, do: 'enter', el: 'b-days' },
					...store(1900, 'tk-days', 'days', 900),
					{ at: 2900, do: 'enter', el: 'lk-days' },
					{ at: 3200, do: 'enter', el: 'lb-fixed' },
					{ at: 3700, do: 'pulse', el: 'lk-days' },
					// Line 3 tries to put another value in: the compiler refuses.
					...run(constant.start(1), 'const', 3, 700, 2),
					{ at: constant.start(1) + 700, do: 'enter', el: 'hx-const-3' },
					{ at: constant.start(1) + 800, do: 'enter', el: 'tk-try' },
					{ at: constant.start(1) + 800, do: 'draw', el: 'fl-const-3', dur: 900 },
					{ at: constant.start(1) + 900, do: 'move', el: 'tk-try', to: 'a-try', dur: 900 },
					{ at: constant.start(1) + 1900, do: 'enter', el: 'ban-days' },
					{ at: constant.start(1) + 2200, do: 'enter', el: 'er-const' },
					{ at: constant.start(1) + 2300, do: 'exit', el: 'tk-try', dur: 300 },
					out(constant.start(1) + 2400, 'const', 1, 800),
					out(constant.start(1) + 3200, 'const', 2, 800),
					{ at: constant.start(2) + 300, do: 'pulse', el: 'lk-days' },
					{ at: constant.start(2) + 900, do: 'pulse', el: 'er-const' },
					{ at: constant.start(2) + 1500, do: 'pulse', el: 'b-days' },
				),
			},
		},

		// ─── Scene 5. #define: text, not a box ──────────────────────────────
		{
			id: 'define',
			chapter: 'define',
			scene: 'journey',
			title: { es: 'Texto que se reemplaza', en: 'Text that gets replaced' },
			subtitles: define.list,
			motion: {
				cues: seq(
					...leave(0, 'const', 'on-const-3'),
					shot(0, 'shot-define', 2600),
					...arrive(400, 'main', 3),
					{ at: 1300, do: 'enter', el: 'on-main-3' },
					{ at: 1500, do: 'enter', el: 'st-pp' },
					{ at: 1700, do: 'enter', el: 'lb-pp' },
					{ at: 2000, do: 'pulse', el: 'on-main-3' },
					{ at: 2200, do: 'enter', el: 'gh-def' },
					{ at: 2600, do: 'enter', el: 'lb-nobox' },
					// The use of the name travels to the preprocessor and comes back as plain text.
					{ at: define.start(1), do: 'enter', el: 'tx-src' },
					{ at: define.start(1) + 200, do: 'move', el: 'tx-src', to: 'a-st', dur: 1500 },
					{ at: define.start(1) + 1800, do: 'enter', el: 'on-st' },
					{ at: define.start(1) + 1800, do: 'pulse', el: 'st-pp' },
					{ at: define.start(1) + 1900, do: 'exit', el: 'tx-src', dur: 300 },
					{ at: define.start(1) + 2000, do: 'enter', el: 'tx-out' },
					{ at: define.start(1) + 2300, do: 'move', el: 'tx-out', to: 'a-m-main-16', dur: 1400 },
					...clear(define.start(2), 'on-st', 'on-main-3'),
					...run(define.start(2), 'main', 16, 600, 3),
					out(define.start(2) + 700, 'main', 4, 800),
					{ at: define.start(2) + 900, do: 'pulse', el: 'tx-out' },
					{ at: define.start(2) + 1800, do: 'pulse', el: 'gh-def' },
					{ at: define.start(2) + 2400, do: 'exit', el: 'tx-out', dur: 400 },
				),
			},
		},
		{
			id: 'trap',
			chapter: 'define',
			scene: 'journey',
			title: { es: 'La macro sin paréntesis', en: 'The macro without parentheses' },
			subtitles: trap.list,
			motion: {
				cues: seq(
					...leave(0, 'main', 'on-main-16', 'tx-out'),
					shot(0, 'shot-trap', 2400),
					...arrive(400, 'macro', 3),
					...modules(900, 'macro', [3, 6, 7], 100),
					{ at: 1300, do: 'enter', el: 'on-macro-3' },
					{ at: 1450, do: 'pulse', el: 'st-pp' },
					...run(1600, 'macro', 6, 700, 3),
					{ at: 2300, do: 'enter', el: 'x-src' },
					{ at: 2400, do: 'draw', el: 'fl-x-in', dur: 700 },
					{ at: 3100, do: 'pulse', el: 'st-pp' },
					{ at: 3100, do: 'enter', el: 'on-st' },
					{ at: 3200, do: 'draw', el: 'fl-x-out', dur: 700 },
					{ at: 3600, do: 'enter', el: 'x-exp' },
					{ at: trap.start(1) + 300, do: 'enter', el: 'x-calc' },
					{ at: trap.start(1) + 400, do: 'enter', el: 'hx-macro-6' },
					...run(trap.start(1) + 1200, 'macro', 7, 600, 6),
					out(trap.start(1) + 1800, 'macro', 1, 400),
					{ at: trap.start(1) + 2000, do: 'pulse', el: 'x-calc' },
					...clear(trap.start(2), 'x-src', 'x-exp', 'x-calc', 'hx-macro-6', 'fl-x-in', 'fl-x-out', 'on-st'),
					{ at: trap.start(2) + 500, do: 'enter', el: 'x-fix' },
					{ at: trap.start(2) + 1300, do: 'enter', el: 'x-ok' },
					{ at: trap.start(2) + 2200, do: 'pulse', el: 'x-ok' },
				),
			},
		},

		// ─── Scene 6. Which one to pick ─────────────────────────────────────
		{
			id: 'prefer',
			chapter: 'prefer',
			scene: 'journey',
			title: { es: 'Por qué se prefiere const', en: 'Why const is preferred' },
			subtitles: prefer.list,
			motion: {
				cues: seq(
					...leave(0, 'macro', 'st-pp', 'lb-pp', 'on-st'),
					shot(100, 'shot-pull', 2600),
					...arrive(400, 'main', 16),
					{ at: 1300, do: 'enter', el: 'pf-c-h' },
					{ at: 1600, do: 'enter', el: 'pf-c-1' },
					{ at: 1800, do: 'enter', el: 'pf-c-2' },
					{ at: 2000, do: 'enter', el: 'pf-c-3' },
					{ at: 2500, do: 'pulse', el: 'b-iva' },
					{ at: prefer.start(1) + 200, do: 'enter', el: 'pf-d-h' },
					{ at: prefer.start(1) + 500, do: 'enter', el: 'pf-d-1' },
					{ at: prefer.start(1) + 700, do: 'enter', el: 'pf-d-2' },
					{ at: prefer.start(1) + 900, do: 'enter', el: 'pf-d-3' },
					{ at: prefer.start(1) + 1500, do: 'pulse', el: 'gh-def' },
					shot(prefer.start(2), 'shot-all', 3000),
					{ at: prefer.start(2) + 300, do: 'enter', el: 'pf-when' },
					{ at: prefer.start(2) + 1300, do: 'pulse', el: 'pf-c-h' },
					{ at: prefer.start(2) + 1900, do: 'pulse', el: 'pf-d-h' },
					{ at: prefer.start(2) + 2500, do: 'pulse', el: 'pf-when' },
				),
			},
		},
	],
};
