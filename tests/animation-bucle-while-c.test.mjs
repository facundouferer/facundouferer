import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/bucle-while-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'bucle-while-c';
const LESSON = 'sentencia-while';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '11-sentencia-while';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.deepEqual(animation.tag, { es: 'C', en: 'C' });
	assert.ok(getAnimationsForLesson('c', LESSON).some((entry) => entry.slug === SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	for (const lang of ['es', 'en']) assert.ok(existsSync(`src/content/courses/c/${FILE}.${lang}.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['gate', 'zero', 'laps', 'sentinel', 'infinite', 'boundary'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['track', 'zero', 'first', 'laps', 'sentinel', 'infinite', 'count', 'off-by-one'],
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

const narration = (lang) =>
	resolveScript(script, lang)
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n')
		.toLowerCase();

test('narration answers the six questions of the brief in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// When the condition is evaluated.
		'se evalúa antes de cada vuelta',
		'iteración',
		'llave de cierre',
		// Whether the body can run zero times.
		'cero vueltas',
		'no se ejecuta',
		// What counters and accumulators do.
		'acumulador',
		'contador',
		'suma 1 por vuelta',
		'traza',
		// What a sentinel is and where the read goes.
		'centinela',
		'no un dato',
		'no se procesa',
		'antes del ciclo y al final del bloque',
		'lectura adelantada',
		// Why a loop becomes infinite.
		'actualización',
		'nunca cambia',
		'ciclo infinito',
		'ctrl+c',
		// How to catch an off-by-one.
		'seis veces para cinco vueltas',
		'error por uno',
		'la primera y la última vuelta',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// The brief asks for neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|hacé)\b/i);
});

test('narration answers the same questions in English', () => {
	const all = narration('en');
	for (const concept of [
		'evaluated before each pass',
		'iteration',
		'closing brace',
		'zero passes',
		'never runs',
		'accumulator',
		'counter',
		'adds 1 per pass',
		'trace',
		'sentinel',
		'not data',
		'not processed',
		'before the loop and at the end of the block',
		'priming read',
		'update',
		'never changes',
		'infinite loop',
		'ctrl+c',
		'six times for five passes',
		'off-by-one',
		'the first and the last pass',
	]) {
		assert.ok(all.includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
});

test('the gate decides each pass: closed at once with -1, open three passes, closed by the sentinel', () => {
	const cuesOf = (id) => script.steps.find((step) => step.id === id).motion.cues;
	const has = (id, kind, el) => cuesOf(id).some((cue) => cue.do === kind && cue.el === el);
	// Zero passes: the gate closes and no body module runs.
	assert.ok(has('zero', 'enter', 'shut-a'));
	assert.ok(!cuesOf('zero').some((cue) => cue.do === 'move' && cue.el === 'fx' && ['a-m10', 'a-m11', 'a-m12'].includes(cue.to)));
	// Each pass leaves the accumulator and the counter with the lesson's trace values.
	const shown = ['first', 'laps'].flatMap((id) => cuesOf(id).filter((cue) => cue.do === 'enter').map((cue) => cue.el));
	for (const el of ['v-suma-8', 'v-suma-14', 'v-suma-24', 'v-cant-1', 'v-cant-2', 'v-cant-3', 'tr-1', 'tr-2', 'tr-3']) assert.ok(shown.includes(el), `shows ${el}`);
	// The sentinel closes the gate and is never added: suma stays 24.
	assert.ok(has('sentinel', 'enter', 'shut-a'));
	assert.ok(!cuesOf('sentinel').some((cue) => cue.el === 'v-suma-24' && cue.do === 'exit'));
	// The infinite loop never changes i and never closes the gate.
	const inf = cuesOf('infinite');
	assert.ok(!inf.some((cue) => cue.do === 'enter' && /^v-i-[2-6]$/.test(cue.el)));
	assert.ok(!inf.some((cue) => cue.el === 'shut-b'));
	// Fixed: five passes, six checks, i leaves as 6.
	const count = cuesOf('count');
	assert.equal(count.filter((cue) => cue.do === 'enter' && /^tk-\d$/.test(cue.el)).length, 6);
	assert.ok(count.some((cue) => cue.do === 'enter' && cue.el === 'v-i-6'));
	assert.ok(count.some((cue) => cue.do === 'enter' && cue.el === 'shut-b'));
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built from lists count as present: shots, modules (`[10, onTrack` gives m-10
	// and a-m10), cells (`cell('nota',` gives c-, n- and a-top-nota), values, packets,
	// chips, ticks, trace chips, console rows, gates and editor lines.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`shotAt('${id}'`) || component.includes(`evA('${id}'`)) return true;
		const cellId = id.match(/^(?:c|n|a-top)-(.+)$/);
		if (cellId && component.includes(`cell('${cellId[1]}',`)) return true;
		const mod = id.match(/^(?:a-)?(m|mb)-?(\d+)$/);
		if (mod) {
			if (mod[1] === 'm' && mod[2] === '9') return component.includes("gate(gateA, 9, 'm-9'");
			if (mod[1] === 'mb' && mod[2] === '6') return component.includes("gate(gateB, 6, 'mb-6'");
			const list = mod[1] === 'm' ? 'spotsA' : 'spotsB';
			const block = component.slice(component.indexOf(`const ${list}`), component.indexOf('];', component.indexOf(`const ${list}`)));
			return block.includes(`[${mod[2]}, `);
		}
		if (/^(open|shut)-[ab]$/.test(id)) return component.includes('data-el={`open-${item.lit}`}') && component.includes('data-el={`shut-${item.lit}`}');
		if (/^(plate-[ab]|trk-[ab])$/.test(id)) return component.includes("id: 'trk-a'") && component.includes("id: 'trk-b'");
		if (/^v-i-[1-6]$/.test(id)) return component.includes('id: `v-i-${k}`');
		if (/^tk-[1-6]$/.test(id)) return component.includes('id: `tk-${k}`');
		if (/^tr-[1-3]$/.test(id)) return component.includes(`trace(${id.slice(3)},`);
		const editorLine = id.match(/^ln-(\d+)$/);
		return Boolean(editorLine) && Number(editorLine[1]) >= 1 && Number(editorLine[1]) <= 20;
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the code in the canvas is the lesson programs, and the output is the real one', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"'#include <stdio.h>'",
		'`    int ${names.count} = 0;`',
		'`    int ${names.sum} = 0;`',
		'`    if (scanf("%d", &${names.grade}) != 1) return 1;`',
		'`    while (${names.grade} != -1) {',
		'`        ${names.sum} = ${names.sum} + ${names.grade};`',
		'`        ${names.count} = ${names.count} + 1;`',
		'`    if (${names.count} > 0) {`',
		"`    int i = 1;              // ${t('estado inicial', 'initial state')}`",
		"`    while (i <= 5) {        // ${t('condición', 'condition')}`",
		"'        printf(\"%d\\\\n\", i);'",
		"`        i = i + 1;          // ${t('actualización', 'update')}`",
		"t('nota', 'grade')",
		"t('cantidad', 'count')",
		"t('suma', 'sum')",
		// Real output of both programs (compiled with cc -std=c23 and run).
		"t('No se ingresaron notas', 'No grades were entered')",
		"`${t('Promedio', 'Average')}: 8.00`",
		"t('Al salir, i vale 6', 'After the loop, i is 6')",
		'`$ echo "8 6 10 -1" | ${names.exeA}`',
		"highlightCode(source, 'c')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/bucle-while-c'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
