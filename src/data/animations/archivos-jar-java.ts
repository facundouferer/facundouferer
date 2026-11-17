import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of data to disk and into a JAR": a short film (about two minutes) for
// the Java lesson "Archivos, Serialización y Empaquetado JAR". It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/archivos-jar-java.astro`): an isometric system with the
// Heap, a BufferedWriter wrapping a FileWriter, the disk and, at the back, the JAR.
// The object lives in the Heap, its CSV line is the light blue packet that travels to
// the disk, magenta marks what is lost when the JVM stops and violet what keeps it:
// try-with-resources, the file on disk and the packaged JAR. The code is drawn inside
// the canvas (an editor that highlights the running line), so the cues below keep
// both halves in sync.

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
const seq = (...cues: MotionCue[]): MotionCue[] => cues.map((cue, index) => ({ cue, index })).sort((a, b) => a.cue.at - b.cue.at || a.index - b.index).map((entry) => entry.cue);

/** Camera cue that frames one of the `shot-*` anchors exactly (they carry their own zoom). */
const shot = (at: number, to: string, dur: number): MotionCue => ({ at, do: 'camera', to: [to], dur, pad: 0 });

// ─── Captions ───────────────────────────────────────────────────────────────
const born = timed(
	say('Este programa crea un `Producto`. El objeto vive en el Heap, la memoria de la JVM.', 'This program creates a `Product`. The object lives in the Heap, the memory of the JVM.'),
	say('Mientras `main` se ejecuta, el objeto existe y se puede usar.', 'While `main` runs, the object exists and can be used.'),
);
const vanish = timed(
	say('Al llegar a la última llave, `main` termina y la JVM se detiene.', 'At the last brace, `main` ends and the JVM stops.'),
	say('Sin JVM no hay Heap: la memoria se evapora y el objeto se pierde.', 'Without a JVM there is no Heap: the memory evaporates and the object is lost.'),
);
const wrap = timed(
	say('Ahora el programa guarda el dato: `FileWriter` abre un archivo con UTF-8 explícito.', 'Now the program saves the data: `FileWriter` opens a file with explicit UTF-8.'),
	say('`BufferedWriter` lo envuelve: es un decorador que le agrega un buffer.', '`BufferedWriter` wraps it: a decorator that adds a buffer to it.'),
);
const write = timed(
	say('`out.write()` entrega al decorador el producto como una línea CSV.', '`out.write()` hands the product to the decorator as a CSV line.'),
	say('La línea queda en el buffer: todavía no tocó el disco.', 'The line stays in the buffer: it has not touched the disk yet.'),
	say('El buffer junta los datos y va al disco una sola vez por bloque.', 'The buffer gathers the data and goes to the disk only once per block.'),
);
const close = timed(
	say('Al salir del bloque, el archivo se cierra solo: try-with-resources llama a `close()`.', 'On leaving the block, the file is closed for you: try-with-resources calls `close()`.'),
	say('Cerrar vacía el buffer: la línea pasa por `FileWriter` y llega al disco.', 'Closing flushes the buffer: the line goes through `FileWriter` and reaches the disk.'),
	say('Si el archivo no se cierra, lo que quedó en el buffer se pierde.', 'If the file is not closed, whatever stayed in the buffer is lost.'),
);
const persist = timed(
	say('El programa muestra "Guardado en disco" y `main` termina otra vez.', 'The program prints "Saved to disk" and `main` ends again.'),
	say('La JVM se detiene y el Heap se evapora de nuevo…', 'The JVM stops and the Heap evaporates again…'),
	say('…pero `catalogo.csv` sigue en el disco: sobrevive al programa.', '…but `catalog.csv` is still on the disk: it survives the program.'),
);
const pack = timed(
	say('`javac` compila el código a archivos `.class`: bytecode para la JVM.', '`javac` compiles the code into `.class` files: bytecode for the JVM.'),
	say('`jar` los empaqueta en `app.jar`, que es un ZIP con todas las clases.', '`jar` packages them into `app.jar`, which is a ZIP with every class.'),
	say('La `e` de `cvfe` escribe en `MANIFEST.MF` la línea `Main-Class: Main`.', 'The `e` in `cvfe` writes the line `Main-Class: Main` into `MANIFEST.MF`.'),
);
const run = timed(
	say('`java -jar app.jar` abre el JAR y lee `Main-Class` en el manifiesto.', '`java -jar app.jar` opens the JAR and reads `Main-Class` in the manifest.'),
	say('Así sabe dónde empezar: ejecuta `main` en cualquier máquina con una JVM.', 'That is how it knows where to start: it runs `main` on any machine with a JVM.'),
	say('Memoria que se evapora, un disco que persiste y un JAR para entregar el programa.', 'Memory that evaporates, a disk that persists and a JAR to deliver the program.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'heap', label: { es: 'Todo vive en el Heap', en: 'Everything lives in the Heap' } },
		{ id: 'volatile', label: { es: 'El Heap se evapora', en: 'The Heap evaporates' } },
		{ id: 'decorator', label: { es: 'Un decorador para escribir', en: 'A decorator for writing' } },
		{ id: 'close', label: { es: 'try-with-resources cierra', en: 'try-with-resources closes' } },
		{ id: 'persist', label: { es: 'El dato sobrevive', en: 'The data survives' } },
		{ id: 'jar', label: { es: 'Del código al JAR', en: 'From code to the JAR' } },
	],
	steps: [
		// ─── Scene 1. Everything lives in the Heap ──────────────────────────
		{
			id: 'heap',
			chapter: 'heap',
			scene: 'journey',
			title: { es: 'Un objeto en el Heap', en: 'An object in the Heap' },
			subtitles: born.list,
			motion: {
				cues: seq(
					shot(0, 'shot-heap', 2400),
					{ at: 200, do: 'type', el: 'ea-1', dur: 900 },
					{ at: 400, do: 'enter', el: 'm-heap' },
					{ at: 1200, do: 'type', el: 'ea-3', dur: 200 },
					{ at: 1500, do: 'enter', el: 'hl' },
					{ at: 1700, do: 'move', el: 'hl', to: 'l-2', dur: 600 },
					{ at: 2300, do: 'type', el: 'ea-2', dur: 1000 },
					{ at: 3200, do: 'enter', el: 'obj', dur: 700 },
					{ at: 3300, do: 'enter', el: 'heap-on' },
					{ at: 4000, do: 'pulse', el: 'obj' },
					{ at: born.start(1) + 300, do: 'enter', el: 'lb-live' },
					{ at: born.start(1) + 1200, do: 'pulse', el: 'm-heap' },
				),
			},
		},

		// ─── Scene 2. The Heap evaporates ───────────────────────────────────
		{
			id: 'vanish',
			chapter: 'volatile',
			scene: 'journey',
			title: { es: 'El Heap se evapora', en: 'The Heap evaporates' },
			subtitles: vanish.list,
			motion: {
				cues: seq(
					{ at: 300, do: 'move', el: 'hl', to: 'l-3', dur: 600 },
					{ at: 900, do: 'exit', el: 'lb-live', dur: 400 },
					{ at: 1200, do: 'enter', el: 'jvm-off' },
					{ at: 1400, do: 'pulse', el: 'jvm-off' },
					{ at: vanish.start(1), do: 'exit', el: 'heap-on', dur: 500 },
					{ at: vanish.start(1) + 100, do: 'enter', el: 'heap-x' },
					{ at: vanish.start(1) + 100, do: 'enter', el: 'hx-a3' },
					{ at: vanish.start(1) + 400, do: 'pulse', el: 'm-heap' },
					{ at: vanish.start(1) + 1400, do: 'exit', el: 'obj', dur: 900 },
					{ at: vanish.start(1) + 1600, do: 'enter', el: 'obj-ghost', dur: 900 },
					{ at: vanish.start(1) + 2600, do: 'enter', el: 'lb-lost' },
					{ at: vanish.start(1) + 3800, do: 'pulse', el: 'obj-ghost' },
				),
			},
		},

		// ─── Scene 3. A decorator for writing ───────────────────────────────
		{
			id: 'wrap',
			chapter: 'decorator',
			scene: 'journey',
			title: { es: 'BufferedWriter envuelve a FileWriter', en: 'BufferedWriter wraps FileWriter' },
			subtitles: wrap.list,
			motion: {
				cues: seq(
					// The program runs again, now with a file to write.
					{ at: 0, do: 'exit', el: 'jvm-off', dur: 400 },
					{ at: 0, do: 'exit', el: 'heap-x', dur: 400 },
					{ at: 0, do: 'exit', el: 'hx-a3', dur: 400 },
					{ at: 0, do: 'exit', el: 'obj-ghost', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-lost', dur: 400 },
					{ at: 200, do: 'exit', el: 'ea', dur: 300 },
					{ at: 500, do: 'enter', el: 'eb' },
					{ at: 500, do: 'move', el: 'hl', to: 'l-2', dur: 400 },
					{ at: 700, do: 'enter', el: 'obj' },
					{ at: 700, do: 'enter', el: 'heap-on' },
					shot(800, 'shot-disk', 2200),
					{ at: 1200, do: 'type', el: 'eb-4', dur: 1200 },
					{ at: 1500, do: 'enter', el: 'm-disk' },
					{ at: 2200, do: 'enter', el: 'm-fw' },
					{ at: 2800, do: 'draw', el: 'rt-3', dur: 700 },
					{ at: 3400, do: 'enter', el: 'lb-utf' },
					{ at: wrap.start(1), do: 'type', el: 'eb-3', dur: 1000 },
					{ at: wrap.start(1) + 400, do: 'enter', el: 'm-buf' },
					{ at: wrap.start(1) + 1100, do: 'draw', el: 'rt-2', dur: 600 },
					{ at: wrap.start(1) + 1600, do: 'enter', el: 'dec' },
					{ at: wrap.start(1) + 2400, do: 'pulse', el: 'm-buf' },
					shot(wrap.start(1) + 2800, 'shot-write', 1800),
					{ at: wrap.start(1) + 3100, do: 'enter', el: 'try-zone' },
					{ at: wrap.start(1) + 3400, do: 'type', el: 'eb-6', dur: 200 },
					{ at: wrap.start(1) + 3800, do: 'pulse', el: 'try-zone' },
				),
			},
		},
		{
			id: 'write',
			chapter: 'decorator',
			scene: 'journey',
			title: { es: 'La línea espera en el buffer', en: 'The line waits in the buffer' },
			subtitles: write.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-utf', dur: 400 },
					{ at: 200, do: 'move', el: 'hl', to: 'l-5', dur: 600 },
					{ at: 400, do: 'type', el: 'eb-5', dur: 800 },
					{ at: 1300, do: 'move', el: 'pk', to: 'a-heap', dur: 1 },
					{ at: 1400, do: 'pulse', el: 'obj' },
					{ at: 1500, do: 'enter', el: 'pk' },
					{ at: 2400, do: 'draw', el: 'rt-1', dur: 900 },
					{ at: 2500, do: 'move', el: 'pk', to: 'a-buf', dur: 1300 },
					{ at: write.start(1), do: 'enter', el: 'buf-on' },
					{ at: write.start(1) + 200, do: 'pulse', el: 'm-buf' },
					{ at: write.start(1) + 900, do: 'enter', el: 'lb-wait' },
					{ at: write.start(2) + 300, do: 'exit', el: 'dec', dur: 400 },
					{ at: write.start(2) + 500, do: 'enter', el: 'lb-block' },
					{ at: write.start(2) + 1400, do: 'pulse', el: 'pk' },
				),
			},
		},

		// ─── Scene 4. try-with-resources closes ─────────────────────────────
		{
			id: 'close',
			chapter: 'close',
			scene: 'journey',
			title: { es: 'El archivo se cierra solo', en: 'The file closes itself' },
			subtitles: close.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-wait', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-block', dur: 400 },
					shot(100, 'shot-disk', 1800),
					{ at: 300, do: 'move', el: 'hl', to: 'l-6', dur: 600 },
					{ at: 1200, do: 'pulse', el: 'try-zone' },
					{ at: 2200, do: 'enter', el: 'lb-close' },
					// close() flushes the buffer: the line goes on through FileWriter.
					{ at: close.start(1), do: 'exit', el: 'buf-on', dur: 600 },
					{ at: close.start(1) + 100, do: 'draw', el: 'fl-2', dur: 900 },
					{ at: close.start(1) + 100, do: 'move', el: 'pk', to: 'a-fw', dur: 1100 },
					{ at: close.start(1) + 1200, do: 'enter', el: 'fw-on' },
					{ at: close.start(1) + 1300, do: 'draw', el: 'fl-3', dur: 900 },
					{ at: close.start(1) + 1300, do: 'move', el: 'pk', to: 'a-disk', dur: 1200 },
					{ at: close.start(1) + 2500, do: 'exit', el: 'pk', dur: 300 },
					{ at: close.start(1) + 2500, do: 'enter', el: 'file', dur: 700 },
					{ at: close.start(1) + 2500, do: 'enter', el: 'disk-on' },
					{ at: close.start(1) + 3300, do: 'exit', el: 'fw-on', dur: 500 },
					{ at: close.start(2) + 300, do: 'pulse', el: 'm-buf' },
					{ at: close.start(2) + 1300, do: 'pulse', el: 'file' },
				),
			},
		},

		// ─── Scene 5. The data survives ─────────────────────────────────────
		{
			id: 'persist',
			chapter: 'persist',
			scene: 'journey',
			title: { es: 'El dato sobrevive al programa', en: 'The data survives the program' },
			subtitles: persist.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-close', dur: 400 },
					shot(100, 'shot-write', 2200),
					{ at: 300, do: 'move', el: 'hl', to: 'l-7', dur: 600 },
					{ at: 800, do: 'type', el: 'eb-7', dur: 900 },
					{ at: 1800, do: 'type', el: 'out-1', dur: 700 },
					{ at: 2800, do: 'move', el: 'hl', to: 'l-8', dur: 500 },
					{ at: persist.start(1), do: 'enter', el: 'jvm-off' },
					{ at: persist.start(1) + 200, do: 'exit', el: 'heap-on', dur: 500 },
					{ at: persist.start(1) + 300, do: 'enter', el: 'heap-x' },
					{ at: persist.start(1) + 900, do: 'exit', el: 'obj', dur: 900 },
					{ at: persist.start(1) + 1100, do: 'enter', el: 'obj-ghost', dur: 900 },
					{ at: persist.start(2), do: 'pulse', el: 'file' },
					{ at: persist.start(2) + 300, do: 'enter', el: 'lb-keep' },
					{ at: persist.start(2) + 1400, do: 'pulse', el: 'm-disk' },
				),
			},
		},

		// ─── Scene 6. From code to the JAR ──────────────────────────────────
		{
			id: 'package',
			chapter: 'jar',
			scene: 'journey',
			title: { es: 'javac, jar y el manifiesto', en: 'javac, jar and the manifest' },
			subtitles: pack.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'jvm-off', dur: 400 },
					{ at: 0, do: 'exit', el: 'heap-x', dur: 400 },
					{ at: 0, do: 'exit', el: 'obj-ghost', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-keep', dur: 400 },
					shot(200, 'shot-jar', 2200),
					{ at: 600, do: 'move', el: 'hl', to: 'l-10', dur: 700 },
					{ at: 900, do: 'type', el: 'sh-10', dur: 900 },
					{ at: 1900, do: 'enter', el: 'cls-a' },
					{ at: 2200, do: 'enter', el: 'cls-b' },
					{ at: pack.start(1), do: 'move', el: 'hl', to: 'l-11', dur: 500 },
					{ at: pack.start(1) + 200, do: 'type', el: 'sh-11', dur: 1100 },
					{ at: pack.start(1) + 600, do: 'enter', el: 'm-jar' },
					{ at: pack.start(1) + 1500, do: 'move', el: 'cls-a', to: 'a-jar', dur: 1200 },
					{ at: pack.start(1) + 1800, do: 'move', el: 'cls-b', to: 'a-jar', dur: 1200 },
					{ at: pack.start(1) + 2700, do: 'exit', el: 'cls-a', dur: 300 },
					{ at: pack.start(1) + 3000, do: 'exit', el: 'cls-b', dur: 300 },
					{ at: pack.start(1) + 3000, do: 'enter', el: 'lb-zip' },
					{ at: pack.start(1) + 3300, do: 'pulse', el: 'm-jar' },
					{ at: pack.start(2), do: 'type', el: 'sh-13', dur: 600 },
					{ at: pack.start(2) + 500, do: 'type', el: 'sh-14', dur: 600 },
					{ at: pack.start(2) + 1000, do: 'type', el: 'sh-15', dur: 500 },
					{ at: pack.start(2) + 1200, do: 'enter', el: 'mf' },
					{ at: pack.start(2) + 2200, do: 'pulse', el: 'mf' },
				),
			},
		},
		{
			id: 'run',
			chapter: 'jar',
			scene: 'journey',
			title: { es: 'java -jar arranca el programa', en: 'java -jar starts the program' },
			subtitles: run.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-zip', dur: 400 },
					{ at: 200, do: 'move', el: 'hl', to: 'l-17', dur: 700 },
					{ at: 500, do: 'type', el: 'sh-17', dur: 800 },
					{ at: 1500, do: 'enter', el: 'jar-on' },
					{ at: 2200, do: 'enter', el: 'mf-on' },
					{ at: 2400, do: 'pulse', el: 'mf' },
					{ at: run.start(1), do: 'camera', to: 'all', dur: 2600 },
					{ at: run.start(1) + 200, do: 'draw', el: 'rt-launch', dur: 1400 },
					{ at: run.start(1) + 1600, do: 'enter', el: 'heap-on' },
					{ at: run.start(1) + 1700, do: 'enter', el: 'obj' },
					{ at: run.start(1) + 2200, do: 'type', el: 'out-2', dur: 700 },
					// The camera has pulled back: the whole path, from memory to disk to JAR.
					{ at: run.start(2), do: 'flow', el: 'rt-1' },
					{ at: run.start(2), do: 'flow', el: 'fl-2' },
					{ at: run.start(2), do: 'flow', el: 'fl-3' },
					{ at: run.start(2), do: 'flow', el: 'rt-launch' },
					{ at: run.start(2) + 600, do: 'pulse', el: 'm-heap' },
					{ at: run.start(2) + 1600, do: 'pulse', el: 'file' },
					{ at: run.start(2) + 2600, do: 'pulse', el: 'm-jar' },
				),
			},
		},
	],
};
