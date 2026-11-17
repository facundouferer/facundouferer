import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/constructores-encapsulamiento-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'constructores-encapsulamiento-java';
const LESSON = '07-constructores-y-encapsulamiento';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '08-constructores-y-encapsulamiento';
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
		['constructor', 'private', 'getter', 'reject', 'accept', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['build', 'construct', 'block', 'getter', 'reject', 'accept', 'overload', 'recap'],
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
		// 1. Constructor & this
		'flujo de ejecución',
		'constructor',
		'this.saldo',
		'estado inicial válido',
		// 2. Why private matters
		'private',
		'el compilador bloquea',
		'acceso directo',
		// 3. Reading through a getter
		'getSaldo()',
		'solo lectura',
		// 4. Rejecting invalid value in mutator/setter
		'depositar(-500)',
		'if',
		'return false',
		'intacto',
		// 5. Valid update & overloaded constructor delegation
		'depositar(200)',
		'return true',
		'this(titular, 0)',
		// 6. Recap
		'nace válido',
		'dueño de su propio estado',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo, and no exceptions (taught in lesson 13).
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé)\b/i);
	assert.doesNotMatch(all, /\b(throw|throws|try|catch|Exception)\b/i);
});

test('direct access to private field is blocked while methods enforce the invariant', () => {
	// Construct: flow enters new Cuenta(1000), runs constructor line 5, initializes object.
	assert.deepEqual(stopsOf(cuesOf('construct'), 'p'), ['a-new', 'a-c5', 'a-obj']);
	assert.deepEqual(stopsOf(cuesOf('construct'), 'hl'), ['ln-15', 'ln-5']);

	// Block: direct access to private field highlights in magenta and never reaches the object.
	const block = cuesOf('block');
	assert.ok(block.some((cue) => cue.do === 'draw' && cue.el === 'rt-priv'), 'draws blocked direct route');
	assert.ok(block.some((cue) => cue.do === 'enter' && cue.el === 'priv-x'), 'lights magenta barrier');
	assert.ok(!stopsOf(block, 'p').includes('a-obj'), 'particle is stopped before the object');

	// Reject vs Accept: invalid deposit stops at guard (line 9), valid deposit reaches line 10 and updates state.
	const reject = cuesOf('reject');
	assert.deepEqual(stopsOf(reject, 'p'), ['a-bad', 'a-d9']);
	assert.deepEqual(stopsOf(reject, 'hl'), ['ln-17', 'ln-9']);
	assert.ok(reject.some((cue) => cue.do === 'enter' && cue.el === 'd9-x'), 'guard rejects negative amount in magenta');

	const accept = cuesOf('accept');
	assert.deepEqual(stopsOf(accept, 'p'), ['a-ok', 'a-d9', 'a-d10', 'a-obj']);
	assert.deepEqual(stopsOf(accept, 'hl'), ['ln-18', 'ln-9', 'ln-10', 'ln-19']);
	assert.deepEqual(accept.filter((cue) => cue.do === 'type').map((cue) => cue.el), ['out-2']);
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
		'`class ${names.account} {`',
		'`    private double ${names.balance};`',
		'`    public ${names.account}(double ${names.balance}) {`',
		'`        this.${names.balance} = ${names.balance};`',
		'`    public double ${names.getBalance}() { return ${names.balance}; }`',
		'`    public boolean ${names.deposit}(double ${names.amount}) {`',
		'`        if (${names.amount} <= 0) return false;`',
		'`        this.${names.balance} += ${names.amount};`',
		'`        this(${names.owner}, 0);`',
		"t('Cuenta', 'Account')",
		"t('saldo', 'balance')",
		"t('getSaldo', 'getBalance')",
		"t('depositar', 'deposit')",
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
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/constructores-encapsulamiento-java'/);
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
	assert.equal((component.match(/data-slug='constructores-encapsulamiento-java'/g) ?? []).length, 4);
});
