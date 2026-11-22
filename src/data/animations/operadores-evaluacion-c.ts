import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The order an expression is evaluated in": a short film (about two minutes) for the
// C lesson "Operadores" (order: 7). It plays on a single persistent canvas
// (`data-scene="eval"` in `src/components/animaciones/operadores-evaluacion-c.astro`):
// the program on the left, and on the right every expression drawn as the same tree,
// an operator is a cube and an operand a plate. The tree is evaluated bottom-up: the
// operator lights up and its result travels on as a token to the operator above or
// into the variable box. The right operand of `&&` and `||` that never runs is sealed
// (magenta) and the verdict that stops them is violet; the two undefined-behavior
// lines of the lesson are shown, never run, as a refused state (sealed box, `?`).

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
 * declaration creates, the tree of an expression, a machine) and sends the
 * execution particle there. Declarations and machines light up; trees do not,
 * because each of their operators lights up when it is evaluated.
 */
const run = (at: number, line: number, lit = true): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
	{ at: at + 100, do: 'enter', el: `m-${line}` },
	{ at: at + 100, do: 'move', el: 'p', to: `a-m${line}`, dur: 700 },
	...(lit ? [{ at: at + 700, do: 'enter' as const, el: `on-${line}` }] : []),
];

/** A result token glides from where it is to `to`, and leaves the canvas when it lands. */
const carry = (at: number, token: string, to: string, dur = 900): MotionCue[] => [
	{ at, do: 'enter', el: token },
	{ at: at + 100, do: 'move', el: token, to, dur },
	{ at: at + 100 + dur, do: 'exit', el: token, dur: 300 },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const grouping = timed(
	say(
		'`2 + 3 * 4` es un árbol: cada operador es un nodo.',
		'`2 + 3 * 4` is a tree: each operator is a node.',
	),
	say(
		'La precedencia decide qué se agrupa primero: `*` antes que `+`.',
		'Precedence decides what groups first: `*` before `+`.',
	),
	say(
		'Se calcula de abajo hacia arriba: `3 * 4` da `12`, luego `14`.',
		'It is evaluated bottom-up: `3 * 4` gives `12`, then `14`.',
	),
);
const tie = timed(
	say(
		'Si hay empate, decide la asociatividad: `-` va de izquierda a derecha.',
		'On a tie, associativity decides: `-` goes left to right.',
	),
	say(
		'`10 - 4 - 3` es `(10 - 4) - 3`: da `3`, no `9`.',
		'`10 - 4 - 3` is `(10 - 4) - 3`: it gives `3`, not `9`.',
	),
);
const guard = timed(
	say(
		'Con `personas` en 0, `total / personas` dividiría por cero.',
		'With `people` at 0, `total / people` would divide by zero.',
	),
	say(
		'`&&` evalúa la izquierda: `personas != 0` es falso, y se detiene.',
		'`&&` evaluates the left side: `people != 0` is false, so it stops.',
	),
	say(
		'La derecha no se evalúa: esa división por cero nunca ocurre.',
		'The right side is not evaluated: that division by zero never happens.',
	),
);
const either = timed(
	say(
		'`||` también se detiene: `personas == 0` ya es verdadero.',
		'`||` stops too: `people == 0` is already true.',
	),
	say(
		'Es el cortocircuito, una garantía del lenguaje: el orden importa.',
		'That is short-circuit evaluation, a language guarantee: order matters.',
	),
);
const prefix = timed(
	say(
		'Con `a` en 5, el prefijo `++a` incrementa primero.',
		'With `a` at 5, the prefix `++a` increments first.',
	),
	say(
		'La expresión vale el valor nuevo: `x` recibe `6`.',
		'The expression is the new value: `x` gets `6`.',
	),
);
const postfix = timed(
	say(
		'El posfijo `b++` entrega el valor anterior: `y` recibe `5`.',
		'The postfix `b++` hands over the old value: `y` gets `5`.',
	),
	say(
		'Después `b` se incrementa igual: ahora vale `6`.',
		'Then `b` is incremented anyway: it is `6` now.',
	),
);
const remainder = timed(
	say(
		'`-7 / 3` trunca hacia cero: da `-2`, y `%` es lo que sobra.',
		'`-7 / 3` truncates toward zero: `-2`, and `%` is what is left.',
	),
	say(
		'Por eso `-7 % 3` es `-1`: el resto lleva el signo del dividendo.',
		'So `-7 % 3` is `-1`: the remainder takes the sign of the dividend.',
	),
);
const print = timed(
	say(
		'`printf` muestra `14 3 0 1`: los resultados de las expresiones.',
		'`printf` prints `14 3 0 1`: the results of the expressions.',
	),
	say(
		'Y `a=6 x=6 b=6 y=5 r=-1`: prefijo, posfijo y resto negativo.',
		'And `a=6 x=6 b=6 y=5 r=-1`: prefix, postfix and a negative remainder.',
	),
);
const undefinedBehavior = timed(
	say(
		'No se ejecutan: ambas líneas son comportamiento indefinido.',
		'They are not run: both lines are undefined behavior.',
	),
	say(
		'`i = i++ + 1` modifica `i` dos veces, sin orden definido.',
		'`i = i++ + 1` modifies `i` twice, with no defined order.',
	),
	say(
		'`INT_MAX + 1` desborda un `int`: el estándar no exige nada.',
		'`INT_MAX + 1` overflows an `int`: the standard requires nothing.',
	),
);
const recap = timed(
	say(
		'No modifiques una variable dos veces en una expresión.',
		'Do not modify a variable twice in one expression.',
	),
	say(
		'Ante la duda, usa paréntesis: la precedencia agrupa, no ordena.',
		'When in doubt, use parentheses: precedence groups, it does not order.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'precedence', label: { es: 'Precedencia', en: 'Precedence' } },
		{ id: 'associativity', label: { es: 'Asociatividad', en: 'Associativity' } },
		{ id: 'shortcircuit', label: { es: 'Cortocircuito', en: 'Short circuit' } },
		{ id: 'incdec', label: { es: 'Prefijo y posfijo', en: 'Prefix and postfix' } },
		{ id: 'remainder', label: { es: 'El signo de %', en: 'The sign of %' } },
		{ id: 'undefined', label: { es: 'Comportamiento indefinido', en: 'Undefined behavior' } },
	],
	steps: [
		// ─── Scene 1. Precedence ────────────────────────────────────────────
		{
			id: 'grouping',
			chapter: 'precedence',
			scene: 'eval',
			title: { es: 'La precedencia agrupa primero', en: 'Precedence groups first' },
			subtitles: grouping.list,
			motion: {
				cues: seq(
					shot(0, 'shot-prec', 2600),
					{ at: 200, do: 'enter', el: 'hl' },
					{ at: 300, do: 'enter', el: 'p' },
					...run(600, 4, false),
					{ at: 1700, do: 'pulse', el: 'c-4p' },
					{ at: 2300, do: 'pulse', el: 'c-4m' },
					{ at: 2900, do: 'pulse', el: 'lf-4b' },
					{ at: 3100, do: 'pulse', el: 'lf-4c' },
					{ at: grouping.start(1) + 300, do: 'enter', el: 'lb-prec' },
					{ at: grouping.start(1) + 900, do: 'pulse', el: 'c-4m' },
					{ at: grouping.start(1) + 1700, do: 'pulse', el: 'c-4p' },
					{ at: grouping.start(1) + 2400, do: 'pulse', el: 'lf-4b' },
					{ at: grouping.start(1) + 2500, do: 'pulse', el: 'lf-4c' },
					{ at: grouping.start(1) + 3000, do: 'enter', el: 'nd-4m' },
					{ at: grouping.start(1) + 3400, do: 'enter', el: 'rs-4m' },
					...carry(grouping.start(2) + 200, 'tk-4m', 'an-4p', 800),
					{ at: grouping.start(2) + 1100, do: 'pulse', el: 'lf-4a' },
					{ at: grouping.start(2) + 1300, do: 'enter', el: 'nd-4p' },
					{ at: grouping.start(2) + 1700, do: 'enter', el: 'rs-4p' },
					...carry(grouping.start(2) + 2300, 'tk-4', 'ab-4'),
					{ at: grouping.start(2) + 3400, do: 'enter', el: 'vl-4' },
				),
			},
		},

		// ─── Scene 2. Associativity ─────────────────────────────────────────
		{
			id: 'tie',
			chapter: 'associativity',
			scene: 'eval',
			title: { es: 'La asociatividad rompe el empate', en: 'Associativity breaks the tie' },
			subtitles: tie.list,
			motion: {
				cues: seq(
					...clear(0, 'nd-4m', 'nd-4p', 'rs-4m', 'rs-4p', 'lb-prec'),
					shot(0, 'shot-assoc', 2600),
					...run(300, 5, false),
					{ at: 1500, do: 'pulse', el: 'c-5r' },
					{ at: 2100, do: 'pulse', el: 'c-5l' },
					{ at: 2700, do: 'pulse', el: 'lf-5a' },
					{ at: 2800, do: 'pulse', el: 'lf-5b' },
					{ at: 3300, do: 'enter', el: 'nd-5l' },
					{ at: 3700, do: 'enter', el: 'rs-5l' },
					...carry(tie.start(1) + 100, 'tk-5l', 'an-5r', 800),
					{ at: tie.start(1) + 1100, do: 'pulse', el: 'lf-5c' },
					{ at: tie.start(1) + 1300, do: 'enter', el: 'nd-5r' },
					{ at: tie.start(1) + 1700, do: 'enter', el: 'rs-5r' },
					{ at: tie.start(1) + 2100, do: 'enter', el: 'lb-no9' },
					...carry(tie.start(1) + 2700, 'tk-5', 'ab-5'),
					{ at: tie.start(1) + 3800, do: 'enter', el: 'vl-5' },
				),
			},
		},

		// ─── Scene 3. Short circuit: && ─────────────────────────────────────
		{
			id: 'and',
			chapter: 'shortcircuit',
			scene: 'eval',
			title: { es: '&& se detiene en el primer falso', en: '&& stops at the first false' },
			subtitles: guard.list,
			motion: {
				cues: seq(
					...clear(0, 'nd-5l', 'nd-5r', 'rs-5l', 'rs-5r', 'lb-no9'),
					shot(0, 'shot-decl', 2400),
					...run(300, 6),
					...clear(2600, 'on-6'),
					shot(guard.start(1), 'shot-s1', 2400),
					...run(guard.start(1) + 300, 7, false),
					{ at: guard.start(1) + 1400, do: 'pulse', el: 'lf-7a' },
					{ at: guard.start(1) + 1500, do: 'pulse', el: 'lf-7b' },
					{ at: guard.start(1) + 1900, do: 'enter', el: 'nd-7l' },
					{ at: guard.start(1) + 2300, do: 'enter', el: 'rs-7l' },
					...carry(guard.start(1) + 2900, 'tk-7l', 'an-7r', 800),
					{ at: guard.start(2) + 100, do: 'enter', el: 'nd-7r' },
					{ at: guard.start(2) + 400, do: 'enter', el: 'rs-7r' },
					{ at: guard.start(2) + 900, do: 'enter', el: 'seal-7' },
					{ at: guard.start(2) + 1200, do: 'enter', el: 'lb-skip7' },
					{ at: guard.start(2) + 2000, do: 'pulse', el: 'seal-7' },
					...carry(guard.start(2) + 2400, 'tk-7', 'ab-7', 800),
					{ at: guard.start(2) + 3300, do: 'enter', el: 'vl-7' },
				),
			},
		},

		// ─── Scene 3, continued. Short circuit: || ──────────────────────────
		{
			id: 'or',
			chapter: 'shortcircuit',
			scene: 'eval',
			title: { es: '|| se detiene en el primer verdadero', en: '|| stops at the first true' },
			subtitles: either.list,
			motion: {
				cues: seq(
					...clear(0, 'nd-7l', 'nd-7r', 'rs-7l', 'rs-7r', 'lb-skip7'),
					shot(0, 'shot-s2', 2400),
					...run(300, 8, false),
					{ at: 1400, do: 'pulse', el: 'lf-8a' },
					{ at: 1500, do: 'pulse', el: 'lf-8b' },
					{ at: 1900, do: 'enter', el: 'nd-8l' },
					{ at: 2300, do: 'enter', el: 'rs-8l' },
					...carry(2900, 'tk-8l', 'an-8r', 800),
					{ at: either.start(1) + 100, do: 'enter', el: 'nd-8r' },
					{ at: either.start(1) + 400, do: 'enter', el: 'rs-8r' },
					{ at: either.start(1) + 900, do: 'enter', el: 'seal-8' },
					{ at: either.start(1) + 1200, do: 'enter', el: 'lb-skip8' },
					{ at: either.start(1) + 1800, do: 'enter', el: 'lb-order' },
					...carry(either.start(1) + 2400, 'tk-8', 'ab-8', 800),
					{ at: either.start(1) + 3300, do: 'enter', el: 'vl-8' },
					{ at: either.start(1) + 3900, do: 'pulse', el: 'seal-8' },
				),
			},
		},

		// ─── Scene 4. Prefix and postfix ────────────────────────────────────
		{
			id: 'prefix',
			chapter: 'incdec',
			scene: 'eval',
			title: { es: 'Prefijo: incrementa y luego vale', en: 'Prefix: increments, then it has a value' },
			subtitles: prefix.list,
			motion: {
				cues: seq(
					...clear(0, 'nd-8l', 'nd-8r', 'rs-8l', 'rs-8r', 'lb-order'),
					shot(0, 'shot-pre', 2600),
					...run(200, 9),
					{ at: 1000, do: 'enter', el: 'vl-a0' },
					{ at: 1100, do: 'enter', el: 'vl-b0' },
					...clear(1700, 'on-9'),
					...run(1800, 10, false),
					{ at: 2800, do: 'pulse', el: 'vl-a0' },
					{ at: 3000, do: 'enter', el: 'nd-10u' },
					{ at: 3300, do: 'exit', el: 'vl-a0', dur: 300 },
					{ at: 3400, do: 'enter', el: 'vl-a1' },
					{ at: 3700, do: 'enter', el: 'rs-10u' },
					...carry(prefix.start(1) + 200, 'tk-10', 'ab-10'),
					{ at: prefix.start(1) + 1300, do: 'enter', el: 'vl-10' },
					{ at: prefix.start(1) + 1900, do: 'pulse', el: 'vl-a1' },
					{ at: prefix.start(1) + 2300, do: 'pulse', el: 'vl-10' },
				),
			},
		},
		{
			id: 'postfix',
			chapter: 'incdec',
			scene: 'eval',
			title: { es: 'Posfijo: vale y luego incrementa', en: 'Postfix: has a value, then increments' },
			subtitles: postfix.list,
			motion: {
				cues: seq(
					...clear(0, 'nd-10u', 'rs-10u'),
					shot(0, 'shot-post', 2600),
					...run(300, 11, false),
					{ at: 1500, do: 'pulse', el: 'vl-b0' },
					{ at: 1800, do: 'enter', el: 'nd-11u' },
					{ at: 2200, do: 'enter', el: 'rs-11u' },
					...carry(2700, 'tk-11', 'ab-11'),
					{ at: 3800, do: 'enter', el: 'vl-11' },
					{ at: postfix.start(1) + 200, do: 'exit', el: 'vl-b0', dur: 300 },
					{ at: postfix.start(1) + 300, do: 'enter', el: 'vl-b1' },
					{ at: postfix.start(1) + 1200, do: 'pulse', el: 'vl-b1' },
					{ at: postfix.start(1) + 2000, do: 'pulse', el: 'vl-11' },
				),
			},
		},

		// ─── Scene 5. The sign of % ─────────────────────────────────────────
		{
			id: 'remainder',
			chapter: 'remainder',
			scene: 'eval',
			title: { es: 'El resto lleva el signo del dividendo', en: 'The remainder takes the sign of the dividend' },
			subtitles: remainder.list,
			motion: {
				cues: seq(
					...clear(0, 'nd-11u', 'rs-11u'),
					shot(0, 'shot-rest', 2600),
					...run(300, 12, false),
					{ at: 1500, do: 'pulse', el: 'lf-12a' },
					{ at: 1900, do: 'enter', el: 'lb-div' },
					{ at: 2500, do: 'pulse', el: 'lf-12b' },
					{ at: remainder.start(1) + 200, do: 'enter', el: 'nd-12r' },
					{ at: remainder.start(1) + 600, do: 'enter', el: 'rs-12r' },
					...carry(remainder.start(1) + 1200, 'tk-12', 'ab-12'),
					{ at: remainder.start(1) + 2300, do: 'enter', el: 'vl-12' },
					{ at: remainder.start(1) + 3000, do: 'enter', el: 'lb-ident' },
					{ at: remainder.start(1) + 3800, do: 'pulse', el: 'lb-ident' },
				),
			},
		},
		{
			id: 'print',
			chapter: 'remainder',
			scene: 'eval',
			title: { es: 'printf muestra los resultados', en: 'printf shows the results' },
			subtitles: print.list,
			motion: {
				cues: seq(
					...clear(0, 'nd-12r', 'rs-12r', 'lb-div', 'lb-ident'),
					shot(0, 'shot-print', 2400),
					...run(300, 13),
					{ at: 1100, do: 'enter', el: 'rs-13' },
					{ at: 1600, do: 'type', el: 'o-13', dur: 800 },
					{ at: 2600, do: 'pulse', el: 'rs-13' },
					...clear(print.start(1), 'on-13'),
					...run(print.start(1) + 100, 14),
					{ at: print.start(1) + 1000, do: 'enter', el: 'rs-14' },
					{ at: print.start(1) + 1500, do: 'type', el: 'o-14', dur: 1000 },
					{ at: print.start(1) + 2700, do: 'pulse', el: 'rs-14' },
				),
			},
		},

		// ─── Scene 6. Undefined behavior ────────────────────────────────────
		{
			id: 'undefined',
			chapter: 'undefined',
			scene: 'eval',
			title: { es: 'Lo que el estándar no define', en: 'What the standard does not define' },
			subtitles: undefinedBehavior.list,
			motion: {
				cues: seq(
					...clear(0, 'on-14', 'rs-13', 'rs-14'),
					shot(0, 'shot-ub', 2600),
					{ at: 400, do: 'enter', el: 'warn-15' },
					...run(700, 15, false),
					{ at: 1500, do: 'enter', el: 'vl-i0' },
					{ at: undefinedBehavior.start(1) + 200, do: 'draw', el: 'bw-15', dur: 900 },
					{ at: undefinedBehavior.start(1) + 1200, do: 'flow', el: 'bw-15' },
					{ at: undefinedBehavior.start(1) + 1300, do: 'pulse', el: 'c-15a' },
					{ at: undefinedBehavior.start(1) + 1800, do: 'pulse', el: 'c-15b' },
					{ at: undefinedBehavior.start(1) + 2300, do: 'exit', el: 'vl-i0', dur: 300 },
					{ at: undefinedBehavior.start(1) + 2400, do: 'enter', el: 'vl-i1' },
					{ at: undefinedBehavior.start(1) + 2700, do: 'enter', el: 'seal-15' },
					{ at: undefinedBehavior.start(1) + 3100, do: 'enter', el: 'lb-ub1' },
					...run(undefinedBehavior.start(2), 16, false),
					{ at: undefinedBehavior.start(2) + 900, do: 'enter', el: 'vl-g0' },
					{ at: undefinedBehavior.start(2) + 1500, do: 'draw', el: 'bw-16', dur: 800 },
					{ at: undefinedBehavior.start(2) + 2500, do: 'pulse', el: 'c-16u' },
					{ at: undefinedBehavior.start(2) + 2800, do: 'exit', el: 'vl-g0', dur: 300 },
					{ at: undefinedBehavior.start(2) + 2900, do: 'enter', el: 'vl-g1' },
					{ at: undefinedBehavior.start(2) + 3200, do: 'enter', el: 'seal-16' },
					{ at: undefinedBehavior.start(2) + 3600, do: 'enter', el: 'lb-ub2' },
				),
			},
		},
		{
			id: 'recap',
			chapter: 'undefined',
			scene: 'eval',
			title: { es: 'Agrupar no es ordenar', en: 'Grouping is not ordering' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...run(200, 17),
					shot(900, 'shot-all', 3200),
					{ at: 2300, do: 'pulse', el: 'seal-15' },
					{ at: 2800, do: 'pulse', el: 'seal-16' },
					{ at: recap.start(1) + 300, do: 'enter', el: 'lb-ok' },
					{ at: recap.start(1) + 900, do: 'pulse', el: 'c-4p' },
					{ at: recap.start(1) + 1300, do: 'pulse', el: 'c-5r' },
					{ at: recap.start(1) + 1700, do: 'pulse', el: 'c-7r' },
					{ at: recap.start(1) + 2100, do: 'pulse', el: 'c-8r' },
					{ at: recap.start(1) + 2500, do: 'pulse', el: 'c-12r' },
					{ at: recap.start(1) + 3300, do: 'pulse', el: 'lb-ok' },
				),
			},
		},
	],
};
