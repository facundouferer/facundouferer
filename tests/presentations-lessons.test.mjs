import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const DATA_MODULE_PATH = '../src/data/presentations.ts';

/**
 * Reads a lesson markdown file's frontmatter fields relevant to this test:
 * course, slug and lang. Mirrors the light-weight frontmatter parsing already
 * used across tests/courses-*.test.mjs (regex on raw text, no YAML parser).
 */
function parseLessonFrontmatter(content) {
	const course = content.match(/^course:\s*'([^']+)'/m)?.[1];
	const slug = content.match(/^slug:\s*'([^']+)'/m)?.[1];
	const lang = content.match(/^lang:\s*'([^']+)'/m)?.[1];
	return { course, slug, lang };
}

/**
 * Finds the lesson file (in either locale) under src/content/courses/<course>
 * whose frontmatter slug matches lessonSlug. Filenames carry a numeric prefix
 * for some courses (e.g. C) that the frontmatter slug omits, so matching is
 * done by reading frontmatter rather than by filename.
 */
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

let dataModule;

test('src/data/presentations.ts can be loaded and exports the presentations catalog', async () => {
	dataModule = await import(DATA_MODULE_PATH);
	assert.ok(Array.isArray(dataModule.presentations));
	assert.equal(dataModule.presentations.length, 22);
});

test('src/data/presentations.ts exports the required helper functions', async () => {
	const content = await readFile('src/data/presentations.ts', 'utf8');
	assert.match(content, /export function getPresentationsForLesson/);
	assert.match(content, /export function getPresentationCountsForCourse/);
	assert.match(content, /export function getLessonForPresentation/);
});

test('every presentation has a lesson reference with course and slug', () => {
	for (const presentation of dataModule.presentations) {
		assert.ok(presentation.lesson, `Presentation "${presentation.slug}" is missing a lesson reference`);
		assert.equal(typeof presentation.lesson.course, 'string');
		assert.ok(presentation.lesson.course.length > 0, `Presentation "${presentation.slug}" has an empty lesson.course`);
		assert.equal(typeof presentation.lesson.slug, 'string');
		assert.ok(presentation.lesson.slug.length > 0, `Presentation "${presentation.slug}" has an empty lesson.slug`);
	}
});

test('each presentation slug is unique', () => {
	const slugs = dataModule.presentations.map((presentation) => presentation.slug);
	const uniqueSlugs = new Set(slugs);
	assert.equal(uniqueSlugs.size, slugs.length, 'Duplicate presentation slugs found');
});

test('every lesson reference resolves to an existing bilingual lesson file with matching frontmatter slug', async () => {
	const checked = new Map();

	for (const presentation of dataModule.presentations) {
		const { course, slug } = presentation.lesson;
		const key = `${course}/${slug}`;
		if (!checked.has(key)) {
			checked.set(key, await findLessonFiles(course, slug));
		}
		const files = checked.get(key);

		assert.ok(
			files.es,
			`Presentation "${presentation.slug}" references ${key}, but no *.es.md lesson with that frontmatter slug exists`,
		);
		assert.ok(
			files.en,
			`Presentation "${presentation.slug}" references ${key}, but no *.en.md lesson with that frontmatter slug exists`,
		);
	}
});

test('getPresentationsForLesson returns c/cadenas-de-caracteres-y-operaciones presentations in catalog order', () => {
	const result = dataModule.getPresentationsForLesson('c', 'cadenas-de-caracteres-y-operaciones');
	assert.deepEqual(
		result.map((presentation) => presentation.slug),
		['string-paso-a-paso', 'string-numeros-paso-a-paso', 'strchr-paso-a-paso', 'contar-palabras-cadenas-c'],
	);
});

test('getPresentationsForLesson returns c/sentencia-if-else presentations in catalog order', () => {
	const result = dataModule.getPresentationsForLesson('c', 'sentencia-if-else');
	assert.deepEqual(
		result.map((presentation) => presentation.slug),
		['if-paso-a-paso', 'if-else-paso-a-paso'],
	);
});

test('getPresentationsForLesson returns java/05-metodos-y-funciones presentation', () => {
	const result = dataModule.getPresentationsForLesson('java', '05-metodos-y-funciones');
	assert.deepEqual(
		result.map((presentation) => presentation.slug),
		['funciones_y_procedimientos_java'],
	);
});

test('getPresentationsForLesson returns an empty array for an unmapped lesson', () => {
	const result = dataModule.getPresentationsForLesson('c', 'this-lesson-has-no-presentations');
	assert.deepEqual(result, []);
});

test('getPresentationCountsForCourse counts presentations per lesson slug for the c course', () => {
	const counts = dataModule.getPresentationCountsForCourse('c');
	assert.equal(counts['cadenas-de-caracteres-y-operaciones'], 4);
	assert.equal(counts['sentencia-if-else'], 2);
	assert.equal(counts['ordenacion-de-arreglos'], 3);
	assert.equal(counts['variables-y-constantes'], 1);
});

test('getLessonForPresentation resolves the lesson reference for a known presentation', () => {
	const lesson = dataModule.getLessonForPresentation('arboles-binarios');
	assert.deepEqual(lesson, { course: 'c', slug: 'arboles-binarios' });
});

test('getLessonForPresentation returns undefined for an unknown presentation slug', () => {
	const lesson = dataModule.getLessonForPresentation('this-presentation-does-not-exist');
	assert.equal(lesson, undefined);
});
