import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Who frees this block": a short film (about two minutes) for the C lesson
// "Propiedad de la memoria y errores frecuentes" (propiedad-y-errores-de-memoria). It
// plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/errores-memoria-c.astro`): the source code on the left,
// and on the right main's stack cell, the heap with its blocks, and one module per
// instruction in front of them. Ownership is a key: whoever holds it must free the
// block, exactly once. First the lesson's `crear_persona` / `imprimir_persona` /
// `destruir_persona` program shows the key being handed to the caller, a borrow
// without the key and the owner releasing the block. Then the lesson's `puntaje`
// program, in three versions, breaks the rule on the same block: a leak, a double free
// and a use after free, which AddressSanitizer reports. Magenta marks the error; violet
// marks what resolves it (the owner's key, ASan).

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
 * Runs editor line `line` of program `prog` ('a' is the Persona program, 'b' the
 * `puntaje` one): slides the bar to it, sends the execution particle to its module
 * and lights that module.
 */
const run = (at: number, prog: 'a' | 'b', line: number, lit = 700): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
	{ at: at + 100, do: 'move', el: 'p', to: `a-m${prog}${line}`, dur: 700 },
	{ at: at + lit, do: 'enter', el: `on-${prog}${line}` },
];

/** Types the rows of one console block, one after the other. */
const output = (at: number, prefix: string, rows: number, gap = 260, first = 1): MotionCue[] =>
	Array.from({ length: rows }, (_, index) => ({
		at: at + index * gap,
		do: 'type' as const,
		el: `${prefix}${first + index}`,
		dur: Math.max(250, gap),
	}));

const modulesA = ['m-a9', 'm-a10', 'm-a13', 'm-a14', 'm-a15', 'm-a16'];
const modulesB = ['m-b5', 'm-b6', 'm-b9', 'm-b10', 'm-b11', 'm-b12'];
const enterAll = (at: number, gap: number, els: string[]): MotionCue[] =>
	els.map((el, index) => ({ at: at + index * gap, do: 'enter' as const, el }));

// ─── Captions ───────────────────────────────────────────────────────────────
const create = timed(
	say(
		'`crear_persona` reserva la persona y su nombre con `malloc`.',
		'`create_person` allocates the person and its name with `malloc`.',
	),
	say(
		'La llave es la propiedad: el dueño debe liberar el bloque una sola vez.',
		'The key is ownership: the owner must free the block exactly once.',
	),
	say(
		'Al volver, la llave se transfiere a `ana`: el llamador es dueño del resultado.',
		'On return, the key is transferred to `ann`: the caller owns the result.',
	),
);
const borrow = timed(
	say(
		'`imprimir_persona` recibe la dirección, no la llave: toma prestado y no libera.',
		'`print_person` gets the address, not the key: it borrows and never frees.',
	),
);
const destroy = timed(
	say(
		'`main` es la dueña, así que libera: llama a `destruir_persona`.',
		'`main` is the owner, so it frees: it calls `destroy_person`.',
	),
	say(
		'Primero libera el nombre, después la persona. La llave se va con el bloque.',
		'It frees the name first, then the person. The key leaves with the block.',
	),
);
const leak = timed(
	say(
		'Ahora un bloque con un `int`: `puntaje` es su dueño y guarda `100`.',
		'Now a block holding one `int`: `score` owns it and stores `100`.',
	),
	say(
		'`puntaje = NULL` pisa la única dirección del bloque sin liberarlo.',
		'`score = NULL` overwrites the block\'s only address without freeing it.',
	),
	say(
		'Queda reservado y nadie puede liberarlo: cero dueños, una fuga de memoria.',
		'It stays allocated and nobody can free it: zero owners, a memory leak.',
	),
);
const double = timed(
	say(
		'Otra versión: `free(puntaje)` libera el bloque; la llave se va con él.',
		'Another version: `free(score)` frees the block; the key leaves with it.',
	),
	say(
		'El segundo `free` recibe un bloque ya liberado: es una doble liberación.',
		'The second `free` gets a block already freed: that is a double free.',
	),
	say(
		'Es comportamiento indefinido. En Linux, glibc aborta el programa.',
		'It is undefined behavior. On Linux, glibc aborts the program.',
	),
);
const uaf = timed(
	say(
		'Tercera versión: tras `free`, `puntaje` sigue apuntando al bloque.',
		'Third version: after `free`, `score` still points to the block.',
	),
	say(
		'`printf` lee `*puntaje`: uso después de liberar, con un puntero colgante.',
		'`printf` reads `*score`: a use after free, through a dangling pointer.',
	),
	say(
		'Puede imprimir `100` o basura, como este `4`: que funcione no prueba nada.',
		'It may print `100` or garbage, like this `4`: working proves nothing.',
	),
);
const asan = timed(
	say(
		'Estos errores compilan; `-fsanitize=address` los busca al ejecutar.',
		'These errors compile; `-fsanitize=address` looks for them at run time.',
	),
	say(
		'AddressSanitizer lo detiene: `heap-use-after-free`, una lectura en la línea 11.',
		'AddressSanitizer stops it: `heap-use-after-free`, a read on line 11.',
	),
	say(
		'El informe dice dónde se liberó (línea 10) y dónde se reservó (línea 5).',
		'The report says where it was freed (line 10) and allocated (line 5).',
	),
);
const rule = timed(
	say(
		'Ante una doble liberación, ASan informa `attempting double-free`.',
		'For a double free, ASan reports `attempting double-free`.',
	),
	say(
		'La regla: cada bloque tiene exactamente un dueño en cada momento.',
		'The rule: every block has exactly one owner at every moment.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'own', label: { es: 'Un dueño por bloque', en: 'One owner per block' } },
		{ id: 'free', label: { es: 'El dueño libera', en: 'The owner frees' } },
		{ id: 'leak', label: { es: 'Fuga de memoria', en: 'Memory leak' } },
		{ id: 'double', label: { es: 'Doble liberación', en: 'Double free' } },
		{ id: 'uaf', label: { es: 'Uso después de liberar', en: 'Use after free' } },
		{ id: 'asan', label: { es: 'AddressSanitizer', en: 'AddressSanitizer' } },
	],
	steps: [
		// ─── Scene 1. One owner per block ───────────────────────────────────
		{
			id: 'create',
			chapter: 'own',
			scene: 'journey',
			title: { es: 'crear_persona entrega la propiedad', en: 'create_person hands over ownership' },
			subtitles: create.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 2600),
					{ at: 200, do: 'enter', el: 'z-stack' },
					{ at: 400, do: 'enter', el: 'z-heap' },
					{ at: 500, do: 'enter', el: 'hl' },
					...enterAll(500, 80, modulesA),
					{ at: 900, do: 'enter', el: 'p' },
					...run(1100, 'a', 9),
					{ at: 1900, do: 'enter', el: 'blk-p' },
					{ at: 2400, do: 'enter', el: 'blk-n' },
					{ at: 2900, do: 'draw', el: 'ptr-n', dur: 700 },
					shot(create.start(1), 'shot-heap', 2200),
					{ at: create.start(1) + 600, do: 'enter', el: 'key' },
					{ at: create.start(1) + 1800, do: 'pulse', el: 'key' },
					{ at: create.start(1) + 2800, do: 'pulse', el: 'blk-p' },
					shot(create.start(2), 'shot-all', 2200),
					{ at: create.start(2) + 300, do: 'enter', el: 'cell-a' },
					{ at: create.start(2) + 600, do: 'draw', el: 'ptr-a', dur: 1000 },
					{ at: create.start(2) + 900, do: 'move', el: 'key', to: 'a-key-own', dur: 1400 },
					{ at: create.start(2) + 2500, do: 'pulse', el: 'cell-a' },
					...clear(create.start(2) + 3000, 'on-a9'),
					...run(create.start(2) + 3200, 'a', 10),
				),
			},
		},
		{
			id: 'borrow',
			chapter: 'own',
			scene: 'journey',
			title: { es: 'imprimir_persona solo toma prestado', en: 'print_person only borrows' },
			subtitles: borrow.list,
			motion: {
				cues: seq(
					...clear(0, 'on-a10'),
					...run(200, 'a', 13),
					{ at: 1000, do: 'draw', el: 'ptr-borrow', dur: 1000 },
					{ at: 1600, do: 'enter', el: 'lb-borrow' },
					{ at: 2100, do: 'flow', el: 'ptr-borrow' },
					{ at: 2700, do: 'pulse', el: 'key' },
					{ at: 3300, do: 'pulse', el: 'blk-p' },
					{ at: 3600, do: 'pulse', el: 'blk-n' },
					...output(3900, 'oa-', 1, 700),
					{ at: 5000, do: 'pulse', el: 'key' },
				),
			},
		},

		// ─── Scene 2. The owner frees ───────────────────────────────────────
		{
			id: 'destroy',
			chapter: 'free',
			scene: 'journey',
			title: { es: 'El dueño libera con destruir_persona', en: 'The owner frees with destroy_person' },
			subtitles: destroy.list,
			motion: {
				cues: seq(
					...clear(0, 'on-a13', 'ptr-borrow', 'lb-borrow'),
					...run(200, 'a', 14),
					{ at: 1400, do: 'pulse', el: 'key' },
					shot(destroy.start(1), 'shot-heap', 2000),
					{ at: destroy.start(1) + 400, do: 'move', el: 'key', to: 'a-key-blk', dur: 1300 },
					{ at: destroy.start(1) + 1500, do: 'exit', el: 'ptr-n', dur: 400 },
					{ at: destroy.start(1) + 1700, do: 'enter', el: 'free-n' },
					{ at: destroy.start(1) + 2500, do: 'exit', el: 'key', dur: 500 },
					{ at: destroy.start(1) + 2600, do: 'enter', el: 'free-p' },
					shot((destroy.start(1) + 3600), 'shot-all', 2000),
					...clear((destroy.start(1) + 3600), 'on-a14'),
					...run((destroy.start(1) + 3600) + 200, 'a', 15),
					{ at: (destroy.start(1) + 3600) + 900, do: 'exit', el: 'ptr-a', dur: 400 },
					{ at: (destroy.start(1) + 3600) + 1000, do: 'exit', el: 'val-a', dur: 300 },
					{ at: (destroy.start(1) + 3600) + 1300, do: 'enter', el: 'val-a-null' },
					...clear((destroy.start(1) + 3600) + 2300, 'on-a15'),
					...run((destroy.start(1) + 3600) + 2500, 'a', 16),
				),
			},
		},

		// ─── Scene 3. Memory leak ───────────────────────────────────────────
		{
			id: 'leak',
			chapter: 'leak',
			scene: 'journey',
			title: { es: 'Fuga: se pierde la única dirección', en: 'Leak: the only address is lost' },
			subtitles: leak.list,
			motion: {
				cues: seq(
					...clear(0, 'on-a16', 'code-a', 'file-a', 'out-a', 'free-p', 'free-n', 'blk-p', 'blk-n', 'cell-a', 'val-a-null', ...modulesA),
					{ at: 400, do: 'enter', el: 'code-b' },
					{ at: 400, do: 'enter', el: 'file-b' },
					{ at: 600, do: 'type', el: 'b10-print', dur: 600 },
					{ at: 700, do: 'type', el: 'b11-leak', dur: 700 },
					...enterAll(500, 80, modulesB),
					{ at: 800, do: 'move', el: 'key', to: 'a-key-own', dur: 100 },
					...run(1000, 'b', 5),
					{ at: 1700, do: 'enter', el: 'blk-b' },
					{ at: 2100, do: 'enter', el: 'cell-b' },
					{ at: 2300, do: 'draw', el: 'ptr-b', dur: 800 },
					{ at: 2700, do: 'enter', el: 'key' },
					...clear(3000, 'on-b5'),
					...run(3100, 'b', 9),
					{ at: 3700, do: 'exit', el: 'val-q', dur: 300 },
					{ at: 3900, do: 'enter', el: 'val-100' },
					...clear(4200, 'on-b9'),
					...run(4300, 'b', 10),
					...output(4900, 'ol-', 1, 500),
					...clear(leak.start(1), 'on-b10'),
					...run(leak.start(1) + 100, 'b', 11),
					{ at: leak.start(1) + 600, do: 'enter', el: 'err-11' },
					{ at: leak.start(1) + 900, do: 'exit', el: 'val-b', dur: 300 },
					{ at: leak.start(1) + 1200, do: 'enter', el: 'val-b-null' },
					{ at: leak.start(1) + 1500, do: 'exit', el: 'ptr-b', dur: 500 },
					shot(leak.start(2), 'shot-heap', 2000),
					{ at: leak.start(2) + 300, do: 'exit', el: 'key', dur: 700 },
					{ at: leak.start(2) + 900, do: 'enter', el: 'leak-b' },
					{ at: leak.start(2) + 1300, do: 'enter', el: 'lb-leak' },
					{ at: leak.start(2) + 2300, do: 'pulse', el: 'blk-b' },
				),
			},
		},

		// ─── Scene 4. Double free ───────────────────────────────────────────
		{
			id: 'double',
			chapter: 'double',
			scene: 'journey',
			title: { es: 'Doble liberación: free dos veces', en: 'Double free: free twice' },
			subtitles: double.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 2000),
					...clear(0, 'on-b11', 'err-11', 'leak-b', 'lb-leak', 'out-leak', 'b10-print', 'b11-leak', 'val-b-null'),
					{ at: 500, do: 'type', el: 'b10-free', dur: 500 },
					{ at: 600, do: 'type', el: 'b11-dfree', dur: 600 },
					{ at: 700, do: 'enter', el: 'val-b' },
					{ at: 800, do: 'draw', el: 'ptr-b', dur: 600 },
					{ at: 1000, do: 'enter', el: 'key' },
					...run(1400, 'b', 10),
					{ at: 2200, do: 'move', el: 'key', to: 'a-key-blk', dur: 1000 },
					{ at: 3300, do: 'exit', el: 'key', dur: 500 },
					{ at: 3400, do: 'enter', el: 'free-b' },
					...clear(double.start(1), 'on-b10'),
					...run(double.start(1) + 100, 'b', 11),
					{ at: double.start(1) + 600, do: 'enter', el: 'err-11' },
					{ at: double.start(1) + 900, do: 'enter', el: 'hit-b' },
					{ at: double.start(1) + 1300, do: 'enter', el: 'lb-df' },
					{ at: double.start(1) + 2300, do: 'pulse', el: 'blk-b' },
					...output(double.start(2) + 200, 'od-', 2, 700),
					{ at: double.start(2) + 1800, do: 'pulse', el: 'lb-df' },
				),
			},
		},

		// ─── Scene 5. Use after free ────────────────────────────────────────
		{
			id: 'uaf',
			chapter: 'uaf',
			scene: 'journey',
			title: { es: 'Uso después de liberar', en: 'Use after free' },
			subtitles: uaf.list,
			motion: {
				cues: seq(
					...clear(0, 'on-b11', 'err-11', 'hit-b', 'lb-df', 'out-df', 'b11-dfree', 'free-b'),
					{ at: 500, do: 'type', el: 'b11-uaf', dur: 800 },
					{ at: 600, do: 'move', el: 'key', to: 'a-key-own', dur: 100 },
					{ at: 800, do: 'enter', el: 'key' },
					...run(1300, 'b', 10),
					{ at: 2100, do: 'move', el: 'key', to: 'a-key-blk', dur: 1000 },
					{ at: 3200, do: 'exit', el: 'key', dur: 500 },
					{ at: 3300, do: 'enter', el: 'free-b' },
					{ at: 3900, do: 'enter', el: 'ptr-bad' },
					{ at: 4400, do: 'pulse', el: 'ptr-bad' },
					...clear(uaf.start(1), 'on-b10'),
					...run(uaf.start(1) + 100, 'b', 11),
					{ at: uaf.start(1) + 600, do: 'enter', el: 'err-11' },
					{ at: uaf.start(1) + 800, do: 'draw', el: 'rd-b', dur: 900 },
					{ at: uaf.start(1) + 1700, do: 'flow', el: 'rd-b' },
					{ at: uaf.start(1) + 1800, do: 'enter', el: 'hit-b' },
					{ at: uaf.start(1) + 2100, do: 'enter', el: 'lb-uaf' },
					...output(uaf.start(2) + 300, 'ou-', 1, 500),
					{ at: uaf.start(2) + 1400, do: 'pulse', el: 'blk-b' },
				),
			},
		},

		// ─── Scene 6. AddressSanitizer ──────────────────────────────────────
		{
			id: 'asan',
			chapter: 'asan',
			scene: 'journey',
			title: { es: 'AddressSanitizer lo detecta', en: 'AddressSanitizer catches it' },
			subtitles: asan.list,
			motion: {
				cues: seq(
					...clear(0, 'out-uaf', 'lb-uaf'),
					{ at: 400, do: 'draw', el: 'asan', dur: 1400 },
					...output(600, 'os-', 2, 900),
					{ at: 2200, do: 'pulse', el: 'asan' },
					...output(asan.start(1) + 100, 'os-', 3, 350, 3),
					{ at: asan.start(1) + 300, do: 'move', el: 'hl', to: 'ln-11', dur: 400 },
					{ at: asan.start(1) + 900, do: 'enter', el: 'as-11' },
					{ at: asan.start(1) + 1600, do: 'pulse', el: 'hit-b' },
					...output(asan.start(2) + 100, 'os-', 5, 420, 6),
					{ at: asan.start(2) + 200, do: 'move', el: 'hl', to: 'ln-10', dur: 500 },
					{ at: asan.start(2) + 300, do: 'move', el: 'p', to: 'a-mb10', dur: 700 },
					{ at: asan.start(2) + 800, do: 'enter', el: 'as-10' },
					{ at: asan.start(2) + 1100, do: 'move', el: 'hl', to: 'ln-5', dur: 600 },
					{ at: asan.start(2) + 1200, do: 'move', el: 'p', to: 'a-mb5', dur: 800 },
					{ at: asan.start(2) + 1700, do: 'enter', el: 'as-5' },
					{ at: asan.start(2) + 2800, do: 'pulse', el: 'asan' },
				),
			},
		},
		{
			id: 'rule',
			chapter: 'asan',
			scene: 'journey',
			title: { es: 'Un bloque, un dueño', en: 'One block, one owner' },
			subtitles: rule.list,
			motion: {
				cues: seq(
					{ at: 300, do: 'enter', el: 'as-df' },
					{ at: 1400, do: 'pulse', el: 'as-df' },
					shot(rule.start(1), 'shot-wide', 3000),
					...clear(rule.start(1), 'as-5', 'as-10', 'as-11', 'as-df'),
					{ at: rule.start(1) + 600, do: 'enter', el: 'r-own' },
					{ at: rule.start(1) + 1400, do: 'enter', el: 'r-zero' },
					{ at: rule.start(1) + 2200, do: 'enter', el: 'r-two' },
					{ at: rule.start(1) + 3000, do: 'pulse', el: 'r-zero' },
					{ at: rule.start(1) + 3700, do: 'pulse', el: 'r-two' },
					{ at: rule.start(1) + 4400, do: 'pulse', el: 'r-own' },
				),
			},
		},
	],
};
