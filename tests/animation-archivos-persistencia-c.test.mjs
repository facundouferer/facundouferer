import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/archivos-persistencia-c.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'archivos-persistencia-c';
const LESSON = 'archivos';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '35-archivos';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);
const stopsOf = (cues, el) => cues.filter((cue) => cue.do === 'move' && cue.el === el).map((cue) => cue.to);

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
		['open', 'write', 'bytes', 'read', 'eof', 'close'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['fail', 'open', 'write', 'bytes', 'read', 'eof', 'close', 'whole'],
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
		console.log(`# ${lang}: ${(total / 1000).toFixed(1)} s`);
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

test('narration answers the six questions of the brief in neutral Spanish', () => {
	const all = resolveScript(script, 'es')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n')
		.toLowerCase();
	const concepts = [
		// 1. what fopen returns and why it is checked
		'`fopen`',
		'`file *`',
		'devuelve `null`',
		'`perror`',
		'se comprueba',
		'distinto de `null`',
		// 2. how fwrite and fread move records
		'`fwrite` envía bytes',
		'`uint32_t`',
		'cabecera',
		'los tres registros',
		'`fread` lee la cabecera',
		'un registro por vuelta',
		// 3. why the returned count is compared
		'devuelve cuántos elementos escribió',
		'se compara con lo pedido',
		'devuelve 1 y se compara con el 1 pedido',
		// 4. end of file versus error
		'`feof`',
		'`ferror`',
		'no predice el futuro',
		'devuelve 0, no 1',
		'recién ahora se pregunta por qué',
		'`feof` es el fin; `ferror`, un error',
		// 5. text versus binary
		'archivo binario',
		'cuatro caracteres',
		'bytes del `int`',
		// 6. close on every path
		'`fclose`',
		'todos pasan por `fclose`',
		'ya no es válido',
		'cada paso se verifica',
		'se comprueba todo',
	];
	for (const concept of concepts) assert.ok(all.includes(concept), `narration should mention ${concept}`);
	// Neutral Latin American Spanish: no voseo imperatives.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés)\b/i);
});

test('narration covers the same questions in English', () => {
	const all = resolveScript(script, 'en')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n')
		.toLowerCase();
	for (const concept of [
		'returns `null`',
		'`perror` gives the reason',
		'the `uint32_t` header',
		'compared with what was asked',
		'returns 1, compared with the 1 asked',
		'does not predict the future',
		'returns 0, not 1',
		'a binary file',
		'four characters',
		'go through `fclose`',
		'no longer valid',
	]) {
		assert.ok(all.includes(concept), `narration should mention ${concept}`);
	}
});

test('the fourth read is the one that fails, and only then are feof and ferror asked', () => {
	const eofCues = cuesOf('eof');
	const at = (kind, el) => eofCues.find((cue) => cue.do === kind && cue.el === el)?.at;
	// The loop condition fails first (cr-0), the indicators are checked afterwards (lines 15 and 16).
	assert.ok(at('enter', 'cr-0') < at('move', 'p'), 'the failed count shows before the checks run');
	assert.deepEqual(
		stopsOf(eofCues, 'p'),
		['a-m15', 'a-m16'],
	);
	// feof lights only once the read has failed.
	assert.ok(at('enter', 'lp-feof-on') > at('enter', 'cr-0'));
	assert.ok(at('enter', 'lp-ferror-on') > at('enter', 'lp-feof-on'));
	// The position marker advances one record per read: header, then three records.
	assert.deepEqual(stopsOf(cuesOf('read'), 'cur'), ['a-cur-1', 'a-cur-2', 'a-cur-3', 'a-cur-4']);
});

test('the film closes on every path: three routes converge on the fclose module', () => {
	const closeCues = cuesOf('close');
	const drawn = closeCues.filter((cue) => cue.do === 'draw').map((cue) => cue.el);
	assert.deepEqual(drawn, ['cv-1', 'cv-2', 'cv-3']);
	assert.ok(closeCues.some((cue) => cue.do === 'enter' && cue.el === 'm-17'));
	assert.ok(closeCues.some((cue) => cue.do === 'exit' && cue.el === 'fl-chan'), 'the channel is released');
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids built in a loop (`m-${n}`) or listed in the frontmatter (`id: 'ed-1a'`) count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`id: '${id}'`) || component.includes(`'${id}'`)) return true;
		const prefix = id.replace(/(\d+)x?$/, '');
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

test('the code in the canvas is the program the narration describes', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		"`const char *${R} = \"${names.bad}\";`",
		"`const char *${R} = \"${names.file}\";`",
		'FILE *${F} = fopen(${R}, "wb");',
		'if (${F} == NULL) { perror(${R}); return EXIT_FAILURE; }',
		'uint32_t n = 3;',
		'bool ok = fwrite(&n, sizeof n, 1, ${F}) == 1',
		'fwrite(${names.list}, sizeof *${names.list}, n, ${F}) == n;',
		'if (fclose(${F}) == EOF || !ok) { return EXIT_FAILURE; }',
		'${F} = fopen(${R}, "rb");',
		'ok = fread(&n, sizeof n, 1, ${F}) == 1;',
		'while (ok && fread(&p, sizeof p, 1, ${F}) == 1) {',
		'if (ferror(${F})) { perror(${R}); }',
		'else if (feof(${F})) { puts("${names.end}"); }',
		'fclose(${F});',
		"t('Yerba', 'Tea')",
		"t('Fin del archivo', 'End of file')",
		"t('no-existe/productos.dat', 'missing/products.dat')",
		'No such file or directory',
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	assert.match(component, /highlightCode\(line\.src, 'c'\)/, 'the editor uses the shared C highlighter');
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/archivos-persistencia-c'/);
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
