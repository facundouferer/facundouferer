import type { AnimationScript, MotionCue, Subtitle } from './types';

// "An expression that chooses": a short film (about two minutes) for the C lesson
// "Operador ternario" (order: 9). It plays on a single persistent canvas
// (`data-scene="ternary"` in `src/components/animaciones/operador-ternario-c.astro`):
// the program on the left, and on the right every `?:` drawn as the same machine,
// a condition cube that forks into two branch plates. The condition is evaluated,
// only the chosen plate lights up, and its value travels on as a token into an
// assignment, a `printf` argument or another ternary. The `100 / x` branch stays
// sealed (magenta) because it is never evaluated; violet marks what resolves the
// choice (the condition verdict, the conversion to `double`).

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
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/**
 * Runs editor line `line`: slides the bar to it, builds its module (the boxes a
 * declaration creates, the fork of a ternary or a printf machine) and sends the
 * execution particle there. Its lit state follows.
 */
const run = (at: number, line: number, lit = 700): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
	{ at: at + 100, do: 'enter', el: `m-${line}` },
	{ at: at + 100, do: 'move', el: 'p', to: `a-m${line}`, dur: 700 },
	{ at: at + lit, do: 'enter', el: `on-${line}` },
];

/**
 * Evaluates the fork of line `line`: the verdict of its condition appears, then
 * only the chosen plate lights up and its wire is drawn.
 */
const choose = (at: number, line: number): MotionCue[] => [
	{ at, do: 'enter', el: `cv-${line}` },
	{ at: at + 700, do: 'draw', el: `k-${line}`, dur: 700 },
	{ at: at + 1500, do: 'flow', el: `k-${line}` },
];

/** A value token glides from where it is to `to`. */
const glide = (at: number, el: string, to: string, dur = 900): MotionCue => ({ at, do: 'move', el, to, dur });

// ─── Captions ───────────────────────────────────────────────────────────────
const parts = timed(
	say(
		'Con `if-else` eliges instrucciones; con el ternario eliges un valor.',
		'With `if-else` you choose statements; with the ternary you choose a value.',
	),
	say(
		'Tres partes: la condición, el valor si es verdadera y el valor si es falsa.',
		'Three parts: the condition, the value if true and the value if false.',
	),
	say(
		'`a < b` es falsa: el resultado es `b`, y ese 5 se guarda en `menor`.',
		'`a < b` is false: the result is `b`, and that 5 is stored in `smaller`.',
	),
);
const argument = timed(
	say(
		'Todo el ternario es una expresión: produce un valor, como `a + b`.',
		'The whole ternary is an expression: it produces a value, like `a + b`.',
	),
	say(
		'Por eso va donde se espera un valor: como argumento de `printf`.',
		'So it goes wherever a value is expected: as an argument of `printf`.',
	),
	say(
		'`a > b` es verdadera: `printf` recibe 12 y lo muestra.',
		'`a > b` is true: `printf` receives 12 and prints it.',
	),
);
const lazy = timed(
	say(
		'Primero se evalúa la condición, y después solo la rama elegida.',
		'First the condition is evaluated, then only the chosen branch.',
	),
	say(
		'`x != 0` es falsa: `100 / x` no se evalúa, no hay división por cero.',
		'`x != 0` is false: `100 / x` is never evaluated, no division by zero.',
	),
	say(
		'Igual que el cortocircuito de `&&`. `r` vale 0.',
		'Just like the short circuit of `&&`. `r` is 0.',
	),
);
const ifelse = timed(
	say(
		'Este ternario expresa lo mismo que el `if-else` de al lado.',
		'This ternary says the same as the `if-else` next to it.',
	),
	say(
		'`if-else` es una sentencia: elige qué instrucción asigna `signo`.',
		'`if-else` is a statement: it chooses which statement assigns `sign`.',
	),
	say(
		'El ternario inicializa `signo` en la misma línea, incluso como `const`.',
		'The ternary initializes `sign` on the same line, even as `const`.',
	),
);
const type = timed(
	say(
		'El resultado tiene un solo tipo, aunque las ramas sean `int` y `double`.',
		'The result has a single type, even if the branches are `int` and `double`.',
	),
	say(
		'Se aplican las conversiones aritméticas habituales: el resultado es `double`.',
		'The usual arithmetic conversions apply: the result is a `double`.',
	),
	say('Se elige el 90, pero sale como 90.0.', 'The 90 is chosen, but it comes out as 90.0.'),
);
const print = timed(
	say(
		'`printf` muestra 0 -1 90.0: cada valor salió de un ternario.',
		'`printf` prints 0 -1 90.0: every value came out of a ternary.',
	),
	say(
		'Mantén las dos ramas del mismo tipo siempre que puedas.',
		'Keep both branches of the same type whenever you can.',
	),
);
const nested = timed(
	say(
		'El ternario se agrupa de derecha a izquierda: `a ? b : (c ? d : e)`.',
		'The ternary groups right to left: `a ? b : (c ? d : e)`.',
	),
	say(
		'`numero > 0` es falsa y `numero < 0` es verdadera: sale negativo.',
		'`number > 0` is false and `number < 0` is true: out comes negative.',
	),
	say(
		'Un nivel en cadena se sigue; más niveles son un acertijo: usa `else if`.',
		'One chained level can be followed; more are a puzzle: use `else if`.',
	),
);
const recap = timed(
	say(
		'Usa el ternario para elegir entre dos valores simples.',
		'Use the ternary to choose between two simple values.',
	),
	say(
		'Si cada camino tiene varias instrucciones o hay más casos, usa `if-else`.',
		'If each path has several statements or there are more cases, use `if-else`.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'parts', label: { es: 'Las tres partes', en: 'The three parts' } },
		{ id: 'expression', label: { es: 'Una expresión', en: 'An expression' } },
		{ id: 'lazy', label: { es: 'Solo una rama', en: 'Only one branch' } },
		{ id: 'ifelse', label: { es: 'Frente a if-else', en: 'Versus if-else' } },
		{ id: 'type', label: { es: 'Un solo tipo', en: 'A single type' } },
		{ id: 'nested', label: { es: 'Cuándo no usarlo', en: 'When not to use it' } },
	],
	steps: [
		// ─── Scene 1. The three parts ───────────────────────────────────────
		{
			id: 'parts',
			chapter: 'parts',
			scene: 'ternary',
			title: { es: 'Condición, rama verdadera, rama falsa', en: 'Condition, true branch, false branch' },
			subtitles: parts.list,
			motion: {
				cues: seq(
					shot(0, 'shot-parts', 2600),
					{ at: 200, do: 'enter', el: 'hl' },
					{ at: 300, do: 'enter', el: 'p' },
					...run(600, 4),
					{ at: parts.start(0) + 2600, do: 'enter', el: 'lb-value' },
					...clear(parts.start(1), 'on-4'),
					...run(parts.start(1) + 100, 5),
					{ at: parts.start(1) + 1200, do: 'pulse', el: 'c-5' },
					{ at: parts.start(1) + 2000, do: 'pulse', el: 'pt-5' },
					{ at: parts.start(1) + 2800, do: 'pulse', el: 'pf-5' },
					...choose(parts.start(2), 5),
					{ at: parts.start(2) + 1600, do: 'enter', el: 't-r5' },
					glide(parts.start(2) + 1800, 't-r5', 'a-menor'),
					{ at: parts.start(2) + 2700, do: 'exit', el: 't-r5', dur: 300 },
					{ at: parts.start(2) + 2700, do: 'enter', el: 'v-menor' },
				),
			},
		},

		// ─── Scene 2. An expression, a value ────────────────────────────────
		{
			id: 'argument',
			chapter: 'expression',
			scene: 'ternary',
			title: { es: 'El ternario produce un valor', en: 'The ternary produces a value' },
			subtitles: argument.list,
			motion: {
				cues: seq(
					...clear(0, 'on-5', 'lb-value'),
					shot(0, 'shot-arg', 2600),
					...run(400, 6),
					{ at: 1100, do: 'enter', el: 't-c6' },
					glide(1300, 't-c6', 'a-in6'),
					{ at: 2200, do: 'exit', el: 't-c6', dur: 300 },
					{ at: 2300, do: 'type', el: 'o-6', dur: 700 },
					{ at: argument.start(0) + 3400, do: 'enter', el: 'lb-expr' },
					...clear(argument.start(1), 'on-6'),
					...run(argument.start(1) + 100, 7),
					{ at: argument.start(1) + 1400, do: 'pulse', el: 'c-7' },
					...choose(argument.start(2), 7),
					{ at: argument.start(2) + 1600, do: 'enter', el: 't-r7' },
					glide(argument.start(2) + 1800, 't-r7', 'a-in7'),
					{ at: argument.start(2) + 2700, do: 'exit', el: 't-r7', dur: 300 },
					{ at: argument.start(2) + 2800, do: 'type', el: 'o-7', dur: 700 },
				),
			},
		},

		// ─── Scene 3. Only the chosen branch ────────────────────────────────
		{
			id: 'lazy',
			chapter: 'lazy',
			scene: 'ternary',
			title: { es: 'Solo se evalúa la rama elegida', en: 'Only the chosen branch is evaluated' },
			subtitles: lazy.list,
			motion: {
				cues: seq(
					...clear(0, 'on-7', 'lb-expr'),
					shot(0, 'shot-lazy', 2600),
					...run(400, 8),
					...clear(lazy.start(0) + 2000, 'on-8'),
					...run(lazy.start(0) + 2100, 9),
					{ at: lazy.start(1), do: 'enter', el: 'warn-9' },
					...choose(lazy.start(1) + 300, 9),
					{ at: lazy.start(1) + 1200, do: 'enter', el: 'seal-9' },
					{ at: lazy.start(1) + 1500, do: 'enter', el: 'lb-lazy' },
					{ at: lazy.start(1) + 2600, do: 'pulse', el: 'seal-9' },
					{ at: lazy.start(2), do: 'enter', el: 't-r9' },
					glide(lazy.start(2) + 200, 't-r9', 'a-r'),
					{ at: lazy.start(2) + 1100, do: 'exit', el: 't-r9', dur: 300 },
					{ at: lazy.start(2) + 1100, do: 'enter', el: 'v-r' },
				),
			},
		},

		// ─── Scene 4. Versus if-else ────────────────────────────────────────
		{
			id: 'ifelse',
			chapter: 'ifelse',
			scene: 'ternary',
			title: { es: 'El mismo resultado con if-else', en: 'The same result with if-else' },
			subtitles: ifelse.list,
			motion: {
				cues: seq(
					...clear(0, 'on-9', 'lb-lazy'),
					shot(0, 'shot-ifelse', 2600),
					...run(400, 10),
					...clear(1800, 'on-10'),
					...run(1900, 11),
					{ at: 2700, do: 'enter', el: 'card' },
					...choose(ifelse.start(1), 11),
					{ at: ifelse.start(1) + 600, do: 'enter', el: 'card-hl' },
					{ at: ifelse.start(1) + 1800, do: 'pulse', el: 'card' },
					{ at: ifelse.start(2), do: 'enter', el: 't-r11' },
					glide(ifelse.start(2) + 200, 't-r11', 'a-signo'),
					{ at: ifelse.start(2) + 1100, do: 'exit', el: 't-r11', dur: 300 },
					{ at: ifelse.start(2) + 1100, do: 'enter', el: 'v-signo' },
					{ at: ifelse.start(2) + 1600, do: 'enter', el: 'lb-const' },
				),
			},
		},

		// ─── Scene 5. A single type ─────────────────────────────────────────
		{
			id: 'type',
			chapter: 'type',
			scene: 'ternary',
			title: { es: 'int y double dan double', en: 'int and double give double' },
			subtitles: type.list,
			motion: {
				cues: seq(
					...clear(0, 'on-11', 'card', 'card-hl', 'lb-const'),
					shot(0, 'shot-type', 2600),
					...run(400, 12),
					...clear(1800, 'on-12'),
					...run(1900, 13),
					{ at: type.start(0) + 3000, do: 'pulse', el: 'pt-13' },
					{ at: type.start(0) + 3600, do: 'pulse', el: 'pf-13' },
					{ at: type.start(1), do: 'enter', el: 'lb-type' },
					{ at: type.start(1) + 1600, do: 'pulse', el: 'lb-type' },
					...choose(type.start(2), 13),
					{ at: type.start(2) + 1000, do: 'enter', el: 't-90' },
					glide(type.start(2) + 1100, 't-90', 'a-conv13', 800),
					{ at: type.start(2) + 1900, do: 'exit', el: 't-90', dur: 300 },
					{ at: type.start(2) + 1900, do: 'enter', el: 't-90d' },
					glide(type.start(2) + 2200, 't-90d', 'a-precio', 800),
					{ at: type.start(2) + 3000, do: 'exit', el: 't-90d', dur: 300 },
					{ at: type.start(2) + 3000, do: 'enter', el: 'v-precio' },
				),
			},
		},
		{
			id: 'print',
			chapter: 'type',
			scene: 'ternary',
			title: { es: 'Tres valores, un printf', en: 'Three values, one printf' },
			subtitles: print.list,
			motion: {
				cues: seq(
					...clear(0, 'on-13', 'lb-type'),
					...run(200, 14),
					{ at: 900, do: 'enter', el: 't-c14a' },
					{ at: 1000, do: 'enter', el: 't-c14b' },
					{ at: 1100, do: 'enter', el: 't-c14c' },
					glide(1200, 't-c14a', 'a-in14', 1100),
					glide(1400, 't-c14b', 'a-in14', 1100),
					glide(1600, 't-c14c', 'a-in14', 1000),
					{ at: 2700, do: 'exit', el: 't-c14a', dur: 300 },
					{ at: 2700, do: 'exit', el: 't-c14b', dur: 300 },
					{ at: 2700, do: 'exit', el: 't-c14c', dur: 300 },
					{ at: 2800, do: 'type', el: 'o-14', dur: 700 },
					{ at: print.start(1) + 300, do: 'pulse', el: 'pt-13' },
					{ at: print.start(1) + 900, do: 'pulse', el: 'pf-13' },
					{ at: print.start(1) + 1600, do: 'pulse', el: 'v-precio' },
				),
			},
		},

		// ─── Scene 6. When not to use it ────────────────────────────────────
		{
			id: 'nested',
			chapter: 'nested',
			scene: 'ternary',
			title: { es: 'Un ternario dentro de otro', en: 'A ternary inside another' },
			subtitles: nested.list,
			motion: {
				cues: seq(
					...clear(0, 'on-14'),
					shot(0, 'shot-nested', 2600),
					...run(400, 15),
					...run(1400, 16),
					{ at: nested.start(0) + 2400, do: 'enter', el: 'lb-chain' },
					...choose(nested.start(1), 15),
					...choose(nested.start(1) + 1800, 16),
					{ at: nested.start(1) + 3300, do: 'enter', el: 't-r16' },
					glide(nested.start(1) + 3500, 't-r16', 'a-in15'),
					{ at: nested.start(1) + 4400, do: 'exit', el: 't-r16', dur: 300 },
					{ at: nested.start(1) + 4500, do: 'type', el: 'o-15', dur: 600 },
					{ at: nested.start(2), do: 'enter', el: 'warn-15' },
					{ at: nested.start(2) + 600, do: 'enter', el: 'lb-elseif' },
					{ at: nested.start(2) + 2000, do: 'pulse', el: 'lb-elseif' },
				),
			},
		},
		{
			id: 'recap',
			chapter: 'nested',
			scene: 'ternary',
			title: { es: 'Valores simples, no caminos', en: 'Simple values, not paths' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'on-15', 'on-16', 'lb-chain'),
					...run(200, 17),
					shot(700, 'shot-all', 3200),
					{ at: 1600, do: 'enter', el: 'lb-ok' },
					{ at: 2200, do: 'pulse', el: 'k-5' },
					{ at: 2700, do: 'pulse', el: 'k-11' },
					{ at: 3200, do: 'pulse', el: 'k-13' },
					{ at: recap.start(1) + 200, do: 'pulse', el: 'k-16' },
					{ at: recap.start(1) + 900, do: 'pulse', el: 'lb-elseif' },
					{ at: recap.start(1) + 1800, do: 'pulse', el: 'lb-ok' },
				),
			},
		},
	],
};
