import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a bug": a short film (about two minutes) for the C lesson
// "Depuración, advertencias y sanitizers" (order: 36). It plays on a single persistent
// canvas (`data-scene="journey"` in `src/components/animaciones/depuracion-sanitizers-c.astro`):
// the lesson's programs and the console on the left, and on the right the debugging
// method as a loop of five modules, the compiler as a gate, the array in memory with a
// pointer for `i`, the call stack as frames, and the sanitizers as a violet frame
// around the memory they watch. A fixed panel is the debugger: a paused execution bar
// and the variables. Magenta marks the bug; violet marks what watches or fixes it.

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

/** Fades several elements in one after the other. */
const stagger = (at: number, gap: number, ...els: string[]): MotionCue[] => els.map((el, index) => ({ at: at + index * gap, do: 'enter' as const, el }));

/** Slides the highlight bar of the editor to line `line`. */
const bar = (at: number, line: number, dur = 500): MotionCue => ({ at, do: 'move', el: 'hl', to: `ln-${line}`, dur });

/** Types rows `from`.. of the console block `key`, one after the other. */
const output = (at: number, key: string, rows: number, gap = 500, from = 1): MotionCue[] =>
	Array.from({ length: rows }, (_, index) => ({
		at: at + index * gap,
		do: 'type' as const,
		el: `o${key}-${from + index}`,
		dur: Math.max(250, gap),
	}));

/** Swaps a value of the variables panel: the old one fades out, the new one fades in. */
const setVar = (at: number, key: 'i' | 's' | 'n', from: number, to: number): MotionCue[] => [
	{ at, do: 'exit', el: `hv-${key}-${from}`, dur: 250 },
	{ at: at + 150, do: 'enter', el: `hv-${key}-${to}` },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const method = timed(
	say('Depurar no es probar al azar: es un método de cinco pasos.', 'Debugging is not trial and error: it is a method of five steps.'),
	say('Reproducir: con las mismas notas, el resultado incorrecto no cambia.', 'Reproduce: with the same grades, the wrong result never changes.'),
	say('Luego: aislar, hipótesis, corregir y verificar.', 'Then: isolate, hypothesis, fix and verify.'),
);
const warnings = timed(
	say('Antes del depurador, las advertencias: revisan el código sin ejecutarlo.', 'Before the debugger, warnings: they check the code without running it.'),
	say('Avisan de un `=` que asigna en vez de comparar, y de una variable sin inicializar.', 'They flag a `=` that assigns instead of comparing, and an uninitialized variable.'),
);
const silent = timed(
	say('Pero `promedio.c` compila sin ninguna advertencia y aun así falla.', 'But `average.c` compiles with no warnings and still fails.'),
	say('Para ver dónde falla hay que mirar el programa mientras corre.', 'To see where it fails we must watch the program while it runs.'),
);
const breakpoint = timed(
	say('Un punto de parada pausa el programa y te deja inspeccionar las variables.', 'A breakpoint pauses the program and lets you inspect the variables.'),
	say('Con `next` avanzas una línea: `i` sigue en 0 y `suma` pasa de 0 a 7.', 'With `next` you advance one line: `i` stays 0 and `sum` goes from 0 to 7.'),
);
const inspect = timed(
	say('El backtrace muestra la pila de llamadas: `promedio` fue llamada desde `main`.', 'The backtrace shows the call stack: `average` was called from `main`.'),
	say('Con `up` ves el marco de `main`; con `watch suma`, el depurador avisa si cambia.', 'With `up` you see the frame of `main`; with `watch sum`, the debugger stops if it changes.'),
);
const first = timed(
	say('El punto de parada espera a que `i == cantidad`, un valor imposible.', 'The breakpoint waits for `i == count`, an impossible value.'),
	say('Ahí `notas[i]` vale -173653632: primer valor incorrecto, fuera de los límites.', 'There `grades[i]` is -173653632: the first wrong value, out of bounds.'),
	say('Hipótesis: `i <= cantidad` lee de más.', 'Hypothesis: `i <= count` reads too far.'),
);
const asan = timed(
	say('AddressSanitizer rodea la memoria con un marco y vigila cada acceso.', 'AddressSanitizer wraps memory in a frame and watches every access.'),
	say('Informa `stack-buffer-overflow`: lee un `int` pasado el final de `notas`.', 'It reports `stack-buffer-overflow`: it reads an `int` past the end of `grades`.'),
	say('Las direcciones reales cambian cada vez.', 'Real addresses change every time.'),
);
const ubsan = timed(
	say('UndefinedBehaviorSanitizer vigila las operaciones: aquí, un desbordamiento con signo.', 'UndefinedBehaviorSanitizer watches operations: here, a signed overflow.'),
	say('Sumar 1 a `INT_MAX` no "da la vuelta" en C: es comportamiento indefinido.', 'Adding 1 to `INT_MAX` does not "wrap around" in C: it is undefined behavior.'),
);
const fix = timed(
	say('La corrección cambia una sola cosa: `i < cantidad`.', 'The fix changes one thing: `i < count`.'),
	say('Verificar: `Promedio: 7.75`. Es la comprobación de regresión.', 'Verify: `Average: 7.75`. That is the regression check.'),
	say('Así se cierra el ciclo, listo para el próximo error.', 'That closes the loop, ready for the next bug.'),
);

const ringEls = (prefix: string) => [1, 2, 3, 4, 5].map((k) => `${prefix}${k}`);

export const script: AnimationScript = {
	chapters: [
		{ id: 'method', label: { es: 'El método', en: 'The method' } },
		{ id: 'warnings', label: { es: 'Advertencias primero', en: 'Warnings first' } },
		{ id: 'debugger', label: { es: 'El depurador', en: 'The debugger' } },
		{ id: 'firstwrong', label: { es: 'El primer valor incorrecto', en: 'The first wrong value' } },
		{ id: 'sanitizers', label: { es: 'Los sanitizers', en: 'The sanitizers' } },
		{ id: 'fix', label: { es: 'Corregir y verificar', en: 'Fix and verify' } },
	],
	steps: [
		// ─── Scene 1. The method ────────────────────────────────────────────
		{
			id: 'method',
			chapter: 'method',
			scene: 'journey',
			title: { es: 'Un método antes que una herramienta', en: 'A method before a tool' },
			subtitles: method.list,
			motion: {
				cues: seq(
					shot(0, 'shot-ring', 3500),
					{ at: 200, do: 'enter', el: 'tt-pr' },
					{ at: 300, do: 'enter', el: 'f-pr' },
					{ at: 400, do: 'enter', el: 'hl' },
					...stagger(600, 150, ...ringEls('m-r')),
					...stagger(700, 150, ...ringEls('c-r')),
					{ at: 1800, do: 'draw', el: 'fl-loop', dur: 1300 },
					{ at: 3300, do: 'enter', el: 'p' },
					// Reproduce: the same wrong result, every time.
					{ at: method.start(1) + 100, do: 'move', el: 'p', to: 'a-r1', dur: 700 },
					bar(method.start(1) + 200, 14),
					{ at: method.start(1) + 900, do: 'enter', el: 'on-r1' },
					{ at: method.start(1) + 900, do: 'pulse', el: 'm-r1' },
					...output(method.start(1) + 500, 'run1', 4, 700),
					// The rest of the loop.
					{ at: method.start(2) + 100, do: 'move', el: 'p', to: 'a-r2', dur: 500 },
					{ at: method.start(2) + 600, do: 'enter', el: 'on-r2' },
					{ at: method.start(2) + 700, do: 'move', el: 'p', to: 'a-r3', dur: 500 },
					{ at: method.start(2) + 1200, do: 'enter', el: 'on-r3' },
					{ at: method.start(2) + 1300, do: 'move', el: 'p', to: 'a-r4', dur: 500 },
					{ at: method.start(2) + 1800, do: 'enter', el: 'on-r4' },
					{ at: method.start(2) + 1900, do: 'move', el: 'p', to: 'a-r5', dur: 500 },
					{ at: method.start(2) + 2400, do: 'enter', el: 'on-r5' },
					{ at: method.start(2) + 2600, do: 'flow', el: 'fl-loop' },
					{ at: method.start(2) + 3000, do: 'pulse', el: 'm-r1' },
				),
			},
		},

		// ─── Scene 2. Warnings first ────────────────────────────────────────
		{
			id: 'warnings',
			chapter: 'warnings',
			scene: 'journey',
			title: { es: 'Las advertencias, el primer depurador', en: 'Warnings, the first debugger' },
			subtitles: warnings.list,
			motion: {
				cues: seq(
					...clear(0, ...ringEls('m-r'), ...ringEls('on-r'), ...ringEls('c-r'), 'fl-loop', 'out-run1', 'f-pr', 'tt-pr'),
					shot(0, 'shot-chk', 2600),
					{ at: 300, do: 'enter', el: 'tt-wa' },
					{ at: 300, do: 'enter', el: 'f-wa' },
					bar(400, 3),
					{ at: 700, do: 'enter', el: 's-src' },
					{ at: 900, do: 'enter', el: 'm-cc' },
					{ at: 1100, do: 'enter', el: 's-exe' },
					{ at: 800, do: 'move', el: 'p', to: 'a-src', dur: 800 },
					{ at: 1500, do: 'draw', el: 'fl-src', dur: 900 },
					...output(1200, 'warn', 4, 600),
					{ at: 1700, do: 'move', el: 'p', to: 'a-cc', dur: 800 },
					{ at: 2500, do: 'enter', el: 'on-cc' },
					{ at: 2600, do: 'pulse', el: 'm-cc' },
					bar(warnings.start(1), 6),
					{ at: warnings.start(1) + 100, do: 'enter', el: 'fx-wa6' },
					{ at: warnings.start(1) + 400, do: 'enter', el: 'w-par' },
					{ at: warnings.start(1) + 1500, do: 'pulse', el: 'w-par' },
					bar(warnings.start(1) + 2000, 7),
					{ at: warnings.start(1) + 2100, do: 'enter', el: 'fx-wa7' },
					{ at: warnings.start(1) + 2400, do: 'enter', el: 'w-uni' },
					{ at: warnings.start(1) + 3500, do: 'pulse', el: 'w-uni' },
				),
			},
		},
		{
			id: 'silent',
			chapter: 'warnings',
			scene: 'journey',
			title: { es: 'Un error que el compilador no ve', en: 'A bug the compiler cannot see' },
			subtitles: silent.list,
			motion: {
				cues: seq(
					...clear(0, 'fx-wa6', 'fx-wa7', 'w-par', 'w-uni', 'out-warn', 'f-wa', 'tt-wa'),
					{ at: 300, do: 'enter', el: 'tt-pr' },
					{ at: 300, do: 'enter', el: 'f-pr' },
					bar(500, 5),
					...output(700, 'clean', 4, 700),
					{ at: 400, do: 'move', el: 'p', to: 'a-src', dur: 700 },
					{ at: 1300, do: 'move', el: 'p', to: 'a-cc', dur: 700 },
					{ at: 1500, do: 'pulse', el: 'm-cc' },
					{ at: 2000, do: 'enter', el: 'ok-0' },
					{ at: 2100, do: 'draw', el: 'fl-out', dur: 900 },
					{ at: 2200, do: 'move', el: 'p', to: 'a-exe', dur: 900 },
					{ at: 3300, do: 'pulse', el: 's-exe' },
					{ at: 3500, do: 'enter', el: 'wrong' },
					{ at: 4300, do: 'pulse', el: 'wrong' },
					...clear(silent.start(1) + 200, 's-src', 'm-cc', 's-exe', 'fl-src', 'fl-out', 'ok-0', 'wrong', 'on-cc', 'out-clean', 'p'),
					bar(silent.start(1) + 300, 6),
					shot(silent.start(1) + 400, 'shot-arr', 2400),
				),
			},
		},

		// ─── Scene 3. The debugger ──────────────────────────────────────────
		{
			id: 'breakpoint',
			chapter: 'debugger',
			scene: 'journey',
			title: { es: 'Un punto de parada pausa el programa', en: 'A breakpoint pauses the program' },
			subtitles: breakpoint.list,
			motion: {
				cues: seq(
					...stagger(200, 150, 'cell-0', 'cell-1', 'cell-2', 'cell-3', 'cell-4'),
					{ at: 900, do: 'enter', el: 'lb-arr' },
					{ at: 400, do: 'enter', el: 'hud' },
					{ at: 600, do: 'enter', el: 'hv-c-0' },
					{ at: 700, do: 'enter', el: 'hv-i-0' },
					{ at: 800, do: 'enter', el: 'hv-s-0' },
					{ at: 900, do: 'enter', el: 'hv-n-0' },
					{ at: 1000, do: 'enter', el: 'pm' },
					...output(1200, 'brk', 3, 400),
					bar(1400, 6),
					{ at: 2300, do: 'enter', el: 'pl-6' },
					{ at: 2400, do: 'enter', el: 'ptr-i' },
					{ at: 2700, do: 'pulse', el: 'pm' },
					// Inspect: the value of `i`.
					...output(3200, 'brk', 2, 500, 4),
					{ at: 4000, do: 'pulse', el: 'hv-i-0' },
					{ at: 4400, do: 'pulse', el: 'ptr-i' },
					// next: one line forward, and `suma` changes.
					...output(breakpoint.start(1) + 100, 'brk', 3, 450, 6),
					bar(breakpoint.start(1) + 200, 7),
					{ at: breakpoint.start(1) + 200, do: 'exit', el: 'pl-6', dur: 300 },
					{ at: breakpoint.start(1) + 400, do: 'enter', el: 'pl-7' },
					...setVar(breakpoint.start(1) + 1200, 's', 0, 1),
					{ at: breakpoint.start(1) + 1800, do: 'pulse', el: 'hv-s-1' },
				),
			},
		},
		{
			id: 'inspect',
			chapter: 'debugger',
			scene: 'journey',
			title: { es: 'La pila de llamadas y los puntos de observación', en: 'The call stack and watchpoints' },
			subtitles: inspect.list,
			motion: {
				cues: seq(
					...clear(0, 'out-brk', 'pl-7', 'lb-arr'),
					shot(0, 'shot-frames', 2400),
					{ at: 300, do: 'enter', el: 'fr-main' },
					{ at: 600, do: 'enter', el: 'fr-prom' },
					{ at: 900, do: 'enter', el: 'lb-fr-main' },
					{ at: 1100, do: 'enter', el: 'lb-fr-prom' },
					...output(500, 'bt', 3, 500),
					{ at: 2300, do: 'pulse', el: 'fr-prom' },
					// up: the caller's frame, then a watchpoint on `suma`.
					...output(inspect.start(1) + 100, 'bt', 3, 450, 4),
					bar(inspect.start(1) + 200, 14),
					{ at: inspect.start(1) + 500, do: 'pulse', el: 'fr-main' },
					{ at: inspect.start(1) + 1600, do: 'pulse', el: 'cell-1' },
					...output(inspect.start(1) + 1800, 'bt', 2, 500, 7),
					bar(inspect.start(1) + 1800, 6),
					{ at: inspect.start(1) + 2500, do: 'enter', el: 'lb-watch' },
					{ at: inspect.start(1) + 3400, do: 'pulse', el: 'lb-watch' },
				),
			},
		},

		// ─── Scene 4. The first wrong value ─────────────────────────────────
		{
			id: 'firstwrong',
			chapter: 'firstwrong',
			scene: 'journey',
			title: { es: 'El primer valor incorrecto', en: 'The first wrong value' },
			subtitles: first.list,
			motion: {
				cues: seq(
					...clear(0, 'out-bt', 'fr-main', 'fr-prom', 'lb-fr-main', 'lb-fr-prom', 'lb-watch'),
					shot(0, 'shot-arr', 2400),
					{ at: 100, do: 'exit', el: 'hv-s-1', dur: 250 },
					{ at: 250, do: 'enter', el: 'hv-s-0' },
					...output(400, 'cond', 2, 450),
					...output(1300, 'cond', 1, 400, 3),
					// The loop runs on its own until the condition holds.
					{ at: 1500, do: 'move', el: 'ptr-i', to: 'a-c1', dur: 400 },
					{ at: 1500, do: 'move', el: 'pm', to: 'a-t1', dur: 400 },
					...setVar(1900, 'i', 0, 1),
					...setVar(1900, 's', 0, 1),
					...setVar(1900, 'n', 0, 1),
					{ at: 1950, do: 'move', el: 'ptr-i', to: 'a-c2', dur: 400 },
					{ at: 1950, do: 'move', el: 'pm', to: 'a-t2', dur: 400 },
					...setVar(2350, 'i', 1, 2),
					...setVar(2350, 's', 1, 2),
					...setVar(2350, 'n', 1, 2),
					{ at: 2400, do: 'move', el: 'ptr-i', to: 'a-c3', dur: 400 },
					{ at: 2400, do: 'move', el: 'pm', to: 'a-t3', dur: 400 },
					...setVar(2800, 'i', 2, 3),
					...setVar(2800, 's', 2, 3),
					...setVar(2800, 'n', 2, 3),
					{ at: 2850, do: 'move', el: 'ptr-i', to: 'a-c4', dur: 400 },
					{ at: 2850, do: 'move', el: 'pm', to: 'a-t4', dur: 400 },
					...setVar(3250, 'i', 3, 4),
					...setVar(3250, 's', 3, 4),
					...setVar(3250, 'n', 3, 4),
					{ at: 3500, do: 'enter', el: 'pl-6' },
					...output(3500, 'cond', 1, 400, 4),
					// Inspect the stop: `i` is out of range, so is the value read.
					...output(first.start(1) + 100, 'cond', 4, 400, 5),
					{ at: first.start(1) + 1500, do: 'enter', el: 'bad-on' },
					{ at: first.start(1) + 1700, do: 'enter', el: 'lb-out' },
					{ at: first.start(1) + 2000, do: 'pulse', el: 'hv-n-4' },
					{ at: first.start(1) + 2500, do: 'pulse', el: 'bad-on' },
					// The hypothesis points at line 5.
					bar(first.start(2) + 100, 5),
					{ at: first.start(2) + 200, do: 'enter', el: 'fx-pr5' },
					{ at: first.start(2) + 1000, do: 'pulse', el: 'fx-pr5' },
					{ at: first.start(2) + 1800, do: 'pulse', el: 'ptr-i' },
				),
			},
		},

		// ─── Scene 5. The sanitizers ────────────────────────────────────────
		{
			id: 'asan',
			chapter: 'sanitizers',
			scene: 'journey',
			title: { es: 'AddressSanitizer vigila la memoria', en: 'AddressSanitizer watches memory' },
			subtitles: asan.list,
			motion: {
				cues: seq(
					...clear(0, 'out-cond', 'hud', 'pl-6', 'lb-out', 'fx-pr5', 'bad-on'),
					{ at: 100, do: 'move', el: 'ptr-i', to: 'a-c0', dur: 500 },
					shot(0, 'shot-arr', 1800),
					{ at: 500, do: 'enter', el: 'asan-frame' },
					{ at: 900, do: 'enter', el: 'lb-asan' },
					...output(1100, 'asan', 2, 500),
					bar(1100, 6),
					{ at: 2000, do: 'pulse', el: 'asan-frame' },
					{ at: 2000, do: 'move', el: 'ptr-i', to: 'a-c1', dur: 350 },
					{ at: 2400, do: 'move', el: 'ptr-i', to: 'a-c2', dur: 350 },
					{ at: 2800, do: 'move', el: 'ptr-i', to: 'a-c3', dur: 350 },
					{ at: 3200, do: 'move', el: 'ptr-i', to: 'a-c4', dur: 350 },
					{ at: 3700, do: 'enter', el: 'bad-on' },
					{ at: 3800, do: 'enter', el: 'lb-hit' },
					...output(3700, 'asan', 1, 400, 3),
					// The report: what, where and on which object.
					...output(asan.start(1) + 100, 'asan', 5, 400, 4),
					{ at: asan.start(1) + 800, do: 'pulse', el: 'bad-on' },
					{ at: asan.start(1) + 2200, do: 'pulse', el: 'lb-hit' },
					{ at: asan.start(2) + 300, do: 'pulse', el: 'asan-frame' },
					{ at: asan.start(2) + 1200, do: 'pulse', el: 'lb-asan' },
				),
			},
		},
		{
			id: 'ubsan',
			chapter: 'sanitizers',
			scene: 'journey',
			title: { es: 'UndefinedBehaviorSanitizer vigila las operaciones', en: 'UndefinedBehaviorSanitizer watches operations' },
			subtitles: ubsan.list,
			motion: {
				cues: seq(
					...clear(0, ...[0, 1, 2, 3, 4].map((k) => `cell-${k}`), 'asan-frame', 'lb-asan', 'lb-hit', 'bad-on', 'ptr-i', 'out-asan', 'f-pr', 'tt-pr'),
					shot(0, 'shot-ub', 2400),
					{ at: 300, do: 'enter', el: 'tt-ub' },
					{ at: 300, do: 'enter', el: 'f-ub' },
					bar(500, 5),
					{ at: 700, do: 'enter', el: 'ub-cell' },
					{ at: 900, do: 'enter', el: 'ub-name' },
					{ at: 1100, do: 'enter', el: 'ub-frame' },
					{ at: 1300, do: 'enter', el: 'lb-ubsan' },
					...output(1500, 'ubs', 2, 500),
					bar(2500, 6),
					{ at: 2800, do: 'enter', el: 'ub-plus' },
					{ at: 3300, do: 'pulse', el: 'ub-cell' },
					...output(ubsan.start(1) + 100, 'ubs', 4, 450, 3),
					{ at: ubsan.start(1) + 200, do: 'enter', el: 'fx-ub6' },
					{ at: ubsan.start(1) + 800, do: 'enter', el: 'ub-bad' },
					{ at: ubsan.start(1) + 1800, do: 'pulse', el: 'ub-bad' },
					{ at: ubsan.start(1) + 2500, do: 'pulse', el: 'ub-frame' },
				),
			},
		},

		// ─── Scene 6. Fix and verify ────────────────────────────────────────
		{
			id: 'fix',
			chapter: 'fix',
			scene: 'journey',
			title: { es: 'Corregir una cosa y verificar', en: 'Fix one thing and verify' },
			subtitles: fix.list,
			motion: {
				cues: seq(
					...clear(0, 'ub-cell', 'ub-name', 'ub-frame', 'lb-ubsan', 'ub-plus', 'ub-bad', 'fx-ub6', 'out-ubs', 'f-ub', 'tt-ub'),
					shot(0, 'shot-arr', 2000),
					{ at: 300, do: 'enter', el: 'tt-pr' },
					{ at: 300, do: 'enter', el: 'f-pr' },
					bar(500, 5),
					{ at: 800, do: 'exit', el: 'l5-bug', dur: 300 },
					{ at: 900, do: 'enter', el: 'l5-fix' },
					{ at: 1300, do: 'pulse', el: 'l5-fix' },
					...stagger(1100, 150, 'cell-0', 'cell-1', 'cell-2', 'cell-3', 'cell-4'),
					{ at: 1900, do: 'enter', el: 'asan-frame' },
					// Verify: the same input now gives 7.75 and the sanitizers stay silent.
					...output(fix.start(1) + 100, 'okk', 3, 450),
					bar(fix.start(1) + 200, 14),
					{ at: fix.start(1) + 300, do: 'move', el: 'ptr-i', to: 'a-c0', dur: 100 },
					{ at: fix.start(1) + 450, do: 'enter', el: 'ptr-i' },
					{ at: fix.start(1) + 900, do: 'move', el: 'ptr-i', to: 'a-c1', dur: 350 },
					{ at: fix.start(1) + 1300, do: 'move', el: 'ptr-i', to: 'a-c2', dur: 350 },
					{ at: fix.start(1) + 1700, do: 'move', el: 'ptr-i', to: 'a-c3', dur: 350 },
					{ at: fix.start(1) + 2200, do: 'enter', el: 'lb-sound' },
					{ at: fix.start(1) + 2700, do: 'enter', el: 'lb-ok' },
					{ at: fix.start(1) + 3300, do: 'pulse', el: 'lb-ok' },
					// The loop closes: the whole method seen from afar.
					...clear(fix.start(2), 'ptr-i', 'lb-sound', 'lb-ok'),
					shot(fix.start(2), 'shot-ring', 3000),
					...stagger(fix.start(2) + 300, 150, ...ringEls('m-r')),
					...stagger(fix.start(2) + 400, 150, ...ringEls('on-r')),
					...stagger(fix.start(2) + 500, 150, ...ringEls('c-r')),
					{ at: fix.start(2) + 1300, do: 'enter', el: 'fl-loop' },
					{ at: fix.start(2) + 1400, do: 'draw', el: 'fl-loop', dur: 1000 },
					{ at: fix.start(2) + 2500, do: 'flow', el: 'fl-loop' },
					{ at: fix.start(2) + 3000, do: 'pulse', el: 'm-r5' },
				),
			},
		},
	],
};
