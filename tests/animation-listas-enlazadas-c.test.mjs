import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/listas-enlazadas-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'listas-enlazadas-c';
const LESSON = 'estructuras-dinamicas-listas';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '30-estructuras-dinamicas-listas';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

// The instructions that have a module, per program (the editor lines they sit on).
const MODULES = {
	a: [6, 7, 8, 9, 13, 14, 15, 16, 21, 22],
	b: [2, 3, 4, 8, 9, 10, 12, 16, 17],
	c: [2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 18, 19, 20, 21],
	d: [2, 3, 4, 5, 6, 8, 11, 12],
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
		['node', 'head', 'tail', 'delete', 'destroy', 'end'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['list', 'malloc', 'head', 'tail', 'middle', 'first', 'destroy', 'end'],
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
		// 1. What does a node hold?
		'cadena de nodos',
		'cada nodo guarda un `dato` y `siguiente`',
		'la dirección del que sigue',
		'el último guarda `null`',
		'`malloc(sizeof *nodo)`',
		'lo comprueba contra `null`',
		'`dato = 5` y `siguiente = null`',
		'las direcciones reales varían',
		// 2. How does the head change, and why a double pointer?
		'`cabeza`, en la pila, apunta al primero',
		'cambiar `cabeza` exige pasar su dirección',
		'`nodo **cabeza`',
		'porque c pasa por valor',
		// 3. How does insertion relink?
		'`nuevo->siguiente = *cabeza`',
		'el nuevo apunta al que era el primero',
		'después `*cabeza = nuevo`',
		'perdería el resto de la lista',
		'`ultimo` avanza mientras `ultimo->siguiente` no sea `null`',
		'`ultimo->siguiente = nuevo` engancha el 11 al final',
		// 4. How does deletion relink and free?
		'`eliminar(&cabeza, 7)`',
		'`anterior` y `actual` avanzan juntos',
		'`anterior->siguiente = actual->siguiente` salta el 7',
		'recién entonces `free(actual)` lo libera',
		'con el 5, `anterior` es `null`',
		'`*cabeza = actual->siguiente`',
		'primero se desengancha y después se libera',
		// 5. Why save next before free?
		'antes de cada `free` guarda `siguiente`',
		'`actual->siguiente` leería un bloque ya liberado',
		'con el siguiente a salvo',
		'`actual = siguiente`',
		// 6. What ends the list?
		'`*cabeza = null`',
		'una lista vacía es una cabeza que vale `null`',
		'cada nodo tuvo un dueño y se liberó una vez',
		'lo que marca el final siempre es `null`',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|escribí|hacé|usá|liberá|pedí|llamás)\b/i);
});

test('the English narration answers the same questions', () => {
	const all = narration('en');
	for (const concept of [
		'chain of nodes',
		'each node holds a `value` and `next`',
		'the address of the one after it',
		'the last holds `null`',
		'`malloc(sizeof *node)`',
		'checks it against `null`',
		'`value = 5` and `next = null`',
		'real addresses vary',
		'`head`, on the stack, points to the first',
		'changing `head` needs its address',
		'`node **head`',
		'because c passes by value',
		'`new_node->next = *head`',
		'the new node points to what was the first',
		'then `*head = new_node`',
		'lose the rest of the list',
		'`last` advances while `last->next` is not `null`',
		'`last->next = new_node` hooks the 11 on at the end',
		'`delete_value(&head, 7)`',
		'`previous` and `current` advance together',
		'`previous->next = current->next` skips the 7',
		'only then does `free(current)` release it',
		'with the 5, `previous` is `null`',
		'`*head = current->next`',
		'unlink first, release after',
		'saves `next` before every `free`',
		'`current->next` read a released block',
		'with next safe',
		'`current = next`',
		'`*head = null`',
		'an empty list is a head that equals `null`',
		'every node had one owner and was released once',
		'what marks the end is always `null`',
	]) {
		assert.ok(all.includes(concept), `English narration should mention ${concept}`);
	}
});

test('the chain is built, grown at both ends, relinked around a deleted node and freed one by one', () => {
	// Scene 1: three nodes of the lesson (3, 7, 9), the head on the stack, NULL at the end.
	const list = cuesOf('list');
	for (const id of ['nd-n3', 'nd-n7', 'nd-n9', 'v-cabeza', 'sg-n9-null', 'lb-dato', 'lb-sig', 'lb-end']) assert.ok(idsOf(list, 'enter').includes(id), `list shows ${id}`);
	assert.deepEqual(idsOf(list, 'draw'), ['ar-cabeza-n3', 'lk-n3-n7', 'lk-n7-n9']);

	// malloc: a block of uninitialized cells, the NULL check as a gate, then the fields and the owner.
	const malloc = cuesOf('malloc');
	for (const id of ['nd-n5', 'q-n5-d', 'q-n5-s', 'lb-sizeof', 'lb-uninit', 'gt-a7-open', 'key-n5', 'lb-addr']) assert.ok(idsOf(malloc, 'enter').includes(id), `malloc shows ${id}`);
	assert.ok(firstAt(malloc, 'enter', 'gt-a7-open') > firstAt(malloc, 'exit', 'gt-a7-bar'), 'the gate opens once the bar lifts');
	assert.ok(firstAt(malloc, 'enter', 'dv-n5') > firstAt(malloc, 'enter', 'nd-n5'), 'the fields are filled after the block exists');
	assert.ok(firstAt(malloc, 'enter', 'sg-n5-null') > firstAt(malloc, 'enter', 'dv-n5'));
	assert.ok(firstAt(malloc, 'enter', 'key-n5') > firstAt(malloc, 'enter', 'sg-n5-null'), 'the owner key marks the finished node');

	// Insert at the head: Nodo ** is the address of cabeza; link first, then move the head.
	const head = cuesOf('head');
	assert.ok(idsOf(head, 'draw').includes('ar-param-cabeza'), 'the parameter points at the variable of main');
	assert.ok(idsOf(head, 'enter').includes('lb-ptrptr'));
	assert.ok(firstAt(head, 'draw', 'lk-n5-n3') < firstAt(head, 'draw', 'ar-cabeza-n5'), 'the new node is linked before the head moves');
	assert.ok(firstAt(head, 'enter', 'pv-cabeza-5050') > firstAt(head, 'enter', 'lb-step1'), 'the head changes after step 1');
	assert.ok(idsOf(head, 'exit').includes('ar-cabeza-n3'));
	assert.ok(idsOf(head, 'type').includes('o-a1'));

	// Insert at the tail: `ultimo` walks node by node; the last `siguiente` stops pointing at NULL.
	const tail = cuesOf('tail');
	assert.deepEqual(
		idsOf(tail, 'draw').filter((id) => id.startsWith('ar-ultimo-')),
		['ar-ultimo-n5', 'ar-ultimo-n3', 'ar-ultimo-n7', 'ar-ultimo-n9'],
	);
	assert.ok(idsOf(tail, 'enter').includes('lb-last'));
	assert.ok(firstAt(tail, 'draw', 'lk-n9-n11') > firstAt(tail, 'draw', 'ar-ultimo-n9'), 'the link is made once `ultimo` reached the last node');
	assert.ok(firstAt(tail, 'enter', 'sg-n9-50a0') > firstAt(tail, 'exit', 'sg-n9-null'));
	assert.ok(idsOf(tail, 'type').includes('o-b1'));

	// Delete from the middle: both pointers walk, the neighbour relinks, then the block is freed and its key leaves.
	const middle = cuesOf('middle');
	assert.ok(idsOf(middle, 'draw').includes('ar-actual-n7'));
	assert.ok(firstAt(middle, 'draw', 'lk-n3-n9') > firstAt(middle, 'draw', 'ar-actual-n7'));
	assert.ok(firstAt(middle, 'enter', 'sg-n3-5030') > firstAt(middle, 'exit', 'sg-n3-5080'), 'the neighbour now points at the 9');
	assert.ok(firstAt(middle, 'enter', 'rel-n7') > firstAt(middle, 'enter', 'sg-n3-5030'), 'free comes after the relink');
	assert.ok(idsOf(middle, 'exit').includes('key-n7'), 'the key leaves with the block');
	assert.ok(idsOf(middle, 'type').includes('o-c1'));

	// Delete the head: anterior is NULL, the head moves, then free.
	const first = cuesOf('first');
	assert.ok(idsOf(first, 'enter').includes('lb-nohead'));
	assert.ok(firstAt(first, 'enter', 'rel-n5') > firstAt(first, 'enter', 'pv-cabeza-5010'), 'the head moves before the block is freed');
	assert.ok(idsOf(first, 'exit').includes('key-n5'));
	assert.ok(idsOf(first, 'type').includes('o-c2'));

	// Destroy: `siguiente` is saved before each free; what would happen otherwise is flagged.
	const destroy = cuesOf('destroy');
	assert.ok(firstAt(destroy, 'draw', 'ar-siguiente-n9') < firstAt(destroy, 'enter', 'rel-n3'), 'the next one is saved before the first free');
	assert.ok(idsOf(destroy, 'enter').includes('lb-uaf'));
	for (const id of ['rel-n3', 'rel-n9', 'rel-n11']) assert.ok(idsOf(destroy, 'enter').includes(id), `destroy frees ${id}`);
	for (const id of ['key-n3', 'key-n9', 'key-n11']) assert.ok(idsOf(destroy, 'exit').includes(id), `${id} leaves`);

	// The end: the head becomes NULL, the output is NULL and the camera pulls back.
	const end = cuesOf('end');
	assert.ok(firstAt(end, 'enter', 'pv-cabeza-null') > firstAt(end, 'exit', 'pv-cabeza-5010'));
	assert.ok(idsOf(end, 'type').includes('o-d1'));
	const lastShot = script.steps.at(-1).motion.cues.filter((cue) => cue.do === 'camera').at(-1);
	assert.deepEqual(lastShot.to, ['shot-all']);
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
	for (const [program, step] of [['a', 'tail'], ['b', 'middle'], ['c', 'destroy']]) {
		const gone = idsOf(cuesOf(step), 'exit');
		for (const line of MODULES[program]) assert.ok(gone.includes(`m-${program}${line}`), `module ${program}${line} leaves in ${step}`);
	}
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// The generated ids come from small tables in the component: read them instead of guessing.
	const table = (name) => component.split(`const ${name}`)[1].split('\n];')[0];
	const pairs = (name) => [...table(name).matchAll(/\['(\w+)', (?:\[([^\]]*)\]|'(\w+)')\]/g)];
	const generated = new Set();
	for (const [, plate, states] of pairs('plateStates')) {
		for (const state of states.match(/'(\w+)'/g).map((item) => item.slice(1, -1))) generated.add(`pv-${plate}-${state}`);
	}
	for (const [, plate, targets] of pairs('walkers')) {
		for (const target of targets.match(/'(\w+)'/g).map((item) => item.slice(1, -1))) generated.add(`ar-${plate}-${target}`);
	}
	for (const [, from, to] of component.split('const links')[1].split(';')[0].matchAll(/\['(\w+)', '(\w+)'\]/g)) generated.add(`lk-${from}-${to}`);
	const nodeIds = [...table('nodes').matchAll(/id: '(n\d+)'/g)].map((item) => item[1]);
	for (const id of nodeIds) for (const prefix of ['nd', 'dv', 'rel', 'key']) generated.add(`${prefix}-${id}`);
	for (const [program, lines] of Object.entries(MODULES)) {
		for (const line of lines) {
			assert.match(component, new RegExp(`\\[${line}, '(flow|violet)'\\]`), `module spec for line ${line} of ${program}`);
			for (const id of [`m-${program}${line}`, `on-${program}${line}`, `a-m${program}${line}`]) generated.add(id);
		}
	}
	for (const gate of ['gt-a7', 'gt-a14', 'gt-b3']) {
		assert.ok(component.includes(`id: '${gate}'`), `gate ${gate}`);
		for (const suffix of ['', '-bar', '-open']) generated.add(`${gate}${suffix}`);
	}
	for (let line = 1; line <= 23; line++) generated.add(`ln-${line}`);

	const known = (id) =>
		generated.has(id) || component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`) || component.includes(`id: '${id}'`) || component.includes(`file: '${id}'`);
	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			for (const id of [cue.el, ...(cue.to === 'all' ? [] : [cue.to].flat())].filter(Boolean)) {
				assert.ok(known(id), `the canvas lacks "${id}" (cue ${cue.do} of ${step.id})`);
			}
		}
	}
});

test('the editor holds the lesson functions and their real output', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	const program = (name) => component.split(`const ${name} = [`)[1].split('].join')[0].trim().split('\n');
	const sources = { progA: program('progA'), progB: program('progB'), progC: program('progC'), progD: program('progD') };
	assert.equal(sources.progA.length, 23, 'the first program fits in 23 lines');
	assert.equal(sources.progB.length, 18);
	assert.equal(sources.progC.length, 22);
	assert.equal(sources.progD.length, 13);
	assert.match(component, /highlightCode\(source, 'c'\)/, 'the editor uses C highlighting');
	for (const fragment of [
		'`typedef struct ${n.node} {`',
		'`    struct ${n.node} *${n.next};`',
		'`    ${n.node} *${n.local} = malloc(sizeof *${n.local});`',
		'`    if (${n.local} == NULL) { return NULL; }`',
		'`    ${n.fresh}->${n.next} = *${n.head};`',
		'`    *${n.head} = ${n.fresh};`',
		'`    ${n.last}->${n.next} = ${n.fresh};`',
		'`        ${n.prev}->${n.next} = ${n.cur}->${n.next};`',
		'`    free(${n.cur});`',
		'`        ${n.node} *${n.next} = ${n.cur}->${n.next};`',
		'`    *${n.head} = NULL;`',
		// Identifiers localized like the lesson.
		"t('Nodo', 'Node')",
		"t('dato', 'value')",
		"t('siguiente', 'next')",
		"t('cabeza', 'head')",
		"t('crear_nodo', 'create_node')",
		"t('insertar_al_inicio', 'insert_front')",
		"t('insertar_al_final', 'insert_back')",
		"t('eliminar', 'delete_value')",
		"t('destruir_lista', 'destroy_list')",
		"t('imprimir_lista', 'print_list')",
		// Real output of `cc -std=c23` on the lesson functions, in the order of the four programs.
		"'5 -> 3 -> 7 -> 9 -> NULL'",
		"'5 -> 3 -> 7 -> 9 -> 11 -> NULL'",
		"'5 -> 3 -> 9 -> 11 -> NULL'",
		"'3 -> 9 -> 11 -> NULL'",
		"text: 'NULL'",
		// Short fictional addresses that are not in order.
		"addr: '0x5010'",
		"addr: '0x5080'",
		"addr: '0x5030'",
		"addr: '0x5050'",
		"addr: '0x50a0'",
	]) {
		assert.ok(component.includes(fragment), `missing program fragment: ${fragment}`);
	}
	// Every line fits the editor (about 66 characters) in both languages.
	const longest = {};
	for (const [, key, es, en] of Array.from(component.matchAll(/^\t(\w+): t\('([^']*)', '([^']*)'\),$/gm))) {
		longest[key] = es.length >= en.length ? es : en;
	}
	for (const [name, lines] of Object.entries(sources)) {
		for (const line of lines) {
			let filled = line.trim().replace(/,$/, '').slice(1, -1);
			filled = filled.replace(/\$\{n\.(\w+)\}/g, (_, key) => longest[key] ?? `?${key}`);
			filled = filled.replace(/\$\{t\('([^']*)', '([^']*)'\)\}/g, (_, es, en) => (es.length >= en.length ? es : en));
			assert.doesNotMatch(filled, /\$\{|\?\w+/, `unfilled slot in ${name}: ${line}`);
			assert.ok(filled.length <= 66, `a program line is too long (${filled.length}): ${filled}`);
		}
	}
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/listas-enlazadas-c'/);
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
	assert.equal((component.match(/data-slug='listas-enlazadas-c'/g) ?? []).length, 4);
});

test('the thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#faf5ec', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `foreign color ${hex}`);
	assert.doesNotMatch(thumbnail, /#00203a|#f7038a/i, 'the film palette stays out of the lesson page');
});
