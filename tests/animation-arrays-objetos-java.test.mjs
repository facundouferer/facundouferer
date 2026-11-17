import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/arrays-objetos-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'arrays-objetos-java';
const LESSON = '09-arrays-de-objetos';
const FILE = '09-arrays-de-objetos';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);

test(`catalog binds ${SLUG} to java/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: LESSON });
	assert.deepEqual(
		getAnimationsForLesson('java', LESSON).map((entry) => entry.slug),
		[SLUG],
	);
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/java/${FILE}.es.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['slots', 'trap', 'populate', 'traverse', 'alias', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['class', 'slots', 'trap', 'first', 'second', 'traverse', 'alias', 'recap'],
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
		assert.ok(total >= 90_000 && total <= 120_000, `${lang} runs for ${Math.round(total / 1000)} s (${total} ms)`);
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

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = resolveScript(script, 'es')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n');
	for (const concept of [
		// 1. What does new Persona[3] create?
		'flujo de ejecución',
		'referencias a objetos',
		'new Persona[3]',
		'no construye ninguna',
		// 2. Why does calling a method on an empty slot fail?
		'equipo[0].getNombre()',
		'no apunta a ningún objeto',
		'NullPointerException',
		// 3. How does a slot get a real object?
		'new Persona("Laura", 28)',
		'Heap',
		'guarda la referencia',
		// 4. How do we traverse a partially filled array safely?
		'for (Persona p : equipo)',
		'p != null',
		// 5. What does copying one slot into another copy?
		'equipo[2] = equipo[0]',
		'copia la flecha',
		'mismo objeto',
		// 6. What is the two-step rule to remember?
		'dos pasos',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|verificá|recorré)\b/i);
});

test('the trap fails on null slot [0] in magenta, then the slots get Heap objects in violet', () => {
	const trapCues = cuesOf('trap');
	assert.deepEqual(stopsOf(trapCues, 'p'), ['a-p0', 'a-s0']);
	assert.ok(trapCues.some((cue) => cue.do === 'type' && cue.el === 'eb-x4'), 'the failing line is written at line 4');
	for (const id of ['npe-on', 's0-err', 'chip-npe', 'hx-4']) {
		assert.ok(trapCues.some((cue) => cue.do === 'enter' && cue.el === id), `trap shows ${id}`);
	}
	assert.ok(trapCues.some((cue) => cue.do === 'type' && cue.el === 'out-npe'), 'the console prints the exception');

	const popCues = cuesOf('first', 'second');
	const cleared = popCues.filter((cue) => cue.do === 'exit').map((cue) => cue.el);
	for (const id of ['s0-err', 'chip-npe', 'rt-err', 'hx-4', 'npe-on', 'eb-x4', 'out-npe', 'null-0', 'null-1']) {
		assert.ok(cleared.includes(id), `population clears ${id}`);
	}
	assert.ok(!cleared.includes('null-2'), 'slot [2] stays null while populating');
	assert.deepEqual(stopsOf(popCues, 'p'), ['a-p0', 'a-o0', 'a-p1', 'a-o1']);
	const drawn = popCues.filter((cue) => cue.do === 'draw').map((cue) => cue.el);
	for (const id of ['rt-new0', 'ref-0', 'rt-new1', 'ref-1']) assert.ok(drawn.includes(id), `population draws ${id}`);
	assert.deepEqual(
		popCues.filter((cue) => cue.do === 'type').map((cue) => cue.el),
		['eb-4', 'eb-5'],
	);
});

test('traversal visits every slot in order and skips null slot [2]; copying [0] into [2] shares obj-0', () => {
	const trav = cuesOf('traverse');
	assert.deepEqual(stopsOf(trav, 'p'), ['a-loop', 'a-s0', 'a-o0', 'a-s1', 'a-o1', 'a-s2']);
	assert.deepEqual(
		trav.filter((cue) => cue.do === 'type' && cue.el.startsWith('out-')).map((cue) => cue.el),
		['out-1', 'out-2'],
	);
	const alias = cuesOf('alias');
	assert.deepEqual(stopsOf(alias, 'p'), ['a-alias', 'a-s0', 'a-s2']);
	assert.ok(alias.some((cue) => cue.do === 'exit' && cue.el === 'null-2'), 'slot [2] stops being null');
	assert.ok(alias.some((cue) => cue.do === 'draw' && cue.el === 'ref-2'), 'slot [2] gets an arrow');
	assert.ok(!alias.some((cue) => cue.do === 'enter' && cue.el.startsWith('obj-')), 'no new object is created');
	assert.deepEqual(
		alias.filter((cue) => cue.do === 'type' && cue.el.startsWith('out-')).map((cue) => cue.el),
		['out-3'],
	);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		if (component.includes(`sideChip('${id}'`)) return true;
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

test('the code in the canvas is the program the narration describes', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		'`public class ${names.person} {`',
		'`    public String ${names.getName}() { return ${names.name}; }`',
		'`        ${names.person}[] ${names.team} = new ${names.person}[3];`',
		'`        System.out.println(${names.team}[0].${names.getName}());`',
		'`        ${names.team}[0] = new ${names.person}("Laura", 28);`',
		'`        ${names.team}[1] = new ${names.person}("Carlos", 35);`',
		'`        for (${names.person} p : ${names.team}) {`',
		'`            if (p != null) {`',
		'`                System.out.println(p.${names.getName}());`',
		'`        ${names.team}[2] = ${names.team}[0];`',
		'`        System.out.println(${names.team}[0] == ${names.team}[2]);`',
		"t('Persona', 'Person')",
		"t('equipo', 'team')",
		"t('nombre', 'name')",
		"t('getNombre', 'getName')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	const lines = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.ok(lines('sourceA').length <= 20, 'the class page fits the editor');
	assert.ok(lines('sourceB').length <= 20, 'the main page fits the editor');
	// Every line the highlight bar visits holds the instruction the narration names.
	const lineOf = (n) => lines('sourceB')[n - 1];
	assert.match(lineOf(3), /new \$\{names\.person\}\[3\]/);
	assert.match(lineOf(4), /\[0\] = new/);
	assert.match(lineOf(5), /\[1\] = new/);
	assert.match(lineOf(7), /for \(/);
	assert.match(lineOf(8), /p != null/);
	assert.match(lineOf(9), /println\(p\./);
	assert.match(lineOf(12), /\[2\] = \$\{names\.team\}\[0\]/);
	assert.match(lineOf(13), /==/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/arrays-objetos-java'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.equal((component.match(/data-slug='arrays-objetos-java'/g) ?? []).length, 4);
});
