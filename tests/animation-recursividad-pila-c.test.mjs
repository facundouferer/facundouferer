import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/recursividad-pila-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'recursividad-pila-c';
const LESSON = 'recursividad';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '17-recursividad';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.deepEqual(animation.tag, { es: 'C', en: 'C' });
	assert.ok(getAnimationsForLesson('c', LESSON).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.en.md`));
});

test('script is valid: six chapters, eight motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['cases', 'down', 'up', 'overflow', 'cost', 'choose'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['build', 'down', 'bottom', 'up', 'overflow', 'tree', 'loop', 'close'],
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

test('the particle and the editor bar never start a move before the previous one ends', () => {
	for (const step of script.steps) {
		for (const el of ['p', 'hl']) {
			const moves = step.motion.cues.filter((cue) => cue.do === 'move' && cue.el === el);
			moves.slice(1).forEach((cue, index) => {
				assert.ok(cue.at >= cueEnd(moves[index]), `${step.id}: ${el} moves to ${cue.to} while still travelling`);
			});
		}
	}
});

test('the film lasts between 90 and 120 seconds in both languages', () => {
	for (const lang of ['es', 'en']) {
		const steps = resolveScript(script, lang).steps;
		const total = steps.reduce((sum, step) => sum + step.duration, 0);
		console.log(`${SLUG} (${lang}): ${(total / 1000).toFixed(1)} s`);
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

const narration = (lang) =>
	resolveScript(script, lang)
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n')
		.toLowerCase();

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// What are the base case and the recursive case?
		'el caso base: responde sin llamarse',
		'el caso recursivo',
		// How does the stack grow on the way down?
		'pila de llamadas',
		'su propia `n`',
		'cada llamada apila otro marco',
		'cuatro marcos a la vez',
		// How do the results come back?
		'sale de la pila',
		'a la vuelta',
		'`4 * 6` da `24`',
		// What happens without a base case?
		'sin caso base',
		'un techo que no pasan',
		'`segmentation fault`',
		// Why is recursive fibonacci costly?
		'dos llamadas por llamada',
		'15 llamadas',
		'se repite 2 veces',
		'costo exponencial',
		'330 millones',
		'ciclo',
		'memoria constante',
		// When not to use recursion?
		'recorridos lineales',
		'profundidad',
		'recalcula',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|usá|evitá)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'the base case: it answers without calling itself',
		'the recursive case',
		'call stack',
		'its own `n`',
		'each call stacks another frame',
		'four frames at once',
		'pops the frame',
		'on the way back',
		'gives `24`',
		'without a base case',
		'a ceiling they cannot pass',
		'`segmentation fault`',
		'two calls per call',
		'15 calls',
		'repeats 2 times',
		'exponential cost',
		'330 million',
		'loop',
		'constant memory',
		'linear traversals',
		'depth',
		'recomputes',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

const cuesOf = (id) => script.steps.find((step) => step.id === id).motion.cues;

test('the stack grows in order, and the values come back as the frames are popped', () => {
	const ordered = (kind, els) => {
		const times = els.map((el) => {
			const hit = script.steps.flatMap((step, index) => step.motion.cues.map((cue) => ({ cue, index }))).find(({ cue }) => cue.do === kind && cue.el === el);
			assert.ok(hit, `${kind} ${el} is cued`);
			return hit.index * 1_000_000 + hit.cue.at;
		});
		assert.deepEqual(times, [...times].sort((a, b) => a - b), `${els.join(' < ')} happen in that order`);
	};
	// Each call pushes a frame with its own n; the base case is the last one.
	ordered('enter', ['fr-4', 'fr-3', 'fr-2', 'fr-1']);
	// The frames leave from the top: the base case first, the call of main last.
	ordered('exit', ['fr-1', 'fr-2', 'fr-3', 'fr-4']);
	// The result of each frame travels to the one below it, and the last one reaches main.
	const moves = cuesOf('up').filter((cue) => cue.do === 'move' && /^tk-/.test(cue.el));
	assert.deepEqual(
		moves.map((cue) => [cue.el, cue.to]),
		[
			['tk-1', 'a-t2'],
			['tk-2', 'a-t3'],
			['tk-3', 'a-t4'],
			['tk-4', 'a-tmain'],
		],
	);
	// The pending multiplications of the frames below turn into their results.
	for (const n of [2, 3, 4]) {
		const up = cuesOf('up');
		assert.ok(up.some((cue) => cue.do === 'exit' && cue.el === `w-${n}`), `w-${n} resolves`);
		assert.ok(up.some((cue) => cue.do === 'enter' && cue.el === `r-${n}`), `r-${n} shows the result`);
	}
	// The result reaches main and is printed.
	assert.ok(cuesOf('up').some((cue) => cue.do === 'type' && cue.el === 'out-1'));
	// Only the base case lights line 5, and it does it in the frame of n = 1.
	assert.ok(cuesOf('bottom').some((cue) => cue.do === 'enter' && cue.el === 'on-1-5'));
	assert.ok(!script.steps.some((step) => step.motion.cues.some((cue) => /^on-[234]-5$/.test(cue.el ?? ''))));
});

test('without a base case ten frames pile up against the ceiling and the program crashes', () => {
	const cues = cuesOf('overflow');
	const pushed = cues.filter((cue) => cue.do === 'enter' && /^s-\d+$/.test(cue.el)).map((cue) => cue.el);
	assert.deepEqual(pushed, Array.from({ length: 10 }, (_, index) => `s-${index + 1}`));
	const at = (do_, el) => cues.find((cue) => cue.do === do_ && cue.el === el).at;
	assert.ok(at('enter', 'ceil') < at('enter', 's-10'), 'the ceiling is there before the last frame');
	assert.ok(at('enter', 's-10') < at('type', 'out-2'), 'the crash comes after the last frame');
	assert.ok(cues.some((cue) => cue.do === 'enter' && cue.el === 'hx-12'), 'the failing line is marked');
});

test('fibonacci(5) draws 15 calls, repeats the work of 5 of them, and the loop does it in 4 turns', () => {
	const tree = cuesOf('tree');
	const calls = tree.filter((cue) => cue.do === 'enter' && /^tn-\d+$/.test(cue.el)).map((cue) => cue.el);
	assert.deepEqual(calls, Array.from({ length: 15 }, (_, index) => `tn-${index}`));
	const repeats = tree.filter((cue) => cue.do === 'enter' && /^rp-\d+$/.test(cue.el)).map((cue) => Number(cue.el.slice(3)));
	// fibonacci(3) is called twice and fibonacci(2) three times: calls 2, 3, 7, 10 and 11 of the walk.
	assert.deepEqual(repeats, [2, 3, 7, 10, 11]);
	const loop = cuesOf('loop');
	for (const key of ['ant', 'act']) {
		const values = loop.filter((cue) => cue.do === 'enter' && new RegExp(`^${key}-\\d$`).test(cue.el)).map((cue) => cue.el);
		assert.deepEqual(values, [0, 1, 2, 3, 4].map((turn) => `${key}-${turn}`));
	}
	// Lines 15 to 18 run four times: the bar visits line 15 four times.
	assert.equal(loop.filter((cue) => cue.do === 'move' && cue.el === 'hl' && cue.to === 'ln-15').length, 4);
	assert.ok(tree.some((cue) => cue.do === 'type' && cue.el === 'out-3'));
	assert.ok(loop.some((cue) => cue.do === 'type' && cue.el === 'out-4'));
});

test('no element is exited before it is shown or entered while it already is', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	// Elements that start visible: the first program and everything nested inside the frames.
	const visible = new Set(['ed-a']);
	const nested = (id) => /^(c-\d|m-\d-\d|ms-\d+)$/.test(id);
	assert.ok(component.includes('data-el="ed-a"') || component.includes("id: 'ed-a'"));
	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			if (!cue.el || nested(cue.el)) continue;
			if (cue.do === 'enter') {
				assert.ok(!visible.has(cue.el), `${step.id}: ${cue.el} entered while visible`);
				visible.add(cue.el);
			} else if (cue.do === 'exit') {
				assert.ok(visible.has(cue.el), `${step.id}: ${cue.el} exited while hidden`);
				visible.delete(cue.el);
			} else if (cue.do === 'draw' || cue.do === 'type') {
				visible.add(cue.el);
			} else if (cue.do === 'pulse' || cue.do === 'flow') {
				assert.ok(visible.has(cue.el) || nested(cue.el), `${step.id}: ${cue.el} is ${cue.do}d while hidden`);
			}
		}
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`m-${...}-${...}`) count as present when a template with that shape exists.
	const templates = [...component.matchAll(/`([a-z][a-z0-9]*-[^`]*\$\{[^`]*)`/g)].map((match) => new RegExp(`^${match[1].replace(/\$\{[^}]+\}/g, '[\\w]+')}$`));
	const known = (id) =>
		component.includes(`data-el="${id}"`) ||
		component.includes(`data-anchor="${id}"`) ||
		component.includes(`id: '${id}'`) ||
		templates.some((pattern) => pattern.test(id)) ||
		// The values of the two loop variables are built as `${cell.key}-${index}`.
		(/^(ant|act)-\d$/.test(id) && component.includes(`key: '${id.slice(0, 3)}'`));

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the code in the canvas is the lesson program and its real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'#include <stdio.h>'",
		"'long long factorial(int n) {'",
		"'    if (n <= 1) {'",
		"`        return 1;                   // ${t('caso base', 'base case')}`",
		"`    return n * factorial(n - 1);    // ${t('caso recursivo', 'recursive case')}`",
		"`// ${t('ERROR: no tiene caso base.', 'BUG: no base case.')}`",
		'`void ${names.endless}(int n) {`',
		'`    ${names.endless}(n + 1);`',
		'\'    printf("4! = %lld\\\\n", factorial(4));\'',
		'`    ${names.endless}(1);`',
		"'long long fibonacci(int n) {'",
		"'    if (n < 2) {'",
		"'    return fibonacci(n - 1) + fibonacci(n - 2);'",
		'`long long ${names.iterative}(int n) {`',
		"'    if (n == 0) {'",
		"'    for (int i = 1; i < n; i++) {'",
		'`        long long ${names.next} = ${names.previous} + ${names.current};`',
		'`    return ${names.current};`',
		'`    printf("%lld\\\\n", ${names.iterative}(5));`',
		"endless: t('sin_fin', 'endless')",
		"iterative: t('fibonacci_iterativo', 'fibonacci_iterative')",
		"previous: t('anterior', 'previous')",
		"current: t('actual', 'current')",
		"next: t('siguiente', 'next')",
		"text: '4! = 24'",
		"text: 'Segmentation fault'",
		"text: '5'",
		"'2 * 1 = 2'",
		"'3 * 2 = 6'",
		"'4 * 6 = 24'",
		'`${n} * factorial(${n - 1})`',
		"values: ['0', '1', '1', '2', '3']",
		"values: ['1', '1', '2', '3', '5']",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// The tree is the real one: grown by the recursive definition of the lesson, 15 calls for n = 5.
	assert.match(component, /grow\(5, 0, -1\)/);
	assert.match(component, /grow\(n - 1, depth \+ 1, index\)/);
	assert.match(component, /grow\(n - 2, depth \+ 1, index\)/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/recursividad-pila-c'/);
	assert.match(component, /highlightCode\(source, 'c'\)/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.doesNotMatch(component, /<filter/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
