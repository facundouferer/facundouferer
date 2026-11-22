import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/memoria-dinamica-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'memoria-dinamica-c';
const LESSON = 'memoria-dinamica';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '28-memoria-dinamica';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.ok(getAnimationsForLesson('c', LESSON).some((entry) => entry.slug === SLUG), 'the film is listed for the lesson');
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['heap', 'check', 'fill', 'grow', 'free', 'calloc'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['floors', 'malloc', 'check', 'fill', 'full', 'grow', 'free', 'calloc'],
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
		// 1. Where does dynamic memory live?
		'pila',
		'montículo (heap)',
		'hasta que llamas a `free`',
		// 2. What does malloc return, and why check NULL?
		'`malloc(capacidad * sizeof *numeros)`',
		'devuelve la dirección del bloque',
		'`malloc` devuelve `null`',
		'comportamiento indefinido',
		'cada reserva se comprueba',
		'las direcciones reales varían',
		// 3. Why sizeof *p?
		'`sizeof *numeros` en lugar de `sizeof(int)`',
		'si cambia el tipo',
		// 4. How does realloc grow the array, and why a temporary pointer?
		'`cantidad == capacidad`',
		'`realloc` pide un bloque del doble',
		'puntero temporal',
		'el bloque viejo sigue válido',
		'`numeros = realloc(numeros, ...)`',
		'perdería la única dirección',
		'otra dirección',
		'se copiaron',
		'`numeros = nuevo`',
		'`leidos: 5 (capacidad 8)`',
		// 5. What does free do?
		'`free(numeros)` devuelve el bloque',
		'puntero colgante',
		// 6. Why set the pointer to NULL after free?
		'se le asigna `null`',
		'falla de forma predecible',
		// calloc gives zeros.
		'`calloc(dias, sizeof *ventas)`',
		'bytes en cero',
		'`ventas[2] = 15`',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|liberá|pedí|llamás)\b/i);
	// Curriculum sequencing: nothing from later lessons (ownership errors, sanitizers, structures).
	assert.doesNotMatch(all, /double free|doble liberación|fuga|leak|use after free|sanitizer|valgrind|->|struct/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'stack',
		'heap',
		'until you call `free`',
		'`malloc(capacity * sizeof *numbers)`',
		'returns the address of the block',
		'`malloc` returns `null`',
		'undefined behavior',
		'every allocation is checked',
		'real addresses vary',
		'`sizeof *numbers` instead of `sizeof(int)`',
		'if the type changes',
		'`count == capacity`',
		'twice as big',
		'temporary',
		'the old block stays valid',
		'`numbers = realloc(numbers, ...)`',
		"only address",
		'another address',
		'copied',
		'`numbers = bigger`',
		'`read: 5 (capacity 8)`',
		'`free(numbers)` gives the block back',
		'dangling pointer',
		'set to `null`',
		'fails predictably',
		'`calloc(days, sizeof *sales)`',
		'every byte at zero',
		'`sales[2] = 15`',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /double free|leak|use after free|sanitizer|valgrind|->|struct/i);
});

test('the block is asked for, checked, filled, grown through a temporary and given back', () => {
	// Two separate floors: the stack frame of main and the heap.
	const floors = cuesOf('floors');
	for (const id of ['floor-stack', 'floor-heap', 'floor-prog', 'v-cap', 'v-cnt']) assert.ok(idsOf(floors, 'enter').includes(id), `floors shows ${id}`);

	// malloc reserves a block of uninitialized cells and the pointer gets its address.
	const malloc = cuesOf('malloc');
	assert.ok(idsOf(malloc, 'enter').includes('blk-a'));
	for (const index of [0, 1, 2, 3]) assert.ok(idsOf(malloc, 'enter').includes(`va-q${index}`), `cell ${index} starts uninitialized`);
	assert.ok(idsOf(malloc, 'type').includes('val-num-a'));
	assert.ok(firstAt(malloc, 'draw', 'ptr-a') > firstAt(malloc, 'enter', 'blk-a'), 'the pointer is drawn once the block exists');

	// The NULL check is a gate that only opens for a valid pointer.
	const check = cuesOf('check');
	assert.ok(idsOf(check, 'enter').includes('lb-null'));
	assert.ok(firstAt(check, 'enter', 'gt-4-open') > firstAt(check, 'exit', 'gt-4-bar'));

	// The four values fill the block, one cell at a time, while `cantidad` counts them.
	const fill = cuesOf('fill');
	assert.deepEqual(idsOf(fill, 'enter').filter((id) => /^va-\d$/.test(id)), ['va-0', 'va-1', 'va-2', 'va-3']);
	assert.deepEqual(idsOf(fill, 'enter').filter((id) => /^val-cnt-/.test(id)), ['val-cnt-1', 'val-cnt-2', 'val-cnt-3', 'val-cnt-4']);

	// Full: realloc goes through the temporary; a failure would keep the old block valid.
	const full = cuesOf('full');
	assert.ok(idsOf(full, 'enter').includes('lb-full'));
	for (const id of ['v-nuevo', 'val-nuevo-null', 'lb-fail', 'lb-valid']) assert.ok(idsOf(full, 'enter').includes(id), `full shows ${id}`);
	assert.ok(!idsOf(full, 'exit').includes('ptr-a'), 'the old pointer is untouched by the failure');

	// Success: a new block, the data copied, the old block released, then numeros = nuevo.
	const grow = cuesOf('grow');
	assert.ok(idsOf(grow, 'draw').includes('cp-ab'));
	assert.deepEqual(idsOf(grow, 'enter').filter((id) => /^vb-\d$/.test(id)), ['vb-0', 'vb-1', 'vb-2', 'vb-3', 'vb-4']);
	assert.ok(firstAt(grow, 'enter', 'rel-a') > firstAt(grow, 'draw', 'cp-ab'), 'the old block is released after the copy');
	assert.ok(firstAt(grow, 'draw', 'ptr-nb') < firstAt(grow, 'draw', 'ptr-b'), 'the temporary gets the address first');
	assert.ok(firstAt(grow, 'enter', 'val-num-b') > firstAt(grow, 'enter', 'gt-13-open'), 'numeros changes only after the check');
	assert.ok(idsOf(grow, 'enter').includes('val-cap-8'));
	assert.ok(idsOf(grow, 'type').includes('o-out'));

	// free releases the block, the pointer dangles, then it becomes NULL.
	const free = cuesOf('free');
	assert.ok(firstAt(free, 'enter', 'dg-b') > firstAt(free, 'enter', 'rel-b'));
	assert.ok(firstAt(free, 'enter', 'val-num-null') > firstAt(free, 'enter', 'dg-b'));
	assert.ok(idsOf(free, 'exit').includes('dg-b'));

	// calloc: seven zeros, one value written, the block given back; the camera pulls back.
	const calloc = cuesOf('calloc');
	assert.ok(idsOf(calloc, 'enter').includes('ed-b'));
	assert.ok(idsOf(calloc, 'exit').includes('ed-a'));
	assert.deepEqual(idsOf(calloc, 'enter').filter((id) => /^vc-\d$/.test(id)), ['vc-0', 'vc-1', 'vc-2', 'vc-3', 'vc-4', 'vc-5', 'vc-6']);
	assert.ok(idsOf(calloc, 'enter').includes('vc-15'));
	assert.deepEqual(idsOf(calloc, 'type').filter((id) => /^o-b/.test(id)), ['o-b1', 'o-b2', 'o-b3', 'o-b4', 'o-b5', 'o-b6', 'o-b7']);
	assert.ok(idsOf(calloc, 'enter').includes('rel-c'));
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
});

test('every instruction runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	for (const line of [2, 3, 4, 8, 9, 10, 11, 13, 14, 15, 17, 18, 20, 21, 22]) {
		assert.ok(stopsOf(all, 'hl').includes(`ln-${line}`), `the bar reaches line ${line}`);
		assert.ok(stopsOf(all, 'p').includes(`a-m${line}`), `the flow visits the module of line ${line}`);
		assert.ok(idsOf(all, 'enter').includes(`m-${line}`), `module ${line} is built`);
		assert.ok(idsOf(all, 'enter').includes(`on-${line}`), `module ${line} lights up`);
	}
	const calloc = cuesOf('calloc');
	for (const line of [2, 3, 4, 7, 8, 9, 11, 12]) {
		assert.ok(stopsOf(calloc, 'p').includes(`a-mb${line}`), `the flow visits the calloc module of line ${line}`);
		assert.ok(idsOf(calloc, 'enter').includes(`onb-${line}`), `calloc module ${line} lights up`);
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`file: '${id}'`)) return true;
		// Generated ids: modules, lit states, anchors, values, blocks, gates, lines.
		const patterns = [
			[/^(m|mb)-\d+$/, "moduleRow('"],
			[/^(on|onb)-\d+$/, "'on-'"],
			[/^a-mb?\d+$/, '`a-${module.id'],
			[/^(va|vb|vc)-(q)?\d+$/, 'id: `v'],
			[/^val-cnt-\d$/, 'id: `val-cnt-${count}`'],
			[/^(blk|rel)-[abc]$/, '`blk-${block.id}`'],
			[/^gtb?-\d+(-bar|-open)?$/, '`${gate.id}-bar`'],
			[/^ln-\d+$/, '`ln-${index + 1}`'],
			[/^o-b\d$/, 'id: `o-b${index + 2}`'],
		];
		return patterns.some(([pattern, marker]) => pattern.test(id) && component.includes(marker));
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
	// Every module of the growing array exists, with its editor line on its face.
	for (const line of [2, 3, 4, 8, 9, 10, 11, 13, 14, 15, 17, 18, 20, 21, 22]) {
		assert.match(component, new RegExp(`\\[${line}, '(flow|violet)'\\]`), `module spec for line ${line}`);
	}
});

test('the editor holds the lesson programs and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const growing = component.split('const growing = [')[1].split('].join')[0].trim().split('\n');
	const zeroed = component.split('const zeroed = [')[1].split('].join')[0].trim().split('\n');
	assert.equal(growing.length, 23, 'the growing array fits in 23 lines');
	assert.equal(zeroed.length, 13, 'the calloc example fits in 13 lines');
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the editor uses C highlighting');
	for (const fragment of [
		'`    int *${n.nums} = malloc(${n.cap} * sizeof *${n.nums});`',
		'`    if (${n.nums} == NULL) {`',
		'`    while (scanf("%d", &${n.value}) == 1 && ${n.value} != 0) {`',
		'`        if (${n.count} == ${n.cap}) {`',
		'`            int *${n.tmp} = realloc(${n.nums},`',
		'`            if (${n.tmp} == NULL) { free(${n.nums}); return 1; }`',
		'`            ${n.nums} = ${n.tmp};`',
		'`    free(${n.nums});`',
		'`    ${n.nums} = NULL;`',
		'`    int *${n.sales} = calloc(${n.days}, sizeof *${n.sales});`',
		'`    free(${n.sales});`',
		// Identifiers localized like the lesson.
		"t('capacidad', 'capacity')",
		"t('cantidad', 'count')",
		"t('numeros', 'numbers')",
		"t('nueva_capacidad', 'new_capacity')",
		"t('nuevo', 'bigger')",
		"t('dias', 'days')",
		"t('ventas', 'sales')",
		// Real output of `cc -std=c23` with the input 5 8 13 2 7 0.
		"t('Leidos: 5 (capacidad 8)', 'Read: 5 (capacity 8)')",
		'[0, 15, 0, 0, 0, 0]',
		"t('entrada: 5 8 13 2 7 0', 'input: 5 8 13 2 7 0')",
		// Short fictional addresses, four bytes per int.
		'base: 0x1000',
		'base: 0x2000',
		'base: 0x3000',
		'index * 4',
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// Every line fits the editor (about 66 characters) in both languages.
	const longest = {
		'${n.cap}': 'capacidad',
		'${n.count}': 'cantidad',
		'${n.nums}': 'numeros',
		'${n.value}': 'valor',
		'${n.newCap}': 'nueva_capacidad',
		'${n.tmp}': 'bigger',
		'${n.days}': 'days',
		'${n.sales}': 'ventas',
	};
	for (const line of [...growing, ...zeroed]) {
		let filled = line.trim().slice(1, -2);
		for (const [slot, value] of Object.entries(longest)) filled = filled.replaceAll(slot, value);
		filled = filled.replace(/\$\{t\('([^']*)', '[^']*'\)\}/g, '$1');
		assert.doesNotMatch(filled, /\$\{/, `unfilled slot in ${line}`);
		assert.ok(filled.length <= 66, `a program line is too long (${filled.length}): ${filled}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/memoria-dinamica-c'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');
	assert.match(component, /font-family: var\(--font-body\)/);

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.equal((component.match(/data-slug='memoria-dinamica-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
