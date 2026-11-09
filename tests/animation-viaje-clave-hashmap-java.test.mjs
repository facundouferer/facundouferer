import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { CAPACITY, bucketOf, entries, javaHashCode, script } from '../src/data/animations/viaje-clave-hashmap-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'viaje-clave-hashmap-java';
const LESSON = '13-java-collections-framework-y-genericos';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '15-java-collections-framework-y-genericos';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;
const narration = (lang) =>
	resolveScript(script, lang)
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n');

test(`catalog binds ${SLUG} to java/${LESSON}, next to the step-by-step animation`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: LESSON });
	assert.deepEqual(
		getAnimationsForLesson('java', LESSON).map((entry) => entry.slug),
		['collections-genericos-java', SLUG],
	);
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/java/${FILE}.es.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['map', 'hash', 'bucket', 'collision', 'equals', 'get'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['build', 'hash', 'store', 'second', 'collide', 'equals', 'get', 'direct'],
	);
	const used = new Set(script.steps.map((step) => step.chapter));
	for (const chapter of script.chapters) assert.ok(used.has(chapter.id), `chapter ${chapter.id} has a step`);
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
	const all = narration('es');
	for (const concept of [
		// 1. What is a HashMap inside?
		'arreglo de buckets',
		'clave con un valor',
		// 2. How does put decide where an entry goes?
		'hashCode()',
		'número entero',
		'máscara',
		// 3. Where does the entry end up?
		'directo a su bucket',
		'la clave junto con su valor',
		'bien distribuido',
		// 4. What is a collision?
		'colisión',
		'mismo bucket',
		// 5. How are two keys of one bucket told apart?
		'equals()',
		'claves distintas',
		// 6. Why is get fast?
		'el mismo hash',
		'devuelve el valor',
		'No recorrió la colección',
		'O(1)',
		'O(n)',
		'elige el cajón',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|recorré|usá|hacé|vas a)\b/i);
	assert.match(narration('en'), /picks the drawer/);
});

test('the hashes and buckets on screen are the ones Java computes', () => {
	// Known values of String.hashCode(), the same the lesson quotes.
	assert.equal(javaHashCode('gato'), 3165397);
	assert.equal(javaHashCode('cat'), 98262);
	assert.equal(CAPACITY, 16);
	assert.equal(bucketOf('gato'), 5);
	assert.equal(bucketOf('cat'), 7);

	for (const lang of ['es', 'en']) {
		const [first, other, third] = entries[lang];
		const text = narration(lang);
		assert.equal(bucketOf(first.key), bucketOf(third.key), `${lang}: the first and third keys collide`);
		assert.notEqual(javaHashCode(first.key), javaHashCode(third.key), `${lang}: with different hashes`);
		assert.notEqual(bucketOf(other.key), bucketOf(first.key), `${lang}: the second key lands elsewhere`);
		// The narration quotes those exact numbers and keys.
		assert.ok(text.includes(`put("${first.key}", ${first.value})`), `${lang}: narrates the first put`);
		assert.ok(text.includes(`"${first.key}" es ${javaHashCode(first.key)}`) || text.includes(`"${first.key}" it is ${javaHashCode(first.key)}`), `${lang}: quotes the hash`);
		assert.ok(text.includes(`bucket ${bucketOf(first.key)}`), `${lang}: names the bucket of "${first.key}"`);
		assert.ok(text.includes(`"${other.key}"`) && text.includes(`bucket ${bucketOf(other.key)}.`), `${lang}: names the bucket of "${other.key}"`);
		assert.ok(text.includes(`get("${third.key}")`), `${lang}: narrates the lookup`);
		assert.ok(text.includes(`: ${third.value}.`), `${lang}: says the value returned`);
	}
});

test('get repeats the path of put: same machines, same bucket, then equals on each entry', () => {
	const stops = (stepIds, el) =>
		script.steps
			.filter((step) => stepIds.includes(step.id))
			.flatMap((step) => step.motion.cues)
			.filter((cue) => cue.do === 'move' && cue.el === el)
			.map((cue) => cue.to);
	assert.deepEqual(stops(['hash', 'store'], 'k1'), ['a-h', 'a-x', 'a-b1']);
	assert.deepEqual(stops(['second'], 'k2'), ['a-h', 'a-x', 'a-b2']);
	// The colliding key reaches the same bucket, is compared with the stored key and is chained after it.
	assert.deepEqual(stops(['collide', 'equals'], 'k3'), ['a-h', 'a-x', 'a-b1', 'a-n1', 'a-n3']);
	// The lookup follows exactly that path.
	assert.deepEqual(stops(['get'], 'kq'), ['a-h', 'a-x', 'a-b1', 'a-n1', 'a-n3']);
	// The execution flow and the editor bar advance one line at a time.
	assert.deepEqual(stops(['hash', 'second', 'collide', 'get'], 'p'), ['a-l7', 'a-l8', 'a-l9', 'a-l10']);
	assert.deepEqual(stops(['hash', 'second', 'collide', 'get'], 'hl'), ['ln-7', 'ln-8', 'ln-9', 'ln-10']);

	// The collision is shown before equals resolves it; the value is printed only by get.
	const cues = (id) => script.steps.find((step) => step.id === id).motion.cues;
	assert.ok(cues('collide').some((cue) => cue.do === 'enter' && cue.el === 'b1-x'));
	assert.ok(cues('equals').some((cue) => cue.do === 'exit' && cue.el === 'b1-x'));
	assert.ok(cues('equals').some((cue) => cue.do === 'enter' && cue.el === 'n3'));
	const typed = script.steps.filter((step) => step.motion.cues.some((cue) => cue.do === 'type' && cue.el === 'out-1')).map((step) => step.id);
	assert.deepEqual(typed, ['get']);
});

test('an element is never faded out while hidden nor shown twice in a row', () => {
	// `exit` animates from full opacity, so exiting a hidden element would flash it.
	const shown = new Set(['floor']);
	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			if (cue.do === 'camera' || cue.do === 'move' || cue.do === 'pulse' || cue.do === 'flow') continue;
			if (cue.do === 'exit') {
				assert.ok(shown.has(cue.el), `${step.id} exits "${cue.el}" while it is hidden`);
				shown.delete(cue.el);
			} else {
				assert.ok(!shown.has(cue.el), `${step.id} shows "${cue.el}" while it is already visible`);
				shown.add(cue.el);
			}
		}
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids written in the markup, listed in the frontmatter (`id: 'a-h'`, `lit: 'h-on'`,
	// `chip('ch-h1'`) or built in a loop (`e-${n}`, `a-l${n}`, `fl-in-${n}`) count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`lit: '${id}'`)) return true;
		if (component.includes(`Chip('${id}'`)) return true;
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
		"'import java.util.HashMap;'",
		"'import java.util.Map;'",
		'public class ${names.type} {',
		'    public static void main(String[] args) {',
		'Map<String, Integer> ${names.map} = new HashMap<>();',
		'${names.map}.put(${first.quoted}, ${first.value});',
		'${names.map}.put(${other.quoted}, ${other.value});',
		'${names.map}.put(${third.quoted}, ${third.value});',
		'System.out.println(${names.map}.get(${third.quoted}));',
		"t('frecuencias', 'frequencies')",
		// The mask the lesson explains, and the two calls the film is about.
		'(h ^ (h >>> 16)) & ${CAPACITY - 1}',
		'.hashCode() → ${entry.hash}',
		'.equals(${stored.quoted}) → ${result}',
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// The only output is the value get returns, and the numbers come from the shared helpers.
	assert.ok(component.includes('text: String(third.value)'));
	assert.ok(component.includes('hash: javaHashCode(entry.key)'));
	assert.ok(component.includes('bucket: bucketOf(entry.key, CAPACITY)'));
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { CAPACITY, bucketOf, entries, javaHashCode, script } from '\.\.\/\.\.\/data\/animations\/viaje-clave-hashmap-java'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.match(component, /<g class="mg-camera" data-camera>/);
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG or CSS filters');
	assert.equal((component.match(/data-slug='viaje-clave-hashmap-java'/g) ?? []).length, 4, 'every global rule is scoped to this film');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.equal(hexLines.length, 18, 'the token block is the one of the reference film');
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	const families = [...component.matchAll(/font-family: ([^;]+);/g)].map((match) => match[1]);
	assert.ok(families.length > 0);
	for (const family of families) assert.ok(['var(--font-body)', 'monospace'].includes(family), `unexpected font: ${family}`);
});

test('thumbnail stays in the Organic palette', async () => {
	const svg = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76', '#faf5ec']);
	const colors = svg.match(/#[0-9a-fA-F]{6}\b/g) ?? [];
	assert.ok(colors.length > 0);
	for (const color of colors) assert.ok(organic.has(color.toLowerCase()), `thumbnail color outside the Organic palette: ${color}`);
});
