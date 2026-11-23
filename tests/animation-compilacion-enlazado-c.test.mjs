import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/compilacion-enlazado-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'compilacion-enlazado-c';
const LESSON = 'compilacion-y-enlazado';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '03-compilacion-y-enlazado';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);

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
		['source', 'preprocess', 'translate', 'link', 'errors', 'warnings'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['intro', 'preprocess', 'compile', 'assemble', 'link', 'run', 'error', 'warnings'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'build', `${step.id} plays on the single canvas`);
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

// The six questions: what the preprocessor does, what an object file is, what the
// linker adds, where printf comes from, at which stage each error appears, and why
// the course compiles with warnings on.
const questions = {
	es: [
		'preprocesador',
		'#include',
		'stdio.h',
		'macro',
		'compilador',
		'ensamblador',
		'archivo objeto',
		'código máquina',
		'todavía no se puede ejecutar',
		'enlazador',
		'bibliotecas',
		'biblioteca estándar',
		'printf',
		'ejecutable',
		'línea y columna',
		'el compilador detiene',
		'al enlazar',
		'undefined reference',
		'-Wall -Wextra -Wpedantic',
		'advertencia',
		'compila y falla después',
	],
	en: [
		'preprocessor',
		'#include',
		'stdio.h',
		'macro',
		'compiler',
		'assembler',
		'object file',
		'machine code',
		'cannot run yet',
		'linker',
		'libraries',
		'standard library',
		'printf',
		'executable',
		'line and column',
		'the compiler stops',
		'when linking',
		'undefined reference',
		'-Wall -Wextra -Wpedantic',
		'warning',
		'builds and fails later',
	],
};

test('narration answers the six questions of the brief in both languages', () => {
	for (const lang of ['es', 'en']) {
		const all = resolveScript(script, lang)
			.steps.map((step) => `${step.title} ${step.text}`)
			.join('\n')
			.toLowerCase();
		for (const concept of questions[lang]) assert.ok(all.includes(concept.toLowerCase()), `${lang} narration should mention ${concept}`);
	}
	const es = resolveScript(script, 'es').steps.map((step) => step.text).join('\n');
	// The brief asks for neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(es, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|compilá|corregí)\b/i);
});

test('the file visits the stations in build order and the typo stops at the compiler', () => {
	const build = cuesOf('intro', 'preprocess', 'compile', 'assemble', 'link', 'run');
	assert.deepEqual(stopsOf(build, 'doc'), ['a-pre', 'a-cc', 'a-as', 'a-ld', 'a-run']);
	// One object, one state per stage: source, preprocessed text, assembly, object, executable.
	const states = build.filter((cue) => cue.do === 'enter' && cue.el.startsWith('d-')).map((cue) => cue.el);
	assert.deepEqual(states, ['d-pre', 'd-asm', 'd-obj', 'd-exe']);
	// printf travels from the standard library into the object at the linker.
	assert.deepEqual(stopsOf(build, 'pc'), ['a-sock']);

	const error = cuesOf('error');
	assert.deepEqual(stopsOf(error, 'doc'), ['a-start', 'a-pre', 'a-cc']);
	assert.ok(error.some((cue) => cue.do === 'enter' && cue.el === 'cc-x'), 'the compiler station turns magenta');
	assert.ok(!error.some((cue) => cue.el === 'as-on' || cue.el === 'ld-on'), 'nothing past the compiler runs');
	assert.ok(error.some((cue) => cue.do === 'enter' && cue.el === 'hx-b4'), 'the failing line is marked');
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="build" data-motion/);

	// Ids built in a loop (`ea-${n}`) or listed in the frontmatter (`id: 'a-pre'`) count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`lit: '${id}'`)) return true;
		if (component.includes(`flagChip('${id}'`)) return true;
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

test('the code and terminal in the canvas are the lesson programs and commands', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'#include <stdio.h>'",
		'`#define ${names.macro} "${names.greeting}"`',
		"'int main(void) {'",
		'`    printf(${names.macro} "\\\\n");`',
		"'    return 0;'",
		'`    prinft("${names.hello}\\\\n");`',
		"macro: t('SALUDO', 'GREETING')",
		"greeting: t('Hola, C', 'Hello, C')",
		"file: t('programa.c', 'program.c')",
		'`$ gcc -E ${names.file}`',
		'`$ gcc -S ${names.file}`',
		'`$ gcc -std=c23 -c ${names.file}`',
		'`$ gcc ${names.obj} -o ${names.exe}`',
		'`$ ./${names.exe}`',
		'`$ gcc -std=c23 -Wall -Wextra -Wpedantic -g ${names.file} -o ${names.exe}`',
		'`${names.file}:4:5: error: implicit declaration of function`',
		"highlightCode(source, 'c')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/compilacion-enlazado-c'/);
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
