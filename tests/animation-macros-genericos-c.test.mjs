import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/macros-genericos-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'macros-genericos-c';
const LESSON = 'preprocesador-y-programacion-generica';
const FILE = '39-preprocesador-y-programacion-generica';
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

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['station', 'twice', 'paren', 'inline', 'generic', 'cond'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['station', 'twice', 'paren', 'dowhile', 'inline', 'generic', 'cond'],
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
	for (const kind of ['enter', 'exit', 'draw', 'type', 'move', 'pulse', 'camera']) assert.ok(kinds.has(kind), `uses the ${kind} cue`);
});

test('the particle, the editor bar and each token never start a move before the previous one ends', () => {
	for (const step of script.steps) {
		const movers = new Set(step.motion.cues.filter((cue) => cue.do === 'move').map((cue) => cue.el));
		for (const el of movers) {
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
		console.log(`${SLUG} ${lang}: ${(total / 1000).toFixed(1)} s`);
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
		// What does a macro do, and when?
		'corre antes del compilador',
		'cambia nombres por texto',
		'reemplaza la llamada en el lugar',
		'no entiende tipos',
		// Why does MAX(i++, j) misbehave?
		'se copia dos veces',
		'lo evalúa dos veces',
		'pasa de 5 a 6 y luego a 7',
		'`m = 6, i = 7`',
		// Why do parentheses matter?
		'sin paréntesis',
		'la multiplicación va primero',
		'da 5, no 9',
		'da 9',
		'una sola sentencia',
		// How does static inline avoid it?
		'`static inline`',
		'se evalúa una sola vez',
		'`m = 5, i = 6`',
		// How does _Generic pick by type?
		'según el tipo',
		'al compilar',
		'solo cuenta el tipo',
		// What is conditional compilation for?
		'qué texto llega al compilador',
		'se descarta antes de compilar',
		'se adapta al estándar o a la plataforma',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|vos)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'runs before the compiler',
		'swaps names for text',
		'replaces the call in place',
		'knows no types',
		'copied twice',
		'evaluates it twice',
		'goes from 5 to 6 and then to 7',
		'`m = 6, i = 7`',
		'without parentheses',
		'multiplication goes first',
		'gives 5, not 9',
		'it gives 9',
		'single statement',
		'`static inline`',
		'evaluated only once',
		'`m = 5, i = 6`',
		'by type',
		'at compile time',
		'only the type counts',
		'which text reaches the compiler',
		'dropped before compiling',
		'adapts to the standard or the platform',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

const read = async () => readFile(COMPONENT, 'utf8');

/** The `SHAPE` table of the component: the lines, modules and console rows of each program. */
const shapeOf = (component) => {
	const literal = component.match(/const SHAPE = (\{[\s\S]*?\n\});/)?.[1];
	assert.ok(literal, 'the component declares its SHAPE table');
	return new Function(`return ${literal}`)();
};

test('every scene and cue target exists in the component', async () => {
	const component = await read();
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);
	const shape = shapeOf(component);
	assert.deepEqual(Object.keys(shape), ['macro', 'paren', 'swap', 'inline', 'generic', 'cond']);

	// Ids built per program come from the SHAPE table; the rest are written out in the component.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		const perProgram = id.match(/^(m|on|a-m|ln|out|ed|co|w)-(macro|paren|swap|inline|generic|cond)(?:-(\d+))?$/);
		if (perProgram) {
			const [, family, program, number] = perProgram;
			const entry = shape[program];
			if (family === 'ed' || family === 'co' || family === 'w') return number === undefined;
			if (family === 'ln') return Number(number) >= 1 && Number(number) <= entry.lines;
			if (family === 'out') return Number(number) >= 1 && Number(number) <= entry.outputs;
			return entry.modules.includes(Number(number));
		}
		// Boxes, functions and resting tiles are anchors too (`a-<id>`).
		const anchor = id.match(/^a-([\w-]+)$/);
		return Boolean(anchor && component.includes(`id: '${anchor[1]}'`));
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('every instruction of the film has a module and the editor shows the line of each one', async () => {
	const component = await read();
	const shape = shapeOf(component);
	// The lines that light up in the film are lines that have a module.
	const ran = {};
	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			const match = cue.do === 'enter' ? cue.el.match(/^on-(\w+)-(\d+)$/) : null;
			if (match) (ran[match[1]] ??= new Set()).add(Number(match[2]));
		}
	}
	const sorted = (set) => [...set].sort((a, b) => a - b);
	assert.deepEqual(sorted(ran.macro), [3, 6, 7, 8, 9]);
	assert.deepEqual(sorted(ran.paren), [3, 6]);
	assert.deepEqual(sorted(ran.swap), [3, 13, 14, 17]);
	assert.deepEqual(sorted(ran.inline), [3, 8, 9, 10]);
	assert.deepEqual(sorted(ran.generic), [5, 12, 13, 14]);
	assert.deepEqual(sorted(ran.cond), [3, 10, 11]);
	for (const [program, lines] of Object.entries(ran)) {
		for (const line of lines) assert.ok(shape[program].modules.includes(line), `${program} line ${line} has a module`);
	}
	// Every console row of a program is typed by the line that prints it.
	for (const [program, entry] of Object.entries(shape)) {
		const typed = new Set(script.steps.flatMap((step) => step.motion.cues.filter((cue) => cue.do === 'type' && cue.el.startsWith(`out-${program}-`)).map((cue) => cue.el)));
		assert.equal(typed.size, entry.outputs, `${program} types every console row`);
	}
	assert.match(component, /text class="xj-face-text" transform=\{module\.g\.faceMatrix\}/, 'the module shows its line number');
});

const cuesOf = (id) => script.steps.find((step) => step.id === id).motion.cues;
const when = (cues, match) => cues.find((cue) => Object.entries(match).every(([key, value]) => cue[key] === value))?.at;

test('a macro is text: the call goes into the preprocessor and comes out as tiles the compiler reads', () => {
	const cues = cuesOf('station');
	const intoStation = when(cues, { do: 'move', el: 'tx-call', to: 'a-st' });
	assert.ok(intoStation !== undefined, 'the call travels to the preprocessor');
	// The tiles appear only after the call has been swapped, and in text order.
	const tiles = ['tx-1', 'tx-2', 'tx-3', 'tx-4'].map((el) => when(cues, { do: 'enter', el }));
	assert.ok(tiles.every((at) => at > intoStation), 'tiles come out after the swap');
	assert.deepEqual(tiles, [...tiles].sort((a, b) => a - b), 'tiles come out in text order');
	// The recipe is taught by line 3 before line 8 uses it.
	assert.ok(when(cues, { do: 'enter', el: 'on-macro-3' }) < when(cues, { do: 'enter', el: 'on-macro-8' }));
});

test('MAXIMO(i++, j) evaluates i++ twice: i goes 5, 6, 7 and m gets the second 6', () => {
	const cues = cuesOf('twice');
	// Two copies of i++ are flagged, then each one writes into the same box.
	assert.ok(when(cues, { do: 'pulse', el: 'tx-1' }) !== undefined && when(cues, { do: 'pulse', el: 'tx-3' }) !== undefined);
	const first = when(cues, { do: 'move', el: 'tk-i6', to: 'a-b-i' });
	const second = when(cues, { do: 'move', el: 'tk-i7', to: 'a-b-i' });
	assert.ok(first !== undefined && second > first, 'the second increment comes after the first');
	assert.ok(when(cues, { do: 'exit', el: 'tk-i5' }) > first, 'the 5 leaves when the 6 arrives');
	assert.ok(when(cues, { do: 'exit', el: 'tk-i6' }) > second, 'the 6 leaves when the 7 arrives');
	assert.ok(when(cues, { do: 'move', el: 'tk-m6', to: 'a-b-m' }) > second, 'm receives its value after both increments');
	assert.ok(when(cues, { do: 'enter', el: 'hx-macro-8' }) !== undefined, 'the trap line is marked');
	assert.ok(when(cues, { do: 'type', el: 'out-macro-1' }) > when(cues, { do: 'move', el: 'tk-m6' }), 'the output comes last');
});

test('without parentheses the product binds first; with them the fix gives 9', () => {
	const cues = cuesOf('paren');
	const tiles = ['tp-1', 'tp-2', 'tp-3'].map((el) => when(cues, { do: 'enter', el }));
	assert.ok(tiles.every((at) => at > when(cues, { do: 'move', el: 'tx-sq', to: 'a-st' })), 'the tiles come out of the preprocessor');
	assert.ok(when(cues, { do: 'enter', el: 'hx-paren-6' }) !== undefined, 'the wrong line is marked');
	assert.ok(when(cues, { do: 'pulse', el: 'tp-2' }) !== undefined, 'the product is pointed at');
	assert.ok(when(cues, { do: 'exit', el: 'tp-1' }) < when(cues, { do: 'enter', el: 'tq-1' }), 'the fix replaces the wrong tiles');
	assert.ok(when(cues, { do: 'enter', el: 'lb-sq-nine' }) > when(cues, { do: 'enter', el: 'tq-3' }));
});

test('do { } while (0) groups the statements: the bad `if` first, then the frame around all three', () => {
	const cues = cuesOf('dowhile');
	const bad = when(cues, { do: 'draw', el: 'fr-bad' });
	const good = when(cues, { do: 'draw', el: 'fr-do' });
	assert.ok(bad !== undefined && good > bad, 'the broken version is shown before the fix');
	assert.ok(when(cues, { do: 'exit', el: 'fr-bad' }) <= good, 'the bad frame leaves before the good one is drawn');
	assert.ok(when(cues, { do: 'enter', el: 'ts-3' }) < bad, 'the three statements exist before the frames');
});

test('static inline evaluates the argument once and bypasses the preprocessor', () => {
	const cues = cuesOf('inline');
	assert.equal(cues.filter((cue) => cue.do === 'move' && cue.el === 'ti-arg').length, 1, 'the argument is handed over once');
	assert.equal(cues.some((cue) => cue.do === 'enter' && (cue.el === 'on-st' || /^tx-/.test(cue.el))), false, 'no text is replaced');
	assert.equal(cues.filter((cue) => cue.do === 'move' && cue.el === 'ti-6').length, 1, 'i is incremented once');
	assert.ok(when(cues, { do: 'move', el: 'ti-m5', to: 'a-b-mi' }) !== undefined);
	assert.ok(when(cues, { do: 'type', el: 'out-inline-1' }) > when(cues, { do: 'move', el: 'ti-m5' }));
});

test('_Generic sends each argument to the function of its type, one after the other', () => {
	const cues = cuesOf('generic');
	const pairs = [
		['tk-a4', 'a-f-abs'],
		['tk-a7', 'a-f-labs'],
		['tk-a25', 'a-f-fabs'],
	];
	let previous = -1;
	for (const [token, fn] of pairs) {
		const toSwitch = when(cues, { do: 'move', el: token, to: 'a-sw' });
		const toFunction = when(cues, { do: 'move', el: token, to: fn });
		assert.ok(toSwitch > previous, `${token} reaches the switch after the previous argument`);
		assert.ok(toFunction > toSwitch, `${token} goes to ${fn} after the switch decided`);
		previous = toFunction;
	}
	for (const [type, route] of [
		['ty-int', 'fl-gen-int'],
		['ty-long', 'fl-gen-long'],
		['ty-double', 'fl-gen-double'],
	]) {
		assert.ok(when(cues, { do: 'enter', el: type }) !== undefined && when(cues, { do: 'draw', el: route }) !== undefined, `${type} names the type that picks ${route}`);
	}
});

test('conditional compilation keeps one branch: the other is dropped and never reaches the compiler', () => {
	const cues = cuesOf('cond');
	assert.ok(when(cues, { do: 'move', el: 'tc-ver', to: 'a-st' }) !== undefined, 'the condition is evaluated by the preprocessor');
	assert.ok(when(cues, { do: 'move', el: 'tc-a', to: 'a-cc' }) !== undefined, 'the kept branch reaches the compiler');
	assert.equal(cues.some((cue) => cue.do === 'move' && cue.el === 'tc-b'), false, 'the dropped branch never moves');
	assert.ok(when(cues, { do: 'exit', el: 'tc-b' }) !== undefined, 'the dropped branch leaves');
	assert.ok(when(cues, { do: 'move', el: 'tc-use', to: 'a-st' }) < when(cues, { do: 'move', el: 'tc-a', to: 'a-cc' }), 'the name is replaced before the branch is compiled');
	const pullBack = cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(pullBack.to, ['shot-all'], 'the film ends pulled back on the whole pipeline');
});

test('the code in the canvas is the lesson programs and their real output', async () => {
	const component = await read();
	for (const fragment of [
		"'#include <stdio.h>'",
		'`#define ${n.max}(a, b) ((a) > (b) ? (a) : (b))`',
		'`    int m = ${n.max}(i++, j);`',
		String.raw`'    printf("m = %d, i = %d\\n", m, i);'`,
		'`#define ${n.sqBad}(x) x * x`',
		'`    printf("%d\\\\n", ${n.sqBad}(2 + 1));`',
		'cont(`#define ${n.swap}(a, b)`)',
		"cont('        int tmp_ = (a);')",
		"'    } while (0)'",
		"'    if (x > y)'",
		'`        ${n.swap}(x, y);`',
		'`static inline int ${n.maxFn}(int a, int b) {`',
		'`    int m = ${n.maxFn}(i++, 3);`',
		'cont(`#define ${n.abs}(x) _Generic((x),`, 42)',
		"cont('    int: abs,', 42)",
		"cont('    long: labs,', 42)",
		"cont('    double: fabs', 42)",
		"')(x)'",
		'`    printf("%ld\\\\n", ${n.abs}(-7L));`',
		"'#if __STDC_VERSION__ >= 202311L'",
		'`    #define ${n.nullp} nullptr`',
		'`    #define ${n.nullp} NULL`',
		// Identifiers localized like the lesson does.
		"max: t('MAXIMO', 'MAX')",
		"sqBad: t('CUADRADO_MAL', 'SQUARE_BAD')",
		"swap: t('INTERCAMBIAR_INT', 'SWAP_INT')",
		"maxFn: t('maximo', 'max_int')",
		"abs: t('VALOR_ABSOLUTO', 'ABSOLUTE')",
		"nullp: t('PUNTERO_NULO', 'NULL_POINTER')",
		// The real output of each program (compiled and run with cc -std=c23).
		"macro: ['m = 6, i = 7']",
		"paren: ['5']",
		"swap: ['3 8']",
		"inline: ['m = 5, i = 6']",
		"generic: ['4', '7', '2.5']",
		'cond: [`${n.isNull}: 1`]',
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await read();
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/macros-genericos-c'/);
	assert.match(component, /highlightCode\(sources\[program\]\.join\('\\n'\), 'c'\)/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
