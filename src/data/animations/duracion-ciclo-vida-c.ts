import type { AnimationScript, MotionCue, Subtitle } from './types';

// "What is born and dies on the stack": a short film (about two minutes) for the C
// lesson "Duración de almacenamiento y ciclo de vida". It plays on a single persistent
// canvas (`data-scene="journey"` in `src/components/animaciones/duracion-ciclo-vida-c.astro`):
// on the left, an editor with the program being run; on the right, an isometric model
// of memory with the stack (one floor per call frame) and the static storage shelf.
// Every object is a cell with its address on the front edge and its value on top; a
// pointer is an arrow. The first program (`contar`, from the lesson's exercise 3)
// shows automatic and static storage duration; the second (`calcular_doble`, from the
// "Punteros colgantes" section) shows a dangling pointer and then its fix by value.

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
const seq = (...cues: (MotionCue | MotionCue[])[]): MotionCue[] =>
	cues
		.flat()
		.map((cue, index) => ({ cue, index }))
		.sort((a, b) => a.cue.at - b.cue.at || a.index - b.index)
		.map((entry) => entry.cue);

/** Camera cue that frames one of the `shot-*` anchors exactly (they carry their own zoom). */
const shot = (at: number, to: string, dur: number): MotionCue => ({ at, do: 'camera', to: [to], dur, pad: 0 });

/** Slides the editor bar to a line. */
const line = (at: number, n: number, dur = 500): MotionCue => ({ at, do: 'move', el: 'hl', to: `ln-${n}`, dur });

/** The execution flow travels to a place in memory. */
const flow = (at: number, to: string, dur = 900): MotionCue => ({ at, do: 'move', el: 'fx', to, dur });

const enter = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'enter', el }));
const exit = (at: number, dur: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit', el, dur }));

/** Types the lines of an editor one after the other. */
const typeLines = (at: number, prefix: string, count: number, gap: number): MotionCue[] =>
	Array.from({ length: count }, (_, index) => ({ at: at + index * gap, do: 'type', el: `${prefix}-${index + 1}`, dur: gap - 20 }));

/** One call to `contar()` (lines 3 to 9), from the line in `main` that makes it. */
function countCall(at: number, from: number, before: number, output: string): MotionCue[] {
	return [
		line(at, from),
		...enter(at + 400, 'fr-call', 'lb-contar'),
		flow(at + 500, 'a-call'),
		line(at + 900, 5),
		...enter(at + 1100, 'c-local', 'v-local-0'),
		flow(at + 1600, 'a-static', 700),
		line(at + 1600, 6),
		...exit(at + 2300, 400, `v-veces-${before}`),
		...enter(at + 2300, `v-veces-${before + 1}`),
		{ at: at + 2300, do: 'pulse', el: 'c-veces' },
		flow(at + 2700, 'a-call', 700),
		line(at + 2700, 7),
		...exit(at + 3100, 300, 'v-local-0'),
		...enter(at + 3100, 'v-local-1'),
		line(at + 3500, 9),
		...exit(at + 3800, 600, 'c-local', 'v-local-1', 'fr-call', 'lb-contar'),
		flow(at + 3900, 'a-main', 800),
		line(at + 4100, from),
		{ at: at + 4500, do: 'type', el: output, dur: 300 },
	];
}

// ─── Captions ───────────────────────────────────────────────────────────────
const map = timed(
	say('En la pila aparecen los marcos de las funciones; aparte está la zona estática.', 'Function frames appear on the stack; apart from it is the static storage area.'),
	say('`veces` es `static`: tiene duración estática y ya está aquí antes de `main`.', '`times` is `static`: it has static storage duration and is here before `main`.'),
);
const call = timed(
	say('`main` llama a `contar()`: un marco nuevo aparece en la pila, sobre el de `main`.', '`main` calls `count()`: a new frame appears on the stack, above the one of `main`.'),
	say('`local` tiene duración automática: nace en su declaración, con valor 0.', '`local` has automatic storage duration: it is born at its declaration, with value 0.'),
	say('`contar` devuelve 11. En la llave de cierre, `local` muere y el marco desaparece.', '`count` returns 11. At the closing brace, `local` dies and the frame disappears.'),
);
const again = timed(
	say('Cada llamada crea un marco y un `local` nuevos, que empiezan otra vez en 0.', 'Each call creates a new frame and a new `local`, starting again at 0.'),
	say('`veces` conserva su valor entre llamadas: se imprime 11, 21 y 31.', '`times` keeps its value between calls: it prints 11, 21 and 31.'),
	say('Al terminar `main` se va su marco. `veces` vive todo el programa: muere cuando este termina.', 'When `main` ends its frame goes away. `times` lives for the whole program: it dies when it ends.'),
);
const address = timed(
	say('Otro programa: `calcular_doble(21)` guarda 42 en `resultado`, una variable local.', 'Another program: `compute_double(21)` stores 42 in `result`, a local variable.'),
	say('Devuelve `&resultado`: `p` guarda 0x1004, una dirección ficticia (las reales varían).', 'It returns `&result`: `p` stores 0x1004, a made-up address (real ones vary).'),
);
const vanish = timed(
	say('En la llave de cierre, `resultado` muere y el marco se desapila. `p` sigue valiendo 0x1004.', 'At the closing brace, `result` dies and the frame is popped. `p` still holds 0x1004.'),
	say('`p` es un puntero colgante: apunta a un objeto cuyo tiempo de vida ya terminó.', '`p` is a dangling pointer: it points to an object whose lifetime has ended.'),
);
const read = timed(
	say('Leer `*p` imprime 42: nadie reutilizó esa memoria todavía, así que parece funcionar.', 'Reading `*p` prints 42: nobody has reused that memory yet, so it seems to work.'),
	say('Pero otra llamada puede reutilizar ese espacio: leer `*p` es comportamiento indefinido.', 'But another call may reuse that space: reading `*p` is undefined behavior.'),
);
const fix = timed(
	say('La corrección: devolver por valor. `calcular_doble` devuelve un `int`, no una dirección.', 'The fix: return by value. `compute_double` returns an `int`, not an address.'),
	say('El 42 se copia en `valor`, en el marco de `main`: que `resultado` muera ya no importa.', 'The 42 is copied into `value`, in the frame of `main`: `result` dying no longer matters.'),
);
const whole = timed(
	say('Lo automático vive hasta la llave de cierre; lo estático, como las globales, todo el programa.', 'Automatic objects live until the closing brace; static ones, like globals, the whole program.'),
	say('Un puntero es válido solo mientras el objeto al que apunta está vivo.', 'A pointer is valid only while the object it points to is alive.'),
	say('El montículo (heap) queda para la próxima lección.', 'The heap is the topic of the next lesson.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'regions', label: { es: 'La pila y la zona estática', en: 'The stack and static storage' } },
		{ id: 'automatic', label: { es: 'Nacer y morir en un bloque', en: 'Born and gone within a block' } },
		{ id: 'static', label: { es: 'Lo estático permanece', en: 'What is static stays' } },
		{ id: 'dangling', label: { es: 'Un puntero colgante', en: 'A dangling pointer' } },
		{ id: 'undefined', label: { es: 'Parece funcionar', en: 'It seems to work' } },
		{ id: 'fix', label: { es: 'Devolver por valor', en: 'Return by value' } },
	],
	steps: [
		// ─── Scene 1. The stack and static storage ──────────────────────────
		{
			id: 'map',
			chapter: 'regions',
			scene: 'journey',
			title: { es: 'La memoria del programa', en: "The program's memory" },
			subtitles: map.list,
			motion: {
				cues: seq(
					shot(0, 'shot-map', 3000),
					enter(100, 'fa'),
					enter(300, 'zone-stack'),
					enter(900, 'shelf'),
					{ at: 1500, do: 'pulse', el: 'zone-stack' },
					{ at: 2400, do: 'pulse', el: 'shelf' },
					typeLines(300, 'ea', 16, 180),
					shot(map.start(1), 'shot-static', 2200),
					line(map.start(1) + 100, 4, 1),
					enter(map.start(1) + 200, 'hl'),
					enter(map.start(1) + 400, 'c-veces'),
					enter(map.start(1) + 900, 'v-veces-0'),
					{ at: map.start(1) + 1500, do: 'pulse', el: 'c-veces' },
				),
			},
		},

		// ─── Scene 2. Born and gone within a block ──────────────────────────
		{
			id: 'call',
			chapter: 'automatic',
			scene: 'journey',
			title: { es: 'Una llamada, un marco', en: 'One call, one frame' },
			subtitles: call.list,
			motion: {
				cues: seq(
					shot(0, 'shot-call', 2400),
					line(0, 11),
					flow(0, 'a-main', 1),
					enter(300, 'fr-main', 'lb-main-a'),
					enter(500, 'fx'),
					line(1300, 12),
					{ at: 1300, do: 'pulse', el: 'fr-main' },
					enter(2000, 'fr-call', 'lb-contar'),
					flow(2100, 'a-call'),
					line(2100, 3),
					line(call.start(1), 5),
					enter(call.start(1) + 300, 'c-local'),
					enter(call.start(1) + 700, 'v-local-0'),
					enter(call.start(1) + 900, 'lb-born'),
					line(call.start(1) + 1800, 6),
					flow(call.start(1) + 1800, 'a-static', 700),
					exit(call.start(1) + 2500, 400, 'v-veces-0'),
					enter(call.start(1) + 2500, 'v-veces-1'),
					{ at: call.start(1) + 2500, do: 'pulse', el: 'c-veces' },
					flow(call.start(1) + 3000, 'a-call', 700),
					line(call.start(1) + 3000, 7),
					exit(call.start(1) + 3500, 300, 'v-local-0'),
					enter(call.start(1) + 3500, 'v-local-1'),
					{ at: call.start(1) + 3500, do: 'pulse', el: 'c-local' },
					line(call.start(2), 8),
					exit(call.start(2), 300, 'lb-born'),
					{ at: call.start(2) + 300, do: 'pulse', el: 'c-local' },
					line(call.start(2) + 1000, 9),
					enter(call.start(2) + 1200, 'lb-dies'),
					exit(call.start(2) + 2200, 700, 'c-local', 'v-local-1', 'fr-call', 'lb-contar'),
					flow(call.start(2) + 2400, 'a-main', 800),
					line(call.start(2) + 2400, 12),
					exit(call.start(2) + 3000, 400, 'lb-dies'),
					{ at: call.start(2) + 3100, do: 'type', el: 'oa-1', dur: 300 },
				),
			},
		},

		// ─── Scene 3. What is static stays ──────────────────────────────────
		{
			id: 'again',
			chapter: 'static',
			scene: 'journey',
			title: { es: 'Dos llamadas más', en: 'Two more calls' },
			subtitles: again.list,
			motion: {
				cues: seq(
					countCall(0, 13, 1, 'oa-2'),
					countCall(again.start(1), 14, 2, 'oa-3'),
					line(again.start(2), 15),
					line(again.start(2) + 600, 16),
					shot(again.start(2) + 200, 'shot-static', 2200),
					exit(again.start(2) + 900, 700, 'fr-main', 'lb-main-a', 'fx'),
					enter(again.start(2) + 1700, 'lb-program'),
					{ at: again.start(2) + 2200, do: 'pulse', el: 'c-veces' },
					exit(again.start(2) + 4200, 700, 'c-veces', 'v-veces-3', 'lb-program'),
				),
			},
		},

		// ─── Scene 4. A dangling pointer ────────────────────────────────────
		{
			id: 'address',
			chapter: 'dangling',
			scene: 'journey',
			title: { es: 'Devolver la dirección de una local', en: 'Returning the address of a local' },
			subtitles: address.list,
			motion: {
				cues: seq(
					exit(0, 400, 'ea', 'fa', 'oa-1', 'oa-2', 'oa-3', 'hl'),
					enter(300, 'fb'),
					shot(200, 'shot-dangle', 2400),
					typeLines(400, 'eb', 12, 160),
					line(2400, 8, 1),
					flow(2400, 'a-main', 1),
					enter(2500, 'hl'),
					enter(2600, 'fr-main', 'lb-main-b', 'fx'),
					line(3200, 9),
					enter(3400, 'c-p'),
					enter(3800, 'fr-call', 'lb-calc'),
					flow(3800, 'a-call'),
					line(3800, 3),
					enter(4200, 'c-n', 'v-n'),
					line(address.start(1), 4),
					enter(address.start(1) + 300, 'c-res'),
					enter(address.start(1) + 600, 'v-res'),
					line(address.start(1) + 1300, 5),
					enter(address.start(1) + 1500, 'hx-5'),
					{ at: address.start(1) + 1900, do: 'draw', el: 'arrow', dur: 1000 },
					enter(address.start(1) + 2900, 'v-p'),
					{ at: address.start(1) + 3100, do: 'pulse', el: 'c-p' },
					{ at: address.start(1) + 3700, do: 'pulse', el: 'c-res' },
				),
			},
		},
		{
			id: 'vanish',
			chapter: 'dangling',
			scene: 'journey',
			title: { es: 'El marco se desapila', en: 'The frame is popped' },
			subtitles: vanish.list,
			motion: {
				cues: seq(
					line(0, 6),
					{ at: 500, do: 'pulse', el: 'fr-call' },
					exit(1100, 600, 'c-res', 'v-res', 'c-n', 'v-n'),
					exit(1500, 700, 'fr-call', 'lb-calc'),
					flow(1600, 'a-main', 800),
					line(1800, 9),
					enter(1900, 'ghost', 'v-ghost'),
					exit(2300, 400, 'arrow'),
					enter(2300, 'arrow-x'),
					{ at: 2900, do: 'pulse', el: 'c-p' },
					enter(vanish.start(1), 'lb-dangling'),
					{ at: vanish.start(1) + 400, do: 'flow', el: 'arrow-x' },
					{ at: vanish.start(1) + 1400, do: 'pulse', el: 'ghost' },
				),
			},
		},

		// ─── Scene 5. It seems to work ──────────────────────────────────────
		{
			id: 'read',
			chapter: 'undefined',
			scene: 'journey',
			title: { es: 'Un comportamiento indefinido', en: 'Undefined behavior' },
			subtitles: read.list,
			motion: {
				cues: seq(
					line(0, 10),
					enter(300, 'hx-10'),
					exit(300, 400, 'lb-dangling'),
					flow(700, 'a-ghost', 1300),
					{ at: 2000, do: 'pulse', el: 'ghost' },
					{ at: 2200, do: 'type', el: 'ob-1', dur: 300 },
					enter(2500, 'lb-seems'),
					flow(3000, 'a-main', 1000),
					exit(read.start(1), 400, 'lb-seems'),
					enter(read.start(1) + 200, 'fr-other', 'lb-other'),
					exit(read.start(1) + 700, 300, 'v-ghost'),
					enter(read.start(1) + 800, 'c-other'),
					enter(read.start(1) + 1100, 'v-other'),
					{ at: read.start(1) + 1500, do: 'pulse', el: 'c-other' },
					enter(read.start(1) + 2000, 'lb-ub'),
					{ at: read.start(1) + 2800, do: 'pulse', el: 'lb-ub' },
				),
			},
		},

		// ─── Scene 6. Return by value ───────────────────────────────────────
		{
			id: 'fix',
			chapter: 'fix',
			scene: 'journey',
			title: { es: 'La corrección', en: 'The fix' },
			subtitles: fix.list,
			motion: {
				cues: seq(
					exit(0, 500, 'lb-ub', 'fr-other', 'lb-other', 'c-other', 'v-other', 'ghost', 'arrow-x', 'hx-5', 'hx-10', 'c-p', 'v-p', 'ob-1', 'fx', 'hl'),
					shot(300, 'shot-call', 2200),
					exit(700, 300, 'eb-3', 'eb-5', 'eb-9', 'eb-10'),
					{ at: 1000, do: 'type', el: 'ef-3', dur: 500 },
					{ at: 1500, do: 'type', el: 'ef-5', dur: 500 },
					{ at: 2000, do: 'type', el: 'ef-9', dur: 500 },
					{ at: 2500, do: 'type', el: 'ef-10', dur: 400 },
					line(3000, 9, 1),
					flow(3000, 'a-main', 1),
					enter(3100, 'hl', 'fx'),
					enter(3300, 'c-valor'),
					enter(3700, 'fr-call', 'lb-calc'),
					flow(3700, 'a-call'),
					line(3700, 3),
					enter(4200, 'c-n', 'v-n'),
					line(4700, 4),
					enter(4900, 'c-res', 'v-res'),
					line(fix.start(1), 5),
					enter(fix.start(1) + 200, 'copy'),
					{ at: fix.start(1) + 400, do: 'draw', el: 'fl-copy', dur: 1000 },
					{ at: fix.start(1) + 500, do: 'move', el: 'copy', to: 'a-valor', dur: 1200 },
					exit(fix.start(1) + 1700, 300, 'copy'),
					enter(fix.start(1) + 1700, 'v-valor', 'lb-copy'),
					line(fix.start(1) + 2300, 6),
					exit(fix.start(1) + 2600, 700, 'c-res', 'v-res', 'c-n', 'v-n', 'fr-call', 'lb-calc'),
					flow(fix.start(1) + 2700, 'a-main', 800),
					line(fix.start(1) + 3300, 10),
					{ at: fix.start(1) + 3700, do: 'type', el: 'oc-1', dur: 300 },
				),
			},
		},
		{
			id: 'whole',
			chapter: 'fix',
			scene: 'journey',
			title: { es: 'Quién vive más', en: 'Who lives longer' },
			subtitles: whole.list,
			motion: {
				cues: seq(
					exit(0, 400, 'lb-copy'),
					line(300, 11),
					line(900, 12),
					{ at: 400, do: 'camera', to: ['shot-all'], dur: 3200, pad: 0 },
					{ at: 600, do: 'flow', el: 'fl-copy' },
					{ at: 1500, do: 'pulse', el: 'fr-main' },
					{ at: 2600, do: 'pulse', el: 'shelf' },
					{ at: whole.start(1) + 300, do: 'pulse', el: 'c-valor' },
					{ at: whole.start(1) + 900, do: 'pulse', el: 'v-valor' },
					exit(whole.start(2), 500, 'hl', 'fx'),
					{ at: whole.start(2) + 800, do: 'pulse', el: 'zone-stack' },
				),
			},
		},
	],
};
