import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Two threads, one counter": a short film (about two minutes) for the C lesson
// "Concurrencia: threads y atomics" (`concurrencia-threads-y-atomics`). It plays on a
// single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/hilos-atomics-c.astro`): an isometric floor with two parallel
// tracks, one per thread, that fork from `main` and merge at `pthread_join`, and one shared
// cell between them, the counter. `contador++` is three modules per track (read, add,
// write); the mutex is one key and a gate, the atomic is one indivisible module. The
// threads are light blue particles (the execution flow), magenta marks the problem (the
// lost update, the deadlock) and violet what protects the counter. The lesson's program is
// drawn inside the canvas (an editor whose bar slides to the running line), so every step
// is a motion step and the cues keep both halves in sync.
//
// Editor lines (the component builds the same programs, see `programs` there):
//   v0 unprotected: 4 counter, 9 counter++, 16/17 pthread_create, 18/19 pthread_join, 20 printf
//   v1 mutex:       10 lock, 11 counter++, 12 unlock, 19/20 create, 21/22 join, 23 printf
//   v2 atomic:      10 atomic_fetch_add, 17/18 create, 19/20 join, 21 printf
//   v3 / v4 the two-lock fragment: 2 and 3 thread A, 6 and 7 thread B

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

// Small builders so the timelines below read like a storyboard.
const enter = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'enter', el }));
const leave = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit', el, dur: 300 }));
const pulse = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'pulse', el }));
const draw = (at: number, dur: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'draw', el, dur }));
const type = (at: number, el: string, dur: number): MotionCue => ({ at, do: 'type', el, dur });
const go = (at: number, el: string, to: string, dur: number): MotionCue => ({ at, do: 'move', el, to, dur });
/** Places a particle without showing the trip: it exits, jumps and comes back. */
const warp = (at: number, el: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el, dur: 250 },
	{ at: at + 300, do: 'move', el, to, dur: 1 },
	{ at: at + 400, do: 'enter', el },
];
/** Slides the editor bar to a line of the program on screen. */
const bar = (at: number, line: number, dur = 600): MotionCue => go(at, 'hl', `ln-${line}`, dur);
/** A module and the line number it carries. */
const show = (at: number, ...ids: string[]): MotionCue[] => ids.flatMap((id) => enter(at, `st-${id}`, `nm-${id}`));
const hide = (at: number, ...ids: string[]): MotionCue[] => ids.flatMap((id) => leave(at, `st-${id}`, `nm-${id}`, `on-${id}`));
const lit = (at: number, ...ids: string[]): MotionCue[] => ids.flatMap((id) => [...enter(at, `on-${id}`), ...pulse(at, `st-${id}`)]);
const unlit = (at: number, ...ids: string[]): MotionCue[] => ids.flatMap((id) => leave(at, `on-${id}`));
/** The module numbers change when the editor swaps to another shape of the program. */
const renumber = (at: number, from: string, to: string, ...ids: string[]): MotionCue[] =>
	ids.flatMap((id) => [{ at, do: 'exit', el: `nm-${id}-${from}`, dur: 250 } as MotionCue, ...enter(at, `nm-${id}-${to}`)]);
/** Swaps the program in the editor. */
const swap = (at: number, from: string, to: string): MotionCue[] => [...leave(at, `ed-${from}`), ...enter(at + 100, `ed-${to}`)];

const MAIN = ['ca', 'cb', 'ja', 'jb', 'pr'];
const STATIONS = ['la', 'sa', 'ea', 'lb', 'sb', 'eb'];
const GATES = ['gia', 'gib', 'goa', 'gob'];

// ─── Captions ───────────────────────────────────────────────────────────────
const threads = timed(
	say('Este programa crea dos hilos: `main` lanza el hilo A y el hilo B.', 'This program creates two threads: `main` launches thread A and thread B.'),
	say('Cada hilo es una pista propia; ambos comparten una sola memoria: `contador`.', 'Each thread is a track of its own; both share a single memory cell: `counter`.'),
	say('Usamos POSIX `pthread`; `<threads.h>` de C11 es opcional.', 'We use POSIX `pthread`; C11 `<threads.h>` is optional.'),
);
const steps3 = timed(
	say('`contador++` parece un solo paso, pero son tres: leer, sumar 1 y escribir.', '`counter++` looks like one step, but it is three: read, add 1 and write.'),
	say('Entre un paso y otro, el otro hilo puede intervenir.', 'Between one step and the next, the other thread can step in.'),
);
const lost = timed(
	say('Supongamos que `contador` vale 41 y ambos hilos leen a la vez: los dos ven 41.', 'Say `counter` is 41 and both threads read it at once: both see 41.'),
	say('Los dos suman 1 y los dos escriben 42: dos incrementos, pero el contador subió uno.', 'Both add 1 and both write 42: two increments, but the counter went up by one.'),
);
const race = timed(
	say('Con un millón de incrementos por hilo, el resultado queda por debajo de 2 000 000.', 'With a million increments per thread, the result falls below 2,000,000.'),
	say('Es una condición de carrera; y sin sincronizar, una carrera de datos: comportamiento indefinido.', 'It is a race condition; and without synchronization, a data race: undefined behavior.'),
);
const gate = timed(
	say('Un mutex es una puerta: solo un hilo a la vez puede entrar a la sección crítica.', 'A mutex is a gate: only one thread at a time can enter the critical section.'),
	say('El otro espera hasta que se suelta el candado; así siempre imprime 2 000 000.', 'The other one waits until the lock is released; so it always prints 2,000,000.'),
);
const atomic = timed(
	say('Una operación atómica es un solo paso indivisible: nadie ve un estado intermedio.', 'An atomic operation is one indivisible step: nobody sees an intermediate state.'),
	say('`atomic_fetch_add` lee, suma y escribe de una vez: sin mutex, siempre 2 000 000.', '`atomic_fetch_add` reads, adds and writes at once: no mutex, always 2,000,000.'),
);
const joined = timed(
	say('`pthread_join` hace que `main` espere a que cada hilo termine.', '`pthread_join` makes `main` wait for each thread to finish.'),
	say('Solo después lee `contador`: ya están todas las escrituras.', 'Only then does it read `counter`: every write is already there.'),
);
const dead = timed(
	say('Dos candados en orden opuesto pueden provocar un interbloqueo.', 'Two locks in opposite order can cause a deadlock.'),
	say('A espera la `cuenta_b`; B espera la `cuenta_a`: nadie avanza nunca.', 'A waits for `account_b`; B waits for `account_a`: nobody ever moves.'),
	say('La regla: todos toman los candados siempre en el mismo orden.', 'The rule: everyone always takes the locks in the same order.'),
);
const wrap = timed(
	say('Compartir memoria exige protegerla: con un mutex o con un atómico.', 'Shared memory needs protection: a mutex or an atomic.'),
	say('Y esperar a los hilos con `join` antes de leer el resultado.', 'And wait for the threads with `join` before reading the result.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'threads', label: { es: 'Dos hilos, una memoria', en: 'Two threads, one memory' } },
		{ id: 'race', label: { es: 'La condición de carrera', en: 'The race condition' } },
		{ id: 'mutex', label: { es: 'El mutex: una puerta', en: 'The mutex: a gate' } },
		{ id: 'atomic', label: { es: 'Atómico: un solo paso', en: 'Atomic: one step' } },
		{ id: 'join', label: { es: 'join: esperar a los hilos', en: 'join: waiting for the threads' } },
		{ id: 'deadlock', label: { es: 'El interbloqueo', en: 'The deadlock' } },
	],
	steps: [
		// ─── Scene 1. Two threads, one memory ───────────────────────────────
		{
			id: 'threads',
			chapter: 'threads',
			scene: 'journey',
			title: { es: 'Dos hilos y una sola memoria', en: 'Two threads and a single memory' },
			subtitles: threads.list,
			motion: {
				cues: seq(
					shot(0, 'shot-lanes', 1),
					enter(0, 'floor'),
					Array.from({ length: 22 }, (_, index) => type(100 + index * 130, `e0-${index + 1}`, 260)),
					draw(300, 800, 'fk'),
					draw(700, 1000, 'lane-a', 'lane-b'),
					draw(1200, 800, 'jn'),
					enter(1600, 'cell'),
					enter(1800, 'v-0'),
					show(2000, 'ca'),
					show(2150, 'cb'),
					show(2300, 'la', 'lb'),
					show(2400, 'sa', 'sb'),
					show(2500, 'ea', 'eb'),
					show(2700, 'ja'),
					show(2800, 'jb'),
					show(2900, 'pr'),
					enter(3200, 'hl', 'pm'),
					bar(3400, 16, 700),
					go(3400, 'pm', 'a-f', 900),
					go(4400, 'pm', 'a-ca', 800),
					lit(5200, 'ca'),
					enter(5200, 'pa'),
					bar(5300, 17, 600),
					go(5300, 'pm', 'a-cb', 800),
					lit(6100, 'cb'),
					enter(6100, 'pb'),
					unlit(6600, 'ca', 'cb'),
					go(6300, 'pm', 'a-jw', 1500),
					{ at: 6600, do: 'flow', el: 'lane-a' },
					{ at: 6600, do: 'flow', el: 'lane-b' },
					go(6800, 'pa', 'a-la', 1400),
					go(6800, 'pb', 'a-lb', 1400),
					enter(7000, 'lb-loop-a', 'lb-loop-b'),
					shot(7000, 'shot-cell', 2400),
					bar(8700, 4, 600),
					pulse(8800, 'cell'),
					shot(threads.start(2), 'shot-lanes', 2200),
					bar(threads.start(2) + 200, 2, 600),
					type(threads.start(2) + 500, 'o-cc', 1500),
				),
			},
		},

		// ─── Scene 2. contador++ is three steps ─────────────────────────────
		{
			id: 'steps',
			chapter: 'race',
			scene: 'journey',
			title: { es: 'contador++ son tres pasos', en: 'counter++ is three steps' },
			subtitles: steps3.list,
			motion: {
				cues: seq(
					shot(0, 'shot-cell', 1800),
					leave(0, 'lb-loop-a', 'lb-loop-b', 'v-0'),
					enter(300, 'v-41'),
					bar(200, 9, 600),
					lit(800, 'la'),
					draw(800, 700, 'rd-a'),
					enter(1500, 'ca-41'),
					go(2300, 'pa', 'a-sa', 800),
					unlit(3100, 'la'),
					lit(3100, 'sa'),
					leave(3200, 'ca-41'),
					enter(3300, 'ca-42'),
					go(3900, 'pa', 'a-ea', 800),
					unlit(4700, 'sa'),
					lit(4700, 'ea'),
					draw(4700, 700, 'wr-a'),
					leave(5300, 'v-41'),
					enter(5400, 'v-42'),
					pulse(5400, 'cell'),
					lit(steps3.start(1) + 500, 'lb'),
					pulse(steps3.start(1) + 500, 'pb'),
					pulse(steps3.start(1) + 1600, 'st-lb', 'pb'),
				),
			},
		},

		// ─── Scene 3. The interleaving loses an update ──────────────────────
		{
			id: 'lost',
			chapter: 'race',
			scene: 'journey',
			title: { es: 'Los hilos se intercalan', en: 'The threads interleave' },
			subtitles: lost.list,
			motion: {
				cues: seq(
					// The one-thread walk is cleared before both threads run together.
					unlit(0, 'ea', 'lb'),
					leave(0, 'ca-42', 'rd-a', 'wr-a', 'v-42'),
					warp(0, 'pa', 'a-la'),
					enter(600, 'v-41'),
					bar(800, 9, 600),
					draw(1200, 700, 'rd-a', 'rd-b'),
					lit(1200, 'la', 'lb'),
					enter(1900, 'ca-41', 'cb-41'),
					go(lost.start(1), 'pa', 'a-sa', 800),
					go(lost.start(1), 'pb', 'a-sb', 800),
					unlit(lost.start(1) + 800, 'la', 'lb'),
					lit(lost.start(1) + 800, 'sa', 'sb'),
					leave(lost.start(1) + 800, 'ca-41', 'cb-41'),
					enter(lost.start(1) + 900, 'ca-42', 'cb-42'),
					go(lost.start(1) + 1800, 'pa', 'a-ea', 800),
					go(lost.start(1) + 1800, 'pb', 'a-eb', 800),
					unlit(lost.start(1) + 2600, 'sa', 'sb'),
					lit(lost.start(1) + 2600, 'ea', 'eb'),
					draw(lost.start(1) + 3000, 600, 'wr-a'),
					leave(lost.start(1) + 3300, 'v-41'),
					enter(lost.start(1) + 3400, 'v-42'),
					pulse(lost.start(1) + 3400, 'cell'),
					draw(lost.start(1) + 3600, 600, 'wr-b'),
					pulse(lost.start(1) + 4200, 'cell'),
					enter(lost.start(1) + 4500, 'cell-bad', 'lb-lost'),
				),
			},
		},

		// ─── Scene 4. A race condition: many updates lost ───────────────────
		{
			id: 'race',
			chapter: 'race',
			scene: 'journey',
			title: { es: 'Una condición de carrera', en: 'A race condition' },
			subtitles: race.list,
			motion: {
				cues: seq(
					unlit(0, 'ea', 'eb'),
					leave(0, 'ca-42', 'cb-42', 'rd-a', 'rd-b', 'wr-a', 'wr-b', 'lb-lost', 'v-42'),
					shot(100, 'shot-join', 2400),
					go(300, 'pa', 'a-ja', 2000),
					go(300, 'pb', 'a-jb', 2200),
					lit(2600, 'ja', 'jb'),
					bar(3000, 20, 600),
					go(3000, 'pm', 'a-pr', 1200),
					lit(4300, 'pr'),
					type(4300, 'o-b1', 500),
					type(4900, 'o-b2', 700),
					enter(5000, 'res-bad'),
					type(race.start(1), 'o-b3', 500),
					type(race.start(1) + 600, 'o-b4', 700),
					shot(race.start(1) + 1200, 'shot-cell', 2400),
					enter(race.start(1) + 1800, 'cell-bad', 'lb-ub'),
					pulse(race.start(1) + 2600, 'cell'),
				),
			},
		},

		// ─── Scene 5. The mutex: one key, one gate ──────────────────────────
		{
			id: 'mutex',
			chapter: 'mutex',
			scene: 'journey',
			title: { es: 'Un mutex protege la sección crítica', en: 'A mutex protects the critical section' },
			subtitles: gate.list,
			motion: {
				cues: seq(
					swap(0, 'v0', 'v1'),
					renumber(0, 'v0', 'v1', ...MAIN, ...STATIONS),
					leave(0, 'o-b1', 'o-b2', 'o-b3', 'o-b4', 'res-bad', 'lb-ub', 'cell-bad', 'pm'),
					unlit(0, 'ja', 'jb', 'pr', 'ea', 'eb'),
					warp(0, 'pa', 'a-gia'),
					warp(0, 'pb', 'a-gib'),
					shot(0, 'shot-cell', 2000),
					show(300, 'gia'),
					show(400, 'gib'),
					show(500, 'goa'),
					show(600, 'gob'),
					enter(800, 'zone-a', 'zone-b'),
					enter(1100, 'lb-crit'),
					enter(1400, 'key'),
					bar(1500, 10, 600),
					go(2800, 'key', 'a-kia', 900),
					lit(3700, 'gia'),
					go(3700, 'pa', 'a-la', 800),
					enter(3700, 'wt-b'),
					bar(4500, 11, 500),
					unlit(4500, 'gia'),
					go(4500, 'pa', 'a-sa', 700),
					go(4500, 'key', 'a-ksa', 700),
					go(5300, 'pa', 'a-ea', 700),
					bar(gate.start(1), 12, 500),
					go(gate.start(1), 'pa', 'a-goa', 700),
					go(gate.start(1), 'key', 'a-key', 900),
					lit(gate.start(1) + 700, 'goa'),
					go(gate.start(1) + 1000, 'key', 'a-kib', 900),
					leave(gate.start(1) + 1000, 'wt-b'),
					bar(gate.start(1) + 1100, 10, 500),
					lit(gate.start(1) + 1900, 'gib'),
					bar(gate.start(1) + 1900, 11, 500),
					go(gate.start(1) + 1900, 'pb', 'a-sb', 1100),
					go(gate.start(1) + 1900, 'key', 'a-ksb', 1100),
					bar(gate.start(1) + 3100, 12, 500),
					go(gate.start(1) + 3100, 'pb', 'a-gob', 800),
					go(gate.start(1) + 3100, 'key', 'a-key', 900),
					lit(gate.start(1) + 3900, 'gob'),
					type(gate.start(1) + 4100, 'o-m1', 500),
					type(gate.start(1) + 4700, 'o-m2', 700),
					pulse(gate.start(1) + 4700, 'st-pr'),
				),
			},
		},

		// ─── Scene 6. The atomic: one indivisible step ──────────────────────
		{
			id: 'atomic',
			chapter: 'atomic',
			scene: 'journey',
			title: { es: 'Una operación atómica', en: 'An atomic operation' },
			subtitles: atomic.list,
			motion: {
				cues: seq(
					swap(0, 'v1', 'v2'),
					renumber(0, 'v1', 'v2', ...MAIN),
					leave(0, 'o-m1', 'o-m2', 'key', 'wt-b', 'zone-a', 'zone-b', 'lb-crit', 'pa', 'pb'),
					hide(0, ...GATES, ...STATIONS),
					unlit(0, 'goa', 'gob'),
					shot(0, 'shot-cell', 1500),
					move(400, 'pa', 'a-gia'),
					move(400, 'pb', 'a-gib'),
					show(600, 'xa'),
					show(700, 'xb'),
					enter(900, 'pa', 'pb'),
					enter(1000, 'v-41'),
					bar(1000, 10, 600),
					go(1600, 'pa', 'a-xa', 1000),
					draw(2600, 500, 'rd-a', 'wr-a'),
					lit(2600, 'xa'),
					leave(2700, 'v-41'),
					enter(2800, 'v-42'),
					pulse(2800, 'cell'),
					go(3000, 'pb', 'a-xb', 1000),
					draw(4000, 500, 'rd-b', 'wr-b'),
					lit(4000, 'xb'),
					leave(4100, 'v-42'),
					enter(4200, 'v-43'),
					pulse(4200, 'cell'),
					enter(atomic.start(1) + 200, 'lb-atomic'),
					type(atomic.start(1) + 3600, 'o-a1', 500),
					type(atomic.start(1) + 4200, 'o-a2', 700),
					pulse(atomic.start(1) + 4200, 'st-pr'),
				),
			},
		},

		// ─── Scene 7. join: main waits for both threads ─────────────────────
		{
			id: 'join',
			chapter: 'join',
			scene: 'journey',
			title: { es: 'join: esperar a los hilos', en: 'join: waiting for the threads' },
			subtitles: joined.list,
			motion: {
				cues: seq(
					leave(0, 'o-a1', 'o-a2', 'lb-atomic', 'rd-a', 'wr-a', 'rd-b', 'wr-b'),
					unlit(0, 'xa', 'xb'),
					shot(0, 'shot-join', 2400),
					move(0, 'pm', 'a-jw'),
					enter(100, 'pm'),
					enter(500, 'wt-main'),
					bar(400, 19, 600),
					go(700, 'pa', 'a-ja', 2200),
					lit(2900, 'ja'),
					go(3000, 'pm', 'a-jb', 900),
					bar(3000, 20, 500),
					go(3000, 'pb', 'a-jb', 1600),
					lit(4700, 'jb'),
					go(joined.start(1), 'pm', 'a-pr', 1100),
					leave(joined.start(1), 'wt-main'),
					bar(joined.start(1), 21, 500),
					lit(joined.start(1) + 1200, 'pr'),
					type(joined.start(1) + 1200, 'o-j1', 500),
					type(joined.start(1) + 1800, 'o-j2', 700),
					enter(joined.start(1) + 2000, 'res-ok', 'cell-ok'),
				),
			},
		},

		// ─── Scene 8. Deadlock: two locks in opposite order ─────────────────
		{
			id: 'deadlock',
			chapter: 'deadlock',
			scene: 'journey',
			title: { es: 'Dos candados en orden opuesto', en: 'Two locks in opposite order' },
			subtitles: dead.list,
			motion: {
				cues: seq(
					swap(0, 'v2', 'v3'),
					leave(0, 'file-main'),
					enter(100, 'file-dl'),
					shot(0, 'shot-dl', 2800),
					enter(300, 'dl-floor'),
					enter(600, 'dl-a'),
					enter(800, 'dl-b'),
					go(1400, 'pa', 'a-dla', 1800),
					go(1400, 'pb', 'a-dlb', 1800),
					bar(3200, 2, 600),
					enter(3300, 'dl-ka'),
					pulse(3300, 'dl-ka'),
					bar(3900, 6, 600),
					enter(4000, 'dl-kb'),
					pulse(4000, 'dl-kb'),
					bar(dead.start(1), 3, 600),
					draw(dead.start(1) + 300, 900, 'dl-ab'),
					bar(dead.start(1) + 1600, 7, 600),
					draw(dead.start(1) + 1700, 900, 'dl-ba'),
					enter(dead.start(1) + 3000, 'lb-dead'),
					pulse(dead.start(1) + 3000, 'pa', 'pb'),
					swap(dead.start(2), 'v3', 'v4'),
					leave(dead.start(2), 'dl-ab', 'dl-ba', 'lb-dead'),
					bar(dead.start(2), 6, 600),
					go(dead.start(2) + 500, 'pb', 'a-dla2', 900),
					bar(dead.start(2) + 1300, 3, 600),
					draw(dead.start(2) + 1400, 900, 'dl-ok'),
					enter(dead.start(2) + 2600, 'lb-order'),
				),
			},
		},

		// ─── Scene 9. The whole system ──────────────────────────────────────
		{
			id: 'wrap',
			chapter: 'deadlock',
			scene: 'journey',
			title: { es: 'Memoria compartida, protegida', en: 'Shared memory, protected' },
			subtitles: wrap.list,
			motion: {
				cues: seq(
					swap(0, 'v4', 'v2'),
					leave(0, 'file-dl', 'dl-ok', 'lb-order', 'dl-ka', 'dl-kb', 'dl-a', 'dl-b', 'dl-floor'),
					enter(100, 'file-main'),
					bar(100, 21, 600),
					warp(0, 'pa', 'a-ja'),
					warp(0, 'pb', 'a-jb'),
					shot(300, 'shot-all', 3600),
					enter(1600, 'cell-ok'),
					lit(1800, 'xa', 'xb'),
					lit(wrap.start(1) + 300, 'ja', 'jb', 'pr'),
					pulse(wrap.start(1) + 1200, 'pm', 'pa', 'pb'),
				),
			},
		},
	],
};

/** Moves a particle in one frame, to place it before it appears. */
function move(at: number, el: string, to: string): MotionCue {
	return { at, do: 'move', el, to, dur: 1 };
}
