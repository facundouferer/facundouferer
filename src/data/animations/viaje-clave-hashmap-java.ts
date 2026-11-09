import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a key": a short film (under two minutes) for the Java lesson
// "Colecciones en Java y Genéricos (JCF)". It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/viaje-clave-hashmap-java.astro`):
// an isometric system where every instruction of `main` is a module, a light blue
// particle is the execution flow and a light blue object is the key that travels
// from `put` to its bucket. The collision is magenta and `equals` is violet.
// The code is drawn inside the canvas (an editor that highlights the running line),
// so every step is a motion step and the cues below keep both halves in sync.

// ─── The data of the film ───────────────────────────────────────────────────
// The hashes on screen are the real ones: the component computes them with the two
// functions below, which mirror `String.hashCode()` and the spreading `HashMap` does.

/** `String.hashCode()`: s[0]*31^(n-1) + … + s[n-1], in 32-bit arithmetic. */
export function javaHashCode(text: string): number {
	let hash = 0;
	for (const char of text) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) | 0;
	return hash;
}

/** Bucket of a key: `(h ^ (h >>> 16)) & (n - 1)`, with `n` a power of two. */
export function bucketOf(text: string, capacity = 16): number {
	const hash = javaHashCode(text);
	return (hash ^ (hash >>> 16)) & (capacity - 1);
}

export const CAPACITY = 16;

/**
 * The three entries, localized like the lesson does ("gato"/"mesa" collide in
 * Spanish, "cat"/"bird" in English). The first and the third share a bucket.
 */
export const entries = {
	es: [
		{ key: 'gato', value: 3 },
		{ key: 'luna', value: 7 },
		{ key: 'mesa', value: 5 },
	],
	en: [
		{ key: 'cat', value: 3 },
		{ key: 'moon', value: 7 },
		{ key: 'bird', value: 5 },
	],
} as const;

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

/** The travelling key hovers a little above the anchor the particle would use. */
const KEY_DY = -14;
const fly = (at: number, el: string, to: string, dur: number): MotionCue => ({ at, do: 'move', el, to, dy: KEY_DY, dur });

/** Clears the lit route and states of the previous call before the next line runs. */
const clear = (...ids: string[]): MotionCue[] => ids.map((el) => ({ at: 0, do: 'exit', el, dur: 400 }));

// ─── Captions ───────────────────────────────────────────────────────────────
const build = timed(
	say('Este programa cuenta palabras en un `Map`: asocia cada clave con un valor.', 'This program counts words in a `Map`: it associates each key with a value.'),
	say('Por dentro, un `HashMap` es un arreglo de buckets. Con capacidad 16, son 16 cajones.', 'Inside, a `HashMap` is an array of buckets. With capacity 16, that is 16 drawers.'),
);
const hash = timed(
	say('`put("gato", 3)` no busca un lugar libre: primero le pide a la clave su `hashCode()`.', '`put("cat", 3)` does not look for a free slot: it first asks the key for its `hashCode()`.'),
	say('La clave responde con un número entero: para "gato" es 3165397.', 'The key answers with an integer: for "cat" it is 98262.'),
	say('Java mezcla sus bits y aplica una máscara. El resultado es el bucket 5.', 'Java mixes its bits and applies a mask. The result is bucket 7.'),
);
const store = timed(
	say('Ese número es una dirección: la clave va directo a su bucket, sin mirar los demás.', 'That number is an address: the key goes straight to its bucket, ignoring the others.'),
	say('Allí se guarda la entrada completa: la clave junto con su valor.', 'The whole entry is stored there: the key together with its value.'),
);
const second = timed(
	say('Otra clave, otro hash: "luna" termina en el bucket 14.', 'Another key, another hash: "moon" ends up in bucket 2.'),
	say('Con un hash bien distribuido, las claves casi nunca comparten bucket.', 'With a well-distributed hash, keys almost never share a bucket.'),
);
const collide = timed(
	say('Ahora llega "mesa". Su hash es distinto al de "gato"…', 'Now "bird" arrives. Its hash is different from that of "cat"…'),
	say('…pero después de la máscara, el resultado vuelve a ser el bucket 5.', '…but after the mask, the result is bucket 7 again.'),
	say('Es una colisión: dos claves distintas cayeron en el mismo bucket.', 'It is a collision: two different keys landed in the same bucket.'),
);
const equals = timed(
	say('Dentro del bucket, `equals()` compara la clave nueva con la que ya estaba.', 'Inside the bucket, `equals()` compares the new key with the one already there.'),
	say('"mesa" no es igual a "gato": son claves distintas y se guardan las dos.', '"bird" is not equal to "cat": they are different keys and both are kept.'),
);
const get = timed(
	say('`get("mesa")` repite el camino: la misma clave produce siempre el mismo hash.', '`get("bird")` repeats the path: the same key always produces the same hash.'),
	say('En el bucket 5, `equals()` descarta "gato" y reconoce "mesa".', 'In bucket 7, `equals()` rules out "cat" and recognizes "bird".'),
	say('El mapa devuelve el valor asociado a esa clave: 5.', 'The map returns the value associated with that key: 5.'),
);
const direct = timed(
	say('No recorrió la colección: hizo una cuenta y fue a un solo bucket. Por eso `get()` es O(1).', 'It did not walk the collection: one calculation, one bucket. That is why `get()` is O(1).'),
	say('En una `List`, buscar un elemento obliga a recorrerla: O(n).', 'In a `List`, finding an element means walking through it: O(n).'),
	say('`hashCode()` elige el cajón; `equals()` elige el elemento dentro del cajón.', '`hashCode()` picks the drawer; `equals()` picks the element inside the drawer.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'map', label: { es: 'Un arreglo de buckets', en: 'An array of buckets' } },
		{ id: 'hash', label: { es: 'put calcula el hash', en: 'put computes the hash' } },
		{ id: 'bucket', label: { es: 'El hash elige el bucket', en: 'The hash picks the bucket' } },
		{ id: 'collision', label: { es: 'Una colisión', en: 'A collision' } },
		{ id: 'equals', label: { es: 'equals distingue las claves', en: 'equals tells the keys apart' } },
		{ id: 'get', label: { es: 'get repite el camino', en: 'get repeats the path' } },
	],
	steps: [
		// ─── Scene 1. An array of buckets ───────────────────────────────────
		{
			id: 'build',
			chapter: 'map',
			scene: 'journey',
			title: { es: 'Un mapa de claves y valores', en: 'A map of keys and values' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-main', 5000),
					{ at: 200, do: 'type', el: 'e-1', dur: 400 },
					{ at: 600, do: 'type', el: 'e-2', dur: 350 },
					{ at: 950, do: 'type', el: 'e-3', dur: 50 },
					{ at: 1000, do: 'type', el: 'e-4', dur: 350 },
					{ at: 1400, do: 'type', el: 'e-5', dur: 600 },
					{ at: 2000, do: 'enter', el: 'm-l6' },
					{ at: 2100, do: 'type', el: 'e-6', dur: 800 },
					{ at: 2900, do: 'enter', el: 'm-l7' },
					{ at: 3000, do: 'type', el: 'e-7', dur: 400 },
					{ at: 3400, do: 'enter', el: 'm-l8' },
					{ at: 3500, do: 'type', el: 'e-8', dur: 400 },
					{ at: 3900, do: 'enter', el: 'm-l9' },
					{ at: 4000, do: 'type', el: 'e-9', dur: 400 },
					{ at: 4400, do: 'enter', el: 'm-l10' },
					{ at: 4500, do: 'type', el: 'e-10', dur: 600 },
					{ at: 5100, do: 'type', el: 'e-11', dur: 150 },
					{ at: 5250, do: 'type', el: 'e-12', dur: 150 },
					// Line 6 runs: `new HashMap<>()` builds the array.
					{ at: build.start(1), do: 'enter', el: 'hl' },
					{ at: build.start(1), do: 'enter', el: 'p' },
					{ at: build.start(1) + 100, do: 'enter', el: 'l6-on' },
					{ at: build.start(1) + 100, do: 'pulse', el: 'm-l6' },
					shot(build.start(1) + 200, 'shot-all', 2600),
					{ at: build.start(1) + 700, do: 'enter', el: 'array', dur: 900 },
					{ at: build.start(1) + 1700, do: 'draw', el: 'tr-out', dur: 1000 },
					{ at: build.start(1) + 2600, do: 'enter', el: 'm-h' },
					{ at: build.start(1) + 2900, do: 'enter', el: 'm-x' },
					{ at: build.start(1) + 3200, do: 'draw', el: 'tr-fan', dur: 800 },
					{ at: build.start(1) + 4300, do: 'pulse', el: 'array' },
				),
			},
		},

		// ─── Scene 2. put computes the hash ─────────────────────────────────
		{
			id: 'hash',
			chapter: 'hash',
			scene: 'journey',
			title: { es: 'put le pide a la clave su hashCode()', en: 'put asks the key for its hashCode()' },
			subtitles: hash.list,
			motion: {
				cues: seq(
					shot(0, 'shot-hash', 1800),
					{ at: 0, do: 'exit', el: 'l6-on', dur: 300 },
					{ at: 0, do: 'move', el: 'p', to: 'a-l7', dur: 700 },
					{ at: 0, do: 'move', el: 'hl', to: 'ln-7', dur: 600 },
					{ at: 700, do: 'enter', el: 'l7-on' },
					{ at: 700, do: 'pulse', el: 'm-l7' },
					// The key is born at the instruction that passes it to the map.
					{ at: 1100, do: 'enter', el: 'k1', dur: 700 },
					{ at: 2700, do: 'draw', el: 'fl-in-7', dur: 600 },
					fly(2800, 'k1', 'a-h', 1000),
					{ at: 3900, do: 'pulse', el: 'm-h' },
					{ at: hash.start(1), do: 'enter', el: 'h-on' },
					{ at: hash.start(1) + 300, do: 'pulse', el: 'k1' },
					{ at: hash.start(1) + 700, do: 'enter', el: 'ch-h1' },
					{ at: hash.start(2), do: 'draw', el: 'fl-hx', dur: 500 },
					fly(hash.start(2) + 100, 'k1', 'a-x', 900),
					{ at: hash.start(2) + 1000, do: 'enter', el: 'x-on' },
					{ at: hash.start(2) + 1000, do: 'pulse', el: 'm-x' },
					{ at: hash.start(2) + 1200, do: 'enter', el: 'ch-f' },
					{ at: hash.start(2) + 2600, do: 'enter', el: 'ch-x1' },
					{ at: hash.start(2) + 3400, do: 'pulse', el: 'ch-x1' },
				),
			},
		},

		// ─── Scene 3. The hash picks the bucket ─────────────────────────────
		{
			id: 'store',
			chapter: 'bucket',
			scene: 'journey',
			title: { es: 'Directo al bucket', en: 'Straight to the bucket' },
			subtitles: store.list,
			motion: {
				cues: seq(
					shot(0, 'shot-route', 2000),
					{ at: 0, do: 'exit', el: 'ch-f', dur: 400 },
					{ at: 0, do: 'exit', el: 'ch-h1', dur: 400 },
					{ at: 0, do: 'exit', el: 'h-on', dur: 400 },
					{ at: 700, do: 'draw', el: 'fl-r1', dur: 1300 },
					fly(900, 'k1', 'a-b1', 1700),
					{ at: 2600, do: 'enter', el: 'b1-on' },
					{ at: 2700, do: 'pulse', el: 'b1-on' },
					shot(store.start(1), 'shot-b1', 1600),
					{ at: store.start(1) + 200, do: 'exit', el: 'x-on', dur: 400 },
					{ at: store.start(1) + 200, do: 'exit', el: 'ch-x1', dur: 400 },
					{ at: store.start(1) + 900, do: 'exit', el: 'k1', dur: 300 },
					{ at: store.start(1) + 1000, do: 'enter', el: 'n1' },
					{ at: store.start(1) + 2200, do: 'pulse', el: 'n1' },
				),
			},
		},
		{
			id: 'second',
			chapter: 'bucket',
			scene: 'journey',
			title: { es: 'Otra clave, otro bucket', en: 'Another key, another bucket' },
			subtitles: second.list,
			motion: {
				cues: seq(
					...clear('fl-in-7', 'fl-hx', 'fl-r1', 'b1-on', 'l7-on'),
					{ at: 0, do: 'move', el: 'p', to: 'a-l8', dur: 700 },
					{ at: 0, do: 'move', el: 'hl', to: 'ln-8', dur: 600 },
					shot(100, 'shot-hash', 1800),
					{ at: 800, do: 'enter', el: 'l8-on' },
					{ at: 800, do: 'pulse', el: 'm-l8' },
					{ at: 1000, do: 'enter', el: 'k2', dur: 600 },
					{ at: 1700, do: 'draw', el: 'fl-in-8', dur: 500 },
					fly(1800, 'k2', 'a-h', 800),
					{ at: 2600, do: 'enter', el: 'h-on' },
					{ at: 2800, do: 'enter', el: 'ch-h2' },
					{ at: 3300, do: 'enter', el: 'fl-hx', dur: 400 },
					fly(3400, 'k2', 'a-x', 700),
					{ at: 4100, do: 'enter', el: 'x-on' },
					{ at: 4300, do: 'enter', el: 'ch-x2' },
					shot(second.start(1), 'shot-b2', 1800),
					{ at: second.start(1) + 200, do: 'draw', el: 'fl-r2', dur: 1100 },
					fly(second.start(1) + 300, 'k2', 'a-b2', 1500),
					{ at: second.start(1) + 1800, do: 'enter', el: 'b2-on' },
					{ at: second.start(1) + 2300, do: 'exit', el: 'k2', dur: 300 },
					{ at: second.start(1) + 2400, do: 'enter', el: 'n2' },
					// Both entries, each in its own bucket: the readings of this call are cleared.
					{ at: second.start(1) + 3100, do: 'exit', el: 'ch-h2', dur: 400 },
					{ at: second.start(1) + 3100, do: 'exit', el: 'ch-x2', dur: 400 },
					{ at: second.start(1) + 3100, do: 'exit', el: 'h-on', dur: 400 },
					{ at: second.start(1) + 3100, do: 'exit', el: 'x-on', dur: 400 },
					shot(second.start(1) + 3300, 'shot-all', 1600),
				),
			},
		},

		// ─── Scene 4. A collision ───────────────────────────────────────────
		{
			id: 'collide',
			chapter: 'collision',
			scene: 'journey',
			title: { es: 'Dos claves, un mismo bucket', en: 'Two keys, one bucket' },
			subtitles: collide.list,
			motion: {
				cues: seq(
					...clear('fl-in-8', 'fl-hx', 'fl-r2', 'b2-on', 'l8-on'),
					{ at: 0, do: 'move', el: 'p', to: 'a-l9', dur: 700 },
					{ at: 0, do: 'move', el: 'hl', to: 'ln-9', dur: 600 },
					shot(100, 'shot-hash', 1800),
					{ at: 800, do: 'enter', el: 'l9-on' },
					{ at: 800, do: 'pulse', el: 'm-l9' },
					{ at: 1000, do: 'enter', el: 'k3', dur: 600 },
					{ at: 1700, do: 'draw', el: 'fl-in-9', dur: 500 },
					fly(1800, 'k3', 'a-h', 800),
					{ at: 2600, do: 'enter', el: 'h-on' },
					// Both hashes side by side: they are different numbers.
					{ at: 2800, do: 'enter', el: 'ch-h3' },
					{ at: 3300, do: 'enter', el: 'ch-h1' },
					{ at: collide.start(1), do: 'enter', el: 'fl-hx', dur: 400 },
					fly(collide.start(1) + 100, 'k3', 'a-x', 800),
					{ at: collide.start(1) + 900, do: 'enter', el: 'x-on' },
					{ at: collide.start(1) + 900, do: 'pulse', el: 'm-x' },
					{ at: collide.start(1) + 1100, do: 'enter', el: 'ch-x1' },
					{ at: collide.start(1) + 1800, do: 'pulse', el: 'ch-x1' },
					// It travels to the bucket that already holds an entry.
					shot(collide.start(2) - 2300, 'shot-b1', 2000),
					{ at: collide.start(2) - 2200, do: 'exit', el: 'ch-x1', dur: 400 },
					{ at: collide.start(2) - 2100, do: 'enter', el: 'fl-r1', dur: 500 },
					fly(collide.start(2) - 1900, 'k3', 'a-b1', 1700),
					{ at: collide.start(2), do: 'enter', el: 'b1-x' },
					{ at: collide.start(2) + 100, do: 'pulse', el: 'b1-x' },
					{ at: collide.start(2) + 500, do: 'enter', el: 'col' },
					{ at: collide.start(2) + 2200, do: 'pulse', el: 'n1' },
				),
			},
		},

		// ─── Scene 5. equals tells the keys apart ───────────────────────────
		{
			id: 'equals',
			chapter: 'equals',
			scene: 'journey',
			title: { es: 'equals() compara las claves', en: 'equals() compares the keys' },
			subtitles: equals.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'ch-h1', dur: 400 },
					{ at: 0, do: 'exit', el: 'ch-h3', dur: 400 },
					// The new key is held next to the stored one while they are compared.
					fly(400, 'k3', 'a-n1', 900),
					{ at: 1300, do: 'enter', el: 'scan-1' },
					{ at: 1600, do: 'pulse', el: 'scan-1' },
					{ at: 2200, do: 'enter', el: 'eq-no' },
					{ at: equals.start(1) + 200, do: 'exit', el: 'scan-1', dur: 400 },
					fly(equals.start(1) + 300, 'k3', 'a-n3', 900),
					{ at: equals.start(1) + 1200, do: 'exit', el: 'k3', dur: 300 },
					{ at: equals.start(1) + 1300, do: 'enter', el: 'n3' },
					{ at: equals.start(1) + 1400, do: 'exit', el: 'b1-x', dur: 500 },
					{ at: equals.start(1) + 1400, do: 'exit', el: 'col', dur: 500 },
					{ at: equals.start(1) + 1500, do: 'enter', el: 'b1-on' },
					{ at: equals.start(1) + 2400, do: 'pulse', el: 'n3' },
					{ at: equals.start(1) + 3600, do: 'exit', el: 'eq-no', dur: 400 },
				),
			},
		},

		// ─── Scene 6. get repeats the path ──────────────────────────────────
		{
			id: 'get',
			chapter: 'get',
			scene: 'journey',
			title: { es: 'get() sigue el mismo camino', en: 'get() follows the same path' },
			subtitles: get.list,
			motion: {
				cues: seq(
					...clear('fl-in-9', 'fl-hx', 'fl-r1', 'b1-on', 'l9-on', 'h-on', 'x-on'),
					{ at: 0, do: 'move', el: 'p', to: 'a-l10', dur: 700 },
					{ at: 0, do: 'move', el: 'hl', to: 'ln-10', dur: 600 },
					shot(100, 'shot-hash', 1800),
					{ at: 800, do: 'enter', el: 'l10-on' },
					{ at: 800, do: 'pulse', el: 'm-l10' },
					{ at: 1000, do: 'enter', el: 'kq', dur: 600 },
					{ at: 1700, do: 'draw', el: 'fl-in-10', dur: 500 },
					fly(1800, 'kq', 'a-h', 800),
					{ at: 2600, do: 'enter', el: 'h-on' },
					{ at: 2800, do: 'enter', el: 'ch-h3' },
					{ at: 3500, do: 'enter', el: 'fl-hx', dur: 400 },
					fly(3600, 'kq', 'a-x', 700),
					{ at: 4300, do: 'enter', el: 'x-on' },
					{ at: 4500, do: 'enter', el: 'ch-x1' },
					// Same bucket; equals checks the entries one by one.
					shot(get.start(1), 'shot-b1', 1700),
					{ at: get.start(1) + 100, do: 'exit', el: 'ch-x1', dur: 400 },
					{ at: get.start(1), do: 'enter', el: 'fl-r1', dur: 400 },
					fly(get.start(1) + 100, 'kq', 'a-b1', 1300),
					{ at: get.start(1) + 1400, do: 'enter', el: 'b1-on' },
					fly(get.start(1) + 1700, 'kq', 'a-n1', 600),
					{ at: get.start(1) + 2400, do: 'enter', el: 'scan-1' },
					{ at: get.start(1) + 2500, do: 'enter', el: 'eq-no' },
					{ at: get.start(1) + 3300, do: 'exit', el: 'scan-1', dur: 300 },
					{ at: get.start(1) + 3300, do: 'exit', el: 'eq-no', dur: 300 },
					fly(get.start(1) + 3400, 'kq', 'a-n3', 500),
					{ at: get.start(1) + 3900, do: 'enter', el: 'scan-3' },
					{ at: get.start(1) + 4000, do: 'enter', el: 'eq-yes' },
					{ at: get.start(1) + 4300, do: 'enter', el: 'n3-hit' },
					{ at: get.start(2), do: 'exit', el: 'kq', dur: 300 },
					{ at: get.start(2), do: 'exit', el: 'scan-3', dur: 400 },
					{ at: get.start(2) + 200, do: 'enter', el: 'val' },
					{ at: get.start(2) + 700, do: 'type', el: 'out-1', dur: 300 },
					{ at: get.start(2) + 1200, do: 'pulse', el: 'val' },
				),
			},
		},
		{
			id: 'direct',
			chapter: 'get',
			scene: 'journey',
			title: { es: 'Una cuenta, un bucket', en: 'One calculation, one bucket' },
			subtitles: direct.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'eq-yes', dur: 400 },
					{ at: 0, do: 'exit', el: 'ch-h3', dur: 400 },
					{ at: 0, do: 'exit', el: 'val', dur: 400 },
					// The camera pulls back to reveal the whole map and the path taken.
					shot(200, 'shot-all', 3000),
					{ at: 600, do: 'flow', el: 'fl-in-10' },
					{ at: 600, do: 'flow', el: 'fl-hx' },
					{ at: 600, do: 'flow', el: 'fl-r1' },
					{ at: 2600, do: 'enter', el: 'o1' },
					{ at: direct.start(1), do: 'exit', el: 'hl', dur: 400 },
					{ at: direct.start(1) + 300, do: 'enter', el: 'on' },
					{ at: direct.start(1) + 1500, do: 'pulse', el: 'on' },
					{ at: direct.start(2) + 300, do: 'pulse', el: 'm-h' },
					{ at: direct.start(2) + 2600, do: 'pulse', el: 'n3-hit' },
				),
			},
		},
	],
};
