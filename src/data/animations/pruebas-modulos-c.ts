import type { AnimationScript, MotionCue, Subtitle } from './types';

// "A module under test": a short film (about two minutes) for the C lesson "Pruebas, estilo
// y portabilidad". It plays on a single persistent canvas (`data-scene="tests"` in
// `src/components/animaciones/pruebas-modulos-c.astro`): an isometric test line. The test
// machine (`test_calculadora.c`) sends one probe through the machine under test (the
// `calculadora` module) and on to a gate. Every `assert` line is a gate that lets the probe
// through or stops the line. Later the gates vanish (`NDEBUG`), the test runner counts the
// checks and sets the exit status, `make test` runs the whole line, and two platforms read
// the same byte. The editor on the left shows the file being discussed and, under it, the
// terminal with the real output of the lesson programs.

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

/** Several elements leaving together. */
const exitAll = (at: number, ids: string[], dur = 400): MotionCue[] => ids.map((el) => ({ at, do: 'exit', el, dur }));

/** Several elements entering one after another. */
const enterEach = (at: number, gap: number, ids: string[]): MotionCue[] => ids.map((el, index) => ({ at: at + index * gap, do: 'enter', el }));

/**
 * One run of the probe: it starts at the test machine, crosses the machine under test and
 * lands on `to` (an anchor). It reaches the machine at +1500 and the target at +2500.
 */
const cycle = (at: number, to: string, first = false): MotionCue[] => [
	...(first ? [] : [{ at, do: 'exit', el: 'pr', dur: 200 } as MotionCue]),
	{ at: at + 250, do: 'move', el: 'pr', to: 'a-tm', dur: 1 },
	{ at: at + 300, do: 'enter', el: 'pr', dur: 300 },
	{ at: at + 700, do: 'move', el: 'pr', to: 'a-fn', dur: 800 },
	{ at: at + 1500, do: 'pulse', el: 'fn', dur: 600 },
	{ at: at + 1700, do: 'move', el: 'pr', to, dur: 800 },
];

/** Page A of the editor has 13 lines; this types the non-blank ones from the top. */
const typeProgram = (at: number): MotionCue[] =>
	[1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n, index) => ({ at: at + index * 340, do: 'type', el: `ea-${n}`, dur: 320 }));

const gateIds = ['g6', 'g7', 'g8', 'g9', 'g10'];

// ─── Captions ───────────────────────────────────────────────────────────────
const intro = timed(
	say('Una prueba unitaria revisa una función aislada: `calculadora`.', 'A unit test checks one function in isolation: `calculator`.'),
	say('`test_calculadora.c` le da entradas y espera un resultado.', '`test_calculator.c` gives it inputs and expects a result.'),
	say('Cada `assert` es una compuerta: pasa si la condición es verdadera.', 'Each `assert` is a gate: it passes if the condition is true.'),
);
const fail = timed(
	say('`dividir(7, 2)` devuelve `4` en vez de `3`: hay un error.', '`divide(7, 2)` returns `4` instead of `3`: there is a bug.'),
	say('Condición falsa: la compuerta se cierra y el programa se detiene.', 'False condition: the gate closes and the program stops.'),
	say('El mensaje dice qué falló y en qué línea. Código de salida: `134`.', 'The message says what failed and where. Exit code: `134`.'),
);
const fix = timed(
	say('Se corrige `dividir` y cada compuerta se abre.', '`divide` is fixed and every gate opens.'),
	say('Imprime `Todas las pruebas pasaron.` y sale con código `0`.', 'It prints `All tests passed.` and exits with code `0`.'),
);
const cases = timed(
	say('Los errores viven en los bordes: `2 + 3` encuentra pocos.', 'Bugs live at the edges: `2 + 3` finds few of them.'),
	say('Prueba cero y vacío, un elemento, negativos y extremos (`INT_MAX`).', 'Test zero and empty, one element, negatives and extremes (`INT_MAX`).'),
	say('Cada error corregido merece su propia prueba de regresión.', 'Every fixed bug deserves its own regression test.'),
);
const ndebug = timed(
	say('Con `-DNDEBUG`, cada `assert` se reemplaza por nada.', 'With `-DNDEBUG`, every `assert` is replaced by nothing.'),
	say('Con el error de vuelta, `Todas las pruebas pasaron.` sin comprobar nada.', 'With the bug back: `All tests passed.` without checking anything.'),
	say('Nunca compiles pruebas con `NDEBUG` ni pongas efectos en un `assert`.', 'Never build tests with `NDEBUG` or put side effects in an `assert`.'),
);
const runner = timed(
	say('Un ejecutor propio no usa `NDEBUG`: `VERIFICAR` cuenta cada prueba.', 'A runner of your own ignores `NDEBUG`: `CHECK` counts each test.'),
	say('Informa cada falla y sigue: `3 pruebas, 1 fallidas`.', 'It reports each failure and goes on: `3 tests, 1 failed`.'),
	say('Termina con `EXIT_FAILURE`: el estado de salida es `1`.', 'It ends with `EXIT_FAILURE`: the exit status is `1`.'),
);
const make = timed(
	say('`make test` compila y ejecuta todo con un solo comando.', '`make test` builds and runs everything with one command.'),
	say('Si el estado de salida no es `0`, `make` se detiene con un error.', 'If the exit status is not `0`, `make` stops with an error.'),
	say('Con el módulo corregido, todo queda en verde.', 'With the module fixed, everything is green.'),
);
const portable = timed(
	say('`char` puede tener signo o no: lo decide cada máquina.', '`char` may be signed or not: each machine decides.'),
	say('`(char)200` imprime `-56` en x86 y macOS, `200` en ARM Linux.', '`(char)200` prints `-56` on x86 and macOS, `200` on ARM Linux.'),
	say('Los tipos de `<stdint.h>`, como `uint8_t`, fijan ancho y signo.', '`<stdint.h>` types like `uint8_t` fix width and sign.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'unit', label: { es: 'Una prueba unitaria', en: 'A unit test' } },
		{ id: 'assert', label: { es: 'La compuerta assert', en: 'The assert gate' } },
		{ id: 'cases', label: { es: 'Los casos límite', en: 'Boundary cases' } },
		{ id: 'ndebug', label: { es: 'Cuando assert desaparece', en: 'When assert disappears' } },
		{ id: 'runner', label: { es: 'El ejecutor y make', en: 'The runner and make' } },
		{ id: 'portable', label: { es: 'Portabilidad', en: 'Portability' } },
	],
	steps: [
		// ─── Scene 1. A unit test ───────────────────────────────────────────
		{
			id: 'intro',
			chapter: 'unit',
			scene: 'tests',
			title: { es: 'Dos máquinas: el módulo y su prueba', en: 'Two machines: the module and its test' },
			subtitles: intro.list,
			motion: {
				cues: seq(
					shot(0, 'shot-start', 2200),
					...typeProgram(200),
					{ at: 500, do: 'enter', el: 'tm' },
					{ at: 1000, do: 'enter', el: 'fn' },
					{ at: 1500, do: 'pulse', el: 'tm' },
					// The belt, the gates (one per assert line) and the machine that counts.
					shot(intro.start(1), 'shot-line', 2400),
					{ at: intro.start(1) + 300, do: 'draw', el: 'belt', dur: 1500 },
					{ at: intro.start(1) + 800, do: 'enter', el: 'rn' },
					...enterEach(intro.start(1) + 1200, 350, gateIds),
					// The first probe: `sumar(2, 3) == 5` passes the first gate.
					shot(intro.start(2), 'shot-p1', 2000),
					{ at: intro.start(2), do: 'move', el: 'hl', to: 'ln-6', dur: 1 },
					{ at: intro.start(2) + 50, do: 'enter', el: 'hl' },
					...cycle(intro.start(2) + 200, 'a-g6', true),
					{ at: intro.start(2) + 1700, do: 'enter', el: 'r-sum' },
					{ at: intro.start(2) + 2750, do: 'enter', el: 'g6-on' },
					{ at: intro.start(2) + 2750, do: 'pulse', el: 'g6' },
				),
			},
		},

		// ─── Scene 2. The assert gate ───────────────────────────────────────
		{
			id: 'assert-fail',
			chapter: 'assert',
			scene: 'tests',
			title: { es: 'Un assert que falla detiene la línea', en: 'A failing assert stops the line' },
			subtitles: fail.list,
			motion: {
				cues: seq(
					shot(0, 'shot-g7', 2200),
					{ at: 0, do: 'move', el: 'hl', to: 'ln-7', dur: 600 },
					{ at: 0, do: 'exit', el: 'r-sum', dur: 300 },
					{ at: 200, do: 'type', el: 't2-0', dur: 700 },
					// The module has a bug: `dividir(7, 2)` answers 4.
					...cycle(600, 'a-g7'),
					{ at: 2100, do: 'enter', el: 'r-bad' },
					{ at: 2100, do: 'enter', el: 'fn-x' },
					{ at: 2400, do: 'enter', el: 'bug' },
					// The condition is false: the gate closes and nothing past it runs.
					{ at: fail.start(1), do: 'enter', el: 'g7-x' },
					{ at: fail.start(1), do: 'enter', el: 'hx-7' },
					{ at: fail.start(1) + 200, do: 'enter', el: 'cut' },
					{ at: fail.start(1) + 500, do: 'enter', el: 'veil' },
					{ at: fail.start(1) + 700, do: 'pulse', el: 'g7-x' },
					{ at: fail.start(1) + 1000, do: 'type', el: 't2-1', dur: 1200 },
					{ at: fail.start(1) + 2200, do: 'type', el: 't2-2', dur: 800 },
					// The message names the condition, the file and the line; the exit code is not 0.
					{ at: fail.start(2), do: 'enter', el: 'msg' },
					{ at: fail.start(2) + 400, do: 'pulse', el: 'hx-7' },
					{ at: fail.start(2) + 1500, do: 'type', el: 't2-3', dur: 400 },
					{ at: fail.start(2) + 2100, do: 'type', el: 't2-4', dur: 300 },
					{ at: fail.start(2) + 3000, do: 'pulse', el: 'msg' },
				),
			},
		},
		{
			id: 'assert-fix',
			chapter: 'assert',
			scene: 'tests',
			title: { es: 'El error se corrige y las compuertas se abren', en: 'The bug is fixed and the gates open' },
			subtitles: fix.list,
			motion: {
				cues: seq(
					...exitAll(0, ['t2-0', 't2-1', 't2-2', 't2-3', 't2-4', 'g7-x', 'cut', 'veil', 'hx-7', 'msg', 'r-bad', 'bug', 'fn-x']),
					{ at: 600, do: 'enter', el: 'fixc' },
					...cycle(700, 'a-g7'),
					{ at: 2200, do: 'enter', el: 'r-ok' },
					{ at: 3250, do: 'enter', el: 'g7-on' },
					{ at: 3250, do: 'pulse', el: 'g7' },
					// The remaining gates open one after another.
					{ at: 3300, do: 'move', el: 'hl', to: 'ln-8', dur: 250 },
					{ at: 3300, do: 'enter', el: 'g8-on' },
					{ at: 3600, do: 'move', el: 'hl', to: 'ln-9', dur: 250 },
					{ at: 3600, do: 'enter', el: 'g9-on' },
					{ at: 3900, do: 'move', el: 'hl', to: 'ln-10', dur: 250 },
					{ at: 3900, do: 'enter', el: 'g10-on' },
					{ at: fix.start(1) + 100, do: 'type', el: 't3-0', dur: 700 },
					{ at: fix.start(1) + 900, do: 'type', el: 't3-1', dur: 1000 },
					{ at: fix.start(1) + 1000, do: 'move', el: 'hl', to: 'ln-11', dur: 400 },
					{ at: fix.start(1) + 2000, do: 'type', el: 't3-2', dur: 400 },
					{ at: fix.start(1) + 2500, do: 'type', el: 't3-3', dur: 300 },
					{ at: fix.start(1) + 2500, do: 'enter', el: 'rn-ok' },
					{ at: fix.start(1) + 3000, do: 'exit', el: 'pr', dur: 300 },
				),
			},
		},

		// ─── Scene 3. Boundary cases ────────────────────────────────────────
		{
			id: 'cases',
			chapter: 'cases',
			scene: 'tests',
			title: { es: 'Los errores viven en los bordes', en: 'Bugs live at the edges' },
			subtitles: cases.list,
			motion: {
				cues: seq(
					...exitAll(0, ['t3-0', 't3-1', 't3-2', 't3-3', 'fixc', 'r-ok', 'rn-ok']),
					shot(0, 'shot-start', 1800),
					{ at: 300, do: 'move', el: 'hl', to: 'ln-6', dur: 400 },
					{ at: 500, do: 'enter', el: 'r-sum' },
					{ at: 1800, do: 'pulse', el: 'g6-on' },
					{ at: 3500, do: 'exit', el: 'r-sum', dur: 400 },
					// Zero and empty, then one element, negatives and the extremes of the type.
					shot(cases.start(1), 'shot-wide', 2200),
					{ at: cases.start(1) + 300, do: 'move', el: 'hl', to: 'ln-9', dur: 500 },
					{ at: cases.start(1) + 400, do: 'enter', el: 'cs-zero' },
					...cycle(cases.start(1) + 200, 'a-g9'),
					{ at: cases.start(1) + 2700, do: 'pulse', el: 'g9-on' },
					{ at: cases.start(1) + 1300, do: 'enter', el: 'cs-one' },
					{ at: cases.start(1) + 2500, do: 'move', el: 'hl', to: 'ln-8', dur: 500 },
					{ at: cases.start(1) + 2600, do: 'enter', el: 'cs-neg' },
					...cycle(cases.start(1) + 2800, 'a-g8'),
					{ at: cases.start(1) + 3800, do: 'enter', el: 'cs-max' },
					{ at: cases.start(1) + 5300, do: 'pulse', el: 'g8-on' },
					// Every fixed bug becomes a test of its own.
					{ at: cases.start(2) + 300, do: 'enter', el: 'reg' },
					{ at: cases.start(2) + 1500, do: 'pulse', el: 'reg' },
					{ at: cases.start(2) + 2000, do: 'pulse', el: 'fn' },
				),
			},
		},

		// ─── Scene 4. NDEBUG ────────────────────────────────────────────────
		{
			id: 'ndebug',
			chapter: 'ndebug',
			scene: 'tests',
			title: { es: 'NDEBUG hace desaparecer los assert', en: 'NDEBUG makes the asserts disappear' },
			subtitles: ndebug.list,
			motion: {
				cues: seq(
					...exitAll(0, ['t1-0', 't1-1', 't3-0', 't3-1', 't3-2', 't3-3', 'reg', 'cs-zero', 'cs-one', 'cs-neg', 'cs-max', 'pr']),
					shot(0, 'shot-wide', 2200),
					{ at: 300, do: 'type', el: 't5-0', dur: 900 },
					{ at: 1100, do: 'type', el: 't5-1', dur: 900 },
					{ at: 800, do: 'enter', el: 'nd' },
					{ at: 1400, do: 'exit', el: 'hl', dur: 300 },
					// Each gate, with its lit state and its editor line, vanishes from the line.
					...gateIds.flatMap((id, index): MotionCue[] => [
						{ at: 1500 + index * 250, do: 'exit', el: id, dur: 400 },
						{ at: 1500 + index * 250, do: 'exit', el: `${id}-on`, dur: 400 },
						{ at: 1500 + index * 250, do: 'exit', el: `ea-${6 + index}`, dur: 400 },
					]),
					// The bug is back and the probe crosses the empty belt unchecked.
					{ at: ndebug.start(1) + 200, do: 'enter', el: 'fn-x' },
					{ at: ndebug.start(1) + 200, do: 'enter', el: 'bug' },
					{ at: ndebug.start(1) + 300, do: 'type', el: 't5-2', dur: 600 },
					{ at: ndebug.start(1) + 400, do: 'move', el: 'pr', to: 'a-tm', dur: 1 },
					{ at: ndebug.start(1) + 500, do: 'enter', el: 'pr', dur: 300 },
					{ at: ndebug.start(1) + 900, do: 'move', el: 'pr', to: 'a-fn', dur: 800 },
					{ at: ndebug.start(1) + 1300, do: 'type', el: 't5-3', dur: 1000 },
					{ at: ndebug.start(1) + 1700, do: 'pulse', el: 'fn-x' },
					{ at: ndebug.start(1) + 1900, do: 'move', el: 'pr', to: 'a-rn', dur: 1600 },
					{ at: ndebug.start(1) + 3500, do: 'enter', el: 'all' },
					{ at: ndebug.start(1) + 3500, do: 'enter', el: 'rn-ok' },
					{ at: ndebug.start(1) + 3900, do: 'enter', el: 'nochk' },
					{ at: ndebug.start(1) + 4200, do: 'type', el: 't5-4', dur: 900 },
					// A side effect inside an assert disappears with it.
					{ at: ndebug.start(2) + 300, do: 'enter', el: 'fg' },
					{ at: ndebug.start(2) + 1800, do: 'enter', el: 'fg-note' },
					{ at: ndebug.start(2) + 3400, do: 'exit', el: 'fg', dur: 900 },
					{ at: ndebug.start(2) + 3700, do: 'pulse', el: 'fg-note' },
				),
			},
		},

		// ─── Scene 5. The runner and make ───────────────────────────────────
		{
			id: 'runner',
			chapter: 'runner',
			scene: 'tests',
			title: { es: 'Un ejecutor propio cuenta cada prueba', en: 'A runner of your own counts each test' },
			subtitles: runner.list,
			motion: {
				cues: seq(
					...exitAll(0, ['ea', 'nd', 'fg', 'fg-note', 'all', 'nochk', 'rn-ok', 'pr', 't5-0', 't5-1', 't5-2', 't5-3', 't5-4']),
					shot(0, 'shot-wide', 2000),
					{ at: 300, do: 'enter', el: 'eb' },
					{ at: 400, do: 'move', el: 'hl', to: 'ln-5', dur: 1 },
					{ at: 450, do: 'enter', el: 'hl' },
					...enterEach(900, 300, ['v14', 'v15', 'v16']),
					{ at: 1900, do: 'enter', el: 'cr-0' },
					{ at: 2000, do: 'enter', el: 'cf-0' },
					{ at: 2000, do: 'move', el: 'hl', to: 'ln-6', dur: 600 },
					{ at: 3200, do: 'move', el: 'hl', to: 'ln-8', dur: 600 },
					// The first check fails: it is reported and the line keeps going.
					{ at: runner.start(1), do: 'move', el: 'hl', to: 'ln-14', dur: 500 },
					{ at: runner.start(1) + 100, do: 'type', el: 't6-0', dur: 700 },
					...cycle(runner.start(1) + 200, 'a-v14', true),
					{ at: runner.start(1) + 2700, do: 'enter', el: 'v14-x' },
					{ at: runner.start(1) + 2700, do: 'enter', el: 'hx-14' },
					{ at: runner.start(1) + 2800, do: 'exit', el: 'cr-0', dur: 200 },
					{ at: runner.start(1) + 2800, do: 'exit', el: 'cf-0', dur: 200 },
					{ at: runner.start(1) + 2850, do: 'enter', el: 'cr-1', dur: 300 },
					{ at: runner.start(1) + 2850, do: 'enter', el: 'cf-1', dur: 300 },
					{ at: runner.start(1) + 3000, do: 'enter', el: 'fm' },
					{ at: runner.start(1) + 3000, do: 'type', el: 't6-1', dur: 1200 },
					{ at: runner.start(1) + 3700, do: 'move', el: 'hl', to: 'ln-15', dur: 300 },
					{ at: runner.start(1) + 3700, do: 'enter', el: 'v15-on' },
					{ at: runner.start(1) + 3800, do: 'exit', el: 'cr-1', dur: 200 },
					{ at: runner.start(1) + 3850, do: 'enter', el: 'cr-2', dur: 300 },
					{ at: runner.start(1) + 4100, do: 'move', el: 'hl', to: 'ln-16', dur: 300 },
					{ at: runner.start(1) + 4200, do: 'enter', el: 'v16-on' },
					{ at: runner.start(1) + 4300, do: 'exit', el: 'cr-2', dur: 200 },
					{ at: runner.start(1) + 4350, do: 'enter', el: 'cr-3', dur: 300 },
					{ at: runner.start(1) + 4500, do: 'move', el: 'hl', to: 'ln-17', dur: 300 },
					{ at: runner.start(1) + 4600, do: 'type', el: 't6-2', dur: 700 },
					// The exit status is what other programs read.
					{ at: runner.start(2), do: 'move', el: 'hl', to: 'ln-19', dur: 500 },
					{ at: runner.start(2) + 200, do: 'enter', el: 'rn-x' },
					{ at: runner.start(2) + 400, do: 'enter', el: 'st-1' },
					{ at: runner.start(2) + 1200, do: 'type', el: 't6-3', dur: 400 },
					{ at: runner.start(2) + 1800, do: 'type', el: 't6-4', dur: 300 },
					{ at: runner.start(2) + 2400, do: 'pulse', el: 'st-1' },
				),
			},
		},
		{
			id: 'make',
			chapter: 'runner',
			scene: 'tests',
			title: { es: 'make test ejecuta toda la línea', en: 'make test runs the whole line' },
			subtitles: make.list,
			motion: {
				cues: seq(
					...exitAll(0, ['eb', 'hl', 'v14', 'v14-x', 'v15', 'v15-on', 'v16', 'v16-on', 'hx-14', 'cr-3', 'cf-1', 'fm', 'st-1', 'rn-x', 'pr', 't6-0', 't6-1', 't6-2', 't6-3', 't6-4']),
					shot(0, 'shot-mk', 2200),
					{ at: 300, do: 'enter', el: 'ec' },
					{ at: 500, do: 'move', el: 'hl', to: 'ln-3', dur: 1 },
					{ at: 600, do: 'enter', el: 'hl' },
					{ at: 800, do: 'enter', el: 'mk' },
					{ at: 1400, do: 'draw', el: 'fl-mk', dur: 1200 },
					{ at: 2000, do: 'enter', el: 'mk-on' },
					{ at: 2000, do: 'pulse', el: 'mk' },
					{ at: 2000, do: 'move', el: 'hl', to: 'ln-4', dur: 400 },
					{ at: 2200, do: 'type', el: 't7-0', dur: 600 },
					{ at: 2600, do: 'move', el: 'hl', to: 'ln-5', dur: 400 },
					// A non-zero status stops `make`.
					{ at: make.start(1) + 300, do: 'exit', el: 'mk-on', dur: 300 },
					{ at: make.start(1) + 400, do: 'enter', el: 'mk-x' },
					{ at: make.start(1) + 500, do: 'enter', el: 'mkerr' },
					{ at: make.start(1) + 1500, do: 'pulse', el: 'mk-x' },
					// With the module fixed, the same command ends in green.
					...exitAll(make.start(2), ['mkerr', 'mk-x', 'bug', 'fn-x']),
					{ at: make.start(2) + 300, do: 'enter', el: 'fixc' },
					{ at: make.start(2) + 800, do: 'enter', el: 'mk-on' },
					{ at: make.start(2) + 800, do: 'flow', el: 'fl-mk' },
					...['t7-1', 't7-2', 't7-3', 't7-4', 't7-5', 't7-6'].map((el, index): MotionCue => ({ at: make.start(2) + 900 + index * 450, do: 'type', el, dur: 400 })),
				),
			},
		},

		// ─── Scene 6. Portability ───────────────────────────────────────────
		{
			id: 'portable',
			chapter: 'portable',
			scene: 'tests',
			title: { es: 'El mismo byte en dos plataformas', en: 'The same byte on two platforms' },
			subtitles: portable.list,
			motion: {
				cues: seq(
					...exitAll(0, ['ec', 'hl', 'mk', 'mk-on', 'fl-mk', 'fixc', 't7-0', 't7-1', 't7-2', 't7-3', 't7-4', 't7-5', 't7-6']),
					shot(0, 'shot-port', 2400),
					{ at: 200, do: 'type', el: 't8-0', dur: 900 },
					{ at: 300, do: 'enter', el: 'ed' },
					{ at: 500, do: 'move', el: 'hl', to: 'ln-6', dur: 1 },
					{ at: 600, do: 'enter', el: 'hl' },
					{ at: 900, do: 'enter', el: 'bay-a' },
					{ at: 1200, do: 'enter', el: 'bay-b' },
					{ at: 1300, do: 'type', el: 't8-1', dur: 500 },
					{ at: 1800, do: 'enter', el: 'by' },
					// `char` is read as -56 on one platform and as 200 on the other.
					{ at: portable.start(1) + 200, do: 'move', el: 'by', to: 'a-bay-a', dur: 1300 },
					{ at: portable.start(1) + 1500, do: 'enter', el: 'rs-a1' },
					{ at: portable.start(1) + 1500, do: 'type', el: 't8-2', dur: 300 },
					{ at: portable.start(1) + 2200, do: 'move', el: 'by', to: 'a-bay-b', dur: 1300 },
					{ at: portable.start(1) + 3500, do: 'enter', el: 'rs-b1' },
					{ at: portable.start(1) + 3700, do: 'type', el: 't8-5', dur: 1000 },
					// `uint8_t` and `int32_t` fix width and sign: the same value everywhere.
					{ at: portable.start(2), do: 'move', el: 'hl', to: 'ln-7', dur: 400 },
					{ at: portable.start(2) + 100, do: 'exit', el: 'by', dur: 300 },
					{ at: portable.start(2) + 300, do: 'enter', el: 'bu' },
					{ at: portable.start(2) + 500, do: 'move', el: 'bu', to: 'a-bay-a', dur: 1100 },
					{ at: portable.start(2) + 1600, do: 'enter', el: 'rs-a2' },
					{ at: portable.start(2) + 1600, do: 'type', el: 't8-3', dur: 300 },
					{ at: portable.start(2) + 1800, do: 'move', el: 'bu', to: 'a-bay-b', dur: 1100 },
					{ at: portable.start(2) + 2900, do: 'enter', el: 'rs-b2' },
					{ at: portable.start(2) + 2900, do: 'type', el: 't8-4', dur: 600 },
					// The camera pulls back to reveal the whole test line.
					{ at: portable.start(2) + 3000, do: 'camera', to: 'all', dur: 2600 },
					{ at: portable.start(2) + 3300, do: 'enter', el: 'szl' },
					{ at: portable.start(2) + 3700, do: 'enter', el: 'szf' },
					{ at: portable.start(2) + 3900, do: 'draw', el: 'fl-belt', dur: 900 },
					{ at: portable.start(2) + 4900, do: 'flow', el: 'fl-belt' },
				),
			},
		},
	],
};
