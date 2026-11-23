import type { AnimationScript, MotionCue, Subtitle } from './types';

// "From one file to a multi-file project": a short film (about two minutes) for the C lesson
// "Modularización y Funciones". It plays on a single persistent canvas
// (`data-scene="project"` in `src/components/animaciones/funciones-modulos-c.astro`):
// the editor on the left shows the three files of the lesson's multi-file example in turn
// (`calculadora.h`, `calculadora.c`, `main.c`) and, below it, the build commands with their
// real output; the isometric system on the right is the project. The sources stand on the
// back row, the object files (`.o`) below them and the executable at the bottom. A light blue
// particle is the build flow, the light blue card is a declaration (the prototype) that is
// copied into another file, magenta marks what is unresolved and violet what defines,
// guards or resolves.

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
		at += readingMs(sub) + 100;
		return placed;
	});
	return { list, start: (index: number) => starts[index] ?? 0 };
}

/** Cues in chronological order: later cues must be scheduled after the ones they override. */
const seq = (...cues: MotionCue[]): MotionCue[] => cues.map((cue, index) => ({ cue, index })).sort((a, b) => a.cue.at - b.cue.at || a.index - b.index).map((entry) => entry.cue);

/** Camera cue that frames one of the `shot-*` anchors exactly (they carry their own zoom). */
const shot = (at: number, to: string, dur: number): MotionCue => ({ at, do: 'camera', to: [to], dur, pad: 0 });

/** Types the lines `from..to` of a file one after another (`prefix` is `eh-`, `ec-` or `em-`). */
function typeLines(prefix: string, from: number, to: number, at: number, gap: number, dur: number): MotionCue[] {
	const cues: MotionCue[] = [];
	for (let line = from; line <= to; line += 1) cues.push({ at: at + (line - from) * gap, do: 'type', el: `${prefix}${line}`, dur });
	return cues;
}

// ─── Captions ───────────────────────────────────────────────────────────────
const header = timed(
	say('Tres archivos: `calculadora.h`, `calculadora.c` y `main.c`.', 'Three files: `calculator.h`, `calculator.c` and `main.c`.'),
	say('El `.h` declara `int sumar(int a, int b);`: un prototipo.', 'The `.h` declares `int add(int a, int b);`: a prototype.'),
	say('Da el nombre, los tipos de los parámetros y el tipo de retorno.', 'It gives the name, the parameter types and the return type.'),
);
const include = timed(
	say('`main.c` llama a `sumar` en la línea 8, pero no la define.', '`main.c` calls `add` on line 8 but does not define it.'),
	say('`#include "calculadora.h"` copia el prototipo en `main.c`.', '`#include "calculator.h"` copies the prototype into `main.c`.'),
	say('Con él, el compilador comprueba argumentos y retorno.', 'With it, the compiler checks the arguments and the return type.'),
);
const guard = timed(
	say('Un encabezado puede llegar dos veces a un mismo archivo.', 'A header can reach the same file twice.'),
	say('La primera vez, `#ifndef` ve que el nombre no existe y lo define.', 'The first time, `#ifndef` sees the name is new and defines it.'),
	say('La segunda, `CALCULADORA_H` ya existe: se salta hasta `#endif`.', 'The second time, `CALCULATOR_H` exists: it skips to `#endif`.'),
);
const compile = timed(
	say('Cada `.c` se compila por separado con `-c`: sale un `.o`.', 'Each `.c` is compiled on its own with `-c`: out comes a `.o`.'),
	say('`calculadora.o` lleva la definición de `sumar`.', '`calculator.o` carries the definition of `add`.'),
	say('`main.o` deja la llamada a `sumar` como referencia pendiente.', '`main.o` leaves the call to `add` as a pending reference.'),
);
const link = timed(
	say('El enlazador une los `.o` y busca lo que `main.o` necesita.', 'The linker joins the `.o` files and looks for what `main.o` needs.'),
	say('Halla `sumar` en `calculadora.o` y resuelve la referencia.', 'It finds `add` in `calculator.o` and resolves the reference.'),
	say('Resultado: un ejecutable que imprime `5 + 3 = 8`.', 'Result: an executable that prints `5 + 3 = 8`.'),
);
const missing = timed(
	say('Si olvidas `calculadora.o`, `main.o` ya compiló bien.', 'If you leave out `calculator.o`, `main.o` already compiled fine.'),
	say('Pero el enlazador no halla ninguna definición de `sumar`.', 'But the linker finds no definition of `add`.'),
	say('Es un símbolo indefinido: referencia sin definición.', 'It is an undefined symbol: a reference with no definition.'),
);
const contract = timed(
	say('El `.h` es la interfaz: lo que el módulo ofrece.', 'The `.h` is the interface: what the module offers.'),
	say('El `.c` es la implementación: cómo se cumple.', 'The `.c` is the implementation: how it is fulfilled.'),
	say('Si solo cambia el `.c`, `main.c` no cambia: se recompila `calculadora.c`.', 'If only the `.c` changes, `main.c` does not: `calculator.c` is rebuilt.'),
);
const hidden = timed(
	say('`cuadrado` es `static`: solo se ve dentro de `calculadora.c`.', '`square` is `static`: it is visible only inside `calculator.c`.'),
	say('No está en el `.h` y el enlazador no se la ofrece a `main.o`.', 'It is not in the `.h` and the linker does not offer it to `main.o`.'),
	say('Regla: lo que no figura en el `.h` debería ser `static`.', 'Rule of thumb: whatever is not in the `.h` should be `static`.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'prototype', label: { es: 'El prototipo', en: 'The prototype' } },
		{ id: 'guard', label: { es: 'La guarda de inclusión', en: 'The include guard' } },
		{ id: 'objects', label: { es: 'Un .o por cada .c', en: 'One .o per .c' } },
		{ id: 'linker', label: { es: 'El enlazador', en: 'The linker' } },
		{ id: 'undefined', label: { es: 'Un símbolo indefinido', en: 'An undefined symbol' } },
		{ id: 'interface', label: { es: 'Interfaz e implementación', en: 'Interface and implementation' } },
	],
	steps: [
		// ─── Scene 1. The prototype ─────────────────────────────────────────
		{
			id: 'header',
			chapter: 'prototype',
			scene: 'project',
			title: { es: 'El encabezado declara la función', en: 'The header declares the function' },
			subtitles: header.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 1600),
					{ at: 200, do: 'enter', el: 'z-c' },
					{ at: 450, do: 'enter', el: 'z-h' },
					{ at: 700, do: 'enter', el: 'z-m' },
					{ at: 900, do: 'enter', el: 'fh' },
					...typeLines('eh-', 1, 7, 1000, 330, 320),
					{ at: header.start(1), do: 'camera', to: ['shot-h'], dur: 2600, pad: 0 },
					{ at: header.start(1) + 300, do: 'enter', el: 'hl' },
					{ at: header.start(1) + 700, do: 'move', el: 'hl', to: 'lh-4', dur: 800 },
					{ at: header.start(1) + 1500, do: 'enter', el: 'm-h4' },
					{ at: header.start(1) + 1600, do: 'enter', el: 'pk-proto' },
					{ at: header.start(1) + 2300, do: 'move', el: 'hl', to: 'lh-5', dur: 600 },
					{ at: header.start(1) + 2800, do: 'enter', el: 'm-h5' },
					{ at: header.start(2) + 100, do: 'pulse', el: 'pk-proto' },
					{ at: header.start(2) + 300, do: 'enter', el: 'lb-sig' },
					{ at: header.start(2) + 1400, do: 'enter', el: 'lb-nobody' },
					{ at: header.start(2) + 2400, do: 'pulse', el: 'pk-proto' },
				),
			},
		},
		{
			id: 'include',
			chapter: 'prototype',
			scene: 'project',
			title: { es: '#include copia el prototipo', en: '#include copies the prototype' },
			subtitles: include.list,
			motion: {
				cues: seq(
					shot(0, 'shot-hm', 2200),
					{ at: 0, do: 'exit', el: 'fh' },
					{ at: 0, do: 'move', el: 'tabs', to: 'tb-m', dur: 800 },
					{ at: 500, do: 'enter', el: 'fm' },
					...typeLines('em-', 1, 11, 600, 240, 320),
					{ at: 3300, do: 'move', el: 'hl', to: 'lm-8', dur: 800 },
					{ at: 3900, do: 'enter', el: 'm-m8' },
					{ at: 4100, do: 'enter', el: 'st-nodef' },
					{ at: include.start(1), do: 'move', el: 'hl', to: 'lm-2', dur: 700 },
					{ at: include.start(1) + 100, do: 'exit', el: 'st-nodef' },
					{ at: include.start(1) + 700, do: 'enter', el: 'm-m2' },
					{ at: include.start(1) + 800, do: 'draw', el: 'rt-inc', dur: 900 },
					{ at: include.start(1) + 900, do: 'enter', el: 'pk-copy' },
					{ at: include.start(1) + 1200, do: 'move', el: 'pk-copy', to: 'a-mp', dur: 1500 },
					{ at: include.start(1) + 2800, do: 'pulse', el: 'z-m' },
					{ at: include.start(2), do: 'move', el: 'hl', to: 'lm-8', dur: 700 },
					{ at: include.start(2) + 700, do: 'pulse', el: 'm-m8' },
					{ at: include.start(2) + 800, do: 'enter', el: 'on-m8' },
					{ at: include.start(2) + 1200, do: 'enter', el: 'ch-checked' },
					{ at: include.start(2) + 2000, do: 'pulse', el: 'pk-copy' },
				),
			},
		},
		// ─── Scene 2. The include guard ─────────────────────────────────────
		{
			id: 'guard',
			chapter: 'guard',
			scene: 'project',
			title: { es: 'La guarda evita la segunda copia', en: 'The guard prevents the second copy' },
			subtitles: guard.list,
			motion: {
				cues: seq(
					shot(0, 'shot-hm', 1800),
					{ at: 0, do: 'exit', el: 'fm' },
					{ at: 0, do: 'move', el: 'tabs', to: 'tb-h', dur: 800 },
					{ at: 0, do: 'exit', el: 'ch-checked' },
					{ at: 0, do: 'exit', el: 'on-m8' },
					{ at: 0, do: 'exit', el: 'lb-sig' },
					{ at: 0, do: 'exit', el: 'lb-nobody' },
					{ at: 400, do: 'enter', el: 'fh' },
					{ at: 600, do: 'move', el: 'hl', to: 'lh-1', dur: 800 },
					{ at: 1400, do: 'enter', el: 'm-h1' },
					{ at: 1500, do: 'enter', el: 'm-h2' },
					{ at: 2000, do: 'enter', el: 'gate' },
					{ at: guard.start(1), do: 'move', el: 'hl', to: 'lh-1', dur: 400 },
					{ at: guard.start(1) + 500, do: 'enter', el: 'on-h1' },
					{ at: guard.start(1) + 600, do: 'move', el: 'hl', to: 'lh-2', dur: 600 },
					{ at: guard.start(1) + 1300, do: 'enter', el: 'on-h2' },
					{ at: guard.start(1) + 1500, do: 'enter', el: 'ch-defined' },
					{ at: guard.start(1) + 2300, do: 'pulse', el: 'pk-copy' },
					{ at: guard.start(2), do: 'move', el: 'hl', to: 'lh-7', dur: 800 },
					{ at: guard.start(2) + 700, do: 'enter', el: 'm-h7' },
					{ at: guard.start(2) + 800, do: 'enter', el: 'pk-dup' },
					{ at: guard.start(2) + 1200, do: 'move', el: 'pk-dup', to: 'a-gate', dur: 1500 },
					{ at: guard.start(2) + 2700, do: 'pulse', el: 'gate' },
					{ at: guard.start(2) + 2800, do: 'enter', el: 'on-h7' },
					{ at: guard.start(2) + 2900, do: 'exit', el: 'pk-dup' },
					{ at: guard.start(2) + 3100, do: 'enter', el: 'ch-skip' },
				),
			},
		},
		// ─── Scene 3. One .o per .c ─────────────────────────────────────────
		{
			id: 'compile',
			chapter: 'objects',
			scene: 'project',
			title: { es: 'Cada .c se compila a su .o', en: 'Each .c is compiled to its .o' },
			subtitles: compile.list,
			motion: {
				cues: seq(
					shot(0, 'shot-c', 2400),
					{ at: 0, do: 'exit', el: 'fh' },
					{ at: 0, do: 'move', el: 'tabs', to: 'tb-c', dur: 800 },
					{ at: 0, do: 'exit', el: 'ch-defined' },
					{ at: 0, do: 'exit', el: 'ch-skip' },
					{ at: 0, do: 'exit', el: 'gate' },
					{ at: 0, do: 'exit', el: 'on-h1' },
					{ at: 0, do: 'exit', el: 'on-h2' },
					{ at: 0, do: 'exit', el: 'on-h7' },
					{ at: 400, do: 'enter', el: 'fc' },
					...typeLines('ec-', 1, 13, 500, 200, 300),
					{ at: 600, do: 'enter', el: 'co-a' },
					{ at: 700, do: 'type', el: 'ra-0', dur: 1700 },
					{ at: 2100, do: 'move', el: 'hl', to: 'lc-1', dur: 700 },
					{ at: 2200, do: 'enter', el: 'm-c1' },
					{ at: 2400, do: 'enter', el: 'm-c3' },
					{ at: 2600, do: 'enter', el: 'm-c7' },
					{ at: 2800, do: 'enter', el: 'm-c11' },
					{ at: 3300, do: 'enter', el: 'z-oc' },
					{ at: compile.start(1), do: 'move', el: 'hl', to: 'lc-7', dur: 700 },
					{ at: compile.start(1) + 500, do: 'camera', to: ['shot-obj'], dur: 2200, pad: 0 },
					{ at: compile.start(1) + 700, do: 'enter', el: 'on-c7' },
					{ at: compile.start(1) + 800, do: 'enter', el: 'p' },
					{ at: compile.start(1) + 1100, do: 'move', el: 'p', to: 'a-oc', dur: 1200 },
					{ at: compile.start(1) + 2400, do: 'enter', el: 'ch-def' },
					{ at: compile.start(2), do: 'move', el: 'tabs', to: 'tb-m', dur: 700 },
					{ at: compile.start(2), do: 'exit', el: 'fc' },
					{ at: compile.start(2) + 400, do: 'enter', el: 'fm' },
					{ at: compile.start(2) + 600, do: 'move', el: 'hl', to: 'lm-8', dur: 700 },
					{ at: compile.start(2) + 700, do: 'type', el: 'ra-1', dur: 1400 },
					{ at: compile.start(2) + 1200, do: 'enter', el: 'z-om' },
					{ at: compile.start(2) + 1300, do: 'move', el: 'p', to: 'a-om', dur: 1500 },
					{ at: compile.start(2) + 2500, do: 'enter', el: 'ch-ref' },
				),
			},
		},
		// ─── Scene 4. The linker ────────────────────────────────────────────
		{
			id: 'link',
			chapter: 'linker',
			scene: 'project',
			title: { es: 'El enlazador resuelve la llamada', en: 'The linker resolves the call' },
			subtitles: link.list,
			motion: {
				cues: seq(
					shot(0, 'shot-link', 2200),
					{ at: 0, do: 'exit', el: 'co-a' },
					{ at: 0, do: 'exit', el: 'hl' },
					{ at: 400, do: 'enter', el: 'co-b' },
					{ at: 500, do: 'type', el: 'rb-0', dur: 1500 },
					{ at: 1200, do: 'enter', el: 'z-x' },
					{ at: 1800, do: 'draw', el: 'rt-oc-x', dur: 900 },
					{ at: 2000, do: 'draw', el: 'rt-om-x', dur: 900 },
					{ at: 2200, do: 'move', el: 'p', to: 'a-x', dur: 1400 },
					{ at: link.start(1), do: 'pulse', el: 'ch-def' },
					{ at: link.start(1) + 300, do: 'draw', el: 'rt-res', dur: 1200 },
					{ at: link.start(1) + 1100, do: 'move', el: 'p', to: 'a-oc', dur: 1000 },
					{ at: link.start(1) + 1500, do: 'exit', el: 'ch-ref' },
					{ at: link.start(1) + 1700, do: 'enter', el: 'ch-res' },
					{ at: link.start(1) + 2200, do: 'pulse', el: 'ch-res' },
					{ at: link.start(2), do: 'move', el: 'p', to: 'a-x', dur: 1000 },
					{ at: link.start(2) + 200, do: 'type', el: 'rb-1', dur: 700 },
					{ at: link.start(2) + 1000, do: 'type', el: 'rb-2', dur: 800 },
					{ at: link.start(2) + 1800, do: 'type', el: 'rb-3', dur: 900 },
					{ at: link.start(2) + 1900, do: 'enter', el: 'ch-run' },
					{ at: link.start(2) + 2000, do: 'flow', el: 'rt-oc-x' },
					{ at: link.start(2) + 2000, do: 'flow', el: 'rt-om-x' },
					{ at: link.start(2) + 2200, do: 'pulse', el: 'z-x' },
				),
			},
		},
		// ─── Scene 5. An undefined symbol ───────────────────────────────────
		{
			id: 'missing',
			chapter: 'undefined',
			scene: 'project',
			title: { es: 'Falta calculadora.o: símbolo indefinido', en: 'calculator.o is missing: undefined symbol' },
			subtitles: missing.list,
			motion: {
				cues: seq(
					shot(0, 'shot-obj', 2000),
					{ at: 0, do: 'exit', el: 'co-b' },
					{ at: 0, do: 'exit', el: 'ch-run' },
					{ at: 0, do: 'exit', el: 'rt-res' },
					{ at: 0, do: 'exit', el: 'ch-res' },
					{ at: 0, do: 'exit', el: 'rt-oc-x' },
					{ at: 0, do: 'exit', el: 'rt-om-x' },
					{ at: 0, do: 'exit', el: 'z-x' },
					{ at: 400, do: 'enter', el: 'co-c' },
					{ at: 500, do: 'type', el: 'rc-0', dur: 1100 },
					{ at: 900, do: 'exit', el: 'z-oc' },
					{ at: 900, do: 'exit', el: 'ch-def' },
					{ at: 1400, do: 'enter', el: 'ch-ref' },
					{ at: 1500, do: 'move', el: 'p', to: 'a-om', dur: 1200 },
					{ at: missing.start(1), do: 'draw', el: 'rt-miss', dur: 1100 },
					{ at: missing.start(1) + 500, do: 'type', el: 'rc-1', dur: 1300 },
					{ at: missing.start(1) + 900, do: 'enter', el: 'hl-err' },
					{ at: missing.start(1) + 1100, do: 'type', el: 'rc-2', dur: 900 },
					{ at: missing.start(1) + 1500, do: 'type', el: 'rc-3', dur: 1300 },
					{ at: missing.start(1) + 1900, do: 'type', el: 'rc-4', dur: 900 },
					{ at: missing.start(1) + 2300, do: 'type', el: 'rc-5', dur: 800 },
					{ at: missing.start(1) + 2700, do: 'type', el: 'rc-6', dur: 1800 },
					{ at: missing.start(2), do: 'enter', el: 'ch-undef' },
					{ at: missing.start(2) + 700, do: 'pulse', el: 'ch-undef' },
					{ at: missing.start(2) + 1500, do: 'pulse', el: 'ch-ref' },
				),
			},
		},
		// ─── Scene 6. Interface and implementation ──────────────────────────
		{
			id: 'contract',
			chapter: 'interface',
			scene: 'project',
			title: { es: 'Interfaz en el .h, implementación en el .c', en: 'Interface in the .h, implementation in the .c' },
			subtitles: contract.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 2800),
					{ at: 0, do: 'exit', el: 'co-c' },
					{ at: 0, do: 'exit', el: 'hl-err' },
					{ at: 0, do: 'exit', el: 'rt-miss' },
					{ at: 0, do: 'exit', el: 'ch-undef' },
					{ at: 0, do: 'exit', el: 'ch-ref' },
					{ at: 0, do: 'exit', el: 'fm' },
					{ at: 0, do: 'move', el: 'tabs', to: 'tb-h', dur: 800 },
					{ at: 300, do: 'enter', el: 'fh' },
					{ at: 600, do: 'enter', el: 'z-oc' },
					{ at: 700, do: 'enter', el: 'ch-def' },
					{ at: 800, do: 'enter', el: 'ch-res' },
					{ at: 900, do: 'enter', el: 'z-x' },
					{ at: 1000, do: 'draw', el: 'rt-oc-x', dur: 800 },
					{ at: 1000, do: 'draw', el: 'rt-om-x', dur: 800 },
					{ at: 900, do: 'enter', el: 'hl' },
					{ at: 1000, do: 'move', el: 'hl', to: 'lh-4', dur: 800 },
					{ at: contract.start(0) + 1700, do: 'enter', el: 'lb-iface' },
					{ at: contract.start(0) + 1900, do: 'pulse', el: 'z-h' },
					{ at: contract.start(1), do: 'move', el: 'tabs', to: 'tb-c', dur: 700 },
					{ at: contract.start(1), do: 'exit', el: 'fh' },
					{ at: contract.start(1) + 400, do: 'enter', el: 'fc' },
					{ at: contract.start(1) + 600, do: 'move', el: 'hl', to: 'lc-7', dur: 700 },
					{ at: contract.start(1) + 1000, do: 'draw', el: 'rt-inc-c', dur: 1000 },
					{ at: contract.start(1) + 1500, do: 'enter', el: 'lb-impl' },
					{ at: contract.start(1) + 1700, do: 'pulse', el: 'z-c' },
					{ at: contract.start(2), do: 'pulse', el: 'z-c' },
					{ at: contract.start(2) + 300, do: 'pulse', el: 'z-oc' },
					{ at: contract.start(2) + 800, do: 'enter', el: 'lb-rebuild' },
					{ at: contract.start(2) + 1500, do: 'pulse', el: 'z-m' },
				),
			},
		},
		// ─── Scene 7. static hides the helper ───────────────────────────────
		{
			id: 'hidden',
			chapter: 'interface',
			scene: 'project',
			title: { es: 'static oculta la función auxiliar', en: 'static hides the helper function' },
			subtitles: hidden.list,
			motion: {
				cues: seq(
					shot(0, 'shot-c', 2400),
					{ at: 0, do: 'exit', el: 'lb-iface' },
					{ at: 0, do: 'exit', el: 'lb-rebuild' },
					{ at: 0, do: 'exit', el: 'lb-impl' },
					{ at: 400, do: 'move', el: 'hl', to: 'lc-3', dur: 800 },
					{ at: 1200, do: 'pulse', el: 'm-c3' },
					{ at: 1300, do: 'enter', el: 'on-c3' },
					{ at: 1700, do: 'enter', el: 'ch-static' },
					{ at: hidden.start(1), do: 'enter', el: 'p' },
					{ at: hidden.start(1) + 200, do: 'move', el: 'p', to: 'a-c7', dur: 1300 },
					{ at: hidden.start(1) + 1700, do: 'enter', el: 'ch-private' },
					{ at: hidden.start(1) + 2100, do: 'pulse', el: 'ch-private' },
					{ at: hidden.start(2), do: 'move', el: 'hl', to: 'lc-12', dur: 700 },
					{ at: hidden.start(2) + 500, do: 'move', el: 'p', to: 'a-c11', dur: 1200 },
					{ at: hidden.start(2) + 1700, do: 'move', el: 'p', to: 'a-c3', dur: 1000 },
					{ at: hidden.start(2) + 2200, do: 'move', el: 'hl', to: 'lc-3', dur: 600 },
					{ at: hidden.start(2) + 2900, do: 'camera', to: ['shot-all'], dur: 3200, pad: 0 },
					{ at: hidden.start(2) + 3000, do: 'pulse', el: 'z-c' },
				),
			},
		},
	],
};
