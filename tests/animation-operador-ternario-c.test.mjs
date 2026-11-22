import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/operador-ternario-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'operador-ternario-c';
const LESSON = 'operador-ternario';
const FILE = '09-operador-ternario';
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
		['parts', 'expression', 'lazy', 'ifelse', 'type', 'nested'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['parts', 'argument', 'lazy', 'ifelse', 'type', 'print', 'nested', 'recap'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'ternary', `${step.id} plays on the single canvas`);
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

// Nothing from later lessons: pointers, arrays, structs, dynamic memory.
const LATER = /puntero|pointer|arreglo|array|struct|malloc|heap|char \*/i;

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// 1. What are the three parts?
		'tres partes',
		'la condición, el valor si es verdadera y el valor si es falsa',
		'con el ternario eliges un valor',
		// 2. Which branch is evaluated?
		'primero se evalúa la condición',
		'solo la rama elegida',
		'`100 / x` no se evalúa',
		'división por cero',
		'cortocircuito',
		// 3. Why is it an expression, and where can it go?
		'es una expresión: produce un valor',
		'donde se espera un valor',
		'argumento de `printf`',
		'se guarda en `menor`',
		// 4. How does it compare to if-else?
		'lo mismo que el `if-else`',
		'`if-else` es una sentencia',
		'en la misma línea',
		'`const`',
		// 5. What type does the result have?
		'un solo tipo',
		'conversiones aritméticas habituales',
		'el resultado es `double`',
		'sale como 90.0',
		'mismo tipo',
		// 6. When not to use it?
		'de derecha a izquierda',
		'acertijo',
		'`else if`',
		'dos valores simples',
		'varias instrucciones',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|elegís|usá|mantené|escribí|hacé)\b/i);
	assert.doesNotMatch(all, LATER);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'three parts',
		'the condition, the value if true and the value if false',
		'with the ternary you choose a value',
		'first the condition is evaluated',
		'only the chosen branch',
		'`100 / x` is never evaluated',
		'division by zero',
		'short circuit',
		'is an expression: it produces a value',
		'wherever a value is expected',
		'argument of `printf`',
		'stored in `smaller`',
		'the same as the `if-else`',
		'`if-else` is a statement',
		'on the same line',
		'`const`',
		'a single type',
		'usual arithmetic conversions',
		'the result is a `double`',
		'comes out as 90.0',
		'same type',
		'right to left',
		'puzzle',
		'`else if`',
		'two simple values',
		'several statements',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, LATER);
});

test('every fork shows its verdict first and then lights only the chosen branch', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	for (const line of [5, 7, 9, 11, 13, 15, 16]) {
		assert.ok(idsOf(all, 'enter').includes(`cv-${line}`), `the condition of line ${line} gets a verdict`);
		assert.ok(idsOf(all, 'draw').includes(`k-${line}`), `the chosen branch of line ${line} lights up`);
		assert.ok(firstAt(all, 'enter', `cv-${line}`) !== undefined);
	}
	for (const step of script.steps) {
		const cues = step.motion.cues;
		for (const cue of cues.filter((item) => item.do === 'draw' && item.el.startsWith('k-'))) {
			const line = cue.el.slice(2);
			assert.ok(firstAt(cues, 'enter', `cv-${line}`) < cue.at, `line ${line}: condition before branch`);
		}
	}

	// The value becomes the right-hand side of an assignment, or a printf argument.
	const parts = cuesOf('parts');
	assert.deepEqual(stopsOf(parts, 't-r5'), ['a-menor']);
	assert.ok(firstAt(parts, 'enter', 'v-menor') >= firstAt(parts, 'move', 't-r5'), 'menor holds 5 once the value arrives');
	const argument = cuesOf('argument');
	assert.deepEqual(stopsOf(argument, 't-r7'), ['a-in7'], 'the 12 goes straight into printf');
	assert.ok(idsOf(argument, 'enter').includes('lb-expr'));
});

test('the branch that is not chosen is never evaluated, and if-else says the same with statements', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const lazy = cuesOf('lazy');
	for (const id of ['seal-9', 'lb-lazy', 'warn-9']) assert.ok(idsOf(lazy, 'enter').includes(id), `lazy shows ${id}`);
	assert.deepEqual(stopsOf(lazy, 't-r9'), ['a-r']);
	assert.match(component, /line: 9, [^\n]*t: \{ text: '100 \/ x'[^\n]*pick: 'false'/, 'line 9 picks 0, not 100 / x');
	assert.match(component, /line: 5, [^\n]*pick: 'false'/);
	assert.match(component, /line: 7, [^\n]*pick: 'true'/);

	const ifelse = cuesOf('ifelse');
	for (const id of ['card', 'card-hl', 'v-signo', 'lb-const']) assert.ok(idsOf(ifelse, 'enter').includes(id), `ifelse shows ${id}`);
	assert.deepEqual(stopsOf(ifelse, 't-r11'), ['a-signo']);
	for (const fragment of ['`int ${names.sign};`', '`if (${names.num} >= 0) {`', '`    ${names.sign} = 1;`', "'} else {'", '`    ${names.sign} = -1;`']) {
		assert.ok(component.includes(fragment), `the if-else card lacks ${fragment}`);
	}
});

test('int and double give a double, and a nested chain groups right to left', () => {
	const type = cuesOf('type');
	assert.deepEqual(stopsOf(type, 't-90'), ['a-conv13']);
	assert.deepEqual(stopsOf(type, 't-90d'), ['a-precio']);
	assert.ok(firstAt(type, 'enter', 't-90d') >= firstAt(type, 'exit', 't-90'), '90 turns into 90.0');
	assert.ok(idsOf(type, 'enter').includes('lb-type'));
	const print = cuesOf('print');
	assert.deepEqual(stopsOf(print, 't-c14c'), ['a-in14']);

	const nested = cuesOf('nested');
	assert.ok(firstAt(nested, 'draw', 'k-15') < firstAt(nested, 'draw', 'k-16'), 'the outer condition decides first');
	assert.deepEqual(stopsOf(nested, 't-r16'), ['a-in15']);
	for (const id of ['lb-chain', 'lb-elseif', 'warn-15']) assert.ok(idsOf(nested, 'enter').includes(id));

	// The camera pulls back to the whole system at the end.
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
});

test('every executed line runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	for (const line of [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]) {
		assert.ok(stopsOf(all, 'hl').includes(`ln-${line}`), `the bar reaches line ${line}`);
		assert.ok(stopsOf(all, 'p').includes(`a-m${line}`), `the flow visits the module of line ${line}`);
		assert.ok(idsOf(all, 'enter').includes(`m-${line}`), `module ${line} is built`);
		assert.ok(idsOf(all, 'enter').includes(`on-${line}`), `module ${line} lights up`);
	}
	// Every print types its real output.
	assert.deepEqual(idsOf(all, 'type'), ['o-6', 'o-7', 'o-14', 'o-15']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="ternary" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		const line = id.match(/^(?:m|on|a-m|cv|k|c|pt|pf|a-k|a-in)-?(\d+)$/);
		if (line) return new RegExp(`line: ${line[1]}[,}]`).test(component);
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
		"t('menor', 'smaller')",
		"t('numero', 'number')",
		"t('signo', 'sign')",
		"t('conDescuento', 'discounted')",
		"t('precio', 'price')",
		"t('El menor es', 'The smaller is')",
		"t('negativo', 'negative')",
		"'    int a = 12, b = 5;',",
		'`    int ${names.min} = a < b ? a : b;`,',
		'a > b ? a : b);`,',
		"'    int r = x != 0 ? 100 / x : 0;',",
		'`    const int ${names.sign} = ${names.num} >= 0 ? 1 : -1;`,',
		'`    bool ${names.disc} = true;`,',
		'`    double ${names.price} = ${names.disc} ? 90 : 99.5;`,',
		'`    printf("%s\\\\n", ${names.num} > 0 ? "${names.pos}"`,',
		'`           : ${names.num} < 0 ? "${names.neg}" : "${names.zero}");`,',
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// The real output (cc -std=c23 -Wall -Wextra -Wpedantic): El menor es: 5 / El mayor es: 12 / 0 -1 90.0 / negativo.
	for (const out of [
		"{ id: 'o-6', row: 0, text: `${names.minText}: 5` }",
		"{ id: 'o-7', row: 1, text: `${names.maxText}: 12` }",
		"{ id: 'o-14', row: 2, text: '0 -1 90.0' }",
		"{ id: 'o-15', row: 3, text: names.neg }",
	]) {
		assert.ok(component.includes(out), `missing output ${out}`);
	}
	// Every line fits the editor (about 64 characters) in both languages.
	const longest = {
		'${names.min}': 'smaller',
		'${names.num}': 'numero',
		'${names.sign}': 'signo',
		'${names.disc}': 'conDescuento',
		'${names.price}': 'precio',
		'${names.minText}': 'The smaller is',
		'${names.maxText}': 'The larger is',
		'${names.pos}': 'positivo',
		'${names.neg}': 'negativo',
		'${names.zero}': 'zero',
	};
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
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/operador-ternario-c'/);
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
	assert.equal((component.match(/data-slug='operador-ternario-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
