import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Data and operations together, without classes": a short film (about two
// minutes) for the C lesson "Diseño de software en C: ideas de la POO" (order: 41).
// It plays on a single persistent canvas (`data-scene="design"` in
// `src/components/animaciones/ideas-poo-c.astro`): the account program on the left,
// and on the right the design drawn as one system. A `struct` is a plate with its
// field, each function is a cube tied to it by a pointer arrow (its first
// parameter), and the rule of `cuenta_extraer` is a fork that refuses an invalid
// amount inside the operation. A board of six tiles then stamps every idea of OOP
// either "C expresses it with..." (violet) or "does not exist in C" (magenta).
// C is never presented as an object-oriented language: it is procedural, and
// these are design techniques built by hand.

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
 * Runs editor line `line`: slides the bar to it, builds its module (the struct
 * plate, a function cube, the account box, a call, the rule or a printf machine)
 * and sends the execution particle there. Its lit state follows.
 */
const run = (at: number, line: number, lit = 700): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
	{ at: at + 100, do: 'enter', el: `m-${line}` },
	{ at: at + 100, do: 'move', el: 'p', to: `a-m${line}`, dur: 700 },
	{ at: at + lit, do: 'enter', el: `on-${line}` },
];

/** A value token (or the pointer `&cuenta`) appears, glides to `to` and is gone. */
const send = (at: number, el: string, to: string, dur = 900): MotionCue[] => [
	{ at, do: 'enter', el },
	{ at: at + 100, do: 'move', el, to, dur },
	{ at: at + 100 + dur + 100, do: 'exit', el, dur: 300 },
];

/** Tiles and stamps of the board, one after the other. */
const stagger = (at: number, gap: number, kind: 'enter' | 'pulse', ...els: string[]): MotionCue[] =>
	els.map((el, index) => ({ at: at + index * gap, do: kind, el }));

// ─── Captions ───────────────────────────────────────────────────────────────
const abstraction = timed(
	say('C es procedural. La abstracción es una técnica de diseño.', 'C is procedural. Abstraction is a design technique.'),
	say(
		'Empieza por las operaciones: crear, depositar, extraer, consultar.',
		'Start from the operations: create, deposit, withdraw, query.',
	),
	say('Esa lista es la interfaz; los campos son un detalle.', 'That list is the interface; the fields are a detail.'),
);
const grouping = timed(
	say(
		'Una `struct` guarda el estado; las funciones `cuenta_*` son su comportamiento.',
		'A `struct` holds the state; the `account_*` functions are its behavior.',
	),
	say(
		'Cada función recibe un puntero a la cuenta como primer parámetro.',
		'Each function takes a pointer to the account as its first parameter.',
	),
	say(
		'`cuenta_iniciar` recibe `&cuenta` y 12550, y guarda el saldo.',
		'`account_init` receives `&account` and 12550, and stores the balance.',
	),
);
const rule = timed(
	say(
		'`main` pide extraer 50000: la operación revisa su regla primero.',
		'`main` asks to withdraw 50000: the operation checks its rule first.',
	),
	say(
		'`monto > saldo` es verdadera: devuelve `false` y no toca el saldo.',
		'`amount > balance` is true: it returns `false` and leaves the balance alone.',
	),
	say(
		'La regla vive dentro de la operación, no repartida por `main`.',
		'The rule lives inside the operation, not scattered across `main`.',
	),
);
const output = timed(
	say(
		'`main` recibe `false`, entra al `if` e imprime el rechazo.',
		'`main` receives `false`, enters the `if` and prints the rejection.',
	),
	say('El saldo sigue intacto: 12550 centavos.', 'The balance is intact: 12550 cents.'),
);
const views = timed(
	say(
		'Enfoque estructurado: pasos sueltos y un saldo suelto.',
		'Structured approach: loose steps and a loose balance.',
	),
	say('La regla del monto se repite en cada paso.', 'The amount rule is repeated in every step.'),
	say(
		'La `Cuenta` junta estado y comportamiento; la regla vive en un solo lugar.',
		'The `Account` joins state and behavior; the rule lives in one place.',
	),
);
const expressed = timed(
	say(
		'Datos + funciones: C lo expresa con una `struct` y funciones.',
		'Data + functions: C expresses it with a `struct` and functions.',
	),
	say(
		'Interfaces: un `.h` declara qué se puede hacer y el `.c` decide cómo.',
		'Interfaces: a `.h` declares what can be done and the `.c` decides how.',
	),
);
const lacks = timed(
	say(
		'Clases, herencia, despacho virtual y control de acceso: no existen en C.',
		'Classes, inheritance, virtual dispatch and access control: C has none.',
	),
	say(
		'Se simulan a mano, sin ayuda del compilador.',
		'They are simulated by hand, with no compiler help.',
	),
	say(
		'No hay `private`: `main` puede escribir `cuenta.saldo_centavos = -500;`.',
		'There is no `private`: `main` can write `account.balance_cents = -500;`.',
	),
);
const worth = timed(
	say(
		'Vale la pena con reglas que proteger o varias partes que lo usan.',
		'It pays off with rules to protect or several parts that use it.',
	),
	say(
		'Cuesta más código, más memoria dinámica y más indirección.',
		'It costs more code, more dynamic memory and more indirection.',
	),
	say(
		'En un programa corto basta una `struct` con dos funciones.',
		'In a short program a `struct` with two functions is enough.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'abstraction', label: { es: 'Abstracción', en: 'Abstraction' } },
		{ id: 'grouping', label: { es: 'Datos y funciones', en: 'Data and functions' } },
		{ id: 'rule', label: { es: 'La regla adentro', en: 'The rule inside' } },
		{ id: 'views', label: { es: 'Dos miradas', en: 'Two views' } },
		{ id: 'board', label: { es: 'Qué tiene C', en: 'What C has' } },
		{ id: 'worth', label: { es: 'Cuándo conviene', en: 'When it pays off' } },
	],
	steps: [
		// ─── Scene 1. Abstraction: operations first ─────────────────────────
		{
			id: 'abstraction',
			chapter: 'abstraction',
			scene: 'design',
			title: { es: 'Primero las operaciones', en: 'Operations first' },
			subtitles: abstraction.list,
			motion: {
				cues: seq(
					shot(0, 'shot-abs', 2600),
					{ at: 200, do: 'enter', el: 'hl' },
					{ at: 300, do: 'enter', el: 'p' },
					{ at: abstraction.start(0) + 600, do: 'enter', el: 'lb-proc' },
					{ at: abstraction.start(0) + 2200, do: 'pulse', el: 'lb-proc' },
					...clear(abstraction.start(1), 'lb-proc'),
					...stagger(abstraction.start(1) + 400, 500, 'enter', 'op-1', 'op-2', 'op-3', 'op-4'),
					{ at: abstraction.start(2), do: 'enter', el: 'lb-iface' },
					...run(abstraction.start(2) + 400, 3),
					{ at: abstraction.start(2) + 1900, do: 'enter', el: 'lb-detail' },
					{ at: abstraction.start(2) + 2800, do: 'pulse', el: 'lb-iface' },
				),
			},
		},

		// ─── Scene 2. A struct plus functions: data and operations together ─
		{
			id: 'grouping',
			chapter: 'grouping',
			scene: 'design',
			title: { es: 'Una struct y sus funciones', en: 'A struct and its functions' },
			subtitles: grouping.list,
			motion: {
				cues: seq(
					...clear(0, 'on-3'),
					shot(0, 'shot-ops', 2600),
					...run(500, 4),
					{ at: 1300, do: 'draw', el: 'ar-4', dur: 800 },
					...clear(1900, 'on-4'),
					...run(2000, 7),
					{ at: 2800, do: 'draw', el: 'ar-7', dur: 800 },
					...clear(3600, 'on-7'),
					{ at: grouping.start(1), do: 'enter', el: 'lb-param' },
					{ at: grouping.start(1) + 900, do: 'pulse', el: 'ar-4' },
					{ at: grouping.start(1) + 1500, do: 'pulse', el: 'ar-7' },
					...run(grouping.start(1) + 2400, 13),
					...clear(grouping.start(2), 'on-13'),
					...run(grouping.start(2), 14),
					...send(grouping.start(2) + 900, 't-ptr14', 'a-in14'),
					{ at: grouping.start(2) + 1900, do: 'enter', el: 't-v14' },
					...run(grouping.start(2) + 2000, 5),
					{ at: grouping.start(2) + 2400, do: 'move', el: 't-v14', to: 'a-in5', dur: 900 },
					{ at: grouping.start(2) + 3400, do: 'exit', el: 't-v14', dur: 300 },
					...send(grouping.start(2) + 3400, 't-v5', 'a-saldo', 800),
					{ at: grouping.start(2) + 4400, do: 'enter', el: 'v-saldo' },
				),
			},
		},

		// ─── Scene 3. The rule is enforced inside the operation ────────────
		{
			id: 'rule',
			chapter: 'rule',
			scene: 'design',
			title: { es: 'La operación rechaza el monto', en: 'The operation refuses the amount' },
			subtitles: rule.list,
			motion: {
				cues: seq(
					...clear(0, 'on-5', 'on-14', 'lb-param'),
					shot(0, 'shot-rule', 2600),
					...run(400, 15),
					...send(1300, 't-ptr15', 'a-in15'),
					...run(2300, 8),
					...send(2400, 't-a15', 'a-in8'),
					{ at: 3500, do: 'enter', el: 'warn-8' },
					{ at: rule.start(1) + 200, do: 'pulse', el: 'c-8' },
					{ at: rule.start(1) + 700, do: 'enter', el: 'cv-8' },
					{ at: rule.start(1) + 1800, do: 'draw', el: 'k-8', dur: 700 },
					{ at: rule.start(1) + 2600, do: 'flow', el: 'k-8' },
					{ at: rule.start(1) + 3000, do: 'enter', el: 'seal-8' },
					...send(rule.start(1) + 3300, 't-ret8', 'a-in15'),
					{ at: rule.start(2), do: 'enter', el: 'lb-refused' },
					{ at: rule.start(2) + 1500, do: 'pulse', el: 'warn-8' },
					{ at: rule.start(2) + 2200, do: 'pulse', el: 'lb-refused' },
				),
			},
		},
		{
			id: 'output',
			chapter: 'rule',
			scene: 'design',
			title: { es: 'El saldo no cambió', en: 'The balance did not change' },
			subtitles: output.list,
			motion: {
				cues: seq(
					...clear(0, 'on-8', 'on-15', 'cv-8', 'k-8', 'seal-8', 'lb-refused', 'warn-8'),
					shot(0, 'shot-out', 2600),
					...run(300, 16),
					{ at: 1400, do: 'type', el: 'o-16', dur: 900 },
					{ at: output.start(0) + 3000, do: 'pulse', el: 'on-16' },
					...clear(output.start(1) - 300, 'on-16'),
					...run(output.start(1), 17),
					...send(output.start(1) + 800, 't-s17', 'a-in17', 1000),
					{ at: output.start(1) + 2100, do: 'type', el: 'o-17', dur: 800 },
					{ at: output.start(1) + 3000, do: 'pulse', el: 'v-saldo' },
				),
			},
		},

		// ─── Scene 4. Scattered steps versus an entity ──────────────────────
		{
			id: 'views',
			chapter: 'views',
			scene: 'design',
			title: { es: 'Pasos sueltos o una cuenta', en: 'Loose steps or an account' },
			subtitles: views.list,
			motion: {
				cues: seq(
					...clear(0, 'on-17'),
					shot(0, 'shot-views', 2800),
					{ at: 800, do: 'enter', el: 'lb-before' },
					...stagger(1300, 450, 'enter', 'bf-var', 'bf-s1', 'bf-s2', 'bf-s3', 'bf-s4'),
					{ at: views.start(1), do: 'enter', el: 'bf-dup' },
					{ at: views.start(1) + 900, do: 'pulse', el: 'bf-s2' },
					{ at: views.start(1) + 1300, do: 'pulse', el: 'bf-s3' },
					{ at: views.start(2), do: 'enter', el: 'lb-after' },
					...stagger(views.start(2) + 600, 450, 'pulse', 'm-3', 'm-4', 'm-7', 'm-13'),
					{ at: views.start(2) + 2600, do: 'enter', el: 'lb-one' },
					{ at: views.start(2) + 3400, do: 'pulse', el: 'm-8' },
				),
			},
		},

		// ─── Scene 5. What C expresses ──────────────────────────────────────
		{
			id: 'expressed',
			chapter: 'board',
			scene: 'design',
			title: { es: 'Ideas de la POO que C sí expresa', en: 'OOP ideas that C does express' },
			subtitles: expressed.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-before', 'bf-var', 'bf-s1', 'bf-s2', 'bf-s3', 'bf-s4', 'bf-dup', 'lb-after', 'lb-one', 'hl', 'p'),
					shot(0, 'shot-board', 2800),
					...stagger(900, 300, 'enter', 'tile-1', 'tile-2', 'tile-3', 'tile-4', 'tile-5', 'tile-6'),
					{ at: expressed.start(0) + 2700, do: 'pulse', el: 'tile-1' },
					{ at: expressed.start(0) + 3100, do: 'enter', el: 'st-1' },
					{ at: expressed.start(0) + 4100, do: 'pulse', el: 'st-1' },
					{ at: expressed.start(1) + 200, do: 'pulse', el: 'tile-2' },
					{ at: expressed.start(1) + 700, do: 'enter', el: 'st-2' },
					{ at: expressed.start(1) + 2400, do: 'pulse', el: 'st-2' },
				),
			},
		},

		// ─── Scene 6. What C lacks ──────────────────────────────────────────
		{
			id: 'lacks',
			chapter: 'board',
			scene: 'design',
			title: { es: 'Ideas de la POO que C no tiene', en: 'OOP ideas that C does not have' },
			subtitles: lacks.list,
			motion: {
				cues: seq(
					...stagger(lacks.start(0) + 300, 600, 'enter', 'st-3', 'st-4', 'st-5', 'st-6'),
					...stagger(lacks.start(0) + 3400, 300, 'pulse', 'tile-3', 'tile-4', 'tile-5', 'tile-6'),
					{ at: lacks.start(1) + 400, do: 'pulse', el: 'st-4' },
					{ at: lacks.start(1) + 1100, do: 'pulse', el: 'st-5' },
					{ at: lacks.start(2) + 200, do: 'enter', el: 'lb-loop' },
					{ at: lacks.start(2) + 1200, do: 'pulse', el: 'st-6' },
					{ at: lacks.start(2) + 2200, do: 'pulse', el: 'lb-loop' },
				),
			},
		},

		// ─── Scene 7. When the style is worth it ────────────────────────────
		{
			id: 'worth',
			chapter: 'worth',
			scene: 'design',
			title: { es: 'Cuándo vale la pena', en: 'When it is worth it' },
			subtitles: worth.list,
			motion: {
				cues: seq(
					...clear(
						0,
						'tile-1',
						'tile-2',
						'tile-3',
						'tile-4',
						'tile-5',
						'tile-6',
						'st-1',
						'st-2',
						'st-3',
						'st-4',
						'st-5',
						'st-6',
						'lb-loop',
					),
					shot(0, 'shot-worth', 2800),
					{ at: 900, do: 'enter', el: 'w-yes' },
					{ at: worth.start(0) + 1500, do: 'enter', el: 'wc-1' },
					{ at: worth.start(0) + 2400, do: 'enter', el: 'wc-2' },
					{ at: worth.start(1) + 300, do: 'enter', el: 'wc-cost' },
					{ at: worth.start(1) + 1700, do: 'pulse', el: 'wc-cost' },
					{ at: worth.start(2) + 200, do: 'enter', el: 'w-no' },
					{ at: worth.start(2) + 900, do: 'enter', el: 'wc-3' },
					shot(worth.start(2) + 2300, 'shot-all', 3200),
					{ at: worth.start(2) + 3400, do: 'pulse', el: 'm-3' },
					{ at: worth.start(2) + 3800, do: 'pulse', el: 'm-8' },
				),
			},
		},
	],
};
