import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/grafos-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'grafos-java';
const LESSON = '16-grafos-representacion-y-algoritmos';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '18-grafos-representacion-y-algoritmos';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;

test(`catalog binds ${SLUG} to java/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: LESSON });
	assert.deepEqual(
		getAnimationsForLesson('java', LESSON).map((entry) => entry.slug),
		[SLUG],
	);
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/java/${FILE}.es.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['graph', 'queue', 'wave', 'weights', 'dijkstra', 'path'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['build', 'start', 'layer1', 'layer2', 'weights', 'relax', 'settle', 'recap'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'journey', `${step.id} plays on the single canvas`);
		assert.ok(step.motion, `${step.id} is a motion step`);
		assert.ok(step.subtitles.every((sub) => typeof sub.at === 'number'), `${step.id} pins captions`);
		assert.ok(step.motion.cues.length >= 10, `${step.id} choreographs the canvas`);
		const starts = step.motion.cues.map((cue) => cue.at);
		assert.deepEqual(starts, [...starts].sort((a, b) => a - b), `${step.id} lists its cues in order`);
	}
	const kinds = new Set(script.steps.flatMap((step) => step.motion.cues.map((cue) => cue.do)));
	for (const kind of ['enter', 'exit', 'draw', 'type', 'move', 'pulse', 'flow', 'camera']) assert.ok(kinds.has(kind), `uses the ${kind} cue`);
});

test('the film lasts between 90 and 120 seconds in both languages', () => {
	for (const lang of ['es', 'en']) {
		const steps = resolveScript(script, lang).steps;
		const total = steps.reduce((sum, step) => sum + step.duration, 0);
		assert.ok(total >= 90_000 && total <= 120_000, `${lang} runs for ${Math.round(total / 1000)} s`);
		for (const step of steps) {
			assert.ok(step.duration > Math.max(...step.motion.cues.map(cueEnd)), `${step.id} (${lang}) outlasts its cues`);
		}
	}
});

test('every step has a bilingual title and one to three short captions', () => {
	for (const step of script.steps) {
		assert.ok(step.subtitles.length >= 1 && step.subtitles.length <= 3, `${step.id} narrates in one to three captions`);
		for (const lang of ['es', 'en']) {
			assert.ok(step.title[lang]?.length > 0, `${step.id} title.${lang}`);
			for (const sub of step.subtitles) {
				const length = sub.text[lang]?.length ?? 0;
				assert.ok(length >= 15 && length <= 120, `${step.id} caption.${lang} must be short (${length}): ${sub.text[lang]}`);
			}
		}
	}
});

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = resolveScript(script, 'es')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n');
	for (const concept of [
		// 1. How is a graph stored in Java?
		'lista de adyacencia',
		'vecinos',
		'en los dos sentidos',
		// 2. When is a vertex marked as visited, and why?
		'al encolar',
		'no entra dos veces',
		// 3. How does BFS explore the graph?
		'cola',
		'por capas',
		// 4. Which path does BFS find, and why is it not enough with weights?
		'menos aristas',
		'peso',
		// 5. What does it mean to relax an edge?
		'relajar',
		'se actualiza',
		// 6. Which vertex does Dijkstra process first, and when does it fail?
		'cola de prioridad',
		'más barato',
		'definitiv',
		'camino más corto',
		'pesos negativos',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|marcá|usá)\b/i);
});

test('BFS visits A · B · C · D · E layer by layer and marks each vertex when it is enqueued', () => {
	const bfs = cuesOf('start', 'layer1', 'layer2');
	assert.deepEqual(stopsOf(bfs, 'p'), ['a-A', 'a-B', 'a-C', 'a-D', 'a-E']);
	for (const v of ['A', 'B', 'C', 'D', 'E']) {
		const token = `tk-${v}`;
		assert.equal(bfs.filter((cue) => cue.do === 'enter' && cue.el === token).length, 1, `${v} enters the queue exactly once`);
		const step = script.steps.find((s) => s.motion.cues.some((cue) => cue.do === 'enter' && cue.el === token));
		const marked = firstAt(step.motion.cues, 'enter', `on-${v}`);
		const queued = step.motion.cues.find((cue) => cue.do === 'move' && cue.el === token && cue.to.startsWith('q-'))?.at;
		assert.ok(marked !== undefined && queued !== undefined && marked < queued, `${v} is marked as visited on enqueue`);
		assert.ok(stopsOf(bfs, token).includes('q-out'), `${v} leaves the queue through the front`);
	}
	for (const ring of ['ring-0', 'ring-1', 'ring-2', 'ring-3']) assert.ok(firstAt(bfs, 'enter', ring) !== undefined, `${ring} shows the layer`);
});

test('Dijkstra always polls the cheapest vertex and relaxes B from 4 to 3', () => {
	const dij = cuesOf('relax', 'settle');
	assert.deepEqual(stopsOf(dij, 'p'), ['a-A', 'a-C', 'a-B', 'a-D', 'a-E'], 'order by distance: 0, 2, 3, 8, 11');
	const relax = cuesOf('relax');
	assert.ok(firstAt(relax, 'enter', 'd-B-4') < firstAt(relax, 'exit', 'd-B-4'));
	assert.ok(firstAt(relax, 'exit', 'd-B-4') < firstAt(relax, 'enter', 'd-B-3'), 'B is relaxed from 4 to 3');
	const settle = cuesOf('settle');
	assert.ok(firstAt(relax, 'enter', 'd-D-10') !== undefined, 'D first gets 10 through C');
	assert.ok(firstAt(settle, 'exit', 'd-D-10') < firstAt(settle, 'enter', 'd-D-8'), 'D is relaxed from 10 to 8');
	assert.ok(firstAt(settle, 'enter', 'd-E-11') !== undefined);
	// The shortest-path tree stays on screen and flows in the final pull-back.
	const flows = cuesOf('recap').filter((cue) => cue.do === 'flow').map((cue) => cue.el);
	assert.deepEqual(flows, ['rx-AC', 'rx-CB', 'rx-BD', 'rx-DE']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built from a list (`id: 'v-A'`) or a template (`ea-${n}`) count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		const prefix = id.replace(/[0-9A-Z]+$/, '');
		return prefix !== id && component.includes('`' + prefix + '${');
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the code in the canvas is the program the narration describes', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		'`Map<String, List<String>> ${names.adjacency} = new HashMap<>();`',
		'`${names.addEdge}("A", "B");  ${names.addEdge}("A", "C");`',
		'`Queue<String> ${names.pending} = new ArrayDeque<>();`',
		'`${names.visited}.add("A");',
		'`        if (${names.visited}.add(${names.neighbor})) ${names.pending}.offer(${names.neighbor});`',
		'`${names.addEdge}("A", "B", 4);  ${names.addEdge}("A", "C", 2);`',
		'`${names.addEdge}("C", "B", 1);  ${names.addEdge}("B", "D", 5);`',
		'`${names.addEdge}("C", "D", 8);  ${names.addEdge}("D", "E", 3);`',
		'`PriorityQueue<String> ${names.queue} = new PriorityQueue<>(${names.byDistance});`',
		'`    if (!${names.visited}.add(${names.current})) continue;`',
		'`        int ${names.candidate} = ${names.distance}.get(${names.current}) + ${names.e}.${names.weight}();`',
		"text: '[A, B, C, D, E]'",
		"text: '{A=0, B=3, C=2, D=8, E=11}'",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// The editor never exceeds twenty lines per page.
	for (const page of ['sourceA', 'sourceB']) {
		const block = component.split(`const ${page} = [`)[1].split('].join')[0];
		const lines = block.split('\n').filter((line) => /^\s*(`|')/.test(line));
		assert.ok(lines.length > 0 && lines.length <= 20, `${page} has ${lines.length} lines`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/grafos-java'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter\b/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
