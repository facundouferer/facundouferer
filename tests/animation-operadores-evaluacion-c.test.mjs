import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/operadores-evaluacion-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'operadores-evaluacion-c';
const LESSON = 'operadores';
const FILE = '07-operadores';
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
		['precedence', 'associativity', 'shortcircuit', 'incdec', 'remainder', 'undefined'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['grouping', 'tie', 'and', 'or', 'prefix', 'postfix', 'remainder', 'print', 'undefined', 'recap'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'eval', `${step.id} plays on the single canvas`);
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

const narration = (lang) =>
	resolveScript(script, lang)
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n')
		.toLowerCase();

// Nothing from later lessons: pointers, arrays, structs, dynamic memory.
const LATER = /puntero|pointer|arreglo|array|struct|malloc|heap|char \*/i;

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// 1. How does precedence group operations?
		'la precedencia decide qué se agrupa primero',
		'`*` antes que `+`',
		'de abajo hacia arriba',
		// 2. What does associativity decide?
		'decide la asociatividad',
		'de izquierda a derecha',
		'`(10 - 4) - 3`',
		// 3. When does && stop evaluating?
		'`&&` evalúa la izquierda',
		'se detiene',
		'no se evalúa',
		'división por cero',
		'cortocircuito',
		'el orden importa',
		// 4. How do prefix and postfix differ?
		'el prefijo `++a` incrementa primero',
		'el valor nuevo',
		'el posfijo `b++` entrega el valor anterior',
		// 5. What does % return for negatives?
		'trunca hacia cero',
		'signo del dividendo',
		'`-7 % 3` es `-1`',
		// 6. Which expressions are undefined behavior?
		'comportamiento indefinido',
		'`i = i++ + 1`',
		'dos veces',
		'`int_max + 1`',
		'paréntesis',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|usá|modificá|evaluá)\b/i);
	assert.doesNotMatch(all, LATER);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'precedence decides what groups first',
		'`*` before `+`',
		'bottom-up',
		'associativity decides',
		'left to right',
		'`(10 - 4) - 3`',
		'`&&` evaluates the left side',
		'it stops',
		'is not evaluated',
		'division by zero',
		'short-circuit',
		'order matters',
		'the prefix `++a` increments first',
		'the new value',
		'the postfix `b++` hands over the old value',
		'truncates toward zero',
		'sign of the dividend',
		'`-7 % 3` is `-1`',
		'undefined behavior',
		'`i = i++ + 1`',
		'twice',
		'`int_max + 1`',
		'parentheses',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, LATER);
});

test('a tree is evaluated bottom-up: the inner operator first, its result travels up', () => {
	const grouping = cuesOf('grouping');
	assert.ok(firstAt(grouping, 'enter', 'nd-4m') < firstAt(grouping, 'enter', 'nd-4p'), '* is evaluated before +');
	assert.deepEqual(stopsOf(grouping, 'tk-4m'), ['an-4p'], 'the 12 goes up into the plus');
	assert.deepEqual(stopsOf(grouping, 'tk-4'), ['ab-4'], 'the 14 goes into the box');
	assert.ok(firstAt(grouping, 'enter', 'vl-4') > firstAt(grouping, 'move', 'tk-4'), 'the box holds 14 once the value arrives');

	// Same precedence: the left minus is evaluated first, so the result is 3 and not 9.
	const tie = cuesOf('tie');
	assert.ok(firstAt(tie, 'enter', 'nd-5l') < firstAt(tie, 'enter', 'nd-5r'), 'the left minus goes first');
	assert.deepEqual(stopsOf(tie, 'tk-5l'), ['an-5r']);
	assert.deepEqual(stopsOf(tie, 'tk-5'), ['ab-5']);
	assert.ok(idsOf(tie, 'enter').includes('lb-no9'), 'the wrong reading is named');
});

test('&& and || stop at the first deciding operand: the right side is sealed, never lit', () => {
	const and = cuesOf('and');
	const or = cuesOf('or');
	for (const [cues, left, root, seal, skip, token, box] of [
		[and, 'nd-7l', 'nd-7r', 'seal-7', 'lb-skip7', 'tk-7', 'ab-7'],
		[or, 'nd-8l', 'nd-8r', 'seal-8', 'lb-skip8', 'tk-8', 'ab-8'],
	]) {
		assert.ok(firstAt(cues, 'enter', left) < firstAt(cues, 'enter', root), `${left} is evaluated before ${root}`);
		assert.ok(firstAt(cues, 'enter', root) < firstAt(cues, 'enter', seal), `the verdict comes before ${seal}`);
		assert.ok(idsOf(cues, 'enter').includes(skip), `${skip} says it is not evaluated`);
		assert.deepEqual(stopsOf(cues, token), [box]);
	}
	const all = script.steps.flatMap((step) => step.motion.cues);
	for (const id of ['nd-7w', 'nd-8w', 'lf-7w', 'lf-8w']) assert.ok(!idsOf(all, 'enter').includes(id), `${id} is never lit`);
	assert.deepEqual(stopsOf(and, 'tk-7l'), ['an-7r']);
	assert.deepEqual(stopsOf(or, 'tk-8l'), ['an-8r']);
});

test('prefix gives the new value, postfix the old one and increments afterwards', () => {
	const prefix = cuesOf('prefix');
	assert.ok(firstAt(prefix, 'enter', 'vl-a1') < firstAt(prefix, 'move', 'tk-10'), 'a becomes 6 before the expression leaves');
	assert.deepEqual(stopsOf(prefix, 'tk-10'), ['ab-10']);

	const postfix = cuesOf('postfix');
	assert.ok(firstAt(postfix, 'move', 'tk-11') < firstAt(postfix, 'enter', 'vl-b1'), 'the old 5 leaves before b becomes 6');
	assert.deepEqual(stopsOf(postfix, 'tk-11'), ['ab-11']);
	assert.ok(firstAt(postfix, 'exit', 'vl-b0') < firstAt(postfix, 'enter', 'vl-b1'));
});

test('% gives -1 for -7 % 3, and the two undefined lines are shown but never run', () => {
	const remainder = cuesOf('remainder');
	assert.deepEqual(stopsOf(remainder, 'tk-12'), ['ab-12']);
	for (const id of ['lb-div', 'rs-12r', 'lb-ident']) assert.ok(idsOf(remainder, 'enter').includes(id), `remainder shows ${id}`);

	const ub = cuesOf('undefined');
	const all = script.steps.flatMap((step) => step.motion.cues);
	for (const id of ['warn-15', 'seal-15', 'seal-16', 'vl-i1', 'vl-g1', 'lb-ub1', 'lb-ub2']) assert.ok(idsOf(ub, 'enter').includes(id), `undefined shows ${id}`);
	assert.deepEqual(idsOf(ub, 'draw'), ['bw-15', 'bw-16']);
	// Refused state: no operator lights up and no value travels out of lines 15 and 16.
	for (const id of ['on-15', 'on-16', 'nd-15a', 'nd-16u']) assert.ok(!idsOf(all, 'enter').includes(id), `${id} never lights up`);
	assert.ok(!ub.some((cue) => cue.do === 'move' && String(cue.el).startsWith('tk-')), 'no value travels in the undefined scene');
	assert.ok(firstAt(ub, 'enter', 'vl-i1') > firstAt(ub, 'draw', 'bw-15'), 'the two writes come before the refused value');

	// The camera pulls back to the whole system at the end.
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
});

test('every executed line runs on its editor line and builds its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	for (const line of [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]) {
		assert.ok(stopsOf(all, 'hl').includes(`ln-${line}`), `the bar reaches line ${line}`);
		assert.ok(stopsOf(all, 'p').includes(`a-m${line}`), `the flow visits the module of line ${line}`);
		assert.ok(idsOf(all, 'enter').includes(`m-${line}`), `module ${line} is built`);
	}
	for (const line of [6, 9, 13, 14, 17]) assert.ok(idsOf(all, 'enter').includes(`on-${line}`), `module ${line} lights up`);
	// Every print types its real output.
	assert.deepEqual(idsOf(all, 'type'), ['o-13', 'o-14']);
	// Nothing is shown twice without leaving first.
	const seen = new Set();
	for (const cue of all) {
		if (cue.do === 'enter') {
			assert.ok(!seen.has(cue.el), `${cue.el} enters twice`);
			seen.add(cue.el);
		}
		if (cue.do === 'exit' && !['tk-4m', 'tk-4', 'tk-5l', 'tk-5', 'tk-7l', 'tk-7', 'tk-8l', 'tk-8', 'tk-10', 'tk-11', 'tk-12'].includes(cue.el)) {
			assert.ok(seen.has(cue.el), `${cue.el} exits before it ever entered`);
			seen.delete(cue.el);
		}
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="eval" data-motion/);

	// Ids built in a loop (`c-${node.id}`) are checked against the ids and lines the loop walks.
	const prefixes = [...component.matchAll(/(?:data-(?:el|anchor)=\{|id: )`([^`$]*)\$\{/g)].map((match) => match[1]);
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		return prefixes.some((prefix) => {
			if (!id.startsWith(prefix)) return false;
			const suffix = id.slice(prefix.length);
			return component.includes(`id: '${suffix}'`) || new RegExp(`line: ${suffix}[,}]`).test(component) || (/^\d+$/.test(suffix) && Number(suffix) >= 1 && Number(suffix) <= 18);
		});
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
		"t('valor', 'value')",
		"t('personas', 'people')",
		"t('esCaro', 'isExpensive')",
		"t('resto', 'rest')",
		'`    int ${names.value} = 2 + 3 * 4;`,',
		'`    int ${names.diff} = 10 - 4 - 3;`,',
		'`    int total = 50, ${names.people} = 0;`,',
		'`    int ${names.costly} = ${names.people} != 0 && total / ${names.people} > 20;`,',
		'`    int ok = ${names.people} == 0 || total / ${names.people} > 20;`,',
		"'    int a = 5, b = 5;',",
		"'    int x = ++a;',",
		"'    int y = b++;',",
		'`    int ${names.rest} = -7 % 3;`,',
		"'    // i = i++ + 1;',",
		'`    // ${names.big} = INT_MAX + 1;`,',
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// The real output (cc -std=c23 -Wall -Wextra -Wpedantic, undefined lines commented out): 14 3 0 1 / a=6 x=6 b=6 y=5 r=-1.
	for (const out of ["{ id: 'o-13', row: 0, text: '14 3 0 1' }", "{ id: 'o-14', row: 1, text: 'a=6 x=6 b=6 y=5 r=-1' }"]) {
		assert.ok(component.includes(out), `missing output ${out}`);
	}
	// Every line fits the editor (about 64 characters) in both languages.
	const slots = {
		'${names.value}': ['valor', 'value'],
		'${names.diff}': ['resta', 'diff'],
		'${names.people}': ['personas', 'people'],
		'${names.costly}': ['esCaro', 'isExpensive'],
		'${names.rest}': ['resto', 'rest'],
		'${names.big}': ['grande', 'big'],
	};
	for (const index of [0, 1]) {
		for (const line of program) {
			let filled = line.trim().slice(1, -2).replaceAll('\\\\', '\\');
			for (const [slot, values] of Object.entries(slots)) filled = filled.replaceAll(slot, values[index]);
			assert.doesNotMatch(filled, /\$\{/, `unfilled slot in ${line}`);
			assert.ok(filled.length <= 64, `a program line is too long (${filled.length}): ${filled}`);
		}
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/operadores-evaluacion-c'/);
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
	assert.equal((component.match(/data-slug='operadores-evaluacion-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
