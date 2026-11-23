import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Walking an array with a pointer": a short film (about two minutes) for the C lesson
// "Punteros, arreglos y estructuras". It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/punteros-arreglos-c.astro`):
// the program on the left, and on the right an isometric model of memory. `notas` is
// a row of five contiguous cells, 4 bytes apart, with its address on the front edge
// and its value on top; one past the end there is a dashed cell that holds nothing.
// A pointer is always a violet pin with an arrow tip resting on the cell it points
// to; a pointer variable that lives elsewhere (a parameter) is a cell whose arrow
// reaches that pin. One module per instruction stands in front of memory, labelled
// with its editor line, and the light blue particle is the execution flow. Magenta
// marks the problem (the size lost inside the function, the cell past the end).

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

/** Replaces the value shown on top of a cell: the old one fades, the new one appears. */
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

const cells = [0, 1, 2, 3, 4];
const rowA = ['a4', 'a5', 'a7', 'a8', 'a10'];
const rowB = ['b13', 'b14', 'b16', 'b4', 'b7', 'b9'];
const rowC = ['c18', 'c19', 'c9', 'c10', 'c20', 'c21', 'c22', 'c23'];
const modulesOf = (ids: string[]) => ids.flatMap((id) => [`m-${id}`, `on-${id}`]);

// ─── Captions ───────────────────────────────────────────────────────────────
const build = timed(
	say('`int notas[5]` reserva cinco enteros contiguos, uno junto al otro.', '`int grades[5]` reserves five contiguous ints, side by side.'),
	say('Con `sizeof(int)` igual a 4, cada elemento empieza 4 bytes después.', 'With `sizeof(int)` equal to 4, each element starts 4 bytes later.'),
	say('Estas direcciones son de ejemplo: las reales varían.', 'These addresses are examples: real ones vary.'),
);
const step = timed(
	say('`p = notas`: el nombre del arreglo se convierte en `&notas[0]`.', '`p = grades`: the array name turns into `&grades[0]`.'),
	say('`p + 1` no avanza un byte: avanza un elemento, `sizeof(int)` bytes.', '`p + 1` moves one element, `sizeof(int)` bytes, not one byte.'),
	say('De 0x1000 a 0x1004: el compilador multiplica por el tamaño.', 'From 0x1000 to 0x1004: the compiler multiplies by the size.'),
);
const index = timed(
	say('`notas[2]` es `*(notas + 2)`: avanzar dos elementos y leer lo que hay ahí.', '`grades[2]` is `*(grades + 2)`: move two elements and read what is there.'),
	say('Por eso los índices empiezan en 0: `notas[0]` es `*(notas + 0)`.', 'That is why indexes start at 0: `grades[0]` is `*(grades + 0)`.'),
);
const walk = timed(
	say('En cada vuelta, `suma += *p` lee un valor y `p++` avanza un elemento.', 'Each pass, `sum += *p` reads a value and `p++` moves one element.'),
	say('`notas + 5` está justo después del último: el ciclo para sin leerlo.', '`grades + 5` is just past the last one: the loop stops without reading it.'),
	say('7 + 4 + 9 + 6 + 8: el programa imprime `suma = 34`.', '7 + 4 + 9 + 6 + 8: the program prints `sum = 34`.'),
);
const call = timed(
	say('Aquí `notas` es un arreglo: `sizeof notas` vale 20 y `n`, 5.', 'Here `grades` is an array: `sizeof grades` is 20, `n` is 5.'),
	say('`promedio(notas, n)` no copia el arreglo: pasa la dirección de su primer elemento.', '`average(grades, n)` copies no array: it passes the address of its first element.'),
);
const length = timed(
	say('Dentro de `promedio`, `sizeof v` mide un puntero: por ejemplo 8 bytes.', 'Inside `average`, `sizeof v` measures a pointer: for example 8 bytes.'),
	say('No sabe cuántos elementos hay: la longitud viaja aparte, en `size_t n`.', 'It cannot know how many there are: the length travels apart, in `size_t n`.'),
	say('Con `v[i]` recorre los cinco valores e imprime `promedio = 6.80`.', 'With `v[i]` it walks the five values and prints `average = 6.80`.'),
);
const arrow = timed(
	say('`mover` recibe `&a`: un puntero a la estructura, sin copiarla.', '`move` receives `&a`: a pointer to the struct, without copying it.'),
	say('`p->x` es exactamente `(*p).x`: sigue el puntero y elige el campo.', '`p->x` is exactly `(*p).x`: follow the pointer, then pick the member.'),
	say('Con `pa = &a`, `(*pa).x = 0` equivale a `pa->x = 0`: imprime `(0, 1)`.', 'With `pa = &a`, `(*pa).x = 0` equals `pa->x = 0`: it prints `(0, 1)`.'),
);
const end = timed(
	say('¿Dónde termina el arreglo? `notas + 5` se puede calcular y comparar…', 'Where does the array end? `grades + 5` may be computed and compared…'),
	say('…pero nunca desreferenciar: `*(notas + 5)` es comportamiento indefinido.', '…but never dereferenced: `*(grades + 5)` is undefined behavior.'),
	say('Un puntero recorre el arreglo dentro de sus límites.', 'A pointer walks the array within its bounds.'),
);

// The loop of scene 3 spreads its five passes over the first caption.
const PASS = Math.floor((walk.start(1) - 400) / 5);
const sums = ['sv-0', 'sv-7', 'sv-11', 'sv-20', 'sv-26', 'sv-34'];
const passes = cells.flatMap((i): MotionCue[] => {
	const at = 300 + i * PASS;
	return [
		...run(at, 'a8', i === 0),
		{ at: at + 700, do: 'enter', el: `lit-c${i}` },
		...swap(at + 800, sums[i], sums[i + 1]),
		{ at: at + PASS - 500, do: 'move', el: 'hl', to: 'ln-7', dur: 400 },
		{ at: at + PASS - 450, do: 'move', el: 'pin-p', to: `a-c${i + 1}`, dur: 450 },
	];
});

export const script: AnimationScript = {
	chapters: [
		{ id: 'array', label: { es: 'Celdas contiguas', en: 'Contiguous cells' } },
		{ id: 'arith', label: { es: 'Aritmética de punteros', en: 'Pointer arithmetic' } },
		{ id: 'walk', label: { es: 'Recorrer con un puntero', en: 'Walking with a pointer' } },
		{ id: 'call', label: { es: 'Un arreglo como argumento', en: 'An array as an argument' } },
		{ id: 'struct', label: { es: 'El operador ->', en: 'The -> operator' } },
		{ id: 'bounds', label: { es: 'Dónde termina el arreglo', en: 'Where the array ends' } },
	],
	steps: [
		// ─── Scene 1. Contiguous cells ──────────────────────────────────────
		{
			id: 'cells',
			chapter: 'array',
			scene: 'journey',
			title: { es: 'Cinco enteros, uno pegado al otro', en: 'Five ints, one after the other' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-cells', 3000),
					Array.from({ length: 13 }, (_, i): MotionCue => ({ at: 200 + i * 150, do: 'type', el: `ea-${i + 1}`, dur: 300 })),
					{ at: 2300, do: 'enter', el: 'plate-main' },
					{ at: 2400, do: 'move', el: 'hl', to: 'ln-4', dur: 1 },
					{ at: 2500, do: 'enter', el: 'hl' },
					{ at: 2600, do: 'enter', el: 'm-a4' },
					{ at: 2600, do: 'move', el: 'px', to: 'a-ma4', dur: 1 },
					{ at: 2700, do: 'enter', el: 'px' },
					{ at: 3200, do: 'enter', el: 'on-a4' },
					reveal(3300, 200, ...cells.map((i) => `c-${i}`)),
					{ at: build.start(1) + 300, do: 'draw', el: 'rule', dur: 900 },
					{ at: build.start(1) + 1100, do: 'enter', el: 'ch-4b' },
					{ at: build.start(1) + 1500, do: 'enter', el: 'ch-sz' },
					{ at: build.start(1) + 2100, do: 'pulse', el: 'c-1' },
					run(build.start(2) + 200, 'a5'),
					{ at: build.start(2) + 900, do: 'enter', el: 'v-suma' },
					{ at: build.start(2) + 1100, do: 'enter', el: 'sv-0' },
				),
			},
		},

		// ─── Scene 2. Pointer arithmetic ────────────────────────────────────
		{
			id: 'step',
			chapter: 'arith',
			scene: 'journey',
			title: { es: 'p + 1 avanza un elemento', en: 'p + 1 moves one element' },
			subtitles: step.list,
			motion: {
				cues: seq(
					run(0, 'a7'),
					{ at: 900, do: 'enter', el: 'pin-p' },
					{ at: 1500, do: 'enter', el: 'ch-decay' },
					shot(step.start(1), 'shot-start', 1800),
					{ at: step.start(1) + 300, do: 'enter', el: 'pin-p1' },
					{ at: step.start(1) + 900, do: 'move', el: 'pin-p1', to: 'a-c1', dur: 1300 },
					{ at: step.start(1) + 2300, do: 'pulse', el: 'c-1' },
					{ at: step.start(1) + 2500, do: 'enter', el: 'ch-p1' },
					{ at: step.start(2) + 200, do: 'pulse', el: 'ch-4b' },
					{ at: step.start(2) + 600, do: 'pulse', el: 'ch-sz' },
					{ at: step.start(2) + 1400, do: 'pulse', el: 'ch-p1' },
				),
			},
		},
		{
			id: 'index',
			chapter: 'arith',
			scene: 'journey',
			title: { es: 'notas[i] es *(notas + i)', en: 'grades[i] is *(grades + i)' },
			subtitles: index.list,
			motion: {
				cues: seq(
					clear(0, 'pin-p1', 'ch-p1', 'ch-decay'),
					{ at: 400, do: 'enter', el: 'pin-ix' },
					{ at: 1000, do: 'move', el: 'pin-ix', to: 'a-c2', dur: 1500 },
					{ at: 2600, do: 'enter', el: 'lit-c2' },
					{ at: 2800, do: 'enter', el: 'ch-ix' },
					{ at: 3400, do: 'pulse', el: 'c-2' },
					clear(index.start(1), 'pin-ix', 'lit-c2', 'ch-ix'),
					{ at: index.start(1) + 400, do: 'enter', el: 'lit-c0' },
					{ at: index.start(1) + 500, do: 'pulse', el: 'pin-p' },
					{ at: index.start(1) + 700, do: 'enter', el: 'ch-zero' },
				),
			},
		},

		// ─── Scene 3. Walking the array ─────────────────────────────────────
		{
			id: 'walk',
			chapter: 'walk',
			scene: 'journey',
			title: { es: 'Un ciclo que mueve el puntero', en: 'A loop that moves the pointer' },
			subtitles: walk.list,
			motion: {
				cues: seq(
					clear(0, 'ch-zero', 'lit-c0', 'ch-sz', 'ch-4b', 'rule'),
					shot(0, 'shot-walk', 1800),
					passes,
					{ at: walk.start(1) - 300, do: 'enter', el: 'ghost' },
					{ at: walk.start(1) + 400, do: 'enter', el: 'ch-past' },
					{ at: walk.start(1) + 900, do: 'draw', el: 'fl-walk', dur: 1400 },
					{ at: walk.start(1) + 2400, do: 'pulse', el: 'pin-p' },
					run(walk.start(2), 'a10'),
					{ at: walk.start(2) + 800, do: 'type', el: 'oa-1', dur: 600 },
					{ at: walk.start(2) + 1500, do: 'pulse', el: 'v-suma' },
				),
			},
		},

		// ─── Scene 4. An array as an argument ───────────────────────────────
		{
			id: 'call',
			chapter: 'call',
			scene: 'journey',
			title: { es: 'Lo que recibe la función', en: 'What the function receives' },
			subtitles: call.list,
			motion: {
				cues: seq(
					clear(
						0,
						'ea',
						'oa-1',
						'pin-p',
						'ghost',
						'ch-past',
						'fl-walk',
						'v-suma',
						'sv-34',
						...cells.map((i) => `lit-c${i}`),
						...modulesOf(rowA),
					),
					shot(0, 'shot-fn', 2400),
					{ at: 500, do: 'enter', el: 'eb' },
					run(700, 'b13'),
					{ at: 1500, do: 'pulse', el: 'c-2' },
					run(2000, 'b14'),
					{ at: 2700, do: 'enter', el: 'ch-szn' },
					{ at: 3300, do: 'enter', el: 'v-n' },
					run(call.start(1), 'b16'),
					{ at: call.start(1) + 900, do: 'enter', el: 'fn-prom' },
					run(call.start(1) + 1300, 'b4'),
					{ at: call.start(1) + 2000, do: 'enter', el: 'v-v' },
					{ at: call.start(1) + 2200, do: 'enter', el: 'v-n2' },
					{ at: call.start(1) + 2700, do: 'draw', el: 'ar-v', dur: 1100 },
					{ at: call.start(1) + 4000, do: 'enter', el: 'ch-recv' },
					{ at: call.start(1) + 4400, do: 'pulse', el: 'v-v' },
					{ at: call.start(1) + 5000, do: 'pulse', el: 'c-0' },
				),
			},
		},
		{
			id: 'length',
			chapter: 'call',
			scene: 'journey',
			title: { es: 'La longitud viaja aparte', en: 'The length travels apart' },
			subtitles: length.list,
			motion: {
				cues: seq(
					{ at: 300, do: 'pulse', el: 'v-v' },
					{ at: 700, do: 'enter', el: 'ch-szv' },
					{ at: 1500, do: 'pulse', el: 'ch-szn' },
					clear(length.start(1), 'ch-szn'),
					{ at: length.start(1) + 400, do: 'enter', el: 'on-n2' },
					{ at: length.start(1) + 700, do: 'enter', el: 'ch-len' },
					{ at: length.start(1) + 1500, do: 'pulse', el: 'v-n' },
					run(length.start(2), 'b7'),
					reveal(length.start(2) + 700, 220, ...cells.map((i) => `lit-c${i}`)),
					run(length.start(2) + 2000, 'b9'),
					run(length.start(2) + 2900, 'b16', false),
					{ at: length.start(2) + 3400, do: 'type', el: 'ob-1', dur: 700 },
				),
			},
		},

		// ─── Scene 5. The -> operator ───────────────────────────────────────
		{
			id: 'arrow',
			chapter: 'struct',
			scene: 'journey',
			title: { es: 'p->x es (*p).x', en: 'p->x is (*p).x' },
			subtitles: arrow.list,
			motion: {
				cues: seq(
					clear(
						0,
						'eb',
						'ob-1',
						'fn-prom',
						'v-v',
						'v-n2',
						'on-n2',
						'ar-v',
						'ch-szv',
						'ch-len',
						'ch-recv',
						'v-n',
						...cells.flatMap((i) => [`c-${i}`, `lit-c${i}`]),
						...modulesOf(rowB),
					),
					shot(0, 'shot-struct', 2400),
					{ at: 500, do: 'enter', el: 'ec' },
					run(800, 'c18'),
					{ at: 1300, do: 'enter', el: 'st-a' },
					reveal(1600, 200, 'sx-1', 'sy-2'),
					run(2400, 'c19'),
					{ at: 3000, do: 'enter', el: 'fn-mov' },
					{ at: 3300, do: 'enter', el: 'v-mp' },
					{ at: 3600, do: 'draw', el: 'ar-mp', dur: 900 },
					run(arrow.start(1), 'c9'),
					{ at: arrow.start(1) + 700, do: 'enter', el: 'ch-arrow' },
					{ at: arrow.start(1) + 900, do: 'enter', el: 'on-sx' },
					swap(arrow.start(1) + 1100, 'sx-1', 'sx-4'),
					run(arrow.start(1) + 1900, 'c10'),
					swap(arrow.start(1) + 2500, 'sy-2', 'sy-1'),
					clear(arrow.start(1) + 3300, 'fn-mov', 'v-mp', 'ar-mp'),
					run(arrow.start(1) + 3500, 'c20'),
					{ at: arrow.start(1) + 4000, do: 'type', el: 'oc-1', dur: 500 },
					run(arrow.start(2), 'c21'),
					{ at: arrow.start(2) + 600, do: 'enter', el: 'pin-pa' },
					run(arrow.start(2) + 1300, 'c22'),
					swap(arrow.start(2) + 1900, 'sx-4', 'sx-0'),
					{ at: arrow.start(2) + 2100, do: 'pulse', el: 'pin-pa' },
					run(arrow.start(2) + 2900, 'c23'),
					{ at: arrow.start(2) + 3400, do: 'type', el: 'oc-2', dur: 500 },
				),
			},
		},

		// ─── Scene 6. Where the array ends ──────────────────────────────────
		{
			id: 'bounds',
			chapter: 'bounds',
			scene: 'journey',
			title: { es: 'Una posición después del final', en: 'One past the end' },
			subtitles: end.list,
			motion: {
				cues: seq(
					clear(0, 'ec', 'oc-1', 'oc-2', 'st-a', 'sx-0', 'sy-1', 'on-sx', 'pin-pa', 'ch-arrow', ...modulesOf(rowC)),
					shot(0, 'shot-end', 2600),
					{ at: 500, do: 'enter', el: 'ea' },
					reveal(700, 150, ...cells.map((i) => `c-${i}`)),
					reveal(800, 120, ...rowA.map((id) => `m-${id}`)),
					{ at: 1300, do: 'move', el: 'pin-p', to: 'a-c5', dur: 1 },
					{ at: 1400, do: 'enter', el: 'ghost' },
					run(1500, 'a7', false),
					{ at: 1800, do: 'enter', el: 'pin-p' },
					{ at: 2500, do: 'enter', el: 'ch-end' },
					{ at: end.start(1) + 200, do: 'enter', el: 'ghost-x' },
					{ at: end.start(1) + 700, do: 'enter', el: 'ch-ub' },
					{ at: end.start(1) + 1500, do: 'pulse', el: 'ghost-x' },
					// The camera pulls back to reveal the whole row and the path the pointer took.
					{ at: end.start(2), do: 'camera', to: ['shot-all'], dur: 3200, pad: 0 },
					{ at: end.start(2) + 300, do: 'enter', el: 'fl-walk' },
					{ at: end.start(2) + 500, do: 'flow', el: 'fl-walk' },
					{ at: end.start(2) + 2400, do: 'pulse', el: 'pin-p' },
				),
			},
		},
	],
};
