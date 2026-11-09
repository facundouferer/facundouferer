import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/viaje-llamada-polimorfica-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'viaje-llamada-polimorfica-java';
const LESSON = '08-herencia-polimorfismo-y-sobrecarga';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '10-herencia-polimorfismo-y-sobrecarga';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);

test(`catalog binds ${SLUG} to java/${LESSON}, next to the step-by-step animation`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: LESSON });
	assert.deepEqual(
		getAnimationsForLesson('java', LESSON).map((entry) => entry.slug),
		['herencia-polimorfismo-java', SLUG],
	);
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/java/${FILE}.es.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['types', 'compile', 'dispatch', 'super', 'overload', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['build', 'assign', 'check', 'expect', 'dispatch', 'super', 'overload', 'recap'],
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
		// 1. What does a parent-typed variable holding a child object mean?
		'flujo de ejecución',
		'una variable de tipo `Vehiculo`',
		'un `Auto` es un `Vehiculo`',
		'tipo declarado',
		'tipo real',
		// 2. What does the compiler check in the call?
		'el compilador revisó',
		'qué se puede llamar',
		// 3. Who decides which code runs?
		'la JVM no mira la variable',
		'sigue la referencia',
		'despacho dinámico',
		'polimorfismo',
		'sobrescribe',
		// 4. What does super do inside an override?
		'super.arrancar()',
		'la versión del padre',
		'en lugar de reemplazarlo',
		// 5. How is overloading different?
		'sobrecarga',
		'los tipos de los argumentos',
		'antes de ejecutar',
		// 6. What is the one rule to remember?
		'el objeto define qué se ejecuta',
		'subclases que todavía no existen',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé)\b/i);
});

test('the call reaches the override through the object, never through the parent first', () => {
	// Dispatch: the flow reads the variable, follows the reference and lands on Auto.arrancar().
	assert.deepEqual(stopsOf(cuesOf('expect', 'dispatch'), 'p'), ['a-var', 'a-obj', 'a-a10']);
	assert.deepEqual(stopsOf(cuesOf('dispatch'), 'hl'), ['ln-9']);
	// The parent's version is only an expectation (magenta), cleared before the override runs.
	const dispatch = cuesOf('dispatch');
	const cleared = dispatch.filter((cue) => cue.do === 'exit').map((cue) => cue.el);
	for (const id of ['rt-exp', 'v3-x', 'exp', 'hx-2']) assert.ok(cleared.includes(id), `dispatch clears ${id}`);
	assert.ok(!dispatch.some((cue) => cue.el === 'v3-on'), 'the parent method does not run during dispatch');
	// super: child line 10, parent line 3, back to child line 11, then main; output in that order.
	const sup = cuesOf('super');
	assert.deepEqual(stopsOf(sup, 'p'), ['a-v3', 'a-a11', 'a-end']);
	assert.deepEqual(stopsOf(sup, 'hl'), ['ln-10', 'ln-3', 'ln-11', 'ln-19']);
	assert.deepEqual(sup.filter((cue) => cue.do === 'type').map((cue) => cue.el), ['out-1', 'out-2']);
});

test('the overload is selected before the flow runs', () => {
	const cues = cuesOf('overload');
	const at = (kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;
	assert.ok(at('draw', 'rt-over') < at('enter', 'p'), 'the route to print(int) exists before execution starts');
	assert.ok(at('enter', 'con-off') < at('enter', 'p'), 'the other overloads are discarded at compile time');
	assert.deepEqual(stopsOf(cues, 'p'), ['a-new', 'a-call', 'a-c7']);
	assert.deepEqual(stopsOf(cues, 'hl'), ['ln-17', 'ln-18', 'ln-7']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`ea-${n}`) or listed in the frontmatter (`id: 'a-new'`) count as present.
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
		'`class ${names.vehicle} {`',
		'`class ${names.car} extends ${names.vehicle} {`',
		"'    @Override'",
		'`        super.${names.start}();`',
		'`        ${names.vehicle} v = new ${names.car}();`',
		'`        v.${names.start}();`',
		'`    public void ${names.print}(String ${names.text}) {`',
		'`    public void ${names.print}(int ${names.number}) {`',
		'`    public void ${names.print}(String ${names.text}, int ${names.times}) {`',
		'`        ${names.console}.${names.print}(3);`',
		"t('El vehículo arranca.', 'The vehicle starts.')",
		"t('...y activa el arranque sin llave.', '...and engage keyless ignition.')",
		"t('Vehiculo', 'Vehicle')",
		"t('Auto', 'Car')",
		"t('arrancar', 'start')",
		"t('imprimir', 'print')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// Both programs keep `main` on the same lines, so its modules (17 and 18) stay true.
	const lines = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.equal(lines('sourceA').length, 20);
	assert.equal(lines('sourceB').length, 20);
	assert.match(lines('sourceA')[17], /v\.\$\{names\.start\}\(\);/);
	assert.match(lines('sourceB')[17], /\$\{names\.print\}\(3\);/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/viaje-llamada-polimorfica-java'/);
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
	assert.equal((component.match(/data-slug='viaje-llamada-polimorfica-java'/g) ?? []).length, 4);
});
