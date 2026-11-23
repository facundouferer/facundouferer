import type { AnimationScript, MotionCue, Subtitle } from './types';

// "C23, each feature with its label": a short film (about two minutes) for the C lesson
// "C moderno: novedades de C23" (`c23-moderno`). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/c23-novedades-c.astro`). The editor
// shows one small program that grows with the features of the lesson (`bool`, `nullptr`,
// `constexpr`, `typeof`, `[[nodiscard]]`, `#embed`) and, at the end, the lesson's own
// `__STDC_VERSION__` check. On the right, two floors: the compile-time floor (the constant,
// the array it sizes, the file that becomes bytes) and the run-time floor (a lane of modules,
// one per statement, with the variables beside it). Every feature is stamped with the label of
// the lesson: standard C23 (light blue), compiler extension (magenta) or optional (violet).
// The gate `-std=c23` stands at the entrance of the lane. The output typed in the console is
// what `cc -std=c23 -Wall -Wextra -Wpedantic` and the program really printed.

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

const show = (at: number, ...ids: string[]): MotionCue[] => ids.map((el, index) => ({ at: at + index * 150, do: 'enter' as const, el }));
const hide = (at: number, ...ids: string[]): MotionCue[] => ids.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/** The particle and the editor bar travel together to the module of one line of `main`. */
const runTo = (at: number, line: number, dur = 900): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a-m${line}`, dur },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 700) },
];

/** The violet bar marks a line the compiler resolves; the particle does not run it. */
const compileTo = (at: number, line: number, dur = 600): MotionCue => ({ at, do: 'move', el: 'hc', to: `ln-${line}`, dur });

/** Types one line of the program in the editor. */
const write = (at: number, line: number, dur = 900): MotionCue => ({ at, do: 'type', el: `cl-${line}`, dur });

// ─── Captions ───────────────────────────────────────────────────────────────
const gate = timed(
	say('Este mundo es un programa C. La puerta `-std=c23` elige el estándar.', 'This world is a C program. The `-std=c23` gate picks the standard.'),
	say('Cada novedad lleva una etiqueta: estándar C23, extensión u opcional.', 'Every feature carries a label: standard C23, extension or optional.'),
	say('La etiqueta decide si compilará en otra máquina.', 'The label decides whether it compiles on another machine.'),
);
const words = timed(
	say('Línea 8: `bool` y `true` ya son palabras clave, sin `<stdbool.h>`.', 'Line 8: `bool` and `true` are now keywords, no `<stdbool.h>` needed.'),
	say('Línea 9: `NULL` puede valer `0`, que es un `int`, no un puntero.', 'Line 9: `NULL` may be `0`, which is an `int`, not a pointer.'),
	say('`nullptr` siempre es un puntero nulo: nunca se convierte a un entero.', '`nullptr` is always a null pointer: it never converts to an integer.'),
);
const constant = timed(
	say('Líneas 3 y 4: `constexpr` crea una constante que el compilador verifica.', 'Lines 3 and 4: `constexpr` makes a constant the compiler checks.'),
	say('Al ser constante al compilar, puede dimensionar el arreglo `buffer`.', 'Being constant at compile time, it can size the `buffer` array.'),
	say('Si no puede calcular el valor, como con `rand()`, lo rechaza.', 'If it cannot compute the value, as with `rand()`, it rejects it.'),
);
const typeOf = timed(
	say('Línea 10: `typeof(buffer[0])` es el tipo de esa expresión: `int`.', 'Line 10: `typeof(buffer[0])` is the type of that expression: `int`.'),
	say('Antes de C23 era extensión de GCC y Clang; `-Wpedantic` la marca.', 'Before C23 it was a GCC and Clang extension; `-Wpedantic` flags it.'),
);
const attribute = timed(
	say('Línea 5: `[[nodiscard]]` es un atributo: una anotación entre `[[` y `]]`.', 'Line 5: `[[nodiscard]]` is an attribute: an annotation between `[[` and `]]`.'),
	say('No cambia el programa: permite mejores advertencias.', 'It does not change the program: it allows better warnings.'),
	say('Línea 11: si se ignora el resultado, el compilador avisa.', 'Line 11: if the result is ignored, the compiler warns.'),
);
const embed = timed(
	say('Líneas 12 a 14: `#embed` convierte un archivo en bytes.', 'Lines 12 to 14: `#embed` turns a file into bytes.'),
	say('Aquí el archivo es el propio programa (`__FILE__`).', 'Here the file is the program itself (`__FILE__`).'),
	say('Compila con `-std=c23`, avisa y corre: 441 bytes.', 'It compiles with `-std=c23`, warns and runs: 436 bytes.'),
);
const fallback = timed(
	say('El código puede preguntar con qué estándar se compila.', 'The code can ask which standard it is compiled with.'),
	say('`__STDC_VERSION__` vale `202311L` en C23 y `201710L` en C17.', '`__STDC_VERSION__` is `202311L` in C23 and `201710L` in C17.'),
	say('`#if` elige: con `-std=c23` imprime C23; con `-std=c17`, C17.', '`#if` picks: with `-std=c23` it prints C23; with `-std=c17`, C17.'),
);
const close = timed(
	say('`-std=c23` no garantiza todo C23: el compilador o la biblioteca pueden no tenerlo.', '`-std=c23` does not guarantee all of C23: the compiler or library may lack it.'),
	say('`constexpr` llegó a Clang 19 y `#embed` a GCC 15: comprueba antes de usar.', '`constexpr` reached Clang 19 and `#embed` GCC 15: check before you use them.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'standard', label: { es: 'Estándar, extensión u opcional', en: 'Standard, extension or optional' } },
		{ id: 'types', label: { es: 'bool y nullptr', en: 'bool and nullptr' } },
		{ id: 'constants', label: { es: 'constexpr y typeof', en: 'constexpr and typeof' } },
		{ id: 'attribute', label: { es: 'Un atributo que avisa', en: 'An attribute that warns' } },
		{ id: 'embed', label: { es: 'El archivo hecho bytes', en: 'The file turned into bytes' } },
		{ id: 'fallback', label: { es: 'El camino de respaldo', en: 'The fallback path' } },
	],
	steps: [
		// ─── Scene 1. The gate and the three labels ─────────────────────────
		{
			id: 'gate',
			chapter: 'standard',
			scene: 'journey',
			title: { es: 'La puerta y las tres etiquetas', en: 'The gate and the three labels' },
			subtitles: gate.list,
			motion: {
				cues: seq(
					shot(0, 'shot-intro', 3600),
					{ at: 300, do: 'enter', el: 'fl-ct' },
					{ at: 500, do: 'enter', el: 'fl-rt' },
					{ at: 700, do: 'enter', el: 'lb-ct' },
					{ at: 850, do: 'enter', el: 'lb-rt' },
					{ at: 1100, do: 'enter', el: 'gate' },
					{ at: 1350, do: 'enter', el: 'lb-gate' },
					...show(1500, 'm-8', 'm-9', 'm-10', 'm-11', 'm-15', 'm-16'),
					{ at: 2500, do: 'enter', el: 'p' },
					{ at: 2700, do: 'move', el: 'p', to: 'a-gate', dur: 900 },
					{ at: 3600, do: 'enter', el: 'gate-on' },
					{ at: 3600, do: 'pulse', el: 'gate-on' },
					{ at: 3800, do: 'move', el: 'p', to: 'a-m8', dur: 900 },
					{ at: gate.start(1) + 200, do: 'enter', el: 'ex-std' },
					{ at: gate.start(1) + 1100, do: 'enter', el: 'ex-ext' },
					{ at: gate.start(1) + 2000, do: 'enter', el: 'ex-opt' },
					{ at: gate.start(1) + 2900, do: 'pulse', el: 'ex-std' },
					{ at: gate.start(2) + 300, do: 'pulse', el: 'ex-ext' },
					{ at: gate.start(2) + 900, do: 'pulse', el: 'ex-opt' },
					...hide(gate.start(2) + 3400, 'ex-std', 'ex-ext', 'ex-opt'),
				),
			},
		},
		// ─── Scene 2. bool, true and nullptr ────────────────────────────────
		{
			id: 'words',
			chapter: 'types',
			scene: 'journey',
			title: { es: 'bool, true y nullptr', en: 'bool, true and nullptr' },
			subtitles: words.list,
			motion: {
				cues: seq(
					shot(0, 'shot-cells', 2600),
					{ at: 100, do: 'enter', el: 'hl' },
					write(300, 8, 1000),
					...runTo(1100, 8, 500),
					{ at: 1500, do: 'enter', el: 'on-8' },
					{ at: 1600, do: 'enter', el: 'c-1' },
					{ at: 2300, do: 'enter', el: 'st-bool' },
					{ at: 2300, do: 'pulse', el: 'c-1' },
					write(words.start(1) + 200, 9, 1000),
					...runTo(words.start(1) + 1200, 9, 900),
					{ at: words.start(1) + 2100, do: 'enter', el: 'on-9' },
					{ at: words.start(1) + 2200, do: 'enter', el: 'c-2' },
					{ at: words.start(1) + 3000, do: 'enter', el: 'lb-null' },
					{ at: words.start(2) + 200, do: 'enter', el: 'lb-nullptr' },
					{ at: words.start(2) + 600, do: 'pulse', el: 'c-2' },
					{ at: words.start(2) + 1400, do: 'enter', el: 'st-null' },
					...hide(words.start(2) + 3600, 'lb-null', 'lb-nullptr'),
				),
			},
		},
		// ─── Scene 3. constexpr ─────────────────────────────────────────────
		{
			id: 'constexpr',
			chapter: 'constants',
			scene: 'journey',
			title: { es: 'constexpr: una constante verificada', en: 'constexpr: a checked constant' },
			subtitles: constant.list,
			motion: {
				cues: seq(
					shot(0, 'shot-ct', 2800),
					{ at: 150, do: 'enter', el: 'hc' },
					compileTo(300, 3, 500),
					write(500, 3, 1100),
					{ at: 1500, do: 'enter', el: 'cap' },
					{ at: 1700, do: 'enter', el: 'lb-cap' },
					{ at: 2500, do: 'enter', el: 'st-cap' },
					compileTo(constant.start(1), 4, 600),
					write(constant.start(1) + 200, 4, 1000),
					...show(constant.start(1) + 600, 's-0', 's-1', 's-2', 's-3', 's-4', 's-5', 's-6', 's-7'),
					{ at: constant.start(1) + 1900, do: 'enter', el: 'lb-buf' },
					{ at: constant.start(1) + 2200, do: 'draw', el: 'fl-cap', dur: 1000 },
					{ at: constant.start(1) + 3300, do: 'pulse', el: 'lb-buf' },
					{ at: constant.start(2) + 300, do: 'enter', el: 'lb-rand' },
					{ at: constant.start(2) + 1000, do: 'pulse', el: 'lb-rand' },
					...hide(constant.start(2) + 3600, 'lb-rand'),
				),
			},
		},
		// ─── Scene 4. typeof ────────────────────────────────────────────────
		{
			id: 'typeof',
			chapter: 'constants',
			scene: 'journey',
			title: { es: 'typeof: el tipo de una expresión', en: 'typeof: the type of an expression' },
			subtitles: typeOf.list,
			motion: {
				cues: seq(
					shot(0, 'shot-mid', 2800),
					write(300, 10, 1100),
					...runTo(1200, 10, 900),
					{ at: 2100, do: 'enter', el: 'on-10' },
					{ at: 2200, do: 'enter', el: 'c-3' },
					{ at: 2400, do: 'enter', el: 'tk-int' },
					{ at: 2900, do: 'move', el: 'tk-int', to: 'a-c3', dur: 1500 },
					{ at: 4500, do: 'pulse', el: 'c-3' },
					{ at: typeOf.start(1) + 200, do: 'enter', el: 'st-old' },
					{ at: typeOf.start(1) + 1500, do: 'pulse', el: 'st-old' },
					...hide(typeOf.start(1) + 3000, 'st-old'),
					{ at: typeOf.start(1) + 3500, do: 'enter', el: 'st-typeof' },
					{ at: typeOf.start(2) + 300, do: 'enter', el: 'lb-ped' },
					{ at: typeOf.start(2) + 1000, do: 'pulse', el: 'lb-ped' },
					...hide(typeOf.start(2) + 3400, 'lb-ped', 'tk-int'),
				),
			},
		},
		// ─── Scene 5. The attribute ─────────────────────────────────────────
		{
			id: 'attribute',
			chapter: 'attribute',
			scene: 'journey',
			title: { es: 'Un atributo que avisa', en: 'An attribute that warns' },
			subtitles: attribute.list,
			motion: {
				cues: seq(
					shot(0, 'shot-attr', 2800),
					compileTo(200, 5, 600),
					write(400, 5, 1200),
					{ at: 1000, do: 'enter', el: 'fn' },
					{ at: 1500, do: 'enter', el: 'lb-attr' },
					{ at: 2200, do: 'enter', el: 'st-attr' },
					{ at: attribute.start(1) + 300, do: 'pulse', el: 'lb-attr' },
					{ at: attribute.start(1) + 1500, do: 'pulse', el: 'fn' },
					write(attribute.start(2), 11, 800),
					...runTo(attribute.start(2) + 600, 11, 900),
					{ at: attribute.start(2) + 1500, do: 'draw', el: 'fl-call', dur: 700 },
					{ at: attribute.start(2) + 1900, do: 'enter', el: 'tk-ret' },
					{ at: attribute.start(2) + 2100, do: 'move', el: 'tk-ret', to: 'a-drop', dur: 1100 },
					{ at: attribute.start(2) + 3300, do: 'enter', el: 'on-11' },
					{ at: attribute.start(2) + 3300, do: 'enter', el: 'hx-11' },
					{ at: attribute.start(2) + 3500, do: 'enter', el: 'lb-warn' },
					{ at: attribute.start(2) + 3800, do: 'pulse', el: 'lb-warn' },
				),
			},
		},
		// ─── Scene 6. #embed, compile and run ───────────────────────────────
		{
			id: 'embed',
			chapter: 'embed',
			scene: 'journey',
			title: { es: '#embed: un archivo hecho bytes', en: '#embed: a file turned into bytes' },
			subtitles: embed.list,
			motion: {
				cues: seq(
					shot(0, 'shot-embed', 3000),
					compileTo(200, 12, 500),
					write(400, 12, 900),
					write(1300, 13, 600),
					write(1900, 14, 300),
					{ at: 1200, do: 'enter', el: 'file' },
					{ at: 1500, do: 'enter', el: 'lb-file' },
					{ at: 2200, do: 'enter', el: 'fuente' },
					{ at: embed.start(1) + 200, do: 'pulse', el: 'file' },
					{ at: embed.start(1) + 700, do: 'draw', el: 'fl-embed', dur: 1200 },
					{ at: embed.start(1) + 1500, do: 'flow', el: 'fl-embed' },
					{ at: embed.start(1) + 2000, do: 'enter', el: 'lb-bytes' },
					{ at: embed.start(1) + 2300, do: 'enter', el: 'st-embed' },
					write(embed.start(1) + 2300, 15, 1000),
					write(embed.start(1) + 3000, 16, 900),
					{ at: embed.start(2) + 100, do: 'type', el: 'co-0', dur: 900 },
					{ at: embed.start(2) + 1100, do: 'type', el: 'co-1', dur: 1000 },
					{ at: embed.start(2) + 2200, do: 'type', el: 'co-2', dur: 600 },
					{ at: embed.start(2) + 2900, do: 'type', el: 'co-3', dur: 400 },
					...runTo(embed.start(2) + 3200, 15, 700),
					{ at: embed.start(2) + 3950, do: 'enter', el: 'on-15' },
					{ at: embed.start(2) + 3950, do: 'type', el: 'co-4', dur: 600 },
					...runTo(embed.start(2) + 4300, 16, 700),
					{ at: embed.start(2) + 5050, do: 'enter', el: 'on-16' },
					{ at: embed.start(2) + 5050, do: 'type', el: 'co-5', dur: 800 },
				),
			},
		},
		// ─── Scene 7. The fallback ──────────────────────────────────────────
		{
			id: 'fallback',
			chapter: 'fallback',
			scene: 'journey',
			title: { es: 'Un camino para compiladores anteriores', en: 'A path for older compilers' },
			subtitles: fallback.list,
			motion: {
				cues: seq(
					shot(0, 'shot-fork', 3000),
					...hide(100, 'ed', 'hc', 'hx-11', 'co-0', 'co-1', 'co-2', 'co-3', 'co-4', 'co-5'),
					{ at: 700, do: 'enter', el: 'eb' },
					{ at: 800, do: 'move', el: 'hl', to: 'ln-b-4', dur: 600 },
					{ at: 800, do: 'move', el: 'p', to: 'a-ver', dur: 1200 },
					...show(1300, 'b-5', 'b-7', 'b-9'),
					...show(1900, 'lb-v5', 'lb-v7', 'lb-v9'),
					{ at: fallback.start(1) + 200, do: 'enter', el: 'tk-v23' },
					{ at: fallback.start(1) + 1400, do: 'enter', el: 'tk-v17' },
					{ at: fallback.start(1) + 2000, do: 'pulse', el: 'tk-v23' },
					{ at: fallback.start(2) + 100, do: 'move', el: 'tk-v23', to: 'a-b5', dur: 1000 },
					{ at: fallback.start(2) + 100, do: 'move', el: 'p', to: 'a-b5', dur: 1000 },
					{ at: fallback.start(2) + 100, do: 'move', el: 'hl', to: 'ln-b-5', dur: 700 },
					{ at: fallback.start(2) + 1100, do: 'enter', el: 'ob-5' },
					{ at: fallback.start(2) + 1200, do: 'type', el: 'cb-0', dur: 900 },
					{ at: fallback.start(2) + 2200, do: 'type', el: 'cb-1', dur: 700 },
					{ at: fallback.start(2) + 3000, do: 'move', el: 'tk-v17', to: 'a-b7', dur: 1000 },
					{ at: fallback.start(2) + 3000, do: 'move', el: 'p', to: 'a-b7', dur: 1000 },
					{ at: fallback.start(2) + 3000, do: 'move', el: 'hl', to: 'ln-b-7', dur: 700 },
					{ at: fallback.start(2) + 4100, do: 'enter', el: 'ob-7' },
					{ at: fallback.start(2) + 4200, do: 'type', el: 'cb-2', dur: 900 },
					{ at: fallback.start(2) + 5200, do: 'type', el: 'cb-3', dur: 700 },
				),
			},
		},
		// ─── Scene 8. The map, pulled back ──────────────────────────────────
		{
			id: 'close',
			chapter: 'fallback',
			scene: 'journey',
			title: { es: 'El mapa completo', en: 'The whole map' },
			subtitles: close.list,
			motion: {
				cues: seq(
					{ at: 200, do: 'enter', el: 'st-ver' },
					shot(500, 'shot-all', 3600),
					{ at: 1500, do: 'pulse', el: 'st-null' },
					{ at: 1900, do: 'pulse', el: 'st-cap' },
					{ at: 2300, do: 'pulse', el: 'st-typeof' },
					{ at: 2700, do: 'pulse', el: 'st-attr' },
					{ at: 3100, do: 'pulse', el: 'st-embed' },
					{ at: close.start(1) + 200, do: 'enter', el: 'lb-sup1' },
					{ at: close.start(1) + 900, do: 'enter', el: 'lb-sup2' },
					{ at: close.start(1) + 1800, do: 'pulse', el: 'lb-sup1' },
					{ at: close.start(1) + 2400, do: 'pulse', el: 'lb-sup2' },
				),
			},
		},
	],
};
