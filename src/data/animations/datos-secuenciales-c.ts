import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Data in a row": a short film (about two minutes) for the C lesson "Estructuras
// Secuenciales" (`manejo-de-estructuras-secuenciales-de-datos`). It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/datos-secuenciales-c.astro`). The editor shows the
// lesson's own program: five separate variables and their average. The isometric
// world on the right draws each loose variable as a box of its own, then gathers the
// same values (value tokens, one identity for "a grade") into a row of numbered slots
// under a single name. The light blue particle is the flow that walks the row; violet
// marks what solves the problem (the jump of direct access, the row that grows);
// magenta marks the limits (the sum that does not scale, the value with no room).

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
const runTo = (at: number, line: number, dur = 800): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a-m${line}`, dur },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 600) },
];

/** The particle hops from slot to slot, lighting each one as it lands. */
const hops = (at: number, from: number, to: number, each = 650): MotionCue[] =>
	Array.from({ length: to - from + 1 }, (_, index) => {
		const slot = from + index;
		const start = at + index * (each + 150);
		return [
			{ at: start, do: 'move', el: 'p', to: `a-s${slot}`, dur: each } as MotionCue,
			{ at: start + each, do: 'pulse', el: `s-${slot}` } as MotionCue,
		];
	}).flat();

// ─── Captions ───────────────────────────────────────────────────────────────
const build = timed(
	say('Cada módulo es una instrucción y muestra su línea del editor.', 'Each module is an instruction and shows its editor line.'),
	say('Las líneas 4 a 8 crean cinco variables sueltas, cada una con su nombre.', 'Lines 4 to 8 create five separate variables, each with its own name.'),
);
const sum = timed(
	say('Las líneas 10 y 11 suman las cinco notas, nombrando una por una.', 'Lines 10 and 11 add the five grades, naming them one by one.'),
	say('La línea 12 imprime `Promedio: 8.00`. El programa es correcto.', 'Line 12 prints `Average: 8.00`. The program is correct.'),
);
const limit = timed(
	say('Pero no escala: 30 notas serían 30 variables y 30 términos.', 'But it does not scale: 30 grades mean 30 variables and 30 terms.'),
	say('Un ciclo no puede pasar de `nota1` a `nota2`: son nombres, no posiciones.', 'A loop cannot move from `grade1` to `grade2`: names, not positions.'),
	say('Y la cantidad queda fija en el código: 31 alumnos obligan a reescribirlo.', 'And the count is fixed in the code: with 31 students, rewrite it.'),
);
const row = timed(
	say('Una estructura secuencial guarda los datos uno detrás de otro, en orden.', 'A sequential structure stores the data one after another, in order.'),
	say('El conjunto tiene un solo nombre, `notas`, y cada dato tiene su posición.', 'The collection has a single name, `grades`, and each item has a position.'),
	say('En C las posiciones empiezan en 0. Son números: un ciclo puede generarlas.', 'In C positions start at 0. They are numbers: a loop can generate them.'),
);
const sequential = timed(
	say('Acceso secuencial: para llegar al 4 hay que pasar por el 0, 1, 2 y 3.', 'Sequential access: to reach element 4 you pass through 0, 1, 2 and 3.'),
	say('Como una fila tomada de la mano: llegar al elemento k cuesta k pasos.', 'Like a line holding hands: reaching element k takes k steps.'),
);
const direct = timed(
	say('Acceso directo: se va al 4 sin mirar los anteriores; se sabe dónde está.', 'Direct access: you go straight to 4, because you know where it is.'),
	say('Como casilleros numerados: cualquier posición cuesta un solo paso.', 'Like numbered lockers: any position costs a single step.'),
	say('Se llama también acceso aleatorio: no al azar, a cualquier posición.', 'It is also called random access: not by chance, but to any position.'),
);
const fixed = timed(
	say('Tamaño estático: la capacidad se fija al escribir el programa.', 'Static size: the capacity is fixed when the program is written.'),
	say('Capacidad y cantidad usada son números distintos: caben 8, hay 5.', 'Capacity and used count are different numbers: 8 fit, 5 are used.'),
	say('Con la capacidad llena, un dato más no tiene dónde ir.', 'Once the capacity is full, one more item has nowhere to go.'),
);
const grow = timed(
	say('Tamaño dinámico: la estructura pide más espacio mientras corre.', 'Dynamic size: the structure asks for more space as it runs.'),
	say('Eso es pedir memoria en ejecución: lo verás en `memoria-dinamica`.', 'That means requesting memory at run time: see `memoria-dinamica`.'),
);
const close = timed(
	say('El arreglo es una secuencia de acceso directo y tamaño estático.', 'The array is a sequence with direct access and static size.'),
	say('La lección siguiente lo escribe en C; las listas enlazadas, en el módulo 7.', 'The next lesson writes it in C; linked lists arrive in module 7.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'loose', label: { es: 'Variables sueltas', en: 'Separate variables' } },
		{ id: 'limit', label: { es: 'El límite', en: 'The limit' } },
		{ id: 'sequence', label: { es: 'Una secuencia', en: 'A sequence' } },
		{ id: 'access', label: { es: 'Secuencial o directo', en: 'Sequential or direct' } },
		{ id: 'size', label: { es: 'Tamaño fijo o que crece', en: 'Fixed or growing size' } },
		{ id: 'next', label: { es: 'Hacia los arreglos', en: 'Towards arrays' } },
	],
	steps: [
		// ─── Scene 1. Separate variables ────────────────────────────────────
		{
			id: 'build',
			chapter: 'loose',
			scene: 'journey',
			title: { es: 'Cinco variables, cinco cajas', en: 'Five variables, five boxes' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-loose', 4000),
					{ at: 400, do: 'enter', el: 'm-4' },
					{ at: 600, do: 'enter', el: 'm-5' },
					{ at: 800, do: 'enter', el: 'm-6' },
					{ at: 1000, do: 'enter', el: 'm-7' },
					{ at: 1200, do: 'enter', el: 'm-8' },
					{ at: 1400, do: 'enter', el: 'm-10' },
					{ at: 1600, do: 'enter', el: 'm-12' },
					{ at: 1800, do: 'enter', el: 'm-13' },
					{ at: build.start(1), do: 'enter', el: 'hl' },
					{ at: build.start(1), do: 'enter', el: 'p' },
					{ at: build.start(1) + 300, do: 'enter', el: 'on-4' },
					{ at: build.start(1) + 400, do: 'enter', el: 'c-1' },
					...runTo(build.start(1) + 700, 5, 600),
					{ at: build.start(1) + 1300, do: 'enter', el: 'on-5' },
					{ at: build.start(1) + 1400, do: 'enter', el: 'c-2' },
					...runTo(build.start(1) + 1500, 6, 600),
					{ at: build.start(1) + 2100, do: 'enter', el: 'on-6' },
					{ at: build.start(1) + 2200, do: 'enter', el: 'c-3' },
					...runTo(build.start(1) + 2300, 7, 600),
					{ at: build.start(1) + 2900, do: 'enter', el: 'on-7' },
					{ at: build.start(1) + 3000, do: 'enter', el: 'c-4' },
					...runTo(build.start(1) + 3100, 8, 600),
					{ at: build.start(1) + 3700, do: 'enter', el: 'on-8' },
					{ at: build.start(1) + 3800, do: 'enter', el: 'c-5' },
				),
			},
		},
		{
			id: 'sum',
			chapter: 'loose',
			scene: 'journey',
			title: { es: 'Sumar nombre por nombre', en: 'Adding name by name' },
			subtitles: sum.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'on-4', dur: 300 },
					{ at: 0, do: 'exit', el: 'on-5', dur: 300 },
					{ at: 0, do: 'exit', el: 'on-6', dur: 300 },
					{ at: 0, do: 'exit', el: 'on-7', dur: 300 },
					{ at: 0, do: 'exit', el: 'on-8', dur: 300 },
					shot(100, 'shot-station', 2000),
					...runTo(300, 10, 1000),
					{ at: 1300, do: 'enter', el: 'on-10' },
					// Each grade is read by its own name: one token per box travels to the sum.
					...[1, 2, 3, 4, 5].flatMap((n, index): MotionCue[] => [
						{ at: 1400 + index * 350, do: 'enter', el: `tk-${n}` },
						{ at: 1600 + index * 350, do: 'draw', el: `fl-${n}`, dur: 700 },
						{ at: 1700 + index * 350, do: 'move', el: `tk-${n}`, to: 'a-sum', dur: 1300 },
						{ at: 3000 + index * 350, do: 'exit', el: `tk-${n}`, dur: 300 },
					]),
					{ at: 4600, do: 'enter', el: 'lb-avg' },
					{ at: 4700, do: 'pulse', el: 'on-10' },
					{ at: sum.start(1), do: 'exit', el: 'on-10', dur: 300 },
					...runTo(sum.start(1) + 100, 12, 700),
					{ at: sum.start(1) + 800, do: 'enter', el: 'on-12' },
					{ at: sum.start(1) + 900, do: 'type', el: 'out-1', dur: 900 },
					{ at: sum.start(1) + 2000, do: 'exit', el: 'on-12', dur: 300 },
					...runTo(sum.start(1) + 2100, 13, 600),
					{ at: sum.start(1) + 2700, do: 'enter', el: 'on-13' },
				),
			},
		},

		// ─── Scene 2. The limit ─────────────────────────────────────────────
		{
			id: 'limit',
			chapter: 'limit',
			scene: 'journey',
			title: { es: 'Variables sueltas no escalan', en: 'Separate variables do not scale' },
			subtitles: limit.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'on-13', dur: 300 },
					{ at: 0, do: 'exit', el: 'lb-avg', dur: 300 },
					{ at: 0, do: 'exit', el: 'hl', dur: 300 },
					{ at: 200, do: 'enter', el: 'hx-sum' },
					shot(200, 'shot-loose', 2000),
					{ at: 900, do: 'pulse', el: 'm-10' },
					{ at: 1400, do: 'enter', el: 'lb-30' },
					{ at: 2000, do: 'flow', el: 'fl-1' },
					{ at: 2000, do: 'flow', el: 'fl-5' },
					{ at: 2800, do: 'pulse', el: 'lb-30' },
					// A loop tries to step from one name to the next and has nowhere to go.
					{ at: limit.start(1), do: 'move', el: 'p', to: 'a-c1', dur: 900 },
					{ at: limit.start(1) + 300, do: 'draw', el: 'sc-vars', dur: 900 },
					{ at: limit.start(1) + 1000, do: 'draw', el: 'fl-try', dur: 900 },
					{ at: limit.start(1) + 1100, do: 'move', el: 'p', to: 'a-try', dur: 900 },
					{ at: limit.start(1) + 2000, do: 'enter', el: 'no-pass' },
					{ at: limit.start(1) + 2300, do: 'pulse', el: 'c-1' },
					{ at: limit.start(1) + 2700, do: 'pulse', el: 'c-2' },
					{ at: limit.start(1) + 3200, do: 'pulse', el: 'no-pass' },
					{ at: limit.start(2) + 200, do: 'enter', el: 'lb-fixed' },
					{ at: limit.start(2) + 800, do: 'pulse', el: 'hx-sum' },
					{ at: limit.start(2) + 1400, do: 'pulse', el: 'lb-fixed' },
				),
			},
		},

		// ─── Scene 3. A sequence ────────────────────────────────────────────
		{
			id: 'row',
			chapter: 'sequence',
			scene: 'journey',
			title: { es: 'Una fila con un solo nombre', en: 'A row with a single name' },
			subtitles: row.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-30', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-fixed', dur: 400 },
					{ at: 0, do: 'exit', el: 'no-pass', dur: 400 },
					{ at: 0, do: 'exit', el: 'fl-try', dur: 400 },
					{ at: 0, do: 'exit', el: 'sc-vars', dur: 400 },
					{ at: 0, do: 'exit', el: 'p', dur: 300 },
					...[1, 2, 3, 4, 5].map((n): MotionCue => ({ at: 100, do: 'exit', el: `fl-${n}`, dur: 400 })),
					shot(300, 'shot-gather', 2400),
					{ at: 800, do: 'enter', el: 's-0' },
					{ at: 950, do: 'enter', el: 's-1' },
					{ at: 1100, do: 'enter', el: 's-2' },
					{ at: 1250, do: 'enter', el: 's-3' },
					{ at: 1400, do: 'enter', el: 's-4' },
					// The same five grades leave their boxes and line up, in order.
					...[1, 2, 3, 4, 5].flatMap((n, index): MotionCue[] => [
						{ at: 1800 + index * 300, do: 'move', el: `tk-${n}`, to: `a-c${n}`, dur: 1 },
						{ at: 1900 + index * 300, do: 'enter', el: `tk-${n}` },
						{ at: 2100 + index * 300, do: 'move', el: `tk-${n}`, to: `a-s${index}`, dur: 1500 },
					]),
					{ at: row.start(1), do: 'exit', el: 'c-1', dur: 600 },
					{ at: row.start(1) + 100, do: 'exit', el: 'c-2', dur: 600 },
					{ at: row.start(1) + 200, do: 'exit', el: 'c-3', dur: 600 },
					{ at: row.start(1) + 300, do: 'exit', el: 'c-4', dur: 600 },
					{ at: row.start(1) + 400, do: 'exit', el: 'c-5', dur: 600 },
					shot(row.start(1) + 200, 'shot-row', 2000),
					{ at: row.start(1) + 800, do: 'draw', el: 'row-ring', dur: 1000 },
					{ at: row.start(1) + 900, do: 'enter', el: 'lb-name' },
					{ at: row.start(1) + 1500, do: 'enter', el: 'pos' },
					{ at: row.start(1) + 2200, do: 'pulse', el: 'lb-name' },
					// A loop can generate 0, 1, 2, 3, 4: the flow visits every position.
					{ at: row.start(2), do: 'move', el: 'p', to: 'a-start', dur: 1 },
					{ at: row.start(2) + 100, do: 'enter', el: 'p' },
					{ at: row.start(2) + 300, do: 'pulse', el: 'pos' },
					...hops(row.start(2) + 700, 0, 4, 450),
				),
			},
		},

		// ─── Scene 4. Sequential or direct access ───────────────────────────
		{
			id: 'sequential',
			chapter: 'access',
			scene: 'journey',
			title: { es: 'Acceso secuencial', en: 'Sequential access' },
			subtitles: sequential.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'move', el: 'p', to: 'a-start', dur: 900 },
					{ at: 400, do: 'enter', el: 'lb-start' },
					{ at: 600, do: 'enter', el: 'links' },
					{ at: 700, do: 'flow', el: 'links' },
					...hops(1100, 0, 4, 700),
					{ at: 1100 + 4 * 850 + 800, do: 'enter', el: 'lb-k' },
					{ at: sequential.start(1) + 600, do: 'pulse', el: 'lb-k' },
					{ at: sequential.start(1) + 1400, do: 'pulse', el: 'links' },
				),
			},
		},
		{
			id: 'direct',
			chapter: 'access',
			scene: 'journey',
			title: { es: 'Acceso directo', en: 'Direct access' },
			subtitles: direct.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-k', dur: 400 },
					{ at: 0, do: 'exit', el: 'links', dur: 500 },
					{ at: 100, do: 'move', el: 'p', to: 'a-start', dur: 900 },
					{ at: 1100, do: 'draw', el: 'fl-jump', dur: 900 },
					{ at: 1300, do: 'move', el: 'p', to: 'a-s4', dur: 1100 },
					{ at: 2400, do: 'pulse', el: 's-4' },
					{ at: 2600, do: 'enter', el: 'lb-one' },
					{ at: direct.start(1) + 200, do: 'pulse', el: 'pos' },
					{ at: direct.start(1) + 600, do: 'move', el: 'p', to: 'a-s1', dur: 900 },
					{ at: direct.start(1) + 1500, do: 'pulse', el: 's-1' },
					{ at: direct.start(1) + 1800, do: 'move', el: 'p', to: 'a-s3', dur: 800 },
					{ at: direct.start(1) + 2600, do: 'pulse', el: 's-3' },
					{ at: direct.start(2) + 200, do: 'move', el: 'p', to: 'a-s0', dur: 900 },
					{ at: direct.start(2) + 1100, do: 'pulse', el: 's-0' },
					{ at: direct.start(2) + 1500, do: 'pulse', el: 'lb-one' },
				),
			},
		},

		// ─── Scene 5. Fixed or growing size ─────────────────────────────────
		{
			id: 'fixed',
			chapter: 'size',
			scene: 'journey',
			title: { es: 'Capacidad fija', en: 'Fixed capacity' },
			subtitles: fixed.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-one', dur: 400 },
					{ at: 0, do: 'exit', el: 'fl-jump', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-start', dur: 400 },
					{ at: 0, do: 'exit', el: 'p', dur: 400 },
					shot(200, 'shot-cap', 2200),
					{ at: 900, do: 'enter', el: 's-5' },
					{ at: 1050, do: 'enter', el: 's-6' },
					{ at: 1200, do: 'enter', el: 's-7' },
					{ at: 1500, do: 'draw', el: 'cap-ring', dur: 1200 },
					{ at: 2200, do: 'enter', el: 'lb-cap' },
					{ at: fixed.start(1) + 800, do: 'enter', el: 'lb-used5' },
					{ at: fixed.start(1) + 1500, do: 'pulse', el: 'lb-cap' },
					{ at: fixed.start(1) + 2100, do: 'pulse', el: 'lb-used5' },
					// Three more grades arrive; the used count reaches the capacity.
					{ at: fixed.start(2), do: 'exit', el: 'lb-used5', dur: 300 },
					...[6, 7, 8].flatMap((n, index): MotionCue[] => [
						{ at: fixed.start(2) + 100 + index * 350, do: 'move', el: `tk-${n}`, to: 'a-in', dur: 1 },
						{ at: fixed.start(2) + 200 + index * 350, do: 'enter', el: `tk-${n}` },
						{ at: fixed.start(2) + 300 + index * 350, do: 'move', el: `tk-${n}`, to: `a-s${n - 1}`, dur: 900 },
					]),
					{ at: fixed.start(2) + 1700, do: 'enter', el: 'lb-used8' },
					{ at: fixed.start(2) + 1900, do: 'move', el: 'tk-9', to: 'a-in', dur: 1 },
					{ at: fixed.start(2) + 2000, do: 'enter', el: 'tk-9' },
					{ at: fixed.start(2) + 2100, do: 'move', el: 'tk-9', to: 'a-full', dur: 700 },
					{ at: fixed.start(2) + 2900, do: 'enter', el: 'lb-full' },
					{ at: fixed.start(2) + 3100, do: 'pulse', el: 'tk-9' },
				),
			},
		},
		{
			id: 'grow',
			chapter: 'size',
			scene: 'journey',
			title: { es: 'Un tamaño que crece', en: 'A size that grows' },
			subtitles: grow.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-full', dur: 400 },
					{ at: 0, do: 'exit', el: 'tk-9', dur: 400 },
					shot(200, 'shot-grow', 2200),
					// Each arriving item gets a new slot, asked for while the program runs.
					...[0, 1, 2, 3].flatMap((n, index): MotionCue[] => [
						{ at: 1000 + index * 1000, do: 'enter', el: `g-${n}`, dur: 500 },
						{ at: 1100 + index * 1000, do: 'move', el: `tg-${n}`, to: 'a-in2', dur: 1 },
						{ at: 1200 + index * 1000, do: 'enter', el: `tg-${n}` },
						{ at: 1300 + index * 1000, do: 'move', el: `tg-${n}`, to: `a-g${n}`, dur: 700 },
					]),
					{ at: 1800, do: 'enter', el: 'lb-grow' },
					{ at: grow.start(1) + 200, do: 'enter', el: 'lb-mem' },
					{ at: grow.start(1) + 900, do: 'pulse', el: 'lb-mem' },
					{ at: grow.start(1) + 1500, do: 'pulse', el: 'g-3' },
				),
			},
		},

		// ─── Scene 6. Towards arrays ────────────────────────────────────────
		{
			id: 'close',
			chapter: 'next',
			scene: 'journey',
			title: { es: 'El arreglo, en la lección siguiente', en: 'The array, in the next lesson' },
			subtitles: close.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-grow', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-mem', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-used8', dur: 400 },
					// The camera pulls back to reveal both rows and the old program's modules.
					{ at: 300, do: 'camera', to: 'all', dur: 3000 },
					{ at: 1600, do: 'enter', el: 'map-array' },
					{ at: 2400, do: 'pulse', el: 'pos' },
					{ at: close.start(1), do: 'enter', el: 'g-links' },
					{ at: close.start(1) + 200, do: 'flow', el: 'g-links' },
					{ at: close.start(1) + 600, do: 'enter', el: 'map-list' },
					{ at: close.start(1) + 1400, do: 'enter', el: 'lb-next' },
					{ at: close.start(1) + 2200, do: 'pulse', el: 'lb-next' },
				),
			},
		},
	],
};
