import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/concurrencia-hilos-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'concurrencia-hilos-java';
const LESSON = '19-programacion-concurrente-hilos-y-pools';
const FILE = '20-programacion-concurrente-hilos-y-pools';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const stepOf = (id) => script.steps.find((step) => step.id === id);
const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const cueAt = (cues, kind, el, to) => cues.find((cue) => cue.do === kind && cue.el === el && (to === undefined || cue.to === to));

test(`catalog binds ${SLUG} to java/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: LESSON });
	assert.ok(getAnimationsForLesson('java', LESSON).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`), 'the Organic thumbnail exists');
	assert.ok(existsSync(`src/content/courses/java/${FILE}.es.md`));
});

test('script is valid: six chapters played as eight motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['memory', 'start', 'race', 'sync', 'pool', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['shared', 'start', 'read', 'lost', 'lock', 'serial', 'pool', 'recap'],
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
		// 1. What do threads share, and what does each one keep for itself?
		'heap',
		'comparten todos los hilos',
		'su propia pila',
		// 2. What does start() do, and why not run()?
		'new thread',
		'NEW',
		'start()',
		'run()',
		// 3. Why is count++ unsafe?
		'no es atómico',
		'leer',
		'sumarle 1',
		'escribir',
		'planificador',
		// 4. What is the lost update?
		'condición de carrera',
		'actualización perdida',
		// 5. How does synchronized fix it?
		'synchronized',
		'cerrojo',
		'espera',
		'persisten',
		'exclusión mutua',
		// 6. Why use a thread pool?
		'newFixedThreadPool(2)',
		'submit()',
		'reutilizan',
		'shutdown()',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|probá)\b/i);
});

test('two threads read the same value and the second write overwrites the first (lost update)', () => {
	const read = cuesOf('read');
	assert.deepEqual(stopsOf(read, 'pa'), ['a-obj1', 'a-st1'], 'thread 1 reads the counter');
	assert.deepEqual(stopsOf(read, 'pb'), ['a-obj2', 'a-st2'], 'thread 2 reads it before thread 1 writes');
	assert.ok(cueAt(read, 'enter', 'l1-0') && cueAt(read, 'enter', 'l2-0'), 'both copies hold 0');
	assert.equal(read.filter((cue) => cue.do === 'draw' && cue.el.startsWith('wr-')).length, 0, 'nobody writes while reading');

	const lost = cuesOf('lost');
	assert.deepEqual(stopsOf(lost, 'pa'), ['a-obj1', 'a-st1']);
	assert.deepEqual(stopsOf(lost, 'pb'), ['a-obj2', 'a-st2']);
	const write1 = cueAt(lost, 'draw', 'wr-1');
	const write2 = cueAt(lost, 'draw', 'wr-2');
	assert.ok(write1 && write2 && write1.at < write2.at, 'thread 1 writes first, thread 2 writes on top');
	assert.ok(cueAt(lost, 'enter', 'v-1').at < cueAt(lost, 'enter', 'v-lost').at, 'the counter shows 1 and stays at 1');
	assert.ok(cueAt(lost, 'enter', 'hx-5'), 'the non-atomic line is marked');
});

test('synchronized makes thread 2 wait for the lock, so both increments persist', () => {
	const lock = cuesOf('lock');
	assert.ok(cueAt(lock, 'exit', 'ea-4') && cueAt(lock, 'type', 'eb-4'), 'the synchronized keyword is written on line 4');
	assert.ok(cueAt(lock, 'enter', 'lock'), 'the lock appears on the shared object');
	assert.deepEqual(stopsOf(lock, 'pa'), ['a-obj1'], 'thread 1 takes the lock');
	assert.deepEqual(stopsOf(lock, 'pb'), ['a-wait2'], 'thread 2 waits outside');

	const serial = cuesOf('serial');
	assert.deepEqual(stopsOf(serial, 'pa'), ['a-st1']);
	assert.deepEqual(stopsOf(serial, 'pb'), ['a-obj2', 'a-st2']);
	const release = cueAt(serial, 'move', 'pa', 'a-st1');
	const enter2 = cueAt(serial, 'move', 'pb', 'a-obj2');
	assert.ok(enter2.at >= cueEnd(release), 'thread 2 enters only after thread 1 leaves');
	assert.ok(cueAt(serial, 'enter', 'v-s1').at < cueAt(serial, 'enter', 'v-s2').at, 'the counter goes 1 then 2');
});

test('the pool reuses its two workers for four tasks and prints the total', () => {
	const pool = cuesOf('pool');
	assert.deepEqual(stopsOf(pool, 'tk1'), ['a-w1', 'a-objp']);
	assert.deepEqual(stopsOf(pool, 'tk2'), ['a-w2', 'a-objp']);
	assert.deepEqual(stopsOf(pool, 'tk3'), ['a-w1', 'a-objp']);
	assert.deepEqual(stopsOf(pool, 'tk4'), ['a-w2', 'a-objp']);
	const reuse = cueAt(pool, 'move', 'tk3', 'a-w1');
	assert.ok(reuse.at >= cueEnd(cueAt(pool, 'move', 'tk1', 'a-objp')), 'worker 1 takes task 3 after finishing task 1');
	assert.deepEqual(
		pool.filter((cue) => cue.do === 'enter' && /^v-p\d$/.test(cue.el)).map((cue) => cue.el),
		['v-p1', 'v-p2', 'v-p3', 'v-p4'],
	);
	assert.deepEqual(pool.filter((cue) => cue.do === 'type' && cue.el.startsWith('out-')).map((cue) => cue.el), ['out-c']);
	assert.deepEqual(stopsOf(pool, 'p').slice(-3), ['a-submit', 'a-shut', 'a-print']);
	assert.equal(stepOf('recap').motion.cues.filter((cue) => cue.do === 'camera')[0].to[0], 'shot-all', 'the camera pulls back at the end');
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		const prefix = id.replace(/\d+$/, '');
		return prefix !== id && component.includes('`' + prefix + '${');
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
	// The overwriting write is the problem (magenta); the lock and the pool resolve it (violet).
	assert.match(component, /data-el="wr-2" class="xj-flowline xj-flowline--magenta"/);
	assert.match(component, /data-el="lock" class="xj-lock"/);
	assert.match(component, /id: 'v-lost',[^}]*tone: 'magenta'/s);
	assert.match(component, /id: 'v-s2',[^}]*tone: 'violet'/s);
});

test('the code in the canvas is the program the narration describes', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		'`class ${names.counter} {`',
		'`    private int ${names.count} = 0;`',
		'`    public void ${names.increment}() {`',
		'`        ${names.count}++; // ${strings.threeSteps}`',
		'`    public synchronized void ${names.increment}() {`',
		'`        Thread ${names.t1} = new Thread(() -> c.${names.increment}());`',
		'`        ${names.t1}.start(); // ${strings.neverRun}`',
		'`        ExecutorService pool = Executors.newFixedThreadPool(2);`',
		'`            pool.submit(() -> c.${names.increment}());`',
		'`        pool.shutdown();`',
		'`        pool.awaitTermination(5, TimeUnit.SECONDS);`',
		'`        System.out.println(c.${names.getCount}());`',
		"t('Contador', 'Counter')",
		"t('contador', 'count')",
		"t('incrementar', 'increment')",
		"t('h1', 't1')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	const lines = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.ok(lines('sourceA').length <= 20 && lines('sourceC').length <= 20, 'the editor holds at most 20 lines');
	assert.match(lines('sourceA')[4], /\$\{names\.count\}\+\+;/, 'line 5 is the non-atomic increment');
	assert.match(lines('sourceA')[13], /\$\{names\.t1\}\.start\(\);/, 'line 14 starts thread 1');
	assert.match(lines('sourceC')[13], /pool\.submit/, 'line 14 submits the tasks');
	assert.match(lines('sourceC')[15], /pool\.shutdown\(\);/, 'line 16 shuts the pool down');
	assert.match(lines('sourceC')[17], /println/, 'line 18 prints the total');
	assert.match(component, /const syncLine = `    public synchronized void \$\{names\.increment\}\(\) \{`;/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/concurrencia-hilos-java'/);
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
	assert.equal((component.match(/data-slug='concurrencia-hilos-java'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const svg = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	assert.match(svg, /viewBox="0 0 400 200"/);
	const allowed = new Set(['#f1e8d9', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76', '#faf5ec']);
	for (const hex of svg.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(allowed.has(hex.toLowerCase()), `foreign color ${hex}`);
});
