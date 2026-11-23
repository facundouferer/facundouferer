import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/funciones-modulos-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'funciones-modulos-c';
const LESSON = 'modularizacion-subprogramas-y-funciones';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '15-modularizacion-subprogramas-y-funciones';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;

test(`catalog binds ${SLUG} to c/${LESSON} among the lesson's animations`, () => {
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
		['prototype', 'guard', 'objects', 'linker', 'undefined', 'interface'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['header', 'include', 'guard', 'compile', 'link', 'missing', 'contract', 'hidden'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'project', `${step.id} plays on the single canvas`);
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

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// 1. What does a prototype tell the compiler?
		'`int sumar(int a, int b);`',
		'un prototipo',
		'el nombre, los tipos de los parámetros y el tipo de retorno',
		'`#include "calculadora.h"` copia el prototipo en `main.c`',
		// 2. What does an include guard prevent?
		'`#ifndef`',
		'`calculadora_h` ya existe',
		'se salta hasta `#endif`',
		// 3. Why does each .c compile to its own .o?
		'cada `.c` se compila por separado con `-c`',
		'`calculadora.o` lleva la definición de `sumar`',
		'referencia pendiente',
		// 4. What does the linker resolve?
		'el enlazador une los `.o`',
		'resuelve la referencia',
		'`5 + 3 = 8`',
		// 5. What causes an undefined symbol?
		'si olvidas `calculadora.o`',
		'símbolo indefinido',
		'referencia sin definición',
		// 6. Interface versus implementation, and static
		'el `.h` es la interfaz',
		'el `.c` es la implementación',
		'`cuadrado` es `static`',
		'lo que no figura en el `.h` debería ser `static`',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|agregá|creá|olvidás)\b/i);
	// Curriculum sequencing: nothing from later lessons.
	assert.doesNotMatch(all, /struct|typedef|make|recursi|puntero|malloc|pila de llamadas/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'`int add(int a, int b);`',
		'a prototype',
		'the name, the parameter types and the return type',
		'`#include "calculator.h"` copies the prototype into `main.c`',
		'`#ifndef`',
		'`calculator_h` exists',
		'skips to `#endif`',
		'each `.c` is compiled on its own with `-c`',
		'`calculator.o` carries the definition of `add`',
		'pending reference',
		'the linker joins the `.o` files',
		'resolves the reference',
		'`5 + 3 = 8`',
		'if you leave out `calculator.o`',
		'undefined symbol',
		'a reference with no definition',
		'the `.h` is the interface',
		'the `.c` is the implementation',
		'`square` is `static`',
		'whatever is not in the `.h` should be `static`',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /struct|typedef|\bmake\b|recursi|pointer|malloc|call stack/i);
});

test('the prototype is copied into main.c, guarded, compiled apart and linked', () => {
	// The header declares; #include copies the prototype from the header to main.c.
	const header = cuesOf('header');
	for (const id of ['z-c', 'z-h', 'z-m', 'fh', 'm-h4', 'pk-proto', 'lb-sig', 'lb-nobody']) assert.ok(idsOf(header, 'enter').includes(id), `header shows ${id}`);
	const include = cuesOf('include');
	assert.deepEqual(stopsOf(include, 'pk-copy'), ['a-mp']);
	assert.ok(idsOf(include, 'draw').includes('rt-inc'));
	assert.ok(firstAt(include, 'enter', 'ch-checked') > firstAt(include, 'move', 'pk-copy'), 'the call is checked once the prototype arrived');

	// The guard lets the first copy in and stops the second at the gate.
	const guard = cuesOf('guard');
	assert.deepEqual(stopsOf(guard, 'pk-dup'), ['a-gate']);
	assert.ok(firstAt(guard, 'exit', 'pk-dup') > firstAt(guard, 'move', 'pk-dup'), 'the second copy turns back at the gate');
	for (const id of ['gate', 'on-h1', 'on-h2', 'on-h7', 'ch-defined', 'ch-skip']) assert.ok(idsOf(guard, 'enter').includes(id), `guard shows ${id}`);

	// Each .c becomes its own .o: calculadora.o holds the definition, main.o a pending reference.
	const compile = cuesOf('compile');
	assert.ok(firstAt(compile, 'enter', 'z-oc') < firstAt(compile, 'enter', 'z-om'), 'calculadora.o comes first, as in the commands');
	assert.ok(idsOf(compile, 'enter').includes('ch-def'));
	assert.ok(idsOf(compile, 'enter').includes('ch-ref'));
	assert.deepEqual(idsOf(compile, 'type').filter((id) => id.startsWith('ra-')), ['ra-0', 'ra-1']);

	// The linker resolves the pending reference and an executable appears.
	const link = cuesOf('link');
	assert.ok(idsOf(link, 'draw').includes('rt-res'));
	assert.ok(firstAt(link, 'exit', 'ch-ref') > firstAt(link, 'draw', 'rt-res'), 'the reference is resolved by the link');
	assert.ok(idsOf(link, 'enter').includes('ch-res'));
	for (const id of ['z-x', 'ch-run']) assert.ok(idsOf(link, 'enter').includes(id), `link shows ${id}`);
	assert.deepEqual(idsOf(link, 'type').filter((id) => id.startsWith('rb-')), ['rb-0', 'rb-1', 'rb-2', 'rb-3']);

	// Without calculadora.o the reference stays pending and the linker reports it.
	const missing = cuesOf('missing');
	for (const id of ['z-oc', 'ch-def', 'z-x']) assert.ok(idsOf(missing, 'exit').includes(id), `missing removes ${id}`);
	assert.ok(idsOf(missing, 'draw').includes('rt-miss'));
	assert.deepEqual(idsOf(missing, 'type').filter((id) => id.startsWith('rc-')), ['rc-0', 'rc-1', 'rc-2', 'rc-3', 'rc-4', 'rc-5', 'rc-6']);
	assert.ok(idsOf(missing, 'enter').includes('hl-err'), 'the failing command is marked');
	assert.ok(idsOf(missing, 'enter').includes('ch-undef'));

	// Interface (.h) versus implementation (.c), then static hides the helper.
	const contract = cuesOf('contract');
	assert.ok(idsOf(contract, 'enter').includes('lb-iface'));
	assert.ok(idsOf(contract, 'enter').includes('lb-impl'));
	assert.ok(idsOf(contract, 'enter').includes('lb-rebuild'));
	const hidden = cuesOf('hidden');
	assert.ok(stopsOf(hidden, 'hl').includes('lc-3'), 'the bar reaches the static helper');
	for (const id of ['on-c3', 'ch-static', 'ch-private']) assert.ok(idsOf(hidden, 'enter').includes(id), `hidden shows ${id}`);

	// The camera pulls back to the whole system at the end.
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
});

test('every key line runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	const lit = [
		['h', [1, 2, 7]],
		['c', [3, 7]],
		['m', [8]],
	];
	for (const [file, lines] of lit) {
		for (const line of lines) assert.ok(idsOf(all, 'enter').includes(`on-${file}${line}`), `module ${file}${line} lights up`);
	}
	const built = [
		['h', [1, 2, 4, 5, 7]],
		['c', [1, 3, 7, 11]],
		['m', [2, 8]],
	];
	for (const [file, lines] of built) {
		for (const line of lines) assert.ok(idsOf(all, 'enter').includes(`m-${file}${line}`), `module ${file}${line} is built`);
	}
	for (const to of ['lh-1', 'lh-2', 'lh-4', 'lh-5', 'lh-7', 'lc-1', 'lc-3', 'lc-7', 'lc-12', 'lm-2', 'lm-8']) {
		assert.ok(stopsOf(all, 'hl').includes(to), `the bar reaches ${to}`);
	}
	// The editor switches file with its tab.
	assert.deepEqual([...new Set(stopsOf(all, 'tabs'))].sort(), ['tb-c', 'tb-h', 'tb-m']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="project" data-motion/);

	// Lines per file, taken from the sources the editor shows.
	const lineCount = { h: 7, c: 13, m: 11 };
	const consoleRows = { a: 2, b: 4, c: 7 };
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		// Editor lines, line anchors and console rows come from tables.
		const line = id.match(/^(?:e|l)([hcm])-(\d+)$/);
		if (line) return Number(line[2]) <= lineCount[line[1]] && /data-el=\{`e\$\{file\.key\}-/.test(component) && /data-anchor=\{`l\$\{file\.key\}-/.test(component);
		const row = id.match(/^r([abc])-(\d+)$/);
		if (row) return Number(row[2]) < consoleRows[row[1]] && component.includes('data-el={`r${block.id}-${index}`}');
		// Modules, their lit twins and the file groups are generated from the module table.
		const module = id.match(/^(?:m|on|a)-([hcm]\d+)$/);
		if (module) return component.includes(`[${module[1].slice(1)}, `) && /data-el=\{`m-\$\{module\.id\}`\}/.test(component);
		if (/^co-[abc]$/.test(id)) return component.includes('data-el={`co-${block.id}`}') && component.includes(`id: '${id.slice(3)}',`);
		if (/^f[hcm]$/.test(id)) return component.includes('data-el={`f${file.key}`}');
		if (/^tb-[hcm]$/.test(id)) return component.includes('data-anchor={`tb-${tab.key}`}');
		return false;
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the editor shows the lesson multi-file example and the console its real commands', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /highlightCode\(sources\[key\], 'c'\)/, 'the files use C highlighting');
	for (const fragment of [
		"t('calculadora', 'calculator')",
		"t('sumar', 'add')",
		"t('suma_de_cuadrados', 'sum_of_squares')",
		"t('cuadrado', 'square')",
		'`#ifndef ${GUARD}`',
		'`#define ${GUARD}`',
		"'#endif'",
		'`#include "${N.calc}.h"`',
		'`static int ${N.sq}(int x) {`',
		"'#include <stdio.h>'",
		"const GCC = 'gcc -std=c23 -Wall -Wextra -Wpedantic';",
		'`$ ${GCC} -c ${N.calc}.c`',
		'`$ ${GCC} -c main.c`',
		'`$ gcc ${N.calc}.o main.o -o ${N.calc}`',
		"'5 + 3 = 8'",
		"'5^2 + 3^2 = 34'",
		'`$ gcc main.o -o ${N.calc}`',
		"'Undefined symbols for architecture arm64:'",
		"'ld: symbol(s) not found for architecture arm64'",
	]) {
		assert.ok(component.includes(fragment), `missing fragment: ${fragment}`);
	}
	// Every code line fits the editor (about 64 characters), in both languages.
	const longest = 4 + 'printf("%d^2 + %d^2 = %d\\n", a, b, suma_de_cuadrados(a, b));'.length;
	assert.ok(longest <= 66, `a code line is too long (${longest})`);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/funciones-modulos-c'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');
	assert.match(component, /font-family: var\(--font-body\)/);

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) {
		// Hash signs inside C source strings of the editor are not colors.
		if (/^\s*(`|')/.test(line) || /#(ifndef|define|include|endif)/.test(line)) continue;
		assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	}
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.equal((component.match(/data-slug='funciones-modulos-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
