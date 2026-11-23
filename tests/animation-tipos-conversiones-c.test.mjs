import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/tipos-conversiones-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'tipos-conversiones-c';
const LESSON = 'tipos-de-datos';
const FILE = '05-tipos-de-datos';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.ok(getAnimationsForLesson('c', LESSON).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['sizes', 'edge', 'division', 'cast', 'trap', 'whole'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['boxes', 'print', 'intmax', 'wrap', 'intdiv', 'cast', 'trap', 'recap'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'types', `${step.id} plays on the single canvas`);
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

// Nothing from later lessons: pointers, arrays, strings, structs, dynamic memory.
const LATER = /\b(punteros?|pointers?|arreglos?|arrays?|cadenas?|strings?|struct|malloc|free|heap|stack|pila)\b/i;

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// 1. How big is each type, and how do you find out?
		'caja hecha de bytes',
		'`sizeof` mide la caja en bytes',
		'`sizeof(int)` da 4',
		'`char` mide siempre 1 byte',
		'`int`, típicamente 4',
		'`double`, 8',
		'al menos 16 bits',
		// 2. What does size_t hold?
		'`size_t`: un entero sin signo para tamaños',
		'`%zu`',
		// 3. The edge of an int versus an unsigned.
		'`int_max`',
		'2147483647',
		'comportamiento indefinido, no da la vuelta',
		'`uint_max`',
		'4294967295',
		'da la vuelta y vale 0',
		'módulo 2ⁿ',
		// 4. Why 7 / 2 is 3.
		'división entera',
		'`7 / 2` da 3',
		'la parte decimal se descarta',
		// 5. What a cast does.
		'el cast `(double)a` convierte `a` antes de dividir',
		'conversión implícita',
		'`(double)7 / 2` da 3.5',
		'3.500000',
		// 6. Why -1 < 1u is false.
		'`menosuno < uno` mezcla con signo y sin signo',
		'-1 se convierte en `uint_max`',
		'no es menor que 1',
		'`-1 < 1u` es falso',
		'`-wextra`',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|sumá|dividí|mezclá)\b/i);
	assert.doesNotMatch(all, LATER);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'box made of bytes',
		'`sizeof` measures the box in bytes',
		'`sizeof(int)` is 4',
		'`char` is always 1 byte',
		'`int` is typically 4',
		'at least 16 bits',
		'`size_t`: an unsigned integer for sizes',
		'`%zu`',
		'2147483647',
		'undefined behavior, it does not wrap',
		'4294967295',
		'wraps around to 0',
		'integer division',
		'`7 / 2` is 3',
		'the fraction is dropped',
		'the cast `(double)a` converts `a` before dividing',
		'implicit conversion',
		'`(double)7 / 2` is 3.5',
		'`minusone < one` mixes signed and unsigned',
		'-1 is converted to `uint_max`',
		'`-1 < 1u` is false',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, LATER);
});

test('values live in boxes: sizeof measures them, the int refuses one more and the unsigned wraps', () => {
	// sizeof(int) measures the int box and its 4 lands in the size_t box.
	const boxes = cuesOf('boxes');
	for (const id of ['b-char', 'b-int', 'm-5', 'm-6', 'v-bytes', 'lb-sizet']) assert.ok(idsOf(boxes, 'enter').includes(id), `boxes shows ${id}`);
	assert.ok(idsOf(boxes, 'draw').includes('r-int'));
	assert.deepEqual(stopsOf(boxes, 't-4'), ['a-bytes']);
	assert.ok(firstAt(boxes, 'enter', 'v-bytes') >= firstAt(boxes, 'move', 't-4'), 'bytes holds 4 once the token arrives');
	const print = cuesOf('print');
	for (const id of ['r-char', 'r-alt']) assert.ok(idsOf(print, 'draw').includes(id));

	// The int at INT_MAX: one more bounces off its wall, it does not wrap.
	const intmax = cuesOf('intmax');
	for (const id of ['full-int', 'v-int', 'wall', 'lb-ub', 'warn-8']) assert.ok(idsOf(intmax, 'enter').includes(id), `intmax shows ${id}`);
	assert.deepEqual(stopsOf(intmax, 't-plus'), ['a-wall', 'a-plus'], 'the +1 is refused and bounces back');
	assert.ok(!idsOf(intmax, 'exit').includes('v-int'), 'the int keeps INT_MAX');

	// The unsigned at UINT_MAX: +1u takes it back to 0.
	const wrap = cuesOf('wrap');
	assert.deepEqual(stopsOf(wrap, 't-plusu'), ['a-cnt']);
	assert.ok(idsOf(wrap, 'exit').includes('v-cmax'));
	assert.ok(idsOf(wrap, 'draw').includes('arc-wrap'));
	assert.ok(firstAt(wrap, 'enter', 'v-c0') > firstAt(wrap, 'exit', 'v-cmax'), 'the same box now holds 0');
});

test('7 / 2 drops the fraction, the cast converts first and -1 becomes a huge unsigned', () => {
	const intdiv = cuesOf('intdiv');
	assert.deepEqual(stopsOf(intdiv, 't-7'), ['a-m13']);
	assert.deepEqual(stopsOf(intdiv, 't-2'), ['a-m13']);
	assert.deepEqual(stopsOf(intdiv, 't-3'), ['a-res1']);
	assert.deepEqual(stopsOf(intdiv, 't-frac'), ['a-drop']);
	assert.ok(idsOf(intdiv, 'exit').includes('t-frac'), 'the fraction is dropped');

	const cast = cuesOf('cast');
	assert.ok(stopsOf(cast, 't-7').includes('a-cast'), 'a goes through the cast');
	assert.ok(stopsOf(cast, 't-2').includes('a-conv'), 'b is converted implicitly');
	assert.ok(firstAt(cast, 'move', 't-7d') < firstAt(cast, 'move', 't-2d'), 'the cast acts before the division');
	assert.deepEqual(stopsOf(cast, 't-35'), ['a-res2']);
	for (const id of ['lb-cast', 'lb-implicit']) assert.ok(idsOf(cast, 'enter').includes(id));

	const trap = cuesOf('trap');
	assert.deepEqual(stopsOf(trap, 't-m1'), ['a-conv2']);
	assert.ok(firstAt(trap, 'enter', 't-huge') >= firstAt(trap, 'exit', 't-m1'), '-1 turns into the huge unsigned value');
	assert.deepEqual(stopsOf(trap, 't-huge'), ['a-m16']);
	assert.deepEqual(stopsOf(trap, 't-0'), ['a-res3']);
	for (const id of ['lb-warn', 'warn-16']) assert.ok(idsOf(trap, 'enter').includes(id));

	// The camera pulls back to the whole system at the end.
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
});

test('every executed line runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	for (const line of [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]) {
		assert.ok(stopsOf(all, 'hl').includes(`ln-${line}`), `the bar reaches line ${line}`);
		assert.ok(stopsOf(all, 'p').includes(`a-m${line}`), `the flow visits the module of line ${line}`);
		assert.ok(idsOf(all, 'enter').includes(`m-${line}`), `module ${line} is built`);
		assert.ok(idsOf(all, 'enter').includes(`on-${line}`), `module ${line} lights up`);
	}
	// Every print types its real output.
	assert.deepEqual(idsOf(all, 'type'), ['o-7', 'o-8', 'o-11', 'o-13a', 'o-13b', 'o-16']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="types" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		const line = id.match(/^(?:m|on|a-m|warn)-?(\d+)$/);
		if (line) return new RegExp(`line: ${line[1]}[,}]|WARN_LINES = \\[[^\\]]*\\b${line[1]}\\b`).test(component);
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
});

test('the editor holds the program and the output the lesson teaches', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const program = component.split('const program = [')[1].split('].join')[0].trim().split('\n');
	assert.equal(program.length, 18, 'the editor holds the 18 lines of the program');
	assert.match(component, /highlightCode\(program, 'c'\)/, 'the program uses C highlighting');
	for (const fragment of [
		"t('altura', 'height')",
		"t('contador', 'counter')",
		"t('menosUno', 'minusOne')",
		"t('uno', 'one')",
		"'#include <limits.h>',",
		'`    double ${names.alt} = 1.75;`,',
		"'    size_t bytes = sizeof(int);',",
		'sizeof(char), bytes, sizeof ${names.alt}',
		'printf("%d\\\\n", INT_MAX);',
		'`    unsigned int ${names.cnt} = UINT_MAX;`,',
		'`    ${names.cnt} = ${names.cnt} + 1u;`,',
		"'    int a = 7, b = 2;',",
		"'    printf(\"%d %f\\\\n\", a / b, (double)a / b);',",
		'`    int ${names.neg} = -1;`,',
		'`    unsigned int ${names.one} = 1u;`,',
		'printf("%d\\\\n", ${names.neg} < ${names.one});',
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// The real output (cc -std=c23 on a 64-bit machine): 1 4 8 / 2147483647 / 0 / 3 3.500000 / 0.
	for (const out of ["text: '1 4 8'", "text: '2147483647'", "{ id: 'o-11', row: 2, text: '0' }", "text: '3'", "text: '  3.500000'", "{ id: 'o-16', row: 4, text: '0' }"]) {
		assert.ok(component.includes(out), `missing output ${out}`);
	}
	// Every line fits the editor (about 64 characters) in both languages.
	const longest = { '${names.alt}': 'height', '${names.cnt}': 'contador', '${names.neg}': 'menosUno', '${names.one}': 'one', "${t('indefinido', 'undefined')}": 'indefinido' };
	for (const line of program) {
		let filled = line.trim().slice(1, -2).replaceAll('\\\\', '\\');
		for (const [slot, value] of Object.entries(longest)) filled = filled.replaceAll(slot, value);
		assert.doesNotMatch(filled, /\$\{/, `unfilled slot in ${line}`);
		assert.ok(filled.length <= 64, `a program line is too long (${filled.length}): ${filled}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/tipos-conversiones-c'/);
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
	assert.equal((component.match(/data-slug='tipos-conversiones-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
