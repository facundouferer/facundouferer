import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/hilos-atomics-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'hilos-atomics-c';
const LESSON = 'concurrencia-threads-y-atomics';
const FILE = '40-concurrencia-threads-y-atomics';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.ok(getAnimationsForLesson('c', LESSON).map((entry) => entry.slug).includes(SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['threads', 'race', 'mutex', 'atomic', 'join', 'deadlock'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['threads', 'steps', 'lost', 'race', 'mutex', 'atomic', 'join', 'deadlock', 'wrap'],
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
		console.log(`${lang}: ${Math.round(total / 1000)} s`);
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

test('narration answers the questions of the brief in both languages', () => {
	const text = (lang) =>
		resolveScript(script, lang)
			.steps.map((step) => `${step.title} ${step.text}`)
			.join('\n')
			.toLowerCase();
	const es = text('es');
	const en = text('en');
	const concepts = [
		// why two threads can lose an update
		[['ambos hilos leen a la vez', 'los dos escriben 42', 'el contador subió uno'], ['both threads read it at once', 'both write 42', 'went up by one']],
		// what a race condition is
		[['condición de carrera', 'carrera de datos', 'comportamiento indefinido'], ['race condition', 'data race', 'undefined behavior']],
		// what a mutex does
		[['un mutex es una puerta', 'solo un hilo a la vez', 'sección crítica'], ['a mutex is a gate', 'only one thread at a time', 'critical section']],
		// what atomic means
		[['atómica', 'un solo paso indivisible', 'atomic_fetch_add'], ['atomic operation', 'one indivisible step', 'atomic_fetch_add']],
		// what join does
		[['pthread_join', 'espere a que cada hilo termine'], ['pthread_join', 'wait for each thread to finish']],
		// how deadlock arises
		[['interbloqueo', 'orden opuesto', 'mismo orden'], ['deadlock', 'opposite order', 'same order']],
		// the standard threads header, only as optional
		[['<threads.h>', 'opcional'], ['<threads.h>', 'optional']],
	];
	for (const [inEs, inEn] of concepts) {
		for (const concept of inEs) assert.ok(es.includes(concept), `es narration should mention ${concept}`);
		for (const concept of inEn) assert.ok(en.includes(concept), `en narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(es, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés)\b/i);
});

test('the editor bar follows the lines of each program shape', () => {
	const bars = (id) => script.steps.find((step) => step.id === id).motion.cues.filter((cue) => cue.do === 'move' && cue.el === 'hl').map((cue) => cue.to);
	// v0: counter declaration, counter++, creates; v1: lock, counter++, unlock; v2: atomic_fetch_add, joins, printf
	assert.deepEqual(bars('threads'), ['ln-16', 'ln-17', 'ln-4', 'ln-2']);
	assert.deepEqual(bars('steps'), ['ln-9']);
	assert.deepEqual(bars('race'), ['ln-20']);
	assert.deepEqual(bars('mutex'), ['ln-10', 'ln-11', 'ln-12', 'ln-10', 'ln-11', 'ln-12']);
	assert.deepEqual(bars('atomic'), ['ln-10']);
	assert.deepEqual(bars('join'), ['ln-19', 'ln-20', 'ln-21']);
	assert.deepEqual(bars('deadlock'), ['ln-2', 'ln-6', 'ln-3', 'ln-7', 'ln-6', 'ln-3']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Literal ids, plus template ids (`ed-${variant}`, `st-${module.id}`) read as patterns.
	const literals = new Set([...component.matchAll(/data-(?:el|anchor)="([^"]+)"/g)].map((match) => match[1]));
	const patterns = [...component.matchAll(/data-(?:el|anchor)=\{`([^`]+)`\}/g)].map(
		(match) => new RegExp('^' + match[1].replace(/\$\{[^}]+\}/g, '[a-z0-9-]+') + '$'),
	);
	// Ids declared in data tables of the frontmatter.
	for (const match of component.matchAll(/(?:id|el): '([a-z0-9-]+)'/g)) literals.add(match[1]);
	for (const match of component.matchAll(/^\t'?([a-z-]+)'?: \[line\(/gm)) literals.add(match[1]);
	for (const match of component.matchAll(/id: `([a-z-]+)-\$\{[^}]+\}`/g)) patterns.push(new RegExp('^' + match[1] + '-[a-z0-9-]+$'));
	const moduleIds = new Set([...component.matchAll(/laneMod\('([a-z]+)'/g)].map((match) => match[1]).concat(['pr', 'xa', 'xb']));
	const known = (id) => literals.has(id) || patterns.some((pattern) => pattern.test(id));

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
				const module = id.match(/^(?:st|on|nm)-([a-z]+)/)?.[1];
				if (module) assert.ok(moduleIds.has(module), `unknown module "${module}" in ${id}`);
			}
		}
	}
});

test('the code in the canvas is the program the narration describes', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		'#include <pthread.h>',
		'#include <stdatomic.h>',
		'    pthread_t a, b;',
		'pthread_create(&a, NULL, ${id.inc}, NULL);',
		'pthread_join(b, NULL);',
		'${c}++; // ${cmt.race}',
		'pthread_mutex_lock(&${id.lock});',
		'pthread_mutex_unlock(&${id.lock});',
		'static pthread_mutex_t ${id.lock} = PTHREAD_MUTEX_INITIALIZER;',
		'static atomic_int ${c} = 0;',
		'atomic_fetch_add(&${c}, 1);',
		'atomic_load(&${c})',
		'pthread_mutex_lock(&${acc.a}.${id.lock});',
		"t('contador', 'counter')",
		"t('incrementar', 'increment')",
		'1195921',
		'2000000',
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/hilos-atomics-c'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
