import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const DATA_MODULE_PATH = '../src/data/animations.ts';

function parseLessonFrontmatter(content) {
	const course = content.match(/^course:\s*'([^']+)'/m)?.[1];
	const slug = content.match(/^slug:\s*'([^']+)'/m)?.[1];
	const lang = content.match(/^lang:\s*'([^']+)'/m)?.[1];
	return { course, slug, lang };
}

async function findLessonFiles(course, lessonSlug) {
	const dir = `src/content/courses/${course}`;
	let files;
	try {
		files = await readdir(dir);
	} catch {
		return { es: undefined, en: undefined };
	}

	const result = { es: undefined, en: undefined };
	for (const file of files) {
		if (!file.endsWith('.es.md') && !file.endsWith('.en.md')) continue;
		const content = await readFile(`${dir}/${file}`, 'utf8');
		const frontmatter = parseLessonFrontmatter(content);
		if (frontmatter.course === course && frontmatter.slug === lessonSlug) {
			if (frontmatter.lang === 'es') result.es = `${dir}/${file}`;
			if (frontmatter.lang === 'en') result.en = `${dir}/${file}`;
		}
	}
	return result;
}

/** PascalCase component name derived from an animation slug, as the pages import it. */
function componentNameFor(slug) {
	return slug
		.split(/[-_]/)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

let dataModule;

test('src/data/animations.ts loads and exports the animations catalog with helpers', async () => {
	dataModule = await import(DATA_MODULE_PATH);
	assert.ok(Array.isArray(dataModule.animations));
	assert.ok(dataModule.animations.length >= 1);
	assert.equal(typeof dataModule.getAnimationsForLesson, 'function');
	assert.equal(typeof dataModule.getAnimationCountsForCourse, 'function');
	assert.equal(typeof dataModule.getLessonForAnimation, 'function');
});

test('every animation carries a lesson reference, bilingual copy and a card image', () => {
	for (const animation of dataModule.animations) {
		assert.ok(animation.lesson, `Animation "${animation.slug}" is missing a lesson reference`);
		assert.ok(animation.lesson.course.length > 0);
		assert.ok(animation.lesson.slug.length > 0);
		for (const lang of ['es', 'en']) {
			assert.ok(animation.title[lang], `Animation "${animation.slug}" lacks title.${lang}`);
			assert.ok(animation.description[lang], `Animation "${animation.slug}" lacks description.${lang}`);
			assert.ok(animation.tag[lang], `Animation "${animation.slug}" lacks tag.${lang}`);
		}
		assert.ok(Number.isInteger(animation.minutes) && animation.minutes > 0);
		assert.ok(existsSync(`public${animation.image}`), `Card image ${animation.image} is missing`);
	}
});

test('animation slugs are unique', () => {
	const slugs = dataModule.animations.map((animation) => animation.slug);
	assert.equal(new Set(slugs).size, slugs.length);
});

test('every lesson reference resolves to an es + en lesson with matching frontmatter slug', async () => {
	for (const animation of dataModule.animations) {
		const { course, slug } = animation.lesson;
		const files = await findLessonFiles(course, slug);
		assert.ok(files.es, `Animation "${animation.slug}" references ${course}/${slug} but no *.es.md lesson matches`);
		assert.ok(files.en, `Animation "${animation.slug}" references ${course}/${slug} but no *.en.md lesson matches`);
	}
});

test('helpers mirror the presentations catalog semantics', () => {
	const { animations, getAnimationsForLesson, getAnimationCountsForCourse, getLessonForAnimation } = dataModule;
	const first = animations[0];

	const forLesson = getAnimationsForLesson(first.lesson.course, first.lesson.slug);
	assert.ok(forLesson.some((animation) => animation.slug === first.slug));
	assert.deepEqual(getAnimationsForLesson('nope', 'nope'), []);

	const counts = getAnimationCountsForCourse(first.lesson.course);
	assert.ok(counts[first.lesson.slug] >= 1);
	assert.equal(getAnimationCountsForCourse('nope')[first.lesson.slug], undefined);

	assert.deepEqual(getLessonForAnimation(first.slug), first.lesson);
	assert.equal(getLessonForAnimation('unknown-animation'), undefined);
});

test('both animation detail pages import and map every animation component', async () => {
	for (const file of ['src/pages/animaciones/[slug].astro', 'src/pages/[lang]/animaciones/[slug].astro']) {
		assert.ok(existsSync(file), `${file} is missing`);
		const content = await readFile(file, 'utf8');
		assert.doesNotMatch(content, /AnimationLessonLink/, `${file} leaves the lesson link to the player controls`);
		for (const animation of dataModule.animations) {
			const name = componentNameFor(animation.slug);
			assert.ok(
				existsSync(`src/components/animaciones/${animation.slug}.astro`),
				`src/components/animaciones/${animation.slug}.astro is missing`,
			);
			assert.match(content, new RegExp(`import ${name} from `), `${file} should import ${name}`);
			assert.match(content, new RegExp(`'${animation.slug}':\\s*${name}`), `${file} should map '${animation.slug}'`);
		}
	}
});

test('the player links back to the owning lesson from its controls', async () => {
	assert.equal(existsSync('src/components/AnimationLessonLink.astro'), false, 'the "Part of" kicker is gone');
	const player = await readFile('src/components/animations/AnimationPlayer.astro', 'utf8');
	assert.match(player, /getLessonForAnimation\(slug\)/);
	assert.match(player, /`\/cursos\/\$\{lessonRef\.course\}\/\$\{lessonRef\.slug\}`/);
	assert.match(player, /`\/en\/courses\/\$\{lessonRef\.course\}\/\$\{lessonRef\.slug\}`/);
	assert.match(player, /<a class="btn btn-ghost anim-back" href=\{lessonHref\}/);
	assert.match(player, /t\('animations\.controls\.backToLesson'\)/);
});

test('lesson pages (es + en) wire the animations menu, section and sidebar count', async () => {
	const pages = [
		{ file: 'src/pages/cursos/[course]/[lesson].astro', locale: 'es' },
		{ file: 'src/pages/en/courses/[course]/[lesson].astro', locale: 'en' },
	];
	for (const { file, locale } of pages) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /import LessonAnimations from /, `${file} imports LessonAnimations`);
		assert.match(content, /import LessonAnimationsMenu from /, `${file} imports LessonAnimationsMenu`);
		assert.match(content, /getAnimationCountsForCourse, getAnimationsForLesson/, `${file} imports the helpers`);
		assert.match(content, /lessonAnimations\.length > 0/, `${file} guards the menu`);
		assert.match(content, new RegExp(`<LessonAnimationsMenu animations=\\{lessonAnimations\\} locale="${locale}"`));
		assert.match(content, new RegExp(`<LessonAnimations animations=\\{lessonAnimations\\} locale="${locale}"`));
		assert.match(content, /animationCount: animationCounts\[l\.data\.slug\]/, `${file} feeds the sidebar badge`);
	}
});

test('course index pages (es + en) feed the animation-count badge to LessonsList', async () => {
	for (const file of ['src/pages/cursos/[course]/index.astro', 'src/pages/en/courses/[course]/index.astro']) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /import { getAnimationCountsForCourse } from /, `${file} imports the helper`);
		assert.match(content, /const animationCounts = getAnimationCountsForCourse\(courseSlug\)/, `${file} computes counts`);
		assert.match(content, /animationCount: animationCounts\[l\.data\.slug\]/, `${file} passes the count`);
	}
});

test('animation detail pages render the player full-bleed in a viewport-filling column', async () => {
	for (const file of ['src/pages/animaciones/[slug].astro', 'src/pages/[lang]/animaciones/[slug].astro']) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /<div class="animation-page">/, `${file} drops the width-capped .container`);
		assert.match(content, /min-height: calc\(100dvh - var\(--site-header-height, 0px\)\)/, `${file} fills the viewport`);
		assert.match(content, /flex-direction: column/, `${file} lets the player grow`);
	}
	const player = await readFile('src/components/animations/AnimationPlayer.astro', 'utf8');
	assert.match(player, /\.anim-player \{\n\t\tflex: 1;\n\t\tdisplay: grid;\n\t\tgrid-template-rows: 1fr auto;/, 'controls take the last row');
});

test('LessonsList renders an animation-count badge with the Lucide clapperboard icon', async () => {
	const content = await readFile('src/components/LessonsList.astro', 'utf8');
	assert.match(content, /animationCount\?: number/);
	assert.match(content, /lesson-animation-badge/);
	assert.match(content, /courses\.lessonAnimations\.badge\.one/);
	assert.match(content, /M20\.2 6 3 11l-\.9-2\.4/, 'uses the Lucide clapperboard path');
});

test('i18n dictionaries carry the animation keys in both locales', async () => {
	const es = JSON.parse(await readFile('src/i18n/es.json', 'utf8'));
	const en = JSON.parse(await readFile('src/i18n/en.json', 'utf8'));
	for (const dict of [es, en]) {
		assert.ok(dict.courses?.lessonAnimations?.badge?.one);
		assert.ok(dict.courses?.lessonAnimations?.badge?.other);
		assert.ok(dict.courses?.lessonAnimations?.heading);
		assert.ok(dict.courses?.lessonAnimations?.menuButtonLabel);
		assert.ok(dict.courses?.lessonAnimations?.menuHeading);
		assert.ok(dict.animations?.stage);
		assert.ok(dict.animations?.controls?.backToLesson);
		for (const removed of ['kicker', 'chapters', 'keyboardHint', 'partOf']) {
			assert.equal(dict.animations?.[removed], undefined, `animations.${removed} is no longer rendered`);
		}
		assert.ok(dict.animations?.card?.open);
		assert.ok(dict.animations?.card?.minutes);
		for (const key of ['prev', 'next', 'play', 'pause', 'restart']) {
			assert.ok(dict.animations?.controls?.[key], `controls.${key}`);
		}
		assert.ok(dict.animations?.stepCounter?.label);
		assert.ok(dict.animations?.stepCounter?.of);
	}
});

test('new animation components contain no raw hex colors (tokens only)', async () => {
	// Approved palette exception (DESIGN.md §8): this film declares its own `--xj-*`
	// tokens. Its own test checks that raw colors appear only in that token block.
	const paletteExceptions = new Set(['viaje-excepcion-java.astro']);
	const files = [
		'src/components/animations/AnimationPlayer.astro',
		'src/components/LessonAnimations.astro',
		'src/components/LessonAnimationsMenu.astro',
		'src/styles/animation-scene.css',
		...(await readdir('src/components/animaciones')).filter((file) => !paletteExceptions.has(file)).map((file) => `src/components/animaciones/${file}`),
	];
	for (const file of files) {
		assert.ok(existsSync(file), `${file} is missing`);
		const content = await readFile(file, 'utf8');
		const hexes = content.match(/(?<!&)#[0-9a-fA-F]{3,8}\b/g) ?? [];
		assert.deepEqual(hexes, [], `${file} must use Organic tokens, found ${hexes.join(', ')}`);
	}
});
