import type { AnimationScript, MotionCue, Subtitle } from './types';

// "An address that points": a short film (about two minutes) for the C lesson
// "Punteros y direcciones de memoria". It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/punteros-direcciones-c.astro`):
// the program on the left, and on the right memory as a row of numbered cells, each
// with its value on top and the address of its first byte on the front edge. A pointer
// is always an arrow from the cell that stores an address to the object that lives
// there; values and addresses on their way are chips. Light blue is the execution flow
// and the values it carries, violet is a pointer and what it reaches, magenta is the
// null pointer and the invalid dereference. Addresses are illustrative.

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
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 450 }));

/**
 * Runs the instruction on editor line `line`: slides the bar to it, builds its module,
 * sends the execution particle there and lights the module.
 */
const run = (at: number, line: number): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
	{ at: at + 100, do: 'enter', el: `m-${line}` },
	{ at: at + 100, do: 'move', el: 'fx', to: `a-m${line}`, dur: 700 },
	{ at: at + 700, do: 'enter', el: `on-${line}` },
];

/** Carries a chip from where it rests to an anchor, then lets it vanish into what it changes. */
const carry = (at: number, el: string, to: string, dur: number): MotionCue[] => [
	{ at, do: 'enter', el },
	{ at: at + 200, do: 'move', el, to, dur },
	{ at: at + 200 + dur, do: 'exit', el, dur: 300 },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const cells = timed(
	say(
		'La memoria es una fila de celdas numeradas. El número de cada celda es su dirección.',
		"Memory is a row of numbered cells. Each cell's number is its address.",
	),
	say('`int x = 10;` reserva 4 bytes para `x` y guarda en ellos el valor 10.', '`int x = 10;` reserves 4 bytes for `x` and stores the value 10 in them.'),
	say(
		'La dirección de `x` es la de su primer byte: 0x1000. Valor y dirección son cosas distintas.',
		'The address of `x` is that of its first byte: 0x1000. Value and address are different things.',
	),
);
const address = timed(
	say('El operador `&` da la dirección de un objeto: `&x` vale 0x1000.', 'The `&` operator gives the address of an object: `&x` is 0x1000.'),
	say(
		'`%p` la imprime. Las direcciones reales son otras y cambian en cada ejecución.',
		'`%p` prints it. Real addresses look different and change on every run.',
	),
);
const pointer = timed(
	say(
		'`int *p = &x;` crea otra celda, `p`, en 0x2000. Su valor es una dirección: 0x1000.',
		'`int *p = &x;` creates another cell, `p`, at 0x2000. Its value is an address: 0x1000.',
	),
	say(
		'Un puntero guarda la dirección de otro objeto. Lo dibujamos como una flecha: `p` apunta a `x`.',
		'A pointer stores the address of another object. We draw it as an arrow: `p` points to `x`.',
	),
);
const reading = timed(
	say('`*p` sigue la flecha hasta el objeto apuntado: eso es desreferenciar.', '`*p` follows the arrow to the object it points to: that is dereferencing.'),
	say('Al leer, `*p` da el valor de `x`. Se imprime x = 10, *p = 10.', 'When reading, `*p` gives the value of `x`. It prints x = 10, *p = 10.'),
);
const writing = timed(
	say('`*p = 20;` escribe a través de la flecha: el 20 se guarda en `x`.', '`*p = 20;` writes through the arrow: the 20 is stored in `x`.'),
	say('`x` cambió sin usar su nombre. `p` no cambió: sigue valiendo 0x1000.', '`x` changed without using its name. `p` did not change: it is still 0x1000.'),
);
const call = timed(
	say(
		'`int y = 3;` ocupa la celda siguiente, 0x1004. Luego `main` llama a `intercambiar(&x, &y)`.',
		'`int y = 3;` takes the next cell, 0x1004. Then `main` calls `swap(&x, &y)`.',
	),
	say('Se evalúan `&x` y `&y`, y esas dos direcciones se copian en `a` y `b`.', '`&x` and `&y` are evaluated, and those two addresses are copied into `a` and `b`.'),
	say('Es pasaje por valor, como siempre: lo que se copia es una dirección.', 'It is pass by value, as always: what gets copied is an address.'),
);
const swapping = timed(
	say('`aux = *a` lee el 20 de `x`. `*a = *b` copia el 3 de `y` en `x`.', '`tmp = *a` reads the 20 in `x`. `*a = *b` copies the 3 in `y` into `x`.'),
	say(
		'`*b = aux` deja el 20 en `y`. La función cambió las variables de quien llama.',
		"`*b = tmp` leaves the 20 in `y`. The function changed its caller's variables.",
	),
	say('Al volver, `a` y `b` desaparecen. Se imprime x = 3, y = 20.', 'On return, `a` and `b` are gone. It prints x = 3, y = 20.'),
);
const nothing = timed(
	say('`p = NULL;` El puntero nulo no apunta a nada: una flecha hacia ningún lugar.', '`p = NULL;` The null pointer points to nothing: an arrow to nowhere.'),
	say(
		'`NULL` se compara, nunca se desreferencia: `*p` ahora sería comportamiento indefinido.',
		'`NULL` is compared, never dereferenced: `*p` would now be undefined behavior.',
	),
	say(
		'Una dirección dice dónde vive un objeto; un puntero la guarda y `*` llega hasta él.',
		'An address says where an object lives; a pointer stores it, and `*` reaches the object.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'memory', label: { es: 'Celdas numeradas', en: 'Numbered cells' } },
		{ id: 'address', label: { es: 'El operador &', en: 'The & operator' } },
		{ id: 'pointer', label: { es: 'Un puntero guarda una dirección', en: 'A pointer stores an address' } },
		{ id: 'deref', label: { es: 'Leer y escribir con *', en: 'Reading and writing with *' } },
		{ id: 'swap', label: { es: 'intercambiar recibe direcciones', en: 'swap receives addresses' } },
		{ id: 'null', label: { es: 'NULL no apunta a nada', en: 'NULL points to nothing' } },
	],
	steps: [
		// ─── Scene 1. Numbered cells ────────────────────────────────────────
		{
			id: 'cells',
			chapter: 'memory',
			scene: 'journey',
			title: { es: 'La memoria como una fila de celdas', en: 'Memory as a row of cells' },
			subtitles: cells.list,
			motion: {
				cues: seq(
					shot(0, 'shot-mem', 3000),
					{ at: 200, do: 'enter', el: 'plate-main' },
					{ at: 500, do: 'enter', el: 'c-ffc' },
					{ at: 700, do: 'enter', el: 'c-x' },
					{ at: 900, do: 'enter', el: 'c-y' },
					{ at: 1100, do: 'enter', el: 'c-1008' },
					{ at: 1250, do: 'enter', el: 'dots' },
					{ at: 1400, do: 'enter', el: 'c-p' },
					{ at: 1600, do: 'enter', el: 'c-2008' },
					{ at: 2600, do: 'enter', el: 'lb-addr' },
					{ at: 3200, do: 'pulse', el: 'c-x' },
					{ at: cells.start(1), do: 'enter', el: 'hl' },
					{ at: cells.start(1), do: 'enter', el: 'fx' },
					run(cells.start(1) + 200, 10),
					{ at: cells.start(1) + 1000, do: 'enter', el: 'n-x' },
					{ at: cells.start(1) + 1300, do: 'enter', el: 'v-x-10' },
					{ at: cells.start(1) + 1300, do: 'enter', el: 'lit-x' },
					{ at: cells.start(1) + 2000, do: 'enter', el: 'lb-val' },
					shot(cells.start(2), 'shot-x', 1800),
					{ at: cells.start(2) + 600, do: 'enter', el: 'ad-x' },
					{ at: cells.start(2) + 1600, do: 'pulse', el: 'ad-x' },
					{ at: cells.start(2) + 2800, do: 'pulse', el: 'v-x-10' },
				),
			},
		},

		// ─── Scene 2. The & operator ────────────────────────────────────────
		{
			id: 'address',
			chapter: 'address',
			scene: 'journey',
			title: { es: '&x: la dirección de x', en: '&x: the address of x' },
			subtitles: address.list,
			motion: {
				cues: seq(
					clear(0, 'lb-val', 'lb-addr', 'lit-x'),
					run(200, 11),
					{ at: 900, do: 'enter', el: 'cp-x' },
					{ at: 1100, do: 'pulse', el: 'ad-x' },
					{ at: 1100, do: 'move', el: 'cp-x', to: 'a-above-x', dur: 900 },
					{ at: 1700, do: 'type', el: 'o-1', dur: 700 },
					{ at: 2400, do: 'pulse', el: 'cp-x' },
					{ at: address.start(1) + 300, do: 'pulse', el: 'o-1' },
					{ at: address.start(1) + 1500, do: 'pulse', el: 'cp-x' },
					{ at: address.start(1) + 2600, do: 'pulse', el: 'ad-x' },
				),
			},
		},

		// ─── Scene 3. A pointer stores an address ───────────────────────────
		{
			id: 'pointer',
			chapter: 'pointer',
			scene: 'journey',
			title: { es: 'int *p = &x;', en: 'int *p = &x;' },
			subtitles: pointer.list,
			motion: {
				cues: seq(
					shot(0, 'shot-ptr', 2200),
					run(200, 12),
					{ at: 900, do: 'enter', el: 'n-p' },
					{ at: 900, do: 'enter', el: 'lit-p' },
					{ at: 1100, do: 'move', el: 'cp-x', to: 'a-top-p', dur: 1400 },
					{ at: 2600, do: 'exit', el: 'cp-x', dur: 300 },
					{ at: 2600, do: 'exit', el: 'ad-x', dur: 400 },
					{ at: 2700, do: 'enter', el: 'v-p-1000' },
					{ at: pointer.start(1) + 200, do: 'draw', el: 'ar-p', dur: 1400 },
					{ at: pointer.start(1) + 1600, do: 'enter', el: 'lit-x' },
					{ at: pointer.start(1) + 1800, do: 'enter', el: 'lb-ptr' },
					{ at: pointer.start(1) + 2600, do: 'pulse', el: 'ar-p' },
				),
			},
		},

		// ─── Scene 4. Reading and writing with * ────────────────────────────
		{
			id: 'read',
			chapter: 'deref',
			scene: 'journey',
			title: { es: 'Leer a través del puntero', en: 'Reading through the pointer' },
			subtitles: reading.list,
			motion: {
				cues: seq(
					clear(0, 'lb-ptr'),
					run(100, 13),
					{ at: 900, do: 'enter', el: 'pr' },
					{ at: 1100, do: 'pulse', el: 'ar-p' },
					{ at: 1100, do: 'move', el: 'pr', to: 'a-top-x', dur: 1500 },
					{ at: 2600, do: 'pulse', el: 'lit-x' },
					{ at: 2600, do: 'pulse', el: 'v-x-10' },
					{ at: reading.start(1), do: 'exit', el: 'pr', dur: 300 },
					{ at: reading.start(1) + 100, do: 'enter', el: 'rd' },
					{ at: reading.start(1) + 400, do: 'move', el: 'rd', to: 'a-m13', dur: 1100 },
					{ at: reading.start(1) + 1500, do: 'type', el: 'o-2', dur: 800 },
					{ at: reading.start(1) + 1700, do: 'exit', el: 'rd', dur: 300 },
				),
			},
		},
		{
			id: 'write',
			chapter: 'deref',
			scene: 'journey',
			title: { es: 'Escribir a través del puntero', en: 'Writing through the pointer' },
			subtitles: writing.list,
			motion: {
				cues: seq(
					run(100, 14),
					{ at: 800, do: 'enter', el: 'wr' },
					{ at: 1000, do: 'move', el: 'wr', to: 'a-top-p', dur: 1100 },
					{ at: 2200, do: 'pulse', el: 'ar-p' },
					{ at: 2200, do: 'move', el: 'wr', to: 'a-top-x', dur: 1200 },
					{ at: 3400, do: 'exit', el: 'wr', dur: 300 },
					{ at: 3400, do: 'exit', el: 'v-x-10', dur: 300 },
					{ at: 3500, do: 'enter', el: 'v-x-20' },
					{ at: 3600, do: 'pulse', el: 'lit-x' },
					{ at: writing.start(1) + 200, do: 'pulse', el: 'v-x-20' },
					{ at: writing.start(1) + 1200, do: 'enter', el: 'lb-same' },
					{ at: writing.start(1) + 1800, do: 'pulse', el: 'v-p-1000' },
					{ at: writing.start(1) + 1800, do: 'pulse', el: 'lit-p' },
				),
			},
		},

		// ─── Scene 5. swap receives addresses ───────────────────────────────
		{
			id: 'call',
			chapter: 'swap',
			scene: 'journey',
			title: { es: 'intercambiar(&x, &y)', en: 'swap(&x, &y)' },
			subtitles: call.list,
			motion: {
				cues: seq(
					clear(0, 'lb-same', 'lit-p'),
					run(200, 15),
					{ at: 900, do: 'enter', el: 'n-y' },
					{ at: 1100, do: 'enter', el: 'v-y-3' },
					{ at: 1100, do: 'enter', el: 'lit-y' },
					shot(call.start(1), 'shot-call', 2000),
					run(call.start(1) + 100, 16),
					{ at: call.start(1) + 500, do: 'enter', el: 'plate-fn' },
					{ at: call.start(1) + 700, do: 'enter', el: 'c-a' },
					{ at: call.start(1) + 850, do: 'enter', el: 'c-b' },
					{ at: call.start(1) + 1000, do: 'enter', el: 'c-aux' },
					{ at: call.start(1) + 1100, do: 'enter', el: 'n-a' },
					{ at: call.start(1) + 1200, do: 'enter', el: 'n-b' },
					{ at: call.start(1) + 1300, do: 'enter', el: 'n-aux' },
					carry(call.start(1) + 1500, 'cp-a', 'a-top-a', 1200),
					carry(call.start(1) + 1600, 'cp-b', 'a-top-b', 1200),
					{ at: call.start(1) + 3000, do: 'enter', el: 'v-a' },
					{ at: call.start(1) + 3100, do: 'enter', el: 'v-b' },
					{ at: call.start(1) + 3400, do: 'move', el: 'hl', to: 'ln-3', dur: 500 },
					{ at: call.start(1) + 3400, do: 'draw', el: 'ar-a', dur: 1000 },
					{ at: call.start(1) + 3500, do: 'draw', el: 'ar-b', dur: 1000 },
					{ at: call.start(2) + 200, do: 'enter', el: 'lb-copy' },
					{ at: call.start(2) + 900, do: 'pulse', el: 'v-a' },
					{ at: call.start(2) + 1100, do: 'pulse', el: 'v-b' },
					{ at: call.start(2) + 2200, do: 'pulse', el: 'lb-copy' },
				),
			},
		},
		{
			id: 'swap',
			chapter: 'swap',
			scene: 'journey',
			title: { es: 'Las variables de main se intercambian', en: "main's variables are swapped" },
			subtitles: swapping.list,
			motion: {
				cues: seq(
					clear(0, 'lb-copy', 'lit-x', 'lit-y'),
					run(200, 4),
					carry(900, 'k1', 'a-top-aux', 1300),
					{ at: 2400, do: 'enter', el: 'v-aux' },
					run(2900, 5),
					carry(3500, 'k2', 'a-top-x', 1100),
					{ at: 4800, do: 'exit', el: 'v-x-20', dur: 300 },
					{ at: 4900, do: 'enter', el: 'v-x-3' },
					{ at: 5000, do: 'enter', el: 'lit-x' },
					run(swapping.start(1) + 100, 6),
					carry(swapping.start(1) + 700, 'k3', 'a-top-y', 1400),
					{ at: swapping.start(1) + 2300, do: 'exit', el: 'v-y-3', dur: 300 },
					{ at: swapping.start(1) + 2400, do: 'enter', el: 'v-y-20' },
					{ at: swapping.start(1) + 2500, do: 'enter', el: 'lit-y' },
					shot(swapping.start(2) + 200, 'shot-ptr', 2000),
					clear(
						swapping.start(2),
						'ar-a',
						'ar-b',
						'v-a',
						'v-b',
						'v-aux',
						'n-a',
						'n-b',
						'n-aux',
						'c-a',
						'c-b',
						'c-aux',
						'plate-fn',
						'm-4',
						'm-5',
						'm-6',
						'on-4',
						'on-5',
						'on-6',
					),
					run(swapping.start(2) + 600, 17),
					{ at: swapping.start(2) + 1300, do: 'type', el: 'o-3', dur: 800 },
				),
			},
		},

		// ─── Scene 6. NULL points to nothing ────────────────────────────────
		{
			id: 'null',
			chapter: 'null',
			scene: 'journey',
			title: { es: 'Una flecha hacia ningún lugar', en: 'An arrow to nowhere' },
			subtitles: nothing.list,
			motion: {
				cues: seq(
					shot(0, 'shot-null', 2000),
					run(200, 18),
					clear(900, 'ar-p', 'lit-x', 'lit-y'),
					{ at: 1000, do: 'exit', el: 'v-p-1000', dur: 300 },
					{ at: 1200, do: 'enter', el: 'v-p-null' },
					{ at: 1200, do: 'enter', el: 'lit-pn' },
					{ at: 1400, do: 'enter', el: 'void' },
					{ at: 1700, do: 'draw', el: 'ar-null', dur: 1100 },
					{ at: 2600, do: 'enter', el: 'lb-void' },
					{ at: nothing.start(1) + 100, do: 'enter', el: 'mark-18' },
					carry(nothing.start(1) + 300, 'pn', 'a-void', 1300),
					{ at: nothing.start(1) + 1800, do: 'enter', el: 'bad' },
					{ at: nothing.start(1) + 1900, do: 'enter', el: 'lb-ub' },
					{ at: nothing.start(1) + 2600, do: 'pulse', el: 'bad' },
					// The camera pulls back to reveal the whole memory and the program's end.
					run(nothing.start(2) + 100, 19),
					{ at: nothing.start(2) + 300, do: 'camera', to: 'all', dur: 3200 },
					{ at: nothing.start(2) + 600, do: 'flow', el: 'ar-null' },
					{ at: nothing.start(2) + 2200, do: 'pulse', el: 'c-x' },
					{ at: nothing.start(2) + 2800, do: 'pulse', el: 'c-p' },
				),
			},
		},
	],
};
