import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/introduccion-pilares-poo-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'introduccion-pilares-poo-java';
const LESSON = '06-introduccion-y-pilares-poo';
const FILE = '06-introduccion-y-pilares-poo';
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
		['procedural', 'abstraction', 'encapsulation', 'inheritance', 'polymorphism', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['chaos', 'corrupt', 'abstract', 'encapsulate', 'guard', 'inherit', 'polymorph', 'recap'],
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
		// 1. What happens in procedural code with loose variables?
		'variables sueltas',
		'titular1',
		'saldo1',
		'sin control',
		// 2. What is abstraction?
		'abstracción',
		'lo esencial',
		'CuentaBancaria',
		'estado',
		'comportamiento',
		// 3. What does encapsulation protect?
		'encapsulamiento',
		'private',
		'depositar',
		'rechaza',
		// 4. How does inheritance reuse the base model?
		'herencia',
		'extends',
		'CajaAhorro',
		// 5. How does polymorphism respond to the same message?
		'polimorfismo',
		'calcularInteres()',
		'según su tipo real',
		// 6. How do state, behavior and the four pillars work together?
		'cuatro pilares',
		'límites claros',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé)\b/i);
});

test('procedural corruption is exposed in magenta before encapsulation guards the balance', () => {
	// In procedural chaos, the flow alters saldo1 directly with a negative value (magenta).
	assert.deepEqual(stopsOf(cuesOf('chaos', 'corrupt'), 'p'), ['a-t1', 'a-s1', 'a-bad']);
	const corrupt = cuesOf('corrupt');
	assert.ok(corrupt.some((cue) => cue.do === 'enter' && cue.el === 'bad-on'), 'direct invalid mutation lights in magenta');
	assert.ok(corrupt.some((cue) => cue.do === 'type' && cue.el === 'out-bad'), 'prints corrupted negative balance');

	// In guard, depositing -500 is rejected at the gate while +300 updates the encapsulated object.
	const guard = cuesOf('guard');
	assert.deepEqual(stopsOf(guard, 'p'), ['a-dep-bad', 'a-dep-ok', 'a-dep5']);
	assert.ok(guard.some((cue) => cue.do === 'enter' && cue.el === 'rej-chip'), 'invalid deposit is rejected');
	assert.ok(guard.some((cue) => cue.do === 'type' && cue.el === 'out-enc'), 'prints protected balance');
});

test('inheritance and polymorphism dispatch calcularInteres() to CajaAhorro', () => {
	const poly = cuesOf('inherit', 'polymorph');
	assert.deepEqual(stopsOf(poly, 'p'), ['a-sav-new', 'a-poly-call', 'a-sav-obj', 'a-sav12']);
	assert.deepEqual(stopsOf(cuesOf('polymorph'), 'hl'), ['ln-18', 'ln-12']);
	assert.ok(cuesOf('polymorph').some((cue) => cue.do === 'type' && cue.el === 'out-poly'), 'prints subclass interest output');
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
		'`        String ${names.holder1} = "Ana";`',
		'`        double ${names.balance1} = 1000;`',
		'`        ${names.balance1} = -500;`',
		'`class ${names.account} {`',
		'`    private double ${names.balance} = 1000;`',
		'`    public void ${names.deposit}(double ${names.amount}) {`',
		'`class ${names.savings} extends ${names.account} {`',
		"'    @Override'",
		'`    public double ${names.calcInterest}() {`',
		'`        ${names.account} c = new ${names.savings}();`',
		"t('CuentaBancaria', 'BankAccount')",
		"t('CajaAhorro', 'SavingsAccount')",
		"t('depositar', 'deposit')",
		"t('calcularInteres', 'calculateInterest')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	const lines = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.equal(lines('sourceA').length, 20);
	assert.equal(lines('sourceB').length, 20);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/introduccion-pilares-poo-java'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');

	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.equal((component.match(/data-slug='introduccion-pilares-poo-java'/g) ?? []).length, 4);
});
