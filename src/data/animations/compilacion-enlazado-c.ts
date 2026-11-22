import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of hello.c to an executable": a short film (about two minutes) for the
// C lesson "Compilación, enlazado y advertencias". It plays on a single persistent
// canvas (`data-scene="build"` in `src/components/animaciones/compilacion-enlazado-c.astro`):
// an isometric build line with four stations (preprocessor, compiler, assembler,
// linker), a shelf with the C standard library and a pad where the executable runs.
// One object travels the line: the program file, which changes state at each station
// (source, preprocessed text, assembly, object file, executable). The editor on the
// left shows the source and, under it, the terminal with the commands of the lesson.

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

// ─── Captions ───────────────────────────────────────────────────────────────
const intro = timed(
	say('Este es `programa.c`: texto en C que la computadora todavía no puede ejecutar.', 'This is `program.c`: C text that the computer cannot run yet.'),
	say('`gcc` parece hacer una sola cosa, pero coordina cuatro etapas, una detrás de otra.', '`gcc` seems to do one thing, but it coordinates four stages, one after another.'),
);
const pre = timed(
	say('El preprocesador atiende las líneas con `#`: `#include` pega todo `stdio.h`.', 'The preprocessor handles the lines with `#`: `#include` pastes in all of `stdio.h`.'),
	say('`stdio.h` declara `printf`. La macro `SALUDO` se reemplaza por `"Hola, C"`.', '`stdio.h` declares `printf`. The macro `GREETING` is replaced by `"Hello, C"`.'),
	say('El archivo crece a cientos de líneas. El compilador nunca ve las macros.', 'The file grows to hundreds of lines. The compiler never sees the macros.'),
);
const compile = timed(
	say('El compilador revisa las reglas del lenguaje: sintaxis y tipos.', 'The compiler checks the rules of the language: syntax and types.'),
	say('Luego traduce a ensamblador: `programa.s`, con instrucciones como `mov` o `call`.', 'Then it translates to assembly: `program.s`, with instructions like `mov` or `call`.'),
);
const assemble = timed(
	say('El ensamblador genera un archivo objeto, `programa.o`: código máquina.', 'The assembler produces an object file, `program.o`: machine code.'),
	say('Todavía no se puede ejecutar: usa `printf` sin saber dónde está su código.', 'It cannot run yet: it uses `printf` without knowing where its code is.'),
);
const link = timed(
	say('El enlazador une el archivo objeto con las bibliotecas que necesita.', 'The linker joins the object file with the libraries it needs.'),
	say('El código de `printf` está en la biblioteca estándar de C: el enlazador lo agrega.', 'The code of `printf` lives in the C standard library: the linker adds it.'),
	say('El resultado es el ejecutable: `programa`.', 'The result is the executable: `program`.'),
);
const run = timed(
	say('`./programa` lo ejecuta: imprime `Hola, C` y termina.', '`./program` runs it: it prints `Hello, C` and ends.'),
	say('Fuente, objeto y ejecutable son tres archivos distintos. Solo el último se ejecuta.', 'Source, object and executable are three different files. Only the last one runs.'),
);
const error = timed(
	say('Ahora `prinft` está mal escrito. Con C23, el compilador detiene el viaje.', 'Now `prinft` is misspelled. With C23, the compiler stops the journey.'),
	say('El mensaje indica archivo, línea y columna: `4:5`. No se genera `programa.o`.', 'The message gives file, line and column: `4:5`. No `program.o` is produced.'),
	say('En C89 era solo una advertencia y el error aparecía al enlazar: `undefined reference`.', 'In C89 it was only a warning and the error showed up when linking: `undefined reference`.'),
);
const warnings = timed(
	say('El curso compila con `-Wall -Wextra -Wpedantic`: las advertencias se encienden.', 'The course compiles with `-Wall -Wextra -Wpedantic`: warnings turn on.'),
	say('Una advertencia no detiene la compilación: el programa compila y falla después.', 'A warning does not stop compilation: the program builds and fails later.'),
	say('Por eso se corrigen todas: una advertencia es un error que todavía no te mordió.', 'So you fix them all: a warning is a bug that has not bitten you yet.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'source', label: { es: 'Un archivo fuente', en: 'A source file' } },
		{ id: 'preprocess', label: { es: 'El preprocesador', en: 'The preprocessor' } },
		{ id: 'translate', label: { es: 'Compilar y ensamblar', en: 'Compile and assemble' } },
		{ id: 'link', label: { es: 'El enlazador', en: 'The linker' } },
		{ id: 'errors', label: { es: '¿En qué etapa falla?', en: 'Which stage fails?' } },
		{ id: 'warnings', label: { es: 'Las advertencias', en: 'Warnings' } },
	],
	steps: [
		// ─── Scene 1. A source file ─────────────────────────────────────────
		{
			id: 'intro',
			chapter: 'source',
			scene: 'build',
			title: { es: 'Del texto al ejecutable', en: 'From text to executable' },
			subtitles: intro.list,
			motion: {
				cues: seq(
					shot(0, 'shot-start', 2400),
					{ at: 200, do: 'type', el: 'ea-1', dur: 700 },
					{ at: 950, do: 'type', el: 'ea-2', dur: 100 },
					{ at: 1100, do: 'type', el: 'ea-3', dur: 800 },
					{ at: 1950, do: 'type', el: 'ea-4', dur: 100 },
					{ at: 2100, do: 'type', el: 'ea-5', dur: 600 },
					{ at: 2750, do: 'type', el: 'ea-6', dur: 700 },
					{ at: 3500, do: 'type', el: 'ea-7', dur: 500 },
					{ at: 4050, do: 'type', el: 'ea-8', dur: 100 },
					{ at: 600, do: 'enter', el: 'doc' },
					{ at: 1400, do: 'pulse', el: 'doc' },
					shot(intro.start(1), 'shot-line', 2400),
					{ at: intro.start(1) + 100, do: 'type', el: 'ta-0', dur: 900 },
					{ at: intro.start(1) + 300, do: 'draw', el: 'belt', dur: 1600 },
					{ at: intro.start(1) + 700, do: 'enter', el: 'st-pre' },
					{ at: intro.start(1) + 1100, do: 'enter', el: 'st-cc' },
					{ at: intro.start(1) + 1500, do: 'enter', el: 'st-as' },
					{ at: intro.start(1) + 1900, do: 'enter', el: 'st-ld' },
					{ at: intro.start(1) + 2300, do: 'enter', el: 'pad' },
				),
			},
		},

		// ─── Scene 2. The preprocessor ──────────────────────────────────────
		{
			id: 'preprocess',
			chapter: 'preprocess',
			scene: 'build',
			title: { es: 'El preprocesador resuelve las directivas', en: 'The preprocessor resolves the directives' },
			subtitles: pre.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'ta-0', dur: 400 },
					shot(0, 'shot-pre', 2000),
					{ at: 200, do: 'type', el: 'tb-0', dur: 600 },
					{ at: 400, do: 'draw', el: 'fl-1', dur: 900 },
					{ at: 500, do: 'move', el: 'doc', to: 'a-pre', dur: 1200 },
					{ at: 1700, do: 'enter', el: 'pre-on' },
					{ at: 1700, do: 'pulse', el: 'st-pre' },
					{ at: 1800, do: 'enter', el: 'hl' },
					// `#include`: the whole header falls into the file.
					{ at: 2200, do: 'enter', el: 'hdr' },
					{ at: 3200, do: 'move', el: 'hdr', to: 'a-pre', dy: -20, dur: 1100 },
					{ at: 4300, do: 'exit', el: 'hdr', dur: 300 },
					{ at: 4300, do: 'exit', el: 'd-src', dur: 300 },
					{ at: 4400, do: 'enter', el: 'd-pre', dur: 700 },
					{ at: 4500, do: 'type', el: 'tb-1', dur: 700 },
					// `#define`: every use of the macro is replaced by its text.
					{ at: pre.start(1) + 600, do: 'move', el: 'hl', to: 'la-3', dur: 600 },
					{ at: pre.start(1) + 1300, do: 'enter', el: 'mac' },
					{ at: pre.start(1) + 2400, do: 'move', el: 'hl', to: 'la-6', dur: 700 },
					{ at: pre.start(1) + 2600, do: 'type', el: 'tb-2', dur: 400 },
					{ at: pre.start(1) + 3100, do: 'type', el: 'tb-3', dur: 900 },
					{ at: pre.start(1) + 4100, do: 'type', el: 'tb-4', dur: 300 },
					{ at: pre.start(1) + 4500, do: 'type', el: 'tb-5', dur: 100 },
					{ at: pre.start(2) + 300, do: 'pulse', el: 'doc' },
					{ at: pre.start(2) + 1500, do: 'exit', el: 'mac', dur: 400 },
				),
			},
		},

		// ─── Scene 3. Compile and assemble ──────────────────────────────────
		{
			id: 'compile',
			chapter: 'translate',
			scene: 'build',
			title: { es: 'El compilador traduce a ensamblador', en: 'The compiler translates to assembly' },
			subtitles: compile.list,
			motion: {
				cues: seq(
					...exitAll(0, ['tb-0', 'tb-1', 'tb-2', 'tb-3', 'tb-4', 'tb-5', 'pre-on']),
					shot(0, 'shot-cc', 2000),
					{ at: 200, do: 'type', el: 'tc-0', dur: 600 },
					{ at: 300, do: 'draw', el: 'fl-2', dur: 900 },
					{ at: 400, do: 'move', el: 'doc', to: 'a-cc', dur: 1300 },
					{ at: 400, do: 'move', el: 'hl', to: 'la-5', dur: 600 },
					{ at: 1700, do: 'enter', el: 'cc-on' },
					{ at: 1700, do: 'pulse', el: 'st-cc' },
					// The compiler reads every line of `main` against the rules.
					{ at: 1900, do: 'move', el: 'hl', to: 'la-6', dur: 500 },
					{ at: 2500, do: 'move', el: 'hl', to: 'la-7', dur: 500 },
					{ at: 3100, do: 'move', el: 'hl', to: 'la-8', dur: 500 },
					{ at: 3400, do: 'enter', el: 'chk' },
					{ at: compile.start(1) + 300, do: 'exit', el: 'd-pre', dur: 300 },
					{ at: compile.start(1) + 400, do: 'enter', el: 'd-asm', dur: 700 },
					{ at: compile.start(1) + 600, do: 'type', el: 'tc-1', dur: 600 },
					{ at: compile.start(1) + 1400, do: 'pulse', el: 'doc' },
					{ at: compile.start(1) + 3000, do: 'exit', el: 'chk', dur: 400 },
				),
			},
		},
		{
			id: 'assemble',
			chapter: 'translate',
			scene: 'build',
			title: { es: 'El ensamblador produce el archivo objeto', en: 'The assembler produces the object file' },
			subtitles: assemble.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'cc-on', dur: 400 },
					shot(0, 'shot-as', 1800),
					{ at: 200, do: 'type', el: 'tc-2', dur: 800 },
					{ at: 300, do: 'draw', el: 'fl-3', dur: 900 },
					{ at: 400, do: 'move', el: 'doc', to: 'a-as', dur: 1300 },
					{ at: 1700, do: 'enter', el: 'as-on' },
					{ at: 1700, do: 'pulse', el: 'st-as' },
					{ at: 2000, do: 'exit', el: 'd-asm', dur: 300 },
					{ at: 2100, do: 'enter', el: 'd-obj', dur: 700 },
					{ at: 2300, do: 'type', el: 'tc-3', dur: 500 },
					// The call to `printf` is still an unresolved reference.
					{ at: assemble.start(1) + 200, do: 'move', el: 'hl', to: 'la-6', dur: 600 },
					{ at: assemble.start(1) + 600, do: 'enter', el: 'sock' },
					{ at: assemble.start(1) + 1300, do: 'pulse', el: 'sock' },
					{ at: assemble.start(1) + 2800, do: 'pulse', el: 'sock' },
				),
			},
		},

		// ─── Scene 4. The linker ────────────────────────────────────────────
		{
			id: 'link',
			chapter: 'link',
			scene: 'build',
			title: { es: 'El enlazador completa el programa', en: 'The linker completes the program' },
			subtitles: link.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'as-on', dur: 400 },
					shot(0, 'shot-ld', 2200),
					{ at: 200, do: 'type', el: 'tc-4', dur: 800 },
					{ at: 300, do: 'draw', el: 'fl-4', dur: 900 },
					{ at: 400, do: 'move', el: 'doc', to: 'a-ld', dur: 1300 },
					{ at: 1000, do: 'enter', el: 'lib' },
					{ at: 1300, do: 'enter', el: 'pc' },
					{ at: 1700, do: 'enter', el: 'ld-on' },
					{ at: 1700, do: 'pulse', el: 'st-ld' },
					// `printf` comes from the standard library and fills the open reference.
					{ at: link.start(1) + 200, do: 'enter', el: 'lib-on' },
					{ at: link.start(1) + 400, do: 'pulse', el: 'pc' },
					{ at: link.start(1) + 1000, do: 'draw', el: 'fl-lib', dur: 900 },
					{ at: link.start(1) + 1200, do: 'move', el: 'pc', to: 'a-sock', dur: 1500 },
					{ at: link.start(1) + 2700, do: 'exit', el: 'pc', dur: 200 },
					{ at: link.start(1) + 2700, do: 'exit', el: 'sock', dur: 200 },
					{ at: link.start(1) + 2700, do: 'exit', el: 'd-obj', dur: 200 },
					{ at: link.start(1) + 2800, do: 'enter', el: 'd-exe', dur: 700 },
					{ at: link.start(2), do: 'type', el: 'tc-5', dur: 400 },
					{ at: link.start(2) + 200, do: 'pulse', el: 'doc' },
				),
			},
		},
		{
			id: 'run',
			chapter: 'link',
			scene: 'build',
			title: { es: 'El ejecutable corre', en: 'The executable runs' },
			subtitles: run.list,
			motion: {
				cues: seq(
					...exitAll(0, ['ld-on', 'lib-on']),
					shot(0, 'shot-run', 2000),
					{ at: 200, do: 'type', el: 'tc-6', dur: 500 },
					{ at: 300, do: 'draw', el: 'fl-5', dur: 900 },
					{ at: 400, do: 'move', el: 'doc', to: 'a-run', dur: 1300 },
					{ at: 400, do: 'move', el: 'hl', to: 'la-5', dur: 600 },
					{ at: 1700, do: 'enter', el: 'run-on' },
					{ at: 1700, do: 'pulse', el: 'pad' },
					{ at: 1900, do: 'move', el: 'hl', to: 'la-6', dur: 500 },
					{ at: 2400, do: 'type', el: 'tc-7', dur: 500 },
					{ at: 2400, do: 'enter', el: 'say' },
					{ at: 3300, do: 'move', el: 'hl', to: 'la-7', dur: 500 },
					// Pull back: the same file, three states, one line of stations.
					{ at: run.start(1), do: 'camera', to: 'all', dur: 2600 },
					{ at: run.start(1) + 600, do: 'flow', el: 'fl-1' },
					{ at: run.start(1) + 600, do: 'flow', el: 'fl-2' },
					{ at: run.start(1) + 600, do: 'flow', el: 'fl-3' },
					{ at: run.start(1) + 600, do: 'flow', el: 'fl-4' },
					{ at: run.start(1) + 600, do: 'flow', el: 'fl-5' },
					{ at: run.start(1) + 1200, do: 'enter', el: 'k-src' },
					{ at: run.start(1) + 1900, do: 'enter', el: 'k-obj' },
					{ at: run.start(1) + 2600, do: 'enter', el: 'k-exe' },
				),
			},
		},

		// ─── Scene 5. Which stage fails? ────────────────────────────────────
		{
			id: 'error',
			chapter: 'errors',
			scene: 'build',
			title: { es: 'Un error de compilación', en: 'A compile error' },
			subtitles: error.list,
			motion: {
				cues: seq(
					// The previous build is cleared; the misspelled program starts over.
					...exitAll(0, ['doc', 'say', 'run-on', 'k-src', 'k-obj', 'k-exe', 'fl-1', 'fl-2', 'fl-3', 'fl-4', 'fl-5', 'fl-lib', 'hl']),
					...exitAll(0, ['tc-0', 'tc-1', 'tc-2', 'tc-3', 'tc-4', 'tc-5', 'tc-6', 'tc-7']),
					{ at: 300, do: 'exit', el: 'ea', dur: 400 },
					{ at: 500, do: 'move', el: 'doc', to: 'a-start', dur: 1 },
					{ at: 500, do: 'exit', el: 'd-exe', dur: 1 },
					{ at: 600, do: 'enter', el: 'd-src', dur: 1 },
					shot(500, 'shot-err', 2200),
					{ at: 800, do: 'enter', el: 'eb' },
					{ at: 1000, do: 'enter', el: 'doc' },
					{ at: 1400, do: 'type', el: 'td-0', dur: 1200 },
					{ at: 1600, do: 'enter', el: 'fl-1', dur: 400 },
					{ at: 1700, do: 'move', el: 'doc', to: 'a-pre', dur: 1000 },
					{ at: 2700, do: 'exit', el: 'd-src', dur: 200 },
					{ at: 2700, do: 'enter', el: 'd-pre', dur: 400 },
					{ at: 3000, do: 'enter', el: 'fl-2', dur: 400 },
					{ at: 3100, do: 'move', el: 'doc', to: 'a-cc', dur: 1100 },
					{ at: 600, do: 'move', el: 'hl', to: 'lb-3', dur: 1 },
					{ at: 1500, do: 'enter', el: 'hl' },
					{ at: 3100, do: 'move', el: 'hl', to: 'lb-4', dur: 600 },
					// The compiler finds no declaration of `prinft` and stops.
					{ at: error.start(0) + 4200, do: 'exit', el: 'd-pre', dur: 200 },
					{ at: error.start(0) + 4200, do: 'enter', el: 'd-bad', dur: 400 },
					{ at: error.start(0) + 4200, do: 'enter', el: 'cc-x' },
					{ at: error.start(0) + 4300, do: 'enter', el: 'hx-b4' },
					{ at: error.start(0) + 4300, do: 'exit', el: 'hl', dur: 300 },
					{ at: error.start(0) + 4300, do: 'enter', el: 'cut' },
					{ at: error.start(0) + 4500, do: 'pulse', el: 'st-cc' },
					{ at: error.start(1), do: 'type', el: 'td-1', dur: 500 },
					{ at: error.start(1) + 500, do: 'type', el: 'td-2', dur: 900 },
					{ at: error.start(1) + 1400, do: 'type', el: 'td-3', dur: 600 },
					{ at: error.start(1) + 2000, do: 'type', el: 'td-4', dur: 500 },
					{ at: error.start(1) + 2500, do: 'type', el: 'td-5', dur: 400 },
					{ at: error.start(1) + 2500, do: 'enter', el: 'err' },
					{ at: error.start(1) + 3000, do: 'enter', el: 'veil' },
					{ at: error.start(1) + 3300, do: 'enter', el: 'no-o' },
					// In old C the same typo got through and only the linker could not find it.
					{ at: error.start(2) + 300, do: 'draw', el: 'c89', dur: 1400 },
					{ at: error.start(2) + 1700, do: 'enter', el: 'c89-note' },
					{ at: error.start(2) + 1900, do: 'type', el: 'td-6', dur: 800 },
				),
			},
		},

		// ─── Scene 6. Warnings ──────────────────────────────────────────────
		{
			id: 'warnings',
			chapter: 'warnings',
			scene: 'build',
			title: { es: 'Las advertencias encendidas', en: 'Warnings turned on' },
			subtitles: warnings.list,
			motion: {
				cues: seq(
					...exitAll(0, ['c89', 'c89-note', 'no-o', 'err']),
					shot(200, 'shot-lamp', 2000),
					{ at: 600, do: 'enter', el: 'lamp' },
					{ at: 1400, do: 'enter', el: 'w-1' },
					{ at: 1800, do: 'enter', el: 'w-2' },
					{ at: 2200, do: 'enter', el: 'w-3' },
					{ at: 2600, do: 'enter', el: 'w-4' },
					{ at: 3100, do: 'enter', el: 'lamp-on', dur: 800 },
					{ at: 3300, do: 'type', el: 'td-7', dur: 800 },
					{ at: 3900, do: 'pulse', el: 'lamp-on' },
					// A warning does not stop the line: the file still comes out.
					{ at: warnings.start(1) + 200, do: 'enter', el: 'w-note' },
					{ at: warnings.start(1) + 1200, do: 'pulse', el: 'w-note' },
					// The camera pulls back to reveal the whole build line.
					{ at: warnings.start(2), do: 'camera', to: 'all', dur: 3000 },
					{ at: warnings.start(2) + 300, do: 'exit', el: 'w-note', dur: 400 },
					{ at: warnings.start(2) + 600, do: 'flow', el: 'fl-1' },
					{ at: warnings.start(2) + 600, do: 'flow', el: 'fl-2' },
					{ at: warnings.start(2) + 2600, do: 'pulse', el: 'lamp-on' },
				),
			},
		},
	],
};
