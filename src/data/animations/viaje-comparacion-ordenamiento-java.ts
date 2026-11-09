import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a comparison": a short film (about two minutes) for the Java lesson
// "Iteradores, ordenamiento y contrato equals/hashCode". It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/viaje-comparacion-ordenamiento-java.astro`): an
// isometric system whose modules are the instructions of the program, a shelf that is
// the list, a light blue particle that is the execution flow and a violet object that
// is the answer of each comparison. The code is drawn inside the canvas (an editor
// that highlights the running line), so every step is a motion step and the cues
// below keep both halves in sync.

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

/**
 * One comparison, start to end: the sort marks a pair on the shelf, the flow goes
 * down to whoever compares (`compareTo` or the `Comparator`), the result is typed
 * and a violet answer travels back to the sort. `at` is the moment the pair lights.
 */
type Comparison = {
	at: number;
	zone: string;
	chip: string;
	result: string;
	answer: 'ans-neg' | 'ans-pos';
	from: 'a-sort' | 'a-sort2';
	to: 'a-cto' | 'a-cmp';
	lit: 'cto-on' | 'cmp-on';
	/** Editor lines of the caller and of the comparing code, when the bar has to travel. */
	bar?: { call: string; body: string };
};
const DOWN = 900;
const compare = (c: Comparison): MotionCue[] => [
	{ at: c.at, do: 'enter', el: c.zone },
	{ at: c.at + 200, do: 'enter', el: c.chip },
	{ at: c.at + 400, do: 'move', el: 'p', to: c.to, dur: DOWN },
	...(c.bar ? [{ at: c.at + 400, do: 'move', el: 'hl', to: c.bar.body, dur: 700 } as MotionCue] : []),
	{ at: c.at + 400 + DOWN, do: 'enter', el: c.lit },
	{ at: c.at + 500 + DOWN, do: 'type', el: c.result, dur: 500 },
	{ at: c.at + 900 + DOWN, do: 'move', el: c.answer, to: c.to, dy: -30, dur: 1 },
	{ at: c.at + 1000 + DOWN, do: 'enter', el: c.answer, dur: 500 },
	// The answer goes back to the sort, which is the one that asked.
	{ at: c.at + 1700 + DOWN, do: 'move', el: 'p', to: c.from, dur: DOWN },
	{ at: c.at + 1700 + DOWN, do: 'move', el: c.answer, to: c.from, dy: -30, dur: DOWN },
	...(c.bar ? [{ at: c.at + 1700 + DOWN, do: 'move', el: 'hl', to: c.bar.call, dur: 700 } as MotionCue] : []),
	{ at: c.at + 1700 + DOWN, do: 'exit', el: c.lit, dur: 400 },
];
/** Moment the answer of a comparison is back at the sort. */
const answered = (at: number) => at + 1700 + DOWN * 2;

// ─── Captions ───────────────────────────────────────────────────────────────
const build = timed(
	say('Este programa guarda tres objetos `Libro` en una lista.', 'This program stores three `Book` objects in a list.'),
	say('Cada libro tiene título, autor y páginas. Queremos la lista ordenada.', 'Each book has a title, an author and pages. We want the list sorted.'),
);
const reject = timed(
	say('`Collections.sort(libros)` pide ordenar. Java lo rechaza.', '`Collections.sort(books)` asks to sort. Java rejects it.'),
	say('¿Por título, por autor, por páginas? Java no puede adivinarlo: `Libro` no es `Comparable`.', 'By title, by author, by pages? Java cannot guess: `Book` is not `Comparable`.'),
);
const contract = timed(
	say('`Libro` implementa `Comparable` y define su orden natural.', '`Book` implements `Comparable` and defines its natural order.'),
	say('`compareTo` compara este libro con otro. Aquí, por título.', '`compareTo` compares this book with another one. Here, by title.'),
	say('Devuelve un entero. Negativo: va antes. Cero: equivalentes. Positivo: va después.', 'It returns an integer. Negative: goes before. Zero: equivalent. Positive: goes after.'),
);
const first = timed(
	say('Ahora el ordenamiento sí se ejecuta. Toma un par y pregunta cuál va antes.', 'Now the sort does run. It takes a pair and asks which one goes first.'),
	say('La comparación viaja hasta `compareTo`: "1984" frente a "Rayuela".', 'The comparison travels to `compareTo`: "1984" against "Hopscotch".'),
	say('La respuesta es negativa: "1984" va antes. El par cambia de lugar.', 'The answer is negative: "1984" goes first. The pair swaps places.'),
);
const rest = timed(
	say('Solo importa el signo. "Ficciones" frente a "Rayuela": negativo, cambian.', 'Only the sign matters. "Fictions" against "Hopscotch": negative, they swap.'),
	say('"Ficciones" frente a "1984": positivo. Ya está después: no se mueve.', '"Fictions" against "1984": positive. It is already after: it does not move.'),
	say('Con esas respuestas, la lista quedó ordenada por título.', 'With those answers, the list is now sorted by title.'),
);
const outside = timed(
	say('¿Y para ordenar por páginas? `Comparable` permite un solo orden natural.', 'And to sort by pages? `Comparable` allows only one natural order.'),
	say('Un `Comparator` es un orden fuera de la clase: `Libro` no se toca.', 'A `Comparator` is an order outside the class: `Book` is not touched.'),
);
const pages = timed(
	say('El ordenamiento hace las mismas preguntas; ahora responde el `Comparator`.', 'The sort asks the same questions; now the `Comparator` answers.'),
	say('174 páginas frente a 328: negativo, el par cambia de lugar.', '174 pages against 328: negative, the pair swaps places.'),
	say('736 frente a 328: positivo, se queda. La lista quedó ordenada por páginas.', '736 against 328: positive, it stays. The list is now sorted by pages.'),
);
const recap = timed(
	say('Ordenar es comparar de a pares, y alguien debe responder.', 'Sorting is comparing in pairs, and someone has to answer.'),
	say('`Comparable` es el orden natural, dentro de la clase. Solo hay uno.', '`Comparable` is the natural order, inside the class. There is only one.'),
	say('`Comparator` aporta otros órdenes desde afuera, tantos como se necesiten.', '`Comparator` supplies other orders from outside, as many as needed.'),
);

// Comparisons of the two sorts. The order of the pairs is illustrative; every result is the real one.
const c1 = first.start(0) + 3700;
const c2 = rest.start(0) + 300;
const c3 = rest.start(1) + 200;
const d1 = pages.start(0) + 2700;
const d2 = pages.start(1) + 3400;

export const script: AnimationScript = {
	chapters: [
		{ id: 'list', label: { es: 'Una lista sin orden', en: 'A list with no order' } },
		{ id: 'reject', label: { es: 'Java rechaza el ordenamiento', en: 'Java rejects the sort' } },
		{ id: 'comparable', label: { es: 'Comparable: el orden natural', en: 'Comparable: the natural order' } },
		{ id: 'compare', label: { es: 'compareTo responde', en: 'compareTo answers' } },
		{ id: 'comparator', label: { es: 'Comparator: otro orden, desde afuera', en: 'Comparator: another order, from outside' } },
		{ id: 'recap', label: { es: 'Dos formas de ordenar', en: 'Two ways to sort' } },
	],
	steps: [
		// ─── Scene 1. A list with no order ──────────────────────────────────
		{
			id: 'build',
			chapter: 'list',
			scene: 'journey',
			title: { es: 'Tres libros en una lista', en: 'Three books in a list' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-main', 6000),
					{ at: 200, do: 'type', el: 'ea-1a', dur: 600 },
					{ at: 300, do: 'enter', el: 'floor-l' },
					{ at: 900, do: 'type', el: 'ea-2', dur: 400 },
					{ at: 1300, do: 'type', el: 'ea-3', dur: 400 },
					{ at: 1700, do: 'type', el: 'ea-4', dur: 400 },
					{ at: 2100, do: 'type', el: 'ea-5', dur: 400 },
					{ at: 2500, do: 'type', el: 'ea-6a', dur: 200 },
					{ at: 2900, do: 'type', el: 'ea-13', dur: 800 },
					{ at: 3000, do: 'enter', el: 'm-entry' },
					{ at: 3200, do: 'enter', el: 'm-new' },
					{ at: 3400, do: 'enter', el: 'shelf' },
					{ at: 3900, do: 'type', el: 'ea-14', dur: 600 },
					{ at: 4300, do: 'enter', el: 'bk-r' },
					{ at: 4700, do: 'type', el: 'ea-15', dur: 600 },
					{ at: 5100, do: 'enter', el: 'bk-n' },
					{ at: 5500, do: 'type', el: 'ea-16', dur: 600 },
					{ at: 5900, do: 'enter', el: 'bk-f' },
					{ at: build.start(1) + 300, do: 'pulse', el: 'bk-r' },
					{ at: build.start(1) + 700, do: 'pulse', el: 'bk-n' },
					{ at: build.start(1) + 1100, do: 'pulse', el: 'bk-f' },
					{ at: build.start(1) + 2400, do: 'draw', el: 'tr-main', dur: 900 },
					{ at: build.start(1) + 2500, do: 'type', el: 'ea-18', dur: 700 },
					{ at: build.start(1) + 2700, do: 'enter', el: 'm-sort' },
					{ at: build.start(1) + 3300, do: 'type', el: 'ea-19', dur: 900 },
					{ at: build.start(1) + 3500, do: 'enter', el: 'm-print' },
				),
			},
		},

		// ─── Scene 2. Java rejects the sort ─────────────────────────────────
		{
			id: 'reject',
			chapter: 'reject',
			scene: 'journey',
			title: { es: 'Libro no es Comparable', en: 'Book is not Comparable' },
			subtitles: reject.list,
			motion: {
				cues: seq(
					shot(0, 'shot-sort', 2200),
					{ at: 900, do: 'pulse', el: 'm-sort' },
					// The sort looks for a way to compare two books and finds none.
					{ at: 1500, do: 'draw', el: 'rt-x', dur: 900 },
					{ at: 2400, do: 'enter', el: 'slot-x' },
					{ at: 2500, do: 'enter', el: 'sort-x' },
					{ at: 2500, do: 'enter', el: 'hx-18' },
					{ at: 2700, do: 'enter', el: 'err-18' },
					{ at: 3200, do: 'pulse', el: 'slot-x' },
					{ at: reject.start(1) + 300, do: 'enter', el: 'why' },
					{ at: reject.start(1) + 1500, do: 'pulse', el: 'why' },
					shot(reject.start(1) + 3400, 'shot-wide', 2400),
					{ at: reject.start(1) + 4300, do: 'pulse', el: 'bk-r' },
					{ at: reject.start(1) + 4700, do: 'pulse', el: 'bk-n' },
					{ at: reject.start(1) + 5100, do: 'pulse', el: 'bk-f' },
				),
			},
		},

		// ─── Scene 3. Comparable: the natural order ─────────────────────────
		{
			id: 'contract',
			chapter: 'comparable',
			scene: 'journey',
			title: { es: 'La clase aprende a compararse', en: 'The class learns to compare itself' },
			subtitles: contract.list,
			motion: {
				cues: seq(
					shot(0, 'shot-cto', 2200),
					{ at: 0, do: 'exit', el: 'why', dur: 400 },
					{ at: 0, do: 'exit', el: 'err-18', dur: 400 },
					{ at: 0, do: 'exit', el: 'hx-18', dur: 400 },
					{ at: 0, do: 'exit', el: 'sort-x', dur: 400 },
					{ at: 0, do: 'exit', el: 'rt-x', dur: 400 },
					{ at: 300, do: 'exit', el: 'ea-1a', dur: 250 },
					{ at: 500, do: 'enter', el: 'hv-1' },
					{ at: 600, do: 'type', el: 'ea-1b', dur: 900 },
					{ at: 1600, do: 'exit', el: 'ea-6a', dur: 250 },
					{ at: 1900, do: 'type', el: 'ea-7', dur: 300 },
					{ at: 2300, do: 'type', el: 'ea-8', dur: 700 },
					{ at: 2500, do: 'exit', el: 'slot-x', dur: 400 },
					{ at: 2800, do: 'enter', el: 'm-cto' },
					{ at: 3100, do: 'type', el: 'ea-9', dur: 900 },
					{ at: 4100, do: 'type', el: 'ea-10', dur: 200 },
					{ at: 4300, do: 'type', el: 'ea-11', dur: 200 },
					{ at: contract.start(1), do: 'exit', el: 'hv-1', dur: 400 },
					{ at: contract.start(1) + 100, do: 'enter', el: 'hv-9' },
					{ at: contract.start(1) + 300, do: 'enter', el: 'lb-cto' },
					{ at: contract.start(1) + 900, do: 'pulse', el: 'm-cto' },
					{ at: contract.start(1) + 2200, do: 'pulse', el: 'lb-cto' },
					{ at: contract.start(2) + 200, do: 'enter', el: 'signs' },
					{ at: contract.start(2) + 600, do: 'type', el: 'sg-neg', dur: 500 },
					{ at: contract.start(2) + 2100, do: 'type', el: 'sg-zero', dur: 500 },
					{ at: contract.start(2) + 3800, do: 'type', el: 'sg-pos', dur: 500 },
				),
			},
		},

		// ─── Scene 4. compareTo answers ─────────────────────────────────────
		{
			id: 'first',
			chapter: 'compare',
			scene: 'journey',
			title: { es: 'La primera comparación', en: 'The first comparison' },
			subtitles: first.list,
			motion: {
				cues: seq(
					shot(0, 'shot-main', 2000),
					{ at: 0, do: 'exit', el: 'signs', dur: 400 },
					{ at: 0, do: 'exit', el: 'hv-9', dur: 400 },
					{ at: 200, do: 'enter', el: 'hl' },
					{ at: 300, do: 'enter', el: 'p' },
					{ at: 800, do: 'draw', el: 'fl-0', dur: 500 },
					{ at: 900, do: 'move', el: 'p', to: 'a-new', dur: 800 },
					{ at: 1700, do: 'enter', el: 'new-on' },
					{ at: 1700, do: 'pulse', el: 'm-new' },
					{ at: 2300, do: 'draw', el: 'fl-1', dur: 500 },
					{ at: 2400, do: 'move', el: 'p', to: 'a-sort', dur: 800 },
					{ at: 2400, do: 'move', el: 'hl', to: 'l-18', dur: 600 },
					{ at: 3200, do: 'enter', el: 'sort-on' },
					{ at: 3200, do: 'pulse', el: 'm-sort' },
					// The sort picks a pair; the flow goes down to compareTo with the question.
					{ at: c1, do: 'enter', el: 'z-01' },
					{ at: c1 + 400, do: 'pulse', el: 'z-01' },
					shot(first.start(1), 'shot-cto', 1800),
					{ at: first.start(1) + 200, do: 'enter', el: 'a1' },
					{ at: first.start(1) + 300, do: 'draw', el: 'fl-q1', dur: 800 },
					{ at: first.start(1) + 400, do: 'move', el: 'p', to: 'a-cto', dur: 1100 },
					{ at: first.start(1) + 400, do: 'move', el: 'hl', to: 'l-9', dur: 800 },
					{ at: first.start(1) + 1500, do: 'enter', el: 'cto-on' },
					{ at: first.start(1) + 1500, do: 'pulse', el: 'm-cto' },
					{ at: first.start(1) + 2800, do: 'type', el: 'r1', dur: 600 },
					{ at: first.start(1) + 3500, do: 'move', el: 'ans-neg', to: 'a-cto', dy: -30, dur: 1 },
					{ at: first.start(1) + 3600, do: 'enter', el: 'ans-neg', dur: 600 },
					{ at: first.start(1) + 4300, do: 'pulse', el: 'ans-neg' },
					// The answer travels back up; a negative sign means the pair is out of order.
					shot(first.start(2), 'shot-shelf', 1800),
					{ at: first.start(2) + 100, do: 'move', el: 'p', to: 'a-sort', dur: 1300 },
					{ at: first.start(2) + 100, do: 'move', el: 'ans-neg', to: 'a-sort', dy: -30, dur: 1300 },
					{ at: first.start(2) + 100, do: 'move', el: 'hl', to: 'l-18', dur: 800 },
					{ at: first.start(2) + 100, do: 'exit', el: 'cto-on', dur: 400 },
					{ at: first.start(2) + 100, do: 'exit', el: 'a1', dur: 400 },
					{ at: first.start(2) + 100, do: 'exit', el: 'r1', dur: 400 },
					{ at: first.start(2) + 1500, do: 'exit', el: 'z-01', dur: 300 },
					{ at: first.start(2) + 1500, do: 'enter', el: 'x-01' },
					{ at: first.start(2) + 2300, do: 'move', el: 'bk-n', to: 's-0', dur: 1300 },
					{ at: first.start(2) + 2300, do: 'move', el: 'bk-r', to: 's-1', dur: 1300 },
					{ at: first.start(2) + 3700, do: 'exit', el: 'x-01', dur: 400 },
					{ at: first.start(2) + 3700, do: 'exit', el: 'ans-neg', dur: 400 },
				),
			},
		},
		{
			id: 'rest',
			chapter: 'compare',
			scene: 'journey',
			title: { es: 'Solo importa el signo', en: 'Only the sign matters' },
			subtitles: rest.list,
			motion: {
				cues: seq(
					shot(0, 'shot-wide', 1600),
					...compare({ at: c2, zone: 'z-12', chip: 'a2', result: 'r2', answer: 'ans-neg', from: 'a-sort', to: 'a-cto', lit: 'cto-on', bar: { call: 'l-18', body: 'l-9' } }),
					{ at: answered(c2), do: 'exit', el: 'z-12', dur: 300 },
					{ at: answered(c2), do: 'enter', el: 'x-12' },
					{ at: answered(c2) + 400, do: 'move', el: 'bk-f', to: 's-1', dur: 1100 },
					{ at: answered(c2) + 400, do: 'move', el: 'bk-r', to: 's-2', dur: 1100 },
					{ at: answered(c2) + 1500, do: 'exit', el: 'x-12', dur: 300 },
					{ at: answered(c2) + 1500, do: 'exit', el: 'ans-neg', dur: 300 },
					{ at: answered(c2) + 1500, do: 'exit', el: 'a2', dur: 300 },
					{ at: answered(c2) + 1500, do: 'exit', el: 'r2', dur: 300 },
					...compare({ at: c3, zone: 'z-01', chip: 'a3', result: 'r3', answer: 'ans-pos', from: 'a-sort', to: 'a-cto', lit: 'cto-on', bar: { call: 'l-18', body: 'l-9' } }),
					// A positive sign: the pair is already in order and nothing moves.
					{ at: answered(c3), do: 'exit', el: 'z-01', dur: 300 },
					{ at: answered(c3), do: 'enter', el: 'ok-01' },
					{ at: answered(c3) + 400, do: 'pulse', el: 'bk-f' },
					{ at: answered(c3) + 1700, do: 'exit', el: 'ok-01', dur: 300 },
					{ at: answered(c3) + 1700, do: 'exit', el: 'ans-pos', dur: 300 },
					{ at: answered(c3) + 1700, do: 'exit', el: 'a3', dur: 300 },
					{ at: answered(c3) + 1700, do: 'exit', el: 'r3', dur: 300 },
					shot(rest.start(2), 'shot-main', 2000),
					{ at: rest.start(2) + 300, do: 'enter', el: 'sorted-t' },
					{ at: rest.start(2) + 900, do: 'draw', el: 'fl-2', dur: 500 },
					{ at: rest.start(2) + 1000, do: 'move', el: 'p', to: 'a-print', dur: 800 },
					{ at: rest.start(2) + 1000, do: 'move', el: 'hl', to: 'l-19', dur: 600 },
					{ at: rest.start(2) + 1800, do: 'enter', el: 'print-on' },
					{ at: rest.start(2) + 1900, do: 'type', el: 'out-1', dur: 300 },
					{ at: rest.start(2) + 2400, do: 'type', el: 'out-2', dur: 400 },
					{ at: rest.start(2) + 3000, do: 'type', el: 'out-3', dur: 400 },
				),
			},
		},

		// ─── Scene 5. Comparator: another order, from outside ───────────────
		{
			id: 'outside',
			chapter: 'comparator',
			scene: 'journey',
			title: { es: 'Un orden fuera de la clase', en: 'An order outside the class' },
			subtitles: outside.list,
			motion: {
				cues: seq(
					shot(0, 'shot-out', 2400),
					{ at: 0, do: 'exit', el: 'sorted-t', dur: 400 },
					{ at: 400, do: 'type', el: 'ea-21', dur: 1100 },
					{ at: 600, do: 'enter', el: 'm-sort2' },
					{ at: 1700, do: 'type', el: 'ea-22', dur: 900 },
					{ at: 1900, do: 'enter', el: 'm-print2' },
					{ at: 2300, do: 'draw', el: 'tr-rest', dur: 900 },
					{ at: 3200, do: 'pulse', el: 'm-cto' },
					// The Comparator is a separate object: it stands beside the class, not in it.
					{ at: outside.start(1) + 200, do: 'enter', el: 'floor-c' },
					{ at: outside.start(1) + 300, do: 'enter', el: 'hv-21' },
					{ at: outside.start(1) + 700, do: 'enter', el: 'm-cmp' },
					{ at: outside.start(1) + 1200, do: 'enter', el: 'lb-cmp' },
					{ at: outside.start(1) + 1900, do: 'pulse', el: 'm-cmp' },
					{ at: outside.start(1) + 2900, do: 'enter', el: 'untouched' },
					{ at: outside.start(1) + 3600, do: 'pulse', el: 'untouched' },
				),
			},
		},
		{
			id: 'pages',
			chapter: 'comparator',
			scene: 'journey',
			title: { es: 'Ahora responde el Comparator', en: 'Now the Comparator answers' },
			subtitles: pages.list,
			motion: {
				cues: seq(
					shot(0, 'shot-cmp', 2200),
					{ at: 0, do: 'exit', el: 'hv-21', dur: 400 },
					{ at: 0, do: 'exit', el: 'untouched', dur: 400 },
					{ at: 400, do: 'draw', el: 'fl-3', dur: 800 },
					{ at: 500, do: 'move', el: 'p', to: 'a-sort2', dur: 1200 },
					{ at: 500, do: 'move', el: 'hl', to: 'l-21', dur: 700 },
					{ at: 1700, do: 'enter', el: 'sort2-on' },
					{ at: 1700, do: 'pulse', el: 'm-sort2' },
					{ at: d1 + 300, do: 'draw', el: 'fl-q2', dur: 800 },
					...compare({ at: d1, zone: 'z-01', chip: 'b1', result: 'rb1', answer: 'ans-neg', from: 'a-sort2', to: 'a-cmp', lit: 'cmp-on' }),
					{ at: pages.start(1) + 1100, do: 'exit', el: 'z-01', dur: 300 },
					{ at: pages.start(1) + 1100, do: 'enter', el: 'x-01' },
					{ at: pages.start(1) + 1600, do: 'move', el: 'bk-f', to: 's-0', dur: 1300 },
					{ at: pages.start(1) + 1600, do: 'move', el: 'bk-n', to: 's-1', dur: 1300 },
					{ at: pages.start(1) + 3100, do: 'exit', el: 'x-01', dur: 300 },
					{ at: pages.start(1) + 3100, do: 'exit', el: 'ans-neg', dur: 300 },
					{ at: pages.start(1) + 3100, do: 'exit', el: 'b1', dur: 300 },
					{ at: pages.start(1) + 3100, do: 'exit', el: 'rb1', dur: 300 },
					...compare({ at: d2, zone: 'z-12', chip: 'b2', result: 'rb2', answer: 'ans-pos', from: 'a-sort2', to: 'a-cmp', lit: 'cmp-on' }),
					{ at: answered(d2), do: 'exit', el: 'z-12', dur: 300 },
					{ at: answered(d2), do: 'enter', el: 'ok-12' },
					{ at: answered(d2) + 300, do: 'pulse', el: 'bk-r' },
					{ at: answered(d2) + 1000, do: 'exit', el: 'ok-12', dur: 300 },
					{ at: answered(d2) + 1000, do: 'exit', el: 'ans-pos', dur: 300 },
					{ at: answered(d2) + 1000, do: 'exit', el: 'b2', dur: 300 },
					{ at: answered(d2) + 1000, do: 'exit', el: 'rb2', dur: 300 },
					{ at: answered(d2) + 1100, do: 'enter', el: 'sorted-p' },
					{ at: answered(d2) + 1200, do: 'draw', el: 'fl-4', dur: 500 },
					{ at: answered(d2) + 1300, do: 'move', el: 'p', to: 'a-print2', dur: 800 },
					{ at: answered(d2) + 1300, do: 'move', el: 'hl', to: 'l-22', dur: 600 },
					{ at: answered(d2) + 2100, do: 'enter', el: 'print2-on' },
					{ at: answered(d2) + 2200, do: 'type', el: 'out-4', dur: 400 },
					{ at: answered(d2) + 2600, do: 'type', el: 'out-5', dur: 300 },
					{ at: answered(d2) + 3000, do: 'type', el: 'out-6', dur: 400 },
				),
			},
		},

		// ─── Scene 6. Two ways to sort ──────────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'Comparable y Comparator', en: 'Comparable and Comparator' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					// The camera pulls back to reveal the whole system and the path taken.
					{ at: 0, do: 'camera', to: 'all', dur: 3200 },
					{ at: 300, do: 'exit', el: 'hl', dur: 400 },
					{ at: 600, do: 'flow', el: 'fl-0' },
					{ at: 600, do: 'flow', el: 'fl-1' },
					{ at: 600, do: 'flow', el: 'fl-2' },
					{ at: 600, do: 'flow', el: 'fl-3' },
					{ at: 600, do: 'flow', el: 'fl-4' },
					{ at: 1400, do: 'flow', el: 'fl-q1' },
					{ at: 1400, do: 'flow', el: 'fl-q2' },
					{ at: 2600, do: 'pulse', el: 'shelf' },
					{ at: recap.start(1) + 200, do: 'enter', el: 'cto-on' },
					{ at: recap.start(1) + 300, do: 'enter', el: 'hv-9' },
					{ at: recap.start(1) + 400, do: 'pulse', el: 'm-cto' },
					{ at: recap.start(1) + 1200, do: 'pulse', el: 'lb-cto' },
					{ at: recap.start(2) + 200, do: 'enter', el: 'cmp-on' },
					{ at: recap.start(2) + 300, do: 'enter', el: 'hv-21' },
					{ at: recap.start(2) + 400, do: 'pulse', el: 'm-cmp' },
					{ at: recap.start(2) + 1200, do: 'pulse', el: 'lb-cmp' },
				),
			},
		},
	],
};
