import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/depuracion-sanitizers-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'depuracion-sanitizers-c';
const LESSON = 'depuracion-y-sanitizers';
const FILE = '36-depuracion-y-sanitizers';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.equal(animation.image, `/img/animations/${SLUG}.svg`);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.ok(getAnimationsForLesson('c', LESSON).map((entry) => entry.slug).includes(SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['method', 'warnings', 'debugger', 'firstwrong', 'sanitizers', 'fix'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['method', 'warnings', 'silent', 'breakpoint', 'inspect', 'firstwrong', 'asan', 'ubsan', 'fix'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'journey', `${step.id} plays on the single canvas`);
		assert.ok(step.motion, `${step.id} is a motion step`);
		assert.ok(step.subtitles.every((sub) => typeof sub.at === 'number'), `${step.id} pins captions`);
		assert.ok(step.motion.cues.length >= 12, `${step.id} choreographs the canvas`);
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
		console.log(`# ${lang}: ${Math.round(total / 1000)} s`);
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

test('narration answers the six questions of the brief in both languages', () => {
	const narration = (lang) =>
		resolveScript(script, lang)
			.steps.map((step) => `${step.title} ${step.text}`)
			.join('\n')
			.toLowerCase();
	const covered = {
		es: [
			// What the debugging method is.
			'método de cinco pasos', 'reproducir', 'aislar', 'hipótesis', 'corregir', 'verificar',
			// Why warnings come first.
			'advertencias', 'primer depurador', 'sin ejecutarlo', 'sin ninguna advertencia',
			// What a breakpoint lets you inspect.
			'punto de parada', 'inspeccionar las variables', 'pila de llamadas',
			// How to find the first wrong value.
			'primer valor incorrecto', 'i == cantidad', 'fuera de los límites',
			// What ASan and UBSan catch.
			'addresssanitizer', 'stack-buffer-overflow', 'undefinedbehaviorsanitizer', 'desbordamiento con signo', 'comportamiento indefinido',
			'comprobación de regresión',
		],
		en: [
			'method', 'reproduce', 'isolate', 'hypothesis', 'fix', 'verify',
			'warnings', 'first debugger', 'without running it', 'no warnings',
			'breakpoint', 'inspect the variables', 'call stack',
			'first wrong value', 'i == count', 'out of bounds',
			'addresssanitizer', 'stack-buffer-overflow', 'undefinedbehaviorsanitizer', 'signed overflow', 'undefined behavior',
			'regression check',
		],
	};
	for (const lang of ['es', 'en']) {
		const all = narration(lang);
		for (const concept of covered[lang]) assert.ok(all.includes(concept), `${lang} narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(narration('es'), /\b(mirá|fijate|pensá|tenés|podés|querés|sabés)\b/i);
});

test('the debugger session follows the lesson: break, run, print, next, backtrace, watch, then the sanitizers', () => {
	const moves = (id) => script.steps.find((step) => step.id === id).motion.cues.filter((cue) => cue.do === 'move' && cue.el === 'hl').map((cue) => cue.to);
	assert.deepEqual(moves('breakpoint'), ['ln-6', 'ln-7']);
	assert.deepEqual(moves('inspect'), ['ln-14', 'ln-6']);
	assert.deepEqual(moves('firstwrong'), ['ln-5']);
	assert.deepEqual(moves('asan'), ['ln-6']);
	// The pointer `i` walks the four cells and the fifth one, which is outside the array.
	const walk = script.steps.find((step) => step.id === 'firstwrong').motion.cues.filter((cue) => cue.do === 'move' && cue.el === 'ptr-i').map((cue) => cue.to);
	assert.deepEqual(walk, ['a-c1', 'a-c2', 'a-c3', 'a-c4']);
	// After the fix the pointer never reaches the fifth cell.
	const fixed = script.steps.find((step) => step.id === 'fix').motion.cues.filter((cue) => cue.do === 'move' && cue.el === 'ptr-i').map((cue) => cue.to);
	assert.deepEqual(fixed, ['a-c0', 'a-c1', 'a-c2', 'a-c3']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop, or listed in a table of the frontmatter, count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`'${id}'`)) return true;
		const output = id.match(/^(?:out-|o)([a-z0-9]+?)(?:-\d+)?$/);
		if (output && component.includes(`id: '${output[1]}'`)) return true;
		const prefix = id.replace(/\d+$/, '');
		if (prefix !== id && component.includes('`' + prefix + '${')) return true;
		return /^hv-[insc]-\d+$/.test(id) && component.includes('`hv-${box.key}-${k}`');
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the code in the canvas is the lesson programs and the console its real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		'double ${n.prog}(const int ${n.grades}[], size_t ${n.count}) {',
		'for (size_t i = 0; i <= ${n.count}; i++) {',
		'${n.sum} += ${n.grades}[i];',
		'return (double)${n.sum} / ${n.count};',
		'if (${n.grades}[i] = 10) {',
		'int ${n.big} = INT_MAX;',
		"t('Promedio', 'Average')",
		'-43413400.25',
		'-173653632',
		'0x1000',
		'stack-buffer-overflow',
		'signed integer overflow: 2147483647 + 1',
		'${n.label}: 7.75',
		"--condition 'i == ${n.count}'",
	]) {
		assert.ok(component.includes(fragment), `missing fragment: ${fragment}`);
	}
	assert.match(component, /highlightCode\(source\.join\('\\n'\), 'c'\)/, 'the editor uses the shared C highlighter');
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/depuracion-sanitizers-c'/);
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
