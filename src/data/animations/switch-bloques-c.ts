import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The switch jump and the life of a block": a short film (about two minutes) for the
// C lesson "Switch y Bloques" (`sentencia-switch-y-bloques-de-codigo`). It plays on a
// single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/switch-bloques-c.astro`). The editor shows two of the
// lesson's programs in turn: the `plan` switch with `[[fallthrough]]`, and the block
// that shadows `x`. On the right, the body of the switch is one plate with a row of
// doors (the `case` labels) over a single lane of code; the value of `plan` is a token
// that jumps straight to its door, and a light blue particle is the execution flow.
// Then the camera moves to a second floor: `main` with an inner block, raised like an
// enclosure, whose variable lives and dies inside it.

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

/** The particle and the editor bar travel together to the module of one line of `plan.c`. */
const runTo = (at: number, line: number, dur = 900): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a-m${line}`, dur },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 700) },
];

/** The same, for a line of the block program. */
const runToB = (at: number, line: number, dur = 900): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a-b${line}`, dur },
	{ at, do: 'move', el: 'hl', to: `ln-b-${line}`, dur: Math.min(dur, 700) },
];

/** Leaves elements of the previous run behind, all at once. */
const clear = (at: number, ...ids: string[]): MotionCue[] => ids.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

// ─── Captions ───────────────────────────────────────────────────────────────
const build = timed(
	say('Cada módulo es una instrucción y muestra su línea del editor.', 'Each module is an instruction and shows its editor line.'),
	say(
		'Las etiquetas `case` son puertas: puntos de entrada al bloque del `switch`. `plan` vale 3.',
		'The `case` labels are doors: entry points into the block of the `switch`. `plan` is 3.',
	),
);
const jump = timed(
	say(
		'La línea 6 evalúa `plan` una sola vez y salta directo a la etiqueta que coincide.',
		'Line 6 evaluates `plan` once and jumps straight to the matching label.',
	),
	say('No pasa por `case 1` ni por `case 2`: el valor 3 elige su puerta.', 'It skips `case 1` and `case 2`: the value 3 picks its door.'),
	say('Desde ahí el código corre hacia abajo. La línea 14 imprime «- correo».', 'From there the code runs downwards. Line 14 prints “- email”.'),
);
const leave = timed(
	say('La línea 15 es `break`: termina el `switch` en ese mismo punto.', 'Line 15 is `break`: it ends the `switch` right there.'),
	say('La ejecución sigue después de la llave de cierre, en la línea 21.', 'Execution continues after the closing brace, at line 21.'),
);
const fall = timed(
	say('Ahora `plan` vale 2. El salto lleva a `case 2` y la línea 11 imprime.', 'Now `plan` is 2. The jump lands on `case 2` and line 11 prints.'),
	say(
		'Sin `break`, la ejecución cae al siguiente caso: las etiquetas son solo puntos de entrada.',
		'Without `break`, execution falls into the next case: labels are only entry points.',
	),
);
const mark = timed(
	say('GCC lo advierte con `-Wextra`, pero aquí la caída se busca: el plan 2 incluye el correo.', 'GCC warns with `-Wextra`, but here the fall is wanted: plan 2 includes email too.'),
	say(
		'`[[fallthrough]];` (C23) avisa al compilador y a quien lee: la caída es intencional.',
		'`[[fallthrough]];` (C23) tells the compiler and the reader: the fall-through is intentional.',
	),
	say('Sin advertencia. Si la caída no fuera querida, faltaría un `break`.', 'No warning now. If the fall were unwanted, a `break` would be missing.'),
);
const other = timed(
	say('Con `plan` en 7 no coincide ninguna etiqueta: el salto va a `default`.', 'With `plan` at 7 no label matches: the jump goes to `default`.'),
	say(
		'`default` atrapa todos los valores que no tienen su `case`. Sin él, no se ejecutaría nada.',
		'`default` catches every value without its own `case`. Without it, nothing would run.',
	),
);
const scope = timed(
	say(
		'Otro programa: la línea 7 declara otra `x` dentro de un bloque `{ }`.',
		'Another program: line 7 declares another `x` inside a block `{ }`.',
	),
	say('La `x` interior oculta a la de afuera: la línea 8 imprime «adentro: 2».', 'The inner `x` shadows the outer one: line 8 prints “inside: 2”.'),
	say('Una variable de bloque solo se ve dentro de su bloque: ese es su alcance.', 'A block variable is visible only inside its block: that is its scope.'),
);
const close = timed(
	say('En la llave de cierre de la línea 9 el bloque termina y su `x` deja de existir.', 'At the closing brace on line 9 the block ends and its `x` ceases to exist.'),
	say('La línea 11 encuentra la `x` de afuera, que siempre valió 1: «afuera: 1».', 'Line 11 finds the outer `x`, which was 1 all along: “outside: 1”.'),
	say(
		'`switch` salta a su `case`, `break` sale y cada bloque guarda sus variables.',
		'`switch` jumps to its `case`, `break` leaves, and each block keeps its own variables.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'jump', label: { es: 'El salto al case', en: 'The jump to the case' } },
		{ id: 'break', label: { es: 'break sale', en: 'break leaves' } },
		{ id: 'fall', label: { es: 'La caída', en: 'Falling through' } },
		{ id: 'default', label: { es: 'default', en: 'default' } },
		{ id: 'block', label: { es: 'Un bloque { }', en: 'A block { }' } },
		{ id: 'close', label: { es: 'Muere al cerrar', en: 'Gone at the brace' } },
	],
	steps: [
		// ─── Scene 1. The jump to the case ──────────────────────────────────
		{
			id: 'build',
			chapter: 'jump',
			scene: 'journey',
			title: { es: 'Un switch y sus puertas', en: 'A switch and its doors' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-build', 4000),
					{ at: 100, do: 'enter', el: 'f-main', dur: 800 },
					{ at: 400, do: 'enter', el: 'sw-body', dur: 800 },
					{ at: 700, do: 'enter', el: 'm-4' },
					{ at: 950, do: 'enter', el: 'm-6' },
					{ at: 1200, do: 'enter', el: 'm-8' },
					{ at: 1400, do: 'enter', el: 'm-11' },
					{ at: 1600, do: 'enter', el: 'm-14' },
					{ at: 1800, do: 'enter', el: 'm-15' },
					{ at: 2000, do: 'enter', el: 'm-17' },
					{ at: 2200, do: 'enter', el: 'm-18' },
					{ at: 2400, do: 'enter', el: 'm-21' },
					{ at: build.start(1), do: 'enter', el: 'd-1' },
					{ at: build.start(1) + 400, do: 'enter', el: 'd-2' },
					{ at: build.start(1) + 800, do: 'enter', el: 'd-3' },
					{ at: build.start(1) + 1200, do: 'enter', el: 'd-4' },
					{ at: build.start(1) + 2000, do: 'pulse', el: 'sw-body' },
					{ at: build.start(1) + 1800, do: 'enter', el: 'lb-entry' },
					{ at: build.start(1) + 3600, do: 'enter', el: 'hl' },
					{ at: build.start(1) + 3600, do: 'enter', el: 'p' },
					{ at: build.start(1) + 4000, do: 'enter', el: 'on-4' },
					{ at: build.start(1) + 4000, do: 'pulse', el: 'm-4' },
					{ at: build.start(1) + 4400, do: 'enter', el: 'tk-3' },
				),
			},
		},
		{
			id: 'jump',
			chapter: 'jump',
			scene: 'journey',
			title: { es: 'El salto al case que coincide', en: 'The jump to the matching case' },
			subtitles: jump.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'on-4', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-entry', dur: 400 },
					shot(0, 'shot-doors', 2200),
					...runTo(200, 6),
					{ at: 200, do: 'move', el: 'tk-3', to: 'a-k6', dur: 900 },
					{ at: 1100, do: 'enter', el: 'on-6' },
					{ at: 1100, do: 'pulse', el: 'm-6' },
					{ at: 1600, do: 'enter', el: 'lb-once' },
					// The value picks its door: one jump, no visit to the other labels.
					{ at: 2600, do: 'move', el: 'tk-3', to: 'a-d3', dur: 1400 },
					{ at: 4000, do: 'enter', el: 'on-d3' },
					{ at: 4000, do: 'pulse', el: 'd-3' },
					{ at: jump.start(1), do: 'exit', el: 'lb-once', dur: 400 },
					{ at: jump.start(1) + 300, do: 'pulse', el: 'd-1' },
					{ at: jump.start(1) + 700, do: 'pulse', el: 'd-2' },
					{ at: jump.start(1) + 1100, do: 'enter', el: 'lb-skip' },
					{ at: jump.start(1) + 1500, do: 'move', el: 'p', to: 'a-d3', dur: 1100 },
					{ at: jump.start(1) + 1500, do: 'move', el: 'hl', to: 'ln-13', dur: 700 },
					{ at: jump.start(2), do: 'exit', el: 'lb-skip', dur: 400 },
					{ at: jump.start(2), do: 'exit', el: 'on-6', dur: 400 },
					...runTo(jump.start(2) + 200, 14, 800),
					{ at: jump.start(2) + 1000, do: 'enter', el: 'on-14' },
					{ at: jump.start(2) + 1000, do: 'pulse', el: 'm-14' },
					{ at: jump.start(2) + 1200, do: 'type', el: 'out-1', dur: 600 },
				),
			},
		},

		// ─── Scene 2. break leaves ──────────────────────────────────────────
		{
			id: 'break',
			chapter: 'break',
			scene: 'journey',
			title: { es: 'break sale del switch', en: 'break leaves the switch' },
			subtitles: leave.list,
			motion: {
				cues: seq(
					shot(0, 'shot-end', 2200),
					...runTo(300, 15, 800),
					{ at: 1100, do: 'enter', el: 'on-15' },
					{ at: 1100, do: 'pulse', el: 'm-15' },
					{ at: 1600, do: 'enter', el: 'lb-break' },
					{ at: 2400, do: 'exit', el: 'tk-3', dur: 500 },
					{ at: leave.start(1), do: 'draw', el: 'fl-break', dur: 1100 },
					...runTo(leave.start(1) + 300, 21, 1500),
					{ at: leave.start(1) + 1800, do: 'enter', el: 'on-21' },
					{ at: leave.start(1) + 1800, do: 'pulse', el: 'm-21' },
					{ at: leave.start(1) + 2200, do: 'enter', el: 'lb-after' },
					{ at: leave.start(1) + 3000, do: 'pulse', el: 'sw-body' },
				),
			},
		},

		// ─── Scene 3. Falling through ───────────────────────────────────────
		{
			id: 'fall',
			chapter: 'fall',
			scene: 'journey',
			title: { es: 'Sin break, cae', en: 'Without break, it falls through' },
			subtitles: fall.list,
			motion: {
				cues: seq(
					...clear(0, 'on-21', 'lb-after', 'lb-break', 'fl-break', 'on-d3', 'on-14', 'on-15', 'out-1'),
					shot(200, 'shot-doors', 2000),
					// A new run: the value on line 4 is now 2.
					{ at: 300, do: 'exit', el: 'l4-3', dur: 300 },
					{ at: 400, do: 'enter', el: 'l4-2' },
					{ at: 400, do: 'move', el: 'p', to: 'a-m4', dur: 700 },
					{ at: 400, do: 'move', el: 'hl', to: 'ln-4', dur: 600 },
					{ at: 1100, do: 'enter', el: 'on-4' },
					{ at: 1100, do: 'enter', el: 'tk-2' },
					{ at: 1500, do: 'exit', el: 'on-4', dur: 300 },
					...runTo(1500, 6, 700),
					{ at: 1500, do: 'move', el: 'tk-2', to: 'a-k6', dur: 700 },
					{ at: 2200, do: 'pulse', el: 'm-6' },
					{ at: 2300, do: 'move', el: 'tk-2', to: 'a-d2', dur: 1000 },
					{ at: 3300, do: 'enter', el: 'on-d2' },
					...runTo(3400, 11, 800),
					{ at: 4200, do: 'enter', el: 'on-11' },
					{ at: 4300, do: 'type', el: 'out-2', dur: 800 },
					// No break after line 11: the flow goes on, through the next label.
					shot(fall.start(1), 'shot-lane', 1800),
					{ at: fall.start(1) + 600, do: 'draw', el: 'fl-fall', dur: 1600 },
					{ at: fall.start(1) + 600, do: 'move', el: 'p', to: 'a-m14', dur: 1600 },
					{ at: fall.start(1) + 600, do: 'move', el: 'hl', to: 'ln-14', dur: 1200 },
					{ at: fall.start(1) + 1300, do: 'pulse', el: 'd-3' },
					{ at: fall.start(1) + 2200, do: 'enter', el: 'on-14' },
					{ at: fall.start(1) + 2300, do: 'type', el: 'out-3', dur: 600 },
					{ at: fall.start(1) + 2800, do: 'enter', el: 'lb-fall' },
					{ at: fall.start(1) + 3400, do: 'enter', el: 'hx-11' },
					{ at: fall.start(1) + 3700, do: 'enter', el: 'warn' },
					{ at: fall.start(1) + 4600, do: 'pulse', el: 'warn' },
					{ at: fall.start(1) + 5200, do: 'pulse', el: 'd-3' },
				),
			},
		},
		{
			id: 'mark',
			chapter: 'fall',
			scene: 'journey',
			title: { es: '[[fallthrough]]: una caída a propósito', en: '[[fallthrough]]: a deliberate fall' },
			subtitles: mark.list,
			motion: {
				cues: seq(
					{ at: 300, do: 'pulse', el: 'out-2' },
					{ at: 900, do: 'pulse', el: 'out-3' },
					{ at: 1600, do: 'pulse', el: 'on-d2' },
					// The attribute is written in the code, right before the next label.
					{ at: mark.start(1), do: 'exit', el: 'hx-11', dur: 400 },
					{ at: mark.start(1) + 200, do: 'type', el: 'ft-12', dur: 900 },
					{ at: mark.start(1) + 1200, do: 'enter', el: 'm-12' },
					{ at: mark.start(1) + 1200, do: 'exit', el: 'fl-fall', dur: 500 },
					{ at: mark.start(1) + 1500, do: 'draw', el: 'fl-ok', dur: 1200 },
					{ at: mark.start(1) + 1500, do: 'exit', el: 'lb-fall', dur: 400 },
					{ at: mark.start(1) + 1900, do: 'enter', el: 'lb-intent' },
					{ at: mark.start(1) + 2600, do: 'type', el: 'ft-9', dur: 900 },
					{ at: mark.start(1) + 3600, do: 'enter', el: 'm-9' },
					{ at: mark.start(2), do: 'exit', el: 'warn', dur: 500 },
					{ at: mark.start(2) + 600, do: 'pulse', el: 'm-12' },
					{ at: mark.start(2) + 1200, do: 'pulse', el: 'lb-intent' },
				),
			},
		},

		// ─── Scene 4. default ───────────────────────────────────────────────
		{
			id: 'default',
			chapter: 'default',
			scene: 'journey',
			title: { es: 'default atrapa el resto', en: 'default catches the rest' },
			subtitles: other.list,
			motion: {
				cues: seq(
					...clear(0, 'on-d2', 'on-11', 'on-14', 'out-2', 'out-3', 'fl-ok', 'lb-intent', 'tk-2'),
					shot(200, 'shot-build', 2000),
					{ at: 300, do: 'exit', el: 'l4-2', dur: 300 },
					{ at: 600, do: 'enter', el: 'l4-7' },
					{ at: 600, do: 'move', el: 'p', to: 'a-m4', dur: 1100 },
					{ at: 600, do: 'move', el: 'hl', to: 'ln-4', dur: 700 },
					{ at: 1700, do: 'enter', el: 'tk-7' },
					...runTo(2200, 6, 700),
					{ at: 2200, do: 'move', el: 'tk-7', to: 'a-k6', dur: 700 },
					{ at: 2900, do: 'pulse', el: 'm-6' },
					// No label matches: the doors stay shut and default takes the value.
					{ at: other.start(1), do: 'pulse', el: 'd-1' },
					{ at: other.start(1) + 300, do: 'pulse', el: 'd-2' },
					{ at: other.start(1) + 600, do: 'pulse', el: 'd-3' },
					{ at: other.start(1) + 1000, do: 'move', el: 'tk-7', to: 'a-d4', dur: 1500 },
					{ at: other.start(1) + 2500, do: 'enter', el: 'on-d4' },
					{ at: other.start(1) + 2600, do: 'enter', el: 'lb-default' },
					{ at: other.start(1) + 2700, do: 'move', el: 'p', to: 'a-d4', dur: 1000 },
					{ at: other.start(1) + 2700, do: 'move', el: 'hl', to: 'ln-16', dur: 700 },
					shot(other.start(1) + 4000, 'shot-end', 1800),
					{ at: other.start(1) + 4000, do: 'exit', el: 'lb-default', dur: 400 },
					...runTo(other.start(1) + 4200, 17, 800),
					{ at: other.start(1) + 5000, do: 'enter', el: 'on-17' },
					{ at: other.start(1) + 5100, do: 'type', el: 'out-4', dur: 900 },
					...runTo(other.start(1) + 6100, 18, 600),
					{ at: other.start(1) + 6700, do: 'enter', el: 'on-18' },
					{ at: other.start(1) + 6800, do: 'draw', el: 'fl-break2', dur: 800 },
					{ at: other.start(1) + 6900, do: 'exit', el: 'tk-7', dur: 400 },
					...runTo(other.start(1) + 7000, 21, 1000),
					{ at: other.start(1) + 8000, do: 'enter', el: 'on-21' },
				),
			},
		},

		// ─── Scene 5. A block { } ───────────────────────────────────────────
		{
			id: 'scope',
			chapter: 'block',
			scene: 'journey',
			title: { es: 'Un bloque y su variable', en: 'A block and its variable' },
			subtitles: scope.list,
			motion: {
				cues: seq(
					// The editor opens the second program of the lesson.
					...clear(0, 'on-d4', 'on-17', 'on-18', 'on-21', 'fl-break2', 'out-4', 'p', 'l4-7', 'ft-9', 'ft-12', 'ed-a', 'file-a', 'hl'),
					{ at: 500, do: 'enter', el: 'ed-b' },
					{ at: 500, do: 'enter', el: 'file-b' },
					shot(300, 'shot-block', 2600),
					{ at: 600, do: 'move', el: 'p', to: 'a-b4', dur: 1 },
					{ at: 600, do: 'move', el: 'hl', to: 'ln-b-4', dur: 1 },
					{ at: 900, do: 'enter', el: 'b-main', dur: 800 },
					{ at: 1300, do: 'enter', el: 'mb-4' },
					{ at: 1500, do: 'enter', el: 'mb-11' },
					{ at: 1700, do: 'enter', el: 'mb-12' },
					{ at: 2000, do: 'enter', el: 'hl' },
					{ at: 2000, do: 'enter', el: 'p' },
					{ at: 2300, do: 'enter', el: 'onb-4' },
					{ at: 2400, do: 'enter', el: 'cx-out' },
					// Line 6 opens the block; line 7 creates a second x inside it.
					{ at: 3200, do: 'exit', el: 'onb-4', dur: 300 },
					{ at: 3200, do: 'move', el: 'hl', to: 'ln-b-6', dur: 600 },
					{ at: 3500, do: 'enter', el: 'blk', dur: 800 },
					{ at: 3900, do: 'enter', el: 'zone-in' },
					...runToB(4300, 7, 900),
					{ at: 5200, do: 'enter', el: 'onb-7' },
					{ at: 5300, do: 'enter', el: 'cx-in' },
					{ at: 5600, do: 'pulse', el: 'cx-in' },
					{ at: scope.start(1), do: 'exit', el: 'onb-7', dur: 300 },
					...runToB(scope.start(1) + 100, 8, 700),
					{ at: scope.start(1) + 800, do: 'enter', el: 'onb-8' },
					{ at: scope.start(1) + 900, do: 'draw', el: 'fl-in', dur: 900 },
					{ at: scope.start(1) + 1600, do: 'enter', el: 'veil' },
					{ at: scope.start(1) + 1900, do: 'enter', el: 'lb-hidden' },
					{ at: scope.start(1) + 2300, do: 'type', el: 'out-5', dur: 700 },
					{ at: scope.start(2), do: 'draw', el: 'sc-in', dur: 900 },
					{ at: scope.start(2) + 600, do: 'pulse', el: 'zone-in' },
					{ at: scope.start(2) + 1000, do: 'enter', el: 'lb-scope' },
					{ at: scope.start(2) + 2000, do: 'pulse', el: 'blk' },
				),
			},
		},

		// ─── Scene 6. Gone at the brace ─────────────────────────────────────
		{
			id: 'close',
			chapter: 'close',
			scene: 'journey',
			title: { es: 'La llave de cierre', en: 'The closing brace' },
			subtitles: close.list,
			motion: {
				cues: seq(
					...clear(0, 'onb-8', 'fl-in', 'lb-scope', 'sc-in'),
					{ at: 200, do: 'move', el: 'hl', to: 'ln-b-9', dur: 600 },
					{ at: 900, do: 'pulse', el: 'blk' },
					// The block ends: its variable and its walls go with it.
					{ at: 1400, do: 'exit', el: 'cx-in', dur: 700 },
					{ at: 1800, do: 'exit', el: 'zone-in', dur: 600 },
					{ at: 2000, do: 'exit', el: 'blk', dur: 900 },
					{ at: 2400, do: 'exit', el: 'lb-hidden', dur: 400 },
					{ at: 2400, do: 'exit', el: 'veil', dur: 500 },
					{ at: 2800, do: 'enter', el: 'lb-gone' },
					{ at: close.start(1), do: 'exit', el: 'lb-gone', dur: 400 },
					...runToB(close.start(1) + 200, 11, 1000),
					{ at: close.start(1) + 1200, do: 'enter', el: 'onb-11' },
					{ at: close.start(1) + 1300, do: 'draw', el: 'fl-out', dur: 900 },
					{ at: close.start(1) + 2200, do: 'pulse', el: 'cx-out' },
					{ at: close.start(1) + 2500, do: 'type', el: 'out-6', dur: 700 },
					// The camera pulls back to reveal both floors: the switch and the block.
					{ at: close.start(2), do: 'exit', el: 'onb-11', dur: 400 },
					...runToB(close.start(2) + 100, 12, 700),
					{ at: close.start(2) + 800, do: 'enter', el: 'onb-12' },
					shot(close.start(2) + 500, 'shot-all', 3200),
					{ at: close.start(2) + 1500, do: 'enter', el: 'fl-break' },
					{ at: close.start(2) + 1900, do: 'flow', el: 'fl-break' },
					{ at: close.start(2) + 2300, do: 'pulse', el: 'd-1' },
					{ at: close.start(2) + 2500, do: 'pulse', el: 'd-2' },
					{ at: close.start(2) + 2700, do: 'pulse', el: 'd-3' },
					{ at: close.start(2) + 2900, do: 'pulse', el: 'd-4' },
					{ at: close.start(2) + 3600, do: 'exit', el: 'hl', dur: 400 },
				),
			},
		},
	],
};
