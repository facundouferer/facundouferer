import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/ideas-poo-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'ideas-poo-c';
const LESSON = 'introduccion-a-poo-en-c';
const FILE = '41-introduccion-a-poo-en-c';
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
		['abstraction', 'grouping', 'rule', 'views', 'board', 'worth'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['abstraction', 'grouping', 'rule', 'output', 'views', 'expressed', 'lacks', 'worth'],
	);
	for (const step of script.steps) {
		assert.equal(step.scene, 'design', `${step.id} plays on the single canvas`);
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

// Nothing from later lessons of the module: opaque types, vtables, dynamic allocation.
const LATER = /opaco|opaque|vtable|malloc|calloc|free\(/i;

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = narration('es');
	for (const concept of [
		// 1. What does abstraction mean? C is procedural.
		'c es procedural',
		'la abstracción es una técnica de diseño',
		'empieza por las operaciones',
		'esa lista es la interfaz',
		'los campos son un detalle',
		// 2. How do a struct and functions group data and operations?
		'una `struct` guarda el estado',
		'las funciones `cuenta_*` son su comportamiento',
		'puntero a la cuenta como primer parámetro',
		'recibe `&cuenta` y 12550',
		// 3 and 4. Which ideas does C express, and which does it lack?
		'ideas de la poo que c sí expresa',
		'ideas de la poo que c no tiene',
		'datos + funciones: c lo expresa con una `struct` y funciones',
		'interfaces: un `.h` declara qué se puede hacer y el `.c` decide cómo',
		'clases, herencia, despacho virtual y control de acceso: no existen en c',
		'se simulan a mano',
		'sin ayuda del compilador',
		'no hay `private`',
		// 5. What does a rule enforced in an operation buy?
		'la operación revisa su regla primero',
		'devuelve `false` y no toca el saldo',
		'la regla vive dentro de la operación, no repartida por `main`',
		'imprime el rechazo',
		'el saldo sigue intacto: 12550 centavos',
		'pasos sueltos',
		'la regla vive en un solo lugar',
		// 6. When is the style worth it?
		'vale la pena con reglas que proteger o varias partes que lo usan',
		'más código, más memoria dinámica y más indirección',
		'basta una `struct` con dos funciones',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|elegís|usá|empezá|escribí|hacé)\b/i);
	assert.doesNotMatch(all, LATER);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'c is procedural',
		'abstraction is a design technique',
		'start from the operations',
		'that list is the interface',
		'the fields are a detail',
		'a `struct` holds the state',
		'the `account_*` functions are its behavior',
		'pointer to the account as its first parameter',
		'receives `&account` and 12550',
		'oop ideas that c does express',
		'oop ideas that c does not have',
		'data + functions: c expresses it with a `struct` and functions',
		'interfaces: a `.h` declares what can be done and the `.c` decides how',
		'classes, inheritance, virtual dispatch and access control: c has none',
		'simulated by hand',
		'no compiler help',
		'there is no `private`',
		'the operation checks its rule first',
		'it returns `false` and leaves the balance alone',
		'the rule lives inside the operation, not scattered across `main`',
		'prints the rejection',
		'the balance is intact: 12550 cents',
		'loose steps',
		'the rule lives in one place',
		'it pays off with rules to protect or several parts that use it',
		'more code, more dynamic memory and more indirection',
		'a `struct` with two functions is enough',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
	assert.doesNotMatch(all, LATER);
});

test('C is never presented as an object-oriented language', () => {
	for (const lang of ['es', 'en']) {
		const all = narration(lang);
		assert.doesNotMatch(all, /c es orientado a objetos|c is object[- ]oriented|las clases de c|c classes|\bmétodos?\b|\bmethods?\b/, `${lang} avoids OOP wording for C`);
	}
});

test('the rule is checked inside the operation: the verdict first, then the chosen branch', () => {
	const rule = cuesOf('rule');
	const order = (el) => firstAt(rule, 'enter', el);
	assert.ok(order('m-8') < order('cv-8'), 'the rule exists before its verdict');
	assert.ok(order('cv-8') < firstAt(rule, 'draw', 'k-8'), 'the verdict comes before the chosen branch');
	assert.ok(firstAt(rule, 'draw', 'k-8') < order('seal-8'), 'the other branch is sealed after the choice');
	for (const id of ['warn-8', 'lb-refused', 'seal-8']) assert.ok(idsOf(rule, 'enter').includes(id), `rule shows ${id}`);
	// The amount travels into the operation and the refusal travels back to the call.
	assert.deepEqual(stopsOf(rule, 't-ptr15'), ['a-in15']);
	assert.deepEqual(stopsOf(rule, 't-a15'), ['a-in8']);
	assert.deepEqual(stopsOf(rule, 't-ret8'), ['a-in15']);
	assert.ok(firstAt(rule, 'move', 't-a15') >= order('m-15'), 'the call exists before the amount is sent');
});

test('the struct, its functions and the account come first; the balance is stored by the call', () => {
	const grouping = cuesOf('grouping');
	for (const id of ['ar-4', 'ar-7']) assert.ok(idsOf(grouping, 'draw').includes(id), `${id} is drawn`);
	for (const id of ['m-4', 'm-7', 'm-13', 'm-14', 'm-5', 'lb-param', 'v-saldo']) assert.ok(idsOf(grouping, 'enter').includes(id), `grouping shows ${id}`);
	assert.deepEqual(stopsOf(grouping, 't-ptr14'), ['a-in14']);
	assert.deepEqual(stopsOf(grouping, 't-v14'), ['a-in5']);
	assert.deepEqual(stopsOf(grouping, 't-v5'), ['a-saldo']);
	assert.ok(firstAt(grouping, 'enter', 'v-saldo') >= firstAt(grouping, 'move', 't-v5'), 'the balance holds 12550 once the value arrives');
	assert.ok(firstAt(grouping, 'draw', 'ar-4') > firstAt(grouping, 'enter', 'm-4'), 'the pointer starts at an existing function');

	const abstraction = cuesOf('abstraction');
	for (const id of ['lb-proc', 'op-1', 'op-2', 'op-3', 'op-4', 'lb-iface', 'm-3', 'lb-detail']) assert.ok(idsOf(abstraction, 'enter').includes(id), `abstraction shows ${id}`);
	assert.ok(firstAt(abstraction, 'enter', 'op-4') < firstAt(abstraction, 'enter', 'm-3'), 'the operations come before the struct');
});

test('the board stamps what C expresses, then what it lacks, and the film ends on when it pays off', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const expressed = cuesOf('expressed');
	const lacks = cuesOf('lacks');
	for (let n = 1; n <= 6; n++) assert.ok(idsOf(expressed, 'enter').includes(`tile-${n}`), `tile ${n} is placed`);
	assert.deepEqual(idsOf(expressed, 'enter').filter((id) => id.startsWith('st-')), ['st-1', 'st-2']);
	assert.deepEqual(idsOf(lacks, 'enter').filter((id) => id.startsWith('st-')), ['st-3', 'st-4', 'st-5', 'st-6']);
	assert.ok(idsOf(lacks, 'enter').includes('lb-loop'), 'the missing access control shows the field write');
	// What each stamp says, in the component: the lesson's table of what C can and cannot express.
	for (const fragment of [
		"{ n: 1, title: t('datos + funciones', 'data + functions'), kind: 'yes'",
		"{ n: 2, title: t('interfaces', 'interfaces'), kind: 'yes'",
		"{ n: 3, title: t('clases', 'classes'), kind: 'no'",
		"{ n: 4, title: t('herencia', 'inheritance'), kind: 'no'",
		"{ n: 5, title: t('despacho virtual', 'virtual dispatch'), kind: 'no'",
		"{ n: 6, title: t('control de acceso', 'access control'), kind: 'no'",
		"t('C lo expresa con', 'C expresses it with')",
		"t('no existe en C', 'does not exist in C')",
	]) {
		assert.ok(component.includes(fragment), `the board lacks ${fragment}`);
	}

	const worth = cuesOf('worth');
	for (const id of ['w-yes', 'w-no', 'wc-1', 'wc-2', 'wc-3', 'wc-cost']) assert.ok(idsOf(worth, 'enter').includes(id), `worth shows ${id}`);
	const views = cuesOf('views');
	for (const id of ['lb-before', 'bf-var', 'bf-s1', 'bf-s2', 'bf-s3', 'bf-s4', 'bf-dup', 'lb-after', 'lb-one']) assert.ok(idsOf(views, 'enter').includes(id), `views shows ${id}`);

	// The camera pulls back to the whole system at the end.
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
});

test('every executed line runs on its editor line and lights its own module', () => {
	const all = script.steps.flatMap((step) => step.motion.cues);
	assert.deepEqual(stopsOf(all, 'hl'), ['ln-3', 'ln-4', 'ln-7', 'ln-13', 'ln-14', 'ln-5', 'ln-15', 'ln-8', 'ln-16', 'ln-17']);
	for (const line of [3, 4, 7, 13, 14, 5, 15, 8, 16, 17]) {
		assert.ok(stopsOf(all, 'p').includes(`a-m${line}`), `the flow visits the module of line ${line}`);
		assert.ok(idsOf(all, 'enter').includes(`m-${line}`), `module ${line} is built`);
		assert.ok(idsOf(all, 'enter').includes(`on-${line}`), `module ${line} lights up`);
	}
	// Every print types its real output.
	assert.deepEqual(idsOf(all, 'type'), ['o-16', 'o-17']);
	assert.deepEqual(stopsOf(cuesOf('output'), 't-s17'), ['a-in17']);
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="design" data-motion/);

	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`)) return true;
		const line = id.match(/^(?:m|on|a-m|a-in)-?(\d+)$/);
		if (line) return new RegExp(`line: ${line[1]}[,}]`).test(component);
		const prefix = id.replace(/\d+$/, '');
		return prefix !== id && component.includes('`' + prefix + '${');
	};

	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the editor holds the lesson program and the real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const program = component.split('const program = [')[1].split('].join')[0].trim().split('\n');
	assert.equal(program.length, 18, 'the editor holds the 18 lines of the program');
	assert.match(component, /highlightCode\(program, 'c'\)/, 'the program uses C highlighting');
	for (const fragment of [
		"t('Cuenta', 'Account')",
		"t('saldo_centavos', 'balance_cents')",
		"t('cuenta_iniciar', 'account_init')",
		"t('cuenta_extraer', 'account_withdraw')",
		"t('Extraccion rechazada: saldo insuficiente', 'Withdrawal rejected: insufficient funds')",
		'`struct ${names.type} { long long ${names.field}; };`,',
		'`    ${names.self}->${names.field} = ${names.amount};`,',
		'`    if (${names.amount} <= 0 || ${names.amount} > ${names.self}->${names.field}) return false;`,',
		'`    ${names.self}->${names.field} -= ${names.amount};`,',
		'`    ${names.init}(&${names.account}, 12550);`,',
		'`    if (!${names.withdraw}(&${names.account}, 50000))`,',
		'`        printf("${names.rejected}\\\\n");`,',
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// The real output (cc -std=c23 -Wall -Wextra -Wpedantic): Extraccion rechazada... / Saldo: 12550 centavos.
	for (const out of [
		"{ id: 'o-16', row: 0, text: names.rejected }",
		"{ id: 'o-17', row: 1, text: `${names.balanceText}: 12550 ${names.cents}` }",
	]) {
		assert.ok(component.includes(out), `missing output ${out}`);
	}
	// Every line fits the editor (about 64 characters) in both languages.
	const slots = {
		es: { account: 'cuenta', type: 'Cuenta', field: 'saldo_centavos', init: 'cuenta_iniciar', withdraw: 'cuenta_extraer', amount: 'monto', self: 'c', rejected: 'Extraccion rechazada: saldo insuficiente', balanceText: 'Saldo', cents: 'centavos' },
		en: { account: 'account', type: 'Account', field: 'balance_cents', init: 'account_init', withdraw: 'account_withdraw', amount: 'amount', self: 'a', rejected: 'Withdrawal rejected: insufficient funds', balanceText: 'Balance', cents: 'cents' },
	};
	for (const lang of ['es', 'en']) {
		for (const line of program) {
			let filled = line.trim().slice(1, -2).replaceAll('\\\\', '\\');
			for (const [slot, value] of Object.entries(slots[lang])) filled = filled.replaceAll('${names.' + slot + '}', value);
			assert.doesNotMatch(filled, /\$\{/, `unfilled slot in ${line}`);
			assert.ok(filled.length <= 64, `a program line is too long in ${lang} (${filled.length}): ${filled}`);
		}
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/ideas-poo-c'/);
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
	assert.equal((component.match(/data-slug='ideas-poo-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
