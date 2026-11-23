import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/cadenas-terminador-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'cadenas-terminador-c';
const LESSON = 'cadenas-de-caracteres-y-operaciones';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '21-cadenas-de-caracteres-y-operaciones';
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
		['array', 'measure', 'read', 'overflow', 'safe', 'compare'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['fill', 'capacity', 'length', 'fgets', 'newline', 'overflow', 'safe', 'compare'],
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
		console.log(`${SLUG} (${lang}): ${(total / 1000).toFixed(1)} s`);
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
		// 1. What marks the end of a string?
		'`char saludo[10]`',
		"el terminador: la marca que indica dónde termina el texto",
		"se detiene en `'\\0'`",
		// 2. Capacity versus length.
		'la capacidad es 10, fija desde la declaración',
		'longitud `l` necesita capacidad `l + 1`',
		// 3. What does strlen count?
		"`strlen` cuenta los caracteres que hay antes de `'\\0'`: la longitud es 4",
		// 4. What does fgets keep?
		'recibe la capacidad: guarda como mucho 49 caracteres',
		"también guarda el `'\\n'` del enter",
		'`strcspn(linea, "\\n")`',
		'quita el salto de línea',
		'`leíste "ana paz" (7 caracteres)`',
		// 5. Why can strcpy overflow?
		'`strcpy` no conoce la capacidad del destino',
		'fuera del límite',
		'comportamiento indefinido',
		'desbordamiento',
		// 6. How does snprintf keep the copy safe?
		"`snprintf` recibe la capacidad: escribe 5 letras y siempre termina con `'\\0'`",
		'habría escrito',
		'`no entra completo; se guardó "bienv"`',
		// Comparing with strcmp.
		'`==` no compara letras',
		'carácter por carácter',
		'devuelve 0',
		'`clave correcta`',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|agregá|creá)\b/i);
	// Nothing the lesson does not teach here (pointers come later).
	assert.doesNotMatch(all, /puntero|malloc|heap|montículo|\bpila\b|strlcpy|\bgets\(/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'`char greeting[10]`',
		'the terminator: the mark that says where the text ends',
		"stops at `'\\0'`",
		'the capacity is 10, fixed when declared',
		'length `l` needs capacity `l + 1`',
		"`strlen` counts the characters that come before `'\\0'`: the length is 4",
		'it receives the capacity: it stores at most 49 characters',
		"it also keeps the `'\\n'` from enter",
		'removes the newline',
		'`you typed "ana paz" (7 characters)`',
		"`strcpy` does not know the destination's capacity",
		'past the bound',
		'undefined behavior',
		'buffer overflow',
		"`snprintf` receives the capacity: it writes 5 letters and always ends with `'\\0'`",
		'would have written',
		'`it does not fit; stored "welco"`',
		'character by character',
		'returns 0',
		'`correct key`',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, /pointer|malloc|heap|stack|strlcpy|\bgets\(/i);
});

test('the terminator closes the string, printf and strlen stop there', () => {
	const fill = cuesOf('fill');
	assert.deepEqual(
		idsOf(fill, 'enter').filter((id) => /^c-\d+$/.test(id)),
		['c-0', 'c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6', 'c-7', 'c-8', 'c-9'],
	);
	assert.deepEqual(idsOf(fill, 'enter').filter((id) => /^g-h-\d$/.test(id)).slice(0, 5), ['g-h-0', 'g-h-1', 'g-h-2', 'g-h-3', 'g-h-4']);
	assert.ok(firstAt(fill, 'enter', 'ch-term') > firstAt(fill, 'enter', 'g-h-4'));

	const capacity = cuesOf('capacity');
	assert.ok(idsOf(capacity, 'draw').includes('fl-read'), 'printf reads up to the terminator');
	assert.ok(idsOf(capacity, 'draw').includes('cap-h'), 'sizeof measures the whole array');
	assert.deepEqual(idsOf(capacity, 'type'), ['oa-1', 'oa-2']);

	// strlen counts four cells and stops on the terminator without counting it.
	const length = cuesOf('length');
	assert.deepEqual(stopsOf(length, 'px').filter((to) => to.startsWith('a-c')), ['a-c0', 'a-c1', 'a-c2', 'a-c3', 'a-c4']);
	assert.deepEqual(idsOf(length, 'enter').filter((id) => id.startsWith('cnt-')), ['cnt-1', 'cnt-2', 'cnt-3', 'cnt-4']);
	assert.ok(!idsOf(length, 'enter').includes('lit-4'), 'the terminator is not counted');
	assert.ok(idsOf(length, 'draw').includes('len-h'));
	assert.deepEqual(idsOf(length, 'type'), ['oa-3']);
});

test('fgets keeps the newline and the lesson replaces it with the terminator', () => {
	const read = cuesOf('fgets');
	assert.deepEqual(idsOf(read, 'type'), ['ob-1', 'ob-in']);
	assert.ok(firstAt(read, 'enter', 'g-f-7') > firstAt(read, 'enter', 'g-f-6'), 'the newline comes after the letters');
	assert.ok(firstAt(read, 'enter', 'g-f-8') > firstAt(read, 'enter', 'g-f-7'), 'and the terminator after the newline');
	const newline = cuesOf('newline');
	assert.ok(idsOf(newline, 'draw').includes('fl-scan'));
	assert.ok(idsOf(newline, 'exit').includes('g-f-7') && idsOf(newline, 'enter').includes('g-f-7z'), 'the same cell changes from newline to terminator');
	assert.ok(firstAt(newline, 'type', 'ob-2') > firstAt(newline, 'enter', 'g-f-7z'));
});

test('strcpy writes past the capacity; snprintf truncates and keeps the terminator', () => {
	const overflow = cuesOf('overflow');
	for (const id of ['ec', 'lb-destino', 'nb', 'err-c5', 'ch-nocap', 'ch-ub']) assert.ok(idsOf(overflow, 'enter').includes(id), `overflow shows ${id}`);
	assert.ok(idsOf(overflow, 'draw').includes('cap-d'));
	assert.deepEqual(idsOf(overflow, 'enter').filter((id) => id.startsWith('sp-')), ['sp-0', 'sp-1', 'sp-2', 'sp-3', 'sp-end']);
	assert.ok(firstAt(overflow, 'enter', 'sp-0') > firstAt(overflow, 'enter', 'g-o-5'), 'it spills once the array is full');
	assert.deepEqual(idsOf(overflow, 'type'), [], 'undefined behavior prints nothing reliable');

	const safe = cuesOf('safe');
	assert.ok(idsOf(safe, 'exit').includes('sp-end'), 'the neighbouring memory is left alone');
	assert.deepEqual(idsOf(safe, 'enter').filter((id) => id.startsWith('g-s-')), ['g-s-0', 'g-s-1', 'g-s-2', 'g-s-3', 'g-s-4', 'g-s-5']);
	assert.ok(!idsOf(safe, 'enter').some((id) => id.startsWith('sp-')), 'snprintf never writes past the capacity');
	assert.ok(idsOf(safe, 'enter').includes('ch-ret'));
	assert.deepEqual(idsOf(safe, 'type'), ['od-1']);
});

test('strcmp compares pair by pair up to the terminators; the camera pulls back', () => {
	const compare = cuesOf('compare');
	for (const id of ['ee', 'arr-clave', 'arr-lit', 'ch-eq', 'kq-end', 'ch-zero']) assert.ok(idsOf(compare, 'enter').includes(id), `compare shows ${id}`);
	const pairs = idsOf(compare, 'enter').filter((id) => id.startsWith('kq-'));
	assert.deepEqual(pairs, ['kq-0', 'kq-1', 'kq-2', 'kq-3', 'kq-4', 'kq-5', 'kq-6', 'kq-end']);
	assert.deepEqual(idsOf(compare, 'type'), ['oe-1']);
	const lastShot = compare.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
	assert.ok(idsOf(compare, 'flow').includes('fl-cmp'));
});

test('every instruction runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	const modules = ['a5', 'a7', 'a8', 'a9', 'b5', 'b7', 'b8', 'b12', 'b13', 'c4', 'c5', 'd4', 'd6', 'd8', 'd9', 'e5', 'e7', 'e8'];
	for (const key of modules) {
		assert.ok(stopsOf(all, 'hl').includes(`ln-${key.slice(1)}`), `the bar reaches line ${key.slice(1)}`);
		assert.ok(stopsOf(all, 'px').includes(`a-m${key}`), `the flow visits module ${key}`);
		assert.ok(idsOf(all, 'enter').includes(`m-${key}`), `module ${key} is built`);
		assert.ok(idsOf(all, 'enter').includes(`on-${key}`), `module ${key} lights up`);
	}
	for (let line = 1; line <= 11; line++) assert.ok(idsOf(cuesOf('fill'), 'type').includes(`ea-${line}`), `line ${line} is typed`);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`el: '${id}'`)) return true;
		let match = id.match(/^(?:c-|lit-|a-c)(\d+)$/);
		if (match) return Number(match[1]) <= 11 && component.includes('`c-${cell.index}`') && component.includes('`lit-${cell.index}`');
		match = id.match(/^(?:m-|on-|a-m)([a-e]\d+)$/);
		if (match) return component.includes(`['${match[1]}', `) && component.includes('`m-${module.key}`') && component.includes('`a-m${module.key}`');
		match = id.match(/^ln-(\d+)$/);
		if (match) return Number(match[1]) <= 16 && component.includes('`ln-${index + 1}`');
		match = id.match(/^ea-(\d+)$/);
		if (match) return Number(match[1]) <= 11 && component.includes('`${page.el}-${row.n}`');
		match = id.match(/^cnt-([1-4])$/);
		if (match) return component.includes('`cnt-${count}`');
		match = id.match(/^g-([hfos])-(\d)(z?)$/);
		if (match) return component.includes(`letters('g-${match[1]}'`) || component.includes(`'g-${match[1]}-`) || component.includes(`\`g-${match[1]}-`);
		match = id.match(/^(sp-[0-3]|sp-end|kq-[0-6]|kq-end)$/);
		if (match) return component.includes('`sp-${offset}`') && component.includes("'sp-end'") && component.includes('`kq-${cell.index}`') && component.includes("'kq-end'");
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
	assert.equal(program('programCapacity').length, 11);
	assert.equal(program('programLine').length, 16);
	assert.equal(program('programOverflow').length, 7);
	assert.equal(program('programSafe').length, 13);
	assert.equal(program('programCompare').length, 11);
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the programs use C highlighting');
	for (const fragment of [
		"saludo: t('saludo', 'greeting')",
		"hola: t('Hola', 'Code')",
		"linea: t('linea', 'line')",
		"destino: t('destino', 'destination')",
		"bienvenido: t('Bienvenido', 'Welcome')",
		"escritos: t('escritos', 'written')",
		"clave: t('clave', 'key')",
		"secreto: t('secreto', 'secret')",
		'`    char ${id.saludo}[10] = "${id.hola}";`',
		'`    printf("${id.longitud}: %zu\\\\n", strlen(${id.saludo}));`',
		'`    if (fgets(${id.linea}, sizeof ${id.linea}, stdin) == NULL) {`',
		'`    ${id.linea}[strcspn(${id.linea}, "\\\\n")] = \'\\\\0\';`',
		'`    strcpy(${id.destino}, "${id.bienvenido}");`',
		'`    int ${id.escritos} = snprintf(${id.destino}, sizeof ${id.destino},`',
		'`    if (strcmp(${id.clave}, "${id.secreto}") == 0) {`',
		// Output, as cc -std=c23 prints it (the user types "Ana Paz").
		"const INPUT = 'Ana Paz';",
		'`${id.capacidad}: 10`',
		'`${id.longitud}: 4`',
		'`${id.leiste} "${INPUT}" (${INPUT.length} ${id.caracteres})`',
		'`${id.noEntra} "${id.bienvenido.slice(0, 5)}"`',
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// Every line fits the editor once its identifiers are filled in, in both languages.
	const values = (lang) =>
		Object.fromEntries(
			[...component.split('const id = {')[1].split('};')[0].matchAll(/(\w+): t\('([^']*)', '([^']*)'\)/g)].map((m) => [`\${id.${m[1]}}`, lang === 'es' ? m[2] : m[3]]),
		);
	for (const lang of ['es', 'en']) {
		const slots = values(lang);
		for (const name of ['programCapacity', 'programLine', 'programOverflow', 'programSafe', 'programCompare']) {
			for (const line of program(name)) {
				let filled = line.trim().slice(1, -2);
				for (const [slot, value] of Object.entries(slots)) filled = filled.replaceAll(slot, value);
				assert.doesNotMatch(filled, /\$\{/, `unfilled slot in ${line}`);
				assert.ok(filled.length <= 64, `a program line is too long in ${lang} (${filled.length}): ${filled}`);
			}
		}
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/cadenas-terminador-c'/);
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
	assert.equal((component.match(/data-slug='cadenas-terminador-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
