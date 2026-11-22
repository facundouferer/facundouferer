import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/duracion-ciclo-vida-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'duracion-ciclo-vida-c';
const LESSON = 'duracion-y-ciclo-de-vida';
const FILE = '27-duracion-y-ciclo-de-vida';
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
		['regions', 'automatic', 'static', 'dangling', 'undefined', 'fix'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['map', 'call', 'again', 'address', 'vanish', 'read', 'fix', 'whole'],
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

test('narration answers the five questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// 1. When is an automatic variable born and when does it die?
		'duración automática',
		'nace en su declaración',
		'en la llave de cierre, `local` muere',
		'marco',
		'pila',
		// 2. Where do static variables live and for how long?
		'zona estática',
		'duración estática',
		'antes de `main`',
		'conserva su valor entre llamadas',
		'vive todo el programa',
		'globales',
		// 3. What is a dangling pointer?
		'`&resultado`',
		'puntero colgante',
		'cuyo tiempo de vida ya terminó',
		'las reales varían',
		// 4. Why may it seem to work?
		'nadie reutilizó esa memoria',
		'parece funcionar',
		'comportamiento indefinido',
		// 5. How to fix the example?
		'devolver por valor',
		'se copia en `valor`',
		'solo mientras el objeto al que apunta está vivo',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|agregá|creá)\b/i);
	// Allocated storage belongs to the next lesson: it is only named.
	assert.doesNotMatch(all, /malloc|calloc|realloc|free\(/);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'automatic storage duration',
		'born at its declaration',
		'at the closing brace, `local` dies',
		'static storage',
		'static storage duration',
		'keeps its value between calls',
		'lives for the whole program',
		'globals',
		'`&result`',
		'dangling pointer',
		'whose lifetime has ended',
		'real ones vary',
		'nobody has reused that memory',
		'seems to work',
		'undefined behavior',
		'return by value',
		'copied into `value`',
		'valid only while the object it points to is alive',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /malloc|calloc|realloc|free\(/);
});

test('frames are pushed on a call and popped on return; static lasts the whole program', () => {
	// The static cell is already there before main runs.
	const map = cuesOf('map');
	assert.ok(idsOf(map, 'enter').includes('c-veces'));
	assert.ok(!idsOf(map, 'enter').includes('fr-main'), 'main has not started yet');

	// One call: a frame above main; local is born at line 5 and dies at the brace of line 9.
	const call = cuesOf('call');
	assert.ok(firstAt(call, 'enter', 'fr-call') > firstAt(call, 'enter', 'fr-main'));
	assert.ok(firstAt(call, 'enter', 'c-local') > firstAt(call, 'enter', 'fr-call'));
	assert.ok(idsOf(call, 'enter').includes('v-local-0'));
	const atNine = call.find((cue) => cue.do === 'move' && cue.el === 'hl' && cue.to === 'ln-9').at;
	assert.ok(firstAt(call, 'exit', 'c-local') > atNine, 'local dies at the closing brace');
	assert.ok(firstAt(call, 'exit', 'fr-call') >= firstAt(call, 'exit', 'c-local'));
	assert.ok(!idsOf(call, 'exit').includes('c-veces'), 'veces survives the return');

	// Two more calls: a new local each time, veces counts 1, 2, 3; it dies only when the program ends.
	const again = cuesOf('again');
	assert.equal(idsOf(again, 'enter').filter((id) => id === 'c-local').length, 2);
	for (const n of [2, 3]) assert.ok(idsOf(again, 'enter').includes(`v-veces-${n}`));
	assert.deepEqual(idsOf([...call, ...again], 'type'), ['oa-1', 'oa-2', 'oa-3']);
	assert.ok(firstAt(again, 'exit', 'c-veces') > firstAt(again, 'exit', 'fr-main'), 'veces outlives main');
});

test('the pointer dangles once the frame is popped, and the fix copies the value', () => {
	const address = cuesOf('address');
	assert.ok(idsOf(address, 'enter').includes('hx-5'), 'the line returning &resultado is marked');
	assert.ok(idsOf(address, 'draw').includes('arrow'));

	const vanish = cuesOf('vanish');
	assert.ok(firstAt(vanish, 'exit', 'c-res') < firstAt(vanish, 'enter', 'ghost'));
	assert.ok(idsOf(vanish, 'exit').includes('fr-call'));
	assert.ok(!idsOf(vanish, 'exit').includes('c-p'), 'p keeps its address');
	assert.ok(idsOf(vanish, 'enter').includes('arrow-x'));

	const read = cuesOf('read');
	assert.ok(idsOf(read, 'enter').includes('hx-10'));
	assert.deepEqual(stopsOf(read, 'fx'), ['a-ghost', 'a-main'], 'reading *p goes to the dead cell');
	assert.ok(idsOf(read, 'type').includes('ob-1'));
	assert.ok(firstAt(read, 'enter', 'c-other') > firstAt(read, 'type', 'ob-1'), 'the space is reused after the lucky read');

	const fix = cuesOf('fix');
	for (const n of [3, 5, 9, 10]) {
		assert.ok(idsOf(fix, 'exit').includes(`eb-${n}`));
		assert.ok(idsOf(fix, 'type').includes(`ef-${n}`));
	}
	assert.deepEqual(stopsOf(fix, 'copy'), ['a-valor']);
	assert.ok(firstAt(fix, 'enter', 'v-valor') < firstAt(fix, 'exit', 'c-res'), 'the value is copied before resultado dies');
	assert.ok(!idsOf(fix, 'enter').includes('arrow'), 'no pointer in the fix');

	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
});

test('the editor bar visits every executed line of both programs', () => {
	const all = (ids) => cuesOf(...ids);
	const first = stopsOf(all(['map', 'call', 'again']), 'hl');
	for (const n of [3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16]) assert.ok(first.includes(`ln-${n}`), `contar.c line ${n}`);
	const second = stopsOf(all(['address', 'vanish', 'read', 'fix', 'whole']), 'hl');
	for (const n of [3, 4, 5, 6, 8, 9, 10, 11, 12]) assert.ok(second.includes(`ln-${n}`), `doble.c line ${n}`);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		if (/^v-veces-[0-3]$/.test(id)) return component.includes('`v-veces-${n}`');
		if (/^ln-\d+$/.test(id)) return component.includes('data-anchor={`ln-${entry.n}`}') && Number(id.slice(3)) <= 16;
		if (/^ea-\d+$/.test(id)) return component.includes('data-el={`ea-${entry.n}`}') && Number(id.slice(3)) <= 16;
		if (/^eb-\d+$/.test(id)) return component.includes('data-el={`eb-${entry.n}`}') && Number(id.slice(3)) <= 12;
		if (/^ef-\d+$/.test(id)) return component.includes('data-el={`ef-${entry.n}`}') && [3, 5, 9, 10].includes(Number(id.slice(3)));
		if (/^hx-\d+$/.test(id)) return component.includes('data-el={`hx-${n}`}') && [5, 10].includes(Number(id.slice(3)));
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

test('the editor holds the lesson programs and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"count: t('contar', 'count')",
		"times: t('veces', 'times')",
		"double: t('calcular_doble', 'compute_double')",
		"result: t('resultado', 'result')",
		'`    static int ${names.times} = 0;`',
		"'    int local = 0;'",
		'`    return ${names.times} * 10 + local;`',
		'`int *${names.double}(int n) {`',
		'`    return &${names.result};',
		'`    int *p = ${names.double}(21);`',
		'`    return ${names.result};',
		'`    int ${names.value} = ${names.double}(21);`',
		"{ id: 'oa-1', row: 0, text: '11' }",
		"{ id: 'oa-2', row: 1, text: '21' }",
		"{ id: 'oa-3', row: 2, text: '31' }",
		"{ id: 'ob-1', row: 0, text: '42' }",
		"{ id: 'oc-1', row: 0, text: '42' }",
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the programs use C highlighting');

	// Every line fits the editor (about 64 characters) in both languages.
	const programs = component.split('const programA = [')[1].split('const FIXED_LINES')[0];
	const longest = {
		'${names.count}': 'contar',
		'${names.times}': 'veces',
		'${names.double}': 'compute_double',
		'${names.result}': 'resultado',
		'${names.value}': 'valor',
		"${t('muere al volver', 'dies on return')}": 'muere al volver',
		"${t('usa un puntero colgante', 'uses a dangling pointer')}": 'uses a dangling pointer',
		"${t('se copia el valor', 'the value is copied')}": 'the value is copied',
	};
	for (const raw of programs.split('\n').filter((row) => /^\s*['`].*['`],$/.test(row))) {
		let filled = raw.trim().slice(1, -2);
		for (const [slot, value] of Object.entries(longest)) filled = filled.replaceAll(slot, value);
		assert.doesNotMatch(filled, /\$\{/, `unfilled slot in ${raw}`);
		assert.ok(filled.length <= 62, `a program line is too long (${filled.length}): ${filled}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/duracion-ciclo-vida-c'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.doesNotMatch(component, /<filter|filter:/, 'no SVG filters');
	assert.match(component, /font-family: var\(--font-body\)/);

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line) && !line.includes('#include'));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the films');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	assert.equal((component.match(/data-slug='duracion-ciclo-vida-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
