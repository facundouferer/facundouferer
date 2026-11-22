import type { AnimationScript, MotionCue, Subtitle } from './types';

// "A copy travels to the function": a short film (about two minutes) for the C lesson
// "Variables y Parámetros" (`variables-parametros-y-pasaje`). It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/pasaje-por-valor-c.astro`): the call stack drawn as
// stacked isometric frames, one module per instruction with its editor line, a light
// blue particle that is the execution flow and value tokens that are the copies the
// calls receive. The program is drawn inside the canvas (an editor whose bar slides to
// the running line), so every step is a motion step and the cues keep both halves in sync.

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

/** The particle and the editor bar travel together to the module of one line. */
const runTo = (at: number, line: number, dur = 900): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a-m${line}`, dur },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 700) },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const build = timed(
	say('Cada módulo es una instrucción y muestra su línea del editor.', 'Each module is an instruction and shows its editor line.'),
	say('Cada llamada tiene un marco en la pila de llamadas; abajo está el de `main`.', 'Every call has a frame on the call stack; the one of `main` sits at the bottom.'),
	say('La línea 14 crea la variable `numero` en ese marco, con el valor 5.', 'Line 14 creates the variable `number` in that frame, with the value 5.'),
);
const call = timed(
	say('La línea 15 llama a `duplicar(numero)`: se apila un marco nuevo.', 'Line 15 calls `double_it(number)`: a new frame is pushed.'),
	say('El parámetro `x` recibe una copia del valor: viaja el número 5, no la variable.', 'The parameter `x` receives a copy of the value: the number 5 travels, not the variable.'),
);
const change = timed(
	say('La línea 4 hace `x = x * 2`: cambia la copia, que ahora vale 10.', 'Line 4 runs `x = x * 2`: it changes the copy, which is now 10.'),
	say('La línea 5 lo imprime. Mientras tanto, `numero` sigue valiendo 5.', 'Line 5 prints it. Meanwhile, `number` is still 5.'),
);
const scope = timed(
	say('`x` solo se ve en el bloque de `duplicar`; `numero`, solo en `main`.', '`x` is visible only in the block of `double_it`; `number`, only in `main`.'),
	say('Desde `main` no se puede nombrar a `x`: allí no existe.', 'From `main` you cannot name `x`: it does not exist there.'),
);
const pop = timed(
	say('Al terminar `duplicar`, su marco se quita de la pila y `x` deja de existir.', 'When `double_it` ends, its frame is popped off the stack and `x` ceases to exist.'),
	say('La línea 16 imprime 5: la función nunca tocó la variable de quien llama.', "Line 16 prints 5: the function never touched the caller's variable."),
	say('Es la regla de C: los argumentos se pasan siempre por valor.', "That is C's rule: arguments are always passed by value."),
);
const giveBack = timed(
	say('Para traer un resultado de vuelta, la función lo devuelve con `return`.', 'To bring a result back, the function returns it with `return`.'),
	say('`duplicado` recibe otra copia de 5 y la línea 7 devuelve `x * 2`: 10.', '`doubled` gets another copy of 5 and line 7 returns `x * 2`: 10.'),
	say('El marco se va y es `main` quien decide guardar el 10 en `numero`.', 'The frame goes, and it is `main` that decides to store the 10 in `number`.'),
);
const keep = timed(
	say('`static int contador` no vive en ningún marco y su `= 0` se aplica una sola vez.', '`static int counter` lives in no frame, and its `= 0` applies only once.'),
	say('Línea 19: `contador` pasa a 1. El marco se va, pero `contador` queda.', 'Line 19: `counter` becomes 1. The frame goes, but `counter` stays.'),
	say('Línea 20: vale 2. Conserva su valor entre llamadas y solo esa función lo ve.', 'Line 20: it is 2. It keeps its value between calls, and only that function sees it.'),
);
const close = timed(
	say('C pasa los argumentos siempre por valor: cada llamada recibe copias.', 'C always passes arguments by value: every call gets copies.'),
	say('C no tiene pasaje por referencia: para cambiar `numero` hace falta su dirección.', 'C has no pass by reference: changing `number` takes its address.'),
	say('Esa técnica, con punteros que también se copian, llega en `punteros-y-direcciones`.', 'That technique, with pointers that are copied too, comes in `punteros-y-direcciones`.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'copy', label: { es: 'Una copia viaja a la función', en: 'A copy travels to the function' } },
		{ id: 'scope', label: { es: 'Dónde se ve cada variable', en: 'Where each variable is visible' } },
		{ id: 'pop', label: { es: 'El marco se va', en: 'The frame goes away' } },
		{ id: 'return', label: { es: 'El camino de vuelta', en: 'The way back' } },
		{ id: 'static', label: { es: 'Una variable que recuerda', en: 'A variable that remembers' } },
		{ id: 'value', label: { es: 'Siempre por valor', en: 'Always by value' } },
	],
	steps: [
		// ─── Scene 1. A copy travels to the function ────────────────────────
		{
			id: 'build',
			chapter: 'copy',
			scene: 'journey',
			title: { es: 'El programa y la pila de llamadas', en: 'The program and the call stack' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-main', 5000),
					{ at: 100, do: 'enter', el: 'f-main', dur: 800 },
					{ at: 300, do: 'enter', el: 'm-14' },
					{ at: 600, do: 'enter', el: 'm-15' },
					{ at: 900, do: 'enter', el: 'm-16' },
					{ at: 1200, do: 'enter', el: 'm-17' },
					{ at: 1500, do: 'enter', el: 'm-18' },
					{ at: 1800, do: 'enter', el: 'm-19' },
					{ at: 2100, do: 'enter', el: 'm-20' },
					{ at: 2400, do: 'enter', el: 'm-21' },
					{ at: build.start(1), do: 'pulse', el: 'f-main' },
					{ at: build.start(1) + 800, do: 'enter', el: 'stack-tag' },
					{ at: build.start(2), do: 'enter', el: 'hl' },
					{ at: build.start(2), do: 'enter', el: 'p' },
					{ at: build.start(2) + 600, do: 'enter', el: 'on-14' },
					{ at: build.start(2) + 600, do: 'pulse', el: 'm-14' },
					{ at: build.start(2) + 1000, do: 'enter', el: 'c-num' },
					{ at: build.start(2) + 1800, do: 'enter', el: 'num-5' },
					{ at: build.start(2) + 2400, do: 'pulse', el: 'c-num' },
				),
			},
		},
		{
			id: 'call',
			chapter: 'copy',
			scene: 'journey',
			title: { es: 'Una llamada apila un marco', en: 'A call pushes a frame' },
			subtitles: call.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'on-14', dur: 400 },
					...runTo(200, 15),
					{ at: 1100, do: 'enter', el: 'on-15' },
					{ at: 1100, do: 'pulse', el: 'm-15' },
					shot(1300, 'shot-stack', 2200),
					{ at: 2000, do: 'enter', el: 'f-dup', dur: 800 },
					{ at: 3000, do: 'pulse', el: 'f-dup' },
					// The value of `numero` is copied; the variable itself stays in main.
					{ at: call.start(1), do: 'move', el: 'tk-copy', to: 'a-num', dur: 1 },
					{ at: call.start(1) + 100, do: 'enter', el: 'tk-copy' },
					{ at: call.start(1) + 600, do: 'draw', el: 'fl-copy', dur: 1100 },
					{ at: call.start(1) + 700, do: 'move', el: 'tk-copy', to: 'a-x', dur: 1700 },
					{ at: call.start(1) + 2500, do: 'exit', el: 'tk-copy', dur: 300 },
					{ at: call.start(1) + 2500, do: 'enter', el: 'x-5' },
					{ at: call.start(1) + 2600, do: 'pulse', el: 'c-x' },
					{ at: call.start(1) + 3000, do: 'enter', el: 'lb-copy' },
					{ at: call.start(1) + 3800, do: 'pulse', el: 'c-num' },
				),
			},
		},
		{
			id: 'change',
			chapter: 'copy',
			scene: 'journey',
			title: { es: 'La función cambia su copia', en: 'The function changes its copy' },
			subtitles: change.list,
			motion: {
				cues: seq(
					shot(0, 'shot-top', 1800),
					...runTo(300, 4, 1100),
					{ at: 1400, do: 'enter', el: 'on-4' },
					{ at: 1400, do: 'enter', el: 'hx-4' },
					{ at: 1400, do: 'pulse', el: 'm-4' },
					{ at: 2200, do: 'exit', el: 'x-5', dur: 300 },
					{ at: 2400, do: 'enter', el: 'x-10' },
					{ at: 2600, do: 'pulse', el: 'c-x' },
					...runTo(change.start(1), 5, 700),
					{ at: change.start(1) + 700, do: 'enter', el: 'on-5' },
					{ at: change.start(1) + 800, do: 'type', el: 'out-1', dur: 900 },
					shot(change.start(1) + 1600, 'shot-stack', 1800),
					{ at: change.start(1) + 2600, do: 'enter', el: 'lb-same' },
					{ at: change.start(1) + 3000, do: 'pulse', el: 'c-num' },
				),
			},
		},

		// ─── Scene 2. Where each variable is visible ────────────────────────
		{
			id: 'scope',
			chapter: 'scope',
			scene: 'journey',
			title: { es: 'Cada variable se ve en su bloque', en: 'Each variable is visible in its block' },
			subtitles: scope.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-copy', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-same', dur: 400 },
					shot(200, 'shot-scope', 1800),
					{ at: 600, do: 'draw', el: 'sc-x', dur: 900 },
					{ at: 800, do: 'enter', el: 'zone-dup' },
					{ at: 1400, do: 'enter', el: 'scope-x' },
					{ at: 2600, do: 'draw', el: 'sc-num', dur: 900 },
					{ at: 2800, do: 'enter', el: 'zone-main' },
					{ at: 3400, do: 'enter', el: 'scope-num' },
					{ at: scope.start(1) + 300, do: 'enter', el: 'no-x' },
					{ at: scope.start(1) + 900, do: 'pulse', el: 'no-x' },
					{ at: scope.start(1) + 2000, do: 'pulse', el: 'c-x' },
				),
			},
		},

		// ─── Scene 3. The frame goes away ───────────────────────────────────
		{
			id: 'pop',
			chapter: 'pop',
			scene: 'journey',
			title: { es: 'El marco se quita de la pila', en: 'The frame is popped' },
			subtitles: pop.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'sc-x', dur: 400 },
					{ at: 0, do: 'exit', el: 'sc-num', dur: 400 },
					{ at: 0, do: 'exit', el: 'zone-dup', dur: 400 },
					{ at: 0, do: 'exit', el: 'zone-main', dur: 400 },
					{ at: 0, do: 'exit', el: 'scope-x', dur: 400 },
					{ at: 0, do: 'exit', el: 'scope-num', dur: 400 },
					{ at: 0, do: 'exit', el: 'no-x', dur: 400 },
					{ at: 0, do: 'exit', el: 'hx-4', dur: 400 },
					shot(200, 'shot-stack', 1600),
					{ at: 300, do: 'move', el: 'hl', to: 'ln-6', dur: 600 },
					{ at: 1200, do: 'exit', el: 'fl-copy', dur: 500 },
					{ at: 1400, do: 'exit', el: 'f-dup', dur: 900 },
					{ at: 1600, do: 'move', el: 'p', to: 'a-m15', dur: 1000 },
					{ at: 2400, do: 'enter', el: 'lb-gone' },
					{ at: pop.start(1), do: 'exit', el: 'lb-gone', dur: 400 },
					{ at: pop.start(1), do: 'exit', el: 'on-15', dur: 400 },
					shot(pop.start(1), 'shot-main', 1800),
					...runTo(pop.start(1) + 200, 16, 1300),
					{ at: pop.start(1) + 1500, do: 'enter', el: 'on-16' },
					{ at: pop.start(1) + 1600, do: 'type', el: 'out-2', dur: 800 },
					{ at: pop.start(1) + 2600, do: 'pulse', el: 'c-num' },
					{ at: pop.start(2) + 400, do: 'enter', el: 'lb-value' },
					{ at: pop.start(2) + 1400, do: 'pulse', el: 'lb-value' },
				),
			},
		},

		// ─── Scene 4. The way back ──────────────────────────────────────────
		{
			id: 'return',
			chapter: 'return',
			scene: 'journey',
			title: { es: 'return trae el resultado', en: 'return brings the result back' },
			subtitles: giveBack.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-value', dur: 400 },
					{ at: 0, do: 'exit', el: 'on-16', dur: 400 },
					shot(200, 'shot-stack', 1800),
					...runTo(600, 17),
					{ at: 1500, do: 'enter', el: 'on-17' },
					{ at: 1500, do: 'pulse', el: 'm-17' },
					{ at: giveBack.start(1), do: 'enter', el: 'f-dpo', dur: 800 },
					{ at: giveBack.start(1) + 900, do: 'move', el: 'tk-copy2', to: 'a-num', dur: 1 },
					{ at: giveBack.start(1) + 1000, do: 'enter', el: 'tk-copy2' },
					{ at: giveBack.start(1) + 1000, do: 'enter', el: 'fl-copy' },
					{ at: giveBack.start(1) + 1300, do: 'move', el: 'tk-copy2', to: 'a-x', dur: 1500 },
					{ at: giveBack.start(1) + 2800, do: 'exit', el: 'tk-copy2', dur: 300 },
					{ at: giveBack.start(1) + 2800, do: 'enter', el: 'x2-5' },
					{ at: giveBack.start(1) + 2900, do: 'exit', el: 'fl-copy', dur: 400 },
					...runTo(giveBack.start(1) + 3000, 7, 900),
					{ at: giveBack.start(1) + 3900, do: 'enter', el: 'on-7' },
					{ at: giveBack.start(1) + 3900, do: 'pulse', el: 'm-7' },
					{ at: giveBack.start(1) + 4300, do: 'move', el: 'tk-ret', to: 'a-x', dur: 1 },
					{ at: giveBack.start(1) + 4400, do: 'enter', el: 'tk-ret' },
					// The result travels down as the frame is popped; main stores it.
					{ at: giveBack.start(2), do: 'draw', el: 'fl-ret', dur: 1000 },
					{ at: giveBack.start(2) + 200, do: 'move', el: 'tk-ret', to: 'a-num', dur: 1800 },
					{ at: giveBack.start(2) + 600, do: 'exit', el: 'f-dpo', dur: 800 },
					{ at: giveBack.start(2) + 1400, do: 'enter', el: 'lb-ret' },
					...runTo(giveBack.start(2) + 800, 17, 800),
					{ at: giveBack.start(2) + 2000, do: 'exit', el: 'tk-ret', dur: 300 },
					{ at: giveBack.start(2) + 2000, do: 'exit', el: 'num-5', dur: 300 },
					{ at: giveBack.start(2) + 2200, do: 'enter', el: 'num-10' },
					{ at: giveBack.start(2) + 2400, do: 'pulse', el: 'c-num' },
					{ at: giveBack.start(2) + 2900, do: 'exit', el: 'on-17', dur: 400 },
					...runTo(giveBack.start(2) + 3000, 18, 700),
					{ at: giveBack.start(2) + 3700, do: 'enter', el: 'on-18' },
					{ at: giveBack.start(2) + 3800, do: 'type', el: 'out-3', dur: 500 },
				),
			},
		},

		// ─── Scene 5. A variable that remembers ─────────────────────────────
		{
			id: 'static',
			chapter: 'static',
			scene: 'journey',
			title: { es: 'Un contador static', en: 'A static counter' },
			subtitles: keep.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'on-18', dur: 400 },
					{ at: 0, do: 'exit', el: 'fl-ret', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-ret', dur: 400 },
					shot(200, 'shot-shelf', 2200),
					{ at: 900, do: 'enter', el: 'shelf', dur: 800 },
					{ at: 1600, do: 'enter', el: 'cnt-0' },
					{ at: 2200, do: 'enter', el: 'on-9' },
					{ at: 2200, do: 'pulse', el: 'm-9' },
					{ at: 2800, do: 'enter', el: 'lb-once' },
					// First call: the frame comes and goes; the counter stays on its shelf.
					{ at: keep.start(1), do: 'exit', el: 'lb-once', dur: 400 },
					{ at: keep.start(1), do: 'exit', el: 'on-9', dur: 400 },
					...runTo(keep.start(1) + 100, 19, 800),
					{ at: keep.start(1) + 900, do: 'enter', el: 'on-19' },
					{ at: keep.start(1) + 1000, do: 'enter', el: 'f-sig', dur: 700 },
					...runTo(keep.start(1) + 1700, 10, 700),
					{ at: keep.start(1) + 2400, do: 'enter', el: 'on-10' },
					{ at: keep.start(1) + 2400, do: 'draw', el: 'fl-static', dur: 700 },
					{ at: keep.start(1) + 3100, do: 'exit', el: 'cnt-0', dur: 300 },
					{ at: keep.start(1) + 3300, do: 'enter', el: 'cnt-1' },
					{ at: keep.start(1) + 3400, do: 'pulse', el: 'c-cnt' },
					...runTo(keep.start(1) + 3700, 11, 500),
					{ at: keep.start(1) + 4200, do: 'enter', el: 'on-11' },
					{ at: keep.start(1) + 4300, do: 'type', el: 'out-4', dur: 400 },
					{ at: keep.start(1) + 4800, do: 'exit', el: 'fl-static', dur: 400 },
					{ at: keep.start(1) + 4800, do: 'exit', el: 'f-sig', dur: 700 },
					...runTo(keep.start(1) + 4600, 19, 500),
					{ at: keep.start(1) + 5200, do: 'exit', el: 'on-10', dur: 200 },
					{ at: keep.start(1) + 5200, do: 'exit', el: 'on-11', dur: 200 },
					{ at: keep.start(1) + 5400, do: 'pulse', el: 'c-cnt' },
					// Second call: same frame again, and the counter keeps counting.
					{ at: keep.start(2), do: 'exit', el: 'on-19', dur: 400 },
					...runTo(keep.start(2) + 100, 20, 600),
					{ at: keep.start(2) + 700, do: 'enter', el: 'on-20' },
					{ at: keep.start(2) + 800, do: 'enter', el: 'f-sig', dur: 600 },
					...runTo(keep.start(2) + 1400, 10, 600),
					{ at: keep.start(2) + 2000, do: 'enter', el: 'on-10' },
					{ at: keep.start(2) + 2000, do: 'enter', el: 'fl-static' },
					{ at: keep.start(2) + 2500, do: 'exit', el: 'cnt-1', dur: 300 },
					{ at: keep.start(2) + 2700, do: 'enter', el: 'cnt-2' },
					{ at: keep.start(2) + 2800, do: 'pulse', el: 'c-cnt' },
					...runTo(keep.start(2) + 3100, 11, 500),
					{ at: keep.start(2) + 3600, do: 'enter', el: 'on-11' },
					{ at: keep.start(2) + 3700, do: 'type', el: 'out-5', dur: 400 },
					{ at: keep.start(2) + 4200, do: 'exit', el: 'fl-static', dur: 400 },
					{ at: keep.start(2) + 4200, do: 'exit', el: 'f-sig', dur: 700 },
					...runTo(keep.start(2) + 4300, 20, 600),
					{ at: keep.start(2) + 5000, do: 'exit', el: 'on-10', dur: 200 },
					{ at: keep.start(2) + 5000, do: 'exit', el: 'on-11', dur: 200 },
					{ at: keep.start(2) + 5100, do: 'enter', el: 'lb-keep' },
				),
			},
		},

		// ─── Scene 6. Always by value ───────────────────────────────────────
		{
			id: 'close',
			chapter: 'value',
			scene: 'journey',
			title: { es: 'C pasa siempre por valor', en: 'C always passes by value' },
			subtitles: close.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'on-20', dur: 400 },
					...runTo(200, 21, 700),
					{ at: 900, do: 'enter', el: 'on-21' },
					{ at: 900, do: 'pulse', el: 'm-21' },
					// The camera pulls back to reveal the whole stack, the shelf and the way back.
					{ at: 1400, do: 'camera', to: 'all', dur: 3000 },
					{ at: 1800, do: 'enter', el: 'fl-ret' },
					{ at: 2200, do: 'flow', el: 'fl-ret' },
					{ at: 2400, do: 'enter', el: 'lb-ret' },
					{ at: 3200, do: 'pulse', el: 'f-main' },
					{ at: close.start(1) + 300, do: 'exit', el: 'lb-keep', dur: 400 },
					{ at: close.start(1) + 800, do: 'enter', el: 'addr' },
					{ at: close.start(1) + 1400, do: 'pulse', el: 'c-num' },
					{ at: close.start(2) + 300, do: 'enter', el: 'lb-next' },
					{ at: close.start(2) + 1200, do: 'exit', el: 'hl', dur: 400 },
					{ at: close.start(2) + 1600, do: 'pulse', el: 'lb-next' },
				),
			},
		},
	],
};
