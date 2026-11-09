import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of an exception": a short film (about two minutes) for the Java lesson
// "Excepciones y manejo de errores". It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/viaje-excepcion-java.astro`):
// an isometric system whose modules are the instructions of `main`, a light blue
// particle that is the execution flow, and a magenta object that is the exception.
// The code is drawn inside the canvas (an editor that highlights the running line),
// so every step is a motion step and the cues below keep both halves in sync.

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
const build = timed(
	say('Este sistema es un programa Java: cada módulo es una instrucción de `main`.', 'This system is a Java program: each module is one instruction of `main`.'),
	say('El `try` rodea lo que podría fallar. El `catch` espera a un costado.', 'The `try` wraps what might fail. The `catch` waits to one side.'),
);
const run = timed(
	say('La partícula celeste es el flujo de ejecución: avanza en orden.', 'The light blue particle is the execution flow: it advances in order.'),
	say('Imprime "Inicio", divide 10 entre 2 y muestra el resultado: 5.', 'It prints "Start", divides 10 by 2 and shows the result: 5.'),
	say('Sin situaciones excepcionales, el flujo es normal y el `catch` no se usa.', 'With nothing exceptional, the flow is normal and the `catch` is not used.'),
);
const thrown = timed(
	say('Ahora la operación intenta dividir por cero. No puede completarse.', 'Now the operation tries to divide by zero. It cannot be completed.'),
	say('Java crea un objeto: una instancia de `ArithmeticException`.', 'Java creates an object: an instance of `ArithmeticException`.'),
	say('El flujo normal se interrumpe: el resto del `try` no se ejecuta.', 'The normal flow is interrupted: the rest of the `try` does not run.'),
);
const calls = timed(
	say('Ahora la operación está en otro método: `main()` llama a `procesar()`…', 'Now the operation lives in another method: `main()` calls `process()`…'),
	say('…y `procesar()` llama a `calcular()`. La pila de llamadas registra ese camino.', '…and `process()` calls `calculate()`. The call stack records that path.'),
);
const propagate = timed(
	say('La excepción se produce en `calcular()`. No hay `catch`: Java abandona ese método.', 'The exception is raised in `calculate()`. No `catch`: Java abandons that method.'),
	say('Sube a `procesar()`, que tampoco la maneja: también se abandona.', 'It moves up to `process()`, which does not handle it either: abandoned too.'),
	say('Así se propaga por la pila de llamadas hasta llegar a `main()`.', 'That is how it propagates through the call stack until it reaches `main()`.'),
);
const caught = timed(
	say('En `main()`, la llamada estaba dentro de un `try` con un `catch` compatible.', 'In `main()`, the call was inside a `try` with a compatible `catch`.'),
	say('El `catch` reconoce el tipo `ArithmeticException` y captura el objeto.', 'The `catch` recognizes the `ArithmeticException` type and captures the object.'),
	say('Se ejecutan sus instrucciones. El programa no vuelve a la línea que falló.', 'Its instructions run. The program does not go back to the line that failed.'),
);
const lastly = timed(
	say('Al terminar el `catch`, la ejecución pasa por el bloque `finally`.', 'When the `catch` ends, execution goes through the `finally` block.'),
	say('Es la ruta de finalización: se ejecuta con excepción o sin ella.', 'It is the completion route: it runs with or without an exception.'),
);
const resume = timed(
	say('La excepción fue manejada: el programa continúa después del `try-catch-finally`.', 'The exception was handled: the program continues after the `try-catch-finally`.'),
	say('Una excepción modifica el flujo normal de ejecución…', 'An exception changes the normal flow of execution…'),
	say('…pero Java nos proporciona mecanismos para gestionarla y construir programas más robustos.', '…but Java gives us mechanisms to manage it and build more robust programs.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'normal', label: { es: 'El programa está funcionando', en: 'The program is running' } },
		{ id: 'throw', label: { es: 'Aparece una excepción', en: 'An exception appears' } },
		{ id: 'stack', label: { es: 'La pila de llamadas', en: 'The call stack' } },
		{ id: 'catch', label: { es: 'El encuentro con catch', en: 'Meeting the catch' } },
		{ id: 'finally', label: { es: 'El bloque finally', en: 'The finally block' } },
		{ id: 'resume', label: { es: 'El programa continúa', en: 'The program continues' } },
	],
	steps: [
		// ─── Scene 1. The program is running ────────────────────────────────
		{
			id: 'build',
			chapter: 'normal',
			scene: 'journey',
			title: { es: 'Un programa como un sistema de módulos', en: 'A program as a system of modules' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-try', 6500),
					{ at: 200, do: 'enter', el: 'm-entry' },
					{ at: 300, do: 'type', el: 'ea-1', dur: 900 },
					{ at: 1300, do: 'type', el: 'ea-2', dur: 400 },
					{ at: 1900, do: 'type', el: 'ea-3', dur: 800 },
					{ at: 2000, do: 'enter', el: 'm-t1' },
					{ at: 2900, do: 'type', el: 'ea-4', dur: 700 },
					{ at: 3000, do: 'enter', el: 'm-t2' },
					{ at: 3500, do: 'enter', el: 'lb-t2-a' },
					{ at: 3900, do: 'type', el: 'ea-5', dur: 800 },
					{ at: 4000, do: 'enter', el: 'm-t3' },
					{ at: 4600, do: 'draw', el: 'tr-main', dur: 900 },
					{ at: 4900, do: 'enter', el: 'm-end' },
					{ at: build.start(1) + 200, do: 'enter', el: 'try-zone' },
					{ at: build.start(1) + 1000, do: 'pulse', el: 'try-zone' },
					{ at: build.start(1) + 1700, do: 'type', el: 'ea-6', dur: 700 },
					{ at: build.start(1) + 1800, do: 'enter', el: 'm-c' },
					{ at: build.start(1) + 2300, do: 'enter', el: 'lb-c' },
					{ at: build.start(1) + 2400, do: 'draw', el: 'tr-c', dur: 900 },
					{ at: build.start(1) + 2500, do: 'type', el: 'ea-7', dur: 700 },
					{ at: build.start(1) + 3300, do: 'type', el: 'ea-8', dur: 200 },
					{ at: build.start(1) + 3600, do: 'type', el: 'ea-9', dur: 200 },
				),
			},
		},
		{
			id: 'run',
			chapter: 'normal',
			scene: 'journey',
			title: { es: 'El flujo normal de ejecución', en: 'The normal flow of execution' },
			subtitles: run.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'enter', el: 'hl' },
					{ at: 100, do: 'enter', el: 'p' },
					{ at: 700, do: 'draw', el: 'fl-0', dur: 600 },
					{ at: 900, do: 'move', el: 'p', to: 'a-t1', dur: 1000 },
					{ at: 900, do: 'move', el: 'hl', to: 'la-3', dur: 700 },
					{ at: run.start(1), do: 'enter', el: 't1-on' },
					{ at: run.start(1), do: 'pulse', el: 'm-t1' },
					{ at: run.start(1) + 100, do: 'type', el: 'out-a1', dur: 500 },
					{ at: run.start(1) + 900, do: 'draw', el: 'fl-1', dur: 600 },
					{ at: run.start(1) + 1000, do: 'move', el: 'p', to: 'a-t2', dur: 900 },
					{ at: run.start(1) + 1000, do: 'move', el: 'hl', to: 'la-4', dur: 600 },
					{ at: run.start(1) + 1900, do: 'enter', el: 't2-on' },
					{ at: run.start(1) + 1900, do: 'pulse', el: 'm-t2' },
					{ at: run.start(1) + 2100, do: 'enter', el: 'val-5' },
					{ at: run.start(1) + 3000, do: 'draw', el: 'fl-2', dur: 600 },
					{ at: run.start(1) + 3100, do: 'move', el: 'p', to: 'a-t3', dur: 900 },
					{ at: run.start(1) + 3100, do: 'move', el: 'hl', to: 'la-5', dur: 600 },
					{ at: run.start(1) + 4000, do: 'enter', el: 't3-on' },
					{ at: run.start(1) + 4000, do: 'pulse', el: 'm-t3' },
					{ at: run.start(1) + 4100, do: 'type', el: 'out-a2', dur: 300 },
					{ at: run.start(2) + 200, do: 'camera', to: 'all', dur: 2400 },
					{ at: run.start(2) + 300, do: 'draw', el: 'fl-3', dur: 900 },
					{ at: run.start(2) + 400, do: 'move', el: 'p', to: 'a-end', dur: 1400 },
					{ at: run.start(2) + 400, do: 'move', el: 'hl', to: 'la-9', dur: 800 },
					{ at: run.start(2) + 1800, do: 'enter', el: 'end-on' },
					{ at: run.start(2) + 1800, do: 'pulse', el: 'm-end' },
					{ at: run.start(2) + 2400, do: 'enter', el: 'c-idle' },
				),
			},
		},

		// ─── Scene 2. An exception appears ──────────────────────────────────
		{
			id: 'throw',
			chapter: 'throw',
			scene: 'journey',
			title: { es: 'Una división por cero', en: 'A division by zero' },
			subtitles: thrown.list,
			motion: {
				cues: seq(
					// The previous run is cleared before the program runs again.
					{ at: 0, do: 'exit', el: 'p', dur: 300 },
					{ at: 0, do: 'exit', el: 'fl-0', dur: 400 },
					{ at: 0, do: 'exit', el: 'fl-1', dur: 400 },
					{ at: 0, do: 'exit', el: 'fl-2', dur: 400 },
					{ at: 0, do: 'exit', el: 'fl-3', dur: 400 },
					{ at: 0, do: 'exit', el: 't1-on', dur: 400 },
					{ at: 0, do: 'exit', el: 't2-on', dur: 400 },
					{ at: 0, do: 'exit', el: 't3-on', dur: 400 },
					{ at: 0, do: 'exit', el: 'end-on', dur: 400 },
					{ at: 0, do: 'exit', el: 'val-5', dur: 400 },
					{ at: 0, do: 'exit', el: 'c-idle', dur: 400 },
					{ at: 0, do: 'exit', el: 'out-a1', dur: 400 },
					{ at: 0, do: 'exit', el: 'out-a2', dur: 400 },
					{ at: 0, do: 'move', el: 'hl', to: 'la-4', dur: 700 },
					shot(100, 'shot-op', 2000),
					{ at: 900, do: 'exit', el: 'ea-4', dur: 250 },
					{ at: 900, do: 'exit', el: 'lb-t2-a', dur: 250 },
					{ at: 1200, do: 'enter', el: 'ea-zero' },
					{ at: 1200, do: 'enter', el: 'lb-t2-b' },
					{ at: 1400, do: 'pulse', el: 'm-t2' },
					{ at: 2300, do: 'move', el: 'p', to: 'a-entry', dur: 1 },
					{ at: 2300, do: 'move', el: 'hl', to: 'la-3', dur: 500 },
					{ at: 2400, do: 'enter', el: 'p' },
					{ at: 2400, do: 'enter', el: 'fl-0', dur: 400 },
					{ at: 2600, do: 'move', el: 'p', to: 'a-t1', dur: 800 },
					{ at: 3400, do: 'enter', el: 't1-on' },
					{ at: 3400, do: 'type', el: 'out-b1', dur: 500 },
					{ at: 3900, do: 'enter', el: 'fl-1', dur: 400 },
					{ at: 4000, do: 'move', el: 'p', to: 'a-t2', dur: 900 },
					{ at: 4000, do: 'move', el: 'hl', to: 'la-4', dur: 500 },
					// The operation cannot complete: the flow stops and an object is born.
					{ at: thrown.start(1) - 100, do: 'move', el: 'exc', to: 'a-t2', dy: -30, dur: 1 },
					{ at: thrown.start(1), do: 'exit', el: 'p', dur: 300 },
					{ at: thrown.start(1), do: 'exit', el: 'hl', dur: 300 },
					{ at: thrown.start(1), do: 'enter', el: 'hx-a' },
					{ at: thrown.start(1), do: 'enter', el: 't2-x' },
					{ at: thrown.start(1) + 300, do: 'enter', el: 'exc', dur: 700 },
					{ at: thrown.start(1) + 1200, do: 'pulse', el: 'exc' },
					{ at: thrown.start(1) + 1700, do: 'enter', el: 'exc-card' },
					shot(thrown.start(2), 'shot-try', 1800),
					{ at: thrown.start(2) + 300, do: 'enter', el: 'tr-cut' },
					{ at: thrown.start(2) + 500, do: 'enter', el: 'skip-a5' },
					{ at: thrown.start(2) + 700, do: 'enter', el: 't3-skip' },
					{ at: thrown.start(2) + 1900, do: 'pulse', el: 't3-skip' },
				),
			},
		},

		// ─── Scene 3. The call stack ────────────────────────────────────────
		{
			id: 'calls',
			chapter: 'stack',
			scene: 'journey',
			title: { es: 'main(), procesar() y calcular()', en: 'main(), process() and calculate()' },
			subtitles: calls.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'exc', dur: 400 },
					{ at: 0, do: 'exit', el: 'exc-card', dur: 400 },
					{ at: 0, do: 'exit', el: 't2-x', dur: 400 },
					{ at: 0, do: 'exit', el: 'hx-a', dur: 400 },
					{ at: 0, do: 'exit', el: 'skip-a5', dur: 400 },
					{ at: 0, do: 'exit', el: 't3-skip', dur: 400 },
					{ at: 0, do: 'exit', el: 'tr-cut', dur: 400 },
					{ at: 0, do: 'exit', el: 'fl-0', dur: 400 },
					{ at: 0, do: 'exit', el: 'fl-1', dur: 400 },
					{ at: 0, do: 'exit', el: 't1-on', dur: 400 },
					{ at: 0, do: 'exit', el: 'out-b1', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-t2-b', dur: 400 },
					// The architecture becomes a vertical structure: one level per method.
					shot(0, 'shot-tower', 2600),
					{ at: 300, do: 'exit', el: 'ea', dur: 400 },
					{ at: 800, do: 'enter', el: 'eb' },
					{ at: 900, do: 'enter', el: 'lb-t2-c' },
					{ at: 1000, do: 'enter', el: 'floor-p' },
					{ at: 1400, do: 'enter', el: 'floor-k' },
					{ at: 1800, do: 'enter', el: 'stack-tag' },
					{ at: 1900, do: 'move', el: 'p', to: 'a-t1', dur: 1 },
					{ at: 1900, do: 'move', el: 'hl', to: 'lb-3', dur: 1 },
					{ at: 2000, do: 'enter', el: 'p' },
					{ at: 2000, do: 'enter', el: 'hl' },
					{ at: 2000, do: 'enter', el: 't1-on' },
					{ at: 2000, do: 'enter', el: 'fl-0', dur: 400 },
					{ at: 2100, do: 'type', el: 'out-c1', dur: 500 },
					{ at: 2700, do: 'enter', el: 'fl-1', dur: 400 },
					{ at: 2800, do: 'move', el: 'p', to: 'a-t2', dur: 800 },
					{ at: 2800, do: 'move', el: 'hl', to: 'lb-4', dur: 500 },
					{ at: 3600, do: 'enter', el: 't2-on' },
					{ at: 3600, do: 'pulse', el: 'm-t2' },
					shot(3700, 'shot-p', 1500),
					{ at: 3900, do: 'draw', el: 'fl-call1', dur: 700 },
					{ at: 4000, do: 'move', el: 'p', to: 'a-p', dur: 1100 },
					{ at: 4000, do: 'move', el: 'hl', to: 'lb-15', dur: 800 },
					{ at: 5100, do: 'enter', el: 'p-on' },
					{ at: 5100, do: 'pulse', el: 'p-on' },
					shot(calls.start(1) + 200, 'shot-k', 1500),
					{ at: calls.start(1) + 300, do: 'draw', el: 'fl-call2', dur: 700 },
					{ at: calls.start(1) + 400, do: 'move', el: 'p', to: 'a-k', dur: 1100 },
					{ at: calls.start(1) + 400, do: 'move', el: 'hl', to: 'lb-19', dur: 800 },
					{ at: calls.start(1) + 1500, do: 'enter', el: 'k-on' },
					{ at: calls.start(1) + 1500, do: 'pulse', el: 'k-on' },
					shot(calls.start(1) + 2800, 'shot-tower', 2200),
				),
			},
		},
		{
			id: 'propagate',
			chapter: 'stack',
			scene: 'journey',
			title: { es: 'La excepción se propaga', en: 'The exception propagates' },
			subtitles: propagate.list,
			motion: {
				cues: seq(
					shot(0, 'shot-k', 1500),
					{ at: 400, do: 'exit', el: 'p', dur: 300 },
					{ at: 400, do: 'exit', el: 'hl', dur: 300 },
					{ at: 400, do: 'enter', el: 'k-x' },
					{ at: 400, do: 'enter', el: 'hx-b19' },
					{ at: 500, do: 'move', el: 'exc', to: 'a-k', dy: -30, dur: 1 },
					{ at: 700, do: 'enter', el: 'exc', dur: 700 },
					{ at: 1600, do: 'pulse', el: 'exc' },
					{ at: propagate.start(0) + 3300, do: 'enter', el: 'ab-k' },
					{ at: propagate.start(0) + 4400, do: 'enter', el: 'k-off' },
					{ at: propagate.start(0) + 4400, do: 'exit', el: 'k-on', dur: 500 },
					{ at: propagate.start(0) + 4400, do: 'exit', el: 'k-x', dur: 500 },
					// The camera follows the object up, one level at a time.
					shot(propagate.start(1), 'shot-p', 1700),
					{ at: propagate.start(1) + 100, do: 'move', el: 'exc', to: 'a-p', dy: -30, dur: 1600 },
					{ at: propagate.start(1) + 700, do: 'exit', el: 'hx-b19', dur: 400 },
					{ at: propagate.start(1) + 900, do: 'exit', el: 'fl-call2', dur: 500 },
					{ at: propagate.start(1) + 1100, do: 'enter', el: 'hx-b15' },
					{ at: propagate.start(1) + 2300, do: 'enter', el: 'ab-p' },
					{ at: propagate.start(1) + 3200, do: 'enter', el: 'p-off' },
					{ at: propagate.start(1) + 3200, do: 'exit', el: 'p-on', dur: 500 },
					shot(propagate.start(2), 'shot-rise', 1900),
					{ at: propagate.start(2) + 100, do: 'move', el: 'exc', to: 'a-t2', dy: -30, dur: 1800 },
					{ at: propagate.start(2) + 900, do: 'exit', el: 'hx-b15', dur: 400 },
					{ at: propagate.start(2) + 1000, do: 'exit', el: 'fl-call1', dur: 500 },
					{ at: propagate.start(2) + 1300, do: 'enter', el: 'hx-b4' },
					{ at: propagate.start(2) + 2000, do: 'exit', el: 't2-on', dur: 400 },
					{ at: propagate.start(2) + 2000, do: 'enter', el: 't2-x' },
				),
			},
		},

		// ─── Scene 4. Meeting the catch ─────────────────────────────────────
		{
			id: 'catch',
			chapter: 'catch',
			scene: 'journey',
			title: { es: 'Un catch compatible la captura', en: 'A compatible catch captures it' },
			subtitles: caught.list,
			motion: {
				cues: seq(
					shot(0, 'shot-catch', 2000),
					// The abandoned methods are gone from the stack.
					{ at: 200, do: 'exit', el: 'floor-k', dur: 500 },
					{ at: 200, do: 'exit', el: 'k-off', dur: 500 },
					{ at: 200, do: 'exit', el: 'ab-k', dur: 500 },
					{ at: 200, do: 'exit', el: 'floor-p', dur: 500 },
					{ at: 200, do: 'exit', el: 'p-off', dur: 500 },
					{ at: 200, do: 'exit', el: 'ab-p', dur: 500 },
					{ at: 200, do: 'exit', el: 'stack-tag', dur: 500 },
					{ at: 1400, do: 'pulse', el: 'try-zone' },
					{ at: 2600, do: 'enter', el: 'skip-b5' },
					{ at: 2800, do: 'enter', el: 't3-skip' },
					{ at: 3800, do: 'pulse', el: 'm-c' },
					{ at: caught.start(1), do: 'draw', el: 'rt-x', dur: 900 },
					{ at: caught.start(1) + 200, do: 'move', el: 'exc', to: 'a-cturn', dy: -26, dur: 900 },
					{ at: caught.start(1) + 1000, do: 'exit', el: 'hx-b4', dur: 400 },
					{ at: caught.start(1) + 1100, do: 'move', el: 'exc', to: 'a-c', dy: -22, dur: 900 },
					// The handler checks the type of the object before taking it.
					{ at: caught.start(1) + 2000, do: 'enter', el: 'c-scan' },
					{ at: caught.start(1) + 2000, do: 'enter', el: 'hm-b6' },
					{ at: caught.start(1) + 2500, do: 'pulse', el: 'c-scan' },
					{ at: caught.start(1) + 2800, do: 'enter', el: 'match' },
					{ at: caught.start(1) + 3600, do: 'exit', el: 'exc', dur: 300 },
					{ at: caught.start(1) + 3600, do: 'exit', el: 'c-scan', dur: 400 },
					{ at: caught.start(1) + 3600, do: 'exit', el: 't2-x', dur: 400 },
					{ at: caught.start(1) + 3700, do: 'enter', el: 'exc-held' },
					{ at: caught.start(1) + 3700, do: 'enter', el: 'c-on' },
					// Execution resumes inside the catch, never at the line that failed.
					{ at: caught.start(2), do: 'move', el: 'p', to: 'a-cp', dur: 1 },
					{ at: caught.start(2), do: 'move', el: 'hl', to: 'lb-7', dur: 1 },
					{ at: caught.start(2) + 200, do: 'enter', el: 'p' },
					{ at: caught.start(2) + 200, do: 'enter', el: 'hl' },
					{ at: caught.start(2) + 600, do: 'type', el: 'out-c2', dur: 900 },
					{ at: caught.start(2) + 700, do: 'pulse', el: 'm-c' },
					{ at: caught.start(2) + 2600, do: 'exit', el: 'match', dur: 400 },
				),
			},
		},

		// ─── Scene 5. The finally block ─────────────────────────────────────
		{
			id: 'finally',
			chapter: 'finally',
			scene: 'journey',
			title: { es: 'La ruta de finalización', en: 'The completion route' },
			subtitles: lastly.list,
			motion: {
				cues: seq(
					shot(0, 'shot-fin', 2000),
					{ at: 200, do: 'exit', el: 'hm-b6', dur: 400 },
					{ at: 300, do: 'exit', el: 'veil-fin', dur: 500 },
					{ at: 500, do: 'enter', el: 'm-f' },
					{ at: 1300, do: 'draw', el: 'fl-cf', dur: 1000 },
					{ at: 1500, do: 'move', el: 'p', to: 'a-cend', dur: 800 },
					{ at: 1500, do: 'move', el: 'hl', to: 'lb-9', dur: 900 },
					{ at: 2300, do: 'move', el: 'p', to: 'a-f', dur: 900 },
					{ at: 3200, do: 'enter', el: 'f-on' },
					{ at: 3200, do: 'pulse', el: 'm-f' },
					{ at: 3300, do: 'type', el: 'out-c3', dur: 700 },
					{ at: lastly.start(1) + 200, do: 'draw', el: 'rt-tf', dur: 900 },
					{ at: lastly.start(1) + 1000, do: 'enter', el: 'fin-note' },
					{ at: lastly.start(1) + 2200, do: 'pulse', el: 'm-f' },
				),
			},
		},

		// ─── Scene 6. The program continues ─────────────────────────────────
		{
			id: 'resume',
			chapter: 'resume',
			scene: 'journey',
			title: { es: 'El flujo se recupera', en: 'The flow recovers' },
			subtitles: resume.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'veil-end', dur: 500 },
					{ at: 0, do: 'exit', el: 'fin-note', dur: 400 },
					shot(200, 'shot-out', 2200),
					{ at: 400, do: 'enter', el: 'm-d' },
					{ at: 900, do: 'draw', el: 'fl-fd', dur: 600 },
					{ at: 1000, do: 'move', el: 'p', to: 'a-d', dur: 900 },
					{ at: 1000, do: 'move', el: 'hl', to: 'lb-11', dur: 700 },
					{ at: 1900, do: 'enter', el: 'd-on' },
					{ at: 1900, do: 'pulse', el: 'm-d' },
					{ at: 2000, do: 'type', el: 'out-c4', dur: 700 },
					{ at: 3000, do: 'draw', el: 'fl-de', dur: 600 },
					{ at: 3100, do: 'move', el: 'p', to: 'a-end', dur: 900 },
					{ at: 3100, do: 'move', el: 'hl', to: 'lb-12', dur: 600 },
					{ at: 4000, do: 'enter', el: 'end-on' },
					{ at: 4000, do: 'pulse', el: 'm-end' },
					// The camera pulls back to reveal the whole architecture and the path taken.
					{ at: resume.start(1), do: 'camera', to: 'all', dur: 3200 },
					{ at: resume.start(1) + 400, do: 'flow', el: 'fl-0' },
					{ at: resume.start(1) + 400, do: 'flow', el: 'fl-1' },
					{ at: resume.start(1) + 400, do: 'flow', el: 'fl-cf' },
					{ at: resume.start(1) + 400, do: 'flow', el: 'fl-fd' },
					{ at: resume.start(1) + 400, do: 'flow', el: 'fl-de' },
					{ at: resume.start(1) + 1200, do: 'exit', el: 'hl', dur: 400 },
					{ at: resume.start(2) + 800, do: 'pulse', el: 'exc-held' },
					{ at: resume.start(2) + 2600, do: 'pulse', el: 'm-end' },
				),
			},
		},
	],
};
