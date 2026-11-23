import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/refinamiento-anidados-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'refinamiento-anidados-c';
const LESSON = 'programacion-esquematica-y-sentencias-anidadas';
const FILE = '14-programacion-esquematica-y-sentencias-anidadas';
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
		['refine', 'translate', 'nested', 'trace', 'depends', 'exit'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['statement', 'levels', 'translate', 'table', 'trace', 'triangle', 'found', 'close'],
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
	const last = script.steps.at(-1).motion.cues;
	assert.ok(last.some((cue) => cue.do === 'camera' && cue.to === 'all'), 'the film ends on a pull-back');
});

test('the particle and the editor bar never start a move before the previous one ends', () => {
	for (const step of script.steps) {
		for (const el of ['p', 'hl']) {
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
		console.log(`${SLUG} ${lang}: ${Math.round(total / 100) / 10} s`);
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
		// What is stepwise refinement?
		'refinamiento sucesivo',
		'de lo general a lo particular',
		'nivel 1',
		'el nivel 2 descompone cada paso',
		// How does pseudocode become C?
		'traducción directa a c',
		'se vuelve una instrucción',
		// How many times does the inner body run?
		'el interno se ejecuta completo en cada vuelta del externo',
		'5 × 5 = 25 veces',
		// How do i and j change?
		'solo cambia cuando el interno terminó',
		'vuelve a empezar desde 1',
		// How can the inner loop depend on the outer one?
		'depender de la variable del externo',
		'1 + 2 + 3 + 4 = 10',
		// How do you leave two loops cleanly?
		'`break` sale solo del ciclo de `j`',
		'`!encontrado` corta también el externo',
		'variable de control',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'stepwise refinement',
		'from the general to the specific',
		'level 2 breaks each step',
		'direct translation into c',
		'becomes a statement',
		'runs completely on each pass of the outer one',
		'5 × 5 = 25 times',
		'only changes when the inner loop has finished',
		'starts again from 1',
		'depend on the outer variable',
		'1 + 2 + 3 + 4 = 10',
		'`break` leaves only the `j` loop',
		'`!found` ends the outer loop too',
		'control variable',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

test('the trace follows the lesson: i waits for the inner loop, j restarts, the flag ends both loops', () => {
	const cues = Object.fromEntries(script.steps.map((step) => [step.id, step.motion.cues]));
	const entered = (id) => cues[id].filter((cue) => cue.do === 'enter').map((cue) => cue.el);
	// Row 1 of the table fills cell by cell before i changes.
	assert.deepEqual(
		entered('table').filter((el) => /^g-1-/.test(el)),
		['g-1-1', 'g-1-2', 'g-1-3', 'g-1-4', 'g-1-5'],
	);
	assert.ok(!entered('table').includes('iv-2'), 'i stays 1 during the first row');
	const iv2 = cues.trace.find((cue) => cue.do === 'enter' && cue.el === 'iv-2').at;
	const jv1 = cues.trace.find((cue) => cue.do === 'enter' && cue.el === 'jv-1').at;
	assert.ok(jv1 > iv2, 'j restarts at 1 after i becomes 2');
	assert.deepEqual(
		entered('trace').filter((el) => /^g-r/.test(el)),
		['g-r3', 'g-r4', 'g-r5'],
	);
	assert.deepEqual(
		entered('triangle').filter((el) => /^tr-/.test(el)),
		['tr-1', 'tr-2', 'tr-3', 'tr-4'],
	);
	// The flag turns true before break, and the outer condition is read after it.
	const at = (el) => cues.found.find((cue) => cue.do === 'enter' && cue.el === el).at;
	assert.ok(at('fv-1') < at('hx-15'));
	assert.ok(at('hx-15') < at('lb-gate'));
	assert.ok(at('lb-gate') < cues.found.find((cue) => cue.do === 'type' && cue.el === 'out-f1').at);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const tileLines = new Set((component.match(/tiles: \[\[[^\n]*\]\] \}/g) ?? []).flatMap((row) => row.match(/\d+/g).map(Number)));
	const moduleKey = (key) =>
		/^p\d+$/.test(key) ? tileLines.has(Number(key.slice(1))) : component.includes(`station('${key}', ${key.slice(1)},`);
	const generated = [
		[/^(m|on|a)-(\w+)$/, (m) => moduleKey(m[2])],
		[/^r[0-3]$/, () => component.includes('id: `r${r}`')],
		[/^sp-[0-3]$/, () => component.includes('id: `sp-${r}`')],
		[/^tl-(\d)-(\d)$/, () => component.includes('id: `tl-${r}-${index}`')],
		[/^(iv|jv)-[1-9]$/, () => component.includes('`${counter.prefix}-${value}`')],
		[/^g-[12]-[1-5]$/, () => component.includes('`g-${cell.row}-${cell.col}`')],
		[/^g-r[3-5]$/, () => component.includes('`g-r${row}`')],
		[/^o-[12]-[1-5]$/, () => component.includes('`o-${row}-${col}`')],
		[/^o-r[3-5]$/, () => component.includes('`o-r${row}`')],
		[/^tr-[1-4]$/, () => component.includes('`tr-${row}`')],
		[/^ot-[1-4]$/, () => component.includes('`ot-${row}`')],
		[/^out-p[1-3]$/, () => component.includes('`out-p${index + 1}`')],
		[/^ln-(\d+)$/, (m) => Number(m[1]) <= 26 && component.includes('`ln-${n}`')],
	];
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		return generated.some(([pattern, check]) => {
			const match = id.match(pattern);
			return match ? check(match) : false;
		});
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the code in the canvas is the lesson pseudocode, its programs and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'leer n y validarlo'",
		"'para cada número de 2 a n'",
		"'    para d desde 2 mientras d * d <= k'",
		"'    for d from 2 while d * d <= k'",
		"'    if (scanf(\"%d\", &n) != 1 || n < 2 || n > 1000) {'",
		"'    for (int k = 2; k <= n; k++) {'",
		"'        for (int d = 2; d * d <= k; d++) {'",
		'`        bool ${names.isPrime} = true;`',
		"'    for (int i = 1; i <= 5; i++) {'",
		"'        for (int j = 1; j <= 5; j++) {'",
		"'            printf(\"%d\\\\t\", i * j);'",
		'`        for (int col = 1; col <= ${names.row}; col++) {`',
		'`    for (int i = 1; i <= 9 && !${names.found}; i++) {`',
		"isPrime: t('es_primo', 'is_prime')",
		"row: t('fila', 'row')",
		"found: t('encontrado', 'found')",
		"t('Hay 8 primos entre 2 y 20', 'There are 8 primes between 2 and 20')",
		"'2 3 5 7 11 13 17 19'",
		"const foundOutput = '42 = 6 x 7';",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// No functions beyond main: they are only announced (lesson 15), as the lesson does.
	assert.doesNotMatch(component, /'(int|bool|void) (?!main)\w+\(/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/refinamiento-anidados-c'/);
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
