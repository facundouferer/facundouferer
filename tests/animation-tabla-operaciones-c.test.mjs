import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/tabla-operaciones-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'tabla-operaciones-c';
const LESSON = 'polimorfismo-y-herencia-simulados-en-c';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '44-polimorfismo-y-herencia-simulados-en-c';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

// The instructions that have a module, per program (the editor lines they sit on).
const MODULES = {
	a: [2, 8, 10, 14, 17, 19],
	b: [13, 14, 17, 2, 5, 6, 9, 10],
	c: [1, 2, 3, 6],
	d: [19, 21, 10, 13, 14],
};

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

test('script is valid: six chapters played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['table', 'base', 'dispatch', 'cast', 'limits', 'union'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['table', 'shapes', 'first', 'call', 'call2', 'cast', 'limits', 'union'],
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
		// 1. What does the operation table hold?
		'`struct` de punteros a función',
		'`(*area)`, `(*perimetro)`, `(*destruir)`',
		'cada tipo tiene su propia tabla `static const`',
		// 2. How is a call routed to the right function?
		'`figura_area(figuras[0])` no sabe si `f` es un círculo o un rectángulo',
		'`f->ops` llega a `circulo_ops`',
		'la ranura `->area` salta a `circulo_area`',
		'otra flecha, hasta `rectangulo_area`',
		// 3. Why does the base struct go first?
		'incrustan `figura base` como primer campo',
		'objeto y base empiezan en la misma dirección',
		'un `circulo *` convertido es un `figura *`',
		// 4. Why is the cast delicate?
		'el compilador no lo comprueba',
		'compila sin avisos',
		'comportamiento indefinido',
		'si `base` no fuera el primer campo',
		// 5. What are the limits?
		'sin seguridad de tipos',
		'despacho manual',
		'tocar todas las tablas de todos los tipos',
		// 6. When is a tagged union simpler?
		'pocos y cerrados',
		'unión con etiqueta',
		'`switch`',
		'sin tablas, sin conversiones ni `malloc`',
		'`-wall` avisa si falta un caso',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|liberá|pedí|llamás)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'`struct` of function pointers',
		'`(*area)`, `(*perimeter)`, `(*destroy)`',
		'each type has its own `static const` table',
		'`shape_area(shapes[0])` does not know whether `s` is a circle or a rectangle',
		'`s->ops` reaches `circle_ops`',
		'the `->area` slot jumps to `circle_area`',
		'another arrow, to `rectangle_area`',
		'embed `shape base` as the first field',
		'object and base start at the same address',
		'a converted `circle *` is a `shape *`',
		'the compiler cannot check it',
		'compiles silently',
		'undefined behavior',
		'if `base` were not the first field',
		'no type safety',
		'manual dispatch',
		'editing every table of every type',
		'few and closed',
		'tagged union',
		'`switch`',
		'no tables, no casts, no `malloc`',
		'`-wall` flags a missing case',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
});

test('the table is built, the objects point to it, and a call is routed through it to the right function', () => {
	// Scene 1: two tables, their functions and one arrow per slot.
	const table = cuesOf('table');
	for (const id of ['tb-c', 'tb-r', 'fn-c', 'fn-r']) assert.ok(idsOf(table, 'enter').includes(id), `table shows ${id}`);
	assert.deepEqual(idsOf(table, 'draw'), ['ar-tc-a', 'ar-tc-p', 'ar-tc-d', 'ar-tr-a', 'ar-tr-p', 'ar-tr-d']);
	assert.ok(firstAt(table, 'enter', 'fn-c') > firstAt(table, 'enter', 'tb-c'), 'the functions come after the table');

	// Scene 2: the objects appear and each `ops` points to the table of its type.
	const shapes = cuesOf('shapes');
	assert.deepEqual(idsOf(shapes, 'draw'), ['ar-oc', 'ar-or']);
	assert.ok(firstAt(shapes, 'enter', 'ob-c') < firstAt(shapes, 'draw', 'ar-oc'));
	assert.ok(idsOf(shapes, 'enter').includes('on-base-c') && idsOf(shapes, 'enter').includes('on-base-r'), 'the base is the first cell of both');

	// Scene 3: object and base share one address.
	const first = cuesOf('first');
	for (const id of ['on-ob-c', 'lb-a1', 'lb-a2', 'lb-cast2']) assert.ok(idsOf(first, 'enter').includes(id), `first shows ${id}`);

	// Scene 4: the call goes module -> object -> table slot -> function, in that order.
	const call = cuesOf('call');
	assert.deepEqual(stopsOf(call, 'p'), ['a-mb13', 'a-mb14', 'a-mb17', 'a-mb2', 'a-oc', 'a-tca', 'a-fca']);
	assert.ok(firstAt(call, 'enter', 'on-tca') > firstAt(call, 'move', 'p'), 'the slot lights up once the flow reaches the table');
	assert.ok(firstAt(call, 'enter', 'on-fca') > firstAt(call, 'enter', 'on-tca'), 'the function runs after the slot');
	for (const id of ['lb-route1', 'lb-route2', 'lb-fnc']) assert.ok(idsOf(call, 'enter').includes(id), `call shows ${id}`);

	// Scene 5: the circle function runs and prints; the same line then follows the other arrow.
	const call2 = cuesOf('call2');
	assert.deepEqual(stopsOf(call2, 'p'), ['a-mb5', 'a-mb6', 'a-mb17', 'a-mb2', 'a-or', 'a-tra', 'a-fra', 'a-mb9', 'a-mb10']);
	assert.deepEqual(idsOf(call2, 'type'), ['o-b1', 'o-b2']);
	assert.ok(firstAt(call2, 'type', 'o-b2') > firstAt(call2, 'enter', 'on-fra'), 'the rectangle prints after its own function ran');
	assert.ok(idsOf(call2, 'exit').includes('on-tca') && idsOf(call2, 'exit').includes('on-fca'), 'the circle route is cleared before the rectangle one');
});

test('a wrong cast is a refused state, never an explosion, and the base must be the first field', () => {
	const cast = cuesOf('cast');
	const entered = idsOf(cast, 'enter');
	for (const id of ['on-c2', 'on-c3', 'on-wrong', 'lb-wrong', 'lb-ub', 'lb-nocheck', 'ob-bad', 'on-bad-base', 'lb-bad']) assert.ok(entered.includes(id), `cast shows ${id}`);
	assert.ok(firstAt(cast, 'enter', 'on-wrong') > firstAt(cast, 'enter', 'on-c2'), 'the read follows the cast');
	assert.ok(firstAt(cast, 'enter', 'ob-bad') > firstAt(cast, 'exit', 'lb-ub'), 'the misplaced base comes after the first mistake');
	assert.deepEqual(stopsOf(cast, 'p'), ['a-mc1', 'a-mc2', 'a-mc3', 'a-mc6']);
	// Nothing is run or printed for undefined behavior.
	assert.deepEqual(idsOf(cast, 'type'), []);
	assert.ok(cast.some((cue) => cue.do === 'camera' && cue.to.includes('shot-bad')));
});

test('the limits are shown on the system and the film ends contrasting it with the tagged union', () => {
	const limits = cuesOf('limits');
	for (const id of ['lb-lim-types', 'lb-lim-manual', 'lb-lim-tables', 'lb-lim-calls']) assert.ok(idsOf(limits, 'enter').includes(id), `limits shows ${id}`);
	assert.ok(idsOf(limits, 'exit').includes('ob-bad'), 'the misplaced base leaves first');

	const union = cuesOf('union');
	for (const id of ['ob-s', 'on-s-tag', 'on-s-data', 'lb-tag', 'lb-noheap']) assert.ok(idsOf(union, 'enter').includes(id), `union shows ${id}`);
	assert.deepEqual(stopsOf(union, 'p'), ['a-md19', 'a-md21', 'a-md10', 'a-md13', 'a-md14']);
	assert.deepEqual(idsOf(union, 'type'), ['o-d1']);
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all'], 'the camera pulls back to the whole system');
});

test('every instruction runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	for (const [program, lines] of Object.entries(MODULES)) {
		for (const line of lines) {
			assert.ok(stopsOf(all, 'hl').includes(`ln-${line}`), `the bar reaches line ${line} of program ${program}`);
			assert.ok(stopsOf(all, 'p').includes(`a-m${program}${line}`), `the flow visits the module ${program}${line}`);
			assert.ok(idsOf(all, 'enter').includes(`m-${program}${line}`), `module ${program}${line} is built`);
			assert.ok(idsOf(all, 'enter').includes(`on-${program}${line}`), `module ${program}${line} lights up`);
		}
	}
	// Each program ends before the next one starts: its modules leave.
	for (const [program, step] of [['a', 'call'], ['b', 'cast'], ['c', 'union']]) {
		const gone = idsOf(cuesOf(step), 'exit');
		for (const line of MODULES[program]) assert.ok(gone.includes(`m-${program}${line}`), `module ${program}${line} leaves in ${step}`);
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built from the module tables or in a loop count as present; the rest are
	// written once in the component, as `data-el`, `data-anchor` or a quoted id.
	const generated = new Set();
	for (const [program, lines] of Object.entries(MODULES)) {
		for (const line of lines) {
			assert.match(component, new RegExp(`\\[${line}, '(flow|violet|magenta)'\\]`), `module spec for line ${line} of ${program}`);
			for (const id of [`m-${program}${line}`, `on-${program}${line}`, `a-m${program}${line}`]) generated.add(id);
		}
	}
	for (let line = 1; line <= 23; line++) generated.add(`ln-${line}`);
	const known = (id) => generated.has(id) || component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`) || component.includes(`'${id}'`);

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the editor holds the lesson code and the real output of its programs', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const program = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	assert.equal(program('progA').length, 20, 'the table, the base and the types');
	assert.equal(program('progB').length, 19, 'the dispatch and `main`');
	assert.equal(program('progC').length, 7, 'the wrong casts');
	assert.equal(program('progD').length, 22, 'the tagged union');
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the editor uses C highlighting');
	for (const fragment of [
		'`    double (*${n.area})(const ${n.fig} *self);`',
		'`    double (*${n.per})(const ${n.fig} *self);`',
		'`    void (*${n.des})(${n.fig} *self);`',
		'`struct ${n.fig} { const ${n.ops} *ops; };`',
		'`    ${n.fig} base;   /* ${t(\'SIEMPRE el primer campo\', \'ALWAYS the first field\')} */`',
		'`static const ${n.ops} ${n.circOps} = {"${n.circName}",`',
		'`    return ${n.f}->ops->${n.area}(${n.f});`',
		'`    const ${n.circ} *c = (const ${n.circ} *)self;`',
		'`const ${n.circ} *c = (const ${n.circ} *)${n.f};',
		'`    switch (${n.f}->${n.kind}) {`',
		// Identifiers localized like the lesson.
		"t('Figura', 'Shape')",
		"t('FiguraOps', 'ShapeOps')",
		"t('perimetro', 'perimeter')",
		"t('destruir', 'destroy')",
		"t('circulo_area', 'circle_area')",
		"t('CIRCULO_OPS', 'CIRCLE_OPS')",
		"t('FiguraSimple', 'SimpleShape')",
		// The real output of the compiled lesson code.
		'`${n.shapes}[0] area 3.14`',
		'`${n.shapes}[1] area 6.00`',
		"'area 6.00'",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/tabla-operaciones-c'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.ok(hexLines.length > 0);
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the brief');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the brief');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
});
