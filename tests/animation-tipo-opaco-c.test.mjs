import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/tipo-opaco-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'tipo-opaco-c';
const LESSON = 'encapsulacion-y-abstraccion-en-c';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '42-encapsulacion-y-abstraccion-en-c';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);
const idsOf = (cues, kind) => cues.filter((cue) => cue.do === kind).map((cue) => cue.el);
const firstAt = (cues, kind, el) => cues.find((cue) => cue.do === kind && cue.el === el)?.at;

test(`catalog binds ${SLUG} to c/${LESSON}`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'c', slug: LESSON });
	assert.ok(getAnimationsForLesson('c', LESSON).map((entry) => entry.slug).includes(SLUG));
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'c', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/c/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['seal', 'refuse', 'inside', 'helpers', 'guard', 'owner'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['seal', 'refuse', 'open', 'create', 'static', 'guard', 'destroy', 'wrap'],
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
		// 1. What does an opaque type hide?
		'`typedef struct cuenta cuenta;`',
		'declara el tipo sin sus campos',
		'tipo incompleto',
		'caja sellada',
		'la definición completa de `struct cuenta` vive solo en `cuenta.c`',
		// 2. What does the header expose?
		'el nombre y las seis funciones públicas',
		// 3. Why can main not touch the fields?
		'`cuenta copia;`',
		'`c->saldo_centavos`',
		'el compilador los rechaza',
		'`incomplete type`',
		// 4. How is the invariant enforced?
		'`cuenta_depositar(cuenta, 2550)`',
		'`cuenta_extraer(cuenta, 50000)`',
		'devuelve `false` y no cambia nada',
		'`saldo_centavos >= 0`',
		'en un solo archivo',
		// 5. Who owns and frees the object?
		'reserva la caja con `malloc`',
		'el llamador es dueño y libera con `cuenta_destruir`',
		'`cuenta_destruir`',
		'primero el titular y después la caja',
		'orden inverso',
		'`free(cuenta)`',
		'una fuga',
		// 6. What are static helpers for?
		'`monto_valido` y `copiar_texto` son `static`',
		'solo existen en `cuenta.c`',
		'no están en `cuenta.h`',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|agregá|creá)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'`typedef struct account account;`',
		'incomplete type',
		'sealed box',
		'the complete definition of `struct account` lives only in `account.c`',
		'the name and the six public functions',
		'`account copy;`',
		'`a->balance_cents`',
		'the compiler rejects them',
		'`account_deposit(account, 2550)`',
		'`account_withdraw(account, 50000)`',
		'returns `false`, nothing changes',
		'`balance_cents >= 0`',
		'in one file',
		'allocates the box with `malloc`',
		'the caller owns it and frees it with `account_destroy`',
		'`account_destroy`',
		'frees the owner first and then the box',
		'reverse order',
		'`free(account)`',
		'it would leak',
		'`valid_amount` and `copy_text` are `static`',
		'only exist in `account.c`',
		'they are not in `account.h`',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
});

test('the type is sealed in the header, opens in cuenta.c and its key travels from creator to destroyer', () => {
	// The header: the sealed box appears with its lock; only the name and the functions are exposed.
	const seal = cuesOf('seal');
	for (const id of ['z-h', 'sbox', 'lk', 'lb-nofields', 'lb-api']) assert.ok(idsOf(seal, 'enter').includes(id), `seal shows ${id}`);
	assert.ok(!idsOf(seal, 'enter').includes('obox'), 'the open box is not there yet');
	assert.ok(!idsOf(seal, 'enter').some((id) => /^fd-|^fv-/.test(id)), 'no fields in the header');

	// main.c: the pointer is allowed, the copy and the field access are refused by the compiler.
	const refuse = cuesOf('refuse');
	assert.ok(idsOf(refuse, 'draw').includes('fl-ptr'), 'the pointer reaches the sealed box');
	for (const id of ['cp', 'x-cp', 'xm-b4', 'xm-b6', 'x-poke', 'lb-incomplete']) assert.ok(idsOf(refuse, 'enter').includes(id), `refuse shows ${id}`);
	assert.ok(idsOf(refuse, 'draw').includes('fl-poke'), 'the access to a field is drawn');
	assert.deepEqual(idsOf(refuse, 'type').filter((id) => id.startsWith('o-bad-')), ['o-bad-1', 'o-bad-2', 'o-bad-3', 'o-bad-4', 'o-bad-5', 'o-bad-6']);
	assert.ok(firstAt(refuse, 'enter', 'lb-incomplete') < firstAt(refuse, 'type', 'o-bad-1'), 'the label announces the compiler output');

	// cuenta.c: the definition opens the box; crear allocates it; the pointer now reaches the object.
	const open = cuesOf('open');
	for (const id of ['z-c', 'fd-titular', 'fd-saldo', 'lb-hidden']) assert.ok(idsOf(open, 'enter').includes(id), `open shows ${id}`);
	const create = cuesOf('create');
	assert.ok(firstAt(create, 'enter', 'obox') > firstAt(create, 'move', 'hl'), 'the box is allocated when malloc runs');
	assert.ok(idsOf(create, 'enter').includes('fv-titular') && idsOf(create, 'enter').includes('fv-s1'));
	assert.ok(idsOf(create, 'draw').includes('ln-name'), 'the owner has its own block');
	assert.deepEqual(stopsOf(create, 'key'), ['a-key-main'], 'create hands the key to the caller');
	assert.ok(idsOf(create, 'draw').includes('fl-ptr2'));

	// static helpers live in a room that the header does not show.
	const hidden = cuesOf('static');
	for (const id of ['sroom', 'st-monto', 'st-copia', 'lb-static', 'lb-noh']) assert.ok(idsOf(hidden, 'enter').includes(id), `static shows ${id}`);

	// The invariant: the deposit passes the gate, the withdrawal is rejected.
	const guard = cuesOf('guard');
	assert.deepEqual(stopsOf(guard, 'rq-dep'), ['a-gate', 'a-obox']);
	assert.deepEqual(stopsOf(guard, 'rq-ext'), ['a-gate'], 'the withdrawal never reaches the fields');
	assert.ok(firstAt(guard, 'enter', 'fv-s2') > firstAt(guard, 'move', 'rq-dep'), 'the balance changes after the deposit');
	assert.ok(idsOf(guard, 'enter').includes('rj'), 'the rejection is shown');
	assert.ok(!idsOf(guard, 'exit').includes('fv-s2'), 'the rejected request leaves the balance alone');
	assert.deepEqual(idsOf(guard, 'type').filter((id) => id.startsWith('o-run-')), ['o-run-1', 'o-run-2', 'o-run-3', 'o-run-4', 'o-run-5']);

	// destruir frees the owner first and then the box, taking the key with it.
	const destroy = cuesOf('destroy');
	assert.deepEqual(stopsOf(destroy, 'key'), ['a-key'], 'the key returns to destroy');
	assert.ok(firstAt(destroy, 'exit', 'blk-name') < firstAt(destroy, 'exit', 'obox'), 'the owner is freed before the box');
	for (const id of ['obox', 'key', 'fl-ptr2']) assert.ok(idsOf(destroy, 'exit').includes(id), `destroy removes ${id}`);
	assert.ok(idsOf(destroy, 'enter').includes('lb-leak'), 'free(cuenta) from main would leak');

	// The wrap-up: main.c prints the result and the camera pulls back to the whole system.
	const wrap = cuesOf('wrap');
	assert.deepEqual(idsOf(wrap, 'type'), ['o-run-6']);
	assert.ok(idsOf(wrap, 'draw').includes('fl-cycle'));
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
});

test('every executed line has its module and the bar reaches it', () => {
	const lines = {
		h: [6, 9, 11, 12, 13, 14, 15],
		b: [4, 5, 6],
		a: [4, 9, 10, 15, 16, 17, 19],
		z: [24, 25, 30, 39, 40],
		m: [5, 10, 11, 14, 16],
	};
	const all = script.steps.flatMap((step) => step.motion.cues);
	for (const [pane, numbers] of Object.entries(lines)) {
		for (const line of numbers) {
			assert.ok(stopsOf(all, 'hl').includes(`ln-${pane}-${line}`), `the bar reaches line ${line} of pane ${pane}`);
			assert.ok(stopsOf(all, 'p').includes(`a-m-${pane}${line}`), `the flow visits the module of ${pane}${line}`);
			assert.ok(idsOf(all, 'enter').includes(`m-${pane}${line}`), `module ${pane}${line} is built`);
			assert.ok(idsOf(all, 'enter').includes(`on-${pane}${line}`), `module ${pane}${line} lights up`);
		}
	}
	// Each pane is shown before the bar visits it, in the order of the lesson.
	const swaps = all.filter((cue) => cue.do === 'enter' && /^pane-/.test(cue.el)).map((cue) => cue.el);
	assert.deepEqual(swaps, ['pane-b', 'pane-a', 'pane-z', 'pane-m']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Modules are generated from the `specs` table, one per executed line; panes and
	// anchors from `panes`; console rows from `outputs`.
	const moduleIds = new Set([...component.matchAll(/\['([a-z]\d+)', \d, \d+, '(?:flow|violet|magenta)'\]/g)].map((match) => match[1]));
	assert.equal(moduleIds.size, 27, 'one module per executed line');
	const paneRanges = { h: [1, 17], b: [1, 9], a: [1, 21], z: [22, 41], m: [1, 18] };
	for (const pane of Object.keys(paneRanges)) assert.match(component, new RegExp(`{ id: '${pane}', file:`), `pane ${pane} is defined`);
	for (const group of ['bad', 'run']) assert.match(component, new RegExp(`id: '${group}',\\s*rows:`), `console block ${group} is defined`);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`lit: '${id}'`)) return true;
		const module = id.match(/^(?:m|on|a-m)-([a-z]\d+)$/);
		if (module) return moduleIds.has(module[1]);
		const pane = id.match(/^(?:ln|pane)-([a-z])(?:-(\d+))?$/);
		if (pane) {
			const range = paneRanges[pane[1]];
			if (!range) return false;
			return pane[2] === undefined || (Number(pane[2]) >= range[0] && Number(pane[2]) <= range[1]);
		}
		const row = id.match(/^o-(bad|run)-(\d)$/);
		if (row) return Number(row[2]) >= 1 && Number(row[2]) <= 6;
		return id === 'out-bad' || id === 'out-run';
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test("the editor shows the lesson's own files, compiler messages and program output", async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /highlightCode\(source\.join\('\\n'\), 'c'\)/, 'the files use C highlighting');
	for (const fragment of [
		'typedef struct ${n.type} ${n.type};',
		"t('cuenta', 'account')",
		"t('cuenta_crear', 'account_create')",
		"t('cuenta_extraer', 'account_withdraw')",
		"t('saldo_centavos', 'balance_cents')",
		"t('monto_valido', 'valid_amount')",
		"t('copiar_texto', 'copy_text')",
		'static bool ${n.valid}(long long ${n.amount}) { return ${n.amount} > 0; }',
		'struct ${n.type} {',
		"t('nunca negativo', 'never negative')",
		'if (!${n.valid}(${n.amount}) || ${n.amount} > ${n.ptr}->${n.field}) {',
		'free(${n.ptr}->${n.who});',
		"t('Extraccion rechazada', 'Withdrawal rejected')",
		"t('Ana tiene 12550 centavos', 'Ana has 12550 cents')",
		"error: variable has incomplete type '${n.type}'",
		"error: incomplete definition of type '${n.type}'",
		"'2 errors generated.'",
		'$ gcc -std=c23 -Wall -Wextra -Wpedantic -g -c ${n.cFile}',
		'$ gcc -std=c23 -Wall -Wextra -Wpedantic -g -c main.c',
		'$ gcc ${n.exe}.o main.o -o ${n.exe}',
	]) {
		assert.ok(component.includes(fragment), `missing fragment: ${fragment}`);
	}
	// The lesson itself keeps the same sources, error comments and program output.
	for (const lang of ['es', 'en']) {
		const lesson = await readFile(`src/content/courses/c/${FILE}.${lang}.md`, 'utf8');
		const typeName = lang === 'es' ? 'Cuenta' : 'Account';
		assert.ok(lesson.includes(`typedef struct ${typeName} ${typeName};`), `${lang} lesson declares the opaque type`);
		assert.ok(lesson.includes(lang === 'es' ? 'Extraccion rechazada' : 'Withdrawal rejected'), `${lang} lesson prints the rejection`);
		assert.ok(lesson.includes(lang === 'es' ? 'Ana tiene 12550 centavos' : 'Ana has 12550 cents'), `${lang} lesson prints the balance`);
		assert.ok(lesson.includes(lang === 'es' ? '/* error: tipo incompleto */' : '/* error: incomplete type */'), `${lang} lesson marks the failing lines`);
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/tipo-opaco-c'/);
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
	assert.equal((component.match(/data-slug='tipo-opaco-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
