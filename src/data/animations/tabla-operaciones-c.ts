import type { AnimationScript, MotionCue, Subtitle } from './types';

// "A table of functions decides": a short film (about two minutes) for the C lesson
// "Polimorfismo y herencia simulados en C" (polimorfismo-y-herencia-simulados-en-c).
// It plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/tabla-operaciones-c.astro`): the lesson's code on the
// left, in four small programs that are swapped as the story moves on, and on the
// right four layers: the functions of each shape, the operation table `FiguraOps`
// of each shape (a row of cells whose slots are arrows to those functions), the
// objects on the heap (a plate whose FIRST cell is the base `Figura` holding `ops`,
// an arrow to its table) and one module per instruction. One identity for "a
// pointer": every `ops` and every slot of a table is an arrow. The execution
// particle follows a call from `figura_area` through `ops` and the table to the
// function of the right shape. Magenta marks the exceptional (a wrong cast, undefined
// behavior, the limits); violet marks what makes the technique work (the table, the
// base as first field, the tagged union as the simpler alternative).
// The code is the lesson's own, condensed; the output of the two shapes (circle of
// radius 1, rectangle of 3 by 2) comes from compiling and running it.

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

type Program = 'a' | 'b' | 'c' | 'd';

/** The instructions that have a module, per program (the editor lines they sit on). */
const LINES: Record<Program, number[]> = {
	a: [2, 8, 10, 14, 17, 19],
	b: [13, 14, 17, 2, 5, 6, 9, 10],
	c: [1, 2, 3, 6],
	d: [19, 21, 10, 13, 14],
};

/**
 * One instruction runs: the bar slides to its editor line, the flow reaches its
 * module and it lights up. `prev` is the line whose lit state leaves at the same time.
 */
function exec(at: number, program: Program, line: number, prev?: number, dur = 600): MotionCue[] {
	return [
		...(prev === undefined ? [] : [{ at, do: 'exit' as const, el: `on-${program}${prev}`, dur: 350 }]),
		{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 500) },
		{ at, do: 'move', el: 'p', to: `a-m${program}${line}`, dur },
		{ at: at + dur, do: 'enter', el: `on-${program}${line}` },
		{ at: at + dur, do: 'pulse', el: `m-${program}${line}` },
	];
}

/** The modules of a program are built one after the other. */
const build = (at: number, program: Program, gap = 70): MotionCue[] =>
	LINES[program].map((line, index) => ({ at: at + index * gap, do: 'enter' as const, el: `m-${program}${line}` }));

/** The program ends: its modules and their lit states leave. */
const retire = (at: number, program: Program): MotionCue[] =>
	LINES[program].flatMap((line) => [
		{ at, do: 'exit' as const, el: `m-${program}${line}`, dur: 400 },
		{ at, do: 'exit' as const, el: `on-${program}${line}`, dur: 400 },
	]);

/** The editor swaps one program for another. */
const swapProgram = (at: number, from: Program, to: Program): MotionCue[] => [
	{ at, do: 'exit', el: `file-${from}`, dur: 350 },
	{ at, do: 'exit', el: `ed-${from}`, dur: 350 },
	{ at: at + 300, do: 'enter', el: `file-${to}` },
	{ at: at + 300, do: 'enter', el: `ed-${to}` },
];

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 })).flat();

/** Fades several elements in at the same moment. */
const show = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'enter' as const, el }));

/** Draws several arrows one after the other. */
const drawAll = (at: number, gap: number, ...els: string[]): MotionCue[] =>
	els.map((el, index) => ({ at: at + index * gap, do: 'draw' as const, el, dur: 600 }));

/** Types the output rows of the program, one after the other. */
const output = (at: number, ...ids: string[]): MotionCue[] =>
	ids.map((el, index) => ({ at: at + index * 500, do: 'type' as const, el, dur: 700 }));

// ─── Captions ───────────────────────────────────────────────────────────────
const table = timed(
	say(
		'`FiguraOps` es una `struct` de punteros a función: `(*area)`, `(*perimetro)`, `(*destruir)`.',
		'`ShapeOps` is a `struct` of function pointers: `(*area)`, `(*perimeter)`, `(*destroy)`.',
	),
	say(
		'Cada tipo tiene su propia tabla `static const`, con las funciones de ese tipo.',
		'Each type has its own `static const` table, with the functions of that type.',
	),
);
const shapes = timed(
	say(
		'`Figura` solo guarda `ops`. Cada objeto, creado con `malloc`, apunta a la tabla de su tipo.',
		'`Shape` only holds `ops`. Each object, created with `malloc`, points to the table of its type.',
	),
	say(
		'`Circulo` y `Rectangulo` incrustan `Figura base` como primer campo y suman sus datos.',
		'`Circle` and `Rectangle` embed `Shape base` as the first field and add their data.',
	),
);
const first = timed(
	say(
		'Como `base` es el primer campo, objeto y base empiezan en la misma dirección: `0x1000`.',
		'Because `base` is the first field, object and base start at the same address: `0x1000`.',
	),
	say(
		'Por eso un `Circulo *` convertido es un `Figura *`, y al revés. Las direcciones reales varían.',
		'So a converted `Circle *` is a `Shape *`, and vice versa. Real addresses vary.',
	),
);
const call = timed(
	say(
		'`figura_area(figuras[0])` no sabe si `f` es un círculo o un rectángulo.',
		'`shape_area(shapes[0])` does not know whether `s` is a circle or a rectangle.',
	),
	say(
		'`f->ops` llega a `CIRCULO_OPS`; la ranura `->area` salta a `circulo_area`.',
		'`s->ops` reaches `CIRCLE_OPS`; the `->area` slot jumps to `circle_area`.',
	),
);
const call2 = timed(
	say(
		'`circulo_area` convierte `self` a `Circulo *` y calcula 3.14 para el radio 1.',
		'`circle_area` converts `self` to `Circle *` and computes 3.14 for radius 1.',
	),
	say(
		'Con `figuras[1]` la misma línea sigue otra flecha, hasta `rectangulo_area`: 6.00.',
		'With `shapes[1]` the same line follows another arrow, to `rectangle_area`: 6.00.',
	),
);
const cast = timed(
	say(
		'`(const Circulo *)f` solo vale si `f` apunta a un `Circulo`; el compilador no lo comprueba.',
		'`(const Circle *)s` is only valid if `s` points to a `Circle`; the compiler cannot check it.',
	),
	say(
		'Con un `Rectangulo` compila sin avisos y lee `radio` donde hay `ancho`: comportamiento indefinido.',
		'With a `Rectangle` it compiles silently and reads `radius` where `width` is: undefined behavior.',
	),
	say(
		'Si `base` no fuera el primer campo, su dirección no sería la del objeto.',
		'If `base` were not the first field, its address would not be the object\'s.',
	),
);
const limits = timed(
	say(
		'Sin seguridad de tipos: el compilador acepta cualquier conversión entre punteros.',
		'No type safety: the compiler accepts any cast between pointers.',
	),
	say(
		'Despacho manual: una operación nueva obliga a tocar todas las tablas de todos los tipos.',
		'Manual dispatch: a new operation means editing every table of every type.',
	),
);
const simple = timed(
	say(
		'Si los tipos son pocos y cerrados, una unión con etiqueta y un `switch` bastan.',
		'If the types are few and closed, a tagged union and a `switch` are enough.',
	),
	say(
		'`tipo` elige la rama: sin tablas, sin conversiones ni `malloc`, y `-Wall` avisa si falta un caso.',
		'`kind` picks the branch: no tables, no casts, no `malloc`, and `-Wall` flags a missing case.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'table', label: { es: 'La tabla de operaciones', en: 'The operation table' } },
		{ id: 'base', label: { es: 'La base como primer campo', en: 'The base as first field' } },
		{ id: 'dispatch', label: { es: 'El despacho', en: 'The dispatch' } },
		{ id: 'cast', label: { es: 'La conversión delicada', en: 'The delicate cast' } },
		{ id: 'limits', label: { es: 'Los límites', en: 'The limits' } },
		{ id: 'union', label: { es: 'La alternativa simple', en: 'The simpler alternative' } },
	],
	steps: [
		// ─── Scene 1. The operation table ───────────────────────────────────
		{
			id: 'table',
			chapter: 'table',
			scene: 'journey',
			title: { es: 'Una struct de punteros a función', en: 'A struct of function pointers' },
			subtitles: table.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 2800),
					show(100, 'fl-mod'),
					show(200, 'hl'),
					show(300, 'p'),
					build(300, 'a'),
					exec(800, 'a', 2),
					show(1500, 'tb-c'),
					show(1700, 'tb-r'),
					{ at: 2600, do: 'pulse', el: 'tb-c' },
					{ at: 3000, do: 'pulse', el: 'tb-r' },
					exec(table.start(1) + 100, 'a', 17, 2),
					show(table.start(1) + 800, 'fn-c'),
					drawAll(table.start(1) + 1100, 250, 'ar-tc-a', 'ar-tc-p', 'ar-tc-d'),
					{ at: table.start(1) + 2300, do: 'pulse', el: 'fn-c' },
					exec(table.start(1) + 2600, 'a', 19, 17),
					show(table.start(1) + 3300, 'fn-r'),
					drawAll(table.start(1) + 3600, 250, 'ar-tr-a', 'ar-tr-p', 'ar-tr-d'),
					{ at: table.start(1) + 4800, do: 'pulse', el: 'fn-r' },
				),
			},
		},

		// ─── Scene 2. The shapes and their base ─────────────────────────────
		{
			id: 'shapes',
			chapter: 'base',
			scene: 'journey',
			title: { es: 'Figura es la base de cada objeto', en: 'Shape is the base of every object' },
			subtitles: shapes.list,
			motion: {
				cues: seq(
					clear(0, 'on-a19'),
					exec(200, 'a', 8),
					show(900, 'ob-c'),
					show(1100, 'ob-r'),
					drawAll(1700, 400, 'ar-oc', 'ar-or'),
					{ at: 2800, do: 'pulse', el: 'ob-c' },
					{ at: 3200, do: 'pulse', el: 'ob-r' },
					exec(shapes.start(1) + 100, 'a', 10, 8),
					show(shapes.start(1) + 800, 'on-base-c', 'lb-base'),
					{ at: shapes.start(1) + 1500, do: 'pulse', el: 'on-base-c' },
					exec(shapes.start(1) + 2300, 'a', 14, 10),
					show(shapes.start(1) + 3000, 'on-base-r'),
					{ at: shapes.start(1) + 3600, do: 'pulse', el: 'on-base-r' },
				),
			},
		},

		// ─── Scene 3. Why the base goes first ───────────────────────────────
		{
			id: 'first',
			chapter: 'base',
			scene: 'journey',
			title: { es: 'Por qué la base va primero', en: 'Why the base goes first' },
			subtitles: first.list,
			motion: {
				cues: seq(
					clear(0, 'on-a14', 'on-base-r', 'lb-base'),
					shot(0, 'shot-obj', 2400),
					exec(200, 'a', 10),
					show(900, 'on-ob-c'),
					show(1500, 'lb-a1'),
					show(2200, 'lb-a2'),
					{ at: 3000, do: 'pulse', el: 'on-base-c' },
					{ at: 3400, do: 'pulse', el: 'on-ob-c' },
					show(first.start(1) + 200, 'lb-cast2'),
					{ at: first.start(1) + 900, do: 'pulse', el: 'lb-a1' },
					{ at: first.start(1) + 1500, do: 'pulse', el: 'lb-a2' },
					{ at: first.start(1) + 2300, do: 'pulse', el: 'lb-cast2' },
				),
			},
		},

		// ─── Scene 4. The dispatch of the circle ────────────────────────────
		{
			id: 'call',
			chapter: 'dispatch',
			scene: 'journey',
			title: { es: 'Una llamada, la función del círculo', en: 'One call, the circle\'s function' },
			subtitles: call.list,
			motion: {
				cues: seq(
					clear(0, 'on-a10', 'on-ob-c', 'on-base-c', 'lb-a1', 'lb-a2', 'lb-cast2'),
					retire(0, 'a'),
					swapProgram(0, 'a', 'b'),
					shot(300, 'shot-circ', 2400),
					build(600, 'b'),
					exec(1000, 'b', 13),
					exec(1500, 'b', 14, 13),
					exec(2400, 'b', 17, 14),
					show(3200, 'lb-f'),
					{ at: 3700, do: 'pulse', el: 'ob-c' },
					exec(call.start(1) + 100, 'b', 2, 17),
					{ at: call.start(1) + 800, do: 'move', el: 'p', to: 'a-oc', dur: 800 },
					{ at: call.start(1) + 1000, do: 'flow', el: 'ar-oc' },
					show(call.start(1) + 1200, 'lb-route1'),
					{ at: call.start(1) + 1700, do: 'move', el: 'p', to: 'a-tca', dur: 900 },
					show(call.start(1) + 2000, 'on-tb-c', 'on-tca'),
					show(call.start(1) + 2300, 'lb-route2'),
					{ at: call.start(1) + 2800, do: 'flow', el: 'ar-tc-a' },
					{ at: call.start(1) + 3000, do: 'move', el: 'p', to: 'a-fca', dur: 900 },
					show(call.start(1) + 3700, 'on-fca', 'lb-fnc'),
					{ at: call.start(1) + 4300, do: 'pulse', el: 'on-fca' },
				),
			},
		},

		// ─── Scene 5. The same line, the rectangle ──────────────────────────
		{
			id: 'call2',
			chapter: 'dispatch',
			scene: 'journey',
			title: { es: 'La misma línea, otra función', en: 'The same line, another function' },
			subtitles: call2.list,
			motion: {
				cues: seq(
					exec(200, 'b', 5, 2),
					exec(900, 'b', 6, 5),
					{ at: 1500, do: 'move', el: 'hl', to: 'ln-16', dur: 500 },
					output(1700, 'o-b1'),
					clear(call2.start(1) - 300, 'lb-f', 'lb-route1', 'lb-route2', 'lb-fnc', 'on-tb-c', 'on-tca', 'on-fca', 'on-b6'),
					shot(call2.start(1), 'shot-rect', 2400),
					exec(call2.start(1) + 100, 'b', 17),
					show(call2.start(1) + 600, 'lb-f2'),
					exec(call2.start(1) + 1100, 'b', 2, 17),
					{ at: call2.start(1) + 1800, do: 'move', el: 'p', to: 'a-or', dur: 800 },
					{ at: call2.start(1) + 2000, do: 'flow', el: 'ar-or' },
					show(call2.start(1) + 2200, 'lb-route1r'),
					{ at: call2.start(1) + 2700, do: 'move', el: 'p', to: 'a-tra', dur: 900 },
					show(call2.start(1) + 3000, 'on-tb-r', 'on-tra', 'lb-route2r'),
					{ at: call2.start(1) + 3500, do: 'flow', el: 'ar-tr-a' },
					{ at: call2.start(1) + 3700, do: 'move', el: 'p', to: 'a-fra', dur: 900 },
					show(call2.start(1) + 4400, 'on-fra', 'lb-fnr'),
					exec(call2.start(1) + 4800, 'b', 9, 2),
					exec(call2.start(1) + 5500, 'b', 10, 9),
					{ at: call2.start(1) + 6200, do: 'move', el: 'hl', to: 'ln-16', dur: 500 },
					output(call2.start(1) + 6400, 'o-b2'),
				),
			},
		},

		// ─── Scene 6. The delicate cast ─────────────────────────────────────
		{
			id: 'cast',
			chapter: 'cast',
			scene: 'journey',
			title: { es: 'Una conversión que nadie comprueba', en: 'A cast nobody checks' },
			subtitles: cast.list,
			motion: {
				cues: seq(
					clear(0, 'lb-f2', 'lb-route1r', 'lb-route2r', 'lb-fnr', 'on-tb-r', 'on-tra', 'on-fra', 'on-b10', 'on-b2', 'o-b1', 'o-b2'),
					retire(0, 'b'),
					swapProgram(0, 'b', 'c'),
					shot(300, 'shot-rect', 2200),
					build(600, 'c'),
					exec(1300, 'c', 1),
					show(1800, 'on-ob-r'),
					exec(cast.start(0) + 3200, 'c', 2, 1),
					show(cast.start(0) + 3900, 'lb-nocheck'),
					{ at: cast.start(0) + 4600, do: 'pulse', el: 'm-c2' },
					clear(cast.start(1), 'on-ob-r', 'on-c2'),
					exec(cast.start(1) + 100, 'c', 3, 2),
					show(cast.start(1) + 800, 'on-wrong', 'lb-wrong'),
					show(cast.start(1) + 1500, 'lb-ub'),
					{ at: cast.start(1) + 2200, do: 'pulse', el: 'on-wrong' },
					{ at: cast.start(1) + 3000, do: 'pulse', el: 'lb-ub' },
					clear(cast.start(2), 'on-wrong', 'lb-wrong', 'lb-ub', 'lb-nocheck', 'on-c3'),
					shot(cast.start(2), 'shot-bad', 2400),
					exec(cast.start(2) + 200, 'c', 6),
					show(cast.start(2) + 900, 'ob-bad'),
					show(cast.start(2) + 1400, 'on-bad-base'),
					show(cast.start(2) + 1900, 'lb-bad'),
					{ at: cast.start(2) + 2700, do: 'pulse', el: 'on-bad-base' },
					{ at: cast.start(2) + 3300, do: 'pulse', el: 'lb-bad' },
				),
			},
		},

		// ─── Scene 7. The limits ────────────────────────────────────────────
		{
			id: 'limits',
			chapter: 'limits',
			scene: 'journey',
			title: { es: 'Los límites de simular herencia', en: 'The limits of simulating inheritance' },
			subtitles: limits.list,
			motion: {
				cues: seq(
					clear(0, 'ob-bad', 'on-bad-base', 'lb-bad', 'on-c6'),
					shot(0, 'shot-all', 2600),
					show(500, 'lb-lim-types'),
					{ at: 1200, do: 'pulse', el: 'lb-lim-types' },
					show(limits.start(1) + 100, 'lb-lim-manual'),
					show(limits.start(1) + 1200, 'lb-lim-tables'),
					{ at: limits.start(1) + 2000, do: 'pulse', el: 'tb-c' },
					{ at: limits.start(1) + 2300, do: 'pulse', el: 'tb-r' },
					show(limits.start(1) + 3000, 'lb-lim-calls'),
					{ at: limits.start(1) + 3800, do: 'pulse', el: 'lb-lim-calls' },
				),
			},
		},

		// ─── Scene 8. The simpler alternative ───────────────────────────────
		{
			id: 'union',
			chapter: 'union',
			scene: 'journey',
			title: { es: 'Cuando basta una unión con etiqueta', en: 'When a tagged union is enough' },
			subtitles: simple.list,
			motion: {
				cues: seq(
					clear(0, 'lb-lim-types', 'lb-lim-manual', 'lb-lim-tables', 'lb-lim-calls'),
					retire(0, 'c'),
					swapProgram(0, 'c', 'd'),
					shot(300, 'shot-mid', 2400),
					build(600, 'd'),
					show(1100, 'ob-s'),
					exec(1500, 'd', 19),
					show(2100, 'on-s-tag', 'lb-tag'),
					{ at: 3200, do: 'pulse', el: 'ob-s' },
					exec(simple.start(1) + 100, 'd', 21, 19),
					exec(simple.start(1) + 800, 'd', 10, 21),
					{ at: simple.start(1) + 1300, do: 'pulse', el: 'on-s-tag' },
					exec(simple.start(1) + 1800, 'd', 13, 10),
					show(simple.start(1) + 2000, 'on-s-data'),
					exec(simple.start(1) + 2500, 'd', 14, 13),
					{ at: simple.start(1) + 3100, do: 'move', el: 'hl', to: 'ln-21', dur: 500 },
					output(simple.start(1) + 3300, 'o-d1'),
					show(simple.start(1) + 3800, 'lb-noheap'),
					shot(simple.start(1) + 4400, 'shot-all', 3000),
					{ at: simple.start(1) + 5000, do: 'pulse', el: 'ob-s' },
					{ at: simple.start(1) + 5600, do: 'pulse', el: 'tb-c' },
					{ at: simple.start(1) + 6000, do: 'pulse', el: 'tb-r' },
				),
			},
		},
	],
};
