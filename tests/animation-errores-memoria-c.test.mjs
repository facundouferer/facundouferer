import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/errores-memoria-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'errores-memoria-c';
const LESSON = 'propiedad-y-errores-de-memoria';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '29-propiedad-y-errores-de-memoria';
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
		['own', 'free', 'leak', 'double', 'uaf', 'asan'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['create', 'borrow', 'destroy', 'leak', 'double', 'uaf', 'asan', 'rule'],
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

// Who owns a block; how ownership is transferred; what a leak, a use after free and
// a double free are; how ASan reports them.
const QUESTIONS = {
	es: [
		'dueño',
		'una sola vez',
		'se transfiere',
		'el llamador es dueño del resultado',
		'toma prestado',
		'fuga de memoria',
		'cero dueños',
		'uso después de liberar',
		'colgante',
		'doble liberación',
		'ya liberado',
		'-fsanitize=address',
		'heap-use-after-free',
		'attempting double-free',
		'exactamente un dueño',
	],
	en: [
		'owner',
		'free the block exactly once',
		'transferred',
		'the caller owns the result',
		'borrows',
		'memory leak',
		'zero owners',
		'use after free',
		'dangling',
		'double free',
		'already freed',
		'-fsanitize=address',
		'heap-use-after-free',
		'attempting double-free',
		'exactly one owner',
	],
};

test('narration answers the questions of the brief in both languages', () => {
	for (const lang of ['es', 'en']) {
		const all = resolveScript(script, lang)
			.steps.map((step) => `${step.title} ${step.text}`)
			.join('\n')
			.toLowerCase();
		for (const concept of QUESTIONS[lang]) {
			assert.ok(all.includes(concept.toLowerCase()), `${lang} narration should mention ${concept}`);
		}
	}
	const es = resolveScript(script, 'es').steps.map((step) => step.text).join('\n');
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(es, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|liberá|usá)\b/i);
});

test('the three errors happen on the same block, which keeps one key for its owner', () => {
	const cuesOf = (id) => script.steps.find((step) => step.id === id).motion.cues;
	// Ownership: the key is born with the block and handed to the caller's variable.
	assert.ok(cuesOf('create').some((cue) => cue.do === 'move' && cue.el === 'key' && cue.to === 'a-key-own'));
	// The borrow draws a pointer but never moves the key.
	assert.ok(cuesOf('borrow').some((cue) => cue.do === 'draw' && cue.el === 'ptr-borrow'));
	assert.ok(!cuesOf('borrow').some((cue) => cue.do === 'move' && cue.el === 'key'));
	// Leak: the only pointer goes away and so does the key, while the block stays.
	const leak = cuesOf('leak');
	assert.ok(leak.some((cue) => cue.do === 'exit' && cue.el === 'ptr-b'));
	assert.ok(leak.some((cue) => cue.do === 'exit' && cue.el === 'key'));
	assert.ok(!leak.some((cue) => cue.do === 'exit' && cue.el === 'blk-b'));
	// Every error marks line 11 of the same block `blk-b`, never a new one.
	for (const id of ['leak', 'double', 'uaf']) {
		assert.ok(cuesOf(id).some((cue) => cue.do === 'enter' && cue.el === 'err-11'), `${id} marks the failing line`);
		assert.ok(!cuesOf(id).some((cue) => cue.do === 'enter' && cue.el === 'blk-b' && id !== 'leak'), `${id} reuses the block`);
	}
	// ASan points at the lines of the lesson's report: read at 11, freed at 10, allocated at 5.
	const asanBar = cuesOf('asan').filter((cue) => cue.do === 'move' && cue.el === 'hl').map((cue) => cue.to);
	assert.deepEqual(asanBar, ['ln-11', 'ln-10', 'ln-5']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids written literally, listed in the frontmatter (`id: 'x'`, `mod('x'`), or built from a prefix count as present.
	const modules = [...component.matchAll(/mod\('(m-[ab]\d+)'/g)].map((match) => match[1]);
	const derived = new Set(modules.flatMap((id) => [id, id.replace('m-', 'on-'), id.replace('m-', 'a-m')]));
	const known = (id) => {
		if (derived.has(id)) return true;
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

test('the code in the canvas is the lesson programs and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"t('Propiedad: el llamador es dueño del resultado.'",
		"t('Propiedad: solo toma prestada p.'",
		'`${n.person} *${n.create}(const char *${n.name}, int ${n.age});`',
		'`    ${n.person} *${n.ana} = ${n.create}("${t(\'Ana\', \'Ann\')}", 31);`',
		"t('crear_persona', 'create_person')",
		"t('imprimir_persona', 'print_person')",
		"t('destruir_persona', 'destroy_person')",
		"t('puntaje', 'score')",
		'`    int *${n.score} = malloc(sizeof *${n.score});`',
		'`    *${n.score} = 100;`',
		'`    printf("%d\\\\n", *${n.score});`',
		'`    free(${n.score});`',
		"'free(): double free detected in tcache 2'",
		"'==1572==ERROR: AddressSanitizer: heap-use-after-free'",
		"'READ of size 4 at 0x602000000950 thread T0'",
		"'    #0 0x0001021988dc in main programa.c:11'",
		"'    #1 0x00010219888c in main programa.c:10'",
		"'    #1 0x000102198804 in main programa.c:5'",
		"'SUMMARY: AddressSanitizer: heap-use-after-free programa.c:11 in main'",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// Program B keeps the lesson's line numbers: malloc on 5, free on 10, the read on 11.
	assert.match(component, /\{ id: 'b10-free', line: 10/);
	assert.match(component, /\{ id: 'b11-uaf', line: 11/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/errores-memoria-c'/);
	assert.match(component, /import { highlightCode } from '\.\.\/\.\.\/utils\/highlightCode'/);
	assert.match(component, /highlightCode\(programA, 'c'\)/);
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
