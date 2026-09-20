import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const JAVA_COURSE_DIR = 'src/content/courses/java';
const ALGORITHM_LESSON = '23-algoritmia-verificacion-y-complejidad';

async function readLesson(slug, lang) {
	return readFile(path.join(JAVA_COURSE_DIR, `${slug}.${lang}.md`), 'utf8');
}

function frontmatterValue(content, key) {
	const match = content.match(new RegExp(`^${key}:\\s*(?:'([^']*)'|([^\\n]+))$`, 'm'));
	assert.ok(match, `Expected ${key} in lesson frontmatter`);
	return (match[1] ?? match[2]).trim();
}

test('algorithm foundations lesson exists in Spanish and English at order 2', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(ALGORITHM_LESSON, 'es'),
		readLesson(ALGORITHM_LESSON, 'en'),
	]);

	assert.equal(frontmatterValue(spanish, 'slug'), ALGORITHM_LESSON);
	assert.equal(frontmatterValue(english, 'slug'), ALGORITHM_LESSON);
	assert.equal(frontmatterValue(spanish, 'lang'), 'es');
	assert.equal(frontmatterValue(english, 'lang'), 'en');
	assert.equal(Number(frontmatterValue(spanish, 'order')), 2);
	assert.equal(Number(frontmatterValue(english, 'order')), 2);
});

test('algorithm foundations lesson teaches specification, verification, and analysis in both locales', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(ALGORITHM_LESSON, 'es'),
		readLesson(ALGORITHM_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /specification|especificaci[oó]n/i, `${locale}: specification`);
		assert.match(content, /verification|verificaci[oó]n/i, `${locale}: verification`);
		assert.match(content, /correctness|correcci[oó]n/i, `${locale}: correctness`);
		assert.match(content, /efficiency|eficiencia/i, `${locale}: efficiency`);
		assert.match(content, /time complexity|complejidad temporal/i, `${locale}: time analysis`);
		assert.match(content, /space complexity|complejidad espacial/i, `${locale}: space analysis`);
		assert.match(content, /O\(1\)/, `${locale}: constant complexity`);
		assert.match(content, /O\(log n\)/, `${locale}: logarithmic complexity`);
		assert.match(content, /O\(n\)/, `${locale}: linear complexity`);
		assert.match(content, /O\(n log n\)/, `${locale}: linearithmic complexity`);
		assert.match(content, /O\(n²\)/, `${locale}: quadratic complexity`);
		assert.match(content, /IllegalArgumentException/, `${locale}: invalid-input handling`);
	}
});

test('Java lesson orders remain bilingual, unique, and contiguous', async () => {
	const files = (await readdir(JAVA_COURSE_DIR)).filter((file) => /\.(es|en)\.md$/.test(file));
	const lessons = await Promise.all(
		files.map(async (file) => ({ file, content: await readFile(path.join(JAVA_COURSE_DIR, file), 'utf8') })),
	);

	for (const lang of ['es', 'en']) {
		const localized = lessons.filter(({ file }) => file.endsWith(`.${lang}.md`));
		const orders = localized.map(({ content }) => Number(frontmatterValue(content, 'order'))).sort((a, b) => a - b);
		assert.deepEqual(orders, Array.from({ length: localized.length }, (_, index) => index + 1));
	}

	const spanishOrders = new Map(
		lessons
			.filter(({ file }) => file.endsWith('.es.md'))
			.map(({ content }) => [frontmatterValue(content, 'slug'), frontmatterValue(content, 'order')]),
	);
	for (const { content } of lessons.filter(({ file }) => file.endsWith('.en.md'))) {
		assert.equal(
			frontmatterValue(content, 'order'),
			spanishOrders.get(frontmatterValue(content, 'slug')),
			`Expected ES/EN order parity for ${frontmatterValue(content, 'slug')}`,
		);
	}
});
