import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a method call": a short film (about two minutes) for the Java
// lesson "Métodos y Funciones en Java" (lesson 5). It plays on a single persistent
// canvas (`data-scene="journey"` in `src/components/animaciones/metodos-funciones-java.astro`):
// an isometric system where `main()` is the base frame on the Call Stack, each
// called method pushes its own stack frame with local parameter copies, a light
// blue particle is the execution flow, magenta marks the misconception that
// mutating a parameter alters the caller's variable, and violet highlights the
// pass-by-value copy, `return` value, and compile-time overload resolution.

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

/** Types the editor lines `from`..`to` of one page (`ea` or `eb`), one after the other. */
const typeLines = (at: number, page: 'ea' | 'eb', from: number, to: number, gap: number): MotionCue[] =>
	Array.from({ length: to - from + 1 }, (_, index) => ({
		at: at + index * gap,
		do: 'type' as const,
		el: `${page}-${from + index}`,
		dur: Math.max(200, gap),
	}));

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

// ─── Captions ───────────────────────────────────────────────────────────────
const declare = timed(
	say(
		'Un método agrupa código bajo una firma: nombre, parámetros y retorno.',
		'A method groups code under a signature: name, parameters and return.',
	),
	say(
		'`modificarPrimitivo(int)` es `void`; `calcularTotal` devuelve `int` con `return`.',
		'`modifyPrimitive(int)` is `void`; `calculateTotal` returns `int` with `return`.',
	),
);
const invoke = timed(
	say(
		'La partícula celeste es el flujo de ejecución. En `main`, crea `x = 10`.',
		'The light blue particle is the execution flow. In `main`, it sets `x = 10`.',
	),
	say(
		'Al llamar a `modificarPrimitivo(x)`, prepara los argumentos con el valor `10`.',
		'When calling `modifyPrimitive(x)`, it prepares the arguments with value `10`.',
	),
);
const push = timed(
	say(
		'La JVM usa la pila de llamadas (Call Stack): apila un nuevo marco de pila.',
		'The JVM uses the Call Stack: it pushes a new stack frame for the call.',
	),
	say(
		'Cada marco de pila aisla sus parámetros y variables locales del resto.',
		'Each stack frame isolates its parameters and local variables from the rest.',
	),
	say(
		'Por pasaje por valor, `numero` recibe una copia de `10`, no la variable `x`.',
		'By pass-by-value, `number` receives a copy of `10`, not the variable `x`.',
	),
);
const mutate = timed(
	say(
		'Dentro del método, `numero = 500` sobrescribe el parámetro local con `500`.',
		'Inside the method, `number = 500` overwrites the local parameter with `500`.',
	),
	say(
		'¿Cambia `x` en `main`? Parecería que asignar `500` altera la variable original.',
		'Does `x` change in `main`? Assigning `500` might seem to alter the caller.',
	),
);
const callerSafe = timed(
	say(
		'Pero el pasaje por valor es estricto: `500` solo tocó la copia local del marco.',
		'But pass-by-value is strict: `500` only touched the frame local copy.',
	),
	say(
		'Al terminar el método, el marco se desapila y `x` en `main` sigue intacta en `10`.',
		'When the method ends, its frame is popped and `x` in `main` stays untouched at `10`.',
	),
);
const returnPop = timed(
	say(
		'Ahora `main` llama a `calcularTotal(x, 5)`: apila un marco con copias `10` y `5`.',
		'Now `main` calls `calculateTotal(x, 5)`: a frame is pushed with `10` and `5`.',
	),
	say(
		'Calcula `total = 15` y `return` entrega ese valor de vuelta al llamador.',
		'It computes `total = 15` and `return` hands that value back to the caller.',
	),
	say(
		'El marco se desapila y `main` guarda `15` en `res` para imprimirlo.',
		'The frame is popped and `main` stores `15` in `res` to print it.',
	),
);
const overload = timed(
	say(
		'La sobrecarga define varios métodos con el mismo nombre y distintos parámetros.',
		'Overloading defines several methods with the same name and different parameters.',
	),
	say(
		'En `sumar(3.5, 2.5)`, el compilador mira los tipos y elige `sumar(double, double)`.',
		'In `add(3.5, 2.5)`, the compiler checks the types and picks `add(double, double)`.',
	),
	say(
		'Queda resuelto antes de ejecutar: el flujo va directo al método elegido.',
		'Resolved before running: the flow goes straight to the chosen method.',
	),
);
const recap = timed(
	say(
		'La pila de llamadas sigue orden LIFO: el último marco en entrar sale primero.',
		'The Call Stack follows LIFO order: the last frame in is the first one out.',
	),
	say(
		'Todo argumento viaja por pasaje por valor (copia), y `return` desapila con el dato.',
		'Every argument travels by pass-by-value (copy), and `return` pops with the result.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'call', label: { es: 'Firma e invocación', en: 'Signature and invocation' } },
		{ id: 'stack', label: { es: 'El marco en la pila', en: 'The frame on the stack' } },
		{ id: 'pass-by-value', label: { es: 'Pasaje por valor', en: 'Pass-by-value' } },
		{ id: 'return', label: { es: 'return y desapilado', en: 'return and frame pop' } },
		{ id: 'overload', label: { es: 'Sobrecarga de métodos', en: 'Method overloading' } },
		{ id: 'recap', label: { es: 'El ciclo en la pila', en: 'The stack lifecycle' } },
	],
	steps: [
		// ─── Scene 1. Signature and invocation ──────────────────────────────
		{
			id: 'declare',
			chapter: 'call',
			scene: 'journey',
			title: { es: 'Dos métodos y sus firmas', en: 'Two methods and their signatures' },
			subtitles: declare.list,
			motion: {
				cues: seq(
					shot(0, 'shot-methods', 4800),
					{ at: 200, do: 'enter', el: 'floor-mod' },
					...typeLines(300, 'ea', 1, 5, 280),
					{ at: 1600, do: 'enter', el: 'lb-m3' },
					{ at: 2300, do: 'pulse', el: 'lb-m3' },
					{ at: declare.start(1), do: 'enter', el: 'floor-calc' },
					...typeLines(declare.start(1) + 200, 'ea', 6, 11, 240),
					{ at: declare.start(1) + 1200, do: 'enter', el: 'lb-c8' },
					{ at: declare.start(1) + 2000, do: 'enter', el: 'lb-c9' },
					{ at: declare.start(1) + 2800, do: 'pulse', el: 'lb-c9' },
					...typeLines(declare.start(1) + 3000, 'ea', 12, 20, 180),
				),
			},
		},
		{
			id: 'invoke',
			chapter: 'call',
			scene: 'journey',
			title: { es: 'main prepara el argumento', en: 'main prepares the argument' },
			subtitles: invoke.list,
			motion: {
				cues: seq(
					shot(0, 'shot-main', 2200),
					{ at: 100, do: 'enter', el: 'floor-main' },
					{ at: 300, do: 'enter', el: 'm-entry' },
					{ at: 450, do: 'enter', el: 'm-var' },
					{ at: 600, do: 'enter', el: 'm-call' },
					{ at: 750, do: 'enter', el: 'm-calc-call' },
					{ at: 900, do: 'enter', el: 'm-print' },
					{ at: 1050, do: 'enter', el: 'm-end' },
					{ at: 1100, do: 'draw', el: 'tr-main', dur: 900 },
					{ at: 1500, do: 'enter', el: 'hl' },
					{ at: 1600, do: 'enter', el: 'p' },
					{ at: 2100, do: 'draw', el: 'fl-0', dur: 600 },
					{ at: 2200, do: 'move', el: 'p', to: 'a-var', dur: 900 },
					{ at: 3100, do: 'enter', el: 'var-on' },
					{ at: 3200, do: 'enter', el: 'lb-var' },
					{ at: 3800, do: 'pulse', el: 'lb-var' },
					{ at: invoke.start(1) + 200, do: 'draw', el: 'fl-1', dur: 600 },
					{ at: invoke.start(1) + 300, do: 'move', el: 'p', to: 'a-call', dur: 900 },
					{ at: invoke.start(1) + 300, do: 'move', el: 'hl', to: 'ln-15', dur: 600 },
					{ at: invoke.start(1) + 1200, do: 'enter', el: 'call-on' },
					{ at: invoke.start(1) + 1600, do: 'enter', el: 'val-10' },
					{ at: invoke.start(1) + 2300, do: 'pulse', el: 'val-10' },
				),
			},
		},

		// ─── Scene 2. The frame on the stack ────────────────────────────────
		{
			id: 'push',
			chapter: 'stack',
			scene: 'journey',
			title: { es: 'Un nuevo marco en la pila', en: 'A new frame on the stack' },
			subtitles: push.list,
			motion: {
				cues: seq(
					shot(0, 'shot-push', 2200),
					{ at: 300, do: 'enter', el: 'hc-2' },
					{ at: 500, do: 'draw', el: 'rt-push', dur: 1000 },
					{ at: 700, do: 'move', el: 'p', to: 'a-m3', dur: 1300 },
					{ at: 700, do: 'move', el: 'hl', to: 'ln-2', dur: 700 },
					{ at: 2100, do: 'enter', el: 'push-tag' },
					{ at: 2800, do: 'pulse', el: 'push-tag' },
					{ at: push.start(1) + 300, do: 'move', el: 'hl', to: 'ln-3', dur: 600 },
					{ at: push.start(1) + 900, do: 'enter', el: 'm3-on' },
					{ at: push.start(1) + 1500, do: 'pulse', el: 'floor-mod' },
					{ at: push.start(2) + 200, do: 'enter', el: 'copy-10' },
					{ at: push.start(2) + 900, do: 'enter', el: 'cp-tag' },
					{ at: push.start(2) + 1800, do: 'pulse', el: 'copy-10' },
				),
			},
		},

		// ─── Scene 3. Pass-by-value ─────────────────────────────────────────
		{
			id: 'mutate',
			chapter: 'pass-by-value',
			scene: 'journey',
			title: { es: 'Modificar la copia local', en: 'Modifying the local copy' },
			subtitles: mutate.list,
			motion: {
				cues: seq(
					shot(0, 'shot-mutate', 2000),
					...clear(200, 'hc-2', 'push-tag'),
					{ at: 500, do: 'move', el: 'p', to: 'a-m3', dur: 600 },
					{ at: 1000, do: 'exit', el: 'copy-10', dur: 350 },
					{ at: 1100, do: 'enter', el: 'copy-500' },
					{ at: 1200, do: 'enter', el: 'mut-tag' },
					{ at: 2000, do: 'pulse', el: 'copy-500' },
					{ at: 2700, do: 'pulse', el: 'mut-tag' },
					// The wrong expectation in magenta: did `x` in `main` turn into 500?
					shot(mutate.start(1), 'shot-expect', 2000),
					{ at: mutate.start(1) + 300, do: 'draw', el: 'rt-exp', dur: 900 },
					{ at: mutate.start(1) + 1200, do: 'enter', el: 'var-x' },
					{ at: mutate.start(1) + 1200, do: 'enter', el: 'hx-14' },
					{ at: mutate.start(1) + 1500, do: 'enter', el: 'exp' },
					{ at: mutate.start(1) + 2400, do: 'pulse', el: 'exp' },
				),
			},
		},
		{
			id: 'caller-safe',
			chapter: 'pass-by-value',
			scene: 'journey',
			title: { es: 'x en main sigue intacta', en: 'x in main remains untouched' },
			subtitles: callerSafe.list,
			motion: {
				cues: seq(
					shot(0, 'shot-expect', 2000),
					...clear(200, 'rt-exp', 'var-x', 'exp', 'hx-14', 'cp-tag', 'mut-tag'),
					{ at: 700, do: 'enter', el: 'safe-tag' },
					{ at: 1400, do: 'pulse', el: 'safe-tag' },
					{ at: 2200, do: 'pulse', el: 'lb-var' },
					shot(callerSafe.start(1), 'shot-main', 2000),
					...clear(callerSafe.start(1) + 200, 'm3-on', 'copy-500', 'rt-push', 'val-10'),
					{ at: callerSafe.start(1) + 400, do: 'move', el: 'p', to: 'a-var', dur: 1100 },
					{ at: callerSafe.start(1) + 400, do: 'move', el: 'hl', to: 'ln-16', dur: 700 },
					{ at: callerSafe.start(1) + 1600, do: 'type', el: 'out-1', dur: 800 },
					{ at: callerSafe.start(1) + 2600, do: 'pulse', el: 'lb-var' },
				),
			},
		},

		// ─── Scene 4. return and frame pop ──────────────────────────────────
		{
			id: 'return-pop',
			chapter: 'return',
			scene: 'journey',
			title: { es: 'return entrega el resultado y desapila', en: 'return delivers the result and pops' },
			subtitles: returnPop.list,
			motion: {
				cues: seq(
					shot(0, 'shot-return', 2200),
					...clear(100, 'safe-tag'),
					{ at: 200, do: 'draw', el: 'fl-2', dur: 600 },
					{ at: 300, do: 'move', el: 'p', to: 'a-calc-call', dur: 900 },
					{ at: 300, do: 'move', el: 'hl', to: 'ln-17', dur: 600 },
					{ at: 1200, do: 'enter', el: 'calc-call-on' },
					{ at: 1500, do: 'draw', el: 'rt-calc', dur: 900 },
					{ at: 1600, do: 'move', el: 'p', to: 'a-c8', dur: 1200 },
					{ at: 1600, do: 'move', el: 'hl', to: 'ln-8', dur: 700 },
					{ at: 2800, do: 'enter', el: 'c8-on' },
					{ at: returnPop.start(1), do: 'move', el: 'p', to: 'a-c9', dur: 900 },
					{ at: returnPop.start(1), do: 'move', el: 'hl', to: 'ln-9', dur: 600 },
					{ at: returnPop.start(1) + 900, do: 'enter', el: 'c9-on' },
					{ at: returnPop.start(1) + 1000, do: 'enter', el: 'hv-9' },
					{ at: returnPop.start(1) + 1200, do: 'enter', el: 'ret-val' },
					{ at: returnPop.start(1) + 1800, do: 'draw', el: 'rt-ret', dur: 1000 },
					{ at: returnPop.start(1) + 2600, do: 'enter', el: 'ret-tag' },
					shot(returnPop.start(2), 'shot-main', 2000),
					...clear(returnPop.start(2) + 200, 'c8-on', 'c9-on', 'hv-9', 'ret-tag'),
					{ at: returnPop.start(2) + 400, do: 'draw', el: 'fl-3', dur: 600 },
					{ at: returnPop.start(2) + 500, do: 'move', el: 'p', to: 'a-print', dur: 900 },
					{ at: returnPop.start(2) + 500, do: 'move', el: 'hl', to: 'ln-18', dur: 600 },
					{ at: returnPop.start(2) + 1400, do: 'enter', el: 'print-on' },
					{ at: returnPop.start(2) + 1500, do: 'type', el: 'out-2', dur: 800 },
					{ at: returnPop.start(2) + 2500, do: 'move', el: 'p', to: 'a-end', dur: 900 },
					{ at: returnPop.start(2) + 2500, do: 'move', el: 'hl', to: 'ln-19', dur: 600 },
					{ at: returnPop.start(2) + 3400, do: 'enter', el: 'end-on' },
				),
			},
		},

		// ─── Scene 5. Method overloading ────────────────────────────────────
		{
			id: 'overload',
			chapter: 'overload',
			scene: 'journey',
			title: { es: 'Sobrecarga: decide el compilador', en: 'Overloading: the compiler decides' },
			subtitles: overload.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'floor-mod', 'floor-calc', 'lb-m3', 'lb-c8', 'lb-c9', 'lb-var', 'ret-val'),
					...clear(0, 'rt-calc', 'rt-ret', 'out-1', 'out-2', 'var-on', 'call-on', 'calc-call-on', 'print-on', 'end-on', 'fl-0', 'fl-1', 'fl-2', 'fl-3', 'ea'),
					shot(0, 'shot-over', 2200),
					{ at: 500, do: 'enter', el: 'eb' },
					...typeLines(600, 'eb', 1, 20, 120),
					{ at: 900, do: 'enter', el: 'floor-sum' },
					{ at: 1600, do: 'enter', el: 'sg-3' },
					{ at: 2000, do: 'enter', el: 'sg-7' },
					{ at: 2400, do: 'enter', el: 'sg-11' },
					// Compile time: argument types select the third overload before running.
					{ at: overload.start(1) + 200, do: 'enter', el: 'arg' },
					{ at: overload.start(1) + 1000, do: 'pulse', el: 'arg' },
					{ at: overload.start(1) + 1600, do: 'draw', el: 'rt-over', dur: 900 },
					{ at: overload.start(1) + 2400, do: 'enter', el: 'calc-off' },
					{ at: overload.start(1) + 2500, do: 'enter', el: 'hv-b10' },
					{ at: overload.start(1) + 2800, do: 'enter', el: 'pick' },
					// Run time: the flow goes straight to sumar(double, double).
					{ at: overload.start(2), do: 'move', el: 'p', to: 'a-call', dur: 1 },
					{ at: overload.start(2), do: 'move', el: 'hl', to: 'ln-17', dur: 1 },
					{ at: overload.start(2) + 200, do: 'enter', el: 'p' },
					{ at: overload.start(2) + 200, do: 'enter', el: 'hl' },
					{ at: overload.start(2) + 200, do: 'enter', el: 'call-on' },
					{ at: overload.start(2) + 1000, do: 'move', el: 'p', to: 'a-s11', dur: 1200 },
					{ at: overload.start(2) + 1000, do: 'move', el: 'hl', to: 'ln-11', dur: 800 },
					{ at: overload.start(2) + 2200, do: 'enter', el: 's11-on' },
					{ at: overload.start(2) + 3000, do: 'move', el: 'p', to: 'a-end', dur: 1000 },
					{ at: overload.start(2) + 3000, do: 'move', el: 'hl', to: 'ln-18', dur: 600 },
					{ at: overload.start(2) + 3700, do: 'type', el: 'out-b', dur: 600 },
				),
			},
		},

		// ─── Scene 6. The stack lifecycle ───────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'Copia al entrar, resultado al salir', en: 'Copy on entry, result on exit' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'floor-sum', 's11-on', 'calc-off', 'sg-3', 'sg-7', 'sg-11', 'arg', 'pick', 'hv-b10', 'eb', 'out-b', 'call-on', 'rt-over'),
					shot(200, 'shot-all', 2800),
					{ at: 600, do: 'enter', el: 'ea' },
					{ at: 700, do: 'enter', el: 'floor-mod' },
					{ at: 800, do: 'enter', el: 'floor-calc' },
					{ at: 900, do: 'enter', el: 'lb-var' },
					{ at: 1000, do: 'enter', el: 'lb-m3' },
					{ at: 1100, do: 'enter', el: 'lb-c8' },
					{ at: 1100, do: 'enter', el: 'lb-c9' },
					{ at: 1200, do: 'enter', el: 'ret-val' },
					{ at: 1300, do: 'enter', el: 'out-1' },
					{ at: 1400, do: 'enter', el: 'out-2' },
					{ at: 1500, do: 'enter', el: 'fl-0' },
					{ at: 1500, do: 'enter', el: 'fl-1' },
					{ at: 1600, do: 'enter', el: 'fl-2' },
					{ at: 1600, do: 'enter', el: 'fl-3' },
					{ at: 1700, do: 'enter', el: 'rt-push' },
					{ at: 1700, do: 'enter', el: 'rt-calc' },
					{ at: 1800, do: 'enter', el: 'rt-ret' },
					{ at: 2200, do: 'flow', el: 'rt-push' },
					{ at: 2200, do: 'flow', el: 'rt-calc' },
					{ at: 2200, do: 'flow', el: 'rt-ret' },
					{ at: recap.start(1) + 200, do: 'enter', el: 'r-copy' },
					{ at: recap.start(1) + 700, do: 'pulse', el: 'lb-var' },
					{ at: recap.start(1) + 1600, do: 'enter', el: 'r-ret' },
					{ at: recap.start(1) + 2200, do: 'pulse', el: 'ret-val' },
				),
			},
		},
	],
};
