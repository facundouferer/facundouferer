import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/operaciones-arreglos-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'operaciones-arreglos-c';
const LESSON = 'operaciones-con-arreglos';
const FILE = '20-operaciones-con-arreglos';
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
		['traverse', 'max', 'insert', 'full', 'delete', 'reverse'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['build', 'sum', 'max', 'insert', 'count', 'full', 'delete', 'reverse'],
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

test('the particle, the editor bar and the cursors never start a move before the previous one ends', () => {
	for (const step of script.steps) {
		for (const el of ['p', 'hl', 'cur', 'cur2']) {
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

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// How does a traversal accumulate?
		'visita cada celda',
		'eso es recorrer',
		'`suma += v[i]` acumula',
		// How is the maximum tracked?
		'el primer elemento, `v[0]`',
		'así sigue el máximo',
		// Why does insertion shift from the end?
		'corre los elementos a la derecha, desde el final',
		'ningún valor se pisa antes de moverse',
		// Why does deletion shift left?
		'se corren a la izquierda',
		'cierran el hueco',
		// Who updates n and why?
		'`n` llegó por valor',
		'el llamador quien hace `n++`',
		'el llamador hace `n--`',
		// What happens when the array is full?
		'igual a la capacidad',
		'fuera del límite',
		'devuelve `false`',
		// Reversing with two indexes.
		'dos índices',
		'`n / 2`',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'visits every cell',
		'that is a traversal',
		'`total += v[i]` accumulates',
		'the first element, `v[0]`',
		'tracks the maximum',
		'shifts the elements right, from the end',
		'no value is overwritten before it moves',
		'shift left',
		'close the gap',
		'`n` arrived by value',
		'the caller is the one that does `n++`',
		'the caller does `n--`',
		'equals the capacity',
		'past the end',
		'returns `false`',
		'two indexes',
		'`n / 2`',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

test('the array goes through the lesson states and only main changes n', () => {
	const cues = Object.fromEntries(script.steps.map((step) => [step.id, step.motion.cues]));
	const entered = (id) => cues[id].filter((cue) => cue.do === 'enter' && /^v\d-/.test(cue.el)).map((cue) => cue.el);
	// Insertion shifts from the end toward pos, then writes the value.
	assert.deepEqual(entered('insert'), ['v4-40', 'v3-30', 'v2-20', 'v1-99']);
	// The refused insertion never touches a cell.
	assert.deepEqual(entered('full'), []);
	// Deletion shifts from pos toward the end.
	assert.deepEqual(entered('delete'), ['v0-99', 'v1-20', 'v2-30', 'v3-40']);
	// Reversing swaps the outer pair, then the inner one, and stops at n / 2.
	assert.deepEqual(entered('reverse'), ['v0-40', 'v3-99', 'v1-30', 'v2-20']);
	// n changes only in the steps where the caller runs n++ and n--.
	for (const [id, list] of Object.entries(cues)) {
		const touches = list.some((cue) => cue.do === 'enter' && /^n-\d$/.test(cue.el));
		assert.equal(touches, ['build', 'count', 'delete'].includes(id), `${id} ${touches ? 'changes' : 'keeps'} n`);
	}
	// The accumulator and the maximum change state on their own chip.
	assert.deepEqual(
		cues.sum.filter((cue) => cue.do === 'enter' && /^s-/.test(cue.el)).map((cue) => cue.el),
		['s-0', 's-10', 's-30', 's-60', 's-100'],
	);
	assert.deepEqual(
		cues.max.filter((cue) => cue.do === 'enter' && /^x-/.test(cue.el)).map((cue) => cue.el),
		['x-10', 'x-20', 'x-30', 'x-40'],
	);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`m-${...}`) or listed in the frontmatter (`id: 'f-sum'`) count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`el: '${id}'`)) return true;
		const prefix = id.replace(/[\d-]+$/, '');
		return prefix !== id && (component.includes('`' + prefix + '${') || component.includes('`' + prefix + '-${'));
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the code in the canvas is the lesson functions and the real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'#include <stdio.h>'",
		'`#define ${names.cap} 5`',
		'`int ${names.sum}(const int v[], size_t n) {`',
		'`        ${names.total} += v[i];`',
		'`int ${names.max}(const int v[], size_t n) {`',
		'`    int ${names.largest} = v[0];`',
		'`    if (n >= ${names.capacity} || pos > n) {`',
		"'    for (size_t i = n; i > pos; i--) {'",
		"'        v[i] = v[i - 1];'",
		'`bool ${names.remove}(int v[], size_t n, size_t pos) {`',
		"'    for (size_t i = pos; i + 1 < n; i++) {'",
		"'        v[i] = v[i + 1];'",
		"'    for (size_t i = 0; i < n / 2; i++) {'",
		'`    if (${names.insert}(${names.data}, n, ${names.cap}, 1, 99)) {`',
		"'        n++;'",
		"'        n--;'",
		"sum: t('sumar', 'sum')",
		"max: t('maximo', 'maximum')",
		"insert: t('insertar', 'insert')",
		"remove: t('eliminar', 'delete_at')",
		"reverse: t('invertir', 'reverse')",
		"total: t('suma', 'total')",
		"largest: t('mayor', 'largest')",
		"t('Suma: 100, máximo: 40', 'Sum: 100, maximum: 40')",
		"'10 99 20 30 40'",
		"t('Lleno', 'Full')}: n = 5",
		"'99 20 30 40'",
		"'40 30 20 99'",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// Before pointers: cells show indexes, no pointer code or arrows.
	assert.doesNotMatch(component, /int \*|&\$\{names|\w->/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/operaciones-arreglos-c'/);
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
