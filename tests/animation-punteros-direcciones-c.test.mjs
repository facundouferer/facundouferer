import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/punteros-direcciones-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'punteros-direcciones-c';
const LESSON = 'punteros-y-direcciones';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '25-punteros-y-direcciones';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.deepEqual(animation.tag, { es: 'C', en: 'C' });
	assert.ok(getAnimationsForLesson('c', LESSON).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	for (const lang of ['es', 'en']) assert.ok(existsSync(`src/content/courses/c/${FILE}.${lang}.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['memory', 'address', 'pointer', 'deref', 'swap', 'null'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['cells', 'address', 'pointer', 'read', 'write', 'call', 'swap', 'null'],
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

test('narration answers the six questions of the brief in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// What is an address.
		'celdas numeradas',
		'su dirección',
		'primer byte',
		// What & does.
		'el operador `&` da la dirección',
		// What a pointer stores.
		'un puntero guarda la dirección',
		'apunta a',
		// What * does when reading and writing.
		'desreferenciar',
		'al leer',
		'escribe a través',
		// How intercambiar changes the caller's variables.
		'intercambiar(&x, &y)',
		'se copian',
		'pasaje por valor',
		'variables de quien llama',
		// What NULL means.
		'null',
		'no apunta a nada',
		'nunca se desreferencia',
		'comportamiento indefinido',
		// Addresses in the film are illustrative.
		'direcciones reales',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// The brief asks for neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés)\b/i);
	// C has no pass by reference: the narration never presents it as a mechanism.
	assert.doesNotMatch(all, /por referencia/);
});

test('narration answers the same questions in English', () => {
	const all = narration('en');
	for (const concept of [
		'numbered cells',
		'its address',
		'first byte',
		'the `&` operator gives the address',
		'a pointer stores the address',
		'points to',
		'dereferencing',
		'when reading',
		'writes through',
		'swap(&x, &y)',
		'copied',
		'pass by value',
		"caller's variables",
		'null',
		'points to nothing',
		'never dereferenced',
		'undefined behavior',
		'real addresses',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /by reference/);
});

test('writing through *p changes x and leaves p untouched; NULL replaces the arrow', () => {
	const cuesOf = (id) => script.steps.find((step) => step.id === id).motion.cues;
	const write = cuesOf('write');
	assert.ok(write.some((cue) => cue.do === 'exit' && cue.el === 'v-x-10'));
	assert.ok(write.some((cue) => cue.do === 'enter' && cue.el === 'v-x-20'));
	// The value of p (the address 0x1000) only changes when NULL is assigned.
	const before = script.steps.filter((step) => step.id !== 'null').flatMap((step) => step.motion.cues);
	assert.ok(!before.some((cue) => cue.do === 'exit' && (cue.el === 'v-p-1000' || cue.el === 'ar-p')));
	const nul = cuesOf('null');
	for (const el of ['v-p-1000', 'ar-p']) assert.ok(nul.some((cue) => cue.do === 'exit' && cue.el === el), `NULL removes ${el}`);
	for (const el of ['v-p-null', 'ar-null', 'bad']) assert.ok(nul.some((cue) => ['enter', 'draw'].includes(cue.do) && cue.el === el), `NULL shows ${el}`);
	// swap: the values travel x -> aux, y -> x, aux -> y.
	const moves = cuesOf('swap')
		.filter((cue) => cue.do === 'move' && /^k\d$/.test(cue.el))
		.map((cue) => `${cue.el}:${cue.to}`);
	assert.deepEqual(moves, ['k1:a-top-aux', 'k2:a-top-x', 'k3:a-top-y']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built from lists count as present: shots (`shotAt('shot-mem'`), cells
	// (`cell('x',` gives c-x, n-x and a-top-x), modules (`[10, 'flow']` gives m-10,
	// on-10 and a-m10), editor lines (ln-1 to ln-20) and output rows (o-1 to o-3).
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`shotAt('${id}'`)) return true;
		const cellId = id.match(/^(?:c|n|a-top)-(.+)$/);
		if (cellId && component.includes(`cell('${cellId[1]}',`)) return true;
		const line = id.match(/^(?:m-|on-|a-m)(\d+)$/);
		if (line) return component.includes(`[${line[1]}, '`);
		if (/^o-[1-3]$/.test(id)) return component.includes('data-el={`o-${index + 1}`}');
		const editorLine = id.match(/^ln-(\d+)$/);
		return Boolean(editorLine) && Number(editorLine[1]) >= 1 && Number(editorLine[1]) <= 20;
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the code in the canvas is the lesson program, and its output is the real one', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'#include <stdio.h>'",
		'`void ${names.swap}(int *a, int *b) {`',
		'`    int ${names.tmp} = *a;`',
		"'    *a = *b;'",
		'`    *b = ${names.tmp};`',
		"'    int x = 10;'",
		`'    printf("&x = %p\\\\n", (void *)&x);'`,
		"'    int *p = &x;'",
		`'    printf("x = %d, *p = %d\\\\n", x, *p);'`,
		"'    *p = 20;'",
		"'    int y = 3;'",
		'`    ${names.swap}(&x, &y);`',
		'`    p = NULL;',
		"t('intercambiar', 'swap')",
		"t('aux', 'tmp')",
		"'&x = 0x1000', 'x = 10, *p = 10', 'x = 3, y = 20'",
		"highlightCode(program, 'c')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/punteros-direcciones-c'/);
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
