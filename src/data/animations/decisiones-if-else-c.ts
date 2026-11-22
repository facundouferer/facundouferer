import type { AnimationScript, MotionCue, Subtitle } from './types';

// "One path per condition": a short film (about two minutes) for the C lesson
// "If-Else" (`sentencia-if-else`). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/decisiones-if-else-c.astro`):
// every program of the lesson is a district of isometric track, every instruction a
// module with its editor line, every `if` a fork where the condition is evaluated and
// one branch is taken. A light blue particle is the flow of execution and the route it
// takes lights up behind it. The editor on the left shows the program of the district
// in view, with a bar that slides to the running line, so every step is a motion step.

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
 * Turns the page of the editor and moves the camera to the next district: the
 * particle and the bar leave, the new program and its track appear, and both
 * come back at line 4 of the new program.
 */
function nextProgram(from: string, to: string, leftovers: string[]): MotionCue[] {
	return [
		{ at: 0, do: 'exit', el: 'p', dur: 400 },
		{ at: 0, do: 'exit', el: 'hl', dur: 400 },
		{ at: 0, do: 'exit', el: `pg-${from}`, dur: 400 },
		...leftovers.map((el): MotionCue => ({ at: 0, do: 'exit', el, dur: 400 })),
		shot(300, `shot-${to}`, 2400),
		{ at: 500, do: 'enter', el: `pg-${to}`, dur: 700 },
		{ at: 600, do: 'move', el: 'p', to: `a-${to}4`, dur: 1 },
		{ at: 600, do: 'move', el: 'hl', to: 'ln-4', dur: 1 },
		{ at: 900, do: 'enter', el: `dist-${to}`, dur: 1000 },
		{ at: 2200, do: 'enter', el: 'p' },
		{ at: 2200, do: 'enter', el: 'hl' },
		{ at: 2300, do: 'enter', el: `on-${to}4` },
		{ at: 2300, do: 'pulse', el: `m-${to}4` },
	];
}

// ─── Captions ───────────────────────────────────────────────────────────────
const fork = timed(
	say('La partícula es el flujo; cada módulo, una instrucción con su línea.', 'The particle is the flow; each module, an instruction with its line.'),
	say('En la línea 6, el `if` es una bifurcación: primero evalúa la condición.', 'At line 6 the `if` is a fork: first it evaluates the condition.'),
	say('`numero % 2 == 0` vale 0. En C, 0 es falso y cualquier otro valor es verdadero.', '`number % 2 == 0` is 0. In C, 0 is false and any other value is true.'),
);
const alternative = timed(
	say('`else` agrega el camino alternativo: la línea 9 muestra "El número es impar".', '`else` adds the alternative path: line 9 prints "The number is odd".'),
	say('La línea 7 se salta. Con `if-else` siempre corre exactamente uno de los dos bloques.', 'Line 7 is skipped. With `if-else`, exactly one of the two blocks always runs.'),
);
const chain = timed(
	say('`else if` encadena bifurcaciones que se evalúan en orden, de arriba hacia abajo.', '`else if` chains forks that are evaluated in order, from top to bottom.'),
	say('Con `nota` en 8, las líneas 6 y 8 dan falso; la 10 da verdadero: "Aprobado".', 'With `grade` at 8, lines 6 and 8 are false; line 10 is true: "Pass".'),
	say('Solo corre la primera verdadera; el resto no se evalúa: el orden importa.', 'Only the first true one runs; the rest are not evaluated: order matters.'),
);
const nested = timed(
	say('Un `if` anidado está dentro de otro: solo se alcanza si el primero fue verdadero.', 'A nested `if` sits inside another: it is reached only if the first one was true.'),
	say('Con `numero` en 0, la línea 6 da verdadero y la 7 también: "El número es cero".', 'With `number` at 0, line 6 is true and so is line 7: "The number is zero".'),
);
const assign = timed(
	say('Dos errores clásicos: este `if` debería dejar votar solo desde los 16.', 'Two classic bugs: this `if` should let only ages 16 and up vote.'),
	say('`edad = 16` es una asignación: guarda 16 en `edad`, que valía 12.', '`age = 16` is an assignment: it stores 16 in `age`, which was 12.'),
	say('La condición vale lo asignado: 16, distinto de cero, así que es siempre verdadera.', 'The condition is worth the assigned value: 16, nonzero, so it is always true.'),
);
const semicolon = timed(
	say('El `;` termina el `if` con una sentencia vacía: es lo único que controla.', 'The `;` ends the `if` with an empty statement: that is all it controls.'),
	say('El bloque de abajo ya no pertenece al `if`: se ejecuta siempre.', 'The block below no longer belongs to the `if`: it always runs.'),
	say('Con 12 años muestra "Puede votar". La corrección: `if (edad >= 16)` sin `;`.', 'At 12 it prints "May vote". The fix: `if (age >= 16)` with no `;`.'),
);
const guard = timed(
	say('`&&` pone dos compuertas: `personas != 0` da falso y no evalúa el lado derecho.', '`&&` sets two gates: `people != 0` is false, so it does not evaluate the right side.'),
	say('La división nunca se ejecuta y el `else` muestra su mensaje. La guarda va a la izquierda.', 'The division never runs and the `else` prints its message. The guard goes on the left.'),
);
const close = timed(
	say('Cada `if` evalúa su condición y el programa toma un solo camino.', 'Each `if` evaluates its condition and the program takes only one path.'),
	say('Compila siempre con advertencias: `=` y el `;` suelto compilan sin errores.', 'Always compile with warnings: `=` and a stray `;` compile without errors.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'if', label: { es: 'Una bifurcación', en: 'A fork' } },
		{ id: 'else', label: { es: 'El camino alternativo', en: 'The other path' } },
		{ id: 'chain', label: { es: 'Bifurcaciones en cadena', en: 'Chained forks' } },
		{ id: 'nested', label: { es: 'Una decisión dentro de otra', en: 'A decision inside another' } },
		{ id: 'bugs', label: { es: 'Dos errores clásicos', en: 'Two classic bugs' } },
		{ id: 'guard', label: { es: 'La guarda de &&', en: 'The && guard' } },
	],
	steps: [
		// ─── Scene 1. A fork ────────────────────────────────────────────────
		{
			id: 'fork',
			chapter: 'if',
			scene: 'journey',
			title: { es: 'El if es una bifurcación', en: 'The if is a fork' },
			subtitles: fork.list,
			motion: {
				cues: seq(
					shot(0, 'shot-a', 4000),
					{ at: 300, do: 'enter', el: 'dist-a', dur: 1000 },
					{ at: 1600, do: 'enter', el: 'p' },
					{ at: 1600, do: 'enter', el: 'hl' },
					{ at: 1800, do: 'enter', el: 'on-a4' },
					{ at: 1800, do: 'pulse', el: 'm-a4' },
					{ at: 2200, do: 'enter', el: 'v-a5' },
					{ at: 2600, do: 'pulse', el: 'c-a' },
					{ at: fork.start(1), do: 'exit', el: 'on-a4', dur: 400 },
					travel(fork.start(1) + 200, { to: 'a-a6', line: 6, dur: 1000, run: 'run-a-in' }),
					{ at: fork.start(1) + 1200, do: 'enter', el: 'on-a6' },
					{ at: fork.start(1) + 1300, do: 'pulse', el: 'm-a6' },
					{ at: fork.start(1) + 1800, do: 'enter', el: 'q-a6' },
					shot(fork.start(2), 'shot-a-fork', 1800),
					{ at: fork.start(2) + 1400, do: 'enter', el: 'r-a6' },
					{ at: fork.start(2) + 2400, do: 'pulse', el: 'r-a6' },
					{ at: fork.start(2) + 3000, do: 'pulse', el: 'm-a6' },
				),
			},
		},

		// ─── Scene 2. The other path ────────────────────────────────────────
		{
			id: 'else',
			chapter: 'else',
			scene: 'journey',
			title: { es: 'else: el otro camino', en: 'else: the other path' },
			subtitles: alternative.list,
			motion: {
				cues: seq(
					shot(0, 'shot-a', 1600),
					{ at: 200, do: 'exit', el: 'q-a6', dur: 400 },
					{ at: 200, do: 'move', el: 'hl', to: 'ln-8', dur: 500 },
					travel(900, { to: 'a-a9', line: 9, dur: 1000, run: 'run-a-f1' }),
					{ at: 1900, do: 'exit', el: 'on-a6', dur: 400 },
					{ at: 1900, do: 'enter', el: 'on-a9' },
					{ at: 1900, do: 'pulse', el: 'm-a9' },
					{ at: 2200, do: 'type', el: 'out-a', dur: 1000 },
					{ at: alternative.start(1) + 200, do: 'enter', el: 'skip-a7' },
					{ at: alternative.start(1) + 800, do: 'pulse', el: 'm-a7' },
					{ at: alternative.start(1) + 1400, do: 'exit', el: 'on-a9', dur: 400 },
					travel(alternative.start(1) + 1600, { to: 'a-a12', line: 12, dur: 1000, run: 'run-a-f2' }),
					{ at: alternative.start(1) + 2600, do: 'enter', el: 'on-a12' },
				),
			},
		},

		// ─── Scene 3. Chained forks ─────────────────────────────────────────
		{
			id: 'chain',
			chapter: 'chain',
			scene: 'journey',
			title: { es: 'Una cadena else if', en: 'An else if chain' },
			subtitles: chain.list,
			motion: {
				cues: seq(
					nextProgram('a', 'b', ['on-a12', 'out-a', 'skip-a7', 'r-a6']),
					{ at: 2600, do: 'enter', el: 'v-b8' },
					{ at: 3000, do: 'pulse', el: 'c-b' },
					{ at: chain.start(1), do: 'exit', el: 'on-b4', dur: 400 },
					travel(chain.start(1) + 100, { to: 'a-b6', line: 6, dur: 800, run: 'run-b-1' }),
					{ at: chain.start(1) + 900, do: 'enter', el: 'on-b6' },
					{ at: chain.start(1) + 1100, do: 'enter', el: 'r-b6' },
					{ at: chain.start(1) + 1700, do: 'exit', el: 'on-b6', dur: 400 },
					travel(chain.start(1) + 1700, { to: 'a-b8', line: 8, dur: 800, run: 'run-b-2' }),
					{ at: chain.start(1) + 2500, do: 'enter', el: 'on-b8' },
					{ at: chain.start(1) + 2700, do: 'enter', el: 'r-b8' },
					{ at: chain.start(1) + 3300, do: 'exit', el: 'on-b8', dur: 400 },
					travel(chain.start(1) + 3300, { to: 'a-b10', line: 10, dur: 800, run: 'run-b-3' }),
					{ at: chain.start(1) + 4100, do: 'enter', el: 'on-b10' },
					{ at: chain.start(1) + 4300, do: 'enter', el: 'r-b10' },
					travel(chain.start(1) + 4700, { to: 'a-b11', line: 11, dur: 800, run: 'run-b-t' }),
					{ at: chain.start(1) + 5500, do: 'exit', el: 'on-b10', dur: 400 },
					{ at: chain.start(1) + 5500, do: 'enter', el: 'on-b11' },
					{ at: chain.start(1) + 5600, do: 'type', el: 'out-b', dur: 500 },
					{ at: chain.start(2) + 1000, do: 'enter', el: 'skip-b13' },
					{ at: chain.start(2) + 1600, do: 'pulse', el: 'm-b13' },
					{ at: chain.start(2) + 2000, do: 'exit', el: 'on-b11', dur: 400 },
					travel(
						chain.start(2) + 2200,
						{ to: 'k-b-k11', dur: 600, run: 'run-b-out', runDur: 2400 },
						{ to: 'k-b-kend', dur: 1200 },
						{ to: 'a-b16', line: 16, dur: 600 },
					),
					{ at: chain.start(2) + 4600, do: 'enter', el: 'on-b16' },
				),
			},
		},

		// ─── Scene 4. A decision inside another ─────────────────────────────
		{
			id: 'nested',
			chapter: 'nested',
			scene: 'journey',
			title: { es: 'Un if dentro de otro', en: 'An if inside another' },
			subtitles: nested.list,
			motion: {
				cues: seq(
					nextProgram('b', 'c', ['on-b16', 'out-b', 'skip-b13', 'r-b6', 'r-b8', 'r-b10']),
					{ at: 2500, do: 'enter', el: 'v-c0' },
					{ at: 3000, do: 'enter', el: 'nest-c', dur: 800 },
					{ at: 3400, do: 'enter', el: 'lb-nest' },
					{ at: nested.start(1), do: 'exit', el: 'on-c4', dur: 400 },
					travel(nested.start(1) + 100, { to: 'a-c6', line: 6, dur: 800, run: 'run-c-1' }),
					{ at: nested.start(1) + 900, do: 'enter', el: 'on-c6' },
					{ at: nested.start(1) + 1100, do: 'enter', el: 'r-c6' },
					shot(nested.start(1) + 1500, 'shot-c-in', 1600),
					{ at: nested.start(1) + 1700, do: 'exit', el: 'on-c6', dur: 400 },
					travel(nested.start(1) + 1700, { to: 'a-c7', line: 7, dur: 900, run: 'run-c-2' }),
					{ at: nested.start(1) + 2600, do: 'enter', el: 'on-c7' },
					{ at: nested.start(1) + 2800, do: 'enter', el: 'r-c7' },
					{ at: nested.start(1) + 3400, do: 'exit', el: 'on-c7', dur: 400 },
					travel(nested.start(1) + 3400, { to: 'a-c8', line: 8, dur: 800, run: 'run-c-3' }),
					{ at: nested.start(1) + 4200, do: 'enter', el: 'on-c8' },
					{ at: nested.start(1) + 4300, do: 'type', el: 'out-c', dur: 800 },
					{ at: nested.start(1) + 4600, do: 'enter', el: 'skip-c13' },
					shot(nested.start(1) + 4600, 'shot-c', 1600),
					{ at: nested.start(1) + 5000, do: 'exit', el: 'on-c8', dur: 400 },
					travel(
						nested.start(1) + 5000,
						{ to: 'k-c-k8', dur: 400, run: 'run-c-out', runDur: 1800 },
						{ to: 'k-c-kj', dur: 400 },
						{ to: 'k-c-kj2', dur: 500 },
						{ to: 'a-c16', line: 16, dur: 500 },
					),
					{ at: nested.start(1) + 6800, do: 'enter', el: 'on-c16' },
				),
			},
		},

		// ─── Scene 5. Two classic bugs ──────────────────────────────────────
		{
			id: 'assign',
			chapter: 'bugs',
			scene: 'journey',
			title: { es: '= no es ==', en: '= is not ==' },
			subtitles: assign.list,
			motion: {
				cues: seq(
					nextProgram('c', 'd', ['on-c16', 'out-c', 'r-c6', 'r-c7', 'skip-c13', 'lb-nest']),
					{ at: 2500, do: 'enter', el: 'v-d12' },
					{ at: 2900, do: 'pulse', el: 'c-d' },
					{ at: assign.start(1), do: 'enter', el: 'hx-d6' },
					{ at: assign.start(1) + 200, do: 'exit', el: 'on-d4', dur: 400 },
					travel(assign.start(1) + 300, { to: 'a-d6', line: 6, dur: 900, run: 'run-d-in' }),
					{ at: assign.start(1) + 1200, do: 'enter', el: 'on-d6' },
					{ at: assign.start(1) + 1400, do: 'enter', el: 'q-d6' },
					// The assignment writes 16 into the variable: the same cell changes state.
					{ at: assign.start(1) + 2000, do: 'draw', el: 'fl-d-assign', dur: 900 },
					{ at: assign.start(1) + 2900, do: 'exit', el: 'v-d12', dur: 300 },
					{ at: assign.start(1) + 3100, do: 'enter', el: 'v-d16' },
					{ at: assign.start(1) + 3300, do: 'pulse', el: 'c-d' },
					{ at: assign.start(2) + 600, do: 'enter', el: 'r-d6' },
					{ at: assign.start(2) + 1200, do: 'pulse', el: 'm-d6' },
					{ at: assign.start(2) + 1800, do: 'type', el: 'w-d1', dur: 900 },
					{ at: assign.start(2) + 2700, do: 'type', el: 'w-d1b', dur: 700 },
				),
			},
		},
		{
			id: 'semicolon',
			chapter: 'bugs',
			scene: 'journey',
			title: { es: 'Un ; que vacía el if', en: 'A ; that empties the if' },
			subtitles: semicolon.list,
			motion: {
				cues: seq(
					shot(0, 'shot-d-fork', 1800),
					{ at: 0, do: 'exit', el: 'fl-d-assign', dur: 400 },
					{ at: 800, do: 'enter', el: 'semi-d', dur: 800 },
					{ at: 1700, do: 'pulse', el: 'semi-d' },
					{ at: 1900, do: 'enter', el: 'lb-d-empty' },
					{ at: 2300, do: 'type', el: 'w-d2', dur: 900 },
					travel(3000, { to: 'a-ds', dur: 800, run: 'run-d-t' }),
					{ at: semicolon.start(1), do: 'exit', el: 'on-d6', dur: 400 },
					{ at: semicolon.start(1), do: 'exit', el: 'lb-d-empty', dur: 400 },
					{ at: semicolon.start(1) + 200, do: 'move', el: 'hl', to: 'ln-7', dur: 500 },
					travel(
						semicolon.start(1) + 200,
						{ to: 'k-d-ks', dur: 600, run: 'run-d-t2', runDur: 2000 },
						{ to: 'k-d-m', dur: 600 },
						{ to: 'a-d8', line: 8, dur: 800 },
					),
					{ at: semicolon.start(1) + 2200, do: 'enter', el: 'on-d8' },
					{ at: semicolon.start(1) + 2400, do: 'enter', el: 'lb-d-always' },
					// The false branch lands on the same block: it runs either way.
					{ at: semicolon.start(1) + 3000, do: 'enter', el: 'run-d-f', dur: 800 },
					{ at: semicolon.start(1) + 3400, do: 'pulse', el: 'm-d8' },
					{ at: semicolon.start(2) + 200, do: 'type', el: 'out-d', dur: 600 },
					shot(semicolon.start(2) + 800, 'shot-d', 1600),
					{ at: semicolon.start(2) + 1800, do: 'enter', el: 'fix-d' },
					{ at: semicolon.start(2) + 2400, do: 'exit', el: 'on-d8', dur: 400 },
					travel(semicolon.start(2) + 2400, { to: 'a-d11', line: 11, dur: 900, run: 'run-d-end' }),
					{ at: semicolon.start(2) + 3300, do: 'enter', el: 'on-d11' },
				),
			},
		},

		// ─── Scene 6. The && guard, and the whole map ───────────────────────
		{
			id: 'guard',
			chapter: 'guard',
			scene: 'journey',
			title: { es: '&& protege la división', en: '&& guards the division' },
			subtitles: guard.list,
			motion: {
				cues: seq(
					nextProgram('d', 'e', ['hx-d6', 'on-d11', 'out-d', 'w-d1', 'w-d1b', 'w-d2', 'q-d6', 'r-d6', 'lb-d-always', 'fix-d']),
					{ at: 2500, do: 'enter', el: 'v-e120' },
					{ at: 2800, do: 'exit', el: 'on-e4', dur: 400 },
					travel(2800, { to: 'a-e5', line: 5, dur: 700, run: 'run-e-1' }),
					{ at: 3500, do: 'enter', el: 'on-e5' },
					{ at: 3700, do: 'enter', el: 'v-e0' },
					// The particle reaches the guard just as the caption names it.
					{ at: 4000, do: 'exit', el: 'on-e5', dur: 400 },
					travel(4100, { to: 'a-e7', line: 7, dur: 800, run: 'run-e-2' }),
					{ at: 4900, do: 'enter', el: 'on-e7' },
					{ at: 5000, do: 'enter', el: 'q-e7' },
					{ at: 5500, do: 'enter', el: 'r-e7' },
					shot(5700, 'shot-e-gate', 1400),
					{ at: 6300, do: 'enter', el: 'hz-e' },
					{ at: 6800, do: 'enter', el: 'skip-e' },
					{ at: 7200, do: 'pulse', el: 'm-e7b' },
					shot(guard.start(1) + 1300, 'shot-e', 1600),
					{ at: guard.start(1) + 1500, do: 'exit', el: 'on-e7', dur: 400 },
					{ at: guard.start(1) + 1500, do: 'move', el: 'hl', to: 'ln-9', dur: 500 },
					travel(guard.start(1) + 2200, { to: 'a-e10', line: 10, dur: 1000, run: 'run-e-f' }),
					{ at: guard.start(1) + 3200, do: 'enter', el: 'on-e10' },
					{ at: guard.start(1) + 3300, do: 'type', el: 'out-e', dur: 1400 },
					{ at: guard.start(1) + 4800, do: 'exit', el: 'on-e10', dur: 400 },
					travel(guard.start(1) + 4800, { to: 'a-e13', line: 13, dur: 700, run: 'run-e-end' }),
					{ at: guard.start(1) + 5500, do: 'enter', el: 'on-e13' },
				),
			},
		},
		{
			id: 'close',
			chapter: 'guard',
			scene: 'journey',
			title: { es: 'Un solo camino por condición', en: 'One path per condition' },
			subtitles: close.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'q-e7', dur: 400 },
					{ at: 0, do: 'exit', el: 'r-e7', dur: 400 },
					{ at: 0, do: 'exit', el: 'hz-e', dur: 400 },
					{ at: 0, do: 'exit', el: 'skip-e', dur: 400 },
					// The camera pulls back to reveal every program as one map of decisions.
					shot(200, 'shot-all', 3800),
					{ at: 1500, do: 'enter', el: 'tag-a' },
					{ at: 1800, do: 'enter', el: 'tag-b' },
					{ at: 2100, do: 'enter', el: 'tag-c' },
					{ at: 2400, do: 'enter', el: 'tag-d' },
					{ at: 2700, do: 'enter', el: 'tag-e' },
					{ at: 2000, do: 'flow', el: 'run-a-f1' },
					{ at: 2000, do: 'flow', el: 'run-a-f2' },
					{ at: 2200, do: 'flow', el: 'run-b-out' },
					{ at: 2400, do: 'flow', el: 'run-c-out' },
					{ at: 2600, do: 'flow', el: 'run-d-t2' },
					{ at: 2800, do: 'flow', el: 'run-e-f' },
					{ at: 3400, do: 'pulse', el: 'm-a6' },
					{ at: 3600, do: 'pulse', el: 'm-b10' },
					{ at: 3800, do: 'pulse', el: 'm-c7' },
					{ at: 4000, do: 'pulse', el: 'm-e7' },
					{ at: close.start(1) + 400, do: 'enter', el: 'lb-wall' },
					{ at: close.start(1) + 1000, do: 'pulse', el: 'm-d6' },
					{ at: close.start(1) + 1600, do: 'exit', el: 'hl', dur: 400 },
					{ at: close.start(1) + 2200, do: 'exit', el: 'p', dur: 600 },
				),
			},
		},
	],
};
