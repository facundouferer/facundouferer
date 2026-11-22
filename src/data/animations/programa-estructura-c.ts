import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The parts of a C program": a short film (about two minutes) for the lesson
// "Introducción a C" (order: 1). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/programa-estructura-c.astro`):
// the lesson's own first program on the left, and on the right the program seen as a
// machine of parts: the standard library shelf that delivers the declaration of
// `printf`, the program with one module per instruction, and the operating system with
// its screen. The execution bar walks the code from top to bottom; comments are dimmed
// as it passes (magenta marks what the compiler ignores); the exit status of `return 0;`
// is handed back to the system (violet). The last scenes type the real commands.

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

/**
 * Runs the instruction on editor line `line`: slides the bar to it, builds its module
 * and sends the execution particle there. Its lit state follows.
 */
const exec = (at: number, line: number, lit = 700): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
	{ at: at + 100, do: 'enter', el: `m-${line}` },
	{ at: at + 100, do: 'move', el: 'p', to: `a-m${line}`, dur: 700 },
	{ at: at + lit, do: 'enter', el: `on-${line}` },
];

/** The bar crosses a comment line, which is then dimmed: the compiler ignores it. */
const skip = (at: number, line: number, veil: string): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
	{ at: at + 800, do: 'enter', el: veil },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const include = timed(
	say(
		'`#include <stdio.h>` incorpora las declaraciones de la cabecera de entrada y salida.',
		'`#include <stdio.h>` brings in the declarations of the input and output header.',
	),
	say(
		'Es una directiva de preprocesador: trae la declaración de `printf`.',
		'It is a preprocessor directive: it brings in the declaration of `printf`.',
	),
);
const comment = timed(
	say(
		'Las líneas 3 a 5 son un comentario: texto para quien lee el código.',
		'Lines 3 to 5 are a comment: text for whoever reads the code.',
	),
	say(
		'El compilador lo ignora: sirve para explicar la intención.',
		'The compiler ignores it: it is there to explain the intent.',
	),
);
const entry = timed(
	say(
		'`int main(void)` abre `main`, el punto de entrada: ahí empieza la ejecución.',
		'`int main(void)` opens `main`, the entry point: execution starts there.',
	),
	say(
		'`int`: `main` devuelve un entero al terminar. `(void)`: no recibe datos.',
		'`int`: `main` returns an integer when it ends. `(void)`: it takes no data.',
	),
	say(
		'Las llaves `{ }` delimitan el bloque de `main`.',
		'The braces `{ }` delimit the block of `main`.',
	),
);
const print = timed(
	say(
		'Otro comentario: la barra lo cruza y el compilador lo ignora.',
		'Another comment: the bar crosses it and the compiler ignores it.',
	),
	say(
		'En la línea 8, `printf` escribe en pantalla el texto que recibe entre comillas.',
		'On line 8, `printf` writes on the screen the text it receives in quotes.',
	),
	say(
		'`\\n` es un salto de línea: lo siguiente aparece en la línea de abajo.',
		'`\\n` is a line break: what comes next appears on the line below.',
	),
);
const order = timed(
	say(
		'La línea 9 corre después de la 8: una tras otra, de arriba hacia abajo.',
		'Line 9 runs after line 8: one after another, from top to bottom.',
	),
	say(
		'El segundo texto queda debajo porque el primero terminó en `\\n`.',
		'The second text lands below because the first ended in `\\n`.',
	),
	say(
		'Cada sentencia termina en `;`. El comentario siguiente se salta.',
		'Each statement ends in `;`. The next comment is skipped.',
	),
);
const ret = timed(
	say(
		'`return 0;` termina `main` y devuelve `0`. No escribe nada en pantalla.',
		'`return 0;` ends `main` and returns `0`. It writes nothing on the screen.',
	),
	say(
		'El valor va al sistema operativo: `0` significa que todo salió bien.',
		'The value goes to the operating system: `0` means everything went fine.',
	),
	say(
		'Por eso `main` es `int`: devuelve el estado de salida del programa.',
		'That is why `main` is `int`: it returns the exit status of the program.',
	),
);
const build = timed(
	say(
		'Para verlo, compila con el comando del curso, sin advertencias.',
		'To see it, compile with the course command, with no warnings.',
	),
	say(
		'`-std=c23` pide el estándar; `-Wall -Wextra -Wpedantic` activan las advertencias.',
		'`-std=c23` asks for the standard; `-Wall -Wextra -Wpedantic` turn on the warnings.',
	),
	say(
		'Sin mensajes, se creó el ejecutable: `./hola` lo ejecuta.',
		'With no messages, the executable exists: `./hello` runs it.',
	),
);
const status = timed(
	say(
		'`echo $?` muestra el estado de salida del último programa: `0`.',
		'`echo $?` shows the exit status of the last program: `0`.',
	),
	say(
		'Cabecera, entrada, sentencias en orden, pantalla y estado de salida.',
		'Header, entry point, statements in order, screen and exit status.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'include', label: { es: '#include y comentarios', en: '#include and comments' } },
		{ id: 'main', label: { es: 'La función main', en: 'The main function' } },
		{ id: 'printf', label: { es: 'printf', en: 'printf' } },
		{ id: 'order', label: { es: 'El orden de ejecución', en: 'The order of execution' } },
		{ id: 'return', label: { es: 'return 0', en: 'return 0' } },
		{ id: 'run', label: { es: 'Compilar y ejecutar', en: 'Compile and run' } },
	],
	steps: [
		// ─── Scene 1. #include and comments ─────────────────────────────────
		{
			id: 'include',
			chapter: 'include',
			scene: 'journey',
			title: { es: '#include trae la declaración de printf', en: '#include brings in the declaration of printf' },
			subtitles: include.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 2600),
					{ at: 200, do: 'enter', el: 'z-lib' },
					{ at: 400, do: 'enter', el: 'z-prog' },
					{ at: 400, do: 'enter', el: 'hl' },
					{ at: 600, do: 'enter', el: 'shelf' },
					{ at: 700, do: 'enter', el: 'p' },
					...exec(900, 1),
					{ at: 2600, do: 'pulse', el: 'shelf' },
					shot(include.start(1), 'shot-lib', 2200),
					{ at: include.start(1) + 300, do: 'enter', el: 'pk-decl' },
					{ at: include.start(1) + 500, do: 'draw', el: 'fl-inc', dur: 1000 },
					{ at: include.start(1) + 800, do: 'move', el: 'pk-decl', to: 'a-prog', dur: 1500 },
					{ at: include.start(1) + 1700, do: 'flow', el: 'fl-inc' },
					{ at: include.start(1) + 2500, do: 'enter', el: 'prog-on' },
					{ at: include.start(1) + 3000, do: 'pulse', el: 'pk-decl' },
				),
			},
		},
		{
			id: 'comment',
			chapter: 'include',
			scene: 'journey',
			title: { es: 'Un comentario no genera instrucciones', en: 'A comment generates no instructions' },
			subtitles: comment.list,
			motion: {
				cues: seq(
					...clear(0, 'on-1', 'fl-inc'),
					shot(0, 'shot-all', 2200),
					{ at: 300, do: 'move', el: 'hl', to: 'ln-3', dur: 500 },
					{ at: 1100, do: 'move', el: 'hl', to: 'ln-4', dur: 500 },
					{ at: 1900, do: 'move', el: 'hl', to: 'ln-5', dur: 500 },
					{ at: 3000, do: 'enter', el: 'dim-3' },
					{ at: comment.start(1) + 200, do: 'enter', el: 'lb-ign' },
					{ at: comment.start(1) + 1400, do: 'pulse', el: 'dim-3' },
					{ at: comment.start(1) + 2400, do: 'pulse', el: 'lb-ign' },
				),
			},
		},

		// ─── Scene 2. main ──────────────────────────────────────────────────
		{
			id: 'main',
			chapter: 'main',
			scene: 'journey',
			title: { es: 'main: el punto de entrada', en: 'main: the entry point' },
			subtitles: entry.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-ign'),
					shot(0, 'shot-prog', 2200),
					...exec(200, 6),
					{ at: 900, do: 'enter', el: 'z-os' },
					{ at: 1200, do: 'enter', el: 'scr' },
					{ at: 2200, do: 'draw', el: 'fl-call', dur: 1000 },
					{ at: 3200, do: 'flow', el: 'fl-call' },
					{ at: 3600, do: 'enter', el: 'lb-entry' },
					{ at: 5200, do: 'pulse', el: 'lb-entry' },
					...clear(entry.start(1), 'lb-entry', 'fl-call'),
					{ at: entry.start(1) + 300, do: 'enter', el: 'lb-int' },
					{ at: entry.start(1) + 900, do: 'pulse', el: 'm-6' },
					{ at: entry.start(1) + 2200, do: 'pulse', el: 'lb-int' },
					{ at: entry.start(2) + 200, do: 'exit', el: 'lb-int', dur: 400 },
					{ at: entry.start(2) + 500, do: 'enter', el: 'lb-blk' },
					{ at: entry.start(2) + 1300, do: 'pulse', el: 'z-prog' },
					{ at: entry.start(2) + 2200, do: 'pulse', el: 'lb-blk' },
				),
			},
		},

		// ─── Scene 3. printf ────────────────────────────────────────────────
		{
			id: 'print',
			chapter: 'printf',
			scene: 'journey',
			title: { es: 'printf escribe en la pantalla', en: 'printf writes on the screen' },
			subtitles: print.list,
			motion: {
				cues: seq(
					...clear(0, 'on-6', 'lb-blk', 'prog-on'),
					shot(0, 'shot-all', 2000),
					...skip(300, 7, 'dim-7'),
					{ at: 2800, do: 'pulse', el: 'dim-7' },
					...exec(print.start(1), 8),
					{ at: print.start(1) + 100, do: 'move', el: 'pk-decl', to: 'a-m8', dur: 1100 },
					{ at: print.start(1) + 1300, do: 'exit', el: 'pk-decl', dur: 300 },
					shot(print.start(1) + 900, 'shot-os', 2200),
					{ at: print.start(1) + 1700, do: 'enter', el: 'pk-t1' },
					{ at: print.start(1) + 1900, do: 'draw', el: 'fl-out', dur: 1000 },
					{ at: print.start(1) + 2100, do: 'move', el: 'pk-t1', to: 'a-scr', dur: 1400 },
					{ at: print.start(1) + 3100, do: 'flow', el: 'fl-out' },
					{ at: print.start(1) + 3600, do: 'exit', el: 'pk-t1', dur: 300 },
					{ at: print.start(1) + 3700, do: 'type', el: 'scr-1', dur: 800 },
					{ at: print.start(1) + 4700, do: 'pulse', el: 'scr' },
					{ at: print.start(2) + 200, do: 'enter', el: 'lb-nl' },
					{ at: print.start(2) + 1500, do: 'pulse', el: 'lb-nl' },
					{ at: print.start(2) + 2600, do: 'pulse', el: 'scr-1' },
				),
			},
		},

		// ─── Scene 4. The order of execution ────────────────────────────────
		{
			id: 'order',
			chapter: 'order',
			scene: 'journey',
			title: { es: 'Las sentencias se ejecutan en orden', en: 'Statements run in order' },
			subtitles: order.list,
			motion: {
				cues: seq(
					...clear(0, 'on-8', 'fl-out', 'lb-nl'),
					shot(0, 'shot-all', 2400),
					...exec(200, 9),
					{ at: 900, do: 'draw', el: 'fl-seq', dur: 1200 },
					{ at: 1500, do: 'enter', el: 'pk-t2' },
					{ at: 1700, do: 'move', el: 'pk-t2', to: 'a-scr', dur: 1400 },
					{ at: 2200, do: 'flow', el: 'fl-seq' },
					{ at: 2400, do: 'enter', el: 'lb-order' },
					{ at: 3200, do: 'exit', el: 'pk-t2', dur: 300 },
					{ at: 3300, do: 'type', el: 'scr-2', dur: 900 },
					{ at: order.start(1) + 300, do: 'pulse', el: 'scr-1' },
					{ at: order.start(1) + 1100, do: 'pulse', el: 'scr-2' },
					{ at: order.start(1) + 2000, do: 'pulse', el: 'lb-order' },
					...skip(order.start(2), 11, 'dim-11'),
					{ at: order.start(2) + 1500, do: 'enter', el: 'lb-ign' },
					{ at: order.start(2) + 2600, do: 'pulse', el: 'dim-11' },
				),
			},
		},

		// ─── Scene 5. return 0 ──────────────────────────────────────────────
		{
			id: 'return',
			chapter: 'return',
			scene: 'journey',
			title: { es: 'return 0 entrega el estado de salida', en: 'return 0 hands back the exit status' },
			subtitles: ret.list,
			motion: {
				cues: seq(
					...clear(0, 'on-9', 'fl-seq', 'lb-order', 'lb-ign'),
					shot(0, 'shot-os', 2400),
					...exec(200, 12),
					{ at: 1400, do: 'enter', el: 'pk-st' },
					{ at: 1600, do: 'draw', el: 'fl-exit', dur: 900 },
					{ at: 1700, do: 'move', el: 'pk-st', to: 'a-os', dur: 1300 },
					{ at: 2200, do: 'flow', el: 'fl-exit' },
					{ at: 3100, do: 'enter', el: 'os-on' },
					{ at: ret.start(1) + 200, do: 'enter', el: 'lb-ok' },
					{ at: ret.start(1) + 1300, do: 'pulse', el: 'os-on' },
					{ at: ret.start(1) + 2200, do: 'pulse', el: 'pk-st' },
					{ at: ret.start(2) + 200, do: 'enter', el: 'lb-int' },
					{ at: ret.start(2) + 500, do: 'move', el: 'hl', to: 'ln-13', dur: 500 },
					{ at: ret.start(2) + 1400, do: 'pulse', el: 'lb-int' },
					{ at: ret.start(2) + 2300, do: 'pulse', el: 'pk-st' },
				),
			},
		},

		// ─── Scene 6. Compile and run ───────────────────────────────────────
		{
			id: 'build',
			chapter: 'run',
			scene: 'journey',
			title: { es: 'Compilar y ejecutar', en: 'Compile and run' },
			subtitles: build.list,
			motion: {
				cues: seq(
					...clear(0, 'on-12', 'fl-exit', 'lb-int', 'lb-ok', 'hl'),
					shot(0, 'shot-all', 2600),
					{ at: 700, do: 'type', el: 'c-0', dur: 2400 },
					{ at: build.start(1) + 300, do: 'pulse', el: 'c-0' },
					{ at: build.start(2) + 200, do: 'type', el: 'c-1', dur: 600 },
					{ at: build.start(2) + 1000, do: 'draw', el: 'fl-seq', dur: 1000 },
					{ at: build.start(2) + 1200, do: 'move', el: 'p', to: 'a-m1', dur: 600 },
					{ at: build.start(2) + 1900, do: 'flow', el: 'fl-seq' },
					{ at: build.start(2) + 2000, do: 'move', el: 'p', to: 'a-m6', dur: 600 },
					{ at: build.start(2) + 2700, do: 'move', el: 'p', to: 'a-m8', dur: 600 },
					{ at: build.start(2) + 3000, do: 'type', el: 'c-2', dur: 700 },
					{ at: build.start(2) + 3400, do: 'move', el: 'p', to: 'a-m9', dur: 600 },
					{ at: build.start(2) + 3800, do: 'type', el: 'c-3', dur: 900 },
					{ at: build.start(2) + 4100, do: 'move', el: 'p', to: 'a-m12', dur: 600 },
				),
			},
		},
		{
			id: 'status',
			chapter: 'run',
			scene: 'journey',
			title: { es: 'echo $? muestra el estado de salida', en: 'echo $? shows the exit status' },
			subtitles: status.list,
			motion: {
				cues: seq(
					...clear(0, 'fl-seq'),
					{ at: 300, do: 'type', el: 'c-4', dur: 900 },
					{ at: 1500, do: 'type', el: 'c-5', dur: 300 },
					{ at: 1800, do: 'enter', el: 'os-on' },
					{ at: 2200, do: 'pulse', el: 'pk-st' },
					shot(status.start(1), 'shot-wide', 3400),
					{ at: status.start(1) + 800, do: 'pulse', el: 'z-lib' },
					{ at: status.start(1) + 1500, do: 'pulse', el: 'z-prog' },
					{ at: status.start(1) + 2200, do: 'pulse', el: 'z-os' },
					{ at: status.start(1) + 2900, do: 'pulse', el: 'scr' },
				),
			},
		},
	],
};
