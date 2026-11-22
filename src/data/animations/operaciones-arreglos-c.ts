import type { AnimationScript, MotionCue, Subtitle } from './types';

// "Traverse, insert and delete": a short film (about two minutes) for the C lesson
// "Operaciones con Arreglos" (`operaciones-con-arreglos`). It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/operaciones-arreglos-c.astro`): the array `datos` drawn
// as a row of isometric cells with their index in front, the plate of `main` with its
// variable `n`, and the plate of the function being called. An index cursor visits the
// cells, value tokens are the values that travel and a dashed ring is the used part
// (`n`). The program is drawn inside the canvas (an editor whose bar slides to the
// running line), so every step is a motion step and the cues keep both halves in sync.

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

/** The particle and the editor bar travel together to the module of one line. */
const runTo = (at: number, line: number, dur = 900): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a-m${line}`, dur },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 700) },
];

/** The particle leaves one module and lights the next one when it arrives. */
const step = (at: number, from: number, to: number, dur = 600): MotionCue[] => [
	{ at, do: 'exit', el: `on-${from}`, dur: 300 },
	...runTo(at, to, dur),
	{ at: at + dur, do: 'enter', el: `on-${to}` },
];

/** A value token appears at one anchor, travels to another and disappears there. */
const travel = (at: number, token: string, from: string, to: string, dur = 800): MotionCue[] => [
	{ at, do: 'move', el: token, to: from, dur: 1 },
	{ at: at + 20, do: 'enter', el: token, dur: 300 },
	{ at: at + 320, do: 'move', el: token, to, dur },
	{ at: at + 320 + dur, do: 'exit', el: token, dur: 300 },
];
/** Time a `travel` takes until the token lands. */
const lands = (at: number, dur = 800) => at + 320 + dur;

/** One cell (or variable) changes its value: the old text leaves, the new one enters. */
const swap = (at: number, from: string, to: string): MotionCue[] => [
	{ at, do: 'exit', el: from, dur: 250 },
	{ at: at + 50, do: 'enter', el: to, dur: 400 },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const build = timed(
	say('Cada módulo es una instrucción y muestra su línea del editor.', 'Each module is an instruction and shows its editor line.'),
	say('La línea 54 crea `datos`, con capacidad para 5.', 'Line 54 creates `data`, with capacity for 5.'),
	say('`n` cuenta los usados: 4, de 0 a `n - 1`.', '`n` counts the used ones: 4, from 0 to `n - 1`.'),
);
const sum = timed(
	say('`sumar(datos, n)` trabaja sobre el arreglo de `main`.', '`sum(data, n)` works on the array of `main`.'),
	say('El índice `i` visita cada celda: eso es recorrer.', 'The index `i` visits every cell: that is a traversal.'),
	say('`suma += v[i]` acumula en cada vuelta: termina en 100.', '`total += v[i]` accumulates on each pass: it ends at 100.'),
);
const max = timed(
	say('`maximo` empieza con el primer elemento, `v[0]`, no con 0.', '`maximum` starts with the first element, `v[0]`, not 0.'),
	say('Si `v[i]` es mayor, lo reemplaza: así sigue el máximo.', 'If `v[i]` is greater, it replaces it: that tracks the maximum.'),
);
const insert = timed(
	say('Insertar 99 en la posición 1: primero comprueba que haya lugar.', 'Insert 99 at position 1: first it checks there is room.'),
	say('Corre los elementos a la derecha, desde el final hacia `pos`.', 'It shifts the elements right, from the end toward `pos`.'),
	say('Así ningún valor se pisa antes de moverse; luego escribe 99.', 'So no value is overwritten before it moves; then it writes 99.'),
);
const count = timed(
	say('`n` llegó por valor: cambiar la copia no cambia el de `main`.', "`n` arrived by value: changing the copy leaves `main`'s alone."),
	say('Devuelve `true` y es el llamador quien hace `n++`.', 'It returns `true`, and the caller is the one that does `n++`.'),
);
const full = timed(
	say('Otra inserción, pero `n` ya es igual a la capacidad.', 'Another insertion, but `n` already equals the capacity.'),
	say('La línea 22 lo detecta: `v[5]` está fuera del límite.', 'Line 22 catches it: `v[5]` is past the end.'),
	say('Devuelve `false` y el arreglo no cambia.', 'It returns `false` and the array does not change.'),
);
const remove = timed(
	say('Para eliminar la posición 0, se corren a la izquierda.', 'To delete position 0, the elements shift left.'),
	say('Desde `pos` hacia el final, cierran el hueco.', 'From `pos` toward the end, they close the gap.'),
	say('Devuelve `true`, el llamador hace `n--` y el último 40 ya no cuenta.', 'It returns `true`, the caller does `n--` and the last 40 no longer counts.'),
);
const reverse = timed(
	say('`invertir` usa dos índices: `i` y `n - 1 - i`.', '`reverse` uses two indexes: `i` and `n - 1 - i`.'),
	say('Intercambian valores con `aux` y avanzan hacia el medio.', 'They swap values through `tmp` and move toward the middle.'),
	say('Se detienen en `n / 2`: si siguieran, lo dejarían como estaba.', 'They stop at `n / 2`: going on would undo the swaps.'),
);

// ─── Timelines that depend on caption starts ────────────────────────────────
const SUM_LOOP = sum.start(2) + 700;
const SUM_PASS = 1000;
const SUM_END = SUM_LOOP + 4 * SUM_PASS;

const MAX_LOOP = max.start(1) + 1300;
const MAX_PASS = 1100;
const MAX_END = MAX_LOOP + 3 * MAX_PASS;

const INS_LOOP = insert.start(1) + 1500;
const INS_PASS = 1300;

const DEL_LOOP = remove.start(1) + 1300;
const DEL_PASS = 1300;

const REV_SWAP = reverse.start(1);
const REV_PASS = 3000;
const REV_END = Math.max(reverse.start(2), REV_SWAP + 2 * REV_PASS + 100);

export const script: AnimationScript = {
	chapters: [
		{ id: 'traverse', label: { es: 'Recorrer para sumar', en: 'Traverse to add up' } },
		{ id: 'max', label: { es: 'Seguir el máximo', en: 'Track the maximum' } },
		{ id: 'insert', label: { es: 'Insertar corriendo a la derecha', en: 'Insert by shifting right' } },
		{ id: 'full', label: { es: 'Cuando no queda lugar', en: 'When there is no room' } },
		{ id: 'delete', label: { es: 'Eliminar corriendo a la izquierda', en: 'Delete by shifting left' } },
		{ id: 'reverse', label: { es: 'Invertir hasta la mitad', en: 'Reverse up to the middle' } },
	],
	steps: [
		// ─── Scene 1. Traverse to add up ────────────────────────────────────
		{
			id: 'build',
			chapter: 'traverse',
			scene: 'journey',
			title: { es: 'El arreglo y su cantidad usada', en: 'The array and its used count' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-row', 4000),
					{ at: 100, do: 'enter', el: 'f-main', dur: 800 },
					[54, 55, 56, 58, 59, 61, 62, 63, 65, 66, 68, 69, 70].map((line, index): MotionCue => ({ at: 400 + index * 140, do: 'enter', el: `m-${line}` })),
					{ at: build.start(1), do: 'enter', el: 'hl' },
					{ at: build.start(1), do: 'enter', el: 'p' },
					{ at: build.start(1) + 400, do: 'enter', el: 'on-54' },
					{ at: build.start(1) + 600, do: 'enter', el: 'arr', dur: 700 },
					[0, 1, 2, 3, 4].map((k): MotionCue => ({ at: build.start(1) + 900 + k * 150, do: 'enter', el: `c-${k}` })),
					{ at: build.start(1) + 1500, do: 'enter', el: 'arr-tag' },
					['v0-10', 'v1-20', 'v2-30', 'v3-40'].map((el, k): MotionCue => ({ at: build.start(1) + 1900 + k * 180, do: 'enter', el })),
					{ at: build.start(1) + 2700, do: 'enter', el: 'cap-tag' },
					{ at: build.start(1) + 3000, do: 'pulse', el: 'c-4' },
					step(build.start(2), 54, 55, 700),
					{ at: build.start(2) + 900, do: 'enter', el: 'c-n' },
					{ at: build.start(2) + 1300, do: 'enter', el: 'n-4' },
					{ at: build.start(2) + 1800, do: 'draw', el: 'used-4', dur: 1000 },
					{ at: build.start(2) + 2600, do: 'enter', el: 'range' },
				),
			},
		},
		{
			id: 'sum',
			chapter: 'traverse',
			scene: 'journey',
			title: { es: 'Recorrer y acumular', en: 'Traverse and accumulate' },
			subtitles: sum.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'range', dur: 400 },
					step(200, 55, 56, 700),
					shot(900, 'shot-wide', 2000),
					{ at: 1200, do: 'draw', el: 'fl-call', dur: 900 },
					{ at: 1800, do: 'enter', el: 'f-sum', dur: 800 },
					step(2700, 56, 5, 900),
					{ at: 3800, do: 'enter', el: 's-0' },
					// The index starts at 0 and the accumulator at 0.
					step(sum.start(1), 5, 6, 600),
					{ at: sum.start(1) + 700, do: 'enter', el: 'cur' },
					{ at: sum.start(1) + 1400, do: 'pulse', el: 'cur' },
					{ at: sum.start(1) + 2000, do: 'pulse', el: 'used-4' },
					step(sum.start(2), 6, 7, 600),
					// One pass per cell: the cursor visits it and its value joins the total.
					[0, 1, 2, 3].flatMap((k): MotionCue[] => {
						const at = SUM_LOOP + k * SUM_PASS;
						const values = ['10', '20', '30', '40'];
						const totals = ['0', '10', '30', '60', '100'];
						return [
							...(k > 0 ? [{ at, do: 'move', el: 'cur', to: `a-k${k}`, dur: 300 } as MotionCue] : []),
							...travel(at + 250, `tk-${values[k]}`, `a-c${k}`, 'a-f', 500),
							...swap(lands(at + 250, 500), `s-${totals[k]}`, `s-${totals[k + 1]}`),
						];
					}),
					{ at: SUM_END, do: 'exit', el: 'cur', dur: 400 },
					step(SUM_END, 7, 9, 600),
					{ at: SUM_END + 700, do: 'draw', el: 'fl-ret', dur: 700 },
					travel(SUM_END + 700, 'tk-sum', 'a-f', 'a-m56', 1100),
					{ at: SUM_END + 1400, do: 'exit', el: 'f-sum', dur: 600 },
					{ at: SUM_END + 1400, do: 'exit', el: 's-100', dur: 300 },
					step(SUM_END + 1400, 9, 56, 900),
					{ at: SUM_END + 2400, do: 'exit', el: 'fl-call', dur: 400 },
					{ at: SUM_END + 2400, do: 'exit', el: 'fl-ret', dur: 400 },
				),
			},
		},

		// ─── Scene 2. Track the maximum ─────────────────────────────────────
		{
			id: 'max',
			chapter: 'max',
			scene: 'journey',
			title: { es: 'El máximo empieza en v[0]', en: 'The maximum starts at v[0]' },
			subtitles: max.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'draw', el: 'fl-call', dur: 700 },
					{ at: 300, do: 'enter', el: 'f-max', dur: 700 },
					step(600, 56, 12, 900),
					travel(1600, 'tk-10', 'a-c0', 'a-f', 700),
					{ at: lands(1600, 700), do: 'enter', el: 'x-10' },
					{ at: lands(1600, 700) + 200, do: 'enter', el: 'lb-first' },
					{ at: max.start(1), do: 'exit', el: 'lb-first', dur: 400 },
					step(max.start(1), 12, 13, 500),
					{ at: max.start(1) + 400, do: 'move', el: 'cur', to: 'a-k1', dur: 1 },
					{ at: max.start(1) + 500, do: 'enter', el: 'cur' },
					step(max.start(1) + 700, 13, 14, 400),
					{ at: max.start(1) + 1100, do: 'enter', el: 'on-15' },
					// Every element is greater than the previous maximum, so each one replaces it.
					[1, 2, 3].flatMap((k): MotionCue[] => {
						const at = MAX_LOOP + (k - 1) * MAX_PASS;
						const values = ['10', '20', '30', '40'];
						return [
							...(k > 1 ? [{ at, do: 'move', el: 'cur', to: `a-k${k}`, dur: 300 } as MotionCue] : []),
							...travel(at + 250, `tk-${values[k]}`, `a-c${k}`, 'a-f', 500),
							...swap(lands(at + 250, 500), `x-${values[k - 1]}`, `x-${values[k]}`),
						];
					}),
					{ at: MAX_END, do: 'exit', el: 'cur', dur: 400 },
					{ at: MAX_END, do: 'exit', el: 'on-15', dur: 300 },
					step(MAX_END, 14, 18, 600),
					{ at: MAX_END + 700, do: 'draw', el: 'fl-ret', dur: 700 },
					travel(MAX_END + 700, 'tk-max', 'a-f', 'a-m56', 1100),
					{ at: MAX_END + 1400, do: 'exit', el: 'f-max', dur: 600 },
					{ at: MAX_END + 1400, do: 'exit', el: 'x-40', dur: 300 },
					step(MAX_END + 1400, 18, 56, 900),
					{ at: MAX_END + 2400, do: 'exit', el: 'fl-call', dur: 400 },
					{ at: MAX_END + 2400, do: 'exit', el: 'fl-ret', dur: 400 },
					{ at: MAX_END + 2400, do: 'type', el: 'out-1', dur: 1000 },
				),
			},
		},

		// ─── Scene 3. Insert by shifting right ──────────────────────────────
		{
			id: 'insert',
			chapter: 'insert',
			scene: 'journey',
			title: { es: 'Insertar corre a la derecha', en: 'Inserting shifts right' },
			subtitles: insert.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'ea', dur: 300 },
					{ at: 250, do: 'enter', el: 'eb', dur: 400 },
					step(300, 56, 58, 900),
					shot(900, 'shot-work', 2000),
					{ at: 1300, do: 'draw', el: 'fl-call', dur: 800 },
					{ at: 1700, do: 'enter', el: 'f-ins', dur: 700 },
					// n travels as a copy: the function gets its own n.
					travel(2200, 'tk-n4', 'a-n', 'a-f', 900),
					{ at: lands(2200, 900), do: 'enter', el: 'fi-4' },
					step(lands(2200, 900) + 200, 58, 22, 700),
					{ at: lands(2200, 900) + 1000, do: 'pulse', el: 'cap-tag' },
					step(insert.start(1), 22, 25, 600),
					{ at: insert.start(1) + 300, do: 'enter', el: 'lb-right' },
					{ at: insert.start(1) + 500, do: 'move', el: 'cur', to: 'a-k4', dur: 1 },
					{ at: insert.start(1) + 600, do: 'enter', el: 'cur' },
					step(insert.start(1) + 900, 25, 26, 500),
					// From the end toward pos: v[4] = v[3], v[3] = v[2], v[2] = v[1].
					[4, 3, 2].flatMap((k, pass): MotionCue[] => {
						const at = INS_LOOP + pass * INS_PASS;
						const moving = ['10', '20', '30', '40'][k - 1];
						const before = ['10', '20', '30', '40', ''][k];
						return [
							...(pass > 0 ? [{ at, do: 'move', el: 'cur', to: `a-k${k}`, dur: 300 } as MotionCue] : []),
							...travel(at + 300, `tk-${moving}`, `a-c${k - 1}`, `a-c${k}`, 600),
							...(before ? swap(lands(at + 300, 600), `v${k}-${before}`, `v${k}-${moving}`) : [{ at: lands(at + 300, 600), do: 'enter', el: `v${k}-${moving}` } as MotionCue]),
						];
					}),
					{ at: insert.start(2), do: 'exit', el: 'lb-right', dur: 400 },
					step(insert.start(2), 26, 28, 600),
					{ at: insert.start(2) + 300, do: 'move', el: 'cur', to: 'a-k1', dur: 300 },
					travel(insert.start(2) + 700, 'tk-99', 'a-m58', 'a-c1', 1100),
					swap(lands(insert.start(2) + 700, 1100), 'v1-20', 'v1-99'),
					{ at: lands(insert.start(2) + 700, 1100) + 300, do: 'pulse', el: 'c-1' },
					{ at: lands(insert.start(2) + 700, 1100) + 900, do: 'exit', el: 'cur', dur: 400 },
				),
			},
		},
		{
			id: 'count',
			chapter: 'insert',
			scene: 'journey',
			title: { es: 'El llamador actualiza n', en: 'The caller updates n' },
			subtitles: count.list,
			motion: {
				cues: seq(
					shot(0, 'shot-wide', 1800),
					{ at: 600, do: 'enter', el: 'lb-copy' },
					{ at: 1200, do: 'pulse', el: 'f-ins' },
					{ at: 2000, do: 'pulse', el: 'c-n' },
					{ at: count.start(1), do: 'exit', el: 'lb-copy', dur: 400 },
					step(count.start(1), 28, 29, 600),
					{ at: count.start(1) + 600, do: 'draw', el: 'fl-ret', dur: 700 },
					travel(count.start(1) + 600, 'tk-true', 'a-f', 'a-m58', 1100),
					{ at: count.start(1) + 1300, do: 'exit', el: 'f-ins', dur: 600 },
					{ at: count.start(1) + 1300, do: 'exit', el: 'fi-4', dur: 300 },
					step(count.start(1) + 1300, 29, 58, 900),
					// The caller, not the function, changes its own n.
					step(lands(count.start(1) + 600, 1100) + 300, 58, 59, 500),
					swap(lands(count.start(1) + 600, 1100) + 900, 'n-4', 'n-5'),
					{ at: lands(count.start(1) + 600, 1100) + 1100, do: 'pulse', el: 'c-n' },
					{ at: lands(count.start(1) + 600, 1100) + 1100, do: 'enter', el: 'lb-caller' },
					{ at: lands(count.start(1) + 600, 1100) + 1300, do: 'exit', el: 'used-4', dur: 300 },
					{ at: lands(count.start(1) + 600, 1100) + 1400, do: 'draw', el: 'used-5', dur: 900 },
					{ at: lands(count.start(1) + 600, 1100) + 1500, do: 'exit', el: 'fl-call', dur: 400 },
					{ at: lands(count.start(1) + 600, 1100) + 1500, do: 'exit', el: 'fl-ret', dur: 400 },
					step(lands(count.start(1) + 600, 1100) + 2000, 59, 61, 700),
					{ at: lands(count.start(1) + 600, 1100) + 2800, do: 'type', el: 'out-2', dur: 900 },
				),
			},
		},

		// ─── Scene 4. When there is no room ─────────────────────────────────
		{
			id: 'full',
			chapter: 'full',
			scene: 'journey',
			title: { es: 'Lleno: la inserción se rechaza', en: 'Full: the insertion is refused' },
			subtitles: full.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-caller', dur: 400 },
					step(200, 61, 62, 700),
					shot(900, 'shot-limit', 2000),
					{ at: 1200, do: 'draw', el: 'fl-call', dur: 800 },
					{ at: 1600, do: 'enter', el: 'f-ins', dur: 700 },
					travel(2000, 'tk-n5', 'a-n', 'a-f', 900),
					{ at: lands(2000, 900), do: 'enter', el: 'fi-5' },
					// The check runs before the array is touched: n == capacity.
					step(full.start(1), 62, 22, 700),
					{ at: full.start(1) + 700, do: 'enter', el: 'hx-22' },
					{ at: full.start(1) + 900, do: 'enter', el: 'ghost' },
					{ at: full.start(1) + 1200, do: 'enter', el: 'wall' },
					{ at: full.start(1) + 1800, do: 'pulse', el: 'wall' },
					{ at: full.start(1) + 2000, do: 'enter', el: 'lb-full' },
					step(full.start(2), 22, 23, 500),
					{ at: full.start(2) + 500, do: 'draw', el: 'fl-ret', dur: 700 },
					travel(full.start(2) + 500, 'tk-false', 'a-f', 'a-m62', 1100),
					{ at: full.start(2) + 1200, do: 'exit', el: 'f-ins', dur: 600 },
					{ at: full.start(2) + 1200, do: 'exit', el: 'fi-5', dur: 300 },
					step(full.start(2) + 1200, 23, 62, 900),
					step(lands(full.start(2) + 500, 1100) + 300, 62, 63, 500),
					{ at: lands(full.start(2) + 500, 1100) + 800, do: 'type', el: 'out-3', dur: 800 },
					{ at: lands(full.start(2) + 500, 1100) + 1000, do: 'pulse', el: 'c-n' },
					{ at: lands(full.start(2) + 500, 1100) + 1200, do: 'exit', el: 'fl-call', dur: 400 },
					{ at: lands(full.start(2) + 500, 1100) + 1200, do: 'exit', el: 'fl-ret', dur: 400 },
				),
			},
		},

		// ─── Scene 5. Delete by shifting left ───────────────────────────────
		{
			id: 'delete',
			chapter: 'delete',
			scene: 'journey',
			title: { es: 'Eliminar corre a la izquierda', en: 'Deleting shifts left' },
			subtitles: remove.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'hx-22', dur: 300 },
					{ at: 0, do: 'exit', el: 'lb-full', dur: 400 },
					{ at: 0, do: 'exit', el: 'ghost', dur: 400 },
					{ at: 0, do: 'exit', el: 'wall', dur: 400 },
					{ at: 0, do: 'exit', el: 'on-62', dur: 300 },
					{ at: 100, do: 'exit', el: 'eb', dur: 300 },
					{ at: 350, do: 'enter', el: 'ec', dur: 400 },
					step(300, 63, 65, 800),
					shot(1000, 'shot-work', 2000),
					{ at: 1300, do: 'draw', el: 'fl-call', dur: 800 },
					{ at: 1600, do: 'enter', el: 'f-del', dur: 700 },
					travel(1900, 'tk-n5', 'a-n', 'a-f', 800),
					{ at: lands(1900, 800), do: 'enter', el: 'fd-5' },
					step(lands(1900, 800) + 100, 65, 32, 700),
					step(remove.start(1), 32, 35, 500),
					{ at: remove.start(1) + 200, do: 'enter', el: 'lb-left' },
					{ at: remove.start(1) + 300, do: 'move', el: 'cur', to: 'a-k0', dur: 1 },
					{ at: remove.start(1) + 400, do: 'enter', el: 'cur' },
					step(remove.start(1) + 800, 35, 36, 400),
					// From pos toward the end: v[0] = v[1], v[1] = v[2], v[2] = v[3], v[3] = v[4].
					[0, 1, 2, 3].flatMap((k): MotionCue[] => {
						const at = DEL_LOOP + k * DEL_PASS;
						const moving = ['99', '20', '30', '40'][k];
						const before = ['10', '99', '20', '30'][k];
						return [
							...(k > 0 ? [{ at, do: 'move', el: 'cur', to: `a-k${k}`, dur: 300 } as MotionCue] : []),
							...travel(at + 300, `tk-${moving}`, `a-c${k + 1}`, `a-c${k}`, 600),
							...swap(lands(at + 300, 600), `v${k}-${before}`, `v${k}-${moving}`),
						];
					}),
					{ at: DEL_LOOP + 4 * DEL_PASS, do: 'exit', el: 'cur', dur: 400 },
					{ at: DEL_LOOP + 4 * DEL_PASS, do: 'exit', el: 'lb-left', dur: 400 },
					step(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS), 36, 38, 500),
					{ at: Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 500, do: 'draw', el: 'fl-ret', dur: 700 },
					travel(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 500, 'tk-true', 'a-f', 'a-m65', 1000),
					{ at: Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 1100, do: 'exit', el: 'f-del', dur: 600 },
					{ at: Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 1100, do: 'exit', el: 'fd-5', dur: 300 },
					step(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 1100, 38, 65, 700),
					step(lands(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 500, 1000) + 200, 65, 66, 500),
					swap(lands(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 500, 1000) + 700, 'n-5', 'n-4'),
					{ at: lands(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 500, 1000) + 900, do: 'exit', el: 'used-5', dur: 300 },
					{ at: lands(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 500, 1000) + 1000, do: 'draw', el: 'used-4', dur: 800 },
					{ at: lands(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 500, 1000) + 1300, do: 'enter', el: 'stale' },
					{ at: lands(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 500, 1000) + 1500, do: 'enter', el: 'lb-stale' },
					{ at: lands(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 500, 1000) + 1500, do: 'exit', el: 'fl-call', dur: 400 },
					{ at: lands(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 500, 1000) + 1500, do: 'exit', el: 'fl-ret', dur: 400 },
					step(lands(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 500, 1000) + 1300, 66, 68, 600),
					{ at: lands(Math.max(remove.start(2), DEL_LOOP + 4 * DEL_PASS) + 500, 1000) + 2000, do: 'type', el: 'out-4', dur: 800 },
				),
			},
		},

		// ─── Scene 6. Reverse up to the middle ──────────────────────────────
		{
			id: 'reverse',
			chapter: 'reverse',
			scene: 'journey',
			title: { es: 'Dos índices hacia el medio', en: 'Two indexes toward the middle' },
			subtitles: reverse.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-stale', dur: 400 },
					{ at: 0, do: 'exit', el: 'on-65', dur: 300 },
					{ at: 0, do: 'exit', el: 'on-66', dur: 300 },
					step(200, 68, 69, 700),
					{ at: 1000, do: 'draw', el: 'fl-call', dur: 800 },
					{ at: 1300, do: 'enter', el: 'f-inv', dur: 700 },
					step(1700, 69, 41, 800),
					{ at: 2500, do: 'move', el: 'cur', to: 'a-k0', dur: 1 },
					{ at: 2500, do: 'move', el: 'cur2', to: 'a-k3', dur: 1 },
					{ at: 2600, do: 'enter', el: 'cur' },
					{ at: 3000, do: 'enter', el: 'cur2' },
					// Each pass swaps one pair through aux: v[i] to aux, v[n-1-i] to v[i], aux to v[n-1-i].
					[0, 1].flatMap((i): MotionCue[] => {
						const at = REV_SWAP + i * REV_PASS;
						const left = ['99', '20'][i];
						const right = ['40', '30'][i];
						const j = 3 - i;
						return [
							...(i > 0
								? [
										{ at: at - 300, do: 'move', el: 'cur', to: `a-k${i}`, dur: 300 } as MotionCue,
										{ at: at - 300, do: 'move', el: 'cur2', to: `a-k${j}`, dur: 300 } as MotionCue,
									]
								: []),
							...step(at, i === 0 ? 41 : 44, 42, 400),
							...travel(at + 300, `tk-${left}`, `a-c${i}`, 'a-f', 500),
							{ at: lands(at + 300, 500), do: 'enter', el: `ax-${left}` },
							...step(at + 1150, 42, 43, 400),
							...travel(at + 1150, `tk-${right}`, `a-c${j}`, `a-c${i}`, 600),
							...swap(lands(at + 1150, 600), `v${i}-${left}`, `v${i}-${right}`),
							...step(at + 2200, 43, 44, 400),
							{ at: at + 2200, do: 'exit', el: `ax-${left}`, dur: 300 },
							...travel(at + 2200, `tk-${left}`, 'a-f', `a-c${j}`, 600),
							...swap(lands(at + 2200, 600), `v${j}-${right}`, `v${j}-${left}`),
						];
					}),
					// i reaches n / 2: the loop ends and the camera pulls back to the whole system.
					{ at: REV_END, do: 'exit', el: 'cur', dur: 400 },
					{ at: REV_END, do: 'exit', el: 'cur2', dur: 400 },
					{ at: REV_END + 200, do: 'enter', el: 'lb-half' },
					{ at: REV_END + 900, do: 'exit', el: 'f-inv', dur: 600 },
					{ at: REV_END + 900, do: 'exit', el: 'fl-call', dur: 400 },
					step(REV_END + 900, 44, 70, 900),
					{ at: REV_END + 1900, do: 'type', el: 'out-5', dur: 800 },
					{ at: REV_END + 2000, do: 'camera', to: 'all', dur: 3000 },
					{ at: REV_END + 2600, do: 'flow', el: 'used-4' },
					{ at: REV_END + 3200, do: 'pulse', el: 'arr' },
					{ at: REV_END + 4200, do: 'exit', el: 'hl', dur: 400 },
				),
			},
		},
	],
};
