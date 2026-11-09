import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/viaje-contrato-interfaz-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'viaje-contrato-interfaz-java';
const LESSON = '09-clases-abstractas-interfaces-y-modelado';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '11-clases-abstractas-interfaces-y-modelado';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);

test(`catalog binds ${SLUG} to java/${LESSON}, next to the step-by-step animation`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: LESSON });
	assert.deepEqual(
		getAnimationsForLesson('java', LESSON).map((entry) => entry.slug),
		['abstractas-interfaces-java', SLUG],
	);
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/java/${FILE}.es.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['contract', 'mold', 'reject', 'concrete', 'client', 'whole'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['contract', 'mold', 'reject', 'complete', 'create', 'ask', 'pay', 'reveal'],
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
		// 1. What does an interface declare?
		'una interfaz es un contrato',
		'qué se debe hacer, nunca cómo',
		'sin cuerpo',
		// 2. What does an abstract class add, and what does it leave open?
		'clase abstracta',
		'aporta estado',
		'el molde queda incompleto',
		// 3. Why can it not be instantiated?
		'el compilador lo rechaza',
		'no se puede instanciar',
		'hueco',
		// 4. What must the concrete class do?
		'extiende',
		'hereda',
		'implementa `pagar`',
		'el contrato está completo',
		// 5. How does the client code use the object?
		'de tipo `Pagable`',
		'a través de la interfaz',
		'sin conocer la implementación',
		// 6. Which code runs?
		'la clase abstracta responde',
		'se ejecuta el código del objeto',
		'no depende de ninguna implementación concreta',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|usá|definí|creá|hacé|armá)\b/i);

	const english = resolveScript(script, 'en')
		.steps.map((step) => step.text)
		.join('\n');
	for (const identifier of ['Payable', 'DigitalPaymentMethod', 'DigitalWallet', 'isAvailable']) {
		assert.ok(english.includes(identifier), `English narration localizes ${identifier} like the lesson`);
	}
	assert.doesNotMatch(english, /Pagable|MercadoPago|estaDisponible/);
});

test('the contract travels down one level at a time and ends as an object', () => {
	const stops = script.steps.flatMap((step) => step.motion.cues.filter((cue) => cue.do === 'move' && cue.el === 'k').map((cue) => `${step.id}:${cue.to}`));
	assert.deepEqual(stops, ['mold:a-k2', 'complete:a-k3']);

	// The rejected instance only exists while the compiler refuses it.
	const ghost = script.steps.flatMap((step) => step.motion.cues.filter((cue) => cue.el === 'ghost' && cue.do !== 'pulse').map((cue) => `${step.id}:${cue.do}`));
	assert.deepEqual(ghost, ['reject:enter', 'complete:exit']);
	assert.ok(cuesOf('reject').some((cue) => cue.do === 'type' && cue.el === 'out-err'), 'the compiler error is printed');
	assert.ok(cuesOf('complete').some((cue) => cue.do === 'exit' && cue.el === 'out-err'), 'the compiler error is cleared');

	// The object is created only after the concrete class filled the gap.
	const order = script.steps.map((step) => step.id);
	const stepOf = (el, kind) => order.findIndex((id) => cuesOf(id).some((cue) => cue.el === el && cue.do === kind));
	assert.ok(stepOf('m-pay', 'enter') < stepOf('obj', 'enter'));
	assert.equal(order[stepOf('obj', 'enter')], 'create');
});

test('each call enters through the interface and falls to the level that gave it a body', () => {
	const particle = (id) => cuesOf(id).filter((cue) => cue.do === 'move' && cue.el === 'p').map((cue) => cue.to);
	assert.deepEqual(particle('ask'), ['a-q', 'a-sa', 'a-av', 'a-sa', 'a-q']);
	assert.deepEqual(particle('pay'), ['a-call', 'a-sp', 'a-hole', 'a-pay']);

	const bar = (id) => cuesOf(id).filter((cue) => cue.do === 'move' && cue.el === 'hl').map((cue) => cue.to);
	assert.deepEqual(bar('ask'), ['l-22', 'l-8', 'l-22']);
	assert.deepEqual(bar('pay'), ['l-23', 'l-13', 'l-14', 'l-15', 'l-16']);
	assert.ok(cuesOf('pay').some((cue) => cue.do === 'type' && cue.el === 'out-ok'), 'the program prints its output');
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`e-${n}`) or listed in the frontmatter (`id: 'a-k1'`) count as present.
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

	// Camera and `move` targets are anchors, never elements that travel.
	for (const cue of script.steps.flatMap((step) => step.motion.cues)) {
		if (cue.do !== 'move' && cue.do !== 'camera') continue;
		for (const id of cue.to === 'all' ? [] : [cue.to].flat()) assert.match(id, /^(a|l|shot)-/, `${id} must be an anchor`);
	}
});

test('the code in the canvas is the program the narration describes', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		'`interface ${names.iface} {`',
		'`    boolean ${names.pay}(double ${names.amount});`',
		'`    boolean ${names.available}();`',
		'`abstract class ${names.abs} implements ${names.iface} {`',
		'`    protected boolean ${names.active} = true;`',
		'`    public boolean ${names.available}() { return ${names.active}; }`',
		'`class ${names.impl} extends ${names.abs} {`',
		'`    private double ${names.balance} = 30000;`',
		'`    public boolean ${names.pay}(double ${names.amount}) {`',
		'`        ${names.balance} -= ${names.amount};`',
		'`        System.out.println("${strings.remaining}" + ${names.balance});`',
		"'        return true;'",
		"'public static void main(String[] args) {'",
		'`    ${names.iface} ${names.variable} = new ${created}();`',
		'`    if (${names.variable}.${names.available}()) {`',
		'`        ${names.variable}.${names.pay}(12500);`',
		// 30000 - 12500 printed as a double, and the message javac gives for the abstract class.
		'${strings.remaining}17500.0',
		'error: ${names.abs} is abstract; cannot be instantiated',
		// Identifiers localized like the lesson's English version.
		"t('Pagable', 'Payable')",
		"t('MedioDePagoDigital', 'DigitalPaymentMethod')",
		"t('MercadoPago', 'DigitalWallet')",
		"t('estaDisponible', 'isAvailable')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	const lesson = await readFile(`src/content/courses/java/${FILE}.en.md`, 'utf8');
	for (const identifier of ['Payable', 'DigitalPaymentMethod', 'DigitalWallet', 'isAvailable', 'CreditCard']) {
		assert.ok(lesson.includes(identifier), `the English lesson uses ${identifier}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/viaje-contrato-interfaz-java'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.match(component, /:global\(\.anim-player\[data-slug='viaje-contrato-interfaz-java'\]\) \{/);
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');

	// The token block is the one of the reference film, value for value.
	const tokens = (source) => (source.match(/^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/gm) ?? []).map((line) => line.trim());
	const reference = await readFile('src/components/animaciones/viaje-excepcion-java.astro', 'utf8');
	assert.deepEqual(tokens(component), tokens(reference));
});
