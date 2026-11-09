import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a polymorphic call": a short film (about two minutes) for the Java
// lesson "Herencia, polimorfismo y sobrecarga de métodos". It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/viaje-llamada-polimorfica-java.astro`): an isometric
// system where every platform is a class and every module a line of code, a light
// blue particle that is the execution flow, and a violet object whose real type
// decides which method runs. The code is drawn inside the canvas (an editor that
// highlights the running line), so every step is a motion step and the cues below
// keep both halves in sync.

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

/** Types the editor lines `from`..`to` of one page (`ea` or `eb`), one after the other. */
const typeLines = (at: number, page: 'ea' | 'eb', from: number, to: number, gap: number): MotionCue[] =>
	Array.from({ length: to - from + 1 }, (_, index) => ({ at: at + index * gap, do: 'type' as const, el: `${page}-${from + index}`, dur: Math.max(200, gap) }));

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

// ─── Captions ───────────────────────────────────────────────────────────────
const build = timed(
	say('Este sistema es un programa Java: cada plataforma es una clase.', 'This system is a Java program: each platform is a class.'),
	say('`Auto` extiende a `Vehiculo` y sobrescribe `arrancar()`: misma firma, otro código.', '`Car` extends `Vehicle` and overrides `start()`: same signature, different code.'),
);
const assign = timed(
	say('La partícula celeste es el flujo de ejecución. En `main`, crea un objeto `Auto`.', 'The light blue particle is the execution flow. In `main`, it creates a `Car` object.'),
	say('Lo guarda en una variable de tipo `Vehiculo`: un `Auto` es un `Vehiculo`.', 'It stores it in a variable of type `Vehicle`: a `Car` is a `Vehicle`.'),
	say('Tipo declarado: `Vehiculo`. Tipo real del objeto: `Auto`.', 'Declared type: `Vehicle`. Real type of the object: `Car`.'),
);
const check = timed(
	say('Antes de ejecutar, el compilador revisó la llamada mirando el tipo de la variable.', 'Before running, the compiler checked the call by looking at the type of the variable.'),
	say('`Vehiculo` declara `arrancar()`. La variable define qué se puede llamar.', '`Vehicle` declares `start()`. The variable defines what can be called.'),
);
const expect = timed(
	say('¿Qué código se ejecuta? La variable dice `Vehiculo`: parecería que su versión.', 'Which code runs? The variable says `Vehicle`: it would seem to be its version.'),
	say('Pero la JVM no mira la variable: sigue la referencia hasta el objeto real.', 'But the JVM does not look at the variable: it follows the reference to the object.'),
);
const dispatch = timed(
	say('El objeto es un `Auto`: la JVM elige su `arrancar()`. Eso es el despacho dinámico.', 'The object is a `Car`: the JVM picks its `start()`. That is dynamic dispatch.'),
	say('Polimorfismo: la variable dice `Vehiculo`, pero se ejecuta el código de `Auto`.', 'Polymorphism: the variable says `Vehicle`, but the code of `Car` runs.'),
);
const parent = timed(
	say('Dentro de `Auto`, `super.arrancar()` llama a la versión del padre.', 'Inside `Car`, `super.start()` calls the version of the parent.'),
	say('Primero se ejecuta lo que hace todo vehículo; después el flujo vuelve a `Auto`.', 'First, what every vehicle does runs; then the flow returns to `Car`.'),
	say('`Auto` agrega lo suyo: extiende el comportamiento en lugar de reemplazarlo.', '`Car` adds its own part: it extends the behavior instead of replacing it.'),
);
const overload = timed(
	say('La sobrecarga es otra cosa: varios métodos con el mismo nombre en una misma clase.', 'Overloading is something else: several methods with the same name in one class.'),
	say('El compilador elige uno mirando los tipos de los argumentos: `3` es un `int`.', 'The compiler picks one by looking at the argument types: `3` is an `int`.'),
	say('Todo queda resuelto antes de ejecutar: el flujo va directo a `imprimir(int)`.', 'Everything is resolved before running: the flow goes straight to `print(int)`.'),
);
const recap = timed(
	say('Sobrecarga: decide el compilador. Sobrescritura: decide la JVM, en cada llamada.', 'Overloading: the compiler decides. Overriding: the JVM decides, on every call.'),
	say('La variable define qué se puede llamar; el objeto define qué se ejecuta.', 'The variable defines what can be called; the object defines what runs.'),
	say('Así se escribe código que funciona con subclases que todavía no existen.', 'That is how you write code that works with subclasses that do not exist yet.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'types', label: { es: 'Una variable, un objeto', en: 'One variable, one object' } },
		{ id: 'compile', label: { es: 'El compilador mira la variable', en: 'The compiler looks at the variable' } },
		{ id: 'dispatch', label: { es: 'La JVM mira el objeto', en: 'The JVM looks at the object' } },
		{ id: 'super', label: { es: 'super llama al padre', en: 'super calls the parent' } },
		{ id: 'overload', label: { es: 'La sobrecarga se decide antes', en: 'Overloading is decided earlier' } },
		{ id: 'recap', label: { es: 'Quién decide qué', en: 'Who decides what' } },
	],
	steps: [
		// ─── Scene 1. One variable, one object ──────────────────────────────
		{
			id: 'build',
			chapter: 'types',
			scene: 'journey',
			title: { es: 'Dos clases y una sobrescritura', en: 'Two classes and one override' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-classes', 5000),
					{ at: 200, do: 'enter', el: 'floor-veh' },
					...typeLines(300, 'ea', 1, 5, 300),
					{ at: 1600, do: 'enter', el: 'lb-v3' },
					{ at: 2400, do: 'pulse', el: 'lb-v3' },
					{ at: build.start(1), do: 'enter', el: 'floor-auto' },
					...typeLines(build.start(1) + 200, 'ea', 6, 13, 260),
					{ at: build.start(1) + 900, do: 'enter', el: 'lb-ext' },
					{ at: build.start(1) + 2300, do: 'enter', el: 'lb-a10' },
					{ at: build.start(1) + 3100, do: 'pulse', el: 'lb-a10' },
					...typeLines(build.start(1) + 3200, 'ea', 14, 20, 200),
				),
			},
		},
		{
			id: 'assign',
			chapter: 'types',
			scene: 'journey',
			title: { es: 'Un Auto en una variable Vehiculo', en: 'A Car in a Vehicle variable' },
			subtitles: assign.list,
			motion: {
				cues: seq(
					shot(0, 'shot-main', 2200),
					{ at: 100, do: 'enter', el: 'floor-main' },
					{ at: 300, do: 'enter', el: 'm-entry' },
					{ at: 450, do: 'enter', el: 'm-new' },
					{ at: 600, do: 'enter', el: 'm-call' },
					{ at: 750, do: 'enter', el: 'm-end' },
					{ at: 800, do: 'draw', el: 'tr-main', dur: 900 },
					{ at: 900, do: 'enter', el: 'heap' },
					{ at: 1500, do: 'enter', el: 'hl' },
					{ at: 1600, do: 'enter', el: 'p' },
					{ at: 2300, do: 'draw', el: 'fl-0', dur: 600 },
					{ at: 2400, do: 'move', el: 'p', to: 'a-new', dur: 1000 },
					{ at: 3400, do: 'enter', el: 'new-on' },
					{ at: 3400, do: 'pulse', el: 'm-new' },
					{ at: 3700, do: 'enter', el: 'obj', dur: 700 },
					{ at: 4500, do: 'pulse', el: 'obj' },
					{ at: assign.start(1) + 200, do: 'enter', el: 'm-var' },
					{ at: assign.start(1) + 700, do: 'enter', el: 'lb-var' },
					{ at: assign.start(1) + 1300, do: 'draw', el: 'ref', dur: 1000 },
					{ at: assign.start(1) + 2600, do: 'pulse', el: 'm-var' },
					{ at: assign.start(2) + 300, do: 'pulse', el: 'lb-var' },
					{ at: assign.start(2) + 1900, do: 'pulse', el: 'obj' },
				),
			},
		},

		// ─── Scene 2. The compiler looks at the variable ────────────────────
		{
			id: 'check',
			chapter: 'compile',
			scene: 'journey',
			title: { es: 'La llamada, vista por el compilador', en: 'The call, as the compiler sees it' },
			subtitles: check.list,
			motion: {
				cues: seq(
					shot(0, 'shot-call', 2000),
					{ at: 200, do: 'draw', el: 'fl-1', dur: 600 },
					{ at: 300, do: 'move', el: 'p', to: 'a-call', dur: 900 },
					{ at: 300, do: 'move', el: 'hl', to: 'ln-18', dur: 600 },
					{ at: 1200, do: 'enter', el: 'call-on' },
					{ at: 1200, do: 'pulse', el: 'm-call' },
					{ at: 2000, do: 'pulse', el: 'lb-var' },
					{ at: 2600, do: 'enter', el: 'hc-2' },
					{ at: 3400, do: 'pulse', el: 'm-var' },
					{ at: check.start(1) + 200, do: 'enter', el: 'chk' },
					{ at: check.start(1) + 1200, do: 'pulse', el: 'chk' },
					{ at: check.start(1) + 3000, do: 'pulse', el: 'lb-var' },
				),
			},
		},

		// ─── Scene 3. The JVM looks at the object ───────────────────────────
		{
			id: 'expect',
			chapter: 'dispatch',
			scene: 'journey',
			title: { es: '¿La versión de Vehiculo?', en: 'The Vehicle version?' },
			subtitles: expect.list,
			motion: {
				cues: seq(
					shot(0, 'shot-expect', 2000),
					...clear(200, 'chk', 'hc-2'),
					// The wrong expectation: the type of the variable would pick the parent's code.
					{ at: 900, do: 'draw', el: 'rt-exp', dur: 900 },
					{ at: 1800, do: 'enter', el: 'v3-x' },
					{ at: 1800, do: 'enter', el: 'hx-2' },
					{ at: 2000, do: 'enter', el: 'exp' },
					{ at: 2800, do: 'pulse', el: 'exp' },
					// The flow reads the variable and follows its reference to the object.
					shot(expect.start(1), 'shot-obj', 1800),
					{ at: expect.start(1) + 200, do: 'move', el: 'p', to: 'a-var', dur: 800 },
					{ at: expect.start(1) + 1000, do: 'pulse', el: 'm-var' },
					{ at: expect.start(1) + 1100, do: 'draw', el: 'fl-ref', dur: 900 },
					{ at: expect.start(1) + 1200, do: 'move', el: 'p', to: 'a-obj', dur: 1100 },
					{ at: expect.start(1) + 2400, do: 'enter', el: 'o-scan' },
					{ at: expect.start(1) + 2900, do: 'pulse', el: 'o-scan' },
					{ at: expect.start(1) + 3200, do: 'enter', el: 'real' },
				),
			},
		},
		{
			id: 'dispatch',
			chapter: 'dispatch',
			scene: 'journey',
			title: { es: 'Despacho dinámico', en: 'Dynamic dispatch' },
			subtitles: dispatch.list,
			motion: {
				cues: seq(
					shot(0, 'shot-auto', 2200),
					...clear(200, 'rt-exp', 'v3-x', 'exp', 'hx-2'),
					// The real type of the object picks the override.
					{ at: 700, do: 'draw', el: 'rt-dyn', dur: 1100 },
					{ at: 900, do: 'move', el: 'p', to: 'a-a10', dur: 1500 },
					{ at: 900, do: 'move', el: 'hl', to: 'ln-9', dur: 900 },
					{ at: 1500, do: 'exit', el: 'o-scan', dur: 400 },
					{ at: 2400, do: 'enter', el: 'hv-9' },
					{ at: 2500, do: 'enter', el: 'dyn' },
					{ at: 3300, do: 'pulse', el: 'dyn' },
					shot(dispatch.start(1), 'shot-poly', 2200),
					{ at: dispatch.start(1) + 1200, do: 'pulse', el: 'lb-var' },
					{ at: dispatch.start(1) + 2200, do: 'pulse', el: 'obj' },
					{ at: dispatch.start(1) + 3200, do: 'pulse', el: 'lb-a10' },
				),
			},
		},

		// ─── Scene 4. super calls the parent ────────────────────────────────
		{
			id: 'super',
			chapter: 'super',
			scene: 'journey',
			title: { es: 'super.arrancar()', en: 'super.start()' },
			subtitles: parent.list,
			motion: {
				cues: seq(
					shot(0, 'shot-classes', 2000),
					...clear(0, 'dyn', 'real', 'lb-ext'),
					{ at: 300, do: 'move', el: 'hl', to: 'ln-10', dur: 600 },
					{ at: 600, do: 'enter', el: 'a10-on' },
					{ at: 1000, do: 'enter', el: 'sup' },
					{ at: 1500, do: 'draw', el: 'fl-super', dur: 900 },
					{ at: 1600, do: 'move', el: 'p', to: 'a-v3', dur: 1300 },
					{ at: 1600, do: 'move', el: 'hl', to: 'ln-3', dur: 800 },
					{ at: parent.start(1), do: 'enter', el: 'v3-on' },
					{ at: parent.start(1) + 100, do: 'type', el: 'out-1', dur: 700 },
					{ at: parent.start(1) + 1700, do: 'exit', el: 'sup', dur: 400 },
					{ at: parent.start(1) + 1800, do: 'draw', el: 'fl-back', dur: 900 },
					{ at: parent.start(1) + 1900, do: 'move', el: 'p', to: 'a-a11', dur: 1300 },
					{ at: parent.start(1) + 1900, do: 'move', el: 'hl', to: 'ln-11', dur: 800 },
					{ at: parent.start(2), do: 'enter', el: 'a11-on' },
					{ at: parent.start(2) + 100, do: 'type', el: 'out-2', dur: 900 },
					// The call is over: the flow goes back to `main`.
					shot(parent.start(2) + 2200, 'shot-poly', 2000),
					{ at: parent.start(2) + 2300, do: 'move', el: 'p', to: 'a-end', dur: 1600 },
					{ at: parent.start(2) + 2300, do: 'move', el: 'hl', to: 'ln-19', dur: 800 },
					{ at: parent.start(2) + 3900, do: 'enter', el: 'end-on' },
				),
			},
		},

		// ─── Scene 5. Overloading is decided earlier ────────────────────────
		{
			id: 'overload',
			chapter: 'overload',
			scene: 'journey',
			title: { es: 'Sobrecarga: decide el compilador', en: 'Overloading: the compiler decides' },
			subtitles: overload.list,
			motion: {
				cues: seq(
					// Another program takes the stage: one class, three methods with one name.
					...clear(0, 'p', 'hl', 'floor-veh', 'floor-auto', 'v3-on', 'a10-on', 'a11-on', 'fl-super', 'fl-back', 'fl-ref', 'ref', 'obj', 'm-var'),
					...clear(0, 'lb-var', 'lb-v3', 'lb-a10', 'hv-9', 'out-1', 'out-2', 'new-on', 'call-on', 'end-on', 'fl-0', 'fl-1', 'heap', 'ea'),
					shot(0, 'shot-over', 2200),
					{ at: 600, do: 'enter', el: 'eb' },
					...typeLines(700, 'eb', 1, 20, 130),
					{ at: 900, do: 'enter', el: 'floor-con' },
					{ at: 1700, do: 'enter', el: 'sg-3' },
					{ at: 2100, do: 'enter', el: 'sg-7' },
					{ at: 2500, do: 'enter', el: 'sg-11' },
					// Compile time: the argument type selects the method, before anything runs.
					{ at: overload.start(1) + 200, do: 'enter', el: 'arg' },
					{ at: overload.start(1) + 1000, do: 'pulse', el: 'arg' },
					{ at: overload.start(1) + 1700, do: 'draw', el: 'rt-over', dur: 900 },
					{ at: overload.start(1) + 2500, do: 'enter', el: 'con-off' },
					{ at: overload.start(1) + 2600, do: 'enter', el: 'hv-b6' },
					{ at: overload.start(1) + 2900, do: 'enter', el: 'pick' },
					// Run time: nothing is left to decide.
					{ at: overload.start(2), do: 'move', el: 'p', to: 'a-new', dur: 1 },
					{ at: overload.start(2), do: 'move', el: 'hl', to: 'ln-17', dur: 1 },
					{ at: overload.start(2) + 200, do: 'enter', el: 'p' },
					{ at: overload.start(2) + 200, do: 'enter', el: 'hl' },
					{ at: overload.start(2) + 200, do: 'enter', el: 'new-on' },
					{ at: overload.start(2) + 900, do: 'enter', el: 'fl-1', dur: 400 },
					{ at: overload.start(2) + 1000, do: 'move', el: 'p', to: 'a-call', dur: 800 },
					{ at: overload.start(2) + 1000, do: 'move', el: 'hl', to: 'ln-18', dur: 500 },
					{ at: overload.start(2) + 1800, do: 'enter', el: 'call-on' },
					{ at: overload.start(2) + 2300, do: 'move', el: 'p', to: 'a-c7', dur: 1200 },
					{ at: overload.start(2) + 2300, do: 'move', el: 'hl', to: 'ln-7', dur: 800 },
					{ at: overload.start(2) + 3500, do: 'enter', el: 'c7-on' },
					{ at: overload.start(2) + 3600, do: 'type', el: 'out-b', dur: 600 },
				),
			},
		},

		// ─── Scene 6. Who decides what ──────────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'La variable y el objeto', en: 'The variable and the object' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'floor-con', 'c7-on', 'con-off', 'sg-3', 'sg-7', 'sg-11', 'arg', 'pick', 'hv-b6', 'eb', 'out-b', 'new-on', 'call-on', 'fl-1'),
					// The camera pulls back to reveal the whole system and the path the call took.
					shot(200, 'shot-all', 3000),
					{ at: 600, do: 'enter', el: 'ea' },
					{ at: 700, do: 'enter', el: 'floor-veh' },
					{ at: 800, do: 'enter', el: 'floor-auto' },
					{ at: 800, do: 'enter', el: 'heap' },
					{ at: 900, do: 'enter', el: 'obj' },
					{ at: 900, do: 'enter', el: 'm-var' },
					{ at: 1000, do: 'enter', el: 'ref' },
					{ at: 1000, do: 'enter', el: 'lb-var' },
					{ at: 1100, do: 'enter', el: 'lb-v3' },
					{ at: 1100, do: 'enter', el: 'lb-a10' },
					{ at: 1200, do: 'enter', el: 'hv-9' },
					{ at: 1300, do: 'enter', el: 'out-1' },
					{ at: 1400, do: 'enter', el: 'out-2' },
					{ at: 1600, do: 'enter', el: 'fl-0' },
					{ at: 1600, do: 'enter', el: 'fl-1' },
					{ at: 1700, do: 'enter', el: 'fl-ref' },
					{ at: 1800, do: 'enter', el: 'fl-super' },
					{ at: 1800, do: 'enter', el: 'fl-back' },
					{ at: 2400, do: 'flow', el: 'fl-ref' },
					{ at: 2400, do: 'flow', el: 'rt-dyn' },
					{ at: 2400, do: 'flow', el: 'fl-super' },
					{ at: 2400, do: 'flow', el: 'fl-back' },
					{ at: recap.start(1) + 200, do: 'enter', el: 'r-var' },
					{ at: recap.start(1) + 600, do: 'pulse', el: 'm-var' },
					{ at: recap.start(1) + 1900, do: 'enter', el: 'r-obj' },
					{ at: recap.start(1) + 2300, do: 'pulse', el: 'obj' },
					{ at: recap.start(2) + 800, do: 'pulse', el: 'obj' },
					{ at: recap.start(2) + 2400, do: 'pulse', el: 'lb-var' },
				),
			},
		},
	],
};
