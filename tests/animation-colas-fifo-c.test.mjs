import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/colas-fifo-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'colas-fifo-c';
const LESSON = 'estructuras-dinamicas-colas';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '32-estructuras-dinamicas-colas';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.ok(getAnimationsForLesson('c', LESSON).some((entry) => entry.slug === SLUG), 'the film is listed for the lesson');
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['fifo', 'enqueue', 'dequeue', 'empty', 'circular', 'turns'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['line', 'enqueue', 'dequeue', 'last', 'fix', 'ring', 'wrap', 'turns'],
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
	for (const kind of ['enter', 'exit', 'draw', 'type', 'move', 'pulse', 'camera']) assert.ok(kinds.has(kind), `uses the ${kind} cue`);
});

test('the film lasts between 90 and 120 seconds in both languages', () => {
	for (const lang of ['es', 'en']) {
		const steps = resolveScript(script, lang).steps;
		const total = steps.reduce((sum, step) => sum + step.duration, 0);
		console.log(`# ${lang}: ${(total / 1000).toFixed(1)} s`);
		assert.ok(total >= 90_000 && total <= 120_000, `${lang} runs for ${Math.round(total / 1000)} s`);
		for (const step of steps) {
			assert.ok(step.duration > Math.max(...step.motion.cues.map(cueEnd)), `${step.id} (${lang}) outlasts its cues`);
		}
	}
});

test('every step has a bilingual title and two or three short captions', () => {
	for (const step of script.steps) {
		assert.ok(step.subtitles.length >= 2 && step.subtitles.length <= 3, `${step.id} narrates in two or three captions`);
		for (const lang of ['es', 'en']) {
			assert.ok(step.title[lang]?.length > 0, `${step.id} title.${lang}`);
			for (const sub of step.subtitles) {
				const length = sub.text[lang]?.length ?? 0;
				assert.ok(length >= 15 && length <= 120, `${step.id} caption.${lang} must be short (${length}): ${sub.text[lang]}`);
			}
		}
	}
});

const narration = (lang) =>
	resolveScript(script, lang)
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n')
		.toLowerCase();

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// 1. What does FIFO mean?
		'el primero en llegar es el primero en salir',
		'fifo',
		// 2. How do enqueue and dequeue move rear and front?
		'`frente` apunta al que sale',
		'`final` avanza',
		'`frente` no cambia',
		'mueve `frente` al siguiente nodo',
		'si la cola está vacía, es frente y final',
		// 3. Why must the rear become NULL?
		'si falta la línea 21',
		'`final` sigue apuntando al nodo liberado',
		'puntero colgante',
		'escribiría en memoria ya liberada',
		'`final` vuelve a `null`',
		// 4. How does the circular array wrap?
		'`(inicio + cantidad) % capacidad`',
		'`(1 + 2) % 3 = 0`',
		'el índice dio la vuelta',
		'ningún elemento se mueve',
		// 5. Who frees each node?
		'la cola es dueña de cada nodo',
		'lo libera con `free`',
		'si terminó, se libera',
		// 6. A real use: scheduling by turns.
		'planificación por turnos',
		'un quantum de 3',
		'cola fifo',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|liberá|pedí|llamás)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'the first one in is the first one out',
		'fifo',
		'`front` points to the one that leaves',
		'`rear` advances',
		'`front` stays',
		'moves `front` to the next node',
		'if the queue is empty, it is front and rear',
		'if line 21 is missing',
		'`rear` keeps pointing at the freed node',
		'dangling pointer',
		'would write into freed memory',
		'`rear` goes back to `null`',
		'`(start + count) % capacity`',
		'`(1 + 2) % 3 = 0`',
		'wrapped around',
		'no element moves',
		'the queue owns every node',
		'frees it with `free`',
		'if done, it is freed',
		'round-robin scheduling',
		'a quantum of 3',
		'fifo queue',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
});

test('the rear is forgotten (dangling), then restored to NULL, and the queue works again', () => {
	// The last node leaves: without line 21 the bar jumps from 20 to 23 and `final` dangles.
	const last = cuesOf('last');
	assert.ok(!stopsOf(last, 'hl').includes('ln-21'), 'the hypothetical run skips line 21');
	assert.ok(stopsOf(last, 'hl').includes('ln-20') && stopsOf(last, 'hl').includes('ln-23'));
	assert.ok(firstAt(last, 'enter', 'rel-n2') < firstAt(last, 'enter', 'dg-final-2'), 'the pointer dangles once the node is freed');
	assert.ok(idsOf(last, 'exit').includes('pt-final-2'), 'the valid pointer is replaced by the dangling one');
	for (const id of ['lb-skip', 'lb-dg', 'lb-uaf']) assert.ok(idsOf(last, 'enter').includes(id), `last shows ${id}`);

	// The fix: line 21 runs, `final` becomes NULL, the dangling arrow leaves, 99 is enqueued as front and rear.
	const fix = cuesOf('fix');
	assert.ok(stopsOf(fix, 'hl').includes('ln-21'), 'line 21 runs');
	assert.ok(idsOf(fix, 'exit').includes('dg-final-2'));
	assert.ok(firstAt(fix, 'enter', 'pv-final-null') > firstAt(fix, 'move', 'hl'), 'final becomes NULL after the bar reaches line 21');
	assert.ok(idsOf(fix, 'enter').includes('lb-fix'));
	assert.ok(stopsOf(fix, 'hl').includes('ln-7'), 'the next enqueue takes the empty-queue branch');
	assert.ok(idsOf(fix, 'draw').includes('pt-frente-3') && idsOf(fix, 'draw').includes('pt-final-3'), '99 is both front and rear');
	assert.ok(idsOf(fix, 'type').includes('oa5'));
});

test('enqueue links after the rear and dequeue frees the front node', () => {
	const enqueue = cuesOf('enqueue');
	assert.deepEqual(idsOf(enqueue, 'enter').filter((id) => /^n\d$/.test(id)), ['n0', 'n1', 'n2'], 'one node per element, in order');
	assert.deepEqual(idsOf(enqueue, 'draw').filter((id) => /^lk-/.test(id)), ['lk-0-1', 'lk-1-2'], 'each new node is linked after the rear');
	assert.deepEqual(idsOf(enqueue, 'draw').filter((id) => /^pt-final-/.test(id)), ['pt-final-0', 'pt-final-1', 'pt-final-2'], 'rear advances');
	assert.deepEqual(idsOf(enqueue, 'draw').filter((id) => /^pt-frente-/.test(id)), ['pt-frente-0'], 'front is set once, by the first node');
	assert.ok(stopsOf(enqueue, 'hl').includes('ln-7') && stopsOf(enqueue, 'hl').includes('ln-9'), 'both branches of line 6 run');
	assert.ok(idsOf(enqueue, 'enter').includes('lb-first') && idsOf(enqueue, 'enter').includes('lb-o1'));

	const dequeue = cuesOf('dequeue');
	assert.deepEqual(idsOf(dequeue, 'draw').filter((id) => /^pt-frente-/.test(id)), ['pt-frente-1', 'pt-frente-2'], 'front moves to the next node');
	assert.deepEqual(idsOf(dequeue, 'enter').filter((id) => /^rel-/.test(id)), ['rel-n0', 'rel-n1'], 'each node is freed by the queue');
	assert.deepEqual(idsOf(dequeue, 'type').filter((id) => /^oa/.test(id)), ['oa2', 'oa3']);
	assert.equal(stopsOf(dequeue, 'hl').filter((to) => to === 'ln-23').length, 2, 'free runs once per node');
	assert.ok(!stopsOf(dequeue, 'hl').includes('ln-21'), 'with nodes left, rear is not touched');
});

test('the circular array wraps its index around', () => {
	const ring = cuesOf('ring');
	assert.deepEqual(idsOf(ring, 'type').filter((id) => /^cv-/.test(id)), ['cv-0-1', 'cv-1-2', 'cv-2-3']);
	for (const chip of ['cf-a', 'cf-b', 'cf-c', 'lb-llena']) assert.ok(idsOf(ring, 'enter').includes(chip), `ring shows ${chip}`);
	assert.ok(idsOf(ring, 'type').includes('ob1'), 'the full queue prints its message');
	const fourth = ring.filter((cue) => cue.do === 'move' && cue.el === 'hl').map((cue) => cue.to).slice(-2);
	assert.deepEqual(fourth, ['ln-2', 'ln-7'], 'the fourth enqueue stops at the fullness check');

	const wrap = cuesOf('wrap');
	assert.ok(idsOf(wrap, 'exit').includes('cv-0-1'), 'the 1 leaves');
	assert.ok(idsOf(wrap, 'draw').includes('pt-inicio-1'), 'inicio moves forward');
	assert.ok(idsOf(wrap, 'enter').includes('cf-d'), 'the wrapped index is shown');
	assert.ok(firstAt(wrap, 'type', 'cv-0-4') > firstAt(wrap, 'enter', 'cf-d'), 'the 4 goes to the freed first cell');
	assert.ok(idsOf(wrap, 'type').includes('ob2'));
});

test('round robin runs the six turns of the lesson, freeing each process once', () => {
	const turns = cuesOf('turns');
	assert.deepEqual(idsOf(turns, 'type').filter((id) => /^oc\d$/.test(id)), ['oc0', 'oc1', 'oc2', 'oc3', 'oc4', 'oc5'], 'the six lines of the output, in order');
	assert.deepEqual(idsOf(turns, 'enter').filter((id) => /^rel-r/.test(id)), ['rel-r1', 'rel-r0', 'rel-r2'], 'P2, then P1, then P3 finish and are freed');
	assert.equal(stopsOf(turns, 'hl').filter((to) => to === 'ln-7').length, 6, 'one dequeue per turn');
	assert.equal(stopsOf(turns, 'hl').filter((to) => to === 'ln-15').length, 3, 'three requeues');
	assert.equal(stopsOf(turns, 'hl').filter((to) => to === 'ln-19').length, 3, 'three frees');
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all'], 'the camera pulls back to the whole system');
});

test('every instruction runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	const groups = [
		['a-m', 'm-', 'on-', [2, 3, 4, 5, 6, 7, 9, 11, 12, 16, 17, 18, 19, 20, 21, 23, 24]],
		['a-mb', 'mb-', 'onb-', [2, 3, 5, 6, 7, 11, 12, 13, 14, 15]],
		['a-mc', 'mc-', 'onc-', [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 19]],
	];
	for (const [stop, module, lit, lines] of groups) {
		for (const line of lines) {
			assert.ok(stopsOf(all, 'hl').includes(`ln-${line}`), `the bar reaches line ${line}`);
			assert.ok(stopsOf(all, 'p').includes(`${stop}${line}`), `the flow visits ${stop}${line}`);
			assert.ok(idsOf(all, 'enter').includes(`${module}${line}`), `module ${module}${line} is built`);
			assert.ok(idsOf(all, 'enter').includes(`${lit}${line}`), `module ${module}${line} lights up`);
		}
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const generated = [
		[/^(n[0-3]|r[0-2])$/, ['id: `n${k}`', 'id: `r${k}`']],
		[/^nq-[0-3]$/, ['`nq-${node.k}`']],
		[/^nv-[0-3]$/, ['`nv-${node.k}`']],
		[/^rv-\d-\d$/, ['`rv-${k}-${rest}`']],
		[/^nl-[0-3]$/, ['`nl-${node.k}`']],
		[/^rel-(n[0-3]|r[0-2])$/, ['`rel-${node.id}`']],
		[/^cc-[0-2]$/, ['`cc-${cell.k}`']],
		[/^ix-[0-2]$/, ['`ix-${cell.k}`']],
		[/^(lk|rk)-\d-\d$/, ['`${prefix}-${a}-${b}`']],
		[/^pt-(frente|final|nodo|viejo|proc)-[0-3]$/, ['`pt-${plateId}-${k}`']],
		[/^dg-final-[0-3]$/, ['`dg-final-${k}`']],
		[/^pt-inicio-[01]$/, ['`pt-inicio-${k}`']],
		[/^v-(frente|final|nodo|viejo|proc|inicio|cant)$/, ['`v-${item.id}`']],
		[/^pv-inicio-\d$/, ['`pv-inicio-${value}`']],
		[/^pv-cant-\d$/, ['`pv-cant-${value}`']],
		[/^(m|mb|mc)-\d+$/, ["moduleRow('m-'", "moduleRow('mb-'", "moduleRow('mc-'"]],
		[/^(on|onb|onc)-\d+$/, ["'on-'", "'onb-'", "'onc-'"]],
		[/^a-m[bc]?\d+$/, ['`a-${module.id']],
		[/^ln-\d+$/, ['`ln-${index + 1}`']],
		[/^oc\d$/, ['id: `oc${index}`']],
	];
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`file: '${id}'`)) return true;
		const pv = id.match(/^pv-(frente|final|nodo|viejo|proc)-(null|[nr]\d)$/);
		if (pv) return new RegExp(`pointerValues\\('${pv[1]}', \\[[^\\]]*'${pv[2]}'`).test(component);
		return generated.some(([pattern, markers]) => pattern.test(id) && markers.some((marker) => component.includes(marker)));
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
	// Every module of the three programs exists, with its editor line on its face.
	for (const line of [2, 3, 4, 5, 6, 7, 9, 11, 12, 16, 17, 18, 19, 20, 21, 23, 24, 13, 14, 15, 8, 10, 19]) {
		assert.match(component, new RegExp(`\\[${line}, '(flow|violet)'\\]`), `module spec for line ${line}`);
	}
});

/** Evaluates a program of the component, filled in with the identifiers of one language. */
function programOf(component, name, lang) {
	const t = (es, en) => (lang === 'es' ? es : en);
	const names = new Function('t', `return {${component.split('const n = {')[1].split('\n};')[0]}\n}`)(t);
	const body = component.split(`const ${name} = [`)[1].split('].join')[0];
	return new Function('t', 'n', `return [${body}\n]`)(t, names);
}

test('the editor holds the lesson programs and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the editor uses C highlighting');
	const sizes = { linked: 25, circular: 16, turns: 22 };
	for (const lang of ['es', 'en']) {
		for (const [name, size] of Object.entries(sizes)) {
			const lines = programOf(component, name, lang);
			assert.equal(lines.length, size, `${name} (${lang}) has ${size} lines`);
			for (const line of lines) assert.ok(line.length <= 66, `a ${name} line is too long (${line.length}): ${line}`);
		}
	}

	// The numbers of the cues are the lines of the program.
	const lineOf = (lang, name, number) => programOf(component, name, lang)[number - 1];
	const checks = {
		es: [
			['linked', 2, 'malloc(sizeof *nodo)'],
			['linked', 3, 'nodo == NULL'],
			['linked', 6, 'cola->final == NULL'],
			['linked', 7, 'cola->frente = nodo'],
			['linked', 9, 'cola->final->siguiente = nodo'],
			['linked', 11, 'cola->final = nodo'],
			['linked', 16, 'cola->frente == NULL'],
			['linked', 17, 'Nodo *viejo = cola->frente'],
			['linked', 19, 'cola->frente = viejo->siguiente'],
			['linked', 20, 'cola->frente == NULL'],
			['linked', 21, 'cola->final = NULL'],
			['linked', 23, 'free(viejo)'],
			['circular', 2, 'cola->cantidad == cola->capacidad'],
			['circular', 3, '(cola->inicio + cola->cantidad)'],
			['circular', 13, '(cola->inicio + 1) % cola->capacidad'],
			['turns', 7, 'desencolar_nodo(&listos)'],
			['turns', 15, 'reencolar_nodo(&listos, proceso)'],
			['turns', 19, 'free(proceso)'],
		],
		en: [
			['linked', 2, 'malloc(sizeof *node)'],
			['linked', 6, 'queue->rear == NULL'],
			['linked', 7, 'queue->front = node'],
			['linked', 9, 'queue->rear->next = node'],
			['linked', 21, 'queue->rear = NULL'],
			['linked', 23, 'free(old)'],
			['circular', 3, '(queue->start + queue->count)'],
			['circular', 13, '(queue->start + 1) % queue->capacity'],
			['turns', 7, 'dequeue_node(&ready)'],
			['turns', 15, 'requeue_node(&ready, process)'],
			['turns', 19, 'free(process)'],
		],
	};
	for (const [lang, list] of Object.entries(checks)) {
		for (const [name, number, fragment] of list) assert.ok(lineOf(lang, name, number).includes(fragment), `${lang} ${name} line ${number} should contain ${fragment}`);
	}

	// Real output of the programs compiled with `cc -std=c23`.
	for (const fragment of [
		"t('Cola llena: el 4 no entra', 'Queue full: 4 does not fit')",
		'`${n.front} -> 10 20 30 <- ${n.rear}`',
		'`${n.front} -> 99 <- ${n.rear}`',
		"t('Atendido', 'Served')",
		'[3, 1, 3, 2, true]',
		'[5, 2, 2, 0, false]',
		'[8, 3, 3, 4, true]',
		'[10, 1, 2, 0, false]',
		'[13, 3, 3, 1, true]',
		'[14, 3, 1, 0, false]',
		"text: '2 3 4'",
		// Short fictional addresses: sixteen bytes per node, four per int.
		'0x1000 + 16 * k',
		'0x3000 + 16 * k',
		'0x4000 + 4 * k',
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/colas-fifo-c'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');
	assert.match(component, /font-family: var\(--font-body\)/);

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.equal((component.match(/data-slug='colas-fifo-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
