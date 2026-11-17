import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/archivos-jar-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'archivos-jar-java';
const LESSON = '17-archivos-persistencia-y-empaquetado-jar';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '19-archivos-persistencia-y-empaquetado-jar';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const stepOf = (id) => script.steps.find((step) => step.id === id);

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
		['heap', 'volatile', 'decorator', 'close', 'persist', 'jar'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['heap', 'vanish', 'wrap', 'write', 'close', 'persist', 'package', 'run'],
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

test('narration answers the six questions of the film in neutral Spanish and in English', () => {
	const narration = (lang) =>
		resolveScript(script, lang)
			.steps.map((step) => `${step.title} ${step.text}`)
			.join('\n')
			.toLowerCase();
	const es = narration('es');
	for (const concept of [
		// 1. Why does the data disappear when the program ends?
		'heap',
		'la jvm se detiene',
		'se evapora',
		// 2. How does a write reach the disk? Through a chain of decorators.
		'decorador',
		'bufferedwriter',
		'filewriter',
		'utf-8',
		// 3. What is the buffer for?
		'buffer',
		'una sola vez',
		// 4. Why try-with-resources?
		'try-with-resources',
		'se cierra',
		'se pierde',
		// 5. What survives the program?
		'disco',
		'sobrevive al programa',
		// 6. How is the program delivered and started?
		'.class',
		'zip',
		'manifest.mf',
		'main-class',
		'java -jar',
	]) {
		assert.ok(es.includes(concept), `Spanish narration should mention ${concept}`);
	}
	const en = narration('en');
	for (const concept of ['heap', 'evaporates', 'decorator', 'buffer', 'try-with-resources', 'closed', 'survives the program', 'zip', 'manifest.mf', 'main-class', 'java -jar']) {
		assert.ok(en.includes(concept), `English narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo imperatives or verb forms.
	assert.doesNotMatch(es, /\b(mirá|fijate|fijá|pensá|tenés|podés|querés|sabés|usá|elegí|declará|cerrá)\b/i);
});

test('the data reaches the disk only through the decorators, and only once the writer is closed', () => {
	// The CSV line travels Heap → BufferedWriter → FileWriter → disk, never skipping a layer.
	assert.deepEqual(stopsOf(cuesOf('write', 'close'), 'pk'), ['a-heap', 'a-buf', 'a-fw', 'a-disk']);
	// While writing, the line waits in the buffer: the file on disk does not exist yet.
	assert.ok(!cuesOf('heap', 'vanish', 'wrap', 'write').some((cue) => cue.el === 'file'), 'no file before the close');
	const close = stepOf('close').motion.cues;
	const flushAt = close.find((cue) => cue.do === 'move' && cue.el === 'pk' && cue.to === 'a-fw').at;
	const fileAt = close.find((cue) => cue.do === 'enter' && cue.el === 'file').at;
	assert.ok(fileAt > flushAt, 'the file appears after the buffer is flushed');
});

test('when the JVM stops the Heap evaporates, but the file on disk stays', () => {
	for (const id of ['vanish', 'persist']) {
		const cues = stepOf(id).motion.cues;
		assert.ok(cues.some((cue) => cue.do === 'enter' && cue.el === 'heap-x'), `${id}: the Heap is marked as lost`);
		assert.ok(cues.some((cue) => cue.do === 'exit' && cue.el === 'obj'), `${id}: the object disappears`);
	}
	const afterClose = cuesOf('persist', 'package', 'run');
	assert.ok(!afterClose.some((cue) => cue.do === 'exit' && cue.el === 'file'), 'the file is never removed after it is written');
	assert.ok(stepOf('persist').motion.cues.some((cue) => cue.do === 'pulse' && cue.el === 'file'));
});

test('java -jar reads the manifest before it starts main', () => {
	const pack = stepOf('package').motion.cues;
	assert.deepEqual(stopsOf(pack, 'cls-a'), ['a-jar']);
	assert.deepEqual(stopsOf(pack, 'cls-b'), ['a-jar']);
	const run = stepOf('run').motion.cues;
	const readAt = run.find((cue) => cue.do === 'enter' && cue.el === 'mf-on').at;
	const launchAt = run.find((cue) => cue.do === 'draw' && cue.el === 'rt-launch').at;
	const printAt = run.find((cue) => cue.do === 'type' && cue.el === 'out-2').at;
	assert.ok(readAt < launchAt && launchAt < printAt, 'manifest → main → output');
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`eb-${n}`) or listed in the frontmatter (`id: 'a-heap'`) count as present.
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

test('the code in the canvas is the program the narration describes', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		'public static void main(String[] args) throws IOException {',
		'Producto',
		'try (BufferedWriter out = new BufferedWriter(',
		'new FileWriter("${names.file}", StandardCharsets.UTF_8))) {',
		'out.write(p.${names.toCsv}());',
		'$ javac -d bin *.java',
		'$ jar cvfe app.jar Main -C bin .',
		'META-INF/MANIFEST.MF',
		'Main-Class: Main',
		'$ java -jar app.jar',
		"t('Guardado en disco'",
		"t('catalogo.csv'",
		"t('aLineaCSV'",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// The editor stays within twenty lines.
	const lines = [...component.matchAll(/\{ n: (\d+),/g)].map((match) => Number(match[1]));
	assert.ok(lines.length > 0 && Math.max(...lines) <= 20, 'at most 20 editor lines');
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/archivos-jar-java'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter\b/, 'no SVG filters');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
