import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Un registro con campos": a short film (about two minutes) for the C lesson
// "Estructuras (struct)" (`concepto-de-estructuras`). It plays on a single persistent
// canvas (`data-scene="journey"` in
// `src/components/animaciones/estructuras-registros-c.astro`): a `struct` drawn as a
// plate whose fields are cells laid out one after another, an array of plates, the
// whole plate copied when it travels to a function, the names an `enum` gives to
// integers, a `union` that shares one cell, and the byte strips where padding shows.
// The program of each scene is drawn inside the canvas (an editor whose bar slides to
// the running line); four of the lesson's programs take turns in it. Every step is a
// motion step and the cues keep both halves in sync.

const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

/**
 * Pins captions on the step timeline: each one starts once the previous has been
 * read (same formula as `subtitleReadingTime`, for the slower locale) plus a pause.
 * `offset` leaves room for the camera to travel before the first caption.
 */
const readingMs = (sub: Subtitle) => 1200 + Math.max(sub.text.es.length, sub.text.en.length) * 55;
function timed(offset: number, ...subs: Subtitle[]) {
	let at = offset;
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

/** The particle and the editor bar travel together to the module of one line of a program. */
const runTo = (at: number, view: string, line: number, dur = 800): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `at-${view}-${line}`, dur },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 700) },
];

/** Puts the particle and the bar at a line right away (while hidden) and shows them there. */
const jumpTo = (at: number, view: string, line: number, showAt: number): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `at-${view}-${line}`, dur: 1 },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 1 },
	{ at: showAt, do: 'enter', el: 'hl' },
	{ at: showAt, do: 'enter', el: 'p' },
];

const enters = (at: number, step: number, ...els: string[]): MotionCue[] =>
	els.map((el, index) => ({ at: at + index * step, do: 'enter', el }));
const exits = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit', el, dur: 400 }));

// ─── Captions ───────────────────────────────────────────────────────────────
const record = timed(
	0,
	say('Una `struct` agrupa campos de tipos distintos: aquí, `int`, `char[40]` y `double`.', 'A `struct` groups fields of different types: here `int`, `char[40]` and `double`.'),
	say('La línea 8 crea `a`: una placa con esos tres campos, uno tras otro, en orden.', 'Line 8 creates `a`: a plate with those three fields, one after another, in order.'),
);
const access = timed(
	0,
	say('Los campos se llenan en orden: 1021, "Ana Gomez" y 8.5.', 'The fields are filled in order: 1021, "Ana Gomez" and 8.5.'),
	say('Cada campo se alcanza con un punto: `a.legajo`, `a.nombre`, `a.promedio`.', 'Each field is reached with a dot: `a.id`, `a.name`, `a.average`.'),
);
const array = timed(
	0,
	say('Un arreglo de estructuras es una tabla: cada elemento es un registro completo.', 'An array of structures is a table: every element is a whole record.'),
	say('`grupo[1].promedio` es el campo `promedio` del elemento 1: sube a 7.75.', '`group[1].average` is the `average` field of element 1: it rises to 7.75.'),
);
const copy = timed(
	0,
	say('Pasar una estructura a una función copia el registro completo: `p` es otra placa.', 'Passing a structure to a function copies the whole record: `p` is another plate.'),
	say('Las líneas 7 y 8 cambian solo la copia: `a` sigue valiendo (1.0, 2.0).', 'Lines 7 and 8 change only the copy: `a` is still (1.0, 2.0).'),
	say('`return p` trae otra copia a `b`; con registros grandes, copiar todos los bytes cuesta.', '`return p` brings another copy to `b`; with large records, copying every byte costs.'),
);
const names = timed(
	0,
	say('Un `enum` da nombre a números enteros, en el orden en que los declaras.', 'An `enum` gives names to integers, in the order you declare them.'),
	say('`ENTERO` vale 0 y `REAL` vale 1: constantes enteras con nombre.', '`INTEGER` is 0 and `REAL` is 1: named integer constants.'),
);
const union = timed(
	0,
	say('Una `union` guarda un campo a la vez: `entero` y `real` comparten una celda.', 'A `union` holds one field at a time: `integer` and `real` share one cell.'),
	say('No recuerda cuál escribiste: la etiqueta `tipo` lo dice y se revisa antes de leer.', 'It forgets which one you wrote: the `kind` tag tells you, so check it before reading.'),
	say('Leer `entero` tras guardar `real` reinterpreta los bytes: no tiene sentido.', 'Reading `integer` after storing `real` reinterprets the bytes: it makes no sense.'),
);
const padding = timed(
	0,
	say('`sizeof` puede ser mayor que la suma de los campos: el compilador agrega relleno.', '`sizeof` can exceed the sum of the fields: the compiler adds padding.'),
	say('`saldo` empieza en un múltiplo de 8: tras `activo` quedan 7 bytes vacíos, 24 en total.', '`balance` starts at a multiple of 8: 7 bytes stay empty after `active`, 24 in all.'),
	say('Con `saldo` y `numero` primero y los `char` al final, `sizeof` baja a 16.', 'With `balance` and `number` first and the `char` fields last, `sizeof` drops to 16.'),
);
const close = timed(
	0,
	say('Una `struct` es un registro: campos con punto y copia completa al pasarla a una función.', 'A `struct` is a record: fields with a dot, and a whole copy when passed to a function.'),
	say('`enum` pone nombres, `union` necesita su etiqueta y el relleno agranda `sizeof`.', '`enum` gives names, `union` needs its tag, and padding grows `sizeof`.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'record', label: { es: 'Un registro con campos', en: 'A record with fields' } },
		{ id: 'array', label: { es: 'Un arreglo de registros', en: 'An array of records' } },
		{ id: 'copy', label: { es: 'Se copia el registro completo', en: 'The whole record is copied' } },
		{ id: 'enum', label: { es: 'Nombres para enteros', en: 'Names for integers' } },
		{ id: 'union', label: { es: 'Un lugar para varios campos', en: 'One place for several fields' } },
		{ id: 'padding', label: { es: 'El relleno', en: 'The padding' } },
	],
	steps: [
		// ─── Scene 1. A record with fields ──────────────────────────────────
		{
			id: 'build',
			chapter: 'record',
			scene: 'journey',
			title: { es: 'Una struct es un registro', en: 'A struct is a record' },
			subtitles: record.list,
			motion: {
				cues: seq(
					shot(0, 'shot-rec', 4000),
					...enters(500, 250, 'm-a-8', 'm-a-9', 'm-a-10', 'm-a-11', 'm-a-12', 'm-a-13'),
					{ at: record.start(0), do: 'enter', el: 'hd-a' },
					...enters(record.start(0) + 1200, 400, 'ty-int', 'ty-str', 'ty-dbl'),
					{ at: record.start(1), do: 'exit', el: 'hd-a', dur: 400 },
					{ at: record.start(1) + 200, do: 'enter', el: 'r-a', dur: 900 },
					{ at: record.start(1) + 1200, do: 'enter', el: 'hl' },
					{ at: record.start(1) + 1200, do: 'enter', el: 'p' },
					{ at: record.start(1) + 1800, do: 'enter', el: 'on-a-8' },
					{ at: record.start(1) + 1800, do: 'pulse', el: 'm-a-8' },
					{ at: record.start(1) + 2300, do: 'pulse', el: 'r-a' },
				),
			},
		},
		{
			id: 'access',
			chapter: 'record',
			scene: 'journey',
			title: { es: 'Los campos se alcanzan con un punto', en: 'Fields are reached with a dot' },
			subtitles: access.list,
			motion: {
				cues: seq(
					{ at: 300, do: 'enter', el: 'a-leg' },
					{ at: 900, do: 'enter', el: 'a-nom' },
					{ at: 1500, do: 'enter', el: 'a-pro' },
					{ at: 2000, do: 'pulse', el: 'r-a' },
					{ at: access.start(1), do: 'exit', el: 'on-a-8', dur: 400 },
					...runTo(access.start(1) + 100, 'a', 9, 800),
					{ at: access.start(1) + 900, do: 'enter', el: 'on-a-9' },
					{ at: access.start(1) + 900, do: 'pulse', el: 'm-a-9' },
					{ at: access.start(1) + 1100, do: 'enter', el: 'dot-leg' },
					{ at: access.start(1) + 1100, do: 'enter', el: 'lit-a-leg' },
					{ at: access.start(1) + 1800, do: 'enter', el: 'dot-nom' },
					{ at: access.start(1) + 1800, do: 'enter', el: 'lit-a-nom' },
					{ at: access.start(1) + 2500, do: 'enter', el: 'dot-pro' },
					{ at: access.start(1) + 2500, do: 'enter', el: 'lit-a-pro' },
					{ at: access.start(1) + 3300, do: 'type', el: 'out-a-1', dur: 900 },
				),
			},
		},

		// ─── Scene 2. An array of records ───────────────────────────────────
		{
			id: 'array',
			chapter: 'array',
			scene: 'journey',
			title: { es: 'Un arreglo de registros', en: 'An array of records' },
			subtitles: array.list,
			motion: {
				cues: seq(
					...exits(0, 'lit-a-leg', 'lit-a-nom', 'lit-a-pro', 'dot-leg', 'dot-nom', 'dot-pro', 'ty-int', 'ty-str', 'ty-dbl', 'on-a-9'),
					shot(200, 'shot-arr', 2000),
					...runTo(300, 'a', 10, 800),
					{ at: 1200, do: 'enter', el: 'on-a-10' },
					{ at: 1200, do: 'pulse', el: 'm-a-10' },
					{ at: 1300, do: 'enter', el: 'r-g0', dur: 800 },
					{ at: 1700, do: 'enter', el: 'r-g1', dur: 800 },
					{ at: 2200, do: 'enter', el: 'zone-arr' },
					{ at: 2400, do: 'enter', el: 'ix-0' },
					{ at: 2600, do: 'enter', el: 'ix-1' },
					{ at: 2800, do: 'enter', el: 'arr-tag' },
					// The first element is a copy of `a`: the whole plate travels.
					{ at: 3000, do: 'move', el: 'gh-1', to: 'a-a', dur: 1 },
					{ at: 3100, do: 'enter', el: 'gh-1' },
					{ at: 3300, do: 'move', el: 'gh-1', to: 'a-g0', dur: 1300 },
					{ at: 4700, do: 'exit', el: 'gh-1', dur: 300 },
					...enters(4500, 150, 'g0-leg', 'g0-nom', 'g0-pro'),
					...enters(5000, 150, 'g1-leg', 'g1-nom', 'g1-pro'),
					{ at: array.start(1), do: 'exit', el: 'on-a-10', dur: 400 },
					...runTo(array.start(1) + 100, 'a', 11, 700),
					{ at: array.start(1) + 800, do: 'enter', el: 'on-a-11' },
					{ at: array.start(1) + 800, do: 'pulse', el: 'm-a-11' },
					{ at: array.start(1) + 1400, do: 'exit', el: 'g1-pro', dur: 300 },
					{ at: array.start(1) + 1500, do: 'enter', el: 'g1-pro2' },
					{ at: array.start(1) + 1600, do: 'pulse', el: 'r-g1' },
					{ at: array.start(1) + 2200, do: 'exit', el: 'on-a-11', dur: 400 },
					...runTo(array.start(1) + 2300, 'a', 12, 600),
					{ at: array.start(1) + 2900, do: 'enter', el: 'on-a-12' },
					{ at: array.start(1) + 3000, do: 'type', el: 'out-a-2', dur: 800 },
				),
			},
		},

		// ─── Scene 3. The whole record is copied ────────────────────────────
		{
			id: 'copy',
			chapter: 'copy',
			scene: 'journey',
			title: { es: 'Una función recibe una copia', en: 'A function receives a copy' },
			subtitles: copy.list,
			motion: {
				cues: seq(
					...exits(0, 'ed-a', 'out-a-1', 'out-a-2', 'on-a-12', 'hl', 'p'),
					shot(200, 'shot-fn', 2400),
					{ at: 400, do: 'enter', el: 'ed-b', dur: 500 },
					...jumpTo(600, 'b', 12, 800),
					{ at: 700, do: 'enter', el: 'r-pa', dur: 800 },
					...enters(700, 250, 'm-b-12', 'm-b-13', 'm-b-14', 'm-b-15', 'm-b-16'),
					{ at: 1200, do: 'enter', el: 'on-b-12' },
					{ at: 1200, do: 'pulse', el: 'm-b-12' },
					{ at: 1300, do: 'enter', el: 'pa-x' },
					{ at: 1500, do: 'enter', el: 'pa-y' },
					{ at: 1700, do: 'enter', el: 'tag-main' },
					// Line 13: the call pushes a frame and the whole plate is copied into it.
					{ at: 2000, do: 'exit', el: 'on-b-12', dur: 300 },
					...runTo(2100, 'b', 13, 800),
					{ at: 2900, do: 'enter', el: 'on-b-13' },
					{ at: 2900, do: 'pulse', el: 'm-b-13' },
					{ at: 2500, do: 'enter', el: 'f-fn', dur: 800 },
					{ at: 3300, do: 'move', el: 'gh-2', to: 'a-pa', dur: 1 },
					{ at: 3400, do: 'enter', el: 'gh-2' },
					{ at: 3500, do: 'draw', el: 'fl-cp', dur: 1000 },
					{ at: 3600, do: 'move', el: 'gh-2', to: 'a-pp', dur: 1200 },
					{ at: 4700, do: 'enter', el: 'r-pp', dur: 500 },
					{ at: 4800, do: 'exit', el: 'gh-2', dur: 300 },
					{ at: 5000, do: 'enter', el: 'pp-x' },
					{ at: 5200, do: 'enter', el: 'pp-y' },
					{ at: 5300, do: 'enter', el: 'lb-copy' },
					// Lines 7 and 8 change only the copy.
					{ at: copy.start(1), do: 'exit', el: 'on-b-13', dur: 300 },
					...runTo(copy.start(1) + 100, 'b', 7, 800),
					{ at: copy.start(1) + 900, do: 'enter', el: 'on-b-7' },
					{ at: copy.start(1) + 900, do: 'enter', el: 'hx-b' },
					{ at: copy.start(1) + 1400, do: 'exit', el: 'pp-x', dur: 300 },
					{ at: copy.start(1) + 1500, do: 'enter', el: 'pp-x2' },
					{ at: copy.start(1) + 1600, do: 'pulse', el: 'r-pp' },
					...runTo(copy.start(1) + 2100, 'b', 8, 500),
					{ at: copy.start(1) + 2700, do: 'enter', el: 'on-b-8' },
					{ at: copy.start(1) + 2900, do: 'exit', el: 'pp-y', dur: 300 },
					{ at: copy.start(1) + 3000, do: 'enter', el: 'pp-y2' },
					{ at: copy.start(1) + 3500, do: 'exit', el: 'lb-copy', dur: 400 },
					{ at: copy.start(1) + 3600, do: 'enter', el: 'lb-same' },
					{ at: copy.start(1) + 3800, do: 'pulse', el: 'r-pa' },
					// `return p` brings another copy down to `b`; the frame is popped.
					{ at: copy.start(2), do: 'exit', el: 'hx-b', dur: 400 },
					{ at: copy.start(2), do: 'exit', el: 'on-b-7', dur: 300 },
					{ at: copy.start(2), do: 'exit', el: 'on-b-8', dur: 300 },
					...runTo(copy.start(2) + 100, 'b', 9, 800),
					{ at: copy.start(2) + 900, do: 'enter', el: 'on-b-9' },
					{ at: copy.start(2) + 900, do: 'pulse', el: 'm-b-9' },
					{ at: copy.start(2) + 1000, do: 'move', el: 'gh-3', to: 'a-pp', dur: 1 },
					{ at: copy.start(2) + 1100, do: 'enter', el: 'gh-3' },
					{ at: copy.start(2) + 1200, do: 'draw', el: 'fl-ret', dur: 1000 },
					{ at: copy.start(2) + 1300, do: 'move', el: 'gh-3', to: 'a-pb', dur: 1600 },
					{ at: copy.start(2) + 1700, do: 'exit', el: 'f-fn', dur: 800 },
					{ at: copy.start(2) + 1700, do: 'exit', el: 'r-pp', dur: 800 },
					{ at: copy.start(2) + 1700, do: 'exit', el: 'fl-cp', dur: 600 },
					{ at: copy.start(2) + 2500, do: 'enter', el: 'lb-ret' },
					{ at: copy.start(2) + 2900, do: 'enter', el: 'r-pb', dur: 500 },
					{ at: copy.start(2) + 3000, do: 'exit', el: 'gh-3', dur: 300 },
					{ at: copy.start(2) + 3200, do: 'enter', el: 'pb-x' },
					{ at: copy.start(2) + 3400, do: 'enter', el: 'pb-y' },
					{ at: copy.start(2) + 3600, do: 'enter', el: 'lb-cost' },
					{ at: copy.start(2) + 3700, do: 'exit', el: 'on-b-9', dur: 300 },
					...runTo(copy.start(2) + 3800, 'b', 14, 500),
					{ at: copy.start(2) + 4400, do: 'enter', el: 'on-b-14' },
					{ at: copy.start(2) + 4500, do: 'type', el: 'out-b-1', dur: 600 },
					{ at: copy.start(2) + 5000, do: 'exit', el: 'on-b-14', dur: 300 },
					...runTo(copy.start(2) + 5100, 'b', 15, 500),
					{ at: copy.start(2) + 5700, do: 'enter', el: 'on-b-15' },
					{ at: copy.start(2) + 5800, do: 'type', el: 'out-b-2', dur: 600 },
				),
			},
		},

		// ─── Scene 4. Names for integers ────────────────────────────────────
		{
			id: 'enum',
			chapter: 'enum',
			scene: 'journey',
			title: { es: 'enum: nombres para enteros', en: 'enum: names for integers' },
			subtitles: names.list,
			motion: {
				cues: seq(
					...exits(0, 'ed-b', 'out-b-1', 'out-b-2', 'on-b-15', 'hl', 'p'),
					shot(200, 'shot-en', 2400),
					{ at: 400, do: 'enter', el: 'ed-c', dur: 500 },
					...enters(900, 250, 'm-c-11', 'm-c-12', 'm-c-13', 'm-c-14', 'm-c-16', 'm-c-17'),
					{ at: 1400, do: 'enter', el: 'hd-c1' },
					{ at: 1400, do: 'enter', el: 'r-en', dur: 900 },
					{ at: 1700, do: 'enter', el: 'tag-en' },
					{ at: 2400, do: 'enter', el: 'en-0' },
					{ at: 2900, do: 'enter', el: 'en-1' },
					{ at: names.start(1), do: 'exit', el: 'hd-c1', dur: 400 },
					...jumpTo(names.start(1) - 400, 'c', 11, names.start(1)),
					{ at: names.start(1) + 400, do: 'enter', el: 'on-c-11' },
					{ at: names.start(1) + 400, do: 'pulse', el: 'm-c-11' },
					{ at: names.start(1) + 700, do: 'pulse', el: 'en-0' },
					{ at: names.start(1) + 1100, do: 'pulse', el: 'en-1' },
					{ at: names.start(1) + 1400, do: 'type', el: 'out-c-1', dur: 900 },
				),
			},
		},

		// ─── Scene 5. A place for several fields ────────────────────────────
		{
			id: 'union',
			chapter: 'union',
			scene: 'journey',
			title: { es: 'union: varios campos, una celda', en: 'union: several fields, one cell' },
			subtitles: union.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'on-c-11', dur: 400 },
					shot(100, 'shot-val', 2200),
					{ at: 300, do: 'enter', el: 'hd-c2' },
					{ at: 400, do: 'enter', el: 'r-val', dur: 900 },
					{ at: 1500, do: 'enter', el: 'alt-int' },
					{ at: 1900, do: 'enter', el: 'alt-real' },
					{ at: 2300, do: 'draw', el: 'fl-int', dur: 700 },
					{ at: 2600, do: 'draw', el: 'fl-real', dur: 700 },
					{ at: 3200, do: 'pulse', el: 'dato-cell' },
					...runTo(3600, 'c', 12, 800),
					{ at: 4500, do: 'enter', el: 'on-c-12' },
					{ at: 4500, do: 'pulse', el: 'm-c-12' },
					{ at: 4700, do: 'enter', el: 'v-tag' },
					{ at: 5000, do: 'enter', el: 'v-dat' },
					// The tag says which field is valid; the program checks it on line 13.
					{ at: union.start(1), do: 'exit', el: 'hd-c2', dur: 400 },
					{ at: union.start(1) + 300, do: 'enter', el: 'tag-chk' },
					{ at: union.start(1) + 600, do: 'draw', el: 'fl-tag', dur: 900 },
					{ at: union.start(1) + 1100, do: 'exit', el: 'on-c-12', dur: 300 },
					...runTo(union.start(1) + 1200, 'c', 13, 700),
					{ at: union.start(1) + 1900, do: 'enter', el: 'on-c-13' },
					{ at: union.start(1) + 2000, do: 'pulse', el: 'v-tag' },
					// Reading the other field is the risk; the program reads `real`.
					{ at: union.start(2) + 200, do: 'enter', el: 'bad' },
					{ at: union.start(2) + 400, do: 'draw', el: 'fl-bad', dur: 700 },
					{ at: union.start(2) + 1200, do: 'pulse', el: 'bad' },
					{ at: union.start(2) + 1800, do: 'exit', el: 'on-c-13', dur: 300 },
					...runTo(union.start(2) + 1900, 'c', 14, 600),
					{ at: union.start(2) + 2500, do: 'enter', el: 'on-c-14' },
					{ at: union.start(2) + 2600, do: 'type', el: 'out-c-2', dur: 700 },
					{ at: union.start(2) + 3400, do: 'exit', el: 'on-c-14', dur: 300 },
					...runTo(union.start(2) + 3500, 'c', 16, 700),
					{ at: union.start(2) + 4200, do: 'enter', el: 'on-c-16' },
					{ at: union.start(2) + 4300, do: 'type', el: 'out-c-3', dur: 800 },
					{ at: union.start(2) + 4300, do: 'enter', el: 'sz-val' },
				),
			},
		},

		// ─── Scene 6. The padding ───────────────────────────────────────────
		{
			id: 'padding',
			chapter: 'padding',
			scene: 'journey',
			title: { es: 'El relleno agranda sizeof', en: 'Padding grows sizeof' },
			subtitles: padding.list,
			motion: {
				cues: seq(
					...exits(0, 'ed-c', 'out-c-1', 'out-c-2', 'out-c-3', 'on-c-16', 'hl', 'p'),
					shot(100, 'shot-pad', 2600),
					{ at: 300, do: 'enter', el: 'ed-d', dur: 500 },
					...jumpTo(600, 'd', 15, padding.start(1) + 2200),
					...enters(900, 250, 'm-d-15', 'm-d-16', 'm-d-17'),
					{ at: 1400, do: 'enter', el: 'hd-d1' },
					{ at: 1600, do: 'enter', el: 'st-1', dur: 800 },
					...enters(2200, 300, 'seg-1-0', 'seg-1-2', 'seg-1-3', 'seg-1-5'),
					...enters(2500, 300, 'ch1-activo', 'ch1-saldo', 'ch1-tipo', 'ch1-numero'),
					{ at: 4000, do: 'enter', el: 'tot-sum' },
					// The gaps: `saldo` must start at a multiple of 8, `numero` at a multiple of 4.
					{ at: padding.start(1), do: 'exit', el: 'hd-d1', dur: 400 },
					{ at: padding.start(1) + 300, do: 'enter', el: 'seg-1-1', dur: 700 },
					{ at: padding.start(1) + 800, do: 'enter', el: 'ch1-pad7' },
					{ at: padding.start(1) + 1000, do: 'enter', el: 'al-8' },
					{ at: padding.start(1) + 1800, do: 'enter', el: 'seg-1-4', dur: 700 },
					{ at: padding.start(1) + 2300, do: 'enter', el: 'ch1-pad3' },
					{ at: padding.start(1) + 2800, do: 'enter', el: 'tot-1' },
					{ at: padding.start(1) + 2900, do: 'enter', el: 'on-d-15' },
					{ at: padding.start(1) + 3000, do: 'type', el: 'out-d-1', dur: 700 },
					// Reordering the fields: the big one first, the `char` fields last.
					{ at: padding.start(2), do: 'enter', el: 'hd-d2' },
					{ at: padding.start(2) + 200, do: 'enter', el: 'st-2', dur: 800 },
					...enters(padding.start(2) + 700, 350, 'seg-2-0', 'seg-2-1', 'seg-2-2', 'seg-2-3'),
					...enters(padding.start(2) + 900, 350, 'ch2-saldo', 'ch2-numero', 'ch2-chars'),
					{ at: padding.start(2) + 2200, do: 'enter', el: 'seg-2-4', dur: 700 },
					{ at: padding.start(2) + 2500, do: 'enter', el: 'ch2-pad2' },
					{ at: padding.start(2) + 2600, do: 'exit', el: 'on-d-15', dur: 300 },
					...runTo(padding.start(2) + 2700, 'd', 16, 600),
					{ at: padding.start(2) + 3300, do: 'enter', el: 'on-d-16' },
					{ at: padding.start(2) + 3400, do: 'type', el: 'out-d-2', dur: 700 },
					{ at: padding.start(2) + 3500, do: 'enter', el: 'tot-2' },
				),
			},
		},

		// ─── The whole picture ──────────────────────────────────────────────
		{
			id: 'close',
			chapter: 'padding',
			scene: 'journey',
			title: { es: 'Un registro con campos', en: 'A record with fields' },
			subtitles: close.list,
			motion: {
				cues: seq(
					...exits(0, 'on-d-16', 'hl', 'p', 'hd-d2'),
					// The camera pulls back to reveal the four stations of the film.
					shot(200, 'shot-all', 3600),
					{ at: 1500, do: 'enter', el: 'sum-a' },
					{ at: 1600, do: 'pulse', el: 'r-a' },
					{ at: 2100, do: 'enter', el: 'sum-f' },
					{ at: 2200, do: 'pulse', el: 'r-pb' },
					{ at: 2300, do: 'flow', el: 'fl-ret' },
					{ at: 2700, do: 'enter', el: 'sum-e' },
					{ at: 2800, do: 'pulse', el: 'r-val' },
					{ at: 3300, do: 'enter', el: 'sum-p' },
					{ at: 3400, do: 'pulse', el: 'st-2' },
					{ at: close.start(1) + 300, do: 'pulse', el: 'sum-e' },
					{ at: close.start(1) + 900, do: 'pulse', el: 'sum-p' },
				),
			},
		},
	],
};
