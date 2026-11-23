import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/metodos-composicion-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'metodos-composicion-c';
const LESSON = 'objetos-metodos-y-diseno-basado-en-struct';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '43-objetos-metodos-y-diseno-basado-en-struct';
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
		['object', 'const', 'compose', 'owner', 'codes', 'release'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['object', 'getter', 'refused', 'compose', 'grow', 'codes', 'missing', 'release'],
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
		console.log(`duration ${lang}: ${(total / 1000).toFixed(1)} s`);
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
		// 1. Why is the object pointer the first parameter?
		'no hay métodos',
		'una función que recibe el objeto',
		'primer argumento',
		'el puntero se copia',
		'apunta al `r` original',
		// 2. What does const guarantee on a getter?
		'`const struct rectangulo *`',
		'flecha de solo lectura',
		'el compilador lo rechaza',
		'no modifica el objeto',
		// 3. What is composition?
		'composición',
		'una `esquina`, que a su vez es un `punto`',
		// 4. How does an operation delegate?
		'no repite la lógica',
		'delega en `punto_mover`',
		'`&r->esquina` apunta a la parte',
		// 5. Who owns the dynamic parts?
		'es dueño de su arreglo',
		'lo crea con `realloc`',
		'conserva el arreglo anterior',
		'`inventario_liberar` libera el arreglo',
		'el contenedor libera lo que creó',
		'nunca libera sus partes por su cuenta',
		// 6. How are errors reported with result codes?
		'código de resultado',
		'`inv_ok`',
		'parámetro de salida',
		'`inv_argumento_invalido`',
		'`inv_no_encontrado`',
		'`stock` no cambia',
		'`inv_mensaje` traduce el código a texto',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|liberá|pedí|llamás)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'c has no methods',
		'a function that receives the object',
		'first argument',
		'the pointer is copied',
		'points at the original `r`',
		'`const struct rectangle *`',
		'read-only arrow',
		'the compiler rejects it',
		'does not modify the object',
		'composition',
		'a `corner`, which is itself a `point`',
		'does not repeat the logic',
		'delegates to `point_move`',
		'`&r->corner` points at the part',
		'the inventory owns its array',
		'creates it with `realloc`',
		'keeps the old array',
		'`inventory_release` frees the array',
		'the container frees what it created',
		'never frees its parts on their own',
		'result code',
		'`inv_ok`',
		'output parameter',
		'`inv_invalid_argument`',
		'`inv_not_found`',
		'`stock` is unchanged',
		'`inv_message` turns the code into text',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
});

test('an operation receives the object by pointer, a getter reads through const and the write is refused', () => {
	// The arrow into the plate is drawn once the first parameter is bound; the fields change through it.
	const object = cuesOf('object');
	assert.ok(firstAt(object, 'draw', 'pt-r') > firstAt(object, 'enter', 'pv-r'), 'the arrow leaves the parameter that holds the address');
	assert.ok(firstAt(object, 'enter', 'rv-b1') > firstAt(object, 'draw', 'pt-r'), 'the fields change after the arrow exists');
	assert.deepEqual(stopsOf(object, 'p').filter((stop) => stop.startsWith('aa-')), ['aa-15', 'aa-15', 'aa-16', 'aa-17']);
	assert.ok(idsOf(object, 'enter').includes('rv-c1'), 'both fields are scaled');

	const getter = cuesOf('getter');
	assert.ok(idsOf(getter, 'enter').includes('ch-const'), 'the read-only note appears');
	assert.deepEqual(stopsOf(getter, 'p'), ['aa-19', 'aa-20']);
	assert.ok(!idsOf(getter, 'enter').some((id) => /^rv-/.test(id)), 'a getter changes no field');
	assert.deepEqual(idsOf(getter, 'type'), ['oa-1']);

	const refused = cuesOf('refused');
	assert.ok(idsOf(refused, 'enter').includes('ed-k'), 'the editor shows the mistaken line');
	assert.deepEqual(stopsOf(refused, 'hl'), ['ln-20']);
	assert.deepEqual(stopsOf(refused, 'p'), ['ak-20']);
	assert.ok(firstAt(refused, 'enter', 'ch-err') > firstAt(refused, 'enter', 'onk-20'), 'the refusal shows after the write is tried');
	assert.ok(!idsOf(refused, 'enter').some((id) => /^gtk-20-open$/.test(id)), 'the gate never opens');
	assert.ok(!idsOf(refused, 'enter').some((id) => /^rv-/.test(id)), 'the object is not touched');
});

test('composition: the operation delegates to the part through a pointer into the inner plate', () => {
	const compose = cuesOf('compose');
	assert.deepEqual(stopsOf(compose, 'p'), ['aa-12', 'aa-12', 'aa-13', 'aa-8', 'aa-9', 'aa-10']);
	assert.ok(firstAt(compose, 'enter', 'cl-pm') > firstAt(compose, 'enter', 'ona-13'), 'the inner call comes after the delegating line');
	assert.ok(firstAt(compose, 'draw', 'pt-p') > firstAt(compose, 'enter', 'pv-p'), 'the part pointer leaves its parameter');
	assert.ok(firstAt(compose, 'enter', 'rv-a1') > firstAt(compose, 'draw', 'pt-p'), 'the corner moves through the pointer to the part');
	assert.ok(idsOf(compose, 'enter').includes('ch-deleg'));
	assert.deepEqual(idsOf(compose, 'type'), ['oa-3']);
});

test('the inventory owns a dynamic array that grows safely, frees it and reports errors with codes', () => {
	const grow = cuesOf('grow');
	// The array is created by the first call (0 == 0) before it is adopted, and growth never breaks the object.
	assert.ok(firstAt(grow, 'enter', 'blk-xa') > firstAt(grow, 'enter', 'onb-10'), 'the array exists after realloc');
	assert.ok(firstAt(grow, 'draw', 'pt-prod') > firstAt(grow, 'enter', 'iv-a1'), 'productos points at the array once adopted');
	assert.ok(firstAt(grow, 'enter', 'iv-a1') > firstAt(grow, 'enter', 'gtb-12-open'), 'productos changes only after the NULL check');
	assert.ok(idsOf(grow, 'enter').includes('ch-fail') && idsOf(grow, 'enter').includes('ch-keep'), 'the failing realloc keeps the old array');
	assert.deepEqual(idsOf(grow, 'enter').filter((id) => /^xv-\d$/.test(id)), ['xv-0', 'xv-1', 'xv-2']);
	assert.deepEqual(idsOf(grow, 'enter').filter((id) => /^iv-b\d$/.test(id)), ['iv-b0', 'iv-b1', 'iv-b2', 'iv-b3']);
	// The code that is too long: the argument check stays closed and nothing is touched.
	assert.ok(stopsOf(grow, 'p').includes('ab-5'), 'it returns INV_ARGUMENTO_INVALIDO');
	assert.ok(firstAt(grow, 'enter', 'ch-bad') < firstAt(grow, 'type', 'ob-1'), 'the code is reported before the message is printed');
	assert.deepEqual(idsOf(grow, 'type').filter((id) => id.startsWith('ob-')), ['ob-0', 'ob-1']);

	const codes = cuesOf('codes');
	assert.ok(idsOf(codes, 'draw').includes('pt-s'), 'the output parameter is an arrow too');
	assert.ok(firstAt(codes, 'enter', 'sv-40') > firstAt(codes, 'draw', 'pt-s'), 'the value is written through the pointer');
	assert.ok(firstAt(codes, 'enter', 'ch-ok') > firstAt(codes, 'enter', 'sv-40'), 'the code says ok after the write');
	assert.deepEqual(idsOf(codes, 'type').filter((id) => id.startsWith('oc-')), ['oc-0', 'oc-1']);
	assert.deepEqual(stopsOf(codes, 'p').filter((stop) => stop !== 'ac-6' && stop !== 'ac-7'), ['ac-8', 'ac-9'], 'it writes the value and then returns ok');

	const missing = cuesOf('missing');
	assert.ok(stopsOf(missing, 'p').includes('ac-12'), 'the loop ends and it returns the not-found code');
	assert.ok(!idsOf(missing, 'enter').includes('mc-8') && !stopsOf(missing, 'p').includes('ac-8'), 'stock is never written');
	assert.ok(idsOf(missing, 'enter').includes('ch-nf') && idsOf(missing, 'enter').includes('ch-same'));
	assert.deepEqual(idsOf(missing, 'type'), ['oc-2']);

	const release = cuesOf('release');
	assert.ok(stopsOf(release, 'p').includes('ac-16') && stopsOf(release, 'p').includes('ac-17'));
	assert.ok(firstAt(release, 'enter', 'rel-xa') > firstAt(release, 'enter', 'onc-16'), 'the array dies at free');
	assert.ok(firstAt(release, 'enter', 'iv-a0') > firstAt(release, 'enter', 'rel-xa'), 'the inventory is left empty after free');
	const lastShot = release.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all'], 'the camera pulls back at the end');
});

test('every instruction runs on its editor line and lights its own module', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const all = script.steps.flatMap((step) => step.motion.cues);
	const lines = {
		a: [15, 16, 17, 19, 20, 12, 13, 8, 9, 10],
		k: [20],
		b: [3, 5, 7, 8, 10, 12, 15, 16, 18, 19, 20, 21, 22],
		c: [6, 7, 8, 9, 12, 16, 17],
	};
	for (const [program, list] of Object.entries(lines)) {
		for (const line of list) {
			assert.ok(stopsOf(all, 'hl').includes(`ln-${line}`), `the bar reaches line ${line} of program ${program}`);
			assert.ok(stopsOf(all, 'p').includes(`a${program}-${line}`), `the flow visits the module of line ${line} of program ${program}`);
			assert.ok(idsOf(all, 'enter').includes(`on${program}-${line}`), `module ${line} of program ${program} lights up`);
		}
	}
	// Each module of the canvas is built (entered) before the flow reaches it.
	for (const [program, list] of Object.entries(lines)) {
		for (const line of list) assert.ok(idsOf(all, 'enter').includes(`m${program}-${line}`), `module m${program}-${line} is built`);
	}
	for (const [program, list] of Object.entries({ a: lines.a, b: lines.b, c: lines.c })) {
		for (const line of list) assert.match(component, new RegExp(`\\[${line}, '(flow|violet|magenta)'\\]`), `module spec for line ${line} of ${program}`);
	}
	assert.match(component, /moduleRow\('k', ROW_2, \[\[20, 'magenta'\]\], 2\)/, 'the refused write has its own module');
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`file: '${id}'`) || component.includes(`call('${id}'`)) return true;
		// Generated ids: modules, lit states, anchors, cells, gates, lines.
		const patterns = [
			[/^m[abkc]-\d+$/, 'id: `m${prog}-${line}`'],
			[/^on[abkc]-\d+$/, 'lit: `on${prog}-${line}`'],
			[/^a[abkc]-\d+$/, '`a${module.prog}-${module.line}`'],
			[/^xq-\d$/, '`xq-${cell.index}`'],
			[/^gt[bk]-\d+(-bar|-open)?$/, '`${gate.id}-bar`'],
			[/^ln-\d+$/, '`ln-${index + 1}`'],
			[/^(rv|iv)-[abc]\d$/, "id: 'rv-a0'"],
			[/^iv-b\d$/, 'id: `iv-b${count}`'],
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
});

test('the editor holds the lesson programs and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const block = (name) => component.split(`const ${name} = [`)[1].split('\n];')[0].trim().split('\n');
	const programs = { rectangle: block('rectangle'), add: block('add'), query: block('query') };
	assert.equal(programs.rectangle.length, 21, 'the rectangle operations fit in 21 lines');
	assert.equal(programs.add.length, 23, 'agregar fits in 23 lines');
	assert.equal(programs.query.length, 18, 'stock and liberar fit in 18 lines');
	assert.match(component, /highlightCode\(source\.join\('\\n'\), 'c'\)/, 'the editor uses C highlighting');
	assert.match(component, /const mistaken = \[\.\.\.rectangle\.slice\(0, 19\)/, 'the mistaken area adds one line inside the getter');
	for (const fragment of [
		'void ${n.rs}(struct ${n.Rect} *r, double factor) {',
		'double ${n.ra}(const struct ${n.Rect} *r) {',
		'${n.pm}(&r->${n.corner}, dx, dy);',
		'struct ${n.Point} ${n.corner};',
		'realloc(inv->${n.items}, ${n.bigger} * sizeof *${n.more});',
		'inv->${n.cap} == 0 ? 4 : inv->${n.cap} * 2;',
		'if (${n.more} == NULL) {',
		'*stock = inv->${n.items}[i].stock;',
		'free(inv->${n.items});',
		'${n.init}(inv);',
		'sizeof inv->${n.items}[0].${n.code}',
		// Identifiers localized like the lesson.
		"t('rectangulo_escalar', 'rectangle_scale')",
		"t('punto_mover', 'point_move')",
		"t('inventario_agregar', 'inventory_add')",
		"t('INV_NO_ENCONTRADO', 'INV_NOT_FOUND')",
		// Real output of `cc -std=c23`.
		"t('No se agrego codigo-demasiado-largo: argumento invalido', 'Could not add code-that-is-too-long: invalid argument')",
		"t('Stock de C-300: 40', 'Stock of C-300: 40')",
		"t('Z-999: no encontrado', 'Z-999: not found')",
		"'Area: 32.0'",
		"cannot assign to variable 'r' with const-qualified type",
		// Short fictional addresses: twenty bytes per Producto.
		'BASE_ADDR = 0x2000',
		'index * 20',
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// Every line fits the editor (67 characters at most, 7.5 px each) in both languages.
	const names = Object.fromEntries(
		[...component.matchAll(/^\t(\w+): t\('([^']*)', '([^']*)'\),$/gm)].map(([, key, es, en]) => [key, es.length >= en.length ? es : en]),
	);
	for (const line of Object.values(programs).flat()) {
		let filled = line.trim().replace(/,$/, '');
		filled = filled.slice(1, -1);
		filled = filled.replace(/\$\{n\.(\w+)\}/g, (_, key) => names[key] ?? `?${key}?`);
		assert.doesNotMatch(filled, /\?\w+\?|\$\{/, `unfilled slot in ${line}`);
		assert.ok(filled.length <= 67, `a program line is too long (${filled.length}): ${filled}`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/metodos-composicion-c'/);
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
	assert.equal((component.match(/data-slug='metodos-composicion-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
