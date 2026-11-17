import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of two threads: from a race condition to the lock": a short film
// (about two minutes) for the Java lesson "Programación Concurrente: Hilos,
// Sincronización y Pools" (order: 22). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/concurrencia-hilos-java.astro`):
// an isometric system with `main()` on its Stack at the back, the shared Heap in
// the middle holding one `Contador` object, and one private Stack per thread on
// each side. Light blue is the execution flow, magenta the lost update of the
// race condition, and violet what resolves it: the `synchronized` lock and the
// thread pool that reuses its workers.

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

/** Types the editor lines `from`..`to` of one page (`ea` or `ec`), one after the other. */
const typeLines = (at: number, page: 'ea' | 'ec', from: number, to: number, gap: number): MotionCue[] =>
	Array.from({ length: to - from + 1 }, (_, index) => ({
		at: at + index * gap,
		do: 'type' as const,
		el: `${page}-${from + index}`,
		dur: Math.max(200, gap),
	}));

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/** Swaps one chip for another in the same slot. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 300 },
	{ at: at + 350, do: 'enter', el: to },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const shared = timed(
	say(
		'El Heap guarda los objetos y lo comparten todos los hilos: ahí vive `Contador`.',
		'The Heap holds the objects and all threads share it: `Counter` lives there.',
	),
	say(
		'Cada hilo, en cambio, tendrá su propia pila (Stack) con sus variables locales.',
		'Each thread, instead, will get its own Stack with its local variables.',
	),
);
const start = timed(
	say(
		'En `main`, `new Thread(...)` crea dos hilos para `c.incrementar()`.',
		'In `main`, `new Thread(...)` creates two threads for `c.increment()`.',
	),
	say('Recién creados, `h1` y `h2` están en estado `NEW`: aún no ejecutan nada.', 'Freshly created, `t1` and `t2` are `NEW`: they run nothing yet.'),
	say(
		'`start()` arranca cada hilo; `run()` correría en el mismo hilo de `main`.',
		'`start()` launches each thread; `run()` would run on the `main` thread itself.',
	),
);
const read = timed(
	say(
		'`contador++` no es atómico: leer, sumarle 1 y escribir.',
		'`count++` is not atomic: read, add 1 and write.',
	),
	say(
		'El hilo 1 lee `0`; el planificador pasa el turno al hilo 2.',
		'Thread 1 reads `0`; the scheduler hands the turn to thread 2.',
	),
	say('El hilo 2 también lee `0`: los dos copiaron el mismo valor.', 'Thread 2 also reads `0`: both copied the same value.'),
);
const lost = timed(
	say('Cada hilo suma 1 a su copia: los dos calculan `1`.', 'Each thread adds 1 to its copy: both compute `1`.'),
	say(
		'El hilo 1 escribe `1`; el hilo 2 escribe `1` encima.',
		'Thread 1 writes `1`; thread 2 writes `1` on top of it.',
	),
	say(
		'Condición de carrera: dos incrementos y una actualización perdida.',
		'A race condition: two increments and one lost update.',
	),
);
const lock = timed(
	say(
		'Volvemos a `contador = 0`, ahora con `synchronized` en `incrementar()`.',
		'Back to `count = 0`, now with `synchronized` on `increment()`.',
	),
	say(
		'Para entrar, el hilo 1 toma el cerrojo (monitor) del objeto.',
		'To enter, thread 1 takes the object’s lock (its monitor).',
	),
	say('El hilo 2 encuentra el cerrojo tomado y espera afuera.', 'Thread 2 finds the lock taken and waits outside.'),
);
const serial = timed(
	say('El hilo 1 lee `0`, escribe `1` y, al salir, libera el cerrojo.', 'Thread 1 reads `0`, writes `1` and releases the lock on its way out.'),
	say(
		'Luego entra el hilo 2: lee `1` y escribe `2`. Ambos incrementos persisten.',
		'Then thread 2 enters: it reads `1` and writes `2`. Both increments persist.',
	),
	say('Es exclusión mutua: un solo hilo a la vez.', 'That is mutual exclusion: one thread at a time.'),
);
const pool = timed(
	say(
		'Un hilo por tarea es caro: `newFixedThreadPool(2)` deja listos dos hilos.',
		'A thread per task is costly: `newFixedThreadPool(2)` keeps two threads ready.',
	),
	say(
		'`submit()` encola cuatro tareas y los mismos dos hilos se reutilizan.',
		'`submit()` queues four tasks and the same two threads are reused.',
	),
	say(
		'`shutdown()` cierra el pool, `awaitTermination` espera y se imprime `4`.',
		'`shutdown()` closes the pool, `awaitTermination` waits and `4` is printed.',
	),
);
const recap = timed(
	say(
		'Los hilos comparten el Heap: sin control, `contador++` pierde actualizaciones.',
		'Threads share the Heap: without control, `count++` loses updates.',
	),
	say(
		'`synchronized` deja pasar un hilo a la vez; un pool reutiliza pocos hilos.',
		'`synchronized` lets one thread in at a time; a pool reuses a few threads.',
	),
);

// Pool timeline: each task travels from the queue to a worker, then to the counter.
const P = pool.start(1);

export const script: AnimationScript = {
	chapters: [
		{ id: 'memory', label: { es: 'Memoria compartida', en: 'Shared memory' } },
		{ id: 'start', label: { es: 'Crear y arrancar hilos', en: 'Creating and starting threads' } },
		{ id: 'race', label: { es: 'Condición de carrera', en: 'Race condition' } },
		{ id: 'sync', label: { es: 'synchronized', en: 'synchronized' } },
		{ id: 'pool', label: { es: 'Pool de hilos', en: 'Thread pool' } },
		{ id: 'recap', label: { es: 'Hilos, cerrojo y pool', en: 'Threads, lock and pool' } },
	],
	steps: [
		// ─── Scene 1. Shared memory ─────────────────────────────────────────
		{
			id: 'shared',
			chapter: 'memory',
			scene: 'journey',
			title: { es: 'Un contador en el Heap', en: 'A counter in the Heap' },
			subtitles: shared.list,
			motion: {
				cues: seq(
					shot(0, 'shot-heap', 4200),
					{ at: 200, do: 'enter', el: 'heap' },
					...typeLines(300, 'ea', 1, 7, 260),
					{ at: 900, do: 'enter', el: 'lb-heap' },
					{ at: 1700, do: 'enter', el: 'obj', dur: 700 },
					{ at: 2300, do: 'enter', el: 'hl' },
					{ at: 2500, do: 'enter', el: 'v-0' },
					{ at: 3100, do: 'pulse', el: 'v-0' },
					{ at: 3700, do: 'pulse', el: 'obj' },
					{ at: 4300, do: 'pulse', el: 'lb-heap' },
					{ at: shared.start(1) + 100, do: 'exit', el: 'lb-heap', dur: 350 },
					{ at: shared.start(1) + 300, do: 'enter', el: 'st1' },
					{ at: shared.start(1) + 600, do: 'enter', el: 'st2' },
					{ at: shared.start(1) + 1400, do: 'pulse', el: 'st1' },
					{ at: shared.start(1) + 1900, do: 'pulse', el: 'st2' },
				),
			},
		},

		// ─── Scene 2. Creating and starting threads ─────────────────────────
		{
			id: 'start',
			chapter: 'start',
			scene: 'journey',
			title: { es: 'new Thread y start()', en: 'new Thread and start()' },
			subtitles: start.list,
			motion: {
				cues: seq(
					shot(0, 'shot-main', 2200),
					...typeLines(200, 'ea', 9, 17, 170),
					{ at: 300, do: 'enter', el: 'floor-main' },
					{ at: 500, do: 'enter', el: 'm-entry' },
					{ at: 600, do: 'enter', el: 'm-new' },
					{ at: 700, do: 'enter', el: 'm-t1' },
					{ at: 800, do: 'enter', el: 'm-t2' },
					{ at: 900, do: 'enter', el: 'm-s1' },
					{ at: 1000, do: 'enter', el: 'm-s2' },
					{ at: 1100, do: 'draw', el: 'tr-main', dur: 900 },
					{ at: 1500, do: 'enter', el: 'p' },
					{ at: 1700, do: 'move', el: 'hl', to: 'ln-11', dur: 600 },
					{ at: 1800, do: 'move', el: 'p', to: 'a-new', dur: 700 },
					{ at: 2500, do: 'enter', el: 'new-on' },
					{ at: 2700, do: 'draw', el: 'ref-c', dur: 800 },
					{ at: 3400, do: 'move', el: 'p', to: 'a-t1', dur: 600 },
					{ at: 3400, do: 'move', el: 'hl', to: 'ln-12', dur: 500 },
					{ at: 4000, do: 'enter', el: 't1-on' },
					{ at: start.start(1) + 100, do: 'move', el: 'p', to: 'a-t2', dur: 600 },
					{ at: start.start(1) + 100, do: 'move', el: 'hl', to: 'ln-13', dur: 500 },
					{ at: start.start(1) + 700, do: 'enter', el: 't2-on' },
					{ at: start.start(1) + 900, do: 'enter', el: 'n1-new' },
					{ at: start.start(1) + 1100, do: 'enter', el: 'n2-new' },
					shot(start.start(1) + 1300, 'shot-threads', 2000),
					{ at: start.start(1) + 2400, do: 'pulse', el: 'n1-new' },
					{ at: start.start(1) + 2700, do: 'pulse', el: 'n2-new' },
					{ at: start.start(2) + 100, do: 'move', el: 'p', to: 'a-s1', dur: 600 },
					{ at: start.start(2) + 100, do: 'move', el: 'hl', to: 'ln-14', dur: 500 },
					{ at: start.start(2) + 700, do: 'enter', el: 's1-on' },
					{ at: start.start(2) + 800, do: 'draw', el: 'sp-1', dur: 800 },
					{ at: start.start(2) + 900, do: 'enter', el: 'pa' },
					{ at: start.start(2) + 1000, do: 'move', el: 'pa', to: 'a-st1', dur: 900 },
					...swap(start.start(2) + 1700, 'n1-new', 'n1-run'),
					{ at: start.start(2) + 2000, do: 'move', el: 'p', to: 'a-s2', dur: 600 },
					{ at: start.start(2) + 2000, do: 'move', el: 'hl', to: 'ln-15', dur: 500 },
					{ at: start.start(2) + 2600, do: 'enter', el: 's2-on' },
					{ at: start.start(2) + 2700, do: 'draw', el: 'sp-2', dur: 800 },
					{ at: start.start(2) + 2800, do: 'enter', el: 'pb' },
					{ at: start.start(2) + 2900, do: 'move', el: 'pb', to: 'a-st2', dur: 900 },
					...swap(start.start(2) + 3600, 'n2-new', 'n2-run'),
					{ at: start.start(2) + 4100, do: 'flow', el: 'sp-1' },
					{ at: start.start(2) + 4100, do: 'flow', el: 'sp-2' },
				),
			},
		},

		// ─── Scene 3. Race condition: both threads read the same value ──────
		{
			id: 'read',
			chapter: 'race',
			scene: 'journey',
			title: { es: 'contador++ en tres pasos', en: 'count++ in three steps' },
			subtitles: read.list,
			motion: {
				cues: seq(
					shot(0, 'shot-race', 2200),
					...clear(100, 'p', 'n1-run', 'n2-run'),
					{ at: 400, do: 'move', el: 'hl', to: 'ln-5', dur: 700 },
					{ at: 900, do: 'enter', el: 'lb-steps' },
					{ at: 1900, do: 'pulse', el: 'lb-steps' },
					{ at: 2600, do: 'pulse', el: 'ea-5' },
					{ at: read.start(1) + 100, do: 'enter', el: 'k1-on' },
					{ at: read.start(1) + 200, do: 'draw', el: 'rd-1', dur: 700 },
					{ at: read.start(1) + 300, do: 'move', el: 'pa', to: 'a-obj1', dur: 800 },
					{ at: read.start(1) + 1200, do: 'pulse', el: 'v-0' },
					{ at: read.start(1) + 1500, do: 'move', el: 'pa', to: 'a-st1', dur: 800 },
					{ at: read.start(1) + 2300, do: 'enter', el: 'l1-0' },
					{ at: read.start(2) + 100, do: 'enter', el: 'k2-on' },
					{ at: read.start(2) + 200, do: 'draw', el: 'rd-2', dur: 700 },
					{ at: read.start(2) + 300, do: 'move', el: 'pb', to: 'a-obj2', dur: 800 },
					{ at: read.start(2) + 1200, do: 'pulse', el: 'v-0' },
					{ at: read.start(2) + 1500, do: 'move', el: 'pb', to: 'a-st2', dur: 800 },
					{ at: read.start(2) + 2300, do: 'enter', el: 'l2-0' },
					{ at: read.start(2) + 2800, do: 'pulse', el: 'l1-0' },
					{ at: read.start(2) + 3100, do: 'pulse', el: 'l2-0' },
				),
			},
		},

		// ─── Scene 3. Race condition: the second write erases the first ─────
		{
			id: 'lost',
			chapter: 'race',
			scene: 'journey',
			title: { es: 'Una actualización perdida', en: 'A lost update' },
			subtitles: lost.list,
			motion: {
				cues: seq(
					...clear(100, 'rd-1', 'rd-2'),
					...swap(300, 'l1-0', 'l1-1'),
					...swap(900, 'l2-0', 'l2-1'),
					{ at: 1700, do: 'pulse', el: 'l1-1' },
					{ at: 2000, do: 'pulse', el: 'l2-1' },
					{ at: lost.start(1) + 100, do: 'draw', el: 'wr-1', dur: 700 },
					{ at: lost.start(1) + 200, do: 'move', el: 'pa', to: 'a-obj1', dur: 800 },
					...swap(lost.start(1) + 1000, 'v-0', 'v-1'),
					{ at: lost.start(1) + 1500, do: 'move', el: 'pa', to: 'a-st1', dur: 700 },
					{ at: lost.start(1) + 2300, do: 'draw', el: 'wr-2', dur: 700 },
					{ at: lost.start(1) + 2400, do: 'move', el: 'pb', to: 'a-obj2', dur: 800 },
					...swap(lost.start(1) + 3200, 'v-1', 'v-lost'),
					{ at: lost.start(1) + 3600, do: 'enter', el: 'hx-5' },
					{ at: lost.start(1) + 3700, do: 'move', el: 'pb', to: 'a-st2', dur: 700 },
					{ at: lost.start(1) + 4000, do: 'pulse', el: 'obj' },
					...swap(lost.start(2) + 100, 'lb-steps', 'lb-lost'),
					{ at: lost.start(2) + 1000, do: 'flow', el: 'wr-2' },
					{ at: lost.start(2) + 1200, do: 'pulse', el: 'v-lost' },
					{ at: lost.start(2) + 2000, do: 'pulse', el: 'lb-lost' },
				),
			},
		},

		// ─── Scene 4. synchronized: thread 2 waits for the lock ─────────────
		{
			id: 'lock',
			chapter: 'sync',
			scene: 'journey',
			title: { es: 'El cerrojo de synchronized', en: 'The synchronized lock' },
			subtitles: lock.list,
			motion: {
				cues: seq(
					shot(0, 'shot-race', 1600),
					...clear(100, 'lb-lost', 'l1-1', 'l2-1', 'wr-1', 'wr-2', 'hx-5', 'k1-on', 'k2-on'),
					...swap(200, 'v-lost', 'v-0'),
					{ at: 500, do: 'move', el: 'hl', to: 'ln-4', dur: 600 },
					{ at: 700, do: 'exit', el: 'ea-4', dur: 300 },
					{ at: 1000, do: 'type', el: 'eb-4', dur: 900 },
					{ at: 1900, do: 'enter', el: 'hv-4' },
					{ at: 2100, do: 'exit', el: 'ea-5', dur: 300 },
					{ at: 2400, do: 'type', el: 'eb-5', dur: 700 },
					{ at: lock.start(1) + 100, do: 'enter', el: 'lock' },
					{ at: lock.start(1) + 500, do: 'move', el: 'pa', to: 'a-obj1', dur: 800 },
					{ at: lock.start(1) + 1300, do: 'enter', el: 'k1-v' },
					{ at: lock.start(1) + 1400, do: 'enter', el: 'lb-own1' },
					{ at: lock.start(1) + 2000, do: 'pulse', el: 'lock' },
					{ at: lock.start(2) + 100, do: 'move', el: 'pb', to: 'a-wait2', dur: 800 },
					{ at: lock.start(2) + 1000, do: 'enter', el: 'l2-wait' },
					{ at: lock.start(2) + 1500, do: 'pulse', el: 'l2-wait' },
				),
			},
		},

		// ─── Scene 4. synchronized: one thread at a time ────────────────────
		{
			id: 'serial',
			chapter: 'sync',
			scene: 'journey',
			title: { es: 'Un hilo a la vez', en: 'One thread at a time' },
			subtitles: serial.list,
			motion: {
				cues: seq(
					{ at: 100, do: 'enter', el: 's1-rw' },
					{ at: 300, do: 'draw', el: 'sy-1', dur: 700 },
					...swap(1000, 'v-0', 'v-s1'),
					{ at: 1700, do: 'move', el: 'pa', to: 'a-st1', dur: 800 },
					{ at: 2500, do: 'exit', el: 'k1-v', dur: 300 },
					{ at: 2500, do: 'exit', el: 'lb-own1', dur: 300 },
					{ at: 2700, do: 'pulse', el: 'lock' },
					{ at: serial.start(1) + 100, do: 'move', el: 'pb', to: 'a-obj2', dur: 800 },
					{ at: serial.start(1) + 300, do: 'exit', el: 'l2-wait', dur: 300 },
					{ at: serial.start(1) + 900, do: 'enter', el: 'k2-v' },
					{ at: serial.start(1) + 1000, do: 'enter', el: 'lb-own2' },
					{ at: serial.start(1) + 1100, do: 'enter', el: 's2-rw' },
					{ at: serial.start(1) + 1300, do: 'draw', el: 'sy-2', dur: 700 },
					...swap(serial.start(1) + 2000, 'v-s1', 'v-s2'),
					{ at: serial.start(1) + 2700, do: 'move', el: 'pb', to: 'a-st2', dur: 800 },
					{ at: serial.start(1) + 3500, do: 'exit', el: 'k2-v', dur: 300 },
					...swap(serial.start(2), 'lb-own2', 'lb-mutex'),
					{ at: serial.start(2) + 600, do: 'flow', el: 'sy-1' },
					{ at: serial.start(2) + 600, do: 'flow', el: 'sy-2' },
					{ at: serial.start(2) + 900, do: 'pulse', el: 'v-s2' },
				),
			},
		},

		// ─── Scene 5. A thread pool reuses its workers ──────────────────────
		{
			id: 'pool',
			chapter: 'pool',
			scene: 'journey',
			title: { es: 'ExecutorService: un pool de hilos', en: 'ExecutorService: a thread pool' },
			subtitles: pool.list,
			motion: {
				cues: seq(
					...clear(0, 'pa', 'pb', 'st1', 'st2', 's1-rw', 's2-rw', 'sy-1', 'sy-2', 'sp-1', 'sp-2', 'lb-mutex', 'v-s2'),
					...clear(0, 'ea', 'eb-4', 'eb-5', 'hv-4', 'hl', 'm-t1', 'm-t2', 'm-s1', 'm-s2', 't1-on', 't2-on', 's1-on', 's2-on'),
					shot(100, 'shot-pool', 2000),
					{ at: 300, do: 'exit', el: 'fa', dur: 300 },
					{ at: 500, do: 'enter', el: 'fc' },
					{ at: 500, do: 'enter', el: 'ec' },
					...typeLines(600, 'ec', 1, 20, 100),
					{ at: 700, do: 'enter', el: 'v-0' },
					{ at: 900, do: 'enter', el: 'm-pool' },
					{ at: 1000, do: 'enter', el: 'm-submit' },
					{ at: 1100, do: 'enter', el: 'm-shut' },
					{ at: 1200, do: 'enter', el: 'm-print' },
					{ at: 1300, do: 'move', el: 'p', to: 'a-pool', dur: 1 },
					{ at: 1300, do: 'move', el: 'hl', to: 'ln-12', dur: 1 },
					{ at: 1500, do: 'enter', el: 'p' },
					{ at: 1500, do: 'enter', el: 'hl' },
					{ at: 1700, do: 'enter', el: 'pool-on' },
					{ at: 1900, do: 'enter', el: 'floor-pool' },
					{ at: 2100, do: 'enter', el: 'w1' },
					{ at: 2200, do: 'enter', el: 'w2' },
					{ at: 2200, do: 'enter', el: 'lb-pool' },
					{ at: 2600, do: 'pulse', el: 'w1' },
					{ at: 2900, do: 'pulse', el: 'w2' },
					{ at: P, do: 'move', el: 'p', to: 'a-submit', dur: 600 },
					{ at: P, do: 'move', el: 'hl', to: 'ln-14', dur: 500 },
					{ at: P + 600, do: 'enter', el: 'submit-on' },
					{ at: P + 600, do: 'enter', el: 'tk1' },
					{ at: P + 700, do: 'enter', el: 'tk2' },
					{ at: P + 800, do: 'enter', el: 'tk3' },
					{ at: P + 900, do: 'enter', el: 'tk4' },
					...swap(P + 900, 'lb-pool', 'lb-reuse'),
					{ at: P + 1100, do: 'move', el: 'tk1', to: 'a-w1', dur: 600 },
					{ at: P + 1300, do: 'move', el: 'tk2', to: 'a-w2', dur: 600 },
					{ at: P + 1700, do: 'enter', el: 'w1-on' },
					{ at: P + 1800, do: 'draw', el: 'pw-1', dur: 500 },
					{ at: P + 1900, do: 'enter', el: 'w2-on' },
					{ at: P + 2000, do: 'draw', el: 'pw-2', dur: 500 },
					{ at: P + 2000, do: 'move', el: 'tk1', to: 'a-objp', dur: 600 },
					{ at: P + 2600, do: 'exit', el: 'tk1', dur: 250 },
					...swap(P + 2600, 'v-0', 'v-p1'),
					{ at: P + 2700, do: 'move', el: 'tk3', to: 'a-w1', dur: 500 },
					{ at: P + 3000, do: 'move', el: 'tk2', to: 'a-objp', dur: 600 },
					{ at: P + 3600, do: 'exit', el: 'tk2', dur: 250 },
					...swap(P + 3600, 'v-p1', 'v-p2'),
					{ at: P + 3700, do: 'move', el: 'tk4', to: 'a-w2', dur: 500 },
					{ at: P + 4000, do: 'move', el: 'tk3', to: 'a-objp', dur: 600 },
					{ at: P + 4600, do: 'exit', el: 'tk3', dur: 250 },
					...swap(P + 4600, 'v-p2', 'v-p3'),
					{ at: P + 5000, do: 'move', el: 'tk4', to: 'a-objp', dur: 600 },
					{ at: P + 5600, do: 'exit', el: 'tk4', dur: 250 },
					...swap(P + 5600, 'v-p3', 'v-p4'),
					{ at: P + 6100, do: 'exit', el: 'w1-on', dur: 300 },
					{ at: P + 6100, do: 'exit', el: 'w2-on', dur: 300 },
					{ at: pool.start(2) + 100, do: 'move', el: 'p', to: 'a-shut', dur: 600 },
					{ at: pool.start(2) + 100, do: 'move', el: 'hl', to: 'ln-16', dur: 500 },
					{ at: pool.start(2) + 700, do: 'enter', el: 'shut-on' },
					...swap(pool.start(2) + 700, 'lb-reuse', 'lb-shut'),
					{ at: pool.start(2) + 1300, do: 'flow', el: 'pw-1' },
					{ at: pool.start(2) + 1300, do: 'flow', el: 'pw-2' },
					{ at: pool.start(2) + 1900, do: 'move', el: 'p', to: 'a-print', dur: 600 },
					{ at: pool.start(2) + 1900, do: 'move', el: 'hl', to: 'ln-18', dur: 500 },
					{ at: pool.start(2) + 2500, do: 'enter', el: 'print-on' },
					{ at: pool.start(2) + 2700, do: 'type', el: 'out-c', dur: 400 },
					{ at: pool.start(2) + 3200, do: 'pulse', el: 'v-p4' },
				),
			},
		},

		// ─── Scene 6. Threads, lock and pool ────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'Compartir sin perder datos', en: 'Sharing without losing data' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'lb-shut', 'pool-on', 'submit-on', 'shut-on', 'print-on'),
					shot(200, 'shot-all', 3000),
					{ at: 600, do: 'enter', el: 'st1' },
					{ at: 700, do: 'enter', el: 'st2' },
					{ at: 1200, do: 'enter', el: 'r-race' },
					{ at: 2000, do: 'pulse', el: 'r-race' },
					{ at: 2600, do: 'pulse', el: 'obj' },
					{ at: recap.start(1) + 200, do: 'enter', el: 'r-lock' },
					{ at: recap.start(1) + 700, do: 'pulse', el: 'lock' },
					{ at: recap.start(1) + 1300, do: 'enter', el: 'r-pool' },
					{ at: recap.start(1) + 1900, do: 'pulse', el: 'w1' },
					{ at: recap.start(1) + 2200, do: 'pulse', el: 'w2' },
					{ at: recap.start(1) + 2800, do: 'pulse', el: 'v-p4' },
				),
			},
		},
	],
};
