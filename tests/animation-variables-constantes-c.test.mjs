import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/variables-constantes-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'variables-constantes-c';
const LESSON = 'variables-y-constantes';
const FILE = '04-variables-y-constantes';
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
		['declare', 'unset', 'literal', 'const', 'define', 'prefer'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['declare', 'assign', 'unset', 'literals', 'const', 'define', 'trap', 'prefer'],
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
		// What does a declaration reserve?
		'declarar reserva una caja con tipo y nombre',
		// What does initialization change, and what does assignment do?
		'inicializar pone el primer valor',
		'asignar reemplaza el valor',
		'es la misma caja con otro contenido',
		// Why is an uninitialized variable a bug?
		'nadie puso un valor',
		'su valor es indeterminado',
		'error de programa, aunque compile',
		// What does a literal's suffix do?
		'todo literal tiene un tipo',
		'el sufijo `u` cambia el tipo',
		'`100u` es `unsigned int`',
		'`9.81f` es `float`',
		// How does const differ from #define?
		'caja con candado',
		'no compila',
		'texto del preprocesador',
		'antes de compilar',
		'sin variable y sin tipo',
		'solo texto',
		'la multiplicación va primero',
		'con paréntesis',
		// Why is const preferred?
		'el depurador lo ve',
		'texto sin tipo',
		'se prefiere `const`',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|vos)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'declaring reserves a box with a type and a name',
		'initializing puts the first value',
		'assigning replaces the value',
		'same box, new content',
		'nobody put a value',
		'its value is indeterminate',
		'program bug even if it compiles',
		'every literal has a type',
		'the `u` suffix changes the type',
		'`100u` is `unsigned int`',
		'`9.81f` is `float`',
		'box with a lock',
		'does not compile',
		'preprocessor text',
		'before compiling',
		'no variable and no type',
		'just text',
		'multiplication goes first',
		'with parentheses',
		'the debugger sees it',
		'untyped text',
		'prefer `const`',
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
	assert.deepEqual(Object.keys(shape), ['main', 'bug', 'lit', 'const', 'macro']);

	// Ids built per program come from the SHAPE table; the rest are written out in the component.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`id: '${id}',`)) return true;
		const perProgram = id.match(/^(m|on|a-m|ln|out|ed|co|w)-(main|bug|lit|const|macro)(?:-(\d+))?$/);
		if (perProgram) {
			const [, family, program, number] = perProgram;
			const entry = shape[program];
			if (family === 'ed' || family === 'co' || family === 'w') return number === undefined;
			if (family === 'ln') return Number(number) >= 1 && Number(number) <= entry.lines;
			if (family === 'out') return Number(number) >= 1 && Number(number) <= entry.outputs;
			return entry.modules.includes(Number(number));
		}
		// Boxes are anchors too (`a-b-<key>` for the `b-<key>` box).
		const box = id.match(/^a-b-(\w+)$/);
		return Boolean(box && component.includes(`id: 'b-${box[1]}'`));
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
	// The lines that light up in the film are lines that have a module. The `printf` of the
	// uninitialized program is shown but never run: its output would be indeterminate.
	const ran = {};
	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			const match = cue.do === 'enter' ? cue.el.match(/^on-(\w+)-(\d+)$/) : null;
			if (match) (ran[match[1]] ??= new Set()).add(Number(match[2]));
		}
	}
	const sorted = (set) => [...set].sort((a, b) => a - b);
	assert.deepEqual(sorted(ran.main), [3, 6, 7, 8, 9, 11, 13, 14, 15, 16]);
	assert.deepEqual(sorted(ran.bug), [4, 5]);
	assert.deepEqual(sorted(ran.lit), [4, 5, 6, 7, 8, 9]);
	assert.deepEqual(sorted(ran.const), [2, 3]);
	assert.deepEqual(sorted(ran.macro), [3, 6, 7]);
	for (const [program, lines] of Object.entries(ran)) {
		for (const line of lines) assert.ok(shape[program].modules.includes(line), `${program} line ${line} has a module`);
	}
	assert.deepEqual(shape.bug.modules, [4, 5, 6]);
	// Every console row of a program is typed by the line that prints it.
	for (const [program, entry] of Object.entries(shape)) {
		const typed = new Set(script.steps.flatMap((step) => step.motion.cues.filter((cue) => cue.do === 'type' && cue.el.startsWith(`out-${program}-`)).map((cue) => cue.el)));
		assert.equal(typed.size, entry.outputs, `${program} types every console row`);
	}
	assert.match(component, /text class="xj-face-text" transform=\{module\.g\.faceMatrix\}/, 'the module shows its line number');
});

test('a declaration reserves the box before the value arrives, and assignment replaces the value', () => {
	const cues = Object.fromEntries(script.steps.map((step) => [step.id, step.motion.cues]));
	const when = (id, match) => cues[id].find((cue) => Object.entries(match).every(([key, value]) => cue[key] === value))?.at;
	// `int edad` first appears empty, and only later the 18 goes into it.
	assert.ok(when('declare', { do: 'enter', el: 'b-edad' }) < when('declare', { do: 'enter', el: 'tk-e18' }));
	assert.equal(when('declare', { do: 'move', el: 'tk-e18', to: 'a-b-edad' }) > when('declare', { do: 'enter', el: 'tk-e18' }), true);
	// The 19 lands in the same box, and the 18 leaves it.
	assert.ok(when('assign', { do: 'move', el: 'tk-e19', to: 'a-b-edad' }) !== undefined);
	assert.ok(when('assign', { do: 'exit', el: 'tk-e18' }) !== undefined);
	assert.equal(cues.assign.some((cue) => cue.do === 'enter' && cue.el === 'b-edad'), false, 'assignment does not create a new box');
	// The uninitialized box shows a "?", filled by whatever the memory held, before the fix.
	assert.ok(when('unset', { do: 'enter', el: 'tk-q' }) < when('unset', { do: 'enter', el: 'tk-zero' }));
	for (const id of ['lo-1', 'lo-2', 'lo-3']) assert.ok(when('unset', { do: 'move', el: id, to: 'a-b-total' }) !== undefined);
	// The assignment to the constant is refused: the value never reaches the box.
	assert.equal(cues.const.some((cue) => cue.do === 'move' && cue.el === 'tk-try' && cue.to === 'a-b-days'), false);
	assert.ok(when('const', { do: 'move', el: 'tk-try', to: 'a-try' }) !== undefined);
	// #define creates no box: its world never builds one, and the text is swapped at the station.
	assert.ok(cues.define.some((cue) => cue.do === 'move' && cue.el === 'tx-src' && cue.to === 'a-st'));
	assert.ok(cues.define.some((cue) => cue.do === 'move' && cue.el === 'tx-out' && cue.to === 'a-m-main-16'));
	assert.equal(cues.define.some((cue) => cue.do === 'enter' && /^b-/.test(cue.el)), false, 'no box for the macro');
});

test('the code in the canvas is the lesson programs and their real output', async () => {
	const component = await read();
	for (const fragment of [
		"'#include <stdio.h>'",
		'`#define ${n.months} 12`',
		"'int main(void) {'",
		'`    const double ${n.iva} = 0.21;`',
		'`    int ${n.age} = 18;`',
		'`    double ${n.price} = 1500.0;`',
		"`    char ${n.initial} = 'F';`",
		'`    ${n.age} = ${n.age} + 1;   // ${t(',
		"`    printf(\"${t('Edad', 'Age')}: %d\\\\n\", ${n.age});`",
		"`    printf(\"${t('Meses del año', 'Months per year')}: %d\\\\n\", ${n.months});`",
		"commented('    int total;'",
		"commented('    total = total + 10;'",
		"'    printf(\"%d\\\\n\", total);'",
		'    unsigned int ${n.count} = 100u;',
		'    float ${n.gravity} = 9.81f;',
		'`    const int ${n.days} = 7;`',
		'`    ${n.days} = 8;`',
		"'#define BASE 4 + 1'",
		'`    int ${n.result} = BASE * 2;`',
		"iva: t('IVA', 'TAX_RATE')",
		"age: t('edad', 'age')",
		"months: t('MESES_ANIO', 'MONTHS_PER_YEAR')",
		"days: t('DIAS_SEMANA', 'DAYS_PER_WEEK')",
		// The real output of each program.
		"`${t('Precio con IVA', 'Price with tax')}: 1815.000000`",
		"`${t('Meses del año', 'Months per year')}: 12`",
		"['255 100', '3.14159 9.81']",
		"macro: ['6']",
		"warning: variable 'total' is",
		'uninitialized when used here [-Wuninitialized]',
		'error: cannot assign to variable',
		"with const-qualified type 'const int'",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await read();
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/variables-constantes-c'/);
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
