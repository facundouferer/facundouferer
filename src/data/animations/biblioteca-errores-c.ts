import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Converting without trusting": a short film (about two minutes) for the C lesson
// "Biblioteca estándar y manejo de errores" (`biblioteca-estandar-y-errores`). It
// plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/biblioteca-errores-c.astro`). The editor shows three of
// the lesson's programs in turn: `leer_entero` (built on `strtol`), the `main` that
// calls it, and `procesar` with its single `goto limpiar` exit. On the right, the
// input text is a strip of memory cells; a flag-shaped pin is a pointer (`texto`
// where the text starts, `fin` where `strtol` stopped), `errno` lives on its own
// plate, and a light blue particle is the execution flow. Then the camera moves to
// `main`, which receives the value through the `resultado` pointer and reads the
// returned status, and to `procesar`, where three failure paths converge on one
// cleanup station.

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

/** The particle and the editor bar travel together to the module of one line of `leer_entero`. */
const runA = (at: number, line: number, dur = 650): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a-m${line}`, dur },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 700) },
];

/** The same, for a line of `main`. */
const runB = (at: number, line: number, dur = 650): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a-b${line}`, dur },
	{ at, do: 'move', el: 'hl', to: `ln-b-${line}`, dur: Math.min(dur, 700) },
];

/** The same, for a line of `procesar`. */
const runC = (at: number, line: number, dur = 650): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a-p${line}`, dur },
	{ at, do: 'move', el: 'hl', to: `ln-c-${line}`, dur: Math.min(dur, 700) },
];

/** Lights the module of a line once the particle gets there, and gives it a pulse. */
const light = (at: number, lit: string, module: string): MotionCue[] => [
	{ at, do: 'enter', el: lit },
	{ at, do: 'pulse', el: module },
];

/** A pointer pin jumps to another cell: it leaves, reappears there and stands. */
const hop = (at: number, pin: 'pin-t' | 'pin-f', to: string): MotionCue[] => [
	{ at, do: 'exit', el: pin, dur: 300 },
	{ at: at + 350, do: 'move', el: pin, to, dur: 20 },
	{ at: at + 450, do: 'enter', el: pin },
];

/** Leaves elements of the previous run behind, all at once. */
const clear = (at: number, ...ids: string[]): MotionCue[] => ids.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

// ─── Captions ───────────────────────────────────────────────────────────────
const cells = timed(
	say('La entrada "42abc" son seis celdas, la última es el `\\0`.', 'The input "42abc" is six cells; the last one is the `\\0`.'),
	say('La línea 3 hace `errno = 0`: podría traer un valor viejo.', 'Line 3 sets `errno = 0`: it may hold a stale value.'),
	say('`strtol` consume "42" y deja `fin` en la primera celda sin usar.', '`strtol` consumes "42" and leaves `end` on the first unused cell.'),
);
const trailing = timed(
	say('Línea 5: `fin == texto` es falso, `strtol` sí leyó dígitos.', 'Line 5: `end == text` is false, `strtol` did read digits.'),
	say('Línea 8: `*fin` es `a`, no `\\0`. Quedó basura: `return false`.', 'Line 8: `*end` is `a`, not `\\0`. Garbage left: `return false`.'),
);
const empty = timed(
	say('Con la entrada vacía solo existe el `\\0`: no hay nada que consumir.', 'With empty input only the `\\0` exists: nothing to consume.'),
	say('`fin` queda igual a `texto`: la línea 5 devuelve `false`.', '`end` stays equal to `text`: line 5 returns `false`.'),
);
const range = timed(
	say('Veinte dígitos no caben en un `long`. `errno` ya vale 0.', 'Twenty digits do not fit in a `long`. `errno` is already 0.'),
	say('`strtol` devuelve `LONG_MAX` y pone `errno` en `ERANGE`.', '`strtol` returns `LONG_MAX` and sets `errno` to `ERANGE`.'),
	say('La línea 11 lo ve: `errno == ERANGE`. Por eso se limpia antes.', 'Line 11 sees `errno == ERANGE`. That is why it is cleared first.'),
);
const status = timed(
	say('Con "42" pasan todas las pruebas: el texto es un `int` válido.', 'With "42" every check passes: the text is a valid `int`.'),
	say('La línea 14 escribe `*resultado`: el valor llega a `valor`.', 'Line 14 writes `*result`: the value reaches `value`.'),
	say('Devuelve `true`: el retorno dice si salió bien.', 'It returns `true`: the return value says if it worked.'),
);
const caller = timed(
	say('En `main`, la línea 6 usa el estado como condición del `if`.', 'In `main`, line 6 uses the status as the `if` condition.'),
	say('Con `false` imprime el error (línea 9); con `true`, el valor.', 'With `false` it prints the error (line 9); with `true`, the value.'),
	say('Cuatro entradas: `false`, `false`, `false` y `true`.', 'Four inputs: `false`, `false`, `false` and `true`.'),
);
const paths = timed(
	say('`procesar` puede fallar en tres puntos: líneas 7, 11 y 15.', '`process` can fail at three points: lines 7, 11 and 15.'),
	say('Cada error hace `goto limpiar`: todos van a la misma estación.', 'Each error does `goto cleanup`: all go to the same station.'),
	say('Aquí falla el segundo `malloc`: `datos` existe, `texto` es `NULL`.', 'Here the second `malloc` fails: `data` exists, `text` is `NULL`.'),
);
const cleanup = timed(
	say('`free(texto)` no hace nada con `NULL`; `free(datos)` libera el bloque.', '`free(text)` does nothing with `NULL`; `free(data)` frees the block.'),
	say('Si todo sale bien, `estado = 0` y también cae en la limpieza.', 'If all goes well, `status = 0` and it falls into the cleanup.'),
	say('Un solo camino de limpieza, sin importar cuántos errores haya.', 'One cleanup path, however many errors there are.'),
);

const MODULES_A = [3, 4, 5, 6, 8, 9, 11, 12, 14, 15];
const MODULES_B = [4, 5, 6, 7, 9, 12];
const MODULES_C = [2, 3, 4, 6, 7, 9, 10, 11, 13, 14, 15, 17, 20, 21, 22];

export const script: AnimationScript = {
	chapters: [
		{ id: 'stop', label: { es: 'Dónde se detuvo', en: 'Where it stopped' } },
		{ id: 'end', label: { es: 'Basura y vacío', en: 'Garbage and empty' } },
		{ id: 'range', label: { es: 'Desborde y errno', en: 'Overflow and errno' } },
		{ id: 'status', label: { es: 'Estado y salida', en: 'Status and output' } },
		{ id: 'caller', label: { es: 'El llamador', en: 'The caller' } },
		{ id: 'exit', label: { es: 'Una sola salida', en: 'One single exit' } },
	],
	steps: [
		// ─── Scene 1. Where strtol stopped ──────────────────────────────────
		{
			id: 'cells',
			chapter: 'stop',
			scene: 'journey',
			title: { es: 'strtol deja un puntero donde se detuvo', en: 'strtol leaves a pointer where it stopped' },
			subtitles: cells.list,
			motion: {
				cues: seq(
					shot(0, 'shot-build', 3000),
					{ at: 80, do: 'enter', el: 'f-a', dur: 800 },
					{ at: 240, do: 'enter', el: 'f-e', dur: 800 },
					MODULES_A.map((line, index) => ({ at: 500 + index * 130, do: 'enter' as const, el: `m-${line}` })),
					{ at: 1520, do: 'enter', el: 'str-1', dur: 800 },
					{ at: 1840, do: 'enter', el: 'v-valor' },
					{ at: 2000, do: 'enter', el: 'val-q' },
					{ at: 2400, do: 'enter', el: 'lb-addr' },
					{ at: 2880, do: 'enter', el: 'v-errno' },
					{ at: 3120, do: 'enter', el: 'ev-34' },
					{ at: 3440, do: 'enter', el: 'pin-t' },
					// Caption 2: errno is cleared on line 3.
					{ at: cells.start(1), do: 'exit', el: 'lb-addr', dur: 400 },
					shot(cells.start(1), 'shot-strip-b', 2200),
					{ at: cells.start(1) + 240, do: 'enter', el: 'lb-stale' },
					{ at: cells.start(1) + 720, do: 'enter', el: 'hl' },
					{ at: cells.start(1) + 720, do: 'enter', el: 'p' },
					runA(cells.start(1) + 1200, 3),
					light(cells.start(1) + 1840, 'on-3', 'm-3'),
					{ at: cells.start(1) + 2000, do: 'exit', el: 'lb-stale', dur: 400 },
					{ at: cells.start(1) + 2000, do: 'exit', el: 'ev-34', dur: 400 },
					{ at: cells.start(1) + 2320, do: 'enter', el: 'ev-0' },
					{ at: cells.start(1) + 2400, do: 'enter', el: 'lb-clear' },
					// Caption 3: strtol consumes two digits and leaves `fin` on the third cell.
					{ at: cells.start(2), do: 'exit', el: 'lb-clear', dur: 400 },
					{ at: cells.start(2), do: 'exit', el: 'on-3', dur: 400 },
					shot(cells.start(2), 'shot-strip', 1800),
					runA(cells.start(2) + 160, 4),
					light(cells.start(2) + 800, 'on-4', 'm-4'),
					{ at: cells.start(2) + 1040, do: 'enter', el: 'pin-f' },
					{ at: cells.start(2) + 1200, do: 'move', el: 'p', to: 'a-c-1-0', dur: 600 },
					{ at: cells.start(2) + 1680, do: 'enter', el: 'eat-1-0' },
					{ at: cells.start(2) + 1760, do: 'move', el: 'p', to: 'a-c-1-1', dur: 600 },
					{ at: cells.start(2) + 2240, do: 'enter', el: 'eat-1-1' },
					{ at: cells.start(2) + 2320, do: 'move', el: 'p', to: 'a-c-1-2', dur: 600 },
					{ at: cells.start(2) + 2320, do: 'move', el: 'pin-f', to: 'a-f-1-2', dur: 900 },
					{ at: cells.start(2) + 3120, do: 'enter', el: 'lb-stop' },
					{ at: cells.start(2) + 3440, do: 'exit', el: 'val-q', dur: 300 },
					{ at: cells.start(2) + 3520, do: 'enter', el: 'val-42' },
				),
			},
		},

		// ─── Scene 2. Garbage at the end, and no digit at all ───────────────
		{
			id: 'trailing',
			chapter: 'end',
			scene: 'journey',
			title: { es: 'Basura al final: se mira fin', en: 'Trailing garbage: check end' },
			subtitles: trailing.list,
			motion: {
				cues: seq(
					clear(0, 'on-4', 'lb-stop'),
					shot(0, 'shot-build', 1800),
					runA(240, 5),
					light(880, 'on-5', 'm-5'),
					{ at: 1200, do: 'pulse', el: 'pin-t' },
					{ at: 1560, do: 'pulse', el: 'pin-f' },
					clear(trailing.start(1), 'on-5'),
					runA(trailing.start(1) + 160, 8),
					light(trailing.start(1) + 800, 'on-8', 'm-8'),
					{ at: trailing.start(1) + 1000, do: 'pulse', el: 'pin-f' },
					{ at: trailing.start(1) + 1300, do: 'enter', el: 'lb-garbage' },
					{ at: trailing.start(1) + 1900, do: 'pulse', el: 'val-42' },
					{ at: trailing.start(1) + 2300, do: 'exit', el: 'on-8', dur: 300 },
					runA(trailing.start(1) + 2400, 9),
					light(trailing.start(1) + 3000, 'on-9', 'm-9'),
					clear(trailing.start(1) + 3500, 'lb-garbage'),
				),
			},
		},
		{
			id: 'empty',
			chapter: 'end',
			scene: 'journey',
			title: { es: 'Sin ningún dígito: fin == texto', en: 'No digit at all: end == text' },
			subtitles: empty.list,
			motion: {
				cues: seq(
					clear(0, 'on-8', 'on-9', 'str-1', 'eat-1-0', 'eat-1-1', 'val-42'),
					hop(0, 'pin-t', 'a-t-2-0'),
					hop(480, 'pin-f', 'a-f-2-0'),
					shot(0, 'shot-strip', 1800),
					{ at: 560, do: 'enter', el: 'str-2', dur: 800 },
					{ at: 640, do: 'enter', el: 'val-q' },
					runA(720, 3),
					light(1360, 'on-3', 'm-3'),
					runA(1840, 4),
					{ at: 2080, do: 'exit', el: 'on-3', dur: 400 },
					light(2480, 'on-4', 'm-4'),
					{ at: 2720, do: 'move', el: 'p', to: 'a-c-2-0', dur: 700 },
					{ at: empty.start(1), do: 'exit', el: 'on-4', dur: 400 },
					shot(empty.start(1), 'shot-build', 1800),
					runA(empty.start(1) + 160, 5),
					light(empty.start(1) + 800, 'on-5', 'm-5'),
					{ at: empty.start(1) + 1040, do: 'enter', el: 'lb-nodigit' },
					{ at: empty.start(1) + 1200, do: 'pulse', el: 'pin-t' },
					{ at: empty.start(1) + 1440, do: 'pulse', el: 'pin-f' },
					runA(empty.start(1) + 2240, 6),
					light(empty.start(1) + 2880, 'on-6', 'm-6'),
				),
			},
		},

		// ─── Scene 3. Overflow and errno ────────────────────────────────────
		{
			id: 'range',
			chapter: 'range',
			scene: 'journey',
			title: { es: 'Desborde: errno vale ERANGE', en: 'Overflow: errno is ERANGE' },
			subtitles: range.list,
			motion: {
				cues: seq(
					clear(0, 'on-5', 'on-6', 'lb-nodigit', 'str-2'),
					hop(0, 'pin-t', 'a-t-3-0'),
					hop(480, 'pin-f', 'a-f-3-0'),
					shot(0, 'shot-strip-b', 2000),
					{ at: 560, do: 'enter', el: 'str-3', dur: 800 },
					runA(720, 3),
					light(1360, 'on-3', 'm-3'),
					{ at: 1600, do: 'pulse', el: 'v-errno' },
					{ at: 1920, do: 'exit', el: 'on-3', dur: 400 },
					runA(2000, 4),
					light(2640, 'on-4', 'm-4'),
					// Caption 2: the digits are consumed; the result saturates and errno is set.
					{ at: range.start(1), do: 'move', el: 'p', to: 'a-c-3-0', dur: 600 },
					{ at: range.start(1) + 480, do: 'enter', el: 'eat-3-0' },
					{ at: range.start(1) + 560, do: 'move', el: 'p', to: 'a-c-3-1', dur: 400 },
					{ at: range.start(1) + 880, do: 'enter', el: 'eat-3-1' },
					{ at: range.start(1) + 960, do: 'move', el: 'p', to: 'a-c-3-2', dur: 400 },
					{ at: range.start(1) + 1280, do: 'enter', el: 'eat-3-2' },
					{ at: range.start(1) + 1360, do: 'move', el: 'p', to: 'a-c-3-3', dur: 400 },
					{ at: range.start(1) + 1680, do: 'enter', el: 'eat-3-3' },
					{ at: range.start(1) + 1760, do: 'move', el: 'p', to: 'a-c-3-4', dur: 400 },
					{ at: range.start(1) + 2080, do: 'enter', el: 'eat-3-4' },
					{ at: range.start(1) + 2240, do: 'move', el: 'pin-f', to: 'a-f-3-5', dur: 900 },
					{ at: range.start(1) + 2400, do: 'exit', el: 'val-q', dur: 300 },
					{ at: range.start(1) + 2480, do: 'enter', el: 'val-max' },
					{ at: range.start(1) + 2640, do: 'enter', el: 'lb-sat' },
					{ at: range.start(1) + 2880, do: 'exit', el: 'ev-0', dur: 300 },
					{ at: range.start(1) + 2960, do: 'enter', el: 'ev-erange' },
					{ at: range.start(1) + 3120, do: 'enter', el: 'lb-erange' },
					// Caption 3: line 11 is the only check that sees it.
					{ at: range.start(2), do: 'exit', el: 'on-4', dur: 400 },
					{ at: range.start(2), do: 'exit', el: 'lb-sat', dur: 400 },
					shot(range.start(2), 'shot-build', 1800),
					runA(range.start(2) + 160, 8),
					runA(range.start(2) + 960, 11),
					light(range.start(2) + 1600, 'on-11', 'm-11'),
					{ at: range.start(2) + 1760, do: 'pulse', el: 'v-errno' },
					runA(range.start(2) + 2400, 12),
					light(range.start(2) + 3040, 'on-12', 'm-12'),
				),
			},
		},

		// ─── Scene 4. Return status and output parameter ────────────────────
		{
			id: 'status',
			chapter: 'status',
			scene: 'journey',
			title: { es: 'Un estado y un parámetro de salida', en: 'A status and an output parameter' },
			subtitles: status.list,
			motion: {
				cues: seq(
					clear(0, 'on-11', 'on-12', 'lb-erange', 'str-3', 'eat-3-0', 'eat-3-1', 'eat-3-2', 'eat-3-3', 'eat-3-4', 'val-max', 'ev-erange'),
					hop(0, 'pin-t', 'a-t-4-0'),
					hop(480, 'pin-f', 'a-f-4-0'),
					shot(0, 'shot-strip-b', 1800),
					{ at: 560, do: 'enter', el: 'str-4', dur: 800 },
					{ at: 640, do: 'enter', el: 'val-q' },
					{ at: 720, do: 'enter', el: 'ev-0' },
					runA(720, 3),
					light(1360, 'on-3', 'm-3'),
					runA(1760, 4),
					{ at: 2000, do: 'exit', el: 'on-3', dur: 400 },
					{ at: 2400, do: 'move', el: 'p', to: 'a-c-4-0', dur: 500 },
					{ at: 2800, do: 'enter', el: 'eat-4-0' },
					{ at: 2880, do: 'move', el: 'p', to: 'a-c-4-1', dur: 500 },
					{ at: 2880, do: 'move', el: 'pin-f', to: 'a-f-4-2', dur: 900 },
					{ at: 3280, do: 'enter', el: 'eat-4-1' },
					{ at: 3360, do: 'exit', el: 'val-q', dur: 300 },
					{ at: 3440, do: 'enter', el: 'val-42' },
					// The caller's floor and the pointer to its variable.
					{ at: 3840, do: 'enter', el: 'f-m', dur: 800 },
					{ at: 4000, do: 'enter', el: 'v-main' },
					{ at: 4080, do: 'enter', el: 'vm-q' },
					{ at: 4160, do: 'enter', el: 'v-res' },
					{ at: 4240, do: 'enter', el: 'res-ptr' },
					// Caption 2: line 14 writes through the pointer.
					{ at: status.start(1), do: 'exit', el: 'on-4', dur: 400 },
					shot(status.start(1), 'shot-main', 2200),
					runA(status.start(1) + 240, 14),
					light(status.start(1) + 880, 'on-14', 'm-14'),
					{ at: status.start(1) + 1040, do: 'draw', el: 'ar-res', dur: 1000 },
					{ at: status.start(1) + 1840, do: 'flow', el: 'ar-res' },
					{ at: status.start(1) + 1920, do: 'enter', el: 'lb-out' },
					{ at: status.start(1) + 2400, do: 'exit', el: 'vm-q', dur: 300 },
					{ at: status.start(1) + 2480, do: 'enter', el: 'vm-42' },
					{ at: status.start(1) + 2640, do: 'pulse', el: 'v-main' },
					// Caption 3: line 15 returns true.
					{ at: status.start(2), do: 'exit', el: 'on-14', dur: 400 },
					runA(status.start(2) + 160, 15),
					light(status.start(2) + 800, 'on-15', 'm-15'),
					{ at: status.start(2) + 1040, do: 'enter', el: 'tk-true' },
					{ at: status.start(2) + 1200, do: 'move', el: 'tk-true', to: 'a-main', dur: 1800 },
					{ at: status.start(2) + 2800, do: 'enter', el: 'lb-status' },
				),
			},
		},

		// ─── Scene 5. The caller checks the status ──────────────────────────
		{
			id: 'caller',
			chapter: 'caller',
			scene: 'journey',
			title: { es: 'El llamador revisa el estado', en: 'The caller checks the status' },
			subtitles: caller.list,
			motion: {
				cues: seq(
					clear(0, 'on-15', 'lb-out', 'lb-status', 'ar-res', 'tk-true', 'hl', 'pin-t', 'pin-f', 'eat-4-0', 'eat-4-1', 'str-4'),
					{ at: 320, do: 'exit', el: 'ed-a', dur: 500 },
					{ at: 320, do: 'exit', el: 'file-a', dur: 500 },
					{ at: 720, do: 'enter', el: 'ed-b', dur: 600 },
					{ at: 720, do: 'enter', el: 'file-b', dur: 600 },
					shot(0, 'shot-caller', 2400),
					MODULES_B.map((line, index) => ({ at: 600 + index * 140, do: 'enter' as const, el: `mb-${line}` })),
					{ at: 1360, do: 'enter', el: 'hl' },
					runB(1360, 4, 700),
					{ at: 1840, do: 'enter', el: 'onb-4' },
					runB(2240, 5, 700),
					{ at: 2560, do: 'exit', el: 'onb-4', dur: 300 },
					{ at: 2720, do: 'enter', el: 'onb-5' },
					runB(3120, 6, 700),
					{ at: 3440, do: 'exit', el: 'onb-5', dur: 300 },
					{ at: 3600, do: 'enter', el: 'onb-6' },
					{ at: 3600, do: 'pulse', el: 'f-m' },
					// Caption 2: false prints the error message, true prints the value.
					{ at: caller.start(1), do: 'exit', el: 'onb-6', dur: 300 },
					{ at: caller.start(1) + 240, do: 'enter', el: 'st-1' },
					runB(caller.start(1) + 720, 9, 700),
					light(caller.start(1) + 1200, 'onb-9', 'mb-9'),
					{ at: caller.start(1) + 1440, do: 'type', el: 'out-1', dur: 900 },
					{ at: caller.start(1) + 2320, do: 'exit', el: 'onb-9', dur: 300 },
					{ at: caller.start(1) + 2480, do: 'enter', el: 'st-2' },
					runB(caller.start(1) + 2800, 9, 600),
					{ at: caller.start(1) + 3200, do: 'enter', el: 'onb-9' },
					{ at: caller.start(1) + 3360, do: 'type', el: 'out-2', dur: 600 },
					// Caption 3: the third input fails again, the fourth works.
					{ at: caller.start(2), do: 'exit', el: 'onb-9', dur: 300 },
					{ at: caller.start(2) + 160, do: 'enter', el: 'st-3' },
					runB(caller.start(2) + 480, 9, 600),
					{ at: caller.start(2) + 960, do: 'enter', el: 'onb-9' },
					{ at: caller.start(2) + 1120, do: 'type', el: 'out-3', dur: 1000 },
					{ at: caller.start(2) + 2080, do: 'exit', el: 'onb-9', dur: 300 },
					{ at: caller.start(2) + 2240, do: 'enter', el: 'st-4' },
					runB(caller.start(2) + 2560, 7, 700),
					light(caller.start(2) + 3120, 'onb-7', 'mb-7'),
					{ at: caller.start(2) + 3280, do: 'type', el: 'out-4', dur: 500 },
					{ at: caller.start(2) + 3360, do: 'pulse', el: 'vm-42' },
				),
			},
		},

		// ─── Scene 6. Three errors, one exit ────────────────────────────────
		{
			id: 'paths',
			chapter: 'exit',
			scene: 'journey',
			title: { es: 'Tres errores, una sola salida', en: 'Three errors, one exit' },
			subtitles: paths.list,
			motion: {
				cues: seq(
					clear(0, 'onb-7', 'st-1', 'st-2', 'st-3', 'st-4'),
					{ at: 240, do: 'exit', el: 'ed-b', dur: 500 },
					{ at: 240, do: 'exit', el: 'file-b', dur: 500 },
					{ at: 640, do: 'enter', el: 'ed-c', dur: 600 },
					{ at: 640, do: 'enter', el: 'file-c', dur: 600 },
					shot(0, 'shot-proc', 2400),
					{ at: 400, do: 'enter', el: 'f-p', dur: 800 },
					{ at: 560, do: 'enter', el: 'f-s', dur: 800 },
					MODULES_C.map((line, index) => ({ at: 900 + index * 110, do: 'enter' as const, el: `mc-${line}` })),
					{ at: 2160, do: 'enter', el: 'v-datos' },
					{ at: 2240, do: 'enter', el: 'v-texto' },
					{ at: 2320, do: 'enter', el: 'pd-null' },
					{ at: 2400, do: 'enter', el: 'pt-null' },
					{ at: 2640, do: 'enter', el: 'hl' },
					runC(2640, 7, 900),
					light(3360, 'onc-7', 'mc-7'),
					runC(3520, 11, 700),
					light(4000, 'onc-11', 'mc-11'),
					// Caption 2: the three paths converge on the same station.
					{ at: paths.start(1), do: 'exit', el: 'onc-7', dur: 400 },
					{ at: paths.start(1), do: 'exit', el: 'onc-11', dur: 400 },
					runC(paths.start(1) + 80, 15, 800),
					light(paths.start(1) + 720, 'onc-15', 'mc-15'),
					{ at: paths.start(1) + 1040, do: 'draw', el: 'fl-g7', dur: 900 },
					{ at: paths.start(1) + 1600, do: 'draw', el: 'fl-g11', dur: 900 },
					{ at: paths.start(1) + 2160, do: 'draw', el: 'fl-g15', dur: 900 },
					{ at: paths.start(1) + 2800, do: 'enter', el: 'lb-one' },
					{ at: paths.start(1) + 3040, do: 'pulse', el: 'f-s' },
					// Caption 3: a run where the second malloc fails.
					{ at: paths.start(2), do: 'exit', el: 'onc-15', dur: 400 },
					{ at: paths.start(2), do: 'exit', el: 'lb-one', dur: 400 },
					runC(paths.start(2) + 160, 9, 800),
					{ at: paths.start(2) + 800, do: 'exit', el: 'pd-null', dur: 300 },
					{ at: paths.start(2) + 880, do: 'enter', el: 'pd-addr' },
					light(paths.start(2) + 800, 'onc-9', 'mc-9'),
					{ at: paths.start(2) + 1300, do: 'exit', el: 'onc-9', dur: 300 },
					runC(paths.start(2) + 1360, 13, 800),
					light(paths.start(2) + 2000, 'onc-13', 'mc-13'),
					{ at: paths.start(2) + 2160, do: 'pulse', el: 'pt-null' },
					runC(paths.start(2) + 2560, 15, 700),
					{ at: paths.start(2) + 2640, do: 'exit', el: 'onc-13', dur: 300 },
					{ at: paths.start(2) + 3120, do: 'enter', el: 'onc-15' },
					{ at: paths.start(2) + 3200, do: 'move', el: 'p', to: 'a-st', dur: 900 },
				),
			},
		},
		{
			id: 'cleanup',
			chapter: 'exit',
			scene: 'journey',
			title: { es: 'Un solo lugar libera todo', en: 'One place releases everything' },
			subtitles: cleanup.list,
			motion: {
				cues: seq(
					clear(0, 'onc-15'),
					shot(0, 'shot-station', 2200),
					{ at: 240, do: 'move', el: 'hl', to: 'ln-c-19', dur: 600 },
					runC(720, 20, 700),
					light(1280, 'onc-20', 'mc-20'),
					{ at: 1440, do: 'enter', el: 'lb-null' },
					{ at: 2000, do: 'exit', el: 'onc-20', dur: 300 },
					runC(2080, 21, 700),
					light(2640, 'onc-21', 'mc-21'),
					{ at: 2800, do: 'enter', el: 'fr-datos' },
					{ at: 2800, do: 'exit', el: 'pd-addr', dur: 300 },
					{ at: 2880, do: 'exit', el: 'lb-null', dur: 400 },
					{ at: 2960, do: 'enter', el: 'lb-free' },
					{ at: 3520, do: 'exit', el: 'onc-21', dur: 300 },
					runC(3600, 22, 700),
					light(4160, 'onc-22', 'mc-22'),
					// Caption 2: when everything works, the same cleanup runs by falling into it.
					{ at: cleanup.start(1), do: 'exit', el: 'onc-22', dur: 400 },
					{ at: cleanup.start(1), do: 'exit', el: 'lb-free', dur: 400 },
					runC(cleanup.start(1) + 240, 17, 900),
					light(cleanup.start(1) + 960, 'onc-17', 'mc-17'),
					{ at: cleanup.start(1) + 1200, do: 'draw', el: 'fl-ok17', dur: 1000 },
					{ at: cleanup.start(1) + 2000, do: 'flow', el: 'fl-ok17' },
					{ at: cleanup.start(1) + 2080, do: 'move', el: 'p', to: 'a-st', dur: 1000 },
					{ at: cleanup.start(1) + 2080, do: 'move', el: 'hl', to: 'ln-c-19', dur: 700 },
					// Caption 3: the camera pulls back to reveal every floor.
					{ at: cleanup.start(2), do: 'exit', el: 'onc-17', dur: 400 },
					shot(cleanup.start(2), 'shot-all', 3400),
					{ at: cleanup.start(2) + 1200, do: 'flow', el: 'fl-g7' },
					{ at: cleanup.start(2) + 1360, do: 'flow', el: 'fl-g11' },
					{ at: cleanup.start(2) + 1520, do: 'flow', el: 'fl-g15' },
					{ at: cleanup.start(2) + 1840, do: 'pulse', el: 'f-a' },
					{ at: cleanup.start(2) + 2000, do: 'pulse', el: 'f-e' },
					{ at: cleanup.start(2) + 2160, do: 'pulse', el: 'f-m' },
					{ at: cleanup.start(2) + 2320, do: 'pulse', el: 'f-p' },
					{ at: cleanup.start(2) + 2480, do: 'pulse', el: 'f-s' },
					{ at: cleanup.start(2) + 2960, do: 'exit', el: 'hl', dur: 400 },
				),
			},
		},
	],
};
