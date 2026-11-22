import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/pilas-lifo-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'pilas-lifo-c';
const LESSON = 'estructuras-dinamicas-pilas';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '31-estructuras-dinamicas-pilas';
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
		['lifo', 'push', 'pop', 'empty', 'array', 'brackets'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['rule', 'push', 'pop', 'empty', 'full', 'grow', 'brackets', 'mismatch'],
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
	for (const kind of ['enter', 'exit', 'draw', 'type', 'move', 'pulse', 'camera']) assert.ok(kinds.has(kind), `uses the ${kind} cue`);
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
		// 1. What does LIFO mean?
		'solo se toca por un extremo',
		'el tope',
		'el último en entrar es el primero en salir',
		'lifo',
		'pila de platos',
		// 2. How do push and pop change the top?
		'`malloc`',
		'comprueba que no sea `null`',
		'apunta al tope anterior',
		'pasa a ser el tope',
		'copia el dato del tope',
		'el tope baja un nodo',
		'al revés de como entraron',
		// 3. What happens on an empty pop?
		'`tope == null`',
		'devuelve `false`',
		'ni hay crash',
		// 4. How does the array version grow?
		'sobre un arreglo',
		'`cantidad == capacidad`',
		'debe crecer',
		'`realloc` pide el doble',
		'`nuevos`',
		'capacidad llega a 16',
		// 5. How are brackets checked with a stack?
		'cada apertura se apila',
		'debe coincidir con el tope',
		'no coinciden',
		'está balanceada',
		// 6. Who frees each node?
		'`free(viejo)`',
		'lo libera la pila',
		'`destruir_pila` libera',
		'se libera una sola vez',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|liberá|pedí|llamás)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'touched at one end',
		'the last one in is the first one out',
		'lifo',
		'stack of plates',
		'`malloc`',
		'checks it is not `null`',
		'points to the old top',
		'becomes the top',
		'copies the top value',
		'the top moves down',
		'the reverse of how they came in',
		'`top == null`',
		'returns `false`',
		'nothing crashes',
		'on an array',
		'`count == capacity`',
		'must grow',
		'`realloc` asks for double',
		'`new_data`',
		'capacity reaches 16',
		'every opening is pushed',
		'must match the top',
		'no match',
		'the expression is balanced',
		'`free(old)`',
		'the stack frees it',
		'`destroy_stack` frees',
		'freed exactly once',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
});

test('push places a checked node on top; pop frees the top node; an empty pop is refused', () => {
	// The three nodes arrive in order, each linked to the one below, and the top arrow follows.
	const push = cuesOf('push');
	assert.deepEqual(idsOf(push, 'enter').filter((id) => /^nd-a\d$/.test(id)), ['nd-a1', 'nd-a2', 'nd-a3']);
	assert.deepEqual(idsOf(push, 'draw').filter((id) => /^lk-a\d$/.test(id)), ['lk-a2', 'lk-a3']);
	assert.deepEqual(idsOf(push, 'draw').filter((id) => /^tp-a\d$/.test(id)), ['tp-a1', 'tp-a2', 'tp-a3']);
	assert.ok(firstAt(push, 'enter', 'gta-3-open') > firstAt(push, 'exit', 'gta-3-bar'), 'the NULL check opens before the node is used');
	assert.ok(firstAt(push, 'enter', 'nv-a1') > firstAt(push, 'enter', 'nd-a1'), 'the value is stored after malloc');
	for (const k of [1, 2, 3]) assert.ok(idsOf(push, 'enter').includes(`tv-a${k}`), `the top points to node ${k}`);

	// Pop: the value is copied first, then the top moves down and the node is freed (30, 20, 10).
	const pop = cuesOf('pop');
	assert.ok(firstAt(pop, 'enter', 'ch-copy') < firstAt(pop, 'enter', 'tv-a2'), 'the value is copied before the top moves');
	assert.ok(firstAt(pop, 'enter', 'tv-a2') < firstAt(pop, 'enter', 'rl-a3'), 'the top moves before free');
	assert.deepEqual(idsOf(pop, 'exit').filter((id) => /^nd-a\d$/.test(id)), ['nd-a3', 'nd-a2', 'nd-a1']);
	assert.deepEqual(idsOf(pop, 'enter').filter((id) => /^rl-a\d$/.test(id)), ['rl-a3', 'rl-a2', 'rl-a1']);
	assert.deepEqual(idsOf(pop, 'type'), ['oa-1', 'oa-2', 'oa-3']);
	assert.ok(idsOf(pop, 'enter').includes('tv-a0'), 'the top is NULL again when the stack is empty');

	// Empty pop: the check stays closed, nothing is removed, the error code is printed.
	const empty = cuesOf('empty');
	assert.ok(idsOf(empty, 'enter').includes('gta-13-bar'));
	assert.ok(idsOf(empty, 'enter').includes('ch-null'));
	assert.ok(stopsOf(empty, 'p').includes('aa-14'), 'the flow reaches the return false');
	assert.ok(!idsOf(empty, 'exit').some((id) => /^nd-/.test(id)), 'no node is touched');
	assert.deepEqual(idsOf(empty, 'type'), ['oa-4']);
});

test('the array stack doubles its capacity through a temporary and gives the old block back', () => {
	const full = cuesOf('full');
	assert.ok(idsOf(full, 'exit').includes('ed-a'));
	assert.ok(idsOf(full, 'enter').includes('ed-b'));
	assert.deepEqual(idsOf(full, 'enter').filter((id) => /^xa-\d$/.test(id)), ['xa-0', 'xa-1', 'xa-2', 'xa-3']);
	for (const id of ['blk-xa', 'v-datos', 'v-capa', 'ch-full']) assert.ok(idsOf(full, 'enter').includes(id), `full shows ${id}`);

	const grow = cuesOf('grow');
	assert.ok(idsOf(grow, 'enter').includes('blk-xb'));
	for (const index of [4, 5, 6, 7]) assert.ok(idsOf(grow, 'enter').includes(`xq-${index}`), `cell ${index} starts uninitialized`);
	assert.ok(idsOf(grow, 'draw').includes('cp-ab'));
	assert.deepEqual(idsOf(grow, 'enter').filter((id) => /^xb-\d$/.test(id)), ['xb-0', 'xb-1', 'xb-2', 'xb-3', 'xb-4']);
	assert.ok(firstAt(grow, 'enter', 'rel-xa') > firstAt(grow, 'draw', 'cp-ab'), 'the old block is released after the copy');
	assert.ok(firstAt(grow, 'draw', 'pt-nb') < firstAt(grow, 'draw', 'pt-xb'), 'the temporary gets the address first');
	assert.ok(firstAt(grow, 'enter', 'dv-b') > firstAt(grow, 'enter', 'gtb-7-open'), 'datos changes only after the check');
	assert.ok(idsOf(grow, 'enter').includes('kv-8'));
	assert.ok(idsOf(grow, 'enter').includes('ch-fail') && idsOf(grow, 'enter').includes('ch-valid'));
	assert.deepEqual(idsOf(grow, 'type').filter((id) => /^ob-/.test(id)), ['ob-1']);
});

test('the brackets checker pushes openings, pops matching closings and frees the leftovers', () => {
	const brackets = cuesOf('brackets');
	assert.ok(idsOf(brackets, 'enter').includes('ed-c'));
	assert.deepEqual(idsOf(brackets, 'enter').filter((id) => /^nd-c\d$/.test(id)), ['nd-c1', 'nd-c2', 'nd-c3']);
	assert.deepEqual(idsOf(brackets, 'exit').filter((id) => /^nd-c\d$/.test(id)), ['nd-c3', 'nd-c2', 'nd-c1']);
	// The cursor visits the three openings and then the three closings of `{[(a + b) * c]}`.
	assert.deepEqual(stopsOf(brackets, 'cur'), ['t1-0', 't1-0', 't1-1', 't1-2', 't1-8', 't1-13', 't1-14']);
	assert.deepEqual(idsOf(brackets, 'type').filter((id) => /^oc-/.test(id)), ['oc-1']);
	assert.ok(idsOf(brackets, 'enter').includes('ch-bal'));

	// `{(a + b]`: the pop returns `(` but `]` expects `[`; the node of `{` is freed on the way out.
	const mismatch = cuesOf('mismatch');
	assert.deepEqual(stopsOf(mismatch, 'cur'), ['t2-0', 't2-0', 't2-1', 't2-7']);
	assert.deepEqual(idsOf(mismatch, 'enter').filter((id) => /^nd-c\d$/.test(id)), ['nd-c1', 'nd-c2']);
	assert.ok(firstAt(mismatch, 'enter', 'ch-mis') > firstAt(mismatch, 'enter', 'rl-c2'), 'the mismatch shows after the pop');
	assert.ok(firstAt(mismatch, 'enter', 'rl-c1') > firstAt(mismatch, 'enter', 'ch-mis'), 'the leftover node is freed after the mismatch');
	assert.ok(stopsOf(mismatch, 'p').includes('ac-13'), 'destroy_stack runs before the return');
	assert.deepEqual(idsOf(mismatch, 'type'), ['oc-2']);
	const lastShot = mismatch.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all'], 'the camera pulls back at the end');
});

test('every instruction runs on its editor line and lights its own module', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const all = script.steps.flatMap((step) => step.motion.cues);
	const lines = { a: [2, 3, 6, 7, 8, 9, 10, 13, 14, 16, 17, 18, 19, 20, 21], b: [2, 3, 5, 7, 10, 11, 13, 14, 15], c: [2, 3, 4, 5, 9, 10, 11, 13, 14, 18, 19, 20] };
	for (const [program, list] of Object.entries(lines)) {
		for (const line of list) {
			assert.ok(stopsOf(all, 'hl').includes(`ln-${line}`), `the bar reaches line ${line} of program ${program}`);
			assert.ok(stopsOf(all, 'p').includes(`a${program}-${line}`), `the flow visits the module of line ${line} of program ${program}`);
			assert.ok(idsOf(all, 'enter').includes(`m${program}-${line}`), `module ${line} of program ${program} is built`);
			assert.ok(idsOf(all, 'enter').includes(`on${program}-${line}`), `module ${line} of program ${program} lights up`);
			assert.match(component, new RegExp(`\\[${line}, '(flow|violet|magenta)'\\]`), `module spec for line ${line}`);
		}
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`file: '${id}'`)) return true;
		// Generated ids: modules, lit states, anchors, nodes, values, blocks, gates, lines, tape.
		const patterns = [
			[/^m[abc]-\d+$/, 'id: `m${prog}-${line}`'],
			[/^on[abc]-\d+$/, 'lit: `on${prog}-${line}`'],
			[/^a[abc]-\d+$/, '`a${module.prog}-${module.line}`'],
			[/^(nd|nv|rl)-[ac][123]$/, '`nd-${node.id}`'],
			[/^lk-[ac][23]$/, '`lk-${link.id}`'],
			[/^tp-[ac][123]$/, '`tp-${set.key}${k}`'],
			[/^tv-a[123]$/, 'id: `tv-a${k}`'],
			[/^tv-c[123]$/, 'id: `tv-c${k}`'],
			[/^cv-\d$/, 'id: `cv-${count}`'],
			[/^x[aqb]-\d$/, 'id: `xa-${index}`'],
			[/^blk-x[ab]$/, '`blk-${item.id}`'],
			[/^gt[ab]-\d+(-bar|-open)?$/, '`${gate.id}-bar`'],
			[/^ln-\d+$/, '`ln-${index + 1}`'],
			[/^t[12]-\d+$/, '`t${tape.n}-${char.index}`'],
			[/^cl-ap\d$/, 'id: `cl-ap${index + 1}`'],
			[/^cl-de\d$/, 'id: `cl-de${call}`'],
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
	// Cursor anchors stay inside the text they belong to.
	const stops = script.steps.flatMap((step) => step.motion.cues.filter((cue) => cue.do === 'move' && cue.el === 'cur').map((cue) => cue.to));
	for (const stop of stops) {
		const [, tape, index] = /^t([12])-(\d+)$/.exec(stop);
		assert.ok(Number(index) < { 1: '{[(a + b) * c]}', 2: '{(a + b]' }[tape].length, `${stop} is a character of its text`);
	}
});

test('the editor holds the lesson programs and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const block = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	const programs = { linked: block('linked'), arrayStack: block('arrayStack'), brackets: block('brackets') };
	assert.equal(programs.linked.length, 22, 'push and pop fit in 22 lines');
	assert.equal(programs.arrayStack.length, 16, 'the array push fits in 16 lines');
	assert.equal(programs.brackets.length, 21, 'the checker fits in 21 lines');
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the editor uses C highlighting');
	for (const fragment of [
		'${n.Node} *${n.node} = malloc(sizeof *${n.node});',
		'${n.node}->${n.next} = ${n.s}->${n.top};',
		'${n.s}->${n.top} = ${n.node};',
		'free(${n.old});',
		'${n.s}->${n.top} = ${n.old}->${n.next};',
		'${n.s}->${n.cap} == 0 ? 4 : ${n.s}->${n.cap} * 2;',
		'int *${n.newData} = realloc(${n.s}->${n.data},',
		'${n.s}->${n.data} = ${n.newData};',
		"if (*c == '(' || *c == '[' || *c == '{') {",
		'${n.cpop}(&${n.top}, &${n.opened}) ||',
		'${n.opened} != ${n.openingFor}(*c)) {',
		'bool ${n.balanced} = ${n.top} == NULL;',
		// Identifiers localized like the lesson.
		"t('pila_apilar', 'stack_push')",
		"t('pila_desapilar', 'stack_pop')",
		"t('nuevos', 'new_data')",
		"t('destruir_pila', 'destroy_stack')",
		"t('esta_balanceado', 'is_balanced')",
		// Real output of `cc -std=c23`.
		"t('Cantidad: 10, capacidad: 16', 'Count: 10, capacity: 16')",
		"t('Error: no se puede desapilar una pila vacía', 'Error: cannot pop an empty stack')",
		'"{[(a + b) * c]}": ${t(\'balanceado\', \'balanced\')}',
		'"{(a + b]": ${t(\'no balanceado\', \'not balanced\')}',
		// Short fictional addresses, four bytes per int.
		'base: 0x1000',
		'base: 0x2000',
		'index * 4',
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// Every line fits the editor (about 66 characters) in both languages.
	const names = Object.fromEntries(
		[...component.matchAll(/^\t(\w+): t\('([^']*)', '([^']*)'\),$/gm)].map(([, key, es, en]) => [key, es.length >= en.length ? es : en]),
	);
	for (const line of Object.values(programs).flat()) {
		let filled = line.trim().replace(/,$/, '');
		filled = filled.slice(1, -1);
		filled = filled.replace(/\$\{n\.(\w+)\}/g, (_, key) => names[key] ?? `?${key}?`);
		assert.doesNotMatch(filled, /\?\w+\?|\$\{/, `unfilled slot in ${line}`);
		assert.ok(filled.length <= 66, `a program line is too long (${filled.length}): ${filled}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/pilas-lifo-c'/);
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
	assert.equal((component.match(/data-slug='pilas-lifo-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
