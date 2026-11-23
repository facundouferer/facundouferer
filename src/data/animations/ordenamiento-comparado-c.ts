import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Three ways to sort": a short film (about two minutes) for the C lesson "Ordenación de
// Arreglos". It plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/ordenamiento-comparado-c.astro`): the programs on the left,
// and on the right the same array of six numbers three times, each one a row of isometric
// bars (the height is the value) on floor tiles that carry the index. Pins are the
// indexes, a lit top marks the elements being compared, a violet tile marks what is in
// place, and two strips of small tiles count comparisons and swaps (or shifts). One module
// per instruction stands in front of each row, labelled with its editor line, and the
// light blue particle is the execution flow. Magenta marks the problem (growth by
// squares, the swap that reorders equal records); violet what resolves it.

const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

/**
 * Pins captions on the step timeline: each one starts once the previous has been
 * read (same formula as `subtitleReadingTime`, for the slower locale) plus a pause,
 * or at its own minimum time when the cues need it later.
 */
const readingMs = (sub: Subtitle) => 1200 + Math.max(sub.text.es.length, sub.text.en.length) * 55;
function timed(...entries: (Subtitle | [Subtitle, number])[]) {
	let cursor = 0;
	const starts: number[] = [];
	const list = entries.map((entry) => {
		const [sub, min] = Array.isArray(entry) ? entry : [entry, 0];
		const at = Math.max(cursor, min);
		starts.push(at);
		cursor = at + readingMs(sub) + 200;
		return { ...sub, at } as Subtitle;
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

const enter = (at: number, el: string, dur?: number): MotionCue => ({ at, do: 'enter', el, ...(dur ? { dur } : {}) });
const exit = (at: number, el: string, dur = 350): MotionCue => ({ at, do: 'exit', el, dur });
const pulse = (at: number, el: string, dur = 500): MotionCue => ({ at, do: 'pulse', el, dur });
const type = (at: number, el: string, dur = 700): MotionCue => ({ at, do: 'type', el, dur });
const move = (at: number, el: string, to: string, dur = 600, dy?: number): MotionCue => ({ at, do: 'move', el, to, dur, ...(dy === undefined ? {} : { dy }) });
const reveal = (at: number, gap: number, ...els: string[]): MotionCue[] => els.map((el, index) => enter(at + index * gap, el));
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => exit(at, el, 400));

// ─── The array and the sorts ────────────────────────────────────────────────
// Bars are named after the row and their original index: `ba3` is the 37 of row `a`.
// Slots are the floor tiles. The simulations below are the lesson's own algorithms, run
// on the array to know which bar sits where after every comparison.

export const VALUES = [29, 10, 14, 37, 13, 5];
export const RECORDS = [7, 7, 5];
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

type Cmp = { j: number; bar: number; other: number; hit: boolean };
type Pass = { i: number; cmps: Cmp[]; dest: number; before: number[]; after: number[] };

/** Bubble sort with early exit. `hit` is "swapped"; `bar` is v[j] and `other` is v[j + 1]. */
export function simBubble(values: number[]): Pass[] {
	const order = range(values.length);
	const passes: Pass[] = [];
	for (let pass = 0; pass < values.length - 1; pass++) {
		const before = [...order];
		const cmps: Cmp[] = [];
		for (let j = 0; j < values.length - 1 - pass; j++) {
			const bar = order[j];
			const other = order[j + 1];
			const hit = values[bar] > values[other];
			cmps.push({ j, bar, other, hit });
			if (hit) [order[j], order[j + 1]] = [other, bar];
		}
		passes.push({ i: pass, cmps, dest: values.length - 1 - pass, before, after: [...order] });
		if (!cmps.some((cmp) => cmp.hit)) break;
	}
	return passes;
}

/** Selection sort. `bar` is v[j], `other` is v[min] and `hit` is "v[j] < v[min]"; `dest` is the final min. */
export function simSelection(values: number[]): Pass[] {
	const order = range(values.length);
	const passes: Pass[] = [];
	for (let i = 0; i < values.length - 1; i++) {
		const before = [...order];
		let min = i;
		const cmps: Cmp[] = [];
		for (let j = i + 1; j < values.length; j++) {
			const hit = values[order[j]] < values[order[min]];
			cmps.push({ j, bar: order[j], other: order[min], hit });
			if (hit) min = j;
		}
		[order[i], order[min]] = [order[min], order[i]];
		passes.push({ i, cmps, dest: min, before, after: [...order] });
	}
	return passes;
}

/** Insertion sort. `bar` is v[j], `other` is the element being inserted and `hit` is "v[j] > actual"; `dest` is its final slot. */
export function simInsertion(values: number[]): Pass[] {
	const order = range(values.length);
	const passes: Pass[] = [];
	for (let i = 1; i < values.length; i++) {
		const before = [...order];
		const actual = order[i];
		const cmps: Cmp[] = [];
		let j = i - 1;
		while (j >= 0) {
			const hit = values[order[j]] > values[actual];
			cmps.push({ j, bar: order[j], other: actual, hit });
			if (!hit) break;
			order[j + 1] = order[j];
			j--;
		}
		order[j + 1] = actual;
		passes.push({ i, cmps, dest: j + 1, before, after: [...order] });
	}
	return passes;
}

const bubble = simBubble(VALUES);
const selection = simSelection(VALUES);
const insertion = simInsertion(VALUES);
const selectionRecords = simSelection(RECORDS);
const insertionRecords = simInsertion(RECORDS);

// ─── Timeline builder ───────────────────────────────────────────────────────
function timeline() {
	const cues: MotionCue[] = [];
	let now = 0;
	const api = {
		get t() {
			return now;
		},
		set t(value: number) {
			now = value;
		},
		add(...list: (MotionCue | MotionCue[])[]) {
			cues.push(...list.flat());
			return api;
		},
		wait(ms: number) {
			now += ms;
			return api;
		},
		until(ms: number) {
			now = Math.max(now, ms);
			return api;
		},
		done: () => seq(cues),
	};
	return api;
}
type Timeline = ReturnType<typeof timeline>;

const BUILD = 460;
const HOP = 140;

/**
 * Runs the instruction of module `key` (row letter + editor line): slides the bar to its
 * line, builds the module the first time, sends the particle to it and lights it.
 * Later runs only hop: the bar moves, the particle follows and the module pulses.
 */
function exec(T: Timeline, key: string, mode: 'build' | 'hop' = 'hop') {
	const line = key.slice(1);
	const t = T.t;
	const build = mode === 'build';
	const travel = build ? 300 : 100;
	T.add(
		move(t, 'hl', `ln-${line}`, build ? 260 : 110),
		...(build ? [enter(t + 40, `m-${key}`)] : []),
		move(t + 40, 'px', `a-m${key}`, travel),
		build ? enter(t + 40 + travel, `on-${key}`) : pulse(t + 40 + travel, `m-${key}`, 250),
	);
	T.wait(build ? BUILD : HOP);
}

const bar = (row: string, id: number) => `b${row}${id}`;
const slot = (row: string, k: number) => `a-s${row}${k}`;
const rail = (row: string, k: number) => `a-p${row}${k}`;
const LIFT = -78;

/** Lights the tops of the bars that are being compared. */
const flash = (at: number, row: string, bars: number[], hold: number): MotionCue[] =>
	bars.flatMap((id) => [enter(at, `lit-${bar(row, id)}`, 200), exit(at + hold, `lit-${bar(row, id)}`, 250)]);

// Tally strips: every comparison and every swap (or shift) lights the next small tile.
const ticks = { a: { c: 0, s: 0 }, b: { c: 0, s: 0 }, c: { c: 0, s: 0 } };
type NumberRow = keyof typeof ticks;
const tickC = (at: number, row: NumberRow) => enter(at, `tc-${row}-${ticks[row].c++}`, 250);
const tickS = (at: number, row: NumberRow) => enter(at, `ts-${row}-${ticks[row].s++}`, 250);

/** Brings a row in: its floor tiles, then its bars (and the empty tally strips of the number rows). */
function appearRow(T: Timeline, row: string, count: number, tally: boolean) {
	const t = T.t;
	T.add(reveal(t, 60, ...range(count).map((k) => `fl-${row}${k}`)));
	if (tally) T.add(enter(t + 200, `tally-${row}`));
	const bars = t + count * 60 + 200;
	T.add(reveal(bars, 70, ...range(count).map((k) => bar(row, k))));
	T.t = bars + count * 70 + 250;
}

/** Slots whose bar changes between two arrangements: they glide to their new tile together. */
function regroup(at: number, row: string, from: number[], to: number[], dur = 700): MotionCue[] {
	return to.flatMap((id, k) => (from[k] === id ? [] : [move(at, bar(row, id), slot(row, k), dur)]));
}

/** The instruction modules of every row, by program: each key is the row letter and the editor line. */
const MODULES: Record<string, string[]> = {
	a: ['a2', 'a3', 'a4', 'a8', 'a9', 'a10', 'a11', 'a12', 'a13', 'a16', 'a17'],
	b: ['b2', 'b3', 'b4', 'b8', 'b9', 'b10', 'b11', 'b12', 'b15'],
	c: ['c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c9'],
	d: ['d7', 'd8', 'd9', 'd10', 'd11', 'd14', 'd15', 'd16'],
	e: ['e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e9'],
};
/** Fades the modules of a row away, so the next program has the stage to itself. */
const clearModules = (at: number, row: string): MotionCue[] => clear(at, ...MODULES[row].flatMap((key) => [`m-${key}`, `on-${key}`]));
/** Brings some modules of a row back, already lit, for a program that runs again. */
const showModules = (at: number, ...keys: string[]): MotionCue[] => keys.flatMap((key, index) => [enter(at + index * 60, `m-${key}`), enter(at + index * 60, `on-${key}`)]);

const swapPages = (at: number, from: string, to: string): MotionCue[] => [exit(at, from, 300), enter(at + 150, to, 300)];

// ─── Captions ───────────────────────────────────────────────────────────────
const sBubble = timed(
	say('`ordenar_burbuja` compara cada par de vecinos: `v[j]` y `v[j + 1]`.', '`bubble_sort` compares each pair of neighbors: `v[j]` and `v[j + 1]`.'),
	say('Si el de la izquierda es mayor, `intercambiar` los cruza.', 'If the left one is larger, `swap` crosses them.'),
	say('Cada pasada fija un mayor: 15 comparaciones y 10 intercambios.', 'Each pass fixes a larger value: 15 comparisons, 10 swaps.'),
);
const sSelection = timed(
	say('`ordenar_seleccion` busca el mínimo de la parte desordenada.', '`selection_sort` looks for the minimum of the unsorted part.'),
	say('`j` compara cada `v[j]` con `v[minimo]`: si es menor, `minimo = j`.', '`j` compares `v[j]` with `v[min]`: if smaller, `min = j`.'),
	say('Un solo `intercambiar` por pasada: `n - 1`, 5 en total.', 'One `swap` per pass: `n - 1`, 5 in all.'),
);
const sInsertion = timed(
	say('`ordenar_insercion` levanta `actual = v[i]` y mira a su izquierda.', '`insertion_sort` lifts `key = v[i]` and looks to its left.'),
	say('Desplaza a la derecha cada elemento mayor que `actual`.', 'It shifts every element larger than `key` to the right.'),
	say('Suelta `actual` en el hueco: la izquierda queda ordenada.', 'It drops `key` in the gap: the left part stays sorted.'),
);
const sGrowth = timed(
	say('Con `n = 6` son 15 comparaciones; con `n = 100`, 4950; con `n = 200`, 19 900.', 'With `n = 6` that is 15 comparisons; with `n = 100`, 4950; with `n = 200`, 19 900.'),
	say('El doble de datos, cuatro veces más trabajo: eso es `O(n²)`.', 'Double the data, four times the work: that is `O(n²)`.'),
);
const sBest = timed(
	say('Con la entrada ya ordenada, burbuja hace una sola pasada.', 'On sorted input, bubble sort makes a single pass.'),
	say('`hubo_intercambio` queda en `false`: el `break` corta en 5.', '`swapped` stays `false`: the `break` stops after 5.'),
	say('Inserción compara con el vecino y no desplaza: 5, `O(n)`.', 'Insertion compares with its neighbor and shifts nothing: 5, `O(n)`.'),
);
const sStabSel = timed(
	say('Un ordenamiento es estable si los iguales conservan su orden.', 'A sort is stable if equal elements keep their order.'),
	say('Por nota, selección cambia a Bea (7) con el mínimo, Ciro (5).', 'By grade, selection swaps Bea (7) with the minimum, Ciro (5).'),
	say('Bea salta sobre Ana: cambian de orden, no es estable.', 'Bea jumps over Ana: they change order, not stable.'),
);
const sStabIns = timed(
	say('Inserción desplaza solo si `v[j].nota > actual.nota`: estricto.', 'Insertion shifts only if `v[j].grade > key.grade`: strict.'),
	say('Ana no desplaza a Bea (7 > 7 es falso); Ciro desplaza a ambas.', 'Ana does not shift Bea (7 > 7 is false); Ciro shifts both.'),
	say('Resultado `Ciro(5) Bea(7) Ana(7)`: inserción es estable.', 'Result `Ciro(5) Bea(7) Ana(7)`: insertion is stable.'),
);
const sVerdict = timed(
	say('Burbuja e inserción solo mueven con `>` estricto: son estables.', 'Bubble and insertion only move on a strict `>`: they are stable.'),
	say('Selección no lo es, pero hace solo `n - 1` intercambios.', 'Selection is not, but makes only `n - 1` swaps.'),
);

// ─── Scene 1. Bubble sort ───────────────────────────────────────────────────
function bubbleStep() {
	const T = timeline();
	T.add(shot(0, 'shot-a', 3000));
	T.add(range(20).map((i): MotionCue => type(150 + i * 70, `ea-${i + 1}`, 220)));
	T.add(enter(1700, 'hl'), enter(1900, 'px'));
	T.t = 1900;
	appearRow(T, 'a', 6, true);
	T.add(type(T.t - 400, 'oa-1'));
	T.until(sBubble.start(0) + 3600);

	// Pass 1 in detail: every instruction runs and builds its module.
	exec(T, 'a8', 'build');
	T.add(enter(T.t + 100, 'v-flag'), enter(T.t + 500, 'fg-false'));
	exec(T, 'a9', 'build');
	T.add(enter(T.t + 300, 'pin-a-j'));
	exec(T, 'a10', 'build');
	for (const cmp of bubble[0].cmps) {
		const first = cmp.j === 0;
		if (!first) {
			T.add(move(T.t, 'pin-a-j', rail('a', cmp.j), 220));
			T.wait(160);
		}
		exec(T, 'a11', first ? 'build' : 'hop');
		T.add(flash(T.t - 120, 'a', [cmp.bar, cmp.other], cmp.hit ? 1500 : 500), tickC(T.t - 120, 'a'));
		if (cmp.hit) {
			const mode = first ? 'build' : 'hop';
			exec(T, 'a12', mode);
			exec(T, 'a2', mode);
			T.add(move(T.t, bar('a', cmp.bar), slot('a', cmp.j + 1), 650), move(T.t, bar('a', cmp.other), slot('a', cmp.j), 650), tickS(T.t + 200, 'a'));
			exec(T, 'a3', mode);
			exec(T, 'a4', mode);
			if (first) T.add(exit(T.t + 100, 'fg-false'), enter(T.t + 300, 'fg-true'));
			exec(T, 'a13', mode);
			T.wait(first ? 100 : 0);
		} else {
			T.wait(250);
		}
	}
	exec(T, 'a16', 'build');
	T.add(enter(T.t, 'st-a5'));
	T.wait(300);

	// The other four passes, quicker: the bars regroup and the strips fill up.
	for (const pass of bubble.slice(1)) {
		exec(T, 'a8', 'hop');
		const base = T.t;
		pass.cmps.forEach((_, index) => T.add(tickC(base + index * 55, 'a')));
		pass.cmps.filter((cmp) => cmp.hit).forEach((_, index) => T.add(tickS(base + 120 + index * 90, 'a')));
		T.add(regroup(base + 150, 'a', pass.before, pass.after, 650));
		T.add(enter(base + 700, `st-a${pass.dest}`));
		T.wait(800);
	}
	T.add(enter(T.t - 500, 'st-a0'), exit(T.t, 'pin-a-j'), enter(T.t + 100, 'ch-a-tc'), enter(T.t + 250, 'ch-a-ts'), type(T.t + 400, 'oa-2'));
	T.wait(1000);
	return T.done();
}

// ─── Scene 2. Selection sort ────────────────────────────────────────────────
function selectionStep() {
	const T = timeline();
	T.add(shot(0, 'shot-b', 2800), swapPages(0, 'ea', 'eb'), clearModules(0, 'a'));
	T.t = 600;
	appearRow(T, 'b', 6, true);
	T.until(sSelection.start(0) + 2200);

	const first = selection[0];
	exec(T, 'b8', 'build');
	T.add(enter(T.t + 300, 'pin-b-i'));
	exec(T, 'b9', 'build');
	T.add(enter(T.t + 300, 'pin-b-m'));
	exec(T, 'b10', 'build');
	T.add(enter(T.t + 300, 'pin-b-j'));
	let firstHit = true;
	for (const cmp of first.cmps) {
		const firstCmp = cmp.j === 1;
		if (!firstCmp) {
			T.add(move(T.t, 'pin-b-j', rail('b', cmp.j), 220));
			T.wait(170);
		}
		exec(T, 'b11', firstCmp ? 'build' : 'hop');
		T.add(flash(T.t - 120, 'b', [cmp.bar, cmp.other], 450), tickC(T.t - 120, 'b'));
		if (cmp.hit) {
			T.add(move(T.t, 'pin-b-m', rail('b', cmp.j), 300));
			exec(T, 'b12', firstHit ? 'build' : 'hop');
			firstHit = false;
		} else {
			T.wait(200);
		}
	}
	exec(T, 'b15', 'build');
	exec(T, 'b2', 'build');
	const min = first.dest;
	T.add(move(T.t, bar('b', first.before[0]), slot('b', min), 700), move(T.t, bar('b', first.before[min]), slot('b', 0), 700), tickS(T.t + 300, 'b'));
	exec(T, 'b3', 'build');
	exec(T, 'b4', 'build');
	T.add(enter(T.t, 'st-b0'), exit(T.t + 200, 'pin-b-j'));
	T.wait(300);

	// The other passes: the minimum is found, one swap, one tile in place.
	for (const pass of selection.slice(1)) {
		exec(T, 'b8', 'hop');
		const base = T.t;
		T.add(move(base, 'pin-b-i', rail('b', pass.i), 300), move(base + 100, 'pin-b-m', rail('b', pass.dest), 300));
		pass.cmps.forEach((_, index) => T.add(tickC(base + index * 55, 'b')));
		T.add(tickS(base + 450, 'b'));
		if (pass.dest === pass.i) T.add(pulse(base + 450, bar('b', pass.before[pass.i]), 600));
		else T.add(move(base + 450, bar('b', pass.before[pass.i]), slot('b', pass.dest), 600), move(base + 450, bar('b', pass.before[pass.dest]), slot('b', pass.i), 600));
		T.add(enter(base + 900, `st-b${pass.i}`));
		T.wait(1000);
	}
	T.add(enter(T.t - 600, 'st-b5'), exit(T.t - 400, 'pin-b-i'), exit(T.t - 400, 'pin-b-m'), enter(T.t, 'ch-b-tc'), enter(T.t + 150, 'ch-b-ts'), type(T.t + 300, 'oa-3'));
	T.wait(1000);
	return T.done();
}

// ─── Scene 3. Insertion sort ────────────────────────────────────────────────
function insertionStep() {
	const T = timeline();
	T.add(shot(0, 'shot-c', 2800), swapPages(0, 'eb', 'ec'), clearModules(0, 'b'));
	T.t = 600;
	appearRow(T, 'c', 6, true);
	T.add(enter(T.t - 500, 'st-c0'));
	T.until(sInsertion.start(0) + 2200);

	// i = 1 in detail.
	const first = insertion[0];
	exec(T, 'c2', 'build');
	T.add(enter(T.t + 300, 'pin-c-i'));
	const actual = first.before[first.i];
	exec(T, 'c3', 'build');
	T.add(move(T.t - 300, bar('c', actual), slot('c', first.i), 500, LIFT));
	exec(T, 'c4', 'build');
	T.add(enter(T.t + 300, 'pin-c-j'));
	for (const cmp of first.cmps) {
		exec(T, 'c5', 'build');
		T.add(flash(T.t - 120, 'c', [cmp.bar, cmp.other], 700), tickC(T.t - 120, 'c'));
		if (cmp.hit) {
			T.add(move(T.t, bar('c', cmp.bar), slot('c', cmp.j + 1), 600), tickS(T.t + 200, 'c'));
			exec(T, 'c6', 'build');
			exec(T, 'c7', 'build');
			if (cmp.j > 0) T.add(move(T.t - 300, 'pin-c-j', rail('c', cmp.j - 1), 250));
			else T.add(exit(T.t - 300, 'pin-c-j'));
		}
	}
	exec(T, 'c5', 'hop');
	exec(T, 'c9', 'build');
	T.add(move(T.t - 400, bar('c', actual), slot('c', first.dest), 600), enter(T.t, `st-c${first.i}`));
	T.wait(300);

	// i = 2 to 5: lift, compare and shift, drop. Each shift is a bar gliding one tile right.
	for (const pass of insertion.slice(1)) {
		const key = pass.before[pass.i];
		exec(T, 'c2', 'hop');
		T.add(move(T.t - 100, 'pin-c-i', rail('c', pass.i), 250));
		exec(T, 'c3', 'hop');
		const base = T.t;
		T.add(move(base - 150, bar('c', key), slot('c', pass.i), 450, LIFT));
		pass.cmps.forEach((cmp, index) => T.add(tickC(base + index * 80, 'c'), flash(base + index * 80, 'c', [cmp.bar], 250)));
		exec(T, 'c5', 'hop');
		const shifted = pass.cmps.filter((cmp) => cmp.hit);
		shifted.forEach((cmp, index) => T.add(move(base + 250 + index * 90, bar('c', cmp.bar), slot('c', cmp.j + 1), 550), tickS(base + 250 + index * 90, 'c')));
		exec(T, 'c6', 'hop');
		T.until(base + 250 + shifted.length * 90 + 450);
		exec(T, 'c9', 'hop');
		T.add(move(T.t - 100, bar('c', key), slot('c', pass.dest), 500), enter(T.t + 300, `st-c${pass.i}`));
		T.wait(450);
	}
	T.add(exit(T.t - 300, 'pin-c-i'), enter(T.t, 'ch-c-tc'), enter(T.t + 150, 'ch-c-ts'), type(T.t + 300, 'oa-4'));
	T.wait(1000);
	return T.done();
}

// ─── Scene 4. Growth ────────────────────────────────────────────────────────
function growthStep() {
	const T = timeline();
	T.add(shot(0, 'shot-all', 2800), clearModules(0, 'c'));
	T.add(pulse(900, 'tally-a', 700), pulse(1500, 'tally-b', 700), pulse(2100, 'tally-c', 700));
	T.add(shot(sGrowth.start(0) + 3200, 'shot-tower', 2600));
	const at = sGrowth.start(0) + 3400;
	T.add(enter(at, 'tw-plate'), enter(at + 500, 'tw-100'), enter(at + 1000, 'ch-n100'));
	T.add(enter(at + 2000, 'tw-200'), enter(at + 2500, 'ch-n200'));
	T.add({ at: sGrowth.start(1) + 400, do: 'draw', el: 'fl-grow', dur: 1200 }, { at: sGrowth.start(1) + 1600, do: 'flow', el: 'fl-grow' }, enter(sGrowth.start(1) + 1800, 'ch-x4'));
	T.add(pulse(sGrowth.start(1) + 3200, 'tw-200', 700));
	return T.done();
}

// ─── Scene 5. Sorted input ──────────────────────────────────────────────────
function bestStep() {
	const T = timeline();
	T.add(shot(0, 'shot-a', 2400), clear(0, 'tw-plate', 'tw-100', 'tw-200', 'ch-n100', 'ch-n200', 'ch-x4', 'fl-grow'), swapPages(0, 'ec', 'ea'), showModules(300, 'a9', 'a10', 'a11', 'a16'));
	T.t = 900;
	// Bubble sort again, on the sorted row.
	const sorted = bubble.at(-1)?.after ?? [];
	exec(T, 'a9', 'hop');
	T.add(exit(T.t - 200, 'fg-true'), enter(T.t - 100, 'fg-false'));
	T.add(move(T.t, 'pin-a-j', rail('a', 0), 1), enter(T.t + 100, 'pin-a-j'));
	exec(T, 'a10', 'hop');
	for (let j = 0; j < 5; j++) {
		if (j > 0) {
			T.add(move(T.t, 'pin-a-j', rail('a', j), 220));
			T.wait(170);
		}
		exec(T, 'a11', 'hop');
		T.add(flash(T.t - 120, 'a', [sorted[j], sorted[j + 1]], 380));
		T.wait(220);
	}
	exec(T, 'a16', 'hop');
	exec(T, 'a17', 'build');
	T.add(enter(T.t - 200, 'ch-brk'), enter(T.t + 100, 'ch-a-best'), exit(T.t + 200, 'pin-a-j'));
	T.until(sBest.start(1) + 2600);

	// Insertion sort: each element is compared once with its neighbor and stays.
	T.add(shot(T.t, 'shot-c', 1500), swapPages(T.t, 'ea', 'ec'), clearModules(T.t, 'a'), showModules(T.t + 300, 'c2', 'c3', 'c5'));
	T.wait(600);
	const rowC = insertion.at(-1)?.after ?? [];
	exec(T, 'c2', 'hop');
	T.add(move(T.t, 'pin-c-i', rail('c', 1), 1), enter(T.t + 100, 'pin-c-i'));
	exec(T, 'c3', 'hop');
	for (let i = 1; i < 6; i++) {
		if (i > 1) {
			T.add(move(T.t, 'pin-c-i', rail('c', i), 220));
			T.wait(170);
		}
		exec(T, 'c5', 'hop');
		T.add(flash(T.t - 120, 'c', [rowC[i - 1], rowC[i]], 380));
		T.wait(200);
	}
	T.add(exit(T.t, 'pin-c-i'), enter(T.t + 100, 'ch-c-best'));
	T.wait(600);

	// Selection sort: always the same strip, whatever the order.
	T.add(shot(T.t, 'shot-b', 1300), pulse(T.t + 800, 'tally-b', 700), enter(T.t + 600, 'ch-b-best'));
	T.wait(1800);
	T.add(shot(T.t, 'shot-tower', 2000), reveal(T.t + 400, 300, 'tw-plate', 'ch-sorted100', 'tw-sb', 'ch-sb', 'tw-ss', 'ch-ss', 'tw-si', 'ch-si'));
	T.wait(2700);
	return T.done();
}

// ─── Scene 6. Stability: selection ──────────────────────────────────────────
function stabSelStep() {
	const T = timeline();
	T.add(shot(0, 'shot-d', 2800), clearModules(0, 'c'), clear(0, 'oa-1', 'oa-2', 'oa-3', 'oa-4', 'tw-sb', 'tw-ss', 'tw-si', 'ch-sb', 'ch-ss', 'ch-si', 'ch-sorted100', 'tw-plate'), swapPages(0, 'ec', 'ed'));
	T.t = 700;
	appearRow(T, 'd', 3, false);
	T.add(flash(T.t - 500, 'd', [0, 1], 1100), enter(T.t - 400, 'ch-d-order'));
	T.until(sStabSel.start(0) + 3000);

	const pass0 = selectionRecords[0];
	exec(T, 'd7', 'build');
	exec(T, 'd8', 'build');
	exec(T, 'd9', 'build');
	for (const cmp of pass0.cmps) {
		exec(T, 'd10', cmp.j === 1 ? 'build' : 'hop');
		T.add(flash(T.t - 120, 'd', [cmp.bar, cmp.other], 550));
		if (cmp.hit) exec(T, 'd11', 'build');
		else T.wait(250);
	}
	exec(T, 'd14', 'build');
	exec(T, 'd15', 'build');
	T.add(move(T.t - 300, bar('d', pass0.before[0]), slot('d', pass0.dest), 750), move(T.t - 300, bar('d', pass0.before[pass0.dest]), slot('d', 0), 750));
	exec(T, 'd16', 'build');
	T.add(enter(T.t, 'hot-bd0'), enter(T.t + 200, 'hot-bd1'), enter(T.t + 600, 'ch-d-jump'));
	T.until(sStabSel.start(2) + 200);

	// The second pass leaves Ana and Bea where they are: Bea is now behind Ana.
	for (const key of ['d7', 'd8', 'd10', 'd14', 'd15', 'd16']) exec(T, key, 'hop');
	T.add(type(T.t, 'os-1'), enter(T.t + 700, 'ch-d-unstable'));
	T.wait(1200);
	return T.done();
}

// ─── Scene 7. Stability: insertion ──────────────────────────────────────────
function stabInsStep() {
	const T = timeline();
	T.add(shot(0, 'shot-e', 2800), swapPages(0, 'ed', 'ee'), clearModules(0, 'd'), clear(0, 'ch-d-jump', 'ch-d-unstable', 'ch-d-order'));
	T.t = 700;
	appearRow(T, 'e', 3, false);
	T.add(enter(T.t - 400, 'ch-e-order'));
	T.until(sStabIns.start(0) + 2600);

	const [pass1, pass2] = insertionRecords;
	const ana = pass1.before[pass1.i];
	exec(T, 'e2', 'build');
	exec(T, 'e3', 'build');
	T.add(move(T.t - 300, bar('e', ana), slot('e', pass1.i), 500, LIFT));
	exec(T, 'e4', 'build');
	exec(T, 'e5', 'build');
	T.add(flash(T.t - 120, 'e', [pass1.cmps[0].bar, ana], 1300), enter(T.t + 100, 'ch-e-strict'));
	T.wait(500);
	exec(T, 'e9', 'build');
	T.add(move(T.t - 400, bar('e', ana), slot('e', pass1.dest), 550));
	T.until(sStabIns.start(1) + 600);

	const ciro = pass2.before[pass2.i];
	exec(T, 'e2', 'hop');
	exec(T, 'e3', 'hop');
	T.add(move(T.t - 200, bar('e', ciro), slot('e', pass2.i), 500, LIFT));
	exec(T, 'e4', 'hop');
	pass2.cmps.forEach((cmp, index) => {
		exec(T, 'e5', 'hop');
		T.add(flash(T.t - 120, 'e', [cmp.bar, ciro], 450));
		T.add(move(T.t, bar('e', cmp.bar), slot('e', cmp.j + 1), 550));
		exec(T, 'e6', index === 0 ? 'build' : 'hop');
		exec(T, 'e7', index === 0 ? 'build' : 'hop');
	});
	exec(T, 'e5', 'hop');
	exec(T, 'e9', 'hop');
	T.add(move(T.t - 300, bar('e', ciro), slot('e', pass2.dest), 600));
	T.until(sStabIns.start(2));
	T.add(type(T.t, 'os-2'), enter(T.t + 700, 'ch-e-stable'));
	T.wait(1200);
	return T.done();
}

// ─── Scene 8. Verdict ───────────────────────────────────────────────────────
function verdictStep() {
	const T = timeline();
	T.add(shot(0, 'shot-all', 3000), clearModules(0, 'e'), clear(0, 'ch-a-best', 'ch-b-best', 'ch-c-best', 'ch-brk', 'ch-d-order', 'ch-d-jump', 'ch-d-unstable', 'ch-e-order', 'ch-e-strict', 'ch-e-stable', 'v-flag', 'fg-false', 'fg-true', 'px'));
	T.add(enter(1200, 'ch-v-a'), enter(2200, 'ch-v-b'), enter(3200, 'ch-v-c'));
	T.add(pulse(sVerdict.start(1) + 600, 'tally-b', 800), pulse(sVerdict.start(1) + 600, 'st-b5', 800));
	return T.done();
}

export const script: AnimationScript = {
	chapters: [
		{ id: 'bubble', label: { es: 'Burbuja', en: 'Bubble sort' } },
		{ id: 'selection', label: { es: 'Selección', en: 'Selection sort' } },
		{ id: 'insertion', label: { es: 'Inserción', en: 'Insertion sort' } },
		{ id: 'growth', label: { es: 'Crecimiento', en: 'Growth' } },
		{ id: 'best', label: { es: 'Entrada ordenada', en: 'Sorted input' } },
		{ id: 'stable', label: { es: 'Estabilidad', en: 'Stability' } },
	],
	steps: [
		{
			id: 'bubble',
			chapter: 'bubble',
			scene: 'journey',
			title: { es: 'Burbuja: comparar vecinos', en: 'Bubble sort: comparing neighbors' },
			subtitles: sBubble.list,
			motion: { cues: bubbleStep() },
		},
		{
			id: 'selection',
			chapter: 'selection',
			scene: 'journey',
			title: { es: 'Selección: un intercambio por pasada', en: 'Selection sort: one swap per pass' },
			subtitles: sSelection.list,
			motion: { cues: selectionStep() },
		},
		{
			id: 'insertion',
			chapter: 'insertion',
			scene: 'journey',
			title: { es: 'Inserción: desplazar y soltar', en: 'Insertion sort: shift and drop' },
			subtitles: sInsertion.list,
			motion: { cues: insertionStep() },
		},
		{
			id: 'growth',
			chapter: 'growth',
			scene: 'journey',
			title: { es: 'El doble de datos, cuatro veces más', en: 'Double the data, four times more' },
			subtitles: sGrowth.list,
			motion: { cues: growthStep() },
		},
		{
			id: 'best',
			chapter: 'best',
			scene: 'journey',
			title: { es: 'Si ya está ordenado', en: 'If it is already sorted' },
			subtitles: sBest.list,
			motion: { cues: bestStep() },
		},
		{
			id: 'stab-sel',
			chapter: 'stable',
			scene: 'journey',
			title: { es: 'Selección rompe el orden de los iguales', en: 'Selection breaks the order of equals' },
			subtitles: sStabSel.list,
			motion: { cues: stabSelStep() },
		},
		{
			id: 'stab-ins',
			chapter: 'stable',
			scene: 'journey',
			title: { es: 'Inserción respeta el orden de los iguales', en: 'Insertion keeps the order of equals' },
			subtitles: sStabIns.list,
			motion: { cues: stabInsStep() },
		},
		{
			id: 'verdict',
			chapter: 'stable',
			scene: 'journey',
			title: { es: 'Cuál es estable', en: 'Which one is stable' },
			subtitles: sVerdict.list,
			motion: { cues: verdictStep() },
		},
	],
};
