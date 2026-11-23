import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Boxes of bits: types, sizes and conversions": a short film (about two minutes)
// for the C lesson "Tipos de Datos" (order: 5). It plays on a single persistent
// canvas (`data-scene="types"` in `src/components/animaciones/tipos-conversiones-c.astro`):
// the program on the left, and on the right every value in a box made of bytes
// (one cell per byte). `sizeof` measures the boxes, an `int` at `INT_MAX` refuses
// one more, an `unsigned int` wraps around to 0, `7 / 2` drops its fraction while
// `(double)a / b` converts first, and `-1 < 1u` turns -1 into a huge unsigned value.
// Magenta marks the problem (the limit, the lost fraction, the converted -1);
// violet marks what measures or resolves it (`sizeof`, the cast).

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
 * Runs editor line `line`: slides the bar to it, builds its module (the box a
 * declaration creates, or the machine of a statement) and sends the execution
 * particle there. Its lit state follows.
 */
const run = (at: number, line: number, lit = 700): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
	{ at: at + 100, do: 'enter', el: `m-${line}` },
	{ at: at + 100, do: 'move', el: 'p', to: `a-m${line}`, dur: 700 },
	{ at: at + lit, do: 'enter', el: `on-${line}` },
];

/** A value token glides from where it is to `to`. */
const glide = (at: number, el: string, to: string, dur = 900): MotionCue => ({ at, do: 'move', el, to, dur });

// ─── Captions ───────────────────────────────────────────────────────────────
const boxes = timed(
	say(
		'Cada valor vive en una caja hecha de bytes: el tipo decide su tamaño.',
		'Every value lives in a box made of bytes: its type decides the size.',
	),
	say(
		'`sizeof` mide la caja en bytes, al compilar: `sizeof(int)` da 4.',
		'`sizeof` measures the box in bytes, at compile time: `sizeof(int)` is 4.',
	),
	say(
		'Su resultado es un `size_t`: un entero sin signo para tamaños.',
		'Its result is a `size_t`: an unsigned integer for sizes.',
	),
);
const print = timed(
	say(
		'Un `size_t` se muestra con `%zu`. Con `%d`, `-Wall` te avisa.',
		'A `size_t` is printed with `%zu`. With `%d`, `-Wall` warns you.',
	),
	say(
		'`char` mide siempre 1 byte; `int`, típicamente 4; `double`, 8.',
		'`char` is always 1 byte; `int` is typically 4; `double` is 8.',
	),
	say(
		'El estándar solo garantiza mínimos: un `int` tiene al menos 16 bits.',
		'The standard only guarantees minimums: an `int` has at least 16 bits.',
	),
);
const intmax = timed(
	say(
		'`INT_MAX`, de `<limits.h>`, es el mayor valor de un `int`: 2147483647.',
		'`INT_MAX`, from `<limits.h>`, is the largest `int` value: 2147483647.',
	),
	say(
		'Sumarle 1 desborda la caja: es comportamiento indefinido, no da la vuelta.',
		'Adding 1 overflows the box: it is undefined behavior, it does not wrap.',
	),
);
const wrap = timed(
	say(
		'`contador` empieza en `UINT_MAX`, el mayor `unsigned int`: 4294967295.',
		'`counter` starts at `UINT_MAX`, the largest `unsigned int`: 4294967295.',
	),
	say(
		'Con `+ 1u` da la vuelta y vale 0: aritmética módulo 2ⁿ, definida por el estándar.',
		'With `+ 1u` it wraps around to 0: arithmetic modulo 2ⁿ, defined by the standard.',
	),
);
const intdiv = timed(
	say(
		'`a / b` divide dos `int`: es una división entera.',
		'`a / b` divides two `int` values: it is integer division.',
	),
	say(
		'Por eso `7 / 2` da 3: la parte decimal se descarta, no se redondea.',
		'That is why `7 / 2` is 3: the fraction is dropped, not rounded.',
	),
);
const cast = timed(
	say(
		'El cast `(double)a` convierte `a` antes de dividir: 7 pasa a 7.0.',
		'The cast `(double)a` converts `a` before dividing: 7 becomes 7.0.',
	),
	say(
		'La expresión mezcla `double` e `int`: `b` se convierte sola, una conversión implícita.',
		'The expression mixes `double` and `int`: `b` is converted alone, an implicit conversion.',
	),
	say(
		'`(double)7 / 2` da 3.5, que `%f` muestra como 3.500000.',
		'`(double)7 / 2` is 3.5, which `%f` prints as 3.500000.',
	),
);
const trap = timed(
	say(
		'`menosUno < uno` mezcla con signo y sin signo: se compara en `unsigned int`.',
		'`minusOne < one` mixes signed and unsigned: it is compared as `unsigned int`.',
	),
	say(
		'-1 se convierte en `UINT_MAX`, 4294967295, que no es menor que 1.',
		'-1 is converted to `UINT_MAX`, 4294967295, which is not less than 1.',
	),
	say(
		'Por eso `-1 < 1u` es falso y muestra 0. `-Wextra` lo avisa.',
		'That is why `-1 < 1u` is false and prints 0. `-Wextra` warns about it.',
	),
);
const recap = timed(
	say(
		'El tipo decide el tamaño, el rango y el resultado de cada operación.',
		'The type decides the size, the range and the result of every operation.',
	),
	say(
		'Haz el cast antes de dividir y no mezcles con signo y sin signo.',
		'Cast before dividing, and do not mix signed and unsigned.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'sizes', label: { es: 'sizeof y size_t', en: 'sizeof and size_t' } },
		{ id: 'edge', label: { es: 'El borde de la caja', en: 'The edge of the box' } },
		{ id: 'division', label: { es: 'División entera', en: 'Integer division' } },
		{ id: 'cast', label: { es: 'El cast (double)', en: 'The (double) cast' } },
		{ id: 'trap', label: { es: 'La trampa de -1 < 1u', en: 'The -1 < 1u trap' } },
		{ id: 'whole', label: { es: 'Todo el programa', en: 'The whole program' } },
	],
	steps: [
		// ─── Scene 1. sizeof and size_t ─────────────────────────────────────
		{
			id: 'boxes',
			chapter: 'sizes',
			scene: 'types',
			title: { es: 'Cada tipo, una caja de bytes', en: 'Every type, a box of bytes' },
			subtitles: boxes.list,
			motion: {
				cues: seq(
					shot(0, 'shot-sizes', 2600),
					{ at: 200, do: 'enter', el: 'hl' },
					{ at: 300, do: 'enter', el: 'p' },
					{ at: 500, do: 'enter', el: 'b-char' },
					{ at: 800, do: 'enter', el: 'b-int' },
					...run(1200, 5),
					{ at: 2600, do: 'pulse', el: 'm-5' },
					...clear(boxes.start(1), 'on-5'),
					...run(boxes.start(1) + 100, 6),
					{ at: boxes.start(1) + 900, do: 'draw', el: 'r-int', dur: 900 },
					{ at: boxes.start(1) + 1800, do: 'enter', el: 't-4' },
					glide(boxes.start(1) + 2000, 't-4', 'a-bytes'),
					{ at: boxes.start(1) + 2900, do: 'exit', el: 't-4', dur: 300 },
					{ at: boxes.start(1) + 2900, do: 'enter', el: 'v-bytes' },
					{ at: boxes.start(2) + 300, do: 'pulse', el: 'm-6' },
					{ at: boxes.start(2) + 700, do: 'enter', el: 'lb-sizet' },
					{ at: boxes.start(2) + 2200, do: 'pulse', el: 'lb-sizet' },
				),
			},
		},
		{
			id: 'print',
			chapter: 'sizes',
			scene: 'types',
			title: { es: 'sizeof con %zu', en: 'sizeof with %zu' },
			subtitles: print.list,
			motion: {
				cues: seq(
					...clear(0, 'on-6', 'lb-sizet'),
					...run(200, 7),
					{ at: 900, do: 'draw', el: 'r-char', dur: 700 },
					{ at: 1300, do: 'draw', el: 'r-alt', dur: 900 },
					{ at: 1600, do: 'type', el: 'o-7', dur: 500 },
					{ at: 2200, do: 'pulse', el: 'r-int' },
					{ at: print.start(1) + 200, do: 'pulse', el: 'b-char' },
					{ at: print.start(1) + 1400, do: 'pulse', el: 'b-int' },
					{ at: print.start(1) + 2600, do: 'pulse', el: 'm-5' },
					{ at: print.start(2) + 400, do: 'enter', el: 'lb-min' },
					{ at: print.start(2) + 1400, do: 'pulse', el: 'r-int' },
					{ at: print.start(2) + 2400, do: 'pulse', el: 'lb-min' },
				),
			},
		},

		// ─── Scene 2. The edge of the box ───────────────────────────────────
		{
			id: 'intmax',
			chapter: 'edge',
			scene: 'types',
			title: { es: 'Un int en INT_MAX', en: 'An int at INT_MAX' },
			subtitles: intmax.list,
			motion: {
				cues: seq(
					...clear(0, 'on-7', 'r-char', 'r-alt', 'r-int', 'lb-min'),
					shot(0, 'shot-edge', 2400),
					...run(400, 8),
					{ at: 1300, do: 'enter', el: 'full-int' },
					{ at: 1500, do: 'enter', el: 'v-int' },
					{ at: 1900, do: 'type', el: 'o-8', dur: 600 },
					{ at: 2900, do: 'pulse', el: 'v-int' },
					{ at: intmax.start(1), do: 'enter', el: 'warn-8' },
					{ at: intmax.start(1) + 300, do: 'enter', el: 't-plus' },
					glide(intmax.start(1) + 600, 't-plus', 'a-wall', 900),
					{ at: intmax.start(1) + 1400, do: 'enter', el: 'wall' },
					{ at: intmax.start(1) + 1600, do: 'pulse', el: 'wall' },
					glide(intmax.start(1) + 1700, 't-plus', 'a-plus', 700),
					{ at: intmax.start(1) + 1900, do: 'enter', el: 'lb-ub' },
					{ at: intmax.start(1) + 2600, do: 'exit', el: 't-plus', dur: 400 },
					{ at: intmax.start(1) + 3200, do: 'pulse', el: 'lb-ub' },
				),
			},
		},
		{
			id: 'wrap',
			chapter: 'edge',
			scene: 'types',
			title: { es: 'Un unsigned da la vuelta', en: 'An unsigned wraps around' },
			subtitles: wrap.list,
			motion: {
				cues: seq(
					...clear(0, 'on-8'),
					...run(200, 9),
					{ at: 1000, do: 'enter', el: 'v-cmax' },
					{ at: 2400, do: 'pulse', el: 'v-cmax' },
					...run(wrap.start(1), 10),
					{ at: wrap.start(1) + 300, do: 'enter', el: 't-plusu' },
					glide(wrap.start(1) + 600, 't-plusu', 'a-cnt', 900),
					{ at: wrap.start(1) + 1500, do: 'exit', el: 't-plusu', dur: 300 },
					{ at: wrap.start(1) + 1500, do: 'exit', el: 'v-cmax', dur: 300 },
					{ at: wrap.start(1) + 1500, do: 'draw', el: 'arc-wrap', dur: 1000 },
					{ at: wrap.start(1) + 2300, do: 'enter', el: 'v-c0' },
					{ at: wrap.start(1) + 2500, do: 'enter', el: 'lb-wrap' },
					{ at: wrap.start(1) + 2700, do: 'flow', el: 'arc-wrap' },
					...run(wrap.start(1) + 3000, 11),
					{ at: wrap.start(1) + 3600, do: 'type', el: 'o-11', dur: 300 },
				),
			},
		},

		// ─── Scene 3. Integer division ──────────────────────────────────────
		{
			id: 'intdiv',
			chapter: 'division',
			scene: 'types',
			title: { es: '7 / 2 es una división entera', en: '7 / 2 is integer division' },
			subtitles: intdiv.list,
			motion: {
				cues: seq(
					...clear(0, 'on-9', 'on-10', 'on-11'),
					shot(0, 'shot-div', 2600),
					...run(400, 12),
					...run(1800, 13),
					{ at: 2300, do: 'enter', el: 't-7' },
					{ at: 2300, do: 'enter', el: 't-2' },
					glide(2500, 't-7', 'a-m13'),
					glide(2500, 't-2', 'a-m13'),
					{ at: 3000, do: 'enter', el: 'lb-intdiv' },
					{ at: 3400, do: 'exit', el: 't-7', dur: 300 },
					{ at: 3400, do: 'exit', el: 't-2', dur: 300 },
					{ at: intdiv.start(1), do: 'enter', el: 't-3' },
					glide(intdiv.start(1) + 200, 't-3', 'a-res1', 800),
					{ at: intdiv.start(1) + 300, do: 'enter', el: 't-frac' },
					glide(intdiv.start(1) + 500, 't-frac', 'a-drop', 900),
					{ at: intdiv.start(1) + 900, do: 'type', el: 'o-13a', dur: 300 },
					{ at: intdiv.start(1) + 1500, do: 'exit', el: 't-frac', dur: 500 },
					{ at: intdiv.start(1) + 2200, do: 'pulse', el: 't-3' },
				),
			},
		},

		// ─── Scene 4. The (double) cast ─────────────────────────────────────
		{
			id: 'cast',
			chapter: 'cast',
			scene: 'types',
			title: { es: 'El cast convierte antes de dividir', en: 'The cast converts before dividing' },
			subtitles: cast.list,
			motion: {
				cues: seq(
					...clear(0, 'on-12', 'on-13', 'lb-intdiv'),
					// The tokens left for the machine; they are sent back home while hidden.
					glide(100, 't-7', 'a-a', 100),
					glide(100, 't-2', 'a-b', 100),
					{ at: 300, do: 'enter', el: 't-7' },
					{ at: 400, do: 'enter', el: 'lb-cast' },
					glide(600, 't-7', 'a-cast', 800),
					{ at: 1400, do: 'exit', el: 't-7', dur: 300 },
					{ at: 1400, do: 'enter', el: 't-7d' },
					{ at: 1600, do: 'pulse', el: 'lb-cast' },
					glide(2000, 't-7d', 'a-m13'),
					{ at: 2200, do: 'enter', el: 'on-13' },
					{ at: cast.start(1) + 200, do: 'enter', el: 't-2' },
					glide(cast.start(1) + 400, 't-2', 'a-conv', 800),
					{ at: cast.start(1) + 1200, do: 'exit', el: 't-2', dur: 300 },
					{ at: cast.start(1) + 1200, do: 'enter', el: 't-2d' },
					{ at: cast.start(1) + 1300, do: 'enter', el: 'lb-implicit' },
					glide(cast.start(1) + 1800, 't-2d', 'a-m13'),
					{ at: cast.start(2), do: 'exit', el: 't-7d', dur: 300 },
					{ at: cast.start(2), do: 'exit', el: 't-2d', dur: 300 },
					{ at: cast.start(2) + 100, do: 'enter', el: 't-35' },
					glide(cast.start(2) + 300, 't-35', 'a-res2', 800),
					{ at: cast.start(2) + 900, do: 'type', el: 'o-13b', dur: 600 },
					{ at: cast.start(2) + 1800, do: 'pulse', el: 't-35' },
					{ at: cast.start(2) + 2600, do: 'pulse', el: 't-3' },
				),
			},
		},

		// ─── Scene 5. The -1 < 1u trap ──────────────────────────────────────
		{
			id: 'trap',
			chapter: 'trap',
			scene: 'types',
			title: { es: 'Comparar con signo y sin signo', en: 'Comparing signed and unsigned' },
			subtitles: trap.list,
			motion: {
				cues: seq(
					...clear(0, 'on-13', 'lb-cast', 'lb-implicit'),
					shot(0, 'shot-trap', 2600),
					...run(400, 14),
					...run(1300, 15),
					...run(2400, 16),
					{ at: 2900, do: 'enter', el: 't-m1' },
					glide(3100, 't-m1', 'a-conv2', 900),
					{ at: 3400, do: 'enter', el: 'warn-16' },
					{ at: trap.start(1), do: 'exit', el: 't-m1', dur: 300 },
					{ at: trap.start(1), do: 'enter', el: 't-huge' },
					{ at: trap.start(1) + 500, do: 'pulse', el: 't-huge' },
					{ at: trap.start(1) + 1200, do: 'enter', el: 't-one' },
					glide(trap.start(1) + 1300, 't-huge', 'a-m16'),
					glide(trap.start(1) + 1400, 't-one', 'a-m16'),
					{ at: trap.start(2), do: 'exit', el: 't-huge', dur: 300 },
					{ at: trap.start(2), do: 'exit', el: 't-one', dur: 300 },
					{ at: trap.start(2) + 100, do: 'enter', el: 't-0' },
					glide(trap.start(2) + 300, 't-0', 'a-res3', 800),
					{ at: trap.start(2) + 900, do: 'type', el: 'o-16', dur: 300 },
					{ at: trap.start(2) + 1300, do: 'enter', el: 'lb-warn' },
					{ at: trap.start(2) + 2500, do: 'pulse', el: 'lb-warn' },
				),
			},
		},

		// ─── Scene 6. The whole program ─────────────────────────────────────
		{
			id: 'recap',
			chapter: 'whole',
			scene: 'types',
			title: { es: 'El tipo decide', en: 'The type decides' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'on-14', 'on-15', 'on-16'),
					...run(200, 17),
					shot(700, 'shot-all', 3200),
					{ at: 1800, do: 'pulse', el: 'b-int' },
					{ at: 2400, do: 'pulse', el: 'm-9' },
					{ at: 3000, do: 'pulse', el: 't-3' },
					{ at: 3600, do: 'pulse', el: 't-0' },
					{ at: recap.start(1) + 300, do: 'enter', el: 'lb-sum' },
					{ at: recap.start(1) + 900, do: 'pulse', el: 't-35' },
					{ at: recap.start(1) + 1700, do: 'pulse', el: 'lb-warn' },
					{ at: recap.start(1) + 2500, do: 'pulse', el: 'lb-sum' },
				),
			},
		},
	],
};
