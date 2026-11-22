import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/datos-secuenciales-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'datos-secuenciales-c';
const LESSON = 'manejo-de-estructuras-secuenciales-de-datos';
const FILE = '18-manejo-de-estructuras-secuenciales-de-datos';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.deepEqual(animation.tag, { es: 'C', en: 'C' });
	assert.ok(getAnimationsForLesson('c', LESSON).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['loose', 'limit', 'sequence', 'access', 'size', 'next'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['build', 'sum', 'limit', 'row', 'sequential', 'direct', 'fixed', 'grow', 'close'],
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

test('the particle, the editor bar and each token never start a move before the previous one ends', () => {
	for (const step of script.steps) {
		const movers = new Set(step.motion.cues.filter((cue) => cue.do === 'move').map((cue) => cue.el));
		for (const el of movers) {
			const moves = step.motion.cues.filter((cue) => cue.do === 'move' && cue.el === el);
			moves.slice(1).forEach((cue, index) => {
				assert.ok(cue.at >= cueEnd(moves[index]), `${step.id}: ${el} moves to ${cue.to} while still travelling`);
			});
		}
	}
});

test('the film lasts between 90 and 120 seconds in both languages', () => {
	for (const lang of ['es', 'en']) {
		const steps = resolveScript(script, lang).steps;
		const total = steps.reduce((sum, step) => sum + step.duration, 0);
		console.log(`${SLUG} ${lang}: ${(total / 1000).toFixed(1)} s`);
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

test('narration answers the questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// Why keep the values together instead of separate variables?
		'variables sueltas',
		'no escala',
		'son nombres, no posiciones',
		'cantidad queda fija en el código',
		// What is a sequence?
		'estructura secuencial',
		'uno detrás de otro',
		'un solo nombre',
		'posiciones empiezan en 0',
		'un ciclo puede generarlas',
		// Sequential versus direct access.
		'acceso secuencial',
		'cuesta k pasos',
		'acceso directo',
		'un solo paso',
		'acceso aleatorio',
		// Fixed versus growing size.
		'tamaño estático',
		'capacidad',
		'cantidad usada',
		'tamaño dinámico',
		'memoria en ejecución',
		// What the next lesson adds.
		'el arreglo',
		'lección siguiente',
		'listas enlazadas',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|vos)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'separate variables',
		'does not scale',
		'names, not positions',
		'count is fixed in the code',
		'sequential structure',
		'one after another',
		'single name',
		'positions start at 0',
		'a loop can generate them',
		'sequential access',
		'takes k steps',
		'direct access',
		'a single step',
		'random access',
		'static size',
		'capacity',
		'used count',
		'dynamic size',
		'memory at run time',
		'the array',
		'next lesson',
		'linked lists',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

test('the same five grades leave their boxes for the row, and the full row rejects one more', () => {
	const cues = Object.fromEntries(script.steps.map((step) => [step.id, step.motion.cues]));
	const has = (id, cue) => cues[id].some((entry) => Object.entries(cue).every(([key, value]) => entry[key] === value));
	for (const n of [1, 2, 3, 4, 5]) {
		assert.ok(has('build', { do: 'enter', el: `c-${n}` }), `box ${n} is created by its line`);
		assert.ok(has('sum', { do: 'move', el: `tk-${n}`, to: 'a-sum' }), `grade ${n} is read by name`);
		assert.ok(has('row', { do: 'move', el: `tk-${n}`, to: `a-s${n - 1}` }), `grade ${n} lands on position ${n - 1}`);
		assert.ok(has('row', { do: 'exit', el: `c-${n}` }), `box ${n} is no longer needed`);
	}
	// Sequential access visits every slot up to 4; direct access jumps there in one move.
	const seqHops = cues.sequential.filter((cue) => cue.do === 'move' && cue.el === 'p' && /^a-s\d/.test(cue.to)).map((cue) => cue.to);
	assert.deepEqual(seqHops, ['a-s0', 'a-s1', 'a-s2', 'a-s3', 'a-s4']);
	const jump = cues.direct.filter((cue) => cue.do === 'move' && cue.el === 'p');
	assert.deepEqual(jump.slice(0, 2).map((cue) => cue.to), ['a-start', 'a-s4']);
	// Capacity 8: three more grades fill it and the ninth has no room.
	for (const n of [6, 7, 8]) assert.ok(has('fixed', { do: 'move', el: `tk-${n}`, to: `a-s${n - 1}` }));
	assert.ok(has('fixed', { do: 'move', el: 'tk-9', to: 'a-full' }));
	assert.ok(has('fixed', { do: 'enter', el: 'lb-full' }));
	// The growing row gets a new slot for each arriving item.
	for (const n of [0, 1, 2, 3]) assert.ok(has('grow', { do: 'enter', el: `g-${n}` }));
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`m-${...}`) or listed in the frontmatter (`id: 'lb-cap'`) count as present.
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

test('the code in the canvas is the lesson program and its real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'#include <stdio.h>'",
		"'int main(void) {'",
		'const grades = [8, 6, 10, 7, 9];',
		'`    int ${g(index + 1)} = ${value};`',
		'`    double ${names.average} = (`',
		'`${sumHead}${g(1)} + ${g(2)} + ${g(3)}`',
		'+ ${g(4)} + ${g(5)}) / 5.0;`',
		"`    printf(\"${t('Promedio', 'Average')}: %.2f\\\\n\", ${names.average});`",
		"'    return 0;'",
		"grade: t('nota', 'grade')",
		"average: t('promedio', 'average')",
		"row: t('notas', 'grades')",
		"`${t('Promedio', 'Average')}: 8.00`",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// The lesson declares no arrays: they are only announced for the next lesson.
	assert.doesNotMatch(component, /int \w+\[|\$\{names\.row\}\[|malloc/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/datos-secuenciales-c'/);
	assert.match(component, /highlightCode\(source, 'c'\)/);
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
