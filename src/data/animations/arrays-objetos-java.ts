import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey through an array of objects: from null to instances": a short film
// (about two minutes) for the Java lesson "Arrays de Objetos: Guardar y Recorrer
// Muchas Instancias" (lesson 10). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/arrays-objetos-java.astro`):
// an isometric system where the class `Persona` is a blueprint plate, `main()` is a
// floor of modules on the Stack, and the Heap holds both the array `equipo` (a rack
// of three reference slots `[0]`, `[1]`, `[2]`) and the real `Persona` instances.
// A light blue particle is the execution flow, magenta marks the problem (the
// `NullPointerException` on a `null` slot, and two slots sharing one object), and
// violet marks the instances and the references that reach them.

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
const classStep = timed(
	say(
		'Un array de objetos no guarda objetos adentro: guarda referencias a objetos.',
		'An array of objects does not hold objects: it holds references to them.',
	),
	say(
		'La clase `Persona` es el molde: `nombre`, `edad`, un constructor y `getNombre()`.',
		'The `Person` class is the blueprint: `name`, `age`, a constructor, and `getName()`.',
	),
);

const slotsStep = timed(
	say(
		'La partícula celeste es el flujo de ejecución. En `main` ejecuta `new Persona[3]`.',
		'The light blue particle is the execution flow. In `main` it runs `new Person[3]`.',
	),
	say(
		'Reserva tres casillas que pueden apuntar a una `Persona`, pero no construye ninguna.',
		'That reserves three slots able to point to a `Person`, but it builds none of them.',
	),
	say(
		'Las tres casillas nacen en `null`: tres sobres sin ninguna carta.',
		'All three slots are born `null`: three envelopes, no letters.',
	),
);

const trapStep = timed(
	say(
		'¿Qué pasa si llamamos a `equipo[0].getNombre()` apenas creado el array?',
		'What happens if we call `team[0].getName()` right after creating the array?',
	),
	say(
		'El flujo lee la casilla `[0]`, encuentra `null` y no apunta a ningún objeto.',
		'The flow reads slot `[0]`, finds `null`, and it points to no object at all.',
	),
	say(
		'La llamada falla con `NullPointerException`: el error más común de Java.',
		'The call fails with `NullPointerException`: the most common Java error.',
	),
);

const firstStep = timed(
	say(
		'Corregimos la línea 4 con el segundo paso: `equipo[0] = new Persona("Laura", 28)`.',
		'We fix line 4 with the second step: `team[0] = new Person("Laura", 28)`.',
	),
	say(
		'El objeto real nace en el Heap y la casilla `[0]` guarda la referencia hacia él.',
		'The real object is born on the Heap and slot `[0]` stores the reference to it.',
	),
);

const secondStep = timed(
	say(
		'En la línea 5, `equipo[1]` recibe su propio `new Persona("Carlos", 35)`.',
		'On line 5, `team[1]` gets its own `new Person("Carlos", 35)`.',
	),
	say(
		'La casilla `[2]` queda sin asignar: sigue en `null`.',
		'Slot `[2]` stays unassigned: it is still `null`.',
	),
);

const traverseStep = timed(
	say(
		'`for (Persona p : equipo)` recorre el array; `if (p != null)` protege cada vuelta.',
		'`for (Person p : team)` walks the array; `if (p != null)` guards each pass.',
	),
	say(
		'En `[0]` y `[1]` la condición se cumple: seguimos la flecha e imprimimos el nombre.',
		'At `[0]` and `[1]` the check passes: we follow the arrow and print the name.',
	),
	say(
		'En `[2]`, `p != null` da falso: se salta la casilla y no hay `NullPointerException`.',
		'At `[2]`, `p != null` is false: the slot is skipped, no `NullPointerException`.',
	),
);

const aliasStep = timed(
	say(
		'Ahora `equipo[2] = equipo[0]` copia la flecha de la casilla `[0]`, no el objeto.',
		'Now `team[2] = team[0]` copies the arrow of slot `[0]`, not the object.',
	),
	say(
		'Ambas casillas apuntan al mismo objeto: `equipo[0] == equipo[2]` da `true`.',
		'Both slots point to the same object: `team[0] == team[2]` is `true`.',
	),
);

const recapStep = timed(
	say(
		'Crear un array de objetos lleva dos pasos: `new Persona[3]` y cada `new Persona(...)`.',
		'Creating an array of objects takes two steps: `new Person[3]` and each `new Person(...)`.',
	),
	say(
		'El primero crea casillas en `null`; el segundo construye los objetos en el Heap.',
		'The first creates `null` slots; the second builds the objects on the Heap.',
	),
	say(
		'Si el array puede tener huecos, verifica `p != null` antes de llamar a un método.',
		'If the array can have gaps, check `p != null` before calling a method on it.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'slots', label: { es: '1. new Persona[3]', en: '1. new Person[3]' } },
		{ id: 'trap', label: { es: '2. La trampa de null', en: '2. The null trap' } },
		{ id: 'populate', label: { es: '3. Llenar las casillas', en: '3. Filling the slots' } },
		{ id: 'traverse', label: { es: '4. Recorrer con p != null', en: '4. Traversing with p != null' } },
		{ id: 'alias', label: { es: '5. Copiar una casilla', en: '5. Copying a slot' } },
		{ id: 'recap', label: { es: '6. Los dos pasos', en: '6. The two steps' } },
	],
	steps: [
		// ─── Scene 1. The blueprint, and the array of null slots ────────────
		{
			id: 'class',
			chapter: 'slots',
			scene: 'journey',
			title: { es: 'El molde Persona', en: 'The Person blueprint' },
			subtitles: classStep.list,
			motion: {
				cues: seq(
					shot(0, 'shot-class', 3200),
					{ at: 200, do: 'enter', el: 'floor-cls' },
					...typeLines(300, 'ea', 1, 12, 220),
					{ at: 1400, do: 'enter', el: 'lb-fields' },
					{ at: 2000, do: 'pulse', el: 'lb-fields' },
					{ at: classStep.start(1) + 200, do: 'enter', el: 'lb-ctor' },
					{ at: classStep.start(1) + 700, do: 'enter', el: 'lb-get' },
					{ at: classStep.start(1) + 1200, do: 'pulse', el: 'lb-ctor' },
					{ at: classStep.start(1) + 1700, do: 'pulse', el: 'lb-get' },
					{ at: classStep.start(1) + 2400, do: 'enter', el: 'heap' },
					{ at: classStep.start(1) + 3000, do: 'enter', el: 'lb-no-obj' },
					{ at: classStep.start(1) + 3800, do: 'pulse', el: 'lb-no-obj' },
				),
			},
		},
		{
			id: 'slots',
			chapter: 'slots',
			scene: 'journey',
			title: { es: 'Tres casillas en null', en: 'Three null slots' },
			subtitles: slotsStep.list,
			motion: {
				cues: seq(
					shot(0, 'shot-slots', 2400),
					...clear(100, 'ea', 'lb-fields', 'lb-ctor', 'lb-get', 'lb-no-obj'),
					{ at: 200, do: 'enter', el: 'floor-main' },
					{ at: 300, do: 'enter', el: 'eb' },
					...typeLines(400, 'eb', 1, 3, 200),
					...typeLines(1000, 'eb', 14, 15, 200),
					{ at: 350, do: 'enter', el: 'm-entry' },
					{ at: 450, do: 'enter', el: 'm-arr' },
					{ at: 550, do: 'enter', el: 'm-p0' },
					{ at: 650, do: 'enter', el: 'm-p1' },
					{ at: 750, do: 'enter', el: 'm-loop' },
					{ at: 850, do: 'enter', el: 'm-alias' },
					{ at: 950, do: 'draw', el: 'tr-main', dur: 900 },
					{ at: 1300, do: 'enter', el: 'hl' },
					{ at: 1400, do: 'enter', el: 'p' },
					{ at: 1900, do: 'draw', el: 'fl-0', dur: 600 },
					{ at: 1900, do: 'move', el: 'hl', to: 'ln-3', dur: 500 },
					{ at: 2000, do: 'move', el: 'p', to: 'a-arr', dur: 900 },
					{ at: 2900, do: 'enter', el: 'arr-on' },
					{ at: 3000, do: 'pulse', el: 'm-arr' },
					{ at: slotsStep.start(1) + 200, do: 'draw', el: 'rt-arr', dur: 900 },
					{ at: slotsStep.start(1) + 300, do: 'move', el: 'p', to: 'a-rack', dur: 900 },
					{ at: slotsStep.start(1) + 1200, do: 'enter', el: 'floor-arr' },
					{ at: slotsStep.start(1) + 1400, do: 'enter', el: 's-0' },
					{ at: slotsStep.start(1) + 1600, do: 'enter', el: 's-1' },
					{ at: slotsStep.start(1) + 1800, do: 'enter', el: 's-2' },
					{ at: slotsStep.start(2) + 200, do: 'enter', el: 'null-0' },
					{ at: slotsStep.start(2) + 500, do: 'enter', el: 'null-1' },
					{ at: slotsStep.start(2) + 800, do: 'enter', el: 'null-2' },
					{ at: slotsStep.start(2) + 1400, do: 'enter', el: 'chip-len' },
					{ at: slotsStep.start(2) + 2200, do: 'pulse', el: 'chip-len' },
				),
			},
		},

		// ─── Scene 2. The NullPointerException trap ─────────────────────────
		{
			id: 'trap',
			chapter: 'trap',
			scene: 'journey',
			title: { es: 'Llamar un método sobre null', en: 'Calling a method on null' },
			subtitles: trapStep.list,
			motion: {
				cues: seq(
					shot(0, 'shot-trap', 2200),
					{ at: 200, do: 'type', el: 'eb-x4', dur: 900 },
					{ at: 300, do: 'move', el: 'hl', to: 'ln-4', dur: 600 },
					{ at: 400, do: 'draw', el: 'fl-1', dur: 600 },
					{ at: 500, do: 'move', el: 'p', to: 'a-p0', dur: 800 },
					{ at: 1300, do: 'enter', el: 'npe-on' },
					{ at: 1400, do: 'enter', el: 'hx-4' },
					{ at: trapStep.start(1) + 200, do: 'draw', el: 'rt-err', dur: 800 },
					{ at: trapStep.start(1) + 300, do: 'move', el: 'p', to: 'a-s0', dur: 900 },
					{ at: trapStep.start(1) + 1300, do: 'enter', el: 's0-err' },
					{ at: trapStep.start(1) + 1600, do: 'pulse', el: 'null-0' },
					{ at: trapStep.start(2) + 200, do: 'enter', el: 'chip-npe' },
					{ at: trapStep.start(2) + 600, do: 'type', el: 'out-npe', dur: 900 },
					{ at: trapStep.start(2) + 1200, do: 'pulse', el: 'chip-npe' },
					{ at: trapStep.start(2) + 2000, do: 'pulse', el: 's0-err' },
				),
			},
		},

		// ─── Scene 3. Filling the slots with new Persona(...) ───────────────
		{
			id: 'first',
			chapter: 'populate',
			scene: 'journey',
			title: { es: 'Paso 2: un objeto para la casilla [0]', en: 'Step 2: an object for slot [0]' },
			subtitles: firstStep.list,
			motion: {
				cues: seq(
					shot(0, 'shot-heap', 2200),
					...clear(200, 's0-err', 'chip-npe', 'rt-err', 'hx-4', 'npe-on', 'eb-x4', 'out-npe', 'chip-len'),
					{ at: 600, do: 'type', el: 'eb-4', dur: 900 },
					{ at: 600, do: 'move', el: 'p', to: 'a-p0', dur: 700 },
					{ at: 1400, do: 'enter', el: 'p0-on' },
					{ at: 1500, do: 'enter', el: 'hv-4' },
					{ at: firstStep.start(1) + 200, do: 'draw', el: 'rt-new0', dur: 900 },
					{ at: firstStep.start(1) + 300, do: 'move', el: 'p', to: 'a-o0', dur: 1000 },
					{ at: firstStep.start(1) + 1200, do: 'enter', el: 'obj-0', dur: 700 },
					{ at: firstStep.start(1) + 1500, do: 'exit', el: 'null-0', dur: 400 },
					{ at: firstStep.start(1) + 1700, do: 'enter', el: 's0-ok' },
					{ at: firstStep.start(1) + 1900, do: 'draw', el: 'ref-0', dur: 900 },
					{ at: firstStep.start(1) + 2900, do: 'pulse', el: 'obj-0' },
				),
			},
		},
		{
			id: 'second',
			chapter: 'populate',
			scene: 'journey',
			title: { es: 'Otra instancia y una casilla vacía', en: 'Another instance and an empty slot' },
			subtitles: secondStep.list,
			motion: {
				cues: seq(
					shot(0, 'shot-heap', 2000),
					...clear(200, 'rt-new0', 'p0-on'),
					{ at: 300, do: 'type', el: 'eb-5', dur: 900 },
					{ at: 300, do: 'move', el: 'hl', to: 'ln-5', dur: 600 },
					{ at: 300, do: 'draw', el: 'fl-2', dur: 600 },
					{ at: 400, do: 'move', el: 'p', to: 'a-p1', dur: 800 },
					{ at: 1200, do: 'enter', el: 'p1-on' },
					{ at: 1300, do: 'enter', el: 'hv-5' },
					{ at: 1600, do: 'draw', el: 'rt-new1', dur: 900 },
					{ at: 1700, do: 'move', el: 'p', to: 'a-o1', dur: 1000 },
					{ at: 2500, do: 'enter', el: 'obj-1', dur: 700 },
					{ at: 2800, do: 'exit', el: 'null-1', dur: 400 },
					{ at: 3000, do: 'enter', el: 's1-ok' },
					{ at: 3200, do: 'draw', el: 'ref-1', dur: 900 },
					{ at: secondStep.start(1) + 400, do: 'pulse', el: 'null-2' },
					{ at: secondStep.start(1) + 1000, do: 'enter', el: 'chip-gap' },
					{ at: secondStep.start(1) + 1800, do: 'pulse', el: 'chip-gap' },
				),
			},
		},

		// ─── Scene 4. Traversing with for-each and the != null guard ────────
		{
			id: 'traverse',
			chapter: 'traverse',
			scene: 'journey',
			title: { es: 'Recorrido seguro con if (p != null)', en: 'Safe traversal with if (p != null)' },
			subtitles: traverseStep.list,
			motion: {
				cues: seq(
					shot(0, 'shot-loop', 2200),
					...clear(100, 'hv-4', 'hv-5', 'chip-gap', 'rt-new1', 'p1-on'),
					...typeLines(300, 'eb', 6, 11, 220),
					{ at: 600, do: 'draw', el: 'fl-3', dur: 600 },
					{ at: 700, do: 'move', el: 'p', to: 'a-loop', dur: 800 },
					{ at: 700, do: 'move', el: 'hl', to: 'ln-7', dur: 500 },
					{ at: 1500, do: 'enter', el: 'loop-on' },
					{ at: 1700, do: 'draw', el: 'rt-loop', dur: 700 },
					{ at: 2000, do: 'enter', el: 'hc-8' },
					{ at: traverseStep.start(1) + 100, do: 'move', el: 'p', to: 'a-s0', dur: 700 },
					{ at: traverseStep.start(1) + 200, do: 'move', el: 'hl', to: 'ln-8', dur: 400 },
					{ at: traverseStep.start(1) + 800, do: 'move', el: 'p', to: 'a-o0', dur: 700 },
					{ at: traverseStep.start(1) + 900, do: 'move', el: 'hl', to: 'ln-9', dur: 400 },
					{ at: traverseStep.start(1) + 1500, do: 'type', el: 'out-1', dur: 650 },
					{ at: traverseStep.start(1) + 2200, do: 'move', el: 'p', to: 'a-s1', dur: 700 },
					{ at: traverseStep.start(1) + 2300, do: 'move', el: 'hl', to: 'ln-8', dur: 400 },
					{ at: traverseStep.start(1) + 2900, do: 'move', el: 'p', to: 'a-o1', dur: 700 },
					{ at: traverseStep.start(1) + 3000, do: 'move', el: 'hl', to: 'ln-9', dur: 400 },
					{ at: traverseStep.start(1) + 3600, do: 'type', el: 'out-2', dur: 650 },
					{ at: traverseStep.start(2) + 200, do: 'move', el: 'p', to: 'a-s2', dur: 700 },
					{ at: traverseStep.start(2) + 300, do: 'move', el: 'hl', to: 'ln-8', dur: 400 },
					{ at: traverseStep.start(2) + 1000, do: 'enter', el: 'chip-skip' },
					{ at: traverseStep.start(2) + 1800, do: 'pulse', el: 'chip-skip' },
				),
			},
		},

		// ─── Scene 5. Copying a slot copies the arrow ───────────────────────
		{
			id: 'alias',
			chapter: 'alias',
			scene: 'journey',
			title: { es: 'equipo[2] = equipo[0] copia la flecha', en: 'team[2] = team[0] copies the arrow' },
			subtitles: aliasStep.list,
			motion: {
				cues: seq(
					shot(0, 'shot-alias', 2200),
					...clear(100, 'chip-skip', 'hc-8', 'loop-on', 'rt-loop'),
					{ at: 300, do: 'type', el: 'eb-12', dur: 800 },
					{ at: 300, do: 'draw', el: 'fl-4', dur: 600 },
					{ at: 300, do: 'move', el: 'hl', to: 'ln-12', dur: 500 },
					{ at: 400, do: 'move', el: 'p', to: 'a-alias', dur: 800 },
					{ at: 1200, do: 'enter', el: 'alias-on' },
					{ at: 1500, do: 'move', el: 'p', to: 'a-s0', dur: 800 },
					{ at: 2300, do: 'flow', el: 'ref-0' },
					{ at: 2400, do: 'move', el: 'p', to: 'a-s2', dur: 800 },
					{ at: 3000, do: 'exit', el: 'null-2', dur: 400 },
					{ at: 3200, do: 'enter', el: 's2-alias' },
					{ at: 3300, do: 'draw', el: 'ref-2', dur: 900 },
					{ at: aliasStep.start(1) + 200, do: 'enter', el: 'chip-alias' },
					{ at: aliasStep.start(1) + 500, do: 'type', el: 'eb-13', dur: 800 },
					{ at: aliasStep.start(1) + 600, do: 'move', el: 'hl', to: 'ln-13', dur: 500 },
					{ at: aliasStep.start(1) + 1400, do: 'type', el: 'out-3', dur: 500 },
					{ at: aliasStep.start(1) + 2000, do: 'pulse', el: 'obj-0' },
					{ at: aliasStep.start(1) + 2600, do: 'pulse', el: 'chip-alias' },
				),
			},
		},

		// ─── Scene 6. Recap: two levels of memory, two steps ────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'Dos niveles de memoria, dos pasos', en: 'Two levels of memory, two steps' },
			subtitles: recapStep.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'alias-on'),
					shot(200, 'shot-all', 2800),
					{ at: 600, do: 'enter', el: 'r-step1' },
					{ at: 1000, do: 'pulse', el: 'floor-arr' },
					{ at: 1600, do: 'flow', el: 'rt-arr' },
					{ at: recapStep.start(1) + 200, do: 'enter', el: 'r-step2' },
					{ at: recapStep.start(1) + 600, do: 'flow', el: 'ref-1' },
					{ at: recapStep.start(1) + 600, do: 'flow', el: 'ref-2' },
					{ at: recapStep.start(1) + 1200, do: 'pulse', el: 'obj-0' },
					{ at: recapStep.start(1) + 1800, do: 'pulse', el: 'obj-1' },
					{ at: recapStep.start(2) + 200, do: 'enter', el: 'r-guard' },
					{ at: recapStep.start(2) + 1000, do: 'pulse', el: 'r-guard' },
					{ at: recapStep.start(2) + 1800, do: 'pulse', el: 'chip-alias' },
				),
			},
		},
	],
};
