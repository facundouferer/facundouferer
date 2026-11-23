import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/punteros-arreglos-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'punteros-arreglos-c';
const LESSON = 'punteros-arreglos-y-estructuras';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '26-punteros-arreglos-y-estructuras';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
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
		['array', 'arith', 'walk', 'call', 'struct', 'bounds'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['cells', 'step', 'index', 'walk', 'call', 'length', 'arrow', 'bounds'],
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

test('every step has a bilingual title and two or three short captions', () => {
	for (const step of script.steps) {
		assert.ok(step.subtitles.length >= 2 && step.subtitles.length <= 3, `${step.id} narrates in two or three captions`);
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
		// The array: contiguous cells, 4 bytes apart (addresses are examples).
		'int notas[5]',
		'contiguos',
		'`sizeof(int)` igual a 4',
		'0x1000',
		'de ejemplo',
		// 1. How far does p + 1 move?
		'`p + 1` no avanza un byte: avanza un elemento',
		'de 0x1000 a 0x1004',
		'se convierte en `&notas[0]`',
		// 2. Why is a[i] the same as *(a + i)?
		'`notas[2]` es `*(notas + 2)`',
		'`notas[0]` es `*(notas + 0)`',
		// The loop walks the array with the pointer.
		'`p++` avanza un elemento',
		'`suma = 34`',
		// 3. What does a function receive when you pass an array?
		'no copia el arreglo',
		'la dirección de su primer elemento',
		// 4. Why pass the length?
		'`sizeof v` mide un puntero',
		'no sabe cuántos elementos hay',
		'`size_t n`',
		'`promedio = 6.80`',
		// 5. What does -> do?
		'`p->x` es exactamente `(*p).x`',
		'`pa->x = 0`',
		'`(0, 1)`',
		// 6. Where does the array end?
		'`notas + 5` está justo después del último',
		'se puede calcular y comparar',
		'nunca desreferenciar',
		'comportamiento indefinido',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|agregá|creá)\b/i);
	// Nothing the lesson does not teach here (allocation and the stack come later).
	assert.doesNotMatch(all, /malloc|free\(|heap|\bpila\b|montículo|void \*|qsort/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'int grades[5]',
		'contiguous',
		'`sizeof(int)` equal to 4',
		'examples',
		'moves one element, `sizeof(int)` bytes, not one byte',
		'from 0x1000 to 0x1004',
		'turns into `&grades[0]`',
		'`grades[2]` is `*(grades + 2)`',
		'`grades[0]` is `*(grades + 0)`',
		'`sum = 34`',
		'copies no array',
		'the address of its first element',
		'`sizeof v` measures a pointer',
		'cannot know how many there are',
		'`size_t n`',
		'`average = 6.80`',
		'`p->x` is exactly `(*p).x`',
		'`(0, 1)`',
		'`grades + 5` is just past the last one',
		'may be computed and compared',
		'never dereferenced',
		'undefined behavior',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /malloc|free\(|heap|stack|void \*|qsort/i);
});

test('the pointer walks the array one element at a time and stops one past the end', () => {
	// The array is built as five cells; p + 1 lands on the next cell, not inside the first.
	assert.deepEqual(
		idsOf(cuesOf('cells'), 'enter').filter((id) => /^c-\d$/.test(id)),
		['c-0', 'c-1', 'c-2', 'c-3', 'c-4'],
	);
	assert.ok(idsOf(cuesOf('cells'), 'draw').includes('rule'), 'one element is measured');
	assert.deepEqual(stopsOf(cuesOf('step'), 'pin-p1'), ['a-c1']);
	assert.deepEqual(stopsOf(cuesOf('index'), 'pin-ix'), ['a-c2']);
	assert.ok(idsOf(cuesOf('index'), 'enter').includes('lit-c2'), '*(notas + 2) reads the third cell');

	// The loop: p visits every cell, each value is read, and p ends one past the end.
	const walk = cuesOf('walk');
	assert.deepEqual(stopsOf(walk, 'pin-p'), ['a-c1', 'a-c2', 'a-c3', 'a-c4', 'a-c5']);
	assert.deepEqual(
		idsOf(walk, 'enter').filter((id) => /^lit-c\d$/.test(id)),
		['lit-c0', 'lit-c1', 'lit-c2', 'lit-c3', 'lit-c4'],
	);
	assert.ok(!idsOf(walk, 'enter').includes('ghost-x'), 'the loop never reads past the end');
	assert.deepEqual(idsOf(walk, 'enter').filter((id) => id.startsWith('sv-')), ['sv-7', 'sv-11', 'sv-20', 'sv-26', 'sv-34']);
	assert.ok(firstAt(walk, 'type', 'oa-1') > firstAt(walk, 'enter', 'sv-34'), 'the sum is printed once complete');
});

test('the function receives a pointer and the length; -> follows a pointer to a member', () => {
	const call = cuesOf('call');
	for (const id of ['eb', 'fn-prom', 'v-v', 'v-n', 'v-n2', 'ch-recv']) assert.ok(idsOf(call, 'enter').includes(id), `call shows ${id}`);
	assert.ok(idsOf(call, 'draw').includes('ar-v'), 'v points to the first element');
	assert.ok(!idsOf(call, 'exit').some((id) => /^c-\d$/.test(id)), 'the array is not copied');
	const length = cuesOf('length');
	assert.ok(idsOf(length, 'enter').includes('ch-szv'), 'sizeof v is the size of a pointer');
	assert.ok(idsOf(length, 'enter').includes('ch-len'), 'the length travels as size_t');
	assert.ok(idsOf(length, 'type').includes('ob-1'));

	const arrow = cuesOf('arrow');
	assert.ok(idsOf(arrow, 'enter').includes('ec'));
	assert.ok(idsOf(arrow, 'draw').includes('ar-mp'), 'mover receives the address of a');
	assert.deepEqual(idsOf(arrow, 'enter').filter((id) => id.startsWith('sx-')), ['sx-1', 'sx-4', 'sx-0']);
	assert.ok(idsOf(arrow, 'enter').includes('pin-pa'));
	assert.ok(idsOf(arrow, 'enter').includes('ch-arrow'));
	assert.deepEqual(idsOf(arrow, 'type'), ['oc-1', 'oc-2']);
});

test('the end: one past the end is computed and compared, never dereferenced; the camera pulls back', () => {
	const bounds = cuesOf('bounds');
	assert.deepEqual(stopsOf(bounds, 'pin-p'), ['a-c5']);
	for (const id of ['ea', 'ghost', 'ch-end', 'ghost-x', 'ch-ub']) assert.ok(idsOf(bounds, 'enter').includes(id), `bounds shows ${id}`);
	assert.ok(firstAt(bounds, 'enter', 'ch-ub') > firstAt(bounds, 'enter', 'ch-end'));
	const lastShot = bounds.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
	assert.ok(idsOf(bounds, 'flow').includes('fl-walk'));
});

test('every instruction runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	const modules = ['a4', 'a5', 'a7', 'a8', 'a10', 'b13', 'b14', 'b16', 'b4', 'b7', 'b9', 'c18', 'c19', 'c9', 'c10', 'c20', 'c21', 'c22', 'c23'];
	for (const key of modules) {
		assert.ok(stopsOf(all, 'hl').includes(`ln-${key.slice(1)}`), `the bar reaches line ${key.slice(1)}`);
		assert.ok(stopsOf(all, 'px').includes(`a-m${key}`), `the flow visits module ${key}`);
		assert.ok(idsOf(all, 'enter').includes(`m-${key}`), `module ${key} is built`);
		assert.ok(idsOf(all, 'enter').includes(`on-${key}`), `module ${key} lights up`);
	}
	for (let line = 1; line <= 13; line++) assert.ok(idsOf(cuesOf('cells'), 'type').includes(`ea-${line}`), `line ${line} is typed`);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`el: '${id}'`)) return true;
		let match = id.match(/^(?:c-|lit-c)(\d)$/);
		if (match) return Number(match[1]) <= 4 && component.includes('`c-${cell.index}`') && component.includes('`lit-c${cell.index}`');
		match = id.match(/^(?:m-|on-|a-m)([abc]\d+)$/);
		if (match) return component.includes(`['${match[1]}', `) && component.includes('`m-${module.key}`') && component.includes('`a-m${module.key}`');
		match = id.match(/^a-c(\d)$/);
		if (match) return Number(match[1]) <= 5 && component.includes('`a-c${index}`');
		match = id.match(/^ln-(\d+)$/);
		if (match) return Number(match[1]) <= 25 && component.includes('`ln-${index + 1}`');
		match = id.match(/^ea-(\d+)$/);
		if (match) return Number(match[1]) <= 13 && component.includes('`${page.el}-${line.n}`');
		match = id.match(/^sv-(\d+)$/);
		if (match) return component.includes('[0, 7, 11, 20, 26, 34]') && component.includes('`sv-${value}`');
		return false;
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the editor holds the lesson programs, highlighted as C, and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const program = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.equal(program('programLoop').length, 13);
	assert.equal(program('programAverage').length, 19);
	assert.equal(program('programPoint').length, 25);
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the programs use C highlighting');
	for (const fragment of [
		"notas: t('notas', 'grades')",
		"suma: t('suma', 'sum')",
		"promedio: t('promedio', 'average')",
		"punto: t('Punto', 'Point')",
		"mover: t('mover', 'move')",
		"mostrar: t('mostrar', 'show')",
		'`    int ${id.notas}[5] = {7, 4, 9, 6, 8};`',
		'`    for (int *p = ${id.notas}; p < ${id.notas} + 5; p++) {`',
		'`        ${id.suma} += *p;`',
		'`double ${id.promedio}(const int *v, size_t n) {`',
		'`    size_t n = sizeof ${id.notas} / sizeof ${id.notas}[0];`',
		'`    printf("${id.promedio} = %.2f\\\\n", ${id.promedio}(${id.notas}, n));`',
		"'    p->x += dx;'",
		'`    struct ${id.punto} *pa = &a;`',
		"'    (*pa).x = 0;'",
		// Output, as cc -std=c23 prints it.
		'`${id.suma} = 34`',
		'`${id.promedio} = 6.80`',
		"'(4, 1)'",
		"'(0, 1)'",
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// Every line fits the editor once its identifiers are filled in, in both languages.
	const longest = { '${id.notas}': 'grades', '${id.suma}': 'suma', '${id.promedio}': 'promedio', '${id.punto}': 'Punto', '${id.mover}': 'mover', '${id.mostrar}': 'mostrar' };
	for (const line of [...program('programLoop'), ...program('programAverage'), ...program('programPoint')]) {
		let filled = line.trim().slice(1, -2);
		for (const [slot, value] of Object.entries(longest)) filled = filled.replaceAll(slot, value);
		assert.doesNotMatch(filled, /\$\{/, `unfilled slot in ${line}`);
		assert.ok(filled.length <= 64, `a program line is too long (${filled.length}): ${filled}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/punteros-arreglos-c'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');
	assert.match(component, /font-family: var\(--font-body\)/);

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.equal((component.match(/data-slug='punteros-arreglos-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
