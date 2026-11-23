import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Functions that receive the object": a short film (about two minutes) for the C lesson
// "Objetos y operaciones: diseño basado en struct". It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/metodos-composicion-c.astro`): the
// lesson's code on the left (the rectangle's operations, then the inventory's `agregar`,
// then `stock` and `liberar`) and on the right the objects as plates: an object is a plate
// whose fields sit on top, an operation is a function that receives an arrow into its plate
// (the pointer, always an arrow, always the first parameter), and a part of an object is a
// smaller plate on the bigger one. Magenta marks the problem (the refused write, `NULL`, the
// error codes); violet what resolves it (`const`, the checks, `free`). Addresses are short
// and fictional; real ones vary.

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

const on = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'enter' as const, el }));
const off = (at: number, els: string[], dur = 400): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur }));
const pulse = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'pulse' as const, el }));

type Program = 'a' | 'k' | 'b' | 'c';

/**
 * One instruction runs: the bar slides to its editor line, the execution flow reaches
 * its module and the module lights up. `a` is the rectangle's operations, `k` the same
 * `area` with the mistaken write, `b` the inventory's `agregar` and `c` its `stock` and
 * `liberar`.
 */
function exec(program: Program, at: number, line: number, dur = 600): MotionCue[] {
	return [
		{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 500) },
		{ at, do: 'move', el: 'p', to: `a${program}-${line}`, dur },
		{ at: at + dur, do: 'enter', el: `on${program}-${line}` },
		{ at: at + dur, do: 'pulse', el: `m${program}-${line}` },
	];
}

/** A value on top of a plate or cell changes: the old text leaves, the new one arrives. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 300 },
	{ at: at + 250, do: 'enter', el: to },
];

/** Puts the flow and the bar on a line without a visible trip (a new program starts). */
const place = (at: number, program: Program, line: number): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a${program}-${line}`, dur: 1 },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 1 },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const object = timed(
	say('En C no hay métodos: una operación es una función que recibe el objeto.', 'C has no methods: an operation is a function that receives the object.'),
	say('`rectangulo_escalar(&r, 2.0)` pasa la dirección de `r` como primer argumento.', '`rectangle_scale(&r, 2.0)` passes the address of `r` as its first argument.'),
	say('El puntero se copia, pero apunta al `r` original: por eso cambia.', 'The pointer is copied, but it points at the original `r`: so it changes.'),
);
const getter = timed(
	say('Una consulta solo lee: recibe `const struct Rectangulo *` y calcula el área.', 'A getter only reads: it takes `const struct Rectangle *` and computes the area.'),
	say('Lee `base` y `altura` por la flecha de solo lectura y devuelve 32.0.', 'It reads `width` and `height` through the read-only arrow and returns 32.0.'),
);
const refused = timed(
	say('Si por error escribes `r->base = 0;`, el compilador lo rechaza.', 'If you write `r->width = 0;` by mistake, the compiler rejects it.'),
	say('`const` garantiza que la consulta no modifica el objeto.', '`const` guarantees that the getter does not modify the object.'),
);
const compose = timed(
	say('Composición: un `Rectangulo` tiene una `esquina`, que a su vez es un `Punto`.', 'Composition: a `Rectangle` has a `corner`, which is itself a `Point`.'),
	say('`rectangulo_mover` no repite la lógica: delega en `punto_mover`.', '`rectangle_move` does not repeat the logic: it delegates to `point_move`.'),
	say('`&r->esquina` apunta a la parte: la esquina pasa de (0, 0) a (2, 0).', '`&r->corner` points at the part: the corner goes from (0, 0) to (2, 0).'),
);
const grow = timed(
	say('El inventario es dueño de su arreglo: `inventario_agregar` lo crea con `realloc`.', 'The inventory owns its array: `inventory_add` creates it with `realloc`.'),
	say('Si `realloc` falla, `productos` conserva el arreglo anterior: no se rompe.', 'If `realloc` fails, `products` keeps the old array: nothing is broken.'),
	say('Un código demasiado largo se rechaza sin tocar nada: `INV_ARGUMENTO_INVALIDO`.', 'A code that is too long is rejected untouched: `INV_INVALID_ARGUMENT`.'),
);
const codes = timed(
	say('Toda operación que puede fallar devuelve un código de resultado: `INV_OK`.', 'Every operation that can fail returns a result code: `INV_OK`.'),
	say('El dato sale por un parámetro de salida: 40 se escribe en `stock`.', 'The value leaves through an output parameter: 40 is written to `stock`.'),
);
const missing = timed(
	say('Con `Z-999` no hay coincidencia: `INV_NO_ENCONTRADO`, y `stock` no cambia.', 'With `Z-999` nothing matches: `INV_NOT_FOUND`, and `stock` is unchanged.'),
	say('`inv_mensaje` traduce el código a texto: el llamador sabe por qué falló.', '`inv_message` turns the code into text: the caller knows why it failed.'),
);
const release = timed(
	say('`inventario_liberar` libera el arreglo: el contenedor libera lo que creó.', '`inventory_release` frees the array: the container frees what it created.'),
	say('Quien usa el contenedor nunca libera sus partes por su cuenta.', 'Whoever uses the container never frees its parts on their own.'),
);

// The modules of each program, in the order they are built.
const MODULES_A = [15, 16, 17, 19, 20, 12, 13, 8, 9, 10];
const MODULES_K = [20];
const MODULES_B = [3, 5, 7, 8, 10, 12, 15, 16, 18, 19, 20, 21, 22];
const MODULES_C = [6, 7, 8, 9, 12, 16, 17];
const modulesOf = (program: Program, lines: number[]) => lines.flatMap((line) => [`m${program}-${line}`, `on${program}-${line}`]);

/** `inventario_agregar` of a code that fits, on the fast path: the cell `cell` is filled. */
function addFast(at: number, call: string, cell: number): MotionCue[] {
	const pace = 260;
	const gap = 70;
	const lines = [3, 18, 20, 21];
	const arrived = new Map<number, number>();
	const cues: MotionCue[] = [...on(at, call)];
	lines.forEach((line, index) => {
		const start = at + 200 + index * (pace + gap);
		cues.push(...exec('b', start, line, pace));
		arrived.set(line, start + pace);
	});
	cues.push({ at: arrived.get(20) ?? at, do: 'exit', el: `xq-${cell}`, dur: 250 });
	cues.push({ at: (arrived.get(20) ?? at) + 100, do: 'enter', el: `xv-${cell}` });
	cues.push(...swap(arrived.get(21) ?? at, `iv-b${cell}`, `iv-b${cell + 1}`));
	cues.push(...off((arrived.get(21) ?? at) + 500, [call], 300));
	return cues;
}

/** One pass of the loop of `stock`: the iteration `i` compares the code of a cell with the one asked for. */
const loopPass = (at: number, dur = 280, gap = 70): MotionCue[] => [...exec('c', at, 6, dur), ...exec('c', at + dur + gap, 7, dur)];

export const script: AnimationScript = {
	chapters: [
		{ id: 'object', label: { es: 'El objeto como primer parámetro', en: 'The object as first parameter' } },
		{ id: 'const', label: { es: 'Consultas con const', en: 'Getters with const' } },
		{ id: 'compose', label: { es: 'Composición y delegación', en: 'Composition and delegation' } },
		{ id: 'owner', label: { es: 'Quién es dueño', en: 'Who owns what' } },
		{ id: 'codes', label: { es: 'Códigos de resultado', en: 'Result codes' } },
		{ id: 'release', label: { es: 'Liberar lo que se creó', en: 'Freeing what was created' } },
	],
	steps: [
		// ─── Scene 1. An operation receives the object by pointer ─────────────
		{
			id: 'object',
			chapter: 'object',
			scene: 'journey',
			title: { es: 'La operación recibe el objeto', en: 'The operation receives the object' },
			subtitles: object.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 1800),
					on(200, 'floor-heap'),
					on(500, 'floor-main'),
					on(800, 'floor-prog'),
					on(1100, 'floor-call'),
					MODULES_A.map((line, index) => ({ at: 1300 + index * 70, do: 'enter' as const, el: `ma-${line}` })),
					on(1900, 'obj-r'),
					on(2100, 'fl-a'),
					on(2250, 'fl-b'),
					on(2400, 'fl-c'),
					on(2600, 'rv-a0', 'rv-b0', 'rv-c0'),
					on(2800, 'nm-r'),
					shot(3000, 'shot-a', 1400),
					{ at: 3300, do: 'type', el: 'oa-0', dur: 900 },
					place(3600, 'a', 15),
					on(3700, 'p', 'hl'),
					on(object.start(1) - 150, 'cl-esc'),
					on(object.start(1) + 100, 'ch-first'),
					exec('a', object.start(1) + 1300, 15, 700),
					on(object.start(1) + 2000, 'v-pr', 'pv-r', 'v-pf', 'pv-f'),
					{ at: object.start(1) + 2300, do: 'draw', el: 'pt-r', dur: 900 },
					pulse(object.start(1) + 3500, 'ch-first', 'obj-r'),
					// The body runs through the arrow: the original rectangle changes.
					exec('a', object.start(2) + 100, 16, 700),
					swap(object.start(2) + 800, 'rv-b0', 'rv-b1'),
					pulse(object.start(2) + 800, 'fl-b'),
					exec('a', object.start(2) + 1700, 17, 700),
					swap(object.start(2) + 2400, 'rv-c0', 'rv-c1'),
					pulse(object.start(2) + 2400, 'fl-c'),
					pulse(object.start(2) + 3200, 'pt-r'),
					off(object.start(2) + 3800, ['cl-esc', 'ch-first'], 300),
				),
			},
		},

		// ─── Scene 2. A getter reads through a const pointer ──────────────────
		{
			id: 'getter',
			chapter: 'const',
			scene: 'journey',
			title: { es: 'Una consulta solo lee', en: 'A getter only reads' },
			subtitles: getter.list,
			motion: {
				cues: seq(
					off(100, ['v-pf', 'pv-f'], 300),
					on(300, 'cl-area'),
					exec('a', 700, 19, 700),
					on(1400, 'ch-const'),
					pulse(1800, 'pt-r'),
					exec('a', getter.start(1) + 100, 20, 700),
					pulse(getter.start(1) + 800, 'rv-b1', 'rv-c1', 'fl-b', 'fl-c'),
					{ at: getter.start(1) + 1500, do: 'type', el: 'oa-1', dur: 600 },
					pulse(getter.start(1) + 2700, 'ch-const'),
					pulse(getter.start(1) + 3500, 'pt-r'),
					pulse(getter.start(1) + 4200, 'pv-r'),
				),
			},
		},
		{
			id: 'refused',
			chapter: 'const',
			scene: 'journey',
			title: { es: 'El compilador rechaza la escritura', en: 'The compiler rejects the write' },
			subtitles: refused.list,
			motion: {
				cues: seq(
					off(0, ['cl-area'], 300),
					off(300, ['ed-a'], 300),
					on(600, 'ed-k'),
					on(800, 'mk-20'),
					on(900, 'gtk-20', 'gtk-20-bar'),
					exec('k', 1200, 20, 700),
					on(2000, 'ch-err'),
					pulse(2100, 'gtk-20-bar', 'mk-20'),
					{ at: 2300, do: 'type', el: 'oa-2', dur: 1300 },
					pulse(refused.start(1) + 300, 'ch-const'),
					pulse(refused.start(1) + 1500, 'ch-err'),
					pulse(refused.start(1) + 2700, 'oa-2'),
					off(refused.start(1) + 3400, ['ch-err'], 300),
				),
			},
		},

		// ─── Scene 3. Composition: the part is a plate on the plate ──────────
		{
			id: 'compose',
			chapter: 'compose',
			scene: 'journey',
			title: { es: 'Una parte dentro del objeto', en: 'A part inside the object' },
			subtitles: compose.list,
			motion: {
				cues: seq(
					// The mistaken line is gone; the editor shows the lesson's code again.
					off(0, ['ed-k', 'ch-const', 'ch-err', 'oa-2', ...modulesOf('k', MODULES_K), 'gtk-20', 'gtk-20-bar'], 300),
					shot(0, 'shot-a', 1500),
					on(400, 'ed-a'),
					place(400, 'a', 12),
					on(900, 'ch-part'),
					pulse(1200, 'fl-a'),
					pulse(2600, 'fl-a'),
					pulse(4200, 'ch-part'),
					// `rectangulo_mover` calls `punto_mover` on the part instead of repeating its logic.
					on(compose.start(1), 'cl-mov'),
					exec('a', compose.start(1) + 300, 12, 700),
					exec('a', compose.start(1) + 1300, 13, 800),
					off(compose.start(1) + 2100, ['cl-mov'], 300),
					on(compose.start(1) + 2300, 'cl-pm'),
					on(compose.start(1) + 2500, 'ch-deleg'),
					pulse(compose.start(1) + 3300, 'ma-13'),
					// The pointer to the part: the same arrow identity, now into the inner plate.
					on(compose.start(2), 'v-pp', 'pv-p'),
					{ at: compose.start(2) + 300, do: 'draw', el: 'pt-p', dur: 900 },
					exec('a', compose.start(2) + 1300, 8, 500),
					exec('a', compose.start(2) + 2000, 9, 600),
					swap(compose.start(2) + 2600, 'rv-a0', 'rv-a1'),
					pulse(compose.start(2) + 2600, 'fl-a'),
					exec('a', compose.start(2) + 3200, 10, 500),
					{ at: compose.start(2) + 3900, do: 'type', el: 'oa-3', dur: 900 },
					pulse(compose.start(2) + 4500, 'fl-a', 'pt-p'),
				),
			},
		},

		// ─── Scene 4. The container owns its dynamic part ────────────────────
		{
			id: 'grow',
			chapter: 'owner',
			scene: 'journey',
			title: { es: 'El inventario crea su arreglo', en: 'The inventory creates its array' },
			subtitles: grow.list,
			motion: {
				cues: seq(
					// The first program has ended: the rectangle and its modules are gone.
					off(0, [
						...modulesOf('a', MODULES_A),
						'ed-a', 'file-a', 'obj-r', 'fl-a', 'fl-b', 'fl-c', 'nm-r', 'rv-a1', 'rv-b1', 'rv-c1',
						'v-pr', 'pv-r', 'v-pp', 'pv-p', 'pt-r', 'pt-p', 'cl-pm', 'ch-part', 'ch-deleg',
						'oa-0', 'oa-1', 'oa-3', 'p', 'hl',
					]),
					shot(100, 'shot-heap', 1600),
					on(500, 'ed-b', 'file-b'),
					MODULES_B.map((line, index) => ({ at: 600 + index * 70, do: 'enter' as const, el: `mb-${line}` })),
					on(700, 'obj-i'),
					on(850, 'fi-a'),
					on(950, 'fi-b'),
					on(1050, 'fi-c'),
					on(1250, 'iv-a0', 'iv-b0', 'iv-c0'),
					on(1450, 'nm-i'),
					on(1700, 'v-pi', 'pv-i'),
					{ at: 1900, do: 'draw', el: 'pt-i', dur: 700 },
					{ at: 2000, do: 'type', el: 'ob-0', dur: 900 },
					on(2400, 'cl-ag1', 'ch-own'),
					place(2500, 'b', 3),
					on(2550, 'p', 'hl'),
					// The first call: 0 == 0, so the array does not exist yet and must be created.
					exec('b', 2700, 3, 500),
					{ at: 3300, do: 'exit', el: 'gtb-3-bar', dur: 300 },
					{ at: 3500, do: 'enter', el: 'gtb-3-open' },
					exec('b', 3500, 7, 450),
					exec('b', 4050, 8, 450),
					on(4500, 'ch-cap'),
					exec('b', 4600, 10, 500),
					on(5200, 'blk-xa'),
					[0, 1, 2, 3].map((index) => ({ at: 5350 + index * 130, do: 'enter' as const, el: `xq-${index}` })),
					// What if realloc fails: the old array stays valid, nothing is half-built.
					exec('b', grow.start(1) + 100, 12, 450),
					{ at: grow.start(1) + 600, do: 'exit', el: 'gtb-12-bar', dur: 300 },
					{ at: grow.start(1) + 800, do: 'enter', el: 'gtb-12-open' },
					on(grow.start(1) + 900, 'ch-fail'),
					on(grow.start(1) + 1900, 'ch-keep'),
					off(grow.start(1) + 3300, ['ch-fail', 'ch-keep', 'ch-cap', 'ch-own'], 400),
					exec('b', grow.start(1) + 3500, 15, 450),
					swap(grow.start(1) + 4000, 'iv-a0', 'iv-a1'),
					{ at: grow.start(1) + 4350, do: 'draw', el: 'pt-prod', dur: 800 },
					exec('b', grow.start(1) + 4200, 16, 400),
					swap(grow.start(1) + 4600, 'iv-c0', 'iv-c1'),
					exec('b', grow.start(1) + 4800, 18, 350),
					exec('b', grow.start(1) + 5200, 19, 350),
					exec('b', grow.start(1) + 5600, 20, 350),
					{ at: grow.start(1) + 5950, do: 'exit', el: 'xq-0', dur: 250 },
					on(grow.start(1) + 6050, 'xv-0'),
					exec('b', grow.start(1) + 6050, 21, 350),
					swap(grow.start(1) + 6400, 'iv-b0', 'iv-b1'),
					exec('b', grow.start(1) + 6500, 22, 300),
					off(grow.start(1) + 6900, ['cl-ag1'], 300),
					// B-200 goes in on the fast path.
					addFast(grow.start(1) + 7100, 'cl-ag2', 1),
					// A code too long: the check stays closed and nothing is touched.
					on(grow.start(2) + 1500, 'cl-ag3'),
					{ at: grow.start(2) + 1550, do: 'exit', el: 'gtb-3-open', dur: 250 },
					{ at: grow.start(2) + 1750, do: 'enter', el: 'gtb-3-bar' },
					exec('b', grow.start(2) + 1900, 3, 450),
					pulse(grow.start(2) + 2400, 'gtb-3-bar'),
					on(grow.start(2) + 2500, 'ch-bad'),
					exec('b', grow.start(2) + 2800, 5, 400),
					{ at: grow.start(2) + 3300, do: 'type', el: 'ob-1', dur: 1000 },
					off(grow.start(2) + 4400, ['cl-ag3', 'ch-bad'], 300),
					// C-300 goes in after it.
					{ at: grow.start(2) + 4500, do: 'exit', el: 'gtb-3-bar', dur: 250 },
					{ at: grow.start(2) + 4700, do: 'enter', el: 'gtb-3-open' },
					addFast(grow.start(2) + 4700, 'cl-ag4', 2),
				),
			},
		},

		// ─── Scene 5. A result code and an output parameter ──────────────────
		{
			id: 'codes',
			chapter: 'codes',
			scene: 'journey',
			title: { es: 'Código de resultado y parámetro de salida', en: 'Result code and output parameter' },
			subtitles: codes.list,
			motion: {
				cues: seq(
					off(0, [...modulesOf('b', MODULES_B), 'gtb-3-open', 'gtb-12-open', 'ed-b', 'file-b', 'ob-0', 'ob-1', 'cl-ag4', 'p', 'hl'], 300),
					shot(100, 'shot-heap', 1400),
					on(400, 'ed-c', 'file-c'),
					MODULES_C.map((line, index) => ({ at: 600 + index * 80, do: 'enter' as const, el: `mc-${line}` })),
					on(1300, 'v-st', 'sv-0'),
					{ at: 1500, do: 'type', el: 'oc-0', dur: 900 },
					on(1900, 'cl-st1'),
					on(2100, 'v-ps', 'pv-s'),
					{ at: 2400, do: 'draw', el: 'pt-s', dur: 800 },
					place(2800, 'c', 6),
					on(2850, 'p', 'hl'),
					// The loop passes over A-100 and B-200 and stops at C-300.
					loopPass(3000),
					loopPass(3700),
					loopPass(4400),
					pulse(5100, 'mc-7'),
					// Found: the value goes out through the pointer and the code says everything went well.
					exec('c', codes.start(1) + 100, 8, 500),
					swap(codes.start(1) + 600, 'sv-0', 'sv-40'),
					on(codes.start(1) + 700, 'ch-out'),
					pulse(codes.start(1) + 700, 'pt-s'),
					exec('c', codes.start(1) + 1500, 9, 500),
					on(codes.start(1) + 2000, 'ch-ok'),
					{ at: codes.start(1) + 2600, do: 'type', el: 'oc-1', dur: 800 },
					pulse(codes.start(1) + 3600, 'v-st', 'sv-40'),
					pulse(codes.start(1) + 4300, 'ch-ok'),
				),
			},
		},
		{
			id: 'missing',
			chapter: 'codes',
			scene: 'journey',
			title: { es: 'Cuando no lo encuentra', en: 'When it finds nothing' },
			subtitles: missing.list,
			motion: {
				cues: seq(
					off(0, ['cl-st1', 'ch-ok', 'ch-out'], 300),
					on(200, 'cl-st2'),
					loopPass(500),
					loopPass(1200),
					loopPass(1900),
					exec('c', 2700, 6, 300),
					exec('c', 3200, 12, 500),
					on(3800, 'ch-nf'),
					on(4100, 'ch-same'),
					pulse(4300, 'sv-40'),
					{ at: missing.start(1) + 200, do: 'type', el: 'oc-2', dur: 900 },
					pulse(missing.start(1) + 1500, 'ch-nf'),
					pulse(missing.start(1) + 2300, 'oc-2'),
					pulse(missing.start(1) + 3200, 'ch-same'),
				),
			},
		},

		// ─── Scene 6. The container frees what it created ────────────────────
		{
			id: 'release',
			chapter: 'release',
			scene: 'journey',
			title: { es: 'El dueño libera sus partes', en: 'The owner frees its parts' },
			subtitles: release.list,
			motion: {
				cues: seq(
					off(0, ['cl-st2', 'ch-nf', 'ch-same', 'v-ps', 'pv-s', 'pt-s', 'v-st', 'sv-40'], 300),
					on(300, 'cl-lib'),
					exec('c', 600, 16, 700),
					on(1400, 'rel-xa', 'ch-free'),
					off(1500, ['pt-prod', 'xv-0', 'xv-1', 'xv-2'], 300),
					off(1800, ['blk-xa'], 400),
					exec('c', 2100, 17, 500),
					swap(2600, 'iv-a1', 'iv-a0'),
					swap(2700, 'iv-b3', 'iv-b0'),
					swap(2800, 'iv-c1', 'iv-c0'),
					off(3000, ['ch-free'], 300),
					off(3400, ['rel-xa'], 500),
					// The camera pulls back: every part was created by its container and freed by it.
					shot(release.start(1) + 300, 'shot-all', 2800),
					on(release.start(1) + 900, 'ch-done'),
					pulse(release.start(1) + 1800, 'floor-heap'),
					pulse(release.start(1) + 2600, 'obj-i'),
					off(release.start(1) + 3200, ['hl'], 400),
				),
			},
		},
	],
};
