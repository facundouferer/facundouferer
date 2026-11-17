import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of new: from the class blueprint to the Heap object": a short film
// (about two minutes) for the Java lesson "Fundamentos de POO: Clases, Objetos y
// Atributos" (order: 8). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/clases-objetos-java.astro`):
// an isometric system with the class blueprint platform below, `main()` on the Stack
// above, and the Heap platform to the right where `new` creates violet instances.
// Magenta highlights the reference aliasing trap (`p2 = p1`), where copying a
// reference mutates the single shared object on the Heap.

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
const blueprint = timed(
	say(
		'Una clase es un molde: `Persona` declara los atributos `nombre` y `edad` y el método `saludar()`.',
		'A class is a blueprint: `Person` declares the attributes `name` and `age` and the method `greet()`.',
	),
	say(
		'El molde define la estructura, pero por sí solo todavía no ocupa memoria de objetos en el Heap.',
		'The blueprint defines the structure, but by itself it occupies no object memory in the Heap yet.',
	),
);
const alloc = timed(
	say(
		'La partícula celeste es el flujo de ejecución. En `main`, el operador `new` pide memoria en el Heap.',
		'The light blue particle is the execution flow. In `main`, the `new` operator requests memory in the Heap.',
	),
	say(
		'Nace una instancia de `Persona` con valores por defecto: `nombre` en `null` y `edad` en `0`.',
		'An instance of `Person` is born with default values: `name` set to `null` and `age` set to `0`.',
	),
);
const assign = timed(
	say(
		'`new` devuelve la dirección del objeto en el Heap y la guarda en la variable `p1` del Stack.',
		'`new` returns the address of the Heap object and stores it in the `p1` variable on the Stack.',
	),
	say(
		'`p1` no contiene el objeto adentro: guarda una referencia que apunta a la instancia.',
		'`p1` does not hold the object inside: it stores a reference pointing to the instance.',
	),
);
const setup = timed(
	say(
		'Con el operador punto (`.`), `p1.nombre` y `p1.edad` siguen la referencia hasta el Heap.',
		'With the dot operator (`.`), `p1.name` and `p1.age` follow the reference into the Heap.',
	),
	say(
		'Los valores por defecto cambian a `"Laura"` y `28` dentro de ese objeto concreto.',
		'The default values change to `"Laura"` and `28` inside that specific object.',
	),
);
const second = timed(
	say(
		'Otra llamada a `new Persona()` reserva un segundo objeto independiente en el Heap.',
		'Another call to `new Person()` allocates a second independent object in the Heap.',
	),
	say(
		'Cada instancia guarda su propio estado: `p2` recibe `"Carlos"` sin alterar a `p1`.',
		'Each instance holds its own state: `p2` receives `"Carlos"` without altering `p1`.',
	),
);
const call = timed(
	say(
		'Al invocar `p1.saludar()`, el método lee los atributos de ese objeto e imprime `"Laura"`.',
		'When invoking `p1.greet()`, the method reads the attributes of that object and prints `"Laura"`.',
	),
	say(
		'Luego `p2.saludar()` ejecuta el mismo código del molde, pero leyendo el estado de `p2`.',
		'Then `p2.greet()` runs the same blueprint code, but reading the state of `p2`.',
	),
);
const alias = timed(
	say(
		'Cuidado con `Persona p2 = p1`: sin `new`, la asignación solo copia la referencia en el Stack.',
		'Watch out for `Person p2 = p1`: without `new`, the assignment only copies the reference on the Stack.',
	),
	say(
		'Ambas variables apuntan al mismo objeto en el Heap: no se creó ningún clon.',
		'Both variables point to the same object in the Heap: no clone was created.',
	),
	say(
		'Modificar `p2.nombre` altera ese único objeto compartido, y `p1.nombre` ahora vale `"Ana María"`.',
		'Modifying `p2.name` mutates that single shared object, and `p1.name` is now `"Ana Maria"`.',
	),
);
const recap = timed(
	say(
		'La clase es el molde; cada objeto creado con `new` es una instancia independiente en el Heap.',
		'The class is the blueprint; each object created with `new` is an independent instance in the Heap.',
	),
	say(
		'Las variables en el Stack guardan referencias y el operador punto accede al objeto apuntado.',
		'Variables on the Stack store references and the dot operator accesses the targeted object.',
	),
	say(
		'Solo `new` reserva otro objeto; asignar `p2 = p1` comparte la misma instancia.',
		'Only `new` allocates another object; assigning `p2 = p1` shares the same instance.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'blueprint', label: { es: 'La clase como molde', en: 'The class as a blueprint' } },
		{ id: 'new', label: { es: 'new y la memoria', en: 'new and memory' } },
		{ id: 'state', label: { es: 'Dos objetos independientes', en: 'Two independent objects' } },
		{ id: 'behavior', label: { es: 'Métodos de instancia', en: 'Instance methods' } },
		{ id: 'alias', label: { es: 'Alias de referencias', en: 'Reference aliasing' } },
		{ id: 'recap', label: { es: 'Clase, referencia y objeto', en: 'Class, reference and object' } },
	],
	steps: [
		// ─── Scene 1. The class as a blueprint ──────────────────────────────
		{
			id: 'blueprint',
			chapter: 'blueprint',
			scene: 'journey',
			title: { es: 'El molde Persona', en: 'The Person blueprint' },
			subtitles: blueprint.list,
			motion: {
				cues: seq(
					shot(0, 'shot-class', 4500),
					{ at: 200, do: 'enter', el: 'floor-cls' },
					...typeLines(300, 'ea', 1, 9, 240),
					{ at: 1200, do: 'enter', el: 'lb-fields' },
					{ at: 2000, do: 'pulse', el: 'lb-fields' },
					{ at: 2600, do: 'enter', el: 'lb-m7' },
					{ at: 3200, do: 'pulse', el: 'lb-m7' },
					{ at: blueprint.start(1) + 200, do: 'enter', el: 'heap' },
					{ at: blueprint.start(1) + 800, do: 'enter', el: 'lb-no-mem' },
					{ at: blueprint.start(1) + 1600, do: 'pulse', el: 'lb-no-mem' },
					...typeLines(blueprint.start(1) + 2000, 'ea', 10, 20, 180),
				),
			},
		},

		// ─── Scene 2. new and memory ────────────────────────────────────────
		{
			id: 'alloc',
			chapter: 'new',
			scene: 'journey',
			title: { es: 'new reserva en el Heap', en: 'new allocates in the Heap' },
			subtitles: alloc.list,
			motion: {
				cues: seq(
					shot(0, 'shot-alloc', 2200),
					...clear(100, 'lb-no-mem'),
					{ at: 200, do: 'enter', el: 'floor-main' },
					{ at: 350, do: 'enter', el: 'm-entry' },
					{ at: 450, do: 'enter', el: 'm-new1' },
					{ at: 550, do: 'enter', el: 'm-set1' },
					{ at: 650, do: 'enter', el: 'm-new2' },
					{ at: 750, do: 'enter', el: 'm-set2' },
					{ at: 850, do: 'enter', el: 'm-call1' },
					{ at: 950, do: 'enter', el: 'm-call2' },
					{ at: 1050, do: 'enter', el: 'm-end' },
					{ at: 1100, do: 'draw', el: 'tr-main', dur: 900 },
					{ at: 1500, do: 'enter', el: 'hl' },
					{ at: 1600, do: 'enter', el: 'p' },
					{ at: 2200, do: 'draw', el: 'fl-0', dur: 600 },
					{ at: 2300, do: 'move', el: 'p', to: 'a-new1', dur: 900 },
					{ at: 3200, do: 'enter', el: 'new1-on' },
					{ at: 3200, do: 'pulse', el: 'm-new1' },
					{ at: alloc.start(1) + 200, do: 'draw', el: 'fl-alloc1', dur: 900 },
					{ at: alloc.start(1) + 300, do: 'move', el: 'p', to: 'a-obj1', dur: 1000 },
					{ at: alloc.start(1) + 1200, do: 'enter', el: 'obj1', dur: 700 },
					{ at: alloc.start(1) + 1500, do: 'enter', el: 'st1-def' },
					{ at: alloc.start(1) + 2200, do: 'pulse', el: 'obj1' },
					{ at: alloc.start(1) + 2800, do: 'pulse', el: 'st1-def' },
				),
			},
		},
		{
			id: 'assign',
			chapter: 'new',
			scene: 'journey',
			title: { es: 'La referencia en el Stack', en: 'The reference on the Stack' },
			subtitles: assign.list,
			motion: {
				cues: seq(
					shot(0, 'shot-stack', 2000),
					{ at: 300, do: 'enter', el: 'm-var1' },
					{ at: 700, do: 'enter', el: 'lb-var1' },
					{ at: 1100, do: 'move', el: 'p', to: 'a-var1', dur: 900 },
					{ at: 1900, do: 'draw', el: 'ref-1', dur: 1000 },
					{ at: 2800, do: 'pulse', el: 'm-var1' },
					{ at: 3400, do: 'pulse', el: 'lb-var1' },
					{ at: assign.start(1) + 300, do: 'draw', el: 'fl-ref1', dur: 900 },
					{ at: assign.start(1) + 1200, do: 'flow', el: 'fl-ref1' },
					{ at: assign.start(1) + 1600, do: 'enter', el: 'hc-12' },
					{ at: assign.start(1) + 2200, do: 'pulse', el: 'obj1' },
					{ at: assign.start(1) + 3000, do: 'pulse', el: 'lb-var1' },
				),
			},
		},

		// ─── Scene 3. Two independent objects ───────────────────────────────
		{
			id: 'setup',
			chapter: 'state',
			scene: 'journey',
			title: { es: 'Operador punto: estado de p1', en: 'Dot operator: state of p1' },
			subtitles: setup.list,
			motion: {
				cues: seq(
					shot(0, 'shot-alloc', 2000),
					...clear(100, 'hc-12', 'fl-alloc1'),
					{ at: 300, do: 'draw', el: 'fl-1', dur: 600 },
					{ at: 400, do: 'move', el: 'p', to: 'a-set1', dur: 800 },
					{ at: 400, do: 'move', el: 'hl', to: 'ln-13', dur: 600 },
					{ at: 1200, do: 'enter', el: 'set1-on' },
					{ at: 1300, do: 'pulse', el: 'm-set1' },
					{ at: 2000, do: 'move', el: 'hl', to: 'ln-14', dur: 600 },
					{ at: setup.start(1) + 200, do: 'exit', el: 'st1-def', dur: 350 },
					{ at: setup.start(1) + 600, do: 'enter', el: 'st1-val' },
					{ at: setup.start(1) + 1200, do: 'pulse', el: 'obj1' },
					{ at: setup.start(1) + 2000, do: 'pulse', el: 'st1-val' },
				),
			},
		},
		{
			id: 'second',
			chapter: 'state',
			scene: 'journey',
			title: { es: 'Segunda instancia con new', en: 'Second instance with new' },
			subtitles: second.list,
			motion: {
				cues: seq(
					shot(0, 'shot-two', 2200),
					{ at: 300, do: 'draw', el: 'fl-2', dur: 600 },
					{ at: 400, do: 'move', el: 'p', to: 'a-new2', dur: 800 },
					{ at: 400, do: 'move', el: 'hl', to: 'ln-15', dur: 600 },
					{ at: 1200, do: 'enter', el: 'new2-on' },
					{ at: 1300, do: 'draw', el: 'fl-alloc2', dur: 800 },
					{ at: 1400, do: 'move', el: 'p', to: 'a-obj2', dur: 900 },
					{ at: 2200, do: 'enter', el: 'obj2', dur: 700 },
					{ at: 2500, do: 'enter', el: 'm-var2' },
					{ at: 2700, do: 'enter', el: 'lb-var2' },
					{ at: 2900, do: 'move', el: 'p', to: 'a-var2', dur: 800 },
					{ at: 3600, do: 'draw', el: 'ref-2', dur: 900 },
					{ at: second.start(1) + 200, do: 'draw', el: 'fl-3', dur: 600 },
					{ at: second.start(1) + 300, do: 'move', el: 'p', to: 'a-set2', dur: 800 },
					{ at: second.start(1) + 300, do: 'move', el: 'hl', to: 'ln-16', dur: 600 },
					{ at: second.start(1) + 1100, do: 'enter', el: 'set2-on' },
					{ at: second.start(1) + 1400, do: 'enter', el: 'st2-val' },
					{ at: second.start(1) + 2100, do: 'pulse', el: 'obj2' },
					{ at: second.start(1) + 2800, do: 'pulse', el: 'st1-val' },
				),
			},
		},

		// ─── Scene 4. Instance methods ──────────────────────────────────────
		{
			id: 'call',
			chapter: 'behavior',
			scene: 'journey',
			title: { es: 'Cada objeto saluda con su estado', en: 'Each object greets with its state' },
			subtitles: call.list,
			motion: {
				cues: seq(
					shot(0, 'shot-call', 2200),
					...clear(100, 'fl-alloc2'),
					{ at: 300, do: 'draw', el: 'fl-4', dur: 600 },
					{ at: 400, do: 'move', el: 'p', to: 'a-call1', dur: 800 },
					{ at: 400, do: 'move', el: 'hl', to: 'ln-17', dur: 600 },
					{ at: 1200, do: 'enter', el: 'call1-on' },
					{ at: 1400, do: 'draw', el: 'rt-call1', dur: 900 },
					{ at: 1500, do: 'move', el: 'p', to: 'a-m7', dur: 1100 },
					{ at: 1500, do: 'move', el: 'hl', to: 'ln-7', dur: 700 },
					{ at: 2600, do: 'enter', el: 'm7-on' },
					{ at: 2600, do: 'enter', el: 'hv-7' },
					{ at: 2800, do: 'pulse', el: 'st1-val' },
					{ at: 3100, do: 'type', el: 'out-1', dur: 800 },
					{ at: call.start(1) + 200, do: 'draw', el: 'fl-5', dur: 600 },
					{ at: call.start(1) + 300, do: 'move', el: 'p', to: 'a-call2', dur: 900 },
					{ at: call.start(1) + 300, do: 'move', el: 'hl', to: 'ln-18', dur: 600 },
					{ at: call.start(1) + 1200, do: 'enter', el: 'call2-on' },
					{ at: call.start(1) + 1400, do: 'draw', el: 'rt-call2', dur: 900 },
					{ at: call.start(1) + 1500, do: 'move', el: 'p', to: 'a-m7', dur: 1100 },
					{ at: call.start(1) + 1500, do: 'move', el: 'hl', to: 'ln-7', dur: 700 },
					{ at: call.start(1) + 2600, do: 'pulse', el: 'st2-val' },
					{ at: call.start(1) + 2900, do: 'type', el: 'out-2', dur: 800 },
				),
			},
		},

		// ─── Scene 5. Reference aliasing ────────────────────────────────────
		{
			id: 'alias',
			chapter: 'alias',
			scene: 'journey',
			title: { es: 'p2 = p1: dos referencias, un objeto', en: 'p2 = p1: two references, one object' },
			subtitles: alias.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'obj2', 'st2-val', 'ref-2', 'fl-ref1', 'rt-call1', 'rt-call2', 'm7-on', 'hv-7'),
					...clear(0, 'out-1', 'out-2', 'new2-on', 'set2-on', 'call1-on', 'call2-on', 'fl-2', 'fl-3', 'fl-4', 'fl-5', 'ea'),
					shot(0, 'shot-alias', 2200),
					{ at: 500, do: 'enter', el: 'eb' },
					...typeLines(600, 'eb', 1, 20, 120),
					{ at: 900, do: 'exit', el: 'st1-val', dur: 300 },
					{ at: 1300, do: 'enter', el: 'st1-ana' },
					{ at: 1800, do: 'move', el: 'p', to: 'a-alias', dur: 1 },
					{ at: 1800, do: 'move', el: 'hl', to: 'ln-15', dur: 1 },
					{ at: 2000, do: 'enter', el: 'p' },
					{ at: 2000, do: 'enter', el: 'hl' },
					{ at: 2200, do: 'enter', el: 'hx-15' },
					{ at: 2400, do: 'enter', el: 'alias-on' },
					{ at: alias.start(1) + 200, do: 'draw', el: 'ref-alias', dur: 1000 },
					{ at: alias.start(1) + 1200, do: 'flow', el: 'ref-alias' },
					{ at: alias.start(1) + 1500, do: 'enter', el: 'lb-alias' },
					{ at: alias.start(1) + 2300, do: 'pulse', el: 'lb-alias' },
					{ at: alias.start(2) + 200, do: 'move', el: 'p', to: 'a-mut', dur: 800 },
					{ at: alias.start(2) + 200, do: 'move', el: 'hl', to: 'ln-16', dur: 600 },
					{ at: alias.start(2) + 1000, do: 'enter', el: 'mut-on' },
					{ at: alias.start(2) + 1200, do: 'move', el: 'p', to: 'a-obj1', dur: 900 },
					{ at: alias.start(2) + 2000, do: 'exit', el: 'st1-ana', dur: 300 },
					{ at: alias.start(2) + 2350, do: 'enter', el: 'st1-shared' },
					{ at: alias.start(2) + 2700, do: 'pulse', el: 'obj1' },
					{ at: alias.start(2) + 3100, do: 'move', el: 'p', to: 'a-end', dur: 900 },
					{ at: alias.start(2) + 3100, do: 'move', el: 'hl', to: 'ln-17', dur: 600 },
					{ at: alias.start(2) + 3800, do: 'enter', el: 'end-on' },
					{ at: alias.start(2) + 4000, do: 'type', el: 'out-b', dur: 700 },
				),
			},
		},

		// ─── Scene 6. Class, reference and object ───────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'Molde, referencias e instancias', en: 'Blueprint, references and instances' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'eb', 'out-b', 'hx-15', 'alias-on', 'mut-on', 'end-on', 'ref-alias', 'lb-alias', 'st1-shared'),
					shot(200, 'shot-all', 3000),
					{ at: 600, do: 'enter', el: 'ea' },
					{ at: 800, do: 'enter', el: 'st1-val' },
					{ at: 900, do: 'enter', el: 'obj2' },
					{ at: 1000, do: 'enter', el: 'st2-val' },
					{ at: 1100, do: 'enter', el: 'ref-2' },
					{ at: 1200, do: 'enter', el: 'fl-ref1' },
					{ at: 1300, do: 'enter', el: 'rt-call1' },
					{ at: 1400, do: 'enter', el: 'rt-call2' },
					{ at: 1500, do: 'enter', el: 'out-1' },
					{ at: 1600, do: 'enter', el: 'out-2' },
					{ at: 2200, do: 'flow', el: 'fl-ref1' },
					{ at: 2200, do: 'flow', el: 'rt-call1' },
					{ at: 2200, do: 'flow', el: 'rt-call2' },
					{ at: recap.start(0) + 2600, do: 'enter', el: 'r-cls' },
					{ at: recap.start(0) + 3200, do: 'pulse', el: 'r-cls' },
					{ at: recap.start(1) + 400, do: 'enter', el: 'r-stack' },
					{ at: recap.start(1) + 1200, do: 'pulse', el: 'm-var1' },
					{ at: recap.start(1) + 2000, do: 'pulse', el: 'm-var2' },
					{ at: recap.start(2) + 400, do: 'enter', el: 'r-heap' },
					{ at: recap.start(2) + 1200, do: 'pulse', el: 'obj1' },
					{ at: recap.start(2) + 2200, do: 'pulse', el: 'obj2' },
				),
			},
		},
	],
};
