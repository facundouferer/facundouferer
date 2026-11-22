import type { AnimationScript, MotionCue, Subtitle } from './types';

// "From the program to disk and back": a short film (about two minutes) for the C lesson
// "Archivos". It plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/archivos-persistencia-c.astro`): the program's memory on
// the left of the system and a file on disk on the right. `fopen` opens a channel (the
// `FILE *`) between them, `fwrite` and `fread` move records through it as bytes, and
// every call is checked: the pointer against NULL, the counts against what was asked,
// and a failed read against `feof` and `ferror`. The code is drawn inside the canvas
// (an editor that highlights the running line), so every step is a motion step and the
// cues below keep both halves in sync.

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

/** Slides the highlight bar to editor line `n`. */
const bar = (at: number, n: number): MotionCue => ({ at, do: 'move', el: 'hl', to: `ln-${n}`, dur: 450 });

/** Types statement `n` of the program and slides the bar to it (no module of its own). */
const note = (at: number, n: number): MotionCue[] => [{ at, do: 'type', el: `ed-${n}`, dur: 500 }, bar(at, n)];

/**
 * Runs the instruction on editor line `n`: types it, slides the bar, builds its module
 * and sends the execution particle there. Its lit state follows after `lit` ms.
 */
const exec = (at: number, n: number, lit: number | null = 800): MotionCue[] => [
	...note(at, n),
	{ at: at + 100, do: 'enter', el: `m-${n}` },
	{ at: at + 100, do: 'move', el: 'p', to: `a-m${n}`, dur: 700 },
	...(lit === null ? [] : [{ at: at + lit, do: 'enter' as const, el: `on-${n}` }]),
];

/** Runs a line again (already typed, module already built). */
const rerun = (at: number, n: number, lit = 800): MotionCue[] => [
	bar(at, n),
	{ at: at + 100, do: 'move', el: 'p', to: `a-m${n}`, dur: 700 },
	{ at: at + lit, do: 'enter', el: `on-${n}` },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const fail = timed(
	say('`fopen` intenta abrir `no-existe/productos.dat`: esa carpeta no existe.', '`fopen` tries to open `missing/products.dat`: that folder does not exist.'),
	say('No puede abrir el canal: devuelve `NULL`, no un `FILE *`.', 'It cannot open the channel: it returns `NULL`, not a `FILE *`.'),
	say('Se comprueba: con `NULL`, `perror` da el motivo y no se usa el puntero.', 'It is checked: on `NULL`, `perror` gives the reason; the pointer is unused.'),
);
const open = timed(
	say('Con la ruta correcta, `fopen` abre `productos.dat` en modo `"wb"`.', 'With the right path, `fopen` opens `products.dat` in `"wb"` mode.'),
	say('Devuelve un `FILE *`, distinto de `NULL`: el canal de bytes hacia el disco.', 'It returns a `FILE *`, not `NULL`: the byte channel to the disk.'),
);
const write = timed(
	say('`fwrite` envía bytes por el canal. Primero, la cabecera `uint32_t`: 3.', '`fwrite` sends bytes through the channel. First, the `uint32_t` header: 3.'),
	say('Luego, en una sola llamada, los tres registros de `productos`.', 'Then, in one call, the three records of `products`.'),
	say('Cada `fwrite` devuelve cuántos elementos escribió: se compara con lo pedido.', 'Each `fwrite` returns how many elements it wrote: compared with what was asked.'),
);
const bytes = timed(
	say('Se guardan tal como están en memoria: es un archivo binario.', 'They are stored as they are in memory: a binary file.'),
	say('Como texto, 3500 son cuatro caracteres; en binario, los bytes del `int`.', 'As text, 3500 is four characters; in binary, the bytes of the `int`.'),
);
const read = timed(
	say('Se abre con `"rb"` y `fread` lee la cabecera: un elemento, `n = 3`.', 'It is opened with `"rb"` and `fread` reads the header: one element, `n = 3`.'),
	say('El ciclo lee un registro por vuelta; la posición avanza sola.', 'The loop reads one record per turn; the position advances by itself.'),
	say('Cada `fread` devuelve 1 y se compara con el 1 pedido: el ciclo sigue.', 'Each `fread` returns 1, compared with the 1 asked: the loop goes on.'),
);
const eof = timed(
	say('Tras el tercer registro, `feof` sigue apagado: no predice el futuro.', 'After the third record, `feof` is still off: it does not predict the future.'),
	say('El cuarto `fread` devuelve 0, no 1: choca con el final y el ciclo termina.', 'The fourth `fread` returns 0, not 1: it hits the end and the loop ends.'),
	say('Recién ahora se pregunta por qué: `feof` es el fin; `ferror`, un error.', 'Only now do we ask why: `feof` is the end; `ferror`, an error.'),
);
const close = timed(
	say('Por fin de archivo, error o cabecera incompleta, todos pasan por `fclose`.', 'By end of file, error or incomplete header, all paths go through `fclose`.'),
	say('Un `fopen` exitoso, un `fclose`: después, el `FILE *` ya no es válido.', 'One `fopen`, one `fclose`: after it, the `FILE *` is no longer valid.'),
);
const whole = timed(
	say('Abrir, comprobar, escribir, leer y cerrar: cada paso se verifica.', 'Open, check, write, read and close: every step is verified.'),
	say('El disco puede fallar en cualquier momento: por eso se comprueba todo.', 'The disk can fail at any moment: that is why everything is checked.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'open', label: { es: 'Abrir y comprobar', en: 'Open and check' } },
		{ id: 'write', label: { es: 'Guardar con fwrite', en: 'Saving with fwrite' } },
		{ id: 'bytes', label: { es: 'Texto o binario', en: 'Text or binary' } },
		{ id: 'read', label: { es: 'Leer con fread', en: 'Reading with fread' } },
		{ id: 'eof', label: { es: 'Fin de archivo o error', en: 'End of file or error' } },
		{ id: 'close', label: { es: 'Cerrar siempre', en: 'Always close' } },
	],
	steps: [
		// ─── Scene 1. Open and check ────────────────────────────────────────
		{
			id: 'fail',
			chapter: 'open',
			scene: 'journey',
			title: { es: 'Abrir un archivo puede fallar', en: 'Opening a file can fail' },
			subtitles: fail.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 1600),
					{ at: 100, do: 'enter', el: 'z-mem' },
					{ at: 250, do: 'enter', el: 'z-disk' },
					{ at: 500, do: 'enter', el: 'rec-1' },
					{ at: 700, do: 'enter', el: 'rec-2' },
					{ at: 900, do: 'enter', el: 'rec-3' },
					{ at: 1100, do: 'enter', el: 'lb-names' },
					{ at: 1000, do: 'enter', el: 'hl' },
					{ at: 1300, do: 'type', el: 'ed-1a', dur: 600 },
					bar(1300, 1),
					...note(1950, 2),
					...exec(2600, 3, 900),
					{ at: 2700, do: 'enter', el: 'p' },
					{ at: 3800, do: 'pulse', el: 'm-3' },
					// fopen cannot reach the folder: the channel is cut short and returns NULL.
					shot(fail.start(1), 'shot-chan', 1600),
					{ at: fail.start(1) + 300, do: 'enter', el: 'disk-bad' },
					{ at: fail.start(1) + 400, do: 'enter', el: 'lb-nodir' },
					{ at: fail.start(1) + 800, do: 'draw', el: 'fl-fail', dur: 900 },
					{ at: fail.start(1) + 900, do: 'exit', el: 'on-3', dur: 300 },
					{ at: fail.start(1) + 900, do: 'enter', el: 'on-3x' },
					{ at: fail.start(1) + 1800, do: 'draw', el: 'x-mark', dur: 500 },
					{ at: fail.start(1) + 2200, do: 'enter', el: 'nn-null' },
					{ at: fail.start(1) + 2600, do: 'pulse', el: 'nn-null' },
					// The result is checked, the reason is reported, the pointer is never used.
					...exec(fail.start(2), 4, null),
					{ at: fail.start(2) + 700, do: 'enter', el: 'on-4x' },
					{ at: fail.start(2) + 900, do: 'type', el: 'of-1', dur: 1500 },
					{ at: fail.start(2) + 1400, do: 'pulse', el: 'm-4' },
				),
			},
		},
		{
			id: 'open',
			chapter: 'open',
			scene: 'journey',
			title: { es: 'El canal con el disco', en: 'The channel to the disk' },
			subtitles: open.list,
			motion: {
				cues: seq(
					// The failed run is cleared before the program runs again with the right path.
					clear(0, 'on-3x', 'on-4x', 'x-mark', 'fl-fail', 'nn-null', 'lb-nodir', 'disk-bad', 'of-1', 'on-4', 'p'),
					{ at: 0, do: 'exit', el: 'on-3', dur: 300 },
					shot(0, 'shot-chan', 1400),
					{ at: 300, do: 'exit', el: 'ed-1a', dur: 300 },
					bar(300, 1),
					{ at: 700, do: 'type', el: 'ed-1b', dur: 700 },
					bar(1600, 3),
					{ at: 1700, do: 'move', el: 'p', to: 'a-m3', dur: 1 },
					{ at: 1800, do: 'enter', el: 'p' },
					{ at: 2300, do: 'enter', el: 'on-3' },
					{ at: 2300, do: 'pulse', el: 'm-3' },
					{ at: 2600, do: 'enter', el: 'lb-file' },
					// The channel opens between the two ends.
					{ at: open.start(1) + 200, do: 'draw', el: 'fl-chan', dur: 1000 },
					{ at: open.start(1) + 1100, do: 'enter', el: 'ch-file' },
					{ at: open.start(1) + 1200, do: 'enter', el: 'mem-on' },
					{ at: open.start(1) + 1200, do: 'enter', el: 'disk-on' },
					{ at: open.start(1) + 1500, do: 'pulse', el: 'ch-file' },
					// The pointer is checked and is not NULL.
					...rerun(open.start(1) + 2300, 4, 700),
					{ at: open.start(1) + 3200, do: 'enter', el: 'nn-ok' },
					{ at: open.start(1) + 3600, do: 'pulse', el: 'm-4' },
				),
			},
		},

		// ─── Scene 2. Save with fwrite ──────────────────────────────────────
		{
			id: 'write',
			chapter: 'write',
			scene: 'journey',
			title: { es: 'Guardar registros con fwrite', en: 'Saving records with fwrite' },
			subtitles: write.list,
			motion: {
				cues: seq(
					clear(0, 'nn-ok', 'mem-on', 'disk-on', 'on-4'),
					shot(0, 'shot-chan', 1400),
					// The header: a uint32_t with the count.
					...note(300, 5),
					...exec(1000, 6, 800),
					{ at: 1900, do: 'enter', el: 'pk-h' },
					{ at: 2100, do: 'move', el: 'pk-h', to: 'a-dk-h', dur: 1300 },
					{ at: 3500, do: 'exit', el: 'pk-h', dur: 300 },
					{ at: 3500, do: 'enter', el: 'dk-h' },
					{ at: 3700, do: 'pulse', el: 'dk-h' },
					{ at: 3800, do: 'enter', el: 'cw-h' },
					// The three records, in a single call.
					...exec(write.start(1), 7, 800),
					{ at: write.start(1), do: 'exit', el: 'cw-h', dur: 400 },
					{ at: write.start(1) + 1100, do: 'enter', el: 'pk-r' },
					{ at: write.start(1) + 1300, do: 'move', el: 'pk-r', to: 'a-dk-2', dur: 1500 },
					{ at: write.start(1) + 2900, do: 'exit', el: 'pk-r', dur: 300 },
					{ at: write.start(1) + 2900, do: 'enter', el: 'dk-1' },
					{ at: write.start(1) + 3150, do: 'enter', el: 'dk-2' },
					{ at: write.start(1) + 3400, do: 'enter', el: 'dk-3' },
					{ at: write.start(1) + 3900, do: 'pulse', el: 'dk-2' },
					// Each count is compared with what was asked; fclose ends the channel.
					{ at: write.start(2), do: 'enter', el: 'cw-r' },
					{ at: write.start(2) + 500, do: 'pulse', el: 'cw-r' },
					...exec(write.start(2) + 1600, 8, 800),
					{ at: write.start(2) + 2400, do: 'exit', el: 'fl-chan', dur: 600 },
					{ at: write.start(2) + 2400, do: 'exit', el: 'ch-file', dur: 400 },
					{ at: write.start(2) + 3000, do: 'enter', el: 'disk-on' },
				),
			},
		},

		// ─── Scene 3. Text or binary ────────────────────────────────────────
		{
			id: 'bytes',
			chapter: 'bytes',
			scene: 'journey',
			title: { es: 'Texto frente a binario', en: 'Text versus binary' },
			subtitles: bytes.list,
			motion: {
				cues: seq(
					clear(0, 'cw-r'),
					shot(0, 'shot-bytes', 2000),
					{ at: 700, do: 'enter', el: 'sz-h' },
					{ at: 1000, do: 'pulse', el: 'dk-h' },
					{ at: 1400, do: 'enter', el: 'sz-r' },
					{ at: 1700, do: 'pulse', el: 'dk-1' },
					{ at: 1900, do: 'pulse', el: 'dk-2' },
					{ at: 2100, do: 'pulse', el: 'dk-3' },
					// The same number, as characters and as raw bytes.
					{ at: bytes.start(1), do: 'enter', el: 'bp-card' },
					{ at: bytes.start(1) + 500, do: 'enter', el: 'bp-text' },
					{ at: bytes.start(1) + 1600, do: 'pulse', el: 'bp-text' },
					{ at: bytes.start(1) + 2400, do: 'enter', el: 'bp-bin' },
					{ at: bytes.start(1) + 3400, do: 'pulse', el: 'bp-bin' },
					{ at: bytes.start(1) + 4200, do: 'enter', el: 'hdr-hex' },
					{ at: bytes.start(1) + 4500, do: 'pulse', el: 'dk-h' },
				),
			},
		},

		// ─── Scene 4. Read with fread ───────────────────────────────────────
		{
			id: 'read',
			chapter: 'read',
			scene: 'journey',
			title: { es: 'Leer registros con fread', en: 'Reading records with fread' },
			subtitles: read.list,
			motion: {
				cues: seq(
					clear(0, 'bp-card', 'bp-text', 'bp-bin', 'hdr-hex', 'sz-h', 'sz-r', 'disk-on', 'on-6', 'on-7', 'on-8'),
					shot(0, 'shot-chan', 1500),
					// The file is opened again, now to read.
					...exec(300, 9, 700),
					{ at: 1000, do: 'draw', el: 'fl-chan', dur: 900 },
					{ at: 1900, do: 'enter', el: 'ch-file' },
					...note(2300, 10),
					{ at: 2500, do: 'enter', el: 'slot' },
					// The header: one element, compared with the one asked for.
					...exec(2900, 11, 700),
					{ at: 3500, do: 'enter', el: 'cur' },
					{ at: 3700, do: 'enter', el: 'pk-hr' },
					{ at: 3800, do: 'move', el: 'pk-hr', to: 'a-slot', dur: 1000 },
					{ at: 3800, do: 'move', el: 'cur', to: 'a-cur-1', dur: 900 },
					{ at: 4900, do: 'exit', el: 'pk-hr', dur: 300 },
					{ at: 4900, do: 'enter', el: 'slot-on' },
					// The loop: one record per turn, the position advancing on its own.
					{ at: read.start(1), do: 'exit', el: 'slot-on', dur: 300 },
					...note(read.start(1), 12),
					{ at: read.start(1) + 100, do: 'enter', el: 'm-12' },
					{ at: read.start(1) + 100, do: 'move', el: 'p', to: 'a-m12', dur: 700 },
					{ at: read.start(1) + 800, do: 'enter', el: 'on-12' },
					...[1, 2, 3].flatMap((n): MotionCue[] => {
						const at = read.start(1) + 1100 + (n - 1) * 2100;
						return [
							{ at, do: 'enter', el: `pk-${n}` },
							...(n > 1 ? [{ at, do: 'exit' as const, el: 'slot-on', dur: 300 }] : []),
							...(n > 1 ? [bar(at, 12)] : []),
							{ at: at + 200, do: 'move', el: `pk-${n}`, to: 'a-slot', dur: 900 },
							{ at: at + 200, do: 'move', el: 'cur', to: `a-cur-${n + 1}`, dur: 900 },
							{ at: at + 1200, do: 'exit', el: `pk-${n}`, dur: 300 },
							{ at: at + 1200, do: 'enter', el: 'slot-on' },
							...(n === 1 ? [{ at: at + 1200, do: 'type' as const, el: 'ed-13', dur: 500 }] : []),
							bar(at + 1200, 13),
							{ at: at + 1300, do: 'type', el: `or-${n}`, dur: 600 },
							{ at: at + 1900, do: 'pulse', el: 'm-12' },
						];
					}),
					{ at: read.start(2) + 300, do: 'enter', el: 'cr-1' },
					{ at: read.start(2) + 1800, do: 'pulse', el: 'cr-1' },
				),
			},
		},

		// ─── Scene 5. End of file or error ──────────────────────────────────
		{
			id: 'eof',
			chapter: 'eof',
			scene: 'journey',
			title: { es: '¿Fin del archivo o error?', en: 'End of file or error?' },
			subtitles: eof.list,
			motion: {
				cues: seq(
					clear(0, 'cr-1', 'slot-on'),
					shot(0, 'shot-eof', 1600),
					{ at: 300, do: 'enter', el: 'lp-feof' },
					{ at: 300, do: 'enter', el: 'lp-ferror' },
					{ at: 900, do: 'enter', el: 'eof-wall' },
					{ at: 1300, do: 'enter', el: 'lb-eof' },
					{ at: 1900, do: 'pulse', el: 'cur' },
					// The fourth read finds nothing: it returns 0, not the 1 that was asked.
					bar(eof.start(1), 12),
					{ at: eof.start(1) + 300, do: 'pulse', el: 'eof-wall' },
					{ at: eof.start(1) + 500, do: 'exit', el: 'on-12', dur: 300 },
					{ at: eof.start(1) + 500, do: 'enter', el: 'on-12x' },
					{ at: eof.start(1) + 600, do: 'enter', el: 'cr-0' },
					{ at: eof.start(1) + 1100, do: 'pulse', el: 'm-12' },
					...note(eof.start(1) + 2600, 14),
					// Only now: which of the two indicators is on?
					{ at: eof.start(2), do: 'exit', el: 'cr-0', dur: 400 },
					...exec(eof.start(2), 15, 700),
					...exec(eof.start(2) + 1300, 16, 700),
					{ at: eof.start(2) + 2100, do: 'enter', el: 'lp-feof-on' },
					{ at: eof.start(2) + 2200, do: 'type', el: 'or-4', dur: 700 },
					{ at: eof.start(2) + 3300, do: 'enter', el: 'lb-alt' },
					{ at: eof.start(2) + 3300, do: 'enter', el: 'lp-ferror-on' },
					{ at: eof.start(2) + 4300, do: 'exit', el: 'lp-ferror-on', dur: 400 },
					{ at: eof.start(2) + 4300, do: 'exit', el: 'lb-alt', dur: 400 },
				),
			},
		},

		// ─── Scene 6. Always close ──────────────────────────────────────────
		{
			id: 'close',
			chapter: 'close',
			scene: 'journey',
			title: { es: 'Cerrar en todos los caminos', en: 'Closing on every path' },
			subtitles: close.list,
			motion: {
				cues: seq(
					clear(0, 'lp-feof', 'lp-ferror', 'lp-feof-on', 'lb-eof', 'eof-wall', 'cur', 'on-12x', 'on-15', 'on-16'),
					shot(0, 'shot-mods', 1800),
					...exec(400, 17, 1500),
					// Header incomplete, end of file, read error: three ways out, one fclose.
					{ at: 1900, do: 'draw', el: 'cv-1', dur: 900 },
					{ at: 1900, do: 'pulse', el: 'm-11' },
					{ at: 2800, do: 'draw', el: 'cv-2', dur: 900 },
					{ at: 2800, do: 'pulse', el: 'm-12' },
					{ at: 3700, do: 'draw', el: 'cv-3', dur: 900 },
					{ at: 3700, do: 'pulse', el: 'm-15' },
					{ at: 4600, do: 'enter', el: 'cv-note' },
					// fclose releases the channel: the FILE * is no longer valid.
					shot(close.start(1), 'shot-chan', 1800),
					{ at: close.start(1) + 300, do: 'exit', el: 'fl-chan', dur: 600 },
					{ at: close.start(1) + 300, do: 'exit', el: 'ch-file', dur: 400 },
					{ at: close.start(1) + 1000, do: 'enter', el: 'inv' },
					{ at: close.start(1) + 1700, do: 'pulse', el: 'inv' },
				),
			},
		},
		{
			id: 'whole',
			chapter: 'close',
			scene: 'journey',
			title: { es: 'Del programa al disco y de vuelta', en: 'From the program to disk and back' },
			subtitles: whole.list,
			motion: {
				cues: seq(
					clear(0, 'inv'),
					{ at: 0, do: 'exit', el: 'hl', dur: 500 },
					// The camera pulls back to reveal the whole system and every path taken.
					{ at: 100, do: 'camera', to: 'all', dur: 3200 },
					{ at: 500, do: 'flow', el: 'cv-1' },
					{ at: 500, do: 'flow', el: 'cv-2' },
					{ at: 500, do: 'flow', el: 'cv-3' },
					{ at: 1200, do: 'enter', el: 'mem-on' },
					{ at: 1200, do: 'enter', el: 'disk-on' },
					{ at: 1500, do: 'pulse', el: 'z-mem' },
					{ at: 1900, do: 'pulse', el: 'z-disk' },
					{ at: whole.start(1) + 300, do: 'pulse', el: 'm-3' },
					{ at: whole.start(1) + 600, do: 'pulse', el: 'm-6' },
					{ at: whole.start(1) + 900, do: 'pulse', el: 'm-7' },
					{ at: whole.start(1) + 1200, do: 'pulse', el: 'm-11' },
					{ at: whole.start(1) + 1500, do: 'pulse', el: 'm-12' },
					{ at: whole.start(1) + 1800, do: 'pulse', el: 'm-17' },
				),
			},
		},
	],
};
