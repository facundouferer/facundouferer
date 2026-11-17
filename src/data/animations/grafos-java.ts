import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey through a graph": a short film (about two minutes) for the Java lesson
// "Grafos: Matriz, Lista de Adyacencia, BFS, DFS y Dijkstra". It plays on a single
// persistent canvas (`data-scene="journey"` in `src/components/animaciones/grafos-java.astro`):
// five vertices on an isometric floor stored as an adjacency list, a BFS wave that
// explores them layer by layer through a FIFO queue, and then the same graph with
// weights, where Dijkstra always takes the cheapest pending vertex and relaxes edges
// until it holds the shortest path from A to every vertex.

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

/** Types the lines `from..to` of the first editor page, one after another. */
const typeLines = (at: number, from: number, to: number, gap: number): MotionCue[] =>
	Array.from({ length: to - from + 1 }, (_, index) => ({ at: at + index * gap, do: 'type', el: `ea-${from + index}`, dur: 500 }));

/** The same cue kind for several elements, `gap` ms apart. */
const each = (at: number, kind: 'enter' | 'exit', els: string[], gap = 0, dur?: number): MotionCue[] =>
	els.map((el, index) => ({ at: at + index * gap, do: kind, el, ...(dur ? { dur } : {}) }));

const VERTICES = ['A', 'B', 'C', 'D', 'E'];

// ─── Captions ───────────────────────────────────────────────────────────────
const build = timed(
	say('Este grafo tiene cinco vértices. En Java se guarda como una lista de adyacencia.', 'This graph has five vertices. In Java it is stored as an adjacency list.'),
	say('Un `Map` asocia cada vértice con la lista de sus vecinos.', 'A `Map` links each vertex to the list of its neighbors.'),
	say('No es dirigido: cada arista se agrega en los dos sentidos.', 'It is undirected: each edge is added in both directions.'),
);
const start = timed(
	say('BFS usa dos estructuras: un `Set` de visitados y una cola de pendientes.', 'BFS uses two structures: a `Set` of visited vertices and a queue of pending ones.'),
	say('A se marca como visitado al encolar, no al desencolar.', 'A is marked as visited on enqueue, not on dequeue.'),
);
const layer1 = timed(
	say('La cola entrega a A, el primero que entró, y se agrega al orden de visita.', 'The queue hands over A, the first one in, and it joins the visit order.'),
	say('Sus vecinos B y C se marcan y entran a la cola: son la capa 1.', 'Its neighbors B and C are marked and enqueued: they are layer 1.'),
);
const layer2 = timed(
	say('Sale B y encola a D. Al salir C, D ya está visitado: no entra dos veces.', 'B leaves and enqueues D. When C leaves, D is already visited: it never enters twice.'),
	say('Luego D encola a E. BFS explora por capas: 1 salto, 2 saltos, 3 saltos.', 'Then D enqueues E. BFS explores layer by layer: 1 hop, 2 hops, 3 hops.'),
	say('Por eso BFS encuentra el camino con menos aristas.', 'That is why BFS finds the path with the fewest edges.'),
);
const weights = timed(
	say('Ahora cada arista tiene un peso: kilómetros, minutos o costo.', 'Now every edge has a weight: kilometers, minutes or cost.'),
	say('Para BFS, el camino de A a B es la arista directa: 1 salto, pero cuesta 4.', 'For BFS, the path from A to B is the direct edge: 1 hop, but it costs 4.'),
	say('Por A → C → B hay más saltos, pero cuesta 2 + 1 = 3. Menos aristas no es lo más barato.', 'Through A → C → B there are more hops, yet it costs 2 + 1 = 3. Fewer edges is not cheapest.'),
);
const relax = timed(
	say('Dijkstra usa una cola de prioridad: siempre sale el vértice pendiente más barato.', 'Dijkstra uses a priority queue: the cheapest pending vertex always comes out first.'),
	say('Desde A, B queda a 4 y C a 2. Sale C, que es el más barato.', 'From A, B is at 4 and C is at 2. C comes out: it is the cheapest.'),
	say('Relajar: por C, B cuesta 2 + 1 = 3, menos que 4. Su distancia se actualiza.', 'Relaxing: through C, B costs 2 + 1 = 3, less than 4. Its distance is updated.'),
);
const settle = timed(
	say('Sale B con 3: por B, D cuesta 3 + 5 = 8, mejor que 10. Se relaja otra vez.', 'B comes out at 3: through B, D costs 3 + 5 = 8, better than 10. Relaxed again.'),
	say('Sale D con 8 y E queda a 8 + 3 = 11. Cada vértice procesado ya es definitivo.', 'D comes out at 8 and E ends at 8 + 3 = 11. Each processed vertex is final.'),
);
const recap = timed(
	say('El resultado es el camino más corto desde A hasta cada vértice.', 'The result is the shortest path from A to every vertex.'),
	say('BFS cuenta aristas; Dijkstra suma pesos. Dijkstra no funciona con pesos negativos.', 'BFS counts edges; Dijkstra adds weights. Dijkstra does not work with negative weights.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'graph', label: { es: 'Un grafo en memoria', en: 'A graph in memory' } },
		{ id: 'queue', label: { es: 'La cola de pendientes', en: 'The pending queue' } },
		{ id: 'wave', label: { es: 'BFS explora por capas', en: 'BFS explores in layers' } },
		{ id: 'weights', label: { es: 'Las aristas tienen peso', en: 'Edges have weights' } },
		{ id: 'dijkstra', label: { es: 'Dijkstra relaja aristas', en: 'Dijkstra relaxes edges' } },
		{ id: 'path', label: { es: 'El camino más corto', en: 'The shortest path' } },
	],
	steps: [
		// ─── Scene 1. A graph in memory ─────────────────────────────────────
		{
			id: 'build',
			chapter: 'graph',
			scene: 'journey',
			title: { es: 'Una lista de adyacencia', en: 'An adjacency list' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-build', 2000),
					{ at: 200, do: 'enter', el: 'floor' },
					{ at: 300, do: 'type', el: 'ea-1', dur: 900 },
					...each(600, 'enter', VERTICES.map((v) => `v-${v}`), 150),
					{ at: 1400, do: 'type', el: 'ea-2', dur: 600 },
					{ at: 1500, do: 'draw', el: 'e-AB', dur: 500 },
					{ at: 1800, do: 'draw', el: 'e-AC', dur: 500 },
					{ at: 2200, do: 'type', el: 'ea-3', dur: 600 },
					{ at: 2300, do: 'draw', el: 'e-CB', dur: 500 },
					{ at: 2600, do: 'draw', el: 'e-BD', dur: 500 },
					{ at: 3000, do: 'type', el: 'ea-4', dur: 600 },
					{ at: 3100, do: 'draw', el: 'e-CD', dur: 500 },
					{ at: 3400, do: 'draw', el: 'e-DE', dur: 500 },
					{ at: build.start(1) + 100, do: 'enter', el: 'adj-t' },
					...each(build.start(1) + 400, 'enter', VERTICES.map((v) => `adj-${v}`), 250),
					{ at: build.start(1) + 2400, do: 'pulse', el: 'adj-C' },
					{ at: build.start(1) + 2500, do: 'pulse', el: 'v-C' },
					// Undirected: A lists B and B lists A.
					{ at: build.start(2) + 300, do: 'pulse', el: 'e-AB' },
					{ at: build.start(2) + 500, do: 'pulse', el: 'adj-A' },
					{ at: build.start(2) + 1300, do: 'pulse', el: 'adj-B' },
				),
			},
		},

		// ─── Scene 2. The pending queue ─────────────────────────────────────
		{
			id: 'start',
			chapter: 'queue',
			scene: 'journey',
			title: { es: 'Visitados y pendientes', en: 'Visited and pending' },
			subtitles: start.list,
			motion: {
				cues: seq(
					shot(0, 'shot-queue', 2000),
					...typeLines(200, 5, 7, 700),
					{ at: 1700, do: 'enter', el: 'tray' },
					{ at: 2000, do: 'enter', el: 'q-lb' },
					{ at: 2800, do: 'pulse', el: 'tray' },
					{ at: start.start(1), do: 'type', el: 'ea-8', dur: 600 },
					{ at: start.start(1), do: 'enter', el: 'hl' },
					{ at: start.start(1) + 300, do: 'enter', el: 'hm-8' },
					{ at: start.start(1) + 400, do: 'enter', el: 'on-A' },
					{ at: start.start(1) + 800, do: 'type', el: 'ea-9', dur: 500 },
					{ at: start.start(1) + 800, do: 'move', el: 'hl', to: 'ln-9', dur: 500 },
					{ at: start.start(1) + 900, do: 'enter', el: 'tk-A' },
					{ at: start.start(1) + 1100, do: 'move', el: 'tk-A', to: 'q-1', dur: 1100 },
					{ at: start.start(1) + 2400, do: 'pulse', el: 'tk-A' },
					...typeLines(start.start(1) + 2600, 10, 17, 120),
				),
			},
		},

		// ─── Scene 3. BFS explores in layers ────────────────────────────────
		{
			id: 'layer1',
			chapter: 'wave',
			scene: 'journey',
			title: { es: 'Capa 1: los vecinos de A', en: 'Layer 1: the neighbors of A' },
			subtitles: layer1.list,
			motion: {
				cues: seq(
					shot(0, 'shot-wave', 1600),
					{ at: 0, do: 'exit', el: 'hm-8', dur: 400 },
					{ at: 200, do: 'move', el: 'hl', to: 'ln-10', dur: 400 },
					{ at: 600, do: 'move', el: 'hl', to: 'ln-11', dur: 400 },
					{ at: 800, do: 'move', el: 'tk-A', to: 'q-out', dur: 700 },
					{ at: 900, do: 'move', el: 'p', to: 'a-A', dur: 1 },
					{ at: 1000, do: 'enter', el: 'p' },
					{ at: 1300, do: 'enter', el: 'ring-0' },
					{ at: 1500, do: 'exit', el: 'tk-A', dur: 300 },
					{ at: 1600, do: 'move', el: 'hl', to: 'ln-12', dur: 400 },
					{ at: 2000, do: 'pulse', el: 'v-A' },
					{ at: layer1.start(1), do: 'move', el: 'hl', to: 'ln-13', dur: 400 },
					{ at: layer1.start(1) + 500, do: 'move', el: 'hl', to: 'ln-14', dur: 400 },
					{ at: layer1.start(1) + 600, do: 'draw', el: 'bf-AB', dur: 700 },
					{ at: layer1.start(1) + 900, do: 'enter', el: 'on-B' },
					{ at: layer1.start(1) + 1000, do: 'enter', el: 'tk-B' },
					{ at: layer1.start(1) + 1200, do: 'move', el: 'tk-B', to: 'q-1', dur: 1000 },
					{ at: layer1.start(1) + 1500, do: 'draw', el: 'bf-AC', dur: 700 },
					{ at: layer1.start(1) + 1800, do: 'enter', el: 'on-C' },
					{ at: layer1.start(1) + 1900, do: 'enter', el: 'tk-C' },
					{ at: layer1.start(1) + 2100, do: 'move', el: 'tk-C', to: 'q-2', dur: 1000 },
					{ at: layer1.start(1) + 3200, do: 'enter', el: 'ring-1' },
					{ at: layer1.start(1) + 3800, do: 'pulse', el: 'ring-1' },
				),
			},
		},
		{
			id: 'layer2',
			chapter: 'wave',
			scene: 'journey',
			title: { es: 'Capas 2 y 3: D y E', en: 'Layers 2 and 3: D and E' },
			subtitles: layer2.list,
			motion: {
				cues: seq(
					// B leaves the front and enqueues D; C slides to the front.
					{ at: 0, do: 'move', el: 'hl', to: 'ln-11', dur: 400 },
					{ at: 300, do: 'move', el: 'tk-B', to: 'q-out', dur: 700 },
					{ at: 300, do: 'move', el: 'p', to: 'a-B', dur: 900 },
					{ at: 500, do: 'move', el: 'tk-C', to: 'q-1', dur: 800 },
					{ at: 1000, do: 'exit', el: 'tk-B', dur: 300 },
					{ at: 1300, do: 'move', el: 'hl', to: 'ln-14', dur: 400 },
					{ at: 1400, do: 'draw', el: 'bf-BD', dur: 700 },
					{ at: 1700, do: 'enter', el: 'on-D' },
					{ at: 1800, do: 'enter', el: 'tk-D' },
					{ at: 2000, do: 'move', el: 'tk-D', to: 'q-2', dur: 900 },
					// C leaves: every neighbor is already visited, D is not enqueued again.
					{ at: 2900, do: 'move', el: 'hl', to: 'ln-11', dur: 400 },
					{ at: 3000, do: 'move', el: 'tk-C', to: 'q-out', dur: 700 },
					{ at: 3000, do: 'move', el: 'p', to: 'a-C', dur: 900 },
					{ at: 3300, do: 'move', el: 'tk-D', to: 'q-1', dur: 800 },
					{ at: 3700, do: 'exit', el: 'tk-C', dur: 300 },
					{ at: 4000, do: 'move', el: 'hl', to: 'ln-14', dur: 400 },
					{ at: 4100, do: 'enter', el: 'dup-D' },
					{ at: 4500, do: 'pulse', el: 'on-D' },
					{ at: 4600, do: 'enter', el: 'ring-2' },
					// D leaves and enqueues E; then E leaves and the queue is empty.
					shot(layer2.start(1), 'shot-wave2', 1600),
					{ at: layer2.start(1), do: 'move', el: 'hl', to: 'ln-11', dur: 400 },
					{ at: layer2.start(1) + 100, do: 'move', el: 'tk-D', to: 'q-out', dur: 700 },
					{ at: layer2.start(1) + 100, do: 'move', el: 'p', to: 'a-D', dur: 900 },
					{ at: layer2.start(1) + 400, do: 'exit', el: 'dup-D', dur: 400 },
					{ at: layer2.start(1) + 800, do: 'exit', el: 'tk-D', dur: 300 },
					{ at: layer2.start(1) + 1100, do: 'move', el: 'hl', to: 'ln-14', dur: 400 },
					{ at: layer2.start(1) + 1200, do: 'draw', el: 'bf-DE', dur: 700 },
					{ at: layer2.start(1) + 1500, do: 'enter', el: 'on-E' },
					{ at: layer2.start(1) + 1600, do: 'enter', el: 'tk-E' },
					{ at: layer2.start(1) + 1800, do: 'move', el: 'tk-E', to: 'q-1', dur: 900 },
					{ at: layer2.start(1) + 2800, do: 'move', el: 'hl', to: 'ln-11', dur: 400 },
					{ at: layer2.start(1) + 2900, do: 'move', el: 'tk-E', to: 'q-out', dur: 700 },
					{ at: layer2.start(1) + 2900, do: 'move', el: 'p', to: 'a-E', dur: 900 },
					{ at: layer2.start(1) + 3400, do: 'enter', el: 'ring-3' },
					{ at: layer2.start(1) + 3600, do: 'exit', el: 'tk-E', dur: 300 },
					// The queue is empty: the visit order is printed.
					{ at: layer2.start(2), do: 'move', el: 'hl', to: 'ln-17', dur: 500 },
					{ at: layer2.start(2) + 300, do: 'type', el: 'out-a', dur: 900 },
					{ at: layer2.start(2) + 400, do: 'flow', el: 'bf-AB' },
					{ at: layer2.start(2) + 400, do: 'flow', el: 'bf-AC' },
					{ at: layer2.start(2) + 400, do: 'flow', el: 'bf-BD' },
					{ at: layer2.start(2) + 400, do: 'flow', el: 'bf-DE' },
					{ at: layer2.start(2) + 1500, do: 'pulse', el: 'ring-3' },
				),
			},
		},

		// ─── Scene 4. Edges have weights ────────────────────────────────────
		{
			id: 'weights',
			chapter: 'weights',
			scene: 'journey',
			title: { es: 'Menos saltos no es más barato', en: 'Fewer hops is not cheaper' },
			subtitles: weights.list,
			motion: {
				cues: seq(
					// The BFS run is cleared; the program becomes the weighted one.
					...each(
						0,
						'exit',
						['p', 'hl', 'out-a', 'q-lb', 'ea', 'ring-0', 'ring-1', 'ring-2', 'ring-3', 'bf-AB', 'bf-AC', 'bf-BD', 'bf-DE', ...VERTICES.map((v) => `on-${v}`)],
						0,
						400,
					),
					shot(0, 'shot-weights', 2000),
					{ at: 400, do: 'enter', el: 'eb' },
					...each(600, 'enter', ['w-AB', 'w-AC', 'w-CB', 'w-BD', 'w-CD', 'w-DE'], 200),
					...each(1900, 'exit', VERTICES.map((v) => `adj-${v}`), 0, 400),
					...each(2100, 'enter', VERTICES.map((v) => `adjw-${v}`), 150),
					{ at: weights.start(1) + 200, do: 'draw', el: 'hop-AB', dur: 900 },
					{ at: weights.start(1) + 1100, do: 'enter', el: 'lb-hop' },
					{ at: weights.start(1) + 1800, do: 'pulse', el: 'w-AB' },
					{ at: weights.start(2) + 200, do: 'draw', el: 'via-ACB', dur: 1200 },
					{ at: weights.start(2) + 1400, do: 'enter', el: 'lb-via' },
					{ at: weights.start(2) + 1700, do: 'pulse', el: 'w-AC' },
					{ at: weights.start(2) + 2100, do: 'pulse', el: 'w-CB' },
					{ at: weights.start(2) + 3200, do: 'pulse', el: 'lb-via' },
				),
			},
		},

		// ─── Scene 5. Dijkstra relaxes edges ────────────────────────────────
		{
			id: 'relax',
			chapter: 'dijkstra',
			scene: 'journey',
			title: { es: 'Siempre sale el más barato', en: 'The cheapest always comes out' },
			subtitles: relax.list,
			motion: {
				cues: seq(
					...each(0, 'exit', ['hop-AB', 'lb-hop', 'via-ACB', 'lb-via'], 0, 400),
					shot(0, 'shot-dij', 1800),
					{ at: 100, do: 'move', el: 'hl', to: 'ln-8', dur: 1 },
					{ at: 200, do: 'enter', el: 'hl' },
					{ at: 300, do: 'enter', el: 'pq-lb' },
					...each(500, 'enter', ['d-B-inf', 'd-C-inf', 'd-D-inf', 'd-E-inf'], 150),
					{ at: 1200, do: 'enter', el: 'd-A-0' },
					{ at: 2600, do: 'pulse', el: 'pq-lb' },
					// A comes out first (distance 0) and relaxes its two edges.
					{ at: relax.start(1), do: 'move', el: 'hl', to: 'ln-10', dur: 400 },
					{ at: relax.start(1) + 100, do: 'move', el: 'p', to: 'a-A', dur: 1 },
					{ at: relax.start(1) + 200, do: 'enter', el: 'p' },
					{ at: relax.start(1) + 300, do: 'enter', el: 'set-A' },
					{ at: relax.start(1) + 700, do: 'move', el: 'hl', to: 'ln-15', dur: 400 },
					{ at: relax.start(1) + 800, do: 'draw', el: 'rx-AB', dur: 700 },
					{ at: relax.start(1) + 1300, do: 'exit', el: 'd-B-inf', dur: 300 },
					{ at: relax.start(1) + 1400, do: 'enter', el: 'd-B-4' },
					{ at: relax.start(1) + 1700, do: 'draw', el: 'rx-AC', dur: 700 },
					{ at: relax.start(1) + 2200, do: 'exit', el: 'd-C-inf', dur: 300 },
					{ at: relax.start(1) + 2300, do: 'enter', el: 'd-C-2' },
					{ at: relax.start(1) + 3000, do: 'move', el: 'hl', to: 'ln-10', dur: 400 },
					{ at: relax.start(1) + 3100, do: 'move', el: 'p', to: 'a-C', dur: 900 },
					{ at: relax.start(1) + 4000, do: 'enter', el: 'set-C' },
					{ at: relax.start(1) + 4000, do: 'pulse', el: 'd-C-2' },
					// Relaxing C → B: 2 + 1 = 3 beats 4.
					{ at: relax.start(2), do: 'move', el: 'hl', to: 'ln-13', dur: 400 },
					{ at: relax.start(2) + 300, do: 'draw', el: 'rx-CB', dur: 700 },
					{ at: relax.start(2) + 1100, do: 'move', el: 'hl', to: 'ln-14', dur: 400 },
					{ at: relax.start(2) + 1300, do: 'pulse', el: 'd-B-4' },
					{ at: relax.start(2) + 1900, do: 'move', el: 'hl', to: 'ln-15', dur: 400 },
					{ at: relax.start(2) + 2000, do: 'exit', el: 'd-B-4', dur: 300 },
					{ at: relax.start(2) + 2100, do: 'enter', el: 'd-B-3' },
					{ at: relax.start(2) + 2100, do: 'enter', el: 'hr-15' },
					{ at: relax.start(2) + 2200, do: 'exit', el: 'rx-AB', dur: 500 },
					{ at: relax.start(2) + 2700, do: 'pulse', el: 'd-B-3' },
					{ at: relax.start(2) + 3200, do: 'draw', el: 'rx-CD', dur: 700 },
					{ at: relax.start(2) + 3700, do: 'exit', el: 'd-D-inf', dur: 300 },
					{ at: relax.start(2) + 3800, do: 'enter', el: 'd-D-10' },
				),
			},
		},
		{
			id: 'settle',
			chapter: 'dijkstra',
			scene: 'journey',
			title: { es: 'Cada vértice procesado es definitivo', en: 'Each processed vertex is final' },
			subtitles: settle.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'hr-15', dur: 400 },
					{ at: 0, do: 'move', el: 'hl', to: 'ln-10', dur: 400 },
					shot(0, 'shot-right', 1800),
					{ at: 200, do: 'move', el: 'p', to: 'a-B', dur: 900 },
					{ at: 1100, do: 'enter', el: 'set-B' },
					{ at: 1500, do: 'move', el: 'hl', to: 'ln-15', dur: 400 },
					{ at: 1600, do: 'draw', el: 'rx-BD', dur: 700 },
					{ at: 2300, do: 'exit', el: 'd-D-10', dur: 300 },
					{ at: 2400, do: 'enter', el: 'd-D-8' },
					{ at: 2400, do: 'exit', el: 'rx-CD', dur: 500 },
					{ at: 2900, do: 'pulse', el: 'd-D-8' },
					{ at: settle.start(1), do: 'move', el: 'hl', to: 'ln-10', dur: 400 },
					{ at: settle.start(1) + 100, do: 'move', el: 'p', to: 'a-D', dur: 900 },
					{ at: settle.start(1) + 1000, do: 'enter', el: 'set-D' },
					{ at: settle.start(1) + 1300, do: 'draw', el: 'rx-DE', dur: 700 },
					{ at: settle.start(1) + 1800, do: 'exit', el: 'd-E-inf', dur: 300 },
					{ at: settle.start(1) + 1900, do: 'enter', el: 'd-E-11' },
					{ at: settle.start(1) + 2500, do: 'move', el: 'p', to: 'a-E', dur: 900 },
					{ at: settle.start(1) + 3400, do: 'enter', el: 'set-E' },
					{ at: settle.start(1) + 3600, do: 'move', el: 'hl', to: 'ln-20', dur: 500 },
					{ at: settle.start(1) + 3800, do: 'type', el: 'out-b', dur: 1000 },
				),
			},
		},

		// ─── Scene 6. The shortest path ─────────────────────────────────────
		{
			id: 'recap',
			chapter: 'path',
			scene: 'journey',
			title: { es: 'BFS cuenta aristas, Dijkstra suma pesos', en: 'BFS counts edges, Dijkstra adds weights' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'hl', dur: 400 },
					shot(200, 'shot-all', 2600),
					{ at: 400, do: 'flow', el: 'rx-AC' },
					{ at: 400, do: 'flow', el: 'rx-CB' },
					{ at: 400, do: 'flow', el: 'rx-BD' },
					{ at: 400, do: 'flow', el: 'rx-DE' },
					{ at: 1200, do: 'pulse', el: 'd-B-3' },
					{ at: 1800, do: 'pulse', el: 'd-E-11' },
					{ at: 2200, do: 'exit', el: 'p', dur: 400 },
					{ at: recap.start(1) + 200, do: 'enter', el: 'sum-bfs' },
					{ at: recap.start(1) + 900, do: 'enter', el: 'sum-dij' },
					{ at: recap.start(1) + 2500, do: 'pulse', el: 'sum-dij' },
				),
			},
		},
	],
};
