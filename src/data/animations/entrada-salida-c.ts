import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Reading without trusting": a short film (about two minutes) for the C lesson
// "Entrada y Salida" (`entrada-y-salida`). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/entrada-salida-c.astro`):
// every run of a program of the lesson is a district of isometric track, every
// instruction a module with its editor line. The keyboard types character tiles into
// the input buffer, a queue in front of the track; `scanf` consumes the digits from the
// front into the cell of its variable and returns how many values it stored; what it
// cannot read stays queued until a `getchar` loop drains it; `printf` turns values into
// text strips, with the specifier above each module. The editor on the left shows the
// program of the district in view, with a bar that slides to the running line.

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

/**
 * The particle travels hop by hop (each hop starts when the previous one ends). A hop
 * may also slide the editor bar to its line and draw the route the particle lights up.
 */
type Hop = { to: string; dur: number; line?: number; run?: string; runDur?: number };
function travel(at: number, ...hops: Hop[]): MotionCue[] {
	const cues: MotionCue[] = [];
	let time = at;
	for (const hop of hops) {
		cues.push({ at: time, do: 'move', el: 'p', to: hop.to, dur: hop.dur });
		if (hop.line) cues.push({ at: time, do: 'move', el: 'hl', to: `ln-${hop.line}`, dur: Math.min(hop.dur, 700) });
		if (hop.run) cues.push({ at: time, do: 'draw', el: hop.run, dur: hop.runDur ?? hop.dur });
		time += hop.dur;
	}
	return cues;
}

/**
 * Turns to the next district: the particle and the bar leave, the editor turns the page
 * when the program changes, the camera frames the new district and both come back at
 * line 4. The first cue that moves the particle may start at 700 ms.
 */
function nextRun(to: string, leftovers: string[], page?: [from: string, to: string]): MotionCue[] {
	return [
		{ at: 0, do: 'exit', el: 'p', dur: 400 },
		{ at: 0, do: 'exit', el: 'hl', dur: 400 },
		...(page ? [{ at: 0, do: 'exit', el: `pg-${page[0]}`, dur: 400 } as MotionCue, { at: 500, do: 'enter', el: `pg-${page[1]}`, dur: 700 } as MotionCue] : []),
		...leftovers.map((el): MotionCue => ({ at: 0, do: 'exit', el, dur: 400 })),
		shot(300, `shot-${to}`, 2400),
		{ at: 600, do: 'move', el: 'p', to: `a-${to}4`, dur: 1 },
		{ at: 600, do: 'move', el: 'hl', to: 'ln-4', dur: 1 },
		{ at: 900, do: 'enter', el: `dist-${to}`, dur: 1000 },
		{ at: 2200, do: 'enter', el: 'p' },
		{ at: 2200, do: 'enter', el: 'hl' },
		{ at: 2300, do: 'enter', el: `on-${to}4` },
		{ at: 2300, do: 'pulse', el: `m-${to}4` },
	];
}

/** A tile leaves the front of the buffer for a cell; it disappears once it has been consumed. */
const consume = (at: number, tile: string, to: string, dur = 900): MotionCue[] => [
	{ at, do: 'move', el: tile, to, dur },
	{ at: at + dur, do: 'exit', el: tile, dur: 300 },
];

/** The keyboard types the tiles one after the other. */
const typeTiles = (at: number, kb: string, ids: string[], gap = 450): MotionCue[] =>
	ids.flatMap((id, index) => [
		{ at: at + index * gap, do: 'enter', el: id } as MotionCue,
		{ at: at + index * gap, do: 'pulse', el: kb, dur: 400 } as MotionCue,
	]);

// ─── Captions ───────────────────────────────────────────────────────────────
const read = timed(
	say(
		'El teclado llena el búfer de entrada, una fila de caracteres que `scanf` consume.',
		'The keyboard fills the input buffer, a queue of characters that `scanf` consumes.',
	),
	say(
		'En la línea 7, `scanf` toma los dígitos `2` y `5` y los guarda en `edad`.',
		'At line 7, `scanf` takes the digits `2` and `5` and stores them in `age`.',
	),
	say(
		'`scanf` devuelve `1`, la cantidad de valores que cargó. El `\\n` queda en el búfer.',
		'`scanf` returns `1`, the number of values it stored. The `\\n` stays in the buffer.',
	),
);
const invalid = timed(
	say(
		'Ahora el usuario escribe `abc`: `scanf` no puede convertirlo en un entero.',
		'Now the user types `abc`: `scanf` cannot turn it into an integer.',
	),
	say(
		'`scanf` devuelve `0` y `edad` sigue valiendo 0: por eso se compara con `!= 1`.',
		'`scanf` returns `0` and `age` is still 0: that is why it is compared with `!= 1`.',
	),
	say(
		'Falla sin consumir nada: `abc` y el `\\n` siguen en el búfer.',
		'It fails without consuming anything: `abc` and the `\\n` are still in the buffer.',
	),
);
const discard = timed(
	say(
		'Si leyera otra vez, `scanf` fallaría de nuevo con los mismos caracteres.',
		'If it read again, `scanf` would fail again on the same characters.',
	),
	say(
		'Un ciclo de `getchar` los descarta: un carácter por vuelta, hasta el `\\n`.',
		'A `getchar` loop discards them: one character per turn, up to the `\\n`.',
	),
);
const retry = timed(
	say(
		'Con el búfer vacío, el usuario escribe `7` y el segundo `scanf` sí lo lee.',
		'With the buffer empty, the user types `7` and the second `scanf` does read it.',
	),
	say(
		'Descartar la línea es la receta: sin eso, esta lectura habría fallado igual.',
		'Discarding the line is the recipe: without it, this read would have failed too.',
	),
);
const leftover = timed(
	say(
		'Un caso sutil: con `12abc`, `scanf` lee `12` y se detiene en la `a`.',
		'A subtle case: with `12abc`, `scanf` reads `12` and stops at the `a`.',
	),
	say(
		'Devuelve `1`: la lectura fue exitosa, pero `abc` quedó pendiente en el búfer.',
		'It returns `1`: the read succeeded, but `abc` is still pending in the buffer.',
	),
);
const format = timed(
	say(
		'Ahora la salida: `printf` convierte valores en texto según cada especificador.',
		'Now the output: `printf` turns values into text according to each specifier.',
	),
	say(
		'`%5d` muestra el entero con ancho 5, rellenando con espacios a la izquierda.',
		'`%5d` shows the integer with width 5, padding with spaces on the left.',
	),
	say(
		'`%.2f` pide 2 decimales, `%8.2f` suma ancho 8 y `%zu` muestra un `size_t`.',
		'`%.2f` asks for 2 decimals, `%8.2f` adds width 8 and `%zu` shows a `size_t`.',
	),
);
const dbl = timed(
	say(
		'Con un `double`, `scanf` lo lee con `%lf`.',
		'With a `double`, `scanf` reads it with `%lf`.',
	),
	say(
		'Con `%f`, `scanf` escribiría un `float` en el lugar de un `double`.',
		'With `%f`, `scanf` would write a `float` where a `double` lives.',
	),
	say(
		'`printf`, en cambio, lo muestra con `%f`: `%.2f` da `1.75`.',
		'`printf`, on the other hand, shows it with `%f`: `%.2f` gives `1.75`.',
	),
);
const close = timed(
	say(
		'Revisa siempre lo que devuelve `scanf` y descarta la entrada inválida.',
		'Always check what `scanf` returns and discard invalid input.',
	),
	say(
		'Y que cada especificador coincida con su tipo.',
		'And make every specifier match its type.',
	),
);

/**
 * One `printf` of the run: the particle goes from `prev` to `line`, the module lights up,
 * the specifier shows above it, the text is typed in the console and the strip appears.
 */
function emit(at: number, prev: number, line: number, row: number): MotionCue[] {
	return [
		{ at, do: 'exit', el: `on-e${prev}`, dur: 400 },
		{ at, do: 'exit', el: `sp-e${prev}`, dur: 400 },
		...travel(at, { to: `a-e${line}`, line, dur: 700, run: `run-e-${prev}` }),
		{ at: at + 800, do: 'enter', el: `on-e${line}` },
		{ at: at + 900, do: 'enter', el: `sp-e${line}` },
		{ at: at + 1300, do: 'type', el: `out-e${row}`, dur: 600 },
		{ at: at + 1400, do: 'enter', el: `o-e${line}` },
	];
}

export const script: AnimationScript = {
	chapters: [
		{ id: 'read', label: { es: 'Leer con scanf', en: 'Reading with scanf' } },
		{ id: 'invalid', label: { es: 'La entrada inválida', en: 'Invalid input' } },
		{ id: 'discard', label: { es: 'Descartar la línea', en: 'Discarding the line' } },
		{ id: 'leftover', label: { es: 'Lo que sobra', en: 'What is left over' } },
		{ id: 'format', label: { es: 'Mostrar con printf', en: 'Printing with printf' } },
		{ id: 'double', label: { es: 'Un double', en: 'A double' } },
	],
	steps: [
		// ─── Scene 1. scanf reads 25 ────────────────────────────────────────
		{
			id: 'read',
			chapter: 'read',
			scene: 'journey',
			title: { es: 'scanf devuelve 1', en: 'scanf returns 1' },
			subtitles: read.list,
			motion: {
				cues: seq(
					shot(0, 'shot-a', 4000),
					{ at: 300, do: 'enter', el: 'dist-a', dur: 1000 },
					{ at: 1600, do: 'enter', el: 'p' },
					{ at: 1600, do: 'enter', el: 'hl' },
					{ at: 1800, do: 'enter', el: 'on-a4' },
					{ at: 1800, do: 'pulse', el: 'm-a4' },
					{ at: 2200, do: 'enter', el: 'v-a0' },
					{ at: 2500, do: 'exit', el: 'on-a4', dur: 400 },
					travel(2500, { to: 'a-a6', line: 6, dur: 800, run: 'run-a-1' }),
					{ at: 3300, do: 'enter', el: 'on-a6' },
					{ at: 3400, do: 'type', el: 'out-a1', dur: 900 },
					typeTiles(4000, 'kb-a', ['t-a1', 't-a2', 't-a3']),
					{ at: read.start(1), do: 'exit', el: 'on-a6', dur: 400 },
					travel(read.start(1) + 100, { to: 'a-a7', line: 7, dur: 900, run: 'run-a-2' }),
					{ at: read.start(1) + 1000, do: 'enter', el: 'on-a7' },
					{ at: read.start(1) + 1000, do: 'pulse', el: 'm-a7' },
					shot(read.start(1) + 1000, 'shot-a-buf', 1500),
					consume(read.start(1) + 2400, 't-a1', 'k-a-cell'),
					consume(read.start(1) + 2900, 't-a2', 'k-a-cell'),
					{ at: read.start(1) + 3700, do: 'exit', el: 'v-a0', dur: 300 },
					{ at: read.start(1) + 3900, do: 'enter', el: 'v-a25' },
					{ at: read.start(1) + 4100, do: 'pulse', el: 'c-a' },
					shot(read.start(2), 'shot-a', 1500),
					{ at: read.start(2) + 300, do: 'enter', el: 'r-a7' },
					{ at: read.start(2) + 300, do: 'pulse', el: 'm-a7' },
					{ at: read.start(2) + 1300, do: 'enter', el: 'q-a7' },
					{ at: read.start(2) + 2000, do: 'enter', el: 'rest-a' },
					{ at: read.start(2) + 2600, do: 'enter', el: 'skip-a8' },
					{ at: read.start(2) + 2900, do: 'exit', el: 'on-a7', dur: 400 },
					travel(read.start(2) + 3000, { to: 'a-a12', line: 12, dur: 900, run: 'run-a-3' }),
					{ at: read.start(2) + 3900, do: 'enter', el: 'on-a12' },
					{ at: read.start(2) + 4000, do: 'type', el: 'out-a2', dur: 1000 },
					{ at: read.start(2) + 5000, do: 'exit', el: 'on-a12', dur: 400 },
					travel(read.start(2) + 5000, { to: 'a-a13', line: 13, dur: 600, run: 'run-a-4' }),
					{ at: read.start(2) + 5600, do: 'enter', el: 'on-a13', dur: 300 },
				),
			},
		},

		// ─── Scene 2. scanf finds abc ───────────────────────────────────────
		{
			id: 'invalid',
			chapter: 'invalid',
			scene: 'journey',
			title: { es: 'scanf devuelve 0', en: 'scanf returns 0' },
			subtitles: invalid.list,
			motion: {
				cues: seq(
					nextRun('b', ['on-a13', 'out-a1', 'out-a2', 'r-a7', 'q-a7', 'rest-a', 'skip-a8']),
					{ at: 2500, do: 'enter', el: 'v-b0' },
					typeTiles(2800, 'kb-b', ['t-b1', 't-b2', 't-b3', 't-b4']),
					{ at: 2700, do: 'exit', el: 'on-b4', dur: 400 },
					travel(2800, { to: 'a-b6', line: 6, dur: 700, run: 'run-b-1' }, { to: 'a-b7', line: 7, dur: 800, run: 'run-b-2' }),
					{ at: 3500, do: 'enter', el: 'on-b6' },
					{ at: 3500, do: 'type', el: 'out-b1', dur: 900 },
					{ at: 4300, do: 'exit', el: 'on-b6', dur: 400 },
					{ at: 4300, do: 'enter', el: 'on-b7' },
					{ at: 4300, do: 'pulse', el: 'm-b7' },
					shot(invalid.start(1) - 200, 'shot-b-buf', 1500),
					// The first character is not a digit: scanf looks at it and gives up.
					{ at: invalid.start(1) + 1500, do: 'move', el: 't-b1', to: 'k-b-cell', dur: 700 },
					{ at: invalid.start(1) + 2300, do: 'move', el: 't-b1', to: 's-b-1', dur: 700 },
					{ at: invalid.start(1) + 3000, do: 'enter', el: 'r-b7' },
					{ at: invalid.start(1) + 3000, do: 'pulse', el: 'm-b7' },
					{ at: invalid.start(1) + 3800, do: 'enter', el: 'q-b7' },
					{ at: invalid.start(1) + 4400, do: 'pulse', el: 'c-b' },
					shot(invalid.start(2), 'shot-b', 1500),
					{ at: invalid.start(2) + 300, do: 'enter', el: 'zone-b', dur: 800 },
					{ at: invalid.start(2) + 800, do: 'enter', el: 'stuck-b' },
					{ at: invalid.start(2) + 1800, do: 'exit', el: 'on-b7', dur: 400 },
					travel(
						invalid.start(2) + 1900,
						{ to: 'a-b8', line: 8, dur: 900, run: 'run-b-e', runDur: 1900 },
						{ to: 'a-b9', line: 9, dur: 1000 },
					),
					{ at: invalid.start(2) + 2800, do: 'enter', el: 'on-b8' },
					{ at: invalid.start(2) + 2900, do: 'type', el: 'out-b2', dur: 1400 },
					{ at: invalid.start(2) + 3900, do: 'exit', el: 'on-b8', dur: 400 },
					{ at: invalid.start(2) + 3900, do: 'enter', el: 'on-b9' },
				),
			},
		},

		// ─── Scene 3. Discard the line with getchar ─────────────────────────
		{
			id: 'discard',
			chapter: 'discard',
			scene: 'journey',
			title: { es: 'getchar descarta la línea', en: 'getchar discards the line' },
			subtitles: discard.list,
			motion: {
				cues: seq(
					nextRun('c', ['on-b9', 'out-b1', 'out-b2', 'r-b7', 'q-b7', 'stuck-b'], ['a', 'c']),
					{ at: 2500, do: 'enter', el: 'v-c0' },
					typeTiles(2900, 'kb-c', ['t-c1', 't-c2', 't-c3', 't-c4']),
					{ at: 2700, do: 'exit', el: 'on-c4', dur: 400 },
					travel(
						2700,
						{ to: 'a-c5', line: 5, dur: 600, run: 'run-c-1' },
						{ to: 'a-c6', line: 6, dur: 600, run: 'run-c-2' },
						{ to: 'a-c7', line: 7, dur: 700, run: 'run-c-3' },
					),
					{ at: 3300, do: 'pulse', el: 'm-c5' },
					{ at: 3900, do: 'pulse', el: 'm-c6' },
					{ at: 3900, do: 'type', el: 'out-c1', dur: 700 },
					{ at: 4700, do: 'enter', el: 'on-c7' },
					{ at: 4800, do: 'enter', el: 'r-c7' },
					{ at: 5200, do: 'enter', el: 'zone-c', dur: 800 },
					{ at: 5500, do: 'enter', el: 'stuck-c' },
					{ at: discard.start(1), do: 'exit', el: 'on-c7', dur: 400 },
					{ at: discard.start(1) + 600, do: 'exit', el: 'r-c7', dur: 400 },
					{ at: discard.start(1) + 600, do: 'exit', el: 'stuck-c', dur: 400 },
					shot(discard.start(1), 'shot-c-buf', 1500),
					travel(discard.start(1) + 200, { to: 'a-c8', line: 8, dur: 800, run: 'run-c-4' }),
					{ at: discard.start(1) + 1000, do: 'enter', el: 'on-c8' },
					{ at: discard.start(1) + 1100, do: 'enter', el: 'lp-c8' },
					// One tile per turn of the loop: each character goes into `c` and is thrown away.
					...[1, 2, 3, 4].flatMap((n) => [
						{ at: discard.start(1) + 1500 + n * 900, do: 'pulse', el: 'm-c8' } as MotionCue,
						...consume(discard.start(1) + 1500 + n * 900, `t-c${n}`, 'k-c-cc', 700),
					]),
					{ at: discard.start(1) + 5500, do: 'exit', el: 'zone-c', dur: 500 },
				),
			},
		},

		// ─── Scene 4. Read again ────────────────────────────────────────────
		{
			id: 'retry',
			chapter: 'discard',
			scene: 'journey',
			title: { es: 'La segunda lectura', en: 'The second read' },
			subtitles: retry.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lp-c8', dur: 400 },
					{ at: 0, do: 'exit', el: 'on-c8', dur: 400 },
					shot(0, 'shot-c', 1600),
					travel(200, { to: 'a-c11', line: 11, dur: 800, run: 'run-c-5' }),
					{ at: 1000, do: 'enter', el: 'on-c11' },
					{ at: 1100, do: 'type', el: 'out-c2', dur: 1300 },
					{ at: 2600, do: 'exit', el: 'on-c11', dur: 400 },
					travel(2600, { to: 'a-c12', line: 12, dur: 700, run: 'run-c-6' }),
					{ at: 3300, do: 'enter', el: 'on-c12' },
					typeTiles(3300, 'kb-c', ['t-c5', 't-c6']),
					shot(3700, 'shot-c-buf', 1500),
					consume(4600, 't-c5', 'k-c-cell'),
					{ at: 5400, do: 'exit', el: 'v-c0', dur: 300 },
					{ at: 5600, do: 'enter', el: 'v-c7' },
					{ at: 5700, do: 'pulse', el: 'c-c' },
					{ at: 5900, do: 'enter', el: 'r-c12' },
					shot(retry.start(1), 'shot-c', 1500),
					{ at: retry.start(1) + 300, do: 'enter', el: 'skip-c13' },
					{ at: retry.start(1) + 800, do: 'exit', el: 'on-c12', dur: 400 },
					travel(retry.start(1) + 900, { to: 'a-c17', line: 17, dur: 1000, run: 'run-c-7' }),
					{ at: retry.start(1) + 1900, do: 'enter', el: 'on-c17' },
					{ at: retry.start(1) + 2000, do: 'type', el: 'out-c3', dur: 1600 },
					{ at: retry.start(1) + 3800, do: 'exit', el: 'on-c17', dur: 400 },
					travel(retry.start(1) + 3800, { to: 'a-c18', line: 18, dur: 700, run: 'run-c-8' }),
					{ at: retry.start(1) + 4500, do: 'enter', el: 'on-c18' },
				),
			},
		},

		// ─── Scene 5. 12abc ─────────────────────────────────────────────────
		{
			id: 'leftover',
			chapter: 'leftover',
			scene: 'journey',
			title: { es: '12abc: lo que sobra', en: '12abc: what is left over' },
			subtitles: leftover.list,
			motion: {
				cues: seq(
					nextRun('d', ['on-c18', 'out-c1', 'out-c2', 'out-c3', 'r-c12', 'skip-c13'], ['c', 'a']),
					{ at: 2500, do: 'enter', el: 'v-d0' },
					typeTiles(2800, 'kb-d', ['t-d1', 't-d2', 't-d3', 't-d4', 't-d5', 't-d6'], 380),
					{ at: 2700, do: 'exit', el: 'on-d4', dur: 400 },
					travel(2800, { to: 'a-d6', line: 6, dur: 700, run: 'run-d-1' }, { to: 'a-d7', line: 7, dur: 800, run: 'run-d-2' }),
					{ at: 3500, do: 'enter', el: 'on-d6' },
					{ at: 3500, do: 'type', el: 'out-d1', dur: 900 },
					{ at: 4300, do: 'exit', el: 'on-d6', dur: 400 },
					{ at: 4300, do: 'enter', el: 'on-d7' },
					{ at: 4300, do: 'pulse', el: 'm-d7' },
					shot(4800, 'shot-d-buf', 1500),
					consume(5300, 't-d1', 'k-d-cell'),
					consume(5800, 't-d2', 'k-d-cell'),
					{ at: 6600, do: 'exit', el: 'v-d0', dur: 300 },
					{ at: 6800, do: 'enter', el: 'v-d12' },
					{ at: 7000, do: 'pulse', el: 'c-d' },
					{ at: leftover.start(1) + 1200, do: 'enter', el: 'r-d7' },
					{ at: leftover.start(1) + 1800, do: 'enter', el: 'zone-d', dur: 800 },
					{ at: leftover.start(1) + 2300, do: 'enter', el: 'left-d' },
					shot(leftover.start(1) + 2700, 'shot-d', 1500),
					{ at: leftover.start(1) + 2900, do: 'enter', el: 'q-d7' },
					{ at: leftover.start(1) + 3300, do: 'enter', el: 'skip-d8' },
					{ at: leftover.start(1) + 3600, do: 'exit', el: 'on-d7', dur: 400 },
					travel(leftover.start(1) + 3700, { to: 'a-d12', line: 12, dur: 900, run: 'run-d-3' }),
					{ at: leftover.start(1) + 4600, do: 'enter', el: 'on-d12' },
					{ at: leftover.start(1) + 4700, do: 'type', el: 'out-d2', dur: 1000 },
				),
			},
		},

		// ─── Scene 6. printf and its specifiers ─────────────────────────────
		{
			id: 'format',
			chapter: 'format',
			scene: 'journey',
			title: { es: 'printf y sus especificadores', en: 'printf and its specifiers' },
			subtitles: format.list,
			motion: {
				cues: seq(
					nextRun('e', ['on-d12', 'out-d1', 'out-d2', 'r-d7', 'q-d7', 'left-d', 'skip-d8'], ['a', 'e']),
					{ at: 2500, do: 'enter', el: 'sp-e4' },
					{ at: 3200, do: 'type', el: 'out-e1', dur: 700 },
					{ at: 3300, do: 'enter', el: 'o-e4' },
					{ at: format.start(1) + 200, do: 'pulse', el: 'sp-e4' },
					{ at: format.start(1) + 500, do: 'pulse', el: 'o-e4' },
					emit(format.start(1) + 1000, 4, 5, 2),
					emit(format.start(1) + 2450, 5, 6, 3),
					emit(format.start(2) + 200, 6, 7, 4),
					emit(format.start(2) + 1650, 7, 8, 5),
					emit(format.start(2) + 3100, 8, 9, 6),
					{ at: format.start(2) + 4550, do: 'exit', el: 'on-e9', dur: 400 },
					{ at: format.start(2) + 4550, do: 'exit', el: 'sp-e9', dur: 400 },
					travel(format.start(2) + 4550, { to: 'a-e10', line: 10, dur: 700, run: 'run-e-9' }),
					{ at: format.start(2) + 5300, do: 'enter', el: 'on-e10', dur: 300 },
				),
			},
		},

		// ─── Scene 7. A double ──────────────────────────────────────────────
		{
			id: 'double',
			chapter: 'double',
			scene: 'journey',
			title: { es: '%lf en scanf, %f en printf', en: '%lf in scanf, %f in printf' },
			subtitles: dbl.list,
			motion: {
				cues: seq(
					nextRun('f', ['on-e10', 'out-e1', 'out-e2', 'out-e3', 'out-e4', 'out-e5', 'out-e6'], ['e', 'f']),
					{ at: 2500, do: 'enter', el: 'v-f0' },
					typeTiles(2800, 'kb-f', ['t-f1', 't-f2', 't-f3', 't-f4', 't-f5'], 380),
					{ at: 2700, do: 'exit', el: 'on-f4', dur: 400 },
					travel(2800, { to: 'a-f6', line: 6, dur: 700, run: 'run-f-1' }, { to: 'a-f7', line: 7, dur: 800, run: 'run-f-2' }),
					{ at: 3500, do: 'enter', el: 'on-f6' },
					{ at: 3500, do: 'type', el: 'out-f1', dur: 900 },
					{ at: 4300, do: 'exit', el: 'on-f6', dur: 400 },
					{ at: 4300, do: 'enter', el: 'on-f7' },
					{ at: 4300, do: 'pulse', el: 'm-f7' },
					{ at: 4600, do: 'enter', el: 'lf-scan' },
					shot(dbl.start(1), 'shot-f-buf', 1500),
					{ at: dbl.start(1) + 600, do: 'enter', el: 'lf-wrong' },
					{ at: dbl.start(1) + 1200, do: 'pulse', el: 'c-f' },
					{ at: dbl.start(1) + 3000, do: 'exit', el: 'lf-wrong', dur: 400 },
					consume(dbl.start(1) + 3200, 't-f1', 'k-f-cell', 700),
					consume(dbl.start(1) + 3500, 't-f2', 'k-f-cell', 700),
					consume(dbl.start(1) + 3800, 't-f3', 'k-f-cell', 700),
					consume(dbl.start(1) + 4100, 't-f4', 'k-f-cell', 700),
					{ at: dbl.start(1) + 4900, do: 'exit', el: 'v-f0', dur: 300 },
					{ at: dbl.start(1) + 5100, do: 'enter', el: 'v-f175' },
					{ at: dbl.start(1) + 5300, do: 'pulse', el: 'c-f' },
					shot(dbl.start(2), 'shot-f', 1500),
					{ at: dbl.start(2) + 200, do: 'enter', el: 'r-f7' },
					{ at: dbl.start(2) + 600, do: 'enter', el: 'skip-f8' },
					{ at: dbl.start(2) + 900, do: 'exit', el: 'on-f7', dur: 400 },
					travel(dbl.start(2) + 1000, { to: 'a-f12', line: 12, dur: 1000, run: 'run-f-3' }),
					{ at: dbl.start(2) + 2000, do: 'enter', el: 'on-f12' },
					{ at: dbl.start(2) + 2100, do: 'enter', el: 'lf-print' },
					{ at: dbl.start(2) + 2200, do: 'type', el: 'out-f2', dur: 1000 },
					{ at: dbl.start(2) + 3500, do: 'exit', el: 'on-f12', dur: 400 },
					travel(dbl.start(2) + 3500, { to: 'a-f13', line: 13, dur: 700, run: 'run-f-4' }),
					{ at: dbl.start(2) + 4200, do: 'enter', el: 'on-f13' },
				),
			},
		},

		// ─── Scene 8. The whole map ─────────────────────────────────────────
		{
			id: 'close',
			chapter: 'double',
			scene: 'journey',
			title: { es: 'Leer sin confiar', en: 'Reading without trusting' },
			subtitles: close.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'on-f13', dur: 400 },
					{ at: 0, do: 'exit', el: 'lf-scan', dur: 400 },
					{ at: 0, do: 'exit', el: 'lf-print', dur: 400 },
					{ at: 0, do: 'exit', el: 'r-f7', dur: 400 },
					{ at: 0, do: 'exit', el: 'skip-f8', dur: 400 },
					{ at: 0, do: 'exit', el: 'out-f1', dur: 400 },
					{ at: 0, do: 'exit', el: 'out-f2', dur: 400 },
					// The camera pulls back to reveal every run as one map.
					shot(200, 'shot-all', 3800),
					{ at: 1500, do: 'enter', el: 'tag-a' },
					{ at: 1800, do: 'enter', el: 'tag-b' },
					{ at: 2100, do: 'enter', el: 'tag-c' },
					{ at: 2400, do: 'enter', el: 'tag-d' },
					{ at: 2700, do: 'enter', el: 'tag-e' },
					{ at: 3000, do: 'enter', el: 'tag-f' },
					{ at: 2000, do: 'flow', el: 'run-a-3' },
					{ at: 2200, do: 'flow', el: 'run-b-e' },
					{ at: 2400, do: 'flow', el: 'run-c-7' },
					{ at: 2600, do: 'flow', el: 'run-d-3' },
					{ at: 2800, do: 'flow', el: 'run-e-9' },
					{ at: 3000, do: 'flow', el: 'run-f-3' },
					{ at: 3400, do: 'pulse', el: 'm-a7' },
					{ at: 3600, do: 'pulse', el: 'm-b7' },
					{ at: 3800, do: 'pulse', el: 'm-c8' },
					{ at: 4000, do: 'pulse', el: 'm-d7' },
					{ at: 4200, do: 'pulse', el: 'm-f7' },
					{ at: close.start(1) + 1000, do: 'pulse', el: 'zone-b' },
					{ at: close.start(1) + 1600, do: 'exit', el: 'hl', dur: 400 },
					{ at: close.start(1) + 2200, do: 'exit', el: 'p', dur: 600 },
				),
			},
		},
	],
};
