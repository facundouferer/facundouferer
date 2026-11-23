import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The string and its terminator": a short film (about two minutes) for the C lesson
// "Cadenas". It plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/cadenas-terminador-c.astro`): the program on the left,
// and on the right an isometric row of `char` cells, each with its index on the front
// edge and its character on top. The same row holds every array of the film (`saludo`,
// `linea`, `destino`, `clave`). The terminator `'\0'` is always violet; a character that
// gets in the way (the newline, the bytes written past the bound) is magenta; the light
// blue particle is the execution flow and reads or counts the cells. One module per
// instruction stands in front of the cells, labelled with its editor line. No pointer
// variables appear: the lesson works with cells and indexes.

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

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/** Fades several elements in, one after the other. */
const reveal = (at: number, gap: number, ...els: string[]): MotionCue[] =>
	els.map((el, index) => ({ at: at + index * gap, do: 'enter' as const, el }));

/** Replaces what a cell shows: the old character fades, the new one appears on the same cell. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 250 },
	{ at: at + 150, do: 'enter', el: to, dur: 400 },
];

/**
 * Runs the instruction of module `id` (program letter + editor line): slides the bar
 * to its line, builds the module the first time, sends the particle to it and lights it.
 */
const run = (at: number, id: string, build = true): MotionCue[] => {
	const line = id.slice(1);
	return [
		{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
		...(build ? [{ at: at + 100, do: 'enter' as const, el: `m-${id}` }] : []),
		{ at: at + 100, do: 'move', el: 'px', to: `a-m${id}`, dur: 700 },
		build ? { at: at + 700, do: 'enter', el: `on-${id}` } : { at: at + 700, do: 'pulse', el: `m-${id}` },
	];
};

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const modulesOf = (ids: string[]) => ids.flatMap((id) => [`m-${id}`, `on-${id}`]);
const rowA = ['a5', 'a7', 'a8', 'a9'];
const rowB = ['b5', 'b7', 'b8', 'b12', 'b13'];
const rowC = ['c4', 'c5'];
const rowD = ['d4', 'd6', 'd8', 'd9'];

// ─── Captions ───────────────────────────────────────────────────────────────
const fill = timed(
	say('`char saludo[10]` reserva diez `char` contiguos, con índices de 0 a 9.', '`char greeting[10]` reserves ten contiguous `char`, indexed 0 to 9.'),
	say('`"Hola"` llena las primeras cuatro celdas, una letra en cada una.', '`"Code"` fills the first four cells, one letter in each.'),
	say("Luego va `'\\0'`, el terminador: la marca que indica dónde termina el texto.", "Then comes `'\\0'`, the terminator: the mark that says where the text ends."),
);
const capacity = timed(
	say("`printf` con `%s` lee celda por celda y se detiene en `'\\0'`.", "`printf` with `%s` reads cell by cell and stops at `'\\0'`."),
	say('`sizeof saludo`: la capacidad es 10, fija desde la declaración.', '`sizeof greeting`: the capacity is 10, fixed when declared.'),
);
const length = timed(
	say("`strlen` cuenta los caracteres que hay antes de `'\\0'`: la longitud es 4.", "`strlen` counts the characters that come before `'\\0'`: the length is 4."),
	say('Longitud `L` necesita capacidad `L + 1`: aquí caben hasta 9 letras.', 'Length `L` needs capacity `L + 1`: up to 9 letters fit here.'),
);
const read = timed(
	say('`fgets` lee una línea completa, con sus espacios.', '`fgets` reads a whole line, spaces included.'),
	say("Recibe la capacidad: guarda como mucho 49 caracteres y agrega `'\\0'`.", "It receives the capacity: it stores at most 49 characters and adds `'\\0'`."),
	say("También guarda el `'\\n'` del Enter, después de `Ana Paz`.", "It also keeps the `'\\n'` from Enter, after `Ana Paz`."),
);
const newline = timed(
	say("`strcspn(linea, \"\\n\")` da la posición del primer `'\\n'`: la 7.", "`strcspn(line, \"\\n\")` gives the position of the first `'\\n'`: 7."),
	say("Un `'\\0'` en esa posición quita el salto de línea.", "A `'\\0'` at that position removes the newline."),
	say('Imprime `Leíste "Ana Paz" (7 caracteres)`.', 'It prints `You typed "Ana Paz" (7 characters)`.'),
);
const overflow = timed(
	say('`destino` tiene capacidad 6; `"Bienvenido"` necesita 11.', '`destination` has capacity 6; `"Welcome"` needs 8.'),
	say('`strcpy` no conoce la capacidad del destino: escribe fuera del límite.', "`strcpy` does not know the destination's capacity: it writes past the bound."),
	say('Pisa 5 bytes vecinos: comportamiento indefinido, un desbordamiento.', 'It overwrites 2 neighbouring bytes: undefined behavior, a buffer overflow.'),
);
const safe = timed(
	say("`snprintf` recibe la capacidad: escribe 5 letras y siempre termina con `'\\0'`.", "`snprintf` receives the capacity: it writes 5 letters and always ends with `'\\0'`."),
	say('Devuelve cuántos caracteres habría escrito: 10, no menor que 6.', 'It returns how many it would have written: 7, not below 6.'),
	say('Así se detecta el truncado: `No entra completo; se guardó "Bienv"`.', 'So truncation is detected: `It does not fit; stored "Welco"`.'),
);
const compare = timed(
	say('`==` no compara letras: pregunta si es el mismo arreglo.', '`==` does not compare letters: it asks if it is the same array.'),
	say("`strcmp` compara carácter por carácter hasta `'\\0'`: sin diferencias, devuelve 0.", "`strcmp` compares character by character up to `'\\0'`: no difference, it returns 0."),
	say('Imprime `Clave correcta`: todo depende del terminador.', 'It prints `Correct key`: it all relies on the terminator.'),
);

// The cells read by `printf` and counted by `strlen`, and the pairs compared by `strcmp`.
const word = range(0, 3);
const COUNT = Math.floor((length.start(1) - 1400) / 5);
const counting = word.flatMap((i): MotionCue[] => {
	const at = 900 + i * COUNT;
	return [
		{ at, do: 'move', el: 'px', to: `a-c${i}`, dur: 450 },
		{ at: at + 450, do: 'enter', el: `lit-${i}` },
		{ at: at + 550, do: 'enter', el: `cnt-${i + 1}` },
	];
});
// The literal of scene 6 has 7 letters in Spanish and 6 in English; the seventh pair is
// empty in English, and the terminator pair is always `kq-end`.
const PAIR = 420;
const pairs = range(0, 6).map((i): MotionCue => ({ at: compare.start(1) + 600 + i * PAIR, do: 'enter', el: `kq-${i}` }));
const PAIRS_END = compare.start(1) + 600 + 7 * PAIR;

export const script: AnimationScript = {
	chapters: [
		{ id: 'array', label: { es: 'Un arreglo de char', en: 'An array of char' } },
		{ id: 'measure', label: { es: 'Capacidad y longitud', en: 'Capacity and length' } },
		{ id: 'read', label: { es: 'Leer una línea', en: 'Reading a line' } },
		{ id: 'overflow', label: { es: 'Una copia que no entra', en: 'A copy that does not fit' } },
		{ id: 'safe', label: { es: 'Copiar con snprintf', en: 'Copying with snprintf' } },
		{ id: 'compare', label: { es: 'Comparar con strcmp', en: 'Comparing with strcmp' } },
	],
	steps: [
		// ─── Scene 1. An array of char, closed by the terminator ──────────────
		{
			id: 'fill',
			chapter: 'array',
			scene: 'journey',
			title: { es: 'Celdas de char y un terminador', en: 'Char cells and a terminator' },
			subtitles: fill.list,
			motion: {
				cues: seq(
					shot(0, 'shot-row', 3000),
					Array.from({ length: 11 }, (_, i): MotionCue => ({ at: 200 + i * 150, do: 'type', el: `ea-${i + 1}`, dur: 300 })),
					{ at: 2000, do: 'enter', el: 'plate-main' },
					{ at: 2100, do: 'move', el: 'hl', to: 'ln-5', dur: 1 },
					{ at: 2200, do: 'enter', el: 'hl' },
					{ at: 2300, do: 'enter', el: 'm-a5' },
					{ at: 2300, do: 'move', el: 'px', to: 'a-ma5', dur: 1 },
					{ at: 2400, do: 'enter', el: 'px' },
					{ at: 2900, do: 'enter', el: 'on-a5' },
					reveal(3000, 140, ...range(0, 9).map((i) => `c-${i}`)),
					{ at: 4500, do: 'enter', el: 'lb-saludo' },
					reveal(fill.start(1) + 300, 450, ...word.map((i) => `g-h-${i}`)),
					{ at: fill.start(2) + 200, do: 'enter', el: 'g-h-4' },
					{ at: fill.start(2) + 700, do: 'enter', el: 'ch-term' },
					{ at: fill.start(2) + 1300, do: 'pulse', el: 'g-h-4' },
					reveal(fill.start(2) + 2000, 120, ...range(5, 9).map((i) => `g-h-${i}`)),
				),
			},
		},

		// ─── Scene 2. Capacity and length ──────────────────────────────────
		{
			id: 'capacity',
			chapter: 'measure',
			scene: 'journey',
			title: { es: 'La capacidad la fija la declaración', en: 'The declaration fixes the capacity' },
			subtitles: capacity.list,
			motion: {
				cues: seq(
					clear(0, 'ch-term'),
					run(0, 'a7'),
					{ at: 900, do: 'draw', el: 'fl-read', dur: 1800 },
					{ at: 2800, do: 'pulse', el: 'g-h-4' },
					{ at: 3100, do: 'type', el: 'oa-1', dur: 600 },
					run(capacity.start(1), 'a8'),
					{ at: capacity.start(1) + 800, do: 'draw', el: 'cap-h', dur: 1400 },
					{ at: capacity.start(1) + 2300, do: 'type', el: 'oa-2', dur: 600 },
				),
			},
		},
		{
			id: 'length',
			chapter: 'measure',
			scene: 'journey',
			title: { es: 'strlen cuenta hasta el terminador', en: 'strlen counts up to the terminator' },
			subtitles: length.list,
			motion: {
				cues: seq(
					clear(0, 'fl-read'),
					shot(0, 'shot-word', 1800),
					run(0, 'a9'),
					counting,
					{ at: 900 + 4 * COUNT, do: 'move', el: 'px', to: 'a-c4', dur: 450 },
					{ at: 900 + 4 * COUNT + 500, do: 'pulse', el: 'g-h-4' },
					{ at: 900 + 4 * COUNT + 700, do: 'draw', el: 'len-h', dur: 900 },
					{ at: length.start(1) + 200, do: 'type', el: 'oa-3', dur: 500 },
					shot(length.start(1) + 300, 'shot-row', 1800),
					{ at: length.start(1) + 1200, do: 'enter', el: 'ch-rule' },
					{ at: length.start(1) + 2000, do: 'pulse', el: 'cap-h' },
				),
			},
		},

		// ─── Scene 3. Reading a line with fgets ─────────────────────────────
		{
			id: 'fgets',
			chapter: 'read',
			scene: 'journey',
			title: { es: 'fgets guarda la línea y su salto', en: 'fgets keeps the line and its newline' },
			subtitles: read.list,
			motion: {
				cues: seq(
					clear(
						0,
						'ea',
						'oa-1',
						'oa-2',
						'oa-3',
						'lb-saludo',
						'cap-h',
						'len-h',
						'ch-rule',
						...range(0, 9).map((i) => `g-h-${i}`),
						...word.flatMap((i) => [`lit-${i}`, `cnt-${i + 1}`]),
						...modulesOf(rowA),
					),
					shot(0, 'shot-line', 2400),
					{ at: 500, do: 'enter', el: 'eb' },
					run(700, 'b5'),
					reveal(1300, 100, 'c-10', 'c-11', 'tail', 'lb-linea'),
					run(2200, 'b7'),
					{ at: 2800, do: 'type', el: 'ob-1', dur: 700 },
					run(read.start(1), 'b8'),
					{ at: read.start(1) + 800, do: 'type', el: 'ob-in', dur: 700 },
					reveal(read.start(1) + 1600, 260, ...range(0, 6).map((i) => `g-f-${i}`)),
					{ at: read.start(1) + 3500, do: 'enter', el: 'ch-cap' },
					{ at: read.start(2) + 200, do: 'enter', el: 'g-f-7' },
					{ at: read.start(2) + 700, do: 'enter', el: 'g-f-8' },
					{ at: read.start(2) + 1300, do: 'enter', el: 'ch-nl' },
					{ at: read.start(2) + 2000, do: 'pulse', el: 'g-f-7' },
				),
			},
		},
		{
			id: 'newline',
			chapter: 'read',
			scene: 'journey',
			title: { es: 'Quitar el salto de línea', en: 'Removing the newline' },
			subtitles: newline.list,
			motion: {
				cues: seq(
					clear(0, 'ch-cap'),
					run(0, 'b12'),
					{ at: 900, do: 'draw', el: 'fl-scan', dur: 2000 },
					{ at: 2900, do: 'enter', el: 'ch-pos' },
					{ at: 3200, do: 'pulse', el: 'g-f-7' },
					clear(newline.start(1), 'ch-nl'),
					swap(newline.start(1) + 300, 'g-f-7', 'g-f-7z'),
					{ at: newline.start(1) + 1200, do: 'pulse', el: 'g-f-7z' },
					{ at: newline.start(1) + 1800, do: 'flow', el: 'fl-scan' },
					run(newline.start(2), 'b13'),
					{ at: newline.start(2) + 800, do: 'type', el: 'ob-2', dur: 900 },
				),
			},
		},

		// ─── Scene 4. strcpy writes past the capacity ───────────────────────
		{
			id: 'overflow',
			chapter: 'overflow',
			scene: 'journey',
			title: { es: 'strcpy no conoce la capacidad', en: 'strcpy does not know the capacity' },
			subtitles: overflow.list,
			motion: {
				cues: seq(
					clear(
						0,
						'eb',
						'ob-1',
						'ob-in',
						'ob-2',
						'lb-linea',
						'tail',
						'fl-scan',
						'ch-pos',
						...range(0, 8).map((i) => `g-f-${i}`),
						'g-f-7z',
						...range(6, 11).map((i) => `c-${i}`),
						...modulesOf(rowB),
					),
					shot(0, 'shot-over', 2400),
					{ at: 500, do: 'enter', el: 'ec' },
					run(700, 'c4'),
					{ at: 1300, do: 'enter', el: 'lb-destino' },
					{ at: 1500, do: 'draw', el: 'cap-d', dur: 1000 },
					{ at: 2600, do: 'enter', el: 'nb' },
					run(overflow.start(1), 'c5'),
					reveal(overflow.start(1) + 900, 220, ...range(0, 5).map((i) => `g-o-${i}`)),
					{ at: overflow.start(1) + 2400, do: 'enter', el: 'ch-nocap' },
					{ at: overflow.start(2) - 600, do: 'enter', el: 'err-c5' },
					reveal(overflow.start(2), 300, 'sp-0', 'sp-1', 'sp-2', 'sp-3', 'sp-end'),
					{ at: overflow.start(2) + 1700, do: 'enter', el: 'ch-ub' },
					{ at: overflow.start(2) + 2300, do: 'pulse', el: 'nb' },
				),
			},
		},

		// ─── Scene 5. snprintf truncates and keeps the terminator ───────────
		{
			id: 'safe',
			chapter: 'safe',
			scene: 'journey',
			title: { es: 'snprintf trunca y termina con \\0', en: 'snprintf truncates and ends with \\0' },
			subtitles: safe.list,
			motion: {
				cues: seq(
					clear(0, 'ec', 'err-c5', 'ch-nocap', 'ch-ub', 'sp-0', 'sp-1', 'sp-2', 'sp-3', 'sp-end', ...range(0, 5).map((i) => `g-o-${i}`), ...modulesOf(rowC)),
					{ at: 500, do: 'enter', el: 'ed' },
					run(700, 'd4'),
					run(1600, 'd6'),
					reveal(2400, 240, ...range(0, 4).map((i) => `g-s-${i}`)),
					{ at: 3700, do: 'enter', el: 'g-s-5' },
					{ at: safe.start(1) - 400, do: 'pulse', el: 'cap-d' },
					{ at: safe.start(1) - 200, do: 'pulse', el: 'nb' },
					run(safe.start(1), 'd8'),
					{ at: safe.start(1) + 900, do: 'enter', el: 'ch-ret' },
					{ at: safe.start(1) + 1700, do: 'pulse', el: 'g-s-5' },
					run(safe.start(2), 'd9'),
					{ at: safe.start(2) + 800, do: 'type', el: 'od-1', dur: 1000 },
				),
			},
		},

		// ─── Scene 6. strcmp compares the text, up to the terminator ────────
		{
			id: 'compare',
			chapter: 'compare',
			scene: 'journey',
			title: { es: 'strcmp compara el texto', en: 'strcmp compares the text' },
			subtitles: compare.list,
			motion: {
				cues: seq(
					clear(0, 'ed', 'od-1', 'ch-ret', 'lb-destino', 'cap-d', 'nb', ...range(0, 5).map((i) => `g-s-${i}`), ...range(0, 5).map((i) => `c-${i}`), ...modulesOf(rowD)),
					shot(0, 'shot-cmp', 2400),
					{ at: 500, do: 'enter', el: 'ee' },
					run(700, 'e5'),
					{ at: 1300, do: 'enter', el: 'arr-clave' },
					{ at: 2200, do: 'enter', el: 'arr-lit' },
					{ at: 3000, do: 'enter', el: 'ch-eq' },
					clear(compare.start(1), 'ch-eq'),
					run(compare.start(1), 'e7'),
					pairs,
					{ at: PAIRS_END, do: 'enter', el: 'kq-end' },
					{ at: PAIRS_END + 400, do: 'draw', el: 'fl-cmp', dur: 900 },
					{ at: PAIRS_END + 1100, do: 'enter', el: 'ch-zero' },
					run(compare.start(2), 'e8'),
					{ at: compare.start(2) + 800, do: 'type', el: 'oe-1', dur: 600 },
					// The camera pulls back to show both strings whole, closed by their terminators.
					{ at: compare.start(2) + 1200, do: 'camera', to: ['shot-all'], dur: 3000, pad: 0 },
					{ at: compare.start(2) + 1600, do: 'flow', el: 'fl-cmp' },
					{ at: compare.start(2) + 2600, do: 'pulse', el: 'kq-end' },
				),
			},
		},
	],
};
