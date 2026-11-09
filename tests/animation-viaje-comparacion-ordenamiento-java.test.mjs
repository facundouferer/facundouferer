import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { animations, getAnimationsForLesson, getLessonForAnimation } from '../src/data/animations.ts';
import { script } from '../src/data/animations/viaje-comparacion-ordenamiento-java.ts';
import { resolveScript, validateScript, cueEnd } from '../src/utils/animations.ts';

const SLUG = 'viaje-comparacion-ordenamiento-java';
const LESSON = '14-iteradores-ordenamiento-equals-hashcode';
// The lesson frontmatter slug (LESSON) differs from the file name (FILE).
const FILE = '16-iteradores-ordenamiento-equals-hashcode';
const COMPONENT = `src/components/animaciones/${SLUG}.astro`;

test(`catalog binds ${SLUG} to java/${LESSON}, next to the step-by-step animation`, () => {
	const animation = animations.find((entry) => entry.slug === SLUG);
	assert.ok(animation);
	assert.deepEqual(animation.lesson, { course: 'java', slug: LESSON });
	assert.deepEqual(
		getAnimationsForLesson('java', LESSON).map((entry) => entry.slug),
		['iteradores-ordenamiento-java', SLUG],
	);
	assert.deepEqual(getLessonForAnimation(SLUG), { course: 'java', slug: LESSON });
	assert.ok(existsSync(`public${animation.image}`));
	assert.ok(existsSync(`src/content/courses/java/${FILE}.es.md`));
	assert.ok(existsSync(`src/content/courses/java/${FILE}.en.md`));
});

test('script is valid: six scenes played as motion steps on one canvas', () => {
	assert.deepEqual(validateScript(script), []);
	assert.deepEqual(
		script.chapters.map((chapter) => chapter.id),
		['list', 'reject', 'comparable', 'compare', 'comparator', 'recap'],
	);
	assert.deepEqual(
		script.steps.map((step) => step.id),
		['build', 'reject', 'contract', 'first', 'rest', 'outside', 'pages', 'recap'],
	);
	for (const chapter of script.chapters) {
		assert.ok(script.steps.some((step) => step.chapter === chapter.id), `chapter ${chapter.id} has a step`);
	}
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

test('narration answers the six questions of the film in neutral Spanish', () => {
	const all = resolveScript(script, 'es')
		.steps.map((step) => `${step.title} ${step.text}`)
		.join('\n');
	for (const concept of [
		// 1. Why can a list of our own objects not be sorted?
		'Java lo rechaza',
		'no es `Comparable`',
		'no puede adivinarlo',
		// 2. What does implementing Comparable give the class?
		'implementa `Comparable`',
		'orden natural',
		// 3. What does compareTo answer?
		'compareTo',
		'negativo',
		'cero',
		'positivo',
		// 4. What part of the answer matters, and how does the sort use it?
		'solo importa el signo',
		'cambia de lugar',
		'no se mueve',
		'ordenada por título',
		// 5. What is a Comparator?
		'Comparator',
		'fuera de la clase',
		'no se toca',
		'ordenada por páginas',
		// 6. When is each one used?
		'de a pares',
		'Solo hay uno',
		'tantos como se necesiten',
	]) {
		assert.ok(all.toLowerCase().includes(concept.toLowerCase()), `narration should mention ${concept}`);
	}
	// Neutral Latin American Spanish: no voseo.
	assert.doesNotMatch(all, /\b(mirá|fijate|pensá|tenés|podés|querés|sabés|usá|creá|hacé)\b/i);

	const english = resolveScript(script, 'en')
		.steps.map((step) => step.text)
		.join('\n');
	for (const concept of ['natural order', 'Only the sign matters', 'outside the class', 'as many as needed']) {
		assert.ok(english.includes(concept), `English narration should mention ${concept}`);
	}
});

// `String.compareTo`: the difference of the first pair of different characters.
const compareTo = (a, b) => {
	for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
		if (a[i] !== b[i]) return a.charCodeAt(i) - b.charCodeAt(i);
	}
	return a.length - b.length;
};

test('every comparison shown is the one Java would answer, and both sorts end in the right order', () => {
	const books = {
		'bk-r': { title: { es: 'Rayuela', en: 'Hopscotch' }, pages: 736 },
		'bk-n': { title: { es: '1984', en: '1984' }, pages: 328 },
		'bk-f': { title: { es: 'Ficciones', en: 'Fictions' }, pages: 174 },
	};
	const cuesOf = (...ids) => script.steps.filter((step) => ids.includes(step.id)).flatMap((step) => step.motion.cues);

	// The list is the three positions of the shelf; a book moves when a cue sends it to `s-N`.
	const shelf = ['bk-r', 'bk-n', 'bk-f'];
	const play = (cues) => {
		for (const cue of cues) {
			if (cue.do === 'move' && cue.el in books) shelf[Number(cue.to.replace('s-', ''))] = cue.el;
		}
		assert.equal(new Set(shelf).size, 3, 'no book is lost or duplicated');
		return [...shelf];
	};
	const answers = (cues) => cues.filter((cue) => cue.do === 'enter' && cue.el.startsWith('ans-')).map((cue) => cue.el);

	const titleSort = cuesOf('first', 'rest');
	const byTitle = play(titleSort);
	assert.deepEqual(byTitle, ['bk-n', 'bk-f', 'bk-r']);
	assert.deepEqual(answers(titleSort), ['ans-neg', 'ans-neg', 'ans-pos']);

	const pagesSort = cuesOf('pages');
	const byPages = play(pagesSort);
	assert.deepEqual(byPages, ['bk-f', 'bk-n', 'bk-r']);
	assert.deepEqual(answers(pagesSort), ['ans-neg', 'ans-pos']);

	// The same must hold for the localized titles: the lesson translates them.
	for (const lang of ['es', 'en']) {
		const title = (id) => books[id].title[lang];
		assert.ok(compareTo(title('bk-n'), title('bk-r')) < 0, `${lang}: 1984 goes before ${title('bk-r')}`);
		assert.ok(compareTo(title('bk-f'), title('bk-r')) < 0, `${lang}: ${title('bk-f')} goes before ${title('bk-r')}`);
		assert.ok(compareTo(title('bk-f'), title('bk-n')) > 0, `${lang}: ${title('bk-f')} goes after 1984`);
		assert.deepEqual(byTitle, Object.keys(books).sort((a, b) => compareTo(title(a), title(b))), `${lang}: natural order`);
	}
	assert.ok(Math.sign(books['bk-f'].pages - books['bk-n'].pages) < 0);
	assert.ok(Math.sign(books['bk-r'].pages - books['bk-n'].pages) > 0);
	assert.deepEqual(byPages, Object.keys(books).sort((a, b) => books[a].pages - books[b].pages));

	// Nothing runs while the class is not Comparable: the flow first appears once compareTo exists.
	const before = cuesOf('build', 'reject', 'contract');
	assert.ok(before.every((cue) => cue.el !== 'p' && cue.el !== 'hl'), 'the rejected program never executes');
	assert.ok(before.some((cue) => cue.do === 'enter' && cue.el === 'm-cto'));
});

test('every scene and cue target exists in the component', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.equal((component.match(/data-scene="/g) ?? []).length, 1);
	assert.match(component, /data-scene="journey" data-motion/);

	// Ids written in the markup, listed in the frontmatter (`id: 'a-sort'`, `result('r1', …)`)
	// or built in a loop (`ea-${n}`) count as present.
	const known = (id) => {
		if (component.includes(`data-el="${id}"`) || component.includes(`data-anchor="${id}"`)) return true;
		if (component.includes(`'${id}'`)) return true;
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

	// Camera and `move` targets are fixed anchors, never elements that travel.
	const travellers = new Set(script.steps.flatMap((step) => step.motion.cues.filter((cue) => cue.do === 'move').map((cue) => cue.el)));
	for (const step of script.steps) {
		for (const cue of step.motion.cues) {
			if (cue.do === 'move') assert.match(cue.to, /^(a|s|l)-/, `${cue.el} moves to an anchor`);
			if (cue.do === 'camera' && cue.to !== 'all') {
				for (const target of cue.to) assert.ok(target.startsWith('shot-') && !travellers.has(target));
			}
		}
	}
});

test('the code in the canvas is the program the narration describes', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	for (const fragment of [
		'` implements Comparable<${names.cls}>`',
		'    @Override',
		'    public int compareTo(${names.cls} ${names.other}) {',
		'        return this.${names.title}.compareTo(${names.other}.${names.title});',
		'List<${names.cls}> ${names.list} = new ArrayList<>(List.of(',
		'Collections.sort(${names.list});',
		'${names.list}.sort(Comparator.comparingInt(${names.cls}::${names.getPages}));',
		"t('Libro', 'Book')",
		"t('Rayuela', 'Hopscotch')",
		"t('Ficciones', 'Fictions')",
		"t('getPaginas', 'getPages')",
	]) {
		assert.ok(component.includes(fragment), `missing code fragment: ${fragment}`);
	}
	// The results on screen are computed from the titles and pages, not typed by hand.
	assert.match(component, /byTitle\(orwell, rayuela\)/);
	assert.match(component, /byPages\(ficciones, orwell\)/);
	assert.match(component, /\[\.\.\.books\]\.sort\(byTitle\)/);
	assert.match(component, /\[\.\.\.books\]\.sort\(byPages\)/);
});

test('component mounts the player on a 16:9 canvas and keeps its palette in one token block', async () => {
	const component = await readFile(COMPONENT, 'utf8');
	assert.match(component, /import AnimationPlayer from '\.\.\/animations\/AnimationPlayer\.astro'/);
	assert.match(component, /import { script } from '\.\.\/\.\.\/data\/animations\/viaje-comparacion-ordenamiento-java'/);
	assert.match(component, /@import '\.\.\/\.\.\/styles\/animation-scene\.css'/);
	assert.equal((component.match(/slot="scene"/g) ?? []).length, 1);
	assert.match(component, /<svg class="mg-canvas xj-canvas" viewBox="0 0 1280 720"/);
	assert.match(component, /stroke-width="2\.75"/, 'icons use the Lucide stroke');
	assert.match(component, /<g class="mg-camera" data-camera>/);
	assert.doesNotMatch(component, /<filter|filter=/, 'no SVG filters');
	assert.match(component, /\.anim-player\[data-slug='viaje-comparacion-ordenamiento-java'\]/);

	// Approved palette exception (DESIGN.md §8): raw colors only as `--xj-*` token values.
	const hexLines = component.split('\n').filter((line) => /(?<!&)#[0-9a-fA-F]{3,8}\b/.test(line));
	assert.equal(hexLines.length, 18, 'the token block of the films, whole');
	for (const line of hexLines) assert.match(line, /^\s*--xj-[a-z-]+: #[0-9a-f]{6};$/, `raw color outside the token block: ${line.trim()}`);
	assert.match(component, /--xj-deep: #00203a;/, 'deep blue of the films');
	assert.match(component, /--xj-flow: #5fd4ff;/, 'light blue of the normal flow');
	assert.match(component, /--xj-magenta: #f7038a;/, 'magenta of the problem');
	assert.match(component, /--xj-violet: #8b5cf6;/, 'violet of what resolves it');
	assert.doesNotMatch(component, /var\(--color-/, 'the film does not mix Organic colors into its palette');
	for (const family of component.match(/font-family: [^;]+;/g) ?? []) {
		assert.match(family, /^font-family: (var\(--font-body\)|monospace);$/, `unexpected font: ${family}`);
	}
});

test('the card thumbnail stays in the Organic palette', async () => {
	const thumbnail = await readFile(`public/img/animations/${SLUG}.svg`, 'utf8');
	const organic = new Set(['#f1e8d9', '#2e2b25', '#c0714a', '#e8a27c', '#7d9a76', '#faf5ec']);
	for (const hex of thumbnail.match(/#[0-9a-fA-F]{6}\b/g) ?? []) assert.ok(organic.has(hex.toLowerCase()), `${hex} is not an Organic color`);
	assert.doesNotMatch(thumbnail, /#5fd4ff|#f7038a|#8b5cf6/i);
});
