import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/tad-pilas-colas-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'tad-pilas-colas-java';
const LESSON = '12-tad-pilas-y-colas';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '14-tad-pilas-y-colas';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const moves = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el && cue.dur !== 1).map((cue) => cue.to);
const entered = (cues) => cues.filter((cue) => cue.do === 'enter').map((cue) => cue.el);
const atOf = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;

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

test('script is valid: six chapters played as eight motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['stack', 'lifo', 'empty', 'queue', 'fifo', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['stack', 'push', 'pop', 'underflow', 'enqueue', 'dequeue', 'last', 'recap'],
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
	const narration = (ids) =>
		resolveScript(script, 'es')
			.steps.filter((step) => ids.includes(step.id))
			.map((step) => `${step.title} ${step.text}`)
			.join('\n')
			.toLowerCase();
	const questions = [
		// 1. Where does a stack operate? Only at one end, the top.
		[['stack'], ['un solo extremo', '`tope`', 'push', 'pop', 'null']],
		// 2. How does push link a new node? It points to the old top and becomes the top, in O(1).
		[['push'], ['apunta al `tope` anterior', 'nuevo `tope`', 'o(1)']],
		// 3. In what order do elements leave a stack? Last in, first out.
		[['pop'], ['el último en entrar es el primero en salir', 'lifo', '"c"', '"b"']],
		// 4. What happens when you pop an empty stack? The guard throws.
		[['underflow'], ['pila vacía', 'guardia', 'nosuchelementexception']],
		// 5. Why does a queue need two references? You enter at the back and leave from the front.
		[['enqueue'], ['dos extremos', '`fondo`', '`frente`', 'enqueue', 'o(1)']],
		// 6. In what order does a queue serve, and why clear `fondo` with the last node?
		[['dequeue', 'last'], ['dequeue()', 'orden de llegada', 'fifo', 'no se corren', 'ya no pertenece a la cola', '`fondo = null`']],
		// Recap: when to choose each one.
		[['recap'], ['deshacer', 'pila de llamadas', 'cola de impresión', 'o(1)']],
	];
	for (const [ids, concepts] of questions) {
		const text = narration(ids);
		for (const concept of concepts) assert.ok(text.includes(concept), `${ids.join('+')} should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	const all = narration(script.steps.map((step) => step.id));
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|sacá|usá)\b/i);
});

test('the stack pushes A, B, C and pops C, B, A before failing on the empty stack', () => {
	const push = cuesOf('push');
	assert.deepEqual(moves(push, 'sa'), ['a-s0']);
	assert.deepEqual(moves(push, 'sb'), ['a-s1']);
	assert.deepEqual(moves(push, 'sc'), ['a-s2']);
	assert.deepEqual(moves(push, 'ptr-top'), ['a-top-0', 'a-top-1', 'a-top-2'], 'tope climbs to each new node');
	const drawn = push.filter((cue) => cue.do === 'draw').map((cue) => cue.el);
	assert.deepEqual(drawn, ['lk-ba', 'lk-cb'], 'each new node points to the old top');

	const pop = cuesOf('pop');
	assert.ok(atOf(pop, 'move', 'sc') < atOf(pop, 'move', 'sb'), 'C leaves before B');
	assert.deepEqual(moves(pop, 'ptr-top'), ['a-top-1', 'a-top-0']);
	assert.deepEqual(pop.filter((cue) => cue.do === 'type' && cue.el.startsWith('out')).map((cue) => cue.el), ['out-1']);

	const empty = cuesOf('underflow');
	assert.deepEqual(moves(empty, 'sa'), ['a-s-dock']);
	assert.deepEqual(moves(empty, 'ptr-top'), ['a-top-null']);
	for (const id of ['top-null', 'hx-10', 'pop-x', 'uf-chip']) assert.ok(entered(empty).includes(id), `underflow shows ${id}`);
	assert.deepEqual(
		empty.filter((cue) => cue.do === 'type' && cue.el.startsWith('out')).map((cue) => cue.el),
		['out-2', 'out-3a', 'out-3b'],
	);
});

test('the queue serves A, B, C in arrival order and clears fondo with the last node', () => {
	const enq = cuesOf('enqueue');
	assert.deepEqual(moves(enq, 'qa'), ['a-q0']);
	assert.deepEqual(moves(enq, 'qb'), ['a-q1']);
	assert.deepEqual(moves(enq, 'qc'), ['a-q2']);
	assert.ok(entered(enq).includes('ptr-front') && entered(enq).includes('ptr-back'), 'one node: both references on it');
	assert.deepEqual(moves(enq, 'ptr-back'), ['a-back-1', 'a-back-2'], 'fondo moves to each arrival');

	const deq = cuesOf('dequeue');
	assert.ok(atOf(deq, 'move', 'qa') < atOf(deq, 'move', 'qb'), 'A leaves before B');
	assert.deepEqual(moves(deq, 'qa'), ['a-q-out']);
	assert.deepEqual(moves(deq, 'ptr-front'), ['a-front-1', 'a-front-2'], 'only frente moves; nodes do not shift');
	assert.equal(moves(deq, 'qc').length, 0, 'C stays put while A and B leave');

	const last = cuesOf('last');
	assert.deepEqual(moves(last, 'qc'), ['a-q-out']);
	assert.ok(atOf(last, 'enter', 'orphan') < atOf(last, 'enter', 'clr-on'), 'the dangling fondo shows before line 14 runs');
	assert.ok(atOf(last, 'enter', 'clr-on') < atOf(last, 'enter', 'back-null'), 'line 14 sets fondo = null');
	assert.ok(entered(last).includes('hv-14'));
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids written literally, listed in the frontmatter or built in a loop (`ea-${n}`) count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		const prefix = id.replace(/\d+$/, '');
		return prefix !== id && (component.includes('`' + prefix + '${') || component.includes(`'${prefix}' +`));
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
		'`public class ${names.stack}<T> {`',
		'`    public void push(T ${names.item}) {`',
		'`        ${names.fresh}.${names.next} = ${names.top};`',
		'`        ${names.top} = ${names.fresh};`',
		"'    public T pop() {'",
		'`        if (${names.top} == null)`',
		'`            throw new NoSuchElementException("${strings.stackEmpty}");`',
		'`        ${names.top} = ${names.top}.${names.next};`',
		'`public class ${names.queue}<T> {`',
		'`    private ${names.node}<T> ${names.front}, ${names.back};`',
		'`        else ${names.back}.${names.next} = ${names.fresh};`',
		'`        ${names.front} = ${names.front}.${names.next};`',
		'`        if (${names.front} == null) ${names.back} = null;`',
		"t('Pila', 'Stack')",
		"t('Cola', 'Queue')",
		"t('tope', 'top')",
		"t('frente', 'front')",
		"t('fondo', 'back')",
		"t('La pila está vacía', 'The stack is empty')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	const lines = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.equal(lines('sourceA').length, 20);
	assert.equal(lines('sourceB').length, 20);
	assert.match(lines('sourceA')[16], /push\("A"\).*push\("B"\).*push\("C"\)/);
	assert.match(lines('sourceA')[17], /pop\(\) \+ .*pop\(\)/);
	assert.match(lines('sourceA')[19], /pop\(\)/);
	assert.match(lines('sourceB')[17], /enqueue\("A"\).*enqueue\("B"\).*enqueue\("C"\)/);
	assert.match(lines('sourceB')[18], /dequeue\(\) \+ .*dequeue\(\)/);
	assert.match(lines('sourceB')[19], /dequeue\(\)/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/tad-pilas-colas-java'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.equal((component.match(/data-slug='tad-pilas-colas-java'/g) ?? []).length, 4);
});
