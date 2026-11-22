import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/programa-estructura-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'programa-estructura-c';
const LESSON = 'introduccion-y-estructura';
const FILE = '01-introduccion-y-estructura';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
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
		['include', 'main', 'printf', 'order', 'return', 'run'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['include', 'comment', 'main', 'print', 'order', 'return', 'build', 'status'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'journey', `${step.id} plays on the single canvas`);
		assert.ok(step.motion, `${step.id} is a motion step`);
		assert.ok(step.subtitles.every((sub) => typeof sub.at === 'number'), `${step.id} pins captions`);
		assert.ok(step.motion.cues.length >= 8, `${step.id} choreographs the canvas`);
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
		console.log(`# ${lang}: ${(total / 1000).toFixed(1)} s`);
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

test('narration answers the six questions of the lesson in both languages', () => {
	const narration = (lang) =>
		resolveScript(script, lang)
			.steps.map((step) => `${step.title} ${step.text}`)
			.join('\n')
			.toLowerCase();
	const es = narration('es');
	const en = narration('en');
	const questions = {
		'what #include does': [
			['#include <stdio.h>', 'declaraciones', 'cabecera', 'preprocesador'],
			['#include <stdio.h>', 'declarations', 'header', 'preprocessor'],
		],
		'what main is and why it returns int': [
			['punto de entrada', 'devuelve un entero', 'int main(void)'],
			['entry point', 'returns an integer', 'int main(void)'],
		],
		'in what order statements run': [
			['una tras otra', 'de arriba hacia abajo'],
			['one after another', 'from top to bottom'],
		],
		'what printf does': [
			['printf', 'escribe en pantalla', 'salto de línea'],
			['printf', 'writes on the screen', 'line break'],
		],
		'what return 0 means': [
			['return 0;', 'sistema operativo', 'todo salió bien', 'estado de salida', 'echo $?'],
			['return 0;', 'operating system', 'everything went fine', 'exit status', 'echo $?'],
		],
		'what comments are for': [
			['comentario', 'el compilador lo ignora', 'explicar la intención'],
			['comment', 'the compiler ignores it', 'explain the intent'],
		],
		'the compile-and-run command': [
			['-std=c23', '-wall -wextra -wpedantic', './hola'],
			['-std=c23', '-wall -wextra -wpedantic', './hello'],
		],
	};
	for (const [question, [esTerms, enTerms]] of Object.entries(questions)) {
		for (const term of esTerms) assert.ok(es.includes(term), `es: "${question}" should mention ${term}`);
		for (const term of enTerms) assert.ok(en.includes(term), `en: "${question}" should mention ${term}`);
	}
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(es, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|compilá|ejecutá)\b/i);
});

test('the bar only moves forward through the program, from the first line to the closing brace', () => {
	const stops = script.steps.flatMap((step) => step.motion.cues).filter((cue) => cue.do === 'move' && cue.el === 'hl').map((cue) => Number(cue.to.replace('ln-', '')));
	assert.deepEqual(stops, [1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13]);
});

test('comments are dimmed as the bar passes and the statements run in order', () => {
	const cues = script.steps.flatMap((step) => step.motion.cues);
	const dimmed = cues.filter((cue) => cue.do === 'enter' && String(cue.el).startsWith('dim-')).map((cue) => cue.el);
	assert.deepEqual(dimmed, ['dim-3', 'dim-7', 'dim-11']);
	const modules = cues.filter((cue) => cue.do === 'enter' && /^m-\d+$/.test(cue.el)).map((cue) => cue.el);
	assert.deepEqual(modules, ['m-1', 'm-6', 'm-8', 'm-9', 'm-12']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`ea-${n}`) or listed in the frontmatter (`id: 'a-t1'`) count as present.
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
});

test('the code in the canvas is the lesson program and the terminal the course command', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'#include <stdio.h>'",
		"'int main(void) {'",
		'    printf("${text.first}\\\\n");',
		'    printf("${text.second}\\\\n");',
		"'    return 0;'",
		"t('Hola, mundo', 'Hello, world')",
		"t('Bienvenida al curso de C', 'Welcome to the C course')",
		'$ gcc -std=c23 -Wall -Wextra -Wpedantic ${names.src} -o ${names.bin}',
		"'$ echo $?'",
		"t('hola.c', 'hello.c')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// The lesson prints exactly these two lines.
	for (const lesson of [`${FILE}.es.md`, `${FILE}.en.md`]) {
		const body = await readFile(`src/content/courses/c/${lesson}`, 'utf8');
		assert.ok(body.includes('printf("Hola, mundo\\n");') || body.includes('printf("Hello, world\\n");'));
		assert.ok(body.includes('gcc -std=c23 -Wall -Wextra -Wpedantic'));
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/programa-estructura-c'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the editor uses the shared C highlighter');
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
