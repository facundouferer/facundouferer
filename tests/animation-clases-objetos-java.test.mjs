import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/clases-objetos-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'clases-objetos-java';
const LESSON = '07-fundamentos-poo-clases-y-objetos';
const FILE = '07-fundamentos-poo-clases-y-objetos';
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
		['blueprint', 'new', 'state', 'behavior', 'alias', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['blueprint', 'alloc', 'assign', 'setup', 'second', 'call', 'alias', 'recap'],
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

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = resolveScript(script, 'es')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n');
	for (const concept of [
		// 1. What is a class before new runs?
		'molde',
		'atributos',
		'no ocupa memoria',
		// 2. What does new do in Heap and Stack?
		'flujo de ejecución',
		'heap',
		'valores por defecto',
		'null',
		'referencia',
		'stack',
		// 3. How does each instance hold independent state?
		'operador punto',
		'segundo objeto independiente',
		'su propio estado',
		// 4. How does an instance method read its receiver's state?
		'saludar()',
		'los atributos de ese objeto',
		// 5. What happens when we assign one reference variable to another?
		'copia la referencia',
		'mismo objeto',
		// 6. What is the key rule to remember?
		'new',
		'instancia',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé)\b/i);
});

test('new allocates independent objects in Heap while reference assignment aliases the same object', () => {
	// Allocation of p1 in Heap and storing reference in Stack.
	const firstObj = cuesOf('alloc', 'assign');
	assert.deepEqual(stopsOf(firstObj, 'p'), ['a-new1', 'a-obj1', 'a-var1']);
	// Second object created independently in Heap with its own reference in Stack.
	const secondObj = cuesOf('second');
	assert.deepEqual(stopsOf(secondObj, 'p'), ['a-new2', 'a-obj2', 'a-var2', 'a-set2']);
	// Calling greet() on p1 and p2 visits the method on Persona and prints output.
	const calls = cuesOf('call');
	assert.deepEqual(stopsOf(calls, 'p'), ['a-call1', 'a-m7', 'a-call2', 'a-m7']);
	assert.deepEqual(calls.filter((cue) => cue.do === 'type').map((cue) => cue.el), ['out-1', 'out-2']);
	// Reference aliasing: p2 = p1 draws the magenta alias reference to obj1 and mutates obj1.
	const alias = cuesOf('alias');
	const drawn = alias.filter((cue) => cue.do === 'draw').map((cue) => cue.el);
	assert.ok(drawn.includes('ref-alias'), 'alias step draws the shared reference');
	assert.deepEqual(stopsOf(alias, 'p'), ['a-alias', 'a-mut', 'a-obj1', 'a-end']);
	assert.deepEqual(
		alias.filter((cue) => cue.do === 'type' && cue.el.startsWith('out-')).map((cue) => cue.el),
		['out-b'],
	);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		if (component.includes(`tagChip('${id}'`)) return true;
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
		'`class ${names.person} {`',
		'`    public String ${names.name};`',
		'`    public int ${names.age};`',
		'`    public void ${names.greet}() {`',
		'`        ${names.person} p1 = new ${names.person}();`',
		'`        p1.${names.name} = "${strings.laura}";`',
		'`        ${names.person} p2 = new ${names.person}();`',
		'`        p1.${names.greet}();`',
		'`        p2.${names.greet}();`',
		'`        ${names.person} p2 = p1;`',
		'`        p2.${names.name} = "${strings.anaMaria}";`',
		"t('Persona', 'Person')",
		"t('nombre', 'name')",
		"t('edad', 'age')",
		"t('saludar', 'greet')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	const lines = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.equal(lines('sourceA').length, 20);
	assert.equal(lines('sourceB').length, 20);
	assert.match(lines('sourceA')[11], /p1 = new \$\{names\.person\}\(\);/);
	assert.match(lines('sourceB')[14], /p2 = p1;/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/clases-objetos-java'/);
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
	assert.equal((component.match(/data-slug='clases-objetos-java'/g) ?? []).length, 4);
});
